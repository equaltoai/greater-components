import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	SoulBootstrapClientError,
	createSoulBootstrapClient,
	normalizeSoulBootstrapError,
	type SoulBootstrapErrorCategory,
	type SoulBootstrapErrorState,
	type SoulBootstrapSurface,
} from '../soul/bootstrap';

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	});
}

function makeError(code: string, message = code, statusCode = 400): SoulBootstrapErrorState {
	return {
		__typename: 'SoulBootstrapErrorState',
		code,
		message,
		source: 'lesser-host',
		statusCode,
		hostRequestId: 'host-request-1',
		at: '2026-06-12T12:00:00Z',
	};
}

function makeSurface(overrides: Partial<SoulBootstrapSurface> = {}): SoulBootstrapSurface {
	const state = {
		__typename: 'SoulBootstrapState',
		bodyId: 'body-1',
		username: 'agent-zero',
		state: 'wallet_verification',
		phase: 'WALLET_VERIFICATION',
		walletAddress: '0x1111111111111111111111111111111111111111',
		principalAddress: null,
		hostRegistrationId: 'registration-1',
		hostConversationId: null,
		hostSoulAgentId: null,
		updatedAt: '2026-06-12T12:00:00Z',
		signingCheckpoints: [
			{
				__typename: 'SoulBootstrapSigningCheckpoint',
				name: 'wallet',
				status: 'pending_signature',
				message: 'Sign this Lesser-provided wallet challenge',
				messageEncoding: 'utf8',
				messageHex: '0x5369676e',
				canonicalJson: '{"from":"lesser"}',
				digestHex: '0xabc123',
				boundaryRequirementsJson: null,
				registrationPreviewJson: null,
				finalizeRequestTemplateJson: null,
				signingMethod: 'eip191',
				signerAddress: '0x1111111111111111111111111111111111111111',
				principalAddress: null,
				version: 'v1',
				expectedVersion: 1,
				nextVersion: 2,
				issuedAt: '2026-06-12T12:00:00Z',
				declaredAt: null,
				completedAt: null,
				hostRequestId: 'host-request-1',
			},
		],
		publication: null,
		error: null,
		correlation: {
			__typename: 'SoulBootstrapCorrelationState',
			correlationKey: 'corr-1',
			beginIdempotencyKey: 'begin-1',
			walletVerificationIdempotencyKey: null,
			principalDeclarationIdempotencyKey: null,
			conversationIdempotencyKey: null,
			finalizeIdempotencyKey: null,
			lastHostRequestId: 'host-request-1',
		},
	};

	return {
		__typename: 'SoulBootstrapSurface',
		username: 'agent-zero',
		executable: true,
		existingSoulAgentId: null,
		hostBridgeAvailable: true,
		nextAction: 'verify_wallet',
		soulBindingState: 'UNBOUND',
		body: {
			__typename: 'SoulBootstrapIdentityTarget',
			bodyId: 'body-1',
			username: 'agent-zero',
			displayName: 'Agent Zero',
			owner: null,
		},
		state,
		error: null,
		workflow: {
			__typename: 'AgentWorkflowSurface',
			username: 'agent-zero',
			currentPhase: 'wallet_verification',
			currentState: 'waiting_signature',
			identity: {
				__typename: 'AgentIdentityCard',
				id: 'identity-1',
				name: 'Agent Zero',
				handle: '@agent-zero',
				summary: 'Project 44 bootstrap identity',
				currentPhase: 'wallet_verification',
				currentState: 'waiting_signature',
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
				identityState: 'BOOTSTRAPPING',
				identityLabel: 'Agent Zero',
				lifecycleState: 'PENDING',
				soulBindingState: 'UNBOUND',
				soulAgentId: null,
				continuityState: 'PENDING',
				continuitySummary: 'Bootstrap in progress',
				bodyIdentityPreserved: true,
				timelinePresencePreserved: true,
				memoryReferencesPreserved: true,
				attributionLabel: 'Project 44',
				moderationLabel: 'pending',
			},
		},
		...overrides,
	} as SoulBootstrapSurface;
}

