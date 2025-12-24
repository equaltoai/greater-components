import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Voting } from '../../../src/components/Voting/index.js';

describe('Voting Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Voting.Root', () => {
		it('renders without errors', () => {
			render(Voting.Root, {
				props: {
					score: 100,
					userVote: 0,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
