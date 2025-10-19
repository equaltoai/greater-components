# Auth.WalletConnect

**Component**: Cryptocurrency Wallet Authentication  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 73 passing tests

---

## 📋 Overview

`Auth.WalletConnect` provides cryptocurrency wallet authentication for decentralized identity. It supports MetaMask, WalletConnect, Coinbase Wallet, and other Web3 providers, enabling passwordless authentication using blockchain signatures.

### **Key Features**:
- ✅ Multi-wallet support (MetaMask, WalletConnect, Coinbase, etc.)
- ✅ Automatic wallet detection
- ✅ Multi-chain support (Ethereum, Polygon, Base, etc.)
- ✅ Network switching
- ✅ Message signing for authentication
- ✅ Address display with formatting
- ✅ Connection state management
- ✅ Error handling
- ✅ Disconnect functionality

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

  async function handleWalletConnect({ address, chainId, provider, signature }) {
    const response = await fetch('/api/auth/wallet/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        chainId,
        provider,
        signature
      })
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      window.location.href = '/';
    }
  }

  async function handleWalletDisconnect() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
</script>

<Auth.Root handlers={{
  onWalletConnect: handleWalletConnect,
  onWalletDisconnect: handleWalletDisconnect
}}>
  <Auth.WalletConnect />
</Auth.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onConnect` | `(data: WalletConnectionData) => Promise<void>` | - | Callback when wallet connects |
| `onDisconnect` | `() => Promise<void>` | - | Callback when wallet disconnects |
| `supportedChains` | `number[]` | `[1]` | Supported blockchain chain IDs |
| `signMessage` | `string` | `"Sign this message to authenticate with Lesser"` | Authentication message to sign |
| `showAdvanced` | `boolean` | `false` | Show advanced options (network switching) |

---

## 📤 Events

```typescript
interface WalletConnectionData {
  address: string;      // Wallet address (0x...)
  chainId: number;      // Blockchain network ID
  provider: string;     // Wallet provider name
  signature: string;    // Signed authentication message
}

interface AuthHandlers {
  onWalletConnect?: (data: WalletConnectionData) => Promise<void>;
  onWalletDisconnect?: () => Promise<void>;
}
```

---

## 🌐 Supported Wallets

| Wallet | Provider | Detection |
|--------|----------|-----------|
| MetaMask | `metamask` | `window.ethereum?.isMetaMask` |
| Coinbase Wallet | `coinbase` | `window.ethereum?.isCoinbaseWallet` |
| WalletConnect | `walletconnect` | Always available |
| Rainbow | `rainbow` | `window.ethereum?.isRainbow` |
| Trust Wallet | `trust` | `window.ethereum?.isTrust` |
| Phantom | `phantom` | `window.solana?.isPhantom` |

---

## 🔗 Supported Chains

| Chain | ID | Name |
|-------|-----|------|
| Ethereum Mainnet | 1 | Ethereum |
| Polygon | 137 | Polygon |
| Base | 8453 | Base |
| Arbitrum | 42161 | Arbitrum |
| Optimism | 10 | Optimism |
| BSC | 56 | Binance Smart Chain |

---

## 💡 Examples

### **Example 1: Basic Wallet Authentication**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let authenticated = $state(false);

  async function handleWalletConnect({ address, signature }) {
    try {
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature })
      });
      
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        authenticated = true;
      }
    } catch (error) {
      console.error('Wallet authentication failed:', error);
    }
  }
</script>

{#if !authenticated}
  <div class="login-page">
    <h1>Sign in with your wallet</h1>
    <Auth.Root handlers={{ onWalletConnect: handleWalletConnect }}>
      <Auth.WalletConnect />
    </Auth.Root>
  </div>
{:else}
  <div class="dashboard">
    <h1>Welcome!</h1>
    <p>You're signed in with your wallet.</p>
  </div>
{/if}
```

### **Example 2: Multi-Chain Support**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  // Support multiple chains
  const supportedChains = [
    1,      // Ethereum
    137,    // Polygon
    8453,   // Base
    42161,  // Arbitrum
    10      // Optimism
  ];

  async function handleWalletConnect({ address, chainId, provider, signature }) {
    console.log(`Connected to ${provider} on chain ${chainId}`);
    
    // Verify signature on server
    const response = await fetch('/api/auth/wallet/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        chainId,
        provider,
        signature,
        message: 'Sign this message to authenticate with Lesser'
      })
    });
    
    if (response.ok) {
      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('wallet_address', address);
      window.location.href = '/dashboard';
    }
  }
</script>

<Auth.Root handlers={{ onWalletConnect: handleWalletConnect }}>
  <Auth.WalletConnect 
    {supportedChains}
    showAdvanced={true}
  />
