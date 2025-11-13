import { describe, it, expect, afterEach } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ActivityIcon } from '../src/index';
import * as Icons from '../src/index';
import { mount, unmount, type ComponentProps } from 'svelte';

const iconsDirectory = join(process.cwd(), 'src/icons');
type ActivityIconProps = ComponentProps<typeof ActivityIcon>;

function renderIcon(props?: Partial<ActivityIconProps>) {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const instance = mount(ActivityIcon, { target, props: (props ?? {}) as ActivityIconProps });
	return {
		container: target,
		destroy: () => unmount(instance),
	};
}

afterEach(() => {
	document.body.innerHTML = '';
});

function kebabToPascal(name: string): string {
	return name
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

describe('Icons package', () => {
	it('renders ActivityIcon with default attributes and classes', () => {
		const { container, destroy } = renderIcon();
		const svg = container.querySelector('svg');

		expect(svg).toBeTruthy();
		expect(svg?.getAttribute('width')).toBe('24');
		expect(svg?.getAttribute('height')).toBe('24');
		expect(svg?.getAttribute('stroke')).toBe('currentColor');
		expect(svg?.getAttribute('stroke-width')).toBe('2');
		expect(svg?.classList.contains('gr-icon')).toBe(true);
		expect(svg?.classList.contains('gr-icon-activity')).toBe(true);
		destroy();
	});

	it('applies custom props and forwards extra attributes to the SVG element', () => {
		const { container, destroy } = renderIcon({
			size: 32,
			color: '#ff0000',
			strokeWidth: 1,
			class: 'custom-icon',
			'aria-label': 'Activity icon',
			'data-testid': 'activity-icon',
		});

		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('width')).toBe('32');
		expect(svg?.getAttribute('height')).toBe('32');
		expect(svg?.getAttribute('stroke')).toBe('#ff0000');
		expect(svg?.getAttribute('stroke-width')).toBe('1');
		expect(svg?.getAttribute('aria-label')).toBe('Activity icon');
		expect(svg?.getAttribute('data-testid')).toBe('activity-icon');
		expect(svg?.classList.contains('custom-icon')).toBe(true);
		expect(svg?.classList.contains('gr-icon-activity')).toBe(true);
		destroy();
	});

	it('exports every icon component listed in src/icons', () => {
		const iconFiles = readdirSync(iconsDirectory).filter((file) => file.endsWith('.svelte'));
		expect(iconFiles.length).toBeGreaterThan(0);

		const missingExports = iconFiles
			.map((file) => `${kebabToPascal(file.replace('.svelte', ''))}Icon`)
			.filter((exportName) => !(exportName in Icons));

		expect(missingExports).toEqual([]);
	});
});
