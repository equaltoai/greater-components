import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Author } from '../../../src/components/Author/index.js';
import AuthorTestWrapper from '../../fixtures/AuthorTestWrapper.svelte';

describe('Author Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Author Subcomponents', () => {
		const components = [{ name: 'Card', Component: Author.Card }];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(AuthorTestWrapper, {
				props: {
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Author.Root', () => {
		it('renders without errors', () => {
			render(AuthorTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
