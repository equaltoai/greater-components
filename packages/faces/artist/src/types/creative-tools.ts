/**
 * Creative Tools Type Definitions
 *
 * Types for work-in-progress, critique, reference boards, and commissions.
 *
 * @module @equaltoai/greater-components-artist/types/creative-tools
 */

// ============================================================================
// Work In Progress Types
// ============================================================================

/**
 * WIP update media type
 */
export type WIPMediaType = 'image' | 'video' | 'timelapse' | 'comparison';

/**
 * WIP update data
 */
export interface WIPUpdate {
	/** Update identifier */
	id: string;
	/** Update content/description */
	content: string;
	/** Media attachments */
	media?: {
		type: WIPMediaType;
		url: string;
		thumbnailUrl?: string;
		caption?: string;
	}[];
	/** Progress percentage (0-100) */
	progress?: number;
	/** Created date */
	createdAt: Date | string;
	/** Like count */
	likeCount?: number;
	/** Comment count */
	commentCount?: number;
}

/**
 * WIP thread data
 */
export interface WIPThreadData {
	/** Thread identifier */
	id: string;
	/** Thread title */
	title: string;
	/** Thread description */
	description?: string;
	/** Artist ID */
	artistId: string;
	/** Artist name */
	artistName: string;
	/** Artist avatar */
	artistAvatar?: string;
	/** Cover image URL */
	coverImage?: string;
	/** Thread updates */
	updates: WIPUpdate[];
	/** Current progress (0-100) */
	currentProgress: number;
	/** Whether thread is complete */
	isComplete: boolean;
	/** Final artwork ID (if complete) */
	finalArtworkId?: string;
	/** Tags */
	tags?: string[];
	/** Follower count */
	followerCount?: number;
	/** Created date */
	createdAt: Date | string;
	/** Last updated date */
	updatedAt?: Date | string;
}

/**
 * WIP handlers
 */
export interface WIPHandlers {
	/** Called when update is posted */
	onPostUpdate?: (
		thread: WIPThreadData,
		update: Omit<WIPUpdate, 'id' | 'createdAt'>
	) => Promise<void> | void;
	/** Called when thread is followed */
	onFollow?: (thread: WIPThreadData) => Promise<void> | void;
	/** Called when update is liked */
	onLikeUpdate?: (thread: WIPThreadData, updateId: string) => Promise<void> | void;
	/** Called when comment is posted */
	onComment?: (thread: WIPThreadData, updateId: string, comment: string) => Promise<void> | void;
	/** Called when thread is marked complete */
	onComplete?: (thread: WIPThreadData, finalArtworkId?: string) => Promise<void> | void;
	/** Called when thread is shared */
	onShare?: (thread: WIPThreadData, platform?: string) => Promise<void> | void;
}

// ============================================================================
// Critique Types
// ============================================================================

/**
 * Critique annotation type
 */
export type CritiqueAnnotationType = 'point' | 'area' | 'line' | 'text';

/**
 * Critique annotation
 */
export interface CritiqueAnnotation {
	/** Annotation identifier */
	id: string;
	/** Annotation type */
	type: CritiqueAnnotationType;
	/** Position (normalized 0-1) */
	position: { x: number; y: number };
	/** Size for area annotations */
	size?: { width: number; height: number };
	/** Points for line annotations */
	points?: { x: number; y: number }[];
	/** Annotation content */
	content: string;
	/** Author ID */
	authorId: string;
	/** Author name */
	authorName: string;
	/** Created date */
	createdAt: Date | string;
	/** Category (composition, color, technique, etc.) */
	category?: string;
	/** Sentiment (positive, constructive, question) */
	sentiment?: 'positive' | 'constructive' | 'question';
}

/**
 * Critique configuration
 */
