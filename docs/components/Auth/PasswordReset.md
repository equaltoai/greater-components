# Auth.PasswordReset

**Component**: Password Reset/Recovery  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: Part of Auth test suite

---

## 📋 Overview

`Auth.PasswordReset` provides a complete two-step password recovery flow: requesting a reset via email and confirming the reset with a token. The component supports both modes and handles validation, loading states, and error messages.

### **Key Features**:
- ✅ Two-mode operation (request/confirm)
- ✅ Email validation
- ✅ Password strength validation
- ✅ Password confirmation matching
- ✅ Success confirmation screen
- ✅ Token-based security
- ✅ Loading states
- ✅ Comprehensive error handling
- ✅ Keyboard support (Enter to submit)
- ✅ Fully accessible

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

### **Request Reset**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';

  async function handlePasswordResetRequest(email) {
    const response = await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      // Email sent successfully
      console.log('Reset email sent to:', email);
    }
  }
</script>

<Auth.Root handlers={{ onPasswordResetRequest: handlePasswordResetRequest }}>
  <Auth.PasswordReset mode="request" />
</Auth.Root>
```

### **Confirm Reset with Token**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  // Get token from URL parameter
  const url = new URL(window.location.href);
  const resetToken = url.searchParams.get('token');

  async function handlePasswordResetConfirm({ email, token, newPassword }) {
    const response = await fetch('/api/auth/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword })
    });
    
    if (response.ok) {
      // Password reset successful
      window.location.href = '/login?reset=success';
    }
  }
</script>

<Auth.Root handlers={{ onPasswordResetConfirm: handlePasswordResetConfirm }}>
  <Auth.PasswordReset 
    mode="confirm" 
    token={resetToken}
  />
</Auth.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `mode` | `'request' \| 'confirm'` | `'request'` | No | Component mode: request reset or confirm with token |
| `token` | `string` | - | **Yes** (if mode='confirm') | Reset token from email link |
| `email` | `string` | `''` | No | Pre-filled email address |
| `showLoginLink` | `boolean` | `true` | No | Show link back to login |
| `onRequestSuccess` | `(email: string) => void` | - | No | Callback when reset email is sent |
| `onResetSuccess` | `() => void` | - | No | Callback when password is successfully reset |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 📤 Events

The component uses handlers from `Auth.Root` context:

```typescript
interface PasswordResetData {
  email: string;
  token: string;
  newPassword: string;
}

interface AuthHandlers {
  onPasswordResetRequest?: (email: string) => Promise<void>;
  onPasswordResetConfirm?: (data: PasswordResetData) => Promise<void>;
  onNavigateToLogin?: () => void;
}
```

---

## 🎨 Component States

### **Request Mode States**:
1. **Initial**: Email input form
2. **Success**: Confirmation screen with instructions

### **Confirm Mode States**:
1. **Initial**: New password form
2. **Success**: Handled by `onResetSuccess` callback

---

## 💡 Examples

### **Example 1: Complete Reset Flow**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let currentPage = $state<'request' | 'confirm' | 'login'>('request');
  let resetToken = $state<string | null>(null);

  // Check for token in URL on mount
  $effect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    
    if (token) {
      resetToken = token;
      currentPage = 'confirm';
    }
  });

  async function handlePasswordResetRequest(email) {
    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }
      
      // Email sent successfully - component will show success state
    } catch (error) {
      console.error('Reset request failed:', error);
      throw error;
    }
  }

  async function handlePasswordResetConfirm({ email, token, newPassword }) {
    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }
      
      // Password reset successful
      alert('Password reset successfully!');
      currentPage = 'login';
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  function handleNavigateToLogin() {
    currentPage = 'login';
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <Auth.Root handlers={{
      onPasswordResetRequest: handlePasswordResetRequest,
      onPasswordResetConfirm: handlePasswordResetConfirm,
      onNavigateToLogin: handleNavigateToLogin
    }}>
      {#if currentPage === 'request'}
        <Auth.PasswordReset 
          mode="request"
          onRequestSuccess={(email) => {
            console.log('Reset email sent to:', email);
          }}
        />
      
      {:else if currentPage === 'confirm'}
        <Auth.PasswordReset 
          mode="confirm"
          token={resetToken}
          onResetSuccess={() => {
            currentPage = 'login';
          }}
        />
      
      {:else}
        <Auth.LoginForm />
      {/if}
    </Auth.Root>
  </div>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-background);
  }

  .auth-container {
    width: 100%;
    max-width: 450px;
    padding: 2rem;
  }
</style>
```

