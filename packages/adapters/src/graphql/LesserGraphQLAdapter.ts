/**
 * Lesser GraphQL Adapter aligned with the current Lesser schema.
 *
 * Provides typed accessors and convenience helpers around the generated
 * GraphQL operations. Consumers should migrate towards the generic timeline
 * and object accessors rather than the legacy Mastodon-style wrappers.
 */

import { Observable, type FetchResult } from '@apollo/client/core';
import type { DocumentNode } from '@graphql-typed-document-node/core';

import {
	createGraphQLClient,
	type GraphQLClientConfig,
	type GraphQLClientInstance,
} from './client.js';

import type {
	TimelineQuery,
	TimelineQueryVariables,
	TimelineType,
	NotificationsQuery,
	NotificationsQueryVariables,
	DismissNotificationMutation,
	DismissNotificationMutationVariables,
	ClearNotificationsMutation,
	ClearNotificationsMutationVariables,
	SearchQuery,
	SearchQueryVariables,
	ObjectByIdQuery,
	ObjectByIdQueryVariables,
	ActorByIdQuery,
	ActorByIdQueryVariables,
	ActorByUsernameQuery,
	ActorByUsernameQueryVariables,
	CreateNoteMutation,
	CreateNoteMutationVariables,
	CreateQuoteNoteMutation,
	CreateQuoteNoteMutationVariables,
	DeleteObjectMutation,
	DeleteObjectMutationVariables,
	LikeObjectMutation,
	LikeObjectMutationVariables,
	UnlikeObjectMutation,
	UnlikeObjectMutationVariables,
	ShareObjectMutation,
	ShareObjectMutationVariables,
	UnshareObjectMutation,
	UnshareObjectMutationVariables,
	BookmarkObjectMutation,
	BookmarkObjectMutationVariables,
	UnbookmarkObjectMutation,
	UnbookmarkObjectMutationVariables,
	PinObjectMutation,
	PinObjectMutationVariables,
	UnpinObjectMutation,
	UnpinObjectMutationVariables,
	ListsQuery,
	ListQuery,
	ListQueryVariables,
	ListAccountsQuery,
	ListAccountsQueryVariables,
	CreateListMutation,
	CreateListMutationVariables,
	UpdateListMutation,
	UpdateListMutationVariables,
	DeleteListMutation,
	DeleteListMutationVariables,
	AddAccountsToListMutation,
	AddAccountsToListMutationVariables,
	RemoveAccountsFromListMutation,
	RemoveAccountsFromListMutationVariables,
	ConversationsQuery,
	ConversationsQueryVariables,
	ConversationQuery,
	ConversationQueryVariables,
	MarkConversationReadMutation,
	MarkConversationReadMutationVariables,
	DeleteConversationMutation,
	DeleteConversationMutationVariables,
	RelationshipQuery,
	RelationshipQueryVariables,
	RelationshipsQuery,
	RelationshipsQueryVariables,
	FollowActorMutation,
	FollowActorMutationVariables,
	UnfollowActorMutation,
	UnfollowActorMutationVariables,
	BlockActorMutation,
	BlockActorMutationVariables,
	UnblockActorMutation,
	UnblockActorMutationVariables,
	MuteActorMutation,
	MuteActorMutationVariables,
	UnmuteActorMutation,
	UnmuteActorMutationVariables,
	UpdateRelationshipMutation,
	UpdateRelationshipMutationVariables,
	TimelineUpdatesSubscription,
	TimelineUpdatesSubscriptionVariables,
	NotificationStreamSubscription,
	NotificationStreamSubscriptionVariables,
	ConversationUpdatesSubscription,
	ConversationUpdatesSubscriptionVariables,
	ListUpdatesSubscription,
	ListUpdatesSubscriptionVariables,
	QuoteActivitySubscription,
	QuoteActivitySubscriptionVariables,
	HashtagActivitySubscription,
	HashtagActivitySubscriptionVariables,
} from './generated/types.js';

import {
	TimelineDocument,
	NotificationsDocument,
	DismissNotificationDocument,
	ClearNotificationsDocument,
	SearchDocument,
	ObjectByIdDocument,
	ActorByIdDocument,
	ActorByUsernameDocument,
	CreateNoteDocument,
	CreateQuoteNoteDocument,
	DeleteObjectDocument,
	LikeObjectDocument,
	UnlikeObjectDocument,
	ShareObjectDocument,
	UnshareObjectDocument,
	BookmarkObjectDocument,
	UnbookmarkObjectDocument,
	PinObjectDocument,
	UnpinObjectDocument,
	ListsDocument,
	ListDocument,
	ListAccountsDocument,
	CreateListDocument,
	UpdateListDocument,
	DeleteListDocument,
	AddAccountsToListDocument,
	RemoveAccountsFromListDocument,
	ConversationsDocument,
	ConversationDocument,
	MarkConversationReadDocument,
	DeleteConversationDocument,
	RelationshipDocument,
	RelationshipsDocument,
	FollowActorDocument,
	UnfollowActorDocument,
	BlockActorDocument,
	UnblockActorDocument,
	MuteActorDocument,
	UnmuteActorDocument,
	UpdateRelationshipDocument,
	TimelineUpdatesDocument,
	NotificationStreamDocument,
	ConversationUpdatesDocument,
	ListUpdatesDocument,
	QuoteActivityDocument,
	HashtagActivityDocument,
} from './generated/types.js';

