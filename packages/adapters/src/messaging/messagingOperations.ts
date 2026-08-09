/**
 * GraphQL AST and response shapes used by the messaging binding.
 *
 * These deliberately model only the structural GraphQL document contract that the binding needs.
 * Keeping this module dependency-free lets source-installed consumers provide a non-Apollo adapter
 * without pulling Apollo or GraphQL's type packages into their typecheck.
 */

interface NameNode {
	readonly kind: 'Name';
	readonly value: string;
}

interface VariableNode {
	readonly kind: 'Variable';
	readonly name: NameNode;
}

interface NamedTypeNode {
	readonly kind: 'NamedType';
	readonly name: NameNode;
}

interface ListTypeNode {
	readonly kind: 'ListType';
	readonly type: TypeNode;
}

interface NonNullTypeNode {
	readonly kind: 'NonNullType';
	readonly type: NamedTypeNode | ListTypeNode;
}

type TypeNode = NamedTypeNode | ListTypeNode | NonNullTypeNode;

interface ArgumentNode {
	readonly kind: 'Argument';
	readonly name: NameNode;
	readonly value: VariableNode;
}

interface FieldNode {
	readonly kind: 'Field';
	readonly name: NameNode;
	readonly arguments?: readonly ArgumentNode[];
	readonly selectionSet?: SelectionSetNode;
}

interface SelectionSetNode {
	readonly kind: 'SelectionSet';
	readonly selections: readonly FieldNode[];
}

interface VariableDefinitionNode {
	readonly kind: 'VariableDefinition';
	readonly variable: VariableNode;
	readonly type: TypeNode;
}

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
	unreadCount?: number;
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
		edges: ReadonlyArray<{ cursor: string; node: LesserMessageObject }>;
		pageInfo: {
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			startCursor?: string | null;
			endCursor?: string | null;
		};
		totalCount: number;
	};
};

export type SendMessageVariables = Record<string, unknown> & {
	conversationId: string;
	content: string;
	mediaIds?: string[];
};

export type SendMessageData = Record<string, unknown> & {
	sendMessage: { message: LesserMessageObject };
};

export type CreateConversationVariables = Record<string, unknown> & { participantId: string };
export type CreateConversationData = Record<string, unknown> & {
	createConversation: LesserMessageConversation;
};

export type ConversationIdVariables = Record<string, unknown> & { conversationId: string };
export type AcceptMessageRequestData = Record<string, unknown> & {
	acceptMessageRequest: LesserMessageConversation;
};
export type DeclineMessageRequestData = Record<string, unknown> & {
	declineMessageRequest: boolean;
};
export type DeleteConversationData = Record<string, unknown> & { deleteConversation: boolean };

export type MessageIdVariables = Record<string, unknown> & { messageId: string };
export type DeleteMessageData = Record<string, unknown> & { deleteMessage: boolean };

const name = (value: string): NameNode => ({ kind: 'Name', value });
const variable = (value: string): VariableNode => ({ kind: 'Variable', name: name(value) });
const namedType = (value: string): NamedTypeNode => ({ kind: 'NamedType', name: name(value) });
const listType = (type: TypeNode): ListTypeNode => ({ kind: 'ListType', type });
const nonNull = (type: NamedTypeNode | ListTypeNode): NonNullTypeNode => ({
	kind: 'NonNullType',
	type,
});
const variableDefinition = (value: string, type: TypeNode): VariableDefinitionNode => ({
	kind: 'VariableDefinition',
	variable: variable(value),
	type,
});
const argument = (value: string): ArgumentNode => ({
	kind: 'Argument',
	name: name(value),
	value: variable(value),
});
const selectionSet = (selections: readonly FieldNode[]): SelectionSetNode => ({
	kind: 'SelectionSet',
	selections,
});
const field = (
	value: string,
	options: { arguments?: readonly ArgumentNode[]; selections?: readonly FieldNode[] } = {}
): FieldNode => ({
	kind: 'Field',
	name: name(value),
	...(options.arguments ? { arguments: options.arguments } : {}),
	...(options.selections ? { selectionSet: selectionSet(options.selections) } : {}),
});

const actorFields = [
	field('id'),
	field('username'),
	field('domain'),
	field('displayName'),
	field('avatar'),
];

