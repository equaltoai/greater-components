import type {
	Account,
	MediaAttachment,
	Notification,
	ProfileConnection,
	SearchActor,
	SearchNote,
	SearchResultType,
	SearchResults,
	SearchTag,
	Status,
	TimelineFilter,
	TimelineSeed,
	UnifiedAccount,
} from '../types/fediverse';

const now = Date.now();

const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

const clone = <T>(value: T): T =>
	typeof structuredClone === 'function'
		? structuredClone(value)
		: JSON.parse(JSON.stringify(value));

const makeId = (): string => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	return `id-${Math.random().toString(36).slice(2)}`;
};

const demoAccounts: {
	alicia: Account;
	theo: Account;
	lynn: Account;
	devrel: Account;
} = {
	alicia: {
		id: 'acct-alicia',
		username: 'alicia',
		acct: 'alicia@equalto.social',
		displayName: 'Alicia Shen',
		avatar: 'https://placehold.co/96x96/1d4ed8/ffffff?text=AS',
		header: 'https://placehold.co/1200x360/0f172a/94a3b8?text=Greater+Client+Ops',
		url: 'https://equalto.social/@alicia',
		note: '<p>Product at Greater • decentralization advocate • keyboard shortcuts collector</p>',
		followersCount: 12800,
		followingCount: 421,
		statusesCount: 9054,
		verified: true,
		locked: false,
		bot: false,
		createdAt: '2020-06-18T12:10:00Z',
	},
	theo: {
		id: 'acct-theo',
		username: 'theo',
		acct: 'theo@mastodon.art',
		displayName: 'Theo Martinez',
		avatar: 'https://placehold.co/96x96/ea580c/ffffff?text=TM',
		header: 'https://placehold.co/1200x360/1e293b/94a3b8?text=Art+Signals',
		url: 'https://mastodon.art/@theo',
		note: '<p>Accessibility researcher sketching interfaces for the Fediverse.</p>',
		followersCount: 3520,
		followingCount: 811,
		statusesCount: 4300,
		verified: false,
		locked: false,
		bot: false,
		createdAt: '2021-03-02T09:15:00Z',
	},
	lynn: {
		id: 'acct-lynn',
		username: 'lynn',
		acct: 'lynn@green.earth',
		displayName: 'Lynn Park (they/them)',
		avatar: 'https://placehold.co/96x96/0f766e/ffffff?text=LP',
		header: 'https://placehold.co/1200x360/064e3b/a7f3d0?text=Ecology+Notes',
		url: 'https://green.earth/@lynn',
		note: '<p>Urban ecologist tracking community gardens + transit experiments.</p>',
		followersCount: 9800,
		followingCount: 540,
		statusesCount: 12033,
		verified: false,
		locked: false,
		bot: false,
		createdAt: '2019-11-22T22:45:00Z',
	},
	devrel: {
		id: 'acct-devrel',
		username: 'greaterdevrel',
		acct: 'devrel@equalto.social',
		displayName: 'Greater DX Team',
		avatar: 'https://placehold.co/96x96/312e81/ffffff?text=DX',
		header: 'https://placehold.co/1200x360/312e81/c7d2fe?text=DevRel+Updates',
		url: 'https://equalto.social/@devrel',
		note: '<p>Release notes, API changes, and Svelte-friendly ergonomics.</p>',
		followersCount: 22000,
		followingCount: 33,
		statusesCount: 412,
		verified: true,
		locked: false,
		bot: true,
		createdAt: '2022-09-12T14:00:00Z',
	},
};

