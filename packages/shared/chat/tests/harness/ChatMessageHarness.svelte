<script lang="ts">
	import Message from '../../src/ChatMessage.svelte';
	import type { MessageRole } from '../../src/types.js';
	import type { Snippet } from 'svelte';

	interface Props {
		role: MessageRole;
		content: string;
		timestamp?: Date;
		avatar?: string;
		streaming?: boolean;
		status?: 'pending' | 'streaming' | 'complete' | 'error';
		error?: string;
		showCopyButton?: boolean;
		showRetryButton?: boolean;
		onRetry?: () => void;
		actions?: Snippet;
		userAvatar?: Snippet;
		assistantAvatar?: Snippet;
		renderContent?: Snippet<[{ content: string; streaming: boolean }]>;
		class?: string;
	}

	let {
		role,
		content,
		timestamp,
		avatar,
		streaming = false,
		status = 'complete',
		error,
		showCopyButton,
		showRetryButton,
		onRetry,
		actions,
		userAvatar,
		assistantAvatar,
		renderContent,
		class: className = '',
	}: Props = $props();
</script>

<Message
	{role}
	{content}
	{timestamp}
	{avatar}
	{streaming}
	{status}
	{error}
	{showCopyButton}
	{showRetryButton}
	{onRetry}
	{actions}
	{userAvatar}
	{assistantAvatar}
	{renderContent}
	class={className}
/>
