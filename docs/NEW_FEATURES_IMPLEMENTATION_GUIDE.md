# Greater Components v2.2.0 - New Features Implementation Guide

**For Application Developers**  
**Version:** 2.2.0  
**Last Updated:** November 23, 2025

---

## 📦 What's New

v2.2.0 adds **5 major feature sets** to make building Fediverse applications faster and more consistent:

1. **Profile Timeline Component** - Display user timelines with one component
2. **Settings Components** - Build settings panels quickly
3. **Theme Customization Tools** - Visual theme builder and utilities
4. **Preference Store** - Persistent user settings
5. **Auth Verification** - Check authentication status easily

---

## 🚀 Quick Start: Add These Features Today

### Feature 1: Profile Timelines (5 minutes)

**Before v2.2.0:**

```svelte
<TimelineVirtualizedReactive
	{adapter}
	view={{ type: 'profile', username: currentUser }}
	showReplies={false}
/>
```

**After v2.2.0:**

```svelte
<script lang="ts">
	import { Profile } from '@equaltoai/greater-components-fediverse';

	export let username: string;
	export let adapter: LesserGraphQLAdapter;
</script>

<Profile.Timeline {username} {adapter} showReplies={false} showBoosts={true} onlyMedia={false} />
```

**Or use within Profile.Root for automatic context:**

```svelte
<Profile.Root {username} {adapter}>
	<Profile.Header />
	<Profile.Stats />
	<Profile.Timeline />
	<!-- Automatically gets username and adapter -->
</Profile.Root>
```

**Available Props:**

- `username` - Profile username (optional if used within Profile.Root)
- `adapter` - LesserGraphQLAdapter instance (optional if used within Profile.Root)
- `showReplies` - Show reply posts (default: true)
- `showBoosts` - Show boosted posts (default: true)
- `onlyMedia` - Only show posts with media (default: false)
- `showPinned` - Show pinned posts at top (default: true)
- `virtualScrolling` - Enable virtual scrolling (default: true)

---

### Feature 2: Settings Panels (10 minutes)

**Create a settings page in your app:**

```svelte
<script lang="ts">
	import {
		SettingsSection,
		SettingsToggle,
		SettingsSelect,
	} from '@equaltoai/greater-components-primitives';
	import { createPreferenceStore } from '@equaltoai/greater-components-utils';

	// Create persistent settings
	const preferences = createPreferenceStore('my-app-settings', {
		notifications: true,
		autoplay: false,
		theme: 'system',
		language: 'en',
		showSensitiveContent: false,
		defaultVisibility: 'public',
	});

	// Reactive state that auto-saves
	let settings = $state(preferences.get());

	// Subscribe to changes
	preferences.subscribe((newSettings) => {
		settings = newSettings;
		console.log('Settings updated:', newSettings);
	});
</script>

<div class="settings-page">
	<h1>Application Settings</h1>

	<!-- General Settings -->
	<SettingsSection title="General" description="Basic application preferences">
		<SettingsToggle
			label="Enable Notifications"
			description="Receive updates and alerts"
			bind:value={settings.notifications}
		/>

		<SettingsToggle
			label="Autoplay Media"
			description="Automatically play videos and GIFs"
			bind:value={settings.autoplay}
		/>

		<SettingsSelect
			label="Theme"
			description="Choose your color scheme"
			bind:value={settings.theme}
			options={[
				{ value: 'light', label: 'Light' },
				{ value: 'dark', label: 'Dark' },
				{ value: 'system', label: 'System' },
			]}
		/>

		<SettingsSelect
			label="Language"
			bind:value={settings.language}
			options={[
				{ value: 'en', label: 'English' },
				{ value: 'es', label: 'Español' },
				{ value: 'fr', label: 'Français' },
				{ value: 'de', label: 'Deutsch' },
			]}
		/>
	</SettingsSection>

	<!-- Privacy Settings -->
	<SettingsSection title="Privacy" description="Control your privacy preferences">
		<SettingsToggle
			label="Show Sensitive Content"
			description="Display posts marked as sensitive"
			bind:value={settings.showSensitiveContent}
		/>

		<SettingsSelect
			label="Default Post Visibility"
			bind:value={settings.defaultVisibility}
			options={[
				{ value: 'public', label: 'Public' },
				{ value: 'unlisted', label: 'Unlisted' },
				{ value: 'followers', label: 'Followers Only' },
				{ value: 'direct', label: 'Direct' },
			]}
		/>
	</SettingsSection>
</div>

<style>
	.settings-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
```

