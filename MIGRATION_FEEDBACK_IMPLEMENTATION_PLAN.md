# Migration Feedback Implementation Plan

**Date:** November 22, 2025  
**Version:** v2.1.6 → v2.2.0  
**Status:** Planning Phase

---

## Executive Summary

This document outlines a comprehensive plan to address migration feedback from the Greater client application integration with `@equaltoai/greater-components`. The plan addresses four key areas: missing specialized timeline components, type definition gaps, extensible settings architecture, and advanced theming capabilities.

**Impact Assessment:**
- **High Priority:** 2 issues (Profile.Timeline, Lists.Timeline)
- **Medium Priority:** 2 issues (verifyCredentials typing, Settings extensibility)
- **Low Priority:** 1 issue (Advanced theming)

**Timeline:** 2-3 sprints (4-6 weeks)

---

## Issue 1: Missing Profile.Timeline and Lists.Timeline Components

### Current State Analysis

**What exists:**
- ✅ `Lists.Timeline` component exists at `/packages/fediverse/src/components/Lists/Timeline.svelte`
- ✅ `Lists.Timeline` is exported from `Lists` index
- ✅ `Profile` components exist with comprehensive profile management
- ❌ `Profile.Timeline` does NOT exist as a dedicated component
- ⚠️ Users must manually configure `TimelineVirtualizedReactive` with custom view config

**What's missing:**
```svelte
<!-- EXPECTED (not available) -->
<Profile.Timeline username="alice" adapter={adapter} />

<!-- CURRENT WORKAROUND (required) -->
<TimelineVirtualizedReactive
  {adapter}
  view={{ type: 'profile', username: 'alice' }}
/>
```

### Root Cause

The fediverse package exports:
- ✅ `Lists.Timeline` - Dedicated component for list timelines
- ❌ `Profile.Timeline` - Missing dedicated component

This creates an **inconsistent developer experience** where lists have a dedicated timeline but profiles don't.

### Implementation Plan

#### Phase 1.1: Create Profile.Timeline Component (Week 1-2)

**Location:** `/packages/fediverse/src/components/Profile/Timeline.svelte`

**Component Specification:**

```svelte
<!--
  Profile.Timeline - User Profile Timeline Display
  
  Displays posts, replies, and media from a specific user's profile.
  Wraps TimelineVirtualizedReactive with profile-specific configuration.
  
  @component
  @example
  ```svelte
  <script>
    import { Profile } from '@equaltoai/greater-components/fediverse';
    
    const adapter = new LesserGraphQLAdapter({ ... });
  </script>
  
  <Profile.Timeline
    username="alice"
    {adapter}
    showReplies={true}
    showBoosts={true}
  />
  ```
-->

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  import TimelineVirtualizedReactive from '../TimelineVirtualizedReactive.svelte';
  import { getProfileContext } from './context.js';

  interface Props {
    /**
     * Username to display timeline for
     * Required if not within Profile.Root context
     */
    username?: string;
    
    /**
     * GraphQL adapter instance
     * Required if not within Profile.Root context
     */
    adapter?: LesserGraphQLAdapter;
    
    /**
     * Show replies to other users
     * @default false
     */
    showReplies?: boolean;
    
    /**
     * Show boosted posts
     * @default true
     */
    showBoosts?: boolean;
    
    /**
     * Show only media posts
     * @default false
     */
    onlyMedia?: boolean;
    
    /**
     * Show pinned posts at top
     * @default true
     */
    showPinned?: boolean;
    
    /**
     * Virtual scrolling configuration
     */
    virtualScrolling?: boolean;
    
    /**
     * Estimated item height for virtual scrolling
     */
    estimateSize?: number;
    
    /**
     * Custom CSS class
     */
    class?: string;
    
    /**
     * Custom header content
     */
    header?: Snippet;
    
    /**
     * Custom empty state
     */
    emptyState?: Snippet;
  }

  let {
    username: usernameProp,
    adapter: adapterProp,
    showReplies = false,
    showBoosts = true,
    onlyMedia = false,
    showPinned = true,
    virtualScrolling = true,
    estimateSize = 400,
    class: className = '',
    header,
    emptyState,
  }: Props = $props();

  // Try to get from context if not provided
  const profileContext = getProfileContext();
  
  const username = $derived(
    usernameProp ?? 
    profileContext?.account?.username ?? 
    (() => { throw new Error('Profile.Timeline requires username prop or Profile.Root context') })()
  );
  
  const adapter = $derived(
    adapterProp ?? 
    profileContext?.adapter ?? 
    (() => { throw new Error('Profile.Timeline requires adapter prop or Profile.Root context') })()
  );

  // Build timeline view configuration
  const view = $derived({
    type: 'profile' as const,
    username,
    showReplies,
    showBoosts,
    onlyMedia,
    showPinned,
  });
</script>

<div class={`profile-timeline ${className}`}>
  {#if header}
    <div class="profile-timeline__header">
      {@render header()}
    </div>
  {/if}
  
  <TimelineVirtualizedReactive
    {adapter}
    {view}
    {virtualScrolling}
    {estimateSize}
    enableRealtime={true}
  >
    {#snippet empty()}
      {#if emptyState}
        {@render emptyState()}
      {:else}
        <div class="profile-timeline__empty">
          <p>No posts yet</p>
        </div>
      {/if}
    {/snippet}
  </TimelineVirtualizedReactive>
</div>

<style>
  .profile-timeline {
    width: 100%;
  }
  
  .profile-timeline__empty {
    padding: 2rem;
    text-align: center;
    color: var(--gr-color-gray-600);
  }
</style>
```

