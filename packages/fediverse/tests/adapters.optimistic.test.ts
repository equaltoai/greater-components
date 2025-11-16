import { afterEach, describe, expect, it, vi } from 'vitest';
import { OptimisticManager, OptimisticState } from '../src/adapters/optimistic';

afterEach(() => {
	vi.useRealTimers();
});

describe('OptimisticManager', () => {
	it('applies pending optimistic updates while operations resolve', async () => {
		vi.useFakeTimers();
		const manager = new OptimisticManager<{ count: number }>({ timeout: 1000 });
		const baseState = { count: 0 };

		const promise = manager.add(
			'inc',
			(state) => ({ count: state.count + 1 }),
			(state) => ({ count: state.count - 1 }),
			async () => 'ok'
		);

		// While pending, optimistic state reflects the change
		expect(manager.applyAll(baseState).count).toBe(1);

		await expect(promise).resolves.toBe('ok');
		await vi.runAllTimersAsync();

		const stats = manager.getStats();
		expect(stats.total).toBe(1);
		expect(stats.confirmed).toBe(1);
		expect(stats.reverted).toBe(0);
	});

	it('rejects duplicate ids and maximum pending constraints', async () => {
		vi.useFakeTimers();
		const manager = new OptimisticManager({ maxPending: 1 });
		const okOperation = () => Promise.resolve('ok');

		await manager.add(
			'only',
			(s) => s,
			(s) => s,
			okOperation
		);

		await expect(
			manager.add(
				'only',
				(s) => s,
				(s) => s,
				okOperation
			)
		).rejects.toThrowError(/already exists/);

		await expect(
			manager.add(
				'second',
				(s) => s,
				(s) => s,
				okOperation
			)
		).rejects.toThrowError(/Maximum pending updates/);

		await vi.runAllTimersAsync();
	});

	it('reverts updates when an operation times out', async () => {
		vi.useFakeTimers();
		const manager = new OptimisticManager<{ count: number }>({ timeout: 10 });
		const promise = manager.add(
			'timeout',
			(state) => ({ count: state.count + 1 }),
			(state) => ({ count: state.count - 1 }),
			() =>
				new Promise(() => {
					/* never resolve */
				})
		);
		const handledPromise = promise.catch((error) => error);

		await vi.advanceTimersByTimeAsync(20);
		await expect(handledPromise).resolves.toEqual(
			expect.objectContaining({ message: expect.stringContaining('timed out') })
		);
		expect(manager.applyAll({ count: 0 }).count).toBe(0);
		expect(manager.getStats().reverted).toBe(1);
		await vi.runAllTimersAsync();
	});

	it('blocks duplicate ids until cleanup completes', async () => {
		vi.useFakeTimers();
		const manager = new OptimisticManager({ timeout: 50 });
		const ok = () => Promise.resolve('ok');

		await expect(
			manager.add(
				'dup',
				(s) => s,
				(s) => s,
				ok
			)
		).resolves.toBe('ok');
		await expect(
			manager.add(
				'dup',
				(s) => s,
				(s) => s,
				ok
			)
		).rejects.toThrow(/already exists/);

		await vi.advanceTimersByTimeAsync(1000);
		await expect(
			manager.add(
				'dup',
				(s) => s,
				(s) => s,
				ok
			)
		).resolves.toBe('ok');
	});

	it('applies multiple pending updates and enforces maxPending', async () => {
		vi.useFakeTimers();
		const manager = new OptimisticManager<{ value: number }>({ maxPending: 2, timeout: 2_000 });
		const slow = () =>
			new Promise<string>((resolve) => {
				setTimeout(() => resolve('ok'), 1_000);
			});

		const firstPromise = manager.add(
			'first',
			(s) => ({ value: s.value + 1 }),
			(s) => ({ value: s.value - 1 }),
			slow
		);
		const secondPromise = manager.add(
			'second',
			(s) => ({ value: s.value + 5 }),
			(s) => ({ value: s.value - 5 }),
			slow
		);

		await expect(
			manager.add(
				'third',
				(s) => s,
				(s) => s,
				slow
			)
		).rejects.toThrow(/Maximum pending updates/);

		expect(manager.applyAll({ value: 0 }).value).toBe(6);

		await vi.advanceTimersByTimeAsync(1_000);
		await expect(firstPromise).resolves.toBe('ok');
		await expect(secondPromise).resolves.toBe('ok');
	});
});

describe('OptimisticState', () => {
	it('reverts base state when an update operation fails', async () => {
		vi.useFakeTimers();
		const state = new OptimisticState({ value: 1 });

		const updatePromise = state.update(
			(current) => ({ value: current.value + 1 }),
			(current) => ({ value: current.value - 1 }),
			async () => {
				throw new Error('network down');
			}
		);

		await expect(updatePromise).rejects.toThrow('network down');
		expect(state.getState().value).toBe(0);

		const stats = state.getStats();
		expect(stats.reverted).toBe(1);

		await vi.runAllTimersAsync();
	});
});
