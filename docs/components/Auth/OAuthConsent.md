# Auth.OAuthConsent

**Component**: OAuth 2.0 Authorization Consent Screen  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 51 passing tests

---

## 📋 Overview

`Auth.OAuthConsent` displays a complete OAuth 2.0 consent screen for third-party application authorization. It shows the requesting application's information, requested permissions/scopes, and allows users to authorize or deny access to their account.

### **Key Features**:

- ✅ Application information display (name, icon, website, description)
- ✅ Current user context display
- ✅ Detailed permission/scope list with descriptions
- ✅ Security warnings
- ✅ Authorize/Deny actions
- ✅ Loading states
- ✅ Error handling
- ✅ Fully accessible
- ✅ Mobile-responsive design

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	const clientInfo = {
		name: 'Example App',
		website: 'https://example.com',
		description: 'A third-party social media client',
		icon: 'https://example.com/icon.png',
	};

	const scopes = [
		{
			id: 'read',
			name: 'Read access',
			description: 'Read your posts, profile, and timeline',
		},
		{
			id: 'write',
			name: 'Write access',
			description: 'Create, edit, and delete posts on your behalf',
		},
	];

	const user = {
		username: 'johndoe',
		displayName: 'John Doe',
		avatar: 'https://example.com/avatar.jpg',
	};

	async function handleOAuthAuthorize({ clientId, scope, redirectUri, state }) {
		const response = await fetch('/api/oauth/authorize', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				clientId,
				scope: scope.join(' '),
				redirectUri,
				state,
				authorized: true,
			}),
		});

		if (response.ok) {
			const { authorizationCode } = await response.json();
			// Redirect back to app with authorization code
			window.location.href = `${redirectUri}?code=${authorizationCode}&state=${state}`;
		}
	}

	function handleOAuthDeny() {
		// Redirect back with error
		const url = new URL(redirectUri);
		url.searchParams.set('error', 'access_denied');
		url.searchParams.set('state', state);
		window.location.href = url.toString();
	}
</script>

<Auth.Root
	handlers={{
		onOAuthAuthorize: handleOAuthAuthorize,
		onOAuthDeny: handleOAuthDeny,
	}}
>
	<Auth.OAuthConsent
		{clientInfo}
		{scopes}
		{user}
		clientId="app-123"
		redirectUri="https://example.com/callback"
		state="random-state-string"
	/>
</Auth.Root>
```

---

## 🎛️ Props

| Prop          | Type         | Default | Required | Description                               |
| ------------- | ------------ | ------- | -------- | ----------------------------------------- |
| `clientInfo`  | `ClientInfo` | -       | **Yes**  | OAuth application information             |
| `scopes`      | `Scope[]`    | -       | **Yes**  | Requested permissions/scopes              |
| `clientId`    | `string`     | -       | **Yes**  | OAuth client ID                           |
| `redirectUri` | `string`     | -       | **Yes**  | Redirect URI after authorization          |
| `state`       | `string`     | -       | **Yes**  | OAuth state parameter for CSRF protection |
| `user`        | `User`       | -       | No       | Current user information to display       |
| `class`       | `string`     | `''`    | No       | Custom CSS class                          |

### **Type Definitions**:

```typescript
interface ClientInfo {
	name: string; // Application name
	website?: string; // Application website URL
	description?: string; // Application description
	icon?: string; // Application icon URL
}

interface Scope {
	id: string; // Scope identifier (e.g., 'read', 'write')
	name: string; // Human-readable scope name
	description: string; // Detailed scope description
	icon?: string; // Optional scope icon URL
}

interface User {
	username: string; // Username
	displayName?: string; // Display name
	avatar?: string; // Avatar URL
}
```

---

## 📤 Events

The component uses handlers from `Auth.Root` context:

```typescript
interface OAuthData {
	clientId: string;
	redirectUri: string;
	scope: string[];
	state: string;
}

