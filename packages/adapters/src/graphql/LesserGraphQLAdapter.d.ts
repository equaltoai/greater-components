/**
 * Lesser GraphQL Adapter aligned with the current Lesser schema.
 *
 * Provides typed accessors and convenience helpers around the generated
 * GraphQL operations. Consumers should migrate towards the generic timeline
 * and object accessors rather than the legacy Mastodon-style wrappers.
 */
import { Observable, type FetchResult, type OperationVariables } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { LesserMessagesAdapter } from '../messaging/createLesserMessagesHandlers.js';
import { type GraphQLClientConfig } from './client.js';
import type {
	TimelineQueryVariables,
	TimelineType,
	NotificationsQueryVariables,
	SearchQueryVariables,
	CreateNoteMutationVariables,
	CreateQuoteNoteMutationVariables,
	CreateListMutationVariables,
	UpdateListMutationVariables,
	ConversationsQueryVariables,
	ConversationMessagesQueryVariables,
	CreateConversationMutationVariables,
	SendMessageMutationVariables,
	AcceptMessageRequestMutationVariables,
	DeclineMessageRequestMutationVariables,
	DeleteMessageMutationVariables,
	UpdateRelationshipMutationVariables,
	AgentsQueryVariables,
	AgentActivityQueryVariables,
	AgentAccessLeasesQueryVariables,
	AgentMemorySearchQueryVariables,
	RegisterAgentMutationVariables,
	UpdateAgentMutationVariables,
	DelegateToAgentMutationVariables,
	CreateAgentAccessLeasePrincipalChallengeMutationVariables,
	CreateAgentAccessLeaseAgentChallengeMutationVariables,
	CreateAgentAccessLeaseMutationVariables,
	RevokeAgentAccessLeaseMutationVariables,
	CreateAgentAccessLeaseSessionKeyChallengeMutationVariables,
	AuthorizeAgentAccessLeaseSessionKeyMutationVariables,
	ExchangeAgentAccessLeaseTokenMutationVariables,
	UpdateAdminAgentPolicyMutationVariables,
	AdminVerifyAgentMutationVariables,
	AdminUnverifyAgentMutationVariables,
	TimelineUpdatesSubscription,
	TimelineUpdatesSubscriptionVariables,
	NotificationStreamSubscription,
	NotificationStreamSubscriptionVariables,
	ConversationUpdatesSubscription,
	ListUpdatesSubscription,
	ListUpdatesSubscriptionVariables,
	QuoteActivitySubscription,
	QuoteActivitySubscriptionVariables,
	HashtagActivitySubscription,
	HashtagActivitySubscriptionVariables,
	ActivityStreamSubscription,
	ActivityStreamSubscriptionVariables,
	RelationshipUpdatesSubscription,
	RelationshipUpdatesSubscriptionVariables,
	CostUpdatesSubscription,
	CostUpdatesSubscriptionVariables,
	ModerationEventsSubscription,
	ModerationEventsSubscriptionVariables,
	TrustUpdatesSubscription,
	TrustUpdatesSubscriptionVariables,
	AiAnalysisUpdatesSubscription,
	AiAnalysisUpdatesSubscriptionVariables,
	MetricsUpdatesSubscription,
	MetricsUpdatesSubscriptionVariables,
	ModerationAlertsSubscription,
	ModerationAlertsSubscriptionVariables,
	CostAlertsSubscription,
	CostAlertsSubscriptionVariables,
	BudgetAlertsSubscription,
	BudgetAlertsSubscriptionVariables,
	FederationHealthUpdatesSubscription,
	FederationHealthUpdatesSubscriptionVariables,
	ModerationQueueUpdateSubscription,
	ModerationQueueUpdateSubscriptionVariables,
	ThreatIntelligenceSubscription,
	PerformanceAlertSubscription,
	PerformanceAlertSubscriptionVariables,
	InfrastructureEventSubscription,
	AgentActivityUpdatesSubscription,
	AgentActivityUpdatesSubscriptionVariables,
	RelationshipQuery,
	ModerationPatternInput,
	HashtagNotificationSettingsInput,
	NotificationLevel,
	UploadMediaInput,
	UploadMediaMutation,
	UpdateMediaMutationVariables,
	Actor,
	SharedDraftReviewsQueryVariables,
	ShareDraftForReviewMutation,
	SubmitDraftReviewMutationVariables,
	DraftReviewVerdict,
} from './generated/types.js';
export type ViewerQuery = {
	viewer: Actor;
};
export type LesserGraphQLAdapterConfig = GraphQLClientConfig;
export type TimelineVariables = TimelineQueryVariables;
export type SearchVariables = SearchQueryVariables;
export type CreateNoteVariables = CreateNoteMutationVariables;
export type ConversationMessagesVariables = ConversationMessagesQueryVariables;
export type CreateConversationVariables = CreateConversationMutationVariables;
export type SendMessageVariables = SendMessageMutationVariables;
export type UpdateMediaVariables = UpdateMediaMutationVariables;
export declare class LesserGraphQLAdapterError extends Error {
	readonly code: string;
	readonly debugMessages: readonly string[];
	/**
	 * Server-defined `extensions.code` values carried by the failure, e.g.
	 * `UNPROCESSABLE_ENTITY` or `CONFLICT`.
	 *
	 * Lesser's GraphQL error presenter sets `extensions.code` from its
	 * structured `AppError` codes (cmd/graphql/main.go `graphQLErrorPresenter`).
	 * The code is contract surface rather than server detail, so it survives
	 * the user-safe sanitisation that strips messages — callers need it to tell
	 * an expected condition from a genuine fault.
	 */
	readonly serverCodes: readonly string[];
	constructor(
		message: string,
		options?: {
			code?: string;
			debugMessages?: readonly string[];
			serverCodes?: readonly string[];
			cause?: unknown;
		}
	);
}
/** The `DraftReview` payload returned by a successful share. */
export type SharedDraftReview = ShareDraftForReviewMutation['shareDraftForReview'];
/**
 * Result of {@link LesserGraphQLAdapter.shareDraftForReviewIfAbsent}.
 *
 * `already-invited` deliberately carries no `review`: the share was refused, so
 * there is no server state to report and nothing for the caller to mistake for
 * success.
 */
export type ShareDraftForReviewOutcome =
	| {
			status: 'invited';
			review: SharedDraftReview;
	  }
	| {
			status: 'already-invited';
			draftId: string;
			reviewer: string;
			cause: unknown;
	  };
/**
 * True when a failed share was refused because the grant already exists.
 *
 * Classification is by `extensions.code` only. The obvious alternative —
 * matching the failure text — was deliberately rejected: server message strings
 * are not contract, so a wording change upstream would silently reclassify a
 * genuine fault as a benign "already invited" notice, and a substring as broad
 * as "duplicate" can appear in failures that have nothing to do with this grant.
 * Presenting a fault as an expected condition is the worse error in both
 * directions.
 *
 * The upstream gap is closed at the pinned v1.6.0: `CreateDraftReviewGrant`
 * wraps a failed conditional create as `DynamoDBConditionalCheckFailed`, which
 * maps to `CodeConflict` (`CONFLICT`) and reaches GraphQL `extensions.code`.
 * This function already recognises that code; see
 * `docs/lesser/contracts/upstream-gaps.md`.
 */
