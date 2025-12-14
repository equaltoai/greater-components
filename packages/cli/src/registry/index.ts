/**
 * Component Registry
 * Defines all available components and their metadata
 */

export interface ComponentFile {
	path: string;
	content: string;
	type: 'component' | 'utils' | 'types' | 'styles';
	/** Whether to transform import paths based on user's alias configuration */
	transform?: boolean;
}

export interface ComponentDependency {
	name: string;
	version: string;
}

/** Component type categories */
export type ComponentType = 'primitive' | 'compound' | 'pattern' | 'adapter' | 'shared' | 'face';

/** Target installation directory */
export type ComponentTarget = 'components' | 'utils' | 'types' | 'styles';

/** Domain categories for filtering */
export type ComponentDomain =
	| 'social'
	| 'blog'
	| 'community'
	| 'auth'
	| 'admin'
	| 'chat'
	| 'core'
	| 'artist';

export interface ComponentMetadata {
	name: string;
	type: ComponentType;
	description: string;
	files: ComponentFile[];
	dependencies: ComponentDependency[];
	devDependencies: ComponentDependency[];
	registryDependencies: string[]; // Other Greater components this depends on
	tags: string[];
	version: string;
	/** Target installation directory */
	target?: ComponentTarget;
	/** Lesser schema version compatibility */
	lesserVersion?: string;
	/** Breaking change warnings */
	breaking?: string[];
	/** Domain category for filtering */
	domain?: ComponentDomain;
}

/**
 * Face Manifest - Curated collection of components for a specific application type
 * Extends ComponentMetadata with face-specific configuration
 */
export interface FaceManifest extends ComponentMetadata {
	type: 'face';
	/** Components included in this face */
	includes: {
		/** Primitive components (button, modal, etc.) */
		primitives: string[];
		/** Shared modules (auth, compose, notifications, etc.) */
		shared: string[];
		/** Pattern components (thread-view, moderation-tools, etc.) */
		patterns: string[];
		/** Compound components specific to this face */
		components: string[];
	};
	/** Style configuration */
	styles: {
		/** Main CSS bundle path */
		main: string;
		/** Optional design tokens path */
		tokens?: string;
	};
	/** Example usage paths */
	examples?: string[];
	/** Documentation paths */
	docs?: string[];
	/** Recommended shared modules for this face */
	recommendedShared?: string[];
}

/**
 * Component Registry
 */