const messageFields = [
	field('id'),
	field('content'),
	field('createdAt'),
	field('sensitive'),
	field('spoilerText'),
	field('actor', { selections: actorFields }),
	field('attachments', {
		selections: [field('url'), field('type'), field('preview'), field('description')],
	}),
];

const conversationFields = [
	field('id'),
	field('unread'),
	field('unreadCount'),
	field('updatedAt'),
	field('accounts', { selections: actorFields }),
	field('lastStatus', { selections: messageFields }),
	field('viewerMetadata', {
		selections: [
			field('requestState'),
			field('requestedAt'),
			field('acceptedAt'),
			field('declinedAt'),
		],
	}),
];

function operation<
	TData extends Record<string, unknown>,
	TVariables extends Record<string, unknown>,
>(
	operationType: 'query' | 'mutation',
	operationName: string,
	variables: readonly VariableDefinitionNode[],
	rootField: FieldNode
): MessagesDocumentNode<TData, TVariables> {
	return {
		kind: 'Document',
		definitions: [
			{
				kind: 'OperationDefinition',
				operation: operationType,
				name: name(operationName),
				variableDefinitions: variables,
				selectionSet: selectionSet([rootField]),
			},
		],
	} as unknown as MessagesDocumentNode<TData, TVariables>;
}

export const ConversationMessagesDocument = operation<
	ConversationMessagesData,
	ConversationMessagesVariables
>(
	'query',
	'ConversationMessages',
	[
		variableDefinition('conversationId', nonNull(namedType('ID'))),
		variableDefinition('first', namedType('Int')),
		variableDefinition('after', namedType('Cursor')),
	],
	field('conversationMessages', {
		arguments: [argument('conversationId'), argument('first'), argument('after')],
		selections: [
			field('edges', {
				selections: [field('cursor'), field('node', { selections: messageFields })],
			}),
			field('pageInfo', {
				selections: [
					field('hasNextPage'),
					field('hasPreviousPage'),
					field('startCursor'),
					field('endCursor'),
				],
			}),
			field('totalCount'),
		],
	})
);

export const SendMessageDocument = operation<SendMessageData, SendMessageVariables>(
	'mutation',
	'SendMessage',
	[
		variableDefinition('conversationId', nonNull(namedType('ID'))),
		variableDefinition('content', nonNull(namedType('String'))),
		variableDefinition('mediaIds', listType(nonNull(namedType('ID')))),
	],
	field('sendMessage', {
		arguments: [argument('conversationId'), argument('content'), argument('mediaIds')],
		selections: [field('message', { selections: messageFields })],
	})
);

export const CreateConversationDocument = operation<
	CreateConversationData,
	CreateConversationVariables
>(
	'mutation',
	'CreateConversation',
	[variableDefinition('participantId', nonNull(namedType('ID')))],
	field('createConversation', {
		arguments: [argument('participantId')],
		selections: conversationFields,
	})
);

export const AcceptMessageRequestDocument = operation<
	AcceptMessageRequestData,
	ConversationIdVariables
>(
	'mutation',
	'AcceptMessageRequest',
	[variableDefinition('conversationId', nonNull(namedType('ID')))],
	field('acceptMessageRequest', {
		arguments: [argument('conversationId')],
		selections: conversationFields,
	})
);

export const DeclineMessageRequestDocument = operation<
	DeclineMessageRequestData,
	ConversationIdVariables
>(
	'mutation',
	'DeclineMessageRequest',
	[variableDefinition('conversationId', nonNull(namedType('ID')))],
	field('declineMessageRequest', { arguments: [argument('conversationId')] })
);

export const DeleteConversationDocument = operation<
	DeleteConversationData,
	ConversationIdVariables
>(
	'mutation',
	'DeleteConversation',
	[variableDefinition('conversationId', nonNull(namedType('ID')))],
	field('deleteConversation', { arguments: [argument('conversationId')] })
);

export const DeleteMessageDocument = operation<DeleteMessageData, MessageIdVariables>(
	'mutation',
	'DeleteMessage',
	[variableDefinition('messageId', nonNull(namedType('ID')))],
	field('deleteMessage', { arguments: [argument('messageId')] })
);
