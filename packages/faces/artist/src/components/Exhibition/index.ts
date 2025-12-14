/**
 * Exhibition Components
 *
 * Compound components for curated exhibitions and collections.
 * Implements REQ-FR-005: Community Curation Features
 *
 * @module @equaltoai/greater-components-artist/components/Exhibition
 */

// Import subcomponents
import Root from './Root.svelte';
import Banner from './Banner.svelte';
import Statement from './Statement.svelte';
import Artists from './Artists.svelte';
import Gallery from './Gallery.svelte';
import Navigation from './Navigation.svelte';

// Export compound component
export const Exhibition = {
	Root,
	Banner,
	Statement,
	Artists,
	Gallery,
	Navigation,
};

// Export individual components for direct import
export { default as ExhibitionRoot } from './Root.svelte';
export { default as ExhibitionBanner } from './Banner.svelte';
export { default as ExhibitionStatement } from './Statement.svelte';
export { default as ExhibitionArtists } from './Artists.svelte';
export { default as ExhibitionGallery } from './Gallery.svelte';
export { default as ExhibitionNavigation } from './Navigation.svelte';

// Context exports
export {
	EXHIBITION_CONTEXT_KEY,
	DEFAULT_EXHIBITION_CONFIG,
	createExhibitionContext,
	getExhibitionContext,
	hasExhibitionContext,
	navigateNext,
	navigatePrevious,
	navigateTo,
	formatExhibitionDates,
	type ExhibitionLayout,
	type ExhibitionNavigationState,
	type ExhibitionContext,
} from './context.js';
