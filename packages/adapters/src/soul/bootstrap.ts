import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

import { resolveFetchLike, type FetchLike } from '../fetch.js';
import {
	BeginSoulBootstrapDocument,
	CompleteSoulBootstrapConversationDocument,
	FinalizeSoulBootstrapDocument,
	PrepareSoulBootstrapFinalizeDocument,
	PrepareSoulBootstrapPrincipalDeclarationDocument,
	SendSoulBootstrapConversationMessageDocument,
	SoulBootstrapDocument,
	VerifySoulBootstrapPrincipalDeclarationDocument,
	VerifySoulBootstrapWalletDocument,
	type BeginSoulBootstrapInput,
	type BeginSoulBootstrapMutation,
	type BeginSoulBootstrapMutationVariables,
	type CompleteSoulBootstrapConversationInput,
	type CompleteSoulBootstrapConversationMutation,
	type CompleteSoulBootstrapConversationMutationVariables,
	type FinalizeSoulBootstrapInput,
	type FinalizeSoulBootstrapMutation,
	type FinalizeSoulBootstrapMutationVariables,
	type PrepareSoulBootstrapFinalizeInput,
	type PrepareSoulBootstrapFinalizeMutation,
	type PrepareSoulBootstrapFinalizeMutationVariables,
	type PrepareSoulBootstrapPrincipalDeclarationInput,
	type PrepareSoulBootstrapPrincipalDeclarationMutation,
	type PrepareSoulBootstrapPrincipalDeclarationMutationVariables,
	type SendSoulBootstrapConversationMessageInput,
	type SendSoulBootstrapConversationMessageMutation,
	type SendSoulBootstrapConversationMessageMutationVariables,
	type SoulBootstrapPhase,
	type SoulBootstrapQuery,
	type SoulBootstrapQueryVariables,
	type VerifySoulBootstrapPrincipalDeclarationInput,
	type VerifySoulBootstrapPrincipalDeclarationMutation,
	type VerifySoulBootstrapPrincipalDeclarationMutationVariables,
	type VerifySoulBootstrapWalletInput,
	type VerifySoulBootstrapWalletMutation,
	type VerifySoulBootstrapWalletMutationVariables,
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
	hostRequestId?: string | null;
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

interface OperationExecutor {
	query<TData, TVariables extends VariablesRecord>(
		document: TypedDocumentNode<TData, TVariables>,
		variables: TVariables
	): Promise<SoulBootstrapGraphQLResult<TData>>;
	mutate<TData, TVariables extends VariablesRecord>(
		document: TypedDocumentNode<TData, TVariables>,
		variables: TVariables
	): Promise<SoulBootstrapGraphQLResult<TData>>;
}

const DISALLOWED_BROWSER_HOST_CONFIG_KEYS = [
	'hostBaseUrl',
	'hostEndpoint',
	'hostToken',
	'hostHeaders',
	'instanceKey',
	'lesserHostToken',
	'lesserHostClient',
	'hostClient',
] as const;

export class SoulBootstrapClientError extends Error {
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
	}) {
		super(options.message);
		this.name = 'SoulBootstrapClientError';
		this.category = options.category;
		this.code = options.code;
		this.statusCode = options.statusCode;
		this.graphQLErrors = options.graphQLErrors;
		this.cause = options.cause;
	}
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
export function createSoulBootstrapClient(config: SoulBootstrapClientConfig): SoulBootstrapClient {
	return new SoulBootstrapClient(config);
}

export class SoulBootstrapClient {
	private readonly executor: OperationExecutor;

	constructor(config: SoulBootstrapClientConfig) {
		assertNoBrowserHostConfig(config);
		this.executor = createExecutor(config);
	}

	async getSurface(input: SoulBootstrapCurrentInput | string): Promise<SoulBootstrapResult> {
		const username = typeof input === 'string' ? input : input.username;
		const data = await this.executeQuery<SoulBootstrapQuery, SoulBootstrapQueryVariables>(
			SoulBootstrapDocument,
			{ username }
		);

		return createResultFromSurface(data.soulBootstrap ?? null);
	}

	/** Alias for route code that reads the current Project 44 bootstrap surface. */
	current(input: SoulBootstrapCurrentInput | string): Promise<SoulBootstrapResult> {
		return this.getSurface(input);
	}

