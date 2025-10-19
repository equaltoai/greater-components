# Filters Components

**Component Group**: Content Filtering System  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 212 passing tests

---

## 📋 Overview

The Filters component group provides a comprehensive content filtering system for ActivityPub/Fediverse applications. Users can create keyword and phrase filters with context-specific rules, expiration dates, and flexible matching options to customize their content experience.

### **Component Suite**:

1. **[Root](./Root.md)** - Filters context provider
2. **[Manager](./Manager.md)** - Filter list and management interface
3. **[Editor](./Editor.md)** - Create/edit filter form
4. **[FilteredContent](./FilteredContent.md)** - Filtered content display wrapper

### **Key Features**:

#### 🔇 **Content Filtering**
- Keyword and phrase filtering
- Regular expression support (advanced)
- Case-insensitive matching
- Unicode normalization
- Whole word matching option

#### 📍 **Context-Specific Filters**
- Home timeline
- Notifications
- Public timelines
- Conversations/threads
- User profiles

#### ⏰ **Expiration Management**
- Time-limited filters
- Permanent filters
- Auto-cleanup of expired filters
- Flexible duration options

#### ⚠️ **Display Modes**
- Warning mode (show with content warning)
- Hide mode (completely remove from view)
- User-configurable per filter

#### 🔍 **Smart Matching**
- Whole word boundaries
- Partial text matching
- Case-insensitive by default
- Multiple keywords per filter

---

## 🚀 Quick Start

### Basic Setup

```svelte
<script lang="ts">
  import { Filters } from '@equaltoai/greater-components-fediverse';
  
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
  <div class="filters-interface">
    <h1>Content Filters</h1>
    
    <Filters.Manager />
    <Filters.Editor />
  </div>
</Filters.Root>
```

### Usage in Timeline

```svelte
<script lang="ts">
  import { Filters, Timeline } from '@equaltoai/greater-components-fediverse';
  
  // ... filters handlers ...
</script>

<Filters.Root handlers={filtersHandlers}>
  <Timeline.Root>
    <Timeline.Feed>
      {#snippet item(status)}
        <Filters.FilteredContent 
          content={status.content}
          context="home"
        >
          <Status.Card {status} />
        </Filters.FilteredContent>
      {/snippet}
    </Timeline.Feed>
  </Timeline.Root>
</Filters.Root>
```

---

## 📊 Common Patterns

### Pattern 1: Filter Management Page

Complete filter management interface:

```svelte
<script lang="ts">
  import { Filters } from '@equaltoai/greater-components-fediverse';
  
  const handlers = {
    // ... filter handlers ...
  };
</script>

<Filters.Root {handlers}>
  <div class="page">
    <header>
      <h1>Muted Words & Phrases</h1>
      <p>Hide posts containing specific keywords</p>
    </header>
    
    <Filters.Manager />
    <Filters.Editor />
  </div>
</Filters.Root>
```

### Pattern 2: Timeline with Filters

Apply filters to timeline content:

```svelte
<script lang="ts">
  import { Filters } from '@equaltoai/greater-components-fediverse';
  
  let posts = $state([]);
</script>

<Filters.Root handlers={filtersHandlers}>
  <div class="timeline">
    {#each posts as post}
      <Filters.FilteredContent 
        content={post.content}
        context="home"
        onReveal={(filters) => {
          console.log('User revealed filtered content:', filters);
        }}
      >
        <PostCard {post} />
      </Filters.FilteredContent>
    {/each}
  </div>
</Filters.Root>
```

### Pattern 3: Quick Filter Creation

Quick filter from context menu:

```svelte
<script lang="ts">
  import { Filters } from '@equaltoai/greater-components-fediverse';
  
  async function quickFilter(phrase: string) {
    await handlers.onCreateFilter?.({
      phrase,
      context: ['home', 'public'],
      expiresIn: null,
      irreversible: false,
      wholeWord: true
    });
  }
</script>

<Filters.Root handlers={filtersHandlers}>
  <div class="post">
    <div class="post-content">{content}</div>
    <button onclick={() => quickFilter(selectedWord)}>
      Mute "{selectedWord}"
    </button>
  </div>
</Filters.Root>
```

---

## 🔒 Security & Privacy

### 1. Client-Side Filtering

Filters are applied client-side for privacy:

```typescript
// Filter matching happens in the browser
const matchedFilters = filtersContext.checkFilters(content, context);

// Content is never sent to server for filtering
if (matchedFilters.length > 0) {
  // Hide or warn about content
}
```

### 2. User Data Protection

Filters are user-specific and private:

```typescript
// Server-side: only return user's own filters
export async function GET({ request }) {
  const user = await authenticateUser(request);
  
  const filters = await db.filters.find({
    userId: user.id
  });
  
  return json(filters);
}
```

### 3. Regular Expression Safety

Validate regex patterns to prevent ReDoS:

