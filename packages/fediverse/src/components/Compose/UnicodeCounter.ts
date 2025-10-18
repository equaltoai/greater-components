/**
 * Unicode Character Counter
 * 
 * Provides accurate character counting that handles:
 * - Multi-byte Unicode characters (emojis, CJK characters)
 * - Combining characters
 * - Grapheme clusters
 * - URLs (weighted differently)
 * - Mentions and hashtags
 */

type GraphemeSegment = { segment: string };
type GraphemeSegmenter = {
	segment: (input: string) => IterableIterator<GraphemeSegment>;
};

type GraphemeSegmenterConstructor = new (
	locales?: string | string[],
	options?: { granularity: 'grapheme' }
) => GraphemeSegmenter;

/**
 * Count grapheme clusters (user-perceived characters)
 * This handles emojis, combining characters, etc.
 */
export function countGraphemes(text: string): number {
	if (!text) return 0;

	// Use Intl.Segmenter if available (modern browsers)
	if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
		const SegmenterCtor = (Intl as typeof Intl & {
			Segmenter?: GraphemeSegmenterConstructor;
		}).Segmenter;
		if (SegmenterCtor) {
			const segmenter = new SegmenterCtor('en', { granularity: 'grapheme' });
			return Array.from(segmenter.segment(text)).length;
		}
	}

	// Fallback: Use Array.from which respects surrogate pairs
	// This handles basic emojis and surrogate pairs but not all combining characters
	return Array.from(text).length;
}

/**
 * Count weighted characters for posting
 * This applies platform-specific weights (e.g., URLs count less)
 */
export interface CharacterCountOptions {
	/**
	 * Weight for URLs (default: 23 characters like Twitter)
	 */
	urlWeight?: number;

	/**
	 * Count URLs as weighted or actual length
	 */
	useUrlWeighting?: boolean;

	/**
	 * Maximum character limit
	 */
	maxCharacters?: number;
}

/**
 * URL regex pattern
 */
const URL_REGEX =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.+~#?&//=]*)/gi;

/**
 * Count characters with platform-specific weighting
 */
export function countWeightedCharacters(
	text: string,
	options: CharacterCountOptions = {}
): {
	count: number;
	graphemeCount: number;
	urls: number;
	mentions: number;
	hashtags: number;
} {
	const { urlWeight = 23, useUrlWeighting = true } = options;

	if (!text) {
		return {
			count: 0,
			graphemeCount: 0,
			urls: 0,
			mentions: 0,
			hashtags: 0,
		};
	}

	const graphemeCount = countGraphemes(text);

	// Extract URLs
	const urls = text.match(URL_REGEX) || [];
	const urlsLength = urls.reduce((sum, url) => sum + url.length, 0);

	// Extract mentions
	const mentions = text.match(/@[a-zA-Z0-9_]+(?:@[a-zA-Z0-9.-]+)?/g) || [];

	// Extract hashtags
	const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];

	// Calculate weighted count
	let count = graphemeCount;

	if (useUrlWeighting && urls.length > 0) {
		// Subtract actual URL length
		count -= urlsLength;
		// Add weighted length
		count += urls.length * urlWeight;
	}

	return {
		count,
		graphemeCount,
		urls: urls.length,
		mentions: mentions.length,
		hashtags: hashtags.length,
	};
}

/**
 * Check if text exceeds character limit
 */
export function exceedsLimit(text: string, limit: number, options?: CharacterCountOptions): boolean {
	const { count } = countWeightedCharacters(text, options);
	return count > limit;
}

/**
 * Get remaining characters
 */
export function remainingCharacters(text: string, limit: number, options?: CharacterCountOptions): number {
	const { count } = countWeightedCharacters(text, options);
	return limit - count;
}

/**
 * Truncate text to character limit
 */
export function truncateToLimit(
	text: string,
	limit: number,
	options?: CharacterCountOptions
): string {
	if (!exceedsLimit(text, limit, options)) {
		return text;
	}

	// Binary search for the right length
	let left = 0;
	let right = text.length;
	let result = '';

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const substring = text.substring(0, mid);
		const { count } = countWeightedCharacters(substring, options);

		if (count <= limit) {
			result = substring;
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return result;
}

/**
 * Format character count for display
 */
export function formatCharacterCount(
	count: number,
	limit: number
): {
	text: string;
	percentage: number;
	isNearLimit: boolean;
	isOverLimit: boolean;
} {
	const percentage = (count / limit) * 100;
	const remaining = limit - count;

	return {
		text: remaining < 0 ? `${count} / ${limit}` : `${remaining}`,
		percentage: Math.min(percentage, 100),
		isNearLimit: percentage >= 80,
		isOverLimit: count > limit,
	};
}

/**
 * Estimate character count for input (before actual counting)
 * Useful for live validation without full processing
 */
export function estimateCharacterCount(text: string): number {
	// Quick estimate: count code points
	// This is faster than full grapheme counting
	return Array.from(text).length;
}

/**
 * Split text into chunks that fit within character limit
 * Useful for threading long posts
 */
export function splitIntoChunks(
	text: string,
	limit: number,
	options?: CharacterCountOptions
): string[] {
	if (!text || !exceedsLimit(text, limit, options)) {
		return [text];
	}

	const chunks: string[] = [];
	let remaining = text;

	while (remaining.length > 0) {
		// Find a good break point (sentence, paragraph, or word boundary)
		let chunk = truncateToLimit(remaining, limit, options);

		// Try to break at sentence boundary
		const sentenceEnd = Math.max(
			chunk.lastIndexOf('. '),
			chunk.lastIndexOf('! '),
			chunk.lastIndexOf('? '),
			chunk.lastIndexOf('\n\n')
		);

		if (sentenceEnd > chunk.length * 0.5) {
			chunk = chunk.substring(0, sentenceEnd + 1).trim();
		} else {
			// Try to break at word boundary
			const wordEnd = chunk.lastIndexOf(' ');
			if (wordEnd > chunk.length * 0.7) {
				chunk = chunk.substring(0, wordEnd).trim();
			}
		}

		chunks.push(chunk);
		remaining = remaining.substring(chunk.length).trim();
	}

	return chunks;
}
