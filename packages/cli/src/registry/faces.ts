/**
 * Faces Registry
 * Defines face manifests - curated collections of components for specific application types
 */

import type { FaceManifest } from './index.js';

/**
 * Faces Registry
 */
export const faceRegistry: Record<string, FaceManifest> = {
	// ====================
	// SOCIAL FACE
	// ====================
	social: {
		name: 'social',
		type: 'face',
		description: 'Complete social media/Twitter-style UI for ActivityPub applications',
		files: [],
		dependencies: [
			{ name: 'svelte', version: '^5.0.0' },
			{ name: '@tanstack/svelte-virtual', version: '^3.13.13' },
		],
		devDependencies: [],
		registryDependencies: [],
		tags: ['face', 'social', 'twitter', 'fediverse', 'activitypub', 'mastodon'],
		version: '1.0.0',
		domain: 'social',
		includes: {
			primitives: ['button', 'modal', 'menu', 'tooltip', 'tabs'],
			shared: ['auth', 'compose', 'notifications', 'search', 'admin', 'messaging'],
			patterns: [
				'thread-view',
				'moderation-tools',
				'visibility-selector',
				'content-warning',
				'custom-emoji-picker',
				'federation-indicator',
				'instance-picker',
				'poll-composer',
				'media-composer',
				'bookmark-manager',
			],
			components: ['timeline', 'status', 'profile', 'lists', 'filters', 'hashtags'],
		},
		styles: {
			main: '@equaltoai/greater-components/faces/social/style.css',
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		examples: [
			'examples/social/timeline-page.svelte',
			'examples/social/profile-page.svelte',
			'examples/social/compose-modal.svelte',
		],
		docs: [
			'docs/faces/social/getting-started.md',
			'docs/faces/social/timeline-integration.md',
			'docs/faces/social/authentication.md',
		],
		recommendedShared: ['auth', 'compose', 'notifications', 'search'],
		lesserVersion: '1.0.0',
	},

	// ====================
	// BLOG FACE
	// ====================
	blog: {
		name: 'blog',
		type: 'face',
		description: 'Blog and long-form content UI for ActivityPub applications',
		files: [],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['face', 'blog', 'articles', 'long-form', 'activitypub'],
		version: '1.0.0',
		domain: 'blog',
		includes: {
			primitives: ['button', 'modal', 'menu', 'tooltip', 'tabs'],
			shared: ['auth', 'compose', 'notifications', 'search'],
			patterns: ['thread-view', 'content-warning', 'media-composer', 'bookmark-manager'],
			components: ['article-feed', 'article-view', 'author-profile', 'comments', 'reading-list'],
		},
		styles: {
			main: '@equaltoai/greater-components/faces/blog/style.css',
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		examples: [
			'examples/blog/article-page.svelte',
			'examples/blog/author-page.svelte',
			'examples/blog/reading-list.svelte',
		],
		docs: ['docs/faces/blog/getting-started.md', 'docs/faces/blog/article-rendering.md'],
		recommendedShared: ['auth', 'compose', 'search'],
		lesserVersion: '1.0.0',
	},

	// ====================
	// COMMUNITY FACE
	// ====================
	community: {
		name: 'community',
		type: 'face',
		description: 'Community/forum-style UI for ActivityPub group discussions',
		files: [],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['face', 'community', 'forum', 'groups', 'activitypub'],
		version: '1.0.0',
		domain: 'community',
		includes: {
			primitives: ['button', 'modal', 'menu', 'tooltip', 'tabs'],
			shared: ['auth', 'compose', 'notifications', 'search', 'admin'],
			patterns: ['thread-view', 'moderation-tools', 'content-warning', 'poll-composer'],
			components: [
				'group-list',
				'group-view',
				'discussion-thread',
				'member-list',
				'group-settings',
				'moderation-queue',
			],
		},
		styles: {
			main: '@equaltoai/greater-components/faces/community/style.css',
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		examples: [
			'examples/community/group-page.svelte',
			'examples/community/discussion-page.svelte',
			'examples/community/moderation-dashboard.svelte',
		],
		docs: [
			'docs/faces/community/getting-started.md',
			'docs/faces/community/group-management.md',
			'docs/faces/community/moderation.md',
		],
		recommendedShared: ['auth', 'compose', 'notifications', 'admin'],
		lesserVersion: '1.0.0',
	},

	// ====================
	// ARTIST FACE
	// ====================
	artist: {
		name: 'artist',
		type: 'face',
		description: 'Visual artist communities and portfolio-centric social platforms',
		files: [],
		dependencies: [
			{ name: 'svelte', version: '^5.0.0' },
			{ name: '@tanstack/svelte-virtual', version: '^3.13.13' },
		],
		devDependencies: [],
		registryDependencies: [],
		tags: ['face', 'artist', 'portfolio', 'gallery', 'visual-art', 'activitypub'],
		version: '1.0.0',
		domain: 'artist',
		includes: {
			primitives: ['button', 'modal', 'menu', 'tooltip', 'tabs'],
			shared: ['auth', 'compose', 'notifications', 'search'],
			patterns: ['exhibition-view', 'commission-workflow', 'critique-session', 'wip-thread'],
			components: [
				'artwork',
				'artwork-card',
				'media-viewer',
				'gallery-grid',
				'gallery-row',
				'gallery-masonry',
				'artist-profile',
				'artist-badge',
				'portfolio-section',
				'artist-timeline',
				'discovery-engine',
				'color-palette-search',
				'style-filter',
				'mood-map',
				'exhibition',
				'curator-spotlight',
				'collection-card',
				'work-in-progress',
				'critique-mode',
				'reference-board',
				'commission-workflow',
				'critique-circle',
				'collaboration',
				'mentor-match',
				'ai-disclosure',
				'process-documentation',
				'ai-opt-out-controls',
				'ethical-sourcing-badge',
				'tip-jar',
				'direct-purchase',
				'premium-badge',
				'institutional-tools',
				'protection-tools',
			],
		},
		styles: {
			main: '@equaltoai/greater-components/faces/artist/style.css',
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		examples: [
			'examples/artist/gallery-page.svelte',
			'examples/artist/portfolio-page.svelte',
			'examples/artist/exhibition-page.svelte',
			'examples/artist/commission-flow.svelte',
		],
		docs: [
			'docs/faces/artist/getting-started.md',
			'docs/faces/artist/gallery-integration.md',
			'docs/faces/artist/commission-workflow.md',
			'docs/faces/artist/ai-transparency.md',
		],
		recommendedShared: ['auth', 'compose', 'notifications', 'search'],
		lesserVersion: '1.0.0',
	},
};

/**
 * Get face manifest by name
 */
export function getFaceManifest(name: string): FaceManifest | null {
	return faceRegistry[name] ?? null;
}

/**
 * Get all face names
 */
export function getAllFaceNames(): string[] {
	return Object.keys(faceRegistry);
}

/**
 * Get all components included in a face (flattened)
 */
export function getFaceComponents(name: string): string[] {
	const face = getFaceManifest(name);
	if (!face) return [];

	return [
		...face.includes.primitives,
		...face.includes.shared,
		...face.includes.patterns,
		...face.includes.components,
	];
}

/**
 * Get recommended shared modules for a face
 */
export function getFaceRecommendedShared(name: string): string[] {
	const face = getFaceManifest(name);
	return face?.recommendedShared ?? [];
}

/**
 * Check if a component is included in a face
 */
export function isComponentInFace(componentName: string, faceName: string): boolean {
	const components = getFaceComponents(faceName);
	return components.includes(componentName);
}
