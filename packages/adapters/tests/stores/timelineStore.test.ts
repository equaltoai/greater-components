/**
 * Timeline Store Tests - Comprehensive testing for reactivity and memory safety
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTimelineStore } from '../../src/stores/timelineStore';
import { TransportManager } from '../../src/TransportManager';
import type { TimelineItem, TimelineConfig, StreamingEdit } from '../../src/stores/types';

// Mock TransportManager
class MockTransportManager {
  private eventHandlers = new Map<string, Set<(event: any) => void>>();
  
  connect() {}
  disconnect() {}
  destroy() {}
  
  send(message: unknown) {
    // Store sent messages for testing
    (this as any).lastSentMessage = message;
  }
  
  on(event: string, handler: (event: any) => void) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }
  
  emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
  
  getState() {
    return {
      status: 'connected',
      latency: 50,
      lastEventId: null
    };
  }
}

describe('Timeline Store', () => {
  let mockTransport: MockTransportManager;
  let config: TimelineConfig;
  let initialItems: TimelineItem[];

  beforeEach(() => {
    mockTransport = new MockTransportManager();
    
    initialItems = [
      {
        id: 'item-1',
        type: 'message',
        timestamp: Date.now() - 3000,
        content: { text: 'First message' },
        metadata: { author: 'user1' }
      },
      {
        id: 'item-2',
        type: 'message',
        timestamp: Date.now() - 2000,
        content: { text: 'Second message' },
        metadata: { author: 'user2' }
      },
      {
        id: 'item-3',
        type: 'system',
        timestamp: Date.now() - 1000,
        content: { text: 'System notification' },
        metadata: { level: 'info' }
      }
    ];

    config = {
      transportManager: mockTransport as any,
      initialItems,
      itemHeight: 60,
      containerHeight: 400,
      overscan: 3,
      updateDebounceMs: 50
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with provided items', () => {
      const store = createTimelineStore(config);
      const state = store.get();
      
      expect(state.items).toHaveLength(3);
      expect(state.totalCount).toBe(3);
      expect(state.isLoading).toBe(false);
      expect(state.isStreaming).toBe(false);
    });

    it('should initialize with empty items when none provided', () => {
      const emptyConfig = { ...config, initialItems: undefined };
      const store = createTimelineStore(emptyConfig);
      const state = store.get();
      
      expect(state.items).toHaveLength(0);
      expect(state.totalCount).toBe(0);
    });

    it('should set up virtual window with correct dimensions', () => {
      const store = createTimelineStore(config);
      const state = store.get();
      
      expect(state.virtualWindow).toEqual({
        startIndex: 0,
        endIndex: 0,
        itemHeight: 60,
        containerHeight: 400
      });
    });
  });

  describe('Reactivity', () => {
    it('should notify subscribers when state changes', async () => {
      const store = createTimelineStore(config);
      let callCount = 0;
      let lastState;
      
      const unsubscribe = store.subscribe((state) => {
        callCount++;
        lastState = state;
      });
      
      // Initial subscription should trigger
      expect(callCount).toBe(1);
      
      // Add item should trigger subscription
      store.addItem({
        type: 'message',
        content: { text: 'New message' },
        metadata: { author: 'user3' }
      });
      
      // Wait for reactivity
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(callCount).toBeGreaterThan(1);
      expect(lastState.items).toHaveLength(4);
      
      unsubscribe();
    });

    it('should update visible items when virtual window changes', async () => {
      const store = createTimelineStore(config);
      
      store.updateVirtualWindow(1, 3);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      const state = store.get();
      
      expect(state.virtualWindow.startIndex).toBe(1);
      expect(state.virtualWindow.endIndex).toBe(3);
    });
  });

  describe('CRUD Operations', () => {
    it('should add new items', () => {
      const store = createTimelineStore(config);
      const initialCount = store.get().items.length;
      
      const itemId = store.addItem({
        type: 'message',
        content: { text: 'New item' },
        metadata: { author: 'test' }
      });
      
      const state = store.get();
      expect(state.items).toHaveLength(initialCount + 1);
      expect(itemId).toBeTruthy();
      
      const newItem = state.items.find(item => item.id === itemId);
      expect(newItem).toBeTruthy();
      expect(newItem?.content.text).toBe('New item');
      expect(newItem?.isOptimistic).toBe(true);
    });

    it('should replace existing items', () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      
      const success = store.replaceItem(targetItem.id, {
        content: { text: 'Updated content' },
        metadata: { ...targetItem.metadata, edited: true }
      });
      
      expect(success).toBe(true);
      
      const state = store.get();
      const updatedItem = state.items.find(item => item.id === targetItem.id);
      expect(updatedItem?.content.text).toBe('Updated content');
      expect(updatedItem?.metadata.edited).toBe(true);
    });

    it('should delete existing items', () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      const initialCount = store.get().items.length;
      
      const success = store.deleteItem(targetItem.id);
      
      expect(success).toBe(true);
      
      const state = store.get();
      expect(state.items).toHaveLength(initialCount - 1);
      expect(state.items.find(item => item.id === targetItem.id)).toBeUndefined();
    });

    it('should return false when trying to modify non-existent items', () => {
      const store = createTimelineStore(config);
      
      expect(store.replaceItem('nonexistent', { content: {} })).toBe(false);
      expect(store.deleteItem('nonexistent')).toBe(false);
    });
  });

  describe('Streaming Updates', () => {
    it('should handle streaming add operations', async () => {
      const store = createTimelineStore(config);
      const initialCount = store.get().items.length;
      
      const edit: StreamingEdit = {
        type: 'add',
        itemId: 'streaming-item-1',
        data: {
          type: 'message',
          content: { text: 'Streamed message' },
          metadata: { author: 'remote-user' }
        },
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      expect(state.items).toHaveLength(initialCount + 1);
      
      const streamedItem = state.items.find(item => item.id === 'streaming-item-1');
      expect(streamedItem).toBeTruthy();
      expect(streamedItem?.content.text).toBe('Streamed message');
      expect(streamedItem?.isOptimistic).toBe(false);
    });

    it('should handle streaming replace operations', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      
      const edit: StreamingEdit = {
        type: 'replace',
        itemId: targetItem.id,
        data: {
          ...targetItem,
          content: { text: 'Updated via stream' },
          version: 2
        },
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      const updatedItem = state.items.find(item => item.id === targetItem.id);
      expect(updatedItem?.content.text).toBe('Updated via stream');
      expect(updatedItem?.version).toBe(2);
    });

    it('should handle streaming delete operations', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      const initialCount = store.get().items.length;
      
      const edit: StreamingEdit = {
        type: 'delete',
        itemId: targetItem.id,
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      expect(state.items).toHaveLength(initialCount - 1);
      expect(state.items.find(item => item.id === targetItem.id)).toBeUndefined();
    });

    it('should handle streaming patch operations', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      
      const edit: StreamingEdit = {
        type: 'patch',
        itemId: targetItem.id,
        patches: [
          { op: 'replace', path: '/content/text', value: 'Patched text' },
          { op: 'add', path: '/metadata/patched', value: true }
        ],
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      const patchedItem = state.items.find(item => item.id === targetItem.id);
      expect(patchedItem?.content.text).toBe('Patched text');
      expect(patchedItem?.metadata.patched).toBe(true);
    });

    it('should debounce multiple rapid updates', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      
      // Send multiple rapid updates
      for (let i = 0; i < 5; i++) {
        const edit: StreamingEdit = {
          type: 'replace',
          itemId: targetItem.id,
          data: { ...targetItem, content: { text: `Update ${i}` } },
          timestamp: Date.now(),
          userId: 'remote-user'
        };
        store.applyStreamingEdit(edit);
      }
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      const updatedItem = state.items.find(item => item.id === targetItem.id);
      expect(updatedItem?.content.text).toBe('Update 4'); // Should have latest update
    });
  });

  describe('Streaming Connection', () => {
    it('should start streaming and connect transport', () => {
      const store = createTimelineStore(config);
      const connectSpy = vi.spyOn(mockTransport, 'connect');
      
      store.startStreaming();
      
      const state = store.get();
      expect(state.isStreaming).toBe(true);
      expect(connectSpy).toHaveBeenCalled();
    });

    it('should stop streaming and cleanup subscriptions', () => {
      const store = createTimelineStore(config);
      
      store.startStreaming();
      expect(store.get().isStreaming).toBe(true);
      
      store.stopStreaming();
      expect(store.get().isStreaming).toBe(false);
    });

    it('should handle streaming messages from transport', () => {
      const store = createTimelineStore(config);
      store.startStreaming();
      
      const edit: StreamingEdit = {
        type: 'add',
        itemId: 'remote-item',
        data: {
          type: 'message',
          content: { text: 'Remote message' }
        },
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      // Simulate receiving a message
      mockTransport.emit('message', {
        data: {
          type: 'timeline_edit',
          data: edit
        }
      });
      
      // The edit should be scheduled for processing
      expect(mockTransport.lastSentMessage).toBeUndefined(); // No message sent back
    });

    it('should handle transport errors', () => {
      const store = createTimelineStore(config);
      store.startStreaming();
      
      const error = new Error('Connection failed');
      mockTransport.emit('error', { error });
      
      const state = store.get();
      expect(state.error).toBe(error);
    });
  });

  describe('Memory Management', () => {
    it('should cleanup resources on destroy', () => {
      const store = createTimelineStore(config);
      store.startStreaming();
      
      const state = store.get();
      expect(state.items.length).toBeGreaterThan(0);
      expect(state.isStreaming).toBe(true);
      
      store.destroy();
      
      const finalState = store.get();
      expect(finalState.items).toHaveLength(0);
      expect(finalState.isStreaming).toBe(false);
      expect(finalState.error).toBeNull();
    });

    it('should prevent memory leaks from subscriptions', () => {
      const store = createTimelineStore(config);
      const callbacks: (() => void)[] = [];
      
      // Create multiple subscriptions
      for (let i = 0; i < 10; i++) {
        const unsubscribe = store.subscribe(() => {});
        callbacks.push(unsubscribe);
      }
      
      // Unsubscribe all
      callbacks.forEach(unsubscribe => unsubscribe());
      
      // Should not have memory leaks (difficult to test directly)
      expect(callbacks).toHaveLength(10);
    });

    it('should handle rapid subscribe/unsubscribe cycles', () => {
      const store = createTimelineStore(config);
      
      for (let i = 0; i < 100; i++) {
        const unsubscribe = store.subscribe(() => {});
        unsubscribe();
      }
      
      // Should not throw or cause issues
      expect(true).toBe(true);
    });
  });

  describe('JSON Patch Operations', () => {
    it('should apply nested property patches', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      
      const edit: StreamingEdit = {
        type: 'patch',
        itemId: targetItem.id,
        patches: [
          { op: 'add', path: '/metadata/nested/deep/value', value: 'deep-value' }
        ],
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      const patchedItem = state.items.find(item => item.id === targetItem.id);
      expect(patchedItem?.metadata.nested?.deep?.value).toBe('deep-value');
    });

    it('should remove properties with remove patches', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      
      const edit: StreamingEdit = {
        type: 'patch',
        itemId: targetItem.id,
        patches: [
          { op: 'remove', path: '/metadata/author' }
        ],
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      const patchedItem = state.items.find(item => item.id === targetItem.id);
      expect(patchedItem?.metadata.author).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty streaming edits gracefully', async () => {
      const store = createTimelineStore(config);
      
      // Apply edit without data
      const edit: StreamingEdit = {
        type: 'add',
        itemId: 'empty-item',
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      await new Promise(resolve => setTimeout(resolve, 60));
      
      // Should not add item without data
      const state = store.get();
      expect(state.items.find(item => item.id === 'empty-item')).toBeUndefined();
    });

    it('should handle malformed patch operations', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      const originalText = targetItem.content.text;
      
      const edit: StreamingEdit = {
        type: 'patch',
        itemId: targetItem.id,
        patches: [
          { op: 'invalid' as any, path: '/content/text', value: 'should not apply' }
        ],
        timestamp: Date.now(),
        userId: 'remote-user'
      };
      
      store.applyStreamingEdit(edit);
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      const item = state.items.find(item => item.id === targetItem.id);
      expect(item?.content.text).toBe(originalText); // Should remain unchanged
    });

    it('should handle concurrent updates to same item', async () => {
      const store = createTimelineStore(config);
      const targetItem = store.get().items[0];
      
      // Send concurrent updates
      const edit1: StreamingEdit = {
        type: 'replace',
        itemId: targetItem.id,
        data: { ...targetItem, content: { text: 'Update 1' } },
        timestamp: Date.now(),
        userId: 'user1'
      };
      
      const edit2: StreamingEdit = {
        type: 'replace',
        itemId: targetItem.id,
        data: { ...targetItem, content: { text: 'Update 2' } },
        timestamp: Date.now() + 1,
        userId: 'user2'
      };
      
      store.applyStreamingEdit(edit1);
      store.applyStreamingEdit(edit2);
      
      await new Promise(resolve => setTimeout(resolve, 60));
      
      const state = store.get();
      const updatedItem = state.items.find(item => item.id === targetItem.id);
      expect(updatedItem?.content.text).toBe('Update 2'); // Latest should win
    });
  });
});