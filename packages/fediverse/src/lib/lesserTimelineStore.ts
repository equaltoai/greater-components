/**
 * Lesser Timeline Integration
 *
 * Provides timeline functionality using the shared Lesser GraphQL adapter and
 * unified models, exposing data as `GenericTimelineItem`s compatible with the
 * rest of the Fediverse component suite.
 */

import {
	mapLesserTimelineConnection,
	unifiedStatusToTimelineItem,
	convertGraphQLObjectToLesser,
	mapLesserObject,
} from '@equaltoai/greater-components-adapters';
import type {
	LesserGraphQLAdapter,
	LesserTimelineConnection,
	TimelineVariables,
	UnifiedStatus,
} from '@equaltoai/greater-components-adapters';
import type {
	ActivityPubActor,
	ActivityPubImage,
	ActivityPubObject,
	ActivityPubTag,
	GenericStatus,
	GenericTimelineItem,
} from '../generics/index.js';

export interface LesserTimelineConfig {
	/** Maximum number of items to keep in memory */
	maxItems?: number;
	/** Number of items to load initially */
	preloadCount?: number;
	/** Timeline type */
	type?: 'HOME' | 'PUBLIC' | 'LOCAL' | 'HASHTAG' | 'LIST' | 'DIRECT';
	/** Enable real-time updates */
	enableRealtime?: boolean;
	/** GraphQL adapter instance */
	adapter: LesserGraphQLAdapter;

	// Hashtag timeline configuration
	/** Hashtag to follow (for HASHTAG timeline) */
	hashtag?: string;
	/** Multiple hashtags to follow (only the first is used by Lesser today) */
	hashtags?: string[];
	/** Hashtag filtering mode: 'ANY' or 'ALL' */
	hashtagMode?: 'ANY' | 'ALL';

	// List timeline configuration
	/** List ID (for LIST timeline) */
	listId?: string;
	/** List filter settings */
	listFilter?: {
		/** Include replies to list members */
		includeReplies?: boolean;
		/** Include boosts from list members */
		includeBoosts?: boolean;
	};
}

export interface LesserTimelineState {
	items: GenericTimelineItem[];
	loading: boolean;
	loadingMore: boolean;
	hasMore: boolean;
	error: string | null;
	lastUpdated: Date | null;
	connected: boolean;
}

type TimelineTypeValue = Exclude<LesserTimelineConfig['type'], undefined>;

type NormalizedTimelineConfig = Omit<
	LesserTimelineConfig,
	'maxItems' | 'preloadCount' | 'type' | 'enableRealtime'
> & {
	maxItems: number;
	preloadCount: number;
	type: TimelineTypeValue;
	enableRealtime: boolean;
};

export class LesserTimelineStore {
	private state = $state<LesserTimelineState>({
		items: [],
		loading: false,
		loadingMore: false,
		hasMore: true,
		error: null,
		lastUpdated: null,
		connected: false,
	});

	private readonly config: NormalizedTimelineConfig;
	private cursor: string | null = null;
	private abortController: AbortController | null = null;
	private readonly statusCache = new Map<string, GenericStatus>();

	constructor(config: LesserTimelineConfig) {
		const {
			adapter,
			maxItems = 1000,
			preloadCount = 20,
			type = 'PUBLIC',
			enableRealtime = true,
			...optional
		} = config;

		this.config = {
			adapter,
			maxItems,
			preloadCount,
			type,
			enableRealtime,
			...optional,
		};
	}

	private buildTimelineVariables(after?: string | null): TimelineVariables {
		const variables: TimelineVariables = {
			type: this.config.type,
			first: this.config.preloadCount,
		};

		variables.after = after ?? undefined;

		if (this.config.type === 'HASHTAG') {
			if (this.config.hashtag) {
				variables.hashtag = this.config.hashtag;
			} else if (this.config.hashtags?.length) {
				variables.hashtag = this.config.hashtags[0];
			}
		}

		if (this.config.type === 'LIST' && this.config.listId) {
			variables.listId = this.config.listId;
		}

		return variables;
	}

	private toTimelineItem(status: UnifiedStatus): GenericTimelineItem {
		return convertUnifiedStatusToTimelineItem(status, this.statusCache);
	}

