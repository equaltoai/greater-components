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
            }
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
            expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                provider: 'metamask',
                address: '0x1234567890123456789012345678901234567890',
            }));
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
             expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({
                provider: 'phantom',
                address: '0xphantomaddress',
            }));
        });
    });

    it('handles unsupported chain error', async () => {
        mockEthereum.isMetaMask = true;
        mockEthereum.request
            .mockResolvedValueOnce(['0x123'])
            .mockResolvedValueOnce('0x38'); // Chain 56 (BNB) not in default [1]

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
});

