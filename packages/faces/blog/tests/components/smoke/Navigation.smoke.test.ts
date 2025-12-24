import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Navigation } from '../../../src/components/Navigation/index.js';
import NavigationTestWrapper from '../../fixtures/NavigationTestWrapper.svelte';

describe('Navigation Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Navigation Subcomponents', () => {
		const components = [
			{ name: 'ArchiveView', Component: Navigation.ArchiveView },
			{ name: 'TagCloud', Component: Navigation.TagCloud },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(NavigationTestWrapper, {
				props: {
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Navigation.Root', () => {
		it('renders without errors', () => {
			render(NavigationTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
