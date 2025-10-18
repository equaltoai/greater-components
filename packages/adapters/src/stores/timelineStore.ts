/**
 * Timeline Store - Reactive state management for timeline data with streaming updates
 * Built for Svelte 5 runes compatibility with fallback support
 */

import type {
  TimelineStore,
  TimelineState,
  TimelineItem,
  TimelineConfig,
  StreamingEdit,
  JsonPatch
} from './types';

// Simple reactive state implementation that works everywhere
class ReactiveState<T> {
  private _value: T;
  private _subscribers = new Set<(value: T) => void>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this._subscribers.forEach(callback => {
      try {
        callback(newValue);
      } catch (error) {
        console.error('Error in reactive state subscriber:', error);
      }
    });
  }

  subscribe(callback: (value: T) => void): () => void {
    this._subscribers.add(callback);
    // Call immediately with current value
    callback(this._value);
    
    return () => {
      this._subscribers.delete(callback);
    };
  }

  update(updater: (current: T) => T): void {
    this.value = updater(this._value);
  }
}

export function createTimelineStore(config: TimelineConfig): TimelineStore {
  // Create reactive state
  const state = new ReactiveState<TimelineState>({
    items: config.initialItems || [],
    visibleItems: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    isStreaming: false,
    lastSync: null,
    virtualWindow: {
      startIndex: 0,
      endIndex: 0,
      itemHeight: config.itemHeight || 50,
      containerHeight: config.containerHeight || 400
    }
  });

  // Initialize computed values
  updateDerivedValues();

  // Transport event handlers
  let streamingUnsubscribers: (() => void)[] = [];
  let updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingUpdates: StreamingEdit[] = [];

  function updateDerivedValues(): void {
    const currentState = state.value;
    
    // Sort items by timestamp (newest first)
    const sortedItems = [...currentState.items].sort((a, b) => b.timestamp - a.timestamp);
    
    // Calculate visible range with overscan
    const { startIndex, endIndex } = currentState.virtualWindow;
    const overscan = config.overscan || 5;
    const start = Math.max(0, startIndex - overscan);
    const end = Math.min(sortedItems.length, endIndex + overscan);
    const visibleItems = sortedItems.slice(start, end);
    
    // Update state with computed values
    state.update(current => ({
      ...current,
      items: sortedItems,
      visibleItems,
      totalCount: sortedItems.length
    }));
  }

  // Debounced update processor
  function processPendingUpdates(): void {
    if (pendingUpdates.length === 0) return;

    const updates = [...pendingUpdates];
    pendingUpdates = [];

    // Group updates by type and item
    const groupedUpdates = new Map<string, StreamingEdit[]>();
    
    for (const update of updates) {
      const key = `${update.type}-${update.itemId}`;
      let group = groupedUpdates.get(key);
      if (!group) {
        group = [];
        groupedUpdates.set(key, group);
      }
      group.push(update);
    }

    // Apply grouped updates
    for (const [, edits] of groupedUpdates) {
      const latestEdit = edits[edits.length - 1]; // Use most recent edit
      if (latestEdit) {
        applyStreamingEditInternal(latestEdit);
      }
    }

    updateDerivedValues();
  }

  function scheduleUpdate(edit: StreamingEdit): void {
    pendingUpdates.push(edit);
    
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
    }
    
    updateDebounceTimer = setTimeout(() => {
      processPendingUpdates();
      updateDebounceTimer = null;
    }, config.updateDebounceMs || 100);
  }

  function applyStreamingEditInternal(edit: StreamingEdit): void {
    state.update(current => {
      const itemIndex = current.items.findIndex(item => item.id === edit.itemId);
      let newItems = [...current.items];

      switch (edit.type) {
        case 'add':
          if (edit.data && itemIndex === -1) {
            const newItem: TimelineItem = {
              id: edit.itemId,
              type: edit.data.type || 'default',
              timestamp: edit.timestamp,
              content: edit.data.content,
              metadata: edit.data.metadata,
              version: edit.data.version,
              isOptimistic: false
            };
            newItems.push(newItem);
          }
          break;

        case 'replace':
          if (edit.data && itemIndex !== -1) {
            const updatedItem: TimelineItem = {
              ...newItems[itemIndex],
              ...edit.data,
              id: edit.itemId, // Preserve ID
              timestamp: edit.timestamp // Update timestamp
            };
            newItems[itemIndex] = updatedItem;
          }
          break;

        case 'delete':
          if (itemIndex !== -1) {
            newItems = newItems.filter(item => item.id !== edit.itemId);
          }
          break;

        case 'patch':
          if (edit.patches && itemIndex !== -1) {
            const item = newItems[itemIndex];
            if (item) {
              const patchedItem = applyPatches(item, edit.patches);
              newItems[itemIndex] = patchedItem;
            }
          }
          break;
      }

      return {
        ...current,
        items: newItems
      };
    });
  }

  function applyPatches(item: TimelineItem, patches: JsonPatch[]): TimelineItem {
    let result = { ...item } as TimelineItemMutable;
    
    for (const patch of patches) {
      result = applyJsonPatch(result, patch);
    }
    
    return result;
  }

  const isJsonObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

  type TimelineItemMutable = TimelineItem & Record<string, unknown>;

  function applyJsonPatch(obj: TimelineItemMutable, patch: JsonPatch): TimelineItemMutable {
    const path = patch.path.split('/').filter(p => p !== '');
    
    switch (patch.op) {
      case 'replace':
      case 'add':
        return setNestedValue(obj, path, patch.value);
      
      case 'remove':
        return removeNestedValue(obj, path);
      
      default:
        console.warn(`Unsupported JSON patch operation: ${patch.op}`);
        return obj;
    }
  }

  function setNestedValue(obj: TimelineItemMutable, path: string[], value: unknown): TimelineItemMutable {
    if (path.length === 0) return value as TimelineItemMutable;
    
    const result = { ...obj } as TimelineItemMutable;
    let current: Record<string, unknown> = result;
    
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!key) {
        continue;
      }

      const existing = current[key];
      if (!isJsonObject(existing)) {
        if (key) {
          current[key] = {};
        }
      } else {
        current[key] = { ...existing };
      }
      if (key) {
        current = current[key] as Record<string, unknown>;
      }
    }
    
    const lastKey = path[path.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
    return result;
  }

  function removeNestedValue(obj: TimelineItemMutable, path: string[]): TimelineItemMutable {
    if (path.length === 0) return obj;
    if (path.length === 1) {
      const result = { ...obj } as TimelineItemMutable;
      const key = path[0];
      if (key) {
        delete result[key];
      }
      return result;
    }
    
    const result = { ...obj } as TimelineItemMutable;
    let current: Record<string, unknown> = result;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!key) {
        continue;
      }

      const existing = current[key];
      if (!isJsonObject(existing)) {
        return result;
      }

      current[key] = { ...existing };
      current = current[key] as Record<string, unknown>;
    }

    const lastKey = path[path.length - 1];
    if (lastKey) {
      delete current[lastKey];
    }
    
    return result;
  }

  // Store methods
  function addItem(itemData: Omit<TimelineItem, 'id' | 'timestamp'>): string {
    const id = generateId();
    const timestamp = Date.now();
    
    const newItem: TimelineItem = {
      ...itemData,
      id,
      timestamp,
      isOptimistic: true
    };
    
    state.update(current => ({
      ...current,
      items: [...current.items, newItem]
    }));
    
    updateDerivedValues();
    
    // Send to server if streaming is active
    if (state.value.isStreaming && config.transportManager) {
      const edit: StreamingEdit = {
        type: 'add',
        itemId: id,
        data: newItem,
        timestamp,
        userId: 'current-user' // This should come from auth context
      };
      
      try {
        config.transportManager.send({
          type: 'timeline_edit',
          data: edit
        });
      } catch (error) {
        // Remove optimistic item on send failure
        state.update(current => ({
          ...current,
          items: current.items.filter(item => item.id !== id),
          error: error as Error
        }));
        updateDerivedValues();
        throw error;
      }
    }
    
    return id;
  }

  function replaceItem(id: string, updates: Partial<TimelineItem>): boolean {
    const currentState = state.value;
    const itemIndex = currentState.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return false;
    
    const timestamp = Date.now();
    const existingItem = currentState.items[itemIndex];
    if (!existingItem) return false;
    
    const updatedItem: TimelineItem = {
      ...existingItem,
      ...updates,
      id, // Preserve ID
      timestamp, // Update timestamp
      type: (updates.type || existingItem.type) as string
    };
    
    const newItems = currentState.items.map((item, index) => 
      index === itemIndex ? updatedItem : item
    );
    
    state.update(current => ({
      ...current,
      items: newItems
    }));
    
    updateDerivedValues();
    
    // Send to server if streaming is active
    if (currentState.isStreaming && config.transportManager) {
      const edit: StreamingEdit = {
        type: 'replace',
        itemId: id,
        data: updatedItem,
        timestamp,
        userId: 'current-user'
      };
      
      try {
        config.transportManager.send({
          type: 'timeline_edit',
          data: edit
        });
      } catch (error) {
        state.update(current => ({
          ...current,
          error: error as Error
        }));
        throw error;
      }
    }
    
    return true;
  }

  function deleteItem(id: string): boolean {
    const currentState = state.value;
    const itemExists = currentState.items.some(item => item.id === id);
    if (!itemExists) return false;
    
    state.update(current => ({
      ...current,
      items: current.items.filter(item => item.id !== id)
    }));
    
    updateDerivedValues();
    
    // Send to server if streaming is active
    if (currentState.isStreaming && config.transportManager) {
      const edit: StreamingEdit = {
        type: 'delete',
        itemId: id,
        timestamp: Date.now(),
        userId: 'current-user'
      };
      
      try {
        config.transportManager.send({
          type: 'timeline_edit',
          data: edit
        });
      } catch (error) {
        state.update(current => ({
          ...current,
          error: error as Error
        }));
        throw error;
      }
    }
    
    return true;
  }

  function applyStreamingEdit(edit: StreamingEdit): void {
    scheduleUpdate(edit);
  }

  function updateVirtualWindow(startIndex: number, endIndex: number): void {
    state.update(current => ({
      ...current,
      virtualWindow: {
        ...current.virtualWindow,
        startIndex,
        endIndex
      }
    }));
    
    updateDerivedValues();
  }

  async function loadMore(): Promise<void> {
    if (state.value.isLoading) return;
    
    state.update(current => ({
      ...current,
      isLoading: true,
      error: null
    }));
    
    try {
      // This would typically make an API call
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would fetch more items
      // state.items = [...state.items, ...newItems];
    } catch (error) {
      state.update(current => ({
        ...current,
        error: error as Error
      }));
      throw error;
    } finally {
      state.update(current => ({
        ...current,
        isLoading: false
      }));
    }
  }

  async function refresh(): Promise<void> {
    if (state.value.isLoading) return;
    
    state.update(current => ({
      ...current,
      isLoading: true,
      error: null
    }));
    
    try {
      // This would typically make an API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      state.update(current => ({
        ...current,
        lastSync: Date.now()
      }));
    } catch (error) {
      state.update(current => ({
        ...current,
        error: error as Error
      }));
      throw error;
    } finally {
      state.update(current => ({
        ...current,
        isLoading: false
      }));
    }
  }

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

  const isTimelineEditPayload = (value: unknown): value is { type: 'timeline_edit'; data: StreamingEdit } =>
    isRecord(value) && value.type === 'timeline_edit' && isRecord(value.data);

  function startStreaming(): void {
    if (state.value.isStreaming || !config.transportManager) return;
    
    state.update(current => ({
      ...current,
      isStreaming: true,
      error: null
    }));
    
    // Subscribe to streaming edits
    const editHandler = config.transportManager?.on('message', (event) => {
      if (isTimelineEditPayload(event.data)) {
        applyStreamingEdit(event.data.data);
      }
    });
    
    
    // Subscribe to connection events
    const errorHandler = config.transportManager?.on('error', (event) => {
      state.update(current => ({
        ...current,
        error: event.error || new Error('Streaming connection error')
      }));
    });
    
    const closeHandler = config.transportManager?.on('close', () => {
      state.update(current => ({
        ...current,
        isStreaming: false
      }));
    });
    
    if (editHandler) streamingUnsubscribers.push(editHandler);
    if (errorHandler) streamingUnsubscribers.push(errorHandler);
    if (closeHandler) streamingUnsubscribers.push(closeHandler);
    
    // Start the transport connection
    try {
      config.transportManager?.connect();
    } catch (error) {
      state.update(current => ({
        ...current,
        error: error as Error,
        isStreaming: false
      }));
    }
  }

  function stopStreaming(): void {
    state.update(current => ({
      ...current,
      isStreaming: false
    }));
    
    // Clean up event subscriptions
    streamingUnsubscribers.forEach(unsubscribe => unsubscribe());
    streamingUnsubscribers = [];
    
    // Clear pending updates
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
      updateDebounceTimer = null;
    }
    pendingUpdates = [];
  }

  function subscribe(callback: (value: TimelineState) => void): () => void {
    return state.subscribe(callback);
  }

  function get(): TimelineState {
    return state.value;
  }

  function destroy(): void {
    stopStreaming();
    
    // Clear all timers
    if (updateDebounceTimer) {
      clearTimeout(updateDebounceTimer);
    }
    
    // Clear state
    state.update(() => ({
      items: [],
      visibleItems: [],
      totalCount: 0,
      isLoading: false,
      error: null,
      isStreaming: false,
      lastSync: null,
      virtualWindow: {
        startIndex: 0,
        endIndex: 0,
        itemHeight: config.itemHeight || 50,
        containerHeight: config.containerHeight || 400
      }
    }));
  }

  function generateId(): string {
    return `timeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Lesser-specific filters and selectors
  function getItemsWithCost(maxCost?: number): TimelineItem[] {
    return state.value.items.filter(item => {
      const cost = item.metadata?.lesser?.estimatedCost;
      if (cost === undefined) return false;
      return maxCost === undefined || cost <= maxCost;
    });
  }

  function getItemsWithTrustScore(minScore: number): TimelineItem[] {
    return state.value.items.filter(item => {
      const score = item.metadata?.lesser?.authorTrustScore;
      return score !== undefined && score >= minScore;
    });
  }

  function getItemsWithCommunityNotes(): TimelineItem[] {
    return state.value.items.filter(item => 
      item.metadata?.lesser?.hasCommunityNotes === true
    );
  }

  function getQuotePosts(): TimelineItem[] {
    return state.value.items.filter(item => 
      item.metadata?.lesser?.isQuote === true
    );
  }

  function getModeratedItems(action?: string): TimelineItem[] {
    return state.value.items.filter(item => {
      const moderationAction = item.metadata?.lesser?.aiModerationAction;
      if (moderationAction === undefined || moderationAction === 'NONE') return false;
      return action === undefined || moderationAction === action;
    });
  }

  return {
    subscribe,
    destroy,
    get,
    addItem,
    replaceItem,
    deleteItem,
    applyStreamingEdit,
    updateVirtualWindow,
    loadMore,
    refresh,
    startStreaming,
    stopStreaming,
    // Lesser-specific methods
    getItemsWithCost,
    getItemsWithTrustScore,
    getItemsWithCommunityNotes,
    getQuotePosts,
    getModeratedItems
  };
}
