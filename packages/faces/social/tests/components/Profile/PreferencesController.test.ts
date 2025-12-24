import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PreferencesGraphQLController } from '@equaltoai/greater-components-fediverse/components/Profile/PreferencesController';
import { createFakeLesserAdapter } from '../../helpers/fakes/createFakeLesserAdapter';
import {
	rawFullPreferences,
	expectedFullPreferences,
	rawMinimalPreferences,
} from '../../helpers/fixtures/preferences';

describe('PreferencesGraphQLController', () => {
	let adapter: any;
	let controller: PreferencesGraphQLController;

	beforeEach(() => {
		adapter = createFakeLesserAdapter();
		controller = new PreferencesGraphQLController(adapter);
	});

	describe('Lifecycle', () => {
		it('starts with initial state', () => {
			const state = controller.getState();
			expect(state.preferences).toBeNull();
			expect(state.loading).toBe(false);
			expect(state.saving).toBe(false);
			expect(state.error).toBeNull();
		});

		it('subscribe() notifies on changes', async () => {
			const callback = vi.fn();
			const unsubscribe = controller.subscribe(callback);

			adapter.getUserPreferences.mockResolvedValue(rawFullPreferences);
			await controller.loadPreferences();

			expect(callback).toHaveBeenCalled();
			unsubscribe();
		});

		it('destroy() prevents further actions', async () => {
			controller.destroy();

			await expect(controller.loadPreferences()).rejects.toThrow('destroyed');
			await expect(controller.updatePreferences({})).rejects.toThrow('destroyed');
		});
	});

	describe('Loading', () => {
		it('loadPreferences() sets state and normalizes data', async () => {
			adapter.getUserPreferences.mockResolvedValue(rawFullPreferences);

			const p = controller.loadPreferences();
			expect(controller.getState().loading).toBe(true);
			await p;

			const state = controller.getState();
			expect(state.loading).toBe(false);
			expect(state.error).toBeNull();
			expect(state.preferences).toEqual(expectedFullPreferences);
		});

		it('loadPreferences() handles minimal/missing data', async () => {
			adapter.getUserPreferences.mockResolvedValue(rawMinimalPreferences);

			await controller.loadPreferences();

			const state = controller.getState();
			expect(state.preferences?.actorId).toBe('2');
			// Check defaults
			expect(state.preferences?.posting.defaultVisibility).toBe('PUBLIC');
			expect(state.preferences?.streaming.defaultQuality).toBe('AUTO');
		});

		it('loadPreferences() handles errors', async () => {
			adapter.getUserPreferences.mockRejectedValue(new Error('Load failed'));

			await expect(controller.loadPreferences()).rejects.toThrow('Load failed');

			const state = controller.getState();
			expect(state.loading).toBe(false);
			expect(state.error).toBe('Load failed');
		});
	});

	describe('Updating', () => {
		beforeEach(async () => {
			adapter.getUserPreferences.mockResolvedValue(rawFullPreferences);
			await controller.loadPreferences();
		});

		it('updatePreferences() calls adapter with mapped input', async () => {
			adapter.updateUserPreferences.mockResolvedValue({
				...rawFullPreferences,
				posting: { ...rawFullPreferences.posting, defaultVisibility: 'PUBLIC' },
			});

			await controller.updatePreferences({
				posting: {
					defaultVisibility: 'PUBLIC',
					defaultSensitive: true,
					defaultLanguage: 'fr',
				},
			});

			expect(adapter.updateUserPreferences).toHaveBeenCalledWith(
				expect.objectContaining({
					defaultPostingVisibility: 'PUBLIC',
					defaultMediaSensitive: true,
					language: 'fr',
				})
			);

			expect(controller.getState().preferences?.posting.defaultVisibility).toBe('PUBLIC');
			expect(controller.getState().lastSaved).not.toBeNull();
		});

		it('updatePreferences() handles errors', async () => {
			adapter.updateUserPreferences.mockRejectedValue(new Error('Save failed'));

			await expect(
				controller.updatePreferences({
					posting: { ...expectedFullPreferences.posting, defaultVisibility: 'PUBLIC' },
				})
			).rejects.toThrow('Save failed');

			const state = controller.getState();
			expect(state.saving).toBe(false);
			expect(state.error).toBe('Save failed');
		});

		it('updateStreamingPreferences() updates subset', async () => {
			const streamingUpdate = { ...rawFullPreferences.streaming, autoQuality: true };
			adapter.updateStreamingPreferences.mockResolvedValue({ streaming: streamingUpdate });

			await controller.updateStreamingPreferences({ autoQuality: true });

			expect(adapter.updateStreamingPreferences).toHaveBeenCalledWith({ autoQuality: true });
			expect(controller.getState().preferences?.streaming.autoQuality).toBe(true);
		});
	});

	describe('Privacy Settings', () => {
		beforeEach(async () => {
			adapter.getUserPreferences.mockResolvedValue(rawFullPreferences);
			await controller.loadPreferences();
		});

		it('getPrivacySettings() maps preferences correctly', () => {
			const privacy = controller.getPrivacySettings();
			expect(privacy).not.toBeNull();

			// From rawFullPreferences:
			// privacy.defaultVisibility: 'PRIVATE' -> isPrivate: true
			// discovery.showFollowCounts: false -> hideFollowers: true
			// privacy.indexable: false -> searchableBySearchEngines: false

			expect(privacy?.isPrivate).toBe(true);
			expect(privacy?.hideFollowers).toBe(true);
			expect(privacy?.searchableBySearchEngines).toBe(false);
		});

		it('updatePrivacySettings() maps UI model to preferences', async () => {
			// Mock successful update
			adapter.updateUserPreferences.mockImplementation(async (_input: any) => {
				// We just want to check input, but we need to return valid object to not crash
				return rawFullPreferences;
			});

			await controller.updatePrivacySettings({
				isPrivate: false,
				hideFollowers: false,
			});

			expect(adapter.updateUserPreferences).toHaveBeenCalledWith(
				expect.objectContaining({
					defaultVisibility: 'PUBLIC', // Toggled from PRIVATE
				})
			);

			// Check discovery update
			// updatePrivacySettings logic merges and calls updatePreferences
			// We can inspect the calls
			const callArgs = (adapter.updateUserPreferences as any).mock.calls[0][0];
			expect(callArgs.showFollowCounts).toBe(true); // Toggled from false
		});

		it('updatePrivacySettings() merges multiple fields', async () => {
			adapter.updateUserPreferences.mockResolvedValue(rawFullPreferences);

			await controller.updatePrivacySettings({
				searchableBySearchEngines: true,
				autoplayGifs: true,
			});

			const callArgs = (adapter.updateUserPreferences as any).mock.calls[0][0];

			// privacy.indexable -> mapped to 'indexable'
			expect(callArgs.indexable).toBe(true);

			// reading.autoplayGifs -> mapped to 'autoplayGifs'
			expect(callArgs.autoplayGifs).toBe(true);
		});
	});
});
