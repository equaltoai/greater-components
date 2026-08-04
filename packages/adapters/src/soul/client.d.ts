import type { components, operations } from '../rest/generated/lesser-host-api.js';
import { type FetchLike } from '../fetch.js';
export type { FetchLike } from '../fetch.js';
export type ErrorEnvelope = components['schemas']['ErrorEnvelope'];
export type SoulAgentChannelsResponse = components['schemas']['SoulAgentChannelsResponse'];
export type SoulAgentChannelPreferencesRequest =
	components['schemas']['SoulAgentChannelPreferencesRequest'];
export type SoulAgentChannelPreferencesResponse =
	components['schemas']['SoulAgentChannelPreferencesResponse'];
export type SoulAgentIdentity = components['schemas']['SoulAgentIdentity'];
export type SoulAnchorEvidence = components['schemas']['SoulAnchorEvidence'];
export type SoulAnchorAssurance = components['schemas']['SoulAnchorAssurance'];
export type SoulAgentCommActivityQuery = NonNullable<
	operations['soulAgentCommActivity']['parameters']['query']
>;
export type SoulAgentCommActivityItem = components['schemas']['SoulAgentCommActivityItem'];
export type SoulAgentCommActivityResponse = components['schemas']['SoulAgentCommActivityResponse'];
export type SoulAgentCommQueueQuery = NonNullable<
	operations['soulAgentCommQueue']['parameters']['query']
>;
export type SoulAgentCommQueueItem = components['schemas']['SoulAgentCommQueueItem'];
export type SoulAgentCommQueueResponse = components['schemas']['SoulAgentCommQueueResponse'];
export type SoulMintConversationSSEInput = components['schemas']['SoulMintConversationSSEInput'];
export type SoulMintConversation = components['schemas']['SoulMintConversation'];
export type SoulMintConversationCompleteRequest =
	components['schemas']['SoulMintConversationCompleteRequest'];
export type SoulMintConversationFinalizeBeginRequest =
	components['schemas']['SoulMintConversationFinalizeBeginRequest'];
export type SoulMintConversationFinalizePreflightResponse =
	components['schemas']['SoulMintConversationFinalizePreflightResponse'];
export type SoulMintConversationFinalizeRequest =
	components['schemas']['SoulMintConversationFinalizeRequest'];
export type SoulMintConversationFinalizeResponse =
	components['schemas']['SoulMintConversationFinalizeResponse'];
export type SoulAgentMintConversationsQuery = NonNullable<
	operations['soulAgentListMintConversations']['parameters']['query']
>;
export type SoulAgentMintConversationsResponse =
	components['schemas']['SoulAgentMintConversationsResponse'];
