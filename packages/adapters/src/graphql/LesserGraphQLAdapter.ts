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
	TimelineQueryVariables,
	TimelineType,
	NotificationsQueryVariables,
	SearchQueryVariables,
	CreateNoteMutationVariables,
	CreateQuoteNoteMutationVariables,
	CreateListMutationVariables,
	UpdateListMutationVariables,
	ConversationsQueryVariables,
	UpdateRelationshipMutationVariables,
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
	WithdrawFromQuotesDocument,
	UpdateQuotePermissionsDocument,
	ObjectWithQuotesDocument,
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
	AddCommunityNoteDocument,
	VoteCommunityNoteDocument,
	CommunityNotesByObjectDocument,
	FlagObjectDocument,
	CreateModerationPatternDocument,
	DeleteModerationPatternDocument,
	RequestAiAnalysisDocument,
	AiAnalysisDocument,
	AiStatsDocument,
	AiCapabilitiesDocument,
	TrustGraphDocument,
	CostBreakdownDocument,
	InstanceBudgetsDocument,
	SetInstanceBudgetDocument,
	OptimizeFederationCostsDocument,
	FederationLimitsDocument,
	SetFederationLimitDocument,
	SyncThreadDocument,
	SyncMissingRepliesDocument,
	ThreadContextDocument,
	SeveredRelationshipsDocument,
	AcknowledgeSeveranceDocument,
	AttemptReconnectionDocument,
	FederationHealthDocument,
	FederationStatusDocument,
	PauseFederationDocument,
	ResumeFederationDocument,
	FollowHashtagDocument,
	UnfollowHashtagDocument,
	MuteHashtagDocument,
	FollowedHashtagsDocument,
	ActivityStreamDocument,
	RelationshipUpdatesDocument,
	CostUpdatesDocument,
	ModerationEventsDocument,
	TrustUpdatesDocument,
	AiAnalysisUpdatesDocument,
	MetricsUpdatesDocument,
	ModerationAlertsDocument,
	CostAlertsDocument,
	BudgetAlertsDocument,
	FederationHealthUpdatesDocument,
	ModerationQueueUpdateDocument,
	ThreatIntelligenceDocument,
	PerformanceAlertDocument,
	InfrastructureEventDocument,
} from './generated/types.js';

