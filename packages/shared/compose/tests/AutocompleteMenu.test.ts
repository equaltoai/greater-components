import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import AutocompleteMenu from '../src/AutocompleteMenu.svelte';
import type { AutocompleteSuggestion } from '../src/Autocomplete.js';

describe('AutocompleteMenu', () => {
	const mockSuggestions: AutocompleteSuggestion[] = [
		{
			type: 'mention',
			text: '@john',
			value: '@john@example.com',
			metadata: { displayName: 'John Doe' },
		},
		{ type: 'hashtag', text: '#test', value: 'test' },
		{ type: 'emoji', text: ':smile:', value: '😊' },
	];

	const defaultProps = {
		suggestions: mockSuggestions,
		selectedIndex: 0,
		onSelect: vi.fn(),
		onClose: vi.fn(),
	};

	beforeEach(() => {
		// Mock scrollIntoView
		Element.prototype.scrollIntoView = vi.fn();
	});

	it('should render suggestions', () => {
		render(AutocompleteMenu, defaultProps);

		expect(screen.getByText('@john')).toBeTruthy();
		expect(screen.getAllByText('#test').length).toBeGreaterThan(0);
		expect(screen.getByText('😊')).toBeTruthy();
		expect(screen.getByText('John Doe')).toBeTruthy();
	});

	it('should render loading state', () => {
		render(AutocompleteMenu, { ...defaultProps, loading: true });

		expect(screen.getByText('Loading suggestions...')).toBeTruthy();
		expect(screen.queryByText('@john')).toBeFalsy();
	});

	it('should render empty state', () => {
		render(AutocompleteMenu, { ...defaultProps, suggestions: [] });

		expect(screen.getByText('No suggestions found')).toBeTruthy();
	});

	it('should highlight selected item', () => {
		render(AutocompleteMenu, { ...defaultProps, selectedIndex: 1 });

		const items = screen.getAllByRole('option');
		expect(items[1].getAttribute('aria-selected')).toBe('true');
		expect(items[1].classList.contains('autocomplete-menu__item--selected')).toBe(true);

		expect(items[0].getAttribute('aria-selected')).toBe('false');
	});

	it('should call onSelect when item is clicked', async () => {
		const onSelect = vi.fn();
		render(AutocompleteMenu, { ...defaultProps, onSelect });

		const items = screen.getAllByRole('option');
		await fireEvent.click(items[1]);

		expect(onSelect).toHaveBeenCalledWith(mockSuggestions[1]);
	});

	it('should not use inline styles', () => {
		const { container } = render(AutocompleteMenu, defaultProps);
		const menu = container.querySelector('.autocomplete-menu') as HTMLElement;

		expect(menu.getAttribute('style')).toBeNull();
	});

	it('should close on Escape key', async () => {
		const onClose = vi.fn();
		render(AutocompleteMenu, { ...defaultProps, onClose });

		await fireEvent.keyDown(document, { key: 'Escape' });

		expect(onClose).toHaveBeenCalled();
	});

	it('should close on click outside', async () => {
		const onClose = vi.fn();
		render(AutocompleteMenu, { ...defaultProps, onClose });

		await fireEvent.click(document.body);

		expect(onClose).toHaveBeenCalled();
	});

	it('should not close on click inside', async () => {
		const onClose = vi.fn();
		render(AutocompleteMenu, { ...defaultProps, onClose });

		const menu = screen.getByRole('listbox');
		await fireEvent.click(menu);

		expect(onClose).not.toHaveBeenCalled();
	});
});
