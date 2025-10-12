# Auth Components

**Package**: `@greater/fediverse`  
**Components**: 8  
**Status**: Production Ready ✅

---

## 📋 Overview

The Auth component family provides comprehensive authentication and authorization functionality for Fediverse applications, with a focus on modern, passwordless authentication methods while maintaining compatibility with traditional email/password flows.

### **Key Features**:
- ✅ **Passwordless Authentication**: WebAuthn (biometric/security keys) and crypto wallets (WalletConnect)
- ✅ **Two-Factor Authentication**: TOTP and backup codes
- ✅ **OAuth 2.0**: Third-party application consent
- ✅ **Legacy Support**: Email/password for cross-platform compatibility
- ✅ **Secure by Default**: Following modern security best practices
- ✅ **Accessible**: WCAG 2.1 AA compliant

---

## 🏗️ Architecture

Auth components follow the **compound component pattern**:

```svelte
<Auth.Root initialState={...} handlers={...}>
  <!-- Compose your auth flow -->
  <Auth.LoginForm />
  <Auth.RegisterForm />
  <Auth.WebAuthnSetup />
</Auth.Root>
```

The `Auth.Root` component provides context that all child components consume, enabling:
- Shared authentication state
- Event handlers
- Error management
- Loading states

---

## 📦 Components

### **Core Components**:
1. [**Root**](./Root.md) - Context provider for all auth components
2. [**LoginForm**](./LoginForm.md) - Email/password login
3. [**RegisterForm**](./RegisterForm.md) - Account registration
4. [**PasswordReset**](./PasswordReset.md) - Password recovery

### **Modern Authentication**:
5. [**WebAuthnSetup**](./WebAuthnSetup.md) - Biometric/security key setup
6. [**WalletConnect**](./WalletConnect.md) - Crypto wallet authentication
7. [**OAuthConsent**](./OAuthConsent.md) - OAuth 2.0 consent flow

### **Two-Factor Authentication**:
8. [**TwoFactorSetup**](./TwoFactorSetup.md) - Enable 2FA with TOTP
9. [**TwoFactorVerify**](./TwoFactorVerify.md) - Verify 2FA codes
10. [**BackupCodes**](./BackupCodes.md) - Manage 2FA backup codes

---

## 🚀 Quick Start

### **Basic Login Flow**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  async function handleLogin({ email, password }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      // Store token and redirect
    }
  }
</script>

<Auth.Root handlers={{ onLogin: handleLogin }}>
  <Auth.LoginForm />
</Auth.Root>
```

### **Registration Flow**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  async function handleRegister(data) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      // Account created, proceed to verification
    }
  }
</script>

<Auth.Root handlers={{ onRegister: handleRegister }}>
  <Auth.RegisterForm />
</Auth.Root>
```

### **WebAuthn Setup**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  async function handleWebAuthnSetup({ credential }) {
    const response = await fetch('/api/auth/webauthn/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    
    if (response.ok) {
      // WebAuthn credential registered
    }
  }
</script>

<Auth.Root handlers={{ onWebAuthnSetup: handleWebAuthnSetup }}>
  <Auth.WebAuthnSetup />
