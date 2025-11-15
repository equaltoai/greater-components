import { afterEach, describe, expect, it, vi } from 'vitest';
import { RequestBatcher } from '../src/adapters/batcher';

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe('RequestBatcher', () => {
	it('flushes when reaching maxBatchSize and updates stats', async () => {
		const executor = vi.fn(async (requests: string[]) => requests.map((req) => `${req}:ok`));
		const batcher = new RequestBatcher(executor, { maxBatchSize: 2, maxWaitTime: 5 });

		const first = batcher.add('a');
		const second = batcher.add('b');

		await expect(first).resolves.toBe('a:ok');
		await expect(second).resolves.toBe('b:ok');

		expect(executor).toHaveBeenCalledTimes(1);
		expect(executor).toHaveBeenCalledWith(['a', 'b']);
		expect(batcher.getStats()).toMatchObject({
			queueSize: 0,
			totalBatches: 1,
			totalRequests: 2,
			avgBatchSize: 2,
		});
	});

	it('flushes pending requests after maxWaitTime elapses', async () => {
		vi.useFakeTimers();
		const executor = vi.fn(async (requests: string[]) => requests.map((req) => `${req}:done`));
		const batcher = new RequestBatcher(executor, { maxBatchSize: 5, maxWaitTime: 25 });

		const first = batcher.add('x');
		const second = batcher.add('y');

		expect(executor).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(25);

		await expect(first).resolves.toBe('x:done');
		await expect(second).resolves.toBe('y:done');
		expect(executor).toHaveBeenCalledTimes(1);
	});

	it('propagates executor errors to all queued requests', async () => {
		const error = new Error('batch failed');
		const executor = vi.fn().mockRejectedValue(error);
		const batcher = new RequestBatcher(executor, { maxBatchSize: 10, maxWaitTime: 10 });

		const first = batcher.add('one');
		const second = batcher.add('two');

		await batcher.flush();

		await expect(first).rejects.toThrow('batch failed');
		await expect(second).rejects.toThrow('batch failed');
		expect(batcher.getStats().totalBatches).toBe(1);
	});

	it('clear() rejects pending requests and empties the queue', async () => {
		vi.useFakeTimers();
		const executor = vi.fn(async (requests: string[]) => requests.map((req) => req));
		const batcher = new RequestBatcher(executor, { maxBatchSize: 3, maxWaitTime: 50 });

		const first = batcher.add('pending-1');
		const second = batcher.add('pending-2');

		batcher.clear();
		await expect(first).rejects.toThrow('Batcher cleared');
		await expect(second).rejects.toThrow('Batcher cleared');

		expect(batcher.getStats().queueSize).toBe(0);

		// ensure clearing cancels scheduled flushes
		await vi.advanceTimersByTimeAsync(50);
		expect(executor).not.toHaveBeenCalled();
	});

	it('rejects when executor returns an unexpected response count', async () => {
		const executor = vi.fn(async () => ['one']);
		const batcher = new RequestBatcher(executor, { maxBatchSize: 2, maxWaitTime: 5 });

		const first = batcher.add('one');
		const second = batcher.add('two');

		await expect(first).rejects.toThrow(/returned 1 responses for 2 requests/);
		await expect(second).rejects.toThrow(/returned 1 responses for 2 requests/);
		expect(batcher.getStats().totalBatches).toBe(1);
	});

	it('schedules follow-up flushes when a batch leaves residual queue items', async () => {
		vi.useFakeTimers();
		const executor = vi.fn(async (requests: string[]) => requests.map((req) => `${req}:ok`));
		const batcher = new RequestBatcher(executor, { maxBatchSize: 2, maxWaitTime: 10 });

		const first = batcher.add('a');
		const second = batcher.add('b');
		const third = batcher.add('c');

		await expect(first).resolves.toBe('a:ok');
		await expect(second).resolves.toBe('b:ok');
		expect(executor).toHaveBeenCalledTimes(1);
		expect(batcher.getStats().queueSize).toBe(1);

		await vi.advanceTimersByTimeAsync(10);
		await expect(third).resolves.toBe('c:ok');
		expect(executor).toHaveBeenCalledTimes(2);
	});

	it('clears scheduled timeouts after a manual flush', async () => {
		vi.useFakeTimers();
		const executor = vi.fn(async (requests: string[]) => requests);
		const batcher = new RequestBatcher(executor, { maxBatchSize: 5, maxWaitTime: 20 });

		const pending = batcher.add('manual');

		await batcher.flush();
		await expect(pending).resolves.toBe('manual');

		await vi.advanceTimersByTimeAsync(50);
		expect(executor).toHaveBeenCalledTimes(1);
	});
});
