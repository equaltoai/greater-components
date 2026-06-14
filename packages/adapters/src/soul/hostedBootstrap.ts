import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

import { resolveFetchLike } from '../fetch.js';
import {
	CompleteHostedSoulGenesisDocument,
	PublishHostedSoulDocument,
	RestartSoulBootstrapDocument,
	SendHostedSoulGenesisMessageDocument,
	SoulBootstrapDocument,
	StartHostedSoulBootstrapDocument,
	type CompleteHostedSoulGenesisInput,
	type CompleteHostedSoulGenesisMutation,
	type CompleteHostedSoulGenesisMutationVariables,
	type PublishHostedSoulInput,
	type PublishHostedSoulMutation,
	type PublishHostedSoulMutationVariables,
	type RestartSoulBootstrapInput,
	type RestartSoulBootstrapMutation,
	type RestartSoulBootstrapMutationVariables,
	type SendHostedSoulGenesisMessageInput,
	type SendHostedSoulGenesisMessageMutation,
	type SendHostedSoulGenesisMessageMutationVariables,
	type SoulBindingState,
	type SoulBootstrapAnchorState,
	type SoulBootstrapAuthorityModel,
	type SoulBootstrapMode,
	type SoulBootstrapNextAction,
	type SoulBootstrapPhase,
	type SoulBootstrapQuery,
	type SoulBootstrapQueryVariables,
	type SoulBootstrapRecoveryAction,
	type SoulBootstrapRecoveryCategory,
	type StartHostedSoulBootstrapInput,
	type StartHostedSoulBootstrapMutation,
	type StartHostedSoulBootstrapMutationVariables,
} from '../graphql/generated/types.js';
import {
	SoulBootstrapClientError,
	normalizeSoulBootstrapError,
	type SoulBootstrapActionableError,
	type SoulBootstrapClientConfig,
	type SoulBootstrapErrorCategory,
	type SoulBootstrapErrorState,
	type SoulBootstrapGraphQLClient,
	type SoulBootstrapGraphQLClientProvider,
	type SoulBootstrapGraphQLError,
	type SoulBootstrapGraphQLResult,
	type SoulBootstrapPublicationEvidence,
	type SoulBootstrapState,
	type SoulBootstrapSurface,
} from './bootstrap.js';

type Maybe<T> = T | null | undefined;
type VariablesRecord = Record<string, unknown>;

export type HostedSoulBootstrapClientConfig = SoulBootstrapClientConfig;
export type HostedSoulBootstrapCurrentInput = { username: string };
export type HostedSoulBootstrapSurface = SoulBootstrapSurface;
export type HostedSoulBootstrapState = SoulBootstrapState;
export type HostedSoulBootstrapPublicationEvidence = SoulBootstrapPublicationEvidence;
export type HostedSoulBootstrapMutationPayload =
	| StartHostedSoulBootstrapMutation['startHostedSoulBootstrap']
	| SendHostedSoulGenesisMessageMutation['sendHostedSoulGenesisMessage']
	| CompleteHostedSoulGenesisMutation['completeHostedSoulGenesis']
	| PublishHostedSoulMutation['publishHostedSoul']
	| RestartSoulBootstrapMutation['restartSoulBootstrap'];

export type {
	CompleteHostedSoulGenesisInput,
	PublishHostedSoulInput,
	RestartSoulBootstrapInput,
	SendHostedSoulGenesisMessageInput,
	SoulBootstrapAnchorState as HostedSoulBootstrapAnchorState,
	SoulBootstrapAuthorityModel as HostedSoulBootstrapAuthorityModel,
	SoulBootstrapMode as HostedSoulBootstrapMode,
	SoulBootstrapNextAction as HostedSoulBootstrapNextAction,
	SoulBootstrapPhase as HostedSoulBootstrapPhase,
	SoulBootstrapRecoveryAction as HostedSoulBootstrapRecoveryAction,
	SoulBootstrapRecoveryCategory as HostedSoulBootstrapRecoveryCategory,
	StartHostedSoulBootstrapInput,
};