**Your settings are now:**

- ✅ Automatically saved to localStorage
- ✅ Persisted across sessions
- ✅ Type-safe with TypeScript
- ✅ Easy to export/import

**Advanced: Export/Import Settings**

```typescript
// Export settings to JSON
const exportData = preferences.export();
downloadFile(exportData, 'my-settings.json');

// Import settings from JSON
const success = preferences.import(importedData);
if (success) {
	console.log('Settings imported!');
}

// Reset to defaults
preferences.reset();
```

---

### Feature 3: Custom Themes (15 minutes)

**Option A: Generate theme from your brand color**

```svelte
<script lang="ts">
	import { ThemeProvider } from '@equaltoai/greater-components-primitives';
	import { generateTheme } from '@equaltoai/greater-components-utils';

	// Your brand color
	const brandColor = '#3b82f6';

	// Generate entire theme
	const customTheme = generateTheme(brandColor);
</script>

<ThemeProvider theme={customTheme}>
	<YourApp />
</ThemeProvider>
```

**Option B: Let users create custom themes**

```svelte
<script lang="ts">
	import { ThemeWorkbench, ThemeProvider } from '@equaltoai/greater-components-primitives';
	import { generateTheme, type ThemeTokens } from '@equaltoai/greater-components-utils';

	// Load saved theme or use default
	let currentTheme = $state<ThemeTokens>(loadThemeFromStorage() || generateTheme('#3b82f6'));

	function handleThemeSave(theme: ThemeTokens) {
		currentTheme = theme;
		localStorage.setItem('custom-theme', JSON.stringify(theme));
	}

	function loadThemeFromStorage(): ThemeTokens | null {
		const stored = localStorage.getItem('custom-theme');
		return stored ? JSON.parse(stored) : null;
	}
</script>

<ThemeProvider theme={currentTheme}>
	<!-- Theme customization UI (optional, for settings page) -->
	<ThemeWorkbench initialColor={currentTheme.colors.primary[500]} onSave={handleThemeSave} />

	<!-- Your app with custom theme -->
	<YourApp />
</ThemeProvider>
```

**Option C: Advanced - Color Harmony**

```typescript
import {
	generateColorHarmony,
	getContrastRatio,
	meetsWCAG,
} from '@equaltoai/greater-components-utils';

// Generate color schemes
const harmony = generateColorHarmony('#3b82f6');

console.log(harmony);
// {
//   base: '#3b82f6',
//   complementary: ['#f6823b'],
//   analogous: ['#3bf682', '#823bf6'],
//   triadic: ['#82f63b', '#f63b82'],
//   tetradic: ['#3bf682', '#f6823b', '#823bf6'],
//   splitComplementary: ['#f6b33b', '#f6533b'],
//   monochromatic: ['#5b9bf6', '#1b62d6', ...]
// }

// Use for UI elements
const accentColor = harmony.complementary[0];
const secondaryColor = harmony.analogous[0];

// Check accessibility
const contrast = getContrastRatio('#3b82f6', '#ffffff');
const isAccessible = meetsWCAG('#3b82f6', '#ffffff', 'AA', 'small');

console.log(`Contrast: ${contrast.toFixed(2)}:1`);
console.log(`Meets WCAG AA: ${isAccessible}`);
```

---

### Feature 4: Authentication Verification (2 minutes)

