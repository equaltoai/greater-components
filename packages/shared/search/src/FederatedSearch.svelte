<!--
  FederatedSearch - Search across multiple ActivityPub instances

  Enables federated search with result aggregation and instance filtering.

  @component
  @example
  ```svelte
  <Search.FederatedSearch
    instances={['mastodon.social', 'fosstodon.org']}
    onSearch={handleFederatedSearch}
  />
  ```
-->

<script lang="ts">
	import { Checkbox, Spinner } from '@equaltoai/greater-components-primitives';
	import { GlobeIcon } from '@equaltoai/greater-components-icons';
	import { untrack } from 'svelte';
	import { getSearchContext } from './context.js';
	import type { SearchResults } from './context.js';

	interface FederatedInstance {
		domain: string;
		name?: string;
		enabled: boolean;
		status: 'idle' | 'searching' | 'complete' | 'error';
		results?: SearchResults;
		error?: string;
	}

	interface Props {
		/**
		 * List of instance domains to search
		 */
		instances?: string[];

		/**
		 * Whether federated search is enabled
		 */
		enabled?: boolean;

		/**
		 * Called when federated search is performed
		 */
		onSearch?: (query: string, instances: string[]) => Promise<Map<string, SearchResults>>;

		/**
		 * Called when instance selection changes
		 */
		onInstancesChange?: (instances: string[]) => void;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		instances = [],
		enabled = $bindable(false),
		onSearch,
		onInstancesChange,
		class: className = '',
	}: Props = $props();

	const context = getSearchContext();

	let initialInstances = untrack(() => instances);
	let federatedInstances: FederatedInstance[] = $state(
		initialInstances.map((domain) => ({
			domain,
			enabled: true,
			status: 'idle' as const,
		}))
	);

	let isSearching = $derived(federatedInstances.some((i) => i.status === 'searching'));

	function toggleInstance(domain: string) {
		const instance = federatedInstances.find((i) => i.domain === domain);
		if (instance) {
			instance.enabled = !instance.enabled;
			onInstancesChange?.(federatedInstances.filter((i) => i.enabled).map((i) => i.domain));
		}
	}

	async function performFederatedSearch() {
		if (!onSearch || !context.state.query) return;

		const enabledInstances = federatedInstances.filter((i) => i.enabled);

		// Set all enabled instances to searching
		for (const instance of enabledInstances) {
			instance.status = 'searching';
			instance.results = undefined;
			instance.error = undefined;
		}

		try {
			const results = await onSearch(
				context.state.query,
				enabledInstances.map((i) => i.domain)
			);

			// Update each instance with its results
			for (const instance of enabledInstances) {
				const instanceResults = results.get(instance.domain);
				if (instanceResults) {
					instance.results = instanceResults;
					instance.status = 'complete';
				} else {
					instance.status = 'error';
					instance.error = 'No results returned';
				}
			}
		} catch (error) {
			// Mark all as error
			for (const instance of enabledInstances) {
				instance.status = 'error';
				instance.error = error instanceof Error ? error.message : 'Search failed';
			}
		}
	}

	// Watch for query changes and trigger search if enabled
	$effect(() => {
		if (enabled && context.state.query) {
			performFederatedSearch();
		}
	});

	function getTotalResults(): number {
		return federatedInstances.reduce((total, instance) => {
			return total + (instance.results?.total ?? 0);
		}, 0);
	}
</script>

<div class="federated-search {className}" role="region" aria-label="Federated search">
	<div class="federated-search__header">
		<div class="federated-search__title">
			<GlobeIcon size={16} aria-hidden="true" />
			<span>Federated Search</span>
		</div>
		<label class="federated-search__toggle">
			<Checkbox bind:checked={enabled} />
			<span>Enable</span>
		</label>
	</div>

	{#if enabled}
		<div class="federated-search__instances" role="list" aria-label="Instances to search">
			{#each federatedInstances as instance (instance.domain)}
				<div
					class="federated-search__instance"
					class:federated-search__instance--disabled={!instance.enabled}
					class:federated-search__instance--searching={instance.status === 'searching'}
					class:federated-search__instance--error={instance.status === 'error'}
					role="listitem"
				>
					<label class="federated-search__instance-label">
						<Checkbox checked={instance.enabled} onchange={() => toggleInstance(instance.domain)} />
						<span>{instance.name || instance.domain}</span>
					</label>

					<div class="federated-search__instance-status">
						{#if instance.status === 'searching'}
							<Spinner size="xs" />
						{:else if instance.status === 'complete' && instance.results}
							<span class="federated-search__count">
								{instance.results.total} results
							</span>
						{:else if instance.status === 'error'}
							<span class="federated-search__error" title={instance.error}> Error </span>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if isSearching}
			<div class="federated-search__status" aria-live="polite">
				Searching across {federatedInstances.filter((i) => i.enabled).length} instances...
			</div>
		{:else if getTotalResults() > 0}
			<div class="federated-search__status" aria-live="polite">
				Found {getTotalResults()} total results
			</div>
		{/if}
	{/if}
</div>

<style>
	.federated-search {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-surface-secondary);
		border-radius: var(--gr-radii-md);
	}

	.federated-search__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.federated-search__title {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-text-primary);
	}

	.federated-search__instances {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.federated-search__instance {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--gr-spacing-scale-2);
		background: var(--gr-color-surface-primary);
		border-radius: var(--gr-radii-sm);
		transition: opacity 0.2s ease;
	}

	.federated-search__instance--disabled {
		opacity: 0.5;
	}

	.federated-search__instance--error {
		border-left: 2px solid var(--gr-color-error-500);
	}

	.federated-search__instance-status {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
	}

	.federated-search__count {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-text-muted);
	}

	.federated-search__error {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-error-500);
	}

	.federated-search__toggle,
	.federated-search__instance-label {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		cursor: pointer;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-text-secondary);
	}

	.federated-search__status {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-text-muted);
		text-align: center;
		padding-top: var(--gr-spacing-scale-2);
		border-top: 1px solid var(--gr-color-border-subtle);
	}
</style>
