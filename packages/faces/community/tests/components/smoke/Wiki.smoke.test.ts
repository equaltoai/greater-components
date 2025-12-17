import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Wiki } from '../../../src/components/Wiki/index.js';
import WikiTestWrapper from '../../fixtures/WikiTestWrapper.svelte';

describe('Wiki Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Wiki Subcomponents', () => {
		const components = [
			{ name: 'Page', Component: Wiki.Page },
			{ name: 'Editor', Component: Wiki.Editor },
			{ name: 'Navigation', Component: Wiki.Navigation },
			{ name: 'History', Component: Wiki.History },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(WikiTestWrapper, {
				props: {
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Wiki.Root', () => {
		it('renders without errors', () => {
			render(WikiTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
