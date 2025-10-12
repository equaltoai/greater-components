/**
 * GraphQL Adapter for Compose Components
 * 
 * Connects Compose components to Lesser GraphQL adapter with optimistic updates.
 * Provides high-level handlers for composing, editing, and managing posts.
 */

import type { LesserGraphQLAdapter, CreateStatusVariables } from '@greater/adapters';
import type { PostVisibility } from './context.js';
import type { MediaFile } from './MediaUploadHandler.js';

/**
 * Create compose handlers that use GraphQL adapter
 */
export function createGraphQLComposeHandlers(adapter: LesserGraphQLAdapter) {
	/**
	 * Handle post submission
	 */
	async function handleSubmit(data: {
		content: string;
		contentWarning?: string;
		visibility: PostVisibility;
		mediaAttachments?: MediaFile[];
		inReplyTo?: string;
		sensitive?: boolean;
		language?: string;
	}) {
		// Upload media attachments first if any
		const mediaIds: string[] = [];
		if (data.mediaAttachments && data.mediaAttachments.length > 0) {
			for (const media of data.mediaAttachments) {
				if (media.serverId) {
					mediaIds.push(media.serverId);
				}
			}
		}

		// Create status with GraphQL
		const variables: CreateStatusVariables = {
			status: data.content,
			spoilerText: data.contentWarning,
			visibility: data.visibility as any,
			sensitive: data.sensitive,
			language: data.language,
			mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
			inReplyToId: data.inReplyTo,
		};

		const result = await adapter.createStatus(variables);
		return result;
	}

	/**
	 * Handle media upload
	 */
	async function handleMediaUpload(
		file: File,
		onProgress: (progress: number) => void
	): Promise<{ id: string; url: string; thumbnailUrl?: string }> {
		// Simulate progress (in real app, GraphQL client would report actual progress)
		let progress = 0;
		const progressInterval = setInterval(() => {
			progress += 10;
			if (progress >= 90) {
				clearInterval(progressInterval);
			}
			onProgress(progress);
		}, 100);

		try {
			// Note: Actual GraphQL mutation would be called here
			// For now, this is a placeholder - you'd implement uploadMedia mutation
			// const result = await adapter.uploadMedia({ file, description, focus });
			
			// Simulated upload
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			clearInterval(progressInterval);
			onProgress(100);

			// Return mock data - replace with actual GraphQL response
			return {
				id: crypto.randomUUID(),
				url: URL.createObjectURL(file),
				thumbnailUrl: URL.createObjectURL(file),
			};
		} catch (error) {
			clearInterval(progressInterval);
			throw error;
		}
	}

	/**
	 * Handle media removal
	 */
	async function handleMediaRemove(id: string): Promise<void> {
		// Note: Implement media deletion if your API supports it
		// await adapter.deleteMedia(id);
		console.log('Media removed:', id);
	}

	/**
	 * Handle thread submission
	 */
	async function handleThreadSubmit(
		posts: Array<{
			content: string;
			contentWarning?: string;
			visibility: PostVisibility;
		}>
	) {
		const createdPosts = [];

		// Post each status in sequence, threading them together
		let previousStatusId: string | undefined;

		for (const post of posts) {
			const variables: CreateStatusVariables = {
				status: post.content,
				spoilerText: post.contentWarning,
				visibility: post.visibility as any,
				inReplyToId: previousStatusId,
			};

			const result = await adapter.createStatus(variables);
			createdPosts.push(result);
			previousStatusId = result.id;
		}

		return createdPosts;
	}

	/**
	 * Search for autocomplete suggestions
	 */
	async function handleAutocompleteSearch(
		query: string,
		type: 'hashtag' | 'mention' | 'emoji'
	) {
		if (type === 'mention') {
			// Search for accounts
			const results = await adapter.search({
				query,
				type: 'accounts',
				limit: 10,
			});

			return (
				results.accounts?.map((account) => ({
					type: 'mention' as const,
					text: `@${account.username}`,
					value: `@${account.acct}`,
					metadata: {
						username: account.username,
						displayName: account.displayName,
						avatar: account.avatar,
						followers: account.followersCount,
					},
				})) || []
			);
		}

		if (type === 'hashtag') {
			// Search for hashtags
			const results = await adapter.search({
				query,
				type: 'hashtags',
				limit: 10,
			});

			return (
				results.hashtags?.map((tag) => ({
					type: 'hashtag' as const,
					text: `#${tag.name}`,
					value: tag.name,
				})) || []
			);
		}

		// Emoji support would require a custom emoji endpoint
		return [];
	}

	return {
		handleSubmit,
		handleMediaUpload,
		handleMediaRemove,
		handleThreadSubmit,
		handleAutocompleteSearch,
	};
}

