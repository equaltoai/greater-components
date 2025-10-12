# Auth.TwoFactorSetup

**Component**: Two-Factor Authentication Setup (TOTP)  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 51 passing tests

---

## 📋 Overview

`Auth.TwoFactorSetup` provides a complete multi-step interface for enabling TOTP (Time-based One-Time Password) two-factor authentication. It guides users through generating a secret, scanning a QR code with an authenticator app, verifying the setup, and saving backup codes.

###  **Key Features**:
- ✅ Multi-step setup flow (intro → scan → verify → backup codes)
- ✅ QR code generation for authenticator apps
- ✅ Manual secret entry option
- ✅ Verification code validation
- ✅ Backup code generation and display
- ✅ Copy to clipboard functionality
- ✅ Download backup codes
- ✅ Print backup codes
- ✅ Loading states
- ✅ Error handling
- ✅ Fully accessible

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

  async function handleTwoFactorSetup(method) {
    // Generate TOTP secret
    const response = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method })
    });
    
    const { secret, qrCode, backupCodes } = await response.json();
    
    return {
      secret,
      qrCode,
      backupCodes
    };
  }

  async function handleTwoFactorVerify(code) {
    const response = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    if (!response.ok) {
      throw new Error('Invalid verification code');
    }
  }

  function handleComplete(backupCodes) {
    console.log('2FA enabled successfully');
    console.log('Backup codes:', backupCodes);
    // Store backup codes securely or prompt user to save them
  }
</script>

<Auth.Root handlers={{
  onTwoFactorSetup: handleTwoFactorSetup,
  onTwoFactorVerify: handleTwoFactorVerify
}}>
  <Auth.TwoFactorSetup 
    email="user@example.com"
    onComplete={handleComplete}
  />
</Auth.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | `"Enable Two-Factor Authentication"` | No | Custom form title |
| `email` | `string` | - | No | User's email (displayed in QR code) |
| `onComplete` | `(backupCodes: string[]) => void` | - | No | Callback when setup completes |
| `onCancel` | `() => void` | - | No | Callback when setup is cancelled |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 📤 Events

The component uses handlers from `Auth.Root` context:

```typescript
interface TwoFactorData {
  secret: string;       // TOTP secret key
  qrCode?: string;      // QR code data URL (optional)
  backupCodes: string[]; // Backup recovery codes
}

interface AuthHandlers {
  onTwoFactorSetup?: (method: string) => Promise<TwoFactorData>;
  onTwoFactorVerify?: (code: string) => Promise<void>;
}
```

---

## 🎨 Setup Flow

The component has four distinct steps:

### **1. Intro**
- Explanation of two-factor authentication
- Benefits and security information
- "Get Started" button

### **2. Scan**
- QR code display
- Manual secret entry option
- Instructions for authenticator apps
- "Continue" button to verify

### **3. Verify**
- Enter 6-digit verification code
- Real-time validation
- Error handling
- "Verify" button

### **4. Backup Codes**
- Display 10 backup codes
- Copy all codes button
- Download as text file
- Print button
- "Finish" button

---

## 💡 Examples