export interface HostedSoulBootstrapActionableError extends SoulBootstrapActionableError {
	detailsJson: string | null;
	recoveryCategory: SoulBootstrapRecoveryCategory | null;
	recoveryAction: SoulBootstrapRecoveryAction | null;
	retryable: boolean;
	restartRequired: boolean;
}

export interface HostedSoulBootstrapHostRequestMetadata {
	hostRequestId: string | null;
	lastHostRequestId: string | null;
	recoveryAttemptId: string | null;
	restartIdempotencyKey: string | null;
	supersededHostRegistrationId: string | null;
	supersededHostConversationId: string | null;
}

export interface HostedSoulBootstrapBoundSoulEvidence {
	existingSoulAgentId: string | null;
	hostSoulAgentId: string | null;
	soulBindingState: SoulBindingState;
	publication: HostedSoulBootstrapPublicationEvidence | null;
}

export interface HostedSoulBootstrapStateModel {
	username: string;
	bodyId: string;
	phase: SoulBootstrapPhase;
	state: string;
	bootstrapMode: SoulBootstrapMode;
	authorityModel: SoulBootstrapAuthorityModel;
	anchorState: SoulBootstrapAnchorState | null;
	assuranceState: SoulBootstrapAnchorState | null;
	typedNextAction: SoulBootstrapNextAction;
	nextAction: string | null;
	recoveryCategory: SoulBootstrapRecoveryCategory | null;
	recoveryAction: SoulBootstrapRecoveryAction | null;
	retryable: boolean;
	restartRequired: boolean;
	restartAvailable: boolean;
	hostRegistrationId: string | null;
	hostConversationId: string | null;
	hostSoulAgentId: string | null;
	existingSoulAgentId: string | null;
	soulBindingState: SoulBindingState;
	publication: HostedSoulBootstrapPublicationEvidence | null;
	hostRequest: HostedSoulBootstrapHostRequestMetadata;
	updatedAt: string | null;
	restartedAt: string | null;
}

export interface HostedSoulBootstrapResult {
	surface: HostedSoulBootstrapSurface | null;
	state: HostedSoulBootstrapState | null;
	hosted: HostedSoulBootstrapStateModel | null;
	error: HostedSoulBootstrapActionableError | null;
	executable: boolean;
	hostBridgeAvailable: boolean | null;
	nextAction: string | null;
	typedNextAction: SoulBootstrapNextAction | null;
	recoveryCategory: SoulBootstrapRecoveryCategory | null;
	recoveryAction: SoulBootstrapRecoveryAction | null;
	retryable: boolean;
	restartRequired: boolean;
	restartAvailable: boolean;
	hostRequest: HostedSoulBootstrapHostRequestMetadata | null;
	publication: HostedSoulBootstrapPublicationEvidence | null;
	boundSoul: HostedSoulBootstrapBoundSoulEvidence | null;
}

export interface HostedSoulBootstrapMutationResult extends HostedSoulBootstrapResult {
	payload: HostedSoulBootstrapMutationPayload;
}

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

const DISALLOWED_BROWSER_HOST_HEADER_NAMES = [
	'x-lesser-host-token',
	'x-host-instance-key',
	'x-lesser-host-instance-key',
	'x-instance-key',
] as const;

const DISALLOWED_HOSTED_INPUT_KEYS = [
	...DISALLOWED_BROWSER_HOST_CONFIG_KEYS,
	'walletAddress',
	'principalAddress',
	'principalDeclaration',
	'signature',
	'principalSignature',
	'boundarySignaturesJson',
	'selfAttestation',
	'signingPlan',
	'signingPlans',
	'signingCheckpoints',
	'signingMethod',
	'signerAddress',
	'messageHex',
	'digestHex',
	'canonicalJson',
	'expectedVersion',
	'issuedAt',
] as const;

/**
 * Create the hosted-first Project 44 soul bootstrap facade.
 *
 * The facade calls only Lesser same-origin GraphQL hosted-bootstrap mutations. It intentionally
 * rejects browser Host credentials and wallet/principal signing inputs so Sim routes can consume
 * the M7 hosted contract without reviving the wallet-era signing plan by default.
 */
