import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	LesserSoulClient,
	LesserSoulClientError,
	type LesserSoulIncorporateResponse,
	type LesserSoulsMineResponse,
} from '../lesser/client';

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	});
}

describe('LesserSoulClient', () => {
	const fetchMock = vi.fn();
	const originalFetch = globalThis.fetch;
	let client: LesserSoulClient;

	beforeEach(() => {
		fetchMock.mockReset();
		globalThis.fetch = originalFetch;
		client = new LesserSoulClient({
			baseUrl: 'https://lesser.example/',
			fetch: fetchMock,
			headers: {
				authorization: 'Bearer test-token',
			},
		});
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('fetches soul inventory and preserves ens_name for consumers', async () => {
		const responseBody: LesserSoulsMineResponse = {
			count: 1,
			souls: [
				{
					agent: {
						agent_id: 'agent-1',
						domain: 'lesser.example',
						ens_name: 'agent-1.lessersoul.eth',
						local_id: 'local-1',
						status: 'active',
						wallet: '0x1234567890abcdef1234567890abcdef12345678',
					},
					available_for_incorporation: true,
					binding_state: 'available',
				},
			],
		};

		fetchMock.mockResolvedValueOnce(jsonResponse(responseBody));

		const response = await client.getMySouls();
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);

		expect(url).toBe('https://lesser.example/api/v1/souls/mine');
		expect(headers.get('authorization')).toBe('Bearer test-token');
		expect(response.souls[0]?.agent.ens_name).toBe('agent-1.lessersoul.eth');
	});

	it('incorporates a soul by agent id', async () => {
		const responseBody: LesserSoulIncorporateResponse = {
			soul: {
				agent: {
					agent_id: 'agent-1',
					domain: 'lesser.example',
					ens_name: 'agent-1.lessersoul.eth',
					local_id: 'local-1',
					status: 'active',
					wallet: '0x1234567890abcdef1234567890abcdef12345678',
				},
				available_for_incorporation: false,
				binding_state: 'bound',
				binding: {
					agent_username: 'agent-owner',
					bound_at: '2026-03-08T00:00:00Z',
					updated_at: '2026-03-08T00:00:00Z',
				},
			},
		};

		fetchMock.mockResolvedValueOnce(jsonResponse(responseBody));

		const response = await client.incorporateSoul('agent-1', 'owner-agent');
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);

		expect(url).toBe('https://lesser.example/api/v1/souls/agent-1/incorporate');
		expect(init.method).toBe('POST');
		expect(headers.get('content-type')).toBe('application/json');
		expect(init.body).toBe(JSON.stringify({ target_agent_username: 'owner-agent' }));
		expect(response.soul.binding?.agent_username).toBe('agent-owner');
	});

	it('rejects blank agent ids', async () => {
		await expect(client.incorporateSoul('   ', 'owner-agent')).rejects.toThrow(
			'agentId is required'
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects blank target agent usernames', async () => {
		await expect(client.incorporateSoul('agent-1', '   ')).rejects.toThrow(
			'targetAgentUsername is required'
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces response errors with status and message', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					message: 'Soul not found',
				},
				404
			)
		);

		try {
			await client.incorporateSoul('missing-agent', 'owner-agent');
			throw new Error('Expected incorporateSoul to throw');
		} catch (error) {
			expect(error).toBeInstanceOf(LesserSoulClientError);
			expect(error).toMatchObject({
				name: 'LesserSoulClientError',
				status: 404,
				message: 'Soul not found',
			});
		}
	});

	it('wraps the default browser fetch so it keeps the global receiver', async () => {
		const browserFetch = vi.fn(function (
			this: typeof globalThis,
			_input: RequestInfo | URL,
			_init?: RequestInit
		) {
			if (this !== globalThis) {
				throw new TypeError("Failed to execute 'fetch' on 'Window': Illegal invocation");
			}

			return Promise.resolve(
				jsonResponse({
					count: 0,
					souls: [],
				})
			);
		});

		globalThis.fetch = browserFetch as typeof globalThis.fetch;

		const browserClient = new LesserSoulClient({
			baseUrl: 'https://lesser.example/',
		});

		await expect(browserClient.getMySouls()).resolves.toMatchObject({
			count: 0,
			souls: [],
		});
		expect(browserFetch).toHaveBeenCalledOnce();
	});
});
