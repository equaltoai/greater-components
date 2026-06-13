import { describe, expect, it, vi } from 'vitest';

import {
	SoulBootstrapClientError,
	SoulBootstrapSigningPlanError,
	createSoulBootstrapClient,
	createSoulBootstrapSigningPlan,
	normalizeSoulBootstrapError,
	type SoulBootstrapErrorCategory,
	type SoulBootstrapGraphQLClient,
	type SoulBootstrapGraphQLResult,
	type SoulBootstrapSigningCheckpoint,
	type SoulBootstrapSurface,
} from '../index';
import {
	createProject44SoulBootstrapSurface,
	createProject44SoulBootstrapErrorState,
	project44SoulBootstrapFixtures,
	project44SoulBootstrapIds,
	project44SoulBootstrapOperationFixtures,
	project44SoulBootstrapSigning,
} from '../fixtures/soul-bootstrap';

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

const expectedOperationNames = Object.keys(rootFieldByOperation);
const project44PrincipalDeclaration = 'Agent Zero declares this Project 44 principal.';
const project44Signatures = {
	walletChallenge: '0xwallet-signature-from-sim-wallet',
	principalDeclaration: '0xprincipal-signature',
	finalizeSelfAttestation: '0xfinalize-signature-from-sim-wallet',
} as const;

const disallowedHostCredentialKeys = [
	'hostBaseUrl',
	'hostEndpoint',
	'hostToken',
	'hostHeaders',
	'instanceKey',
	'lesserHostToken',
	'lesserHostClient',
	'hostClient',
] as const;

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	});
}

function mutationPayload(surface: SoulBootstrapSurface) {
	return {
		__typename: 'SoulBootstrapMutationPayload',
		executable: surface.executable,
		error: surface.error,
		bootstrap: surface,
	};
}

function graphQLDataForOperation(operationName: string) {
	const rootField = rootFieldByOperation[operationName];
	const surface =
		project44SoulBootstrapOperationFixtures[
			operationName as keyof typeof project44SoulBootstrapOperationFixtures
		];

	if (!rootField || !surface) {
		throw new Error(`Missing Project 44 fixture for ${operationName}`);
	}

	return {
		[rootField]: operationName === 'SoulBootstrap' ? surface : mutationPayload(surface),
	};
}

function createProject44Fetch() {
	return vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
		const body = JSON.parse(String(init?.body ?? '{}')) as { operationName?: string };
		const operationName = body.operationName ?? 'SoulBootstrap';
		return jsonResponse({ data: graphQLDataForOperation(operationName) });
	});
}

function parseGraphQLCalls(fetchMock: ReturnType<typeof createProject44Fetch>) {
	return fetchMock.mock.calls.map(([url, init]) => {
		const requestInit = init as RequestInit;
		return {
			url,
			headers: new Headers(requestInit.headers),
			body: JSON.parse(String(requestInit.body)) as {
				operationName: string;
				query: string;
				variables: Record<string, unknown>;
			},
		};
	});
}

function createSigningPlanSurface(
	checkpoint: SoulBootstrapSigningCheckpoint,
	options: Parameters<typeof createProject44SoulBootstrapSurface>[0] = {}
): SoulBootstrapSurface {
	return createProject44SoulBootstrapSurface({
		phase:
			checkpoint.name === 'finalize'
				? 'FINALIZE'
				: checkpoint.name === 'principal_declaration'
					? 'PRINCIPAL_DECLARATION'
					: 'WALLET_VERIFICATION',
		state: `${checkpoint.name}.ready`,
		nextAction: `${checkpoint.name}.sign`,
		principalAddress:
			checkpoint.name === 'wallet' ? null : project44SoulBootstrapIds.principalAddress,
		hostConversationId:
			checkpoint.name === 'finalize' ? project44SoulBootstrapIds.conversationId : null,
		signingCheckpoints: [checkpoint],
		...options,
	});
}

function expectSigningPlanError(
	createPlan: () => unknown,
	code: InstanceType<typeof SoulBootstrapSigningPlanError>['code']
) {
	expect(createPlan).toThrow(SoulBootstrapSigningPlanError);
	try {
		createPlan();
	} catch (error) {
		expect(error).toMatchObject({ code });
	}
}

