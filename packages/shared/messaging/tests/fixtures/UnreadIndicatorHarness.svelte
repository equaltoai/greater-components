<script lang="ts">
	import UnreadIndicator from '../../src/UnreadIndicator.svelte';
	import { createMessagesContext, type Conversation } from '../../src/context.svelte.js';

	interface Props {
		variant?: 'badge' | 'dot' | 'number';
	}

	let { variant = 'badge' }: Props = $props();
	const context = createMessagesContext();

	function unreadConversations(count: number): Conversation[] {
		return Array.from({ length: count }, (_, index) => ({
			id: `conversation-${index}`,
			participants: [],
			unreadCount: 1,
			updatedAt: '',
		}));
	}

	function setUnreadCount(count: number) {
		context.state.conversations = unreadConversations(count);
	}

	function simulateBurst() {
		setUnreadCount(1);
		setTimeout(() => setUnreadCount(2), 10);
		setTimeout(() => setUnreadCount(3), 20);
	}

	function simulateSustainedChurn() {
		setUnreadCount(1);
		for (let count = 2; count <= 12; count += 1) {
			setTimeout(() => setUnreadCount(count), (count - 1) * 100);
		}
	}
</script>

<button type="button" data-testid="set-one" onclick={() => setUnreadCount(1)}>Set one</button>
<button type="button" data-testid="burst" onclick={simulateBurst}>Burst</button>
<button type="button" data-testid="sustained-churn" onclick={simulateSustainedChurn}>
	Sustained churn
</button>
<UnreadIndicator {variant} />
