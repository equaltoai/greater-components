import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Group from '../src/Group.svelte';
import type { NotificationGroup } from '../src/types';

const mockContext = {
    config: {
        showAvatars: true,
        showTimestamps: true,
    },
    handlers: {
        onGroupClick: vi.fn(),
    },
};

vi.mock('../src/context.js', () => ({
    getNotificationsContext: () => mockContext,
}));

describe('Notifications.Group', () => {
    const mockGroup: NotificationGroup = {
        id: 'group1',
        type: 'favourite',
        notifications: [
            {
                id: '1',
                type: 'favourite',
                createdAt: '2024-01-01T12:00:00Z',
                account: { id: 'acc1', username: 'user1', displayName: 'User One', avatar: 'avatar1.png' },
                read: false,
                status: { content: '<p>Nice post</p>' }
            },
            {
                id: '2',
                type: 'favourite',
                createdAt: '2024-01-01T12:05:00Z',
                account: { id: 'acc2', username: 'user2', displayName: 'User Two', avatar: 'avatar2.png' },
                read: true,
            }
        ],
        accounts: [], // usually populated but we use notifications array for logic
        count: 2,
        latestCreatedAt: '2024-01-01T12:05:00Z',
        allRead: false,
        sampleNotification: {} as any
    } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders grouped content', () => {
        render(Group, { group: mockGroup });
        
        expect(screen.getByText(/User One and User Two/)).toBeTruthy();
        expect(screen.getByText('favorited your post')).toBeTruthy();
        expect(screen.getByText('Nice post')).toBeTruthy();
    });

    it('renders avatars', () => {
        render(Group, { group: mockGroup });
        
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0].getAttribute('src')).toBe('avatar1.png');
    });

    it('handles click', async () => {
        render(Group, { group: mockGroup });
        
        const groupEl = screen.getByRole('button');
        await fireEvent.click(groupEl);
        
        expect(mockContext.handlers.onGroupClick).toHaveBeenCalledWith(mockGroup);
    });

    it('handles enter key', async () => {
        render(Group, { group: mockGroup });
        
        const groupEl = screen.getByRole('button');
        await fireEvent.keyDown(groupEl, { key: 'Enter' });
        
        expect(mockContext.handlers.onGroupClick).toHaveBeenCalledWith(mockGroup);
    });

    it('handles space key', async () => {
        render(Group, { group: mockGroup });
        
        const groupEl = screen.getByRole('button');
        await fireEvent.keyDown(groupEl, { key: ' ' });
        
        expect(mockContext.handlers.onGroupClick).toHaveBeenCalledWith(mockGroup);
    });

    it('formats single user', () => {
        const singleGroup = { ...mockGroup, notifications: [mockGroup.notifications[0]], count: 1 };
        render(Group, { group: singleGroup });
        
        expect(screen.getByText('User One')).toBeTruthy();
        expect(screen.queryByText('and')).toBeNull();
    });

    it('formats many users', () => {
        const manyGroup = { ...mockGroup, notifications: [...mockGroup.notifications, { ...mockGroup.notifications[0], id: '3' }], count: 3 };
        render(Group, { group: manyGroup });
        
        expect(screen.getByText(/User One and 2 others/)).toBeTruthy();
    });
});
