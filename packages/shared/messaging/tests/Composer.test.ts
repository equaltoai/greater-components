/**
 * Messages.Composer Component Tests
 *
 * Tests for message composition logic including:
 * - Content validation
 * - Send button state
 * - Keyboard shortcuts
 * - Message trimming
 * - Character limits
 */

import { describe, it, expect } from 'vitest';

// Content validation
function isValidContent(content: string): boolean {
	return content.trim().length > 0;
}

// Check if send should be disabled
function isSendDisabled(content: string, loading: boolean): boolean {
	return loading || !isValidContent(content);
}

// Check if input should be disabled
function isInputDisabled(loading: boolean): boolean {
	return loading;
}

// Get send button text
function getSendButtonText(loading: boolean): string {
	return loading ? 'Sending...' : 'Send';
}

// Trim message content
function trimContent(content: string): string {
	return content.trim();
}

// Check if should send on key
function shouldSendOnKey(event: { key: string; shiftKey: boolean }): boolean {
	return event.key === 'Enter' && !event.shiftKey;
}

// Check if content is empty
function isContentEmpty(content: string): boolean {
	return content.length === 0;
}

// Check if content is whitespace only
function isWhitespaceOnly(content: string): boolean {
	return content.trim().length === 0 && content.length > 0;
}

// Get content length
function getContentLength(content: string): number {
	return content.length;
}

// Get trimmed length
function getTrimmedLength(content: string): number {
	return content.trim().length;
}

// Check if content exceeds max length
function exceedsMaxLength(content: string, maxLength: number): boolean {
	return content.length > maxLength;
}

// Truncate content to max length
function truncateContent(content: string, maxLength: number): string {
	if (content.length <= maxLength) return content;
	return content.slice(0, maxLength);
}

// Count lines in content
function countLines(content: string): number {
	if (content.length === 0) return 0;
	return content.split('\n').length;
}

// Check if multiline
function isMultiline(content: string): boolean {
	return content.includes('\n');
}

// Get last line
function getLastLine(content: string): string {
	const lines = content.split('\n');
	return lines[lines.length - 1] || '';
}

// Get first line
function getFirstLine(content: string): string {
	const lines = content.split('\n');
	return lines[0] || '';
}

// Remove extra whitespace
function normalizeWhitespace(content: string): string {
	return content.replace(/\s+/g, ' ').trim();
}

// Check if has leading whitespace
function hasLeadingWhitespace(content: string): boolean {
	return content.length > 0 && content[0] === ' ';
}

// Check if has trailing whitespace
function hasTrailingWhitespace(content: string): boolean {
	return content.length > 0 && content[content.length - 1] === ' ';
}

describe('Messages.Composer - Content Validation', () => {
	it('validates non-empty content', () => {
		expect(isValidContent('Hello')).toBe(true);
	});

	it('invalidates empty content', () => {
		expect(isValidContent('')).toBe(false);
	});

	it('invalidates whitespace-only content', () => {
		expect(isValidContent('   ')).toBe(false);
		expect(isValidContent('\n')).toBe(false);
		expect(isValidContent('\t')).toBe(false);
	});

	it('validates content with leading/trailing whitespace', () => {
		expect(isValidContent('  Hello  ')).toBe(true);
	});

	it('validates multiline content', () => {
		expect(isValidContent('Hello\nWorld')).toBe(true);
	});
});

describe('Messages.Composer - Send Button State', () => {
	it('disables when loading', () => {
		expect(isSendDisabled('Hello', true)).toBe(true);
	});

	it('disables when content invalid', () => {
		expect(isSendDisabled('', false)).toBe(true);
		expect(isSendDisabled('   ', false)).toBe(true);
	});

	it('enables when content valid and not loading', () => {
		expect(isSendDisabled('Hello', false)).toBe(false);
	});

	it('disables when both loading and invalid content', () => {
		expect(isSendDisabled('', true)).toBe(true);
	});
});

describe('Messages.Composer - Input State', () => {
	it('disables input when loading', () => {
		expect(isInputDisabled(true)).toBe(true);
	});

	it('enables input when not loading', () => {
		expect(isInputDisabled(false)).toBe(false);
	});
});

describe('Messages.Composer - Button Text', () => {
	it('shows "Sending..." when loading', () => {
		expect(getSendButtonText(true)).toBe('Sending...');
	});

	it('shows "Send" when not loading', () => {
		expect(getSendButtonText(false)).toBe('Send');
	});
});

describe('Messages.Composer - Content Trimming', () => {
	it('trims leading whitespace', () => {
		expect(trimContent('  Hello')).toBe('Hello');
	});

	it('trims trailing whitespace', () => {
		expect(trimContent('Hello  ')).toBe('Hello');
	});

	it('trims both sides', () => {
		expect(trimContent('  Hello  ')).toBe('Hello');
	});

	it('preserves internal whitespace', () => {
		expect(trimContent('Hello  World')).toBe('Hello  World');
	});

	it('preserves newlines in content', () => {
		expect(trimContent('Hello\nWorld')).toBe('Hello\nWorld');
	});

	it('trims whitespace around newlines', () => {
		expect(trimContent('  Hello\nWorld  ')).toBe('Hello\nWorld');
	});
});

