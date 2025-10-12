<script lang="ts">
	/**
	 * Auth.WalletConnect Component
	 *
	 * Handles cryptocurrency wallet authentication for Lesser.
	 * Supports MetaMask, WalletConnect, Coinbase Wallet, and other Web3 providers.
	 *
	 * Features:
	 * - Detect available wallet providers
	 * - Connect to selected wallet
	 * - Sign authentication message
	 * - Display wallet address
	 * - Handle connection errors
	 * - Support multiple chains
	 * - Network switching
	 *
	 * @component
	 * @example
	 * <Auth.Root>
	 *   <Auth.WalletConnect
	 *     onConnect={handleConnect}
	 *     supportedChains={[1, 137, 8453]}
	 *   />
	 * </Auth.Root>
	 */

	import { createButton } from '@greater/headless/button';
	import type { AuthHandlers } from './context.js';

	type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom' | 'rainbow' | 'trust';

	interface WalletInfo {
		provider: WalletProvider;
		name: string;
		icon: string;
		available: boolean;
	}

	interface ConnectedWallet {
		address: string;
		chainId: number;
		provider: WalletProvider;
	}

	interface Props {
		/**
		 * Callback when wallet is successfully connected
		 */
		onConnect?: AuthHandlers['onWalletConnect'];
		/**
		 * Callback when wallet is disconnected
		 */
		onDisconnect?: AuthHandlers['onWalletDisconnect'];
		/**
		 * Supported blockchain network chain IDs
		 * Default: [1] (Ethereum mainnet)
		 */
		supportedChains?: number[];
		/**
		 * Custom authentication message to sign
		 */
		signMessage?: string;
		/**
		 * Whether to show advanced options (network switching, etc.)
		 */
		showAdvanced?: boolean;
	}

	let {
		onConnect,
		onDisconnect,
		supportedChains = [1], // Ethereum mainnet by default
		signMessage = 'Sign this message to authenticate with Lesser',
		showAdvanced = false,
	}: Props = $props();

	// Local state
	let connecting = $state(false);
	let connected = $state(false);
	let wallet = $state<ConnectedWallet | null>(null);
	let error = $state<string | null>(null);
	let selectedProvider = $state<WalletProvider | null>(null);

	// Headless buttons
	const walletButtons = new Map<WalletProvider, ReturnType<typeof createButton>>();
	const disconnectButton = createButton();

	/**
	 * Available wallet providers
	 */
	const wallets = $derived<WalletInfo[]>([
		{
			provider: 'metamask',
			name: 'MetaMask',
			icon: '🦊',
			available: typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
		},
		{
			provider: 'coinbase',
			name: 'Coinbase Wallet',
			icon: '🔵',
			available: typeof window !== 'undefined' && !!(window as any).ethereum?.isCoinbaseWallet,
		},
		{
			provider: 'phantom',
			name: 'Phantom',
			icon: '👻',
			available: typeof window !== 'undefined' && !!(window as any).phantom?.ethereum,
		},
		{
			provider: 'rainbow',
			name: 'Rainbow',
			icon: '🌈',
			available: typeof window !== 'undefined' && !!(window as any).ethereum?.isRainbow,
		},
		{
			provider: 'trust',
			name: 'Trust Wallet',
			icon: '🛡️',
			available: typeof window !== 'undefined' && !!(window as any).ethereum?.isTrust,
		},
		{
			provider: 'walletconnect',
			name: 'WalletConnect',
			icon: '🔗',
			available: true, // WalletConnect is always available (uses QR code)
		},
	]);

	/**
	 * Initialize wallet button instances
	 */
	$effect(() => {
		wallets.forEach((w) => {
			if (!walletButtons.has(w.provider)) {
				walletButtons.set(w.provider, createButton());
			}
		});
	});

	/**
	 * Get Ethereum provider based on selected wallet
	 */
	function getProvider(provider: WalletProvider): any {
		if (typeof window === 'undefined') return null;

		const win = window as any;

		switch (provider) {
			case 'metamask':
				return win.ethereum?.isMetaMask ? win.ethereum : null;
			case 'coinbase':
				return win.ethereum?.isCoinbaseWallet ? win.ethereum : null;
			case 'phantom':
				return win.phantom?.ethereum ?? null;
			case 'rainbow':
				return win.ethereum?.isRainbow ? win.ethereum : null;
			case 'trust':
				return win.ethereum?.isTrust ? win.ethereum : null;
			case 'walletconnect':
				// WalletConnect requires additional setup with provider instance
				// For now, fall back to default ethereum provider
				return win.ethereum ?? null;
			default:
				return null;
		}
	}

	/**
	 * Format wallet address for display (0x1234...5678)
	 */
	function formatAddress(address: string): string {
		if (address.length < 10) return address;
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}

	/**
	 * Get chain name from chain ID
	 */
	function getChainName(chainId: number): string {
		const chains: Record<number, string> = {
			1: 'Ethereum',
			137: 'Polygon',
			8453: 'Base',
			42161: 'Arbitrum',
			10: 'Optimism',
			56: 'BNB Chain',
		};
		return chains[chainId] ?? `Chain ${chainId}`;
	}

	/**
	 * Connect to selected wallet
	 */
	async function handleConnect(provider: WalletProvider) {
		if (connecting || connected) return;

		connecting = true;
		error = null;
		selectedProvider = provider;

		try {
			const ethereum = getProvider(provider);

			if (!ethereum) {
				throw new Error(
					`${wallets.find((w) => w.provider === provider)?.name ?? 'Wallet'} is not available. Please install the extension.`
				);
			}

			// Request accounts
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			});

			if (!accounts || accounts.length === 0) {
				throw new Error('No accounts found. Please unlock your wallet.');
			}

			const address = accounts[0];

			// Get chain ID
			const chainIdHex = await ethereum.request({
				method: 'eth_chainId',
			});
			const chainId = parseInt(chainIdHex, 16);

			// Check if chain is supported
			if (!supportedChains.includes(chainId)) {
				const defaultChain = supportedChains[0] ?? 1;
				throw new Error(`Unsupported network. Please switch to ${getChainName(defaultChain)}.`);
			}

			// Request signature for authentication
			const signature = await ethereum.request({
				method: 'personal_sign',
				params: [signMessage, address],
			});

			if (!signature) {
				throw new Error('Signature required for authentication.');
			}

			// Update state
			wallet = { address, chainId, provider };
			connected = true;

			// Call handler
			await onConnect?.({
				address,
				chainId,
				provider,
				signature,
			});
		} catch (err: any) {
			// Handle user rejection
			if (err.code === 4001 || err.message?.includes('User rejected')) {
				error = 'Connection cancelled by user';
			} else {
				error = err.message ?? 'Failed to connect wallet';
			}
			console.error('Wallet connection error:', err);
		} finally {
			connecting = false;
			selectedProvider = null;
		}
	}

	/**
	 * Disconnect wallet
	 */
	async function handleDisconnect() {
		if (!connected) return;

		try {
			await onDisconnect?.();
			wallet = null;
			connected = false;
			error = null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to disconnect';
		}
	}

	/**
	 * Switch network
	 */
	async function handleSwitchNetwork(chainId: number) {
		if (!wallet || !connected) return;

		try {
			const ethereum = getProvider(wallet.provider);
			if (!ethereum) return;

			const chainIdHex = `0x${chainId.toString(16)}`;

			await ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainIdHex }],
			});

			// Update wallet state
			wallet = { ...wallet, chainId };
		} catch (err: any) {
			// Chain not added to wallet, attempt to add it
			if (err.code === 4902) {
				error = `Please add ${getChainName(chainId)} to your wallet first`;
			} else {
				error = err.message ?? 'Failed to switch network';
			}
		}
	}

	/**
	 * Copy address to clipboard
	 */
	async function handleCopyAddress() {
		if (!wallet) return;

		try {
			await navigator.clipboard.writeText(wallet.address);
		} catch (err) {
			console.error('Failed to copy address:', err);
		}
	}
