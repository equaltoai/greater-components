import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PreferencesGraphQLController } from '../../src/components/Profile/PreferencesController.js';
import type { UserPreferences } from '../../src/components/Profile/PreferencesController.js';

// Mock LesserGraphQLAdapter
const createMockAdapter = () => ({
	getUserPreferences: vi.fn(),
	updateUserPreferences: vi.fn(),
	updateStreamingPreferences: vi.fn(),
});

describe('PreferencesGraphQLController', () => {
	let adapter: ReturnType<typeof createMockAdapter>;
	let controller: PreferencesGraphQLController;

	beforeEach(() => {
		adapter = createMockAdapter();
		controller = new PreferencesGraphQLController(adapter as any);
	});

	describe('loadPreferences', () => {
		it('should load and normalize preferences from adapter', async () => {
			const mockPrefs: UserPreferences = {
				actorId: 'actor-123',
				posting: {
					defaultVisibility: 'PUBLIC',
					defaultSensitive: false,
					defaultLanguage: 'en',
				},
				reading: {
					expandSpoilers: false,
					expandMedia: 'DEFAULT',
					autoplayGifs: true,
					timelineOrder: 'NEWEST',
				},
				discovery: {
					showFollowCounts: true,
					searchSuggestionsEnabled: true,
					personalizedSearchEnabled: true,
				},
				streaming: {
					defaultQuality: 'AUTO',
					autoQuality: true,
					preloadNext: false,
					dataSaver: false,
				},
				notifications: {
					email: false,
					push: true,
					inApp: true,
					digest: 'NEVER',
				},
				privacy: {
					defaultVisibility: 'PUBLIC',
					indexable: true,
					showOnlineStatus: false,
				},
				reblogFilters: [],
			};

			adapter.getUserPreferences.mockResolvedValue(mockPrefs);

			await controller.loadPreferences();

			const state = controller.getState();
			expect(state.loading).toBe(false);
			expect(state.preferences).toEqual(mockPrefs);
			expect(state.error).toBeNull();
		});

		it('should handle load errors gracefully', async () => {
			adapter.getUserPreferences.mockRejectedValue(new Error('Network error'));

			await expect(controller.loadPreferences()).rejects.toThrow('Network error');

			const state = controller.getState();
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Network error');
		});
	});

	describe('updatePreferences', () => {
		it('should update preferences on the server', async () => {
			const readingUpdates: UserPreferences['reading'] = {
				expandSpoilers: true,
				expandMedia: 'SHOW_ALL',
				autoplayGifs: false,
				timelineOrder: 'OLDEST',
			};

			const updates: Partial<UserPreferences> = {
				reading: readingUpdates,
			};

			const mockUpdated: UserPreferences = {
				actorId: 'actor-123',
				posting: {
					defaultVisibility: 'PUBLIC',
					defaultSensitive: false,
					defaultLanguage: 'en',
				},
				reading: readingUpdates,
				discovery: {
					showFollowCounts: true,
					searchSuggestionsEnabled: true,
					personalizedSearchEnabled: true,
				},
				streaming: {
					defaultQuality: 'AUTO',
					autoQuality: true,
					preloadNext: false,
					dataSaver: false,
				},
				notifications: {
					email: false,
					push: true,
					inApp: true,
					digest: 'NEVER',
				},
				privacy: {
					defaultVisibility: 'PUBLIC',
					indexable: true,
					showOnlineStatus: false,
				},
				reblogFilters: [],
			};

			adapter.updateUserPreferences.mockResolvedValue(mockUpdated);

			await controller.updatePreferences(updates);

			const state = controller.getState();
			expect(state.saving).toBe(false);
			expect(state.preferences?.reading).toEqual(updates.reading);
			expect(state.lastSaved).toBeInstanceOf(Date);
		});

		it('should handle update errors', async () => {
			adapter.updateUserPreferences.mockRejectedValue(new Error('Update failed'));

			await expect(controller.updatePreferences({})).rejects.toThrow('Update failed');

			const state = controller.getState();
			expect(state.saving).toBe(false);
			expect(state.error).toBe('Update failed');
		});
	});

	describe('updateStreamingPreferences', () => {
		it('should update streaming preferences separately', async () => {
			// First load initial preferences
			const mockPrefs: UserPreferences = {
				actorId: 'actor-123',
				posting: {
					defaultVisibility: 'PUBLIC',
					defaultSensitive: false,
					defaultLanguage: 'en',
				},
				reading: {
					expandSpoilers: false,
					expandMedia: 'DEFAULT',
					autoplayGifs: true,
					timelineOrder: 'NEWEST',
				},
				discovery: {
					showFollowCounts: true,
					searchSuggestionsEnabled: true,
					personalizedSearchEnabled: true,
				},
				streaming: {
					defaultQuality: 'AUTO',
					autoQuality: true,
					preloadNext: false,
					dataSaver: false,
				},
				notifications: {
					email: false,
					push: true,
					inApp: true,
					digest: 'NEVER',
				},
				privacy: {
					defaultVisibility: 'PUBLIC',
					indexable: true,
					showOnlineStatus: false,
				},
				reblogFilters: [],
			};

			adapter.getUserPreferences.mockResolvedValue(mockPrefs);
			await controller.loadPreferences();

			// Update streaming preferences
			const streamingUpdates = {
				defaultQuality: 'HIGH' as const,
				dataSaver: true,
			};

			adapter.updateStreamingPreferences.mockResolvedValue({
				streaming: {
					...mockPrefs.streaming,
					...streamingUpdates,
				},
			});

			await controller.updateStreamingPreferences(streamingUpdates);

			const state = controller.getState();
			expect(state.preferences?.streaming.defaultQuality).toBe('HIGH');
			expect(state.preferences?.streaming.dataSaver).toBe(true);
		});
	});

	describe('privacy settings integration', () => {
		it('should convert privacy settings to preferences updates', async () => {
			const mockPrefs: UserPreferences = {
				actorId: 'actor-123',
				posting: {
					defaultVisibility: 'PUBLIC',
					defaultSensitive: false,
					defaultLanguage: 'en',
				},
				reading: {
					expandSpoilers: false,
					expandMedia: 'DEFAULT',
					autoplayGifs: true,
					timelineOrder: 'NEWEST',
				},
				discovery: {
					showFollowCounts: true,
					searchSuggestionsEnabled: true,
					personalizedSearchEnabled: true,
				},
				streaming: {
					defaultQuality: 'AUTO',
					autoQuality: true,
					preloadNext: false,
					dataSaver: false,
				},
				notifications: {
					email: false,
					push: true,
					inApp: true,
					digest: 'NEVER',
				},
				privacy: {
					defaultVisibility: 'PUBLIC',
					indexable: true,
					showOnlineStatus: false,
				},
				reblogFilters: [],
			};

			adapter.getUserPreferences.mockResolvedValue(mockPrefs);
			adapter.updateUserPreferences.mockResolvedValue(mockPrefs);

			await controller.loadPreferences();

			await controller.updatePrivacySettings({
				searchableBySearchEngines: false,
				autoplayGifs: false,
			});

			expect(adapter.updateUserPreferences).toHaveBeenCalledWith(
				expect.objectContaining({
					autoplayGifs: false,
				})
			);
		});

		it('should get privacy settings from preferences', async () => {
			const mockPrefs: UserPreferences = {
				actorId: 'actor-123',
				posting: {
					defaultVisibility: 'PUBLIC',
					defaultSensitive: false,
					defaultLanguage: 'en',
				},
				reading: {
					expandSpoilers: false,
					expandMedia: 'DEFAULT',
					autoplayGifs: true,
					timelineOrder: 'NEWEST',
				},
				discovery: {
					showFollowCounts: true,
					searchSuggestionsEnabled: true,
					personalizedSearchEnabled: false,
				},
				streaming: {
					defaultQuality: 'AUTO',
					autoQuality: true,
					preloadNext: false,
					dataSaver: false,
				},
				notifications: {
					email: false,
					push: true,
					inApp: true,
					digest: 'NEVER',
				},
				privacy: {
					defaultVisibility: 'PRIVATE',
					indexable: false,
					showOnlineStatus: false,
				},
				reblogFilters: [],
			};

			adapter.getUserPreferences.mockResolvedValue(mockPrefs);
			await controller.loadPreferences();

			const privacySettings = controller.getPrivacySettings();

			expect(privacySettings).toMatchObject({
				isPrivate: true,
				searchableBySearchEngines: false,
				discoverable: true,
				autoplayGifs: true,
			});
		});
	});

	describe('state subscription', () => {
		it('should notify listeners on state changes', async () => {
			const listener = vi.fn();
			const unsubscribe = controller.subscribe(listener);

			const mockPrefs: UserPreferences = {
				actorId: 'actor-123',
				posting: {
					defaultVisibility: 'PUBLIC',
					defaultSensitive: false,
					defaultLanguage: 'en',
				},
				reading: {
					expandSpoilers: false,
					expandMedia: 'DEFAULT',
					autoplayGifs: true,
					timelineOrder: 'NEWEST',
				},
				discovery: {
					showFollowCounts: true,
					searchSuggestionsEnabled: true,
					personalizedSearchEnabled: true,
				},
				streaming: {
					defaultQuality: 'AUTO',
					autoQuality: true,
					preloadNext: false,
					dataSaver: false,
				},
				notifications: {
					email: false,
					push: true,
					inApp: true,
					digest: 'NEVER',
				},
				privacy: {
					defaultVisibility: 'PUBLIC',
					indexable: true,
					showOnlineStatus: false,
				},
				reblogFilters: [],
			};

			adapter.getUserPreferences.mockResolvedValue(mockPrefs);
			await controller.loadPreferences();

			expect(listener).toHaveBeenCalled();
			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({
					preferences: mockPrefs,
					loading: false,
				})
			);

			unsubscribe();
		});
	});

	describe('destroy', () => {
		it('should clean up resources when destroyed', () => {
			const listener = vi.fn();
			controller.subscribe(listener);

			controller.destroy();

			expect(() => controller.loadPreferences()).rejects.toThrow(
				'PreferencesController has been destroyed'
			);
		});
	});
});




