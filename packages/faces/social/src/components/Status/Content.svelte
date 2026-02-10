<!--
Status.Content - Display status content with content warnings

Handles HTML content rendering, mentions, hashtags, and content warnings.
Uses ContentRenderer for safe HTML display.

@component
@example
```svelte
<Status.Root status={post}>
  <Status.Content />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getStatusContext } from './context.js';
	import ContentRenderer from '../ContentRenderer.svelte';
	import type { Mention, Tag } from '../../types.js';

	interface Props {
		/**
		 * Custom content rendering
		 */
		content?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { content, class: className = '' }: Props = $props();

	const context = getStatusContext();
	const { actualStatus } = context;

	type ActivityPubTagLike = { name: string; href?: string | null };

	function mapMention(tag: ActivityPubTagLike): Mention | null {
		if (!tag.href) return null;

		const raw = tag.name.startsWith('@') ? tag.name.slice(1) : tag.name;
		const username = raw.split('@')[0] || raw;
		const acct = raw;

		return {
			id: tag.href,
			username,
			acct,
			url: tag.href,
		};
	}

	function mapHashtag(tag: ActivityPubTagLike): Tag | null {
		if (!tag.href) return null;

		const raw = tag.name.startsWith('#') ? tag.name.slice(1) : tag.name;
		if (!raw) return null;

		return {
			name: raw,
			url: tag.href,
		};
	}

	const spoilerText = $derived(
		(actualStatus as unknown as { spoilerText?: string; contentWarning?: string }).spoilerText ??
			(actualStatus as unknown as { spoilerText?: string; contentWarning?: string }).contentWarning
	);

	const mentions = $derived.by(() => {
		const rawMentions = (actualStatus as unknown as { mentions?: unknown }).mentions;
		if (!Array.isArray(rawMentions)) return [];

		// If already in Mention shape, return as-is
		const first = rawMentions[0] as Record<string, unknown> | undefined;
		if (first && typeof first['username'] === 'string' && typeof first['url'] === 'string') {
			return rawMentions as Mention[];
		}

		return (rawMentions as ActivityPubTagLike[])
			.map(mapMention)
			.filter((mention): mention is Mention => mention !== null);
	});

	const tags = $derived.by(() => {
		const rawTags = (actualStatus as unknown as { tags?: unknown }).tags;
		if (Array.isArray(rawTags)) {
			const first = rawTags[0] as Record<string, unknown> | undefined;
			if (first && typeof first['name'] === 'string' && typeof first['url'] === 'string') {
				return rawTags as Tag[];
			}
		}

		const rawHashtags = (actualStatus as unknown as { hashtags?: unknown }).hashtags;
		if (!Array.isArray(rawHashtags)) return [];

		return (rawHashtags as ActivityPubTagLike[])
			.map(mapHashtag)
			.filter((tag): tag is Tag => tag !== null);
	});
</script>

<div class={`status-content ${className}`}>
	{#if content}
		{@render content()}
	{:else}
		<ContentRenderer content={actualStatus.content} {spoilerText} {mentions} {tags} />
	{/if}
</div>
