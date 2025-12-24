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

export { default as Root } from './Root.svelte';
export { default as Panel } from './Panel.svelte';
export { default as Queue } from './Queue.svelte';
export { default as Log } from './Log.svelte';

export {
	MODERATION_CONTEXT_KEY,
	createModerationContext,
	getModerationContext,
	hasModerationContext,
} from './context.js';

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
	Root: {} as typeof import('./Root.svelte').default,
	Panel: {} as typeof import('./Panel.svelte').default,
	Queue: {} as typeof import('./Queue.svelte').default,
	Log: {} as typeof import('./Log.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import Panel from './Panel.svelte';
import Queue from './Queue.svelte';
import Log from './Log.svelte';

Moderation.Root = Root;
Moderation.Panel = Panel;
Moderation.Queue = Queue;
Moderation.Log = Log;
