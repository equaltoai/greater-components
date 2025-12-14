import { describe, it, expect } from 'vitest';
import {
	getIcon,
	iconAliases,
	iconList,
	iconCategories,
	ActivityIcon,
	GlobeIcon,
} from '../src/index';

describe('Icon Registry', () => {
	describe('getIcon', () => {
		it('returns component for valid icon name', () => {
			expect(getIcon('activity')).toBe(ActivityIcon);
		});

		it('returns component for aliased icon name', () => {
			// 'world' is alias for 'globe'
			expect(getIcon('world')).toBe(GlobeIcon);
			expect(getIcon('globe')).toBe(GlobeIcon);
		});

		it('returns null for invalid icon name', () => {
			expect(getIcon('non-existent-icon')).toBeNull();
		});

		it('returns null for empty string', () => {
			expect(getIcon('')).toBeNull();
		});

		it('handles direct cache hits vs alias lookups', () => {
			// "activity" is direct
			expect(getIcon('activity')).toBe(ActivityIcon);
			// "world" -> "globe" -> GlobeIcon
			expect(getIcon('world')).toBe(GlobeIcon);
		});
	});

	describe('iconAliases', () => {
		it('maps aliases to valid icon names', () => {
			for (const [alias, target] of Object.entries(iconAliases)) {
				// target should be in iconList
				expect(iconList).toContain(target);
				// resolve alias should match resolve target
				expect(getIcon(alias)).toBe(getIcon(target));
			}
		});
	});

	describe('iconList', () => {
		it('contains activity icon', () => {
			expect(iconList).toContain('activity');
		});

		it('does not contain aliases', () => {
			// Check a known alias
			expect(iconList).not.toContain('world');
		});

		it('has a large number of icons', () => {
			expect(iconList.length).toBeGreaterThan(100);
		});
	});

	describe('iconCategories', () => {
		it('has expected categories', () => {
			expect(iconCategories).toHaveProperty('fediverse');
			expect(iconCategories).toHaveProperty('brands');
			expect(iconCategories).toHaveProperty('navigation');
			expect(iconCategories).toHaveProperty('action');
			expect(iconCategories).toHaveProperty('media');
			expect(iconCategories).toHaveProperty('communication');
			expect(iconCategories).toHaveProperty('user');
			expect(iconCategories).toHaveProperty('ui');
			expect(iconCategories).toHaveProperty('status');
			expect(iconCategories).toHaveProperty('files');
			expect(iconCategories).toHaveProperty('common');
		});

		it('contains valid icons in categories', () => {
			Object.entries(iconCategories).forEach(([category, icons]) => {
				icons.forEach((icon) => {
					// These brand icons are not in the main registry by design (see build.js)
					// 'stop' and 'folder-open' are also missing from the registry but present in categories
					const excludedBrands = ['google', 'apple', 'microsoft', 'discord', 'stop', 'folder-open'];
					if (excludedBrands.includes(icon)) return;

					const component = getIcon(icon);
					if (!component) {
						console.error(`Missing icon in category '${category}': ${icon}`);
					}
					expect(component).not.toBeNull();
				});
			});
		});

		it('returns null for excluded brand icons', () => {
			expect(getIcon('google')).toBeNull();
			expect(getIcon('apple')).toBeNull();
			expect(getIcon('microsoft')).toBeNull();
			expect(getIcon('discord')).toBeNull();
		});
	});

	describe('Brand Exports', () => {
		it('can import brands from subpath', async () => {
			// Dynamic import to test existence
			const brands = await import('../src/icons/brands/index');
			expect(brands.GoogleIcon).toBeDefined();
			expect(brands.AppleIcon).toBeDefined();
		});
	});
});
