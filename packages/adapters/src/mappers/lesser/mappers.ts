/**
 * Lesser GraphQL API payload mappers
 * Transform Lesser GraphQL API responses to unified models
 */

import type {
  LesserAccountFragment,
  LesserPostFragment,
  LesserNotificationFragment,
  LesserMediaFragment,
  LesserMentionFragment,
  LesserHashtagFragment,
  LesserEmojiFragment,
  LesserPollFragment,
  LesserRelationshipFragment,
  LesserStreamingUpdate,
  LesserDeleteStreamingData,
  LesserGraphQLResponse,
  LesserGraphQLError,
  LesserTimelineConnection,
} from './types.js';

import type {
  UnifiedAccount,
  UnifiedStatus,
  UnifiedNotification,
  MediaAttachment,
  Mention,
  Tag,
  CustomEmoji,
  Poll,
  AccountRelationship,
  StreamingUpdate,
  StreamingDelete,
  StreamingEdit,
  MapperResult,
  BatchMapperResult,
  MappingError,
  SourceMetadata,
} from '../../models/unified.js';

/**
 * Create source metadata for Lesser GraphQL payloads
 */
function createLesserMetadata(rawPayload?: unknown): SourceMetadata {
  return {
    source: 'lesser',
    apiVersion: 'graphql-v1',
    lastUpdated: Date.now(),
    rawPayload,
  };
}

/**
 * Create a mapping error with GraphQL context
 */
function createMappingError(
  type: MappingError['type'],
  message: string,
  payload?: unknown,
  fieldPath?: string,
  graphqlErrors?: LesserGraphQLError[]
): MappingError {
  const error = new Error(message) as MappingError;
  error.type = type;
  error.payload = payload;
  error.fieldPath = fieldPath;
  error.source = {
    api: 'lesser',
    version: 'graphql-v1',
  };
  
  // Add GraphQL error context if available
  if (graphqlErrors && graphqlErrors.length > 0) {
    error.message += ` GraphQL errors: ${graphqlErrors.map(e => e.message).join(', ')}`;
  }
  
  return error;
}

/**
 * Safely extract string field with fallback
 */
function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

/**
 * Safely extract number field with fallback
 */
function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' ? value : fallback;
}

/**
 * Safely extract boolean field with fallback
 */
function safeBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

/**
 * Map Lesser GraphQL visibility to unified visibility
 */
function mapLesserVisibility(visibility: string): 'public' | 'unlisted' | 'private' | 'direct' {
  switch (visibility) {
    case 'PUBLIC': return 'public';
    case 'UNLISTED': return 'unlisted';
    case 'FOLLOWERS': return 'private';
    case 'DIRECT': return 'direct';
    default: return 'public';
  }
}

/**
 * Map Lesser media type to unified media type
 */
function mapLesserMediaType(mediaType: string): 'image' | 'video' | 'audio' | 'gifv' | 'unknown' {
  switch (mediaType) {
    case 'IMAGE': return 'image';
    case 'VIDEO': return 'video';
    case 'AUDIO': return 'audio';
    case 'GIF': return 'gifv';
    default: return 'unknown';
  }
}

/**
 * Map Lesser notification type to unified notification type
 */
function mapLesserNotificationType(type: string): UnifiedNotification['type'] {
  switch (type) {
    case 'MENTION': return 'mention';
    case 'FOLLOW': return 'follow';
    case 'FOLLOW_REQUEST': return 'follow_request';
    case 'SHARE': return 'reblog';
    case 'FAVORITE': return 'favourite';
    case 'POST': return 'status';
    case 'POLL_ENDED': return 'poll';
    case 'STATUS_UPDATE': return 'update';
    case 'ADMIN_SIGNUP': return 'admin.sign_up';
    case 'ADMIN_REPORT': return 'admin.report';
    default: return 'mention';
  }
}

/**
 * Map Lesser account to unified account model
 */
