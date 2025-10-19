/**
 * @fileoverview Advanced ActivityPub Patterns
 * 
 * Production-ready components for common ActivityPub use cases.
 * These components use the generic ActivityPub types and work across any platform.
 * 
 * @module patterns
 * @public
 */

// Thread viewing and conversation management
export { default as ThreadView } from './ThreadView.svelte';

// Content warning and sensitive content handling
export { default as ContentWarningHandler } from './ContentWarningHandler.svelte';

// Federation indicators and instance info
export { default as FederationIndicator } from './FederationIndicator.svelte';

// Post visibility selection
export { default as VisibilitySelector } from './VisibilitySelector.svelte';

// Moderation tools (block, mute, report)
export { default as ModerationTools } from './ModerationTools.svelte';

// Multi-instance account switching
export { default as InstancePicker } from './InstancePicker.svelte';

// Server-specific emoji picker
export { default as CustomEmojiPicker } from './CustomEmojiPicker.svelte';

// Poll creation and voting
export { default as PollComposer } from './PollComposer.svelte';

// Advanced media handling with alt text
export { default as MediaComposer } from './MediaComposer.svelte';

// Saved posts management
export { default as BookmarkManager } from './BookmarkManager.svelte';

/**
 * Note: Types are exported directly from their respective .svelte files.
 * Import them directly from the component:
 * 
 * @example
 * ```typescript
 * import type { ThreadViewConfig } from '@equaltoai/greater-components-fediverse/patterns/ThreadView.svelte';
 * ```
 */
