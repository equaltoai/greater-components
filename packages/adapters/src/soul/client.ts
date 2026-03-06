import type { components } from '../rest/generated/lesser-host-api.js';
import { resolveSoulAgentIdFromEnsTextRecord } from './ens.js';

export type ErrorEnvelope = components['schemas']['ErrorEnvelope'];
export type SoulAgentChannelsResponse = components['schemas']['SoulAgentChannelsResponse'];
export type SoulAgentChannelPreferencesResponse =
	components['schemas']['SoulAgentChannelPreferencesResponse'];
export type SoulResolveResponse = components['schemas']['SoulResolveResponse'];

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface LesserHostSoulClientConfig {
	baseUrl: string;
	fetch?: FetchLike;
	headers?: Record<string, string>;
}

export class LesserHostSoulClientError extends Error {
	readonly status: number;
	readonly code: string;
	readonly requestId?: string;

	constructor(options: { status: number; code: string; message: string; requestId?: string }) {
		super(options.message);
		this.name = 'LesserHostSoulClientError';
		this.status = options.status;
		this.code = options.code;
		this.requestId = options.requestId;
	}
}

export interface ResolveEnsOptions {
	ensName: string;
	rpcUrl?: string;
	textKey?: string;
}

export function createLesserHostSoulClient(
	config: LesserHostSoulClientConfig
): LesserHostSoulClient {
	return new LesserHostSoulClient(config);
}

export class LesserHostSoulClient {
	private readonly baseUrl: string;
	private readonly fetch: FetchLike;
	private readonly headers: Record<string, string>;

	constructor(config: LesserHostSoulClientConfig) {
		const baseUrl = config.baseUrl.trim();
		if (!baseUrl) {
			throw new Error('LesserHostSoulClient requires baseUrl');
		}
		this.baseUrl = trimTrailingSlashes(baseUrl);
		this.fetch = config.fetch ?? fetch;
		this.headers = {
			accept: 'application/json',
			...(config.headers ?? {}),
		};
	}

	async getAgentChannels(agentId: string): Promise<SoulAgentChannelsResponse> {
		const id = agentId.trim();
		if (!id) throw new Error('agentId is required');

		return this.requestJson(`/api/v1/soul/agents/${encodeURIComponent(id)}/channels`);
	}

	async getAgentChannelPreferences(agentId: string): Promise<SoulAgentChannelPreferencesResponse> {
		const id = agentId.trim();
		if (!id) throw new Error('agentId is required');

		return this.requestJson(`/api/v1/soul/agents/${encodeURIComponent(id)}/channels/preferences`);
	}

	async resolveEns(ensName: string): Promise<SoulResolveResponse> {
		const name = ensName.trim();
		if (!name) throw new Error('ensName is required');

		return this.requestJson(`/api/v1/soul/resolve/ens/${encodeURIComponent(name)}`);
	}

	async resolveEmail(emailAddress: string): Promise<SoulResolveResponse> {
		const email = emailAddress.trim();
		if (!email) throw new Error('emailAddress is required');

		return this.requestJson(`/api/v1/soul/resolve/email/${encodeURIComponent(email)}`);
	}

	async resolvePhone(phoneNumber: string): Promise<SoulResolveResponse> {
		const phone = phoneNumber.trim();
		if (!phone) throw new Error('phoneNumber is required');

		return this.requestJson(`/api/v1/soul/resolve/phone/${encodeURIComponent(phone)}`);
	}

	/**
	 * Resolve `*.lessersoul.eth` to an agentId via ENS text records if possible,
	 * otherwise fall back to lesser-host's resolve endpoint.
	 */
	async resolveEnsAgentId(options: ResolveEnsOptions): Promise<string> {
		const { ensName, rpcUrl, textKey } = options;

		if (rpcUrl) {
			const agentId = await resolveSoulAgentIdFromEnsTextRecord({
				ensName,
				rpcUrl,
				textKey,
			});
			if (agentId) return agentId;
		}

		const resolved = await this.resolveEns(ensName);
		const agentId = resolved?.agent?.agent_id?.trim();
		if (!agentId) {
			throw new Error('Resolve response missing agent_id');
		}
		return agentId;
	}

	async getAgentChannelsByEnsName(options: ResolveEnsOptions): Promise<SoulAgentChannelsResponse> {
		const agentId = await this.resolveEnsAgentId(options);
		return this.getAgentChannels(agentId);
	}

	async getAgentChannelPreferencesByEnsName(
		options: ResolveEnsOptions
	): Promise<SoulAgentChannelPreferencesResponse> {
		const agentId = await this.resolveEnsAgentId(options);
		return this.getAgentChannelPreferences(agentId);
	}

	private async requestJson<T>(pathname: string): Promise<T> {
		const url = `${this.baseUrl}${pathname}`;
		const response = await this.fetch(url, { headers: this.headers });

		if (!response.ok) {
			throw await createLesserHostSoulClientError(response);
		}

		return (await response.json()) as T;
	}
}

function trimTrailingSlashes(value: string): string {
	let trimmed = value;
	while (trimmed.endsWith('/')) {
		trimmed = trimmed.slice(0, -1);
	}
	return trimmed;
}

async function createLesserHostSoulClientError(
	response: Response
): Promise<LesserHostSoulClientError> {
	const fallbackMessage = `Request failed (${response.status})`;

	let body: unknown = null;
	try {
		body = await response.json();
	} catch {
		// ignore
	}

	if (isErrorEnvelope(body)) {
		return new LesserHostSoulClientError({
			status: response.status,
			code: body.error.code,
			message: body.error.message || fallbackMessage,
			requestId: body.error.request_id,
		});
	}

	return new LesserHostSoulClientError({
		status: response.status,
		code: 'unknown',
		message: fallbackMessage,
	});
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
	if (!value || typeof value !== 'object') return false;
	const error = (value as { error?: unknown }).error;
	if (!error || typeof error !== 'object') return false;

	const record = error as Record<string, unknown>;
	return typeof record['code'] === 'string' && typeof record['message'] === 'string';
}
