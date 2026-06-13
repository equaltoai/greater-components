/**
 * Project 44 Soul bootstrap facade fixtures.
 *
 * These fixtures model the Lesser GraphQL surfaces that Sim consumes through the browser-safe
 * bootstrap facade. They intentionally contain only Lesser-relayed state and signing material: no
 * lesser-host base URL, Host bearer token, browser instance key, or Host control-plane request
 * reconstruction data.
 */

import type {
	SoulBootstrapErrorState,
	SoulBootstrapPhase,
	SoulBootstrapPublicationEvidence,
	SoulBootstrapSigningCheckpoint,
	SoulBootstrapState,
	SoulBootstrapSurface,
} from '../soul/bootstrap.js';

export const project44SoulBootstrapIds = {
	username: 'agent-zero',
	bodyId: 'body-agent-zero',
	registrationId: 'registration-project-44',
	conversationId: 'conversation-project-44',
	soulAgentId: 'host-soul-agent-project-44',
	walletAddress: '0x1111111111111111111111111111111111111111',
	principalAddress: '0x2222222222222222222222222222222222222222',
	correlationKey: 'corr-project-44',
	beginIdempotencyKey: 'idem-begin-project-44',
	walletIdempotencyKey: 'idem-wallet-project-44',
	principalIdempotencyKey: 'idem-principal-project-44',
	conversationIdempotencyKey: 'idem-conversation-project-44',
	finalizeIdempotencyKey: 'idem-finalize-project-44',
	hostRequestId: 'host-request-project-44',
	issuedAt: '2026-06-12T12:10:00Z',
	declaredAt: '2026-06-12T12:05:00Z',
	completedAt: '2026-06-12T12:15:00Z',
} as const;

export const project44SoulBootstrapSigning = {
	walletChallenge: {
		name: 'wallet',
		status: 'ready',
		message: 'Sign the Lesser-provided Project 44 wallet challenge.',
		messageEncoding: 'utf8',
		messageHex: null,
		canonicalJson: null,
		digestHex: null,
		boundaryRequirementsJson: null,
		registrationPreviewJson: null,
		finalizeRequestTemplateJson: null,
		signingMethod: 'eip191_personal_sign',
		signerAddress: project44SoulBootstrapIds.walletAddress,
		principalAddress: null,
		version: '1',
		expectedVersion: null,
		nextVersion: null,
		issuedAt: project44SoulBootstrapIds.issuedAt,
		declaredAt: null,
		completedAt: null,
		hostRequestId: project44SoulBootstrapIds.hostRequestId,
	},
	principalDeclaration: {
		name: 'principal_declaration',
		status: 'ready',
		message: null,
		messageEncoding: 'hex_bytes',
		messageHex: '0x1111111111111111111111111111111111111111111111111111111111111111',
		canonicalJson:
			'{"bodyId":"body-agent-zero","principal":"0x2222222222222222222222222222222222222222","source":"lesser"}',
		digestHex: '0x1111111111111111111111111111111111111111111111111111111111111111',
		boundaryRequirementsJson: null,
		registrationPreviewJson:
			'{"registrationId":"registration-project-44","principal":"0x2222222222222222222222222222222222222222"}',
		finalizeRequestTemplateJson: null,
		signingMethod: 'eip191_personal_sign',
		signerAddress: project44SoulBootstrapIds.principalAddress,
		principalAddress: project44SoulBootstrapIds.principalAddress,
		version: '1',
		expectedVersion: null,
		nextVersion: null,
		issuedAt: project44SoulBootstrapIds.issuedAt,
		declaredAt: project44SoulBootstrapIds.declaredAt,
		completedAt: null,
		hostRequestId: project44SoulBootstrapIds.hostRequestId,
	},
	finalize: {
		name: 'finalize',
		status: 'ready',
		message: null,
		messageEncoding: 'hex_bytes',
		messageHex: '0x2222222222222222222222222222222222222222222222222222222222222222',
		canonicalJson:
			'{"registrationId":"registration-project-44","conversationId":"conversation-project-44","source":"lesser"}',
		digestHex: '0x2222222222222222222222222222222222222222222222222222222222222222',
		boundaryRequirementsJson:
			'[{"boundary_id":"project-44-continuity","category":"continuity","statement":"Preserve Project 44 continuity.","signature_hex":"0xboundary","signer_wallet":"0x1111111111111111111111111111111111111111","signing_method":"eip191_personal_sign","message_encoding":"utf8","message":"Preserve Project 44 continuity.","digest_hex":"0x3333333333333333333333333333333333333333333333333333333333333333"}]',
		registrationPreviewJson: '{"agentId":"host-soul-agent-project-44","bodyId":"body-agent-zero"}',
		finalizeRequestTemplateJson:
			'{"boundary_signatures":{"project-44-continuity":"0xboundary"},"issued_at":"2026-06-12T12:10:00Z","expected_version":3,"self_attestation":""}',
		signingMethod: 'eip191_personal_sign',
		signerAddress: project44SoulBootstrapIds.walletAddress,
		principalAddress: project44SoulBootstrapIds.principalAddress,
		version: '1',
		expectedVersion: 3,
		nextVersion: 4,
		issuedAt: project44SoulBootstrapIds.issuedAt,
		declaredAt: project44SoulBootstrapIds.declaredAt,
		completedAt: null,
		hostRequestId: project44SoulBootstrapIds.hostRequestId,
	},
} satisfies Record<string, Omit<SoulBootstrapSigningCheckpoint, '__typename'>>;