/**
 * Create optimistic status update
 * 
 * Returns a temporary status object that can be shown immediately
 * while the real one is being created on the server
 */
export function createOptimisticStatus(data: {
	content: string;
	contentWarning?: string;
	visibility: PostVisibility;
	account: {
		id: string;
		username: string;
		displayName: string;
		avatar: string;
	};
}) {
	return {
		id: `optimistic-${Date.now()}`,
		content: data.content,
		contentWarning: data.contentWarning,
		visibility: data.visibility,
		createdAt: new Date().toISOString(),
		account: data.account,
		repliesCount: 0,
		reblogsCount: 0,
		favouritesCount: 0,
		favourited: false,
		reblogged: false,
		bookmarked: false,
		_optimistic: true, // Flag to identify optimistic updates
	};
}

/**
 * Compose with optimistic updates
 * 
 * Wrapper that adds optimistic UI updates to compose handlers
 */
export function createOptimisticComposeHandlers(
	adapter: LesserGraphQLAdapter,
	currentAccount: {
		id: string;
		username: string;
		displayName: string;
		avatar: string;
	},
	onOptimisticUpdate?: (status: any) => void
) {
	const baseHandlers = createGraphQLComposeHandlers(adapter);

	return {
		...baseHandlers,

		/**
		 * Handle submit with optimistic update
		 */
		async handleSubmit(data: Parameters<typeof baseHandlers.handleSubmit>[0]) {
			// Create optimistic status
			const optimisticStatus = createOptimisticStatus({
				content: data.content,
				contentWarning: data.contentWarning,
				visibility: data.visibility,
				account: currentAccount,
			});

			// Show optimistic update immediately
			if (onOptimisticUpdate) {
				onOptimisticUpdate(optimisticStatus);
			}

			// Perform actual submission
			try {
				const result = await baseHandlers.handleSubmit(data);
				
				// Replace optimistic with real status
				if (onOptimisticUpdate) {
					onOptimisticUpdate({ ...result, _replaces: optimisticStatus.id });
				}

				return result;
			} catch (error) {
				// Remove optimistic update on error
				if (onOptimisticUpdate) {
					onOptimisticUpdate({ _remove: optimisticStatus.id });
				}
				throw error;
			}
		},

		/**
		 * Handle thread submit with optimistic updates
		 */
		async handleThreadSubmit(
			posts: Parameters<typeof baseHandlers.handleThreadSubmit>[0]
		) {
			// Create optimistic statuses for all posts
			const optimisticStatuses = posts.map((post, index) => ({
				...createOptimisticStatus({
					content: post.content,
					contentWarning: post.contentWarning,
					visibility: post.visibility,
					account: currentAccount,
				}),
				id: `optimistic-thread-${Date.now()}-${index}`,
			}));

			// Show optimistic updates
			if (onOptimisticUpdate) {
				optimisticStatuses.forEach((status) => onOptimisticUpdate(status));
			}

			// Perform actual submission
			try {
				const results = await baseHandlers.handleThreadSubmit(posts);

				// Replace optimistic with real statuses
				if (onOptimisticUpdate) {
					results.forEach((result, index) => {
						onOptimisticUpdate({
							...result,
							_replaces: optimisticStatuses[index].id,
						});
					});
				}

				return results;
			} catch (error) {
				// Remove optimistic updates on error
				if (onOptimisticUpdate) {
					optimisticStatuses.forEach((status) => {
						onOptimisticUpdate({ _remove: status.id });
					});
				}
				throw error;
			}
		},
	};
}

/**
 * Create compose handlers from config
 * 
 * Convenience function to create handlers with sensible defaults
 */
export interface ComposeGraphQLConfig {
	/**
	 * GraphQL adapter instance
	 */
	adapter: LesserGraphQLAdapter;

	/**
	 * Current user account
	 */
	currentAccount?: {
		id: string;
		username: string;
		displayName: string;
		avatar: string;
	};

	/**
	 * Enable optimistic updates
	 */
	enableOptimistic?: boolean;

	/**
	 * Callback for optimistic updates
	 */
	onOptimisticUpdate?: (status: any) => void;
}

export function createComposeHandlers(config: ComposeGraphQLConfig) {
	const { adapter, currentAccount, enableOptimistic = true, onOptimisticUpdate } = config;

	if (enableOptimistic && currentAccount) {
		return createOptimisticComposeHandlers(adapter, currentAccount, onOptimisticUpdate);
	}

	return createGraphQLComposeHandlers(adapter);
}

