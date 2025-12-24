import type { Conversation } from './context.svelte.js';

/**
 * Format message timestamp
 */
export function formatMessageTime(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 7) {
		return date.toLocaleDateString();
	}
	if (days > 0) {
		return `${days}d ago`;
	}
	if (hours > 0) {
		return `${hours}h ago`;
	}
	if (minutes > 0) {
		return `${minutes}m ago`;
	}
	return 'Just now';
}

/**
 * Get conversation display name
 */
export function getConversationName(conversation: Conversation, currentUserId: string): string {
	const otherParticipants = conversation.participants.filter((p) => p.id !== currentUserId);
	if (otherParticipants.length === 0) return 'Me';
	if (otherParticipants.length === 1 && otherParticipants[0])
		return otherParticipants[0].displayName;
	return otherParticipants.map((p) => p.displayName).join(', ');
}
