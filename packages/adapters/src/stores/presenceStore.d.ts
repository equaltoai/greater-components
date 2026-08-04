/**
 * Presence Store - Reactive state management for user presence and connection monitoring
 * Built for Svelte 5 runes compatibility with fallback support
 */
import type {
	PresenceStore,
	PresenceConfig,
	PresenceActivitySource,
	PresenceLocationSource,
	BrowserPresenceActivitySourceOptions,
	BrowserPresenceLocationSourceOptions,
} from './types';
export declare function createPresenceStore(config: PresenceConfig): PresenceStore;
export declare function createBrowserPresenceActivitySource(
	options?: BrowserPresenceActivitySourceOptions
): PresenceActivitySource;
export declare function createBrowserPresenceLocationSource(
	options?: BrowserPresenceLocationSourceOptions
): PresenceLocationSource;
//# sourceMappingURL=presenceStore.d.ts.map
