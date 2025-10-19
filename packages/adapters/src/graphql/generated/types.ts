import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: string; output: string; }
  Duration: { input: any; output: any; }
  Time: { input: string; output: string; }
  Upload: { input: File | Blob; output: File | Blob; }
};

/** AI Analysis types */
export type AiAnalysis = {
  readonly __typename: 'AIAnalysis';
  readonly aiDetection?: Maybe<AiDetection>;
  readonly analyzedAt: Scalars['Time']['output'];
  readonly confidence: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly imageAnalysis?: Maybe<ImageAnalysis>;
  readonly moderationAction: ModerationAction;
  readonly objectId: Scalars['ID']['output'];
  readonly objectType: Scalars['String']['output'];
  readonly overallRisk: Scalars['Float']['output'];
  readonly spamAnalysis?: Maybe<SpamAnalysis>;
  readonly textAnalysis?: Maybe<TextAnalysis>;
};

export type AiAnalysisRequest = {
  readonly __typename: 'AIAnalysisRequest';
  readonly estimatedTime: Scalars['String']['output'];
  readonly message: Scalars['String']['output'];
  readonly objectId: Scalars['ID']['output'];
};

export type AiCapabilities = {
  readonly __typename: 'AICapabilities';
  readonly aiDetection: AiDetectionCapabilities;
  readonly costPerAnalysis: CostBreakdown;
  readonly imageAnalysis: ImageAnalysisCapabilities;
  readonly moderationActions: ReadonlyArray<Scalars['String']['output']>;
  readonly textAnalysis: TextAnalysisCapabilities;
};

export type AiDetection = {
  readonly __typename: 'AIDetection';
  readonly aiGeneratedProbability: Scalars['Float']['output'];
  readonly generationModel?: Maybe<Scalars['String']['output']>;
  readonly patternConsistency: Scalars['Float']['output'];
  readonly semanticCoherence: Scalars['Float']['output'];
  readonly styleDeviation: Scalars['Float']['output'];
  readonly suspiciousPatterns: ReadonlyArray<Scalars['String']['output']>;
};

export type AiDetectionCapabilities = {
  readonly __typename: 'AIDetectionCapabilities';
  readonly aiGeneratedContent: Scalars['Boolean']['output'];
  readonly patternAnalysis: Scalars['Boolean']['output'];
  readonly styleConsistency: Scalars['Boolean']['output'];
};

export type AiStats = {
  readonly __typename: 'AIStats';
  readonly aiContentRate: Scalars['Float']['output'];
  readonly aiGenerated: Scalars['Int']['output'];
  readonly moderationActions: ModerationActionCounts;
  readonly nsfwContent: Scalars['Int']['output'];
  readonly nsfwRate: Scalars['Float']['output'];
  readonly period: Scalars['String']['output'];
  readonly piiDetected: Scalars['Int']['output'];
  readonly spamDetected: Scalars['Int']['output'];
  readonly spamRate: Scalars['Float']['output'];
  readonly totalAnalyses: Scalars['Int']['output'];
  readonly toxicContent: Scalars['Int']['output'];
  readonly toxicityRate: Scalars['Float']['output'];
};

export type AccessLog = {
  readonly __typename: 'AccessLog';
  readonly cost: Scalars['Int']['output'];
  readonly operation: Scalars['String']['output'];
  readonly timestamp: Scalars['Time']['output'];
};

export type AccountSuggestion = {
  readonly __typename: 'AccountSuggestion';
  readonly account: Actor;
  readonly reason?: Maybe<Scalars['String']['output']>;
  readonly source: SuggestionSource;
};

export type AcknowledgePayload = {
  readonly __typename: 'AcknowledgePayload';
  readonly acknowledged: Scalars['Boolean']['output'];
  readonly severedRelationship: SeveredRelationship;
  readonly success: Scalars['Boolean']['output'];
};

export type Activity = {
  readonly __typename: 'Activity';
  readonly actor: Actor;
  readonly cost: Scalars['Int']['output'];
  readonly id: Scalars['ID']['output'];
  readonly object?: Maybe<Object>;
  readonly published: Scalars['Time']['output'];
  readonly target?: Maybe<Object>;
  readonly type: ActivityType;
};

export type ActivityType =
  | 'ACCEPT'
  | 'ANNOUNCE'
  | 'CREATE'
  | 'DELETE'
  | 'FLAG'
  | 'FOLLOW'
  | 'LIKE'
  | 'REJECT'
  | 'UNDO'
  | 'UPDATE';

export type Actor = {
  readonly __typename: 'Actor';
  readonly avatar?: Maybe<Scalars['String']['output']>;
  readonly bot: Scalars['Boolean']['output'];
  readonly createdAt: Scalars['Time']['output'];
  readonly displayName?: Maybe<Scalars['String']['output']>;
  readonly domain?: Maybe<Scalars['String']['output']>;
  readonly fields: ReadonlyArray<Field>;
  readonly followers: Scalars['Int']['output'];
  readonly following: Scalars['Int']['output'];
  readonly header?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly locked: Scalars['Boolean']['output'];
  readonly reputation?: Maybe<Reputation>;
  readonly statusesCount: Scalars['Int']['output'];
  readonly summary?: Maybe<Scalars['String']['output']>;
  readonly trustScore: Scalars['Float']['output'];
  readonly updatedAt: Scalars['Time']['output'];
  readonly username: Scalars['String']['output'];
  readonly vouches: ReadonlyArray<Vouch>;
};

export type ActorListPage = {
  readonly __typename: 'ActorListPage';
  readonly actors: ReadonlyArray<Actor>;
  readonly nextCursor?: Maybe<Scalars['Cursor']['output']>;
  readonly totalCount: Scalars['Int']['output'];
};

export type ActorType =
  | 'APPLICATION'
  | 'GROUP'
  | 'ORGANIZATION'
  | 'PERSON'
  | 'SERVICE';

export type AffectedRelationship = {
  readonly __typename: 'AffectedRelationship';
  readonly actor: Actor;
  readonly establishedAt: Scalars['Time']['output'];
  readonly lastInteraction?: Maybe<Scalars['Time']['output']>;
  readonly relationshipType: Scalars['String']['output'];
};

