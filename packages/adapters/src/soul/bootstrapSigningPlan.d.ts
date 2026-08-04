import type {
	FinalizeSoulBootstrapInput,
	SoulBootstrapResult,
	SoulBootstrapState,
	SoulBootstrapSurface,
	VerifySoulBootstrapPrincipalDeclarationInput,
	VerifySoulBootstrapWalletInput,
} from './bootstrap.js';
export type SoulBootstrapHexString = `0x${string}`;
export type SoulBootstrapSigningMethod = 'eip191_personal_sign';
export type SoulBootstrapMessageEncoding = 'utf8' | 'hex_bytes';
export type SoulBootstrapSigningPlanKind =
	'wallet_challenge' | 'principal_declaration' | 'finalize_self_attestation';
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
	SoulBootstrapResult | SoulBootstrapSurface | SoulBootstrapState;
export interface SoulBootstrapSigningPlanErrorOptions {
	code: SoulBootstrapSigningPlanErrorCode;
	message: string;
	checkpointName?: string;
	field?: string;
	cause?: unknown;
}
export declare class SoulBootstrapSigningPlanError extends Error {
	readonly code: SoulBootstrapSigningPlanErrorCode;
	readonly checkpointName?: string;
	readonly field?: string;
	readonly cause?: unknown;
	constructor(options: SoulBootstrapSigningPlanErrorOptions);
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
	SoulBootstrapUtf8SigningInstruction | SoulBootstrapHexBytesSigningInstruction;
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
export declare function createSoulBootstrapSigningPlans(
	source: SoulBootstrapSigningPlanSource
): readonly SoulBootstrapSigningPlan[];
export declare function createSoulBootstrapSigningPlan<TKind extends SoulBootstrapSigningPlanKind>(
	source: SoulBootstrapSigningPlanSource,
	kind: TKind
): Extract<
	SoulBootstrapSigningPlan,
	{
		kind: TKind;
	}
>;
//# sourceMappingURL=bootstrapSigningPlan.d.ts.map
