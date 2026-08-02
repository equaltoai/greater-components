<script lang="ts">
	import Conversations from '../../src/Conversations.svelte';
	import {
		createMessagesContext,
		type Conversation,
		type ConversationFolder,
	} from '../../src/context.svelte.js';

	interface Props {
		controlled?: boolean;
	}

	let { controlled = false }: Props = $props();
	let folder = $state<ConversationFolder>('REQUESTS');

	const requestConversation: Conversation = {
		id: 'req-1',
		folder: 'REQUESTS',
		requestState: 'PENDING',
		participants: [{ id: 'alice', username: 'alice', displayName: 'Alice', avatar: '' }],
		unreadCount: 0,
		updatedAt: '2026-08-02T00:00:00.000Z',
	};
	const inboxConversation: Conversation = {
		id: 'inbox-1',
		folder: 'INBOX',
		requestState: 'ACCEPTED',
		participants: [{ id: 'bob', username: 'bob', displayName: 'Bob', avatar: '' }],
		unreadCount: 0,
		updatedAt: '2026-08-02T00:01:00.000Z',
	};

	const context = createMessagesContext({
		onFetchConversations: async (nextFolder) =>
			nextFolder === 'REQUESTS' ? [requestConversation] : [inboxConversation],
		onAcceptMessageRequest: async () => ({
			...requestConversation,
			folder: 'INBOX',
			requestState: 'ACCEPTED',
		}),
	});
	context.state.folder = 'REQUESTS';
	context.state.conversations = [requestConversation];
</script>

<output data-bound-folder={folder}>{folder}</output>

{#snippet actions(conversation: Conversation)}
	<button
		type="button"
		class="request-action"
		onclick={() => void context.acceptMessageRequest(conversation.id)}
	>
		Accept
	</button>
{/snippet}

{#if controlled}
	<Conversations bind:folder {actions} />
{:else}
	<Conversations {actions} />
{/if}