interface AuthHandlers {
	onOAuthAuthorize?: (data: OAuthData) => Promise<void>;
	onOAuthDeny?: () => void;
}
```

---

## 💡 Examples

### **Example 1: Complete OAuth Flow**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let loading = $state(true);
	let oauthRequest = $state(null);
	let currentUser = $state(null);

	// Parse OAuth parameters from URL
	$effect(() => {
		const url = new URL(window.location.href);
		const clientId = url.searchParams.get('client_id');
		const redirectUri = url.searchParams.get('redirect_uri');
		const scope = url.searchParams.get('scope');
		const state = url.searchParams.get('state');

		if (!clientId || !redirectUri || !scope || !state) {
			alert('Invalid OAuth request');
			return;
		}

		// Fetch client information
		Promise.all([
			fetch(`/api/oauth/clients/${clientId}`).then((r) => r.json()),
			fetch('/api/auth/me').then((r) => r.json()),
		]).then(([client, user]) => {
			oauthRequest = {
				clientId,
				clientInfo: {
					name: client.name,
					website: client.website,
					description: client.description,
					icon: client.icon,
				},
				scopes: scope.split(' ').map((s) => ({
					id: s,
					name: getScopeName(s),
					description: getScopeDescription(s),
				})),
				redirectUri,
				state,
			};
			currentUser = user;
			loading = false;
		});
	});

	function getScopeName(scopeId) {
		const names = {
			read: 'Read access',
			write: 'Write access',
			follow: 'Follow/unfollow',
			push: 'Push notifications',
		};
		return names[scopeId] || scopeId;
	}

	function getScopeDescription(scopeId) {
		const descriptions = {
			read: 'View your posts, profile, timeline, and followers',
			write: 'Create, edit, and delete posts on your behalf',
			follow: 'Follow and unfollow accounts for you',
			push: 'Send you push notifications',
		};
		return descriptions[scopeId] || 'Access to your account';
	}

	async function handleOAuthAuthorize(data) {
		try {
			const response = await fetch('/api/oauth/authorize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...data,
					scope: data.scope.join(' '),
					authorized: true,
				}),
			});

			if (!response.ok) {
				throw new Error('Authorization failed');
			}

			const { code } = await response.json();

			// Redirect back with authorization code
			const url = new URL(data.redirectUri);
			url.searchParams.set('code', code);
			url.searchParams.set('state', data.state);
			window.location.href = url.toString();
		} catch (error) {
			console.error('Authorization error:', error);
			throw error;
		}
	}

	function handleOAuthDeny() {
		if (!oauthRequest) return;

		// Redirect back with error
		const url = new URL(oauthRequest.redirectUri);
		url.searchParams.set('error', 'access_denied');
		url.searchParams.set('error_description', 'The user denied the request');
		url.searchParams.set('state', oauthRequest.state);
		window.location.href = url.toString();
	}
</script>

<div class="oauth-page">
	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading authorization request...</p>
		</div>
	{:else if oauthRequest}
		<Auth.Root
			handlers={{
				onOAuthAuthorize: handleOAuthAuthorize,
				onOAuthDeny: handleOAuthDeny,
			}}
		>
			<Auth.OAuthConsent
				clientInfo={oauthRequest.clientInfo}
				scopes={oauthRequest.scopes}
				clientId={oauthRequest.clientId}
				redirectUri={oauthRequest.redirectUri}
				state={oauthRequest.state}
				user={currentUser}
			/>
		</Auth.Root>
	{:else}
		<div class="error">
			<p>Invalid OAuth request</p>
		</div>
	{/if}
</div>

<style>
	.oauth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-background);
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		margin: 0 auto 1rem;
		border: 3px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
```

### **Example 2: With Existing Authorization Check**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let existingAuth = $state(null);
	let showConsent = $state(false);

	$effect(() => {
		// Check if user has already authorized this app
		const clientId = new URL(window.location.href).searchParams.get('client_id');
		const scope = new URL(window.location.href).searchParams.get('scope');

		fetch(`/api/oauth/authorizations?client_id=${clientId}`)
			.then((r) => r.json())
			.then((data) => {
				if (data.authorized) {
					// Check if requested scopes are already granted
					const requestedScopes = scope.split(' ');
					const grantedScopes = data.scope.split(' ');
					const hasAllScopes = requestedScopes.every((s) => grantedScopes.includes(s));

					if (hasAllScopes) {
						// Already authorized with sufficient scopes
						// Generate code immediately without showing consent
						generateAuthorizationCode().then((code) => {
							const redirectUri = new URL(window.location.href).searchParams.get('redirect_uri');
							const state = new URL(window.location.href).searchParams.get('state');
							window.location.href = `${redirectUri}?code=${code}&state=${state}`;
						});
					} else {
						// Need additional scopes - show consent
						existingAuth = data;
						showConsent = true;
					}
				} else {
					showConsent = true;
				}
			});
	});

	async function generateAuthorizationCode() {
		const response = await fetch('/api/oauth/authorize', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				clientId: new URL(window.location.href).searchParams.get('client_id'),
				scope: new URL(window.location.href).searchParams.get('scope'),
				redirectUri: new URL(window.location.href).searchParams.get('redirect_uri'),
				state: new URL(window.location.href).searchParams.get('state'),
				authorized: true,
			}),
		});
		const { code } = await response.json();
		return code;
	}