**Before v2.2.0:**

```typescript
// Had to manually check if adapter was authenticated
// No built-in verification method
```

**After v2.2.0:**

```typescript
import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

const adapter = new LesserGraphQLAdapter({
	instanceUrl: 'https://your-instance.com',
	authToken: getAuthToken(),
});

// Verify credentials and get current user
try {
	const currentUser = await adapter.verifyCredentials();
	console.log('Logged in as:', currentUser.username);
	console.log('User ID:', currentUser.id);

	// Now safe to make authenticated requests
	const timeline = await adapter.getTimeline({ limit: 20 });
} catch (error) {
	// Not authenticated or invalid token
	console.error('Authentication failed:', error);
	redirectToLogin();
}

// Quick check without API call
if (adapter.isAuthenticated()) {
	const token = adapter.getToken();
	console.log('Has token:', !!token);
}

// Update token (e.g., after refresh)
adapter.refreshToken(newToken);
```

**Use in your app's auth guard:**

```typescript
// src/lib/auth.ts
export async function requireAuth(adapter: LesserGraphQLAdapter) {
	if (!adapter.isAuthenticated()) {
		throw redirect(302, '/login');
	}

	try {
		const user = await adapter.verifyCredentials();
		return user;
	} catch (error) {
		// Token is invalid
		throw redirect(302, '/login');
	}
}

// In your +page.server.ts or load function
export async function load({ locals }) {
	const user = await requireAuth(locals.adapter);
	return { user };
}
```

---

## 📚 Complete Examples

### Example 1: User Profile Page

```svelte
<!-- routes/users/[username]/+page.svelte -->
<script lang="ts">
	import { Profile } from '@equaltoai/greater-components-fediverse';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="profile-page">
	<Profile.Root username={data.username} adapter={data.adapter}>
		<Profile.Header />
		<Profile.Stats />

		<!-- New in v2.2.0 - dedicated timeline component -->
		<Profile.Timeline showReplies={false} showBoosts={true} />
	</Profile.Root>
</div>

<style>
	.profile-page {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
```

### Example 2: Settings Page with Persistence

```svelte
<!-- routes/settings/+page.svelte -->
<script lang="ts">
	import {
		SettingsSection,
		SettingsToggle,
		SettingsSelect,
		Button,
	} from '@equaltoai/greater-components-primitives';
	import { createPreferenceStore } from '@equaltoai/greater-components-utils';

	interface AppSettings {
		notifications: boolean;
		autoplay: boolean;
		theme: 'light' | 'dark' | 'system';
		language: string;
		showSensitiveContent: boolean;
		reduceMotion: boolean;
	}

	const preferences = createPreferenceStore<AppSettings>('app-settings', {
		notifications: true,
		autoplay: false,
		theme: 'system',
		language: 'en',
		showSensitiveContent: false,
		reduceMotion: false,
	});

	let settings = $state(preferences.get());
	preferences.subscribe((s) => (settings = s));

	function handleExport() {
		const data = preferences.export();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'settings.json';
		a.click();
	}

	function handleReset() {
		if (confirm('Reset all settings to defaults?')) {
			preferences.reset();
		}
	}
</script>

<div class="settings-page">
	<h1>Settings</h1>

	<SettingsSection title="Appearance">
		<SettingsSelect
			label="Theme"
			bind:value={settings.theme}
			options={[
				{ value: 'light', label: 'Light' },
				{ value: 'dark', label: 'Dark' },
				{ value: 'system', label: 'System' },
			]}
		/>

		<SettingsToggle
			label="Reduce Motion"
			description="Minimize animations and transitions"
			bind:value={settings.reduceMotion}
		/>
	</SettingsSection>

	<SettingsSection title="Content">
		<SettingsToggle label="Autoplay Media" bind:value={settings.autoplay} />

		<SettingsToggle label="Show Sensitive Content" bind:value={settings.showSensitiveContent} />
	</SettingsSection>

	<SettingsSection title="Notifications">
		<SettingsToggle label="Enable Notifications" bind:value={settings.notifications} />
	</SettingsSection>

	<div class="actions">
		<Button onclick={handleExport}>Export Settings</Button>
		<Button variant="outline" onclick={handleReset}>Reset to Defaults</Button>
	</div>
</div>

<style>
	.settings-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}
</style>
```

