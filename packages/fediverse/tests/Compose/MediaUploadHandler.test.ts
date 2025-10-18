import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	detectMediaType,
	formatFileSize,
	validateFile,
	validateFiles,
	cleanupMediaFile,
	cleanupMediaFiles,
	type MediaFile,
} from '../../src/components/Compose/MediaUploadHandler.js';

// Mock URL.revokeObjectURL for Node environment
beforeEach(() => {
	if (typeof URL.revokeObjectURL === 'undefined') {
		global.URL.revokeObjectURL = vi.fn();
	}
});

describe('MediaUploadHandler', () => {
	describe('detectMediaType', () => {
		it('should detect image types', () => {
			expect(detectMediaType('image/jpeg')).toBe('image');
			expect(detectMediaType('image/png')).toBe('image');
			expect(detectMediaType('image/gif')).toBe('image');
			expect(detectMediaType('image/webp')).toBe('image');
		});

		it('should detect video types', () => {
			expect(detectMediaType('video/mp4')).toBe('video');
			expect(detectMediaType('video/webm')).toBe('video');
			expect(detectMediaType('video/ogg')).toBe('video');
		});

		it('should detect audio types', () => {
			expect(detectMediaType('audio/mpeg')).toBe('audio');
			expect(detectMediaType('audio/ogg')).toBe('audio');
			expect(detectMediaType('audio/wav')).toBe('audio');
		});

		it('should return unknown for unsupported types', () => {
			expect(detectMediaType('text/plain')).toBe('unknown');
			expect(detectMediaType('application/pdf')).toBe('unknown');
		});
	});

	describe('formatFileSize', () => {
		it('should format bytes', () => {
			expect(formatFileSize(500)).toBe('500 B');
			expect(formatFileSize(1023)).toBe('1023 B');
		});

		it('should format kilobytes', () => {
			expect(formatFileSize(1024)).toBe('1.0 KB');
			expect(formatFileSize(1536)).toBe('1.5 KB');
			expect(formatFileSize(10240)).toBe('10.0 KB');
		});

		it('should format megabytes', () => {
			expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
			expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
			expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
		});

		it('should format gigabytes', () => {
			expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
			expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
		});

		it('should handle zero', () => {
			expect(formatFileSize(0)).toBe('0 B');
		});
	});

	describe('validateFile', () => {
		it('should accept valid image files', () => {
			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const result = validateFile(file);

			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});

		it('should accept valid video files', () => {
			const file = new File([''], 'test.mp4', { type: 'video/mp4' });
			const result = validateFile(file);

			expect(result.valid).toBe(true);
		});

		it('should reject files exceeding max size', () => {
			// Create a file larger than default 8MB
			const largeData = new Array(9 * 1024 * 1024).join('a');
			const file = new File([largeData], 'large.jpg', { type: 'image/jpeg' });
			const result = validateFile(file, { maxFileSize: 8 * 1024 * 1024 });

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0]).toContain('exceeds limit');
		});

		it('should reject unsupported file types when allowedTypes specified', () => {
			const file = new File([''], 'test.gif', { type: 'image/gif' });
			const result = validateFile(file, {
				allowedTypes: ['image/jpeg', 'image/png'],
			});

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should handle empty files', () => {
			const file = new File([], 'empty.jpg', { type: 'image/jpeg' });
			const result = validateFile(file);

			// Empty files should still pass type validation
			expect(result.valid).toBe(true);
		});
	});

	describe('validateFiles', () => {
		it('should validate multiple files', () => {
			const files = [
				new File([''], 'image1.jpg', { type: 'image/jpeg' }),
				new File([''], 'image2.png', { type: 'image/png' }),
			];

			const result = validateFiles(files);

			expect(result.valid).toBe(true);
		});

		it('should reject when exceeding max files', () => {
			const files = [
				new File([''], 'image1.jpg', { type: 'image/jpeg' }),
				new File([''], 'image2.png', { type: 'image/png' }),
				new File([''], 'image3.jpg', { type: 'image/jpeg' }),
			];

			const result = validateFiles(files, { maxFiles: 2 });

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Maximum 2 files allowed');
		});

		it('should detect mixed valid and invalid files', () => {
			const files = [
				new File([''], 'valid.jpg', { type: 'image/jpeg' }),
				new File([''], 'invalid.txt', { type: 'text/plain' }),
			];

			const result = validateFiles(files, {
				allowedTypes: ['image/jpeg', 'image/png'],
			});

			expect(result.valid).toBe(false);
		});

		it('should handle empty array', () => {
			const result = validateFiles([]);

			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});
	});

	describe('cleanupMediaFile', () => {
		it('should revoke object URL', () => {
			const mockUrl = 'blob:http://localhost/test';
			const mediaFile: MediaFile = {
				id: 'test-1',
				file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
				type: 'image',
				previewUrl: mockUrl,
				progress: 100,
				status: 'complete',
				metadata: {
					size: 1024,
				},
			};

			// Just verify it doesn't throw
			expect(() => cleanupMediaFile(mediaFile)).not.toThrow();
		});

		it('should handle missing preview URL', () => {
			const mediaFile: MediaFile = {
				id: 'test-1',
				file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
				type: 'image',
				progress: 100,
				status: 'complete',
				metadata: {
					size: 1024,
				},
			};

			expect(() => cleanupMediaFile(mediaFile)).not.toThrow();
		});
	});

	describe('cleanupMediaFiles', () => {
		it('should cleanup multiple files', () => {
			const mediaFiles: MediaFile[] = [
				{
					id: 'test-1',
					file: new File([''], 'test1.jpg', { type: 'image/jpeg' }),
					type: 'image',
					previewUrl: 'blob:http://localhost/test1',
					progress: 100,
					status: 'complete',
					metadata: { size: 1024 },
				},
				{
					id: 'test-2',
					file: new File([''], 'test2.jpg', { type: 'image/jpeg' }),
					type: 'image',
					previewUrl: 'blob:http://localhost/test2',
					progress: 100,
					status: 'complete',
					metadata: { size: 2048 },
				},
			];

			expect(() => cleanupMediaFiles(mediaFiles)).not.toThrow();
		});

		it('should handle empty array', () => {
			expect(() => cleanupMediaFiles([])).not.toThrow();
		});
	});

	describe('Edge Cases', () => {
		it('should handle files with special characters in name', () => {
			const file = new File([''], 'test file (1) [copy].jpg', { type: 'image/jpeg' });
			const result = validateFile(file);

			expect(result.valid).toBe(true);
		});

		it('should handle files with unicode names', () => {
			const file = new File([''], '测试 🎉.jpg', { type: 'image/jpeg' });
			const result = validateFile(file);

			expect(result.valid).toBe(true);
		});

		it('should handle very long filenames', () => {
			const longName = 'a'.repeat(300) + '.jpg';
			const file = new File([''], longName, { type: 'image/jpeg' });
			const result = validateFile(file);

			expect(result.valid).toBe(true);
		});

		it('should format very large file sizes', () => {
			expect(formatFileSize(10 * 1024 * 1024 * 1024)).toBe('10.0 GB');
		});

		it('should handle files without extension', () => {
			const file = new File([''], 'test', { type: 'image/jpeg' });
			const result = validateFile(file);

			expect(result.valid).toBe(true);
		});
	});
});
