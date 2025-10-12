# Filters.Root

**Component**: Filters Context Provider  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 48 passing tests

---

## 📋 Overview

`Filters.Root` is the context provider for all filter components. It establishes the filters context with event handlers, manages shared state, and provides centralized error handling and loading states for the filter system.

### **Key Features**:
- ✅ Context provider for filter components
- ✅ Centralized handler management
- ✅ Shared state (filters, selected filter, editor state)
- ✅ Loading and saving state coordination
- ✅ Error handling
- ✅ Auto-fetch on mount
- ✅ Filter matching logic
- ✅ Type-safe handlers

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Filters } from '@greater/fediverse';
  
  const filtersHandlers = {
    onFetchFilters: async () => {
      const res = await fetch('/api/filters', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      return res.json();
    },
    
    onCreateFilter: async (filter) => {
      const res = await fetch('/api/filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(filter)
      });
      return res.json();
    },
    
    onUpdateFilter: async (filterId, filter) => {
      const res = await fetch(`/api/filters/${filterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(filter)
      });
      return res.json();
    },
    
    onDeleteFilter: async (filterId) => {
      await fetch(`/api/filters/${filterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
    }
  };
  
  function getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
</script>

<Filters.Root handlers={filtersHandlers}>
  <Filters.Manager />
  <Filters.Editor />
</Filters.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `handlers` | `FiltersHandlers` | `{}` | No | Event handlers for filter operations |
| `autoFetch` | `boolean` | `true` | No | Auto-fetch filters on mount |
| `class` | `string` | `''` | No | Custom CSS class |
| `children` | `Snippet` | - | No | Child components |

---

## 📤 Events

```typescript
interface FiltersHandlers {
  onFetchFilters?: () => Promise<ContentFilter[]>;
  onCreateFilter?: (filter: FilterFormData) => Promise<ContentFilter>;
  onUpdateFilter?: (filterId: string, filter: Partial<FilterFormData>) => Promise<ContentFilter>;
  onDeleteFilter?: (filterId: string) => Promise<void>;
  onCheckFilters?: (content: string, context: FilterContext) => Promise<ContentFilter[]>;
}

interface ContentFilter {
  id: string;
  phrase: string;
  context: FilterContext[];
  expiresAt: string | null;
  irreversible: boolean;
  wholeWord: boolean;
  createdAt: string;
  updatedAt: string;
}

type FilterContext = 'home' | 'notifications' | 'public' | 'thread' | 'account';
```

---

## 💡 Examples

See comprehensive examples in the [Filters README](./README.md) including:
- Basic setup
- GraphQL integration
- Error handling
- Caching strategies
- Import/export functionality

---

## 🔗 Related

- [Filters.Manager](./Manager.md)
- [Filters.Editor](./Editor.md)
- [Filters.FilteredContent](./FilteredContent.md)

---

**For context provider details, see the [Filters README](./README.md).**

