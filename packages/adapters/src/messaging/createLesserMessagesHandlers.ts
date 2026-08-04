import {
	AcceptMessageRequestDocument,
	ConversationMessagesDocument,
	CreateConversationDocument,
	DeclineMessageRequestDocument,
	DeleteConversationDocument,
	DeleteMessageDocument,
	SendMessageDocument,
} from './messagingOperations.js';
import type {
	LesserMessageActor,
	LesserMessageConversation,
	LesserMessageObject,
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
		options?: { limit?: number; cursor?: string }
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
	search: (variables: {
		query: string;
		type: 'accounts';
		first?: number;
	}) => Promise<{ accounts: ReadonlyArray<LesserMessageActor> }>;
	subscribeToConversationUpdates: () => {
		subscribe(observer: {
			next: (value: { data?: { conversationUpdates?: { id: string } | null } | null }) => void;
			error: (error: unknown) => void;
			complete: () => void;
		}): { unsubscribe(): void };
	};
}

export interface LesserMessagesHandlersConfig {
	adapter: LesserMessagesAdapter;
	pageSize?: number;
	messagePageSize?: number;
	searchLimit?: number;
}

type LesserConversationLike = LesserMessageConversation;

function getCanonicalParticipantId(actor: Pick<LesserMessageActor, 'id' | 'username' | 'domain'>) {
	if (actor.domain) {
		return actor.id;
	}

	const localUserPath = /^\/users\/([^/]+)\/?$/;
	const directPathMatch = actor.id.match(localUserPath);
	if (directPathMatch?.[1] === actor.username) {
		return actor.username;
	}

	try {
		const url = new URL(actor.id);
		const urlPathMatch = url.pathname.match(localUserPath);
		if (urlPathMatch?.[1] === actor.username) {
			return actor.username;
		}
	} catch {
		// Ignore unparseable ids and fall back to the original identifier.
	}

	return actor.id;
}

function getParticipantHandle(actor: Pick<LesserMessageActor, 'username' | 'domain'>): string {
	return actor.domain ? `${actor.username}@${actor.domain}` : actor.username;
}

function mapActorToParticipant(actor: LesserMessageActor): MessageParticipant {
	return {
		id: getCanonicalParticipantId(actor),
		actorId: actor.id,
		username: actor.username,
		displayName: actor.displayName ?? actor.username,
		avatar: actor.avatar ?? undefined,
		handle: getParticipantHandle(actor),
	};
}

function mapObjectToDirectMessage(
	object: LesserMessageObject,
	conversationId: string
): DirectMessage {
	return {
		id: object.id,
		conversationId,
		sender: mapActorToParticipant(object.actor),
		content: object.content,
		createdAt: object.createdAt,
		read: true,
		sensitive: object.sensitive,
		spoilerText: object.spoilerText ?? null,
		mediaAttachments: object.attachments.map((attachment) => ({
			url: attachment.url,
			type: attachment.type,
			previewUrl: attachment.preview ?? undefined,
			description: attachment.description ?? undefined,
		})),
	};
}

function mapConversationToUiConversation(
	conversation: LesserConversationLike,
	folder: ConversationFolder
): Conversation {
	return {
		id: conversation.id,
		folder,
		requestState: conversation.viewerMetadata.requestState,
		requestedAt: conversation.viewerMetadata.requestedAt ?? null,
		acceptedAt: conversation.viewerMetadata.acceptedAt ?? null,
		declinedAt: conversation.viewerMetadata.declinedAt ?? null,
		participants: conversation.accounts.map(mapActorToParticipant),
		lastMessage: conversation.lastStatus
			? mapObjectToDirectMessage(conversation.lastStatus, conversation.id)
			: undefined,
		unreadCount: conversation.unread ? 1 : 0,
		updatedAt: conversation.updatedAt,
	};
}

