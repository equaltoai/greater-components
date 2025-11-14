# Auth.TwoFactorVerify

**Component**: Two-Factor Authentication Verification (Login)  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 51 passing tests

---

## 📋 Overview

`Auth.TwoFactorVerify` provides the verification interface used during login when two-factor authentication is enabled. Users can enter a 6-digit TOTP code from their authenticator app or use a backup recovery code to complete authentication.

### **Key Features**:

- ✅ TOTP code verification (6-digit)
- ✅ Backup code verification
- ✅ Tab switching between methods
- ✅ Real-time input validation
- ✅ Enter key submission
- ✅ Numeric input optimization (mobile)
- ✅ Loading states
- ✅ Error handling
- ✅ Help link for lost access
- ✅ Fully accessible

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

	// After successful username/password login, server returns 2FA required
	let twoFactorSession = $state({
		email: 'user@example.com',
		methods: ['totp', 'backup'], // Available 2FA methods
		sessionToken: 'temp-session-token', // Temporary token for 2FA verification
	});

	async function handleTwoFactorVerify({ code, method }) {
		const response = await fetch('/api/auth/2fa/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sessionToken: twoFactorSession.sessionToken,
				code,
				method,
			}),
		});

		if (!response.ok) {
			throw new Error('Invalid verification code');
		}

		const { accessToken, refreshToken } = await response.json();

		// Store tokens and complete login
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);

		window.location.href = '/home';
	}
</script>

<Auth.Root
	initialState={{ twoFactorSession }}
	handlers={{ onTwoFactorVerify: handleTwoFactorVerify }}
>
	<Auth.TwoFactorVerify />
</Auth.Root>
```

---

## 🎛️ Props

| Prop               | Type      | Default                     | Required | Description                     |
| ------------------ | --------- | --------------------------- | -------- | ------------------------------- |
| `title`            | `string`  | `"Enter Verification Code"` | No       | Custom form title               |
| `showBackupOption` | `boolean` | `true`                      | No       | Show option to use backup codes |
| `class`            | `string`  | `''`                        | No       | Custom CSS class                |

---

## 📤 Events

The component uses handlers from `Auth.Root` context:

```typescript
interface TwoFactorVerification {
	code: string;
	method: 'totp' | 'backup';
}

interface AuthHandlers {
	onTwoFactorVerify?: (data: TwoFactorVerification) => Promise<void>;
}

interface TwoFactorSession {
	email: string;
	methods: ('totp' | 'backup')[];
	sessionToken?: string;
}

interface AuthState {
	twoFactorSession?: TwoFactorSession;
}
```

---

## 💡 Examples

### **Example 1: Complete Login Flow with 2FA**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let step = $state<'login' | '2fa' | 'complete'>('login');
	let twoFactorSession = $state(null);

	async function handleLogin({ email, password }) {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (data.requiresTwoFactor) {
			// 2FA is required - show verification screen
			twoFactorSession = {
				email: data.email,
				methods: data.twoFactorMethods, // ['totp', 'backup']
				sessionToken: data.sessionToken,
			};
			step = '2fa';
		} else {
			// No 2FA - complete login
			localStorage.setItem('accessToken', data.accessToken);
			step = 'complete';
		}
	}

	async function handleTwoFactorVerify({ code, method }) {
		try {
			const response = await fetch('/api/auth/2fa/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionToken: twoFactorSession.sessionToken,
					code,
					method,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Invalid code');
			}

			const { accessToken, refreshToken, user } = await response.json();

			// Store tokens
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('user', JSON.stringify(user));

			step = 'complete';

			// Redirect to home
			setTimeout(() => {
				window.location.href = '/home';
			}, 1000);
		} catch (error) {
			console.error('2FA verification failed:', error);
			throw error;
		}
	}
</script>

<div class="login-page">
	{#if step === 'login'}
		<Auth.Root handlers={{ onLogin: handleLogin }}>
			<Auth.LoginForm />
		</Auth.Root>
	{:else if step === '2fa'}
		<Auth.Root
			initialState={{ twoFactorSession }}
			handlers={{ onTwoFactorVerify: handleTwoFactorVerify }}
		>
			<Auth.TwoFactorVerify />
		</Auth.Root>
	{:else}
		<div class="success-message">
			<h2>✓ Login Successful</h2>
			<p>Redirecting to your home feed...</p>
		</div>
	{/if}
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-background);
	}

	.success-message {
		text-align: center;
		padding: 3rem;
	}

	.success-message h2 {
		margin: 0 0 1rem 0;
		color: var(--color-success);
	}
</style>
```

