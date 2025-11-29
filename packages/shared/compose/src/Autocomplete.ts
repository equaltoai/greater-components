/**
 * Autocomplete Helper
 *
 * Handles hashtag and mention autocomplete in the compose editor.
 * Provides cursor position detection, suggestions, and insertion logic.
 */

export interface AutocompleteSuggestion {
	/**
	 * Suggestion type
	 */
	type: 'hashtag' | 'mention' | 'emoji';

	/**
	 * Display text
	 */
	text: string;

	/**
	 * Value to insert
	 */
	value: string;

	/**
	 * Additional metadata
	 */
	metadata?: {
		username?: string;
		displayName?: string;
		avatar?: string;
		followers?: number;
	};
}

export interface AutocompleteMatch {
	/**
	 * Match type
	 */
	type: 'hashtag' | 'mention' | 'emoji';

	/**
	 * The matched query string
	 */
	query: string;

	/**
	 * Start position of the match
	 */
	start: number;

	/**
	 * End position of the match
	 */
	end: number;
}

/**
 * Detect if cursor is in an autocompleteable position
 */
export function detectAutocompleteContext(
	text: string,
	cursorPosition: number
): AutocompleteMatch | null {
	// Look backwards from cursor to find trigger character
	let start = cursorPosition - 1;

	// Find the start of the current word
	while (start >= 0 && text[start] !== ' ' && text[start] !== '\n') {
		start--;
	}
	start++; // Move to first character of word

	const wordStart = start;
	const wordEnd = cursorPosition;
	const word = text.substring(wordStart, wordEnd);

	// Check for hashtag (#)
	if (word.startsWith('#') && word.length > 1) {
		return {
			type: 'hashtag',
			query: word.slice(1), // Remove #
			start: wordStart,
			end: wordEnd,
		};
	}

	// Check for mention (@)
	if (word.startsWith('@') && word.length > 1) {
		return {
			type: 'mention',
			query: word.slice(1), // Remove @
			start: wordStart,
			end: wordEnd,
		};
	}

	// Check for emoji (:)
	if (word.startsWith(':') && word.length > 1) {
		return {
			type: 'emoji',
			query: word.slice(1), // Remove :
			start: wordStart,
			end: wordEnd,
		};
	}

	return null;
}

/**
 * Filter suggestions based on query
 */
export function filterSuggestions(
	suggestions: AutocompleteSuggestion[],
	query: string,
	limit: number = 10
): AutocompleteSuggestion[] {
	if (!query) {
		return suggestions.slice(0, limit);
	}

	const lowerQuery = query.toLowerCase();

	// Score each suggestion
	const scored = suggestions.map((suggestion) => {
		const lowerText = suggestion.text.toLowerCase();
		let score = 0;

		// Exact match
		if (lowerText === lowerQuery) {
			score = 1000;
		}
		// Starts with query
		else if (lowerText.startsWith(lowerQuery)) {
			score = 100;
		}
		// Contains query
		else if (lowerText.includes(lowerQuery)) {
			score = 10;
		}
		// No match
		else {
			score = 0;
		}

		return { suggestion, score };
	});

	// Filter and sort by score
	return scored
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => item.suggestion);
}

/**
 * Insert autocomplete suggestion into text
 */
export function insertSuggestion(
	text: string,
	match: AutocompleteMatch,
	suggestion: AutocompleteSuggestion
): { text: string; cursorPosition: number } {
	// Build the replacement text
	let replacement = suggestion.value;

	// Add space after if not already present
	const nextChar = text[match.end];
	if (nextChar !== ' ' && nextChar !== '\n' && nextChar !== undefined) {
		replacement += ' ';
	}

	// Replace the matched text
	const before = text.substring(0, match.start);
	const after = text.substring(match.end);
	const newText = before + replacement + after;

	// Calculate new cursor position
	const newCursorPosition = match.start + replacement.length;

	return {
		text: newText,
		cursorPosition: newCursorPosition,
	};
}

/**
 * Get cursor position in textarea
 */
export function getCursorPosition(element: HTMLTextAreaElement | HTMLInputElement): number {
	return element.selectionStart || 0;
}

/**
 * Set cursor position in textarea
 */
export function setCursorPosition(
	element: HTMLTextAreaElement | HTMLInputElement,
	position: number
): void {
	element.setSelectionRange(position, position);
	element.focus();
}

/**
 * Extract hashtags from text
 */
export function extractHashtags(text: string): string[] {
	const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
	const matches = text.matchAll(hashtagRegex);
	const hashtags = Array.from(matches, (m) => m[1]).filter(
		(tag): tag is string => typeof tag === 'string'
	);
	return [...new Set(hashtags)]; // Remove duplicates
}

/**
 * Extract mentions from text
 */
export function extractMentions(text: string): string[] {
	const mentionRegex = /@([a-zA-Z0-9_]+(?:@[a-zA-Z0-9.-]+)?)/g;
	const matches = text.matchAll(mentionRegex);
	const mentions = Array.from(matches, (m) => m[1]).filter(
		(mention): mention is string => typeof mention === 'string'
	);
	return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Format hashtag for display
 */
export function formatHashtag(tag: string): string {
	return `#${tag}`;
}

/**
 * Format mention for display
 */
export function formatMention(username: string, domain?: string): string {
	if (domain) {
		return `@${username}@${domain}`;
	}
	return `@${username}`;
}

/**
 * Parse mention to extract username and domain
 */
export function parseMention(mention: string): { username: string; domain?: string } {
	const parts = mention.replace('@', '').split('@');
	const username = parts[0] ?? '';
	const domain = parts[1];

	if (domain) {
		return { username, domain };
	}

	return { username };
}

/**
 * Validate hashtag
 */
export function isValidHashtag(tag: string): boolean {
	// Must be at least 1 character, alphanumeric and underscore only
	return /^[a-zA-Z0-9_]+$/.test(tag) && tag.length > 0 && tag.length <= 100;
}

/**
 * Validate mention username
 */
export function isValidMention(mention: string): boolean {
	// Basic format: username or username@domain
	return /^[a-zA-Z0-9_]+(@[a-zA-Z0-9.-]+)?$/.test(mention);
}
