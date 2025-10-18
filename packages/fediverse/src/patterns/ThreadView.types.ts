import type { Snippet } from 'svelte';
import type { GenericStatus } from '../generics/index.js';

export interface ThreadNode<T extends GenericStatus = GenericStatus> {
	status: T;
	children: ThreadNode<T>[];
	depth: number;
	hasMore?: boolean;
	isCollapsed?: boolean;
}

export interface ThreadViewConfig {
	/**
	 * Maximum depth to display (deeper threads are collapsed)
	 */
	maxDepth?: number;

	/**
	 * Show reply indicators
	 */
	showReplyLines?: boolean;

	/**
	 * Collapse threads with many replies
	 */
	autoCollapseThreshold?: number;

	/**
	 * Highlight the focused status
	 */
	highlightedStatusId?: string;

	/**
	 * Display mode
	 */
	mode?: 'full' | 'compact' | 'minimal';

	/**
	 * Custom CSS class
	 */
	class?: string;
}

export interface ThreadViewHandlers<T extends GenericStatus = GenericStatus> {
	onLoadMore?: (statusId: string) => Promise<T[]>;
	onToggleCollapse?: (statusId: string) => void;
	onNavigate?: (statusId: string) => void;
	onLike?: (status: T) => void;
	onBoost?: (status: T) => void;
	onReply?: (status: T) => void;
	onBookmark?: (status: T) => void;
	onShare?: (status: T) => void;
}

export interface ThreadViewProps<T extends GenericStatus = GenericStatus> {
	rootStatus: T;
	replies: T[];
	config?: ThreadViewConfig;
	handlers?: ThreadViewHandlers<T>;
	renderStatus?: Snippet<[T, number]>;
	renderLoading?: Snippet;
	renderEmpty?: Snippet;
}
