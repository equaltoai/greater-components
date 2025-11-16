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

	it('supports debug mode logging', () => {
		const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const callback = vi.fn();
		const target = document.createElement('div');
		document.body.appendChild(target);

		const debugManager = new KeyboardShortcutManager({ debug: true, target });
		debugManager.register('test', { keys: 'ctrl+t', callback });
		
		// Trigger the shortcut to see debug logging
		dispatchKey(target, { key: 't', ctrlKey: true });

		debugManager.unregister('test');
		expect(warnSpy).toHaveBeenCalled();

		logSpy.mockRestore();
		warnSpy.mockRestore();
	});

	it('getShortcuts returns a copy of all registered shortcuts', () => {
		const manager = new KeyboardShortcutManager();
		const callback = vi.fn();

		manager.register('save', { keys: 'ctrl+s', callback });
		manager.register('open', { keys: 'ctrl+o', callback });

		const shortcuts = manager.getShortcuts();
		expect(shortcuts.size).toBe(2);
		expect(shortcuts.has('save')).toBe(true);
		expect(shortcuts.has('open')).toBe(true);

		// Verify it's a copy, not the original
		shortcuts.delete('save');
		expect(manager.getShortcuts().size).toBe(2);
	});

	it('setEnabled does nothing when shortcut does not exist', () => {
		const manager = new KeyboardShortcutManager();

		// Should not throw
		expect(() => manager.setEnabled('nonexistent', true)).not.toThrow();
		expect(() => manager.setEnabled('nonexistent', false)).not.toThrow();
	});

	it('supports alternative key combinations by registering multiple shortcuts', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const callback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		// Register both ctrl+s and cmd+s with the same callback
		manager.register('save-ctrl', { keys: 'ctrl+s', callback });
		manager.register('save-cmd', { keys: 'cmd+s', callback });

		// Test ctrl+s
		dispatchKey(target, { key: 's', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);

		// Test cmd+s (metaKey)
		dispatchKey(target, { key: 's', metaKey: true });
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it('supports modifier keys in various combinations', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const callback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('combo', { keys: 'ctrl+shift+alt+k', callback });

		dispatchKey(target, { key: 'k', ctrlKey: true, shiftKey: true, altKey: true });
		expect(callback).toHaveBeenCalledTimes(1);

		// Missing one modifier should not trigger
		dispatchKey(target, { key: 'k', ctrlKey: true, shiftKey: true });
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('handles special keys like Escape, Enter, Space', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const escCallback = vi.fn();
		const enterCallback = vi.fn();
		const spaceCallback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('escape', { keys: 'escape', callback: escCallback });
		manager.register('enter', { keys: 'enter', callback: enterCallback });
		manager.register('space', { keys: 'space', callback: spaceCallback });

		dispatchKey(target, { key: 'Escape' });
		expect(escCallback).toHaveBeenCalledTimes(1);

		dispatchKey(target, { key: 'Enter' });
		expect(enterCallback).toHaveBeenCalledTimes(1);

		dispatchKey(target, { key: ' ' });
		expect(spaceCallback).toHaveBeenCalledTimes(1);
	});

	it('handles arrow keys and function keys', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const arrowCallback = vi.fn();
		const functionCallback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('arrow', { keys: 'ctrl+arrowup', callback: arrowCallback });
		manager.register('function', { keys: 'f5', callback: functionCallback });

		dispatchKey(target, { key: 'ArrowUp', ctrlKey: true });
		expect(arrowCallback).toHaveBeenCalledTimes(1);

		dispatchKey(target, { key: 'F5' });
		expect(functionCallback).toHaveBeenCalledTimes(1);
	});

	it('supports allowInInput option for input elements', () => {
		const textarea = document.createElement('textarea');
		const contenteditable = document.createElement('div');
		contenteditable.setAttribute('contenteditable', 'true');
		document.body.appendChild(textarea);
		document.body.appendChild(contenteditable);

		const callback = vi.fn();
		const manager = new KeyboardShortcutManager({ target: window });

		// Should trigger with allowInInput: true in textarea
		manager.register('save-allowed', { keys: 'ctrl+a', callback, allowInInput: true });
		dispatchKey(textarea, { key: 'a', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);

		// Should also trigger in contenteditable with allowInInput: true
		const ceCallback = vi.fn();
		manager.register('ce-allowed', { keys: 'ctrl+e', callback: ceCallback, allowInInput: true });
		dispatchKey(contenteditable, { key: 'e', ctrlKey: true });
		expect(ceCallback).toHaveBeenCalledTimes(1);
	});

	it('cleans up properly when destroyed', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);

		const callback = vi.fn();
		const manager = new KeyboardShortcutManager({ target });

		manager.register('test', { keys: 'ctrl+t', callback });
		manager.destroy();

		// Should not trigger after destroy
		dispatchKey(target, { key: 't', ctrlKey: true });
		expect(callback).not.toHaveBeenCalled();

		// Should be able to recreate
		const newManager = new KeyboardShortcutManager({ target });
		newManager.register('test', { keys: 'ctrl+t', callback });
		dispatchKey(target, { key: 't', ctrlKey: true });
		expect(callback).toHaveBeenCalledTimes(1);
		newManager.destroy();
	});
});
