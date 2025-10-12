# Admin Components

**Component Group**: Instance Administration & Moderation  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 454 passing tests

---

## 📋 Overview

The Admin component group provides a comprehensive administration dashboard for managing ActivityPub/Fediverse instances. Designed for instance administrators and moderators, these components offer complete control over users, content moderation, federation, settings, and system monitoring.

### **Component Suite**:

1. **[Root](./Root.md)** - Admin context provider
2. **[Overview](./Overview.md)** - Dashboard with instance statistics
3. **[Users](./Users.md)** - User management and role assignment
4. **[Reports](./Reports.md)** - Content moderation reports
5. **[Moderation](./Moderation.md)** - Quick moderation actions and tools
6. **[Federation](./Federation.md)** - Federated instance management
7. **[Settings](./Settings.md)** - Instance configuration
8. **[Logs](./Logs.md)** - System and audit logs viewer
9. **[Analytics](./Analytics.md)** - Instance growth and activity metrics

### **Key Features**:

#### 📊 **Dashboard & Monitoring**
- Real-time instance statistics
- User growth analytics
- Activity metrics (posts, registrations, engagement)
- Federation activity tracking
- Storage usage monitoring

#### 👥 **User Management**
- Search and filter users by role, status
- Suspend/unsuspend user accounts
- Delete user accounts
- Assign roles (admin, moderator, user)
- View user activity and statistics
- Bulk user operations

#### 🔨 **Content Moderation**
- Review and process reports
- Quick moderation actions
- Content removal capabilities
- User suspension with reason logging
- Moderation queue management
- Appeal system support

#### 🌐 **Federation Management**
- Block/unblock remote instances
- Silence/limit federated instances
- View federation statistics
- Manage relay connections
- Domain policy management
- Instance software detection

#### ⚙️ **Instance Settings**
- Registration controls (open, approval, invite-only)
- Content limits (post length, media attachments)
- Feature flags and toggles
- Instance metadata (name, description)
- Safety and compliance settings

#### 📝 **Audit & Logging**
- Complete audit trail
- Searchable system logs
- Filter by level (info, warn, error)
- Filter by category
- Real-time log streaming
- Exportable logs for compliance

#### 🔐 **Security & Permissions**
- Role-based access control (RBAC)
- Admin and moderator roles
- Permission checks before actions
- Audit logging for all privileged operations
- Secure credential handling

---

## 🚀 Quick Start

