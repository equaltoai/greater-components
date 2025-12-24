import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import type { PrivacySettings } from './context.js';

/**
 * User preferences structure (mapped from GraphQL UserPreferences)
 */
export interface UserPreferences {
	actorId: string;
	posting: {
		defaultVisibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'DIRECT';
		defaultSensitive: boolean;
		defaultLanguage: string;
	};
	reading: {
		expandSpoilers: boolean;
		expandMedia: 'DEFAULT' | 'SHOW_ALL' | 'HIDE_ALL';
		autoplayGifs: boolean;
		timelineOrder: 'NEWEST' | 'OLDEST';
	};
	discovery: {
		showFollowCounts: boolean;
		searchSuggestionsEnabled: boolean;
		personalizedSearchEnabled: boolean;
	};
	streaming: {
		defaultQuality: 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
		autoQuality: boolean;
		preloadNext: boolean;
		dataSaver: boolean;
	};
	notifications: {
		email: boolean;
		push: boolean;
		inApp: boolean;
		digest: 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
	};
	privacy: {
		defaultVisibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'DIRECT';
		indexable: boolean;
		showOnlineStatus: boolean;
	};
	reblogFilters: Array<{ key: string; enabled: boolean }>;
}

/**
 * Preferences state managed by the controller
 */
export interface PreferencesState {
	preferences: UserPreferences | null;
	loading: boolean;
	saving: boolean;
	error: string | null;
	lastSaved: Date | null;
}

/**
 * Preferences change callback
 */
export type PreferencesChangeCallback = (state: PreferencesState) => void;

/**
 * GraphQL-backed preferences controller that manages user preferences and privacy settings.
 */
export class PreferencesGraphQLController {
	private readonly adapter: LesserGraphQLAdapter;
	private state: PreferencesState = {
		preferences: null,
		loading: false,
		saving: false,
		error: null,
		lastSaved: null,
	};
	private disposed = false;
	private changeListeners: Set<PreferencesChangeCallback> = new Set();

	constructor(adapter: LesserGraphQLAdapter) {
		this.adapter = adapter;
	}

	/**
	 * Get current preferences state
	 */
	getState(): PreferencesState {
		return { ...this.state };
	}

	/**
	 * Subscribe to preferences state changes
	 */
	subscribe(callback: PreferencesChangeCallback): () => void {
		this.changeListeners.add(callback);
		return () => {
			this.changeListeners.delete(callback);
		};
	}

	/**
	 * Load user preferences from the server
	 */
	async loadPreferences(): Promise<void> {
		if (this.disposed) {
			throw new Error('PreferencesController has been destroyed');
		}

		this.updateState({ loading: true, error: null });

		try {
			const preferences = await this.adapter.getUserPreferences();
			this.updateState({
				preferences: this.normalizePreferences(preferences),
				loading: false,
			});
		} catch (error) {
			this.updateState({
				error: error instanceof Error ? error.message : 'Failed to load preferences',
				loading: false,
			});
			throw error;
		}
	}

	/**
	 * Update user preferences on the server
	 */
	async updatePreferences(updates: Partial<UserPreferences>): Promise<void> {
		if (this.disposed) {
			throw new Error('PreferencesController has been destroyed');
		}

		this.updateState({ saving: true, error: null });

		try {
			const input = this.buildUpdateInput(updates);
			const updated = await this.adapter.updateUserPreferences(input);

			this.updateState({
				preferences: this.normalizePreferences(updated),
				saving: false,
				lastSaved: new Date(),
			});
		} catch (error) {
			this.updateState({
				error: error instanceof Error ? error.message : 'Failed to update preferences',
				saving: false,
			});
			throw error;
		}
	}

	/**
	 * Update streaming preferences specifically
	 */
	async updateStreamingPreferences(
		streaming: Partial<UserPreferences['streaming']>
	): Promise<void> {
		if (this.disposed) {
			throw new Error('PreferencesController has been destroyed');
		}

		this.updateState({ saving: true, error: null });

		try {
			const updated = await this.adapter.updateStreamingPreferences(streaming);

			// Merge streaming updates into existing preferences
			if (this.state.preferences) {
				this.updateState({
					preferences: {
						...this.state.preferences,
						streaming: this.normalizeStreamingPreferences(updated?.streaming),
					},
					saving: false,
					lastSaved: new Date(),
				});
			}
		} catch (error) {
			this.updateState({
				error: error instanceof Error ? error.message : 'Failed to update streaming preferences',
				saving: false,
			});
			throw error;
		}
	}

