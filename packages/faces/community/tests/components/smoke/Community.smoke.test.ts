import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Community } from '../../../src/components/Community/index.js';
import CommunityTestWrapper from '../../fixtures/CommunityTestWrapper.svelte';

describe('Community Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Community Subcomponents', () => {
		const components = [
			{ name: 'Header', Component: Community.Header },
			{ name: 'RulesSidebar', Component: Community.RulesSidebar },
			{ name: 'Stats', Component: Community.Stats },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(CommunityTestWrapper, {
				props: {
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Community.Root', () => {
		it('renders without errors', () => {
			render(CommunityTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