export function mapLesserAccount(account: LesserAccountFragment, relationship?: LesserRelationshipFragment): MapperResult<UnifiedAccount> {
  const startTime = performance.now();
  
  try {
    if (!account || typeof account.id !== 'string') {
      return {
        success: false,
        error: createMappingError('validation', 'Invalid account: missing or invalid id', account),
      };
    }

    const unified: UnifiedAccount = {
      id: account.id,
      username: safeString(account.localHandle || account.handle.split('@')[0]),
      acct: safeString(account.handle),
      displayName: safeString(account.displayName),
      note: safeString(account.bio),
      avatar: safeString(account.avatarUrl),
      header: safeString(account.bannerUrl),
      createdAt: safeString(account.joinedAt),
      followersCount: safeNumber(account.followerCount),
      followingCount: safeNumber(account.followingCount),
      statusesCount: safeNumber(account.postCount),
      locked: safeBoolean(account.isLocked),
      verified: safeBoolean(account.isVerified),
      bot: safeBoolean(account.isBot),
      fields: (account.profileFields || []).map(field => ({
        name: safeString(field.label),
        value: safeString(field.content),
        verifiedAt: field.verifiedAt || undefined,
      })),
      relationship: relationship ? mapLesserRelationship(relationship) : undefined,
      metadata: createLesserMetadata(account),
    };

    const endTime = performance.now();
    return {
      success: true,
      data: unified,
      metrics: {
        mappingTimeMs: endTime - startTime,
        fieldsProcessed: Object.keys(account).length,
        fallbacksUsed: 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createMappingError('transformation', `Failed to map account: ${error instanceof Error ? error.message : 'Unknown error'}`, account),
    };
  }
}

/**
 * Map Lesser relationship to unified relationship model
 */
function mapLesserRelationship(relationship: LesserRelationshipFragment): AccountRelationship {
  return {
    following: safeBoolean(relationship.isFollowing),
    followedBy: safeBoolean(relationship.isFollowedBy),
    requested: safeBoolean(relationship.hasPendingRequest),
    blocking: safeBoolean(relationship.isBlocking),
    muting: safeBoolean(relationship.isMuting),
    mutingNotifications: safeBoolean(relationship.isMutingNotifications),
    domainBlocking: safeBoolean(relationship.isDomainBlocked),
    endorsed: safeBoolean(relationship.isEndorsed),
    note: relationship.personalNote || undefined,
  };
}

/**
 * Map Lesser post to unified status model
 */
export function mapLesserPost(post: LesserPostFragment): MapperResult<UnifiedStatus> {
  const startTime = performance.now();
  
  try {
    if (!post || typeof post.id !== 'string') {
      return {
        success: false,
        error: createMappingError('validation', 'Invalid post: missing or invalid id', post),
      };
    }

    if (!post.author) {
      return {
        success: false,
        error: createMappingError('validation', 'Invalid post: missing author', post),
      };
    }

    const accountResult = mapLesserAccount(post.author);
    if (!accountResult.success) {
      return {
        success: false,
        error: createMappingError('transformation', 'Failed to map post author', post, 'author'),
      };
    }

    const unified: UnifiedStatus = {
      id: post.id,
      createdAt: safeString(post.publishedAt),
      content: safeString(post.content),
      spoilerText: post.contentWarning || undefined,
      visibility: mapLesserVisibility(post.visibility || 'PUBLIC'),
      sensitive: safeBoolean(post.isSensitive),
      language: post.language || undefined,
      account: accountResult.data!,
      mediaAttachments: (post.attachments || []).map(mapLesserMediaAttachment),
      mentions: (post.mentions || []).map(mapLesserMention),
      tags: (post.hashtags || []).map(mapLesserHashtag),
      emojis: (post.emojis || []).map(mapLesserEmoji),
      inReplyTo: post.replyTo ? {
        id: post.replyTo.id,
        accountId: safeString(post.replyTo.authorId),
      } : undefined,
      reblog: post.shareOf ? mapLesserPost(post.shareOf).data : undefined,
      repliesCount: safeNumber(post.interactionCounts?.replies),
      reblogsCount: safeNumber(post.interactionCounts?.shares),
      favouritesCount: safeNumber(post.interactionCounts?.favorites),
      favourited: safeBoolean(post.userInteractions?.isFavorited),
      reblogged: safeBoolean(post.userInteractions?.isShared),
      bookmarked: safeBoolean(post.userInteractions?.isBookmarked),
      pinned: safeBoolean(post.isPinned),
      editedAt: post.lastEditedAt || undefined,
      poll: post.poll ? mapLesserPoll(post.poll) : undefined,
      metadata: createLesserMetadata(post),
    };

    const endTime = performance.now();
    return {
      success: true,
      data: unified,
      metrics: {
        mappingTimeMs: endTime - startTime,
        fieldsProcessed: Object.keys(post).length,
        fallbacksUsed: 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createMappingError('transformation', `Failed to map post: ${error instanceof Error ? error.message : 'Unknown error'}`, post),
    };
  }
}

/**
 * Map Lesser media attachment to unified model
 */
function mapLesserMediaAttachment(attachment: LesserMediaFragment): MediaAttachment {
  return {
    id: safeString(attachment.id),
    type: mapLesserMediaType(attachment.mediaType || 'UNKNOWN'),
    url: safeString(attachment.url),
    previewUrl: attachment.thumbnailUrl || undefined,
    remoteUrl: attachment.remoteUrl || undefined,
    description: attachment.altText || undefined,
    blurhash: attachment.blurhash || undefined,
    meta: attachment.metadata ? {
      original: attachment.metadata.dimensions ? {
        width: safeNumber(attachment.metadata.dimensions.width),
        height: safeNumber(attachment.metadata.dimensions.height),
        aspect: safeNumber(attachment.metadata.dimensions.aspectRatio),
        duration: attachment.metadata.duration || undefined,
        fps: attachment.metadata.frameRate || undefined,
        bitrate: attachment.metadata.bitrate || undefined,
      } : undefined,
    } : undefined,
  };
}

/**
 * Map Lesser mention to unified model
 */
function mapLesserMention(mention: LesserMentionFragment): Mention {
  return {
    id: safeString(mention.account.id),
    username: safeString(mention.account.handle.split('@')[0]),
    acct: safeString(mention.account.handle),
    url: safeString(mention.account.profileUrl),
  };
}

/**
 * Map Lesser hashtag to unified model
 */
function mapLesserHashtag(hashtag: LesserHashtagFragment): Tag {
  return {
    name: safeString(hashtag.name),
    url: safeString(hashtag.url),
    history: hashtag.trendingData?.map(data => ({
      day: safeString(data.timestamp),
      uses: safeString(data.usage),
      accounts: safeString(data.accounts),
    })),
  };
}

/**
 * Map Lesser emoji to unified model
 */
function mapLesserEmoji(emoji: LesserEmojiFragment): CustomEmoji {
  return {
    shortcode: safeString(emoji.code),
    staticUrl: safeString(emoji.staticUrl),
    url: safeString(emoji.imageUrl),
    visibleInPicker: safeBoolean(emoji.isVisible),
    category: emoji.category || undefined,
  };
}

/**
 * Map Lesser poll to unified model
 */
function mapLesserPoll(poll: LesserPollFragment): Poll {
  return {
    id: safeString(poll.id),
    expiresAt: poll.expiresAt || undefined,
    expired: safeBoolean(poll.isExpired),
    multiple: safeBoolean(poll.allowsMultiple),
    votesCount: safeNumber(poll.totalVotes),
    votersCount: poll.participantCount !== undefined ? safeNumber(poll.participantCount) : undefined,
    options: (poll.options || []).map(option => ({
      title: safeString(option.text),
      votesCount: option.voteCount !== undefined ? safeNumber(option.voteCount) : undefined,
    })),
    voted: poll.userVote !== undefined,
    ownVotes: poll.userVote?.choices || undefined,
  };
}

/**
 * Map Lesser notification to unified notification model
 */
export function mapLesserNotification(notification: LesserNotificationFragment): MapperResult<UnifiedNotification> {
  const startTime = performance.now();
  
  try {
    if (!notification || typeof notification.id !== 'string') {
      return {
        success: false,
        error: createMappingError('validation', 'Invalid notification: missing or invalid id', notification),
      };
    }

    if (!notification.triggerAccount) {
      return {
        success: false,
        error: createMappingError('validation', 'Invalid notification: missing trigger account', notification),
      };
    }

    const accountResult = mapLesserAccount(notification.triggerAccount);
    if (!accountResult.success) {
      return {
        success: false,
        error: createMappingError('transformation', 'Failed to map notification account', notification, 'triggerAccount'),
      };
    }

    let status: UnifiedStatus | undefined;
    if (notification.targetPost) {
      const statusResult = mapLesserPost(notification.targetPost);
      if (statusResult.success) {
        status = statusResult.data;
      }
    }

    const unified: UnifiedNotification = {
      id: notification.id,
      type: mapLesserNotificationType(notification.notificationType),
      createdAt: safeString(notification.createdAt),
      account: accountResult.data!,
      status,
      report: notification.adminReport ? {
        id: safeString(notification.adminReport.id),
        targetAccount: accountResult.data!, // Note: In real implementation, map the actual reported account
        account: accountResult.data!,
        comment: safeString(notification.adminReport.reason),
        actionTaken: safeBoolean(notification.adminReport.isActionTaken),
        createdAt: safeString(notification.adminReport.submittedAt),
      } : undefined,
      read: notification.isRead,
      metadata: createLesserMetadata(notification),
    };

    const endTime = performance.now();
    return {
      success: true,
      data: unified,
      metrics: {
        mappingTimeMs: endTime - startTime,
        fieldsProcessed: Object.keys(notification).length,
        fallbacksUsed: 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createMappingError('transformation', `Failed to map notification: ${error instanceof Error ? error.message : 'Unknown error'}`, notification),
    };
  }
}

/**
 * Map Lesser streaming update to unified streaming models
 */
export function mapLesserStreamingUpdate(update: LesserStreamingUpdate): MapperResult<StreamingUpdate | StreamingDelete | StreamingEdit> {
  const startTime = performance.now();
  
  try {
    if (!update || typeof update.eventType !== 'string') {
      return {
        success: false,
        error: createMappingError('validation', 'Invalid streaming update: missing or invalid event type', update),
      };
    }

    const timestamp = new Date(update.timestamp).getTime();
    const metadata = createLesserMetadata(update);

    // Handle delete events
    if (update.eventType === 'POST_DELETED') {
      const deleteData = update.data as LesserDeleteStreamingData;
      const deleteUpdate: StreamingDelete = {
        id: safeString(deleteData.deletedId),
        itemType: deleteData.deletedType === 'POST' ? 'status' : deleteData.deletedType === 'ACCOUNT' ? 'account' : 'notification',
        timestamp,
      };

      const endTime = performance.now();
      return {
        success: true,
        data: deleteUpdate,
        metrics: {
          mappingTimeMs: endTime - startTime,
          fieldsProcessed: 3,
          fallbacksUsed: 0,
        },
      };
    }

    // Handle post created/updated events
    if (update.eventType === 'POST_CREATED' || update.eventType === 'POST_UPDATED') {
      const postData = update.data as any;
      if (postData.post) {
        const postResult = mapLesserPost(postData.post);
        if (postResult.success) {
          if (update.eventType === 'POST_UPDATED') {
            const editUpdate: StreamingEdit = {
              id: postResult.data!.id,
              data: postResult.data!,
              timestamp,
              editType: 'content',
            };

            const endTime = performance.now();
            return {
              success: true,
              data: editUpdate,
              metrics: {
                mappingTimeMs: endTime - startTime,
                fieldsProcessed: Object.keys(postData.post).length,
                fallbacksUsed: 0,
              },
            };
          }
        }
      }
    }

    // Handle generic streaming update
    const streamingUpdate: StreamingUpdate = {
      type: update.eventType === 'POST_CREATED' ? 'status' :
           update.eventType === 'NOTIFICATION_CREATED' ? 'notification' :
           update.eventType === 'ACCOUNT_UPDATED' ? 'status' :
           'status',
      payload: update.data,
      stream: 'lesser-stream',
      timestamp,
      metadata,
    };

    const endTime = performance.now();
    return {
      success: true,
      data: streamingUpdate,
      metrics: {
        mappingTimeMs: endTime - startTime,
        fieldsProcessed: Object.keys(update).length,
        fallbacksUsed: 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: createMappingError('transformation', `Failed to map streaming update: ${error instanceof Error ? error.message : 'Unknown error'}`, update),
    };
  }
}

/**
 * Handle GraphQL response wrapper and extract data
 */
export function handleLesserGraphQLResponse<T>(response: LesserGraphQLResponse<T>): MapperResult<T> {
  if (response.errors && response.errors.length > 0) {
    return {
      success: false,
      error: createMappingError(
        'validation',
        'GraphQL response contains errors',
        response,
        undefined,
        response.errors
      ),
    };
  }

  if (!response.data) {
    return {
      success: false,
      error: createMappingError('validation', 'GraphQL response missing data', response),
    };
  }

  return {
    success: true,
    data: response.data,
  };
}

/**
 * Map Lesser timeline connection to posts
 */
export function mapLesserTimelineConnection(connection: LesserTimelineConnection): BatchMapperResult<UnifiedStatus> {
  const startTime = performance.now();
  const successful: UnifiedStatus[] = [];
  const failed: { payload: unknown; error: MappingError }[] = [];

  if (!connection.edges) {
    return {
      successful,
      failed,
      totalProcessed: 0,
      processingTimeMs: 0,
    };
  }

  for (const edge of connection.edges) {
    if (edge.node) {
      const result = mapLesserPost(edge.node);
      if (result.success && result.data) {
        successful.push(result.data);
      } else if (result.error) {
        failed.push({ payload: edge.node, error: result.error });
      }
    }
  }

  const endTime = performance.now();
  return {
    successful,
    failed,
    totalProcessed: connection.edges.length,
    processingTimeMs: endTime - startTime,
  };
}

/**
 * Batch map multiple Lesser accounts
 */
export function batchMapLesserAccounts(accounts: LesserAccountFragment[], relationships?: Map<string, LesserRelationshipFragment>): BatchMapperResult<UnifiedAccount> {
  const startTime = performance.now();
  const successful: UnifiedAccount[] = [];
  const failed: { payload: unknown; error: MappingError }[] = [];

  for (const account of accounts) {
    const relationship = relationships?.get(account.id);
    const result = mapLesserAccount(account, relationship);
    
    if (result.success && result.data) {
      successful.push(result.data);
    } else if (result.error) {
      failed.push({ payload: account, error: result.error });
    }
  }

  const endTime = performance.now();
  return {
    successful,
    failed,
    totalProcessed: accounts.length,
    processingTimeMs: endTime - startTime,
  };
}

/**
 * Batch map multiple Lesser posts
 */
export function batchMapLesserPosts(posts: LesserPostFragment[]): BatchMapperResult<UnifiedStatus> {
  const startTime = performance.now();
  const successful: UnifiedStatus[] = [];
  const failed: { payload: unknown; error: MappingError }[] = [];

  for (const post of posts) {
    const result = mapLesserPost(post);
    
    if (result.success && result.data) {
      successful.push(result.data);
    } else if (result.error) {
      failed.push({ payload: post, error: result.error });
    }
  }

  const endTime = performance.now();
  return {
    successful,
    failed,
    totalProcessed: posts.length,
    processingTimeMs: endTime - startTime,
  };
}

/**
 * Batch map multiple Lesser notifications
 */
export function batchMapLesserNotifications(notifications: LesserNotificationFragment[]): BatchMapperResult<UnifiedNotification> {
  const startTime = performance.now();
  const successful: UnifiedNotification[] = [];
  const failed: { payload: unknown; error: MappingError }[] = [];

  for (const notification of notifications) {
    const result = mapLesserNotification(notification);
    
    if (result.success && result.data) {
      successful.push(result.data);
    } else if (result.error) {
      failed.push({ payload: notification, error: result.error });
    }
  }

  const endTime = performance.now();
  return {
    successful,
    failed,
    totalProcessed: notifications.length,
    processingTimeMs: endTime - startTime,
  };
}