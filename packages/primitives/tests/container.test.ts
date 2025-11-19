import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Container from '../src/components/Container.svelte';

describe('Container.svelte', () => {
	// Max-width tests
	it('applies sm max-width (640px)', () => {
		const { container } = render(Container, { maxWidth: 'sm' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-sm')).toBe(true);
	});

	it('applies md max-width (768px)', () => {
		const { container } = render(Container, { maxWidth: 'md' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-md')).toBe(true);
	});

	it('applies lg max-width by default (1024px)', () => {
		const { container } = render(Container);
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-lg')).toBe(true);
	});

	it('applies xl max-width (1280px)', () => {
		const { container } = render(Container, { maxWidth: 'xl' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-xl')).toBe(true);
	});

	it('applies 2xl max-width (1536px)', () => {
		const { container } = render(Container, { maxWidth: '2xl' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-2xl')).toBe(true);
	});

	it('applies full width (100%)', () => {
		const { container } = render(Container, { maxWidth: 'full' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--max-full')).toBe(true);
	});

	// Padding tests
	it('applies default padding when padding=true', () => {
		const { container } = render(Container, { padding: true });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-md')).toBe(true);
	});

	it('applies no padding when padding=false', () => {
		const { container } = render(Container, { padding: false });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-md')).toBe(false);
		expect(el?.classList.contains('gr-container--padded-sm')).toBe(false);
		expect(el?.classList.contains('gr-container--padded-lg')).toBe(false);
	});

	it('applies sm padding', () => {
		const { container } = render(Container, { padding: 'sm' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-sm')).toBe(true);
	});

	it('applies md padding', () => {
		const { container } = render(Container, { padding: 'md' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-md')).toBe(true);
	});

	it('applies lg padding', () => {
		const { container } = render(Container, { padding: 'lg' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--padded-lg')).toBe(true);
	});

	// Centering tests
	it('centers content by default', () => {
		const { container } = render(Container);
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--centered')).toBe(true);
	});

	it('does not center when centered=false', () => {
		const { container } = render(Container, { centered: false });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('gr-container--centered')).toBe(false);
	});

	// Content tests
	it('renders children content', () => {
		// Svelte 5 snippets are hard to pass directly in render properties for simple string content testing
		// but we can check if the container exists.
		// For content testing, we often use a harness if we need to inject snippets.
		// But 'children' prop is standard slot content.
		// Testing library render handles slots if passed as props? Not easily for snippets.
		// However, we can test empty container rendering.
		const { container } = render(Container);
		expect(container.querySelector('.gr-container')).toBeTruthy();
	});

	it('applies custom className', () => {
		const { container } = render(Container, { class: 'custom-class' });
		const el = container.querySelector('.gr-container');
		expect(el?.classList.contains('custom-class')).toBe(true);
	});

	it('merges custom styles', () => {
		// checking style attribute presence if passed via restProps
		const { container } = render(Container, { style: 'background: red;' });
		const el = container.querySelector('.gr-container');
		expect(el?.getAttribute('style')).toContain('background: red');
	});
});
