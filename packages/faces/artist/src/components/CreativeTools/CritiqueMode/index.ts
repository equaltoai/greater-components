/**
 * CritiqueMode Compound Component
 *
 * Components for structured artwork critique with annotations.
 * Implements REQ-FR-006: Creative Tools for Artistic Process
 *
 * @module @equaltoai/greater-components-artist/components/CreativeTools/CritiqueMode
 */

import Root from './Root.svelte';
import Image from './Image.svelte';
import Annotations from './Annotations.svelte';

export {
	CRITIQUE_CONTEXT_KEY,
	createCritiqueContext,
	getCritiqueContext,
	hasCritiqueContext,
	zoomIn,
	zoomOut,
	resetZoom,
	setTool,
	type CritiqueContext,
	type AnnotationTool,
	type ZoomState,
} from './context.js';

export const CritiqueMode = Object.assign(Root, {
	Root,
	Image,
	Annotations,
});

export default CritiqueMode;
