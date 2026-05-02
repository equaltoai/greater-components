import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SoulRequestCard from '../src/SoulRequestCard.svelte';
import type { SoulRequestCardData } from '../src/surfaces.js';

const createRequest = (href: string): SoulRequestCardData => ({
	id: 'request-1',
	title: 'Review artifact',
	summary: 'Validate the attached artifact before continuing the workflow.',
	requestedBy: {
		id: 'person-1',
		name: 'Test Steward',
		role: 'Reviewer',
	},
	artifacts: [
		{
			id: 'artifact-1',
			title: 'Attached evidence',
			href,
		},
	],
});

describe('SoulRequestCard link safety', () => {
	it('omits artifact links with unsafe URL schemes', () => {
		const { container } = render(SoulRequestCard, {
			props: { request: createRequest('javascript:alert(1)') },
		});

		expect(container.querySelector('a')).toBeNull();
		expect(container.textContent).toContain('Attached evidence');
	});

	it('keeps artifact links with allowed URL schemes', () => {
		const { container } = render(SoulRequestCard, {
			props: { request: createRequest('https://example.com/evidence') },
		});

		const link = container.querySelector('a');
		expect(link?.getAttribute('href')).toBe('https://example.com/evidence');
		expect(link?.textContent).toContain('Open artifact');
	});
});