**Export from Profile index:**

```typescript
// packages/fediverse/src/components/Profile/index.ts
export { default as Timeline } from './Timeline.svelte';

// Add to types
export type {
  ProfileTimelineProps,
  ProfileTimelineView,
} from './Timeline.svelte';
```

#### Phase 1.2: Enhance Lists.Timeline (Week 2)

While `Lists.Timeline` exists, it should be enhanced to match the new Profile.Timeline API:

**Current state:** Basic timeline display with member management
**Enhancement needed:** 
- Accept optional `adapter` prop
- Support context-free usage
- Add virtual scrolling support
- Add custom snippets for flexibility

#### Phase 1.3: Documentation & Examples (Week 2)

**Update files:**
- `docs/api-reference.md` - Add `Profile.Timeline` and enhanced `Lists.Timeline` documentation
- `docs/core-patterns.md` - Add profile timeline patterns
- `apps/playground/src/routes/profile/[username]/+page.svelte` - Demo implementation
- `packages/fediverse/src/components/Profile/README.md` - Component-specific docs

**Example pattern to document:**

```svelte
<script>
  import { Profile } from '@equaltoai/greater-components/fediverse';
  import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';
  
  const adapter = new LesserGraphQLAdapter({ ... });
</script>

<!-- Standalone usage -->
<Profile.Timeline username="alice" {adapter} />

<!-- Within Profile.Root context -->
<Profile.Root {profile} {adapter}>
  <Profile.Header />
  <Profile.Tabs />
  
  <!-- Timeline automatically inherits context -->
  <Profile.Timeline showReplies={true} />
</Profile.Root>
```

#### Testing Requirements

**Unit tests** (`packages/fediverse/tests/components/Profile/Timeline.spec.ts`):
- ✅ Renders with username prop
- ✅ Inherits from Profile.Root context
- ✅ Throws error when no username available
- ✅ Respects showReplies/showBoosts/onlyMedia filters
- ✅ Renders custom header snippet
- ✅ Renders custom empty state snippet

**Integration tests** (`packages/fediverse/tests/integration/profile-timeline.spec.ts`):
- ✅ Fetches profile posts from GraphQL adapter
- ✅ Virtual scrolling works correctly
- ✅ Real-time updates append new posts
- ✅ Filters apply correctly to API requests

**Success Criteria:**
- ✅ `Profile.Timeline` component created and exported
- ✅ Consistent API with `Lists.Timeline`
- ✅ Works standalone or within Profile.Root context
- ✅ 100% test coverage
- ✅ Documented with examples
- ✅ Migration guide for users on workaround pattern

---

## Issue 2: LesserGraphQLAdapter.verifyCredentials Type Definition

### Current State Analysis

**Problem:** The `verifyCredentials` method exists at runtime but is not in TypeScript definitions.

**Evidence from code review:**
```bash
# Search for verifyCredentials in adapters package
$ grep -r "verifyCredentials" packages/adapters/src/
# Result: No matches found
```

