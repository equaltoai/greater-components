import { describe, expect, it } from 'vitest';

import {
	createProject44SoulBootstrapErrorState,
	createProject44SoulBootstrapSurface,
	project44SoulBootstrapFixtures,
	project44SoulBootstrapIds,
	project44SoulBootstrapSigning,
} from '../fixtures/soul-bootstrap';
import type {
	SoulBootstrapGraphQLClient,
	SoulBootstrapPublicationEvidence,
	SoulBootstrapSigningCheckpoint,
	SoulBootstrapSurface,
} from '../soul/bootstrap';
import {
	createHostedSoulBootstrapClient,
	getHostedSoulBootstrapTerminalDeclarationEvidence,
	isHostedSoulBootstrapPublishReady,
	type HostedSoulBootstrapNextAction,
	type HostedSoulBootstrapPhase,
	type HostedSoulBootstrapRecoveryAction,
	type HostedSoulBootstrapRecoveryCategory,
} from '../soul/hostedBootstrap';

const activeHostIds = {
	hostRegistrationId: project44SoulBootstrapIds.registrationId,
	hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
	hostConversationId: project44SoulBootstrapIds.conversationId,
} as const;

const completedHostedConversationCheckpoint = {
	__typename: 'SoulBootstrapSigningCheckpoint',
	...project44SoulBootstrapSigning.hostedConversation,
	status: 'completed',
	hostRequestId: 'host-req-complete-002',
} satisfies SoulBootstrapSigningCheckpoint;

type Project49RepresentabilityRow = Readonly<{
	label: string;
	hostStatus: string;
	phase: HostedSoulBootstrapPhase;
	state: string;
	typedNextAction: HostedSoulBootstrapNextAction;
	recoveryCategory?: HostedSoulBootstrapRecoveryCategory | null;
	recoveryAction?: HostedSoulBootstrapRecoveryAction | null;
	hostRegistrationId?: string | null;
	hostSoulAgentId?: string | null;
	hostConversationId?: string | null;
	signingCheckpoints?: readonly SoulBootstrapSigningCheckpoint[];
	publication?: SoulBootstrapPublicationEvidence | null;
	error?: ReturnType<typeof createProject44SoulBootstrapErrorState> | null;
	retryable?: boolean;
	restartRequired?: boolean;
	restartAvailable?: boolean;
	canPublishHostedSoul: boolean;
	publishReason: string;
}>;