export interface CritiqueConfig {
	/** Enable annotations */
	enableAnnotations?: boolean;
	/** Enable drawing tools */
	enableDrawing?: boolean;
	/** Show annotation categories */
	showCategories?: boolean;
	/** Available categories */
	categories?: string[];
	/** Maximum annotations per user */
	maxAnnotationsPerUser?: number;
	/** Allow anonymous critiques */
	allowAnonymous?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Critique handlers
 */
export interface CritiqueHandlers {
	/** Called when annotation is added */
	onAddAnnotation?: (
		annotation: Omit<CritiqueAnnotation, 'id' | 'createdAt'>
	) => Promise<void> | void;
	/** Called when annotation is removed */
	onRemoveAnnotation?: (annotationId: string) => Promise<void> | void;
	/** Called when annotation is updated */
	onUpdateAnnotation?: (
		annotationId: string,
		updates: Partial<CritiqueAnnotation>
	) => Promise<void> | void;
	/** Called when critique is submitted */
	onSubmit?: (annotations: CritiqueAnnotation[], summary?: string) => Promise<void> | void;
}

// ============================================================================
// Reference Board Types
// ============================================================================

/**
 * Reference item
 */
export interface ReferenceItem {
	/** Item identifier */
	id: string;
	/** Image URL */
	imageUrl: string;
	/** Thumbnail URL */
	thumbnailUrl?: string;
	/** Item title/label */
	title?: string;
	/** Source URL */
	sourceUrl?: string;
	/** Source attribution */
	attribution?: string;
	/** Position on board */
	position: { x: number; y: number };
	/** Size on board */
	size: { width: number; height: number };
	/** Rotation in degrees */
	rotation?: number;
	/** Z-index for layering */
	zIndex?: number;
	/** Notes */
	notes?: string;
	/** Tags */
	tags?: string[];
}

/**
 * Reference board data
 */
export interface ReferenceBoardData {
	/** Board identifier */
	id: string;
	/** Board title */
	title: string;
	/** Board description */
	description?: string;
	/** Owner ID */
	ownerId: string;
	/** Reference items */
	items: ReferenceItem[];
	/** Board dimensions */
	dimensions: { width: number; height: number };
	/** Background color */
	backgroundColor?: string;
	/** Whether board is public */
	isPublic: boolean;
	/** Created date */
	createdAt: Date | string;
	/** Last updated date */
	updatedAt?: Date | string;
}

/**
 * Reference board handlers
 */
export interface ReferenceBoardHandlers {
	/** Called when item is added */
	onAddItem?: (item: Omit<ReferenceItem, 'id'>) => Promise<void> | void;
	/** Called when item is removed */
	onRemoveItem?: (itemId: string) => Promise<void> | void;
	/** Called when item is updated */
	onUpdateItem?: (itemId: string, updates: Partial<ReferenceItem>) => Promise<void> | void;
	/** Called when board is saved */
	onSave?: (board: ReferenceBoardData) => Promise<void> | void;
	/** Called when board is shared */
	onShare?: (board: ReferenceBoardData) => Promise<void> | void;
}

// ============================================================================
// Commission Types
// ============================================================================

/**
 * Commission status
 */
export type CommissionStatus =
	| 'inquiry'
	| 'quoted'
	| 'accepted'
	| 'in-progress'
	| 'review'
	| 'revision'
	| 'completed'
	| 'cancelled'
	| 'disputed';

/**
 * Commission milestone
 */
export interface CommissionMilestone {
	/** Milestone identifier */
	id: string;
	/** Milestone title */
	title: string;
	/** Milestone description */
	description?: string;
	/** Due date */
	dueDate?: Date | string;
	/** Completion date */
	completedAt?: Date | string;
	/** Whether milestone is complete */
	isComplete: boolean;
	/** Associated payment amount */
	paymentAmount?: number;
	/** Whether payment is received */
	paymentReceived?: boolean;
}

/**
 * Commission data
 */
export interface CommissionData {
	/** Commission identifier */
	id: string;
	/** Commission title */
	title: string;
	/** Commission description */
	description: string;
	/** Artist ID */
	artistId: string;
	/** Artist name */
	artistName: string;
	/** Client ID */
	clientId: string;
	/** Client name */
	clientName: string;
	/** Commission status */
	status: CommissionStatus;
	/** Quote amount */
	quoteAmount?: number;
	/** Currency */
	currency?: string;
	/** Milestones */
	milestones?: CommissionMilestone[];
	/** Reference images */
	referenceImages?: string[];
	/** Deliverables */
	deliverables?: string[];
	/** Deadline */
	deadline?: Date | string;
	/** Number of revisions included */
	revisionsIncluded?: number;
	/** Revisions used */
	revisionsUsed?: number;
	/** Created date */
	createdAt: Date | string;
	/** Last updated date */
	updatedAt?: Date | string;
	/** Completion date */
	completedAt?: Date | string;
}

/**
 * Commission handlers
 */
export interface CommissionHandlers {
	/** Called when quote is sent */
	onSendQuote?: (commission: CommissionData, amount: number) => Promise<void> | void;
	/** Called when commission is accepted */
	onAccept?: (commission: CommissionData) => Promise<void> | void;
	/** Called when commission is declined */
	onDecline?: (commission: CommissionData, reason?: string) => Promise<void> | void;
	/** Called when milestone is completed */
	onCompleteMilestone?: (commission: CommissionData, milestoneId: string) => Promise<void> | void;
	/** Called when work is submitted for review */
	onSubmitForReview?: (commission: CommissionData, files: string[]) => Promise<void> | void;
	/** Called when revision is requested */
	onRequestRevision?: (commission: CommissionData, feedback: string) => Promise<void> | void;
	/** Called when commission is completed */
	onComplete?: (commission: CommissionData) => Promise<void> | void;
	/** Called when commission is cancelled */
	onCancel?: (commission: CommissionData, reason?: string) => Promise<void> | void;
	/** Called when message is sent */
	onMessage?: (commission: CommissionData, message: string) => Promise<void> | void;
}
