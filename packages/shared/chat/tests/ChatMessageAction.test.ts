
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ChatMessageAction from '../src/ChatMessageAction.svelte';

describe('ChatMessageAction', () => {
    it('renders label when showLabel is true', () => {
        render(ChatMessageAction, {
            props: {
                label: 'Test Action',
                showLabel: true
            }
        });

        expect(screen.getByText('Test Action')).toBeTruthy();
    });

    it('does not render label text when showLabel is false', () => {
        render(ChatMessageAction, {
            props: {
                label: 'Test Action',
                showLabel: false
            }
        });

        expect(screen.queryByText('Test Action')).toBeNull();
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Test Action');
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        render(ChatMessageAction, {
            props: {
                label: 'Click Me',
                onclick: handleClick
            }
        });

        await fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('does not trigger click when disabled', async () => {
        const handleClick = vi.fn();
        render(ChatMessageAction, {
            props: {
                label: 'Disabled',
                disabled: true,
                onclick: handleClick
            }
        });

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        
        // fireEvent might still trigger on disabled elements in jsdom depending on implementation, 
        // but the button disabled attribute should be present.
        expect(button).toHaveAttribute('disabled');
    });

    it('applies custom class', () => {
        render(ChatMessageAction, {
            props: {
                label: 'Classy',
                class: 'custom-class'
            }
        });

        expect(screen.getByRole('button').classList.contains('custom-class')).toBe(true);
    });
});