	private async hydrateParents(items: GenericTimelineItem[]): Promise<void> {
		const adapter = this.config.adapter;
		const missingParentIds = new Set<string>();

		for (const item of items) {
			const status = item.status;
			if (
				item.type === 'status' &&
				status &&
				status.inReplyToId &&
				!status.inReplyToStatus
			) {
				missingParentIds.add(status.inReplyToId);
			}
		}

		if (missingParentIds.size === 0) {
			return;
		}

		const parentStatuses = new Map<string, GenericStatus>();

		await Promise.all(
			Array.from(missingParentIds).map(async (parentId) => {
				try {
					const parentObject = await adapter.getObject(parentId);
					const lesser = convertGraphQLObjectToLesser(parentObject);
					if (!lesser) return;
					const mapped = mapLesserObject(lesser);
					if (!mapped.success || !mapped.data) return;
					const generic = convertUnifiedStatusToGeneric(mapped.data, this.statusCache);
					parentStatuses.set(parentId, generic);
				} catch (error) {
					console.warn('[lesserTimelineStore] Failed to hydrate parent', parentId, error);
				}
			})
		);

		if (parentStatuses.size === 0) {
			return;
		}

		this.state.items = this.state.items.map((item) => {
			if (item.type !== 'status' || !item.status || !item.status.inReplyToId) {
				return item;
			}

			const parent = parentStatuses.get(item.status.inReplyToId);
			if (!parent) {
				return item;
			}

			return {
				...item,
				status: {
					...item.status,
					inReplyToStatus: parent,
					inReplyToAccount: parent.account,
					inReplyToAccountId: parent.account?.id ?? item.status.inReplyToAccountId,
				},
			};
		});
	}

	/**
	 * Load initial timeline data
	 */
	async loadInitial(): Promise<void> {
		if (this.state.loading) return;

		this.state.loading = true;
		this.state.error = null;
		this.abortController = new AbortController();

		try {
			this.statusCache.clear();
			const response = await this.config.adapter.fetchTimeline(this.buildTimelineVariables());
			const { successful } = mapLesserTimelineConnection(
				response as unknown as LesserTimelineConnection
			);
			const timelineItems = successful
				.map((status: UnifiedStatus) => this.toTimelineItem(status))
				.slice(0, this.config.maxItems);

			this.state.items = timelineItems;
			this.state.hasMore = response.pageInfo?.hasNextPage ?? false;
			this.cursor = response.pageInfo?.endCursor ?? null;
			this.state.lastUpdated = new Date();
			this.state.connected = true;
			await this.hydrateParents(this.state.items);
		} catch (error) {
			if (error instanceof Error && error.name !== 'AbortError') {
				this.state.error = error.message;
			}
		} finally {
			this.state.loading = false;
			this.abortController = null;
		}
	}

	/**
	 * Load additional timeline data (older items)
	 */
	async loadMore(): Promise<void> {
		if (this.state.loadingMore || !this.state.hasMore || !this.cursor) return;

		this.state.loadingMore = true;
		this.abortController = new AbortController();

		try {
			const response = await this.config.adapter.fetchTimeline(
				this.buildTimelineVariables(this.cursor)
			);
			const { successful } = mapLesserTimelineConnection(
				response as unknown as LesserTimelineConnection
			);
			const newItems: GenericTimelineItem[] = successful.map((status: UnifiedStatus) =>
				this.toTimelineItem(status)
			);

			if (newItems.length > 0) {
				const existingIds = new Set(this.state.items.map((item) => item.id));
				const filteredNewItems = newItems.filter(
					(item: GenericTimelineItem) => !existingIds.has(item.id)
				);
				const merged = [...this.state.items, ...filteredNewItems];
				this.state.items = merged.slice(-this.config.maxItems);
				await this.hydrateParents(this.state.items);
			}

			this.state.hasMore = response.pageInfo?.hasNextPage ?? false;
			this.cursor = response.pageInfo?.endCursor ?? null;
			this.state.lastUpdated = new Date();
		} catch (error) {
			if (error instanceof Error && error.name !== 'AbortError') {
				this.state.error = error.message;
			}
		} finally {
			this.state.loadingMore = false;
			this.abortController = null;
		}
	}

	/**
	 * Refresh timeline by clearing pagination and fetching from the start
	 */
	async refresh(): Promise<void> {
		this.cursor = null;
		this.state.hasMore = true;
		this.statusCache.clear();
		await this.loadInitial();
	}

	/**
	 * Add a new status (for real-time updates)
	 */
	addStatus(unifiedStatus: UnifiedStatus): void {
		this.statusCache.delete(unifiedStatus.id);
		const newItem = this.toTimelineItem(unifiedStatus);
		const deduped = [newItem, ...this.state.items.filter((item) => item.id !== newItem.id)];

			this.state.items = deduped.slice(0, this.config.maxItems);
			this.state.lastUpdated = new Date();
		void this.hydrateParents([newItem]);
	}

	/**
	 * Remove a status
	 */
	removeStatus(statusId: string): void {
		this.statusCache.delete(statusId);
		this.state.items = this.state.items.filter((item) => item.id !== statusId);
		this.state.lastUpdated = new Date();
	}

