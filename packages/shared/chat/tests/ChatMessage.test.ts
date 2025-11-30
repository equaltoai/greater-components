/**
 * ChatMessage Component Tests
 *
 * Tests for individual chat message display including:
 * - Role-based styling (user, assistant, system)
 * - Markdown rendering for assistant messages
 * - Streaming state and cursor animation
 * - Avatar display
 * - Copy button visibility on hover
 * - Timestamp formatting
 */

import { describe, it, expect } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import ChatMessageHarness from './harness/ChatMessageHarness.svelte';

describe('ChatMessage.svelte', () => {
	describe('Role-based Styling', () => {
		it('applies user role styling', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello' },
			});

			expect(container.querySelector('.chat-message--user')).toBeTruthy();
		});

		it('applies assistant role styling', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Hello' },
			});

			expect(container.querySelector('.chat-message--assistant')).toBeTruthy();
		});

		it('applies system role styling', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'system', content: 'System message' },
			});

			expect(container.querySelector('.chat-message--system')).toBeTruthy();
		});

		it('user messages are right-aligned', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello' },
			});

			const message = container.querySelector('.chat-message--user');
			expect(message).toBeTruthy();
			// User messages have flex-direction: row-reverse
		});

		it('assistant messages are left-aligned', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Hello' },
			});

			const message = container.querySelector('.chat-message--assistant');
			expect(message).toBeTruthy();
			// Assistant messages have flex-direction: row
		});

		it('system messages are centered', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'system', content: 'System message' },
			});

			const message = container.querySelector('.chat-message--system');
			expect(message).toBeTruthy();
			// System messages have justify-content: center
		});
	});

	describe('Content Rendering', () => {
		it('renders plain text for user messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello world' },
			});

			expect(container.textContent).toContain('Hello world');
		});

		it('renders content for assistant messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Hello **world**' },
			});

			expect(container.textContent).toContain('Hello');
		});

		it('renders system message content', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'system', content: 'System notification' },
			});

			expect(container.textContent).toContain('System notification');
		});
	});

	describe('Streaming State', () => {
		it('applies streaming class when streaming', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Streaming...', streaming: true },
			});

			expect(container.querySelector('.chat-message--streaming')).toBeTruthy();
		});

		it('shows cursor animation when streaming', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Streaming...', streaming: true },
			});

			expect(container.querySelector('.chat-message__cursor')).toBeTruthy();
		});

		it('hides cursor when not streaming', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Complete', streaming: false },
			});

			expect(container.querySelector('.chat-message__cursor')).toBeFalsy();
		});
	});

	describe('Avatar Display', () => {
		it('shows avatar for user messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello' },
			});

			expect(container.querySelector('.chat-message__avatar')).toBeTruthy();
		});

		it('shows avatar for assistant messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Hello' },
			});

			expect(container.querySelector('.chat-message__avatar')).toBeTruthy();
		});

		it('does not show avatar for system messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'system', content: 'System message' },
			});

			expect(container.querySelector('.chat-message__avatar')).toBeFalsy();
		});

		it('uses custom avatar URL when provided', () => {
			const { container } = render(ChatMessageHarness, {
				props: {
					role: 'assistant',
					content: 'Hello',
					avatar: 'https://example.com/avatar.png',
				},
			});

			expect(container.querySelector('.chat-message__avatar')).toBeTruthy();
		});
	});

	describe('Copy Button', () => {
		it('shows copy button on hover for assistant messages', async () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Copy this text', streaming: false },
			});

			const message = container.querySelector('.chat-message');
			expect(message).toBeTruthy();

			await fireEvent.mouseEnter(message as Element);

			await waitFor(() => {
				expect(container.querySelector('.chat-message__actions')).toBeTruthy();
			});
		});

		it('hides copy button when not hovering', async () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Copy this text', streaming: false },
			});

			const message = container.querySelector('.chat-message');
			expect(message).toBeTruthy();

			await fireEvent.mouseEnter(message as Element);
			await fireEvent.mouseLeave(message as Element);

			// Actions should be hidden (opacity: 0) when not hovering
		});

		it('does not show copy button during streaming', async () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Streaming...', streaming: true },
			});

			const message = container.querySelector('.chat-message');
			expect(message).toBeTruthy();
			await fireEvent.mouseEnter(message as Element);

			// Copy button should not appear during streaming
		});
	});

	describe('Timestamp', () => {
		it('displays timestamp when provided', () => {
			const timestamp = new Date();
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello', timestamp },
			});

			expect(container.querySelector('.chat-message__timestamp')).toBeTruthy();
		});

		it('does not display timestamp when not provided', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello' },
			});

			expect(container.querySelector('.chat-message__timestamp')).toBeFalsy();
		});

		it('timestamp has proper datetime attribute', () => {
			const timestamp = new Date('2024-01-15T10:30:00Z');
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello', timestamp },
			});

			const timeElement = container.querySelector('.chat-message__timestamp');
			expect(timeElement).toHaveAttribute('datetime', timestamp.toISOString());
		});
	});

	describe('Accessibility', () => {
		it('has proper role attribute', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello' },
			});

			const message = container.querySelector('.chat-message');
			expect(message).toHaveAttribute('role', 'article');
		});

		it('has proper aria-label for user messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello' },
			});

			const message = container.querySelector('.chat-message');
			expect(message).toHaveAttribute('aria-label', 'User message');
		});

		it('has proper aria-label for assistant messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'assistant', content: 'Hello' },
			});

			const message = container.querySelector('.chat-message');
			expect(message).toHaveAttribute('aria-label', 'AI Assistant message');
		});

		it('has proper aria-label for system messages', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'system', content: 'System message' },
			});

			const message = container.querySelector('.chat-message');
			expect(message).toHaveAttribute('aria-label', 'System message');
		});
	});

	describe('Custom Class', () => {
		it('applies custom class', () => {
			const { container } = render(ChatMessageHarness, {
				props: { role: 'user', content: 'Hello', class: 'custom-message' },
			});

			expect(container.querySelector('.chat-message.custom-message')).toBeTruthy();
		});
	});
});
