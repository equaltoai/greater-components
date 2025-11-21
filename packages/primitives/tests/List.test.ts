import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import List from '../src/components/List.svelte';
import ListItem from '../src/components/ListItem.svelte';
import ListHarness from './harness/ListHarness.svelte';

describe('List.svelte', () => {
	it('renders ul by default', () => {
		const { container } = render(ListHarness);
		const list = container.querySelector('ul');
		expect(list).toBeTruthy();
		expect(list?.classList.contains('gr-list')).toBe(true);
	});

	it('renders ol when ordered is true', () => {
		const { container } = render(ListHarness, { props: { listProps: { ordered: true } } });
		const list = container.querySelector('ol');
		expect(list).toBeTruthy();
	});

	it('applies spacing class', () => {
		const { container } = render(ListHarness, { props: { listProps: { spacing: 'lg' } } });
		const list = container.querySelector('.gr-list');
		expect(list?.classList.contains('gr-list--spacing-lg')).toBe(true);
	});

	it('applies max-width style', () => {
		const { container } = render(ListHarness, { props: { listProps: { maxWidth: 500 } } });
		const list = container.querySelector('.gr-list') as HTMLElement;
		expect(list.style.maxWidth).toBe('500px');
	});

	it('renders ListItem children correctly', () => {
		const { getByText } = render(ListHarness, {
			props: { items: ['Item 1', 'Item 2'] },
		});
		expect(getByText('Item 1')).toBeTruthy();
		expect(getByText('Item 2')).toBeTruthy();
	});

	// To test icon injection, we need a mock icon component and check if it renders.
	// But ListHarness might not be enough if it doesn't pass icon prop to List properly or if we can't inspect the icon.
	// We'll rely on class checks if possible or SVG presence.
});
