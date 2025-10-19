# Profile.AccountMigration

**Component**: Account Migration Management  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 28 passing tests

---

## 📋 Overview

`Profile.AccountMigration` provides comprehensive UI for managing account migrations in the Fediverse. It allows users to initiate account migration to a new instance, track migration status, and notify followers of account changes.

### **Key Features**:
- ✅ Account migration initiation
- ✅ Migration status tracking
- ✅ Account handle validation
- ✅ Follower notification
- ✅ Redirect setup
- ✅ Migration cancellation
- ✅ Historical migration records
- ✅ Warning and confirmation flows

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

  const migration = {
    status: 'completed',
    targetAccount: '@alice@newinstance.social',
    targetAccountUrl: 'https://newinstance.social/@alice',
    movedAt: '2024-01-15T10:00:00Z',
    followersCount: 1234
  };

  const handlers = {
    onInitiateMigration: async (targetAccount: string) => {
      console.log('Initiating migration to:', targetAccount);
      // Handle migration
    },
    onCancelMigration: async () => {
      console.log('Cancelling migration');
      // Handle cancellation
    }
  };
</script>

<Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
  <Profile.AccountMigration {migration} isOwnProfile={true} />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `migration` | `AccountMigration \| null` | `null` | No | Migration data |
| `isOwnProfile` | `boolean` | `false` | No | Whether viewing own profile |
| `class` | `string` | `''` | No | Custom CSS class |

### **AccountMigration Interface**

```typescript
interface AccountMigration {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  targetAccount: string;
  targetAccountUrl: string;
  movedAt?: string;
  followersCount?: number;
  completedAt?: string;
  error?: string;
}
```

---

## 📤 Events

Handlers are accessed via `ProfileContext`:

```typescript
interface ProfileHandlers {
  onInitiateMigration?: (targetAccount: string) => Promise<void>;
  onCancelMigration?: () => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Migration Initiation Flow**

Complete flow for starting an account migration:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { AccountMigration } from '@equaltoai/greater-components-fediverse/Profile';

  let migration = $state<AccountMigration | null>(null);
  let loading = $state(false);
  let error = $state<string | null>(null);

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  const handlers = {
    onInitiateMigration: async (targetAccount: string) => {
      loading = true;
      error = null;

      try {
        const response = await fetch('/api/profile/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetAccount }),
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Migration failed');
        }

        const result = await response.json();

        migration = {
          status: 'pending',
          targetAccount: result.targetAccount,
          targetAccountUrl: result.targetAccountUrl,
          movedAt: new Date().toISOString()
        };

        // Show success message
        showNotification('Migration initiated successfully', 'success');
      } catch (err) {
        error = err instanceof Error ? err.message : 'Migration failed';
        showNotification(error, 'error');
      } finally {
        loading = false;
      }
    },

    onCancelMigration: async () => {
      if (!confirm('Are you sure you want to cancel the migration?')) {
        return;
      }

      loading = true;

      try {
        const response = await fetch('/api/profile/migrate/cancel', {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to cancel migration');
        }

        migration = null;
        showNotification('Migration cancelled', 'info');
      } catch (err) {
        error = err instanceof Error ? err.message : 'Cancellation failed';
        showNotification(error, 'error');
      } finally {
        loading = false;
      }
    }
  };

  function showNotification(message: string, type: string) {
    // Implement your notification system
    console.log(`[${type}] ${message}`);
  }
</script>

<div class="migration-page">
  <h1>Account Migration</h1>

  <div class="migration-info">
    <div class="info-icon">ℹ️</div>
    <div class="info-content">
      <h2>Moving to a new Fediverse instance?</h2>
      <p>
        Account migration allows you to move your followers to a new account on a different instance.
        Your old account will redirect visitors to your new account.
      </p>
    </div>
  </div>

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.AccountMigration {migration} isOwnProfile={true} />
  </Profile.Root>

  {#if error}
    <div class="error-banner" role="alert">
      <strong>Error:</strong> {error}
    </div>
  {/if}

  <div class="migration-guide">
    <h2>Migration Checklist</h2>
    <ol>
      <li>
        <strong>Create your new account</strong>
        <p>Set up an account on your target Fediverse instance</p>
      </li>
      <li>
        <strong>Add alias on new account</strong>
        <p>On your new account, add this account as an alias</p>
      </li>
      <li>
        <strong>Initiate migration</strong>
        <p>Use the form above to start the migration process</p>
      </li>
      <li>
        <strong>Wait for completion</strong>
        <p>Followers will be notified and can follow your new account</p>
      </li>
    </ol>
  </div>
</div>

<style>
  .migration-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .migration-page h1 {
    margin: 0 0 1.5rem;
    font-size: 2rem;
    font-weight: 700;
  }

  .migration-info {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    background: #e8f5fe;
    border: 1px solid #1d9bf0;
    border-radius: 0.75rem;
  }

  .info-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .info-content h2 {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .info-content p {
    margin: 0;
    color: #536471;
    line-height: 1.5;
  }

  .error-banner {
    padding: 1rem;
    margin: 1rem 0;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 0.5rem;
    color: #c00;
  }

  .migration-guide {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
  }

  .migration-guide h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .migration-guide ol {
    margin: 0;
    padding-left: 1.5rem;
  }

  .migration-guide li {
    margin: 1rem 0;
  }

  .migration-guide li strong {
    display: block;
    margin-bottom: 0.25rem;
    color: #0f1419;
  }

  .migration-guide li p {
    margin: 0;
    color: #536471;
    font-size: 0.875rem;
  }
</style>
```

