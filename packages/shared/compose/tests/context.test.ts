import { describe, it, expect, vi, afterEach } from 'vitest';
import { createComposeContext, getComposeContext, hasComposeContext } from '../src/context.js';
import { getContext, setContext } from 'svelte';

// Mock svelte context
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('context', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('createComposeContext', () => {
		it('should create context with default values', () => {
			const context = createComposeContext();

			expect(context.config.characterLimit).toBe(500);
			expect(context.config.defaultVisibility).toBe('public');
			expect(context.state.content).toBe('');
			expect(setContext).toHaveBeenCalled();
		});

		it('should create context with custom config', () => {
			const context = createComposeContext({
				characterLimit: 1000,
				defaultVisibility: 'unlisted',
			});

			expect(context.config.characterLimit).toBe(1000);
			expect(context.config.defaultVisibility).toBe('unlisted');
		});

		it('should create context with initial state', () => {
			const context = createComposeContext(
				{},
				{},
				{
					content: 'Initial content',
				}
			);

			expect(context.state.content).toBe('Initial content');
		});

		it('should allow state updates', () => {
			const context = createComposeContext();

			context.updateState({ content: 'Updated' });

			expect(context.state.content).toBe('Updated');
		});

		it('should reset state', () => {
			const context = createComposeContext(
				{},
				{},
				{
					content: 'Initial',
				}
			);

			context.updateState({ content: 'Updated' });
			context.reset();

			expect(context.state.content).toBe('');
		});
	});

	describe('getComposeContext', () => {
		it('should return context if exists', () => {
			const mockContext = {};
			vi.mocked(getContext).mockReturnValue(mockContext);

			const result = getComposeContext();
			expect(result).toBe(mockContext);
		});

		it('should throw if context missing', () => {
			vi.mocked(getContext).mockReturnValue(undefined);

			expect(() => getComposeContext()).toThrow('Compose context not found');
		});
	});

	describe('hasComposeContext', () => {
		it('should return true if context exists', () => {
			vi.mocked(getContext).mockReturnValue({});
			expect(hasComposeContext()).toBe(true);
		});

		it('should return false if context missing', () => {
			vi.mocked(getContext).mockReturnValue(undefined);
			expect(hasComposeContext()).toBe(false);
		});
	});
});
