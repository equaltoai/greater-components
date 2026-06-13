import type {
	FinalizeSoulBootstrapInput,
	SoulBootstrapCorrelationState,
	SoulBootstrapResult,
	SoulBootstrapSigningCheckpoint,
	SoulBootstrapState,
	SoulBootstrapSurface,
	VerifySoulBootstrapPrincipalDeclarationInput,
	VerifySoulBootstrapWalletInput,
} from './bootstrap.js';

export type SoulBootstrapHexString = `0x${string}`;
export type SoulBootstrapSigningMethod = 'eip191_personal_sign';
export type SoulBootstrapMessageEncoding = 'utf8' | 'hex_bytes';
export type SoulBootstrapSigningPlanKind =
	| 'wallet_challenge'
	| 'principal_declaration'
	| 'finalize_self_attestation';

export type SoulBootstrapSigningPlanErrorCode =
	| 'missing_state'
	| 'missing_checkpoint'
	| 'unknown_checkpoint'
	| 'unsupported_version'
	| 'unsupported_signing_method'
	| 'unsupported_message_encoding'
	| 'missing_payload'
	| 'malformed_hex'
	| 'digest_message_mismatch'
	| 'missing_template_field'
	| 'malformed_template'
	| 'missing_correlation'
	| 'missing_registration'
	| 'missing_conversation'
	| 'missing_signature';

export type SoulBootstrapSigningPlanSource =
	| SoulBootstrapResult
	| SoulBootstrapSurface
	| SoulBootstrapState;

export interface SoulBootstrapSigningPlanErrorOptions {
	code: SoulBootstrapSigningPlanErrorCode;
	message: string;
	checkpointName?: string;
	field?: string;
	cause?: unknown;
}

export class SoulBootstrapSigningPlanError extends Error {
	readonly code: SoulBootstrapSigningPlanErrorCode;
	readonly checkpointName?: string;
	readonly field?: string;
	readonly cause?: unknown;

	constructor(options: SoulBootstrapSigningPlanErrorOptions) {
		super(options.message);
		this.name = 'SoulBootstrapSigningPlanError';
		this.code = options.code;
		this.checkpointName = options.checkpointName;
		this.field = options.field;
		this.cause = options.cause;
	}
}

export interface SoulBootstrapUtf8SigningInstruction {
	method: SoulBootstrapSigningMethod;
	messageEncoding: 'utf8';
	message: string;
	messageHex: null;
	digestHex: null;
	canonicalJson: null;
	signerAddress: string;
}

export interface SoulBootstrapHexBytesSigningInstruction {
	method: SoulBootstrapSigningMethod;
	messageEncoding: 'hex_bytes';
	message: string | null;
	messageHex: SoulBootstrapHexString;
	digestHex: SoulBootstrapHexString;
	canonicalJson: string;
	signerAddress: string;
}

export type SoulBootstrapWalletSigningInstruction =
	| SoulBootstrapUtf8SigningInstruction
	| SoulBootstrapHexBytesSigningInstruction;

export interface SoulBootstrapSigningPlanBase {
	kind: SoulBootstrapSigningPlanKind;
	checkpointName: string;
	status: string;
	version: string;
	hostRequestId: string | null;
}

export interface SoulBootstrapWalletChallengeSigningPlan extends SoulBootstrapSigningPlanBase {
	kind: 'wallet_challenge';
	checkpointName: 'wallet';
	registrationId: string;
	walletAddress: string;
	signing: SoulBootstrapWalletSigningInstruction;
	createSubmitInput(signature: string): VerifySoulBootstrapWalletInput;
}

export interface SoulBootstrapPrincipalDeclarationSubmitInput {
	walletChallengeSignature: string;
	principalSignature: string;
	principalDeclaration: string;
}

export interface SoulBootstrapPrincipalDeclarationSigningPlan extends SoulBootstrapSigningPlanBase {
	kind: 'principal_declaration';
	checkpointName: 'principal_declaration';
	registrationId: string;
	principalAddress: string;
	declaredAt: string;
	registrationPreviewJson: string | null;
	signing: SoulBootstrapHexBytesSigningInstruction;
	createSubmitInput(
		input: SoulBootstrapPrincipalDeclarationSubmitInput
	): VerifySoulBootstrapPrincipalDeclarationInput;
}

