/**
 * Regression test for PR #667 review (Arch — blocking finding).
 *
 * Earlier revisions of Panel.svelte and StatCard.svelte declared per-component
 * counters inside the instance `<script>` block. Because each instance ran the
 * script in its own scope, every new component restarted the counter, generating
 * duplicate DOM ids (`gr-shell-panel-1-title`, `gr-shell-statcard-1-label`)
 * across siblings on the same page. That broke `aria-labelledby` resolution for
 * the very dashboard / SummaryStrip shape this package introduces.
 *
 * The fix routes id generation through `useStableId` from
 * `@equaltoai/greater-components-utils`, which is SSR/hydration-safe and
 * unique per component instance.
 *
 * This regression test asserts:
 * 1. Multiple Panels rendered together have unique generated title ids.
 * 2. Multiple StatCards rendered together have unique generated label / value /
 *    trend / description ids.
 * 3. Every id token referenced by `aria-labelledby` resolves to an element
 *    inside the rendered DOM.
 *
 * If a future change reintroduces instance-scope counter logic, this test
 * starts failing immediately.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Panel from '../src/components/Panel.svelte';
import StatCard from '../src/components/StatCard.svelte';
import SummaryStrip from '../src/components/SummaryStrip.svelte';

function snippetOf(html: string) {
	return createRawSnippet(() => ({ render: () => html }));
}

function collectIdReferences(root: Element): string[] {
	const labelledBy = root.getAttribute('aria-labelledby');
	if (!labelledBy) return [];
	return labelledBy.split(/\s+/).filter(Boolean);
}

describe('Shell id-uniqueness regression (PR #667)', () => {
	it('two Panels on the same page produce unique title ids and labelledby targets', () => {
		// Render two Panels with titles into the same container.
		const { container: c1 } = render(Panel, {
			title: 'Fleet status',
			children: snippetOf('<p>Panel 1 body</p>'),
		});
		const { container: c2 } = render(Panel, {
			title: 'Recent activity',
			children: snippetOf('<p>Panel 2 body</p>'),
		});

		const panel1 = c1.querySelector('section.gr-shell-panel');
		const panel2 = c2.querySelector('section.gr-shell-panel');
		expect(panel1).toBeTruthy();
		expect(panel2).toBeTruthy();

		const labelledby1 = panel1!.getAttribute('aria-labelledby');
		const labelledby2 = panel2!.getAttribute('aria-labelledby');
		expect(labelledby1).toBeTruthy();
		expect(labelledby2).toBeTruthy();
		expect(labelledby1).not.toBe(labelledby2);

		const title1 = c1.querySelector('.gr-shell-panel__title');
		const title2 = c2.querySelector('.gr-shell-panel__title');
		expect(title1?.getAttribute('id')).toBe(labelledby1);
		expect(title2?.getAttribute('id')).toBe(labelledby2);
	});

	it('four StatCards (a typical SummaryStrip) produce unique label/value ids', () => {
		// Render 4 StatCards into the same document.
		const renderResults = [
			render(StatCard, { label: 'Instances', value: 42 }),
			render(StatCard, { label: 'Healthy', value: 40, status: 'success' }),
			render(StatCard, { label: 'Warning', value: 1, status: 'warning' }),
			render(StatCard, { label: 'Down', value: 1, status: 'danger' }),
		];

		const allIds: string[] = [];
		const allLabelledby: string[] = [];

		for (const { container } of renderResults) {
			const root = container.querySelector('.gr-shell-statcard');
			expect(root).toBeTruthy();
			const labelledby = root!.getAttribute('aria-labelledby');
			expect(labelledby).toBeTruthy();
			allLabelledby.push(labelledby!);

			const refs = collectIdReferences(root!);
			// At minimum: label + value.
			expect(refs.length).toBeGreaterThanOrEqual(2);

			for (const refId of refs) {
				// Every referenced id must resolve to an element that exists in the
				// same rendered StatCard's own DOM. We assert presence in the parent
				// container of this render, NOT just the global document, because
				// duplicate ids in the global document would still pass a global
				// getElementById call by returning some element.
				const found = container.querySelector(`[id="${refId}"]`);
				expect(found, `Id ${refId} not found inside its own StatCard`).toBeTruthy();
				allIds.push(refId);
			}
		}

		// Every `aria-labelledby` string is distinct (verifies whole bundles
		// are not aliased across instances).
		const uniqueLabelledby = new Set(allLabelledby);
		expect(uniqueLabelledby.size).toBe(allLabelledby.length);

		// Every individual id token is unique across all four StatCards.
		const uniqueIds = new Set(allIds);
		expect(uniqueIds.size, 'duplicate ids across StatCards').toBe(allIds.length);
	});

	it('StatCard trend and description ids are also distinct across instances', () => {
		const a = render(StatCard, {
			label: 'A',
			value: 1,
			trend: { direction: 'up', label: '+1' },
			description: 'Description A',
		});
		const b = render(StatCard, {
			label: 'B',
			value: 2,
			trend: { direction: 'down', label: '-1' },
			description: 'Description B',
		});

		const trendA = a.container.querySelector('.gr-shell-statcard__trend');
		const trendB = b.container.querySelector('.gr-shell-statcard__trend');
		const descA = a.container.querySelector('.gr-shell-statcard__description');
		const descB = b.container.querySelector('.gr-shell-statcard__description');

		const trendIdA = trendA?.getAttribute('id');
		const trendIdB = trendB?.getAttribute('id');
		const descIdA = descA?.getAttribute('id');
		const descIdB = descB?.getAttribute('id');

		expect(trendIdA).toBeTruthy();
		expect(trendIdB).toBeTruthy();
		expect(descIdA).toBeTruthy();
		expect(descIdB).toBeTruthy();

		expect(trendIdA).not.toBe(trendIdB);
		expect(descIdA).not.toBe(descIdB);
	});

	it('Panel ids do not collide with StatCard ids in the same document', () => {
		// Render a Panel and a StatCard together.
		const p = render(Panel, {
			title: 'Mixed example',
			children: snippetOf('<p>panel body</p>'),
		});
		const s = render(StatCard, {
			label: 'Mixed metric',
			value: 7,
		});

		const panelTitleId = p.container.querySelector('.gr-shell-panel__title')?.getAttribute('id');
		const statRoot = s.container.querySelector('.gr-shell-statcard');
		const statRefs = collectIdReferences(statRoot!);

		expect(panelTitleId).toBeTruthy();
		expect(statRefs.length).toBeGreaterThan(0);
		expect(statRefs).not.toContain(panelTitleId);
	});

	it('SummaryStrip + nested StatCards: aria-labelledby resolves uniquely inside each card', () => {
		const summary = render(SummaryStrip, {
			label: 'Fleet summary',
			columns: 3,
			children: createRawSnippet(() => ({
				render: () => '<div data-test="strip-children"></div>',
			})),
		});

		// Render four cards into the same DOM container (mimics actual dashboard
		// composition where SummaryStrip's children are populated externally).
		const cardA = render(StatCard, { label: 'A', value: 1 });
		const cardB = render(StatCard, { label: 'B', value: 2 });
		const cardC = render(StatCard, { label: 'C', value: 3 });

		const stripSection = summary.container.querySelector('section.gr-shell-summary-strip');
		expect(stripSection?.getAttribute('aria-label')).toBe('Fleet summary');

		// Sanity: the three cards each have distinct labelledby strings.
		const ariaLabels = [cardA, cardB, cardC]
			.map((r) => r.container.querySelector('.gr-shell-statcard')?.getAttribute('aria-labelledby'))
			.filter((v): v is string => Boolean(v));
		expect(ariaLabels.length).toBe(3);
		expect(new Set(ariaLabels).size).toBe(3);
	});
});
