import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

const VALID_THEMES = new Set(['light', 'dark', 'high-contrast']);
const VALID_DENSITIES = new Set(['compact', 'comfortable', 'spacious']);

const normalizeTheme = (value?: string | null) => {
	if (!value) return null;
	const normalized = value.toLowerCase();
	return VALID_THEMES.has(normalized) ? (normalized as 'light' | 'dark' | 'high-contrast') : null;
};

const normalizeDensity = (value?: string | null) => {
	if (!value) return null;
	const normalized = value.toLowerCase();
	return VALID_DENSITIES.has(normalized) ? (normalized as 'compact' | 'comfortable' | 'spacious') : null;
};

export const load = (() => {
	const testTheme = normalizeTheme(env.TEST_THEME);
	const testDensity = normalizeDensity(env.TEST_DENSITY);

	return {
		testTheme,
		testDensity,
	};
}) satisfies LayoutServerLoad;
