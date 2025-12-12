
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ActionBar from '../../src/components/ActionBar.svelte';

describe('ActionBar', () => {
    const mockCounts = {
        replies: 5,
        boosts: 1500,
        favorites: 10,
        quotes: 2
    };

    const mockStates = {
        boosted: false,
        favorited: false
    };

    it('renders counts correctly', () => {
        render(ActionBar, { props: { counts: mockCounts } });
        
        expect(screen.getByText('5')).toBeTruthy();
        expect(screen.getByText('1.5K')).toBeTruthy(); // 1500 formatted
        expect(screen.getByText('10')).toBeTruthy();
        // Assuming quote button is rendered only if handler is present
    });

    it('handles interaction clicks', async () => {
        const onReply = vi.fn();
        const onBoost = vi.fn();
        const onFavorite = vi.fn();
        
        render(ActionBar, { 
            props: { 
                counts: mockCounts, 
                handlers: { onReply, onBoost, onFavorite } 
            } 
        });
        
        const replyButton = screen.getByLabelText(/Reply/);
        await fireEvent.click(replyButton);
        expect(onReply).toHaveBeenCalled();
        
        const boostButton = screen.getByLabelText(/Boost/);
        await fireEvent.click(boostButton);
        expect(onBoost).toHaveBeenCalled();
        
        const favButton = screen.getByLabelText(/favorites/);
        await fireEvent.click(favButton);
        expect(onFavorite).toHaveBeenCalled();
    });

    it('reflects active states', () => {
        render(ActionBar, { 
            props: { 
                counts: mockCounts, 
                states: { boosted: true, favorited: true } 
            } 
        });
        
        expect(screen.getByLabelText(/Undo boost/)).toBeTruthy();
        expect(screen.getByLabelText(/Remove from favorites/)).toBeTruthy();
    });

    it('disables actions in readonly mode', async () => {
        const onReply = vi.fn();
        
        render(ActionBar, { 
            props: { 
                counts: mockCounts, 
                handlers: { onReply },
                readonly: true 
            } 
        });
        
        const replyButton = screen.getByLabelText(/Reply/);
        expect(replyButton).toBeDisabled();
        
        await fireEvent.click(replyButton);
        expect(onReply).not.toHaveBeenCalled();
    });
});
