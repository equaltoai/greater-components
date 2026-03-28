// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { Post } from '../src/components/Post/index.js';
import { createMockPost } from './mocks/mockPost.js';

describe('Community face SSR safety', () => {
	it('renders Post.Root on the server without touching browser globals', () => {
		const result = render(Post.Root, {
			props: {
				post: createMockPost('ssr-post'),
			},
		});

		expect(result.body).toContain('Test Post ssr-post');
		expect(result.body).toContain('/posts/ssr-post');
	});
});