This confirms the method is **completely missing**, not just missing from type definitions.

### Root Cause

The `LesserGraphQLAdapter` class was designed to align with the Lesser GraphQL schema, which doesn't have a traditional "verify credentials" REST endpoint. The expected method is likely:

```typescript
// Expected but missing
async verifyCredentials(): Promise<Actor>
```

### Implementation Plan

#### Phase 2.1: Add verifyCredentials Method (Week 3)

**Location:** `/packages/adapters/src/graphql/LesserGraphQLAdapter.ts`

**Implementation:**

```typescript
// Add to LesserGraphQLAdapter class

/**
 * Verify credentials and fetch current authenticated user
 * 
 * @returns The authenticated actor/user account
 * @throws Error if not authenticated or credentials invalid
 * 
 * @example
 * ```typescript
 * const adapter = new LesserGraphQLAdapter({ token, endpoint });
 * const user = await adapter.verifyCredentials();
 * console.log('Logged in as:', user.username);
 * ```
 */
async verifyCredentials(): Promise<Actor> {
  if (!this.authToken) {
    throw new Error('No authentication token provided. Cannot verify credentials.');
  }

  try {
    // Use existing CurrentUserDocument or create ViewerDocument
    const data = await this.query(ViewerDocument);
    
    if (!data.viewer) {
      throw new Error('Invalid authentication token');
    }

    return data.viewer as Actor;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Authentication failed: Invalid or expired token');
      }
      throw new Error(`Failed to verify credentials: ${error.message}`);
    }
    throw error;
  }
}
```

