import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	detectMediaType,
	formatFileSize,
	validateFile,
	validateFiles,
	cleanupMediaFiles,
	mapMimeTypeToMediaCategory,
	generateThumbnail,
	getImageDimensions,
	getVideoDuration,
	createPreviewUrl,
	processFile,
	processFiles,
	type MediaFile,
} from '../src/MediaUploadHandler.js';

// Mock browser APIs
const mockCreateObjectURL = vi.fn(() => 'blob:test-url');
const mockRevokeObjectURL = vi.fn();
const mockCanvasContext = {
	drawImage: vi.fn(),
};
const mockCanvas = {
	getContext: vi.fn(() => mockCanvasContext),
	toDataURL: vi.fn(() => 'data:image/jpeg;base64,thumb'),
	width: 0,
	height: 0,
};

describe('MediaUploadHandler', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		global.URL.createObjectURL = mockCreateObjectURL;
		global.URL.revokeObjectURL = mockRevokeObjectURL;

		// Default mocks
		global.document.createElement = vi.fn((tag) => {
			if (tag === 'canvas') return mockCanvas as any;
			if (tag === 'video')
				return {
					onloadedmetadata: null,
					onerror: null,
					src: '',
					duration: 10,
				} as any;
			return {} as any;
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('detectMediaType', () => {
		it('should detect image types', () => {
			expect(detectMediaType('image/jpeg')).toBe('image');
			expect(detectMediaType('image/png')).toBe('image');
		});

		it('should detect video types', () => {
			expect(detectMediaType('video/mp4')).toBe('video');
		});

		it('should detect audio types', () => {
			expect(detectMediaType('audio/mpeg')).toBe('audio');
		});

		it('should return unknown for unsupported types', () => {
			expect(detectMediaType('text/plain')).toBe('unknown');
		});
	});

	describe('mapMimeTypeToMediaCategory', () => {
		it('maps images correctly', () => {
			expect(mapMimeTypeToMediaCategory('image/jpeg')).toBe('IMAGE');
			expect(mapMimeTypeToMediaCategory('image/png')).toBe('IMAGE');
		});

		it('maps GIFs correctly', () => {
			expect(mapMimeTypeToMediaCategory('image/gif')).toBe('GIFV');
		});

		it('maps videos correctly', () => {
			expect(mapMimeTypeToMediaCategory('video/mp4')).toBe('VIDEO');
		});

		it('maps audio correctly', () => {
			expect(mapMimeTypeToMediaCategory('audio/mp3')).toBe('AUDIO');
		});

		it('maps others to DOCUMENT', () => {
			expect(mapMimeTypeToMediaCategory('application/pdf')).toBe('DOCUMENT');
			expect(mapMimeTypeToMediaCategory('text/plain')).toBe('DOCUMENT');
		});
	});

	describe('formatFileSize', () => {
		it('should format bytes', () => {
			expect(formatFileSize(500)).toBe('500 B');
		});

		it('should format kilobytes', () => {
			expect(formatFileSize(1024)).toBe('1.0 KB');
		});

		it('should format megabytes', () => {
			expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
		});

		it('should format gigabytes', () => {
			expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
		});
	});

	describe('validateFile', () => {
		it('should accept valid image files', () => {
			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const result = validateFile(file);
			expect(result.valid).toBe(true);
		});

		it('should accept valid video files', () => {
			const file = new File([''], 'test.mp4', { type: 'video/mp4' });
			const result = validateFile(file);
			expect(result.valid).toBe(true);
		});

		it('should reject files exceeding max size', () => {
			// Mock large file size check
			const file = { size: 9 * 1024 * 1024, type: 'image/jpeg' } as File;
			const result = validateFile(file, { maxFileSize: 8 * 1024 * 1024 });
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('exceeds limit');
		});

		it('should allow larger size for video', () => {
			const file = { size: 30 * 1024 * 1024, type: 'video/mp4' } as File;
			const result = validateFile(file, { maxFileSize: 8 * 1024 * 1024 });
			expect(result.valid).toBe(true);
		});

		it('should reject very large video', () => {
			const file = { size: 50 * 1024 * 1024, type: 'video/mp4' } as File;
			const result = validateFile(file);
			expect(result.valid).toBe(false);
		});

		it('should reject unsupported file types', () => {
			const file = new File([''], 'test.exe', { type: 'application/x-msdownload' });
			const result = validateFile(file);
			expect(result.valid).toBe(false);
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
			const files = [1, 2, 3].map((i) => new File([''], `img${i}.jpg`, { type: 'image/jpeg' }));
			const result = validateFiles(files, { maxFiles: 2 });
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Maximum 2 files allowed');
		});
	});

	describe('createPreviewUrl', () => {
		it('creates url for image', async () => {
			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const url = await createPreviewUrl(file);
			expect(url).toBe('blob:test-url');
		});

		it('creates url for video', async () => {
			const file = new File([''], 'test.mp4', { type: 'video/mp4' });
			const url = await createPreviewUrl(file);
			expect(url).toBe('blob:test-url');
		});

		it('returns empty string for audio', async () => {
			const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
			const url = await createPreviewUrl(file);
			expect(url).toBe('');
		});

		it('returns empty string for unknown', async () => {
			const file = new File([''], 'test.txt', { type: 'text/plain' });
			const url = await createPreviewUrl(file);
			expect(url).toBe('');
		});
	});

	describe('generateThumbnail', () => {
		it('returns null for non-image', async () => {
			const file = new File([''], 'test.mp4', { type: 'video/mp4' });
			const thumb = await generateThumbnail(file);
			expect(thumb).toBeNull();
		});

		it('generates thumbnail for image', async () => {
			// Mock Image loading
			global.Image = class {
				onload: any;
				src: string = '';
				width = 400;
				height = 300;
				constructor() {
					setTimeout(() => this.onload && this.onload({} as any), 0);
				}
			} as any;

			// Mock FileReader
			global.FileReader = class {
				onload: any;
				readAsDataURL() {
					setTimeout(() => this.onload && this.onload({ target: { result: 'base64' } }), 0);
				}
			} as any;

			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const thumb = await generateThumbnail(file);
			expect(thumb).toBe('data:image/jpeg;base64,thumb');
			expect(mockCanvasContext.drawImage).toHaveBeenCalled();
		});

		it('handles resizing landscape', async () => {
			global.Image = class {
				onload: any;
				width = 400;
				height = 200; // 2:1 ratio
				constructor() {
					setTimeout(() => this.onload && this.onload({} as any), 0);
				}
			} as any;
			global.FileReader = class {
				onload: any;
				readAsDataURL() {
					setTimeout(() => this.onload({ target: { result: 'b' } }), 0);
				}
			} as any;

			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			await generateThumbnail(file, 100);

			// Width should be 100, Height should be 50
			expect(mockCanvas.width).toBe(100);
			expect(mockCanvas.height).toBe(50);
		});

		it('handles resizing portrait', async () => {
			global.Image = class {
				onload: any;
				width = 200;
				height = 400; // 1:2 ratio
				constructor() {
					setTimeout(() => this.onload && this.onload({} as any), 0);
				}
			} as any;
			global.FileReader = class {
				onload: any;
				readAsDataURL() {
					setTimeout(() => this.onload({ target: { result: 'b' } }), 0);
				}
			} as any;

			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			await generateThumbnail(file, 100);

			// Height should be 100, Width should be 50
			expect(mockCanvas.height).toBe(100);
			expect(mockCanvas.width).toBe(50);
		});

		it('handles canvas context error', async () => {
			global.Image = class {
				onload: any;
				width = 100;
				height = 100;
				constructor() {
					setTimeout(() => this.onload && this.onload({} as any), 0);
				}
			} as any;
			global.FileReader = class {
				onload: any;
				readAsDataURL() {
					setTimeout(() => this.onload({ target: { result: 'b' } }), 0);
				}
			} as any;

			// Mock getContext returning null
			mockCanvas.getContext.mockReturnValueOnce(null);

			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const thumb = await generateThumbnail(file);
			expect(thumb).toBeNull();
		});

		it('handles image load error', async () => {
			global.Image = class {
				onerror: any;
				constructor() {
					setTimeout(() => this.onerror && this.onerror(), 0);
				}
			} as any;
			global.FileReader = class {
				onload: any;
				readAsDataURL() {
					setTimeout(() => this.onload({ target: { result: 'b' } }), 0);
				}
			} as any;

			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const thumb = await generateThumbnail(file);
			expect(thumb).toBeNull();
		});
	});

	describe('getImageDimensions', () => {
		it('returns dimensions for image', async () => {
			global.Image = class {
				onload: any;
				width = 123;
				height = 456;
				src = '';
				constructor() {
					setTimeout(() => this.onload && this.onload(), 0);
				}
			} as any;

			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const dims = await getImageDimensions(file);
			expect(dims).toEqual({ width: 123, height: 456 });
		});

		it('returns null for non-image', async () => {
			const file = new File([''], 'test.txt', { type: 'text/plain' });
			const dims = await getImageDimensions(file);
			expect(dims).toBeNull();
		});

		it('handles error', async () => {
			global.Image = class {
				onerror: any;
				src = '';
				constructor() {
					setTimeout(() => this.onerror && this.onerror(), 0);
				}
			} as any;

			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const dims = await getImageDimensions(file);
			expect(dims).toBeNull();
		});
	});

	describe('getVideoDuration', () => {
		it('returns duration for video', async () => {
			global.document.createElement = vi.fn((tag) => {
				if (tag === 'video')
					return {
						onloadedmetadata: null,
						duration: 42,
						set src(_v: string) {
							setTimeout(() => this.onloadedmetadata(), 0);
						},
					} as any;
				return {} as any;
			});

			const file = new File([''], 'test.mp4', { type: 'video/mp4' });
			const duration = await getVideoDuration(file);
			expect(duration).toBe(42);
		});

		it('returns null for non-video', async () => {
			const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
			const duration = await getVideoDuration(file);
			expect(duration).toBeNull();
		});

		it('handles error', async () => {
			global.document.createElement = vi.fn((tag) => {
				if (tag === 'video')
					return {
						onerror: null,
						set src(_v: string) {
							setTimeout(() => this.onerror(), 0);
						},
					} as any;
				return {} as any;
			});

			const file = new File([''], 'test.mp4', { type: 'video/mp4' });
			const duration = await getVideoDuration(file);
			expect(duration).toBeNull();
		});
	});

	describe('processFile', () => {
		it('processes video file', async () => {
			global.document.createElement = vi.fn((tag) => {
				if (tag === 'video')
					return {
						onloadedmetadata: null,
						duration: 15,
						set src(_v: string) {
							setTimeout(() => this.onloadedmetadata(), 0);
						},
					} as any;
				return {} as any;
			});

			const file = new File([''], 'test.mp4', { type: 'video/mp4' });
			const result = await processFile(file);

			expect(result.type).toBe('video');
			expect(result.metadata?.duration).toBe(15);
		});

		it('handles validation error', async () => {
			const file = { size: 999999999, type: 'image/jpeg' } as File;
			const result = await processFile(file);
			expect(result.status).toBe('error');
		});
	});

	describe('processFiles', () => {
		it('slices max files', async () => {
			// Mock success
			global.Image = class {
				onload: any;
				constructor() {
					setTimeout(() => this.onload && this.onload({} as any), 0);
				}
			} as any;
			global.FileReader = class {
				onload: any;
				readAsDataURL() {
					setTimeout(() => this.onload({ target: { result: 'b' } }), 0);
				}
			} as any;

			const files = [1, 2, 3, 4, 5].map(
				(i) => new File([''], `img${i}.jpg`, { type: 'image/jpeg' })
			);
			const results = await processFiles(files, { maxFiles: 2 });

			// Wait, processFiles uses validateFiles which fails if > maxFiles
			// processFiles implementation:
			// if (!validation.valid) return files.map(...)
			// So if I pass 5 files and maxFiles is 2, it returns 5 error results.

			expect(results).toHaveLength(5);
			expect(results[0].status).toBe('error');
		});

		it('works when files are within limit', async () => {
			global.Image = class {
				onload: any;
				constructor() {
					setTimeout(() => this.onload && this.onload({} as any), 0);
				}
			} as any;
			global.FileReader = class {
				onload: any;
				readAsDataURL() {
					setTimeout(() => this.onload({ target: { result: 'b' } }), 0);
				}
			} as any;

			const files = [new File([''], 'test.jpg', { type: 'image/jpeg' })];
			const results = await processFiles(files);
			expect(results).toHaveLength(1);
			expect(results[0].status).toBe('pending');
		});
	});

	describe('cleanupMediaFiles', () => {
		it('should clean up files', () => {
			const file: MediaFile = {
				id: '1',
				file: new File([], 't'),
				type: 'image',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				previewUrl: 'blob:something',
			};
			cleanupMediaFiles([file]);
			expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:something');
		});
	});
});
