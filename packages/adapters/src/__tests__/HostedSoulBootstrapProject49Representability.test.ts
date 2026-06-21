import { describe, expect, it } from 'vitest';

import {
	createProject44SoulBootstrapErrorState,
	createProject44SoulBootstrapSurface,
	project44SoulBootstrapIds,
	project49HostedGenesisStatusFixtures,
} from '../fixtures/soul-bootstrap';
import type { SoulBootstrapGraphQLClient, SoulBootstrapSurface } from '../soul/bootstrap';
import {
	canPublishHostedSoulBootstrap,
	createHostedSoulBootstrapClient,
	getHostedSoulBootstrapTerminalDeclarationEvidenceSummary,
	isHostedSoulBootstrapDeclarationReady,
	isHostedSoulBootstrapInProgress,
	isHostedSoulBootstrapPublishReady,
	type HostedSoulBootstrapNextAction,
	type HostedSoulBootstrapRecoveryAction,
	type HostedSoulBootstrapRecoveryCategory,
	type LesserHostHostedGenesisConversation,
} from '../soul/hostedBootstrap';

const activeConversationId = project44SoulBootstrapIds.conversationId;
const hostAgentId = '0x2222222222222222222222222222222222222222222222222222222222222222';

const liveInProgressHostConversation = {
	registration_id: project44SoulBootstrapIds.registrationId,
	conversation_id: activeConversationId,
	agent_id: hostAgentId,
	status: 'in_progress',
	latest_turn_id: 'turn-project-49-user',
	message_count: 1,
	request_id: 'req-project-49-in-progress',
	trace_ids: {
		host_request_id: 'req-project-49-in-progress',
		correlation_id: 'lesser-bootstrap-01',
		idempotency_key: 'idem-hosted-genesis-01',
	},
	poll_after_seconds: 2,
	created_at: '2026-06-18T13:10:00Z',
	updated_at: '2026-06-18T13:10:01Z',
} satisfies LesserHostHostedGenesisConversation;

const hostStatusConversations = [
	{
		label: 'created',
		conversation: {
			...liveInProgressHostConversation,
			status: 'created',
			message_count: 0,
			request_id: 'req-project-49-created',
		} satisfies LesserHostHostedGenesisConversation,
		inProgress: true,
		declarationReady: false,
		canPublish: false,
	},
	{
		label: 'in_progress',
		conversation: liveInProgressHostConversation,
		inProgress: true,
		declarationReady: false,
		canPublish: false,
	},
	{
		label: 'assistant_turn_ready',
		conversation: {
			...liveInProgressHostConversation,
			status: 'assistant_turn_ready',
			request_id: 'req-project-49-assistant-ready',
		} satisfies LesserHostHostedGenesisConversation,
		inProgress: true,
		declarationReady: false,
		canPublish: false,
	},
	{
		label: 'declaration_extraction_pending',
		conversation: {
			...liveInProgressHostConversation,
			status: 'declaration_extraction_pending',
			request_id: 'req-project-49-extraction-pending',
		} satisfies LesserHostHostedGenesisConversation,
		inProgress: true,
		declarationReady: false,
		canPublish: false,
	},
	{
		label: 'declaration_ready',
		conversation: {
			...liveInProgressHostConversation,
			status: 'declaration_ready',
			message_count: 2,
			request_id: 'req-project-49-declaration-ready',
			produced_declarations: {
				declaration_id: 'decl-project-49',
				declaration_hash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				produced_at: '2026-06-18T13:12:30Z',
				declarations: {
					selfDescription: {
						summary: 'Demo hosted soul for a managed Lesser drone.',
					},
					capabilities: [{ id: 'chat' }],
					boundaries: [{ id: 'no-credential-disclosure' }],
					transparency: { authority_model: 'instance_trust' },
				},
				evidence: {
					source: 'host_conversation',
					registration_id: project44SoulBootstrapIds.registrationId,
					conversation_id: activeConversationId,
					agent_id: hostAgentId,
					message_count: 2,
					request_id: 'req-project-49-declaration-ready',
				},
			},
			completed_at: '2026-06-18T13:12:30Z',
		} satisfies LesserHostHostedGenesisConversation,
		inProgress: false,
		declarationReady: true,
		canPublish: true,
	},
	{
		label: 'failed',
		conversation: {
			...liveInProgressHostConversation,
			status: 'failed',
			request_id: 'req-project-49-failed',
			failure: {
				code: 'llm_unavailable',
				message: 'Assistant turn failed before declaration extraction.',
				retryable: true,
				recovery: {
					action: 'retry_same_step',
					max_attempts: 3,
					retry_after_seconds: 30,
					reason: 'provider_unavailable',
				},
			},
			completed_at: '2026-06-18T13:11:00Z',
		} satisfies LesserHostHostedGenesisConversation,
		inProgress: false,
		declarationReady: false,
		canPublish: false,
	},
] as const;

