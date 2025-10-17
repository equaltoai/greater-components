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
  readonly mimeType: Scalars['String']['output'];
  readonly previewUrl?: Maybe<Scalars['String']['output']>;
  readonly size: Scalars['Int']['output'];
  readonly type: MediaType;
  readonly uploadedBy: Actor;
  readonly url: Scalars['String']['output'];
  readonly width?: Maybe<Scalars['Int']['output']>;
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
  readonly updateQuotePermissions: UpdateQuotePermissionsPayload;
  readonly updateRelationship: Relationship;
  readonly updateScheduledStatus: ScheduledStatus;
  readonly updateStreamingPreferences: UserPreferences;
  readonly updateTrust: TrustEdge;
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
  readonly autoQuality: Scalars['Boolean']['input'];
  readonly dataSaver: Scalars['Boolean']['input'];
  readonly defaultQuality: StreamQuality;
  readonly preloadNext: Scalars['Boolean']['input'];
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

export type UserPreferences = {
  readonly __typename: 'UserPreferences';
  readonly actorId: Scalars['ID']['output'];
  readonly notifications: NotificationPreferences;
  readonly privacy: PrivacyPreferences;
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


export type MediaQuery = { readonly __typename: 'Query', readonly media?: { readonly __typename: 'Media', readonly id: string, readonly type: MediaType, readonly url: string, readonly previewUrl?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined, readonly size: number, readonly mimeType: string, readonly createdAt: string, readonly uploadedBy: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined };

export type UpdateMediaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMediaInput;
}>;


export type UpdateMediaMutation = { readonly __typename: 'Mutation', readonly updateMedia: { readonly __typename: 'Media', readonly id: string, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined, readonly url: string, readonly previewUrl?: string | null | undefined } };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { readonly __typename: 'Mutation', readonly createNote: { readonly __typename: 'CreateNotePayload', readonly object: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }, readonly activity: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined }, readonly cost: { readonly __typename: 'CostUpdate', readonly operationCost: number, readonly dailyTotal: number, readonly monthlyProjection: number } } };

export type CreateQuoteNoteMutationVariables = Exact<{
  input: CreateQuoteNoteInput;
}>;


export type CreateQuoteNoteMutation = { readonly __typename: 'Mutation', readonly createQuoteNote: { readonly __typename: 'CreateNotePayload', readonly object: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined }, readonly activity: { readonly __typename: 'Activity', readonly id: string, readonly type: ActivityType, readonly published: string, readonly cost: number, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly object?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined, readonly target?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined }, readonly cost: { readonly __typename: 'CostUpdate', readonly operationCost: number, readonly dailyTotal: number, readonly monthlyProjection: number } } };

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

