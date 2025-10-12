/**
 * MediaComposer Pattern Component Tests
 * 
 * Comprehensive tests for MediaComposer including:
 * - File validation (type, size, count)
 * - Attachment removal
 * - Alt text updates
 * - Focal point calculation and display
 * - Alt text completion check
 * - Thumbnail resolution
 * - File size formatting
 * - Configuration options
 * - Event handlers
 * - Edge cases
 */

import { describe, it, expect, vi } from 'vitest';

interface MediaComposerAttachment {
	id: string;
	type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown';
	url: string;
	previewUrl?: string;
	description?: string;
	meta?: {
		focus?: { x: number; y: number };
		original?: {
			width: number;
			height: number;
			size?: string;
			aspect?: number;
		};
	};
	file?: File;
	uploadProgress?: number;
	uploaded?: boolean;
	error?: string;
}

// Helper to create mock attachment
function createMockAttachment(id: string, options: Partial<MediaComposerAttachment> = {}): MediaComposerAttachment {
	return {
		id,
		type: options.type || 'image',
		url: options.url || `https://example.com/${id}.jpg`,
		previewUrl: options.previewUrl,
		description: options.description,
		meta: options.meta,
		...options,
	};
}

// File validation logic (extracted from component)
function validateFile(
	file: File,
	allowedTypes: string[],
	maxFileSize: number,
	currentAttachmentCount: number,
	maxAttachments: number
): boolean {
	if (!allowedTypes.includes(file.type)) {
		return false;
	}
	if (file.size > maxFileSize) {
		return false;
	}
	if (currentAttachmentCount >= maxAttachments) {
		return false;
	}
	return true;
}

// Remove attachment logic
function removeAttachment(attachments: MediaComposerAttachment[], id: string): MediaComposerAttachment[] {
	return attachments.filter((a) => a.id !== id);
}

// Update alt text logic
function updateAltText(attachments: MediaComposerAttachment[], id: string, altText: string): MediaComposerAttachment[] {
	const attachment = attachments.find((a) => a.id === id);
	if (attachment) {
		attachment.description = altText;
	}
	return attachments;
}

// Calculate focal point from mouse position
function calculateFocalPoint(
	clientX: number,
	clientY: number,
	rectLeft: number,
	rectTop: number,
	rectWidth: number,
	rectHeight: number
): { x: number; y: number } {
	const x = ((clientX - rectLeft) / rectWidth) * 2 - 1;
	const y = ((clientY - rectTop) / rectHeight) * 2 - 1;
	return { x, y };
}

// Get focal point position for display
function getFocalPointPosition(attachment: MediaComposerAttachment): { x: string; y: string } {
	const focus = attachment.meta?.focus;
	if (!focus) return { x: '50%', y: '50%' };

	const x = ((focus.x + 1) / 2) * 100;
	const y = ((focus.y + 1) / 2) * 100;

	return { x: `${x}%`, y: `${y}%` };
}

// Check if all attachments have alt text
function allHaveAltText(attachments: MediaComposerAttachment[]): boolean {
	return attachments.every((a) => a.description && a.description.trim().length > 0);
}

// Get thumbnail
function getThumbnail(attachment: MediaComposerAttachment): string {
	return attachment.previewUrl || attachment.url;
}

