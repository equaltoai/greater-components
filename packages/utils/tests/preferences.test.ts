import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPreferenceStore } from '../src/preferences';

describe('createPreferenceStore', () => {
	const key = 'test_prefs';
	const defaults = { theme: 'light', notifications: true };

	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	it('initializes with defaults', () => {
		const store = createPreferenceStore(key, defaults);
		expect(store.get()).toEqual(defaults);
	});

	it('loads from localStorage', () => {
		const stored = { theme: 'dark', notifications: false };
		localStorage.setItem(key, JSON.stringify(stored));

		const store = createPreferenceStore(key, defaults);
		expect(store.get()).toEqual(stored);
	});

	it('updates values and persists', () => {
		const store = createPreferenceStore(key, defaults);
		store.set('theme', 'dark');

		expect(store.get().theme).toBe('dark');
		const storedValue = localStorage.getItem(key);
		expect(storedValue).not.toBeNull();
		expect(JSON.parse(storedValue as string)).toEqual({
			...defaults,
			theme: 'dark',
		});
	});

	it('updates multiple values', () => {
		const store = createPreferenceStore(key, defaults);
		store.update({ theme: 'dark', notifications: false });

		expect(store.get()).toEqual({ theme: 'dark', notifications: false });
	});

	it('resets to defaults', () => {
		const store = createPreferenceStore(key, defaults);
		store.set('theme', 'dark');
		store.reset();

		expect(store.get()).toEqual(defaults);
	});

	it('notifies subscribers', () => {
		const store = createPreferenceStore(key, defaults);
		const spy = vi.fn();

		const unsubscribe = store.subscribe(spy);

		// Called immediately with current value
		expect(spy).toHaveBeenCalledWith(defaults);

		store.set('theme', 'dark');
		expect(spy).toHaveBeenCalledWith({ ...defaults, theme: 'dark' });

		unsubscribe();
		store.set('theme', 'light');
		expect(spy).toHaveBeenCalledTimes(2); // Initial + 1 update
	});

	it('exports and imports JSON', () => {
		const store = createPreferenceStore(key, defaults);
		store.set('theme', 'dark');

		const json = store.export();
		const parsed = JSON.parse(json);
		expect(parsed).toEqual({ ...defaults, theme: 'dark' });

		const newStore = createPreferenceStore('other_key', defaults);
		const success = newStore.import(json);
		expect(success).toBe(true);
		expect(newStore.get()).toEqual({ ...defaults, theme: 'dark' });
	});
});
