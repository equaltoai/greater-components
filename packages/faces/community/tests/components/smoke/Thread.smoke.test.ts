import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Thread } from '../../../src/components/Thread/index.js';
import ThreadTestWrapper from '../../fixtures/ThreadTestWrapper.svelte';

describe('Thread Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Thread Subcomponents', () => {
		const components = [{ name: 'CommentTree', Component: Thread.CommentTree }];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(ThreadTestWrapper, {
				props: {
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Thread.Root', () => {
		it('renders without errors', () => {
			render(ThreadTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