const project49Rows = [
	{
		label: 'no registration',
		hostStatus: 'no_registration',
		phase: 'NOT_STARTED',
		state: 'not_started',
		typedNextAction: 'START_HOSTED_BOOTSTRAP',
		hostRegistrationId: null,
		hostSoulAgentId: null,
		hostConversationId: null,
		canPublishHostedSoul: false,
		publishReason: 'blocked:no_host_registration',
	},
	{
		label: 'registration active, no conversation',
		hostStatus: 'registration_active_no_conversation',
		phase: 'CONVERSATION',
		state: 'conversation.registration_active',
		typedNextAction: 'SEND_HOSTED_SOUL_GENESIS_MESSAGE',
		hostRegistrationId: activeHostIds.hostRegistrationId,
		hostSoulAgentId: activeHostIds.hostSoulAgentId,
		hostConversationId: null,
		canPublishHostedSoul: false,
		publishReason: 'blocked:no_host_conversation',
	},
	{
		label: 'created',
		hostStatus: 'created',
		phase: 'CONVERSATION',
		state: 'conversation.created',
		typedNextAction: 'REFRESH_STATE',
		recoveryCategory: 'REFRESH_STATE',
		recoveryAction: 'REFRESH_STATE',
		...activeHostIds,
		canPublishHostedSoul: false,
		publishReason: 'blocked:created_requires_lesser_projection_row',
	},
	{
		label: 'in_progress',
		hostStatus: 'in_progress',
		phase: 'CONVERSATION',
		state: 'conversation.in_progress',
		typedNextAction: 'REFRESH_STATE',
		recoveryCategory: 'REFRESH_STATE',
		recoveryAction: 'REFRESH_STATE',
		...activeHostIds,
		canPublishHostedSoul: false,
		publishReason: 'blocked:conversation_in_progress',
	},
	{
		label: 'assistant_turn_ready',
		hostStatus: 'assistant_turn_ready',
		phase: 'CONVERSATION',
		state: 'conversation.assistant_turn_ready',
		typedNextAction: 'COMPLETE_HOSTED_SOUL_GENESIS',
		...activeHostIds,
		canPublishHostedSoul: false,
		publishReason: 'blocked:terminal_declaration_evidence_absent',
	},
	{
		label: 'declaration_extraction_pending',
		hostStatus: 'declaration_extraction_pending',
		phase: 'CONVERSATION',
		state: 'conversation.declaration_extraction_pending',
		typedNextAction: 'REFRESH_STATE',
		recoveryCategory: 'REFRESH_STATE',
		recoveryAction: 'REFRESH_STATE',
		...activeHostIds,
		canPublishHostedSoul: false,
		publishReason: 'blocked:declaration_extraction_pending',
	},
	{
		label: 'declaration_ready',
		hostStatus: 'declaration_ready',
		phase: 'FINALIZE',
		state: 'conversation.declaration_ready',
		typedNextAction: 'PUBLISH_HOSTED_SOUL',
		...activeHostIds,
		signingCheckpoints: [completedHostedConversationCheckpoint],
		canPublishHostedSoul: true,
		publishReason: 'allowed:active_conversation_terminal_declaration_evidence',
	},
	{
		label: 'failed retry same step',
		hostStatus: 'failed',
		phase: 'ERROR',
		state: 'error.host_failed',
		typedNextAction: 'RETRY_SAME_STEP',
		recoveryCategory: 'RETRY_SAME_STEP',
		recoveryAction: 'RETRY_SAME_STEP',
		...activeHostIds,
		error: createProject44SoulBootstrapErrorState({
			code: 'HOST_CONVERSATION_FAILED',
			message: 'Host failed before producing declaration evidence.',
			source: 'host',
			statusCode: 200,
			recoveryCategory: 'RETRY_SAME_STEP',
			recoveryAction: 'RETRY_SAME_STEP',
			retryable: true,
			restartRequired: false,
		}),
		retryable: true,
		restartAvailable: true,
		canPublishHostedSoul: false,
		publishReason: 'blocked:host_failure',
	},
	{
		label: 'failed restart bootstrap',
		hostStatus: 'failed',
		phase: 'ERROR',
		state: 'error.host_failed',
		typedNextAction: 'RESTART_SOUL_BOOTSTRAP',
		recoveryCategory: 'RESTART_REQUIRED',
		recoveryAction: 'RESTART_BOOTSTRAP',
		...activeHostIds,
		error: createProject44SoulBootstrapErrorState({
			code: 'HOST_CONVERSATION_RESTART_REQUIRED',
			message: 'Host requires a new bootstrap attempt.',
			source: 'host',
			statusCode: 200,
			recoveryCategory: 'RESTART_REQUIRED',
			recoveryAction: 'RESTART_BOOTSTRAP',
			retryable: false,
			restartRequired: true,
		}),
		restartRequired: true,
		restartAvailable: true,
		canPublishHostedSoul: false,
		publishReason: 'blocked:host_failure_restart',
	},
	{
		label: 'published/bound',
		hostStatus: 'published_bound',
		phase: 'COMPLETE',
		state: 'complete.bound',
		typedNextAction: 'COMPLETE',
		...activeHostIds,
		signingCheckpoints: [completedHostedConversationCheckpoint],
		publication: project44SoulBootstrapFixtures.hostedPublished.state.publication,
		canPublishHostedSoul: false,
		publishReason: 'complete:already_published_bound',
	},
] as const satisfies readonly Project49RepresentabilityRow[];

