/**
 * GraphQL Timeline Store
 *
 * Adapts the LesserGraphQLAdapter to the TimelineStore interface
 * for use with TimelineVirtualizedReactive.
 */

import type { Status, Account, MediaAttachment, Card } from '../types';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === 'object' && value !== null;

export interface TimelineState {
	items: Status[];
	loading: boolean;
	loadingTop: boolean;
	loadingBottom: boolean;
	endReached: boolean;
	error: string | null;
	lastUpdated: Date | null;
	unreadCount: number;
	connected: boolean;
}

export interface GraphQLTimelineView {
	type: 'profile' | 'home' | 'public' | 'hashtag' | 'list';
	username?: string;
	actorId?: string;
	hashtag?: string;
	listId?: string;
	showReplies?: boolean;
	showBoosts?: boolean;
	onlyMedia?: boolean;
	showPinned?: boolean;
}

export class GraphQLTimelineStore {
	private state = $state<TimelineState>({
		items: [],
		loading: false,
		loadingTop: false,
		loadingBottom: false,
		endReached: false,
		error: null,
		lastUpdated: null,
		unreadCount: 0,
		connected: true,
	});

	private adapter: LesserGraphQLAdapter;
	private view: GraphQLTimelineView;
	private cursors: {
		start: string | null;
		end: string | null;
	} = { start: null, end: null };

	constructor(adapter: LesserGraphQLAdapter, view: GraphQLTimelineView) {
		this.adapter = adapter;
		this.view = view;
	}

	async connect(): Promise<void> {
		if (this.state.items.length === 0) {
			await this.loadInitial();
		}
	}

	disconnect(): void {
		// Cleanup subscriptions if any
	}

	async loadInitial(): Promise<void> {
		if (this.state.loading) return;
		this.state.loading = true;
		this.state.error = null;

		try {
			const statuses = await this.fetchStatuses();
			this.state.items = statuses;
			this.state.endReached = statuses.length < 20;
			this.state.lastUpdated = new Date();
		} catch (error) {
			if (error instanceof Error) {
				this.state.error = error.message;
			}
		} finally {
			this.state.loading = false;
		}
	}

	async loadNewer(): Promise<void> {
		if (this.state.loadingTop) return;
		this.state.loadingTop = true;
		this.state.error = null;

		try {
			// Currently GraphQL adapter doesn't support "before" cursor easily for all timelines
			// So we typically refresh or fetch new and merge.
			// For this implementation, we'll just fetch the first page and merge.
			// This is not optimal but works for a start.
			const statuses = await this.fetchStatuses({ first: 20 });

			// Naive merge: prepend items that are not in the list
			const newItems = statuses.filter(
				(s) => !this.state.items.find((existing) => existing.id === s.id)
			);
			if (newItems.length > 0) {
				this.state.items.unshift(...newItems);
			}

			this.state.unreadCount = 0;
			this.state.lastUpdated = new Date();
		} catch (error) {
			if (error instanceof Error) {
				this.state.error = error.message;
			}
		} finally {
			this.state.loadingTop = false;
		}
	}

	async loadOlder(): Promise<void> {
		if (this.state.loadingBottom || this.state.endReached) return;
		this.state.loadingBottom = true;
		this.state.error = null;

		try {
			// We rely on cursors updated by fetchStatuses
			const statuses = await this.fetchStatuses({ after: this.cursors.end ?? undefined });

			if (statuses.length > 0) {
				// Filter duplicates just in case
				const uniqueNewItems = statuses.filter(
					(s) => !this.state.items.find((existing) => existing.id === s.id)
				);
				this.state.items.push(...uniqueNewItems);
			}

			this.state.endReached = statuses.length < 20;
			this.state.lastUpdated = new Date();
		} catch (error) {
			if (error instanceof Error) {
				this.state.error = error.message;
			}
		} finally {
			this.state.loadingBottom = false;
		}
	}

	async refresh(): Promise<void> {
		this.state.items = [];
		this.cursors = { start: null, end: null };
		this.state.endReached = false;
		this.state.unreadCount = 0;
		await this.loadInitial();
	}

	updateStatus(status: Status): void {
		const index = this.state.items.findIndex((s) => s.id === status.id);
		if (index !== -1) {
			this.state.items[index] = status;
		}
	}

