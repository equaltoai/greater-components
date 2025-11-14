import { describe, it, expect } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import TooltipHarness from './harness/TooltipHarness.svelte';

const getTrigger = (container: HTMLElement) => {
	const marker = container.querySelector('[data-testid="tooltip-trigger"]');
	return marker?.closest('.gr-tooltip-trigger') as HTMLElement | null;
};

describe('Tooltip.svelte', () => {
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
});
