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

    beforeEach(() => {
        vi.clearAllMocks();
        writeTextMock.mockReset();
        writeTextMock.mockResolvedValue(undefined);

        mockEthereum = {
            request: vi.fn(),
            isMetaMask: false,
        };

        // Define window.ethereum
        Object.defineProperty(window, 'ethereum', {
            value: mockEthereum,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        // cleanup
        delete (window as any).ethereum;
    });

    it('renders available wallets', () => {
        // Setup MetaMask available
        mockEthereum.isMetaMask = true;
        
        render(WalletConnect);
        
        // MetaMask should be enabled
        const metaMaskBtn = screen.getByRole('button', { name: /connect with metamask/i });
        expect(metaMaskBtn).toBeTruthy();
        expect(metaMaskBtn.disabled).toBe(false);
        
        // Others are not installed
        const notInstalled = screen.getAllByText('Not Installed');
        expect(notInstalled.length).toBeGreaterThan(0);
        
        // Coinbase (not available)
        const coinbaseBtn = screen.getByRole('button', { name: /connect with coinbase wallet/i });
        expect(coinbaseBtn).toBeTruthy();
        expect(coinbaseBtn.disabled).toBe(true);
    });

    it('handles connect flow', async () => {
        mockEthereum.isMetaMask = true;
        // Mock request flow: accounts -> chainId -> signature
        mockEthereum.request
            .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) // eth_requestAccounts
            .mockResolvedValueOnce('0x1') // eth_chainId (1 = Mainnet)
            .mockResolvedValueOnce('0xsignature'); // personal_sign

        const onConnect = vi.fn();
        render(WalletConnect, { onConnect });

        const metaMaskBtn = screen.getByRole('button', { name: /connect with metamask/i });
        await fireEvent.click(metaMaskBtn);

        await waitFor(() => {
            expect(mockEthereum.request).toHaveBeenCalledTimes(3);
        });
        
        await waitFor(() => {
            expect(onConnect).toHaveBeenCalledWith({
                address: '0x1234567890123456789012345678901234567890',
                chainId: 1,
                provider: 'metamask',
                signature: '0xsignature'
            });
        });
        
        // Should show connected state
        expect(await screen.findByText('Connected')).toBeTruthy();
        expect(screen.getByText('0x1234...7890')).toBeTruthy();
    });

    it('handles connection error', async () => {
        mockEthereum.isMetaMask = true;
        mockEthereum.request.mockRejectedValueOnce(new Error('User rejected'));

        render(WalletConnect);

        const metaMaskBtn = screen.getByRole('button', { name: /connect with metamask/i });
        await fireEvent.click(metaMaskBtn);

        expect(await screen.findByText('Connection cancelled by user')).toBeTruthy();
    });

    it('handles copy address', async () => {
        // Manually trigger connected state via connect flow first
        mockEthereum.isMetaMask = true;
        mockEthereum.request
            .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) 
            .mockResolvedValueOnce('0x1')
            .mockResolvedValueOnce('0xsig');

        render(WalletConnect);
        
        await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
        await screen.findByText('Connected');

        const addressBtn = screen.getByRole('button', { name: /copy wallet address/i });
        await fireEvent.click(addressBtn);

        expect(writeTextMock).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890');
    });

    it('handles disconnect', async () => {
        // Connect first
        mockEthereum.isMetaMask = true;
        mockEthereum.request
            .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) 
            .mockResolvedValueOnce('0x1')
            .mockResolvedValueOnce('0xsig');

        const onDisconnect = vi.fn();
        render(WalletConnect, { onDisconnect });
        
        await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
        await screen.findByText('Connected');

        const disconnectBtn = screen.getByRole('button', { name: /disconnect wallet/i });
        await fireEvent.click(disconnectBtn);

        expect(onDisconnect).toHaveBeenCalled();
        expect(screen.getByText('Connect Your Wallet')).toBeTruthy();
    });

    it('handles network switch in advanced mode', async () => {
         // Connect first
         mockEthereum.isMetaMask = true;
         mockEthereum.request
             .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) 
             .mockResolvedValueOnce('0x1')
             .mockResolvedValueOnce('0xsig');
 
         render(WalletConnect, { 
             showAdvanced: true, 
             supportedChains: [1, 137] 
         });
         
         await fireEvent.click(screen.getByRole('button', { name: /connect with metamask/i }));
         await screen.findByText('Connected');

         // Should see switch buttons
         const polygonBtn = screen.getByRole('button', { name: 'Polygon' });
         expect(polygonBtn).toBeTruthy();

         // Switch network
         mockEthereum.request.mockResolvedValueOnce(null); // wallet_switchEthereumChain returns null on success
         await fireEvent.click(polygonBtn);

         expect(mockEthereum.request).toHaveBeenCalledWith({
             method: 'wallet_switchEthereumChain',
             params: [{ chainId: '0x89' }]
         });
    });
});
