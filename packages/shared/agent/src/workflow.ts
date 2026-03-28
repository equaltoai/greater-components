export const AGENT_WORKFLOW_PHASES = [
	'request',
	'review',
	'declaration',
	'signing',
	'graduation',
	'continuity',
] as const;

export type AgentWorkflowPhase = (typeof AGENT_WORKFLOW_PHASES)[number];

export const AGENT_WORKFLOW_CONSUMERS = ['human', 'llm', 'hybrid'] as const;

export type AgentWorkflowConsumer = (typeof AGENT_WORKFLOW_CONSUMERS)[number];

export type AgentWorkflowValueKind =
	| 'markdown'
	| 'entity-list'
	| 'decision'
	| 'checklist'
	| 'timestamp'
	| 'metrics'
	| 'links';

export interface AgentWorkflowSlotDefinition {
	name: `${AgentWorkflowPhase}.${string}`;
	label: string;
	description: string;
	valueKind: AgentWorkflowValueKind;
	required: boolean;
	preferredConsumers: readonly AgentWorkflowConsumer[];
}

export interface AgentWorkflowStateDefinition {
	value: string;
	label: string;
	description: string;
}

export interface AgentWorkflowPhaseDefinition {
	phase: AgentWorkflowPhase;
	title: string;
	objective: string;
	summary: string;
	supportedConsumers: readonly AgentWorkflowConsumer[];
	inputSlots: readonly AgentWorkflowSlotDefinition[];
	outputSlots: readonly AgentWorkflowSlotDefinition[];
	states: readonly AgentWorkflowStateDefinition[];
}

export type AgentWorkflowSlotName = AgentWorkflowSlotDefinition['name'];
export type AgentWorkflowState = AgentWorkflowStateDefinition['value'];

export interface AgentWorkflowEnvelope {
	id: string;
	phase: AgentWorkflowPhase;
	state: AgentWorkflowState;
	title: string;
	summary: string;
	slots: Partial<Record<AgentWorkflowSlotName, unknown>>;
}

