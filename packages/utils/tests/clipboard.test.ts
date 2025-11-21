import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard, copyElementText, copyCodeBlock } from '../src/clipboard';

describe('copyToClipboard', () => {
	const originalClipboard = navigator.clipboard;
	const originalExecCommand = document.execCommand;

	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();

		// Mock document.execCommand
		document.execCommand = vi.fn().mockReturnValue(true);

		// Mock window.isSecureContext
		Object.defineProperty(window, 'isSecureContext', {
			value: true,
			writable: true,
		});
	});

	afterEach(() => {
		// Restore originals
		Object.defineProperty(navigator, 'clipboard', {
			value: originalClipboard,
			writable: true,
		});
		document.execCommand = originalExecCommand;
	});

	it('copies text using Clipboard API when available', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			writable: true,
		});

		const result = await copyToClipboard('test content');

		expect(result.success).toBe(true);
		expect(writeText).toHaveBeenCalledWith('test content');
		expect(document.execCommand).not.toHaveBeenCalled();
	});

	it('falls back to execCommand when Clipboard API is unavailable', async () => {
		// Remove clipboard API
		Object.defineProperty(navigator, 'clipboard', {
			value: undefined,
			writable: true,
		});

		const result = await copyToClipboard('test content');

		expect(result.success).toBe(true);
		expect(document.execCommand).toHaveBeenCalledWith('copy');

		// Verify textarea creation and removal
		// This is implicitly tested by execCommand being called,
		// but could be more rigorous by spying on createElement/appendChild
	});

	it('falls back to execCommand when context is not secure', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			writable: true,
		});

		// Mock insecure context
		Object.defineProperty(window, 'isSecureContext', {
			value: false,
			writable: true,
		});

		const result = await copyToClipboard('test content');

		expect(result.success).toBe(true);
		expect(writeText).not.toHaveBeenCalled();
		expect(document.execCommand).toHaveBeenCalledWith('copy');
	});

	it('handles empty text gracefully', async () => {
		const result = await copyToClipboard('');
		expect(result.success).toBe(true);
	});

	it('handles very long text', async () => {
		const longText = 'x'.repeat(100000); // 100KB
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			writable: true,
		});

		const result = await copyToClipboard(longText);
		expect(result.success).toBe(true);
		expect(writeText).toHaveBeenCalledWith(longText);
	});

	it('returns error on failure', async () => {
		// Mock clipboard failure
		const writeText = vi.fn().mockRejectedValue(new Error('Not allowed'));
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			writable: true,
		});

		// Mock fallback failure
		document.execCommand = vi.fn().mockReturnValue(false);

		// We need to mock createElement to throw or fail if we want to test the catch block fully,
		// or just rely on execCommand returning false.
		// But the current implementation tries execCommand in the catch block of the main try.

		const result = await copyToClipboard('test');
		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
	});
});

describe('copyElementText', () => {
	it('copies text from element', async () => {
		const element = document.createElement('div');
		element.textContent = 'element text';

		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			writable: true,
		});
		Object.defineProperty(window, 'isSecureContext', {
			value: true,
			writable: true,
		});

		const result = await copyElementText(element);
		expect(result.success).toBe(true);
		expect(writeText).toHaveBeenCalledWith('element text');
	});

	it('handles missing element', async () => {
		// @ts-ignore
		const result = await copyElementText(null);
		expect(result.success).toBe(false);
		expect(result.error).toBe('Element not found');
	});
});

describe('copyCodeBlock', () => {
	it('strips line numbers and trims text', async () => {
		const codeElement = document.createElement('code');
		codeElement.innerHTML = `
			<span class="line-number">999</span> const x = 1;
			<span class="linenumber">888</span> const y = 2;
		`;

		// Mock innerText behavior since JSDOM might not fully support it perfectly
		// or rely on textContent which includes the spans if we don't remove them.
		// The utility clones and removes elements.

		// In JSDOM, textContent of the clone after removing spans should be correct.

		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			writable: true,
		});
		Object.defineProperty(window, 'isSecureContext', {
			value: true,
			writable: true,
		});

		const result = await copyCodeBlock(codeElement);
		expect(result.success).toBe(true);

		const copiedText = writeText.mock.calls[0][0];
		expect(copiedText).toContain('const x = 1;');
		expect(copiedText).not.toContain('999'); // Line number
		expect(copiedText).not.toContain('888'); // Line number
		expect(copiedText.trim()).toBe(copiedText); // Should be trimmed
	});
});
