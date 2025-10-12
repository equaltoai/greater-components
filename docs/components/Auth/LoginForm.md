# Auth.LoginForm

**Component**: Email/Password Login Form  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 48 passing tests

---

## 📋 Overview

`Auth.LoginForm` provides a complete email and password login interface with optional WebAuthn biometric authentication, "remember me" functionality, and forgot password links.

### **Key Features**:
- ✅ Email and password validation
- ✅ Optional WebAuthn (biometric) login
- ✅ "Remember me" checkbox
- ✅ Forgot password link
- ✅ Register link
- ✅ Real-time validation
- ✅ Loading states
- ✅ Error handling
- ✅ Keyboard navigation
- ✅ Accessible form elements

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

  async function handleLogin({ email, password, remember }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('auth_token', token);
      window.location.href = '/dashboard';
    }
  }
</script>

<Auth.Root handlers={{ onLogin: handleLogin }}>
  <Auth.LoginForm />
</Auth.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showWebAuthn` | `boolean` | `true` | Show WebAuthn (biometric) login option |
| `showRememberMe` | `boolean` | `true` | Show "remember me" checkbox |
| `showForgotPassword` | `boolean` | `true` | Show "forgot password" link |
| `showRegisterLink` | `boolean` | `true` | Show link to registration |
| `title` | `string` | `"Sign In"` | Custom form title |
| `class` | `string` | `''` | Custom CSS class |

---

## 📤 Events

The component uses the `onLogin` handler from `Auth.Root` context:

```typescript
interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

