# Timeline.ErrorState

**Component**: Error Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 28 passing tests

---

## 📋 Overview

`Timeline.ErrorState` displays error messages when timeline loading fails. It provides a user-friendly error display with retry functionality, helping users recover from network errors, API failures, and other issues gracefully.

### **Key Features**:
- ✅ **Error Display** - Clear, user-friendly error messages
- ✅ **Retry Functionality** - Built-in retry button with loading state
- ✅ **Customizable** - Custom icons, messages, and retry handlers
- ✅ **Accessible** - ARIA alerts for screen readers
- ✅ **Headless Button** - Uses `@equaltoai/greater-components-headless/button` for state management
- ✅ **Flexible** - Support for Error objects or string messages

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Timeline } from '@equaltoai/greater-components-fediverse';
  import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let error = $state<Error | null>(null);

  async function loadTimeline() {
    error = null;
    try {
      const response = await fetch('/api/timeline/home');
      if (!response.ok) throw new Error('Failed to load timeline');
      const data = await response.json();
      items = data.items;
    } catch (err) {
      error = err as Error;
    }
  }

  async function handleRetry() {
    await loadTimeline();
  }
</script>

<Timeline.Root {items}>
  {#if error}
    <Timeline.ErrorState {error} onRetry={handleRetry} />
  {:else}
    {#each items as item, index}
      <Timeline.Item {item} {index}>
        <!-- Item content -->
      </Timeline.Item>
    {/each}
  {/if}
</Timeline.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `error` | `Error \| string` | - | Yes | Error object or message to display |
| `onRetry` | `() => Promise<void> \| void` | - | No | Retry handler function |
| `icon` | `Snippet` | Default error icon | No | Custom error icon |
| `children` | `Snippet` | - | No | Custom content (replaces default) |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 💡 Examples

### Example 1: Network Error with Retry

Handle network errors with automatic retry:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let error = $state<Error | null>(null);
  let retryCount = $state(0);

  $effect(() => {
    loadTimeline();
  });

  async function loadTimeline() {
    error = null;

    try {
      const response = await fetch('/api/timeline/home');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      items = data.items;
      retryCount = 0; // Reset on success
    } catch (err) {
      error = err as Error;
      console.error('Failed to load timeline:', err);
    }
  }

  async function handleRetry() {
    retryCount++;
    await loadTimeline();
  }
</script>

<div class="timeline-container">
  <header class="timeline-header">
    <h1>Home Timeline</h1>
    {#if retryCount > 0}
      <span class="retry-badge">Retry attempt: {retryCount}</span>
    {/if}
  </header>

  <Timeline.Root {items}>
    {#if error}
      <Timeline.ErrorState {error} onRetry={handleRetry} />
    {:else if items.length === 0}
      <Timeline.EmptyState 
        title="No posts yet"
        description="Follow accounts to see posts here"
      />
    {:else}
      {#each items as item, index}
        <Timeline.Item {item} {index}>
          <Status.Root status={item}>
            <Status.Header />
            <Status.Content />
            <Status.Actions />
          </Status.Root>
        </Timeline.Item>
      {/each}
    {/if}
  </Timeline.Root>
</div>

<style>
  .timeline-container {
    max-width: 600px;
    margin: 0 auto;
    border-left: 1px solid #e1e8ed;
    border-right: 1px solid #e1e8ed;
    min-height: 100vh;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e1e8ed;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .timeline-header h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .retry-badge {
    padding: 0.25rem 0.75rem;
    background: #fef3c7;
    color: #92400e;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }
</style>
```

---

### Example 2: Custom Error Messages

Customize error messages based on error type:

```svelte
<script lang="ts">
  import { Timeline } from '@equaltoai/greater-components-fediverse';
  import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let error = $state<Error | null>(null);

  class NetworkError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NetworkError';
    }
  }

  class AuthenticationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthenticationError';
    }
  }

  class RateLimitError extends Error {
    constructor(message: string, public retryAfter: number) {
      super(message);
      this.name = 'RateLimitError';
    }
  }

  async function loadTimeline() {
    error = null;

    try {
      const response = await fetch('/api/timeline/home');
      
      if (response.status === 401) {
        throw new AuthenticationError('Please log in to view your timeline');
      }
      
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        throw new RateLimitError('Too many requests. Please try again later.', retryAfter);
      }
      
      if (!response.ok) {
        throw new NetworkError('Failed to connect to server');
      }

      const data = await response.json();
      items = data.items;
    } catch (err) {
      error = err as Error;
    }
  }

  async function handleRetry() {
    if (error instanceof AuthenticationError) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    if (error instanceof RateLimitError) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000));
    }

    await loadTimeline();
  }

  function getErrorMessage(err: Error): string {
    if (err instanceof AuthenticationError) {
      return err.message;
    }
    
    if (err instanceof RateLimitError) {
      return `${err.message} (retry in ${err.retryAfter} seconds)`;
    }
    
    if (err instanceof NetworkError) {
      return 'Unable to connect to server. Check your internet connection.';
    }
    
    return err.message || 'An unexpected error occurred';
  }

  function getRetryButtonText(err: Error | null): string {
    if (!err) return 'Try again';
    
    if (err instanceof AuthenticationError) {
      return 'Log in';
    }
    
    if (err instanceof RateLimitError) {
      return `Wait ${err.retryAfter}s`;
    }
    
    return 'Try again';
  }