export function createProject44SoulBootstrapErrorState(
	overrides: Partial<SoulBootstrapErrorState> = {}
): SoulBootstrapErrorState {
	return {
		__typename: 'SoulBootstrapErrorState',
		code: 'MISSING_TRUST',
		message: 'Project 44 bootstrap requires a trusted Lesser identity before Host registration.',
		source: 'lesser',
		statusCode: 403,
		hostRequestId: project44SoulBootstrapIds.hostRequestId,
		at: '2026-06-12T12:00:00Z',
		...overrides,
	};
}

function createProject44SigningCheckpoint(
	overrides: Partial<SoulBootstrapSigningCheckpoint>
): SoulBootstrapSigningCheckpoint {
	return {
		__typename: 'SoulBootstrapSigningCheckpoint',
		name: 'checkpoint',
		status: 'pending_signature',
		message: null,
		messageEncoding: null,
		messageHex: null,
		canonicalJson: null,
		digestHex: null,
		boundaryRequirementsJson: null,
		registrationPreviewJson: null,
		finalizeRequestTemplateJson: null,
		signingMethod: null,
		signerAddress: null,
		principalAddress: null,
		version: null,
		expectedVersion: null,
		nextVersion: null,
		issuedAt: null,
		declaredAt: null,
		completedAt: null,
		hostRequestId: project44SoulBootstrapIds.hostRequestId,
		...overrides,
	};
}

function createProject44PublicationEvidence(
	overrides: Partial<SoulBootstrapPublicationEvidence> = {}
): SoulBootstrapPublicationEvidence {
	return {
		__typename: 'SoulBootstrapPublicationEvidence',
		agentId: project44SoulBootstrapIds.soulAgentId,
		anchorState: 'HOSTED_OFF_CHAIN',
		publishedAt: project44SoulBootstrapIds.completedAt,
		publishedVersion: 4,
		registrationS3Key: 'soul-bootstrap/project-44/registration.json',
		registrationUri: 's3://lesser-host-soul-bootstrap/project-44/registration.json',
		versionedRegistrationS3Key: 'soul-bootstrap/project-44/registration-v4.json',
		versionedRegistrationUri: 's3://lesser-host-soul-bootstrap/project-44/registration-v4.json',
		...overrides,
	};
}

export interface Project44SoulBootstrapSurfaceOptions {
	phase?: SoulBootstrapPhase;
	state?: string;
	executable?: boolean;
	existingSoulAgentId?: string | null;
	hostBridgeAvailable?: boolean;
	nextAction?: string | null;
	soulBindingState?: SoulBootstrapSurface['soulBindingState'];
	error?: SoulBootstrapErrorState | null;
	signingCheckpoints?: readonly SoulBootstrapSigningCheckpoint[];
	publication?: SoulBootstrapPublicationEvidence | null;
	hostConversationId?: string | null;
	hostRegistrationId?: string | null;
	hostSoulAgentId?: string | null;
	walletAddress?: string | null;
	principalAddress?: string | null;
}

