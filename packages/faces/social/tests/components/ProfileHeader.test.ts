
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ProfileHeader from '../../src/components/ProfileHeader.svelte';
import type { UnifiedAccount } from '@equaltoai/greater-components-adapters';

const mockAccount: UnifiedAccount = {
    id: '1',
    username: 'testuser',
    acct: 'testuser@example.com',
    displayName: 'Test User',
    url: 'https://example.com/@testuser',
    avatar: 'avatar.jpg',
    header: 'header.jpg',
    followersCount: 1500,
    followingCount: 500,
    statusesCount: 12000,
    note: '<p>Bio content</p>',
    createdAt: new Date('2023-02-15').toISOString(),
    fields: [
        { name: 'Website', value: '<a href="https://example.com">example.com</a>', verifiedAt: new Date().toISOString() },
        { name: 'Location', value: 'Earth' }
    ],
    verified: true,
    bot: false,
    locked: false,
    emojis: []
};

describe('ProfileHeader', () => {
    it('renders account information correctly', () => {
        render(ProfileHeader, { props: { account: mockAccount } });
        
        expect(screen.getByText('Test User')).toBeTruthy();
        expect(screen.getByText('@testuser@example.com')).toBeTruthy();
        expect(screen.getByAltText('Test User avatar')).toBeTruthy();
        expect(screen.getByLabelText('Profile banner')).toBeTruthy();
    });

    it('formats large numbers correctly', () => {
        render(ProfileHeader, { props: { account: mockAccount } });
        
        // 12000 -> 12K, 1500 -> 1.5K
        expect(screen.getByText('12K')).toBeTruthy();
        expect(screen.getByText('1.5K')).toBeTruthy();
        expect(screen.getByText('500')).toBeTruthy();
    });

    it('renders fields and verification', () => {
        render(ProfileHeader, { props: { account: mockAccount } });
        
        expect(screen.getByText('Website')).toBeTruthy();
        expect(screen.getByText('example.com')).toBeTruthy();
        expect(screen.getByText('Location')).toBeTruthy();
        expect(screen.getByText('Earth')).toBeTruthy();
        
        // Verified badge for field
        expect(screen.getByTitle(/Verified on/)).toBeTruthy();
    });

    it('renders bio content', () => {
        render(ProfileHeader, { props: { account: mockAccount } });
        expect(screen.getByText(/Bio content/)).toBeTruthy();
    });

    it('renders join date', () => {
        render(ProfileHeader, { props: { account: mockAccount } });
        // Use fixed date
        expect(screen.getByText(/Joined February 2023/)).toBeTruthy();
    });

    it('shows verified badge for account', () => {
        render(ProfileHeader, { props: { account: mockAccount } });
        expect(screen.getByLabelText('Verified account')).toBeTruthy();
    });
    
    it('handles clickable counts', async () => {
        const onFollowersClick = vi.fn();
        const onFollowingClick = vi.fn();
        const onPostsClick = vi.fn();
        
        render(ProfileHeader, { 
            props: { 
                account: mockAccount,
                clickableCounts: true,
                onFollowersClick,
                onFollowingClick,
                onPostsClick
            } 
        });
        
        await fireEvent.click(screen.getByLabelText(/1.5K followers/));
        expect(onFollowersClick).toHaveBeenCalled();
        
        await fireEvent.click(screen.getByLabelText(/500 following/));
        expect(onFollowingClick).toHaveBeenCalled();
        
        await fireEvent.click(screen.getByLabelText(/12K posts/));
        expect(onPostsClick).toHaveBeenCalled();
    });

    it('hides counts when configured', () => {
        render(ProfileHeader, { 
            props: { 
                account: mockAccount,
                showCounts: false
            } 
        });
        
        expect(screen.queryByText('Followers')).toBeNull();
    });
});