	/**
	 * Convert PrivacySettings (UI model) to UserPreferences partial update
	 */
	async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<void> {
		if (this.disposed) {
			throw new Error('PreferencesController has been destroyed');
		}

		const updates: Partial<UserPreferences> = {};

		// Map PrivacySettings to UserPreferences structure
		if (settings.autoplayGifs !== undefined || settings.autoplayVideos !== undefined) {
			updates.reading = {
				...this.state.preferences?.reading,
				expandSpoilers: this.state.preferences?.reading.expandSpoilers ?? false,
				expandMedia: this.state.preferences?.reading.expandMedia ?? 'DEFAULT',
				autoplayGifs: settings.autoplayGifs ?? this.state.preferences?.reading.autoplayGifs ?? true,
				timelineOrder: this.state.preferences?.reading.timelineOrder ?? 'NEWEST',
			};
		}

		if (
			settings.searchableBySearchEngines !== undefined ||
			settings.discoverable !== undefined ||
			settings.hideFollowers !== undefined
		) {
			const privacy = this.state.preferences?.privacy;
			updates.privacy = {
				defaultVisibility: privacy?.defaultVisibility ?? 'PUBLIC',
				indexable: settings.searchableBySearchEngines ?? privacy?.indexable ?? true,
				showOnlineStatus: privacy?.showOnlineStatus ?? false,
			};

			const discovery = this.state.preferences?.discovery;
			updates.discovery = {
				showFollowCounts:
					settings.hideFollowers !== undefined
						? !settings.hideFollowers
						: (discovery?.showFollowCounts ?? true),
				searchSuggestionsEnabled: discovery?.searchSuggestionsEnabled ?? true,
				personalizedSearchEnabled: discovery?.personalizedSearchEnabled ?? true,
			};
		}

		if (settings.isPrivate !== undefined || settings.requireFollowApproval !== undefined) {
			const privacy = this.state.preferences?.privacy;
			updates.privacy = {
				...(updates.privacy ?? privacy ?? {}),
				defaultVisibility: settings.isPrivate ? 'PRIVATE' : 'PUBLIC',
				indexable: privacy?.indexable ?? true,
				showOnlineStatus: privacy?.showOnlineStatus ?? false,
			};
		}

		await this.updatePreferences(updates);
	}

	/**
	 * Get PrivacySettings (UI model) from current preferences
	 */
	getPrivacySettings(): PrivacySettings | null {
		const prefs = this.state.preferences;
		if (!prefs) {
			return null;
		}

		return {
			isPrivate: prefs.privacy.defaultVisibility === 'PRIVATE',
			requireFollowApproval: prefs.privacy.defaultVisibility === 'PRIVATE',
			hideFollowers: !prefs.discovery.showFollowCounts,
			hideFollowing: !prefs.discovery.showFollowCounts,
			hideRelationships: false, // Not directly mapped in GraphQL preferences
			searchableBySearchEngines: prefs.privacy.indexable,
			discoverable: prefs.discovery.searchSuggestionsEnabled,
			showAdultContent: false, // Not in GraphQL preferences
			autoplayGifs: prefs.reading.autoplayGifs,
			autoplayVideos: false, // GraphQL has single autoplay, we default videos to false
		};
	}

	/**
	 * Destroy the controller and clean up resources
	 */
	destroy(): void {
		this.disposed = true;
		this.changeListeners.clear();
	}

	/**
	 * Update internal state and notify listeners
	 */
	private updateState(partial: Partial<PreferencesState>): void {
		this.state = { ...this.state, ...partial };
		this.notifyListeners();
	}

	/**
	 * Notify all change listeners
	 */
	private notifyListeners(): void {
		const state = this.getState();
		for (const listener of this.changeListeners) {
			try {
				listener(state);
			} catch (error) {
				console.error('Error in preferences change listener:', error);
			}
		}
	}

