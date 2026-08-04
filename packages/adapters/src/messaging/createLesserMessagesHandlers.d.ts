import type {
	LesserMessageActor,
	LesserMessageConversation,
	MessagesDocumentNode,
} from './messagingOperations.js';
export type ConversationFolder = 'INBOX' | 'REQUESTS';
export type DmRequestState = 'PENDING' | 'ACCEPTED' | 'DECLINED';
export type RealtimeConnectionStatus =
	'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
export interface MessageParticipant {
	id: string;
	actorId?: string;
	username: string;
	displayName: string;
	avatar?: string;
	handle?: string;
}
export interface DirectMessage {
	id: string;
	conversationId: string;
	sender: MessageParticipant;
	content: string;
	createdAt: string;
	read: boolean;
	sensitive?: boolean;
	spoilerText?: string | null;
	mediaAttachments?: {
		url: string;
		type: string;
		previewUrl?: string;
		description?: string;
	}[];
}
export interface Conversation {
	id: string;
	folder: ConversationFolder;
	requestState: DmRequestState;
	requestedAt: string | null;
	acceptedAt: string | null;
	declinedAt: string | null;
	participants: MessageParticipant[];
	lastMessage?: DirectMessage;
	unreadCount: number;
	updatedAt: string;
}
export interface ConversationRealtimeUpdate {
	conversation: Conversation;
	message?: DirectMessage;
}
export interface MessagesRealtimeCallbacks {
	onConversationUpdate: (update: ConversationRealtimeUpdate) => void;
	onConnectionStatusChange?: (status: RealtimeConnectionStatus, reason?: string) => void;
}
export interface MessagesHandlers {
	onFetchConversations?: (folder?: ConversationFolder) => Promise<Conversation[]>;
	onFetchMessages?: (
		conversationId: string,
		options?: {
			limit?: number;
			cursor?: string;
		}
	) => Promise<DirectMessage[]>;
	onSendMessage?: (
		conversationId: string,
		content: string,
		mediaIds?: string[]
	) => Promise<DirectMessage>;
	onMarkRead?: (conversationId: string) => Promise<void>;
	onDeleteMessage?: (messageId: string) => Promise<boolean>;
	onDeleteConversation?: (conversationId: string) => Promise<boolean>;
	onCreateConversation?: (participantIds: string[]) => Promise<Conversation>;
	onAcceptMessageRequest?: (conversationId: string) => Promise<Conversation>;
	onDeclineMessageRequest?: (conversationId: string) => Promise<boolean>;
	onSearchParticipants?: (query: string) => Promise<MessageParticipant[]>;
	onSubscribeToConversationUpdates?: (callbacks: MessagesRealtimeCallbacks) => () => void;
}
export interface LesserMessagesAdapter {
	query: <
		TData extends Record<string, unknown>,
		TVariables extends Record<string, unknown> = Record<string, unknown>,
	>(
		document: MessagesDocumentNode<TData, TVariables>,
		variables?: TVariables
	) => Promise<TData>;
	mutate: <
		TData extends Record<string, unknown>,
		TVariables extends Record<string, unknown> = Record<string, unknown>,
	>(
		document: MessagesDocumentNode<TData, TVariables>,
		variables?: TVariables
	) => Promise<TData>;
	getConversations: (variables: {
		folder?: ConversationFolder;
		first?: number;
		after?: string;
	}) => Promise<ReadonlyArray<LesserMessageConversation>>;
	getConversation: (id: string) => Promise<LesserMessageConversation | null | undefined>;
	markConversationAsRead: (id: string) => Promise<unknown>;
	search: (variables: { query: string; type: 'accounts'; first?: number }) => Promise<{
		accounts: ReadonlyArray<LesserMessageActor>;
	}>;
	subscribeToConversationUpdates: () => {
		subscribe(observer: {
			next: (value: {
				data?: {
					conversationUpdates?: {
						id: string;
					} | null;
				} | null;
			}) => void;
			error: (error: unknown) => void;
			complete: () => void;
		}): {
			unsubscribe(): void;
		};
	};
}
export interface LesserMessagesHandlersConfig {
	adapter: LesserMessagesAdapter;
	pageSize?: number;
	messagePageSize?: number;
	searchLimit?: number;
}
export declare function createLesserMessagesHandlers(
	config: LesserMessagesHandlersConfig
): MessagesHandlers;
//# sourceMappingURL=createLesserMessagesHandlers.d.ts.map
