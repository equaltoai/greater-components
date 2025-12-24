/**
 * Flair Components
 *
 * Badges for post/user flairs.
 *
 * @module @equaltoai/greater-components/faces/community/Flair
 */

export { default as Badge } from './Badge.svelte';

export type { FlairData, FlairType, FlairHandlers } from '../../types.js';

export const Flair = {
	Badge: {} as typeof import('./Badge.svelte').default,
};

// Dynamic imports for tree-shaking
import Badge from './Badge.svelte';
Flair.Badge = Badge;
