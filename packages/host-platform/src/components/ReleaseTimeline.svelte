<!--
@component
ReleaseTimeline — two-channel release-history timeline.

Renders an `<ol>` (semantic ordered list) inside a `<section
aria-labelledby>` landmark. Each release is an `<li>` with channel
badge, version, accessible date, status icon glyph + text label
(never color-only), and optional adoption percentage / count.

Two-channel presentation: when consumers want stable + beta side by
side, they pass `releases` containing items with distinct `channel`
fields. The component renders the items in their supplied order
(release-newest-first is conventional) and visually distinguishes
channels via classes. No date sorting / grouping is performed; the
component is presentational only.

Adoption metric:
- Numeric values in `[0, 1]` are formatted as `"XX%"` and exposed via
  `aria-valuetext` semantics on a `role="meter"` element inside each
  release (with a valid range [0, 1] — see CostGauge's contract
  for the meter-validity rules this also follows).
- String adoption values render as-is (e.g. `"42 of 100 instances"`).

Strict-CSP safe: no inline event handlers, no `style` attributes, no
runtime style writes. All styling via stable `--gr-*` tokens.

@example
```svelte
<ReleaseTimeline
	label="Lesser release history"
	releases={[
		{ id: 'v1412', version: 'v1.4.12', channel: 'stable', date: '2026-05-22',
		  status: 'shipped', adoption: 0.82 },
		{ id: 'v1500rc1', version: 'v1.5.0-rc.1', channel: 'beta', date: '2026-05-23',
		  status: 'in-progress', adoption: 0.05 },
	]}
/>
```
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { useStableId } from '@equaltoai/greater-components-utils';
	import type { ReleaseAdoptionFormatter, ReleaseStatus, ReleaseTimelineItem } from '../types.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
		/** Required accessible name for the timeline region. @public */
		label: string;

		/** Required release list (rendered in array order). @public */
		releases: ReleaseTimelineItem[];

		/**
		 * Custom date formatter. Receives the raw `date` (Date or ISO string)
		 * and returns a visible string. Defaults to `Intl.DateTimeFormat`
		 * with `'en-US'` locale + medium date style.
		 * @public
		 */
		formatDate?: (date: Date | string) => string;

		/**
		 * Custom adoption formatter. Receives the raw `adoption` and returns
		 * a visible string. When omitted, numeric adoption is formatted as
		 * `XX%` and string adoption is rendered as-is.
		 * @public
		 */
		formatAdoption?: ReleaseAdoptionFormatter;

		/** Optional locale for the default date formatter. Defaults to `'en-US'`. @public */
		locale?: string;

		/** Message rendered when `releases.length === 0`. @public */
		emptyMessage?: string;

		/** Additional CSS classes. @public */
		class?: string;

		/** Optional trailing action snippet rendered per item (e.g. release notes link). @public */
		itemActions?: Snippet<[ReleaseTimelineItem]>;
	}

	let {
		label,
		releases,
		formatDate,
		formatAdoption,
		locale = 'en-US',
		emptyMessage = 'No releases recorded yet.',
		class: className = '',
		itemActions,
		style: _style,
		...restProps
	}: Props = $props();

	const stableId = useStableId('host-release-timeline');
	const labelId = $derived(stableId.value ? `${stableId.value}-label` : undefined);

	const statusInfo = $derived.by(() => {
		const map: Record<ReleaseStatus, { icon: string; label: string }> = {
			shipped: { icon: '✓', label: 'Shipped' },
			'in-progress': { icon: '◌', label: 'Rolling out' },
			'rolled-back': { icon: '↺', label: 'Rolled back' },
			planned: { icon: '○', label: 'Planned' },
		};
		return map;
	});

	/**
	 * True when the input string represents a date that should be interpreted
	 * as a calendar day rather than a precise instant — e.g. a bare
	 * `'2026-05-22'` or any ISO string at UTC midnight (`...T00:00:00Z`).
	 *
	 * Calendar-day inputs MUST be formatted in UTC; otherwise `Intl.DateTimeFormat`
	 * applies the viewer's local timezone offset and renders the previous day
	 * in any timezone west of UTC (US, Pacific, much of the Americas). Arch
	 * flagged this regression on PR #670 — releases dated `'2026-05-22T00:00:00Z'`
	 * rendered as "May 21" in US timezones.
	 */
	function isCalendarDayString(d: string): boolean {
		// Bare `YYYY-MM-DD`.
		if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return true;
		// ISO 8601 at UTC midnight (`...T00:00:00Z` or `...T00:00:00.000Z`).
		if (/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.0+)?Z$/.test(d)) return true;
		return false;
	}

	function defaultFormatDate(d: Date | string): string {
		const isCalendarDay = typeof d === 'string' && isCalendarDayString(d);
		const date = typeof d === 'string' ? new Date(d) : d;
		if (Number.isNaN(date.getTime())) return typeof d === 'string' ? d : '';
		try {
			return new Intl.DateTimeFormat(locale, {
				dateStyle: 'medium',
				// For calendar-day inputs, format in UTC so we render the same
				// day the consumer typed (no local-timezone shift).
				timeZone: isCalendarDay ? 'UTC' : undefined,
			}).format(date);
		} catch {
			return date.toISOString().slice(0, 10);
		}
	}

	function dateIsoAttr(d: Date | string): string | undefined {
		const date = typeof d === 'string' ? new Date(d) : d;
		if (Number.isNaN(date.getTime())) return typeof d === 'string' ? d : undefined;
		return date.toISOString();
	}

	function defaultFormatAdoption(value: number | string | undefined): string | undefined {
		if (value === undefined) return undefined;
		if (typeof value === 'string') return value;
		if (!Number.isFinite(value)) return undefined;
		const clamped = Math.max(0, Math.min(1, value));
		return `${Math.round(clamped * 100)}%`;
	}

	function numericAdoption(value: number | string | undefined): number | null {
		if (typeof value !== 'number') return null;
		if (!Number.isFinite(value)) return null;
		return Math.max(0, Math.min(1, value));
	}

	const rootClass = $derived(() =>
		['gr-host-platform-release-timeline', className].filter(Boolean).join(' ')
	);

	const hasReleases = $derived(releases.length > 0);
