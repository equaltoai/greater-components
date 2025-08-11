# Greater Components API Documentation

**Version:** 1.0.0  
**Build Date:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Documentation Status:** Complete  

## Overview

Greater Components provides a comprehensive set of UI components, design tokens, utilities, and icons for building modern web applications. All packages are built with Svelte 5, TypeScript, and accessibility in mind.

## Package Architecture

### @greater/primitives

Core UI components that form the foundation of any application.

#### Components

##### Button

Interactive button element with loading states and multiple variants.

**Props:**
- `variant?: 'solid' | 'outline' | 'ghost'` - Visual style variant (default: `'solid'`)
- `size?: 'sm' | 'md' | 'lg'` - Component size (default: `'md'`)
- `type?: 'button' | 'submit' | 'reset'` - HTML button type (default: `'button'`)
- `disabled?: boolean` - Disable interaction (default: `false`)
- `loading?: boolean` - Show loading state (default: `false`)
- `class?: string` - Additional CSS classes
- `children?: Snippet` - Button content
- `prefix?: Snippet` - Content before button text
- `suffix?: Snippet` - Content after button text

**Events:**
- `onclick?: (event: MouseEvent) => void` - Click handler
- `onkeydown?: (event: KeyboardEvent) => void` - Keydown handler

**CSS Classes:**
- `.gr-button` - Base button class
- `.gr-button--{variant}` - Variant modifier
- `.gr-button--{size}` - Size modifier
- `.gr-button--loading` - Loading state
- `.gr-button--disabled` - Disabled state

**Example:**
```svelte
<Button variant="solid" size="md" onclick={handleClick}>
  {#snippet prefix()}
    <PlusIcon />
  {/snippet}
  Add Item
</Button>
```

##### Modal

Accessible dialog with focus management and backdrop handling.

**Props:**
- `open?: boolean` - Control modal visibility (bindable, default: `false`)
- `title?: string` - Modal title text
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Modal size (default: `'md'`)
- `closeOnEscape?: boolean` - Enable ESC key closing (default: `true`)
- `closeOnBackdrop?: boolean` - Enable backdrop click closing (default: `true`)
- `preventScroll?: boolean` - Prevent body scroll (default: `true`)
- `class?: string` - Additional CSS classes
- `children?: Snippet` - Modal body content
- `header?: Snippet` - Custom header content
- `footer?: Snippet` - Modal footer content

**Events:**
- `onClose?: () => void` - Modal close callback
- `onOpen?: () => void` - Modal open callback

**Features:**
- Focus trap implementation
- Body scroll lock
- Escape key handling
- Backdrop click handling
- Accessible ARIA attributes

**Example:**
```svelte
<Modal bind:open title="Confirm Action" size="sm">
  <p>Are you sure you want to delete this item?</p>
  
  {#snippet footer()}
    <Button variant="ghost" onclick={() => open = false}>Cancel</Button>
    <Button variant="solid" onclick={confirmDelete}>Delete</Button>
  {/snippet}
</Modal>
```

##### TextField

Text input component with validation and accessibility features.

**Props:**
- `value?: string` - Input value (bindable)
- `type?: string` - HTML input type (default: `'text'`)
- `placeholder?: string` - Placeholder text
- `label?: string` - Input label
- `disabled?: boolean` - Disable input (default: `false`)
- `required?: boolean` - Mark as required (default: `false`)
- `readonly?: boolean` - Make readonly (default: `false`)
- `error?: string` - Error message
- `help?: string` - Help text
- `class?: string` - Additional CSS classes

**Events:**
- `oninput?: (event: Event) => void` - Input change handler
- `onfocus?: (event: FocusEvent) => void` - Focus handler
- `onblur?: (event: FocusEvent) => void` - Blur handler

**Features:**
- Floating label design
- Error state styling
- Help text support
- Full accessibility

##### Additional Components

- **Menu** - Dropdown menu with keyboard navigation
- **Tooltip** - Smart positioning tooltip
- **Tabs** - Tab navigation with ARIA semantics
- **Avatar** - User avatar with fallbacks
- **Skeleton** - Loading skeleton animations
- **ThemeSwitcher** - Theme selection component
- **ThemeProvider** - Application theme context

#### Exports

```typescript
// Components
export { Button, TextField, Modal, Menu, Tooltip, Tabs, Avatar, Skeleton, ThemeSwitcher, ThemeProvider } from '@greater/primitives';

// Types
export type { ButtonProps, TextFieldProps, ModalProps, /* ... */ } from '@greater/primitives';

// Theme utilities
export { preferencesStore, getPreferences, getPreferenceState } from '@greater/primitives';
export type { ColorScheme, Density, FontSize, MotionPreference, ThemeColors, UserPreferences, PreferencesState } from '@greater/primitives';
```

### @greater/fediverse

Specialized components for building Fediverse applications.

#### Components

##### StatusCard

Displays a complete social media post with full anatomy.

