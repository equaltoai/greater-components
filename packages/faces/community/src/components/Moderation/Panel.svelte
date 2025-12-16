<!--
Moderation.Panel - Default moderation panel UI
-->

<script lang="ts">
	import type { ModerationQueueItem } from '../../types.js';
	import { getModerationContext } from './context.js';
	import Queue from './Queue.svelte';
	import Log from './Log.svelte';

	type QueueName = ModerationQueueItem['queue'];
	type Tab = QueueName | 'log';

	const context = getModerationContext();

	const tabs: Array<{ id: Tab; label: string }> = [
		{ id: 'modqueue', label: 'Modqueue' },
		{ id: 'reports', label: 'Reports' },
		{ id: 'spam', label: 'Spam' },
		{ id: 'unmoderated', label: 'Unmoderated' },
		{ id: 'log', label: 'Log' },
	];

	let activeTab = $state<Tab>('modqueue');
	let autoLoaded = false;

	function replaceArray<T>(target: T[], next: T[]) {
		target.splice(0, target.length, ...next);
	}

	async function loadQueue(queue: QueueName) {
		if (!context.handlers.onFetchQueue) return;
		context.loading = true;
		context.error = null;

		try {
			const next = await context.handlers.onFetchQueue(queue);
			replaceArray(context.queue, next);
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		} finally {
			context.loading = false;
		}
	}

	async function loadLog() {
		if (!context.handlers.onFetchLog) return;
		context.loading = true;
		context.error = null;

		try {
			const next = await context.handlers.onFetchLog();
			replaceArray(context.log, next);
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		} finally {
			context.loading = false;
		}
	}

	async function setTab(next: Tab) {
		activeTab = next;
		if (next === 'log') {
			if (context.log.length === 0) await loadLog();
		} else if (context.queue.length === 0 || context.queue[0]?.queue !== next) {
			await loadQueue(next);
		}
	}

	async function refresh() {
		if (activeTab === 'log') {
			await loadLog();
		} else {
			await loadQueue(activeTab);
		}
	}

	$effect(() => {
		if (autoLoaded) return;
		autoLoaded = true;

		// Kick off an initial load if handlers are provided and no data is supplied.
		if (context.queue.length === 0 && context.handlers.onFetchQueue) {
			void loadQueue(activeTab === 'log' ? 'modqueue' : activeTab);
		} else if (activeTab === 'log' && context.log.length === 0 && context.handlers.onFetchLog) {
			void loadLog();
		}
	});
</script>

<section class="gr-community-mod-panel" aria-label="Moderation panel">
	<div class="gr-community-mod-panel__header">
		<h2 class="gr-community-mod-panel__title">Moderation</h2>
		{#if context.handlers.onFetchQueue || context.handlers.onFetchLog}
			<button
				type="button"
				class="gr-community-mod-panel__refresh"
				onclick={refresh}
				disabled={context.loading}
			>
				Refresh
			</button>
		{/if}
	</div>

	<div class="gr-community-mod-panel__tabs" role="tablist" aria-label="Moderation tabs">
		{#each tabs as tab (tab.id)}
			<button
				type="button"
				role="tab"
				class="gr-community-mod-panel__tab"
				class:gr-community-mod-panel__tab--active={activeTab === tab.id}
				aria-selected={activeTab === tab.id}
				onclick={() => setTab(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="gr-community-mod-panel__content">
		{#if context.error}
			<p class="gr-community-mod-panel__error" role="alert">{context.error}</p>
		{/if}

		{#if context.loading}
			<p class="gr-community-mod-panel__status" aria-live="polite">Loading…</p>
		{/if}

		{#if activeTab === 'log'}
			<Log />
		{:else}
			<Queue queue={activeTab} />
		{/if}
	</div>
</section>
