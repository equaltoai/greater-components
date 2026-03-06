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
	SoulAgentChannelPreferencesResponse,
	SoulResolveResponse,
} from './client.js';

export { resolveSoulAgentIdFromEnsTextRecord } from './ens.js';
export type { ResolveSoulAgentIdFromEnsTextRecordOptions } from './ens.js';
