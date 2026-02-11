/**
 * GraphQL Adapter for Compose Components
 *
 * Connects Compose components to Lesser GraphQL adapter with optimistic updates.
 * Provides high-level handlers for composing, editing, and managing posts.
 */

import type {
	LesserGraphQLAdapter,
	CreateNoteVariables,
	CreateQuoteNoteMutationVariables,
	Visibility,
	ObjectFieldsFragment,
	Actor,
	QuoteType,
	UploadMediaInput,
	MediaCategory,
} from '@equaltoai/greater-components-adapters';
import type { PostVisibility } from './context.js';
import type { MediaFile } from './MediaUploadHandler.js';
import type { AutocompleteSuggestion } from './Autocomplete.js';

type OptimisticObject = ObjectFieldsFragment & { _optimistic: true };
type OptimisticReplacement = ObjectFieldsFragment & { _replaces: string };
type OptimisticRemoval = { _remove: string };
type OptimisticUpdateEvent = OptimisticObject | OptimisticReplacement | OptimisticRemoval;

type ActorLike = Pick<Actor, 'id' | 'username' | 'displayName' | 'avatar' | 'domain'>;

export interface ComposeSubmitInput {
	content: string;
	contentWarning?: string;
	visibility: PostVisibility;
	mediaAttachments?: MediaFile[];
	inReplyTo?: string;
	sensitive?: boolean;
	quoteUrl?: string;
	quoteType?: 'FULL' | 'PARTIAL' | 'COMMENTARY' | 'REACTION';
}

export interface ComposeThreadPost {
	content: string;
	contentWarning?: string;
	visibility: PostVisibility;
}

export interface MediaUploadResult {
	id: string;
	url: string;
	thumbnailUrl?: string;
	sensitive: boolean;
	spoilerText?: string | null;
	mediaCategory?: MediaCategory;
}

