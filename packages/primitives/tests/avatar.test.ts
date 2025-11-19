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

	it('falls back to placeholder content when image fails to load', async () => {
		const { container } = render(Avatar, {
			props: { src: '/broken.png', name: 'Fran' },
		});

		const image = container.querySelector('img') as HTMLImageElement;
		await fireEvent.error(image);

		const initials = container.querySelector('.gr-avatar__initials');
		expect(initials?.textContent?.trim()).toBe('FR');
		expect(container.querySelector('.gr-avatar__fallback-icon')).toBeNull();
	});

	it('renders the default fallback icon when no name or src is available', () => {
		const { container } = render(Avatar);
		const icon = container.querySelector('.gr-avatar__fallback-image');

		expect(icon).not.toBeNull();
		expect(container.querySelector('.gr-avatar__initials')).toBeNull();
	});
});
