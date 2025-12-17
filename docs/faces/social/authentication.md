# Social Face: Authentication

> Setting up authentication flows for Fediverse applications.

The Social Face integrates with the shared auth module to provide login, signup, OAuth, and session management for Fediverse applications.

## Installation

```bash
# Add auth module via CLI
npx @equaltoai/greater-components-cli add shared/auth
```

## Auth Components

```svelte
<script lang="ts">
	import * as Auth from '$lib/components/shared/auth';
</script>

<!-- Login Form -->
<Auth.LoginForm
	onSubmit={handleLogin}
	onOAuthClick={handleOAuth}
	providers={['mastodon', 'pleroma']}
/>

<!-- Signup Form -->
<Auth.SignupForm onSubmit={handleSignup} instanceUrl="https://your-instance.social" />

<!-- OAuth Callback Handler -->
<Auth.OAuthCallback onSuccess={handleAuthSuccess} onError={handleAuthError} />
```

## OAuth Flow

### Step 1: Instance Selection

```svelte
<script lang="ts">
	import { InstancePicker } from '$lib/components/shared/auth';

	async function handleInstanceSelect(instance: string) {
		const app = await registerOAuthApp(instance);
		window.location.href = app.authUrl;
	}
</script>

<InstancePicker onSelect={handleInstanceSelect} />
```

### Step 2: OAuth Callback

```typescript
// src/routes/oauth/callback/+page.ts
import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const token = await exchangeCode(code, state);

	// Store token and redirect
	return { token };
}
```

### Step 3: Session Management

```typescript
import { createAuthStore } from '@equaltoai/greater-components/shared/auth';

export const auth = createAuthStore({
	storage: 'localStorage',
	tokenKey: 'gr_auth_token',
});

// Check auth status
if (auth.isAuthenticated) {
	const user = await auth.verifyCredentials();
}
```

## Adapter Integration

```typescript
import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';

const adapter = new LesserGraphQLAdapter({
	httpEndpoint: 'https://your-instance.social/graphql',
	token: auth.token,
});

// Verify credentials
const user = await adapter.verifyCredentials();

// Refresh token
await adapter.refreshToken(newToken);
```

## Protected Routes

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	$effect(() => {
		if (!auth.isAuthenticated && requiresAuth) {
			goto('/login');
		}
	});
</script>
```

## Related Documentation

- [Getting Started](./getting-started.md)
- [Timeline Integration](./timeline-integration.md)
- [Core Patterns](../../core-patterns.md)