const immersiveMedia = (): MediaAttachment[] => [
	{
		id: `media-${makeId()}`,
		type: 'image',
		url: 'https://placehold.co/1280x720/111827/fbbf24?text=Sunrise+over+Oregon+Coast',
		previewUrl: 'https://placehold.co/600x400/111827/fbbf24?text=Sunrise',
		description: 'Sunrise over the Oregon coast captured during a biodiversity survey',
		mediaCategory: 'IMAGE',
		sensitive: false,
	},
	{
		id: `media-${makeId()}`,
		type: 'image',
		url: 'https://placehold.co/1280x720/0a0a0a/38bdf8?text=Sensor+Cluster',
		previewUrl: 'https://placehold.co/600x400/0a0a0a/38bdf8?text=Sensors',
		description: 'IoT air-quality sensors running the Lesser adapter',
		mediaCategory: 'IMAGE',
		sensitive: false,
	},
];

const contentWarningsDemo: Status[] = [
	{
		id: 'status-cw-demo',
		uri: 'https://equalto.social/@alicia/1201',
		url: 'https://equalto.social/@alicia/1201',
		account: demoAccounts.alicia,
		content:
			'<p>Shipping the ActivityPub status card demo this morning. Full breakdown below once you opt in to the spoiler.</p>',
		spoilerText: 'Roadmap screenshot + moderated incident for Jan 2025',
		sensitive: true,
		mediaAttachments: immersiveMedia(),
		createdAt: minutesAgo(18),
		visibility: 'public',
		repliesCount: 42,
		reblogsCount: 16,
		favouritesCount: 88,
		mentions: [
			{
				id: 'acct-devrel',
				username: 'greaterdevrel',
				acct: demoAccounts.devrel.acct,
				url: demoAccounts.devrel.url,
			},
		],
		tags: [
			{
				name: 'ActivityPub',
				url: 'https://equalto.social/tags/ActivityPub',
			},
			{
				name: 'Svelte5',
				url: 'https://equalto.social/tags/Svelte5',
			},
		],
	},
	{
		id: 'status-poll-demo',
		uri: 'https://mastodon.art/@theo/9876',
		url: 'https://mastodon.art/@theo/9876',
		account: demoAccounts.theo,
		content:
			'<p>Feedback requested: which accessibility tip do you surface first on a federated timeline?</p>',
		createdAt: minutesAgo(42),
		visibility: 'public',
		repliesCount: 8,
		reblogsCount: 19,
		favouritesCount: 130,
		poll: {
			id: 'poll-tips',
			expiresAt: minutesAgo(-240),
			expired: false,
			multiple: false,
			votesCount: 480,
			options: [
				{ title: 'Keyboard shortcuts', votesCount: 211 },
				{ title: 'Screen-reader cues', votesCount: 154 },
				{ title: 'Color contrast guidance', votesCount: 115 },
			],
		},
		mentions: [],
		tags: [
			{
				name: 'a11y',
				url: 'https://mastodon.art/tags/a11y',
			},
		],
		mediaAttachments: [],
	},
	{
		id: 'status-thread-root',
		uri: 'https://green.earth/@lynn/305',
		url: 'https://green.earth/@lynn/305',
		account: demoAccounts.lynn,
		content:
			'<p>Thread: how federated timelines keep cached hydration local to prevent scroll jank. Pulling lessons from Mastodon, Firefish, and Lesser.</p>',
		createdAt: minutesAgo(64),
		visibility: 'public',
		repliesCount: 3,
		reblogsCount: 5,
		favouritesCount: 57,
		mediaAttachments: [
			{
				id: 'media-thread-diagram',
				type: 'image',
				url: 'https://placehold.co/1280x720/0369a1/ffffff?text=Timeline+Cache+Diagram',
				previewUrl: 'https://placehold.co/800x450/0369a1/ffffff?text=Cache+Diagram',
				description: 'Diagram comparing keep-alive strategies for infinite scroll',
				sensitive: false,
			},
		],
		mentions: [],
		tags: [
			{
				name: 'fediverse',
				url: 'https://green.earth/tags/fediverse',
			},
		],
	},
];