	clearUnreadCount(): void {
		this.state.unreadCount = 0;
	}

	private async fetchStatuses(pagination?: { first?: number; after?: string }): Promise<Status[]> {
		let items: unknown[] = [];
		const limit = pagination?.first ?? 20;

		try {
			if (this.view.type === 'profile' && this.view.username) {
				let actorId = this.view.actorId;
				if (!actorId) {
					const actor = await this.adapter.getActorByUsername(this.view.username);
					if (isRecord(actor) && typeof actor.id === 'string') {
						actorId = actor.id;
						this.view.actorId = actorId;
					}
				}

				if (actorId) {
					const timeline = await this.adapter.fetchActorTimeline(actorId, {
						first: limit,
						after: pagination?.after,
						mediaOnly: this.view.onlyMedia,
					});
					items = this.extractItems(timeline);
					this.updateCursors(timeline);
				}
			} else if (this.view.type === 'home') {
				const timeline = await this.adapter.fetchHomeTimeline({
					first: limit,
					after: pagination?.after,
				});
				items = this.extractItems(timeline);
				this.updateCursors(timeline);
			} else if (this.view.type === 'public') {
				const timeline = await this.adapter.fetchPublicTimeline(
					{
						first: limit,
						after: pagination?.after,
					},
					'PUBLIC'
				);
				items = this.extractItems(timeline);
				this.updateCursors(timeline);
			} else if (this.view.type === 'hashtag' && this.view.hashtag) {
				const timeline = await this.adapter.fetchHashtagTimeline(this.view.hashtag, {
					first: limit,
					after: pagination?.after,
				});
				items = this.extractItems(timeline);
				this.updateCursors(timeline);
			} else if (this.view.type === 'list' && this.view.listId) {
				const timeline = await this.adapter.fetchListTimeline(this.view.listId, {
					first: limit,
					after: pagination?.after,
				});
				items = this.extractItems(timeline);
				this.updateCursors(timeline);
			}
		} catch (e) {
			console.error('Error fetching GraphQL timeline:', e);
			throw e;
		}

		const mapped = items
			.map((item) => this.mapToStatus(item))
			.filter((status): status is Status => Boolean(status));

		return mapped;
	}

	private extractItems(timelineData: unknown): unknown[] {
		if (!timelineData) return [];
		if (Array.isArray(timelineData)) return timelineData;
		if (!isRecord(timelineData)) return [];

		const edges = timelineData['edges'];
		if (Array.isArray(edges)) {
			return edges
				.map((edge) => (isRecord(edge) ? edge['node'] : null))
				.filter((edgeNode): edgeNode is unknown => edgeNode !== null);
		}

		const nodes = timelineData['nodes'];
		if (Array.isArray(nodes)) {
			return nodes;
		}

		const items = timelineData['items'];
		if (Array.isArray(items)) {
			return items;
		}

		return [];
	}

	private updateCursors(timelineData: unknown) {
		if (!isRecord(timelineData)) return;
		const pageInfo = timelineData['pageInfo'];
		if (isRecord(pageInfo)) {
			this.cursors.end =
				typeof pageInfo['endCursor'] === 'string' ? pageInfo['endCursor'] : this.cursors.end;
			this.cursors.start =
				typeof pageInfo['startCursor'] === 'string' ? pageInfo['startCursor'] : this.cursors.start;
		}
	}

