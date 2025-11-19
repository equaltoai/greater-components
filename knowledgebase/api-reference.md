# Greater Components API Reference

Complete API documentation for all Greater Components packages.

## Table of Contents

- [Primitives Package](#primitives-package)
- [Headless Package](#headless-package)
- [Fediverse Package](#fediverse-package)
- [Adapters Package](#adapters-package)
- [Tokens Package](#tokens-package)
- [Icons Package](#icons-package)
- [Utils Package](#utils-package)
- [Testing Package](#testing-package)

---

## Primitives Package

`@equaltoai/greater-components-primitives`

### Package Scope

This package provides **20 interactive and layout components** for building any type of website.

**What Primitives Provides:**
- Interactive widgets (buttons, forms, modals, menus)
- Layout primitives (containers, sections, cards)
- Typography components (headings, text)
- Theme system (provider, switcher)

**What Primitives Does NOT Provide:**
- Navigation components (build with HTML + Button)
- Data tables (build with HTML <table>)
- Grid/Flex systems (use CSS Grid/Flexbox)
- Complex page layouts (compose Container + Section + custom CSS)

**For General Websites:**
Primitives work for ANY website type:
- ✅ Landing pages
- ✅ Marketing sites
- ✅ Documentation sites
- ✅ Admin dashboards
- ✅ Fediverse applications

Use HTML for structure, primitives for interactive elements and consistent typography.

### Complete Component List (20 Total)

#### Button

**Purpose:** Interactive button component with variants, sizes, and loading states

**When to use:**
- Primary and secondary actions
- Form submissions
- Dialog confirmations
- Navigation triggers

**When NOT to use:**
- Links to other pages (use anchor tags or SvelteKit links)
- Non-interactive displays

**Props:**
```typescript
interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onclick?: (event: MouseEvent) => void;
  children?: Snippet;
  prefix?: Snippet;  // Icon or content before text
  suffix?: Snippet;  // Icon or content after text
}
```

**Example:**
```svelte
<script>
  import { Button } from '@equaltoai/greater-components-primitives';
  import { SaveIcon } from '@equaltoai/greater-components-icons';
  
  let saving = $state(false);
  
  async function handleSave() {
    saving = true;
    await saveData();
    saving = false;
  }
</script>

<Button 
  variant="solid" 
  size="md"
  loading={saving}
  onclick={handleSave}
>
  {#snippet prefix()}
    <SaveIcon />
  {/snippet}
  Save Changes
</Button>
```

**Accessibility:**
- Full keyboard support (Enter, Space)
- Disabled state properly announced
- Loading state with aria-busy
- Focus indicators visible

#### Modal

**Purpose:** Dialog overlay for focused interactions

**When to use:**
- Confirmation dialogs
- Forms requiring focus
- Multi-step wizards
- Critical warnings

**When NOT to use:**
- Displaying non-critical information (use Tooltip)
- Navigation menus (use Menu)
- Inline content (use Accordion)

**Props:**
```typescript
interface ModalProps {
  open: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closable?: boolean;  // Show close button
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onClose?: () => void;
  children?: Snippet;
  header?: Snippet;
  footer?: Snippet;
}
```

**Example:**
```svelte
<script>
  import { Modal, Button } from '@equaltoai/greater-components-primitives';
  
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Open Modal</Button>

<Modal 
  bind:open 
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
  
  {#snippet footer()}
    <Button variant="ghost" onclick={() => open = false}>
      Cancel
    </Button>
    <Button variant="danger">
      Confirm
    </Button>
  {/snippet}
</Modal>
```

**Accessibility:**
- Focus trapped within modal
- Escape key closes modal
- Focus returns to trigger on close
- Proper ARIA labels and roles

#### TextField

**Purpose:** Single-line text input with validation

**Props:**
```typescript
interface TextFieldProps {
  value: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  prefix?: Snippet;
  suffix?: Snippet;
  oninput?: (value: string) => void;
  onblur?: (event: FocusEvent) => void;
}
```

**Example:**
```svelte
<script>
  import { TextField } from '@equaltoai/greater-components-primitives';
  import { SearchIcon } from '@equaltoai/greater-components-icons';
  
  let searchQuery = $state('');
  let error = $state('');
  
  function handleInput(value: string) {
    searchQuery = value;
    if (value.length < 3 && value.length > 0) {
      error = 'Search must be at least 3 characters';
    } else {
      error = '';
    }
  }
</script>

<TextField
  bind:value={searchQuery}
  type="search"
  label="Search Posts"
  placeholder="Enter search terms..."
  {error}
  oninput={handleInput}
>
  {#snippet prefix()}
    <SearchIcon />
  {/snippet}
</TextField>
```

#### TextArea

**Purpose:** Multi-line text input

**Props:**
```typescript
interface TextAreaProps {
  value: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  oninput?: (value: string) => void;
}
```

#### Select

**Purpose:** Dropdown selection component

**Props:**
```typescript
interface SelectProps {
  value: string | number;
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onchange?: (value: string | number) => void;
}
```

#### Checkbox

**Purpose:** Boolean selection control

**Props:**
```typescript
interface CheckboxProps {
  checked: boolean;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  onchange?: (checked: boolean) => void;
}
```

#### Switch

**Purpose:** Toggle switch for boolean states

**Props:**
```typescript
interface SwitchProps {
  checked: boolean;
  label?: string;
  disabled?: boolean;
  onchange?: (checked: boolean) => void;
}
```

#### Menu

**Purpose:** Dropdown menu with keyboard navigation

**Components:**
- `Menu.Root` - Container
- `Menu.Trigger` - Button to open menu
- `Menu.Items` - Menu items container
- `Menu.Item` - Individual menu item
- `Menu.Separator` - Visual separator

**Example:**
```svelte
<script>
  import { Menu } from '@equaltoai/greater-components-primitives';
</script>

<Menu.Root>
  <Menu.Trigger>Actions</Menu.Trigger>
  <Menu.Items>
    <Menu.Item onclick={() => console.log('edit')}>
      Edit
    </Menu.Item>
    <Menu.Item onclick={() => console.log('share')}>
      Share
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item onclick={() => console.log('delete')}>
      Delete
    </Menu.Item>
  </Menu.Items>
</Menu.Root>
```

#### Tooltip

**Purpose:** Contextual information on hover/focus

**Props:**
```typescript
interface TooltipProps {
  content: string | Snippet;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;  // ms before showing
  children: Snippet;
}
```

#### Tabs

**Purpose:** Organize content into switchable panels

**Components:**
- `Tabs.Root` - Container
- `Tabs.List` - Tab buttons container
- `Tabs.Tab` - Individual tab button
- `Tabs.Panel` - Content panel for each tab

**Example:**
```svelte
<script>
  import { Tabs } from '@equaltoai/greater-components-primitives';
  
  let activeTab = $state('profile');
</script>

<Tabs.Root bind:active={activeTab}>
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
    <Tabs.Tab value="security">Security</Tabs.Tab>
  </Tabs.List>
  
  <Tabs.Panel value="profile">
    <p>Profile content</p>
  </Tabs.Panel>
  <Tabs.Panel value="settings">
    <p>Settings content</p>
  </Tabs.Panel>
  <Tabs.Panel value="security">
    <p>Security content</p>
  </Tabs.Panel>
</Tabs.Root>
```

#### Avatar

**Purpose:** User profile image display

**Props:**
```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;  // Initials or icon
}
```

#### Skeleton

**Purpose:** Loading placeholder

**Props:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
}
```

#### Card

**Purpose:** Content container with elevation, borders, and semantic sections

**Props:**
```typescript
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  hoverable?: boolean;
  header?: Snippet;
  footer?: Snippet;
  children?: Snippet;
}
```

**Example:**
```svelte
<script>
  import { Card, Button } from '@equaltoai/greater-components-primitives';
</script>

<Card variant="elevated" padding="md">
  {#snippet header()}
    <h3>Card Title</h3>
  {/snippet}

  <p>Card content goes here.</p>

  {#snippet footer()}
    <Button>Action</Button>
  {/snippet}
</Card>
```

#### Container

**Purpose:** Max-width wrapper for content centering

**Props:**
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean | 'sm' | 'md' | 'lg';
  centered?: boolean;
  class?: string;
  children?: Snippet;
}
```

#### Section

**Purpose:** Semantic section wrapper with consistent vertical spacing

**Props:**
```typescript
interface SectionProps {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: boolean | 'sm' | 'md' | 'lg';
  centered?: boolean;
  class?: string;
  children?: Snippet;
}
```

#### Heading

**Purpose:** Semantic heading with consistent typography

**Props:**
```typescript
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  class?: string;
  children?: Snippet;
}
```

#### Text

**Purpose:** Paragraph and inline text component with size, weight, and color variants

**Props:**
```typescript
interface TextProps {
  as?: 'p' | 'span' | 'div' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  lines?: number;
  class?: string;
  children?: Snippet;
}
```

#### ThemeProvider

**Purpose:** Provides theme context to components

**Props:**
```typescript
interface ThemeProviderProps {
  theme?: 'light' | 'dark' | 'high-contrast';
  defaultTheme?: 'light' | 'dark' | 'high-contrast';
  children: Snippet;
}
```

#### ThemeSwitcher

**Purpose:** UI control for theme switching

**Props:**
```typescript
interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'button';
}
```

---

## Headless Package

`@equaltoai/greater-components-headless`

Behavior-only components for maximum styling control.

### createButton

**Purpose:** Creates button behavior without styling

**When to use:**
- Need complete styling control
- Have existing design system
- Want minimal bundle size

**API:**
```typescript
function createButton(config: {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;  // For toggle buttons
  onClick?: (event: MouseEvent) => void | Promise<void>;
}): {
  state: {
    disabled: boolean;
    loading: boolean;
    pressed: boolean;
  };
  actions: {
    button: (node: HTMLElement) => { destroy: () => void };
  };
  helpers: {
    setLoading: (loading: boolean) => void;
    setPressed: (pressed: boolean) => void;
    setDisabled: (disabled: boolean) => void;
  };
}
```

**Example:**
```svelte
<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';
  
  const saveButton = createButton({
    onClick: async () => {
      saveButton.helpers.setLoading(true);
      await saveData();
      saveButton.helpers.setLoading(false);
    }
  });
</script>

<button use:saveButton.actions.button class="my-button">
  {#if saveButton.state.loading}
    Saving...
  {:else}
    Save
  {/if}
</button>

<style>
  .my-button {
    /* Your complete custom styling */
  }
</style>
```

### createModal

**Purpose:** Creates modal behavior without styling

**API:**
```typescript
function createModal(config: {
  open?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onClose?: () => void;
}): {
  state: {
    open: boolean;
  };
  actions: {
    overlay: (node: HTMLElement) => { destroy: () => void };
    content: (node: HTMLElement) => { destroy: () => void };
    close: (node: HTMLElement) => { destroy: () => void };
  };
  helpers: {
    open: () => void;
    close: () => void;
  };
}
```

### createMenu

**Purpose:** Creates menu behavior with keyboard navigation

**API:**
```typescript
function createMenu(config?: {
  onSelect?: (value: string) => void;
}): {
  state: {
    isOpen: boolean;
    activeIndex: number;
  };
  actions: {
    trigger: (node: HTMLElement) => { destroy: () => void };
    items: (node: HTMLElement) => { destroy: () => void };
    item: (node: HTMLElement) => { destroy: () => void };
  };
  helpers: {
    open: () => void;
    close: () => void;
  };
}
```

### createTooltip

**Purpose:** Creates tooltip behavior

### createTabs

**Purpose:** Creates tabs behavior with keyboard navigation

---

## Fediverse Package

`@equaltoai/greater-components-fediverse`

Social media components for ActivityPub applications.

### Status Component

**Purpose:** Display a single Fediverse status/post

**Components:**
- `Status.Root` - Container
- `Status.Header` - Author info and timestamp
- `Status.Content` - Post text and media
- `Status.Actions` - Reply, boost, favorite buttons
- `Status.LesserMetadata` - Lesser-specific metadata
- `Status.CommunityNotes` - Community notes UI

**Example:**
```svelte
<script>
  import { Status } from '@equaltoai/greater-components-fediverse';
  
  let status = {
    id: '123',
    account: {
      displayName: 'John Doe',
      username: 'johndoe',
      avatar: 'https://...'
    },
    content: 'Hello Fediverse!',
    createdAt: '2025-01-01T12:00:00Z',
    favouritesCount: 10,
    reblogsCount: 5
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Actions 
    onReply={handleReply}
    onBoost={handleBoost}
    onFavorite={handleFavorite}
  />
</Status.Root>
```

### Timeline Stores

#### createTimelineStore

**Purpose:** Standard ActivityPub timeline management

**API:**
```typescript
function createTimelineStore(config: {
  adapter: BaseAdapter;
  type: 'HOME' | 'LOCAL' | 'FEDERATED' | 'HASHTAG' | 'LIST' | 'ACCOUNT';
  hashtags?: string[];
  accountId?: string;
  listId?: string;
  virtualScrolling?: boolean;
  estimateSize?: number;
  onError?: (error: Error) => void;
}): {
  items: Status[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  prepend: (status: Status) => void;
  remove: (statusId: string) => void;
  virtualItems?: VirtualItem[];  // If virtualScrolling enabled
}
```

**Example:**
```svelte
<script>
  import { createTimelineStore } from '@equaltoai/greater-components-fediverse';
  import { MastodonRESTAdapter } from '@equaltoai/greater-components-adapters';
  
  const adapter = new MastodonRESTAdapter({
    instanceUrl: 'https://mastodon.social',
    accessToken: token
  });
  
  const timeline = createTimelineStore({
    adapter,
    type: 'HOME',
    virtualScrolling: true,
    estimateSize: 400
  });
</script>

{#if timeline.isLoading}
  <p>Loading...</p>
{:else}
  {#each timeline.items as status}
    <Status.Root {status}>
      <Status.Header />
      <Status.Content />
      <Status.Actions />
    </Status.Root>
  {/each}
{/if}
```

#### createLesserTimelineStore

**Purpose:** Lesser-specific timeline with advanced features

**API:**
```typescript
function createLesserTimelineStore(config: {
  adapter: LesserGraphQLAdapter;
  type: 'HOME' | 'LOCAL' | 'FEDERATED' | 'HASHTAG';
  hashtags?: string[];
  hashtagMode?: 'ANY' | 'ALL';
  enableRealtime?: boolean;
  virtualScrolling?: boolean;
  onError?: (error: Error) => void;
}): {
  // Same as createTimelineStore plus:
  getItemsWithCost: () => Status[];
  getItemsWithTrustScore: () => Status[];
  subscribeTo: (eventType: string) => () => void;
}
```

### Profile Component

**Purpose:** Display user profile information

### Account Component

**Purpose:** Account card for follow/unfollow actions

### Hashtag Component

**Purpose:** Hashtag display and interaction

---

## Adapters Package

`@equaltoai/greater-components-adapters`

Protocol adapters for different ActivityPub servers.

### LesserGraphQLAdapter

**Purpose:** Connect to Lesser instances via GraphQL

**When to use:**
- Connecting to Lesser instance
- Need advanced features (quotes, notes, trust, cost)
- Want type-safe GraphQL operations

**API:**
```typescript
class LesserGraphQLAdapter extends BaseAdapter {
  constructor(config: {
    endpoint: string;
    token: string;
    enableSubscriptions?: boolean;
    subscriptionEndpoint?: string;
  });
  
  // Timeline methods
  async getTimeline(type: TimelineType, options?: TimelineOptions): Promise<Status[]>;
  
  // Status methods
  async getStatus(id: string): Promise<Status>;
  async createStatus(content: string, options?: CreateStatusOptions): Promise<Status>;
  async deleteStatus(id: string): Promise<void>;
  
  // Interaction methods
  async favoriteStatus(id: string): Promise<Status>;
  async unfavoriteStatus(id: string): Promise<Status>;
  async boostStatus(id: string): Promise<Status>;
  async unboostStatus(id: string): Promise<Status>;
  
  // Lesser-specific
  async quoteStatus(id: string, content: string): Promise<Status>;
  async addCommunityNote(statusId: string, note: string): Promise<CommunityNote>;
  async getTrustScore(accountId: string): Promise<TrustScore>;
  async getCostAnalytics(period: 'DAY' | 'WEEK' | 'MONTH'): Promise<CostData>;
  
  // Real-time subscriptions
  subscribe(type: SubscriptionType, callback: (data: any) => void): () => void;
}
```

**Example:**
```svelte
<script>
  import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  
  const adapter = new LesserGraphQLAdapter({
    endpoint: import.meta.env.VITE_LESSER_ENDPOINT,
    token: import.meta.env.VITE_LESSER_TOKEN,
    enableSubscriptions: true
  });
  
  // Subscribe to new posts
  const unsubscribe = adapter.subscribe('NEW_STATUS', (status) => {
    console.log('New post:', status);
  });
  
  // Cleanup
  onDestroy(unsubscribe);
</script>
```

### MastodonRESTAdapter

**Purpose:** Connect to Mastodon/Pleroma via REST API

**When to use:**
- Connecting to standard Mastodon instance
- Connecting to Pleroma or compatible servers
- Don't need Lesser-specific features

**API:**
```typescript
class MastodonRESTAdapter extends BaseAdapter {
  constructor(config: {
    instanceUrl: string;
    accessToken: string;
  });
  
  // Same core methods as LesserGraphQLAdapter
  // but without Lesser-specific features
}
```

### BaseAdapter

**Purpose:** Abstract base class for creating custom adapters

**When to use:**
- Connecting to non-standard server
- Need custom protocol implementation

---

## Tokens Package

`@equaltoai/greater-components-tokens`

Design system tokens and theming.

**Schema Documentation:**
See [Design Token Schema](./design-tokens-schema.md) for complete reference and common errors.

### Color Tokens

Full scale: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`

**Families:**
- `gray` (Neutral)
- `primary` (Brand)
- `success` (Green/Teal)
- `warning` (Yellow/Orange)
- `error` (Red)
- `info` (Blue/Sky)

### Typography Tokens

**Weights:** `normal` (400), `medium` (500), `semibold` (600), `bold` (700)

**Sizes:** `xs` to `5xl`

### Spacing Tokens

Scale: `0` to `32` (e.g., `--gr-spacing-scale-4` = 1rem)

### Radius Tokens

`--gr-radii-sm` to `--gr-radii-2xl` and `--gr-radii-full`

---

## Icons Package

`@equaltoai/greater-components-icons`

**300+ SVG icons** including Fediverse-specific ones.

**Inventory:**
See [Component Inventory > Icons](./component-inventory.md#icons) for the complete categorized list.

**Naming Convention:**
`kebab-case-name` → `PascalCaseNameIcon`
Example: `arrow-right` → `ArrowRightIcon`

**Common Icons:**
- UI: `HomeIcon`, `SettingsIcon`, `SearchIcon`, `MenuIcon`
- Social: `BoostIcon`, `FavoriteIcon`, `ReplyIcon`, `ShareIcon`
- Fediverse: `QuoteIcon`, `MastodonIcon`, `FediverseIcon`
- Status: `CheckIcon`, `CloseIcon`, `WarningIcon`, `InfoIcon`

**Props:**
```typescript
interface IconProps {
  size?: number | string;
  color?: string;
  class?: string;
}
```

**Example:**
```svelte
<script>
  import { HomeIcon, SettingsIcon } from '@equaltoai/greater-components-icons';
</script>

<HomeIcon size={24} color="currentColor" />
<SettingsIcon size={20} class="custom-icon" />
```

---

## Utils Package

`@equaltoai/greater-components-utils`

Common utility functions.

### Date Formatting

```typescript
function formatRelativeTime(date: Date | string): string;
function formatAbsoluteTime(date: Date | string, format?: string): string;
```

### String Manipulation

```typescript
function truncate(text: string, maxLength: number): string;
function stripHtml(html: string): string;
function sanitizeHtml(html: string): string;
```

### Validation

```typescript
function isValidUrl(url: string): boolean;
function isValidEmail(email: string): boolean;
```

---

## Testing Package

`@equaltoai/greater-components-testing`

Testing utilities and accessibility helpers.

### render

**Purpose:** Render Svelte component for testing

```typescript
function render(
  component: SvelteComponent,
  options: {
    props?: Record<string, any>;
    context?: Map<any, any>;
  }
): {
  container: HTMLElement;
  getByRole: (role: string) => HTMLElement;
  getByText: (text: string) => HTMLElement;
  getByLabelText: (label: string) => HTMLElement;
  queryByRole: (role: string) => HTMLElement | null;
  unmount: () => void;
}
```

### fireEvent

**Purpose:** Trigger DOM events in tests

```typescript
const fireEvent = {
  click: (element: HTMLElement) => void;
  input: (element: HTMLElement, value: string) => void;
  keyDown: (element: HTMLElement, key: string) => void;
  focus: (element: HTMLElement) => void;
  blur: (element: HTMLElement) => void;
}
```

### Example Test

```typescript
import { test, expect } from 'vitest';
import { render, fireEvent } from '@equaltoai/greater-components-testing';
import { Button } from '@equaltoai/greater-components-primitives';

test('button handles clicks', () => {
  const handleClick = vi.fn();
  const { getByRole } = render(Button, {
    props: {
      onclick: handleClick,
      children: 'Click Me'
    }
  });
  
  const button = getByRole('button');
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledOnce();
});
```

---

## Performance Notes

### Bundle Sizes (approximate, minified + gzipped)

- **primitives**: ~25KB (individual components 1-3KB each)
- **headless**: ~5KB (individual primitives 0.5-1KB each)
- **fediverse**: ~40KB (includes timeline virtualization)
- **adapters**: ~15KB (base adapter ~5KB, each implementation ~5KB)
- **tokens**: ~2KB (CSS only)
- **icons**: ~1KB per icon (tree-shakeable)
- **utils**: ~3KB

### Tree Shaking

Import specific components for optimal bundle size:

```typescript
// GOOD: Specific imports (better tree-shaking)
import { Button } from '@equaltoai/greater-components-primitives/Button';

// ACCEPTABLE: Named imports (relies on bundler)
import { Button } from '@equaltoai/greater-components-primitives';

// AVOID: Namespace imports (imports everything)
import * as Primitives from '@equaltoai/greater-components-primitives';
```

---

## TypeScript Support

All packages include complete TypeScript declarations. Enable strict mode for best type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "types": ["svelte", "vite/client"]
  }
}
```

## Browser Support

- **Chrome/Edge**: Last 2 versions
- **Firefox**: Last 2 versions
- **Safari**: Last 2 versions
- **Mobile**: iOS Safari 14+, Chrome Android last 2 versions

## Related Documentation

- [Core Patterns](./core-patterns.md) - Usage patterns and examples
- [Getting Started](./getting-started.md) - Installation and setup
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions