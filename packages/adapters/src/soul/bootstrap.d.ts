import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { type FetchLike } from '../fetch.js';
import {
	type BeginSoulBootstrapInput,
	type BeginSoulBootstrapMutation,
	type CompleteSoulBootstrapConversationInput,
	type CompleteSoulBootstrapConversationMutation,
	type FinalizeSoulBootstrapInput,
	type FinalizeSoulBootstrapMutation,
	type PrepareSoulBootstrapFinalizeInput,
	type PrepareSoulBootstrapFinalizeMutation,
	type PrepareSoulBootstrapPrincipalDeclarationInput,
	type PrepareSoulBootstrapPrincipalDeclarationMutation,
	type SendSoulBootstrapConversationMessageInput,
	type SendSoulBootstrapConversationMessageMutation,
	type SoulBootstrapPhase,
	type SoulBootstrapQuery,
	type VerifySoulBootstrapPrincipalDeclarationInput,
	type VerifySoulBootstrapPrincipalDeclarationMutation,
	type VerifySoulBootstrapWalletInput,
	type VerifySoulBootstrapWalletMutation,
} from '../graphql/generated/types.js';
type Maybe<T> = T | null | undefined;
type VariablesRecord = Record<string, unknown>;
export type SoulBootstrapSurface = NonNullable<SoulBootstrapQuery['soulBootstrap']>;
export type SoulBootstrapState = SoulBootstrapSurface['state'];
export type SoulBootstrapSigningCheckpoint = SoulBootstrapState['signingCheckpoints'][number];
export type SoulBootstrapPublicationEvidence = NonNullable<SoulBootstrapState['publication']>;
export type SoulBootstrapCorrelationState = NonNullable<SoulBootstrapState['correlation']>;
export type SoulBootstrapErrorState = NonNullable<SoulBootstrapState['error']>;
export type SoulBootstrapMutationPayload =
	| BeginSoulBootstrapMutation['beginSoulBootstrap']
	| VerifySoulBootstrapWalletMutation['verifySoulBootstrapWallet']
	| PrepareSoulBootstrapPrincipalDeclarationMutation['prepareSoulBootstrapPrincipalDeclaration']
	| VerifySoulBootstrapPrincipalDeclarationMutation['verifySoulBootstrapPrincipalDeclaration']
	| SendSoulBootstrapConversationMessageMutation['sendSoulBootstrapConversationMessage']
	| CompleteSoulBootstrapConversationMutation['completeSoulBootstrapConversation']
	| PrepareSoulBootstrapFinalizeMutation['prepareSoulBootstrapFinalize']
	| FinalizeSoulBootstrapMutation['finalizeSoulBootstrap'];
export type {
	BeginSoulBootstrapInput,
	CompleteSoulBootstrapConversationInput,
	FinalizeSoulBootstrapInput,
	PrepareSoulBootstrapFinalizeInput,
	PrepareSoulBootstrapPrincipalDeclarationInput,
	SendSoulBootstrapConversationMessageInput,
	SoulBootstrapPhase,
	VerifySoulBootstrapPrincipalDeclarationInput,
	VerifySoulBootstrapWalletInput,
};
export type SoulBootstrapErrorCategory =
	| 'missing_trust'
	| 'missing_instance_key'
	| 'host_unavailable'
	| 'signature_rejection'
	| 'incomplete_conversation'
	| 'finalize_expiry'
	| 'binding_conflict'
	| 'unauthorized'
	| 'not_found'
	| 'validation'
	| 'graphql_error'
	| 'network_error'
	| 'backend_error'
	| 'unknown';