const rootFieldByOperation: Record<string, string> = {
	SoulBootstrap: 'soulBootstrap',
	BeginSoulBootstrap: 'beginSoulBootstrap',
	VerifySoulBootstrapWallet: 'verifySoulBootstrapWallet',
	PrepareSoulBootstrapPrincipalDeclaration: 'prepareSoulBootstrapPrincipalDeclaration',
	VerifySoulBootstrapPrincipalDeclaration: 'verifySoulBootstrapPrincipalDeclaration',
	SendSoulBootstrapConversationMessage: 'sendSoulBootstrapConversationMessage',
	CompleteSoulBootstrapConversation: 'completeSoulBootstrapConversation',
	PrepareSoulBootstrapFinalize: 'prepareSoulBootstrapFinalize',
	FinalizeSoulBootstrap: 'finalizeSoulBootstrap',
};

describe('SoulBootstrapClient', () => {
	const fetchMock = vi.fn();
	const surface = makeSurface();

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(async (_input: RequestInfo | URL, init?: RequestInit) => {
			const body = JSON.parse(String(init?.body ?? '{}')) as { operationName?: string };
			const operationName = body.operationName ?? 'SoulBootstrap';
			const rootField = rootFieldByOperation[operationName];
			const value =
				operationName === 'SoulBootstrap'
					? surface
					: {
							__typename: 'SoulBootstrapMutationPayload',
							executable: true,
							error: null,
							bootstrap: surface,
						};

			return jsonResponse({ data: { [rootField]: value } });
		});
	});

	it('uses Lesser GraphQL HTTP configuration without Host control-plane credentials', async () => {
		const client = createSoulBootstrapClient({
			httpEndpoint: 'https://lesser.example/graphql',
			token: 'lesser-token',
			headers: {
				'x-sim-route': 'identity',
			},
			fetch: fetchMock,
		});

		const result = await client.getSurface({ username: 'agent-zero' });

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		const body = JSON.parse(String(init.body)) as {
			operationName: string;
			query: string;
			variables: { username: string };
		};

		expect(url).toBe('https://lesser.example/graphql');
		expect(init.method).toBe('POST');
		expect(headers.get('authorization')).toBe('Bearer lesser-token');
		expect(headers.get('x-sim-route')).toBe('identity');
		expect(body.operationName).toBe('SoulBootstrap');
		expect(body.query).toContain('query SoulBootstrap');
		expect(body.variables).toEqual({ username: 'agent-zero' });
		expect(result.surface?.username).toBe('agent-zero');
		expect(result.state?.phase).toBe('WALLET_VERIFICATION');
		expect(result.hostBridgeAvailable).toBe(true);
	});

	it('rejects browser Host write-client configuration keys at the facade boundary', () => {
		expect(() =>
			createSoulBootstrapClient({
				httpEndpoint: 'https://lesser.example/graphql',
				hostBaseUrl: 'https://lesser-host.example',
				fetch: fetchMock,
			} as never)
		).toThrow(/does not accept hostBaseUrl/);
	});

	it('covers each Project 44 bootstrap operation through Lesser GraphQL', async () => {
		const client = createSoulBootstrapClient({
			httpEndpoint: 'https://lesser.example/graphql',
			fetch: fetchMock,
		});

		await client.begin({
			username: 'agent-zero',
			walletAddress: '0x1111111111111111111111111111111111111111',
			capabilities: ['post'],
			idempotencyKey: 'begin-1',
			correlationKey: 'corr-1',
		});
		await client.verifyWallet({
			username: 'agent-zero',
			registrationId: 'registration-1',
			signature: '0xsig',
		});
		await client.preparePrincipalDeclaration({
			username: 'agent-zero',
			registrationId: 'registration-1',
			principalAddress: '0x2222222222222222222222222222222222222222',
			principalDeclaration: 'I am principal',
			declaredAt: '2026-06-12T12:05:00Z',
		});
		await client.verifyPrincipalDeclaration({
			username: 'agent-zero',
			registrationId: 'registration-1',
			signature: '0xwalletsig',
			principalAddress: '0x2222222222222222222222222222222222222222',
			principalDeclaration: 'I am principal',
			principalSignature: '0xprincipalsig',
			declaredAt: '2026-06-12T12:05:00Z',
		});
		await client.sendConversationMessage({
			username: 'agent-zero',
			registrationId: 'registration-1',
			conversationId: 'conversation-1',
			message: 'hello',
		});
		await client.completeConversation({
			username: 'agent-zero',
			registrationId: 'registration-1',
			conversationId: 'conversation-1',
		});
		await client.prepareFinalize({
			username: 'agent-zero',
			registrationId: 'registration-1',
			conversationId: 'conversation-1',
			boundarySignaturesJson: '{"boundary":"0xsig"}',
		});
		const finalizeResult = await client.finalize({
			username: 'agent-zero',
			registrationId: 'registration-1',
			conversationId: 'conversation-1',
			boundarySignaturesJson: '{"boundary":"0xsig"}',
			issuedAt: '2026-06-12T12:10:00Z',
			expectedVersion: 1,
			signature: '0xfinalizesig',
		});

		const operationNames = fetchMock.mock.calls.map(([, init]) => {
			const body = JSON.parse(String((init as RequestInit).body)) as { operationName: string };
			return body.operationName;
		});

		expect(operationNames).toEqual([
			'BeginSoulBootstrap',
			'VerifySoulBootstrapWallet',
			'PrepareSoulBootstrapPrincipalDeclaration',
			'VerifySoulBootstrapPrincipalDeclaration',
			'SendSoulBootstrapConversationMessage',
			'CompleteSoulBootstrapConversation',
			'PrepareSoulBootstrapFinalize',
			'FinalizeSoulBootstrap',
		]);
		expect(finalizeResult.payload.executable).toBe(true);
	});

	it('returns Lesser-provided signing material without reconstructing Host digests', async () => {
		const client = createSoulBootstrapClient({
			httpEndpoint: 'https://lesser.example/graphql',
			fetch: fetchMock,
		});

		const result = await client.prepareFinalize({
			username: 'agent-zero',
			registrationId: 'registration-1',
			conversationId: 'conversation-1',
			boundarySignaturesJson: '{"boundary":"0xsig"}',
		});

		expect(result.state?.signingCheckpoints[0]?.canonicalJson).toBe('{"from":"lesser"}');
		expect(result.state?.signingCheckpoints[0]?.digestHex).toBe('0xabc123');
	});

	it('normalizes backend errors into Sim-actionable categories while preserving backend codes', () => {
		const cases: Array<[string, string, SoulBootstrapErrorCategory]> = [
			['MISSING_TRUST', 'Missing trust relationship', 'missing_trust'],
			['MISSING_INSTANCE_KEY', 'Missing instance key', 'missing_instance_key'],
			['HOST_UNAVAILABLE', 'Lesser Host unavailable', 'host_unavailable'],
			['SIGNATURE_REJECTED', 'signature rejected by Host', 'signature_rejection'],
			['INCOMPLETE_CONVERSATION', 'conversation not complete', 'incomplete_conversation'],
			['FINALIZE_EXPIRED', 'finalize window expired', 'finalize_expiry'],
			['BINDING_CONFLICT', 'soul binding conflict', 'binding_conflict'],
		];

		for (const [code, message, category] of cases) {
			const normalized = normalizeSoulBootstrapError(makeError(code, message));
			expect(normalized).toMatchObject({ category, code, message });
			expect(normalized?.backendError?.hostRequestId).toBe('host-request-1');
		}
	});

	it('throws typed client errors for GraphQL transport failures', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					errors: [
						{
							message: 'auth required',
							extensions: { code: 'UNAUTHENTICATED' },
						},
					],
				},
				401
			)
		);
		const client = createSoulBootstrapClient({
			httpEndpoint: 'https://lesser.example/graphql',
			fetch: fetchMock,
		});

		await expect(client.current('agent-zero')).rejects.toMatchObject<SoulBootstrapClientError>({
			name: 'SoulBootstrapClientError',
			category: 'unauthorized',
			code: 'UNAUTHENTICATED',
		});
	});
});
