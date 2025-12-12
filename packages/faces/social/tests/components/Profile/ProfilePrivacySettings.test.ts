import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import PrivacySettingsTest from './PrivacySettingsTest.svelte';
import { mockAccount } from '../../../src/mockData';

describe('Profile/PrivacySettings', () => {
    // We need mock privacy settings. 
    // They are usually loaded via handlers.onLoadPreferences
    // Or passed in context state if we initialize context with them.
    // ProfileRoot doesn't accept privacySettings prop directly to init state.
    // But PrivacySettings component accepts settings prop to override or init.
    
    const settings = {
        isPrivate: false,
        requireFollowApproval: false,
        hideFollowers: true,
        hideFollowing: false,
        hideRelationships: false,
        searchableBySearchEngines: true,
        discoverable: true,
        showAdultContent: false,
        autoplayGifs: true,
        autoplayVideos: false
    };

    it('renders settings', () => {
        render(PrivacySettingsTest, {
            profile: mockAccount,
            isOwnProfile: true,
            settings
        });
        
        expect(screen.getByText('Private account')).toBeTruthy();
        expect(screen.getByText('Hide followers list')).toBeTruthy();
        
        // Use regex because label includes description
        const hideFollowersCheckbox = screen.getByLabelText(/Hide followers list/i) as HTMLInputElement;
        expect(hideFollowersCheckbox.checked).toBe(true);
        
        const isPrivateCheckbox = screen.getByLabelText(/Private account/i) as HTMLInputElement;
        expect(isPrivateCheckbox.checked).toBe(false);
    });
    
    it('updates settings and saves', async () => {
        const onUpdatePrivacySettings = vi.fn();
        
        render(PrivacySettingsTest, {
            profile: mockAccount,
            isOwnProfile: true,
            settings,
            handlers: { onUpdatePrivacySettings }
        });
        
        const isPrivateCheckbox = screen.getByLabelText(/Private account/i);
        await fireEvent.click(isPrivateCheckbox);
        
        // Save button should be enabled
        const saveBtn = screen.getByText('Save Changes');
        expect(saveBtn).not.toBeDisabled();
        
        await fireEvent.click(saveBtn);
        
        expect(onUpdatePrivacySettings).toHaveBeenCalled();
        expect(onUpdatePrivacySettings.mock.calls[0][0].isPrivate).toBe(true);
    });
    
    it('resets changes', async () => {
        render(PrivacySettingsTest, {
            profile: mockAccount,
            isOwnProfile: true,
            settings
        });
        
        const isPrivateCheckbox = screen.getByLabelText(/Private account/i) as HTMLInputElement;
        await fireEvent.click(isPrivateCheckbox);
        expect(isPrivateCheckbox.checked).toBe(true);
        
        const resetBtn = screen.getByText('Reset');
        await fireEvent.click(resetBtn);
        
        expect(isPrivateCheckbox.checked).toBe(false);
    });
});
