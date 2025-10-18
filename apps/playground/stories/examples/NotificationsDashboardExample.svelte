<script lang="ts">
  import { onMount } from 'svelte';
  import { action } from '@storybook/addon-actions';
  import {
    NotificationsFeedReactive,
    NotificationItem,
    RealtimeWrapper,
    TransportManager,
    MockTransport,
    MastodonTransport,
    createNotificationStore,
    groupNotifications,
    type Notification,
    type NotificationGroup,
    type Transport
  } from '@greater-components/fediverse';

  interface Props {
    useMockData?: boolean;
    instanceUrl?: string;
    enableStreaming?: boolean;
    groupingMode?: 'none' | 'type' | 'account' | 'time';
    showFilters?: boolean;
    autoMarkAsRead?: boolean;
    showStats?: boolean;
  }

  let {
    useMockData = true,
    instanceUrl = 'https://mastodon.social',
    enableStreaming = true,
    groupingMode = 'type',
    showFilters = true,
    autoMarkAsRead = false,
    showStats = true
  }: Props = $props();

  let transport = $state<Transport | null>(null);
  let notificationStore = $state(createNotificationStore());
  let groupedNotifications = $state<NotificationGroup[]>([]);
  let activeFilters = $state<Set<string>>(new Set());
  let streamingActive = $state(false);
  let unreadCount = $state(0);
  let stats = $state({
    total: 0,
    unread: 0,
    mentions: 0,
    follows: 0,
    favourites: 0,
    reblogs: 0,
    polls: 0
  });

  const logNotificationInteraction = action('notification/interaction');

  const statEntries = $derived<[string, number][]>(() => Object.entries(stats).slice(2) as [string, number][]);
  const maxStatValue = $derived(() => {
    const values = statEntries.map(([, value]) => value);
    return values.length ? Math.max(...values) : 1;
  });

  const notificationTypes = [
    { id: 'mention', label: 'Mentions', icon: '@', color: 'primary' },
    { id: 'follow', label: 'Follows', icon: '👤', color: 'success' },
    { id: 'favourite', label: 'Favourites', icon: '⭐', color: 'warning' },
    { id: 'reblog', label: 'Reblogs', icon: '🔄', color: 'info' },
    { id: 'poll', label: 'Polls', icon: '📊', color: 'secondary' },
    { id: 'follow_request', label: 'Follow Requests', icon: '✋', color: 'error' }
  ];

  onMount(() => {
    initializeTransport();

    return () => {
      if (transport) {
        TransportManager.disconnect();
      }
    };
  });

  async function initializeTransport() {
    try {
      if (useMockData) {
        transport = new MockTransport();
        await TransportManager.initialize(transport);
      } else {
        const token = localStorage.getItem('mastodon_token') || '';
        if (token) {
          transport = new MastodonTransport(instanceUrl, token);
          await TransportManager.initialize(transport);
        } else {
          transport = new MockTransport();
          await TransportManager.initialize(transport);
        }
      }

      loadNotifications();

      if (enableStreaming) {
        startStreaming();
      }
    } catch (error) {
      console.error('Failed to initialize transport:', error);
    }
  }

  async function loadNotifications() {
    if (!transport) return;

    try {
      const notifications = await transport.getNotifications({ limit: 30 });
      notificationStore.setNotifications(notifications);
      updateGroupedNotifications();
      updateStats();
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  async function startStreaming() {
    if (!transport || !enableStreaming) return;

    try {
      await transport.streamNotifications((notification: Notification) => {
        notificationStore.addNotification(notification);
        updateGroupedNotifications();
        updateStats();

        // Show browser notification for mentions
        if (notification.type === 'mention' && 'Notification' in window) {
          showBrowserNotification(notification);
        }
      });
      streamingActive = true;
    } catch (error) {
      console.error('Streaming failed:', error);
    }
  }

  function updateGroupedNotifications() {
    const filtered = activeFilters.size > 0
      ? $notificationStore.notifications.filter(n => activeFilters.has(n.type))
      : $notificationStore.notifications;

    if (groupingMode === 'none') {
      groupedNotifications = filtered.map(n => ({
        id: n.id,
        type: 'single',
        notifications: [n]
      }));
    } else {
      groupedNotifications = groupNotifications(filtered, groupingMode);
    }

    unreadCount = filtered.filter(n => !n.read).length;
  }

  function updateStats() {
    const notifications = $notificationStore.notifications;
    stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      mentions: notifications.filter(n => n.type === 'mention').length,
      follows: notifications.filter(n => n.type === 'follow').length,
      favourites: notifications.filter(n => n.type === 'favourite').length,
      reblogs: notifications.filter(n => n.type === 'reblog').length,
      polls: notifications.filter(n => n.type === 'poll').length
    };
  }

  async function markAsRead(notificationId: string) {
    if (!transport) return;

    try {
      await transport.dismissNotification(notificationId);
      notificationStore.markAsRead(notificationId);
      updateGroupedNotifications();
      updateStats();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }

  async function markAllAsRead() {
    if (!transport) return;

    try {
      await transport.clearNotifications();
      notificationStore.markAllAsRead();
      updateGroupedNotifications();
      updateStats();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }

  function toggleFilter(type: string) {
    if (activeFilters.has(type)) {
      activeFilters.delete(type);
    } else {
      activeFilters.add(type);
    }
    activeFilters = new Set(activeFilters); // Trigger reactivity
    updateGroupedNotifications();
  }

  function clearFilters() {
    activeFilters = new Set();
    updateGroupedNotifications();
  }

  async function showBrowserNotification(notification: Notification) {
    if (Notification.permission === 'granted') {
      const n = new Notification(`New ${notification.type}`, {
        body: notification.account.display_name || notification.account.username,
        icon: notification.account.avatar,
        tag: notification.id
      });

      n.onclick = () => {
        window.focus();
        markAsRead(notification.id);
      };
    }
  }

  async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  $effect(() => {
    updateGroupedNotifications();
  });

  $effect(() => {
    if (autoMarkAsRead && groupedNotifications.length > 0) {
      // Mark visible notifications as read after a delay
      const timer = setTimeout(() => {
        groupedNotifications.forEach(group => {
          group.notifications.forEach(n => {
            if (!n.read) {
              markAsRead(n.id);
            }
          });
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  });
</script>

<div class="notifications-dashboard">
  <!-- Header -->
  <header class="dashboard-header">
    <div class="header-main">
      <h1>Notifications</h1>
      {#if unreadCount > 0}
        <span class="unread-badge">{unreadCount}</span>
      {/if}
    </div>

    <div class="header-actions">
      {#if enableStreaming}
        <button 
          onclick={() => streamingActive ? (streamingActive = false) : startStreaming()}
          class="stream-toggle"
          class:active={streamingActive}
        >
          {streamingActive ? 'Streaming' : 'Start Stream'}
        </button>
      {/if}

      <button onclick={markAllAsRead} class="mark-all-read">
        Mark All Read
      </button>

      <button onclick={loadNotifications} class="refresh-button">
        Refresh
      </button>

      <button onclick={requestNotificationPermission} class="permission-button">
        Enable Alerts
      </button>
    </div>
  </header>

  <!-- Filters -->
  {#if showFilters}
    <div class="filters-bar">
      <div class="filter-chips">
        {#each notificationTypes as type (type.id)}
          <button
            class="filter-chip"
            class:active={activeFilters.has(type.id)}
            onclick={() => toggleFilter(type.id)}
          >
            <span class="chip-icon">{type.icon}</span>
            <span class="chip-label">{type.label}</span>
            {#if activeFilters.has(type.id)}
              <span class="chip-count">
                {$notificationStore.notifications.filter(n => n.type === type.id).length}
              </span>
            {/if}
          </button>
        {/each}
      </div>

      {#if activeFilters.size > 0}
        <button onclick={clearFilters} class="clear-filters">
          Clear Filters
        </button>
      {/if}
    </div>
  {/if}

  <!-- Main Content -->
  <div class="dashboard-content">
    <!-- Notifications Feed -->
    <main class="notifications-feed">
      {#if groupingMode !== 'none'}
        <div class="grouping-header">
          Grouped by: <strong>{groupingMode}</strong>
        </div>
      {/if}

      <RealtimeWrapper enabled={enableStreaming && streamingActive}>
        {#if groupingMode === 'none'}
          <NotificationsFeedReactive
            notifications={groupedNotifications.map(g => g.notifications[0])}
            loading={$notificationStore.loading}
            error={$notificationStore.error}
            on:markAsRead={(e) => markAsRead(e.detail.id)}
            on:interact={(e) => logNotificationInteraction(e.detail)}
          />
        {:else}
          <div class="grouped-notifications">
            {#each groupedNotifications as group (group.id)}
              <div class="notification-group">
                <div class="group-header">
                  {#if groupingMode === 'type'}
                    <span class="group-title">
                      {notificationTypes.find(t => t.id === group.notifications[0].type)?.label || group.notifications[0].type}
                    </span>
                  {:else if groupingMode === 'account'}
                    <span class="group-title">
                      {group.notifications[0].account.display_name || group.notifications[0].account.username}
                    </span>
                  {:else if groupingMode === 'time'}
                    <span class="group-title">{group.id}</span>
                  {/if}
                  <span class="group-count">{group.notifications.length}</span>
                </div>

                <div class="group-items">
                  {#each group.notifications as notification (notification.id)}
                    <NotificationItem
                      {notification}
                      on:markAsRead={() => markAsRead(notification.id)}
                      on:interact={(e) => logNotificationInteraction(e.detail)}
                    />
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </RealtimeWrapper>

      {#if $notificationStore.loading}
        <div class="loading-state">
          Loading notifications...
        </div>
      {/if}

      {#if $notificationStore.error}
        <div class="error-state">
          Error: {$notificationStore.error}
        </div>
      {/if}

      {#if !$notificationStore.loading && groupedNotifications.length === 0}
        <div class="empty-state">
          <p>No notifications to show</p>
          {#if activeFilters.size > 0}
            <button onclick={clearFilters}>Clear filters to see all</button>
          {/if}
        </div>
      {/if}
    </main>

    <!-- Stats Panel -->
    {#if showStats}
      <aside class="stats-panel">
        <h3>Statistics</h3>
        
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-value">{stats.total}</span>
            <span class="stat-label">Total</span>
          </div>
          
          <div class="stat-item highlight">
            <span class="stat-value">{stats.unread}</span>
            <span class="stat-label">Unread</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-value">{stats.mentions}</span>
            <span class="stat-label">Mentions</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-value">{stats.follows}</span>
            <span class="stat-label">Follows</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-value">{stats.favourites}</span>
            <span class="stat-label">Favourites</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-value">{stats.reblogs}</span>
            <span class="stat-label">Reblogs</span>
          </div>
        </div>

        <div class="chart-container">
          <!-- Simple bar chart visualization -->
          <div class="mini-chart">
            {#each statEntries as [key, value] (key)}
              <div 
                class="chart-bar"
                style="height: {(value / maxStatValue) * 100}%"
                title="{key}: {value}"
              ></div>
            {/each}
          </div>
        </div>
      </aside>
    {/if}
  </div>
</div>

<style>
  .notifications-dashboard {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--gc-color-surface-100);
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-bottom: 1px solid var(--gc-color-border-subtle);
  }

  .header-main {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-sm);
  }

  .header-main h1 {
    margin: 0;
    font-size: var(--gc-font-size-lg);
    color: var(--gc-color-text-primary);
  }

  .unread-badge {
    padding: 2px 8px;
    background: var(--gc-color-error-500);
    color: white;
    border-radius: var(--gc-radius-full);
    font-size: var(--gc-font-size-xs);
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: var(--gc-spacing-sm);
  }

  .stream-toggle,
  .mark-all-read,
  .refresh-button,
  .permission-button {
    padding: var(--gc-spacing-xs) var(--gc-spacing-md);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
    color: var(--gc-color-text-primary);
    cursor: pointer;
    transition: all 0.2s;
    font-size: var(--gc-font-size-sm);
  }

  .stream-toggle.active {
    background: var(--gc-color-success-100);
    color: var(--gc-color-success-700);
    border-color: var(--gc-color-success-300);
  }

  .mark-all-read:hover {
    background: var(--gc-color-primary-100);
  }

  .filters-bar {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-bottom: 1px solid var(--gc-color-border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filter-chips {
    display: flex;
    gap: var(--gc-spacing-xs);
    flex-wrap: wrap;
  }

  .filter-chip {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-xs);
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-full);
    background: var(--gc-color-surface-100);
    cursor: pointer;
    transition: all 0.2s;
    font-size: var(--gc-font-size-sm);
  }

  .filter-chip.active {
    background: var(--gc-color-primary-100);
    border-color: var(--gc-color-primary-300);
    color: var(--gc-color-primary-700);
  }

  .chip-icon {
    font-size: var(--gc-font-size-md);
  }

  .chip-count {
    padding: 0 4px;
    background: var(--gc-color-primary-500);
    color: white;
    border-radius: var(--gc-radius-full);
    font-size: var(--gc-font-size-xs);
    min-width: 20px;
    text-align: center;
  }

  .clear-filters {
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    background: transparent;
    color: var(--gc-color-error-600);
    border: none;
    cursor: pointer;
    font-size: var(--gc-font-size-sm);
  }

  .dashboard-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .notifications-feed {
    flex: 1;
    overflow-y: auto;
    padding: var(--gc-spacing-md);
  }

  .grouping-header {
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-primary-100);
    color: var(--gc-color-primary-700);
    border-radius: var(--gc-radius-sm);
    margin-bottom: var(--gc-spacing-md);
    font-size: var(--gc-font-size-sm);
  }

  .notification-group {
    margin-bottom: var(--gc-spacing-lg);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-md);
    overflow: hidden;
  }

  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gc-spacing-sm) var(--gc-spacing-md);
    background: var(--gc-color-surface-300);
    border-bottom: 1px solid var(--gc-color-border-subtle);
  }

  .group-title {
    font-weight: 600;
    color: var(--gc-color-text-primary);
  }

  .group-count {
    padding: 2px 8px;
    background: var(--gc-color-surface-400);
    border-radius: var(--gc-radius-full);
    font-size: var(--gc-font-size-xs);
    color: var(--gc-color-text-secondary);
  }

  .group-items {
    padding: var(--gc-spacing-sm);
  }

  .stats-panel {
    width: 300px;
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-left: 1px solid var(--gc-color-border-subtle);
  }

  .stats-panel h3 {
    margin: 0 0 var(--gc-spacing-md) 0;
    font-size: var(--gc-font-size-md);
    color: var(--gc-color-text-primary);
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gc-spacing-md);
    margin-bottom: var(--gc-spacing-lg);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-surface-100);
    border-radius: var(--gc-radius-sm);
  }

  .stat-item.highlight {
    background: var(--gc-color-error-100);
    color: var(--gc-color-error-700);
  }

  .stat-value {
    font-size: var(--gc-font-size-xl);
    font-weight: 700;
  }

  .stat-label {
    font-size: var(--gc-font-size-xs);
    color: var(--gc-color-text-secondary);
    text-transform: uppercase;
  }

  .chart-container {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-100);
    border-radius: var(--gc-radius-sm);
  }

  .mini-chart {
    display: flex;
    align-items: flex-end;
    height: 100px;
    gap: var(--gc-spacing-xs);
  }

  .chart-bar {
    flex: 1;
    background: var(--gc-color-primary-400);
    border-radius: var(--gc-radius-xs) var(--gc-radius-xs) 0 0;
    transition: all 0.3s;
    min-height: 4px;
  }

  .chart-bar:hover {
    background: var(--gc-color-primary-500);
  }

  .loading-state,
  .error-state,
  .empty-state {
    padding: var(--gc-spacing-xl);
    text-align: center;
    color: var(--gc-color-text-secondary);
  }

  .error-state {
    color: var(--gc-color-error-600);
  }

  .empty-state button {
    margin-top: var(--gc-spacing-md);
    padding: var(--gc-spacing-xs) var(--gc-spacing-md);
    background: var(--gc-color-primary-500);
    color: white;
    border: none;
    border-radius: var(--gc-radius-sm);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .dashboard-content {
      flex-direction: column;
    }

    .stats-panel {
      width: 100%;
      border-left: none;
      border-top: 1px solid var(--gc-color-border-subtle);
    }

    .header-actions {
      flex-wrap: wrap;
    }

    .filter-chips {
      width: 100%;
    }
  }
</style>
