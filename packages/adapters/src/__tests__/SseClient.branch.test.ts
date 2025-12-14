import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SseClient } from '../SseClient';

describe('SseClient Branch Coverage', () => {
	let mockFetch: any;
	let abortSpy: any;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();

		// Mock EventSource globally
		globalThis.EventSource = class MockEventSource {
			static CONNECTING = 0;
			static OPEN = 1;
			static CLOSED = 2;
			close() {}
		} as any;

		mockFetch = vi.fn();
		globalThis.fetch = mockFetch;

		abortSpy = vi.fn();
		globalThis.AbortController = class {
			signal = {} as any;
			abort = abortSpy;
		} as any;
	});

	afterEach(() => {
		vi.runAllTimers();
		vi.useRealTimers();
	});

	it('connects using fetch and processes stream lines', async () => {
		const client = new SseClient({
			url: 'https://example.com/sse',
			headers: { 'X-Custom': 'value' }, // Forces fetch usage
		});

		const onMessage = vi.fn();
		client.on('message', onMessage);

		const stream = new ReadableStream({
			start(controller) {
				const encoder = new TextEncoder();
				controller.enqueue(encoder.encode('id: 1\n'));
				controller.enqueue(encoder.encode('event: custom\n'));
				controller.enqueue(encoder.encode('retry: 1000\n'));
				controller.enqueue(encoder.encode('data: {"foo":"bar"}\n\n'));
				controller.close();
			},
		});

		mockFetch.mockResolvedValue({
			ok: true,
			body: stream,
		});

		client.connect();

		// Wait for stream processing
		await vi.advanceTimersByTimeAsync(100);

		expect(mockFetch).toHaveBeenCalled();
		expect(onMessage).toHaveBeenCalled();
		const call = onMessage.mock.calls[0];
		expect(call).toBeDefined();
		const msg = call?.[0].data;
		expect(msg.type).toBe('custom');
		expect(msg.foo).toBe('bar');

		const state = client.getState();
		expect(state.lastEventId).toBe('1');
	});

	it('handles fetch errors and retries', async () => {
		const client = new SseClient({
			url: 'https://example.com/sse',
			headers: { 'X-Custom': 'value' },
			initialReconnectDelay: 50,
		});

		// Fail once
		mockFetch.mockRejectedValueOnce(new Error('Network error'));
		// Succeed second time
		const stream = new ReadableStream({
			start(controller) {
				controller.close();
			},
		});
		mockFetch.mockResolvedValue({ ok: true, body: stream });

		client.connect();
		expect(client.getState().status).toBe('connecting');

		await vi.advanceTimersByTimeAsync(100); // Allow retry

		expect(mockFetch).toHaveBeenCalledTimes(2);
		client.destroy();
	});

	it('handles non-ok response', async () => {
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
		await vi.advanceTimersByTimeAsync(10);

		expect(client.getState().error?.message).toContain('404');
	});

	it('handles empty body', async () => {
		const client = new SseClient({
			url: 'https://example.com/sse',
			headers: { 'X-Custom': 'value' },
		});

		mockFetch.mockResolvedValue({
			ok: true,
			body: null,
		});

		client.connect();
		await vi.advanceTimersByTimeAsync(10);

		expect(client.getState().error?.message).toContain('Response body is empty');
	});

	it('parses malformed JSON gracefully', async () => {
		const client = new SseClient({
			url: 'https://example.com/sse',
			headers: { 'X-Custom': 'value' },
		});

		const onMessage = vi.fn();
		client.on('message', onMessage);

		const stream = new ReadableStream({
			start(controller) {
				const encoder = new TextEncoder();
				controller.enqueue(encoder.encode('data: not json\n\n'));
				controller.close();
			},
		});

		mockFetch.mockResolvedValue({ ok: true, body: stream });

		client.connect();
		await vi.advanceTimersByTimeAsync(100);

		expect(onMessage).toHaveBeenCalled();
		const call = onMessage.mock.calls[0];
		const msg = call?.[0]?.data;
		expect(msg?.data).toBe('not json');
	});

	it('handles ping/pong event types', async () => {
		const client = new SseClient({
			url: 'https://example.com/sse',
			headers: { 'X-Custom': 'value' },
		});

		const onLatency = vi.fn();
		const onError = vi.fn();
		client.on('latency', onLatency);
		client.on('error', onError);

		client.on('open', () => {
			// Manually inject pending ping after startHeartbeat clears it
			(client as any).pendingPings.set(123, Date.now() - 50);
		});

		const stream = new ReadableStream({
			start(controller) {
				const encoder = new TextEncoder();
				// Server sends pong
				const pong = JSON.stringify({ type: 'pong', timestamp: 123 });
				controller.enqueue(encoder.encode(`data: ${pong}\n\n`));
				controller.close();
			},
		});

		mockFetch.mockResolvedValue({ ok: true, body: stream });

		client.connect();
		await vi.advanceTimersByTimeAsync(100);

		if (onError.mock.calls.length > 0) {
			console.error('SseClient error:', onError.mock.calls[0]?.[0]);
		}

		expect(onLatency).toHaveBeenCalled();
		expect(client.getState().latency).toBeGreaterThanOrEqual(50);
	});
});
