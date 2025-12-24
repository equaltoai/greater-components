import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PostTestWrapper from '../../fixtures/PostTestWrapper.svelte';

describe('Post Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Post.Root', () => {
		it('renders without errors', () => {
			render(PostTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