const threadReplies: Status[] = [
	{
		id: 'status-thread-reply-1',
		uri: 'https://equalto.social/@alicia/thread/1',
		url: 'https://equalto.social/@alicia/thread/1',
		account: demoAccounts.alicia,
		inReplyToId: 'status-thread-root',
		content:
			'<p>@lynn the biggest tip: maintain aria-live="polite" for new chunks and give keyboard focus back to the newly inserted status only if the user opted into streaming mode.</p>',
		createdAt: minutesAgo(61),
		visibility: 'public',
		repliesCount: 1,
		reblogsCount: 2,
		favouritesCount: 13,
		mediaAttachments: [],
		mentions: [],
		tags: [],
	},
	{
		id: 'status-thread-reply-2',
		uri: 'https://equalto.social/@devrel/thread/2',
		url: 'https://equalto.social/@devrel/thread/2',
		account: demoAccounts.devrel,
		inReplyToId: 'status-thread-reply-1',
		content:
			'<p>Sharing an internal snippet for data prefetch instrumentation—pairs nicely with the new Timeline store helper.</p>',
		createdAt: minutesAgo(54),
		visibility: 'public',
		repliesCount: 0,
		reblogsCount: 4,
		favouritesCount: 9,
		mediaAttachments: immersiveMedia(),
		mentions: [],
		tags: [],
	},
];

const timelineSeeds: TimelineSeed = {
	home: [
		contentWarningsDemo[0]!,
		contentWarningsDemo[1]!,
		{
			...contentWarningsDemo[2]!,
			id: 'status-home-pin',
			createdAt: minutesAgo(12),
			favouritesCount: 201,
			reblogsCount: 55,
		},
	],
	local: [
		{
			id: 'status-local-1',
			uri: 'https://local.greater/@community/1',
			url: 'https://local.greater/@community/1',
			account: demoAccounts.lynn,
			content:
				'<p>🚲 Local timeline update: 12 new mobility cooperatives federated overnight, all pinging the same notification bus.</p>',
			createdAt: minutesAgo(25),
			visibility: 'public',
			repliesCount: 2,
			reblogsCount: 1,
			favouritesCount: 24,
			mediaAttachments: [],
			mentions: [],
			tags: [
				{ name: 'LocalTimeline', url: 'https://local.greater/tags/LocalTimeline' },
				{ name: 'Mobility', url: 'https://local.greater/tags/Mobility' },
			],
		},
		{
			id: 'status-local-2',
			uri: 'https://local.greater/@ops/2',
			url: 'https://local.greater/@ops/2',
			account: demoAccounts.devrel,
			content:
				'<p>Local-only content warns the user before cross-posting to the federated timeline. Demo routes mirror this behavior.</p>',
			createdAt: minutesAgo(33),
			visibility: 'unlisted',
			repliesCount: 1,
			reblogsCount: 0,
			favouritesCount: 7,
			mediaAttachments: [],
			mentions: [],
			tags: [],
		},
	],
	federated: [
		{
			id: 'status-fed-1',
			uri: 'https://socnet.space/@ari/999',
			url: 'https://socnet.space/@ari/999',
			account: {
				...demoAccounts.alicia,
				id: 'acct-ari',
				username: 'ari',
				acct: 'ari@socnet.space',
				displayName: 'Ari • protocol engineer',
				avatar: 'https://placehold.co/96x96/581c87/ffffff?text=AP',
			},
			content:
				'<p>Cross-instance streaming? Tap into WebSub or use the Lesser streaming preferences helpers (see docs).</p>',
			createdAt: minutesAgo(120),
			visibility: 'public',
			repliesCount: 0,
			reblogsCount: 12,
			favouritesCount: 44,
			mediaAttachments: [],
			mentions: [],
			tags: [],
		},
	],
};

