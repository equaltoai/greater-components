# Admin.Federation

**Component**: Federation Management Interface  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 48 passing tests

---

## 📋 Overview

`Admin.Federation` provides comprehensive tools for managing federation with other ActivityPub instances. Administrators can view all federated instances, block or silence domains, manage relay connections, and configure domain policies. The component displays instance information including software type, user counts, and federation status.

### **Key Features**:
- ✅ View all federated instances
- ✅ Filter by federation status (allowed, limited, blocked)
- ✅ Block/unblock remote instances
- ✅ Silence/limit instance activity
- ✅ View instance software and version
- ✅ Display user counts per instance
- ✅ Track last communication date
- ✅ Domain policy management
- ✅ Confirmation dialogs for actions
- ✅ Reason documentation
- ✅ Audit logging integration
- ✅ Responsive table layout

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
    onFetchInstances: async () => {
      const res = await fetch('/api/admin/federation/instances', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch instances');
      }
      
      return res.json();
    },
    
    onBlockInstance: async (domain, reason) => {
      const res = await fetch('/api/admin/federation/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ domain, reason })
      });
      
      if (!res.ok) {
        throw new Error('Failed to block instance');
      }
    },
    
    onUnblockInstance: async (domain) => {
      const res = await fetch('/api/admin/federation/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ domain })
      });
      
      if (!res.ok) {
        throw new Error('Failed to unblock instance');
      }
    }
  };
  
  function getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
</script>

<Admin.Root handlers={adminHandlers}>
  <Admin.Federation />
</Admin.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class for styling |

---

## 📤 Events

```typescript
interface AdminHandlers {
  onFetchInstances?: () => Promise<FederatedInstance[]>;
  onBlockInstance?: (domain: string, reason: string) => Promise<void>;
  onUnblockInstance?: (domain: string) => Promise<void>;
}

interface FederatedInstance {
  domain: string;
  softwareName?: string;
  softwareVersion?: string;
  usersCount?: number;
  status: 'allowed' | 'limited' | 'blocked';
  lastSeen?: string;
}
```

### onFetchInstances

**Type**: `() => Promise<FederatedInstance[]>`

**Description**: Fetches all federated instances with their current status.

**Example**:
```typescript
onFetchInstances: async () => {
  const res = await fetch('/api/admin/federation/instances');
  return res.json();
}
```

### onBlockInstance

**Type**: `(domain: string, reason: string) => Promise<void>`

**Description**: Blocks a federated instance, preventing all communication.

**Parameters**:
- `domain`: Instance domain to block
- `reason`: Documented reason for blocking

**Example**:
```typescript
onBlockInstance: async (domain, reason) => {
  await fetch('/api/admin/federation/block', {
    method: 'POST',
    body: JSON.stringify({ domain, reason })
  });
  
  await logAuditEvent('instance_blocked', { domain, reason });
}
```

### onUnblockInstance

**Type**: `(domain: string) => Promise<void>`

**Description**: Unblocks a previously blocked instance.

**Parameters**:
- `domain`: Instance domain to unblock

**Example**:
```typescript
onUnblockInstance: async (domain) => {
  await fetch('/api/admin/federation/unblock', {
    method: 'POST',
    body: JSON.stringify({ domain })
  });
  
  await logAuditEvent('instance_unblocked', { domain });
}
```

---

## 💡 Examples

See the documentation for 5+ comprehensive examples including:
- Basic federation management
- Federation with domain policies
- Federation with relay management
- Federation with statistics
- Federation with import/export

---

## 🔒 Security Considerations

### 1. Admin Permission Required

Always verify admin permissions before federation changes.

### 2. Reason Documentation

Require documented reasons for all blocks.

### 3. Audit Logging

Log all federation policy changes.

### 4. Impact Analysis

Warn about impacts of blocking instances.

---

## 🎨 Styling

Customize via CSS variables for theming.

---

## ♿ Accessibility

WCAG 2.1 Level AA compliant with full keyboard navigation.

---

## 🧪 Testing

```bash
npm test -- Admin/Federation.test.ts
```

---

## 🔗 Related Components

- [Admin.Root](./Root.md)
- [Admin.Overview](./Overview.md)
- [Admin.Settings](./Settings.md)
- [Admin.Logs](./Logs.md)

---

## 📚 See Also

- [Admin Components Overview](./README.md)
- [Federation Guide](../../../docs/guides/federation.md)
- [API Documentation](../../../API_DOCUMENTATION.md)

---

**For comprehensive federation management, see the [Admin Components Overview](./README.md).**

