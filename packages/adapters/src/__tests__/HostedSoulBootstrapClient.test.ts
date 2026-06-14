import { describe, expect, it, vi } from 'vitest';

import {
	createHostedSoulBootstrapClient,
	type HostedSoulBootstrapResult,
	type SoulBootstrapGraphQLClient,
	type SoulBootstrapGraphQLResult,
	type SoulBootstrapSurface,
} from '../index';
import {
	project44HostedSoulBootstrapOperationFixtures,
	project44SoulBootstrapFixtures,
	project44SoulBootstrapIds,
} from '../fixtures/soul-bootstrap';

const rootFieldByOperation: Record<string, string> = {
	SoulBootstrap: 'soulBootstrap',
	StartHostedSoulBootstrap: 'startHostedSoulBootstrap',
	SendHostedSoulGenesisMessage: 'sendHostedSoulGenesisMessage',
	CompleteHostedSoulGenesis: 'completeHostedSoulGenesis',
	PublishHostedSoul: 'publishHostedSoul',
	RestartSoulBootstrap: 'restartSoulBootstrap',
};

const expectedHostedOperationNames = Object.keys(rootFieldByOperation);

const disallowedHostedInputKeys = [
	'walletAddress',
	'principalAddress',
	'principalDeclaration',
	'signature',
	'principalSignature',
	'boundarySignaturesJson',
	'selfAttestation',
	'signingPlan',
	'signingCheckpoints',
	'hostBaseUrl',
	'hostEndpoint',
	'hostToken',
	'hostHeaders',
	'instanceKey',
	'lesserHostToken',
	'lesserHostClient',
	'hostClient',
] as const;

const disallowedHostedConfigHeaderNames = [
	'x-lesser-host-token',
	'X-HoSt-InStAnCe-Key',
	'x-lesser-host-instance-key',
	'x-instance-key',
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
		project44HostedSoulBootstrapOperationFixtures[
			operationName as keyof typeof project44HostedSoulBootstrapOperationFixtures
		];

	if (!rootField || !surface) {
		throw new Error(`Missing hosted Project 44 fixture for ${operationName}`);
	}

	return {
		[rootField]: operationName === 'SoulBootstrap' ? surface : mutationPayload(surface),
	};
}

function createHostedProject44Fetch() {
	return vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
		const body = JSON.parse(String(init?.body ?? '{}')) as { operationName?: string };
		const operationName = body.operationName ?? 'SoulBootstrap';
		return jsonResponse({ data: graphQLDataForOperation(operationName) });
	});
}