export function createProject44SoulBootstrapSurface(
	options: Project44SoulBootstrapSurfaceOptions = {}
): SoulBootstrapSurface {
	const error = options.error ?? null;
	const phase = options.phase ?? (error ? 'ERROR' : 'NOT_STARTED');
	const state: SoulBootstrapState = {
		__typename: 'SoulBootstrapState',
		bodyId: project44SoulBootstrapIds.bodyId,
		username: project44SoulBootstrapIds.username,
		state: options.state ?? (error ? 'blocked' : 'ready'),
		phase,
		walletAddress: options.walletAddress ?? project44SoulBootstrapIds.walletAddress,
		principalAddress: options.principalAddress ?? null,
		hostRegistrationId: options.hostRegistrationId ?? project44SoulBootstrapIds.registrationId,
		hostConversationId: options.hostConversationId ?? null,
		hostSoulAgentId: options.hostSoulAgentId ?? null,
		updatedAt: '2026-06-12T12:00:00Z',
		signingCheckpoints: options.signingCheckpoints ?? [],
		publication: options.publication ?? null,
		error,
		correlation: {
			__typename: 'SoulBootstrapCorrelationState',
			correlationKey: project44SoulBootstrapIds.correlationKey,
			beginIdempotencyKey: project44SoulBootstrapIds.beginIdempotencyKey,
			walletVerificationIdempotencyKey: project44SoulBootstrapIds.walletIdempotencyKey,
			principalDeclarationIdempotencyKey: project44SoulBootstrapIds.principalIdempotencyKey,
			conversationIdempotencyKey: project44SoulBootstrapIds.conversationIdempotencyKey,
			finalizeIdempotencyKey: project44SoulBootstrapIds.finalizeIdempotencyKey,
			lastHostRequestId: project44SoulBootstrapIds.hostRequestId,
		},
	};

	return {
		__typename: 'SoulBootstrapSurface',
		username: project44SoulBootstrapIds.username,
		executable: options.executable ?? !error,
		existingSoulAgentId: options.existingSoulAgentId ?? null,
		hostBridgeAvailable: options.hostBridgeAvailable ?? !error,
		nextAction: options.nextAction ?? null,
		soulBindingState: options.soulBindingState ?? 'UNBOUND',
		body: {
			__typename: 'SoulBootstrapIdentityTarget',
			bodyId: project44SoulBootstrapIds.bodyId,
			username: project44SoulBootstrapIds.username,
			displayName: 'Agent Zero',
			owner: null,
		},
		state,
		error,
		workflow: {
			__typename: 'AgentWorkflowSurface',
			username: project44SoulBootstrapIds.username,
			currentPhase: phase.toLowerCase(),
			currentState: state.state,
			identity: {
				__typename: 'AgentIdentityCard',
				id: 'identity-agent-zero',
				name: 'Agent Zero',
				handle: '@agent-zero',
				summary: 'Project 44 bootstrap identity',
				currentPhase: phase.toLowerCase(),
				currentState: state.state,
				steward: null,
				tags: ['project-44'],
				metrics: [],
			},
			request: null,
			review: null,
			declaration: null,
			checkpoint: null,
			graduation: null,
			continuity: null,
			lifecycle: [],
			conversation: null,
			soulBootstrap: state,
			identitySemantics: {
				__typename: 'AgentIdentitySemantics',
				identityState: error ? 'BLOCKED' : phase === 'COMPLETE' ? 'BOUND' : 'BOOTSTRAPPING',
				identityLabel: 'Agent Zero',
				lifecycleState: phase === 'COMPLETE' ? 'READY' : 'PENDING',
				soulBindingState: options.soulBindingState ?? 'UNBOUND',
				soulAgentId: options.hostSoulAgentId ?? null,
				continuityState: phase === 'COMPLETE' ? 'READY' : 'PENDING',
				continuitySummary: error
					? 'Bootstrap blocked until operator action is complete.'
					: 'Bootstrap state is relayed from Lesser.',
				bodyIdentityPreserved: true,
				timelinePresencePreserved: true,
				memoryReferencesPreserved: true,
				attributionLabel: 'Project 44',
				moderationLabel: error ? 'attention_required' : 'pending',
			},
		},
	};
}

