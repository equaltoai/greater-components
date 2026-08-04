import type { components as LesserHostComponents } from '../rest/generated/lesser-host-api.js';
import {
	type CompleteHostedSoulGenesisInput,
	type CompleteHostedSoulGenesisMutation,
	type HostedGenesisConversationSummary,
	type PublishHostedSoulInput,
	type PublishHostedSoulMutation,
	type RecoverHostedSoulGenesisTurnInput,
	type RecoverHostedSoulGenesisTurnMutation,
	type RestartSoulBootstrapInput,
	type RestartSoulBootstrapMutation,
	type SendHostedSoulGenesisMessageInput,
	type SendHostedSoulGenesisMessageMutation,
	type SoulBindingState,
	type SoulBootstrapAnchorState,
	type SoulBootstrapAuthorityModel,
	type SoulBootstrapHostedGenesisMessageRole,
	type SoulBootstrapMode,
	type SoulBootstrapNextAction,
	type SoulBootstrapPhase,
	type SoulBootstrapRecoveryAction,
	type SoulBootstrapRecoveryCategory,
	type StartHostedSoulBootstrapInput,
	type StartHostedSoulBootstrapMutation,
} from '../graphql/generated/types.js';
import {
	type SoulBootstrapActionableError,
	type SoulBootstrapClientConfig,
	type SoulBootstrapPublicationEvidence,
	type SoulBootstrapState,
	type SoulBootstrapSurface,
} from './bootstrap.js';
export type HostedSoulBootstrapClientConfig = SoulBootstrapClientConfig;
export type HostedSoulBootstrapCurrentInput = {
	username: string;
};
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
/**
 * A transitional status that can still arrive from legacy Lesser GraphQL/runtime
 * projections. It is deliberately not part of the pinned Lesser Host v1.0.15 REST
 * contract.
 */
export type LegacyHostedSoulGenesisConversationStatus = 'declaration_extraction_pending';
export type HostedSoulGenesisConversationStatus =
	| LesserHostHostedGenesisConversation['status']
	| LegacyHostedSoulGenesisConversationStatus
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
	| RestartSoulBootstrapMutation['restartSoulBootstrap']
	| RecoverHostedSoulGenesisTurnMutation['recoverHostedSoulGenesisTurn'];
