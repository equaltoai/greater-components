/**
 * Shared Module Registry
 * Defines metadata for reusable shared modules that can be included in multiple faces
 */

import type { ComponentMetadata, ComponentDomain } from './index.js';

/**
 * Shared module metadata with additional configuration
 */
export interface SharedModuleMetadata extends Omit<ComponentMetadata, 'type'> {
	type: 'shared';
	/** Package name for the shared module */
	packageName: string;
	/** Export path from the package */
	exportPath: string;
	/** Components exported by this module */
	exports: string[];
}

/**
 * Shared Module Registry
 */
export const sharedModuleRegistry: Record<string, SharedModuleMetadata> = {
	// ====================
	// AUTH MODULE
	// ====================
	auth: {
		name: 'auth',
		type: 'shared',
		description: 'Complete authentication system with WebAuthn, 2FA, OAuth, and wallet support',
		packageName: '@equaltoai/greater-components',
		exportPath: '@equaltoai/greater-components/shared/auth',
		exports: [
			'Root',
			'LoginForm',
			'RegisterForm',
			'WebAuthnSetup',
			'OAuthConsent',
			'InstanceSelector',
			'TwoFactorSetup',
			'TwoFactorVerify',
			'PasswordReset',
			'BackupCodes',
			'WalletConnect',
			'SignInCard',
			'UserButton',
		],
			files: [
				{ path: 'shared/auth/Root.svelte', content: '', type: 'component' },
				{ path: 'shared/auth/LoginForm.svelte', content: '', type: 'component' },
				{ path: 'shared/auth/RegisterForm.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/WebAuthnSetup.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/OAuthConsent.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/InstanceSelector.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/TwoFactorSetup.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/TwoFactorVerify.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/PasswordReset.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/BackupCodes.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/WalletConnect.svelte', content: '', type: 'component' },
			{ path: 'shared/auth/SignInCard.svelte', content: '', type: 'component' },
				{ path: 'shared/auth/UserButton.svelte', content: '', type: 'component' },
				{ path: 'shared/auth/index.ts', content: '', type: 'component' },
				{ path: 'shared/auth/context.ts', content: '', type: 'types' },
				{ path: 'shared/auth/types.ts', content: '', type: 'types' },
			],
				dependencies: [{ name: 'svelte', version: '^5.0.0' }],
				devDependencies: [],
				registryDependencies: ['button', 'modal'],
				tags: ['auth', 'authentication', 'webauthn', '2fa', 'oauth', 'wallet', 'shared'],
				version: '1.0.0',
				domain: 'auth',
			},

	// ====================
	// COMPOSE MODULE
	// ====================
	compose: {
		name: 'compose',
		type: 'shared',
		description:
			'Post composition with character counting, visibility controls, media attachments, and autocomplete',
		packageName: '@equaltoai/greater-components',
		exportPath: '@equaltoai/greater-components/shared/compose',
			exports: [
				'Root',
				'Editor',
				'Submit',
				'CharacterCount',
				'VisibilitySelect',
				'EditorWithAutocomplete',
				'AutocompleteMenu',
				'DraftSaver',
				'ThreadControls',
				'ThreadComposer',
				'MediaUpload',
				'ImageEditor',
			],
			files: [
			{ path: 'shared/compose/Root.svelte', content: '', type: 'component' },
			{ path: 'shared/compose/Editor.svelte', content: '', type: 'component' },
			{ path: 'shared/compose/Submit.svelte', content: '', type: 'component' },
			{ path: 'shared/compose/CharacterCount.svelte', content: '', type: 'component' },
			{ path: 'shared/compose/VisibilitySelect.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/EditorWithAutocomplete.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/AutocompleteMenu.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/DraftSaver.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/ThreadControls.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/ThreadComposer.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/MediaUpload.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/ImageEditor.svelte', content: '', type: 'component' },
				{ path: 'shared/compose/index.ts', content: '', type: 'component' },
				{ path: 'shared/compose/context.ts', content: '', type: 'types' },
				{ path: 'shared/compose/types.ts', content: '', type: 'types' },
				{ path: 'shared/compose/Autocomplete.ts', content: '', type: 'utils' },
				{ path: 'shared/compose/DraftManager.ts', content: '', type: 'utils' },
				{ path: 'shared/compose/UnicodeCounter.ts', content: '', type: 'utils' },
				{ path: 'shared/compose/MediaUploadHandler.ts', content: '', type: 'utils' },
				{ path: 'shared/compose/GraphQLAdapter.ts', content: '', type: 'utils' },
			],
				dependencies: [{ name: 'svelte', version: '^5.0.0' }],
				devDependencies: [],
				registryDependencies: ['button'],
				tags: ['compose', 'post', 'editor', 'media', 'shared'],
				version: '1.0.0',
				domain: 'social',
			},

	// ====================
	// NOTIFICATIONS MODULE
	// ====================
	notifications: {
		name: 'notifications',
		type: 'shared',
		description: 'Notification feed with grouping, filtering, and real-time updates',
		packageName: '@equaltoai/greater-components',
		exportPath: '@equaltoai/greater-components/shared/notifications',
		exports: [
			'Root',
			'Item',
			'Group',
			'Filter',
			'LesserNotificationItem',
			'NotificationFilters',
			'PushNotificationSettings',
		],
			files: [
				{ path: 'shared/notifications/Root.svelte', content: '', type: 'component' },
				{ path: 'shared/notifications/Item.svelte', content: '', type: 'component' },
				{ path: 'shared/notifications/Group.svelte', content: '', type: 'component' },
				{ path: 'shared/notifications/Filter.svelte', content: '', type: 'component' },
			{
				path: 'shared/notifications/LesserNotificationItem.svelte',
				content: '',
				type: 'component',
			},
			{ path: 'shared/notifications/NotificationFilters.svelte', content: '', type: 'component' },
			{
				path: 'shared/notifications/PushNotificationSettings.svelte',
				content: '',
				type: 'component',
			},
				{ path: 'shared/notifications/context.svelte.ts', content: '', type: 'types' },
				{ path: 'shared/notifications/types.ts', content: '', type: 'types' },
				{ path: 'shared/notifications/mockData.ts', content: '', type: 'utils' },
				{ path: 'shared/notifications/index.ts', content: '', type: 'component' },
				{
					path: 'shared/notifications/utils/notificationGrouping.ts',
					content: '',
					type: 'utils',
				},
		],
		dependencies: [{ name: 'svelte', version: '^5.0.0' }],
		devDependencies: [],
		registryDependencies: [],
		tags: ['notifications', 'feed', 'realtime', 'shared'],
		version: '1.0.0',
		domain: 'social',
	},

	// ====================
	// SEARCH MODULE
	// ====================
	search: {
		name: 'search',
		type: 'shared',
		description: 'Search with filters, AI semantic search, and result rendering',
		packageName: '@equaltoai/greater-components',
		exportPath: '@equaltoai/greater-components/shared/search',
		exports: [
			'Root',
			'Bar',
			'Filters',
			'Results',
			'ActorResult',
			'NoteResult',
			'TagResult',
			'FederatedSearch',
		],
			files: [
				{ path: 'shared/search/Root.svelte', content: '', type: 'component' },
				{ path: 'shared/search/Bar.svelte', content: '', type: 'component' },
				{ path: 'shared/search/Filters.svelte', content: '', type: 'component' },
			{ path: 'shared/search/Results.svelte', content: '', type: 'component' },
			{ path: 'shared/search/ActorResult.svelte', content: '', type: 'component' },
			{ path: 'shared/search/NoteResult.svelte', content: '', type: 'component' },
				{ path: 'shared/search/TagResult.svelte', content: '', type: 'component' },
				{ path: 'shared/search/FederatedSearch.svelte', content: '', type: 'component' },
				{ path: 'shared/search/index.ts', content: '', type: 'component' },
				{ path: 'shared/search/context.svelte.ts', content: '', type: 'types' },
			],
			dependencies: [{ name: 'svelte', version: '^5.0.0' }],
			devDependencies: [],
			registryDependencies: ['button'],
			tags: ['search', 'filter', 'ai', 'semantic', 'shared'],
			version: '1.0.0',
			domain: 'core',
		},

	// ====================
	// CHAT MODULE
	// ====================
	chat: {
		name: 'chat',
		type: 'shared',
		description: 'AI chat interface with streaming responses, tool calls, and settings',
		packageName: '@equaltoai/greater-components',
		exportPath: '@equaltoai/greater-components/chat',
		exports: [
			'Container',
			'Messages',
			'Message',
			'Input',
			'Header',
			'ToolCallDisplay',
			'Suggestions',
			'Settings',
			'MessageAction',
			'ThreadView',
		],
			files: [
				{ path: 'shared/chat/ChatContainer.svelte', content: '', type: 'component' },
				{ path: 'shared/chat/ChatMessages.svelte', content: '', type: 'component' },
				{ path: 'shared/chat/ChatMessage.svelte', content: '', type: 'component' },
			{ path: 'shared/chat/ChatInput.svelte', content: '', type: 'component' },
			{ path: 'shared/chat/ChatHeader.svelte', content: '', type: 'component' },
			{ path: 'shared/chat/ChatToolCall.svelte', content: '', type: 'component' },
			{ path: 'shared/chat/ChatSuggestions.svelte', content: '', type: 'component' },
			{ path: 'shared/chat/ChatSettings.svelte', content: '', type: 'component' },
				{ path: 'shared/chat/ChatMessageAction.svelte', content: '', type: 'component' },
				{ path: 'shared/chat/ChatThreadView.svelte', content: '', type: 'component' },
				{ path: 'shared/chat/index.ts', content: '', type: 'component' },
				{ path: 'shared/chat/context.svelte.ts', content: '', type: 'types' },
				{ path: 'shared/chat/types.ts', content: '', type: 'types' },
			],
			dependencies: [{ name: 'svelte', version: '^5.0.0' }],
			devDependencies: [],
			registryDependencies: [],
			tags: ['chat', 'ai', 'streaming', 'tool-calls', 'shared'],
			version: '1.0.0',
			domain: 'chat',
		},

	// ====================
	// ADMIN MODULE
	// ====================
	admin: {
		name: 'admin',
		type: 'shared',
		description:
			'Admin dashboard with user management, reports, moderation, federation, and analytics',
		packageName: '@equaltoai/greater-components',
		exportPath: '@equaltoai/greater-components/shared/admin',
		exports: [
			'Root',
			'Overview',
			'Users',
			'Reports',
			'Moderation',
			'Federation',
			'Settings',
			'Logs',
			'Analytics',
			'Cost',
			'Insights',
			'TrustGraph',
			'SeveredRelationships',
		],
			files: [
				{ path: 'shared/admin/Root.svelte', content: '', type: 'component' },
				{ path: 'shared/admin/Overview.svelte', content: '', type: 'component' },
				{ path: 'shared/admin/Users.svelte', content: '', type: 'component' },
				{ path: 'shared/admin/Reports.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Moderation.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Federation.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Settings.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Logs.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Analytics.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Cost/Root.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Cost/Dashboard.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Cost/Alerts.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Cost/BudgetControls.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Insights/Root.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Insights/AIAnalysis.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/Insights/ModerationAnalytics.svelte', content: '', type: 'component' },
			{ path: 'shared/admin/TrustGraph/Root.svelte', content: '', type: 'component' },
				{ path: 'shared/admin/TrustGraph/Visualization.svelte', content: '', type: 'component' },
				{ path: 'shared/admin/TrustGraph/RelationshipList.svelte', content: '', type: 'component' },
				{ path: 'shared/admin/SeveredRelationships/Root.svelte', content: '', type: 'component' },
				{ path: 'shared/admin/SeveredRelationships/List.svelte', content: '', type: 'component' },
			{
				path: 'shared/admin/SeveredRelationships/RecoveryPanel.svelte',
					content: '',
					type: 'component',
				},
				{ path: 'shared/admin/index.ts', content: '', type: 'component' },
				{ path: 'shared/admin/Cost/index.ts', content: '', type: 'component' },
				{ path: 'shared/admin/Cost/context.ts', content: '', type: 'types' },
				{ path: 'shared/admin/Insights/index.ts', content: '', type: 'component' },
				{ path: 'shared/admin/Insights/context.ts', content: '', type: 'types' },
				{ path: 'shared/admin/TrustGraph/index.ts', content: '', type: 'component' },
				{ path: 'shared/admin/TrustGraph/context.ts', content: '', type: 'types' },
				{ path: 'shared/admin/SeveredRelationships/index.ts', content: '', type: 'component' },
				{ path: 'shared/admin/SeveredRelationships/context.ts', content: '', type: 'types' },
				{ path: 'shared/admin/context.svelte.ts', content: '', type: 'types' },
			],
				dependencies: [{ name: 'svelte', version: '^5.0.0' }],
				devDependencies: [],
				registryDependencies: ['button', 'modal'],
				tags: ['admin', 'dashboard', 'moderation', 'analytics', 'shared'],
				version: '1.0.0',
				domain: 'admin',
			},

	// ====================
	// MESSAGING MODULE
	// ====================
	messaging: {
		name: 'messaging',
		type: 'shared',
		description: 'Direct messaging with threaded conversations and real-time updates',
		packageName: '@equaltoai/greater-components',
		exportPath: '@equaltoai/greater-components/shared/messaging',
		exports: [
			'Root',
			'Conversations',
			'Thread',
			'Composer',
			'Message',
			'NewConversation',
			'MediaUpload',
			'UnreadIndicator',
			'ConversationPicker',
		],
			files: [
				{ path: 'shared/messaging/Root.svelte', content: '', type: 'component' },
				{ path: 'shared/messaging/Conversations.svelte', content: '', type: 'component' },
				{ path: 'shared/messaging/Thread.svelte', content: '', type: 'component' },
			{ path: 'shared/messaging/Composer.svelte', content: '', type: 'component' },
			{ path: 'shared/messaging/Message.svelte', content: '', type: 'component' },
			{ path: 'shared/messaging/NewConversation.svelte', content: '', type: 'component' },
			{ path: 'shared/messaging/MediaUpload.svelte', content: '', type: 'component' },
				{ path: 'shared/messaging/UnreadIndicator.svelte', content: '', type: 'component' },
				{ path: 'shared/messaging/ConversationPicker.svelte', content: '', type: 'component' },
				{ path: 'shared/messaging/index.ts', content: '', type: 'component' },
				{ path: 'shared/messaging/context.svelte.ts', content: '', type: 'types' },
				{ path: 'shared/messaging/types.ts', content: '', type: 'types' },
				{ path: 'shared/messaging/utils.ts', content: '', type: 'utils' },
			],
				dependencies: [{ name: 'svelte', version: '^5.0.0' }],
				devDependencies: [],
				registryDependencies: ['button', 'modal'],
				tags: ['messaging', 'dm', 'chat', 'realtime', 'shared'],
				version: '1.0.0',
				domain: 'social',
			},
};

/**
 * Get shared module metadata by name
 */
export function getSharedModule(name: string): SharedModuleMetadata | null {
	return sharedModuleRegistry[name] ?? null;
}

/**
 * Get all shared module names
 */
export function getAllSharedModuleNames(): string[] {
	return Object.keys(sharedModuleRegistry);
}

/**
 * Get shared modules by domain
 */
export function getSharedModulesByDomain(domain: ComponentDomain): SharedModuleMetadata[] {
	return Object.values(sharedModuleRegistry).filter((mod) => mod.domain === domain);
}
