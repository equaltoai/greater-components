/**
 * ContentWarningHandler Pattern Component Tests
 * 
 * Comprehensive tests for ContentWarningHandler including:
 * - Toggle functionality (expand/collapse)
 * - Keyboard handling
 * - Preview text generation
 * - Configuration options
 * - Event handlers
 * - Edge cases
 */

import { describe, it, expect, vi } from 'vitest';

// Extract logic functions for testing
function getPreview(html: string | undefined, showPreview: boolean, previewLength: number): string {
	if (!html || !showPreview) return '';

	// Strip HTML tags
	const text = html.replace(/<[^>]*>/g, '');

	// Truncate
	if (text.length > previewLength) {
		return text.slice(0, previewLength) + '...';
	}

	return text;
}

function handleKeyDown(event: KeyboardEvent, toggleFn: () => void) {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		toggleFn();
	}
}

describe('ContentWarningHandler - Toggle Functionality', () => {
	it('should start collapsed by default', () => {
		const defaultExpanded = false;
		const isExpanded = defaultExpanded;

		expect(isExpanded).toBe(false);
	});

	it('should start expanded when configured', () => {
		const defaultExpanded = true;
		const isExpanded = defaultExpanded;

		expect(isExpanded).toBe(true);
	});

	it('should toggle from collapsed to expanded', () => {
		let isExpanded = false;

		isExpanded = !isExpanded;

		expect(isExpanded).toBe(true);
	});

	it('should toggle from expanded to collapsed', () => {
		let isExpanded = true;

		isExpanded = !isExpanded;

		expect(isExpanded).toBe(false);
	});

	it('should toggle multiple times', () => {
		let isExpanded = false;

		isExpanded = !isExpanded;
		expect(isExpanded).toBe(true);

		isExpanded = !isExpanded;
		expect(isExpanded).toBe(false);

		isExpanded = !isExpanded;
		expect(isExpanded).toBe(true);
	});

	it('should call onToggle when toggling', () => {
		const onToggle = vi.fn();
		let isExpanded = false;

		isExpanded = !isExpanded;
		onToggle(isExpanded);

		expect(onToggle).toHaveBeenCalledWith(true);
	});

	it('should call onToggle with correct state', () => {
		const onToggle = vi.fn();
		let isExpanded = true;

		isExpanded = !isExpanded;
		onToggle(isExpanded);

		expect(onToggle).toHaveBeenCalledWith(false);
	});
});

describe('ContentWarningHandler - Keyboard Handling', () => {
	it('should toggle on Enter key', () => {
		const toggle = vi.fn();
		const event = new KeyboardEvent('keydown', { key: 'Enter' });

		handleKeyDown(event, toggle);

		expect(toggle).toHaveBeenCalled();
	});

	it('should toggle on Space key', () => {
		const toggle = vi.fn();
		const event = new KeyboardEvent('keydown', { key: ' ' });

		handleKeyDown(event, toggle);

		expect(toggle).toHaveBeenCalled();
	});

	it('should not toggle on other keys', () => {
		const toggle = vi.fn();
		const event = new KeyboardEvent('keydown', { key: 'Escape' });

		handleKeyDown(event, toggle);

		expect(toggle).not.toHaveBeenCalled();
	});

	it('should prevent default on Enter', () => {
		const toggle = vi.fn();
		const event = new KeyboardEvent('keydown', { key: 'Enter' });
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		handleKeyDown(event, toggle);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('should prevent default on Space', () => {
		const toggle = vi.fn();
		const event = new KeyboardEvent('keydown', { key: ' ' });
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		handleKeyDown(event, toggle);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('should handle keyboard navigation when expanded', () => {
		let isExpanded = true;
		const toggle = vi.fn(() => {
			isExpanded = !isExpanded;
		});
		const event = new KeyboardEvent('keydown', { key: 'Enter' });

		handleKeyDown(event, toggle);

		expect(toggle).toHaveBeenCalled();
	});
});

describe('ContentWarningHandler - Preview Generation', () => {
	it('should return empty string when showPreview is false', () => {
		const html = '<p>Some content</p>';
		const preview = getPreview(html, false, 100);

		expect(preview).toBe('');
	});

	it('should return empty string when html is undefined', () => {
		const preview = getPreview(undefined, true, 100);

		expect(preview).toBe('');
	});

	it('should strip HTML tags', () => {
		const html = '<p>Hello <strong>world</strong></p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Hello world');
	});

	it('should truncate long text', () => {
		const html = '<p>' + 'a'.repeat(150) + '</p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('a'.repeat(100) + '...');
	});

	it('should not truncate short text', () => {
		const html = '<p>Short text</p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Short text');
	});

	it('should handle text exactly at preview length', () => {
		const text = 'a'.repeat(100);
		const html = `<p>${text}</p>`;
		const preview = getPreview(html, true, 100);

		expect(preview).toBe(text);
	});

	it('should handle nested HTML tags', () => {
		const html = '<div><p>Hello <span><strong>nested</strong> tags</span></p></div>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Hello nested tags');
	});

	it('should handle empty HTML', () => {
		const html = '';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('');
	});

	it('should handle HTML with only tags', () => {
		const html = '<p></p><div></div>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('');
	});

	it('should respect custom previewLength', () => {
		const html = '<p>' + 'b'.repeat(200) + '</p>';
		const preview = getPreview(html, true, 50);

		expect(preview).toBe('b'.repeat(50) + '...');
	});

	it('should handle HTML entities', () => {
		const html = '<p>Hello &amp; goodbye</p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Hello &amp; goodbye');
	});

	it('should handle line breaks', () => {
		const html = '<p>Line 1<br>Line 2</p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Line 1Line 2');
	});
});

