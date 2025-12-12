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
	/** Article content (HTML or Markdown) */
	content: string;
	/** Content format */
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
	/** Called when article is bookmarked */
	onBookmark?: (article: ArticleData) => Promise<void> | void;
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
	/** Draft content */
	content: string;
	/** Content format */
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
