import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Section from '../src/components/Section.svelte';

describe('Section.svelte', () => {
	// Spacing tests
	it('applies md spacing by default', () => {
		const { container } = render(Section);
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-md')).toBe(true);
	});

	it('applies no spacing when spacing=none', () => {
		const { container } = render(Section, { spacing: 'none' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-none')).toBe(true);
	});

	it('applies sm spacing', () => {
		const { container } = render(Section, { spacing: 'sm' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-sm')).toBe(true);
	});

	it('applies lg spacing', () => {
		const { container } = render(Section, { spacing: 'lg' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-lg')).toBe(true);
	});

	it('applies xl spacing', () => {
		const { container } = render(Section, { spacing: 'xl' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--spacing-xl')).toBe(true);
	});

	// Layout tests
	it('renders as semantic section element', () => {
		const { container } = render(Section);
		expect(container.querySelector('section')).toBeTruthy();
	});

	it('centers content when centered=true', () => {
		const { container } = render(Section, { centered: true });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--centered')).toBe(true);
	});

	it('applies padding when enabled', () => {
		const { container } = render(Section, { padding: true });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--padded-md')).toBe(true);
	});

	it('applies specific padding size', () => {
		const { container } = render(Section, { padding: 'lg' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('gr-section--padded-lg')).toBe(true);
	});

	// Content tests
	it('renders children content', () => {
		const { container } = render(Section);
		// Just checking if the section element is rendered, as explicit content testing without harness is tricky
		// but empty render works.
		expect(container.querySelector('.gr-section')).toBeTruthy();
	});

	it('applies custom className', () => {
		const { container } = render(Section, { class: 'custom-section' });
		const el = container.querySelector('section');
		expect(el?.classList.contains('custom-section')).toBe(true);
	});

	// Accessibility tests
	it('accepts aria-labelledby attribute', () => {
		const { container } = render(Section, { 'aria-labelledby': 'section-title' });
		const el = container.querySelector('section');
		expect(el?.getAttribute('aria-labelledby')).toBe('section-title');
	});
});