### Basic Setup

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  // Define admin handlers
  const adminHandlers = {
    // Stats
    onFetchStats: async () => {
      const res = await fetch('/api/admin/stats');
      return res.json();
    },
    
    // Users
    onFetchUsers: async (filters) => {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/users?${params}`);
      return res.json();
    },
    
    onSuspendUser: async (userId, reason) => {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
    },
    
    onUnsuspendUser: async (userId) => {
      await fetch(`/api/admin/users/${userId}/unsuspend`, {
        method: 'POST'
      });
    },
    
    onChangeUserRole: async (userId, role) => {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
    },
    
    // Reports
    onFetchReports: async (status) => {
      const params = status ? `?status=${status}` : '';
      const res = await fetch(`/api/admin/reports${params}`);
      return res.json();
    },
    
    onResolveReport: async (reportId, action) => {
      await fetch(`/api/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
    },
    
    onDismissReport: async (reportId) => {
      await fetch(`/api/admin/reports/${reportId}/dismiss`, {
        method: 'POST'
      });
    },
    
    // Federation
    onFetchInstances: async () => {
      const res = await fetch('/api/admin/federation/instances');
      return res.json();
    },
    
    onBlockInstance: async (domain, reason) => {
      await fetch('/api/admin/federation/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, reason })
      });
    },
    
    onUnblockInstance: async (domain) => {
      await fetch('/api/admin/federation/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
    },
    
    // Settings
    onFetchSettings: async () => {
      const res = await fetch('/api/admin/settings');
      return res.json();
    },
    
    onUpdateSettings: async (settings) => {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    },
    
    // Logs
    onFetchLogs: async (filters) => {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/logs?${params}`);
      return res.json();
    },
    
    // Analytics
    onFetchAnalytics: async (period) => {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      return res.json();
    }
  };
</script>

<Admin.Root handlers={adminHandlers}>
  <div class="admin-layout">
    <nav class="admin-sidebar">
      <a href="#overview">Dashboard</a>
      <a href="#users">Users</a>
      <a href="#reports">Reports</a>
      <a href="#moderation">Moderation</a>
      <a href="#federation">Federation</a>
      <a href="#settings">Settings</a>
      <a href="#logs">Logs</a>
      <a href="#analytics">Analytics</a>
    </nav>
    
    <main class="admin-content">
      <Admin.Overview />
      <Admin.Users />
      <Admin.Reports />
      <Admin.Moderation />
      <Admin.Federation />
      <Admin.Settings />
      <Admin.Logs />
      <Admin.Analytics />
    </main>
  </div>
</Admin.Root>
```

---

## 🔐 Permission System

Admin components require proper authentication and authorization. Implement role-based access control:

### Role Hierarchy

```typescript
enum UserRole {
  ADMIN = 'admin',       // Full access to all admin features
  MODERATOR = 'moderator', // Content moderation and reports
  USER = 'user'           // Regular user, no admin access
}
```

### Permission Middleware Example

```typescript
// Server-side permission check
export function requireAdmin(handler) {
  return async (req, res) => {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required' 
      });
    }
    
    return handler(req, res);
  };
}

export function requireModerator(handler) {
  return async (req, res) => {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      return res.status(403).json({ 
        error: 'Moderator access required' 
      });
    }
    
    return handler(req, res);
  };
}
```

### Client-side Permission Guard

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  import { goto } from '$app/navigation';
  
  export let data; // From +page.server.ts
  
  // Redirect non-admins
  $effect(() => {
    if (!data.user || data.user.role !== 'admin') {
      goto('/');
    }
  });
</script>

{#if data.user?.role === 'admin'}
  <Admin.Root handlers={adminHandlers}>
    <!-- Admin interface -->
  </Admin.Root>
{:else}
  <div class="access-denied">
    <h1>Access Denied</h1>
    <p>You must be an administrator to access this page.</p>
  </div>
{/if}
```

---

## 📊 Common Patterns

### Pattern 1: Dashboard Overview

Display key metrics and alerts:

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  const handlers = {
    onFetchStats: async () => {
      const res = await fetch('/api/admin/stats');
      return res.json();
    },
    
    onFetchReports: async () => {
      const res = await fetch('/api/admin/reports?status=pending');
      return res.json();
    }
  };
</script>

<Admin.Root {handlers}>
  <div class="dashboard">
    <!-- Key Metrics -->
    <Admin.Overview />
    
    <!-- Pending Reports Alert -->
    <Admin.Reports />
  </div>
</Admin.Root>
```

### Pattern 2: User Management with Search

Filter and manage users:

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  let searchQuery = $state('');
  let roleFilter = $state(undefined);
  let statusFilter = $state(undefined);
  
  const handlers = {
    onFetchUsers: async (filters) => {
      const params = new URLSearchParams({
        ...filters,
        search: searchQuery || undefined
      });
      const res = await fetch(`/api/admin/users?${params}`);
      return res.json();
    },
    
    onSuspendUser: async (userId, reason) => {
      await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      // Log the action
      await logAuditEvent({
        action: 'user_suspended',
        userId,
        reason,
        performedBy: currentUser.id
      });
    }
  };
</script>

<Admin.Root {handlers}>
  <Admin.Users />
</Admin.Root>
```

### Pattern 3: Federation Management

Control instance federation:

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  const handlers = {
    onFetchInstances: async () => {
      const res = await fetch('/api/admin/federation/instances');
      return res.json();
    },
    
    onBlockInstance: async (domain, reason) => {
      // Block the instance
      await fetch('/api/admin/federation/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, reason })
      });
      
      // Notify federated instances
      await notifyFederationChange(domain, 'blocked');
      
      // Log for audit
      await logAuditEvent({
        action: 'instance_blocked',
        domain,
        reason,
        performedBy: currentUser.id
      });
    },
    
    onUnblockInstance: async (domain) => {
      await fetch('/api/admin/federation/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      
      await logAuditEvent({
        action: 'instance_unblocked',
        domain,
        performedBy: currentUser.id
      });
    }
  };
</script>

<Admin.Root {handlers}>
  <Admin.Federation />
</Admin.Root>
```

### Pattern 4: Real-time Logs Monitoring

Stream system logs with auto-refresh:

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  const handlers = {
    onFetchLogs: async (filters) => {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/logs?${params}`);
      return res.json();
    }
  };
</script>

<Admin.Root {handlers}>
  <Admin.Logs />
</Admin.Root>
```

### Pattern 5: Instance Configuration

Manage instance settings:

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  const handlers = {
    onFetchSettings: async () => {
      const res = await fetch('/api/admin/settings');
      return res.json();
    },
    
    onUpdateSettings: async (settings) => {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      // Restart services if needed
      if (settings.registrationOpen !== undefined) {
        await restartRegistrationService();
      }
      
      // Log configuration change
      await logAuditEvent({
        action: 'settings_updated',
        changes: settings,
        performedBy: currentUser.id
      });
    }
  };
</script>

<Admin.Root {handlers}>
  <Admin.Settings />
</Admin.Root>
```

---

## 🔒 Security Best Practices

### 1. Authentication & Authorization

**Always verify admin credentials:**

```typescript
// middleware/admin.ts
export async function checkAdminAccess(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  const user = await verifyToken(token);
  
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}
```

### 2. Audit Logging

**Log all admin actions:**

```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  target?: string;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

async function logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>) {
  await db.auditLogs.create({
    ...event,
    id: generateId(),
    timestamp: new Date().toISOString()
  });
}
```

### 3. Rate Limiting

**Protect admin endpoints:**

```typescript
import rateLimit from 'express-rate-limit';

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many admin requests, please try again later'
});

app.use('/api/admin', adminRateLimit);
```

### 4. Input Validation

**Validate all admin inputs:**

```typescript
import { z } from 'zod';

const suspendUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(10).max(500),
  duration: z.number().positive().optional()
});

