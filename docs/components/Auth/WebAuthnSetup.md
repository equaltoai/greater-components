# Auth.WebAuthnSetup

**Component**: Biometric/Security Key Setup  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 43 passing tests

---

## 📋 Overview

`Auth.WebAuthnSetup` provides a complete interface for registering WebAuthn credentials, enabling passwordless authentication using biometrics (fingerprint, Face ID, Touch ID) or physical security keys (YubiKey, Titan, etc.).

### **Key Features**:
- ✅ Browser WebAuthn API support detection
- ✅ Multi-step registration flow (intro → registering → success/error)
- ✅ Clear benefits explanation
- ✅ Optional skip functionality
- ✅ Comprehensive error handling
- ✅ Loading states with visual feedback
- ✅ Success confirmation
- ✅ Retry capability on failure
- ✅ Fully accessible with ARIA

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  let userEmail = 'user@example.com';

  async function handleWebAuthnRegister(email) {
    // Get challenge from server
    const challengeResponse = await fetch('/api/auth/webauthn/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const { challenge, userId } = await challengeResponse.json();
    
    // Create WebAuthn credential
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
        rp: {
          name: 'My App',
          id: window.location.hostname
        },
        user: {
          id: Uint8Array.from(userId, c => c.charCodeAt(0)),
          name: email,
          displayName: email
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },  // ES256
          { type: 'public-key', alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Use platform authenticator
          userVerification: 'required'
        },
        timeout: 60000
      }
    });
    
    // Register credential with server
    await fetch('/api/auth/webauthn/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        credential: {
          id: credential.id,
          rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
          response: {
            clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
            attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject)))
          },
          type: credential.type
        }
      })
    });
  }
</script>

<Auth.Root handlers={{ onWebAuthnRegister: handleWebAuthnRegister }}>
  <Auth.WebAuthnSetup email={userEmail} />
</Auth.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `email` | `string` | - | **Yes** | User's email for WebAuthn registration |
| `title` | `string` | `"Set Up Biometric Authentication"` | No | Custom form title |
| `showSkip` | `boolean` | `true` | No | Show option to skip setup |
| `onSkip` | `() => void` | - | No | Callback when setup is skipped |
| `onComplete` | `() => void` | - | No | Callback when setup is complete |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 📤 Events

The component uses the `onWebAuthnRegister` handler from `Auth.Root` context:

```typescript
handlers: {
  onWebAuthnRegister?: (email: string) => Promise<void>;
}
```

Additionally, you can use the optional callbacks:

```typescript
interface Props {
  onSkip?: () => void;      // Called when user skips setup
  onComplete?: () => void;   // Called when setup completes successfully
}
```

---

## 🎨 Component States

The WebAuthnSetup component has four distinct states:

### **1. Unavailable**
Shown when WebAuthn is not supported by the browser.

### **2. Intro**
Initial state showing benefits and "Set Up Now" button.

### **3. Registering**
Loading state during credential creation (follows device prompts).

### **4. Success**
Confirmation screen after successful registration.

### **5. Error**
Error state with retry and skip options.

---

## 💡 Examples

### **Example 1: After Registration**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let userId = '12345';
  let userEmail = 'user@example.com';
  let setupComplete = $state(false);

  async function handleWebAuthnRegister(email) {
    try {
      // Generate challenge
      const response = await fetch('/api/webauthn/register/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      });
      
      const options = await response.json();
      
      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: options
      });
      
      // Complete registration
      await fetch('/api/webauthn/register/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          credential: credential
        })
      });
    } catch (error) {
      console.error('WebAuthn registration failed:', error);
      throw error;
    }
  }

  function handleComplete() {
    setupComplete = true;
    // Proceed to dashboard
    window.location.href = '/dashboard';
  }

  function handleSkip() {
    // User chose to skip, proceed anyway
    window.location.href = '/dashboard';
  }
</script>

<div class="setup-page">
  <h1>Welcome, {userEmail}!</h1>
  <p>Let's secure your account with biometric authentication.</p>
  
  <Auth.Root handlers={{ onWebAuthnRegister: handleWebAuthnRegister }}>
    <Auth.WebAuthnSetup 
      {email}={userEmail}
      {onComplete}={handleComplete}
      {onSkip}={handleSkip}
    />
  </Auth.Root>
</div>

