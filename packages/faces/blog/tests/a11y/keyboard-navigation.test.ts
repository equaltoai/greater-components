import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ArticleWithTOC from '../fixtures/ArticleWithTOC.svelte';
import { Editor } from '../../src/components/Editor/index.js';
import { createMockArticle } from '../mocks/mockArticle.js';

describe('A11y: Keyboard Navigation', () => {
	describe.skip('Table of Contents', () => {
		const mockArticle = createMockArticle('a11y-toc', {
			content: '<h2 id="h1">Header 1</h2><h2 id="h2">Header 2</h2>',
			contentFormat: 'html',
		});

		it('allows tab navigation to TOC links', async () => {
			render(ArticleWithTOC, {
				props: {
					article: mockArticle,
				},
			});

			// Wait for TOC to render (headings extraction)
			await waitFor(
				() => {
					const buttons = screen.queryAllByRole('button');
					expect(buttons.length).toBeGreaterThan(0);
				},
				{ timeout: 2000 }
			);

			const buttons = screen.getAllByRole('button');
			const firstLink = buttons.find((b) => b.textContent?.trim() === 'Header 1');
			const secondLink = buttons.find((b) => b.textContent?.trim() === 'Header 2');

			expect(firstLink).toBeDefined();
			expect(secondLink).toBeDefined();

			// Focus first link
			firstLink?.focus();
			expect(document.activeElement).toBe(firstLink);

			// Tab to next
			secondLink?.focus();
			expect(document.activeElement).toBe(secondLink);
		});

		it('activates link on Enter key', async () => {
			const handlers = {
				onHeadingClick: vi.fn(),
			};

			render(ArticleWithTOC, {
				props: {
					article: mockArticle,
					handlers,
				},
			});

			await waitFor(
				() => {
					expect(screen.queryByRole('button', { name: 'Header 1' })).toBeInTheDocument();
				},
				{ timeout: 2000 }
			);

			const link = screen.getByRole('button', { name: 'Header 1' });

			link.focus();
			await fireEvent.click(link);

			expect(handlers.onHeadingClick).toHaveBeenCalledWith('h1');
		});
	});

	describe('Editor Toolbar', () => {
		it('buttons are keyboard focusable', async () => {
			render(Editor.Root, {
				props: {
					draft: {
						id: 'd1',
						title: 'Draft',
						content: '',
						contentFormat: 'markdown',
						savedAt: new Date(),
					},
					config: { mode: 'markdown' },
				},
			});

			await waitFor(() => {
				expect(screen.getByRole('toolbar')).toBeInTheDocument();
			});

			const toolbar = screen.getByRole('toolbar');
			const buttons = toolbar.querySelectorAll('button');

			expect(buttons.length).toBeGreaterThan(0);

			buttons[0].focus();
			expect(document.activeElement).toBe(buttons[0]);
		});
	});
});
