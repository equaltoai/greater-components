/**
 * Portfolio Pattern
 *
 * Factory for artist portfolio layouts.
 *
 * @module @equaltoai/greater-components-artist/patterns/portfolio
 */

import type {
	PortfolioPatternConfig,
	PortfolioPatternHandlers,
	PortfolioSection,
	PatternFactoryResult,
} from './types.js';
import {
	createPatternId,
	createLoadingState,
	setLoading,
	setSuccess,
	setError,
	getCurrentBreakpoint,
	createBreakpointObserver,
	type LoadingStateData,
	type Breakpoint,
} from './utils.js';

// ============================================================================
// Portfolio Pattern State
// ============================================================================

/**
 * Portfolio pattern state
 */
export interface PortfolioPatternState {
	/** Pattern instance ID */
	id: string;
	/** Sections */
	sections: PortfolioSection[];
	/** Active section ID */
	activeSectionId: string | null;
	/** Professional mode enabled */
	professionalMode: boolean;
	/** Edit mode enabled */
	editMode: boolean;
	/** Current breakpoint */
	breakpoint: Breakpoint;
	/** Loading state for operations */
	operationState: LoadingStateData<string>;
	/** Drag state for reordering */
	dragState: {
		isDragging: boolean;
		draggedSectionId: string | null;
		dropTargetId: string | null;
	};
}

// ============================================================================
// Portfolio Pattern Factory
// ============================================================================

/**
 * Create portfolio pattern instance
 *
 * @example
 * ```typescript
 * const portfolio = createPortfolioPattern({
 *   artist: artistData,
 *   sections: portfolioSections,
 *   isOwner: true,
 *   professionalMode: false,
 * }, {
 *   onSectionAdd: async (section) => { ... },
 *   onExport: async (format) => { ... },
 * });
 * ```
 */
