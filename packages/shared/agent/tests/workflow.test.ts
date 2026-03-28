import { describe, expect, it } from 'vitest';
import {
	AGENT_WORKFLOW_PHASES,
	AGENT_WORKFLOW_PHASE_DEFINITIONS,
	AGENT_WORKFLOW_SLOT_NAMES,
	AGENT_WORKFLOW_STATE_NAMES,
	getAgentWorkflowPhaseDefinition,
} from '../src/index.js';

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
});