### **Example 2: With Rate Limiting**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let attemptsRemaining = $state(5);
	let lockoutUntil = $state<Date | null>(null);

	async function handleTwoFactorVerify({ code, method }) {
		// Check if locked out
		if (lockoutUntil && new Date() < lockoutUntil) {
			const minutes = Math.ceil((lockoutUntil.getTime() - Date.now()) / 60000);
			throw new Error(
				`Too many attempts. Try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
			);
		}

		try {
			const response = await fetch('/api/auth/2fa/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionToken: twoFactorSession.sessionToken,
					code,
					method,
				}),
			});

			if (!response.ok) {
				attemptsRemaining--;

				if (attemptsRemaining === 0) {
					// Lock out for 15 minutes
					lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
				}

				throw new Error(`Invalid code. ${attemptsRemaining} attempts remaining.`);
			}

			const { accessToken } = await response.json();
			localStorage.setItem('accessToken', accessToken);
			window.location.href = '/home';
		} catch (error) {
			console.error('Verification error:', error);
			throw error;
		}
	}
</script>

<Auth.Root handlers={{ onTwoFactorVerify: handleTwoFactorVerify }}>
	<Auth.TwoFactorVerify />

	{#if attemptsRemaining < 3}
		<div class="attempts-warning">
			⚠️ Warning: {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
		</div>
	{/if}

	{#if lockoutUntil && new Date() < lockoutUntil}
		<div class="lockout-message">🔒 Too many failed attempts. Please try again later.</div>
	{/if}
</Auth.Root>

<style>
	.attempts-warning {
		max-width: 28rem;
		margin: 1rem auto;
		padding: 1rem;
		background: var(--color-warning-light);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius-md);
		text-align: center;
		font-size: 0.875rem;
	}

	.lockout-message {
		max-width: 28rem;
		margin: 1rem auto;
		padding: 1rem;
		background: var(--color-danger-light);
		border: 1px solid var(--color-danger);
		border-radius: var(--radius-md);
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-danger);
	}
</style>
```

### **Example 3: With Trusted Devices**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let trustDevice = $state(false);

	async function handleTwoFactorVerify({ code, method }) {
		const response = await fetch('/api/auth/2fa/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sessionToken: twoFactorSession.sessionToken,
				code,
				method,
				trustDevice, // Skip 2FA for 30 days on this device
			}),
		});

		if (!response.ok) {
			throw new Error('Invalid code');
		}

		const { accessToken, deviceToken } = await response.json();

		localStorage.setItem('accessToken', accessToken);

		if (trustDevice && deviceToken) {
			// Store device token for future logins
			localStorage.setItem('deviceToken', deviceToken);
		}

		window.location.href = '/home';
	}
</script>

<Auth.Root handlers={{ onTwoFactorVerify: handleTwoFactorVerify }}>
	<Auth.TwoFactorVerify />

	<div class="trust-device">
		<label>
			<input type="checkbox" bind:checked={trustDevice} />
			<span>Trust this device for 30 days</span>
		</label>
		<p class="trust-device-hint">You won't need to enter a code on this device for 30 days.</p>
	</div>
</Auth.Root>

