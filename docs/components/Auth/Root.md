# Auth.Root

**Component**: Context Provider  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅

---

## 📋 Overview

`Auth.Root` is the foundational component for all authentication flows. It creates and provides authentication context to all child components, managing shared state and event handlers.

### **Key Features**:

- ✅ Centralized authentication state management
- ✅ Shared event handlers for auth operations
- ✅ Type-safe context API
- ✅ Flexible composition
- ✅ Error handling
- ✅ Loading states

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

	const handlers = {
		onLogin: async ({ email, password }) => {
			// Handle login
		},
		onRegister: async (data) => {
			// Handle registration
		},
	};
</script>

<Auth.Root {handlers}>
	<Auth.LoginForm />
	<Auth.RegisterForm />
</Auth.Root>
```

---

## 🎛️ Props

| Prop           | Type                 | Default | Required | Description                        |
| -------------- | -------------------- | ------- | -------- | ---------------------------------- |
| `initialState` | `Partial<AuthState>` | `{}`    | No       | Initial authentication state       |
| `handlers`     | `AuthHandlers`       | `{}`    | No       | Event handlers for auth operations |
| `children`     | `Snippet`            | -       | No       | Child components                   |
| `class`        | `string`             | `''`    | No       | Custom CSS class                   |

### **AuthState Interface**:

```typescript
interface AuthState {
	/** Currently authenticated user */
	user: AuthUser | null;

	/** Authentication token */
	token: string | null;

	/** Loading state */
	loading: boolean;

	/** Error message */
	error: string | null;

	/** Authentication method used */
	method: 'password' | 'webauthn' | 'oauth' | 'wallet' | null;
}
```

### **AuthHandlers Interface**:

```typescript
interface AuthHandlers {
	/** Handle login with credentials */
	onLogin?: (credentials: LoginCredentials) => Promise<void>;

	/** Handle user registration */
	onRegister?: (data: RegisterData) => Promise<void>;

	/** Handle logout */
	onLogout?: () => Promise<void>;

	/** Handle password reset request */
	onPasswordResetRequest?: (email: string) => Promise<void>;

	/** Handle password reset confirmation */
	onPasswordResetConfirm?: (data: PasswordResetData) => Promise<void>;

	/** Handle WebAuthn setup */
	onWebAuthnSetup?: (data: WebAuthnCredential) => Promise<void>;

	/** Handle WebAuthn authentication */
	onWebAuthnAuth?: (data: WebAuthnCredential) => Promise<void>;

	/** Handle OAuth consent */
	onOAuthConsent?: (data: OAuthData) => Promise<void>;

	/** Handle 2FA setup */
	on2FASetup?: () => Promise<TwoFactorData>;

	/** Handle 2FA verification */
	on2FAVerify?: (code: string) => Promise<void>;

	/** Handle wallet connection */
	onWalletConnect?: (data: WalletConnectionData) => Promise<void>;

	/** Handle wallet disconnection */
	onWalletDisconnect?: () => Promise<void>;

	/** Regenerate backup codes */
	onRegenerateBackupCodes?: () => Promise<string[]>;
}
```

---

## 💡 Examples

### **Example 1: Basic Login**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let authenticated = $state(false);

	async function handleLogin({ email, password }) {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (response.ok) {
			const { token, user } = await response.json();
			authenticated = true;
			// Store token
			localStorage.setItem('auth_token', token);
		}
	}
</script>

{#if !authenticated}
	<Auth.Root handlers={{ onLogin: handleLogin }}>
		<Auth.LoginForm />
	</Auth.Root>
{:else}
	<p>Welcome, {user.name}!</p>
{/if}
```

### **Example 2: Multi-Step Authentication**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let step = $state<'login' | 'webauthn' | '2fa'>('login');
	let userId = $state<string | null>(null);

	const handlers = {
		async onLogin({ email, password }) {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (data.requiresWebAuthn) {
				userId = data.userId;
				step = 'webauthn';
			} else if (data.requires2FA) {
				userId = data.userId;
				step = '2fa';
			} else {
				// Authenticated successfully
			}
		},

		async onWebAuthnAuth({ credential }) {
			const response = await fetch('/api/auth/webauthn/authenticate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, credential }),
			});

			if (response.ok) {
				const { token } = await response.json();
				// Store token and proceed
			}
		},

		async on2FAVerify(code) {
			const response = await fetch('/api/auth/2fa/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, code }),
			});

			if (response.ok) {
				const { token } = await response.json();
				// Store token and proceed
			}
		},
	};
</script>

