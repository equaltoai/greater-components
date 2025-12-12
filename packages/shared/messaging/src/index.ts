/**
 * Messages Components
 *
 * Complete direct messaging system for private conversations in ActivityPub/Fediverse applications.
 * Supports threaded conversations, real-time messaging, and read receipts.
 *
 * @module components/Messages
 *
 * @example
 * ```svelte
 * <script>
 *   import * as Messages from '@equaltoai/greater-components/faces/social/Messages';
 *
 *   const handlers = {
 *     onFetchConversations: async () => {
 *       const response = await fetch('/api/messages/conversations');
 *       return await response.json();
 *     },
 *     onFetchMessages: async (conversationId) => {
 *       const response = await fetch(`/api/messages/${conversationId}`);
 *       return await response.json();
 *     },
 *     onSendMessage: async (conversationId, content) => {
 *       const response = await fetch(`/api/messages/${conversationId}`, {
 *         method: 'POST',
 *         body: JSON.stringify({ content }),
 *       });
 *       return await response.json();
 *     },
 *   };
 * </script>
 *
 * <Messages.Root {handlers}>
 *   <Messages.Conversations currentUserId="me" />
 *   <div style="flex: 1; display: flex; flex-direction: column;">
 *     <Messages.Thread />
 *     <Messages.Composer />
 *   </div>
 * </Messages.Root>
 * ```
 */

export { default as Root } from './Root.svelte';
export { default as Conversations } from './Conversations.svelte';
export { default as Thread } from './Thread.svelte';
export { default as Composer } from './Composer.svelte';
export { default as Message } from './Message.svelte';
export { default as NewConversation } from './NewConversation.svelte';
export { default as MediaUpload } from './MediaUpload.svelte';
export { default as UnreadIndicator } from './UnreadIndicator.svelte';
export { default as ConversationPicker } from './ConversationPicker.svelte';

// Export types and context utilities
export type {
	MessageParticipant,
	DirectMessage,
	Conversation,
	MessagesHandlers,
	MessagesState,
	MessagesContext,
} from './context.svelte.js';

export {
	createMessagesContext,
	getMessagesContext,
	formatMessageTime,
	getConversationName,
} from './context.svelte.js';