async function suspendUser(data: unknown) {
  const validated = suspendUserSchema.parse(data);
  // Proceed with suspension
}
```

### 5. Secure Communication

**Use HTTPS for all admin operations:**

```typescript
// Ensure HTTPS in production
if (process.env.NODE_ENV === 'production' && !request.secure) {
  throw new Error('HTTPS required for admin operations');
}
```

---

## 🎨 Styling & Theming

Admin components use CSS variables for theming:

```css
:root {
  /* Primary Colors */
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
  
  /* Text Colors */
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --text-tertiary: #8899a6;
  
  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  
  /* Border Colors */
  --border-color: #e1e8ed;
  
  /* Status Colors */
  --success-color: #00ba7c;
  --warning-color: #f59e0b;
  --danger-color: #f4211e;
  --info-color: #1d9bf0;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #ffffff;
    --text-secondary: #b9b9b9;
    --text-tertiary: #8b8b8b;
    
    --bg-primary: #15202b;
    --bg-secondary: #192734;
    --bg-hover: #1e2732;
    
    --border-color: #38444d;
  }
}
```

### Custom Admin Theme

```svelte
<Admin.Root handlers={adminHandlers}>
  <div class="admin-dashboard" style="
    --primary-color: #7c3aed;
    --primary-color-dark: #6d28d9;
  ">
    <Admin.Overview />
    <!-- Other components -->
  </div>
</Admin.Root>

<style>
  .admin-dashboard {
    min-height: 100vh;
    background: var(--bg-secondary);
  }
</style>
```

---

## ♿ Accessibility

All Admin components follow WCAG 2.1 Level AA standards:

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Error Messages**: Clear, descriptive error feedback
- **Form Labels**: All inputs properly labeled

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` / `Shift+Tab` | Navigate between elements |
| `Enter` / `Space` | Activate buttons |
| `Escape` | Close modals/dialogs |
| `Arrow Keys` | Navigate lists/tables |
| `/` | Focus search input |

---

## 🧪 Testing

Comprehensive test coverage (454 tests):

```bash
# Run all admin tests
npm test -- Admin

# Run specific component tests
npm test -- Admin/Users.test.ts
npm test -- Admin/Reports.test.ts
npm test -- Admin/Federation.test.ts

# Run with coverage
npm test -- --coverage Admin
```

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Admin } from '@greater/fediverse';

