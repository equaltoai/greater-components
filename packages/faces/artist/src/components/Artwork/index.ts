/**
 * Artwork Compound Component
 *
 * A flexible, composable artwork component for displaying visual art.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Artwork } from '@equaltoai/greater-components/faces/artist';
 * </script>
 *
 * <Artwork.Root artwork={artworkData}>
 *   <Artwork.Image />
 *   <Artwork.Title />
 *   <Artwork.Attribution />
 *   <Artwork.Actions />
 * </Artwork.Root>
 * ```
 *
 * @module @equaltoai/greater-components/faces/artist/Artwork
 */

// Export individual components
export { default as Root } from './Root.svelte';
export { default as Image } from './Image.svelte';
export { default as Title } from './Title.svelte';
export { default as Attribution } from './Attribution.svelte';
export { default as Metadata } from './Metadata.svelte';
export { default as Stats } from './Stats.svelte';
export { default as Actions } from './Actions.svelte';
export { default as AIDisclosure } from './AIDisclosure.svelte';

// Export context utilities and types
export {
	ARTWORK_CONTEXT_KEY,
	createArtworkContext,
	getArtworkContext,
	hasArtworkContext,
	DEFAULT_ARTWORK_CONFIG,
} from './context.js';

export type { ArtworkContext, ArtworkConfig, ArtworkHandlers, ArtworkData } from './context.js';

// Import components for compound object
import RootComponent from './Root.svelte';
import ImageComponent from './Image.svelte';
import TitleComponent from './Title.svelte';
import AttributionComponent from './Attribution.svelte';
import MetadataComponent from './Metadata.svelte';
import StatsComponent from './Stats.svelte';
import ActionsComponent from './Actions.svelte';
import AIDisclosureComponent from './AIDisclosure.svelte';

/**
 * Artwork compound component
 *
 * @example
 * ```svelte
 * <Artwork.Root artwork={data}>
 *   <Artwork.Image />
 *   <Artwork.Title />
 *   <Artwork.Attribution />
 * </Artwork.Root>
 * ```
 */
export const Artwork = {
	Root: RootComponent,
	Image: ImageComponent,
	Title: TitleComponent,
	Attribution: AttributionComponent,
	Metadata: MetadataComponent,
	Stats: StatsComponent,
	Actions: ActionsComponent,
	AIDisclosure: AIDisclosureComponent,
};
