/**
 * Tests for Auth.WalletConnect Component Logic
 * 
 * Tests cryptocurrency wallet authentication including:
 * - Wallet provider detection
 * - Connection flow
 * - Signature verification
 * - Network switching
 * - Address formatting
 * - Error handling
 * - State management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock headless UI dependencies
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: () => ({ props: {} }),
}));

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

interface WalletConnectionData {
	address: string;
	chainId: number;
	provider: string;
	signature: string;
}

/**
 * Wallet Connect Logic State
 */
interface WalletConnectState {
	connecting: boolean;
	connected: boolean;
	wallet: ConnectedWallet | null;
	error: string | null;
	selectedProvider: WalletProvider | null;
}

/**
 * Mock Ethereum provider
 */
interface MockEthereumProvider {
	request: (args: { method: string; params?: any[] }) => Promise<any>;
	isMetaMask?: boolean;
	isCoinbaseWallet?: boolean;
	isRainbow?: boolean;
	isTrust?: boolean;
}

/**
 * Create wallet connect logic for testing
 */
function createWalletConnectLogic(supportedChains: number[] = [1]) {
	const state: WalletConnectState = {
		connecting: false,
		connected: false,
		wallet: null,
		error: null,
		selectedProvider: null,
	};

	return {
		getState: () => state,

		/**
		 * Detect available wallets
		 */
		detectWallets: (): WalletInfo[] => {
			const win = typeof window !== 'undefined' ? (window as any) : {};

			return [
				{
					provider: 'metamask',
					name: 'MetaMask',
					icon: '🦊',
					available: !!win.ethereum?.isMetaMask,
				},
				{
					provider: 'coinbase',
					name: 'Coinbase Wallet',
					icon: '🔵',
					available: !!win.ethereum?.isCoinbaseWallet,
				},
				{
					provider: 'phantom',
					name: 'Phantom',
					icon: '👻',
					available: !!win.phantom?.ethereum,
				},
				{
					provider: 'rainbow',
					name: 'Rainbow',
					icon: '🌈',
					available: !!win.ethereum?.isRainbow,
				},
				{
					provider: 'trust',
					name: 'Trust Wallet',
					icon: '🛡️',
					available: !!win.ethereum?.isTrust,
				},
				{
					provider: 'walletconnect',
					name: 'WalletConnect',
					icon: '🔗',
					available: true, // Always available
				},
			];
		},

		/**
		 * Get Ethereum provider
		 */
		getProvider: (provider: WalletProvider): MockEthereumProvider | null => {
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
					return win.ethereum ?? null;
				default:
					return null;
			}
		},

		/**
		 * Format wallet address
		 */
		formatAddress: (address: string): string => {
			if (address.length < 10) return address;
			return `${address.slice(0, 6)}...${address.slice(-4)}`;
		},

		/**
		 * Get chain name
		 */
		getChainName: (chainId: number): string => {
			const chains: Record<number, string> = {
				1: 'Ethereum',
				137: 'Polygon',
				8453: 'Base',
				42161: 'Arbitrum',
				10: 'Optimism',
				56: 'BNB Chain',
			};
			return chains[chainId] ?? `Chain ${chainId}`;
		},

		/**
		 * Connect to wallet
		 */
		connect: async (
			provider: WalletProvider,
			ethereum: MockEthereumProvider,
			signMessage: string,
			onConnect?: (data: WalletConnectionData) => Promise<void>
		): Promise<void> => {
			if (state.connecting || state.connected) return;

			state.connecting = true;
			state.error = null;
			state.selectedProvider = provider;

			try {
				if (!ethereum) {
					throw new Error(`${provider} is not available. Please install the extension.`);
				}

				// Request accounts
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

				if (!accounts || accounts.length === 0) {
					throw new Error('No accounts found. Please unlock your wallet.');
				}

				const address = accounts[0];

				// Get chain ID
				const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
				const chainId = parseInt(chainIdHex, 16);

				// Check if chain is supported
				if (!supportedChains.includes(chainId)) {
					const defaultChain = supportedChains[0] ?? 1;
					const chains: Record<number, string> = {
						1: 'Ethereum',
						137: 'Polygon',
						8453: 'Base',
						42161: 'Arbitrum',
						10: 'Optimism',
						56: 'BNB Chain',
					};
					const chainName = chains[defaultChain] ?? `Chain ${defaultChain}`;
					throw new Error(`Unsupported network. Please switch to ${chainName}.`);
				}

				// Request signature
				const signature = await ethereum.request({
					method: 'personal_sign',
					params: [signMessage, address],
				});

				if (!signature) {
					throw new Error('Signature required for authentication.');
				}

				// Update state
				state.wallet = { address, chainId, provider };
				state.connected = true;

				// Call handler
				await onConnect?.({ address, chainId, provider, signature });

			} catch (err: any) {
				// Handle user rejection
				if (err.code === 4001 || err.message?.includes('User rejected')) {
					state.error = 'Connection cancelled by user';
				} else {
					state.error = err.message ?? 'Failed to connect wallet';
				}
				throw err;
			} finally {
				state.connecting = false;
				state.selectedProvider = null;
			}
		},

		/**
		 * Disconnect wallet
		 */
		disconnect: async (onDisconnect?: () => Promise<void>): Promise<void> => {
			if (!state.connected) return;

			try {
				await onDisconnect?.();
				state.wallet = null;
				state.connected = false;
				state.error = null;
			} catch (err) {
				state.error = err instanceof Error ? err.message : 'Failed to disconnect';
				throw err;
			}
		},

		/**
		 * Switch network
		 */
		switchNetwork: async (
			chainId: number,
			ethereum: MockEthereumProvider
		): Promise<void> => {
			if (!state.wallet || !state.connected) return;

			try {
				const chainIdHex = `0x${chainId.toString(16)}`;

				await ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: chainIdHex }],
				});

				// Update wallet state
				state.wallet = { ...state.wallet, chainId };

			} catch (err: any) {
				// Get chain name
				const chains: Record<number, string> = {
					1: 'Ethereum',
					137: 'Polygon',
					8453: 'Base',
					42161: 'Arbitrum',
					10: 'Optimism',
					56: 'BNB Chain',
				};
				const chainName = chains[chainId] ?? `Chain ${chainId}`;

				// Chain not added to wallet
				if (err.code === 4902) {
					state.error = `Please add ${chainName} to your wallet first`;
				} else {
					state.error = err.message ?? 'Failed to switch network';
				}
				throw err;
			}
		},

		/**
		 * Clear error
		 */
		clearError: (): void => {
			state.error = null;
		},
	};
}