const notificationSeed: Notification[] = [
	{
		id: 'notif-mention-1',
		type: 'mention',
		createdAt: minutesAgo(5),
		account: demoAccounts.theo,
		read: false,
		status: {
			...contentWarningsDemo[0]!,
			id: 'mention-from-theo',
			content:
				'<p>@greaterdevrel is there an API for timeline cache hints? Asking for the demo suite.</p>',
			createdAt: minutesAgo(5),
			account: demoAccounts.theo,
		},
	},
	{
		id: 'notif-boost-1',
		type: 'reblog',
		createdAt: minutesAgo(18),
		account: demoAccounts.lynn,
		read: false,
		status: contentWarningsDemo[2]!,
	},
	{
		id: 'notif-like-1',
		type: 'favourite',
		createdAt: minutesAgo(30),
		account: demoAccounts.alicia,
		read: true,
		status: contentWarningsDemo[1]!,
	},
	{
		id: 'notif-follow-1',
		type: 'follow',
		createdAt: minutesAgo(45),
		account: demoAccounts.theo,
		read: true,
	},
	{
		id: 'notif-follow-request-1',
		type: 'follow_request',
		createdAt: minutesAgo(47),
		account: {
			...demoAccounts.lynn,
			id: 'acct-new',
			username: 'newresearcher',
			acct: 'newresearcher@neighborly.city',
			displayName: 'New Researcher',
		},
		read: false,
	},
];

const profileAccount: UnifiedAccount = {
	id: 'acct-equalto',
	username: 'greater',
	acct: 'greater@equalto.social',
	displayName: 'Greater Components',
	note: '<p>Equal To AI&rsquo;s design system for the Fediverse. Built with Svelte 5 runes, tokens, and accessibility baked in.</p>',
	avatar: 'https://placehold.co/128x128/1e1b4b/ffffff?text=GC',
	header: 'https://placehold.co/1600x480/0f172a/38bdf8?text=Greater+Components',
	createdAt: '2018-02-12T10:00:00Z',
	followersCount: 89200,
	followingCount: 154,
	statusesCount: 24111,
	locked: false,
	verified: true,
	bot: false,
	fields: [
		{ name: 'Docs', value: '<a href="https://greater.equalto.ai">greater.equalto.ai</a>' },
		{
			name: 'Source',
			value: '<a href="https://github.com/equaltoai/greater-components">GitHub</a>',
		},
		{ name: 'Tokens', value: '<code>@equaltoai/greater-components-tokens</code>' },
	],
	metadata: {
		source: 'lesser',
		apiVersion: '2025.02',
		lastUpdated: now,
		rawPayload: null,
	},
	relationship: {
		following: false,
		followedBy: true,
		requested: false,
		blocking: false,
		muting: false,
		mutingNotifications: false,
		domainBlocking: false,
		endorsed: true,
	},
};

