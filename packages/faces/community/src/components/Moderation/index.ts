/**
 * Moderation Compound Component
 *
 * A flexible, composable moderation component for forum moderation tools.
 * Built using compound component pattern for maximum flexibility and customization.
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Moderation } from '@equaltoai/greater-components/faces/community';
 * </script>
 *
 * <Moderation.Root {handlers}>
 *   <Moderation.Panel />
 *   <Moderation.Queue />
 * </Moderation.Root>
 * ```
 *
 * @module @equaltoai/greater-components/faces/community/Moderation
 */

// Placeholder - components to be implemented
// export { default as Root } from './Root.svelte';
// export { default as Panel } from './Panel.svelte';
// export { default as Queue } from './Queue.svelte';
// export { default as Actions } from './Actions.svelte';
// export { default as BanDialog } from './BanDialog.svelte';
// export { default as RemoveDialog } from './RemoveDialog.svelte';
// export { default as SpamFilter } from './SpamFilter.svelte';
// export { default as Logs } from './Logs.svelte';

// Export context utilities (to be implemented)
// export { createModerationContext, getModerationContext } from './context.js';

// Export types
export type {
	ModerationActionType,
	ModerationQueueItem,
	ModerationHandlers,
	ModerationContext,
	ModerationLogEntry,
	BanData,
	SpamFilterRule,
} from '../../types.js';

/**
 * Moderation compound component
 */
export const Moderation = {
	// Root: {} as typeof import('./Root.svelte').default,
	// Panel: {} as typeof import('./Panel.svelte').default,
	// Queue: {} as typeof import('./Queue.svelte').default,
	// Actions: {} as typeof import('./Actions.svelte').default,
	// BanDialog: {} as typeof import('./BanDialog.svelte').default,
	// RemoveDialog: {} as typeof import('./RemoveDialog.svelte').default,
	// SpamFilter: {} as typeof import('./SpamFilter.svelte').default,
	// Logs: {} as typeof import('./Logs.svelte').default,
};