describe('Project 49 hosted genesis representability', () => {
	it.each(project49Rows)(
		'models $label as a Lesser-hosted soul bootstrap projection row',
		async (row) => {
			const surface = createProject49Surface(row);
			const client = createHostedSoulBootstrapClient({
				graphqlClient: createSurfaceGraphQLClient(surface),
			});

			const result = await client.current(project44SoulBootstrapIds.username);

			expect(result.hosted).toMatchObject({
				phase: row.phase,
				state: row.state,
				bootstrapMode: 'HOSTED',
				authorityModel: 'INSTANCE_TRUST',
				typedNextAction: row.typedNextAction,
				recoveryCategory: row.recoveryCategory ?? null,
				recoveryAction: row.recoveryAction ?? null,
				hostRegistrationId: row.hostRegistrationId ?? null,
				hostSoulAgentId: row.hostSoulAgentId ?? null,
				hostConversationId: row.hostConversationId ?? null,
			});
			expect(result.typedNextAction).toBe(row.typedNextAction);
			expect(result.recoveryCategory).toBe(row.recoveryCategory ?? null);
			expect(result.recoveryAction).toBe(row.recoveryAction ?? null);
			expect(result.hostRequest).toMatchObject({
				lastHostRequestId: project44SoulBootstrapIds.hostRequestId,
			});
			expect(result.publication ?? null).toBe(row.publication ?? null);
			expect(
				isHostedSoulBootstrapPublishReady(result, {
					conversationId: activeHostIds.hostConversationId,
				})
			).toBe(row.canPublishHostedSoul);
			expect(row.publishReason).toBeTruthy();
		}
	);

	it('maps every locked Host recovery action into existing Lesser recovery/next-action enums', () => {
		const recoveryMappings = [
			{
				hostRecoveryAction: 'refresh_state',
				recoveryCategory: 'REFRESH_STATE',
				recoveryAction: 'REFRESH_STATE',
				typedNextAction: 'REFRESH_STATE',
			},
			{
				hostRecoveryAction: 'retry_same_step',
				recoveryCategory: 'RETRY_SAME_STEP',
				recoveryAction: 'RETRY_SAME_STEP',
				typedNextAction: 'RETRY_SAME_STEP',
			},
			{
				hostRecoveryAction: 'restart_soul_bootstrap',
				recoveryCategory: 'RESTART_REQUIRED',
				recoveryAction: 'RESTART_BOOTSTRAP',
				typedNextAction: 'RESTART_SOUL_BOOTSTRAP',
			},
			{
				hostRecoveryAction: 'operator_action',
				recoveryCategory: 'OPERATOR_ACTION_REQUIRED',
				recoveryAction: 'CONTACT_OPERATOR',
				typedNextAction: 'OPERATOR_ACTION_REQUIRED',
			},
		] as const satisfies readonly Readonly<{
			hostRecoveryAction: string;
			recoveryCategory: HostedSoulBootstrapRecoveryCategory;
			recoveryAction: HostedSoulBootstrapRecoveryAction;
			typedNextAction: HostedSoulBootstrapNextAction;
		}>[];

		for (const mapping of recoveryMappings) {
			const surface = createProject49Surface({
				label: mapping.hostRecoveryAction,
				hostStatus: 'failed',
				phase: mapping.typedNextAction === 'REFRESH_STATE' ? 'CONVERSATION' : 'ERROR',
				state:
					mapping.typedNextAction === 'REFRESH_STATE'
						? 'conversation.in_progress'
						: 'error.host_failed',
				typedNextAction: mapping.typedNextAction,
				recoveryCategory: mapping.recoveryCategory,
				recoveryAction: mapping.recoveryAction,
				...activeHostIds,
				canPublishHostedSoul: false,
				publishReason: `blocked:${mapping.hostRecoveryAction}`,
			});

			expect(surface.typedNextAction, mapping.hostRecoveryAction).toBe(mapping.typedNextAction);
			expect(surface.recoveryCategory, mapping.hostRecoveryAction).toBe(mapping.recoveryCategory);
			expect(surface.recoveryAction, mapping.hostRecoveryAction).toBe(mapping.recoveryAction);
			expect(isHostedSoulBootstrapPublishReady(surface)).toBe(false);
		}
	});

	it('fails closed for future compact publishGate/terminalDeclarationEvidence fields without current evidence', () => {
		const compactOnlySurface = withRuntimeStateExtras(
			createProject49Surface({
				label: 'future compact declaration_ready',
				hostStatus: 'declaration_ready',
				phase: 'FINALIZE',
				state: 'conversation.declaration_ready',
				typedNextAction: 'PUBLISH_HOSTED_SOUL',
				...activeHostIds,
				canPublishHostedSoul: true,
				publishReason: 'allowed:active_conversation_terminal_declaration_evidence',
			}),
			{
				terminalDeclarationEvidence: {
					conversationId: activeHostIds.hostConversationId,
					hostStatus: 'declaration_ready',
					hostRequestId: 'host-req-complete-002',
					declarationsHash:
						'sha256:7af7a1c0f7c74c872a3a8a0a3e0af49a4a7c7f1f9b59f6827b1849d5f3f3a001',
				},
				publishGate: {
					canPublishHostedSoul: true,
					reason: 'allowed:active_conversation_terminal_declaration_evidence',
					requiresActiveConversationTerminalDeclarationEvidence: true,
				},
			}
		);

		expect(getHostedSoulBootstrapTerminalDeclarationEvidence(compactOnlySurface)).toBeNull();
		expect(isHostedSoulBootstrapPublishReady(compactOnlySurface)).toBe(false);
	});
});

function createProject49Surface(row: Project49RepresentabilityRow): SoulBootstrapSurface {
	return createProject44SoulBootstrapSurface({
		phase: row.phase,
		state: row.state,
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
		typedNextAction: row.typedNextAction,
		nextAction: row.typedNextAction.toLowerCase(),
		recoveryCategory: row.recoveryCategory ?? null,
		recoveryAction: row.recoveryAction ?? null,
		retryable: row.retryable ?? row.error?.retryable ?? false,
		restartRequired: row.restartRequired ?? row.error?.restartRequired ?? false,
		restartAvailable: row.restartAvailable ?? false,
		hostRegistrationId: row.hostRegistrationId ?? null,
		hostSoulAgentId: row.hostSoulAgentId ?? null,
		hostConversationId: row.hostConversationId ?? null,
		walletAddress: null,
		principalAddress: null,
		signingCheckpoints: row.signingCheckpoints ?? [],
		publication: row.publication ?? null,
		error: row.error ?? null,
	});
}

function createSurfaceGraphQLClient(surface: SoulBootstrapSurface): SoulBootstrapGraphQLClient {
	return {
		query: async () => ({ data: { soulBootstrap: surface } }),
		mutate: async () => {
			throw new Error('mutation should not be called for representability checks');
		},
	};
}

function withRuntimeStateExtras(
	surface: SoulBootstrapSurface,
	extras: Record<string, unknown>
): SoulBootstrapSurface {
	return {
		...surface,
		state: {
			...surface.state,
			...extras,
		} as SoulBootstrapSurface['state'],
	};
}