const pinnedStatusRail: Status[] = [
	{
		id: 'pinned-release',
		uri: 'https://equalto.social/@greater/451',
		url: 'https://equalto.social/@greater/451',
		account: { ...demoAccounts.devrel },
		content:
			'<p>Timeline dock landed 🎯 Compose, filters, notifications, and preferences now stay in sync with optimistic hydration.</p>',
		createdAt: minutesAgo(210),
		visibility: 'public',
		repliesCount: 32,
		reblogsCount: 64,
		favouritesCount: 312,
		mediaAttachments: [
			{
				id: 'media-pinned-release',
				type: 'image',
				url: 'https://placehold.co/960x540/0f172a/38bdf8?text=Timeline+Dock',
				previewUrl: 'https://placehold.co/480x270/0f172a/38bdf8?text=Dock',
				description: 'Preview of the Compose dock hugging the timeline shell.',
				mediaCategory: 'IMAGE',
			},
		],
		mentions: [],
		tags: [
			{ name: 'Timeline', url: 'https://equalto.social/tags/Timeline' },
			{ name: 'Release', url: 'https://equalto.social/tags/Release' },
		],
	},
	{
		id: 'pinned-shortcuts',
		uri: 'https://equalto.social/@alicia/1904',
		url: 'https://equalto.social/@alicia/1904',
		account: { ...demoAccounts.alicia },
		content:
			'<p>Compose dock now caches drafts per filter. `g`+`h` jumps home, `g`+`l` swaps to local, and your text sticks thanks to localStorage mirroring.</p>',
		createdAt: minutesAgo(340),
		visibility: 'public',
		repliesCount: 18,
		reblogsCount: 41,
		favouritesCount: 205,
		mediaAttachments: [],
		mentions: [
			{
				id: demoAccounts.lynn.id,
				username: demoAccounts.lynn.username,
				acct: demoAccounts.lynn.acct,
				url: demoAccounts.lynn.url,
			},
		],
		tags: [
			{ name: 'Shortcuts', url: 'https://equalto.social/tags/Shortcuts' },
			{ name: 'Runes', url: 'https://equalto.social/tags/Runes' },
		],
	},
	{
		id: 'pinned-diagnostics',
		uri: 'https://green.earth/@lynn/512',
		url: 'https://green.earth/@lynn/512',
		account: { ...demoAccounts.lynn },
		content:
			'<p>Diagnostics drawer now remembers density + media expansion. Mobile collapse kicks in at 720px to keep perf budgets intact.</p>',
		createdAt: minutesAgo(480),
		visibility: 'public',
		repliesCount: 11,
		reblogsCount: 22,
		favouritesCount: 141,
		mediaAttachments: [
			{
				id: 'media-pinned-diagnostics',
				type: 'image',
				url: 'https://placehold.co/960x540/064e3b/a7f3d0?text=Preferences+Drawer',
				previewUrl: 'https://placehold.co/480x270/064e3b/a7f3d0?text=Drawer',
				description: 'Preferences drawer with streaming + density toggles.',
				mediaCategory: 'IMAGE',
			},
		],
		mentions: [],
		tags: [
			{ name: 'Diagnostics', url: 'https://equalto.social/tags/Diagnostics' },
			{ name: 'Responsive', url: 'https://equalto.social/tags/Responsive' },
		],
	},
];

const profileMediaGallery: MediaAttachment[] = [
	{
		id: 'gallery-01',
		type: 'image',
		url: 'https://placehold.co/640x360/1d4ed8/ffffff?text=Fediverse+QA',
		previewUrl: 'https://placehold.co/320x180/1d4ed8/ffffff?text=QA',
		description: 'QA suite running Compose regression plan.',
	},
	{
		id: 'gallery-02',
		type: 'image',
		url: 'https://placehold.co/640x360/0f172a/38bdf8?text=Virtualized+Timeline',
		previewUrl: 'https://placehold.co/320x180/0f172a/38bdf8?text=Timeline',
		description: 'Virtualized list instrumentation screenshot.',
	},
	{
		id: 'gallery-03',
		type: 'image',
		url: 'https://placehold.co/640x360/312e81/c7d2fe?text=Compose+Dock',
		previewUrl: 'https://placehold.co/320x180/312e81/c7d2fe?text=Compose',
		description: 'Compose dock theming with density overlay.',
	},
	{
		id: 'gallery-04',
		type: 'image',
		url: 'https://placehold.co/640x360/0f766e/a7f3d0?text=Accessibility',
		previewUrl: 'https://placehold.co/320x180/0f766e/a7f3d0?text=A11y',
		description: 'ARIA landmark map for the timeline shell.',
	},
	{
		id: 'gallery-05',
		type: 'image',
		url: 'https://placehold.co/640x360/ea580c/fff7ed?text=Media+Upload',
		previewUrl: 'https://placehold.co/320x180/ea580c/fff7ed?text=Upload',
		description: 'Media upload pipeline with alt text callouts.',
	},
	{
		id: 'gallery-06',
		type: 'image',
		url: 'https://placehold.co/640x360/1e1b4b/ffffff?text=Search+Semantic',
		previewUrl: 'https://placehold.co/320x180/1e1b4b/ffffff?text=Semantic',
		description: 'Semantic search toggle wiring diagram.',
	},
];