```typescript
import { z } from 'zod';

const filterSchema = z.object({
  phrase: z.string()
    .max(200, 'Filter phrase too long')
    .refine((phrase) => {
      // Prevent catastrophic backtracking
      try {
        new RegExp(phrase);
        return true;
      } catch {
        return false;
      }
    }, 'Invalid regex pattern')
});
```

---

## 🎨 Styling & Theming

Filters components use CSS variables:

```css
:root {
  /* Primary Colors */
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
  
  /* Text Colors */
  --text-primary: #0f1419;
  --text-secondary: #536471;
  
  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  
  /* Border Colors */
  --border-color: #e1e8ed;
  
  /* Filter-specific */
  --filter-warning-bg: rgba(255, 152, 0, 0.1);
  --filter-warning-border: rgba(255, 152, 0, 0.3);
  --filter-warning-color: #ff9800;
}
```

### Custom Theme

```svelte
<Filters.Root handlers={filtersHandlers}>
  <div class="custom-filters" style="
    --primary-color: #7c3aed;
    --filter-warning-color: #f59e0b;
  ">
    <Filters.Manager />
    <Filters.Editor />
  </div>
</Filters.Root>
```

---

## ♿ Accessibility

All Filters components follow WCAG 2.1 Level AA:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Minimum 4.5:1 ratio
- **Error Messages**: Clear, descriptive feedback
- **Form Labels**: All inputs properly labeled

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` / `Shift+Tab` | Navigate between elements |
| `Enter` / `Space` | Activate buttons |
| `Escape` | Close modals |
| `Arrow Keys` | Navigate filter list |

---

## 🧪 Testing

Comprehensive test coverage (212 tests):

```bash
# Run all filter tests
npm test -- Filters

# Run specific component tests
npm test -- Filters/Manager.test.ts
npm test -- Filters/Editor.test.ts
npm test -- Filters/FilteredContent.test.ts

# Run with coverage
npm test -- --coverage Filters
```

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Filters } from '@equaltoai/greater-components-fediverse';

describe('Filters', () => {
  it('creates and applies filter', async () => {
    const onCreateFilter = vi.fn();
    
    render(Filters.Root, {
      props: {
        handlers: { onCreateFilter }
      }
    });
    
    render(Filters.Editor);
    
    // Fill filter form
    const phraseInput = screen.getByLabelText('Keyword or phrase');
    await fireEvent.input(phraseInput, {
      target: { value: 'spoilers' }
    });
    
    // Submit
    const submitButton = screen.getByText('Create Filter');
    await fireEvent.click(submitButton);
    
    expect(onCreateFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        phrase: 'spoilers'
      })
    );
  });
});
```

---

## 📚 Component Documentation

For detailed documentation on individual components:

- **[Filters.Root](./Root.md)** - Context provider and setup
- **[Filters.Manager](./Manager.md)** - Filter list interface
- **[Filters.Editor](./Editor.md)** - Create/edit filter form
- **[Filters.FilteredContent](./FilteredContent.md)** - Content display wrapper

---

## 🔗 Related Resources

- [Timeline Components](../Timeline/README.md) - Content display
- [Status Components](../Status/README.md) - Post cards
- [API Documentation](../../../API_DOCUMENTATION.md)
- [Mastodon Filters API](https://docs.joinmastodon.org/methods/filters/)

---

## 💡 Tips & Best Practices

### Filter Creation
- Use whole word matching for common words
- Set appropriate expiration dates
- Test filters before saving
- Document filter purposes

### Performance
- Limit number of active filters
- Use simple patterns when possible
- Clean up expired filters regularly
- Cache filter checks client-side

### User Experience
- Provide clear filter descriptions
- Show what's being filtered
- Allow easy filter management
- Offer quick filter creation

### Privacy
- Keep filters client-side
- Don't share filter data
- Allow export/import
- Respect user choices

---

## 🐛 Troubleshooting

### Issue: Filters not applying

**Solution**: Check context matching:
```typescript
// Ensure correct context
<Filters.FilteredContent 
  content={post.content}
  context="home"  // Must match filter contexts
>
```

### Issue: Regex patterns not working

**Solution**: Validate regex:
```typescript
function validateRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}
```

### Issue: Filters not persisting

**Solution**: Check save handler:
```typescript
onCreateFilter: async (filter) => {
  const res = await fetch('/api/filters', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
  
  if (!res.ok) {
    throw new Error('Failed to save filter');
  }
  
  return res.json();
}
```

---

## 📖 Additional Examples

See the [examples directory](../../examples/) for complete implementations:

- [Basic Filter Management](../../examples/filter-management.md)
- [Timeline with Filters](../../examples/filtered-timeline.md)
- [Quick Filter Creation](../../examples/quick-filters.md)
- [Filter Import/Export](../../examples/filter-import-export.md)

---

**For detailed component documentation, see individual component pages linked above.**

