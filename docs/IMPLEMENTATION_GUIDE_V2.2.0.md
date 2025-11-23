# Greater Components v2.2.0 - Implementation Guide

## For Application Developers

This guide is for teams implementing Greater Components in their applications.

## What's New in v2.2.0

### 1. Profile Timeline Component ⭐
Display user timelines with minimal code:
```svelte
<Profile.Root username="johndoe" {adapter}>
  <Profile.Timeline />
</Profile.Root>
```

### 2. Settings Components ⭐
Build settings panels quickly:
```svelte
<SettingsSection title="Preferences">
  <SettingsToggle label="Dark Mode" bind:value={darkMode} />
</SettingsSection>
```

### 3. Advanced Theme Utilities ⭐
Create custom themes programmatically:
```typescript
const theme = generateTheme('#3b82f6');
const harmony = generateColorHarmony('#3b82f6');
```

## Installation

```bash
pnpm add @equaltoai/greater-components \
         @equaltoai/greater-components-primitives \
         @equaltoai/greater-components-fediverse \
         @equaltoai/greater-components-adapters \
         @equaltoai/greater-components-utils
```

## Quick Start Recipes

### Recipe 1: User Profile Page

```svelte
<script lang="ts">
  import { Profile } from '@equaltoai/greater-components-fediverse';
  import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  
  const adapter = new LesserGraphQLAdapter({
    instanceUrl: import.meta.env.VITE_INSTANCE_URL,
    authToken: $authStore.token
  });
</script>

<Profile.Root username={$page.params.username} {adapter}>
  <Profile.Header />
  <Profile.Stats />
  <Profile.Timeline showReplies={false} showBoosts={true} />
</Profile.Root>
```

### Recipe 2: App Settings Page

```svelte
<script lang="ts">
  import { SettingsSection, SettingsToggle, SettingsSelect } from '@equaltoai/greater-components-primitives';
  import { createPreferenceStore } from '@equaltoai/greater-components-utils';
  
  const prefs = createPreferenceStore('my-app', {
    notifications: true,
    theme: 'system',
    language: 'en'
  });
  
  let settings = $state(prefs.get());
  prefs.subscribe(s => settings = s);
</script>

<SettingsSection title="General">
  <SettingsToggle 
    label="Notifications" 
    bind:value={settings.notifications}
  />
  
  <SettingsSelect
    label="Theme"
    bind:value={settings.theme}
    options={[
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' }
    ]}
  />
</SettingsSection>
```

### Recipe 3: Custom Theme Creator

```svelte
<script lang="ts">
  import { ThemeWorkbench, ThemeProvider } from '@equaltoai/greater-components-primitives';
  import { generateTheme } from '@equaltoai/greater-components-utils';
  
  let currentTheme = $state(generateTheme('#3b82f6'));
  
  function handleSave(theme) {
    currentTheme = theme;
    localStorage.setItem('custom-theme', JSON.stringify(theme));
  }
</script>

<ThemeProvider theme={currentTheme}>
  <ThemeWorkbench initialColor="#3b82f6" onSave={handleSave} />
  <YourApp />
</ThemeProvider>
```

## Authentication Setup

The `LesserGraphQLAdapter` now includes credential verification:

```typescript
const adapter = new LesserGraphQLAdapter({
  instanceUrl: 'https://instance.com',
  authToken: token
});

// Verify authentication
try {
  const user = await adapter.verifyCredentials();
  console.log('Logged in as:', user.username);
} catch (error) {
  console.error('Not authenticated:', error);
  // Redirect to login
}

// Helper methods
if (adapter.isAuthenticated()) {
  const token = adapter.getToken();
}

// Update token
adapter.refreshToken(newToken);
```

## Best Practices

### 1. State Management
Use Svelte 5 runes for reactive state:
```typescript
let settings = $state({ darkMode: false });
let theme = $derived(settings.darkMode ? darkTheme : lightTheme);
```

### 2. Preference Persistence
Always use `createPreferenceStore` for user settings:
```typescript
const prefs = createPreferenceStore('app-prefs', defaults);
```

### 3. Theme Customization
Generate themes from brand colors:
```typescript
const brandColor = '#3b82f6';
const theme = generateTheme(brandColor);
const harmony = generateColorHarmony(brandColor);
```

### 4. Bundle Optimization
Use tree-shakeable imports:
```typescript
// ✅ Good
import { SettingsToggle } from '@equaltoai/greater-components-primitives';

// ❌ Bad
import * as Components from '@equaltoai/greater-components-primitives';
```

## TypeScript Support

All components are fully typed:
```typescript
import type { ProfileTimelineProps } from '@equaltoai/greater-components-fediverse';
import type { PreferenceStore } from '@equaltoai/greater-components-utils';
import type { ThemeTokens } from '@equaltoai/greater-components-utils';
```

## Testing Your Implementation

### Unit Tests
```typescript
import { render } from '@testing-library/svelte';
import { Profile } from '@equaltoai/greater-components-fediverse';

test('renders profile timeline', () => {
  const { getByText } = render(Profile.Timeline, {
    props: { username: 'test', adapter: mockAdapter }
  });
  expect(getByText('Posts')).toBeInTheDocument();
});
```

### Integration Tests
Use provided test fixtures:
```typescript
import { createMockAdapter } from '@equaltoai/greater-components-testing';

const adapter = createMockAdapter({
  authToken: 'test-token'
});
```

## Troubleshooting

See [Troubleshooting Guide](./troubleshooting-v2.2.0.md) for common issues.

## Migration from v2.1.x

See [Migration Guide](./migration/v2.2.0.md) for detailed upgrade instructions.

## API Reference

See [API Reference](./api-reference.md) for complete component documentation.

## Support

- GitHub Issues: Report bugs and request features
- Documentation: Comprehensive guides and examples
- Playground: Live examples and experimentation

