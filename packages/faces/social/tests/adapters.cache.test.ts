import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdapterCache, createCacheKey } from '../src/adapters/cache';

afterEach(() => {
	vi.useRealTimers();
});

describe('AdapterCache', () => {
	it('sets, gets, and expires entries based on TTL', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

		const cache = new AdapterCache<string>({ defaultTTL: 100 });
		cache.set('user:1', 'alpha');

		expect(cache.get('user:1')).toBe('alpha');

		vi.setSystemTime(new Date('2024-01-01T00:00:00Z').getTime() + 200);
		expect(cache.get('user:1')).toBeUndefined();

		const stats = cache.getStats();
		expect(stats.hits).toBe(1);
		expect(stats.misses).toBe(1);
	});

	it('evicts least recently used entries and supports invalidation', () => {
		const cache = new AdapterCache<string>({ maxSize: 2, defaultTTL: 10_000 });

		cache.set('a', 'first');
		cache.set('b', 'second');
		expect(cache.has('a')).toBe(true);
		expect(cache.has('b')).toBe(true);

		// Access "a" to make it most recently used, then insert "c" to evict "b"
		cache.get('a');
		cache.set('c', 'third');

		expect(cache.has('a')).toBe(true);
		expect(cache.has('b')).toBe(false);
		expect(cache.has('c')).toBe(true);

		expect(cache.invalidate(/c/)).toBe(1);
		expect(cache.has('c')).toBe(false);
	});

	it('revalidates entries and builds cache keys', () => {
		const cache = new AdapterCache<number>({ defaultTTL: 50 });
		const key = createCacheKey('actor', 42, null, undefined, true);

		cache.set(key, 10, 5);
		expect(cache.get(key)).toBe(10);

		// overwrite with a longer TTL to ensure the entry is revalidated
		cache.set(key, 20, 100);
		expect(cache.get(key)).toBe(20);
	});

	it('returns zero when invalidate finds no matches and honors custom TTL values', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

		const cache = new AdapterCache<string>({ defaultTTL: 100 });
		cache.set('persist', 'kept', 200);
		cache.set('default', 'short');

		expect(cache.invalidate(/missing/)).toBe(0);

		// Advance beyond the default TTL but within the custom TTL
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z').getTime() + 150);
		expect(cache.get('persist')).toBe('kept');
		expect(cache.get('default')).toBeUndefined();
	});

	it('evicts oldest entries when overflowing maxSize repeatedly', () => {
		const cache = new AdapterCache<string>({ maxSize: 2, defaultTTL: 10_000 });
		cache.set('first', '1');
		cache.set('second', '2');
		cache.get('first'); // make second the LRU entry

		cache.set('third', '3');
		expect(cache.has('second')).toBe(false);
		expect(cache.has('first')).toBe(true);
		expect(cache.has('third')).toBe(true);

		cache.set('fourth', '4');
		expect(cache.has('first')).toBe(false);
		expect(cache.has('third')).toBe(true);
		expect(cache.has('fourth')).toBe(true);
	});

	it('builds cache keys while ignoring nullish parts', () => {
		expect(createCacheKey('actor', null, undefined, true, false)).toBe('actor:true:false');
	});
});