export function createHostedSoulBootstrapClient(
	config: HostedSoulBootstrapClientConfig
): HostedSoulBootstrapClient {
	return new HostedSoulBootstrapClient(config);
}

export class HostedSoulBootstrapClient {
	private readonly executor: OperationExecutor;

	constructor(config: HostedSoulBootstrapClientConfig) {
		assertNoBrowserHostConfig('HostedSoulBootstrapClient', config);
		this.executor = createExecutor(config);
	}

	async current(
		input: HostedSoulBootstrapCurrentInput | string
	): Promise<HostedSoulBootstrapResult> {
		if (typeof input !== 'string') {
			assertHostedInput('current', input);
		}
		const username = typeof input === 'string' ? input : input.username;
		const data = await this.executeQuery<SoulBootstrapQuery, SoulBootstrapQueryVariables>(
			SoulBootstrapDocument,
			{ username }
		);

		return createHostedResultFromSurface(data.soulBootstrap ?? null);
	}

	getCurrentHostedSoulBootstrap(
		input: HostedSoulBootstrapCurrentInput | string
	): Promise<HostedSoulBootstrapResult> {
		return this.current(input);
	}

	startOrResumeHostedSoulBootstrap(
		input: StartHostedSoulBootstrapInput
	): Promise<HostedSoulBootstrapMutationResult> {
		return this.startHostedSoulBootstrap(input);
	}

	startOrResume(input: StartHostedSoulBootstrapInput): Promise<HostedSoulBootstrapMutationResult> {
		return this.startHostedSoulBootstrap(input);
	}

	async startHostedSoulBootstrap(
		input: StartHostedSoulBootstrapInput
	): Promise<HostedSoulBootstrapMutationResult> {
		assertHostedInput('startHostedSoulBootstrap', input);
		const data = await this.executeMutation<
			StartHostedSoulBootstrapMutation,
			StartHostedSoulBootstrapMutationVariables
		>(StartHostedSoulBootstrapDocument, { input });
		return createHostedResultFromPayload(data.startHostedSoulBootstrap);
	}

	async sendHostedSoulGenesisMessage(
		input: SendHostedSoulGenesisMessageInput
	): Promise<HostedSoulBootstrapMutationResult> {
		assertHostedInput('sendHostedSoulGenesisMessage', input);
		const data = await this.executeMutation<
			SendHostedSoulGenesisMessageMutation,
			SendHostedSoulGenesisMessageMutationVariables
		>(SendHostedSoulGenesisMessageDocument, { input });
		return createHostedResultFromPayload(data.sendHostedSoulGenesisMessage);
	}

	async completeHostedSoulGenesis(
		input: CompleteHostedSoulGenesisInput
	): Promise<HostedSoulBootstrapMutationResult> {
		assertHostedInput('completeHostedSoulGenesis', input);
		const data = await this.executeMutation<
			CompleteHostedSoulGenesisMutation,
			CompleteHostedSoulGenesisMutationVariables
		>(CompleteHostedSoulGenesisDocument, { input });
		return createHostedResultFromPayload(data.completeHostedSoulGenesis);
	}

	async publishHostedSoul(
		input: PublishHostedSoulInput
	): Promise<HostedSoulBootstrapMutationResult> {
		assertHostedInput('publishHostedSoul', input);
		const data = await this.executeMutation<
			PublishHostedSoulMutation,
			PublishHostedSoulMutationVariables
		>(PublishHostedSoulDocument, { input });
		return createHostedResultFromPayload(data.publishHostedSoul);
	}

