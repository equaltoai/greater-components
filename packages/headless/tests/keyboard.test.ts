import { describe, expect, it } from 'vitest';
import {
	isActivationKey,
	isEscapeKey,
	isArrowKey,
	isTabKey,
	getArrowKeyDirection,
	getNavigationDirection,
} from '../src/utils/keyboard';

const keyEvent = (key: string) => new KeyboardEvent('keydown', { key });

describe('keyboard utils', () => {
	it('detects activation, escape, arrow, and tab keys', () => {
		expect(isActivationKey(keyEvent('Enter'))).toBe(true);
		expect(isActivationKey(keyEvent('Spacebar'))).toBe(true);
		expect(isActivationKey(keyEvent('A'))).toBe(false);

		expect(isEscapeKey(keyEvent('Escape'))).toBe(true);
		expect(isEscapeKey(keyEvent('Esc'))).toBe(true);

		expect(isArrowKey(keyEvent('ArrowLeft'))).toBe(true);
		expect(isArrowKey(keyEvent('ArrowFoo'))).toBe(false);

		expect(isTabKey(keyEvent('Tab'))).toBe(true);
	});

	it('maps arrow keys to directions and handles navigation orientation', () => {
		expect(getArrowKeyDirection(keyEvent('ArrowDown'))).toBe('down');
		expect(getArrowKeyDirection(keyEvent('Home'))).toBeNull();

		expect(getNavigationDirection(keyEvent('Home'))).toBe('first');
		expect(getNavigationDirection(keyEvent('End'))).toBe('last');
		expect(getNavigationDirection(keyEvent('ArrowDown'), 'vertical')).toBe('next');
		expect(getNavigationDirection(keyEvent('ArrowUp'), 'vertical')).toBe('previous');
		expect(getNavigationDirection(keyEvent('ArrowRight'), 'horizontal')).toBe('next');
		expect(getNavigationDirection(keyEvent('ArrowLeft'), 'horizontal')).toBe('previous');
		expect(getNavigationDirection(keyEvent('Tab'), 'horizontal')).toBeNull();
	});
});