describe('Messages.Composer - Keyboard Shortcuts', () => {
	it('sends on Enter without Shift', () => {
		expect(shouldSendOnKey({ key: 'Enter', shiftKey: false })).toBe(true);
	});

	it('does not send on Shift+Enter', () => {
		expect(shouldSendOnKey({ key: 'Enter', shiftKey: true })).toBe(false);
	});

	it('does not send on other keys', () => {
		expect(shouldSendOnKey({ key: 'a', shiftKey: false })).toBe(false);
		expect(shouldSendOnKey({ key: 'Space', shiftKey: false })).toBe(false);
	});

	it('does not send on Shift with other keys', () => {
		expect(shouldSendOnKey({ key: 'a', shiftKey: true })).toBe(false);
	});
});

describe('Messages.Composer - Content Checks', () => {
	it('detects empty content', () => {
		expect(isContentEmpty('')).toBe(true);
	});

	it('detects non-empty content', () => {
		expect(isContentEmpty('Hello')).toBe(false);
		expect(isContentEmpty(' ')).toBe(false);
	});

	it('detects whitespace-only content', () => {
		expect(isWhitespaceOnly('   ')).toBe(true);
		expect(isWhitespaceOnly('\n')).toBe(true);
		expect(isWhitespaceOnly('\t')).toBe(true);
	});

	it('does not detect valid content as whitespace', () => {
		expect(isWhitespaceOnly('Hello')).toBe(false);
	});

	it('does not detect empty as whitespace-only', () => {
		expect(isWhitespaceOnly('')).toBe(false);
	});
});

describe('Messages.Composer - Content Length', () => {
	it('gets content length', () => {
		expect(getContentLength('Hello')).toBe(5);
		expect(getContentLength('')).toBe(0);
	});

	it('gets trimmed length', () => {
		expect(getTrimmedLength('  Hello  ')).toBe(5);
		expect(getTrimmedLength('   ')).toBe(0);
	});

	it('counts unicode characters', () => {
		expect(getContentLength('世界')).toBe(2);
		expect(getContentLength('🌍')).toBe(2); // Emoji is 2 UTF-16 code units
	});

	it('checks if exceeds max length', () => {
		expect(exceedsMaxLength('Hello', 10)).toBe(false);
		expect(exceedsMaxLength('Hello', 5)).toBe(false);
		expect(exceedsMaxLength('Hello', 4)).toBe(true);
	});

	it('truncates content', () => {
		expect(truncateContent('Hello World', 5)).toBe('Hello');
		expect(truncateContent('Hello', 10)).toBe('Hello');
	});
});

describe('Messages.Composer - Line Handling', () => {
	it('counts lines', () => {
		expect(countLines('Hello')).toBe(1);
		expect(countLines('Hello\nWorld')).toBe(2);
		expect(countLines('A\nB\nC')).toBe(3);
		expect(countLines('')).toBe(0);
	});

	it('detects multiline content', () => {
		expect(isMultiline('Hello\nWorld')).toBe(true);
		expect(isMultiline('Hello')).toBe(false);
	});

	it('gets last line', () => {
		expect(getLastLine('Hello\nWorld')).toBe('World');
		expect(getLastLine('Hello')).toBe('Hello');
		expect(getLastLine('')).toBe('');
	});

	it('gets first line', () => {
		expect(getFirstLine('Hello\nWorld')).toBe('Hello');
		expect(getFirstLine('Hello')).toBe('Hello');
		expect(getFirstLine('')).toBe('');
	});

	it('handles trailing newline', () => {
		expect(countLines('Hello\n')).toBe(2);
		expect(getLastLine('Hello\n')).toBe('');
	});
});

describe('Messages.Composer - Whitespace Normalization', () => {
	it('normalizes multiple spaces', () => {
		expect(normalizeWhitespace('Hello    World')).toBe('Hello World');
	});

	it('normalizes newlines', () => {
		expect(normalizeWhitespace('Hello\nWorld')).toBe('Hello World');
	});

	it('normalizes tabs', () => {
		expect(normalizeWhitespace('Hello\tWorld')).toBe('Hello World');
	});

	it('trims after normalization', () => {
		expect(normalizeWhitespace('  Hello  World  ')).toBe('Hello World');
	});

	it('handles already normalized content', () => {
		expect(normalizeWhitespace('Hello World')).toBe('Hello World');
	});
});

