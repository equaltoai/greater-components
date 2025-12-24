<!--
Wiki.Root - Container component for wiki pages

Provides context for child wiki components.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { WikiHandlers, WikiPageData, WikiRevision } from '../../types.js';
	import { createWikiContext } from './context.js';
	import Navigation from './Navigation.svelte';
	import Page from './Page.svelte';
	import Editor from './Editor.svelte';
	import History from './History.svelte';

	interface Props {
		page: WikiPageData;
		handlers?: WikiHandlers;
		children?: Snippet;
	}

	let { page, handlers = {}, children }: Props = $props();

	const pageState = $state<WikiPageData>(untrack(() => page));
	const historyState = $state<WikiRevision[]>([]);
	const initialHandlers = untrack(() => handlers);

	let editingState = $state(false);
	let draftState = $state(untrack(() => page.content));
	let loadingState = $state(false);
	let errorState = $state<string | null>(null);

	const context = createWikiContext({
		page: pageState,
		history: historyState,
		handlers: initialHandlers,
		get editing() {
			return editingState;
		},
		set editing(value) {
			editingState = value;
		},
		get draft() {
			return draftState;
		},
		set draft(value) {
			draftState = value;
		},
		get loading() {
			return loadingState;
		},
		set loading(value) {
			loadingState = value;
		},
		get error() {
			return errorState;
		},
		set error(value) {
			errorState = value;
		},
	});

	$effect(() => {
		Object.assign(context.handlers, handlers);
	});

	$effect(() => {
		if (page.path !== pageState.path) {
			Object.assign(pageState, page);
			editingState = false;
			draftState = page.content;
			context.error = null;
		}
	});
</script>

<section class="gr-community-wiki" data-wiki-path={pageState.path}>
	{#if children}
		{@render children?.()}
	{:else}
		<Navigation />
		{#if context.editing}
			<Editor />
		{:else}
			<Page />
		{/if}
		<History />
	{/if}
</section>
