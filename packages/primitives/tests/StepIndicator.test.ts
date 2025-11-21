import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import StepIndicator from '../src/components/StepIndicator.svelte';

describe('StepIndicator.svelte', () => {
	it('renders number by default', () => {
		const { container } = render(StepIndicator, { props: { number: 1 } });
		expect(container.textContent).toContain('1');
	});

	it('applies active state style by default', () => {
		const { container } = render(StepIndicator, { props: { number: 1 } });
		const badge = container.querySelector('.gr-step-badge');
		expect(badge?.classList.contains('gr-step-badge--primary')).toBe(true);
	});

	it('applies pending state style', () => {
		const { container } = render(StepIndicator, { props: { number: 2, state: 'pending' } });
		const badge = container.querySelector('.gr-step-badge');
		expect(badge?.classList.contains('gr-step-badge--gray')).toBe(true);
	});

	it('shows checkmark when completed', () => {
		const { container } = render(StepIndicator, { props: { number: 1, state: 'completed' } });
		const svg = container.querySelector('svg'); // CheckIcon renders svg
		expect(svg).toBeTruthy();
		expect(container.textContent).not.toContain('1');
	});

	it('shows X when error', () => {
		const { container } = render(StepIndicator, { props: { number: 1, state: 'error' } });
		const svg = container.querySelector('svg');
		expect(svg).toBeTruthy();
	});

	it('renders label when provided', () => {
		const { container } = render(StepIndicator, { props: { number: 1, label: 'Start' } });
		expect(container.textContent).toContain('Start');
	});

	it('applies size classes', () => {
		const { container } = render(StepIndicator, { props: { number: 1, size: 'lg' } });
		const badge = container.querySelector('.gr-step-badge');
		expect(badge?.classList.contains('gr-step-badge--lg')).toBe(true);
	});

	it('applies variant classes', () => {
		const { container } = render(StepIndicator, { props: { number: 1, variant: 'outlined' } });
		const badge = container.querySelector('.gr-step-badge');
		expect(badge?.classList.contains('gr-step-badge--outlined')).toBe(true);
	});
});