<Auth.Root {handlers}>
	{#if step === 'login'}
		<Auth.LoginForm />
	{:else if step === 'webauthn'}
		<Auth.WebAuthnSetup />
	{:else if step === '2fa'}
		<Auth.TwoFactorVerify />
	{/if}
</Auth.Root>
```

### **Example 3: With Initial State**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	const initialState = {
		user: {
			id: '123',
			email: 'user@example.com',
			name: 'John Doe',
		},
		token: localStorage.getItem('auth_token'),
		loading: false,
		error: null,
	};

	const handlers = {
		async onLogout() {
			await fetch('/api/auth/logout', { method: 'POST' });
			localStorage.removeItem('auth_token');
			window.location.href = '/login';
		},
	};
</script>

<Auth.Root {initialState} {handlers}>
	<div class="user-menu">
		<p>Welcome back!</p>
		<button onclick={() => handlers.onLogout()}>Logout</button>
	</div>
</Auth.Root>
```

### **Example 4: Complete Authentication Flow**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let authFlow = $state<'login' | 'register' | 'reset'>('login');

	const handlers = {
		async onLogin({ email, password }) {
			try {
				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password }),
				});

				if (!response.ok) {
					throw new Error('Invalid credentials');
				}

				const { token } = await response.json();
				localStorage.setItem('auth_token', token);
				window.location.href = '/dashboard';
			} catch (error) {
				console.error('Login failed:', error);
			}
		},

		async onRegister(data) {
			try {
				const response = await fetch('/api/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error('Registration failed');
				}

				// Automatically log in after registration
				await handlers.onLogin({
					email: data.email,
					password: data.password,
				});
			} catch (error) {
				console.error('Registration failed:', error);
			}
		},

		async onPasswordResetRequest(email) {
			try {
				await fetch('/api/auth/password-reset/request', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email }),
				});

				alert('Password reset email sent!');
				authFlow = 'login';
			} catch (error) {
				console.error('Password reset failed:', error);
			}
		},
	};
</script>

<div class="auth-container">
	<Auth.Root {handlers}>
		{#if authFlow === 'login'}
			<Auth.LoginForm />
			<div class="auth-links">
				<button onclick={() => (authFlow = 'register')}>Create account</button>
				<button onclick={() => (authFlow = 'reset')}>Forgot password?</button>
			</div>
		{:else if authFlow === 'register'}
			<Auth.RegisterForm />
			<button onclick={() => (authFlow = 'login')}>Back to login</button>
		{:else if authFlow === 'reset'}
			<Auth.PasswordReset />
			<button onclick={() => (authFlow = 'login')}>Back to login</button>
		{/if}
	</Auth.Root>
</div>

<style>
	.auth-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		background: var(--color-surface);
		border-radius: var(--radius-lg);
	}

	.auth-links {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
	}

	button {
		color: var(--color-primary);
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: underline;
	}
</style>
```

---

## 🎨 Styling

The Root component has minimal styling by default:

```css
.auth-root {
	width: 100%;
	max-width: 100%;
}
```

You can customize it with the `class` prop:

```svelte
<Auth.Root class="custom-auth-container">
	<!-- ... -->
</Auth.Root>
```

```css
.custom-auth-container {
	max-width: 500px;
	margin: 0 auto;
	padding: 2rem;
	background: var(--color-surface);
	border-radius: var(--radius-lg);
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## ♿ Accessibility

The Root component itself doesn't introduce accessibility concerns, but ensures child components have proper context for:

- Announcing loading states
- Managing error messages
- Coordinating focus management
- Providing screen reader context

---

## 🧪 Testing

Test the Root component by verifying context is provided:

```typescript
import { render } from '@testing-library/svelte';
import { Auth } from '@equaltoai/greater-components-fediverse';

describe('Auth.Root', () => {
	it('provides context to children', () => {
		const handlers = {
			onLogin: vi.fn(),
		};

		const { getByRole } = render(Auth.Root, {
			props: {
				handlers,
				children: () => '<Auth.LoginForm />',
			},
		});

		// Verify child component rendered
		expect(getByRole('form')).toBeInTheDocument();
	});

	it('manages authentication state', () => {
		const initialState = {
			user: { id: '123', email: 'test@example.com' },
			token: 'abc123',
		};

		const { container } = render(Auth.Root, {
			props: { initialState },
		});

		// Verify state is accessible to children
		expect(container).toBeInTheDocument();
	});
});
```

---

## 🔗 Related Components

- [Auth.LoginForm](./LoginForm.md) - Email/password login
- [Auth.RegisterForm](./RegisterForm.md) - Account registration
- [Auth.WebAuthnSetup](./WebAuthnSetup.md) - Biometric setup
- [Auth.TwoFactorSetup](./TwoFactorSetup.md) - Enable 2FA

---

## 📚 See Also

- [Auth Components Overview](./README.md)
- [Authentication Patterns](../../patterns/AUTHENTICATION.md)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)
