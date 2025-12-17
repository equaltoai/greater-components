import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FullArticleTestWrapper from '../fixtures/FullArticleTestWrapper.svelte';
import { Editor } from '../../src/components/Editor/index.js';
import { createMockArticle } from '../mocks/mockArticle.js';

describe('A11y: Screen Reader Support', () => {
	const mockArticle = createMockArticle('a11y-sr');

	describe('Article Semantics', () => {
		it('uses correct landmarks', () => {
			render(FullArticleTestWrapper, { props: { article: mockArticle } });

			// <article> should be present
			expect(screen.getByRole('article')).toBeInTheDocument();

			// Footer
			expect(screen.getByRole('contentinfo')).toBeInTheDocument();
		});

		it('provides reading progress updates', () => {
			render(FullArticleTestWrapper, { props: { article: mockArticle } });

			const progress = screen.getByRole('progressbar');
			expect(progress).toHaveAttribute('aria-label', 'Reading progress');
			expect(progress).toHaveAttribute('aria-valuemin', '0');
			expect(progress).toHaveAttribute('aria-valuemax', '100');
		});
	});

	describe('Editor Semantics', () => {
		const editorProps = {
			draft: {
				id: 'd1',
				title: 'Draft',
				content: '',
				contentFormat: 'markdown',
				savedAt: new Date(),
			},
			config: { mode: 'markdown' },
		};

		it('toolbar has correct label', () => {
			render(Editor.Root, { props: editorProps });
			expect(screen.getByRole('toolbar', { name: 'Editor toolbar' })).toBeInTheDocument();
		});

		it('status region is polite', () => {
			const { container } = render(Editor.Root, { props: editorProps });
			const status = container.querySelector('[aria-live="polite"]');
			expect(status).toBeInTheDocument();
		});
	});
});
