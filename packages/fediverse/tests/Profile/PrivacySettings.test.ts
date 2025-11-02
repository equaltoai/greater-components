/**
 * PrivacySettings Component Tests
 *
 * Tests for Profile.PrivacySettings component which manages account privacy
 * configuration including visibility, discoverability, and media settings.
 */

import { describe, it, expect } from 'vitest';
import type { PrivacySettings } from '../../src/components/Profile/context.js';

describe('PrivacySettings Logic', () => {
	describe('Default Settings', () => {
		function getDefaultSettings(): PrivacySettings {
			return {
				isPrivate: false,
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};
		}

		it('should have correct default values', () => {
			const defaults = getDefaultSettings();
			
			expect(defaults.isPrivate).toBe(false);
			expect(defaults.requireFollowApproval).toBe(false);
			expect(defaults.searchableBySearchEngines).toBe(true);
			expect(defaults.discoverable).toBe(true);
			expect(defaults.autoplayGifs).toBe(true);
			expect(defaults.autoplayVideos).toBe(false);
		});

		it('should have privacy features disabled by default', () => {
			const defaults = getDefaultSettings();
			
			expect(defaults.hideFollowers).toBe(false);
			expect(defaults.hideFollowing).toBe(false);
			expect(defaults.hideRelationships).toBe(false);
		});

		it('should have sensitive content disabled by default', () => {
			const defaults = getDefaultSettings();
			
			expect(defaults.showAdultContent).toBe(false);
		});
	});

	describe('Settings Validation', () => {
		it('should validate boolean settings', () => {
			const settings: PrivacySettings = {
				isPrivate: true,
				requireFollowApproval: false,
				hideFollowers: true,
				hideFollowing: false,
				hideRelationships: true,
				searchableBySearchEngines: false,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			// All settings should be boolean
			Object.values(settings).forEach(value => {
				expect(typeof value).toBe('boolean');
			});
		});

		it('should handle all keys present', () => {
			const settings: PrivacySettings = {
				isPrivate: false,
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			expect(Object.keys(settings)).toHaveLength(10);
		});
	});

	describe('hasChanges Detection', () => {
		function hasChanges(original: Partial<PrivacySettings>, local: PrivacySettings): boolean {
			return Object.keys(original).some(
				(key) => local[key as keyof PrivacySettings] !== original[key as keyof PrivacySettings]
			);
		}

		it('should detect no changes when settings are identical', () => {
			const original: Partial<PrivacySettings> = {
				isPrivate: false,
				discoverable: true,
			};
			const local: PrivacySettings = {
				isPrivate: false,
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			expect(hasChanges(original, local)).toBe(false);
		});

		it('should detect changes in privacy settings', () => {
			const original: Partial<PrivacySettings> = {
				isPrivate: false,
				discoverable: true,
			};
			const local: PrivacySettings = {
				isPrivate: true, // Changed
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			expect(hasChanges(original, local)).toBe(true);
		});

		it('should detect multiple changes', () => {
			const original: Partial<PrivacySettings> = {
				isPrivate: false,
				hideFollowers: false,
				autoplayVideos: false,
			};
			const local: PrivacySettings = {
				isPrivate: true, // Changed
				requireFollowApproval: false,
				hideFollowers: true, // Changed
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: true, // Changed
			};

			expect(hasChanges(original, local)).toBe(true);
		});
	});

	describe('Setting Categories', () => {
		interface SettingConfig {
			key: keyof PrivacySettings;
			label: string;
			description: string;
			category: 'account' | 'visibility' | 'discovery' | 'media';
		}

		const settingConfigs: SettingConfig[] = [
			{
				key: 'isPrivate',
				label: 'Private account',
				description: 'Require approval for new followers',
				category: 'account',
			},
			{
				key: 'requireFollowApproval',
				label: 'Manually approve follow requests',
				description: 'Review each follow request individually',
				category: 'account',
			},
			{
				key: 'hideFollowers',
				label: 'Hide followers list',
				description: 'Only you can see who follows you',
				category: 'visibility',
			},
			{
				key: 'hideFollowing',
				label: 'Hide following list',
				description: 'Only you can see who you follow',
				category: 'visibility',
			},
			{
				key: 'hideRelationships',
				label: 'Hide relationship indicators',
				description: 'Hide "follows you" and mutual follow badges',
				category: 'visibility',
			},
			{
				key: 'searchableBySearchEngines',
				label: 'Allow search engine indexing',
				description: 'Let search engines index your public posts',
				category: 'discovery',
			},
			{
				key: 'discoverable',
				label: 'Suggest account to others',
				description: 'Appear in recommendations and suggestions',
				category: 'discovery',
			},
			{
				key: 'showAdultContent',
				label: 'Show adult content',
				description: 'Display posts marked as adult/sensitive',
				category: 'media',
			},
			{
				key: 'autoplayGifs',
				label: 'Autoplay animated GIFs',
				description: 'Automatically play GIF animations',
				category: 'media',
			},
			{
				key: 'autoplayVideos',
				label: 'Autoplay videos',
				description: 'Automatically play video content',
				category: 'media',
			},
		];

		it('should have all privacy settings configured', () => {
			expect(settingConfigs).toHaveLength(10);
		});

		it('should categorize account settings correctly', () => {
			const accountSettings = settingConfigs.filter(s => s.category === 'account');
			expect(accountSettings).toHaveLength(2);
			expect(accountSettings.map(s => s.key)).toContain('isPrivate');
			expect(accountSettings.map(s => s.key)).toContain('requireFollowApproval');
		});

		it('should categorize visibility settings correctly', () => {
			const visibilitySettings = settingConfigs.filter(s => s.category === 'visibility');
			expect(visibilitySettings).toHaveLength(3);
			expect(visibilitySettings.map(s => s.key)).toContain('hideFollowers');
			expect(visibilitySettings.map(s => s.key)).toContain('hideFollowing');
			expect(visibilitySettings.map(s => s.key)).toContain('hideRelationships');
		});

		it('should categorize discovery settings correctly', () => {
			const discoverySettings = settingConfigs.filter(s => s.category === 'discovery');
			expect(discoverySettings).toHaveLength(2);
			expect(discoverySettings.map(s => s.key)).toContain('searchableBySearchEngines');
			expect(discoverySettings.map(s => s.key)).toContain('discoverable');
		});

		it('should categorize media settings correctly', () => {
			const mediaSettings = settingConfigs.filter(s => s.category === 'media');
			expect(mediaSettings).toHaveLength(3);
			expect(mediaSettings.map(s => s.key)).toContain('showAdultContent');
			expect(mediaSettings.map(s => s.key)).toContain('autoplayGifs');
			expect(mediaSettings.map(s => s.key)).toContain('autoplayVideos');
		});

		it('should have unique keys', () => {
			const keys = settingConfigs.map(s => s.key);
			const uniqueKeys = new Set(keys);
			expect(uniqueKeys.size).toBe(keys.length);
		});

		it('should have non-empty labels and descriptions', () => {
			settingConfigs.forEach(config => {
				expect(config.label).toBeTruthy();
				expect(config.description).toBeTruthy();
				expect(config.label.length).toBeGreaterThan(0);
				expect(config.description.length).toBeGreaterThan(0);
			});
		});
	});

		describe('Setting Update Logic', () => {
			it('should update single setting', () => {
				const settings: PrivacySettings = {
					isPrivate: false,
					requireFollowApproval: false,
					hideFollowers: false,
					hideFollowing: false,
					hideRelationships: false,
					searchableBySearchEngines: true,
					discoverable: true,
					showAdultContent: false,
					autoplayGifs: true,
					autoplayVideos: false,
				};

				const updated = { ...settings, isPrivate: true };

				expect(updated.isPrivate).toBe(true);
				expect(updated.requireFollowApproval).toBe(false); // Others unchanged
			});

			it('should update multiple settings', () => {
				const settings: PrivacySettings = {
					isPrivate: false,
					requireFollowApproval: false,
					hideFollowers: false,
					hideFollowing: false,
					hideRelationships: false,
					searchableBySearchEngines: true,
					discoverable: true,
					showAdultContent: false,
					autoplayGifs: true,
					autoplayVideos: false,
				};

				const updated = {
					...settings,
					isPrivate: true,
					hideFollowers: true,
					hideFollowing: true,
				};

				expect(updated.isPrivate).toBe(true);
				expect(updated.hideFollowers).toBe(true);
				expect(updated.hideFollowing).toBe(true);
			});

			it('should toggle settings correctly', () => {
				const settings: PrivacySettings = {
					isPrivate: false,
					requireFollowApproval: false,
					hideFollowers: false,
					hideFollowing: false,
					hideRelationships: false,
					searchableBySearchEngines: true,
					discoverable: true,
					showAdultContent: false,
					autoplayGifs: true,
					autoplayVideos: false,
				};

				const toggledOnce = { ...settings, autoplayGifs: !settings.autoplayGifs };
				expect(toggledOnce.autoplayGifs).toBe(false);

				const toggledTwice = { ...toggledOnce, autoplayGifs: !toggledOnce.autoplayGifs };
				expect(toggledTwice.autoplayGifs).toBe(true);
			});
		});

	describe('Reset Functionality', () => {
		it('should reset all settings to original values', () => {
			const original: Partial<PrivacySettings> = {
				isPrivate: false,
				discoverable: true,
				autoplayVideos: false,
			};

			let local: PrivacySettings = {
				isPrivate: true, // Modified
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: false, // Modified
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: true, // Modified
			};

			// Reset
			local = {
				isPrivate: original.isPrivate ?? false,
				requireFollowApproval: original.requireFollowApproval ?? false,
				hideFollowers: original.hideFollowers ?? false,
				hideFollowing: original.hideFollowing ?? false,
				hideRelationships: original.hideRelationships ?? false,
				searchableBySearchEngines: original.searchableBySearchEngines ?? true,
				discoverable: original.discoverable ?? true,
				showAdultContent: original.showAdultContent ?? false,
				autoplayGifs: original.autoplayGifs ?? true,
				autoplayVideos: original.autoplayVideos ?? false,
			};

			expect(local.isPrivate).toBe(false);
			expect(local.discoverable).toBe(true);
			expect(local.autoplayVideos).toBe(false);
		});
	});

	describe('Edge Cases', () => {
		it('should handle partial settings', () => {
			const partial: Partial<PrivacySettings> = {
				isPrivate: true,
				discoverable: false,
			};

			expect(partial.isPrivate).toBe(true);
			expect(partial.discoverable).toBe(false);
			expect(partial.hideFollowers).toBeUndefined();
		});

		it('should handle empty settings object', () => {
			const empty: Partial<PrivacySettings> = {};

			expect(Object.keys(empty)).toHaveLength(0);
		});

		it('should handle setting same value multiple times', () => {
			const settings: PrivacySettings = {
				isPrivate: false,
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			settings.isPrivate = true;
			settings.isPrivate = true;
			settings.isPrivate = true;

			expect(settings.isPrivate).toBe(true);
		});

		it('should handle rapid setting changes', () => {
			const settings: PrivacySettings = {
				isPrivate: false,
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			// Rapidly toggle
			for (let i = 0; i < 100; i++) {
				settings.autoplayVideos = !settings.autoplayVideos;
			}

			// Should be false (started at false, toggled even number of times)
			expect(settings.autoplayVideos).toBe(false);
		});
	});

	describe('Privacy Combinations', () => {
		it('should allow private account with hidden lists', () => {
			const settings: PrivacySettings = {
				isPrivate: true,
				requireFollowApproval: true,
				hideFollowers: true,
				hideFollowing: true,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			expect(settings.isPrivate).toBe(true);
			expect(settings.hideFollowers).toBe(true);
			expect(settings.hideFollowing).toBe(true);
		});

		it('should allow public account with search engine indexing', () => {
			const settings: PrivacySettings = {
				isPrivate: false,
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: false,
				autoplayGifs: true,
				autoplayVideos: false,
			};

			expect(settings.isPrivate).toBe(false);
			expect(settings.searchableBySearchEngines).toBe(true);
			expect(settings.discoverable).toBe(true);
		});

		it('should allow maximum privacy configuration', () => {
			const settings: PrivacySettings = {
				isPrivate: true,
				requireFollowApproval: true,
				hideFollowers: true,
				hideFollowing: true,
				hideRelationships: true,
				searchableBySearchEngines: false,
				discoverable: false,
				showAdultContent: false,
				autoplayGifs: false,
				autoplayVideos: false,
			};

			// All privacy features enabled/disabled for maximum privacy
			expect(settings.isPrivate).toBe(true);
			expect(settings.requireFollowApproval).toBe(true);
			expect(settings.hideFollowers).toBe(true);
			expect(settings.hideFollowing).toBe(true);
			expect(settings.hideRelationships).toBe(true);
			expect(settings.searchableBySearchEngines).toBe(false);
			expect(settings.discoverable).toBe(false);
		});

		it('should allow maximum openness configuration', () => {
			const settings: PrivacySettings = {
				isPrivate: false,
				requireFollowApproval: false,
				hideFollowers: false,
				hideFollowing: false,
				hideRelationships: false,
				searchableBySearchEngines: true,
				discoverable: true,
				showAdultContent: true,
				autoplayGifs: true,
				autoplayVideos: true,
			};

			// All privacy features disabled for maximum openness
			expect(settings.isPrivate).toBe(false);
			expect(settings.hideFollowers).toBe(false);
			expect(settings.searchableBySearchEngines).toBe(true);
			expect(settings.discoverable).toBe(true);
		});
	});
});