handlers: {
  onLogin?: (credentials: LoginCredentials) => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Minimal Login**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  async function handleLogin({ email, password }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const { token } = await response.json();
    localStorage.setItem('token', token);
    window.location.href = '/';
  }
</script>

<Auth.Root handlers={{ onLogin: handleLogin }}>
  <Auth.LoginForm 
    showWebAuthn={false}
    showRememberMe={false}
    showForgotPassword={false}
    showRegisterLink={false}
  />
</Auth.Root>
```

### **Example 2: With WebAuthn**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let useWebAuthn = $state(false);

  async function handleLogin({ email, password, remember }) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if WebAuthn is available
        if (data.webAuthnAvailable) {
          useWebAuthn = true;
        } else {
          // Direct login
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async function handleWebAuthnAuth({ credential }) {
    const response = await fetch('/api/auth/webauthn/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      window.location.href = '/';
    }
  }
</script>

<Auth.Root handlers={{ onLogin: handleLogin, onWebAuthnAuth: handleWebAuthnAuth }}>
  {#if !useWebAuthn}
    <Auth.LoginForm showWebAuthn={true} />
  {:else}
    <Auth.WebAuthnSetup />
  {/if}
</Auth.Root>
```

### **Example 3: With Error Handling**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let errorMessage = $state('');
  let loading = $state(false);

  async function handleLogin({ email, password, remember }) {
    loading = true;
    errorMessage = '';
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        errorMessage = data.error || 'Login failed';
        return;
      }
      
      localStorage.setItem('token', data.token);
      
      if (remember) {
        localStorage.setItem('remember_me', 'true');
      }
      
      window.location.href = '/dashboard';
    } catch (error) {
      errorMessage = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="login-container">
  <Auth.Root handlers={{ onLogin: handleLogin }}>
    {#if errorMessage}
      <div class="error-banner" role="alert">
        {errorMessage}
      </div>
    {/if}
    
    <Auth.LoginForm />
    
    {#if loading}
      <div class="loading-overlay">
        <div class="spinner"></div>
      </div>
    {/if}
  </Auth.Root>
</div>

<style>
  .login-container {
    position: relative;
    max-width: 400px;
    margin: 2rem auto;
  }

  .error-banner {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fef2f2;
    color: #991b1b;
    border-radius: var(--radius-md);
    border: 1px solid #fecaca;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: var(--radius-lg);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
```

### **Example 4: With Social Login**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  async function handleLogin({ email, password }) {
    // Standard email/password login
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      window.location.href = '/';
    }
  }

  async function handleOAuthLogin(provider: string) {
    window.location.href = `/api/auth/oauth/${provider}`;
  }
</script>

<div class="auth-page">
  <h1>Welcome Back</h1>
  
  <div class="social-login">
    <button onclick={() => handleOAuthLogin('google')}>
      Continue with Google
    </button>
    <button onclick={() => handleOAuthLogin('github')}>
      Continue with GitHub
    </button>
  </div>
  
  <div class="divider">
    <span>or</span>
  </div>
  
  <Auth.Root handlers={{ onLogin: handleLogin }}>
    <Auth.LoginForm 
      title="Sign in with email"
      showRegisterLink={false}
    />
  </Auth.Root>
  
  <p class="register-prompt">
    Don't have an account? <a href="/register">Sign up</a>
  </p>
</div>

<style>
  .auth-page {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .social-login {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .social-login button {
    padding: 0.75rem;
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background 0.2s;
  }

  .social-login button:hover {
    background: var(--color-surface);
  }

  .divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
  }

  .divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--color-border);
  }

  .divider span {
    position: relative;
    padding: 0 1rem;
    background: white;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  .register-prompt {
    text-align: center;
    margin-top: 1.5rem;
    color: var(--color-text-secondary);
  }

  .register-prompt a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .register-prompt a:hover {
    text-decoration: underline;
  }
</style>
```

---

## 🎨 Styling

The LoginForm uses CSS custom properties for theming:

```css
:root {
  /* Form Elements */
  --auth-input-bg: var(--color-surface);
  --auth-input-border: var(--color-border);
  --auth-input-focus: var(--color-primary);
  --auth-input-error: #ef4444;
  --auth-input-radius: var(--radius-md);
  
  /* Labels & Text */
  --auth-label-color: var(--color-text);
  --auth-label-size: 0.875rem;
  --auth-text-secondary: var(--color-text-secondary);
  
  /* Buttons */
  --auth-button-bg: var(--color-primary);
  --auth-button-hover: var(--color-primary-hover);
  --auth-button-text: white;
  --auth-button-radius: var(--radius-md);
  
  /* Links */
  --auth-link-color: var(--color-primary);
  --auth-link-hover: var(--color-primary-hover);
  
  /* Spacing */
  --auth-spacing: 1rem;
}
```

### **Custom Styling Example**:

```svelte
<Auth.Root handlers={{ onLogin: handleLogin }}>
  <Auth.LoginForm class="custom-login" />
</Auth.Root>

<style>
  :global(.custom-login) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 1rem;
  }

  :global(.custom-login input) {
    background: rgba(255, 255, 255, 0.9);
    border: none;
  }

  :global(.custom-login button[type="submit"]) {
    background: #764ba2;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
```

---

## ♿ Accessibility

The LoginForm is fully accessible:

### **Features**:
- ✅ **Semantic HTML**: Proper form elements
- ✅ **Labels**: Associated with inputs via `for` attribute
- ✅ **ARIA**: Error messages announced with `aria-describedby`
- ✅ **Keyboard Navigation**: Tab through all interactive elements
- ✅ **Focus Indicators**: Clear focus styles
- ✅ **Error Handling**: Errors announced to screen readers
- ✅ **Loading States**: Announced with `aria-live`

### **Keyboard Shortcuts**:
- `Tab`: Navigate between fields
- `Shift + Tab`: Navigate backwards
- `Enter`: Submit form
- `Space`: Toggle checkbox

### **Screen Reader Support**:
- Form inputs have descriptive labels
- Error messages are associated with inputs
- Loading states are announced
- Submit button state is communicated

---

## 🔒 Validation

The LoginForm includes client-side validation:

### **Email Validation**:
```typescript
// Valid formats
email@example.com
user.name@domain.co.uk
user+tag@example.com

// Invalid formats
invalid.email
@example.com
user@
```

### **Password Requirements**:
- Minimum 8 characters
- Maximum 128 characters
- No specific complexity requirements (server-side only)

### **Custom Validation**:

You can add custom validation in your handler:

```typescript
async function handleLogin({ email, password }) {
  // Custom validation
  if (!email.endsWith('@company.com')) {
    throw new Error('Please use your company email');
  }
  
  if (password.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }
  
  // Proceed with login
  // ...
}
```

---

## 🧪 Testing

The LoginForm has 48 passing tests covering:

### **Test Coverage**:
- Email validation (various formats)
- Password validation
- Form submission
- Error handling
- Loading states
- "Remember me" functionality
- WebAuthn integration
- Keyboard navigation
- Accessibility

### **Example Tests**:

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { Auth } from '@greater/fediverse';

describe('Auth.LoginForm', () => {
  it('validates email format', async () => {
    const onLogin = vi.fn();
    const { getByLabelText, getByRole } = render(Auth.Root, {
      props: {
        handlers: { onLogin },
        children: '<Auth.LoginForm />'
      }
    });

    const emailInput = getByLabelText('Email');
    const submitButton = getByRole('button', { name: /sign in/i });

    await fireEvent.input(emailInput, { target: { value: 'invalid' } });
    await fireEvent.click(submitButton);

    expect(onLogin).not.toHaveBeenCalled();
  });

  it('submits valid credentials', async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined);
    const { getByLabelText, getByRole } = render(Auth.Root, {
      props: {
        handlers: { onLogin },
        children: '<Auth.LoginForm />'
      }
    });

    await fireEvent.input(getByLabelText('Email'), {
      target: { value: 'user@example.com' }
    });
    await fireEvent.input(getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    await fireEvent.click(getByRole('button', { name: /sign in/i }));

    expect(onLogin).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
      remember: false
    });
  });
});
```

---

## 🔗 Related Components

- [Auth.Root](./Root.md) - Context provider
- [Auth.RegisterForm](./RegisterForm.md) - Account registration
- [Auth.PasswordReset](./PasswordReset.md) - Password recovery
- [Auth.WebAuthnSetup](./WebAuthnSetup.md) - Biometric authentication
- [Auth.TwoFactorVerify](./TwoFactorVerify.md) - 2FA verification

---

## 📚 See Also

- [Auth Components Overview](./README.md)
- [Authentication Patterns](../../patterns/AUTHENTICATION.md)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Form Validation](../../patterns/VALIDATION.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)