	async restartSoulBootstrap(
		input: RestartSoulBootstrapInput
	): Promise<HostedSoulBootstrapMutationResult> {
		assertHostedInput('restartSoulBootstrap', input);
		const data = await this.executeMutation<
			RestartSoulBootstrapMutation,
			RestartSoulBootstrapMutationVariables
		>(RestartSoulBootstrapDocument, { input });
		return createHostedResultFromPayload(data.restartSoulBootstrap);
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

function createHostedResultFromPayload(
	payload: HostedSoulBootstrapMutationPayload
): HostedSoulBootstrapMutationResult {
	return {
		...createHostedResultFromSurface(payload.bootstrap, payload.error),
		executable: payload.executable,
		payload,
	};
}

function createHostedResultFromSurface(
	surface: HostedSoulBootstrapSurface | null,
	overrideError?: Maybe<SoulBootstrapErrorState>
): HostedSoulBootstrapResult {
	const state = surface?.state ?? null;
	const backendError = overrideError ?? surface?.error ?? state?.error ?? null;
	const hosted = surface ? createHostedStateModel(surface) : null;
	return {
		surface,
		state,
		hosted,
		error: normalizeHostedSoulBootstrapError(backendError),
		executable: surface?.executable ?? false,
		hostBridgeAvailable: surface?.hostBridgeAvailable ?? null,
		nextAction: surface?.nextAction ?? null,
		typedNextAction: surface?.typedNextAction ?? state?.typedNextAction ?? null,
		recoveryCategory: surface?.recoveryCategory ?? state?.recoveryCategory ?? null,
		recoveryAction: surface?.recoveryAction ?? state?.recoveryAction ?? null,
		retryable: surface?.retryable ?? state?.retryable ?? backendError?.retryable ?? false,
		restartRequired: state?.restartRequired ?? backendError?.restartRequired ?? false,
		restartAvailable: surface?.restartAvailable ?? state?.restartAvailable ?? false,
		hostRequest: hosted?.hostRequest ?? null,
		publication: state?.publication ?? null,
		boundSoul: hosted
			? {
					existingSoulAgentId: hosted.existingSoulAgentId,
					hostSoulAgentId: hosted.hostSoulAgentId,
					soulBindingState: hosted.soulBindingState,
					publication: hosted.publication,
				}
			: null,
	};
}

function createHostedStateModel(
	surface: HostedSoulBootstrapSurface
): HostedSoulBootstrapStateModel {
	const state = surface.state;
	return {
		username: state.username,
		bodyId: state.bodyId,
		phase: state.phase,
		state: state.state,
		bootstrapMode: state.bootstrapMode,
		authorityModel: state.authorityModel,
		anchorState: state.anchorState ?? null,
		assuranceState: state.assuranceState ?? null,
		typedNextAction: state.typedNextAction,
		nextAction: surface.nextAction ?? null,
		recoveryCategory: surface.recoveryCategory ?? state.recoveryCategory ?? null,
		recoveryAction: surface.recoveryAction ?? state.recoveryAction ?? null,
		retryable: surface.retryable ?? state.retryable,
		restartRequired: state.restartRequired,
		restartAvailable: surface.restartAvailable ?? state.restartAvailable,
		hostRegistrationId: state.hostRegistrationId ?? null,
		hostConversationId: state.hostConversationId ?? null,
		hostSoulAgentId: state.hostSoulAgentId ?? null,
		existingSoulAgentId: surface.existingSoulAgentId ?? null,
		soulBindingState: surface.soulBindingState,
		publication: state.publication ?? null,
		hostRequest: createHostRequestMetadata(state),
		updatedAt: state.updatedAt ?? null,
		restartedAt: state.restartedAt ?? null,
	};
}

function createHostRequestMetadata(
	state: HostedSoulBootstrapState
): HostedSoulBootstrapHostRequestMetadata {
	const correlation = state.correlation;
	const lastHostRequestId = state.lastHostRequestId ?? correlation?.lastHostRequestId ?? null;
	return {
		hostRequestId: state.error?.hostRequestId ?? lastHostRequestId,
		lastHostRequestId,
		recoveryAttemptId: state.recoveryAttemptId ?? correlation?.recoveryAttemptId ?? null,
		restartIdempotencyKey:
			state.restartIdempotencyKey ?? correlation?.restartIdempotencyKey ?? null,
		supersededHostRegistrationId: correlation?.supersededHostRegistrationId ?? null,
		supersededHostConversationId: correlation?.supersededHostConversationId ?? null,
	};
}

function normalizeHostedSoulBootstrapError(
	backendError: Maybe<SoulBootstrapErrorState>,
	graphQLErrors?: readonly SoulBootstrapGraphQLError[]
): HostedSoulBootstrapActionableError | null {
	const normalized = normalizeSoulBootstrapError(backendError, graphQLErrors);
	if (!normalized) {
		return null;
	}
	return {
		...normalized,
		detailsJson: backendError?.detailsJson ?? null,
		recoveryCategory: backendError?.recoveryCategory ?? null,
		recoveryAction: backendError?.recoveryAction ?? null,
		retryable: backendError?.retryable ?? false,
		restartRequired: backendError?.restartRequired ?? false,
	};
}

function createExecutor(config: HostedSoulBootstrapClientConfig): OperationExecutor {
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
		throw new Error('HostedSoulBootstrapClient requires graphqlClient or httpEndpoint');
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

function createHttpExecutor(
	config: Extract<HostedSoulBootstrapClientConfig, { httpEndpoint: string }>
) {
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
				message: 'Hosted soul bootstrap GraphQL request failed before receiving a response',
				cause,
			});
		}