	/**
	 * Normalize preferences payload from GraphQL
	 */
	private normalizePreferences(data: unknown): UserPreferences | null {
		if (!data || typeof data !== 'object') {
			return null;
		}

		const record = data as Record<string, unknown>;

		// Extract nested objects
		const posting =
			typeof record['posting'] === 'object' ? (record['posting'] as Record<string, unknown>) : {};
		const reading =
			typeof record['reading'] === 'object' ? (record['reading'] as Record<string, unknown>) : {};
		const discovery =
			typeof record['discovery'] === 'object'
				? (record['discovery'] as Record<string, unknown>)
				: {};
		const streaming =
			typeof record['streaming'] === 'object'
				? (record['streaming'] as Record<string, unknown>)
				: {};
		const notifications =
			typeof record['notifications'] === 'object'
				? (record['notifications'] as Record<string, unknown>)
				: {};
		const privacy =
			typeof record['privacy'] === 'object' ? (record['privacy'] as Record<string, unknown>) : {};

		return {
			actorId: String(record['actorId'] ?? ''),
			posting: {
				defaultVisibility: String(
					posting['defaultVisibility'] ?? 'PUBLIC'
				) as UserPreferences['posting']['defaultVisibility'],
				defaultSensitive: Boolean(posting['defaultSensitive']),
				defaultLanguage: String(posting['defaultLanguage'] ?? 'en'),
			},
			reading: {
				expandSpoilers: Boolean(reading['expandSpoilers']),
				expandMedia: String(
					reading['expandMedia'] ?? 'DEFAULT'
				) as UserPreferences['reading']['expandMedia'],
				autoplayGifs: Boolean(reading['autoplayGifs']),
				timelineOrder: String(
					reading['timelineOrder'] ?? 'NEWEST'
				) as UserPreferences['reading']['timelineOrder'],
			},
			discovery: {
				showFollowCounts: Boolean(discovery['showFollowCounts'] ?? true),
				searchSuggestionsEnabled: Boolean(discovery['searchSuggestionsEnabled'] ?? true),
				personalizedSearchEnabled: Boolean(discovery['personalizedSearchEnabled'] ?? true),
			},
			streaming: this.normalizeStreamingPreferences(streaming),
			notifications: {
				email: Boolean(notifications['email']),
				push: Boolean(notifications['push'] ?? true),
				inApp: Boolean(notifications['inApp'] ?? true),
				digest: String(
					notifications['digest'] ?? 'NEVER'
				) as UserPreferences['notifications']['digest'],
			},
			privacy: {
				defaultVisibility: String(
					privacy['defaultVisibility'] ?? 'PUBLIC'
				) as UserPreferences['privacy']['defaultVisibility'],
				indexable: Boolean(privacy['indexable'] ?? true),
				showOnlineStatus: Boolean(privacy['showOnlineStatus']),
			},
			reblogFilters: Array.isArray(record['reblogFilters'])
				? (record['reblogFilters'] as Array<{ key: string; enabled: boolean }>)
				: [],
		};
	}

	/**
	 * Normalize streaming preferences
	 */
	private normalizeStreamingPreferences(data: unknown): UserPreferences['streaming'] {
		const streaming =
			typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
		return {
			defaultQuality: String(
				streaming['defaultQuality'] ?? 'AUTO'
			) as UserPreferences['streaming']['defaultQuality'],
			autoQuality: Boolean(streaming['autoQuality'] ?? true),
			preloadNext: Boolean(streaming['preloadNext']),
			dataSaver: Boolean(streaming['dataSaver']),
		};
	}

	/**
	 * Build update input from partial preferences
	 */
	private buildUpdateInput(updates: Partial<UserPreferences>): Record<string, unknown> {
		const input: Record<string, unknown> = {};

		if (updates.posting) {
			input['defaultPostingVisibility'] = updates.posting.defaultVisibility;
			input['defaultMediaSensitive'] = updates.posting.defaultSensitive;
			input['language'] = updates.posting.defaultLanguage;
		}

		if (updates.reading) {
			input['expandSpoilers'] = updates.reading.expandSpoilers;
			input['expandMedia'] = updates.reading.expandMedia;
			input['autoplayGifs'] = updates.reading.autoplayGifs;
			input['preferredTimelineOrder'] = updates.reading.timelineOrder;
		}

		if (updates.discovery) {
			input['showFollowCounts'] = updates.discovery.showFollowCounts;
			input['searchSuggestionsEnabled'] = updates.discovery.searchSuggestionsEnabled;
			input['personalizedSearchEnabled'] = updates.discovery.personalizedSearchEnabled;
		}

		if (updates.streaming) {
			input['streaming'] = {
				defaultQuality: updates.streaming.defaultQuality,
				autoQuality: updates.streaming.autoQuality,
				preloadNext: updates.streaming.preloadNext,
				dataSaver: updates.streaming.dataSaver,
			};
		}

		if (updates.reblogFilters) {
			input['reblogFilters'] = updates.reblogFilters;
		}

		if (updates.privacy) {
			input['defaultVisibility'] = updates.privacy.defaultVisibility;
			input['indexable'] = updates.privacy.indexable;
			input['showOnlineStatus'] = updates.privacy.showOnlineStatus;
		}

		return input;
	}
}
