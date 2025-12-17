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
	// CORE PACKAGES
	// ====================
	primitives: {
		name: 'primitives',
		type: 'shared',
		description: 'Styled UI primitives package',
		files: [{ path: 'greater/primitives/index.ts', content: '', type: 'component' }],
		dependencies: [],
		devDependencies: [],
		registryDependencies: ['tokens', 'icons'],
		tags: ['core', 'primitives', 'styled'],
		version: '1.0.0',
	},
	icons: {
		name: 'icons',
		type: 'shared',
		description: 'Icon library package',
		files: [{ path: 'greater/icons/index.ts', content: '', type: 'component' }],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['core', 'icons'],
		version: '1.0.0',
	},
	tokens: {
		name: 'tokens',
		type: 'shared',
		description: 'Design tokens package',
		files: [{ path: 'greater/tokens/index.ts', content: '', type: 'component' }],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['core', 'tokens'],
		version: '1.0.0',
	},
	utils: {
		name: 'utils',
		type: 'shared',
		description: 'Utilities package',
		files: [{ path: 'greater/utils/index.ts', content: '', type: 'utils' }],
		dependencies: [
			{ name: 'hast-util-to-mdast', version: '^10.1.2' },
			{ name: 'mdast-util-gfm', version: '^3.1.0' },
			{ name: 'mdast-util-to-markdown', version: '^2.1.2' },
			{ name: 'rehype-parse', version: '^9.0.1' },
			{ name: 'rehype-sanitize', version: '^6.0.0' },
			{ name: 'rehype-stringify', version: '^10.0.1' },
			{ name: 'unified', version: '^11.0.5' },
		],
		devDependencies: [],
		registryDependencies: [],
		tags: ['core', 'utils'],
		version: '1.0.0',
	},
	content: {
		name: 'content',
		type: 'shared',
		description: 'Content rendering package',
		files: [{ path: 'greater/content/index.ts', content: '', type: 'component' }],
		dependencies: [
			{ name: 'hast-util-sanitize', version: '^5.0.2' },
			{ name: 'rehype-sanitize', version: '^6.0.0' },
			{ name: 'rehype-stringify', version: '^10.0.1' },
			{ name: 'remark-gfm', version: '^4.0.1' },
			{ name: 'remark-parse', version: '^11.0.0' },
			{ name: 'remark-rehype', version: '^11.1.2' },
			{ name: 'shiki', version: '^3.19.0' },
			{ name: 'unified', version: '^11.0.5' },
		],
		devDependencies: [],
		registryDependencies: [],
		tags: ['core', 'content'],
		version: '1.0.0',
	},
	adapters: {
		name: 'adapters',
		type: 'shared',
		description: 'Protocol adapters package',
		files: [{ path: 'greater/adapters/index.ts', content: '', type: 'utils' }],
		dependencies: [
			{ name: '@apollo/client', version: '^4.0.9' },
			{ name: '@apollo/client-react-streaming', version: '^0.14.0' },
			{ name: '@graphql-typed-document-node/core', version: '^3.2.0' },
			{ name: 'graphql', version: '^16.12.0' },
			{ name: 'graphql-ws', version: '^6.0.6' },
		],
		devDependencies: [],
		registryDependencies: [],
		tags: ['core', 'adapters'],
		version: '1.0.0',
	},
	headless: {
		name: 'headless',
		type: 'shared',
		description: 'Headless primitives and behaviors package',
		files: [{ path: 'greater/headless/index.ts', content: '', type: 'component' }],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['core', 'headless'],
		version: '1.0.0',
	},

	'social-generics': {
		name: 'social-generics',
		type: 'shared',
		description: 'Generic ActivityPub types used by social face components and patterns',
		files: [
			{ path: 'lib/generics/index.ts', content: '', type: 'types' },
			{ path: 'lib/generics/adapters.ts', content: '', type: 'types' },
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['social', 'generics', 'types'],
		version: '1.0.0',
		domain: 'social',
	},

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
			{
				path: 'lib/types/common.ts',
				content: '',
				type: 'types',
			},
			{
				path: 'lib/utils/id.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/utils/keyboard.ts',
				content: '',
				type: 'utils',
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
			{
				path: 'lib/types/common.ts',
				content: '',
				type: 'types',
			},
			{
				path: 'lib/utils/id.ts',
				content: '',
				type: 'utils',
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
			{
				path: 'lib/types/common.ts',
				content: '',
				type: 'types',
			},
			{
				path: 'lib/utils/id.ts',
				content: '',
				type: 'utils',
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
			{
				path: 'lib/types/common.ts',
				content: '',
				type: 'types',
			},
			{
				path: 'lib/utils/id.ts',
				content: '',
				type: 'utils',
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
			{
				path: 'lib/types/common.ts',
				content: '',
				type: 'types',
			},
			{
				path: 'lib/utils/id.ts',
				content: '',
				type: 'utils',
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
		registryDependencies: ['button', 'social-generics'],
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

	'work-in-progress': {
		name: 'work-in-progress',
		type: 'compound',
		description: 'Work-in-progress thread with version history and community feedback',
		files: [
			{
				path: 'lib/components/CreativeTools/WorkInProgress/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/Header.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/VersionList.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/VersionCard.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/Timeline.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/Compare.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/Comments.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/context.ts',
				content: '',
				type: 'types',
			},
			{
				path: 'lib/components/CreativeTools/WorkInProgress/index.ts',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'artist', 'wip', 'process', 'versioning'],
		version: '1.0.0',
		domain: 'artist',
	},

	'critique-mode': {
		name: 'critique-mode',
		type: 'compound',
		description: 'Structured critique interface with annotation tools',
		files: [
			{
				path: 'lib/components/CreativeTools/CritiqueMode/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/CritiqueMode/Image.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/CritiqueMode/Annotations.svelte',
				content: '',
				type: 'component',
			},
			{ path: 'lib/components/CreativeTools/CritiqueMode/context.ts', content: '', type: 'types' },
			{
				path: 'lib/components/CreativeTools/CritiqueMode/index.ts',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'artist', 'critique', 'annotations', 'feedback'],
		version: '1.0.0',
		domain: 'artist',
	},

	'reference-board': {
		name: 'reference-board',
		type: 'compound',
		description: 'Reference board for collecting inspiration and materials',
		files: [
			{
				path: 'lib/components/CreativeTools/ReferenceBoard.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'artist', 'reference', 'moodboard', 'tools'],
		version: '1.0.0',
		domain: 'artist',
	},

	'commission-workflow': {
		name: 'commission-workflow',
		type: 'compound',
		description: 'Commission request workflow component for artists',
		files: [
			{
				path: 'lib/components/CreativeTools/CommissionWorkflow/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/CreativeTools/CommissionWorkflow/context.ts',
				content: '',
				type: 'types',
			},
			{
				path: 'lib/components/CreativeTools/CommissionWorkflow/index.ts',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['compound', 'artist', 'commission', 'workflow'],
		version: '1.0.0',
		domain: 'artist',
	},

	'critique-circle': {
		name: 'critique-circle',
		type: 'compound',
		description: 'Critique circle sessions with member queue and feedback history',
		files: [
			{
				path: 'lib/components/Community/CritiqueCircle/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/CritiqueCircle/Session.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/CritiqueCircle/Queue.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/CritiqueCircle/Members.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/CritiqueCircle/History.svelte',
				content: '',
				type: 'component',
			},
			{ path: 'lib/components/Community/CritiqueCircle/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Community/CritiqueCircle/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'artist', 'community', 'critique', 'feedback'],
		version: '1.0.0',
		domain: 'artist',
	},

	collaboration: {
		name: 'collaboration',
		type: 'compound',
		description: 'Collaborative projects with shared gallery and contributor management',
		files: [
			{
				path: 'lib/components/Community/Collaboration/Root.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/Collaboration/Project.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/Collaboration/Gallery.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/Collaboration/Contributors.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/Collaboration/Split.svelte',
				content: '',
				type: 'component',
			},
			{
				path: 'lib/components/Community/Collaboration/Uploads.svelte',
				content: '',
				type: 'component',
			},
			{ path: 'lib/components/Community/Collaboration/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Community/Collaboration/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['compound', 'artist', 'community', 'collaboration', 'projects'],
		version: '1.0.0',
		domain: 'artist',
	},

	'mentor-match': {
		name: 'mentor-match',
		type: 'compound',
		description: 'Mentor matching component for artist communities',
		files: [
			{ path: 'lib/components/Community/MentorMatch.svelte', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'artist', 'community', 'mentorship'],
		version: '1.0.0',
		domain: 'artist',
	},

	'process-documentation': {
		name: 'process-documentation',
		type: 'compound',
		description: 'Process documentation component for transparency and provenance',
		files: [
			{
				path: 'lib/components/Transparency/ProcessDocumentation.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'artist', 'transparency', 'process'],
		version: '1.0.0',
		domain: 'artist',
	},

	'ai-opt-out-controls': {
		name: 'ai-opt-out-controls',
		type: 'compound',
		description: 'Controls for opting out of AI training and indexing',
		files: [
			{
				path: 'lib/components/Transparency/AIOptOutControls.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'artist', 'transparency', 'ai', 'ethics'],
		version: '1.0.0',
		domain: 'artist',
	},

	'ethical-sourcing-badge': {
		name: 'ethical-sourcing-badge',
		type: 'compound',
		description: 'Badge for ethical sourcing and provenance signals',
		files: [
			{
				path: 'lib/components/Transparency/EthicalSourcingBadge.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['tooltip'],
		tags: ['compound', 'artist', 'transparency', 'ethics', 'provenance'],
		version: '1.0.0',
		domain: 'artist',
	},

	'institutional-tools': {
		name: 'institutional-tools',
		type: 'compound',
		description: 'Institutional tooling for galleries and organizations',
		files: [
			{
				path: 'lib/components/Monetization/InstitutionalTools.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['compound', 'artist', 'monetization', 'institutions'],
		version: '1.0.0',
		domain: 'artist',
	},

	'protection-tools': {
		name: 'protection-tools',
		type: 'compound',
		description: 'Reporting and protection tools for artworks and creators',
		files: [
			{
				path: 'lib/components/Monetization/ProtectionTools.svelte',
				content: '',
				type: 'component',
			},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button', 'modal'],
		tags: ['compound', 'artist', 'monetization', 'protection', 'safety'],
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
		registryDependencies: ['social-generics'],
		tags: ['activitypub', 'status', 'post', 'compound'],
		version: '1.0.0',
	},

	// ====================
	// LESSER INTEGRATION
	// ====================
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
		registryDependencies: ['button', 'tabs'],
		tags: ['profile', 'activitypub', 'lesser', 'compound'],
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
		registryDependencies: ['button', 'modal', 'social-generics'],
		tags: ['lists', 'activitypub', 'lesser', 'compound'],
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

	hashtags: {
		name: 'hashtags',
		type: 'compound',
		description: 'Hashtag follow/mute management UI',
		files: [
			{ path: 'lib/components/Hashtags/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Hashtags/FollowedList.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Hashtags/MutedList.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Hashtags/Controls.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Hashtags/context.ts', content: '', type: 'types' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['hashtags', 'activitypub', 'lesser', 'compound'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// BLOG FACE COMPONENTS
	// ====================
	article: {
		name: 'article',
		type: 'compound',
		description: 'Long-form article layout with reading progress and table of contents',
		files: [
			{ path: 'lib/components/Article/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/Header.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/Content.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/Footer.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/ReadingProgress.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/TableOfContents.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/RelatedPosts.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/ShareBar.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Article/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Article/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'blog', 'article', 'reading'],
		version: '1.0.0',
		domain: 'blog',
	},

	author: {
		name: 'author',
		type: 'compound',
		description: 'Author profile components for bylines and bios',
		files: [
			{ path: 'lib/components/Author/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Author/Card.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Author/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Author/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'blog', 'author', 'profile'],
		version: '1.0.0',
		domain: 'blog',
	},

	publication: {
		name: 'publication',
		type: 'compound',
		description: 'Publication container with banner and newsletter signup',
		files: [
			{ path: 'lib/components/Publication/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Publication/Banner.svelte', content: '', type: 'component' },
			{
				path: 'lib/components/Publication/NewsletterSignup.svelte',
				content: '',
				type: 'component',
			},
			{ path: 'lib/components/Publication/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Publication/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'blog', 'publication', 'newsletter'],
		version: '1.0.0',
		domain: 'blog',
	},

	navigation: {
		name: 'navigation',
		type: 'compound',
		description: 'Blog navigation helpers for archive and tag browsing',
		files: [
			{ path: 'lib/components/Navigation/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Navigation/ArchiveView.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Navigation/TagCloud.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Navigation/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Navigation/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'blog', 'navigation', 'tags'],
		version: '1.0.0',
		domain: 'blog',
	},

	editor: {
		name: 'editor',
		type: 'compound',
		description: 'Markdown editor for long-form publishing with preview',
		files: [
			{ path: 'lib/components/Editor/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Editor/Toolbar.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Editor/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Editor/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'blog', 'editor', 'markdown'],
		version: '1.0.0',
		domain: 'blog',
	},

	// ====================
	// COMMUNITY FACE COMPONENTS
	// ====================
	community: {
		name: 'community',
		type: 'compound',
		description: 'Community container components (header, rules, stats)',
		files: [
			{ path: 'lib/components/Community/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Community/Header.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Community/RulesSidebar.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Community/Stats.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Community/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Community/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'community', 'forum'],
		version: '1.0.0',
		domain: 'community',
	},

	post: {
		name: 'post',
		type: 'compound',
		description: 'Post card for community discussions with voting and metadata',
		files: [
			{ path: 'lib/components/Post/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Post/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Post/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['voting', 'flair'],
		tags: ['compound', 'community', 'post', 'forum'],
		version: '1.0.0',
		domain: 'community',
	},

	thread: {
		name: 'thread',
		type: 'compound',
		description: 'Thread view with nested comments and sorting',
		files: [
			{ path: 'lib/components/Thread/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Thread/CommentTree.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Thread/Comment.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Thread/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Thread/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['post'],
		tags: ['compound', 'community', 'thread', 'comments'],
		version: '1.0.0',
		domain: 'community',
	},

	voting: {
		name: 'voting',
		type: 'compound',
		description: 'Upvote/downvote controls and score display',
		files: [
			{ path: 'lib/components/Voting/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Voting/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'community', 'voting'],
		version: '1.0.0',
		domain: 'community',
	},

	flair: {
		name: 'flair',
		type: 'compound',
		description: 'Flair badges for posts and users',
		files: [
			{ path: 'lib/components/Flair/Badge.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Flair/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['compound', 'community', 'flair'],
		version: '1.0.0',
		domain: 'community',
	},

	moderation: {
		name: 'moderation',
		type: 'compound',
		description: 'Moderation tools for queue review and log viewing',
		files: [
			{ path: 'lib/components/Moderation/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Moderation/Panel.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Moderation/Queue.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Moderation/Log.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Moderation/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Moderation/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'community', 'moderation'],
		version: '1.0.0',
		domain: 'community',
	},

	wiki: {
		name: 'wiki',
		type: 'compound',
		description: 'Community wiki page viewer and editor',
		files: [
			{ path: 'lib/components/Wiki/Root.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Wiki/Navigation.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Wiki/Page.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Wiki/Editor.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Wiki/History.svelte', content: '', type: 'component' },
			{ path: 'lib/components/Wiki/context.ts', content: '', type: 'types' },
			{ path: 'lib/components/Wiki/index.ts', content: '', type: 'component' },
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: ['button'],
		tags: ['compound', 'community', 'wiki'],
		version: '1.0.0',
		domain: 'community',
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
				path: 'lib/adapters/graphql/index.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/adapters/graphql/client.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/adapters/graphql/LesserGraphQLAdapter.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/adapters/graphql/cache.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/adapters/graphql/optimistic.ts',
				content: '',
				type: 'utils',
			},
			{
				path: 'lib/adapters/graphql/generated/types.ts',
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
	return ['social', 'blog', 'community', 'artist', 'auth', 'admin', 'chat', 'core'];
}
