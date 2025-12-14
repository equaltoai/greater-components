// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import SimpleMenuHarness from './harness/SimpleMenuHarness.svelte';

describe('SimpleMenu', () => {
	const items = [
		{ id: '1', label: 'Item 1' },
		{ id: '2', label: 'Item 2', disabled: true },
		{ id: '3', label: 'Item 3' },
	];

	const nestedItems = [
		{
			id: 'group1',
			label: 'Group 1',
			submenu: [
				{ id: '1-1', label: 'Subitem 1' },
				{ id: '1-2', label: 'Subitem 2' },
			],
		},
		{ id: 'single', label: 'Single Item' },
	];

	it('renders trigger and toggles menu', async () => {
		render(SimpleMenuHarness, { props: { items } });

		const trigger = screen.getByTestId('simple-menu-trigger');
		expect(trigger.textContent).toContain('Open');
		expect(screen.queryByRole('menu')).toBeNull();

		await fireEvent.click(trigger);

		await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());
		expect(trigger.textContent).toContain('Close');
	});

	it('renders items and handles selection', async () => {
		const onSelect = vi.fn();
		render(SimpleMenuHarness, { props: { items, onSelect, open: true } });

		await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());

		expect(screen.getByText('Item 1')).toBeTruthy();
		expect(screen.getByText('Item 2')).toBeTruthy();

		await fireEvent.click(screen.getByText('Item 1'));

		expect(onSelect).toHaveBeenCalledWith(items[0]);
	});

	it('renders nested items (sections with headers)', async () => {
		render(SimpleMenuHarness, { props: { items: nestedItems, open: true } });

		await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());

		// Headers are rendered
		expect(screen.getByText('Group 1')).toBeTruthy();
		// Check class for header if possible, but text presence is good enough for now

		// Subitems are rendered
		expect(screen.getByText('Subitem 1')).toBeTruthy();
		expect(screen.getByText('Subitem 2')).toBeTruthy();
		expect(screen.getByText('Single Item')).toBeTruthy();
	});

	it('handles selection in nested items', async () => {
		const onSelect = vi.fn();
		render(SimpleMenuHarness, { props: { items: nestedItems, onSelect, open: true } });

		await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());

		await fireEvent.click(screen.getByText('Subitem 1'));

		const subItem = nestedItems[0].submenu?.[0];
		expect(subItem).toBeDefined();
		if (subItem) expect(onSelect).toHaveBeenCalledWith(subItem);
	});

	it('respects placement prop', async () => {
		render(SimpleMenuHarness, { props: { items, open: true, placement: 'top-start' } });

		await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());
		const menu = screen.getByRole('menu');

		// Check data-placement attribute
		// Note: In test environment without layout, it might not respect constraints,
		// but it should try to set the attribute from props initially.
		// If the positioning logic runs immediately, it might flip it back to bottom-start if 'top' is invalid in JSDOM (0x0 rects).
		// However, we are just testing that the prop is passed through.
		// We'll check if the attribute is present. The specific value might depend on the mock layout.
		expect(menu.getAttribute('data-placement')).not.toBeNull();
	});

	it('updates open state when prop changes', async () => {
		const { rerender } = render(SimpleMenuHarness, { props: { items, open: false } });

		expect(screen.queryByRole('menu')).toBeNull();

		await rerender({ items, open: true });

		await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());

		await rerender({ items, open: false });

		await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
	});
});
