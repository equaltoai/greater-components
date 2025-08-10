/**
 * Unified data models for Fediverse concepts
 * These models provide a consistent interface across different API sources
 */

// Base metadata interface for tracking source information
export interface SourceMetadata {
  /** Original API source */
  source: 'mastodon' | 'lesser' | 'unknown';
  /** Source-specific API version */
  apiVersion: string;
  /** Timestamp when this data was last updated */
  lastUpdated: number;
  /** Original raw payload for debugging */
  rawPayload?: unknown;
}

// User/Account unified model
export interface UnifiedAccount {
  /** Unique identifier (may be different format per platform) */
  id: string;
  /** Username without domain */
  username: string;
  /** Full username with domain (e.g., user@domain.com) */
  acct: string;
  /** Display name */
  displayName: string;
  /** User bio/note in HTML */
  note: string;
  /** Avatar image URL */
  avatar: string;
  /** Header/banner image URL */
  header: string;
  /** Account creation date */
  createdAt: string;
  /** Follower count */
  followersCount: number;
  /** Following count */
  followingCount: number;
  /** Post count */
  statusesCount: number;
  /** Whether account is locked/requires approval */
  locked: boolean;
  /** Whether account is verified */
  verified: boolean;
  /** Whether this is a bot account */
  bot: boolean;
  /** Account fields/metadata */
  fields: AccountField[];
  /** Relationship to current user (if applicable) */
  relationship?: AccountRelationship;
  /** Source metadata */
  metadata: SourceMetadata;
}

export interface AccountField {
  /** Field name */
  name: string;
  /** Field value (HTML) */
  value: string;
  /** Verification timestamp if verified */
  verifiedAt?: string;
}

export interface AccountRelationship {
  /** Whether current user follows this account */
  following: boolean;
  /** Whether current user is followed by this account */
  followedBy: boolean;
  /** Whether current user has requested to follow */
  requested: boolean;
  /** Whether this account is blocked */
  blocking: boolean;
  /** Whether this account is muted */
  muting: boolean;
  /** Whether this account's boosts are muted */
  mutingNotifications: boolean;
  /** Whether this account is domain blocked */
  domainBlocking: boolean;
  /** Whether this account is endorsed */
  endorsed: boolean;
  /** Private note about this account */
  note?: string;
}

// Post/Status unified model
export interface UnifiedStatus {
  /** Unique identifier */
  id: string;
  /** Creation timestamp */
  createdAt: string;
  /** Status content in HTML */
  content: string;
  /** Content warning/spoiler text */
  spoilerText?: string;
  /** Visibility level */
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  /** Whether content is sensitive */
  sensitive: boolean;
  /** Language code */
  language?: string;
  /** Account that posted this status */
  account: UnifiedAccount;
  /** Media attachments */
  mediaAttachments: MediaAttachment[];
  /** Mentions in this status */
  mentions: Mention[];
  /** Hashtags in this status */
  tags: Tag[];
  /** Custom emojis used */
  emojis: CustomEmoji[];
  /** Reply information */
  inReplyTo?: {
    id: string;
    accountId: string;
  };
  /** Boost/reblog information */
  reblog?: UnifiedStatus;
  /** Engagement counts */
  repliesCount: number;
  reblogsCount: number;
  favouritesCount: number;
  /** Current user's interaction state */
  favourited: boolean;
  reblogged: boolean;
  bookmarked: boolean;
  /** Pin status */
  pinned: boolean;
  /** Edit history */
  editedAt?: string;
  /** Poll attached to this status */
  poll?: Poll;
  /** Source metadata */
  metadata: SourceMetadata;
}

// Media attachment model
export interface MediaAttachment {
  /** Unique identifier */
  id: string;
  /** Media type */
  type: 'image' | 'video' | 'audio' | 'gifv' | 'unknown';
  /** Original media URL */
  url: string;
  /** Preview/thumbnail URL */
  previewUrl?: string;
  /** Remote URL if this is from another instance */
  remoteUrl?: string;
  /** Alt text description */
  description?: string;
  /** Blurhash for placeholder */
  blurhash?: string;
  /** Media dimensions and metadata */
  meta?: MediaMeta;
}

export interface MediaMeta {
  /** Original media properties */
  original?: {
    width: number;
    height: number;
    size?: string;
    aspect?: number;
    duration?: number;
    fps?: number;
    bitrate?: number;
  };
  /** Small/preview properties */
  small?: {
    width: number;
    height: number;
    size?: string;
    aspect?: number;
  };
}

// Mention model
export interface Mention {
  /** Mentioned account ID */
  id: string;
  /** Username */
  username: string;
  /** Full username with domain */
  acct: string;
  /** Profile URL */
  url: string;
}

// Tag/Hashtag model
export interface Tag {
  /** Tag name (without #) */
  name: string;
  /** Tag URL */
  url: string;
  /** Usage statistics */
  history?: TagHistory[];
}