export type AffectedRelationshipConnection = {
  readonly __typename: 'AffectedRelationshipConnection';
  readonly edges: ReadonlyArray<AffectedRelationshipEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type AffectedRelationshipEdge = {
  readonly __typename: 'AffectedRelationshipEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: AffectedRelationship;
};

export type AlertLevel =
  | 'CRITICAL'
  | 'INFO'
  | 'WARNING';

export type AlertSeverity =
  | 'CRITICAL'
  | 'ERROR'
  | 'INFO'
  | 'WARNING';

export type Attachment = {
  readonly __typename: 'Attachment';
  readonly blurhash?: Maybe<Scalars['String']['output']>;
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly duration?: Maybe<Scalars['Float']['output']>;
  readonly height?: Maybe<Scalars['Int']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly preview?: Maybe<Scalars['String']['output']>;
  readonly type: Scalars['String']['output'];
  readonly url: Scalars['String']['output'];
  readonly width?: Maybe<Scalars['Int']['output']>;
};

export type BandwidthReport = {
  readonly __typename: 'BandwidthReport';
  readonly avgMbps: Scalars['Float']['output'];
  readonly byHour: ReadonlyArray<HourlyBandwidth>;
  readonly byQuality: ReadonlyArray<QualityBandwidth>;
  readonly cost: Scalars['Float']['output'];
  readonly peakMbps: Scalars['Float']['output'];
  readonly period: TimePeriod;
  readonly totalGB: Scalars['Float']['output'];
};

export type BedrockTrainingOptions = {
  readonly baseModelId?: InputMaybe<Scalars['String']['input']>;
  readonly datasetS3Path?: InputMaybe<Scalars['String']['input']>;
  readonly earlyStoppingEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  readonly maxTrainingTime?: InputMaybe<Scalars['Int']['input']>;
  readonly outputS3Path?: InputMaybe<Scalars['String']['input']>;
};

export type Bitrate = {
  readonly __typename: 'Bitrate';
  readonly bitsPerSecond: Scalars['Int']['output'];
  readonly codec: Scalars['String']['output'];
  readonly height: Scalars['Int']['output'];
  readonly quality: StreamQuality;
  readonly width: Scalars['Int']['output'];
};

export type BudgetAlert = {
  readonly __typename: 'BudgetAlert';
  readonly alertLevel: AlertLevel;
  readonly budgetUSD: Scalars['Float']['output'];
  readonly domain: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly percentUsed: Scalars['Float']['output'];
  readonly projectedOverspend?: Maybe<Scalars['Float']['output']>;
  readonly spentUSD: Scalars['Float']['output'];
  readonly timestamp: Scalars['Time']['output'];
};

export type CategoryStats = {
  readonly __typename: 'CategoryStats';
  readonly accuracy: Scalars['Float']['output'];
  readonly category: Scalars['String']['output'];
  readonly count: Scalars['Int']['output'];
};

export type Celebrity = {
  readonly __typename: 'Celebrity';
  readonly confidence: Scalars['Float']['output'];
  readonly name: Scalars['String']['output'];
  readonly urls: ReadonlyArray<Scalars['String']['output']>;
};

export type CommunityNote = {
  readonly __typename: 'CommunityNote';
  readonly author: Actor;
  readonly content: Scalars['String']['output'];
  readonly createdAt: Scalars['Time']['output'];
  readonly helpful: Scalars['Int']['output'];
  readonly id: Scalars['ID']['output'];
  readonly notHelpful: Scalars['Int']['output'];
};

export type CommunityNoteInput = {
  readonly content: Scalars['String']['input'];
  readonly objectId: Scalars['ID']['input'];
};

export type CommunityNotePayload = {
  readonly __typename: 'CommunityNotePayload';
  readonly note: CommunityNote;
  readonly object: Object;
};

export type ConnectionType =
  | 'BOOSTS'
  | 'FOLLOWS'
  | 'MENTIONS'
  | 'MIXED'
  | 'QUOTES'
  | 'REPLIES';

export type ContentMap = {
  readonly __typename: 'ContentMap';
  readonly content: Scalars['String']['output'];
  readonly language: Scalars['String']['output'];
};

export type ContentMapInput = {
  readonly content: Scalars['String']['input'];
  readonly language: Scalars['String']['input'];
};

export type Conversation = {
  readonly __typename: 'Conversation';
  readonly accounts: ReadonlyArray<Actor>;
  readonly createdAt: Scalars['Time']['output'];
  readonly id: Scalars['ID']['output'];
  readonly lastStatus?: Maybe<Object>;
  readonly unread: Scalars['Boolean']['output'];
  readonly updatedAt: Scalars['Time']['output'];
};

export type Coordinates = {
  readonly __typename: 'Coordinates';
  readonly x: Scalars['Float']['output'];
  readonly y: Scalars['Float']['output'];
};

export type CostAlert = {
  readonly __typename: 'CostAlert';
  readonly amount: Scalars['Float']['output'];
  readonly domain?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly message: Scalars['String']['output'];
  readonly threshold: Scalars['Float']['output'];
  readonly timestamp: Scalars['Time']['output'];
  readonly type: Scalars['String']['output'];
};

export type CostBreakdown = {
  readonly __typename: 'CostBreakdown';
  readonly breakdown: ReadonlyArray<CostItem>;
  readonly dataTransferCost: Scalars['Float']['output'];
  readonly dynamoDBCost: Scalars['Float']['output'];
  readonly lambdaCost: Scalars['Float']['output'];
  readonly period: Period;
  readonly s3StorageCost: Scalars['Float']['output'];
  readonly totalCost: Scalars['Float']['output'];
};

export type CostItem = {
  readonly __typename: 'CostItem';
  readonly cost: Scalars['Float']['output'];
  readonly count: Scalars['Int']['output'];
  readonly operation: Scalars['String']['output'];
};

export type CostOptimizationResult = {
  readonly __typename: 'CostOptimizationResult';
  readonly actions: ReadonlyArray<OptimizationAction>;
  readonly optimized: Scalars['Int']['output'];
  readonly savedMonthlyUSD: Scalars['Float']['output'];
};

export type CostOrderBy =
  | 'DOMAIN_ASC'
  | 'ERROR_RATE_DESC'
  | 'REQUEST_COUNT_DESC'
  | 'TOTAL_COST_ASC'
  | 'TOTAL_COST_DESC';

export type CostProjection = {
  readonly __typename: 'CostProjection';
  readonly currentCost: Scalars['Float']['output'];
  readonly period: Period;
  readonly projectedCost: Scalars['Float']['output'];
  readonly recommendations: ReadonlyArray<Scalars['String']['output']>;
  readonly topDrivers: ReadonlyArray<Driver>;
  readonly variance: Scalars['Float']['output'];
};

export type CostUpdate = {
  readonly __typename: 'CostUpdate';
  readonly dailyTotal: Scalars['Float']['output'];
  readonly monthlyProjection: Scalars['Float']['output'];
  readonly operationCost: Scalars['Int']['output'];
};

export type CreateEmojiInput = {
  readonly category?: InputMaybe<Scalars['String']['input']>;
  readonly image: Scalars['String']['input'];
  readonly shortcode: Scalars['String']['input'];
  readonly visibleInPicker?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateListInput = {
  readonly exclusive?: InputMaybe<Scalars['Boolean']['input']>;
  readonly repliesPolicy?: InputMaybe<RepliesPolicy>;
  readonly title: Scalars['String']['input'];
};

export type CreateNoteInput = {
  readonly attachmentIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly content: Scalars['String']['input'];
  readonly contentMap?: InputMaybe<ReadonlyArray<ContentMapInput>>;
  readonly inReplyToId?: InputMaybe<Scalars['ID']['input']>;
  readonly mentions?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly sensitive?: InputMaybe<Scalars['Boolean']['input']>;
  readonly spoilerText?: InputMaybe<Scalars['String']['input']>;
  readonly tags?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly visibility: Visibility;
};

export type CreateNotePayload = {
  readonly __typename: 'CreateNotePayload';
  readonly activity: Activity;
  readonly cost: CostUpdate;
  readonly object: Object;
};

export type CreateQuoteNoteInput = {
  readonly content: Scalars['String']['input'];
  readonly mediaIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly quoteType?: InputMaybe<QuoteType>;
  readonly quoteUrl: Scalars['String']['input'];
  readonly quoteable?: InputMaybe<Scalars['Boolean']['input']>;
  readonly sensitive?: InputMaybe<Scalars['Boolean']['input']>;
  readonly spoilerText?: InputMaybe<Scalars['String']['input']>;
  readonly visibility?: InputMaybe<Visibility>;
};

export type CustomEmoji = {
  readonly __typename: 'CustomEmoji';
  readonly category?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['Time']['output'];
  readonly domain?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly shortcode: Scalars['String']['output'];
  readonly staticUrl: Scalars['String']['output'];
  readonly updatedAt: Scalars['Time']['output'];
  readonly url: Scalars['String']['output'];
  readonly visibleInPicker: Scalars['Boolean']['output'];
};

export type DatabaseStatus = {
  readonly __typename: 'DatabaseStatus';
  readonly connections: Scalars['Int']['output'];
  readonly latency: Scalars['Duration']['output'];
  readonly name: Scalars['String']['output'];
  readonly status: HealthStatus;
  readonly throughput: Scalars['Float']['output'];
  readonly type: Scalars['String']['output'];
};

export type DigestFrequency =
  | 'DAILY'
  | 'MONTHLY'
  | 'NEVER'
  | 'WEEKLY';

export type DirectoryFiltersInput = {
  readonly active?: InputMaybe<Scalars['Boolean']['input']>;
  readonly local?: InputMaybe<Scalars['Boolean']['input']>;
  readonly order?: InputMaybe<DirectoryOrder>;
  readonly remote?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DirectoryOrder =
  | 'ACTIVE'
  | 'NEW';

export type DiscoveryPreferences = {
  readonly __typename: 'DiscoveryPreferences';
  readonly personalizedSearchEnabled: Scalars['Boolean']['output'];
  readonly searchSuggestionsEnabled: Scalars['Boolean']['output'];
  readonly showFollowCounts: Scalars['Boolean']['output'];
};

export type Driver = {
  readonly __typename: 'Driver';
  readonly cost: Scalars['Float']['output'];
  readonly domain?: Maybe<Scalars['String']['output']>;
  readonly percentOfTotal: Scalars['Float']['output'];
  readonly trend: Trend;
  readonly type: Scalars['String']['output'];
};

export type Entity = {
  readonly __typename: 'Entity';
  readonly score: Scalars['Float']['output'];
  readonly text: Scalars['String']['output'];
  readonly type: Scalars['String']['output'];
};

export type ExpandMediaPreference =
  | 'DEFAULT'
  | 'HIDE_ALL'
  | 'SHOW_ALL';

export type FederationCost = {
  readonly __typename: 'FederationCost';
  readonly breakdown: CostBreakdown;
  readonly domain: Scalars['String']['output'];
  readonly egressBytes: Scalars['Int']['output'];
  readonly errorRate: Scalars['Float']['output'];
  readonly healthScore: Scalars['Float']['output'];
  readonly ingressBytes: Scalars['Int']['output'];
  readonly lastUpdated: Scalars['Time']['output'];
  readonly monthlyCostUSD: Scalars['Float']['output'];
  readonly recommendation?: Maybe<Scalars['String']['output']>;
  readonly requestCount: Scalars['Int']['output'];
};

export type FederationCostConnection = {
  readonly __typename: 'FederationCostConnection';
  readonly edges: ReadonlyArray<FederationCostEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type FederationCostEdge = {
  readonly __typename: 'FederationCostEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: FederationCost;
};

export type FederationEdge = {
  readonly __typename: 'FederationEdge';
  readonly bidirectional: Scalars['Boolean']['output'];
  readonly errorRate: Scalars['Float']['output'];
  readonly healthScore: Scalars['Float']['output'];
  readonly latency: Scalars['Float']['output'];
  readonly source: Scalars['String']['output'];
  readonly target: Scalars['String']['output'];
  readonly volumePerDay: Scalars['Int']['output'];
  readonly weight: Scalars['Float']['output'];
};

export type FederationFlow = {
  readonly __typename: 'FederationFlow';
  readonly costByInstance: ReadonlyArray<InstanceCost>;
  readonly topDestinations: ReadonlyArray<FlowNode>;
  readonly topSources: ReadonlyArray<FlowNode>;
  readonly volumeByHour: ReadonlyArray<HourlyVolume>;
};

export type FederationGraph = {
  readonly __typename: 'FederationGraph';
  readonly clusters: ReadonlyArray<InstanceCluster>;
  readonly edges: ReadonlyArray<FederationEdge>;
  readonly healthScore: Scalars['Float']['output'];
  readonly nodes: ReadonlyArray<InstanceNode>;
};

export type FederationHealthUpdate = {
  readonly __typename: 'FederationHealthUpdate';
  readonly currentStatus: InstanceHealthStatus;
  readonly domain: Scalars['String']['output'];
  readonly issues: ReadonlyArray<HealthIssue>;
  readonly previousStatus: InstanceHealthStatus;
  readonly timestamp: Scalars['Time']['output'];
};

export type FederationLimit = {
  readonly __typename: 'FederationLimit';
  readonly active: Scalars['Boolean']['output'];
  readonly createdAt: Scalars['Time']['output'];
  readonly domain: Scalars['String']['output'];
  readonly egressLimitMB: Scalars['Int']['output'];
  readonly ingressLimitMB: Scalars['Int']['output'];
  readonly monthlyBudgetUSD?: Maybe<Scalars['Float']['output']>;
  readonly requestsPerMinute: Scalars['Int']['output'];
  readonly updatedAt: Scalars['Time']['output'];
};

export type FederationLimitInput = {
  readonly egressLimitMB?: InputMaybe<Scalars['Int']['input']>;
  readonly ingressLimitMB?: InputMaybe<Scalars['Int']['input']>;
  readonly monthlyBudgetUSD?: InputMaybe<Scalars['Float']['input']>;
  readonly requestsPerMinute?: InputMaybe<Scalars['Int']['input']>;
};

export type FederationManagementStatus = {
  readonly __typename: 'FederationManagementStatus';
  readonly domain: Scalars['String']['output'];
  readonly limits?: Maybe<FederationLimit>;
  readonly metrics: FederationMetrics;
  readonly pausedUntil?: Maybe<Scalars['Time']['output']>;
  readonly reason?: Maybe<Scalars['String']['output']>;
  readonly status: FederationState;
};

export type FederationMetrics = {
  readonly __typename: 'FederationMetrics';
  readonly averageResponseTime: Scalars['Float']['output'];
  readonly currentMonthBandwidthMB: Scalars['Int']['output'];
  readonly currentMonthCostUSD: Scalars['Float']['output'];
  readonly currentMonthRequests: Scalars['Int']['output'];
  readonly errorRate: Scalars['Float']['output'];
};

export type FederationRecommendation = {
  readonly __typename: 'FederationRecommendation';
  readonly action: Scalars['String']['output'];
  readonly domain?: Maybe<Scalars['String']['output']>;
  readonly potentialImpact: Scalars['String']['output'];
  readonly priority: Priority;
  readonly reason: Scalars['String']['output'];
  readonly type: RecommendationType;
};

export type FederationState =
  | 'ACTIVE'
  | 'BLOCKED'
  | 'ERROR'
  | 'LIMITED'
  | 'PAUSED';

export type FederationStatus = {
  readonly __typename: 'FederationStatus';
  readonly domain: Scalars['String']['output'];
  readonly lastContact?: Maybe<Scalars['Time']['output']>;
  readonly publicKey?: Maybe<Scalars['String']['output']>;
  readonly reachable: Scalars['Boolean']['output'];
  readonly sharedInbox?: Maybe<Scalars['String']['output']>;
  readonly software?: Maybe<Scalars['String']['output']>;
  readonly version?: Maybe<Scalars['String']['output']>;
};

export type Field = {
  readonly __typename: 'Field';
  readonly name: Scalars['String']['output'];
  readonly value: Scalars['String']['output'];
  readonly verifiedAt?: Maybe<Scalars['Time']['output']>;
};

export type FlagInput = {
  readonly evidence?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly objectId: Scalars['ID']['input'];
  readonly reason: Scalars['String']['input'];
};

export type FlagPayload = {
  readonly __typename: 'FlagPayload';
  readonly moderationId: Scalars['ID']['output'];
  readonly queued: Scalars['Boolean']['output'];
};

export type FlowNode = {
  readonly __typename: 'FlowNode';
  readonly avgMessageSize: Scalars['Int']['output'];
  readonly domain: Scalars['String']['output'];
  readonly percentage: Scalars['Float']['output'];
  readonly trend: Trend;
  readonly volume: Scalars['Int']['output'];
};

export type FocusInput = {
  readonly x: Scalars['Float']['input'];
  readonly y: Scalars['Float']['input'];
};

export type Hashtag = {
  readonly __typename: 'Hashtag';
  readonly analytics: HashtagAnalytics;
  readonly displayName: Scalars['String']['output'];
  readonly followedAt?: Maybe<Scalars['Time']['output']>;
  readonly followerCount: Scalars['Int']['output'];
  readonly isFollowing: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly notificationSettings?: Maybe<HashtagNotificationSettings>;
  readonly postCount: Scalars['Int']['output'];
  readonly posts: PostConnection;
  readonly relatedHashtags: ReadonlyArray<Hashtag>;
  readonly trendingScore: Scalars['Float']['output'];
  readonly url: Scalars['String']['output'];
};


export type HashtagPostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type HashtagActivityUpdate = {
  readonly __typename: 'HashtagActivityUpdate';
  readonly author: Actor;
  readonly hashtag: Scalars['String']['output'];
  readonly post: Object;
  readonly timestamp: Scalars['Time']['output'];
};

export type HashtagAnalytics = {
  readonly __typename: 'HashtagAnalytics';
  readonly dailyPosts: ReadonlyArray<Scalars['Int']['output']>;
  readonly engagement: Scalars['Float']['output'];
  readonly hourlyPosts: ReadonlyArray<Scalars['Int']['output']>;
  readonly sentiment: Scalars['Float']['output'];
  readonly topPosters: ReadonlyArray<Actor>;
};

export type HashtagConnection = {
  readonly __typename: 'HashtagConnection';
  readonly edges: ReadonlyArray<HashtagEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type HashtagEdge = {
  readonly __typename: 'HashtagEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: Hashtag;
};

export type HashtagFollowPayload = {
  readonly __typename: 'HashtagFollowPayload';
  readonly hashtag: Hashtag;
  readonly success: Scalars['Boolean']['output'];
};

export type HashtagMode =
  | 'ALL'
  | 'ANY';

export type HashtagNotificationSettings = {
  readonly __typename: 'HashtagNotificationSettings';
  readonly filters: ReadonlyArray<NotificationFilter>;
  readonly level: NotificationLevel;
  readonly muted: Scalars['Boolean']['output'];
  readonly mutedUntil?: Maybe<Scalars['Time']['output']>;
};

export type HashtagNotificationSettingsInput = {
  readonly filters?: InputMaybe<ReadonlyArray<NotificationFilterInput>>;
  readonly level: NotificationLevel;
  readonly muted?: InputMaybe<Scalars['Boolean']['input']>;
  readonly mutedUntil?: InputMaybe<Scalars['Time']['input']>;
};

export type HashtagSuggestion = {
  readonly __typename: 'HashtagSuggestion';
  readonly hashtag: Hashtag;
  readonly reason: Scalars['String']['output'];
  readonly score: Scalars['Float']['output'];
};

export type HealthIssue = {
  readonly __typename: 'HealthIssue';
  readonly description: Scalars['String']['output'];
  readonly detectedAt: Scalars['Time']['output'];
  readonly impact: Scalars['String']['output'];
  readonly severity: IssueSeverity;
  readonly type: Scalars['String']['output'];
};

export type HealthStatus =
  | 'DEGRADED'
  | 'DOWN'
  | 'HEALTHY'
  | 'UNKNOWN';

export type HourlyBandwidth = {
  readonly __typename: 'HourlyBandwidth';
  readonly hour: Scalars['Time']['output'];
  readonly peakMbps: Scalars['Float']['output'];
  readonly totalGB: Scalars['Float']['output'];
};

export type HourlyVolume = {
  readonly __typename: 'HourlyVolume';
  readonly avgLatency: Scalars['Float']['output'];
  readonly errors: Scalars['Int']['output'];
  readonly hour: Scalars['Time']['output'];
  readonly inbound: Scalars['Int']['output'];
  readonly outbound: Scalars['Int']['output'];
};

export type ImageAnalysis = {
  readonly __typename: 'ImageAnalysis';
  readonly celebrityFaces: ReadonlyArray<Celebrity>;
  readonly deepfakeScore: Scalars['Float']['output'];
  readonly detectedText: ReadonlyArray<Scalars['String']['output']>;
  readonly isNSFW: Scalars['Boolean']['output'];
  readonly moderationLabels: ReadonlyArray<ModerationLabel>;
  readonly nsfwConfidence: Scalars['Float']['output'];
  readonly textToxicity: Scalars['Float']['output'];
  readonly violenceScore: Scalars['Float']['output'];
  readonly weaponsDetected: Scalars['Boolean']['output'];
};

export type ImageAnalysisCapabilities = {
  readonly __typename: 'ImageAnalysisCapabilities';
  readonly celebrityRecognition: Scalars['Boolean']['output'];
  readonly deepfakeDetection: Scalars['Boolean']['output'];
  readonly nsfwDetection: Scalars['Boolean']['output'];
  readonly textExtraction: Scalars['Boolean']['output'];
  readonly violenceDetection: Scalars['Boolean']['output'];
};

export type InfrastructureAlert = {
  readonly __typename: 'InfrastructureAlert';
  readonly id: Scalars['ID']['output'];
  readonly message: Scalars['String']['output'];
  readonly resolved: Scalars['Boolean']['output'];
  readonly service: Scalars['String']['output'];
  readonly severity: AlertSeverity;
  readonly timestamp: Scalars['Time']['output'];
};

export type InfrastructureEvent = {
  readonly __typename: 'InfrastructureEvent';
  readonly description: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly impact: Scalars['String']['output'];
  readonly service: Scalars['String']['output'];
  readonly timestamp: Scalars['Time']['output'];
  readonly type: InfrastructureEventType;
};

export type InfrastructureEventType =
  | 'DEPLOYMENT'
  | 'FAILURE'
  | 'MAINTENANCE'
  | 'RECOVERY'
  | 'SCALING';

export type InfrastructureStatus = {
  readonly __typename: 'InfrastructureStatus';
  readonly alerts: ReadonlyArray<InfrastructureAlert>;
  readonly databases: ReadonlyArray<DatabaseStatus>;
  readonly healthy: Scalars['Boolean']['output'];
  readonly queues: ReadonlyArray<QueueStatus>;
  readonly services: ReadonlyArray<ServiceStatus>;
};

export type InstanceBudget = {
  readonly __typename: 'InstanceBudget';
  readonly alertThreshold: Scalars['Float']['output'];
  readonly autoLimit: Scalars['Boolean']['output'];
  readonly currentSpendUSD: Scalars['Float']['output'];
  readonly domain: Scalars['String']['output'];
  readonly monthlyBudgetUSD: Scalars['Float']['output'];
  readonly period: Scalars['String']['output'];
  readonly projectedOverspend?: Maybe<Scalars['Float']['output']>;
  readonly remainingBudgetUSD: Scalars['Float']['output'];
};

export type InstanceCluster = {
  readonly __typename: 'InstanceCluster';
  readonly avgHealthScore: Scalars['Float']['output'];
  readonly commonality: Scalars['String']['output'];
  readonly description: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly members: ReadonlyArray<Scalars['String']['output']>;
  readonly name: Scalars['String']['output'];
  readonly totalVolume: Scalars['Int']['output'];
};

export type InstanceConnection = {
  readonly __typename: 'InstanceConnection';
  readonly connectionType: ConnectionType;
  readonly domain: Scalars['String']['output'];
  readonly lastActivity: Scalars['Time']['output'];
  readonly sharedUsers: Scalars['Int']['output'];
  readonly strength: Scalars['Float']['output'];
  readonly volumeIn: Scalars['Int']['output'];
  readonly volumeOut: Scalars['Int']['output'];
};

export type InstanceCost = {
  readonly __typename: 'InstanceCost';
  readonly breakdown: CostBreakdown;
  readonly costUSD: Scalars['Float']['output'];
  readonly domain: Scalars['String']['output'];
  readonly percentage: Scalars['Float']['output'];
};

export type InstanceHealthMetrics = {
  readonly __typename: 'InstanceHealthMetrics';
  readonly costEfficiency: Scalars['Float']['output'];
  readonly errorRate: Scalars['Float']['output'];
  readonly federationDelay: Scalars['Float']['output'];
  readonly queueDepth: Scalars['Int']['output'];
  readonly responseTime: Scalars['Float']['output'];
};

export type InstanceHealthReport = {
  readonly __typename: 'InstanceHealthReport';
  readonly domain: Scalars['String']['output'];
  readonly issues: ReadonlyArray<HealthIssue>;
  readonly lastChecked: Scalars['Time']['output'];
  readonly metrics: InstanceHealthMetrics;
  readonly recommendations: ReadonlyArray<Scalars['String']['output']>;
  readonly status: InstanceHealthStatus;
};

export type InstanceHealthStatus =
  | 'CRITICAL'
  | 'HEALTHY'
  | 'OFFLINE'
  | 'UNKNOWN'
  | 'WARNING';

export type InstanceMetadata = {
  readonly __typename: 'InstanceMetadata';
  readonly approvalRequired: Scalars['Boolean']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly firstSeen: Scalars['Time']['output'];
  readonly lastActivity: Scalars['Time']['output'];
  readonly monthlyActiveUsers: Scalars['Int']['output'];
  readonly primaryLanguage: Scalars['String']['output'];
  readonly registrationsOpen: Scalars['Boolean']['output'];
};

export type InstanceMetrics = {
  readonly __typename: 'InstanceMetrics';
  readonly activeUsers: Scalars['Int']['output'];
  readonly averageLatencyMs: Scalars['Float']['output'];
  readonly estimatedMonthlyCost: Scalars['Float']['output'];
  readonly lastUpdated: Scalars['Time']['output'];
  readonly requestsPerMinute: Scalars['Int']['output'];
  readonly storageUsedGB: Scalars['Float']['output'];
};

export type InstanceNode = {
  readonly __typename: 'InstanceNode';
  readonly coordinates: Coordinates;
  readonly displayName: Scalars['String']['output'];
  readonly domain: Scalars['String']['output'];
  readonly federatingWith: Scalars['Int']['output'];
  readonly healthStatus: InstanceHealthStatus;
  readonly metadata: InstanceMetadata;
  readonly software: Scalars['String']['output'];
  readonly statusCount: Scalars['Int']['output'];
  readonly userCount: Scalars['Int']['output'];
  readonly version: Scalars['String']['output'];
};

export type InstanceRelations = {
  readonly __typename: 'InstanceRelations';
  readonly blockedBy: ReadonlyArray<Scalars['String']['output']>;
  readonly blocking: ReadonlyArray<Scalars['String']['output']>;
  readonly directConnections: ReadonlyArray<InstanceConnection>;
  readonly domain: Scalars['String']['output'];
  readonly federationScore: Scalars['Float']['output'];
  readonly indirectConnections: ReadonlyArray<InstanceConnection>;
  readonly recommendations: ReadonlyArray<FederationRecommendation>;
};

export type IssueSeverity =
  | 'CRITICAL'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM';

export type List = {
  readonly __typename: 'List';
  readonly accountCount: Scalars['Int']['output'];
  readonly accounts: ReadonlyArray<Actor>;
  readonly createdAt: Scalars['Time']['output'];
  readonly exclusive: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly repliesPolicy: RepliesPolicy;
  readonly title: Scalars['String']['output'];
  readonly updatedAt: Scalars['Time']['output'];
};

export type ListUpdate = {
  readonly __typename: 'ListUpdate';
  readonly account?: Maybe<Actor>;
  readonly list: List;
  readonly timestamp: Scalars['Time']['output'];
  readonly type: Scalars['String']['output'];
};

export type Media = {
  readonly __typename: 'Media';
  readonly blurhash?: Maybe<Scalars['String']['output']>;
  readonly createdAt: Scalars['Time']['output'];
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly duration?: Maybe<Scalars['Float']['output']>;
  readonly height?: Maybe<Scalars['Int']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly mediaCategory: MediaCategory;
  readonly mimeType: Scalars['String']['output'];
  readonly previewUrl?: Maybe<Scalars['String']['output']>;
  readonly sensitive: Scalars['Boolean']['output'];
  readonly size: Scalars['Int']['output'];
  readonly spoilerText?: Maybe<Scalars['String']['output']>;
  readonly type: MediaType;
  readonly uploadedBy: Actor;
  readonly url: Scalars['String']['output'];
  readonly width?: Maybe<Scalars['Int']['output']>;
};

export type MediaCategory =
  | 'AUDIO'
  | 'DOCUMENT'
  | 'GIFV'
  | 'IMAGE'
  | 'UNKNOWN'
  | 'VIDEO';

export type MediaConnection = {
  readonly __typename: 'MediaConnection';
  readonly edges: ReadonlyArray<MediaEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type MediaEdge = {
  readonly __typename: 'MediaEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: Media;
};

export type MediaFilterInput = {
  readonly mediaType?: InputMaybe<MediaType>;
  readonly mimeType?: InputMaybe<Scalars['String']['input']>;
  readonly ownerId?: InputMaybe<Scalars['ID']['input']>;
  readonly ownerUsername?: InputMaybe<Scalars['String']['input']>;
  readonly since?: InputMaybe<Scalars['Time']['input']>;
  readonly until?: InputMaybe<Scalars['Time']['input']>;
};

export type MediaStream = {
  readonly __typename: 'MediaStream';
  readonly bitrates: ReadonlyArray<Bitrate>;
  readonly dashManifestUrl?: Maybe<Scalars['String']['output']>;
  readonly duration: Scalars['Int']['output'];
  readonly expiresAt: Scalars['Time']['output'];
  readonly hlsPlaylistUrl?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly thumbnailUrl: Scalars['String']['output'];
  readonly url: Scalars['String']['output'];
};

export type MediaType =
  | 'AUDIO'
  | 'IMAGE'
  | 'UNKNOWN'
  | 'VIDEO';

export type Mention = {
  readonly __typename: 'Mention';
  readonly domain?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly url: Scalars['String']['output'];
  readonly username: Scalars['String']['output'];
};

export type MetricsDimension = {
  readonly __typename: 'MetricsDimension';
  readonly key: Scalars['String']['output'];
  readonly value: Scalars['String']['output'];
};

export type MetricsUpdate = {
  readonly __typename: 'MetricsUpdate';
  readonly aggregationLevel: Scalars['String']['output'];
  readonly average: Scalars['Float']['output'];
  readonly count: Scalars['Int']['output'];
  readonly dimensions: ReadonlyArray<MetricsDimension>;
  readonly instanceDomain?: Maybe<Scalars['String']['output']>;
  readonly max: Scalars['Float']['output'];
  readonly metricId: Scalars['String']['output'];
  readonly metricType: Scalars['String']['output'];
  readonly min: Scalars['Float']['output'];
  readonly p50?: Maybe<Scalars['Float']['output']>;
  readonly p95?: Maybe<Scalars['Float']['output']>;
  readonly p99?: Maybe<Scalars['Float']['output']>;
  readonly serviceName: Scalars['String']['output'];
  readonly subscriptionCategory: Scalars['String']['output'];
  readonly sum: Scalars['Float']['output'];
  readonly tenantId?: Maybe<Scalars['String']['output']>;
  readonly timestamp: Scalars['Time']['output'];
  readonly totalCostMicrocents?: Maybe<Scalars['Int']['output']>;
  readonly unit?: Maybe<Scalars['String']['output']>;
  readonly userCostMicrocents?: Maybe<Scalars['Int']['output']>;
  readonly userId?: Maybe<Scalars['String']['output']>;
};

export type ModerationAction =
  | 'FLAG'
  | 'HIDE'
  | 'NONE'
  | 'REMOVE'
  | 'REVIEW'
  | 'SHADOW_BAN';

export type ModerationActionCounts = {
  readonly __typename: 'ModerationActionCounts';
  readonly flag: Scalars['Int']['output'];
  readonly hide: Scalars['Int']['output'];
  readonly none: Scalars['Int']['output'];
  readonly remove: Scalars['Int']['output'];
  readonly review: Scalars['Int']['output'];
  readonly shadowBan: Scalars['Int']['output'];
};

export type ModerationAlert = {
  readonly __typename: 'ModerationAlert';
  readonly confidence: Scalars['Float']['output'];
  readonly content: Object;
  readonly handled: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly matchedText: Scalars['String']['output'];
  readonly pattern?: Maybe<ModerationPattern>;
  readonly severity: ModerationSeverity;
  readonly suggestedAction: ModerationAction;
  readonly timestamp: Scalars['Time']['output'];
};

export type ModerationDashboard = {
  readonly __typename: 'ModerationDashboard';
  readonly averageResponseTime: Scalars['Duration']['output'];
  readonly falsePositiveRate: Scalars['Float']['output'];
  readonly pendingReviews: Scalars['Int']['output'];
  readonly recentDecisions: ReadonlyArray<ModerationDecision>;
  readonly threatTrends: ReadonlyArray<ThreatTrend>;
  readonly topPatterns: ReadonlyArray<PatternStats>;
};

export type ModerationDecision = {
  readonly __typename: 'ModerationDecision';
  readonly confidence: Scalars['Float']['output'];
  readonly decision: Scalars['String']['output'];
  readonly evidence: ReadonlyArray<Scalars['String']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly object: Object;
  readonly reviewers: ReadonlyArray<Actor>;
  readonly timestamp: Scalars['Time']['output'];
};

export type ModerationEffectiveness = {
  readonly __typename: 'ModerationEffectiveness';
  readonly f1Score: Scalars['Float']['output'];
  readonly falsePositives: Scalars['Int']['output'];
  readonly matchCount: Scalars['Int']['output'];
  readonly missedCount: Scalars['Int']['output'];
  readonly patternId: Scalars['ID']['output'];
  readonly precision: Scalars['Float']['output'];
  readonly recall: Scalars['Float']['output'];
  readonly truePositives: Scalars['Int']['output'];
};

export type ModerationFilter = {
  readonly assignedTo?: InputMaybe<Scalars['ID']['input']>;
  readonly priority?: InputMaybe<Priority>;
  readonly severity?: InputMaybe<ModerationSeverity>;
  readonly unhandled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ModerationItem = {
  readonly __typename: 'ModerationItem';
  readonly assignedTo?: Maybe<Actor>;
  readonly content: Object;
  readonly deadline: Scalars['Time']['output'];
  readonly id: Scalars['ID']['output'];
  readonly priority: Priority;
  readonly reportCount: Scalars['Int']['output'];
  readonly severity: ModerationSeverity;
};

export type ModerationLabel = {
  readonly __typename: 'ModerationLabel';
  readonly confidence: Scalars['Float']['output'];
  readonly name: Scalars['String']['output'];
  readonly parentName?: Maybe<Scalars['String']['output']>;
};

export type ModerationPattern = {
  readonly __typename: 'ModerationPattern';
  readonly active: Scalars['Boolean']['output'];
  readonly createdAt: Scalars['Time']['output'];
  readonly createdBy: Actor;
  readonly falsePositiveRate: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly matchCount: Scalars['Int']['output'];
  readonly pattern: Scalars['String']['output'];
  readonly severity: ModerationSeverity;
  readonly type: PatternType;
  readonly updatedAt: Scalars['Time']['output'];
};

export type ModerationPatternInput = {
  readonly active?: InputMaybe<Scalars['Boolean']['input']>;
  readonly pattern: Scalars['String']['input'];
  readonly severity: ModerationSeverity;
  readonly type: PatternType;
};

export type ModerationPeriod =
  | 'DAILY'
  | 'HOURLY'
  | 'MONTHLY'
  | 'WEEKLY';

export type ModerationSampleInput = {
  readonly confidence: Scalars['Float']['input'];
  readonly label: Scalars['String']['input'];
  readonly objectId: Scalars['ID']['input'];
  readonly objectType: Scalars['String']['input'];
};

export type ModerationSeverity =
  | 'CRITICAL'
  | 'HIGH'
  | 'INFO'
  | 'LOW'
  | 'MEDIUM';

export type ModeratorStats = {
  readonly __typename: 'ModeratorStats';
  readonly accuracy: Scalars['Float']['output'];
  readonly avgResponseTime: Scalars['Duration']['output'];
  readonly categories: ReadonlyArray<CategoryStats>;
  readonly decisionsCount: Scalars['Int']['output'];
  readonly moderatorId: Scalars['ID']['output'];
  readonly overturned: Scalars['Int']['output'];
  readonly period: TimePeriod;
};

export type Mutation = {
  readonly __typename: 'Mutation';
  readonly acknowledgeSeverance: AcknowledgePayload;
  readonly addAccountsToList: List;
  readonly addCommunityNote: CommunityNotePayload;
  readonly attemptReconnection: ReconnectionPayload;
  readonly blockActor: Relationship;
  readonly bookmarkObject: Object;
  readonly cancelScheduledStatus: Scalars['Boolean']['output'];
  readonly clearNotifications: Scalars['Boolean']['output'];
  readonly createEmoji: CustomEmoji;
  readonly createList: List;
  readonly createModerationPattern: ModerationPattern;
  readonly createNote: CreateNotePayload;
  readonly createQuoteNote: CreateNotePayload;
  readonly deleteConversation: Scalars['Boolean']['output'];
  readonly deleteEmoji: Scalars['Boolean']['output'];
  readonly deleteList: Scalars['Boolean']['output'];
  readonly deleteModerationPattern: Scalars['Boolean']['output'];
  readonly deleteObject: Scalars['Boolean']['output'];
  readonly deletePushSubscription: Scalars['Boolean']['output'];
  readonly dismissNotification: Scalars['Boolean']['output'];
  readonly flagObject: FlagPayload;
  readonly followActor: Activity;
  readonly followHashtag: HashtagFollowPayload;
  readonly likeObject: Activity;
  readonly markConversationAsRead: Conversation;
  readonly muteActor: Relationship;
  readonly muteHashtag: MuteHashtagPayload;
  readonly optimizeFederationCosts: CostOptimizationResult;
  readonly pauseFederation: FederationManagementStatus;
  readonly pinObject: Object;
  readonly preloadMedia: ReadonlyArray<MediaStream>;
  readonly registerPushSubscription: PushSubscription;
  readonly removeAccountsFromList: List;
  readonly reportStreamingQuality: StreamingQualityReport;
  readonly requestAIAnalysis: AiAnalysisRequest;
  readonly requestStreamingUrl: MediaStream;
  readonly resumeFederation: FederationManagementStatus;
  readonly scheduleStatus: ScheduledStatus;
  readonly setFederationLimit: FederationLimit;
  readonly setInstanceBudget: InstanceBudget;
  readonly shareObject: Activity;
  readonly syncMissingReplies: SyncRepliesPayload;
  readonly syncThread: SyncThreadPayload;
  readonly trainModerationModel: TrainingResult;
  readonly unblockActor: Scalars['Boolean']['output'];
  readonly unbookmarkObject: Scalars['Boolean']['output'];
  readonly unfollowActor: Scalars['Boolean']['output'];
  readonly unfollowHashtag: UnfollowHashtagPayload;
  readonly unlikeObject: Scalars['Boolean']['output'];
  readonly unmuteActor: Scalars['Boolean']['output'];
  readonly unpinObject: Scalars['Boolean']['output'];
  readonly unshareObject: Scalars['Boolean']['output'];
  readonly updateEmoji: CustomEmoji;
  readonly updateHashtagNotifications: UpdateHashtagNotificationsPayload;
  readonly updateList: List;
  readonly updateMedia: Media;
  readonly updateModerationPattern: ModerationPattern;
  readonly updateProfile: Actor;
  readonly updatePushSubscription: PushSubscription;
  readonly updateQuotePermissions: UpdateQuotePermissionsPayload;
  readonly updateRelationship: Relationship;
  readonly updateScheduledStatus: ScheduledStatus;
  readonly updateStreamingPreferences: UserPreferences;
  readonly updateTrust: TrustEdge;
  readonly updateUserPreferences: UserPreferences;
  readonly uploadMedia: UploadMediaPayload;
  readonly voteCommunityNote: CommunityNote;
  readonly withdrawFromQuotes: WithdrawQuotePayload;
};


export type MutationAcknowledgeSeveranceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAddAccountsToListArgs = {
  accountIds: ReadonlyArray<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationAddCommunityNoteArgs = {
  input: CommunityNoteInput;
};


export type MutationAttemptReconnectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationBlockActorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationBookmarkObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelScheduledStatusArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateEmojiArgs = {
  input: CreateEmojiInput;
};


export type MutationCreateListArgs = {
  input: CreateListInput;
};


export type MutationCreateModerationPatternArgs = {
  input: ModerationPatternInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreateQuoteNoteArgs = {
  input: CreateQuoteNoteInput;
};


export type MutationDeleteConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEmojiArgs = {
  shortcode: Scalars['String']['input'];
};


export type MutationDeleteListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteModerationPatternArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDismissNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationFlagObjectArgs = {
  input: FlagInput;
};


export type MutationFollowActorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationFollowHashtagArgs = {
  hashtag: Scalars['String']['input'];
  notifyLevel?: InputMaybe<NotificationLevel>;
};


export type MutationLikeObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkConversationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMuteActorArgs = {
  id: Scalars['ID']['input'];
  notifications?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationMuteHashtagArgs = {
  hashtag: Scalars['String']['input'];
  until?: InputMaybe<Scalars['Time']['input']>;
};


export type MutationOptimizeFederationCostsArgs = {
  threshold: Scalars['Float']['input'];
};


export type MutationPauseFederationArgs = {
  domain: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  until?: InputMaybe<Scalars['Time']['input']>;
};


export type MutationPinObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPreloadMediaArgs = {
  mediaIds: ReadonlyArray<Scalars['ID']['input']>;
};


export type MutationRegisterPushSubscriptionArgs = {
  input: RegisterPushSubscriptionInput;
};


export type MutationRemoveAccountsFromListArgs = {
  accountIds: ReadonlyArray<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationReportStreamingQualityArgs = {
  input: StreamingQualityInput;
};


export type MutationRequestAiAnalysisArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  objectId: Scalars['ID']['input'];
  objectType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRequestStreamingUrlArgs = {
  mediaId: Scalars['ID']['input'];
  quality?: InputMaybe<StreamQuality>;
};


export type MutationResumeFederationArgs = {
  domain: Scalars['String']['input'];
};


export type MutationScheduleStatusArgs = {
  input: ScheduleStatusInput;
};


export type MutationSetFederationLimitArgs = {
  domain: Scalars['String']['input'];
  limit: FederationLimitInput;
};


export type MutationSetInstanceBudgetArgs = {
  autoLimit?: InputMaybe<Scalars['Boolean']['input']>;
  domain: Scalars['String']['input'];
  monthlyUSD: Scalars['Float']['input'];
};


export type MutationShareObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSyncMissingRepliesArgs = {
  noteId: Scalars['ID']['input'];
};


export type MutationSyncThreadArgs = {
  depth?: InputMaybe<Scalars['Int']['input']>;
  noteUrl: Scalars['String']['input'];
};


export type MutationTrainModerationModelArgs = {
  options?: InputMaybe<BedrockTrainingOptions>;
  samples: ReadonlyArray<ModerationSampleInput>;
};


export type MutationUnblockActorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnbookmarkObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnfollowActorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnfollowHashtagArgs = {
  hashtag: Scalars['String']['input'];
};


export type MutationUnlikeObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnmuteActorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnpinObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnshareObjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateEmojiArgs = {
  input: UpdateEmojiInput;
  shortcode: Scalars['String']['input'];
};


export type MutationUpdateHashtagNotificationsArgs = {
  hashtag: Scalars['String']['input'];
  settings: HashtagNotificationSettingsInput;
};


export type MutationUpdateListArgs = {
  id: Scalars['ID']['input'];
  input: UpdateListInput;
};


export type MutationUpdateMediaArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMediaInput;
};


export type MutationUpdateModerationPatternArgs = {
  id: Scalars['ID']['input'];
  input: ModerationPatternInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdatePushSubscriptionArgs = {
  input: UpdatePushSubscriptionInput;
};


export type MutationUpdateQuotePermissionsArgs = {
  noteId: Scalars['ID']['input'];
  permission: QuotePermission;
  quoteable: Scalars['Boolean']['input'];
};


export type MutationUpdateRelationshipArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRelationshipInput;
};


export type MutationUpdateScheduledStatusArgs = {
  id: Scalars['ID']['input'];
  input: UpdateScheduledStatusInput;
};


export type MutationUpdateStreamingPreferencesArgs = {
  input: StreamingPreferencesInput;
};


export type MutationUpdateTrustArgs = {
  input: TrustInput;
};


export type MutationUpdateUserPreferencesArgs = {
  input: UpdateUserPreferencesInput;
};


export type MutationUploadMediaArgs = {
  input: UploadMediaInput;
};


export type MutationVoteCommunityNoteArgs = {
  helpful: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationWithdrawFromQuotesArgs = {
  noteId: Scalars['ID']['input'];
};

export type MuteHashtagPayload = {
  readonly __typename: 'MuteHashtagPayload';
  readonly hashtag: Hashtag;
  readonly mutedUntil?: Maybe<Scalars['Time']['output']>;
  readonly success: Scalars['Boolean']['output'];
};

export type Notification = {
  readonly __typename: 'Notification';
  readonly account: Actor;
  readonly createdAt: Scalars['Time']['output'];
  readonly id: Scalars['ID']['output'];
  readonly read: Scalars['Boolean']['output'];
  readonly status?: Maybe<Object>;
  readonly type: Scalars['String']['output'];
};

export type NotificationConnection = {
  readonly __typename: 'NotificationConnection';
  readonly edges: ReadonlyArray<NotificationEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type NotificationEdge = {
  readonly __typename: 'NotificationEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: Notification;
};

export type NotificationFilter = {
  readonly __typename: 'NotificationFilter';
  readonly type: Scalars['String']['output'];
  readonly value: Scalars['String']['output'];
};

export type NotificationFilterInput = {
  readonly type: Scalars['String']['input'];
  readonly value: Scalars['String']['input'];
};

export type NotificationLevel =
  | 'ALL'
  | 'FOLLOWING'
  | 'MUTUALS'
  | 'NONE';

export type NotificationPreferences = {
  readonly __typename: 'NotificationPreferences';
  readonly digest: DigestFrequency;
  readonly email: Scalars['Boolean']['output'];
  readonly inApp: Scalars['Boolean']['output'];
  readonly push: Scalars['Boolean']['output'];
};

export type Object = {
  readonly __typename: 'Object';
  readonly actor: Actor;
  readonly attachments: ReadonlyArray<Attachment>;
  readonly communityNotes: ReadonlyArray<CommunityNote>;
  readonly content: Scalars['String']['output'];
  readonly contentMap: ReadonlyArray<ContentMap>;
  readonly createdAt: Scalars['Time']['output'];
  readonly estimatedCost: Scalars['Int']['output'];
  readonly id: Scalars['ID']['output'];
  readonly inReplyTo?: Maybe<Object>;
  readonly likesCount: Scalars['Int']['output'];
  readonly mentions: ReadonlyArray<Mention>;
  readonly moderationScore?: Maybe<Scalars['Float']['output']>;
  readonly quoteContext?: Maybe<QuoteContext>;
  readonly quoteCount: Scalars['Int']['output'];
  readonly quotePermissions: QuotePermission;
  readonly quoteUrl?: Maybe<Scalars['String']['output']>;
  readonly quoteable: Scalars['Boolean']['output'];
  readonly quotes: QuoteConnection;
  readonly repliesCount: Scalars['Int']['output'];
  readonly sensitive: Scalars['Boolean']['output'];
  readonly sharesCount: Scalars['Int']['output'];
  readonly spoilerText?: Maybe<Scalars['String']['output']>;
  readonly tags: ReadonlyArray<Tag>;
  readonly type: ObjectType;
  readonly updatedAt: Scalars['Time']['output'];
  readonly visibility: Visibility;
};


export type ObjectQuotesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type ObjectConnection = {
  readonly __typename: 'ObjectConnection';
  readonly edges: ReadonlyArray<ObjectEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type ObjectEdge = {
  readonly __typename: 'ObjectEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: Object;
};

export type ObjectExplanation = {
  readonly __typename: 'ObjectExplanation';
  readonly accessPattern: ReadonlyArray<AccessLog>;
  readonly object: Object;
  readonly sizeBytes: Scalars['Int']['output'];
  readonly storageCost: Scalars['Float']['output'];
  readonly storageLocation: Scalars['String']['output'];
};

export type ObjectType =
  | 'ARTICLE'
  | 'EVENT'
  | 'IMAGE'
  | 'NOTE'
  | 'PAGE'
  | 'QUESTION'
  | 'VIDEO';

export type OptimizationAction = {
  readonly __typename: 'OptimizationAction';
  readonly action: Scalars['String']['output'];
  readonly domain: Scalars['String']['output'];
  readonly impact: Scalars['String']['output'];
  readonly savingsUSD: Scalars['Float']['output'];
};

export type PageInfo = {
  readonly __typename: 'PageInfo';
  readonly endCursor?: Maybe<Scalars['Cursor']['output']>;
  readonly hasNextPage: Scalars['Boolean']['output'];
  readonly hasPreviousPage: Scalars['Boolean']['output'];
  readonly startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type PatternStats = {
  readonly __typename: 'PatternStats';
  readonly accuracy: Scalars['Float']['output'];
  readonly lastMatch: Scalars['Time']['output'];
  readonly matchCount: Scalars['Int']['output'];
  readonly pattern: ModerationPattern;
  readonly trend: Trend;
};

export type PatternType =
  | 'KEYWORD'
  | 'ML_PATTERN'
  | 'PHRASE'
  | 'REGEX';

export type PerformanceAlert = {
  readonly __typename: 'PerformanceAlert';
  readonly actualValue: Scalars['Float']['output'];
  readonly id: Scalars['ID']['output'];
  readonly metric: Scalars['String']['output'];
  readonly service: ServiceCategory;
  readonly severity: AlertSeverity;
  readonly threshold: Scalars['Float']['output'];
  readonly timestamp: Scalars['Time']['output'];
};

export type PerformanceReport = {
  readonly __typename: 'PerformanceReport';
  readonly coldStarts: Scalars['Int']['output'];
  readonly errorRate: Scalars['Float']['output'];
  readonly p50Latency: Scalars['Duration']['output'];
  readonly p95Latency: Scalars['Duration']['output'];
  readonly p99Latency: Scalars['Duration']['output'];
  readonly period: TimePeriod;
  readonly service: ServiceCategory;
  readonly throughput: Scalars['Float']['output'];
};

export type Period =
  | 'DAY'
  | 'HOUR'
  | 'MONTH'
  | 'WEEK'
  | 'YEAR';

export type PollParams = {
  readonly __typename: 'PollParams';
  readonly expiresIn: Scalars['Int']['output'];
  readonly hideTotals?: Maybe<Scalars['Boolean']['output']>;
  readonly multiple?: Maybe<Scalars['Boolean']['output']>;
  readonly options: ReadonlyArray<Scalars['String']['output']>;
};

export type PollParamsInput = {
  readonly expiresIn: Scalars['Int']['input'];
  readonly hideTotals?: InputMaybe<Scalars['Boolean']['input']>;
  readonly multiple?: InputMaybe<Scalars['Boolean']['input']>;
  readonly options: ReadonlyArray<Scalars['String']['input']>;
};

export type PortableReputation = {
  readonly __typename: 'PortableReputation';
  readonly actor: Scalars['String']['output'];
  readonly context: ReadonlyArray<Scalars['String']['output']>;
  readonly expiresAt: Scalars['Time']['output'];
  readonly issuedAt: Scalars['Time']['output'];
  readonly issuer: Scalars['String']['output'];
  readonly issuerProof: Scalars['String']['output'];
  readonly reputation: Reputation;
  readonly type: Scalars['String']['output'];
  readonly vouches: ReadonlyArray<Vouch>;
};

export type PostConnection = {
  readonly __typename: 'PostConnection';
  readonly edges: ReadonlyArray<PostEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type PostEdge = {
  readonly __typename: 'PostEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: Object;
};

export type PostingPreferences = {
  readonly __typename: 'PostingPreferences';
  readonly defaultLanguage: Scalars['String']['output'];
  readonly defaultSensitive: Scalars['Boolean']['output'];
  readonly defaultVisibility: Visibility;
};

export type Priority =
  | 'CRITICAL'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM';

export type PrivacyPreferences = {
  readonly __typename: 'PrivacyPreferences';
  readonly defaultVisibility: Visibility;
  readonly indexable: Scalars['Boolean']['output'];
  readonly showOnlineStatus: Scalars['Boolean']['output'];
};

export type ProfileDirectory = {
  readonly __typename: 'ProfileDirectory';
  readonly accounts: ReadonlyArray<Actor>;
  readonly totalCount: Scalars['Int']['output'];
};

export type ProfileFieldInput = {
  readonly name: Scalars['String']['input'];
  readonly value: Scalars['String']['input'];
  readonly verifiedAt?: InputMaybe<Scalars['Time']['input']>;
};

export type PushSubscription = {
  readonly __typename: 'PushSubscription';
  readonly alerts: PushSubscriptionAlerts;
  readonly createdAt?: Maybe<Scalars['Time']['output']>;
  readonly endpoint: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly keys: PushSubscriptionKeys;
  readonly policy: Scalars['String']['output'];
  readonly serverKey?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['Time']['output']>;
};

export type PushSubscriptionAlerts = {
  readonly __typename: 'PushSubscriptionAlerts';
  readonly adminReport: Scalars['Boolean']['output'];
  readonly adminSignUp: Scalars['Boolean']['output'];
  readonly favourite: Scalars['Boolean']['output'];
  readonly follow: Scalars['Boolean']['output'];
  readonly followRequest: Scalars['Boolean']['output'];
  readonly mention: Scalars['Boolean']['output'];
  readonly poll: Scalars['Boolean']['output'];
  readonly reblog: Scalars['Boolean']['output'];
  readonly status: Scalars['Boolean']['output'];
  readonly update: Scalars['Boolean']['output'];
};

export type PushSubscriptionAlertsInput = {
  readonly adminReport?: InputMaybe<Scalars['Boolean']['input']>;
  readonly adminSignUp?: InputMaybe<Scalars['Boolean']['input']>;
  readonly favourite?: InputMaybe<Scalars['Boolean']['input']>;
  readonly follow?: InputMaybe<Scalars['Boolean']['input']>;
  readonly followRequest?: InputMaybe<Scalars['Boolean']['input']>;
  readonly mention?: InputMaybe<Scalars['Boolean']['input']>;
  readonly poll?: InputMaybe<Scalars['Boolean']['input']>;
  readonly reblog?: InputMaybe<Scalars['Boolean']['input']>;
  readonly status?: InputMaybe<Scalars['Boolean']['input']>;
  readonly update?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PushSubscriptionKeys = {
  readonly __typename: 'PushSubscriptionKeys';
  readonly auth: Scalars['String']['output'];
  readonly p256dh: Scalars['String']['output'];
};

export type PushSubscriptionKeysInput = {
  readonly auth: Scalars['String']['input'];
  readonly p256dh: Scalars['String']['input'];
};

export type QualityBandwidth = {
  readonly __typename: 'QualityBandwidth';
  readonly percentage: Scalars['Float']['output'];
  readonly quality: StreamQuality;
  readonly totalGB: Scalars['Float']['output'];
};

export type QualityStats = {
  readonly __typename: 'QualityStats';
  readonly avgBandwidth: Scalars['Float']['output'];
  readonly percentage: Scalars['Float']['output'];
  readonly quality: StreamQuality;
  readonly viewCount: Scalars['Int']['output'];
};

export type Query = {
  readonly __typename: 'Query';
  readonly actor?: Maybe<Actor>;
  readonly affectedRelationships: AffectedRelationshipConnection;
  readonly aiAnalysis?: Maybe<AiAnalysis>;
  readonly aiCapabilities: AiCapabilities;
  readonly aiStats: AiStats;
  readonly bandwidthUsage: BandwidthReport;
  readonly conversation?: Maybe<Conversation>;
  readonly conversations: ReadonlyArray<Conversation>;
  readonly costBreakdown: CostBreakdown;
  readonly costProjections: CostProjection;
  readonly customEmojis: ReadonlyArray<CustomEmoji>;
  readonly explainObject: ObjectExplanation;
  readonly federationCosts: FederationCostConnection;
  readonly federationFlow: FederationFlow;
  readonly federationHealth: ReadonlyArray<FederationManagementStatus>;
  readonly federationLimits: ReadonlyArray<FederationLimit>;
  readonly federationMap: FederationGraph;
  readonly federationStatus: FederationStatus;
  readonly followedHashtags: HashtagConnection;
  readonly followers: ActorListPage;
  readonly following: ActorListPage;
  readonly hashtag?: Maybe<Hashtag>;
  readonly hashtagTimeline: PostConnection;
  readonly infrastructureHealth: InfrastructureStatus;
  readonly instanceBudgets: ReadonlyArray<InstanceBudget>;
  readonly instanceHealthReport: InstanceHealthReport;
  readonly instanceMetrics: InstanceMetrics;
  readonly instanceRelationships: InstanceRelations;
  readonly list?: Maybe<List>;
  readonly listAccounts: ReadonlyArray<Actor>;
  readonly lists: ReadonlyArray<List>;
  readonly media?: Maybe<Media>;
  readonly mediaLibrary: MediaConnection;
  readonly mediaStreamUrl: MediaStream;
  readonly moderationDashboard: ModerationDashboard;
  readonly moderationEffectiveness: ModerationEffectiveness;
  readonly moderationPatterns: ReadonlyArray<ModerationPattern>;
  readonly moderationQueue: ReadonlyArray<ModerationDecision>;
  readonly moderatorActivity: ModeratorStats;
  readonly multiHashtagTimeline: PostConnection;
  readonly notifications: NotificationConnection;
  readonly object?: Maybe<Object>;
  readonly patternEffectiveness: PatternStats;
  readonly performanceMetrics: PerformanceReport;
  readonly popularStreams: StreamConnection;
  readonly profileDirectory: ProfileDirectory;
  readonly pushSubscription?: Maybe<PushSubscription>;
  readonly relationship?: Maybe<Relationship>;
  readonly relationships: ReadonlyArray<Relationship>;
  readonly removeSuggestion: Scalars['Boolean']['output'];
  readonly scheduledStatus?: Maybe<ScheduledStatus>;
  readonly scheduledStatuses: ReadonlyArray<ScheduledStatus>;
  readonly search: SearchResult;
  readonly severedRelationships: SeveredRelationshipConnection;
  readonly slowQueries: ReadonlyArray<QueryPerformance>;
  readonly streamingAnalytics: StreamingAnalytics;
  readonly suggestedHashtags: ReadonlyArray<HashtagSuggestion>;
  readonly suggestions: ReadonlyArray<AccountSuggestion>;
  readonly supportedBitrates: ReadonlyArray<Bitrate>;
  readonly threadContext?: Maybe<ThreadContext>;
  readonly timeline: ObjectConnection;
  readonly trustGraph: ReadonlyArray<TrustEdge>;
  readonly userPreferences: UserPreferences;
};


export type QueryActorArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAffectedRelationshipsArgs = {
  severedRelationshipId: Scalars['ID']['input'];
};


export type QueryAiAnalysisArgs = {
  objectId: Scalars['ID']['input'];
};


export type QueryAiStatsArgs = {
  period: Period;
};


export type QueryBandwidthUsageArgs = {
  period: TimePeriod;
};


export type QueryConversationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryConversationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCostBreakdownArgs = {
  period?: InputMaybe<Period>;
};


export type QueryCostProjectionsArgs = {
  period: Period;
};


export type QueryExplainObjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFederationCostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CostOrderBy>;
};


export type QueryFederationFlowArgs = {
  period: TimePeriod;
};


export type QueryFederationHealthArgs = {
  threshold?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryFederationLimitsArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFederationMapArgs = {
  depth?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFederationStatusArgs = {
  domain: Scalars['String']['input'];
};


export type QueryFollowedHashtagsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFollowersArgs = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};


export type QueryFollowingArgs = {
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};


export type QueryHashtagArgs = {
  name: Scalars['String']['input'];
};


export type QueryHashtagTimelineArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hashtag: Scalars['String']['input'];
};


export type QueryInstanceBudgetsArgs = {
  exceeded?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryInstanceHealthReportArgs = {
  domain: Scalars['String']['input'];
};


export type QueryInstanceRelationshipsArgs = {
  domain: Scalars['String']['input'];
};


export type QueryListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListAccountsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMediaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMediaLibraryArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<MediaFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMediaStreamUrlArgs = {
  mediaId: Scalars['ID']['input'];
};


export type QueryModerationDashboardArgs = {
  filter?: InputMaybe<ModerationFilter>;
};


export type QueryModerationEffectivenessArgs = {
  patternId: Scalars['ID']['input'];
  period: ModerationPeriod;
};


export type QueryModerationPatternsArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  severity?: InputMaybe<ModerationSeverity>;
};


export type QueryModerationQueueArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryModeratorActivityArgs = {
  moderatorId: Scalars['ID']['input'];
  period: TimePeriod;
};


export type QueryMultiHashtagTimelineArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hashtags: ReadonlyArray<Scalars['String']['input']>;
  mode: HashtagMode;
};


export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  excludeTypes?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  types?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
};


export type QueryObjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPatternEffectivenessArgs = {
  patternId: Scalars['ID']['input'];
};


export type QueryPerformanceMetricsArgs = {
  service: ServiceCategory;
};


export type QueryPopularStreamsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};


export type QueryProfileDirectoryArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  filters?: InputMaybe<DirectoryFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRelationshipArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRelationshipsArgs = {
  ids: ReadonlyArray<Scalars['ID']['input']>;
};


export type QueryRemoveSuggestionArgs = {
  accountId: Scalars['ID']['input'];
};


export type QueryScheduledStatusArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScheduledStatusesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySeveredRelationshipsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySlowQueriesArgs = {
  threshold: Scalars['Duration']['input'];
};


export type QueryStreamingAnalyticsArgs = {
  mediaId: Scalars['ID']['input'];
};


export type QuerySuggestedHashtagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySuggestionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySupportedBitratesArgs = {
  mediaId: Scalars['ID']['input'];
};


export type QueryThreadContextArgs = {
  noteId: Scalars['ID']['input'];
};


export type QueryTimelineArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hashtag?: InputMaybe<Scalars['String']['input']>;
  listId?: InputMaybe<Scalars['ID']['input']>;
  type: TimelineType;
};


export type QueryTrustGraphArgs = {
  actorId: Scalars['ID']['input'];
  category?: InputMaybe<TrustCategory>;
};

export type QueryPerformance = {
  readonly __typename: 'QueryPerformance';
  readonly avgDuration: Scalars['Duration']['output'];
  readonly count: Scalars['Int']['output'];
  readonly errorCount: Scalars['Int']['output'];
  readonly lastSeen: Scalars['Time']['output'];
  readonly p95Duration: Scalars['Duration']['output'];
  readonly query: Scalars['String']['output'];
};

export type QueueStatus = {
  readonly __typename: 'QueueStatus';
  readonly depth: Scalars['Int']['output'];
  readonly dlqCount: Scalars['Int']['output'];
  readonly name: Scalars['String']['output'];
  readonly oldestMessage?: Maybe<Scalars['Time']['output']>;
  readonly processingRate: Scalars['Float']['output'];
};

export type QuoteActivityUpdate = {
  readonly __typename: 'QuoteActivityUpdate';
  readonly quote?: Maybe<Object>;
  readonly quoter?: Maybe<Actor>;
  readonly timestamp: Scalars['Time']['output'];
  readonly type: Scalars['String']['output'];
};

export type QuoteConnection = {
  readonly __typename: 'QuoteConnection';
  readonly edges: ReadonlyArray<QuoteEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type QuoteContext = {
  readonly __typename: 'QuoteContext';
  readonly originalAuthor: Actor;
  readonly originalNote?: Maybe<Object>;
  readonly quoteAllowed: Scalars['Boolean']['output'];
  readonly quoteType: QuoteType;
  readonly withdrawn: Scalars['Boolean']['output'];
};

export type QuoteEdge = {
  readonly __typename: 'QuoteEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: Object;
};

export type QuotePermission =
  | 'EVERYONE'
  | 'FOLLOWERS'
  | 'NONE';

export type QuoteType =
  | 'COMMENTARY'
  | 'FULL'
  | 'PARTIAL'
  | 'REACTION';

export type ReadingPreferences = {
  readonly __typename: 'ReadingPreferences';
  readonly autoplayGifs: Scalars['Boolean']['output'];
  readonly expandMedia: ExpandMediaPreference;
  readonly expandSpoilers: Scalars['Boolean']['output'];
  readonly timelineOrder: TimelineOrder;
};

export type ReblogFilter = {
  readonly __typename: 'ReblogFilter';
  readonly enabled: Scalars['Boolean']['output'];
  readonly key: Scalars['String']['output'];
};

export type ReblogFilterInput = {
  readonly enabled: Scalars['Boolean']['input'];
  readonly key: Scalars['String']['input'];
};

export type RecommendationType =
  | 'CONNECTIVITY'
  | 'CONTENT'
  | 'COST'
  | 'PERFORMANCE'
  | 'SECURITY';

export type ReconnectionPayload = {
  readonly __typename: 'ReconnectionPayload';
  readonly errors?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly failed: Scalars['Int']['output'];
  readonly reconnected: Scalars['Int']['output'];
  readonly severedRelationship: SeveredRelationship;
  readonly success: Scalars['Boolean']['output'];
};

export type RegisterPushSubscriptionInput = {
  readonly alerts: PushSubscriptionAlertsInput;
  readonly endpoint: Scalars['String']['input'];
  readonly keys: PushSubscriptionKeysInput;
};

export type Relationship = {
  readonly __typename: 'Relationship';
  readonly blockedBy: Scalars['Boolean']['output'];
  readonly blocking: Scalars['Boolean']['output'];
  readonly domainBlocking: Scalars['Boolean']['output'];
  readonly followedBy: Scalars['Boolean']['output'];
  readonly following: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly languages?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly muting: Scalars['Boolean']['output'];
  readonly mutingNotifications: Scalars['Boolean']['output'];
  readonly note?: Maybe<Scalars['String']['output']>;
  readonly notifying: Scalars['Boolean']['output'];
  readonly requested: Scalars['Boolean']['output'];
  readonly showingReblogs: Scalars['Boolean']['output'];
};

export type RelationshipUpdate = {
  readonly __typename: 'RelationshipUpdate';
  readonly actor: Actor;
  readonly relationship: Relationship;
  readonly timestamp: Scalars['Time']['output'];
  readonly type: Scalars['String']['output'];
};

export type RepliesPolicy =
  | 'FOLLOWED'
  | 'LIST'
  | 'NONE';

export type Reputation = {
  readonly __typename: 'Reputation';
  readonly activityScore: Scalars['Int']['output'];
  readonly actorId: Scalars['ID']['output'];
  readonly calculatedAt: Scalars['Time']['output'];
  readonly communityScore: Scalars['Int']['output'];
  readonly evidence: ReputationEvidence;
  readonly instance: Scalars['String']['output'];
  readonly moderationScore: Scalars['Int']['output'];
  readonly signature?: Maybe<Scalars['String']['output']>;
  readonly totalScore: Scalars['Int']['output'];
  readonly trustScore: Scalars['Int']['output'];
  readonly version: Scalars['String']['output'];
};

export type ReputationEvidence = {
  readonly __typename: 'ReputationEvidence';
  readonly accountAge: Scalars['Int']['output'];
  readonly averageTrustScore: Scalars['Float']['output'];
  readonly totalFollowers: Scalars['Int']['output'];
  readonly totalPosts: Scalars['Int']['output'];
  readonly trustingActors: Scalars['Int']['output'];
  readonly vouchCount: Scalars['Int']['output'];
};

export type ReputationImportResult = {
  readonly __typename: 'ReputationImportResult';
  readonly actorId: Scalars['String']['output'];
  readonly error?: Maybe<Scalars['String']['output']>;
  readonly importedScore: Scalars['Int']['output'];
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly previousScore: Scalars['Int']['output'];
  readonly success: Scalars['Boolean']['output'];
  readonly vouchesImported: Scalars['Int']['output'];
};

export type ReputationVerificationResult = {
  readonly __typename: 'ReputationVerificationResult';
  readonly actorId: Scalars['String']['output'];
  readonly error?: Maybe<Scalars['String']['output']>;
  readonly expiresAt: Scalars['Time']['output'];
  readonly issuedAt: Scalars['Time']['output'];
  readonly issuer: Scalars['String']['output'];
  readonly issuerTrusted: Scalars['Boolean']['output'];
  readonly notExpired: Scalars['Boolean']['output'];
  readonly signatureValid: Scalars['Boolean']['output'];
  readonly valid: Scalars['Boolean']['output'];
};

export type ScheduleStatusInput = {
  readonly inReplyToId?: InputMaybe<Scalars['ID']['input']>;
  readonly language?: InputMaybe<Scalars['String']['input']>;
  readonly mediaIds?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly poll?: InputMaybe<PollParamsInput>;
  readonly scheduledAt: Scalars['Time']['input'];
  readonly sensitive?: InputMaybe<Scalars['Boolean']['input']>;
  readonly spoilerText?: InputMaybe<Scalars['String']['input']>;
  readonly text: Scalars['String']['input'];
  readonly visibility?: InputMaybe<Visibility>;
};

export type ScheduledStatus = {
  readonly __typename: 'ScheduledStatus';
  readonly createdAt: Scalars['Time']['output'];
  readonly id: Scalars['ID']['output'];
  readonly mediaAttachments: ReadonlyArray<Media>;
  readonly params: StatusParams;
  readonly scheduledAt: Scalars['Time']['output'];
};

export type SearchResult = {
  readonly __typename: 'SearchResult';
  readonly accounts: ReadonlyArray<Actor>;
  readonly hashtags: ReadonlyArray<Tag>;
  readonly statuses: ReadonlyArray<Object>;
};

export type Sentiment =
  | 'MIXED'
  | 'NEGATIVE'
  | 'NEUTRAL'
  | 'POSITIVE';

export type SentimentScores = {
  readonly __typename: 'SentimentScores';
  readonly mixed: Scalars['Float']['output'];
  readonly negative: Scalars['Float']['output'];
  readonly neutral: Scalars['Float']['output'];
  readonly positive: Scalars['Float']['output'];
};

export type ServiceCategory =
  | 'FEDERATION_DELIVERY'
  | 'GRAPHQL_API'
  | 'MEDIA_PROCESSOR'
  | 'MODERATION_ENGINE'
  | 'SEARCH_INDEXER'
  | 'STREAMING_SERVICE';

export type ServiceStatus = {
  readonly __typename: 'ServiceStatus';
  readonly errorRate: Scalars['Float']['output'];
  readonly lastRestart?: Maybe<Scalars['Time']['output']>;
  readonly name: Scalars['String']['output'];
  readonly status: HealthStatus;
  readonly type: ServiceCategory;
  readonly uptime: Scalars['Float']['output'];
};

export type SeveranceDetails = {
  readonly __typename: 'SeveranceDetails';
  readonly adminNotes?: Maybe<Scalars['String']['output']>;
  readonly autoDetected: Scalars['Boolean']['output'];
  readonly description: Scalars['String']['output'];
  readonly metadata: ReadonlyArray<Scalars['String']['output']>;
};

export type SeveranceReason =
  | 'DEFEDERATION'
  | 'DOMAIN_BLOCK'
  | 'INSTANCE_DOWN'
  | 'OTHER'
  | 'POLICY_VIOLATION';

export type SeveredRelationship = {
  readonly __typename: 'SeveredRelationship';
  readonly affectedFollowers: Scalars['Int']['output'];
  readonly affectedFollowing: Scalars['Int']['output'];
  readonly details?: Maybe<SeveranceDetails>;
  readonly id: Scalars['ID']['output'];
  readonly localInstance: Scalars['String']['output'];
  readonly reason: SeveranceReason;
  readonly remoteInstance: Scalars['String']['output'];
  readonly reversible: Scalars['Boolean']['output'];
  readonly timestamp: Scalars['Time']['output'];
};

export type SeveredRelationshipConnection = {
  readonly __typename: 'SeveredRelationshipConnection';
  readonly edges: ReadonlyArray<SeveredRelationshipEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type SeveredRelationshipEdge = {
  readonly __typename: 'SeveredRelationshipEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: SeveredRelationship;
};

export type SpamAnalysis = {
  readonly __typename: 'SpamAnalysis';
  readonly accountAgeDays: Scalars['Int']['output'];
  readonly followerRatio: Scalars['Float']['output'];
  readonly interactionRate: Scalars['Float']['output'];
  readonly linkDensity: Scalars['Float']['output'];
  readonly postingVelocity: Scalars['Float']['output'];
  readonly repetitionScore: Scalars['Float']['output'];
  readonly spamIndicators: ReadonlyArray<SpamIndicator>;
  readonly spamScore: Scalars['Float']['output'];
};

export type SpamIndicator = {
  readonly __typename: 'SpamIndicator';
  readonly description: Scalars['String']['output'];
  readonly severity: Scalars['Float']['output'];
  readonly type: Scalars['String']['output'];
};

export type StatusParams = {
  readonly __typename: 'StatusParams';
  readonly inReplyToId?: Maybe<Scalars['ID']['output']>;
  readonly language?: Maybe<Scalars['String']['output']>;
  readonly poll?: Maybe<PollParams>;
  readonly sensitive: Scalars['Boolean']['output'];
  readonly spoilerText?: Maybe<Scalars['String']['output']>;
  readonly text: Scalars['String']['output'];
  readonly visibility: Visibility;
};

export type Stream = {
  readonly __typename: 'Stream';
  readonly createdAt: Scalars['Time']['output'];
  readonly duration: Scalars['Duration']['output'];
  readonly id: Scalars['ID']['output'];
  readonly mediaId: Scalars['ID']['output'];
  readonly popularity: Scalars['Float']['output'];
  readonly quality: StreamQuality;
  readonly thumbnail: Scalars['String']['output'];
  readonly title: Scalars['String']['output'];
  readonly viewCount: Scalars['Int']['output'];
};

export type StreamConnection = {
  readonly __typename: 'StreamConnection';
  readonly edges: ReadonlyArray<StreamEdge>;
  readonly pageInfo: PageInfo;
  readonly totalCount: Scalars['Int']['output'];
};

export type StreamEdge = {
  readonly __typename: 'StreamEdge';
  readonly cursor: Scalars['Cursor']['output'];
  readonly node: Stream;
};

export type StreamQuality =
  | 'AUTO'
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM'
  | 'ULTRA';

export type StreamingAnalytics = {
  readonly __typename: 'StreamingAnalytics';
  readonly averageWatchTime: Scalars['Duration']['output'];
  readonly bufferingEvents: Scalars['Int']['output'];
  readonly completionRate: Scalars['Float']['output'];
  readonly qualityDistribution: ReadonlyArray<QualityStats>;
  readonly totalViews: Scalars['Int']['output'];
  readonly uniqueViewers: Scalars['Int']['output'];
};

export type StreamingPreferences = {
  readonly __typename: 'StreamingPreferences';
  readonly autoQuality: Scalars['Boolean']['output'];
  readonly dataSaver: Scalars['Boolean']['output'];
  readonly defaultQuality: StreamQuality;
  readonly preloadNext: Scalars['Boolean']['output'];
};

export type StreamingPreferencesInput = {
  readonly autoQuality?: InputMaybe<Scalars['Boolean']['input']>;
  readonly dataSaver?: InputMaybe<Scalars['Boolean']['input']>;
  readonly defaultQuality?: InputMaybe<StreamQuality>;
  readonly preloadNext?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StreamingQualityInput = {
  readonly bufferingEvents: Scalars['Int']['input'];
  readonly mediaId: Scalars['ID']['input'];
  readonly quality: StreamQuality;
  readonly watchTime: Scalars['Int']['input'];
};

export type StreamingQualityReport = {
  readonly __typename: 'StreamingQualityReport';
  readonly mediaId: Scalars['ID']['output'];
  readonly quality: StreamQuality;
  readonly reportId: Scalars['ID']['output'];
  readonly success: Scalars['Boolean']['output'];
};

export type Subscription = {
  readonly __typename: 'Subscription';
  readonly activityStream: Activity;
  readonly aiAnalysisUpdates: AiAnalysis;
  readonly budgetAlerts: BudgetAlert;
  readonly conversationUpdates: Conversation;
  readonly costAlerts: CostAlert;
  readonly costUpdates: CostUpdate;
  readonly federationHealthUpdates: FederationHealthUpdate;
  readonly hashtagActivity: HashtagActivityUpdate;
  readonly infrastructureEvent: InfrastructureEvent;
  readonly listUpdates: ListUpdate;
  readonly metricsUpdates: MetricsUpdate;
  readonly moderationAlerts: ModerationAlert;
  readonly moderationEvents: ModerationDecision;
  readonly moderationQueueUpdate: ModerationItem;
  readonly notificationStream: Notification;
  readonly performanceAlert: PerformanceAlert;
  readonly quoteActivity: QuoteActivityUpdate;
  readonly relationshipUpdates: RelationshipUpdate;
  readonly threatIntelligence: ThreatAlert;
  readonly timelineUpdates: Object;
  readonly trustUpdates: TrustEdge;
};


export type SubscriptionActivityStreamArgs = {
  types?: InputMaybe<ReadonlyArray<ActivityType>>;
};


export type SubscriptionAiAnalysisUpdatesArgs = {
  objectId?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionBudgetAlertsArgs = {
  domain?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionCostAlertsArgs = {
  thresholdUSD: Scalars['Float']['input'];
};


export type SubscriptionCostUpdatesArgs = {
  threshold?: InputMaybe<Scalars['Int']['input']>;
};


export type SubscriptionFederationHealthUpdatesArgs = {
  domain?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionHashtagActivityArgs = {
  hashtags: ReadonlyArray<Scalars['String']['input']>;
};


export type SubscriptionListUpdatesArgs = {
  listId: Scalars['ID']['input'];
};


export type SubscriptionMetricsUpdatesArgs = {
  categories?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  services?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  threshold?: InputMaybe<Scalars['Float']['input']>;
};


export type SubscriptionModerationAlertsArgs = {
  severity?: InputMaybe<ModerationSeverity>;
};


export type SubscriptionModerationEventsArgs = {
  actorId?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionModerationQueueUpdateArgs = {
  priority?: InputMaybe<Priority>;
};


export type SubscriptionNotificationStreamArgs = {
  types?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
};


export type SubscriptionPerformanceAlertArgs = {
  severity: AlertSeverity;
};


export type SubscriptionQuoteActivityArgs = {
  noteId: Scalars['ID']['input'];
};


export type SubscriptionRelationshipUpdatesArgs = {
  actorId?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionTimelineUpdatesArgs = {
  listId?: InputMaybe<Scalars['ID']['input']>;
  type: TimelineType;
};


export type SubscriptionTrustUpdatesArgs = {
  actorId: Scalars['ID']['input'];
};

export type SuggestionSource =
  | 'GLOBAL'
  | 'PAST_INTERACTIONS'
  | 'SIMILAR_PROFILES'
  | 'STAFF';

export type SyncRepliesPayload = {
  readonly __typename: 'SyncRepliesPayload';
  readonly success: Scalars['Boolean']['output'];
  readonly syncedReplies: Scalars['Int']['output'];
  readonly thread: ThreadContext;
};

export type SyncStatus =
  | 'COMPLETE'
  | 'FAILED'
  | 'PARTIAL'
  | 'SYNCING';

export type SyncThreadPayload = {
  readonly __typename: 'SyncThreadPayload';
  readonly errors?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
  readonly success: Scalars['Boolean']['output'];
  readonly syncedPosts: Scalars['Int']['output'];
  readonly thread: ThreadContext;
};

export type Tag = {
  readonly __typename: 'Tag';
  readonly name: Scalars['String']['output'];
  readonly url: Scalars['String']['output'];
};

export type TextAnalysis = {
  readonly __typename: 'TextAnalysis';
  readonly containsPII: Scalars['Boolean']['output'];
  readonly dominantLanguage: Scalars['String']['output'];
  readonly entities: ReadonlyArray<Entity>;
  readonly keyPhrases: ReadonlyArray<Scalars['String']['output']>;
  readonly sentiment: Sentiment;
  readonly sentimentScores: SentimentScores;
  readonly toxicityLabels: ReadonlyArray<Scalars['String']['output']>;
  readonly toxicityScore: Scalars['Float']['output'];
};

export type TextAnalysisCapabilities = {
  readonly __typename: 'TextAnalysisCapabilities';
  readonly entityExtraction: Scalars['Boolean']['output'];
  readonly languageDetection: Scalars['Boolean']['output'];
  readonly piiDetection: Scalars['Boolean']['output'];
  readonly sentimentAnalysis: Scalars['Boolean']['output'];
  readonly spamDetection: Scalars['Boolean']['output'];
  readonly toxicityDetection: Scalars['Boolean']['output'];
};

export type ThreadContext = {
  readonly __typename: 'ThreadContext';
  readonly lastActivity: Scalars['Time']['output'];
  readonly missingPosts: Scalars['Int']['output'];
  readonly participantCount: Scalars['Int']['output'];
  readonly replyCount: Scalars['Int']['output'];
  readonly rootNote: Object;
  readonly syncStatus: SyncStatus;
};

export type ThreatAlert = {
  readonly __typename: 'ThreatAlert';
  readonly affectedInstances: ReadonlyArray<Scalars['String']['output']>;
  readonly description: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly mitigationSteps: ReadonlyArray<Scalars['String']['output']>;
  readonly severity: ModerationSeverity;
  readonly source: Scalars['String']['output'];
  readonly timestamp: Scalars['Time']['output'];
  readonly type: Scalars['String']['output'];
};

export type ThreatTrend = {
  readonly __typename: 'ThreatTrend';
  readonly change: Scalars['Float']['output'];
  readonly count: Scalars['Int']['output'];
  readonly instances: ReadonlyArray<Scalars['String']['output']>;
  readonly severity: ModerationSeverity;
  readonly type: Scalars['String']['output'];
};

export type TimePeriod =
  | 'DAY'
  | 'HOUR'
  | 'MONTH'
  | 'WEEK';

export type TimelineOrder =
  | 'NEWEST'
  | 'OLDEST';

export type TimelineType =
  | 'DIRECT'
  | 'HASHTAG'
  | 'HOME'
  | 'LIST'
  | 'LOCAL'
  | 'PUBLIC';

export type TrainingResult = {
  readonly __typename: 'TrainingResult';
  readonly accuracy: Scalars['Float']['output'];
  readonly datasetS3Key: Scalars['String']['output'];
  readonly f1Score: Scalars['Float']['output'];
  readonly improvements: ReadonlyArray<Scalars['String']['output']>;
  readonly jobId: Scalars['String']['output'];
  readonly jobName: Scalars['String']['output'];
  readonly modelVersion: Scalars['String']['output'];
  readonly precision: Scalars['Float']['output'];
  readonly recall: Scalars['Float']['output'];
  readonly samplesUsed: Scalars['Int']['output'];
  readonly status: Scalars['String']['output'];
  readonly success: Scalars['Boolean']['output'];
  readonly trainingTime: Scalars['Int']['output'];
};

export type Trend =
  | 'DECREASING'
  | 'INCREASING'
  | 'STABLE';

export type TrustCategory =
  | 'BEHAVIOR'
  | 'CONTENT'
  | 'TECHNICAL';

export type TrustEdge = {
  readonly __typename: 'TrustEdge';
  readonly category: TrustCategory;
  readonly from: Actor;
  readonly score: Scalars['Float']['output'];
  readonly to: Actor;
  readonly updatedAt: Scalars['Time']['output'];
};

export type TrustInput = {
  readonly category: TrustCategory;
  readonly score: Scalars['Float']['input'];
  readonly targetActorId: Scalars['ID']['input'];
};

export type UnfollowHashtagPayload = {
  readonly __typename: 'UnfollowHashtagPayload';
  readonly hashtag: Hashtag;
  readonly success: Scalars['Boolean']['output'];
};

export type UpdateEmojiInput = {
  readonly category?: InputMaybe<Scalars['String']['input']>;
  readonly visibleInPicker?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateHashtagNotificationsPayload = {
  readonly __typename: 'UpdateHashtagNotificationsPayload';
  readonly hashtag: Hashtag;
  readonly settings: HashtagNotificationSettings;
  readonly success: Scalars['Boolean']['output'];
};

export type UpdateListInput = {
  readonly exclusive?: InputMaybe<Scalars['Boolean']['input']>;
  readonly repliesPolicy?: InputMaybe<RepliesPolicy>;
  readonly title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMediaInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly focus?: InputMaybe<FocusInput>;
};

export type UpdateProfileInput = {
  readonly avatar?: InputMaybe<Scalars['String']['input']>;
  readonly bio?: InputMaybe<Scalars['String']['input']>;
  readonly bot?: InputMaybe<Scalars['Boolean']['input']>;
  readonly discoverable?: InputMaybe<Scalars['Boolean']['input']>;
  readonly displayName?: InputMaybe<Scalars['String']['input']>;
  readonly fields?: InputMaybe<ReadonlyArray<ProfileFieldInput>>;
  readonly header?: InputMaybe<Scalars['String']['input']>;
  readonly language?: InputMaybe<Scalars['String']['input']>;
  readonly locked?: InputMaybe<Scalars['Boolean']['input']>;
  readonly noIndex?: InputMaybe<Scalars['Boolean']['input']>;
  readonly sensitive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdatePushSubscriptionInput = {
  readonly alerts: PushSubscriptionAlertsInput;
};

export type UpdateQuotePermissionsPayload = {
  readonly __typename: 'UpdateQuotePermissionsPayload';
  readonly affectedQuotes: Scalars['Int']['output'];
  readonly note: Object;
  readonly success: Scalars['Boolean']['output'];
};

export type UpdateRelationshipInput = {
  readonly languages?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly note?: InputMaybe<Scalars['String']['input']>;
  readonly notify?: InputMaybe<Scalars['Boolean']['input']>;
  readonly showReblogs?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateScheduledStatusInput = {
  readonly scheduledAt: Scalars['Time']['input'];
};

export type UpdateUserPreferencesInput = {
  readonly autoplayGifs?: InputMaybe<Scalars['Boolean']['input']>;
  readonly defaultMediaSensitive?: InputMaybe<Scalars['Boolean']['input']>;
  readonly defaultPostingVisibility?: InputMaybe<Visibility>;
  readonly expandMedia?: InputMaybe<ExpandMediaPreference>;
  readonly expandSpoilers?: InputMaybe<Scalars['Boolean']['input']>;
  readonly language?: InputMaybe<Scalars['String']['input']>;
  readonly personalizedSearchEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  readonly preferredTimelineOrder?: InputMaybe<TimelineOrder>;
  readonly reblogFilters?: InputMaybe<ReadonlyArray<ReblogFilterInput>>;
  readonly searchSuggestionsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  readonly showFollowCounts?: InputMaybe<Scalars['Boolean']['input']>;
  readonly streaming?: InputMaybe<StreamingPreferencesInput>;
};

export type UploadMediaInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly file: Scalars['Upload']['input'];
  readonly filename?: InputMaybe<Scalars['String']['input']>;
  readonly focus?: InputMaybe<FocusInput>;
  readonly mediaType?: InputMaybe<MediaCategory>;
  readonly sensitive?: InputMaybe<Scalars['Boolean']['input']>;
  readonly spoilerText?: InputMaybe<Scalars['String']['input']>;
};

export type UploadMediaPayload = {
  readonly __typename: 'UploadMediaPayload';
  readonly media: Media;
  readonly uploadId: Scalars['ID']['output'];
  readonly warnings?: Maybe<ReadonlyArray<Scalars['String']['output']>>;
};

export type UserPreferences = {
  readonly __typename: 'UserPreferences';
  readonly actorId: Scalars['ID']['output'];
  readonly discovery: DiscoveryPreferences;
  readonly notifications: NotificationPreferences;
  readonly posting: PostingPreferences;
  readonly privacy: PrivacyPreferences;
  readonly reading: ReadingPreferences;
  readonly reblogFilters: ReadonlyArray<ReblogFilter>;
  readonly streaming: StreamingPreferences;
};

export type Visibility =
  | 'DIRECT'
  | 'FOLLOWERS'
  | 'PUBLIC'
  | 'UNLISTED';

export type Vouch = {
  readonly __typename: 'Vouch';
  readonly active: Scalars['Boolean']['output'];
  readonly confidence: Scalars['Float']['output'];
  readonly context: Scalars['String']['output'];
  readonly createdAt: Scalars['Time']['output'];
  readonly expiresAt: Scalars['Time']['output'];
  readonly from: Actor;
  readonly id: Scalars['ID']['output'];
  readonly revoked: Scalars['Boolean']['output'];
  readonly revokedAt?: Maybe<Scalars['Time']['output']>;
  readonly to: Actor;
  readonly voucherReputation: Scalars['Int']['output'];
};

export type WithdrawQuotePayload = {
  readonly __typename: 'WithdrawQuotePayload';
  readonly note: Object;
  readonly success: Scalars['Boolean']['output'];
  readonly withdrawnCount: Scalars['Int']['output'];
};

export type ActorByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ActorByIdQuery = { readonly __typename: 'Query', readonly actor?: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } | null | undefined };

export type ActorByUsernameQueryVariables = Exact<{
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type ActorByUsernameQuery = { readonly __typename: 'Query', readonly actor?: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } | null | undefined };

export type RequestAiAnalysisMutationVariables = Exact<{
  objectId: Scalars['ID']['input'];
  objectType?: InputMaybe<Scalars['String']['input']>;
  force?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type RequestAiAnalysisMutation = { readonly __typename: 'Mutation', readonly requestAIAnalysis: { readonly __typename: 'AIAnalysisRequest', readonly message: string, readonly objectId: string, readonly estimatedTime: string } };

export type AiAnalysisQueryVariables = Exact<{
  objectId: Scalars['ID']['input'];
}>;


export type AiAnalysisQuery = { readonly __typename: 'Query', readonly aiAnalysis?: { readonly __typename: 'AIAnalysis', readonly id: string, readonly objectId: string, readonly objectType: string, readonly overallRisk: number, readonly moderationAction: ModerationAction, readonly confidence: number, readonly analyzedAt: string, readonly textAnalysis?: { readonly __typename: 'TextAnalysis', readonly sentiment: Sentiment, readonly toxicityScore: number, readonly toxicityLabels: ReadonlyArray<string>, readonly containsPII: boolean, readonly dominantLanguage: string, readonly keyPhrases: ReadonlyArray<string>, readonly sentimentScores: { readonly __typename: 'SentimentScores', readonly positive: number, readonly negative: number, readonly neutral: number, readonly mixed: number }, readonly entities: ReadonlyArray<{ readonly __typename: 'Entity', readonly text: string, readonly type: string, readonly score: number }> } | null | undefined, readonly imageAnalysis?: { readonly __typename: 'ImageAnalysis', readonly isNSFW: boolean, readonly nsfwConfidence: number, readonly violenceScore: number, readonly weaponsDetected: boolean, readonly detectedText: ReadonlyArray<string>, readonly textToxicity: number, readonly deepfakeScore: number, readonly moderationLabels: ReadonlyArray<{ readonly __typename: 'ModerationLabel', readonly name: string, readonly confidence: number, readonly parentName?: string | null | undefined }>, readonly celebrityFaces: ReadonlyArray<{ readonly __typename: 'Celebrity', readonly name: string, readonly confidence: number }> } | null | undefined, readonly aiDetection?: { readonly __typename: 'AIDetection', readonly aiGeneratedProbability: number, readonly generationModel?: string | null | undefined, readonly patternConsistency: number, readonly styleDeviation: number, readonly semanticCoherence: number, readonly suspiciousPatterns: ReadonlyArray<string> } | null | undefined, readonly spamAnalysis?: { readonly __typename: 'SpamAnalysis', readonly spamScore: number, readonly postingVelocity: number, readonly repetitionScore: number, readonly linkDensity: number, readonly followerRatio: number, readonly interactionRate: number, readonly accountAgeDays: number, readonly spamIndicators: ReadonlyArray<{ readonly __typename: 'SpamIndicator', readonly type: string, readonly description: string, readonly severity: number }> } | null | undefined } | null | undefined };

export type AiStatsQueryVariables = Exact<{
  period: Period;
}>;


export type AiStatsQuery = { readonly __typename: 'Query', readonly aiStats: { readonly __typename: 'AIStats', readonly period: string, readonly totalAnalyses: number, readonly toxicContent: number, readonly spamDetected: number, readonly aiGenerated: number, readonly nsfwContent: number, readonly piiDetected: number, readonly toxicityRate: number, readonly spamRate: number, readonly aiContentRate: number, readonly nsfwRate: number, readonly moderationActions: { readonly __typename: 'ModerationActionCounts', readonly flag: number, readonly hide: number, readonly remove: number, readonly review: number, readonly shadowBan: number } } };

export type AiCapabilitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type AiCapabilitiesQuery = { readonly __typename: 'Query', readonly aiCapabilities: { readonly __typename: 'AICapabilities', readonly moderationActions: ReadonlyArray<string>, readonly textAnalysis: { readonly __typename: 'TextAnalysisCapabilities', readonly sentimentAnalysis: boolean, readonly toxicityDetection: boolean, readonly spamDetection: boolean, readonly piiDetection: boolean, readonly entityExtraction: boolean, readonly languageDetection: boolean }, readonly imageAnalysis: { readonly __typename: 'ImageAnalysisCapabilities', readonly nsfwDetection: boolean, readonly violenceDetection: boolean, readonly textExtraction: boolean, readonly celebrityRecognition: boolean, readonly deepfakeDetection: boolean }, readonly aiDetection: { readonly __typename: 'AIDetectionCapabilities', readonly aiGeneratedContent: boolean, readonly patternAnalysis: boolean, readonly styleConsistency: boolean }, readonly costPerAnalysis: { readonly __typename: 'CostBreakdown', readonly period: Period, readonly totalCost: number, readonly dynamoDBCost: number, readonly s3StorageCost: number, readonly lambdaCost: number, readonly dataTransferCost: number, readonly breakdown: ReadonlyArray<{ readonly __typename: 'CostItem', readonly operation: string, readonly count: number, readonly cost: number }> } } };

export type ConversationsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type ConversationsQuery = { readonly __typename: 'Query', readonly conversations: ReadonlyArray<{ readonly __typename: 'Conversation', readonly id: string, readonly unread: boolean, readonly createdAt: string, readonly updatedAt: string, readonly accounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }>, readonly lastStatus?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined }> };

export type ConversationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConversationQuery = { readonly __typename: 'Query', readonly conversation?: { readonly __typename: 'Conversation', readonly id: string, readonly unread: boolean, readonly createdAt: string, readonly updatedAt: string, readonly accounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }>, readonly lastStatus?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined } | null | undefined };

export type MarkConversationReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkConversationReadMutation = { readonly __typename: 'Mutation', readonly markConversationAsRead: { readonly __typename: 'Conversation', readonly id: string, readonly unread: boolean, readonly updatedAt: string } };

export type DeleteConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteConversationMutation = { readonly __typename: 'Mutation', readonly deleteConversation: boolean };

export type CostBreakdownQueryVariables = Exact<{
  period?: InputMaybe<Period>;
}>;


export type CostBreakdownQuery = { readonly __typename: 'Query', readonly costBreakdown: { readonly __typename: 'CostBreakdown', readonly period: Period, readonly totalCost: number, readonly dynamoDBCost: number, readonly s3StorageCost: number, readonly lambdaCost: number, readonly dataTransferCost: number, readonly breakdown: ReadonlyArray<{ readonly __typename: 'CostItem', readonly operation: string, readonly count: number, readonly cost: number }> } };

export type InstanceBudgetsQueryVariables = Exact<{ [key: string]: never; }>;


export type InstanceBudgetsQuery = { readonly __typename: 'Query', readonly instanceBudgets: ReadonlyArray<{ readonly __typename: 'InstanceBudget', readonly domain: string, readonly monthlyBudgetUSD: number, readonly currentSpendUSD: number, readonly remainingBudgetUSD: number, readonly projectedOverspend?: number | null | undefined, readonly alertThreshold: number, readonly autoLimit: boolean, readonly period: string }> };

export type SetInstanceBudgetMutationVariables = Exact<{
  domain: Scalars['String']['input'];
  monthlyUSD: Scalars['Float']['input'];
  autoLimit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SetInstanceBudgetMutation = { readonly __typename: 'Mutation', readonly setInstanceBudget: { readonly __typename: 'InstanceBudget', readonly domain: string, readonly monthlyBudgetUSD: number, readonly currentSpendUSD: number, readonly remainingBudgetUSD: number, readonly projectedOverspend?: number | null | undefined, readonly alertThreshold: number, readonly autoLimit: boolean, readonly period: string } };

export type OptimizeFederationCostsMutationVariables = Exact<{
  threshold: Scalars['Float']['input'];
}>;


export type OptimizeFederationCostsMutation = { readonly __typename: 'Mutation', readonly optimizeFederationCosts: { readonly __typename: 'CostOptimizationResult', readonly optimized: number, readonly savedMonthlyUSD: number, readonly actions: ReadonlyArray<{ readonly __typename: 'OptimizationAction', readonly domain: string, readonly action: string, readonly savingsUSD: number, readonly impact: string }> } };

export type FederationLimitsQueryVariables = Exact<{ [key: string]: never; }>;


export type FederationLimitsQuery = { readonly __typename: 'Query', readonly federationLimits: ReadonlyArray<{ readonly __typename: 'FederationLimit', readonly domain: string, readonly ingressLimitMB: number, readonly egressLimitMB: number, readonly requestsPerMinute: number, readonly monthlyBudgetUSD?: number | null | undefined, readonly active: boolean, readonly createdAt: string, readonly updatedAt: string }> };

export type SetFederationLimitMutationVariables = Exact<{
  domain: Scalars['String']['input'];
  limit: FederationLimitInput;
}>;


export type SetFederationLimitMutation = { readonly __typename: 'Mutation', readonly setFederationLimit: { readonly __typename: 'FederationLimit', readonly domain: string, readonly ingressLimitMB: number, readonly egressLimitMB: number, readonly requestsPerMinute: number, readonly monthlyBudgetUSD?: number | null | undefined, readonly active: boolean, readonly createdAt: string, readonly updatedAt: string } };

export type SyncThreadMutationVariables = Exact<{
  noteUrl: Scalars['String']['input'];
  depth?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SyncThreadMutation = { readonly __typename: 'Mutation', readonly syncThread: { readonly __typename: 'SyncThreadPayload', readonly success: boolean, readonly syncedPosts: number, readonly errors?: ReadonlyArray<string> | null | undefined, readonly thread: { readonly __typename: 'ThreadContext', readonly replyCount: number, readonly participantCount: number, readonly lastActivity: string, readonly missingPosts: number, readonly syncStatus: SyncStatus, readonly rootNote: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } } } };

export type SyncMissingRepliesMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type SyncMissingRepliesMutation = { readonly __typename: 'Mutation', readonly syncMissingReplies: { readonly __typename: 'SyncRepliesPayload', readonly success: boolean, readonly syncedReplies: number, readonly thread: { readonly __typename: 'ThreadContext', readonly replyCount: number, readonly participantCount: number, readonly lastActivity: string, readonly missingPosts: number, readonly syncStatus: SyncStatus, readonly rootNote: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } } } };

export type ThreadContextQueryVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type ThreadContextQuery = { readonly __typename: 'Query', readonly threadContext?: { readonly __typename: 'ThreadContext', readonly replyCount: number, readonly participantCount: number, readonly lastActivity: string, readonly missingPosts: number, readonly syncStatus: SyncStatus, readonly rootNote: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } } | null | undefined };

export type SeveredRelationshipsQueryVariables = Exact<{
  instance?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type SeveredRelationshipsQuery = { readonly __typename: 'Query', readonly severedRelationships: { readonly __typename: 'SeveredRelationshipConnection', readonly totalCount: number, readonly edges: ReadonlyArray<{ readonly __typename: 'SeveredRelationshipEdge', readonly cursor: string, readonly node: { readonly __typename: 'SeveredRelationship', readonly id: string, readonly localInstance: string, readonly remoteInstance: string, readonly reason: SeveranceReason, readonly affectedFollowers: number, readonly affectedFollowing: number, readonly timestamp: string, readonly reversible: boolean, readonly details?: { readonly __typename: 'SeveranceDetails', readonly description: string, readonly metadata: ReadonlyArray<string>, readonly adminNotes?: string | null | undefined, readonly autoDetected: boolean } | null | undefined } }>, readonly pageInfo: { readonly __typename: 'PageInfo', readonly hasNextPage: boolean, readonly hasPreviousPage: boolean, readonly startCursor?: string | null | undefined, readonly endCursor?: string | null | undefined } } };

export type AcknowledgeSeveranceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AcknowledgeSeveranceMutation = { readonly __typename: 'Mutation', readonly acknowledgeSeverance: { readonly __typename: 'AcknowledgePayload', readonly success: boolean, readonly acknowledged: boolean, readonly severedRelationship: { readonly __typename: 'SeveredRelationship', readonly id: string, readonly localInstance: string, readonly remoteInstance: string } } };

export type AttemptReconnectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AttemptReconnectionMutation = { readonly __typename: 'Mutation', readonly attemptReconnection: { readonly __typename: 'ReconnectionPayload', readonly success: boolean, readonly reconnected: number, readonly failed: number, readonly errors?: ReadonlyArray<string> | null | undefined, readonly severedRelationship: { readonly __typename: 'SeveredRelationship', readonly id: string, readonly localInstance: string, readonly remoteInstance: string } } };

export type FederationHealthQueryVariables = Exact<{
  threshold?: InputMaybe<Scalars['Float']['input']>;
}>;


export type FederationHealthQuery = { readonly __typename: 'Query', readonly federationHealth: ReadonlyArray<{ readonly __typename: 'FederationManagementStatus', readonly domain: string, readonly status: FederationState, readonly reason?: string | null | undefined, readonly pausedUntil?: string | null | undefined }> };

export type FederationStatusQueryVariables = Exact<{
  domain: Scalars['String']['input'];
}>;


export type FederationStatusQuery = { readonly __typename: 'Query', readonly federationStatus: { readonly __typename: 'FederationStatus', readonly domain: string, readonly reachable: boolean, readonly lastContact?: string | null | undefined, readonly sharedInbox?: string | null | undefined, readonly publicKey?: string | null | undefined, readonly software?: string | null | undefined, readonly version?: string | null | undefined } };

export type PauseFederationMutationVariables = Exact<{
  domain: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  until?: InputMaybe<Scalars['Time']['input']>;
}>;


export type PauseFederationMutation = { readonly __typename: 'Mutation', readonly pauseFederation: { readonly __typename: 'FederationManagementStatus', readonly domain: string, readonly status: FederationState, readonly reason?: string | null | undefined, readonly pausedUntil?: string | null | undefined, readonly limits?: { readonly __typename: 'FederationLimit', readonly domain: string, readonly ingressLimitMB: number, readonly egressLimitMB: number, readonly requestsPerMinute: number, readonly monthlyBudgetUSD?: number | null | undefined, readonly active: boolean, readonly createdAt: string, readonly updatedAt: string } | null | undefined } };

export type ResumeFederationMutationVariables = Exact<{
  domain: Scalars['String']['input'];
}>;


export type ResumeFederationMutation = { readonly __typename: 'Mutation', readonly resumeFederation: { readonly __typename: 'FederationManagementStatus', readonly domain: string, readonly status: FederationState, readonly reason?: string | null | undefined, readonly pausedUntil?: string | null | undefined, readonly limits?: { readonly __typename: 'FederationLimit', readonly domain: string, readonly ingressLimitMB: number, readonly egressLimitMB: number, readonly requestsPerMinute: number, readonly monthlyBudgetUSD?: number | null | undefined, readonly active: boolean, readonly createdAt: string, readonly updatedAt: string } | null | undefined } };

export type FieldFieldsFragment = { readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined };

export type ActorSummaryFragment = { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> };

export type AttachmentFieldsFragment = { readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined };

export type TagFieldsFragment = { readonly __typename: 'Tag', readonly name: string, readonly url: string };

export type MentionFieldsFragment = { readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string };

export type CommunityNoteFieldsFragment = { readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } };

export type QuoteContextFieldsFragment = { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined };

export type ObjectFieldsFragment = { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined };

export type ActivityFieldsFragment = { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined };

export type CostUpdateFieldsFragment = { readonly __typename: 'CostUpdate', readonly operationCost: number, readonly dailyTotal: number, readonly monthlyProjection: number };

export type FollowHashtagMutationVariables = Exact<{
  hashtag: Scalars['String']['input'];
  notifyLevel?: InputMaybe<NotificationLevel>;
}>;


export type FollowHashtagMutation = { readonly __typename: 'Mutation', readonly followHashtag: { readonly __typename: 'HashtagFollowPayload', readonly success: boolean, readonly hashtag: { readonly __typename: 'Hashtag', readonly name: string, readonly url: string, readonly isFollowing: boolean, readonly followedAt?: string | null | undefined, readonly notificationSettings?: { readonly __typename: 'HashtagNotificationSettings', readonly level: NotificationLevel, readonly muted: boolean, readonly mutedUntil?: string | null | undefined } | null | undefined } } };

export type UnfollowHashtagMutationVariables = Exact<{
  hashtag: Scalars['String']['input'];
}>;


export type UnfollowHashtagMutation = { readonly __typename: 'Mutation', readonly unfollowHashtag: { readonly __typename: 'UnfollowHashtagPayload', readonly success: boolean, readonly hashtag: { readonly __typename: 'Hashtag', readonly name: string, readonly url: string } } };

export type MuteHashtagMutationVariables = Exact<{
  hashtag: Scalars['String']['input'];
  until?: InputMaybe<Scalars['Time']['input']>;
}>;


export type MuteHashtagMutation = { readonly __typename: 'Mutation', readonly muteHashtag: { readonly __typename: 'MuteHashtagPayload', readonly success: boolean, readonly mutedUntil?: string | null | undefined, readonly hashtag: { readonly __typename: 'Hashtag', readonly name: string, readonly notificationSettings?: { readonly __typename: 'HashtagNotificationSettings', readonly muted: boolean, readonly mutedUntil?: string | null | undefined } | null | undefined } } };

export type FollowedHashtagsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type FollowedHashtagsQuery = { readonly __typename: 'Query', readonly followedHashtags: { readonly __typename: 'HashtagConnection', readonly totalCount: number, readonly edges: ReadonlyArray<{ readonly __typename: 'HashtagEdge', readonly cursor: string, readonly node: { readonly __typename: 'Hashtag', readonly name: string, readonly url: string, readonly isFollowing: boolean, readonly followedAt?: string | null | undefined, readonly notificationSettings?: { readonly __typename: 'HashtagNotificationSettings', readonly level: NotificationLevel, readonly muted: boolean, readonly mutedUntil?: string | null | undefined } | null | undefined } }>, readonly pageInfo: { readonly __typename: 'PageInfo', readonly hasNextPage: boolean, readonly hasPreviousPage: boolean, readonly startCursor?: string | null | undefined, readonly endCursor?: string | null | undefined } } };

export type ListsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListsQuery = { readonly __typename: 'Query', readonly lists: ReadonlyArray<{ readonly __typename: 'List', readonly id: string, readonly title: string, readonly repliesPolicy: RepliesPolicy, readonly exclusive: boolean, readonly accountCount: number, readonly createdAt: string, readonly updatedAt: string }> };

export type ListQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListQuery = { readonly __typename: 'Query', readonly list?: { readonly __typename: 'List', readonly id: string, readonly title: string, readonly repliesPolicy: RepliesPolicy, readonly exclusive: boolean, readonly accountCount: number, readonly createdAt: string, readonly updatedAt: string, readonly accounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }> } | null | undefined };

export type ListAccountsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListAccountsQuery = { readonly __typename: 'Query', readonly listAccounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }> };

export type CreateListMutationVariables = Exact<{
  input: CreateListInput;
}>;


export type CreateListMutation = { readonly __typename: 'Mutation', readonly createList: { readonly __typename: 'List', readonly id: string, readonly title: string, readonly repliesPolicy: RepliesPolicy, readonly exclusive: boolean, readonly accountCount: number, readonly createdAt: string, readonly updatedAt: string } };

export type UpdateListMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateListInput;
}>;


export type UpdateListMutation = { readonly __typename: 'Mutation', readonly updateList: { readonly __typename: 'List', readonly id: string, readonly title: string, readonly repliesPolicy: RepliesPolicy, readonly exclusive: boolean, readonly accountCount: number, readonly createdAt: string, readonly updatedAt: string } };

export type DeleteListMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteListMutation = { readonly __typename: 'Mutation', readonly deleteList: boolean };

export type AddAccountsToListMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  accountIds: ReadonlyArray<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type AddAccountsToListMutation = { readonly __typename: 'Mutation', readonly addAccountsToList: { readonly __typename: 'List', readonly id: string, readonly accountCount: number, readonly accounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }> } };

export type RemoveAccountsFromListMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  accountIds: ReadonlyArray<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type RemoveAccountsFromListMutation = { readonly __typename: 'Mutation', readonly removeAccountsFromList: { readonly __typename: 'List', readonly id: string, readonly accountCount: number, readonly accounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }> } };

export type MediaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MediaQuery = { readonly __typename: 'Query', readonly media?: { readonly __typename: 'Media', readonly id: string, readonly type: MediaType, readonly url: string, readonly previewUrl?: string | null | undefined, readonly description?: string | null | undefined, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly mediaCategory: MediaCategory, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined, readonly size: number, readonly mimeType: string, readonly createdAt: string, readonly uploadedBy: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined };

export type UpdateMediaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMediaInput;
}>;


export type UpdateMediaMutation = { readonly __typename: 'Mutation', readonly updateMedia: { readonly __typename: 'Media', readonly id: string, readonly description?: string | null | undefined, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly mediaCategory: MediaCategory, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined, readonly url: string, readonly previewUrl?: string | null | undefined } };

export type UploadMediaMutationVariables = Exact<{
  input: UploadMediaInput;
}>;


export type UploadMediaMutation = { readonly __typename: 'Mutation', readonly uploadMedia: { readonly __typename: 'UploadMediaPayload', readonly uploadId: string, readonly warnings?: ReadonlyArray<string> | null | undefined, readonly media: { readonly __typename: 'Media', readonly id: string, readonly type: MediaType, readonly url: string, readonly previewUrl?: string | null | undefined, readonly description?: string | null | undefined, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly mediaCategory: MediaCategory, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined, readonly size: number, readonly mimeType: string, readonly createdAt: string, readonly uploadedBy: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } } };

export type AddCommunityNoteMutationVariables = Exact<{
  input: CommunityNoteInput;
}>;


export type AddCommunityNoteMutation = { readonly __typename: 'Mutation', readonly addCommunityNote: { readonly __typename: 'CommunityNotePayload', readonly note: { readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }, readonly object: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } } };

export type VoteCommunityNoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  helpful: Scalars['Boolean']['input'];
}>;


export type VoteCommunityNoteMutation = { readonly __typename: 'Mutation', readonly voteCommunityNote: { readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } };

export type CommunityNotesByObjectQueryVariables = Exact<{
  objectId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type CommunityNotesByObjectQuery = { readonly __typename: 'Query', readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined };

export type FlagObjectMutationVariables = Exact<{
  input: FlagInput;
}>;


export type FlagObjectMutation = { readonly __typename: 'Mutation', readonly flagObject: { readonly __typename: 'FlagPayload', readonly moderationId: string, readonly queued: boolean } };

export type CreateModerationPatternMutationVariables = Exact<{
  input: ModerationPatternInput;
}>;


export type CreateModerationPatternMutation = { readonly __typename: 'Mutation', readonly createModerationPattern: { readonly __typename: 'ModerationPattern', readonly id: string, readonly pattern: string, readonly type: PatternType, readonly severity: ModerationSeverity, readonly matchCount: number, readonly falsePositiveRate: number, readonly createdAt: string, readonly updatedAt: string, readonly active: boolean, readonly createdBy: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } };

export type DeleteModerationPatternMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteModerationPatternMutation = { readonly __typename: 'Mutation', readonly deleteModerationPattern: boolean };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { readonly __typename: 'Mutation', readonly createNote: { readonly __typename: 'CreateNotePayload', readonly object: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }, readonly activity: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined }, readonly cost: { readonly __typename: 'CostUpdate', readonly operationCost: number, readonly dailyTotal: number, readonly monthlyProjection: number } } };

export type CreateQuoteNoteMutationVariables = Exact<{
  input: CreateQuoteNoteInput;
}>;


export type CreateQuoteNoteMutation = { readonly __typename: 'Mutation', readonly createQuoteNote: { readonly __typename: 'CreateNotePayload', readonly object: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }, readonly activity: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined }, readonly cost: { readonly __typename: 'CostUpdate', readonly operationCost: number, readonly dailyTotal: number, readonly monthlyProjection: number } } };

export type WithdrawFromQuotesMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type WithdrawFromQuotesMutation = { readonly __typename: 'Mutation', readonly withdrawFromQuotes: { readonly __typename: 'WithdrawQuotePayload', readonly success: boolean, readonly withdrawnCount: number, readonly note: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } } };

export type UpdateQuotePermissionsMutationVariables = Exact<{
  noteId: Scalars['ID']['input'];
  quoteable: Scalars['Boolean']['input'];
  permission: QuotePermission;
}>;


export type UpdateQuotePermissionsMutation = { readonly __typename: 'Mutation', readonly updateQuotePermissions: { readonly __typename: 'UpdateQuotePermissionsPayload', readonly success: boolean, readonly affectedQuotes: number, readonly note: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } } };

export type DeleteObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteObjectMutation = { readonly __typename: 'Mutation', readonly deleteObject: boolean };

export type LikeObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LikeObjectMutation = { readonly __typename: 'Mutation', readonly likeObject: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } };

export type UnlikeObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnlikeObjectMutation = { readonly __typename: 'Mutation', readonly unlikeObject: boolean };

export type ShareObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ShareObjectMutation = { readonly __typename: 'Mutation', readonly shareObject: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } };

export type UnshareObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnshareObjectMutation = { readonly __typename: 'Mutation', readonly unshareObject: boolean };

export type BookmarkObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BookmarkObjectMutation = { readonly __typename: 'Mutation', readonly bookmarkObject: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } };

export type UnbookmarkObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnbookmarkObjectMutation = { readonly __typename: 'Mutation', readonly unbookmarkObject: boolean };

export type PinObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PinObjectMutation = { readonly __typename: 'Mutation', readonly pinObject: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } };

export type UnpinObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnpinObjectMutation = { readonly __typename: 'Mutation', readonly unpinObject: boolean };

export type ObjectWithQuotesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type ObjectWithQuotesQuery = { readonly __typename: 'Query', readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly quotes: { readonly __typename: 'QuoteConnection', readonly totalCount: number, readonly edges: ReadonlyArray<{ readonly __typename: 'QuoteEdge', readonly cursor: string, readonly node: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } }>, readonly pageInfo: { readonly __typename: 'PageInfo', readonly hasNextPage: boolean, readonly hasPreviousPage: boolean, readonly startCursor?: string | null | undefined, readonly endCursor?: string | null | undefined } }, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined };

export type NotificationsQueryVariables = Exact<{
  types?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  excludeTypes?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type NotificationsQuery = { readonly __typename: 'Query', readonly notifications: { readonly __typename: 'NotificationConnection', readonly totalCount: number, readonly edges: ReadonlyArray<{ readonly __typename: 'NotificationEdge', readonly cursor: string, readonly node: { readonly __typename: 'Notification', readonly id: string, readonly type: string, readonly read: boolean, readonly createdAt: string, readonly account: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly status?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined } }>, readonly pageInfo: { readonly __typename: 'PageInfo', readonly hasNextPage: boolean, readonly hasPreviousPage: boolean, readonly startCursor?: string | null | undefined, readonly endCursor?: string | null | undefined } } };

export type DismissNotificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DismissNotificationMutation = { readonly __typename: 'Mutation', readonly dismissNotification: boolean };

export type ClearNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearNotificationsMutation = { readonly __typename: 'Mutation', readonly clearNotifications: boolean };

export type ObjectByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ObjectByIdQuery = { readonly __typename: 'Query', readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined };

export type UserPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserPreferencesQuery = { readonly __typename: 'Query', readonly userPreferences: { readonly __typename: 'UserPreferences', readonly actorId: string, readonly posting: { readonly __typename: 'PostingPreferences', readonly defaultVisibility: Visibility, readonly defaultSensitive: boolean, readonly defaultLanguage: string }, readonly reading: { readonly __typename: 'ReadingPreferences', readonly expandSpoilers: boolean, readonly expandMedia: ExpandMediaPreference, readonly autoplayGifs: boolean, readonly timelineOrder: TimelineOrder }, readonly discovery: { readonly __typename: 'DiscoveryPreferences', readonly showFollowCounts: boolean, readonly searchSuggestionsEnabled: boolean, readonly personalizedSearchEnabled: boolean }, readonly streaming: { readonly __typename: 'StreamingPreferences', readonly defaultQuality: StreamQuality, readonly autoQuality: boolean, readonly preloadNext: boolean, readonly dataSaver: boolean }, readonly notifications: { readonly __typename: 'NotificationPreferences', readonly email: boolean, readonly push: boolean, readonly inApp: boolean, readonly digest: DigestFrequency }, readonly privacy: { readonly __typename: 'PrivacyPreferences', readonly defaultVisibility: Visibility, readonly indexable: boolean, readonly showOnlineStatus: boolean }, readonly reblogFilters: ReadonlyArray<{ readonly __typename: 'ReblogFilter', readonly key: string, readonly enabled: boolean }> } };

export type UpdateUserPreferencesMutationVariables = Exact<{
  input: UpdateUserPreferencesInput;
}>;


export type UpdateUserPreferencesMutation = { readonly __typename: 'Mutation', readonly updateUserPreferences: { readonly __typename: 'UserPreferences', readonly actorId: string, readonly posting: { readonly __typename: 'PostingPreferences', readonly defaultVisibility: Visibility, readonly defaultSensitive: boolean, readonly defaultLanguage: string }, readonly reading: { readonly __typename: 'ReadingPreferences', readonly expandSpoilers: boolean, readonly expandMedia: ExpandMediaPreference, readonly autoplayGifs: boolean, readonly timelineOrder: TimelineOrder }, readonly discovery: { readonly __typename: 'DiscoveryPreferences', readonly showFollowCounts: boolean, readonly searchSuggestionsEnabled: boolean, readonly personalizedSearchEnabled: boolean }, readonly streaming: { readonly __typename: 'StreamingPreferences', readonly defaultQuality: StreamQuality, readonly autoQuality: boolean, readonly preloadNext: boolean, readonly dataSaver: boolean }, readonly notifications: { readonly __typename: 'NotificationPreferences', readonly email: boolean, readonly push: boolean, readonly inApp: boolean, readonly digest: DigestFrequency }, readonly privacy: { readonly __typename: 'PrivacyPreferences', readonly defaultVisibility: Visibility, readonly indexable: boolean, readonly showOnlineStatus: boolean }, readonly reblogFilters: ReadonlyArray<{ readonly __typename: 'ReblogFilter', readonly key: string, readonly enabled: boolean }> } };

export type UpdateStreamingPreferencesMutationVariables = Exact<{
  input: StreamingPreferencesInput;
}>;


export type UpdateStreamingPreferencesMutation = { readonly __typename: 'Mutation', readonly updateStreamingPreferences: { readonly __typename: 'UserPreferences', readonly actorId: string, readonly streaming: { readonly __typename: 'StreamingPreferences', readonly defaultQuality: StreamQuality, readonly autoQuality: boolean, readonly preloadNext: boolean, readonly dataSaver: boolean } } };

export type FollowersQueryVariables = Exact<{
  username: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type FollowersQuery = { readonly __typename: 'Query', readonly followers: { readonly __typename: 'ActorListPage', readonly nextCursor?: string | null | undefined, readonly totalCount: number, readonly actors: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }> } };

export type FollowingQueryVariables = Exact<{
  username: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type FollowingQuery = { readonly __typename: 'Query', readonly following: { readonly __typename: 'ActorListPage', readonly nextCursor?: string | null | undefined, readonly totalCount: number, readonly actors: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }> } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { readonly __typename: 'Mutation', readonly updateProfile: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } };

export type PushSubscriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type PushSubscriptionQuery = { readonly __typename: 'Query', readonly pushSubscription?: { readonly __typename: 'PushSubscription', readonly id: string, readonly endpoint: string, readonly policy: string, readonly serverKey?: string | null | undefined, readonly createdAt?: string | null | undefined, readonly updatedAt?: string | null | undefined, readonly keys: { readonly __typename: 'PushSubscriptionKeys', readonly auth: string, readonly p256dh: string }, readonly alerts: { readonly __typename: 'PushSubscriptionAlerts', readonly follow: boolean, readonly favourite: boolean, readonly reblog: boolean, readonly mention: boolean, readonly poll: boolean, readonly followRequest: boolean, readonly status: boolean, readonly update: boolean, readonly adminSignUp: boolean, readonly adminReport: boolean } } | null | undefined };

export type RegisterPushSubscriptionMutationVariables = Exact<{
  input: RegisterPushSubscriptionInput;
}>;


export type RegisterPushSubscriptionMutation = { readonly __typename: 'Mutation', readonly registerPushSubscription: { readonly __typename: 'PushSubscription', readonly id: string, readonly endpoint: string, readonly policy: string, readonly serverKey?: string | null | undefined, readonly createdAt?: string | null | undefined, readonly updatedAt?: string | null | undefined, readonly keys: { readonly __typename: 'PushSubscriptionKeys', readonly auth: string, readonly p256dh: string }, readonly alerts: { readonly __typename: 'PushSubscriptionAlerts', readonly follow: boolean, readonly favourite: boolean, readonly reblog: boolean, readonly mention: boolean, readonly poll: boolean, readonly followRequest: boolean, readonly status: boolean, readonly update: boolean, readonly adminSignUp: boolean, readonly adminReport: boolean } } };

export type UpdatePushSubscriptionMutationVariables = Exact<{
  input: UpdatePushSubscriptionInput;
}>;


export type UpdatePushSubscriptionMutation = { readonly __typename: 'Mutation', readonly updatePushSubscription: { readonly __typename: 'PushSubscription', readonly id: string, readonly endpoint: string, readonly policy: string, readonly serverKey?: string | null | undefined, readonly createdAt?: string | null | undefined, readonly updatedAt?: string | null | undefined, readonly keys: { readonly __typename: 'PushSubscriptionKeys', readonly auth: string, readonly p256dh: string }, readonly alerts: { readonly __typename: 'PushSubscriptionAlerts', readonly follow: boolean, readonly favourite: boolean, readonly reblog: boolean, readonly mention: boolean, readonly poll: boolean, readonly followRequest: boolean, readonly status: boolean, readonly update: boolean, readonly adminSignUp: boolean, readonly adminReport: boolean } } };

export type DeletePushSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type DeletePushSubscriptionMutation = { readonly __typename: 'Mutation', readonly deletePushSubscription: boolean };

export type RelationshipQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RelationshipQuery = { readonly __typename: 'Query', readonly relationship?: { readonly __typename: 'Relationship', readonly id: string, readonly following: boolean, readonly followedBy: boolean, readonly blocking: boolean, readonly blockedBy: boolean, readonly muting: boolean, readonly mutingNotifications: boolean, readonly requested: boolean, readonly domainBlocking: boolean, readonly showingReblogs: boolean, readonly notifying: boolean, readonly languages?: ReadonlyArray<string> | null | undefined, readonly note?: string | null | undefined } | null | undefined };

export type RelationshipsQueryVariables = Exact<{
  ids: ReadonlyArray<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type RelationshipsQuery = { readonly __typename: 'Query', readonly relationships: ReadonlyArray<{ readonly __typename: 'Relationship', readonly id: string, readonly following: boolean, readonly followedBy: boolean, readonly blocking: boolean, readonly blockedBy: boolean, readonly muting: boolean, readonly mutingNotifications: boolean, readonly requested: boolean, readonly domainBlocking: boolean, readonly showingReblogs: boolean, readonly notifying: boolean, readonly languages?: ReadonlyArray<string> | null | undefined, readonly note?: string | null | undefined }> };

export type FollowActorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FollowActorMutation = { readonly __typename: 'Mutation', readonly followActor: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } };

export type UnfollowActorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnfollowActorMutation = { readonly __typename: 'Mutation', readonly unfollowActor: boolean };

export type BlockActorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BlockActorMutation = { readonly __typename: 'Mutation', readonly blockActor: { readonly __typename: 'Relationship', readonly id: string, readonly following: boolean, readonly followedBy: boolean, readonly blocking: boolean, readonly blockedBy: boolean, readonly muting: boolean, readonly mutingNotifications: boolean, readonly requested: boolean, readonly domainBlocking: boolean, readonly showingReblogs: boolean, readonly notifying: boolean, readonly languages?: ReadonlyArray<string> | null | undefined, readonly note?: string | null | undefined } };

export type UnblockActorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnblockActorMutation = { readonly __typename: 'Mutation', readonly unblockActor: boolean };

export type MuteActorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  notifications?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type MuteActorMutation = { readonly __typename: 'Mutation', readonly muteActor: { readonly __typename: 'Relationship', readonly id: string, readonly following: boolean, readonly followedBy: boolean, readonly blocking: boolean, readonly blockedBy: boolean, readonly muting: boolean, readonly mutingNotifications: boolean, readonly requested: boolean, readonly domainBlocking: boolean, readonly showingReblogs: boolean, readonly notifying: boolean, readonly languages?: ReadonlyArray<string> | null | undefined, readonly note?: string | null | undefined } };

export type UnmuteActorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnmuteActorMutation = { readonly __typename: 'Mutation', readonly unmuteActor: boolean };

export type UpdateRelationshipMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateRelationshipInput;
}>;


export type UpdateRelationshipMutation = { readonly __typename: 'Mutation', readonly updateRelationship: { readonly __typename: 'Relationship', readonly id: string, readonly following: boolean, readonly followedBy: boolean, readonly blocking: boolean, readonly blockedBy: boolean, readonly muting: boolean, readonly mutingNotifications: boolean, readonly requested: boolean, readonly domainBlocking: boolean, readonly showingReblogs: boolean, readonly notifying: boolean, readonly languages?: ReadonlyArray<string> | null | undefined, readonly note?: string | null | undefined } };

export type SearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
}>;