	/**
	 * Cancel any pending operations
	 */
	cancel(): void {
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}
	}

	/**
	 * Destroy the store and reset state
	 */
	destroy(): void {
		this.cancel();
		this.statusCache.clear();
		this.state.items = [];
		this.state.loading = false;
		this.state.loadingMore = false;
		this.state.hasMore = true;
		this.state.error = null;
		this.state.lastUpdated = null;
		this.state.connected = false;
	}

	/**
	 * Get current state
	 */
	getState(): LesserTimelineState {
		return this.state;
	}

	/**
	 * Get timeline items
	 */
	getItems(): GenericTimelineItem[] {
		return this.state.items;
	}

	/**
	 * Get items containing any Lesser-specific metadata
	 */
	getItemsWithLesserMetadata(): GenericTimelineItem[] {
		return this.state.items.filter((item) => {
			const lesser = item.metadata?.lesser;
			return Boolean(
				lesser &&
					(lesser.estimatedCost !== undefined ||
						lesser.moderationScore !== undefined ||
						lesser.hasCommunityNotes ||
						(lesser.communityNotesCount ?? 0) > 0 ||
						lesser.isQuote ||
						lesser.quoteable ||
						lesser.authorTrustScore !== undefined ||
						(lesser as { aiModerationAction?: string } | undefined)?.aiModerationAction !==
							undefined)
			);
		});
	}

	/**
	 * Get items with cost below threshold
	 */
	getItemsWithCost(maxCost?: number): GenericTimelineItem[] {
		return this.state.items.filter((item) => {
			const cost = item.metadata?.lesser?.estimatedCost;
			return cost !== undefined && (maxCost === undefined || cost <= maxCost);
		});
	}

	/**
	 * Get items with minimum trust score
	 */
	getItemsWithTrustScore(minScore: number): GenericTimelineItem[] {
		return this.state.items.filter((item) => {
			const trustScore = item.metadata?.lesser?.authorTrustScore;
			return trustScore !== undefined && trustScore >= minScore;
		});
	}

	/**
	 * Get items with community notes
	 */
	getItemsWithCommunityNotes(): GenericTimelineItem[] {
		return this.state.items.filter((item) => {
			const lesser = item.metadata?.lesser;
			return Boolean(lesser && (lesser.hasCommunityNotes || (lesser.communityNotesCount ?? 0) > 0));
		});
	}

	/**
	 * Get quote posts
	 */
	getQuotePosts(): GenericTimelineItem[] {
		return this.state.items.filter((item) => item.metadata?.lesser?.isQuote === true);
	}

	/**
	 * Get items flagged by moderation
	 */
	getModeratedItems(action?: string): GenericTimelineItem[] {
		return this.state.items.filter((item) => {
			const lesser = item.metadata?.lesser;
			if (!lesser || lesser.moderationScore === undefined) {
				return false;
			}

			if (action === undefined) {
				return true;
			}

			const moderationAction = (lesser as { aiModerationAction?: string } | undefined)
				?.aiModerationAction;
			return moderationAction === action;
		});
	}
}

function mapAccountToActor(account: UnifiedStatus['account']): ActivityPubActor {
	const icon = account.avatar
		? ({
				type: 'Image',
				url: account.avatar,
				mediaType: 'image',
			} satisfies ActivityPubImage)
		: undefined;

	const header = account.header
		? ({
				type: 'Image',
				url: account.header,
				mediaType: 'image',
			} satisfies ActivityPubImage)
		: undefined;

	return {
		id: account.id,
		type: 'Person',
		name: account.displayName || account.username,
		preferredUsername: account.username,
		summary: account.note,
		icon,
		image: header,
		url:
			typeof account.metadata?.rawPayload === 'object' && account.metadata?.rawPayload !== null
				? (account.metadata.rawPayload as { url?: string }).url
				: undefined,
		extensions: {
			trustScore: account.trustScore,
			reputation: account.reputation,
			metadata: account.metadata,
			vouches: account.vouches,
		},
	};
}

function resolveMediaCategory(
	attachment: UnifiedStatus['mediaAttachments'][number]
): string | undefined {
	if (attachment.mediaCategory && attachment.mediaCategory !== 'UNKNOWN') {
		return attachment.mediaCategory;
	}

	switch (attachment.type) {
		case 'image':
			return 'IMAGE';
		case 'video':
			return 'VIDEO';
		case 'audio':
			return 'AUDIO';
		case 'gifv':
			return 'GIFV';
		default:
			return undefined;
	}
}

