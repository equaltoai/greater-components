import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	LesserHostSoulClient,
	LesserHostSoulClientError,
	type SoulCommSendRequest,
} from '../soul/client';

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	});
}

describe('LesserHostSoulClient', () => {
	const fetchMock = vi.fn();
	let client: LesserHostSoulClient;

	beforeEach(() => {
		fetchMock.mockReset();
		client = new LesserHostSoulClient({
			baseUrl: 'https://lesser.host/',
			fetch: fetchMock,
			headers: {
				authorization: 'Bearer test-token',
			},
		});
	});

	it('updates channel preferences with JSON request bodies', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				agentId: 'agent-1',
				contactPreferences: {
					preferred: 'email',
					availability: { schedule: 'always' },
					responseExpectation: { target: '24h', guarantee: 'best-effort' },
					languages: ['en'],
				},
				updatedAt: '2026-03-07T00:00:00Z',
			})
		);

		await client.updateAgentChannelPreferences('agent-1', {
			contactPreferences: {
				preferred: 'email',
				availability: { schedule: 'always' },
				responseExpectation: { target: '24h', guarantee: 'best-effort' },
				languages: ['en'],
			},
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://lesser.host/api/v1/soul/agents/agent-1/channels/preferences',
			expect.any(Object)
		);
		expect(init.method).toBe('PUT');
		expect(headers.get('content-type')).toBe('application/json');
		expect(headers.get('authorization')).toBe('Bearer test-token');
		expect(init.body).toBe(
			JSON.stringify({
				contactPreferences: {
					preferred: 'email',
					availability: { schedule: 'always' },
					responseExpectation: { target: '24h', guarantee: 'best-effort' },
					languages: ['en'],
				},
			})
		);
	});

	it('serializes soul search query params', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				version: '1',
				results: [],
				count: 0,
				has_more: false,
			})
		);

		await client.searchAgents({
			domain: 'example.com',
			capability: 'email',
			channel: 'email',
			cursor: 'cursor-1',
			limit: 10,
			principal: '0x1234567890abcdef1234567890abcdef12345678',
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/api/v1/soul/search');
		expect(parsed.searchParams.get('domain')).toBe('example.com');
		expect(parsed.searchParams.get('capability')).toBe('email');
		expect(parsed.searchParams.get('channel')).toBe('email');
		expect(parsed.searchParams.get('cursor')).toBe('cursor-1');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(parsed.searchParams.get('principal')).toBe('0x1234567890abcdef1234567890abcdef12345678');
	});

	it('sends outbound communication requests', async () => {
		const request: SoulCommSendRequest = {
			channel: 'email',
			agentId: 'agent-1',
			to: 'artist@example.com',
			subject: 'Hello',
			body: 'Checking in.',
		};

		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				messageId: 'msg-1',
				status: 'accepted',
				channel: 'email',
				agentId: 'agent-1',
				to: 'artist@example.com',
				createdAt: '2026-03-07T00:00:00Z',
			})
		);

		const response = await client.sendCommunication(request);

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(response.messageId).toBe('msg-1');
		expect(init.method).toBe('POST');
		expect(init.body).toBe(JSON.stringify(request));
	});

	it('fetches communication delivery status', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				messageId: 'msg-1',
				status: 'sent',
				channel: 'email',
				agentId: 'agent-1',
				to: 'artist@example.com',
				createdAt: '2026-03-07T00:00:00Z',
				updatedAt: '2026-03-07T00:05:00Z',
			})
		);

		const response = await client.getCommunicationStatus('msg-1');

		expect(response.status).toBe('sent');
		expect(fetchMock).toHaveBeenCalledWith(
			'https://lesser.host/api/v1/soul/comm/status/msg-1',
			expect.any(Object)
		);
	});

	it('surfaces typed lesser-host comm errors', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					error: {
						code: 'comm.rate_limited',
						message: 'Too many requests',
						request_id: 'req-123',
					},
				},
				429
			)
		);

		try {
			await client.sendCommunication({
				channel: 'email',
				agentId: 'agent-1',
				to: 'artist@example.com',
				body: 'Checking in.',
			});
			throw new Error('Expected sendCommunication to throw');
		} catch (error) {
			expect(error).toBeInstanceOf(LesserHostSoulClientError);
			expect(error).toMatchObject({
				name: 'LesserHostSoulClientError',
				status: 429,
				code: 'comm.rate_limited',
				requestId: 'req-123',
			});
		}
	});
});
