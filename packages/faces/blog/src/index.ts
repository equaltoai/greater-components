/**
 * @fileoverview Greater Blog Face - UI components for Medium/WordPress-style publishing
 *
 * This package provides components specifically designed for building blog platforms,
 * publication sites, and long-form content applications. All components feature
 * accessibility support, SEO optimization, and TypeScript integration.
 *
 * @version 1.0.0
 * @author Greater Contributors
 * @license AGPL-3.0-only
 * @public
 */

// ============================================================================
// Compound Components
// ============================================================================

/**
 * Article compound component for long-form content display
 */
export * from './components/Article/index.js';
export { Article } from './components/Article/index.js';

/**
 * Author compound component for author profiles and bios
 */
export * from './components/Author/index.js';
export { Author } from './components/Author/index.js';

/**
 * Publication compound component for publication branding
 */
export * from './components/Publication/index.js';
export { Publication } from './components/Publication/index.js';

/**
 * Navigation compound component for archives and browsing
 */
export * from './components/Navigation/index.js';
export { Navigation } from './components/Navigation/index.js';

/**
 * Editor compound component for content creation
 */
export * from './components/Editor/index.js';
export { Editor } from './components/Editor/index.js';

// ============================================================================
// Patterns
// ============================================================================

export * from './patterns/index.js';

// ============================================================================
// Types
// ============================================================================

export type {
	// Article types
	ArticleData,
	ArticleMetadata,
	ArticleConfig,
	ArticleHandlers,
	// Author types
	AuthorData,
	AuthorSocialLinks,
	// Publication types
	PublicationData,
	PublicationConfig,
	// Editor types
	DraftData,
	RevisionData,
	EditorConfig,
	// Navigation types
	ArchiveEntry,
	TagData,
	CategoryData,
} from './types.js';
