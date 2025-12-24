import { describe, it, expect, afterEach } from 'vitest';
import * as Icons from '../src/index';
import { mount, unmount } from 'svelte';

const iconComponents = Object.entries(Icons).filter(
	([name]) => name.endsWith('Icon') && name !== 'getIcon'
);

describe('All Icons', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it.each(iconComponents)(
		'renders %s with and without accessibility props',
		(name, IconComponent) => {
			// Test Case 1: Without props
			const target1 = document.createElement('div');
			document.body.appendChild(target1);
			// @ts-ignore - Dynamic component type
			const instance1 = mount(IconComponent, { target: target1 });
			const svg1 = target1.querySelector('svg');

			expect(svg1).toBeTruthy();
			// By default, icons might not have title or aria-label, but have aria-hidden="true"
			expect(svg1?.hasAttribute('title')).toBe(false);
			expect(svg1?.hasAttribute('aria-label')).toBe(false);
			expect(svg1?.getAttribute('aria-hidden')).toBe('true');

			unmount(instance1);
			target1.remove();

			// Test Case 2: With title and aria-label
			const target2 = document.createElement('div');
			document.body.appendChild(target2);
			// @ts-ignore - Dynamic component type
			const instance2 = mount(IconComponent, {
				target: target2,
				props: {
					title: 'Test Title',
					'aria-label': 'Test Label',
					'aria-hidden': 'false', // Override default
				},
			});
			const svg2 = target2.querySelector('svg');

			expect(svg2).toBeTruthy();
			expect(svg2?.getAttribute('title')).toBe('Test Title');
			expect(svg2?.getAttribute('aria-label')).toBe('Test Label');
			// verify aria-hidden is overridden or co-exists?
			// If restProps comes last, it should override.
			expect(svg2?.getAttribute('aria-hidden')).toBe('false');

			unmount(instance2);
			target2.remove();
		}
	);
});