export type TimelineQueryVariables = Exact<{
  type: TimelineType;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  hashtag?: InputMaybe<Scalars['String']['input']>;
  listId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type TimelineQuery = { readonly __typename: 'Query', readonly timeline: { readonly __typename: 'ObjectConnection', readonly totalCount: number, readonly edges: ReadonlyArray<{ readonly __typename: 'ObjectEdge', readonly cursor: string, readonly node: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly content: string, readonly visibility: Visibility, readonly sensitive: boolean, readonly spoilerText?: string | null | undefined, readonly createdAt: string, readonly updatedAt: string, readonly repliesCount: number, readonly likesCount: number, readonly sharesCount: number, readonly estimatedCost: number, readonly moderationScore?: number | null | undefined, readonly quoteUrl?: string | null | undefined, readonly quoteable: boolean, readonly quotePermissions: QuotePermission, readonly quoteCount: number, readonly contentMap: ReadonlyArray<{ readonly __typename: 'ContentMap', readonly language: string, readonly content: string }>, readonly attachments: ReadonlyArray<{ readonly __typename: 'Attachment', readonly id: string, readonly type: string, readonly url: string, readonly preview?: string | null | undefined, readonly description?: string | null | undefined, readonly blurhash?: string | null | undefined, readonly width?: number | null | undefined, readonly height?: number | null | undefined, readonly duration?: number | null | undefined }>, readonly tags: ReadonlyArray<{ readonly __typename: 'Tag', readonly name: string, readonly url: string }>, readonly mentions: ReadonlyArray<{ readonly __typename: 'Mention', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly url: string }>, readonly quoteContext?: { readonly __typename: 'QuoteContext', readonly quoteAllowed: boolean, readonly quoteType: QuoteType, readonly withdrawn: boolean, readonly originalAuthor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly originalNote?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType } | null | undefined } | null | undefined, readonly communityNotes: ReadonlyArray<{ readonly __typename: 'CommunityNote', readonly id: string, readonly content: string, readonly helpful: number, readonly notHelpful: number, readonly createdAt: string, readonly author: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } }>, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> }, readonly inReplyTo?: { readonly __typename: 'Object', readonly id: string, readonly type: ObjectType, readonly actor: { readonly __typename: 'Actor', readonly id: string, readonly username: string, readonly domain?: string | null | undefined, readonly displayName?: string | null | undefined, readonly summary?: string | null | undefined, readonly avatar?: string | null | undefined, readonly header?: string | null | undefined, readonly followers: number, readonly following: number, readonly statusesCount: number, readonly bot: boolean, readonly locked: boolean, readonly createdAt: string, readonly updatedAt: string, readonly trustScore: number, readonly fields: ReadonlyArray<{ readonly __typename: 'Field', readonly name: string, readonly value: string, readonly verifiedAt?: string | null | undefined }> } } | null | undefined } }>, readonly pageInfo: { readonly __typename: 'PageInfo', readonly hasNextPage: boolean, readonly hasPreviousPage: boolean, readonly startCursor?: string | null | undefined, readonly endCursor?: string | null | undefined } } };

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
export const ConversationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Conversations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ConversationsQuery, ConversationsQueryVariables>;
export const ConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Conversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ConversationQuery, ConversationQueryVariables>;
export const MarkConversationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkConversationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markConversationAsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MarkConversationReadMutation, MarkConversationReadMutationVariables>;
export const DeleteConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteConversationMutation, DeleteConversationMutationVariables>;
export const ListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ListsQuery, ListsQueryVariables>;
export const ListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"List"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ListQuery, ListQueryVariables>;
export const ListAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<ListAccountsQuery, ListAccountsQueryVariables>;
export const CreateListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateListMutation, CreateListMutationVariables>;
export const UpdateListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"repliesPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"exclusive"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateListMutation, UpdateListMutationVariables>;
export const DeleteListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteListMutation, DeleteListMutationVariables>;
export const AddAccountsToListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddAccountsToList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addAccountsToList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<AddAccountsToListMutation, AddAccountsToListMutationVariables>;
export const RemoveAccountsFromListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAccountsFromList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAccountsFromList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<RemoveAccountsFromListMutation, RemoveAccountsFromListMutationVariables>;
export const MediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Media"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}}]} as unknown as DocumentNode<MediaQuery, MediaQueryVariables>;
export const UpdateMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateMediaMutation, UpdateMediaMutationVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CostUpdateFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CostUpdateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CostUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationCost"}},{"kind":"Field","name":{"kind":"Name","value":"dailyTotal"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyProjection"}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const CreateQuoteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateQuoteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQuoteNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQuoteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CostUpdateFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CostUpdateFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CostUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operationCost"}},{"kind":"Field","name":{"kind":"Name","value":"dailyTotal"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyProjection"}}]}}]} as unknown as DocumentNode<CreateQuoteNoteMutation, CreateQuoteNoteMutationVariables>;
export const DeleteObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteObjectMutation, DeleteObjectMutationVariables>;
export const LikeObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LikeObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likeObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<LikeObjectMutation, LikeObjectMutationVariables>;
export const UnlikeObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlikeObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlikeObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnlikeObjectMutation, UnlikeObjectMutationVariables>;
export const ShareObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ShareObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shareObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Activity"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"object"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<ShareObjectMutation, ShareObjectMutationVariables>;
export const UnshareObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnshareObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unshareObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnshareObjectMutation, UnshareObjectMutationVariables>;
export const BookmarkObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookmarkObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarkObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<BookmarkObjectMutation, BookmarkObjectMutationVariables>;
export const UnbookmarkObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnbookmarkObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unbookmarkObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnbookmarkObjectMutation, UnbookmarkObjectMutationVariables>;
export const PinObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PinObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pinObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<PinObjectMutation, PinObjectMutationVariables>;
export const UnpinObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnpinObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unpinObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnpinObjectMutation, UnpinObjectMutationVariables>;
export const NotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Notifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<NotificationsQuery, NotificationsQueryVariables>;
export const DismissNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DismissNotificationMutation, DismissNotificationMutationVariables>;
export const ClearNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClearNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clearNotifications"}}]}}]} as unknown as DocumentNode<ClearNotificationsMutation, ClearNotificationsMutationVariables>;
export const ObjectByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ObjectById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<ObjectByIdQuery, ObjectByIdQueryVariables>;
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
export const TimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Timeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"hashtag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hashtag"}}},{"kind":"Argument","name":{"kind":"Name","value":"listId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ObjectFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AttachmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"blurhash"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TagFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MentionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Mention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FieldFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Field"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActorSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Actor"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"header"}},{"kind":"Field","name":{"kind":"Name","value":"followers"}},{"kind":"Field","name":{"kind":"Name","value":"following"}},{"kind":"Field","name":{"kind":"Name","value":"statusesCount"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"locked"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"trustScore"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FieldFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QuoteContextFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QuoteContext"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quoteAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"quoteType"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawn"}},{"kind":"Field","name":{"kind":"Name","value":"originalAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommunityNoteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"helpful"}},{"kind":"Field","name":{"kind":"Name","value":"notHelpful"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentMap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"sensitive"}},{"kind":"Field","name":{"kind":"Name","value":"spoilerText"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AttachmentFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TagFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MentionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"repliesCount"}},{"kind":"Field","name":{"kind":"Name","value":"likesCount"}},{"kind":"Field","name":{"kind":"Name","value":"sharesCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCost"}},{"kind":"Field","name":{"kind":"Name","value":"moderationScore"}},{"kind":"Field","name":{"kind":"Name","value":"quoteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"quoteable"}},{"kind":"Field","name":{"kind":"Name","value":"quotePermissions"}},{"kind":"Field","name":{"kind":"Name","value":"quoteContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"QuoteContextFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quoteCount"}},{"kind":"Field","name":{"kind":"Name","value":"communityNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommunityNoteFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inReplyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActorSummary"}}]}}]}}]}}]} as unknown as DocumentNode<TimelineQuery, TimelineQueryVariables>;