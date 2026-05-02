import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import VerifiedFieldsTest from './VerifiedFieldsTest.svelte';
import { mockAccount } from '../../../src/mockData';

describe('Profile/VerifiedFields', () => {
	it('allows safe http links from profile fields', () => {
		const { container } = render(VerifiedFieldsTest, {
			props: {
				profile: mockAccount,
				fields: [{ name: 'Website', value: 'https://example.com', verifiedAt: '2026-01-01' }],
			},
		});

		const link = container.querySelector('.verified-fields__link') as HTMLAnchorElement | null;
		expect(link?.href).toBe('https://example.com/');
		expect(screen.getByText('https://example.com')).toBeTruthy();
	});

	it('renders unsafe href schemes as text only', () => {
		const { container } = render(VerifiedFieldsTest, {
			props: {
				profile: mockAccount,
				fields: [
					{ name: 'Bad', value: '<a href="javascript:alert(1)">bad link</a>', verifiedAt: null },
					{ name: 'Data', value: 'data:text/html,<script>alert(1)</script>', verifiedAt: null },
				],
			},
		});

		expect(container.querySelector('.verified-fields__link')).toBeNull();
		expect(screen.getByText('bad link')).toBeTruthy();
		expect(container.innerHTML).not.toContain('href="javascript:');
		expect(container.innerHTML).not.toContain('href="data:');
	});
});
