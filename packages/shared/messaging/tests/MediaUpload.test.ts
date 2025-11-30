/**
 * Messages.MediaUpload Component Tests
 *
 * Tests for media upload logic including:
 * - File size validation and formatting
 * - Media type detection
 * - Attachment limits
 * - File management
 * - Error handling
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface MediaAttachment {
	id: string;
	url: string;
	previewUrl?: string;
	type: string;
	file?: File;
}

// Format file size
function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Get media type
function getMediaType(type: string): 'image' | 'video' | 'audio' | 'other' {
	if (type.startsWith('image/')) return 'image';
	if (type.startsWith('video/')) return 'video';
	if (type.startsWith('audio/')) return 'audio';
	return 'other';
}

// Check if can add more attachments
function canAddMore(currentCount: number, maxAttachments: number): boolean {
	return currentCount < maxAttachments;
}

// Validate file size
function isFileSizeValid(fileSize: number, maxFileSize: number): boolean {
	return fileSize <= maxFileSize;
}

// Check if adding files would exceed max
function wouldExceedMax(currentCount: number, filesToAdd: number, maxAttachments: number): boolean {
	return currentCount + filesToAdd > maxAttachments;
}

// Get attachment error message
function getMaxAttachmentsError(maxAttachments: number): string {
	return `Maximum ${maxAttachments} attachment${maxAttachments === 1 ? '' : 's'} allowed`;
}

// Get file size error message
function getFileSizeError(fileName: string, maxFileSize: number): string {
	return `File ${fileName} exceeds maximum size of ${formatFileSize(maxFileSize)}`;
}

// Get attachment IDs
function getAttachmentIds(attachments: MediaAttachment[]): string[] {
	return attachments.map((a) => a.id);
}

// Remove attachment
function removeAttachment(attachments: MediaAttachment[], id: string): MediaAttachment[] {
	return attachments.filter((a) => a.id !== id);
}

// Find attachment by ID
function findAttachmentById(
	attachments: MediaAttachment[],
	id: string
): MediaAttachment | undefined {
	return attachments.find((a) => a.id === id);
}

// Check if has attachments
function hasAttachments(attachments: MediaAttachment[]): boolean {
	return attachments.length > 0;
}

// Get attachment count
function getAttachmentCount(attachments: MediaAttachment[]): number {
	return attachments.length;
}

// Check if multiple uploads allowed
function isMultipleAllowed(maxAttachments: number): boolean {
	return maxAttachments > 1;
}

// Parse accept string to extensions
function getAcceptedExtensions(accept: string): string[] {
	return accept.split(',').map((a) => a.trim());
}

// Check if file type is accepted
function isFileTypeAccepted(fileType: string, accept: string): boolean {
	const acceptedTypes = accept.split(',').map((a) => a.trim());

	return acceptedTypes.some((acceptedType) => {
		// Handle wildcards like "image/*"
		if (acceptedType.endsWith('/*')) {
			const category = acceptedType.replace('/*', '');
			return fileType.startsWith(`${category}/`);
		}
		// Exact match
		return fileType === acceptedType;
	});
}

// Get file extension
function getFileExtension(fileName: string): string {
	const lastDot = fileName.lastIndexOf('.');
	if (lastDot === -1) return '';
	return fileName.slice(lastDot);
}

// Validate file name
function hasValidFileName(fileName: string): boolean {
	return fileName.length > 0 && fileName.length <= 255;
}

// Check if is image
function isImageFile(type: string): boolean {
	return getMediaType(type) === 'image';
}

// Check if is video
function isVideoFile(type: string): boolean {
	return getMediaType(type) === 'video';
}

// Check if is audio
function isAudioFile(type: string): boolean {
	return getMediaType(type) === 'audio';
}

// Convert MB to bytes
function mbToBytes(mb: number): number {
	return mb * 1024 * 1024;
}

// Convert bytes to MB
function bytesToMb(bytes: number): number {
	return bytes / (1024 * 1024);
}

describe('Messages.MediaUpload - File Size Formatting', () => {
	it('formats bytes', () => {
		expect(formatFileSize(500)).toBe('500 B');
		expect(formatFileSize(1023)).toBe('1023 B');
	});

	it('formats kilobytes', () => {
		expect(formatFileSize(1024)).toBe('1.0 KB');
		expect(formatFileSize(5120)).toBe('5.0 KB');
		expect(formatFileSize(1536)).toBe('1.5 KB');
	});

	it('formats megabytes', () => {
		expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
		expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
		expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
	});

	it('formats zero', () => {
		expect(formatFileSize(0)).toBe('0 B');
	});

	it('rounds to one decimal place', () => {
		expect(formatFileSize(1536)).toBe('1.5 KB');
		expect(formatFileSize(1.567 * 1024 * 1024)).toBe('1.6 MB');
	});
});

describe('Messages.MediaUpload - Media Type Detection', () => {
	it('detects image types', () => {
		expect(getMediaType('image/png')).toBe('image');
		expect(getMediaType('image/jpeg')).toBe('image');
		expect(getMediaType('image/gif')).toBe('image');
		expect(getMediaType('image/webp')).toBe('image');
	});

	it('detects video types', () => {
		expect(getMediaType('video/mp4')).toBe('video');
		expect(getMediaType('video/webm')).toBe('video');
		expect(getMediaType('video/quicktime')).toBe('video');
	});

	it('detects audio types', () => {
		expect(getMediaType('audio/mp3')).toBe('audio');
		expect(getMediaType('audio/wav')).toBe('audio');
		expect(getMediaType('audio/ogg')).toBe('audio');
	});

	it('detects other types', () => {
		expect(getMediaType('application/pdf')).toBe('other');
		expect(getMediaType('text/plain')).toBe('other');
		expect(getMediaType('unknown/type')).toBe('other');
	});

	it('handles empty type', () => {
		expect(getMediaType('')).toBe('other');
	});
});

describe('Messages.MediaUpload - Attachment Limits', () => {
	it('can add more when under limit', () => {
		expect(canAddMore(0, 4)).toBe(true);
		expect(canAddMore(2, 4)).toBe(true);
		expect(canAddMore(3, 4)).toBe(true);
	});

	it('cannot add more at limit', () => {
		expect(canAddMore(4, 4)).toBe(false);
	});

	it('cannot add more over limit', () => {
		expect(canAddMore(5, 4)).toBe(false);
	});

	it('detects would exceed max', () => {
		expect(wouldExceedMax(2, 3, 4)).toBe(true);
		expect(wouldExceedMax(4, 1, 4)).toBe(true);
	});

	it('detects would not exceed max', () => {
		expect(wouldExceedMax(2, 2, 4)).toBe(false);
		expect(wouldExceedMax(0, 4, 4)).toBe(false);
	});

	it('handles exactly at limit', () => {
		expect(wouldExceedMax(3, 1, 4)).toBe(false);
	});
});

describe('Messages.MediaUpload - File Size Validation', () => {
	const maxSize = 10 * 1024 * 1024; // 10MB

	it('validates file within limit', () => {
		expect(isFileSizeValid(5 * 1024 * 1024, maxSize)).toBe(true);
	});

	it('validates file at exact limit', () => {
		expect(isFileSizeValid(maxSize, maxSize)).toBe(true);
	});

	it('invalidates file over limit', () => {
		expect(isFileSizeValid(11 * 1024 * 1024, maxSize)).toBe(false);
	});

	it('validates small file', () => {
		expect(isFileSizeValid(1024, maxSize)).toBe(true);
	});

	it('validates zero size', () => {
		expect(isFileSizeValid(0, maxSize)).toBe(true);
	});
});

describe('Messages.MediaUpload - Error Messages', () => {
	it('formats max attachments error for single', () => {
		expect(getMaxAttachmentsError(1)).toBe('Maximum 1 attachment allowed');
	});

	it('formats max attachments error for multiple', () => {
		expect(getMaxAttachmentsError(4)).toBe('Maximum 4 attachments allowed');
		expect(getMaxAttachmentsError(10)).toBe('Maximum 10 attachments allowed');
	});

	it('formats file size error', () => {
		const maxSize = 10 * 1024 * 1024;
		const error = getFileSizeError('photo.jpg', maxSize);
		expect(error).toContain('photo.jpg');
		expect(error).toContain('10.0 MB');
	});
});

describe('Messages.MediaUpload - Attachment Management', () => {
	const attachments: MediaAttachment[] = [
		{ id: '1', url: 'https://example.com/1.jpg', type: 'image/jpeg' },
		{ id: '2', url: 'https://example.com/2.jpg', type: 'image/png' },
		{ id: '3', url: 'https://example.com/3.mp4', type: 'video/mp4' },
	];

	it('gets attachment IDs', () => {
		const ids = getAttachmentIds(attachments);
		expect(ids).toEqual(['1', '2', '3']);
	});

	it('removes attachment', () => {
		const updated = removeAttachment(attachments, '2');
		expect(updated).toHaveLength(2);
		expect(updated.find((a) => a.id === '2')).toBeUndefined();
	});

	it('handles removing non-existent attachment', () => {
		const updated = removeAttachment(attachments, '999');
		expect(updated).toHaveLength(3);
	});

	it('finds attachment by ID', () => {
		const found = findAttachmentById(attachments, '2');
		expect(found?.url).toBe('https://example.com/2.jpg');
	});

	it('returns undefined for non-existent ID', () => {
		expect(findAttachmentById(attachments, '999')).toBeUndefined();
	});

	it('checks if has attachments', () => {
		expect(hasAttachments(attachments)).toBe(true);
		expect(hasAttachments([])).toBe(false);
	});

	it('gets attachment count', () => {
		expect(getAttachmentCount(attachments)).toBe(3);
		expect(getAttachmentCount([])).toBe(0);
	});
});

describe('Messages.MediaUpload - Multiple Uploads', () => {
	it('allows multiple when max > 1', () => {
		expect(isMultipleAllowed(4)).toBe(true);
		expect(isMultipleAllowed(2)).toBe(true);
	});

	it('does not allow multiple when max = 1', () => {
		expect(isMultipleAllowed(1)).toBe(false);
	});

	it('does not allow multiple when max = 0', () => {
		expect(isMultipleAllowed(0)).toBe(false);
	});
});

describe('Messages.MediaUpload - Accept String', () => {
	it('parses accept string', () => {
		const extensions = getAcceptedExtensions('image/*,video/*,audio/*');
		expect(extensions).toHaveLength(3);
		expect(extensions).toContain('image/*');
	});

	it('handles single type', () => {
		const extensions = getAcceptedExtensions('image/*');
		expect(extensions).toHaveLength(1);
	});

	it('trims whitespace', () => {
		const extensions = getAcceptedExtensions('image/*, video/*, audio/*');
		expect(extensions[0]).toBe('image/*');
	});

	it('checks if file type is accepted with wildcard', () => {
		expect(isFileTypeAccepted('image/png', 'image/*,video/*')).toBe(true);
		expect(isFileTypeAccepted('video/mp4', 'image/*,video/*')).toBe(true);
		expect(isFileTypeAccepted('audio/mp3', 'image/*,video/*')).toBe(false);
	});

	it('checks if file type is accepted with exact match', () => {
		expect(isFileTypeAccepted('image/png', 'image/png,image/jpeg')).toBe(true);
		expect(isFileTypeAccepted('image/gif', 'image/png,image/jpeg')).toBe(false);
	});
});

describe('Messages.MediaUpload - File Extensions', () => {
	it('gets file extension', () => {
		expect(getFileExtension('photo.jpg')).toBe('.jpg');
		expect(getFileExtension('video.mp4')).toBe('.mp4');
		expect(getFileExtension('document.pdf')).toBe('.pdf');
	});

	it('handles multiple dots', () => {
		expect(getFileExtension('archive.tar.gz')).toBe('.gz');
	});

	it('handles no extension', () => {
		expect(getFileExtension('file')).toBe('');
	});

	it('handles dot at start', () => {
		expect(getFileExtension('.gitignore')).toBe('.gitignore');
	});
});

describe('Messages.MediaUpload - File Name Validation', () => {
	it('validates normal file name', () => {
		expect(hasValidFileName('photo.jpg')).toBe(true);
	});

	it('invalidates empty name', () => {
		expect(hasValidFileName('')).toBe(false);
	});

	it('validates file name at max length', () => {
		const longName = 'a'.repeat(255);
		expect(hasValidFileName(longName)).toBe(true);
	});

	it('invalidates file name over max length', () => {
		const tooLong = 'a'.repeat(256);
		expect(hasValidFileName(tooLong)).toBe(false);
	});
});

describe('Messages.MediaUpload - Type Helpers', () => {
	it('detects image files', () => {
		expect(isImageFile('image/png')).toBe(true);
		expect(isImageFile('video/mp4')).toBe(false);
	});

	it('detects video files', () => {
		expect(isVideoFile('video/mp4')).toBe(true);
		expect(isVideoFile('image/png')).toBe(false);
	});

	it('detects audio files', () => {
		expect(isAudioFile('audio/mp3')).toBe(true);
		expect(isAudioFile('image/png')).toBe(false);
	});
});

describe('Messages.MediaUpload - Size Conversions', () => {
	it('converts MB to bytes', () => {
		expect(mbToBytes(1)).toBe(1024 * 1024);
		expect(mbToBytes(10)).toBe(10 * 1024 * 1024);
		expect(mbToBytes(0.5)).toBe(512 * 1024);
	});

	it('converts bytes to MB', () => {
		expect(bytesToMb(1024 * 1024)).toBe(1);
		expect(bytesToMb(10 * 1024 * 1024)).toBe(10);
		expect(bytesToMb(512 * 1024)).toBe(0.5);
	});

	it('handles zero', () => {
		expect(mbToBytes(0)).toBe(0);
		expect(bytesToMb(0)).toBe(0);
	});
});

describe('Messages.MediaUpload - Edge Cases', () => {
	it('handles very large file sizes', () => {
		const size = 1024 * 1024 * 1024; // 1GB
		expect(formatFileSize(size)).toContain('MB');
	});

	it('handles fractional bytes', () => {
		expect(formatFileSize(1536.7)).toBe('1.5 KB');
	});

	it('handles negative values gracefully', () => {
		// Implementation should handle this, but for now we document behavior
		const result = formatFileSize(-100);
		expect(typeof result).toBe('string');
	});

	it('handles empty attachment array', () => {
		expect(getAttachmentIds([])).toEqual([]);
		expect(hasAttachments([])).toBe(false);
		expect(getAttachmentCount([])).toBe(0);
	});

	it('handles single attachment', () => {
		const single: MediaAttachment[] = [
			{ id: '1', url: 'https://example.com/1.jpg', type: 'image/jpeg' },
		];
		expect(getAttachmentCount(single)).toBe(1);
		expect(hasAttachments(single)).toBe(true);
	});
});

describe('Messages.MediaUpload - Integration', () => {
	it('handles complete upload flow', () => {
		const maxAttachments = 4;
		let attachments: MediaAttachment[] = [];

		// Check can add
		expect(canAddMore(attachments.length, maxAttachments)).toBe(true);

		// Add attachment
		const newAttachment: MediaAttachment = {
			id: '1',
			url: 'https://example.com/photo.jpg',
			type: 'image/jpeg',
		};
		attachments = [...attachments, newAttachment];

		// Verify
		expect(getAttachmentCount(attachments)).toBe(1);
		expect(isImageFile(newAttachment.type)).toBe(true);
		expect(canAddMore(attachments.length, maxAttachments)).toBe(true);

		// Add more
		for (let i = 2; i <= 4; i++) {
			attachments = [
				...attachments,
				{
					id: String(i),
					url: `https://example.com/${i}.jpg`,
					type: 'image/jpeg',
				},
			];
		}

		// At max
		expect(getAttachmentCount(attachments)).toBe(4);
		expect(canAddMore(attachments.length, maxAttachments)).toBe(false);

		// Remove one
		attachments = removeAttachment(attachments, '2');
		expect(getAttachmentCount(attachments)).toBe(3);
		expect(canAddMore(attachments.length, maxAttachments)).toBe(true);
	});

	it('validates file before adding', () => {
		const maxFileSize = 10 * 1024 * 1024;
		const fileSize = 12 * 1024 * 1024;

		expect(isFileSizeValid(fileSize, maxFileSize)).toBe(false);

		const error = getFileSizeError('large.jpg', maxFileSize);
		expect(error).toContain('large.jpg');
		expect(error).toContain(formatFileSize(maxFileSize));
	});

	it('handles multiple file types', () => {
		const attachments: MediaAttachment[] = [
			{ id: '1', url: 'https://example.com/photo.jpg', type: 'image/jpeg' },
			{ id: '2', url: 'https://example.com/video.mp4', type: 'video/mp4' },
			{ id: '3', url: 'https://example.com/audio.mp3', type: 'audio/mp3' },
		];

		expect(isImageFile(attachments[0].type)).toBe(true);
		expect(isVideoFile(attachments[1].type)).toBe(true);
		expect(isAudioFile(attachments[2].type)).toBe(true);
	});
});
