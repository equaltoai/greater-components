/**
 * Patterns Registry
 * Defines metadata for reusable ActivityPub/Fediverse UI patterns
 */

import type { ComponentMetadata, ComponentDomain } from './index.js';

/**
 * Pattern metadata with additional configuration
 */
export interface PatternMetadata extends Omit<ComponentMetadata, 'type'> {
	type: 'pattern';
	/** Use case description */
	useCase: string;
	/** Related patterns */
	relatedPatterns?: string[];
}

/**
 * Patterns Registry
 */
export const patternRegistry: Record<string, PatternMetadata> = {
	// ====================
	// ARTIST FACE PATTERNS
	// ====================
	'exhibition-view': {
		name: 'exhibition-view',
		type: 'pattern',
		description: 'Curated exhibition display with navigation and curator notes',
		useCase: 'Display themed art exhibitions with multiple artists and curatorial context',
		files: [
			{ path: 'patterns/exhibition-view/Root.svelte', content: '', type: 'component' },
			{ path: 'patterns/exhibition-view/Gallery.svelte', content: '', type: 'component' },
			{ path: 'patterns/exhibition-view/Navigation.svelte', content: '', type: 'component' },
			{ path: 'patterns/exhibition-view/CuratorNote.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['gallery-grid', 'artwork-card', 'modal'],
		tags: ['pattern', 'artist', 'exhibition', 'gallery', 'curation'],
		version: '1.0.0',
		domain: 'artist',
		relatedPatterns: ['commission-workflow', 'critique-session'],
	},

	'commission-workflow': {
		name: 'commission-workflow',
		type: 'pattern',
		description: 'End-to-end commission request and fulfillment workflow',
		useCase: 'Manage art commission requests from inquiry through delivery and review',
		files: [
			{ path: 'patterns/commission-workflow/Root.svelte', content: '', type: 'component' },
			{ path: 'patterns/commission-workflow/Request.svelte', content: '', type: 'component' },
			{ path: 'patterns/commission-workflow/Quote.svelte', content: '', type: 'component' },
			{ path: 'patterns/commission-workflow/Progress.svelte', content: '', type: 'component' },
			{ path: 'patterns/commission-workflow/Delivery.svelte', content: '', type: 'component' },
			{ path: 'patterns/commission-workflow/Review.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal', 'tabs'],
		tags: ['pattern', 'artist', 'commission', 'workflow', 'monetization'],
		version: '1.0.0',
		domain: 'artist',
		relatedPatterns: ['exhibition-view', 'wip-thread'],
	},

	'critique-session': {
		name: 'critique-session',
		type: 'pattern',
		description: 'Structured artwork critique with annotations and feedback',
		useCase: 'Facilitate constructive feedback sessions on artwork with visual annotations',
		files: [
			{ path: 'patterns/critique-session/Root.svelte', content: '', type: 'component' },
			{ path: 'patterns/critique-session/Canvas.svelte', content: '', type: 'component' },
			{ path: 'patterns/critique-session/Annotations.svelte', content: '', type: 'component' },
			{ path: 'patterns/critique-session/Comments.svelte', content: '', type: 'component' },
			{ path: 'patterns/critique-session/Summary.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['media-viewer', 'button', 'tooltip'],
		tags: ['pattern', 'artist', 'critique', 'feedback', 'community'],
		version: '1.0.0',
		domain: 'artist',
		relatedPatterns: ['wip-thread', 'exhibition-view'],
	},

	'wip-thread': {
		name: 'wip-thread',
		type: 'pattern',
		description: 'Work-in-progress thread with version history and comments',
		useCase: 'Share creative process with version tracking and community engagement',
		files: [
			{ path: 'patterns/wip-thread/Root.svelte', content: '', type: 'component' },
			{ path: 'patterns/wip-thread/Timeline.svelte', content: '', type: 'component' },
			{ path: 'patterns/wip-thread/VersionCard.svelte', content: '', type: 'component' },
			{ path: 'patterns/wip-thread/Compare.svelte', content: '', type: 'component' },
			{ path: 'patterns/wip-thread/Comments.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['artwork-card', 'media-viewer', 'button'],
		tags: ['pattern', 'artist', 'wip', 'process', 'versioning'],
		version: '1.0.0',
		domain: 'artist',
		relatedPatterns: ['critique-session', 'commission-workflow'],
	},

	// ====================
	// THREAD VIEW
	// ====================
	'thread-view': {
		name: 'thread-view',
		type: 'pattern',
		description: 'Conversation threading with reply navigation and context display',
		useCase: 'Display threaded conversations with parent/child relationships and reply chains',
		files: [
			{ path: 'patterns/ThreadView.svelte', content: '', type: 'component' },
			{ path: 'patterns/ThreadItem.svelte', content: '', type: 'component' },
			{ path: 'patterns/ThreadContext.svelte', content: '', type: 'component' },
			{ path: 'patterns/thread-view.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['status'],
		tags: ['activitypub', 'thread', 'conversation', 'pattern', 'replies'],
		version: '1.0.0',
		relatedPatterns: ['content-warning'],
		domain: 'social',
	},

	// ====================
	// MODERATION TOOLS
	// ====================
	'moderation-tools': {
		name: 'moderation-tools',
		type: 'pattern',
		description: 'Block, mute, and report functionality with confirmation dialogs',
		useCase: 'Provide user moderation actions with proper confirmation and feedback',
		files: [
			{ path: 'patterns/ModerationTools.svelte', content: '', type: 'component' },
			{ path: 'patterns/BlockDialog.svelte', content: '', type: 'component' },
			{ path: 'patterns/MuteDialog.svelte', content: '', type: 'component' },
			{ path: 'patterns/ReportDialog.svelte', content: '', type: 'component' },
			{ path: 'patterns/moderation-tools.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['modal', 'menu', 'button'],
		tags: ['activitypub', 'moderation', 'block', 'mute', 'report', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// VISIBILITY SELECTOR
	// ====================
	'visibility-selector': {
		name: 'visibility-selector',
		type: 'pattern',
		description: 'Post visibility selection (public, unlisted, followers-only, direct)',
		useCase: 'Allow users to select post visibility with clear explanations of each option',
		files: [
			{ path: 'patterns/VisibilitySelector.svelte', content: '', type: 'component' },
			{ path: 'patterns/VisibilityOption.svelte', content: '', type: 'component' },
			{ path: 'patterns/visibility-selector.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu'],
		tags: ['activitypub', 'visibility', 'privacy', 'pattern'],
		version: '1.0.0',
		relatedPatterns: ['content-warning'],
		domain: 'social',
	},

	// ====================
	// CONTENT WARNING
	// ====================
	'content-warning': {
		name: 'content-warning',
		type: 'pattern',
		description: 'Content warning and sensitive content handling with expand/collapse',
		useCase: 'Hide sensitive content behind warnings with user-controlled reveal',
		files: [
			{ path: 'patterns/ContentWarning.svelte', content: '', type: 'component' },
			{ path: 'patterns/ContentWarningInput.svelte', content: '', type: 'component' },
			{ path: 'patterns/SensitiveMediaOverlay.svelte', content: '', type: 'component' },
			{ path: 'patterns/content-warning.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['activitypub', 'content-warning', 'sensitive', 'cw', 'pattern'],
		version: '1.0.0',
		relatedPatterns: ['visibility-selector'],
		domain: 'social',
	},

	// ====================
	// CUSTOM EMOJI PICKER
	// ====================
	'custom-emoji-picker': {
		name: 'custom-emoji-picker',
		type: 'pattern',
		description: 'Server-specific custom emoji picker with search and categories',
		useCase: 'Allow users to browse and insert custom emojis from their instance',
		files: [
			{ path: 'patterns/CustomEmojiPicker.svelte', content: '', type: 'component' },
			{ path: 'patterns/EmojiCategory.svelte', content: '', type: 'component' },
			{ path: 'patterns/EmojiSearch.svelte', content: '', type: 'component' },
			{ path: 'patterns/EmojiGrid.svelte', content: '', type: 'component' },
			{ path: 'patterns/custom-emoji-picker.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['modal'],
		tags: ['activitypub', 'emoji', 'custom-emoji', 'picker', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// FEDERATION INDICATOR
	// ====================
	'federation-indicator': {
		name: 'federation-indicator',
		type: 'pattern',
		description: 'Federation status and instance information display',
		useCase: 'Show federation status, instance info, and remote content indicators',
		files: [
			{ path: 'patterns/FederationIndicator.svelte', content: '', type: 'component' },
			{ path: 'patterns/InstanceBadge.svelte', content: '', type: 'component' },
			{ path: 'patterns/RemoteContentWarning.svelte', content: '', type: 'component' },
			{ path: 'patterns/federation-indicator.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['tooltip'],
		tags: ['activitypub', 'federation', 'instance', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// INSTANCE PICKER
	// ====================
	'instance-picker': {
		name: 'instance-picker',
		type: 'pattern',
		description: 'Multi-instance account switching for federated applications',
		useCase: 'Allow users to switch between multiple instance accounts',
		files: [
			{ path: 'patterns/InstancePicker.svelte', content: '', type: 'component' },
			{ path: 'patterns/InstanceList.svelte', content: '', type: 'component' },
			{ path: 'patterns/AddInstanceDialog.svelte', content: '', type: 'component' },
			{ path: 'patterns/instance-picker.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu', 'modal'],
		tags: ['activitypub', 'multi-account', 'instance', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// POLL COMPOSER
	// ====================
	'poll-composer': {
		name: 'poll-composer',
		type: 'pattern',
		description: 'Poll creation with multiple options and expiration settings',
		useCase: 'Create polls with customizable options, duration, and voting rules',
		files: [
			{ path: 'patterns/PollComposer.svelte', content: '', type: 'component' },
			{ path: 'patterns/PollOption.svelte', content: '', type: 'component' },
			{ path: 'patterns/PollSettings.svelte', content: '', type: 'component' },
			{ path: 'patterns/poll-composer.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['activitypub', 'poll', 'voting', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// MEDIA COMPOSER
	// ====================
	'media-composer': {
		name: 'media-composer',
		type: 'pattern',
		description: 'Advanced media handling with alt text and focal point selection',
		useCase: 'Upload and configure media with accessibility features',
		files: [
			{ path: 'patterns/MediaComposer.svelte', content: '', type: 'component' },
			{ path: 'patterns/MediaPreview.svelte', content: '', type: 'component' },
			{ path: 'patterns/AltTextEditor.svelte', content: '', type: 'component' },
			{ path: 'patterns/FocalPointPicker.svelte', content: '', type: 'component' },
			{ path: 'patterns/media-composer.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['activitypub', 'media', 'accessibility', 'alt-text', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// BOOKMARK MANAGER
	// ====================
	'bookmark-manager': {
		name: 'bookmark-manager',
		type: 'pattern',
		description: 'Saved posts management with filtering and search',
		useCase: 'Organize and browse bookmarked posts with search and filters',
		files: [
			{ path: 'patterns/BookmarkManager.svelte', content: '', type: 'component' },
			{ path: 'patterns/BookmarkList.svelte', content: '', type: 'component' },
			{ path: 'patterns/BookmarkFilters.svelte', content: '', type: 'component' },
			{ path: 'patterns/bookmark-manager.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['activitypub', 'bookmarks', 'saved', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},
};

/**
 * Get pattern metadata by name
 */
export function getPattern(name: string): PatternMetadata | null {
	return patternRegistry[name] ?? null;
}

/**
 * Get all pattern names
 */
export function getAllPatternNames(): string[] {
	return Object.keys(patternRegistry);
}

/**
 * Get patterns by domain
 */
export function getPatternsByDomain(domain: ComponentDomain): PatternMetadata[] {
	return Object.values(patternRegistry).filter((pattern) => pattern.domain === domain);
}

/**
 * Get related patterns for a given pattern
 */
export function getRelatedPatterns(name: string): PatternMetadata[] {
	const pattern = getPattern(name);
	if (!pattern?.relatedPatterns) return [];
	return pattern.relatedPatterns
		.map((relatedName) => getPattern(relatedName))
		.filter((p): p is PatternMetadata => p !== null);
}
