/**
 * Lesser GraphQL API payload types
 * Fictional GraphQL-based Fediverse API similar to Mastodon functionality
 */

// Base GraphQL response wrapper
export interface LesserGraphQLResponse<T = any> {
  data?: T;
  errors?: LesserGraphQLError[];
  extensions?: Record<string, any>;
}

export interface LesserGraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, any>;
}

// Fragment definitions for reusable GraphQL pieces
export interface LesserAccountFragment {
  id: string;
  handle: string;
  localHandle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  joinedAt: string;
  isVerified: boolean;
  isBot: boolean;
  isLocked: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  profileFields: LesserProfileField[];
  customEmojis: LesserEmojiFragment[];
}

export interface LesserProfileField {
  label: string;
  content: string;
  verifiedAt?: string;
}

export interface LesserEmojiFragment {
  code: string;
  imageUrl: string;
  staticUrl: string;
  category?: string;
  isVisible: boolean;
}

// Post/Status types
export interface LesserPostFragment {
  id: string;
  publishedAt: string;
  content: string;
  contentWarning?: string;
  visibility: 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT';
  isSensitive: boolean;
  language?: string;
  author: LesserAccountFragment;
  attachments: LesserMediaFragment[];
  mentions: LesserMentionFragment[];
  hashtags: LesserHashtagFragment[];
  emojis: LesserEmojiFragment[];
  replyTo?: {
    id: string;
    authorId: string;
  };
  shareOf?: LesserPostFragment;
  interactionCounts: LesserInteractionCounts;
  userInteractions: LesserUserInteractions;
  isPinned: boolean;
  lastEditedAt?: string;
  poll?: LesserPollFragment;
}

export interface LesserInteractionCounts {
  replies: number;
  shares: number;
  favorites: number;
}

export interface LesserUserInteractions {
  isFavorited: boolean;
  isShared: boolean;
  isBookmarked: boolean;
}

// Media attachment types
export interface LesserMediaFragment {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'GIF' | 'UNKNOWN';
  url: string;
  thumbnailUrl?: string;
  remoteUrl?: string;
  altText?: string;
  blurhash?: string;
  metadata?: LesserMediaMetadata;
}

export interface LesserMediaMetadata {
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  duration?: number;
  frameRate?: number;
  bitrate?: number;
  fileSize?: number;
  format?: string;
}

// Mention types
export interface LesserMentionFragment {
  account: {
    id: string;
    handle: string;
    displayName: string;
    profileUrl: string;
  };
}

// Hashtag types
export interface LesserHashtagFragment {
  name: string;
  url: string;
  trendingData?: LesserTrendingData[];
}

export interface LesserTrendingData {
  timestamp: string;
  usage: number;
  accounts: number;
}

// Poll types
export interface LesserPollFragment {
  id: string;
  question: string;
  options: LesserPollOption[];
  expiresAt?: string;
  isExpired: boolean;
  allowsMultiple: boolean;
  totalVotes: number;
  participantCount?: number;
  userVote?: {
    choices: number[];
  };
}

export interface LesserPollOption {
  index: number;
  text: string;
  voteCount?: number;
}

// Notification types
export interface LesserNotificationFragment {
  id: string;
  notificationType: 'MENTION' | 'FOLLOW' | 'FOLLOW_REQUEST' | 'SHARE' | 'FAVORITE' | 'POST' | 'POLL_ENDED' | 'STATUS_UPDATE' | 'ADMIN_SIGNUP' | 'ADMIN_REPORT';
  createdAt: string;
  triggerAccount: LesserAccountFragment;
  targetPost?: LesserPostFragment;
  adminReport?: LesserAdminReportFragment;
  isRead?: boolean;
}

// Admin report types
export interface LesserAdminReportFragment {
  id: string;
  reportedAccount: LesserAccountFragment;
  reporterAccount: LesserAccountFragment;
  reason: string;
  isActionTaken: boolean;
  submittedAt: string;
  category: 'SPAM' | 'HARASSMENT' | 'HATE_SPEECH' | 'OTHER';
}

