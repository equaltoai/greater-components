import {
	AGENT_WORKFLOW_PHASE_DEFINITIONS,
	type AgentWorkflowPhase,
	type AgentWorkflowState,
} from './workflow.js';

export type AgentSurfaceTone = 'neutral' | 'accent' | 'success' | 'warning' | 'critical';

export interface AgentSurfaceMetric {
	label: string;
	value: string | number;
	detail?: string;
}

export interface AgentSurfaceActor {
	id: string;
	name: string;
	role: string;
	handle?: string;
	avatarLabel?: string;
	statusLabel?: string;
}

export interface AgentSurfaceArtifact {
	id: string;
	title: string;
	description?: string;
	href?: string;
	emphasis?: 'reference' | 'decision' | 'deliverable';
}

export interface AgentIdentityCardData {
	id: string;
	name: string;
	handle?: string;
	summary: string;
	currentPhase: AgentWorkflowPhase;
	currentState?: AgentWorkflowState;
	steward?: AgentSurfaceActor;
	tags?: readonly string[];
	metrics?: readonly AgentSurfaceMetric[];
}

export interface SoulRequestCardData {
	id: string;
	title: string;
	summary: string;
	requestedBy: AgentSurfaceActor;
	submittedAt?: string | Date;
	constraints?: readonly string[];
	artifacts?: readonly AgentSurfaceArtifact[];
	routeDecision?: string;
	currentState?: AgentWorkflowState;
}

export interface AgentLifecycleStep {
	phase: AgentWorkflowPhase;
	title?: string;
	summary?: string;
	state?: AgentWorkflowState;
	status: 'upcoming' | 'active' | 'complete' | 'blocked';
}

export interface ReviewFinding {
	id: string;
	title: string;
	detail: string;
	severity?: 'low' | 'medium' | 'high';
}

export interface ReviewDecisionCardData {
	id: string;
	title: string;
	decision: 'approved' | 'changes_requested' | 'blocked' | 'queued';
	reviewer: AgentSurfaceActor;
	decisionSummary: string;
	findings?: readonly ReviewFinding[];
	evidence?: readonly AgentSurfaceArtifact[];
}

export interface DeclarationPreviewCardData {
	id: string;
	title: string;
	statement: string;
	confidence: string;
	owner?: AgentSurfaceActor;
	declaredScope: readonly string[];
	risks?: readonly string[];
	supportingArtifacts?: readonly AgentSurfaceArtifact[];
}

export interface SignatureCheckpointSigner {
	id: string;
	name: string;
	role: string;
	status: 'pending' | 'approved' | 'rejected';
	note?: string;
}

export interface SignatureCheckpointCardData {
	id: string;
	title: string;
	readinessLabel: string;
	approvalMemo?: string;
	dueAt?: string | Date;
	signers: readonly SignatureCheckpointSigner[];
}

export interface ContinuityFollowUp {
	id: string;
	title: string;
	summary: string;
	owner: AgentSurfaceActor;
	cadence?: string;
}

export interface ContinuityPanelData {
	id: string;
	title: string;
	objective: string;
	owner: AgentSurfaceActor;
	feedbackLoop: string;
	metrics?: readonly AgentSurfaceMetric[];
	followUps?: readonly ContinuityFollowUp[];
}

export interface GraduationSummaryCardData {
	id: string;
	title: string;
	readiness: 'ready' | 'watch' | 'hold';
	summary: string;
	launchOwner?: AgentSurfaceActor;
	completedMilestones?: readonly string[];
	exitCriteria?: readonly string[];
	nextStep?: string;
	metrics?: readonly AgentSurfaceMetric[];
}

export function getAgentPhaseTitle(phase: AgentWorkflowPhase): string {
	const definition = AGENT_WORKFLOW_PHASE_DEFINITIONS.find(
		(candidate) => candidate.phase === phase
	);
	return definition?.title ?? formatAgentWorkflowLabel(phase);
}

export function formatAgentWorkflowLabel(value: string): string {
	const workflowValue = value.includes('.') ? (value.split('.').pop() ?? value) : value;
	return workflowValue
		.split(/[_-]/g)
		.filter(Boolean)
		.map((segment) => segment[0].toUpperCase() + segment.slice(1))
		.join(' ');
}

export function formatAgentSurfaceDate(value?: string | Date | null): string {
	if (!value) {
		return 'Not scheduled';
	}

	const date = typeof value === 'string' ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) {
		return 'Invalid date';
	}

	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
}

export function getAgentWorkflowTone(
	value: AgentWorkflowPhase | AgentWorkflowState | string
): AgentSurfaceTone {
	if (value.includes('blocked') || value.includes('declined') || value.includes('rejected')) {
		return 'critical';
	}

	if (
		value.includes('approved') ||
		value.includes('ready') ||
		value.includes('attested') ||
		value.includes('launched') ||
		value.includes('monitoring')
	) {
		return 'success';
	}

	if (value.includes('review') || value.includes('queued') || value.includes('changes_requested')) {
		return 'warning';
	}

	if (
		value.startsWith('request') ||
		value.startsWith('declaration') ||
		value.startsWith('continuity')
	) {
		return 'accent';
	}

	return 'neutral';
}
