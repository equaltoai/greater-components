# Status.Content

**Component**: Content Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 45 passing tests

---

## 📋 Overview

`Status.Content` displays the HTML content of a status with proper sanitization, formatting, and content warning support. It automatically handles mentions, hashtags, custom emojis, and sensitive content toggling.

### **Key Features**:
- ✅ **HTML Rendering** - Safe HTML content display with DOMPurify
- ✅ **Content Warnings** - Automatic sensitive content hiding/showing
- ✅ **Mention Parsing** - Clickable @mentions with proper links
- ✅ **Hashtag Support** - Clickable #hashtags
- ✅ **Custom Emojis** - :emoji: replacement with images
- ✅ **Link Safety** - Automatic rel="noopener noreferrer" on external links
- ✅ **XSS Prevention** - Content sanitization to prevent attacks
- ✅ **Accessible** - Proper ARIA attributes and semantic HTML

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const status: GenericStatus = {
    id: '1',
    content: '<p>Hello <a href="https://social.example/@alice">@alice</a>! Check out <a href="https://social.example/tags/svelte">#svelte</a></p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 5,
    favouritesCount: 12,
    repliesCount: 3
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `Snippet` | Default content renderer | No | Custom content rendering |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 💡 Examples

### Example 1: Basic Content Display

Standard HTML content with links, mentions, and hashtags:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const status: GenericStatus = {
    id: '1',
    content: `
      <p>Just published a new blog post about web components! 🎉</p>
      <p>Check it out: <a href="https://blog.example.com/web-components">blog.example.com/web-components</a></p>
      <p>Thanks to <a href="https://social.example/@alice">@alice</a> for the inspiration!</p>
      <p><a href="https://social.example/tags/WebComponents">#WebComponents</a> <a href="https://social.example/tags/JavaScript">#JavaScript</a></p>
    `,
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 15,
    favouritesCount: 42,
    repliesCount: 8,
    mentions: [
      {
        id: '1',
        username: 'alice',
        acct: 'alice@social.example',
        url: 'https://social.example/@alice'
      }
    ],
    tags: [
      { name: 'WebComponents', url: 'https://social.example/tags/WebComponents' },
      { name: 'JavaScript', url: 'https://social.example/tags/JavaScript' }
    ]
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>

<style>
  /* Content links are automatically styled */
  :global(.status-content a) {
    color: #1d9bf0;
    text-decoration: none;
    font-weight: 500;
  }

  :global(.status-content a:hover) {
    text-decoration: underline;
  }

  /* Mentions get special styling */
  :global(.status-content .mention) {
    color: #1d9bf0;
    font-weight: 600;
  }

  /* Hashtags get special styling */
  :global(.status-content .hashtag) {
    color: #1d9bf0;
    font-weight: 600;
  }
</style>
```

---

### Example 2: Content Warning/Sensitive Content

Display sensitive content with toggle:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const sensitiveStatus: GenericStatus = {
    id: '1',
    content: '<p>This is the actual content that contains spoilers for the latest episode...</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 5,
    favouritesCount: 10,
    repliesCount: 2,
    sensitive: true, // Mark as sensitive
    spoilerText: 'TV Show Spoilers - Episode 5', // Content warning text
  };
</script>

<Status.Root status={sensitiveStatus}>
  <Status.Header />
  
  <!-- ContentRenderer automatically handles CW toggle -->
  <Status.Content />
  
  <Status.Actions />
</Status.Root>

<style>
  /* Content warning styling */
  :global(.content-warning) {
    padding: 1rem;
    background: #fef3c7;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    margin: 0.5rem 0;
  }

  :global(.content-warning__text) {
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.5rem;
  }

  :global(.content-warning__toggle) {
    padding: 0.5rem 1rem;
    background: #f59e0b;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  :global(.content-warning__toggle:hover) {
    background: #d97706;
  }

  /* Hidden content */
  :global(.status-content--hidden) {
    filter: blur(20px);
    user-select: none;
    pointer-events: none;
  }
</style>
```

---

### Example 3: Content with Custom Emojis

Replace :emoji: codes with custom emoji images:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithEmojis: GenericStatus = {
    id: '1',
    content: '<p>Great work everyone! :party_parrot: :heart_eyes: :fire:</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 50,
    favouritesCount: 150,
    repliesCount: 25,
    emojis: [
      {
        shortcode: 'party_parrot',
        url: 'https://cdn.example.com/emojis/party_parrot.gif',
        staticUrl: 'https://cdn.example.com/emojis/party_parrot.png',
        visibleInPicker: true
      },
      {
        shortcode: 'heart_eyes',
        url: 'https://cdn.example.com/emojis/heart_eyes.png',
        staticUrl: 'https://cdn.example.com/emojis/heart_eyes.png',
        visibleInPicker: true
      },
      {
        shortcode: 'fire',
        url: 'https://cdn.example.com/emojis/fire.gif',
        staticUrl: 'https://cdn.example.com/emojis/fire.png',
        visibleInPicker: true
      }
    ]
  };

  // ContentRenderer automatically replaces :emoji: with <img> tags
</script>

<Status.Root status={statusWithEmojis}>
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>

<style>
  /* Custom emoji styling */
  :global(.status-content .custom-emoji) {
    width: 1.25em;
    height: 1.25em;
    vertical-align: middle;
    object-fit: contain;
    margin: 0 0.1em;
  }

  /* Animate GIF emojis on hover */
  :global(.status-content .custom-emoji[data-animated="true"]) {
    cursor: pointer;
  }
</style>
```

---

### Example 4: Long Content with Read More

Truncate long content with expand button:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const longStatus: GenericStatus = {
    id: '1',
    content: `
      <p>This is a very long post with multiple paragraphs...</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>More content continues here with even more details about the topic...</p>
    `,
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 10,
    favouritesCount: 25,
    repliesCount: 5
  };

  let isExpanded = $state(false);
  const MAX_LENGTH = 280;

  const shouldTruncate = $derived(
    status.content.length > MAX_LENGTH && !isExpanded
  );

  const displayContent = $derived(
    shouldTruncate
      ? status.content.substring(0, MAX_LENGTH) + '...'
      : status.content
  );
</script>

<Status.Root status={longStatus}>
  <Status.Header />
  
  <Status.Content>
    {#snippet content()}
      <div class="long-content">
        <div class="content-text" class:truncated={shouldTruncate}>
          {@html displayContent}
        </div>
        
        {#if status.content.length > MAX_LENGTH}
          <button 
            class="read-more-button"
            onclick={() => isExpanded = !isExpanded}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        {/if}
      </div>
    {/snippet}
  </Status.Content>
  
  <Status.Actions />
</Status.Root>

<style>
  .long-content {
    position: relative;
  }

  .content-text {
    transition: max-height 0.3s ease;
  }

  .content-text.truncated {
    max-height: 150px;
    overflow: hidden;
    position: relative;
  }

  .content-text.truncated::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(transparent, white);
    pointer-events: none;
  }

  .read-more-button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    color: #1d9bf0;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .read-more-button:hover {
    background: #f7f9fa;
    border-color: #1d9bf0;
  }

  @media (prefers-reduced-motion: reduce) {
    .content-text {
      transition: none;
    }
  }
</style>
```

---

### Example 5: Content with Link Previews

Display rich link previews for URLs:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithCard: GenericStatus = {
    id: '1',
    content: '<p>Great article about Svelte 5 runes!</p><p><a href="https://svelte.dev/blog/runes">svelte.dev/blog/runes</a></p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 100,
    favouritesCount: 300,
    repliesCount: 50,
    card: {
      url: 'https://svelte.dev/blog/runes',
      title: 'Introducing Svelte 5 Runes',
      description: 'A new way to manage reactivity in Svelte applications with powerful runes',
      type: 'link',
      authorName: 'Svelte Team',
      authorUrl: 'https://svelte.dev',
      providerName: 'Svelte',
      providerUrl: 'https://svelte.dev',
      html: '',
      width: 1200,
      height: 630,
      image: 'https://svelte.dev/images/runes-og.png',
      embedUrl: ''
    }
  };
</script>

<Status.Root status={statusWithCard}>
  <Status.Header />
  <Status.Content />
  
  <!-- Link preview card -->
  {#if statusWithCard.card}
    <a 
      href={statusWithCard.card.url}
      class="link-preview-card"
      target="_blank"
      rel="noopener noreferrer"
    >
      {#if statusWithCard.card.image}
        <div class="card-image">
          <img 
            src={statusWithCard.card.image} 
            alt={statusWithCard.card.title}
            loading="lazy"
          />
        </div>
      {/if}
      
      <div class="card-content">
        <div class="card-provider">{statusWithCard.card.providerName}</div>
        <div class="card-title">{statusWithCard.card.title}</div>
        <div class="card-description">{statusWithCard.card.description}</div>
        <div class="card-url">{new URL(statusWithCard.card.url).hostname}</div>
      </div>
    </a>
  {/if}
  
  <Status.Actions />
</Status.Root>

<style>
  .link-preview-card {
    display: flex;
    margin-top: 0.5rem;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  .link-preview-card:hover {
    background: #f7f9fa;
    border-color: #1d9bf0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .card-image {
    flex-shrink: 0;
    width: 200px;
    background: #f7f9fa;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-content {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-provider {
    font-size: 0.75rem;
    color: #536471;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #0f1419;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .card-description {
    font-size: 0.875rem;
    color: #536471;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .card-url {
    font-size: 0.75rem;
    color: #1d9bf0;
    margin-top: auto;
  }

  @media (max-width: 640px) {
    .link-preview-card {
      flex-direction: column;
    }

    .card-image {
      width: 100%;
      height: 200px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .link-preview-card {
      transition: none;
    }
  }
</style>
```

---

### Example 6: Content with Quote Detection

Detect and style quoted text:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const statusWithQuote: GenericStatus = {
    id: '1',
    content: `
      <p>I completely agree with this:</p>
      <blockquote>
        <p>"The best way to predict the future is to invent it."</p>
        <p>— Alan Kay</p>
      </blockquote>
      <p>Let's keep building! 🚀</p>
    `,
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 25,
    favouritesCount: 75,
    repliesCount: 10
  };
</script>

<Status.Root status={statusWithQuote}>
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>

<style>
  /* Blockquote styling */
  :global(.status-content blockquote) {
    margin: 1rem 0;
    padding: 1rem;
    border-left: 4px solid #1d9bf0;
    background: #f0f9ff;
    border-radius: 0 8px 8px 0;
  }

  :global(.status-content blockquote p) {
    margin: 0.5rem 0;
    color: #0f1419;
    font-style: italic;
  }

  :global(.status-content blockquote p:first-child) {
    margin-top: 0;
    font-size: 1.125rem;
    font-weight: 500;
  }

  :global(.status-content blockquote p:last-child) {
    margin-bottom: 0;
    font-size: 0.875rem;
    color: #536471;
  }
</style>
```

---

## 🔒 Security

### Content Sanitization

Status.Content uses DOMPurify to sanitize HTML:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(content, {
  ALLOWED_TAGS: [
    'p', 'br', 'span', 'a',
    'strong', 'em', 'b', 'i', 'u', 's',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre'
  ],
  ALLOWED_ATTR: [
    'href', 'class', 'rel', 'target',
    'title', 'data-*'
  ],
  ALLOW_DATA_ATTR: false,
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
});
```

### XSS Prevention

- ✅ All HTML is sanitized before rendering
- ✅ Script tags are completely removed
- ✅ Event handlers (onclick, etc.) are stripped
- ✅ Data URIs are blocked (except safe ones)
- ✅ External links get rel="noopener noreferrer"

### Safe Link Handling

```html
<!-- External links automatically get security attributes -->
<a 
  href="https://external-site.com" 
  rel="noopener noreferrer nofollow"
  target="_blank"
>
  Link text
</a>
```

---

## 🎨 Styling

### CSS Custom Properties

```css
.status-content {
  /* Text colors */
  --status-text-primary: #0f1419;
  --status-link-color: #1d9bf0;
  --status-mention-color: #1d9bf0;
  --status-hashtag-color: #1d9bf0;
  
  /* Spacing */
  --status-spacing-sm: 0.5rem;
  
  /* Typography */
  --status-font-size-base: 1rem;
  --status-font-size-sm: 0.875rem;
}
```

### Default Styles

```css
.status-content {
  margin: var(--status-spacing-sm, 0.5rem) 0;
  color: var(--status-text-primary, #0f1419);
  font-size: var(--status-font-size-base, 1rem);
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.status-content :global(a) {
  color: var(--status-link-color, #1d9bf0);
  text-decoration: none;
}

.status-content :global(a:hover) {
  text-decoration: underline;
}

.status-content :global(.mention),
.status-content :global(.hashtag) {
  color: var(--status-link-color, #1d9bf0);
  font-weight: 500;
}

.status-content :global(p) {
  margin: 0.5em 0;
}

.status-content :global(p:first-child) {
  margin-top: 0;
}

.status-content :global(p:last-child) {
  margin-bottom: 0;
}
```

---

## ♿ Accessibility

### Semantic HTML

```html
<div class="status-content">
  <!-- Properly structured HTML -->
  <p>Post content with <a href="#">links</a></p>
</div>
```

### Content Warnings

```html
<div class="content-warning" role="region" aria-label="Content warning">
  <p class="content-warning__text">Spoiler warning</p>
  <button 
    class="content-warning__toggle"
    aria-expanded="false"
    aria-controls="sensitive-content"
  >
    Show content
  </button>
</div>

<div 
  id="sensitive-content"
  class="status-content"
  aria-hidden="true"
>
  <!-- Hidden sensitive content -->
</div>
```

---

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/svelte';
import { Status } from '@equaltoai/greater-components-fediverse';
import DOMPurify from 'isomorphic-dompurify';

describe('Status.Content', () => {
  it('renders HTML content', () => {
    const status = mockStatus({
      content: '<p>Test content</p>'
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('sanitizes dangerous HTML', () => {
    const status = mockStatus({
      content: '<p>Safe</p><script>alert("xss")</script>'
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText('Safe')).toBeInTheDocument();
    expect(screen.queryByText(/alert/)).not.toBeInTheDocument();
  });

  it('shows content warning for sensitive content', () => {
    const status = mockStatus({
      content: '<p>Sensitive</p>',
      sensitive: true,
      spoilerText: 'CW: Spoilers'
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText('CW: Spoilers')).toBeInTheDocument();
    expect(screen.getByText('Show content')).toBeInTheDocument();
  });

  it('renders mentions as links', () => {
    const status = mockStatus({
      content: '<p><a href="https://social.example/@alice">@alice</a></p>',
      mentions: [{
        id: '1',
        username: 'alice',
        acct: 'alice@social.example',
        url: 'https://social.example/@alice'
      }]
    });

    render(Status.Root, { props: { status } });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://social.example/@alice');
  });
});
```

---

## 🔗 Related Components

- [Status.Root](./Root.md) - Status context provider
- [Status.Header](./Header.md) - Account header
- [Status.Media](./Media.md) - Media attachments

---

## 📚 See Also

- [Status Components README](./README.md)
- [Content Sanitization Guide](../../guides/content-sanitization.md)
- [XSS Prevention](../../guides/xss-prevention.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0