	/**
	 * Start bootstrap by forwarding the caller-provided idempotency/correlation keys to Lesser.
	 * Lesser prevents duplicate registration after a begin state has persisted with a matching begin
	 * idempotency key. First-call replay/correlation semantics remain bounded by Host's register/begin
	 * contract; this facade does not strengthen or reconstruct those backend guarantees.
	 */
	async begin(input: BeginSoulBootstrapInput): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			BeginSoulBootstrapMutation,
			BeginSoulBootstrapMutationVariables
		>(BeginSoulBootstrapDocument, { input });
		return createResultFromPayload(data.beginSoulBootstrap);
	}

	async verifyWallet(input: VerifySoulBootstrapWalletInput): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			VerifySoulBootstrapWalletMutation,
			VerifySoulBootstrapWalletMutationVariables
		>(VerifySoulBootstrapWalletDocument, { input });
		return createResultFromPayload(data.verifySoulBootstrapWallet);
	}

	async preparePrincipalDeclaration(
		input: PrepareSoulBootstrapPrincipalDeclarationInput
	): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			PrepareSoulBootstrapPrincipalDeclarationMutation,
			PrepareSoulBootstrapPrincipalDeclarationMutationVariables
		>(PrepareSoulBootstrapPrincipalDeclarationDocument, { input });
		return createResultFromPayload(data.prepareSoulBootstrapPrincipalDeclaration);
	}

	async verifyPrincipalDeclaration(
		input: VerifySoulBootstrapPrincipalDeclarationInput
	): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			VerifySoulBootstrapPrincipalDeclarationMutation,
			VerifySoulBootstrapPrincipalDeclarationMutationVariables
		>(VerifySoulBootstrapPrincipalDeclarationDocument, { input });
		return createResultFromPayload(data.verifySoulBootstrapPrincipalDeclaration);
	}

	async sendConversationMessage(
		input: SendSoulBootstrapConversationMessageInput
	): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			SendSoulBootstrapConversationMessageMutation,
			SendSoulBootstrapConversationMessageMutationVariables
		>(SendSoulBootstrapConversationMessageDocument, { input });
		return createResultFromPayload(data.sendSoulBootstrapConversationMessage);
	}

	async completeConversation(
		input: CompleteSoulBootstrapConversationInput
	): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			CompleteSoulBootstrapConversationMutation,
			CompleteSoulBootstrapConversationMutationVariables
		>(CompleteSoulBootstrapConversationDocument, { input });
		return createResultFromPayload(data.completeSoulBootstrapConversation);
	}

	async prepareFinalize(
		input: PrepareSoulBootstrapFinalizeInput
	): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			PrepareSoulBootstrapFinalizeMutation,
			PrepareSoulBootstrapFinalizeMutationVariables
		>(PrepareSoulBootstrapFinalizeDocument, { input });
		return createResultFromPayload(data.prepareSoulBootstrapFinalize);
	}

	async finalize(input: FinalizeSoulBootstrapInput): Promise<SoulBootstrapMutationResult> {
		const data = await this.executeMutation<
			FinalizeSoulBootstrapMutation,
			FinalizeSoulBootstrapMutationVariables
		>(FinalizeSoulBootstrapDocument, { input });
		return createResultFromPayload(data.finalizeSoulBootstrap);
	}

	private async executeQuery<TData, TVariables extends VariablesRecord>(
		document: TypedDocumentNode<TData, TVariables>,
		variables: TVariables
	): Promise<TData> {
		return unwrapGraphQLResult(await this.executor.query(document, variables));
	}

	private async executeMutation<TData, TVariables extends VariablesRecord>(
		document: TypedDocumentNode<TData, TVariables>,
		variables: TVariables
	): Promise<TData> {
		return unwrapGraphQLResult(await this.executor.mutate(document, variables));
	}
}

export function normalizeSoulBootstrapError(
	backendError: Maybe<SoulBootstrapErrorState>,
	graphQLErrors?: readonly SoulBootstrapGraphQLError[]
): SoulBootstrapActionableError | null {
	if (!backendError && (!graphQLErrors || graphQLErrors.length === 0)) {
		return null;
	}

	if (backendError) {
		return {
			category: categorizeBackendError(backendError),
			message: backendError.message,
			code: backendError.code,
			source: backendError.source,
			statusCode: backendError.statusCode,
			hostRequestId: backendError.hostRequestId,
			at: backendError.at,
			backendError,
			graphQLErrors,
		};
	}

	const firstGraphQLError = graphQLErrors?.[0];
	return {
		category: categorizeGraphQLError(firstGraphQLError),
		message: firstGraphQLError?.message ?? 'GraphQL request failed',
		code: getGraphQLErrorCode(firstGraphQLError),
		graphQLErrors,
	};
}

