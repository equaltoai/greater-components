/**
 * Media Upload Handler
 * 
 * Handles file validation, upload progress tracking, and media processing.
 * Supports images, videos, audio with size/type validation.
 */

import type { MediaCategory } from '../../types.js';

export interface MediaUploadConfig {
	/**
	 * Maximum file size in bytes
	 * @default 8MB for images, 40MB for video
	 */
	maxFileSize?: number;

	/**
	 * Allowed MIME types
	 */
	allowedTypes?: string[];

	/**
	 * Maximum number of files
	 */
	maxFiles?: number;

	/**
	 * Generate thumbnails
	 */
	generateThumbnails?: boolean;

	/**
	 * Thumbnail size
	 */
	thumbnailSize?: number;
}

export interface MediaFile {
	/**
	 * Unique ID
	 */
	id: string;

	/**
	 * File object
	 */
	file: File;

	/**
	 * File type
	 */
	type: 'image' | 'video' | 'audio' | 'unknown';

	/**
	 * Preview URL (data URL or object URL)
	 */
	previewUrl?: string;

	/**
	 * Thumbnail URL
	 */
	thumbnailUrl?: string;

	/**
	 * Upload progress (0-100)
	 */
	progress: number;

	/**
	 * Upload status
	 */
	status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';

	/**
	 * Error message if failed
	 */
	error?: string;

	/**
	 * Server-assigned ID after upload
	 */
	serverId?: string;

	/**
	 * Alt text description
	 */
	description?: string;

	/**
	 * Spoiler / content warning text
	 */
	spoilerText: string;

	/**
	 * Whether the media is sensitive
	 */
	sensitive: boolean;

	/**
	 * Server-side media category
	 */
	mediaCategory: MediaCategory;

	/**
	 * Client-side validation errors for metadata fields
	 */
	metadataErrors?: {
		spoiler?: string;
		description?: string;
	};

	/**
	 * Focal point for cropping
	 */
	focalPoint?: { x: number; y: number };

	/**
	 * File metadata
	 */
	metadata?: {
		width?: number;
		height?: number;
		duration?: number;
		size: number;
	};
}

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<MediaUploadConfig> = {
	maxFileSize: 8 * 1024 * 1024, // 8MB
	allowedTypes: [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
		'video/mp4',
		'video/webm',
		'audio/mp3',
		'audio/ogg',
		'audio/wav',
	],
	maxFiles: 4,
	generateThumbnails: true,
	thumbnailSize: 200,
};

/**
 * Detect media type from MIME type
 */
export function detectMediaType(mimeType: string): 'image' | 'video' | 'audio' | 'unknown' {
	if (mimeType.startsWith('image/')) return 'image';
	if (mimeType.startsWith('video/')) return 'video';
	if (mimeType.startsWith('audio/')) return 'audio';
	return 'unknown';
}

/**
 * Map MIME type to MediaCategory enum used by the GraphQL API
 */