async function runProject44BootstrapFlow(fetchMock = createProject44Fetch()) {
	const client = createSoulBootstrapClient({
		httpEndpoint: '/graphql',
		fetch: fetchMock,
	});

	const currentResult = await client.current(project44SoulBootstrapIds.username);
	const beginResult = await client.begin({
		username: project44SoulBootstrapIds.username,
		walletAddress: project44SoulBootstrapIds.walletAddress,
		capabilities: ['post', 'moderate'],
		idempotencyKey: project44SoulBootstrapIds.beginIdempotencyKey,
		correlationKey: project44SoulBootstrapIds.correlationKey,
	});
	const walletPlan = createSoulBootstrapSigningPlan(beginResult, 'wallet_challenge');
	const walletResult = await client.verifyWallet(
		walletPlan.createSubmitInput(project44Signatures.walletChallenge)
	);
	const principalPreflightResult = await client.preparePrincipalDeclaration({
		username: project44SoulBootstrapIds.username,
		registrationId: project44SoulBootstrapIds.registrationId,
		principalAddress: project44SoulBootstrapIds.principalAddress,
		principalDeclaration: project44PrincipalDeclaration,
		declaredAt: project44SoulBootstrapIds.declaredAt,
		idempotencyKey: project44SoulBootstrapIds.principalIdempotencyKey,
		correlationKey: project44SoulBootstrapIds.correlationKey,
	});
	const principalPlan = createSoulBootstrapSigningPlan(
		principalPreflightResult,
		'principal_declaration'
	);
	const principalVerifiedResult = await client.verifyPrincipalDeclaration(
		principalPlan.createSubmitInput({
			walletChallengeSignature: project44Signatures.walletChallenge,
			principalDeclaration: project44PrincipalDeclaration,
			principalSignature: project44Signatures.principalDeclaration,
		})
	);
	const conversationMessageResult = await client.sendConversationMessage({
		username: project44SoulBootstrapIds.username,
		registrationId: project44SoulBootstrapIds.registrationId,
		conversationId: project44SoulBootstrapIds.conversationId,
		message: 'Ready to mint the Project 44 soul.',
		model: 'sim-project-44',
		idempotencyKey: project44SoulBootstrapIds.conversationIdempotencyKey,
		correlationKey: project44SoulBootstrapIds.correlationKey,
	});
	const conversationCompleteResult = await client.completeConversation({
		username: project44SoulBootstrapIds.username,
		registrationId: project44SoulBootstrapIds.registrationId,
		conversationId: project44SoulBootstrapIds.conversationId,
		idempotencyKey: project44SoulBootstrapIds.conversationIdempotencyKey,
		correlationKey: project44SoulBootstrapIds.correlationKey,
	});
	const finalizePreflightResult = await client.prepareFinalize({
		username: project44SoulBootstrapIds.username,
		registrationId: project44SoulBootstrapIds.registrationId,
		conversationId: project44SoulBootstrapIds.conversationId,
		boundarySignaturesJson: '{"wallet":"0xwallet","principal":"0xprincipal"}',
		idempotencyKey: project44SoulBootstrapIds.finalizeIdempotencyKey,
		correlationKey: project44SoulBootstrapIds.correlationKey,
	});
	const finalizePlan = createSoulBootstrapSigningPlan(
		finalizePreflightResult,
		'finalize_self_attestation'
	);
	const finalizeResult = await client.finalize(
		finalizePlan.createSubmitInput(project44Signatures.finalizeSelfAttestation)
	);

	return {
		fetchMock,
		results: {
			currentResult,
			beginResult,
			walletResult,
			principalPreflightResult,
			principalVerifiedResult,
			conversationMessageResult,
			conversationCompleteResult,
			finalizePreflightResult,
			finalizeResult,
		},
	};
}