### Example 3: Themed Application

```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import { ThemeProvider } from '@equaltoai/greater-components-primitives';
	import { generateTheme } from '@equaltoai/greater-components-utils';
	import { createPreferenceStore } from '@equaltoai/greater-components-utils';

	// Load theme preference
	const themePrefs = createPreferenceStore('theme-settings', {
		mode: 'system' as 'light' | 'dark' | 'system',
		primaryColor: '#3b82f6',
		customTheme: null as any,
	});

	let settings = $state(themePrefs.get());
	themePrefs.subscribe((s) => (settings = s));

	// Generate theme from brand color
	let theme = $derived(settings.customTheme || generateTheme(settings.primaryColor));

	// Apply theme mode
	$effect(() => {
		const root = document.documentElement;
		if (settings.mode === 'system') {
			const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			root.classList.toggle('dark', isDark);
		} else {
			root.classList.toggle('dark', settings.mode === 'dark');
		}
	});
</script>

<ThemeProvider {theme}>
	<slot />
</ThemeProvider>
```

---

## 🎯 Migration Patterns

### Pattern 1: Replace Custom Timeline Logic

**Before:**

```svelte
<script>
	let timelineView = $state({
		type: 'profile',
		username: currentUser,
		showReplies: false,
	});
</script>

<TimelineVirtualizedReactive {adapter} view={timelineView} />
```

**After:**

```svelte
<Profile.Timeline username={currentUser} {adapter} showReplies={false} />
```

### Pattern 2: Replace Custom Settings Forms

**Before:**

```svelte
<script>
	let darkMode = $state(localStorage.getItem('darkMode') === 'true');

	$effect(() => {
		localStorage.setItem('darkMode', String(darkMode));
	});
</script>

<label>
	<input type="checkbox" bind:checked={darkMode} />
	Dark Mode
</label>
```

**After:**

```svelte
<script>
	import { SettingsToggle } from '@equaltoai/greater-components-primitives';
	import { createPreferenceStore } from '@equaltoai/greater-components-utils';

	const prefs = createPreferenceStore('settings', { darkMode: false });
	let settings = $state(prefs.get());
	prefs.subscribe((s) => (settings = s));
</script>

<SettingsToggle label="Dark Mode" bind:value={settings.darkMode} />
```

### Pattern 3: Add Auth Verification to Routes

**Before:**

```typescript
// +page.server.ts
export async function load({ locals }) {
	const adapter = locals.adapter;
	// No way to verify if token is valid
	return { adapter };
}
```

**After:**

```typescript
// +page.server.ts
export async function load({ locals }) {
	const adapter = locals.adapter;

	try {
		const user = await adapter.verifyCredentials();
		return { adapter, user };
	} catch (error) {
		throw redirect(302, '/login');
	}
}
```

---

## 🔧 Troubleshooting

### Issue: Settings not persisting

**Problem:** Settings reset on page reload

**Solution:** Make sure you're using `createPreferenceStore`, not just `$state`:

```typescript
// ❌ Wrong - not persistent
let settings = $state({ darkMode: false });

// ✅ Correct - persists to localStorage
const prefs = createPreferenceStore('settings', { darkMode: false });
let settings = $state(prefs.get());
prefs.subscribe((s) => (settings = s));
```

### Issue: Profile.Timeline not showing posts

**Problem:** Timeline appears empty

**Solutions:**

1. Verify authentication:

```typescript
const user = await adapter.verifyCredentials();
console.log('Authenticated as:', user.username);
```