// Relationship types
export interface LesserRelationshipFragment {
  target: {
    id: string;
  };
  isFollowing: boolean;
  isFollowedBy: boolean;
  hasPendingRequest: boolean;
  isBlocking: boolean;
  isBlockedBy: boolean;
  isMuting: boolean;
  isMutingNotifications: boolean;
  isDomainBlocked: boolean;
  isEndorsed: boolean;
  personalNote?: string;
}

// Search result types
export interface LesserSearchResults {
  accounts: LesserAccountFragment[];
  posts: LesserPostFragment[];
  hashtags: LesserHashtagFragment[];
}

// Timeline types
export interface LesserTimelineConnection {
  edges: LesserTimelineEdge[];
  pageInfo: LesserPageInfo;
  totalCount?: number;
}

export interface LesserTimelineEdge {
  node: LesserPostFragment;
  cursor: string;
}

export interface LesserPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

// Streaming/subscription types
export interface LesserStreamingUpdate {
  __typename: string;
  eventType: 'POST_CREATED' | 'POST_UPDATED' | 'POST_DELETED' | 'NOTIFICATION_CREATED' | 'ACCOUNT_UPDATED';
  timestamp: string;
  data: LesserStreamingData;
}

export type LesserStreamingData = 
  | LesserPostStreamingData
  | LesserNotificationStreamingData
  | LesserAccountStreamingData
  | LesserDeleteStreamingData;

export interface LesserPostStreamingData {
  __typename: 'PostStreamingData';
  post: LesserPostFragment;
  timeline?: string;
}

export interface LesserNotificationStreamingData {
  __typename: 'NotificationStreamingData';
  notification: LesserNotificationFragment;
}

export interface LesserAccountStreamingData {
  __typename: 'AccountStreamingData';
  account: LesserAccountFragment;
}

export interface LesserDeleteStreamingData {
  __typename: 'DeleteStreamingData';
  deletedId: string;
  deletedType: 'POST' | 'ACCOUNT' | 'NOTIFICATION';
}

// Query and mutation types
export interface LesserGetTimelineQuery {
  timeline: LesserTimelineConnection;
}

export interface LesserGetTimelineVariables {
  timelineType: 'HOME' | 'PUBLIC' | 'LOCAL' | 'HASHTAG' | 'LIST';
  first?: number;
  after?: string;
  before?: string;
  hashtag?: string;
  listId?: string;
}

export interface LesserGetNotificationsQuery {
  notifications: {
    edges: Array<{
      node: LesserNotificationFragment;
      cursor: string;
    }>;
    pageInfo: LesserPageInfo;
  };
}

export interface LesserGetNotificationsVariables {
  first?: number;
  after?: string;
  types?: string[];
  excludeTypes?: string[];
}

export interface LesserCreatePostMutation {
  createPost: {
    success: boolean;
    post?: LesserPostFragment;
    errors?: string[];
  };
}

export interface LesserCreatePostVariables {
  content: string;
  visibility: 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT';
  contentWarning?: string;
  isSensitive?: boolean;
  replyToId?: string;
  mediaIds?: string[];
  poll?: {
    question: string;
    options: string[];
    allowsMultiple: boolean;
    expiresIn?: number;
  };
}

// Instance/server info types
export interface LesserInstanceInfo {
  domain: string;
  title: string;
  description: string;
  version: string;
  adminContact: string;
  isRegistrationOpen: boolean;
  requiresApproval: boolean;
  supportedLanguages: string[];
  limits: {
    maxPostLength: number;
    maxMediaAttachments: number;
    maxPollOptions: number;
    maxPollOptionLength: number;
    mediaUploadSizeLimit: number;
  };
  statistics: {
    userCount: number;
    postCount: number;
    federatedInstances: number;
  };
}

// Error handling specific to GraphQL
export interface LesserValidationError {
  field: string;
  code: string;
  message: string;
}

