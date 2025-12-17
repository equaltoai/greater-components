import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Moderation } from '../../../src/components/Moderation/index.js';
import ModerationTestWrapper from '../../fixtures/ModerationTestWrapper.svelte';

describe('Moderation Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Moderation Subcomponents', () => {
		const components = [
			{ name: 'Panel', Component: Moderation.Panel },
			{ name: 'Queue', Component: Moderation.Queue },
			{ name: 'Log', Component: Moderation.Log },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(ModerationTestWrapper, {
				props: {
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Moderation.Root', () => {
		it('renders without errors', () => {
			render(ModerationTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
