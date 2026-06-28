import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

import { resolveFetchLike } from '../fetch.js';
import type { components as LesserHostComponents } from '../rest/generated/lesser-host-api.js';
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
	type SoulBootstrapHostedGenesisMessageRole,
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
export type HostedSoulBootstrapAvailableAction = SoulBootstrapNextAction;
export type HostedSoulBootstrapGraphQLHostedGenesisConversation = NonNullable<
	HostedSoulBootstrapState['hostedGenesisConversation']
>;
export type HostedSoulBootstrapGraphQLHostedGenesisMessage =
	HostedSoulBootstrapGraphQLHostedGenesisConversation['messages'][number];
export type LesserHostHostedGenesisConversationResponse =
	LesserHostComponents['schemas']['SoulHostedGenesisConversationResponse'];
export type LesserHostHostedGenesisConversation =
	LesserHostHostedGenesisConversationResponse['conversation'];
export type HostedSoulGenesisConversationStatus =
	| LesserHostHostedGenesisConversation['status']
	| 'no_registration'
	| 'registration_active_no_conversation'
	| 'published_bound';
export type HostedSoulBootstrapPublishGate = HostedSoulBootstrapState['publishGate'];
export type HostedSoulBootstrapCompactTerminalDeclarationEvidence = NonNullable<
	HostedSoulBootstrapState['terminalDeclarationEvidence']
>;
export type HostedSoulBootstrapDeclarationPreview = NonNullable<
	HostedSoulBootstrapCompactTerminalDeclarationEvidence['producedDeclarationsPreview']
>;
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

export interface HostedSoulGenesisConversationMessage {
	id: string;
	role: SoulBootstrapHostedGenesisMessageRole;
	content: string;
	order: number;
	createdAt: string | null;
	truncated: boolean;
}

export interface HostedSoulGenesisConversationTranscript {
	registrationId: string | null;
	conversationId: string;
	status: string;
	latestTurnId: string | null;
	messageCount: number;
	messages: readonly HostedSoulGenesisConversationMessage[];
	messagesTruncated: boolean;
	requestId: string | null;
	updatedAt: string | null;
}

export interface HostedSoulGenesisComposerState {
	availableActions: readonly HostedSoulBootstrapAvailableAction[];
	typedNextAction: SoulBootstrapNextAction | null;
	conversationId: string | null;
	registrationId: string | null;
	status: string | null;
	latestTurnId: string | null;
	messageCount: number;
	messagesTruncated: boolean;
	canSendMessage: boolean;
	canComplete: boolean;
	canPublish: boolean;
	canRefresh: boolean;
	canRestart: boolean;
	disabledReason:
		| 'no_hosted_state'
		| 'no_host_registration'
		| 'no_available_composer_action'
		| null;
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
	hostConversationStatus: string | null;
	typedNextAction: SoulBootstrapNextAction;
	availableActions: readonly HostedSoulBootstrapAvailableAction[];
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
	publicationEvidence: HostedSoulBootstrapPublicationEvidence | null;
	terminalDeclarationEvidence: HostedSoulBootstrapCompactTerminalDeclarationEvidence | null;
	publishGate: HostedSoulBootstrapPublishGate | null;
	hostedGenesisConversation: HostedSoulGenesisConversationTranscript | null;
	composer: HostedSoulGenesisComposerState;
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
	availableActions: readonly HostedSoulBootstrapAvailableAction[];
	recoveryCategory: SoulBootstrapRecoveryCategory | null;
	recoveryAction: SoulBootstrapRecoveryAction | null;
	retryable: boolean;
	restartRequired: boolean;
	restartAvailable: boolean;
	hostRequest: HostedSoulBootstrapHostRequestMetadata | null;
	publication: HostedSoulBootstrapPublicationEvidence | null;
	publicationEvidence: HostedSoulBootstrapPublicationEvidence | null;
	terminalDeclarationEvidence: HostedSoulBootstrapCompactTerminalDeclarationEvidence | null;
	publishGate: HostedSoulBootstrapPublishGate | null;
	hostedGenesisConversation: HostedSoulGenesisConversationTranscript | null;
	composer: HostedSoulGenesisComposerState;
	boundSoul: HostedSoulBootstrapBoundSoulEvidence | null;
}

export interface HostedSoulBootstrapMutationResult extends HostedSoulBootstrapResult {
	payload: HostedSoulBootstrapMutationPayload;
}

export type HostedSoulBootstrapTerminalDeclarationCheckpointName =
	| 'hosted_conversation'
	| 'conversation';

export type HostedSoulBootstrapTerminalDeclaration = Readonly<
	{
		selfDescription: Readonly<Record<string, unknown>>;
		capabilities: readonly unknown[];
		boundaries: readonly unknown[];
		transparency: Readonly<Record<string, unknown>>;
	} & Record<string, unknown>