export type SearchQuery = { readonly __typename: 'Query', readonly search: { readonly __typename: 'SearchResult', readonly accounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }>, readonly statuses: ReadonlyArray<{ readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }>, readonly hashtags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }> } };

export type TimelineUpdatesSubscriptionVariables = Exact<{
  type: TimelineType;
  listId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type TimelineUpdatesSubscription = { readonly __typename: 'Subscription', readonly timelineUpdates: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } };

export type NotificationStreamSubscriptionVariables = Exact<{
  types?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type NotificationStreamSubscription = { readonly __typename: 'Subscription', readonly notificationStream: { readonly __typename: 'Notification', readonly id: string, readonly type: string, readonly read: boolean, readonly createdAt: string, readonly account: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly status?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined } };

export type ConversationUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ConversationUpdatesSubscription = { readonly __typename: 'Subscription', readonly conversationUpdates: { readonly __typename: 'Conversation', readonly id: string, readonly unread: boolean, readonly createdAt: string, readonly updatedAt: string, readonly accounts: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }>, readonly lastStatus?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined } };

export type ListUpdatesSubscriptionVariables = Exact<{
  listId: Scalars['ID']['input'];
}>;


export type ListUpdatesSubscription = { readonly __typename: 'Subscription', readonly listUpdates: { readonly __typename: 'ListUpdate', readonly type: string, readonly timestamp: string, readonly list: { readonly __typename: 'List', readonly id: string, readonly title: string, readonly repliesPolicy: RepliesPolicy, readonly exclusive: boolean, readonly accountCount: number }, readonly account?: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } | null | undefined } };