**Props:**
- `status: Status` - Status data object
- `compact?: boolean` - Use compact layout (default: `false`)
- `showThread?: boolean` - Show thread indicators (default: `true`)
- `onLike?: (status: Status) => void` - Like action handler
- `onBoost?: (status: Status) => void` - Boost action handler
- `onReply?: (status: Status) => void` - Reply action handler
- `onShare?: (status: Status) => void` - Share action handler

**Features:**
- Rich text content rendering
- Media attachment display
- Action buttons with animations
- Accessibility optimized
- Thread context indicators

##### TimelineVirtualized

High-performance virtualized timeline for rendering thousands of posts.

**Props:**
- `items: Status[]` - Array of status items
- `itemHeight?: number` - Fixed item height (default: auto-calculated)
- `overscan?: number` - Items to render outside viewport (default: `5`)
- `onLoadMore?: () => void` - Infinite scroll handler
- `loading?: boolean` - Loading state (default: `false`)
- `class?: string` - Additional CSS classes

**Features:**
- Virtual scrolling for performance
- Scroll position persistence
- Infinite loading support
- Responsive item heights
- Smooth scrolling animations

##### Additional Components

- **ActionBar** - Social action buttons (like, boost, reply, share)
- **ComposeBox** - Post creation interface with media support
- **ContentRenderer** - Sanitized HTML content with mention/hashtag support
- **ProfileHeader** - User profile information and stats
- **NotificationsFeed** - Grouped notifications display
- **NotificationItem** - Individual notification rendering
- **SettingsPanel** - Timeline and notification preferences

#### Real-time Components

- **TimelineVirtualizedReactive** - Timeline with live streaming updates
- **NotificationsFeedReactive** - Notifications with real-time updates
- **RealtimeWrapper** - Add real-time capabilities to any component

#### Type Definitions

Complete TypeScript definitions for ActivityPub and Mastodon-compatible data structures:

```typescript
// Core types
export type { Status, Account, MediaAttachment, Notification, Poll } from '@greater/fediverse';

// Notification types
export type { MentionNotification, FollowNotification, ReblogNotification } from '@greater/fediverse';

// Component props
export type { StatusCardProps, TimelineProps, ComposeBoxProps } from '@greater/fediverse';
```

### @greater/tokens

Design system tokens providing consistent styling across all components.

#### Token Categories

##### Colors
- Base colors: `white`, `black`
- Gray scale: `gray-50` through `gray-950`
- Brand colors: `primary-50` through `primary-950`
- Semantic colors: `success`, `warning`, `error`

##### Typography
- Font families: `sans`, `serif`, `mono`
- Font sizes: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`
- Font weights: `normal`, `medium`, `semibold`, `bold`
- Line heights: `tight`, `normal`, `relaxed`, `loose`

##### Spacing
- Scale: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24`, `32`
- Values in rem units for consistent scaling

##### Layout
- Border radius: `none`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `full`
- Shadows: `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `inner`, `none`
- Motion: Duration and easing curves

#### Theme System

Three built-in themes with semantic token mappings:

- **Light Theme** - Default light mode
- **Dark Theme** - Dark mode variant
- **High Contrast** - WCAG AAA compliant high contrast

#### Usage

```typescript
// Import tokens
import { tokens, themes, getColor, getSpacing } from '@greater/tokens';

// CSS custom properties automatically available
.my-component {
  color: var(--gr-semantic-foreground-primary);
  padding: var(--gr-spacing-scale-4);
  border-radius: var(--gr-radii-md);
}

// TypeScript helpers
const primaryColor = getColor('primary-600');
const mediumSpacing = getSpacing('4');
```

### @greater/icons

Comprehensive icon library with over 300 SVG icons.

#### Icon Categories

- **UI Icons** - Common interface elements
- **Navigation** - Arrows, chevrons, directional indicators
- **Actions** - Edit, delete, save, share operations
- **Social** - Platform-specific and general social icons
- **Fediverse** - boost, favorite, reply, mention specialized icons
- **Media** - Play, pause, volume controls
- **Communication** - Mail, message, phone icons
- **Status** - Success, error, warning, info indicators

#### Usage

```svelte
<!-- Named imports -->
import { HomeIcon, SettingsIcon, BellIcon } from '@greater/icons';

<HomeIcon />
<SettingsIcon class="icon-large" />
<BellIcon aria-label="Notifications" />

<!-- Dynamic imports -->
import { getIcon } from '@greater/icons';