		const responseText = await response.text();
		const parsed = parseGraphQLResponse<TData>(responseText);
		if (!response.ok) {
			throwGraphQLClientError(
				parsed.errors,
				`Hosted soul bootstrap GraphQL request failed with HTTP ${response.status}`,
				response.status
			);
		}

		return parsed;
	}

	return {
		query: execute,
		mutate: execute,
	} satisfies OperationExecutor;
}

function unwrapGraphQLResult<TData>(result: SoulBootstrapGraphQLResult<TData>): TData {
	if (result.data) {
		return result.data;
	}

	throwGraphQLClientError(
		collectGraphQLErrors(result),
		'Hosted soul bootstrap GraphQL response did not include data',
		undefined,
		result.error
	);
}

function throwGraphQLClientError(
	graphQLErrors: Maybe<readonly SoulBootstrapGraphQLError[]>,
	fallbackMessage: string,
	statusCode?: number,
	cause?: unknown
): never {
	const normalized = normalizeHostedSoulBootstrapError(null, graphQLErrors ?? undefined);
	const graphQLErrorCode = graphQLErrors?.[0]?.extensions?.['code'];
	throw new SoulBootstrapClientError({
		category: normalized?.category ?? categorizeHttpStatus(statusCode),
		message: graphQLErrors?.[0]?.message ?? fallbackMessage,
		code: typeof graphQLErrorCode === 'string' ? graphQLErrorCode : undefined,
		statusCode,
		graphQLErrors: graphQLErrors ?? undefined,
		cause,
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
			message: 'Hosted soul bootstrap GraphQL response was not valid JSON',
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

function categorizeHttpStatus(statusCode: number | undefined): SoulBootstrapErrorCategory {
	if (statusCode === 401 || statusCode === 403) return 'unauthorized';
	if (statusCode === 404) return 'not_found';
	if (statusCode === 400 || statusCode === 422) return 'validation';
	if (statusCode && statusCode >= 500) return 'host_unavailable';
	return 'unknown';
}

function assertNoBrowserHostConfig(context: string, config: object): void {
	for (const key of DISALLOWED_BROWSER_HOST_CONFIG_KEYS) {
		if (Object.prototype.hasOwnProperty.call(config, key)) {
			throw new Error(`${context} does not accept ${key}; use Lesser same-origin GraphQL only.`);
		}
	}

	const headers = (config as { headers?: Record<string, string> }).headers;
	if (!headers) {
		return;
	}

	for (const headerName of Object.keys(headers)) {
		if (isDisallowedBrowserHostHeaderName(headerName)) {
			throw new Error(
				`${context} does not accept ${headerName} header; use Lesser same-origin GraphQL only.`
			);
		}
	}
}

function isDisallowedBrowserHostHeaderName(headerName: string): boolean {
	const normalized = headerName.trim().toLowerCase();
	return DISALLOWED_BROWSER_HOST_HEADER_NAMES.some((disallowed) => disallowed === normalized);
}

function assertHostedInput(context: string, input: object): void {
	for (const key of DISALLOWED_HOSTED_INPUT_KEYS) {
		if (Object.prototype.hasOwnProperty.call(input, key)) {
			throw new Error(
				`${context} does not accept ${key}; hosted bootstrap uses Lesser-managed authority only.`
			);
		}
	}
}