function parseGraphQLCalls(fetchMock: ReturnType<typeof createHostedProject44Fetch>) {
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

function expectHostedResult(result: HostedSoulBootstrapResult) {
	expect(result.hosted).toMatchObject({
		bootstrapMode: 'HOSTED',
		authorityModel: 'INSTANCE_TRUST',
		anchorState: 'HOSTED_OFFCHAIN',
		assuranceState: 'HOSTED_OFFCHAIN',
	});
	expect(result.state?.walletAddress).toBeNull();
	expect(result.state?.principalAddress).toBeNull();
	expect(result.state?.signingCheckpoints).toEqual([]);
	expect('walletAddress' in (result.hosted as object)).toBe(false);
	expect('principalAddress' in (result.hosted as object)).toBe(false);
	expect('signingCheckpoints' in (result.hosted as object)).toBe(false);
}

describe('HostedSoulBootstrapClient', () => {
	it('runs the hosted happy path through Lesser GraphQL with no wallet or Host credentials', async () => {
		const fetchMock = createHostedProject44Fetch();
		const client = createHostedSoulBootstrapClient({
			httpEndpoint: '/graphql',
			fetch: fetchMock,
		});

		const currentResult = await client.current(project44SoulBootstrapIds.username);
		const startResult = await client.startHostedSoulBootstrap({
			username: project44SoulBootstrapIds.username,
			capabilities: ['post', 'moderate'],
			idempotencyKey: project44SoulBootstrapIds.beginIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});
		const messageResult = await client.sendHostedSoulGenesisMessage({
			username: project44SoulBootstrapIds.username,
			registrationId: project44SoulBootstrapIds.registrationId,
			conversationId: project44SoulBootstrapIds.conversationId,
			message: 'Start the hosted Project 44 soul genesis.',
			model: 'sim-project-44',
			idempotencyKey: project44SoulBootstrapIds.conversationIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});
		const completeResult = await client.completeHostedSoulGenesis({
			username: project44SoulBootstrapIds.username,
			registrationId: project44SoulBootstrapIds.registrationId,
			conversationId: project44SoulBootstrapIds.conversationId,
			idempotencyKey: project44SoulBootstrapIds.conversationIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});
		const publishResult = await client.publishHostedSoul({
			username: project44SoulBootstrapIds.username,
			registrationId: project44SoulBootstrapIds.registrationId,
			conversationId: project44SoulBootstrapIds.conversationId,
			idempotencyKey: project44SoulBootstrapIds.finalizeIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});
		const calls = parseGraphQLCalls(fetchMock);

		expect(calls.map((call) => call.body.operationName)).toEqual(
			expectedHostedOperationNames.slice(0, 5)
		);
		for (const call of calls) {
			expect(call.url).toBe('/graphql');
			expect(call.headers.get('authorization')).toBeNull();
			expect(call.headers.get('x-lesser-host-token')).toBeNull();
			expect(call.headers.get('x-host-instance-key')).toBeNull();
			expect(call.body.query).toContain(call.body.operationName);

			const variablesText = JSON.stringify(call.body.variables);
			for (const disallowedKey of disallowedHostedInputKeys) {
				expect(variablesText).not.toContain(disallowedKey);
			}
		}

		expectHostedResult(currentResult);
		expectHostedResult(startResult);
		expectHostedResult(messageResult);
		expectHostedResult(completeResult);
		expectHostedResult(publishResult);
		expect(currentResult.typedNextAction).toBe('START_HOSTED_BOOTSTRAP');
		expect(startResult.typedNextAction).toBe('SEND_HOSTED_SOUL_GENESIS_MESSAGE');
		expect(messageResult.typedNextAction).toBe('COMPLETE_HOSTED_SOUL_GENESIS');
		expect(completeResult.typedNextAction).toBe('PUBLISH_HOSTED_SOUL');
		expect(publishResult.typedNextAction).toBe('COMPLETE');
		expect(publishResult.boundSoul).toMatchObject({
			existingSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
			soulBindingState: 'BOUND',
			publication: {
				agentId: project44SoulBootstrapIds.soulAgentId,
				authorityModel: 'INSTANCE_TRUST',
				registrationS3Key: 'soul-bootstrap/project-44/registration.json',
			},
		});
	});

	it('exposes typed restart-required recovery and restart metadata', async () => {
		const client = createHostedSoulBootstrapClient({
			graphqlClient: createSurfaceGraphQLClient(
				project44SoulBootstrapFixtures.hostedRestartRequired
			),
		});

		const current = await client.current(project44SoulBootstrapIds.username);
		const restarted = await createHostedSoulBootstrapClient({
			graphqlClient: createMutationGraphQLClient(project44SoulBootstrapFixtures.hostedRestarted),
		}).restartSoulBootstrap({
			username: project44SoulBootstrapIds.username,
			reason: 'operator requested restart after stale hosted registration',
			recoveryAttemptId: project44SoulBootstrapIds.recoveryAttemptId,
			idempotencyKey: project44SoulBootstrapIds.restartIdempotencyKey,
			correlationKey: project44SoulBootstrapIds.correlationKey,
		});

		expect(current).toMatchObject({
			typedNextAction: 'RESTART_SOUL_BOOTSTRAP',
			recoveryCategory: 'RESTART_REQUIRED',
			recoveryAction: 'RESTART_BOOTSTRAP',
			restartRequired: true,
			restartAvailable: true,
			error: {
				code: 'HOSTED_RESTART_REQUIRED',
				recoveryCategory: 'RESTART_REQUIRED',
				recoveryAction: 'RESTART_BOOTSTRAP',
				restartRequired: true,
			},
		});
		expect(restarted.hostRequest).toMatchObject({
			recoveryAttemptId: project44SoulBootstrapIds.recoveryAttemptId,
			restartIdempotencyKey: project44SoulBootstrapIds.restartIdempotencyKey,
			supersededHostRegistrationId: project44SoulBootstrapIds.registrationId,
			supersededHostConversationId: project44SoulBootstrapIds.conversationId,
		});
		expect(restarted.hosted?.restartedAt).toBe(project44SoulBootstrapIds.restartedAt);
		expect(restarted.typedNextAction).toBe('SEND_HOSTED_SOUL_GENESIS_MESSAGE');
	});

	it('surfaces operator-action-required hosted state without inventing browser Host fallback', async () => {
		const client = createHostedSoulBootstrapClient({
			graphqlClient: createSurfaceGraphQLClient(
				project44SoulBootstrapFixtures.hostedOperatorActionRequired
			),
		});

		const result = await client.getCurrentHostedSoulBootstrap(project44SoulBootstrapIds.username);

		expect(result).toMatchObject({
			executable: false,
			hostBridgeAvailable: false,
			typedNextAction: 'OPERATOR_ACTION_REQUIRED',
			recoveryCategory: 'OPERATOR_ACTION_REQUIRED',
			recoveryAction: 'CONTACT_OPERATOR',
			error: {
				category: 'host_unavailable',
				code: 'HOSTED_OPERATOR_ACTION_REQUIRED',
				recoveryCategory: 'OPERATOR_ACTION_REQUIRED',
				recoveryAction: 'CONTACT_OPERATOR',
			},
		});
		expect(result.hosted?.bootstrapMode).toBe('HOSTED');
		expect(result.hostRequest?.hostRequestId).toBe(project44SoulBootstrapIds.hostRequestId);
	});

	it('models already-bound and complete-bound states as hosted publication evidence', async () => {
		const client = createHostedSoulBootstrapClient({
			graphqlClient: createSurfaceGraphQLClient(project44SoulBootstrapFixtures.hostedAlreadyBound),
		});

		const result = await client.current({ username: project44SoulBootstrapIds.username });

		expect(result).toMatchObject({
			executable: false,
			typedNextAction: 'COMPLETE',
			restartRequired: false,
			boundSoul: {
				existingSoulAgentId: project44SoulBootstrapIds.soulAgentId,
				hostSoulAgentId: project44SoulBootstrapIds.soulAgentId,
				soulBindingState: 'BOUND',
			},
		});
		expect(result.publication).toMatchObject({
			agentId: project44SoulBootstrapIds.soulAgentId,
			authorityModel: 'INSTANCE_TRUST',
			publishedVersion: 5,
		});
		expect(result.error).toBeNull();
	});

	it('rejects wallet, signing, and browser Host credential inputs at the hosted boundary', async () => {
		const graphqlClient = createSurfaceGraphQLClient(
			project44SoulBootstrapFixtures.hostedNotStarted
		);
		for (const key of [
			'hostBaseUrl',
			'hostEndpoint',
			'hostToken',
			'hostHeaders',
			'instanceKey',
			'lesserHostToken',
			'lesserHostClient',
			'hostClient',
		] as const) {
			expect(() =>
				createHostedSoulBootstrapClient({
					graphqlClient,
					[key]: key.endsWith('Client') ? graphqlClient : 'host-secret',
				} as never)
			).toThrow(`does not accept ${key}`);
		}

		const client = createHostedSoulBootstrapClient({ graphqlClient });
		for (const key of disallowedHostedInputKeys) {
			await expect(
				client.startHostedSoulBootstrap({
					username: project44SoulBootstrapIds.username,
					[key]: key.endsWith('Client') ? graphqlClient : 'wallet-or-host-secret',
				} as never)
			).rejects.toThrow(`does not accept ${key}`);
		}
	});

	it('rejects Host credential headers case-insensitively before any request', () => {
		for (const headerName of disallowedHostedConfigHeaderNames) {
			const fetchMock = createHostedProject44Fetch();
			expect(() =>
				createHostedSoulBootstrapClient({
					httpEndpoint: '/graphql',
					fetch: fetchMock,
					headers: {
						[headerName]: 'host-secret',
					},
				})
			).toThrow(`does not accept ${headerName} header`);
			expect(fetchMock).not.toHaveBeenCalled();
		}
	});

	it('allows ordinary Lesser GraphQL auth and benign custom headers', async () => {
		const fetchMock = createHostedProject44Fetch();
		const client = createHostedSoulBootstrapClient({
			httpEndpoint: '/graphql',
			fetch: fetchMock,
			headers: {
				authorization: 'Bearer lesser-session-token',
				'x-sim-request-id': 'project44-hosted-bootstrap-test',
			},
		});

		await client.current(project44SoulBootstrapIds.username);

		const [call] = parseGraphQLCalls(fetchMock);
		expect(call.headers.get('authorization')).toBe('Bearer lesser-session-token');
		expect(call.headers.get('x-sim-request-id')).toBe('project44-hosted-bootstrap-test');
		expect(call.headers.get('x-lesser-host-token')).toBeNull();
		expect(call.headers.get('x-host-instance-key')).toBeNull();
	});

	it('keeps the hosted start-or-resume alias on the same Lesser mutation contract', async () => {
		const fetchMock = createHostedProject44Fetch();
		const client = createHostedSoulBootstrapClient({ httpEndpoint: '/graphql', fetch: fetchMock });

		await client.startOrResumeHostedSoulBootstrap({
			username: project44SoulBootstrapIds.username,
			recoveryAttemptId: project44SoulBootstrapIds.recoveryAttemptId,
		});
		await client.startOrResume({ username: project44SoulBootstrapIds.username });

		const calls = parseGraphQLCalls(fetchMock);
		expect(calls.map((call) => call.body.operationName)).toEqual([
			'StartHostedSoulBootstrap',
			'StartHostedSoulBootstrap',
		]);
	});
});

function createSurfaceGraphQLClient(surface: SoulBootstrapSurface): SoulBootstrapGraphQLClient {
	return {
		async query(): Promise<SoulBootstrapGraphQLResult<{ soulBootstrap: SoulBootstrapSurface }>> {
			return { data: { soulBootstrap: surface } };
		},
		async mutate(): Promise<SoulBootstrapGraphQLResult<never>> {
			throw new Error('mutation should not be called for current hosted surface checks');
		},
	};
}

function createMutationGraphQLClient(surface: SoulBootstrapSurface): SoulBootstrapGraphQLClient {
	return {
		async query(): Promise<SoulBootstrapGraphQLResult<{ soulBootstrap: SoulBootstrapSurface }>> {
			return { data: { soulBootstrap: surface } };
		},
		async mutate({ mutation }): Promise<SoulBootstrapGraphQLResult<Record<string, unknown>>> {
			const operationName = mutation.definitions.find(
				(definition) => definition.kind === 'OperationDefinition'
			)?.name?.value;
			const rootField = operationName ? rootFieldByOperation[operationName] : undefined;
			if (!rootField) {
				throw new Error(`Unexpected hosted mutation ${operationName ?? '<anonymous>'}`);
			}
			return {
				data: {
					[rootField]: mutationPayload(surface),
				},
			};
		},
	};
}