describe('Project 49 hosted genesis representability', () => {
	it.each(project49HostedGenesisStatusFixtures)(
		'models $label as a Lesser-hosted soul bootstrap projection row',
		async (row) => {
			const client = createHostedSoulBootstrapClient({
				graphqlClient: createSurfaceGraphQLClient(row.surface),
			});

			const result = await client.current(project44SoulBootstrapIds.username);

			expect(result.hosted).toMatchObject({
				bootstrapMode: 'HOSTED',
				authorityModel: 'INSTANCE_TRUST',
				state: row.surface.state.state,
				phase: row.surface.state.phase,
				hostConversationStatus: row.surface.state.hostConversationStatus ?? null,
				typedNextAction: row.surface.state.typedNextAction,
				recoveryCategory: row.surface.state.recoveryCategory ?? null,
				recoveryAction: row.surface.state.recoveryAction ?? null,
				hostRegistrationId: row.surface.state.hostRegistrationId ?? null,
				hostSoulAgentId: row.surface.state.hostSoulAgentId ?? null,
				hostConversationId: row.surface.state.hostConversationId ?? null,
			});
			expect(result.typedNextAction).toBe(row.surface.typedNextAction);
			expect(result.hostRequest).toMatchObject({
				lastHostRequestId: project44SoulBootstrapIds.hostRequestId,
			});
			expect(
				isHostedSoulBootstrapInProgress(result, { conversationId: activeConversationId })
			).toBe(row.inProgress);
			expect(
				isHostedSoulBootstrapDeclarationReady(result, { conversationId: activeConversationId })
			).toBe(row.declarationReady);
			expect(canPublishHostedSoulBootstrap(result, { conversationId: activeConversationId })).toBe(
				row.canPublish
			);
			expect(
				isHostedSoulBootstrapPublishReady(result, { conversationId: activeConversationId })
			).toBe(row.canPublish);
			expect(result.publishGate?.reason).toBe(row.publishReason);

			if (row.declarationReady) {
				expect(
					getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(result, {
						conversationId: activeConversationId,
					})
				).toMatchObject({
					conversationId: activeConversationId,
					hostStatus: 'declaration_ready',
					declarationsHash:
						'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				});
			} else {
				expect(getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(result)).toBeNull();
			}
		}
	);

	it.each(hostStatusConversations)(
		'maps generated Lesser Host $label conversation status through fail-closed helpers',
		(row) => {
			expect(
				isHostedSoulBootstrapInProgress(row.conversation, { conversationId: activeConversationId })
			).toBe(row.inProgress);
			expect(
				isHostedSoulBootstrapDeclarationReady(row.conversation, {
					conversationId: activeConversationId,
				})
			).toBe(row.declarationReady);
			expect(
				canPublishHostedSoulBootstrap(row.conversation, { conversationId: activeConversationId })
			).toBe(row.canPublish);
		}
	);

	it('preserves the observed live in_progress Host shape as progress, not publish readiness', () => {
		expect(isHostedSoulBootstrapInProgress(liveInProgressHostConversation)).toBe(true);
		expect(isHostedSoulBootstrapDeclarationReady(liveInProgressHostConversation)).toBe(false);
		expect(canPublishHostedSoulBootstrap(liveInProgressHostConversation)).toBe(false);
	});

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
			const surface = createProject49RecoverySurface(mapping);

			expect(surface.typedNextAction, mapping.hostRecoveryAction).toBe(mapping.typedNextAction);
			expect(surface.recoveryCategory, mapping.hostRecoveryAction).toBe(mapping.recoveryCategory);
			expect(surface.recoveryAction, mapping.hostRecoveryAction).toBe(mapping.recoveryAction);
			expect(canPublishHostedSoulBootstrap(surface)).toBe(false);
		}
	});

	it('fails closed for malformed, stale, missing, or compact-only publish data', () => {
		const declarationReady = project49HostedGenesisStatusFixtures.find(
			(row) => row.hostStatus === 'declaration_ready'
		)?.surface;
		if (!declarationReady) {
			throw new Error('missing declaration_ready fixture');
		}

		const malformedCases = [
			{
				surface: withRuntimeStateExtras(declarationReady, { terminalDeclarationEvidence: null }),
				terminalEvidencePresent: false,
			},
			{
				surface: withRuntimeStateExtras(declarationReady, {
					terminalDeclarationEvidence: {
						conversationId: `${activeConversationId}-stale`,
						hostStatus: 'declaration_ready',
						declarationsHash:
							'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					},
				}),
				terminalEvidencePresent: false,
			},
			{
				surface: withRuntimeStateExtras(declarationReady, {
					terminalDeclarationEvidence: {
						conversationId: activeConversationId,
						hostStatus: 'declaration_ready',
						declarationsHash: 'not-a-sha256',
					},
				}),
				terminalEvidencePresent: false,
			},
			{
				surface: withRuntimeStateExtras(declarationReady, {
					publishGate: {
						canPublishHostedSoul: true,
						reason: 'allowed:active_conversation_terminal_declaration_evidence',
						requiresActiveConversationTerminalDeclarationEvidence: true,
					},
					terminalDeclarationEvidence: null,
				}),
				terminalEvidencePresent: false,
			},
			{
				surface: withRuntimeStateExtras(declarationReady, {
					publishGate: {
						canPublishHostedSoul: true,
						reason: 'allowed:active_conversation_terminal_declaration_evidence',
						requiresActiveConversationTerminalDeclarationEvidence: false,
					},
				}),
				terminalEvidencePresent: true,
			},
		] as const;

		for (const { surface, terminalEvidencePresent } of malformedCases) {
			const terminalEvidence = getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(surface);
			if (terminalEvidencePresent) {
				expect(terminalEvidence).not.toBeNull();
			} else {
				expect(terminalEvidence).toBeNull();
			}
			expect(canPublishHostedSoulBootstrap(surface)).toBe(false);
		}
	});

	it('fails closed for malformed generated Host declaration evidence', () => {
		const declarationReadyHost = hostStatusConversations.find(
			(row) => row.label === 'declaration_ready'
		)?.conversation;
		const producedDeclarations = declarationReadyHost?.produced_declarations;
		if (!declarationReadyHost || !producedDeclarations) {
			throw new Error('missing declaration_ready Host fixture');
		}

		const staleHostEvidence = {
			...declarationReadyHost,
			produced_declarations: {
				...producedDeclarations,
				evidence: {
					...producedDeclarations.evidence,
					conversation_id: `${activeConversationId}-stale`,
				},
			},
		} satisfies LesserHostHostedGenesisConversation;

		expect(getHostedSoulBootstrapTerminalDeclarationEvidenceSummary(staleHostEvidence)).toBeNull();
		expect(canPublishHostedSoulBootstrap(staleHostEvidence)).toBe(false);
	});
});

