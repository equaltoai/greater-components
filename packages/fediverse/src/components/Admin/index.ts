/**
 * Admin Components
 * 
 * Complete admin dashboard for ActivityPub instance management.
 * Includes user management, reports, moderation, federation, settings, logs, and analytics.
 * 
 * @module Admin
 * 
 * @example
 * ```svelte
 * import * as Admin from '@equaltoai/greater-components-fediverse/Admin';
 * 
 * <Admin.Root {handlers}>
 *   <Admin.Overview />
 *   <Admin.Users />
 *   <Admin.Reports />
 *   <Admin.Moderation />
 *   <Admin.Federation />
 *   <Admin.Settings />
 *   <Admin.Logs />
 *   <Admin.Analytics />
 * </Admin.Root>
 * ```
 */

export { default as Root } from './Root.svelte';
export { default as Overview } from './Overview.svelte';
export { default as Users } from './Users.svelte';
export { default as Reports } from './Reports.svelte';
export { default as Moderation } from './Moderation.svelte';
export { default as Federation } from './Federation.svelte';
export { default as Settings } from './Settings.svelte';
export { default as Logs } from './Logs.svelte';
export { default as Analytics } from './Analytics.svelte';

export {
	createAdminContext,
	getAdminContext,
	formatNumber,
	type AdminStats,
	type AdminUser,
	type AdminReport,
	type FederatedInstance,
	type InstanceSettings,
	type LogEntry,
	type AnalyticsData,
	type AdminHandlers,
	type AdminState,
	type AdminContext,
} from './context.js';