	private mapToStatus(item: unknown): Status | null {
		if (!isRecord(item)) return null;
		if (typeof item['id'] !== 'string' || item['content'] === undefined) return null;

		const account = this.mapAccount(item['account'] ?? item['author']);
		if (!account) return null;

		const buildMedia = (media: unknown): MediaAttachment | null => {
			if (
				!isRecord(media) ||
				typeof media['id'] !== 'string' ||
				typeof media['type'] !== 'string' ||
				typeof media['url'] !== 'string'
			) {
				return null;
			}

			return {
				id: media['id'],
				type: media['type'] as MediaAttachment['type'],
				url: media['url'],
				previewUrl: typeof media['previewUrl'] === 'string' ? media['previewUrl'] : undefined,
				description: typeof media['description'] === 'string' ? media['description'] : undefined,
				meta: isRecord(media['meta']) ? (media['meta'] as Record<string, unknown>) : undefined,
			};
		};

		const createdAt =
			typeof item['createdAt'] === 'string' || item['createdAt'] instanceof Date
				? item['createdAt']
				: new Date().toISOString();

		const mediaAttachmentsRaw = item['mediaAttachments'];
		const mediaAttachments = Array.isArray(mediaAttachmentsRaw)
			? mediaAttachmentsRaw
					.map(buildMedia)
					.filter((media): media is NonNullable<typeof media> => Boolean(media))
			: [];

		return {
			id: item['id'],
			uri:
				typeof item['uri'] === 'string'
					? item['uri']
					: typeof item['url'] === 'string'
						? item['url']
						: '',
			url: typeof item['url'] === 'string' ? item['url'] : '',
			account,
			content: String(item['content']),
			createdAt,
			sensitive: Boolean(item['sensitive']),
			spoilerText: typeof item['spoilerText'] === 'string' ? item['spoilerText'] : undefined,
			visibility: (typeof item['visibility'] === 'string'
				? item['visibility']
				: 'public') as Status['visibility'],
			language: typeof item['language'] === 'string' ? item['language'] : undefined,
			repliesCount: typeof item['repliesCount'] === 'number' ? item['repliesCount'] : 0,
			reblogsCount: typeof item['reblogsCount'] === 'number' ? item['reblogsCount'] : 0,
			favouritesCount: typeof item['favouritesCount'] === 'number' ? item['favouritesCount'] : 0,
			favourited: typeof item['favourited'] === 'boolean' ? item['favourited'] : undefined,
			reblogged: typeof item['reblogged'] === 'boolean' ? item['reblogged'] : undefined,
			bookmarked: typeof item['bookmarked'] === 'boolean' ? item['bookmarked'] : undefined,
			muted: typeof item['muted'] === 'boolean' ? item['muted'] : undefined,
			pinned: typeof item['pinned'] === 'boolean' ? item['pinned'] : undefined,
			mediaAttachments,
			mentions: Array.isArray(item['mentions']) ? (item['mentions'] as Status['mentions']) : [],
			tags: Array.isArray(item['tags']) ? (item['tags'] as Status['tags']) : [],
			card: isRecord(item['card']) ? (item['card'] as unknown as Card) : undefined,
			// Recursive reblog mapping could cause stack overflow if not careful,
			// but usually GraphQL returns restricted depth.
			reblog: item['reblog'] ? (this.mapToStatus(item['reblog']) ?? undefined) : undefined,
		};
	}

	private mapAccount(item: unknown): Account | null {
		if (!isRecord(item) || typeof item['id'] !== 'string' || typeof item['username'] !== 'string')
			return null;
		const displayName =
			typeof item['displayName'] === 'string' ? item['displayName'] : item['username'];
		const acct = typeof item['acct'] === 'string' ? item['acct'] : item['username'];

		return {
			id: item['id'],
			username: item['username'],
			acct,
			displayName,
			avatar: typeof item['avatar'] === 'string' ? item['avatar'] : '',
			header: typeof item['header'] === 'string' ? item['header'] : '',
			url: typeof item['url'] === 'string' ? item['url'] : '',
			statusesCount: typeof item['statusesCount'] === 'number' ? item['statusesCount'] : 0,
			followersCount: typeof item['followersCount'] === 'number' ? item['followersCount'] : 0,
			followingCount: typeof item['followingCount'] === 'number' ? item['followingCount'] : 0,
			createdAt:
				typeof item['createdAt'] === 'string' || item['createdAt'] instanceof Date
					? item['createdAt']
					: new Date().toISOString(),
			bot: typeof item['bot'] === 'boolean' ? item['bot'] : false,
			locked: typeof item['locked'] === 'boolean' ? item['locked'] : false,
			verified: typeof item['verified'] === 'boolean' ? item['verified'] : false,
			note:
				typeof item['note'] === 'string'
					? item['note']
					: typeof item['bio'] === 'string'
						? item['bio']
						: '',
		};
	}

	get currentState() {
		return this.state;
	}

	get items() {
		return this.state.items;
	}

	destroy() {
		this.disconnect();
	}
}
