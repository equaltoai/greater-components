import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import StreamingText from '../src/components/StreamingText.svelte';
import StreamingTextHarness from './harness/StreamingTextHarness.svelte';

describe('StreamingText.svelte', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders content', () => {
		const { container } = render(StreamingText, { props: { content: 'Hello world' } });
		expect(container.textContent).toContain('Hello world');
	});

	it('shows cursor when streaming', () => {
		const { container } = render(StreamingText, { props: { content: 'Hello', streaming: true } });
		const cursor = container.querySelector('.gr-cursor');
		expect(cursor).toBeTruthy();
	});

	it('hides cursor when not streaming', () => {
		const { container } = render(StreamingText, { props: { content: 'Hello', streaming: false } });
		const cursor = container.querySelector('.gr-cursor');
		expect(cursor).toBeFalsy();
	});

	it('uses custom cursor char', () => {
		const { container } = render(StreamingText, { props: { content: '', cursorChar: '|' } });
		const cursor = container.querySelector('.gr-cursor');
		expect(cursor?.textContent).toBe('|');
	});

	it('calls onComplete when streaming stops', async () => {
		const onComplete = vi.fn();
		const { component } = render(StreamingTextHarness, {
			props: { content: 'test', streaming: true, onComplete },
		});

		// Update prop via harness
		component.setStreaming(false);

		// Run timers for setTimeout(..., 0) in effect.
		// Do NOT use runAllTimersAsync because of infinite interval for cursor blinking.
		await vi.advanceTimersByTimeAsync(10);

		expect(onComplete).toHaveBeenCalled();
	});

	it('blinks cursor', async () => {
		const { container } = render(StreamingText, { props: { content: '', streaming: true } });
		const cursor = container.querySelector('.gr-cursor') as HTMLElement;

		// Initial state might depend on mount, but interval sets it.
		// Let's advance time to see change.

		// Initially opaque?
		// The component sets cursorVisible = true initially.
		// Then interval flips it.

		expect(cursor.classList.contains('gr-cursor--visible')).toBe(true);

		await vi.advanceTimersByTimeAsync(500);
		expect(cursor.classList.contains('gr-cursor--visible')).toBe(false);

		await vi.advanceTimersByTimeAsync(500);
		expect(cursor.classList.contains('gr-cursor--visible')).toBe(true);
	});
});
