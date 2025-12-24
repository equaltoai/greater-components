/**
 * Upload Pattern
 *
 * Factory for artwork upload interfaces.
 *
 * @module @equaltoai/greater-components-artist/patterns/upload
 */

import type { ArtworkData } from '../types/index.js';
import type {
	UploadPatternConfig,
	UploadPatternHandlers,
	UploadProgress,
	PatternFactoryResult,
} from './types.js';
import {
	createPatternId,
	createLoadingState,
	setLoading,
	setSuccess,
	setError,
	type LoadingStateData,
} from './utils.js';

// ============================================================================
// Upload Pattern State
// ============================================================================

/**
 * Upload step
 */
export type UploadStep = 'select' | 'metadata' | 'ai-disclosure' | 'uploading' | 'complete';

/**
 * File metadata
 */
export interface FileMetadata {
	title: string;
	description?: string;
	medium: string;
	year: number;
	tags?: string[];
	dimensions?: {
		width: number;
		height: number;
		unit: 'cm' | 'in' | 'mm' | 'px';
	};
}

/**
 * AI disclosure data
 */
export interface AIDisclosure {
	aiUsed: boolean;
	tools?: string[];
	percentage?: number;
	description?: string;
	optedOutOfTraining: boolean;
}

/**
 * Upload pattern state
 */
export interface UploadPatternState {
	/** Pattern instance ID */
	id: string;
	/** Current step */
	currentStep: UploadStep;
	/** Selected files */
	files: File[];
	/** File metadata */
	metadata: Map<string, FileMetadata>;
	/** AI disclosure */
	aiDisclosure: AIDisclosure;
	/** Upload progress */
	progress: UploadProgress[];
	/** Completed artworks */
	completedArtworks: ArtworkData[];
	/** Loading state */
	uploadState: LoadingStateData<ArtworkData[]>;
	/** Drag state */
	dragState: {
		isDragging: boolean;
		isOver: boolean;
	};
	/** Validation errors */
	validationErrors: Map<string, string[]>;
}

// ============================================================================
// Upload Pattern Factory
// ============================================================================

/**
 * Create upload pattern instance
 *
 * @example
 * ```typescript
 * const upload = createUploadPattern({
 *   maxFiles: 10,
 *   acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
 *   onUpload: async (files) => uploadFiles(files),
 *   requireMetadata: true,
 *   requireAIDisclosure: true,
 * }, {
 *   onFilesSelect: (files) => console.log('Selected:', files),
 *   onComplete: (artworks) => console.log('Uploaded:', artworks),
 * });
 * ```
 */
