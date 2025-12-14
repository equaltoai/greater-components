import { describe, it, expect, afterEach } from 'vitest';
import { mount, unmount } from 'svelte';
import * as Icons from '../src/index';

afterEach(() => {
	document.body.innerHTML = '';
});

// Filter only icon components
const iconEntries = Object.entries(Icons).filter(([name]) => {
	return name.endsWith('Icon') && name !== 'Icon' && name !== 'getIcon';
});

describe('Comprehensive Icon Tests', () => {
	it.each(iconEntries)('renders %s with default and custom props', (name, IconComponent) => {
		// 1. Default render (implicit defaults)
		const target1 = document.createElement('div');
		const instance1 = mount(IconComponent as any, { target: target1 });
		const svg1 = target1.querySelector('svg');

		expect(svg1).toBeTruthy();
		expect(svg1?.getAttribute('width')).toBe('24'); // Default size

		unmount(instance1);

		// 2. Custom render with all props
		const target2 = document.createElement('div');
		const props = {
			size: 48,
			color: 'red',
			strokeWidth: 3,
			class: 'custom-class',
			title: 'Custom Title',
			'aria-label': 'Custom Label',
		};
		const instance2 = mount(IconComponent as any, { target: target2, props });
		const svg2 = target2.querySelector('svg');

		expect(svg2).toBeTruthy();
		expect(svg2?.getAttribute('width')).toBe('48');
		expect(svg2?.classList.contains('custom-class')).toBe(true);

		unmount(instance2);

		// 3. Explicit undefined (should trigger defaults)
		// This helps if the compiled code checks arguments.length vs undefined
		const target3 = document.createElement('div');
		const propsUndefined = {
			size: undefined,
			color: undefined,
		};
		const instance3 = mount(IconComponent as any, { target: target3, props: propsUndefined });
		const svg3 = target3.querySelector('svg');
		expect(svg3?.getAttribute('width')).toBe('24');
		unmount(instance3);
	});
});