{#await getIcon('home') then IconComponent}
  <svelte:component this={IconComponent} />
{/await}
```

#### Icon Aliases

Common aliases for Fediverse applications:
- `like` → `favorite`
- `repost` → `boost`
- `reblog` → `boost`
- `notifications` → `bell`
- `profile` → `user`

### @greater/utils

Utility functions for common web application tasks.

#### HTML Sanitization

```typescript
import { sanitizeHtml, createSanitizerConfig } from '@greater/utils';

// Safe HTML rendering
const cleanHtml = sanitizeHtml(userContent);

// Custom configuration
const config = createSanitizerConfig({
  allowedTags: ['p', 'strong', 'em'],
  allowedAttributes: { 'a': ['href'] }
});
```

#### Time Formatting

```typescript
import { formatRelativeTime, formatAbsoluteTime } from '@greater/utils';

// Relative timestamps
const relativeTime = formatRelativeTime(date); // "2 hours ago"

// Absolute formatting
const absoluteTime = formatAbsoluteTime(date, { format: 'full' });
```

#### Link Processing

```typescript
import { linkifyMentions, linkifyHashtags, processContent } from '@greater/utils';

// Process mentions and hashtags
const processed = processContent(text, {
  mentions: true,
  hashtags: true,
  links: true
});
```

#### Keyboard Shortcuts

```typescript
import { createShortcutManager, defineShortcut } from '@greater/utils';

const shortcuts = createShortcutManager();

shortcuts.register(
  defineShortcut('cmd+k', () => openSearch())
);
```

### @greater/adapters

Protocol adapters for connecting to different Fediverse servers.

#### Transport Management

```typescript
import { TransportManager, createHttpClient } from '@greater/adapters';

// Create transport manager
const transport = new TransportManager({
  baseUrl: 'https://mastodon.social',
  adapter: 'mastodon'
});

// Real-time streaming
transport.connect({
  stream: 'user',
  onMessage: (message) => handleMessage(message),
  onError: (error) => handleError(error)
});
```

#### Server Adapters

- **Mastodon** - Full Mastodon API compatibility
- **Pleroma** - Pleroma-specific features
- **Lesser** - Minimal ActivityPub implementation

### @greater/testing

Testing utilities and accessibility helpers.

#### Component Testing

```typescript
import { render, fireEvent, within } from '@greater/testing';
import { Button } from '@greater/primitives';

test('button click handling', () => {
  const handleClick = vi.fn();
  const { getByRole } = render(Button, { props: { onclick: handleClick } });
  
  fireEvent.click(getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

#### Accessibility Testing

```typescript
import { checkA11y, getAxeRules } from '@greater/testing';

test('component accessibility', async () => {
  const { container } = render(MyComponent);
  await checkA11y(container);
});
```

## Common Patterns

### Theme Integration

```svelte
<script>
  import { ThemeProvider } from '@greater/primitives';
  import { preferencesStore } from '@greater/primitives';
</script>

<ThemeProvider>
  <App />
</ThemeProvider>
```

### Responsive Design

```css
.component {
  /* Mobile first */
  padding: var(--gr-spacing-scale-2);
  
  /* Tablet */
  @media (min-width: 768px) {
    padding: var(--gr-spacing-scale-4);
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    padding: var(--gr-spacing-scale-6);
  }
}
```

### Real-time Integration

```svelte
<script>
  import { TimelineVirtualizedReactive } from '@greater/fediverse';
  import { createTimelineIntegration } from '@greater/fediverse';
  
  const timeline = createTimelineIntegration({
    server: 'mastodon.social',
    stream: 'public:local'
  });
</script>

<TimelineVirtualizedReactive 
  items={timeline.items}
  onLoadMore={timeline.loadMore}
/>
```

### Custom Theming

```css
:root {
  /* Override design tokens */
  --gr-color-primary-600: #your-brand-color;
  --gr-typography-fontFamily-sans: "Your Font", system-ui;
}

/* Component customization */
.gr-button--solid {
  background: linear-gradient(135deg, #your-gradient);
}
```

## Migration and Upgrade

### Breaking Changes

All breaking changes are documented in [CHANGELOG.md](./CHANGELOG.md) with:
- Clear migration instructions
- Before/after code examples
- Automated codemod tools where available
- Timeline for deprecation removal

### Version Compatibility

- **Node.js**: >= 20.0.0
- **TypeScript**: >= 5.0.0
- **Svelte**: >= 5.0.0
- **Browser Support**: Modern evergreen browsers

## Performance Considerations

### Bundle Size

- Tree-shakeable exports minimize bundle impact
- Individual component imports supported
- CSS is automatically optimized and purged

### Runtime Performance

- Virtual scrolling for large lists
- Optimized re-renders with Svelte 5 runes
- Lazy loading for non-critical components
- Efficient event handling patterns

## Support and Community

### Documentation

- [API Reference](./API_DOCUMENTATION.md) - This document
- [Component Storybook](./storybook/) - Interactive examples
- [Migration Guides](./docs/migration/) - Version upgrade instructions

### Community

- [GitHub Discussions](https://github.com/greater/greater-components/discussions) - Questions and community
- [Issue Tracker](https://github.com/greater/greater-components/issues) - Bug reports and feature requests
- [Contributing Guide](./CONTRIBUTING.md) - Development and contribution guidelines

---

*This documentation is automatically updated with each release. Last updated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")*