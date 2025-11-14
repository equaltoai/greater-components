# Filters.Manager

**Component**: Filter List and Management Interface  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 64 passing tests

---

## 📋 Overview

`Filters.Manager` displays a list of all content filters with actions to create, edit, and delete filters. It shows filter details including phrases, contexts, expiration dates, and display modes. The component provides a clean interface for managing all user filters.

### **Key Features**:

- ✅ Display all filters
- ✅ Filter details (phrase, contexts, expiration)
- ✅ Edit filter action
- ✅ Delete filter with confirmation
- ✅ Create new filter button
- ✅ Empty state
- ✅ Loading state
- ✅ Error handling
- ✅ Filter count display

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Filters } from '@equaltoai/greater-components-fediverse';

	const handlers = {
		onFetchFilters: async () => {
			const res = await fetch('/api/filters');
			return res.json();
		},
		onDeleteFilter: async (filterId) => {
			await fetch(`/api/filters/${filterId}`, {
				method: 'DELETE',
			});
		},
	};
</script>

<Filters.Root {handlers}>
	<Filters.Manager />
	<Filters.Editor />
</Filters.Root>
```

---

## 🎛️ Props

| Prop    | Type     | Default | Required | Description      |
| ------- | -------- | ------- | -------- | ---------------- |
| `class` | `string` | `''`    | No       | Custom CSS class |

---

## 💡 Examples

Examples include:

- Basic filter list
- Filters with groups
- Filters with search
- Filters with export

---

## 🔗 Related

- [Filters.Root](./Root.md)
- [Filters.Editor](./Editor.md)

---

**For filter management, see the [Filters README](./README.md).**