export interface SoulBootstrapFinalizeRequestTemplate {
	boundarySignaturesJson: string;
	issuedAt: string;
	expectedVersion: number;
	selfAttestation: string;
}

export interface SoulBootstrapFinalizeSigningPlan extends SoulBootstrapSigningPlanBase {
	kind: 'finalize_self_attestation';
	checkpointName: 'finalize';
	registrationId: string;
	conversationId: string;
	expectedVersion: number;
	nextVersion: number;
	boundaryRequirementsJson: string | null;
	registrationPreviewJson: string | null;
	finalizeRequestTemplateJson: string;
	finalizeRequestTemplate: SoulBootstrapFinalizeRequestTemplate;
	signing: SoulBootstrapHexBytesSigningInstruction;
	createSubmitInput(selfAttestationSignature: string): FinalizeSoulBootstrapInput;
}

export type SoulBootstrapSigningPlan =
	| SoulBootstrapWalletChallengeSigningPlan
	| SoulBootstrapPrincipalDeclarationSigningPlan
	| SoulBootstrapFinalizeSigningPlan;

const SIGNING_METHOD_EIP191_PERSONAL_SIGN = 'eip191_personal_sign' as const;
const MESSAGE_ENCODING_UTF8 = 'utf8' as const;
const MESSAGE_ENCODING_HEX_BYTES = 'hex_bytes' as const;

export function createSoulBootstrapSigningPlans(
	source: SoulBootstrapSigningPlanSource
): readonly SoulBootstrapSigningPlan[] {
	const state = resolveSoulBootstrapState(source);
	return state.signingCheckpoints.map((checkpoint) => createPlanForCheckpoint(state, checkpoint));
}

export function createSoulBootstrapSigningPlan<TKind extends SoulBootstrapSigningPlanKind>(
	source: SoulBootstrapSigningPlanSource,
	kind: TKind
): Extract<SoulBootstrapSigningPlan, { kind: TKind }> {
	const plan = createSoulBootstrapSigningPlans(source).find((candidate) => candidate.kind === kind);
	if (!plan) {
		throw new SoulBootstrapSigningPlanError({
			code: 'missing_checkpoint',
			message: `Soul bootstrap signing checkpoint is missing for ${kind}.`,
		});
	}
	return plan as Extract<SoulBootstrapSigningPlan, { kind: TKind }>;
}

