<script lang="ts">
	import type { Component as ComponentType, Snippet } from 'svelte';
	import { Wiki } from '../../src/components/Wiki/index.js';
	import type { WikiPageData, WikiHandlers } from '../../src/types.js';

	interface Props {
		wiki?: WikiPageData;
		handlers?: WikiHandlers;
		component?: ComponentType<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	const defaultWiki: WikiPageData = {
		path: '/wiki/home',
		title: 'Wiki Home',
		content: 'Welcome to the wiki',
		revision: 1,
		editPermission: 'everyone',
	};

	let {
		wiki = defaultWiki,
		handlers = {},
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

{#if Component || children}
	<Wiki.Root page={wiki} {handlers}>
		{#if Component}
			<Component {...componentProps} />
		{:else}
			{@render children?.()}
		{/if}
	</Wiki.Root>
{:else}
	<Wiki.Root page={wiki} {handlers} />
{/if}