export declare function isDraftReviewShareConflict(error: unknown): boolean;
export declare class LesserGraphQLAdapter implements LesserMessagesAdapter {
	private readonly client;
	private readonly httpEndpoint;
	private readonly baseHeaders;
	private authToken;
	constructor(config: LesserGraphQLAdapterConfig);
	updateToken(token: string | null): void;
	/**
	 * Verify credentials and fetch current authenticated user
	 *
	 * @returns The authenticated actor/user account
	 * @throws Error if not authenticated or credentials invalid
	 */
	verifyCredentials(): Promise<Actor>;
	/**
	 * Check if currently authenticated
	 */
	isAuthenticated(): boolean;
	/**
	 * Get current auth token
	 */
	getToken(): string | null;
	/**
	 * Refresh authentication token
	 * @param newToken - New token to use
	 */
	refreshToken(newToken: string): void;
	close(): void;
	query<
		TData extends Record<string, unknown>,
		TVariables extends OperationVariables = OperationVariables,
	>(
		document: TypedDocumentNode<TData, TVariables>,
		variables?: TVariables,
		fetchPolicy?: 'cache-first' | 'network-only'
	): Promise<TData>;
	mutate<
		TData extends Record<string, unknown>,
		TVariables extends OperationVariables = OperationVariables,
	>(document: TypedDocumentNode<TData, TVariables>, variables?: TVariables): Promise<TData>;
	private static hasMissingTargetIdError;
	private buildUploadMediaFormData;
	fetchTimeline(variables: TimelineQueryVariables): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	fetchHomeTimeline(
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	fetchPublicTimeline(
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>,
		scope?: Extract<TimelineType, 'PUBLIC' | 'LOCAL'>
	): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	fetchDirectTimeline(
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	fetchHashtagTimeline(
		hashtag: string,
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	fetchListTimeline(
		listId: string,
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	fetchActorTimeline(
		actorId: string,
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after' | 'mediaOnly'>>
	): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	getObject(id: string): Promise<
		| {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
		  }
		| null
		| undefined
	>;
	getActorById(id: string): Promise<
		| {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
		  }
		| null
		| undefined
	>;
	getActorByUsername(username: string): Promise<
		| {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
		  }
		| null
		| undefined
	>;
	getInstance(): Promise<{
		readonly __typename: 'InstanceInfo';
		readonly domain: string;
		readonly title: string;
		readonly shortDescription?: string | null | undefined;
		readonly description: string;
		readonly email?: string | null | undefined;
		readonly version: string;
		readonly sourceUrl?: string | null | undefined;
		readonly streamingUrl?: string | null | undefined;
		readonly thumbnailUrl?: string | null | undefined;
		readonly languages: ReadonlyArray<string>;
		readonly registrationsOpen: boolean;
		readonly approvalRequired: boolean;
		readonly invitesEnabled: boolean;
		readonly userCount: number;
		readonly statusCount: number;
		readonly domainCount: number;
		readonly contactAccount?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
			  }
			| null
			| undefined;
		readonly rules: ReadonlyArray<{
			readonly __typename: 'InstanceRule';
			readonly id: string;
			readonly text: string;
		}>;
		readonly tips: {
			readonly __typename: 'TipsConfig';
			readonly enabled: boolean;
			readonly chainId?: number | null | undefined;
			readonly contractAddress?: string | null | undefined;
		};
	}>;
	getAgentByUsername(username: string): Promise<
		| {
				readonly __typename: 'Agent';
				readonly id: string;
				readonly username: string;
				readonly displayName: string;
				readonly bio?: string | null | undefined;
				readonly agentType: import('./index.js').AgentType;
				readonly agentVersion: string;
				readonly agentOwner?: string | null | undefined;
				readonly delegatedScopes: ReadonlyArray<string>;
				readonly verified: boolean;
				readonly verifiedAt?: string | null | undefined;
				readonly createdAt: string;
				readonly activityCount: number;
				readonly agentCapabilities: {
					readonly __typename: 'AgentCapabilities';
					readonly canPost: boolean;
					readonly canReply: boolean;
					readonly canBoost: boolean;
					readonly canFollow: boolean;
					readonly canDM: boolean;
					readonly maxPostsPerHour: number;
					readonly requiresApproval: boolean;
					readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
				};
				readonly ownerActor?:
					| {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined
	>;
	getAgents(variables?: AgentsQueryVariables): Promise<{
		readonly __typename: 'AgentConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'AgentEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Agent';
				readonly id: string;
				readonly username: string;
				readonly displayName: string;
				readonly bio?: string | null | undefined;
				readonly agentType: import('./index.js').AgentType;
				readonly agentVersion: string;
				readonly agentOwner?: string | null | undefined;
				readonly delegatedScopes: ReadonlyArray<string>;
				readonly verified: boolean;
				readonly verifiedAt?: string | null | undefined;
				readonly createdAt: string;
				readonly activityCount: number;
				readonly agentCapabilities: {
					readonly __typename: 'AgentCapabilities';
					readonly canPost: boolean;
					readonly canReply: boolean;
					readonly canBoost: boolean;
					readonly canFollow: boolean;
					readonly canDM: boolean;
					readonly maxPostsPerHour: number;
					readonly requiresApproval: boolean;
					readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
				};
				readonly ownerActor?:
					| {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	getMyAgents(): Promise<
		readonly {
			readonly __typename: 'Agent';
			readonly id: string;
			readonly username: string;
			readonly displayName: string;
			readonly bio?: string | null | undefined;
			readonly agentType: import('./index.js').AgentType;
			readonly agentVersion: string;
			readonly agentOwner?: string | null | undefined;
			readonly delegatedScopes: ReadonlyArray<string>;
			readonly verified: boolean;
			readonly verifiedAt?: string | null | undefined;
			readonly createdAt: string;
			readonly activityCount: number;
			readonly agentCapabilities: {
				readonly __typename: 'AgentCapabilities';
				readonly canPost: boolean;
				readonly canReply: boolean;
				readonly canBoost: boolean;
				readonly canFollow: boolean;
				readonly canDM: boolean;
				readonly maxPostsPerHour: number;
				readonly requiresApproval: boolean;
				readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
			};
			readonly ownerActor?:
				| {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
				  }
				| null
				| undefined;
		}[]
	>;
	getMySouls(): Promise<
		readonly {
			readonly __typename: 'SoulInventoryItem';
			readonly bindingState: import('./index.js').SoulBindingState;
			readonly availableForIncorporation: boolean;
			readonly agent: {
				readonly __typename: 'SoulAgentIdentity';
				readonly agentId: string;
				readonly domain: string;
				readonly localId: string;
				readonly ensName?: string | null | undefined;
				readonly wallet: string;
				readonly principalAddress?: string | null | undefined;
				readonly status: string;
				readonly lifecycleStatus?: string | null | undefined;
				readonly selfDescriptionVersion?: number | null | undefined;
				readonly capabilities: ReadonlyArray<string>;
				readonly mintTxHash?: string | null | undefined;
				readonly mintedAt?: string | null | undefined;
				readonly updatedAt?: string | null | undefined;
			};
			readonly binding?:
				| {
						readonly __typename: 'SoulAgentBinding';
						readonly agentUsername: string;
						readonly principalAddress?: string | null | undefined;
						readonly boundAt: string;
						readonly updatedAt: string;
				  }
				| null
				| undefined;
		}[]
	>;
	getAgentActivity(variables: AgentActivityQueryVariables): Promise<{
		readonly __typename: 'AgentActivityConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'AgentActivityEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'AgentActivityEvent';
				readonly eventId: string;
				readonly agentUsername: string;
				readonly action: string;
				readonly targetId?: string | null | undefined;
				readonly metadataJson?: string | null | undefined;
				readonly timestamp: string;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	getAgentAccessLeases(variables: AgentAccessLeasesQueryVariables): Promise<
		readonly {
			readonly __typename: 'AgentAccessLease';
			readonly id: string;
			readonly username: string;
			readonly principalUsername: string;
			readonly principalWallet: string;
			readonly agentWallet: string;
			readonly scopes: ReadonlyArray<string>;
			readonly deviceLabel: string;
			readonly status: string;
			readonly idleTimeoutHours: number;
			readonly idleExpiresAt: string;
			readonly absoluteExpiresAt: string;
			readonly lastUsedAt: string;
			readonly leaseVersion: number;
			readonly sessionPublicKey?: string | null | undefined;
			readonly sessionKeyType?: string | null | undefined;
			readonly sessionKeyCreatedAt?: string | null | undefined;
			readonly sessionKeyLastUsedAt?: string | null | undefined;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly revokedAt?: string | null | undefined;
			readonly revokedBy?: string | null | undefined;
			readonly revokedReason?: string | null | undefined;
		}[]
	>;
	getAdminAgentPolicy(): Promise<{
		readonly __typename: 'AdminAgentPolicy';
		readonly allowAgents: boolean;
		readonly allowAgentRegistration: boolean;
		readonly defaultQuarantineDays: number;
		readonly maxAgentsPerOwner: number;
		readonly allowRemoteAgents: boolean;
		readonly remoteQuarantineDays: number;
		readonly blockedAgentDomains: ReadonlyArray<string>;
		readonly trustedAgentDomains: ReadonlyArray<string>;
		readonly agentMaxPostsPerHour: number;
		readonly verifiedAgentMaxPostsPerHour: number;
		readonly agentMaxFollowsPerHour: number;
		readonly verifiedAgentMaxFollowsPerHour: number;
		readonly hybridRetrievalEnabled: boolean;
		readonly hybridRetrievalMaxCandidates: number;
		readonly updatedAt: string;
	}>;
	updateAdminAgentPolicy(input: UpdateAdminAgentPolicyMutationVariables['input']): Promise<{
		readonly __typename: 'AdminAgentPolicy';
		readonly allowAgents: boolean;
		readonly allowAgentRegistration: boolean;
		readonly defaultQuarantineDays: number;
		readonly maxAgentsPerOwner: number;
		readonly allowRemoteAgents: boolean;
		readonly remoteQuarantineDays: number;
		readonly blockedAgentDomains: ReadonlyArray<string>;
		readonly trustedAgentDomains: ReadonlyArray<string>;
		readonly agentMaxPostsPerHour: number;
		readonly verifiedAgentMaxPostsPerHour: number;
		readonly agentMaxFollowsPerHour: number;
		readonly verifiedAgentMaxFollowsPerHour: number;
		readonly hybridRetrievalEnabled: boolean;
		readonly hybridRetrievalMaxCandidates: number;
		readonly updatedAt: string;
	}>;
	agentMemorySearch(variables: AgentMemorySearchQueryVariables): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	registerAgent(input: RegisterAgentMutationVariables['input']): Promise<{
		readonly __typename: 'RegisterAgentPayload';
		readonly agent: {
			readonly __typename: 'Agent';
			readonly id: string;
			readonly username: string;
			readonly displayName: string;
			readonly bio?: string | null | undefined;
			readonly agentType: import('./index.js').AgentType;
			readonly agentVersion: string;
			readonly agentOwner?: string | null | undefined;
			readonly delegatedScopes: ReadonlyArray<string>;
			readonly verified: boolean;
			readonly verifiedAt?: string | null | undefined;
			readonly createdAt: string;
			readonly activityCount: number;
			readonly agentCapabilities: {
				readonly __typename: 'AgentCapabilities';
				readonly canPost: boolean;
				readonly canReply: boolean;
				readonly canBoost: boolean;
				readonly canFollow: boolean;
				readonly canDM: boolean;
				readonly maxPostsPerHour: number;
				readonly requiresApproval: boolean;
				readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
			};
			readonly ownerActor?:
				| {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
				  }
				| null
				| undefined;
		};
	}>;
	updateAgent(
		username: string,
		input: UpdateAgentMutationVariables['input']
	): Promise<{
		readonly __typename: 'Agent';
		readonly id: string;
		readonly username: string;
		readonly displayName: string;
		readonly bio?: string | null | undefined;
		readonly agentType: import('./index.js').AgentType;
		readonly agentVersion: string;
		readonly agentOwner?: string | null | undefined;
		readonly delegatedScopes: ReadonlyArray<string>;
		readonly verified: boolean;
		readonly verifiedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly activityCount: number;
		readonly agentCapabilities: {
			readonly __typename: 'AgentCapabilities';
			readonly canPost: boolean;
			readonly canReply: boolean;
			readonly canBoost: boolean;
			readonly canFollow: boolean;
			readonly canDM: boolean;
			readonly maxPostsPerHour: number;
			readonly requiresApproval: boolean;
			readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
		};
		readonly ownerActor?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
			  }
			| null
			| undefined;
	}>;
	deleteAgent(username: string): Promise<{
		readonly __typename: 'Agent';
		readonly id: string;
		readonly username: string;
		readonly displayName: string;
		readonly bio?: string | null | undefined;
		readonly agentType: import('./index.js').AgentType;
		readonly agentVersion: string;
		readonly agentOwner?: string | null | undefined;
		readonly delegatedScopes: ReadonlyArray<string>;
		readonly verified: boolean;
		readonly verifiedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly activityCount: number;
		readonly agentCapabilities: {
			readonly __typename: 'AgentCapabilities';
			readonly canPost: boolean;
			readonly canReply: boolean;
			readonly canBoost: boolean;
			readonly canFollow: boolean;
			readonly canDM: boolean;
			readonly maxPostsPerHour: number;
			readonly requiresApproval: boolean;
			readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
		};
		readonly ownerActor?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
			  }
			| null
			| undefined;
	}>;
	delegateToAgent(input: DelegateToAgentMutationVariables['input']): Promise<{
		readonly __typename: 'DelegationPayload';
		readonly accessToken: string;
		readonly refreshToken: string;
		readonly tokenType: string;
		readonly scope: string;
		readonly createdAt: string;
		readonly expiresIn: number;
		readonly agent: {
			readonly __typename: 'Agent';
			readonly id: string;
			readonly username: string;
			readonly displayName: string;
			readonly bio?: string | null | undefined;
			readonly agentType: import('./index.js').AgentType;
			readonly agentVersion: string;
			readonly agentOwner?: string | null | undefined;
			readonly delegatedScopes: ReadonlyArray<string>;
			readonly verified: boolean;
			readonly verifiedAt?: string | null | undefined;
			readonly createdAt: string;
			readonly activityCount: number;
			readonly agentCapabilities: {
				readonly __typename: 'AgentCapabilities';
				readonly canPost: boolean;
				readonly canReply: boolean;
				readonly canBoost: boolean;
				readonly canFollow: boolean;
				readonly canDM: boolean;
				readonly maxPostsPerHour: number;
				readonly requiresApproval: boolean;
				readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
			};
			readonly ownerActor?:
				| {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
				  }
				| null
				| undefined;
		};
	}>;
	revokeAgentToken(username: string): Promise<boolean>;
	createAgentAccessLeasePrincipalChallenge(
		username: string,
		input: CreateAgentAccessLeasePrincipalChallengeMutationVariables['input']
	): Promise<{
		readonly __typename: 'AgentAccessLeaseChallenge';
		readonly id: string;
		readonly leaseID: string;
		readonly username: string;
		readonly action: string;
		readonly walletAddress: string;
		readonly principalWallet: string;
		readonly agentWallet: string;
		readonly sessionPublicKey?: string | null | undefined;
		readonly sessionKeyType?: string | null | undefined;
		readonly scopes: ReadonlyArray<string>;
		readonly deviceLabel: string;
		readonly idleTimeoutHours: number;
		readonly absoluteTTLHours: number;
		readonly message: string;
		readonly typedDataJson?: string | null | undefined;
		readonly issuedAt: string;
		readonly expiresAt: string;
	}>;
	createAgentAccessLeaseAgentChallenge(
		username: string,
		input: CreateAgentAccessLeaseAgentChallengeMutationVariables['input']
	): Promise<{
		readonly __typename: 'AgentAccessLeaseChallenge';
		readonly id: string;
		readonly leaseID: string;
		readonly username: string;
		readonly action: string;
		readonly walletAddress: string;
		readonly principalWallet: string;
		readonly agentWallet: string;
		readonly sessionPublicKey?: string | null | undefined;
		readonly sessionKeyType?: string | null | undefined;
		readonly scopes: ReadonlyArray<string>;
		readonly deviceLabel: string;
		readonly idleTimeoutHours: number;
		readonly absoluteTTLHours: number;
		readonly message: string;
		readonly typedDataJson?: string | null | undefined;
		readonly issuedAt: string;
		readonly expiresAt: string;
	}>;
	createAgentAccessLease(
		username: string,
		input: CreateAgentAccessLeaseMutationVariables['input']
	): Promise<{
		readonly __typename: 'AgentAccessLease';
		readonly id: string;
		readonly username: string;
		readonly principalUsername: string;
		readonly principalWallet: string;
		readonly agentWallet: string;
		readonly scopes: ReadonlyArray<string>;
		readonly deviceLabel: string;
		readonly status: string;
		readonly idleTimeoutHours: number;
		readonly idleExpiresAt: string;
		readonly absoluteExpiresAt: string;
		readonly lastUsedAt: string;
		readonly leaseVersion: number;
		readonly sessionPublicKey?: string | null | undefined;
		readonly sessionKeyType?: string | null | undefined;
		readonly sessionKeyCreatedAt?: string | null | undefined;
		readonly sessionKeyLastUsedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly revokedAt?: string | null | undefined;
		readonly revokedBy?: string | null | undefined;
		readonly revokedReason?: string | null | undefined;
	}>;
	revokeAgentAccessLease(
		username: string,
		leaseID: string,
		input?: RevokeAgentAccessLeaseMutationVariables['input']
	): Promise<{
		readonly __typename: 'AgentAccessLease';
		readonly id: string;
		readonly username: string;
		readonly principalUsername: string;
		readonly principalWallet: string;
		readonly agentWallet: string;
		readonly scopes: ReadonlyArray<string>;
		readonly deviceLabel: string;
		readonly status: string;
		readonly idleTimeoutHours: number;
		readonly idleExpiresAt: string;
		readonly absoluteExpiresAt: string;
		readonly lastUsedAt: string;
		readonly leaseVersion: number;
		readonly sessionPublicKey?: string | null | undefined;
		readonly sessionKeyType?: string | null | undefined;
		readonly sessionKeyCreatedAt?: string | null | undefined;
		readonly sessionKeyLastUsedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly revokedAt?: string | null | undefined;
		readonly revokedBy?: string | null | undefined;
		readonly revokedReason?: string | null | undefined;
	}>;
	createAgentAccessLeaseSessionKeyChallenge(
		username: string,
		leaseID: string,
		input: CreateAgentAccessLeaseSessionKeyChallengeMutationVariables['input']
	): Promise<{
		readonly __typename: 'AgentAccessLeaseChallenge';
		readonly id: string;
		readonly leaseID: string;
		readonly username: string;
		readonly action: string;
		readonly walletAddress: string;
		readonly principalWallet: string;
		readonly agentWallet: string;
		readonly sessionPublicKey?: string | null | undefined;
		readonly sessionKeyType?: string | null | undefined;
		readonly scopes: ReadonlyArray<string>;
		readonly deviceLabel: string;
		readonly idleTimeoutHours: number;
		readonly absoluteTTLHours: number;
		readonly message: string;
		readonly typedDataJson?: string | null | undefined;
		readonly issuedAt: string;
		readonly expiresAt: string;
	}>;
	authorizeAgentAccessLeaseSessionKey(
		username: string,
		leaseID: string,
		input: AuthorizeAgentAccessLeaseSessionKeyMutationVariables['input']
	): Promise<{
		readonly __typename: 'AgentAccessLease';
		readonly id: string;
		readonly username: string;
		readonly principalUsername: string;
		readonly principalWallet: string;
		readonly agentWallet: string;
		readonly scopes: ReadonlyArray<string>;
		readonly deviceLabel: string;
		readonly status: string;
		readonly idleTimeoutHours: number;
		readonly idleExpiresAt: string;
		readonly absoluteExpiresAt: string;
		readonly lastUsedAt: string;
		readonly leaseVersion: number;
		readonly sessionPublicKey?: string | null | undefined;
		readonly sessionKeyType?: string | null | undefined;
		readonly sessionKeyCreatedAt?: string | null | undefined;
		readonly sessionKeyLastUsedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly revokedAt?: string | null | undefined;
		readonly revokedBy?: string | null | undefined;
		readonly revokedReason?: string | null | undefined;
	}>;
	createAgentAccessLeaseRenewChallenge(
		username: string,
		leaseID: string
	): Promise<{
		readonly __typename: 'AgentAccessLeaseChallenge';
		readonly id: string;
		readonly leaseID: string;
		readonly username: string;
		readonly action: string;
		readonly walletAddress: string;
		readonly principalWallet: string;
		readonly agentWallet: string;
		readonly sessionPublicKey?: string | null | undefined;
		readonly sessionKeyType?: string | null | undefined;
		readonly scopes: ReadonlyArray<string>;
		readonly deviceLabel: string;
		readonly idleTimeoutHours: number;
		readonly absoluteTTLHours: number;
		readonly message: string;
		readonly typedDataJson?: string | null | undefined;
		readonly issuedAt: string;
		readonly expiresAt: string;
	}>;
	exchangeAgentAccessLeaseToken(
		username: string,
		leaseID: string,
		input: ExchangeAgentAccessLeaseTokenMutationVariables['input']
	): Promise<{
		readonly __typename: 'AgentAccessLeaseTokenPayload';
		readonly leaseID: string;
		readonly accessToken: string;
		readonly tokenType: string;
		readonly scope: string;
		readonly createdAt: string;
		readonly expiresIn: number;
	}>;
	adminVerifyAgent(
		username: string,
		input?: AdminVerifyAgentMutationVariables['input']
	): Promise<{
		readonly __typename: 'Agent';
		readonly id: string;
		readonly username: string;
		readonly displayName: string;
		readonly bio?: string | null | undefined;
		readonly agentType: import('./index.js').AgentType;
		readonly agentVersion: string;
		readonly agentOwner?: string | null | undefined;
		readonly delegatedScopes: ReadonlyArray<string>;
		readonly verified: boolean;
		readonly verifiedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly activityCount: number;
		readonly agentCapabilities: {
			readonly __typename: 'AgentCapabilities';
			readonly canPost: boolean;
			readonly canReply: boolean;
			readonly canBoost: boolean;
			readonly canFollow: boolean;
			readonly canDM: boolean;
			readonly maxPostsPerHour: number;
			readonly requiresApproval: boolean;
			readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
		};
		readonly ownerActor?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
			  }
			| null
			| undefined;
	}>;
	adminUnverifyAgent(
		username: string,
		input?: AdminUnverifyAgentMutationVariables['input']
	): Promise<{
		readonly __typename: 'Agent';
		readonly id: string;
		readonly username: string;
		readonly displayName: string;
		readonly bio?: string | null | undefined;
		readonly agentType: import('./index.js').AgentType;
		readonly agentVersion: string;
		readonly agentOwner?: string | null | undefined;
		readonly delegatedScopes: ReadonlyArray<string>;
		readonly verified: boolean;
		readonly verifiedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly activityCount: number;
		readonly agentCapabilities: {
			readonly __typename: 'AgentCapabilities';
			readonly canPost: boolean;
			readonly canReply: boolean;
			readonly canBoost: boolean;
			readonly canFollow: boolean;
			readonly canDM: boolean;
			readonly maxPostsPerHour: number;
			readonly requiresApproval: boolean;
			readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
		};
		readonly ownerActor?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
			  }
			| null
			| undefined;
	}>;
	adminSuspendAgent(username: string): Promise<{
		readonly __typename: 'Agent';
		readonly id: string;
		readonly username: string;
		readonly displayName: string;
		readonly bio?: string | null | undefined;
		readonly agentType: import('./index.js').AgentType;
		readonly agentVersion: string;
		readonly agentOwner?: string | null | undefined;
		readonly delegatedScopes: ReadonlyArray<string>;
		readonly verified: boolean;
		readonly verifiedAt?: string | null | undefined;
		readonly createdAt: string;
		readonly activityCount: number;
		readonly agentCapabilities: {
			readonly __typename: 'AgentCapabilities';
			readonly canPost: boolean;
			readonly canReply: boolean;
			readonly canBoost: boolean;
			readonly canFollow: boolean;
			readonly canDM: boolean;
			readonly maxPostsPerHour: number;
			readonly requiresApproval: boolean;
			readonly restrictedDomains?: ReadonlyArray<string> | null | undefined;
		};
		readonly ownerActor?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
			  }
			| null
			| undefined;
	}>;
	incorporateSoul(
		agentId: string,
		targetAgentUsername: string
	): Promise<{
		readonly __typename: 'SoulInventoryItem';
		readonly bindingState: import('./index.js').SoulBindingState;
		readonly availableForIncorporation: boolean;
		readonly agent: {
			readonly __typename: 'SoulAgentIdentity';
			readonly agentId: string;
			readonly domain: string;
			readonly localId: string;
			readonly ensName?: string | null | undefined;
			readonly wallet: string;
			readonly principalAddress?: string | null | undefined;
			readonly status: string;
			readonly lifecycleStatus?: string | null | undefined;
			readonly selfDescriptionVersion?: number | null | undefined;
			readonly capabilities: ReadonlyArray<string>;
			readonly mintTxHash?: string | null | undefined;
			readonly mintedAt?: string | null | undefined;
			readonly updatedAt?: string | null | undefined;
		};
		readonly binding?:
			| {
					readonly __typename: 'SoulAgentBinding';
					readonly agentUsername: string;
					readonly principalAddress?: string | null | undefined;
					readonly boundAt: string;
					readonly updatedAt: string;
			  }
			| null
			| undefined;
	}>;
	search(variables: SearchQueryVariables): Promise<{
		readonly __typename: 'SearchResult';
		readonly accounts: ReadonlyArray<{
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}>;
		readonly statuses: ReadonlyArray<{
			readonly __typename: 'Object';
			readonly id: string;
			readonly type: import('./index.js').ObjectType;
			readonly content: string;
			readonly visibility: import('./index.js').Visibility;
			readonly sensitive: boolean;
			readonly spoilerText?: string | null | undefined;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly repliesCount: number;
			readonly likesCount: number;
			readonly sharesCount: number;
			readonly boosted: boolean;
			readonly relationshipType: import('./index.js').ObjectRelationshipType;
			readonly contentHash: string;
			readonly estimatedCost: number;
			readonly moderationScore?: number | null | undefined;
			readonly quoteUrl?: string | null | undefined;
			readonly quoteable: boolean;
			readonly quotePermissions: import('./index.js').QuotePermission;
			readonly quoteCount: number;
			readonly boostedObject?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly content: string;
						readonly visibility: import('./index.js').Visibility;
						readonly sensitive: boolean;
						readonly spoilerText?: string | null | undefined;
						readonly createdAt: string;
						readonly updatedAt: string;
						readonly repliesCount: number;
						readonly likesCount: number;
						readonly sharesCount: number;
						readonly boosted: boolean;
						readonly relationshipType: import('./index.js').ObjectRelationshipType;
						readonly contentHash: string;
						readonly estimatedCost: number;
						readonly moderationScore?: number | null | undefined;
						readonly quoteUrl?: string | null | undefined;
						readonly quoteable: boolean;
						readonly quotePermissions: import('./index.js').QuotePermission;
						readonly quoteCount: number;
						readonly contentMap: ReadonlyArray<{
							readonly __typename: 'ContentMap';
							readonly language: string;
							readonly content: string;
						}>;
						readonly attachments: ReadonlyArray<{
							readonly __typename: 'Attachment';
							readonly id: string;
							readonly type: string;
							readonly url: string;
							readonly preview?: string | null | undefined;
							readonly description?: string | null | undefined;
							readonly blurhash?: string | null | undefined;
							readonly width?: number | null | undefined;
							readonly height?: number | null | undefined;
							readonly duration?: number | null | undefined;
						}>;
						readonly tags: ReadonlyArray<{
							readonly __typename: 'Tag';
							readonly name: string;
							readonly url: string;
						}>;
						readonly mentions: ReadonlyArray<{
							readonly __typename: 'Mention';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly url: string;
						}>;
						readonly agentAttribution?:
							| {
									readonly __typename: 'AgentPostAttribution';
									readonly triggerType?: string | null | undefined;
									readonly triggerDetails?: string | null | undefined;
									readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
									readonly delegatedBy?: string | null | undefined;
									readonly approvedBy?: string | null | undefined;
									readonly delegatedByDid?: string | null | undefined;
									readonly scopes?: ReadonlyArray<string> | null | undefined;
									readonly constraints?: ReadonlyArray<string> | null | undefined;
									readonly schemaVersion?: string | null | undefined;
									readonly modelId?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly quoteContext?:
							| {
									readonly __typename: 'QuoteContext';
									readonly quoteAllowed: boolean;
									readonly quoteType: import('./index.js').QuoteType;
									readonly withdrawn: boolean;
									readonly originalAuthor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly originalNote?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly communityNotes: ReadonlyArray<{
							readonly __typename: 'CommunityNote';
							readonly id: string;
							readonly content: string;
							readonly helpful: number;
							readonly notHelpful: number;
							readonly createdAt: string;
							readonly author: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
						}>;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly inReplyTo?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly contentMap: ReadonlyArray<{
				readonly __typename: 'ContentMap';
				readonly language: string;
				readonly content: string;
			}>;
			readonly attachments: ReadonlyArray<{
				readonly __typename: 'Attachment';
				readonly id: string;
				readonly type: string;
				readonly url: string;
				readonly preview?: string | null | undefined;
				readonly description?: string | null | undefined;
				readonly blurhash?: string | null | undefined;
				readonly width?: number | null | undefined;
				readonly height?: number | null | undefined;
				readonly duration?: number | null | undefined;
			}>;
			readonly tags: ReadonlyArray<{
				readonly __typename: 'Tag';
				readonly name: string;
				readonly url: string;
			}>;
			readonly mentions: ReadonlyArray<{
				readonly __typename: 'Mention';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly url: string;
			}>;
			readonly agentAttribution?:
				| {
						readonly __typename: 'AgentPostAttribution';
						readonly triggerType?: string | null | undefined;
						readonly triggerDetails?: string | null | undefined;
						readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
						readonly delegatedBy?: string | null | undefined;
						readonly approvedBy?: string | null | undefined;
						readonly delegatedByDid?: string | null | undefined;
						readonly scopes?: ReadonlyArray<string> | null | undefined;
						readonly constraints?: ReadonlyArray<string> | null | undefined;
						readonly schemaVersion?: string | null | undefined;
						readonly modelId?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly quoteContext?:
				| {
						readonly __typename: 'QuoteContext';
						readonly quoteAllowed: boolean;
						readonly quoteType: import('./index.js').QuoteType;
						readonly withdrawn: boolean;
						readonly originalAuthor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly originalNote?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly communityNotes: ReadonlyArray<{
				readonly __typename: 'CommunityNote';
				readonly id: string;
				readonly content: string;
				readonly helpful: number;
				readonly notHelpful: number;
				readonly createdAt: string;
				readonly author: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
			}>;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly inReplyTo?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
				  }
				| null
				| undefined;
		}>;
		readonly hashtags: ReadonlyArray<{
			readonly __typename: 'Tag';
			readonly name: string;
			readonly url: string;
		}>;
	}>;
	fetchNotifications(variables: NotificationsQueryVariables): Promise<{
		readonly __typename: 'NotificationConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'NotificationEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Notification';
				readonly id: string;
				readonly type: string;
				readonly read: boolean;
				readonly createdAt: string;
				readonly account: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly status?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly boostedObject?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly content: string;
										readonly visibility: import('./index.js').Visibility;
										readonly sensitive: boolean;
										readonly spoilerText?: string | null | undefined;
										readonly createdAt: string;
										readonly updatedAt: string;
										readonly repliesCount: number;
										readonly likesCount: number;
										readonly sharesCount: number;
										readonly boosted: boolean;
										readonly relationshipType: import('./index.js').ObjectRelationshipType;
										readonly contentHash: string;
										readonly estimatedCost: number;
										readonly moderationScore?: number | null | undefined;
										readonly quoteUrl?: string | null | undefined;
										readonly quoteable: boolean;
										readonly quotePermissions: import('./index.js').QuotePermission;
										readonly quoteCount: number;
										readonly contentMap: ReadonlyArray<{
											readonly __typename: 'ContentMap';
											readonly language: string;
											readonly content: string;
										}>;
										readonly attachments: ReadonlyArray<{
											readonly __typename: 'Attachment';
											readonly id: string;
											readonly type: string;
											readonly url: string;
											readonly preview?: string | null | undefined;
											readonly description?: string | null | undefined;
											readonly blurhash?: string | null | undefined;
											readonly width?: number | null | undefined;
											readonly height?: number | null | undefined;
											readonly duration?: number | null | undefined;
										}>;
										readonly tags: ReadonlyArray<{
											readonly __typename: 'Tag';
											readonly name: string;
											readonly url: string;
										}>;
										readonly mentions: ReadonlyArray<{
											readonly __typename: 'Mention';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly url: string;
										}>;
										readonly agentAttribution?:
											| {
													readonly __typename: 'AgentPostAttribution';
													readonly triggerType?: string | null | undefined;
													readonly triggerDetails?: string | null | undefined;
													readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
													readonly delegatedBy?: string | null | undefined;
													readonly approvedBy?: string | null | undefined;
													readonly delegatedByDid?: string | null | undefined;
													readonly scopes?: ReadonlyArray<string> | null | undefined;
													readonly constraints?: ReadonlyArray<string> | null | undefined;
													readonly schemaVersion?: string | null | undefined;
													readonly modelId?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly quoteContext?:
											| {
													readonly __typename: 'QuoteContext';
													readonly quoteAllowed: boolean;
													readonly quoteType: import('./index.js').QuoteType;
													readonly withdrawn: boolean;
													readonly originalAuthor: {
														readonly __typename: 'Actor';
														readonly id: string;
														readonly username: string;
														readonly domain?: string | null | undefined;
														readonly displayName?: string | null | undefined;
														readonly summary?: string | null | undefined;
														readonly avatar?: string | null | undefined;
														readonly header?: string | null | undefined;
														readonly followers: number;
														readonly following: number;
														readonly statusesCount: number;
														readonly bot: boolean;
														readonly locked: boolean;
														readonly updatedAt: string;
														readonly isAgent: boolean;
														readonly tipAddress?: string | null | undefined;
														readonly tipChainId?: number | null | undefined;
														readonly trustScore: number;
														readonly agentInfo?:
															| {
																	readonly __typename: 'Agent';
																	readonly id: string;
																	readonly agentType: import('./index.js').AgentType;
																	readonly verified: boolean;
																	readonly verifiedAt?: string | null | undefined;
															  }
															| null
															| undefined;
														readonly fields: ReadonlyArray<{
															readonly __typename: 'Field';
															readonly name: string;
															readonly value: string;
															readonly verifiedAt?: string | null | undefined;
														}>;
													};
													readonly originalNote?:
														| {
																readonly __typename: 'Object';
																readonly id: string;
																readonly type: import('./index.js').ObjectType;
														  }
														| null
														| undefined;
											  }
											| null
											| undefined;
										readonly communityNotes: ReadonlyArray<{
											readonly __typename: 'CommunityNote';
											readonly id: string;
											readonly content: string;
											readonly helpful: number;
											readonly notHelpful: number;
											readonly createdAt: string;
											readonly author: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
										}>;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly inReplyTo?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
													readonly actor: {
														readonly __typename: 'Actor';
														readonly id: string;
														readonly username: string;
														readonly domain?: string | null | undefined;
														readonly displayName?: string | null | undefined;
														readonly summary?: string | null | undefined;
														readonly avatar?: string | null | undefined;
														readonly header?: string | null | undefined;
														readonly followers: number;
														readonly following: number;
														readonly statusesCount: number;
														readonly bot: boolean;
														readonly locked: boolean;
														readonly updatedAt: string;
														readonly isAgent: boolean;
														readonly tipAddress?: string | null | undefined;
														readonly tipChainId?: number | null | undefined;
														readonly trustScore: number;
														readonly agentInfo?:
															| {
																	readonly __typename: 'Agent';
																	readonly id: string;
																	readonly agentType: import('./index.js').AgentType;
																	readonly verified: boolean;
																	readonly verifiedAt?: string | null | undefined;
															  }
															| null
															| undefined;
														readonly fields: ReadonlyArray<{
															readonly __typename: 'Field';
															readonly name: string;
															readonly value: string;
															readonly verifiedAt?: string | null | undefined;
														}>;
													};
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communication?:
					| {
							readonly __typename: 'CommunicationNotification';
							readonly channel: string;
							readonly subject?: string | null | undefined;
							readonly body?: string | null | undefined;
							readonly receivedAt: string;
							readonly messageId: string;
							readonly inReplyTo?: string | null | undefined;
							readonly threadId: string;
							readonly from: {
								readonly __typename: 'CommunicationFrom';
								readonly address: string;
								readonly displayName?: string | null | undefined;
								readonly soulAgentId?: string | null | undefined;
							};
							readonly to?:
								| {
										readonly __typename: 'CommunicationTo';
										readonly address: string;
								  }
								| null
								| undefined;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'CommunicationAttachment';
								readonly id: string;
								readonly filename: string;
								readonly contentType: string;
								readonly sizeBytes: number;
								readonly sha256: string;
							}>;
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	dismissNotification(id: string): Promise<boolean>;
	clearNotifications(): Promise<boolean>;
	getConversations(variables: ConversationsQueryVariables): Promise<any[]>;
	getConversation(id: string): Promise<
		| {
				readonly __typename: 'Conversation';
				readonly id: string;
				readonly cursor?: string | null | undefined;
				readonly unread: boolean;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly viewerMetadata: {
					readonly __typename: 'ConversationViewerMetadata';
					readonly requestState: import('./index.js').DmRequestState;
					readonly requestedAt?: string | null | undefined;
					readonly acceptedAt?: string | null | undefined;
					readonly declinedAt?: string | null | undefined;
				};
				readonly accounts: ReadonlyArray<{
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				}>;
				readonly lastStatus?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly boostedObject?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly content: string;
										readonly visibility: import('./index.js').Visibility;
										readonly sensitive: boolean;
										readonly spoilerText?: string | null | undefined;
										readonly createdAt: string;
										readonly updatedAt: string;
										readonly repliesCount: number;
										readonly likesCount: number;
										readonly sharesCount: number;
										readonly boosted: boolean;
										readonly relationshipType: import('./index.js').ObjectRelationshipType;
										readonly contentHash: string;
										readonly estimatedCost: number;
										readonly moderationScore?: number | null | undefined;
										readonly quoteUrl?: string | null | undefined;
										readonly quoteable: boolean;
										readonly quotePermissions: import('./index.js').QuotePermission;
										readonly quoteCount: number;
										readonly contentMap: ReadonlyArray<{
											readonly __typename: 'ContentMap';
											readonly language: string;
											readonly content: string;
										}>;
										readonly attachments: ReadonlyArray<{
											readonly __typename: 'Attachment';
											readonly id: string;
											readonly type: string;
											readonly url: string;
											readonly preview?: string | null | undefined;
											readonly description?: string | null | undefined;
											readonly blurhash?: string | null | undefined;
											readonly width?: number | null | undefined;
											readonly height?: number | null | undefined;
											readonly duration?: number | null | undefined;
										}>;
										readonly tags: ReadonlyArray<{
											readonly __typename: 'Tag';
											readonly name: string;
											readonly url: string;
										}>;
										readonly mentions: ReadonlyArray<{
											readonly __typename: 'Mention';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly url: string;
										}>;
										readonly agentAttribution?:
											| {
													readonly __typename: 'AgentPostAttribution';
													readonly triggerType?: string | null | undefined;
													readonly triggerDetails?: string | null | undefined;
													readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
													readonly delegatedBy?: string | null | undefined;
													readonly approvedBy?: string | null | undefined;
													readonly delegatedByDid?: string | null | undefined;
													readonly scopes?: ReadonlyArray<string> | null | undefined;
													readonly constraints?: ReadonlyArray<string> | null | undefined;
													readonly schemaVersion?: string | null | undefined;
													readonly modelId?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly quoteContext?:
											| {
													readonly __typename: 'QuoteContext';
													readonly quoteAllowed: boolean;
													readonly quoteType: import('./index.js').QuoteType;
													readonly withdrawn: boolean;
													readonly originalAuthor: {
														readonly __typename: 'Actor';
														readonly id: string;
														readonly username: string;
														readonly domain?: string | null | undefined;
														readonly displayName?: string | null | undefined;
														readonly summary?: string | null | undefined;
														readonly avatar?: string | null | undefined;
														readonly header?: string | null | undefined;
														readonly followers: number;
														readonly following: number;
														readonly statusesCount: number;
														readonly bot: boolean;
														readonly locked: boolean;
														readonly updatedAt: string;
														readonly isAgent: boolean;
														readonly tipAddress?: string | null | undefined;
														readonly tipChainId?: number | null | undefined;
														readonly trustScore: number;
														readonly agentInfo?:
															| {
																	readonly __typename: 'Agent';
																	readonly id: string;
																	readonly agentType: import('./index.js').AgentType;
																	readonly verified: boolean;
																	readonly verifiedAt?: string | null | undefined;
															  }
															| null
															| undefined;
														readonly fields: ReadonlyArray<{
															readonly __typename: 'Field';
															readonly name: string;
															readonly value: string;
															readonly verifiedAt?: string | null | undefined;
														}>;
													};
													readonly originalNote?:
														| {
																readonly __typename: 'Object';
																readonly id: string;
																readonly type: import('./index.js').ObjectType;
														  }
														| null
														| undefined;
											  }
											| null
											| undefined;
										readonly communityNotes: ReadonlyArray<{
											readonly __typename: 'CommunityNote';
											readonly id: string;
											readonly content: string;
											readonly helpful: number;
											readonly notHelpful: number;
											readonly createdAt: string;
											readonly author: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
										}>;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly inReplyTo?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
													readonly actor: {
														readonly __typename: 'Actor';
														readonly id: string;
														readonly username: string;
														readonly domain?: string | null | undefined;
														readonly displayName?: string | null | undefined;
														readonly summary?: string | null | undefined;
														readonly avatar?: string | null | undefined;
														readonly header?: string | null | undefined;
														readonly followers: number;
														readonly following: number;
														readonly statusesCount: number;
														readonly bot: boolean;
														readonly locked: boolean;
														readonly updatedAt: string;
														readonly isAgent: boolean;
														readonly tipAddress?: string | null | undefined;
														readonly tipChainId?: number | null | undefined;
														readonly trustScore: number;
														readonly agentInfo?:
															| {
																	readonly __typename: 'Agent';
																	readonly id: string;
																	readonly agentType: import('./index.js').AgentType;
																	readonly verified: boolean;
																	readonly verifiedAt?: string | null | undefined;
															  }
															| null
															| undefined;
														readonly fields: ReadonlyArray<{
															readonly __typename: 'Field';
															readonly name: string;
															readonly value: string;
															readonly verifiedAt?: string | null | undefined;
														}>;
													};
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined
	>;
	getConversationMessages(variables: ConversationMessagesQueryVariables): Promise<{
		readonly __typename: 'ObjectConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'ObjectEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	createConversation(participantId: string): Promise<{
		readonly __typename: 'Conversation';
		readonly id: string;
		readonly cursor?: string | null | undefined;
		readonly unread: boolean;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly viewerMetadata: {
			readonly __typename: 'ConversationViewerMetadata';
			readonly requestState: import('./index.js').DmRequestState;
			readonly requestedAt?: string | null | undefined;
			readonly acceptedAt?: string | null | undefined;
			readonly declinedAt?: string | null | undefined;
		};
		readonly accounts: ReadonlyArray<{
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}>;
		readonly lastStatus?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly content: string;
					readonly visibility: import('./index.js').Visibility;
					readonly sensitive: boolean;
					readonly spoilerText?: string | null | undefined;
					readonly createdAt: string;
					readonly updatedAt: string;
					readonly repliesCount: number;
					readonly likesCount: number;
					readonly sharesCount: number;
					readonly boosted: boolean;
					readonly relationshipType: import('./index.js').ObjectRelationshipType;
					readonly contentHash: string;
					readonly estimatedCost: number;
					readonly moderationScore?: number | null | undefined;
					readonly quoteUrl?: string | null | undefined;
					readonly quoteable: boolean;
					readonly quotePermissions: import('./index.js').QuotePermission;
					readonly quoteCount: number;
					readonly boostedObject?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly content: string;
								readonly visibility: import('./index.js').Visibility;
								readonly sensitive: boolean;
								readonly spoilerText?: string | null | undefined;
								readonly createdAt: string;
								readonly updatedAt: string;
								readonly repliesCount: number;
								readonly likesCount: number;
								readonly sharesCount: number;
								readonly boosted: boolean;
								readonly relationshipType: import('./index.js').ObjectRelationshipType;
								readonly contentHash: string;
								readonly estimatedCost: number;
								readonly moderationScore?: number | null | undefined;
								readonly quoteUrl?: string | null | undefined;
								readonly quoteable: boolean;
								readonly quotePermissions: import('./index.js').QuotePermission;
								readonly quoteCount: number;
								readonly contentMap: ReadonlyArray<{
									readonly __typename: 'ContentMap';
									readonly language: string;
									readonly content: string;
								}>;
								readonly attachments: ReadonlyArray<{
									readonly __typename: 'Attachment';
									readonly id: string;
									readonly type: string;
									readonly url: string;
									readonly preview?: string | null | undefined;
									readonly description?: string | null | undefined;
									readonly blurhash?: string | null | undefined;
									readonly width?: number | null | undefined;
									readonly height?: number | null | undefined;
									readonly duration?: number | null | undefined;
								}>;
								readonly tags: ReadonlyArray<{
									readonly __typename: 'Tag';
									readonly name: string;
									readonly url: string;
								}>;
								readonly mentions: ReadonlyArray<{
									readonly __typename: 'Mention';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly url: string;
								}>;
								readonly agentAttribution?:
									| {
											readonly __typename: 'AgentPostAttribution';
											readonly triggerType?: string | null | undefined;
											readonly triggerDetails?: string | null | undefined;
											readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
											readonly delegatedBy?: string | null | undefined;
											readonly approvedBy?: string | null | undefined;
											readonly delegatedByDid?: string | null | undefined;
											readonly scopes?: ReadonlyArray<string> | null | undefined;
											readonly constraints?: ReadonlyArray<string> | null | undefined;
											readonly schemaVersion?: string | null | undefined;
											readonly modelId?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly quoteContext?:
									| {
											readonly __typename: 'QuoteContext';
											readonly quoteAllowed: boolean;
											readonly quoteType: import('./index.js').QuoteType;
											readonly withdrawn: boolean;
											readonly originalAuthor: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
											readonly originalNote?:
												| {
														readonly __typename: 'Object';
														readonly id: string;
														readonly type: import('./index.js').ObjectType;
												  }
												| null
												| undefined;
									  }
									| null
									| undefined;
								readonly communityNotes: ReadonlyArray<{
									readonly __typename: 'CommunityNote';
									readonly id: string;
									readonly content: string;
									readonly helpful: number;
									readonly notHelpful: number;
									readonly createdAt: string;
									readonly author: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
								}>;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly inReplyTo?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
											readonly actor: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly contentMap: ReadonlyArray<{
						readonly __typename: 'ContentMap';
						readonly language: string;
						readonly content: string;
					}>;
					readonly attachments: ReadonlyArray<{
						readonly __typename: 'Attachment';
						readonly id: string;
						readonly type: string;
						readonly url: string;
						readonly preview?: string | null | undefined;
						readonly description?: string | null | undefined;
						readonly blurhash?: string | null | undefined;
						readonly width?: number | null | undefined;
						readonly height?: number | null | undefined;
						readonly duration?: number | null | undefined;
					}>;
					readonly tags: ReadonlyArray<{
						readonly __typename: 'Tag';
						readonly name: string;
						readonly url: string;
					}>;
					readonly mentions: ReadonlyArray<{
						readonly __typename: 'Mention';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly url: string;
					}>;
					readonly agentAttribution?:
						| {
								readonly __typename: 'AgentPostAttribution';
								readonly triggerType?: string | null | undefined;
								readonly triggerDetails?: string | null | undefined;
								readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
								readonly delegatedBy?: string | null | undefined;
								readonly approvedBy?: string | null | undefined;
								readonly delegatedByDid?: string | null | undefined;
								readonly scopes?: ReadonlyArray<string> | null | undefined;
								readonly constraints?: ReadonlyArray<string> | null | undefined;
								readonly schemaVersion?: string | null | undefined;
								readonly modelId?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly quoteContext?:
						| {
								readonly __typename: 'QuoteContext';
								readonly quoteAllowed: boolean;
								readonly quoteType: import('./index.js').QuoteType;
								readonly withdrawn: boolean;
								readonly originalAuthor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly originalNote?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly communityNotes: ReadonlyArray<{
						readonly __typename: 'CommunityNote';
						readonly id: string;
						readonly content: string;
						readonly helpful: number;
						readonly notHelpful: number;
						readonly createdAt: string;
						readonly author: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
					}>;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly inReplyTo?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
	}>;
	sendMessage(
		conversationId: string,
		content: string,
		mediaIds?: string[]
	): Promise<{
		readonly __typename: 'SendMessagePayload';
		readonly conversation: {
			readonly __typename: 'Conversation';
			readonly id: string;
			readonly cursor?: string | null | undefined;
			readonly unread: boolean;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly viewerMetadata: {
				readonly __typename: 'ConversationViewerMetadata';
				readonly requestState: import('./index.js').DmRequestState;
				readonly requestedAt?: string | null | undefined;
				readonly acceptedAt?: string | null | undefined;
				readonly declinedAt?: string | null | undefined;
			};
			readonly accounts: ReadonlyArray<{
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			}>;
			readonly lastStatus?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly content: string;
						readonly visibility: import('./index.js').Visibility;
						readonly sensitive: boolean;
						readonly spoilerText?: string | null | undefined;
						readonly createdAt: string;
						readonly updatedAt: string;
						readonly repliesCount: number;
						readonly likesCount: number;
						readonly sharesCount: number;
						readonly boosted: boolean;
						readonly relationshipType: import('./index.js').ObjectRelationshipType;
						readonly contentHash: string;
						readonly estimatedCost: number;
						readonly moderationScore?: number | null | undefined;
						readonly quoteUrl?: string | null | undefined;
						readonly quoteable: boolean;
						readonly quotePermissions: import('./index.js').QuotePermission;
						readonly quoteCount: number;
						readonly boostedObject?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly content: string;
									readonly visibility: import('./index.js').Visibility;
									readonly sensitive: boolean;
									readonly spoilerText?: string | null | undefined;
									readonly createdAt: string;
									readonly updatedAt: string;
									readonly repliesCount: number;
									readonly likesCount: number;
									readonly sharesCount: number;
									readonly boosted: boolean;
									readonly relationshipType: import('./index.js').ObjectRelationshipType;
									readonly contentHash: string;
									readonly estimatedCost: number;
									readonly moderationScore?: number | null | undefined;
									readonly quoteUrl?: string | null | undefined;
									readonly quoteable: boolean;
									readonly quotePermissions: import('./index.js').QuotePermission;
									readonly quoteCount: number;
									readonly contentMap: ReadonlyArray<{
										readonly __typename: 'ContentMap';
										readonly language: string;
										readonly content: string;
									}>;
									readonly attachments: ReadonlyArray<{
										readonly __typename: 'Attachment';
										readonly id: string;
										readonly type: string;
										readonly url: string;
										readonly preview?: string | null | undefined;
										readonly description?: string | null | undefined;
										readonly blurhash?: string | null | undefined;
										readonly width?: number | null | undefined;
										readonly height?: number | null | undefined;
										readonly duration?: number | null | undefined;
									}>;
									readonly tags: ReadonlyArray<{
										readonly __typename: 'Tag';
										readonly name: string;
										readonly url: string;
									}>;
									readonly mentions: ReadonlyArray<{
										readonly __typename: 'Mention';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly url: string;
									}>;
									readonly agentAttribution?:
										| {
												readonly __typename: 'AgentPostAttribution';
												readonly triggerType?: string | null | undefined;
												readonly triggerDetails?: string | null | undefined;
												readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
												readonly delegatedBy?: string | null | undefined;
												readonly approvedBy?: string | null | undefined;
												readonly delegatedByDid?: string | null | undefined;
												readonly scopes?: ReadonlyArray<string> | null | undefined;
												readonly constraints?: ReadonlyArray<string> | null | undefined;
												readonly schemaVersion?: string | null | undefined;
												readonly modelId?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly quoteContext?:
										| {
												readonly __typename: 'QuoteContext';
												readonly quoteAllowed: boolean;
												readonly quoteType: import('./index.js').QuoteType;
												readonly withdrawn: boolean;
												readonly originalAuthor: {
													readonly __typename: 'Actor';
													readonly id: string;
													readonly username: string;
													readonly domain?: string | null | undefined;
													readonly displayName?: string | null | undefined;
													readonly summary?: string | null | undefined;
													readonly avatar?: string | null | undefined;
													readonly header?: string | null | undefined;
													readonly followers: number;
													readonly following: number;
													readonly statusesCount: number;
													readonly bot: boolean;
													readonly locked: boolean;
													readonly updatedAt: string;
													readonly isAgent: boolean;
													readonly tipAddress?: string | null | undefined;
													readonly tipChainId?: number | null | undefined;
													readonly trustScore: number;
													readonly agentInfo?:
														| {
																readonly __typename: 'Agent';
																readonly id: string;
																readonly agentType: import('./index.js').AgentType;
																readonly verified: boolean;
																readonly verifiedAt?: string | null | undefined;
														  }
														| null
														| undefined;
													readonly fields: ReadonlyArray<{
														readonly __typename: 'Field';
														readonly name: string;
														readonly value: string;
														readonly verifiedAt?: string | null | undefined;
													}>;
												};
												readonly originalNote?:
													| {
															readonly __typename: 'Object';
															readonly id: string;
															readonly type: import('./index.js').ObjectType;
													  }
													| null
													| undefined;
										  }
										| null
										| undefined;
									readonly communityNotes: ReadonlyArray<{
										readonly __typename: 'CommunityNote';
										readonly id: string;
										readonly content: string;
										readonly helpful: number;
										readonly notHelpful: number;
										readonly createdAt: string;
										readonly author: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
									}>;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly inReplyTo?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
												readonly actor: {
													readonly __typename: 'Actor';
													readonly id: string;
													readonly username: string;
													readonly domain?: string | null | undefined;
													readonly displayName?: string | null | undefined;
													readonly summary?: string | null | undefined;
													readonly avatar?: string | null | undefined;
													readonly header?: string | null | undefined;
													readonly followers: number;
													readonly following: number;
													readonly statusesCount: number;
													readonly bot: boolean;
													readonly locked: boolean;
													readonly updatedAt: string;
													readonly isAgent: boolean;
													readonly tipAddress?: string | null | undefined;
													readonly tipChainId?: number | null | undefined;
													readonly trustScore: number;
													readonly agentInfo?:
														| {
																readonly __typename: 'Agent';
																readonly id: string;
																readonly agentType: import('./index.js').AgentType;
																readonly verified: boolean;
																readonly verifiedAt?: string | null | undefined;
														  }
														| null
														| undefined;
													readonly fields: ReadonlyArray<{
														readonly __typename: 'Field';
														readonly name: string;
														readonly value: string;
														readonly verifiedAt?: string | null | undefined;
													}>;
												};
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly contentMap: ReadonlyArray<{
							readonly __typename: 'ContentMap';
							readonly language: string;
							readonly content: string;
						}>;
						readonly attachments: ReadonlyArray<{
							readonly __typename: 'Attachment';
							readonly id: string;
							readonly type: string;
							readonly url: string;
							readonly preview?: string | null | undefined;
							readonly description?: string | null | undefined;
							readonly blurhash?: string | null | undefined;
							readonly width?: number | null | undefined;
							readonly height?: number | null | undefined;
							readonly duration?: number | null | undefined;
						}>;
						readonly tags: ReadonlyArray<{
							readonly __typename: 'Tag';
							readonly name: string;
							readonly url: string;
						}>;
						readonly mentions: ReadonlyArray<{
							readonly __typename: 'Mention';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly url: string;
						}>;
						readonly agentAttribution?:
							| {
									readonly __typename: 'AgentPostAttribution';
									readonly triggerType?: string | null | undefined;
									readonly triggerDetails?: string | null | undefined;
									readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
									readonly delegatedBy?: string | null | undefined;
									readonly approvedBy?: string | null | undefined;
									readonly delegatedByDid?: string | null | undefined;
									readonly scopes?: ReadonlyArray<string> | null | undefined;
									readonly constraints?: ReadonlyArray<string> | null | undefined;
									readonly schemaVersion?: string | null | undefined;
									readonly modelId?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly quoteContext?:
							| {
									readonly __typename: 'QuoteContext';
									readonly quoteAllowed: boolean;
									readonly quoteType: import('./index.js').QuoteType;
									readonly withdrawn: boolean;
									readonly originalAuthor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly originalNote?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly communityNotes: ReadonlyArray<{
							readonly __typename: 'CommunityNote';
							readonly id: string;
							readonly content: string;
							readonly helpful: number;
							readonly notHelpful: number;
							readonly createdAt: string;
							readonly author: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
						}>;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly inReplyTo?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
		};
		readonly message: {
			readonly __typename: 'Object';
			readonly id: string;
			readonly type: import('./index.js').ObjectType;
			readonly content: string;
			readonly visibility: import('./index.js').Visibility;
			readonly sensitive: boolean;
			readonly spoilerText?: string | null | undefined;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly repliesCount: number;
			readonly likesCount: number;
			readonly sharesCount: number;
			readonly boosted: boolean;
			readonly relationshipType: import('./index.js').ObjectRelationshipType;
			readonly contentHash: string;
			readonly estimatedCost: number;
			readonly moderationScore?: number | null | undefined;
			readonly quoteUrl?: string | null | undefined;
			readonly quoteable: boolean;
			readonly quotePermissions: import('./index.js').QuotePermission;
			readonly quoteCount: number;
			readonly boostedObject?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly content: string;
						readonly visibility: import('./index.js').Visibility;
						readonly sensitive: boolean;
						readonly spoilerText?: string | null | undefined;
						readonly createdAt: string;
						readonly updatedAt: string;
						readonly repliesCount: number;
						readonly likesCount: number;
						readonly sharesCount: number;
						readonly boosted: boolean;
						readonly relationshipType: import('./index.js').ObjectRelationshipType;
						readonly contentHash: string;
						readonly estimatedCost: number;
						readonly moderationScore?: number | null | undefined;
						readonly quoteUrl?: string | null | undefined;
						readonly quoteable: boolean;
						readonly quotePermissions: import('./index.js').QuotePermission;
						readonly quoteCount: number;
						readonly contentMap: ReadonlyArray<{
							readonly __typename: 'ContentMap';
							readonly language: string;
							readonly content: string;
						}>;
						readonly attachments: ReadonlyArray<{
							readonly __typename: 'Attachment';
							readonly id: string;
							readonly type: string;
							readonly url: string;
							readonly preview?: string | null | undefined;
							readonly description?: string | null | undefined;
							readonly blurhash?: string | null | undefined;
							readonly width?: number | null | undefined;
							readonly height?: number | null | undefined;
							readonly duration?: number | null | undefined;
						}>;
						readonly tags: ReadonlyArray<{
							readonly __typename: 'Tag';
							readonly name: string;
							readonly url: string;
						}>;
						readonly mentions: ReadonlyArray<{
							readonly __typename: 'Mention';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly url: string;
						}>;
						readonly agentAttribution?:
							| {
									readonly __typename: 'AgentPostAttribution';
									readonly triggerType?: string | null | undefined;
									readonly triggerDetails?: string | null | undefined;
									readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
									readonly delegatedBy?: string | null | undefined;
									readonly approvedBy?: string | null | undefined;
									readonly delegatedByDid?: string | null | undefined;
									readonly scopes?: ReadonlyArray<string> | null | undefined;
									readonly constraints?: ReadonlyArray<string> | null | undefined;
									readonly schemaVersion?: string | null | undefined;
									readonly modelId?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly quoteContext?:
							| {
									readonly __typename: 'QuoteContext';
									readonly quoteAllowed: boolean;
									readonly quoteType: import('./index.js').QuoteType;
									readonly withdrawn: boolean;
									readonly originalAuthor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly originalNote?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly communityNotes: ReadonlyArray<{
							readonly __typename: 'CommunityNote';
							readonly id: string;
							readonly content: string;
							readonly helpful: number;
							readonly notHelpful: number;
							readonly createdAt: string;
							readonly author: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
						}>;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly inReplyTo?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly contentMap: ReadonlyArray<{
				readonly __typename: 'ContentMap';
				readonly language: string;
				readonly content: string;
			}>;
			readonly attachments: ReadonlyArray<{
				readonly __typename: 'Attachment';
				readonly id: string;
				readonly type: string;
				readonly url: string;
				readonly preview?: string | null | undefined;
				readonly description?: string | null | undefined;
				readonly blurhash?: string | null | undefined;
				readonly width?: number | null | undefined;
				readonly height?: number | null | undefined;
				readonly duration?: number | null | undefined;
			}>;
			readonly tags: ReadonlyArray<{
				readonly __typename: 'Tag';
				readonly name: string;
				readonly url: string;
			}>;
			readonly mentions: ReadonlyArray<{
				readonly __typename: 'Mention';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly url: string;
			}>;
			readonly agentAttribution?:
				| {
						readonly __typename: 'AgentPostAttribution';
						readonly triggerType?: string | null | undefined;
						readonly triggerDetails?: string | null | undefined;
						readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
						readonly delegatedBy?: string | null | undefined;
						readonly approvedBy?: string | null | undefined;
						readonly delegatedByDid?: string | null | undefined;
						readonly scopes?: ReadonlyArray<string> | null | undefined;
						readonly constraints?: ReadonlyArray<string> | null | undefined;
						readonly schemaVersion?: string | null | undefined;
						readonly modelId?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly quoteContext?:
				| {
						readonly __typename: 'QuoteContext';
						readonly quoteAllowed: boolean;
						readonly quoteType: import('./index.js').QuoteType;
						readonly withdrawn: boolean;
						readonly originalAuthor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly originalNote?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly communityNotes: ReadonlyArray<{
				readonly __typename: 'CommunityNote';
				readonly id: string;
				readonly content: string;
				readonly helpful: number;
				readonly notHelpful: number;
				readonly createdAt: string;
				readonly author: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
			}>;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly inReplyTo?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
				  }
				| null
				| undefined;
		};
	}>;
	acceptMessageRequest(
		conversationId: AcceptMessageRequestMutationVariables['conversationId']
	): Promise<{
		readonly __typename: 'Conversation';
		readonly id: string;
		readonly cursor?: string | null | undefined;
		readonly unread: boolean;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly viewerMetadata: {
			readonly __typename: 'ConversationViewerMetadata';
			readonly requestState: import('./index.js').DmRequestState;
			readonly requestedAt?: string | null | undefined;
			readonly acceptedAt?: string | null | undefined;
			readonly declinedAt?: string | null | undefined;
		};
		readonly accounts: ReadonlyArray<{
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}>;
		readonly lastStatus?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly content: string;
					readonly visibility: import('./index.js').Visibility;
					readonly sensitive: boolean;
					readonly spoilerText?: string | null | undefined;
					readonly createdAt: string;
					readonly updatedAt: string;
					readonly repliesCount: number;
					readonly likesCount: number;
					readonly sharesCount: number;
					readonly boosted: boolean;
					readonly relationshipType: import('./index.js').ObjectRelationshipType;
					readonly contentHash: string;
					readonly estimatedCost: number;
					readonly moderationScore?: number | null | undefined;
					readonly quoteUrl?: string | null | undefined;
					readonly quoteable: boolean;
					readonly quotePermissions: import('./index.js').QuotePermission;
					readonly quoteCount: number;
					readonly boostedObject?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly content: string;
								readonly visibility: import('./index.js').Visibility;
								readonly sensitive: boolean;
								readonly spoilerText?: string | null | undefined;
								readonly createdAt: string;
								readonly updatedAt: string;
								readonly repliesCount: number;
								readonly likesCount: number;
								readonly sharesCount: number;
								readonly boosted: boolean;
								readonly relationshipType: import('./index.js').ObjectRelationshipType;
								readonly contentHash: string;
								readonly estimatedCost: number;
								readonly moderationScore?: number | null | undefined;
								readonly quoteUrl?: string | null | undefined;
								readonly quoteable: boolean;
								readonly quotePermissions: import('./index.js').QuotePermission;
								readonly quoteCount: number;
								readonly contentMap: ReadonlyArray<{
									readonly __typename: 'ContentMap';
									readonly language: string;
									readonly content: string;
								}>;
								readonly attachments: ReadonlyArray<{
									readonly __typename: 'Attachment';
									readonly id: string;
									readonly type: string;
									readonly url: string;
									readonly preview?: string | null | undefined;
									readonly description?: string | null | undefined;
									readonly blurhash?: string | null | undefined;
									readonly width?: number | null | undefined;
									readonly height?: number | null | undefined;
									readonly duration?: number | null | undefined;
								}>;
								readonly tags: ReadonlyArray<{
									readonly __typename: 'Tag';
									readonly name: string;
									readonly url: string;
								}>;
								readonly mentions: ReadonlyArray<{
									readonly __typename: 'Mention';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly url: string;
								}>;
								readonly agentAttribution?:
									| {
											readonly __typename: 'AgentPostAttribution';
											readonly triggerType?: string | null | undefined;
											readonly triggerDetails?: string | null | undefined;
											readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
											readonly delegatedBy?: string | null | undefined;
											readonly approvedBy?: string | null | undefined;
											readonly delegatedByDid?: string | null | undefined;
											readonly scopes?: ReadonlyArray<string> | null | undefined;
											readonly constraints?: ReadonlyArray<string> | null | undefined;
											readonly schemaVersion?: string | null | undefined;
											readonly modelId?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly quoteContext?:
									| {
											readonly __typename: 'QuoteContext';
											readonly quoteAllowed: boolean;
											readonly quoteType: import('./index.js').QuoteType;
											readonly withdrawn: boolean;
											readonly originalAuthor: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
											readonly originalNote?:
												| {
														readonly __typename: 'Object';
														readonly id: string;
														readonly type: import('./index.js').ObjectType;
												  }
												| null
												| undefined;
									  }
									| null
									| undefined;
								readonly communityNotes: ReadonlyArray<{
									readonly __typename: 'CommunityNote';
									readonly id: string;
									readonly content: string;
									readonly helpful: number;
									readonly notHelpful: number;
									readonly createdAt: string;
									readonly author: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
								}>;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly inReplyTo?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
											readonly actor: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly contentMap: ReadonlyArray<{
						readonly __typename: 'ContentMap';
						readonly language: string;
						readonly content: string;
					}>;
					readonly attachments: ReadonlyArray<{
						readonly __typename: 'Attachment';
						readonly id: string;
						readonly type: string;
						readonly url: string;
						readonly preview?: string | null | undefined;
						readonly description?: string | null | undefined;
						readonly blurhash?: string | null | undefined;
						readonly width?: number | null | undefined;
						readonly height?: number | null | undefined;
						readonly duration?: number | null | undefined;
					}>;
					readonly tags: ReadonlyArray<{
						readonly __typename: 'Tag';
						readonly name: string;
						readonly url: string;
					}>;
					readonly mentions: ReadonlyArray<{
						readonly __typename: 'Mention';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly url: string;
					}>;
					readonly agentAttribution?:
						| {
								readonly __typename: 'AgentPostAttribution';
								readonly triggerType?: string | null | undefined;
								readonly triggerDetails?: string | null | undefined;
								readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
								readonly delegatedBy?: string | null | undefined;
								readonly approvedBy?: string | null | undefined;
								readonly delegatedByDid?: string | null | undefined;
								readonly scopes?: ReadonlyArray<string> | null | undefined;
								readonly constraints?: ReadonlyArray<string> | null | undefined;
								readonly schemaVersion?: string | null | undefined;
								readonly modelId?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly quoteContext?:
						| {
								readonly __typename: 'QuoteContext';
								readonly quoteAllowed: boolean;
								readonly quoteType: import('./index.js').QuoteType;
								readonly withdrawn: boolean;
								readonly originalAuthor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly originalNote?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly communityNotes: ReadonlyArray<{
						readonly __typename: 'CommunityNote';
						readonly id: string;
						readonly content: string;
						readonly helpful: number;
						readonly notHelpful: number;
						readonly createdAt: string;
						readonly author: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
					}>;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly inReplyTo?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
	}>;
	declineMessageRequest(
		conversationId: DeclineMessageRequestMutationVariables['conversationId']
	): Promise<boolean>;
	markConversationAsRead(id: string): Promise<{
		readonly __typename: 'Conversation';
		readonly id: string;
		readonly unread: boolean;
		readonly updatedAt: string;
	}>;
	deleteConversation(conversationId: string): Promise<boolean>;
	deleteMessage(messageId: DeleteMessageMutationVariables['messageId']): Promise<boolean>;
	getLists(): Promise<
		readonly {
			readonly __typename: 'List';
			readonly id: string;
			readonly title: string;
			readonly repliesPolicy: import('./index.js').RepliesPolicy;
			readonly exclusive: boolean;
			readonly accountCount: number;
			readonly createdAt: string;
			readonly updatedAt: string;
		}[]
	>;
	getList(id: string): Promise<
		| {
				readonly __typename: 'List';
				readonly id: string;
				readonly title: string;
				readonly repliesPolicy: import('./index.js').RepliesPolicy;
				readonly exclusive: boolean;
				readonly accountCount: number;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly accounts: ReadonlyArray<{
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				}>;
		  }
		| null
		| undefined
	>;
	getListAccounts(id: string): Promise<
		readonly {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}[]
	>;
	createList(input: CreateListMutationVariables['input']): Promise<{
		readonly __typename: 'List';
		readonly id: string;
		readonly title: string;
		readonly repliesPolicy: import('./index.js').RepliesPolicy;
		readonly exclusive: boolean;
		readonly accountCount: number;
		readonly createdAt: string;
		readonly updatedAt: string;
	}>;
	updateList(
		id: string,
		input: UpdateListMutationVariables['input']
	): Promise<{
		readonly __typename: 'List';
		readonly id: string;
		readonly title: string;
		readonly repliesPolicy: import('./index.js').RepliesPolicy;
		readonly exclusive: boolean;
		readonly accountCount: number;
		readonly createdAt: string;
		readonly updatedAt: string;
	}>;
	deleteList(id: string): Promise<boolean>;
	addAccountsToList(
		id: string,
		accountIds: string[]
	): Promise<{
		readonly __typename: 'List';
		readonly id: string;
		readonly accountCount: number;
		readonly accounts: ReadonlyArray<{
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}>;
	}>;
	removeAccountsFromList(
		id: string,
		accountIds: string[]
	): Promise<{
		readonly __typename: 'List';
		readonly id: string;
		readonly accountCount: number;
		readonly accounts: ReadonlyArray<{
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}>;
	}>;
	uploadMedia(input: UploadMediaInput): Promise<UploadMediaMutation['uploadMedia']>;
	getMedia(id: string): Promise<
		| {
				readonly __typename: 'Media';
				readonly id: string;
				readonly type: import('./index.js').MediaType;
				readonly url: string;
				readonly previewUrl?: string | null | undefined;
				readonly description?: string | null | undefined;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly mediaCategory: import('./index.js').MediaCategory;
				readonly blurhash?: string | null | undefined;
				readonly width?: number | null | undefined;
				readonly height?: number | null | undefined;
				readonly duration?: number | null | undefined;
				readonly size: number;
				readonly mimeType: string;
				readonly createdAt: string;
				readonly uploadedBy: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
		  }
		| null
		| undefined
	>;
	updateMedia(
		id: string,
		input: UpdateMediaMutationVariables['input']
	): Promise<{
		readonly __typename: 'Media';
		readonly id: string;
		readonly description?: string | null | undefined;
		readonly sensitive: boolean;
		readonly spoilerText?: string | null | undefined;
		readonly mediaCategory: import('./index.js').MediaCategory;
		readonly blurhash?: string | null | undefined;
		readonly width?: number | null | undefined;
		readonly height?: number | null | undefined;
		readonly duration?: number | null | undefined;
		readonly url: string;
		readonly previewUrl?: string | null | undefined;
	}>;
	createNote(input: CreateNoteMutationVariables['input']): Promise<{
		readonly __typename: 'CreateNotePayload';
		readonly object: {
			readonly __typename: 'Object';
			readonly id: string;
			readonly type: import('./index.js').ObjectType;
			readonly content: string;
			readonly visibility: import('./index.js').Visibility;
			readonly sensitive: boolean;
			readonly spoilerText?: string | null | undefined;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly repliesCount: number;
			readonly likesCount: number;
			readonly sharesCount: number;
			readonly boosted: boolean;
			readonly relationshipType: import('./index.js').ObjectRelationshipType;
			readonly contentHash: string;
			readonly estimatedCost: number;
			readonly moderationScore?: number | null | undefined;
			readonly quoteUrl?: string | null | undefined;
			readonly quoteable: boolean;
			readonly quotePermissions: import('./index.js').QuotePermission;
			readonly quoteCount: number;
			readonly boostedObject?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly content: string;
						readonly visibility: import('./index.js').Visibility;
						readonly sensitive: boolean;
						readonly spoilerText?: string | null | undefined;
						readonly createdAt: string;
						readonly updatedAt: string;
						readonly repliesCount: number;
						readonly likesCount: number;
						readonly sharesCount: number;
						readonly boosted: boolean;
						readonly relationshipType: import('./index.js').ObjectRelationshipType;
						readonly contentHash: string;
						readonly estimatedCost: number;
						readonly moderationScore?: number | null | undefined;
						readonly quoteUrl?: string | null | undefined;
						readonly quoteable: boolean;
						readonly quotePermissions: import('./index.js').QuotePermission;
						readonly quoteCount: number;
						readonly contentMap: ReadonlyArray<{
							readonly __typename: 'ContentMap';
							readonly language: string;
							readonly content: string;
						}>;
						readonly attachments: ReadonlyArray<{
							readonly __typename: 'Attachment';
							readonly id: string;
							readonly type: string;
							readonly url: string;
							readonly preview?: string | null | undefined;
							readonly description?: string | null | undefined;
							readonly blurhash?: string | null | undefined;
							readonly width?: number | null | undefined;
							readonly height?: number | null | undefined;
							readonly duration?: number | null | undefined;
						}>;
						readonly tags: ReadonlyArray<{
							readonly __typename: 'Tag';
							readonly name: string;
							readonly url: string;
						}>;
						readonly mentions: ReadonlyArray<{
							readonly __typename: 'Mention';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly url: string;
						}>;
						readonly agentAttribution?:
							| {
									readonly __typename: 'AgentPostAttribution';
									readonly triggerType?: string | null | undefined;
									readonly triggerDetails?: string | null | undefined;
									readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
									readonly delegatedBy?: string | null | undefined;
									readonly approvedBy?: string | null | undefined;
									readonly delegatedByDid?: string | null | undefined;
									readonly scopes?: ReadonlyArray<string> | null | undefined;
									readonly constraints?: ReadonlyArray<string> | null | undefined;
									readonly schemaVersion?: string | null | undefined;
									readonly modelId?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly quoteContext?:
							| {
									readonly __typename: 'QuoteContext';
									readonly quoteAllowed: boolean;
									readonly quoteType: import('./index.js').QuoteType;
									readonly withdrawn: boolean;
									readonly originalAuthor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly originalNote?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly communityNotes: ReadonlyArray<{
							readonly __typename: 'CommunityNote';
							readonly id: string;
							readonly content: string;
							readonly helpful: number;
							readonly notHelpful: number;
							readonly createdAt: string;
							readonly author: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
						}>;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly inReplyTo?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly contentMap: ReadonlyArray<{
				readonly __typename: 'ContentMap';
				readonly language: string;
				readonly content: string;
			}>;
			readonly attachments: ReadonlyArray<{
				readonly __typename: 'Attachment';
				readonly id: string;
				readonly type: string;
				readonly url: string;
				readonly preview?: string | null | undefined;
				readonly description?: string | null | undefined;
				readonly blurhash?: string | null | undefined;
				readonly width?: number | null | undefined;
				readonly height?: number | null | undefined;
				readonly duration?: number | null | undefined;
			}>;
			readonly tags: ReadonlyArray<{
				readonly __typename: 'Tag';
				readonly name: string;
				readonly url: string;
			}>;
			readonly mentions: ReadonlyArray<{
				readonly __typename: 'Mention';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly url: string;
			}>;
			readonly agentAttribution?:
				| {
						readonly __typename: 'AgentPostAttribution';
						readonly triggerType?: string | null | undefined;
						readonly triggerDetails?: string | null | undefined;
						readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
						readonly delegatedBy?: string | null | undefined;
						readonly approvedBy?: string | null | undefined;
						readonly delegatedByDid?: string | null | undefined;
						readonly scopes?: ReadonlyArray<string> | null | undefined;
						readonly constraints?: ReadonlyArray<string> | null | undefined;
						readonly schemaVersion?: string | null | undefined;
						readonly modelId?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly quoteContext?:
				| {
						readonly __typename: 'QuoteContext';
						readonly quoteAllowed: boolean;
						readonly quoteType: import('./index.js').QuoteType;
						readonly withdrawn: boolean;
						readonly originalAuthor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly originalNote?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly communityNotes: ReadonlyArray<{
				readonly __typename: 'CommunityNote';
				readonly id: string;
				readonly content: string;
				readonly helpful: number;
				readonly notHelpful: number;
				readonly createdAt: string;
				readonly author: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
			}>;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly inReplyTo?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
				  }
				| null
				| undefined;
		};
		readonly activity: {
			readonly __typename: 'Activity';
			readonly id: string;
			readonly type: import('./index.js').ActivityType;
			readonly published: string;
			readonly cost: number;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly object?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
				  }
				| null
				| undefined;
			readonly target?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
				  }
				| null
				| undefined;
		};
		readonly cost: {
			readonly __typename: 'CostUpdate';
			readonly operationCost: number;
			readonly dailyTotal: number;
			readonly monthlyProjection: number;
		};
	}>;
	createQuoteNote(input: CreateQuoteNoteMutationVariables['input']): Promise<{
		readonly __typename: 'CreateNotePayload';
		readonly object: {
			readonly __typename: 'Object';
			readonly id: string;
			readonly type: import('./index.js').ObjectType;
			readonly content: string;
			readonly visibility: import('./index.js').Visibility;
			readonly sensitive: boolean;
			readonly spoilerText?: string | null | undefined;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly repliesCount: number;
			readonly likesCount: number;
			readonly sharesCount: number;
			readonly boosted: boolean;
			readonly relationshipType: import('./index.js').ObjectRelationshipType;
			readonly contentHash: string;
			readonly estimatedCost: number;
			readonly moderationScore?: number | null | undefined;
			readonly quoteUrl?: string | null | undefined;
			readonly quoteable: boolean;
			readonly quotePermissions: import('./index.js').QuotePermission;
			readonly quoteCount: number;
			readonly boostedObject?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly content: string;
						readonly visibility: import('./index.js').Visibility;
						readonly sensitive: boolean;
						readonly spoilerText?: string | null | undefined;
						readonly createdAt: string;
						readonly updatedAt: string;
						readonly repliesCount: number;
						readonly likesCount: number;
						readonly sharesCount: number;
						readonly boosted: boolean;
						readonly relationshipType: import('./index.js').ObjectRelationshipType;
						readonly contentHash: string;
						readonly estimatedCost: number;
						readonly moderationScore?: number | null | undefined;
						readonly quoteUrl?: string | null | undefined;
						readonly quoteable: boolean;
						readonly quotePermissions: import('./index.js').QuotePermission;
						readonly quoteCount: number;
						readonly contentMap: ReadonlyArray<{
							readonly __typename: 'ContentMap';
							readonly language: string;
							readonly content: string;
						}>;
						readonly attachments: ReadonlyArray<{
							readonly __typename: 'Attachment';
							readonly id: string;
							readonly type: string;
							readonly url: string;
							readonly preview?: string | null | undefined;
							readonly description?: string | null | undefined;
							readonly blurhash?: string | null | undefined;
							readonly width?: number | null | undefined;
							readonly height?: number | null | undefined;
							readonly duration?: number | null | undefined;
						}>;
						readonly tags: ReadonlyArray<{
							readonly __typename: 'Tag';
							readonly name: string;
							readonly url: string;
						}>;
						readonly mentions: ReadonlyArray<{
							readonly __typename: 'Mention';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly url: string;
						}>;
						readonly agentAttribution?:
							| {
									readonly __typename: 'AgentPostAttribution';
									readonly triggerType?: string | null | undefined;
									readonly triggerDetails?: string | null | undefined;
									readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
									readonly delegatedBy?: string | null | undefined;
									readonly approvedBy?: string | null | undefined;
									readonly delegatedByDid?: string | null | undefined;
									readonly scopes?: ReadonlyArray<string> | null | undefined;
									readonly constraints?: ReadonlyArray<string> | null | undefined;
									readonly schemaVersion?: string | null | undefined;
									readonly modelId?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly quoteContext?:
							| {
									readonly __typename: 'QuoteContext';
									readonly quoteAllowed: boolean;
									readonly quoteType: import('./index.js').QuoteType;
									readonly withdrawn: boolean;
									readonly originalAuthor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly originalNote?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly communityNotes: ReadonlyArray<{
							readonly __typename: 'CommunityNote';
							readonly id: string;
							readonly content: string;
							readonly helpful: number;
							readonly notHelpful: number;
							readonly createdAt: string;
							readonly author: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
						}>;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly inReplyTo?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly contentMap: ReadonlyArray<{
				readonly __typename: 'ContentMap';
				readonly language: string;
				readonly content: string;
			}>;
			readonly attachments: ReadonlyArray<{
				readonly __typename: 'Attachment';
				readonly id: string;
				readonly type: string;
				readonly url: string;
				readonly preview?: string | null | undefined;
				readonly description?: string | null | undefined;
				readonly blurhash?: string | null | undefined;
				readonly width?: number | null | undefined;
				readonly height?: number | null | undefined;
				readonly duration?: number | null | undefined;
			}>;
			readonly tags: ReadonlyArray<{
				readonly __typename: 'Tag';
				readonly name: string;
				readonly url: string;
			}>;
			readonly mentions: ReadonlyArray<{
				readonly __typename: 'Mention';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly url: string;
			}>;
			readonly agentAttribution?:
				| {
						readonly __typename: 'AgentPostAttribution';
						readonly triggerType?: string | null | undefined;
						readonly triggerDetails?: string | null | undefined;
						readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
						readonly delegatedBy?: string | null | undefined;
						readonly approvedBy?: string | null | undefined;
						readonly delegatedByDid?: string | null | undefined;
						readonly scopes?: ReadonlyArray<string> | null | undefined;
						readonly constraints?: ReadonlyArray<string> | null | undefined;
						readonly schemaVersion?: string | null | undefined;
						readonly modelId?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly quoteContext?:
				| {
						readonly __typename: 'QuoteContext';
						readonly quoteAllowed: boolean;
						readonly quoteType: import('./index.js').QuoteType;
						readonly withdrawn: boolean;
						readonly originalAuthor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly originalNote?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly communityNotes: ReadonlyArray<{
				readonly __typename: 'CommunityNote';
				readonly id: string;
				readonly content: string;
				readonly helpful: number;
				readonly notHelpful: number;
				readonly createdAt: string;
				readonly author: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
			}>;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly inReplyTo?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
				  }
				| null
				| undefined;
		};
		readonly activity: {
			readonly __typename: 'Activity';
			readonly id: string;
			readonly type: import('./index.js').ActivityType;
			readonly published: string;
			readonly cost: number;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly object?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
				  }
				| null
				| undefined;
			readonly target?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
				  }
				| null
				| undefined;
		};
		readonly cost: {
			readonly __typename: 'CostUpdate';
			readonly operationCost: number;
			readonly dailyTotal: number;
			readonly monthlyProjection: number;
		};
	}>;
	getObjectWithQuotes(
		id: string,
		first?: number,
		after?: string
	): Promise<
		| {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly quotes: {
					readonly __typename: 'QuoteConnection';
					readonly totalCount: number;
					readonly edges: ReadonlyArray<{
						readonly __typename: 'QuoteEdge';
						readonly cursor: string;
						readonly node: {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly boostedObject?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly content: string;
										readonly visibility: import('./index.js').Visibility;
										readonly sensitive: boolean;
										readonly spoilerText?: string | null | undefined;
										readonly createdAt: string;
										readonly updatedAt: string;
										readonly repliesCount: number;
										readonly likesCount: number;
										readonly sharesCount: number;
										readonly boosted: boolean;
										readonly relationshipType: import('./index.js').ObjectRelationshipType;
										readonly contentHash: string;
										readonly estimatedCost: number;
										readonly moderationScore?: number | null | undefined;
										readonly quoteUrl?: string | null | undefined;
										readonly quoteable: boolean;
										readonly quotePermissions: import('./index.js').QuotePermission;
										readonly quoteCount: number;
										readonly contentMap: ReadonlyArray<{
											readonly __typename: 'ContentMap';
											readonly language: string;
											readonly content: string;
										}>;
										readonly attachments: ReadonlyArray<{
											readonly __typename: 'Attachment';
											readonly id: string;
											readonly type: string;
											readonly url: string;
											readonly preview?: string | null | undefined;
											readonly description?: string | null | undefined;
											readonly blurhash?: string | null | undefined;
											readonly width?: number | null | undefined;
											readonly height?: number | null | undefined;
											readonly duration?: number | null | undefined;
										}>;
										readonly tags: ReadonlyArray<{
											readonly __typename: 'Tag';
											readonly name: string;
											readonly url: string;
										}>;
										readonly mentions: ReadonlyArray<{
											readonly __typename: 'Mention';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly url: string;
										}>;
										readonly agentAttribution?:
											| {
													readonly __typename: 'AgentPostAttribution';
													readonly triggerType?: string | null | undefined;
													readonly triggerDetails?: string | null | undefined;
													readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
													readonly delegatedBy?: string | null | undefined;
													readonly approvedBy?: string | null | undefined;
													readonly delegatedByDid?: string | null | undefined;
													readonly scopes?: ReadonlyArray<string> | null | undefined;
													readonly constraints?: ReadonlyArray<string> | null | undefined;
													readonly schemaVersion?: string | null | undefined;
													readonly modelId?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly quoteContext?:
											| {
													readonly __typename: 'QuoteContext';
													readonly quoteAllowed: boolean;
													readonly quoteType: import('./index.js').QuoteType;
													readonly withdrawn: boolean;
													readonly originalAuthor: {
														readonly __typename: 'Actor';
														readonly id: string;
														readonly username: string;
														readonly domain?: string | null | undefined;
														readonly displayName?: string | null | undefined;
														readonly summary?: string | null | undefined;
														readonly avatar?: string | null | undefined;
														readonly header?: string | null | undefined;
														readonly followers: number;
														readonly following: number;
														readonly statusesCount: number;
														readonly bot: boolean;
														readonly locked: boolean;
														readonly updatedAt: string;
														readonly isAgent: boolean;
														readonly tipAddress?: string | null | undefined;
														readonly tipChainId?: number | null | undefined;
														readonly trustScore: number;
														readonly agentInfo?:
															| {
																	readonly __typename: 'Agent';
																	readonly id: string;
																	readonly agentType: import('./index.js').AgentType;
																	readonly verified: boolean;
																	readonly verifiedAt?: string | null | undefined;
															  }
															| null
															| undefined;
														readonly fields: ReadonlyArray<{
															readonly __typename: 'Field';
															readonly name: string;
															readonly value: string;
															readonly verifiedAt?: string | null | undefined;
														}>;
													};
													readonly originalNote?:
														| {
																readonly __typename: 'Object';
																readonly id: string;
																readonly type: import('./index.js').ObjectType;
														  }
														| null
														| undefined;
											  }
											| null
											| undefined;
										readonly communityNotes: ReadonlyArray<{
											readonly __typename: 'CommunityNote';
											readonly id: string;
											readonly content: string;
											readonly helpful: number;
											readonly notHelpful: number;
											readonly createdAt: string;
											readonly author: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
										}>;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly inReplyTo?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
													readonly actor: {
														readonly __typename: 'Actor';
														readonly id: string;
														readonly username: string;
														readonly domain?: string | null | undefined;
														readonly displayName?: string | null | undefined;
														readonly summary?: string | null | undefined;
														readonly avatar?: string | null | undefined;
														readonly header?: string | null | undefined;
														readonly followers: number;
														readonly following: number;
														readonly statusesCount: number;
														readonly bot: boolean;
														readonly locked: boolean;
														readonly updatedAt: string;
														readonly isAgent: boolean;
														readonly tipAddress?: string | null | undefined;
														readonly tipChainId?: number | null | undefined;
														readonly trustScore: number;
														readonly agentInfo?:
															| {
																	readonly __typename: 'Agent';
																	readonly id: string;
																	readonly agentType: import('./index.js').AgentType;
																	readonly verified: boolean;
																	readonly verifiedAt?: string | null | undefined;
															  }
															| null
															| undefined;
														readonly fields: ReadonlyArray<{
															readonly __typename: 'Field';
															readonly name: string;
															readonly value: string;
															readonly verifiedAt?: string | null | undefined;
														}>;
													};
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
						};
					}>;
					readonly pageInfo: {
						readonly __typename: 'PageInfo';
						readonly hasNextPage: boolean;
						readonly hasPreviousPage: boolean;
						readonly startCursor?: string | null | undefined;
						readonly endCursor?: string | null | undefined;
					};
				};
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
		  }
		| null
		| undefined
	>;
	withdrawFromQuotes(noteId: string): Promise<{
		readonly __typename: 'WithdrawQuotePayload';
		readonly success: boolean;
		readonly withdrawnCount: number;
		readonly note: {
			readonly __typename: 'Object';
			readonly id: string;
			readonly type: import('./index.js').ObjectType;
			readonly content: string;
			readonly visibility: import('./index.js').Visibility;
			readonly sensitive: boolean;
			readonly spoilerText?: string | null | undefined;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly repliesCount: number;
			readonly likesCount: number;
			readonly sharesCount: number;
			readonly boosted: boolean;
			readonly relationshipType: import('./index.js').ObjectRelationshipType;
			readonly contentHash: string;
			readonly estimatedCost: number;
			readonly moderationScore?: number | null | undefined;
			readonly quoteUrl?: string | null | undefined;
			readonly quoteable: boolean;
			readonly quotePermissions: import('./index.js').QuotePermission;
			readonly quoteCount: number;
			readonly boostedObject?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly content: string;
						readonly visibility: import('./index.js').Visibility;
						readonly sensitive: boolean;
						readonly spoilerText?: string | null | undefined;
						readonly createdAt: string;
						readonly updatedAt: string;
						readonly repliesCount: number;
						readonly likesCount: number;
						readonly sharesCount: number;
						readonly boosted: boolean;
						readonly relationshipType: import('./index.js').ObjectRelationshipType;
						readonly contentHash: string;
						readonly estimatedCost: number;
						readonly moderationScore?: number | null | undefined;
						readonly quoteUrl?: string | null | undefined;
						readonly quoteable: boolean;
						readonly quotePermissions: import('./index.js').QuotePermission;
						readonly quoteCount: number;
						readonly contentMap: ReadonlyArray<{
							readonly __typename: 'ContentMap';
							readonly language: string;
							readonly content: string;
						}>;
						readonly attachments: ReadonlyArray<{
							readonly __typename: 'Attachment';
							readonly id: string;
							readonly type: string;
							readonly url: string;
							readonly preview?: string | null | undefined;
							readonly description?: string | null | undefined;
							readonly blurhash?: string | null | undefined;
							readonly width?: number | null | undefined;
							readonly height?: number | null | undefined;
							readonly duration?: number | null | undefined;
						}>;
						readonly tags: ReadonlyArray<{
							readonly __typename: 'Tag';
							readonly name: string;
							readonly url: string;
						}>;
						readonly mentions: ReadonlyArray<{
							readonly __typename: 'Mention';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly url: string;
						}>;
						readonly agentAttribution?:
							| {
									readonly __typename: 'AgentPostAttribution';
									readonly triggerType?: string | null | undefined;
									readonly triggerDetails?: string | null | undefined;
									readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
									readonly delegatedBy?: string | null | undefined;
									readonly approvedBy?: string | null | undefined;
									readonly delegatedByDid?: string | null | undefined;
									readonly scopes?: ReadonlyArray<string> | null | undefined;
									readonly constraints?: ReadonlyArray<string> | null | undefined;
									readonly schemaVersion?: string | null | undefined;
									readonly modelId?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly quoteContext?:
							| {
									readonly __typename: 'QuoteContext';
									readonly quoteAllowed: boolean;
									readonly quoteType: import('./index.js').QuoteType;
									readonly withdrawn: boolean;
									readonly originalAuthor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly originalNote?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly communityNotes: ReadonlyArray<{
							readonly __typename: 'CommunityNote';
							readonly id: string;
							readonly content: string;
							readonly helpful: number;
							readonly notHelpful: number;
							readonly createdAt: string;
							readonly author: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
						}>;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly inReplyTo?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly contentMap: ReadonlyArray<{
				readonly __typename: 'ContentMap';
				readonly language: string;
				readonly content: string;
			}>;
			readonly attachments: ReadonlyArray<{
				readonly __typename: 'Attachment';
				readonly id: string;
				readonly type: string;
				readonly url: string;
				readonly preview?: string | null | undefined;
				readonly description?: string | null | undefined;
				readonly blurhash?: string | null | undefined;
				readonly width?: number | null | undefined;
				readonly height?: number | null | undefined;
				readonly duration?: number | null | undefined;
			}>;
			readonly tags: ReadonlyArray<{
				readonly __typename: 'Tag';
				readonly name: string;
				readonly url: string;
			}>;
			readonly mentions: ReadonlyArray<{
				readonly __typename: 'Mention';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly url: string;
			}>;
			readonly agentAttribution?:
				| {
						readonly __typename: 'AgentPostAttribution';
						readonly triggerType?: string | null | undefined;
						readonly triggerDetails?: string | null | undefined;
						readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
						readonly delegatedBy?: string | null | undefined;
						readonly approvedBy?: string | null | undefined;
						readonly delegatedByDid?: string | null | undefined;
						readonly scopes?: ReadonlyArray<string> | null | undefined;
						readonly constraints?: ReadonlyArray<string> | null | undefined;
						readonly schemaVersion?: string | null | undefined;
						readonly modelId?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly quoteContext?:
				| {
						readonly __typename: 'QuoteContext';
						readonly quoteAllowed: boolean;
						readonly quoteType: import('./index.js').QuoteType;
						readonly withdrawn: boolean;
						readonly originalAuthor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly originalNote?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly communityNotes: ReadonlyArray<{
				readonly __typename: 'CommunityNote';
				readonly id: string;
				readonly content: string;
				readonly helpful: number;
				readonly notHelpful: number;
				readonly createdAt: string;
				readonly author: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
			}>;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly inReplyTo?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
				  }
				| null
				| undefined;
		};
	}>;
	updateQuotePermissions(
		noteId: string,
		quoteable: boolean,
		permission: 'EVERYONE' | 'FOLLOWERS' | 'MENTIONED' | 'NONE'
	): Promise<{
		readonly __typename: 'UpdateQuotePermissionsPayload';
		readonly success: boolean;
		readonly affectedQuotes: number;
		readonly note: {
			readonly __typename: 'Object';
			readonly id: string;
			readonly type: import('./index.js').ObjectType;
			readonly content: string;
			readonly visibility: import('./index.js').Visibility;
			readonly sensitive: boolean;
			readonly spoilerText?: string | null | undefined;
			readonly createdAt: string;
			readonly updatedAt: string;
			readonly repliesCount: number;
			readonly likesCount: number;
			readonly sharesCount: number;
			readonly boosted: boolean;
			readonly relationshipType: import('./index.js').ObjectRelationshipType;
			readonly contentHash: string;
			readonly estimatedCost: number;
			readonly moderationScore?: number | null | undefined;
			readonly quoteUrl?: string | null | undefined;
			readonly quoteable: boolean;
			readonly quotePermissions: import('./index.js').QuotePermission;
			readonly quoteCount: number;
			readonly boostedObject?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly content: string;
						readonly visibility: import('./index.js').Visibility;
						readonly sensitive: boolean;
						readonly spoilerText?: string | null | undefined;
						readonly createdAt: string;
						readonly updatedAt: string;
						readonly repliesCount: number;
						readonly likesCount: number;
						readonly sharesCount: number;
						readonly boosted: boolean;
						readonly relationshipType: import('./index.js').ObjectRelationshipType;
						readonly contentHash: string;
						readonly estimatedCost: number;
						readonly moderationScore?: number | null | undefined;
						readonly quoteUrl?: string | null | undefined;
						readonly quoteable: boolean;
						readonly quotePermissions: import('./index.js').QuotePermission;
						readonly quoteCount: number;
						readonly contentMap: ReadonlyArray<{
							readonly __typename: 'ContentMap';
							readonly language: string;
							readonly content: string;
						}>;
						readonly attachments: ReadonlyArray<{
							readonly __typename: 'Attachment';
							readonly id: string;
							readonly type: string;
							readonly url: string;
							readonly preview?: string | null | undefined;
							readonly description?: string | null | undefined;
							readonly blurhash?: string | null | undefined;
							readonly width?: number | null | undefined;
							readonly height?: number | null | undefined;
							readonly duration?: number | null | undefined;
						}>;
						readonly tags: ReadonlyArray<{
							readonly __typename: 'Tag';
							readonly name: string;
							readonly url: string;
						}>;
						readonly mentions: ReadonlyArray<{
							readonly __typename: 'Mention';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly url: string;
						}>;
						readonly agentAttribution?:
							| {
									readonly __typename: 'AgentPostAttribution';
									readonly triggerType?: string | null | undefined;
									readonly triggerDetails?: string | null | undefined;
									readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
									readonly delegatedBy?: string | null | undefined;
									readonly approvedBy?: string | null | undefined;
									readonly delegatedByDid?: string | null | undefined;
									readonly scopes?: ReadonlyArray<string> | null | undefined;
									readonly constraints?: ReadonlyArray<string> | null | undefined;
									readonly schemaVersion?: string | null | undefined;
									readonly modelId?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly quoteContext?:
							| {
									readonly __typename: 'QuoteContext';
									readonly quoteAllowed: boolean;
									readonly quoteType: import('./index.js').QuoteType;
									readonly withdrawn: boolean;
									readonly originalAuthor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
									readonly originalNote?:
										| {
												readonly __typename: 'Object';
												readonly id: string;
												readonly type: import('./index.js').ObjectType;
										  }
										| null
										| undefined;
							  }
							| null
							| undefined;
						readonly communityNotes: ReadonlyArray<{
							readonly __typename: 'CommunityNote';
							readonly id: string;
							readonly content: string;
							readonly helpful: number;
							readonly notHelpful: number;
							readonly createdAt: string;
							readonly author: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
						}>;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly inReplyTo?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
									readonly actor: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly contentMap: ReadonlyArray<{
				readonly __typename: 'ContentMap';
				readonly language: string;
				readonly content: string;
			}>;
			readonly attachments: ReadonlyArray<{
				readonly __typename: 'Attachment';
				readonly id: string;
				readonly type: string;
				readonly url: string;
				readonly preview?: string | null | undefined;
				readonly description?: string | null | undefined;
				readonly blurhash?: string | null | undefined;
				readonly width?: number | null | undefined;
				readonly height?: number | null | undefined;
				readonly duration?: number | null | undefined;
			}>;
			readonly tags: ReadonlyArray<{
				readonly __typename: 'Tag';
				readonly name: string;
				readonly url: string;
			}>;
			readonly mentions: ReadonlyArray<{
				readonly __typename: 'Mention';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly url: string;
			}>;
			readonly agentAttribution?:
				| {
						readonly __typename: 'AgentPostAttribution';
						readonly triggerType?: string | null | undefined;
						readonly triggerDetails?: string | null | undefined;
						readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
						readonly delegatedBy?: string | null | undefined;
						readonly approvedBy?: string | null | undefined;
						readonly delegatedByDid?: string | null | undefined;
						readonly scopes?: ReadonlyArray<string> | null | undefined;
						readonly constraints?: ReadonlyArray<string> | null | undefined;
						readonly schemaVersion?: string | null | undefined;
						readonly modelId?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly quoteContext?:
				| {
						readonly __typename: 'QuoteContext';
						readonly quoteAllowed: boolean;
						readonly quoteType: import('./index.js').QuoteType;
						readonly withdrawn: boolean;
						readonly originalAuthor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
						readonly originalNote?:
							| {
									readonly __typename: 'Object';
									readonly id: string;
									readonly type: import('./index.js').ObjectType;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			readonly communityNotes: ReadonlyArray<{
				readonly __typename: 'CommunityNote';
				readonly id: string;
				readonly content: string;
				readonly helpful: number;
				readonly notHelpful: number;
				readonly createdAt: string;
				readonly author: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
			}>;
			readonly actor: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly inReplyTo?:
				| {
						readonly __typename: 'Object';
						readonly id: string;
						readonly type: import('./index.js').ObjectType;
						readonly actor: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
				  }
				| null
				| undefined;
		};
	}>;
	deleteObject(id: string): Promise<boolean>;
	likeObject(id: string): Promise<{
		readonly __typename: 'Activity';
		readonly id: string;
		readonly type: import('./index.js').ActivityType;
		readonly published: string;
		readonly cost: number;
		readonly actor: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
		readonly object?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
			  }
			| null
			| undefined;
		readonly target?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
			  }
			| null
			| undefined;
	}>;
	unlikeObject(id: string): Promise<boolean>;
	shareObject(id: string): Promise<{
		readonly __typename: 'Object';
		readonly id: string;
		readonly type: import('./index.js').ObjectType;
		readonly content: string;
		readonly visibility: import('./index.js').Visibility;
		readonly sensitive: boolean;
		readonly spoilerText?: string | null | undefined;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly repliesCount: number;
		readonly likesCount: number;
		readonly sharesCount: number;
		readonly boosted: boolean;
		readonly relationshipType: import('./index.js').ObjectRelationshipType;
		readonly contentHash: string;
		readonly estimatedCost: number;
		readonly moderationScore?: number | null | undefined;
		readonly quoteUrl?: string | null | undefined;
		readonly quoteable: boolean;
		readonly quotePermissions: import('./index.js').QuotePermission;
		readonly quoteCount: number;
		readonly boostedObject?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly content: string;
					readonly visibility: import('./index.js').Visibility;
					readonly sensitive: boolean;
					readonly spoilerText?: string | null | undefined;
					readonly createdAt: string;
					readonly updatedAt: string;
					readonly repliesCount: number;
					readonly likesCount: number;
					readonly sharesCount: number;
					readonly boosted: boolean;
					readonly relationshipType: import('./index.js').ObjectRelationshipType;
					readonly contentHash: string;
					readonly estimatedCost: number;
					readonly moderationScore?: number | null | undefined;
					readonly quoteUrl?: string | null | undefined;
					readonly quoteable: boolean;
					readonly quotePermissions: import('./index.js').QuotePermission;
					readonly quoteCount: number;
					readonly contentMap: ReadonlyArray<{
						readonly __typename: 'ContentMap';
						readonly language: string;
						readonly content: string;
					}>;
					readonly attachments: ReadonlyArray<{
						readonly __typename: 'Attachment';
						readonly id: string;
						readonly type: string;
						readonly url: string;
						readonly preview?: string | null | undefined;
						readonly description?: string | null | undefined;
						readonly blurhash?: string | null | undefined;
						readonly width?: number | null | undefined;
						readonly height?: number | null | undefined;
						readonly duration?: number | null | undefined;
					}>;
					readonly tags: ReadonlyArray<{
						readonly __typename: 'Tag';
						readonly name: string;
						readonly url: string;
					}>;
					readonly mentions: ReadonlyArray<{
						readonly __typename: 'Mention';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly url: string;
					}>;
					readonly agentAttribution?:
						| {
								readonly __typename: 'AgentPostAttribution';
								readonly triggerType?: string | null | undefined;
								readonly triggerDetails?: string | null | undefined;
								readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
								readonly delegatedBy?: string | null | undefined;
								readonly approvedBy?: string | null | undefined;
								readonly delegatedByDid?: string | null | undefined;
								readonly scopes?: ReadonlyArray<string> | null | undefined;
								readonly constraints?: ReadonlyArray<string> | null | undefined;
								readonly schemaVersion?: string | null | undefined;
								readonly modelId?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly quoteContext?:
						| {
								readonly __typename: 'QuoteContext';
								readonly quoteAllowed: boolean;
								readonly quoteType: import('./index.js').QuoteType;
								readonly withdrawn: boolean;
								readonly originalAuthor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly originalNote?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly communityNotes: ReadonlyArray<{
						readonly __typename: 'CommunityNote';
						readonly id: string;
						readonly content: string;
						readonly helpful: number;
						readonly notHelpful: number;
						readonly createdAt: string;
						readonly author: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
					}>;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly inReplyTo?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly contentMap: ReadonlyArray<{
			readonly __typename: 'ContentMap';
			readonly language: string;
			readonly content: string;
		}>;
		readonly attachments: ReadonlyArray<{
			readonly __typename: 'Attachment';
			readonly id: string;
			readonly type: string;
			readonly url: string;
			readonly preview?: string | null | undefined;
			readonly description?: string | null | undefined;
			readonly blurhash?: string | null | undefined;
			readonly width?: number | null | undefined;
			readonly height?: number | null | undefined;
			readonly duration?: number | null | undefined;
		}>;
		readonly tags: ReadonlyArray<{
			readonly __typename: 'Tag';
			readonly name: string;
			readonly url: string;
		}>;
		readonly mentions: ReadonlyArray<{
			readonly __typename: 'Mention';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly url: string;
		}>;
		readonly agentAttribution?:
			| {
					readonly __typename: 'AgentPostAttribution';
					readonly triggerType?: string | null | undefined;
					readonly triggerDetails?: string | null | undefined;
					readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
					readonly delegatedBy?: string | null | undefined;
					readonly approvedBy?: string | null | undefined;
					readonly delegatedByDid?: string | null | undefined;
					readonly scopes?: ReadonlyArray<string> | null | undefined;
					readonly constraints?: ReadonlyArray<string> | null | undefined;
					readonly schemaVersion?: string | null | undefined;
					readonly modelId?: string | null | undefined;
			  }
			| null
			| undefined;
		readonly quoteContext?:
			| {
					readonly __typename: 'QuoteContext';
					readonly quoteAllowed: boolean;
					readonly quoteType: import('./index.js').QuoteType;
					readonly withdrawn: boolean;
					readonly originalAuthor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly originalNote?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly communityNotes: ReadonlyArray<{
			readonly __typename: 'CommunityNote';
			readonly id: string;
			readonly content: string;
			readonly helpful: number;
			readonly notHelpful: number;
			readonly createdAt: string;
			readonly author: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
		}>;
		readonly actor: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
		readonly inReplyTo?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
			  }
			| null
			| undefined;
	}>;
	unshareObject(id: string): Promise<{
		readonly __typename: 'Object';
		readonly id: string;
		readonly type: import('./index.js').ObjectType;
		readonly content: string;
		readonly visibility: import('./index.js').Visibility;
		readonly sensitive: boolean;
		readonly spoilerText?: string | null | undefined;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly repliesCount: number;
		readonly likesCount: number;
		readonly sharesCount: number;
		readonly boosted: boolean;
		readonly relationshipType: import('./index.js').ObjectRelationshipType;
		readonly contentHash: string;
		readonly estimatedCost: number;
		readonly moderationScore?: number | null | undefined;
		readonly quoteUrl?: string | null | undefined;
		readonly quoteable: boolean;
		readonly quotePermissions: import('./index.js').QuotePermission;
		readonly quoteCount: number;
		readonly boostedObject?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly content: string;
					readonly visibility: import('./index.js').Visibility;
					readonly sensitive: boolean;
					readonly spoilerText?: string | null | undefined;
					readonly createdAt: string;
					readonly updatedAt: string;
					readonly repliesCount: number;
					readonly likesCount: number;
					readonly sharesCount: number;
					readonly boosted: boolean;
					readonly relationshipType: import('./index.js').ObjectRelationshipType;
					readonly contentHash: string;
					readonly estimatedCost: number;
					readonly moderationScore?: number | null | undefined;
					readonly quoteUrl?: string | null | undefined;
					readonly quoteable: boolean;
					readonly quotePermissions: import('./index.js').QuotePermission;
					readonly quoteCount: number;
					readonly contentMap: ReadonlyArray<{
						readonly __typename: 'ContentMap';
						readonly language: string;
						readonly content: string;
					}>;
					readonly attachments: ReadonlyArray<{
						readonly __typename: 'Attachment';
						readonly id: string;
						readonly type: string;
						readonly url: string;
						readonly preview?: string | null | undefined;
						readonly description?: string | null | undefined;
						readonly blurhash?: string | null | undefined;
						readonly width?: number | null | undefined;
						readonly height?: number | null | undefined;
						readonly duration?: number | null | undefined;
					}>;
					readonly tags: ReadonlyArray<{
						readonly __typename: 'Tag';
						readonly name: string;
						readonly url: string;
					}>;
					readonly mentions: ReadonlyArray<{
						readonly __typename: 'Mention';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly url: string;
					}>;
					readonly agentAttribution?:
						| {
								readonly __typename: 'AgentPostAttribution';
								readonly triggerType?: string | null | undefined;
								readonly triggerDetails?: string | null | undefined;
								readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
								readonly delegatedBy?: string | null | undefined;
								readonly approvedBy?: string | null | undefined;
								readonly delegatedByDid?: string | null | undefined;
								readonly scopes?: ReadonlyArray<string> | null | undefined;
								readonly constraints?: ReadonlyArray<string> | null | undefined;
								readonly schemaVersion?: string | null | undefined;
								readonly modelId?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly quoteContext?:
						| {
								readonly __typename: 'QuoteContext';
								readonly quoteAllowed: boolean;
								readonly quoteType: import('./index.js').QuoteType;
								readonly withdrawn: boolean;
								readonly originalAuthor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly originalNote?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly communityNotes: ReadonlyArray<{
						readonly __typename: 'CommunityNote';
						readonly id: string;
						readonly content: string;
						readonly helpful: number;
						readonly notHelpful: number;
						readonly createdAt: string;
						readonly author: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
					}>;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly inReplyTo?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly contentMap: ReadonlyArray<{
			readonly __typename: 'ContentMap';
			readonly language: string;
			readonly content: string;
		}>;
		readonly attachments: ReadonlyArray<{
			readonly __typename: 'Attachment';
			readonly id: string;
			readonly type: string;
			readonly url: string;
			readonly preview?: string | null | undefined;
			readonly description?: string | null | undefined;
			readonly blurhash?: string | null | undefined;
			readonly width?: number | null | undefined;
			readonly height?: number | null | undefined;
			readonly duration?: number | null | undefined;
		}>;
		readonly tags: ReadonlyArray<{
			readonly __typename: 'Tag';
			readonly name: string;
			readonly url: string;
		}>;
		readonly mentions: ReadonlyArray<{
			readonly __typename: 'Mention';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly url: string;
		}>;
		readonly agentAttribution?:
			| {
					readonly __typename: 'AgentPostAttribution';
					readonly triggerType?: string | null | undefined;
					readonly triggerDetails?: string | null | undefined;
					readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
					readonly delegatedBy?: string | null | undefined;
					readonly approvedBy?: string | null | undefined;
					readonly delegatedByDid?: string | null | undefined;
					readonly scopes?: ReadonlyArray<string> | null | undefined;
					readonly constraints?: ReadonlyArray<string> | null | undefined;
					readonly schemaVersion?: string | null | undefined;
					readonly modelId?: string | null | undefined;
			  }
			| null
			| undefined;
		readonly quoteContext?:
			| {
					readonly __typename: 'QuoteContext';
					readonly quoteAllowed: boolean;
					readonly quoteType: import('./index.js').QuoteType;
					readonly withdrawn: boolean;
					readonly originalAuthor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly originalNote?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly communityNotes: ReadonlyArray<{
			readonly __typename: 'CommunityNote';
			readonly id: string;
			readonly content: string;
			readonly helpful: number;
			readonly notHelpful: number;
			readonly createdAt: string;
			readonly author: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
		}>;
		readonly actor: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
		readonly inReplyTo?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
			  }
			| null
			| undefined;
	}>;
	bookmarkObject(id: string): Promise<{
		readonly __typename: 'Object';
		readonly id: string;
		readonly type: import('./index.js').ObjectType;
		readonly content: string;
		readonly visibility: import('./index.js').Visibility;
		readonly sensitive: boolean;
		readonly spoilerText?: string | null | undefined;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly repliesCount: number;
		readonly likesCount: number;
		readonly sharesCount: number;
		readonly boosted: boolean;
		readonly relationshipType: import('./index.js').ObjectRelationshipType;
		readonly contentHash: string;
		readonly estimatedCost: number;
		readonly moderationScore?: number | null | undefined;
		readonly quoteUrl?: string | null | undefined;
		readonly quoteable: boolean;
		readonly quotePermissions: import('./index.js').QuotePermission;
		readonly quoteCount: number;
		readonly boostedObject?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly content: string;
					readonly visibility: import('./index.js').Visibility;
					readonly sensitive: boolean;
					readonly spoilerText?: string | null | undefined;
					readonly createdAt: string;
					readonly updatedAt: string;
					readonly repliesCount: number;
					readonly likesCount: number;
					readonly sharesCount: number;
					readonly boosted: boolean;
					readonly relationshipType: import('./index.js').ObjectRelationshipType;
					readonly contentHash: string;
					readonly estimatedCost: number;
					readonly moderationScore?: number | null | undefined;
					readonly quoteUrl?: string | null | undefined;
					readonly quoteable: boolean;
					readonly quotePermissions: import('./index.js').QuotePermission;
					readonly quoteCount: number;
					readonly contentMap: ReadonlyArray<{
						readonly __typename: 'ContentMap';
						readonly language: string;
						readonly content: string;
					}>;
					readonly attachments: ReadonlyArray<{
						readonly __typename: 'Attachment';
						readonly id: string;
						readonly type: string;
						readonly url: string;
						readonly preview?: string | null | undefined;
						readonly description?: string | null | undefined;
						readonly blurhash?: string | null | undefined;
						readonly width?: number | null | undefined;
						readonly height?: number | null | undefined;
						readonly duration?: number | null | undefined;
					}>;
					readonly tags: ReadonlyArray<{
						readonly __typename: 'Tag';
						readonly name: string;
						readonly url: string;
					}>;
					readonly mentions: ReadonlyArray<{
						readonly __typename: 'Mention';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly url: string;
					}>;
					readonly agentAttribution?:
						| {
								readonly __typename: 'AgentPostAttribution';
								readonly triggerType?: string | null | undefined;
								readonly triggerDetails?: string | null | undefined;
								readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
								readonly delegatedBy?: string | null | undefined;
								readonly approvedBy?: string | null | undefined;
								readonly delegatedByDid?: string | null | undefined;
								readonly scopes?: ReadonlyArray<string> | null | undefined;
								readonly constraints?: ReadonlyArray<string> | null | undefined;
								readonly schemaVersion?: string | null | undefined;
								readonly modelId?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly quoteContext?:
						| {
								readonly __typename: 'QuoteContext';
								readonly quoteAllowed: boolean;
								readonly quoteType: import('./index.js').QuoteType;
								readonly withdrawn: boolean;
								readonly originalAuthor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly originalNote?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly communityNotes: ReadonlyArray<{
						readonly __typename: 'CommunityNote';
						readonly id: string;
						readonly content: string;
						readonly helpful: number;
						readonly notHelpful: number;
						readonly createdAt: string;
						readonly author: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
					}>;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly inReplyTo?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly contentMap: ReadonlyArray<{
			readonly __typename: 'ContentMap';
			readonly language: string;
			readonly content: string;
		}>;
		readonly attachments: ReadonlyArray<{
			readonly __typename: 'Attachment';
			readonly id: string;
			readonly type: string;
			readonly url: string;
			readonly preview?: string | null | undefined;
			readonly description?: string | null | undefined;
			readonly blurhash?: string | null | undefined;
			readonly width?: number | null | undefined;
			readonly height?: number | null | undefined;
			readonly duration?: number | null | undefined;
		}>;
		readonly tags: ReadonlyArray<{
			readonly __typename: 'Tag';
			readonly name: string;
			readonly url: string;
		}>;
		readonly mentions: ReadonlyArray<{
			readonly __typename: 'Mention';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly url: string;
		}>;
		readonly agentAttribution?:
			| {
					readonly __typename: 'AgentPostAttribution';
					readonly triggerType?: string | null | undefined;
					readonly triggerDetails?: string | null | undefined;
					readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
					readonly delegatedBy?: string | null | undefined;
					readonly approvedBy?: string | null | undefined;
					readonly delegatedByDid?: string | null | undefined;
					readonly scopes?: ReadonlyArray<string> | null | undefined;
					readonly constraints?: ReadonlyArray<string> | null | undefined;
					readonly schemaVersion?: string | null | undefined;
					readonly modelId?: string | null | undefined;
			  }
			| null
			| undefined;
		readonly quoteContext?:
			| {
					readonly __typename: 'QuoteContext';
					readonly quoteAllowed: boolean;
					readonly quoteType: import('./index.js').QuoteType;
					readonly withdrawn: boolean;
					readonly originalAuthor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly originalNote?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly communityNotes: ReadonlyArray<{
			readonly __typename: 'CommunityNote';
			readonly id: string;
			readonly content: string;
			readonly helpful: number;
			readonly notHelpful: number;
			readonly createdAt: string;
			readonly author: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
		}>;
		readonly actor: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
		readonly inReplyTo?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
			  }
			| null
			| undefined;
	}>;
	unbookmarkObject(id: string): Promise<boolean>;
	pinObject(id: string): Promise<{
		readonly __typename: 'Object';
		readonly id: string;
		readonly type: import('./index.js').ObjectType;
		readonly content: string;
		readonly visibility: import('./index.js').Visibility;
		readonly sensitive: boolean;
		readonly spoilerText?: string | null | undefined;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly repliesCount: number;
		readonly likesCount: number;
		readonly sharesCount: number;
		readonly boosted: boolean;
		readonly relationshipType: import('./index.js').ObjectRelationshipType;
		readonly contentHash: string;
		readonly estimatedCost: number;
		readonly moderationScore?: number | null | undefined;
		readonly quoteUrl?: string | null | undefined;
		readonly quoteable: boolean;
		readonly quotePermissions: import('./index.js').QuotePermission;
		readonly quoteCount: number;
		readonly boostedObject?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly content: string;
					readonly visibility: import('./index.js').Visibility;
					readonly sensitive: boolean;
					readonly spoilerText?: string | null | undefined;
					readonly createdAt: string;
					readonly updatedAt: string;
					readonly repliesCount: number;
					readonly likesCount: number;
					readonly sharesCount: number;
					readonly boosted: boolean;
					readonly relationshipType: import('./index.js').ObjectRelationshipType;
					readonly contentHash: string;
					readonly estimatedCost: number;
					readonly moderationScore?: number | null | undefined;
					readonly quoteUrl?: string | null | undefined;
					readonly quoteable: boolean;
					readonly quotePermissions: import('./index.js').QuotePermission;
					readonly quoteCount: number;
					readonly contentMap: ReadonlyArray<{
						readonly __typename: 'ContentMap';
						readonly language: string;
						readonly content: string;
					}>;
					readonly attachments: ReadonlyArray<{
						readonly __typename: 'Attachment';
						readonly id: string;
						readonly type: string;
						readonly url: string;
						readonly preview?: string | null | undefined;
						readonly description?: string | null | undefined;
						readonly blurhash?: string | null | undefined;
						readonly width?: number | null | undefined;
						readonly height?: number | null | undefined;
						readonly duration?: number | null | undefined;
					}>;
					readonly tags: ReadonlyArray<{
						readonly __typename: 'Tag';
						readonly name: string;
						readonly url: string;
					}>;
					readonly mentions: ReadonlyArray<{
						readonly __typename: 'Mention';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly url: string;
					}>;
					readonly agentAttribution?:
						| {
								readonly __typename: 'AgentPostAttribution';
								readonly triggerType?: string | null | undefined;
								readonly triggerDetails?: string | null | undefined;
								readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
								readonly delegatedBy?: string | null | undefined;
								readonly approvedBy?: string | null | undefined;
								readonly delegatedByDid?: string | null | undefined;
								readonly scopes?: ReadonlyArray<string> | null | undefined;
								readonly constraints?: ReadonlyArray<string> | null | undefined;
								readonly schemaVersion?: string | null | undefined;
								readonly modelId?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly quoteContext?:
						| {
								readonly __typename: 'QuoteContext';
								readonly quoteAllowed: boolean;
								readonly quoteType: import('./index.js').QuoteType;
								readonly withdrawn: boolean;
								readonly originalAuthor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly originalNote?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly communityNotes: ReadonlyArray<{
						readonly __typename: 'CommunityNote';
						readonly id: string;
						readonly content: string;
						readonly helpful: number;
						readonly notHelpful: number;
						readonly createdAt: string;
						readonly author: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
					}>;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly inReplyTo?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly contentMap: ReadonlyArray<{
			readonly __typename: 'ContentMap';
			readonly language: string;
			readonly content: string;
		}>;
		readonly attachments: ReadonlyArray<{
			readonly __typename: 'Attachment';
			readonly id: string;
			readonly type: string;
			readonly url: string;
			readonly preview?: string | null | undefined;
			readonly description?: string | null | undefined;
			readonly blurhash?: string | null | undefined;
			readonly width?: number | null | undefined;
			readonly height?: number | null | undefined;
			readonly duration?: number | null | undefined;
		}>;
		readonly tags: ReadonlyArray<{
			readonly __typename: 'Tag';
			readonly name: string;
			readonly url: string;
		}>;
		readonly mentions: ReadonlyArray<{
			readonly __typename: 'Mention';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly url: string;
		}>;
		readonly agentAttribution?:
			| {
					readonly __typename: 'AgentPostAttribution';
					readonly triggerType?: string | null | undefined;
					readonly triggerDetails?: string | null | undefined;
					readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
					readonly delegatedBy?: string | null | undefined;
					readonly approvedBy?: string | null | undefined;
					readonly delegatedByDid?: string | null | undefined;
					readonly scopes?: ReadonlyArray<string> | null | undefined;
					readonly constraints?: ReadonlyArray<string> | null | undefined;
					readonly schemaVersion?: string | null | undefined;
					readonly modelId?: string | null | undefined;
			  }
			| null
			| undefined;
		readonly quoteContext?:
			| {
					readonly __typename: 'QuoteContext';
					readonly quoteAllowed: boolean;
					readonly quoteType: import('./index.js').QuoteType;
					readonly withdrawn: boolean;
					readonly originalAuthor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly originalNote?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
						  }
						| null
						| undefined;
			  }
			| null
			| undefined;
		readonly communityNotes: ReadonlyArray<{
			readonly __typename: 'CommunityNote';
			readonly id: string;
			readonly content: string;
			readonly helpful: number;
			readonly notHelpful: number;
			readonly createdAt: string;
			readonly author: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
		}>;
		readonly actor: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
		readonly inReplyTo?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
			  }
			| null
			| undefined;
	}>;
	unpinObject(id: string): Promise<boolean>;
	getRelationship(id: string): Promise<RelationshipQuery['relationship']>;
	getRelationships(ids: string[]): Promise<
		readonly {
			readonly __typename: 'Relationship';
			readonly id: string;
			readonly following: boolean;
			readonly followedBy: boolean;
			readonly blocking: boolean;
			readonly blockedBy: boolean;
			readonly muting: boolean;
			readonly mutingNotifications: boolean;
			readonly requested: boolean;
			readonly domainBlocking: boolean;
			readonly showingReblogs: boolean;
			readonly notifying: boolean;
			readonly languages?: ReadonlyArray<string> | null | undefined;
			readonly note?: string | null | undefined;
		}[]
	>;
	followActor(id: string): Promise<{
		readonly __typename: 'Activity';
		readonly id: string;
		readonly type: import('./index.js').ActivityType;
		readonly published: string;
		readonly cost: number;
		readonly actor: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
		readonly object?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
			  }
			| null
			| undefined;
		readonly target?:
			| {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
			  }
			| null
			| undefined;
	}>;
	unfollowActor(id: string): Promise<boolean>;
	blockActor(id: string): Promise<{
		readonly __typename: 'Relationship';
		readonly id: string;
		readonly following: boolean;
		readonly followedBy: boolean;
		readonly blocking: boolean;
		readonly blockedBy: boolean;
		readonly muting: boolean;
		readonly mutingNotifications: boolean;
		readonly requested: boolean;
		readonly domainBlocking: boolean;
		readonly showingReblogs: boolean;
		readonly notifying: boolean;
		readonly languages?: ReadonlyArray<string> | null | undefined;
		readonly note?: string | null | undefined;
	}>;
	unblockActor(id: string): Promise<boolean>;
	muteActor(
		id: string,
		notifications?: boolean
	): Promise<{
		readonly __typename: 'Relationship';
		readonly id: string;
		readonly following: boolean;
		readonly followedBy: boolean;
		readonly blocking: boolean;
		readonly blockedBy: boolean;
		readonly muting: boolean;
		readonly mutingNotifications: boolean;
		readonly requested: boolean;
		readonly domainBlocking: boolean;
		readonly showingReblogs: boolean;
		readonly notifying: boolean;
		readonly languages?: ReadonlyArray<string> | null | undefined;
		readonly note?: string | null | undefined;
	}>;
	unmuteActor(id: string): Promise<boolean>;
	updateRelationship(
		id: string,
		input: UpdateRelationshipMutationVariables['input']
	): Promise<{
		readonly __typename: 'Relationship';
		readonly id: string;
		readonly following: boolean;
		readonly followedBy: boolean;
		readonly blocking: boolean;
		readonly blockedBy: boolean;
		readonly muting: boolean;
		readonly mutingNotifications: boolean;
		readonly requested: boolean;
		readonly domainBlocking: boolean;
		readonly showingReblogs: boolean;
		readonly notifying: boolean;
		readonly languages?: ReadonlyArray<string> | null | undefined;
		readonly note?: string | null | undefined;
	}>;
	getFollowers(
		username: string,
		limit?: number,
		cursor?: string
	): Promise<{
		readonly __typename: 'ActorListPage';
		readonly nextCursor?: string | null | undefined;
		readonly totalCount: number;
		readonly actors: ReadonlyArray<{
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}>;
	}>;
	getFollowing(
		username: string,
		limit?: number,
		cursor?: string
	): Promise<{
		readonly __typename: 'ActorListPage';
		readonly nextCursor?: string | null | undefined;
		readonly totalCount: number;
		readonly actors: ReadonlyArray<{
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		}>;
	}>;
	updateProfile(input: {
		displayName?: string;
		bio?: string;
		avatar?: string;
		header?: string;
		locked?: boolean;
		bot?: boolean;
		discoverable?: boolean;
		noIndex?: boolean;
		sensitive?: boolean;
		language?: string;
		fields?: Array<{
			name: string;
			value: string;
			verifiedAt?: string;
		}>;
	}): Promise<{
		readonly __typename: 'Actor';
		readonly id: string;
		readonly username: string;
		readonly domain?: string | null | undefined;
		readonly displayName?: string | null | undefined;
		readonly summary?: string | null | undefined;
		readonly avatar?: string | null | undefined;
		readonly header?: string | null | undefined;
		readonly followers: number;
		readonly following: number;
		readonly statusesCount: number;
		readonly bot: boolean;
		readonly locked: boolean;
		readonly updatedAt: string;
		readonly isAgent: boolean;
		readonly tipAddress?: string | null | undefined;
		readonly tipChainId?: number | null | undefined;
		readonly trustScore: number;
		readonly agentInfo?:
			| {
					readonly __typename: 'Agent';
					readonly id: string;
					readonly agentType: import('./index.js').AgentType;
					readonly verified: boolean;
					readonly verifiedAt?: string | null | undefined;
			  }
			| null
			| undefined;
		readonly fields: ReadonlyArray<{
			readonly __typename: 'Field';
			readonly name: string;
			readonly value: string;
			readonly verifiedAt?: string | null | undefined;
		}>;
	}>;
	getUserPreferences(): Promise<{
		readonly __typename: 'UserPreferences';
		readonly actorId: string;
		readonly posting: {
			readonly __typename: 'PostingPreferences';
			readonly defaultVisibility: import('./index.js').Visibility;
			readonly defaultSensitive: boolean;
			readonly defaultLanguage: string;
		};
		readonly reading: {
			readonly __typename: 'ReadingPreferences';
			readonly expandSpoilers: boolean;
			readonly expandMedia: import('./index.js').ExpandMediaPreference;
			readonly autoplayGifs: boolean;
			readonly timelineOrder: import('./index.js').TimelineOrder;
		};
		readonly discovery: {
			readonly __typename: 'DiscoveryPreferences';
			readonly showFollowCounts: boolean;
			readonly searchSuggestionsEnabled: boolean;
			readonly personalizedSearchEnabled: boolean;
		};
		readonly streaming: {
			readonly __typename: 'StreamingPreferences';
			readonly defaultQuality: import('./index.js').StreamQuality;
			readonly autoQuality: boolean;
			readonly preloadNext: boolean;
			readonly dataSaver: boolean;
		};
		readonly notifications: {
			readonly __typename: 'NotificationPreferences';
			readonly email: boolean;
			readonly push: boolean;
			readonly inApp: boolean;
			readonly digest: import('./index.js').DigestFrequency;
		};
		readonly privacy: {
			readonly __typename: 'PrivacyPreferences';
			readonly defaultVisibility: import('./index.js').Visibility;
			readonly indexable: boolean;
			readonly showOnlineStatus: boolean;
			readonly directMessagesFrom: import('./index.js').DirectMessagesFrom;
		};
		readonly reblogFilters: ReadonlyArray<{
			readonly __typename: 'ReblogFilter';
			readonly key: string;
			readonly enabled: boolean;
		}>;
	}>;
	updateUserPreferences(input: {
		language?: string;
		defaultPostingVisibility?: 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT';
		defaultMediaSensitive?: boolean;
		expandSpoilers?: boolean;
		expandMedia?: 'DEFAULT' | 'SHOW_ALL' | 'HIDE_ALL';
		autoplayGifs?: boolean;
		showFollowCounts?: boolean;
		preferredTimelineOrder?: 'NEWEST' | 'OLDEST';
		searchSuggestionsEnabled?: boolean;
		personalizedSearchEnabled?: boolean;
		reblogFilters?: Array<{
			key: string;
			enabled: boolean;
		}>;
		streaming?: {
			defaultQuality?: 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
			autoQuality?: boolean;
			preloadNext?: boolean;
			dataSaver?: boolean;
		};
	}): Promise<{
		readonly __typename: 'UserPreferences';
		readonly actorId: string;
		readonly posting: {
			readonly __typename: 'PostingPreferences';
			readonly defaultVisibility: import('./index.js').Visibility;
			readonly defaultSensitive: boolean;
			readonly defaultLanguage: string;
		};
		readonly reading: {
			readonly __typename: 'ReadingPreferences';
			readonly expandSpoilers: boolean;
			readonly expandMedia: import('./index.js').ExpandMediaPreference;
			readonly autoplayGifs: boolean;
			readonly timelineOrder: import('./index.js').TimelineOrder;
		};
		readonly discovery: {
			readonly __typename: 'DiscoveryPreferences';
			readonly showFollowCounts: boolean;
			readonly searchSuggestionsEnabled: boolean;
			readonly personalizedSearchEnabled: boolean;
		};
		readonly streaming: {
			readonly __typename: 'StreamingPreferences';
			readonly defaultQuality: import('./index.js').StreamQuality;
			readonly autoQuality: boolean;
			readonly preloadNext: boolean;
			readonly dataSaver: boolean;
		};
		readonly notifications: {
			readonly __typename: 'NotificationPreferences';
			readonly email: boolean;
			readonly push: boolean;
			readonly inApp: boolean;
			readonly digest: import('./index.js').DigestFrequency;
		};
		readonly privacy: {
			readonly __typename: 'PrivacyPreferences';
			readonly defaultVisibility: import('./index.js').Visibility;
			readonly indexable: boolean;
			readonly showOnlineStatus: boolean;
			readonly directMessagesFrom: import('./index.js').DirectMessagesFrom;
		};
		readonly reblogFilters: ReadonlyArray<{
			readonly __typename: 'ReblogFilter';
			readonly key: string;
			readonly enabled: boolean;
		}>;
	}>;
	updateStreamingPreferences(input: {
		defaultQuality?: 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
		autoQuality?: boolean;
		preloadNext?: boolean;
		dataSaver?: boolean;
	}): Promise<{
		readonly __typename: 'UserPreferences';
		readonly actorId: string;
		readonly streaming: {
			readonly __typename: 'StreamingPreferences';
			readonly defaultQuality: import('./index.js').StreamQuality;
			readonly autoQuality: boolean;
			readonly preloadNext: boolean;
			readonly dataSaver: boolean;
		};
	}>;
	getPushSubscription(): Promise<
		| {
				readonly __typename: 'PushSubscription';
				readonly id: string;
				readonly endpoint: string;
				readonly policy: string;
				readonly serverKey?: string | null | undefined;
				readonly createdAt?: string | null | undefined;
				readonly updatedAt?: string | null | undefined;
				readonly keys: {
					readonly __typename: 'PushSubscriptionKeys';
					readonly auth: string;
					readonly p256dh: string;
				};
				readonly alerts: {
					readonly __typename: 'PushSubscriptionAlerts';
					readonly follow: boolean;
					readonly favourite: boolean;
					readonly reblog: boolean;
					readonly mention: boolean;
					readonly poll: boolean;
					readonly followRequest: boolean;
					readonly status: boolean;
					readonly update: boolean;
					readonly adminSignUp: boolean;
					readonly adminReport: boolean;
				};
		  }
		| null
		| undefined
	>;
	registerPushSubscription(input: {
		endpoint: string;
		keys: {
			auth: string;
			p256dh: string;
		};
		alerts: {
			follow?: boolean;
			favourite?: boolean;
			reblog?: boolean;
			mention?: boolean;
			poll?: boolean;
			followRequest?: boolean;
			status?: boolean;
			update?: boolean;
			adminSignUp?: boolean;
			adminReport?: boolean;
		};
	}): Promise<{
		readonly __typename: 'PushSubscription';
		readonly id: string;
		readonly endpoint: string;
		readonly policy: string;
		readonly serverKey?: string | null | undefined;
		readonly createdAt?: string | null | undefined;
		readonly updatedAt?: string | null | undefined;
		readonly keys: {
			readonly __typename: 'PushSubscriptionKeys';
			readonly auth: string;
			readonly p256dh: string;
		};
		readonly alerts: {
			readonly __typename: 'PushSubscriptionAlerts';
			readonly follow: boolean;
			readonly favourite: boolean;
			readonly reblog: boolean;
			readonly mention: boolean;
			readonly poll: boolean;
			readonly followRequest: boolean;
			readonly status: boolean;
			readonly update: boolean;
			readonly adminSignUp: boolean;
			readonly adminReport: boolean;
		};
	}>;
	updatePushSubscription(input: {
		alerts: {
			follow?: boolean;
			favourite?: boolean;
			reblog?: boolean;
			mention?: boolean;
			poll?: boolean;
			followRequest?: boolean;
			status?: boolean;
			update?: boolean;
			adminSignUp?: boolean;
			adminReport?: boolean;
		};
	}): Promise<{
		readonly __typename: 'PushSubscription';
		readonly id: string;
		readonly endpoint: string;
		readonly policy: string;
		readonly serverKey?: string | null | undefined;
		readonly createdAt?: string | null | undefined;
		readonly updatedAt?: string | null | undefined;
		readonly keys: {
			readonly __typename: 'PushSubscriptionKeys';
			readonly auth: string;
			readonly p256dh: string;
		};
		readonly alerts: {
			readonly __typename: 'PushSubscriptionAlerts';
			readonly follow: boolean;
			readonly favourite: boolean;
			readonly reblog: boolean;
			readonly mention: boolean;
			readonly poll: boolean;
			readonly followRequest: boolean;
			readonly status: boolean;
			readonly update: boolean;
			readonly adminSignUp: boolean;
			readonly adminReport: boolean;
		};
	}>;
	deletePushSubscription(): Promise<boolean>;
	addCommunityNote(input: { objectId: string; content: string }): Promise<{
		readonly __typename: 'CommunityNotePayload';
		readonly note: {
			readonly __typename: 'CommunityNote';
			readonly id: string;
			readonly content: string;
			readonly helpful: number;
			readonly notHelpful: number;
			readonly createdAt: string;
			readonly author: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
		};
		readonly object: {
			readonly __typename: 'Object';
			readonly id: string;
			readonly type: import('./index.js').ObjectType;
		};
	}>;
	voteCommunityNote(
		id: string,
		helpful: boolean
	): Promise<{
		readonly __typename: 'CommunityNote';
		readonly id: string;
		readonly content: string;
		readonly helpful: number;
		readonly notHelpful: number;
		readonly createdAt: string;
		readonly author: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
	}>;
	getCommunityNotesByObject(
		objectId: string,
		first?: number,
		after?: string
	): Promise<
		| {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
		  }
		| null
		| undefined
	>;
	flagObject(input: { objectId: string; reason: string; evidence?: string[] }): Promise<{
		readonly __typename: 'FlagPayload';
		readonly moderationId: string;
		readonly queued: boolean;
	}>;
	createModerationPattern(input: ModerationPatternInput): Promise<{
		readonly __typename: 'ModerationPattern';
		readonly id: string;
		readonly pattern: string;
		readonly type: import('./index.js').PatternType;
		readonly severity: import('./index.js').ModerationSeverity;
		readonly matchCount: number;
		readonly falsePositiveRate: number;
		readonly createdAt: string;
		readonly updatedAt: string;
		readonly active: boolean;
		readonly createdBy: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly summary?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly header?: string | null | undefined;
			readonly followers: number;
			readonly following: number;
			readonly statusesCount: number;
			readonly bot: boolean;
			readonly locked: boolean;
			readonly updatedAt: string;
			readonly isAgent: boolean;
			readonly tipAddress?: string | null | undefined;
			readonly tipChainId?: number | null | undefined;
			readonly trustScore: number;
			readonly agentInfo?:
				| {
						readonly __typename: 'Agent';
						readonly id: string;
						readonly agentType: import('./index.js').AgentType;
						readonly verified: boolean;
						readonly verifiedAt?: string | null | undefined;
				  }
				| null
				| undefined;
			readonly fields: ReadonlyArray<{
				readonly __typename: 'Field';
				readonly name: string;
				readonly value: string;
				readonly verifiedAt?: string | null | undefined;
			}>;
		};
	}>;
	deleteModerationPattern(id: string): Promise<boolean>;
	requestAIAnalysis(
		objectId: string,
		objectType?: string,
		force?: boolean
	): Promise<{
		readonly __typename: 'AIAnalysisRequest';
		readonly message: string;
		readonly objectId: string;
		readonly estimatedTime: string;
	}>;
	getAIAnalysis(objectId: string): Promise<
		| {
				readonly __typename: 'AIAnalysis';
				readonly id: string;
				readonly objectId: string;
				readonly objectType: string;
				readonly overallRisk: number;
				readonly moderationAction: import('./index.js').ModerationAction;
				readonly confidence: number;
				readonly analyzedAt: string;
				readonly textAnalysis?:
					| {
							readonly __typename: 'TextAnalysis';
							readonly sentiment: import('./index.js').Sentiment;
							readonly toxicityScore: number;
							readonly toxicityLabels: ReadonlyArray<string>;
							readonly containsPII: boolean;
							readonly dominantLanguage: string;
							readonly keyPhrases: ReadonlyArray<string>;
							readonly sentimentScores: {
								readonly __typename: 'SentimentScores';
								readonly positive: number;
								readonly negative: number;
								readonly neutral: number;
								readonly mixed: number;
							};
							readonly entities: ReadonlyArray<{
								readonly __typename: 'Entity';
								readonly text: string;
								readonly type: string;
								readonly score: number;
							}>;
					  }
					| null
					| undefined;
				readonly imageAnalysis?:
					| {
							readonly __typename: 'ImageAnalysis';
							readonly isNSFW: boolean;
							readonly nsfwConfidence: number;
							readonly violenceScore: number;
							readonly weaponsDetected: boolean;
							readonly detectedText: ReadonlyArray<string>;
							readonly textToxicity: number;
							readonly deepfakeScore: number;
							readonly moderationLabels: ReadonlyArray<{
								readonly __typename: 'ModerationLabel';
								readonly name: string;
								readonly confidence: number;
								readonly parentName?: string | null | undefined;
							}>;
							readonly celebrityFaces: ReadonlyArray<{
								readonly __typename: 'Celebrity';
								readonly name: string;
								readonly confidence: number;
							}>;
					  }
					| null
					| undefined;
				readonly aiDetection?:
					| {
							readonly __typename: 'AIDetection';
							readonly aiGeneratedProbability: number;
							readonly generationModel?: string | null | undefined;
							readonly patternConsistency: number;
							readonly styleDeviation: number;
							readonly semanticCoherence: number;
							readonly suspiciousPatterns: ReadonlyArray<string>;
					  }
					| null
					| undefined;
				readonly spamAnalysis?:
					| {
							readonly __typename: 'SpamAnalysis';
							readonly spamScore: number;
							readonly postingVelocity: number;
							readonly repetitionScore: number;
							readonly linkDensity: number;
							readonly followerRatio: number;
							readonly interactionRate: number;
							readonly accountAgeDays: number;
							readonly spamIndicators: ReadonlyArray<{
								readonly __typename: 'SpamIndicator';
								readonly type: string;
								readonly description: string;
								readonly severity: number;
							}>;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined
	>;
	getAIStats(period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'): Promise<{
		readonly __typename: 'AIStats';
		readonly period: string;
		readonly totalAnalyses: number;
		readonly toxicContent: number;
		readonly spamDetected: number;
		readonly aiGenerated: number;
		readonly nsfwContent: number;
		readonly piiDetected: number;
		readonly toxicityRate: number;
		readonly spamRate: number;
		readonly aiContentRate: number;
		readonly nsfwRate: number;
		readonly moderationActions: {
			readonly __typename: 'ModerationActionCounts';
			readonly flag: number;
			readonly hide: number;
			readonly remove: number;
			readonly review: number;
			readonly shadowBan: number;
		};
	}>;
	getAICapabilities(): Promise<{
		readonly __typename: 'AICapabilities';
		readonly moderationActions: ReadonlyArray<string>;
		readonly textAnalysis: {
			readonly __typename: 'TextAnalysisCapabilities';
			readonly sentimentAnalysis: boolean;
			readonly toxicityDetection: boolean;
			readonly spamDetection: boolean;
			readonly piiDetection: boolean;
			readonly entityExtraction: boolean;
			readonly languageDetection: boolean;
		};
		readonly imageAnalysis: {
			readonly __typename: 'ImageAnalysisCapabilities';
			readonly nsfwDetection: boolean;
			readonly violenceDetection: boolean;
			readonly textExtraction: boolean;
			readonly celebrityRecognition: boolean;
			readonly deepfakeDetection: boolean;
		};
		readonly aiDetection: {
			readonly __typename: 'AIDetectionCapabilities';
			readonly aiGeneratedContent: boolean;
			readonly patternAnalysis: boolean;
			readonly styleConsistency: boolean;
		};
		readonly costPerAnalysis: {
			readonly __typename: 'CostBreakdown';
			readonly period: import('./index.js').Period;
			readonly totalCost: number;
			readonly dynamoDBCost: number;
			readonly s3StorageCost: number;
			readonly lambdaCost: number;
			readonly dataTransferCost: number;
			readonly breakdown: ReadonlyArray<{
				readonly __typename: 'CostItem';
				readonly operation: string;
				readonly count: number;
				readonly cost: number;
			}>;
		};
	}>;
	getTrustGraph(
		actorId: string,
		category?: 'CONTENT' | 'BEHAVIOR' | 'TECHNICAL'
	): Promise<
		readonly {
			readonly __typename: 'TrustEdge';
			readonly category: import('./index.js').TrustCategory;
			readonly score: number;
			readonly updatedAt: string;
			readonly from: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
			readonly to: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly summary?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly header?: string | null | undefined;
				readonly followers: number;
				readonly following: number;
				readonly statusesCount: number;
				readonly bot: boolean;
				readonly locked: boolean;
				readonly updatedAt: string;
				readonly isAgent: boolean;
				readonly tipAddress?: string | null | undefined;
				readonly tipChainId?: number | null | undefined;
				readonly trustScore: number;
				readonly agentInfo?:
					| {
							readonly __typename: 'Agent';
							readonly id: string;
							readonly agentType: import('./index.js').AgentType;
							readonly verified: boolean;
							readonly verifiedAt?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly fields: ReadonlyArray<{
					readonly __typename: 'Field';
					readonly name: string;
					readonly value: string;
					readonly verifiedAt?: string | null | undefined;
				}>;
			};
		}[]
	>;
	getCostBreakdown(period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'): Promise<{
		readonly __typename: 'CostBreakdown';
		readonly period: import('./index.js').Period;
		readonly totalCost: number;
		readonly dynamoDBCost: number;
		readonly s3StorageCost: number;
		readonly lambdaCost: number;
		readonly dataTransferCost: number;
		readonly breakdown: ReadonlyArray<{
			readonly __typename: 'CostItem';
			readonly operation: string;
			readonly count: number;
			readonly cost: number;
		}>;
	}>;
	getInstanceBudgets(): Promise<
		readonly {
			readonly __typename: 'InstanceBudget';
			readonly domain: string;
			readonly monthlyBudgetUSD: number;
			readonly currentSpendUSD: number;
			readonly remainingBudgetUSD: number;
			readonly projectedOverspend?: number | null | undefined;
			readonly alertThreshold: number;
			readonly autoLimit: boolean;
			readonly period: string;
		}[]
	>;
	setInstanceBudget(
		domain: string,
		monthlyUSD: number,
		autoLimit?: boolean
	): Promise<{
		readonly __typename: 'InstanceBudget';
		readonly domain: string;
		readonly monthlyBudgetUSD: number;
		readonly currentSpendUSD: number;
		readonly remainingBudgetUSD: number;
		readonly projectedOverspend?: number | null | undefined;
		readonly alertThreshold: number;
		readonly autoLimit: boolean;
		readonly period: string;
	}>;
	optimizeFederationCosts(threshold: number): Promise<{
		readonly __typename: 'CostOptimizationResult';
		readonly optimized: number;
		readonly savedMonthlyUSD: number;
		readonly actions: ReadonlyArray<{
			readonly __typename: 'OptimizationAction';
			readonly domain: string;
			readonly action: string;
			readonly savingsUSD: number;
			readonly impact: string;
		}>;
	}>;
	getFederationLimits(): Promise<
		readonly {
			readonly __typename: 'FederationLimit';
			readonly domain: string;
			readonly ingressLimitMB: number;
			readonly egressLimitMB: number;
			readonly requestsPerMinute: number;
			readonly monthlyBudgetUSD?: number | null | undefined;
			readonly active: boolean;
			readonly createdAt: string;
			readonly updatedAt: string;
		}[]
	>;
	setFederationLimit(
		domain: string,
		limit: Record<string, unknown>
	): Promise<{
		readonly __typename: 'FederationLimit';
		readonly domain: string;
		readonly ingressLimitMB: number;
		readonly egressLimitMB: number;
		readonly requestsPerMinute: number;
		readonly monthlyBudgetUSD?: number | null | undefined;
		readonly active: boolean;
		readonly createdAt: string;
		readonly updatedAt: string;
	}>;
	syncThread(
		noteUrl: string,
		depth?: number
	): Promise<{
		readonly __typename: 'SyncThreadPayload';
		readonly success: boolean;
		readonly syncedPosts: number;
		readonly errors?: ReadonlyArray<string> | null | undefined;
		readonly thread: {
			readonly __typename: 'ThreadContext';
			readonly replyCount: number;
			readonly participantCount: number;
			readonly lastActivity: string;
			readonly missingPosts: number;
			readonly syncStatus: import('./index.js').SyncStatus;
			readonly rootNote: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		};
	}>;
	syncMissingReplies(noteId: string): Promise<{
		readonly __typename: 'SyncRepliesPayload';
		readonly success: boolean;
		readonly syncedReplies: number;
		readonly thread: {
			readonly __typename: 'ThreadContext';
			readonly replyCount: number;
			readonly participantCount: number;
			readonly lastActivity: string;
			readonly missingPosts: number;
			readonly syncStatus: import('./index.js').SyncStatus;
			readonly rootNote: {
				readonly __typename: 'Object';
				readonly id: string;
				readonly type: import('./index.js').ObjectType;
				readonly content: string;
				readonly visibility: import('./index.js').Visibility;
				readonly sensitive: boolean;
				readonly spoilerText?: string | null | undefined;
				readonly createdAt: string;
				readonly updatedAt: string;
				readonly repliesCount: number;
				readonly likesCount: number;
				readonly sharesCount: number;
				readonly boosted: boolean;
				readonly relationshipType: import('./index.js').ObjectRelationshipType;
				readonly contentHash: string;
				readonly estimatedCost: number;
				readonly moderationScore?: number | null | undefined;
				readonly quoteUrl?: string | null | undefined;
				readonly quoteable: boolean;
				readonly quotePermissions: import('./index.js').QuotePermission;
				readonly quoteCount: number;
				readonly boostedObject?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly content: string;
							readonly visibility: import('./index.js').Visibility;
							readonly sensitive: boolean;
							readonly spoilerText?: string | null | undefined;
							readonly createdAt: string;
							readonly updatedAt: string;
							readonly repliesCount: number;
							readonly likesCount: number;
							readonly sharesCount: number;
							readonly boosted: boolean;
							readonly relationshipType: import('./index.js').ObjectRelationshipType;
							readonly contentHash: string;
							readonly estimatedCost: number;
							readonly moderationScore?: number | null | undefined;
							readonly quoteUrl?: string | null | undefined;
							readonly quoteable: boolean;
							readonly quotePermissions: import('./index.js').QuotePermission;
							readonly quoteCount: number;
							readonly contentMap: ReadonlyArray<{
								readonly __typename: 'ContentMap';
								readonly language: string;
								readonly content: string;
							}>;
							readonly attachments: ReadonlyArray<{
								readonly __typename: 'Attachment';
								readonly id: string;
								readonly type: string;
								readonly url: string;
								readonly preview?: string | null | undefined;
								readonly description?: string | null | undefined;
								readonly blurhash?: string | null | undefined;
								readonly width?: number | null | undefined;
								readonly height?: number | null | undefined;
								readonly duration?: number | null | undefined;
							}>;
							readonly tags: ReadonlyArray<{
								readonly __typename: 'Tag';
								readonly name: string;
								readonly url: string;
							}>;
							readonly mentions: ReadonlyArray<{
								readonly __typename: 'Mention';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly url: string;
							}>;
							readonly agentAttribution?:
								| {
										readonly __typename: 'AgentPostAttribution';
										readonly triggerType?: string | null | undefined;
										readonly triggerDetails?: string | null | undefined;
										readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
										readonly delegatedBy?: string | null | undefined;
										readonly approvedBy?: string | null | undefined;
										readonly delegatedByDid?: string | null | undefined;
										readonly scopes?: ReadonlyArray<string> | null | undefined;
										readonly constraints?: ReadonlyArray<string> | null | undefined;
										readonly schemaVersion?: string | null | undefined;
										readonly modelId?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly quoteContext?:
								| {
										readonly __typename: 'QuoteContext';
										readonly quoteAllowed: boolean;
										readonly quoteType: import('./index.js').QuoteType;
										readonly withdrawn: boolean;
										readonly originalAuthor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
										readonly originalNote?:
											| {
													readonly __typename: 'Object';
													readonly id: string;
													readonly type: import('./index.js').ObjectType;
											  }
											| null
											| undefined;
								  }
								| null
								| undefined;
							readonly communityNotes: ReadonlyArray<{
								readonly __typename: 'CommunityNote';
								readonly id: string;
								readonly content: string;
								readonly helpful: number;
								readonly notHelpful: number;
								readonly createdAt: string;
								readonly author: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
							}>;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly inReplyTo?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
										readonly actor: {
											readonly __typename: 'Actor';
											readonly id: string;
											readonly username: string;
											readonly domain?: string | null | undefined;
											readonly displayName?: string | null | undefined;
											readonly summary?: string | null | undefined;
											readonly avatar?: string | null | undefined;
											readonly header?: string | null | undefined;
											readonly followers: number;
											readonly following: number;
											readonly statusesCount: number;
											readonly bot: boolean;
											readonly locked: boolean;
											readonly updatedAt: string;
											readonly isAgent: boolean;
											readonly tipAddress?: string | null | undefined;
											readonly tipChainId?: number | null | undefined;
											readonly trustScore: number;
											readonly agentInfo?:
												| {
														readonly __typename: 'Agent';
														readonly id: string;
														readonly agentType: import('./index.js').AgentType;
														readonly verified: boolean;
														readonly verifiedAt?: string | null | undefined;
												  }
												| null
												| undefined;
											readonly fields: ReadonlyArray<{
												readonly __typename: 'Field';
												readonly name: string;
												readonly value: string;
												readonly verifiedAt?: string | null | undefined;
											}>;
										};
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly contentMap: ReadonlyArray<{
					readonly __typename: 'ContentMap';
					readonly language: string;
					readonly content: string;
				}>;
				readonly attachments: ReadonlyArray<{
					readonly __typename: 'Attachment';
					readonly id: string;
					readonly type: string;
					readonly url: string;
					readonly preview?: string | null | undefined;
					readonly description?: string | null | undefined;
					readonly blurhash?: string | null | undefined;
					readonly width?: number | null | undefined;
					readonly height?: number | null | undefined;
					readonly duration?: number | null | undefined;
				}>;
				readonly tags: ReadonlyArray<{
					readonly __typename: 'Tag';
					readonly name: string;
					readonly url: string;
				}>;
				readonly mentions: ReadonlyArray<{
					readonly __typename: 'Mention';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly url: string;
				}>;
				readonly agentAttribution?:
					| {
							readonly __typename: 'AgentPostAttribution';
							readonly triggerType?: string | null | undefined;
							readonly triggerDetails?: string | null | undefined;
							readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
							readonly delegatedBy?: string | null | undefined;
							readonly approvedBy?: string | null | undefined;
							readonly delegatedByDid?: string | null | undefined;
							readonly scopes?: ReadonlyArray<string> | null | undefined;
							readonly constraints?: ReadonlyArray<string> | null | undefined;
							readonly schemaVersion?: string | null | undefined;
							readonly modelId?: string | null | undefined;
					  }
					| null
					| undefined;
				readonly quoteContext?:
					| {
							readonly __typename: 'QuoteContext';
							readonly quoteAllowed: boolean;
							readonly quoteType: import('./index.js').QuoteType;
							readonly withdrawn: boolean;
							readonly originalAuthor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
							readonly originalNote?:
								| {
										readonly __typename: 'Object';
										readonly id: string;
										readonly type: import('./index.js').ObjectType;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				readonly communityNotes: ReadonlyArray<{
					readonly __typename: 'CommunityNote';
					readonly id: string;
					readonly content: string;
					readonly helpful: number;
					readonly notHelpful: number;
					readonly createdAt: string;
					readonly author: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
				}>;
				readonly actor: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly summary?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly header?: string | null | undefined;
					readonly followers: number;
					readonly following: number;
					readonly statusesCount: number;
					readonly bot: boolean;
					readonly locked: boolean;
					readonly updatedAt: string;
					readonly isAgent: boolean;
					readonly tipAddress?: string | null | undefined;
					readonly tipChainId?: number | null | undefined;
					readonly trustScore: number;
					readonly agentInfo?:
						| {
								readonly __typename: 'Agent';
								readonly id: string;
								readonly agentType: import('./index.js').AgentType;
								readonly verified: boolean;
								readonly verifiedAt?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly fields: ReadonlyArray<{
						readonly __typename: 'Field';
						readonly name: string;
						readonly value: string;
						readonly verifiedAt?: string | null | undefined;
					}>;
				};
				readonly inReplyTo?:
					| {
							readonly __typename: 'Object';
							readonly id: string;
							readonly type: import('./index.js').ObjectType;
							readonly actor: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly summary?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly header?: string | null | undefined;
								readonly followers: number;
								readonly following: number;
								readonly statusesCount: number;
								readonly bot: boolean;
								readonly locked: boolean;
								readonly updatedAt: string;
								readonly isAgent: boolean;
								readonly tipAddress?: string | null | undefined;
								readonly tipChainId?: number | null | undefined;
								readonly trustScore: number;
								readonly agentInfo?:
									| {
											readonly __typename: 'Agent';
											readonly id: string;
											readonly agentType: import('./index.js').AgentType;
											readonly verified: boolean;
											readonly verifiedAt?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly fields: ReadonlyArray<{
									readonly __typename: 'Field';
									readonly name: string;
									readonly value: string;
									readonly verifiedAt?: string | null | undefined;
								}>;
							};
					  }
					| null
					| undefined;
			};
		};
	}>;
	getThreadContext(noteId: string): Promise<
		| {
				readonly __typename: 'ThreadContext';
				readonly replyCount: number;
				readonly participantCount: number;
				readonly lastActivity: string;
				readonly missingPosts: number;
				readonly syncStatus: import('./index.js').SyncStatus;
				readonly rootNote: {
					readonly __typename: 'Object';
					readonly id: string;
					readonly type: import('./index.js').ObjectType;
					readonly content: string;
					readonly visibility: import('./index.js').Visibility;
					readonly sensitive: boolean;
					readonly spoilerText?: string | null | undefined;
					readonly createdAt: string;
					readonly updatedAt: string;
					readonly repliesCount: number;
					readonly likesCount: number;
					readonly sharesCount: number;
					readonly boosted: boolean;
					readonly relationshipType: import('./index.js').ObjectRelationshipType;
					readonly contentHash: string;
					readonly estimatedCost: number;
					readonly moderationScore?: number | null | undefined;
					readonly quoteUrl?: string | null | undefined;
					readonly quoteable: boolean;
					readonly quotePermissions: import('./index.js').QuotePermission;
					readonly quoteCount: number;
					readonly boostedObject?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly content: string;
								readonly visibility: import('./index.js').Visibility;
								readonly sensitive: boolean;
								readonly spoilerText?: string | null | undefined;
								readonly createdAt: string;
								readonly updatedAt: string;
								readonly repliesCount: number;
								readonly likesCount: number;
								readonly sharesCount: number;
								readonly boosted: boolean;
								readonly relationshipType: import('./index.js').ObjectRelationshipType;
								readonly contentHash: string;
								readonly estimatedCost: number;
								readonly moderationScore?: number | null | undefined;
								readonly quoteUrl?: string | null | undefined;
								readonly quoteable: boolean;
								readonly quotePermissions: import('./index.js').QuotePermission;
								readonly quoteCount: number;
								readonly contentMap: ReadonlyArray<{
									readonly __typename: 'ContentMap';
									readonly language: string;
									readonly content: string;
								}>;
								readonly attachments: ReadonlyArray<{
									readonly __typename: 'Attachment';
									readonly id: string;
									readonly type: string;
									readonly url: string;
									readonly preview?: string | null | undefined;
									readonly description?: string | null | undefined;
									readonly blurhash?: string | null | undefined;
									readonly width?: number | null | undefined;
									readonly height?: number | null | undefined;
									readonly duration?: number | null | undefined;
								}>;
								readonly tags: ReadonlyArray<{
									readonly __typename: 'Tag';
									readonly name: string;
									readonly url: string;
								}>;
								readonly mentions: ReadonlyArray<{
									readonly __typename: 'Mention';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly url: string;
								}>;
								readonly agentAttribution?:
									| {
											readonly __typename: 'AgentPostAttribution';
											readonly triggerType?: string | null | undefined;
											readonly triggerDetails?: string | null | undefined;
											readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
											readonly delegatedBy?: string | null | undefined;
											readonly approvedBy?: string | null | undefined;
											readonly delegatedByDid?: string | null | undefined;
											readonly scopes?: ReadonlyArray<string> | null | undefined;
											readonly constraints?: ReadonlyArray<string> | null | undefined;
											readonly schemaVersion?: string | null | undefined;
											readonly modelId?: string | null | undefined;
									  }
									| null
									| undefined;
								readonly quoteContext?:
									| {
											readonly __typename: 'QuoteContext';
											readonly quoteAllowed: boolean;
											readonly quoteType: import('./index.js').QuoteType;
											readonly withdrawn: boolean;
											readonly originalAuthor: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
											readonly originalNote?:
												| {
														readonly __typename: 'Object';
														readonly id: string;
														readonly type: import('./index.js').ObjectType;
												  }
												| null
												| undefined;
									  }
									| null
									| undefined;
								readonly communityNotes: ReadonlyArray<{
									readonly __typename: 'CommunityNote';
									readonly id: string;
									readonly content: string;
									readonly helpful: number;
									readonly notHelpful: number;
									readonly createdAt: string;
									readonly author: {
										readonly __typename: 'Actor';
										readonly id: string;
										readonly username: string;
										readonly domain?: string | null | undefined;
										readonly displayName?: string | null | undefined;
										readonly summary?: string | null | undefined;
										readonly avatar?: string | null | undefined;
										readonly header?: string | null | undefined;
										readonly followers: number;
										readonly following: number;
										readonly statusesCount: number;
										readonly bot: boolean;
										readonly locked: boolean;
										readonly updatedAt: string;
										readonly isAgent: boolean;
										readonly tipAddress?: string | null | undefined;
										readonly tipChainId?: number | null | undefined;
										readonly trustScore: number;
										readonly agentInfo?:
											| {
													readonly __typename: 'Agent';
													readonly id: string;
													readonly agentType: import('./index.js').AgentType;
													readonly verified: boolean;
													readonly verifiedAt?: string | null | undefined;
											  }
											| null
											| undefined;
										readonly fields: ReadonlyArray<{
											readonly __typename: 'Field';
											readonly name: string;
											readonly value: string;
											readonly verifiedAt?: string | null | undefined;
										}>;
									};
								}>;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly inReplyTo?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
											readonly actor: {
												readonly __typename: 'Actor';
												readonly id: string;
												readonly username: string;
												readonly domain?: string | null | undefined;
												readonly displayName?: string | null | undefined;
												readonly summary?: string | null | undefined;
												readonly avatar?: string | null | undefined;
												readonly header?: string | null | undefined;
												readonly followers: number;
												readonly following: number;
												readonly statusesCount: number;
												readonly bot: boolean;
												readonly locked: boolean;
												readonly updatedAt: string;
												readonly isAgent: boolean;
												readonly tipAddress?: string | null | undefined;
												readonly tipChainId?: number | null | undefined;
												readonly trustScore: number;
												readonly agentInfo?:
													| {
															readonly __typename: 'Agent';
															readonly id: string;
															readonly agentType: import('./index.js').AgentType;
															readonly verified: boolean;
															readonly verifiedAt?: string | null | undefined;
													  }
													| null
													| undefined;
												readonly fields: ReadonlyArray<{
													readonly __typename: 'Field';
													readonly name: string;
													readonly value: string;
													readonly verifiedAt?: string | null | undefined;
												}>;
											};
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly contentMap: ReadonlyArray<{
						readonly __typename: 'ContentMap';
						readonly language: string;
						readonly content: string;
					}>;
					readonly attachments: ReadonlyArray<{
						readonly __typename: 'Attachment';
						readonly id: string;
						readonly type: string;
						readonly url: string;
						readonly preview?: string | null | undefined;
						readonly description?: string | null | undefined;
						readonly blurhash?: string | null | undefined;
						readonly width?: number | null | undefined;
						readonly height?: number | null | undefined;
						readonly duration?: number | null | undefined;
					}>;
					readonly tags: ReadonlyArray<{
						readonly __typename: 'Tag';
						readonly name: string;
						readonly url: string;
					}>;
					readonly mentions: ReadonlyArray<{
						readonly __typename: 'Mention';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly url: string;
					}>;
					readonly agentAttribution?:
						| {
								readonly __typename: 'AgentPostAttribution';
								readonly triggerType?: string | null | undefined;
								readonly triggerDetails?: string | null | undefined;
								readonly memoryCitations?: ReadonlyArray<string> | null | undefined;
								readonly delegatedBy?: string | null | undefined;
								readonly approvedBy?: string | null | undefined;
								readonly delegatedByDid?: string | null | undefined;
								readonly scopes?: ReadonlyArray<string> | null | undefined;
								readonly constraints?: ReadonlyArray<string> | null | undefined;
								readonly schemaVersion?: string | null | undefined;
								readonly modelId?: string | null | undefined;
						  }
						| null
						| undefined;
					readonly quoteContext?:
						| {
								readonly __typename: 'QuoteContext';
								readonly quoteAllowed: boolean;
								readonly quoteType: import('./index.js').QuoteType;
								readonly withdrawn: boolean;
								readonly originalAuthor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
								readonly originalNote?:
									| {
											readonly __typename: 'Object';
											readonly id: string;
											readonly type: import('./index.js').ObjectType;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					readonly communityNotes: ReadonlyArray<{
						readonly __typename: 'CommunityNote';
						readonly id: string;
						readonly content: string;
						readonly helpful: number;
						readonly notHelpful: number;
						readonly createdAt: string;
						readonly author: {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly summary?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly header?: string | null | undefined;
							readonly followers: number;
							readonly following: number;
							readonly statusesCount: number;
							readonly bot: boolean;
							readonly locked: boolean;
							readonly updatedAt: string;
							readonly isAgent: boolean;
							readonly tipAddress?: string | null | undefined;
							readonly tipChainId?: number | null | undefined;
							readonly trustScore: number;
							readonly agentInfo?:
								| {
										readonly __typename: 'Agent';
										readonly id: string;
										readonly agentType: import('./index.js').AgentType;
										readonly verified: boolean;
										readonly verifiedAt?: string | null | undefined;
								  }
								| null
								| undefined;
							readonly fields: ReadonlyArray<{
								readonly __typename: 'Field';
								readonly name: string;
								readonly value: string;
								readonly verifiedAt?: string | null | undefined;
							}>;
						};
					}>;
					readonly actor: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly summary?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly header?: string | null | undefined;
						readonly followers: number;
						readonly following: number;
						readonly statusesCount: number;
						readonly bot: boolean;
						readonly locked: boolean;
						readonly updatedAt: string;
						readonly isAgent: boolean;
						readonly tipAddress?: string | null | undefined;
						readonly tipChainId?: number | null | undefined;
						readonly trustScore: number;
						readonly agentInfo?:
							| {
									readonly __typename: 'Agent';
									readonly id: string;
									readonly agentType: import('./index.js').AgentType;
									readonly verified: boolean;
									readonly verifiedAt?: string | null | undefined;
							  }
							| null
							| undefined;
						readonly fields: ReadonlyArray<{
							readonly __typename: 'Field';
							readonly name: string;
							readonly value: string;
							readonly verifiedAt?: string | null | undefined;
						}>;
					};
					readonly inReplyTo?:
						| {
								readonly __typename: 'Object';
								readonly id: string;
								readonly type: import('./index.js').ObjectType;
								readonly actor: {
									readonly __typename: 'Actor';
									readonly id: string;
									readonly username: string;
									readonly domain?: string | null | undefined;
									readonly displayName?: string | null | undefined;
									readonly summary?: string | null | undefined;
									readonly avatar?: string | null | undefined;
									readonly header?: string | null | undefined;
									readonly followers: number;
									readonly following: number;
									readonly statusesCount: number;
									readonly bot: boolean;
									readonly locked: boolean;
									readonly updatedAt: string;
									readonly isAgent: boolean;
									readonly tipAddress?: string | null | undefined;
									readonly tipChainId?: number | null | undefined;
									readonly trustScore: number;
									readonly agentInfo?:
										| {
												readonly __typename: 'Agent';
												readonly id: string;
												readonly agentType: import('./index.js').AgentType;
												readonly verified: boolean;
												readonly verifiedAt?: string | null | undefined;
										  }
										| null
										| undefined;
									readonly fields: ReadonlyArray<{
										readonly __typename: 'Field';
										readonly name: string;
										readonly value: string;
										readonly verifiedAt?: string | null | undefined;
									}>;
								};
						  }
						| null
						| undefined;
				};
		  }
		| null
		| undefined
	>;
	getSeveredRelationships(
		instance?: string,
		first?: number,
		after?: string
	): Promise<{
		readonly __typename: 'SeveredRelationshipConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'SeveredRelationshipEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'SeveredRelationship';
				readonly id: string;
				readonly localInstance: string;
				readonly remoteInstance: string;
				readonly reason: import('./index.js').SeveranceReason;
				readonly affectedFollowers: number;
				readonly affectedFollowing: number;
				readonly timestamp: string;
				readonly reversible: boolean;
				readonly details?:
					| {
							readonly __typename: 'SeveranceDetails';
							readonly description: string;
							readonly metadata: ReadonlyArray<string>;
							readonly adminNotes?: string | null | undefined;
							readonly autoDetected: boolean;
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	acknowledgeSeverance(id: string): Promise<{
		readonly __typename: 'AcknowledgePayload';
		readonly success: boolean;
		readonly acknowledged: boolean;
		readonly severedRelationship: {
			readonly __typename: 'SeveredRelationship';
			readonly id: string;
			readonly localInstance: string;
			readonly remoteInstance: string;
		};
	}>;
	attemptReconnection(id: string): Promise<{
		readonly __typename: 'ReconnectionPayload';
		readonly success: boolean;
		readonly reconnected: number;
		readonly failed: number;
		readonly errors?: ReadonlyArray<string> | null | undefined;
		readonly severedRelationship: {
			readonly __typename: 'SeveredRelationship';
			readonly id: string;
			readonly localInstance: string;
			readonly remoteInstance: string;
		};
	}>;
	getFederationHealth(threshold?: number): Promise<
		readonly {
			readonly __typename: 'FederationManagementStatus';
			readonly domain: string;
			readonly status: import('./index.js').FederationState;
			readonly reason?: string | null | undefined;
			readonly pausedUntil?: string | null | undefined;
		}[]
	>;
	getFederationStatus(domain: string): Promise<{
		readonly __typename: 'FederationStatus';
		readonly domain: string;
		readonly reachable: boolean;
		readonly lastContact?: string | null | undefined;
		readonly sharedInbox?: string | null | undefined;
		readonly publicKey?: string | null | undefined;
		readonly software?: string | null | undefined;
		readonly version?: string | null | undefined;
	}>;
	pauseFederation(
		domain: string,
		reason: string,
		until?: string
	): Promise<{
		readonly __typename: 'FederationManagementStatus';
		readonly domain: string;
		readonly status: import('./index.js').FederationState;
		readonly reason?: string | null | undefined;
		readonly pausedUntil?: string | null | undefined;
		readonly limits?:
			| {
					readonly __typename: 'FederationLimit';
					readonly domain: string;
					readonly ingressLimitMB: number;
					readonly egressLimitMB: number;
					readonly requestsPerMinute: number;
					readonly monthlyBudgetUSD?: number | null | undefined;
					readonly active: boolean;
					readonly createdAt: string;
					readonly updatedAt: string;
			  }
			| null
			| undefined;
	}>;
	resumeFederation(domain: string): Promise<{
		readonly __typename: 'FederationManagementStatus';
		readonly domain: string;
		readonly status: import('./index.js').FederationState;
		readonly reason?: string | null | undefined;
		readonly pausedUntil?: string | null | undefined;
		readonly limits?:
			| {
					readonly __typename: 'FederationLimit';
					readonly domain: string;
					readonly ingressLimitMB: number;
					readonly egressLimitMB: number;
					readonly requestsPerMinute: number;
					readonly monthlyBudgetUSD?: number | null | undefined;
					readonly active: boolean;
					readonly createdAt: string;
					readonly updatedAt: string;
			  }
			| null
			| undefined;
	}>;
	followHashtag(
		hashtag: string,
		notifyLevel?: 'ALL' | 'MUTUALS' | 'FOLLOWING' | 'NONE'
	): Promise<{
		readonly __typename: 'HashtagFollowPayload';
		readonly success: boolean;
		readonly hashtag: {
			readonly __typename: 'Hashtag';
			readonly name: string;
			readonly url: string;
			readonly isFollowing: boolean;
			readonly followedAt?: string | null | undefined;
			readonly notificationSettings?:
				| {
						readonly __typename: 'HashtagNotificationSettings';
						readonly level: NotificationLevel;
						readonly muted: boolean;
						readonly mutedUntil?: string | null | undefined;
				  }
				| null
				| undefined;
		};
	}>;
	unfollowHashtag(hashtag: string): Promise<{
		readonly __typename: 'UnfollowHashtagPayload';
		readonly success: boolean;
		readonly hashtag: {
			readonly __typename: 'Hashtag';
			readonly name: string;
			readonly url: string;
		};
	}>;
	muteHashtag(
		hashtag: string,
		until?: string
	): Promise<{
		readonly __typename: 'MuteHashtagPayload';
		readonly success: boolean;
		readonly mutedUntil?: string | null | undefined;
		readonly hashtag: {
			readonly __typename: 'Hashtag';
			readonly name: string;
			readonly notificationSettings?:
				| {
						readonly __typename: 'HashtagNotificationSettings';
						readonly muted: boolean;
						readonly mutedUntil?: string | null | undefined;
				  }
				| null
				| undefined;
		};
	}>;
	getFollowedHashtags(
		first?: number,
		after?: string
	): Promise<{
		readonly __typename: 'HashtagConnection';
		readonly totalCount: number;
		readonly edges: ReadonlyArray<{
			readonly __typename: 'HashtagEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'Hashtag';
				readonly name: string;
				readonly url: string;
				readonly isFollowing: boolean;
				readonly followedAt?: string | null | undefined;
				readonly notificationSettings?:
					| {
							readonly __typename: 'HashtagNotificationSettings';
							readonly level: NotificationLevel;
							readonly muted: boolean;
							readonly mutedUntil?: string | null | undefined;
					  }
					| null
					| undefined;
			};
		}>;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly hasPreviousPage: boolean;
			readonly startCursor?: string | null | undefined;
			readonly endCursor?: string | null | undefined;
		};
	}>;
	updateHashtagNotifications(
		hashtag: string,
		settings: HashtagNotificationSettingsInput
	): Promise<{
		success: boolean;
		hashtag?: {
			name: string;
			notificationSettings?: {
				level: NotificationLevel;
				muted?: boolean | null;
				mutedUntil?: string | null;
			} | null;
		} | null;
	}>;
	unmuteHashtag(
		hashtag: string,
		options?: {
			level?: NotificationLevel;
			mutedUntil?: string | null;
			filters?: HashtagNotificationSettingsInput['filters'];
		}
	): Promise<{
		success: boolean;
		hashtag?: {
			name: string;
			notificationSettings?: {
				level: NotificationLevel;
				muted?: boolean | null;
				mutedUntil?: string | null;
			} | null;
		} | null;
	}>;
	subscribeToTimelineUpdates(
		variables: TimelineUpdatesSubscriptionVariables
	): Observable<FetchResult<TimelineUpdatesSubscription>>;
	subscribeToNotificationStream(
		variables?: NotificationStreamSubscriptionVariables
	): Observable<FetchResult<NotificationStreamSubscription>>;
	subscribeToConversationUpdates(): Observable<FetchResult<ConversationUpdatesSubscription>>;
	subscribeToListUpdates(
		variables: ListUpdatesSubscriptionVariables
	): Observable<FetchResult<ListUpdatesSubscription>>;
	subscribeToQuoteActivity(
		variables: QuoteActivitySubscriptionVariables
	): Observable<FetchResult<QuoteActivitySubscription>>;
	subscribeToHashtagActivity(
		variables: HashtagActivitySubscriptionVariables
	): Observable<FetchResult<HashtagActivitySubscription>>;
	subscribeToActivityStream(
		variables?: ActivityStreamSubscriptionVariables
	): Observable<FetchResult<ActivityStreamSubscription>>;
	subscribeToRelationshipUpdates(
		variables?: RelationshipUpdatesSubscriptionVariables
	): Observable<FetchResult<RelationshipUpdatesSubscription>>;
	subscribeToCostUpdates(
		variables?: CostUpdatesSubscriptionVariables
	): Observable<FetchResult<CostUpdatesSubscription>>;
	subscribeToModerationEvents(
		variables?: ModerationEventsSubscriptionVariables
	): Observable<FetchResult<ModerationEventsSubscription>>;
	subscribeToTrustUpdates(
		variables: TrustUpdatesSubscriptionVariables
	): Observable<FetchResult<TrustUpdatesSubscription>>;
	subscribeToAiAnalysisUpdates(
		variables?: AiAnalysisUpdatesSubscriptionVariables
	): Observable<FetchResult<AiAnalysisUpdatesSubscription>>;
	subscribeToMetricsUpdates(
		variables?: MetricsUpdatesSubscriptionVariables
	): Observable<FetchResult<MetricsUpdatesSubscription>>;
	subscribeToModerationAlerts(
		variables?: ModerationAlertsSubscriptionVariables
	): Observable<FetchResult<ModerationAlertsSubscription>>;
	subscribeToCostAlerts(
		variables: CostAlertsSubscriptionVariables
	): Observable<FetchResult<CostAlertsSubscription>>;
	subscribeToBudgetAlerts(
		variables?: BudgetAlertsSubscriptionVariables
	): Observable<FetchResult<BudgetAlertsSubscription>>;
	subscribeToFederationHealthUpdates(
		variables?: FederationHealthUpdatesSubscriptionVariables
	): Observable<FetchResult<FederationHealthUpdatesSubscription>>;
	subscribeToModerationQueueUpdate(
		variables?: ModerationQueueUpdateSubscriptionVariables
	): Observable<FetchResult<ModerationQueueUpdateSubscription>>;
	subscribeToThreatIntelligence(): Observable<FetchResult<ThreatIntelligenceSubscription>>;
	subscribeToPerformanceAlert(
		variables: PerformanceAlertSubscriptionVariables
	): Observable<FetchResult<PerformanceAlertSubscription>>;
	subscribeToInfrastructureEvent(): Observable<FetchResult<InfrastructureEventSubscription>>;
	subscribeToAgentActivityUpdates(
		variables: AgentActivityUpdatesSubscriptionVariables
	): Observable<FetchResult<AgentActivityUpdatesSubscription>>;
	/**
	 * Lists drafts shared with the viewer for review.
	 */
	getSharedDraftReviews(variables?: SharedDraftReviewsQueryVariables): Promise<{
		readonly __typename: 'DraftReviewConnection';
		readonly totalCount: number;
		readonly pageInfo: {
			readonly __typename: 'PageInfo';
			readonly hasNextPage: boolean;
			readonly endCursor?: string | null | undefined;
		};
		readonly edges: ReadonlyArray<{
			readonly __typename: 'DraftReviewEdge';
			readonly cursor: string;
			readonly node: {
				readonly __typename: 'DraftReview';
				readonly draftId: string;
				readonly title?: string | null | undefined;
				readonly subtitle?: string | null | undefined;
				readonly excerpt?: string | null | undefined;
				readonly contentFormat: import('./index.js').ContentFormat;
				readonly status: import('./index.js').DraftStatus;
				readonly scheduledAt?: string | null | undefined;
				readonly updatedAt: string;
				readonly createdAt: string;
				readonly reviewStatus?: string | null | undefined;
				readonly editorNotes?: string | null | undefined;
				readonly generatedBy?:
					| {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly isAgent: boolean;
					  }
					| null
					| undefined;
				readonly reviewedBy?:
					| {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly isAgent: boolean;
					  }
					| null
					| undefined;
				readonly grant?:
					| {
							readonly __typename: 'DraftReviewGrant';
							readonly grantedAt: string;
							readonly reviewer: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly isAgent: boolean;
							};
					  }
					| null
					| undefined;
				readonly verdicts: ReadonlyArray<{
					readonly __typename: 'DraftReviewVerdictRecord';
					readonly verdict: DraftReviewVerdict;
					readonly notes?: string | null | undefined;
					readonly contentHash?: string | null | undefined;
					readonly recordedAt: string;
					readonly reviewer: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly isAgent: boolean;
					};
				}>;
			};
		}>;
	}>;
	/**
	 * Fetches a single shared draft under review.
	 */
	getDraftReview(id: string): Promise<
		| {
				readonly __typename: 'DraftReview';
				readonly draftId: string;
				readonly title?: string | null | undefined;
				readonly subtitle?: string | null | undefined;
				readonly excerpt?: string | null | undefined;
				readonly contentFormat: import('./index.js').ContentFormat;
				readonly status: import('./index.js').DraftStatus;
				readonly scheduledAt?: string | null | undefined;
				readonly updatedAt: string;
				readonly createdAt: string;
				readonly reviewStatus?: string | null | undefined;
				readonly editorNotes?: string | null | undefined;
				readonly generatedBy?:
					| {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly isAgent: boolean;
					  }
					| null
					| undefined;
				readonly reviewedBy?:
					| {
							readonly __typename: 'Actor';
							readonly id: string;
							readonly username: string;
							readonly domain?: string | null | undefined;
							readonly displayName?: string | null | undefined;
							readonly avatar?: string | null | undefined;
							readonly isAgent: boolean;
					  }
					| null
					| undefined;
				readonly grant?:
					| {
							readonly __typename: 'DraftReviewGrant';
							readonly grantedAt: string;
							readonly reviewer: {
								readonly __typename: 'Actor';
								readonly id: string;
								readonly username: string;
								readonly domain?: string | null | undefined;
								readonly displayName?: string | null | undefined;
								readonly avatar?: string | null | undefined;
								readonly isAgent: boolean;
							};
					  }
					| null
					| undefined;
				readonly verdicts: ReadonlyArray<{
					readonly __typename: 'DraftReviewVerdictRecord';
					readonly verdict: DraftReviewVerdict;
					readonly notes?: string | null | undefined;
					readonly contentHash?: string | null | undefined;
					readonly recordedAt: string;
					readonly reviewer: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly isAgent: boolean;
					};
				}>;
		  }
		| null
		| undefined
	>;
	/**
	 * Invites a reviewer to a draft.
	 *
	 * Throws on any failure, including a duplicate share. Callers that want to
	 * treat "already invited" as an expected condition should use
	 * {@link shareDraftForReviewIfAbsent}.
	 */
	shareDraftForReview(
		draftId: string,
		reviewer: string
	): Promise<{
		readonly __typename: 'DraftReview';
		readonly draftId: string;
		readonly title?: string | null | undefined;
		readonly subtitle?: string | null | undefined;
		readonly excerpt?: string | null | undefined;
		readonly contentFormat: import('./index.js').ContentFormat;
		readonly status: import('./index.js').DraftStatus;
		readonly scheduledAt?: string | null | undefined;
		readonly updatedAt: string;
		readonly createdAt: string;
		readonly reviewStatus?: string | null | undefined;
		readonly editorNotes?: string | null | undefined;
		readonly generatedBy?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly isAgent: boolean;
			  }
			| null
			| undefined;
		readonly reviewedBy?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly isAgent: boolean;
			  }
			| null
			| undefined;
		readonly grant?:
			| {
					readonly __typename: 'DraftReviewGrant';
					readonly grantedAt: string;
					readonly reviewer: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly isAgent: boolean;
					};
			  }
			| null
			| undefined;
		readonly verdicts: ReadonlyArray<{
			readonly __typename: 'DraftReviewVerdictRecord';
			readonly verdict: DraftReviewVerdict;
			readonly notes?: string | null | undefined;
			readonly contentHash?: string | null | undefined;
			readonly recordedAt: string;
			readonly reviewer: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly isAgent: boolean;
			};
		}>;
	}>;
	/**
	 * Invites a reviewer, reporting an existing grant as an expected condition
	 * rather than a fault.
	 *
	 * Lesser v1.6.0 creates the grant conditionally
	 * (`attribute_not_exists`, pkg/storage/repositories/draft_repository.go
	 * `CreateDraftReviewGrant`) and version-conditions the regrant path. A
	 * duplicate share therefore fails loudly, and that is deliberate: the
	 * condition is what preserves a concurrent revocation. Two operators acting
	 * at once must not silently resurrect access one of them just revoked.
	 *
	 * So this method does exactly one thing on conflict — it reports it:
	 *
	 * - it never re-issues the grant, and never retries;
	 * - it never fabricates a `DraftReview`, because the share did not happen
	 *   and the caller must not be told otherwise;
	 * - it rethrows anything it cannot confidently identify as a duplicate.
	 *
	 * `already-invited` means "the server refused because a grant exists" — a
	 * notice to show, not a success to act on. Re-enabling a revoked reviewer
	 * is a deliberate re-share, which Lesser's regrant path already accepts.
	 *
	 * Recognition depends on Lesser sending a typed conflict code. The upstream
	 * gap is closed at the pinned v1.6.0: the conditional-create path now sends
	 * `CONFLICT`, which {@link isDraftReviewShareConflict} already accepts.
	 */
	shareDraftForReviewIfAbsent(
		draftId: string,
		reviewer: string
	): Promise<ShareDraftForReviewOutcome>;
	/**
	 * Revokes a reviewer's invitation to a draft.
	 */
	revokeDraftReview(draftId: string, reviewer: string): Promise<boolean>;
	/**
	 * Records a reviewer verdict against a draft.
	 *
	 * Lesser owns review policy: it decides whether the caller may record this
	 * verdict and what the resulting `reviewStatus` becomes. This method
	 * forwards the submission and returns the server's updated `DraftReview`.
	 */
	submitDraftReview(variables: SubmitDraftReviewMutationVariables): Promise<{
		readonly __typename: 'DraftReview';
		readonly draftId: string;
		readonly title?: string | null | undefined;
		readonly subtitle?: string | null | undefined;
		readonly excerpt?: string | null | undefined;
		readonly contentFormat: import('./index.js').ContentFormat;
		readonly status: import('./index.js').DraftStatus;
		readonly scheduledAt?: string | null | undefined;
		readonly updatedAt: string;
		readonly createdAt: string;
		readonly reviewStatus?: string | null | undefined;
		readonly editorNotes?: string | null | undefined;
		readonly generatedBy?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly isAgent: boolean;
			  }
			| null
			| undefined;
		readonly reviewedBy?:
			| {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly isAgent: boolean;
			  }
			| null
			| undefined;
		readonly grant?:
			| {
					readonly __typename: 'DraftReviewGrant';
					readonly grantedAt: string;
					readonly reviewer: {
						readonly __typename: 'Actor';
						readonly id: string;
						readonly username: string;
						readonly domain?: string | null | undefined;
						readonly displayName?: string | null | undefined;
						readonly avatar?: string | null | undefined;
						readonly isAgent: boolean;
					};
			  }
			| null
			| undefined;
		readonly verdicts: ReadonlyArray<{
			readonly __typename: 'DraftReviewVerdictRecord';
			readonly verdict: DraftReviewVerdict;
			readonly notes?: string | null | undefined;
			readonly contentHash?: string | null | undefined;
			readonly recordedAt: string;
			readonly reviewer: {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly isAgent: boolean;
			};
		}>;
	}>;
}
export declare function createLesserGraphQLAdapter(
	config: LesserGraphQLAdapterConfig
): LesserGraphQLAdapter;
/**
 * Submission payload accepted by {@link createSubmitDraftReviewHandler}.
 *
 * Structurally identical to the `VerdictSubmission` emitted by the blog face's
 * `Review.VerdictActions` component, so the component's `onSubmit` can be wired
 * straight through without an adapter shim in consumer code.
 */
export interface DraftReviewSubmission {
	draftId: string;
	verdict: DraftReviewVerdict;
	notes?: string;
}
/**
 * Builds an `onSubmit` handler for the blog face's `Review.VerdictActions`.
 *
 * Usage:
 *
 * ```svelte
 * <Review.VerdictActions
 *   draftId={review.draftId}
 *   onSubmit={createSubmitDraftReviewHandler(adapter)}
 * />
 * ```
 *
 * Errors propagate to the caller so the component can surface them in its
 * confirmation dialog and let the reviewer retry.
 */
export declare function createSubmitDraftReviewHandler(adapter: LesserGraphQLAdapter): (
	submission: DraftReviewSubmission
) => Promise<{
	readonly __typename: 'DraftReview';
	readonly draftId: string;
	readonly title?: string | null | undefined;
	readonly subtitle?: string | null | undefined;
	readonly excerpt?: string | null | undefined;
	readonly contentFormat: import('./index.js').ContentFormat;
	readonly status: import('./index.js').DraftStatus;
	readonly scheduledAt?: string | null | undefined;
	readonly updatedAt: string;
	readonly createdAt: string;
	readonly reviewStatus?: string | null | undefined;
	readonly editorNotes?: string | null | undefined;
	readonly generatedBy?:
		| {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly isAgent: boolean;
		  }
		| null
		| undefined;
	readonly reviewedBy?:
		| {
				readonly __typename: 'Actor';
				readonly id: string;
				readonly username: string;
				readonly domain?: string | null | undefined;
				readonly displayName?: string | null | undefined;
				readonly avatar?: string | null | undefined;
				readonly isAgent: boolean;
		  }
		| null
		| undefined;
	readonly grant?:
		| {
				readonly __typename: 'DraftReviewGrant';
				readonly grantedAt: string;
				readonly reviewer: {
					readonly __typename: 'Actor';
					readonly id: string;
					readonly username: string;
					readonly domain?: string | null | undefined;
					readonly displayName?: string | null | undefined;
					readonly avatar?: string | null | undefined;
					readonly isAgent: boolean;
				};
		  }
		| null
		| undefined;
	readonly verdicts: ReadonlyArray<{
		readonly __typename: 'DraftReviewVerdictRecord';
		readonly verdict: DraftReviewVerdict;
		readonly notes?: string | null | undefined;
		readonly contentHash?: string | null | undefined;
		readonly recordedAt: string;
		readonly reviewer: {
			readonly __typename: 'Actor';
			readonly id: string;
			readonly username: string;
			readonly domain?: string | null | undefined;
			readonly displayName?: string | null | undefined;
			readonly avatar?: string | null | undefined;
			readonly isAgent: boolean;
		};
	}>;
}>;
//# sourceMappingURL=LesserGraphQLAdapter.d.ts.map
