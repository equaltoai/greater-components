<script lang="ts">
	import type { AgentWorkflowPhase, AgentWorkflowState } from './workflow.js';
	import {
		formatAgentWorkflowLabel,
		getAgentWorkflowTone,
		type AgentSurfaceTone,
	} from './surfaces.js';

	interface Props {
		label?: string;
		phase?: AgentWorkflowPhase;
		state?: AgentWorkflowState | string;
		tone?: AgentSurfaceTone;
		emphasis?: 'soft' | 'solid';
		class?: string;
	}

	let { label, phase, state, tone, emphasis = 'soft', class: className = '' }: Props = $props();

	const displayLabel = $derived(
		label ? formatAgentWorkflowLabel(label) : formatAgentWorkflowLabel(state ?? phase ?? 'pending')
	);
	const resolvedTone = $derived(tone ?? getAgentWorkflowTone(state ?? phase ?? 'pending'));
</script>

<span
	class={`agent-state-badge agent-state-badge--${resolvedTone} agent-state-badge--${emphasis} ${className}`}
>
	{displayLabel}
</span>

<style>
	.agent-state-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.agent-state-badge--soft {
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
	}

	.agent-state-badge--solid {
		color: white;
	}

	.agent-state-badge--accent {
		color: var(--gr-color-primary-700);
		background: color-mix(in srgb, var(--gr-color-primary-100) 78%, white 22%);
	}

	.agent-state-badge--accent.agent-state-badge--solid {
		background: var(--gr-color-primary-600);
	}

	.agent-state-badge--success {
		color: var(--gr-color-success-700);
		background: color-mix(in srgb, var(--gr-color-success-100) 78%, white 22%);
	}

	.agent-state-badge--success.agent-state-badge--solid {
		background: var(--gr-color-success-600);
	}

	.agent-state-badge--warning {
		color: var(--gr-color-warning-700);
		background: color-mix(in srgb, var(--gr-color-warning-100) 76%, white 24%);
	}

	.agent-state-badge--warning.agent-state-badge--solid {
		background: var(--gr-color-warning-600);
	}

	.agent-state-badge--critical {
		color: var(--gr-color-error-700);
		background: color-mix(in srgb, var(--gr-color-error-100) 82%, white 18%);
	}

	.agent-state-badge--critical.agent-state-badge--solid {
		background: var(--gr-color-error-600);
	}

	.agent-state-badge--neutral {
		color: var(--gr-semantic-foreground-secondary);
		background: var(--gr-semantic-background-secondary);
	}

	.agent-state-badge--neutral.agent-state-badge--solid {
		background: var(--gr-color-gray-700);
	}
</style>
