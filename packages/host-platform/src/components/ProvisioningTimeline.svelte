<!--
@component
ProvisioningTimeline — ordered timeline of provisioning job steps for
hosted-platform operator consoles.

Renders an `<ol>` (semantic ordered list) inside a `<section
aria-labelledby>` landmark. Each step is an `<li>` with status icon
glyph + visible text label (never color-only), description, optional
timestamp, and optional metadata. The *active* step (status='active')
also carries `aria-current="step"` so AT users hear which step is in
progress.

When the consumer supplies a `liveLog` snippet, the component wraps it
in a constrained `<section role="log" aria-live aria-atomic="false"
aria-labelledby>` region so only NEW log lines announce — never the
full backlog. `liveLogPoliteness` defaults to `'polite'`; set to
`'off'` for visible-only logs.

Strict-CSP safe: no inline event handlers, no `style` attributes, no
runtime style writes. All styling via stable `--gr-*` tokens.

@example
```svelte
<ProvisioningTimeline
	label="lesser.example provisioning"
	steps={[
		{ id: 'allocate', label: 'Allocate compute', status: 'success', timestamp: '2026-05-24T15:00:00Z' },
		{ id: 'install',  label: 'Install Lesser',   status: 'active' },
		{ id: 'migrate',  label: 'Run migrations',   status: 'pending' },
	]}
>
	{#snippet liveLog()}
		<pre>15:01:02 [allocate] node provisioned…
15:01:34 [install] downloading container…</pre>
	{/snippet}
</ProvisioningTimeline>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type {
		ProvisioningLogPoliteness,
		ProvisioningStep,
		ProvisioningStepStatus,
	} from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
		/** Required accessible name for the timeline region. @public */
		label: string;

		/** Ordered steps (renders in array order). @public */
		steps: ProvisioningStep[];

		/**
		 * Constrained live-log slot. When provided, the component wraps the
		 * rendered content in a `<section role="log">` with `aria-live` so
		 * new log lines announce politely. The consumer is responsible for
		 * APPENDING new content (the live region announces incremental
		 * changes; full re-renders are noisy).
		 * @public
		 */
		liveLog?: Snippet;

		/**
		 * Accessible name for the live-log region. Defaults to
		 * `'Live provisioning log'`. Strongly recommended to override when
		 * multiple timelines coexist on a page.
		 * @public
		 */
		liveLogLabel?: string;

		/**
		 * ARIA politeness for the live-log region. `'off'` disables
		 * announcements while keeping the visible log. Defaults to `'polite'`.
		 * @public
		 */
		liveLogPoliteness?: ProvisioningLogPoliteness;

		/** Message rendered when `steps.length === 0`. @public */
		emptyMessage?: string;

		/** Additional CSS classes. @public */
		class?: string;
	}

	let {
		label,
		steps,
		liveLog,
		liveLogLabel = 'Live provisioning log',
		liveLogPoliteness = 'polite',
		emptyMessage = 'No provisioning steps yet.',
		class: className = '',
		style: _style,
		...restProps
	}: Props = $props();

	const stableId = useStableId('host-prov-timeline');
	const labelId = $derived(stableId.value ? `${stableId.value}-label` : undefined);
	const logLabelId = $derived(stableId.value ? `${stableId.value}-log-label` : undefined);

	const statusInfo = $derived.by(() => {
		const map: Record<ProvisioningStepStatus, { icon: string; label: string }> = {
			pending: { icon: '○', label: 'Pending' },
			active: { icon: '◌', label: 'In progress' },
			success: { icon: '✓', label: 'Completed' },
			failure: { icon: '✕', label: 'Failed' },
			skipped: { icon: '—', label: 'Skipped' },
		};
		return map;
	});

	const rootClass = $derived(() =>
		['gr-host-platform-provisioning-timeline', className].filter(Boolean).join(' ')
	);

	const hasSteps = $derived(steps.length > 0);
</script>

<section class={rootClass()} aria-labelledby={labelId} {...restProps}>
	<h2 id={labelId} class="gr-sr-only">{label}</h2>

	{#if !hasSteps}
		<div class="gr-host-platform-provisioning-timeline__empty" role="status">
			{emptyMessage}
		</div>
	{:else}
		<ol class="gr-host-platform-provisioning-timeline__list">
			{#each steps as step, index (step.id)}
				{@const status = step.status ?? 'pending'}
				{@const info = statusInfo[status]}
				<li
					id={stableId.value ? `${stableId.value}-step-${step.id}` : undefined}
					class={[
						'gr-host-platform-provisioning-timeline__step',
						`gr-host-platform-provisioning-timeline__step--status-${status}`,
					].join(' ')}
					aria-current={status === 'active' ? 'step' : undefined}
				>
					<span class="gr-host-platform-provisioning-timeline__rail" aria-hidden="true">
						<span class="gr-host-platform-provisioning-timeline__marker">{info.icon}</span>
						{#if index < steps.length - 1}
							<span class="gr-host-platform-provisioning-timeline__line"></span>
						{/if}
					</span>
					<div class="gr-host-platform-provisioning-timeline__body">
						<div class="gr-host-platform-provisioning-timeline__header">
							<span class="gr-host-platform-provisioning-timeline__label">{step.label}</span>
							<span
								class="gr-host-platform-provisioning-timeline__status"
								aria-label={`Status: ${info.label}`}
							>
								<span class="gr-host-platform-provisioning-timeline__status-text">
									{info.label}
								</span>
							</span>
						</div>
						{#if step.description}
							<p class="gr-host-platform-provisioning-timeline__description">
								{step.description}
							</p>
						{/if}
						{#if step.timestamp || step.meta}
							<p class="gr-host-platform-provisioning-timeline__meta">
								{#if step.timestamp}
									<time
										class="gr-host-platform-provisioning-timeline__time"
										datetime={step.timestamp}
									>
										{step.timestamp}
									</time>
								{/if}
								{#if step.meta}
									<span class="gr-host-platform-provisioning-timeline__meta-text">
										{step.meta}
									</span>
								{/if}
							</p>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	{/if}

	{#if liveLog}
		<section
			class="gr-host-platform-provisioning-timeline__log"
			role="log"
			aria-live={liveLogPoliteness === 'off' ? undefined : liveLogPoliteness}
			aria-atomic="false"
			aria-relevant="additions"
			aria-labelledby={logLabelId}
		>
			<h3 id={logLabelId} class="gr-host-platform-provisioning-timeline__log-label">
				{liveLogLabel}
			</h3>
			<div class="gr-host-platform-provisioning-timeline__log-body">
				{@render liveLog()}
			</div>
		</section>
	{/if}
</section>
