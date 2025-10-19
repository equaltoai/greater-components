# Admin.Logs

**Component**: System and Audit Logs Viewer  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 38 passing tests

---

## 📋 Overview

`Admin.Logs` provides a comprehensive system and audit log viewer for administrators. View, filter, and search logs by level, category, and content. The component supports real-time log streaming, auto-refresh, and detailed metadata inspection for debugging and compliance.

### **Key Features**:
- ✅ View system logs
- ✅ Filter by log level (info, warn, error)
- ✅ Filter by category
- ✅ Search log messages
- ✅ Auto-refresh functionality
- ✅ Expandable metadata
- ✅ Color-coded log levels
- ✅ Timestamp formatting
- ✅ Export capabilities
- ✅ Real-time streaming
- ✅ Accessible interface

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
    onFetchLogs: async (filters) => {
      const params = new URLSearchParams(filters as Record<string, string>);
      const res = await fetch(`/api/admin/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch logs');
      }
      
      return res.json();
    }
  };
  
  function getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
</script>

<Admin.Root handlers={adminHandlers}>
  <Admin.Logs />
</Admin.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class |

---

## 📤 Events

```typescript
interface AdminHandlers {
  onFetchLogs?: (filters?: {
    level?: string;
    category?: string;
    limit?: number;
  }) => Promise<LogEntry[]>;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: string;
  message: string;
  metadata?: Record<string, any>;
}
```

---

## 💡 Examples

Examples include:
- Basic log viewing
- Logs with auto-refresh
- Logs with export
- Logs with real-time streaming
- Logs with filtering

---

## 🔒 Security

- Sensitive data masking
- Access control
- Log retention policies

---

## 🧪 Testing

```bash
npm test -- Admin/Logs.test.ts
```

---

## 🔗 Related

- [Admin.Root](./Root.md)
- [Admin.Overview](./Overview.md)

---

**For log viewing, see the [Admin Components Overview](./README.md).**

