<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    ComposeBox, 
    TimelineVirtualized,
    ProfileHeader,
    RealtimeWrapper,
    TransportManager,
    MockTransport,
    MastodonTransport,
    createTimelineStore,
    type Status,
    type Transport
  } from '@greater-components/fediverse';
  
  interface Props {
    useMockData?: boolean;
    instanceUrl?: string;
    enableStreaming?: boolean;
    virtualizeTimeline?: boolean;
    showProfileSwitcher?: boolean;
    debugMode?: boolean;
  }

  let {
    useMockData = true,
    instanceUrl = 'https://mastodon.social',
    enableStreaming = true,
    virtualizeTimeline = true,
    showProfileSwitcher = true,
    debugMode = false
  }: Props = $props();

  let transport = $state<Transport | null>(null);
  let timelineStore = $state(createTimelineStore());
  let connectionStatus = $state<'connecting' | 'connected' | 'disconnected'>('disconnected');
  let debugEvents = $state<Array<{ time: string; type: string; data: any }>>([]);
  let selectedProfile = $state<string>('default');
  let isComposing = $state(false);
  let streamingActive = $state(false);

  // Mock profiles for switcher
  const mockProfiles = [
    { id: 'default', name: 'Main Account', avatar: 'https://picsum.photos/seed/1/200', instance: 'mastodon.social' },
    { id: 'alt1', name: 'Alt Account', avatar: 'https://picsum.photos/seed/2/200', instance: 'fosstodon.org' },
    { id: 'alt2', name: 'Work Account', avatar: 'https://picsum.photos/seed/3/200', instance: 'mastodon.xyz' }
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
    connectionStatus = 'connecting';
    
    try {
      if (useMockData) {
        transport = new MockTransport();
        await TransportManager.initialize(transport);
      } else {
        // For real API, you'd need auth token
        const token = localStorage.getItem('mastodon_token') || '';
        if (token) {
          transport = new MastodonTransport(instanceUrl, token);
          await TransportManager.initialize(transport);
        } else {
          console.warn('No auth token found, falling back to mock data');
          transport = new MockTransport();
          await TransportManager.initialize(transport);
        }
      }
      
      connectionStatus = 'connected';
      loadInitialTimeline();
      
      if (enableStreaming) {
        startStreaming();
      }
    } catch (error) {
      connectionStatus = 'disconnected';
      logDebugEvent('error', 'Transport initialization failed', error);
    }
  }

  async function loadInitialTimeline() {
    if (!transport) return;
    
    try {
      const statuses = await transport.getHomeTimeline({ limit: 20 });
      timelineStore.setStatuses(statuses);
      logDebugEvent('timeline', 'Initial timeline loaded', { count: statuses.length });
    } catch (error) {
      logDebugEvent('error', 'Failed to load timeline', error);
    }
  }

  async function startStreaming() {
    if (!transport || !enableStreaming) return;
    
    try {
      await transport.streamHomeTimeline((status: Status) => {
        timelineStore.addStatus(status);
        logDebugEvent('stream', 'New status received', status);
      });
      streamingActive = true;
      logDebugEvent('stream', 'Streaming started', {});
    } catch (error) {
      logDebugEvent('error', 'Streaming failed', error);
    }
  }

  async function handlePost(event: CustomEvent<{ content: string; visibility: string; mediaIds?: string[] }>) {
    if (!transport) return;
    
    const { content, visibility, mediaIds } = event.detail;
    
    try {
      const newStatus = await transport.postStatus({
        status: content,
        visibility: visibility as any,
        media_ids: mediaIds
      });
      
      timelineStore.addStatus(newStatus);
      isComposing = false;
      logDebugEvent('post', 'Status posted', newStatus);
    } catch (error) {
      logDebugEvent('error', 'Failed to post status', error);
    }
  }

  async function handleInteraction(event: CustomEvent<{ action: string; statusId: string }>) {
    if (!transport) return;
    
    const { action, statusId } = event.detail;
    
    try {
      let updatedStatus;
      switch (action) {
        case 'favourite':
          updatedStatus = await transport.favouriteStatus(statusId);
          break;
        case 'unfavourite':
          updatedStatus = await transport.unfavouriteStatus(statusId);
          break;
        case 'reblog':
          updatedStatus = await transport.reblogStatus(statusId);
          break;
        case 'unreblog':
          updatedStatus = await transport.unreblogStatus(statusId);
          break;
        case 'bookmark':
          updatedStatus = await transport.bookmarkStatus(statusId);
          break;
        case 'unbookmark':
          updatedStatus = await transport.unbookmarkStatus(statusId);
          break;
        default:
          return;
      }
      
      timelineStore.updateStatus(updatedStatus);
      logDebugEvent('interaction', `Status ${action}`, { statusId, action });
    } catch (error) {
      logDebugEvent('error', `Failed to ${action} status`, error);
    }
  }

  function handleProfileSwitch(profileId: string) {
    selectedProfile = profileId;
    logDebugEvent('profile', 'Profile switched', { profileId });
    // In a real app, this would reinitialize transport with new credentials
    loadInitialTimeline();
  }

  function logDebugEvent(type: string, message: string, data: any) {
    if (!debugMode) return;
    
    debugEvents = [
      {
        time: new Date().toLocaleTimeString(),
        type,
        data: { message, ...data }
      },
      ...debugEvents
    ].slice(0, 50); // Keep last 50 events
  }

  function toggleStreaming() {
    if (streamingActive) {
      // Stop streaming
      streamingActive = false;
      logDebugEvent('stream', 'Streaming stopped', {});
    } else {
      startStreaming();
    }
  }

  function clearDebugLog() {
    debugEvents = [];
  }

  $effect(() => {
    // Reinitialize when switching between mock and real data
    if (transport) {
      TransportManager.disconnect();
      initializeTransport();
    }
  });