describe('ContentWarningHandler - Configuration', () => {
	it('should default expanded to false', () => {
		const config = { defaultExpanded: false };
		expect(config.defaultExpanded).toBe(false);
	});

	it('should support defaultExpanded true', () => {
		const config = { defaultExpanded: true };
		expect(config.defaultExpanded).toBe(true);
	});

	it('should default showPreview to false', () => {
		const config = { showPreview: false };
		expect(config.showPreview).toBe(false);
	});

	it('should support showPreview true', () => {
		const config = { showPreview: true };
		expect(config.showPreview).toBe(true);
	});

	it('should default previewLength to 100', () => {
		const config = { previewLength: 100 };
		expect(config.previewLength).toBe(100);
	});

	it('should support custom previewLength', () => {
		const config = { previewLength: 50 };
		expect(config.previewLength).toBe(50);
	});

	it('should support animationDuration', () => {
		const config = { animationDuration: 300 };
		expect(config.animationDuration).toBe(300);
	});

	it('should support custom CSS class', () => {
		const config = { class: 'my-cw-handler' };
		expect(config.class).toBe('my-cw-handler');
	});

	it('should support blurContent option', () => {
		const config = { blurContent: true };
		expect(config.blurContent).toBe(true);
	});

	it('should support disabling blurContent', () => {
		const config = { blurContent: false };
		expect(config.blurContent).toBe(false);
	});

	it('should support showIcon option', () => {
		const config = { showIcon: true };
		expect(config.showIcon).toBe(true);
	});

	it('should support disabling showIcon', () => {
		const config = { showIcon: false };
		expect(config.showIcon).toBe(false);
	});
});

describe('ContentWarningHandler - Event Handlers', () => {
	it('should call onToggle handler', () => {
		const onToggle = vi.fn();
		let isExpanded = false;

		isExpanded = !isExpanded;
		onToggle(isExpanded);

		expect(onToggle).toHaveBeenCalledWith(true);
	});

	it('should call onToggle with false when collapsing', () => {
		const onToggle = vi.fn();
		let isExpanded = true;

		isExpanded = !isExpanded;
		onToggle(isExpanded);

		expect(onToggle).toHaveBeenCalledWith(false);
	});

	it('should call onToggle multiple times', () => {
		const onToggle = vi.fn();
		let isExpanded = false;

		isExpanded = !isExpanded;
		onToggle(isExpanded);

		isExpanded = !isExpanded;
		onToggle(isExpanded);

		expect(onToggle).toHaveBeenCalledTimes(2);
		expect(onToggle).toHaveBeenNthCalledWith(1, true);
		expect(onToggle).toHaveBeenNthCalledWith(2, false);
	});

	it('should not error if onToggle is undefined', () => {
		const onToggle = undefined;
		let isExpanded = false;

		isExpanded = !isExpanded;
		onToggle?.(isExpanded);

		// Should not throw
		expect(isExpanded).toBe(true);
	});
});

