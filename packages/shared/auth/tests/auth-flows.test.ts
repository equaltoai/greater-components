import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TestWrapper from './fixtures/TestWrapper.svelte';
import OAuthConsent from '../src/OAuthConsent.svelte';
import TwoFactorVerify from '../src/TwoFactorVerify.svelte';
import WebAuthnSetup from '../src/WebAuthnSetup.svelte';

describe('Auth Flow Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('OAuth Consent Flow', () => {
        const clientInfo = {
            name: 'Test App',
            website: 'https://example.com',
            description: 'A test app',
        };
        const scopes = [{ id: 'read', name: 'Read', description: 'Read access' }];
        const defaultProps = {
            clientInfo,
            scopes,
            clientId: 'client-123',
            redirectUri: 'https://example.com/cb',
            state: 'xyzState',
        };

        it('completes successful authorization flow', async () => {
            const onOAuthAuthorize = vi.fn().mockResolvedValue(undefined);
            
            render(TestWrapper, {
                component: OAuthConsent,
                handlers: { onOAuthAuthorize },
                ...defaultProps
            });

            const authorizeBtn = screen.getByRole('button', { name: /Authorize Test App/i });
            await fireEvent.click(authorizeBtn);

            expect(onOAuthAuthorize).toHaveBeenCalledWith({
                clientId: 'client-123',
                redirectUri: 'https://example.com/cb',
                scope: ['read'],
                state: 'xyzState',
            });
            
            // Should verify loading state handling if possible, but immediate resolve makes it hard to catch 'loading' true.
            // But we can check that error is not present.
            expect(screen.queryByRole('alert')).toBeNull();
        });

        it('handles authorization failure flow', async () => {
            const onOAuthAuthorize = vi.fn().mockRejectedValue(new Error('Consent denied by server'));
            
            render(TestWrapper, {
                component: OAuthConsent,
                handlers: { onOAuthAuthorize },
                ...defaultProps
            });

            const authorizeBtn = screen.getByRole('button', { name: /Authorize Test App/i });
            await fireEvent.click(authorizeBtn);

            expect(onOAuthAuthorize).toHaveBeenCalled();
            
            const alert = await screen.findByRole('alert');
            expect(alert.textContent).toContain('Consent denied by server');
        });
    });

    describe('2FA Recovery Flow', () => {
        const initialState = {
            twoFactorSession: {
                email: 'user@example.com',
                methods: ['totp', 'backup'] as any
            }
        };

        it('allows recovery via backup code', async () => {
            const onTwoFactorVerify = vi.fn().mockResolvedValue(undefined);

            render(TestWrapper, {
                component: TwoFactorVerify,
                handlers: { onTwoFactorVerify },
                initialState
            });

            // Switch to backup tab
            const backupTab = screen.getByRole('button', { name: /Backup Code/i });
            await fireEvent.click(backupTab);

            // Enter backup code
            const input = screen.getByLabelText('Backup Code');
            await fireEvent.input(input, { target: { value: 'BACKUP-CODE-123' } });

            // Verify
            const verifyBtn = screen.getByRole('button', { name: 'Verify' });
            await fireEvent.click(verifyBtn);

            expect(onTwoFactorVerify).toHaveBeenCalledWith({
                code: 'BACKUP-CODE-123',
                method: 'backup'
            });
        });

        it('handles invalid backup code', async () => {
            const onTwoFactorVerify = vi.fn().mockRejectedValue(new Error('Invalid backup code'));

            render(TestWrapper, {
                component: TwoFactorVerify,
                handlers: { onTwoFactorVerify },
                initialState
            });

            // Switch to backup tab
            await fireEvent.click(screen.getByRole('button', { name: /Backup Code/i }));

            // Enter invalid code
            await fireEvent.input(screen.getByLabelText('Backup Code'), { target: { value: 'WRONG-CODE' } });
            await fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

            // Check for error
            const alert = await screen.findByRole('alert');
            expect(alert.textContent).toContain('Invalid backup code');
        });
    });

    describe('WebAuthn Unsupported Browser', () => {
        const originalNavigator = window.navigator;

        afterEach(() => {
            // Restore navigator
            Object.defineProperty(window, 'navigator', {
                value: originalNavigator,
                writable: true,
                configurable: true,
            });
        });

        it('displays unavailable message when WebAuthn is not supported', async () => {
            // Mock navigator to remove credentials. 
            // We use an empty object (or partial) that definitely lacks 'credentials' key.
            // Spreading originalNavigator might copy 'credentials' if it was own property, 
            // or we need to ensure it's not present.
            Object.defineProperty(window, 'navigator', {
                value: {}, 
                writable: true,
                configurable: true,
            });

            // Verify mock
            expect('credentials' in window.navigator).toBe(false);

            render(TestWrapper, {
                component: WebAuthnSetup,
                email: 'user@example.com'
            });

            expect(screen.getByText(/WebAuthn is not available/i)).toBeTruthy();
            expect(screen.getByText(/Please use a modern browser/i)).toBeTruthy();
            
            expect(screen.queryByRole('button', { name: /Set Up Now/i })).toBeNull();
        });

        it('displays setup intro when WebAuthn IS supported', async () => {
             // Mock navigator to have credentials
             Object.defineProperty(window, 'navigator', {
                value: { ...originalNavigator, credentials: {} },
                writable: true,
                configurable: true,
            });

            render(TestWrapper, {
                component: WebAuthnSetup,
                email: 'user@example.com'
            });

            expect(screen.queryByText(/WebAuthn is not available/i)).toBeNull();
            expect(screen.getByRole('button', { name: /Set Up Now/i })).toBeTruthy();
        });
    });
});
