/**
 * Modal Primitive Tests
 *
 * Focused on accessibility, focus management, and lifecycle behavior.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createModal } from '../src/primitives/modal';
import type { ActionReturn } from '../src/types/common';

function destroyAction(action: ActionReturn | void): void {
	if (
		action &&
		typeof action === 'object' &&
		'destroy' in action &&
		typeof action.destroy === 'function'
	) {
		action.destroy();
	}
}

function cleanup(actions: Array<ActionReturn | void>): void {
	actions.forEach(destroyAction);
}

function appendElement<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	parent: HTMLElement = document.body
): HTMLElementTagNameMap[K] {
	const element = document.createElement(tag);
	parent.appendChild(element);
	return element;
}

function createButton(label: string, parent?: HTMLElement): HTMLButtonElement {
	const button = appendElement('button', parent);
	button.type = 'button';
	button.textContent = label;
	return button;
}

async function flushMicrotasks(): Promise<void> {
	await Promise.resolve();
}

describe('Modal Primitive', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		document.body.style.overflow = '';
	});

	afterEach(() => {
		document.body.innerHTML = '';
		document.body.style.overflow = '';
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with default config', () => {
			const modal = createModal();

			expect(modal.state.open).toBe(false);
			expect(modal.state.hasBackdrop).toBe(true);
			expect(modal.state.preventScroll).toBe(true);
			expect(modal.state.closeOnEscape).toBe(true);
			expect(modal.state.closeOnBackdrop).toBe(true);
			expect(modal.state.returnFocus).toBe(true);
			expect(modal.state.mounted).toBe(false);
		});
	});

	describe('State transitions and callbacks', () => {
		it('should open and close while invoking callbacks and locking scroll', () => {
			const onOpen = vi.fn();
			const onClose = vi.fn();
			const onOpenChange = vi.fn();
			const modal = createModal({ onOpen, onClose, onOpenChange });
			const content = appendElement('div');
			const actions = [modal.actions.content(content)];

			document.body.style.overflow = 'auto';

			modal.helpers.open();
			expect(modal.state.open).toBe(true);
			expect(onOpen).toHaveBeenCalledTimes(1);
			expect(onOpenChange).toHaveBeenLastCalledWith(true);
			expect(document.body.style.overflow).toBe('hidden');

			modal.helpers.close();
			expect(modal.state.open).toBe(false);
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(onOpenChange).toHaveBeenLastCalledWith(false);
			expect(document.body.style.overflow).toBe('auto');

			cleanup(actions);
		});

		it('respects preventScroll=false by leaving body overflow untouched', () => {
			document.body.style.overflow = 'scroll';
			const modal = createModal({ preventScroll: false });
			const content = appendElement('div');
			const actions = [modal.actions.content(content)];

			modal.helpers.open();
			expect(document.body.style.overflow).toBe('scroll');

			modal.helpers.close();
			expect(document.body.style.overflow).toBe('scroll');

			cleanup(actions);
		});
	});

	describe('Trigger and close actions', () => {
		it('should open via trigger and return focus on close', () => {
			const modal = createModal();
			const trigger = createButton('Open Modal');
			const content = appendElement('div');
			createButton('Focusable', content);

			const actions = [modal.actions.trigger(trigger), modal.actions.content(content)];

			trigger.focus();
			trigger.click();

			expect(modal.state.open).toBe(true);
			expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
			expect(trigger.getAttribute('aria-controls')).toBe(modal.state.id);

			modal.helpers.close();

			expect(modal.state.open).toBe(false);
			expect(document.activeElement).toBe(trigger);

			cleanup(actions);
		});

		it('should close when close button action is clicked', () => {
			const modal = createModal();
			const content = appendElement('div');
			createButton('Focusable', content);
			const closeButton = createButton('Close', content);

			const actions = [modal.actions.content(content), modal.actions.close(closeButton)];

			modal.helpers.open();
			closeButton.click();

			expect(modal.state.open).toBe(false);

			cleanup(actions);
		});
	});

	describe('Backdrop interactions', () => {
		it('closes on backdrop click but ignores clicks on descendants', () => {
			const modal = createModal();
			const content = appendElement('div');
			const backdrop = appendElement('div');
			const child = appendElement('span', backdrop);

			const actions = [modal.actions.content(content), modal.actions.backdrop(backdrop)];

			modal.helpers.open();
			backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			expect(modal.state.open).toBe(false);

			modal.helpers.open();
			child.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			expect(modal.state.open).toBe(true);

			cleanup(actions);
		});

		it('respects closeOnBackdrop=false', () => {
			const modal = createModal({ closeOnBackdrop: false });
			const content = appendElement('div');
			const backdrop = appendElement('div');

			const actions = [modal.actions.content(content), modal.actions.backdrop(backdrop)];

			modal.helpers.open();
			backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));

			expect(modal.state.open).toBe(true);

			cleanup(actions);
		});
	});

	describe('Keyboard handling and focus trapping', () => {
		it('handles Escape key based on configuration', () => {
			const modal = createModal();
			const content = appendElement('div');
			const actions = [modal.actions.content(content)];

			modal.helpers.open();
			content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
			expect(modal.state.open).toBe(false);

			const modalNoEscape = createModal({ closeOnEscape: false });
			const contentNoEscape = appendElement('div');
			const noEscapeActions = [modalNoEscape.actions.content(contentNoEscape)];

			modalNoEscape.helpers.open();
			contentNoEscape.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
			expect(modalNoEscape.state.open).toBe(true);

			cleanup(actions);
			cleanup(noEscapeActions);
		});

		it('traps focus with Tab and Shift+Tab', () => {
			const modal = createModal();
			const content = appendElement('div');
			const first = createButton('First', content);
			const last = createButton('Last', content);

			const actions = [modal.actions.content(content)];
			modal.helpers.open();

			expect(document.activeElement).toBe(first);

			// Shift+Tab from first goes to last
			first.focus();
			first.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'Tab',
					shiftKey: true,
					bubbles: true,
					cancelable: true,
				})
			);
			expect(document.activeElement).toBe(last);

			// Tab from last loops to first
			last.focus();
			last.dispatchEvent(
				new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
			);
			expect(document.activeElement).toBe(first);

			cleanup(actions);
		});

		it('focuses provided initial element when opening', () => {
			const modal = createModal();
			const content = appendElement('div');
			const fallback = createButton('Fallback', content);
			createButton('Secondary', content);

			const actions = [modal.actions.content(content)];

			modal.helpers.open();
			expect(document.activeElement).toBe(fallback);
			modal.helpers.close();

			const content2 = appendElement('div');
			const preferred2 = createButton('Preferred 2', content2);
			const modalWithInitial = createModal({
				initialFocus: () => preferred2,
			});
			const actions2 = [modalWithInitial.actions.content(content2)];

			modalWithInitial.helpers.open();
			expect(document.activeElement).toBe(preferred2);

			cleanup(actions);
			cleanup(actions2);
		});
	});

	describe('Before close hooks', () => {
		it('prevents closing when onBeforeClose returns false', () => {
			const onBeforeClose = vi.fn(() => false);
			const modal = createModal({ onBeforeClose });
			const content = appendElement('div');
			const actions = [modal.actions.content(content)];

			modal.helpers.open();
			modal.helpers.close();

			expect(onBeforeClose).toHaveBeenCalledTimes(1);
			expect(modal.state.open).toBe(true);

			cleanup(actions);
		});

		it('awaits async onBeforeClose resolution', async () => {
			let resolveClose: ((value: boolean) => void) | undefined;
			const modal = createModal({
				onBeforeClose: () =>
					new Promise<boolean>((resolve) => {
						resolveClose = resolve;
					}),
			});
			const content = appendElement('div');
			const actions = [modal.actions.content(content)];

			modal.helpers.open();
			modal.helpers.close();
			expect(modal.state.open).toBe(true);

			resolveClose?.(true);
			await flushMicrotasks();
			await flushMicrotasks();

			expect(modal.state.open).toBe(false);

			cleanup(actions);
		});
	});

	describe('Content attributes and lifecycle', () => {
		it('sets ARIA attributes and tracks mounted flag', () => {
			const modal = createModal({
				labelledBy: 'custom-title',
				describedBy: 'custom-description',
			});
			const content = appendElement('section');

			expect(modal.state.mounted).toBe(false);
			const action = modal.actions.content(content);
			expect(modal.state.mounted).toBe(true);

			expect(content.getAttribute('role')).toBe('dialog');
			expect(content.getAttribute('aria-modal')).toBe('true');
			expect(content.getAttribute('aria-labelledby')).toBe('custom-title');
			expect(content.getAttribute('aria-describedby')).toBe('custom-description');
			expect(content.tabIndex).toBe(0);

			destroyAction(action);
			expect(modal.state.mounted).toBe(false);
		});
	});
});
