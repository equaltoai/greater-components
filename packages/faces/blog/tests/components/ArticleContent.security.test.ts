import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { Article } from '../../src/components/Article/index.js';
import ArticleTestWrapper from '../fixtures/ArticleTestWrapper.svelte';
import { createMockArticle } from '../mocks/mockArticle.js';

describe('Article.Content security', () => {
	it('sanitizes HTML content before rendering', () => {
		const article = createMockArticle('security-1', {
			contentFormat: 'html',
			content:
				'<p>Hello</p><script>alert(1)</script><img src=x onerror="alert(1)" /><a href="javascript:alert(1)">bad</a>',
		});

		const { container } = render(ArticleTestWrapper, {
			props: {
				article,
				component: Article.Content,
			},
		});

		const content = container.querySelector('.gr-blog-article__content') as HTMLElement | null;
		expect(content).toBeTruthy();
		expect(content?.innerHTML).toContain('<p>Hello</p>');
		expect(content?.innerHTML).not.toContain('<script');
		expect(content?.innerHTML).not.toContain('onerror');
		expect(content?.innerHTML).not.toContain('javascript:');
	});
});