export type {
	CompleteHostedSoulGenesisInput,
	HostedGenesisConversationSummary,
	PublishHostedSoulInput,
	RecoverHostedSoulGenesisTurnInput,
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
		'no_hosted_state' | 'no_host_registration' | 'no_available_composer_action' | null;
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
export interface HostedGenesisConversationSummaryResult {
	conversations: readonly HostedGenesisConversationSummary[];
}
export type HostedSoulBootstrapTerminalDeclarationCheckpointName =
	'hosted_conversation' | 'conversation';
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
export type LegacyLesserHostHostedGenesisConversation = Omit<
	LesserHostHostedGenesisConversation,
	'status'
> & {
	status: LegacyHostedSoulGenesisConversationStatus;
};
export type LegacyLesserHostHostedGenesisConversationResponse = Omit<
	LesserHostHostedGenesisConversationResponse,
	'conversation'
> & {
	conversation: LegacyLesserHostHostedGenesisConversation;
};
export type HostedSoulBootstrapStatusSource =
	| HostedSoulBootstrapTerminalDeclarationEvidenceSource
	| LesserHostHostedGenesisConversationResponse
	| LesserHostHostedGenesisConversation
	| LegacyLesserHostHostedGenesisConversationResponse
	| LegacyLesserHostHostedGenesisConversation;
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
/**
 * Create the hosted-first Project 44 soul bootstrap facade.
 *
 * The facade calls only Lesser same-origin GraphQL hosted-bootstrap mutations. It intentionally
 * rejects browser Host credentials and wallet/principal signing inputs so Sim routes can consume
 * the M7 hosted contract without reviving the wallet-era signing plan by default.
 */
export declare function createHostedSoulBootstrapClient(
	config: HostedSoulBootstrapClientConfig
): HostedSoulBootstrapClient;
/**
 * Return the terminal hosted-conversation declaration evidence required before Sim enables the
 * hosted publish action.
 *
 * Lesser deliberately gates `PUBLISH_HOSTED_SOUL` on a completed `hosted_conversation`
 * checkpoint with canonical declaration JSON plus Host request and
 * conversation evidence. This helper mirrors that fail-closed boundary so consumers do not parse
 * raw `signingCheckpoints` arrays by hand.
 */
export declare function getHostedSoulBootstrapTerminalDeclarationEvidence(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	options?: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): HostedSoulBootstrapTerminalDeclarationEvidence | null;
export declare function hasHostedSoulBootstrapTerminalDeclarationEvidence(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	options?: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): boolean;
export declare function isHostedSoulBootstrapPublishReady(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource,
	options?: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): boolean;
/**
 * True only for explicit durable hosted-genesis progress statuses with an active conversation id.
 *
 * Host `created` is treated as in-progress because Lesser v1.5.6 collapses created snapshots into
 * the local `conversation.in_progress` projection row rather than introducing a browser-visible
 * created state.
 */
export declare function isHostedSoulBootstrapInProgress(
	source: HostedSoulBootstrapStatusSource,
	options?: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): boolean;
/**
 * True only when terminal declaration evidence is present and bound to the active conversation.
 */
export declare function isHostedSoulBootstrapDeclarationReady(
	source: HostedSoulBootstrapStatusSource,
	options?: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): boolean;
/**
 * Extract the compact durable hosted-genesis terminal evidence that gates publish UX.
 *
 * This helper accepts either Lesser's GraphQL projection or the generated Lesser Host
 * HostConversation response type. It never calls Host and it fails closed: malformed, stale,
 * missing, or conversation-mismatched evidence returns `null`.
 */
export declare function getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(
	source: HostedSoulBootstrapStatusSource,
	options?: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): HostedSoulBootstrapTerminalDeclarationEvidenceSummary | null;
export declare function canPublishHostedSoulBootstrap(
	source: HostedSoulBootstrapStatusSource,
	options?: HostedSoulBootstrapTerminalDeclarationEvidenceOptions
): boolean;
/**
 * Return Lesser's browser-safe hosted-genesis transcript projection.
 *
 * This intentionally reads only `SoulBootstrapState.hostedGenesisConversation` from the Lesser
 * same-origin GraphQL surface. It does not call Host and does not reconstruct raw Host records.
 */
export declare function getHostedSoulGenesisConversation(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource
): HostedSoulGenesisConversationTranscript | null;
/**
 * Derive composer affordances from Lesser's `availableActions` contract.
 *
 * Consumers should use this state instead of inventing local Host status switches. `canSendMessage`
 * and `canComplete` are true only when Lesser explicitly advertises the corresponding hosted action.
 */
export declare function getHostedSoulGenesisComposerState(
	source: HostedSoulBootstrapTerminalDeclarationEvidenceSource
): HostedSoulGenesisComposerState;
export declare class HostedSoulBootstrapClient {
	private readonly executor;
	constructor(config: HostedSoulBootstrapClientConfig);
	current(input: HostedSoulBootstrapCurrentInput | string): Promise<HostedSoulBootstrapResult>;
	getCurrentHostedSoulBootstrap(
		input: HostedSoulBootstrapCurrentInput | string
	): Promise<HostedSoulBootstrapResult>;
	startOrResumeHostedSoulBootstrap(
		input: StartHostedSoulBootstrapInput
	): Promise<HostedSoulBootstrapMutationResult>;
	startOrResume(input: StartHostedSoulBootstrapInput): Promise<HostedSoulBootstrapMutationResult>;
	startHostedSoulBootstrap(
		input: StartHostedSoulBootstrapInput
	): Promise<HostedSoulBootstrapMutationResult>;
	sendHostedSoulGenesisMessage(
		input: SendHostedSoulGenesisMessageInput
	): Promise<HostedSoulBootstrapMutationResult>;
	completeHostedSoulGenesis(
		input: CompleteHostedSoulGenesisInput
	): Promise<HostedSoulBootstrapMutationResult>;
	publishHostedSoul(input: PublishHostedSoulInput): Promise<HostedSoulBootstrapMutationResult>;
	restartSoulBootstrap(
		input: RestartSoulBootstrapInput
	): Promise<HostedSoulBootstrapMutationResult>;
	listHostedGenesisConversations(
		input: HostedSoulBootstrapCurrentInput | string
	): Promise<HostedGenesisConversationSummaryResult>;
	recoverHostedSoulGenesisTurn(
		input: RecoverHostedSoulGenesisTurnInput
	): Promise<HostedSoulBootstrapMutationResult>;
	private executeQuery;
	private executeMutation;
}
export declare function normalizeHostedGenesisStatus(
	value: unknown
): HostedSoulGenesisConversationStatus | null;
//# sourceMappingURL=hostedBootstrap.d.ts.map
