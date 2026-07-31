/**
 * Blog Face Type Definitions
 *
 * Comprehensive types for blog/publishing components.
 *
 * @module @equaltoai/greater-components/faces/blog/types
 */

// ============================================================================
// Article Types
// ============================================================================

/**
 * Article metadata for SEO and display
 */
export interface ArticleMetadata {
	/** Article title */
	title: string;
	/** Article subtitle or deck */
	subtitle?: string;
	/** Meta description for SEO */
	description: string;
	/** Publication date */
	publishedAt: Date | string;
	/** Last updated date */
	updatedAt?: Date | string;
	/** Estimated reading time in minutes */
	readingTime?: number;
	/** Word count */
	wordCount?: number;
	/** Featured image URL */
	featuredImage?: string;
	/** Featured image alt text */
	featuredImageAlt?: string;
	/** Featured image caption */
	featuredImageCaption?: string;
	/** Canonical URL for cross-posting */
	canonicalUrl?: string;
	/** Tags/keywords */
	tags?: string[];
	/** Category */
	category?: string;
	/** Series information if part of a series */
	series?: SeriesData;
}

/**
 * Full article data structure
 */
export interface ArticleData {
	/** Unique article identifier */
	id: string;
	/** URL slug */
	slug: string;
	/** Article metadata */
	metadata: ArticleMetadata;
	/**
	 * Article content.
	 *
	 * For Lesser-backed public articles, pass server-rendered/sanitized HTML when
	 * available. Markdown is displayed by Article.Content only as escaped fallback
	 * source text, not as canonical publication rendering.
	 */
	content: string;
	/** Content format: `html` is the public render path; `markdown` is an escaped fallback. */
	contentFormat: 'html' | 'markdown';
	/** Article author */
	author: AuthorData;
	/** Publication this article belongs to */
	publication?: PublicationData;
	/** Whether article is published */
	isPublished: boolean;
	/** Whether article is featured */
	isFeatured?: boolean;
	/** View count */
	viewCount?: number;
	/** Reaction counts */
	reactions?: ReactionData;
	/** Comment count */
	commentCount?: number;
}

/**
 * Content formats accepted by the complete Article display components.
 *
 * Lowercase values are the canonical Greater view-model format. Uppercase values
 * mirror Lesser's GraphQL enum casing so first-app adapters can hand the Blog
 * face their ArticleData-shaped display object without a local rendering layer.
 */
export type ArticleInputContentFormat = ArticleData['contentFormat'] | 'HTML' | 'MARKDOWN';

/**
 * Minimal flat author shape accepted by Article.Reader and Article.Card.
 * Canonical Greater `AuthorData` remains the normalized public view model.
 */
export interface ArticleInputAuthor {
	id: string;
	username?: string;
	displayName?: string;
	avatarUrl?: string;
	bio?: string;
}

/**
 * Minimal category/tag shape accepted by Article.Reader and Article.Card.
 */
export interface ArticleInputCategory {
	id?: string;
	name: string;
	slug?: string;
}

/**
 * Minimal featured image shape accepted by Article.Reader and Article.Card.
 */
export interface ArticleInputFeaturedImage {
	url?: string;
	src?: string;
	alt?: string;
	altText?: string;
	caption?: string;
	width?: number;
	height?: number;
}

/**
 * Flat ArticleData-shaped display input accepted by the complete Article
 * components. This keeps first-app SSR consumers from maintaining their own
 * article-reader/card HTML while preserving the canonical nested `ArticleData`
 * type used by the existing compound Article.* primitives.
 */
export interface ArticleDisplayData {
	id: string;
	slug: string;
	metadata?: Partial<ArticleMetadata>;
	title?: string;
	subtitle?: string;
	description?: string;
	excerpt?: string;
	content: string;
	contentFormat: ArticleInputContentFormat;
	author: AuthorData | ArticleInputAuthor;
	publication?: PublicationData;
	isPublished?: boolean;
	isFeatured?: boolean;
	viewCount?: number;
	reactions?: ReactionData;
	commentCount?: number;
	canonicalUrl?: string;
	publishedAt?: Date | string;
	updatedAt?: Date | string;
	readingTime?: number;
	readingTimeMinutes?: number;
	wordCount?: number;
	tags?: readonly string[];
	category?: string;
	categories?: ReadonlyArray<string | ArticleInputCategory>;
	featuredImage?: string | ArticleInputFeaturedImage;
	seoDescription?: string;
}