>;

export interface HostedSoulBootstrapTerminalDeclarationEvidence {
	checkpointName: HostedSoulBootstrapTerminalDeclarationCheckpointName;
	status: 'completed';
	canonicalDeclarationJson: string;
	declaration: HostedSoulBootstrapTerminalDeclaration;
	hostRequestId: string;
	hostRegistrationId: string;
	hostConversationId: string;
	completedAt: string | null;
}

export type HostedSoulBootstrapTerminalDeclarationEvidenceSource =
	| HostedSoulBootstrapResult
	| HostedSoulBootstrapSurface
	| HostedSoulBootstrapState
	| null
	| undefined;

export type HostedSoulBootstrapStatusSource =
	| HostedSoulBootstrapTerminalDeclarationEvidenceSource
	| LesserHostHostedGenesisConversationResponse
	| LesserHostHostedGenesisConversation;

type RuntimeHostedSoulBootstrapState = HostedSoulBootstrapState & Record<string, unknown>;

export interface HostedSoulBootstrapTerminalDeclarationEvidenceOptions {
	/**
	 * Optional conversation id the publish action is about to submit. When present, evidence is
	 * rejected unless it matches Lesser's hosted conversation state exactly.
	 */
	conversationId?: string | null;
}

export interface HostedSoulBootstrapTerminalDeclarationEvidenceSummary {
	source: 'lesser_graphql' | 'lesser_host_conversation';
	conversationId: string;
	hostStatus: 'declaration_ready';
	hostRequestId: string | null;
	declarationsHash: string;
	producedDeclarationsPreview: HostedSoulBootstrapDeclarationPreview | null;
	hostRegistrationId: string | null;
	hostSoulAgentId: string | null;
	declarationId: string | null;
	producedAt: string | null;
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

/**
 * Return the terminal hosted-conversation declaration evidence required before Sim enables the
 * hosted publish action.
 *
 * Lesser deliberately gates `PUBLISH_HOSTED_SOUL` on a completed `hosted_conversation`
 * checkpoint with canonical declaration JSON plus Host request and
 * conversation evidence. This helper mirrors that fail-closed boundary so consumers do not parse
 * raw `signingCheckpoints` arrays by hand.
 */
export function getHostedSoulBootstrapTerminalDeclarationEvidence(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions = {}
): HostedSoulBootstrapTerminalDeclarationEvidence | null {
	const state = resolveTerminalDeclarationState(
		source as HostedSoulBootstrapTerminalDeclarationEvidenceSource
	);
	if (!state || state.bootstrapMode !== 'HOSTED') {
		return null;
	}

	const hostRegistrationId = trimToValue(state.hostRegistrationId);
	const hostConversationId = trimToValue(state.hostConversationId);
	if (!hostRegistrationId || !hostConversationId) {
		return null;
	}

	const expectedConversationId = trimToValue(options.conversationId);
	if (expectedConversationId && expectedConversationId !== hostConversationId) {
		return null;
	}

	for (const checkpoint of normalizeTerminalDeclarationSigningCheckpoints(state)) {
		const checkpointName = normalizeTerminalDeclarationCheckpointName(checkpoint['name']);
		if (!checkpointName || !isCompletedTerminalDeclarationStatus(checkpoint['status'])) {
			continue;
		}

		const canonicalDeclarationJson = trimToValue(checkpoint['canonicalJson']);
		const hostRequestId = trimToValue(checkpoint['hostRequestId']);
		const declaration = canonicalDeclarationJson
			? parseHostedTerminalDeclaration(canonicalDeclarationJson)
			: null;
		if (!canonicalDeclarationJson || !hostRequestId || !declaration) {
			continue;
		}

		return {
			checkpointName,
			status: 'completed',
			canonicalDeclarationJson,
			declaration,
			hostRequestId,
			hostRegistrationId,
			hostConversationId,
			completedAt: trimToValue(checkpoint['completedAt']),
		};
	}

	return null;
}

export function hasHostedSoulBootstrapTerminalDeclarationEvidence(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions = {}
): boolean {
	return getHostedSoulBootstrapTerminalDeclarationEvidence(source, options) !== null;
}

export function isHostedSoulBootstrapPublishReady(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions = {}
): boolean {
	return canPublishHostedSoulBootstrap(source, options);
}

/**
 * True only for explicit durable hosted-genesis progress statuses with an active conversation id.
 *
 * Host `created` is treated as in-progress because Lesser v1.5.6 collapses created snapshots into
 * the local `conversation.in_progress` projection row rather than introducing a browser-visible
 * created state.
 */
export function isHostedSoulBootstrapInProgress(
	source: HostedSoulBootstrapStatusSource,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions = {}
): boolean {
	const snapshot = resolveHostedGenesisSnapshot(source);
	if (!snapshot) {
		return false;
	}

	const conversationId = trimToValue(snapshot.hostConversationId);
	const expectedConversationId = trimToValue(options.conversationId);
	if (!conversationId || (expectedConversationId && expectedConversationId !== conversationId)) {
		return false;
	}

	return (
		snapshot.hostStatus === 'created' ||
		snapshot.hostStatus === 'in_progress' ||
		snapshot.hostStatus === 'assistant_turn_ready' ||
		snapshot.hostStatus === 'declaration_extraction_pending'
	);
}

/**
 * True only when terminal declaration evidence is present and bound to the active conversation.
 */
export function isHostedSoulBootstrapDeclarationReady(
	source: HostedSoulBootstrapStatusSource,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions = {}
): boolean {
	return getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(source, options) !== null;
}

/**
 * Extract the compact durable hosted-genesis terminal evidence that gates publish UX.
 *
 * This helper accepts either Lesser's GraphQL projection or the generated Lesser Host
 * HostConversation response type. It never calls Host and it fails closed: malformed, stale,
 * missing, or conversation-mismatched evidence returns `null`.
 */
export function getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(
	source: HostedSoulBootstrapStatusSource,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions = {}
): HostedSoulBootstrapTerminalDeclarationEvidenceSummary | null {
	const snapshot = resolveHostedGenesisSnapshot(source);
	if (!snapshot || snapshot.hostStatus !== 'declaration_ready') {
		return null;
	}

	if (snapshot.kind === 'lesser_host_conversation') {
		return getHostConversationTerminalDeclarationEvidenceSummary(snapshot, options);
	}

	return getGraphQLTerminalDeclarationEvidenceSummary(snapshot, options);
}

export function canPublishHostedSoulBootstrap(
	source: HostedSoulBootstrapStatusSource,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions = {}
): boolean {
	const snapshot = resolveHostedGenesisSnapshot(source);
	if (!snapshot) {
		return false;
	}

	const evidence = getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(source, options);
	if (!evidence) {
		return false;
	}

	if (snapshot.kind === 'lesser_host_conversation') {
		return true;
	}

	const state = resolveTerminalDeclarationState(
		source as HostedSoulBootstrapTerminalDeclarationEvidenceSource
	);
	if (!state) {
		return false;
	}

	return (
		resolveTerminalDeclarationNextAction(
			source as HostedSoulBootstrapTerminalDeclarationEvidenceSource,
			state
		) === 'PUBLISH_HOSTED_SOUL' && isExplicitPublishGateOpen(snapshot.publishGate)
	);
}

/**
 * Return Lesser's browser-safe hosted-genesis transcript projection.
 *
 * This intentionally reads only `SoulBootstrapState.hostedGenesisConversation` from the Lesser
 * same-origin GraphQL surface. It does not call Host and does not reconstruct raw Host records.
 */
export function getHostedSoulGenesisConversation(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource
): HostedSoulGenesisConversationTranscript | null {
	const state = resolveTerminalDeclarationState(source);
	if (!state || state.bootstrapMode !== 'HOSTED') {
		return null;
	}
	return normalizeHostedGenesisConversation(state['hostedGenesisConversation']);
}

/**
 * Derive composer affordances from Lesser's `availableActions` contract.
 *
 * Consumers should use this state instead of inventing local Host status switches. `canSendMessage`
 * and `canComplete` are true only when Lesser explicitly advertises the corresponding hosted action.
 */
export function getHostedSoulGenesisComposerState(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource
): HostedSoulGenesisComposerState {
	const state = resolveTerminalDeclarationState(source);
	const surface = resolveHostedSoulBootstrapSurface(source);
	if (!state || state.bootstrapMode !== 'HOSTED') {
		return createHostedSoulGenesisComposerState(null, [], null);
	}

	const availableActions = resolveHostedSoulBootstrapAvailableActions(source, state, surface);
	const conversation = normalizeHostedGenesisConversation(state['hostedGenesisConversation']);
	return createHostedSoulGenesisComposerState(state, availableActions, conversation);
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
	const availableActions = hosted?.availableActions ?? [];
	const hostedGenesisConversation = hosted?.hostedGenesisConversation ?? null;
	const composer = hosted?.composer ?? createHostedSoulGenesisComposerState(null, [], null);
	return {
		surface,
		state,
		hosted,
		error: normalizeHostedSoulBootstrapError(backendError),
		executable: surface?.executable ?? false,
		hostBridgeAvailable: surface?.hostBridgeAvailable ?? null,
		nextAction: surface?.nextAction ?? null,
		typedNextAction: surface?.typedNextAction ?? state?.typedNextAction ?? null,
		availableActions,
		recoveryCategory: surface?.recoveryCategory ?? state?.recoveryCategory ?? null,
		recoveryAction: surface?.recoveryAction ?? state?.recoveryAction ?? null,
		retryable: surface?.retryable ?? state?.retryable ?? backendError?.retryable ?? false,
		restartRequired: state?.restartRequired ?? backendError?.restartRequired ?? false,
		restartAvailable: surface?.restartAvailable ?? state?.restartAvailable ?? false,
		hostRequest: hosted?.hostRequest ?? null,
		publication: state?.publication ?? null,
		publicationEvidence: state?.publicationEvidence ?? state?.publication ?? null,
		terminalDeclarationEvidence: state?.terminalDeclarationEvidence ?? null,
		publishGate: state?.publishGate ?? null,
		hostedGenesisConversation,
		composer,
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
	const availableActions = resolveHostedSoulBootstrapAvailableActions(surface, state, surface);
	const hostedGenesisConversation = normalizeHostedGenesisConversation(
		state.hostedGenesisConversation
	);
	const composer = createHostedSoulGenesisComposerState(
		state,
		availableActions,
		hostedGenesisConversation
	);
	return {
		username: state.username,
		bodyId: state.bodyId,
		phase: state.phase,
		state: state.state,
		bootstrapMode: state.bootstrapMode,
		authorityModel: state.authorityModel,
		anchorState: state.anchorState ?? null,
		assuranceState: state.assuranceState ?? null,
		hostConversationStatus: state.hostConversationStatus ?? null,
		typedNextAction: state.typedNextAction,
		availableActions,
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
		publicationEvidence: state.publicationEvidence ?? state.publication ?? null,
		terminalDeclarationEvidence: state.terminalDeclarationEvidence ?? null,
		publishGate: state.publishGate ?? null,
		hostedGenesisConversation,
		composer,
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

function resolveHostedSoulBootstrapSurface(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource
): HostedSoulBootstrapSurface | null {
	if (!isObjectRecord(source)) {
		return null;
	}

	const record = source as Record<string, unknown>;
	if (record['__typename'] === 'SoulBootstrapSurface' && isObjectRecord(record['state'])) {
		return source as HostedSoulBootstrapSurface;
	}

	const surface = record['surface'];
	if (
		isObjectRecord(surface) &&
		surface['__typename'] === 'SoulBootstrapSurface' &&
		isObjectRecord(surface['state'])
	) {
		return surface as HostedSoulBootstrapSurface;
	}

	return null;
}

function resolveHostedSoulBootstrapAvailableActions(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	state: RuntimeHostedSoulBootstrapState,
	surface: HostedSoulBootstrapSurface | null = resolveHostedSoulBootstrapSurface(source)
): readonly HostedSoulBootstrapAvailableAction[] {
	const surfaceActions = normalizeHostedSoulBootstrapAvailableActions(
		surface ? (surface as unknown as Record<string, unknown>)['availableActions'] : undefined
	);
	if (surfaceActions.length > 0) {
		return surfaceActions;
	}

	const stateActions = normalizeHostedSoulBootstrapAvailableActions(state['availableActions']);
	if (stateActions.length > 0) {
		return stateActions;
	}

	const nextAction = normalizeHostedSoulBootstrapAvailableAction(state['typedNextAction']);
	return nextAction ? [nextAction] : [];
}

function normalizeHostedSoulBootstrapAvailableActions(
	value: unknown
): readonly HostedSoulBootstrapAvailableAction[] {
	if (!Array.isArray(value)) {
		return [];
	}

	const actions: HostedSoulBootstrapAvailableAction[] = [];
	for (const item of value) {
		const action = normalizeHostedSoulBootstrapAvailableAction(item);
		if (action && !actions.includes(action)) {
			actions.push(action);
		}
	}
	return actions;
}

function normalizeHostedSoulBootstrapAvailableAction(
	value: unknown
): HostedSoulBootstrapAvailableAction | null {
	if (typeof value !== 'string') {
		return null;
	}
	const normalized = value.trim().toUpperCase();
	switch (normalized) {
		case 'START_HOSTED_BOOTSTRAP':
		case 'SEND_HOSTED_SOUL_GENESIS_MESSAGE':
		case 'COMPLETE_HOSTED_SOUL_GENESIS':
		case 'PUBLISH_HOSTED_SOUL':
		case 'RESTART_SOUL_BOOTSTRAP':
		case 'RETRY_SAME_STEP':
		case 'REFRESH_STATE':
		case 'OPERATOR_ACTION_REQUIRED':
		case 'VERIFY_WALLET':
		case 'PREPARE_PRINCIPAL_DECLARATION':
		case 'VERIFY_PRINCIPAL_DECLARATION':
		case 'CONTINUE_CONVERSATION':
		case 'FINALIZE':
		case 'COMPLETE':
			return normalized as HostedSoulBootstrapAvailableAction;
		default:
			return null;
	}
}

function createHostedSoulGenesisComposerState(
	state: RuntimeHostedSoulBootstrapState | null,
	availableActions: readonly HostedSoulBootstrapAvailableAction[],
	conversation: HostedSoulGenesisConversationTranscript | null
): HostedSoulGenesisComposerState {
	const hostRegistrationId = trimToValue(state?.hostRegistrationId);
	const conversationId = conversation?.conversationId ?? trimToValue(state?.hostConversationId);
	const canSendMessage = availableActions.includes('SEND_HOSTED_SOUL_GENESIS_MESSAGE');
	const canComplete =
		availableActions.includes('COMPLETE_HOSTED_SOUL_GENESIS') && Boolean(conversationId);
	const canPublish =
		availableActions.includes('PUBLISH_HOSTED_SOUL') &&
		isExplicitPublishGateOpen(isObjectRecord(state?.publishGate) ? state.publishGate : null);
	const canRefresh = availableActions.includes('REFRESH_STATE');
	const canRestart = availableActions.includes('RESTART_SOUL_BOOTSTRAP');

	return {
		availableActions,
		typedNextAction: normalizeHostedSoulBootstrapAvailableAction(state?.typedNextAction),
		conversationId,
		registrationId: conversation?.registrationId ?? hostRegistrationId,
		status:
			conversation?.status ??
			normalizeHostedGenesisStatus(state?.hostConversationStatus) ??
			normalizeHostedGenesisStatusFromState(state?.state),
		latestTurnId: conversation?.latestTurnId ?? null,
		messageCount: conversation?.messageCount ?? 0,
		messagesTruncated: conversation?.messagesTruncated ?? false,
		canSendMessage,
		canComplete,
		canPublish,
		canRefresh,
		canRestart,
		disabledReason:
			canSendMessage || canComplete || canPublish || canRefresh || canRestart
				? null
				: !state || state.bootstrapMode !== 'HOSTED'
					? 'no_hosted_state'
					: !hostRegistrationId
						? 'no_host_registration'
						: 'no_available_composer_action',
	};
}

function normalizeHostedGenesisConversation(
	value: unknown
): HostedSoulGenesisConversationTranscript | null {
	if (!isObjectRecord(value)) {
		return null;
	}

	const conversationId = trimToValue(value['conversationId']);
	const status = trimToValue(value['status']);
	if (!conversationId || !status) {
		return null;
	}

	const messageCount = toFiniteNonNegativeInteger(value['messageCount']);
	if (messageCount === null) {
		return null;
	}

	return {
		registrationId: trimToValue(value['registrationId']),
		conversationId,
		status,
		latestTurnId: trimToValue(value['latestTurnId']),
		messageCount,
		messages: normalizeHostedGenesisMessages(value['messages']),
		messagesTruncated: value['messagesTruncated'] === true,
		requestId: trimToValue(value['requestId']),
		updatedAt: trimToValue(value['updatedAt']),
	};
}

function normalizeHostedGenesisMessages(
	value: unknown
): readonly HostedSoulGenesisConversationMessage[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.map(normalizeHostedGenesisMessage).filter(isHostedGenesisConversationMessage);
}

function normalizeHostedGenesisMessage(
	value: unknown
): HostedSoulGenesisConversationMessage | null {
	if (!isObjectRecord(value)) {
		return null;
	}

	const id = trimToValue(value['id']);
	const role = normalizeHostedGenesisMessageRole(value['role']);
	const content = nonEmptyString(value['content']);
	const order = toFiniteNonNegativeInteger(value['order']);
	if (!id || !role || !content || order === null) {
		return null;
	}

	return {
		id,
		role,
		content,
		order,
		createdAt: trimToValue(value['createdAt']),
		truncated: value['truncated'] === true,
	};
}

function isHostedGenesisConversationMessage(
	value: HostedSoulGenesisConversationMessage | null
): value is HostedSoulGenesisConversationMessage {
	return value !== null;
}

function normalizeHostedGenesisMessageRole(
	value: unknown
): SoulBootstrapHostedGenesisMessageRole | null {
	if (typeof value !== 'string') {
		return null;
	}
	const normalized = value.trim().toUpperCase();
	return normalized === 'USER' || normalized === 'ASSISTANT'
		? (normalized as SoulBootstrapHostedGenesisMessageRole)
		: null;
}

function toFiniteNonNegativeInteger(value: unknown): number | null {
	return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

interface HostedGenesisSnapshot {
	kind: 'lesser_graphql' | 'lesser_host_conversation';
	hostRegistrationId: string | null;
	hostConversationId: string | null;
	hostSoulAgentId: string | null;
	hostStatus: HostedSoulGenesisConversationStatus | null;
	state: string | null;
	typedNextAction: string | null;
	terminalDeclarationEvidence: Record<string, unknown> | null;
	publishGate: Record<string, unknown> | null;
	hostConversation: Record<string, unknown> | null;
}

function resolveHostedGenesisSnapshot(
	source: HostedSoulBootstrapStatusSource
): HostedGenesisSnapshot | null {
	const hostConversation = resolveLesserHostHostedGenesisConversation(source);
	if (hostConversation) {
		const status = normalizeHostedGenesisStatus(hostConversation['status']);
		return {
			kind: 'lesser_host_conversation',
			hostRegistrationId: trimToValue(hostConversation['registration_id']),
			hostConversationId: trimToValue(hostConversation['conversation_id']),
			hostSoulAgentId: trimToValue(hostConversation['agent_id']),
			hostStatus: status,
			state: status,
			typedNextAction: null,
			terminalDeclarationEvidence: null,
			publishGate: null,
			hostConversation,
		};
	}

	const state = resolveTerminalDeclarationState(
		source as HostedSoulBootstrapTerminalDeclarationEvidenceSource
	);
	if (!state || state.bootstrapMode !== 'HOSTED') {
		return null;
	}

	return {
		kind: 'lesser_graphql',
		hostRegistrationId: trimToValue(state.hostRegistrationId),
		hostConversationId: trimToValue(state.hostConversationId),
		hostSoulAgentId: trimToValue(state.hostSoulAgentId),
		hostStatus:
			normalizeHostedGenesisStatus(state['hostConversationStatus']) ??
			normalizeHostedGenesisStatusFromState(state.state),
		state: trimToValue(state.state),
		typedNextAction: trimToValue(state.typedNextAction),
		terminalDeclarationEvidence: isObjectRecord(state['terminalDeclarationEvidence'])
			? state['terminalDeclarationEvidence']
			: null,
		publishGate: isObjectRecord(state['publishGate']) ? state['publishGate'] : null,
		hostConversation: null,
	};
}

function resolveLesserHostHostedGenesisConversation(
	source: HostedSoulBootstrapStatusSource
): Record<string, unknown> | null {
	if (!isObjectRecord(source)) {
		return null;
	}

	const record = source as Record<string, unknown>;
	if (isHostedGenesisConversationRecord(record)) {
		return record;
	}

	const conversation = record['conversation'];
	if (isHostedGenesisConversationRecord(conversation)) {
		return conversation;
	}

	return null;
}

function isHostedGenesisConversationRecord(value: unknown): value is Record<string, unknown> {
	if (!isObjectRecord(value)) {
		return false;
	}
	return (
		typeof value['status'] === 'string' &&
		typeof value['registration_id'] === 'string' &&
		typeof value['conversation_id'] === 'string'
	);
}

function normalizeHostedGenesisStatus(value: unknown): HostedSoulGenesisConversationStatus | null {
	if (typeof value !== 'string') {
		return null;
	}

	const normalized = value.trim().toLowerCase();
	switch (normalized) {
		case 'created':
		case 'in_progress':
		case 'assistant_turn_ready':
		case 'declaration_extraction_pending':
		case 'declaration_ready':
		case 'failed':
		case 'no_registration':
		case 'registration_active_no_conversation':
		case 'published_bound':
			return normalized;
		default:
			return null;
	}
}

function normalizeHostedGenesisStatusFromState(
	state: unknown
): HostedSoulGenesisConversationStatus | null {
	if (typeof state !== 'string') {
		return null;
	}

	const normalized = state.trim().toLowerCase();
	switch (normalized) {
		case 'not_started':
			return 'no_registration';
		case 'conversation.registration_active':
			return 'registration_active_no_conversation';
		case 'conversation.created':
			return 'created';
		case 'conversation.in_progress':
		case 'hosted_genesis_started':
			return 'in_progress';
		case 'conversation.assistant_turn_ready':
		case 'hosted_genesis_message_recorded':
			return 'assistant_turn_ready';
		case 'conversation.declaration_extraction_pending':
			return 'declaration_extraction_pending';
		case 'conversation.declaration_ready':
		case 'hosted_genesis_complete':
			return 'declaration_ready';
		case 'error.host_failed':
			return 'failed';
		case 'complete.bound':
		case 'hosted_offchain_published':
		case 'hosted_already_bound':
			return 'published_bound';
		default:
			return null;
	}
}

function getGraphQLTerminalDeclarationEvidenceSummary(
	snapshot: HostedGenesisSnapshot,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): HostedSoulBootstrapTerminalDeclarationEvidenceSummary | null {
	const evidence = snapshot.terminalDeclarationEvidence;
	if (!evidence) {
		return null;
	}

	const activeConversationId = trimToValue(snapshot.hostConversationId);
	const evidenceConversationId = trimToValue(evidence['conversationId']);
	const expectedConversationId = trimToValue(options.conversationId);
	if (
		!activeConversationId ||
		!evidenceConversationId ||
		evidenceConversationId !== activeConversationId ||
		(expectedConversationId && expectedConversationId !== evidenceConversationId)
	) {
		return null;
	}

	if (normalizeHostedGenesisStatus(evidence['hostStatus']) !== 'declaration_ready') {
		return null;
	}

	const declarationsHash = normalizeDeclarationHash(evidence['declarationsHash']);
	if (!declarationsHash) {
		return null;
	}

	const producedDeclarationsPreview = normalizeDeclarationPreview(
		evidence['producedDeclarationsPreview']
	);

	return {
		source: 'lesser_graphql',
		conversationId: evidenceConversationId,
		hostStatus: 'declaration_ready',
		hostRequestId: trimToValue(evidence['hostRequestId']),
		declarationsHash,
		producedDeclarationsPreview,
		hostRegistrationId: snapshot.hostRegistrationId,
		hostSoulAgentId: snapshot.hostSoulAgentId,
		declarationId: null,
		producedAt: null,
	};
}

function getHostConversationTerminalDeclarationEvidenceSummary(
	snapshot: HostedGenesisSnapshot,
	options: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): HostedSoulBootstrapTerminalDeclarationEvidenceSummary | null {
	const conversation = snapshot.hostConversation;
	if (!conversation) {
		return null;
	}

	const activeConversationId = trimToValue(conversation['conversation_id']);
	const expectedConversationId = trimToValue(options.conversationId);
	if (
		!activeConversationId ||
		(expectedConversationId && expectedConversationId !== activeConversationId)
	) {
		return null;
	}

	const producedDeclarations = conversation['produced_declarations'];
	if (!isObjectRecord(producedDeclarations)) {
		return null;
	}

	const declarationsHash = normalizeDeclarationHash(producedDeclarations['declaration_hash']);
	const declarations = producedDeclarations['declarations'];
	const evidence = producedDeclarations['evidence'];
	if (
		!declarationsHash ||
		!isHostedTerminalDeclarationShape(declarations) ||
		!isObjectRecord(evidence)
	) {
		return null;
	}

	if (trimToValue(evidence['source']) !== 'host_conversation') {
		return null;
	}

	const evidenceConversationId = trimToValue(evidence['conversation_id']);
	const evidenceRegistrationId = trimToValue(evidence['registration_id']);
	const evidenceAgentId = trimToValue(evidence['agent_id']);
	if (
		evidenceConversationId !== activeConversationId ||
		evidenceRegistrationId !== snapshot.hostRegistrationId ||
		evidenceAgentId !== snapshot.hostSoulAgentId
	) {
		return null;
	}

	return {
		source: 'lesser_host_conversation',
		conversationId: activeConversationId,
		hostStatus: 'declaration_ready',
		hostRequestId: trimToValue(evidence['request_id']) ?? trimToValue(conversation['request_id']),
		declarationsHash,
		producedDeclarationsPreview: {
			__typename: 'SoulBootstrapDeclarationPreview',
			title: trimToValue(producedDeclarations['declaration_id']),
			declarationCount: countHostedTerminalDeclarationSections(declarations),
		},
		hostRegistrationId: snapshot.hostRegistrationId,
		hostSoulAgentId: snapshot.hostSoulAgentId,
		declarationId: trimToValue(producedDeclarations['declaration_id']),
		producedAt: trimToValue(producedDeclarations['produced_at']),
	};
}

function normalizeDeclarationPreview(value: unknown): HostedSoulBootstrapDeclarationPreview | null {
	if (!isObjectRecord(value)) {
		return null;
	}

	const declarationCount = value['declarationCount'];
	if (typeof declarationCount !== 'number' || !Number.isFinite(declarationCount)) {
		return null;
	}

	return {
		__typename: 'SoulBootstrapDeclarationPreview',
		title: trimToValue(value['title']),
		declarationCount,
	};
}

function normalizeDeclarationHash(value: unknown): string | null {
	const hash = trimToValue(value);
	if (!hash) {
		return null;
	}
	return /^sha256:[0-9a-f]{64}$/.test(hash) ? hash : null;
}

function isExplicitPublishGateOpen(publishGate: Record<string, unknown> | null): boolean {
	if (!publishGate) {
		return false;
	}
	return (
		publishGate['canPublishHostedSoul'] === true &&
		publishGate['requiresActiveConversationTerminalDeclarationEvidence'] === true &&
		typeof publishGate['reason'] === 'string' &&
		publishGate['reason'].trim().length > 0
	);
}

function isHostedTerminalDeclarationShape(value: unknown): boolean {
	if (!isObjectRecord(value)) {
		return false;
	}
	const selfDescription = value['selfDescription'];
	const capabilities = value['capabilities'];
	const boundaries = value['boundaries'];
	const transparency = value['transparency'];
	return (
		isObjectRecord(selfDescription) &&
		Object.keys(selfDescription).length > 0 &&
		Array.isArray(capabilities) &&
		Array.isArray(boundaries) &&
		isObjectRecord(transparency)
	);
}

function countHostedTerminalDeclarationSections(value: unknown): number {
	if (!isHostedTerminalDeclarationShape(value) || !isObjectRecord(value)) {
		return 0;
	}
	return (
		1 +
		(value['capabilities'] as unknown[]).length +
		(value['boundaries'] as unknown[]).length +
		(isObjectRecord(value['transparency']) ? 1 : 0)
	);
}

function resolveTerminalDeclarationState(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource
): RuntimeHostedSoulBootstrapState | null {
	if (isHostedSoulBootstrapStateCandidate(source)) {
		return source;
	}
	if (!isObjectRecord(source)) {
		return null;
	}
	const record = source as Record<string, unknown>;
	if (isHostedSoulBootstrapStateCandidate(record['state'])) {
		return record['state'];
	}
	const surface = record['surface'];
	if (isObjectRecord(surface) && isHostedSoulBootstrapStateCandidate(surface['state'])) {
		return surface['state'];
	}
	return null;
}

function resolveTerminalDeclarationNextAction(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	state: RuntimeHostedSoulBootstrapState
): SoulBootstrapNextAction | null {
	if (isObjectRecord(source)) {
		const record = source as Record<string, unknown>;
		if (typeof record['typedNextAction'] === 'string') {
			return record['typedNextAction'] as SoulBootstrapNextAction;
		}
		const sourceState = record['state'];
		if (isObjectRecord(sourceState) && typeof sourceState['typedNextAction'] === 'string') {
			return sourceState['typedNextAction'] as SoulBootstrapNextAction;
		}
	}
	return typeof state.typedNextAction === 'string' ? state.typedNextAction : null;
}

function isHostedSoulBootstrapStateCandidate(
	value: unknown
): value is RuntimeHostedSoulBootstrapState {
	return isObjectRecord(value) && typeof value['bootstrapMode'] === 'string';
}

function normalizeTerminalDeclarationSigningCheckpoints(
	state: RuntimeHostedSoulBootstrapState
): readonly Record<string, unknown>[] {
	const signingCheckpoints = state['signingCheckpoints'];
	if (!Array.isArray(signingCheckpoints)) {
		return [];
	}
	return signingCheckpoints.filter(isObjectRecord);
}

function normalizeTerminalDeclarationCheckpointName(
	name: unknown
): HostedSoulBootstrapTerminalDeclarationCheckpointName | null {
	if (typeof name !== 'string') {
		return null;
	}
	const normalized = name.trim().toLowerCase();
	if (normalized === 'hosted_conversation' || normalized === 'conversation') {
		return normalized;
	}
	return null;
}

function isCompletedTerminalDeclarationStatus(status: unknown): boolean {
	if (typeof status !== 'string') {
		return false;
	}
	return status.trim().toLowerCase() === 'completed';
}

function parseHostedTerminalDeclaration(
	canonicalDeclarationJson: string
): HostedSoulBootstrapTerminalDeclaration | null {
	let parsed: unknown;
	try {
		parsed = JSON.parse(canonicalDeclarationJson);
	} catch {
		return null;
	}
	if (!isObjectRecord(parsed)) {
		return null;
	}

	const selfDescription = parsed['selfDescription'];
	const capabilities = parsed['capabilities'];
	const boundaries = parsed['boundaries'];
	const transparency = parsed['transparency'];
	if (!isObjectRecord(selfDescription) || Object.keys(selfDescription).length === 0) {
		return null;
	}
	if (!Array.isArray(capabilities) || !Array.isArray(boundaries)) {
		return null;
	}
	if (!isObjectRecord(transparency)) {
		return null;
	}

	return parsed as HostedSoulBootstrapTerminalDeclaration;
}

function trimToValue(value: unknown): string | null {
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function nonEmptyString(value: unknown): string | null {
	return typeof value === 'string' && value.trim() ? value : null;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
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