function createResultFromPayload(
	payload: SoulBootstrapMutationPayload
): SoulBootstrapMutationResult {
	const surfaceResult = createResultFromSurface(payload.bootstrap, payload.error);
	return {
		...surfaceResult,
		executable: payload.executable,
		payload,
	};
}

function createResultFromSurface(
	surface: SoulBootstrapSurface | null,
	overrideError?: Maybe<SoulBootstrapErrorState>
): SoulBootstrapResult {
	const backendError = overrideError ?? surface?.error ?? surface?.state.error ?? null;
	return {
		surface,
		state: surface?.state ?? null,
		error: normalizeSoulBootstrapError(backendError),
		executable: surface?.executable ?? false,
		hostBridgeAvailable: surface?.hostBridgeAvailable ?? null,
		nextAction: surface?.nextAction ?? null,
	};
}

function createExecutor(config: SoulBootstrapClientConfig): OperationExecutor {
	if ('graphqlClient' in config && config.graphqlClient) {
		const client = resolveGraphQLClient(config.graphqlClient);
		return {
			query: (document, variables) =>
				client.query({
					query: document,
					variables,
					fetchPolicy: 'network-only',
					errorPolicy: 'all',
				}),
			mutate: (document, variables) =>
				client.mutate({
					mutation: document,
					variables,
					errorPolicy: 'all',
				}),
		};
	}

	if (!('httpEndpoint' in config) || !config.httpEndpoint.trim()) {
		throw new Error('SoulBootstrapClient requires graphqlClient or httpEndpoint');
	}

	return createHttpExecutor(config);
}

function resolveGraphQLClient(
	clientOrProvider: SoulBootstrapGraphQLClient | SoulBootstrapGraphQLClientProvider
): SoulBootstrapGraphQLClient {
	if ('client' in clientOrProvider) {
		return clientOrProvider.client;
	}
	return clientOrProvider;
}

function createHttpExecutor(config: Extract<SoulBootstrapClientConfig, { httpEndpoint: string }>) {
	const endpoint = config.httpEndpoint.trim();
	const fetchLike = resolveFetchLike(config.fetch);
	const headers = {
		accept: 'application/json',
		'content-type': 'application/json',
		...(config.headers ?? {}),
		...(config.token ? { authorization: `Bearer ${config.token}` } : {}),
	};

	async function execute<TData, TVariables extends VariablesRecord>(
		document: TypedDocumentNode<TData, TVariables>,
		variables: TVariables
	): Promise<SoulBootstrapGraphQLResult<TData>> {
		let response: Response;
		try {
			response = await fetchLike(endpoint, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					operationName: getOperationName(document),
					query: print(document),
					variables,
				}),
			});
		} catch (cause) {
			throw new SoulBootstrapClientError({
				category: 'network_error',
				message: 'Soul bootstrap GraphQL request failed before receiving a response',
				cause,
			});
		}

		const responseText = await response.text();
		const parsed = parseGraphQLResponse<TData>(responseText);
		if (!response.ok) {
			const firstError = parsed.errors?.[0];
			throw new SoulBootstrapClientError({
				category: categorizeHttpError(response.status, firstError),
				message:
					firstError?.message ??
					`Soul bootstrap GraphQL request failed with HTTP ${response.status}`,
				code: getGraphQLErrorCode(firstError),
				statusCode: response.status,
				graphQLErrors: parsed.errors ?? undefined,
			});
		}

		return parsed;
	}

	return {
		query: execute,
		mutate: execute,
	} satisfies OperationExecutor;
}

function unwrapGraphQLResult<TData>(result: SoulBootstrapGraphQLResult<TData>): TData {
	const graphQLErrors = collectGraphQLErrors(result);
	if (result.data) {
		return result.data;
	}

	throw new SoulBootstrapClientError({
		category: categorizeGraphQLError(graphQLErrors[0]),
		message: graphQLErrors[0]?.message ?? 'Soul bootstrap GraphQL response did not include data',
		code: getGraphQLErrorCode(graphQLErrors[0]),
		graphQLErrors,
		cause: result.error,
	});
}

function collectGraphQLErrors<TData>(
	result: SoulBootstrapGraphQLResult<TData>
): readonly SoulBootstrapGraphQLError[] {
	if (result.errors?.length) {
		return result.errors;
	}

	const errorRecord = result.error as
		| {
				message?: string;
				errors?: readonly SoulBootstrapGraphQLError[];
				graphQLErrors?: readonly SoulBootstrapGraphQLError[];
		  }
		| null
		| undefined;

	if (errorRecord?.errors?.length) {
		return errorRecord.errors;
	}

	if (errorRecord?.graphQLErrors?.length) {
		return errorRecord.graphQLErrors;
	}

	if (errorRecord?.message) {
		return [{ message: errorRecord.message }];
	}

	return [];
}