</script>

<Timeline.Root {items}>
  {#if error}
    <Timeline.ErrorState error={getErrorMessage(error)} onRetry={handleRetry}>
      {#snippet icon()}
        {#if error instanceof AuthenticationError}
          <svg viewBox="0 0 24 24" width="64" height="64" fill="#dc2626">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        {:else if error instanceof RateLimitError}
          <svg viewBox="0 0 24 24" width="64" height="64" fill="#f59e0b">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" width="64" height="64" fill="#dc2626">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        {/if}
      {/snippet}
    </Timeline.ErrorState>
  {:else}
    {#each items as item, index}
      <Timeline.Item {item} {index}>
        <!-- Content -->
      </Timeline.Item>
    {/each}
  {/if}
</Timeline.Root>
```

**Error Types Handled**:
- ✅ Network errors
- ✅ Authentication errors
- ✅ Rate limiting errors
- ✅ Custom error messages
- ✅ Type-specific icons
- ✅ Custom retry behavior

---

### Example 3: Error with Retry Limits

Limit retry attempts to prevent infinite loops:

```svelte
<script lang="ts">
  import { Timeline } from '@equaltoai/greater-components-fediverse';
  import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let error = $state<Error | null>(null);
  let retryCount = $state(0);
  const MAX_RETRIES = 3;

  async function loadTimeline() {
    error = null;

    try {
      const response = await fetch('/api/timeline/home');
      if (!response.ok) throw new Error('Failed to load timeline');
      const data = await response.json();
      items = data.items;
      retryCount = 0; // Reset on success
    } catch (err) {
      error = err as Error;
    }
  }

  async function handleRetry() {
    if (retryCount >= MAX_RETRIES) {
      error = new Error(`Maximum retry attempts (${MAX_RETRIES}) exceeded. Please check your connection and try again later.`);
      return;
    }

    retryCount++;

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount - 1) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    await loadTimeline();
  }

  function resetError() {
    error = null;
    retryCount = 0;
  }
</script>

<Timeline.Root {items}>
  {#if error}
    <Timeline.ErrorState {error} onRetry={retryCount < MAX_RETRIES ? handleRetry : undefined}>
      {#snippet children()}
        <div class="error-state-custom">
          <div class="error-icon">⚠️</div>
          
          <h3 class="error-title">
            {retryCount >= MAX_RETRIES ? 'Unable to Load Timeline' : 'Something Went Wrong'}
          </h3>
          
          <p class="error-message">{error.message}</p>
          
          {#if retryCount > 0 && retryCount < MAX_RETRIES}
            <div class="retry-info">
              <div class="retry-progress">
                <div class="retry-bar" style="width: {(retryCount / MAX_RETRIES) * 100}%"></div>
              </div>
              <p class="retry-text">Attempt {retryCount} of {MAX_RETRIES}</p>
            </div>
          {/if}
          
          <div class="error-actions">
            {#if retryCount < MAX_RETRIES}
              <button class="btn btn-primary" onclick={handleRetry}>
                Try Again
              </button>
            {:else}
              <button class="btn btn-secondary" onclick={resetError}>
                Start Over
              </button>
            {/if}
            
            <button class="btn btn-link" onclick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      {/snippet}
    </Timeline.ErrorState>
  {:else}
    {#each items as item, index}
      <Timeline.Item {item} {index}>
        <!-- Content -->
      </Timeline.Item>
    {/each}
  {/if}
</Timeline.Root>

<style>
  .error-state-custom {
    text-align: center;
    padding: 3rem 2rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .error-title {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #dc2626;
  }

  .error-message {
    margin: 0 0 1.5rem 0;
    font-size: 1rem;
    color: #536471;
    line-height: 1.5;
  }

  .retry-info {
    margin-bottom: 1.5rem;
  }

  .retry-progress {
    width: 100%;
    height: 6px;
    background: #e1e8ed;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .retry-bar {
    height: 100%;
    background: linear-gradient(90deg, #ef4444, #dc2626);
    transition: width 0.3s ease;
  }

  .retry-text {
    margin: 0;
    font-size: 0.875rem;
    color: #536471;
    font-weight: 600;
  }

  .error-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #dc2626;
    color: white;
  }

  .btn-primary:hover {
    background: #b91c1c;
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: #f7f9fa;
    color: #0f1419;
    border: 1px solid #e1e8ed;
  }

  .btn-secondary:hover {
    background: #e1e8ed;
  }

  .btn-link {
    background: transparent;
    color: #1d9bf0;
  }

  .btn-link:hover {
    text-decoration: underline;
  }
</style>
```

**Retry Features**:
- ✅ Maximum retry limit
- ✅ Exponential backoff
- ✅ Visual progress indicator
- ✅ Retry count display
- ✅ Alternative actions after max retries
- ✅ Reset functionality

---

### Example 4: Offline Detection

Detect and handle offline state:

```svelte
<script lang="ts">
  import { Timeline } from '@equaltoai/greater-components-fediverse';
  import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let error = $state<Error | null>(null);
  let isOnline = $state(navigator.onLine);

  // Listen for online/offline events
  $effect(() => {
    const handleOnline = () => {
      isOnline = true;
      if (error) {
        loadTimeline();
      }
    };

    const handleOffline = () => {
      isOnline = false;
      error = new Error('You are offline. Check your internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  async function loadTimeline() {
    if (!isOnline) {
      error = new Error('You are offline. Check your internet connection.');
      return;
    }

    error = null;

    try {
      const response = await fetch('/api/timeline/home');
      if (!response.ok) throw new Error('Failed to load timeline');
      const data = await response.json();
      items = data.items;
    } catch (err) {
      if (!isOnline) {
        error = new Error('You are offline. Check your internet connection.');
      } else {
        error = err as Error;
      }
    }
  }

  async function handleRetry() {
    await loadTimeline();
  }
</script>

<Timeline.Root {items}>
  {#if !isOnline}
    <Timeline.ErrorState 
      error="You are offline"
      onRetry={handleRetry}
    >
      {#snippet children()}
        <div class="offline-state">
          <div class="offline-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="#f59e0b">
              <path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/>
            </svg>
          </div>

          <h3 class="offline-title">You're Offline</h3>
          
          <p class="offline-description">
            Check your internet connection and try again. Your timeline will load automatically when you're back online.
          </p>

          <div class="connection-status">
            <div class="status-indicator" class:status-offline={!isOnline}>
              <span class="status-dot"></span>
              <span class="status-text">{isOnline ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>

          <button class="retry-button" onclick={handleRetry} disabled={!isOnline}>
            {isOnline ? 'Retry' : 'Waiting for connection...'}
          </button>
        </div>
      {/snippet}
    </Timeline.ErrorState>
  {:else if error}
    <Timeline.ErrorState {error} onRetry={handleRetry} />
  {:else}
    {#each items as item, index}
      <Timeline.Item {item} {index}>
        <!-- Content -->
      </Timeline.Item>
    {/each}
  {/if}
</Timeline.Root>

<style>
  .offline-state {
    text-align: center;
    padding: 3rem 2rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .offline-icon {
    margin-bottom: 1.5rem;
  }

  .offline-title {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f59e0b;
  }

  .offline-description {
    margin: 0 0 1.5rem 0;
    font-size: 1rem;
    color: #536471;
    line-height: 1.5;
  }

  .connection-status {
    margin-bottom: 1.5rem;
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #dcfce7;
    border-radius: 9999px;
  }

  .status-indicator.status-offline {
    background: #fee2e2;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse-dot 2s infinite;
  }

  .status-offline .status-dot {
    background: #ef4444;
    animation: none;
  }

  @keyframes pulse-dot {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .status-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #166534;
  }

  .status-offline .status-text {
    color: #991b1b;
  }

  .retry-button {
    padding: 0.75rem 2rem;
    background: #f59e0b;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .retry-button:hover:not(:disabled) {
    background: #d97706;
    transform: translateY(-2px);
  }

  .retry-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .status-dot,
    .retry-button {
      animation: none;
      transition: none;
    }
  }
</style>
```

**Offline Features**:
- ✅ Automatic offline detection
- ✅ Online/offline event listeners
- ✅ Auto-retry when connection restored
- ✅ Connection status indicator
- ✅ Disabled retry button when offline

---

### Example 5: Error with Support Contact

Provide support options when errors persist:

```svelte
<script lang="ts">
  import { Timeline } from '@equaltoai/greater-components-fediverse';
  import type { GenericTimelineItem } from '@equaltoai/greater-components-fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let error = $state<Error | null>(null);
  let errorId = $state<string>('');

  async function loadTimeline() {
    error = null;

    try {
      const response = await fetch('/api/timeline/home');
      
      if (!response.ok) {
        // Get error ID from response header
        errorId = response.headers.get('X-Error-ID') || generateErrorId();
        throw new Error('Failed to load timeline');
      }

      const data = await response.json();
      items = data.items;
    } catch (err) {
      error = err as Error;
      if (!errorId) {
        errorId = generateErrorId();
      }
    }
  }

  function generateErrorId(): string {
    return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async function handleRetry() {
    await loadTimeline();
  }

  function copyErrorId() {
    navigator.clipboard.writeText(errorId);
    alert('Error ID copied to clipboard');
  }

  function reportError() {
    const subject = encodeURIComponent(`Error Report: ${errorId}`);
    const body = encodeURIComponent(`
Error ID: ${errorId}
Error Message: ${error?.message}
Timestamp: ${new Date().toISOString()}
Browser: ${navigator.userAgent}
    `);
    
    window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`;
  }
</script>

<Timeline.Root {items}>
  {#if error}
    <Timeline.ErrorState {error} onRetry={handleRetry}>
      {#snippet children()}
        <div class="error-with-support">
          <div class="error-icon">🔥</div>
          
          <h3 class="error-title">Oops! Something went wrong</h3>
          
          <p class="error-message">{error.message}</p>
          
          <div class="error-id-box">
            <div class="error-id-label">Error ID:</div>
            <code class="error-id-code">{errorId}</code>
            <button class="copy-button" onclick={copyErrorId} title="Copy error ID">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>

          <div class="error-actions">
            <button class="btn btn-primary" onclick={handleRetry}>
              Try Again
            </button>
            
            <button class="btn btn-secondary" onclick={reportError}>
              Report Problem
            </button>
          </div>

          <div class="support-info">
            <p>Still having issues?</p>
            <a href="mailto:support@example.com" class="support-link">
              Contact Support
            </a>
            <span class="separator">•</span>
            <a href="/help" class="support-link">
              Help Center
            </a>
            <span class="separator">•</span>
            <a href="/status" class="support-link">
              Service Status
            </a>
          </div>
        </div>
      {/snippet}
    </Timeline.ErrorState>
  {:else}
    {#each items as item, index}
      <Timeline.Item {item} {index}>
        <!-- Content -->
      </Timeline.Item>
    {/each}
  {/if}
</Timeline.Root>

<style>
  .error-with-support {
    text-align: center;
    padding: 3rem 2rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .error-title {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #dc2626;
  }

  .error-message {
    margin: 0 0 1.5rem 0;
    font-size: 1rem;
    color: #536471;
    line-height: 1.5;
  }

  .error-id-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f7f9fa;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .error-id-label {
    font-size: 0.875rem;
    color: #536471;
    font-weight: 600;
  }

  .error-id-code {
    font-family: monospace;
    font-size: 0.875rem;
    color: #0f1419;
    background: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #e1e8ed;
  }

  .copy-button {
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: #1d9bf0;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .copy-button:hover {
    background: rgba(29, 155, 240, 0.1);
  }

  .error-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .btn {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #dc2626;
    color: white;
  }

  .btn-primary:hover {
    background: #b91c1c;
  }

  .btn-secondary {
    background: white;
    color: #0f1419;
    border: 1px solid #e1e8ed;
  }

  .btn-secondary:hover {
    background: #f7f9fa;
  }

  .support-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    font-size: 0.875rem;
    color: #536471;
  }

  .support-info p {
    margin: 0;
  }

  .support-link {
    color: #1d9bf0;
    text-decoration: none;
    font-weight: 600;
  }

  .support-link:hover {
    text-decoration: underline;
  }

  .separator {
    color: #e1e8ed;
  }
</style>
```

**Support Features**:
- ✅ Unique error IDs for tracking
- ✅ Copy error ID to clipboard
- ✅ Email error report
- ✅ Support contact links
- ✅ Help center and status page links
- ✅ Error details for debugging

---

## 🎨 Styling

### CSS Custom Properties

```css
.timeline-error {
  /* Background colors */
  --timeline-error-bg: #fff5f5;
  --timeline-error-border: #fee;
  
  /* Error color */
  --timeline-error-color: #dc2626;
  --timeline-error-hover-color: #b91c1c;
  
  /* Text colors */
  --timeline-text-secondary: #536471;
  
  /* Spacing */
  --timeline-spacing-lg: 2rem;
  
  /* Typography */
  --timeline-font-size-xl: 1.25rem;
  --timeline-font-size-base: 1rem;
}
```

### Default Styles

```css
.timeline-error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: var(--timeline-spacing-lg, 2rem);
  background: var(--timeline-error-bg, #fff5f5);
  border: 1px solid var(--timeline-error-border, #fee);
}

.timeline-error__icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  color: var(--timeline-error-color, #dc2626);
}

.timeline-error__title {
  margin: 0 0 0.5rem 0;
  font-size: var(--timeline-font-size-xl, 1.25rem);
  font-weight: 700;
  color: var(--timeline-error-color, #dc2626);
}

.timeline-error__retry {
  padding: 0.75rem 2rem;
  background: var(--timeline-error-color, #dc2626);
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.timeline-error__retry:hover {
  background: var(--timeline-error-hover-color, #b91c1c);
  transform: translateY(-1px);
}
```

---

## ♿ Accessibility

### ARIA Attributes

```html
<div class="timeline-error" role="alert">
  <!-- Error announced to screen readers -->
</div>
```

**Screen Reader Support**:
- `role="alert"` - Announces errors immediately
- Descriptive error messages
- Keyboard-accessible retry button
- Focus management on error display

---

## 🧪 Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Timeline } from '@equaltoai/greater-components-fediverse';

describe('Timeline.ErrorState', () => {
  it('renders error message', () => {
    const error = new Error('Test error');
    
    render(Timeline.ErrorState, { props: { error } });
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it('renders string error', () => {
    render(Timeline.ErrorState, { props: { error: 'String error' } });
    
    expect(screen.getByText('String error')).toBeInTheDocument();
  });

  it('calls onRetry when button clicked', async () => {
    const onRetry = vi.fn();
    const error = new Error('Test error');
    
    render(Timeline.ErrorState, { props: { error, onRetry } });
    
    const button = screen.getByText('Try again');
    await fireEvent.click(button);
    
    expect(onRetry).toHaveBeenCalled();
  });

  it('hides retry button when onRetry not provided', () => {
    const error = new Error('Test error');
    
    render(Timeline.ErrorState, { props: { error } });
    
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Timeline.Root](./Root.md) - Timeline context provider
- [Timeline.EmptyState](./EmptyState.md) - Empty state display
- [Timeline.LoadMore](./LoadMore.md) - Load more trigger

---

## 📚 See Also

- [Timeline Components README](./README.md)
- [Error Handling Guide](../../guides/error-handling.md)
- [Accessibility Guide](../../guides/accessibility.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0

