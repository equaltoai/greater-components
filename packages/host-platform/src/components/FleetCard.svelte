<!--
@component
FleetCard — composed instance / fleet card for hosted-platform dashboards.

Renders a `<section>` landmark with:
- A header showing the instance name + region + version + status badge
- An optional description paragraph
- An optional metadata `<dl>` (description list) with `<dt>` / `<dd>` rows
- Optional cost / activity slots (typically containing `CostGauge` / `ActivitySparkline`)
- Optional actions slot (CTAs)
- Optional leading icon slot (`aria-hidden`)

Strict-CSP safe: no inline event handlers; no inline style attributes; status
is communicated by an icon glyph + text alongside any color tinting (never
color-only).

@example
```svelte
<FleetCard
	name="lesser.example"
	region="us-east-1"
	version="v1.4.12"
	status="healthy"
	metadata={[
		{ key: 'Users', value: '1,243' },
		{ key: 'Posts / day', value: '8,901' },
	]}
>
	{#snippet cost()}<CostGauge current={42.5} limit={100} currency="USD" />{/snippet}
	{#snippet activity()}<ActivitySparkline data={[3, 8, 5, 12, 9, 14, 10]} label="Posts/hour" />{/snippet}
	{#snippet actions()}<button type="button">Manage</button>{/snippet}
</FleetCard>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type { FleetCardMetadataItem, FleetCardStatus, FleetCardVariant } from '../types.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** Required visible name of the instance / fleet. @public */
		name: string;

		/** Optional slug / identifier rendered subtly under the name. @public */
		slug?: string;

		/** Optional region label (e.g. "us-east-1"). @public */
		region?: string;

		/** Optional version label (e.g. "v1.4.12"). @public */
		version?: string;

		/**
		 * Status drives the badge icon + accessible name. Defaults to `'unknown'`.
		 * Never color-only — every status has an associated glyph and text label.
		 * @public
		 */
		status?: FleetCardStatus;

		/**
		 * Override the visible / accessible status label. When omitted, the label
		 * is derived from `status` (e.g. `'healthy'` → "Healthy").
		 * @public
		 */
		statusLabel?: string;

		/** Optional supporting description paragraph. @public */
		description?: string;

		/** Optional metadata rows rendered in a `<dl>`. @public */
		metadata?: FleetCardMetadataItem[];

		/** Visual variant. @public */
		variant?: FleetCardVariant;

		/** Heading level for the card title. Defaults to 3 so it nests under page titles. @public */
		headerLevel?: 1 | 2 | 3 | 4 | 5 | 6;

		/** Additional CSS classes. @public */
		class?: string;

		/** Leading icon snippet (rendered with `aria-hidden`). @public */
		icon?: Snippet;

		/** Cost slot — typically a `CostGauge`. @public */
		cost?: Snippet;

		/** Activity slot — typically an `ActivitySparkline`. @public */
		activity?: Snippet;

		/** Actions slot — buttons / links. Wrapped in `<div role="group">`. @public */
		actions?: Snippet;
	}

	let {
		name,
		slug,
		region,
		version,
		status = 'unknown',
		statusLabel,
		description,
		metadata,
		variant = 'default',
		headerLevel = 3,
		class: className = '',
		icon,
		cost,
		activity,
		actions,
		'aria-labelledby': ariaLabelledby,
		'aria-label': ariaLabel,
		style: _style,
		...restProps
	}: Props = $props();

	const stableId = useStableId('host-fleet-card');
	const titleId = $derived(stableId.value ? `${stableId.value}-title` : undefined);
	const statusId = $derived(stableId.value ? `${stableId.value}-status` : undefined);
	const resolvedLabelledby = $derived(ariaLabelledby ?? titleId);

	const statusInfo = $derived.by<{ label: string; icon: string }>(() => {
		const map: Record<FleetCardStatus, { label: string; icon: string }> = {
			healthy: { label: 'Healthy', icon: '●' },
			provisioning: { label: 'Provisioning', icon: '◌' },
			warning: { label: 'Warning', icon: '▲' },
			degraded: { label: 'Degraded', icon: '▼' },
			offline: { label: 'Offline', icon: '■' },
			unknown: { label: 'Unknown', icon: '?' },
		};
		const entry = map[status];
		return { label: statusLabel ?? entry.label, icon: entry.icon };
	});

	const rootClass = $derived(() =>
		[
			'gr-host-platform-fleet-card',
			`gr-host-platform-fleet-card--variant-${variant}`,
			`gr-host-platform-fleet-card--status-${status}`,
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<section
	class={rootClass()}
	aria-labelledby={resolvedLabelledby}
	aria-label={!resolvedLabelledby ? ariaLabel : undefined}
	{...restProps}
>
	<header class="gr-host-platform-fleet-card__header">
		{#if icon}
			<div class="gr-host-platform-fleet-card__icon" aria-hidden="true">{@render icon()}</div>
		{/if}
		<div class="gr-host-platform-fleet-card__identity">
			{#if headerLevel === 1}
				<h1 id={titleId} class="gr-host-platform-fleet-card__title">{name}</h1>
			{:else if headerLevel === 2}
				<h2 id={titleId} class="gr-host-platform-fleet-card__title">{name}</h2>
			{:else if headerLevel === 3}
				<h3 id={titleId} class="gr-host-platform-fleet-card__title">{name}</h3>
			{:else if headerLevel === 4}
				<h4 id={titleId} class="gr-host-platform-fleet-card__title">{name}</h4>
			{:else if headerLevel === 5}
				<h5 id={titleId} class="gr-host-platform-fleet-card__title">{name}</h5>
			{:else}
				<h6 id={titleId} class="gr-host-platform-fleet-card__title">{name}</h6>
			{/if}
			{#if slug || region || version}
				<p class="gr-host-platform-fleet-card__subtitle">
					{#if slug}<span class="gr-host-platform-fleet-card__slug">{slug}</span>{/if}
					{#if region}
						<span class="gr-host-platform-fleet-card__region" aria-label="Region">
							{region}
						</span>
					{/if}
					{#if version}
						<span class="gr-host-platform-fleet-card__version" aria-label="Version">
							{version}
						</span>
					{/if}
				</p>
			{/if}
		</div>
		<div
			id={statusId}
			class="gr-host-platform-fleet-card__status gr-host-platform-fleet-card__status--{status}"
			role="status"
			aria-label={`Status: ${statusInfo.label}`}
		>
			<span class="gr-host-platform-fleet-card__status-icon" aria-hidden="true">
				{statusInfo.icon}
			</span>
			<span class="gr-host-platform-fleet-card__status-label">{statusInfo.label}</span>
		</div>
	</header>

	{#if description}
		<p class="gr-host-platform-fleet-card__description">{description}</p>
	{/if}

	{#if metadata && metadata.length > 0}
		<dl class="gr-host-platform-fleet-card__metadata">
			{#each metadata as row, index (`${row.key}-${index}`)}
				<div class="gr-host-platform-fleet-card__metadata-row">
					<dt class="gr-host-platform-fleet-card__metadata-key">{row.key}</dt>
					<dd class="gr-host-platform-fleet-card__metadata-value">{row.value}</dd>
				</div>
			{/each}
		</dl>
	{/if}

	{#if cost || activity}
		<div class="gr-host-platform-fleet-card__signals">
			{#if cost}
				<div class="gr-host-platform-fleet-card__signal gr-host-platform-fleet-card__signal--cost">
					{@render cost()}
				</div>
			{/if}
			{#if activity}
				<div
					class="gr-host-platform-fleet-card__signal gr-host-platform-fleet-card__signal--activity"
				>
					{@render activity()}
				</div>
			{/if}
		</div>
	{/if}

	{#if actions}
		<div class="gr-host-platform-fleet-card__actions" role="group" aria-label="Fleet actions">
			{@render actions()}
		</div>
	{/if}
</section>
