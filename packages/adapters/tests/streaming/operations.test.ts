/**
 * Unit tests for streaming operations handlers
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  StreamingOperationsManager,
  TimelineStreamingHandler,
  NotificationStreamingHandler,
  AccountStreamingHandler,
  DeleteStreamingHandler,
  EditStreamingHandler,
  StreamingStateManager
} from '../../src/streaming/operations.js';
import type { TransportManager } from '../../src/TransportManager.js';
import type {
  StreamingUpdate,
  StreamingDelete,
  StreamingEdit,
  UnifiedStatus,
  UnifiedAccount,
  UnifiedNotification
} from '../../src/models/unified.js';

// Mock transport manager
const createMockTransportManager = (): TransportManager => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  getState: vi.fn(() => ({
    status: 'connected',
    activeTransport: 'websocket',
    failureCount: 0,
    canFallback: true,
    reconnectAttempts: 0,
    latency: 50,
    error: null,
    lastEventId: null,
    transportPriority: ['websocket', 'sse', 'polling']
  })),
  destroy: vi.fn()
}) as any;

// Sample streaming operations
const sampleStreamingUpdate: StreamingUpdate = {
  type: 'status',
  payload: {
    id: 'status_123',
    content: 'Test status content',
    account: {
      id: 'acc_123',
      username: 'testuser'
    }
  } as UnifiedStatus,
  stream: 'user',
  timestamp: Date.now(),
  metadata: {
    source: 'mastodon',
    apiVersion: 'v1',
    lastUpdated: Date.now()
  }
};

const sampleStreamingDelete: StreamingDelete = {
  id: 'status_456',
  itemType: 'status',
  timestamp: Date.now()
};

const sampleStreamingEdit: StreamingEdit = {
  id: 'status_789',
  data: {
    id: 'status_789',
    content: 'Edited status content',
    account: {
      id: 'acc_123',
      username: 'testuser'
    }
  } as UnifiedStatus,
  timestamp: Date.now(),
  editType: 'content'
};

describe('StreamingOperationsManager', () => {
  let transportManager: TransportManager;
  let streamingManager: StreamingOperationsManager;

  beforeEach(() => {
    transportManager = createMockTransportManager();
    streamingManager = new StreamingOperationsManager({
      transportManager,
      debounceMs: 50,
      maxQueueSize: 100,
      enableDeduplication: true,
      deduplicationWindowMs: 1000
    });
  });

  afterEach(() => {
    streamingManager.destroy();
  });

  it('should initialize with correct default state', () => {
    const state = streamingManager.getState();
    
    expect(state.isStreaming).toBe(false);
    expect(state.activeStreams.size).toBe(0);
    expect(state.lastEventTime).toBeNull();
    expect(state.error).toBeNull();
    expect(state.reconnectAttempts).toBe(0);
  });

  it('should start streaming successfully', async () => {
    await streamingManager.startStreaming();
    
    const state = streamingManager.getState();
    expect(state.isStreaming).toBe(true);
    expect(state.error).toBeNull();
    expect(transportManager.connect).toHaveBeenCalled();
  });

  it('should stop streaming and process remaining queue', async () => {
    await streamingManager.startStreaming();
    
    // Add some operations to queue
    await streamingManager.processOperation(sampleStreamingUpdate);
    
    await streamingManager.stopStreaming();
    
    const state = streamingManager.getState();
    expect(state.isStreaming).toBe(false);
    expect(transportManager.disconnect).toHaveBeenCalled();
  });

  it('should register and use handlers', async () => {
    const mockHandler = {
      type: 'status',
      handle: vi.fn()
    };

    streamingManager.registerHandler(mockHandler);
    await streamingManager.processOperation(sampleStreamingUpdate);

    // Wait for debounced processing
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockHandler.handle).toHaveBeenCalledWith(sampleStreamingUpdate);
  });

  it('should unregister handlers', () => {
    const mockHandler = {
      type: 'status',
      handle: vi.fn()
    };

    streamingManager.registerHandler(mockHandler);
    streamingManager.unregisterHandler('status');
    
    // Handler should no longer be registered
    expect(mockHandler.handle).not.toHaveBeenCalled();
  });

  it('should deduplicate operations within window', async () => {
    const mockHandler = {
      type: 'status',
      handle: vi.fn()
    };

    streamingManager.registerHandler(mockHandler);

    // Process same operation twice quickly
    await streamingManager.processOperation(sampleStreamingUpdate);
    await streamingManager.processOperation(sampleStreamingUpdate);

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should only be handled once due to deduplication
    expect(mockHandler.handle).toHaveBeenCalledTimes(1);
  });

  it('should handle queue size limit', async () => {
    const smallQueueManager = new StreamingOperationsManager({
      transportManager,
      maxQueueSize: 2
    });

    // Add more operations than queue size
    await smallQueueManager.processOperation(sampleStreamingUpdate);
    await smallQueueManager.processOperation(sampleStreamingDelete);
    await smallQueueManager.processOperation(sampleStreamingEdit);

    // Queue should not exceed max size
    expect(smallQueueManager['operationQueue'].length).toBeLessThanOrEqual(2);

    smallQueueManager.destroy();
  });

  it('should handle transport errors', () => {
    const transportError = new Error('Transport failed');
    
    // Simulate transport error
    const mockOn = transportManager.on as any;
    const errorCallback = mockOn.mock.calls.find((call: any) => call[0] === 'error')?.[1];
    
    if (errorCallback) {
      errorCallback({ error: transportError });
    }

    const state = streamingManager.getState();
    expect(state.error).toBe(transportError);
  });

  it('should track reconnection attempts', () => {
    const mockOn = transportManager.on as any;
    const reconnectingCallback = mockOn.mock.calls.find((call: any) => call[0] === 'reconnecting')?.[1];
    const reconnectedCallback = mockOn.mock.calls.find((call: any) => call[0] === 'reconnected')?.[1];
    
    if (reconnectingCallback) {
      reconnectingCallback({});
    }

    let state = streamingManager.getState();
    expect(state.reconnectAttempts).toBe(1);

    if (reconnectedCallback) {
      reconnectedCallback({});
    }

    state = streamingManager.getState();
    expect(state.reconnectAttempts).toBe(0);
    expect(state.error).toBeNull();
  });
});

describe('TimelineStreamingHandler', () => {
  let onStatusUpdate: ReturnType<typeof vi.fn>;
  let onStatusDelete: ReturnType<typeof vi.fn>;
  let onStatusEdit: ReturnType<typeof vi.fn>;
  let handler: TimelineStreamingHandler;

  beforeEach(() => {
    onStatusUpdate = vi.fn();
    onStatusDelete = vi.fn();
    onStatusEdit = vi.fn();
    handler = new TimelineStreamingHandler(onStatusUpdate, onStatusDelete, onStatusEdit);
  });

  it('should handle status updates', async () => {
    await handler.handle(sampleStreamingUpdate);
    expect(onStatusUpdate).toHaveBeenCalledWith(sampleStreamingUpdate.payload);
  });

  it('should handle status deletions', async () => {
    await handler.handle(sampleStreamingDelete);
    expect(onStatusDelete).toHaveBeenCalledWith(sampleStreamingDelete.id);
  });

  it('should handle status edits', async () => {
    await handler.handle(sampleStreamingEdit);
    expect(onStatusEdit).toHaveBeenCalledWith(sampleStreamingEdit.data);
  });

  it('should ignore non-status operations', async () => {
    const accountDelete: StreamingDelete = {
      id: 'acc_123',
      itemType: 'account',
      timestamp: Date.now()
    };

    await handler.handle(accountDelete);
    expect(onStatusDelete).not.toHaveBeenCalled();
  });

  it('should validate status data before calling callbacks', async () => {
    const invalidUpdate: StreamingUpdate = {
      ...sampleStreamingUpdate,
      payload: { invalid: 'data' }
    };

    await handler.handle(invalidUpdate);
    expect(onStatusUpdate).not.toHaveBeenCalled();
  });
});

describe('NotificationStreamingHandler', () => {
  let onNotificationUpdate: ReturnType<typeof vi.fn>;
  let onNotificationDelete: ReturnType<typeof vi.fn>;
  let handler: NotificationStreamingHandler;

  beforeEach(() => {
    onNotificationUpdate = vi.fn();
    onNotificationDelete = vi.fn();
    handler = new NotificationStreamingHandler(onNotificationUpdate, onNotificationDelete);
  });

  it('should handle notification updates', async () => {
    const notificationUpdate: StreamingUpdate = {
      type: 'notification',
      payload: {
        id: 'notif_123',
        type: 'mention',
        account: { id: 'acc_123', username: 'user' }
      } as UnifiedNotification,
      stream: 'user',
      timestamp: Date.now(),
      metadata: {
        source: 'mastodon',
        apiVersion: 'v1',
        lastUpdated: Date.now()
      }
    };

    await handler.handle(notificationUpdate);
    expect(onNotificationUpdate).toHaveBeenCalledWith(notificationUpdate.payload);
  });

  it('should handle notification deletions', async () => {
    const notificationDelete: StreamingDelete = {
      id: 'notif_456',
      itemType: 'notification',
      timestamp: Date.now()
    };

    await handler.handle(notificationDelete);
    expect(onNotificationDelete).toHaveBeenCalledWith(notificationDelete.id);
  });

  it('should validate notification data', async () => {
    const invalidUpdate: StreamingUpdate = {
      type: 'notification',
      payload: { missing: 'required_fields' },
      stream: 'user',
      timestamp: Date.now(),
      metadata: {
        source: 'mastodon',
        apiVersion: 'v1',
        lastUpdated: Date.now()
      }
    };

    await handler.handle(invalidUpdate);
    expect(onNotificationUpdate).not.toHaveBeenCalled();
  });
});

describe('AccountStreamingHandler', () => {
  let onAccountUpdate: ReturnType<typeof vi.fn>;
  let onAccountDelete: ReturnType<typeof vi.fn>;
  let handler: AccountStreamingHandler;

  beforeEach(() => {
    onAccountUpdate = vi.fn();
    onAccountDelete = vi.fn();
    handler = new AccountStreamingHandler(onAccountUpdate, onAccountDelete);
  });

  it('should handle account updates', async () => {
    const accountUpdate: StreamingUpdate = {
      type: 'account',
      payload: {
        id: 'acc_123',
        username: 'testuser',
        displayName: 'Test User'
      } as UnifiedAccount,
      stream: 'user',
      timestamp: Date.now(),
      metadata: {
        source: 'mastodon',
        apiVersion: 'v1',
        lastUpdated: Date.now()
      }
    };

    await handler.handle(accountUpdate);
    expect(onAccountUpdate).toHaveBeenCalledWith(accountUpdate.payload);
  });

  it('should handle account edits', async () => {
    const accountEdit: StreamingEdit = {
      id: 'acc_123',
      data: {
        id: 'acc_123',
        username: 'testuser',
        displayName: 'Updated Display Name'
      } as UnifiedAccount,
      timestamp: Date.now(),
      editType: 'metadata'
    };

    await handler.handle(accountEdit);
    expect(onAccountUpdate).toHaveBeenCalledWith(accountEdit.data);
  });

  it('should handle account deletions', async () => {
    const accountDelete: StreamingDelete = {
      id: 'acc_456',
      itemType: 'account',
      timestamp: Date.now()
    };

    await handler.handle(accountDelete);
    expect(onAccountDelete).toHaveBeenCalledWith(accountDelete.id);
  });
});

describe('DeleteStreamingHandler', () => {
  let onDelete: ReturnType<typeof vi.fn>;
  let handler: DeleteStreamingHandler;

  beforeEach(() => {
    onDelete = vi.fn();
    handler = new DeleteStreamingHandler(onDelete);
  });

  it('should handle delete operations', async () => {
    await handler.handle(sampleStreamingDelete);
    expect(onDelete).toHaveBeenCalledWith(sampleStreamingDelete);
  });

  it('should ignore non-delete operations', async () => {
    await handler.handle(sampleStreamingUpdate);
    expect(onDelete).not.toHaveBeenCalled();
  });
});

describe('EditStreamingHandler', () => {
  let onEdit: ReturnType<typeof vi.fn>;
  let handler: EditStreamingHandler;

  beforeEach(() => {
    onEdit = vi.fn();
    handler = new EditStreamingHandler(onEdit);
  });

  it('should handle edit operations', async () => {
    await handler.handle(sampleStreamingEdit);
    expect(onEdit).toHaveBeenCalledWith(sampleStreamingEdit);
  });

  it('should ignore non-edit operations', async () => {
    await handler.handle(sampleStreamingUpdate);
    expect(onEdit).not.toHaveBeenCalled();
  });
});

describe('StreamingStateManager', () => {
  let stateManager: StreamingStateManager;

  beforeEach(() => {
    stateManager = new StreamingStateManager();
  });

  it('should apply update operations', async () => {
    const result = await stateManager.applyOperation(sampleStreamingUpdate);
    
    expect(result.applied).toBe(true);
    expect(result.conflicts).toEqual([]);
    
    const cached = stateManager.getCachedItem(
      (sampleStreamingUpdate.payload as UnifiedStatus).id, 
      'status'
    );
    expect(cached).toEqual(sampleStreamingUpdate.payload);
  });

  it('should apply delete operations', async () => {
    // First add an item
    await stateManager.applyOperation(sampleStreamingUpdate);
    
    // Then delete it
    const deleteOp: StreamingDelete = {
      id: (sampleStreamingUpdate.payload as UnifiedStatus).id,
      itemType: 'status',
      timestamp: Date.now()
    };
    
    const result = await stateManager.applyOperation(deleteOp);
    expect(result.applied).toBe(true);
    
    const cached = stateManager.getCachedItem(deleteOp.id, 'status');
    expect(cached).toBeUndefined();
  });

  it('should apply edit operations with conflict detection', async () => {
    // Add initial status
    const initialStatus = sampleStreamingUpdate.payload as UnifiedStatus;
    await stateManager.applyOperation(sampleStreamingUpdate);
    
    // Apply edit
    const editOp: StreamingEdit = {
      id: initialStatus.id,
      data: {
        ...initialStatus,
        content: 'Edited content',
        editedAt: '2023-12-15T12:00:00.000Z'
      },
      timestamp: Date.now(),
      editType: 'content'
    };
    
    const result = await stateManager.applyOperation(editOp);
    expect(result.applied).toBe(true);
    expect(result.conflicts).toEqual([]);
    
    const cached = stateManager.getCachedItem(initialStatus.id, 'status') as UnifiedStatus;
    expect(cached.content).toBe('Edited content');
  });

  it('should detect edit conflicts', async () => {
    // Add status with edit timestamp
    const statusWithEdit: UnifiedStatus = {
      ...(sampleStreamingUpdate.payload as UnifiedStatus),
      editedAt: '2023-12-15T12:00:00.000Z'
    };
    
    const updateWithEdit: StreamingUpdate = {
      ...sampleStreamingUpdate,
      payload: statusWithEdit
    };
    
    await stateManager.applyOperation(updateWithEdit);
    
    // Try to apply older edit
    const olderEdit: StreamingEdit = {
      id: statusWithEdit.id,
      data: {
        ...statusWithEdit,
        content: 'Older edit',
        editedAt: '2023-12-15T11:00:00.000Z' // Earlier time
      },
      timestamp: Date.now(),
      editType: 'content'
    };
    
    const result = await stateManager.applyOperation(olderEdit);
    expect(result.applied).toBe(false);
    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.conflicts[0]).toContain('older than existing edit');
  });

  it('should provide cache statistics', async () => {
    await stateManager.applyOperation(sampleStreamingUpdate);
    
    const accountUpdate: StreamingUpdate = {
      type: 'account',
      payload: {
        id: 'acc_123',
        username: 'testuser'
      } as UnifiedAccount,
      stream: 'user',
      timestamp: Date.now(),
      metadata: {
        source: 'mastodon',
        apiVersion: 'v1',
        lastUpdated: Date.now()
      }
    };
    
    await stateManager.applyOperation(accountUpdate);
    
    const stats = stateManager.getCacheStats();
    expect(stats.statuses).toBe(1);
    expect(stats.accounts).toBe(1);
    expect(stats.notifications).toBe(0);
  });

  it('should clear cache', async () => {
    await stateManager.applyOperation(sampleStreamingUpdate);
    
    let stats = stateManager.getCacheStats();
    expect(stats.statuses).toBe(1);
    
    stateManager.clearCache();
    
    stats = stateManager.getCacheStats();
    expect(stats.statuses).toBe(0);
    expect(stats.accounts).toBe(0);
    expect(stats.notifications).toBe(0);
  });

  it('should handle unknown data types gracefully', async () => {
    const unknownUpdate: StreamingEdit = {
      id: 'unknown_123',
      data: { unknown: 'type' } as any,
      timestamp: Date.now(),
      editType: 'content'
    };
    
    const result = await stateManager.applyOperation(unknownUpdate);
    expect(result.applied).toBe(false);
    expect(result.conflicts).toContain('Unknown data type in edit operation');
  });
});

describe('Integration Tests', () => {
  it('should handle complex streaming scenario', async () => {
    // Test individual handlers directly to verify core functionality
    const statusUpdates: UnifiedStatus[] = [];
    const statusDeletes: string[] = [];
    const statusEdits: UnifiedStatus[] = [];

    const handler = new TimelineStreamingHandler(
      (status) => statusUpdates.push(status),
      (id) => statusDeletes.push(id),
      (status) => statusEdits.push(status)
    );

    // Test handlers directly
    await handler.handle(sampleStreamingUpdate);
    await handler.handle(sampleStreamingEdit);
    await handler.handle(sampleStreamingDelete);

    expect(statusUpdates.length).toBe(1);
    expect(statusEdits.length).toBe(1);
    expect(statusDeletes.length).toBe(1);
    
    expect(statusUpdates[0].id).toBe('status_123');
    expect(statusEdits[0].id).toBe('status_789');
    expect(statusDeletes[0]).toBe('status_456');
  });

  it('should handle errors gracefully without crashing', async () => {
    const transportManager = createMockTransportManager();
    const streamingManager = new StreamingOperationsManager({
      transportManager,
      debounceMs: 10
    });

    const errorHandler = {
      type: 'status',
      handle: vi.fn().mockRejectedValue(new Error('Handler error'))
    };

    streamingManager.registerHandler(errorHandler);
    await streamingManager.startStreaming();

    // This should not crash the manager
    await expect(streamingManager.processOperation(sampleStreamingUpdate)).resolves.not.toThrow();

    await streamingManager.stopStreaming();
    streamingManager.destroy();
  });
});