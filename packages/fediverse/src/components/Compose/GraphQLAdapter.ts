/**
 * GraphQL Adapter for Compose Components
 *
 * Connects Compose components to Lesser GraphQL adapter with optimistic updates.
 * Provides high-level handlers for composing, editing, and managing posts.
 */

import type {
	LesserGraphQLAdapter,
	CreateNoteVariables,
	Visibility,
	ObjectFieldsFragment,
	Actor,
} from '@greater/adapters';
import type { PostVisibility } from './context.js';
import type { MediaFile } from './MediaUploadHandler.js';

type OptimisticObject = ObjectFieldsFragment & { _optimistic: true };

type ActorLike = Pick<Actor, 'id' | 'username' | 'displayName' | 'avatar' | 'domain'>;

function mapVisibility(visibility: PostVisibility): Visibility {
	switch (visibility) {
		case 'public':
			return 'PUBLIC';
		case 'unlisted':
			return 'UNLISTED';
		case 'private':
			return 'FOLLOWERS';
		case 'direct':
		default:
			return 'DIRECT';
	}
}

function formatHandle(username: string, domain?: string | null) {
	return domain ? `@${username}@${domain}` : `@${username}`;
}

function toOptimisticActor(account: ActorLike): Actor {
	const now = new Date().toISOString();
	return {
		__typename: 'Actor',
		id: account.id,
		username: account.username,
		domain: account.domain ?? null,
		displayName: account.displayName ?? account.username,
		summary: null,
		avatar: account.avatar ?? null,
		header: null,
		followers: 0,
		following: 0,
		statusesCount: 0,
		bot: false,
		locked: false,
		createdAt: now,
		updatedAt: now,
		trustScore: 0,
		fields: [],
		vouches: [],
		reputation: null,
	};
}

function createOptimisticObject(data: {
	content: string;
	contentWarning?: string;
	visibility: PostVisibility;
	sensitive?: boolean;
	account: ActorLike;
}): OptimisticObject {
	const now = new Date().toISOString();

	return {
		__typename: 'Object',
		id: `optimistic-${Date.now()}`,
		type: 'NOTE',
		content: data.content,
		contentMap: [],
		visibility: mapVisibility(data.visibility),
		sensitive: data.sensitive ?? false,
		spoilerText: data.contentWarning ?? null,
		attachments: [],
		tags: [],
		mentions: [],
		createdAt: now,
		updatedAt: now,
		repliesCount: 0,
		likesCount: 0,
		sharesCount: 0,
		estimatedCost: 0,
		moderationScore: null,
		quoteUrl: null,
		quoteable: true,
		quotePermissions: 'EVERYONE',
		quoteContext: null,
		quoteCount: 0,
		communityNotes: [],
		actor: toOptimisticActor(data.account),
		inReplyTo: null,
		_optimistic: true,
	};
}