function createProject49RecoverySurface(mapping: {
	recoveryCategory: HostedSoulBootstrapRecoveryCategory;
	recoveryAction: HostedSoulBootstrapRecoveryAction;
	typedNextAction: HostedSoulBootstrapNextAction;
}): SoulBootstrapSurface {
	return createProject44SoulBootstrapSurface({
		phase: mapping.typedNextAction === 'REFRESH_STATE' ? 'CONVERSATION' : 'ERROR',
		state:
			mapping.typedNextAction === 'REFRESH_STATE'
				? 'conversation.in_progress'
				: 'error.host_failed',
		hostConversationStatus: mapping.typedNextAction === 'REFRESH_STATE' ? 'in_progress' : 'failed',
		typedNextAction: mapping.typedNextAction,
		recoveryCategory: mapping.recoveryCategory,
		recoveryAction: mapping.recoveryAction,
		hostRegistrationId: project44SoulBootstrapIds.registrationId,
		hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
		hostConversationId: activeConversationId,
		walletAddress: null,
		principalAddress: null,
		error:
			mapping.typedNextAction === 'REFRESH_STATE'
				? null
				: createProject44SoulBootstrapErrorState({
						code: 'HOST_CONVERSATION_FAILED',
						message: 'Host failed before producing declaration evidence.',
						source: 'host',
						statusCode: 200,
						recoveryCategory: mapping.recoveryCategory,
						recoveryAction: mapping.recoveryAction,
						retryable: mapping.recoveryAction === 'RETRY_SAME_STEP',
						restartRequired: mapping.recoveryAction === 'RESTART_BOOTSTRAP',
					}),
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
