# Complete Component Inventory

## Purpose

This document lists EVERY component available in Greater Components.
If a component is not listed here, it DOES NOT EXIST.

## Primitives Package (@equaltoai/greater-components/primitives)



### Package Scope



This package provides **30 interactive and layout components** for building any type of website.



**What Primitives Provides:**

- Interactive widgets (buttons, forms, modals, menus)

- Layout primitives (containers, sections, cards, lists)

- Typography components (headings, text, badges)

- Theme system (provider, switcher)

- Advanced interactions (code blocks, drag-drop, markdown, streaming text)



### All 30 Components (Complete List)



**Form Controls (9):**

- Button - Interactive button with variants

- CopyButton - Button for clipboard operations

- DropZone - Drag and drop file upload

- TextField - Single-line text input

- TextArea - Multi-line text input

- Select - Dropdown select

- Checkbox - Checkbox input

- Switch - Toggle switch

- FileUpload - File upload with drag-drop



**Overlays & Menus (4):**

- Modal - Dialog overlay

- Menu - Dropdown menu

- Tooltip - Hover tooltip

- Tabs - Tab navigation



**Display & Status (11):**

- Avatar - User avatar with fallback

- Badge - Status indicators and labels

- CodeBlock - Syntax highlighting ⚠️ *Requires peer dep: `shiki`*

- GradientText - Gradient text effect

- IconBadge - Icon container

- List - Styled list wrapper

- ListItem - List item with icon support

- MarkdownRenderer - Safe markdown rendering ⚠️ *Requires peer deps: `isomorphic-dompurify`, `marked`*

- Skeleton - Loading placeholder

- StepIndicator - Numbered workflow badge

- StreamingText - Text animation

- ThemeSwitcher - Theme toggle



**Layout & Typography (5):**

- Card - Content container with borders/shadows

- Container - Max-width centering wrapper

- Section - Semantic section with spacing

- Heading - Semantic h1-h6 with typography control

- Text - Paragraph/span/div with typography control



**Theme System (1):**

- ThemeProvider - Theme context provider



### Detailed Component Reference

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

- `variant`: 'solid' | 'outline' | 'ghost' | 'danger' - Visual style
- `size`: 'sm' | 'md' | 'lg' - Button size
- `loading`: boolean - Shows spinner and prevents interaction
- `disabled`: boolean - Disables button interaction
- `prefix`: Snippet - Icon or content before text
- `suffix`: Snippet - Icon or content after text

**Quick Example:**

```svelte
<script>
	import { Button } from '@equaltoai/greater-components/primitives';
	import { SaveIcon } from '@equaltoai/greater-components/icons';
</script>

<Button variant="solid" size="md" loading={saving}>
	{#snippet prefix()}<SaveIcon />{/snippet}
	Save Changes
</Button>
```