export const componentRegistry: Record<string, ComponentMetadata> = {
	// ====================
	// HEADLESS PRIMITIVES
	// ====================
	button: {
		name: 'button',
		type: 'primitive',
		description: 'Headless button primitive with keyboard navigation and ARIA support',
		files: [
			{
				path: 'lib/primitives/button.ts',
				content: '', // Will be populated by CLI
				type: 'component',
			},
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['headless', 'primitive', 'button', 'accessibility'],
		version: '1.0.0',
	},

	modal: {
		name: 'modal',
		type: 'primitive',
		description: 'Headless modal primitive with focus trap, ESC handling, and portal support',
		files: [
			{
				path: 'lib/primitives/modal.ts',
				content: '',
				type: 'component',
			},
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['headless', 'primitive', 'modal', 'dialog', 'accessibility'],
		version: '1.0.0',
	},

	menu: {
		name: 'menu',
		type: 'primitive',
		description: 'Headless menu primitive with keyboard navigation and typeahead search',
		files: [
			{
				path: 'lib/primitives/menu.ts',
				content: '',
				type: 'component',
			},
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['headless', 'primitive', 'menu', 'dropdown', 'accessibility'],
		version: '1.0.0',
	},

	tooltip: {
		name: 'tooltip',
		type: 'primitive',
		description: 'Headless tooltip primitive with smart positioning and hover/focus handling',
		files: [
			{
				path: 'lib/primitives/tooltip.ts',
				content: '',
				type: 'component',
			},
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['headless', 'primitive', 'tooltip', 'popover', 'accessibility'],
		version: '1.0.0',
	},

	tabs: {
		name: 'tabs',
		type: 'primitive',
		description: 'Headless tabs primitive with arrow navigation and ARIA support',
		files: [
			{
				path: 'lib/primitives/tabs.ts',
				content: '',
				type: 'component',
			},
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['headless', 'primitive', 'tabs', 'accessibility'],
		version: '1.0.0',
	},

	// ====================
	// COMPOUND COMPONENTS
	// ====================
	timeline: {
		name: 'timeline',
		type: 'compound',
		description: 'ActivityPub timeline with virtual scrolling and real-time updates',
		files: [
			{
				path: 'lib/components/Timeline/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Timeline/Item.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Timeline/LoadMore.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Timeline/EmptyState.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Timeline/ErrorState.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Timeline/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['activitypub', 'timeline', 'feed', 'compound', 'virtual-scroll'],
		version: '1.0.0',
	},

	// ====================
	// ARTIST FACE COMPONENTS
	// ====================
	artwork: {
		name: 'artwork',
		type: 'compound',
		description:
			'Compound component for artwork display with metadata, attribution, and AI disclosure',
		files: [
			{ path: 'lib/components/Artwork/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/Image.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/Title.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/Attribution.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/Metadata.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/Stats.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/Actions.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/AIDisclosure.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Artwork/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Artwork/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'tooltip'],
		tags: ['compound', 'artist', 'artwork', 'gallery'],
		version: '1.0.0',
		domain: 'artist',
	},

	'artwork-card': {
		name: 'artwork-card',
		type: 'compound',
		description: 'Compact artwork card for grid views with hover overlay',
		files: [{ path: 'lib/components/ArtworkCard.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'artist', 'artwork', 'card'],
		version: '1.0.0',
		domain: 'artist',
	},

	'media-viewer': {
		name: 'media-viewer',
		type: 'compound',
		description: 'Full-screen immersive artwork viewing with zoom and pan',
		files: [
			{ path: 'lib/components/MediaViewer/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/MediaViewer/Navigation.svelte', content: '', type: 'component' },
			{ path: 'lib/components/MediaViewer/ZoomControls.svelte', content: '', type: 'component' },
			{ path: 'lib/components/MediaViewer/MetadataPanel.svelte', content: '', type: 'component' },
			{ path: 'lib/components/MediaViewer/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/MediaViewer/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['compound', 'artist', 'media', 'viewer', 'lightbox'],
		version: '1.0.0',
		domain: 'artist',
	},

	'gallery-grid': {
		name: 'gallery-grid',
		type: 'compound',
		description: 'Responsive grid layout for artwork display with virtual scrolling',
		files: [
			{ path: 'lib/components/Gallery/Grid.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Gallery/utils.ts', content: '', type: 'utils' },
			{ path: 'lib/components/Gallery/index.ts', content: '', type: 'component' },
		],
		dependencies: [
			{ name: 'svelte', version: '^5.0.0' },
			{ name: '@tanstack/svelte-virtual', version: '^3.13.13' },
		],
		devDependencies: [],
		registryDependencies: ['artwork-card'],
		tags: ['compound', 'artist', 'gallery', 'grid', 'layout'],
		version: '1.0.0',
		domain: 'artist',
	},

	'gallery-row': {
		name: 'gallery-row',
		type: 'compound',
		description: 'Horizontal scrolling row for curated artwork selections',
		files: [{ path: 'lib/components/Gallery/Row.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['artwork-card'],
		tags: ['compound', 'artist', 'gallery', 'row', 'carousel'],
		version: '1.0.0',
		domain: 'artist',
	},

	'gallery-masonry': {
		name: 'gallery-masonry',
		type: 'compound',
		description: 'Masonry layout respecting artwork aspect ratios',
		files: [{ path: 'lib/components/Gallery/Masonry.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['artwork-card'],
		tags: ['compound', 'artist', 'gallery', 'masonry', 'layout'],
		version: '1.0.0',
		domain: 'artist',
	},

	'artist-profile': {
		name: 'artist-profile',
		type: 'compound',
		description: 'Artist profile as gallery space with portfolio sections',
		files: [
			{ path: 'lib/components/ArtistProfile/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/HeroBanner.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Avatar.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Name.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Badges.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Statement.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Stats.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Sections.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Actions.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Edit.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/Timeline.svelte', content: '', type: 'component' },
			{ path: 'lib/components/ArtistProfile/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/ArtistProfile/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'tabs', 'modal', 'gallery-grid'],
		tags: ['compound', 'artist', 'profile', 'portfolio'],
		version: '1.0.0',
		domain: 'artist',
	},

	'artist-badge': {
		name: 'artist-badge',
		type: 'compound',
		description: 'Professional verification and credential badges',
		files: [{ path: 'lib/components/ArtistBadge.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['tooltip'],
		tags: ['compound', 'artist', 'badge', 'verification'],
		version: '1.0.0',
		domain: 'artist',
	},

	'portfolio-section': {
		name: 'portfolio-section',
		type: 'compound',
		description: 'Customizable gallery section within artist profiles',
		files: [{ path: 'lib/components/PortfolioSection.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['gallery-grid', 'gallery-row'],
		tags: ['compound', 'artist', 'portfolio', 'section'],
		version: '1.0.0',
		domain: 'artist',
	},

	'artist-timeline': {
		name: 'artist-timeline',
		type: 'compound',
		description: 'Timeline for artist career milestones and activity',
		files: [{ path: 'lib/components/ArtistTimeline.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'artist', 'timeline', 'activity'],
		version: '1.0.0',
		domain: 'artist',
	},

	'discovery-engine': {
		name: 'discovery-engine',
		type: 'compound',
		description: 'AI-powered artwork discovery with style and color search',
		files: [
			{ path: 'lib/components/Discovery/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Discovery/SearchBar.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Discovery/Filters.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Discovery/Results.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Discovery/Suggestions.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Discovery/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Discovery/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'gallery-grid'],
		tags: ['compound', 'artist', 'discovery', 'search', 'ai'],
		version: '1.0.0',
		domain: 'artist',
	},

	'color-palette-search': {
		name: 'color-palette-search',
		type: 'compound',
		description: 'Search artworks by color palette matching',
		files: [
			{
				path: 'lib/components/Discovery/ColorPaletteSearch.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'artist', 'discovery', 'color', 'search'],
		version: '1.0.0',
		domain: 'artist',
	},

	'style-filter': {
		name: 'style-filter',
		type: 'compound',
		description: 'Filter artworks by art style and movement',
		files: [
			{ path: 'lib/components/Discovery/StyleFilter.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'menu'],
		tags: ['compound', 'artist', 'discovery', 'filter', 'style'],
		version: '1.0.0',
		domain: 'artist',
	},

	'mood-map': {
		name: 'mood-map',
		type: 'compound',
		description: 'Visual mood-based artwork discovery interface',
		files: [{ path: 'lib/components/Discovery/MoodMap.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'artist', 'discovery', 'mood', 'visualization'],
		version: '1.0.0',
		domain: 'artist',
	},

	exhibition: {
		name: 'exhibition',
		type: 'compound',
		description: 'Curated exhibition display with navigation and curator notes',
		files: [
			{ path: 'lib/components/Exhibition/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Exhibition/Banner.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Exhibition/Gallery.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Exhibition/Statement.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Exhibition/Artists.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Exhibition/Navigation.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Exhibition/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Exhibition/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['gallery-grid', 'artwork-card', 'button'],
		tags: ['compound', 'artist', 'exhibition', 'curation'],
		version: '1.0.0',
		domain: 'artist',
	},

	'curator-spotlight': {
		name: 'curator-spotlight',
		type: 'compound',
		description: 'Spotlight component for featured curators',
		files: [
			{ path: 'lib/components/Curation/CuratorSpotlight.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['artist-badge'],
		tags: ['compound', 'artist', 'curation', 'spotlight'],
		version: '1.0.0',
		domain: 'artist',
	},

	'collection-card': {
		name: 'collection-card',
		type: 'compound',
		description: 'Card component for artwork collections',
		files: [
			{ path: 'lib/components/Curation/CollectionCard.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'artist', 'collection', 'card'],
		version: '1.0.0',
		domain: 'artist',
	},

	'ai-disclosure': {
		name: 'ai-disclosure',
		type: 'compound',
		description: 'Transparency component for AI usage disclosure',
		files: [{ path: 'lib/components/Artwork/AIDisclosure.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['tooltip'],
		tags: ['compound', 'artist', 'ai', 'transparency', 'ethics'],
		version: '1.0.0',
		domain: 'artist',
	},

	'tip-jar': {
		name: 'tip-jar',
		type: 'compound',
		description: 'Component for accepting tips and donations',
		files: [{ path: 'lib/components/Monetization/TipJar.svelte', content: '', type: 'component' }],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['compound', 'artist', 'monetization', 'tips'],
		version: '1.0.0',
		domain: 'artist',
	},

	'direct-purchase': {
		name: 'direct-purchase',
		type: 'compound',
		description: 'Direct artwork purchase component',
		files: [
			{ path: 'lib/components/Monetization/DirectPurchase.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['compound', 'artist', 'monetization', 'purchase'],
		version: '1.0.0',
		domain: 'artist',
	},

	'premium-badge': {
		name: 'premium-badge',
		type: 'compound',
		description: 'Badge for premium/subscription features',
		files: [
			{ path: 'lib/components/Monetization/PremiumBadge.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['tooltip'],
		tags: ['compound', 'artist', 'monetization', 'premium'],
		version: '1.0.0',
		domain: 'artist',
	},

	status: {
		name: 'status',
		type: 'compound',
		description: 'ActivityPub status/post with media, actions, and content rendering',
		files: [
			{
				path: 'lib/components/Status/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Status/Header.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Status/Content.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Status/Media.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Status/Actions.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Status/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['activitypub', 'status', 'post', 'compound'],
		version: '1.0.0',
	},

	notifications: {
		name: 'notifications',
		type: 'compound',
		description: 'ActivityPub notifications with grouping and filtering',
		files: [
			{
				path: 'lib/components/Notifications/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Notifications/Item.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Notifications/Group.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Notifications/Filter.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Notifications/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['activitypub', 'notifications', 'compound'],
		version: '1.0.0',
	},

	// ====================
	// ACTIVITYPUB PATTERNS
	// ====================
	'thread-view': {
		name: 'thread-view',
		type: 'pattern',
		description: 'Conversation threading with reply navigation',
		files: [
			{
				path: 'lib/patterns/ThreadView.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['status'],
		tags: ['activitypub', 'thread', 'conversation', 'pattern'],
		version: '1.0.0',
	},

	'moderation-tools': {
		name: 'moderation-tools',
		type: 'pattern',
		description: 'Block, mute, and report functionality',
		files: [
			{
				path: 'lib/patterns/ModerationTools.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['modal', 'menu'],
		tags: ['activitypub', 'moderation', 'pattern'],
		version: '1.0.0',
	},

	'content-warning-handler': {
		name: 'content-warning-handler',
		type: 'pattern',
		description: 'Content warning and sensitive content handling with expand/collapse',
		files: [
			{
				path: 'lib/patterns/ContentWarningHandler.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['activitypub', 'content-warning', 'pattern'],
		version: '1.0.0',
	},

	'federation-indicator': {
		name: 'federation-indicator',
		type: 'pattern',
		description: 'Federation status and instance information display',
		files: [
			{
				path: 'lib/patterns/FederationIndicator.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['tooltip'],
		tags: ['activitypub', 'federation', 'pattern'],
		version: '1.0.0',
	},

	'visibility-selector': {
		name: 'visibility-selector',
		type: 'pattern',
		description: 'Post visibility selection (public, unlisted, followers-only, direct)',
		files: [
			{
				path: 'lib/patterns/VisibilitySelector.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu'],
		tags: ['activitypub', 'visibility', 'pattern'],
		version: '1.0.0',
	},

	'instance-picker': {
		name: 'instance-picker',
		type: 'pattern',
		description: 'Multi-instance account switching for federated applications',
		files: [
			{
				path: 'lib/patterns/InstancePicker.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['menu', 'modal'],
		tags: ['activitypub', 'multi-account', 'pattern'],
		version: '1.0.0',
	},

	'custom-emoji-picker': {
		name: 'custom-emoji-picker',
		type: 'pattern',
		description: 'Server-specific custom emoji picker with search',
		files: [
			{
				path: 'lib/patterns/CustomEmojiPicker.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['modal'],
		tags: ['activitypub', 'emoji', 'pattern'],
		version: '1.0.0',
	},

	'poll-composer': {
		name: 'poll-composer',
		type: 'pattern',
		description: 'Poll creation with multiple options and expiration settings',
		files: [
			{
				path: 'lib/patterns/PollComposer.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['activitypub', 'poll', 'pattern'],
		version: '1.0.0',
	},

	'media-composer': {
		name: 'media-composer',
		type: 'pattern',
		description: 'Advanced media handling with alt text and focal point selection',
		files: [
			{
				path: 'lib/patterns/MediaComposer.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['activitypub', 'media', 'accessibility', 'pattern'],
		version: '1.0.0',
	},

	'bookmark-manager': {
		name: 'bookmark-manager',
		type: 'pattern',
		description: 'Saved posts management with filtering and search',
		files: [
			{
				path: 'lib/patterns/BookmarkManager.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['activitypub', 'bookmarks', 'pattern'],
		version: '1.0.0',
	},

	// ====================
	// LESSER INTEGRATION
	// ====================
	auth: {
		name: 'auth',
		type: 'compound',
		description: 'Complete authentication system with WebAuthn, 2FA, and wallet support',
		files: [
			{
				path: 'lib/components/Auth/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/LoginForm.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/RegisterForm.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/WebAuthnSetup.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/WalletConnect.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/OAuthConsent.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/TwoFactorSetup.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/TwoFactorVerify.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/BackupCodes.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/PasswordReset.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Auth/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['auth', 'authentication', 'webauthn', '2fa', 'wallet', 'lesser', 'compound'],
		version: '1.0.0',
	},

	profile: {
		name: 'profile',
		type: 'compound',
		description: 'User profile with header, stats, tabs, fields, and edit functionality',
		files: [
			{
				path: 'lib/components/Profile/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Profile/Header.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Profile/Stats.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Profile/Tabs.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Profile/Fields.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Profile/Edit.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Profile/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'menu', 'tabs'],
		tags: ['profile', 'activitypub', 'lesser', 'compound'],
		version: '1.0.0',
	},

	search: {
		name: 'search',
		type: 'compound',
		description: 'Search with filters and AI semantic search',
		files: [
			{
				path: 'lib/components/Search/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Search/Bar.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Search/Results.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Search/Filters.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Search/ActorResult.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Search/NoteResult.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Search/TagResult.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Search/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['search', 'activitypub', 'lesser', 'compound'],
		version: '1.0.0',
	},

	compose: {
		name: 'compose',
		type: 'compound',
		description:
			'Post composition UI with character counting, visibility controls, and media attachments',
		files: [
			{
				path: 'lib/components/Compose/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Compose/Editor.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Compose/Submit.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Compose/CharacterCount.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Compose/VisibilitySelect.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Compose/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compose', 'post', 'activitypub', 'lesser', 'compound'],
		version: '1.0.0',
	},

	lists: {
		name: 'lists',
		type: 'compound',
		description: 'List management system for organizing and viewing curated actor feeds',
		files: [
			{
				path: 'lib/components/Lists/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Lists/Manager.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Lists/Editor.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Lists/Timeline.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Lists/MemberPicker.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Lists/Settings.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Lists/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['lists', 'activitypub', 'lesser', 'compound'],
		version: '1.0.0',
	},

	messages: {
		name: 'messages',
		type: 'compound',
		description: 'Direct messaging system with threaded conversations and real-time updates',
		files: [
			{
				path: 'lib/components/Messages/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/Conversations.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/Thread.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/Composer.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/Message.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/NewConversation.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/MediaUpload.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/UnreadIndicator.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Messages/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['messages', 'dm', 'chat', 'activitypub', 'lesser', 'compound'],
		version: '1.0.0',
	},

	filters: {
		name: 'filters',
		type: 'compound',
		description:
			'Content filtering system with keyword/phrase filtering and context-specific rules',
		files: [
			{
				path: 'lib/components/Filters/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Filters/Manager.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Filters/Editor.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Filters/FilteredContent.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Filters/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['filters', 'moderation', 'activitypub', 'lesser', 'compound'],
		version: '1.0.0',
	},

	admin: {
		name: 'admin',
		type: 'compound',
		description:
			'Complete admin dashboard with user management, reports, moderation, and analytics',
		files: [
			{
				path: 'lib/components/Admin/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Overview.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Users.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Reports.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Moderation.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Federation.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Settings.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Logs.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/Analytics.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Admin/context.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal', 'tabs'],
		tags: ['admin', 'dashboard', 'moderation', 'lesser', 'compound'],
		version: '1.0.0',
	},

	// ====================
	// ADAPTERS
	// ====================
	'graphql-adapter': {
		name: 'graphql-adapter',
		type: 'adapter',
		description: 'GraphQL adapter for Lesser with caching and subscriptions',
		files: [
			{
				path: 'lib/adapters/graphql/client.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/adapters/graphql/queries.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/adapters/graphql/types.ts',
				content: '',
				type: 'types',
			},
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['adapter', 'graphql', 'lesser'],
		version: '1.0.0',
	},
};

// Re-export shared module registry
export {
	sharedModuleRegistry,
	getSharedModule,
	getAllSharedModuleNames,
	getSharedModulesByDomain,
	type SharedModuleMetadata,
} from './shared.js';

// Re-export patterns registry
export {
	patternRegistry,
	getPattern,
	getAllPatternNames,
	getPatternsByDomain,
	getRelatedPatterns,
	type PatternMetadata,
} from './patterns.js';

// Re-export faces registry
export {
	faceRegistry,
	getFaceManifest,
	getAllFaceNames,
	getFaceComponents,
	getFaceRecommendedShared,
	isComponentInFace,
} from './faces.js';

// Import registries for unified queries
import { sharedModuleRegistry } from './shared.js';
import { patternRegistry } from './patterns.js';
import { faceRegistry } from './faces.js';

/**
 * Get component metadata by name
 * Searches across all registries: components, shared, patterns
 */
export function getComponent(name: string): ComponentMetadata | null {
	// Check main component registry first
	if (componentRegistry[name]) {
		return componentRegistry[name];
	}

	// Check shared module registry
	if (sharedModuleRegistry[name]) {
		return sharedModuleRegistry[name] as ComponentMetadata;
	}

	// Check pattern registry
	if (patternRegistry[name]) {
		return patternRegistry[name] as ComponentMetadata;
	}

	return null;
}

/**
 * Get all components of a specific type
 * Searches across all registries
 */
export function getComponentsByType(type: ComponentType): ComponentMetadata[] {
	const results: ComponentMetadata[] = [];

	// From main registry
	results.push(...Object.values(componentRegistry).filter((comp) => comp.type === type));

	// Check other registries based on type
	if (type === 'shared') {
		results.push(...(Object.values(sharedModuleRegistry) as ComponentMetadata[]));
	} else if (type === 'pattern') {
		results.push(...(Object.values(patternRegistry) as ComponentMetadata[]));
	} else if (type === 'face') {
		results.push(...(Object.values(faceRegistry) as ComponentMetadata[]));
	}

	return results;
}

/**
 * Get all components by domain
 */
export function getComponentsByDomain(domain: ComponentDomain): ComponentMetadata[] {
	const results: ComponentMetadata[] = [];

	// From main registry
	results.push(...Object.values(componentRegistry).filter((comp) => comp.domain === domain));

	// From shared modules
	results.push(
		...(Object.values(sharedModuleRegistry).filter(
			(mod) => mod.domain === domain
		) as ComponentMetadata[])
	);

	// From patterns
	results.push(
		...(Object.values(patternRegistry).filter(
			(pattern) => pattern.domain === domain
		) as ComponentMetadata[])
	);

	return results;
}

/**
 * Get all components with a specific tag
 * Searches across all registries
 */
export function getComponentsByTag(tag: string): ComponentMetadata[] {
	const results: ComponentMetadata[] = [];

	results.push(...Object.values(componentRegistry).filter((comp) => comp.tags.includes(tag)));

	results.push(
		...(Object.values(sharedModuleRegistry).filter((mod) =>
			mod.tags.includes(tag)
		) as ComponentMetadata[])
	);

	results.push(
		...(Object.values(patternRegistry).filter((pattern) =>
			pattern.tags.includes(tag)
		) as ComponentMetadata[])
	);

	return results;
}

/**
 * Search components by name or description
 * Searches across all registries
 */
export function searchComponents(query: string): ComponentMetadata[] {
	const lowerQuery = query.toLowerCase();
	const results: ComponentMetadata[] = [];

	const matchesQuery = (comp: ComponentMetadata) =>
		comp.name.toLowerCase().includes(lowerQuery) ||
		comp.description.toLowerCase().includes(lowerQuery) ||
		comp.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

	results.push(...Object.values(componentRegistry).filter(matchesQuery));

	results.push(
		...(Object.values(sharedModuleRegistry).filter(matchesQuery) as ComponentMetadata[])
	);

	results.push(...(Object.values(patternRegistry).filter(matchesQuery) as ComponentMetadata[]));

	return results;
}

/**
 * Get all component names from all registries
 */
export function getAllComponentNames(): string[] {
	const names = new Set<string>(Object.keys(componentRegistry));

	Object.keys(sharedModuleRegistry).forEach((name) => names.add(name));
	Object.keys(patternRegistry).forEach((name) => names.add(name));

	return Array.from(names);
}

/**
 * Resolve component dependencies (including registry dependencies)
 * Works across all registries
 */
export function resolveComponentDependencies(name: string): string[] {
	const component = getComponent(name);
	if (!component) {
		return [];
	}

	const deps = new Set<string>([name]);

	// Recursively resolve registry dependencies
	for (const depName of component.registryDependencies) {
		const depComponent = getComponent(depName);
		if (depComponent) {
			resolveComponentDependencies(depName).forEach((d) => deps.add(d));
		}
	}

	return Array.from(deps);
}

/**
 * Get combined registry statistics
 */
export function getRegistryStats(): {
	primitives: number;
	compounds: number;
	patterns: number;
	adapters: number;
	shared: number;
	faces: number;
	total: number;
} {
	const primitives = Object.values(componentRegistry).filter((c) => c.type === 'primitive').length;
	const compounds = Object.values(componentRegistry).filter((c) => c.type === 'compound').length;
	const adapters = Object.values(componentRegistry).filter((c) => c.type === 'adapter').length;
	const patterns = Object.keys(patternRegistry).length;
	const shared = Object.keys(sharedModuleRegistry).length;
	const faces = Object.keys(faceRegistry).length;

	return {
		primitives,
		compounds,
		patterns,
		adapters,
		shared,
		faces,
		total: primitives + compounds + patterns + adapters + shared + faces,
	};
}

/**
 * Get all available component types
 */
export function getAllComponentTypes(): ComponentType[] {
	return ['primitive', 'compound', 'pattern', 'adapter', 'shared', 'face'];
}

/**
 * Get all available domains
 */
export function getAllDomains(): ComponentDomain[] {
	return ['social', 'blog', 'community', 'auth', 'admin', 'chat', 'core'];
}
