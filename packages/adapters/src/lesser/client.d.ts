import type { components } from '../rest/generated/lesser-api.js';
import { type FetchLike } from '../fetch.js';
export type LesserSoulAgentIdentity = components['schemas']['SoulAgentIdentity'];
export type LesserSoulAgentBinding = components['schemas']['SoulAgentBinding'];
export type LesserSoulBodyBinding = LesserSoulAgentBinding;
export type LesserSoulInventoryItem = components['schemas']['SoulInventoryItem'];
export type LesserSoulsMineResponse = components['schemas']['SoulsMineResponse'];
export type LesserSoulIncorporateResponse = components['schemas']['SoulIncorporateResponse'];
export type LesserAgent = components['schemas']['Agent'];
export type LesserFetchLike = FetchLike;
export interface LesserSoulClientConfig {
	baseUrl: string;
	fetch?: LesserFetchLike;
	headers?: Record<string, string>;
}
export declare class LesserSoulClientError extends Error {
	readonly status: number;
	readonly details?: unknown;
	constructor(options: { status: number; message: string; details?: unknown });
}
export declare function createLesserSoulClient(config: LesserSoulClientConfig): LesserSoulClient;
export declare class LesserSoulClient {
	private readonly baseUrl;
	private readonly fetch;
	private readonly headers;
	constructor(config: LesserSoulClientConfig);
	getMySouls(): Promise<LesserSoulsMineResponse>;
	getAgentByUsername(username: string): Promise<LesserAgent>;
	incorporateSoul(
		agentId: string,
		targetAgentUsername: string
	): Promise<LesserSoulIncorporateResponse>;
	private requestJson;
}
//# sourceMappingURL=client.d.ts.map
