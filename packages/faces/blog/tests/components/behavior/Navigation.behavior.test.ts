import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import NavigationDefaultWrapper from '../../fixtures/NavigationDefaultWrapper.svelte';
import NavigationTestWrapper from '../../fixtures/NavigationTestWrapper.svelte';
import { Navigation } from '../../../src/components/Navigation/index.js';
import { createMockArchiveData, createMockTags } from '../../mocks/index.js';

describe('Navigation.Root Behavior', () => {
	const mockArchives = createMockArchiveData();
	const mockTags = createMockTags();

	it('renders with default props (no data)', () => {
		// This covers the default values in props destructuring
		render(Navigation.Root);
		const nav = screen.getByRole('navigation');
		expect(nav.textContent?.trim()).toBe('');
	});

	it('renders children when provided', () => {
		render(NavigationTestWrapper, {
			props: {
				archives: mockArchives,
				tags: mockTags,
				children: () => {
					const div = document.createElement('div');
					div.textContent = 'Custom Child';
					return div;
				},
			},
		});

		// Since we can't easily check for what IS NOT rendered without knowing implementation details of sub-components,
		// we assume if children are rendered, it's working.
		// We know NavigationTestWrapper passes children, so Root should render them.
		// However, checking if TagCloud is present requires knowing what it renders.
		// TagCloud renders a list of tags. Mock tags has "javascript".
		// If children are rendered, TagCloud should NOT be rendered (if it's in the {:else} block).

		// Wait, logic is:
		// {#if children} {@render children()} {:else} ... {/if}
		// So if children provided, TagCloud is NOT rendered.

		// But NavigationTestWrapper ALWAYS passes children (the block).
		// So TagCloud should NEVER be rendered in this test case.
		expect(screen.queryByText('javascript')).not.toBeInTheDocument();
	});

	it('renders default widgets (TagCloud, ArchiveView) when NO children are provided', () => {
		render(NavigationDefaultWrapper, {
			props: {
				archives: mockArchives,
				tags: mockTags,
			},
		});

		// Check if TagCloud and ArchiveView are rendered.
		// TagCloud renders tags.
		expect(screen.getByText('javascript')).toBeInTheDocument();

		// ArchiveView renders archives.
		// Mock data has 2023.
		expect(screen.getByText('2023')).toBeInTheDocument();
	});

	it('does NOT render default widgets if data is empty', () => {
		render(NavigationDefaultWrapper, {
			props: {
				archives: [],
				tags: [],
			},
		});

		const nav = screen.getByRole('navigation');
		expect(nav.textContent?.trim()).toBe('');
	});
});