export interface TagHistory {
  /** Day timestamp */
  day: string;
  /** Number of uses */
  uses: string;
  /** Number of accounts using */
  accounts: string;
}

// Custom emoji model
export interface CustomEmoji {
  /** Emoji shortcode */
  shortcode: string;
  /** Static image URL */
  staticUrl: string;
  /** Animated image URL */
  url: string;
  /** Whether this emoji is visible in picker */
  visibleInPicker: boolean;
  /** Emoji category */
  category?: string;
}

// Poll model
export interface Poll {
  /** Poll ID */
  id: string;
  /** Poll expiration date */
  expiresAt?: string;
  /** Whether poll has expired */
  expired: boolean;
  /** Whether multiple choices allowed */
  multiple: boolean;
  /** Total votes cast */
  votesCount: number;
  /** Number of voters */
  votersCount?: number;
  /** Poll options */
  options: PollOption[];
  /** Whether current user has voted */
  voted?: boolean;
  /** Current user's choices (if voted) */
  ownVotes?: number[];
}

export interface PollOption {
  /** Option title */
  title: string;
  /** Number of votes for this option */
  votesCount?: number;
}

// Notification unified model
export interface UnifiedNotification {
  /** Unique identifier */
  id: string;
  /** Notification type */
  type: 'mention' | 'status' | 'reblog' | 'follow' | 'follow_request' | 'favourite' | 'poll' | 'update' | 'admin.sign_up' | 'admin.report';
  /** Creation timestamp */
  createdAt: string;
  /** Account that triggered this notification */
  account: UnifiedAccount;
  /** Associated status (if applicable) */
  status?: UnifiedStatus;
  /** Associated report (for admin notifications) */
  report?: AdminReport;
  /** Whether notification has been read */
  read?: boolean;
  /** Source metadata */
  metadata: SourceMetadata;
}

// Admin report model (for admin notifications)
export interface AdminReport {
  /** Report ID */
  id: string;
  /** Reported account */
  targetAccount: UnifiedAccount;
  /** Reporting account */
  account: UnifiedAccount;
  /** Report reason */
  comment: string;
  /** Whether action was taken */
  actionTaken: boolean;
  /** Creation timestamp */
  createdAt: string;
}

// Streaming operation models
export interface StreamingUpdate {
  /** Update type */
  type: 'status' | 'delete' | 'notification' | 'filters_changed' | 'conversation' | 'announcement';
  /** Event data */
  payload: unknown;
  /** Stream this came from */
  stream: string;
  /** Event timestamp */
  timestamp: number;
  /** Source metadata */
  metadata: SourceMetadata;
}

export interface StreamingDelete {
  /** ID of deleted item */
  id: string;
  /** Type of deleted item */
  itemType: 'status' | 'account' | 'notification';
  /** Deletion timestamp */
  timestamp: number;
}

export interface StreamingEdit {
  /** ID of edited item */
  id: string;
  /** Updated item data */
  data: UnifiedStatus | UnifiedAccount | UnifiedNotification;
  /** Edit timestamp */
  timestamp: number;
  /** Edit reason/type */
  editType: 'content' | 'metadata' | 'visibility';
}

// Error handling models
export interface MappingError extends Error {
  /** Error type */
  type: 'validation' | 'transformation' | 'missing_field' | 'unknown_format';
  /** Original payload that caused error */
  payload?: unknown;
  /** Field path where error occurred */
  fieldPath?: string;
  /** Source API information */
  source?: {
    api: string;
    version: string;
    endpoint?: string;
  };
}

// Mapper result wrapper
export interface MapperResult<T> {
  /** Whether mapping was successful */
  success: boolean;
  /** Mapped data (if successful) */
  data?: T;
  /** Error information (if failed) */
  error?: MappingError;
  /** Warnings during mapping */
  warnings?: string[];
  /** Performance metrics */
  metrics?: {
    mappingTimeMs: number;
    fieldsProcessed: number;
    fallbacksUsed: number;
  };
}

// Batch mapping result
export interface BatchMapperResult<T> {
  /** Successfully mapped items */
  successful: T[];
  /** Failed mappings with errors */
  failed: { payload: unknown; error: MappingError }[];
  /** Total items processed */
  totalProcessed: number;
  /** Processing time in milliseconds */
  processingTimeMs: number;
}

// Validation schema helpers
export interface ValidationRule<T = any> {
  /** Rule name for debugging */
  name: string;
  /** Validation function */
  validate: (value: T) => boolean;
  /** Error message if validation fails */
  message: string;
  /** Whether this rule is required vs optional */
  required?: boolean;
}

export interface FieldValidator {
  /** Field path in dot notation */
  path: string;
  /** Validation rules for this field */
  rules: ValidationRule[];
  /** Transformer function */
  transform?: (value: any) => any;
  /** Default value if field is missing */
  defaultValue?: any;
}