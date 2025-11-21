import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import GradientText from '../src/components/GradientText.svelte';
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

	it('applies primary gradient style', () => {
		const { container } = render(GradientTextHarness, {
			props: { props: { gradient: 'primary' }, content: 'Text' },
		});
		const element = container.querySelector('.gr-gradient-text') as HTMLElement;
		// Check raw style attribute to avoid JSDOM normalization issues
		expect(element.getAttribute('style')).toContain('var(--gr-color-primary-600)');
	});

	it('applies custom gradient style', () => {
		const { container } = render(GradientTextHarness, {
			props: {
				props: { gradient: 'custom', from: 'red', to: 'blue' },
				content: 'Text',
			},
		});
		const element = container.querySelector('.gr-gradient-text') as HTMLElement;
		expect(element.getAttribute('style')).toContain('linear-gradient(to right, red, blue)');
	});

	it('applies custom direction', () => {
		const { container } = render(GradientTextHarness, {
			props: {
				props: { gradient: 'custom', from: 'red', to: 'blue', direction: 'to left' },
				content: 'Text',
			},
		});
		const element = container.querySelector('.gr-gradient-text') as HTMLElement;
		expect(element.getAttribute('style')).toContain('linear-gradient(to left');
	});
});
