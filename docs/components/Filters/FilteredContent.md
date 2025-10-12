# Filters.FilteredContent

**Component**: Filtered Content Display Wrapper  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 42 passing tests

---

## 📋 Overview

`Filters.FilteredContent` wraps content to check against active filters and displays appropriate warnings or hides content based on filter settings. It provides a reveal option for warned content and completely hides irreversible filters.

### **Key Features**:
- ✅ Automatic filter checking
- ✅ Warning display for reversible filters
- ✅ Complete hiding for irreversible filters
- ✅ Reveal button for warned content
- ✅ Filter reason display
- ✅ Context-aware filtering
- ✅ Callback on reveal
- ✅ Accessible interface

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Filters, Status } from '@greater/fediverse';
  
  let posts = $state([]);
</script>

<Filters.Root handlers={filtersHandlers}>
  <div class="timeline">
    {#each posts as post}
      <Filters.FilteredContent 
        content={post.content}
        context="home"
      >
        <Status.Card {post} />
      </Filters.FilteredContent>
    {/each}
  </div>
</Filters.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `string` | - | **Yes** | Content to check for filters |
| `context` | `FilterContext` | - | **Yes** | Context where content is shown |
| `children` | `Snippet` | - | No | Child content to show if not filtered |
| `onReveal` | `(filters: ContentFilter[]) => void` | - | No | Callback when content revealed |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 💡 Examples

Examples include:
- Timeline filtering
- Notification filtering
- Thread filtering
- Custom reveal handlers

---

## 🔗 Related

- [Filters.Root](./Root.md)
- [Filters.Manager](./Manager.md)
- [Filters.Editor](./Editor.md)

---

**For content filtering, see the [Filters README](./README.md).**