export type SoulResolveResponse = components['schemas']['SoulResolveResponse'];
export type SoulSearchQuery = NonNullable<operations['soulSearch']['parameters']['query']>;
export type SoulSearchResult = components['schemas']['SoulSearchResult'];
export type SoulSearchResponse = components['schemas']['SoulSearchResponse'];
export type SoulCommSendRequest = components['schemas']['SoulCommSendRequest'];
export type SoulCommSendResponse = components['schemas']['SoulCommSendResponse'];
export type SoulCommSendErrorEnvelope = components['schemas']['SoulCommSendErrorEnvelope'];
export type SoulCommStatusResponse = components['schemas']['SoulCommStatusResponse'];
export type SoulCommStatusErrorEnvelope = components['schemas']['SoulCommStatusErrorEnvelope'];
export interface LesserHostSoulClientConfig {
	baseUrl: string;
	fetch?: FetchLike;
	headers?: Record<string, string>;
}
export declare class LesserHostSoulClientError extends Error {
	readonly status: number;
	readonly code: string;
	readonly requestId?: string;
	constructor(options: { status: number; code: string; message: string; requestId?: string });
}
export interface ResolveEnsOptions {
	ensName: string;
	rpcUrl?: string;
	textKey?: string;
}
export declare function createLesserHostSoulClient(
	config: LesserHostSoulClientConfig
): LesserHostSoulClient;
export declare class LesserHostSoulClient {
	private readonly baseUrl;
	private readonly fetch;
	private readonly headers;
	constructor(config: LesserHostSoulClientConfig);
	getAgentChannels(agentId: string): Promise<SoulAgentChannelsResponse>;
	getAgentChannelPreferences(agentId: string): Promise<SoulAgentChannelPreferencesResponse>;
	updateAgentChannelPreferences(
		agentId: string,
		request: SoulAgentChannelPreferencesRequest
	): Promise<SoulAgentChannelPreferencesResponse>;
	resolveEns(ensName: string): Promise<SoulResolveResponse>;
	resolveEmail(emailAddress: string): Promise<SoulResolveResponse>;
	resolvePhone(phoneNumber: string): Promise<SoulResolveResponse>;
	searchAgents(query?: SoulSearchQuery): Promise<SoulSearchResponse>;
	sendCommunication(request: SoulCommSendRequest): Promise<SoulCommSendResponse>;
	getAgentCommunicationActivity(
		agentId: string,
		query?: SoulAgentCommActivityQuery
	): Promise<SoulAgentCommActivityResponse>;
	getAgentCommunicationQueue(
		agentId: string,
		query?: SoulAgentCommQueueQuery
	): Promise<SoulAgentCommQueueResponse>;
	getAgentCommunicationStatus(agentId: string, messageId: string): Promise<SoulCommStatusResponse>;
	getCommunicationStatus(messageId: string): Promise<SoulCommStatusResponse>;
	startMintConversationStream(
		registrationId: string,
		request: SoulMintConversationSSEInput
	): Promise<Response>;
	getMintConversation(
		registrationId: string,
		conversationId: string
	): Promise<SoulMintConversation>;
	completeMintConversation(
		registrationId: string,
		conversationId: string,
		request?: SoulMintConversationCompleteRequest
	): Promise<SoulMintConversation>;
	buildMintConversationFinalizePreflight(
		registrationId: string,
		conversationId: string,
		request: SoulMintConversationFinalizeBeginRequest
	): Promise<SoulMintConversationFinalizePreflightResponse>;
	finalizeMintConversation(
		registrationId: string,
		conversationId: string,
		request: SoulMintConversationFinalizeRequest
	): Promise<SoulMintConversationFinalizeResponse>;
	listAgentMintConversations(
		agentId: string,
		query?: SoulAgentMintConversationsQuery
	): Promise<SoulAgentMintConversationsResponse>;
	startAgentMintConversationStream(
		agentId: string,
		request: SoulMintConversationSSEInput
	): Promise<Response>;
	getAgentMintConversation(agentId: string, conversationId: string): Promise<SoulMintConversation>;
	completeAgentMintConversation(
		agentId: string,
		conversationId: string,
		request?: SoulMintConversationCompleteRequest
	): Promise<SoulMintConversation>;
	buildAgentMintConversationFinalizePreflight(
		agentId: string,
		conversationId: string,
		request: SoulMintConversationFinalizeBeginRequest
	): Promise<SoulMintConversationFinalizePreflightResponse>;
	finalizeAgentMintConversation(
		agentId: string,
		conversationId: string,
		request: SoulMintConversationFinalizeRequest
	): Promise<SoulMintConversationFinalizeResponse>;
	/**
	 * Resolve `*.lessersoul.eth` to an agentId via ENS text records if possible,
	 * otherwise fall back to lesser-host's resolve endpoint.
	 */
	resolveEnsAgentId(options: ResolveEnsOptions): Promise<string>;
	getAgentChannelsByEnsName(options: ResolveEnsOptions): Promise<SoulAgentChannelsResponse>;
	getAgentChannelPreferencesByEnsName(
		options: ResolveEnsOptions
	): Promise<SoulAgentChannelPreferencesResponse>;
	updateAgentChannelPreferencesByEnsName(
		options: ResolveEnsOptions,
		request: SoulAgentChannelPreferencesRequest
	): Promise<SoulAgentChannelPreferencesResponse>;
	private requestJson;
	private requestEventStream;
	private request;
}
//# sourceMappingURL=client.d.ts.map