function parseGraphQLResponse<TData>(responseText: string): SoulBootstrapGraphQLResult<TData> {
	if (!responseText) {
		return {};
	}

	try {
		return JSON.parse(responseText) as SoulBootstrapGraphQLResult<TData>;
	} catch (cause) {
		throw new SoulBootstrapClientError({
			category: 'graphql_error',
			message: 'Soul bootstrap GraphQL response was not valid JSON',
			cause,
		});
	}
}

function getOperationName<TData, TVariables extends VariablesRecord>(
	document: TypedDocumentNode<TData, TVariables>
): string | undefined {
	for (const definition of document.definitions) {
		if (definition.kind === 'OperationDefinition') {
			return definition.name?.value;
		}
	}
	return undefined;
}

function categorizeBackendError(error: SoulBootstrapErrorState): SoulBootstrapErrorCategory {
	const normalized = normalizeText(
		[error.code, error.source, error.message].filter(Boolean).join(' ')
	);

	if (includesAny(normalized, ['missing trust', 'trust required', 'insufficient trust'])) {
		return 'missing_trust';
	}
	if (
		includesAny(normalized, ['missing instance key', 'instance key missing', 'no instance key'])
	) {
		return 'missing_instance_key';
	}
	if (
		includesAny(normalized, ['host unavailable', 'lesser host unavailable', 'host timeout']) ||
		(error.source?.toLowerCase().includes('host') && (error.statusCode ?? 0) >= 500)
	) {
		return 'host_unavailable';
	}
	if (
		includesAny(normalized, [
			'signature rejected',
			'signature rejection',
			'invalid signature',
			'signature mismatch',
			'signature verification',
		])
	) {
		return 'signature_rejection';
	}
	if (
		includesAny(normalized, [
			'incomplete conversation',
			'conversation incomplete',
			'conversation not complete',
		])
	) {
		return 'incomplete_conversation';
	}
	if (
		includesAny(normalized, [
			'finalize expired',
			'finalize expiry',
			'finalize signature expired',
			'finalize window expired',
		])
	) {
		return 'finalize_expiry';
	}
	if (
		includesAny(normalized, [
			'binding conflict',
			'already bound',
			'duplicate binding',
			'soul binding conflict',
		])
	) {
		return 'binding_conflict';
	}
	if (error.statusCode === 401 || error.statusCode === 403) {
		return 'unauthorized';
	}
	if (error.statusCode === 404) {
		return 'not_found';
	}
	if (error.statusCode === 400 || error.statusCode === 422) {
		return 'validation';
	}
	return 'backend_error';
}

function categorizeHttpError(
	status: number,
	graphQLError?: SoulBootstrapGraphQLError
): SoulBootstrapErrorCategory {
	if (status === 401 || status === 403) return 'unauthorized';
	if (status === 404) return 'not_found';
	if (status === 400 || status === 422) return 'validation';
	if (status >= 500) return 'host_unavailable';
	return categorizeGraphQLError(graphQLError);
}

function categorizeGraphQLError(
	error: SoulBootstrapGraphQLError | undefined
): SoulBootstrapErrorCategory {
	const code = getGraphQLErrorCode(error);
	const normalized = normalizeText([code, error?.message].filter(Boolean).join(' '));

	if (includesAny(normalized, ['unauthenticated', 'unauthorized', 'forbidden'])) {
		return 'unauthorized';
	}
	if (includesAny(normalized, ['not found', 'not_found'])) {
		return 'not_found';
	}
	if (includesAny(normalized, ['bad user input', 'validation', 'invalid input'])) {
		return 'validation';
	}
	return error ? 'graphql_error' : 'unknown';
}

function getGraphQLErrorCode(error: SoulBootstrapGraphQLError | undefined): string | undefined {
	const code = error?.extensions?.['code'];
	return typeof code === 'string' ? code : undefined;
}

function normalizeText(value: string): string {
	return value.toLowerCase().replace(/[_-]+/g, ' ');
}

function includesAny(value: string, terms: readonly string[]): boolean {
	return terms.some((term) => value.includes(term));
}

function assertNoBrowserHostConfig(config: object): void {
	for (const key of DISALLOWED_BROWSER_HOST_CONFIG_KEYS) {
		if (Object.prototype.hasOwnProperty.call(config, key)) {
			throw new Error(
				`SoulBootstrapClient does not accept ${key}; use Lesser same-origin GraphQL only.`
			);
		}
	}
}