</script>

<section class={rootClass()} aria-labelledby={labelId} {...restProps}>
	<h2 id={labelId} class="gr-sr-only">{label}</h2>

	{#if !hasReleases}
		<div class="gr-host-platform-release-timeline__empty" role="status">
			{emptyMessage}
		</div>
	{:else}
		<ol class="gr-host-platform-release-timeline__list">
			{#each releases as release (release.id)}
				{@const status = release.status ?? 'shipped'}
				{@const info = statusInfo[status]}
				{@const visibleDate = (formatDate ?? defaultFormatDate)(release.date)}
				{@const isoDate = dateIsoAttr(release.date)}
				{@const adoptionText = (formatAdoption ?? defaultFormatAdoption)(release.adoption)}
				{@const adoptionRatio = numericAdoption(release.adoption)}
				<li
					id={stableId.value ? `${stableId.value}-rel-${release.id}` : undefined}
					class={[
						'gr-host-platform-release-timeline__release',
						`gr-host-platform-release-timeline__release--status-${status}`,
						`gr-host-platform-release-timeline__release--channel-${release.channel}`,
					].join(' ')}
				>
					<span class="gr-host-platform-release-timeline__rail" aria-hidden="true">
						<span class="gr-host-platform-release-timeline__marker">{info.icon}</span>
					</span>
					<div class="gr-host-platform-release-timeline__body">
						<div class="gr-host-platform-release-timeline__header">
							<span class="gr-host-platform-release-timeline__version">{release.version}</span>
							<span
								class="gr-host-platform-release-timeline__channel"
								aria-label={`Channel: ${release.channel}`}
							>
								{release.channel}
							</span>
							<span
								class="gr-host-platform-release-timeline__status"
								aria-label={`Status: ${info.label}`}
							>
								<span class="gr-host-platform-release-timeline__status-text">{info.label}</span>
							</span>
							<time class="gr-host-platform-release-timeline__date" datetime={isoDate ?? undefined}>
								{visibleDate}
							</time>
						</div>
						{#if release.description}
							<p class="gr-host-platform-release-timeline__description">{release.description}</p>
						{/if}
						{#if adoptionText !== undefined}
							{#if adoptionRatio !== null}
								{@const adoptionLabelId = stableId.value
									? `${stableId.value}-rel-${release.id}-adoption-label`
									: undefined}
								<!--
									The adoption meter MUST have an accessible name. We use
									`aria-labelledby` pointing at the visible adoption text
									(rather than aria-label) so the visible text and the
									announced name stay in sync.  aria-valuetext carries the
									numeric value; aria-labelledby carries the "what is this
									meter measuring" semantic.
								-->
								<div
									class="gr-host-platform-release-timeline__adoption"
									role="meter"
									aria-labelledby={adoptionLabelId}
									aria-valuemin={0}
									aria-valuemax={1}
									aria-valuenow={adoptionRatio}
									aria-valuetext={`Adoption: ${adoptionText}`}
								>
									<span
										id={adoptionLabelId}
										class="gr-host-platform-release-timeline__adoption-text"
									>
										Adoption: {adoptionText}
									</span>
								</div>
							{:else}
								<p class="gr-host-platform-release-timeline__adoption-static">
									Adoption: {adoptionText}
								</p>
							{/if}
						{/if}
						{#if release.href || itemActions}
							<div class="gr-host-platform-release-timeline__actions" role="group">
								{#if release.href}
									<a
										class="gr-host-platform-release-timeline__link"
										href={release.href}
										aria-label={`Release notes for ${release.version}`}
									>
										Release notes
									</a>
								{/if}
								{#if itemActions}{@render itemActions(release)}{/if}
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</section>