export type LesserGraphQLAdapterConfig = GraphQLClientConfig;

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

	async getObjectWithQuotes(id: string, first?: number, after?: string) {
		const data = await this.query(ObjectWithQuotesDocument, { id, first, after });
		return data.object;
	}

	async withdrawFromQuotes(noteId: string) {
		const data = await this.mutate(WithdrawFromQuotesDocument, { noteId });
		return data.withdrawFromQuotes;
	}

	async updateQuotePermissions(noteId: string, quoteable: boolean, permission: 'EVERYONE' | 'FOLLOWERS' | 'NONE') {
		const data = await this.mutate(UpdateQuotePermissionsDocument, { noteId, quoteable, permission });
		return data.updateQuotePermissions;
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

	// ============================================================================
	// PHASE 4: Community Notes
	// ============================================================================

	async addCommunityNote(input: { objectId: string; content: string }) {
		const data = await this.mutate(AddCommunityNoteDocument, { input });
		return data.addCommunityNote;
	}

	async voteCommunityNote(id: string, helpful: boolean) {
		const data = await this.mutate(VoteCommunityNoteDocument, { id, helpful });
		return data.voteCommunityNote;
	}

	async getCommunityNotesByObject(objectId: string, first?: number, after?: string) {
		const data = await this.query(CommunityNotesByObjectDocument, { objectId, first, after });
		return data.object;
	}

	// ============================================================================
	// PHASE 4: Moderation
	// ============================================================================

	async flagObject(input: { objectId: string; reason: string; evidence?: string[] }) {
		const data = await this.mutate(FlagObjectDocument, { input });
		return data.flagObject;
	}

	async createModerationPattern(input: { pattern: string; type: string; severity: string }) {
		const data = await this.mutate(CreateModerationPatternDocument, { input });
		return data.createModerationPattern;
	}

	async deleteModerationPattern(id: string) {
		const data = await this.mutate(DeleteModerationPatternDocument, { id });
		return data.deleteModerationPattern;
	}

	// ============================================================================
	// PHASE 4: AI Analysis
	// ============================================================================

	async requestAIAnalysis(objectId: string, objectType?: string, force?: boolean) {
		const data = await this.mutate(RequestAiAnalysisDocument, { objectId, objectType, force });
		return data.requestAIAnalysis;
	}

	async getAIAnalysis(objectId: string) {
		const data = await this.query(AiAnalysisDocument, { objectId });
		return data.aiAnalysis;
	}

	async getAIStats(period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR') {
		const data = await this.query(AiStatsDocument, { period });
		return data.aiStats;
	}

	async getAICapabilities() {
		const data = await this.query(AiCapabilitiesDocument);
		return data.aiCapabilities;
	}

	// ============================================================================
	// PHASE 4: Trust Graph
	// ============================================================================

	async getTrustGraph(actorId: string, category?: 'CONTENT' | 'BEHAVIOR' | 'TECHNICAL') {
		const data = await this.query(TrustGraphDocument, { actorId, category });
		return data.trustGraph;
	}

	// ============================================================================
	// PHASE 4: Cost Management
	// ============================================================================

	async getCostBreakdown(period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR') {
		const data = await this.query(CostBreakdownDocument, { period });
		return data.costBreakdown;
	}

	async getInstanceBudgets() {
		const data = await this.query(InstanceBudgetsDocument);
		return data.instanceBudgets;
	}

	async setInstanceBudget(domain: string, monthlyUSD: number, autoLimit?: boolean) {
		const data = await this.mutate(SetInstanceBudgetDocument, { domain, monthlyUSD, autoLimit });
		return data.setInstanceBudget;
	}

	async optimizeFederationCosts(threshold: number) {
		const data = await this.mutate(OptimizeFederationCostsDocument, { threshold });
		return data.optimizeFederationCosts;
	}

	async getFederationLimits() {
		const data = await this.query(FederationLimitsDocument);
		return data.federationLimits;
	}

	async setFederationLimit(domain: string, limit: Record<string, unknown>) {
		const data = await this.mutate(SetFederationLimitDocument, { domain, limit });
		return data.setFederationLimit;
	}

	// ============================================================================
	// PHASE 4: Thread Sync & Federation
	// ============================================================================

	async syncThread(noteUrl: string, depth?: number) {
		const data = await this.mutate(SyncThreadDocument, { noteUrl, depth });
		return data.syncThread;
	}

	async syncMissingReplies(noteId: string) {
		const data = await this.mutate(SyncMissingRepliesDocument, { noteId });
		return data.syncMissingReplies;
	}

	async getThreadContext(noteId: string) {
		const data = await this.query(ThreadContextDocument, { noteId });
		return data.threadContext;
	}

	async getSeveredRelationships(instance?: string, first?: number, after?: string) {
		const data = await this.query(SeveredRelationshipsDocument, { instance, first, after });
		return data.severedRelationships;
	}

	async acknowledgeSeverance(id: string) {
		const data = await this.mutate(AcknowledgeSeveranceDocument, { id });
		return data.acknowledgeSeverance;
	}

	async attemptReconnection(id: string) {
		const data = await this.mutate(AttemptReconnectionDocument, { id });
		return data.attemptReconnection;
	}

	async getFederationHealth(threshold?: number) {
		const data = await this.query(FederationHealthDocument, { threshold });
		return data.federationHealth;
	}

	async getFederationStatus(domain: string) {
		const data = await this.query(FederationStatusDocument, { domain });
		return data.federationStatus;
	}

	async pauseFederation(domain: string, reason: string, until?: string) {
		const data = await this.mutate(PauseFederationDocument, { domain, reason, until });
		return data.pauseFederation;
	}

	async resumeFederation(domain: string) {
		const data = await this.mutate(ResumeFederationDocument, { domain });
		return data.resumeFederation;
	}

	// ============================================================================
	// PHASE 4: Hashtag Management
	// ============================================================================

	async followHashtag(hashtag: string, notifyLevel?: 'ALL' | 'MUTUALS' | 'FOLLOWING' | 'NONE') {
		const data = await this.mutate(FollowHashtagDocument, { hashtag, notifyLevel });
		return data.followHashtag;
	}

	async unfollowHashtag(hashtag: string) {
		const data = await this.mutate(UnfollowHashtagDocument, { hashtag });
		return data.unfollowHashtag;
	}

	async muteHashtag(hashtag: string, until?: string) {
		const data = await this.mutate(MuteHashtagDocument, { hashtag, until });
		return data.muteHashtag;
	}

	async getFollowedHashtags(first?: number, after?: string) {
		const data = await this.query(FollowedHashtagsDocument, { first, after });
		return data.followedHashtags;
	}

	// ============================================================================
	// SUBSCRIPTIONS
	// ============================================================================

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

	subscribeToActivityStream(
		variables?: ActivityStreamSubscriptionVariables
	): Observable<FetchResult<ActivityStreamSubscription>> {
		return this.client.client.subscribe({
			query: ActivityStreamDocument,
			variables,
		});
	}

	subscribeToRelationshipUpdates(
		variables?: RelationshipUpdatesSubscriptionVariables
	): Observable<FetchResult<RelationshipUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: RelationshipUpdatesDocument,
			variables,
		});
	}

	subscribeToCostUpdates(
		variables?: CostUpdatesSubscriptionVariables
	): Observable<FetchResult<CostUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: CostUpdatesDocument,
			variables,
		});
	}

	subscribeToModerationEvents(
		variables?: ModerationEventsSubscriptionVariables
	): Observable<FetchResult<ModerationEventsSubscription>> {
		return this.client.client.subscribe({
			query: ModerationEventsDocument,
			variables,
		});
	}

	subscribeToTrustUpdates(
		variables: TrustUpdatesSubscriptionVariables
	): Observable<FetchResult<TrustUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: TrustUpdatesDocument,
			variables,
		});
	}

	subscribeToAiAnalysisUpdates(
		variables?: AiAnalysisUpdatesSubscriptionVariables
	): Observable<FetchResult<AiAnalysisUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: AiAnalysisUpdatesDocument,
			variables,
		});
	}

	subscribeToMetricsUpdates(
		variables?: MetricsUpdatesSubscriptionVariables
	): Observable<FetchResult<MetricsUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: MetricsUpdatesDocument,
			variables,
		});
	}

	subscribeToModerationAlerts(
		variables?: ModerationAlertsSubscriptionVariables
	): Observable<FetchResult<ModerationAlertsSubscription>> {
		return this.client.client.subscribe({
			query: ModerationAlertsDocument,
			variables,
		});
	}

	subscribeToCostAlerts(
		variables: CostAlertsSubscriptionVariables
	): Observable<FetchResult<CostAlertsSubscription>> {
		return this.client.client.subscribe({
			query: CostAlertsDocument,
			variables,
		});
	}

	subscribeToBudgetAlerts(
		variables?: BudgetAlertsSubscriptionVariables
	): Observable<FetchResult<BudgetAlertsSubscription>> {
		return this.client.client.subscribe({
			query: BudgetAlertsDocument,
			variables,
		});
	}

	subscribeToFederationHealthUpdates(
		variables?: FederationHealthUpdatesSubscriptionVariables
	): Observable<FetchResult<FederationHealthUpdatesSubscription>> {
		return this.client.client.subscribe({
			query: FederationHealthUpdatesDocument,
			variables,
		});
	}

	subscribeToModerationQueueUpdate(
		variables?: ModerationQueueUpdateSubscriptionVariables
	): Observable<FetchResult<ModerationQueueUpdateSubscription>> {
		return this.client.client.subscribe({
			query: ModerationQueueUpdateDocument,
			variables,
		});
	}

	subscribeToThreatIntelligence(): Observable<FetchResult<ThreatIntelligenceSubscription>> {
		return this.client.client.subscribe({
			query: ThreatIntelligenceDocument,
		});
	}

	subscribeToPerformanceAlert(
		variables: PerformanceAlertSubscriptionVariables
	): Observable<FetchResult<PerformanceAlertSubscription>> {
		return this.client.client.subscribe({
			query: PerformanceAlertDocument,
			variables,
		});
	}

	subscribeToInfrastructureEvent(): Observable<FetchResult<InfrastructureEventSubscription>> {
		return this.client.client.subscribe({
			query: InfrastructureEventDocument,
		});
	}
}

export function createLesserGraphQLAdapter(
	config: LesserGraphQLAdapterConfig
): LesserGraphQLAdapter {
	return new LesserGraphQLAdapter(config);
}
