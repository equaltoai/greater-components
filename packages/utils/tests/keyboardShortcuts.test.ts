import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyboardShortcutManager } from '../src/keyboardShortcuts';

const dispatchKey = (target: EventTarget, init: KeyboardEventInit) => {
	const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
	target.dispatchEvent(event);
	return event;
};

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('KeyboardShortcutManager', () => {
	it('registers shortcuts, handles events, and detaches when unregistered or cleared', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const callback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('save', { keys: 'ctrl+s', callback });
		dispatchKey(target, { key: 's', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);

		manager.unregister('save');
		dispatchKey(target, { key: 's', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);

		manager.register('save', { keys: 'ctrl+s', callback });
		manager.clear();
		dispatchKey(target, { key: 's', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('respects the enabled flag and can toggle shortcuts on and off', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const callback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('save', { keys: 'ctrl+s', callback, enabled: false });
		dispatchKey(target, { key: 's', ctrlKey: true });
		expect(callback).not.toHaveBeenCalled();

		manager.setEnabled('save', true);
		dispatchKey(target, { key: 's', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);

		manager.setEnabled('save', false);
		dispatchKey(target, { key: 's', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('prevents default behavior, stops propagation, and honors allowInInput', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const bubbleSpy = vi.fn();
		window.addEventListener('keydown', bubbleSpy);

		const callback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('search', {
			keys: 'ctrl+k',
			callback,
			stopPropagation: true,
		});

		const event = dispatchKey(target, { key: 'k', ctrlKey: true });
		expect(event.defaultPrevented).toBe(true);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(bubbleSpy).not.toHaveBeenCalled();

		const inputTarget = document.createElement('input');
		document.body.appendChild(inputTarget);

		manager.unregister('search');
		manager.destroy();

		const inputManager = new KeyboardShortcutManager({ target: window });
		inputManager.register('search-input', {
			keys: 'ctrl+k',
			callback,
			allowInInput: true,
		});

		dispatchKey(inputTarget, { key: 'k', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(2);

		// Disallow in input and avoid preventing defaults when configured
		inputManager.unregister('search-input');
		inputManager.register('search-blocked', {
			keys: 'ctrl+f',
			callback,
			allowInInput: false,
			preventDefault: false,
			stopPropagation: false,
		});

		const prevented = dispatchKey(inputTarget, { key: 'f', ctrlKey: true });
		expect(prevented.defaultPrevented).toBe(false);
		expect(callback).toHaveBeenCalledTimes(2);

		inputManager.unregister('search-input');
		inputManager.destroy();
		window.removeEventListener('keydown', bubbleSpy);
	});

	it('supports multiple shortcuts but triggers only one match per event', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const first = vi.fn();
		const second = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('first', { keys: 'ctrl+k', callback: first });
		manager.register('second', { keys: 'ctrl+k', callback: second });
		manager.register('different', { keys: 'ctrl+b', callback: second });

		dispatchKey(target, { key: 'k', ctrlKey: true });
		expect(first).toHaveBeenCalledTimes(1);
		expect(second).not.toHaveBeenCalled();

		dispatchKey(target, { key: 'b', ctrlKey: true });
		expect(first).toHaveBeenCalledTimes(1);
		expect(second).toHaveBeenCalledTimes(1);
	});
});