### **Example 2: With Email Pre-fill from URL**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let email = $state('');

  // Get email from URL if present
  $effect(() => {
    const url = new URL(window.location.href);
    const emailParam = url.searchParams.get('email');
    if (emailParam) {
      email = emailParam;
    }
  });

  async function handlePasswordResetRequest(emailAddress) {
    await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAddress })
    });
  }
</script>

<Auth.Root handlers={{ onPasswordResetRequest: handlePasswordResetRequest }}>
  <Auth.PasswordReset 
    mode="request"
    {email}
  />
</Auth.Root>
```

### **Example 3: With Custom Success Handler**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let showSuccessModal = $state(false);
  let userEmail = $state('');

  async function handlePasswordResetRequest(email) {
    await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  }

  function handleRequestSuccess(email) {
    userEmail = email;
    showSuccessModal = true;
    
    // Optional: Send analytics event
    analytics.track('Password Reset Requested', { email });
    
    // Optional: Show notification
    notifications.show('Check your email for reset instructions', 'success');
  }
</script>

<div class="reset-page">
  <Auth.Root handlers={{ onPasswordResetRequest: handlePasswordResetRequest }}>
    <Auth.PasswordReset 
      mode="request"
      onRequestSuccess={handleRequestSuccess}
      showLoginLink={false}
    />
  </Auth.Root>
  
  {#if showSuccessModal}
    <div class="modal">
      <div class="modal-content">
        <h2>Check Your Email</h2>
        <p>
          We've sent password reset instructions to <strong>{userEmail}</strong>
        </p>
        <button onclick={() => showSuccessModal = false}>Close</button>
      </div>
    </div>
  {/if}
</div>
```

### **Example 4: Token Expiration Handling**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let resetToken = $state<string | null>(null);
  let tokenExpired = $state(false);

  $effect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    
    if (token) {
      // Verify token is still valid
      fetch(`/api/auth/password-reset/verify-token?token=${token}`)
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            resetToken = token;
          } else {
            tokenExpired = true;
          }
        });
    }
  });

  async function handlePasswordResetConfirm(data) {
    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        
        if (error.code === 'TOKEN_EXPIRED') {
          tokenExpired = true;
          throw new Error('Reset link has expired');
        }
        
        throw new Error(error.message);
      }
      
      window.location.href = '/login?reset=success';
    } catch (error) {
      throw error;
    }
  }

  async function handlePasswordResetRequest(email) {
    await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    tokenExpired = false;
  }
</script>

