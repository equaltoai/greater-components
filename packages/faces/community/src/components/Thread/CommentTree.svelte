<!--
Thread.CommentTree - Render a list of top-level comments
-->

<script lang="ts">
	import type { CommentData } from '../../types.js';
	import { getThreadContext } from './context.js';
	import Comment from './Comment.svelte';

	interface Props {
		comments?: CommentData[];
	}

	let { comments }: Props = $props();

	const { thread } = getThreadContext();
	const list = $derived(comments ?? thread.comments);
</script>

<div class="gr-community-thread" aria-label="Comments">
	{#each list as comment (comment.id)}
		<Comment {comment} />
	{/each}
</div>
