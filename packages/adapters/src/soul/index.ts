export {
	LesserHostSoulClient,
	LesserHostSoulClientError,
	createLesserHostSoulClient,
} from './client.js';
export type {
	ErrorEnvelope,
	FetchLike,
	LesserHostSoulClientConfig,
	ResolveEnsOptions,
	SoulAgentChannelsResponse,
	SoulAgentChannelPreferencesRequest,
	SoulAgentChannelPreferencesResponse,
	SoulAgentIdentity,
	SoulCommSendErrorEnvelope,
	SoulCommSendRequest,
	SoulCommSendResponse,
	SoulCommStatusErrorEnvelope,
	SoulCommStatusResponse,
	SoulResolveResponse,
	SoulSearchQuery,
	SoulSearchResponse,
	SoulSearchResult,
} from './client.js';

export { resolveSoulAgentIdFromEnsTextRecord } from './ens.js';
export type { ResolveSoulAgentIdFromEnsTextRecordOptions } from './ens.js';