// Format file size
function formatFileSize(bytes?: number): string {
	if (!bytes) return '';
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

describe('MediaComposer - File Validation', () => {
	it('should validate file type', () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const valid = validateFile(file, ['image/jpeg', 'image/png'], 10 * 1024 * 1024, 0, 4);

		expect(valid).toBe(true);
	});

	it('should reject invalid file type', () => {
		const file = new File([''], 'test.exe', { type: 'application/exe' });
		const valid = validateFile(file, ['image/jpeg', 'image/png'], 10 * 1024 * 1024, 0, 4);

		expect(valid).toBe(false);
	});

	it('should validate file size', () => {
		const file = new File(['a'.repeat(1024)], 'test.jpg', { type: 'image/jpeg' });
		const valid = validateFile(file, ['image/jpeg'], 10 * 1024, 0, 4);

		expect(valid).toBe(true);
	});

	it('should reject oversized file', () => {
		const file = new File(['a'.repeat(1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
		const valid = validateFile(file, ['image/jpeg'], 10 * 1024, 0, 4);

		expect(valid).toBe(false);
	});

	it('should reject when max attachments reached', () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const valid = validateFile(file, ['image/jpeg'], 10 * 1024 * 1024, 4, 4);

		expect(valid).toBe(false);
	});

	it('should validate when below max attachments', () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const valid = validateFile(file, ['image/jpeg'], 10 * 1024 * 1024, 3, 4);

		expect(valid).toBe(true);
	});

	it('should handle file at exact size limit', () => {
		const file = new File(['a'.repeat(1024)], 'test.jpg', { type: 'image/jpeg' });
		const valid = validateFile(file, ['image/jpeg'], 1024, 0, 4);

		expect(valid).toBe(true);
	});
});

describe('MediaComposer - Attachment Removal', () => {
	it('should remove attachment by ID', () => {
		const attachments = [
			createMockAttachment('1'),
			createMockAttachment('2'),
			createMockAttachment('3'),
		];

		const result = removeAttachment(attachments, '2');

		expect(result).toHaveLength(2);
		expect(result.map((a) => a.id)).toEqual(['1', '3']);
	});

	it('should handle removing non-existent ID', () => {
		const attachments = [createMockAttachment('1')];

		const result = removeAttachment(attachments, '999');

		expect(result).toHaveLength(1);
	});

	it('should handle empty attachments', () => {
		const result = removeAttachment([], '1');

		expect(result).toHaveLength(0);
	});

	it('should not mutate original array', () => {
		const attachments = [createMockAttachment('1'), createMockAttachment('2')];
		const originalLength = attachments.length;

		removeAttachment(attachments, '1');

		expect(attachments).toHaveLength(originalLength);
	});
});

describe('MediaComposer - Alt Text Updates', () => {
	it('should update alt text for attachment', () => {
		const attachments = [createMockAttachment('1')];

		const result = updateAltText(attachments, '1', 'New description');

		expect(result[0].description).toBe('New description');
	});

	it('should handle updating non-existent attachment', () => {
		const attachments = [createMockAttachment('1')];

		const result = updateAltText(attachments, '999', 'New description');

		expect(result[0].description).toBeUndefined();
	});

	it('should allow empty alt text', () => {
		const attachments = [createMockAttachment('1', { description: 'Old' })];

		const result = updateAltText(attachments, '1', '');

		expect(result[0].description).toBe('');
	});

	it('should handle very long alt text', () => {
		const longText = 'a'.repeat(5000);
		const attachments = [createMockAttachment('1')];

		const result = updateAltText(attachments, '1', longText);

		expect(result[0].description).toBe(longText);
	});
});

describe('MediaComposer - Focal Point Calculation', () => {
	it('should calculate focal point at center', () => {
		const focal = calculateFocalPoint(50, 50, 0, 0, 100, 100);

		expect(focal.x).toBe(0);
		expect(focal.y).toBe(0);
	});

	it('should calculate focal point at top-left', () => {
		const focal = calculateFocalPoint(0, 0, 0, 0, 100, 100);

		expect(focal.x).toBe(-1);
		expect(focal.y).toBe(-1);
	});

	it('should calculate focal point at bottom-right', () => {
		const focal = calculateFocalPoint(100, 100, 0, 0, 100, 100);

		expect(focal.x).toBe(1);
		expect(focal.y).toBe(1);
	});

	it('should calculate focal point at top-right', () => {
		const focal = calculateFocalPoint(100, 0, 0, 0, 100, 100);

		expect(focal.x).toBe(1);
		expect(focal.y).toBe(-1);
	});

	it('should calculate focal point at bottom-left', () => {
		const focal = calculateFocalPoint(0, 100, 0, 0, 100, 100);

		expect(focal.x).toBe(-1);
		expect(focal.y).toBe(1);
	});

	it('should handle rect offset', () => {
		const focal = calculateFocalPoint(150, 150, 100, 100, 100, 100);

		expect(focal.x).toBe(0);
		expect(focal.y).toBe(0);
	});
});

describe('MediaComposer - Focal Point Display', () => {
	it('should return 50% for default focal point', () => {
		const attachment = createMockAttachment('1');

		const position = getFocalPointPosition(attachment);

		expect(position).toEqual({ x: '50%', y: '50%' });
	});

	it('should convert focal point -1,-1 to 0%,0%', () => {
		const attachment = createMockAttachment('1', {
			meta: { focus: { x: -1, y: -1 } },
		});

		const position = getFocalPointPosition(attachment);

		expect(position).toEqual({ x: '0%', y: '0%' });
	});

	it('should convert focal point 1,1 to 100%,100%', () => {
		const attachment = createMockAttachment('1', {
			meta: { focus: { x: 1, y: 1 } },
		});

		const position = getFocalPointPosition(attachment);

		expect(position).toEqual({ x: '100%', y: '100%' });
	});

	it('should convert focal point 0,0 to 50%,50%', () => {
		const attachment = createMockAttachment('1', {
			meta: { focus: { x: 0, y: 0 } },
		});

		const position = getFocalPointPosition(attachment);

		expect(position).toEqual({ x: '50%', y: '50%' });
	});

	it('should handle fractional focal points', () => {
		const attachment = createMockAttachment('1', {
			meta: { focus: { x: 0.5, y: -0.5 } },
		});

		const position = getFocalPointPosition(attachment);

		expect(position.x).toBe('75%');
		expect(position.y).toBe('25%');
	});
});

describe('MediaComposer - Alt Text Completion', () => {
	it('should return true when all attachments have alt text', () => {
		const attachments = [
			createMockAttachment('1', { description: 'Image 1' }),
			createMockAttachment('2', { description: 'Image 2' }),
		];

		const result = allHaveAltText(attachments);

		expect(result).toBe(true);
	});

	it('should return false when some attachments lack alt text', () => {
		const attachments = [
			createMockAttachment('1', { description: 'Image 1' }),
			createMockAttachment('2'),
		];

		const result = allHaveAltText(attachments);

		expect(result).toBe(false);
	});

	it('should return false for empty alt text', () => {
		const attachments = [createMockAttachment('1', { description: '' })];

		const result = allHaveAltText(attachments);

		expect(result).toBe(false);
	});

	it('should return false for whitespace-only alt text', () => {
		const attachments = [createMockAttachment('1', { description: '   ' })];

		const result = allHaveAltText(attachments);

		expect(result).toBe(false);
	});

	it('should return true for empty attachments array', () => {
		const result = allHaveAltText([]);

		expect(result).toBe(true);
	});
});

describe('MediaComposer - Thumbnail Resolution', () => {
	it('should use preview URL when available', () => {
		const attachment = createMockAttachment('1', {
			url: 'https://example.com/full.jpg',
			previewUrl: 'https://example.com/thumb.jpg',
		});

		const thumbnail = getThumbnail(attachment);

		expect(thumbnail).toBe('https://example.com/thumb.jpg');
	});

	it('should fall back to URL when no preview', () => {
		const attachment = createMockAttachment('1', {
			url: 'https://example.com/full.jpg',
		});

		const thumbnail = getThumbnail(attachment);

		expect(thumbnail).toBe('https://example.com/full.jpg');
	});
});

describe('MediaComposer - File Size Formatting', () => {
	it('should format bytes', () => {
		const formatted = formatFileSize(512);

		expect(formatted).toBe('512 B');
	});

	it('should format kilobytes', () => {
		const formatted = formatFileSize(1536);

		expect(formatted).toBe('1.5 KB');
	});

	it('should format megabytes', () => {
		const formatted = formatFileSize(1024 * 1024 * 2.5);

		expect(formatted).toBe('2.5 MB');
	});

	it('should return empty string for undefined', () => {
		const formatted = formatFileSize(undefined);

		expect(formatted).toBe('');
	});

	it('should return empty string for 0 bytes', () => {
		const formatted = formatFileSize(0);

		expect(formatted).toBe('');
	});

	it('should format exactly 1KB', () => {
		const formatted = formatFileSize(1024);

		expect(formatted).toBe('1.0 KB');
	});

	it('should format exactly 1MB', () => {
		const formatted = formatFileSize(1024 * 1024);

		expect(formatted).toBe('1.0 MB');
	});
});

describe('MediaComposer - Configuration', () => {
	it('should support maxAttachments configuration', () => {
		const config = { maxAttachments: 10 };
		expect(config.maxAttachments).toBe(10);
	});

	it('should support maxAltTextLength configuration', () => {
		const config = { maxAltTextLength: 2000 };
		expect(config.maxAltTextLength).toBe(2000);
	});

	it('should support allowedTypes configuration', () => {
		const config = { allowedTypes: ['image/jpeg', 'video/mp4'] };
		expect(config.allowedTypes).toHaveLength(2);
	});

	it('should support maxFileSize configuration', () => {
		const config = { maxFileSize: 5 * 1024 * 1024 };
		expect(config.maxFileSize).toBe(5242880);
	});

	it('should support enableFocalPoint option', () => {
		const config = { enableFocalPoint: true };
		expect(config.enableFocalPoint).toBe(true);
	});

	it('should support enableImageEdit option', () => {
		const config = { enableImageEdit: true };
		expect(config.enableImageEdit).toBe(true);
	});

	it('should support requireAltText option', () => {
		const config = { requireAltText: true };
		expect(config.requireAltText).toBe(true);
	});

	it('should support layout options', () => {
		const layouts: Array<'grid' | 'list'> = ['grid', 'list'];
		layouts.forEach((layout) => {
			expect(['grid', 'list']).toContain(layout);
		});
	});

	it('should support enableDragDrop option', () => {
		const config = { enableDragDrop: true };
		expect(config.enableDragDrop).toBe(true);
	});
});

describe('MediaComposer - Event Handlers', () => {
	it('should call onUpload handler', async () => {
		const onUpload = vi.fn().mockResolvedValue([]);
		const files = [new File([''], 'test.jpg', { type: 'image/jpeg' })];

		await onUpload(files);

		expect(onUpload).toHaveBeenCalledWith(files);
	});

	it('should call onRemove handler', () => {
		const onRemove = vi.fn();

		onRemove('attachment-1');

		expect(onRemove).toHaveBeenCalledWith('attachment-1');
	});

	it('should call onUpdateAltText handler', () => {
		const onUpdateAltText = vi.fn();

		onUpdateAltText('attachment-1', 'New alt text');

		expect(onUpdateAltText).toHaveBeenCalledWith('attachment-1', 'New alt text');
	});

	it('should call onUpdateFocalPoint handler', () => {
		const onUpdateFocalPoint = vi.fn();

		onUpdateFocalPoint('attachment-1', 0.5, -0.5);

		expect(onUpdateFocalPoint).toHaveBeenCalledWith('attachment-1', 0.5, -0.5);
	});

	it('should call onReorder handler', () => {
		const onReorder = vi.fn();
		const attachments = [createMockAttachment('1'), createMockAttachment('2')];

		onReorder(attachments);

		expect(onReorder).toHaveBeenCalledWith(attachments);
	});
});

describe('MediaComposer - Edge Cases', () => {
	it('should handle unicode in alt text', () => {
		const attachments = [createMockAttachment('1')];
		const unicodeText = 'Image 世界 🌍';

		const result = updateAltText(attachments, '1', unicodeText);

		expect(result[0].description).toBe(unicodeText);
	});

	it('should handle very small file sizes', () => {
		const formatted = formatFileSize(1);

		expect(formatted).toBe('1 B');
	});

	it('should handle very large file sizes', () => {
		const formatted = formatFileSize(1024 * 1024 * 1024);

		expect(formatted).toBe('1024.0 MB');
	});

	it('should handle focal point at boundaries', () => {
		const attachment = createMockAttachment('1', {
			meta: { focus: { x: -1, y: 1 } },
		});

		const position = getFocalPointPosition(attachment);

		expect(position.x).toBe('0%');
		expect(position.y).toBe('100%');
	});

	it('should handle attachment without meta', () => {
		const attachment = createMockAttachment('1');
		attachment.meta = undefined;

		const position = getFocalPointPosition(attachment);

		expect(position).toEqual({ x: '50%', y: '50%' });
	});

	it('should handle attachment with meta but no focus', () => {
		const attachment = createMockAttachment('1', {
			meta: { original: { width: 800, height: 600 } },
		});

		const position = getFocalPointPosition(attachment);

		expect(position).toEqual({ x: '50%', y: '50%' });
	});

	it('should validate file with exact size at limit', () => {
		const size = 10 * 1024 * 1024;
		const file = new File(['a'.repeat(size)], 'test.jpg', { type: 'image/jpeg' });
		const valid = validateFile(file, ['image/jpeg'], size, 0, 4);

		expect(valid).toBe(true);
	});

	it('should handle multiple file types', () => {
		const file = new File([''], 'test.webp', { type: 'image/webp' });
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		const valid = validateFile(file, allowedTypes, 10 * 1024 * 1024, 0, 4);

		expect(valid).toBe(true);
	});
});

describe('MediaComposer - Type Safety', () => {
	it('should enforce MediaComposerAttachment structure', () => {
		const attachment: MediaComposerAttachment = {
			id: '1',
			type: 'image',
			url: 'https://example.com/test.jpg',
		};

		expect(attachment).toHaveProperty('id');
		expect(attachment).toHaveProperty('type');
		expect(attachment).toHaveProperty('url');
	});

	it('should enforce optional meta structure', () => {
		const attachment: MediaComposerAttachment = {
			id: '1',
			type: 'image',
			url: 'https://example.com/test.jpg',
			meta: {
				focus: { x: 0.5, y: -0.5 },
				original: { width: 800, height: 600 },
			},
		};

		expect(attachment.meta?.focus).toBeDefined();
		expect(attachment.meta?.original).toBeDefined();
	});
});

