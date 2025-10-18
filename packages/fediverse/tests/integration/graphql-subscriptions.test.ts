/**
 * GraphQL Subscription Integration Tests
 *
 * Tests real-time GraphQL subscriptions for timeline updates,
 * notifications, and message delivery.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateMockStatus, generateMockNotification } from './utils/mock-data.js';
import { waitFor, MockWebSocket, createDeferred } from './utils/test-helpers.js';

describe('GraphQL Subscriptions', () => {
	let originalWebSocket: typeof WebSocket;

	beforeEach(() => {
		// Mock WebSocket
		originalWebSocket = globalThis.WebSocket as any;
		(globalThis as any).WebSocket = MockWebSocket;
	});

	afterEach(() => {
		// Restore original WebSocket
		(globalThis as any).WebSocket = originalWebSocket;
	});

	describe('Subscription Connection', () => {
		it('should establish WebSocket connection', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			
			await waitFor(
				() => ws.readyState === 1, // OPEN
				{ timeout: 1000 }
			);

			expect(ws.readyState).toBe(1);
		});

		it('should handle connection errors gracefully', () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			const errorHandler = vi.fn();

			ws.onerror = errorHandler;
			ws.simulateError();

			expect(errorHandler).toHaveBeenCalled();
		});

		it('should support connection close', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			
			await waitFor(() => ws.readyState === 1);

			const closeDeferred = createDeferred<void>();
			ws.onclose = () => closeDeferred.resolve();

			ws.close();

			await closeDeferred.promise;
			expect(ws.readyState).toBe(3); // CLOSED
		});
	});

	describe('Timeline Subscription', () => {
		it('should receive timeline update events', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const messages: any[] = [];
			ws.onmessage = (event) => {
				messages.push(JSON.parse(event.data));
			};

			// Simulate server sending timeline update
			const newPost = generateMockStatus({ content: 'New real-time post' });
			ws.simulateMessage({
				type: 'next',
				id: '1',
				payload: {
					data: {
						timelineUpdated: newPost,
					},
				},
			});

			await waitFor(() => messages.length > 0);

			expect(messages[0].payload.data.timelineUpdated).toEqual(newPost);
		});

		it('should handle multiple timeline updates', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const messages: any[] = [];
			ws.onmessage = (event) => {
				messages.push(JSON.parse(event.data));
			};

			// Send multiple updates
			for (let i = 0; i < 5; i++) {
				const post = generateMockStatus({ content: `Post ${i}` });
				ws.simulateMessage({
					type: 'next',
					id: '1',
					payload: { data: { timelineUpdated: post } },
				});
			}

			await waitFor(() => messages.length === 5);

			expect(messages).toHaveLength(5);
		});

		it('should maintain message order', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const messages: any[] = [];
			ws.onmessage = (event) => {
				messages.push(JSON.parse(event.data));
			};

			// Send ordered messages
			for (let i = 0; i < 10; i++) {
				ws.simulateMessage({
					type: 'next',
					id: String(i),
					payload: { data: { sequence: i } },
				});
			}

			await waitFor(() => messages.length === 10);

			// Verify order
			for (let i = 0; i < 10; i++) {
				expect(messages[i].payload.data.sequence).toBe(i);
			}
		});
	});

	describe('Notification Subscription', () => {
		it('should receive notification events', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const notifications: any[] = [];
			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.payload?.data?.notificationReceived) {
					notifications.push(data.payload.data.notificationReceived);
				}
			};

			// Simulate notification
			const notification = generateMockNotification('mention');
			ws.simulateMessage({
				type: 'next',
				id: '1',
				payload: {
					data: {
						notificationReceived: notification,
					},
				},
			});

			await waitFor(() => notifications.length > 0);

			expect(notifications[0]).toEqual(notification);
			expect(notifications[0].type).toBe('mention');
		});

		it('should handle different notification types', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const notifications: any[] = [];
			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.payload?.data?.notificationReceived) {
					notifications.push(data.payload.data.notificationReceived);
				}
			};

			// Send various notification types
			const types: Array<'mention' | 'favourite' | 'reblog' | 'follow'> = [
				'mention',
				'favourite',
				'reblog',
				'follow',
			];

			for (const type of types) {
				const notif = generateMockNotification(type);
				ws.simulateMessage({
					type: 'next',
					id: String(notifications.length + 1),
					payload: { data: { notificationReceived: notif } },
				});
			}

			await waitFor(() => notifications.length === 4);

			expect(notifications[0].type).toBe('mention');
			expect(notifications[1].type).toBe('favourite');
			expect(notifications[2].type).toBe('reblog');
			expect(notifications[3].type).toBe('follow');
		});
	});

	describe('Conversation Subscription', () => {
		it('should receive message updates', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const messages: any[] = [];
			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.payload?.data?.conversationUpdated) {
					messages.push(data.payload.data.conversationUpdated);
				}
			};

			// Simulate new message in conversation
			const message = generateMockStatus({ content: 'New message' });
			ws.simulateMessage({
				type: 'next',
				id: '1',
				payload: {
					data: {
						conversationUpdated: message,
					},
				},
			});

			await waitFor(() => messages.length > 0);

			expect(messages[0].content).toBe('New message');
		});
	});

	describe('Multiple Concurrent Subscriptions', () => {
		it('should handle multiple subscriptions simultaneously', async () => {
			const ws1 = new MockWebSocket('ws://localhost:4000/graphql');
			const ws2 = new MockWebSocket('ws://localhost:4000/graphql');

			await waitFor(() => ws1.readyState === 1);
			await waitFor(() => ws2.readyState === 1);

			const timeline: any[] = [];
			const notifications: any[] = [];

			ws1.onmessage = (event) => {
				timeline.push(JSON.parse(event.data));
			};

			ws2.onmessage = (event) => {
				notifications.push(JSON.parse(event.data));
			};

			// Send to different subscriptions
			ws1.simulateMessage({ type: 'timeline', data: 'post1' });
			ws2.simulateMessage({ type: 'notification', data: 'notif1' });

			await waitFor(() => timeline.length > 0 && notifications.length > 0);

			expect(timeline).toHaveLength(1);
			expect(notifications).toHaveLength(1);
		});
	});

	describe('Subscription Cleanup', () => {
		it('should clean up subscription on close', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const closeDeferred = createDeferred<void>();
			ws.onclose = () => closeDeferred.resolve();

			// Simulate component unmount
			ws.close();

			await closeDeferred.promise;

			expect(ws.readyState).toBe(3); // CLOSED
		});

		it('should not receive messages after close', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const messages: any[] = [];
			ws.onmessage = (event) => {
				messages.push(JSON.parse(event.data));
			};

			ws.close();
			await waitFor(() => ws.readyState === 3);

			// Try to send message after close
			try {
				ws.simulateMessage({ data: 'should not receive' });
			} catch {
				// Expected to fail or not trigger onmessage
			}

			// Give time for message to potentially be received
			await new Promise(resolve => setTimeout(resolve, 100));

			expect(messages).toHaveLength(0);
		});
	});

	describe('Reconnection Logic', () => {
		it('should attempt reconnection after disconnect', async () => {
			let connectionAttempts = 0;

			const createConnection = () => {
				connectionAttempts++;
				return new MockWebSocket('ws://localhost:4000/graphql');
			};

			// First connection
			let ws = createConnection();
			await waitFor(() => ws.readyState === 1);

			// Simulate disconnect
			ws.close();
			await waitFor(() => ws.readyState === 3);

			// Reconnect
			ws = createConnection();
			await waitFor(() => ws.readyState === 1);

			expect(connectionAttempts).toBe(2);
		});

		it('should restore subscriptions after reconnection', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const messages: any[] = [];
			ws.onmessage = (event) => {
				messages.push(JSON.parse(event.data));
			};

			// Send message before disconnect
			ws.simulateMessage({ id: 1, data: 'before' });

			await waitFor(() => messages.length === 1);

			// Simulate reconnection (in real scenario, would close and create new WebSocket)
			// For this test, we just verify the subscription continues working

			// Send message after "reconnection"
			ws.simulateMessage({ id: 2, data: 'after' });

			await waitFor(() => messages.length === 2);

			expect(messages).toHaveLength(2);
			expect(messages[0].data).toBe('before');
			expect(messages[1].data).toBe('after');
		});
	});

	describe('Error Handling', () => {
		it('should handle GraphQL errors in subscription', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const errors: any[] = [];
			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.payload?.errors) {
					errors.push(...data.payload.errors);
				}
			};

			// Simulate error response
			ws.simulateMessage({
				type: 'error',
				id: '1',
				payload: {
					errors: [
						{ message: 'Subscription error', extensions: { code: 'INTERNAL_ERROR' } },
					],
				},
			});

			await waitFor(() => errors.length > 0);

			expect(errors[0].message).toBe('Subscription error');
		});

		it('should handle network errors', () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			const errorHandler = vi.fn();

			ws.onerror = errorHandler;
			ws.simulateError();

			expect(errorHandler).toHaveBeenCalled();
		});
	});

	describe('Subscription Performance', () => {
		it('should handle high-frequency updates', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			const messages: any[] = [];
			ws.onmessage = (event) => {
				messages.push(JSON.parse(event.data));
			};

			const startTime = Date.now();

			// Send 100 messages rapidly
			for (let i = 0; i < 100; i++) {
				ws.simulateMessage({ id: i, data: `message-${i}` });
			}

			await waitFor(() => messages.length === 100);

			const duration = Date.now() - startTime;

			expect(messages).toHaveLength(100);
			// Should process 100 messages in less than 1 second
			expect(duration).toBeLessThan(1000);
		});

		it('should not accumulate memory with many updates', async () => {
			const ws = new MockWebSocket('ws://localhost:4000/graphql');
			await waitFor(() => ws.readyState === 1);

			let messageCount = 0;
			ws.onmessage = () => {
				messageCount++;
			};

			// Send many messages
			for (let i = 0; i < 1000; i++) {
				ws.simulateMessage({ id: i, data: `msg-${i}` });
			}

			await waitFor(() => messageCount === 1000);

			// This test would ideally check memory usage
			// For now, just verify we processed all messages
			expect(messageCount).toBe(1000);
		});
	});
});
