import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import LoadingState from '../src/components/LoadingState.svelte';

describe('LoadingState.svelte', () => {
	it('renders with default props', () => {
		const { container } = render(LoadingState);

		const loadingState = container.querySelector('.gr-loading-state');
		expect(loadingState).toBeTruthy();
		expect(loadingState?.getAttribute('aria-live')).toBe('polite');
		expect(loadingState?.getAttribute('aria-busy')).toBe('true');
		expect(loadingState?.className).toContain('gr-loading-state');
	});

	it('displays message when provided', () => {
		const message = 'Loading your data...';
		const { getByText } = render(LoadingState, { props: { message } });

		expect(getByText(message)).toBeTruthy();
	});

	it('applies fullscreen class when fullscreen is true', () => {
		const { container } = render(LoadingState, { props: { fullscreen: true } });

		const loadingState = container.querySelector('.gr-loading-state');
		expect(loadingState?.className).toContain('gr-loading-state--fullscreen');
	});

	it('does not apply fullscreen class by default', () => {
		const { container } = render(LoadingState);

		const loadingState = container.querySelector('.gr-loading-state');
		expect(loadingState?.className).not.toContain('gr-loading-state--fullscreen');
	});

	it('renders spinner with correct size', () => {
		const { container } = render(LoadingState, { props: { size: 'lg' } });

		const spinner = container.querySelector('.gr-spinner');
		expect(spinner?.className).toContain('gr-spinner--lg');
	});

	it('applies custom class name', () => {
		const { container } = render(LoadingState, { props: { class: 'custom-loading' } });

		const loadingState = container.querySelector('.gr-loading-state');
		expect(loadingState?.className).toContain('custom-loading');
	});

	it('uses custom label for spinner', () => {
		const label = 'Fetching results';
		const { container } = render(LoadingState, { props: { label } });

		const spinner = container.querySelector('.gr-spinner');
		expect(spinner?.getAttribute('aria-label')).toBe(label);
	});
});