export interface SoulBootstrapActionableError {
	category: SoulBootstrapErrorCategory;
	message: string;
	code?: string;
	source?: string | null;
	statusCode?: number | null;
	detailsJson?: string | null;
	hostRequestId?: string | null;
	recoveryCategory?: SoulBootstrapErrorState['recoveryCategory'];
	recoveryAction?: SoulBootstrapErrorState['recoveryAction'];
	retryable?: boolean;
	restartRequired?: boolean;
	at?: string | null;
	backendError?: SoulBootstrapErrorState;
	graphQLErrors?: readonly SoulBootstrapGraphQLError[];
}
export interface SoulBootstrapResult {
	surface: SoulBootstrapSurface | null;
	state: SoulBootstrapState | null;
	error: SoulBootstrapActionableError | null;
	executable: boolean;
	hostBridgeAvailable: boolean | null;
	nextAction: string | null;
}
export interface SoulBootstrapMutationResult extends SoulBootstrapResult {
	payload: SoulBootstrapMutationPayload;
}
export interface SoulBootstrapCurrentInput {
	username: string;
}
export interface SoulBootstrapGraphQLError {
	message: string;
	path?: ReadonlyArray<string | number>;
	extensions?: Record<string, unknown>;
}
export interface SoulBootstrapGraphQLResult<TData> {
	data?: Maybe<TData>;
	errors?: Maybe<readonly SoulBootstrapGraphQLError[]>;
	error?: unknown;
}
export interface SoulBootstrapGraphQLClient {
	query<TData, TVariables extends VariablesRecord>(options: {
		query: TypedDocumentNode<TData, TVariables>;
		variables: TVariables;
		fetchPolicy?: 'network-only';
		errorPolicy?: 'all';
	}): Promise<SoulBootstrapGraphQLResult<TData>>;
	mutate<TData, TVariables extends VariablesRecord>(options: {
		mutation: TypedDocumentNode<TData, TVariables>;
		variables: TVariables;
		errorPolicy?: 'all';
	}): Promise<SoulBootstrapGraphQLResult<TData>>;
}
export interface SoulBootstrapGraphQLClientProvider {
	client: SoulBootstrapGraphQLClient;
}
export type SoulBootstrapClientConfig =
	| {
			graphqlClient: SoulBootstrapGraphQLClient | SoulBootstrapGraphQLClientProvider;
			httpEndpoint?: never;
			token?: never;
			headers?: never;
			fetch?: never;
	  }
	| {
			httpEndpoint: string;
			token?: string;
			headers?: Record<string, string>;
			fetch?: FetchLike;
			graphqlClient?: never;
	  };
export declare class SoulBootstrapClientError extends Error {
	readonly category: SoulBootstrapErrorCategory;
	readonly code?: string;
	readonly statusCode?: number;
	readonly graphQLErrors?: readonly SoulBootstrapGraphQLError[];
	readonly cause?: unknown;
	constructor(options: {
		category: SoulBootstrapErrorCategory;
		message: string;
		code?: string;
		statusCode?: number;
		graphQLErrors?: readonly SoulBootstrapGraphQLError[];
		cause?: unknown;
	});
}
/**
 * Create the Project 44 browser-safe bootstrap facade.
 *
 * The only supported write path is:
 * Browser/Sim → Lesser same-origin GraphQL → Lesser server-side Host instance-key API → lesser-host.
 * This facade intentionally has no Host base URL, Host bearer token, browser instance key, or raw Host
 * write-client configuration. Host signing/publication material is returned only as Lesser-provided
 * nested state and checkpoint fields.
 */
export declare function createSoulBootstrapClient(
	config: SoulBootstrapClientConfig
): SoulBootstrapClient;
export declare class SoulBootstrapClient {
	private readonly executor;
	constructor(config: SoulBootstrapClientConfig);
	getSurface(input: SoulBootstrapCurrentInput | string): Promise<SoulBootstrapResult>;
	/** Alias for route code that reads the current Project 44 bootstrap surface. */
	current(input: SoulBootstrapCurrentInput | string): Promise<SoulBootstrapResult>;
	/**
	 * Start bootstrap by forwarding the caller-provided idempotency/correlation keys to Lesser.
	 * Lesser prevents duplicate registration after a begin state has persisted with a matching begin
	 * idempotency key. First-call replay/correlation semantics remain bounded by Host's register/begin
	 * contract; this facade does not strengthen or reconstruct those backend guarantees.
	 */
	begin(input: BeginSoulBootstrapInput): Promise<SoulBootstrapMutationResult>;
	verifyWallet(input: VerifySoulBootstrapWalletInput): Promise<SoulBootstrapMutationResult>;
	preparePrincipalDeclaration(
		input: PrepareSoulBootstrapPrincipalDeclarationInput
	): Promise<SoulBootstrapMutationResult>;
	verifyPrincipalDeclaration(
		input: VerifySoulBootstrapPrincipalDeclarationInput
	): Promise<SoulBootstrapMutationResult>;
	sendConversationMessage(
		input: SendSoulBootstrapConversationMessageInput
	): Promise<SoulBootstrapMutationResult>;
	completeConversation(
		input: CompleteSoulBootstrapConversationInput
	): Promise<SoulBootstrapMutationResult>;
	prepareFinalize(input: PrepareSoulBootstrapFinalizeInput): Promise<SoulBootstrapMutationResult>;
	finalize(input: FinalizeSoulBootstrapInput): Promise<SoulBootstrapMutationResult>;
	private executeQuery;
	private executeMutation;
}
export declare function normalizeSoulBootstrapError(
	backendError: Maybe<SoulBootstrapErrorState>,
	graphQLErrors?: readonly SoulBootstrapGraphQLError[]
): SoulBootstrapActionableError | null;
//# sourceMappingURL=bootstrap.d.ts.map
