import { describe, expect, expectTypeOf, it } from 'vitest';
import {
	AGENT_WORKFLOW_PHASES,
	AGENT_WORKFLOW_PHASE_DEFINITIONS,
	AGENT_WORKFLOW_SLOT_NAMES,
	AGENT_WORKFLOW_STATE_NAMES,
	getAgentWorkflowPhaseDefinition,
} from '../src/index.js';
import type { AgentWorkflowEnvelope } from '../src/index.js';

describe('AGENT_WORKFLOW_PHASE_DEFINITIONS', () => {
	it('freezes the lifecycle order for downstream consumers', () => {
		expect(AGENT_WORKFLOW_PHASES).toEqual([
			'request',
			'review',
			'declaration',
			'signing',
			'graduation',
			'continuity',
		]);
	});

	it('documents every phase with both human and llm consumption in mind', () => {
		for (const definition of AGENT_WORKFLOW_PHASE_DEFINITIONS) {
			expect(definition.supportedConsumers).toEqual(expect.arrayContaining(['human', 'llm']));
			expect(definition.summary.length).toBeGreaterThan(20);
		}
	});

	it('keeps every slot phase-prefixed and globally unique', () => {
		expect(AGENT_WORKFLOW_SLOT_NAMES).toHaveLength(new Set(AGENT_WORKFLOW_SLOT_NAMES).size);
		expect(
			AGENT_WORKFLOW_SLOT_NAMES.every((name) =>
				AGENT_WORKFLOW_PHASES.includes(name.split('.')[0] as (typeof AGENT_WORKFLOW_PHASES)[number])
			)
		).toBe(true);
	});

	it('keeps every state phase-prefixed and globally unique', () => {
		expect(AGENT_WORKFLOW_STATE_NAMES).toHaveLength(new Set(AGENT_WORKFLOW_STATE_NAMES).size);
		expect(
			AGENT_WORKFLOW_STATE_NAMES.every((name) =>
				AGENT_WORKFLOW_PHASES.includes(name.split('.')[0] as (typeof AGENT_WORKFLOW_PHASES)[number])
			)
		).toBe(true);
	});

	it('gives every phase at least one input slot, one output slot, and one documented state', () => {
		for (const definition of AGENT_WORKFLOW_PHASE_DEFINITIONS) {
			expect(definition.inputSlots.length).toBeGreaterThan(0);
			expect(definition.outputSlots.length).toBeGreaterThan(0);
			expect(definition.states.length).toBeGreaterThan(0);
		}
	});

	it('allows downstream code to look up a phase definition by phase key', () => {
		expect(getAgentWorkflowPhaseDefinition('graduation')).toMatchObject({
			phase: 'graduation',
			title: 'Graduation',
		});
	});

	it('ties workflow envelopes to phase-specific states and slots at the type level', () => {
		const requestEnvelope: AgentWorkflowEnvelope<'request'> = {
			id: 'req-1',
			phase: 'request',
			state: 'request.submitted',
			title: 'Request intake',
			summary: 'Ready for triage',
			slots: {
				'request.summary': 'Ship the new workflow shell',
				'request.routeDecision': 'send-to-review',
			},
		};

		expectTypeOf(requestEnvelope.state).toEqualTypeOf<
			| 'request.draft'
			| 'request.submitted'
			| 'request.triaged'
			| 'request.accepted'
			| 'request.declined'
		>();
		expectTypeOf(requestEnvelope.slots).toEqualTypeOf<
			Partial<
				Record<
					'request.summary' | 'request.constraints' | 'request.artifacts' | 'request.routeDecision',
					unknown
				>
			>
		>();

		// @ts-expect-error Request envelopes cannot carry cross-phase states.
		const invalidRequestState: AgentWorkflowEnvelope<'request'> = {
			...requestEnvelope,
			state: 'graduation.ready',
		};
		void invalidRequestState;

		// @ts-expect-error Request envelopes cannot carry continuity slots.
		const invalidRequestSlot: AgentWorkflowEnvelope<'request'> = {
			...requestEnvelope,
			slots: {
				'continuity.feedbackLoop': 'wrong phase',
			},
		};
		void invalidRequestSlot;
	});
});