2. Check username format:

```svelte
<!-- ✅ Correct -->
<Profile.Timeline username="johndoe" />

<!-- ❌ Wrong -->
<Profile.Timeline username="@johndoe" />
```

3. Ensure adapter is passed:

```svelte
<Profile.Root {adapter} username="johndoe">
	<Profile.Timeline />
	<!-- Gets adapter from context -->
</Profile.Root>
```

### Issue: Theme colors not applying

**Problem:** Custom theme doesn't show

**Solution:** Wrap your app in ThemeProvider:

```svelte
<!-- +layout.svelte -->
<script>
	import { ThemeProvider } from '@equaltoai/greater-components-primitives';
	import { generateTheme } from '@equaltoai/greater-components-utils';

	const theme = generateTheme('#3b82f6');
</script>

<ThemeProvider {theme}>
	<slot />
</ThemeProvider>
```

---

## 📊 Bundle Size Impact

**Total increase:** ~5KB (minified + gzipped)

All new components are **tree-shakeable**, so you only pay for what you use:

- Import only `SettingsToggle`: +0.5KB
- Import only `Profile.Timeline`: +1KB
- Import only theme utilities: +0.8KB
- Import everything: +5KB

---

## 🎓 Best Practices

### 1. Use Preference Store for All User Settings

```typescript
// ✅ Good - centralized, persistent
const preferences = createPreferenceStore('app-prefs', defaults);

// ❌ Bad - scattered, not persistent
let darkMode = $state(false);
let language = $state('en');
```

### 2. Generate Themes from Brand Colors

```typescript
// ✅ Good - consistent, harmonious
const theme = generateTheme(brandColor);

// ❌ Bad - manual, inconsistent
const theme = { colors: { primary: { 500: brandColor } } };
```

### 3. Verify Auth at Route Level

```typescript
// ✅ Good - fails early, secure
export async function load({ locals }) {
	const user = await locals.adapter.verifyCredentials();
	return { user };
}

// ❌ Bad - fails late, poor UX
export async function load({ locals }) {
	return { adapter: locals.adapter };
}
```

### 4. Use Profile.Timeline with Profile.Root

```svelte
<!-- ✅ Good - DRY, automatic context -->
<Profile.Root {username} {adapter}>
	<Profile.Header />
	<Profile.Timeline />
</Profile.Root>

<!-- ❌ OK but verbose -->
<Profile.Header {username} {adapter} />
<Profile.Timeline {username} {adapter} />
```

---

## 🚀 Quick Wins

### Win 1: Add Profile Pages (5 min)

Replace your custom timeline code with `<Profile.Timeline>`. See Example 1.

### Win 2: Add Settings Page (10 min)

Use `SettingsSection` + `SettingsToggle/Select` + `createPreferenceStore`. See Example 2.

### Win 3: Add Custom Themes (5 min)

Generate theme from your brand color with `generateTheme()`. See Feature 3, Option A.

### Win 4: Verify Auth (2 min)

Add `adapter.verifyCredentials()` to your route guards. See Feature 4.

---

## 📞 Support

- **Documentation:** [docs/](../docs/)
- **Migration Guide:** [docs/migration/v2.2.0.md](./migration/v2.2.0.md)
- **Troubleshooting:** [docs/troubleshooting-v2.2.0.md](./troubleshooting-v2.2.0.md)
- **API Reference:** [docs/api-reference.md](./api-reference.md)
- **Examples:** [apps/playground/src/routes/examples/](../../apps/playground/src/routes/examples/)

---

## ✅ Next Steps

1. **Try Profile.Timeline** - Replace your custom timeline code (5 min)
2. **Build Settings Page** - Use the Settings components (10 min)
3. **Add Theme Generation** - Use your brand color (5 min)
4. **Add Auth Verification** - Secure your routes (2 min)

**Total time investment:** ~30 minutes  
**Long-term savings:** Hours of development time

Happy coding! 🎉
