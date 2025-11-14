/**
 * Component Registry
 * Defines all available components and their metadata
 */

export interface ComponentFile {
	path: string;
	content: string;
	type: 'component' | 'utils' | 'types' | 'styles';
}

export interface ComponentDependency {
	name: string;
	version: string;
}

export interface ComponentMetadata {
	name: string;
	type: 'primitive' | 'compound' | 'pattern' | 'adapter';
	description: string;
	files: ComponentFile[];
	dependencies: ComponentDependency[];
	devDependencies: ComponentDependency[];
	registryDependencies: string[]; // Other Greater components this depends on
	tags: string[];
	version: string;
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

/**
 * Get component metadata by name
 */
export function getComponent(name: string): ComponentMetadata | null {
	return componentRegistry[name] ?? null;
}

/**
 * Get all components of a specific type
 */
export function getComponentsByType(type: ComponentMetadata['type']): ComponentMetadata[] {
	return Object.values(componentRegistry).filter((comp) => comp.type === type);
}

/**
 * Get all components with a specific tag
 */
export function getComponentsByTag(tag: string): ComponentMetadata[] {
	return Object.values(componentRegistry).filter((comp) => comp.tags.includes(tag));
}

/**
 * Search components by name or description
 */
export function searchComponents(query: string): ComponentMetadata[] {
	const lowerQuery = query.toLowerCase();
	return Object.values(componentRegistry).filter(
		(comp) =>
			comp.name.toLowerCase().includes(lowerQuery) ||
			comp.description.toLowerCase().includes(lowerQuery) ||
			comp.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
	);
}

/**
 * Get all component names
 */
export function getAllComponentNames(): string[] {
	return Object.keys(componentRegistry);
}

/**
 * Resolve component dependencies (including registry dependencies)
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
