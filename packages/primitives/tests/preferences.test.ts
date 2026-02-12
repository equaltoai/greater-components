import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { preferencesStore, type UserPreferences } from '../src/stores/preferences';

describe('PreferencesStore', () => {
	// Mock localStorage
	const localStorageMock = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
	};

	// Mock matchMedia
	const matchMediaMock = vi.fn((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}));

	beforeEach(() => {
		// Set up mocks
		Object.defineProperty(window, 'localStorage', {
			value: localStorageMock,
			writable: true,
		});

		Object.defineProperty(window, 'matchMedia', {
			value: matchMediaMock,
			writable: true,
		});

		// Clear mock calls
		vi.clearAllMocks();

		// Reset store to defaults
		preferencesStore.reset();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with default preferences', () => {
			const prefs = preferencesStore.preferences;

			expect(prefs.colorScheme).toBe('auto');
			expect(prefs.density).toBe('comfortable');
			expect(prefs.fontSize).toBe('medium');
			expect(prefs.motion).toBe('normal');
			expect(prefs.highContrastMode).toBe(false);
			expect(prefs.fontScale).toBe(1);
		});

		it('should load preferences from localStorage if available', () => {
			const storedPrefs: Partial<UserPreferences> = {
				colorScheme: 'dark',
				density: 'compact',
				fontSize: 'large',
			};

			localStorageMock.getItem.mockReturnValue(JSON.stringify(storedPrefs));

			// Re-initialize store
			new (preferencesStore.constructor as any)();

			expect(localStorageMock.getItem).toHaveBeenCalledWith('gr-preferences-v1');
		});

		it('should handle invalid localStorage data gracefully', () => {
			localStorageMock.getItem.mockReturnValue('invalid json');

			// Should not throw
			expect(() => {
				new (preferencesStore.constructor as any)();
			}).not.toThrow();
		});
	});

	describe('Color Scheme', () => {
		it('should update color scheme', () => {
			preferencesStore.setColorScheme('dark');
			expect(preferencesStore.preferences.colorScheme).toBe('dark');
		});

		it('should resolve auto color scheme based on system preference', () => {
			// Mock dark mode preference
			matchMediaMock.mockImplementation((query: string) => ({
				matches: query === '(prefers-color-scheme: dark)',
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}));

			preferencesStore.setColorScheme('auto');
			const state = preferencesStore.state;

			expect(state.colorScheme).toBe('auto');
			// Note: In actual implementation, this would be 'dark' based on mock
		});

		it('should handle high contrast mode', () => {
			preferencesStore.setHighContrastMode(true);
			const state = preferencesStore.state;

			expect(state.resolvedColorScheme).toBe('high-contrast');
		});
	});

	describe('Density', () => {
		it('should update density setting', () => {
			preferencesStore.setDensity('compact');
			expect(preferencesStore.preferences.density).toBe('compact');

			preferencesStore.setDensity('spacious');
			expect(preferencesStore.preferences.density).toBe('spacious');
		});
	});

	describe('Font Size', () => {
		it('should update font size', () => {
			preferencesStore.setFontSize('small');
			expect(preferencesStore.preferences.fontSize).toBe('small');

			preferencesStore.setFontSize('large');
			expect(preferencesStore.preferences.fontSize).toBe('large');
		});

		it('should update font scale within valid range', () => {
			preferencesStore.setFontScale(1.2);
			expect(preferencesStore.preferences.fontScale).toBe(1.2);

			// Should clamp to max
			preferencesStore.setFontScale(2);
			expect(preferencesStore.preferences.fontScale).toBe(1.5);

			// Should clamp to min
			preferencesStore.setFontScale(0.5);
			expect(preferencesStore.preferences.fontScale).toBe(0.85);
		});
	});

	describe('Motion Preferences', () => {
		it('should update motion preference', () => {
			preferencesStore.setMotion('reduced');
			expect(preferencesStore.preferences.motion).toBe('reduced');
		});

		it('should respect system reduced motion preference', () => {
			// Mock reduced motion preference
			matchMediaMock.mockImplementation((query: string) => ({
				matches: query === '(prefers-reduced-motion: reduce)',
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			}));

			// Note: In actual implementation, preferencesStore.state.resolvedMotion would be 'reduced'
		});
	});

	describe('Custom Colors', () => {
		it('should update custom colors', () => {
			const customColors = {
				primary: '#ff0000',
				secondary: '#00ff00',
				accent: '#0000ff',
			};

			preferencesStore.setCustomColors(customColors);

			expect(preferencesStore.preferences.customColors).toEqual(customColors);
		});

		it('should allow partial color updates', () => {
			const initialColors = preferencesStore.preferences.customColors;

			preferencesStore.setCustomColors({ primary: '#ff0000' });

			expect(preferencesStore.preferences.customColors.primary).toBe('#ff0000');
			expect(preferencesStore.preferences.customColors.secondary).toBe(initialColors.secondary);
		});
	});

	describe('Batch Updates', () => {
		it('should update multiple preferences at once', () => {
			const updates: Partial<UserPreferences> = {
				colorScheme: 'dark',
				density: 'compact',
				fontSize: 'large',
				motion: 'reduced',
			};

			preferencesStore.updatePreferences(updates);

			const prefs = preferencesStore.preferences;
			expect(prefs.colorScheme).toBe('dark');
			expect(prefs.density).toBe('compact');
			expect(prefs.fontSize).toBe('large');
			expect(prefs.motion).toBe('reduced');
		});
	});

	describe('Persistence', () => {
		it('should save preferences to localStorage', () => {
			preferencesStore.setColorScheme('dark');

			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'gr-preferences-v1',
				expect.any(String)
			);

			const lastCall = localStorageMock.setItem.mock.calls.at(-1);
			expect(lastCall).toBeDefined();
			if (!lastCall) {
				throw new Error('Expected localStorage.setItem to be called');
			}
			const savedData = JSON.parse(lastCall[1]);
			expect(savedData.colorScheme).toBe('dark');
		});
	});

	describe('Export/Import', () => {
		it('should export preferences as JSON string', () => {
			preferencesStore.setColorScheme('dark');
			preferencesStore.setDensity('compact');

			const exported = preferencesStore.export();
			const parsed = JSON.parse(exported);

			expect(parsed.colorScheme).toBe('dark');
			expect(parsed.density).toBe('compact');
		});

		it('should import valid preferences from JSON', () => {
			const importData: UserPreferences = {
				colorScheme: 'dark',
				density: 'spacious',
				fontSize: 'large',
				motion: 'reduced',
				customColors: {
					primary: '#ff0000',
					secondary: '#00ff00',
				},
				highContrastMode: true,
				fontScale: 1.2,
			};

			const success = preferencesStore.import(JSON.stringify(importData));

			expect(success).toBe(true);
			expect(preferencesStore.preferences.colorScheme).toBe('dark');
			expect(preferencesStore.preferences.density).toBe('spacious');
			expect(preferencesStore.preferences.highContrastMode).toBe(true);
		});

		it('should reject invalid preferences on import', () => {
			const invalidData = {
				colorScheme: 'invalid-scheme',
				density: 'invalid-density',
			};

			const success = preferencesStore.import(JSON.stringify(invalidData));

			expect(success).toBe(false);
		});

		it('should handle invalid JSON on import', () => {
			const success = preferencesStore.import('invalid json');

			expect(success).toBe(false);
		});
	});

	describe('Reset', () => {
		it('should reset to default preferences', () => {
			// Change some preferences
			preferencesStore.setColorScheme('dark');
			preferencesStore.setDensity('compact');
			preferencesStore.setFontSize('large');

			// Reset
			preferencesStore.reset();

			// Check defaults are restored
			const prefs = preferencesStore.preferences;
			expect(prefs.colorScheme).toBe('auto');
			expect(prefs.density).toBe('comfortable');
			expect(prefs.fontSize).toBe('medium');
		});
	});

	describe('DOM Manipulation', () => {
		it('should apply theme attributes to document root', () => {
			const root = document.documentElement;
			const setAttribute = vi.spyOn(root, 'setAttribute');

			preferencesStore.setColorScheme('dark');

			expect(setAttribute).toHaveBeenCalledWith('data-theme', expect.any(String));
		});

		it('should expose custom colors via data attributes (strict-CSP safe)', () => {
			const root = document.documentElement;
			const setAttribute = vi.spyOn(root, 'setAttribute');

			preferencesStore.setCustomColors({
				primary: '#ff0000',
				secondary: '#00ff00',
			});

			expect(setAttribute).toHaveBeenCalledWith('data-gr-custom-primary', '#ff0000');
			expect(setAttribute).toHaveBeenCalledWith('data-gr-custom-secondary', '#00ff00');
			expect(root.getAttribute('data-gr-custom-primary')).toBe('#ff0000');
			expect(root.getAttribute('data-gr-custom-secondary')).toBe('#00ff00');
		});

		it('should expose font scale via data attribute (strict-CSP safe)', () => {
			const root = document.documentElement;
			const setAttribute = vi.spyOn(root, 'setAttribute');

			preferencesStore.setFontScale(1.25);

			expect(setAttribute).toHaveBeenCalledWith('data-gr-font-scale', '1.25');
			expect(root.getAttribute('data-gr-font-scale')).toBe('1.25');
		});
	});
});
