# Auth.RegisterForm

**Component**: Account Registration Form  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 50 passing tests

---

## 📋 Overview

`Auth.RegisterForm` provides a complete account registration interface with email, username, and password validation, terms agreement, and optional invite code support.

### **Key Features**:
- ✅ Email, username, and password validation
- ✅ Password strength indicator
- ✅ Password confirmation
- ✅ Optional invite code requirement
- ✅ Terms of service agreement
- ✅ Display name (optional)
- ✅ Real-time validation
- ✅ Accessible and keyboard-friendly

---

## 🚀 Basic Usage

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
      window.location.href = '/welcome';
    }
  }
</script>

<Auth.Root handlers={{ onRegister: handleRegister }}>
  <Auth.RegisterForm />
</Auth.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `requireInvite` | `boolean` | `false` | Require invite code for registration |
| `showLoginLink` | `boolean` | `true` | Show link to login page |
| `title` | `string` | `"Create Account"` | Custom form title |
| `termsUrl` | `string` | `undefined` | Terms of service URL |
| `privacyUrl` | `string` | `undefined` | Privacy policy URL |
| `class` | `string` | `''` | Custom CSS class |

---

## 📤 Events

```typescript
interface RegisterData {
  email: string;
  username: string;
  displayName?: string;
  password: string;
  inviteCode?: string;
  agreeToTerms: boolean;
}

handlers: {
  onRegister?: (data: RegisterData) => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Basic Registration**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  async function handleRegister({ email, username, password }) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    // Auto-login after registration
    const { token } = await response.json();
    localStorage.setItem('token', token);
    window.location.href = '/';
  }
</script>

<Auth.Root handlers={{ onRegister: handleRegister }}>
  <Auth.RegisterForm />
</Auth.Root>
```

### **Example 2: With Invite Code**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  async function handleRegister(data) {
    if (!data.inviteCode) {
      throw new Error('Invite code is required');
    }
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Account created! Please check your email for verification.');
      window.location.href = '/login';
    }
  }
</script>

<Auth.Root handlers={{ onRegister: handleRegister }}>
  <Auth.RegisterForm 
    requireInvite={true}
    title="Join with Invite Code"
  />
</Auth.Root>
```

### **Example 3: With Terms and Privacy**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';

  async function handleRegister(data) {
    if (!data.agreeToTerms) {
      throw new Error('You must agree to the terms');
    }
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      // Send verification email
      await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      
      window.location.href = '/verify-email';
    }
  }
</script>

<Auth.Root handlers={{ onRegister: handleRegister }}>
  <Auth.RegisterForm 
    termsUrl="/terms"
    privacyUrl="/privacy"
  />
</Auth.Root>
```

### **Example 4: Complete Registration Flow**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let step = $state<'register' | 'verify' | 'complete'>('register');
  let userEmail = $state('');

  async function handleRegister(data) {
    try {
      // Create account
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      userEmail = data.email;
      
      // Send verification email
      await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      
      step = 'verify';
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  async function resendVerification() {
    await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });
    
    alert('Verification email sent!');
  }
</script>

<div class="register-flow">
  {#if step === 'register'}
    <Auth.Root handlers={{ onRegister: handleRegister }}>
      <Auth.RegisterForm 
        termsUrl="/terms"
        privacyUrl="/privacy"
      />
    </Auth.Root>
  
  {:else if step === 'verify'}
    <div class="verify-step">
      <h2>Verify Your Email</h2>
      <p>We've sent a verification link to <strong>{userEmail}</strong></p>
      <p>Please check your email and click the link to activate your account.</p>
      <button onclick={resendVerification}>Resend Email</button>
    </div>
  
  {:else if step === 'complete'}
    <div class="complete-step">
      <h2>Welcome!</h2>
      <p>Your account has been created successfully.</p>
      <a href="/dashboard">Go to Dashboard</a>
    </div>
  {/if}
</div>

<style>
  .register-flow {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .verify-step, .complete-step {
    text-align: center;
    padding: 2rem;
  }

  .verify-step h2, .complete-step h2 {
    margin-bottom: 1rem;
  }

  .verify-step p {
    margin-bottom: 1rem;
    color: var(--color-text-secondary);
  }

  .verify-step strong {
    color: var(--color-text);
  }

  button, a {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    margin-top: 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    text-decoration: none;
  }

  button:hover, a:hover {
    background: var(--color-primary-hover);
  }
</style>
```

---

## 🔒 Validation Rules

### **Email**:
- Must be valid email format
- Must not be already registered

### **Username**:
- 3-30 characters
- Alphanumeric and underscores only
- Must start with letter
- Case-insensitive unique

### **Password**:
- Minimum 8 characters
- Must contain: uppercase, lowercase, number
- Maximum 128 characters

### **Display Name** (optional):
- 1-50 characters
- Any Unicode characters allowed

---

## ♿ Accessibility

- ✅ Semantic HTML form elements
- ✅ Associated labels
- ✅ ARIA error descriptions
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Password visibility toggle
- ✅ Screen reader announcements

---

## 🧪 Testing

50 passing tests covering:
- Email validation
- Username validation
- Password strength
- Password confirmation
- Terms agreement
- Invite code handling
- Form submission
- Error handling

---

## 🔗 Related Components

- [Auth.Root](./Root.md)
- [Auth.LoginForm](./LoginForm.md)
- [Auth.WebAuthnSetup](./WebAuthnSetup.md)

---

## 📚 See Also

- [Auth Overview](./README.md)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Form Validation](../../patterns/VALIDATION.md)