</Auth.Root>
```

### **Example 3: Wallet + Email Registration**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let authMethod = $state<'wallet' | 'email'>('wallet');
  let walletAddress = $state<string | null>(null);
  let registrationStep = $state<'connect' | 'details' | 'complete'>('connect');

  async function handleWalletConnect({ address, signature }) {
    // Verify wallet ownership
    const response = await fetch('/api/auth/wallet/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature })
    });
    
    if (response.ok) {
      walletAddress = address;
      
      // Check if wallet is already registered
      const checkResponse = await fetch(`/api/users/by-wallet/${address}`);
      
      if (checkResponse.ok) {
        // Wallet already registered, log in
        const { token } = await checkResponse.json();
        localStorage.setItem('token', token);
        window.location.href = '/';
      } else {
        // New wallet, continue registration
        registrationStep = 'details';
      }
    }
  }

  async function completeRegistration(username: string, email?: string) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        username,
        email // Optional
      })
    });
    
    if (response.ok) {
      registrationStep = 'complete';
      const { token } = await response.json();
      localStorage.setItem('token', token);
    }
  }
</script>

<div class="auth-page">
  <h1>Create Account</h1>
  
  <div class="auth-methods">
    <button 
      onclick={() => authMethod = 'wallet'}
      class:active={authMethod === 'wallet'}
    >
      Wallet
    </button>
    <button 
      onclick={() => authMethod = 'email'}
      class:active={authMethod === 'email'}
    >
      Email
    </button>
  </div>
  
  {#if authMethod === 'wallet'}
    {#if registrationStep === 'connect'}
      <Auth.Root handlers={{ onWalletConnect: handleWalletConnect }}>
        <Auth.WalletConnect />
      </Auth.Root>
    
    {:else if registrationStep === 'details'}
      <form onsubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        completeRegistration(
          data.get('username'),
          data.get('email')
        );
      }}>
        <h2>Complete Your Profile</h2>
        <p>Wallet: {walletAddress}</p>
        
        <label>
          Username *
          <input name="username" required />
        </label>
        
        <label>
          Email (optional)
          <input name="email" type="email" />
        </label>
        
        <button type="submit">Create Account</button>
      </form>
    
    {:else if registrationStep === 'complete'}
      <div class="success">
        <h2>Welcome!</h2>
        <p>Your account has been created.</p>
        <a href="/">Go to Dashboard</a>
      </div>
    {/if}
  
  {:else}
    <Auth.Root>
      <Auth.RegisterForm />
    </Auth.Root>
  {/if}
</div>
```

### **Example 4: Wallet Management in Settings**

```svelte
<script lang="ts">
  import { Auth } from '@equaltoai/greater-components-fediverse';
  
  let connectedWallets = $state<string[]>([]);
  let showAddWallet = $state(false);

  $effect(() => {
    // Load connected wallets
    fetch('/api/user/wallets')
      .then(r => r.json())
      .then(data => {
        connectedWallets = data.wallets;
      });
  });

  async function handleWalletConnect({ address, signature }) {
    // Add new wallet to account
    await fetch('/api/user/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature })
    });
    
    connectedWallets = [...connectedWallets, address];
    showAddWallet = false;
  }

  async function removeWallet(address: string) {
    if (connectedWallets.length === 1) {
      alert('You must keep at least one authentication method');
      return;
    }
    
    await fetch(`/api/user/wallets/${address}`, {
      method: 'DELETE'
    });
    
    connectedWallets = connectedWallets.filter(w => w !== address);
  }
</script>

<div class="wallet-settings">
  <h2>Connected Wallets</h2>
  
  {#if connectedWallets.length > 0}
    <ul class="wallet-list">
      {#each connectedWallets as address}
        <li>
          <span class="address">{address.slice(0, 6)}...{address.slice(-4)}</span>
          <button onclick={() => removeWallet(address)} class="remove-btn">
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  
  {#if !showAddWallet}
    <button onclick={() => showAddWallet = true} class="add-btn">
      + Add Wallet
    </button>
  {:else}
    <div class="add-wallet">
      <Auth.Root handlers={{ onWalletConnect: handleWalletConnect }}>
        <Auth.WalletConnect />
      </Auth.Root>
      <button onclick={() => showAddWallet = false}>Cancel</button>
    </div>
  {/if}
</div>

<style>
  .wallet-settings {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
  }

  .wallet-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }

  .wallet-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--color-surface);
    border-radius: var(--radius-md);
    margin-bottom: 0.5rem;
  }

  .address {
    font-family: monospace;
    font-size: 0.875rem;
  }

  .remove-btn {
    padding: 0.5rem 1rem;
    background: var(--color-danger);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .add-btn {
    padding: 0.75rem 1.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  .add-wallet {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
  }
</style>
```

---

## 🔒 Security Considerations

### **Message Signing**:
```javascript
// Server-side verification
const { recoverPersonalSignature } = require('@metamask/eth-sig-util');

function verifySignature(address, signature, message) {
  const recoveredAddress = recoverPersonalSignature({
    data: message,
    signature: signature
  });
  
  return recoveredAddress.toLowerCase() === address.toLowerCase();
}
```

### **Best Practices**:
1. ✅ Always verify signatures server-side
2. ✅ Include timestamp in signed message to prevent replay attacks
3. ✅ Store only wallet addresses, never private keys
4. ✅ Use HTTPS in production
5. ✅ Implement rate limiting
6. ✅ Validate chain ID matches expected network

---

## ♿ Accessibility

- ✅ Keyboard navigation for wallet selection
- ✅ ARIA labels on buttons
- ✅ Error messages announced to screen readers
- ✅ Focus management
- ✅ Loading states communicated

---

## 🧪 Testing

73 passing tests covering:
- Wallet detection
- Connection flow
- Address formatting
- Network switching
- Message signing
- Error handling
- Disconnection
- Multi-wallet support

---

## 🔗 Related Components

- [Auth.Root](./Root.md)
- [Auth.WebAuthnSetup](./WebAuthnSetup.md)
- [Auth.LoginForm](./LoginForm.md)

---

## 📚 See Also

- [Auth Overview](./README.md)
- [Web3 Authentication](../../patterns/WEB3_AUTH.md)
- [Security Best Practices](../../patterns/SECURITY.md)
- [Lesser Integration](../../integration/LESSER_INTEGRATION_GUIDE.md)