const connectionPanels: { followers: ProfileConnection[]; following: ProfileConnection[] } = {
	followers: [
		{
			id: 'acct-lesser-lab',
			displayName: 'Lesser Research Lab',
			acct: 'lab@lesser.city',
			avatar: 'https://placehold.co/72x72/1d4ed8/ffffff?text=LR',
			note: 'Ships semantic search + ActivityPub adapters.',
			followersCount: 18400,
			followingCount: 203,
			mutuals: 26,
			following: false,
			verified: true,
			lastActive: '12m ago',
		},
		{
			id: 'acct-fedi-insights',
			displayName: 'Fediverse Insights',
			acct: 'insights@equalto.social',
			avatar: 'https://placehold.co/72x72/0f172a/38bdf8?text=FI',
			note: 'Benchmarks timelines across Mastodon, Firefish, Lesser.',
			followersCount: 9800,
			followingCount: 188,
			mutuals: 18,
			following: true,
			lastActive: '45m ago',
		},
		{
			id: 'acct-design-a11y',
			displayName: 'Design for A11y',
			acct: 'a11y@green.earth',
			avatar: 'https://placehold.co/72x72/0f766e/ffffff?text=DA',
			note: 'Color contrast + shortcut guidance for Compose surfaces.',
			followersCount: 13200,
			followingCount: 420,
			mutuals: 33,
			following: false,
			lastActive: '1h ago',
		},
	],
	following: [
		{
			id: 'acct-oss-relay',
			displayName: 'OSS Relay',
			acct: 'relay@opensource.garden',
			avatar: 'https://placehold.co/72x72/ea580c/ffffff?text=OR',
			note: 'Mirrors ActivityPub specs + adapters.',
			followersCount: 5400,
			followingCount: 144,
			mutuals: 12,
			following: true,
			lastActive: '5m ago',
		},
		{
			id: 'acct-ux-weekly',
			displayName: 'UX Weekly',
			acct: 'uxweekly@equalto.social',
			avatar: 'https://placehold.co/72x72/f97316/ffffff?text=UX',
			note: 'Shares layout, tabs, and modal guidance.',
			followersCount: 12400,
			followingCount: 280,
			mutuals: 21,
			following: false,
			lastActive: '2h ago',
		},
		{
			id: 'acct-streaming',
			displayName: 'Streaming Experiments',
			acct: 'streaming@lesser.city',
			avatar: 'https://placehold.co/72x72/312e81/c7d2fe?text=SE',
			note: 'Focuses on timeline streaming quality + retries.',
			followersCount: 7600,
			followingCount: 98,
			mutuals: 9,
			following: true,
			lastActive: '3h ago',
		},
	],
};

type SearchTagRecord = SearchTag & { id: string };

const searchActors: SearchActor[] = [
	{
		id: demoAccounts.alicia.id,
		username: demoAccounts.alicia.username,
		displayName: demoAccounts.alicia.displayName ?? demoAccounts.alicia.username,
		avatar: demoAccounts.alicia.avatar,
		bio: 'Product at Greater · shipping compose + semantic search pilots.',
		followersCount: demoAccounts.alicia.followersCount,
		isFollowing: true,
	},
	{
		id: demoAccounts.lynn.id,
		username: demoAccounts.lynn.username,
		displayName: demoAccounts.lynn.displayName ?? demoAccounts.lynn.username,
		avatar: demoAccounts.lynn.avatar,
		bio: 'Urban ecologist measuring how federated timelines impact sensors.',
		followersCount: demoAccounts.lynn.followersCount,
		isFollowing: false,
	},
	{
		id: demoAccounts.theo.id,
		username: demoAccounts.theo.username,
		displayName: demoAccounts.theo.displayName ?? demoAccounts.theo.username,
		avatar: demoAccounts.theo.avatar,
		bio: 'Accessibility research · keyboard cue audits for Mastodon.',
		followersCount: demoAccounts.theo.followersCount,
		isFollowing: true,
	},
	{
		id: 'acct-semantic',
		username: 'semantic-scout',
		displayName: 'Semantic Scout',
		avatar: 'https://placehold.co/72x72/1e1b4b/ffffff?text=SS',
		bio: 'Runs Lesser semantic search experiments + caches tokens.',
		followersCount: 4100,
		isFollowing: false,
	},
];