<div class="reset-container">
  <Auth.Root handlers={{
    onPasswordResetConfirm: handlePasswordResetConfirm,
    onPasswordResetRequest: handlePasswordResetRequest
  }}>
    {#if tokenExpired}
      <div class="expired-notice">
        <h2>Reset Link Expired</h2>
        <p>This password reset link has expired. Please request a new one.</p>
        <Auth.PasswordReset mode="request" />
      </div>
    {:else if resetToken}
      <Auth.PasswordReset 
        mode="confirm"
        token={resetToken}
      />
    {:else}
      <Auth.PasswordReset mode="request" />
    {/if}
  </Auth.Root>
</div>

<style>
  .expired-notice {
    padding: 2rem;
    margin-bottom: 2rem;
    background: var(--color-warning-light);
    border: 1px solid var(--color-warning);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  .expired-notice h2 {
    margin: 0 0 0.5rem 0;
    color: var(--color-warning-dark);
  }

  .expired-notice p {
    margin: 0 0 1.5rem 0;
    color: var(--color-text-secondary);
  }
</style>
```

### **Example 5: With Rate Limiting**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let requestCount = $state(0);
  let lastRequestTime = $state(0);
  let cooldownRemaining = $state(0);

  // Update cooldown timer
  $effect(() => {
    if (cooldownRemaining > 0) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - lastRequestTime;
        const remaining = Math.max(0, 60000 - elapsed); // 1 minute cooldown
        cooldownRemaining = Math.ceil(remaining / 1000);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  });

  async function handlePasswordResetRequest(email) {
    // Check rate limit (max 3 requests per hour)
    if (requestCount >= 3) {
      throw new Error('Too many reset requests. Please try again later.');
    }
    
    // Check cooldown (1 minute between requests)
    const now = Date.now();
    if (now - lastRequestTime < 60000) {
      throw new Error(`Please wait ${cooldownRemaining} seconds before requesting again.`);
    }
    
    const response = await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      requestCount++;
      lastRequestTime = now;
      cooldownRemaining = 60;
      
      // Store in localStorage to persist across page reloads
      localStorage.setItem('reset_request_count', requestCount.toString());
      localStorage.setItem('reset_last_request', now.toString());
    }
  }

  // Load rate limit state from localStorage
  $effect(() => {
    const savedCount = localStorage.getItem('reset_request_count');
    const savedTime = localStorage.getItem('reset_last_request');
    
    if (savedCount) requestCount = parseInt(savedCount);
    if (savedTime) lastRequestTime = parseInt(savedTime);
  });
</script>

<Auth.Root handlers={{ onPasswordResetRequest: handlePasswordResetRequest }}>
  <Auth.PasswordReset mode="request" />
  
  {#if cooldownRemaining > 0}
    <div class="rate-limit-notice">
      Please wait {cooldownRemaining} seconds before requesting another reset email.
    </div>
  {/if}
</Auth.Root>

<style>
  .rate-limit-notice {
    margin-top: 1rem;
    padding: 0.75rem;
    background: var(--color-warning-light);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    text-align: center;
    color: var(--color-warning-dark);
  }
</style>
```

---

## 🔒 Security Considerations

### **Token Generation** (Server-side):

```javascript
// Example server-side token generation
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function generateResetToken(email) {
  // Generate cryptographically secure token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash token for database storage
  const hashedToken = await bcrypt.hash(token, 10);
  
  // Store with expiration (1 hour)
  await db.passwordResets.create({
    email,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000)
  });
  
  return token; // Send this in email
}
```

### **Token Verification** (Server-side):

```javascript
async function verifyResetToken(email, token) {
  // Find reset request
  const resetRequest = await db.passwordResets.findOne({
    email,
    expiresAt: { $gt: new Date() } // Not expired
  });
  
  if (!resetRequest) {
    throw new Error('Invalid or expired reset token');
  }
  
  // Verify token matches
  const isValid = await bcrypt.compare(token, resetRequest.token);
  
  if (!isValid) {
    throw new Error('Invalid reset token');
  }
  
  return true;
}
```

### **Password Reset** (Server-side):

```javascript
async function resetPassword(email, token, newPassword) {
  // Verify token
  await verifyResetToken(email, token);
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update user password
  await db.users.updateOne(
    { email },
    { password: hashedPassword }
  );
  
  // Delete used reset token
  await db.passwordResets.deleteMany({ email });
  
  // Optional: Invalidate all user sessions
  await db.sessions.deleteMany({ userId: user.id });
  
  return true;
}
```

### **Best Practices**:
1. ✅ **Token Expiration**: Limit tokens to 1 hour
2. ✅ **One-Time Use**: Delete token after successful reset
3. ✅ **Rate Limiting**: Max 3-5 requests per hour per email
4. ✅ **Email Verification**: Confirm email exists before sending
5. ✅ **Secure Transport**: Always use HTTPS
6. ✅ **Password Hashing**: Use bcrypt/argon2 with high cost factor
7. ✅ **Session Invalidation**: Log out all devices after reset
8. ✅ **No User Enumeration**: Same response whether email exists or not

---

## 🎨 Styling

The PasswordReset component includes comprehensive built-in styling with CSS custom properties:

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
  
  /* Error */
  --error-color: #f4211e;
  --error-background: rgba(244, 33, 46, 0.1);
  --error-border: rgba(244, 33, 46, 0.3);
}
```

### **Custom Styling Example**:

```svelte
<Auth.PasswordReset mode="request" class="custom-reset" />

<style>
  :global(.custom-reset) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 3rem;
    border-radius: 1rem;
  }

  :global(.custom-reset .auth-reset__title) {
    color: white;
  }

  :global(.custom-reset .auth-reset__description) {
    color: rgba(255, 255, 255, 0.9);
  }

  :global(.custom-reset .auth-reset__input) {
    background: rgba(255, 255, 255, 0.9);
  }
