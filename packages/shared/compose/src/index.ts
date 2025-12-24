/**
 * Compose Compound Component
 *
 * A flexible, composable compose/post creation component for ActivityPub/Fediverse apps.
 * Built using compound component pattern with support for media, content warnings, and visibility settings.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Compose } from '@equaltoai/greater-components/faces/social';
 *
 *   async function handleSubmit(data) {
 *     await api.statuses.create(data);
 *   }
 * </script>
 *
 * <Compose.Root handlers={{ onSubmit: handleSubmit }}>
 *   <Compose.Editor autofocus />
 *   <Compose.CharacterCount />
 *   <Compose.VisibilitySelect />
 *   <Compose.Submit />
 * </Compose.Root>
 * ```
 *
 * @example With reply
 * ```svelte
 * <Compose.Root
 *   initialState={{ inReplyTo: status.id }}
 *   handlers={{ onSubmit: handleReply }}
 * >
 *   <Compose.Editor />
 *   <Compose.Submit text="Reply" />
 * </Compose.Root>
 * ```
 *
 * @module @equaltoai/greater-components/faces/social/Compose
 */

import ComposeRoot from './Root.svelte';
import ComposeEditor from './Editor.svelte';
import ComposeSubmit from './Submit.svelte';
import ComposeCharacterCount from './CharacterCount.svelte';
import ComposeVisibilitySelect from './VisibilitySelect.svelte';
import ComposeEditorWithAutocomplete from './EditorWithAutocomplete.svelte';
import ComposeAutocompleteMenu from './AutocompleteMenu.svelte';
import ComposeDraftSaver from './DraftSaver.svelte';
import ComposeThreadComposer from './ThreadComposer.svelte';
import ComposeMediaUpload from './MediaUpload.svelte';
import ComposeImageEditor from './ImageEditor.svelte';
import ComposeThreadControls from './ThreadControls.svelte';

export {
	ComposeRoot as Root,
	ComposeEditor as Editor,
	ComposeSubmit as Submit,
	ComposeCharacterCount as CharacterCount,
	ComposeVisibilitySelect as VisibilitySelect,
	ComposeEditorWithAutocomplete as EditorWithAutocomplete,
	ComposeAutocompleteMenu as AutocompleteMenu,
	ComposeDraftSaver as DraftSaver,
	ComposeThreadComposer as ThreadComposer,
	ComposeMediaUpload as MediaUpload,
	ComposeImageEditor as ImageEditor,
	ComposeThreadControls as ThreadControls,
};

// Export types
export type {
	ComposeContext,
	ComposeConfig,
	ComposeHandlers,
	ComposeState,
	PostVisibility,
	ComposeAttachment,
} from './context.js';

// Export utility modules
export * as DraftManager from './DraftManager.js';
export * as Autocomplete from './Autocomplete.js';
export * as UnicodeCounter from './UnicodeCounter.js';
export * as MediaUploadHandler from './MediaUploadHandler.js';
export * as GraphQLAdapter from './GraphQLAdapter.js';

/**
 * Compose compound component
 *
 * Provides a flexible, composable API for building post composition UIs with:
 * - Character counting and limits (Unicode-aware)
 * - Visibility controls
 * - Content warnings
 * - Media attachments
 * - Reply support
 * - Hashtag/mention autocomplete
 * - Draft saving/loading
 * - Full type safety
 */
export const Compose = {
	/**
	 * Root container that provides context and handles submission
	 */
	Root: ComposeRoot,

	/**
	 * Basic text editor textarea
	 */
	Editor: ComposeEditor,

	/**
	 * Enhanced text editor with hashtag/mention/emoji autocomplete
	 */
	EditorWithAutocomplete: ComposeEditorWithAutocomplete,

	/**
	 * Autocomplete dropdown menu (used by EditorWithAutocomplete)
	 */
	AutocompleteMenu: ComposeAutocompleteMenu,

	/**
	 * Submit button with loading state
	 */
	Submit: ComposeSubmit,

	/**
	 * Character count display with Unicode support
	 */
	CharacterCount: ComposeCharacterCount,

	/**
	 * Visibility selector dropdown
	 */
	VisibilitySelect: ComposeVisibilitySelect,

	/**
	 * Auto-save drafts to localStorage
	 */
	DraftSaver: ComposeDraftSaver,

	/**
	 * Multi-post thread composer
	 */
	ThreadComposer: ComposeThreadComposer,

	/**
	 * Thread composition settings and controls
	 */
	ThreadControls: ComposeThreadControls,

	/**
	 * Media upload with drag & drop and progress tracking
	 */
	MediaUpload: ComposeMediaUpload,

	/**
	 * Image editor with focal point picker and alt text
	 */
	ImageEditor: ComposeImageEditor,
};

export default Compose;