</Auth.Root>
```

---

## 🔐 Authentication Strategies

### **1. Passwordless (Recommended)**

Lesser prioritizes passwordless authentication:

**WebAuthn (Biometric/Security Keys)**:
- Face ID / Touch ID
- Windows Hello
- Hardware security keys (YubiKey, etc.)
- Most secure option

**Crypto Wallets**:
- MetaMask
- WalletConnect
- Decentralized identity

**Benefits**:
- ✅ No passwords to remember
- ✅ Phishing-resistant
- ✅ Hardware-backed security
- ✅ Better user experience

### **2. Email/Password (Legacy)**

Supported for compatibility but considered deprecated in Lesser:

- Used for cross-platform access
- Fallback when biometrics unavailable
- Should be paired with 2FA

### **3. Two-Factor Authentication**

Additional security layer:

**TOTP (Time-based One-Time Password)**:
- Google Authenticator
- Authy
- 1Password

**Backup Codes**:
- Single-use recovery codes
- For when TOTP device is unavailable

---

## 📱 Complete Authentication Flow

Here's a complete, production-ready authentication flow:

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let authStep = $state<'login' | 'register' | 'webauthn' | '2fa' | 'success'>('login');
  let userId = $state<string | null>(null);
  let requiresWebAuthn = $state(false);
  let requires2FA = $state(false);

  const handlers = {
    async onLogin({ email, password }) {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.requiresWebAuthn) {
        requiresWebAuthn = true;
        authStep = 'webauthn';
      } else if (data.requires2FA) {
        requires2FA = true;
        userId = data.userId;
        authStep = '2fa';
      } else if (data.token) {
        // Successful login
        authStep = 'success';
        localStorage.setItem('auth_token', data.token);
      }
    },

    async onRegister(data) {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const result = await response.json();
        userId = result.userId;
        authStep = 'webauthn'; // Setup WebAuthn for new account
      }
    },

    async onWebAuthnSetup({ credential }) {
      const response = await fetch('/api/auth/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, credential })
      });
      
      if (response.ok) {
        authStep = 'success';
      }
    },

    async on2FAVerify({ code }) {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code })
      });
      
      if (response.ok) {
        const { token } = await response.json();
        authStep = 'success';
        localStorage.setItem('auth_token', token);
      }
    }
  };
</script>

<div class="auth-container">
  <Auth.Root {handlers}>
    {#if authStep === 'login'}
      <div class="auth-card">
        <h1>Welcome Back</h1>
        <Auth.LoginForm />
        <button onclick={() => authStep = 'register'}>
          Create an account
        </button>
      </div>
    
    {:else if authStep === 'register'}
      <div class="auth-card">
        <h1>Create Account</h1>
        <Auth.RegisterForm />
        <button onclick={() => authStep = 'login'}>
          Already have an account?
        </button>
      </div>
    
    {:else if authStep === 'webauthn'}
      <div class="auth-card">
        <h1>Setup Security</h1>
        <p>Add biometric authentication for secure access</p>
        <Auth.WebAuthnSetup />
      </div>
    
    {:else if authStep === '2fa'}
      <div class="auth-card">
        <h1>Two-Factor Authentication</h1>
        <Auth.TwoFactorVerify />
      </div>
    
    {:else if authStep === 'success'}
      <div class="auth-card">
        <h1>Success!</h1>
        <p>You're logged in.</p>
      </div>
    {/if}
  </Auth.Root>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
  }

  .auth-card {
    max-width: 400px;
    width: 100%;
    padding: 2rem;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin-bottom: 1.5rem;
    font-size: 1.875rem;
    font-weight: 700;
  }

  button {
    margin-top: 1rem;
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

Auth components use CSS custom properties for theming:

```css
:root {
  /* Form Colors */
  --auth-input-bg: var(--color-surface);
  --auth-input-border: var(--color-border);
  --auth-input-focus: var(--color-primary);
  --auth-input-error: #ef4444;
  
  /* Button Colors */
  --auth-button-bg: var(--color-primary);
  --auth-button-hover: var(--color-primary-hover);
  --auth-button-text: white;
  
  /* Spacing */
  --auth-spacing: var(--spacing-md);
  
  /* Border Radius */
  --auth-radius: var(--radius-md);
}
```

---

## ♿ Accessibility

All Auth components are fully accessible:

- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Readers**: Proper ARIA labels and descriptions
- ✅ **Error Messages**: Announced to assistive technologies
- ✅ **Focus Management**: Logical focus order
- ✅ **Form Validation**: Live validation feedback

---

## 🧪 Testing

Auth components have comprehensive test coverage:

- **LoginForm**: 48 tests
- **RegisterForm**: 50 tests
- **WebAuthnSetup**: 43 tests
- **OAuthConsent**: 51 tests
- **TwoFactorSetup**: 51 tests
- **TwoFactorVerify**: 51 tests
- **BackupCodes**: 59 tests
- **WalletConnect**: 73 tests

**Total**: 426 tests ✅

---

## 🔒 Security Best Practices

### **Do's**:
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Store tokens securely (httpOnly cookies preferred)
- ✅ Validate all inputs server-side
- ✅ Use WebAuthn for passwordless auth
- ✅ Enable 2FA for all users
- ✅ Hash passwords with bcrypt/argon2
- ✅ Implement CSRF protection

### **Don'ts**:
- ❌ Store passwords in plain text
- ❌ Send credentials over HTTP
- ❌ Implement custom crypto
- ❌ Trust client-side validation alone
- ❌ Use weak password requirements
- ❌ Allow unlimited login attempts

---

## 📚 Related Documentation

- [Getting Started](../../GETTING_STARTED.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Testing Guide](../../testing/TESTING_GUIDE.md)

---

## 🔗 API Reference

See individual component documentation:
- [Root](./Root.md)
- [LoginForm](./LoginForm.md)
- [RegisterForm](./RegisterForm.md)
- [WebAuthnSetup](./WebAuthnSetup.md)
- [WalletConnect](./WalletConnect.md)
- [OAuthConsent](./OAuthConsent.md)
- [TwoFactorSetup](./TwoFactorSetup.md)
- [TwoFactorVerify](./TwoFactorVerify.md)
- [BackupCodes](./BackupCodes.md)
- [PasswordReset](./PasswordReset.md)

