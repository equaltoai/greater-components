import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SseClient } from '../SseClient';

describe('SseClient Branch Coverage', () => {
	let mockFetch: any;
	let abortSpy: any;
	let originalFetch: any;
	let originalAbortController: any;
	let originalEventSource: any;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();

		originalFetch = globalThis.fetch;
		originalAbortController = globalThis.AbortController;
		originalEventSource = globalThis.EventSource;

		mockFetch = vi.fn();
		globalThis.fetch = mockFetch;

		abortSpy = vi.fn();
		globalThis.AbortController = class {
			signal = {} as any;
			abort = abortSpy;
		} as any;

		globalThis.EventSource = class {
			static OPEN = 1;
			static CLOSED = 2;
			static CONNECTING = 0;
			readyState = 0;
			close() {}
			addEventListener() {}
			removeEventListener() {}
		} as any;
	});

	afterEach(() => {
		vi.useRealTimers();
		globalThis.fetch = originalFetch;
		globalThis.AbortController = originalAbortController;
		globalThis.EventSource = originalEventSource;
	});

	const createControllableStream = () => {
		let controller: ReadableStreamDefaultController;
		const stream = new ReadableStream({
			start(c) {
				controller = c;
			},
		});
		return {
			stream,
			enqueue: (text: string) => {
				const encoder = new TextEncoder();
				controller.enqueue(encoder.encode(text));
			},
			close: () => controller.close(),
		};
	};

	describe('connectWithFetch', () => {
		it('should connect using fetch when headers are present', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
			});

			const { stream } = createControllableStream();
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: 'OK',
				body: stream,
			});

			client.connect();

			// Wait for async connect
			await vi.advanceTimersByTimeAsync(0);

			expect(mockFetch).toHaveBeenCalled();
			expect(mockFetch.mock.calls[0][1].headers['X-Custom']).toBe('value');
			expect(client.getState().status).toBe('connected');
		});

		it('should handle response not ok', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
			});

			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found',
			});

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			expect(client.getState().error?.message).toContain('404');
		});

		it('should handle empty body', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
			});

			mockFetch.mockResolvedValue({
				ok: true,
				body: null,
			});

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			expect(client.getState().error?.message).toContain('Response body is empty');
		});

		it('should handle fetch error', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
			});

			mockFetch.mockRejectedValue(new Error('Network error'));

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			expect(client.getState().error?.message).toContain('Network error');
		});

		it('should ignore AbortError', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
			});

			const error = new Error('Aborted');
			error.name = 'AbortError';
			mockFetch.mockRejectedValue(error);

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			// Should not transition to error state if aborted
			expect(client.getState().error).toBeNull();
		});

		it('should process different line types', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
			});

			const { stream, enqueue, close } = createControllableStream();
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				body: stream,
			});

			const messageHandler = vi.fn();
			client.on('test', messageHandler);

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			enqueue('id: 123\nevent: test\nretry: 1000\ndata: {"data":{"foo":"bar"}}\n\n');

			await vi.waitUntil(() => client.getState().lastEventId === '123');
			await vi.waitUntil(() => messageHandler.mock.calls.length > 0);

			expect(client.getState().lastEventId).toBe('123');
			expect(messageHandler).toHaveBeenCalled();

			close();
		});
	});

	describe('handleMessage', () => {
		it('should handle pong message', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
			});

			const timestamp = Date.now();
			const pongMsg = JSON.stringify({ type: 'pong', timestamp });

			const { stream, enqueue, close } = createControllableStream();
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				body: stream,
			});

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			// Set pending ping manually via any cast AFTER connect (which clears it)
			(client as any).pendingPings.set(timestamp, Date.now() - 50);

			enqueue(`data: ${pongMsg}\n\n`);
			await vi.waitUntil(() => client.getState().latency !== null);

			expect(client.getState().latency).toBeGreaterThanOrEqual(50);

			close();
		});
	});

	describe('scheduleReconnect', () => {
		it('should use server suggested retry', async () => {
			const client = new SseClient({
				url: 'https://example.com/sse',
				headers: { 'X-Custom': 'value' },
				initialReconnectDelay: 100,
				jitterFactor: 0,
			});

			const { stream, enqueue, close } = createControllableStream();
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				body: stream,
			});

			const reconnectHandler = vi.fn();
			client.on('reconnecting', reconnectHandler);

			client.connect();
			await vi.advanceTimersByTimeAsync(0);

			enqueue('retry: 500\n\n');
			await vi.advanceTimersByTimeAsync(0);

			// Now fail connection
			close();
			await vi.advanceTimersByTimeAsync(0);

			expect(client.getState().status).toBe('reconnecting');
			expect(reconnectHandler).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({ delay: 500 }),
				})
			);
		});
	});
});
