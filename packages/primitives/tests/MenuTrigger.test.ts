import { describe, it, expect } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/svelte';
import MenuTriggerWrapper from './fixtures/MenuTriggerWrapper.svelte';

describe('Menu/Trigger.svelte', () => {
	it('renders and has correct initial attributes', () => {
		render(MenuTriggerWrapper);
		const trigger = screen.getByRole('button');

		expect(trigger).toBeTruthy();
		expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.getAttribute('data-gr-menu-trigger-managed')).toBe('true');
	});

	it('toggles aria-expanded on click', async () => {
		render(MenuTriggerWrapper);
		const trigger = screen.getByRole('button');

		await fireEvent.click(trigger);
		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));

		await fireEvent.click(trigger);
		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'));
	});

	it('opens on ArrowDown', async () => {
		render(MenuTriggerWrapper);
		const trigger = screen.getByRole('button');

		trigger.focus();
		await fireEvent.keyDown(trigger, { key: 'ArrowDown' });

		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
	});

	it('opens on Enter', async () => {
		render(MenuTriggerWrapper);
		const trigger = screen.getByRole('button');

		trigger.focus();
		await fireEvent.keyDown(trigger, { key: 'Enter' });

		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
	});

	it('opens on Space', async () => {
		render(MenuTriggerWrapper);
		const trigger = screen.getByRole('button');

		trigger.focus();
		await fireEvent.keyDown(trigger, { key: ' ' });

		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
	});

	it('opens and focuses last item on ArrowUp', async () => {
		// Use rerender to ensure we can interact? No, just standard render.
		// To test items logic, we need items to be registered.
		// We open it first, then close it?
		// Or we assume items are registered if we wait?
		render(MenuTriggerWrapper);
		const trigger = screen.getByRole('button');

		// Open to mount content and register items
		await fireEvent.click(trigger);
		await waitFor(() => expect(screen.getByText('Item 1')).toBeTruthy());

		// Close it
		await fireEvent.click(trigger);
		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'));

		// Now trigger ArrowUp
		trigger.focus();
		await fireEvent.keyDown(trigger, { key: 'ArrowUp' });

		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
	});

	it('does not toggle when disabled', async () => {
		render(MenuTriggerWrapper, { props: { disabled: true } });

		const triggerText = screen.getByTestId('trigger-text');
		const trigger = triggerText.closest('.gr-menu-trigger');

		expect(trigger?.getAttribute('aria-disabled')).toBe('true');

		await fireEvent.click(trigger as HTMLElement);
		expect(trigger?.getAttribute('aria-expanded')).toBe('false');
	});

	it('closes on Escape if open', async () => {
		render(MenuTriggerWrapper);
		const trigger = screen.getByRole('button');

		await fireEvent.click(trigger);
		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));

		await fireEvent.keyDown(trigger, { key: 'Escape' });
		await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'));
	});

	it('handles interactive element change (cleanup)', async () => {
		const { rerender } = render(MenuTriggerWrapper, { props: { showNested: false } });

		const trigger = screen.getByRole('button');
		expect(trigger.getAttribute('data-gr-menu-trigger-managed')).toBe('true');

		// Change structure to use nested button
		await rerender({ showNested: true });

		// The old trigger (span based) is gone, replaced by div>button
		// But the wrapper .gr-menu-trigger div stays.
		// Wait, `Menu/Trigger` implementation:
		// <div bind:this={triggerRef} ...> {@render children()} </div>
		// mutationObserver watches triggerRef children.
		// If children change, `findInteractiveElement` finds the new button.
		// `cleanupManaged` should be called on the *old* element if it was different.

		// Initially: triggerRef is the div. interactiveElement is triggerRef (because span is not interactive).
		// After change: children has <button>. interactiveElement becomes the button.
		// So `target !== managedElement` becomes true. `cleanupManaged` called on old managedElement (the div).

		const nestedButton = await waitFor(() => screen.getByText('Nested Button'));
		expect(nestedButton).toBeTruthy();

		// Check if attributes moved to nested button
		await waitFor(() => {
			expect(nestedButton.getAttribute('aria-haspopup')).toBe('menu');
		});

		// Check if attributes removed from wrapper div
		// The wrapper div is the parent of the nested div
		const wrapper = nestedButton.closest('.gr-menu-trigger');
		expect(wrapper?.getAttribute('aria-haspopup')).toBeNull();
	});
});