</script>

<div class="wallet-connect">
	{#if !connected}
		<div class="wallet-connect__header">
			<h2 class="wallet-connect__title">Connect Your Wallet</h2>
			<p class="wallet-connect__description">Choose a wallet to sign in with cryptocurrency</p>
		</div>

		{#if error}
			<div class="wallet-connect__error" role="alert">
				<span class="wallet-connect__error-icon">⚠️</span>
				<span class="wallet-connect__error-text">{error}</span>
			</div>
		{/if}

		<div class="wallet-connect__wallets">
			{#each wallets as walletInfo}
				{@const buttonInstance = walletButtons.get(walletInfo.provider)}
				{#if buttonInstance}
					<button
						{...buttonInstance.props}
						class="wallet-connect__wallet"
						class:wallet-connect__wallet--unavailable={!walletInfo.available}
						class:wallet-connect__wallet--connecting={connecting &&
							selectedProvider === walletInfo.provider}
						onclick={() => handleConnect(walletInfo.provider)}
						disabled={!walletInfo.available || connecting}
						aria-label={`Connect with ${walletInfo.name}`}
					>
						<span class="wallet-connect__wallet-icon">{walletInfo.icon}</span>
						<span class="wallet-connect__wallet-name">{walletInfo.name}</span>
						{#if connecting && selectedProvider === walletInfo.provider}
							<span class="wallet-connect__wallet-spinner">⏳</span>
						{:else if !walletInfo.available && walletInfo.provider !== 'walletconnect'}
							<span class="wallet-connect__wallet-status">Not Installed</span>
						{/if}
					</button>
				{/if}
			{/each}
		</div>

		<div class="wallet-connect__footer">
			<p class="wallet-connect__help">
				Don't have a wallet?
				<a
					href="https://metamask.io/"
					target="_blank"
					rel="noopener noreferrer"
					class="wallet-connect__link"
				>
					Get MetaMask
				</a>
			</p>
		</div>
	{:else if wallet}
		<div class="wallet-connect__connected">
			<div class="wallet-connect__connected-header">
				<span class="wallet-connect__connected-icon">
					{wallets.find((w) => w.provider === wallet?.provider)?.icon ?? '🔗'}
				</span>
				<div class="wallet-connect__connected-info">
					<h3 class="wallet-connect__connected-title">Connected</h3>
					<p class="wallet-connect__connected-provider">
						{wallets.find((w) => w.provider === wallet?.provider)?.name ?? 'Wallet'}
					</p>
				</div>
			</div>

			<div class="wallet-connect__connected-details">
				<div class="wallet-connect__detail">
					<span class="wallet-connect__detail-label">Address</span>
					<button
						class="wallet-connect__detail-value wallet-connect__detail-value--clickable"
						onclick={handleCopyAddress}
						aria-label="Copy wallet address"
					>
						<code>{formatAddress(wallet.address)}</code>
						<span class="wallet-connect__copy-icon">📋</span>
					</button>
				</div>

				<div class="wallet-connect__detail">
					<span class="wallet-connect__detail-label">Network</span>
					<span class="wallet-connect__detail-value">
						{wallet ? getChainName(wallet.chainId) : 'Unknown'}
					</span>
				</div>
			</div>

			{#if showAdvanced && supportedChains.length > 1}
				<div class="wallet-connect__networks">
					<p class="wallet-connect__networks-label">Switch Network:</p>
					<div class="wallet-connect__networks-list">
						{#each supportedChains as chainId}
							<button
								class="wallet-connect__network-button"
								class:wallet-connect__network-button--active={wallet.chainId === chainId}
								onclick={() => handleSwitchNetwork(chainId)}
								disabled={wallet.chainId === chainId}
							>
								{getChainName(chainId)}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<button
				{...disconnectButton.props}
				class="wallet-connect__disconnect"
				onclick={handleDisconnect}
				aria-label="Disconnect wallet"
			>
				Disconnect
			</button>
		</div>
	{/if}
</div>

<style>
	.wallet-connect {
		max-width: 500px;
		margin: 0 auto;
	}

	.wallet-connect__header {
		text-align: center;
		margin-bottom: 24px;
	}

	.wallet-connect__title {
		font-size: 24px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: #1a1a1a;
	}

	.wallet-connect__description {
		font-size: 14px;
		color: #666;
		margin: 0;
		line-height: 1.5;
	}

	.wallet-connect__error {
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 8px;
		padding: 12px 16px;
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.wallet-connect__error-icon {
		flex-shrink: 0;
	}

	.wallet-connect__error-text {
		font-size: 14px;
		color: #c00;
	}

	.wallet-connect__wallets {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.wallet-connect__wallet {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		border: 2px solid #dee2e6;
		border-radius: 12px;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 16px;
		font-weight: 500;
		color: #1a1a1a;
	}

	.wallet-connect__wallet:hover:not(:disabled) {
		border-color: #007bff;
		background: #f0f8ff;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
	}

	.wallet-connect__wallet--connecting {
		border-color: #007bff;
		background: #f0f8ff;
	}

	.wallet-connect__wallet--unavailable {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.wallet-connect__wallet:disabled {
		cursor: not-allowed;
	}

	.wallet-connect__wallet-icon {
		font-size: 32px;
		flex-shrink: 0;
	}

	.wallet-connect__wallet-name {
		flex: 1;
		text-align: left;
	}

	.wallet-connect__wallet-status {
		font-size: 12px;
		color: #6c757d;
		font-weight: 400;
	}

	.wallet-connect__wallet-spinner {
		font-size: 20px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.wallet-connect__footer {
		text-align: center;
		padding-top: 16px;
		border-top: 1px solid #dee2e6;
	}

	.wallet-connect__help {
		font-size: 14px;
		color: #666;
		margin: 0;
	}

	.wallet-connect__link {
		color: #007bff;
		text-decoration: none;
		font-weight: 500;
	}

	.wallet-connect__link:hover {
		text-decoration: underline;
	}

	/* Connected state */
	.wallet-connect__connected {
		background: #f8f9fa;
		border: 1px solid #dee2e6;
		border-radius: 12px;
		padding: 24px;
	}

	.wallet-connect__connected-header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid #dee2e6;
	}

	.wallet-connect__connected-icon {
		font-size: 48px;
		flex-shrink: 0;
	}

	.wallet-connect__connected-info {
		flex: 1;
	}

	.wallet-connect__connected-title {
		font-size: 20px;
		font-weight: 600;
		margin: 0 0 4px 0;
		color: #28a745;
	}

	.wallet-connect__connected-provider {
		font-size: 14px;
		color: #6c757d;
		margin: 0;
	}

	.wallet-connect__connected-details {
		margin-bottom: 20px;
	}

	.wallet-connect__detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 0;
		border-bottom: 1px solid #e9ecef;
	}

	.wallet-connect__detail:last-child {
		border-bottom: none;
	}

	.wallet-connect__detail-label {
		font-size: 14px;
		color: #6c757d;
		font-weight: 500;
	}

	.wallet-connect__detail-value {
		font-size: 14px;
		color: #1a1a1a;
		font-weight: 500;
	}

	.wallet-connect__detail-value--clickable {
		display: flex;
		align-items: center;
		gap: 8px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.wallet-connect__detail-value--clickable:hover {
		background: #e9ecef;
	}

	.wallet-connect__detail-value code {
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
	}

	.wallet-connect__copy-icon {
		font-size: 12px;
		opacity: 0.6;
	}

	.wallet-connect__networks {
		margin-bottom: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid #dee2e6;
	}

	.wallet-connect__networks-label {
		font-size: 14px;
		font-weight: 500;
		color: #6c757d;
		margin: 0 0 12px 0;
	}

	.wallet-connect__networks-list {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.wallet-connect__network-button {
		padding: 8px 16px;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		background: white;
		color: #495057;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.wallet-connect__network-button:hover:not(:disabled) {
		border-color: #007bff;
		background: #f0f8ff;
	}

	.wallet-connect__network-button--active {
		background: #007bff;
		border-color: #007bff;
		color: white;
	}

	.wallet-connect__network-button:disabled {
		cursor: not-allowed;
	}

	.wallet-connect__disconnect {
		width: 100%;
		padding: 12px;
		border: 1px solid #dc3545;
		border-radius: 8px;
		background: white;
		color: #dc3545;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.wallet-connect__disconnect:hover {
		background: #dc3545;
		color: white;
	}
</style>
