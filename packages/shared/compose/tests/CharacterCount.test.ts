import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CharacterCount from '../src/CharacterCount.svelte';
import * as contextModule from '../src/context.js';

// Mock the context module
vi.mock('../src/context.js', async (importOriginal) => {
	const actual = await importOriginal<typeof contextModule>();
	return {
		...actual,
		getComposeContext: vi.fn(),
	};
});

describe('CharacterCount', () => {
	const mockContext = {
		config: {
			characterLimit: 500,
		},
		state: {
			characterCount: 0,
			overLimit: false,
		},
	};

	beforeEach(() => {
		vi.mocked(contextModule.getComposeContext).mockReturnValue(mockContext as any);
	});

	it('should not render text when count is low', () => {
		mockContext.state.characterCount = 100;
		render(CharacterCount);

		const text = screen.queryByText(/100 \/ 500/);
		expect(text).toBeFalsy();
	});

	it('should render text when near limit (>= 80%)', () => {
		mockContext.state.characterCount = 400; // 80% of 500
		render(CharacterCount);

		const text = screen.getByText('400 / 500');
		expect(text).toBeTruthy();
	});

	it('should render text when over limit', () => {
		mockContext.state.characterCount = 501;
		mockContext.state.overLimit = true;
		render(CharacterCount);

		const text = screen.getByText('501 / 500');
		expect(text).toBeTruthy();
		const container = text.parentElement;
		expect(container?.classList.contains('compose-character-count--over-limit')).toBe(true);
	});

	it('should render progress circle by default', () => {
		render(CharacterCount);
		const svg = screen.getByRole('status').querySelector('svg');
		expect(svg).toBeTruthy();
	});

	it('should hide progress circle when showProgress is false', () => {
		render(CharacterCount, { showProgress: false });
		const svg = screen.getByRole('status').querySelector('svg');
		expect(svg).toBeFalsy();
	});

	it('should apply custom class', () => {
		const { container } = render(CharacterCount, { class: 'custom-class' });
		const element = container.querySelector('.compose-character-count');
		expect(element?.classList.contains('custom-class')).toBe(true);
	});

	it('should have correct aria-label', () => {
		mockContext.state.characterCount = 123;
		render(CharacterCount);
		
		const element = screen.getByRole('status');
		expect(element.getAttribute('aria-label')).toBe('123 of 500 characters used');
	});
});