export interface LesserGraphQLAdapterConfig extends GraphQLClientConfig {}

export type TimelineVariables = TimelineQueryVariables;
export type SearchVariables = SearchQueryVariables;
export type CreateNoteVariables = CreateNoteMutationVariables;

export class LesserGraphQLAdapter {
	private readonly client: GraphQLClientInstance;

	constructor(config: LesserGraphQLAdapterConfig) {
		this.client = createGraphQLClient(config);
	}

	updateToken(token: string | null): void {
		this.client.updateToken(token);
	}

	close(): void {
		this.client.close();
	}

	private async query<TData, TVariables = Record<string, never>>(
		document: DocumentNode<TData, TVariables>,
		variables?: TVariables,
		fetchPolicy: 'cache-first' | 'network-only' = 'network-only'
	): Promise<TData> {
		const { data } = await this.client.client.query<TData, TVariables>({
			query: document,
			variables,
			fetchPolicy,
		});

		return data;
	}

	private async mutate<TData, TVariables = Record<string, never>>(
		document: DocumentNode<TData, TVariables>,
		variables?: TVariables
	): Promise<TData> {
		const { data } = await this.client.client.mutate<TData, TVariables>({
			mutation: document,
			variables,
		});

		if (!data) {
			throw new Error('Mutation completed without returning data.');
		}

		return data;
	}

	async fetchTimeline(variables: TimelineQueryVariables) {
		const data = await this.query(TimelineDocument, variables);
		return data.timeline;
	}

	async fetchHomeTimeline(
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	) {
		return this.fetchTimeline({
			type: 'HOME',
			first: pagination?.first,
			after: pagination?.after,
		});
	}

	async fetchPublicTimeline(
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>,
		scope: Extract<TimelineType, 'PUBLIC' | 'LOCAL'> = 'PUBLIC'
	) {
		return this.fetchTimeline({
			type: scope,
			first: pagination?.first,
			after: pagination?.after,
		});
	}

	async fetchDirectTimeline(
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	) {
		return this.fetchTimeline({
			type: 'DIRECT',
			first: pagination?.first,
			after: pagination?.after,
		});
	}

	async fetchHashtagTimeline(
		hashtag: string,
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	) {
		return this.fetchTimeline({
			type: 'HASHTAG',
			hashtag,
			first: pagination?.first,
			after: pagination?.after,
		});
	}

	async fetchListTimeline(
		listId: string,
		pagination?: Partial<Pick<TimelineQueryVariables, 'first' | 'after'>>
	) {
		return this.fetchTimeline({
			type: 'LIST',
			listId,
			first: pagination?.first,
			after: pagination?.after,
		});
	}

	async getObject(id: string) {
		const data = await this.query(ObjectByIdDocument, { id });
		return data.object;
	}

	async getActorById(id: string) {
		const data = await this.query(ActorByIdDocument, { id });
		return data.actor;
	}

	async getActorByUsername(username: string) {
		const data = await this.query(ActorByUsernameDocument, { username });
		return data.actor;
	}

	async search(variables: SearchQueryVariables) {
		const data = await this.query(SearchDocument, variables);
		return data.search;
	}

	async fetchNotifications(variables: NotificationsQueryVariables) {
		const data = await this.query(NotificationsDocument, variables);
		return data.notifications;
	}

	async dismissNotification(id: string) {
		const data = await this.mutate(DismissNotificationDocument, { id });
		return data.dismissNotification;
	}

	async clearNotifications() {
		const data = await this.mutate(ClearNotificationsDocument);
		return data.clearNotifications;
	}

	async getConversations(variables: ConversationsQueryVariables) {
		const data = await this.query(ConversationsDocument, variables);
		return data.conversations;
	}

	async getConversation(id: string) {
		const data = await this.query(ConversationDocument, { id });
		return data.conversation;
	}

	async markConversationAsRead(id: string) {
		const data = await this.mutate(MarkConversationReadDocument, { id });
		return data.markConversationAsRead;
	}

	async deleteConversation(id: string) {
		const data = await this.mutate(DeleteConversationDocument, { id });
		return data.deleteConversation;
	}

	async getLists() {
		const data = await this.query(ListsDocument);
		return data.lists;
	}

	async getList(id: string) {
		const data = await this.query(ListDocument, { id });
		return data.list;
	}

	async getListAccounts(id: string) {
		const data = await this.query(ListAccountsDocument, { id });
		return data.listAccounts;
	}

	async createList(input: CreateListMutationVariables['input']) {
		const data = await this.mutate(CreateListDocument, { input });
		return data.createList;
	}

	async updateList(id: string, input: UpdateListMutationVariables['input']) {
		const data = await this.mutate(UpdateListDocument, { id, input });
		return data.updateList;
	}

