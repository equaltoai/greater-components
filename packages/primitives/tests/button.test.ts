import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ButtonHarness from './harness/ButtonHarness.svelte';

const renderButton = (props?: Record<string, unknown>, label = 'Action') =>
	render(ButtonHarness, {
		props: { props, label },
	});

describe('Button.svelte', () => {
	it('calls onclick when enabled', async () => {
		const handleClick = vi.fn();
		const { getByRole } = renderButton({ onclick: handleClick });

		await fireEvent.click(getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('prevents clicks when disabled', async () => {
		const handleClick = vi.fn();
		const { getByRole } = renderButton({ disabled: true, onclick: handleClick });

		await fireEvent.click(getByRole('button'));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('shows loading spinner and suppresses clicks when loading', async () => {
		const handleClick = vi.fn();
		const { getByRole, container } = renderButton({ loading: true, onclick: handleClick });

		await fireEvent.click(getByRole('button'));
		expect(handleClick).not.toHaveBeenCalled();
		expect(container.querySelector('.gr-button__spinner')).toBeTruthy();
	});
});
