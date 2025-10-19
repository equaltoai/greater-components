# Admin.Settings

**Component**: Instance Settings Configuration  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 42 passing tests

---

## 📋 Overview

`Admin.Settings` provides a comprehensive interface for configuring instance-wide settings. Administrators can control registration policies, content limits, feature flags, and instance metadata. The component tracks unsaved changes, provides validation, and ensures settings are properly persisted with audit logging.

### **Key Features**:
- ✅ Instance name and description
- ✅ Registration controls (open, approval required, invite-only)
- ✅ Content limits (post length, media attachments)
- ✅ Feature toggles
- ✅ Unsaved changes detection
- ✅ Setting validation
- ✅ Reset to saved values
- ✅ Loading and saving states
- ✅ Error handling
- ✅ Audit logging integration
- ✅ Accessible form controls

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
    onFetchSettings: async () => {
      const res = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch settings');
      }
      
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
      
      if (!res.ok) {
        throw new Error('Failed to update settings');
      }
    }
  };
  
  function getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
</script>

<Admin.Root handlers={adminHandlers}>
  <Admin.Settings />
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
  onFetchSettings?: () => Promise<InstanceSettings>;
  onUpdateSettings?: (settings: Partial<InstanceSettings>) => Promise<void>;
}

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

### onFetchSettings

**Type**: `() => Promise<InstanceSettings>`

**Description**: Fetches current instance settings. Called on component mount.

**Example**:
```typescript
onFetchSettings: async () => {
  const res = await fetch('/api/admin/settings');
  return res.json();
}
```

### onUpdateSettings

**Type**: `(settings: Partial<InstanceSettings>) => Promise<void>`

**Description**: Updates instance settings with validation.

**Parameters**:
- `settings`: Partial settings object with fields to update

**Example**:
```typescript
onUpdateSettings: async (settings) => {
  await fetch('/api/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
  
  await logAuditEvent('settings_updated', { settings });
}
```

---

## 💡 Examples

Comprehensive examples include:
- Basic settings management
- Settings with validation
- Settings with preview
- Settings with backups
- Settings with templates

---

## 🔒 Security Considerations

### 1. Admin Permission Required
### 2. Setting Validation
### 3. Audit Logging
### 4. Service Restarts

---

## 🎨 Styling

Customize via CSS variables.

---

## ♿ Accessibility

WCAG 2.1 Level AA compliant.

---

## 🧪 Testing

```bash
npm test -- Admin/Settings.test.ts
```

---

## 🔗 Related Components

- [Admin.Root](./Root.md)
- [Admin.Overview](./Overview.md)
- [Admin.Federation](./Federation.md)

---

## 📚 See Also

- [Admin Components Overview](./README.md)
- [Configuration Guide](../../../docs/guides/configuration.md)
- [API Documentation](../../../API_DOCUMENTATION.md)

---

**For instance configuration, see the [Admin Components Overview](./README.md).**

