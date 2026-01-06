import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import GradientTextHarness from './harness/GradientTextHarness.svelte';

// We need a harness because render() cannot easily pass snippet content
describe('GradientText.svelte', () => {
	it('renders as span by default', () => {
		const { container } = render(GradientTextHarness, { props: { content: 'Text' } });
		const element = container.querySelector('.gr-gradient-text');
		expect(element?.tagName).toBe('SPAN');
		expect(element?.textContent).toBe('Text');
	});

	it('renders as custom element', () => {
		const { container } = render(GradientTextHarness, {
			props: { props: { as: 'h1' }, content: 'Heading' },
		});
		const element = container.querySelector('.gr-gradient-text');
		expect(element?.tagName).toBe('H1');
	});

	it('applies gradient preset classes', () => {
		const { container } = render(GradientTextHarness, {
			props: { props: { gradient: 'primary' }, content: 'Text' },
		});
		const element = container.querySelector('.gr-gradient-text') as HTMLElement;
		expect(element.classList.contains('gr-gradient-text--gradient-primary')).toBe(true);
		expect(element.classList.contains('gr-gradient-text--direction-to-right')).toBe(true);
	});

	it('applies non-primary gradient presets', () => {
		const presets = ['success', 'warning', 'error'] as const;
		for (const preset of presets) {
			const { container } = render(GradientTextHarness, {
				props: { props: { gradient: preset }, content: 'Text' },
			});
			const element = container.querySelector('.gr-gradient-text') as HTMLElement;
			expect(element.classList.contains(`gr-gradient-text--gradient-${preset}`)).toBe(true);
		}
	});

	it('applies direction preset classes', () => {
		const { container } = render(GradientTextHarness, {
			props: {
				props: { gradient: 'primary', direction: 'to-left' },
				content: 'Text',
			},
		});
		const element = container.querySelector('.gr-gradient-text') as HTMLElement;
		expect(element.classList.contains('gr-gradient-text--direction-to-left')).toBe(true);
	});
});
