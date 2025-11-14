# Profile Preferences & Privacy GraphQL Integration

This guide covers the GraphQL integration for user preferences, privacy settings, and push notifications in Profile components.

## Overview

Greater Components Profile package now includes three specialized controllers for managing user preferences through GraphQL:

1. **PreferencesGraphQLController** - Manages user preferences (reading, posting, discovery, streaming, etc.)
2. **PushNotificationsController** - Handles push notification subscriptions and browser integration
3. **ProfileGraphQLController** - Main profile controller with optional preferences integration

## PreferencesGraphQLController

The `PreferencesGraphQLController` manages user preferences and privacy settings via GraphQL, providing a reactive state interface and automatic synchronization.

### Features

- Load and update user preferences
- Map between UI privacy settings and GraphQL preferences
- Reactive state subscriptions
- Automatic error handling
- Streaming preferences support

### Basic Usage

```typescript
import { createLesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import { PreferencesGraphQLController } from '@equaltoai/greater-components-fediverse/Profile';

// Create adapter
const adapter = createLesserGraphQLAdapter({
	httpEndpoint: 'https://api.lesser.social/graphql',
	wsEndpoint: 'wss://api.lesser.social/graphql',
	token: 'your-auth-token',
});

// Create controller
const prefsController = new PreferencesGraphQLController(adapter);

// Subscribe to state changes
const unsubscribe = prefsController.subscribe((state) => {
	console.log('Preferences state:', state);
	console.log('Loading:', state.loading);
	console.log('Preferences:', state.preferences);
	console.log('Error:', state.error);
});

// Load preferences
await prefsController.loadPreferences();

// Update preferences
await prefsController.updatePreferences({
	reading: {
		expandSpoilers: true,
		expandMedia: 'SHOW_ALL',
		autoplayGifs: false,
		timelineOrder: 'OLDEST',
	},
});

// Clean up
unsubscribe();
prefsController.destroy();
```

### UserPreferences Structure

```typescript
interface UserPreferences {
	actorId: string;
	posting: {
		defaultVisibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'DIRECT';
		defaultSensitive: boolean;
		defaultLanguage: string;
	};
	reading: {
		expandSpoilers: boolean;
		expandMedia: 'DEFAULT' | 'SHOW_ALL' | 'HIDE_ALL';
		autoplayGifs: boolean;
		timelineOrder: 'NEWEST' | 'OLDEST';
	};
	discovery: {
		showFollowCounts: boolean;
		searchSuggestionsEnabled: boolean;
		personalizedSearchEnabled: boolean;
	};
	streaming: {
		defaultQuality: 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
		autoQuality: boolean;
		preloadNext: boolean;
		dataSaver: boolean;
	};
	notifications: {
		email: boolean;
		push: boolean;
		inApp: boolean;
		digest: 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
	};
	privacy: {
		defaultVisibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'DIRECT';
		indexable: boolean;
		showOnlineStatus: boolean;
	};
	reblogFilters: Array<{ key: string; enabled: boolean }>;
}
```

### Privacy Settings Integration

The controller can map between UI-friendly `PrivacySettings` and the GraphQL `UserPreferences`:

```typescript
// Update privacy settings (automatically maps to GraphQL preferences)
await prefsController.updatePrivacySettings({
	searchableBySearchEngines: false,
	autoplayGifs: false,
	discoverable: true,
});

// Get current privacy settings
const privacySettings = prefsController.getPrivacySettings();
// Returns:
// {
//   isPrivate: boolean;
//   requireFollowApproval: boolean;
//   hideFollowers: boolean;
//   hideFollowing: boolean;
//   searchableBySearchEngines: boolean;
//   discoverable: boolean;
//   autoplayGifs: boolean;
//   ...
// }
```

### Streaming Preferences

Update streaming-specific preferences separately:

```typescript
await prefsController.updateStreamingPreferences({
	defaultQuality: 'HIGH',
	dataSaver: true,
	preloadNext: false,
});
```

