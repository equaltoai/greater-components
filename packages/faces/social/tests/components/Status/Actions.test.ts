import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Actions from '../../../src/components/Status/Actions.svelte';

// Mock context setup
const mockStatus = {
    id: '1',
    repliesCount: 10,
    reblogsCount: 5,
    favouritesCount: 20,
    reblogged: false,
    favourited: true,
    bookmarked: false,
    quoteCount: 2,
    metadata: { lesser: { isDeleted: false } }
};

const mockHandlers = {
    onReply: vi.fn(),
    onBoost: vi.fn(),
    onFavorite: vi.fn(),
    onShare: vi.fn(),
    onQuote: vi.fn(),
    onDelete: vi.fn(),
};

const mockConfig = {
    showActions: true,
};

// We need to mock getStatusContext before importing the component or before rendering
vi.mock('../../../src/components/Status/context.js', () => ({
    getStatusContext: () => ({
        status: mockStatus,
        actualStatus: mockStatus, // For reblogs, this might be different, but for this test simpler is better
        handlers: mockHandlers,
        config: mockConfig
    })
}));

describe('Status.Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStatus.metadata = { lesser: { isDeleted: false } };
    });

    it('renders action buttons with correct counts', () => {
        render(Actions);
        
        // Reply count
        expect(screen.getByText('10')).toBeTruthy();
        
        // Boost count
        expect(screen.getByText('5')).toBeTruthy();
        
        // Favorite count
        expect(screen.getByText('20')).toBeTruthy();
        
        // Quote count
        expect(screen.getByText('2')).toBeTruthy();
    });

    it('handles reply interaction', async () => {
        render(Actions);
        
        // Find by aria-label partial match
        const replyBtn = screen.getByRole('button', { name: /Reply/i });
        await fireEvent.click(replyBtn);
        
        expect(mockHandlers.onReply).toHaveBeenCalledWith(mockStatus);
    });

    it('handles boost interaction', async () => {
        render(Actions);
        
        const boostBtn = screen.getByRole('button', { name: /Boost/i });
        await fireEvent.click(boostBtn);
        
        expect(mockHandlers.onBoost).toHaveBeenCalledWith(mockStatus);
    });

    it('handles favorite interaction', async () => {
        render(Actions);
        
        // Since favourited is true, label might change
        // "Remove from favorites"
        const favBtn = screen.getByRole('button', { name: /favorites/i });
        await fireEvent.click(favBtn);
        
        expect(mockHandlers.onFavorite).toHaveBeenCalledWith(mockStatus);
    });

    it('shows delete button when enabled', async () => {
        render(Actions, { showDelete: true });
        
        const deleteBtn = screen.getByRole('button', { name: 'Delete' });
        expect(deleteBtn).toBeTruthy();
        
        await fireEvent.click(deleteBtn);
        expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockStatus);
    });

    it('hides actions for tombstone status', async () => {
        // We need to update the mock for this test case. 
        // Vitest module mocking is hoisted, so dynamic updates need a mutable object.
        // We used const objects above. We can mutate them.
        
        mockStatus.metadata = { lesser: { isDeleted: true } };
        
        const { container } = render(Actions);
        
        // Should be empty or not render .status-actions
        expect(container.querySelector('.status-actions')).toBeNull();
    });
});
