import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Breadcrumb from '../src/components/Breadcrumb.svelte';

describe('Breadcrumb.svelte', () => {
	it('renders a <nav aria-label="Breadcrumb"> by default', () => {
		const { container } = render(Breadcrumb, {
			items: [
				{ label: 'Home', href: '/' },
				{ label: 'Instances', href: '/instances' },
				{ label: 'lesser.example' },
			],
		});
		const nav = container.querySelector('nav.gr-shell-breadcrumb');
		expect(nav).toBeTruthy();
		expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
	});

	it('uses the supplied label as aria-label', () => {
		const { container } = render(Breadcrumb, {
			items: [{ label: 'Home', href: '/' }, { label: 'X' }],
			label: 'You are here',
		});
		const nav = container.querySelector('nav.gr-shell-breadcrumb');
		expect(nav?.getAttribute('aria-label')).toBe('You are here');
	});

	it('renders an <ol> list', () => {
		const { container } = render(Breadcrumb, {
			items: [{ label: 'Home', href: '/' }, { label: 'X' }],
		});
		expect(container.querySelector('ol.gr-shell-breadcrumb__list')).toBeTruthy();
	});

	it('renders items with href as anchors and items without href as spans', () => {
		const { container } = render(Breadcrumb, {
			items: [
				{ label: 'Home', href: '/' },
				{ label: 'Static' },
				{ label: 'Current', current: true },
			],
		});
		expect(container.querySelectorAll('a.gr-shell-breadcrumb__link').length).toBe(1);
		expect(container.querySelectorAll('span.gr-shell-breadcrumb__current').length).toBe(2);
	});

	it('marks the last item as current with aria-current="page" when no explicit current set', () => {
		const { container } = render(Breadcrumb, {
			items: [
				{ label: 'Home', href: '/' },
				{ label: 'Instances', href: '/instances' },
				{ label: 'lesser.example' },
			],
		});
		const current = container.querySelector('[aria-current="page"]');
		expect(current).toBeTruthy();
		expect(current?.textContent?.trim()).toBe('lesser.example');
	});

	it('respects an explicit current flag', () => {
		const { container } = render(Breadcrumb, {
			items: [
				{ label: 'Home', href: '/', current: true },
				{ label: 'X', href: '/x' },
			],
		});
		const current = container.querySelector('[aria-current="page"]');
		expect(current?.textContent?.trim()).toBe('Home');
	});

	it('hides the separator from assistive technology', () => {
		const { container } = render(Breadcrumb, {
			items: [{ label: 'Home', href: '/' }, { label: 'Next', href: '/next' }, { label: 'X' }],
		});
		const separators = container.querySelectorAll('.gr-shell-breadcrumb__separator');
		expect(separators.length).toBeGreaterThan(0);
		separators.forEach((sep) => {
			expect(sep.getAttribute('aria-hidden')).toBe('true');
		});
	});
});
