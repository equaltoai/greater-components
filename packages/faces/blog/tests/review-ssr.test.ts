// @vitest-environment node

/**
 * SSR / strict-CSP safety for the review workflow chrome.
 *
 * contentus renders these components under a FaceTheory host with a strict CSP
 * built by `buildStrictCspHeader` — no `style-src 'unsafe-inline'`, no
 * `script-src 'unsafe-inline'`. Two properties have to hold:
 *
 * 1. The components render on the server with no DOM globals present.
 * 2. The server-rendered markup carries no inline `style` attribute, no
 *    `<style>` element, and no `<script>` element, so nothing in the output
 *    needs a CSP nonce or hash to survive.
 */

import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import QueueCard from '../src/components/Review/QueueCard.svelte';
import AttributionStrip from '../src/components/Review/AttributionStrip.svelte';
import VerdictActions from '../src/components/Review/VerdictActions.svelte';
import { describeApprovalRequirement } from '../src/components/Review/state.js';
import {
	createMockAgentActor,
	createMockDraftReview,
	createMockReviewActor,
	createMockVerdict,
} from './mocks/mockDraftReview.js';

const INLINE_STYLE_ATTRIBUTE = /<[^>]+\sstyle\s*=/i;
const STYLE_ELEMENT = /<style[\s>]/i;
const SCRIPT_ELEMENT = /<script[\s>]/i;

function expectCspSafe(markup: string) {
	expect(markup).not.toMatch(INLINE_STYLE_ATTRIBUTE);
	expect(markup).not.toMatch(STYLE_ELEMENT);
	expect(markup).not.toMatch(SCRIPT_ELEMENT);
}

describe('Review chrome SSR safety', () => {
	it('renders Review.QueueCard on the server without browser globals', () => {
		const review = createMockDraftReview('ssr-1', {
			generatedBy: createMockAgentActor('a1'),
			verdicts: [createMockVerdict({ verdict: 'CHANGES_REQUESTED', notes: 'Needs sources' })],
		});

		const result = render(QueueCard, { props: { review, href: '/drafts/ssr-1' } });

		expect(result.body).toContain('Draft ssr-1');
		expect(result.body).toContain('Agent-generated');
		expect(result.body).toContain('Changes requested');
		expect(result.body).toContain('/drafts/ssr-1');
		expectCspSafe(result.body);
	});

	it('renders Review.AttributionStrip on the server', () => {
		const review = createMockDraftReview('ssr-2', {
			generatedBy: createMockAgentActor('a2'),
			reviewedBy: createMockReviewActor('r2'),
			reviewStatus: 'Awaiting principal approval',
			editorNotes: 'Second pass done.',
			grant: {
				reviewer: createMockReviewActor('r3', { username: 'kim', domain: 'lesser.host' }),
				grantedAt: '2026-07-29T08:00:00.000Z',
			},
		});

		const result = render(AttributionStrip, {
			props: { review, approvalRequirement: describeApprovalRequirement(review) },
		});

		expect(result.body).toContain('Awaiting principal approval');
		expect(result.body).toContain('Second pass done.');
		expect(result.body).toContain('@kim@lesser.host');
		expect(result.body).toContain('Invitations can be revoked.');
		expectCspSafe(result.body);
	});

	it('renders empty attribution states on the server', () => {
		const result = render(AttributionStrip, {
			props: { review: createMockDraftReview('ssr-3') },
		});

		expect(result.body).toContain('Not recorded');
		expect(result.body).toContain('Not yet reviewed');
		expect(result.body).toContain('None');
		expectCspSafe(result.body);
	});

	it('renders Review.VerdictActions on the server with the dialog closed', () => {
		const result = render(VerdictActions, {
			props: { draftId: 'ssr-4', onSubmit: () => undefined },
		});

		expect(result.body).toContain('Approve');
		expect(result.body).toContain('Request changes');
		expectCspSafe(result.body);
	});

	it('emits no inline style attribute even with every optional field populated', () => {
		const review = createMockDraftReview('ssr-5', {
			subtitle: 'Full subtitle',
			excerpt: 'Full excerpt',
			scheduledAt: '2026-08-01T12:00:00.000Z',
			generatedBy: createMockAgentActor('a5'),
			reviewedBy: createMockReviewActor('r5'),
			reviewStatus: 'Approved',
			editorNotes: 'All good.',
			grant: {
				reviewer: createMockReviewActor('r6'),
				grantedAt: '2026-07-28T08:00:00.000Z',
			},
			verdicts: [createMockVerdict()],
		});

		expectCspSafe(render(QueueCard, { props: { review, href: '/drafts/ssr-5' } }).body);
		expectCspSafe(
			render(AttributionStrip, {
				props: { review, approvalRequirement: describeApprovalRequirement(review) },
			}).body
		);
	});
});
