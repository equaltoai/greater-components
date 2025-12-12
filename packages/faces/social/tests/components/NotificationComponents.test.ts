
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import NotificationItem from '../../src/components/NotificationItem.svelte';
import NotificationsFeed from '../../src/components/NotificationsFeed.svelte';
import type { Notification, NotificationGroup } from '../../src/types';

// Mock types since we don't have the full type definition here
const mockAccount = {
    id: '1',
    username: 'testuser',
    acct: 'testuser',
    displayName: 'Test User',
    url: 'https://example.com/@testuser',
    avatar: 'avatar.jpg',
    header: 'header.jpg',
    followersCount: 100,
    followingCount: 50,
    statusesCount: 10,
    note: '',
    createdAt: new Date().toISOString()
};

const mockNotification: Notification = {
    id: 'notif1',
    type: 'mention',
    createdAt: new Date().toISOString(),
    account: mockAccount,
    status: {
        id: 'status1',
        content: 'Hello @user',
        account: mockAccount,
        uri: 'uri',
        url: 'url',
        createdAt: new Date().toISOString(),
        emojis: [],
        repliesCount: 0,
        reblogsCount: 0,
        favouritesCount: 0,
        mediaAttachments: [],
        mentions: [],
        tags: [],
        visibility: 'public',
        spoilerText: '',
        sensitive: false
    }
};

describe('NotificationItem', () => {
    it('renders mention notification correctly', () => {
        render(NotificationItem, { props: { notification: mockNotification } });
        
        expect(screen.getByText(/Test User mentioned you/)).toBeTruthy();
        expect(screen.getByAltText('Test User (@testuser)')).toBeTruthy(); // Alt text for avatar
    });

    it('renders unread indicator', () => {
        const unreadNotif = { ...mockNotification, read: false };
        const { container } = render(NotificationItem, { props: { notification: unreadNotif } });
        
        expect(container.querySelector('.unread-indicator')).toBeTruthy();
    });

    it('handles click events', async () => {
        const onClick = vi.fn();
        render(NotificationItem, { props: { notification: mockNotification, onClick } });
        
        const article = screen.getByRole('button');
        await fireEvent.click(article);
        
        expect(onClick).toHaveBeenCalledWith(mockNotification);
    });

    it('handles mark as read action', async () => {
        const onMarkAsRead = vi.fn();
        const unreadNotif = { ...mockNotification, read: false };
        
        render(NotificationItem, { 
            props: { 
                notification: unreadNotif, 
                onMarkAsRead 
            } 
        });
        
        const markReadButton = screen.getByLabelText('Mark notification as read');
        await fireEvent.click(markReadButton);
        
        expect(onMarkAsRead).toHaveBeenCalledWith(unreadNotif.id);
    });
    
    it('handles dismiss action', async () => {
        const onDismiss = vi.fn();
        
        render(NotificationItem, { 
            props: { 
                notification: mockNotification, 
                onDismiss 
            } 
        });
        
        const dismissButton = screen.getByLabelText('Dismiss notification');
        await fireEvent.click(dismissButton);
        
        expect(onDismiss).toHaveBeenCalledWith(mockNotification.id);
    });
});

describe('NotificationsFeed', () => {
    // Mock the virtualizer
    vi.mock('@tanstack/svelte-virtual', () => ({
        createVirtualizer: () => ({
            subscribe: (run: any) => {
                run({
                    getVirtualItems: () => [
                        { index: 0, start: 0, size: 50, measureElement: () => {} }
                    ],
                    getTotalSize: () => 50
                });
                return () => {};
            }
        })
    }));

    // Mock notification grouping
    vi.mock('../../src/utils/notificationGrouping', () => ({
        groupNotifications: (notifs: any[]) => notifs, // Return as is for simplicity
        getGroupTitle: () => 'Group Title',
        getNotificationIcon: () => 'bell',
        getNotificationColor: () => 'blue',
        formatNotificationTime: () => 'just now',
        shouldHighlightNotification: () => false
    }));

    it('renders empty state', () => {
        render(NotificationsFeed, { props: { notifications: [] } });
        expect(screen.getByText('No notifications')).toBeTruthy();
    });

    it('renders loading state', () => {
        render(NotificationsFeed, { props: { notifications: [], loading: true } });
        expect(screen.getByText('Loading notifications...')).toBeTruthy();
    });

    it('renders list of notifications', async () => {
        const notifications = [mockNotification];
        
        render(NotificationsFeed, { props: { notifications, grouped: false } });
        
        // Due to virtualization mock, it should render the item
        expect(screen.getByText(/Test User mentioned you/)).toBeTruthy();
    });

    it('handles mark all as read', async () => {
        const onMarkAllAsRead = vi.fn();
        const notifications = [{ ...mockNotification, read: false }];
        
        render(NotificationsFeed, { 
            props: { 
                notifications, 
                onMarkAllAsRead 
            } 
        });
        
        expect(screen.getByText('1 unread')).toBeTruthy();
        
        const button = screen.getByText('Mark all as read');
        await fireEvent.click(button);
        
        expect(onMarkAllAsRead).toHaveBeenCalled();
    });
});