export const project44SoulBootstrapFixtures = {
	missingTrust: createProject44SoulBootstrapSurface({
		phase: 'ERROR',
		state: 'blocked_missing_trust',
		executable: false,
		hostBridgeAvailable: false,
		nextAction: 'request_trust',
		error: createProject44SoulBootstrapErrorState({
			code: 'MISSING_TRUST',
			message: 'Trusted Lesser identity is required before bootstrap can register with Host.',
			source: 'lesser',
			statusCode: 403,
		}),
	}),
	missingInstanceKey: createProject44SoulBootstrapSurface({
		phase: 'ERROR',
		state: 'blocked_missing_instance_key',
		executable: false,
		hostBridgeAvailable: false,
		nextAction: 'configure_instance_key',
		error: createProject44SoulBootstrapErrorState({
			code: 'MISSING_INSTANCE_KEY',
			message: 'Lesser is missing the server-side Host instance key for this instance.',
			source: 'lesser-host',
			statusCode: 503,
		}),
	}),
	notStarted: createProject44SoulBootstrapSurface({
		phase: 'NOT_STARTED',
		state: 'ready_to_begin',
		nextAction: 'begin',
		hostRegistrationId: null,
		walletAddress: null,
	}),
	walletChallenge: createProject44SoulBootstrapSurface({
		phase: 'WALLET_VERIFICATION',
		state: 'awaiting_wallet_signature',
		nextAction: 'verify_wallet',
		signingCheckpoints: [
			createProject44SigningCheckpoint(project44SoulBootstrapSigning.walletChallenge),
		],
	}),
	walletVerified: createProject44SoulBootstrapSurface({
		phase: 'PRINCIPAL_DECLARATION',
		state: 'wallet_verified',
		nextAction: 'prepare_principal_declaration',
		signingCheckpoints: [
			createProject44SigningCheckpoint({
				...project44SoulBootstrapSigning.walletChallenge,
				status: 'complete',
				completedAt: project44SoulBootstrapIds.completedAt,
			}),
		],
	}),
	principalDeclarationPreflight: createProject44SoulBootstrapSurface({
		phase: 'PRINCIPAL_DECLARATION',
		state: 'awaiting_principal_signature',
		nextAction: 'verify_principal_declaration',
		principalAddress: project44SoulBootstrapIds.principalAddress,
		signingCheckpoints: [
			createProject44SigningCheckpoint(project44SoulBootstrapSigning.principalDeclaration),
		],
	}),
	principalDeclarationVerified: createProject44SoulBootstrapSurface({
		phase: 'CONVERSATION',
		state: 'principal_verified',
		nextAction: 'send_conversation_message',
		principalAddress: project44SoulBootstrapIds.principalAddress,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		signingCheckpoints: [
			createProject44SigningCheckpoint({
				...project44SoulBootstrapSigning.principalDeclaration,
				status: 'complete',
				completedAt: project44SoulBootstrapIds.completedAt,
			}),
		],
	}),
	conversationMessage: createProject44SoulBootstrapSurface({
		phase: 'CONVERSATION',
		state: 'conversation_in_progress',
		nextAction: 'complete_conversation',
		principalAddress: project44SoulBootstrapIds.principalAddress,
		hostConversationId: project44SoulBootstrapIds.conversationId,
	}),
	conversationComplete: createProject44SoulBootstrapSurface({
		phase: 'FINALIZE',
		state: 'conversation_complete',
		nextAction: 'prepare_finalize',
		principalAddress: project44SoulBootstrapIds.principalAddress,
		hostConversationId: project44SoulBootstrapIds.conversationId,
	}),
	finalizePreflight: createProject44SoulBootstrapSurface({
		phase: 'FINALIZE',
		state: 'awaiting_finalize_signature',
		nextAction: 'finalize',
		principalAddress: project44SoulBootstrapIds.principalAddress,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		signingCheckpoints: [createProject44SigningCheckpoint(project44SoulBootstrapSigning.finalize)],
	}),
	finalizedHosted: createProject44SoulBootstrapSurface({
		phase: 'COMPLETE',
		state: 'hosted_off_chain_binding_ready',
		executable: false,
		existingSoulAgentId: project44SoulBootstrapIds.soulAgentId,
		nextAction: 'binding_ready',
		principalAddress: project44SoulBootstrapIds.principalAddress,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
		soulBindingState: 'BOUND',
		publication: createProject44PublicationEvidence(),
	}),
} as const;

export const project44SoulBootstrapOperationFixtures = {
	SoulBootstrap: project44SoulBootstrapFixtures.notStarted,
	BeginSoulBootstrap: project44SoulBootstrapFixtures.walletChallenge,
	VerifySoulBootstrapWallet: project44SoulBootstrapFixtures.walletVerified,
	PrepareSoulBootstrapPrincipalDeclaration:
		project44SoulBootstrapFixtures.principalDeclarationPreflight,
	VerifySoulBootstrapPrincipalDeclaration:
		project44SoulBootstrapFixtures.principalDeclarationVerified,
	SendSoulBootstrapConversationMessage: project44SoulBootstrapFixtures.conversationMessage,
	CompleteSoulBootstrapConversation: project44SoulBootstrapFixtures.conversationComplete,
	PrepareSoulBootstrapFinalize: project44SoulBootstrapFixtures.finalizePreflight,
	FinalizeSoulBootstrap: project44SoulBootstrapFixtures.finalizedHosted,
} as const;