export const AGENT_WORKFLOW_PHASE_DEFINITIONS = [
	{
		phase: 'request',
		title: 'Request',
		objective:
			'Capture the inbound objective with enough context for humans and agents to triage it safely.',
		summary:
			'Intake, normalize, and route the work request without assuming the final workflow owner.',
		supportedConsumers: ['human', 'llm', 'hybrid'],
		inputSlots: [
			{
				name: 'request.summary',
				label: 'Request Summary',
				description: 'One-paragraph brief of the work being asked for.',
				valueKind: 'markdown',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'request.constraints',
				label: 'Constraints',
				description: 'Deadlines, blockers, budget, policy, or environmental constraints.',
				valueKind: 'markdown',
				required: false,
				preferredConsumers: ['human', 'llm'],
			},
		],
		outputSlots: [
			{
				name: 'request.artifacts',
				label: 'Request Artifacts',
				description:
					'Links, attachments, or prior references that should travel with the workflow.',
				valueKind: 'links',
				required: false,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'request.routeDecision',
				label: 'Route Decision',
				description: 'The chosen next stop for the request once triage is complete.',
				valueKind: 'decision',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		states: [
			{
				value: 'request.draft',
				label: 'Draft',
				description: 'The request exists but has not been submitted.',
			},
			{
				value: 'request.submitted',
				label: 'Submitted',
				description: 'The request is ready for intake and triage.',
			},
			{
				value: 'request.triaged',
				label: 'Triaged',
				description: 'The request has enough context to route downstream.',
			},
			{
				value: 'request.accepted',
				label: 'Accepted',
				description: 'The request is accepted into the workflow pipeline.',
			},
			{
				value: 'request.declined',
				label: 'Declined',
				description: 'The request was rejected or closed without proceeding.',
			},
		],
	},
	{
		phase: 'review',
		title: 'Review',
		objective:
			'Evaluate the request or work-in-progress and capture findings that can drive decisions.',
		summary:
			'Turn evidence into a structured decision point without coupling review logic to one screen.',
		supportedConsumers: ['human', 'llm', 'hybrid'],
		inputSlots: [
			{
				name: 'review.scope',
				label: 'Review Scope',
				description: 'The criteria, standards, or areas under review.',
				valueKind: 'markdown',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'review.evidence',
				label: 'Evidence',
				description: 'Structured evidence that supports the review judgment.',
				valueKind: 'links',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		outputSlots: [
			{
				name: 'review.findings',
				label: 'Findings',
				description: 'Key findings and notable issues discovered during review.',
				valueKind: 'markdown',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'review.decision',
				label: 'Review Decision',
				description: 'Approve, request changes, or block the current item.',
				valueKind: 'decision',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		states: [
			{
				value: 'review.queued',
				label: 'Queued',
				description: 'Waiting for a reviewer or review window.',
			},
			{ value: 'review.in_review', label: 'In Review', description: 'Actively being evaluated.' },
			{
				value: 'review.changes_requested',
				label: 'Changes Requested',
				description: 'Needs follow-up work before approval.',
			},
			{
				value: 'review.approved',
				label: 'Approved',
				description: 'Review passed and can advance.',
			},
			{
				value: 'review.blocked',
				label: 'Blocked',
				description: 'Cannot advance until a blocking issue is resolved.',
			},
		],
	},
	{
		phase: 'declaration',
		title: 'Declaration',
		objective: 'State the official claim, status, or readiness posture in a reusable format.',
		summary:
			'Capture the authoritative statement that downstream signing and launch steps rely on.',
		supportedConsumers: ['human', 'llm', 'hybrid'],
		inputSlots: [
			{
				name: 'declaration.statement',
				label: 'Declaration Statement',
				description: 'The formal statement or claim being made.',
				valueKind: 'markdown',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'declaration.risks',
				label: 'Declaration Risks',
				description: 'Residual risks and caveats attached to the declaration.',
				valueKind: 'markdown',
				required: false,
				preferredConsumers: ['human', 'llm'],
			},
		],
		outputSlots: [
			{
				name: 'declaration.scope',
				label: 'Declared Scope',
				description: 'The systems, artifacts, or boundaries covered by the declaration.',
				valueKind: 'entity-list',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'declaration.confidence',
				label: 'Confidence',
				description: 'Confidence statement or confidence rubric attached to the declaration.',
				valueKind: 'decision',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		states: [
			{
				value: 'declaration.draft',
				label: 'Draft',
				description: 'Statement is being composed or revised.',
			},
			{
				value: 'declaration.ready',
				label: 'Ready for Attestation',
				description: 'Prepared for formal acknowledgement.',
			},
			{
				value: 'declaration.attested',
				label: 'Attested',
				description: 'Formally acknowledged and ready for signing.',
			},
			{
				value: 'declaration.superseded',
				label: 'Superseded',
				description: 'Replaced by a newer declaration.',
			},
		],
	},
	{
		phase: 'signing',
		title: 'Signing',
		objective: 'Collect the approvals or signatures that make the declaration actionable.',
		summary: 'Track who must sign, what they sign, and when the signature becomes effective.',
		supportedConsumers: ['human', 'llm', 'hybrid'],
		inputSlots: [
			{
				name: 'signing.signatories',
				label: 'Signatories',
				description: 'People or agents who must approve the declaration.',
				valueKind: 'entity-list',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'signing.approvalMemo',
				label: 'Approval Memo',
				description: 'Memo that explains the signing request and final approval basis.',
				valueKind: 'markdown',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		outputSlots: [
			{
				name: 'signing.auditTrail',
				label: 'Audit Trail',
				description: 'Timestamped trail of who signed and what evidence they used.',
				valueKind: 'links',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'signing.effectiveAt',
				label: 'Effective At',
				description: 'Timestamp when the signed declaration becomes effective.',
				valueKind: 'timestamp',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		states: [
			{
				value: 'signing.preparing',
				label: 'Preparing',
				description: 'Sign-off packet is being assembled.',
			},
			{
				value: 'signing.pending',
				label: 'Pending Signature',
				description: 'Waiting on at least one signer.',
			},
			{
				value: 'signing.signed',
				label: 'Signed',
				description: 'All required signatories have approved.',
			},
			{
				value: 'signing.expired',
				label: 'Expired',
				description: 'The signing window closed before completion.',
			},
		],
	},
	{
		phase: 'graduation',
		title: 'Graduation',
		objective:
			'Verify readiness and complete the promotion from candidate state into active operation.',
		summary:
			'Bundle launch readiness, promotion gating, and rollback posture into one reusable contract.',
		supportedConsumers: ['human', 'llm', 'hybrid'],
		inputSlots: [
			{
				name: 'graduation.checklist',
				label: 'Graduation Checklist',
				description: 'Checklist of readiness steps that must be completed before launch.',
				valueKind: 'checklist',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'graduation.rollbackPlan',
				label: 'Rollback Plan',
				description: 'Fallback plan if the promotion fails.',
				valueKind: 'markdown',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		outputSlots: [
			{
				name: 'graduation.readiness',
				label: 'Readiness Verdict',
				description: 'Final readiness call produced by the graduation gate.',
				valueKind: 'decision',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'graduation.launchWindow',
				label: 'Launch Window',
				description: 'Scheduled launch or promotion window for the change.',
				valueKind: 'timestamp',
				required: false,
				preferredConsumers: ['human', 'llm'],
			},
		],
		states: [
			{
				value: 'graduation.planning',
				label: 'Planning',
				description: 'Preparing the promotion plan and checklist.',
			},
			{
				value: 'graduation.verifying',
				label: 'Verifying',
				description: 'Actively validating readiness gates.',
			},
			{
				value: 'graduation.ready',
				label: 'Ready',
				description: 'Ready to graduate when the launch window opens.',
			},
			{
				value: 'graduation.launched',
				label: 'Launched',
				description: 'Promotion completed successfully.',
			},
			{
				value: 'graduation.rolled_back',
				label: 'Rolled Back',
				description: 'Promotion was reversed after launch.',
			},
		],
	},
	{
		phase: 'continuity',
		title: 'Continuity',
		objective: 'Carry the work forward through monitoring, handoff, and ongoing stewardship.',
		summary:
			'Keep ownership and post-launch care reusable rather than hardcoded into one application shell.',
		supportedConsumers: ['human', 'llm', 'hybrid'],
		inputSlots: [
			{
				name: 'continuity.owner',
				label: 'Continuity Owner',
				description: 'The owner or team responsible for post-launch stewardship.',
				valueKind: 'entity-list',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'continuity.monitoring',
				label: 'Monitoring Plan',
				description: 'Signals, alerts, and dashboards used to watch the change in operation.',
				valueKind: 'metrics',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		outputSlots: [
			{
				name: 'continuity.playbook',
				label: 'Continuity Playbook',
				description: 'Operating playbook, runbook, or handoff packet for ongoing care.',
				valueKind: 'links',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
			{
				name: 'continuity.feedbackLoop',
				label: 'Feedback Loop',
				description: 'How observations flow back into the next request or review cycle.',
				valueKind: 'markdown',
				required: true,
				preferredConsumers: ['human', 'llm'],
			},
		],
		states: [
			{
				value: 'continuity.observing',
				label: 'Observing',
				description: 'Monitoring the newly launched change.',
			},
			{
				value: 'continuity.stable',
				label: 'Stable',
				description: 'The change is healthy and under routine stewardship.',
			},
			{
				value: 'continuity.tuning',
				label: 'Tuning',
				description: 'Making follow-up adjustments based on observed behavior.',
			},
			{
				value: 'continuity.handoff_ready',
				label: 'Handoff Ready',
				description: 'Prepared for longer-term ownership transfer.',
			},
			{
				value: 'continuity.retired',
				label: 'Retired',
				description: 'The continuity record is closed or archived.',
			},
		],
	},
] as const satisfies readonly AgentWorkflowPhaseDefinition[];

export const AGENT_WORKFLOW_SLOT_NAMES = AGENT_WORKFLOW_PHASE_DEFINITIONS.flatMap((definition) => [
	...definition.inputSlots.map((slot) => slot.name),
	...definition.outputSlots.map((slot) => slot.name),
]) as AgentWorkflowSlotName[];

export const AGENT_WORKFLOW_STATE_NAMES = AGENT_WORKFLOW_PHASE_DEFINITIONS.flatMap((definition) =>
	definition.states.map((state) => state.value)
) as AgentWorkflowState[];

export function getAgentWorkflowPhaseDefinition(
	phase: AgentWorkflowPhase
): AgentWorkflowPhaseDefinition {
	const definition = AGENT_WORKFLOW_PHASE_DEFINITIONS.find(
		(candidate) => candidate.phase === phase
	);

	if (!definition) {
		throw new Error(`Unknown workflow phase: ${phase}`);
	}

	return definition;
}