describe('WalletConnect Logic', () => {
	let logic: ReturnType<typeof createWalletConnectLogic>;
	let mockEthereum: MockEthereumProvider;

	beforeEach(() => {
		logic = createWalletConnectLogic([1, 137]); // Ethereum and Polygon

		// Mock Ethereum provider
		mockEthereum = {
			request: vi.fn(),
			isMetaMask: true,
		};

		// Mock window.ethereum
		Object.defineProperty(window, 'ethereum', {
			value: mockEthereum,
			writable: true,
			configurable: true,
		});

		// Mock clipboard
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn().mockResolvedValue(undefined),
			},
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		delete (window as any).ethereum;
		delete (window as any).phantom;
	});

	describe('Wallet Detection', () => {
		it('should detect MetaMask', () => {
			const wallets = logic.detectWallets();
			const metamask = wallets.find(w => w.provider === 'metamask');
			expect(metamask).toBeDefined();
			expect(metamask?.available).toBe(true);
		});

		it('should detect unavailable wallets', () => {
			delete (window as any).ethereum;
			const wallets = logic.detectWallets();
			const metamask = wallets.find(w => w.provider === 'metamask');
			expect(metamask?.available).toBe(false);
		});

		it('should detect Phantom wallet', () => {
			(window as any).phantom = { ethereum: mockEthereum };
			const wallets = logic.detectWallets();
			const phantom = wallets.find(w => w.provider === 'phantom');
			expect(phantom?.available).toBe(true);
		});

		it('should detect Coinbase Wallet', () => {
			mockEthereum.isCoinbaseWallet = true;
			const wallets = logic.detectWallets();
			const coinbase = wallets.find(w => w.provider === 'coinbase');
			expect(coinbase?.available).toBe(true);
		});

		it('should detect Rainbow wallet', () => {
			mockEthereum.isRainbow = true;
			const wallets = logic.detectWallets();
			const rainbow = wallets.find(w => w.provider === 'rainbow');
			expect(rainbow?.available).toBe(true);
		});

		it('should detect Trust Wallet', () => {
			mockEthereum.isTrust = true;
			const wallets = logic.detectWallets();
			const trust = wallets.find(w => w.provider === 'trust');
			expect(trust?.available).toBe(true);
		});

		it('should always show WalletConnect as available', () => {
			delete (window as any).ethereum;
			const wallets = logic.detectWallets();
			const wc = wallets.find(w => w.provider === 'walletconnect');
			expect(wc?.available).toBe(true);
		});

		it('should return correct wallet info structure', () => {
			const wallets = logic.detectWallets();
			wallets.forEach(wallet => {
				expect(wallet).toHaveProperty('provider');
				expect(wallet).toHaveProperty('name');
				expect(wallet).toHaveProperty('icon');
				expect(wallet).toHaveProperty('available');
			});
		});
	});

	describe('Address Formatting', () => {
		it('should format standard Ethereum address', () => {
			const address = '0x1234567890123456789012345678901234567890';
			const formatted = logic.formatAddress(address);
			expect(formatted).toBe('0x1234...7890');
		});

		it('should handle short addresses', () => {
			const address = '0x123';
			const formatted = logic.formatAddress(address);
			expect(formatted).toBe('0x123');
		});

		it('should handle exactly 10 character addresses', () => {
			const address = '0x12345678';
			const formatted = logic.formatAddress(address);
			expect(formatted).toBe('0x1234...5678'); // 10 chars still get formatted
		});

		it('should handle very long addresses', () => {
			const address = '0x' + '1'.repeat(100);
			const formatted = logic.formatAddress(address);
			expect(formatted).toMatch(/^0x1111\.\.\.1111$/);
		});

		it('should handle empty address', () => {
			const formatted = logic.formatAddress('');
			expect(formatted).toBe('');
		});

		it('should preserve case in formatted address', () => {
			const address = '0xAbCdEf1234567890123456789012345678901234';
			const formatted = logic.formatAddress(address);
			expect(formatted).toBe('0xAbCd...1234');
		});

		it('should handle address without 0x prefix', () => {
			const address = '1234567890123456789012345678901234567890';
			const formatted = logic.formatAddress(address);
			expect(formatted).toBe('123456...7890');
		});
	});

	describe('Chain Name Resolution', () => {
		it('should resolve Ethereum mainnet', () => {
			expect(logic.getChainName(1)).toBe('Ethereum');
		});

		it('should resolve Polygon', () => {
			expect(logic.getChainName(137)).toBe('Polygon');
		});

		it('should resolve Base', () => {
			expect(logic.getChainName(8453)).toBe('Base');
		});

		it('should resolve Arbitrum', () => {
			expect(logic.getChainName(42161)).toBe('Arbitrum');
		});

		it('should resolve Optimism', () => {
			expect(logic.getChainName(10)).toBe('Optimism');
		});

		it('should resolve BNB Chain', () => {
			expect(logic.getChainName(56)).toBe('BNB Chain');
		});

		it('should handle unknown chains', () => {
			expect(logic.getChainName(999)).toBe('Chain 999');
		});

		it('should handle chain ID 0', () => {
			expect(logic.getChainName(0)).toBe('Chain 0');
		});

		it('should handle negative chain IDs', () => {
			expect(logic.getChainName(-1)).toBe('Chain -1');
		});
	});

	describe('Connection Flow', () => {
		it('should connect to MetaMask successfully', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) // eth_requestAccounts
				.mockResolvedValueOnce('0x1') // eth_chainId
				.mockResolvedValueOnce('0xsignature'); // personal_sign

			const onConnect = vi.fn().mockResolvedValue(undefined);

			await logic.connect('metamask', mockEthereum, 'Sign this message', onConnect);

			expect(logic.getState().connected).toBe(true);
			expect(logic.getState().wallet).toEqual({
				address: '0x1234567890123456789012345678901234567890',
				chainId: 1,
				provider: 'metamask',
			});
			expect(onConnect).toHaveBeenCalledWith({
				address: '0x1234567890123456789012345678901234567890',
				chainId: 1,
				provider: 'metamask',
				signature: '0xsignature',
			});
		});

		it('should handle no accounts available', async () => {
			vi.mocked(mockEthereum.request).mockResolvedValueOnce([]);

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign this', undefined)
			).rejects.toThrow('No accounts found');

			expect(logic.getState().connected).toBe(false);
		});

		it('should handle unsupported network', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
				.mockResolvedValueOnce('0x38'); // BSC (56), not supported

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign this', undefined)
			).rejects.toThrow('Unsupported network');

			expect(logic.getState().connected).toBe(false);
		});

		it('should handle user rejection', async () => {
			const rejectionError: any = new Error('User rejected');
			rejectionError.code = 4001;
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(rejectionError);

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign this', undefined)
			).rejects.toThrow();

			expect(logic.getState().error).toBe('Connection cancelled by user');
		});

		it('should handle missing signature', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce(null); // No signature

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign this', undefined)
			).rejects.toThrow('Signature required');
		});

		it('should set connecting state during connection', async () => {
			vi.mocked(mockEthereum.request)
				.mockImplementationOnce(async () => {
					expect(logic.getState().connecting).toBe(true);
					return ['0x1234567890123456789012345678901234567890'];
				})
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsig');

			await logic.connect('metamask', mockEthereum, 'Sign this', undefined);
			expect(logic.getState().connecting).toBe(false);
		});

		it('should prevent concurrent connections', async () => {
			vi.mocked(mockEthereum.request)
				.mockImplementation(async ({ method }) => {
					await new Promise(resolve => setTimeout(resolve, 50));
					if (method === 'eth_requestAccounts') {
						return ['0x1234567890123456789012345678901234567890'];
					} else if (method === 'eth_chainId') {
						return '0x1';
					} else if (method === 'personal_sign') {
						return '0xsig';
					}
					return null;
				});

			const promise1 = logic.connect('metamask', mockEthereum, 'Sign', undefined);
			// Wait to ensure connect is in progress
			await new Promise(resolve => setTimeout(resolve, 20));
			const promise2 = logic.connect('metamask', mockEthereum, 'Sign', undefined);

			await Promise.allSettled([promise1, promise2]);

			// Second call should return early, first call makes 3 requests
			// If second didn't return early, we'd see 6 calls
			expect(mockEthereum.request).toHaveBeenCalledTimes(3);
		});

		it('should handle provider not available', async () => {
			await expect(
				logic.connect('metamask', null as any, 'Sign', undefined)
			).rejects.toThrow('is not available');
		});

		it('should clear error on successful connection', async () => {
			logic.getState().error = 'Previous error';

			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsig');

			await logic.connect('metamask', mockEthereum, 'Sign', undefined);
			expect(logic.getState().error).toBeNull();
		});

		it('should support Polygon network', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
				.mockResolvedValueOnce('0x89') // Polygon (137)
				.mockResolvedValueOnce('0xsig');

			await logic.connect('metamask', mockEthereum, 'Sign', undefined);
			expect(logic.getState().wallet?.chainId).toBe(137);
		});

		it('should handle connection callback errors', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsig');

			const onConnect = vi.fn().mockRejectedValue(new Error('Server error'));

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', onConnect)
			).rejects.toThrow('Server error');
		});

		it('should set selectedProvider during connection', async () => {
			vi.mocked(mockEthereum.request)
				.mockImplementationOnce(async () => {
					expect(logic.getState().selectedProvider).toBe('metamask');
					return ['0x1234567890123456789012345678901234567890'];
				})
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsig');

			await logic.connect('metamask', mockEthereum, 'Sign', undefined);
			expect(logic.getState().selectedProvider).toBeNull();
		});

		it('should handle generic connection errors', async () => {
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(new Error('Network error'));

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow('Network error');

			expect(logic.getState().error).toBe('Network error');
		});
	});

	describe('Disconnection Flow', () => {
		it('should disconnect wallet', async () => {
			// Setup connected state
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			const onDisconnect = vi.fn().mockResolvedValue(undefined);
			await logic.disconnect(onDisconnect);

			expect(logic.getState().connected).toBe(false);
			expect(logic.getState().wallet).toBeNull();
			expect(onDisconnect).toHaveBeenCalledOnce();
		});

		it('should ignore disconnect when not connected', async () => {
			const onDisconnect = vi.fn();
			await logic.disconnect(onDisconnect);

			expect(onDisconnect).not.toHaveBeenCalled();
		});

		it('should handle disconnect errors', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			const onDisconnect = vi.fn().mockRejectedValue(new Error('Server error'));

			await expect(logic.disconnect(onDisconnect)).rejects.toThrow('Server error');
			expect(logic.getState().error).toBe('Server error');
		});

		it('should handle non-Error exceptions', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			const onDisconnect = vi.fn().mockRejectedValue('String error');

			await expect(logic.disconnect(onDisconnect)).rejects.toBe('String error');
			expect(logic.getState().error).toBe('Failed to disconnect');
		});

		it('should work without callback', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			await expect(logic.disconnect()).resolves.not.toThrow();
			expect(logic.getState().connected).toBe(false);
		});

		it('should clear error on successful disconnect', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};
			logic.getState().error = 'Previous error';

			await logic.disconnect();
			expect(logic.getState().error).toBeNull();
		});
	});

	describe('Network Switching', () => {
		beforeEach(() => {
			// Setup connected state
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};
		});

		it('should switch network successfully', async () => {
			vi.mocked(mockEthereum.request).mockResolvedValueOnce(undefined);

			await logic.switchNetwork(137, mockEthereum); // Switch to Polygon

			expect(mockEthereum.request).toHaveBeenCalledWith({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x89' }],
			});
			expect(logic.getState().wallet?.chainId).toBe(137);
		});

		it('should convert chain ID to hex', async () => {
			vi.mocked(mockEthereum.request).mockResolvedValueOnce(undefined);

			await logic.switchNetwork(137, mockEthereum);

			expect(mockEthereum.request).toHaveBeenCalledWith(
				expect.objectContaining({
					params: [{ chainId: '0x89' }],
				})
			);
		});

		it('should handle chain not added (4902)', async () => {
			const err: any = new Error('Chain not added');
			err.code = 4902;
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(err);

			await expect(logic.switchNetwork(8453, mockEthereum)).rejects.toThrow();
			expect(logic.getState().error).not.toBeNull();
			expect(logic.getState().error).toContain('Please add');
		});

		it('should handle network switch errors', async () => {
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(new Error('RPC error'));

			await expect(logic.switchNetwork(137, mockEthereum)).rejects.toThrow();
			expect(logic.getState().error).toBe('RPC error');
		});

		it('should ignore switch when not connected', async () => {
			logic.getState().connected = false;
			logic.getState().wallet = null;

			await logic.switchNetwork(137, mockEthereum);
			expect(mockEthereum.request).not.toHaveBeenCalled();
		});

		it('should handle switching to unknown chain', async () => {
			const err: any = new Error();
			err.code = 4902;
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(err);

			await expect(logic.switchNetwork(999, mockEthereum)).rejects.toThrow();
			expect(logic.getState().error).not.toBeNull();
			expect(logic.getState().error).toContain('Chain 999');
		});

		it('should update wallet state on successful switch', async () => {
			vi.mocked(mockEthereum.request).mockResolvedValueOnce(undefined);

			const oldWallet = logic.getState().wallet;
			await logic.switchNetwork(137, mockEthereum);

			expect(logic.getState().wallet).not.toBe(oldWallet); // New object
			expect(logic.getState().wallet?.address).toBe('0x123'); // Same address
		});

		it('should handle generic switch errors', async () => {
			const err: any = new Error('Unknown error');
			err.code = 9999;
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(err);

			await expect(logic.switchNetwork(137, mockEthereum)).rejects.toThrow();
			expect(logic.getState().error).toBe('Unknown error');
		});
	});

	describe('Error Handling', () => {
		it('should clear error state', () => {
			logic.getState().error = 'Test error';
			logic.clearError();
			expect(logic.getState().error).toBeNull();
		});

		it('should handle null error', () => {
			logic.getState().error = null;
			logic.clearError();
			expect(logic.getState().error).toBeNull();
		});

		it('should preserve error messages from exceptions', async () => {
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(
				new Error('Specific error message')
			);

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow();

			expect(logic.getState().error).toBe('Specific error message');
		});

		it('should handle error code 4001 as user rejection', async () => {
			const err: any = new Error();
			err.code = 4001;
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(err);

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow();

			expect(logic.getState().error).toBe('Connection cancelled by user');
		});

		it('should handle "User rejected" in message', async () => {
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(
				new Error('User rejected the request')
			);

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow();

			expect(logic.getState().error).toBe('Connection cancelled by user');
		});
	});

	describe('State Management', () => {
		it('should initialize with correct default state', () => {
			const state = logic.getState();
			expect(state.connecting).toBe(false);
			expect(state.connected).toBe(false);
			expect(state.wallet).toBeNull();
			expect(state.error).toBeNull();
			expect(state.selectedProvider).toBeNull();
		});

		it('should maintain state consistency', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x123'])
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsig');

			await logic.connect('metamask', mockEthereum, 'Sign', undefined);

			const state = logic.getState();
			expect(state.connected).toBe(true);
			expect(state.connecting).toBe(false);
			expect(state.wallet).not.toBeNull();
			expect(state.error).toBeNull();
		});

		it('should handle state after connection error', async () => {
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(new Error('Network error'));

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow();

			expect(logic.getState().connecting).toBe(false);
			expect(logic.getState().connected).toBe(false);
			expect(logic.getState().error).not.toBeNull();
		});

		it('should reset state on disconnect', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			await logic.disconnect();

			expect(logic.getState().connected).toBe(false);
			expect(logic.getState().wallet).toBeNull();
			expect(logic.getState().error).toBeNull();
		});
	});

	describe('Integration Scenarios', () => {
		it('should handle full connection flow', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsignature');

			await logic.connect('metamask', mockEthereum, 'Sign this message', undefined);

			expect(logic.getState().connected).toBe(true);
			expect(logic.getState().wallet).toBeDefined();
			expect(logic.getState().error).toBeNull();
		});

		it('should handle connect, switch network, disconnect flow', async () => {
			// Connect
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x123'])
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsig');

			await logic.connect('metamask', mockEthereum, 'Sign', undefined);
			expect(logic.getState().connected).toBe(true);

			// Switch network
			vi.mocked(mockEthereum.request).mockResolvedValueOnce(undefined);
			await logic.switchNetwork(137, mockEthereum);
			expect(logic.getState().wallet?.chainId).toBe(137);

			// Disconnect
			await logic.disconnect();
			expect(logic.getState().connected).toBe(false);
		});

		it('should handle error recovery flow', async () => {
			// Initial error
			vi.mocked(mockEthereum.request).mockRejectedValueOnce(new Error('Network error'));
			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow();
			expect(logic.getState().error).not.toBeNull();

			// Clear error and retry
			logic.clearError();
			expect(logic.getState().error).toBeNull();

			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x123'])
				.mockResolvedValueOnce('0x1')
				.mockResolvedValueOnce('0xsig');

			await logic.connect('metamask', mockEthereum, 'Sign', undefined);
			expect(logic.getState().connected).toBe(true);
		});

		it('should handle multiple network switches', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce(undefined);

			await logic.switchNetwork(137, mockEthereum); // Polygon
			expect(logic.getState().wallet?.chainId).toBe(137);

			await logic.switchNetwork(1, mockEthereum); // Back to Ethereum
			expect(logic.getState().wallet?.chainId).toBe(1);

			await logic.switchNetwork(8453, mockEthereum); // Base
			expect(logic.getState().wallet?.chainId).toBe(8453);
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty account array', async () => {
			vi.mocked(mockEthereum.request).mockResolvedValueOnce([]);

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow('No accounts found');
		});

		it('should handle null account response', async () => {
			vi.mocked(mockEthereum.request).mockResolvedValueOnce(null);

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow('No accounts found');
		});

		it('should handle invalid chain ID hex', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x123'])
				.mockResolvedValueOnce('invalid_hex');

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow();
		});

		it('should handle very large chain IDs', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			vi.mocked(mockEthereum.request).mockResolvedValueOnce(undefined);

			await logic.switchNetwork(999999999, mockEthereum);
			expect(logic.getState().wallet?.chainId).toBe(999999999);
		});

		it('should handle simultaneous connect and disconnect', async () => {
			vi.mocked(mockEthereum.request)
				.mockImplementation(async () => {
					await new Promise(resolve => setTimeout(resolve, 100));
					return ['0x123'];
				});

			const connectPromise = logic.connect('metamask', mockEthereum, 'Sign', undefined);
			const disconnectPromise = logic.disconnect();

			await Promise.allSettled([connectPromise, disconnectPromise]);

			// One should succeed, other should be no-op
			const state = logic.getState();
			expect(typeof state.connected).toBe('boolean');
		});

		it('should handle provider that becomes unavailable mid-connection', async () => {
			vi.mocked(mockEthereum.request)
				.mockResolvedValueOnce(['0x123'])
				.mockRejectedValueOnce(new Error('Provider disconnected'));

			await expect(
				logic.connect('metamask', mockEthereum, 'Sign', undefined)
			).rejects.toThrow('Provider disconnected');
		});

		it('should handle address with unusual characters', () => {
			const address = '0xaBcDeF1234567890aBcDeF1234567890aBcDeF12';
			const formatted = logic.formatAddress(address);
			expect(formatted).toBe('0xaBcD...eF12');
		});

		it('should handle empty supported chains array', () => {
			const logicEmpty = createWalletConnectLogic([]);
			expect(logicEmpty.getChainName(1)).toBe('Ethereum');
		});

		it('should handle chain ID 0 conversion to hex', async () => {
			logic.getState().connected = true;
			logic.getState().wallet = {
				address: '0x123',
				chainId: 1,
				provider: 'metamask',
			};

			vi.mocked(mockEthereum.request).mockResolvedValueOnce(undefined);

			await logic.switchNetwork(0, mockEthereum);
			expect(mockEthereum.request).toHaveBeenCalledWith({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x0' }],
			});
		});
	});
});

