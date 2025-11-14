import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

const importStorage = async () => {
	vi.resetModules();
	return import('./storage');
};

describe('storage helpers', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('merges persisted objects with fallback defaults', async () => {
		const merged = { appearance: { density: 'compact' }, notifications: { email: true } };
		window.localStorage.setItem('settings', JSON.stringify(merged));

		const { loadPersistedState } = await importStorage();
		const result = loadPersistedState('settings', {
			appearance: { density: 'comfortable', theme: 'auto' },
			notifications: { email: false, push: false },
		});

		expect(result.appearance.density).toBe('compact');
		expect(result.appearance.theme).toBe('auto');
		expect(result.notifications.push).toBe(false);
		expect(result.notifications.email).toBe(true);
	});

	it('returns fallback when JSON parsing fails', async () => {
		window.localStorage.setItem('broken', '{not-json');
		const { loadPersistedState } = await importStorage();

		const fallback = { streaming: true };
		expect(loadPersistedState('broken', fallback)).toEqual(fallback);
	});

	it('no-ops when window is unavailable (SSR)', async () => {
		// Hide window before importing the module so the SSR path is exercised.
		const originalWindow = globalThis.window;
		vi.stubGlobal('window', undefined);
		const module = await import('./storage');
		vi.unstubAllGlobals();
		if (originalWindow) {
			globalThis.window = originalWindow;
		}

		expect(module.loadPersistedState('anything', 42)).toBe(42);
		expect(() => module.persistState('anything', 99)).not.toThrow();
	});
});
