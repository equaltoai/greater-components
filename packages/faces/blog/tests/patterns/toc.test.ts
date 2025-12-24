import { describe, it, expect } from 'vitest';

// Mimic the logic from Article/Content.svelte (or where it resides)
function extractHeadings(html: string) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((el, index) => {
		const id = el.id || `heading-${index}`;
		return {
			id,
			text: el.textContent || '',
			level: parseInt(el.tagName.charAt(1), 10),
		};
	});
	return headings;
}

describe('Pattern: TOC Generation', () => {
	it('extracts headings from HTML content', () => {
		const html = `
      <h1>Main Title</h1>
      <p>Intro</p>
      <h2 id="custom-id">Section 1</h2>
      <p>Content</p>
      <h3>Subsection</h3>
    `;

		const headings = extractHeadings(html);

		expect(headings).toHaveLength(3);

		expect(headings[0]).toEqual({
			id: 'heading-0',
			text: 'Main Title',
			level: 1,
		});

		expect(headings[1]).toEqual({
			id: 'custom-id',
			text: 'Section 1',
			level: 2,
		});

		expect(headings[2]).toEqual({
			id: 'heading-2',
			text: 'Subsection',
			level: 3,
		});
	});

	it('handles empty content', () => {
		const headings = extractHeadings('');
		expect(headings).toEqual([]);
	});
});
