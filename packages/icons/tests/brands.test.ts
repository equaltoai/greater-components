import { describe, it, expect, afterEach } from 'vitest';
import { mount, unmount, type ComponentProps } from 'svelte';

// Import brand icons
import GoogleIcon from '../src/icons/brands/google.svelte';
import AppleIcon from '../src/icons/brands/apple.svelte';
import MicrosoftIcon from '../src/icons/brands/microsoft.svelte';
import DiscordIcon from '../src/icons/brands/discord.svelte';

type GoogleIconProps = ComponentProps<typeof GoogleIcon>;

function renderIcon(IconComponent: typeof GoogleIcon, props?: Partial<GoogleIconProps>) {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const instance = mount(IconComponent, { target, props: (props ?? {}) as GoogleIconProps });
	return {
		container: target,
		destroy: () => unmount(instance),
	};
}

afterEach(() => {
	document.body.innerHTML = '';
});

describe('Brand Icons', () => {
	describe('GoogleIcon', () => {
		it('renders with default attributes', () => {
			const { container, destroy } = renderIcon(GoogleIcon);
			const svg = container.querySelector('svg');

			expect(svg).toBeTruthy();
			expect(svg?.getAttribute('width')).toBe('24');
			expect(svg?.getAttribute('height')).toBe('24');
			expect(svg?.getAttribute('fill')).toBe('currentColor');
			expect(svg?.classList.contains('gr-icon')).toBe(true);
			expect(svg?.classList.contains('gr-icon-google')).toBe(true);
			destroy();
		});

		it('uses fill instead of stroke (brand icon pattern)', () => {
			const { container, destroy } = renderIcon(GoogleIcon);
			const svg = container.querySelector('svg');

			// Brand icons should use fill, not stroke
			expect(svg?.getAttribute('fill')).toBe('currentColor');
			expect(svg?.getAttribute('stroke')).toBeNull();
			destroy();
		});

		it('applies custom size and color', () => {
			const { container, destroy } = renderIcon(GoogleIcon, {
				size: 32,
				color: '#4285f4',
			});
			const svg = container.querySelector('svg');

			expect(svg?.getAttribute('width')).toBe('32');
			expect(svg?.getAttribute('height')).toBe('32');
			expect(svg?.getAttribute('fill')).toBe('#4285f4');
			destroy();
		});
	});

	describe('AppleIcon', () => {
		it('renders with default attributes', () => {
			const { container, destroy } = renderIcon(AppleIcon);
			const svg = container.querySelector('svg');

			expect(svg).toBeTruthy();
			expect(svg?.getAttribute('fill')).toBe('currentColor');
			expect(svg?.classList.contains('gr-icon-apple')).toBe(true);
			destroy();
		});
	});

	describe('MicrosoftIcon', () => {
		it('renders with default attributes', () => {
			const { container, destroy } = renderIcon(MicrosoftIcon);
			const svg = container.querySelector('svg');

			expect(svg).toBeTruthy();
			expect(svg?.getAttribute('fill')).toBe('currentColor');
			expect(svg?.classList.contains('gr-icon-microsoft')).toBe(true);
			destroy();
		});

		it('renders four-square logo pattern', () => {
			const { container, destroy } = renderIcon(MicrosoftIcon);
			const paths = container.querySelectorAll('path');

			// Microsoft logo has a single path with four rectangles
			expect(paths.length).toBeGreaterThan(0);
			destroy();
		});
	});

	describe('DiscordIcon', () => {
		it('renders with default attributes', () => {
			const { container, destroy } = renderIcon(DiscordIcon);
			const svg = container.querySelector('svg');

			expect(svg).toBeTruthy();
			expect(svg?.getAttribute('fill')).toBe('currentColor');
			expect(svg?.classList.contains('gr-icon-discord')).toBe(true);
			destroy();
		});
	});

	describe('All brand icons', () => {
		const brandIcons = [
			{ name: 'google', Component: GoogleIcon },
			{ name: 'apple', Component: AppleIcon },
			{ name: 'microsoft', Component: MicrosoftIcon },
			{ name: 'discord', Component: DiscordIcon },
		];

		brandIcons.forEach(({ name, Component }) => {
			it(`${name} icon has aria-hidden for decorative use`, () => {
				const { container, destroy } = renderIcon(Component);
				const svg = container.querySelector('svg');

				expect(svg?.getAttribute('aria-hidden')).toBe('true');
				destroy();
			});

			it(`${name} icon accepts custom class`, () => {
				const { container, destroy } = renderIcon(Component, {
					class: 'custom-brand-icon',
				});
				const svg = container.querySelector('svg');

				expect(svg?.classList.contains('custom-brand-icon')).toBe(true);
				destroy();
			});
		});
	});
});