import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import WalletConnect from '../src/WalletConnect.svelte';

// Mock headless button
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: () => ({ props: {} }),
}));

// Mock clipboard
const writeTextMock = vi.fn();
Object.assign(navigator, {
	clipboard: {
		writeText: writeTextMock,
	},
});

describe('WalletConnect', () => {
	let mockEthereum: any;
	let mockPhantom: any;

	beforeEach(() => {
		vi.clearAllMocks();
		writeTextMock.mockReset();
		writeTextMock.mockResolvedValue(undefined);

		mockEthereum = {
			request: vi.fn(),
			isMetaMask: false,
			isCoinbaseWallet: false,
			isRainbow: false,
			isTrust: false,
		};

		mockPhantom = {
			ethereum: {
				request: vi.fn(),
			},
		};

		// Define window.ethereum
		Object.defineProperty(window, 'ethereum', {
			value: mockEthereum,
			writable: true,
			configurable: true,
		});

		Object.defineProperty(window, 'phantom', {
			value: mockPhantom,
			writable: true,
			configurable: true,
		});
	});

	afterEach(() => {
		// cleanup
		delete (window as any).ethereum;
		delete (window as any).phantom;
	});

	it('detects available wallets', () => {
		// Setup multiple wallets
		mockEthereum.isMetaMask = true;
		mockEthereum.isCoinbaseWallet = true;
		mockEthereum.isRainbow = true;

		render(WalletConnect);

		const metaMaskBtn = screen.getByRole('button', { name: /connect with metamask/i });
		const coinbaseBtn = screen.getByRole('button', { name: /connect with coinbase wallet/i });
		const rainbowBtn = screen.getByRole('button', { name: /connect with rainbow/i });

		expect(metaMaskBtn.disabled).toBe(false);
		expect(coinbaseBtn.disabled).toBe(false);
		expect(rainbowBtn.disabled).toBe(false);

		// Trust not installed
		const trustBtn = screen.getByRole('button', { name: /connect with trust wallet/i });
		expect(trustBtn.disabled).toBe(true);

		// Phantom available (mocked window.phantom)
		const phantomBtn = screen.getByRole('button', { name: /connect with phantom/i });
		expect(phantomBtn.disabled).toBe(false);
	});

	it('handles connect flow (MetaMask)', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsignature');

		const onConnect = vi.fn();
		render(WalletConnect, { onConnect });

		const btn = screen.getByRole('button', { name: /connect with metamask/i });
		await fireEvent.click(btn);

		await waitFor(() => {
			expect(onConnect).toHaveBeenCalledWith(
				expect.objectContaining({
					provider: 'metamask',
					address: '0x1234567890123456789012345678901234567890',
				})
			);
		});
	});

	it('handles connect flow (Phantom)', async () => {
		mockPhantom.ethereum.request
			.mockResolvedValueOnce(['0xphantomaddress'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		const onConnect = vi.fn();
		render(WalletConnect, { onConnect });

		const btn = screen.getByRole('button', { name: /connect with phantom/i });
		await fireEvent.click(btn);

		await waitFor(() => {
			expect(onConnect).toHaveBeenCalledWith(
				expect.objectContaining({
					provider: 'phantom',
					address: '0xphantomaddress',
				})
			);
		});
	});

	it('handles unsupported chain error', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request.mockResolvedValueOnce(['0x123']).mockResolvedValueOnce('0x38'); // Chain 56 (BNB) not in default [1]

		render(WalletConnect, { supportedChains: [1] });

		const btn = screen.getByRole('button', { name: /connect with metamask/i });
		await fireEvent.click(btn);

		expect(await screen.findByText(/unsupported network/i)).toBeTruthy();
	});

	it('handles empty accounts error', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request.mockResolvedValueOnce([]); // No accounts

		render(WalletConnect);
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));

		expect(await screen.findByText(/no accounts found/i)).toBeTruthy();
	});

	it('handles signature rejection', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockRejectedValueOnce({ code: 4001 }); // User rejected signature

		render(WalletConnect);
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));

		expect(await screen.findByText(/connection cancelled by user/i)).toBeTruthy();
	});

	it('handles clipboard error', async () => {
		writeTextMock.mockRejectedValue(new Error('Clipboard failed'));
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		render(WalletConnect);
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
		await screen.findByText('Connected');

		await fireEvent.click(screen.getByRole('button', { name: /copy/i }));

		expect(await screen.findByText(/clipboard failed/i)).toBeTruthy();
	});

	it('handles network switch error', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		render(WalletConnect, { showAdvanced: true, supportedChains: [1, 137] });
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
		await screen.findByText('Connected');

		// Fail switch
		mockEthereum.request.mockRejectedValueOnce({ code: 4902 }); // Chain not added

		const polygonBtn = screen.getByRole('button', { name: 'Polygon' });
		await fireEvent.click(polygonBtn);

		expect(await screen.findByText(/please add polygon/i)).toBeTruthy();
	});

	it('handles network switch generic error', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		render(WalletConnect, { showAdvanced: true, supportedChains: [1, 137] });
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
		await screen.findByText('Connected');

		// Fail switch generic
		mockEthereum.request.mockRejectedValueOnce(new Error('Network error'));

		const polygonBtn = screen.getByRole('button', { name: 'Polygon' });
		await fireEvent.click(polygonBtn);

		expect(await screen.findByText('Network error')).toBeTruthy();
	});

	it('handles clipboard unavailable', async () => {
		// Temporarily remove clipboard
		const originalClipboard = navigator.clipboard;
		Object.defineProperty(navigator, 'clipboard', { value: undefined, writable: true });

		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		render(WalletConnect);
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
		await screen.findByText('Connected');

		await fireEvent.click(screen.getByRole('button', { name: /copy/i }));

		expect(await screen.findByText(/clipboard is unavailable/i)).toBeTruthy();

		// Restore
		Object.defineProperty(navigator, 'clipboard', { value: originalClipboard, writable: true });
	});

	it('handles disconnect error', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		const onDisconnect = vi.fn().mockRejectedValue(new Error('Disconnect failed'));
		render(WalletConnect, { onDisconnect });
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
		await screen.findByText('Connected');

		await fireEvent.click(screen.getByRole('button', { name: /disconnect/i }));

		expect(await screen.findByText('Disconnect failed')).toBeTruthy();
	});

	it('handles generic connection error', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request.mockRejectedValueOnce(new Error('Connection failed'));

		render(WalletConnect);
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));

		expect(await screen.findByText('Connection failed')).toBeTruthy();
	});

	it('handles string error', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request.mockRejectedValueOnce('String Error');

		render(WalletConnect);
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));

		expect(await screen.findByText('String Error')).toBeTruthy();
	});

	it('handles successful disconnect', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		const onDisconnect = vi.fn();
		render(WalletConnect, { onDisconnect });
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
		await screen.findByText('Connected');

		await fireEvent.click(screen.getByRole('button', { name: /disconnect/i }));

		expect(onDisconnect).toHaveBeenCalled();
		expect(screen.getByText('Connect Your Wallet')).toBeTruthy();
	});

	it('handles successful network switch', async () => {
		mockEthereum.isMetaMask = true;
		mockEthereum.request
			.mockResolvedValueOnce(['0x123'])
			.mockResolvedValueOnce('0x1')
			.mockResolvedValueOnce('0xsig');

		render(WalletConnect, { showAdvanced: true, supportedChains: [1, 137] });
		await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
		await screen.findByText('Connected');

		// Switch success
		mockEthereum.request.mockResolvedValueOnce(null);

		const polygonBtn = screen.getByRole('button', { name: 'Polygon' });
		await fireEvent.click(polygonBtn);

		// Expect chainId to update in state? Component doesn't expose it, but UI might update?
		// The component updates `wallet.chainId` and displays `getChainName(wallet.chainId)`.
		// It was 'Ethereum' (1). Should become 'Polygon' (137).
		expect(await screen.findByText('Network')).toBeTruthy();
		// We can check if the detail value changed to Polygon
		// Note: The button text is also "Polygon", so we need to be careful with getByText
		// The "Network" value display:
		// <span class="wallet-connect__detail-value">{wallet ? getChainName(wallet.chainId) : 'Unknown'}</span>

		// Let's look for the detail value specifically or just text "Polygon" that is NOT the button?
		// But "Polygon" button is disabled after switch?
		// `disabled={wallet.chainId === chainId}`

		await waitFor(() => {
			const polygonBtnAfter = screen.getByRole('button', { name: 'Polygon' });
			expect(polygonBtnAfter.disabled).toBe(true);
		});
	});
});
