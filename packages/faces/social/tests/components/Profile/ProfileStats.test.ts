import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import StatsTest from './StatsTest.svelte';
import { mockAccount } from '../../../src/mockData';

describe('Profile/Stats', () => {
    // formatCount utility formats numbers. 1234 -> 1.2K
    const profile = {
        ...mockAccount,
        statusesCount: 1234,
        followingCount: 567,
        followersCount: 8910
    };

    it('renders stats counts', () => {
        render(StatsTest, { profile });
        
        // 1234 -> 1.2K
        expect(screen.getByText('1.2K')).toBeTruthy();
        expect(screen.getByText('Posts')).toBeTruthy();
        
        // 567 -> 567
        expect(screen.getByText('567')).toBeTruthy();
        expect(screen.getByText('Following')).toBeTruthy();
        
        // 8910 -> 8.9K
        expect(screen.getByText('8.9K')).toBeTruthy();
        expect(screen.getByText('Followers')).toBeTruthy();
    });
    
    it('handles clicks', async () => {
        // We can't spy on dispatchEvent easily unless we add listener.
        // But the component dispatches 'statClick' event.
        
        const { component } = render(StatsTest, { profile, clickable: true });
        
        // We can attach event listener to window or verify if buttons are clickable.
        // The component uses dispatchEvent (which dispatches on the component element or window? dispatchEvent() is global window function if not called on element).
        // Wait, Stats.svelte calls `dispatchEvent(event)`. In Svelte component `dispatchEvent` usually refers to DOM `dispatchEvent` if not `createEventDispatcher`.
        // `Stats.svelte` uses `dispatchEvent(event)` which is native DOM method on `window` (global scope) or `this`?
        // Svelte 5 runes mode: code is just JS. `dispatchEvent` is `window.dispatchEvent` unless defined.
        
        // Let's check Stats.svelte again:
        // function handleClick(type) { ... dispatchEvent(event); }
        // If it's `dispatchEvent` global, it fires on window.
        
        const listener = vi.fn();
        window.addEventListener('statClick', listener);
        
        const followingBtn = screen.getByText('Following').closest('button');
        expect(followingBtn).toBeTruthy();
        await fireEvent.click(followingBtn!);
        
        expect(listener).toHaveBeenCalled();
        expect(listener.mock.calls[0][0].detail.type).toBe('following');
        
        window.removeEventListener('statClick', listener);
    });
});