export function createUploadPattern(
	config: UploadPatternConfig,
	handlers: Partial<UploadPatternHandlers> = {}
): PatternFactoryResult<UploadPatternConfig, UploadPatternHandlers> {
	const id = createPatternId('upload');

	// Initialize state
	const state: UploadPatternState = {
		id,
		currentStep: 'select',
		files: [],
		metadata: new Map(),
		aiDisclosure: {
			aiUsed: false,
			optedOutOfTraining: true,
		},
		progress: [],
		completedArtworks: [],
		uploadState: createLoadingState<ArtworkData[]>(),
		dragState: {
			isDragging: false,
			isOver: false,
		},
		validationErrors: new Map(),
	};

	// Validate file
	const validateFile = (file: File): string[] => {
		const errors: string[] = [];

		// Check type
		if (!config.acceptedTypes.includes(file.type)) {
			errors.push(`File type ${file.type} is not accepted`);
		}

		// Check size (max 50MB)
		const maxSize = 50 * 1024 * 1024;
		if (file.size > maxSize) {
			errors.push('File size exceeds 50MB limit');
		}

		return errors;
	};

	// Add files
	const addFiles = (newFiles: File[]) => {
		const validFiles: File[] = [];

		for (const file of newFiles) {
			// Check max files
			if (state.files.length + validFiles.length >= config.maxFiles) {
				break;
			}

			// Validate file
			const errors = validateFile(file);
			if (errors.length > 0) {
				state.validationErrors.set(file.name, errors);
			} else {
				validFiles.push(file);

				// Initialize metadata
				state.metadata.set(file.name, {
					title: file.name.replace(/\.[^/.]+$/, ''),
					medium: 'Digital',
					year: new Date().getFullYear(),
				});
			}
		}

		state.files.push(...validFiles);
		handlers.onFilesSelect?.(state.files);
	};

	// Remove file
	const removeFile = (index: number) => {
		const file = state.files[index];
		if (file) {
			state.files.splice(index, 1);
			state.metadata.delete(file.name);
			state.validationErrors.delete(file.name);
		}
	};

	// Clear all files
	const clearFiles = () => {
		state.files = [];
		state.metadata.clear();
		state.validationErrors.clear();
		state.progress = [];
		state.completedArtworks = [];
		state.currentStep = 'select';
	};

	// Update metadata for file
	const updateMetadata = (fileName: string, metadata: Partial<FileMetadata>) => {
		const existing = state.metadata.get(fileName);
		if (existing) {
			state.metadata.set(fileName, { ...existing, ...metadata });
		}
	};

	// Update AI disclosure
	const updateAIDisclosure = (disclosure: Partial<AIDisclosure>) => {
		state.aiDisclosure = { ...state.aiDisclosure, ...disclosure };
	};

	// Validate metadata
	const validateMetadata = (): boolean => {
		let isValid = true;

		for (const file of state.files) {
			const metadata = state.metadata.get(file.name);
			const errors: string[] = [];

			if (!metadata?.title?.trim()) {
				errors.push('Title is required');
			}

			if (!metadata?.medium?.trim()) {
				errors.push('Medium is required');
			}

			if (!metadata?.year || metadata.year < 1900 || metadata.year > new Date().getFullYear() + 1) {
				errors.push('Valid year is required');
			}

			if (errors.length > 0) {
				state.validationErrors.set(file.name, errors);
				isValid = false;
			} else {
				state.validationErrors.delete(file.name);
			}
		}

		return isValid;
	};

	// Go to next step
	const nextStep = () => {
		switch (state.currentStep) {
			case 'select':
				if (state.files.length === 0) {
					return false;
				}
				if (config.requireMetadata) {
					state.currentStep = 'metadata';
				} else if (config.requireAIDisclosure) {
					state.currentStep = 'ai-disclosure';
				} else {
					state.currentStep = 'uploading';
					startUpload();
				}
				break;
			case 'metadata':
				if (!validateMetadata()) {
					return false;
				}
				handlers.onMetadataSubmit?.(Object.fromEntries(state.metadata));
				if (config.requireAIDisclosure) {
					state.currentStep = 'ai-disclosure';
				} else {
					state.currentStep = 'uploading';
					startUpload();
				}
				break;
			case 'ai-disclosure':
				handlers.onAIDisclosureSubmit?.(state.aiDisclosure);
				state.currentStep = 'uploading';
				startUpload();
				break;
		}
		return true;
	};

	// Go to previous step
	const prevStep = () => {
		switch (state.currentStep) {
			case 'metadata':
				state.currentStep = 'select';
				break;
			case 'ai-disclosure':
				state.currentStep = config.requireMetadata ? 'metadata' : 'select';
				break;
		}
	};

	// Start upload
	const startUpload = async () => {
		state.uploadState = setLoading(state.uploadState);

		// Initialize progress
		state.progress = state.files.map((file) => ({
			file,
			progress: 0,
			status: 'pending' as const,
		}));

		try {
			// Upload files
			const artworks = await config.onUpload(state.files);

			// Update progress to complete
			state.progress = state.progress.map((p, i) => ({
				...p,
				progress: 100,
				status: 'complete' as const,
				artwork: artworks[i],
			}));

			state.completedArtworks = artworks;
			state.currentStep = 'complete';
			state.uploadState = setSuccess(state.uploadState, artworks);

			handlers.onComplete?.(artworks);
		} catch (error) {
			state.uploadState = setError(state.uploadState, error as Error);

			// Mark all as error
			state.progress = state.progress.map((p) => ({
				...p,
				status: 'error' as const,
				error: (error as Error).message,
			}));
		}
	};

	// Cancel upload
	const cancelUpload = (fileIndex: number) => {
		handlers.onCancel?.(fileIndex);
	};

	// Drag handlers
	const handleDragEnter = () => {
		state.dragState.isDragging = true;
		state.dragState.isOver = true;
	};

	const handleDragLeave = () => {
		state.dragState.isOver = false;
	};

	const handleDragEnd = () => {
		state.dragState.isDragging = false;
		state.dragState.isOver = false;
	};

	const handleDrop = (files: FileList | File[]) => {
		handleDragEnd();
		addFiles(Array.from(files));
	};

	// Get total progress
	const getTotalProgress = (): number => {
		if (state.progress.length === 0) return 0;

		const total = state.progress.reduce((sum, p) => sum + p.progress, 0);
		return Math.round(total / state.progress.length);
	};

	// Get step number
	const getStepNumber = (): number => {
		const steps: UploadStep[] = ['select'];
		if (config.requireMetadata) steps.push('metadata');
		if (config.requireAIDisclosure) steps.push('ai-disclosure');
		steps.push('uploading', 'complete');

		return steps.indexOf(state.currentStep) + 1;
	};

	// Get total steps
	const getTotalSteps = (): number => {
		let count = 3; // select, uploading, complete
		if (config.requireMetadata) count++;
		if (config.requireAIDisclosure) count++;
		return count;
	};

	// Check if can proceed
	const canProceed = (): boolean => {
		switch (state.currentStep) {
			case 'select':
				return state.files.length > 0;
			case 'metadata':
				return validateMetadata();
			case 'ai-disclosure':
				return true;
			default:
				return false;
		}
	};

	// Cleanup function
	const destroy = () => {
		// No cleanup needed
	};

	// Compose handlers
	const composedHandlers: UploadPatternHandlers = {
		onFilesSelect: (files) => handlers.onFilesSelect?.(files),
		onProgress: (progress) => handlers.onProgress?.(progress),
		onMetadataSubmit: (metadata) => handlers.onMetadataSubmit?.(metadata),
		onAIDisclosureSubmit: (disclosure) => handlers.onAIDisclosureSubmit?.(disclosure),
		onCancel: cancelUpload,
		onComplete: (artworks) => handlers.onComplete?.(artworks),
	};

	return {
		config,
		handlers: composedHandlers,
		get state() {
			return {
				...state,
				addFiles,
				removeFile,
				clearFiles,
				updateMetadata,
				updateAIDisclosure,
				nextStep,
				prevStep,
				startUpload,
				cancelUpload,
				handleDragEnter,
				handleDragLeave,
				handleDragEnd,
				handleDrop,
				getTotalProgress,
				getStepNumber,
				getTotalSteps,
				canProceed,
			};
		},
		destroy,
	};
}

// ============================================================================
// Upload Pattern Helpers
// ============================================================================

/**
 * Get step display name
 */
export function getUploadStepDisplayName(step: UploadStep): string {
	const names: Record<UploadStep, string> = {
		select: 'Select Files',
		metadata: 'Add Details',
		'ai-disclosure': 'AI Disclosure',
		uploading: 'Uploading',
		complete: 'Complete',
	};

	return names[step];
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get accepted types display
 */
export function getAcceptedTypesDisplay(types: string[]): string {
	const extensions = types.map((type) => {
		const ext = type.split('/')[1];
		return ext?.toUpperCase() || type;
	});

	return extensions.join(', ');
}

/**
 * Common AI tools for disclosure
 */
export const COMMON_AI_TOOLS = [
	'Midjourney',
	'DALL-E',
	'Stable Diffusion',
	'Adobe Firefly',
	'Photoshop AI',
	'Procreate AI',
	'Other',
];
