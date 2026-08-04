/**
 * GraphQL AST and response shapes used by the messaging binding.
 *
 * These deliberately model only the structural GraphQL document contract that the binding needs.
 * Keeping this module dependency-free lets source-installed consumers provide a non-Apollo adapter
 * without pulling Apollo or GraphQL's type packages into their typecheck.
 */
export interface MessagesDocumentNode<
	TData extends Record<string, unknown>,
	TVariables extends Record<string, unknown>,
> {
	/** Opaque GraphQL Document kind; the runtime value is `Document`. */
	readonly kind: never;
	/** Opaque executable definitions owned by this binding. */
	readonly definitions: readonly never[];
	readonly __apiType?: (variables: TVariables) => TData;
}
export interface LesserMessageActor {
	id: string;
	username: string;
	domain?: string | null;
	displayName?: string | null;
	avatar?: string | null;
}
export interface LesserMessageObject {
	id: string;
	content: string;
	createdAt: string;
	sensitive: boolean;
	spoilerText?: string | null;
	actor: LesserMessageActor;
	attachments: ReadonlyArray<{
		url: string;
		type: string;
		preview?: string | null;
		description?: string | null;
	}>;
}
export interface LesserMessageConversation {
	id: string;
	unread: boolean;
	updatedAt: string;
	accounts: ReadonlyArray<LesserMessageActor>;
	lastStatus?: LesserMessageObject | null;
	viewerMetadata: {
		requestState: 'PENDING' | 'ACCEPTED' | 'DECLINED';
		requestedAt?: string | null;
		acceptedAt?: string | null;
		declinedAt?: string | null;
	};
}
export type ConversationMessagesVariables = Record<string, unknown> & {
	conversationId: string;
	first?: number;
	after?: string;
};
export type ConversationMessagesData = Record<string, unknown> & {
	conversationMessages: {
		edges: ReadonlyArray<{
			node: LesserMessageObject;
		}>;
	};
};
export type SendMessageVariables = Record<string, unknown> & {
	conversationId: string;
	content: string;
	mediaIds?: string[];
};
export type SendMessageData = Record<string, unknown> & {
	sendMessage: {
		message: LesserMessageObject;
	};
};
export type CreateConversationVariables = Record<string, unknown> & {
	participantId: string;
};
export type CreateConversationData = Record<string, unknown> & {
	createConversation: LesserMessageConversation;
};
export type ConversationIdVariables = Record<string, unknown> & {
	conversationId: string;
};
export type AcceptMessageRequestData = Record<string, unknown> & {
	acceptMessageRequest: LesserMessageConversation;
};
export type DeclineMessageRequestData = Record<string, unknown> & {
	declineMessageRequest: boolean;
};
export type DeleteConversationData = Record<string, unknown> & {
	deleteConversation: boolean;
};
export type MessageIdVariables = Record<string, unknown> & {
	messageId: string;
};
export type DeleteMessageData = Record<string, unknown> & {
	deleteMessage: boolean;
};
export declare const ConversationMessagesDocument: MessagesDocumentNode<
	ConversationMessagesData,
	ConversationMessagesVariables
>;
export declare const SendMessageDocument: MessagesDocumentNode<
	SendMessageData,
	SendMessageVariables
>;
export declare const CreateConversationDocument: MessagesDocumentNode<
	CreateConversationData,
	CreateConversationVariables
>;
export declare const AcceptMessageRequestDocument: MessagesDocumentNode<
	AcceptMessageRequestData,
	ConversationIdVariables
>;
export declare const DeclineMessageRequestDocument: MessagesDocumentNode<
	DeclineMessageRequestData,
	ConversationIdVariables
>;
export declare const DeleteConversationDocument: MessagesDocumentNode<
	DeleteConversationData,
	ConversationIdVariables
>;
export declare const DeleteMessageDocument: MessagesDocumentNode<
	DeleteMessageData,
	MessageIdVariables
>;
//# sourceMappingURL=messagingOperations.d.ts.map