### **Example 2: Migration Status Display**

Show different states of migration:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { AccountMigration } from '@equaltoai/greater-components-fediverse/Profile';

  const migrations: AccountMigration[] = [
    {
      status: 'pending',
      targetAccount: '@alice@new.social',
      targetAccountUrl: 'https://new.social/@alice',
      movedAt: '2024-01-15T10:00:00Z'
    },
    {
      status: 'in_progress',
      targetAccount: '@bob@new.social',
      targetAccountUrl: 'https://new.social/@bob',
      movedAt: '2024-01-14T14:30:00Z',
      followersCount: 1234
    },
    {
      status: 'completed',
      targetAccount: '@charlie@new.social',
      targetAccountUrl: 'https://new.social/@charlie',
      movedAt: '2024-01-10T09:00:00Z',
      completedAt: '2024-01-12T11:00:00Z',
      followersCount: 5678
    },
    {
      status: 'failed',
      targetAccount: '@dave@invalid.social',
      targetAccountUrl: 'https://invalid.social/@dave',
      movedAt: '2024-01-13T16:00:00Z',
      error: 'Target account not found'
    }
  ];

  function getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return '🕐';
      case 'in_progress':
        return '🔄';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'in_progress':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<div class="migration-statuses">
  <h2>Migration Status Examples</h2>

  {#each migrations as migration}
    <div class="migration-card" data-status={migration.status}>
      <div class="status-header">
        <span class="status-icon">{getStatusIcon(migration.status)}</span>
        <span 
          class="status-label" 
          style="color: {getStatusColor(migration.status)}"
        >
          {getStatusText(migration.status)}
        </span>
      </div>

      <div class="migration-details">
        <div class="detail-row">
          <span class="detail-label">Target Account:</span>
          <a 
            href={migration.targetAccountUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            class="target-link"
          >
            {migration.targetAccount}
          </a>
        </div>

        <div class="detail-row">
          <span class="detail-label">Initiated:</span>
          <span class="detail-value">{formatDate(migration.movedAt)}</span>
        </div>

        {#if migration.completedAt}
          <div class="detail-row">
            <span class="detail-label">Completed:</span>
            <span class="detail-value">{formatDate(migration.completedAt)}</span>
          </div>
        {/if}

        {#if migration.followersCount !== undefined}
          <div class="detail-row">
            <span class="detail-label">Followers Migrated:</span>
            <span class="detail-value">{migration.followersCount.toLocaleString()}</span>
          </div>
        {/if}

        {#if migration.error}
          <div class="error-message">
            <strong>Error:</strong> {migration.error}
          </div>
        {/if}
      </div>

      {#if migration.status === 'in_progress'}
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .migration-statuses {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .migration-statuses h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .migration-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .migration-card[data-status="completed"] {
    background: rgba(76, 175, 80, 0.05);
    border-color: #4caf50;
  }

  .migration-card[data-status="failed"] {
    background: rgba(244, 67, 54, 0.05);
    border-color: #f44336;
  }

  .status-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eff3f4;
  }

  .status-icon {
    font-size: 1.5rem;
  }

  .status-label {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .migration-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .detail-label {
    font-weight: 600;
    color: #536471;
    min-width: 140px;
  }

  .detail-value {
    color: #0f1419;
  }

  .target-link {
    color: #1d9bf0;
    text-decoration: none;
  }

  .target-link:hover {
    text-decoration: underline;
  }

  .error-message {
    padding: 0.75rem;
    margin-top: 0.5rem;
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 0.5rem;
    color: #c00;
    font-size: 0.875rem;
  }

  .progress-bar {
    margin-top: 1rem;
    height: 4px;
    background: #eff3f4;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    width: 60%;
    background: linear-gradient(90deg, #1d9bf0, #0d8bd9);
    animation: progress 2s ease-in-out infinite;
  }

  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
  }
</style>
```

### **Example 3: With Confirmation Dialog**

Implement confirmation flow before migration:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';

  let showConfirmDialog = $state(false);
  let targetAccount = $state('');
  let confirmedMigration = $state(false);

  const confirmationChecks = [
    'I have created my new account',
    'I have added an alias on my new account',
    'I understand this action cannot be easily undone',
    'I want to redirect my followers to the new account'
  ];

  let checks = $state<boolean[]>(new Array(confirmationChecks.length).fill(false));

  const allChecked = $derived(checks.every(c => c));

  const handlers = {
    onInitiateMigration: async (target: string) => {
      targetAccount = target;
      showConfirmDialog = true;
    }
  };

  async function confirmMigration() {
    if (!allChecked) return;

    try {
      const response = await fetch('/api/profile/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetAccount,
          confirmed: true 
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Migration failed');
      }

      confirmedMigration = true;
      showConfirmDialog = false;
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed. Please try again.');
    }
  }

  function cancelDialog() {
    showConfirmDialog = false;
    targetAccount = '';
    checks = new Array(confirmationChecks.length).fill(false);
  }
</script>

<div class="migration-with-confirmation">
  <Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
    <Profile.AccountMigration migration={null} isOwnProfile={true} />
  </Profile.Root>

  {#if showConfirmDialog}
    <div class="dialog-overlay" onclick={cancelDialog}>
      <div class="dialog" onclick={(e) => e.stopPropagation()}>
        <div class="dialog-header">
          <h2>Confirm Account Migration</h2>
          <button class="close-button" onclick={cancelDialog}>×</button>
        </div>

        <div class="dialog-body">
          <div class="warning-box">
            <span class="warning-icon">⚠️</span>
            <div>
              <strong>Important:</strong> Account migration is a significant action.
              Please review the following carefully.
            </div>
          </div>

          <div class="migration-target">
            <strong>Migrating to:</strong>
            <span class="target-account">{targetAccount}</span>
          </div>

          <div class="confirmation-checks">
            {#each confirmationChecks as check, i}
              <label class="check-item">
                <input
                  type="checkbox"
                  bind:checked={checks[i]}
                />
                <span>{check}</span>
              </label>
            {/each}
          </div>

          <div class="dialog-actions">
            <button
              class="cancel-button"
              onclick={cancelDialog}
            >
              Cancel
            </button>
            <button
              class="confirm-button"
              onclick={confirmMigration}
              disabled={!allChecked}
            >
              Confirm Migration
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .migration-with-confirmation {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .dialog {
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #eff3f4;
  }

  .dialog-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .close-button {
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: #536471;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .close-button:hover {
    background: #f7f9fa;
  }

  .dialog-body {
    padding: 1.5rem;
    overflow-y: auto;
  }

  .warning-box {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 0.5rem;
    color: #856404;
  }

  .warning-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .migration-target {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: #f7f9fa;
    border-radius: 0.5rem;
  }

  .target-account {
    font-size: 1.125rem;
    color: #1d9bf0;
    font-weight: 600;
  }

  .confirmation-checks {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .check-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
  }

  .check-item input[type="checkbox"] {
    margin-top: 0.125rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .dialog-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .cancel-button,
  .confirm-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-button {
    background: #f7f9fa;
    color: #0f1419;
  }

  .cancel-button:hover {
    background: #eff3f4;
  }

  .confirm-button {
    background: #1d9bf0;
    color: white;
  }

  .confirm-button:hover:not(:disabled) {
    background: #1a8cd8;
  }

  .confirm-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

### **Example 4: Server-Side Migration Handler**

Complete server implementation for account migration:

```typescript
// server/api/profile/migrate.ts
import { db } from '@/lib/database';
import { sendActivityPubActivity } from '@/lib/activitypub';

interface MigrationRequest {
  targetAccount: string;
  confirmed: boolean;
}

export async function POST(request: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body: MigrationRequest = await request.json();
  const { targetAccount, confirmed } = body;

  // Validate target account format
  if (!isValidAccountHandle(targetAccount)) {
    return new Response(
      JSON.stringify({ message: 'Invalid account handle format' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse target account
  const [username, domain] = targetAccount.replace('@', '').split('@');

  try {
    // Lookup target account via WebFinger
    const webfingerUrl = `https://${domain}/.well-known/webfinger?resource=acct:${username}@${domain}`;
    const webfingerResponse = await fetch(webfingerUrl);

    if (!webfingerResponse.ok) {
      return new Response(
        JSON.stringify({ message: 'Target account not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const webfingerData = await webfingerResponse.json();
    const targetActorUrl = webfingerData.links.find(
      (link: any) => link.rel === 'self' && link.type === 'application/activity+json'
    )?.href;

    if (!targetActorUrl) {
      return new Response(
        JSON.stringify({ message: 'Target account is not ActivityPub compatible' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify alias on target account
    const targetActorResponse = await fetch(targetActorUrl, {
      headers: { 'Accept': 'application/activity+json' }
    });

    if (!targetActorResponse.ok) {
      return new Response(
        JSON.stringify({ message: 'Failed to fetch target account' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const targetActor = await targetActorResponse.json();

    // Check if current account is listed as an alias
    const user = await db.users.findUnique({ where: { id: userId } });
    const currentActorUrl = `https://example.com/users/${user.username}`;

    const hasAlias = targetActor.alsoKnownAs?.includes(currentActorUrl);

    if (!hasAlias) {
      return new Response(
        JSON.stringify({ 
          message: 'Target account must have this account listed as an alias' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing migration
    const existingMigration = await db.accountMigrations.findFirst({
      where: {
        userId,
        status: { in: ['pending', 'in_progress'] }
      }
    });

    if (existingMigration) {
      return new Response(
        JSON.stringify({ message: 'Migration already in progress' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create migration record
    const migration = await db.accountMigrations.create({
      data: {
        userId,
        targetAccount,
        targetAccountUrl: targetActorUrl,
        status: 'pending',
        movedAt: new Date()
      }
    });

    // If confirmed, start migration process
    if (confirmed) {
      // Update migration status
      await db.accountMigrations.update({
        where: { id: migration.id },
        data: { status: 'in_progress' }
      });

      // Send Move activity to followers
      await sendMoveActivity(userId, targetActorUrl);

      // Update user profile to show moved status
      await db.users.update({
        where: { id: userId },
        data: { 
          movedTo: targetActorUrl,
          movedAt: new Date()
        }
      });

      // Create audit log
      await db.auditLogs.create({
        data: {
          userId,
          action: 'account.migrated',
          details: JSON.stringify({
            targetAccount,
            targetAccountUrl: targetActorUrl
          }),
          timestamp: new Date()
        }
      });
    }

    return new Response(
      JSON.stringify({
        migration: {
          id: migration.id,
          status: confirmed ? 'in_progress' : 'pending',
          targetAccount,
          targetAccountUrl: targetActorUrl,
          movedAt: migration.movedAt.toISOString()
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ message: 'Migration failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function sendMoveActivity(userId: string, targetActorUrl: string) {
  const user = await db.users.findUnique({
    where: { id: userId },
    include: { followers: true }
  });

  const activity = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Move',
    actor: `https://example.com/users/${user.username}`,
    object: `https://example.com/users/${user.username}`,
    target: targetActorUrl
  };

  // Send to all followers
  for (const follower of user.followers) {
    await sendActivityPubActivity(follower.inbox, activity, user);
  }
}

function isValidAccountHandle(handle: string): boolean {
  const accountRegex = /^@?[\w\-]+@[\w\-\.]+\.\w+$/;
  return accountRegex.test(handle);
}
```

### **Example 5: Migration History View**

Display historical migrations:

```svelte
<script lang="ts">
  import * as Profile from '@equaltoai/greater-components-fediverse/Profile';
  import type { AccountMigration } from '@equaltoai/greater-components-fediverse/Profile';

  interface MigrationHistory {
    id: string;
    migration: AccountMigration;
    createdAt: string;
  }

  let history = $state<MigrationHistory[]>([
    {
      id: '1',
      migration: {
        status: 'completed',
        targetAccount: '@alice@mastodon.social',
        targetAccountUrl: 'https://mastodon.social/@alice',
        movedAt: '2023-06-15T10:00:00Z',
        completedAt: '2023-06-15T12:00:00Z',
        followersCount: 856
      },
      createdAt: '2023-06-15T10:00:00Z'
    },
    {
      id: '2',
      migration: {
        status: 'completed',
        targetAccount: '@alice@oldhome.social',
        targetAccountUrl: 'https://oldhome.social/@alice',
        movedAt: '2022-01-10T14:00:00Z',
        completedAt: '2022-01-10T16:30:00Z',
        followersCount: 423
      },
      createdAt: '2022-01-10T14:00:00Z'
    }
  ]);

  let currentMigration = $state<AccountMigration | null>({
    status: 'completed',
    targetAccount: '@alice@newinstance.social',
    targetAccountUrl: 'https://newinstance.social/@alice',
    movedAt: '2024-01-15T10:00:00Z',
    completedAt: '2024-01-15T14:00:00Z',
    followersCount: 1234
  });

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
</script>

<div class="migration-history">
  <h1>Account Migration History</h1>

  {#if currentMigration}
    <section class="current-migration">
      <h2>Current Location</h2>
      <Profile.AccountMigration 
        migration={currentMigration} 
        isOwnProfile={true} 
      />
    </section>
  {/if}

  <section class="history-section">
    <h2>Migration History</h2>
    
    {#if history.length === 0}
      <div class="empty-state">
        <p>No previous migrations</p>
      </div>
    {:else}
      <div class="history-timeline">
        {#each history as item}
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <strong>{item.migration.targetAccount}</strong>
                <span class="timeline-date">{formatDate(item.createdAt)}</span>
              </div>

              <div class="timeline-details">
                {#if item.migration.followersCount}
                  <div class="detail">
                    👥 {item.migration.followersCount.toLocaleString()} followers migrated
                  </div>
                {/if}

                {#if item.migration.completedAt}
                  <div class="detail">
                    ✅ Completed on {formatDate(item.migration.completedAt)}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .migration-history {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .migration-history h1 {
    margin: 0 0 2rem;
    font-size: 2rem;
    font-weight: 700;
  }

  .current-migration {
    margin-bottom: 3rem;
    padding: 1.5rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
  }

  .current-migration h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .history-section h2 {
    margin: 0 0 1.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: #536471;
  }

  .history-timeline {
    position: relative;
    padding-left: 2rem;
  }

  .history-timeline::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 2px;
    background: #eff3f4;
  }

  .timeline-item {
    position: relative;
    padding-bottom: 2rem;
    display: flex;
    gap: 1rem;
  }

  .timeline-marker {
    position: absolute;
    left: -1.5rem;
    width: 1rem;
    height: 1rem;
    background: #1d9bf0;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #eff3f4;
  }

  .timeline-content {
    flex: 1;
    padding: 1rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.5rem;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .timeline-header strong {
    color: #1d9bf0;
    font-size: 1.0625rem;
  }

  .timeline-date {
    font-size: 0.875rem;
    color: #536471;
  }

  .timeline-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail {
    font-size: 0.875rem;
    color: #536471;
  }

  @media (max-width: 640px) {
    .timeline-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }
</style>
```

---

## 🔒 Security Considerations

### **Verification Required**

Always verify target account before migration:

```typescript
async function verifyTargetAccount(targetActorUrl: string, currentActorUrl: string): Promise<boolean> {
  const response = await fetch(targetActorUrl, {
    headers: { 'Accept': 'application/activity+json' }
  });

  if (!response.ok) return false;

  const actor = await response.json();
  return actor.alsoKnownAs?.includes(currentActorUrl) ?? false;
}
```

### **Rate Limiting**

Prevent migration abuse:

```typescript
const migrationLimit = new RateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(1, '30 d'), // 1 per month
  analytics: true
});
```

### **Audit Logging**

Track all migration attempts:

```typescript
await db.auditLogs.create({
  data: {
    userId,
    action: 'account.migration.initiated',
    details: JSON.stringify({ targetAccount }),
    timestamp: new Date(),
    ipAddress: request.headers.get('x-forwarded-for')
  }
});
```

---

## 🎨 Styling

```css
.account-migration {
  --migration-pending: #ff9800;
  --migration-progress: #2196f3;
  --migration-success: #4caf50;
  --migration-error: #f44336;
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Proper heading hierarchy
- ✅ **ARIA Labels**: Clear status announcements
- ✅ **Keyboard Navigation**: Accessible forms and buttons
- ✅ **Screen Readers**: Status updates

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { AccountMigration } from '@equaltoai/greater-components-fediverse/Profile';

describe('AccountMigration', () => {
  it('displays migration form for own profile', () => {
    render(AccountMigration, { 
      props: { migration: null, isOwnProfile: true } 
    });

    expect(screen.getByLabelText(/target account/i)).toBeInTheDocument();
  });

  it('shows migration status when in progress', () => {
    const migration = {
      status: 'in_progress',
      targetAccount: '@alice@new.social',
      targetAccountUrl: 'https://new.social/@alice',
      movedAt: '2024-01-15T10:00:00Z'
    };

    render(AccountMigration, { props: { migration, isOwnProfile: true } });

    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.Header](./Header.md)
- [Profile.PrivacySettings](./PrivacySettings.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [ActivityPub Move Activity](https://www.w3.org/TR/activitypub/#obj-id-normalization)
- [Mastodon Account Migration Guide](https://docs.joinmastodon.org/user/moving/)

