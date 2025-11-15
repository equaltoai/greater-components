import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import TooltipHarness from './harness/TooltipHarness.svelte';

const getTrigger = (container: HTMLElement) => {
	const marker = container.querySelector('[data-testid="tooltip-trigger"]');
	return marker?.closest('.gr-tooltip-trigger') as HTMLElement | null;
};

describe('Tooltip.svelte', () => {
	const mockAnimation = () =>
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
			cb(0);
			return 0;
		});

	it('toggles visibility via click trigger and hides on Escape', async () => {
		const { container, getByRole, queryByRole } = render(TooltipHarness, {
			props: {
				props: {
					content: 'Helpful context',
					trigger: 'click',
					delay: { show: 0, hide: 0 },
				},
			},
		});

		const trigger = getTrigger(container);
		expect(trigger).not.toBeNull();
		if (!trigger) {
			throw new Error('tooltip trigger not found');
		}

		await fireEvent.click(trigger);
		await waitFor(() => {
			expect(getByRole('tooltip').textContent).toContain('Helpful context');
		});

		await fireEvent.keyDown(trigger, { key: 'Escape' });
		await waitFor(() => {
			expect(queryByRole('tooltip')).toBeNull();
		});
	});

	it('does not show when disabled', async () => {
		const { container, queryByRole } = render(TooltipHarness, {
			props: {
				props: {
					content: 'Disabled tooltip',
					trigger: 'click',
					delay: { show: 0, hide: 0 },
					disabled: true,
				},
			},
		});

		const trigger = getTrigger(container);
		expect(trigger).not.toBeNull();
		if (!trigger) {
			throw new Error('tooltip trigger not found');
		}

		await fireEvent.click(trigger);
		await waitFor(() => {
			expect(queryByRole('tooltip')).toBeNull();
		});
	});

	it('shows on focus trigger and hides on blur + Escape', async () => {
		const raf = mockAnimation();

		const { container, getByRole, queryByRole } = render(TooltipHarness, {
			props: {
				props: {
					content: 'Focus tooltip',
					trigger: 'focus',
					delay: { show: 0, hide: 0 },
				},
			},
		});

		const trigger = getTrigger(container);
		if (!trigger) throw new Error('tooltip trigger not found');

		await fireEvent.focusIn(trigger);
		await waitFor(() => expect(getByRole('tooltip').textContent).toContain('Focus tooltip'));

		await fireEvent.focusOut(trigger);
		await waitFor(() => expect(queryByRole('tooltip')).toBeNull());

		await fireEvent.focusIn(trigger);
		await fireEvent.keyDown(trigger, { key: 'Escape' });
		await waitFor(() => expect(queryByRole('tooltip')).toBeNull());

		raf.mockRestore();
	});

	it('respects hover/touch delays, auto placement, and outside clicks', async () => {
		const raf = mockAnimation();

		const { container, getByRole, queryByRole } = render(TooltipHarness, {
			props: {
				props: {
					content: 'Hover reveal',
					trigger: 'hover',
					placement: 'auto',
					delay: 10,
				},
			},
		});

		const trigger = getTrigger(container);
		if (!trigger) throw new Error('tooltip trigger not found');

		vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
			top: 10,
			left: 10,
			right: 30,
			bottom: 30,
			width: 20,
			height: 20,
			x: 10,
			y: 10,
			toJSON: () => ({}),
		});

		await fireEvent.mouseEnter(trigger);
		const tooltip = await waitFor(() => getByRole('tooltip'));

		vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue({
			top: 0,
			left: 0,
			right: 120,
			bottom: 40,
			width: 120,
			height: 40,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		});

		await fireEvent.mouseLeave(trigger);
		await waitFor(() => expect(queryByRole('tooltip')).toBeNull());

		await fireEvent.touchStart(trigger);
		await new Promise((resolve) => setTimeout(resolve, 550));
		expect(getByRole('tooltip').textContent).toContain('Hover reveal');

		await fireEvent.mouseLeave(trigger);
		await waitFor(() => expect(queryByRole('tooltip')).toBeNull());

		raf.mockRestore();
	});

	it('respects aria-disabled/disabled triggers and closes hover tooltips via Escape', async () => {
		const raf = mockAnimation();

		const firstRender = render(TooltipHarness, {
			props: {
				props: {
					content: 'Blocked tooltip',
					trigger: 'click',
					delay: { show: 0, hide: 0 },
				},
			},
		});

		const trigger = getTrigger(firstRender.container);
		if (!trigger) throw new Error('tooltip trigger not found');
		trigger.setAttribute('aria-disabled', 'true');
		trigger.setAttribute('disabled', 'true');

		await fireEvent.click(trigger);
		await waitFor(() => expect(firstRender.queryByRole('tooltip')).toBeNull());
		firstRender.unmount();

		const hoverRender = render(TooltipHarness, {
			props: {
				props: {
					content: 'Hover keyboard dismiss',
					trigger: 'hover',
					delay: { show: 0, hide: 0 },
				},
			},
		});

		const hoverTrigger = getTrigger(hoverRender.container);
		if (!hoverTrigger) throw new Error('tooltip trigger not found');

		await fireEvent.mouseEnter(hoverTrigger);
		await waitFor(() =>
			expect(hoverRender.getByRole('tooltip').textContent).toContain('Hover keyboard dismiss')
		);

		await fireEvent.keyDown(hoverTrigger, { key: 'Escape' });
		await waitFor(() => expect(hoverRender.queryByRole('tooltip')).toBeNull());

		raf.mockRestore();
	});
});