### **Example 1: Complete 2FA Setup Flow**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let userEmail = 'user@example.com';
  let twoFactorEnabled = $state(false);

  async function handleTwoFactorSetup(method) {
    try {
      //  Generate TOTP secret on server
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ method })
      });
      
      if (!response.ok) {
        throw new Error('Failed to setup 2FA');
      }
      
      const data = await response.json();
      
      return {
        secret: data.secret,
        qrCode: data.qrCodeDataUrl, // Base64 QR code image
        backupCodes: data.backupCodes
      };
    } catch (error) {
      console.error('2FA setup error:', error);
      throw error;
    }
  }

  async function handleTwoFactorVerify(code) {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid verification code');
      }
      
      // Code is valid, 2FA will be enabled after backup codes are shown
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  }

  function handleComplete(backupCodes) {
    twoFactorEnabled = true;
    
    // Optionally download backup codes automatically
    downloadBackupCodes(backupCodes);
    
    // Show success message
    alert('Two-factor authentication has been enabled!');
    
    // Redirect to security settings
    window.location.href = '/settings/security';
  }

  function downloadBackupCodes(codes) {
    const content = [
      'Two-Factor Authentication Backup Codes',
      '=' .repeat(40),
      'Save these codes in a safe place.',
      'Each code can only be used once.',
      '',
      ...codes.map((code, i) => `${i + 1}. ${code}`),
      '',
      `Generated: ${new Date().toLocaleString()}`
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCancel() {
    if (confirm('Are you sure you want to cancel 2FA setup?')) {
      window.location.href = '/settings/security';
    }
  }
</script>

<div class="2fa-setup-page">
  <h1>Secure Your Account</h1>
  
  {#if !twoFactorEnabled}
    <Auth.Root handlers={{
      onTwoFactorSetup: handleTwoFactorSetup,
      onTwoFactorVerify: handleTwoFactorVerify
    }}>
      <Auth.TwoFactorSetup 
        email={userEmail}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </Auth.Root>
  {:else}
    <div class="success-message">
      <h2>✓ Two-Factor Authentication Enabled</h2>
      <p>Your account is now protected with 2FA.</p>
      <a href="/settings/security">Return to Security Settings</a>
    </div>
  {/if}
</div>

<style>
  .2fa-setup-page {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .success-message {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--color-success-light);
    border-radius: var(--radius-lg);
  }

  .success-message h2 {
    margin: 0 0 1rem 0;
    color: var(--color-success);
  }

  .success-message p {
    margin: 0 0 1.5rem 0;
  }

  .success-message a {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
  }
</style>
```

### **Example 2: With Server-Side QR Code Generation**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  async function handleTwoFactorSetup(method) {
    // Server generates QR code as data URL
    const response = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        method,
        label: 'user@example.com',
        issuer: 'My App'
      })
    });
    
    const data = await response.json();
    
    // Server response includes:
    // {
    //   secret: 'BASE32ENCODEDSECRET',
    //   qrCodeDataUrl: 'data:image/png;base64,...',
    //   backupCodes: ['code1', 'code2', ...]
    // }
    
    return data;
  }
</script>
```

**Server-side QR code generation** (Node.js example):

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

app.post('/api/auth/2fa/setup', async (req, res) => {
  const userId = req.user.id;
  const { method, label, issuer } = req.body;
  
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `${issuer}:${label}`,
    issuer: issuer
  });
  
  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);
  
  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () => 
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );
  
  // Store secret and backup codes (hashed) in database
  await db.users.updateOne(
    { id: userId },
    {
      $set: {
        twoFactorSecret: secret.base32,
        twoFactorBackupCodes: await Promise.all(
          backupCodes.map(code => bcrypt.hash(code, 10))
        ),
        twoFactorEnabled: false // Will be enabled after verification
      }
    }
  );
  
  res.json({
    secret: secret.base32,
    qrCodeDataUrl,
    backupCodes
  });
});
```

### **Example 3: With Email Notification**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  async function handleTwoFactorSetup(method) {
    const response = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ method })
    });
    
    return await response.json();
  }

  async function handleTwoFactorVerify(code) {
    const response = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ code })
    });
    
    if (response.ok) {
      // Send confirmation email
      await fetch('/api/auth/2fa/notify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
    } else {
      throw new Error('Invalid verification code');
    }
  }

  function handleComplete(backupCodes) {
    alert('Two-factor authentication enabled! Check your email for confirmation.');
  }
</script>
```

**Email notification** (server-side):

```javascript
app.post('/api/auth/2fa/notify', async (req, res) => {
  const user = req.user;
  
  await sendEmail({
    to: user.email,
    subject: 'Two-Factor Authentication Enabled',
    html: `
      <h2>Two-Factor Authentication Enabled</h2>
      <p>Two-factor authentication has been enabled for your account.</p>
      <p><strong>When:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>IP Address:</strong> ${req.ip}</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `
  });
  
  res.json({ success: true });
});
```

### **Example 4: With Recovery Options**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let backupCodesStored = $state(false);

  function handleComplete(backupCodes) {
    // Show modal to ensure user saves backup codes
    showBackupCodesModal(backupCodes);
  }

  function showBackupCodesModal(codes) {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-content">
          <h3>Save Your Backup Codes</h3>
          <p><strong>Important:</strong> You'll need these codes if you lose access to your authenticator app.</p>
          
          <div class="backup-codes-list">
            ${codes.map((code, i) => `<div>${i + 1}. ${code}</div>`).join('')}
          </div>
          
          <div class="actions">
            <button onclick="downloadCodes()">Download</button>
            <button onclick="printCodes()">Print</button>
            <button onclick="confirmSaved()" class="primary">I've Saved These</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  function confirmSaved() {
    if (confirm('Have you saved your backup codes in a safe place?')) {
      backupCodesStored = true;
      // Proceed
    }
  }