describe('Project 44 Soul bootstrap facade fixtures', () => {
	it('covers the Lesser GraphQL bootstrap flow without requiring Host control-plane credentials', async () => {
		const { fetchMock, results } = await runProject44BootstrapFlow();
		const calls = parseGraphQLCalls(fetchMock);

		expect(calls.map((call) => call.body.operationName)).toEqual(expectedOperationNames);
		for (const call of calls) {
			expect(call.url).toBe('/graphql');
			expect(call.headers.get('authorization')).toBeNull();
			expect(call.headers.get('x-lesser-host-token')).toBeNull();
			expect(call.headers.get('x-host-instance-key')).toBeNull();
			expect(call.body.query).toContain(call.body.operationName);

			const variablesText = JSON.stringify(call.body.variables);
			for (const disallowedKey of disallowedHostCredentialKeys) {
				expect(variablesText).not.toContain(disallowedKey);
			}
			expect(variablesText).not.toContain('canonicalJson');
			expect(variablesText).not.toContain('digestHex');
		}

		expect(results.currentResult.state?.phase).toBe('NOT_STARTED');
		expect(results.beginResult.state?.phase).toBe('WALLET_VERIFICATION');
		expect(results.walletResult.state?.phase).toBe('PRINCIPAL_DECLARATION');
		expect(results.principalPreflightResult.state?.phase).toBe('PRINCIPAL_DECLARATION');
		expect(results.principalVerifiedResult.state?.phase).toBe('CONVERSATION');
		expect(results.conversationMessageResult.state?.phase).toBe('CONVERSATION');
		expect(results.conversationCompleteResult.state?.phase).toBe('FINALIZE');
		expect(results.finalizePreflightResult.state?.phase).toBe('FINALIZE');
		expect(results.finalizeResult.state?.phase).toBe('COMPLETE');
		expect(results.finalizeResult.surface?.soulBindingState).toBe('BOUND');
		expect(results.finalizeResult.state?.hostSoulAgentId).toBe(
			project44SoulBootstrapIds.soulAgentId
		);
		expect(results.finalizeResult.state?.publication).toMatchObject({
			agentId: project44SoulBootstrapIds.soulAgentId,
			anchorState: 'HOSTED_OFF_CHAIN',
			registrationS3Key: 'soul-bootstrap/project-44/registration.json',
		});
		expect(results.finalizeResult.nextAction).toBe('binding_ready');
	});

	it('relays Lesser-provided signing payloads and signatures without rebuilding Host digests', async () => {
		const { fetchMock, results } = await runProject44BootstrapFlow();
		const calls = parseGraphQLCalls(fetchMock);
		const callByOperation = new Map(calls.map((call) => [call.body.operationName, call]));
		const walletCheckpoint = results.beginResult.state?.signingCheckpoints[0];
		const principalCheckpoint = results.principalPreflightResult.state?.signingCheckpoints[0];
		const finalizeCheckpoint = results.finalizePreflightResult.state?.signingCheckpoints[0];

		expect(walletCheckpoint).toMatchObject(project44SoulBootstrapSigning.walletChallenge);
		expect(principalCheckpoint).toMatchObject(project44SoulBootstrapSigning.principalDeclaration);
		expect(finalizeCheckpoint).toMatchObject(project44SoulBootstrapSigning.finalize);
		expect(principalCheckpoint?.canonicalJson).toContain('"source":"lesser"');
		expect(principalCheckpoint?.signingMethod).toBe('eip191_personal_sign');
		expect(principalCheckpoint?.messageEncoding).toBe('hex_bytes');
		expect(principalCheckpoint?.messageHex).toBe(principalCheckpoint?.digestHex);
		expect(finalizeCheckpoint?.finalizeRequestTemplateJson).toContain('"expected_version":3');
		expect(finalizeCheckpoint?.signingMethod).toBe('eip191_personal_sign');
		expect(finalizeCheckpoint?.messageEncoding).toBe('hex_bytes');
		expect(finalizeCheckpoint?.messageHex).toBe(finalizeCheckpoint?.digestHex);

		expect(callByOperation.get('VerifySoulBootstrapWallet')?.body.variables).toMatchObject({
			input: {
				signature: project44Signatures.walletChallenge,
			},
		});
		expect(
			callByOperation.get('VerifySoulBootstrapPrincipalDeclaration')?.body.variables
		).toMatchObject({
			input: {
				signature: project44Signatures.walletChallenge,
				principalDeclaration: project44PrincipalDeclaration,
				principalSignature: project44Signatures.principalDeclaration,
			},
		});
		expect(callByOperation.get('FinalizeSoulBootstrap')?.body.variables).toMatchObject({
			input: {
				selfAttestation: project44Signatures.finalizeSelfAttestation,
				boundarySignaturesJson: '{"project-44-continuity":"0xboundary"}',
				expectedVersion: 3,
				issuedAt: project44SoulBootstrapIds.issuedAt,
			},
		});
		expect(
			'signature' in
				(callByOperation.get('FinalizeSoulBootstrap')?.body.variables.input as Record<
					string,
					unknown
				>)
		).toBe(false);
	});

	it('returns typed wallet, principal, and finalize signing plans with adapter-owned submission mapping', async () => {
		const { results } = await runProject44BootstrapFlow();

		const walletPlan = createSoulBootstrapSigningPlan(results.beginResult, 'wallet_challenge');
		expect(walletPlan).toMatchObject({
			kind: 'wallet_challenge',
			checkpointName: 'wallet',
			registrationId: project44SoulBootstrapIds.registrationId,
			walletAddress: project44SoulBootstrapIds.walletAddress,
			signing: {
				method: 'eip191_personal_sign',
				messageEncoding: 'utf8',
				message: project44SoulBootstrapSigning.walletChallenge.message,
				signerAddress: project44SoulBootstrapIds.walletAddress,
			},
		});
		expect(walletPlan.createSubmitInput(project44Signatures.walletChallenge)).toEqual({
			username: project44SoulBootstrapIds.username,
			registrationId: project44SoulBootstrapIds.registrationId,
			signature: project44Signatures.walletChallenge,
			idempotencyKey: project44SoulBootstrapIds.walletIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});

		const principalPlan = createSoulBootstrapSigningPlan(
			results.principalPreflightResult,
			'principal_declaration'
		);
		expect(principalPlan).toMatchObject({
			kind: 'principal_declaration',
			checkpointName: 'principal_declaration',
			principalAddress: project44SoulBootstrapIds.principalAddress,
			declaredAt: project44SoulBootstrapIds.declaredAt,
			signing: {
				method: 'eip191_personal_sign',
				messageEncoding: 'hex_bytes',
				messageHex: project44SoulBootstrapSigning.principalDeclaration.messageHex,
				digestHex: project44SoulBootstrapSigning.principalDeclaration.digestHex,
				canonicalJson: project44SoulBootstrapSigning.principalDeclaration.canonicalJson,
				signerAddress: project44SoulBootstrapIds.principalAddress,
			},
		});
		expect(
			principalPlan.createSubmitInput({
				walletChallengeSignature: project44Signatures.walletChallenge,
				principalDeclaration: project44PrincipalDeclaration,
				principalSignature: project44Signatures.principalDeclaration,
			})
		).toEqual({
			username: project44SoulBootstrapIds.username,
			registrationId: project44SoulBootstrapIds.registrationId,
			signature: project44Signatures.walletChallenge,
			principalAddress: project44SoulBootstrapIds.principalAddress,
			principalDeclaration: project44PrincipalDeclaration,
			principalSignature: project44Signatures.principalDeclaration,
			declaredAt: project44SoulBootstrapIds.declaredAt,
			idempotencyKey: project44SoulBootstrapIds.principalIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});

		const finalizePlan = createSoulBootstrapSigningPlan(
			results.finalizePreflightResult,
			'finalize_self_attestation'
		);
		expect(finalizePlan).toMatchObject({
			kind: 'finalize_self_attestation',
			checkpointName: 'finalize',
			conversationId: project44SoulBootstrapIds.conversationId,
			expectedVersion: 3,
			nextVersion: 4,
			finalizeRequestTemplate: {
				boundarySignaturesJson: '{"project-44-continuity":"0xboundary"}',
				issuedAt: project44SoulBootstrapIds.issuedAt,
				expectedVersion: 3,
				selfAttestation: '',
			},
			signing: {
				method: 'eip191_personal_sign',
				messageEncoding: 'hex_bytes',
				messageHex: project44SoulBootstrapSigning.finalize.messageHex,
				digestHex: project44SoulBootstrapSigning.finalize.digestHex,
				canonicalJson: project44SoulBootstrapSigning.finalize.canonicalJson,
				signerAddress: project44SoulBootstrapIds.walletAddress,
			},
		});
		expect(finalizePlan.createSubmitInput(project44Signatures.finalizeSelfAttestation)).toEqual({
			username: project44SoulBootstrapIds.username,
			registrationId: project44SoulBootstrapIds.registrationId,
			conversationId: project44SoulBootstrapIds.conversationId,
			boundarySignaturesJson: '{"project-44-continuity":"0xboundary"}',
			issuedAt: project44SoulBootstrapIds.issuedAt,
			expectedVersion: 3,
			selfAttestation: project44Signatures.finalizeSelfAttestation,
			idempotencyKey: project44SoulBootstrapIds.finalizeIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});
	});

	it('fails closed on unsupported signing semantics, malformed digest payloads, and unknown checkpoints', () => {
		const principalCheckpoint =
			project44SoulBootstrapFixtures.principalDeclarationPreflight.state.signingCheckpoints[0];
		const finalizeCheckpoint =
			project44SoulBootstrapFixtures.finalizePreflight.state.signingCheckpoints[0];
		const walletCheckpoint =
			project44SoulBootstrapFixtures.walletChallenge.state.signingCheckpoints[0];

		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface({
						...principalCheckpoint,
						signingMethod: 'eip712',
					}),
					'principal_declaration'
				),
			'unsupported_signing_method'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface({
						...principalCheckpoint,
						messageEncoding: 'utf8',
					}),
					'principal_declaration'
				),
			'unsupported_message_encoding'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface({
						...principalCheckpoint,
						messageHex: null,
					}),
					'principal_declaration'
				),
			'missing_payload'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface({
						...principalCheckpoint,
						digestHex: '0xnot-hex',
					}),
					'principal_declaration'
				),
			'malformed_hex'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface({
						...principalCheckpoint,
						digestHex: `0x${'f'.repeat(64)}`,
					}),
					'principal_declaration'
				),
			'digest_message_mismatch'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface({
						...finalizeCheckpoint,
						finalizeRequestTemplateJson:
							'{"issued_at":"2026-06-12T12:10:00Z","expected_version":3,"self_attestation":""}',
					}),
					'finalize_self_attestation'
				),
			'missing_template_field'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface({
						...finalizeCheckpoint,
						expectedVersion: null,
					}),
					'finalize_self_attestation'
				),
			'missing_template_field'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createSigningPlanSurface(finalizeCheckpoint, {
						signingCheckpoints: [finalizeCheckpoint],
						hostConversationId: project44SoulBootstrapIds.conversationId,
						hostRegistrationId: project44SoulBootstrapIds.registrationId,
						principalAddress: project44SoulBootstrapIds.principalAddress,
					}).state,
					'finalize_self_attestation'
				).createSubmitInput('   '),
			'missing_signature'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					createProject44SoulBootstrapSurface({
						phase: 'WALLET_VERIFICATION',
						state: 'awaiting_wallet_signature',
						signingCheckpoints: [
							{
								...walletCheckpoint,
								name: 'wallet_challenge',
							},
						],
					}),
					'wallet_challenge'
				),
			'unknown_checkpoint'
		);
		expectSigningPlanError(
			() =>
				createSoulBootstrapSigningPlan(
					{
						...createProject44SoulBootstrapSurface({
							phase: 'WALLET_VERIFICATION',
							state: 'awaiting_wallet_signature',
							signingCheckpoints: [walletCheckpoint],
						}).state,
						correlation: null,
					},
					'wallet_challenge'
				),
			'missing_correlation'
		);
	});

	it('normalizes missing trust and missing instance key surfaces for Sim routes', async () => {
		const clientForSurface = (surface: SoulBootstrapSurface) =>
			createSoulBootstrapClient({
				graphqlClient: {
					async query(): Promise<
						SoulBootstrapGraphQLResult<{ soulBootstrap: SoulBootstrapSurface }>
					> {
						return { data: { soulBootstrap: surface } };
					},
					async mutate(): Promise<SoulBootstrapGraphQLResult<never>> {
						throw new Error('mutation should not be called for current surface checks');
					},
				} satisfies SoulBootstrapGraphQLClient,
			});

		const missingTrust = await clientForSurface(
			project44SoulBootstrapFixtures.missingTrust
		).current(project44SoulBootstrapIds.username);
		const missingInstanceKey = await clientForSurface(
			project44SoulBootstrapFixtures.missingInstanceKey
		).current(project44SoulBootstrapIds.username);

		expect(missingTrust).toMatchObject({
			executable: false,
			hostBridgeAvailable: false,
			nextAction: 'request_trust',
			error: {
				category: 'missing_trust',
				code: 'MISSING_TRUST',
				statusCode: 403,
			},
		});
		expect(missingTrust.surface?.workflow.identitySemantics.identityState).toBe('BLOCKED');
		expect(missingTrust.surface?.body.username).toBe(project44SoulBootstrapIds.username);

		expect(missingInstanceKey).toMatchObject({
			executable: false,
			hostBridgeAvailable: false,
			nextAction: 'configure_instance_key',
			error: {
				category: 'missing_instance_key',
				code: 'MISSING_INSTANCE_KEY',
				statusCode: 503,
				hostRequestId: project44SoulBootstrapIds.hostRequestId,
			},
		});
		expect(missingInstanceKey.surface?.workflow.identitySemantics.continuitySummary).toContain(
			'operator action'
		);
	});

	it('rejects attempted Host write-client configuration at the public facade boundary', () => {
		const graphqlClient = {
			async query(): Promise<SoulBootstrapGraphQLResult<never>> {
				return {};
			},
			async mutate(): Promise<SoulBootstrapGraphQLResult<never>> {
				return {};
			},
		} satisfies SoulBootstrapGraphQLClient;

		for (const key of disallowedHostCredentialKeys) {
			expect(() =>
				createSoulBootstrapClient({
					httpEndpoint: '/graphql',
					[key]: key.endsWith('Client') ? graphqlClient : 'host-secret',
				} as never)
			).toThrow(`does not accept ${key}`);
			expect(() =>
				createSoulBootstrapClient({
					graphqlClient,
					[key]: key.endsWith('Client') ? graphqlClient : 'host-secret',
				} as never)
			).toThrow(`does not accept ${key}`);
		}
	});

	it('maps representative backend and GraphQL errors into actionable Sim categories', () => {
		const backendCases: Array<[string, string, number, SoulBootstrapErrorCategory]> = [
			['MISSING_TRUST', 'trusted Lesser identity required', 403, 'missing_trust'],
			['MISSING_INSTANCE_KEY', 'missing instance key', 503, 'missing_instance_key'],
			['HOST_UNAVAILABLE', 'lesser host unavailable', 502, 'host_unavailable'],
			['SIGNATURE_REJECTED', 'signature rejected by Host', 400, 'signature_rejection'],
			['INCOMPLETE_CONVERSATION', 'conversation not complete', 409, 'incomplete_conversation'],
			['FINALIZE_EXPIRED', 'finalize signature expired', 400, 'finalize_expiry'],
			['BINDING_CONFLICT', 'already bound to another body', 409, 'binding_conflict'],
			['BAD_USER_INPUT', 'validation failed', 422, 'validation'],
			['NOT_FOUND', 'bootstrap state not found', 404, 'not_found'],
		];

		for (const [code, message, statusCode, category] of backendCases) {
			const normalized = normalizeSoulBootstrapError(
				createProject44SoulBootstrapErrorState({ code, message, statusCode })
			);
			expect(normalized).toMatchObject({ category, code, message, statusCode });
			expect(normalized?.backendError?.hostRequestId).toBe(project44SoulBootstrapIds.hostRequestId);
		}

		expect(
			normalizeSoulBootstrapError(null, [
				{ message: 'auth required', extensions: { code: 'UNAUTHENTICATED' } },
			])
		).toMatchObject({ category: 'unauthorized', code: 'UNAUTHENTICATED' });
		expect(
			normalizeSoulBootstrapError(null, [
				{ message: 'invalid bootstrap input', extensions: { code: 'BAD_USER_INPUT' } },
			])
		).toMatchObject({ category: 'validation', code: 'BAD_USER_INPUT' });
	});

	it('throws typed errors when Lesser GraphQL returns no data for the Sim-facing surface', async () => {
		const client = createSoulBootstrapClient({
			graphqlClient: {
				async query() {
					return {
						errors: [
							{
								message: 'Soul bootstrap state not found',
								extensions: { code: 'NOT_FOUND' },
							},
						],
					};
				},
				async mutate() {
					return {};
				},
			} satisfies SoulBootstrapGraphQLClient,
		});

		await expect(client.current(project44SoulBootstrapIds.username)).rejects.toMatchObject<
			Partial<SoulBootstrapClientError>
		>({
			name: 'SoulBootstrapClientError',
			category: 'not_found',
			code: 'NOT_FOUND',
		});
	});
});
