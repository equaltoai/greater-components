# Phase 6.1 Expansion Specification

**Current State:** component-inventory.md exists with 191 lines (concise version)  
**Target:** Expand to ~1000 lines with comprehensive detail  
**Gap:** +809 lines needed

---

## EXPANSION 1: Detailed Primitive Component Descriptions

**Location:** After line 40 in component-inventory.md (after "Theme System" list)

**Add Section:** "### Detailed Component Reference"

**Format for EACH of 20 components:**

````markdown
#### Component Name

**Purpose:** [2-3 sentence description of what it does and why it exists]

**When to Use:**

- [Use case 1]
- [Use case 2]
- [Use case 3]

**When NOT to Use:**

- [Anti-pattern 1 with alternative]
- [Anti-pattern 2 with alternative]

**Key Props:**

- `propName`: [description]
- `propName`: [description]
- `propName`: [description]

**Quick Example:**

```svelte
<Component prop="value">Content</Component>
```
````

**Reference:** See [api-reference.md#component](./api-reference.md#component) for complete API

````

**Calculate Lines:**
- 20 components × ~40 lines each = **800 lines**

**Specific Examples to Follow:**

### Example 1: Button (Detailed)

```markdown
#### Button

**Purpose:** Interactive button component with multiple visual variants, size options, and loading states. Provides consistent button styling across applications while maintaining full accessibility with keyboard navigation and screen reader support.

**When to Use:**
- Primary and secondary call-to-action buttons
- Form submit buttons
- Dialog confirmation buttons
- Triggering actions (save, delete, cancel)
- Opening modals or menus

**When NOT to Use:**
- Navigation to other pages (use `<a>` tag or SvelteKit `<a>` with proper href)
- Non-interactive visual elements (use styled div)
- Toggle switches (use Switch component)
- Checkbox-style buttons (use Checkbox component)

**Key Props:**
- `variant`: 'solid' | 'outline' | 'ghost' - Visual style
- `size`: 'sm' | 'md' | 'lg' - Button size
- `loading`: boolean - Shows spinner and prevents interaction
- `disabled`: boolean - Disables button interaction
- `prefix`: Snippet - Icon or content before text
- `suffix`: Snippet - Icon or content after text

**Quick Example:**
```svelte
<script>
  import { Button } from '@equaltoai/greater-components-primitives';
  import { SaveIcon } from '@equaltoai/greater-components-icons';
</script>

<Button variant="solid" size="md" loading={saving}>
  {#snippet prefix()}<SaveIcon />{/snippet}
  Save Changes
</Button>
````

**Reference:** See [api-reference.md#button](./api-reference.md#button) for complete API

````

### Example 2: Card (Detailed)

```markdown
#### Card

**Purpose:** Content container component with elevation (shadow), borders, or filled backgrounds. Provides consistent styling for grouping related content into visual blocks. Supports header and footer sections for structured content presentation.

**When to Use:**
- Feature cards in landing pages
- Pricing tier displays
- Blog post previews
- Dashboard widgets
- Product showcases
- Content blocks that need visual separation

**When NOT to Use:**
- Page-level containers (use Container component)
- Simple content grouping without borders (use div with styling)
- Interactive list items without card styling (use semantic HTML)

**Key Props:**
- `variant`: 'elevated' | 'outlined' | 'filled' - Visual style
- `padding`: 'none' | 'sm' | 'md' | 'lg' - Internal padding
- `clickable`: boolean - Makes entire card interactive (renders as button)
- `hoverable`: boolean - Adds hover lift effect
- `header`: Snippet - Content for card header
- `footer`: Snippet - Content for card footer

**Quick Example:**
```svelte
<script>
  import { Card, Button } from '@equaltoai/greater-components-primitives';
</script>

<Card variant="outlined" padding="md">
  {#snippet header()}
    <h3>Feature Name</h3>
  {/snippet}

  <p>Description of the feature goes here.</p>

  {#snippet footer()}
    <Button variant="ghost">Learn More</Button>
  {/snippet}
</Card>
````

**Reference:** See [api-reference.md#card](./api-reference.md#card) for complete API

````

### Example 3: Container (Detailed)

```markdown
#### Container

**Purpose:** Max-width wrapper that centers content horizontally on the page. Essential for responsive layouts that need to constrain content width on large screens while remaining fluid on smaller screens.

**When to Use:**
- Wrapping page content to prevent text lines from becoming too long
- Creating centered layouts with consistent max-widths
- Responsive designs that need breakpoint-based width constraints
- Any content that needs horizontal padding and centering

**When NOT to Use:**
- When you need full-width content (use Section or div directly)
- Complex grid layouts (use CSS Grid instead, Container is simple centering)
- Vertical spacing (use Section component for that)

**Key Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' - Maximum width constraint
  - sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
- `padding`: boolean | 'sm' | 'md' | 'lg' - Horizontal padding
- `centered`: boolean - Center content horizontally (default: true)

**Quick Example:**
```svelte
<script>
  import { Container } from '@equaltoai/greater-components-primitives';
</script>

<Container maxWidth="lg" padding="md">
  <h1>Page Title</h1>
  <p>Content constrained to 1024px width, centered on page.</p>
</Container>
````

**Reference:** See [api-reference.md#container](./api-reference.md#container) for complete API

````

### Example 4: Heading (Detailed)

```markdown
#### Heading

**Purpose:** Semantic heading component (h1-h6) with consistent typography and the ability to separate semantic level from visual size. Ensures proper heading hierarchy for accessibility while allowing design flexibility.

**When to Use:**
- Page titles, section titles, subsection titles
- Any heading where you want consistent typography
- When you need visual size different from semantic level (e.g., h2 styled like h1)
- Ensuring proper heading hierarchy for SEO and accessibility

**When NOT to Use:**
- Body text or paragraphs (use Text component or <p>)
- When plain HTML <h1>-<h6> with custom CSS is sufficient
- Non-heading content that just needs to be bold (use Text with weight="bold")

**Key Props:**
- `level`: 1 | 2 | 3 | 4 | 5 | 6 - Semantic heading level (REQUIRED)
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' - Visual size
  - If not set, defaults based on level (h1=5xl, h2=4xl, h3=3xl, etc.)
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold' - Font weight (default: bold)
- `align`: 'left' | 'center' | 'right' - Text alignment

**Quick Example:**
```svelte
<script>
  import { Heading } from '@equaltoai/greater-components-primitives';
</script>

<!-- Semantic h2, but visually large like h1 -->
<Heading level={2} size="5xl" align="center">
  Hero Title
</Heading>

<!-- Normal h3 with default size -->
<Heading level={3}>
  Section Title
</Heading>
````

**Reference:** See [api-reference.md#heading](./api-reference.md#heading) for complete API

````

**REQUIRED ACTION:**
Add detailed descriptions following this format for ALL 20 components:
1. Button (example above)
2. TextField
3. TextArea
4. Select
5. Checkbox
6. Switch
7. FileUpload
8. Modal
9. Menu
10. Tooltip
11. Tabs
12. Avatar
13. Skeleton
14. ThemeProvider
15. ThemeSwitcher
16. Card (example above)
17. Container (example above)
18. Section
19. Heading (example above)
20. Text

**Target Addition:** +800 lines

---

## EXPANSION 2: Categorized Icon Reference

**Location:** Replace lines 72-112 (current alphabetical blob)

**New Structure:**

```markdown
### All 300+ Icons - Organized by Category

#### UI & Navigation (35 icons)
- **Layout:** grid, layout, columns, sidebar, maximize, minimize, maximize-2, minimize-2
- **Navigation:** home, arrow-left, arrow-right, arrow-up, arrow-down, chevron-left, chevron-right, chevron-up, chevron-down, chevrons-left, chevrons-right, chevrons-up, chevrons-down, corner-down-left, corner-down-right, corner-up-left, corner-up-right, menu, more-horizontal, more-vertical
- **Actions:** search, settings, filter, sliders, tool, command

**Export Names:** HomeIcon, ArrowLeftIcon, GridIcon, MenuIcon, SettingsIcon, etc.

#### Social & Communication (28 icons)
- **Social Media:** twitter, facebook, instagram, linkedin, youtube, github, gitlab, twitch, slack
- **Fediverse Specific:** boost, favorite, reply, unboost, unfavorite, follow, unfollow, mention
- **Communication:** mail, message-circle, message-square, send, phone, phone-call, mic, mic-off, bell, bell-off

**Export Names:** TwitterIcon, FacebookIcon, BoostIcon, FavoriteIcon, MailIcon, etc.

#### File & Document (22 icons)
- **Files:** file, file-text, file-plus, file-minus, folder, folder-plus, folder-minus, archive
- **Actions:** download, upload, download-cloud, upload-cloud, save, copy, clipboard, paperclip
- **Edit:** edit, edit-2, edit-3, pen-tool, scissors

**Export Names:** FileIcon, FolderIcon, DownloadIcon, SaveIcon, EditIcon, etc.

#### Status & Indicators (25 icons)
- **Success:** check, check-circle, check-square, thumbs-up
- **Error:** x, x-circle, x-octagon, x-square, alert-triangle, alert-octagon, alert-circle, thumbs-down
- **Info:** info, help-circle, alert-circle
- **Other:** star, heart, bookmark, flag, award, target, zap

**Export Names:** CheckIcon, XIcon, AlertCircleIcon, InfoIcon, StarIcon, etc.

#### Development & Code (18 icons)
- **Code:** code, codepen, codesandbox, terminal, command
- **Version Control:** git-branch, git-commit, git-merge, git-pull-request, github, gitlab
- **Infrastructure:** server, database, cloud, hard-drive, cpu, package

**Export Names:** CodeIcon, ServerIcon, DatabaseIcon, GitBranchIcon, CpuIcon, etc.

#### Media & Content (22 icons)
- **Images:** image, camera, camera-off, film, video, video-off
- **Audio:** mic, mic-off, volume, volume-1, volume-2, volume-x, headphones, music, speaker
- **Display:** monitor, tv, smartphone, tablet, cast, airplay, youtube

**Export Names:** ImageIcon, CameraIcon, VideoIcon, MicIcon, VolumeIcon, etc.

#### Actions & Controls (35 icons)
- **Playback:** play, pause, stop-circle, fast-forward, rewind, skip-forward, skip-back, repeat, shuffle
- **Modify:** plus, minus, plus-circle, minus-circle, plus-square, minus-square, trash, trash-2, delete
- **Move:** move, drag, arrow-up-left, arrow-up-right, arrow-down-left, arrow-down-right, rotate-cw, rotate-ccw, refresh-cw, refresh-ccw
- **Zoom:** zoom-in, zoom-out, maximize, minimize

**Export Names:** PlayIcon, PauseIcon, PlusIcon, MinusIcon, TrashIcon, MoveIcon, etc.

#### Business & Commerce (15 icons)
- **Shopping:** shopping-cart, shopping-bag, credit-card, dollar-sign, tag, percent
- **Work:** briefcase, calendar, clock, watch, inbox, package, truck
- **Location:** map, map-pin, globe, navigation, navigation-2

**Export Names:** ShoppingCartIcon, CreditCardIcon, DollarSignIcon, BriefcaseIcon, etc.

#### System & Settings (20 icons)
- **Settings:** settings, sliders, tool, key, lock, unlock, shield, shield-off
- **Power:** power, battery, battery-charging, wifi, wifi-off, bluetooth, zap, zap-off
- **Display:** sun, moon, sunrise, sunset, eye, eye-off

**Export Names:** SettingsIcon, ToolIcon, LockIcon, PowerIcon, SunIcon, MoonIcon, etc.

#### Shapes & Decorative (15 icons)
- **Shapes:** circle, square, triangle, octagon, hexagon
- **Lines:** divide, equals, slash, underline
- **Other:** feather, droplet, anchor, compass, crosshair, target

**Export Names:** CircleIcon, SquareIcon, TriangleIcon, FeatherIcon, etc.

#### Trends & Analytics (12 icons)
- **Charts:** bar-chart, bar-chart-2, pie-chart, trending-up, trending-down, activity
- **Data:** database, layers, percent, hash, table, list

**Export Names:** BarChartIcon, PieChartIcon, TrendingUpIcon, DatabaseIcon, LayersIcon, etc.

#### Accessibility & User (10 icons)
- **Users:** user, users, user-plus, user-minus, user-check, user-x
- **Accessibility:** eye, eye-off, volume, volume-x

**Export Names:** UserIcon, UsersIcon, EyeIcon, etc.

#### Miscellaneous (18 icons)
- **Weather:** cloud, cloud-drizzle, cloud-lightning, cloud-rain, cloud-snow, wind, umbrella, thermometer
- **Nature:** sun, moon, sunrise, sunset
- **Other:** gift, printer, radio, rss, life-buoy, octagon

**Export Names:** CloudIcon, WindIcon, GiftIcon, PrinterIcon, RssIcon, etc.

### Icon Search Tips

**Need an API-related icon?**
- ✅ EXISTS: ServerIcon, DatabaseIcon, CloudIcon, CodeIcon, TerminalIcon
- ❌ DOES NOT EXIST: ApiIcon
- **Recommendation:** Use ServerIcon or CodeIcon

**Need a workflow/process icon?**
- ✅ EXISTS: GitBranchIcon, GitMergeIcon, LayersIcon, ToolIcon, SettingsIcon
- ❌ DOES NOT EXIST: WorkflowIcon
- **Recommendation:** Use GitBranchIcon or LayersIcon

**Need a network/connection icon?**
- ✅ EXISTS: WifiIcon, BluetoothIcon, CastIcon, ShareIcon, LinkIcon, Link2Icon
- ❌ DOES NOT EXIST: NetworkIcon, ConnectionIcon
- **Recommendation:** Use WifiIcon or LinkIcon

**Need a dashboard/analytics icon?**
- ✅ EXISTS: BarChartIcon, PieChartIcon, ActivityIcon, TrendingUpIcon, LayersIcon
- ❌ DOES NOT EXIST: DashboardIcon, AnalyticsIcon
- **Recommendation:** Use BarChartIcon or ActivityIcon

**Need a document/page icon?**
- ✅ EXISTS: FileIcon, FileTextIcon, BookIcon, BookOpenIcon
- ❌ DOES NOT EXIST: DocumentIcon, PageIcon
- **Recommendation:** Use FileTextIcon or BookIcon
````

**Calculate Lines:**

- 12 categories × ~15 lines each = **180 lines**
- Icon search tips: **60 lines**
- **Total:** +240 lines

---

## EXPANSION 2: Fediverse Sub-Component Breakdown

**Location:** Replace lines 129-155 (current Fediverse section)

**New Content:**

````markdown
## Fediverse Package (@equaltoai/greater-components-fediverse)

This package provides components specifically for building ActivityPub/Fediverse social media applications.

### Status Components (Compound Component Pattern)

**Status.Root** - Container providing status context

- **Purpose:** Wraps a status/post and provides context to child components
- **Props:** `status` (GenericStatus), `handlers` (interaction callbacks), `config`

**Status.Header** - Avatar, author name, timestamp

- **Purpose:** Displays who posted and when
- **Auto-detects:** Boosts/reblogs and shows boost indicator
- **Accessibility:** Proper time element with datetime attribute

**Status.Content** - HTML content with content warnings

- **Purpose:** Renders post HTML with sanitization
- **Features:** Content warning support, mention/hashtag highlighting, custom emoji rendering
- **Security:** Automatic HTML sanitization to prevent XSS

**Status.Media** - Image/video/audio attachments

- **Purpose:** Displays media with responsive layouts
- **Layouts:** 1 image (full), 2 images (side-by-side), 3 images (2 top, 1 bottom), 4 images (grid)
- **Features:** Lazy loading, blurhash placeholders, alt text display

**Status.Actions** - Reply, boost, favorite, share buttons

- **Purpose:** Interactive action buttons with counts
- **Features:** Optimistic updates, hover states, keyboard accessible
- **Handlers:** onReply, onBoost, onFavorite, onShare, onQuote (Lesser)

**Status.LesserMetadata** (Lesser-specific) - Cost, trust, moderation badges

- **Purpose:** Display Lesser-specific metadata
- **Props:** `showCost`, `showTrust`, `showModeration`, `showQuotes`
- **Use When:** Connected to Lesser instance only

**Status.CommunityNotes** (Lesser-specific) - Collaborative fact-checking

- **Purpose:** Display and vote on community notes
- **Props:** `enableVoting`, `maxVisible`, `onVote`
- **Use When:** Lesser instance with community notes enabled

**Usage Pattern:**

```svelte
<script>
	import { Status } from '@equaltoai/greater-components-fediverse';
</script>

<Status.Root {status} {handlers}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>
```
````

### Timeline Components (Compound Component Pattern)

**Timeline.Root** - Timeline container with virtualization support

- **Purpose:** Container for chronological feed of items
- **Features:** Virtual scrolling, infinite scroll, real-time updates
- **Props:** `items`, `config` (virtualization, density), `handlers`

**Timeline.Item** - Individual timeline item wrapper

- **Purpose:** Wraps each item in timeline
- **Features:** ARIA attributes, position in set announcements

**Timeline.LoadMore** - Pagination control

- **Purpose:** Trigger to load more items
- **Features:** Loading state, infinite scroll detection

**Timeline.EmptyState** - Empty placeholder

- **Purpose:** Display when timeline has no items
- **Props:** `title`, `description`

**Timeline.ErrorState** - Error display

- **Purpose:** Display when timeline fails to load
- **Props:** `error`, `onRetry`

**Usage Pattern:**

```svelte
<script>
	import { Timeline, Status } from '@equaltoai/greater-components-fediverse';
</script>

<Timeline.Root {items}>
	{#each items as item}
		<Timeline.Item {item}>
			<Status.Root status={item}>
				<Status.Header />
				<Status.Content />
			</Status.Root>
		</Timeline.Item>
	{/each}

	<Timeline.LoadMore />
</Timeline.Root>
```

### Profile Components

**Profile.Root** - Profile container
**Profile.Header** - Banner, avatar, display name, bio
**Profile.Stats** - Follower/following/post counts
**Profile.Tabs** - Posts, replies, media tabs

### Compose Components

**Compose.Root** - Composition container
**Compose.Editor** - Main text editor
**Compose.CharacterCount** - Character counter
**Compose.VisibilitySelect** - Public/unlisted/private selector
**Compose.Submit** - Submit button

### Auth Components

**Auth.Root** - Authentication container
**Auth.LoginForm** - Email/password login
**Auth.RegisterForm** - Registration form
**Auth.PasswordReset** - Password reset flow
**Auth.TwoFactorSetup** - 2FA configuration
**Auth.TwoFactorVerify** - 2FA verification

### Search Components

**Search.Root** - Search container
**Search.Bar** - Search input field
**Search.Results** - Search results display
**Search.Filters** - Search filter controls

### Notifications Components

**Notifications.Root** - Notifications container
**Notifications.Item** - Individual notification
**Notifications.Filter** - Filter controls
**Notifications.Group** - Grouped notifications

### Messages Components

**Messages.Root** - Messages/DM container
**Messages.Conversations** - Conversation list
**Messages.Thread** - Message thread
**Messages.Composer** - New message composer

### Lists Components

**Lists.Root** - User lists container
**Lists.Manager** - List management
**Lists.Editor** - Edit list settings
**Lists.Timeline** - List-specific timeline

### Filters Components

**Filters.Root** - Content filters container
**Filters.Editor** - Create/edit filters
**Filters.Manager** - Manage all filters

### Admin Components

**Admin.Root** - Admin panel container
**Admin.Cost** - Cost analytics dashboard
**Admin.Federation** - Federation health monitoring
**Admin.Moderation** - Moderation tools
**Admin.Users** - User management
**Admin.Insights** - AI insights dashboard
**Admin.TrustGraph** - Trust graph visualization

### Stores & Helpers

**createTimelineStore** - Standard ActivityPub timeline management

- **Purpose:** Manages timeline state, pagination, updates
- **Returns:** Store with items, loading, error states, refresh/loadMore methods

**createLesserTimelineStore** - Lesser-enhanced timeline management

- **Purpose:** Timeline with Lesser-specific features (cost, trust, moderation)
- **Additional Features:** Trust filtering, cost tracking, AI insights

### What Fediverse Package Does NOT Provide

❌ NO Authentication backend (provides UI only, you implement auth logic)
❌ NO API client (you provide the adapter/fetch logic)
❌ NO Full app shell (components only, you build the app structure)
❌ NO Routing (use SvelteKit or your router)
❌ NO State persistence (you handle localStorage/sessionStorage)
❌ NO Push notifications (you implement notification service)

````

**Calculate Lines:**
- Status breakdown: ~80 lines
- Timeline breakdown: ~60 lines
- Profile, Compose, Auth, Search, Notifications, Messages, Lists, Filters: ~30 lines each = 240 lines
- Admin breakdown: ~60 lines
- Stores: ~40 lines
- "Does not provide": ~30 lines
- **Total:** +510 lines

---

## EXPANSION 3: Headless Package Detail

**Location:** Expand lines 157-167

**New Content:**

```markdown
## Headless Package (@equaltoai/greater-components-headless)

Headless components provide **behavior and accessibility WITHOUT any styling**. Use these when you have an existing design system or need complete CSS control.

### When to Use Headless vs Styled

**Use Headless Components When:**
- You have an existing design system
- You need complete control over every CSS property
- You want minimal bundle size (no CSS included)
- You're building a custom component library

**Use Styled Primitives When:**
- You want components that work out of the box
- You're okay with theme token customization
- You prefer consistent styling across your app
- You're building quickly

### Headless Primitives (5)

#### createButton

**Purpose:** Provides button behavior without any styling

**What It Provides:**
- Click handling
- Keyboard support (Enter, Space)
- Loading state management
- Disabled state management
- Pressed state (for toggle buttons)
- Focus management

**What It Does NOT Provide:**
- No CSS or styling
- No visual variants
- No default colors or sizes

**Usage:**
```svelte
<script>
  import { createButton } from '@equaltoai/greater-components-headless/button';

  const button = createButton({
    onClick: () => console.log('clicked'),
    loading: false
  });
</script>

<button use:button.actions.button class="your-custom-styles">
  {#if button.state.loading}Loading...{:else}Click Me{/if}
</button>

<style>
  /* You provide ALL styles */
  .your-custom-styles {
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* ... */
  }
</style>
````

**Reference:** See [api-reference.md#createbutton](./api-reference.md#createbutton)

#### createModal

**Purpose:** Provides modal behavior without styling

**What It Provides:**

- Focus trapping
- Escape key handling
- Outside click detection
- Backdrop management
- Return focus on close
- Body scroll locking

**What It Does NOT Provide:**

- No modal styling
- No backdrop styling
- No animations/transitions

**Usage:**

```svelte
<script>
	import { createModal } from '@equaltoai/greater-components-headless/modal';

	let isOpen = $state(false);

	const modal = createModal({
		open: isOpen,
		onClose: () => (isOpen = false),
		closeOnEscape: true,
		closeOnOutsideClick: true,
	});
</script>

{#if modal.state.open}
	<div use:modal.actions.overlay class="your-backdrop">
		<div use:modal.actions.content class="your-modal">
			<h2>Modal Title</h2>
			<button use:modal.actions.close>Close</button>
		</div>
	</div>
{/if}
```

**Reference:** See [api-reference.md#createmodal](./api-reference.md#createmodal)

#### createMenu

**Purpose:** Provides dropdown menu behavior

**What It Provides:**

- Keyboard navigation (Arrow keys, Home, End)
- Focus management
- Open/close state
- Click outside handling
- ARIA attributes

**What It Does NOT Provide:**

- No menu styling
- No positioning logic (use Floating UI separately)
- No animations

#### createTooltip

**Purpose:** Provides tooltip behavior

**What It Provides:**

- Hover delay handling
- Focus handling
- Show/hide state
- Position awareness
- ARIA describedby

**What It Does NOT Provide:**

- No tooltip styling
- No positioning (use Floating UI)
- No arrow/pointer

#### createTabs

**Purpose:** Provides tab navigation behavior

**What It Provides:**

- Arrow key navigation
- Home/End key support
- Active tab state
- ARIA roles and attributes
- Keyboard roving tabindex

**What It Does NOT Provide:**

- No tab styling
- No indicator/underline animations
- No panel transitions

````

**Calculate Lines:** +280 lines

---

## EXPANSION 4: Package Comparison Matrix

**Location:** Add before "Fediverse Package" section (before line 129)

**New Section:**

```markdown
## Package Selection Guide

### Quick Decision Matrix

| Need | Use This Package | Import From |
|------|------------------|-------------|
| Button, form inputs | Primitives | `@equaltoai/greater-components-primitives` |
| Layout containers | Primitives | `@equaltoai/greater-components-primitives` |
| Typography | Primitives | `@equaltoai/greater-components-primitives` |
| Icons | Icons | `@equaltoai/greater-components-icons` |
| Social media feed | Fediverse | `@equaltoai/greater-components-fediverse` |
| User profiles | Fediverse | `@equaltoai/greater-components-fediverse` |
| Complete style control | Headless | `@equaltoai/greater-components-headless` |
| ActivityPub connection | Adapters | `@equaltoai/greater-components-adapters` |
| Utility functions | Utils | `@equaltoai/greater-components-utils` |

### Use Case to Package Mapping

**Building a landing page?**
→ Primitives (Container, Section, Heading, Text, Card, Button)
→ Icons (for decorative icons)

**Building a Fediverse client?**
→ Fediverse (Timeline, Status, Profile)
→ Primitives (for settings pages, forms)
→ Adapters (to connect to server)
→ Icons (UI icons)

**Building a documentation site?**
→ Primitives (Container, Heading, Text, Button, Tabs)
→ Icons (for navigation)

**Building with existing design system?**
→ Headless (behavior only)
→ Icons (work with any styling)

**Need custom data fetching?**
→ Adapters (extend BaseAdapter)
→ Fediverse stores as examples
````

**Calculate Lines:** +60 lines

---

## EXPANSION 5: Verification & Discovery Methods

**Location:** Add at end of document (after Testing Package section)

**New Section:**

```markdown
## Component Discovery & Verification

### How to Check if a Component Exists

#### Method 1: Check This Document

1. Search this page for the component name
2. If not listed in the "Complete List" sections, it DOES NOT EXIST

#### Method 2: Check Source Code

1. Primitives: `packages/primitives/src/index.ts`
2. Fediverse: `packages/fediverse/src/index.ts`
3. Icons: `packages/icons/src/index.ts`
4. If component is not exported, it DOES NOT EXIST

#### Method 3: Check TypeScript Definitions

1. Primitives types: `packages/primitives/dist/index.d.ts`
2. Look for `export { default as ComponentName }`
3. If not present, DOES NOT EXIST

### Common "Does Not Exist" Queries

**Q: Is there a Grid component?**
A: ❌ NO. Use CSS Grid: `<div style="display: grid; grid-template-columns: ...">`

**Q: Is there a Flex component?**
A: ❌ NO. Use CSS Flexbox: `<div style="display: flex; ...">`

**Q: Is there a Nav/Navbar component?**
A: ❌ NO. Build with `<nav>` + Button components

**Q: Is there a Table component?**
A: ❌ NO. Use HTML `<table>` with custom styling

**Q: Is there an Image component?**
A: ❌ NO. Use HTML `<img>` or `<picture>` elements

**Q: Is there a Link component?**
A: ❌ NO. Use HTML `<a>` or SvelteKit links

**Q: Is there a Paragraph component?**
A: ✅ YES. Text component with `as="p"` (default)

**Q: Is there a Div/Container component?**
A: ✅ YES. Container component for max-width centering

**Q: Is there a Typography/Heading component?**
A: ✅ YES. Heading component for h1-h6, Text component for body text

**Q: Are there ApiIcon or WorkflowIcon?**
A: ❌ NO. Use ServerIcon/CodeIcon for API, GitBranchIcon/LayersIcon for workflow

### Alternative Suggestions

When a component doesn't exist, here's what to use instead:

| Requested     | Exists? | Alternative                                |
| ------------- | ------- | ------------------------------------------ |
| Grid          | ❌      | CSS Grid: `<div style="display: grid">`    |
| Flex          | ❌      | CSS Flexbox: `<div style="display: flex">` |
| Nav           | ❌      | `<nav>` with Button components             |
| Navbar        | ❌      | `<nav>` with Container + Button            |
| Table         | ❌      | HTML `<table>` elements                    |
| Image         | ❌      | HTML `<img>` or `<picture>`                |
| Link          | ❌      | HTML `<a>` element                         |
| Paragraph     | ✅      | Text component (as="p")                    |
| Div           | ⚠️      | HTML `<div>` (or Container for max-width)  |
| Span          | ✅      | Text component (as="span")                 |
| Label         | ✅      | Text component (as="label")                |
| ApiIcon       | ❌      | ServerIcon, CodeIcon, DatabaseIcon         |
| WorkflowIcon  | ❌      | GitBranchIcon, LayersIcon, ToolIcon        |
| DashboardIcon | ❌      | BarChartIcon, ActivityIcon, GridIcon       |
| NetworkIcon   | ❌      | WifiIcon, LinkIcon, ShareIcon              |

## Summary

### Total Components Across All Packages

- **Primitives:** 20 components
- **Headless:** 5 primitives
- **Fediverse:** 50+ components (including all sub-components and compounds)
- **Icons:** 300+ icons
- **Adapters:** 3 adapters
- **Utils:** ~10 utility functions
- **Testing:** 3 test helpers

### Key Principle

**If it's not listed in this document, it DOES NOT EXIST in Greater Components.**

When you need something not listed:

1. Check if HTML element suffices (`<div>`, `<a>`, `<table>`, etc.)
2. Check if CSS can achieve it (Grid, Flexbox)
3. Build custom component using primitives as foundation
4. Consider if it belongs in Greater Components (file issue)
```

**Calculate Lines:** +150 lines

---

## Summary of Required Expansions

| Expansion | Section                         | Lines to Add | Priority |
| --------- | ------------------------------- | ------------ | -------- |
| 1         | Detailed Primitive Descriptions | +800         | CRITICAL |
| 2         | Categorized Icon Reference      | +240         | HIGH     |
| 3         | Fediverse Sub-Components        | +510         | HIGH     |
| 4         | Headless Package Detail         | +280         | MEDIUM   |
| 5         | Package Comparison Matrix       | +60          | HIGH     |
| 6         | Verification Methods            | +150         | CRITICAL |

**Total Lines to Add:** +2,040 lines  
**Current:** 191 lines  
**Target:** ~2,200 lines (exceeds original 1000 line target for thoroughness)

---

## Implementation Instructions for Agent

### Step 1: Add Detailed Primitive Descriptions

**After line 40, before "### What This Package Does NOT Provide":**

Add heading:

```markdown
### Detailed Component Reference
```

Then add detailed description for each of 20 components following the 4 examples provided above (Button, Card, Container, Heading).

**Components to document:**
1-4. ✅ Done (examples above) 5. TextField - Follow Button pattern 6. TextArea - Similar to TextField 7. Select - Similar to form controls 8. Checkbox - Similar to Switch 9. Switch - Similar to Checkbox 10. FileUpload - More complex, follow Modal pattern 11. Modal - Follow Button pattern, note snippets 12. Menu - Similar to Modal 13. Tooltip - Simple, follow Skeleton pattern 14. Tabs - Complex, follow Modal pattern 15. Avatar - Follow Button pattern 16. Skeleton - Simple display component 17. ThemeProvider - Simple wrapper, note context provision 18. ThemeSwitcher - Interactive, follow Button pattern 19. Section - Follow Container pattern (already done) 20. Text - Follow Heading pattern

**Each component needs:**

- Purpose (2-3 sentences)
- When to Use (3-5 bullet points)
- When NOT to Use (2-3 anti-patterns)
- Key Props (3-5 main props with descriptions)
- Quick Example (5-10 line code snippet)
- Reference link

### Step 2: Replace Icon Section

**Replace lines 72-112 with categorized icon reference**

Use the 12-category structure provided in Expansion 2 above.

### Step 3: Replace Fediverse Section

**Replace lines 129-155 with detailed sub-component breakdown**

Use the comprehensive breakdown provided in Expansion 3 above.

### Step 4: Expand Headless Section

**Replace lines 157-167 with detailed headless descriptions**

Use the 5 detailed headless component descriptions from Expansion 4 above.

### Step 5: Add Package Selection Guide

**Insert before Fediverse section (before line 129 in current file)**

Add the Package Comparison Matrix and Use Case Mapping from Expansion 5.

### Step 6: Add Discovery Section

**Add at end of file (after line 191)**

Add the complete verification and alternative suggestions section from Expansion 6.

---

## Validation Checklist

After expansion, verify:

- [ ] All 20 primitives have detailed descriptions
- [ ] Icons organized into 12 categories
- [ ] All Fediverse sub-components listed
- [ ] All headless primitives explained in detail
- [ ] Package selection guide present
- [ ] Verification methods documented
- [ ] Alternative suggestions for common "does not exist" queries
- [ ] ApiIcon and WorkflowIcon explicitly marked as non-existent with alternatives
- [ ] File is ~2000-2200 lines total
- [ ] No phantom component references
- [ ] All code examples use components that exist

---

## Success Criteria for Phase 6.1 Completion

✅ **File exists** - component-inventory.md created  
✅ **Core lists** - All components and icons listed  
❌ **Detailed descriptions** - Need +800 lines for primitives  
❌ **Icon categories** - Need +240 lines for organized icon list  
❌ **Fediverse depth** - Need +510 lines for sub-components  
❌ **Headless detail** - Need +280 lines for headless explanations  
❌ **Discovery tools** - Need +210 lines for verification and alternatives

**Current Progress:** 191/2200 lines = **8.7% of target depth**  
**Core Structure:** ✅ Complete  
**Detail Level:** ❌ Needs significant expansion
