import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Read & parse the vendored lesser-host OpenAPI contract. */
function loadLesserHostOpenAPI(): Record<string, unknown> {
	const contractPath = path.join(
		__dirname,
		'..',
		'..',
		'..',
		'..',
		'docs',
		'lesser-host',
		'contracts',
		'openapi.yaml'
	);
	const raw = fs.readFileSync(contractPath, 'utf8');
	return yaml.parse(raw);
}

/** Load a vendored JSON schema file from docs/lesser-host/spec/v3/schemas/. */
function loadLesserHostSchema(filename: string): Record<string, unknown> {
	const schemaPath = path.join(
		__dirname,
		'..',
		'..',
		'..',
		'..',
		'docs',
		'lesser-host',
		'spec',
		'v3',
		'schemas',
		filename
	);
	const raw = fs.readFileSync(schemaPath, 'utf8');
	return JSON.parse(raw);
}

type OpenAPIPostOperation = {
	description?: string;
	security?: Array<Record<string, string[]>>;
};

function openAPIPostOperation(pathEntry: unknown): OpenAPIPostOperation {
	const post = (pathEntry as { post?: OpenAPIPostOperation }).post;
	if (!post) {
		throw new Error('Expected OpenAPI path entry to define a POST operation');
	}
	return post;
}

function openAPISecurity(operation: OpenAPIPostOperation): Array<Record<string, string[]>> {
	if (!operation.security) {
		throw new Error('Expected OpenAPI operation to define security requirements');
	}
	return operation.security;
}

describe('CSR-035: x402 grant contracts', () => {
	// ── consume request schema ──────────────────────────────────────
	describe('SoulX402InvocationGrantConsumeRequest', () => {
		it('requires paymentEvidenceHash', () => {
			const schema = loadLesserHostSchema('soul-x402-invocation-grant.consume.request.schema.json');
			expect(schema.required).toContain('paymentEvidenceHash');
		});

		it('defines paymentEvidenceHash with sha256 pattern and description', () => {
			const schema = loadLesserHostSchema('soul-x402-invocation-grant.consume.request.schema.json');
			expect(schema.properties).toHaveProperty('paymentEvidenceHash');
			const prop = schema.properties.paymentEvidenceHash as Record<string, unknown>;
			expect(prop.type).toBe('string');
			expect(prop.pattern).toBe('^(sha256:)?[0-9a-fA-F]{64}$');
			expect(typeof prop.description).toBe('string');
			expect(prop.description).toMatch(/payment evidence/i);
		});

		it('retains all original required fields plus paymentEvidenceHash', () => {
			const schema = loadLesserHostSchema('soul-x402-invocation-grant.consume.request.schema.json');
			const originalRequired = [
				'grantToken',
				'agentId',
				'capability',
				'tool',
				'resource',
				'requestHash',
				'idempotencyKey',
			];
			for (const field of originalRequired) {
				expect(schema.required).toContain(field);
			}
			expect(schema.required).toHaveLength(originalRequired.length + 1);
		});
	});

	// ── issue request schema ────────────────────────────────────────
	describe('SoulX402InvocationGrantIssueRequest', () => {
		it('describes the route as instance-key authenticated', () => {
			const schema = loadLesserHostSchema('soul-x402-invocation-grant.issue.request.schema.json');
			expect(typeof schema.description).toBe('string');
			expect(schema.description).toMatch(/instance-key authenticated/);
			expect(schema.description).not.toMatch(/public route/);
		});

		it('still requires caller and payment with hash semantics', () => {
			const schema = loadLesserHostSchema('soul-x402-invocation-grant.issue.request.schema.json');
			expect(schema.required).toContain('caller');
			expect(schema.required).toContain('payment');
			expect(schema.required).toContain('agentId');
			expect(schema.required).toContain('expiresAt');

			const caller = schema.properties.caller as Record<string, unknown>;
			expect(caller.properties).toHaveProperty('subjectHash');

			const payment = schema.properties.payment as Record<string, unknown>;
			expect(payment.properties).toHaveProperty('evidenceHash');
		});
	});

	// ── OpenAPI path contract ───────────────────────────────────────
	describe('OpenAPI x402 grant paths', () => {
		const contract = loadLesserHostOpenAPI();

		it('issue endpoint requires instanceKeyAuth', () => {
			const paths = (contract as { paths?: Record<string, unknown> }).paths ?? {};
			const issueOperation = openAPIPostOperation(paths['/api/v1/soul/x402/grants']);

			const security = openAPISecurity(issueOperation);
			expect(security).toHaveLength(1);
			expect(security[0]).toHaveProperty('instanceKeyAuth');
		});

		it('consume endpoint requires instanceKeyAuth (unchanged)', () => {
			const paths = (contract as { paths?: Record<string, unknown> }).paths ?? {};
			const consumeOperation = openAPIPostOperation(
				paths['/api/v1/soul/x402/grants/{grantId}/consume']
			);

			const security = openAPISecurity(consumeOperation);
			expect(security).toHaveLength(1);
			expect(security[0]).toHaveProperty('instanceKeyAuth');
		});

		it('issue endpoint description references instance-key auth', () => {
			const paths = (contract as { paths?: Record<string, unknown> }).paths ?? {};
			const issueOperation = openAPIPostOperation(paths['/api/v1/soul/x402/grants']);
			expect(issueOperation.description).toMatch(/instance-key authenticated route/);
			expect(issueOperation.description).not.toMatch(/public route/);
		});
	});

	// ── Grant schema (unchanged core) ───────────────────────────────
	describe('SoulX402InvocationGrant', () => {
		it('includes evidenceHash in the payment object (grant record)', () => {
			const schema = loadLesserHostSchema('soul-x402-invocation-grant.schema.json');
			const payment = schema.properties.payment as Record<string, unknown>;
			expect(payment.required).toContain('evidenceHash');
			expect(payment.properties).toHaveProperty('evidenceHash');
		});

		it('has facilitatorTrustBoundary set to caller_provided_unverified', () => {
			const schema = loadLesserHostSchema('soul-x402-invocation-grant.schema.json');
			const payment = schema.properties.payment as Record<string, unknown>;
			expect(payment.required).toContain('facilitatorTrustBoundary');
			expect(payment.properties).toHaveProperty('facilitatorTrustBoundary');
			const ftb = payment.properties.facilitatorTrustBoundary as Record<string, unknown>;
			expect(ftb.enum).toEqual(['caller_provided_unverified']);
		});
	});

	// ── LESSER_HOST_REF pin ─────────────────────────────────────────
	describe('LESSER_HOST_REF contract pin', () => {
		it('pins to the CSR-035 remediated commit', () => {
			const refPath = path.join(
				__dirname,
				'..',
				'..',
				'..',
				'..',
				'docs',
				'lesser-host',
				'contracts',
				'LESSER_HOST_REF.txt'
			);
			const refContent = fs.readFileSync(refPath, 'utf8');
			expect(refContent).toMatch(/24c8d4b3d6055e79499f4c69947f79d4795024a5/);
			expect(refContent).toMatch(/CSR-035/);
		});
	});
});