</script>

{#if showConsent}
	<Auth.Root>
		<Auth.OAuthConsent {...oauthProps} />

		{#if existingAuth}
			<div class="existing-auth-notice">
				<p>You previously authorized this application.</p>
				<p>This request includes additional permissions.</p>
			</div>
		{/if}
	</Auth.Root>
{/if}

<style>
	.existing-auth-notice {
		max-width: 32rem;
		margin: 1rem auto 0;
		padding: 1rem;
		background: var(--color-info-light);
		border-radius: var(--radius-md);
		text-align: center;
		font-size: 0.875rem;
	}

	.existing-auth-notice p {
		margin: 0.25rem 0;
	}
</style>
```

### **Example 3: With Scope Granularity**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let selectedScopes = $state([]);
	let allScopes = [
		{
			id: 'read:accounts',
			name: 'Read account information',
			description: 'View your profile and account details',
			required: true,
		},
		{
			id: 'read:statuses',
			name: 'Read posts',
			description: 'View your posts and timeline',
			required: false,
		},
		{
			id: 'write:statuses',
			name: 'Create posts',
			description: 'Post on your behalf',
			required: false,
		},
		{
			id: 'follow',
			name: 'Follow accounts',
			description: 'Follow and unfollow accounts for you',
			required: false,
		},
	];

	// Initialize with required scopes
	$effect(() => {
		selectedScopes = allScopes.filter((s) => s.required).map((s) => s.id);
	});

	function toggleScope(scopeId) {
		const scope = allScopes.find((s) => s.id === scopeId);
		if (scope.required) return; // Can't deselect required scopes

		if (selectedScopes.includes(scopeId)) {
			selectedScopes = selectedScopes.filter((id) => id !== scopeId);
		} else {
			selectedScopes = [...selectedScopes, scopeId];
		}
	}

	async function handleOAuthAuthorize(data) {
		// Only authorize selected scopes
		const filteredData = {
			...data,
			scope: selectedScopes,
		};

		const response = await fetch('/api/oauth/authorize', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				...filteredData,
				authorized: true,
			}),
		});

		if (response.ok) {
			const { code } = await response.json();
			window.location.href = `${data.redirectUri}?code=${code}&state=${data.state}`;
		}
	}
</script>

<div class="oauth-consent-custom">
	<Auth.Root handlers={{ onOAuthAuthorize: handleOAuthAuthorize }}>
		<div class="consent-header">
			<h2>Authorize Application</h2>
			<p>Choose which permissions to grant:</p>
		</div>

		<div class="scope-list">
			{#each allScopes as scope}
				<label class="scope-item">
					<input
						type="checkbox"
						checked={selectedScopes.includes(scope.id)}
						disabled={scope.required}
						onchange={() => toggleScope(scope.id)}
					/>
					<div class="scope-info">
						<strong>{scope.name}</strong>
						{#if scope.required}
							<span class="required-badge">Required</span>
						{/if}
						<p>{scope.description}</p>
					</div>
				</label>
			{/each}
		</div>

		<Auth.OAuthConsent {...oauthProps} />
	</Auth.Root>
</div>

<style>
	.scope-list {
		max-width: 32rem;
		margin: 0 auto 2rem;
		padding: 1.5rem;
		background: var(--color-surface);
		border-radius: var(--radius-lg);
	}

	.scope-item {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border-radius: var(--radius-md);
		cursor: pointer;
	}

	.scope-item:hover {
		background: var(--color-background);
	}

	.scope-info {
		flex: 1;
	}

	.scope-info strong {
		display: block;
		margin-bottom: 0.25rem;
	}

	.scope-info p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.required-badge {
		display: inline-block;
		margin-left: 0.5rem;
		padding: 0.125rem 0.5rem;
		background: var(--color-primary);
		color: white;
		font-size: 0.75rem;
		border-radius: var(--radius-full);
	}
</style>
```

### **Example 4: With Revocation Warning**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let showRevokeConfirmation = $state(false);
	let existingAuthorizations = $state([]);

	$effect(() => {
		// Load existing authorizations for this app
		const clientId = new URL(window.location.href).searchParams.get('client_id');
		fetch(`/api/oauth/authorizations?client_id=${clientId}`)
			.then((r) => r.json())
			.then((data) => {
				existingAuthorizations = data;
			});
	});

	async function revokeExisting() {
		for (const auth of existingAuthorizations) {
			await fetch(`/api/oauth/authorizations/${auth.id}`, {
				method: 'DELETE',
			});
		}
		existingAuthorizations = [];
		showRevokeConfirmation = false;
	}
</script>

<Auth.Root>
	{#if existingAuthorizations.length > 0}
		<div class="revoke-notice">
			<h3>Existing Authorization</h3>
			<p>
				You have {existingAuthorizations.length} existing authorization{existingAuthorizations.length >
				1
					? 's'
					: ''}
				for this application.
			</p>
			<button onclick={() => (showRevokeConfirmation = true)}>
				Revoke Previous Authorizations
			</button>
		</div>
	{/if}

	<Auth.OAuthConsent {...oauthProps} />

	{#if showRevokeConfirmation}
		<div class="modal">
			<div class="modal-content">
				<h3>Revoke Authorizations?</h3>
				<p>
					This will revoke all existing authorizations for this application. The app will stop
					working until you authorize it again.
				</p>
				<div class="modal-actions">
					<button onclick={revokeExisting} class="btn-danger"> Revoke All </button>
					<button onclick={() => (showRevokeConfirmation = false)}> Cancel </button>
				</div>
			</div>
		</div>
	{/if}
</Auth.Root>

<style>
	.revoke-notice {
		max-width: 32rem;
		margin: 0 auto 2rem;
		padding: 1.5rem;
		background: var(--color-warning-light);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius-lg);
		text-align: center;
	}

	.revoke-notice h3 {
		margin: 0 0 0.5rem 0;
	}

	.revoke-notice p {
		margin: 0 0 1rem 0;
	}

	.revoke-notice button {
		padding: 0.5rem 1rem;
		background: var(--color-danger);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
	}

	.modal {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		max-width: 400px;
		padding: 2rem;
		background: white;
		border-radius: var(--radius-lg);
	}

	.modal-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.btn-danger {
		flex: 1;
		padding: 0.75rem;
		background: var(--color-danger);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
	}
</style>
```

### **Example 5: With Analytics & Logging**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	async function handleOAuthAuthorize(data) {
		const startTime = Date.now();

		try {
			// Log authorization attempt
			await fetch('/api/analytics/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					event: 'oauth_authorize_attempt',
					clientId: data.clientId,
					scopes: data.scope,
					timestamp: new Date().toISOString(),
				}),
			});

			const response = await fetch('/api/oauth/authorize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...data,
					scope: data.scope.join(' '),
					authorized: true,
				}),
			});

			if (!response.ok) {
				throw new Error('Authorization failed');
			}

			const { code } = await response.json();

			// Log successful authorization
			await fetch('/api/analytics/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					event: 'oauth_authorize_success',
					clientId: data.clientId,
					scopes: data.scope,
					duration: Date.now() - startTime,
					timestamp: new Date().toISOString(),
				}),
			});

			// Redirect with authorization code
			const url = new URL(data.redirectUri);
			url.searchParams.set('code', code);
			url.searchParams.set('state', data.state);
			window.location.href = url.toString();
		} catch (error) {
			// Log authorization failure
			await fetch('/api/analytics/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					event: 'oauth_authorize_error',
					clientId: data.clientId,
					error: error.message,
					duration: Date.now() - startTime,
					timestamp: new Date().toISOString(),
				}),
			});

			throw error;
		}
	}

	function handleOAuthDeny() {
		// Log denial
		fetch('/api/analytics/events', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				event: 'oauth_authorize_denied',
				clientId: oauthRequest.clientId,
				timestamp: new Date().toISOString(),
			}),
		});

		// Redirect with error
		const url = new URL(oauthRequest.redirectUri);
		url.searchParams.set('error', 'access_denied');
		url.searchParams.set('state', oauthRequest.state);
		window.location.href = url.toString();
	}
</script>

<Auth.Root
	handlers={{
		onOAuthAuthorize: handleOAuthAuthorize,
		onOAuthDeny: handleOAuthDeny,
	}}
>
	<Auth.OAuthConsent {...oauthProps} />
</Auth.Root>
```

---

## 🔒 Security Considerations

### **Server-Side Validation**:

```javascript
// Example server-side authorization endpoint
app.post('/api/oauth/authorize', async (req, res) => {
	const { clientId, redirectUri, scope, state, authorized } = req.body;
	const userId = req.session.userId; // From authenticated session

	// 1. Validate client exists and is active
	const client = await db.oauthClients.findOne({ clientId });
	if (!client || !client.active) {
		return res.status(400).json({ error: 'invalid_client' });
	}

	// 2. Validate redirect URI matches registered URIs
	if (!client.redirectUris.includes(redirectUri)) {
		return res.status(400).json({ error: 'invalid_redirect_uri' });
	}

	// 3. Validate state parameter (CSRF protection)
	if (!state || state.length < 32) {
		return res.status(400).json({ error: 'invalid_state' });
	}

	// 4. Validate requested scopes
	const validScopes = ['read', 'write', 'follow', 'push'];
	const requestedScopes = scope.split(' ');
	if (!requestedScopes.every((s) => validScopes.includes(s))) {
		return res.status(400).json({ error: 'invalid_scope' });
	}

	if (authorized) {
		// Generate authorization code
		const code = crypto.randomBytes(32).toString('hex');

		// Store authorization code with expiration (10 minutes)
		await db.authorizationCodes.create({
			code,
			clientId,
			userId,
			redirectUri,
			scope: requestedScopes,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000),
			used: false,
		});

		res.json({ code });
	} else {
		res.status(403).json({ error: 'access_denied' });
	}
});
```

### **Best Practices**:

1. ✅ **State Parameter**: Always validate state for CSRF protection
2. ✅ **Redirect URI**: Strictly validate against registered URIs
3. ✅ **Scope Validation**: Only allow registered/valid scopes
4. ✅ **Code Expiration**: Authorization codes expire in 10 minutes
5. ✅ **One-Time Use**: Authorization codes can only be used once
6. ✅ **User Context**: Show which account is being authorized
7. ✅ **Revocation**: Allow users to revoke authorizations
8. ✅ **Audit Logging**: Log all authorization attempts

---

## 🎨 Styling

The OAuthConsent component includes comprehensive built-in styling:

```css
:root {
	/* Colors */
	--primary-color: #1d9bf0;
	--primary-color-dark: #1a8cd8;
	--text-primary: #0f1419;
	--text-secondary: #536471;
	--border-color: #e1e8ed;
	--bg-primary: #ffffff;
	--bg-secondary: #f7f9fa;
	--bg-hover: #eff3f4;

	/* Warning */
	--warning-color: #f59e0b;
	--warning-background: rgba(255, 173, 31, 0.1);
	--warning-border: rgba(255, 173, 31, 0.3);

	/* Error */
	--error-color: #f4211e;
	--error-background: rgba(244, 33, 46, 0.1);
	--error-border: rgba(244, 33, 46, 0.3);
}
```

---

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Error messages with `role="alert"`

---

## 🧪 Testing

51 passing tests covering:

- Authorization flow
- Denial flow
- Scope display
- Client information rendering
- User context display
- Error handling
- Loading states

---

## 🔗 Related Components

- [Auth.Root](./Root.md)
- [Auth.LoginForm](./LoginForm.md)
- [Auth.RegisterForm](./RegisterForm.md)

---

## 📚 See Also

- [Auth Overview](./README.md)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)