function createPlanForCheckpoint(
	state: SoulBootstrapState,
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapSigningPlan {
	const checkpointName = normalizeRequiredString(
		checkpoint.name,
		'checkpoint.name',
		checkpoint.name
	);
	switch (checkpointName) {
		case 'wallet':
			return createWalletChallengePlan(state, checkpoint);
		case 'principal_declaration':
			return createPrincipalDeclarationPlan(state, checkpoint);
		case 'finalize':
			return createFinalizePlan(state, checkpoint);
		default:
			throw new SoulBootstrapSigningPlanError({
				code: 'unknown_checkpoint',
				message: `Unsupported soul bootstrap signing checkpoint ${checkpointName}.`,
				checkpointName,
				field: 'name',
			});
	}
}

function createWalletChallengePlan(
	state: SoulBootstrapState,
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapWalletChallengeSigningPlan {
	const base = createPlanBase('wallet_challenge', 'wallet', checkpoint);
	const registrationId = requireRegistrationId(state, checkpoint.name);
	const correlation = requireCorrelation(
		state,
		'walletVerificationIdempotencyKey',
		checkpoint.name
	);
	const signing = createWalletSigningInstruction(checkpoint);
	const walletAddress = normalizeRequiredString(
		checkpoint.signerAddress ?? state.walletAddress,
		'walletAddress',
		checkpoint.name
	);

	return {
		...base,
		registrationId,
		walletAddress,
		signing,
		createSubmitInput(signature: string): VerifySoulBootstrapWalletInput {
			return {
				username: state.username,
				registrationId,
				signature: requireSignature(signature, checkpoint.name, 'signature'),
				idempotencyKey: correlation.idempotencyKey,
				correlationKey: correlation.correlationKey,
			};
		},
	};
}

function createPrincipalDeclarationPlan(
	state: SoulBootstrapState,
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapPrincipalDeclarationSigningPlan {
	const base = createPlanBase('principal_declaration', 'principal_declaration', checkpoint);
	const registrationId = requireRegistrationId(state, checkpoint.name);
	const correlation = requireCorrelation(
		state,
		'principalDeclarationIdempotencyKey',
		checkpoint.name
	);
	const signing = createDigestSigningInstruction(checkpoint);
	const principalAddress = normalizeRequiredString(
		checkpoint.principalAddress ?? state.principalAddress,
		'principalAddress',
		checkpoint.name
	);
	const declaredAt = normalizeRequiredString(checkpoint.declaredAt, 'declaredAt', checkpoint.name);

	return {
		...base,
		registrationId,
		principalAddress,
		declaredAt,
		registrationPreviewJson: normalizeNullableString(checkpoint.registrationPreviewJson),
		signing,
		createSubmitInput(
			input: SoulBootstrapPrincipalDeclarationSubmitInput
		): VerifySoulBootstrapPrincipalDeclarationInput {
			return {
				username: state.username,
				registrationId,
				signature: requireSignature(
					input.walletChallengeSignature,
					checkpoint.name,
					'walletChallengeSignature'
				),
				principalAddress,
				principalDeclaration: normalizeRequiredString(
					input.principalDeclaration,
					'principalDeclaration',
					checkpoint.name
				),
				principalSignature: requireSignature(
					input.principalSignature,
					checkpoint.name,
					'principalSignature'
				),
				declaredAt,
				idempotencyKey: correlation.idempotencyKey,
				correlationKey: correlation.correlationKey,
			};
		},
	};
}

function createFinalizePlan(
	state: SoulBootstrapState,
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapFinalizeSigningPlan {
	const base = createPlanBase('finalize_self_attestation', 'finalize', checkpoint);
	const registrationId = requireRegistrationId(state, checkpoint.name);
	const conversationId = normalizeRequiredString(
		state.hostConversationId,
		'hostConversationId',
		checkpoint.name,
		'missing_conversation'
	);
	const correlation = requireCorrelation(state, 'finalizeIdempotencyKey', checkpoint.name);
	const signing = createDigestSigningInstruction(checkpoint);
	const finalizeRequestTemplateJson = normalizeRequiredString(
		checkpoint.finalizeRequestTemplateJson,
		'finalizeRequestTemplateJson',
		checkpoint.name
	);
	const template = parseFinalizeRequestTemplate(
		finalizeRequestTemplateJson,
		checkpoint.name,
		checkpoint
	);
	const expectedVersion = requireNumberField(
		checkpoint.expectedVersion,
		'expectedVersion',
		checkpoint.name,
		'missing_template_field'
	);
	const nextVersion = requireNumberField(
		checkpoint.nextVersion,
		'nextVersion',
		checkpoint.name,
		'missing_template_field'
	);

	if (template.expectedVersion !== expectedVersion) {
		throw new SoulBootstrapSigningPlanError({
			code: 'missing_template_field',
			message: 'Finalize template expected_version does not match checkpoint expectedVersion.',
			checkpointName: checkpoint.name,
			field: 'finalizeRequestTemplateJson.expected_version',
		});
	}

	return {
		...base,
		registrationId,
		conversationId,
		expectedVersion,
		nextVersion,
		boundaryRequirementsJson: normalizeNullableString(checkpoint.boundaryRequirementsJson),
		registrationPreviewJson: normalizeNullableString(checkpoint.registrationPreviewJson),
		finalizeRequestTemplateJson,
		finalizeRequestTemplate: template,
		signing,
		createSubmitInput(selfAttestationSignature: string): FinalizeSoulBootstrapInput {
			return {
				username: state.username,
				registrationId,
				conversationId,
				boundarySignaturesJson: template.boundarySignaturesJson,
				issuedAt: template.issuedAt,
				expectedVersion: template.expectedVersion,
				selfAttestation: requireSignature(
					selfAttestationSignature,
					checkpoint.name,
					'selfAttestation'
				),
				idempotencyKey: correlation.idempotencyKey,
				correlationKey: correlation.correlationKey,
			};
		},
	};
}

function createPlanBase<TKind extends SoulBootstrapSigningPlanKind, TName extends string>(
	kind: TKind,
	checkpointName: TName,
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapSigningPlanBase & { kind: TKind; checkpointName: TName } {
	return {
		kind,
		checkpointName,
		status: normalizeRequiredString(checkpoint.status, 'status', checkpoint.name),
		version: requireSupportedVersion(checkpoint),
		hostRequestId: normalizeNullableString(checkpoint.hostRequestId),
	};
}

function createWalletSigningInstruction(
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapWalletSigningInstruction {
	assertSigningMethod(checkpoint);
	const signerAddress = normalizeRequiredString(
		checkpoint.signerAddress,
		'signerAddress',
		checkpoint.name
	);
	const encoding = normalizeRequiredString(
		checkpoint.messageEncoding,
		'messageEncoding',
		checkpoint.name
	);

	if (encoding === MESSAGE_ENCODING_UTF8) {
		return {
			method: SIGNING_METHOD_EIP191_PERSONAL_SIGN,
			messageEncoding: MESSAGE_ENCODING_UTF8,
			message: normalizeRequiredString(checkpoint.message, 'message', checkpoint.name),
			messageHex: null,
			digestHex: null,
			canonicalJson: null,
			signerAddress,
		};
	}

	if (encoding === MESSAGE_ENCODING_HEX_BYTES) {
		return createDigestSigningInstruction(checkpoint);
	}

	throw unsupportedEncoding(checkpoint, encoding);
}

function createDigestSigningInstruction(
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapHexBytesSigningInstruction {
	assertSigningMethod(checkpoint);
	const signerAddress = normalizeRequiredString(
		checkpoint.signerAddress,
		'signerAddress',
		checkpoint.name
	);
	const encoding = normalizeRequiredString(
		checkpoint.messageEncoding,
		'messageEncoding',
		checkpoint.name
	);
	if (encoding !== MESSAGE_ENCODING_HEX_BYTES) {
		throw unsupportedEncoding(checkpoint, encoding);
	}

	const messageHex = normalizeHexString(checkpoint.messageHex, 'messageHex', checkpoint.name, 32);
	const digestHex = normalizeHexString(checkpoint.digestHex, 'digestHex', checkpoint.name, 32);
	if (messageHex.toLowerCase() !== digestHex.toLowerCase()) {
		throw new SoulBootstrapSigningPlanError({
			code: 'digest_message_mismatch',
			message: 'Soul bootstrap hex-bytes signing requires messageHex and digestHex to match.',
			checkpointName: checkpoint.name,
			field: 'digestHex',
		});
	}

	return {
		method: SIGNING_METHOD_EIP191_PERSONAL_SIGN,
		messageEncoding: MESSAGE_ENCODING_HEX_BYTES,
		message: normalizeNullableString(checkpoint.message),
		messageHex,
		digestHex,
		canonicalJson: normalizeRequiredString(
			checkpoint.canonicalJson,
			'canonicalJson',
			checkpoint.name
		),
		signerAddress,
	};
}

function assertSigningMethod(checkpoint: SoulBootstrapSigningCheckpoint): void {
	const signingMethod = normalizeRequiredString(
		checkpoint.signingMethod,
		'signingMethod',
		checkpoint.name
	);
	if (signingMethod !== SIGNING_METHOD_EIP191_PERSONAL_SIGN) {
		throw new SoulBootstrapSigningPlanError({
			code: 'unsupported_signing_method',
			message: `Unsupported soul bootstrap signing method ${signingMethod}.`,
			checkpointName: checkpoint.name,
			field: 'signingMethod',
		});
	}
}

function unsupportedEncoding(
	checkpoint: SoulBootstrapSigningCheckpoint,
	encoding: string
): SoulBootstrapSigningPlanError {
	return new SoulBootstrapSigningPlanError({
		code: 'unsupported_message_encoding',
		message: `Unsupported soul bootstrap message encoding ${encoding}.`,
		checkpointName: checkpoint.name,
		field: 'messageEncoding',
	});
}

function requireSupportedVersion(checkpoint: SoulBootstrapSigningCheckpoint): string {
	const version = normalizeRequiredString(checkpoint.version, 'version', checkpoint.name);
	if (version !== '1') {
		throw new SoulBootstrapSigningPlanError({
			code: 'unsupported_version',
			message: `Unsupported soul bootstrap signing checkpoint version ${version}.`,
			checkpointName: checkpoint.name,
			field: 'version',
		});
	}
	return version;
}

function parseFinalizeRequestTemplate(
	raw: string,
	checkpointName: string,
	checkpoint: SoulBootstrapSigningCheckpoint
): SoulBootstrapFinalizeRequestTemplate {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch (cause) {
		throw new SoulBootstrapSigningPlanError({
			code: 'malformed_template',
			message: 'Finalize request template is not valid JSON.',
			checkpointName,
			field: 'finalizeRequestTemplateJson',
			cause,
		});
	}

	if (!isRecord(parsed)) {
		throw new SoulBootstrapSigningPlanError({
			code: 'malformed_template',
			message: 'Finalize request template must be a JSON object.',
			checkpointName,
			field: 'finalizeRequestTemplateJson',
		});
	}

	const boundarySignatures = parsed['boundary_signatures'];
	if (!isStringRecord(boundarySignatures) || Object.keys(boundarySignatures).length === 0) {
		throw missingTemplateField(checkpointName, 'boundary_signatures');
	}
	const issuedAt = requireTemplateString(parsed, checkpointName, 'issued_at');
	const expectedVersion = requireTemplateNumber(parsed, checkpointName, 'expected_version');
	const selfAttestation = requireTemplateString(parsed, checkpointName, 'self_attestation', true);

	const checkpointIssuedAt = normalizeRequiredString(
		checkpoint.issuedAt,
		'issuedAt',
		checkpointName
	);
	if (checkpointIssuedAt !== issuedAt) {
		throw new SoulBootstrapSigningPlanError({
			code: 'missing_template_field',
			message: 'Finalize template issued_at does not match checkpoint issuedAt.',
			checkpointName,
			field: 'finalizeRequestTemplateJson.issued_at',
		});
	}

	return {
		boundarySignaturesJson: JSON.stringify(boundarySignatures),
		issuedAt,
		expectedVersion,
		selfAttestation,
	};
}

function requireTemplateString(
	template: Record<string, unknown>,
	checkpointName: string,
	field: string,
	allowEmpty = false
): string {
	const value = template[field];
	if (typeof value !== 'string') {
		throw missingTemplateField(checkpointName, field);
	}
	const normalized = value.trim();
	if (!allowEmpty && normalized === '') {
		throw missingTemplateField(checkpointName, field);
	}
	return normalized;
}

function requireTemplateNumber(
	template: Record<string, unknown>,
	checkpointName: string,
	field: string
): number {
	return requireNumberField(template[field], field, checkpointName, 'missing_template_field');
}

function missingTemplateField(
	checkpointName: string,
	field: string
): SoulBootstrapSigningPlanError {
	return new SoulBootstrapSigningPlanError({
		code: 'missing_template_field',
		message: `Finalize request template is missing ${field}.`,
		checkpointName,
		field: `finalizeRequestTemplateJson.${field}`,
	});
}

function resolveSoulBootstrapState(source: SoulBootstrapSigningPlanSource): SoulBootstrapState {
	if (isSoulBootstrapState(source)) {
		return source;
	}

	const candidate = 'state' in source ? source.state : null;
	if (candidate && isSoulBootstrapState(candidate)) {
		return candidate;
	}

	throw new SoulBootstrapSigningPlanError({
		code: 'missing_state',
		message: 'Soul bootstrap signing plans require a bootstrap state with signing checkpoints.',
	});
}

function isSoulBootstrapState(value: unknown): value is SoulBootstrapState {
	return isRecord(value) && Array.isArray(value['signingCheckpoints']);
}

function requireRegistrationId(state: SoulBootstrapState, checkpointName: string): string {
	return normalizeRequiredString(
		state.hostRegistrationId,
		'hostRegistrationId',
		checkpointName,
		'missing_registration'
	);
}

function requireCorrelation(
	state: SoulBootstrapState,
	idempotencyField: keyof Pick<
		SoulBootstrapCorrelationState,
		| 'walletVerificationIdempotencyKey'
		| 'principalDeclarationIdempotencyKey'
		| 'finalizeIdempotencyKey'
	>,
	checkpointName: string
): { correlationKey: string; idempotencyKey: string } {
	const correlation = state.correlation;
	if (!correlation) {
		throw new SoulBootstrapSigningPlanError({
			code: 'missing_correlation',
			message: 'Soul bootstrap signing plan requires correlation state.',
			checkpointName,
			field: 'correlation',
		});
	}

	return {
		correlationKey: normalizeRequiredString(
			correlation.correlationKey,
			'correlation.correlationKey',
			checkpointName,
			'missing_correlation'
		),
		idempotencyKey: normalizeRequiredString(
			correlation[idempotencyField],
			`correlation.${idempotencyField}`,
			checkpointName,
			'missing_correlation'
		),
	};
}

function requireSignature(signature: string, checkpointName: string, field: string): string {
	const normalized = signature.trim();
	if (normalized === '') {
		throw new SoulBootstrapSigningPlanError({
			code: 'missing_signature',
			message: `Soul bootstrap signing plan requires ${field}.`,
			checkpointName,
			field,
		});
	}
	return normalized;
}

function normalizeRequiredString(
	value: string | null | undefined,
	field: string,
	checkpointName?: string,
	code: SoulBootstrapSigningPlanErrorCode = 'missing_payload'
): string {
	const normalized = value?.trim() ?? '';
	if (normalized === '') {
		throw new SoulBootstrapSigningPlanError({
			code,
			message: `Soul bootstrap signing plan requires ${field}.`,
			checkpointName,
			field,
		});
	}
	return normalized;
}

function normalizeNullableString(value: string | null | undefined): string | null {
	const normalized = value?.trim() ?? '';
	return normalized === '' ? null : normalized;
}

function normalizeHexString(
	value: string | null | undefined,
	field: string,
	checkpointName: string,
	expectedBytes?: number
): SoulBootstrapHexString {
	const normalized = normalizeRequiredString(value, field, checkpointName);
	if (!/^0x[0-9a-fA-F]+$/.test(normalized) || normalized.length % 2 !== 0) {
		throw new SoulBootstrapSigningPlanError({
			code: 'malformed_hex',
			message: `Soul bootstrap signing payload field ${field} is not valid 0x-prefixed hex.`,
			checkpointName,
			field,
		});
	}
	if (expectedBytes !== undefined && normalized.length !== 2 + expectedBytes * 2) {
		throw new SoulBootstrapSigningPlanError({
			code: 'malformed_hex',
			message: `Soul bootstrap signing payload field ${field} must be ${expectedBytes} bytes.`,
			checkpointName,
			field,
		});
	}
	return normalized as SoulBootstrapHexString;
}

function requireNumberField(
	value: unknown,
	field: string,
	checkpointName: string,
	code: SoulBootstrapSigningPlanErrorCode
): number {
	if (!Number.isInteger(value) || (value as number) < 0) {
		throw new SoulBootstrapSigningPlanError({
			code,
			message: `Soul bootstrap signing plan requires numeric ${field}.`,
			checkpointName,
			field,
		});
	}
	return value as number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
	return (
		isRecord(value) &&
		Object.values(value).every((entry) => typeof entry === 'string' && entry.trim() !== '')
	);
}