**Reference:** See [api-reference.md#button](./api-reference.md#button) for complete API

#### CopyButton

**Purpose:** Specialized button for copying text to the clipboard. Provides automatic visual feedback (switching to checkmark) and handles fallback mechanisms for older browsers.

**When to Use:**

- Copying code snippets
- Copying API keys, IDs, or URLs
- Share buttons that copy links

**When NOT to Use:**

- General actions (use Button)
- Navigation

**Key Props:**

- `text`: string - Text to copy
- `targetSelector`: string - CSS selector of element to copy from
- `variant`: 'icon' | 'text' | 'icon-text' - Content layout
- `buttonVariant`: 'ghost' | 'solid' | 'outline' - Button style

**Quick Example:**

```svelte
<script>
	import { CopyButton } from '@equaltoai/greater-components/primitives';
</script>

<CopyButton text="npm install package" />
```

**Reference:** See [api-reference.md#copybutton](./api-reference.md#copybutton) for complete API

#### Badge

**Purpose:** Status indicators, labels, or counts.

**When to Use:**

- Marking items as "New" or "Beta"
- Showing status (online/offline)
- Displaying counts

**Key Props:**

- `variant`: 'pill' | 'dot' | 'outlined' | 'filled'
- `color`: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray'
- `label`: string - Main text

**Reference:** See [api-reference.md#badge](./api-reference.md#badge) for complete API

#### List

**Purpose:** Styled lists with consistent spacing and optional icon integration.

**When to Use:**

- Feature lists
- Checklists
- Ordered steps

**Key Props:**

- `icon`: Component - Icon to use for all items
- `spacing`: 'sm' | 'md' | 'lg'
- `ordered`: boolean - Use numbers instead of bullets/icons

**Reference:** See [api-reference.md#list](./api-reference.md#list) for complete API

#### GradientText

**Purpose:** Applies a gradient background to text.

**When to Use:**

- Hero headings
- Brand emphasis

**Key Props:**

- `gradient`: 'primary' | 'success' | ... | 'custom'
- `direction`: string

**Reference:** See [api-reference.md#gradienttext](./api-reference.md#gradienttext) for complete API

#### StepIndicator

**Purpose:** Numbered or icon-based badge for multi-step workflows.

**When to Use:**

- Tutorials
- Wizards
- Progress trackers

**Key Props:**

- `number`: number - Step number
- `state`: 'pending' | 'active' | 'completed' | 'error'

**Reference:** See [api-reference.md#stepindicator](./api-reference.md#stepindicator) for complete API

#### IconBadge

**Purpose:** Container for icons with consistent shapes and sizes.

**When to Use:**

- Feature grid icons
- Decorative icon placeholders

**Key Props:**

- `icon`: Component
- `shape`: 'circle' | 'rounded' | 'square'
- `variant`: 'filled' | 'outlined' | 'ghost'

**Reference:** See [api-reference.md#iconbadge](./api-reference.md#iconbadge) for complete API

#### CodeBlock

**Purpose:** Syntax highlighting code block with copy button.

**⚠️ Peer Dependency Required:** This component requires `shiki` to be installed:
```bash
pnpm add shiki
```

**When to Use:**
- Documentation code snippets
- Chat code responses

**Key Props:**
- `code`: string
- `language`: string
- `showCopy`: boolean
- `showLineNumbers`: boolean

**Reference:** See [api-reference.md#codeblock](./api-reference.md#codeblock) for complete API

#### DropZone

**Purpose:** Drag and drop file upload area.

**When to Use:**
- File uploads
- Chat attachments

**Key Props:**
- `accept`: object - File types
- `multiple`: boolean
- `onDrop`: callback

**Reference:** See [api-reference.md#dropzone](./api-reference.md#dropzone) for complete API

#### MarkdownRenderer

**Purpose:** Renders markdown safely.

**⚠️ Peer Dependencies Required:** This component requires `isomorphic-dompurify` and `marked`:
```bash
pnpm add isomorphic-dompurify marked
```

**When to Use:**
- AI responses
- User content

**Key Props:**
- `content`: string
- `sanitize`: boolean

**Reference:** See [api-reference.md#markdownrenderer](./api-reference.md#markdownrenderer) for complete API

#### StreamingText

**Purpose:** Streaming text effect.

**When to Use:**
- AI streaming responses

**Key Props:**
- `content`: string
- `streaming`: boolean
- `showCursor`: boolean

**Reference:** See [api-reference.md#streamingtext](./api-reference.md#streamingtext) for complete API

#### TextField

**Purpose:** Single-line text input component with built-in label, helper text, and error state handling. Ensures accessible form inputs with proper association between labels and inputs.

**When to Use:**

- Capturing short text (names, titles, usernames)
- Search bars
- Email or password inputs
- URL or telephone inputs

**When NOT to Use:**

- Multi-line text (use TextArea)
- Rich text editing (use a specialized editor library)
- Date selection (use browser native date input or specialized date picker)

**Key Props:**

- `value`: string - The current value (bindable)
- `label`: string - Label text displayed above input
- `type`: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' - Input type
- `error`: string - Error message to display (changes visual state)
- `placeholder`: string - Placeholder text
- `required`: boolean - Marks input as required

**Quick Example:**

```svelte
<script>
	import { TextField } from '@equaltoai/greater-components/primitives';
</script>

<TextField
	bind:value={email}
	label="Email Address"
	type="email"
	placeholder="user@example.com"
	required
/>
```

**Reference:** See [api-reference.md#textfield](./api-reference.md#textfield) for complete API

#### TextArea

**Purpose:** Multi-line text input component for longer content. Supports auto-resizing or fixed rows, with consistent styling matching TextField.

**When to Use:**

- Capturing comments or feedback
- Post/status composition
- Bio or description fields
- Any text input expected to exceed one line

**When NOT to Use:**

- Single line input (use TextField)
- Rich text editing (markdown/HTML) - use a specialized library
- Code editing - use a code editor library

**Key Props:**

- `value`: string - The current value (bindable)
- `label`: string - Label text
- `rows`: number - Initial number of visible lines
- `maxLength`: number - Maximum character count
- `error`: string - Error message
- `placeholder`: string - Placeholder text

**Quick Example:**

```svelte
<script>
	import { TextArea } from '@equaltoai/greater-components/primitives';
</script>

<TextArea bind:value={bio} label="Biography" rows={4} placeholder="Tell us about yourself..." />
```

**Reference:** See [api-reference.md#textarea](./api-reference.md#textarea) for complete API

#### Select

**Purpose:** Dropdown selection component for choosing one option from a list. Provides a styled native-like experience with support for keyboard navigation.

**When to Use:**

- Choosing from a predefined list of options (5-15 items)
- Filtering content by category
- Selecting settings or preferences

**When NOT to Use:**

- Very long lists (use a combobox/autocomplete)
- Selecting multiple items (use Checkbox group or MultiSelect)
- Less than 3 options (use Radio buttons)

**Key Props:**

- `value`: string | number - Selected value (bindable)
- `options`: Array<{ label: string, value: any }> - List of options
- `label`: string - Label text
- `placeholder`: string - Text when nothing selected
- `error`: string - Error message

**Quick Example:**

```svelte
<script>
	import { Select } from '@equaltoai/greater-components/primitives';

	const roles = [
		{ label: 'Admin', value: 'admin' },
		{ label: 'User', value: 'user' },
	];
</script>

<Select bind:value={role} options={roles} label="User Role" />
```

**Reference:** See [api-reference.md#select](./api-reference.md#select) for complete API

#### Checkbox

**Purpose:** Boolean selection control allowing users to select one or more items from a set. Supports indeterminate state.

**When to Use:**

- "Agree to terms" confirmation
- Selecting multiple items from a list
- Toggling settings on/off (though Switch is often preferred for immediate actions)

**When NOT to Use:**

- Mutually exclusive options (use Radio buttons)
- Immediate settings changes (Switch is often better metaphor)

**Key Props:**

- `checked`: boolean - Checked state (bindable)
- `label`: string - Text label associated with checkbox
- `disabled`: boolean - Disables interaction
- `indeterminate`: boolean - Visual state for "partially selected"

**Quick Example:**

```svelte
<script>
	import { Checkbox } from '@equaltoai/greater-components/primitives';
</script>

<Checkbox bind:checked={accepted} label="I agree to the Terms of Service" />
```

**Reference:** See [api-reference.md#checkbox](./api-reference.md#checkbox) for complete API

#### Switch

**Purpose:** Toggle control for boolean states, mimicking a physical switch. Best for immediate state changes.

**When to Use:**

- Activating/deactivating a feature immediately
- "On/Off" settings (e.g., Dark Mode, Notifications)

**When NOT to Use:**

- Form submission data (Checkbox is standard for forms)
- Selecting multiple items from a list

**Key Props:**

- `checked`: boolean - active state (bindable)
- `label`: string - Label text
- `disabled`: boolean - Disables interaction

**Quick Example:**

```svelte
<script>
	import { Switch } from '@equaltoai/greater-components/primitives';
</script>

<Switch bind:checked={notifications} label="Enable Push Notifications" />
```

**Reference:** See [api-reference.md#switch](./api-reference.md#switch) for complete API

#### FileUpload

**Purpose:** Drag-and-drop file selection zone with click-to-upload fallback. styling.

**When to Use:**

- Uploading avatars or profile headers
- Attaching media to posts
- Importing data files

**Key Props:**

- `accept`: string - File types (e.g., "image/\*, .pdf")
- `multiple`: boolean - Allow multiple file selection
- `maxSize`: number - Max file size in bytes
- `onSelect`: (files: File[]) => void - Callback when files selected

**Quick Example:**

```svelte
<script>
	import { FileUpload } from '@equaltoai/greater-components/primitives';
</script>

<FileUpload accept="image/*" onSelect={(files) => handleUpload(files)}>
	<p>Drop image here or click to browse</p>
</FileUpload>
```

**Reference:** See [api-reference.md#fileupload](./api-reference.md#fileupload) for complete API

#### Modal

**Purpose:** Dialog overlay that traps focus and prevents interaction with the background. Used for critical actions or focused tasks.

**When to Use:**

- Confirmations (Delete, Publish)
- Complex forms that don't need a full page
- Detailed views of items (e.g., expanding an image)

**When NOT to Use:**

- Non-critical information (use Tooltip or inline text)
- Navigation menus (use Menu)
- Blocking the user unnecessarily

**Key Props:**

- `open`: boolean - Visibility state (bindable)
- `title`: string - Modal title
- `size`: 'sm' | 'md' | 'lg' | 'full' - Width variant
- `closable`: boolean - Show close button
- `header`: Snippet - Custom header content
- `footer`: Snippet - Footer actions

**Quick Example:**

```svelte
<script>
	import { Modal, Button } from '@equaltoai/greater-components/primitives';
</script>

<Modal bind:open={showDialog} title="Confirm Deletion">
	<p>Are you sure you want to delete this item?</p>
	{#snippet footer()}
		<Button onclick={() => (showDialog = false)}>Cancel</Button>
		<Button variant="danger">Delete</Button>
	{/snippet}
</Modal>
```

**Reference:** See [api-reference.md#modal](./api-reference.md#modal) for complete API

#### Menu

**Purpose:** Dropdown menu for actions or navigation. Accessible via keyboard and supports submenus.

**When to Use:**

- "More actions" (...) buttons
- User profile dropdowns
- Navigation menus in headers

**When NOT to Use:**

- Selecting a value for a form (use Select)
- Tooltips (use Tooltip)

**Components:**

- `Menu.Root`, `Menu.Trigger`, `Menu.Items`, `Menu.Item`, `Menu.Separator`

**Quick Example:**

```svelte
<script>
	import { Menu } from '@equaltoai/greater-components/primitives';
</script>

<Menu.Root>
	<Menu.Trigger>Options</Menu.Trigger>
	<Menu.Items>
		<Menu.Item onclick={edit}>Edit</Menu.Item>
		<Menu.Item onclick={remove}>Delete</Menu.Item>
	</Menu.Items>
</Menu.Root>
```

**Reference:** See [api-reference.md#menu](./api-reference.md#menu) for complete API

#### Tooltip

**Purpose:** Brief contextual information displayed on hover or focus.

**When to Use:**

- Explaining icon-only buttons
- Providing extra detail on technical terms
- Showing full text of truncated content

**When NOT to Use:**

- Critical information required to use the interface (should be visible)
- Interactive content (links, buttons inside tooltip) - use Popover/Modal

**Key Props:**

- `content`: string | Snippet - The tooltip text/content
- `placement`: 'top' | 'bottom' | 'left' | 'right' - Preferred position
- `delay`: number - Delay before showing (ms)

**Quick Example:**

```svelte
<script>
	import { Tooltip, Button } from '@equaltoai/greater-components/primitives';
</script>

<Tooltip content="Settings and Preferences">
	<Button variant="ghost">Icons Only</Button>
</Tooltip>
```

**Reference:** See [api-reference.md#tooltip](./api-reference.md#tooltip) for complete API

#### Tabs

**Purpose:** Organizes content into separate views where only one is visible at a time.

**When to Use:**

- Switching between different aspects of the same entity (Profile: Posts, Media, Likes)
- Settings pages with multiple categories
- reducing vertical page length

**Components:**

- `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`

**Quick Example:**

```svelte
<script>
	import { Tabs } from '@equaltoai/greater-components/primitives';
</script>

<Tabs.Root value="account">
	<Tabs.List>
		<Tabs.Tab value="account">Account</Tabs.Tab>
		<Tabs.Tab value="privacy">Privacy</Tabs.Tab>
	</Tabs.List>
	<Tabs.Panel value="account">Account Settings...</Tabs.Panel>
	<Tabs.Panel value="privacy">Privacy Settings...</Tabs.Panel>
</Tabs.Root>
```

**Reference:** See [api-reference.md#tabs](./api-reference.md#tabs) for complete API

#### Avatar

**Purpose:** Represents a user or entity with an image, falling back to initials or an icon.

**When to Use:**

- User profile pictures
- Organization logos
- Comment threads

**Key Props:**

- `src`: string - Image URL
- `alt`: string - Alt text (name of user)
- `fallback`: string - Initials to show if image fails
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

**Quick Example:**

```svelte
<script>
	import { Avatar } from '@equaltoai/greater-components/primitives';
</script>

<Avatar src={user.image} fallback="JD" alt="John Doe" />
```

**Reference:** See [api-reference.md#avatar](./api-reference.md#avatar) for complete API

#### Skeleton

**Purpose:** Placeholder loading state that mimics the shape of content. Reduces perceived loading time.

**When to Use:**

- While fetching data for cards, profiles, or lists
- Preventing layout shift during load

**Key Props:**

- `variant`: 'text' | 'circular' | 'rectangular'
- `width`: string
- `height`: string
- `animation`: 'pulse' | 'wave' | 'none'

**Quick Example:**

```svelte
<script>
	import { Skeleton } from '@equaltoai/greater-components/primitives';
</script>

<div class="profile-loading">
	<Skeleton variant="circular" width="40px" height="40px" />
	<div class="text">
		<Skeleton variant="text" width="120px" />
		<Skeleton variant="text" width="80px" />
	</div>
</div>
```

**Reference:** See [api-reference.md#skeleton](./api-reference.md#skeleton) for complete API

#### ThemeProvider

**Purpose:** Provides theme context (light/dark/high-contrast) to all child components.

**When to Use:**

- At the root of your application (`+layout.svelte`)
- Wrapping a section that needs a specific forced theme

**Key Props:**

- `theme`: 'light' | 'dark' | 'high-contrast' | 'system'
- `defaultTheme`: Initial theme if system preference not used

**Quick Example:**

```svelte
<script>
	import { ThemeProvider } from '@equaltoai/greater-components/primitives';
</script>

<ThemeProvider defaultTheme="system">
	<slot />
</ThemeProvider>
```

**Reference:** See [api-reference.md#themeprovider](./api-reference.md#themeprovider) for complete API

#### ThemeSwitcher

**Purpose:** UI control to toggle between themes (light, dark, high-contrast).

**When to Use:**

- In navigation bars for quick theme switching (use `variant="compact"`)
- In settings pages for full theme customization (use `variant="full"`)
- Allowing users to override system preference

**When NOT to Use:**

- If app only supports one theme
- If theme controlled entirely by system preferences with no override

**Key Props:**

- `variant`: 'compact' | 'full' (default: 'compact')
  - `'compact'` - Dropdown style for navigation bars
  - `'full'` - Full panel with advanced color and preference controls
- `showPreview`: boolean - Show theme preview colors (default: true)
- `showAdvanced`: boolean - Show advanced customization options (default: false)

**Quick Example:**

```svelte
<script>
	import { ThemeSwitcher } from '@equaltoai/greater-components/primitives';
</script>

<!-- Most common: compact dropdown in navbar -->
<ThemeSwitcher variant="compact" />

<!-- For settings pages: full customization panel -->
<ThemeSwitcher variant="full" showAdvanced={true} />
```

**Reference:** See [api-reference.md#themeswitcher](./api-reference.md#themeswitcher) for complete API

#### Card

**Purpose:** Content container component with elevation (shadow), borders, or filled backgrounds. Provides consistent styling for grouping related content into visual blocks.

**When to Use:**

- Feature cards in landing pages
- Pricing tier displays
- Blog post previews
- Dashboard widgets
- Product showcases

**When NOT to Use:**

- Page-level containers (use Container component)
- Simple content grouping without borders (use div with styling)

**Key Props:**

- `variant`: 'elevated' | 'outlined' | 'filled' - Visual style
- `padding`: 'none' | 'sm' | 'md' | 'lg' - Internal padding
- `clickable`: boolean - Makes entire card interactive
- `hoverable`: boolean - Adds hover lift effect
- `header`: Snippet - Content for card header
- `footer`: Snippet - Content for card footer

**Quick Example:**

```svelte
<script>
	import { Card, Button } from '@equaltoai/greater-components/primitives';
</script>

<Card variant="outlined" padding="md">
	{#snippet header()}<h3>Feature</h3>{/snippet}
	<p>Description...</p>
	{#snippet footer()}<Button>Action</Button>{/snippet}
</Card>
```

**Reference:** See [api-reference.md#card](./api-reference.md#card) for complete API

#### Container

**Purpose:** Max-width wrapper that centers content horizontally on the page. Essential for responsive layouts that need to constrain content width on large screens while remaining fluid on smaller screens.

**When to Use:**

- Wrapping page content to prevent text lines from becoming too long
- Creating centered layouts with consistent max-widths
- Responsive designs that need breakpoint-based width constraints

**When NOT to Use:**

- When you need full-width content (use Section or div directly)
- Complex grid layouts (use CSS Grid instead)

**Key Props:**

- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
- `padding`: boolean | 'sm' | 'md' | 'lg'
- `centered`: boolean

**Quick Example:**

```svelte
<script>
	import { Container } from '@equaltoai/greater-components/primitives';
</script>

<Container maxWidth="lg" padding="md">
	<h1>Page Title</h1>
	<p>Content constrained to 1024px width.</p>
</Container>
```

**Reference:** See [api-reference.md#container](./api-reference.md#container) for complete API

#### Section

**Purpose:** Semantic section wrapper with consistent vertical spacing for page sections.

**When to Use:**

- Dividing page content into logical sections
- Adding consistent vertical rhythm
- Applying background colors to full-width strips

**Key Props:**

- `spacing`: 'none' | 'sm' | 'md' | 'lg' | 'xl' - Vertical margin
- `centered`: boolean - Center text content

**Quick Example:**

```svelte
<script>
	import { Section, Container } from '@equaltoai/greater-components/primitives';
</script>

<Section spacing="lg">
	<Container>
		<h2>Section Title</h2>
	</Container>
</Section>
```

**Reference:** See [api-reference.md#section](./api-reference.md#section) for complete API

#### Heading

**Purpose:** Semantic heading component (h1-h6) with consistent typography and the ability to separate semantic level from visual size.

**When to Use:**

- Page titles, section titles
- Ensuring proper heading hierarchy for SEO/Accessibility
- When you need visual size different from semantic level

**Key Props:**

- `level`: 1-6 - Semantic heading level (REQUIRED)
- `size`: 'xs' to '5xl' - Visual size
- `weight`: 'normal' to 'bold'
- `align`: 'left' | 'center' | 'right'

**Quick Example:**

```svelte
<script>
	import { Heading } from '@equaltoai/greater-components/primitives';
</script>

<Heading level={1} size="4xl" align="center">Title</Heading>
```

**Reference:** See [api-reference.md#heading](./api-reference.md#heading) for complete API

#### Text

**Purpose:** Paragraph and inline text component with size, weight, and color variants.

**When to Use:**

- Body text, captions, labels
- Applying standard typography colors (primary, secondary, error)
- Truncating long text

**Key Props:**

- `as`: 'p' | 'span' | 'div' | 'label'
- `size`: 'xs' to '2xl'
- `color`: 'primary' | 'secondary' | 'error' | 'success'
- `truncate`: boolean
- `lines`: number (for multi-line truncation)

**Quick Example:**

```svelte
<script>
	import { Text } from '@equaltoai/greater-components/primitives';
</script>

<Text size="lg" color="secondary">Subtitle text</Text>
```

**Reference:** See [api-reference.md#text](./api-reference.md#text) for complete API

### What This Package Does NOT Provide

❌ NO Grid or Flexbox layout components (use CSS Grid/Flexbox directly)
❌ NO Navigation components (Nav, Navbar, Sidebar, Breadcrumbs) - build with HTML + Button
❌ NO Table components - build with HTML <table> + styling
❌ NO Form wrapper components - build with HTML <form>
❌ NO Image components - use HTML <img> or <picture>

### For Missing Functionality

**If you need layout beyond Container/Section:**
Use standard HTML + CSS Grid/Flexbox:

- Grid layouts: `<div style="display: grid; ...">`
- Flex layouts: `<div style="display: flex; ...">`
- Responsive: CSS media queries

**If you need navigation:**
Combine HTML + Button component:

- `<nav>` with `<Button>` components
- `<ul><li>` with styling
- SvelteKit links with `<a>` elements

## Chat Package (@equaltoai/greater-components/chat)

### Package Scope

This package provides **8 components** for building AI chat interfaces with streaming responses, tool calls, and configurable settings.

**What Chat Package Provides:**
- Complete chat interface components
- Streaming response support
- Tool/function call visualization
- Context-based state management
- Settings and configuration UI

### All 8 Components (Complete List)

**Core Components (4):**
- Container - Main wrapper providing context and layout
- Messages - Scrollable message list with auto-scroll
- Message - Individual message bubble with role-based styling
- Input - Smart message composer with auto-resize

**Feature Components (4):**
- Header - Title bar with connection status and actions
- ToolCall - Tool/function call display with collapsible details
- Suggestions - Quick prompt suggestion pills or cards
- Settings - Configuration modal for chat settings

### Detailed Component Reference

#### Container

**Purpose:** Root component providing chat context and flex layout wrapper.

**When to Use:**
- As the outermost wrapper for all chat components
- When you need shared state across chat components

**Key Props:**
- `class`: string - Custom CSS class
- `children`: Snippet - Child components

**Quick Example:**

```svelte
<script>
  import * as Chat from '@equaltoai/greater-components/chat';
</script>

<Chat.Container>
  <Chat.Header title="AI Assistant" />
  <Chat.Messages {messages} />
  <Chat.Input onSend={handleSend} />
</Chat.Container>
```

#### Messages

**Purpose:** Scrollable container for message list with auto-scroll and empty state.

**When to Use:**
- Displaying conversation history
- When you need auto-scroll behavior

**Key Props:**
- `messages`: ChatMessage[] - Array of messages to display
- `autoScroll`: boolean - Auto-scroll to new messages (default: true)
- `showAvatars`: boolean - Show message avatars (default: true)
- `renderMarkdown`: boolean - Render markdown content (default: true)
- `loading`: boolean - Show loading skeleton
- `emptyState`: Snippet - Custom empty state

#### Message

**Purpose:** Individual message bubble with role-based styling and markdown rendering.

**When to Use:**
- Displaying individual messages (typically handled by Messages component)
- Custom message layouts

**Key Props:**
- `message`: ChatMessage - Message to display (required)
- `showAvatar`: boolean - Show avatar (default: true)
- `renderMarkdown`: boolean - Render markdown (default: true)

**Role Styling:**
- `user`: Right-aligned, primary color background
- `assistant`: Left-aligned, card with markdown
- `system`: Centered, muted, full-width

#### Input

**Purpose:** Smart message composer with auto-resize, keyboard shortcuts, and file upload.

**When to Use:**
- Chat message composition
- File attachment interfaces

**Key Props:**
- `value`: string - Input value (bindable)
- `placeholder`: string - Placeholder text
- `disabled`: boolean - Disable input
- `showFileUpload`: boolean - Show file upload button
- `maxLength`: number - Character limit
- `onSend`: (content, files?) => void - Send callback

**Keyboard Shortcuts:**
- Enter → Send message
- Shift+Enter → Insert newline
- Escape → Clear input

#### Header

**Purpose:** Title bar with connection status indicator and action buttons.

**When to Use:**
- Top of chat interface
- When you need clear/settings buttons

**Key Props:**
- `title`: string - Header title
- `subtitle`: string - Optional subtitle
- `connectionStatus`: 'connected' | 'connecting' | 'disconnected'
- `showClearButton`: boolean - Show clear button (default: true)
- `showSettingsButton`: boolean - Show settings button
- `onClear`: () => void - Clear callback
- `onSettings`: () => void - Settings callback

#### ToolCall

**Purpose:** Display AI tool/function invocations with status and results.

**When to Use:**
- Showing tool calls within assistant messages
- Debugging AI tool usage

**Key Props:**
- `toolCall`: ToolCall - Tool call data (required)
- `showResult`: boolean - Show result section (default: true)
- `collapsible`: boolean - Allow collapse/expand (default: true)
- `defaultCollapsed`: boolean - Initially collapsed (default: true)

**Status Indicators:**
- `pending` → Gray clock
- `running` → Spinner
- `complete` → Green check
- `error` → Red X

#### Suggestions

**Purpose:** Quick prompt suggestions for empty state or follow-up prompts.

**When to Use:**
- Empty chat state
- After assistant responses
- Guiding user input

**Key Props:**
- `suggestions`: string[] | ChatSuggestionItem[] - Suggestions (required)
- `onSelect`: (suggestion) => void - Selection callback (required)
- `variant`: 'pills' | 'cards' - Visual variant (default: 'pills')

**Variants:**
- `pills`: Compact horizontal buttons, wrap on mobile
- `cards`: Larger cards with optional descriptions

#### Settings

**Purpose:** Modal for configuring chat settings (model, temperature, etc.).

**When to Use:**
- User-configurable AI settings
- Model selection interfaces

**Key Props:**
- `open`: boolean - Modal visibility (bindable)
- `settings`: ChatSettingsState - Current settings (required)
- `availableModels`: {id, name}[] - Model options
- `availableKnowledgeBases`: KnowledgeBaseConfig[] - KB options
- `onSettingsChange`: (settings) => void - Change callback

### Context API

**createChatContext** - Creates shared state for chat components
**getChatContext** - Retrieves context from parent Container
**hasChatContext** - Checks if context exists

### Exported Constants

- `defaultPAISuggestions`: string[] - Default PAI prompt suggestions
- `defaultModelOptions`: {id, name}[] - Default model options

### What Chat Package Does NOT Provide

❌ NO WebSocket client (you provide the connection)
❌ NO AI backend (you implement the API)
❌ NO Message persistence (you handle storage)
❌ NO Authentication (you implement auth)

### For Missing Functionality

**If you need WebSocket connections:**
Use pai-socket or your own WebSocket client to stream messages.

**If you need message persistence:**
Store messages in localStorage, IndexedDB, or your backend.

**Reference:** See [chat-suite.md](./chat-suite.md) for complete documentation.

---

## Package Selection Guide

### Quick Decision Matrix

| Need                   | Use This Package | Import From                                |
| ---------------------- | ---------------- | ------------------------------------------ |
| Button, form inputs    | Primitives       | `@equaltoai/greater-components/primitives` |
| Layout containers      | Primitives       | `@equaltoai/greater-components/primitives` |
| Typography             | Primitives       | `@equaltoai/greater-components/primitives` |
| **AI chat interface**  | **Chat**         | `@equaltoai/greater-components/chat`       |
| Icons                  | Icons            | `@equaltoai/greater-components/icons`      |
| Social media feed      | Fediverse        | `@equaltoai/greater-components/fediverse`  |
| User profiles          | Fediverse        | `@equaltoai/greater-components/fediverse`  |
| Complete style control | Headless         | `@equaltoai/greater-components/headless`   |
| ActivityPub connection | Adapters         | `@equaltoai/greater-components/adapters`   |
| Utility functions      | Utils            | `@equaltoai/greater-components/utils`      |

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

## Icons Package (@equaltoai/greater-components/icons)

### Naming Convention

Filename (kebab-case) → Export (PascalCase + Icon):

- `code.svelte` → `CodeIcon`
- `alert-circle.svelte` → `AlertCircleIcon`
- `arrow-right.svelte` → `ArrowRightIcon`

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

## Fediverse Package (@equaltoai/greater-components/fediverse)

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
	import { Status } from '@equaltoai/greater-components/fediverse';
</script>

<Status.Root {status} {handlers}>
	<Status.Header />
	<Status.Content />
	<Status.Media />
	<Status.Actions />
</Status.Root>
```

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
	import { Timeline, Status } from '@equaltoai/greater-components/fediverse';
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

## Headless Package (@equaltoai/greater-components/headless)

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
	import { createButton } from '@equaltoai/greater-components/headless/button';

	const button = createButton({
		onClick: () => console.log('clicked'),
		loading: false,
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
```

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
	import { createModal } from '@equaltoai/greater-components/headless/modal';

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

## Adapters Package (@equaltoai/greater-components/adapters)

### Protocol Adapters (2 Concrete, 1 Abstract)

- `LesserGraphQLAdapter` - For Lesser instances (GraphQL + Subscriptions)
- `MastodonRESTAdapter` - For Mastodon/Pleroma instances (REST API)
- `BaseAdapter` - Abstract class for building custom adapters

## Utils Package (@equaltoai/greater-components/utils)

### Utilities

- **Date Formatting:** `formatRelativeTime`, `formatAbsoluteTime`
- **String Manipulation:** `truncate`, `stripHtml`, `sanitizeHtml`
- **Validation:** `isValidUrl`, `isValidEmail`

## Testing Package (@equaltoai/greater-components/testing)

### Test Helpers

- `render` - Wrapper around testing-library `render`
- `fireEvent` - Wrapper around testing-library `fireEvent`
- `axe` - Accessibility testing helper

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

- **Primitives:** 21 components
- **Chat:** 8 components + context utilities
- **Headless:** 5 primitives
- **Fediverse:** 50+ components (including all sub-components and compounds)
- **Icons:** 300+ icons
- **Adapters:** 3 adapters
- **Utils:** ~15 utility functions
- **Testing:** 3 test helpers

### Key Principle

**If it's not listed in this document, it DOES NOT EXIST in Greater Components.**

When you need something not listed:

1. Check if HTML element suffices (`<div>`, `<a>`, `<table>`, etc.)
2. Check if CSS can achieve it (Grid, Flexbox)
3. Build custom component using primitives as foundation
4. Consider if it belongs in Greater Components (file issue)