export function mapMimeTypeToMediaCategory(mimeType: string): MediaCategory {
	const lower = mimeType.toLowerCase();

	if (lower.startsWith('image/')) {
		if (lower === 'image/gif') {
			return 'GIFV';
		}
		return 'IMAGE';
	}

	if (lower.startsWith('video/')) {
		return 'VIDEO';
	}

	if (lower.startsWith('audio/')) {
		return 'AUDIO';
	}

	return 'DOCUMENT';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Validate a single file
 */
export function validateFile(file: File, config: MediaUploadConfig = {}): ValidationResult {
	const cfg = { ...DEFAULT_CONFIG, ...config };
	const errors: string[] = [];

	// Check file size
	const maxSize = detectMediaType(file.type) === 'video' ? 40 * 1024 * 1024 : cfg.maxFileSize;
	if (file.size > maxSize) {
		errors.push(`File size ${formatFileSize(file.size)} exceeds limit of ${formatFileSize(maxSize)}`);
	}

	// Check file type
	if (!cfg.allowedTypes.includes(file.type)) {
		errors.push(`File type ${file.type} is not allowed`);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate multiple files
 */
export function validateFiles(files: File[], config: MediaUploadConfig = {}): ValidationResult {
	const cfg = { ...DEFAULT_CONFIG, ...config };
	const errors: string[] = [];

	// Check file count
	if (files.length > cfg.maxFiles) {
		errors.push(`Maximum ${cfg.maxFiles} files allowed`);
	}

	// Validate each file
	for (const file of files) {
		const result = validateFile(file, config);
		errors.push(...result.errors);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Create preview URL for a file
 */
export async function createPreviewUrl(file: File): Promise<string> {
	const type = detectMediaType(file.type);

	if (type === 'image') {
		return URL.createObjectURL(file);
	}

	if (type === 'video') {
		return URL.createObjectURL(file);
	}

	if (type === 'audio') {
		return ''; // No preview for audio
	}

	return '';
}

/**
 * Generate thumbnail for image
 */
export async function generateThumbnail(
	file: File,
	maxSize: number = 200
): Promise<string | null> {
	if (!file.type.startsWith('image/')) {
		return null;
	}

	return new Promise((resolve) => {
		const img = new Image();
		const reader = new FileReader();

		reader.onload = (e) => {
			img.src = e.target?.result as string;
		};

		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				resolve(null);
				return;
			}

			// Calculate dimensions
			let width = img.width;
			let height = img.height;

			if (width > height) {
				if (width > maxSize) {
					height = (height * maxSize) / width;
					width = maxSize;
				}
			} else {
				if (height > maxSize) {
					width = (width * maxSize) / height;
					height = maxSize;
				}
			}

			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0, width, height);

			resolve(canvas.toDataURL('image/jpeg', 0.8));
		};

		img.onerror = () => resolve(null);
		reader.readAsDataURL(file);
	});
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
	if (!file.type.startsWith('image/')) {
		return null;
	}

	return new Promise((resolve) => {
		const img = new Image();
		const url = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve({ width: img.width, height: img.height });
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			resolve(null);
		};

		img.src = url;
	});
}

/**
 * Get video duration
 */
export async function getVideoDuration(file: File): Promise<number | null> {
	if (!file.type.startsWith('video/')) {
		return null;
	}

	return new Promise((resolve) => {
		const video = document.createElement('video');
		const url = URL.createObjectURL(file);

		video.onloadedmetadata = () => {
			URL.revokeObjectURL(url);
			resolve(video.duration);
		};

		video.onerror = () => {
			URL.revokeObjectURL(url);
			resolve(null);
		};

		video.src = url;
	});
}

/**
 * Process file and create MediaFile object
 */
export async function processFile(
	file: File,
	config: MediaUploadConfig = {}
): Promise<MediaFile> {
	const cfg = { ...DEFAULT_CONFIG, ...config };
	const type = detectMediaType(file.type);
	const mediaCategory = mapMimeTypeToMediaCategory(file.type);

	// Validate
	const validation = validateFile(file, config);
	if (!validation.valid) {
		return {
			id: crypto.randomUUID(),
			file,
			type,
			mediaCategory,
			progress: 0,
			status: 'error',
			error: validation.errors.join(', '),
			sensitive: false,
			spoilerText: '',
			metadata: { size: file.size },
		};
	}

	// Create preview
	const previewUrl = await createPreviewUrl(file);

	// Generate thumbnail if image
	let thumbnailUrl: string | undefined;
	if (cfg.generateThumbnails && type === 'image') {
		const thumb = await generateThumbnail(file, cfg.thumbnailSize);
		thumbnailUrl = thumb || undefined;
	}

	// Get metadata
	let metadata: MediaFile['metadata'] = { size: file.size };
	if (type === 'image') {
		const dimensions = await getImageDimensions(file);
		if (dimensions) {
			metadata = { ...metadata, ...dimensions };
		}
	} else if (type === 'video') {
		const duration = await getVideoDuration(file);
		if (duration) {
			metadata = { ...metadata, duration };
		}
	}

	return {
		id: crypto.randomUUID(),
		file,
		type,
		mediaCategory,
		previewUrl,
		thumbnailUrl,
		progress: 0,
		status: 'pending',
		sensitive: false,
		spoilerText: '',
		metadata,
	};
}

/**
 * Process multiple files
 */
export async function processFiles(
	files: File[],
	config: MediaUploadConfig = {}
): Promise<MediaFile[]> {
	const cfg = { ...DEFAULT_CONFIG, ...config };

	// Validate all files first
	const validation = validateFiles(files, config);
	if (!validation.valid) {
		// Return error for all files
		return files.map((file) => ({
			id: crypto.randomUUID(),
			file,
			type: detectMediaType(file.type),
			mediaCategory: mapMimeTypeToMediaCategory(file.type),
			progress: 0,
			status: 'error' as const,
			error: validation.errors[0],
			sensitive: false,
			spoilerText: '',
			metadata: { size: file.size },
		}));
	}

	// Take only maxFiles
	const filesToProcess = files.slice(0, cfg.maxFiles);

	// Process all files in parallel
	return Promise.all(filesToProcess.map((file) => processFile(file, config)));
}

/**
 * Clean up object URLs to prevent memory leaks
 */
export function cleanupMediaFile(mediaFile: MediaFile): void {
	if (mediaFile.previewUrl && mediaFile.previewUrl.startsWith('blob:')) {
		URL.revokeObjectURL(mediaFile.previewUrl);
	}
}

/**
 * Clean up multiple media files
 */
export function cleanupMediaFiles(mediaFiles: MediaFile[]): void {
	mediaFiles.forEach(cleanupMediaFile);
}