function buildCreateNoteVariables(
	data: {
		content: string;
		contentWarning?: string;
		visibility: PostVisibility;
		mediaIds?: string[];
		inReplyTo?: string;
		sensitive?: boolean;
		language?: string;
	}
): CreateNoteVariables {
	return {
		input: {
			content: data.content,
			visibility: mapVisibility(data.visibility),
			sensitive: data.sensitive ?? false,
			spoilerText: data.contentWarning,
			attachmentIds: data.mediaIds && data.mediaIds.length > 0 ? data.mediaIds : undefined,
			inReplyToId: data.inReplyTo,
			language: data.language,
		},
	};
}

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
		const mediaIds: string[] = [];
		if (data.mediaAttachments && data.mediaAttachments.length > 0) {
			for (const media of data.mediaAttachments) {
				if (media.serverId) {
					mediaIds.push(media.serverId);
				}
			}
		}

		const variables = buildCreateNoteVariables({
			content: data.content,
			contentWarning: data.contentWarning,
			visibility: data.visibility,
			mediaIds,
			inReplyTo: data.inReplyTo,
			sensitive: data.sensitive,
			language: data.language,
		});

		const payload = await adapter.createNote(variables);
		return payload.object;
	}

	/**
	 * Handle media upload
	 */
	async function handleMediaUpload(
		file: File,
		onProgress: (progress: number) => void
	): Promise<{ id: string; url: string; thumbnailUrl?: string }> {
		let progress = 0;
		const progressInterval = setInterval(() => {
			progress += 10;
			if (progress >= 90) {
				clearInterval(progressInterval);
			}
			onProgress(progress);
		}, 100);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			clearInterval(progressInterval);
			onProgress(100);

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
		const createdPosts: ObjectFieldsFragment[] = [];
		let previousStatusId: string | undefined;

		for (const post of posts) {
			const variables = buildCreateNoteVariables({
				content: post.content,
				contentWarning: post.contentWarning,
				visibility: post.visibility,
				inReplyTo: previousStatusId,
			});

			const payload = await adapter.createNote(variables);
			createdPosts.push(payload.object);
			previousStatusId = payload.object.id;
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
			const results = await adapter.search({
				query,
				type: 'accounts',
				first: 10,
			});

			return (
				results.accounts?.map((account) => ({
					type: 'mention' as const,
					text: formatHandle(account.username, account.domain ?? null),
					value: formatHandle(account.username, account.domain ?? null),
					metadata: {
						username: account.username,
						displayName: account.displayName ?? account.username,
						avatar: account.avatar ?? '',
						followers: account.followers,
					},
				})) || []
			);
		}

		if (type === 'hashtag') {
			const results = await adapter.search({
				query,
				type: 'hashtags',
				first: 10,
			});

			return (
				results.hashtags?.map((tag) => ({
					type: 'hashtag' as const,
					text: `#${tag.name}`,
					value: tag.name,
				})) || []
			);
		}

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
	sensitive?: boolean;
	account: ActorLike;
}) {
	return createOptimisticObject(data);
}

/**
 * Compose with optimistic updates
 *
 * Wrapper that adds optimistic UI updates to compose handlers
 */
export function createOptimisticComposeHandlers(
	adapter: LesserGraphQLAdapter,
	currentAccount: ActorLike,
	onOptimisticUpdate?: (status: any) => void
) {
	const baseHandlers = createGraphQLComposeHandlers(adapter);

	return {
		...baseHandlers,

		/**
		 * Handle submit with optimistic update
		 */
		async handleSubmit(data: Parameters<typeof baseHandlers.handleSubmit>[0]) {
			const optimisticStatus = createOptimisticObject({
				content: data.content,
				contentWarning: data.contentWarning,
				visibility: data.visibility,
				sensitive: data.sensitive,
				account: currentAccount,
			});

			if (onOptimisticUpdate) {
				onOptimisticUpdate(optimisticStatus);
			}

			try {
				const result = await baseHandlers.handleSubmit(data);

				if (onOptimisticUpdate) {
					onOptimisticUpdate({ ...result, _replaces: optimisticStatus.id });
				}

				return result;
			} catch (error) {
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
			const optimisticStatuses = posts.map((post, index) => ({
				...createOptimisticObject({
					content: post.content,
					contentWarning: post.contentWarning,
					visibility: post.visibility,
					account: currentAccount,
				}),
				id: `optimistic-thread-${Date.now()}-${index}`,
			}));

			if (onOptimisticUpdate) {
				optimisticStatuses.forEach((status) => onOptimisticUpdate(status));
			}

			try {
				const results = await baseHandlers.handleThreadSubmit(posts);

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
	adapter: LesserGraphQLAdapter;
	currentAccount?: ActorLike;
	enableOptimistic?: boolean;
	onOptimisticUpdate?: (status: any) => void;
}

export function createComposeHandlers(config: ComposeGraphQLConfig) {
	const { adapter, currentAccount, enableOptimistic = true, onOptimisticUpdate } = config;

	if (enableOptimistic && currentAccount) {
		return createOptimisticComposeHandlers(adapter, currentAccount, onOptimisticUpdate);
	}

	return createGraphQLComposeHandlers(adapter);
}
