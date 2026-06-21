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
	restartIdempotencyKey: 'idem-restart-project-44',
	recoveryAttemptId: 'recovery-project-44',
	hostRequestId: 'host-request-project-44',
	issuedAt: '2026-06-12T12:10:00Z',
	declaredAt: '2026-06-12T12:05:00Z',
	completedAt: '2026-06-12T12:15:00Z',
	restartedAt: '2026-06-12T12:20:00Z',
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
	hostedConversation: {
		name: 'hosted_conversation',
		status: 'completed',
		message: null,
		messageEncoding: null,
		messageHex: null,
		canonicalJson:
			'{"selfDescription":{"summary":"ready for hosted publish"},"capabilities":[{"name":"post"}],"boundaries":[],"transparency":{}}',
		digestHex: null,
		boundaryRequirementsJson: null,
		registrationPreviewJson:
			'{"registrationId":"registration-project-44","conversationId":"conversation-project-44","agentId":"host-soul-agent-project-44"}',
		finalizeRequestTemplateJson: null,
		signingMethod: null,
		signerAddress: null,
		principalAddress: null,
		version: '1',
		expectedVersion: null,
		nextVersion: null,
		issuedAt: null,
		declaredAt: null,
		completedAt: project44SoulBootstrapIds.completedAt,
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
		detailsJson: null,
		hostRequestId: project44SoulBootstrapIds.hostRequestId,
		recoveryCategory: 'OPERATOR_ACTION_REQUIRED',
		recoveryAction: 'CONTACT_OPERATOR',
		retryable: false,
		restartRequired: false,
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
		authorityModel: 'INSTANCE_TRUST',
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

function createProject44PublishGate(
	overrides: Partial<SoulBootstrapState['publishGate']> = {}
): SoulBootstrapState['publishGate'] {
	return {
		__typename: 'SoulBootstrapPublishGate',
		canPublishHostedSoul: false,
		reason: 'blocked:terminal_declaration_evidence_absent',
		requiresActiveConversationTerminalDeclarationEvidence: true,
		...overrides,
	};
}

function createProject44TerminalDeclarationEvidence(
	overrides: Partial<NonNullable<SoulBootstrapState['terminalDeclarationEvidence']>> = {}
): NonNullable<SoulBootstrapState['terminalDeclarationEvidence']> {
	return {
		__typename: 'SoulBootstrapTerminalDeclarationEvidence',
		conversationId: project44SoulBootstrapIds.conversationId,
		hostStatus: 'declaration_ready',
		hostRequestId: project44SoulBootstrapIds.hostRequestId,
		declarationsHash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		producedDeclarationsPreview: {
			__typename: 'SoulBootstrapDeclarationPreview',
			title: 'Hosted genesis declaration',
			declarationCount: 1,
		},
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
	hostConversationStatus?: SoulBootstrapState['hostConversationStatus'];
	walletAddress?: string | null;
	principalAddress?: string | null;
	bootstrapMode?: SoulBootstrapState['bootstrapMode'];
	authorityModel?: SoulBootstrapState['authorityModel'];
	anchorState?: SoulBootstrapState['anchorState'];
	assuranceState?: SoulBootstrapState['assuranceState'];
	typedNextAction?: SoulBootstrapState['typedNextAction'];
	recoveryCategory?: SoulBootstrapState['recoveryCategory'];
	recoveryAction?: SoulBootstrapState['recoveryAction'];
	retryable?: boolean;
	restartRequired?: boolean;
	restartAvailable?: boolean;
	recoveryAttemptId?: string | null;
	restartIdempotencyKey?: string | null;
	supersededHostRegistrationId?: string | null;
	supersededHostConversationId?: string | null;
	lastHostRequestId?: string | null;
	restartedAt?: string | null;
	terminalDeclarationEvidence?: SoulBootstrapState['terminalDeclarationEvidence'];
	publicationEvidence?: SoulBootstrapState['publicationEvidence'];
	publishGate?: SoulBootstrapState['publishGate'];
}

export function createProject44SoulBootstrapSurface(
	options: Project44SoulBootstrapSurfaceOptions = {}
): SoulBootstrapSurface {
	const error = options.error ?? null;
	const phase = options.phase ?? (error ? 'ERROR' : 'NOT_STARTED');
	const bootstrapMode =
		options.bootstrapMode ?? (options.signingCheckpoints?.length ? 'WALLET_PRINCIPAL' : 'HOSTED');
	const authorityModel =
		options.authorityModel ??
		(bootstrapMode === 'WALLET_PRINCIPAL' ? 'WALLET_PRINCIPAL' : 'INSTANCE_TRUST');
	const typedNextAction =
		options.typedNextAction ?? inferTypedNextAction(options.nextAction, phase);
	const recoveryCategory = options.recoveryCategory ?? error?.recoveryCategory ?? null;
	const recoveryAction = options.recoveryAction ?? error?.recoveryAction ?? null;
	const retryable = options.retryable ?? error?.retryable ?? false;
	const restartRequired = options.restartRequired ?? error?.restartRequired ?? false;
	const restartAvailable = options.restartAvailable ?? typedNextAction === 'RESTART_SOUL_BOOTSTRAP';
	const state: SoulBootstrapState = {
		__typename: 'SoulBootstrapState',
		bodyId: project44SoulBootstrapIds.bodyId,
		username: project44SoulBootstrapIds.username,
		state: options.state ?? (error ? 'blocked' : 'ready'),
		phase,
		walletAddress:
			options.walletAddress ??
			(bootstrapMode === 'WALLET_PRINCIPAL' ? project44SoulBootstrapIds.walletAddress : null),
		principalAddress: options.principalAddress ?? null,
		hostRegistrationId:
			'hostRegistrationId' in options
				? (options.hostRegistrationId ?? null)
				: project44SoulBootstrapIds.registrationId,
		hostConversationId: options.hostConversationId ?? null,
		hostSoulAgentId: options.hostSoulAgentId ?? null,
		bootstrapMode,
		authorityModel,
		anchorState: options.anchorState ?? 'HOSTED_OFFCHAIN',
		assuranceState: options.assuranceState ?? 'HOSTED_OFFCHAIN',
		hostConversationStatus: options.hostConversationStatus ?? null,
		updatedAt: '2026-06-12T12:00:00Z',
		typedNextAction,
		recoveryCategory,
		recoveryAction,
		retryable,
		restartRequired,
		restartAvailable,
		signingCheckpoints: options.signingCheckpoints ?? [],
		terminalDeclarationEvidence: options.terminalDeclarationEvidence ?? null,
		publication: options.publication ?? null,
		publicationEvidence: options.publicationEvidence ?? options.publication ?? null,
		publishGate: options.publishGate ?? createProject44PublishGate(),
		error,
		recoveryAttemptId: options.recoveryAttemptId ?? null,
		restartIdempotencyKey: options.restartIdempotencyKey ?? null,
		lastHostRequestId: options.lastHostRequestId ?? project44SoulBootstrapIds.hostRequestId,
		restartedAt: options.restartedAt ?? null,
		correlation: {
			__typename: 'SoulBootstrapCorrelationState',
			correlationKey: project44SoulBootstrapIds.correlationKey,
			beginIdempotencyKey: project44SoulBootstrapIds.beginIdempotencyKey,
			walletVerificationIdempotencyKey: project44SoulBootstrapIds.walletIdempotencyKey,
			principalDeclarationIdempotencyKey: project44SoulBootstrapIds.principalIdempotencyKey,
			conversationIdempotencyKey: project44SoulBootstrapIds.conversationIdempotencyKey,
			finalizeIdempotencyKey: project44SoulBootstrapIds.finalizeIdempotencyKey,
			restartIdempotencyKey:
				options.restartIdempotencyKey ?? project44SoulBootstrapIds.restartIdempotencyKey,
			recoveryAttemptId: options.recoveryAttemptId ?? null,
			supersededHostRegistrationId: options.supersededHostRegistrationId ?? null,
			supersededHostConversationId: options.supersededHostConversationId ?? null,
			lastHostRequestId: options.lastHostRequestId ?? project44SoulBootstrapIds.hostRequestId,
		},
	};

	return {
		__typename: 'SoulBootstrapSurface',
		username: project44SoulBootstrapIds.username,
		executable: options.executable ?? !error,
		existingSoulAgentId: options.existingSoulAgentId ?? null,
		hostBridgeAvailable: options.hostBridgeAvailable ?? !error,
		nextAction: options.nextAction ?? null,
		typedNextAction,
		recoveryCategory,
		recoveryAction,
		retryable,
		restartAvailable,
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

function inferTypedNextAction(
	nextAction: string | null | undefined,
	phase: SoulBootstrapPhase
): SoulBootstrapState['typedNextAction'] {
	switch (nextAction) {
		case 'begin':
		case 'start_hosted_bootstrap':
			return 'START_HOSTED_BOOTSTRAP';
		case 'send_hosted_soul_genesis_message':
			return 'SEND_HOSTED_SOUL_GENESIS_MESSAGE';
		case 'complete_hosted_soul_genesis':
			return 'COMPLETE_HOSTED_SOUL_GENESIS';
		case 'publish_hosted_soul':
			return 'PUBLISH_HOSTED_SOUL';
		case 'restart_soul_bootstrap':
			return 'RESTART_SOUL_BOOTSTRAP';
		case 'retry':
		case 'retry_same_step':
			return 'RETRY_SAME_STEP';
		case 'refresh':
		case 'refresh_state':
			return 'REFRESH_STATE';
		case 'request_trust':
		case 'configure_instance_key':
		case 'operator_action_required':
			return 'OPERATOR_ACTION_REQUIRED';
		case 'verify_wallet':
			return 'VERIFY_WALLET';
		case 'prepare_principal_declaration':
			return 'PREPARE_PRINCIPAL_DECLARATION';
		case 'verify_principal_declaration':
			return 'VERIFY_PRINCIPAL_DECLARATION';
		case 'send_conversation_message':
		case 'complete_conversation':
			return 'CONTINUE_CONVERSATION';
		case 'prepare_finalize':
		case 'finalize':
			return 'FINALIZE';
		case 'binding_ready':
		case 'complete':
			return 'COMPLETE';
		default:
			if (phase === 'COMPLETE') return 'COMPLETE';
			if (phase === 'ERROR') return 'OPERATOR_ACTION_REQUIRED';
			if (phase === 'WALLET_VERIFICATION') return 'VERIFY_WALLET';
			if (phase === 'PRINCIPAL_DECLARATION') return 'PREPARE_PRINCIPAL_DECLARATION';
			if (phase === 'CONVERSATION') return 'CONTINUE_CONVERSATION';
			if (phase === 'FINALIZE') return 'FINALIZE';
			return 'START_HOSTED_BOOTSTRAP';
	}
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
	hostedNotStarted: createProject44SoulBootstrapSurface({
		phase: 'NOT_STARTED',
		state: 'hosted_ready_to_start',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
		typedNextAction: 'START_HOSTED_BOOTSTRAP',
		nextAction: 'start_hosted_bootstrap',
		hostRegistrationId: null,
		walletAddress: null,
		principalAddress: null,
	}),
	hostedStarted: createProject44SoulBootstrapSurface({
		phase: 'CONVERSATION',
		state: 'hosted_genesis_started',
		hostConversationStatus: 'in_progress',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
		typedNextAction: 'SEND_HOSTED_SOUL_GENESIS_MESSAGE',
		nextAction: 'send_hosted_soul_genesis_message',
		hostRegistrationId: project44SoulBootstrapIds.registrationId,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		walletAddress: null,
		principalAddress: null,
	}),
	hostedGenesisMessage: createProject44SoulBootstrapSurface({
		phase: 'CONVERSATION',
		state: 'hosted_genesis_message_recorded',
		hostConversationStatus: 'assistant_turn_ready',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
		typedNextAction: 'COMPLETE_HOSTED_SOUL_GENESIS',
		nextAction: 'complete_hosted_soul_genesis',
		hostRegistrationId: project44SoulBootstrapIds.registrationId,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		walletAddress: null,
		principalAddress: null,
	}),
	hostedGenesisComplete: createProject44SoulBootstrapSurface({
		phase: 'CONVERSATION',
		state: 'hosted_genesis_complete',
		hostConversationStatus: 'declaration_ready',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
		typedNextAction: 'PUBLISH_HOSTED_SOUL',
		nextAction: 'publish_hosted_soul',
		hostRegistrationId: project44SoulBootstrapIds.registrationId,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		walletAddress: null,
		principalAddress: null,
		signingCheckpoints: [
			createProject44SigningCheckpoint(project44SoulBootstrapSigning.hostedConversation),
		],
		terminalDeclarationEvidence: createProject44TerminalDeclarationEvidence(),
		publishGate: createProject44PublishGate({
			canPublishHostedSoul: true,
			reason: 'allowed:active_conversation_terminal_declaration_evidence',
		}),
	}),
	hostedPublished: createProject44SoulBootstrapSurface({
		phase: 'COMPLETE',
		state: 'hosted_offchain_published',
		hostConversationStatus: 'declaration_ready',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
		typedNextAction: 'COMPLETE',
		nextAction: 'complete',
		executable: false,
		existingSoulAgentId: project44SoulBootstrapIds.soulAgentId,
		hostRegistrationId: project44SoulBootstrapIds.registrationId,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
		soulBindingState: 'BOUND',
		publication: createProject44PublicationEvidence(),
		publicationEvidence: createProject44PublicationEvidence(),
		terminalDeclarationEvidence: createProject44TerminalDeclarationEvidence(),
		publishGate: createProject44PublishGate({
			reason: 'complete:already_published_bound',
		}),
		walletAddress: null,
		principalAddress: null,
	}),
	hostedRestartRequired: createProject44SoulBootstrapSurface({
		phase: 'ERROR',
		state: 'hosted_restart_required',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		typedNextAction: 'RESTART_SOUL_BOOTSTRAP',
		nextAction: 'restart_soul_bootstrap',
		executable: true,
		recoveryCategory: 'RESTART_REQUIRED',
		recoveryAction: 'RESTART_BOOTSTRAP',
		restartRequired: true,
		restartAvailable: true,
		recoveryAttemptId: project44SoulBootstrapIds.recoveryAttemptId,
		walletAddress: null,
		principalAddress: null,
		error: createProject44SoulBootstrapErrorState({
			code: 'HOSTED_RESTART_REQUIRED',
			message: 'Hosted bootstrap registration must be restarted before publishing.',
			source: 'lesser',
			statusCode: 409,
			recoveryCategory: 'RESTART_REQUIRED',
			recoveryAction: 'RESTART_BOOTSTRAP',
			retryable: false,
			restartRequired: true,
		}),
	}),
	hostedOperatorActionRequired: createProject44SoulBootstrapSurface({
		phase: 'ERROR',
		state: 'hosted_operator_action_required',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		typedNextAction: 'OPERATOR_ACTION_REQUIRED',
		nextAction: 'operator_action_required',
		executable: false,
		hostBridgeAvailable: false,
		recoveryCategory: 'OPERATOR_ACTION_REQUIRED',
		recoveryAction: 'CONTACT_OPERATOR',
		walletAddress: null,
		principalAddress: null,
		error: createProject44SoulBootstrapErrorState({
			code: 'HOSTED_OPERATOR_ACTION_REQUIRED',
			message: 'The Lesser operator must restore the server-side Host bridge.',
			source: 'lesser-host',
			statusCode: 503,
			recoveryCategory: 'OPERATOR_ACTION_REQUIRED',
			recoveryAction: 'CONTACT_OPERATOR',
			retryable: false,
			restartRequired: false,
		}),
	}),
	hostedAlreadyBound: createProject44SoulBootstrapSurface({
		phase: 'COMPLETE',
		state: 'hosted_already_bound',
		hostConversationStatus: 'declaration_ready',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
		typedNextAction: 'COMPLETE',
		nextAction: 'complete',
		executable: false,
		existingSoulAgentId: project44SoulBootstrapIds.soulAgentId,
		hostRegistrationId: project44SoulBootstrapIds.registrationId,
		hostConversationId: project44SoulBootstrapIds.conversationId,
		hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
		soulBindingState: 'BOUND',
		publication: createProject44PublicationEvidence({
			publishedVersion: 5,
			versionedRegistrationS3Key: 'soul-bootstrap/project-44/registration-v5.json',
			versionedRegistrationUri: 's3://lesser-host-soul-bootstrap/project-44/registration-v5.json',
		}),
		publicationEvidence: createProject44PublicationEvidence({
			publishedVersion: 5,
			versionedRegistrationS3Key: 'soul-bootstrap/project-44/registration-v5.json',
			versionedRegistrationUri: 's3://lesser-host-soul-bootstrap/project-44/registration-v5.json',
		}),
		terminalDeclarationEvidence: createProject44TerminalDeclarationEvidence(),
		publishGate: createProject44PublishGate({
			reason: 'complete:already_published_bound',
		}),
		walletAddress: null,
		principalAddress: null,
	}),
	hostedRestarted: createProject44SoulBootstrapSurface({
		phase: 'CONVERSATION',
		state: 'hosted_restarted',
		hostConversationStatus: 'in_progress',
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		typedNextAction: 'SEND_HOSTED_SOUL_GENESIS_MESSAGE',
		nextAction: 'send_hosted_soul_genesis_message',
		hostRegistrationId: `${project44SoulBootstrapIds.registrationId}-restart`,
		hostConversationId: `${project44SoulBootstrapIds.conversationId}-restart`,
		recoveryAttemptId: project44SoulBootstrapIds.recoveryAttemptId,
		restartIdempotencyKey: project44SoulBootstrapIds.restartIdempotencyKey,
		supersededHostRegistrationId: project44SoulBootstrapIds.registrationId,
		supersededHostConversationId: project44SoulBootstrapIds.conversationId,
		restartedAt: project44SoulBootstrapIds.restartedAt,
		walletAddress: null,
		principalAddress: null,
	}),
} as const;

export interface Project49HostedGenesisStatusFixture {
	label: string;
	hostStatus: string;
	surface: SoulBootstrapSurface;
	inProgress: boolean;
	declarationReady: boolean;
	canPublish: boolean;
	publishReason: string;
}

export const project49HostedGenesisStatusFixtures = [
	{
		label: 'no registration',
		hostStatus: 'no_registration',
		surface: createProject44SoulBootstrapSurface({
			phase: 'NOT_STARTED',
			state: 'not_started',
			typedNextAction: 'START_HOSTED_BOOTSTRAP',
			nextAction: 'start_hosted_bootstrap',
			hostRegistrationId: null,
			hostSoulAgentId: null,
			hostConversationId: null,
			hostConversationStatus: null,
			walletAddress: null,
			principalAddress: null,
			publishGate: createProject44PublishGate({
				reason: 'blocked:no_host_registration',
			}),
		}),
		inProgress: false,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:no_host_registration',
	},
	{
		label: 'registration active, no conversation',
		hostStatus: 'registration_active_no_conversation',
		surface: createProject44SoulBootstrapSurface({
			phase: 'CONVERSATION',
			state: 'conversation.registration_active',
			typedNextAction: 'SEND_HOSTED_SOUL_GENESIS_MESSAGE',
			nextAction: 'send_hosted_soul_genesis_message',
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: null,
			hostConversationStatus: null,
			walletAddress: null,
			principalAddress: null,
			publishGate: createProject44PublishGate({
				reason: 'blocked:no_host_conversation',
			}),
		}),
		inProgress: false,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:no_host_conversation',
	},
	{
		label: 'created collapsed to in_progress',
		hostStatus: 'created',
		surface: createProject44SoulBootstrapSurface({
			phase: 'CONVERSATION',
			state: 'conversation.in_progress',
			hostConversationStatus: 'created',
			typedNextAction: 'REFRESH_STATE',
			nextAction: 'refresh_state',
			recoveryCategory: 'REFRESH_STATE',
			recoveryAction: 'REFRESH_STATE',
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			walletAddress: null,
			principalAddress: null,
			publishGate: createProject44PublishGate({
				reason: 'blocked:conversation_in_progress',
			}),
		}),
		inProgress: true,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:conversation_in_progress',
	},
	{
		label: 'in_progress',
		hostStatus: 'in_progress',
		surface: createProject44SoulBootstrapSurface({
			phase: 'CONVERSATION',
			state: 'conversation.in_progress',
			hostConversationStatus: 'in_progress',
			typedNextAction: 'REFRESH_STATE',
			nextAction: 'refresh_state',
			recoveryCategory: 'REFRESH_STATE',
			recoveryAction: 'REFRESH_STATE',
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			walletAddress: null,
			principalAddress: null,
			publishGate: createProject44PublishGate({
				reason: 'blocked:conversation_in_progress',
			}),
		}),
		inProgress: true,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:conversation_in_progress',
	},
	{
		label: 'assistant_turn_ready',
		hostStatus: 'assistant_turn_ready',
		surface: createProject44SoulBootstrapSurface({
			phase: 'CONVERSATION',
			state: 'conversation.assistant_turn_ready',
			hostConversationStatus: 'assistant_turn_ready',
			typedNextAction: 'COMPLETE_HOSTED_SOUL_GENESIS',
			nextAction: 'complete_hosted_soul_genesis',
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			walletAddress: null,
			principalAddress: null,
			publishGate: createProject44PublishGate({
				reason: 'blocked:terminal_declaration_evidence_absent',
			}),
		}),
		inProgress: true,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:terminal_declaration_evidence_absent',
	},
	{
		label: 'declaration_extraction_pending',
		hostStatus: 'declaration_extraction_pending',
		surface: createProject44SoulBootstrapSurface({
			phase: 'CONVERSATION',
			state: 'conversation.declaration_extraction_pending',
			hostConversationStatus: 'declaration_extraction_pending',
			typedNextAction: 'REFRESH_STATE',
			nextAction: 'refresh_state',
			recoveryCategory: 'REFRESH_STATE',
			recoveryAction: 'REFRESH_STATE',
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			walletAddress: null,
			principalAddress: null,
			publishGate: createProject44PublishGate({
				reason: 'blocked:declaration_extraction_pending',
			}),
		}),
		inProgress: true,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:declaration_extraction_pending',
	},
	{
		label: 'declaration_ready',
		hostStatus: 'declaration_ready',
		surface: createProject44SoulBootstrapSurface({
			phase: 'FINALIZE',
			state: 'conversation.declaration_ready',
			bootstrapMode: 'HOSTED',
			authorityModel: 'INSTANCE_TRUST',
			hostConversationStatus: 'declaration_ready',
			typedNextAction: 'PUBLISH_HOSTED_SOUL',
			nextAction: 'publish_hosted_soul',
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			walletAddress: null,
			principalAddress: null,
			signingCheckpoints: [
				createProject44SigningCheckpoint(project44SoulBootstrapSigning.hostedConversation),
			],
			terminalDeclarationEvidence: createProject44TerminalDeclarationEvidence(),
			publishGate: createProject44PublishGate({
				canPublishHostedSoul: true,
				reason: 'allowed:active_conversation_terminal_declaration_evidence',
			}),
		}),
		inProgress: false,
		declarationReady: true,
		canPublish: true,
		publishReason: 'allowed:active_conversation_terminal_declaration_evidence',
	},
	{
		label: 'failed retry same step',
		hostStatus: 'failed',
		surface: createProject44SoulBootstrapSurface({
			phase: 'ERROR',
			state: 'error.host_failed',
			hostConversationStatus: 'failed',
			typedNextAction: 'RETRY_SAME_STEP',
			nextAction: 'retry_same_step',
			recoveryCategory: 'RETRY_SAME_STEP',
			recoveryAction: 'RETRY_SAME_STEP',
			retryable: true,
			restartAvailable: true,
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			walletAddress: null,
			principalAddress: null,
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
			publishGate: createProject44PublishGate({
				reason: 'blocked:host_failure',
			}),
		}),
		inProgress: false,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:host_failure',
	},
	{
		label: 'failed restart bootstrap',
		hostStatus: 'failed',
		surface: createProject44SoulBootstrapSurface({
			phase: 'ERROR',
			state: 'error.host_failed',
			hostConversationStatus: 'failed',
			typedNextAction: 'RESTART_SOUL_BOOTSTRAP',
			nextAction: 'restart_soul_bootstrap',
			recoveryCategory: 'RESTART_REQUIRED',
			recoveryAction: 'RESTART_BOOTSTRAP',
			retryable: false,
			restartRequired: true,
			restartAvailable: true,
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			walletAddress: null,
			principalAddress: null,
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
			publishGate: createProject44PublishGate({
				reason: 'blocked:host_failure_restart',
			}),
		}),
		inProgress: false,
		declarationReady: false,
		canPublish: false,
		publishReason: 'blocked:host_failure_restart',
	},
	{
		label: 'published/bound',
		hostStatus: 'published_bound',
		surface: createProject44SoulBootstrapSurface({
			phase: 'COMPLETE',
			state: 'complete.bound',
			bootstrapMode: 'HOSTED',
			authorityModel: 'INSTANCE_TRUST',
			hostConversationStatus: 'declaration_ready',
			typedNextAction: 'COMPLETE',
			nextAction: 'complete',
			executable: false,
			existingSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostRegistrationId: project44SoulBootstrapIds.registrationId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostConversationId: project44SoulBootstrapIds.conversationId,
			soulBindingState: 'BOUND',
			walletAddress: null,
			principalAddress: null,
			signingCheckpoints: [
				createProject44SigningCheckpoint(project44SoulBootstrapSigning.hostedConversation),
			],
			terminalDeclarationEvidence: createProject44TerminalDeclarationEvidence(),
			publication: createProject44PublicationEvidence(),
			publicationEvidence: createProject44PublicationEvidence(),
			publishGate: createProject44PublishGate({
				reason: 'complete:already_published_bound',
			}),
		}),
		inProgress: false,
		declarationReady: true,
		canPublish: false,
		publishReason: 'complete:already_published_bound',
	},
] as const satisfies readonly Project49HostedGenesisStatusFixture[];

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

export const project44HostedSoulBootstrapOperationFixtures = {
	SoulBootstrap: project44SoulBootstrapFixtures.hostedNotStarted,
	StartHostedSoulBootstrap: project44SoulBootstrapFixtures.hostedStarted,
	SendHostedSoulGenesisMessage: project44SoulBootstrapFixtures.hostedGenesisMessage,
	CompleteHostedSoulGenesis: project44SoulBootstrapFixtures.hostedGenesisComplete,
	PublishHostedSoul: project44SoulBootstrapFixtures.hostedPublished,
	RestartSoulBootstrap: project44SoulBootstrapFixtures.hostedRestarted,
} as const;
