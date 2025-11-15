import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	debounce,
	debounceImmediate,
	throttle,
	rafThrottle,
	memoize,
	batch,
	lazy,
	createLRUCache,
} from '../src/performance';

afterEach(() => {
	vi.clearAllMocks();
	vi.useRealTimers();
});

describe('performance utilities', () => {
	it('debounce executes once after the wait period and uses the latest call', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('first');
		debounced('second');

		expect(fn).not.toHaveBeenCalled();
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('second');
	});

	it('throttle supports leading and trailing execution respecting the limit', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

		const fn = vi.fn();
		const throttled = throttle(fn, 100);

		throttled('first');
		expect(fn).toHaveBeenCalledTimes(1);

		throttled('second');
		expect(fn).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(2);
		expect(fn).toHaveBeenLastCalledWith('second');
	});

	it('throttle honors a trailing-only configuration when leading is disabled', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

		const fn = vi.fn();
		const throttled = throttle(fn, 75, { leading: false });

		throttled('initial');
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(75);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('initial');

		throttled('next');
		vi.advanceTimersByTime(75);

		expect(fn).toHaveBeenCalledTimes(2);
		expect(fn).toHaveBeenLastCalledWith('next');
	});

	it('throttle can disable trailing execution entirely', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const throttled = throttle(fn, 50, { trailing: false });

		throttled('first');
		throttled('second');
		expect(fn).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('rafThrottle runs at most once per animation frame', () => {
		vi.useFakeTimers();

		const rafSpy = vi
			.fn((cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as number)
			.mockName('requestAnimationFrame');

		vi.stubGlobal('requestAnimationFrame', rafSpy);

		const fn = vi.fn();
		const throttled = rafThrottle(fn);

		throttled();
		throttled();

		expect(rafSpy).toHaveBeenCalledTimes(1);
		expect(fn).not.toHaveBeenCalled();

		vi.runOnlyPendingTimers();
		expect(fn).toHaveBeenCalledTimes(1);

		throttled();
		vi.runOnlyPendingTimers();

		expect(fn).toHaveBeenCalledTimes(2);
	});

	it('debounceImmediate handles immediate and delayed branches plus cancel', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

		const fn = vi.fn();

		const trailing = debounceImmediate(fn, 40, false);
		trailing('first');
		trailing('second');
		trailing.cancel();
		vi.advanceTimersByTime(40);
		expect(fn).not.toHaveBeenCalled();

		trailing('third');
		vi.advanceTimersByTime(40);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('third');

		const immediate = debounceImmediate(fn, 40, true);
		immediate('instant');
		immediate('suppressed');
		expect(fn).toHaveBeenCalledTimes(2);

		vi.advanceTimersByTime(40);
		immediate('after-wait');
		expect(fn).toHaveBeenCalledTimes(3);
		expect(fn).toHaveBeenLastCalledWith('after-wait');
	});

	it('memoize caches results and respects a custom key resolver', () => {
		const compute = vi.fn((a: number, b: number) => a + b);
		const memoized = memoize(compute, (a, b) => `${a}-${b}`);

		expect(memoized(1, 2)).toBe(3);
		expect(memoized(1, 2)).toBe(3);
		expect(compute).toHaveBeenCalledTimes(1);
		expect(memoized.cache.get('1-2')).toBe(3);

		expect(memoized(2, 3)).toBe(5);
		expect(compute).toHaveBeenCalledTimes(2);

		// Colliding resolver keys reuse the cached value even with different params
		const collisionMemo = memoize(compute, () => 'same');
		expect(collisionMemo(10, 20)).toBe(30);
		expect(collisionMemo(99, 1)).toBe(30);
		expect(compute).toHaveBeenCalled();
	});

	it('batch aggregates calls and resets after flushing', () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const batched = batch(fn, 20);

		batched('a');
		batched('b');
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(20);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(['a', 'b']);

		batched('c');
		vi.advanceTimersByTime(20);
		expect(fn).toHaveBeenCalledTimes(2);
		expect(fn).toHaveBeenLastCalledWith(['c']);
	});

	it('lazy caches the loaded module and shares a pending promise', async () => {
		vi.useFakeTimers();

		const loader = vi.fn(
			() =>
				new Promise<{ value: number }>((resolve) => {
					setTimeout(() => resolve({ value: Date.now() }), 10);
				})
		);

		const load = lazy(loader);
		const first = load();
		const second = load();

		await vi.advanceTimersByTimeAsync(10);
		const [resolved, resolvedAgain] = await Promise.all([first, second]);
		expect(resolved).toBe(resolvedAgain);
		expect(resolved).toEqual({ value: expect.any(Number) });
		expect(loader).toHaveBeenCalledTimes(1);

		const cached = await load();
		expect(cached).toBe(resolved);
		expect(loader).toHaveBeenCalledTimes(1);
	});

	it('createLRUCache evicts the least recently used entry and supports mutations', () => {
		const cache = createLRUCache<string, number>(2);

		cache.set('a', 1);
		cache.set('b', 2);

		expect(cache.size()).toBe(2);
		expect(cache.get('a')).toBe(1); // marks "a" as most recently used

		cache.set('c', 3);
		expect(cache.has('b')).toBe(false);
		expect(cache.get('a')).toBe(1);
		expect(cache.get('c')).toBe(3);

		expect(cache.delete('a')).toBe(true);
		expect(cache.has('a')).toBe(false);

		cache.clear();
		expect(cache.size()).toBe(0);
	});
});
