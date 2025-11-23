# v2.2.0 Troubleshooting

## Common Issues

### Profile.Timeline Not Showing Posts

**Problem:** Timeline appears empty even though user has posts.

**Solutions:**
1. Verify adapter authentication:
   ```typescript
   const isAuthed = await adapter.verifyCredentials();
   console.log('Authenticated:', isAuthed);
   ```

2. Check username format:
   ```svelte
   <!-- ✅ Correct -->
   <Profile.Timeline username="johndoe" />
   
   <!-- ❌ Wrong -->
   <Profile.Timeline username="@johndoe" />
   <Profile.Timeline username="johndoe@instance.com" />
   ```

3. Verify adapter is passed correctly:
   ```svelte
   <Profile.Root {adapter} username="johndoe">
     <!-- Timeline will inherit adapter from context -->
     <Profile.Timeline />
   </Profile.Root>
   ```

### Settings Not Persisting

**Problem:** Settings reset on page reload.

**Solution:** Ensure you're using `createPreferenceStore`:
```typescript
// ✅ Correct - persists to localStorage
const prefs = createPreferenceStore('my-app-settings', defaults);

// ❌ Wrong - only in-memory
let settings = $state(defaults);
```

### Theme Colors Not Applying

**Problem:** Custom theme colors don't show up.

**Solutions:**
1. Wrap your app in ThemeProvider:
   ```svelte
   <ThemeProvider {theme}>
     <YourApp />
   </ThemeProvider>
   ```

2. Use CSS variables correctly:
   ```css
   /* ✅ Correct */
   color: var(--gr-color-primary-500);
   
   /* ❌ Wrong */
   color: {theme.colors.primary[500]};
   ```

### Bundle Size Issues

**Problem:** Bundle size increased significantly.

**Solutions:**
1. Use tree-shakeable imports:
   ```typescript
   // ✅ Correct - tree-shakeable
   import { SettingsToggle } from '@equaltoai/greater-components-primitives';
   
   // ❌ Wrong - imports everything
   import * as Primitives from '@equaltoai/greater-components-primitives';
   ```

2. Only import what you need:
   ```typescript
   // If you only need color harmony, don't import theme generator
   import { generateColorHarmony } from '@equaltoai/greater-components-utils/theme';
   ```

## Getting Help

- Check the [Migration Guide](./migration/v2.2.0.md)
- Review [API Reference](./api-reference.md)
- See [Playground Examples](../apps/playground/src/routes/examples/)
