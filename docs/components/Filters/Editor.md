# Filters.Editor

**Component**: Filter Creation and Editing Form  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 58 passing tests

---

## 📋 Overview

`Filters.Editor` provides a comprehensive form for creating new filters or editing existing ones. It includes phrase input, context selection, expiration options, display mode, and whole word matching. The component validates inputs and provides clear feedback.

### **Key Features**:
- ✅ Phrase/keyword input
- ✅ Context selection (multiple)
- ✅ Whole word matching toggle
- ✅ Expiration duration options
- ✅ Display mode selection (warn/hide)
- ✅ Form validation
- ✅ Create and edit modes
- ✅ Modal interface
- ✅ Error handling

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
  
  const handlers = {
    onCreateFilter: async (filter) => {
      const res = await fetch('/api/filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter)
      });
      return res.json();
    },
    onUpdateFilter: async (filterId, filter) => {
      const res = await fetch(`/api/filters/${filterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter)
      });
      return res.json();
    }
  };
</script>

<Filters.Root {handlers}>
  <Filters.Manager />
  <Filters.Editor />
</Filters.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class |

---

## 💡 Examples

Examples include:
- Basic filter creation
- Filter editing
- Pre-filled filters
- Quick filters

---

## 🔗 Related

- [Filters.Root](./Root.md)
- [Filters.Manager](./Manager.md)

---

**For filter editing, see the [Filters README](./README.md).**