</style>
```

---

## ♿ Accessibility

The PasswordReset component is fully accessible:

### **Features**:
- ✅ **Semantic HTML**: Proper form structure
- ✅ **Labels**: Associated with inputs via `for` attribute
- ✅ **ARIA**: Error messages with `role="alert"`
- ✅ **Keyboard**: Enter key submits form
- ✅ **Focus Management**: Autofocus on first input
- ✅ **Loading States**: Buttons disabled during submission
- ✅ **Error Handling**: Errors announced to screen readers
- ✅ **Success Messages**: Clear confirmation feedback

### **Keyboard Shortcuts**:
- `Tab`: Navigate between fields
- `Shift + Tab`: Navigate backwards
- `Enter`: Submit form
- `Escape`: Clear form (could be added)

---

## 🔒 Validation

### **Request Mode Validation**:
- Email format validation
- Required field check

### **Confirm Mode Validation**:
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - Maximum 128 characters

- **Confirmation**:
  - Must match new password exactly

---

## 🧪 Testing

Test the PasswordReset component with both modes:

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { Auth } from '@equaltoai/greater-components-fediverse';

describe('Auth.PasswordReset', () => {
  describe('Request Mode', () => {
    it('validates email format', async () => {
      const onPasswordResetRequest = vi.fn();
      const { getByLabelText, getByText } = render(Auth.Root, {
        props: {
          handlers: { onPasswordResetRequest },
          children: '<Auth.PasswordReset mode="request" />'
        }
      });

      await fireEvent.input(getByLabelText('Email'), {
        target: { value: 'invalid-email' }
      });
      await fireEvent.click(getByText('Send Reset Instructions'));

      expect(onPasswordResetRequest).not.toHaveBeenCalled();
    });

    it('shows success state after sending', async () => {
      const onPasswordResetRequest = vi.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByText, findByText } = render(Auth.Root, {
        props: {
          handlers: { onPasswordResetRequest },
          children: '<Auth.PasswordReset mode="request" />'
        }
      });

      await fireEvent.input(getByLabelText('Email'), {
        target: { value: 'user@example.com' }
      });
      await fireEvent.click(getByText('Send Reset Instructions'));

      expect(await findByText('Check your email')).toBeInTheDocument();
    });
  });

  describe('Confirm Mode', () => {
    it('validates password strength', async () => {
      const onPasswordResetConfirm = vi.fn();
      const { getByLabelText, getByText } = render(Auth.Root, {
        props: {
          handlers: { onPasswordResetConfirm },
          children: '<Auth.PasswordReset mode="confirm" token="abc123" />'
        }
      });

      await fireEvent.input(getByLabelText('New Password'), {
        target: { value: 'weak' }
      });
      await fireEvent.click(getByText('Reset Password'));

      expect(onPasswordResetConfirm).not.toHaveBeenCalled();
    });

    it('validates password confirmation', async () => {
      const onPasswordResetConfirm = vi.fn();
      const { getByLabelText, getByText, findByText } = render(Auth.Root, {
        props: {
          handlers: { onPasswordResetConfirm },
          children: '<Auth.PasswordReset mode="confirm" token="abc123" />'
        }
      });

      await fireEvent.input(getByLabelText('New Password'), {
        target: { value: 'Password123' }
      });
      await fireEvent.input(getByLabelText('Confirm Password'), {
        target: { value: 'Password456' }
      });
      await fireEvent.click(getByText('Reset Password'));

      expect(await findByText('Passwords do not match')).toBeInTheDocument();
    });
  });
});
```

---

## 🔗 Related Components

- [Auth.Root](./Root.md) - Context provider
- [Auth.LoginForm](./LoginForm.md) - Email/password login
- [Auth.RegisterForm](./RegisterForm.md) - Account registration

---

## 📚 See Also

- [Auth Components Overview](./README.md)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Email Templates](../../patterns/EMAIL_TEMPLATES.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)

