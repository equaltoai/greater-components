/**
 * MediaViewer Compound Component
 *
 * A full-screen lightbox viewer for artwork with zoom, pan, and navigation.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { MediaViewer } from '@equaltoai/greater-components/faces/artist';
 * </script>
 *
 * <MediaViewer.Root artworks={artworkList} currentIndex={0} handlers={{ onClose }}>
 *   <MediaViewer.Navigation />
 *   <MediaViewer.ZoomControls />
 *   <MediaViewer.MetadataPanel />
 * </MediaViewer.Root>
 * ```
 *
 * @module @equaltoai/greater-components/faces/artist/MediaViewer
 */

// Export individual components
export { default as Root } from './Root.svelte';
export { default as Navigation } from './Navigation.svelte';
export { default as ZoomControls } from './ZoomControls.svelte';
export { default as MetadataPanel } from './MetadataPanel.svelte';

// Export context utilities and types
export {
	MEDIA_VIEWER_CONTEXT_KEY,
	createMediaViewerContext,
	getMediaViewerContext,
	hasMediaViewerContext,
	DEFAULT_MEDIA_VIEWER_CONFIG,
} from './context.js';

export type { MediaViewerContext, MediaViewerConfig, MediaViewerHandlers } from './context.js';

// Import components for compound object
import RootComponent from './Root.svelte';
import NavigationComponent from './Navigation.svelte';
import ZoomControlsComponent from './ZoomControls.svelte';
import MetadataPanelComponent from './MetadataPanel.svelte';

/**
 * MediaViewer compound component
 */
export const MediaViewer = {
	Root: RootComponent,
	Navigation: NavigationComponent,
	ZoomControls: ZoomControlsComponent,
	MetadataPanel: MetadataPanelComponent,
};