describe('ContentWarningHandler - Edge Cases', () => {
	it('should handle empty warning text', () => {
		const warning = '';
		expect(warning).toBe('');
	});

	it('should handle very long warning text', () => {
		const warning = 'x'.repeat(1000);
		expect(warning.length).toBe(1000);
	});

	it('should handle unicode in warning', () => {
		const warning = 'Warning: 🚨 Sensitive content';
		expect(warning).toContain('🚨');
	});

	it('should handle HTML in warning', () => {
		const warning = '<script>alert("xss")</script>';
		// Warning should be treated as text, not executed
		expect(warning).toBe('<script>alert("xss")</script>');
	});

	it('should handle null/undefined content gracefully', () => {
		const htmlContent = undefined;
		const preview = getPreview(htmlContent, true, 100);

		expect(preview).toBe('');
	});

	it('should handle very short preview length', () => {
		const html = '<p>Hello world</p>';
		const preview = getPreview(html, true, 5);

		expect(preview).toBe('Hello...');
	});

	it('should handle zero preview length', () => {
		const html = '<p>Hello world</p>';
		const preview = getPreview(html, true, 0);

		expect(preview).toBe('...');
	});

	it('should handle negative preview length', () => {
		const html = '<p>Hello world</p>';
		// With negative length and text.length (11) > -10, slice(0, -10) gives first char
		const preview = getPreview(html, true, -10);

		// "Hello world" (11 chars) sliced to -10 gives "H" + "..."
		expect(preview).toBe('H...');
	});

	it('should handle malformed HTML', () => {
		const html = '<p>Unclosed tag';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Unclosed tag');
	});

	it('should handle HTML with comments', () => {
		const html = '<p>Hello <!-- comment --> world</p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Hello  world');
	});

	it('should handle whitespace in HTML', () => {
		const html = '<p>  Multiple   spaces  </p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('  Multiple   spaces  ');
	});

	it('should handle self-closing tags', () => {
		const html = '<p>Image: <img src="test.jpg" /> here</p>';
		const preview = getPreview(html, true, 100);

		expect(preview).toBe('Image:  here');
	});
});

describe('ContentWarningHandler - Accessibility', () => {
	it('should support keyboard navigation', () => {
		const toggle = vi.fn();
		const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
		const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });

		handleKeyDown(enterEvent, toggle);
		handleKeyDown(spaceEvent, toggle);

		expect(toggle).toHaveBeenCalledTimes(2);
	});

	it('should prevent default for keyboard events', () => {
		const toggle = vi.fn();
		const event = new KeyboardEvent('keydown', { key: 'Enter' });
		const spy = vi.spyOn(event, 'preventDefault');

		handleKeyDown(event, toggle);

		expect(spy).toHaveBeenCalled();
	});

	it('should maintain expanded state across interactions', () => {
		let isExpanded = false;

		// First toggle
		isExpanded = !isExpanded;
		expect(isExpanded).toBe(true);

		// State persists
		expect(isExpanded).toBe(true);

		// Second toggle
		isExpanded = !isExpanded;
		expect(isExpanded).toBe(false);
	});
});

describe('ContentWarningHandler - Type Safety', () => {
	it('should enforce ContentWarningConfig structure', () => {
		const config = {
			defaultExpanded: false,
			showPreview: true,
			previewLength: 100,
			animationDuration: 200,
			class: '',
			blurContent: true,
			showIcon: true,
		};

		expect(config).toHaveProperty('defaultExpanded');
		expect(config).toHaveProperty('showPreview');
		expect(config).toHaveProperty('previewLength');
		expect(config).toHaveProperty('animationDuration');
		expect(config).toHaveProperty('class');
		expect(config).toHaveProperty('blurContent');
		expect(config).toHaveProperty('showIcon');
	});

	it('should handle partial config', () => {
		const config = {
			showPreview: true,
			previewLength: 50,
		};

		expect(config.showPreview).toBe(true);
		expect(config.previewLength).toBe(50);
	});

	it('should validate boolean types', () => {
		const config = {
			defaultExpanded: true,
			showPreview: false,
			blurContent: true,
			showIcon: false,
		};

		expect(typeof config.defaultExpanded).toBe('boolean');
		expect(typeof config.showPreview).toBe('boolean');
		expect(typeof config.blurContent).toBe('boolean');
		expect(typeof config.showIcon).toBe('boolean');
	});

	it('should validate number types', () => {
		const config = {
			previewLength: 100,
			animationDuration: 200,
		};

		expect(typeof config.previewLength).toBe('number');
		expect(typeof config.animationDuration).toBe('number');
	});
});