const searchNotes: SearchNote[] = [
	{
		id: 'search-note-compose',
		content:
			'<p>Compose dock keeps drafts per filter now. Tap the preferences drawer to pin density + media expansion.</p>',
		author: {
			id: demoAccounts.alicia.id,
			username: demoAccounts.alicia.username,
			displayName: demoAccounts.alicia.displayName ?? demoAccounts.alicia.username,
			avatar: demoAccounts.alicia.avatar,
		},
		createdAt: minutesAgo(28),
		likesCount: 168,
		repliesCount: 19,
		reblogsCount: 47,
	},
	{
		id: 'search-note-semantic',
		content:
			'<p>Semantic search toggle maps straight to the Lesser API flag. We stream suggestions via aria-live politely.</p>',
		author: {
			id: 'acct-semantic',
			username: 'semantic-scout',
			displayName: 'Semantic Scout',
			avatar: 'https://placehold.co/64x64/1e1b4b/ffffff?text=SS',
		},
		createdAt: minutesAgo(54),
		likesCount: 92,
		repliesCount: 8,
		reblogsCount: 21,
	},
	{
		id: 'search-note-diagnostics',
		content:
			'<p>Notifications dock surfaces follow requests + mention boosts. Timeline preferences persist via localStorage + runes effects.</p>',
		author: {
			id: demoAccounts.lynn.id,
			username: demoAccounts.lynn.username,
			displayName: demoAccounts.lynn.displayName ?? demoAccounts.lynn.username,
			avatar: demoAccounts.lynn.avatar,
		},
		createdAt: minutesAgo(73),
		likesCount: 134,
		repliesCount: 14,
		reblogsCount: 33,
	},
];

const searchTags: SearchTagRecord[] = [
	{ id: 'tag-fediverseux', name: 'FediverseUX', count: 18400, trending: true },
	{ id: 'tag-compose', name: 'ComposeDock', count: 9200, trending: true },
	{ id: 'tag-semantic', name: 'SemanticSearch', count: 6400 },
	{ id: 'tag-accessibility', name: 'Accessibility', count: 21000, trending: false },
];

type MockSearchOptions = {
	query: string;
	semantic?: boolean;
	following?: boolean;
	type?: SearchResultType;
};

function matches(text: string, normalized: string) {
	return text.toLowerCase().includes(normalized);
}

function buildSearchResults(options: MockSearchOptions): SearchResults {
	const normalized = options.query.trim().toLowerCase();
	const hasQuery = normalized.length > 0;

	let actors = options.following
		? searchActors.filter((actor) => actor.isFollowing)
		: [...searchActors];
	let notes = [...searchNotes];
	let tags = [...searchTags];

	if (hasQuery) {
		actors = actors.filter(
			(actor) =>
				matches(actor.displayName, normalized) ||
				matches(actor.username, normalized) ||
				matches(actor.bio ?? '', normalized)
		);
		notes = notes.filter(
			(note) =>
				matches(note.content, normalized) ||
				matches(note.author.displayName, normalized) ||
				matches(note.author.username, normalized)
		);
		tags = tags.filter((tag) => matches(tag.name, normalized));
	} else {
		actors = actors.slice(0, 4);
		notes = notes.slice(0, 3);
		tags = tags.slice(0, 4);
	}

	if (options.semantic && hasQuery) {
		if (notes.length === 0) {
			notes = searchNotes.slice(0, 2);
		}
		if (actors.length === 0) {
			actors = searchActors.slice(0, 2);
		}
	}

	if (options.type === 'actors') {
		notes = [];
		tags = [];
	} else if (options.type === 'notes') {
		actors = [];
		tags = [];
	} else if (options.type === 'tags') {
		actors = [];
		notes = [];
	}

	const total = actors.length + notes.length + tags.length;

	return {
		actors: clone(actors),
		notes: clone(notes),
		tags: clone(tags) as SearchTag[],
		total,
	};
}

