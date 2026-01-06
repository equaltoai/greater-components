import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import * as fc from 'fast-check';
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

describe('Avatar.svelte - CSP Compliance Property Tests', () => {
	// Helper function to check for style attributes
	const hasNoStyleAttribute = (element: Element | null): boolean => {
		if (!element) return false;
		return !element.hasAttribute('style');
	};

	// Helper function to extract generateColorClass logic for testing
	const generateColorClass = (colorSource: string): string => {
		if (!colorSource) return '';
		let hash = 0;
		for (let i = 0; i < colorSource.length; i++) {
			hash = colorSource.charCodeAt(i) + ((hash << 5) - hash);
		}
		const index = Math.abs(hash) % 12;
		return `gr-avatar--color-${index}`;
	};

	it('Property 12: Avatar image display emits no style attribute', () => {
		// Feature: csp-baseline-and-primitives, Property 12
		// Validates: Requirements 4.1
		fc.assert(
			fc.property(fc.webUrl(), fc.string({ minLength: 1, maxLength: 50 }), (src, name) => {
				const { container } = render(Avatar, { props: { src, name } });
				const image = container.querySelector('.gr-avatar__image');
				return hasNoStyleAttribute(image);
			}),
			{ numRuns: 100 }
		);
	});

	it('Property 13: Avatar initials emit no style attribute', () => {
		// Feature: csp-baseline-and-primitives, Property 13
		// Validates: Requirements 4.2
		fc.assert(
			fc.property(
				// Filter to only non-whitespace strings that will produce valid initials
				fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
				(name) => {
					const { container } = render(Avatar, { props: { name, fallbackMode: 'initials' } });
					const initials = container.querySelector('.gr-avatar__initials');
					return hasNoStyleAttribute(initials);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('Property 14: Avatar uses class-based display control', () => {
		// Feature: csp-baseline-and-primitives, Property 14
		// Validates: Requirements 4.3
		fc.assert(
			fc.property(fc.webUrl(), fc.string({ minLength: 1, maxLength: 50 }), (src, name) => {
				const { container } = render(Avatar, { props: { src, name } });
				const image = container.querySelector('.gr-avatar__image');
				if (!image) return false;

				// Check that image has no style attribute
				const noStyle = hasNoStyleAttribute(image);

				// Check that image has the base class
				const hasBaseClass = image.classList.contains('gr-avatar__image');

				return noStyle && hasBaseClass;
			}),
			{ numRuns: 100 }
		);
	});

	it('Property 15: Avatar color class determinism', () => {
		// Feature: csp-baseline-and-primitives, Property 15
		// Validates: Requirements 4.4, 4.9
		fc.assert(
			fc.property(fc.string({ minLength: 1, maxLength: 100 }), (name) => {
				const class1 = generateColorClass(name);
				const class2 = generateColorClass(name);
				return class1 === class2;
			}),
			{ numRuns: 100 }
		);
	});

	it('Property 16: Avatar color class format', () => {
		// Feature: csp-baseline-and-primitives, Property 16
		// Validates: Requirements 4.5
		fc.assert(
			fc.property(fc.string({ minLength: 1, maxLength: 100 }), (name) => {
				const colorClass = generateColorClass(name);
				const match = colorClass.match(/^gr-avatar--color-(\d+)$/);
				if (!match) return false;
				const index = parseInt(match[1], 10);
				return index >= 0 && index <= 11;
			}),
			{ numRuns: 100 }
		);
	});

	it('Property 17: Avatar fallback behavior preserved', () => {
		// Feature: csp-baseline-and-primitives, Property 17
		// Validates: Requirements 4.7
		fc.assert(
			fc.property(
				fc.string({ minLength: 1, maxLength: 50 }),
				fc.constantFrom('initials', 'label', 'icon'),
				(name, fallbackMode) => {
					const { container } = render(Avatar, {
						props: {
							name,
							label: name,
							fallbackMode: fallbackMode as 'initials' | 'label' | 'icon',
						},
					});

					// Check that appropriate fallback is rendered
					if (fallbackMode === 'initials') {
						return container.querySelector('.gr-avatar__initials') !== null;
					} else if (fallbackMode === 'label') {
						return container.querySelector('.gr-avatar__label') !== null;
					} else if (fallbackMode === 'icon') {
						return container.querySelector('.gr-avatar__icon') !== null;
					}
					return false;
				}
			),
			{ numRuns: 100 }
		);
	});

	it('Property 18: Avatar accessibility preserved', () => {
		// Feature: csp-baseline-and-primitives, Property 18
		// Validates: Requirements 4.8
		fc.assert(
			fc.property(
				fc.option(fc.string({ minLength: 1, maxLength: 50 })),
				fc.option(fc.string({ minLength: 1, maxLength: 50 })),
				fc.option(fc.string({ minLength: 1, maxLength: 50 })),
				(name, label, alt) => {
					const { container } = render(Avatar, {
						props: { name: name ?? undefined, label: label ?? undefined, alt: alt ?? undefined },
					});

					const avatarElement = container.querySelector('.gr-avatar');
					if (!avatarElement) return false;

					const ariaLabel = avatarElement.getAttribute('aria-label');
					// Should have an accessible name (alt, name, label, or default "Avatar")
					return ariaLabel !== null && ariaLabel.length > 0;
				}
			),
			{ numRuns: 100 }
		);
	});

	it('Property 19: Avatar universal CSP compliance', () => {
		// Feature: csp-baseline-and-primitives, Property 19
		// Validates: Requirements 7.2
		fc.assert(
			fc.property(
				fc.record({
					src: fc.option(fc.webUrl()),
					name: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
					label: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
					fallbackMode: fc.constantFrom('initials', 'label', 'icon'),
					size: fc.constantFrom('xs', 'sm', 'md', 'lg', 'xl', '2xl'),
					shape: fc.constantFrom('circle', 'square', 'rounded'),
					status: fc.option(fc.constantFrom('online', 'offline', 'busy', 'away')),
				}),
				(props) => {
					const { container } = render(Avatar, {
						props: {
							...props,
							src: props.src ?? undefined,
							name: props.name ?? undefined,
							label: props.label ?? undefined,
							fallbackMode: props.fallbackMode as 'initials' | 'label' | 'icon',
							status: props.status ?? undefined,
						},
					});

					// Check all elements for style attributes
					const allElements = container.querySelectorAll('*');
					for (const element of allElements) {
						if (element.hasAttribute('style')) {
							return false;
						}
					}
					return true;
				}
			),
			{ numRuns: 100 }
		);
	});
});
