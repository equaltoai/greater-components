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
	'thread-view': {
		name: 'thread-view',
		type: 'pattern',
		description: 'Conversation threading with reply navigation',
		useCase: 'Display threaded conversations with parent/child relationships and reply chains',
		files: [
			{ path: 'lib/patterns/ThreadView.svelte', content: '', type: 'component' },
			{ path: 'lib/patterns/ThreadNodeView.svelte', content: '', type: 'component' },
			{ path: 'lib/patterns/ThreadView.types.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['status'],
		tags: ['activitypub', 'thread', 'conversation', 'pattern'],
		version: '1.0.0',
		domain: 'social',
		relatedPatterns: ['content-warning-handler'],
	},

	'content-warning-handler': {
		name: 'content-warning-handler',
		type: 'pattern',
		description: 'Content warning and sensitive content handling with expand/collapse',
		useCase: 'Hide sensitive content behind warnings with user-controlled reveal',
		files: [{ path: 'lib/patterns/ContentWarningHandler.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['activitypub', 'content-warning', 'pattern'],
		version: '1.0.0',
		domain: 'social',
		relatedPatterns: ['visibility-selector'],
	},

	'federation-indicator': {
		name: 'federation-indicator',
		type: 'pattern',
		description: 'Federation status and instance information display',
		useCase: 'Show federation status, instance info, and remote content indicators',
		files: [{ path: 'lib/patterns/FederationIndicator.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['social-generics'],
		tags: ['activitypub', 'federation', 'instance', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	'visibility-selector': {
		name: 'visibility-selector',
		type: 'pattern',
		description: 'Post visibility selection (public, unlisted, followers-only, direct)',
		useCase: 'Allow users to select post visibility with clear explanations of each option',
		files: [{ path: 'lib/patterns/VisibilitySelector.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu'],
		tags: ['activitypub', 'visibility', 'privacy', 'pattern'],
		version: '1.0.0',
		domain: 'social',
		relatedPatterns: ['content-warning-handler'],
	},

	'moderation-tools': {
		name: 'moderation-tools',
		type: 'pattern',
		description: 'Block, mute, and report functionality',
		useCase: 'Provide user moderation actions with proper confirmation and feedback',
		files: [{ path: 'lib/patterns/ModerationTools.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu', 'modal', 'social-generics'],
		tags: ['activitypub', 'moderation', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	'instance-picker': {
		name: 'instance-picker',
		type: 'pattern',
		description: 'Multi-instance account switching for federated applications',
		useCase: 'Allow users to switch between multiple instance accounts',
		files: [{ path: 'lib/patterns/InstancePicker.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu', 'social-generics'],
		tags: ['activitypub', 'multi-account', 'instance', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	'custom-emoji-picker': {
		name: 'custom-emoji-picker',
		type: 'pattern',
		description: 'Server-specific custom emoji picker with search and categories',
		useCase: 'Allow users to browse and insert custom emojis from their instance',
		files: [{ path: 'lib/patterns/CustomEmojiPicker.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['activitypub', 'emoji', 'custom-emoji', 'picker', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	'poll-composer': {
		name: 'poll-composer',
		type: 'pattern',
		description: 'Poll creation with multiple options and expiration settings',
		useCase: 'Create polls with customizable options, duration, and voting rules',
		files: [{ path: 'lib/patterns/PollComposer.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['activitypub', 'poll', 'voting', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	'media-composer': {
		name: 'media-composer',
		type: 'pattern',
		description: 'Advanced media handling with alt text and accessibility controls',
		useCase: 'Upload and configure media with accessibility features like alt text',
		files: [{ path: 'lib/patterns/MediaComposer.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['activitypub', 'media', 'accessibility', 'alt-text', 'pattern'],
		version: '1.0.0',
		domain: 'social',
	},

	'bookmark-manager': {
		name: 'bookmark-manager',
		type: 'pattern',
		description: 'Saved posts management with filtering and search',
		useCase: 'Organize and browse bookmarked posts with search and filters',
		files: [{ path: 'lib/patterns/BookmarkManager.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu'],
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
