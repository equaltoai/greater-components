import { describe, expect, it } from 'vitest';
import {
	getCSSVar,
	getColor,
	getSemanticColor,
	getTypography,
	getSpacing,
	getRadius,
	getShadow,
	getMotion,
} from '../src/index';

describe('token helpers', () => {
	it('exposes CSS variable helpers for core token categories', () => {
		const expectVar = (value: string) => expect(value).toMatch(/^var\(--gr-.*\)$/);

		expectVar(getCSSVar('color-primary-500'));
		expectVar(getColor('primary.500'));
		expectVar(getSemanticColor('foreground-primary'));
		expectVar(getTypography('fontSize-xl'));
		expectVar(getSpacing('4'));
		expectVar(getRadius('md'));
		expectVar(getShadow('sm'));
		expectVar(getMotion('duration-fast'));
	});
});
