import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import LinkHarness from './harness/LinkHarness.svelte';

const renderLink = (props?: Record<string, unknown>, label = 'Navigate') =>
	render(LinkHarness, {
		props: { props, label },
	});

describe('Link.svelte', () => {
	describe('Rendering', () => {
		it('renders an <a> element with href and content', () => {
			renderLink({ href: '/x' }, 'Click me');
			const link = screen.getByRole('link', { name: 'Click me' });
			expect(link.tagName).toBe('A');
			expect(link.getAttribute('href')).toBe('/x');
			expect(link.textContent?.trim()).toBe('Click me');
		});

		it('applies base gr-link class', () => {
			const { container } = renderLink({ href: '/x' });
			const link = container.querySelector('a');
			expect(link?.classList.contains('gr-link')).toBe(true);
		});
	});

	describe('Variants', () => {
		const variants = ['default', 'ghost', 'subtle', 'inline'] as const;

		variants.forEach((variant) => {
			it(`applies gr-link--${variant} when variant="${variant}"`, () => {
				const { container } = renderLink({ href: '/x', variant });
				const link = container.querySelector('a');
				expect(link?.classList.contains(`gr-link--${variant}`)).toBe(true);
			});
		});

		it('defaults to variant="default" when omitted', () => {
			const { container } = renderLink({ href: '/x' });
			const link = container.querySelector('a');
			expect(link?.classList.contains('gr-link--default')).toBe(true);
		});
	});

	describe('Sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		sizes.forEach((size) => {
			it(`applies gr-link--size-${size} for non-inline variants when size="${size}"`, () => {
				const { container } = renderLink({ href: '/x', size });
				const link = container.querySelector('a');
				expect(link?.classList.contains(`gr-link--size-${size}`)).toBe(true);
			});
		});

		it('omits size class entirely when variant="inline"', () => {
			const { container } = renderLink({ href: '/x', variant: 'inline', size: 'lg' });
			const link = container.querySelector('a');
			expect(link?.classList.contains('gr-link--size-sm')).toBe(false);
			expect(link?.classList.contains('gr-link--size-md')).toBe(false);
			expect(link?.classList.contains('gr-link--size-lg')).toBe(false);
		});

		it('defaults to size="md" when omitted (for non-inline variants)', () => {
			const { container } = renderLink({ href: '/x' });
			const link = container.querySelector('a');
			expect(link?.classList.contains('gr-link--size-md')).toBe(true);
		});
	});

	describe('Modifier-key gating', () => {
		it('fires onnavigate on plain left-click (no modifiers)', async () => {
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 0 });
			expect(onnavigate).toHaveBeenCalledTimes(1);
			expect(onnavigate.mock.calls[0][1]).toBe('/x');
		});

		it('does NOT fire onnavigate on middle-click (button=1)', async () => {
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 1 });
			expect(onnavigate).not.toHaveBeenCalled();
		});

		it('does NOT fire onnavigate on right-click (button=2)', async () => {
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 2 });
			expect(onnavigate).not.toHaveBeenCalled();
		});

		it('does NOT fire onnavigate with Cmd/Meta modifier', async () => {
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 0, metaKey: true });
			expect(onnavigate).not.toHaveBeenCalled();
		});

		it('does NOT fire onnavigate with Ctrl modifier', async () => {
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 0, ctrlKey: true });
			expect(onnavigate).not.toHaveBeenCalled();
		});

		it('does NOT fire onnavigate with Shift modifier', async () => {
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 0, shiftKey: true });
			expect(onnavigate).not.toHaveBeenCalled();
		});

		it('does NOT fire onnavigate with Alt modifier', async () => {
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 0, altKey: true });
			expect(onnavigate).not.toHaveBeenCalled();
		});

		it('does NOT fire onnavigate when upstream onclick called preventDefault', async () => {
			const onnavigate = vi.fn();
			const onclick = vi.fn((ev: MouseEvent) => ev.preventDefault());
			renderLink({ href: '/x', onnavigate, onclick });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 0 });
			expect(onclick).toHaveBeenCalledTimes(1);
			expect(onnavigate).not.toHaveBeenCalled();
		});

		it('fires consumer onclick alongside onnavigate', async () => {
			const onnavigate = vi.fn();
			const onclick = vi.fn();
			renderLink({ href: '/x', onnavigate, onclick });
			const link = screen.getByRole('link');
			await fireEvent.click(link, { button: 0 });
			expect(onclick).toHaveBeenCalledTimes(1);
			expect(onnavigate).toHaveBeenCalledTimes(1);
		});

		it('does NOT fire onnavigate when Space key is pressed (deliberate non-feature)', async () => {
			// Space on <a> is intentionally not native (Space scrolls the page).
			// Intercepting it would be an a11y anti-pattern.
			const onnavigate = vi.fn();
			renderLink({ href: '/x', onnavigate });
			const link = screen.getByRole('link');
			await fireEvent.keyDown(link, { key: ' ' });
			await fireEvent.keyUp(link, { key: ' ' });
			expect(onnavigate).not.toHaveBeenCalled();
		});
	});

	describe('rel attribute auto-injection', () => {
		it('auto-injects rel="noopener noreferrer" when target="_blank" with no rel', () => {
			const { container } = renderLink({ href: '/x', target: '_blank' });
			const link = container.querySelector('a');
			expect(link?.getAttribute('target')).toBe('_blank');
			expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
		});

		it('respects consumer-supplied rel even when target="_blank"', () => {
			const { container } = renderLink({ href: '/x', target: '_blank', rel: 'opener' });
			const link = container.querySelector('a');
			expect(link?.getAttribute('rel')).toBe('opener');
		});

		it('omits rel when no target and no rel provided', () => {
			const { container } = renderLink({ href: '/x' });
			const link = container.querySelector('a');
			expect(link?.hasAttribute('rel')).toBe(false);
		});
	});

	describe('Attribute forwarding', () => {
		it('forwards download attribute', () => {
			const { container } = renderLink({ href: '/x', download: 'report.csv' });
			const link = container.querySelector('a');
			expect(link?.getAttribute('download')).toBe('report.csv');
		});

		it('forwards aria-label', () => {
			const { container } = renderLink({ href: '/x', 'aria-label': 'Open settings' });
			const link = container.querySelector('a');
			expect(link?.getAttribute('aria-label')).toBe('Open settings');
		});

		it('forwards aria-current for active-route state', () => {
			const { container } = renderLink({ href: '/x', 'aria-current': 'page' });
			const link = container.querySelector('a');
			expect(link?.getAttribute('aria-current')).toBe('page');
		});

		it('forwards id and data-* attributes via rest-props', () => {
			const { container } = renderLink({
				href: '/x',
				id: 'my-link',
				'data-testid': 'nav-link-budgets',
			});
			const link = container.querySelector('a');
			expect(link?.getAttribute('id')).toBe('my-link');
			expect(link?.getAttribute('data-testid')).toBe('nav-link-budgets');
		});

		it('appends consumer-supplied class to base class list', () => {
			const { container } = renderLink({ href: '/x', class: 'custom-class extra' });
			const link = container.querySelector('a');
			expect(link?.classList.contains('gr-link')).toBe(true);
			expect(link?.classList.contains('custom-class')).toBe(true);
			expect(link?.classList.contains('extra')).toBe(true);
		});
	});
});
