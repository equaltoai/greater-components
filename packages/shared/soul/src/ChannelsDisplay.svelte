<!--
  Soul.ChannelsDisplay - Reachability channel display for lesser-soul v3
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
	import { truncateMiddle } from '@equaltoai/greater-components-utils';

	import type { SoulChannels } from './types.js';

	interface Props {
		agentId?: string;
		channels: SoulChannels;
		updatedAt?: string;
		title?: string;
		showCopy?: boolean;
		class?: string;
	}

	let {
		agentId,
		channels,
		updatedAt,
		title = 'Reachability',
		showCopy = true,
		class: className = '',
	}: Props = $props();

	const agentIdShort = $derived(
		agentId ? truncateMiddle(agentId, { head: 10, tail: 8 }) : undefined
	);

	function verificationBadge(verified: boolean) {
		return verified
			? { label: 'Verified', color: 'success' as const }
			: { label: 'Unverified', color: 'warning' as const };
	}

	function statusBadge(status?: string) {
		if (!status) return null;
		if (status === 'active') return { label: 'Active', color: 'success' as const };
		if (status === 'paused') return { label: 'Paused', color: 'warning' as const };
		if (status === 'decommissioned') return { label: 'Decommissioned', color: 'error' as const };
		return { label: status, color: 'gray' as const };
	}

	function formatDateTime(value: string): string {
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return value;
		return d.toLocaleString();
	}
</script>

<Card variant="outlined" padding="lg" class={`soul-channels ${className}`}>
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#snippet header()}
		<div class="soul-channels__header">
			<div>
				<Heading level={3} size="lg" class="soul-channels__title">{title}</Heading>
				{#if agentIdShort}
					<Text size="sm" color="secondary" class="soul-channels__subtitle">{agentIdShort}</Text>
				{/if}
			</div>
			{#if updatedAt}
				<Text size="sm" color="secondary" class="soul-channels__updated"
					>Updated {formatDateTime(updatedAt)}</Text
				>
			{/if}
		</div>
	{/snippet}

	<DefinitionList density="sm">
		<DefinitionItem label="ENS" monospace wrap={false}>
			{#if channels.ens}
				<a class="soul-channels__link" href={`https://app.ens.domains/${channels.ens.name}`} target="_blank" rel="noreferrer">
					{channels.ens.name}
				</a>
				{#if showCopy}
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#snippet actions()}
						<CopyButton text={channels.ens.name} variant="icon" size="sm" aria-label="Copy ENS name" />
					{/snippet}
				{/if}
			{:else}
				<span class="soul-channels__empty">Not set</span>
			{/if}
		</DefinitionItem>

		<DefinitionItem label="Email" monospace wrap={false}>
			{#if channels.email}
				{@const emailVerification = verificationBadge(Boolean(channels.email.verified))}
				{@const emailStatus = channels.email.status ? statusBadge(channels.email.status) : null}
				<div class="soul-channels__row">
					<a class="soul-channels__link" href={`mailto:${channels.email.address}`}>{channels.email.address}</a>
					<div class="soul-channels__badges">
						<Badge
							variant="outlined"
							size="sm"
							color={emailVerification.color}
							label={emailVerification.label}
						/>
						{#if emailStatus}
							<Badge variant="outlined" size="sm" color={emailStatus.color} label={emailStatus.label} />
						{/if}
					</div>
				</div>
				<Text size="sm" color="secondary" class="soul-channels__meta">
					Capabilities: {channels.email.capabilities.join(', ')}
					{#if channels.email.verifiedAt}
						· Verified {formatDateTime(channels.email.verifiedAt)}
					{/if}
				</Text>
				{#if showCopy}
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#snippet actions()}
						<CopyButton
							text={channels.email.address}
							variant="icon"
							size="sm"
							aria-label="Copy email address"
						/>
					{/snippet}
				{/if}
			{:else}
				<span class="soul-channels__empty">Not set</span>
			{/if}
		</DefinitionItem>

		<DefinitionItem label="Phone" monospace wrap={false}>
			{#if channels.phone}
				{@const phoneVerification = verificationBadge(Boolean(channels.phone.verified))}
				{@const phoneStatus = channels.phone.status ? statusBadge(channels.phone.status) : null}
				<div class="soul-channels__row">
					<a class="soul-channels__link" href={`tel:${channels.phone.number}`}>{channels.phone.number}</a>
					<div class="soul-channels__badges">
						<Badge
							variant="outlined"
							size="sm"
							color={phoneVerification.color}
							label={phoneVerification.label}
						/>
						{#if phoneStatus}
							<Badge variant="outlined" size="sm" color={phoneStatus.color} label={phoneStatus.label} />
						{/if}
					</div>
				</div>
				<Text size="sm" color="secondary" class="soul-channels__meta">
					Capabilities: {channels.phone.capabilities.join(', ')}
					{#if channels.phone.verifiedAt}
						· Verified {formatDateTime(channels.phone.verifiedAt)}
					{/if}
					{#if channels.phone.provider}
						· Provider {channels.phone.provider}
					{/if}
				</Text>
				{#if showCopy}
					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#snippet actions()}
						<CopyButton
							text={channels.phone.number}
							variant="icon"
							size="sm"
							aria-label="Copy phone number"
						/>
					{/snippet}
				{/if}
			{:else}
				<span class="soul-channels__empty">Not set</span>
			{/if}
		</DefinitionItem>
	</DefinitionList>
</Card>

<style>
	.soul-channels__header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--gr-spacing-md, 1rem);
	}

	:global(.soul-channels__title) {
		margin: 0;
	}

	:global(.soul-channels__subtitle) {
		margin: 0.25rem 0 0;
	}

	:global(.soul-channels__updated) {
		white-space: nowrap;
	}

	.soul-channels__row {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-sm, 0.75rem);
		flex-wrap: wrap;
	}

	.soul-channels__badges {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	:global(.soul-channels__meta) {
		margin-top: 0.25rem;
	}

	.soul-channels__empty {
		color: var(--gr-color-text-muted, #6b7280);
	}

	.soul-channels__link {
		color: var(--gr-color-text, #111827);
		text-decoration: none;
	}

	.soul-channels__link:hover {
		text-decoration: underline;
	}
</style>
