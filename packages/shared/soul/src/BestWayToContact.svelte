<!--
  Soul.BestWayToContact - Preference-driven “best contact method” helper UI
-->
<script lang="ts">
	import {
		Badge,
		Card,
		CopyButton,
		DefinitionItem,
		DefinitionList,
		Heading,
		Text,
	} from '@equaltoai/greater-components-primitives';

	import type { SoulChannels, SoulContactPreferences, ContactTarget } from './types.js';
	import { formatAvailabilitySummary, recommendContactTarget } from './utils.js';

	interface Props {
		channels: SoulChannels;
		preferences: SoulContactPreferences | null;
		title?: string;
		class?: string;
	}

	let {
		channels,
		preferences,
		title = 'Best way to contact',
		class: className = '',
	}: Props = $props();

	const rec = $derived(recommendContactTarget(channels, preferences));

	function contactHref(target: ContactTarget): string | null {
		switch (target.channel) {
			case 'email':
				return `mailto:${target.address}`;
			case 'sms':
				return `sms:${target.number}`;
			case 'voice':
				return `tel:${target.number}`;
			default:
				return null;
		}
	}

	function contactValue(target: ContactTarget): string | null {
		switch (target.channel) {
			case 'email':
				return target.address;
			case 'sms':
			case 'voice':
				return target.number;
			default:
				return null;
		}
	}
</script>

<Card variant="outlined" padding="lg" class={`soul-best-contact ${className}`}>
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#snippet header()}
		<div class="soul-best-contact__header">
			<Heading level={3} size="lg" class="soul-best-contact__title">{title}</Heading>
			{#if rec.availability}
				<Text size="sm" color="secondary">{formatAvailabilitySummary(rec.availability)}</Text>
			{/if}
		</div>
	{/snippet}

	{#if !rec.recommended}
		<Text size="sm" color="secondary">No inbound contact channels available.</Text>
	{:else}
		<DefinitionList density="sm">
			<DefinitionItem label="Recommended">
				<div class="soul-best-contact__row">
					<Badge variant="outlined" size="sm" color="primary" label={rec.recommended.label} />
					{#if contactHref(rec.recommended) && contactValue(rec.recommended)}
						<a class="soul-best-contact__link" href={contactHref(rec.recommended) as string}
							>{contactValue(rec.recommended)}</a
						>
					{/if}
					{#if 'verified' in rec.recommended}
						<Badge
							variant="outlined"
							size="sm"
							color={rec.recommended.verified ? 'success' : 'warning'}
							label={rec.recommended.verified ? 'Verified' : 'Unverified'}
						/>
					{/if}
				</div>

				{#if contactValue(rec.recommended)}
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#snippet actions()}
						<CopyButton
							text={contactValue(rec.recommended) as string}
							variant="icon"
							size="sm"
							aria-label="Copy contact value"
						/>
					{/snippet}
				{/if}
			</DefinitionItem>

			{#if rec.preferred && rec.preferred.channel !== rec.recommended.channel}
				<DefinitionItem label="Preferred">
					<Text size="sm" color="secondary">{rec.preferred.label} (unavailable)</Text>
				</DefinitionItem>
			{/if}

			{#if rec.fallback && rec.fallback.channel !== rec.recommended.channel}
				<DefinitionItem label="Fallback">
					<Text size="sm" color="secondary">{rec.fallback.label}</Text>
				</DefinitionItem>
			{/if}

			{#if rec.alternatives.length}
				<DefinitionItem label="Alternatives">
					<ul class="soul-best-contact__alts">
						{#each rec.alternatives as alt (alt.channel)}
							<li class="soul-best-contact__alt">
								<Badge variant="outlined" size="sm" color="gray" label={alt.label} />
								{#if contactHref(alt) && contactValue(alt)}
									<a class="soul-best-contact__link" href={contactHref(alt) as string}
										>{contactValue(alt)}</a
									>
								{/if}
								{#if 'verified' in alt}
									<Badge
										variant="outlined"
										size="sm"
										color={alt.verified ? 'success' : 'warning'}
										label={alt.verified ? 'Verified' : 'Unverified'}
									/>
								{/if}
							</li>
						{/each}
					</ul>
				</DefinitionItem>
			{/if}
		</DefinitionList>
	{/if}
</Card>

<style>
	.soul-best-contact__header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--gr-spacing-md, 1rem);
	}

	:global(.soul-best-contact__title) {
		margin: 0;
	}

	.soul-best-contact__row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.soul-best-contact__alts {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.soul-best-contact__alt {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.soul-best-contact__link {
		color: var(--gr-color-text, #111827);
		text-decoration: none;
	}

	.soul-best-contact__link:hover {
		text-decoration: underline;
	}
</style>
