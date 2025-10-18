/**
 * Lesser Timeline Integration
 * 
 * Provides timeline functionality using GraphQL adapter and unified models
 * with proper Lesser metadata hydration
 */

import type { UnifiedStatus } from '@greater/adapters';
import type { GenericTimelineItem } from '../generics/index.js';
import { unifiedStatusToTimelineItem } from '@greater/adapters';
import { LesserGraphQLAdapter } from '../adapters/graphql/index.js';

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
  /** Multiple hashtags to follow */
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

export class LesserTimelineStore {
  private state = $state<LesserTimelineState>({
    items: [],
    loading: false,
    loadingMore: false,
    hasMore: true,
    error: null,
    lastUpdated: null,
    connected: false
  });

  private config: Required<LesserTimelineConfig>;
  private cursor: string | null = null;
  private abortController: AbortController | null = null;

  constructor(config: LesserTimelineConfig) {
    this.config = {
      maxItems: 1000,
      preloadCount: 20,
      type: 'PUBLIC',
      enableRealtime: true,
      ...config
    };
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
      // Build timeline query variables based on configuration
      const variables: any = {
        type: this.config.type,
        first: this.config.preloadCount
      };

      // Add hashtag parameter for HASHTAG timelines
      if (this.config.type === 'HASHTAG' && this.config.hashtag) {
        variables.hashtag = this.config.hashtag;
      }

      // Add listId parameter for LIST timelines
      if (this.config.type === 'LIST' && this.config.listId) {
        variables.listId = this.config.listId;
      }

      const response = await this.config.adapter.fetchTimeline(variables);

      // Convert unified statuses to timeline items with Lesser metadata
      const timelineItems: GenericTimelineItem[] = response.edges.map(edge => {
        const unifiedStatus = edge.node as UnifiedStatus;
        const timelineItem = unifiedStatusToTimelineItem(unifiedStatus);
        
        return {
          id: unifiedStatus.id,
          type: timelineItem.type,
          status: timelineItem.content, // This is the UnifiedStatus
          timestamp: new Date(unifiedStatus.createdAt),
          context: {
            isThread: !!unifiedStatus.inReplyToId,
            isReply: !!unifiedStatus.inReplyToId,
            isBoost: false
          },
          // Copy the metadata from the converter
          metadata: timelineItem.metadata
        };
      });

      this.state.items = timelineItems;
      this.state.hasMore = response.pageInfo.hasNextPage;
      this.cursor = response.pageInfo.endCursor || null;
      this.state.lastUpdated = new Date();
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
   * Load more items
   */
  async loadMore(): Promise<void> {
    if (this.state.loadingMore || !this.state.hasMore || !this.cursor) return;

    this.state.loadingMore = true;
    this.abortController = new AbortController();

    try {
      // Build timeline query variables
      const variables: any = {
        type: this.config.type,
        first: this.config.preloadCount,
        after: this.cursor
      };

      // Add hashtag parameter for HASHTAG timelines
      if (this.config.type === 'HASHTAG' && this.config.hashtag) {
        variables.hashtag = this.config.hashtag;
      }

      // Add listId parameter for LIST timelines
      if (this.config.type === 'LIST' && this.config.listId) {
        variables.listId = this.config.listId;
      }

      const response = await this.config.adapter.fetchTimeline(variables);

      // Convert new unified statuses to timeline items
      const newTimelineItems: GenericTimelineItem[] = response.edges.map(edge => {
        const unifiedStatus = edge.node as UnifiedStatus;
        const timelineItem = unifiedStatusToTimelineItem(unifiedStatus);
        
        return {
          id: unifiedStatus.id,
          type: timelineItem.type,
          status: timelineItem.content, // This is the UnifiedStatus
          timestamp: new Date(unifiedStatus.createdAt),
          context: {
            isThread: !!unifiedStatus.inReplyToId,
            isReply: !!unifiedStatus.inReplyToId,
            isBoost: false
          },
          // Copy the metadata from the converter
          metadata: timelineItem.metadata
        };
      });

      // Add new items and enforce limit
      const allItems = [...this.state.items, ...newTimelineItems];
      this.state.items = allItems.slice(-this.config.maxItems);
      this.state.hasMore = response.pageInfo.hasNextPage;
      this.cursor = response.pageInfo.endCursor || null;
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
   * Refresh timeline
   */
  async refresh(): Promise<void> {
    this.cursor = null;
    this.state.hasMore = true;
    await this.loadInitial();
  }

  /**
   * Add a new status (for real-time updates)
   */
  addStatus(unifiedStatus: UnifiedStatus): void {
    const timelineItem = unifiedStatusToTimelineItem(unifiedStatus);
    
    const newItem: GenericTimelineItem = {
      id: unifiedStatus.id,
      type: timelineItem.type,
      status: timelineItem.content, // This is the UnifiedStatus
      timestamp: new Date(unifiedStatus.createdAt),
      context: {
        isThread: !!unifiedStatus.inReplyToId,
        isReply: !!unifiedStatus.inReplyToId,
        isBoost: false
      },
      // Copy the metadata from the converter
      metadata: timelineItem.metadata
    };

    // Add to beginning and enforce limit
    const allItems = [newItem, ...this.state.items];
    this.state.items = allItems.slice(0, this.config.maxItems);
    this.state.lastUpdated = new Date();
  }

  /**
   * Remove a status
   */
  removeStatus(statusId: string): void {
    this.state.items = this.state.items.filter(item => item.id !== statusId);
    this.state.lastUpdated = new Date();
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
   * Get items with Lesser metadata
   */
  getItemsWithLesserMetadata(): GenericTimelineItem[] {
    return this.state.items.filter(item => 
      item.status && 
      (item.status.estimatedCost !== undefined || 
       item.status.moderationScore !== undefined ||
       item.status.communityNotes?.length ||
       item.status.quoteUrl ||
       item.status.account.trustScore !== undefined)
    );
  }

  /**
   * Get items with cost below threshold
   */
  getItemsWithCost(maxCost?: number): GenericTimelineItem[] {
    return this.state.items.filter(item => 
      item.status && 
      item.status.estimatedCost !== undefined &&
      (maxCost === undefined || item.status.estimatedCost <= maxCost)
    );
  }

  /**
   * Get items with minimum trust score
   */
  getItemsWithTrustScore(minScore: number): GenericTimelineItem[] {
    return this.state.items.filter(item => 
      item.status && 
      item.status.account.trustScore !== undefined &&
      item.status.account.trustScore >= minScore
    );
  }

  /**
   * Get items with community notes
   */
  getItemsWithCommunityNotes(): GenericTimelineItem[] {
    return this.state.items.filter(item => 
      item.status && 
      item.status.communityNotes?.length
    );
  }

  /**
   * Get quote posts
   */
  getQuotePosts(): GenericTimelineItem[] {
    return this.state.items.filter(item => 
      item.status && 
      item.status.quoteUrl
    );
  }

  /**
   * Get items flagged by moderation
   */
  getModeratedItems(action?: string): GenericTimelineItem[] {
    return this.state.items.filter(item => 
      item.status && 
      item.status.moderationScore !== undefined &&
      (action === undefined || item.status.aiAnalysis?.moderationAction === action)
    );
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
   * Destroy the store
   */
  destroy(): void {
    this.cancel();
    this.state.items = [];
    this.state.loading = false;
    this.state.loadingMore = false;
    this.state.hasMore = true;
    this.state.error = null;
    this.state.lastUpdated = null;
    this.state.connected = false;
  }
}
