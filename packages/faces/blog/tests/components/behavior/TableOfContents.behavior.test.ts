import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TestTOCWrapper from '../../fixtures/TestTOCWrapper.svelte';
import type { HeadingData } from '../../../src/types.js';

describe('TableOfContents Behavior', () => {
	const mockHeadings: HeadingData[] = [
		{ id: 'h1', text: 'Heading 1', level: 1 },
		{ id: 'h2', text: 'Heading 2', level: 2 },
	];

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders list of headings', () => {
		render(TestTOCWrapper, { props: { headings: mockHeadings } });

		expect(screen.getByText('Contents')).toBeTruthy();
		expect(screen.getByText('Heading 1')).toBeTruthy();
		expect(screen.getByText('Heading 2')).toBeTruthy();
	});

	it('renders nothing when no headings', () => {
		const { container } = render(TestTOCWrapper, { props: { headings: [] } });
		expect(container.querySelector('nav')).toBeNull();
	});

	it('applies correct class based on level', () => {
		const { container } = render(TestTOCWrapper, { props: { headings: mockHeadings } });

		const links = container.querySelectorAll('.gr-blog-toc__link');
		expect(links[0].classList.contains('gr-blog-toc__link--h1')).toBe(true);
		expect(links[1].classList.contains('gr-blog-toc__link--h2')).toBe(true);
	});

	it('scrolls to heading on click', async () => {
		const onHeadingClick = vi.fn();
		const scrollIntoView = vi.fn();

		// Mock document.getElementById
		vi.spyOn(document, 'getElementById').mockImplementation((id) => {
			if (id === 'h1') {
				return { scrollIntoView } as unknown as HTMLElement;
			}
			return null;
		});

		render(TestTOCWrapper, {
			props: {
				headings: mockHeadings,
				handlers: { onHeadingClick },
			},
		});

		const button = screen.getByText('Heading 1');
		await fireEvent.click(button);

		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
		expect(onHeadingClick).toHaveBeenCalledWith('h1');
	});

	it('highlights active heading', () => {
		const { container } = render(TestTOCWrapper, {
			props: {
				headings: mockHeadings,
				activeHeadingId: 'h2',
			},
		});

		const activeLink = container.querySelector('.gr-blog-toc__link--active');
		expect(activeLink).toBeTruthy();
		expect(activeLink?.textContent?.trim()).toBe('Heading 2');
	});

	it('applies position class', () => {
		const { container } = render(TestTOCWrapper, {
			props: {
				headings: mockHeadings,
				position: 'right',
			},
		});

		const nav = container.querySelector('.gr-blog-toc');
		expect(nav?.classList.contains('gr-blog-toc--right')).toBe(true);
	});
});
