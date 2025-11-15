import { describe, expect, it } from 'vitest';
import { mount, unmount } from 'svelte';
import * as Icons from '../src/index';

const iconEntries = Object.entries(Icons).filter(
	([name]) => name.endsWith('Icon') && name !== 'getIcon' && name !== 'iconList'
);

describe('Icons SSR', () => {
	it('SSR renders every exported icon with expected SVG attributes', () => {
		expect(iconEntries.length).toBeGreaterThan(0);

		for (const [name, Icon] of iconEntries) {
			const props = { size: 20, 'data-name': name };

			const html =
				typeof (Icon as { render?: (props: Record<string, unknown>) => { html: string } }).render ===
				'function'
					? (Icon as { render: (props: Record<string, unknown>) => { html: string } }).render(props).html
					: (() => {
							const target = document.createElement('div');
							 
							const instance = mount(Icon as any, { target, props });
							const markup = target.innerHTML;
							unmount(instance);
							return markup;
						})();

			const doc = new DOMParser().parseFromString(html, 'text/html');
			const svg = doc.querySelector('svg');

			if (!svg) {
				throw new Error(`Missing svg output for ${name}`);
			}

			expect(svg.getAttribute('aria-hidden')).toBe('true');
			expect(svg.getAttribute('width')).toBe('20');
			expect(svg.getAttribute('height')).toBe('20');
			expect(svg.getAttribute('data-name')).toBe(name);
			expect(svg.getAttribute('class')).toContain('gr-icon');
		}
	});

	it('supports accessible rendering with aria labels and titles', () => {
		const Icon = Icons.AlertCircleIcon;
		const html =
			typeof (Icon as { render?: (props: Record<string, unknown>) => { html: string } }).render ===
			'function'
				? (Icon as { render: (props: Record<string, unknown>) => { html: string } }).render({
						size: 16,
						'aria-label': 'Alert',
						title: 'Icon title',
					}).html
				: (() => {
						const target = document.createElement('div');
						 
						const instance = mount(Icon as any, {
							target,
							props: { size: 16, 'aria-label': 'Alert', title: 'Icon title' },
						});
						const markup = target.innerHTML;
						unmount(instance);
						return markup;
					})();

		const doc = new DOMParser().parseFromString(html, 'text/html');
		const svg = doc.querySelector('svg');
		if (!svg) throw new Error('Icon SVG missing');

		expect(svg.getAttribute('aria-label')).toBe('Alert');
		expect(svg.getAttribute('title')).toBe('Icon title');
		expect(svg.getAttribute('aria-hidden')).toBe('true');
		expect(svg.getAttribute('width')).toBe('16');
		expect(svg.getAttribute('height')).toBe('16');
	});
});
