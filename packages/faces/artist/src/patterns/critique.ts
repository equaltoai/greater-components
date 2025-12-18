/**
 * Critique Pattern
 *
 * Factory for artwork critique interfaces.
 *
 * @module @equaltoai/greater-components-artist/patterns/critique
 */

import type { CritiqueAnnotation } from '../types/index.js';
import type {
	CritiquePatternConfig,
	CritiquePatternHandlers,
	CritiqueMode,
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
// Critique Pattern State
// ============================================================================

/**
 * Annotation tool type
 */
export type AnnotationTool = 'point' | 'area' | 'line' | 'text' | 'select';

/**
 * Critique pattern state
 */
export interface CritiquePatternState {
	/** Pattern instance ID */
	id: string;
	/** Current mode */
	mode: CritiqueMode;
	/** Annotations */
	annotations: CritiqueAnnotation[];
	/** Selected annotation ID */
	selectedAnnotationId: string | null;
	/** Active annotation tool */
	activeTool: AnnotationTool;
	/** Zoom level */
	zoomLevel: number;
	/** Pan position */
	panPosition: { x: number; y: number };
	/** Summary text */
	summary: string;
	/** Loading state for submit */
	submitState: LoadingStateData<string>;
	/** Whether in drawing mode */
	isDrawing: boolean;
	/** Current drawing points */
	drawingPoints: { x: number; y: number }[];
}

// ============================================================================
// Default Critique Questions
// ============================================================================

/**
 * Default guided questions for critiques
 */
export const DEFAULT_CRITIQUE_QUESTIONS = [
	'What is your first impression of this artwork?',
	'How effective is the composition?',
	'What works well in terms of color and value?',
	'Are there any technical aspects that could be improved?',
	'What emotions or ideas does this piece evoke?',
	'What would you suggest the artist focus on for improvement?',
];

// ============================================================================
// Critique Pattern Factory
// ============================================================================

/**
 * Create critique pattern instance
 *
 * @example
 * ```typescript
 * const critique = createCritiquePattern({
 *   artwork: artworkData,
 *   mode: 'provide',
 *   questions: ['What works well?', 'What could be improved?'],
 *   anonymous: false,
 * }, {
 *   onSubmit: async (annotations, summary) => { ... },
 *   onAnnotationAdd: (annotation) => { ... },
 * });
 * ```
 */
export function createCritiquePattern(
	config: CritiquePatternConfig,
	handlers: Partial<CritiquePatternHandlers> = {}
): PatternFactoryResult<CritiquePatternConfig, CritiquePatternHandlers> {
	const id = createPatternId('critique');

	// Initialize state
	const state: CritiquePatternState = {
		id,
		mode: config.mode,
		annotations: [],
		selectedAnnotationId: null,
		activeTool: 'point',
		zoomLevel: 1,
		panPosition: { x: 0, y: 0 },
		summary: '',
		submitState: createLoadingState<string>(),
		isDrawing: false,
		drawingPoints: [],
	};

	// Generate annotation ID
	const generateAnnotationId = (): string => {
		return `annotation-${globalThis.crypto.randomUUID()}`;
	};

	// Add annotation
	const addAnnotation = (
		annotation: Omit<CritiqueAnnotation, 'id' | 'createdAt'>
	): CritiqueAnnotation => {
		const newAnnotation: CritiqueAnnotation = {
			...annotation,
			id: generateAnnotationId(),
			createdAt: new Date().toISOString(),
		};

		state.annotations.push(newAnnotation);
		handlers.onAnnotationAdd?.(annotation);

		return newAnnotation;
	};

	// Remove annotation
	const removeAnnotation = (annotationId: string) => {
		const index = state.annotations.findIndex((a) => a.id === annotationId);
		if (index !== -1) {
			state.annotations.splice(index, 1);
			if (state.selectedAnnotationId === annotationId) {
				state.selectedAnnotationId = null;
			}
		}
	};

	// Update annotation
	const updateAnnotation = (annotationId: string, updates: Partial<CritiqueAnnotation>) => {
		const annotation = state.annotations.find((a) => a.id === annotationId);
		if (annotation) {
			Object.assign(annotation, updates);
		}
	};

	// Select annotation
	const selectAnnotation = (annotationId: string | null) => {
		state.selectedAnnotationId = annotationId;
	};

	// Set active tool
	const setTool = (tool: AnnotationTool) => {
		state.activeTool = tool;
		state.isDrawing = false;
		state.drawingPoints = [];
	};

	// Zoom controls
	const zoomIn = () => {
		state.zoomLevel = Math.min(state.zoomLevel * 1.25, 5);
	};

	const zoomOut = () => {
		state.zoomLevel = Math.max(state.zoomLevel / 1.25, 0.5);
	};

	const resetZoom = () => {
		state.zoomLevel = 1;
		state.panPosition = { x: 0, y: 0 };
	};

	// Pan controls
	const pan = (deltaX: number, deltaY: number) => {
		state.panPosition.x += deltaX;
		state.panPosition.y += deltaY;
	};

	// Drawing mode
	const startDrawing = (point: { x: number; y: number }) => {
		if (state.activeTool === 'line') {
			state.isDrawing = true;
			state.drawingPoints = [point];
		}
	};

	const continueDrawing = (point: { x: number; y: number }) => {
		if (state.isDrawing) {
			state.drawingPoints.push(point);
		}
	};

	const finishDrawing = (authorId: string, authorName: string) => {
		const startPoint = state.drawingPoints[0];
		if (state.isDrawing && startPoint && state.drawingPoints.length > 1) {
			addAnnotation({
				type: 'line',
				position: startPoint,
				points: state.drawingPoints,
				content: '',
				authorId,
				authorName,
			});
		}
		state.isDrawing = false;
		state.drawingPoints = [];
	};

	// Update summary
	const updateSummary = (text: string) => {
		state.summary = text;
	};

	// Submit critique
	const submit = async () => {
		if (state.annotations.length === 0 && !state.summary) {
			throw new Error('Please add at least one annotation or summary.');
		}

		state.submitState = setLoading(state.submitState);

		try {
			await handlers.onSubmit?.(state.annotations, state.summary);
			state.submitState = setSuccess(state.submitState, 'submitted');
		} catch (error) {
			state.submitState = setError(state.submitState, error as Error);
			throw error;
		}
	};

	// Request critique
	const requestCritique = async (recipientIds: string[], message?: string) => {
		state.submitState = setLoading(state.submitState);

		try {
			await handlers.onRequestSend?.(recipientIds, message);
			state.submitState = setSuccess(state.submitState, 'requested');
		} catch (error) {
			state.submitState = setError(state.submitState, error as Error);
			throw error;
		}
	};

	// Get questions
	const getQuestions = (): string[] => {
		return config.questions || DEFAULT_CRITIQUE_QUESTIONS;
	};

	// Get annotation by category
	const getAnnotationsByCategory = (category: string): CritiqueAnnotation[] => {
		return state.annotations.filter((a) => a.category === category);
	};

	// Get annotation count
	const getAnnotationCount = (): number => {
		return state.annotations.length;
	};

	// Clear all annotations
	const clearAnnotations = () => {
		state.annotations = [];
		state.selectedAnnotationId = null;
	};

	// Cleanup function
	const destroy = () => {
		// No cleanup needed
	};

	// Compose handlers
	const composedHandlers: CritiquePatternHandlers = {
		onSubmit: submit,
		onAnnotationAdd: (annotation) => {
			handlers.onAnnotationAdd?.(annotation);
		},
		onRequestSend: requestCritique,
	};

	return {
		config,
		handlers: composedHandlers,
		get state() {
			return {
				...state,
				addAnnotation,
				removeAnnotation,
				updateAnnotation,
				selectAnnotation,
				setTool,
				zoomIn,
				zoomOut,
				resetZoom,
				pan,
				startDrawing,
				continueDrawing,
				finishDrawing,
				updateSummary,
				submit,
				requestCritique,
				getQuestions,
				getAnnotationsByCategory,
				getAnnotationCount,
				clearAnnotations,
			};
		},
		destroy,
	};
}

// ============================================================================
// Critique Pattern Helpers
// ============================================================================

/**
 * Get critique mode display name
 */
export function getCritiqueModeDisplayName(mode: CritiqueMode): string {
	const names: Record<CritiqueMode, string> = {
		request: 'Request Critique',
		provide: 'Provide Feedback',
		view: 'View Feedback',
	};

	return names[mode];
}

/**
 * Get annotation category options
 */
export function getAnnotationCategories(): { id: string; label: string }[] {
	return [
		{ id: 'composition', label: 'Composition' },
		{ id: 'color', label: 'Color & Value' },
		{ id: 'technique', label: 'Technique' },
		{ id: 'concept', label: 'Concept' },
		{ id: 'detail', label: 'Detail' },
		{ id: 'general', label: 'General' },
	];
}

/**
 * Get sentiment options
 */
export function getSentimentOptions(): { id: string; label: string; icon: string }[] {
	return [
		{ id: 'positive', label: 'Positive', icon: '👍' },
		{ id: 'constructive', label: 'Constructive', icon: '💡' },
		{ id: 'question', label: 'Question', icon: '❓' },
	];
}
