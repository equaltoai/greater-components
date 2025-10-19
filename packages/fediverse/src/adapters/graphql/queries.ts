/**
 * GraphQL Queries and Mutations for Lesser
 * 
 * Pre-built GraphQL queries, mutations, and subscriptions for common
 * ActivityPub operations.
 * 
 * @module adapters/graphql/queries
 */

/**
 * Fragment for Actor fields
 */
export const ACTOR_FRAGMENT = `
  fragment ActorFields on Actor {
    id
    username
    domain
    displayName
    summary
    avatar
    header
    followers
    following
    statusesCount
    bot
    locked
    createdAt
    updatedAt
    trustScore
    fields {
      name
      value
      verifiedAt
    }
  }
`;

/**
 * Fragment for Note fields
 */
export const NOTE_FRAGMENT = `
  fragment NoteFields on Note {
    id
    type
    attributedTo
    content
    summary
    published
    to
    cc
    inReplyTo
    sensitive
    attachment {
      type
      url
      mediaType
      name
      blurhash
      width
      height
    }
    tag {
      type
      name
      href
      icon {
        url
        mediaType
      }
    }
    replies {
      totalItems
    }
    likes {
      totalItems
    }
    shares {
      totalItems
    }
  }
`;

/**
 * Fragment for Activity fields
 */
export const ACTIVITY_FRAGMENT = `
  fragment ActivityFields on Activity {
    id
    type
    actor
    published
    to
    cc
  }
`;

/**
 * Fragment for user preferences
 */
export const USER_PREFERENCES_FRAGMENT = `
  fragment UserPreferencesFields on UserPreferences {
    actorId
    posting {
      defaultVisibility
      defaultSensitive
      defaultLanguage
    }
    reading {
      expandSpoilers
      expandMedia
      autoplayGifs
      timelineOrder
    }
    discovery {
      showFollowCounts
      searchSuggestionsEnabled
      personalizedSearchEnabled
    }
    streaming {
      defaultQuality
      autoQuality
      preloadNext
      dataSaver
    }
    notifications {
      email
      push
      inApp
      digest
    }
    privacy {
      defaultVisibility
      indexable
      showOnlineStatus
    }
    reblogFilters {
      key
      enabled
    }
  }
`;

/**
 * Fragment for push subscription
 */
export const PUSH_SUBSCRIPTION_FRAGMENT = `
  fragment PushSubscriptionFields on PushSubscription {
    id
    endpoint
    keys {
      auth
      p256dh
    }
    alerts {
      follow
      favourite
      reblog
      mention
      poll
      followRequest
      status
      update
      adminSignUp
      adminReport
    }
    policy
    serverKey
    createdAt
    updatedAt
  }
`;

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get timeline
 */
export const GET_TIMELINE = `
  ${ACTIVITY_FRAGMENT}
  ${NOTE_FRAGMENT}
  query GetTimeline($limit: Int, $cursor: String, $type: TimelineType) {
    timeline(limit: $limit, cursor: $cursor, type: $type) {
      items {
        ...ActivityFields
        object {
          ... on Note {
            ...NoteFields
          }
        }
      }
      nextCursor
      prevCursor
    }
  }
`;

/**
 * Get actor by ID or username
 */
export const GET_ACTOR = `
  ${ACTOR_FRAGMENT}
  query GetActor($id: String, $username: String) {
    actor(id: $id, username: $username) {
      ...ActorFields
    }
  }
`;

/**
 * Get note by ID
 */
export const GET_NOTE = `
  ${NOTE_FRAGMENT}
  query GetNote($id: String!) {
    note(id: $id) {
      ...NoteFields
    }
  }
`;

/**
 * Get thread (conversation)
 */
export const GET_THREAD = `
  ${NOTE_FRAGMENT}
  ${ACTIVITY_FRAGMENT}
  query GetThread($id: String!) {
    thread(id: $id) {
      root {
        ...NoteFields
      }
      replies {
        ...ActivityFields
        object {
          ... on Note {
            ...NoteFields
          }
        }
      }
    }
  }
`;

/**
 * Search actors, notes, and tags
 */
export const SEARCH = `
  ${ACTOR_FRAGMENT}
  ${NOTE_FRAGMENT}
  query Search($query: String!, $type: SearchType, $limit: Int) {
    search(query: $query, type: $type, limit: $limit) {
      actors {
        ...ActorFields
      }
      notes {
        ...NoteFields
      }
      tags {
        name
        count
      }
    }
  }
`;

/**
 * Get followers
 */
export const GET_FOLLOWERS = `
  ${ACTOR_FRAGMENT}
  query GetFollowers($username: String!, $limit: Int, $cursor: Cursor) {
    followers(username: $username, limit: $limit, cursor: $cursor) {
      actors {
        ...ActorFields
      }
      totalCount
      nextCursor
    }
  }
`;

/**
 * Get following
 */