describe('Admin.Users', () => {
  it('suspends user with reason', async () => {
    const onSuspendUser = vi.fn();
    
    render(Admin.Root, {
      props: {
        handlers: { onSuspendUser }
      }
    });
    
    render(Admin.Users);
    
    // Open suspend modal
    const suspendButton = screen.getByTitle('Suspend user');
    await fireEvent.click(suspendButton);
    
    // Enter reason
    const reasonInput = screen.getByLabelText('Reason');
    await fireEvent.input(reasonInput, { 
      target: { value: 'Spam activity' } 
    });
    
    // Confirm suspension
    const confirmButton = screen.getByText('Suspend User');
    await fireEvent.click(confirmButton);
    
    expect(onSuspendUser).toHaveBeenCalledWith(
      expect.any(String),
      'Spam activity'
    );
  });
});
```

---

## 📚 Component Documentation

For detailed documentation on individual components, see:

- **[Admin.Root](./Root.md)** - Context provider setup
- **[Admin.Overview](./Overview.md)** - Dashboard statistics
- **[Admin.Users](./Users.md)** - User management interface
- **[Admin.Reports](./Reports.md)** - Moderation reports
- **[Admin.Moderation](./Moderation.md)** - Quick moderation tools
- **[Admin.Federation](./Federation.md)** - Federation management
- **[Admin.Settings](./Settings.md)** - Instance configuration
- **[Admin.Logs](./Logs.md)** - System logs viewer
- **[Admin.Analytics](./Analytics.md)** - Growth and activity analytics

---

## 🔗 Related Resources

- [Auth Components](../Auth/README.md) - User authentication
- [Profile Components](../Profile/README.md) - User profiles
- [Timeline Components](../Timeline/README.md) - Activity feeds
- [API Documentation](../../../API_DOCUMENTATION.md)
- [Security Best Practices](../../../SECURITY.md)

---

## 💡 Tips & Tricks

### Performance Optimization

**1. Lazy Load Analytics:**

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  let showAnalytics = $state(false);
</script>

<Admin.Root {handlers}>
  <Admin.Overview />
  
  {#if showAnalytics}
    <Admin.Analytics />
  {:else}
    <button onclick={() => showAnalytics = true}>
      Load Analytics
    </button>
  {/if}
</Admin.Root>
```

**2. Paginate User Lists:**

```typescript
const handlers = {
  onFetchUsers: async (filters) => {
    const params = new URLSearchParams({
      ...filters,
      page: currentPage.toString(),
      perPage: '50'
    });
    const res = await fetch(`/api/admin/users?${params}`);
    return res.json();
  }
};
```

**3. Cache Federation Data:**

```typescript
let instanceCache: Map<string, FederatedInstance[]> = new Map();

const handlers = {
  onFetchInstances: async () => {
    const cacheKey = 'instances';
    const cached = instanceCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 60000) {
      return cached.data;
    }
    
    const res = await fetch('/api/admin/federation/instances');
    const data = await res.json();
    
    instanceCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
};
```

### Error Handling

**Robust error handling pattern:**

```svelte
<script lang="ts">
  import { Admin } from '@greater/fediverse';
  
  let error = $state<string | null>(null);
  
  const handlers = {
    onSuspendUser: async (userId, reason) => {
      try {
        error = null;
        
        const res = await fetch(`/api/admin/users/${userId}/suspend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Suspension failed');
        }
        
        // Success - show notification
        showNotification('User suspended successfully');
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error';
        console.error('Suspension failed:', err);
      }
    }
  };
</script>

<Admin.Root {handlers}>
  {#if error}
    <div class="error-banner" role="alert">
      {error}
      <button onclick={() => error = null}>Dismiss</button>
    </div>
  {/if}
  
  <Admin.Users />
</Admin.Root>
```

---

## 🆘 Troubleshooting

### Common Issues

**Issue: "Admin components must be used within an Admin.Root component"**

```svelte
<!-- ❌ Wrong: Missing Admin.Root -->
<Admin.Users />

<!-- ✅ Correct: Wrap with Admin.Root -->
<Admin.Root {handlers}>
  <Admin.Users />
</Admin.Root>
```

**Issue: "403 Forbidden" on admin actions**

```typescript
// Check authentication token
const token = localStorage.getItem('authToken');
if (!token) {
  // Redirect to login
  goto('/login');
}

// Verify user role
const user = await fetchCurrentUser();
if (user.role !== 'admin') {
  // Show access denied
  error = 'Admin access required';
}
```

**Issue: Logs not updating in real-time**

```svelte
<script lang="ts">
  // Enable auto-refresh in logs component
  let autoRefresh = $state(true);
</script>

<Admin.Logs />
<!-- Auto-refresh is built-in, just enable the checkbox in the UI -->
```

**Issue: Federation changes not taking effect**

```typescript
// Clear cache after federation changes
const handlers = {
  onBlockInstance: async (domain, reason) => {
    await fetch('/api/admin/federation/block', {
      method: 'POST',
      body: JSON.stringify({ domain, reason })
    });
    
    // Clear cache
    await fetch('/api/admin/federation/cache/clear', {
      method: 'POST'
    });
    
    // Reload instances
    await handlers.onFetchInstances();
  }
};
```

---

## 📖 Additional Examples

See the [examples directory](../../examples/) for complete implementation examples:

- [Basic Admin Dashboard](../../examples/admin-dashboard.md)
- [Moderation Workflow](../../examples/moderation-workflow.md)
- [Federation Management](../../examples/federation-management.md)
- [Audit Log Integration](../../examples/audit-logging.md)

---

**For detailed component documentation, see individual component pages linked above.**