export type QuoteActivitySubscriptionVariables = Exact<{
  noteId: Scalars['ID']['input'];
}>;


export type QuoteActivitySubscription = { readonly __typename: 'Subscription', readonly quoteActivity: { readonly __typename: 'QuoteActivityUpdate', readonly type: string, readonly timestamp: string, readonly quote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined, readonly quoter?: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } | null | undefined } };

export type HashtagActivitySubscriptionVariables = Exact<{
  hashtags: ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type HashtagActivitySubscription = { readonly __typename: 'Subscription', readonly hashtagActivity: { readonly __typename: 'HashtagActivityUpdate', readonly hashtag: string, readonly timestamp: string, readonly post: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } };

export type ActivityStreamSubscriptionVariables = Exact<{
  types?: InputMaybe<ReadonlyArray<ActivityType> | ActivityType>;
}>;


export type ActivityStreamSubscription = { readonly __typename: 'Subscription', readonly activityStream: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } | null | undefined } };

export type RelationshipUpdatesSubscriptionVariables = Exact<{
  actorId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type RelationshipUpdatesSubscription = { readonly __typename: 'Subscription', readonly relationshipUpdates: { readonly __typename: 'RelationshipUpdate', readonly type: string, readonly timestamp: string, readonly relationship: { readonly __typename: 'Relationship', readonly id: string, readonly following: boolean, readonly followedBy: boolean, readonly blocking: boolean, readonly blockedBy: boolean, readonly muting: boolean, readonly mutingNotifications: boolean, readonly requested: boolean, readonly domainBlocking: boolean, readonly showingReblogs: boolean, readonly notifying: boolean, readonly languages?: ReadonlyArray<string> | null | undefined, readonly note?: string | null | undefined }, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } };

export type CostUpdatesSubscriptionVariables = Exact<{
  threshold?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CostUpdatesSubscription = { readonly __typename: 'Subscription', readonly costUpdates: { readonly __typename: 'CostUpdate', readonly operationCost: number, readonly dailyTotal: number, readonly monthlyProjection: number } };

export type ModerationEventsSubscriptionVariables = Exact<{
  actorId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ModerationEventsSubscription = { readonly __typename: 'Subscription', readonly moderationEvents: { readonly __typename: 'ModerationDecision', readonly id: string, readonly decision: string, readonly confidence: number, readonly evidence: ReadonlyArray<string>, readonly timestamp: string, readonly object: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }, readonly reviewers: ReadonlyArray<{ readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }> } };

export type TrustUpdatesSubscriptionVariables = Exact<{
  actorId: Scalars['ID']['input'];
}>;


export type TrustUpdatesSubscription = { readonly __typename: 'Subscription', readonly trustUpdates: { readonly __typename: 'TrustEdge', readonly category: TrustCategory, readonly score: number, readonly updatedAt: string, readonly from: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly to: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } };

export type AiAnalysisUpdatesSubscriptionVariables = Exact<{
  objectId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AiAnalysisUpdatesSubscription = { readonly __typename: 'Subscription', readonly aiAnalysisUpdates: { readonly __typename: 'AIAnalysis', readonly id: string, readonly objectId: string, readonly objectType: string, readonly overallRisk: number, readonly moderationAction: ModerationAction, readonly confidence: number, readonly analyzedAt: string, readonly textAnalysis?: { readonly __typename: 'TextAnalysis', readonly sentiment: Sentiment, readonly toxicityScore: number, readonly toxicityLabels: ReadonlyArray<string>, readonly containsPII: boolean, readonly dominantLanguage: string, readonly keyPhrases: ReadonlyArray<string>, readonly sentimentScores: { readonly __typename: 'SentimentScores', readonly positive: number, readonly negative: number, readonly neutral: number, readonly mixed: number }, readonly entities: ReadonlyArray<{ readonly __typename: 'Entity', readonly type: string, readonly text: string, readonly score: number }> } | null | undefined, readonly imageAnalysis?: { readonly __typename: 'ImageAnalysis', readonly isNSFW: boolean, readonly nsfwConfidence: number, readonly violenceScore: number, readonly weaponsDetected: boolean, readonly detectedText: ReadonlyArray<string>, readonly textToxicity: number, readonly deepfakeScore: number, readonly moderationLabels: ReadonlyArray<{ readonly __typename: 'ModerationLabel', readonly name: string, readonly confidence: number, readonly parentName?: string | null | undefined }>, readonly celebrityFaces: ReadonlyArray<{ readonly __typename: 'Celebrity', readonly name: string, readonly confidence: number, readonly urls: ReadonlyArray<string> }> } | null | undefined, readonly aiDetection?: { readonly __typename: 'AIDetection', readonly aiGeneratedProbability: number, readonly generationModel?: string | null | undefined, readonly patternConsistency: number, readonly styleDeviation: number, readonly semanticCoherence: number, readonly suspiciousPatterns: ReadonlyArray<string> } | null | undefined, readonly spamAnalysis?: { readonly __typename: 'SpamAnalysis', readonly spamScore: number, readonly postingVelocity: number, readonly repetitionScore: number, readonly linkDensity: number, readonly followerRatio: number, readonly interactionRate: number, readonly accountAgeDays: number, readonly spamIndicators: ReadonlyArray<{ readonly __typename: 'SpamIndicator', readonly type: string, readonly description: string, readonly severity: number }> } | null | undefined } };

export type MetricsUpdatesSubscriptionVariables = Exact<{
  categories?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  services?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  threshold?: InputMaybe<Scalars['Float']['input']>;
}>;


export type MetricsUpdatesSubscription = { readonly __typename: 'Subscription', readonly metricsUpdates: { readonly __typename: 'MetricsUpdate', readonly metricId: string, readonly serviceName: string, readonly metricType: string, readonly subscriptionCategory: string, readonly aggregationLevel: string, readonly timestamp: string, readonly count: number, readonly sum: number, readonly min: number, readonly max: number, readonly average: number, readonly p50?: number | null | undefined, readonly p95?: number | null | undefined, readonly p99?: number | null | undefined, readonly unit?: string | null | undefined, readonly userCostMicrocents?: number | null | undefined, readonly totalCostMicrocents?: number | null | undefined, readonly userId?: string | null | undefined, readonly tenantId?: string | null | undefined, readonly instanceDomain?: string | null | undefined, readonly dimensions: ReadonlyArray<{ readonly __typename: 'MetricsDimension', readonly key: string, readonly value: string }> } };

export type ModerationAlertsSubscriptionVariables = Exact<{
  severity?: InputMaybe<ModerationSeverity>;
}>;


export type ModerationAlertsSubscription = { readonly __typename: 'Subscription', readonly moderationAlerts: { readonly __typename: 'ModerationAlert', readonly id: string, readonly severity: ModerationSeverity, readonly matchedText: string, readonly confidence: number, readonly suggestedAction: ModerationAction, readonly timestamp: string, readonly handled: boolean, readonly pattern?: { readonly __typename: 'ModerationPattern', readonly id: string, readonly pattern: string, readonly type: PatternType, readonly severity: ModerationSeverity, readonly matchCount: number, readonly falsePositiveRate: number, readonly createdAt: string, readonly updatedAt: string, readonly active: boolean, readonly createdBy: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined, readonly content: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } } };

export type CostAlertsSubscriptionVariables = Exact<{
  thresholdUSD: Scalars['Float']['input'];
}>;


export type CostAlertsSubscription = { readonly __typename: 'Subscription', readonly costAlerts: { readonly __typename: 'CostAlert', readonly id: string, readonly type: string, readonly amount: number, readonly threshold: number, readonly domain?: string | null | undefined, readonly message: string, readonly timestamp: string } };

export type BudgetAlertsSubscriptionVariables = Exact<{
  domain?: InputMaybe<Scalars['String']['input']>;
}>;


export type BudgetAlertsSubscription = { readonly __typename: 'Subscription', readonly budgetAlerts: { readonly __typename: 'BudgetAlert', readonly id: string, readonly domain: string, readonly budgetUSD: number, readonly spentUSD: number, readonly percentUsed: number, readonly projectedOverspend?: number | null | undefined, readonly alertLevel: AlertLevel, readonly timestamp: string } };

export type FederationHealthUpdatesSubscriptionVariables = Exact<{
  domain?: InputMaybe<Scalars['String']['input']>;
}>;


export type FederationHealthUpdatesSubscription = { readonly __typename: 'Subscription', readonly federationHealthUpdates: { readonly __typename: 'FederationHealthUpdate', readonly domain: string, readonly previousStatus: InstanceHealthStatus, readonly currentStatus: InstanceHealthStatus, readonly timestamp: string, readonly issues: ReadonlyArray<{ readonly __typename: 'HealthIssue', readonly type: string, readonly severity: IssueSeverity, readonly description: string, readonly detectedAt: string, readonly impact: string }> } };

export type ModerationQueueUpdateSubscriptionVariables = Exact<{
  priority?: InputMaybe<Priority>;
}>;


export type ModerationQueueUpdateSubscription = { readonly __typename: 'Subscription', readonly moderationQueueUpdate: { readonly __typename: 'ModerationItem', readonly id: string, readonly reportCount: number, readonly severity: ModerationSeverity, readonly priority: Priority, readonly deadline: string, readonly content: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }, readonly assignedTo?: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } | null | undefined } };

export type ThreatIntelligenceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ThreatIntelligenceSubscription = { readonly __typename: 'Subscription', readonly threatIntelligence: { readonly __typename: 'ThreatAlert', readonly id: string, readonly type: string, readonly severity: ModerationSeverity, readonly source: string, readonly description: string, readonly affectedInstances: ReadonlyArray<string>, readonly mitigationSteps: ReadonlyArray<string>, readonly timestamp: string } };

export type PerformanceAlertSubscriptionVariables = Exact<{
  severity: AlertSeverity;
}>;


export type PerformanceAlertSubscription = { readonly __typename: 'Subscription', readonly performanceAlert: { readonly __typename: 'PerformanceAlert', readonly id: string, readonly service: ServiceCategory, readonly metric: string, readonly threshold: number, readonly actualValue: number, readonly severity: AlertSeverity, readonly timestamp: string } };

export type InfrastructureEventSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type InfrastructureEventSubscription = { readonly __typename: 'Subscription', readonly infrastructureEvent: { readonly __typename: 'InfrastructureEvent', readonly id: string, readonly type: InfrastructureEventType, readonly service: string, readonly description: string, readonly impact: string, readonly timestamp: string } };

export type TimelineQueryVariables = Exact<{
  type: TimelineType;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  hashtag?: InputMaybe<Scalars['String']['input']>;
  listId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type TimelineQuery = { readonly __typename: 'Query', readonly timeline: { readonly __typename: 'ObjectConnection', readonly totalCount: number, readonly edges: ReadonlyArray<{ readonly __typename: 'ObjectEdge', readonly cursor: string, readonly node: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } }>, readonly pageInfo: { readonly __typename: 'PageInfo', readonly hasNextPage: boolean, readonly hasPreviousPage: boolean, readonly startCursor?: string | null | undefined, readonly endCursor?: string | null | undefined } } };

export type TrustGraphQueryVariables = Exact<{
  actorId: Scalars['ID']['input'];
  category?: InputMaybe<TrustCategory>;
}>;


export type TrustGraphQuery = { readonly __typename: 'Query', readonly trustGraph: ReadonlyArray<{ readonly __typename: 'TrustEdge', readonly category: TrustCategory, readonly score: number, readonly updatedAt: string, readonly from: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly to: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }> };

export const AttachmentFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]} as unknown as DocumentNode<AttachmentFieldsFragment, unknown>;
export const TagFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<TagFieldsFragment, unknown>;
export const MentionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<MentionFieldsFragment, unknown>;
export const FieldFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}}]} as unknown as DocumentNode<FieldFieldsFragment, unknown>;
export const ActorSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}}]} as unknown as DocumentNode<ActorSummaryFragment, unknown>;
export const QuoteContextFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<QuoteContextFieldsFragment, unknown>;
export const CommunityNoteFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<CommunityNoteFieldsFragment, unknown>;
export const ObjectFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]} as unknown as DocumentNode<ObjectFieldsFragment, unknown>;
export const ActivityFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ActivityFieldsFragment, unknown>;
export const CostUpdateFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CostUpdateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CostUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationCost"}},{"kind":"Field","name":{"kind":"Name","value":"dailyTotal"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyProjection"}}]}}]} as unknown as DocumentNode<CostUpdateFieldsFragment, unknown>;
export const ActorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ActorByIdQuery, ActorByIdQueryVariables>;
export const ActorByUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActorByUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ActorByUsernameQuery, ActorByUsernameQueryVariables>;
export const RequestAiAnalysisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestAIAnalysis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestAIAnalysis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"objectType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectType"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedTime"}}]}}]}}]} as unknown as DocumentNode<RequestAiAnalysisMutation, RequestAiAnalysisMutationVariables>;
export const AiAnalysisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AIAnalysis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiAnalysis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"objectType"}},{"kind":"Field","name":{"kind":"Name","value":"overallRisk"}},{"kind":"Field","name":{"kind":"Name","value":"moderationAction"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"analyzedAt"}},{"kind":"Field","name":{"kind":"Name","value":"textAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sentiment"}},{"kind":"Field","name":{"kind":"Name","value":"sentimentScores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positive"}},{"kind":"Field","name":{"kind":"Name","value":"negative"}},{"kind":"Field","name":{"kind":"Name","value":"neutral"}},{"kind":"Field","name":{"kind":"Name","value":"mixed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toxicityScore"}},{"kind":"Field","name":{"kind":"Name","value":"toxicityLabels"}},{"kind":"Field","name":{"kind":"Name","value":"containsPII"}},{"kind":"Field","name":{"kind":"Name","value":"dominantLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"entities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keyPhrases"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"parentName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isNSFW"}},{"kind":"Field","name":{"kind":"Name","value":"nsfwConfidence"}},{"kind":"Field","name":{"kind":"Name","value":"violenceScore"}},{"kind":"Field","name":{"kind":"Name","value":"weaponsDetected"}},{"kind":"Field","name":{"kind":"Name","value":"detectedText"}},{"kind":"Field","name":{"kind":"Name","value":"textToxicity"}},{"kind":"Field","name":{"kind":"Name","value":"celebrityFaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deepfakeScore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aiDetection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiGeneratedProbability"}},{"kind":"Field","name":{"kind":"Name","value":"generationModel"}},{"kind":"Field","name":{"kind":"Name","value":"patternConsistency"}},{"kind":"Field","name":{"kind":"Name","value":"styleDeviation"}},{"kind":"Field","name":{"kind":"Name","value":"semanticCoherence"}},{"kind":"Field","name":{"kind":"Name","value":"suspiciousPatterns"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spamAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spamScore"}},{"kind":"Field","name":{"kind":"Name","value":"spamIndicators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"postingVelocity"}},{"kind":"Field","name":{"kind":"Name","value":"repetitionScore"}},{"kind":"Field","name":{"kind":"Name","value":"linkDensity"}},{"kind":"Field","name":{"kind":"Name","value":"followerRatio"}},{"kind":"Field","name":{"kind":"Name","value":"interactionRate"}},{"kind":"Field","name":{"kind":"Name","value":"accountAgeDays"}}]}}]}}]}}]} as unknown as DocumentNode<AiAnalysisQuery, AiAnalysisQueryVariables>;
export const AiStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AIStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Period"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"totalAnalyses"}},{"kind":"Field","name":{"kind":"Name","value":"toxicContent"}},{"kind":"Field","name":{"kind":"Name","value":"spamDetected"}},{"kind":"Field","name":{"kind":"Name","value":"aiGenerated"}},{"kind":"Field","name":{"kind":"Name","value":"nsfwContent"}},{"kind":"Field","name":{"kind":"Name","value":"piiDetected"}},{"kind":"Field","name":{"kind":"Name","value":"toxicityRate"}},{"kind":"Field","name":{"kind":"Name","value":"spamRate"}},{"kind":"Field","name":{"kind":"Name","value":"aiContentRate"}},{"kind":"Field","name":{"kind":"Name","value":"nsfwRate"}},{"kind":"Field","name":{"kind":"Name","value":"moderationActions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"hide"}},{"kind":"Field","name":{"kind":"Name","value":"remove"}},{"kind":"Field","name":{"kind":"Name","value":"review"}},{"kind":"Field","name":{"kind":"Name","value":"shadowBan"}}]}}]}}]}}]} as unknown as DocumentNode<AiStatsQuery, AiStatsQueryVariables>;
export const AiCapabilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AICapabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiCapabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sentimentAnalysis"}},{"kind":"Field","name":{"kind":"Name","value":"toxicityDetection"}},{"kind":"Field","name":{"kind":"Name","value":"spamDetection"}},{"kind":"Field","name":{"kind":"Name","value":"piiDetection"}},{"kind":"Field","name":{"kind":"Name","value":"entityExtraction"}},{"kind":"Field","name":{"kind":"Name","value":"languageDetection"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nsfwDetection"}},{"kind":"Field","name":{"kind":"Name","value":"violenceDetection"}},{"kind":"Field","name":{"kind":"Name","value":"textExtraction"}},{"kind":"Field","name":{"kind":"Name","value":"celebrityRecognition"}},{"kind":"Field","name":{"kind":"Name","value":"deepfakeDetection"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aiDetection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiGeneratedContent"}},{"kind":"Field","name":{"kind":"Name","value":"patternAnalysis"}},{"kind":"Field","name":{"kind":"Name","value":"styleConsistency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"moderationActions"}},{"kind":"Field","name":{"kind":"Name","value":"costPerAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"dynamoDBCost"}},{"kind":"Field","name":{"kind":"Name","value":"s3StorageCost"}},{"kind":"Field","name":{"kind":"Name","value":"lambdaCost"}},{"kind":"Field","name":{"kind":"Name","value":"dataTransferCost"}},{"kind":"Field","name":{"kind":"Name","value":"breakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AiCapabilitiesQuery, AiCapabilitiesQueryVariables>;
export const ConversationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Conversations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ConversationsQuery, ConversationsQueryVariables>;
export const ConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Conversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ConversationQuery, ConversationQueryVariables>;
export const MarkConversationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkConversationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markConversationAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MarkConversationReadMutation, MarkConversationReadMutationVariables>;
export const DeleteConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteConversationMutation, DeleteConversationMutationVariables>;
export const CostBreakdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CostBreakdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"costBreakdown"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"totalCost"}},{"kind":"Field","name":{"kind":"Name","value":"dynamoDBCost"}},{"kind":"Field","name":{"kind":"Name","value":"s3StorageCost"}},{"kind":"Field","name":{"kind":"Name","value":"lambdaCost"}},{"kind":"Field","name":{"kind":"Name","value":"dataTransferCost"}},{"kind":"Field","name":{"kind":"Name","value":"breakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}}]}}]}}]}}]} as unknown as DocumentNode<CostBreakdownQuery, CostBreakdownQueryVariables>;
export const InstanceBudgetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstanceBudgets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instanceBudgets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"currentSpendUSD"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"projectedOverspend"}},{"kind":"Field","name":{"kind":"Name","value":"alertThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"autoLimit"}},{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<InstanceBudgetsQuery, InstanceBudgetsQueryVariables>;
export const SetInstanceBudgetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetInstanceBudget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"monthlyUSD"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"autoLimit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setInstanceBudget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}},{"kind":"Argument","name":{"kind":"Name","value":"monthlyUSD"},"value":{"kind":"Variable","name":{"kind":"Name","value":"monthlyUSD"}}},{"kind":"Argument","name":{"kind":"Name","value":"autoLimit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"autoLimit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"currentSpendUSD"}},{"kind":"Field","name":{"kind":"Name","value":"remainingBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"projectedOverspend"}},{"kind":"Field","name":{"kind":"Name","value":"alertThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"autoLimit"}},{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<SetInstanceBudgetMutation, SetInstanceBudgetMutationVariables>;
export const OptimizeFederationCostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OptimizeFederationCosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optimizeFederationCosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optimized"}},{"kind":"Field","name":{"kind":"Name","value":"savedMonthlyUSD"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"savingsUSD"}},{"kind":"Field","name":{"kind":"Name","value":"impact"}}]}}]}}]}}]} as unknown as DocumentNode<OptimizeFederationCostsMutation, OptimizeFederationCostsMutationVariables>;
export const FederationLimitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FederationLimits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"federationLimits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"ingressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"egressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"requestsPerMinute"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FederationLimitsQuery, FederationLimitsQueryVariables>;
export const SetFederationLimitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetFederationLimit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FederationLimitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setFederationLimit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"ingressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"egressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"requestsPerMinute"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SetFederationLimitMutation, SetFederationLimitMutationVariables>;
export const SyncThreadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncThread"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"depth"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncThread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"noteUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"depth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"depth"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rootNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"participantCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"missingPosts"}},{"kind":"Field","name":{"kind":"Name","value":"syncStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"syncedPosts"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<SyncThreadMutation, SyncThreadMutationVariables>;
export const SyncMissingRepliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncMissingReplies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncMissingReplies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"noteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"syncedReplies"}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rootNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"participantCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"missingPosts"}},{"kind":"Field","name":{"kind":"Name","value":"syncStatus"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<SyncMissingRepliesMutation, SyncMissingRepliesMutationVariables>;
export const ThreadContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ThreadContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"threadContext"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"noteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rootNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"participantCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"missingPosts"}},{"kind":"Field","name":{"kind":"Name","value":"syncStatus"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ThreadContextQuery, ThreadContextQueryVariables>;
export const SeveredRelationshipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SeveredRelationships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"severedRelationships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"instance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instance"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"localInstance"}},{"kind":"Field","name":{"kind":"Name","value":"remoteInstance"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"affectedFollowers"}},{"kind":"Field","name":{"kind":"Name","value":"affectedFollowing"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"reversible"}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"adminNotes"}},{"kind":"Field","name":{"kind":"Name","value":"autoDetected"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<SeveredRelationshipsQuery, SeveredRelationshipsQueryVariables>;
export const AcknowledgeSeveranceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcknowledgeSeverance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acknowledgeSeverance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"severedRelationship"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"localInstance"}},{"kind":"Field","name":{"kind":"Name","value":"remoteInstance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"acknowledged"}}]}}]}}]} as unknown as DocumentNode<AcknowledgeSeveranceMutation, AcknowledgeSeveranceMutationVariables>;
export const AttemptReconnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AttemptReconnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attemptReconnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"severedRelationship"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"localInstance"}},{"kind":"Field","name":{"kind":"Name","value":"remoteInstance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reconnected"}},{"kind":"Field","name":{"kind":"Name","value":"failed"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<AttemptReconnectionMutation, AttemptReconnectionMutationVariables>;
export const FederationHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FederationHealth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"federationHealth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"pausedUntil"}}]}}]}}]} as unknown as DocumentNode<FederationHealthQuery, FederationHealthQueryVariables>;
export const FederationStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FederationStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"federationStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"reachable"}},{"kind":"Field","name":{"kind":"Name","value":"lastContact"}},{"kind":"Field","name":{"kind":"Name","value":"sharedInbox"}},{"kind":"Field","name":{"kind":"Name","value":"publicKey"}},{"kind":"Field","name":{"kind":"Name","value":"software"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}}]} as unknown as DocumentNode<FederationStatusQuery, FederationStatusQueryVariables>;
export const PauseFederationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PauseFederation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"until"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Time"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pauseFederation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}},{"kind":"Argument","name":{"kind":"Name","value":"until"},"value":{"kind":"Variable","name":{"kind":"Name","value":"until"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"pausedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"ingressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"egressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"requestsPerMinute"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<PauseFederationMutation, PauseFederationMutationVariables>;
export const ResumeFederationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResumeFederation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resumeFederation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"pausedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"ingressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"egressLimitMB"}},{"kind":"Field","name":{"kind":"Name","value":"requestsPerMinute"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyBudgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ResumeFederationMutation, ResumeFederationMutationVariables>;
export const FollowHashtagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FollowHashtag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notifyLevel"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationLevel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followHashtag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hashtag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}}},{"kind":"Argument","name":{"kind":"Name","value":"notifyLevel"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notifyLevel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"hashtag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowing"}},{"kind":"Field","name":{"kind":"Name","value":"followedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notificationSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"muted"}},{"kind":"Field","name":{"kind":"Name","value":"mutedUntil"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FollowHashtagMutation, FollowHashtagMutationVariables>;
export const UnfollowHashtagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnfollowHashtag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollowHashtag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hashtag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"hashtag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<UnfollowHashtagMutation, UnfollowHashtagMutationVariables>;
export const MuteHashtagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MuteHashtag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"until"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Time"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"muteHashtag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hashtag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}}},{"kind":"Argument","name":{"kind":"Name","value":"until"},"value":{"kind":"Variable","name":{"kind":"Name","value":"until"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"hashtag"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"notificationSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"muted"}},{"kind":"Field","name":{"kind":"Name","value":"mutedUntil"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mutedUntil"}}]}}]}}]} as unknown as DocumentNode<MuteHashtagMutation, MuteHashtagMutationVariables>;
export const FollowedHashtagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FollowedHashtags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followedHashtags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isFollowing"}},{"kind":"Field","name":{"kind":"Name","value":"followedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notificationSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"muted"}},{"kind":"Field","name":{"kind":"Name","value":"mutedUntil"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<FollowedHashtagsQuery, FollowedHashtagsQueryVariables>;
export const ListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ListsQuery, ListsQueryVariables>;
export const ListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"List"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ListQuery, ListQueryVariables>;
export const ListAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ListAccountsQuery, ListAccountsQueryVariables>;
export const CreateListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateListMutation, CreateListMutationVariables>;
export const UpdateListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateListMutation, UpdateListMutationVariables>;
export const DeleteListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteListMutation, DeleteListMutationVariables>;
export const AddAccountsToListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddAccountsToList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addAccountsToList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<AddAccountsToListMutation, AddAccountsToListMutationVariables>;
export const RemoveAccountsFromListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAccountsFromList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAccountsFromList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<RemoveAccountsFromListMutation, RemoveAccountsFromListMutationVariables>;
export const MediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Media"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaCategory"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<MediaQuery, MediaQueryVariables>;
export const UpdateMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaCategory"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateMediaMutation, UpdateMediaMutationVariables>;
export const UploadMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadId"}},{"kind":"Field","name":{"kind":"Name","value":"warnings"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaCategory"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<UploadMediaMutation, UploadMediaMutationVariables>;
export const AddCommunityNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCommunityNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCommunityNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]} as unknown as DocumentNode<AddCommunityNoteMutation, AddCommunityNoteMutationVariables>;
export const VoteCommunityNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VoteCommunityNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"helpful"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voteCommunityNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"helpful"},"value":{"kind":"Variable","name":{"kind":"Name","value":"helpful"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]} as unknown as DocumentNode<VoteCommunityNoteMutation, VoteCommunityNoteMutationVariables>;
export const CommunityNotesByObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunityNotesByObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<CommunityNotesByObjectQuery, CommunityNotesByObjectQueryVariables>;
export const FlagObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FlagObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FlagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flagObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationId"}},{"kind":"Field","name":{"kind":"Name","value":"queued"}}]}}]}}]} as unknown as DocumentNode<FlagObjectMutation, FlagObjectMutationVariables>;
export const CreateModerationPatternDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateModerationPattern"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModerationPatternInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createModerationPattern"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"matchCount"}},{"kind":"Field","name":{"kind":"Name","value":"falsePositiveRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<CreateModerationPatternMutation, CreateModerationPatternMutationVariables>;
export const DeleteModerationPatternDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteModerationPattern"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteModerationPattern"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteModerationPatternMutation, DeleteModerationPatternMutationVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CostUpdateFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CostUpdateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CostUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationCost"}},{"kind":"Field","name":{"kind":"Name","value":"dailyTotal"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyProjection"}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const CreateQuoteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateQuoteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQuoteNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQuoteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CostUpdateFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CostUpdateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CostUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationCost"}},{"kind":"Field","name":{"kind":"Name","value":"dailyTotal"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyProjection"}}]}}]} as unknown as DocumentNode<CreateQuoteNoteMutation, CreateQuoteNoteMutationVariables>;
export const WithdrawFromQuotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WithdrawFromQuotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"withdrawFromQuotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"noteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"note"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<WithdrawFromQuotesMutation, WithdrawFromQuotesMutationVariables>;
export const UpdateQuotePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateQuotePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quoteable"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permission"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuotePermission"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateQuotePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"noteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}},{"kind":"Argument","name":{"kind":"Name","value":"quoteable"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quoteable"}}},{"kind":"Argument","name":{"kind":"Name","value":"permission"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permission"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"note"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"affectedQuotes"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateQuotePermissionsMutation, UpdateQuotePermissionsMutationVariables>;
export const DeleteObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteObjectMutation, DeleteObjectMutationVariables>;
export const LikeObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LikeObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likeObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<LikeObjectMutation, LikeObjectMutationVariables>;
export const UnlikeObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlikeObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlikeObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnlikeObjectMutation, UnlikeObjectMutationVariables>;
export const ShareObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ShareObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shareObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<ShareObjectMutation, ShareObjectMutationVariables>;
export const UnshareObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnshareObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unshareObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnshareObjectMutation, UnshareObjectMutationVariables>;
export const BookmarkObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookmarkObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarkObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<BookmarkObjectMutation, BookmarkObjectMutationVariables>;
export const UnbookmarkObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnbookmarkObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unbookmarkObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnbookmarkObjectMutation, UnbookmarkObjectMutationVariables>;
export const PinObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PinObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pinObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<PinObjectMutation, PinObjectMutationVariables>;
export const UnpinObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnpinObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unpinObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnpinObjectMutation, UnpinObjectMutationVariables>;
export const ObjectWithQuotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObjectWithQuotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}},{"kind":"Field","name":{"kind":"Name","value":"quotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ObjectWithQuotesQuery, ObjectWithQuotesQueryVariables>;
export const NotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Notifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<NotificationsQuery, NotificationsQueryVariables>;
export const DismissNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DismissNotificationMutation, DismissNotificationMutationVariables>;
export const ClearNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClearNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearNotifications"}}]}}]} as unknown as DocumentNode<ClearNotificationsMutation, ClearNotificationsMutationVariables>;
export const ObjectByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObjectById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ObjectByIdQuery, ObjectByIdQueryVariables>;
export const UserPreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPreferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"posting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"defaultSensitive"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLanguage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expandSpoilers"}},{"kind":"Field","name":{"kind":"Name","value":"expandMedia"}},{"kind":"Field","name":{"kind":"Name","value":"autoplayGifs"}},{"kind":"Field","name":{"kind":"Name","value":"timelineOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discovery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showFollowCounts"}},{"kind":"Field","name":{"kind":"Name","value":"searchSuggestionsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"personalizedSearchEnabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"streaming"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultQuality"}},{"kind":"Field","name":{"kind":"Name","value":"autoQuality"}},{"kind":"Field","name":{"kind":"Name","value":"preloadNext"}},{"kind":"Field","name":{"kind":"Name","value":"dataSaver"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"push"}},{"kind":"Field","name":{"kind":"Name","value":"inApp"}},{"kind":"Field","name":{"kind":"Name","value":"digest"}}]}},{"kind":"Field","name":{"kind":"Name","value":"privacy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"indexable"}},{"kind":"Field","name":{"kind":"Name","value":"showOnlineStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reblogFilters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]} as unknown as DocumentNode<UserPreferencesQuery, UserPreferencesQueryVariables>;
export const UpdateUserPreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserPreferences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserPreferencesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserPreferences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"posting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"defaultSensitive"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLanguage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expandSpoilers"}},{"kind":"Field","name":{"kind":"Name","value":"expandMedia"}},{"kind":"Field","name":{"kind":"Name","value":"autoplayGifs"}},{"kind":"Field","name":{"kind":"Name","value":"timelineOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discovery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showFollowCounts"}},{"kind":"Field","name":{"kind":"Name","value":"searchSuggestionsEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"personalizedSearchEnabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"streaming"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultQuality"}},{"kind":"Field","name":{"kind":"Name","value":"autoQuality"}},{"kind":"Field","name":{"kind":"Name","value":"preloadNext"}},{"kind":"Field","name":{"kind":"Name","value":"dataSaver"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"push"}},{"kind":"Field","name":{"kind":"Name","value":"inApp"}},{"kind":"Field","name":{"kind":"Name","value":"digest"}}]}},{"kind":"Field","name":{"kind":"Name","value":"privacy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"indexable"}},{"kind":"Field","name":{"kind":"Name","value":"showOnlineStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reblogFilters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserPreferencesMutation, UpdateUserPreferencesMutationVariables>;
export const UpdateStreamingPreferencesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStreamingPreferences"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StreamingPreferencesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStreamingPreferences"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"streaming"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultQuality"}},{"kind":"Field","name":{"kind":"Name","value":"autoQuality"}},{"kind":"Field","name":{"kind":"Name","value":"preloadNext"}},{"kind":"Field","name":{"kind":"Name","value":"dataSaver"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateStreamingPreferencesMutation, UpdateStreamingPreferencesMutationVariables>;
export const FollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Followers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"40"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<FollowersQuery, FollowersQueryVariables>;
export const FollowingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Following"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"40"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"following"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<FollowingQuery, FollowingQueryVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const PushSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PushSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pushSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"endpoint"}},{"kind":"Field","name":{"kind":"Name","value":"keys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auth"}},{"kind":"Field","name":{"kind":"Name","value":"p256dh"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follow"}},{"kind":"Field","name":{"kind":"Name","value":"favourite"}},{"kind":"Field","name":{"kind":"Name","value":"reblog"}},{"kind":"Field","name":{"kind":"Name","value":"mention"}},{"kind":"Field","name":{"kind":"Name","value":"poll"}},{"kind":"Field","name":{"kind":"Name","value":"followRequest"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"update"}},{"kind":"Field","name":{"kind":"Name","value":"adminSignUp"}},{"kind":"Field","name":{"kind":"Name","value":"adminReport"}}]}},{"kind":"Field","name":{"kind":"Name","value":"policy"}},{"kind":"Field","name":{"kind":"Name","value":"serverKey"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<PushSubscriptionQuery, PushSubscriptionQueryVariables>;
export const RegisterPushSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterPushSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterPushSubscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerPushSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"endpoint"}},{"kind":"Field","name":{"kind":"Name","value":"keys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auth"}},{"kind":"Field","name":{"kind":"Name","value":"p256dh"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follow"}},{"kind":"Field","name":{"kind":"Name","value":"favourite"}},{"kind":"Field","name":{"kind":"Name","value":"reblog"}},{"kind":"Field","name":{"kind":"Name","value":"mention"}},{"kind":"Field","name":{"kind":"Name","value":"poll"}},{"kind":"Field","name":{"kind":"Name","value":"followRequest"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"update"}},{"kind":"Field","name":{"kind":"Name","value":"adminSignUp"}},{"kind":"Field","name":{"kind":"Name","value":"adminReport"}}]}},{"kind":"Field","name":{"kind":"Name","value":"policy"}},{"kind":"Field","name":{"kind":"Name","value":"serverKey"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RegisterPushSubscriptionMutation, RegisterPushSubscriptionMutationVariables>;
export const UpdatePushSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePushSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePushSubscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePushSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"endpoint"}},{"kind":"Field","name":{"kind":"Name","value":"keys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auth"}},{"kind":"Field","name":{"kind":"Name","value":"p256dh"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follow"}},{"kind":"Field","name":{"kind":"Name","value":"favourite"}},{"kind":"Field","name":{"kind":"Name","value":"reblog"}},{"kind":"Field","name":{"kind":"Name","value":"mention"}},{"kind":"Field","name":{"kind":"Name","value":"poll"}},{"kind":"Field","name":{"kind":"Name","value":"followRequest"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"update"}},{"kind":"Field","name":{"kind":"Name","value":"adminSignUp"}},{"kind":"Field","name":{"kind":"Name","value":"adminReport"}}]}},{"kind":"Field","name":{"kind":"Name","value":"policy"}},{"kind":"Field","name":{"kind":"Name","value":"serverKey"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdatePushSubscriptionMutation, UpdatePushSubscriptionMutationVariables>;
export const DeletePushSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePushSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePushSubscription"}}]}}]} as unknown as DocumentNode<DeletePushSubscriptionMutation, DeletePushSubscriptionMutationVariables>;
export const RelationshipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Relationship"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationship"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"followedBy"}},{"kind":"Field","name":{"kind":"Name","value":"blocking"}},{"kind":"Field","name":{"kind":"Name","value":"blockedBy"}},{"kind":"Field","name":{"kind":"Name","value":"muting"}},{"kind":"Field","name":{"kind":"Name","value":"mutingNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"requested"}},{"kind":"Field","name":{"kind":"Name","value":"domainBlocking"}},{"kind":"Field","name":{"kind":"Name","value":"showingReblogs"}},{"kind":"Field","name":{"kind":"Name","value":"notifying"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<RelationshipQuery, RelationshipQueryVariables>;
export const RelationshipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Relationships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"followedBy"}},{"kind":"Field","name":{"kind":"Name","value":"blocking"}},{"kind":"Field","name":{"kind":"Name","value":"blockedBy"}},{"kind":"Field","name":{"kind":"Name","value":"muting"}},{"kind":"Field","name":{"kind":"Name","value":"mutingNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"requested"}},{"kind":"Field","name":{"kind":"Name","value":"domainBlocking"}},{"kind":"Field","name":{"kind":"Name","value":"showingReblogs"}},{"kind":"Field","name":{"kind":"Name","value":"notifying"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<RelationshipsQuery, RelationshipsQueryVariables>;
export const FollowActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FollowActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<FollowActorMutation, FollowActorMutationVariables>;
export const UnfollowActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnfollowActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollowActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnfollowActorMutation, UnfollowActorMutationVariables>;
export const BlockActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BlockActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"followedBy"}},{"kind":"Field","name":{"kind":"Name","value":"blocking"}},{"kind":"Field","name":{"kind":"Name","value":"blockedBy"}},{"kind":"Field","name":{"kind":"Name","value":"muting"}},{"kind":"Field","name":{"kind":"Name","value":"mutingNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"requested"}},{"kind":"Field","name":{"kind":"Name","value":"domainBlocking"}},{"kind":"Field","name":{"kind":"Name","value":"showingReblogs"}},{"kind":"Field","name":{"kind":"Name","value":"notifying"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<BlockActorMutation, BlockActorMutationVariables>;
export const UnblockActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnblockActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unblockActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnblockActorMutation, UnblockActorMutationVariables>;
export const MuteActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MuteActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notifications"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"muteActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"notifications"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notifications"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"followedBy"}},{"kind":"Field","name":{"kind":"Name","value":"blocking"}},{"kind":"Field","name":{"kind":"Name","value":"blockedBy"}},{"kind":"Field","name":{"kind":"Name","value":"muting"}},{"kind":"Field","name":{"kind":"Name","value":"mutingNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"requested"}},{"kind":"Field","name":{"kind":"Name","value":"domainBlocking"}},{"kind":"Field","name":{"kind":"Name","value":"showingReblogs"}},{"kind":"Field","name":{"kind":"Name","value":"notifying"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<MuteActorMutation, MuteActorMutationVariables>;
export const UnmuteActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnmuteActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unmuteActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnmuteActorMutation, UnmuteActorMutationVariables>;
export const UpdateRelationshipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRelationship"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRelationshipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRelationship"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"followedBy"}},{"kind":"Field","name":{"kind":"Name","value":"blocking"}},{"kind":"Field","name":{"kind":"Name","value":"blockedBy"}},{"kind":"Field","name":{"kind":"Name","value":"muting"}},{"kind":"Field","name":{"kind":"Name","value":"mutingNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"requested"}},{"kind":"Field","name":{"kind":"Name","value":"domainBlocking"}},{"kind":"Field","name":{"kind":"Name","value":"showingReblogs"}},{"kind":"Field","name":{"kind":"Name","value":"notifying"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}}]}}]} as unknown as DocumentNode<UpdateRelationshipMutation, UpdateRelationshipMutationVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hashtags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;
export const TimelineUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TimelineUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timelineUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<TimelineUpdatesSubscription, TimelineUpdatesSubscriptionVariables>;
export const NotificationStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NotificationStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationStream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<NotificationStreamSubscription, NotificationStreamSubscriptionVariables>;
export const ConversationUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ConversationUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversationUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ConversationUpdatesSubscription, ConversationUpdatesSubscriptionVariables>;
export const ListUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ListUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ListUpdatesSubscription, ListUpdatesSubscriptionVariables>;
export const QuoteActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"QuoteActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"noteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"noteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"quote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<QuoteActivitySubscription, QuoteActivitySubscriptionVariables>;
export const HashtagActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"HashtagActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hashtags"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hashtagActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hashtags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hashtags"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hashtag"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<HashtagActivitySubscription, HashtagActivitySubscriptionVariables>;
export const ActivityStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ActivityStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityStream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ActivityStreamSubscription, ActivityStreamSubscriptionVariables>;
export const RelationshipUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RelationshipUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relationshipUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"relationship"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"followedBy"}},{"kind":"Field","name":{"kind":"Name","value":"blocking"}},{"kind":"Field","name":{"kind":"Name","value":"blockedBy"}},{"kind":"Field","name":{"kind":"Name","value":"muting"}},{"kind":"Field","name":{"kind":"Name","value":"mutingNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"requested"}},{"kind":"Field","name":{"kind":"Name","value":"domainBlocking"}},{"kind":"Field","name":{"kind":"Name","value":"showingReblogs"}},{"kind":"Field","name":{"kind":"Name","value":"notifying"}},{"kind":"Field","name":{"kind":"Name","value":"languages"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<RelationshipUpdatesSubscription, RelationshipUpdatesSubscriptionVariables>;
export const CostUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CostUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"costUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationCost"}},{"kind":"Field","name":{"kind":"Name","value":"dailyTotal"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyProjection"}}]}}]}}]} as unknown as DocumentNode<CostUpdatesSubscription, CostUpdatesSubscriptionVariables>;
export const ModerationEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ModerationEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"evidence"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reviewers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ModerationEventsSubscription, ModerationEventsSubscriptionVariables>;
export const TrustUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrustUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trustUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<TrustUpdatesSubscription, TrustUpdatesSubscriptionVariables>;
export const AiAnalysisUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AiAnalysisUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiAnalysisUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"objectType"}},{"kind":"Field","name":{"kind":"Name","value":"overallRisk"}},{"kind":"Field","name":{"kind":"Name","value":"moderationAction"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"analyzedAt"}},{"kind":"Field","name":{"kind":"Name","value":"textAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sentiment"}},{"kind":"Field","name":{"kind":"Name","value":"toxicityScore"}},{"kind":"Field","name":{"kind":"Name","value":"toxicityLabels"}},{"kind":"Field","name":{"kind":"Name","value":"containsPII"}},{"kind":"Field","name":{"kind":"Name","value":"dominantLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"keyPhrases"}},{"kind":"Field","name":{"kind":"Name","value":"sentimentScores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positive"}},{"kind":"Field","name":{"kind":"Name","value":"negative"}},{"kind":"Field","name":{"kind":"Name","value":"neutral"}},{"kind":"Field","name":{"kind":"Name","value":"mixed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isNSFW"}},{"kind":"Field","name":{"kind":"Name","value":"nsfwConfidence"}},{"kind":"Field","name":{"kind":"Name","value":"violenceScore"}},{"kind":"Field","name":{"kind":"Name","value":"weaponsDetected"}},{"kind":"Field","name":{"kind":"Name","value":"detectedText"}},{"kind":"Field","name":{"kind":"Name","value":"textToxicity"}},{"kind":"Field","name":{"kind":"Name","value":"deepfakeScore"}},{"kind":"Field","name":{"kind":"Name","value":"moderationLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"parentName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"celebrityFaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"urls"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"aiDetection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aiGeneratedProbability"}},{"kind":"Field","name":{"kind":"Name","value":"generationModel"}},{"kind":"Field","name":{"kind":"Name","value":"patternConsistency"}},{"kind":"Field","name":{"kind":"Name","value":"styleDeviation"}},{"kind":"Field","name":{"kind":"Name","value":"semanticCoherence"}},{"kind":"Field","name":{"kind":"Name","value":"suspiciousPatterns"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spamAnalysis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spamScore"}},{"kind":"Field","name":{"kind":"Name","value":"postingVelocity"}},{"kind":"Field","name":{"kind":"Name","value":"repetitionScore"}},{"kind":"Field","name":{"kind":"Name","value":"linkDensity"}},{"kind":"Field","name":{"kind":"Name","value":"followerRatio"}},{"kind":"Field","name":{"kind":"Name","value":"interactionRate"}},{"kind":"Field","name":{"kind":"Name","value":"accountAgeDays"}},{"kind":"Field","name":{"kind":"Name","value":"spamIndicators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AiAnalysisUpdatesSubscription, AiAnalysisUpdatesSubscriptionVariables>;
export const MetricsUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MetricsUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categories"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"services"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metricsUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categories"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categories"}}},{"kind":"Argument","name":{"kind":"Name","value":"services"},"value":{"kind":"Variable","name":{"kind":"Name","value":"services"}}},{"kind":"Argument","name":{"kind":"Name","value":"threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metricId"}},{"kind":"Field","name":{"kind":"Name","value":"serviceName"}},{"kind":"Field","name":{"kind":"Name","value":"metricType"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionCategory"}},{"kind":"Field","name":{"kind":"Name","value":"aggregationLevel"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"sum"}},{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"average"}},{"kind":"Field","name":{"kind":"Name","value":"p50"}},{"kind":"Field","name":{"kind":"Name","value":"p95"}},{"kind":"Field","name":{"kind":"Name","value":"p99"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"userCostMicrocents"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostMicrocents"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"tenantId"}},{"kind":"Field","name":{"kind":"Name","value":"instanceDomain"}},{"kind":"Field","name":{"kind":"Name","value":"dimensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<MetricsUpdatesSubscription, MetricsUpdatesSubscriptionVariables>;
export const ModerationAlertsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ModerationAlerts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"severity"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ModerationSeverity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationAlerts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"severity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"severity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"matchedText"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"suggestedAction"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"handled"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"matchCount"}},{"kind":"Field","name":{"kind":"Name","value":"falsePositiveRate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ModerationAlertsSubscription, ModerationAlertsSubscriptionVariables>;
export const CostAlertsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CostAlerts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"thresholdUSD"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"costAlerts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"thresholdUSD"},"value":{"kind":"Variable","name":{"kind":"Name","value":"thresholdUSD"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<CostAlertsSubscription, CostAlertsSubscriptionVariables>;
export const BudgetAlertsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"BudgetAlerts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetAlerts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"budgetUSD"}},{"kind":"Field","name":{"kind":"Name","value":"spentUSD"}},{"kind":"Field","name":{"kind":"Name","value":"percentUsed"}},{"kind":"Field","name":{"kind":"Name","value":"projectedOverspend"}},{"kind":"Field","name":{"kind":"Name","value":"alertLevel"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<BudgetAlertsSubscription, BudgetAlertsSubscriptionVariables>;
export const FederationHealthUpdatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"FederationHealthUpdates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"federationHealthUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"previousStatus"}},{"kind":"Field","name":{"kind":"Name","value":"currentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"issues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"impact"}}]}}]}}]}}]} as unknown as DocumentNode<FederationHealthUpdatesSubscription, FederationHealthUpdatesSubscriptionVariables>;
export const ModerationQueueUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ModerationQueueUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Priority"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationQueueUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reportCount"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ModerationQueueUpdateSubscription, ModerationQueueUpdateSubscriptionVariables>;
export const ThreatIntelligenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ThreatIntelligence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"threatIntelligence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"affectedInstances"}},{"kind":"Field","name":{"kind":"Name","value":"mitigationSteps"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<ThreatIntelligenceSubscription, ThreatIntelligenceSubscriptionVariables>;
export const PerformanceAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"PerformanceAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"severity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AlertSeverity"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performanceAlert"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"severity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"severity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"metric"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}},{"kind":"Field","name":{"kind":"Name","value":"actualValue"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<PerformanceAlertSubscription, PerformanceAlertSubscriptionVariables>;
export const InfrastructureEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"InfrastructureEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"infrastructureEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"impact"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<InfrastructureEventSubscription, InfrastructureEventSubscriptionVariables>;
export const TimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Timeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"hashtag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}}},{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<TimelineQuery, TimelineQueryVariables>;
export const TrustGraphDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrustGraph"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TrustCategory"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trustGraph"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<TrustGraphQuery, TrustGraphQueryVariables>;