	async deleteList(id: string) {
		const data = await this.mutate(DeleteListDocument, { id });
		return data.deleteList;
	}

	async addAccountsToList(id: string, accountIds: string[]) {
		const data = await this.mutate(AddAccountsToListDocument, { id, accountIds });
		return data.addAccountsToList;
	}

	async removeAccountsFromList(id: string, accountIds: string[]) {
		const data = await this.mutate(RemoveAccountsFromListDocument, { id, accountIds });
		return data.removeAccountsFromList;
	}

	async createNote(variables: CreateNoteMutationVariables) {
		const data = await this.mutate(CreateNoteDocument, variables);
		return data.createNote;
	}

	async createQuoteNote(variables: CreateQuoteNoteMutationVariables) {
		const data = await this.mutate(CreateQuoteNoteDocument, variables);
		return data.createQuoteNote;
	}

	async deleteObject(id: string) {
		const data = await this.mutate(DeleteObjectDocument, { id });
		return data.deleteObject;
	}

	async likeObject(id: string) {
		const data = await this.mutate(LikeObjectDocument, { id });
		return data.likeObject;
	}

	async unlikeObject(id: string) {
		const data = await this.mutate(UnlikeObjectDocument, { id });
		return data.unlikeObject;
	}

	async shareObject(id: string) {
		const data = await this.mutate(ShareObjectDocument, { id });
		return data.shareObject;
	}

	async unshareObject(id: string) {
		const data = await this.mutate(UnshareObjectDocument, { id });
		return data.unshareObject;
	}

	async bookmarkObject(id: string) {
		const data = await this.mutate(BookmarkObjectDocument, { id });
		return data.bookmarkObject;
	}

	async unbookmarkObject(id: string) {
		const data = await this.mutate(UnbookmarkObjectDocument, { id });
		return data.unbookmarkObject;
	}

	async pinObject(id: string) {
		const data = await this.mutate(PinObjectDocument, { id });
		return data.pinObject;
	}

	async unpinObject(id: string) {
		const data = await this.mutate(UnpinObjectDocument, { id });
		return data.unpinObject;
	}

	async getRelationship(id: string) {
		const data = await this.query(RelationshipDocument, { id });
		return data.relationship;
	}

	async getRelationships(ids: string[]) {
		const data = await this.query(RelationshipsDocument, { ids });
		return data.relationships;
	}

	async followActor(id: string) {
		const data = await this.mutate(FollowActorDocument, { id });
		return data.followActor;
	}

	async unfollowActor(id: string) {
		const data = await this.mutate(UnfollowActorDocument, { id });
		return data.unfollowActor;
	}

	async blockActor(id: string) {
		const data = await this.mutate(BlockActorDocument, { id });
		return data.blockActor;
	}

	async unblockActor(id: string) {
		const data = await this.mutate(UnblockActorDocument, { id });
		return data.unblockActor;
	}

	async muteActor(id: string, notifications?: boolean) {
		const data = await this.mutate(MuteActorDocument, { id, notifications });
		return data.muteActor;
	}

	async unmuteActor(id: string) {
		const data = await this.mutate(UnmuteActorDocument, { id });
		return data.unmuteActor;
	}

	async updateRelationship(
		id: string,
		input: UpdateRelationshipMutationVariables['input']
	) {
		const data = await this.mutate(UpdateRelationshipDocument, { id, input });
		return data.updateRelationship;
	}

	subscribeToTimelineUpdates(
		variables: TimelineUpdatesSubscriptionVariables
	): Observable<FetchResult<TimelineUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: TimelineUpdatesDocument,
			variables,
		});
	}

	subscribeToNotificationStream(
		variables?: NotificationStreamSubscriptionVariables
	): Observable<FetchResult<NotificationStreamSubscription>> {
		return this.client.client.subscribe({
			query: NotificationStreamDocument,
			variables,
		});
	}

	subscribeToConversationUpdates(): Observable<
		FetchResult<ConversationUpdatesSubscription>
	> {
		return this.client.client.subscribe({
			query: ConversationUpdatesDocument,
		});
	}

	subscribeToListUpdates(
		variables: ListUpdatesSubscriptionVariables
	): Observable<FetchResult<ListUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: ListUpdatesDocument,
			variables,
		});
	}

	subscribeToQuoteActivity(
		variables: QuoteActivitySubscriptionVariables
	): Observable<FetchResult<QuoteActivitySubscription>> {
		return this.client.client.subscribe({
			query: QuoteActivityDocument,
			variables,
		});
	}

	subscribeToHashtagActivity(
		variables: HashtagActivitySubscriptionVariables
	): Observable<FetchResult<HashtagActivitySubscription>> {
		return this.client.client.subscribe({
			query: HashtagActivityDocument,
			variables,
		});
	}
}

export function createLesserGraphQLAdapter(
	config: LesserGraphQLAdapterConfig
): LesserGraphQLAdapter {
	return new LesserGraphQLAdapter(config);
}