function mapMediaAttachment(
	attachment: UnifiedStatus['mediaAttachments'][number]
): ActivityPubImage {
	const width = attachment.meta?.original?.width ?? attachment.meta?.small?.width;
	const height = attachment.meta?.original?.height ?? attachment.meta?.small?.height;
	const type = attachment.type === 'image' ? 'Image' : 'Document';
	const mediaCategory = resolveMediaCategory(attachment);

	return {
		type,
		url: attachment.url,
		mediaType: attachment.mimeType ?? attachment.type,
		name: attachment.description,
		previewUrl: attachment.previewUrl,
		width,
		height,
		blurhash: attachment.blurhash,
		sensitive: attachment.sensitive ?? false,
		spoilerText: attachment.spoilerText ?? null,
		mediaCategory,
		mimeType: attachment.mimeType,
	};
}

function mapMentionToTag(mention: UnifiedStatus['mentions'][number]): ActivityPubTag {
	return {
		type: 'Mention',
		name: `@${mention.acct}`,
		href: mention.url,
	};
}

function mapHashtagToTag(tag: UnifiedStatus['tags'][number]): ActivityPubTag {
	return {
		type: 'Hashtag',
		name: `#${tag.name}`,
		href: tag.url,
	};
}

function mapEmojiToTag(emoji: UnifiedStatus['emojis'][number]): ActivityPubTag {
	return {
		type: 'Emoji',
		name: `:${emoji.shortcode}:`,
		icon: {
			type: 'Image',
			url: emoji.url,
			mediaType: 'image',
		},
	};
}

function convertUnifiedStatusToGeneric(
	status: UnifiedStatus,
	cache: Map<string, GenericStatus>
): GenericStatus {
	if (cache.has(status.id)) {
		const cachedStatus = cache.get(status.id);
		if (cachedStatus) {
			return cachedStatus;
		}
	}

	const actor = mapAccountToActor(status.account);
	const mediaAttachments = status.mediaAttachments.map(mapMediaAttachment);
	const mentions = status.mentions.map(mapMentionToTag);
	const hashtags = status.tags.map(mapHashtagToTag);
	const emojis = status.emojis.map(mapEmojiToTag);
	const inReplyToActor = status.inReplyTo?.account
		? mapAccountToActor(status.inReplyTo.account)
		: undefined;

	const activityPubObject: ActivityPubObject = {
		id: status.id,
		type: 'Note',
		attributedTo: actor.id,
		content: status.content,
		summary: status.spoilerText,
		sensitive: status.sensitive,
		published: new Date(status.createdAt),
		updated: status.editedAt ? new Date(status.editedAt) : undefined,
		inReplyTo: status.inReplyTo?.id,
		attachment: mediaAttachments.length ? mediaAttachments : undefined,
		tag: [...mentions, ...hashtags, ...emojis],
		extensions: {
			sourceMetadata: status.metadata,
			lesser: {
				estimatedCost: status.estimatedCost,
				moderationScore: status.moderationScore,
				communityNotes: status.communityNotes,
				quoteUrl: status.quoteUrl,
				quoteable: status.quoteable,
				quotePermissions: status.quotePermissions,
				quoteContext: status.quoteContext,
				quoteCount: status.quoteCount,
				aiAnalysis: status.aiAnalysis,
			},
		},
	};

	const genericStatus: GenericStatus = {
		id: status.id,
		activityPubObject,
		account: actor,
		content: status.content,
		contentWarning: status.spoilerText,
		sensitive: status.sensitive,
		mediaAttachments,
		mentions,
		hashtags,
		emojis,
		createdAt: new Date(status.createdAt),
		updatedAt: status.editedAt ? new Date(status.editedAt) : undefined,
		repliesCount: status.repliesCount,
		reblogsCount: status.reblogsCount,
		favouritesCount: status.favouritesCount,
		reblogged: status.reblogged,
		favourited: status.favourited,
		bookmarked: status.bookmarked,
		inReplyToId: status.inReplyTo?.id,
		inReplyToAccountId: status.inReplyTo?.accountId,
		inReplyToAccount: inReplyToActor,
		inReplyToStatus: undefined,
		reblog: undefined,
		visibility: status.visibility,
		url: undefined,
	};

	cache.set(status.id, genericStatus);

	if (status.reblog) {
		genericStatus.reblog = convertUnifiedStatusToGeneric(status.reblog, cache);
	}

	return genericStatus;
}

function convertUnifiedStatusToTimelineItem(
	status: UnifiedStatus,
	cache: Map<string, GenericStatus>
): GenericTimelineItem {
	const timelineData = unifiedStatusToTimelineItem(status);
	const genericStatus = convertUnifiedStatusToGeneric(status, cache);

	return {
		id: status.id,
		type: 'status',
		status: genericStatus,
		timestamp: new Date(status.createdAt),
		context: {
			isThread: status.repliesCount > 0,
			isReply: Boolean(status.inReplyTo),
			isBoost: Boolean(status.reblog),
		},
		metadata: timelineData.metadata,
	};
}
