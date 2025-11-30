/**
 * ChatToolCall Component Tests
 *
 * Tests for the tool call display component including:
 * - Collapsible behavior
 * - Status indicator states
 * - Tool icon mapping
 * - Arguments display
 * - Result truncation
 */

import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ChatToolCallHarness from './harness/ChatToolCallHarness.svelte';
import type { ToolCall } from '../src/types.js';

const createMockToolCall = (overrides: Partial<ToolCall> = {}): ToolCall => ({
	id: 'tc_123',
	tool: 'query_knowledge',
	args: { query: 'test query' },
	status: 'complete',
	...overrides,
});

describe('ChatToolCall.svelte', () => {
	describe('Rendering', () => {
		it('renders tool call card', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall() },
			});

			expect(container.querySelector('.chat-tool-call')).toBeTruthy();
		});

		it('applies custom class', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					class: 'custom-tool-call',
				},
			});

			expect(container.querySelector('.chat-tool-call.custom-tool-call')).toBeTruthy();
		});
	});

	describe('Status Indicators', () => {
		it('shows pending status indicator', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall({ status: 'pending' }) },
			});

			expect(container.querySelector('.chat-tool-call--pending')).toBeTruthy();
			expect(container.querySelector('.chat-tool-call__status-icon--pending')).toBeTruthy();
		});

		it('shows running status indicator', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall({ status: 'running' }) },
			});

			expect(container.querySelector('.chat-tool-call--running')).toBeTruthy();
			expect(container.querySelector('.chat-tool-call__status-icon--running')).toBeTruthy();
		});

		it('shows complete status indicator', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall({ status: 'complete' }) },
			});

			expect(container.querySelector('.chat-tool-call--complete')).toBeTruthy();
			expect(container.querySelector('.chat-tool-call__status-icon--complete')).toBeTruthy();
		});

		it('shows error status indicator', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({
						status: 'error',
						error: 'Something went wrong',
					}),
				},
			});

			expect(container.querySelector('.chat-tool-call--error')).toBeTruthy();
			expect(container.querySelector('.chat-tool-call__status-icon--error')).toBeTruthy();
		});
	});

	describe('Tool Name Display', () => {
		it('displays formatted tool name', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall({ tool: 'query_knowledge' }) },
			});

			expect(container.textContent).toContain('Query Knowledge');
		});

		it('displays search tool name', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall({ tool: 'search' }) },
			});

			expect(container.textContent).toContain('Search');
		});

		it('displays read_file tool name', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall({ tool: 'read_file' }) },
			});

			expect(container.textContent).toContain('Read File');
		});
	});

	describe('Collapsible Behavior', () => {
		it('starts collapsed by default', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					collapsible: true,
					defaultCollapsed: true,
				},
			});

			expect(container.querySelector('.chat-tool-call--expanded')).toBeFalsy();
		});

		it('starts expanded when defaultCollapsed is false', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					collapsible: true,
					defaultCollapsed: false,
				},
			});

			expect(container.querySelector('.chat-tool-call--expanded')).toBeTruthy();
		});

		it('toggles expanded state on click', async () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					collapsible: true,
					defaultCollapsed: true,
				},
			});

			const header = container.querySelector('.chat-tool-call__header');
			expect(header).toBeTruthy();
			await fireEvent.click(header as Element);

			expect(container.querySelector('.chat-tool-call--expanded')).toBeTruthy();
		});

		it('toggles on Enter key', async () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					collapsible: true,
					defaultCollapsed: true,
				},
			});

			const header = container.querySelector('.chat-tool-call__header');
			expect(header).toBeTruthy();
			await fireEvent.keyDown(header as Element, { key: 'Enter' });

			expect(container.querySelector('.chat-tool-call--expanded')).toBeTruthy();
		});

		it('toggles on Space key', async () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					collapsible: true,
					defaultCollapsed: true,
				},
			});

			const header = container.querySelector('.chat-tool-call__header');
			expect(header).toBeTruthy();
			await fireEvent.keyDown(header as Element, { key: ' ' });

			expect(container.querySelector('.chat-tool-call--expanded')).toBeTruthy();
		});

		it('does not toggle when not collapsible', async () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					collapsible: false,
				},
			});

			// Content should always be visible when not collapsible
			expect(container.querySelector('.chat-tool-call__content')).toBeTruthy();
		});
	});

	describe('Arguments Display', () => {
		it('displays arguments section', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({
						args: { query: 'test', limit: 10 },
					}),
					defaultCollapsed: false,
				},
			});

			expect(container.textContent).toContain('Arguments');
		});

		it('displays arguments as JSON', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({
						args: { query: 'test' },
					}),
					defaultCollapsed: false,
				},
			});

			expect(container.textContent).toContain('query');
			expect(container.textContent).toContain('test');
		});
	});

	describe('Result Display', () => {
		it('displays result when showResult is true', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({
						result: 'Found 3 results',
					}),
					showResult: true,
					defaultCollapsed: false,
				},
			});

			expect(container.textContent).toContain('Result');
			expect(container.textContent).toContain('Found 3 results');
		});

		it('hides result when showResult is false', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({
						result: 'Found 3 results',
					}),
					showResult: false,
					defaultCollapsed: false,
				},
			});

			expect(container.textContent).not.toContain('Found 3 results');
		});

		it('displays error message when status is error', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({
						status: 'error',
						error: 'Network timeout',
					}),
					defaultCollapsed: false,
				},
			});

			expect(container.textContent).toContain('Error');
			expect(container.textContent).toContain('Network timeout');
		});

		it('truncates long results', () => {
			const longResult = 'a'.repeat(500);
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({ result: longResult }),
					defaultCollapsed: false,
				},
			});

			// Should show truncated result with "Show more" button
			expect(container.textContent).toContain('...');
		});

		it('shows "Show more" button for long results', () => {
			const longResult = 'a'.repeat(500);
			const { getByText } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({ result: longResult }),
					defaultCollapsed: false,
				},
			});

			expect(getByText('Show more')).toBeInTheDocument();
		});

		it('expands result on "Show more" click', async () => {
			const longResult = 'a'.repeat(500);
			const { getByText } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({ result: longResult }),
					defaultCollapsed: false,
				},
			});

			await fireEvent.click(getByText('Show more'));

			expect(getByText('Show less')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('header has aria-expanded attribute when collapsible', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall(),
					collapsible: true,
					defaultCollapsed: true,
				},
			});

			const header = container.querySelector('.chat-tool-call__header');
			expect(header).toHaveAttribute('aria-expanded', 'false');
		});

		it('header has aria-controls attribute when collapsible', () => {
			const { container } = render(ChatToolCallHarness, {
				props: {
					toolCall: createMockToolCall({ id: 'tc_123' }),
					collapsible: true,
				},
			});

			const header = container.querySelector('.chat-tool-call__header');
			expect(header).toHaveAttribute('aria-controls', 'tool-call-content-tc_123');
		});

		it('status has aria-label', () => {
			const { container } = render(ChatToolCallHarness, {
				props: { toolCall: createMockToolCall({ status: 'complete' }) },
			});

			const status = container.querySelector('.chat-tool-call__status');
			expect(status).toHaveAttribute('aria-label', 'Status: complete');
		});
	});
});