</script>
```

### **Example 5: With Multi-Device Setup**

```svelte
<script lang="ts">
  import { Auth } from '@greater/fediverse';
  
  let setupDevices = $state([]);
  let currentDevice = $state(null);

  async function handleTwoFactorSetup(method) {
    const response = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        method,
        deviceName: getDeviceName() // e.g., "Chrome on MacOS"
      })
    });
    
    const data = await response.json();
    
    // Track which device is being set up
    currentDevice = {
      name: getDeviceName(),
      setupAt: new Date()
    };
    
    return data;
  }

  function getDeviceName() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';
    
    // Detect browser
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    
    // Detect OS
    if (ua.indexOf('Mac') > -1) os = 'MacOS';
    else if (ua.indexOf('Windows') > -1) os = 'Windows';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    
    return `${browser} on ${os}`;
  }

  function handleComplete(backupCodes) {
    setupDevices = [...setupDevices, currentDevice];
    
    // Allow setting up additional devices
    if (confirm('Would you like to set up 2FA on another device?')) {
      // Reset for another setup
      currentDevice = null;
    } else {
      window.location.href = '/settings/security';
    }
  }
</script>

<Auth.Root handlers={{
  onTwoFactorSetup: handleTwoFactorSetup,
  onTwoFactorVerify: handleTwoFactorVerify
}}>
  <div class="multi-device-setup">
    {#if setupDevices.length > 0}
      <div class="devices-list">
        <h3>Devices with 2FA:</h3>
        <ul>
          {#each setupDevices as device}
            <li>{device.name} - {device.setupAt.toLocaleString()}</li>
          {/each}
        </ul>
      </div>
    {/if}
    
    <Auth.TwoFactorSetup 
      email={userEmail}
      onComplete={handleComplete}
    />
  </div>
</Auth.Root>
```

---

## 🔒 Security Considerations

### **Secret Generation** (Server-side):

```javascript
const speakeasy = require('speakeasy');

// Generate TOTP secret
const secret = speakeasy.generateSecret({
  length: 32, // 256-bit secret
  name: `YourApp:${userEmail}`,
  issuer: 'YourApp'
});

// Store ONLY the base32 secret
await db.users.updateOne(
  { id: userId },
  { $set: { twoFactorSecret: secret.base32 } }
);
```

### **Code Verification**:

```javascript
const speakeasy = require('speakeasy');

app.post('/api/auth/2fa/verify', async (req, res) => {
  const { code } = req.body;
  const user = await db.users.findOne({ id: req.user.id });
  
  // Verify TOTP code
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: code,
    window: 1 // Allow 1 time step before/after for clock skew
  });
  
  if (verified) {
    // Enable 2FA
    await db.users.updateOne(
      { id: user.id },
      { $set: { twoFactorEnabled: true } }
    );
    
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid code' });
  }
});
```

### **Best Practices**:
1. ✅ **Secret Storage**: Store secrets encrypted at rest
2. ✅ **Backup Codes**: Hash backup codes like passwords
3. ✅ **Rate Limiting**: Limit verification attempts (3-5 per minute)
4. ✅ **Clock Skew**: Allow 1-2 time windows for verification
5. ✅ **Recovery**: Always provide backup codes
6. ✅ **Notification**: Email user when 2FA is enabled/disabled
7. ✅ **Audit Logging**: Log all 2FA setup attempts

---

## 🎨 Styling

The TwoFactorSetup component includes comprehensive built-in styling. Custom CSS properties available for theming.

---

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels and descriptions
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Error messages with `role="alert"`

---

## 🧪 Testing

51 passing tests covering:
- All setup steps
- QR code generation
- Secret display
- Code verification
- Backup code generation
- Copy/download/print functionality
- Error handling
- Cancellation

---

## 🔗 Related Components

- [Auth.Root](./Root.md)
- [Auth.TwoFactorVerify](./TwoFactorVerify.md)
- [Auth.BackupCodes](./BackupCodes.md)

---

## 📚 See Also

- [Auth Overview](./README.md)
- [TOTP Specification (RFC 6238)](https://tools.ietf.org/html/rfc6238)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)