export function createPortfolioPattern(
	config: PortfolioPatternConfig,
	handlers: Partial<PortfolioPatternHandlers> = {}
): PatternFactoryResult<PortfolioPatternConfig, PortfolioPatternHandlers> {
	const id = createPatternId('portfolio');

	// Sort sections by order
	const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

	// Initialize state
	const state: PortfolioPatternState = {
		id,
		sections: sortedSections,
		activeSectionId: sortedSections[0]?.id || null,
		professionalMode: config.professionalMode || false,
		editMode: false,
		breakpoint: getCurrentBreakpoint(),
		operationState: createLoadingState<string>(),
		dragState: {
			isDragging: false,
			draggedSectionId: null,
			dropTargetId: null,
		},
	};

	// Set up breakpoint observer
	const cleanupBreakpoint = createBreakpointObserver((breakpoint) => {
		state.breakpoint = breakpoint;
	});

	// Toggle professional mode
	const toggleProfessionalMode = () => {
		state.professionalMode = !state.professionalMode;
	};

	// Toggle edit mode
	const toggleEditMode = () => {
		if (!config.isOwner) return;
		state.editMode = !state.editMode;
	};

	// Set active section
	const setActiveSection = (sectionId: string) => {
		state.activeSectionId = sectionId;
	};

	// Add section
	const addSection = async (section: Omit<PortfolioSection, 'id'>) => {
		state.operationState = setLoading(state.operationState);

		try {
			await handlers.onSectionAdd?.(section);

			const newSection: PortfolioSection = {
				...section,
				id: createPatternId('section'),
			};

			state.sections.push(newSection);
			state.operationState = setSuccess(state.operationState, 'added');
		} catch (error) {
			state.operationState = setError(state.operationState, error as Error);
			throw error;
		}
	};

	// Update section
	const updateSection = async (sectionId: string, updates: Partial<PortfolioSection>) => {
		state.operationState = setLoading(state.operationState);

		try {
			await handlers.onSectionUpdate?.(sectionId, updates);

			const section = state.sections.find((s) => s.id === sectionId);
			if (section) {
				Object.assign(section, updates);
			}

			state.operationState = setSuccess(state.operationState, 'updated');
		} catch (error) {
			state.operationState = setError(state.operationState, error as Error);
			throw error;
		}
	};

	// Remove section
	const removeSection = async (sectionId: string) => {
		state.operationState = setLoading(state.operationState);

		try {
			await handlers.onSectionRemove?.(sectionId);

			const index = state.sections.findIndex((s) => s.id === sectionId);
			if (index !== -1) {
				state.sections.splice(index, 1);
			}

			if (state.activeSectionId === sectionId) {
				state.activeSectionId = state.sections[0]?.id || null;
			}

			state.operationState = setSuccess(state.operationState, 'removed');
		} catch (error) {
			state.operationState = setError(state.operationState, error as Error);
			throw error;
		}
	};

	// Reorder sections
	const reorderSections = async (sectionIds: string[]) => {
		state.operationState = setLoading(state.operationState);

		try {
			await handlers.onSectionReorder?.(sectionIds);

			// Update order based on new array
			sectionIds.forEach((id, index) => {
				const section = state.sections.find((s) => s.id === id);
				if (section) {
					section.order = index;
				}
			});

			// Re-sort sections
			state.sections.sort((a, b) => a.order - b.order);

			state.operationState = setSuccess(state.operationState, 'reordered');
		} catch (error) {
			state.operationState = setError(state.operationState, error as Error);
			throw error;
		}
	};

	// Drag and drop handlers
	const startDrag = (sectionId: string) => {
		state.dragState.isDragging = true;
		state.dragState.draggedSectionId = sectionId;
	};

	const setDropTarget = (sectionId: string | null) => {
		state.dragState.dropTargetId = sectionId;
	};

	const endDrag = async () => {
		if (state.dragState.draggedSectionId && state.dragState.dropTargetId) {
			const draggedIndex = state.sections.findIndex(
				(s) => s.id === state.dragState.draggedSectionId
			);
			const dropIndex = state.sections.findIndex((s) => s.id === state.dragState.dropTargetId);

			if (draggedIndex !== -1 && dropIndex !== -1 && draggedIndex !== dropIndex) {
				const newOrder = [...state.sections.map((s) => s.id)];
				const [removed] = newOrder.splice(draggedIndex, 1);
				if (removed) {
					newOrder.splice(dropIndex, 0, removed);
					await reorderSections(newOrder);
				}
			}
		}

		state.dragState.isDragging = false;
		state.dragState.draggedSectionId = null;
		state.dragState.dropTargetId = null;
	};

	// Export portfolio
	const exportPortfolio = async (format: 'pdf' | 'html' | 'json') => {
		state.operationState = setLoading(state.operationState);

		try {
			await handlers.onExport?.(format);
			state.operationState = setSuccess(state.operationState, 'exported');
		} catch (error) {
			state.operationState = setError(state.operationState, error as Error);
			throw error;
		}
	};

	// Share portfolio
	const sharePortfolio = async (platform?: string) => {
		state.operationState = setLoading(state.operationState);

		try {
			await handlers.onShare?.(platform);
			state.operationState = setSuccess(state.operationState, 'shared');
		} catch (error) {
			state.operationState = setError(state.operationState, error as Error);
			throw error;
		}
	};

	// Get visible sections
	const getVisibleSections = (): PortfolioSection[] => {
		return state.sections.filter((s) => s.visible);
	};

	// Get section by ID
	const getSection = (sectionId: string): PortfolioSection | undefined => {
		return state.sections.find((s) => s.id === sectionId);
	};

	// Get total artwork count
	const getTotalArtworkCount = (): number => {
		return state.sections.reduce((count, section) => {
			return count + (section.artworks?.length || 0);
		}, 0);
	};

	// Generate print styles
	const getPrintStyles = (): string => {
		return `
			@media print {
				.portfolio-nav { display: none; }
				.portfolio-actions { display: none; }
				.portfolio-section { page-break-inside: avoid; }
				.portfolio-artwork { page-break-inside: avoid; }
			}
		`;
	};

	// Cleanup function
	const destroy = () => {
		cleanupBreakpoint();
	};

	// Compose handlers
	const composedHandlers: PortfolioPatternHandlers = {
		onSectionAdd: addSection,
		onSectionUpdate: updateSection,
		onSectionRemove: removeSection,
		onSectionReorder: reorderSections,
		onExport: exportPortfolio,
		onShare: sharePortfolio,
	};

	return {
		config,
		handlers: composedHandlers,
		get state() {
			return {
				...state,
				toggleProfessionalMode,
				toggleEditMode,
				setActiveSection,
				addSection,
				updateSection,
				removeSection,
				reorderSections,
				startDrag,
				setDropTarget,
				endDrag,
				exportPortfolio,
				sharePortfolio,
				getVisibleSections,
				getSection,
				getTotalArtworkCount,
				getPrintStyles,
			};
		},
		destroy,
	};
}

// ============================================================================
// Portfolio Pattern Helpers
// ============================================================================

/**
 * Get section type display name
 */
export function getSectionTypeDisplayName(type: PortfolioSection['type']): string {
	const names: Record<PortfolioSection['type'], string> = {
		gallery: 'Gallery',
		featured: 'Featured Works',
		series: 'Series',
		timeline: 'Timeline',
		about: 'About',
		contact: 'Contact',
	};

	return names[type];
}

/**
 * Get default section template
 */
export function getDefaultSectionTemplate(
	type: PortfolioSection['type']
): Omit<PortfolioSection, 'id' | 'order'> {
	const templates: Record<PortfolioSection['type'], Omit<PortfolioSection, 'id' | 'order'>> = {
		gallery: {
			title: 'Gallery',
			type: 'gallery',
			artworks: [],
			visible: true,
		},
		featured: {
			title: 'Featured Works',
			type: 'featured',
			artworks: [],
			description: 'A selection of my best work.',
			visible: true,
		},
		series: {
			title: 'New Series',
			type: 'series',
			artworks: [],
			description: 'Description of this series.',
			visible: true,
		},
		timeline: {
			title: 'Career Timeline',
			type: 'timeline',
			visible: true,
		},
		about: {
			title: 'About Me',
			type: 'about',
			description: 'Tell visitors about yourself and your artistic journey.',
			visible: true,
		},
		contact: {
			title: 'Contact',
			type: 'contact',
			description: 'Get in touch for commissions, collaborations, or inquiries.',
			visible: true,
		},
	};

	return templates[type];
}
