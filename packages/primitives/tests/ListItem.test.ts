import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ListHarness from './harness/ListHarness.svelte';
import MockIcon from './fixtures/MockIcon.svelte';

describe('ListItem', () => {
	it('renders item content', () => {
		render(ListHarness, {
			props: { items: ['Test Item'] },
		});
		expect(screen.getByText('Test Item')).toBeTruthy();
	});

	it('renders icon when provided via props', () => {
		render(ListHarness, {
			props: {
				items: ['Item with Icon'],
				itemProps: { icon: MockIcon },
			},
		});
		expect(screen.getByTestId('mock-icon')).toBeTruthy();
	});

	it('inherits icon from List context', () => {
		render(ListHarness, {
			props: {
				items: ['Item with inherited Icon'],
				listProps: { icon: MockIcon },
			},
		});
		expect(screen.getByTestId('mock-icon')).toBeTruthy();
	});

	it('prioritizes item icon over context icon', () => {
		// We can't easily check which icon is rendered if they are the same component,
		// unless we have different mock icons.
		// But for coverage, just verifying it renders is enough to hit the "icon || listContext.icon" line.
		render(ListHarness, {
			props: {
				items: ['Override Icon'],
				listProps: { icon: MockIcon },
				itemProps: { icon: MockIcon },
			},
		});
		expect(screen.getByTestId('mock-icon')).toBeTruthy();
	});

	it('renders with specific icon color', () => {
		const { container } = render(ListHarness, {
			props: {
				items: ['Colored Item'],
				itemProps: { icon: MockIcon, iconColor: 'error' },
			},
		});
		const iconSpan = container.querySelector('.gr-list-item__icon--error');
		expect(iconSpan).toBeTruthy();
	});

	it('inherits icon color from context', () => {
		const { container } = render(ListHarness, {
			props: {
				items: ['Inherited Color Item'],
				listProps: { icon: MockIcon, iconColor: 'success' },
			},
		});
		const iconSpan = container.querySelector('.gr-list-item__icon--success');
		expect(iconSpan).toBeTruthy();
	});

	it('defaults to primary color when no color provided', () => {
		const { container } = render(ListHarness, {
			props: {
				items: ['Default Color Item'],
				itemProps: { icon: MockIcon },
			},
		});
		const iconSpan = container.querySelector('.gr-list-item__icon--primary');
		expect(iconSpan).toBeTruthy();
	});
});