/**
 * Article input accepted by complete Article display components.
 */
export type ArticleInputData = ArticleData | ArticleDisplayData;

/**
 * Article component configuration
 */
export interface ArticleConfig {
	/** Display density */
	density?: 'compact' | 'comfortable' | 'spacious';
	/** Show table of contents */
	showTableOfContents?: boolean;
	/** Show reading progress indicator */
	showReadingProgress?: boolean;
	/** Show share buttons */
	showShareBar?: boolean;
	/** Show related posts */
	showRelatedPosts?: boolean;
	/** Show author card */
	showAuthor?: boolean;
	/** Show comments section */
	showComments?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Article action handlers
 */
export interface ArticleHandlers {
	/** Resolve the canonical share URL for the current host */
	resolveShareUrl?: (article: ArticleData) => string | URL | null | undefined;
	/** Called when article is bookmarked */
	onBookmark?: (article: ArticleData) => Promise<void> | void;
	/** Called when a host copies the canonical article link */
	onCopyLink?: (article: ArticleData, url: string) => Promise<void> | void;
	/** Called when a host opens an outbound share URL */
	onOpenShareLink?: (
		article: ArticleData,
		platform: string,
		shareUrl: string
	) => Promise<void> | void;
	/** Called when article is shared */
	onShare?: (article: ArticleData, platform?: string) => Promise<void> | void;
	/** Called when reaction is added */
	onReact?: (article: ArticleData, reaction: string) => Promise<void> | void;
	/** Called when comment is submitted */
	onComment?: (article: ArticleData, comment: string) => Promise<void> | void;
	/** Called when heading is clicked (for TOC) */
	onHeadingClick?: (headingId: string) => void;
}

// ============================================================================
// Author Types
// ============================================================================

/**
 * Author social media links
 */
export interface AuthorSocialLinks {
	twitter?: string;
	mastodon?: string;
	linkedin?: string;
	github?: string;
	website?: string;
	email?: string;
}

/**
 * Author data structure
 */
export interface AuthorData {
	/** Unique author identifier */
	id: string;
	/** Display name */
	name: string;
	/** Username/handle */
	username?: string;
	/** Author bio */
	bio?: string;
	/** Short bio for compact displays */
	shortBio?: string;
	/** Avatar image URL */
	avatar?: string;
	/** Cover/banner image URL */
	coverImage?: string;
	/** Social media links */
	socialLinks?: AuthorSocialLinks;
	/** Author's publication */
	publication?: PublicationData;
	/** Number of articles written */
	articleCount?: number;
	/** Total followers */
	followerCount?: number;
}

// ============================================================================
// Publication Types
// ============================================================================

/**
 * Publication data structure
 */
export interface PublicationData {
	/** Unique publication identifier */
	id: string;
	/** Publication name */
	name: string;
	/** Publication tagline */
	tagline?: string;
	/** Publication description */
	description?: string;
	/** Logo image URL */
	logo?: string;
	/** Banner image URL */
	banner?: string;
	/** Primary color (hex) */
	primaryColor?: string;
	/** Website URL */
	website?: string;
	/** Social media links */
	socialLinks?: AuthorSocialLinks;
	/** Newsletter enabled */
	hasNewsletter?: boolean;
	/** Subscriber count */
	subscriberCount?: number;
}

/**
 * Publication component configuration
 */
export interface PublicationConfig {
	/** Show banner */
	showBanner?: boolean;
	/** Show newsletter signup */
	showNewsletter?: boolean;
	/** Show subscriber count */
	showSubscriberCount?: boolean;
	/** Custom CSS class */
	class?: string;
}

// ============================================================================
// Editor Types
// ============================================================================

/**
 * Draft data structure
 */
export interface DraftData {
	/** Draft identifier */
	id: string;
	/** Draft title */
	title: string;
	/** Draft source content. Canonical public rendering happens after server publication. */
	content: string;
	/** Draft source format. Markdown preview is authoring-only, not public Article rendering. */
	contentFormat: 'html' | 'markdown';
	/** Last saved timestamp */
	savedAt: Date | string;
	/** Auto-save enabled */
	autoSave?: boolean;
	/** Word count */
	wordCount?: number;
}

/**
 * Revision data structure
 */
export interface RevisionData {
	/** Revision identifier */
	id: string;
	/** Revision number */
	number: number;
	/** Revision content */
	content: string;
	/** Created timestamp */
	createdAt: Date | string;
	/** Author of revision */
	author?: AuthorData;
	/** Revision message/note */
	message?: string;
}

/**
 * Editor component configuration
 */
export interface EditorConfig {
	/** Editor mode */
	mode: 'markdown' | 'wysiwyg' | 'split';
	/** Auto-save interval in ms */
	autoSaveInterval?: number;
	/** Show word count */
	showWordCount?: boolean;
	/** Show reading time estimate */
	showReadingTime?: boolean;
	/** Show SEO panel */
	showSEO?: boolean;
	/** Show revision history */
	showRevisions?: boolean;
	/** Placeholder text */
	placeholder?: string;
	/** Custom CSS class */
	class?: string;
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Archive entry for month/year browsing
 */
export interface ArchiveEntry {
	/** Year */
	year: number;
	/** Month (1-12) */
	month?: number;
	/** Article count for this period */
	count: number;
	/** URL to archive page */
	url: string;
}

/**
 * Tag data structure
 */
export interface TagData {
	/** Tag identifier */
	id: string;
	/** Tag name */
	name: string;
	/** Tag slug */
	slug: string;
	/** Number of articles with this tag */
	count: number;
	/** Tag description */
	description?: string;
}

/**
 * Category data structure
 */
export interface CategoryData {
	/** Category identifier */
	id: string;
	/** Category name */
	name: string;
	/** Category slug */
	slug: string;
	/** Number of articles in category */
	count: number;
	/** Category description */
	description?: string;
	/** Parent category ID */
	parentId?: string;
	/** Child categories */
	children?: CategoryData[];
}

// ============================================================================
// Content Types
// ============================================================================

/**
 * Series data for multi-part articles
 */
export interface SeriesData {
	/** Series identifier */
	id: string;
	/** Series title */
	title: string;
	/** Series description */
	description?: string;
	/** Total parts in series */
	totalParts: number;
	/** Current part number */
	currentPart: number;
	/** All parts in order */
	parts: Array<{
		number: number;
		title: string;
		slug: string;
		isPublished: boolean;
	}>;
}

/**
 * Heading data for table of contents
 */
export interface HeadingData {
	/** Heading ID (for anchor links) */
	id: string;
	/** Heading text */
	text: string;
	/** Heading level (1-6) */
	level: number;
}

/**
 * Reading time calculation result
 */
export interface ReadingTimeData {
	/** Estimated minutes to read */
	minutes: number;
	/** Word count */
	words: number;
	/** Formatted string (e.g., "5 min read") */
	text: string;
}

// ============================================================================
// Engagement Types
// ============================================================================

/**
 * Comment data structure
 */
export interface CommentData {
	/** Comment identifier */
	id: string;
	/** Comment content */
	content: string;
	/** Comment author */
	author: {
		id: string;
		name: string;
		avatar?: string;
	};
	/** Created timestamp */
	createdAt: Date | string;
	/** Parent comment ID for replies */
	parentId?: string;
	/** Child comments/replies */
	replies?: CommentData[];
	/** Like count */
	likeCount?: number;
	/** Whether current user liked */
	isLiked?: boolean;
}

/**
 * Reaction data structure
 */
export interface ReactionData {
	/** Total reaction count */
	total: number;
	/** Breakdown by reaction type */
	byType: Record<string, number>;
	/** Whether current user has reacted */
	userReaction?: string;
}

// ============================================================================
// SEO Types
// ============================================================================

/**
 * SEO metadata structure
 */
export interface SEOData {
	/** Page title */
	title: string;
	/** Meta description */
	description: string;
	/** Canonical URL */
	canonicalUrl?: string;
	/** Open Graph image */
	ogImage?: string;
	/** Open Graph type */
	ogType?: 'article' | 'website';
	/** Twitter card type */
	twitterCard?: 'summary' | 'summary_large_image';
	/** Article publish date (ISO string) */
	publishedTime?: string;
	/** Article modified date (ISO string) */
	modifiedTime?: string;
	/** Article author */
	author?: string;
	/** Article section/category */
	section?: string;
	/** Article tags */
	tags?: string[];
	/** Robots directives */
	robots?: string;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Article component context
 */
export interface ArticleContext {
	article: ArticleData;
	config: Required<ArticleConfig>;
	handlers: ArticleHandlers;
	headings: HeadingData[];
	activeHeadingId: string | null;
	scrollProgress: number;
}

/**
 * Author component context
 */
export interface AuthorContext {
	author: AuthorData;
	showBio: boolean;
	showSocial: boolean;
}

/**
 * Publication component context
 */
export interface PublicationContext {
	publication: PublicationData;
	config: Required<PublicationConfig>;
}

/**
 * Editor component context
 */
export interface EditorContext {
	draft: DraftData;
	config: Required<EditorConfig>;
	isDirty: boolean;
	isSaving: boolean;
	lastSaved: Date | null;
}

/**
 * Navigation component context
 */
export interface NavigationContext {
	archives: ArchiveEntry[];
	tags: TagData[];
	categories: CategoryData[];
	currentPath: string;
}

// ============================================================================
// Review workflow types
// ============================================================================
//
// These mirror the pinned Lesser contract snapshot in
// `docs/lesser/contracts/graphql-schema.graphql` (LESSER_REF v1.5.32), which
// introduced the shareable-draft review surface: `DraftReview`,
// `DraftReviewGrant`, `DraftReviewVerdictRecord`, the `DraftReviewVerdict`
// enum, and the `sharedDraftReviews` / `draftReview` /
// `shareDraftForReview` / `revokeDraftReview` / `submitDraftReview`
// operations.
//
// The shapes below are deliberately *view models*, not the generated GraphQL
// types: every field is optional except the identity fields, so a consumer can
// render partial query selections without type gymnastics. Lesser remains
// authoritative for review semantics — these types carry data, they do not
// encode policy.

/**
 * Verdict a reviewer can record against a shared draft.
 *
 * Mirrors the Lesser `DraftReviewVerdict` enum.
 */
export type DraftReviewVerdict = 'APPROVED' | 'CHANGES_REQUESTED';

/**
 * Lifecycle status of the underlying draft.
 *
 * Mirrors the Lesser `DraftStatus` enum.
 */
export type DraftReviewStatusValue = 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';

/**
 * Minimal actor projection used across the review chrome.
 *
 * Mirrors the fields of the Lesser `Actor` type that the review chrome
 * renders. `isAgent` is a first-class contract field — the chrome reads it, it
 * does not infer agent-ness from anything else.
 */
export interface ReviewActorData {
	/** Actor identifier. */
	id: string;
	/** Handle, without the leading `@`. */
	username: string;
	/** Home domain for remote actors. Omitted or null for local actors. */
	domain?: string | null;
	/** Human-facing display name. Falls back to `username` when absent. */
	displayName?: string | null;
	/** Avatar image URL. */
	avatar?: string | null;
	/** Whether this actor is a Lesser agent (contract field `Actor.isAgent`). */
	isAgent?: boolean;
}

/**
 * A single recorded reviewer verdict.
 *
 * Mirrors the Lesser `DraftReviewVerdictRecord` type.
 */
export interface ReviewVerdictRecordData {
	/** The verdict that was recorded. */
	verdict: DraftReviewVerdict;
	/** Reviewer-supplied notes. Required in practice for CHANGES_REQUESTED. */
	notes?: string | null;
	/** The actor who recorded the verdict. */
	reviewer: ReviewActorData;
	/** ISO-8601 timestamp for when the verdict was recorded. */
	recordedAt: string;
}

/**
 * An outstanding review invitation.
 *
 * Mirrors the Lesser `DraftReviewGrant` type. Grants are revocable upstream via
 * `revokeDraftReview`; the chrome surfaces that a grant exists and leaves
 * revocation to the consumer.
 */
export interface ReviewGrantData {
	/** The invited reviewer. */
	reviewer: ReviewActorData;
	/** ISO-8601 timestamp for when the invitation was granted. */
	grantedAt: string;
}

/**
 * A shared draft under review.
 *
 * Mirrors the Lesser `DraftReview` type.
 */
export interface DraftReviewData {
	/** Identifier of the draft under review. */
	draftId: string;
	/** Draft title. */
	title?: string | null;
	/** Draft subtitle / standfirst. */
	subtitle?: string | null;
	/** Short excerpt used in queue listings. */
	excerpt?: string | null;
	/** Source format of the draft body. */
	contentFormat?: 'HTML' | 'MARKDOWN';
	/** Publication lifecycle status of the draft. */
	status?: DraftReviewStatusValue;
	/** ISO-8601 timestamp for a scheduled publication, when scheduled. */
	scheduledAt?: string | null;
	/** ISO-8601 timestamp of the last draft update. */
	updatedAt: string;
	/** ISO-8601 timestamp of draft creation. */
	createdAt?: string;
	/** The actor that generated the draft. Present for agent-authored drafts. */
	generatedBy?: ReviewActorData | null;
	/** The actor that most recently reviewed the draft. */
	reviewedBy?: ReviewActorData | null;
	/**
	 * Server-authored review status string.
	 *
	 * Lesser owns this value and it is the authoritative status. The chrome
	 * renders it verbatim when present and never overrides it.
	 */
	reviewStatus?: string | null;
	/** Editor-facing notes carried alongside the draft. */
	editorNotes?: string | null;
	/** The outstanding review invitation, when one is open. */
	grant?: ReviewGrantData | null;
	/** Verdicts recorded so far. */
	verdicts?: readonly ReviewVerdictRecordData[];
}

/**
 * A presentation-only description of the approval rules in force.
 *
 * Lesser's rules are **cumulative, not exclusive**. `PublishDraft` evaluates
 * unanimous active-reviewer approval for *every* draft, and additionally
 * requires the instance principal's own approval whenever the draft records a
 * generator. A generated draft therefore has to satisfy both at once.
 *
 * This descriptor exists so the chrome can make those rules *legible*. It is
 * never used to enable, disable, or gate a verdict submission — Lesser enforces
 * the policy and rejects submissions it does not permit.
 *
 * It deliberately carries **no progress count**. Progress would have to count
 * reviewers holding an active grant at the current round, and the pinned
 * projection exposes only the viewer's own `grant`. Counting `verdicts` instead
 * would be wrong: verdicts are an immutable append-only history, so repeats and
 * revoke/re-grant cycles make "3 of 3 recorded" meaningless.
 */
export interface ReviewApprovalRequirement {
	/**
	 * Unanimous approval from every reviewer holding an active grant.
	 *
	 * Always required — Lesser evaluates this rule for every draft. With no
	 * active grants it is vacuously satisfied, which is how human-authored
	 * drafts keep their pre-review behaviour.
	 */
	allActiveReviewers: true;
	/**
	 * Whether the instance principal's own approval is *additionally* required.
	 *
	 * True whenever the draft records a generator. Keyed on the presence of
	 * `generatedBy`, **not** on `generatedBy.isAgent`: Lesser tests a non-empty
	 * `GeneratedBy` string, so a delegated local actor triggers the rule exactly
	 * as an agent does.
	 */
	principalApproval: boolean;
	/**
	 * How many reviewers hold an active grant, when the caller can enumerate
	 * them from a source that genuinely exposes the active set.
	 *
	 * Omitted on the pinned projection — the chrome then names the rule without
	 * implying any completion.
	 */
	activeReviewerCount?: number;
}

/**
 * Tone used to style a resolved review state.
 */
export type ReviewStateTone = 'approved' | 'changes-requested' | 'pending';

/**
 * A resolved, renderable review state.
 */
export interface ReviewStateDescriptor {
	/** Styling tone for the state badge. */
	tone: ReviewStateTone;
	/** Text rendered in the badge. Always present — state is never colour-only. */
	label: string;
	/**
	 * Where the label came from.
	 *
	 * - `server` — taken verbatim from `reviewStatus`.
	 * - `verdicts` — names the newest row of the recorded verdict history,
	 *   because `reviewStatus` was absent.
	 * - `none` — no review activity has been recorded at all.
	 *
	 * `server` and `verdicts` are both **latest activity, not publication
	 * state**. Lesser overwrites `ReviewStatus` on every verdict submission, so
	 * it reports the most recent submission rather than the publication gate;
	 * the gate itself is reconstructed server-side from active grants and is not
	 * exposed by the pinned projection. Consumers must not read either value as
	 * "this draft may publish".
	 */
	source: 'server' | 'verdicts' | 'none';
}

/**
 * Payload handed to `Review.VerdictActions`' `onSubmit` handler.
 *
 * Shaped to the arguments of Lesser's `submitDraftReview` mutation so a
 * consumer can forward it to the adapters layer unchanged.
 */
export interface VerdictSubmission {
	/** Identifier of the draft being reviewed. */
	draftId: string;
	/** The verdict being recorded. */
	verdict: DraftReviewVerdict;
	/** Reviewer notes. Omitted when the reviewer left the field empty. */
	notes?: string;
}