export interface GraphQLComposeHandlers {
	handleSubmit(data: ComposeSubmitInput): Promise<ObjectFieldsFragment>;
	handleMediaUpload(
		file: File,
		onProgress: (progress: number) => void,
		media: MediaFile
	): Promise<MediaUploadResult>;
	handleMediaRemove(id: string): Promise<void>;
	handleThreadSubmit(posts: ComposeThreadPost[]): Promise<ObjectFieldsFragment[]>;
	handleAutocompleteSearch(
		query: string,
		type: 'hashtag' | 'mention' | 'emoji'
	): Promise<AutocompleteSuggestion[]>;
}

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
		isAgent: false,
		agentInfo: null,
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
	const id = `optimistic-${Date.now()}`;

	return {
		__typename: 'Object',
		id,
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
		boosted: false,
		relationshipType: 'ORIGINAL',
		contentHash: id,
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

function buildCreateNoteVariables(data: {
	content: string;
	contentWarning?: string;
	visibility: PostVisibility;
	mediaIds?: string[];
	inReplyTo?: string;
	sensitive?: boolean;
}): CreateNoteVariables['input'] {
	return {
		content: data.content,
		visibility: mapVisibility(data.visibility),
		sensitive: data.sensitive ?? false,
		spoilerText: data.contentWarning,
		attachmentIds: data.mediaIds && data.mediaIds.length > 0 ? data.mediaIds : undefined,
		inReplyToId: data.inReplyTo,
	};
}

/**
 * Create compose handlers that use GraphQL adapter
 */
export function createGraphQLComposeHandlers(
	adapter: LesserGraphQLAdapter
): GraphQLComposeHandlers {
	/**
	 * Handle post submission
	 */
	async function handleSubmit(data: ComposeSubmitInput) {
		// If quoteUrl is present, delegate to quote handler
		if (data.quoteUrl) {
			return handleQuoteSubmit(data as Parameters<typeof handleQuoteSubmit>[0]);
		}

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
		});

		const payload = await adapter.createNote(variables);
		return payload.object;
	}

	/**
	 * Handle quote post submission (Lesser-specific)
	 */
	async function handleQuoteSubmit(data: {
		content: string;
		quoteUrl: string;
		contentWarning?: string;
		visibility: PostVisibility;
		mediaAttachments?: MediaFile[];
		sensitive?: boolean;
		quoteType?: 'FULL' | 'PARTIAL' | 'COMMENTARY' | 'REACTION';
	}) {
		const mediaIds: string[] = [];
		if (data.mediaAttachments && data.mediaAttachments.length > 0) {
			for (const media of data.mediaAttachments) {
				if (media.serverId) {
					mediaIds.push(media.serverId);
				}
			}
		}

		const input: CreateQuoteNoteMutationVariables['input'] = {
			content: data.content,
			quoteUrl: data.quoteUrl,
			visibility: mapVisibility(data.visibility),
			spoilerText: data.contentWarning || undefined,
			sensitive: data.sensitive,
			quoteType: data.quoteType as QuoteType | undefined,
			mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
		};

		const payload = await adapter.createQuoteNote(input);
		return payload.object;
	}

	/**
	 * Handle media upload
	 */
	async function handleMediaUpload(
		file: File,
		onProgress: (progress: number) => void,
		media: MediaFile
	): Promise<MediaUploadResult> {
		let progress = 0;
		const progressInterval = setInterval(() => {
			progress = Math.min(progress + 8, 90);
			onProgress(progress);
		}, 120);

		const uploadInput: UploadMediaInput = {
			file,
			filename: media.file.name,
			description: media.description?.trim() ? media.description.trim() : undefined,
			focus: media.focalPoint
				? {
						x: media.focalPoint.x,
						y: media.focalPoint.y,
					}
				: undefined,
			sensitive: media.sensitive,
			spoilerText: media.spoilerText.trim() === '' ? null : media.spoilerText.trim(),
			mediaType: media.mediaCategory,
		};

		try {
			const payload = await adapter.uploadMedia(uploadInput);
			clearInterval(progressInterval);
			onProgress(100);

			if (payload.warnings && payload.warnings.length > 0) {
				console.warn('[Compose] Media upload warnings', payload.warnings);
			}

			return {
				id: payload.media.id,
				url: payload.media.url,
				thumbnailUrl: payload.media.previewUrl ?? undefined,
				sensitive: payload.media.sensitive ?? media.sensitive ?? false,
				spoilerText: payload.media.spoilerText ?? media.spoilerText ?? null,
				mediaCategory: payload.media.mediaCategory ?? media.mediaCategory,
			};
		} catch (error) {
			clearInterval(progressInterval);
			throw error;
		}
	}

	/**
	 * Handle media removal
	 */
	async function handleMediaRemove(_id: string): Promise<void> {
		// Media cleanup can be implemented when server-side deletion is required.
	}

	/**
	 * Handle thread submission
	 */
	async function handleThreadSubmit(posts: ComposeThreadPost[]) {
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
	async function handleAutocompleteSearch(query: string, type: 'hashtag' | 'mention' | 'emoji') {
		if (type === 'mention') {
			const results = await adapter.search({
				query,
				type: 'accounts',
				first: 10,
			});

			const suggestions: AutocompleteSuggestion[] = [];

			for (const account of results.accounts ?? []) {
				if (!account) {
					continue;
				}

				const handle = formatHandle(account.username, account.domain ?? null);

				suggestions.push({
					type: 'mention',
					text: handle,
					value: handle,
					metadata: {
						username: account.username,
						displayName: account.displayName ?? account.username,
						avatar: account.avatar ?? '',
						followers: account.followers,
					},
				});
			}

			return suggestions;
		}

		if (type === 'hashtag') {
			const results = await adapter.search({
				query,
				type: 'hashtags',
				first: 10,
			});

			const suggestions: AutocompleteSuggestion[] = [];

			for (const tag of results.hashtags ?? []) {
				if (!tag) {
					continue;
				}

				suggestions.push({
					type: 'hashtag',
					text: `#${tag.name}`,
					value: tag.name,
				});
			}

			return suggestions;
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
	onOptimisticUpdate?: (status: OptimisticUpdateEvent) => void
): GraphQLComposeHandlers {
	const baseHandlers = createGraphQLComposeHandlers(adapter);

	return {
		...baseHandlers,

		/**
		 * Handle submit with optimistic update
		 */
		async handleSubmit(data: ComposeSubmitInput) {
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
		async handleThreadSubmit(posts: ComposeThreadPost[]) {
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
						const optimisticStatus = optimisticStatuses[index];
						if (!optimisticStatus) {
							return;
						}
						onOptimisticUpdate({
							...result,
							_replaces: optimisticStatus.id,
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
	onOptimisticUpdate?: (status: OptimisticUpdateEvent) => void;
}

export function createComposeHandlers(config: ComposeGraphQLConfig): GraphQLComposeHandlers {
	const { adapter, currentAccount, enableOptimistic = true, onOptimisticUpdate } = config;

	if (enableOptimistic && currentAccount) {
		return createOptimisticComposeHandlers(adapter, currentAccount, onOptimisticUpdate);
	}

	return createGraphQLComposeHandlers(adapter);
}
