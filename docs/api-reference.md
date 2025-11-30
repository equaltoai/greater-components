# Greater Components API Reference

Complete API documentation for all Greater Components packages.

## Table of Contents

- [Primitives Package](#primitives-package)
  - [Settings Components](#settings-components)
  - [Theme Components](#theme-components)
- [Headless Package](#headless-package)
- [Fediverse Package](#fediverse-package)
  - [Profile Components](#profile-components)
- [Chat Package](#chat-package)
  - [Chat Components](#chat-components)
  - [Context API](#context-api)
- [Adapters Package](#adapters-package)
- [Tokens Package](#tokens-package)
- [Icons Package](#icons-package)
- [Utils Package](#utils-package)
  - [Preference Store](#preference-store)
  - [Theme Utilities](#theme-utilities)
- [Testing Package](#testing-package)

## Primitives Package

`@equaltoai/greater-components/primitives`

... (existing primitives documentation) ...

### Settings Components

Composable building blocks for creating configuration panels.

#### SettingsSection

**Purpose:** Container for a logical group of settings with header.

**Props:**

```typescript
interface SettingsSectionProps {
	title: string;
	description?: string;
	icon?: Snippet;
	children: Snippet;
	collapsible?: boolean;
}
```

**Example:**

```svelte
<SettingsSection title="Account" description="Manage your account">
	<!-- Settings fields go here -->
</SettingsSection>
```

#### SettingsGroup

**Purpose:** Group of related settings fields.

**Props:**

```typescript
interface SettingsGroupProps {
	label?: string;
	children: Snippet;
	orientation?: 'vertical' | 'horizontal';
}
```

#### SettingsField

**Purpose:** Individual setting field with label, description, and control.

**Props:**

```typescript
interface SettingsFieldProps {
	label: string;
	description?: string;
	children: Snippet; // The control (Switch, Select, etc.)
	class?: string;
}
```

#### SettingsToggle

**Purpose:** Pre-composed toggle setting (label + Switch).

**Props:**

```typescript
interface SettingsToggleProps {
	label: string;
	description?: string;
	value: boolean; // bindable
	disabled?: boolean;
}
```

#### SettingsSelect

**Purpose:** Pre-composed select setting (label + Select).

**Props:**

```typescript
interface SettingsSelectProps<T> {
	label: string;
	description?: string;
	value: T; // bindable
	options: Array<{ value: T; label: string }>;
	disabled?: boolean;
}
```

### Theme Components

Advanced components for theme creation and analysis.

#### ColorHarmonyPicker

**Purpose:** Visual color harmony selector with wheel representation.

**Props:**

```typescript
interface ColorHarmonyPickerProps {
	seedColor: string; // bindable
	harmonyType?:
		| 'complementary'
		| 'analogous'
		| 'triadic'
		| 'tetradic'
		| 'splitComplementary'
		| 'monochromatic';
	onSelect?: (colors: string[]) => void;
}
```

#### ContrastChecker

**Purpose:** Live contrast ratio checker with WCAG compliance indicators.

**Props:**

```typescript
interface ContrastCheckerProps {
	foreground: string;
	background: string;
}
```

#### ThemeWorkbench

**Purpose:** Complete theme creation workbench combining color picker, harmony selector, contrast checker, and live preview.

**Props:**

```typescript
interface ThemeWorkbenchProps {
	initialColor?: string;
	onSave?: (theme: ThemeTokens) => void;
}
```

---

## Fediverse Package

`@equaltoai/greater-components/fediverse`

... (existing fediverse documentation) ...

### Profile Components

#### Profile.Timeline

**Purpose:** User Profile Timeline Display. Displays posts, replies, and media from a specific user's profile. Can be used standalone or within `Profile.Root`.

**Props:**

```typescript
interface ProfileTimelineProps {
	username?: string; // Required if not in context
	adapter?: LesserGraphQLAdapter; // Required if not in context
	showReplies?: boolean; // default false
	showBoosts?: boolean; // default true
	onlyMedia?: boolean; // default false
	showPinned?: boolean; // default true
	virtualScrolling?: boolean; // default true
	estimateSize?: number;
	class?: string;
	header?: Snippet;
	emptyState?: Snippet;
}
```

**Example:**

```svelte
<script>
	import { Profile } from '@equaltoai/greater-components/fediverse';
</script>

<Profile.Timeline username="alice" {adapter} showReplies={true} />
```

---

## Adapters Package

`@equaltoai/greater-components/adapters`

... (existing adapters documentation) ...

### LesserGraphQLAdapter

...

**Authentication:**

```typescript
// Verify credentials and get current user
async verifyCredentials(): Promise<Actor>;

// Check auth state
isAuthenticated(): boolean;

// Get current token
getToken(): string | null;

// Refresh token
refreshToken(newToken: string): void;
```

---

## Utils Package

`@equaltoai/greater-components/utils`

... (existing utils documentation) ...

### Preference Store

**Purpose:** Standardized user preference management with persistence.

**API:**

```typescript
function createPreferenceStore<T>(key: string, defaults: T): PreferenceStore<T>;

interface PreferenceStore<T> {
	get(): T;
	set<K extends keyof T>(key: K, value: T[K]): void;
	update(partial: Partial<T>): void;
	reset(): void;
	subscribe(callback: (prefs: T) => void): () => void;
	export(): string;
	import(json: string): boolean;
}
```

### Theme Utilities

**Purpose:** Color manipulation and theme generation.

```typescript
// Generate color harmonies
function generateColorHarmony(seedColor: string): ColorHarmony;

// Convert hex to HSL
function hexToHsl(hex: string): HSL;

// Convert HSL to hex
function hslToHex(hsl: HSL): string;

// Calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number;

// Check WCAG compliance
function meetsWCAG(
	color1: string,
	color2: string,
	level: 'AA' | 'AAA',
	fontSize?: 'small' | 'large'
): boolean;

// Generate full theme tokens
function generateTheme(primaryColor: string): ThemeTokens;
```

---

... (rest of the file) ...