## PushNotificationsController

Manages push notification subscriptions with integrated browser Push API support.

### Features

- Browser Push API integration
- Service worker registration
- Push subscription management
- Alert preferences management
- VAPID key handling

### Basic Usage

```typescript
import { createLesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import { PushNotificationsController } from '@equaltoai/greater-components-fediverse/Profile';

// Create adapter
const adapter = createLesserGraphQLAdapter({
	httpEndpoint: 'https://api.lesser.social/graphql',
	wsEndpoint: 'wss://api.lesser.social/graphql',
	token: 'your-auth-token',
});

// Create controller
const pushController = new PushNotificationsController({
	adapter,
	vapidPublicKey: 'YOUR_VAPID_PUBLIC_KEY',
	serviceWorkerPath: '/sw.js', // Optional, defaults to '/sw.js'
});

// Subscribe to state changes
const unsubscribe = pushController.subscribe((state) => {
	console.log('Push state:', state);
	console.log('Supported:', state.supported);
	console.log('Permission:', state.permission);
	console.log('Subscription:', state.subscription);
});

// Initialize (loads existing subscription if any)
await pushController.initialize();

// Register for push notifications
await pushController.register({
	follow: true,
	favourite: true,
	reblog: true,
	mention: true,
	poll: true,
	followRequest: true,
	status: false,
	update: false,
	adminSignUp: false,
	adminReport: false,
});

// Update alert preferences
await pushController.updateAlerts({
	follow: false,
	mention: false,
});

// Unregister push notifications
await pushController.unregister();

// Clean up
unsubscribe();
pushController.destroy();
```

### PushNotificationsState

```typescript
interface PushNotificationsState {
	subscription: PushSubscription | null;
	browserSubscription: globalThis.PushSubscription | null;
	loading: boolean;
	registering: boolean;
	error: string | null;
	supported: boolean;
	permission: NotificationPermission; // 'default' | 'granted' | 'denied'
}
```

### PushSubscription Structure

```typescript
interface PushSubscription {
	id: string;
	endpoint: string;
	keys: {
		auth: string;
		p256dh: string;
	};
	alerts: {
		follow: boolean;
		favourite: boolean;
		reblog: boolean;
		mention: boolean;
		poll: boolean;
		followRequest: boolean;
		status: boolean;
		update: boolean;
		adminSignUp: boolean;
		adminReport: boolean;
	};
	policy: string;
	serverKey?: string;
	createdAt?: string;
	updatedAt?: string;
}
```

## Integrated Profile Usage

The `ProfileGraphQLController` can optionally integrate preferences management:

### Svelte Component Integration

```svelte
<script>
	import { Profile } from '@equaltoai/greater-components-fediverse';
	import { createLesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	const adapter = createLesserGraphQLAdapter({
		httpEndpoint: 'https://api.lesser.social/graphql',
		wsEndpoint: 'wss://api.lesser.social/graphql',
		token: 'your-auth-token',
	});
</script>

<!-- With preferences enabled (default for own profile) -->
<Profile.Root {adapter} username="alice" isOwnProfile={true} enablePreferences={true} pageSize={40}>
	<Profile.Header />
	<Profile.Stats />

	<!-- Privacy settings will automatically use preferences controller -->
	<Profile.PrivacySettings />
</Profile.Root>
```

### Privacy Settings Component

The `Profile.PrivacySettings` component automatically integrates with the preferences controller when available:

```svelte
<script>
	import { Profile } from '@equaltoai/greater-components-fediverse';
</script>

<Profile.Root {adapter} username="alice" isOwnProfile={true}>
	<!-- Component automatically loads and saves via GraphQL when controller is available -->
	<Profile.PrivacySettings showDescriptions={true} groupByCategory={true} />
</Profile.Root>

<!-- Or use it standalone with manual handlers -->
<Profile.Root
	profile={profileData}
	handlers={{
		onUpdatePrivacySettings: async (settings) => {
			// Manual implementation
			await updateSettings(settings);
		},
	}}
>
	<Profile.PrivacySettings settings={privacySettings} />
</Profile.Root>
```

