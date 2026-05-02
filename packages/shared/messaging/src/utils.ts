import type { Conversation } from './context.svelte.js';
import type { MessageParticipant } from './context.svelte.js';

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
 * Match a participant against a consumer-supplied current user id.
 *
 * Lesser conversation mutations may use normalized local usernames while app
 * session state often uses the original actor id. Compare both so own-message
 * styling and conversation naming stay correct across either representation.
 */
export function isParticipantId(
	participant: MessageParticipant,
	currentUserId: string | null | undefined
): boolean {
	const normalizedCurrentUserId = currentUserId?.trim();
	if (!normalizedCurrentUserId) return false;

	const candidates = [
		participant.id,
		participant.actorId,
		participant.username,
		participant.handle,
	].filter((value): value is string => Boolean(value));

	return candidates.includes(normalizedCurrentUserId);
}

/**
 * Get conversation display name
 */
export function getConversationName(conversation: Conversation, currentUserId: string): string {
	const otherParticipants = conversation.participants.filter(
		(p) => !isParticipantId(p, currentUserId)
	);
	if (otherParticipants.length === 0) return 'Me';
	if (otherParticipants.length === 1 && otherParticipants[0])
		return otherParticipants[0].displayName;
	return otherParticipants.map((p) => p.displayName).join(', ');
}
