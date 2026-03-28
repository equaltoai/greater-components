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
				'content-warning-handler',
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
		examples: ['examples/social-app/README.md'],
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
			patterns: ['thread-view', 'content-warning-handler', 'media-composer', 'bookmark-manager'],
			components: ['article', 'author', 'publication', 'navigation', 'editor'],
		},
		styles: {
			main: '@equaltoai/greater-components/faces/blog/style.css',
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		examples: ['examples/blog-app/README.md'],
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
			patterns: ['thread-view', 'moderation-tools', 'content-warning-handler', 'poll-composer'],
			components: ['community', 'post', 'thread', 'voting', 'flair', 'moderation', 'wiki'],
		},
		styles: {
			main: '@equaltoai/greater-components/faces/community/style.css',
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		examples: [],
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
			patterns: [],
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
		examples: ['examples/artist-app/README.md'],
		docs: [
			'docs/faces/artist/getting-started.md',
			'docs/faces/artist/gallery-integration.md',
			'docs/faces/artist/commission-workflow.md',
			'docs/faces/artist/ai-transparency.md',
		],
		recommendedShared: ['auth', 'compose', 'notifications', 'search'],
		lesserVersion: '1.0.0',
	},

	// ====================
	// AGENT FACE
	// ====================
	agent: {
		name: 'agent',
		type: 'face',
		description:
			'Agent-first workflow shells for request, review, declaration, signing, graduation, and continuity',
		files: [
			{ path: 'greater/faces/agent/index.ts', content: '', type: 'component' },
			{ path: 'greater/faces/agent/compositions.ts', content: '', type: 'types' },
			{ path: 'greater/faces/agent/theme.css', content: '', type: 'styles' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['face', 'agent', 'workflow', 'request', 'graduation'],
		version: '1.0.0',
		domain: 'agent',
		includes: {
			primitives: ['button', 'modal', 'tabs'],
			shared: ['agent', 'soul', 'notifications', 'messaging', 'chat'],
			patterns: [],
			components: [],
		},
		surfaces: [
			'genesis-workspace',
			'nexus-dashboard',
			'identity-nexus',
			'soul-request-center',
			'graduation-approval-thread',
		],
		exports: ['AGENT_FACE_PACKAGE_ROLE', 'AGENT_FACE_COMPOSITIONS', 'getAgentFaceComposition'],
		types: ['AgentFacePackageRole', 'AgentFaceComposition'],
		styles: {
			main: '@equaltoai/greater-components/faces/agent/style.css',
			tokens: '@equaltoai/greater-components/tokens/theme.css',
		},
		examples: [],
		docs: ['docs/faces/agent/getting-started.md', 'docs/agent-workflow-expansion.md'],
		recommendedShared: ['agent', 'soul', 'notifications', 'messaging', 'chat'],
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
 * Get named face surfaces that are exported from the face package
 */
export function getFaceSurfaces(name: string): string[] {
	const face = getFaceManifest(name);
	return face?.surfaces ?? [];
}

/**
 * Get exported symbols for a face package
 */
export function getFaceExports(name: string): string[] {
	const face = getFaceManifest(name);
	return face?.exports ?? [];
}

/**
 * Check if a component is included in a face
 */
export function isComponentInFace(componentName: string, faceName: string): boolean {
	const components = getFaceComponents(faceName);
	return components.includes(componentName);
}