<style>
  .setup-page {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  p {
    text-align: center;
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
  }
</style>
```

### **Example 2: During Onboarding Flow**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let onboardingStep = $state<'register' | 'webauthn' | '2fa' | 'complete'>('register');
  let userId = $state<string | null>(null);
  let userEmail = $state<string>('');

  async function handleRegister(data) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      userId = result.userId;
      userEmail = data.email;
      onboardingStep = 'webauthn';
    }
  }

  async function handleWebAuthnRegister(email) {
    // WebAuthn registration logic
    // ... (same as above)
  }

  function handleWebAuthnComplete() {
    // Proceed to 2FA setup
    onboardingStep = '2fa';
  }

  function handleWebAuthnSkip() {
    // Skip WebAuthn, go directly to 2FA
    onboardingStep = '2fa';
  }

  function handle2FAComplete() {
    onboardingStep = 'complete';
  }
</script>

<div class="onboarding">
  <div class="onboarding-progress">
    <div class="step" class:active={onboardingStep === 'register'}>1. Register</div>
    <div class="step" class:active={onboardingStep === 'webauthn'}>2. Biometrics</div>
    <div class="step" class:active={onboardingStep === '2fa'}>3. Two-Factor</div>
    <div class="step" class:active={onboardingStep === 'complete'}>4. Complete</div>
  </div>

  <Auth.Root handlers={{ 
    onRegister: handleRegister,
    onWebAuthnRegister: handleWebAuthnRegister 
  }}>
    {#if onboardingStep === 'register'}
      <Auth.RegisterForm />
    
    {:else if onboardingStep === 'webauthn'}
      <Auth.WebAuthnSetup 
        email={userEmail}
        onComplete={handleWebAuthnComplete}
        onSkip={handleWebAuthnSkip}
      />
    
    {:else if onboardingStep === '2fa'}
      <Auth.TwoFactorSetup 
        onComplete={handle2FAComplete}
      />
    
    {:else if onboardingStep === 'complete'}
      <div class="completion">
        <h2>All Set!</h2>
        <p>Your account is now fully secured.</p>
        <a href="/dashboard">Go to Dashboard</a>
      </div>
    {/if}
  </Auth.Root>
</div>

<style>
  .onboarding {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .onboarding-progress {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--color-border);
  }

  .step {
    flex: 1;
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .step.active {
    color: var(--color-primary);
    font-weight: 700;
  }

  .completion {
    text-align: center;
    padding: 3rem 2rem;
  }

  .completion h2 {
    margin-bottom: 1rem;
    color: var(--color-success);
  }

  .completion a {
    display: inline-block;
    margin-top: 2rem;
    padding: 0.875rem 2rem;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-full);
    font-weight: 700;
  }
</style>
```

### **Example 3: Security Settings Page**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let showWebAuthnSetup = $state(false);
  let hasWebAuthn = $state(false);
  let userEmail = 'user@example.com';

  $effect(() => {
    // Check if user already has WebAuthn
    fetch('/api/auth/webauthn/status')
      .then(r => r.json())
      .then(data => {
        hasWebAuthn = data.hasWebAuthn;
      });
  });

  async function handleWebAuthnRegister(email) {
    // WebAuthn registration logic
  }

  function handleComplete() {
    showWebAuthnSetup = false;
    hasWebAuthn = true;
    alert('Biometric authentication enabled!');
  }
</script>

<div class="security-settings">
  <h1>Security Settings</h1>
  
  <div class="setting-section">
    <div class="setting-header">
      <div>
        <h3>Biometric Authentication</h3>
        <p>Sign in with Face ID, Touch ID, or security key</p>
      </div>
      <div class="setting-status">
        {#if hasWebAuthn}
          <span class="badge success">Enabled</span>
        {:else}
          <span class="badge">Not Set Up</span>
        {/if}
      </div>
    </div>
    
    {#if !hasWebAuthn && !showWebAuthnSetup}
      <button onclick={() => showWebAuthnSetup = true} class="btn-primary">
        Set Up Biometric Authentication
      </button>
    {/if}
    
    {#if showWebAuthnSetup}
      <div class="setup-container">
        <Auth.Root handlers={{ onWebAuthnRegister: handleWebAuthnRegister }}>
          <Auth.WebAuthnSetup 
            email={userEmail}
            onComplete={handleComplete}
            onSkip={() => showWebAuthnSetup = false}
          />
        </Auth.Root>
      </div>
    {/if}
    
    {#if hasWebAuthn}
      <div class="webauthn-info">
        <p>✓ Biometric authentication is enabled</p>
        <button onclick={() => removeWebAuthn()} class="btn-secondary">
          Remove Biometric Authentication
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .security-settings {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .setting-section {
    padding: 1.5rem;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    margin-bottom: 1.5rem;
  }

  .setting-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .setting-header h3 {
    margin: 0 0 0.25rem 0;
  }

  .setting-header p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .badge.success {
    background: var(--color-success-light);
    color: var(--color-success);
    border-color: var(--color-success);
  }

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
  }

  .btn-secondary {
    padding: 0.5rem 1rem;
    background: transparent;
    color: var(--color-danger);
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    cursor: pointer;
  }

  .setup-container {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: var(--color-background);
    border-radius: var(--radius-md);
  }

  .webauthn-info {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--color-success-light);
    border-radius: var(--radius-md);
  }

  .webauthn-info p {
    margin: 0 0 0.75rem 0;
    color: var(--color-success-dark);
  }
</style>
```

### **Example 4: Fallback to Password**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let authMethod = $state<'webauthn' | 'password'>('webauthn');
  let userEmail = 'user@example.com';

  async function handleWebAuthnRegister(email) {
    try {
      // Attempt WebAuthn registration
      // ...
    } catch (error) {
      if (error.name === 'NotSupportedError') {
        // WebAuthn not supported, fall back to password
        authMethod = 'password';
      }
      throw error;
    }
  }

  async function handleLogin({ email, password }) {
    // Handle password login
  }

  function handleSkip() {
    // Skip WebAuthn, use password instead
    authMethod = 'password';
  }
</script>

<div class="auth-container">
  <h1>Secure Your Account</h1>
  
  <Auth.Root handlers={{ 
    onWebAuthnRegister: handleWebAuthnRegister,
    onLogin: handleLogin 
  }}>
    {#if authMethod === 'webauthn'}
      <div class="webauthn-first">
        <p class="recommendation">
          We recommend biometric authentication for the best security and convenience.
        </p>
        
        <Auth.WebAuthnSetup 
          email={userEmail}
          onSkip={handleSkip}
        />
        
        <button onclick={() => authMethod = 'password'} class="alternative-link">
          Use password instead
        </button>
      </div>
    {:else}
      <div class="password-fallback">
        <p class="info">
          Set up a password for your account.
        </p>
        
        <!-- Password setup form -->
        <form>
          <label>
            Password
            <input type="password" required />
          </label>
          <label>
            Confirm Password
            <input type="password" required />
          </label>
          <button type="submit" class="btn-primary">Set Password</button>
        </form>
        
        <button onclick={() => authMethod = 'webauthn'} class="alternative-link">
          Try biometric authentication
        </button>
      </div>
    {/if}
  </Auth.Root>
</div>

<style>
  .auth-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .recommendation, .info {
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: var(--color-info-light);
    border-left: 3px solid var(--color-info);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
  }

  .alternative-link {
    display: block;
    width: 100%;
    margin-top: 1rem;
    padding: 0.75rem;
    background: transparent;
    border: none;
    color: var(--color-primary);
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: underline;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  input {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
  }

  .btn-primary {
    padding: 0.875rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 700;
    cursor: pointer;
  }
</style>
```

---

## 🎨 Styling

The WebAuthnSetup component includes comprehensive built-in styling with CSS custom properties for theming:

```css
:root {
  /* Colors */
  --primary-color: #1d9bf0;
  --primary-color-dark: #1a8cd8;
  --success-color: #00ba7c;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --border-color: #e1e8ed;
  
  /* Error */
  --error-color: #f4211e;
  --error-background: rgba(244, 33, 46, 0.1);
  --error-border: rgba(244, 33, 46, 0.3);
}
```

### **Custom Styling Example**:

```svelte
<Auth.WebAuthnSetup email={userEmail} class="custom-webauthn" />

<style>
  :global(.custom-webauthn) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 1rem;
    padding: 3rem;
  }

  :global(.custom-webauthn .auth-webauthn__title) {
    color: white;
  }

  :global(.custom-webauthn .auth-webauthn__setup) {
    background: white;
    color: #764ba2;
  }
</style>
```

---

## ♿ Accessibility

The WebAuthnSetup component is fully accessible:

### **Features**:
- ✅ **Semantic HTML**: Proper heading hierarchy
- ✅ **ARIA**: Error messages with `role="alert"`
- ✅ **Keyboard Navigation**: All interactive elements focusable
- ✅ **Focus Management**: Logical tab order
- ✅ **Loading States**: Announced with ARIA live regions
- ✅ **Button States**: Clear disabled and loading states
- ✅ **Screen Reader**: All states announced properly

### **Keyboard Shortcuts**:
- `Tab`: Navigate between buttons
- `Enter` / `Space`: Activate buttons
- `Escape`: (Could be added to skip)

---

## 🔒 Security Considerations

### **Best Practices**:
1. **Challenge Generation**: Always generate a new challenge server-side
2. **Credential Storage**: Store only the public key, never private keys
3. **Origin Validation**: Verify the credential origin matches your domain
4. **User Verification**: Require user verification for sensitive operations
5. **Fallback Options**: Always provide alternative authentication methods

### **Server-Side Implementation**:

```typescript
// Example server-side challenge generation
app.post('/api/webauthn/challenge', async (req, res) => {
  const { email } = req.body;
  
  // Generate cryptographically secure challenge
  const challenge = crypto.randomBytes(32).toString('base64');
  
  // Store challenge in session/database with expiration
  await db.storeChallenge(email, challenge, Date.now() + 60000);
  
  res.json({
    challenge,
    userId: await db.getUserId(email)
  });
});

// Example credential verification
app.post('/api/webauthn/register', async (req, res) => {
  const { email, credential } = req.body;
  
  // Retrieve and verify challenge
  const challenge = await db.getChallenge(email);
  if (!challenge || challenge.expired) {
    return res.status(400).json({ error: 'Invalid challenge' });
  }
  
  // Verify credential
  // ... verification logic ...
  
  // Store credential
  await db.storeCredential(email, {
    credentialId: credential.id,
    publicKey: credential.response.attestationObject,
    counter: 0
  });
  
  res.json({ success: true });
});
```

---

## 🧪 Testing

The WebAuthnSetup component has 43 passing tests covering:

### **Test Coverage**:
- Browser WebAuthn API detection
- All registration states (intro, registering, success, error)
- Skip functionality
- Completion callbacks
- Error handling and retry
- Loading states
- Button interactions
- Accessibility

### **Example Tests**:

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { Auth } from '@greater/fediverse';

describe('Auth.WebAuthnSetup', () => {
  it('shows unavailable message when WebAuthn not supported', () => {
    // Mock WebAuthn as unavailable
    delete (global.navigator as any).credentials;
    
    const { getByText } = render(Auth.WebAuthnSetup, {
      props: { email: 'test@example.com' }
    });
    
    expect(getByText(/not available/i)).toBeInTheDocument();
  });

  it('calls onWebAuthnRegister when setup button clicked', async () => {
    const onWebAuthnRegister = vi.fn().mockResolvedValue(undefined);
    const { getByText } = render(Auth.Root, {
      props: {
        handlers: { onWebAuthnRegister },
        children: '<Auth.WebAuthnSetup email="test@example.com" />'
      }
    });

    await fireEvent.click(getByText('Set Up Now'));

    expect(onWebAuthnRegister).toHaveBeenCalledWith('test@example.com');
  });

  it('shows success state after successful registration', async () => {
    const onWebAuthnRegister = vi.fn().mockResolvedValue(undefined);
    const { getByText } = render(Auth.Root, {
      props: {
        handlers: { onWebAuthnRegister },
        children: '<Auth.WebAuthnSetup email="test@example.com" />'
      }
    });

    await fireEvent.click(getByText('Set Up Now'));
    
    // Wait for success state
    await waitFor(() => {
      expect(getByText(/You're all set!/i)).toBeInTheDocument();
    });
  });

  it('calls onSkip when skip button clicked', async () => {
    const onSkip = vi.fn();
    const { getByText } = render(Auth.Root, {
      props: {
        children: '<Auth.WebAuthnSetup email="test@example.com" onSkip={onSkip} />'
      }
    });

    await fireEvent.click(getByText('Skip for now'));

    expect(onSkip).toHaveBeenCalled();
  });
});
```

---

## 🌐 Browser Support

WebAuthn is supported in all modern browsers:

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 67+ | ✅ Full |
| Firefox | 60+ | ✅ Full |
| Safari | 13+ | ✅ Full |
| Edge | 18+ | ✅ Full |

**Note**: The component automatically detects browser support and shows an appropriate message when WebAuthn is unavailable.

---

## 🔗 Related Components

- [Auth.Root](./Root.md) - Context provider
- [Auth.LoginForm](./LoginForm.md) - Email/password login
- [Auth.WalletConnect](./WalletConnect.md) - Crypto wallet authentication
- [Auth.TwoFactorSetup](./TwoFactorSetup.md) - 2FA setup

---

## 📚 See Also

- [Auth Components Overview](./README.md)
- [WebAuthn Specification](https://www.w3.org/TR/webauthn/)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)

