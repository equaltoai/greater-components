import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Avatar from '../src/components/Avatar.svelte';

describe('Avatar.svelte', () => {
	it('falls back to initials when no src is provided', () => {
		const { getByText, getByRole } = render(Avatar, {
			props: { name: 'Jane Doe', status: 'online' },
		});

		expect(getByText('JD')).toBeTruthy();
		expect(getByRole('status').getAttribute('aria-label')).toBe('Status: online');
	});

	it('renders as an interactive button when onclick is provided', async () => {
		const handleClick = vi.fn();
		const { getByRole } = render(Avatar, {
			props: { name: 'Sam', onclick: handleClick },
		});

		const button = getByRole('button', { name: 'Sam' });
		await fireEvent.click(button);
		expect(handleClick).toHaveBeenCalled();
	});
});
