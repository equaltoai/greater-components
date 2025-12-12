/**
 * Typeahead Behavior Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTypeahead } from '../src/behaviors/typeahead';

describe('Typeahead Behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		vi.useFakeTimers();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	function createItems(labels: string[]): HTMLButtonElement[] {
		return labels.map((label) => {
			const button = document.createElement('button');
			button.textContent = label;
			document.body.appendChild(button);
			return button;
		});
	}

	describe('Initialization', () => {
		it('should initialize with default config', () => {
			const typeahead = createTypeahead();

			expect(typeahead.state.buffer).toBe('');
			expect(typeahead.state.active).toBe(true);
			expect(typeahead.state.lastMatchIndex).toBe(-1);
		});
	});

	describe('Character Input', () => {
		it('should find matching item by prefix', () => {
			const items = createItems(['Apple', 'Banana', 'Cherry']);
			const onMatch = vi.fn();
			const typeahead = createTypeahead({ onMatch });

			const result = typeahead.handleChar('b', items);

			expect(result).toBe(1);
			expect(typeahead.state.buffer).toBe('b');
			expect(onMatch).toHaveBeenCalledWith(1, items[1]);
		});

		it('should accumulate characters in buffer', () => {
			const items = createItems(['Apple', 'Apricot', 'Banana']);
			const typeahead = createTypeahead();

			typeahead.handleChar('a', items);
			expect(typeahead.state.buffer).toBe('a');

			typeahead.handleChar('p', items);
			expect(typeahead.state.buffer).toBe('ap');

			typeahead.handleChar('r', items);
			expect(typeahead.state.buffer).toBe('apr');
			expect(typeahead.state.lastMatchIndex).toBe(1); // Apricot
		});

		it('should clear buffer after timeout', () => {
			const items = createItems(['Apple', 'Banana']);
			const onBufferChange = vi.fn();
			const typeahead = createTypeahead({
				timeout: 500,
				onBufferChange,
			});

			typeahead.handleChar('a', items);
			expect(typeahead.state.buffer).toBe('a');

			vi.advanceTimersByTime(500);

			expect(typeahead.state.buffer).toBe('');
			expect(onBufferChange).toHaveBeenLastCalledWith('');
		});

		it('should call onNoMatch when no match found', () => {
			const items = createItems(['Apple', 'Banana']);
			const onNoMatch = vi.fn();
			const typeahead = createTypeahead({ onNoMatch });

			const result = typeahead.handleChar('z', items);

			expect(result).toBe(-1);
			expect(onNoMatch).toHaveBeenCalledWith('z');
		});
	});

	describe('Match Modes', () => {
		it('should match by prefix (default)', () => {
			const items = createItems(['Apple', 'Pineapple', 'Banana']);
			const typeahead = createTypeahead({ matchMode: 'prefix' });

			const result = typeahead.search('pine', items);

			expect(result).toBe(1); // Pineapple
		});

		it('should match by substring', () => {
			const items = createItems(['Apple', 'Pineapple', 'Banana']);
			const typeahead = createTypeahead({ matchMode: 'substring' });

			const result = typeahead.search('apple', items);

			expect(result).toBe(0); // Apple (first match)
		});
	});

	describe('Case Sensitivity', () => {
		it('should be case-insensitive by default', () => {
			const items = createItems(['Apple', 'Banana']);
			const typeahead = createTypeahead();

			expect(typeahead.search('APPLE', items)).toBe(0);
			expect(typeahead.search('apple', items)).toBe(0);
		});

		it('should respect case sensitivity when enabled', () => {
			const items = createItems(['Apple', 'apple']);
			const typeahead = createTypeahead({ caseSensitive: true });

			expect(typeahead.search('Apple', items)).toBe(0);
			expect(typeahead.search('apple', items)).toBe(1);
		});
	});

	describe('Disabled Items', () => {
		it('should skip disabled items', () => {
			const items = createItems(['Apple', 'Banana', 'Avocado']);
			items[0].setAttribute('disabled', '');

			const typeahead = createTypeahead();
			const result = typeahead.search('a', items);

			expect(result).toBe(2); // Avocado (skips disabled Apple)
		});
	});

	describe('Wrap-around Search', () => {
		it('should wrap around when searching', () => {
			const items = createItems(['Apple', 'Banana', 'Apricot']);
			const typeahead = createTypeahead();

			// First search finds Apple
			typeahead.search('a', items);
			expect(typeahead.state.lastMatchIndex).toBe(0);

			// Clear and search again - should find Apricot (wraps from after Apple)
			typeahead.clear();
			typeahead.state.lastMatchIndex = 0;
			const result = typeahead.search('a', items);
			expect(result).toBe(2); // Apricot
		});
	});

	describe('Keyboard Handling', () => {
		it('should handle printable characters', () => {
			const items = createItems(['Apple', 'Banana']);
			const typeahead = createTypeahead();

			const event = new KeyboardEvent('keydown', { key: 'a' });
			const handled = typeahead.handleKeyDown(event, items);

			expect(handled).toBe(true);
			expect(typeahead.state.buffer).toBe('a');
		});

		it('should ignore modifier keys', () => {
			const items = createItems(['Apple', 'Banana']);
			const typeahead = createTypeahead();

			const ctrlEvent = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
			expect(typeahead.handleKeyDown(ctrlEvent, items)).toBe(false);

			const metaEvent = new KeyboardEvent('keydown', { key: 'a', metaKey: true });
			expect(typeahead.handleKeyDown(metaEvent, items)).toBe(false);
		});

		it('should handle Escape to clear buffer', () => {
			const items = createItems(['Apple', 'Banana']);
			const typeahead = createTypeahead();

			typeahead.handleChar('a', items);
			expect(typeahead.state.buffer).toBe('a');

			const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
			typeahead.handleKeyDown(escEvent, items);

			expect(typeahead.state.buffer).toBe('');
		});

		it('should handle Backspace to remove character', () => {
			const items = createItems(['Apple', 'Apricot', 'Banana']);
			const typeahead = createTypeahead();

			typeahead.handleChar('a', items);
			typeahead.handleChar('p', items);
			typeahead.handleChar('r', items);
			expect(typeahead.state.buffer).toBe('apr');

			const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
			typeahead.handleKeyDown(backspaceEvent, items);

			expect(typeahead.state.buffer).toBe('ap');
		});
	});

	describe('Cleanup', () => {
		it('should clear on destroy', () => {
			const items = createItems(['Apple', 'Banana']);
			const typeahead = createTypeahead();

			typeahead.handleChar('a', items);
			typeahead.destroy();

			expect(typeahead.state.buffer).toBe('');
			expect(typeahead.state.active).toBe(false);
		});
	});
});
