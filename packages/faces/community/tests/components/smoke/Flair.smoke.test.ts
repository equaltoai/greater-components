import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Flair } from '../../../src/components/Flair/index.js';
import { createMockFlair } from '../../mocks/mockFlair.js';

describe('Flair Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Flair.Badge', () => {
		it('renders without errors', () => {
			render(Flair.Badge, {
				props: {
					flair: createMockFlair('f1'),
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
