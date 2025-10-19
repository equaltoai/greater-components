# Admin.Root

**Component**: Admin Context Provider  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 45 passing tests

---

## 📋 Overview

`Admin.Root` is the foundational context provider for all admin components. It establishes the admin context with event handlers, manages shared state across admin components, and provides centralized error handling and loading states for the entire admin interface.

### **Key Features**:
- ✅ Context provider for all admin components
- ✅ Centralized event handler management
- ✅ Shared state management (stats, users, reports, etc.)
- ✅ Loading state coordination
- ✅ Error handling and propagation
- ✅ Type-safe handler definitions
- ✅ Automatic state synchronization
- ✅ Permission-aware operations
- ✅ Audit logging integration points

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Admin } from '@equaltoai/greater-components-fediverse';
  
  const adminHandlers = {
    // Stats
    onFetchStats: async () => {
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    
    // Users
    onFetchUsers: async (filters) => {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    
    onSuspendUser: async (userId, reason) => {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (!res.ok) throw new Error('Failed to suspend user');
    },
    
    // Reports
    onFetchReports: async (status) => {
      const params = status ? `?status=${status}` : '';
      const res = await fetch(`/api/admin/reports${params}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch reports');
      return res.json();
    },
    
    // Settings
    onFetchSettings: async () => {
      const res = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    },
    
    onUpdateSettings: async (settings) => {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(settings)
      });
      
      if (!res.ok) throw new Error('Failed to update settings');
    }
  };
  
  function getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
</script>

<Admin.Root handlers={adminHandlers}>
  <div class="admin-dashboard">
    <Admin.Overview />
    <Admin.Users />
    <Admin.Reports />
  </div>
</Admin.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `handlers` | `AdminHandlers` | `{}` | No | Event handlers for admin operations |
| `class` | `string` | `''` | No | Custom CSS class |
| `children` | `Snippet` | - | No | Child components |

### AdminHandlers Type

```typescript
interface AdminHandlers {
  // Overview
  onFetchStats?: () => Promise<AdminStats>;
  
  // Users
  onFetchUsers?: (filters?: { 
    role?: string; 
    status?: string; 
    search?: string 
  }) => Promise<AdminUser[]>;
  onSuspendUser?: (userId: string, reason: string) => Promise<void>;
  onUnsuspendUser?: (userId: string) => Promise<void>;
  onChangeUserRole?: (
    userId: string, 
    role: 'admin' | 'moderator' | 'user'
  ) => Promise<void>;
  onSearchUsers?: (query: string) => Promise<AdminUser[]>;
  
  // Reports
  onFetchReports?: (
    status?: 'pending' | 'resolved' | 'dismissed'
  ) => Promise<AdminReport[]>;
  onResolveReport?: (reportId: string, action: string) => Promise<void>;
  onDismissReport?: (reportId: string) => Promise<void>;
  
  // Federation
  onFetchInstances?: () => Promise<FederatedInstance[]>;
  onBlockInstance?: (domain: string, reason: string) => Promise<void>;
  onUnblockInstance?: (domain: string) => Promise<void>;
  
  // Settings
  onFetchSettings?: () => Promise<InstanceSettings>;
  onUpdateSettings?: (settings: Partial<InstanceSettings>) => Promise<void>;
  
  // Logs
  onFetchLogs?: (filters?: { 
    level?: string; 
    category?: string; 
    limit?: number 
  }) => Promise<LogEntry[]>;
  
  // Analytics
  onFetchAnalytics?: (
    period: 'day' | 'week' | 'month'
  ) => Promise<AnalyticsData>;
}
```

### AdminStats Type

```typescript
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  pendingReports: number;
  blockedDomains: number;
  storageUsed: string;
}
```

### AdminUser Type

```typescript
interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'deleted';
  postsCount: number;
  followersCount: number;
}
```

### AdminReport Type

```typescript
interface AdminReport {
  id: string;
  reporter: { id: string; username: string };
  target: { id: string; username: string; type: 'user' | 'post' };
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  assignedTo?: string;
}
```

### FederatedInstance Type

```typescript
interface FederatedInstance {
  domain: string;
  softwareName?: string;
  softwareVersion?: string;
  usersCount?: number;
  status: 'allowed' | 'limited' | 'blocked';
  lastSeen?: string;
}
```

### InstanceSettings Type

```typescript
interface InstanceSettings {
  name: string;
  description: string;
  registrationOpen: boolean;
  approvalRequired: boolean;
  inviteOnly: boolean;
  maxPostLength: number;
  maxMediaAttachments: number;
}
```

### LogEntry Type

```typescript
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: string;
  message: string;
  metadata?: Record<string, any>;
}
```

### AnalyticsData Type

```typescript
interface AnalyticsData {
  period: 'day' | 'week' | 'month';
  userGrowth: { date: string; count: number }[];
  postActivity: { date: string; count: number }[];
  federationActivity: { date: string; count: number }[];
}
```

---

## 📤 Context API

The Admin context provides these methods to child components:

```typescript
interface AdminContext {
  // State
  state: AdminState;
  
  // Handlers
  handlers: AdminHandlers;
  
  // Methods
  updateState: (partial: Partial<AdminState>) => void;
  clearError: () => void;
  fetchStats: () => Promise<void>;
  fetchUsers: (filters?: { role?: string; status?: string }) => Promise<void>;
  fetchReports: (status?: 'pending' | 'resolved' | 'dismissed') => Promise<void>;
  fetchInstances: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchLogs: (filters?: { level?: string; category?: string }) => Promise<void>;
  fetchAnalytics: (period: 'day' | 'week' | 'month') => Promise<void>;
}
```

### AdminState Type

```typescript
interface AdminState {
  stats: AdminStats | null;
  users: AdminUser[];
  reports: AdminReport[];
  instances: FederatedInstance[];
  settings: InstanceSettings | null;
  logs: LogEntry[];
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}
```

---

## 💡 Examples

### Example 1: Complete Admin Dashboard

Full-featured admin dashboard with all components:

```svelte
<script lang="ts">
  import { Admin } from '@equaltoai/greater-components-fediverse';
  import { goto } from '$app/navigation';
  import type { AdminHandlers } from '@equaltoai/greater-components-fediverse/Admin';
  
  // Admin authentication check
  let currentUser = $state(null);
  let isLoading = $state(true);
  
  $effect(() => {
    checkAuth();
  });
  
  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (res.ok) {
        const user = await res.json();
        
        if (user.role !== 'admin') {
          goto('/');
          return;
        }
        
        currentUser = user;
      } else {
        goto('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      goto('/login');
    } finally {
      isLoading = false;
    }
  }
  
  const adminHandlers: AdminHandlers = {
    // Stats
    onFetchStats: async () => {
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    // Users
    onFetchUsers: async (filters) => {
      const params = new URLSearchParams(filters as Record<string, string>);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    onSuspendUser: async (userId, reason) => {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ reason })
      });
      
      // Log the action
      await logAuditEvent('user_suspended', { userId, reason });
    },
    
    onUnsuspendUser: async (userId) => {
      await fetch(`/api/admin/users/${userId}/unsuspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      await logAuditEvent('user_unsuspended', { userId });
    },
    
    onChangeUserRole: async (userId, role) => {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ role })
      });
      
      await logAuditEvent('user_role_changed', { userId, role });
    },
    
    onSearchUsers: async (query) => {
      const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    // Reports
    onFetchReports: async (status) => {
      const params = status ? `?status=${status}` : '';
      const res = await fetch(`/api/admin/reports${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    onResolveReport: async (reportId, action) => {
      await fetch(`/api/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ action })
      });
      
      await logAuditEvent('report_resolved', { reportId, action });
    },
    
    onDismissReport: async (reportId) => {
      await fetch(`/api/admin/reports/${reportId}/dismiss`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      await logAuditEvent('report_dismissed', { reportId });
    },
    
    // Federation
    onFetchInstances: async () => {
      const res = await fetch('/api/admin/federation/instances', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    onBlockInstance: async (domain, reason) => {
      await fetch('/api/admin/federation/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ domain, reason })
      });
      
      await logAuditEvent('instance_blocked', { domain, reason });
    },
    
    onUnblockInstance: async (domain) => {
      await fetch('/api/admin/federation/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ domain })
      });
      
      await logAuditEvent('instance_unblocked', { domain });
    },
    
    // Settings
    onFetchSettings: async () => {
      const res = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    onUpdateSettings: async (settings) => {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(settings)
      });
      
      await logAuditEvent('settings_updated', { settings });
    },
    
    // Logs
    onFetchLogs: async (filters) => {
      const params = new URLSearchParams(filters as Record<string, string>);
      const res = await fetch(`/api/admin/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    // Analytics
    onFetchAnalytics: async (period) => {
      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    }
  };
  
  async function logAuditEvent(action: string, metadata: Record<string, any>) {
    try {
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          action,
          metadata,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }
  
  let activeTab = $state<'dashboard' | 'users' | 'reports' | 'moderation' | 'federation' | 'settings' | 'logs' | 'analytics'>('dashboard');
</script>

{#if isLoading}
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading admin dashboard...</p>
  </div>
{:else if currentUser}
  <Admin.Root handlers={adminHandlers}>
    <div class="admin-layout">
      <!-- Sidebar Navigation -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar__header">
          <h1>Admin Dashboard</h1>
          <p>{currentUser.username}</p>
        </div>
        
        <nav class="admin-sidebar__nav">
          <button 
            class:active={activeTab === 'dashboard'}
            onclick={() => activeTab = 'dashboard'}
          >
            📊 Dashboard
          </button>
          <button 
            class:active={activeTab === 'users'}
            onclick={() => activeTab = 'users'}
          >
            👥 Users
          </button>
          <button 
            class:active={activeTab === 'reports'}
            onclick={() => activeTab = 'reports'}
          >
            🚩 Reports
          </button>
          <button 
            class:active={activeTab === 'moderation'}
            onclick={() => activeTab = 'moderation'}
          >
            🔨 Moderation
          </button>
          <button 
            class:active={activeTab === 'federation'}
            onclick={() => activeTab = 'federation'}
          >
            🌐 Federation
          </button>
          <button 
            class:active={activeTab === 'settings'}
            onclick={() => activeTab = 'settings'}
          >
            ⚙️ Settings
          </button>
          <button 
            class:active={activeTab === 'logs'}
            onclick={() => activeTab = 'logs'}
          >
            📝 Logs
          </button>
          <button 
            class:active={activeTab === 'analytics'}
            onclick={() => activeTab = 'analytics'}
          >
            📈 Analytics
          </button>
        </nav>
      </aside>
      
      <!-- Main Content -->
      <main class="admin-content">
        {#if activeTab === 'dashboard'}
          <Admin.Overview />
        {:else if activeTab === 'users'}
          <Admin.Users />
        {:else if activeTab === 'reports'}
          <Admin.Reports />
        {:else if activeTab === 'moderation'}
          <Admin.Moderation />
        {:else if activeTab === 'federation'}
          <Admin.Federation />
        {:else if activeTab === 'settings'}
          <Admin.Settings />
        {:else if activeTab === 'logs'}
          <Admin.Logs />
        {:else if activeTab === 'analytics'}
          <Admin.Analytics />
        {/if}
      </main>
    </div>
  </Admin.Root>
{:else}
  <div class="access-denied">
    <h1>Access Denied</h1>
    <p>You must be an administrator to access this page.</p>
    <button onclick={() => goto('/')}>Go Home</button>
  </div>
{/if}

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
  }
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #e1e8ed;
    border-top-color: #1d9bf0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }
  
  .admin-sidebar {
    width: 16rem;
    background: var(--bg-secondary, #f7f9fa);
    border-right: 1px solid var(--border-color, #e1e8ed);
    padding: 1.5rem;
  }
  
  .admin-sidebar__header {
    margin-bottom: 2rem;
  }
  
  .admin-sidebar__header h1 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }
  
  .admin-sidebar__header p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .admin-sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .admin-sidebar__nav button {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    text-align: left;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .admin-sidebar__nav button:hover {
    background: var(--bg-hover, #eff3f4);
  }
  
  .admin-sidebar__nav button.active {
    background: var(--primary-color, #1d9bf0);
    color: white;
  }
  
  .admin-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
  
  .access-denied {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
    text-align: center;
  }
  
  .access-denied button {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color, #1d9bf0);
    border: none;
    border-radius: 9999px;
    color: white;
    font-weight: 700;
    cursor: pointer;
  }
</style>
```

### Example 2: Admin with Adapter Pattern

Using the adapter pattern for API integration:

```svelte
<script lang="ts">
  import { Admin } from '@equaltoai/greater-components-fediverse';
  import { createAdminAdapter } from '$lib/adapters/adminAdapter';
  
  // Create adapter with GraphQL endpoint
  const adminAdapter = createAdminAdapter({
    endpoint: 'https://api.myinstance.social/graphql',
    getAuthToken: () => localStorage.getItem('authToken') || ''
  });
  
  // Handlers delegate to adapter
  const adminHandlers = {
    onFetchStats: () => adminAdapter.fetchStats(),
    onFetchUsers: (filters) => adminAdapter.fetchUsers(filters),
    onSuspendUser: (userId, reason) => adminAdapter.suspendUser(userId, reason),
    onUnsuspendUser: (userId) => adminAdapter.unsuspendUser(userId),
    onChangeUserRole: (userId, role) => adminAdapter.changeUserRole(userId, role),
    onSearchUsers: (query) => adminAdapter.searchUsers(query),
    onFetchReports: (status) => adminAdapter.fetchReports(status),
    onResolveReport: (reportId, action) => adminAdapter.resolveReport(reportId, action),
    onDismissReport: (reportId) => adminAdapter.dismissReport(reportId),
    onFetchInstances: () => adminAdapter.fetchInstances(),
    onBlockInstance: (domain, reason) => adminAdapter.blockInstance(domain, reason),
    onUnblockInstance: (domain) => adminAdapter.unblockInstance(domain),
    onFetchSettings: () => adminAdapter.fetchSettings(),
    onUpdateSettings: (settings) => adminAdapter.updateSettings(settings),
    onFetchLogs: (filters) => adminAdapter.fetchLogs(filters),
    onFetchAnalytics: (period) => adminAdapter.fetchAnalytics(period)
  };
</script>

<Admin.Root handlers={adminHandlers}>
  <Admin.Overview />
  <Admin.Users />
  <Admin.Reports />
</Admin.Root>
```

```typescript
// $lib/adapters/adminAdapter.ts
import type { AdminHandlers, AdminStats, AdminUser } from '@equaltoai/greater-components-fediverse/Admin';

interface AdapterConfig {
  endpoint: string;
  getAuthToken: () => string;
}

export function createAdminAdapter(config: AdapterConfig) {
  async function graphqlRequest(query: string, variables?: Record<string, any>) {
    const res = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.getAuthToken()}`
      },
      body: JSON.stringify({ query, variables })
    });
    
    const { data, errors } = await res.json();
    
    if (errors) {
      throw new Error(errors[0]?.message || 'GraphQL request failed');
    }
    
    return data;
  }
  
  return {
    async fetchStats(): Promise<AdminStats> {
      const data = await graphqlRequest(`
        query FetchAdminStats {
          adminStats {
            totalUsers
            activeUsers
            totalPosts
            pendingReports
            blockedDomains
            storageUsed
          }
        }
      `);
      
      return data.adminStats;
    },
    
    async fetchUsers(filters?: { role?: string; status?: string; search?: string }): Promise<AdminUser[]> {
      const data = await graphqlRequest(`
        query FetchUsers($filters: UserFilters) {
          adminUsers(filters: $filters) {
            id
            username
            email
            displayName
            createdAt
            role
            status
            postsCount
            followersCount
          }
        }
      `, { filters });
      
      return data.adminUsers;
    },
    
    async suspendUser(userId: string, reason: string): Promise<void> {
      await graphqlRequest(`
        mutation SuspendUser($userId: ID!, $reason: String!) {
          suspendUser(userId: $userId, reason: $reason) {
            success
          }
        }
      `, { userId, reason });
    },
    
    async unsuspendUser(userId: string): Promise<void> {
      await graphqlRequest(`
        mutation UnsuspendUser($userId: ID!) {
          unsuspendUser(userId: $userId) {
            success
          }
        }
      `, { userId });
    },
    
    async changeUserRole(userId: string, role: 'admin' | 'moderator' | 'user'): Promise<void> {
      await graphqlRequest(`
        mutation ChangeUserRole($userId: ID!, $role: UserRole!) {
          changeUserRole(userId: $userId, role: $role) {
            success
          }
        }
      `, { userId, role: role.toUpperCase() });
    },
    
    async searchUsers(query: string): Promise<AdminUser[]> {
      const data = await graphqlRequest(`
        query SearchUsers($query: String!) {
          searchUsers(query: $query) {
            id
            username
            email
            displayName
            createdAt
            role
            status
            postsCount
            followersCount
          }
        }
      `, { query });
      
      return data.searchUsers;
    },
    
    // ... implement other methods similarly
  };
}
```

### Example 3: Error Handling with Retry Logic

Robust error handling with automatic retries:

```svelte
<script lang="ts">
  import { Admin } from '@equaltoai/greater-components-fediverse';
  
  let retryCount = $state(0);
  let maxRetries = 3;
  let error = $state<string | null>(null);
  
  async function withRetry<T>(
    fn: () => Promise<T>,
    retries = maxRetries
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0) {
        console.log(`Retrying... (${maxRetries - retries + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        return withRetry(fn, retries - 1);
      }
      throw err;
    }
  }
  
  const adminHandlers = {
    onFetchStats: async () => {
      try {
        error = null;
        return await withRetry(async () => {
          const res = await fetch('/api/admin/stats', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          return res.json();
        });
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to fetch stats';
        throw err;
      }
    },
    
    onFetchUsers: async (filters) => {
      try {
        error = null;
        return await withRetry(async () => {
          const params = new URLSearchParams(filters as Record<string, string>);
          const res = await fetch(`/api/admin/users?${params}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          return res.json();
        });
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to fetch users';
        throw err;
      }
    },
    
    onSuspendUser: async (userId, reason) => {
      try {
        error = null;
        await withRetry(async () => {
          const res = await fetch(`/api/admin/users/${userId}/suspend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ reason })
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to suspend user');
          }
        });
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to suspend user';
        throw err;
      }
    }
  };
</script>

{#if error}
  <div class="error-banner" role="alert">
    <strong>Error:</strong> {error}
    <button onclick={() => error = null}>Dismiss</button>
  </div>
{/if}

<Admin.Root handlers={adminHandlers}>
  <Admin.Overview />
  <Admin.Users />
</Admin.Root>

<style>
  .error-banner {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    background: rgba(244, 33, 46, 0.1);
    border: 1px solid #f4211e;
    border-radius: 0.5rem;
    color: #f4211e;
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 10000;
  }
  
  .error-banner button {
    padding: 0.375rem 0.75rem;
    background: #f4211e;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
```

### Example 4: Caching and Optimization

Implement caching to reduce API calls:

```svelte
<script lang="ts">
  import { Admin } from '@equaltoai/greater-components-fediverse';
  
  interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
  }
  
  class AdminCache {
    private cache = new Map<string, CacheEntry<any>>();
    
    get<T>(key: string): T | null {
      const entry = this.cache.get(key);
      
      if (!entry) return null;
      
      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        return null;
      }
      
      return entry.data;
    }
    
    set<T>(key: string, data: T, ttl: number = 60000): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });
    }
    
    clear(pattern?: string): void {
      if (pattern) {
        for (const key of this.cache.keys()) {
          if (key.includes(pattern)) {
            this.cache.delete(key);
          }
        }
      } else {
        this.cache.clear();
      }
    }
  }
  
  const cache = new AdminCache();
  
  const adminHandlers = {
    onFetchStats: async () => {
      const cacheKey = 'admin:stats';
      const cached = cache.get(cacheKey);
      
      if (cached) {
        console.log('Using cached stats');
        return cached;
      }
      
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await res.json();
      
      // Cache for 30 seconds
      cache.set(cacheKey, data, 30000);
      
      return data;
    },
    
    onFetchUsers: async (filters) => {
      const cacheKey = `admin:users:${JSON.stringify(filters)}`;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        console.log('Using cached users');
        return cached;
      }
      
      const params = new URLSearchParams(filters as Record<string, string>);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await res.json();
      
      // Cache for 60 seconds
      cache.set(cacheKey, data, 60000);
      
      return data;
    },
    
    onSuspendUser: async (userId, reason) => {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ reason })
      });
      
      // Clear user cache when data changes
      cache.clear('admin:users');
      cache.clear('admin:stats');
    },
    
    onFetchInstances: async () => {
      const cacheKey = 'admin:instances';
      const cached = cache.get(cacheKey);
      
      if (cached) {
        console.log('Using cached instances');
        return cached;
      }
      
      const res = await fetch('/api/admin/federation/instances', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await res.json();
      
      // Cache for 5 minutes
      cache.set(cacheKey, data, 300000);
      
      return data;
    },
    
    onBlockInstance: async (domain, reason) => {
      await fetch('/api/admin/federation/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ domain, reason })
      });
      
      // Clear federation cache when data changes
      cache.clear('admin:instances');
    }
  };
</script>

<Admin.Root handlers={adminHandlers}>
  <Admin.Overview />
  <Admin.Users />
  <Admin.Federation />
</Admin.Root>
```

### Example 5: Audit Logging Integration

Comprehensive audit logging for all admin actions:

```svelte
<script lang="ts">
  import { Admin } from '@equaltoai/greater-components-fediverse';
  
  interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    userEmail: string;
    action: string;
    target?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }
  
  async function logAuditEvent(
    action: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const currentUser = await getCurrentUser();
      
      const auditEntry: Omit<AuditLogEntry, 'id'> = {
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userEmail: currentUser.email,
        action,
        metadata,
        // These would typically come from request headers
        ipAddress: await getUserIP(),
        userAgent: navigator.userAgent
      };
      
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(auditEntry)
      });
      
      console.log('Audit event logged:', action, metadata);
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging shouldn't break functionality
    }
  }
  
  async function getCurrentUser() {
    const res = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return res.json();
  }
  
  async function getUserIP(): Promise<string> {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }
  
  const adminHandlers = {
    onFetchStats: async () => {
      await logAuditEvent('stats_viewed');
      
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    },
    
    onSuspendUser: async (userId, reason) => {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ reason })
      });
      
      await logAuditEvent('user_suspended', {
        userId,
        reason,
        severity: 'high'
      });
    },
    
    onUnsuspendUser: async (userId) => {
      await fetch(`/api/admin/users/${userId}/unsuspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      await logAuditEvent('user_unsuspended', {
        userId,
        severity: 'medium'
      });
    },
    
    onChangeUserRole: async (userId, role) => {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ role })
      });
      
      await logAuditEvent('user_role_changed', {
        userId,
        newRole: role,
        severity: 'critical'
      });
    },
    
    onBlockInstance: async (domain, reason) => {
      await fetch('/api/admin/federation/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ domain, reason })
      });
      
      await logAuditEvent('instance_blocked', {
        domain,
        reason,
        severity: 'high'
      });
    },
    
    onUpdateSettings: async (settings) => {
      const oldSettings = await adminHandlers.onFetchSettings?.();
      
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(settings)
      });
      
      await logAuditEvent('settings_updated', {
        changes: settings,
        previousValues: oldSettings,
        severity: 'critical'
      });
    },
    
    onFetchSettings: async () => {
      const res = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return res.json();
    }
  };
</script>

<Admin.Root handlers={adminHandlers}>
  <Admin.Overview />
  <Admin.Users />
  <Admin.Federation />
  <Admin.Settings />
</Admin.Root>
```

---

## 🔐 Security Considerations

### 1. Authentication Required

**Always verify admin credentials before allowing access:**

```typescript
// Server-side middleware
export async function requireAdminAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Response('Unauthorized', { status: 401 });
  }
  
  const token = authHeader.substring(7);
  const user = await verifyJWT(token);
  
  if (!user || user.role !== 'admin') {
    throw new Response('Forbidden - Admin access required', { status: 403 });
  }
  
  return user;
}
```

### 2. Role-Based Access Control

**Enforce different permission levels:**

```typescript
enum Permission {
  VIEW_STATS = 'view_stats',
  MANAGE_USERS = 'manage_users',
  MANAGE_REPORTS = 'manage_reports',
  MANAGE_FEDERATION = 'manage_federation',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_LOGS = 'view_logs'
}

const rolePermissions = {
  admin: [
    Permission.VIEW_STATS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_REPORTS,
    Permission.MANAGE_FEDERATION,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_LOGS
  ],
  moderator: [
    Permission.VIEW_STATS,
    Permission.MANAGE_REPORTS
  ]
};

function hasPermission(userRole: string, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) || false;
}
```

### 3. Audit All Actions

**Log every admin operation for accountability:**

```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  target?: string;
  metadata?: Record<string, any>;
  ipAddress: string;
  success: boolean;
  errorMessage?: string;
}

async function logAdminAction(log: Omit<AuditLog, 'id' | 'timestamp'>) {
  await db.auditLogs.create({
    ...log,
    id: generateUUID(),
    timestamp: new Date().toISOString()
  });
}
```

### 4. Rate Limiting

**Prevent abuse of admin endpoints:**

```typescript
import { rateLimit } from '$lib/middleware/rateLimit';

// Limit admin API calls
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'Too many admin requests'
});

export const GET = adminLimiter(async ({ request }) => {
  // Handler
});
```

### 5. Input Validation

**Validate all inputs to prevent injection:**

```typescript
import { z } from 'zod';

const suspendUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(10).max(500),
  duration: z.number().positive().optional()
});

export async function suspendUser(data: unknown) {
  const validated = suspendUserSchema.parse(data);
  // Safe to proceed
}
```

---

## 🎨 Styling

Default styles can be customized via CSS variables:

```css
.admin-root {
  --primary-color: #1d9bf0;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --border-color: #e1e8ed;
}
```

Custom theme:

```svelte
<Admin.Root handlers={adminHandlers} class="custom-admin">
  <Admin.Overview />
</Admin.Root>

<style>
  :global(.custom-admin) {
    --primary-color: #7c3aed;
    --primary-color-dark: #6d28d9;
  }
</style>
```

---

## ♿ Accessibility

- **Semantic HTML**: Proper use of semantic elements
- **ARIA Labels**: Screen reader support throughout
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators
- **Error Messaging**: Descriptive error feedback

---

## 🧪 Testing

Run Admin.Root tests:

```bash
npm test -- Admin/Root.test.ts
```

Example test:

```typescript
import { render } from '@testing-library/svelte';
import { Admin } from '@equaltoai/greater-components-fediverse';

describe('Admin.Root', () => {
  it('provides context to children', () => {
    const handlers = {
      onFetchStats: vi.fn()
    };
    
    render(Admin.Root, { props: { handlers } });
    render(Admin.Overview);
    
    // Verify Overview can access context
    expect(handlers.onFetchStats).toHaveBeenCalled();
  });
});
```

---

## 🔗 Related Components

- [Admin.Overview](./Overview.md) - Dashboard statistics
- [Admin.Users](./Users.md) - User management
- [Admin.Reports](./Reports.md) - Moderation reports
- [Admin.Moderation](./Moderation.md) - Quick moderation tools
- [Admin.Federation](./Federation.md) - Federation management
- [Admin.Settings](./Settings.md) - Instance configuration
- [Admin.Logs](./Logs.md) - System logs viewer
- [Admin.Analytics](./Analytics.md) - Growth analytics

---

## 📚 See Also

- [Admin Components Overview](./README.md)
- [API Documentation](../../../API_DOCUMENTATION.md)
- [Security Best Practices](../../../SECURITY.md)
- [GraphQL Integration](../../../docs/GraphQL.md)