export function createLesserMessagesHandlers(
	config: LesserMessagesHandlersConfig
): MessagesHandlers {
	const { adapter, pageSize = 20, messagePageSize = 50, searchLimit = 10 } = config;

	return {
		onFetchConversations: async (folder = 'INBOX') => {
			const conversations = (await adapter.getConversations({
				folder,
				first: pageSize,
			})) as unknown as LesserConversationLike[];

			return conversations.map((conversation) =>
				mapConversationToUiConversation(conversation, folder)
			);
		},
		onFetchMessages: async (conversationId, options) => {
			const data = await adapter.query(ConversationMessagesDocument, {
				conversationId,
				first: options?.limit ?? messagePageSize,
				after: options?.cursor,
			});

			return data.conversationMessages.edges.map((edge) =>
				mapObjectToDirectMessage(edge.node, conversationId)
			);
		},
		onSendMessage: async (conversationId, content, mediaIds) => {
			const data = await adapter.mutate(SendMessageDocument, {
				conversationId,
				content,
				mediaIds: mediaIds && mediaIds.length > 0 ? mediaIds : undefined,
			});

			return mapObjectToDirectMessage(data.sendMessage.message, conversationId);
		},
		onCreateConversation: async (participantIds) => {
			if (participantIds.length !== 1) {
				throw new Error('DM v1 only supports 1:1 conversations');
			}

			const participantId = participantIds[0];
			if (participantId === undefined) {
				throw new Error('participantId is required for DM conversation creation');
			}

			const data = await adapter.mutate(CreateConversationDocument, {
				participantId,
			});

			return mapConversationToUiConversation(
				data.createConversation as unknown as LesserConversationLike,
				'INBOX'
			);
		},
		onAcceptMessageRequest: async (conversationId) => {
			const data = await adapter.mutate(AcceptMessageRequestDocument, {
				conversationId,
			});

			return mapConversationToUiConversation(
				data.acceptMessageRequest as unknown as LesserConversationLike,
				'INBOX'
			);
		},
		onDeclineMessageRequest: async (conversationId) => {
			const data = await adapter.mutate(DeclineMessageRequestDocument, {
				conversationId,
			});

			return data.declineMessageRequest;
		},
		onMarkRead: async (conversationId) => {
			await adapter.markConversationAsRead(conversationId);
		},
		onDeleteMessage: async (messageId) => {
			const data = await adapter.mutate(DeleteMessageDocument, { messageId });
			return data.deleteMessage;
		},
		onDeleteConversation: async (conversationId) => {
			const data = await adapter.mutate(DeleteConversationDocument, { conversationId });
			return data.deleteConversation;
		},
		onSearchParticipants: async (query) => {
			const results = await adapter.search({
				query,
				type: 'accounts',
				first: searchLimit,
			});

			return results.accounts.map(mapActorToParticipant);
		},
		onSubscribeToConversationUpdates: (callbacks) => {
			callbacks.onConnectionStatusChange?.('connecting');

			const sub = adapter.subscribeToConversationUpdates().subscribe({
				next: ({ data }) => {
					const conversationId = data?.conversationUpdates?.id;
					if (!conversationId) {
						return;
					}

					void adapter
						.getConversation(conversationId)
						.then((conversation) => {
							if (!conversation) {
								return;
							}

							const requestState = conversation.viewerMetadata.requestState ?? 'ACCEPTED';
							const folder: ConversationFolder = requestState === 'PENDING' ? 'REQUESTS' : 'INBOX';
							const uiConversation = mapConversationToUiConversation(
								conversation as unknown as LesserConversationLike,
								folder
							);

							callbacks.onConversationUpdate({
								conversation: uiConversation,
								message: uiConversation.lastMessage,
							});
						})
						.catch(() => {
							// Ignore per-event fetch errors; the caller can fall back to polling.
						});
				},
				error: (error) => {
					const message = error instanceof Error ? error.message : 'Realtime unavailable';
					callbacks.onConnectionStatusChange?.('error', message);
				},
				complete: () => {
					callbacks.onConnectionStatusChange?.('disconnected');
				},
			});

			callbacks.onConnectionStatusChange?.('connected');

			return () => {
				sub.unsubscribe();
			};
		},
	};
}
