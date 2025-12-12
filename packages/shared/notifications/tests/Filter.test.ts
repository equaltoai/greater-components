import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Filter from '../src/Filter.svelte';

const mockContext = {
    state: {
        activeFilter: 'all',
    },
    updateState: vi.fn(),
    handlers: {
        onFilterChange: vi.fn(),
    },
};

vi.mock('../src/context.js', () => ({
    getNotificationsContext: () => mockContext,
}));

describe('Notifications.Filter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockContext.state.activeFilter = 'all';
    });

    it('renders all filters', () => {
        render(Filter);
        
        expect(screen.getByText('All')).toBeTruthy();
        expect(screen.getByText('Mentions')).toBeTruthy();
        expect(screen.getByText('Follows')).toBeTruthy();
        expect(screen.getByText('Boosts')).toBeTruthy();
        expect(screen.getByText('Favorites')).toBeTruthy();
        expect(screen.getByText('Polls')).toBeTruthy();
    });

    it('highlights active filter', () => {
        render(Filter);
        
        const allBtn = screen.getByText('All').closest('button');
        expect(allBtn?.getAttribute('aria-current')).toBe('page');
        
        const mentionsBtn = screen.getByText('Mentions').closest('button');
        expect(mentionsBtn?.getAttribute('aria-current')).toBe(null);
    });

    it('handles filter change', async () => {
        render(Filter);
        
        const mentionsBtn = screen.getByText('Mentions').closest('button');
        if (mentionsBtn) {
            await fireEvent.click(mentionsBtn);
            
            expect(mockContext.updateState).toHaveBeenCalledWith({ activeFilter: 'mentions' });
            expect(mockContext.handlers.onFilterChange).toHaveBeenCalledWith('mentions');
        } else {
            throw new Error('Button not found');
        }
    });
});