</script>

<div class="home-timeline-container">
  <!-- Header with profile switcher -->
  <header class="timeline-header">
    <div class="header-content">
      <h1>Home Timeline</h1>
      
      {#if showProfileSwitcher}
        <div class="profile-switcher">
          <select 
            bind:value={selectedProfile} 
            onchange={(e) => handleProfileSwitch(e.currentTarget.value)}
            class="profile-select"
          >
            {#each mockProfiles as profile}
              <option value={profile.id}>
                {profile.name} ({profile.instance})
              </option>
            {/each}
          </select>
        </div>
      {/if}
      
      <div class="connection-status" class:connected={connectionStatus === 'connected'}>
        <span class="status-dot"></span>
        {connectionStatus}
        {#if useMockData}
          <span class="mode-badge">Mock</span>
        {:else}
          <span class="mode-badge">Live</span>
        {/if}
      </div>
    </div>
    
    <div class="header-actions">
      <button onclick={() => isComposing = !isComposing} class="compose-button">
        Compose
      </button>
      
      {#if enableStreaming}
        <button onclick={toggleStreaming} class="stream-toggle">
          {streamingActive ? 'Stop' : 'Start'} Streaming
        </button>
      {/if}
      
      <button onclick={loadInitialTimeline} class="refresh-button">
        Refresh
      </button>
    </div>
  </header>

  <!-- Compose Box -->
  {#if isComposing}
    <div class="compose-container">
      <ComposeBox
        on:post={handlePost}
        on:cancel={() => isComposing = false}
        placeholder="What's on your mind?"
        maxLength={500}
        showPollButton={true}
        showMediaButton={true}
        enableDrafts={true}
      />
    </div>
  {/if}

  <!-- Main Timeline -->
  <main class="timeline-main">
    {#if virtualizeTimeline}
      <RealtimeWrapper enabled={enableStreaming && streamingActive}>
        <TimelineVirtualized
          statuses={$timelineStore.statuses}
          loading={$timelineStore.loading}
          error={$timelineStore.error}
          on:interaction={handleInteraction}
          on:loadMore={async () => {
            if (transport) {
              const moreStatuses = await transport.getHomeTimeline({ 
                limit: 20, 
                max_id: $timelineStore.statuses[$timelineStore.statuses.length - 1]?.id 
              });
              timelineStore.addStatuses(moreStatuses);
            }
          }}
          itemHeight={150}
          overscan={3}
        />
      </RealtimeWrapper>
    {:else}
      <div class="timeline-simple">
        {#each $timelineStore.statuses as status}
          <div class="status-item">
            <StatusCard
              {status}
              on:favourite={() => handleInteraction(new CustomEvent('interaction', { 
                detail: { action: status.favourited ? 'unfavourite' : 'favourite', statusId: status.id }
              }))}
              on:reblog={() => handleInteraction(new CustomEvent('interaction', {
                detail: { action: status.reblogged ? 'unreblog' : 'reblog', statusId: status.id }
              }))}
              on:bookmark={() => handleInteraction(new CustomEvent('interaction', {
                detail: { action: status.bookmarked ? 'unbookmark' : 'bookmark', statusId: status.id }
              }))}
            />
          </div>
        {/each}
      </div>
    {/if}
  </main>

  <!-- Debug Panel -->
  {#if debugMode}
    <aside class="debug-panel">
      <div class="debug-header">
        <h3>Debug Events</h3>
        <button onclick={clearDebugLog} class="clear-button">Clear</button>
      </div>
      
      <div class="debug-info">
        <div class="info-item">
          <strong>Transport:</strong> {useMockData ? 'Mock' : 'Mastodon API'}
        </div>
        <div class="info-item">
          <strong>Instance:</strong> {instanceUrl}
        </div>
        <div class="info-item">
          <strong>Streaming:</strong> {streamingActive ? 'Active' : 'Inactive'}
        </div>
        <div class="info-item">
          <strong>Timeline Items:</strong> {$timelineStore.statuses.length}
        </div>
      </div>
      
      <div class="debug-events">
        {#each debugEvents as event}
          <div class="event-item event-{event.type}">
            <span class="event-time">{event.time}</span>
            <span class="event-type">{event.type}</span>
            <pre class="event-data">{JSON.stringify(event.data, null, 2)}</pre>
          </div>
        {/each}
      </div>
    </aside>
  {/if}
</div>

<style>
  .home-timeline-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--gc-color-surface-100);
  }

  .timeline-header {
    background: var(--gc-color-surface-200);
    border-bottom: 1px solid var(--gc-color-border-subtle);
    padding: var(--gc-spacing-md);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-md);
    margin-bottom: var(--gc-spacing-sm);
  }

  .header-content h1 {
    margin: 0;
    font-size: var(--gc-font-size-lg);
    color: var(--gc-color-text-primary);
  }

  .profile-switcher {
    flex: 1;
  }

  .profile-select {
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
    font-size: var(--gc-font-size-sm);
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-xs);
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    background: var(--gc-color-surface-300);
    border-radius: var(--gc-radius-sm);
    font-size: var(--gc-font-size-xs);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gc-color-error);
  }

  .connection-status.connected .status-dot {
    background: var(--gc-color-success);
  }

  .mode-badge {
    padding: 2px 6px;
    background: var(--gc-color-primary-100);
    color: var(--gc-color-primary-600);
    border-radius: var(--gc-radius-xs);
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: var(--gc-spacing-sm);
  }

  .compose-button,
  .stream-toggle,
  .refresh-button {
    padding: var(--gc-spacing-xs) var(--gc-spacing-md);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
    color: var(--gc-color-text-primary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .compose-button {
    background: var(--gc-color-primary-500);
    color: white;
    border-color: var(--gc-color-primary-500);
  }

  .compose-button:hover {
    background: var(--gc-color-primary-600);
  }

  .compose-container {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-bottom: 1px solid var(--gc-color-border-subtle);
  }

  .timeline-main {
    flex: 1;
    overflow-y: auto;
    position: relative;
  }

  .timeline-simple {
    padding: var(--gc-spacing-md);
  }

  .status-item {
    margin-bottom: var(--gc-spacing-md);
  }

  .debug-panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 400px;
    background: var(--gc-color-surface-100);
    border-left: 1px solid var(--gc-color-border-default);
    display: flex;
    flex-direction: column;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-bottom: 1px solid var(--gc-color-border-subtle);
  }

  .debug-header h3 {
    margin: 0;
    font-size: var(--gc-font-size-md);
  }

  .clear-button {
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    background: var(--gc-color-error-100);
    color: var(--gc-color-error-600);
    border: none;
    border-radius: var(--gc-radius-xs);
    cursor: pointer;
  }

  .debug-info {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-bottom: 1px solid var(--gc-color-border-subtle);
  }

  .info-item {
    margin-bottom: var(--gc-spacing-xs);
    font-size: var(--gc-font-size-xs);
  }

  .debug-events {
    flex: 1;
    overflow-y: auto;
    padding: var(--gc-spacing-sm);
  }

  .event-item {
    margin-bottom: var(--gc-spacing-sm);
    padding: var(--gc-spacing-xs);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-xs);
    font-size: var(--gc-font-size-xs);
  }

  .event-time {
    color: var(--gc-color-text-secondary);
    margin-right: var(--gc-spacing-xs);
  }

  .event-type {
    font-weight: 600;
    text-transform: uppercase;
    padding: 2px 4px;
    border-radius: var(--gc-radius-xs);
    background: var(--gc-color-primary-100);
    color: var(--gc-color-primary-600);
  }

  .event-error .event-type {
    background: var(--gc-color-error-100);
    color: var(--gc-color-error-600);
  }

  .event-data {
    margin-top: var(--gc-spacing-xs);
    padding: var(--gc-spacing-xs);
    background: var(--gc-color-surface-100);
    border-radius: var(--gc-radius-xs);
    overflow-x: auto;
    font-family: monospace;
  }

  @media (max-width: 768px) {
    .debug-panel {
      width: 100%;
    }

    .header-content {
      flex-direction: column;
      align-items: stretch;
    }

    .profile-switcher {
      width: 100%;
    }

    .profile-select {
      width: 100%;
    }
  }
</style>