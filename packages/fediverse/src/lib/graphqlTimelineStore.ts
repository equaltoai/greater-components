/**
 * GraphQL Timeline Store
 * 
 * Adapts the LesserGraphQLAdapter to the TimelineStore interface
 * for use with TimelineVirtualizedReactive.
 */

import type { Status, Account } from '../types';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

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
            const newItems = statuses.filter(s => !this.state.items.find(existing => existing.id === s.id));
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
                const uniqueNewItems = statuses.filter(s => !this.state.items.find(existing => existing.id === s.id));
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
        const index = this.state.items.findIndex(s => s.id === status.id);
        if (index !== -1) {
            this.state.items[index] = status;
        }
    }

    clearUnreadCount(): void {
        this.state.unreadCount = 0;
    }

    private async fetchStatuses(pagination?: { first?: number; after?: string }): Promise<Status[]> {
        let items: any[] = [];
        const limit = pagination?.first ?? 20;
        
        try {
            if (this.view.type === 'profile' && this.view.username) {
                let actorId = this.view.actorId;
                if (!actorId) {
                    const actor = await this.adapter.getActorByUsername(this.view.username);
                    // @ts-ignore - Adapter types might be slightly different in generated code
                    if (actor && actor.id) {
                        // @ts-ignore
                        actorId = actor.id;
                        this.view.actorId = actorId;
                    }
                }
                
                if (actorId) {
                    const timeline = await this.adapter.fetchActorTimeline(actorId, {
                        first: limit,
                        after: pagination?.after,
                        mediaOnly: this.view.onlyMedia
                    });
                    items = this.extractItems(timeline);
                    this.updateCursors(timeline);
                }
            } else if (this.view.type === 'home') {
                const timeline = await this.adapter.fetchHomeTimeline({
                    first: limit,
                    after: pagination?.after
                });
                items = this.extractItems(timeline);
                this.updateCursors(timeline);
            } else if (this.view.type === 'public') {
                const timeline = await this.adapter.fetchPublicTimeline({
                    first: limit,
                    after: pagination?.after
                }, 'PUBLIC');
                items = this.extractItems(timeline);
                this.updateCursors(timeline);
            } else if (this.view.type === 'hashtag' && this.view.hashtag) {
                const timeline = await this.adapter.fetchHashtagTimeline(this.view.hashtag, {
                    first: limit,
                    after: pagination?.after
                });
                items = this.extractItems(timeline);
                this.updateCursors(timeline);
            } else if (this.view.type === 'list' && this.view.listId) {
                 const timeline = await this.adapter.fetchListTimeline(this.view.listId, {
                    first: limit,
                    after: pagination?.after
                });
                items = this.extractItems(timeline);
                this.updateCursors(timeline);
            }
        } catch (e) {
            console.error('Error fetching GraphQL timeline:', e);
            throw e;
        }
        
        return items.map(item => this.mapToStatus(item)).filter(s => !!s) as Status[];
    }

    private extractItems(timelineData: any): any[] {
        if (!timelineData) return [];
        if (Array.isArray(timelineData)) return timelineData;
        // Handle Connection objects (edges/nodes)
        if (timelineData.edges && Array.isArray(timelineData.edges)) {
            return timelineData.edges.map((edge: any) => edge.node);
        }
        // Handle other list wrappers
        if (timelineData.nodes && Array.isArray(timelineData.nodes)) {
            return timelineData.nodes;
        }
        if (timelineData.items && Array.isArray(timelineData.items)) {
            return timelineData.items;
        }
        return [];
    }
    
    private updateCursors(timelineData: any) {
        if (timelineData?.pageInfo) {
            this.cursors.end = timelineData.pageInfo.endCursor;
            this.cursors.start = timelineData.pageInfo.startCursor;
        }
    }

    private mapToStatus(item: any): Status | null {
        if (!item || typeof item !== 'object') return null;
        
        // Basic verification
        if (!item.id || !item.content) return null;
        
        const account = this.mapAccount(item.account || item.author);
        if (!account) return null;

        return {
            id: item.id,
            uri: item.uri || item.url || '',
            url: item.url || '',
            account,
            content: item.content,
            createdAt: item.createdAt,
            sensitive: item.sensitive,
            spoilerText: item.spoilerText,
            visibility: item.visibility || 'public',
            language: item.language,
            repliesCount: item.repliesCount || 0,
            reblogsCount: item.reblogsCount || 0,
            favouritesCount: item.favouritesCount || 0,
            favourited: item.favourited,
            reblogged: item.reblogged,
            bookmarked: item.bookmarked,
            muted: item.muted,
            pinned: item.pinned,
            mediaAttachments: item.mediaAttachments?.map((m: any) => ({
                id: m.id,
                type: m.type,
                url: m.url,
                previewUrl: m.previewUrl,
                description: m.description,
                meta: m.meta
            })) || [],
            mentions: item.mentions || [],
            tags: item.tags || [],
            card: item.card,
            // Recursive reblog mapping could cause stack overflow if not careful, 
            // but usually GraphQL returns restricted depth.
            reblog: item.reblog ? this.mapToStatus(item.reblog) : undefined
        } as Status;
    }

    private mapAccount(item: any): Account | null {
        if (!item) return null;
        return {
            id: item.id,
            username: item.username,
            acct: item.acct || item.username,
            displayName: item.displayName || item.username,
            avatar: item.avatar || '',
            header: item.header || '',
            url: item.url || '',
            statusesCount: item.statusesCount || 0,
            followersCount: item.followersCount || 0,
            followingCount: item.followingCount || 0,
            createdAt: item.createdAt || new Date().toISOString(),
            bot: item.bot || false,
            locked: item.locked || false,
            verified: item.verified || false,
            note: item.note || item.bio || '',
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