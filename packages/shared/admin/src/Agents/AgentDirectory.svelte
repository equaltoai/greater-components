<script lang="ts">
	import { Button, List, ListItem, TextField } from '@equaltoai/greater-components-primitives';
	import AgentBadge from './AgentBadge.svelte';
	import type { AgentDirectoryEntry } from './types.js';

	interface Props {
		agents: AgentDirectoryEntry[];
		loading?: boolean;
		error?: string | null;
		query?: string;
		canLoadMore?: boolean;
		onSearch?: (query: string) => void;
		onLoadMore?: () => void;
		class?: string;
	}

	let {
		agents,
		loading = false,
		error = null,
		query = $bindable(''),
		canLoadMore = false,
		onSearch,
		onLoadMore,
		class: className = '',
	}: Props = $props();

	let lastQuery = $state<string | null>(null);
	$effect(() => {
		if (!onSearch) return;
		if (lastQuery === null) {
			lastQuery = query;
			return;
		}
		if (query === lastQuery) return;
		lastQuery = query;
		onSearch(query.trim());
	});
</script>

<section class={['admin-agent-directory', className].filter(Boolean).join(' ')}>
	<div class="admin-agent-directory__toolbar">
		<TextField label="Search" type="search" placeholder="Search agents" bind:value={query} />

		{#if canLoadMore}
			<Button variant="outline" size="sm" disabled={loading} onclick={() => onLoadMore?.()}>
				Load more
			</Button>
		{/if}
	</div>

	{#if error}
		<div class="admin-agent-directory__error" role="alert">
			{error}
		</div>
	{/if}

	<List spacing="sm" class="admin-agent-directory__list">
		{#each agents as agent (agent.id)}
			<ListItem class="admin-agent-directory__item">
				<div class="admin-agent-directory__row">
					<div class="admin-agent-directory__header">
						<div class="admin-agent-directory__identity">
							<strong>@{agent.username}</strong>
							<AgentBadge
								agentType={agent.agentType}
								verified={agent.verified}
								class="admin-agent-directory__badge"
							/>
						</div>

						{#if agent.agentOwner}
							<div class="admin-agent-directory__owner">Owner: @{agent.agentOwner}</div>
						{/if}
					</div>

					{#if agent.displayName}
						<div class="admin-agent-directory__display">{agent.displayName}</div>
					{/if}
					{#if agent.bio}
						<div class="admin-agent-directory__bio">{agent.bio}</div>
					{/if}
				</div>
			</ListItem>
		{/each}
	</List>
</section>
