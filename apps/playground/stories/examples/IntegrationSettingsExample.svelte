<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    TransportManager,
    MockTransport,
    MastodonTransport,
    type Transport
  } from '@greater-components/fediverse';
  
  type IntegrationEvent = {
    id: string;
    timestamp: string;
    type: string;
    message: string;
    details?: Record<string, unknown>;
  };

  interface Props {
    showConnectionStatus?: boolean;
    showDebugPanel?: boolean;
    showPerformanceMetrics?: boolean;
    allowEndpointSwitch?: boolean;
    showEventLog?: boolean;
    showRateLimits?: boolean;
  }

  let {
    showConnectionStatus = true,
    showDebugPanel = true,
    showPerformanceMetrics = true,
    allowEndpointSwitch = true,
    showEventLog = true,
    showRateLimits = true
  }: Props = $props();

  // Connection state
  let transport = $state<Transport | null>(null);
  let connectionType = $state<'mock' | 'real'>('mock');
  let instanceUrl = $state('https://mastodon.social');
  let accessToken = $state('');
  let connectionStatus = $state<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  let connectionError = $state<string | null>(null);

  // Debug state
  let events = $state<IntegrationEvent[]>([]);
  let debugEnabled = $state(false);
  let eventFilter = $state<string>('all');

  // Performance metrics
  let metrics = $state({
    requestCount: 0,
    avgResponseTime: 0,
    totalDataTransferred: 0,
    cacheHitRate: 0,
    activeConnections: 0,
    errorRate: 0
  });

  // Rate limits
  let rateLimits = $state({
    limit: 300,
    remaining: 300,
    reset: new Date(Date.now() + 300000)
  });

  // Monitoring intervals
  let metricsInterval: ReturnType<typeof setInterval> | undefined;
  let connectionMonitor: ReturnType<typeof setInterval> | undefined;

  const createEventId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `integration-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  onMount(() => {
    initializeConnection();
    startMonitoring();

    return () => {
      stopMonitoring();
      if (transport) {
        TransportManager.disconnect();
      }
    };
  });

  onDestroy(() => {
    stopMonitoring();
  });

  async function initializeConnection() {
    connectionStatus = 'connecting';
    connectionError = null;
    
    try {
      if (connectionType === 'mock') {
        transport = new MockTransport();
        await TransportManager.initialize(transport);
        connectionStatus = 'connected';
        logEvent('connection', 'Connected to mock transport', { type: 'mock' });
      } else {
        if (!accessToken) {
          throw new Error('Access token required for real API connection');
        }
        
        transport = new MastodonTransport(instanceUrl, accessToken);
        await TransportManager.initialize(transport);
        connectionStatus = 'connected';
        logEvent('connection', 'Connected to Mastodon API', { 
          instance: instanceUrl,
          authenticated: true 
        });
      }
      
      // Test connection
      await testConnection();
    } catch (error) {
      connectionStatus = 'error';
      connectionError = error instanceof Error ? error.message : 'Unknown error';
      logEvent('error', 'Connection failed', { error: connectionError });
    }
  }

  async function testConnection() {
    if (!transport) return;
    
    try {
      // Perform a simple API call to verify connection
      const instance = await transport.getInstance();
      logEvent('test', 'Connection test successful', { instance });
      
      // Update rate limits if available
      if (transport instanceof MastodonTransport) {
        // In a real implementation, you'd extract rate limit headers
        updateRateLimits();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logEvent('error', 'Connection test failed', { message: errorMessage });
      throw new Error('Connection test failed');
    }
  }

  function switchEndpoint(type: 'mock' | 'real') {
    if (!allowEndpointSwitch) return;
    
    connectionType = type;
    logEvent('config', `Switching to ${type} endpoint`, { type });
    
    if (transport) {
      TransportManager.disconnect();
    }
    
    initializeConnection();
  }

  function saveConfiguration() {
    const config = {
      connectionType,
      instanceUrl,
      debugEnabled,
      eventFilter
    };
    
    localStorage.setItem('integration_config', JSON.stringify(config));
    logEvent('config', 'Configuration saved', config);
    
    // Show confirmation
    alert('Configuration saved successfully!');
  }

  function loadConfiguration() {
    const saved = localStorage.getItem('integration_config');
    if (saved) {
      const config = JSON.parse(saved);
      connectionType = config.connectionType || 'mock';
      instanceUrl = config.instanceUrl || 'https://mastodon.social';
      debugEnabled = config.debugEnabled || false;
      eventFilter = config.eventFilter || 'all';
      
      logEvent('config', 'Configuration loaded', config);
      initializeConnection();
    }
  }

  function startMonitoring() {
    // Update metrics every 5 seconds
    if (showPerformanceMetrics) {
      metricsInterval = setInterval(updateMetrics, 5000);
    }
    
    // Monitor connection status every 10 seconds
    if (showConnectionStatus) {
      connectionMonitor = setInterval(monitorConnection, 10000);
    }
  }

  function stopMonitoring() {
    if (metricsInterval) clearInterval(metricsInterval);
    if (connectionMonitor) clearInterval(connectionMonitor);
  }

  function updateMetrics() {
    // Simulate metric updates (in real app, these would come from transport)
    metrics = {
      requestCount: metrics.requestCount + Math.floor(Math.random() * 10),
      avgResponseTime: Math.floor(Math.random() * 200) + 50,
      totalDataTransferred: metrics.totalDataTransferred + Math.floor(Math.random() * 1024 * 100),
      cacheHitRate: Math.random() * 100,
      activeConnections: Math.floor(Math.random() * 5) + 1,
      errorRate: Math.random() * 5
    };
  }

  async function monitorConnection() {
    if (!transport || connectionStatus !== 'connected') return;
    
    try {
      await testConnection();
    } catch (error) {
      connectionStatus = 'error';
      connectionError = 'Connection lost';
      logEvent('error', 'Connection monitoring failed', { error });
    }
  }

  function updateRateLimits() {
    // Simulate rate limit updates
    rateLimits = {
      limit: 300,
      remaining: Math.max(0, rateLimits.remaining - 1),
      reset: new Date(Date.now() + 300000)
    };
  }

  function normalizeDetails(details: unknown): Record<string, unknown> | undefined {
    if (details === undefined) {
      return undefined;
    }

    if (details === null) {
      return { value: null };
    }

    if (details instanceof Error) {
      return { name: details.name, message: details.message, stack: details.stack };
    }

    if (Array.isArray(details)) {
      return { items: details };
    }

    if (typeof details === 'object') {
      return details as Record<string, unknown>;
    }

    return { value: details };
  }

  function logEvent(type: string, message: string, details?: unknown) {
    if (!showEventLog) return;
    
    const event: IntegrationEvent = {
      id: createEventId(),
      timestamp: new Date().toISOString(),
      type,
      message,
      details: normalizeDetails(details)
    };
    
    events = [event, ...events].slice(0, 100); // Keep last 100 events
  }

  function clearEvents() {
    events = [];
    logEvent('system', 'Event log cleared');
  }

  function exportEvents() {
    const data = JSON.stringify(events, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    logEvent('export', 'Events exported', { count: events.length });
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  function formatTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  $effect(() => {
    // React to connection type changes
    if (transport) {
      logEvent('config', `Connection type changed to ${connectionType}`);
    }
  });
</script>

<div class="integration-settings">
  <!-- Header -->
  <header class="settings-header">
    <h1>Integration Settings</h1>
    <div class="header-actions">
      <button onclick={saveConfiguration} class="save-button">
        💾 Save Config
      </button>
      <button onclick={loadConfiguration} class="load-button">
        📁 Load Config
      </button>
    </div>
  </header>

  <!-- Connection Configuration -->
  <section class="connection-section">
    <h2>Connection Configuration</h2>
    
    {#if allowEndpointSwitch}
      <div class="endpoint-switcher">
        <label class="radio-group">
          <input
            type="radio"
            name="endpoint"
            value="mock"
            checked={connectionType === 'mock'}
            onchange={() => switchEndpoint('mock')}
          />
          <span>Mock Server</span>
        </label>
        
        <label class="radio-group">
          <input
            type="radio"
            name="endpoint"
            value="real"
            checked={connectionType === 'real'}
            onchange={() => switchEndpoint('real')}
          />
          <span>Real Mastodon API</span>
        </label>
      </div>
    {/if}
    
    {#if connectionType === 'real'}
      <div class="api-config">
        <div class="config-field">
          <label for="instance">Instance URL</label>
          <input
            id="instance"
            type="url"
            bind:value={instanceUrl}
            placeholder="https://mastodon.social"
            class="config-input"
          />
        </div>
        
        <div class="config-field">
          <label for="token">Access Token</label>
          <input
            id="token"
            type="password"
            bind:value={accessToken}
            placeholder="Your access token"
            class="config-input"
          />
        </div>
        
        <button onclick={() => initializeConnection()} class="connect-button">
          Connect
        </button>
      </div>
    {/if}
    
    {#if showConnectionStatus}
      <div class="connection-status" class:connected={connectionStatus === 'connected'}>
        <div class="status-indicator">
          <span class="status-dot status-{connectionStatus}"></span>
          <span class="status-text">{connectionStatus}</span>
        </div>
        
        {#if connectionError}
          <div class="error-message">
            {connectionError}
          </div>
        {/if}
        
        <div class="connection-details">
          <div class="detail-item">
            <span class="detail-label">Type:</span>
            <span class="detail-value">{connectionType === 'mock' ? 'Mock Server' : 'Mastodon API'}</span>
          </div>
          
          {#if connectionType === 'real'}
            <div class="detail-item">
              <span class="detail-label">Instance:</span>
              <span class="detail-value">{instanceUrl}</span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </section>

  <!-- Performance Metrics -->
  {#if showPerformanceMetrics}
    <section class="metrics-section">
      <h2>Performance Metrics</h2>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">{metrics.requestCount}</div>
          <div class="metric-label">Total Requests</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{formatTime(metrics.avgResponseTime)}</div>
          <div class="metric-label">Avg Response Time</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{formatBytes(metrics.totalDataTransferred)}</div>
          <div class="metric-label">Data Transferred</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{metrics.cacheHitRate.toFixed(1)}%</div>
          <div class="metric-label">Cache Hit Rate</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{metrics.activeConnections}</div>
          <div class="metric-label">Active Connections</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{metrics.errorRate.toFixed(1)}%</div>
          <div class="metric-label">Error Rate</div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Rate Limits -->
  {#if showRateLimits}
    <section class="rate-limits-section">
      <h2>API Rate Limits</h2>
      
      <div class="rate-limit-info">
        <div class="limit-bar">
          <div 
            class="limit-progress"
            style="width: {(rateLimits.remaining / rateLimits.limit) * 100}%"
            class:warning={rateLimits.remaining < rateLimits.limit * 0.2}
          ></div>
        </div>
        
        <div class="limit-details">
          <span>{rateLimits.remaining} / {rateLimits.limit} requests remaining</span>
          <span>Resets: {rateLimits.reset.toLocaleTimeString()}</span>
        </div>
      </div>
    </section>
  {/if}

  <!-- Debug Panel -->
  {#if showDebugPanel}
    <section class="debug-section">
      <div class="debug-header">
        <h2>Debug Panel</h2>
        
        <div class="debug-controls">
          <label class="debug-toggle">
            <input
              type="checkbox"
              bind:checked={debugEnabled}
            />
            <span>Enable Debug Mode</span>
          </label>
        </div>
      </div>
      
      {#if debugEnabled}
        <div class="debug-content">
          <div class="debug-info">
            <div class="info-item">
              <strong>Transport Type:</strong> {transport?.constructor.name || 'None'}
            </div>
            <div class="info-item">
              <strong>Connection ID:</strong> {transport ? Date.now().toString(36) : 'N/A'}
            </div>
            <div class="info-item">
              <strong>Debug Mode:</strong> Active
            </div>
          </div>
        </div>
      {/if}
    </section>
  {/if}

  <!-- Event Log -->
  {#if showEventLog}
    <section class="events-section">
      <div class="events-header">
        <h2>Event Log</h2>
        
        <div class="events-controls">
          <select bind:value={eventFilter} class="filter-select">
            <option value="all">All Events</option>
            <option value="connection">Connection</option>
            <option value="config">Configuration</option>
            <option value="test">Tests</option>
            <option value="error">Errors</option>
            <option value="system">System</option>
          </select>
          
          <button onclick={clearEvents} class="clear-button">
            Clear
          </button>
          
          <button onclick={exportEvents} class="export-button">
            Export
          </button>
        </div>
      </div>
      
      <div class="events-list">
        {#each events.filter(e => eventFilter === 'all' || e.type === eventFilter) as event (event.id)}
          <div class="event-item event-{event.type}">
            <div class="event-header">
              <span class="event-time">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
              <span class="event-type">{event.type}</span>
            </div>
            
            <div class="event-message">
              {event.message}
            </div>
            
            {#if event.details && debugEnabled}
              <details class="event-data">
                <summary>Data</summary>
                <pre>{JSON.stringify(event.details, null, 2)}</pre>
              </details>
            {/if}
          </div>
        {/each}
        
        {#if events.length === 0}
          <div class="no-events">
            No events to display
          </div>
        {/if}
      </div>
    </section>
  {/if}
</div>

<style>
  .integration-settings {
    height: 100vh;
    overflow-y: auto;
    background: var(--gc-color-surface-100);
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gc-spacing-lg);
    background: var(--gc-color-surface-200);
    border-bottom: 1px solid var(--gc-color-border-subtle);
  }

  .settings-header h1 {
    margin: 0;
    color: var(--gc-color-text-primary);
    font-size: var(--gc-font-size-xl);
  }

  .header-actions {
    display: flex;
    gap: var(--gc-spacing-sm);
  }

  .save-button,
  .load-button {
    padding: var(--gc-spacing-sm) var(--gc-spacing-md);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
    cursor: pointer;
    font-size: var(--gc-font-size-sm);
  }

  .save-button {
    background: var(--gc-color-primary-500);
    color: white;
    border-color: var(--gc-color-primary-500);
  }

  section {
    padding: var(--gc-spacing-lg);
    border-bottom: 1px solid var(--gc-color-border-subtle);
  }

  section h2 {
    margin: 0 0 var(--gc-spacing-md) 0;
    color: var(--gc-color-text-primary);
    font-size: var(--gc-font-size-lg);
  }

  .endpoint-switcher {
    display: flex;
    gap: var(--gc-spacing-md);
    margin-bottom: var(--gc-spacing-md);
  }

  .radio-group {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-xs);
    padding: var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    cursor: pointer;
  }

  .radio-group:has(input:checked) {
    background: var(--gc-color-primary-100);
    border-color: var(--gc-color-primary-300);
  }

  .api-config {
    display: flex;
    flex-direction: column;
    gap: var(--gc-spacing-md);
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-md);
  }

  .config-field {
    display: flex;
    flex-direction: column;
    gap: var(--gc-spacing-xs);
  }

  .config-field label {
    font-size: var(--gc-font-size-sm);
    color: var(--gc-color-text-secondary);
  }

  .config-input {
    padding: var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
    font-size: var(--gc-font-size-md);
  }

  .connect-button {
    padding: var(--gc-spacing-sm) var(--gc-spacing-md);
    background: var(--gc-color-primary-500);
    color: white;
    border: none;
    border-radius: var(--gc-radius-sm);
    cursor: pointer;
    font-size: var(--gc-font-size-md);
  }

  .connection-status {
    margin-top: var(--gc-spacing-md);
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-md);
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-sm);
    margin-bottom: var(--gc-spacing-sm);
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--gc-color-error-500);
  }

  .status-dot.status-connected {
    background: var(--gc-color-success-500);
    animation: pulse 2s infinite;
  }

  .status-dot.status-connecting {
    background: var(--gc-color-warning-500);
    animation: pulse 1s infinite;
  }

  .status-dot.status-error {
    background: var(--gc-color-error-500);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .status-text {
    font-weight: 600;
    text-transform: capitalize;
  }

  .error-message {
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-error-100);
    color: var(--gc-color-error-700);
    border-radius: var(--gc-radius-sm);
    margin-bottom: var(--gc-spacing-sm);
  }

  .connection-details {
    display: flex;
    flex-direction: column;
    gap: var(--gc-spacing-xs);
  }

  .detail-item {
    display: flex;
    gap: var(--gc-spacing-sm);
    font-size: var(--gc-font-size-sm);
  }

  .detail-label {
    color: var(--gc-color-text-secondary);
  }

  .detail-value {
    color: var(--gc-color-text-primary);
    font-weight: 500;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--gc-spacing-md);
  }

  .metric-card {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-md);
    text-align: center;
  }

  .metric-value {
    font-size: var(--gc-font-size-xl);
    font-weight: 700;
    color: var(--gc-color-primary-600);
  }

  .metric-label {
    font-size: var(--gc-font-size-xs);
    color: var(--gc-color-text-secondary);
    text-transform: uppercase;
    margin-top: var(--gc-spacing-xs);
  }

  .rate-limit-info {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-md);
  }

  .limit-bar {
    height: 20px;
    background: var(--gc-color-surface-300);
    border-radius: var(--gc-radius-full);
    overflow: hidden;
    margin-bottom: var(--gc-spacing-sm);
  }

  .limit-progress {
    height: 100%;
    background: var(--gc-color-success-500);
    transition: width 0.3s, background 0.3s;
  }

  .limit-progress.warning {
    background: var(--gc-color-warning-500);
  }

  .limit-details {
    display: flex;
    justify-content: space-between;
    font-size: var(--gc-font-size-sm);
    color: var(--gc-color-text-secondary);
  }

  .debug-header,
  .events-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gc-spacing-md);
  }

  .debug-toggle {
    display: flex;
    align-items: center;
    gap: var(--gc-spacing-xs);
    cursor: pointer;
  }

  .debug-content {
    padding: var(--gc-spacing-md);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-md);
  }

  .debug-info {
    display: flex;
    flex-direction: column;
    gap: var(--gc-spacing-xs);
  }

  .info-item {
    font-size: var(--gc-font-size-sm);
  }

  .events-controls {
    display: flex;
    gap: var(--gc-spacing-sm);
  }

  .filter-select {
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
    font-size: var(--gc-font-size-sm);
  }

  .clear-button,
  .export-button {
    padding: var(--gc-spacing-xs) var(--gc-spacing-sm);
    border: 1px solid var(--gc-color-border-default);
    border-radius: var(--gc-radius-sm);
    background: var(--gc-color-surface-100);
    cursor: pointer;
    font-size: var(--gc-font-size-sm);
  }

  .events-list {
    max-height: 400px;
    overflow-y: auto;
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-md);
  }

  .event-item {
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-surface-100);
    border-radius: var(--gc-radius-sm);
    margin-bottom: var(--gc-spacing-sm);
    border-left: 3px solid var(--gc-color-border-default);
  }

  .event-item.event-error {
    border-left-color: var(--gc-color-error-500);
  }

  .event-item.event-connection {
    border-left-color: var(--gc-color-success-500);
  }

  .event-item.event-config {
    border-left-color: var(--gc-color-primary-500);
  }

  .event-header {
    display: flex;
    gap: var(--gc-spacing-sm);
    margin-bottom: var(--gc-spacing-xs);
    font-size: var(--gc-font-size-xs);
  }

  .event-time {
    color: var(--gc-color-text-secondary);
  }

  .event-type {
    padding: 2px 6px;
    background: var(--gc-color-primary-100);
    color: var(--gc-color-primary-700);
    border-radius: var(--gc-radius-xs);
    text-transform: uppercase;
  }

  .event-message {
    font-size: var(--gc-font-size-sm);
    color: var(--gc-color-text-primary);
  }

  .event-data {
    margin-top: var(--gc-spacing-sm);
  }

  .event-data summary {
    cursor: pointer;
    font-size: var(--gc-font-size-xs);
    color: var(--gc-color-text-secondary);
  }

  .event-data pre {
    margin-top: var(--gc-spacing-xs);
    padding: var(--gc-spacing-sm);
    background: var(--gc-color-surface-200);
    border-radius: var(--gc-radius-xs);
    font-size: var(--gc-font-size-xs);
    overflow-x: auto;
  }

  .no-events {
    text-align: center;
    padding: var(--gc-spacing-lg);
    color: var(--gc-color-text-secondary);
  }

  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .endpoint-switcher {
      flex-direction: column;
    }

    .events-controls {
      flex-wrap: wrap;
    }
  }
</style>
