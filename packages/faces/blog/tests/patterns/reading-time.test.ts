import { describe, it, expect } from 'vitest';

// Standard reading time calculation (e.g. 200 words per minute)
function calculateReadingTime(text: string, wpm = 200): number {
	if (!text.trim()) return 0;
	const words = text.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wpm);
	return minutes;
}

function calculateReadingTimeFromHtml(html: string, wpm = 200): number {
	// Strip HTML tags
	const text = html.replace(/<[^>]*>/g, '');
	return calculateReadingTime(text, wpm);
}

describe('Pattern: Reading Time Calculation', () => {
	it('calculates reading time for plain text', () => {
		const words = Array(200).fill('word').join(' ');
		expect(calculateReadingTime(words)).toBe(1);

		const longText = Array(1000).fill('word').join(' ');
		expect(calculateReadingTime(longText)).toBe(5);
	});

	it('rounds up to nearest minute', () => {
		const words = Array(250).fill('word').join(' ');
		expect(calculateReadingTime(words)).toBe(2);
	});

	it('handles HTML content', () => {
		const html = '<p>' + Array(200).fill('word').join(' ') + '</p>';
		expect(calculateReadingTimeFromHtml(html)).toBe(1);
	});

	it('handles empty content', () => {
		expect(calculateReadingTime('')).toBe(0); // 0 words -> 0/200 = 0 -> ceil(0) = 0
		// Wait, Math.ceil(0) is 0.
		// Usually reading time is at least 1 min if content exists, but for empty string 0 makes sense.
	});
});
