/**
 * Status Compound Component
 *
 * A flexible, composable status card component for displaying ActivityPub/Fediverse posts.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Status } from '@equaltoai/greater-components-fediverse';
 *
 *   const post = {
 *     id: '123',
 *     account: { ... },
 *     content: 'Hello Fediverse!',
 *     // ...
 *   };
 * </script>
 *
 * <Status.Root status={post}>
 *   <Status.Header />
 *   <Status.Content />
 *   <Status.Media />
 *   <Status.Actions />
 * </Status.Root>
 * ```
 *
 * @example Custom layout
 * ```svelte
 * <Status.Root
 *   status={post}
 *   config={{ density: 'compact', showActions: false }}
 * >
 *   <Status.Header />
 *   <Status.Content />
 *   <!-- Skip media if you want -->
 *   <MyCustomFooter />
 * </Status.Root>
 * ```
 *
 * @example With custom styling
 * ```svelte
 * <Status.Root status={post} config={{ class: 'my-custom-status' }}>
 *   <Status.Header>
 *     {#snippet avatar()}
 *       <CustomAvatar account={post.account} />
 *     {/snippet}
 *   </Status.Header>
 *   <Status.Content />
 *   <Status.Actions />
 * </Status.Root>
 * ```
 *
 * @module @equaltoai/greater-components-fediverse/Status
 */

import StatusRoot from './Root.svelte';
import StatusHeader from './Header.svelte';
import StatusContent from './Content.svelte';
import StatusMedia from './Media.svelte';
import StatusActions from './Actions.svelte';
import StatusLesserMetadata from './LesserMetadata.svelte';
import StatusCommunityNotes from './CommunityNotes.svelte';

export {
	StatusRoot as Root,
	StatusHeader as Header,
	StatusContent as Content,
	StatusMedia as Media,
	StatusActions as Actions,
	StatusLesserMetadata as LesserMetadata,
	StatusCommunityNotes as CommunityNotes,
};

// Export types
export type { StatusContext, StatusConfig, StatusActionHandlers } from './context.js';

/**
 * Status compound component
 *
 * Provides a flexible, composable API for building status cards.
 * Each sub-component can be customized or replaced entirely.
 */
export const Status = {
	/**
	 * Root container that provides context to child components
	 */
	Root: StatusRoot,

	/**
	 * Header showing account info, avatar, and timestamp
	 */
	Header: StatusHeader,

	/**
	 * Content renderer for post text with mentions and hashtags
	 */
	Content: StatusContent,

	/**
	 * Media attachments (images, videos, audio)
	 */
	Media: StatusMedia,

	/**
	 * Action buttons (reply, boost, favorite, share)
	 */
	Actions: StatusActions,

	/**
	 * Lesser-specific metadata (cost, trust, moderation, quotes)
	 */
	LesserMetadata: StatusLesserMetadata,

	/**
	 * Community notes from Lesser instances
	 */
	CommunityNotes: StatusCommunityNotes,
};

export default Status;
