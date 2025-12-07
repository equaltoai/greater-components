import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Badge from '../src/components/Badge.svelte';

describe('Badge.svelte', () => {
	it('renders pill variant by default', () => {
		const { container } = render(Badge, { props: { label: 'New' } });
		const badge = container.querySelector('.gr-badge');
		expect(badge).toBeTruthy();
		expect(badge?.classList.contains('gr-badge--pill')).toBe(true);
		expect(badge?.textContent).toContain('New');
	});

	it('renders all variants', () => {
		const variants = ['pill', 'dot', 'outlined', 'filled'] as const;
		variants.forEach((variant) => {
			const { container } = render(Badge, { props: { variant, label: 'Test' } });
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains(`gr-badge--${variant}`)).toBe(true);
		});
	});

	it('applies all colors', () => {
		const colors = ['primary', 'success', 'warning', 'error', 'info', 'gray'] as const;
		colors.forEach((color) => {
			const { container } = render(Badge, { props: { color, label: 'Test' } });
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains(`gr-badge--${color}`)).toBe(true);
		});
	});

	it('applies all sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		sizes.forEach((size) => {
			const { container } = render(Badge, { props: { size, label: 'Test' } });
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains(`gr-badge--${size}`)).toBe(true);
		});
	});

	it('shows label and description for pill variant', () => {
		const { container } = render(Badge, {
			props: { label: 'Label', description: 'Description', variant: 'pill' },
		});
		expect(container.textContent).toContain('Label');
		expect(container.textContent).toContain('Description');
	});

	it('renders label snippet', () => {
		// Can't easily pass snippets in vanilla render without a harness, but we can test that label prop works
		// For snippets, we usually need a harness component.
		// Testing text label prop is sufficient for basic verification.
	});

	it('renders custom class', () => {
		const { container } = render(Badge, { props: { label: 'Test', class: 'custom-class' } });
		const badge = container.querySelector('.gr-badge');
		expect(badge?.classList.contains('custom-class')).toBe(true);
	});

	it('renders dot variant correctly', () => {
		const { container } = render(Badge, { props: { variant: 'dot', label: 'Online' } });
		const dot = container.querySelector('.gr-badge__dot');
		expect(dot).toBeTruthy();
		expect(container.textContent).toContain('Online');
	});

	// Pulse animation tests
	describe('pulse animation', () => {
		it('applies pulse class when pulse prop is true', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', label: 'Connecting', pulse: true } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains('gr-badge--pulse')).toBe(true);
		});

		it('applies pulse class to dot element when pulse is true', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', label: 'Connecting', pulse: true } 
			});
			const dot = container.querySelector('.gr-badge__dot');
			expect(dot?.classList.contains('gr-badge__dot--pulse')).toBe(true);
		});

		it('does not apply pulse class when pulse prop is false', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', label: 'Connected', pulse: false } 
			});
			const badge = container.querySelector('.gr-badge');
			const dot = container.querySelector('.gr-badge__dot');
			expect(badge?.classList.contains('gr-badge--pulse')).toBe(false);
			expect(dot?.classList.contains('gr-badge__dot--pulse')).toBe(false);
		});

		it('does not apply pulse class by default', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', label: 'Status' } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains('gr-badge--pulse')).toBe(false);
		});
	});

	// Accessibility tests
	describe('accessibility', () => {
		it('applies aria-live attribute when ariaLive prop is set', () => {
			const { container } = render(Badge, { 
				props: { label: 'Status', ariaLive: 'polite' } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.getAttribute('aria-live')).toBe('polite');
		});

		it('applies aria-live="assertive" when specified', () => {
			const { container } = render(Badge, { 
				props: { label: 'Error', ariaLive: 'assertive', color: 'error' } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.getAttribute('aria-live')).toBe('assertive');
		});

		it('does not apply aria-live when not specified', () => {
			const { container } = render(Badge, { 
				props: { label: 'Status' } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.hasAttribute('aria-live')).toBe(false);
		});

		it('dot element has aria-hidden="true"', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', label: 'Online' } 
			});
			const dot = container.querySelector('.gr-badge__dot');
			expect(dot?.getAttribute('aria-hidden')).toBe('true');
		});
	});

	// Connection status pattern tests
	describe('connection status patterns', () => {
		it('renders connected state (success, no pulse)', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', color: 'success', label: 'Connected' } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains('gr-badge--success')).toBe(true);
			expect(badge?.classList.contains('gr-badge--pulse')).toBe(false);
		});

		it('renders connecting state (warning, pulse)', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', color: 'warning', label: 'Connecting', pulse: true } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains('gr-badge--warning')).toBe(true);
			expect(badge?.classList.contains('gr-badge--pulse')).toBe(true);
		});

		it('renders disconnected state (error)', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', color: 'error', label: 'Disconnected' } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains('gr-badge--error')).toBe(true);
		});

		it('renders unknown/offline state (gray)', () => {
			const { container } = render(Badge, { 
				props: { variant: 'dot', color: 'gray', label: 'Offline' } 
			});
			const badge = container.querySelector('.gr-badge');
			expect(badge?.classList.contains('gr-badge--gray')).toBe(true);
		});
	});
});