export interface LesserMutationError {
  type: 'VALIDATION' | 'AUTHORIZATION' | 'RATE_LIMIT' | 'SERVER_ERROR';
  message: string;
  details?: LesserValidationError[];
}

// Subscription types for real-time updates
export interface LesserTimelineSubscription {
  timelineUpdated: LesserStreamingUpdate;
}

export interface LesserNotificationSubscription {
  notificationReceived: LesserStreamingUpdate;
}

// Type guards and validation helpers
export function isLesserGraphQLResponse<T>(obj: any): obj is LesserGraphQLResponse<T> {
  return obj && (obj.data !== undefined || Array.isArray(obj.errors));
}

export function isLesserAccountFragment(obj: any): obj is LesserAccountFragment {
  return obj && typeof obj.id === 'string' && typeof obj.handle === 'string';
}

export function isLesserPostFragment(obj: any): obj is LesserPostFragment {
  return obj && typeof obj.id === 'string' && typeof obj.content === 'string' && obj.author;
}

export function isLesserNotificationFragment(obj: any): obj is LesserNotificationFragment {
  return obj && typeof obj.id === 'string' && typeof obj.notificationType === 'string' && obj.triggerAccount;
}

export function isLesserStreamingUpdate(obj: any): obj is LesserStreamingUpdate {
  return obj && typeof obj.__typename === 'string' && typeof obj.eventType === 'string' && obj.data;
}

// GraphQL fragment strings (for actual GraphQL usage)
export const LESSER_ACCOUNT_FRAGMENT = `
  fragment LesserAccount on Account {
    id
    handle
    localHandle
    displayName
    bio
    avatarUrl
    bannerUrl
    joinedAt
    isVerified
    isBot
    isLocked
    followerCount
    followingCount
    postCount
    profileFields {
      label
      content
      verifiedAt
    }
    customEmojis {
      code
      imageUrl
      staticUrl
      category
      isVisible
    }
  }
`;

export const LESSER_POST_FRAGMENT = `
  fragment LesserPost on Post {
    id
    publishedAt
    content
    contentWarning
    visibility
    isSensitive
    language
    author {
      ...LesserAccount
    }
    attachments {
      id
      mediaType
      url
      thumbnailUrl
      remoteUrl
      altText
      blurhash
      metadata {
        dimensions {
          width
          height
          aspectRatio
        }
        duration
        frameRate
        bitrate
      }
    }
    mentions {
      account {
        id
        handle
        displayName
        profileUrl
      }
    }
    hashtags {
      name
      url
    }
    emojis {
      code
      imageUrl
      staticUrl
    }
    replyTo {
      id
      authorId
    }
    shareOf {
      ...LesserPost
    }
    interactionCounts {
      replies
      shares
      favorites
    }
    userInteractions {
      isFavorited
      isShared
      isBookmarked
    }
    isPinned
    lastEditedAt
    poll {
      id
      question
      options {
        index
        text
        voteCount
      }
      expiresAt
      isExpired
      allowsMultiple
      totalVotes
      participantCount
      userVote {
        choices
      }
    }
  }
`;

export const LESSER_NOTIFICATION_FRAGMENT = `
  fragment LesserNotification on Notification {
    id
    notificationType
    createdAt
    triggerAccount {
      ...LesserAccount
    }
    targetPost {
      ...LesserPost
    }
    isRead
  }
`;

// Constants for validation
export const LESSER_VISIBILITY_VALUES = ['PUBLIC', 'UNLISTED', 'FOLLOWERS', 'DIRECT'] as const;
export const LESSER_MEDIA_TYPES = ['IMAGE', 'VIDEO', 'AUDIO', 'GIF', 'UNKNOWN'] as const;
export const LESSER_NOTIFICATION_TYPES = [
  'MENTION', 'FOLLOW', 'FOLLOW_REQUEST', 'SHARE', 'FAVORITE', 
  'POST', 'POLL_ENDED', 'STATUS_UPDATE', 'ADMIN_SIGNUP', 'ADMIN_REPORT'
] as const;