export const composeShortcuts = [
	{ combo: 'Ctrl/Cmd + Enter', description: 'Submit the compose form from any editor surface' },
	{ combo: 'Shift + Ctrl + A', description: 'Focus the media attachment picker (demo only)' },
	{ combo: 'Escape', description: 'Collapse mention autocomplete or dismiss dialogs' },
] as const;

export function createStatusShowcase(): Status[] {
	return clone(contentWarningsDemo);
}

export function createThreadReplies(): Status[] {
	return clone(threadReplies);
}

export function createTimelineSeeds(): TimelineSeed {
	return {
		home: clone(timelineSeeds.home),
		local: clone(timelineSeeds.local),
		federated: clone(timelineSeeds.federated),
	};
}

export function generateTimelineBatch(
	filter: TimelineFilter,
	page: number,
	pageSize: number
): Status[] {
	return Array.from({ length: pageSize }).map((_, index) => {
		const baseAccount =
			filter === 'home'
				? demoAccounts.alicia
				: filter === 'local'
					? demoAccounts.lynn
					: demoAccounts.theo;

		const id = `generated-${filter}-${page}-${index}`;

		return {
			id,
			uri: `https://${baseAccount.acct.split('@')[1]}/${baseAccount.username}/${id}`,
			url: `https://${baseAccount.acct.split('@')[1]}/${baseAccount.username}/${id}`,
			account: {
				...baseAccount,
				avatar: baseAccount.avatar.replace('96x96', '80x80'),
			},
			content: `<p>${filter.toUpperCase()} timeline batch ${page} · entry ${
				index + 1
			} arrives pre-cached via the Timeline store helper.</p>`,
			createdAt: minutesAgo(page * 12 + index * 3),
			visibility: filter === 'home' ? 'public' : 'unlisted',
			repliesCount: index % 3,
			reblogsCount: index * 2,
			favouritesCount: index * 11,
			mediaAttachments:
				index % 2 === 0
					? [
							{
								id: `${id}-media`,
								type: 'image',
								url: `https://placehold.co/1024x576/0f172a/ffffff?text=${filter}+${page}+${index}`,
								previewUrl: `https://placehold.co/600x338/0f172a/ffffff?text=${filter}+${page}+${index}`,
								description: `${filter} entry ${index + 1}`,
								mediaCategory: 'IMAGE',
							},
						]
					: [],
			mentions: [],
			tags: [
				{
					name: filter,
					url: `https://equalto.social/tags/${filter}`,
				},
			],
		};
	});
}

export function createNotificationSeed(): Notification[] {
	return clone(notificationSeed);
}

export function getDemoProfile(): UnifiedAccount {
	return clone(profileAccount);
}

export function getPinnedStatuses(): Status[] {
	return clone(pinnedStatusRail);
}

export function getProfileMediaGallery(): MediaAttachment[] {
	return clone(profileMediaGallery);
}

export function getProfileConnections(): {
	followers: ProfileConnection[];
	following: ProfileConnection[];
} {
	return {
		followers: clone(connectionPanels.followers),
		following: clone(connectionPanels.following),
	};
}

export function getPrimaryTimelineAccount(): Account {
	return clone(demoAccounts.alicia);
}

export type DemoSearchOptions = MockSearchOptions;

export function runDemoSearch(options: DemoSearchOptions): SearchResults {
	return buildSearchResults(options);
}