## Context Handlers

When using the GraphQL adapter with preferences enabled, these handlers are automatically wired:

```typescript
interface ProfileHandlers {
	// ... existing handlers ...

	// Preferences handlers (available when enablePreferences=true)
	onUpdatePrivacySettings?: (settings: Partial<PrivacySettings>) => Promise<void>;
	onLoadPreferences?: () => Promise<void>;
	onGetPrivacySettings?: () => PrivacySettings | null;
}
```

## State Management

The profile context automatically tracks preferences state:

```typescript
interface ProfileState {
	// ... existing state ...

	// Preferences state (populated when preferences controller is active)
	privacySettings?: PrivacySettings | null;
	preferencesLoading?: boolean;
}
```

## Error Handling

All controllers include built-in error handling:

```typescript
const controller = new PreferencesGraphQLController(adapter);

controller.subscribe((state) => {
	if (state.error) {
		console.error('Preferences error:', state.error);
		// Display error to user
	}
});

try {
	await controller.loadPreferences();
} catch (error) {
	// Handle error
	console.error('Failed to load preferences:', error);
}
```

## Best Practices

1. **Always destroy controllers** when components unmount:

   ```typescript
   onDestroy(() => {
   	prefsController?.destroy();
   	pushController?.destroy();
   });
   ```

2. **Subscribe to state changes** for reactive UI updates:

   ```typescript
   let uiState = $state(controller.getState());
   const unsubscribe = controller.subscribe((state) => {
   	uiState = state;
   });
   ```

3. **Check support** before using Push Notifications:

   ```typescript
   if (!pushState.supported) {
   	console.warn('Push notifications not supported');
   	return;
   }
   ```

4. **Handle permissions** gracefully:

   ```typescript
   if (pushState.permission === 'denied') {
   	// Show UI guidance for enabling permissions
   }
   ```

5. **Use context handlers** when available for consistency:
   ```typescript
   const context = getProfileContext();
   if (context.handlers.onUpdatePrivacySettings) {
   	await context.handlers.onUpdatePrivacySettings(settings);
   } else {
   	// Fallback to manual handling
   }
   ```

## Examples

See the playground examples for complete implementations:

- `apps/playground/stories/examples/PushNotificationsExample.svelte`
- `apps/playground/stories/examples/ProfilePageExample.svelte`
- `apps/playground/stories/examples/PreferencesExample.svelte`

## API Reference

### PreferencesGraphQLController

- `constructor(adapter: LesserGraphQLAdapter)`
- `getState(): PreferencesState`
- `subscribe(callback: PreferencesChangeCallback): () => void`
- `loadPreferences(): Promise<void>`
- `updatePreferences(updates: Partial<UserPreferences>): Promise<void>`
- `updateStreamingPreferences(streaming: Partial<UserPreferences['streaming']>): Promise<void>`
- `updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<void>`
- `getPrivacySettings(): PrivacySettings | null`
- `destroy(): void`

### PushNotificationsController

- `constructor(options: { adapter, vapidPublicKey, serviceWorkerPath? })`
- `getState(): PushNotificationsState`
- `subscribe(callback: PushStateChangeCallback): () => void`
- `initialize(): Promise<void>`
- `register(alerts: PushSubscription['alerts']): Promise<void>`
- `updateAlerts(alerts: Partial<PushSubscription['alerts']>): Promise<void>`
- `unregister(): Promise<void>`
- `destroy(): void`

## Testing

Controllers include comprehensive unit tests. Run tests with:

```bash
pnpm --filter @equaltoai/greater-components-fediverse test:unit
```

Test files:

- `packages/fediverse/tests/Profile/PreferencesController.test.ts`
- `packages/fediverse/tests/Profile/PushNotificationsController.test.ts`