export const GET_FOLLOWING = `
  ${ACTOR_FRAGMENT}
  query GetFollowing($username: String!, $limit: Int, $cursor: Cursor) {
    following(username: $username, limit: $limit, cursor: $cursor) {
      actors {
        ...ActorFields
      }
      totalCount
      nextCursor
    }
  }
`;

/**
 * Get notifications
 */
export const GET_NOTIFICATIONS = `
  ${ACTIVITY_FRAGMENT}
  ${NOTE_FRAGMENT}
  query GetNotifications($limit: Int, $cursor: String, $unreadOnly: Boolean) {
    notifications(limit: $limit, cursor: $cursor, unreadOnly: $unreadOnly) {
      items {
        id
        activity {
          ...ActivityFields
          object {
            ... on Note {
              ...NoteFields
            }
          }
        }
        read
        createdAt
      }
      nextCursor
      unreadCount
    }
  }
`;

/**
 * Get actor's outbox (posts)
 */
export const GET_OUTBOX = `
  ${NOTE_FRAGMENT}
  ${ACTIVITY_FRAGMENT}
  query GetOutbox($id: String!, $limit: Int, $cursor: String) {
    outbox(id: $id, limit: $limit, cursor: $cursor) {
      items {
        ...ActivityFields
        object {
          ... on Note {
            ...NoteFields
          }
        }
      }
      nextCursor
    }
  }
`;

/**
 * Get bookmarks
 */
export const GET_BOOKMARKS = `
  ${NOTE_FRAGMENT}
  query GetBookmarks($limit: Int, $cursor: String) {
    bookmarks(limit: $limit, cursor: $cursor) {
      items {
        ...NoteFields
      }
      nextCursor
    }
  }
`;

/**
 * Get lists
 */
export const GET_LISTS = `
  query GetLists {
    lists {
      id
      name
      repliesPolicy
      membersCount
    }
  }
`;

/**
 * Get list timeline
 */
export const GET_LIST_TIMELINE = `
  ${NOTE_FRAGMENT}
  ${ACTIVITY_FRAGMENT}
  query GetListTimeline($listId: String!, $limit: Int, $cursor: String) {
    listTimeline(listId: $listId, limit: $limit, cursor: $cursor) {
      items {
        ...ActivityFields
        object {
          ... on Note {
            ...NoteFields
          }
        }
      }
      nextCursor
    }
  }
`;

/**
 * Get user preferences
 */
export const GET_USER_PREFERENCES = `
  ${USER_PREFERENCES_FRAGMENT}
  query GetUserPreferences {
    userPreferences {
      ...UserPreferencesFields
    }
  }
`;

/**
 * Get push subscription
 */
export const GET_PUSH_SUBSCRIPTION = `
  ${PUSH_SUBSCRIPTION_FRAGMENT}
  query GetPushSubscription {
    pushSubscription {
      ...PushSubscriptionFields
    }
  }
`;

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new note (post)
 */
export const CREATE_NOTE = `
  ${NOTE_FRAGMENT}
  ${ACTIVITY_FRAGMENT}
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      activity {
        ...ActivityFields
      }
      note {
        ...NoteFields
      }
    }
  }
`;

/**
 * Update a note
 */
export const UPDATE_NOTE = `
  ${NOTE_FRAGMENT}
  ${ACTIVITY_FRAGMENT}
  mutation UpdateNote($id: String!, $input: UpdateNoteInput!) {
    updateNote(id: $id, input: $input) {
      activity {
        ...ActivityFields
      }
      note {
        ...NoteFields
      }
    }
  }
`;

/**
 * Delete a note
 */
export const DELETE_NOTE = `
  ${ACTIVITY_FRAGMENT}
  mutation DeleteNote($id: String!) {
    deleteNote(id: $id) {
      activity {
        ...ActivityFields
      }
    }
  }
`;

/**
 * Like a note
 */
export const LIKE_NOTE = `
  ${ACTIVITY_FRAGMENT}
  mutation LikeNote($id: String!) {
    like(id: $id) {
      activity {
        ...ActivityFields
      }
    }
  }
`;

/**
 * Unlike a note
 */
export const UNLIKE_NOTE = `
  ${ACTIVITY_FRAGMENT}
  mutation UnlikeNote($id: String!) {
    unlike(id: $id) {
      activity {
        ...ActivityFields
      }
    }
  }
`;

/**
 * Announce (boost/reblog) a note
 */
export const ANNOUNCE_NOTE = `
  ${ACTIVITY_FRAGMENT}
  mutation AnnounceNote($id: String!) {
    announce(id: $id) {
      activity {
        ...ActivityFields
      }
    }
  }
`;

/**
 * Unannounce a note
 */
export const UNANNOUNCE_NOTE = `
  ${ACTIVITY_FRAGMENT}
  mutation UnannounceNote($id: String!) {
    unannounce(id: $id) {
      activity {
        ...ActivityFields
      }
    }
  }
`;

/**
 * Follow an actor
 */
