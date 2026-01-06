# Greater Components API Reference

<!-- AI Training: This is the complete API reference for Greater Components -->

Complete API documentation for all Greater Components packages.

## Table of Contents

- [Primitives Package](#primitives-package)
  - [Form Controls](#form-controls)
  - [Overlays & Menus](#overlays--menus)
  - [Display & Status](#display--status)
  - [Layout & Typography](#layout--typography)
  - [Theme System](#theme-system)
  - [Settings Components](#settings-components)
  - [Transitions](#transitions)
  - [Utilities](#utilities)
- [Chat Package](#chat-package)
- [Headless Package](#headless-package)
- [Faces Package](#faces-package)
- [Content Package](#content-package)
- [Shared Packages](#shared-packages)
- [Adapters Package](#adapters-package)
- [Tokens Package](#tokens-package)
- [Icons Package](#icons-package)
- [Utils Package](#utils-package)
- [Testing Package](#testing-package)

---

## Primitives Package

`$lib/greater/primitives`

### Form Controls

#### Button

Accessible interactive element with loading states, variants, and keyboard navigation.

**Props:**

| Prop              | Type                                        | Default            | Description                         |
| ----------------- | ------------------------------------------- | ------------------ | ----------------------------------- |
| `variant`         | `'solid' \| 'outline' \| 'ghost'`           | `'solid'`          | Visual style                        |
| `size`            | `'sm' \| 'md' \| 'lg'`                      | `'md'`             | Button size                         |
| `type`            | `'button' \| 'submit' \| 'reset'`           | `'button'`         | HTML button type                    |
| `disabled`        | `boolean`                                   | `false`            | Disables interaction                |
| `loading`         | `boolean`                                   | `false`            | Shows spinner, disables interaction |
| `loadingBehavior` | `'replace-prefix' \| 'append' \| 'prepend'` | `'replace-prefix'` | Spinner position                    |
| `prefix`          | `Snippet`                                   | -                  | Icon/content before text            |
| `suffix`          | `Snippet`                                   | -                  | Icon/content after text             |
| `class`           | `string`                                    | `''`               | Additional CSS classes              |

**Example:**

```svelte
<Button variant="solid" size="md" onclick={handleClick}>
	{#snippet prefix()}<SaveIcon />{/snippet}
	Save Changes
</Button>
```

---

#### CopyButton

Button for copying text to clipboard with visual feedback.

**Props:**

| Prop             | Type                              | Default   | Description               |
| ---------------- | --------------------------------- | --------- | ------------------------- |
| `text`           | `string`                          | -         | Text to copy              |
| `targetSelector` | `string`                          | -         | CSS selector to copy from |
| `variant`        | `'icon' \| 'text' \| 'icon-text'` | `'icon'`  | Content layout            |
| `buttonVariant`  | `'ghost' \| 'solid' \| 'outline'` | `'ghost'` | Button style              |

**Example:**

```svelte
<CopyButton text="greater add faces/social" />
```

---

#### TextField

Single-line text input with label, validation, and accessibility.

**Props:**

| Prop           | Type                                                            | Default  | Description            |
| -------------- | --------------------------------------------------------------- | -------- | ---------------------- |
| `value`        | `string`                                                        | `''`     | Input value (bindable) |
| `label`        | `string`                                                        | -        | Label text             |
| `type`         | `'text' \| 'email' \| 'password' \| 'url' \| 'tel' \| 'search'` | `'text'` | Input type             |
| `placeholder`  | `string`                                                        | -        | Placeholder text       |
| `invalid`      | `boolean`                                                       | `false`  | Error state            |
| `disabled`     | `boolean`                                                       | `false`  | Disabled state         |
| `readonly`     | `boolean`                                                       | `false`  | Read-only state        |
| `required`     | `boolean`                                                       | `false`  | Required state         |
| `helpText`     | `string`                                                        | -        | Helper text            |
| `errorMessage` | `string`                                                        | -        | Error message          |
| `prefix`       | `Snippet`                                                       | -        | Content before input   |
| `suffix`       | `Snippet`                                                       | -        | Content after input    |

**Example:**

```svelte
<TextField
	bind:value={email}
	label="Email"
	type="email"
	required
	errorMessage={errors.email}
	invalid={!!errors.email}
/>
```

---

#### TextArea

Multi-line text input with auto-resize support.

**Props:**

| Prop           | Type      | Default | Description            |
| -------------- | --------- | ------- | ---------------------- |
| `value`        | `string`  | `''`    | Input value (bindable) |
| `label`        | `string`  | -       | Label text             |
| `rows`         | `number`  | `3`     | Initial visible rows   |
| `maxLength`    | `number`  | -       | Character limit        |
| `invalid`      | `boolean` | `false` | Error state            |
| `disabled`     | `boolean` | `false` | Disabled state         |
| `helpText`     | `string`  | -       | Helper text            |
| `errorMessage` | `string`  | -       | Error message          |

**Example:**

```svelte
<TextArea bind:value={bio} label="Biography" rows={4} maxLength={500} />
```

---

#### Select

Dropdown select with keyboard navigation.

**Props:**

| Prop          | Type                                   | Default | Description               |
| ------------- | -------------------------------------- | ------- | ------------------------- |
| `value`       | `string \| number`                     | -       | Selected value (bindable) |
| `options`     | `Array<{ label: string, value: any }>` | `[]`    | Options list              |
| `label`       | `string`                               | -       | Label text                |
| `placeholder` | `string`                               | -       | Placeholder text          |
| `invalid`     | `boolean`                              | `false` | Error state               |
| `disabled`    | `boolean`                              | `false` | Disabled state            |

**Example:**

```svelte
<Select
	bind:value={country}
	options={[
		{ label: 'USA', value: 'us' },
		{ label: 'Canada', value: 'ca' },
	]}
	label="Country"
/>
```

---

#### Checkbox

Boolean selection control with indeterminate support.

**Props:**

| Prop            | Type      | Default | Description              |
| --------------- | --------- | ------- | ------------------------ |
| `checked`       | `boolean` | `false` | Checked state (bindable) |
| `label`         | `string`  | -       | Label text               |
| `disabled`      | `boolean` | `false` | Disabled state           |
| `indeterminate` | `boolean` | `false` | Partially selected state |

**Example:**

```svelte
<Checkbox bind:checked={accepted} label="I agree to the Terms" />
```

---

#### Switch

Toggle control for boolean states.

**Props:**

| Prop       | Type      | Default | Description             |
| ---------- | --------- | ------- | ----------------------- |
| `checked`  | `boolean` | `false` | Active state (bindable) |
| `label`    | `string`  | -       | Label text              |
| `disabled` | `boolean` | `false` | Disabled state          |

**Example:**

```svelte
<Switch bind:checked={darkMode} label="Dark Mode" />
```

---

#### FileUpload

Drag-and-drop file selection with click fallback.

**Props:**

| Prop       | Type                      | Default | Description            |
| ---------- | ------------------------- | ------- | ---------------------- |
| `accept`   | `string`                  | `'*'`   | Accepted file types    |
| `multiple` | `boolean`                 | `false` | Allow multiple files   |
| `maxSize`  | `number`                  | -       | Max file size in bytes |
| `onSelect` | `(files: File[]) => void` | -       | Selection callback     |

**Example:**

```svelte
<FileUpload accept="image/*" onSelect={(files) => handleUpload(files)}>Drop image here</FileUpload>
```

---

#### DropZone

Drag-and-drop file upload area.

**Props:**

| Prop       | Type                      | Default | Description             |
| ---------- | ------------------------- | ------- | ----------------------- |
| `accept`   | `object`                  | -       | File type configuration |
| `multiple` | `boolean`                 | `false` | Allow multiple files    |
| `onDrop`   | `(files: File[]) => void` | -       | Drop callback           |
| `disabled` | `boolean`                 | `false` | Disabled state          |

---

### Overlays & Menus

#### Modal

Accessible dialog with focus management and scroll locking.

**Props:**

| Prop              | Type                                     | Default | Description                 |
| ----------------- | ---------------------------------------- | ------- | --------------------------- |
| `open`            | `boolean`                                | `false` | Visibility state (bindable) |
| `title`           | `string`                                 | -       | Modal title                 |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'`  | Width variant               |
| `closeOnEscape`   | `boolean`                                | `true`  | Close on Escape key         |
| `closeOnBackdrop` | `boolean`                                | `true`  | Close on backdrop click     |
| `preventScroll`   | `boolean`                                | `true`  | Prevent body scroll         |
| `header`          | `Snippet`                                | -       | Custom header content       |
| `footer`          | `Snippet`                                | -       | Footer content              |
| `onClose`         | `() => void`                             | -       | Close callback              |
| `onOpen`          | `() => void`                             | -       | Open callback               |

**Example:**

```svelte
<Modal bind:open={showDialog} title="Confirm">
	<p>Are you sure?</p>
	{#snippet footer()}
		<Button onclick={() => (open = false)}>Cancel</Button>
		<Button variant="solid" onclick={confirm}>Confirm</Button>
	{/snippet}
</Modal>
```

---

#### Menu

Dropdown menu compound component with keyboard navigation and accessibility.

**Sub-components:**

| Component        | Description                        |
| ---------------- | ---------------------------------- |
| `Menu.Root`      | Container that manages menu state  |
| `Menu.Trigger`   | Button/element that opens the menu |
| `Menu.Content`   | The dropdown panel                 |
| `Menu.Header`    | Optional section header            |
| `Menu.Item`      | Individual menu item               |
| `Menu.Separator` | Visual divider between items       |

**Menu.Item Props:**

| Prop          | Type         | Default | Description                |
| ------------- | ------------ | ------- | -------------------------- |
| `label`       | `string`     | -       | Item label text            |
| `icon`        | `Component`  | -       | Leading icon               |
| `shortcut`    | `string`     | -       | Keyboard shortcut hint     |
| `destructive` | `boolean`    | `false` | Destructive action styling |
| `disabled`    | `boolean`    | `false` | Disabled state             |
| `onclick`     | `() => void` | -       | Click handler              |

**Example:**

```svelte
<script>
	import { Button, Menu } from '$lib/greater/primitives';
	import { EditIcon, TrashIcon } from '$lib/greater/icons';
</script>

<Menu.Root>
	<Menu.Trigger>
		<Button variant="ghost">Options</Button>
	</Menu.Trigger>
	<Menu.Content>
		<Menu.Header>User Actions</Menu.Header>
		<Menu.Item label="Edit" icon={EditIcon} shortcut="⌘E" onclick={handleEdit} />
		<Menu.Item label="Duplicate" shortcut="⌘D" onclick={handleDuplicate} />
		<Menu.Separator />
		<Menu.Item label="Delete" icon={TrashIcon} destructive onclick={handleDelete} />
	</Menu.Content>
</Menu.Root>
```

---

#### SimpleMenu

Array-based menu wrapper for common patterns.

**Props:**

| Prop        | Type                                                         | Default          | Description                                          |
| ----------- | ------------------------------------------------------------ | ---------------- | ---------------------------------------------------- |
| `items`     | `MenuItem[]`                                                 | `[]`             | Menu items `{ label, value, disabled?, separator? }` |
| `onSelect`  | `(value: string) => void`                                    | -                | Selection callback                                   |
| `trigger`   | `Snippet`                                                    | -                | Trigger element                                      |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Menu position                                        |

**Example:**

```svelte
<SimpleMenu items={[{ label: 'Edit', value: 'edit' }]} onSelect={handleAction}>
	{#snippet trigger()}<button>Options</button>{/snippet}
</SimpleMenu>
```

---

#### Tooltip

Hover/focus contextual information with CSS-based positioning for CSP compliance.

**Props:**

| Prop        | Type                                               | Default                    | Description                  |
| ----------- | -------------------------------------------------- | -------------------------- | ---------------------------- |
| `content`   | `string`                                           | -                          | Tooltip content (required)   |
| `id`        | `string`                                           | -                          | Custom ID for accessibility  |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'top'`                    | Position relative to trigger |
| `trigger`   | `'hover' \| 'focus' \| 'click' \| 'manual'`        | `'hover'`                  | How tooltip is triggered     |
| `delay`     | `number \| { show?: number; hide?: number }`       | `{ show: 500, hide: 100 }` | Show/hide delay (ms)         |
| `disabled`  | `boolean`                                          | `false`                    | Disable tooltip              |
| `class`     | `string`                                           | `''`                       | Additional CSS classes       |
| `children`  | `Snippet`                                          | -                          | Trigger element              |

**Placement Options:**

| Placement | Description                                            |
| --------- | ------------------------------------------------------ |
| `top`     | Above the trigger, centered horizontally               |
| `bottom`  | Below the trigger, centered horizontally               |
| `left`    | Left of the trigger, centered vertically               |
| `right`   | Right of the trigger, centered vertically              |
| `auto`    | Automatically selects best placement based on viewport |

**CSP Compliance:**

Tooltip is fully CSP-compliant and emits no inline `style` attributes. Positioning is achieved via CSS classes and transforms:

- Placement: `gr-tooltip--{placement}` (top, bottom, left, right)
- Visibility: `gr-tooltip--visible`

**Positioning Approach:**

The tooltip uses CSS-based positioning relative to its trigger element:

1. The trigger is wrapped in a `position: relative` container
2. The tooltip uses `position: absolute` with CSS transforms
3. Each placement has specific CSS rules for positioning
4. Auto placement uses viewport heuristics to select the best class

**Positioning Constraints vs Previous Implementation:**

| Feature                   | Previous (Inline Styles)   | Current (CSS Classes)   |
| ------------------------- | -------------------------- | ----------------------- |
| Pixel-perfect positioning | ✅ Calculated per-pixel    | ❌ Relative to trigger  |
| Viewport edge handling    | ✅ Precise repositioning   | ⚠️ Class-based fallback |
| CSP compliance            | ❌ Requires unsafe-inline  | ✅ Fully compliant      |
| Performance               | ⚠️ JS calculations on show | ✅ Pure CSS positioning |

**Example:**

```svelte
<script>
	import { Tooltip, Button } from '$lib/greater/primitives';
	import { SettingsIcon, InfoIcon } from '$lib/greater/icons';
</script>

<!-- Basic usage -->
<Tooltip content="Settings">
	<Button variant="ghost"><SettingsIcon /></Button>
</Tooltip>

<!-- Different placements -->
<Tooltip content="Info" placement="bottom">
	<InfoIcon />
</Tooltip>

<!-- Auto placement -->
<Tooltip content="Automatically positioned" placement="auto">
	<Button>Hover me</Button>
</Tooltip>

<!-- Click trigger -->
<Tooltip content="Click to toggle" trigger="click">
	<Button>Click me</Button>
</Tooltip>

<!-- Custom delay -->
<Tooltip content="Quick show" delay={{ show: 100, hide: 200 }}>
	<span>Hover for quick tooltip</span>
</Tooltip>
```

**Custom Positioning via External CSS:**

For pixel-perfect positioning requirements, use the `class` prop with external CSS:

```css
/* In your app's stylesheet */
.my-custom-tooltip {
	/* Override default positioning */
	top: auto !important;
	bottom: auto !important;
	left: 50% !important;
	transform: translateX(-50%) translateY(-120%) !important;
}
```

See [CSP Migration Guide](./csp-migration-guide.md) for detailed migration examples.

---

#### Tabs

Tab navigation component with keyboard support and ARIA semantics.

**Props:**

| Prop          | Type                                  | Default        | Description              |
| ------------- | ------------------------------------- | -------------- | ------------------------ |
| `tabs`        | `TabData[]`                           | `[]`           | Array of tab definitions |
| `activeTab`   | `string`                              | -              | Active tab ID (bindable) |
| `orientation` | `'horizontal' \| 'vertical'`          | `'horizontal'` | Tab list direction       |
| `activation`  | `'automatic' \| 'manual'`             | `'automatic'`  | Tab activation mode      |
| `variant`     | `'default' \| 'pills' \| 'underline'` | `'default'`    | Visual style             |
| `class`       | `string`                              | `''`           | Additional CSS classes   |
| `onTabChange` | `(tabId: string) => void`             | -              | Tab change callback      |

**TabData Interface:**

```typescript
interface TabData {
	id: string; // Unique tab identifier
	label: string; // Tab button label
	disabled?: boolean; // Disable this tab
	content?: Snippet; // Panel content
}
```

**Keyboard Navigation:**

- `ArrowLeft/ArrowRight`: Navigate tabs (horizontal)
- `ArrowUp/ArrowDown`: Navigate tabs (vertical)
- `Home`: Go to first tab
- `End`: Go to last tab
- `Enter/Space`: Activate tab (in manual mode)

**Example:**

```svelte
<script>
	import { Tabs } from '$lib/greater/primitives';

	const tabs = [
		{ id: 'account', label: 'Account' },
		{ id: 'security', label: 'Security' },
		{ id: 'notifications', label: 'Notifications', disabled: true },
	];
</script>

<Tabs
	{tabs}
	activeTab="account"
	variant="pills"
	onTabChange={(id) => console.log('Switched to:', id)}
>
	{#snippet account()}
		<h3>Account Settings</h3>
		<p>Manage your account details here.</p>
	{/snippet}

	{#snippet security()}
		<h3>Security Settings</h3>
		<p>Update your password and 2FA options.</p>
	{/snippet}
</Tabs>
```

---

### Display & Status

#### Alert

Contextual feedback banner with actions and dismissibility.

**Props:**

| Prop          | Type                                          | Default  | Description        |
| ------------- | --------------------------------------------- | -------- | ------------------ |
| `variant`     | `'error' \| 'warning' \| 'success' \| 'info'` | `'info'` | Visual style       |
| `title`       | `string`                                      | -        | Prominent title    |
| `dismissible` | `boolean`                                     | `false`  | Show close button  |
| `onDismiss`   | `() => void`                                  | -        | Dismiss callback   |
| `actionLabel` | `string`                                      | -        | Action button text |
| `onAction`    | `() => void`                                  | -        | Action callback    |
| `icon`        | `Snippet`                                     | -        | Custom icon        |

**Example:**

```svelte
<Alert variant="error" title="Connection Lost" dismissible>Your session has expired.</Alert>
```

---

#### Avatar

User representation with image, initials, or icon fallback.

**Props:**

| Prop             | Type                                                           | Default          | Description         |
| ---------------- | -------------------------------------------------------------- | ---------------- | ------------------- |
| `src`            | `string`                                                       | -                | Image URL           |
| `alt`            | `string`                                                       | -                | Alt text            |
| `name`           | `string`                                                       | `''`             | Name for initials   |
| `label`          | `string`                                                       | -                | Text label fallback |
| `labelIcon`      | `Component`                                                    | -                | Icon fallback       |
| `fallbackMode`   | `'initials' \| 'label' \| 'icon'`                              | `'initials'`     | Fallback type       |
| `size`           | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                         | `'md'`           | Avatar size         |
| `shape`          | `'circle' \| 'square' \| 'rounded'`                            | `'circle'`       | Shape               |
| `loading`        | `boolean`                                                      | `false`          | Show spinner        |
| `status`         | `'online' \| 'offline' \| 'busy' \| 'away'`                    | -                | Status indicator    |
| `statusPosition` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Status position     |

**Example:**

```svelte
<Avatar src={user.image} name={user.name} size="lg" status="online" />
```

---

#### Badge

Status indicators and labels.

**Props:**

| Prop      | Type                                                                 | Default     | Description  |
| --------- | -------------------------------------------------------------------- | ----------- | ------------ |
| `variant` | `'pill' \| 'dot' \| 'outlined' \| 'filled'`                          | `'pill'`    | Visual style |
| `color`   | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'gray'` | `'primary'` | Color scheme |
| `label`   | `string`                                                             | -           | Badge text   |

**Example:**

```svelte
<Badge color="success" label="Active" />
```

---

#### Spinner

Accessible loading indicator.

**Props:**

| Prop    | Type                                          | Default     | Description         |
| ------- | --------------------------------------------- | ----------- | ------------------- |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`        | `'md'`      | Size (12-48px)      |
| `color` | `'primary' \| 'current' \| 'white' \| 'gray'` | `'primary'` | Color               |
| `label` | `string`                                      | `'Loading'` | Screen reader label |

**Example:**

```svelte
<Spinner size="md" color="primary" />
```

---

#### LoadingState

Loading overlay with message.

**Props:**

| Prop         | Type                                   | Default     | Description        |
| ------------ | -------------------------------------- | ----------- | ------------------ |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Spinner size       |
| `message`    | `string`                               | -           | Loading message    |
| `fullscreen` | `boolean`                              | `false`     | Fullscreen overlay |
| `label`      | `string`                               | `'Loading'` | Accessible label   |

**Example:**

```svelte
<LoadingState message="Loading your data..." fullscreen />
```

---

#### Skeleton

Loading placeholder with shape variants and animations.

**Props:**

| Prop        | Type                                                                         | Default   | Description                                    |
| ----------- | ---------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
| `variant`   | `'text' \| 'circular' \| 'rectangular' \| 'rounded'`                         | `'text'`  | Shape variant                                  |
| `width`     | `'full' \| '1/2' \| '1/3' \| '2/3' \| '1/4' \| '3/4' \| 'content' \| 'auto'` | -         | Width preset (use `class` for custom widths)   |
| `height`    | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                              | -         | Height preset (use `class` for custom heights) |
| `animation` | `'pulse' \| 'wave' \| 'none'`                                                | `'pulse'` | Animation type                                 |
| `loading`   | `boolean`                                                                    | `true`    | Show skeleton or children                      |
| `children`  | `Snippet`                                                                    | -         | Content to show when not loading               |
| `class`     | `string`                                                                     | `''`      | Additional CSS classes                         |

**Variant Defaults:**

- `text`: height=1em, width=100%
- `circular`: square dimensions based on width/height (defaults to 40px)
- `rectangular`: height=120px, width=100%
- `rounded`: Same as rectangular with border-radius

**Example:**

```svelte
<script>
	import { Skeleton } from '$lib/greater/primitives';
	let loading = true;
</script>

<!-- Text placeholder -->
<Skeleton variant="text" width="3/4" />

<!-- Avatar placeholder (defaults to 40px square) -->
<Skeleton variant="circular" />

<!-- Card placeholder -->
<Skeleton variant="rounded" animation="wave" />

<!-- Conditional rendering -->
<Skeleton {loading}>
	<p>Loaded content appears here</p>
</Skeleton>
```

---

#### StreamingText

Text display with typewriter cursor effect for AI streaming responses.

**Props:**

| Prop         | Type         | Default  | Description                                          |
| ------------ | ------------ | -------- | ---------------------------------------------------- |
| `content`    | `string`     | `''`     | Text content to display                              |
| `streaming`  | `boolean`    | `true`   | Whether content is still streaming (controls cursor) |
| `showCursor` | `boolean`    | `true`   | Show blinking cursor                                 |
| `cursorChar` | `string`     | `'▊'`    | Character to use for cursor                          |
| `as`         | `string`     | `'span'` | HTML element to render                               |
| `class`      | `string`     | `''`     | Additional CSS classes                               |
| `onComplete` | `() => void` | -        | Callback when streaming finishes                     |

**Example:**

````svelte
<script>
  import { StreamingText } from '$lib/greater/primitives';

  let content = $state('');
  let streaming = $state(true);

  // Simulate streaming
  async function streamResponse() {
    for (const char of 'Hello, how can I help you today?') {
      content += char;
      await new Promise(r => setTimeout(r, 30));
    }
    streaming = false;
  }
</script>

<StreamingText
  {content}
  {streaming}
  showCursor
  onComplete={() => console.log('Done streaming')}
/>

---

#### GradientText

Eye-catching gradient text effect with presets and custom colors.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gradient` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'custom'` | `'primary'` | Gradient preset |
| `direction` | `string` | `'to right'` | CSS gradient direction (e.g., `'45deg'`, `'to bottom'`) |
| `from` | `string` | - | Start color (required for custom) |
| `to` | `string` | - | End color (required for custom) |
| `via` | `string` | - | Optional middle color (for 3-stop gradients) |
| `as` | `string` | `'span'` | HTML element to render |
| `class` | `string` | `''` | Additional CSS classes |

**Preset Colors:**
- `primary`: primary-600 → primary-400
- `success`: success-600 → success-400
- `warning`: warning-600 → warning-400
- `error`: error-600 → error-400

**Example:**

```svelte
<script>
  import { GradientText } from '$lib/greater/primitives';
</script>

<!-- Preset gradient -->
<GradientText gradient="primary" as="h1">
  Welcome to Greater Components
</GradientText>

<!-- Custom gradient -->
<GradientText
  gradient="custom"
  from="#ff6b6b"
  via="#feca57"
  to="#48dbfb"
  direction="45deg"
>
  Rainbow Text
</GradientText>
````

---

#### List

Styled list wrapper with icon integration.

**Props:**

| Prop        | Type                                                       | Default     | Description                        |
| ----------- | ---------------------------------------------------------- | ----------- | ---------------------------------- |
| `icon`      | `Component`                                                | -           | Icon component for all items       |
| `iconColor` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'gray'` | `'primary'` | Icon color                         |
| `iconSize`  | `number`                                                   | `20`        | Icon size in pixels                |
| `spacing`   | `'sm' \| 'md' \| 'lg'`                                     | `'md'`      | Vertical spacing between items     |
| `maxWidth`  | `string \| number`                                         | -           | Maximum width of list              |
| `ordered`   | `boolean`                                                  | `false`     | Render as `<ol>` instead of `<ul>` |
| `class`     | `string`                                                   | `''`        | Additional CSS classes             |

---

#### ListItem

Individual item within a List. Inherits icon and color from parent List.

**Props:**

| Prop        | Type                                                       | Default | Description                  |
| ----------- | ---------------------------------------------------------- | ------- | ---------------------------- |
| `icon`      | `Component`                                                | -       | Override icon for this item  |
| `iconColor` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'gray'` | -       | Override color for this item |
| `class`     | `string`                                                   | `''`    | Additional CSS classes       |

**Example:**

```svelte
<script>
	import { List, ListItem } from '$lib/greater/primitives';
	import { CheckCircleIcon, AlertIcon } from '$lib/greater/icons';
</script>

<List icon={CheckCircleIcon} iconColor="success" spacing="md">
	<ListItem>Feature one is included</ListItem>
	<ListItem>Feature two is included</ListItem>
	<ListItem icon={AlertIcon} iconColor="warning">This feature is beta</ListItem>
</List>
```

---

#### StepIndicator

Numbered badge for tutorials and multi-step workflows.

**Props:**

| Prop      | Type                                              | Default     | Description                     |
| --------- | ------------------------------------------------- | ----------- | ------------------------------- |
| `number`  | `number \| string`                                | -           | Step number or character        |
| `label`   | `string`                                          | -           | Label displayed below indicator |
| `variant` | `'filled' \| 'outlined' \| 'ghost'`               | `'filled'`  | Visual style                    |
| `size`    | `'sm' \| 'md' \| 'lg'`                            | `'md'`      | Indicator size                  |
| `state`   | `'pending' \| 'active' \| 'completed' \| 'error'` | `'active'`  | Current step state              |
| `color`   | `'primary' \| 'success' \| 'warning' \| 'error'`  | `'primary'` | Color theme                     |
| `icon`    | `Component`                                       | -           | Custom icon (overrides number)  |
| `class`   | `string`                                          | `''`        | Additional CSS classes          |

**State Behavior:**

- `pending`: Gray color, shows number
- `active`: Uses `color` prop, shows number
- `completed`: Green color, shows checkmark
- `error`: Red color, shows X icon

**Example:**

```svelte
<script>
	import { StepIndicator } from '$lib/greater/primitives';
</script>

<div style="display: flex; gap: 1rem;">
	<StepIndicator number={1} state="completed" label="Account" />
	<StepIndicator number={2} state="active" label="Details" />
	<StepIndicator number={3} state="pending" label="Confirm" />
</div>
```

---

#### IconBadge

Container for icons with consistent shapes, sizes, and colors.

**Props:**

| Prop       | Type                                                       | Default     | Description                                       |
| ---------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------- |
| `icon`     | `Component`                                                | -           | Icon component to display                         |
| `iconSize` | `number`                                                   | -           | Override icon size (defaults based on badge size) |
| `size`     | `'sm' \| 'md' \| 'lg' \| 'xl'`                             | `'md'`      | Badge size (40-96px)                              |
| `color`    | `'primary' \| 'success' \| 'warning' \| 'error' \| 'gray'` | `'primary'` | Color theme                                       |
| `variant`  | `'filled' \| 'outlined' \| 'ghost'`                        | `'filled'`  | Visual style                                      |
| `shape`    | `'circle' \| 'rounded' \| 'square'`                        | `'circle'`  | Container shape                                   |
| `class`    | `string`                                                   | `''`        | Additional CSS classes                            |
| `children` | `Snippet`                                                  | -           | Alternative content instead of icon prop          |

**Size Dimensions:**

- `sm`: 40px badge, 20px icon
- `md`: 56px badge, 28px icon
- `lg`: 72px badge, 36px icon
- `xl`: 96px badge, 48px icon

**Example:**

```svelte
<script>
	import { IconBadge } from '$lib/greater/primitives';
	import { TargetIcon, SettingsIcon, RocketIcon } from '$lib/greater/icons';
</script>

<div style="display: flex; gap: 1rem;">
	<IconBadge icon={TargetIcon} size="lg" color="primary" />
	<IconBadge icon={SettingsIcon} variant="outlined" shape="rounded" />
	<IconBadge icon={RocketIcon} variant="ghost" color="success" />
</div>
```

---

### Layout & Typography

#### Card

Content container with elevation, borders, and sections.

**Props:**

| Prop        | Type                                   | Default      | Description        |
| ----------- | -------------------------------------- | ------------ | ------------------ |
| `variant`   | `'elevated' \| 'outlined' \| 'filled'` | `'elevated'` | Visual style       |
| `padding`   | `'none' \| 'sm' \| 'md' \| 'lg'`       | `'md'`       | Internal padding   |
| `clickable` | `boolean`                              | `false`      | Render as button   |
| `hoverable` | `boolean`                              | `false`      | Show hover effects |
| `href`      | `string`                               | -            | Render as link     |
| `target`    | `string`                               | -            | Link target        |
| `header`    | `Snippet`                              | -            | Header content     |
| `footer`    | `Snippet`                              | -            | Footer content     |

**Example:**

```svelte
<Card variant="elevated" hoverable href="/details">
	<p>Click to navigate</p>
</Card>
```

---

#### Container

Max-width wrapper for content centering.

**Props:**

| Prop       | Type                                              | Default | Description        |
| ---------- | ------------------------------------------------- | ------- | ------------------ |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'lg'`  | Max width          |
| `padding`  | `boolean \| 'sm' \| 'md' \| 'lg'`                 | `'md'`  | Horizontal padding |
| `centered` | `boolean`                                         | `true`  | Center content     |

---

#### Section

Semantic section wrapper with vertical spacing. Uses preset-based spacing and background for CSP compliance.

**Props:**

| Prop                | Type                                                                                                                             | Default       | Description                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------- |
| `spacing`           | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'`                                                              | `'md'`        | Vertical margin preset                          |
| `background`        | `'default' \| 'muted' \| 'accent' \| 'gradient'`                                                                                 | `'default'`   | Background preset                               |
| `gradientDirection` | `'to-top' \| 'to-bottom' \| 'to-left' \| 'to-right' \| 'to-top-left' \| 'to-top-right' \| 'to-bottom-left' \| 'to-bottom-right'` | `'to-bottom'` | Gradient direction (when background="gradient") |
| `padding`           | `boolean \| 'sm' \| 'md' \| 'lg'`                                                                                                | `false`       | Horizontal padding                              |
| `centered`          | `boolean`                                                                                                                        | `false`       | Center text                                     |
| `class`             | `string`                                                                                                                         | `''`          | Additional CSS classes for custom styling       |

**Spacing Presets:**

| Preset | Value |
| ------ | ----- |
| `none` | 0     |
| `sm`   | 2rem  |
| `md`   | 4rem  |
| `lg`   | 6rem  |
| `xl`   | 8rem  |
| `2xl`  | 10rem |
| `3xl`  | 12rem |
| `4xl`  | 16rem |

**CSP Compliance:**

Section is fully CSP-compliant and emits no inline `style` attributes. All styling is applied via CSS classes:

- Spacing: `gr-section--spacing-{preset}`
- Background: `gr-section--bg-{preset}`
- Gradient: `gr-section--gradient-{direction}`

**Removed Features (v3.1.0+):**

| Removed Feature          | Migration Path                                      |
| ------------------------ | --------------------------------------------------- |
| Arbitrary spacing values | Use preset values or `class` prop with external CSS |
| Arbitrary background CSS | Use preset values or `class` prop with external CSS |

**Example:**

```svelte
<script>
	import { Section, Container, Heading } from '$lib/greater/primitives';
</script>

<!-- Basic usage -->
<Section spacing="lg">
	<Container>
		<Heading>Section Title</Heading>
		<p>Section content...</p>
	</Container>
</Section>

<!-- With background -->
<Section spacing="xl" background="muted" padding="md">
	<Container>
		<Heading>Muted Background</Heading>
	</Container>
</Section>

<!-- Gradient background -->
<Section background="gradient" gradientDirection="to-bottom-right" spacing="2xl">
	<Container>
		<Heading>Gradient Section</Heading>
	</Container>
</Section>

<!-- Custom styling via external CSS -->
<Section class="my-custom-section">
	<Container>
		<Heading>Custom Section</Heading>
	</Container>
</Section>
```

**Custom Styling via External CSS:**

For custom spacing or background values beyond presets, use the `class` prop:

```css
/* In your app's stylesheet */
.my-custom-section {
	margin-top: 7rem;
	margin-bottom: 7rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

See [CSP Migration Guide](./csp-migration-guide.md) for detailed migration examples.

---

#### Heading

Semantic heading (h1-h6) with typography control.

**Props:**

| Prop     | Type                                                                       | Default  | Description    |
| -------- | -------------------------------------------------------------------------- | -------- | -------------- |
| `level`  | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                                               | `2`      | Semantic level |
| `size`   | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| '5xl'` | -        | Visual size    |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'`                             | `'bold'` | Font weight    |
| `align`  | `'left' \| 'center' \| 'right'`                                            | `'left'` | Text alignment |

---

#### Text

Paragraph and inline text with typography control.

**Props:**

| Prop       | Type                                               | Default     | Description           |
| ---------- | -------------------------------------------------- | ----------- | --------------------- |
| `as`       | `'p' \| 'span' \| 'div' \| 'label'`                | `'p'`       | HTML element          |
| `size`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`    | `'md'`      | Font size             |
| `color`    | `'primary' \| 'secondary' \| 'error' \| 'success'` | `'primary'` | Text color            |
| `truncate` | `boolean`                                          | `false`     | Truncate overflow     |
| `lines`    | `number`                                           | -           | Lines before truncate |

---

### Theme System

#### ThemeProvider

Theme context provider for the application. Applies theme presets using CSS classes for strict CSP compliance.

**Props:**

| Prop                | Type                                                  | Default | Description                               |
| ------------------- | ----------------------------------------------------- | ------- | ----------------------------------------- |
| `theme`             | `'light' \| 'dark' \| 'high-contrast' \| 'auto'`      | -       | Theme mode                                |
| `palette`           | `'slate' \| 'stone' \| 'neutral' \| 'zinc' \| 'gray'` | -       | Color palette preset                      |
| `headingFontPreset` | `'system' \| 'sans' \| 'serif' \| 'mono'`             | -       | Heading font preset                       |
| `bodyFontPreset`    | `'system' \| 'sans' \| 'serif' \| 'mono'`             | -       | Body font preset                          |
| `class`             | `string`                                              | `''`    | Additional CSS classes for custom theming |
| `children`          | `Snippet`                                             | -       | Content to wrap                           |

**CSP Compliance:**

ThemeProvider is fully CSP-compliant and emits no inline `style` attributes. All theming is applied via CSS classes:

- Palette: `gr-theme-provider--palette-{preset}`
- Heading font: `gr-theme-provider--heading-{preset}`
- Body font: `gr-theme-provider--body-{preset}`

**Removed Props (v3.1.0+):**

The following props have been removed for CSP compliance:

| Removed Prop    | Migration Path                                                |
| --------------- | ------------------------------------------------------------- |
| `customPalette` | Use `class` prop with external CSS to define custom variables |
| `headingFont`   | Use `headingFontPreset` with preset values                    |
| `bodyFont`      | Use `bodyFontPreset` with preset values                       |

**Example:**

```svelte
<script>
	import { ThemeProvider } from '$lib/greater/primitives';
</script>

<!-- Basic usage with presets -->
<ThemeProvider theme="dark" palette="slate">
	<App />
</ThemeProvider>

<!-- With typography presets -->
<ThemeProvider palette="neutral" headingFontPreset="serif" bodyFontPreset="sans">
	<App />
</ThemeProvider>

<!-- Custom theming via external CSS -->
<ThemeProvider class="my-custom-theme">
	<App />
</ThemeProvider>
```

**Custom Theming via External CSS:**

For custom palettes or fonts beyond presets, define CSS variables in your stylesheet:

```css
/* In your app's stylesheet */
.my-custom-theme {
	--gr-color-primary: #6366f1;
	--gr-color-primary-50: #eef2ff;
	--gr-color-primary-100: #e0e7ff;
	/* ... define full color scale */

	--gr-typography-fontFamily-heading: 'Custom Font', sans-serif;
	--gr-typography-fontFamily-sans: 'Another Font', sans-serif;
}
```

See [CSP Migration Guide](./csp-migration-guide.md) for detailed migration examples.

---

#### ThemeSwitcher

UI control for theme toggling. Uses preset-based styling for CSP compliance.

**Props:**

| Prop          | Type                                             | Default     | Description                    |
| ------------- | ------------------------------------------------ | ----------- | ------------------------------ |
| `variant`     | `'compact' \| 'full'`                            | `'compact'` | UI variant                     |
| `showPreview` | `boolean`                                        | `true`      | Show theme previews            |
| `value`       | `'light' \| 'dark' \| 'high-contrast' \| 'auto'` | -           | Current theme value (bindable) |
| `class`       | `string`                                         | `''`        | Additional CSS classes         |

**CSP Compliance:**

ThemeSwitcher is fully CSP-compliant and emits no inline `style` attributes. Preview buttons use preset CSS classes instead of inline color styles.

**Removed Features (v3.1.0+):**

| Removed Feature | Reason                                       |
| --------------- | -------------------------------------------- |
| `showAdvanced`  | Custom color pickers required inline styles  |
| `showWorkbench` | Dynamic color preview required inline styles |

For advanced theme customization, use external CSS with the ThemeProvider's `class` prop.

**Example:**

```svelte
<script>
	import { ThemeSwitcher } from '$lib/greater/primitives';

	let theme = $state('auto');
</script>

<!-- Compact variant -->
<ThemeSwitcher bind:value={theme} />

<!-- Full variant with preview -->
<ThemeSwitcher variant="full" showPreview bind:value={theme} />
```

---

#### ColorHarmonyPicker

Visual color harmony selector. Uses preset color classes for CSP compliance.

**Note:** This component is intended for development/design-time use. For production deployments with strict CSP, consider using predefined color palettes.

**Props:**

| Prop          | Type                                                                                                   | Default           | Description            |
| ------------- | ------------------------------------------------------------------------------------------------------ | ----------------- | ---------------------- |
| `harmonyType` | `'complementary' \| 'analogous' \| 'triadic' \| 'tetradic' \| 'splitComplementary' \| 'monochromatic'` | `'complementary'` | Harmony type           |
| `onSelect`    | `(colors: string[]) => void`                                                                           | -                 | Selection callback     |
| `class`       | `string`                                                                                               | `''`              | Additional CSS classes |

---

#### ContrastChecker

Live contrast ratio checker with WCAG indicators. Uses preset color classes for CSP compliance.

**Note:** This component is intended for development/design-time use. For production deployments with strict CSP, consider using predefined color combinations.

**Props:**

| Prop    | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

**CSP Compliance:**

ContrastChecker uses preset color classes instead of inline styles. The component displays predefined color combinations for contrast checking.

---

#### ThemeWorkbench

Complete theme creation workbench. Uses preset swatch classes for CSP compliance.

**Note:** This component is intended for development/design-time use only. It should not be shipped to production deployments with strict CSP requirements.

**Props:**

| Prop    | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `class` | `string` | `''`    | Additional CSS classes |

**CSP Compliance:**

ThemeWorkbench uses preset swatch classes (`gr-swatch--primary-{scale}`) instead of inline background colors. The component is designed for development environments where CSP may be relaxed.

---

### Settings Components

#### SettingsSection

Container for grouped settings.

```typescript
interface SettingsSectionProps {
	title: string;
	description?: string;
	icon?: Snippet;
	collapsible?: boolean;
	children: Snippet;
}
```

#### SettingsGroup

Group of related settings.

```typescript
interface SettingsGroupProps {
	label?: string;
	orientation?: 'vertical' | 'horizontal';
	children: Snippet;
}
```

#### SettingsField

Individual setting with label and control.

```typescript
interface SettingsFieldProps {
	label: string;
	description?: string;
	children: Snippet; // The control
}
```

#### SettingsToggle

Pre-composed toggle setting.

```typescript
interface SettingsToggleProps {
	label: string;
	description?: string;
	value: boolean; // bindable
	disabled?: boolean;
}
```

#### SettingsSelect

Pre-composed select setting.

```typescript
interface SettingsSelectProps<T> {
	label: string;
	description?: string;
	value: T; // bindable
	options: Array<{ value: T; label: string }>;
	disabled?: boolean;
}
```

---

### Transitions

Import from `$lib/greater/primitives`:

```svelte
<script>
	import { fadeUp, fadeDown, slideIn, scaleIn } from '$lib/greater/primitives';
</script>

<div transition:fadeUp={{ duration: 400, delay: 100 }}>Fade up</div>
<div transition:slideIn={{ direction: 'left' }}>Slide in</div>
```

| Transition | Parameters                          | Description        |
| ---------- | ----------------------------------- | ------------------ |
| `fadeUp`   | `{ duration?, delay?, y? }`         | Fade in from below |
| `fadeDown` | `{ duration?, delay?, y? }`         | Fade in from above |
| `slideIn`  | `{ direction?, duration?, delay? }` | Slide from edge    |
| `scaleIn`  | `{ duration?, delay?, start? }`     | Scale from smaller |

---

### Utilities

#### smoothThemeTransition

Apply smooth CSS transitions during theme changes.

```typescript
import { smoothThemeTransition } from '$lib/greater/primitives';

smoothThemeTransition(() => {
	document.documentElement.setAttribute('data-theme', 'dark');
});
```

#### createSmoothThemeToggle

Create a theme toggle function with transitions.

```typescript
import { createSmoothThemeToggle } from '$lib/greater/primitives';

const toggleTheme = createSmoothThemeToggle();
toggleTheme(); // Toggles between light/dark with animation
```

#### preferencesStore

User preference management with persistence.

```typescript
import { preferencesStore, getPreferences } from '$lib/greater/primitives';

const prefs = getPreferences();
preferencesStore.subscribe((prefs) => console.log(prefs));
```

---

## Chat Package

`$lib/components/chat`

See [Chat Component Suite](./chat-suite.md) for comprehensive documentation.

**Quick Reference:**

| Component              | Purpose                   |
| ---------------------- | ------------------------- |
| `Chat.Container`       | Root layout and context   |
| `Chat.Header`          | Title, status, actions    |
| `Chat.Messages`        | Scrollable message list   |
| `Chat.Message`         | Individual message bubble |
| `Chat.MessageAction`   | Message action button     |
| `Chat.Input`           | Message composer          |
| `Chat.ToolCallDisplay` | Tool call visualization   |
| `Chat.Suggestions`     | Quick prompt suggestions  |
| `Chat.Settings`        | Configuration modal       |

**Context API:**

```typescript
import {
	createChatContext,
	getChatContext,
	setChatContext,
	hasChatContext,
	type ChatContextValue,
} from '$lib/components/chat';

interface ChatContextValue {
	state: ChatState;
	handlers: ChatHandlers;
	updateState: (partial: Partial<ChatState>) => void;
	addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
	updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
	removeMessage: (id: string) => void;
	clearMessages: () => void;
	setError: (error: string | null) => void;
	toggleSettings: () => void;
	sendMessage: (content: string) => Promise<void>;
	retryLastMessage: () => Promise<void>;
	cancelStream: () => void;
	updateStreamContent: (content: string) => void;
	setConnectionStatus: (status: ConnectionStatus) => void;
	addToolCall: (messageId: string, toolCall: Omit<ToolCall, 'id'>) => ToolCall;
	updateToolCall: (messageId: string, toolCallId: string, updates: Partial<ToolCall>) => void;
}
```

---

## Headless Package

`$lib/greater/headless`

Behavior-only primitives providing accessibility, keyboard navigation, and state management without any styling. Use these when you need full control over appearance.

These function create a "primitive" object that follows the Builder pattern, containing:

1. **State**: Reactive Svelte 5 runes (proxies) for state management.
2. **Actions**: Svelte actions to attach behavior to DOM nodes.
3. **Helpers**: Utility functions to control the primitive programmatically.

### `createButton`

Accessible button behavior with loading, disabled, and toggle states.

**Configuration:**

```typescript
interface ButtonConfig {
	type?: 'button' | 'submit' | 'reset'; // default: 'button'
	disabled?: boolean;
	loading?: boolean;
	pressed?: boolean; // for toggle buttons
	label?: string; // aria-label
	onClick?: (event: MouseEvent) => void;
	onPressedChange?: (pressed: boolean) => void;
	onKeyDown?: (event: KeyboardEvent) => void;
	onFocus?: (event: FocusEvent) => void;
	onBlur?: (event: FocusEvent) => void;
}
```

**State (`button.state`):**

- `disabled: boolean`
- `loading: boolean`
- `pressed: boolean`
- `focused: boolean`
- `id: string`

**Actions (`button.actions`):**

- `button`: Apply to the `<button>` element.

**Helpers (`button.helpers`):**

- `click()`: Programmatically trigger click.
- `focus()`: Focus the button.
- `blur()`: Blur the button.
- `toggle()`: Toggle pressed state.
- `setDisabled(boolean)`
- `setLoading(boolean)`
- `setPressed(boolean)`

**Example:**

```svelte
<script>
	import { createButton } from '$lib/greater/headless';

	const btn = createButton({
		onClick: () => console.log('Clicked!'),
		loading: false,
	});
</script>

<button use:btn.actions.button class="my-btn">
	{#if btn.state.loading}
		Loading...
	{:else}
		Click Me
	{/if}
</button>
```

---

### `createModal`

Accessible dialog/modal with focus trapping, body scroll locking, and backdrop management.

**Configuration:**

```typescript
interface ModalConfig {
	open?: boolean;
	hasBackdrop?: boolean; // default: true
	preventScroll?: boolean; // default: true
	closeOnEscape?: boolean; // default: true
	closeOnBackdrop?: boolean; // default: true
	returnFocus?: boolean; // Return focus on close (default: true)
	trapFocus?: boolean; // default: true
	initialFocus?: HTMLElement | (() => HTMLElement);
	labelledBy?: string; // aria-labelledby ID
	describedBy?: string; // aria-describedby ID
	onOpenChange?: (open: boolean) => void;
	onOpen?: () => void;
	onClose?: () => void;
	onBeforeClose?: () => boolean | Promise<boolean>;
}
```

**State (`modal.state`):**

- `open: boolean`
- `animating: boolean`
- `mounted: boolean`
- `id: string`
- ...and all config options.

**Actions (`modal.actions`):**

- `trigger`: Apply to button that opens modal.
- `backdrop`: Apply to backdrop overlay.
- `content`: Apply to modal content container (role="dialog").
- `close`: Apply to close button inside modal.

**Helpers (`modal.helpers`):**

- `open()`
- `close()`
- `toggle()`

**Example:**

```svelte
<script>
	import { createModal } from '$lib/greater/headless';
	const modal = createModal();
</script>

<button use:modal.actions.trigger>Open Modal</button>

{#if modal.state.open}
	<div use:modal.actions.backdrop class="backdrop"></div>
	<div use:modal.actions.content class="dialog">
		<h2>Title</h2>
		<p>Content...</p>
		<button use:modal.actions.close>Close</button>
	</div>
{/if}
```

---

### `createMenu`

Dropdown menu with keyboard navigation, typeahead, and submenus.

**Configuration:**

```typescript
interface MenuConfig {
	open?: boolean;
	placement?: 'bottom' | 'top' | 'left' | 'right';
	closeOnSelect?: boolean; // default: true
	loop?: boolean; // Arrow keys loop (default: true)
	typeAhead?: boolean; // default: true
	smartPositioning?: boolean; // default: true
	onSelect?: (value: string) => void;
	onOpenChange?: (open: boolean) => void;
}
```

**State (`menu.state`):**

- `open: boolean`
- `activeIndex: number`
- `focusedIndex: number`
- `id: string`
- `items: HTMLElement[]`

**Actions (`menu.actions`):**

- `trigger`: Button to toggle menu.
- `menu`: Menu container (role="menu").
- `item`: Individual menu item (role="menuitem").
  - Param: `HTMLElement` (node)
  - Param: `{ disabled?: boolean, onClick?: () => void }`
- `separator`: Visual separator.

**Helpers (`menu.helpers`):**

- `open()`, `close()`, `toggle()`
- `setActiveIndex(index)`
- `focusNext()`, `focusPrevious()`, `focusFirst()`, `focusLast()`

**Example:**

```svelte
<script>
	import { createMenu } from '$lib/greater/headless';
	const menu = createMenu({
		onSelect: (val) => console.log('Selected:', val),
	});
</script>

<button use:menu.actions.trigger>Options</button>

{#if menu.state.open}
	<div use:menu.actions.menu>
		<div use:menu.actions.item={{ onClick: () => console.log('Edit') }}>Edit</div>
		<div use:menu.actions.item={{ disabled: true }}>Delete</div>
	</div>
{/if}
```

---

### `createTabs`

Tab interface with keyboard navigation (arrows, Home, End) and focus management.

**Configuration:**

```typescript
interface TabsConfig {
	defaultTab?: number; // default: 0
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean; // Manual vs Automatic activation
	loop?: boolean;
	onChange?: (index: number) => void;
}
```

**State (`tabs.state`):**

- `activeTab: number`
- `focusedIndex: number`
- `orientation: string`
- `id: string`

**Actions (`tabs.actions`):**

- `tabList`: Container for tab buttons (role="tablist").
- `tab`: Individual tab button.
  - Param: `HTMLElement` (node)
  - Param: `{ index: number, disabled?: boolean }`
- `panel`: Content panel.
  - Param: `HTMLElement` (node)
  - Param: `{ index: number }`

**Helpers (`tabs.helpers`):**

- `setActiveTab(index)`
- `focusNext()`, `focusPrevious()`, `focusFirst()`, `focusLast()`
- `setOrientation(orientation)`

**Example:**

```svelte
<script>
	import { createTabs } from '$lib/greater/headless';
	const tabs = createTabs();
</script>

<div use:tabs.actions.tabList>
	<button use:tabs.actions.tab={{ index: 0 }}>Tab 1</button>
	<button use:tabs.actions.tab={{ index: 1 }}>Tab 2</button>
</div>

<div use:tabs.actions.panel={{ index: 0 }}>Content 1</div>
<div use:tabs.actions.panel={{ index: 1 }}>Content 2</div>
```

---

### `createTooltip`

Contextual popup with smart positioning and delay control.

**Configuration:**

```typescript
interface TooltipConfig {
	initialOpen?: boolean;
	placement?: 'top' | 'bottom' | 'left' | 'right';
	openDelay?: number; // ms (default: 300)
	closeDelay?: number; // ms (default: 0)
	offset?: number; // px (default: 8)
	smartPositioning?: boolean; // default: true
	showOnHover?: boolean; // default: true
	showOnFocus?: boolean; // default: true
	disabled?: boolean;
}
```

**State (`tooltip.state`):**

- `open: boolean`
- `placement: string` // Actual placement (may differ if flipped)
- `position: { x, y }` // Coordinates
- `id: string`

**Actions (`tooltip.actions`):**

- `trigger`: The element that triggers the tooltip.
- `content`: The tooltip popup itself.

**Helpers (`tooltip.helpers`):**

- `show()`, `hide()`, `toggle()`
- `updatePosition()`
- `setPlacement(placement)`
- `setDisabled(boolean)`

**Example:**

```svelte
<script>
	import { createTooltip } from '$lib/greater/headless';
	const tooltip = createTooltip({ placement: 'right' });
</script>

<button use:tooltip.actions.trigger>Hover me</button>

{#if tooltip.state.open}
	<div use:tooltip.actions.content>Helpful text</div>
{/if}
```

---

### `createTextField`

Input field with validation, validation states, and accessibility attributes.

**Configuration:**

```typescript
interface TextFieldConfig {
	value?: string;
	placeholder?: string;
	type?: string; // default: 'text'
	multiline?: boolean; // true for textarea
	disabled?: boolean;
	required?: boolean;
	readonly?: boolean;
	maxLength?: number;
	minLength?: number;
	pattern?: string; // Regex pattern
	validate?: (value: string) => string | null; // Custom validation
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
}
```

**State (`field.state`):**

- `value: string`
- `valid: boolean`
- `error: string | null`
- `touched: boolean`
- `focused: boolean`
- `length: number`
- `disabled: boolean`

**Actions (`field.actions`):**

- `field`: Apply to `<input>` or `<textarea>`.

**Helpers (`field.helpers`):**

- `setValue(value)`
- `clear()`
- `validate()`: Trigger validation manually.
- `markTouched()`
- `focus()`, `blur()`

**Example:**

```svelte
<script>
	import { createTextField } from '$lib/greater/headless';
	const email = createTextField({
		type: 'email',
		required: true,
		validate: (val) => (!val.includes('@') ? 'Invalid email' : null),
	});
</script>

<label>
	Email
	<input use:email.actions.field />
</label>
{#if email.state.touched && !email.state.valid}
	<span class="error">{email.state.error}</span>
{/if}
```

---

### `createAlert`

Dismissible alert/banner with appropriate ARIA roles.

**Configuration:**

```typescript
interface AlertConfig {
	variant?: 'error' | 'warning' | 'success' | 'info'; // default: 'info'
	dismissible?: boolean;
	visible?: boolean;
	onDismiss?: () => void;
	onAction?: () => void;
}
```

_Note: `error`/`warning` use `role="alert"`, others use `role="status"`._

**State (`alert.state`):**

- `visible: boolean`
- `variant: string`
- `dismissible: boolean`
- `role: string`
- `id: string`

**Actions (`alert.actions`):**

- `container`: Main alert wrapper.
- `icon`: Icon container (aria-hidden).
- `dismiss`: Close button.
- `action`: Action button.

**Helpers (`alert.helpers`):**

- `show()`, `dismiss()`, `toggle()`
- `setVisible(boolean)`

---

### `createAvatar`

Image avatar with fallback support, loading states, and status indicators.

**Configuration:**

```typescript
interface AvatarConfig {
	src?: string;
	fallbackSrc?: string;
	alt?: string;
	initials?: string;
	status?: 'online' | 'offline' | 'busy' | 'away';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	shape?: 'circle' | 'square' | 'rounded';
}
```

**State (`avatar.state`):**

- `currentSrc: string | null`
- `loading: boolean`
- `error: boolean`
- `showFallback: boolean`
- `status: string`

**Actions (`avatar.actions`):**

- `container`: Wrapper element.
- `image`: The `<img>` element.

**Helpers (`avatar.helpers`):**

- `setSrc(url)`
- `setStatus(status)`
- `reload()`: Force refresh image.

---

### `createSkeleton`

Loading placeholder with shape and animation control.

**Configuration:**

```typescript
interface SkeletonConfig {
	loading?: boolean;
	variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
	animation?: 'pulse' | 'wave' | 'none';
	width?: string | number;
	height?: string | number;
	delay?: number; // ms to wait before showing
	duration?: number; // Animation duration ms
}
```

**State (`skeleton.state`):**

- `loading: boolean`
- `visible: boolean`
- `variant: string`
- `width`, `height`

**Actions (`skeleton.actions`):**

- `skeleton`: Apply to placeholder element.

**Helpers (`skeleton.helpers`):**

- `show()`, `hide()`, `toggle()`
- `setLoading(boolean)`

---

### `createSpinner`

Loading indicator state and accessibility.

**Configuration:**

```typescript
interface SpinnerConfig {
	active?: boolean;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	label?: string; // aria-label (default: "Loading")
	color?: 'primary' | 'current';
}
```

**State (`spinner.state`):**

- `active: boolean`
- `size: string`
- `label: string`
- `id: string`

**Actions (`spinner.actions`):**

- `spinner`: Apply to the spinner container/SVG.

**Helpers (`spinner.helpers`):**

- `start()`, `stop()`, `toggle()`
- `setSize(size)`

---

## Faces Package

Faces are curated UI kits for different product surfaces. Each face exports components and patterns and has its own CSS bundle:

- Social (+ `$lib/styles/greater/social.css`)
- Blog (+ `$lib/styles/greater/blog.css`)
- Community (+ `$lib/styles/greater/community.css`)
- Artist (+ `$lib/styles/greater/artist.css`)

### Social Face

Installed via `greater add faces/social`. Components are vendored under `$lib/components/*` (and supporting types under `$lib/generics/*` where applicable).

Social media components and ActivityPub patterns for Mastodon/Pleroma/Lesser-style UIs.

**Key Components:** `Timeline`, `Status`, `Profile`, `Lists`, `Filters`, `Hashtags`  
**Key Patterns:** `ThreadView`, `ContentWarningHandler`, `VisibilitySelector`, `ModerationTools`, `FederationIndicator`

### Blog Face

Installed via `greater add faces/blog`. Components are vendored under `$lib/components/*`.

Long-form publishing UI for articles and publications.

**Key Components:** `Article`, `Author`, `Publication`, `Navigation`, `Editor`

### Community Face

Installed via `greater add faces/community`. Components are vendored under `$lib/components/*`.

Forum/group discussion UI.

**Key Components:** `Community`, `Post`, `Thread`, `Voting`, `Flair`, `Moderation`, `Wiki`

### Artist Face

Installed via `greater add faces/artist`. Components are vendored under `$lib/components/*`.

Portfolio-centric + community tooling for visual artists, including federation utilities and an adapter extension.

**Key Components:** `Artwork`, `GalleryGrid`, `ArtistProfile`, `DiscoveryEngine`, `MediaViewer`  
**Also Includes:** `createArtistAdapter`, `toActivityPubNote`, `generateArtworkUri`, `serializeMetadata`

---

## Content Package

`$lib/greater/content`

Content rendering components (syntax highlighting + safe Markdown rendering). This package is split out because it includes heavier dependencies (e.g. Shiki and unified/rehype tooling).

### CodeBlock

Syntax highlighting code block.

**Props:**

| Prop              | Type                     | Default         | Description                       |
| ----------------- | ------------------------ | --------------- | --------------------------------- |
| `code`            | `string`                 | -               | Code content                      |
| `language`        | `string`                 | `'text'`        | Language for highlighting         |
| `showCopy`        | `boolean`                | `true`          | Show copy button                  |
| `showLineNumbers` | `boolean`                | `false`         | Show line numbers                 |
| `highlightLines`  | `number[]`               | `[]`            | Lines to highlight (1-based)      |
| `maxHeight`       | `string \| number`       | -               | Maximum height before scrolling   |
| `wrap`            | `boolean`                | `false`         | Wrap long lines                   |
| `filename`        | `string`                 | -               | Filename to display in the header |
| `variant`         | `'outlined' \| 'filled'` | `'outlined'`    | Visual variant                    |
| `theme`           | `string`                 | `'github-dark'` | Shiki theme name                  |
| `class`           | `string`                 | `''`            | Additional CSS classes            |
| `onCopy`          | `(code: string) => void` | -               | Callback when code is copied      |

### MarkdownRenderer

Safe markdown rendering.

**Props:**

| Prop                | Type                     | Default | Description                        |
| ------------------- | ------------------------ | ------- | ---------------------------------- |
| `content`           | `string`                 | -       | Markdown content                   |
| `sanitize`          | `boolean`                | `true`  | Sanitize output HTML               |
| `allowedTags`       | `string[]`               | -       | Override allowed HTML tags         |
| `enableLinks`       | `boolean`                | `true`  | Enable clickable links             |
| `openLinksInNewTab` | `boolean`                | `true`  | Add `target="_blank"` + safe `rel` |
| `class`             | `string`                 | `''`    | Additional CSS classes             |
| `onRenderComplete`  | `() => void`             | -       | Callback when rendering completes  |
| `onError`           | `(error: Error) => void` | -       | Callback on render error           |

---

## Shared Packages

`$lib/components/*`

Domain-specific logic and state management.

- **Auth**: `$lib/components/auth`
- **Admin**: `$lib/components/admin`
- **Compose**: `$lib/components/compose`
- **Messaging**: `$lib/components/messaging`
- **Notifications**: `$lib/components/notifications`
- **Search**: `$lib/components/search`

---

## Adapters Package

`$lib/greater/adapters`

Transport, GraphQL, stores, and mappers for Lesser integration and protocol payload conversion.

| Export                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `LesserGraphQLAdapter` | Typed GraphQL adapter for Lesser (queries/mutations)  |
| `createGraphQLClient`  | Apollo client factory (HTTP + optional WebSocket)     |
| `createTimelineStore`  | Reactive timeline store (paging + optional streaming) |
| `TransportManager`     | Streaming transport orchestration                     |
| `mapMastodonStatus`    | Mapper: Mastodon REST payload → unified model         |
| `mapLesserPost`        | Mapper: Lesser GraphQL payload → unified model        |

---

## Tokens Package

`$lib/greater/tokens`

Design system tokens and theme infrastructure.

**CSS Imports:**

```ts
import '$lib/styles/greater/tokens.css';
```

---

## Icons Package

`$lib/greater/icons`

300+ SVG icons including Fediverse-specific icons.

```svelte
<script>
	import { SaveIcon, SendIcon, SettingsIcon } from '$lib/greater/icons';
</script>

<SaveIcon size={24} />
```

---

## Utils Package

`$lib/greater/utils`

Common utilities for web applications.

---

## Testing Package

`packages/testing` (monorepo-only)

Testing utilities and accessibility validators.

This repo uses Vitest + Testing Library + axe; consumer apps can use their preferred test stack.

---

_Documentation generated for Greater Components v4.x_