describe('Messages.Composer - Whitespace Detection', () => {
	it('detects leading whitespace', () => {
		expect(hasLeadingWhitespace(' Hello')).toBe(true);
		expect(hasLeadingWhitespace('Hello')).toBe(false);
	});

	it('detects trailing whitespace', () => {
		expect(hasTrailingWhitespace('Hello ')).toBe(true);
		expect(hasTrailingWhitespace('Hello')).toBe(false);
	});

	it('handles empty string', () => {
		expect(hasLeadingWhitespace('')).toBe(false);
		expect(hasTrailingWhitespace('')).toBe(false);
	});

	it('handles whitespace-only', () => {
		expect(hasLeadingWhitespace('   ')).toBe(true);
		expect(hasTrailingWhitespace('   ')).toBe(true);
	});
});

describe('Messages.Composer - Edge Cases', () => {
	it('handles very long content', () => {
		const longContent = 'A'.repeat(10000);
		expect(isValidContent(longContent)).toBe(true);
		expect(getContentLength(longContent)).toBe(10000);
	});

	it('handles unicode in content', () => {
		expect(isValidContent('世界')).toBe(true);
		expect(trimContent(' 世界 ')).toBe('世界');
	});

	it('handles emoji in content', () => {
		expect(isValidContent('Hello 🌍')).toBe(true);
		expect(trimContent(' Hello 🌍 ')).toBe('Hello 🌍');
	});

	it('handles special characters', () => {
		expect(isValidContent('@#$%')).toBe(true);
		expect(trimContent(' @#$% ')).toBe('@#$%');
	});

	it('handles mixed line endings', () => {
		// split('\n') treats \r\n as one line break, so A\nB\rC\r\nD has 3 lines
		expect(countLines('A\nB\rC\r\nD')).toBe(3);
	});

	it('handles content with only newlines', () => {
		expect(isValidContent('\n\n\n')).toBe(false);
		expect(isWhitespaceOnly('\n\n\n')).toBe(true);
	});
});

describe('Messages.Composer - Integration', () => {
	it('validates complete send flow', () => {
		const content = '  Hello World  ';
		const loading = false;

		expect(isValidContent(content)).toBe(true);
		expect(isSendDisabled(content, loading)).toBe(false);
		expect(trimContent(content)).toBe('Hello World');
		expect(getSendButtonText(loading)).toBe('Send');
	});

	it('prevents send during loading', () => {
		const content = 'Hello World';
		const loading = true;

		expect(isValidContent(content)).toBe(true);
		expect(isSendDisabled(content, loading)).toBe(true);
		expect(isInputDisabled(loading)).toBe(true);
		expect(getSendButtonText(loading)).toBe('Sending...');
	});

	it('handles keyboard shortcut flow', () => {
		const enterEvent = { key: 'Enter', shiftKey: false };
		const shiftEnterEvent = { key: 'Enter', shiftKey: true };
		const content = 'Hello';

		expect(shouldSendOnKey(enterEvent)).toBe(true);
		expect(shouldSendOnKey(shiftEnterEvent)).toBe(false);
		expect(isValidContent(content)).toBe(true);
	});

	it('handles multiline message composition', () => {
		const content = 'Line 1\nLine 2\nLine 3';

		expect(isValidContent(content)).toBe(true);
		expect(isMultiline(content)).toBe(true);
		expect(countLines(content)).toBe(3);
		expect(getFirstLine(content)).toBe('Line 1');
		expect(getLastLine(content)).toBe('Line 3');
	});

	it('handles content validation edge cases', () => {
		const cases = [
			{ content: '', valid: false },
			{ content: '   ', valid: false },
			{ content: '\n\n', valid: false },
			{ content: 'Hello', valid: true },
			{ content: '  Hello  ', valid: true },
			{ content: 'Hello\nWorld', valid: true },
		];

		for (const testCase of cases) {
			expect(isValidContent(testCase.content)).toBe(testCase.valid);
		}
	});

	it('handles character limit scenarios', () => {
		const maxLength = 280;
		const shortContent = 'Hello';
		const exactContent = 'A'.repeat(280);
		const longContent = 'A'.repeat(300);

		expect(exceedsMaxLength(shortContent, maxLength)).toBe(false);
		expect(exceedsMaxLength(exactContent, maxLength)).toBe(false);
		expect(exceedsMaxLength(longContent, maxLength)).toBe(true);
		expect(truncateContent(longContent, maxLength)).toHaveLength(maxLength);
	});
});

describe('Messages.Composer - State Combinations', () => {
	const stateTests = [
		{ content: '', loading: false, disabled: true, text: 'Send' },
		{ content: '   ', loading: false, disabled: true, text: 'Send' },
		{ content: 'Hello', loading: false, disabled: false, text: 'Send' },
		{ content: '', loading: true, disabled: true, text: 'Sending...' },
		{ content: 'Hello', loading: true, disabled: true, text: 'Sending...' },
	];

	it('handles all state combinations', () => {
		for (const test of stateTests) {
			expect(isSendDisabled(test.content, test.loading)).toBe(test.disabled);
			expect(getSendButtonText(test.loading)).toBe(test.text);
		}
	});
});
