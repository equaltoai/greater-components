<script lang="ts">
	import NotificationsFeedReactive from '../../src/components/NotificationsFeedReactive.svelte';
	import type { Notification, NotificationGroup } from '../../src/types';
	import type { NotificationIntegrationConfig } from '../../src/lib/integration';

	interface Props {
		notifications?: Notification[];
		loading?: boolean;
		emptyStateMessage?: string;
		useCustomRenderer?: boolean;
		useCustomRealtime?: boolean;
		useCustomLoading?: boolean;
		useCustomEmpty?: boolean;
        integration?: NotificationIntegrationConfig;
	}

	let {
		notifications = [],
		loading = false,
		emptyStateMessage,
		useCustomRenderer = false,
		useCustomRealtime = false,
		useCustomLoading = false,
		useCustomEmpty = false,
        integration,
	}: Props = $props();
</script>

<NotificationsFeedReactive
	{notifications}
	{loading}
	{emptyStateMessage}
    {integration}
>
	{#snippet notificationRenderer({ notification })}
		{#if useCustomRenderer}
			<div class="custom-item">{notification.id}</div>
		{/if}
	{/snippet}

	{#snippet realtimeIndicator({ connected })}
		{#if useCustomRealtime}
			<div class="custom-realtime">{connected ? 'Yes' : 'No'}</div>
		{/if}
	{/snippet}

	{#snippet loadingState()}
		{#if useCustomLoading}
			<div class="custom-loading">Custom Loading...</div>
		{/if}
	{/snippet}

	{#snippet emptyState()}
		{#if useCustomEmpty}
			<div class="custom-empty">Custom Empty</div>
		{/if}
	{/snippet}
</NotificationsFeedReactive>