<style>
	.trust-device {
		max-width: 28rem;
		margin: 1rem auto 0;
		padding: 1rem;
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.trust-device label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	.trust-device input[type='checkbox'] {
		width: 20px;
		height: 20px;
	}

	.trust-device-hint {
		margin: 0.5rem 0 0 2rem;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}
</style>
```

### **Example 4: With Session Timeout**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let timeRemaining = $state(300); // 5 minutes in seconds
	let expired = $state(false);

	// Countdown timer
	$effect(() => {
		if (timeRemaining <= 0) {
			expired = true;
			return;
		}

		const timer = setInterval(() => {
			timeRemaining--;
			if (timeRemaining <= 0) {
				expired = true;
				clearInterval(timer);
			}
		}, 1000);

		return () => clearInterval(timer);
	});

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleRestartLogin() {
		window.location.href = '/login';
	}
</script>

{#if !expired}
	<Auth.Root handlers={{ onTwoFactorVerify: handleTwoFactorVerify }}>
		<Auth.TwoFactorVerify />

		<div class="session-timer" class:warning={timeRemaining < 60}>
			⏱️ Session expires in {formatTime(timeRemaining)}
		</div>
	</Auth.Root>
{:else}
	<div class="session-expired">
		<h2>Session Expired</h2>
		<p>Your verification session has timed out for security reasons.</p>
		<button onclick={handleRestartLogin}> Return to Login </button>
	</div>
{/if}

<style>
	.session-timer {
		max-width: 28rem;
		margin: 1rem auto 0;
		padding: 0.75rem;
		background: var(--color-info-light);
		border: 1px solid var(--color-info);
		border-radius: var(--radius-md);
		text-align: center;
		font-size: 0.875rem;
	}

	.session-timer.warning {
		background: var(--color-warning-light);
		border-color: var(--color-warning);
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.session-expired {
		max-width: 28rem;
		margin: 0 auto;
		padding: 3rem 2rem;
		text-align: center;
	}

	.session-expired h2 {
		margin: 0 0 1rem 0;
		color: var(--color-danger);
	}

	.session-expired button {
		margin-top: 1.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
	}
</style>
```

### **Example 5: With Backup Code Warning**

```svelte
<script lang="ts">
	import { Auth } from '@equaltoai/greater-components-fediverse';

	let backupCodesRemaining = $state(10);

	async function handleTwoFactorVerify({ code, method }) {
		const response = await fetch('/api/auth/2fa/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sessionToken: twoFactorSession.sessionToken,
				code,
				method,
			}),
		});

		if (!response.ok) {
			throw new Error('Invalid code');
		}

		const data = await response.json();

		if (method === 'backup') {
			// Update remaining backup codes count
			backupCodesRemaining = data.backupCodesRemaining;

			// Show warning if running low
			if (backupCodesRemaining <= 3) {
				alert(
					`Warning: You have ${backupCodesRemaining} backup codes remaining. Consider regenerating them.`
				);
			}
		}

		localStorage.setItem('accessToken', data.accessToken);
		window.location.href = '/home';
	}
</script>

<Auth.Root handlers={{ onTwoFactorVerify: handleTwoFactorVerify }}>
	<Auth.TwoFactorVerify />

	{#if backupCodesRemaining <= 5}
		<div class="backup-warning">
			⚠️ You have {backupCodesRemaining} backup codes remaining.
			<a href="/settings/security/backup-codes">Generate new codes</a>
		</div>
	{/if}
</Auth.Root>

<style>
	.backup-warning {
		max-width: 28rem;
		margin: 1rem auto 0;
		padding: 1rem;
		background: var(--color-warning-light);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius-md);
		text-align: center;
		font-size: 0.875rem;
	}

	.backup-warning a {
		color: var(--color-primary);
		text-decoration: underline;
	}
</style>
```

---

## 🔒 Security Considerations

### **Server-Side Verification**:

```javascript
const speakeasy = require('speakeasy');
const bcrypt = require('bcrypt');

app.post('/api/auth/2fa/verify', async (req, res) => {
	const { sessionToken, code, method } = req.body;

	// Verify session token
	const session = await db.twoFactorSessions.findOne({
		token: sessionToken,
		expiresAt: { $gt: new Date() },
	});

	if (!session) {
		return res.status(401).json({ error: 'Invalid or expired session' });
	}

	// Get user
	const user = await db.users.findOne({ id: session.userId });

	if (method === 'totp') {
		// Verify TOTP code
		const verified = speakeasy.totp.verify({
			secret: user.twoFactorSecret,
			encoding: 'base32',
			token: code,
			window: 1, // Allow 30 seconds clock skew
		});

		if (!verified) {
			// Increment failed attempts
			await db.twoFactorSessions.updateOne({ _id: session._id }, { $inc: { failedAttempts: 1 } });

			// Lock out after 5 failed attempts
			if (session.failedAttempts >= 4) {
				await db.twoFactorSessions.updateOne(
					{ _id: session._id },
					{ $set: { lockedUntil: new Date(Date.now() + 15 * 60 * 1000) } }
				);
			}

			return res.status(401).json({ error: 'Invalid code' });
		}
	} else if (method === 'backup') {
		// Verify backup code
		let codeValid = false;

		for (const hashedCode of user.twoFactorBackupCodes) {
			if (await bcrypt.compare(code, hashedCode)) {
				codeValid = true;
				// Remove used code
				await db.users.updateOne({ id: user.id }, { $pull: { twoFactorBackupCodes: hashedCode } });
				break;
			}
		}

		if (!codeValid) {
			return res.status(401).json({ error: 'Invalid backup code' });
		}
	}

	// Generate access token
	const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});

	// Clean up session
	await db.twoFactorSessions.deleteOne({ _id: session._id });

	// Log successful 2FA
	await db.auditLog.create({
		userId: user.id,
		action: '2fa_verify_success',
		method,
		ip: req.ip,
		timestamp: new Date(),
	});

	res.json({
		accessToken,
		user: {
			id: user.id,
			email: user.email,
			username: user.username,
		},
		backupCodesRemaining: user.twoFactorBackupCodes.length,
	});
});
```

### **Best Practices**:

1. ✅ **Session Timeout**: 2FA sessions expire in 5-10 minutes
2. ✅ **Rate Limiting**: Limit to 5 attempts, then 15-minute lockout
3. ✅ **Clock Skew**: Allow 1-2 time windows for TOTP verification
4. ✅ **Backup Code Usage**: Remove used codes immediately
5. ✅ **Audit Logging**: Log all 2FA attempts (success and failure)
6. ✅ **Device Trust**: Optional "trust this device" for 30 days
7. ✅ **Notification**: Email user after successful 2FA login

---

## 🎨 Styling

The TwoFactorVerify component includes comprehensive built-in styling. Custom CSS properties available for theming.

---

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation (Tab, Enter)
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Error messages with `role="alert"`
- ✅ Numeric input optimization (`inputmode="numeric"`)

---

## 🧪 Testing

51 passing tests covering:

- TOTP code verification
- Backup code verification
- Method switching
- Input validation
- Enter key submission
- Error handling
- Loading states

---

## 🔗 Related Components

- [Auth.Root](./Root.md)
- [Auth.TwoFactorSetup](./TwoFactorSetup.md)
- [Auth.BackupCodes](./BackupCodes.md)

---

## 📚 See Also

- [Auth Overview](./README.md)
- [TOTP Specification (RFC 6238)](https://tools.ietf.org/html/rfc6238)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)
