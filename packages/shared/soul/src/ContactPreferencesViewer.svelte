<!--
  Soul.ContactPreferencesViewer - Read-only view for lesser-soul v3 contact preferences
-->
<script lang="ts">
	import { Badge, Card, DefinitionItem, DefinitionList, Heading, Text } from '@equaltoai/greater-components-primitives';

	import type { SoulContactPreferences } from './types.js';
	import { formatAvailabilitySummary } from './utils.js';

	interface Props {
		preferences: SoulContactPreferences | null;
		updatedAt?: string;
		title?: string;
		class?: string;
	}

	let {
		preferences,
		updatedAt,
		title = 'Contact preferences',
		class: className = '',
	}: Props = $props();

	function formatDateTime(value: string): string {
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return value;
		return d.toLocaleString();
	}

	function channelLabel(channel: string): string {
		const map: Record<string, string> = {
			email: 'Email',
			sms: 'SMS',
			voice: 'Voice',
			activitypub: 'ActivityPub',
			mcp: 'MCP',
		};
		return map[channel] ?? channel;
	}
</script>

<Card variant="outlined" padding="lg" class={`soul-preferences ${className}`}>
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#snippet header()}
		<div class="soul-preferences__header">
			<div>
				<Heading level={3} size="lg" class="soul-preferences__title">{title}</Heading>
				{#if updatedAt}
					<Text size="sm" color="secondary" class="soul-preferences__subtitle"
						>Updated {formatDateTime(updatedAt)}</Text
					>
				{/if}
			</div>
		</div>
	{/snippet}

	{#if !preferences}
		<Text size="sm" color="secondary">No preferences published.</Text>
	{:else}
		<DefinitionList density="sm">
			<DefinitionItem label="Preferred">
				<Badge variant="outlined" size="sm" color="primary" label={channelLabel(preferences.preferred)} />
			</DefinitionItem>

			{#if preferences.fallback}
				<DefinitionItem label="Fallback">
					<Badge variant="outlined" size="sm" color="gray" label={channelLabel(preferences.fallback)} />
				</DefinitionItem>
			{/if}

			<DefinitionItem label="Availability">
				<div class="soul-preferences__stack">
					<span>{formatAvailabilitySummary({ schedule: preferences.availability.schedule, timezone: preferences.availability.timezone, windows: preferences.availability.windows ?? null })}</span>
					{#if preferences.availability.schedule === 'custom' && preferences.availability.windows?.length}
						<ul class="soul-preferences__windows">
							{#each preferences.availability.windows as w (JSON.stringify(w))}
								<li>
									<span class="soul-preferences__window">
										{w.days.join(', ')} · {w.startTime}–{w.endTime}
									</span>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</DefinitionItem>

			<DefinitionItem label="Response expectation">
				<div class="soul-preferences__stack">
					<span>{preferences.responseExpectation.target}</span>
					<Text size="sm" color="secondary">{preferences.responseExpectation.guarantee}</Text>
				</div>
			</DefinitionItem>

			{#if preferences.rateLimits}
				<DefinitionItem label="Rate limits">
					<ul class="soul-preferences__limits">
						{#if preferences.rateLimits.email}
							<li>
								<strong>Email</strong>
								{#if preferences.rateLimits.email.maxInboundPerHour}
									· {preferences.rateLimits.email.maxInboundPerHour}/hour
								{/if}
								{#if preferences.rateLimits.email.maxInboundPerDay}
									· {preferences.rateLimits.email.maxInboundPerDay}/day
								{/if}
							</li>
						{/if}
						{#if preferences.rateLimits.sms}
							<li>
								<strong>SMS</strong>
								{#if preferences.rateLimits.sms.maxInboundPerHour}
									· {preferences.rateLimits.sms.maxInboundPerHour}/hour
								{/if}
								{#if preferences.rateLimits.sms.maxInboundPerDay}
									· {preferences.rateLimits.sms.maxInboundPerDay}/day
								{/if}
							</li>
						{/if}
						{#if preferences.rateLimits.voice}
							<li>
								<strong>Voice</strong>
								{#if preferences.rateLimits.voice.maxConcurrentCalls}
									· {preferences.rateLimits.voice.maxConcurrentCalls} concurrent
								{/if}
								{#if preferences.rateLimits.voice.maxCallsPerDay}
									· {preferences.rateLimits.voice.maxCallsPerDay}/day
								{/if}
							</li>
						{/if}
					</ul>
				</DefinitionItem>
			{/if}

			<DefinitionItem label="Languages">
				<div class="soul-preferences__badges">
					{#each preferences.languages as lang (lang)}
						<Badge variant="outlined" size="sm" color="gray" label={lang} />
					{/each}
				</div>
			</DefinitionItem>

			{#if preferences.contentTypes?.length}
				<DefinitionItem label="Content types">
					<div class="soul-preferences__badges">
						{#each preferences.contentTypes as ct (ct)}
							<Badge variant="outlined" size="sm" color="gray" label={ct} />
						{/each}
					</div>
				</DefinitionItem>
			{/if}

			{#if preferences.firstContact}
				<DefinitionItem label="First contact">
					<ul class="soul-preferences__first-contact">
						<li>Prefer soul senders: {preferences.firstContact.requireSoul ? 'yes' : 'no'}</li>
						<li>
							Reputation threshold:{' '}
							{preferences.firstContact.requireReputation === null ||
							preferences.firstContact.requireReputation === undefined
								? 'none'
								: preferences.firstContact.requireReputation}
						</li>
						<li>
							Introduction expected: {preferences.firstContact.introductionExpected ? 'yes' : 'no'}
						</li>
					</ul>
				</DefinitionItem>
			{/if}
		</DefinitionList>
	{/if}
</Card>

<style>
	.soul-preferences__header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--gr-spacing-md, 1rem);
	}

	:global(.soul-preferences__title) {
		margin: 0;
	}

	:global(.soul-preferences__subtitle) {
		margin: 0.25rem 0 0;
	}

	.soul-preferences__stack {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.soul-preferences__windows,
	.soul-preferences__limits,
	.soul-preferences__first-contact {
		margin: 0.25rem 0 0;
		padding-left: 1.25rem;
	}

	.soul-preferences__badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.soul-preferences__window {
		color: var(--gr-color-text-muted, #6b7280);
	}
</style>