export const FOLLOW_ACTOR = `
  ${ACTIVITY_FRAGMENT}
  mutation FollowActor($id: String!) {
    follow(id: $id) {
      activity {
        ...ActivityFields
      }
    }
  }
`;

/**
 * Unfollow an actor
 */
export const UNFOLLOW_ACTOR = `
  ${ACTIVITY_FRAGMENT}
  mutation UnfollowActor($id: String!) {
    unfollow(id: $id) {
      activity {
        ...ActivityFields
      }
    }
  }
`;

/**
 * Block an actor
 */
export const BLOCK_ACTOR = `
  mutation BlockActor($id: String!) {
    block(id: $id) {
      success
    }
  }
`;

/**
 * Unblock an actor
 */
export const UNBLOCK_ACTOR = `
  mutation UnblockActor($id: String!) {
    unblock(id: $id) {
      success
    }
  }
`;

/**
 * Mute an actor
 */
export const MUTE_ACTOR = `
  mutation MuteActor($id: String!, $notifications: Boolean) {
    mute(id: $id, notifications: $notifications) {
      success
    }
  }
`;

/**
 * Unmute an actor
 */
export const UNMUTE_ACTOR = `
  mutation UnmuteActor($id: String!) {
    unmute(id: $id) {
      success
    }
  }
`;

/**
 * Bookmark a note
 */
export const BOOKMARK_NOTE = `
  mutation BookmarkNote($id: String!) {
    bookmark(id: $id) {
      success
    }
  }
`;

/**
 * Remove bookmark
 */
export const UNBOOKMARK_NOTE = `
  mutation UnbookmarkNote($id: String!) {
    unbookmark(id: $id) {
      success
    }
  }
`;

/**
 * Mark notification as read
 */
export const MARK_NOTIFICATION_READ = `
  mutation MarkNotificationRead($id: String!) {
    markNotificationRead(id: $id) {
      success
    }
  }
`;

/**
 * Mark all notifications as read
 */
export const MARK_ALL_NOTIFICATIONS_READ = `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
    }
  }
`;

/**
 * Report content or actor
 */
export const REPORT = `
  mutation Report($input: ReportInput!) {
    report(input: $input) {
      success
      reportId
    }
  }
`;

/**
 * Update actor profile
 */
export const UPDATE_PROFILE = `
  ${ACTOR_FRAGMENT}
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...ActorFields
    }
  }
`;

/**
 * Update user preferences
 */
export const UPDATE_USER_PREFERENCES = `
  ${USER_PREFERENCES_FRAGMENT}
  mutation UpdateUserPreferences($input: UpdateUserPreferencesInput!) {
    updateUserPreferences(input: $input) {
      ...UserPreferencesFields
    }
  }
`;

/**
 * Update streaming preferences
 */
export const UPDATE_STREAMING_PREFERENCES = `
  mutation UpdateStreamingPreferences($input: StreamingPreferencesInput!) {
    updateStreamingPreferences(input: $input) {
      actorId
      streaming {
        defaultQuality
        autoQuality
        preloadNext
        dataSaver
      }
    }
  }
`;

/**
 * Register push subscription
 */
export const REGISTER_PUSH_SUBSCRIPTION = `
  ${PUSH_SUBSCRIPTION_FRAGMENT}
  mutation RegisterPushSubscription($input: RegisterPushSubscriptionInput!) {
    registerPushSubscription(input: $input) {
      ...PushSubscriptionFields
    }
  }
`;

/**
 * Update push subscription
 */
export const UPDATE_PUSH_SUBSCRIPTION = `
  ${PUSH_SUBSCRIPTION_FRAGMENT}
  mutation UpdatePushSubscription($input: UpdatePushSubscriptionInput!) {
    updatePushSubscription(input: $input) {
      ...PushSubscriptionFields
    }
  }
`;

/**
 * Delete push subscription
 */
export const DELETE_PUSH_SUBSCRIPTION = `
  mutation DeletePushSubscription {
    deletePushSubscription
  }
`;

// ============================================================================
// SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to timeline updates
 */
export const SUBSCRIBE_TIMELINE = `
  ${ACTIVITY_FRAGMENT}
  ${NOTE_FRAGMENT}
  subscription SubscribeTimeline($type: TimelineType) {
    timeline(type: $type) {
      activity {
        ...ActivityFields
        object {
          ... on Note {
            ...NoteFields
          }
        }
      }
    }
  }
`;

/**
 * Subscribe to new notifications
 */
export const SUBSCRIBE_NOTIFICATIONS = `
  ${ACTIVITY_FRAGMENT}
  ${NOTE_FRAGMENT}
  subscription SubscribeNotifications {
    notifications {
      id
      activity {
        ...ActivityFields
        object {
          ... on Note {
            ...NoteFields
          }
        }
      }
      read
      createdAt
    }
  }
`;

/**
 * Subscribe to account updates
 */
export const SUBSCRIBE_ACCOUNT = `
  ${ACTOR_FRAGMENT}
  subscription SubscribeAccount {
    account {
      ...ActorFields
    }
  }
`;
