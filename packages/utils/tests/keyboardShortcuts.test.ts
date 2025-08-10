import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  KeyboardShortcutManager,
  createShortcutManager,
  formatShortcut,
  getPlatformShortcut
} from '../src/keyboardShortcuts';

describe('KeyboardShortcutManager', () => {
  let manager: KeyboardShortcutManager;
  let mockCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    manager = new KeyboardShortcutManager();
    mockCallback = vi.fn();
  });

  afterEach(() => {
    manager.destroy();
  });

  it('should register and trigger shortcuts', () => {
    manager.register('save', {
      keys: 'ctrl+s',
      callback: mockCallback
    });

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    });

    window.dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalledWith(event);
  });

  it('should handle cmd as meta key', () => {
    manager.register('save', {
      keys: 'cmd+s',
      callback: mockCallback
    });

    const event = new KeyboardEvent('keydown', {
      key: 's',
      metaKey: true
    });

    window.dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalledWith(event);
  });

  it('should handle multiple modifiers', () => {
    manager.register('action', {
      keys: 'ctrl+shift+a',
      callback: mockCallback
    });

    const event = new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
      shiftKey: true
    });

    window.dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalledWith(event);
  });

  it('should not trigger disabled shortcuts', () => {
    manager.register('save', {
      keys: 'ctrl+s',
      callback: mockCallback,
      enabled: false
    });

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    });

    window.dispatchEvent(event);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not trigger in input elements by default', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    manager.register('save', {
      keys: 'ctrl+s',
      callback: mockCallback
    });

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true
    });

    input.dispatchEvent(event);
    expect(mockCallback).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('should trigger in input elements when allowed', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    manager.register('save', {
      keys: 'ctrl+s',
      callback: mockCallback,
      allowInInput: true
    });

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
      bubbles: true
    });

    input.dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalledWith(event);

    document.body.removeChild(input);
  });

  it('should unregister shortcuts', () => {
    manager.register('save', {
      keys: 'ctrl+s',
      callback: mockCallback
    });

    manager.unregister('save');

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    });

    window.dispatchEvent(event);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should enable/disable shortcuts', () => {
    manager.register('save', {
      keys: 'ctrl+s',
      callback: mockCallback
    });

    manager.setEnabled('save', false);

    const event1 = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    });

    window.dispatchEvent(event1);
    expect(mockCallback).not.toHaveBeenCalled();

    manager.setEnabled('save', true);

    const event2 = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    });

    window.dispatchEvent(event2);
    expect(mockCallback).toHaveBeenCalledWith(event2);
  });

  it('should get all shortcuts', () => {
    const shortcut = {
      keys: 'ctrl+s',
      callback: mockCallback
    };

    manager.register('save', shortcut);
    const shortcuts = manager.getShortcuts();

    expect(shortcuts.size).toBe(1);
    expect(shortcuts.get('save')).toEqual(shortcut);
  });

  it('should clear all shortcuts', () => {
    manager.register('save', {
      keys: 'ctrl+s',
      callback: mockCallback
    });

    manager.clear();

    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    });

    window.dispatchEvent(event);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should handle special keys', () => {
    const shortcuts = [
      { keys: 'escape', key: 'Escape' },
      { keys: 'space', key: ' ' },
      { keys: 'enter', key: 'Enter' },
      { keys: 'tab', key: 'Tab' }
    ];

    shortcuts.forEach(({ keys, key }) => {
      const callback = vi.fn();
      manager.register(keys, {
        keys,
        callback
      });

      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
      expect(callback).toHaveBeenCalled();
      manager.unregister(keys);
    });
  });
});

describe('createShortcutManager', () => {
  it('should create manager with initial shortcuts', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const manager = createShortcutManager({
      save: {
        keys: 'ctrl+s',
        callback: callback1
      },
      open: {
        keys: 'ctrl+o',
        callback: callback2
      }
    });

    const shortcuts = manager.getShortcuts();
    expect(shortcuts.size).toBe(2);

    manager.destroy();
  });
});

describe('formatShortcut', () => {
  it('should format shortcuts in long form', () => {
    expect(formatShortcut('ctrl+s')).toBe('Ctrl+S');
    expect(formatShortcut('cmd+shift+a')).toMatch(/(?:Cmd|Win)\+Shift\+A/);
    expect(formatShortcut('alt+tab')).toMatch(/(?:Option|Alt)\+TAB/);
  });

  it('should format shortcuts in short form for Mac', () => {
    // Mock Mac platform
    const originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform');
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true
    });

    expect(formatShortcut('cmd+s', 'short')).toBe('⌘S');
    expect(formatShortcut('ctrl+shift+a', 'short')).toBe('⌃⇧A');
    expect(formatShortcut('alt+tab', 'short')).toBe('⌥TAB');

    // Restore original platform
    if (originalPlatform) {
      Object.defineProperty(navigator, 'platform', originalPlatform);
    }
  });
});

describe('getPlatformShortcut', () => {
  it('should return Mac shortcut on Mac platform', () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform');
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true
    });

    expect(getPlatformShortcut('ctrl+s', 'cmd+s')).toBe('cmd+s');

    if (originalPlatform) {
      Object.defineProperty(navigator, 'platform', originalPlatform);
    }
  });

  it('should return Windows shortcut on Windows platform', () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform');
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true
    });

    expect(getPlatformShortcut('ctrl+s', 'cmd+s')).toBe('ctrl+s');

    if (originalPlatform) {
      Object.defineProperty(navigator, 'platform', originalPlatform);
    }
  });
});