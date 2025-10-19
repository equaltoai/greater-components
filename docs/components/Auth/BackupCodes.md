# Auth.BackupCodes

**Component**: Backup Recovery Codes Management  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 59 passing tests

---

## 📋 Overview

`Auth.BackupCodes` displays and manages 2FA backup recovery codes that provide alternative account access when primary authentication methods are unavailable. It provides comprehensive tools for viewing, copying, downloading, printing, and regenerating backup codes.

### **Key Features**:
- ✅ Secure code display with formatting
- ✅ Copy all codes to clipboard
- ✅ Download codes as text file
- ✅ Print codes for offline storage
- ✅ Regenerate codes with confirmation
- ✅ Visual confirmation tracking
- ✅ Setup mode vs. management mode
- ✅ Warning messages and security notices
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

  let backupCodes = [
    'A1B2C3D4E5F6',
    'G7H8I9J0K1L2',
    'M3N4O5P6Q7R8',
    'S9T0U1V2W3X4',
    'Y5Z6A7B8C9D0',
    'E1F2G3H4I5J6',
    'K7L8M9N0O1P2',
    'Q3R4S5T6U7V8',
    'W9X0Y1Z2A3B4',
    'C5D6E7F8G9H0'
  ];

  async function handleRegenerate() {
    const response = await fetch('/api/auth/2fa/backup-codes/regenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const { codes } = await response.json();
    backupCodes = codes;
  }

  function handleConfirmed() {
    console.log('User confirmed they saved the codes');
    // Proceed with next step or navigate away
  }
</script>

<Auth.Root>
  <Auth.BackupCodes 
    {backupCodes}
    onRegenerate={handleRegenerate}
    onConfirmed={handleConfirmed}
    isSetup={true}
  />
</Auth.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `codes` | `string[]` | `[]` | **Yes** | Array of backup recovery codes |
| `onRegenerate` | `() => Promise<string[]>` | - | No | Callback to regenerate codes |
| `onConfirmed` | `() => void` | - | No | Callback when user confirms codes saved |
| `isSetup` | `boolean` | `false` | No | Whether in initial setup mode |

---

## 📤 Events

The component uses handlers from `Auth.Root` context:

```typescript
interface AuthHandlers {
  onRegenerateBackupCodes?: () => Promise<string[]>;
}
```

---

## 💡 Examples

### **Example 1: During 2FA Setup**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let backupCodes = $state([]);
  let step = $state<'setup' | 'codes' | 'complete'>('setup');

  async function handleTwoFactorSetup(method) {
    const response = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ method })
    });
    
    const data = await response.json();
    
    // Store codes for display
    backupCodes = data.backupCodes;
    
    return data;
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
      // Verification successful, show backup codes
      step = 'codes';
    } else {
      throw new Error('Invalid code');
    }
  }

  function handleConfirmed() {
    step = 'complete';
    
    // Enable 2FA on server
    fetch('/api/auth/2fa/enable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    // Navigate to security settings
    setTimeout(() => {
      window.location.href = '/settings/security';
    }, 2000);
  }
</script>

<div class="2fa-setup-flow">
  {#if step === 'setup'}
    <Auth.Root handlers={{
      onTwoFactorSetup: handleTwoFactorSetup,
      onTwoFactorVerify: handleTwoFactorVerify
    }}>
      <Auth.TwoFactorSetup 
        email="user@example.com"
        onComplete={() => step = 'codes'}
      />
    </Auth.Root>
  {:else if step === 'codes'}
    <Auth.Root>
      <Auth.BackupCodes 
        codes={backupCodes}
        onConfirmed={handleConfirmed}
        isSetup={true}
      />
    </Auth.Root>
  {:else}
    <div class="success-message">
      <h2>✓ Two-Factor Authentication Enabled</h2>
      <p>Your account is now protected with 2FA.</p>
      <p>Redirecting to security settings...</p>
    </div>
  {/if}
</div>

<style>
  .2fa-setup-flow {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
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
    margin: 0.5rem 0;
  }
</style>
```

### **Example 2: In Security Settings (Management Mode)**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let backupCodes = $state([]);
  let loading = $state(true);

  $effect(() => {
    // Load current backup codes
    fetch('/api/auth/2fa/backup-codes', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(r => r.json())
      .then(data => {
        backupCodes = data.codes;
        loading = false;
      });
  });

  async function handleRegenerate() {
    const response = await fetch('/api/auth/2fa/backup-codes/regenerate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const { codes } = await response.json();
    
    // Send notification email
    await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        type: 'backup_codes_regenerated',
        message: 'Your 2FA backup codes have been regenerated.'
      })
    });
    
    return codes;
  }
</script>

<div class="security-settings">
  <h1>Security Settings</h1>
  
  <section class="settings-section">
    <h2>Two-Factor Authentication</h2>
    <p>Your account is protected with 2FA.</p>
    
    {#if loading}
      <div class="loading">Loading backup codes...</div>
    {:else}
      <Auth.Root handlers={{
        onRegenerateBackupCodes: handleRegenerate
      }}>
        <Auth.BackupCodes 
          codes={backupCodes}
          isSetup={false}
        />
      </Auth.Root>
    {/if}
  </section>
</div>

<style>
  .security-settings {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .settings-section {
    margin: 2rem 0;
    padding: 2rem;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
  }

  .loading {
    padding: 2rem;
    text-align: center;
    color: var(--color-text-secondary);
  }
</style>
```

### **Example 3: With Usage Tracking**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let backupCodes = $state([
    { code: 'A1B2C3D4E5F6', used: false },
    { code: 'G7H8I9J0K1L2', used: true },
    { code: 'M3N4O5P6Q7R8', used: false },
    { code: 'S9T0U1V2W3X4', used: false },
    { code: 'Y5Z6A7B8C9D0', used: true },
    { code: 'E1F2G3H4I5J6', used: false },
    { code: 'K7L8M9N0O1P2', used: false },
    { code: 'Q3R4S5T6U7V8', used: false },
    { code: 'W9X0Y1Z2A3B4', used: false },
    { code: 'C5D6E7F8G9H0', used: false }
  ]);

  let codesRemaining = $derived(backupCodes.filter(c => !c.used).length);
  
  async function handleRegenerate() {
    const response = await fetch('/api/auth/2fa/backup-codes/regenerate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const { codes } = await response.json();
    
    // Reset all codes to unused
    backupCodes = codes.map(code => ({ code, used: false }));
    
    return codes.map(c => c.code);
  }
</script>

<Auth.Root>
  <div class="codes-status">
    <div class="status-badge" class:warning={codesRemaining <= 3}>
      {codesRemaining} / {backupCodes.length} codes remaining
    </div>
    
    {#if codesRemaining <= 3}
      <div class="status-warning">
        ⚠️ Running low on backup codes. Consider regenerating them.
      </div>
    {/if}
  </div>
  
  <Auth.BackupCodes 
    codes={backupCodes.map(c => c.code)}
    onRegenerate={handleRegenerate}
  />
  
  <div class="codes-detail">
    <h3>Code Usage History</h3>
    <ul>
      {#each backupCodes as { code, used }, index}
        <li class:used>
          Code {index + 1}: {used ? '✓ Used' : '○ Available'}
        </li>
      {/each}
    </ul>
  </div>
</Auth.Root>

<style>
  .codes-status {
    max-width: 600px;
    margin: 0 auto 2rem;
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: var(--color-success-light);
    border: 1px solid var(--color-success);
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  .status-badge.warning {
    background: var(--color-warning-light);
    border-color: var(--color-warning);
  }

  .status-warning {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--color-warning-light);
    border: 1px solid var(--color-warning);
    border-radius: var(--radius-md);
  }

  .codes-detail {
    max-width: 600px;
    margin: 2rem auto 0;
    padding: 1.5rem;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
  }

  .codes-detail h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
  }

  .codes-detail ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .codes-detail li {
    padding: 0.5rem 0;
    color: var(--color-text-secondary);
  }

  .codes-detail li.used {
    text-decoration: line-through;
    opacity: 0.6;
  }
</style>
```

### **Example 4: With Encrypted Storage**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let backupCodes = $state([]);
  let encryptionPassword = $state('');
  let showEncryptedDownload = $state(false);

  async function handleDownloadEncrypted() {
    if (!encryptionPassword) {
      alert('Please enter an encryption password');
      return;
    }
    
    try {
      // Encrypt codes with user's password
      const encrypted = await encryptCodes(backupCodes, encryptionPassword);
      
      // Download encrypted file
      const blob = new Blob([JSON.stringify(encrypted)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-codes-encrypted-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showEncryptedDownload = false;
      encryptionPassword = '';
    } catch (error) {
      alert('Failed to encrypt codes: ' + error.message);
    }
  }

  async function encryptCodes(codes, password) {
    // Use Web Crypto API for encryption
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(codes));
    
    // Derive key from password
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    // Encrypt data
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv),
      salt: Array.from(salt)
    };
  }
</script>

<Auth.Root>
  <Auth.BackupCodes codes={backupCodes} />
  
  <div class="encrypted-download">
    <button onclick={() => showEncryptedDownload = !showEncryptedDownload}>
      🔐 Download Encrypted Copy
    </button>
    
    {#if showEncryptedDownload}
      <div class="encryption-form">
        <h3>Encrypt Backup Codes</h3>
        <p>Enter a password to encrypt your backup codes before downloading.</p>
        
        <input
          type="password"
          bind:value={encryptionPassword}
          placeholder="Encryption password"
          minlength="8"
        />
        
        <div class="encryption-actions">
          <button onclick={handleDownloadEncrypted}>
            Download Encrypted
          </button>
          <button onclick={() => showEncryptedDownload = false}>
            Cancel
          </button>
        </div>
      </div>
    {/if}
  </div>
</Auth.Root>

<style>
  .encrypted-download {
    max-width: 600px;
    margin: 2rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  .encrypted-download > button {
    padding: 0.75rem 1.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  .encryption-form {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-align: left;
  }

  .encryption-form h3 {
    margin: 0 0 0.5rem 0;
  }

  .encryption-form p {
    margin: 0 0 1.5rem 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .encryption-form input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .encryption-actions {
    display: flex;
    gap: 0.75rem;
  }

  .encryption-actions button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  .encryption-actions button:first-child {
    background: var(--color-success);
    color: white;
  }

  .encryption-actions button:last-child {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }
</style>
```

### **Example 5: With QR Code Storage**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  import QRCode from 'qrcode';
  
  let backupCodes = $state([]);
  let qrCodeDataUrl = $state('');
  let showQRCode = $state(false);

  async function handleGenerateQRCode() {
    try {
      // Generate QR code containing all backup codes
      const data = JSON.stringify({
        type: '2fa_backup_codes',
        codes: backupCodes,
        generated: new Date().toISOString()
      });
      
      const url = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        width: 300
      });
      
      qrCodeDataUrl = url;
      showQRCode = true;
    } catch (error) {
      alert('Failed to generate QR code: ' + error.message);
    }
  }

  function handlePrintQRCode() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Backup Codes QR Code</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 40px;
            font-family: sans-serif;
          }
          h1 { margin-bottom: 20px; }
          img { margin: 20px 0; }
          p { text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <h1>🔐 2FA Backup Codes</h1>
        <img src="${qrCodeDataUrl}" alt="Backup codes QR code" />
        <p>Scan this QR code to restore your backup codes</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
</script>

<Auth.Root>
  <Auth.BackupCodes codes={backupCodes} />
  
  <div class="qr-code-section">
    <button onclick={handleGenerateQRCode}>
      Generate QR Code
    </button>
    
    {#if showQRCode}
      <div class="qr-code-display">
        <h3>Backup Codes QR Code</h3>
        <p>Scan this QR code with a secure device to store your backup codes.</p>
        
        <img src={qrCodeDataUrl} alt="Backup codes QR code" />
        
        <div class="qr-actions">
          <button onclick={handlePrintQRCode}>
            Print QR Code
          </button>
          <button onclick={() => showQRCode = false}>
            Close
          </button>
        </div>
      </div>
    {/if}
  </div>
</Auth.Root>

<style>
  .qr-code-section {
    max-width: 600px;
    margin: 2rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  .qr-code-display {
    margin-top: 1.5rem;
    padding: 2rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .qr-code-display h3 {
    margin: 0 0 0.5rem 0;
  }

  .qr-code-display p {
    margin: 0 0 1.5rem 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .qr-code-display img {
    display: block;
    margin: 0 auto 1.5rem;
    border: 4px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .qr-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .qr-actions button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  .qr-actions button:first-child {
    background: var(--color-primary);
    color: white;
  }

  .qr-actions button:last-child {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }
</style>
```

---

## 🔒 Security Considerations

### **Server-Side Code Generation**:

```javascript
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function generateBackupCodes() {
  const codes = [];
  
  for (let i = 0; i < 10; i++) {
    // Generate 12-character alphanumeric code
    const code = crypto.randomBytes(6)
      .toString('hex')
      .toUpperCase();
    codes.push(code);
  }
  
  return codes;
}

app.post('/api/auth/2fa/backup-codes/regenerate', async (req, res) => {
  const userId = req.user.id;
  
  // Generate new codes
  const codes = await generateBackupCodes();
  
  // Hash codes before storing
  const hashedCodes = await Promise.all(
    codes.map(code => bcrypt.hash(code, 10))
  );
  
  // Store hashed codes
  await db.users.updateOne(
    { id: userId },
    {
      $set: {
        twoFactorBackupCodes: hashedCodes,
        backupCodesGeneratedAt: new Date()
      }
    }
  );
  
  // Log regeneration
  await db.auditLog.create({
    userId,
    action: 'backup_codes_regenerated',
    ip: req.ip,
    timestamp: new Date()
  });
  
  // Send notification email
  await sendEmail({
    to: req.user.email,
    subject: 'Backup Codes Regenerated',
    html: `
      <p>Your 2FA backup codes have been regenerated.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `
  });
  
  // Return plain codes (only time they're exposed)
  res.json({ codes });
});
```

### **Best Practices**:
1. ✅ **Storage**: Hash backup codes like passwords (bcrypt)
2. ✅ **Generation**: Use cryptographically secure random generation
3. ✅ **One-Time Use**: Remove codes after use
4. ✅ **Regeneration**: Allow users to regenerate all codes
5. ✅ **Notification**: Email user when codes are regenerated
6. ✅ **Audit Logging**: Log all backup code operations
7. ✅ **Download Security**: Encourage encrypted storage

---

## 🎨 Styling

The BackupCodes component includes comprehensive built-in styling. Custom CSS properties available for theming.

---

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles (`role="list"`, `role="listitem"`, `role="dialog"`)
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ Error messages with `role="alert"`

---

## 🧪 Testing

59 passing tests covering:
- Code display and formatting
- Copy functionality
- Download functionality
- Print functionality
- Regeneration flow
- Confirmation tracking
- Setup vs. management modes
- Error handling

---

## 🔗 Related Components

- [Auth.Root](./Root.md)
- [Auth.TwoFactorSetup](./TwoFactorSetup.md)
- [Auth.TwoFactorVerify](./TwoFactorVerify.md)

---

## 📚 See Also

- [Auth Overview](./README.md)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)

