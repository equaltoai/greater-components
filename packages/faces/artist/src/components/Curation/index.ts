/**
 * Curation Components
 *
 * Standalone components for community curation features.
 * Implements REQ-FR-005: Community Curation Features
 *
 * @module @equaltoai/greater-components-artist/components/Curation
 */

// Export components
export { default as CuratorSpotlight } from './CuratorSpotlight.svelte';
export { default as CollectionCard } from './CollectionCard.svelte';

// Re-export types for convenience
export type {
	CuratorData,
	ExhibitionData,
	ExhibitionStatus,
	ExhibitionConfig,
	ExhibitionHandlers,
	CollectionData,
	CollectionVisibility,
	CollectionConfig,
} from '../../types/curation.js';