**Add GraphQL Query** (if doesn't exist):

```graphql
# packages/adapters/src/graphql/documents/Viewer.graphql
query Viewer {
  viewer {
    id
    username
    displayName
    avatar
    header
    bio
    url
    followersCount
    followingCount
    statusesCount
    createdAt
    verified
    # Include all Actor fields needed
  }
}
```

#### Phase 2.2: Type Export & Documentation (Week 3)

**Update exports:**

```typescript
// packages/adapters/src/index.ts
export type {
  Actor,
  ViewerQuery,
} from './graphql/generated/types.js';
```

**Add JSDoc examples:**

```typescript
/**
 * Verify Credentials
 * 
 * @example Basic usage
 * ```typescript
 * const adapter = new LesserGraphQLAdapter({
 *   endpoint: 'https://instance.social/graphql',
 *   token: 'user-auth-token'
 * });
 * 
 * try {
 *   const user = await adapter.verifyCredentials();
 *   console.log(`Logged in as @${user.username}`);
 * } catch (error) {
 *   console.error('Authentication failed:', error);
 * }
 * ```
 * 
 * @example In authentication flow
 * ```typescript
 * async function handleLogin(token: string) {
 *   const adapter = new LesserGraphQLAdapter({ endpoint, token });
 *   
 *   // Verify immediately after login
 *   await adapter.verifyCredentials();
 *   
 *   // Store adapter and proceed
 *   authStore.setAdapter(adapter);
 *   goto('/home');
 * }
 * ```
 */
```

#### Phase 2.3: Add Alternative Helper Methods (Week 3)

Consider adding related auth helper methods:

```typescript
/**
 * Check if currently authenticated
 */
isAuthenticated(): boolean {
  return this.authToken !== null;
}

/**
 * Get current auth token
 */
getToken(): string | null {
  return this.authToken;
}

/**
 * Refresh authentication token
 * @param newToken - New token to use
 */
refreshToken(newToken: string): void {
  this.updateToken(newToken);
}
```

#### Testing Requirements

**Unit tests** (`packages/adapters/tests/LesserGraphQLAdapter.spec.ts`):
- ✅ Returns user when authenticated
- ✅ Throws error when no token provided
- ✅ Throws error when token invalid (401/403)
- ✅ Throws error when network fails
- ✅ Returns properly typed Actor object

**Integration tests**:
- ✅ Verifies real credentials against test instance
- ✅ Handles token expiry gracefully
- ✅ Works with token refresh flow

**Success Criteria:**
- ✅ `verifyCredentials()` method implemented
- ✅ Proper TypeScript types exposed
- ✅ Error handling for all failure cases
- ✅ Full test coverage
- ✅ Documented in API reference
- ✅ Example in auth documentation

---

## Issue 3: Extensible Settings Panels

### Current State Analysis

**What exists:**
- ✅ `SettingsPanel.svelte` in fediverse package - Basic navigation shell
- ✅ `ThemeSwitcher.svelte` in primitives - Theme switching with custom colors
- ⚠️ Users need to implement custom `PreferencesSettings` and `NotificationSettings`

**Gaps:**
- No composable settings building blocks
- No clear extension points for custom settings
- No standardized preference storage integration
- No push notification management components

### Architecture Vision

Create a **layered settings architecture**:

```
┌─────────────────────────────────────────┐
│         Application Layer               │  Custom settings panels
│  (PreferencesSettings, NotificationSettings) │
├─────────────────────────────────────────┤
│      Composition Layer (NEW)            │  Settings building blocks
│  (SettingsSection, SettingsGroup, etc.) │
├─────────────────────────────────────────┤
│        Primitives Layer                 │  Basic UI components
│  (Switch, Select, TextField, etc.)      │
└─────────────────────────────────────────┘
```

### Implementation Plan

#### Phase 3.1: Settings Composition Components (Week 4-5)

**New components in `/packages/primitives/src/components/Settings/`:**

**1. SettingsSection.svelte**
```svelte
<!--
  Container for a logical group of settings with header
-->
<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    icon?: Snippet;
    children: Snippet;
    collapsible?: boolean;
  }
</script>
```

**2. SettingsGroup.svelte**
```svelte
<!--
  Group of related settings fields
-->
<script lang="ts">
  interface Props {
    label?: string;
    children: Snippet;
    orientation?: 'vertical' | 'horizontal';
  }
</script>
```

**3. SettingsField.svelte**
```svelte
<!--
  Individual setting field with label, description, and control
-->
<script lang="ts">
  interface Props {
    label: string;
    description?: string;
    children: Snippet; // The control (Switch, Select, etc.)
  }
</script>
```

**4. SettingsToggle.svelte**
```svelte
<!--
  Pre-composed toggle setting (label + Switch)
-->
<script lang="ts">
  interface Props {
    label: string;
    description?: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }
</script>
```

**5. SettingsSelect.svelte**
```svelte
<!--
  Pre-composed select setting (label + Select)
-->
<script lang="ts">
  interface Props<T> {
    label: string;
    description?: string;
    value: T;
    options: Array<{ value: T; label: string }>;
    onChange: (value: T) => void;
  }
</script>
```

**Usage example:**

```svelte
<script>
  import { 
    SettingsSection, 
    SettingsToggle, 
    SettingsSelect 
  } from '@equaltoai/greater-components/primitives';
  
  let autoplay = $state(true);
  let quality = $state('high');
</script>

<SettingsSection title="Media" description="Video and image preferences">
  <SettingsToggle
    label="Autoplay videos"
    description="Automatically play videos in timeline"
    bind:value={autoplay}
  />
  
  <SettingsSelect
    label="Image quality"
    bind:value={quality}
    options={[
      { value: 'low', label: 'Low (faster)' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High (best quality)' },
    ]}
  />
</SettingsSection>
```

#### Phase 3.2: Preference Store Integration (Week 5)

**Create standardized preference store interface:**

```typescript
// packages/utils/src/preferences.ts

export interface PreferenceStore<T extends Record<string, any>> {
  /**
   * Get current preferences
   */
  get(): T;
  
  /**
   * Update single preference
   */
  set<K extends keyof T>(key: K, value: T[K]): void;
  
  /**
   * Update multiple preferences
   */
  update(partial: Partial<T>): void;
  
  /**
   * Reset to defaults
   */
  reset(): void;
  
  /**
   * Subscribe to changes
   */
  subscribe(callback: (prefs: T) => void): () => void;
  
  /**
   * Export preferences as JSON
   */
  export(): string;
  
  /**
   * Import preferences from JSON
   */
  import(json: string): boolean;
}

/**
 * Create a preference store with localStorage persistence
 */
export function createPreferenceStore<T extends Record<string, any>>(
  key: string,
  defaults: T
): PreferenceStore<T> {
  // Implementation with Svelte 5 runes
}
```

**Example usage:**

```typescript
// app/lib/stores/preferences.ts
import { createPreferenceStore } from '@equaltoai/greater-components/utils';

interface AppPreferences {
  theme: 'light' | 'dark' | 'auto';
  density: 'compact' | 'comfortable';
  autoplayVideos: boolean;
  showSensitiveMedia: boolean;
}

export const preferences = createPreferenceStore<AppPreferences>('app_preferences', {
  theme: 'auto',
  density: 'comfortable',
  autoplayVideos: false,
  showSensitiveMedia: false,
});
```

#### Phase 3.3: Notification Settings Components (Week 5-6)

**New components in `/packages/fediverse/src/components/Notifications/`:**

**1. NotificationFilters.svelte**
```svelte
<!--
  Configure which notification types to receive
-->
<script lang="ts">
  import { SettingsSection, SettingsToggle } from '@equaltoai/greater-components/primitives';
  
  interface Props {
    filters: NotificationFilters;
    onChange: (filters: NotificationFilters) => void;
  }
</script>

<SettingsSection title="Notification Types">
  <SettingsToggle
    label="Mentions"
    bind:value={filters.mentions}
  />
  <SettingsToggle
    label="Favorites"
    bind:value={filters.favorites}
  />
  <!-- etc -->
</SettingsSection>
```

**2. PushNotificationSettings.svelte**
```svelte
<!--
  Manage push notification subscription
-->
<script lang="ts">
  import type { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';
  
  interface Props {
    adapter: LesserGraphQLAdapter;
  }
  
  let subscription = $state<PushSubscription | null>(null);
  let isLoading = $state(false);
  
  async function enablePush() {
    // Service worker + push subscription logic
  }
</script>
```

#### Phase 3.4: Reference Implementation (Week 6)

Create **example settings panels** showing best practices:

**Location:** `/apps/playground/src/lib/components/settings/`

- `AppearanceSettings.svelte` - Full theme customization example
- `BehaviorSettings.svelte` - App behavior preferences
- `NotificationPreferences.svelte` - Comprehensive notification management
- `PrivacySettings.svelte` - Privacy and security settings

These serve as **copy-paste templates** for users building custom settings.

#### Testing Requirements

**Unit tests:**
- ✅ Settings components render correctly
- ✅ Preference store persists to localStorage
- ✅ Preference store exports/imports JSON
- ✅ Settings field validation works

**Integration tests:**
- ✅ Preference changes sync with UI
- ✅ Push notification enable/disable flow
- ✅ Settings persist across page reloads

**Success Criteria:**
- ✅ 6+ new settings composition components
- ✅ Standardized preference store pattern
- ✅ Push notification management components
- ✅ Reference implementations in playground
- ✅ Migration guide from custom settings
- ✅ Complete API documentation

---

## Issue 4: Advanced Theme Customization

### Current State Analysis

**What exists:**
- ✅ `ThemeSwitcher` - Mode switching (light/dark/auto) + basic custom colors
- ✅ `ThemeProvider` - Theme token injection
- ✅ Preference store with color customization

**What's missing:**
- Color harmony generation
- Color wheel visualization
- Theme preview
- Advanced color tools (contrast checker, palette generator)

### Implementation Plan

#### Phase 4.1: Theme Utilities Package (Week 7)

**New file:** `/packages/utils/src/theme/`

**1. color-harmony.ts**
```typescript
/**
 * Generate color harmonies from a seed color
 */
export interface ColorHarmony {
  complementary: string[];
  analogous: string[];
  triadic: string[];
  tetradic: string[];
  splitComplementary: string[];
  monochromatic: string[];
}

export function generateColorHarmony(seedColor: string): ColorHarmony;
export function hexToHsl(hex: string): { h: number; s: number; l: number };
export function hslToHex(h: number, s: number, l: number): string;
```

**2. contrast.ts**
```typescript
/**
 * WCAG contrast ratio calculations
 */
export function getContrastRatio(color1: string, color2: string): number;
export function meetsWCAG(color1: string, color2: string, level: 'AA' | 'AAA'): boolean;
export function suggestTextColor(backgroundColor: string): string;
```

**3. theme-generator.ts**
```typescript
/**
 * Generate complete theme tokens from primary color
 */
export interface ThemeTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
  };
}

export function generateTheme(primaryColor: string): ThemeTokens;
```

#### Phase 4.2: Advanced Theme Components (Week 7-8)

**New components in `/packages/primitives/src/components/Theme/`:**

**1. ColorHarmonyPicker.svelte**
```svelte
<!--
  Visual color harmony selector with wheel
-->
<script lang="ts">
  import { generateColorHarmony } from '@equaltoai/greater-components/utils/theme';
  
  interface Props {
    seedColor: string;
    harmonyType: 'complementary' | 'analogous' | 'triadic' | 'tetradic';
    onSelect: (colors: string[]) => void;
  }
</script>
```

**2. ContrastChecker.svelte**
```svelte
<!--
  Live contrast ratio checker with WCAG compliance
-->
<script lang="ts">
  import { getContrastRatio, meetsWCAG } from '@equaltoai/greater-components/utils/theme';
  
  interface Props {
    foreground: string;
    background: string;
  }
</script>

<div class="contrast-checker">
  <div class="preview" style="color: {foreground}; background: {background}">
    Sample Text
  </div>
  <div class="ratio">
    Contrast: {ratio.toFixed(2)}:1
    {#if meetsWCAG(foreground, background, 'AAA')}
      ✓ WCAG AAA
    {:else if meetsWCAG(foreground, background, 'AA')}
      ✓ WCAG AA
    {:else}
      ✗ Fails WCAG
    {/if}
  </div>
</div>
```

**3. ThemeWorkbench.svelte**
```svelte
<!--
  Complete theme creation workbench
  Combines: color picker, harmony selector, contrast checker, preview
-->
<script lang="ts">
  import ColorHarmonyPicker from './ColorHarmonyPicker.svelte';
  import ContrastChecker from './ContrastChecker.svelte';
  import { generateTheme } from '@equaltoai/greater-components/utils/theme';
  
  interface Props {
    onSave: (theme: ThemeTokens) => void;
  }
</script>

<div class="theme-workbench">
  <div class="workbench-controls">
    <ColorHarmonyPicker bind:seedColor />
    <ContrastChecker {foreground} {background} />
  </div>
  
  <div class="workbench-preview">
    <ThemeProvider theme={generatedTheme}>
      <!-- Live preview of components -->
      <Button>Preview Button</Button>
      <Card>Preview Card</Card>
    </ThemeProvider>
  </div>
</div>
```

#### Phase 4.3: Enhance ThemeSwitcher (Week 8)

**Add new prop to existing ThemeSwitcher:**

```typescript
interface ThemeSwitcherProps {
  // ... existing props
  
  /**
   * Show advanced theme customization workbench
   * @default false
   */
  showWorkbench?: boolean;
  
  /**
   * Allow custom theme creation and management
   * @default false
   */
  enableCustomThemes?: boolean;
  
  /**
   * Storage key for custom themes
   */
  customThemesKey?: string;
}
```

**Usage:**

```svelte
<ThemeSwitcher
  variant="full"
  showAdvanced={true}
  showWorkbench={true}
  enableCustomThemes={true}
/>
```

#### Testing Requirements

**Unit tests:**
- ✅ Color harmony generation algorithms
- ✅ Contrast ratio calculations
- ✅ Theme token generation
- ✅ Color space conversions

**Visual tests:**
- ✅ Color wheel renders correctly
- ✅ Harmony colors display properly
- ✅ Theme preview shows actual theme

**Success Criteria:**
- ✅ Color utility functions in utils package
- ✅ 3+ advanced theme components
- ✅ ThemeWorkbench component
- ✅ Enhanced ThemeSwitcher with workbench mode
- ✅ Documentation with examples
- ✅ Playground demo

---

## Documentation Updates

### New Documentation Required

**1. Migration Guide** (`docs/migration/v2.2.0.md`)
```markdown
# Migrating to v2.2.0

## New Features

### Profile.Timeline Component
Before:
<!-- workaround -->

After:
<!-- new component -->

### Settings Composition
Before:
<!-- custom implementation -->

After:
<!-- using new components -->
```

**2. API Reference Updates** (`docs/api-reference.md`)
- Add `Profile.Timeline` section
- Add `verifyCredentials` to LesserGraphQLAdapter
- Add Settings composition components
- Add Theme utilities and components

**3. Pattern Guide** (`docs/patterns/settings-panels.md`)
```markdown
# Building Custom Settings Panels

Learn how to build extensible settings using Greater Components primitives.

## Basic Pattern
## Preference Storage
## Push Notifications
## Complete Example
```

**4. Code Examples** (`apps/playground/src/routes/examples/`)
- `profile-timeline/+page.svelte`
- `custom-settings/+page.svelte`
- `theme-workbench/+page.svelte`

---

## Testing Strategy

### Test Coverage Requirements

- **Unit tests:** ≥90% coverage for all new code
- **Integration tests:** All user flows tested
- **Visual regression:** Storybook snapshots for UI components
- **Accessibility:** axe-core validation for all new components
- **Performance:** Virtual scrolling benchmarks for timeline components

### Test Automation

```bash
# Run all new tests
pnpm test:new-features

# Run specific test suites
pnpm test --filter @equaltoai/greater-components-fediverse -- Profile.Timeline
pnpm test --filter @equaltoai/greater-components-adapters -- verifyCredentials
pnpm test --filter @equaltoai/greater-components-primitives -- Settings
```

---

## Release Plan

### Version 2.2.0 Release

**Pre-release Checklist:**
- [ ] All issues implemented and tested
- [ ] Documentation updated
- [ ] Migration guide written
- [ ] Changelog updated
- [ ] Breaking changes documented (if any)
- [ ] Playground examples added
- [ ] API reference complete

**Release Process:**
1. Create release branch `release/v2.2.0`
2. Run full test suite
3. Generate changeset
4. Merge to main
5. Publish to npm
6. Tag release on GitHub
7. Announce on discussions

**Post-Release:**
- Monitor GitHub issues for regression reports
- Update Greater client application as reference
- Write blog post about new features
- Create video tutorials for complex features

---

## Risk Assessment

### High Risk Areas

**1. Breaking Changes**
- **Risk:** Profile.Timeline might conflict with existing workarounds
- **Mitigation:** Provide migration guide and keep TimelineVirtualizedReactive API stable

**2. Type Changes**
- **Risk:** Adding verifyCredentials could break existing type expectations
- **Mitigation:** Non-breaking addition, fully backward compatible

**3. Performance**
- **Risk:** New components might impact bundle size
- **Mitigation:** Tree-shakeable exports, lazy loading for theme workbench

### Compatibility Matrix

| Feature | Svelte 5 | Svelte 4 | SSR | CSR |
|---------|----------|----------|-----|-----|
| Profile.Timeline | ✅ | ⚠️ | ✅ | ✅ |
| Settings Components | ✅ | ⚠️ | ✅ | ✅ |
| Theme Workbench | ✅ | ⚠️ | ⚠️ | ✅ |
| verifyCredentials | ✅ | ✅ | ✅ | ✅ |

⚠️ = Requires runes compatibility mode or has limitations

---

## Success Metrics

### Quantitative Goals

- **Test Coverage:** ≥90% for all new code
- **Bundle Size Impact:** <10KB gzipped increase
- **Performance:** Timeline renders 1000+ items at 60fps
- **Documentation:** 100% API coverage
- **Migration Success:** ≥80% of workarounds replaceable

### Qualitative Goals

- Improved developer experience for settings panels
- Reduced boilerplate for timeline integration
- Better type safety and IDE autocomplete
- Clearer migration path for custom implementations

---

## Timeline Summary

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1-2 | Phase 1.1-1.3 | Profile.Timeline + Lists.Timeline enhancement |
| 3 | Phase 2.1-2.3 | verifyCredentials implementation |
| 4-5 | Phase 3.1-3.2 | Settings composition components |
| 5-6 | Phase 3.3-3.4 | Notification settings + reference impl |
| 7 | Phase 4.1 | Theme utilities |
| 7-8 | Phase 4.2-4.3 | Advanced theme components |
| 8 | Final | Documentation, testing, release prep |

**Total Duration:** 8 weeks (2 months)

---

## Next Steps

1. **Review this plan** with the team
2. **Prioritize** issues if timeline needs compression
3. **Create GitHub issues** for each phase
4. **Assign ownership** for implementation
5. **Set up project board** for tracking
6. **Begin Phase 1.1** (Profile.Timeline component)

---

**Questions or concerns?** Open a discussion in GitHub Discussions or comment on the tracking issue.

**Track progress:** See [GitHub Project Board](https://github.com/equaltoai/greater-components/projects/migration-feedback)

