export const rawFullPreferences = {
	actorId: '1',
	posting: {
		defaultVisibility: 'UNLISTED',
		defaultSensitive: true,
		defaultLanguage: 'fr',
	},
	reading: {
		expandSpoilers: true,
		expandMedia: 'SHOW_ALL',
		autoplayGifs: false,
		timelineOrder: 'OLDEST',
	},
	discovery: {
		showFollowCounts: false,
		searchSuggestionsEnabled: false,
		personalizedSearchEnabled: false,
	},
	streaming: {
		defaultQuality: 'HIGH',
		autoQuality: false,
		preloadNext: true,
		dataSaver: true,
	},
	notifications: {
		email: false,
		push: false,
		inApp: false,
		digest: 'WEEKLY',
	},
	privacy: {
		defaultVisibility: 'PRIVATE',
		indexable: false,
		showOnlineStatus: true,
	},
	reblogFilters: [{ key: '123', enabled: true }],
};

export const rawMinimalPreferences = {
	actorId: '2',
	// Missing all nested objects to trigger default values in normalizePreferences
};

export const expectedFullPreferences = {
	actorId: '1',
	posting: {
		defaultVisibility: 'UNLISTED',
		defaultSensitive: true,
		defaultLanguage: 'fr',
	},
	reading: {
		expandSpoilers: true,
		expandMedia: 'SHOW_ALL',
		autoplayGifs: false,
		timelineOrder: 'OLDEST',
	},
	discovery: {
		showFollowCounts: false,
		searchSuggestionsEnabled: false,
		personalizedSearchEnabled: false,
	},
	streaming: {
		defaultQuality: 'HIGH',
		autoQuality: false,
		preloadNext: true,
		dataSaver: true,
	},
	notifications: {
		email: false,
		push: false,
		inApp: false,
		digest: 'WEEKLY',
	},
	privacy: {
		defaultVisibility: 'PRIVATE',
		indexable: false,
		showOnlineStatus: true,
	},
	reblogFilters: [{ key: '123', enabled: true }],
};
