import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SseClient } from '../SseClient.js';

describe('SseClient Coverage', () => {
	let client: SseClient;
	const mockStorage = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		length: 0,
		key: vi.fn(),
	};

	const mockFetch = vi.fn();
	// Mock EventSource - though global stubbing is tricky in some envs, we keep it for structure
	let mockEsInstance: any;
	const mockEventSource = vi.fn(function () {
		mockEsInstance = {
			addEventListener: vi.fn(),
			close: vi.fn(),
			readyState: 0, // CONNECTING
		};
		return mockEsInstance;
	});

	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal('fetch', mockFetch);
		vi.stubGlobal('EventSource', mockEventSource);

		// Ensure it's on window/globalThis for jsdom
		Object.defineProperty(globalThis, 'fetch', { value: mockFetch, writable: true });
		Object.defineProperty(globalThis, 'EventSource', { value: mockEventSource, writable: true });

		mockFetch.mockReset();
		mockEventSource.mockClear();
		mockEsInstance = undefined;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		if (client) {
			client.destroy();
		}
	});

	describe('connect flow', () => {
		it('executes connect path with headers', () => {
			client = new SseClient({
				url: 'http://example.com',
				headers: { 'X-Custom': 'value' },
			});

			vi.spyOn(client as any, 'connectWithFetch').mockResolvedValue(undefined);

			client.connect();
		});
	});

	describe('connectWithFetch logic', () => {
		it('uses fetch and handles stream', async () => {
			client = new SseClient({
				url: 'http://example.com',
				headers: { 'X-Custom': 'value' },
			});

			const mockReader = {
				read: vi
					.fn()
					.mockResolvedValueOnce({
						done: false,
						value: new TextEncoder().encode('data: hello\n\n'),
					})
					.mockResolvedValueOnce({ done: true }),
			};

			mockFetch.mockResolvedValue({
				ok: true,
				body: {
					getReader: () => mockReader,
				},
			});

			const messageSpy = vi.fn();
			client.on('message', messageSpy);

			await (client as any).connectWithFetch('http://example.com/');

			expect(mockFetch).toHaveBeenCalled();
			expect(messageSpy).toHaveBeenCalledWith(expect.objectContaining({ data: 'hello' }));
		});

		it('handles fetch errors', async () => {
			client = new SseClient({
				url: 'http://example.com',
				logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any,
			});

			mockFetch.mockRejectedValue(new Error('Network error'));
			const scheduleReconnectSpy = vi.spyOn(client as any, 'scheduleReconnect');

			await (client as any).connectWithFetch('http://example.com/');

			expect(scheduleReconnectSpy).toHaveBeenCalled();
		});

		it('handles stream split across chunks', async () => {
			client = new SseClient({
				url: 'http://example.com',
			});

			const mockReader = {
				read: vi
					.fn()
					.mockResolvedValueOnce({
						done: false,
						value: new TextEncoder().encode('event: update\ndata: part1'),
					}) // Incomplete
					.mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('part2\n\n') }) // Completes it
					.mockResolvedValueOnce({ done: true }),
			};

			mockFetch.mockResolvedValue({
				ok: true,
				body: { getReader: () => mockReader },
			});

			const messageSpy = vi.fn();
			client.on('update', messageSpy);

			await (client as any).connectWithFetch('http://example.com/');

			expect(messageSpy).toHaveBeenCalledWith(expect.objectContaining({ data: 'part1part2' }));
		});
	});

	describe('Heartbeat & Latency', () => {
		it('sends ping via fetch logic', async () => {
			client = new SseClient({
				url: 'http://example.com',
				headers: { Auth: '123' },
			});

			await (client as any).sendPing({ type: 'ping', timestamp: 123 });

			expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/ping'), expect.any(Object));
		});
	});

	describe('Storage & Parsing', () => {
		it('handles JSON parse errors', async () => {
			client = new SseClient({
				url: 'http://example.com',
			});

			const mockReader = {
				read: vi
					.fn()
					.mockResolvedValueOnce({
						done: false,
						value: new TextEncoder().encode('data: {invalid json\n\n'),
					})
					.mockResolvedValueOnce({ done: true }),
			};

			mockFetch.mockResolvedValue({
				ok: true,
				body: { getReader: () => mockReader },
			});

			const messageSpy = vi.fn();
			client.on('message', messageSpy);

			await (client as any).connectWithFetch('http://example.com/');

			expect(messageSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					data: '{invalid json',
				})
			);
		});

		it('handles retry instruction', async () => {
			client = new SseClient({ url: 'http://example.com' });
			(client as any).processLine('retry: 5000');
			expect(client['serverSuggestedRetry']).toBe(5000);
		});

		it('handles id instruction', async () => {
			client = new SseClient({
				url: 'http://example.com',
				storage: mockStorage,
			});
			(client as any).processLine('id: 12345');
			expect(mockStorage.setItem).toHaveBeenCalledWith('sse_last_event_id', '12345');
		});

		it('handles storage errors', () => {
			const throwingStorage = {
				...mockStorage,
				getItem: () => {
					throw new Error();
				},
			};
			client = new SseClient({ url: 'http://example.com', storage: throwingStorage });
			expect(client.getState().lastEventId).toBeNull();
		});
	});
});
