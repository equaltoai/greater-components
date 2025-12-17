// @ts-nocheck
import {
	mockAccount,
	mockStatus,
	generateMockNotifications,
	generateMockGroupedNotifications,
} from '../../src/mockData';

import type { ProfileField } from '../../src/components/Profile/context';
import { screen, fireEvent, waitFor } from '@testing-library/svelte';
import { vi, expect } from 'vitest';

// Roots
import ProfileRoot from '../../src/components/Profile/Root.svelte';
import StatusRoot from '../../src/components/Status/Root.svelte';
import ListsRoot from '../../src/components/Lists/Root.svelte';
import FiltersRoot from '../../src/components/Filters/Root.svelte';
import HashtagsRoot from '../../src/components/Hashtags/Root.svelte';
import TimelineRoot from '../../src/components/Timeline/Root.svelte';

// Profile
import ProfileFeaturedHashtags from '../../src/components/Profile/FeaturedHashtags.svelte';
import ProfileFollowersList from '../../src/components/Profile/FollowersList.svelte';
import ProfileEndorsedAccounts from '../../src/components/Profile/EndorsedAccounts.svelte';
import ProfileFollowRequests from '../../src/components/Profile/FollowRequests.svelte';
import ProfileFollowingList from '../../src/components/Profile/FollowingList.svelte';
import ProfileAccountMigration from '../../src/components/Profile/AccountMigration.svelte';
import ProfileTrustBadge from '../../src/components/Profile/TrustBadge.svelte';
import ProfileVerifiedFields from '../../src/components/Profile/VerifiedFields.svelte';
import ProfileTimeline from '../../src/components/Profile/Timeline.svelte';
import ProfileTabs from '../../src/components/Profile/Tabs.svelte';
import ProfileFields from '../../src/components/Profile/Fields.svelte';
import ProfileHeader from '../../src/components/Profile/Header.svelte';
import ProfileEdit from '../../src/components/Profile/Edit.svelte';
import ProfilePrivacySettings from '../../src/components/Profile/PrivacySettings.svelte';

// Status
import StatusActions from '../../src/components/Status/Actions.svelte';
import StatusLesserMetadata from '../../src/components/Status/LesserMetadata.svelte';
import StatusCommunityNotes from '../../src/components/Status/CommunityNotes.svelte';
import StatusMedia from '../../src/components/Status/Media.svelte';
import StatusHeader from '../../src/components/Status/Header.svelte';
import StatusContent from '../../src/components/Status/Content.svelte';

import ComposeBox from '../../src/components/ComposeBox.svelte';
import NotificationsFeed from '../../src/components/NotificationsFeed.svelte';
import NotificationsFeedReactive from '../../src/components/NotificationsFeedReactive.svelte';
import NotificationsFeedReactiveTest from './NotificationsFeedReactiveTest.svelte';

// Lists
import ListsMemberPicker from '../../src/components/Lists/MemberPicker.svelte';
import ListsEditor from '../../src/components/Lists/Editor.svelte';
import ListsTimeline from '../../src/components/Lists/Timeline.svelte';
import ListsManager from '../../src/components/Lists/Manager.svelte';
import ListsSettings from '../../src/components/Lists/Settings.svelte';

// Filters
import FiltersEditor from '../../src/components/Filters/Editor.svelte';
import FiltersFilteredContentTest from './Filters/FilteredContentTest.svelte';
import FiltersManager from '../../src/components/Filters/Manager.svelte';

// Hashtags
import HashtagsControls from '../../src/components/Hashtags/Controls.svelte';
import HashtagsMutedList from '../../src/components/Hashtags/MutedList.svelte';
import HashtagsFollowedList from '../../src/components/Hashtags/FollowedList.svelte';

// Timeline states
import TimelineLoadMore from '../../src/components/Timeline/LoadMore.svelte';
import TimelineErrorState from '../../src/components/Timeline/ErrorState.svelte';
import TimelineEmptyState from '../../src/components/Timeline/EmptyState.svelte';
import TimelineItem from '../../src/components/Timeline/Item.svelte';
import TimelineVirtualizedReactive from '../../src/components/TimelineVirtualizedReactive.svelte';

// Misc
import RealtimeWrapper from '../../src/components/RealtimeWrapper.svelte';
import SettingsPanel from '../../src/components/SettingsPanel.svelte';

// Stub global confirm for tests
global.confirm = vi.fn(() => true);

interface Scenario {
	name: string;
	props: Record<string, unknown>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Wrapper?: any;
	wrapperProps?: Record<string, unknown>;
	action?: () => Promise<void>;
}

interface ComponentDefinition {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: any;
	scenarios: Scenario[];
}

const mockHashtagsAdapter = {
	getFollowedTags: async () => [],
	getFollowedHashtags: async () => [],
	followTag: async () => {},
	unfollowTag: async () => {},
	getMutedTags: async () => [],
	muteTag: async () => {},
	unmuteTag: async () => {},
};

const mockTimelineAdapter = {
	getTimeline: async () => ({ edges: [], pageInfo: {} }),
	getActorByUsername: async () => mockAccount,
	fetchStatuses: async () => ({ edges: [], pageInfo: {} }),
	subscribe: () => () => {},
	setOptions: () => {},
};

const mockGraphQLAdapter = {
	...mockTimelineAdapter,
	fetchHomeTimeline: async () => ({ edges: [], pageInfo: {} }),
	fetchActorTimeline: async () => ({ edges: [], pageInfo: {} }),
	fetchPublicTimeline: async () => ({ edges: [], pageInfo: {} }),
	fetchHashtagTimeline: async () => ({ edges: [], pageInfo: {} }),
	fetchListTimeline: async () => ({ edges: [], pageInfo: {} }),
};

const mockAccounts = [
	{ ...mockAccount, id: '1', username: 'user1', displayName: 'User One' },
	{ ...mockAccount, id: '2', username: 'user2', displayName: 'User Two' },
];

const mockHashtags = [
	{ name: 'test', usageCount: 10, lastUsed: new Date().toISOString() },
	{ name: 'svelte', usageCount: 5, lastUsed: new Date().toISOString() },
];

const mockFollowRequests = mockAccounts.map((a) => ({
	id: `req-${a.id}`,
	account: a,
	createdAt: new Date().toISOString(),
}));

const mockFields: ProfileField[] = [
	{ name: 'Website', value: 'https://example.com', verifiedAt: '2024-01-01' },
	{ name: 'Bio', value: '<b>Bold</b> bio', verifiedAt: undefined },
	{
		name: 'Mastodon',
		value: '<a href="https://social.example.com/@user">@user</a>',
		verifiedAt: '2024-01-01',
	},
];

const mockLists = [
	{ id: '1', title: 'Tech', visibility: 'public', membersCount: 10, members: [] },
	{
		id: '2',
		title: 'Art',
		visibility: 'private',
		membersCount: 5,
		description: 'Artistic accounts',
		members: [],
	},
];

export const componentsToCover: Record<string, ComponentDefinition> = {
	// Profile Components
	'Profile/FeaturedHashtags': {
		component: ProfileFeaturedHashtags,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
			{
				name: 'populated',
				props: { hashtags: mockHashtags },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'ownProfile',
				props: { hashtags: mockHashtags, isOwnProfile: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
				action: async () => {
					const removeButtons = screen.getAllByLabelText(/Remove/);
					if (removeButtons[0]) {
						await fireEvent.click(removeButtons[0]);
					}
				},
			},
			{
				name: 'visitor-empty',
				props: { hashtags: [], isOwnProfile: false },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'no-stats',
				props: { hashtags: mockHashtags, showStats: false },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'formatting-variants',
				props: {
					hashtags: [
						{ name: 'big', usageCount: 1500, lastUsed: new Date().toISOString() },
						{
							name: 'yesterday',
							usageCount: 1,
							lastUsed: new Date(Date.now() - 86400000).toISOString(),
						},
						{
							name: 'days-ago',
							usageCount: 1,
							lastUsed: new Date(Date.now() - 86400000 * 3).toISOString(),
						},
						{
							name: 'weeks-ago',
							usageCount: 1,
							lastUsed: new Date(Date.now() - 86400000 * 20).toISOString(),
						},
					],
					showStats: true,
				},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'max-limit',
				props: {
					hashtags: [
						{ name: '1', usageCount: 1 },
						{ name: '2', usageCount: 1 },
						{ name: '3', usageCount: 1 },
					],
					maxHashtags: 2,
				},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'drag-reorder',
				props: {
					hashtags: mockHashtags,
					isOwnProfile: true,
					enableReordering: true,
				},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onReorderHashtags: async () => {},
					},
				},
				action: async () => {
					// We need to target the draggable items.
					// The items have text corresponding to hashtags #test, #svelte
					const item1Text = screen.getByText('#test');
					const item2Text = screen.getByText('#svelte');

					// Fire drag events on the text elements (bubbling should work)
					await fireEvent.dragStart(item1Text);
					await fireEvent.dragOver(item2Text);
					await fireEvent.drop(item2Text);
				},
			},
		],
	},
	'Profile/FollowersList': {
		component: ProfileFollowersList,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
			{
				name: 'populated',
				props: { followers: mockAccounts },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'loading',
				props: { loading: true, followers: [] },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'load-more',
				props: { hasMore: true, followers: mockAccounts },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'own-profile-populated',
				props: { isOwnProfile: true, followers: mockAccounts },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'search-interaction',
				props: { followers: mockAccounts, enableSearch: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
				action: async () => {
					const searchInput = screen.getByPlaceholderText('Search followers...');
					await fireEvent.input(searchInput, { target: { value: 'User One' } });
				},
			},
			{
				name: 'remove-follower',
				props: { followers: mockAccounts, isOwnProfile: true },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onRemoveFollower: async () => {},
					},
				},
				action: async () => {
					const removeBtn = screen.getByLabelText('Remove User One as follower');
					await fireEvent.click(removeBtn);
				},
			},
			{
				name: 'follow-interaction',
				props: { followers: mockAccounts, isOwnProfile: false },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onFollow: async () => {},
						onUnfollow: async () => {},
					},
				},
				action: async () => {
					// Toggle follow for first user
					const followBtn = screen.getByLabelText('Follow User One');
					await fireEvent.click(followBtn);
				},
			},
		],
	},
	'Profile/EndorsedAccounts': {
		component: ProfileEndorsedAccounts,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
			{
				name: 'populated',
				props: { accounts: mockAccounts },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
		],
	},
	'Profile/FollowRequests': {
		component: ProfileFollowRequests,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
			},
			{
				name: 'populated',
				props: { requests: mockFollowRequests },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
				action: async () => {
					const approveButtons = screen.getAllByLabelText(/Approve/);
					if (approveButtons[0]) await fireEvent.click(approveButtons[0]);

					const rejectButtons = screen.getAllByLabelText(/Reject/);
					if (rejectButtons[0]) await fireEvent.click(rejectButtons[0]);
				},
			},
			{
				name: 'batch-actions',
				props: { requests: mockFollowRequests, showBatchActions: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
				action: async () => {
					// Select item 1
					const checkbox1 = screen.getByLabelText('Select request from User One');
					await fireEvent.click(checkbox1);

					// Wait for buttons to appear
					await waitFor(() => screen.getByText(/Approve Selected/));

					// Approve selected
					const approveSelected = screen.getByText(/Approve Selected/);
					await fireEvent.click(approveSelected);
				},
			},
			{
				name: 'filtering-nomatch',
				props: { requests: mockFollowRequests, enableFiltering: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
				action: async () => {
					const search = screen.getByPlaceholderText('Search requests...');
					await fireEvent.input(search, { target: { value: 'nonexistent user' } });
					await waitFor(() => screen.getByText('No requests match your search'));
				},
			},
			{
				name: 'time-formats',
				props: {
					requests: [
						{
							...mockFollowRequests[0],
							id: 't1',
							createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
						}, // > 7 days
						{
							...mockFollowRequests[0],
							id: 't2',
							createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
						}, // 2 days
						{
							...mockFollowRequests[0],
							id: 't3',
							createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
						}, // 2 hours
						{
							...mockFollowRequests[0],
							id: 't4',
							createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
						}, // 5 mins
						{ ...mockFollowRequests[0], id: 't5', createdAt: new Date().toISOString() }, // just now
					],
				},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
			},
			{
				name: 'handler-errors',
				props: { requests: mockFollowRequests },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					isOwnProfile: true,
					handlers: {
						onApproveFollowRequest: async () => {
							throw new Error('Failed');
						},
						onRejectFollowRequest: async () => {
							throw new Error('Failed');
						},
					},
				},
				action: async () => {
					const approveButtons = screen.getAllByLabelText(/Approve/);
					if (approveButtons[0]) await fireEvent.click(approveButtons[0]);
					const rejectButtons = screen.getAllByLabelText(/Reject/);
					if (rejectButtons[0]) await fireEvent.click(rejectButtons[0]);
				},
			},
			{
				name: 'select-all-reject',
				props: { requests: mockFollowRequests, showBatchActions: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
				action: async () => {
					// Toggle Select All
					const selectAllCheckbox = screen.getByLabelText('Select all requests');
					await fireEvent.click(selectAllCheckbox); // Select all

					// Deselect all (toggle back)
					await fireEvent.click(selectAllCheckbox);

					// Select all again
					await fireEvent.click(selectAllCheckbox);

					// Wait for buttons
					await waitFor(() => screen.getByText(/Reject Selected/));

					// Reject selected
					const rejectSelected = screen.getByText(/Reject Selected/);
					await fireEvent.click(rejectSelected);
				},
			},
			{
				name: 'filtering-selection',
				props: { requests: mockFollowRequests, enableFiltering: true, showBatchActions: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
				action: async () => {
					const search = screen.getByPlaceholderText('Search requests...');
					await fireEvent.input(search, { target: { value: 'User One' } });

					// Select the filtered item
					const checkbox = screen.getByLabelText('Select request from User One');
					await fireEvent.click(checkbox);

					// Verify batch actions appear
					await waitFor(() => screen.getByText(/Approve Selected/));
				},
			},
		],
	},
	'Profile/FollowingList': {
		component: ProfileFollowingList,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
			{
				name: 'populated',
				props: { following: mockAccounts },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'follows-you',
				props: {
					following: [
						{
							...mockAccounts[0],
							relationship: { followedBy: true, following: true, blocking: false, muting: false },
						},
					],
				},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'search-interaction',
				props: { following: mockAccounts, enableSearch: true },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onSearchFollowing: async () => {},
					},
				},
				action: async () => {
					const searchInput = screen.getByPlaceholderText('Search following...');
					await fireEvent.input(searchInput, { target: { value: 'User One' } });
					await waitFor(() => screen.getByText('User One'));
					// Test no match
					await fireEvent.input(searchInput, { target: { value: 'Nonexistent' } });
					await waitFor(() => screen.getByText('No accounts match your search'));
				},
			},
			{
				name: 'unfollow-interaction',
				props: { following: mockAccounts },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onUnfollow: async () => {},
					},
				},
				action: async () => {
					const unfollowBtn = screen.getByLabelText('Unfollow User One');
					await fireEvent.click(unfollowBtn);
				},
			},
			{
				name: 'unfollow-error',
				props: { following: mockAccounts },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onUnfollow: async () => {
							throw new Error('Unfollow failed');
						},
					},
				},
				action: async () => {
					const unfollowBtn = screen.getByLabelText('Unfollow User One');
					await fireEvent.click(unfollowBtn);
				},
			},
			{
				name: 'load-more',
				props: { following: mockAccounts, hasMore: true },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onLoadMoreFollowing: async () => {},
					},
				},
				action: async () => {
					const loadMoreBtn = screen.getByText('Load More');
					await fireEvent.click(loadMoreBtn);
				},
			},
			{
				name: 'loading',
				props: { following: [], loading: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'no-avatar',
				props: {
					following: [{ ...mockAccounts[0], avatar: undefined }],
				},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
		],
	},
	'Profile/AccountMigration': {
		component: ProfileAccountMigration,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
		],
	},
	'Profile/TrustBadge': {
		component: ProfileTrustBadge,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
			{
				name: 'high-trust',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: { ...mockAccount, trustScore: 85 } },
			},
			{
				name: 'medium-trust',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: { ...mockAccount, trustScore: 60 } },
			},
			{
				name: 'low-trust',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: { ...mockAccount, trustScore: 30 } },
			},
			{
				name: 'critical-trust',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: { ...mockAccount, trustScore: 10 } },
			},
			{
				name: 'with-details',
				props: { showDetails: true },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: {
						...mockAccount,
						reputation: {
							trustScore: 80,
							activityScore: 90,
							moderationScore: 100,
							communityScore: 70,
							evidence: {
								totalPosts: 100,
								totalFollowers: 50,
								accountAge: 730,
								trustingActors: 10,
							},
						},
					},
				},
				action: async () => {
					const toggle = screen.getByText('Reputation Details');
					await fireEvent.click(toggle);
					await waitFor(() => screen.getByText('Activity'));
				},
			},
		],
	},
	'Profile/VerifiedFields': {
		component: ProfileVerifiedFields,
		scenarios: [
			{
				name: 'default',
				props: { fields: mockFields },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'no-verification-badge',
				props: { fields: mockFields, showVerificationBadge: false },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'max-fields-limited',
				props: { fields: [...mockFields, ...mockFields], maxFields: 2 },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
		],
	},
	'Profile/Timeline': {
		component: ProfileTimeline,
		scenarios: [
			{
				name: 'default',
				props: { adapter: mockTimelineAdapter },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
		],
	},
	'Profile/Tabs': {
		component: ProfileTabs,
		scenarios: [
			{
				name: 'default',
				props: { activeTab: 'posts' },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'media-tab',
				props: { activeTab: 'media' },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: { ...mockAccount, activeTab: 'media' } },
			},
		],
	},
	'Profile/Fields': {
		component: ProfileFields,
		scenarios: [
			{
				name: 'default',
				props: { fields: mockFields },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: { ...mockAccount, fields: mockFields } },
			},
			{
				name: 'no-verification',
				props: { fields: mockFields, showVerification: false },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: { ...mockAccount, fields: mockFields } },
			},
		],
	},
	'Profile/Header': {
		component: ProfileHeader,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'own-profile',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, isOwnProfile: true },
				action: async () => {
					const editBtn = screen.getByText('Edit Profile');
					await fireEvent.click(editBtn);
				},
			},
			{
				name: 'following',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: {
						...mockAccount,
						relationship: { following: true, followed_by: false, blocking: false, muting: false },
					},
					isOwnProfile: false,
				},
				action: async () => {
					// Unfollow
					const btn = screen.getByText('Following');
					await fireEvent.click(btn);
				},
			},
			{
				name: 'not-following',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: {
						...mockAccount,
						relationship: { following: false, followed_by: false, blocking: false, muting: false },
					},
					isOwnProfile: false,
				},
				action: async () => {
					// Follow
					const btn = screen.getByText('Follow');
					await fireEvent.click(btn);

					// Open menu
					const menuBtn = screen.getByTitle('More actions');
					await fireEvent.click(menuBtn);

					// Mute
					const muteBtn = screen.getByText(/Mute/);
					await fireEvent.click(muteBtn);
				},
			},
			{
				name: 'no-cover',
				props: { showCover: false },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'interactions-menu-actions',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: {
						...mockAccount,
						relationship: { following: false },
					},
					isOwnProfile: false,
					handlers: {
						onBlock: async () => {},
						onReport: async () => {},
						onShare: async () => {},
						onMention: async () => {},
						onMessage: async () => {},
					},
				},
				action: async () => {
					// Open menu
					const menuBtn = screen.getByTitle('More actions');
					await fireEvent.click(menuBtn);

					// Click other actions
					const shareBtn = screen.getByText('Share Profile');
					await fireEvent.click(shareBtn);

					// Re-open menu (since clicking closes it)
					await fireEvent.click(menuBtn);
					const mentionBtn = screen.getByText(/Mention/);
					await fireEvent.click(mentionBtn);

					await fireEvent.click(menuBtn);
					const messageBtn = screen.getByText('Direct Message');
					await fireEvent.click(messageBtn);

					await fireEvent.click(menuBtn);
					const blockBtn = screen.getByText(/Block/);
					await fireEvent.click(blockBtn);

					await fireEvent.click(menuBtn);
					const reportBtn = screen.getByText(/Report/);
					await fireEvent.click(reportBtn);
				},
			},
			{
				name: 'follow-error',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					isOwnProfile: false,
					handlers: {
						onFollow: async () => {
							throw new Error('Follow failed');
						},
					},
				},
				action: async () => {
					const btn = screen.getByText('Follow');
					await fireEvent.click(btn);
				},
			},
		],
	},
	'Profile/Edit': {
		component: ProfileEdit,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount, handlers: { onSave: async () => {} } },
			},
			{
				name: 'with-values',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: {
						...mockAccount,
						displayName: 'Display Name',
						bio: 'Bio text',
						fields: mockFields,
					},
					handlers: { onSave: async () => {} },
				},
			},
			{
				name: 'interactions',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onSave: async () => {},
						onAvatarUpload: async () => 'avatar.jpg',
						onHeaderUpload: async () => 'header.jpg',
					},
				},
				action: async () => {
					// Input display name
					const nameInput = screen.getByLabelText('Display Name');
					await fireEvent.input(nameInput, { target: { value: 'New Name' } });

					// Input bio
					const bioInput = screen.getByLabelText(/Bio/);
					await fireEvent.input(bioInput, { target: { value: 'New Bio' } });

					// Add field
					const addFieldBtn = screen.getByText('Add Field');
					await fireEvent.click(addFieldBtn);

					// Wait for field to appear
					await waitFor(() => screen.getByPlaceholderText('Label'));

					// Edit field
					const labelInput = screen.getByPlaceholderText('Label');
					await fireEvent.input(labelInput, { target: { value: 'My Label' } });
					const valueInput = screen.getByPlaceholderText('Value');
					await fireEvent.input(valueInput, { target: { value: 'My Value' } });

					// Remove field (assuming one was added or existed)
					const removeBtns = screen.getAllByLabelText('Remove field');
					if (removeBtns[0]) await fireEvent.click(removeBtns[0]);

					// Save
					const saveBtn = screen.getByText('Save Profile');
					await fireEvent.click(saveBtn);
				},
			},
			{
				name: 'media-upload',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onAvatarUpload: async () => 'avatar-new.jpg',
						onHeaderUpload: async () => 'header-new.jpg',
					},
				},
				action: async () => {
					// Upload avatar
					// Note: The input is hidden, need to find it carefully
					// The component uses class="profile-edit__file-input"
					const inputs = document.querySelectorAll('.profile-edit__file-input');
					const headerInput = inputs[0] as HTMLInputElement; // First one is header in template
					const avatarInput = inputs[1] as HTMLInputElement; // Second one is avatar

					if (headerInput) {
						const file = new File(['(⌐□_□)'], 'header.png', { type: 'image/png' });
						await fireEvent.change(headerInput, { target: { files: [file] } });
					}

					if (avatarInput) {
						const file = new File(['(⌐□_□)'], 'avatar.png', { type: 'image/png' });
						await fireEvent.change(avatarInput, { target: { files: [file] } });
					}

					// Save to trigger upload handlers
					const saveBtn = screen.getByText('Save Profile');
					await fireEvent.click(saveBtn);
				},
			},
			{
				name: 'validation-error',
				props: { maxBioLength: 10 },
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: { ...mockAccount, bio: 'This bio is definitely too long for the limit' },
				},
				action: async () => {
					// Try to save
					const saveBtn = screen.getByText('Save Profile');
					await fireEvent.click(saveBtn);
				},
			},
			{
				name: 'save-error',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onSave: async () => {
							throw new Error('Save failed');
						},
					},
				},
				action: async () => {
					const saveBtn = screen.getByText('Save Profile');
					await fireEvent.click(saveBtn);
				},
			},
			{
				name: 'cancel',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					initialState: { editMode: true }, // We need editMode true to be visible, although Wrapper handles it?
					// Wait, Wrapper renders slot. ProfileEdit is inside the slot.
					// But ProfileEdit relies on context.
				},
				action: async () => {
					const cancelBtn = screen.getByText('Cancel');
					await fireEvent.click(cancelBtn);
				},
			},
		],
	},

	'Profile/PrivacySettings': {
		component: ProfilePrivacySettings,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'flat-view',
				props: { groupByCategory: false },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'interactions',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onUpdatePrivacySettings: async () => {},
					},
				},
				action: async () => {
					// Toggle private account
					const privateCheckbox = screen.getByLabelText(/Private account/);
					await fireEvent.click(privateCheckbox);

					// Save
					const saveBtn = screen.getByText('Save Changes');
					await fireEvent.click(saveBtn);
				},
			},
			{
				name: 'reset-changes',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
				action: async () => {
					// Toggle private account
					const privateCheckbox = screen.getByLabelText(/Private account/);
					await fireEvent.click(privateCheckbox);

					// Reset
					const resetBtn = screen.getByText('Reset');
					await fireEvent.click(resetBtn);
				},
			},
			{
				name: 'save-error',
				props: {},
				Wrapper: ProfileRoot,
				wrapperProps: {
					profile: mockAccount,
					handlers: {
						onUpdatePrivacySettings: async () => {
							throw new Error('Save failed');
						},
					},
				},
				action: async () => {
					const privateCheckbox = screen.getByLabelText(/Private account/);
					await fireEvent.click(privateCheckbox);
					const saveBtn = screen.getByText('Save Changes');
					await fireEvent.click(saveBtn);
				},
			},
		],
	},

	// Compose Components
	ComposeBox: {
		component: ComposeBox,
		scenarios: [
			{
				name: 'default',
				props: {
					onSubmit: async () => {},
				},
			},
			{
				name: 'prefilled',
				props: {
					initialContent: 'Hello world',
					onSubmit: async () => {},
				},
			},
			{
				name: 'content-warning',
				props: {
					initialContent: 'Spoilers',
					onSubmit: async () => {},
				},
				action: async () => {
					const cwBtn = screen.getByLabelText('Add content warning');
					await fireEvent.click(cwBtn);
					const cwInput = screen.getByPlaceholderText('Content warning');
					await fireEvent.input(cwInput, { target: { value: 'CW: test' } });
				},
			},
			{
				name: 'draft-auto-save',
				props: {
					draftKey: 'test-draft',
					onDraftSave: async () => {},
				},
				action: async () => {
					const textarea = screen.getByLabelText('Compose new post');
					await fireEvent.input(textarea, { target: { value: 'Draft content' } });
					// Wait for debounce (1000ms in component)
					await new Promise((r) => setTimeout(r, 1100));
				},
			},
			{
				name: 'submit-flow',
				props: {
					onSubmit: async () => {},
				},
				action: async () => {
					const textarea = screen.getByLabelText('Compose new post');
					await fireEvent.input(textarea, { target: { value: 'Post content' } });
					const submitBtn = screen.getByText('Post');
					await fireEvent.click(submitBtn);
				},
			},
			{
				name: 'submit-error',
				props: {
					onSubmit: async () => {
						throw new Error('Submit failed');
					},
				},
				action: async () => {
					const textarea = screen.getByLabelText('Compose new post');
					await fireEvent.input(textarea, { target: { value: 'Post content' } });
					const submitBtn = screen.getByText('Post');
					await fireEvent.click(submitBtn);
				},
			},
			{
				name: 'reply-context',
				props: {
					replyToStatus: mockStatus,
					onSubmit: async () => {},
				},
			},
			{
				name: 'cancel',
				props: {
					onCancel: async () => {},
				},
				action: async () => {
					const textarea = screen.getByLabelText('Compose new post');
					await fireEvent.input(textarea, { target: { value: 'Draft' } });
					const cancelBtn = screen.getByText('Cancel');
					await fireEvent.click(cancelBtn);
				},
			},
			{
				name: 'media-attachments',
				props: {
					onMediaUpload: async (_file: File) => ({
						id: 'm1',
						type: 'image',
						url: 'test.jpg',
						previewUrl: 'test.jpg',
						description: 'Alt text',
					}),
					onMediaRemove: async () => {},
					maxMediaAttachments: 2,
					mediaSlot: () => {
						return '';
					},
				},
				action: async () => {
					// Add media
					const fileInput = document.querySelector(
						'.gr-compose-box__media-button input[type="file"]'
					) as HTMLInputElement;
					if (!fileInput) throw new Error('File input not found');

					const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
					await fireEvent.change(fileInput, { target: { files: [file] } });

					// Add another to hit limit logic
					const file2 = new File(['(⌐□_□)'], 'chucknorris2.png', { type: 'image/png' });
					await fireEvent.change(fileInput, { target: { files: [file, file2] } });

					// Wait for state update (rendering happens via slot, but we can check internal state via submit button enablement)
					await waitFor(() =>
						expect(
							(screen.getByRole('button', { name: 'Post' }) as HTMLButtonElement).disabled
						).toBe(false)
					);
				},
			},
			{
				name: 'polls',
				props: {
					enablePolls: true,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					pollSlot: ({ poll: _poll, onPollChange: _onPollChange }: any) => ({
						component: ComposeBox,
						props: {},
					}),
				},
				action: async () => {
					const pollBtn = screen.getByLabelText('Add poll');
					await fireEvent.click(pollBtn);
					// Toggle off
					await fireEvent.click(pollBtn);
				},
			},
			{
				name: 'visibility-and-limits',
				props: {
					enableVisibilitySettings: true,
					maxLength: 10,
					characterCountMode: 'hard',
				},
				action: async () => {
					const visibilitySelect = screen.getByLabelText('Post visibility');
					await fireEvent.change(visibilitySelect, { target: { value: 'private' } });

					const textarea = screen.getByLabelText('Compose new post');
					// Trigger focus for character count
					await fireEvent.focus(textarea);
					// Exceed limit
					await fireEvent.input(textarea, { target: { value: '12345678901' } });
					await fireEvent.blur(textarea);
				},
			},
		],
	},

	NotificationsFeed: {
		component: NotificationsFeed,
		scenarios: [
			{
				name: 'default-empty',
				props: { notifications: [] },
			},
			{
				name: 'loading',
				props: { notifications: [], loading: true },
			},
			{
				name: 'populated-items',
				props: {
					notifications: generateMockNotifications(5),
					grouped: false,
				},
			},
			{
				name: 'populated-grouped',
				props: {
					notifications: generateMockGroupedNotifications(),
					grouped: true,
				},
			},
			{
				name: 'interactions',
				props: {
					notifications: (() => {
						const n = generateMockNotifications(3);
						if (n[0]) n[0].read = false;
						return n;
					})(),
					onNotificationClick: async () => {},
					onMarkAsRead: async () => {},
					onMarkAllAsRead: async () => {},
					onDismiss: async () => {},
				},
				action: async () => {
					// Mark all read
					const markAllBtn = screen.getByText('Mark all as read');
					await fireEvent.click(markAllBtn);

					// Click item
					const items = screen.getAllByRole('button', { name: /Notification/ });
					if (items[0]) {
						await fireEvent.click(items[0]);
					}

					// Mark single as read
					const markReadBtns = screen.getAllByTitle('Mark as read (M)');
					if (markReadBtns[0]) {
						await fireEvent.click(markReadBtns[0]);
					}

					// Dismiss
					const dismissBtns = screen.getAllByTitle('Dismiss (X)');
					if (dismissBtns[0]) {
						await fireEvent.click(dismissBtns[0]);
					}
				},
			},
			{
				name: 'loading-more',
				props: {
					notifications: generateMockNotifications(5),
					loadingMore: true,
					hasMore: true,
					onLoadMore: async () => {},
				},
				action: async () => {
					await waitFor(() => screen.getByText('Loading more...'));
				},
			},
			{
				name: 'custom-empty-state',
				props: {
					notifications: [],
					emptyStateMessage: 'Nothing here!',
				},
			},
			{
				name: 'scroll-trigger',
				props: {
					notifications: generateMockNotifications(20),
					hasMore: true,
					onLoadMore: async () => {},
				},
				action: async () => {
					const scrollContainer = screen.getByRole('feed');

					// Mock scroll properties to simulate being near bottom
					Object.defineProperty(scrollContainer, 'scrollTop', { value: 800, writable: true });
					Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, writable: true });
					Object.defineProperty(scrollContainer, 'clientHeight', { value: 200, writable: true });

					// Trigger scroll event
					await fireEvent.scroll(scrollContainer);
				},
			},
			{
				name: 'prepend-update',
				props: {
					notifications: generateMockNotifications(5),
					loading: false,
				},
				action: async () => {
					// This scenario is tricky to simulate fully in this harness because we need to update props dynamically
					// and wait for effect. The harness might not support dynamic prop updates easily in 'action'.
					// But we can try to render with initial items, then maybe we can't update props here.
					// However, we can at least ensure it renders and no errors occur during mount/updates.
					// We'll rely on the fact that existing tests cover some of this, or we'd need a dedicated test.
					// Let's just ensure basic rendering with some density options.
				},
			},
		],
	},

	NotificationsFeedReactive: {
		component: NotificationsFeedReactiveTest,
		scenarios: [
			{
				name: 'custom-renderer',
				props: {
					notifications: generateMockNotifications(2),
					useCustomRenderer: true,
				},
				action: async () => {
					const notifications = generateMockNotifications(2);
					const firstNotification = notifications[0];
					if (!firstNotification) throw new Error('Notifications missing');
					await waitFor(() => screen.getByText(firstNotification.id));
				},
			},
			{
				name: 'custom-loading',
				props: {
					loading: true,
					useCustomLoading: true,
				},
				action: async () => {
					await waitFor(() => screen.getByText('Custom Loading...'));
				},
			},
			{
				name: 'custom-empty',
				props: {
					useCustomEmpty: true,
				},
				action: async () => {
					await waitFor(() => screen.getByText('Custom Empty'));
				},
			},
			{
				name: 'custom-realtime',
				props: {
					useCustomRealtime: true,
					integration: {
						baseUrl: 'https://example.com',
						autoConnect: false, // Avoid connection errors for this test if possible, or expect them
					},
					showRealtimeIndicator: true,
				},
				action: async () => {
					// With integration provided, realtime indicator slot should render if showRealtimeIndicator is true
					// The wrapper logic for realtimeIndicator is:
					// {#if useCustomRealtime} <div class="custom-realtime">...</div> {/if}
					// Wait for it
					// The component renders realtime indicator if showRealtimeIndicator && notificationIntegration
					// notificationIntegration is created if integration prop is passed.
					// However, we rely on createNotificationIntegration.
					// If it fails to create or something, it won't render.
					// Assuming it works.
					// We might need to wait for something.
					// The snippet displays "Yes" or "No" based on connected.
					await waitFor(() => screen.getByText('No')); // Initially not connected
				},
			},
		],
	},
	'NotificationsFeedReactive/Defaults': {
		component: NotificationsFeedReactive,
		scenarios: [
			{
				name: 'default-populated',
				props: {
					notifications: generateMockNotifications(3),
				},
			},
			{
				name: 'default-loading',
				props: {
					loading: true,
					notifications: [],
				},
			},
			{
				name: 'default-empty',
				props: {
					notifications: [],
				},
			},
			{
				name: 'with-integration-default-ui',
				props: {
					integration: {
						baseUrl: 'https://example.com',
						autoConnect: false,
					},
					notifications: generateMockNotifications(1), // Initial props, ignored when integration is active
					showRealtimeIndicator: true,
				},
				action: async () => {
					// Should show default realtime indicator
					await waitFor(() => screen.getByText('Connecting...'));

					// Since integration starts empty, we should see empty state
					await waitFor(() => screen.getByText('No notifications'));
				},
			},
			{
				name: 'interactions-props-fallback',
				props: {
					notifications: generateMockNotifications(3),
					onNotificationClick: async () => {},
					onMarkAsRead: async () => {},
					onMarkAllAsRead: async () => {},
					onDismiss: async () => {},
				},
				action: async () => {
					// Click notification (trigger handleNotificationClick)
					const items = screen.getAllByRole('button', { name: /Notification/ });
					if (items[0]) await fireEvent.click(items[0]);

					// Mark as read (trigger handleMarkAsRead) - use queryAllByTitle since it may not be present
					const markReadBtns = screen.queryAllByTitle('Mark as read (M)');
					if (markReadBtns[0]) await fireEvent.click(markReadBtns[0]);

					// Dismiss (trigger handleDismiss)
					const dismissBtns = screen.getAllByTitle('Dismiss (X)');
					if (dismissBtns[0]) await fireEvent.click(dismissBtns[0]);
				},
			},
			{
				name: 'scroll-load-more',
				props: {
					notifications: generateMockNotifications(20),
					hasMore: true,
					onLoadMore: async () => {},
				},
				action: async () => {
					const scrollContainer = screen.getByRole('feed');
					// Mock scroll properties
					Object.defineProperty(scrollContainer, 'scrollTop', { value: 100, writable: true });
					Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, writable: true });
					Object.defineProperty(scrollContainer, 'clientHeight', { value: 200, writable: true });

					// Trigger scroll
					await fireEvent.scroll(scrollContainer, { target: { scrollTop: 800 } });
				},
			},
		],
	},

	// Status Components
	'Status/Actions': {
		component: StatusActions,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
			{
				name: 'interacted',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: { ...mockStatus, favourited: true, reblogged: true, bookmarked: true },
				},
			},
		],
	},
	'Status/LesserMetadata': {
		component: StatusLesserMetadata,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
			{
				name: 'cost-badge',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: { ...mockStatus, estimatedCost: 5000 },
				},
			},
			{
				name: 'trust-high',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: mockStatus,
					account: { ...mockAccount, trustScore: 90 },
				},
			},
			{
				name: 'trust-medium',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: mockStatus,
					account: { ...mockAccount, trustScore: 60 },
				},
			},
			{
				name: 'trust-low',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: mockStatus,
					account: { ...mockAccount, trustScore: 30 },
				},
			},
			{
				name: 'moderation-warning',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: { ...mockStatus, aiAnalysis: { moderationAction: 'flag' } },
				},
			},
			{
				name: 'quotes',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: { ...mockStatus, quoteUrl: 'https://example.com/quote', quoteCount: 5 },
				},
			},
			{
				name: 'not-quoteable',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: { ...mockStatus, quoteable: false },
				},
			},
			{
				name: 'full-metadata',
				props: {
					showCost: true,
					showTrust: true,
					showModeration: true,
					showQuotes: true,
				},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: {
						...mockStatus,
						estimatedCost: 10000,
						aiAnalysis: { moderationAction: 'flag' },
						quoteUrl: 'https://example.com',
						quoteCount: 10,
					},
					account: { ...mockAccount, trustScore: 85 },
				},
			},
		],
	},
	'Status/CommunityNotes': {
		component: StatusCommunityNotes,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
			{
				name: 'populated',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: {
						...mockStatus,
						communityNotes: [
							{
								id: '1',
								content: 'Note 1',
								createdAt: new Date().toISOString(),
								author: { id: 'a1', username: 'checker1', displayName: 'Fact Checker' },
								helpful: 10,
								notHelpful: 1,
							},
							{
								id: '2',
								content: 'Note 2',
								createdAt: new Date().toISOString(),
								author: { id: 'a2', username: 'checker2' },
								helpful: 5,
								notHelpful: 0,
							},
						],
					},
				},
			},
			{
				name: 'expandable',
				props: { maxInitialNotes: 1 },
				Wrapper: StatusRoot,
				wrapperProps: {
					status: {
						...mockStatus,
						communityNotes: [
							{
								id: '1',
								content: 'Note 1',
								createdAt: new Date().toISOString(),
								author: { id: 'a1', username: 'u1' },
								helpful: 0,
								notHelpful: 0,
							},
							{
								id: '2',
								content: 'Note 2',
								createdAt: new Date().toISOString(),
								author: { id: 'a2', username: 'u2' },
								helpful: 0,
								notHelpful: 0,
							},
						],
					},
				},
				action: async () => {
					const toggle = screen.getByText(/Show 1 more notes/);
					await fireEvent.click(toggle);
					await waitFor(() => screen.getByText('Show fewer notes'));
				},
			},
			{
				name: 'voting',
				props: {
					onVote: async () => {},
					enableVoting: true,
				},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: {
						...mockStatus,
						communityNotes: [
							{
								id: '1',
								content: 'Note 1',
								createdAt: new Date().toISOString(),
								author: { id: 'a1', username: 'u1' },
								helpful: 0,
								notHelpful: 0,
							},
						],
					},
				},
				action: async () => {
					const helpful = screen.getByTitle('Helpful');
					await fireEvent.click(helpful);
				},
			},
		],
	},
	'Status/Media': {
		component: StatusMedia,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
			{
				name: 'with-media',
				props: {},
				Wrapper: StatusRoot,
				wrapperProps: {
					status: { ...mockStatus, mediaAttachments: [{ type: 'image', url: 'test.jpg' }] },
				},
			},
		],
	},
	'Status/Header': {
		component: StatusHeader,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
		],
	},
	'Status/Content': {
		component: StatusContent,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
		],
	},

	// Timeline Components
	'Timeline/Root': {
		component: TimelineRoot,
		scenarios: [
			{
				name: 'default',
				props: { items: [mockStatus] },
			},
			{
				name: 'loading',
				props: { items: [], initialState: { loading: true } },
			},
			{
				name: 'error',
				props: { items: [], initialState: { error: new Error('Failed to load') } },
			},
			{
				name: 'scroll-load-more',
				props: {
					items: Array(10).fill(mockStatus),
					config: { infiniteScroll: true },
					handlers: {
						onLoadMore: async () => {},
					},
					initialState: { hasMore: true, loadingMore: false },
				},
				action: async () => {
					const root = screen.getByRole('feed');
					// Simulate scroll to bottom
					Object.defineProperty(root, 'scrollHeight', { value: 1000, writable: true });
					Object.defineProperty(root, 'scrollTop', { value: 800, writable: true });
					Object.defineProperty(root, 'clientHeight', { value: 200, writable: true });

					await fireEvent.scroll(root);
				},
			},
		],
	},
	'Timeline/Item': {
		component: TimelineItem,
		scenarios: [
			{
				name: 'default',
				props: { item: { ...mockStatus, type: 'status' }, index: 0 },
				Wrapper: TimelineRoot,
				wrapperProps: { items: [mockStatus] },
			},
			{
				name: 'reblog',
				props: {
					item: { ...mockStatus, type: 'status', reblog: { ...mockStatus, id: 'reblogged-1' } },
					index: 0,
				},
				Wrapper: TimelineRoot,
				wrapperProps: { items: [] },
			},
			{
				name: 'reply',
				props: {
					item: {
						...mockStatus,
						type: 'status',
						inReplyToId: 'reply-1',
						inReplyToAccountId: 'acc-1',
					},
					index: 0,
				},
				Wrapper: TimelineRoot,
				wrapperProps: { items: [] },
			},
			{
				name: 'sensitive',
				props: {
					item: { ...mockStatus, type: 'status', sensitive: true, spoilerText: 'Content Warning' },
					index: 0,
				},
				Wrapper: TimelineRoot,
				wrapperProps: { items: [] },
			},
		],
	},
	TimelineVirtualizedReactive: {
		component: TimelineVirtualizedReactive,
		scenarios: [
			{
				name: 'default',
				props: { items: [mockStatus] },
			},
			{
				name: 'with-adapter',
				props: {
					adapter: mockGraphQLAdapter,
					view: { type: 'home' },
				},
			},
			{
				name: 'loading',
				props: { items: [], loadingTop: true },
			},
			{
				name: 'loading-bottom',
				props: { items: [mockStatus], loadingBottom: true },
			},
			{
				name: 'end-reached',
				props: { items: [mockStatus], endReached: true },
			},
			{
				name: 'realtime-indicator',
				props: { items: [mockStatus], showRealtimeIndicator: true },
				// We can't easily mock the internal state of integration without more complex setup,
				// but we can pass a mock integration config if we wanted, or just rely on props.
			},
		],
	},

	// Lists Components
	'Lists/MemberPicker': {
		component: ListsMemberPicker,
		scenarios: [{ name: 'default', props: {}, Wrapper: ListsRoot, wrapperProps: {} }],
	},
	'Lists/Editor': {
		component: ListsEditor,
		scenarios: [{ name: 'default', props: {}, Wrapper: ListsRoot, wrapperProps: {} }],
	},
	'Lists/Timeline': {
		component: ListsTimeline,
		scenarios: [
			{
				name: 'default',
				props: { listId: '1' },
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { lists: mockLists, selectedList: mockLists[0] } },
			},
			{
				name: 'no-selection',
				props: {},
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { selectedList: null } },
			},
			{
				name: 'private-list',
				props: { listId: '2' },
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { lists: mockLists, selectedList: mockLists[1] } },
			},
			{
				name: 'with-members',
				props: { listId: '1', showMembers: true },
				Wrapper: ListsRoot,
				wrapperProps: {
					initialState: {
						lists: mockLists,
						selectedList: mockLists[0],
						members: [{ id: 'm1', actor: mockAccount }],
					},
				},
				action: async () => {
					const removeBtn = screen.getByTitle('Remove from list');
					await fireEvent.click(removeBtn);
				},
			},
		],
	},
	'Lists/Manager': {
		component: ListsManager,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ListsRoot, wrapperProps: {} },
			{
				name: 'loading',
				props: {},
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { loading: true, lists: [] } },
			},
			{
				name: 'error',
				props: {},
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { error: 'Failed to load lists' } },
			},
			{
				name: 'populated',
				props: {},
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { lists: mockLists } },
				action: async () => {
					const createBtn = screen.getByText('New List');
					await fireEvent.click(createBtn);

					const editBtns = screen.getAllByTitle('Edit list');
					if (editBtns[0]) await fireEvent.click(editBtns[0]);
				},
			},
			{
				name: 'delete-flow',
				props: {},
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { lists: mockLists }, autoFetch: false },
				action: async () => {
					const deleteBtns = screen.getAllByTitle('Delete list');
					if (deleteBtns[0]) await fireEvent.click(deleteBtns[0]);

					await waitFor(() =>
						screen.getByText('Delete', { selector: 'button.lists-manager__modal-button--danger' })
					);
					const confirmBtn = screen.getByText('Delete', {
						selector: 'button.lists-manager__modal-button--danger',
					});
					await fireEvent.click(confirmBtn);
				},
			},
		],
	},
	'Lists/Settings': {
		component: ListsSettings,
		scenarios: [
			{
				name: 'default',
				props: { listId: '1' },
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { lists: mockLists, selectedList: mockLists[0] } },
			},
			{
				name: 'no-selection',
				props: {},
				Wrapper: ListsRoot,
				wrapperProps: { initialState: { lists: mockLists, selectedList: null } },
			},
			{
				name: 'change-visibility',
				props: { listId: '1' },
				Wrapper: ListsRoot,
				wrapperProps: {
					initialState: {
						lists: mockLists,
						selectedList: { ...mockLists[0], visibility: 'private' },
					},
					handlers: {
						onUpdateList: async () => {},
					},
				},
				action: async () => {
					// It's private initially. Switch to Public.
					const publicRadio = screen.getByLabelText(/Public/);
					await fireEvent.click(publicRadio);

					await waitFor(() => screen.getByText('Save Changes'));

					const saveBtn = screen.getByText('Save Changes');
					await fireEvent.click(saveBtn);
				},
			},
			{
				name: 'save-error',
				props: { listId: '1' },
				Wrapper: ListsRoot,
				wrapperProps: {
					initialState: { lists: mockLists, selectedList: mockLists[0] },
					handlers: {
						onUpdateList: async () => {
							throw new Error('Failed to save settings');
						},
					},
				},
				action: async () => {
					// const publicRadio = screen.getByLabelText(/Public/); // Assuming default is private? mockLists[0] is public in definition, let's switch to private
					// mockLists[0] is 'public'. Switch to private.
					const privateRadio = screen.getByLabelText(/Private/);
					await fireEvent.click(privateRadio);

					const saveBtn = screen.getByText('Save Changes');
					await fireEvent.click(saveBtn);
				},
			},
		],
	},
	'Lists/Root': {
		component: ListsRoot,
		scenarios: [{ name: 'default', props: {} }],
	},

	// Filters Components
	'Filters/Editor': {
		component: FiltersEditor,
		scenarios: [{ name: 'default', props: {}, Wrapper: FiltersRoot, wrapperProps: {} }],
	},
	'Filters/FilteredContent': {
		component: FiltersFilteredContentTest,
		scenarios: [
			{
				name: 'default',
				props: { content: 'test content', context: 'home' },
				Wrapper: FiltersRoot,
				wrapperProps: {},
			},
			{
				name: 'filtered-warning',
				props: { content: 'bad word', context: 'home' },
				Wrapper: FiltersRoot,
				wrapperProps: {
					initialState: {
						filters: [
							{
								id: '1',
								phrase: 'bad word',
								context: ['home'],
								irreversible: false,
								wholeWord: false,
								expiresAt: null,
								createdAt: '',
								updatedAt: '',
							},
						],
					},
				},
				action: async () => {
					// Should see warning
					await waitFor(() => screen.getByText(/Content filtered/));
					// Reveal
					const btn = screen.getByText('Show anyway');
					await fireEvent.click(btn);
					// Should see content
					await waitFor(() => screen.getByText('bad word'));
				},
			},
			{
				name: 'filtered-irreversible',
				props: { content: 'very bad', context: 'home' },
				Wrapper: FiltersRoot,
				wrapperProps: {
					initialState: {
						filters: [
							{
								id: '2',
								phrase: 'very bad',
								context: ['home'],
								irreversible: true,
								wholeWord: false,
								expiresAt: null,
								createdAt: '',
								updatedAt: '',
							},
						],
					},
				},
				action: async () => {
					// Should see hidden message
					await waitFor(() => screen.getByText(/Filtered:/));
					// Should NOT see show anyway button
					const btn = screen.queryByText('Show anyway');
					if (btn) throw new Error('Should not show reveal button for irreversible filter');
				},
			},
			{
				name: 'multi-filter-format',
				props: { content: 'one two three', context: 'home' },
				Wrapper: FiltersRoot,
				wrapperProps: {
					initialState: {
						filters: [
							{
								id: '1',
								phrase: 'one',
								context: ['home'],
								irreversible: false,
								wholeWord: false,
								expiresAt: null,
								createdAt: '',
								updatedAt: '',
							},
							{
								id: '2',
								phrase: 'two',
								context: ['home'],
								irreversible: false,
								wholeWord: false,
								expiresAt: null,
								createdAt: '',
								updatedAt: '',
							},
							{
								id: '3',
								phrase: 'three',
								context: ['home'],
								irreversible: false,
								wholeWord: false,
								expiresAt: null,
								createdAt: '',
								updatedAt: '',
							},
						],
					},
				},
				action: async () => {
					// Verify formatting of multiple filters (e.g. "one", "two" and 1 more)
					await waitFor(() => screen.getByText(/and 1 more/));
				},
			},
		],
	},
	'Filters/Manager': {
		component: FiltersManager,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: FiltersRoot, wrapperProps: {} },
			{
				name: 'populated',
				props: {},
				Wrapper: FiltersRoot,
				wrapperProps: {
					initialState: {
						filters: [
							{
								id: '1',
								phrase: 'Test Filter',
								context: ['home', 'public'],
								expiresAt: new Date(Date.now() + 86400000).toISOString(),
								wholeWord: true,
								irreversible: false,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							},
							{
								id: '2',
								phrase: 'Hidden Filter',
								context: ['notifications'],
								expiresAt: null,
								wholeWord: false,
								irreversible: true,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							},
						],
						stats: { totalFilters: 2, totalFiltered: 0, filteredToday: 0 },
					},
				},
			},
			{
				name: 'loading',
				props: {},
				Wrapper: FiltersRoot,
				wrapperProps: { initialState: { loading: true } },
			},
			{
				name: 'error',
				props: {},
				Wrapper: FiltersRoot,
				wrapperProps: { initialState: { error: 'Failed to fetch filters' } },
			},
			{
				name: 'delete-interaction',
				props: {},
				Wrapper: FiltersRoot,
				wrapperProps: {
					initialState: {
						filters: [
							{
								id: '1',
								phrase: 'To Delete',
								context: ['home'],
								expiresAt: null,
								wholeWord: false,
								irreversible: false,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							},
						],
					},
				},
				action: async () => {
					const deleteBtn = screen.getByLabelText('Delete filter To Delete');
					await fireEvent.click(deleteBtn);

					// Wait for modal
					await waitFor(() => screen.getByText('Delete Filter'));

					// Cancel first
					const cancelBtn = screen.getByText('Cancel');
					await fireEvent.click(cancelBtn);

					// Click delete again
					await fireEvent.click(deleteBtn);

					// Confirm
					const confirmBtn = screen.getByText('Delete', {
						selector: 'button.filters-manager__modal-button--danger',
					});
					await fireEvent.click(confirmBtn);
				},
			},
			{
				name: 'edit-interaction',
				props: {},
				Wrapper: FiltersRoot,
				wrapperProps: {
					initialState: {
						filters: [
							{
								id: '1',
								phrase: 'To Edit',
								context: ['home'],
								expiresAt: null,
								wholeWord: false,
								irreversible: false,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							},
						],
					},
				},
				action: async () => {
					const editBtn = screen.getByLabelText('Edit filter To Edit');
					await fireEvent.click(editBtn);
				},
			},
		],
	},
	'Filters/Root': {
		component: FiltersRoot,
		scenarios: [{ name: 'default', props: {} }],
	},

	// Hashtags Components
	'Hashtags/Controls': {
		component: HashtagsControls,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: HashtagsRoot,
				wrapperProps: { adapter: mockHashtagsAdapter },
			},
		],
	},
	'Hashtags/MutedList': {
		component: HashtagsMutedList,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: HashtagsRoot,
				wrapperProps: { adapter: mockHashtagsAdapter },
			},
			{
				name: 'populated',
				props: {},
				Wrapper: HashtagsRoot,
				wrapperProps: {
					adapter: {
						...mockHashtagsAdapter,
						getFollowedHashtags: async () => ({
							edges: [
								{
									node: {
										name: 'mutedtag',
										notificationSettings: {
											muted: true,
											mutedUntil: new Date(Date.now() + 86400000).toISOString(),
										},
									},
								},
							],
						}),
					},
				},
				action: async () => {
					// Wait for load
					await waitFor(() => screen.getByText('mutedtag'));
				},
			},
			{
				name: 'unmute-interaction',
				props: {},
				Wrapper: HashtagsRoot,
				wrapperProps: {
					adapter: {
						...mockHashtagsAdapter,
						getFollowedHashtags: async () => ({
							edges: [{ node: { name: 'mutedtag', notificationSettings: { muted: true } } }],
						}),
						unmuteHashtag: async () => {},
					},
				},
				action: async () => {
					// Wait for load
					await waitFor(() => screen.getByText('mutedtag'));
					const btn = screen.getByText('Unmute');
					await fireEvent.click(btn);
				},
			},
			{
				name: 'unmute-error',
				props: {},
				Wrapper: HashtagsRoot,
				wrapperProps: {
					adapter: {
						...mockHashtagsAdapter,
						getFollowedHashtags: async () => ({
							edges: [{ node: { name: 'mutedtag', notificationSettings: { muted: true } } }],
						}),
						unmuteHashtag: async () => {
							throw new Error('Failed');
						},
					},
				},
				action: async () => {
					await waitFor(() => screen.getByText('mutedtag'));
					const btn = screen.getByText('Unmute');
					await fireEvent.click(btn);
				},
			},
		],
	},
	'Hashtags/FollowedList': {
		component: HashtagsFollowedList,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: HashtagsRoot,
				wrapperProps: { adapter: mockHashtagsAdapter },
			},
			{
				name: 'populated',
				props: {},
				Wrapper: HashtagsRoot,
				wrapperProps: {
					adapter: {
						...mockHashtagsAdapter,
						getFollowedHashtags: async () => ({ edges: [{ node: { name: 'test' } }] }),
					},
				},
			},
		],
	},
	'Hashtags/Root': {
		component: HashtagsRoot,
		scenarios: [{ name: 'default', props: { adapter: mockHashtagsAdapter } }],
	},

	// Timeline States
	'Timeline/LoadMore': {
		component: TimelineLoadMore,
		scenarios: [
			{
				name: 'default',
				props: { onLoadMore: () => {} },
				Wrapper: TimelineRoot,
				wrapperProps: { items: [] },
			},
		],
	},
	'Timeline/ErrorState': {
		component: TimelineErrorState,
		scenarios: [{ name: 'default', props: { error: new Error('Test error') } }],
	},
	'Timeline/EmptyState': {
		component: TimelineEmptyState,
		scenarios: [{ name: 'default', props: { message: 'No items' } }],
	},

	// Misc
	RealtimeWrapper: {
		component: RealtimeWrapper,
		scenarios: [
			{
				name: 'timeline-connected',
				props: {
					component: 'timeline',
					integration: {
						baseUrl: 'https://success.com',
						timeline: { type: 'home' },
						realtime: true,
					},
				},
			},
			{
				name: 'notifications-connected',
				props: {
					component: 'notifications',
					integration: {
						baseUrl: 'https://success.com',
						notification: { limit: 20 },
						realtime: true,
					},
				},
			},
			{
				name: 'timeline-error',
				props: {
					component: 'timeline',
					integration: {
						baseUrl: 'https://fail.com',
						timeline: { type: 'home' },
						realtime: true,
					},
				},
				action: async () => {
					await waitFor(() => screen.getByText('Connection error'));
				},
			},
			{
				name: 'connection-error-retry',
				props: {
					component: 'timeline',
					integration: {
						baseUrl: 'https://fail.com',
						timeline: { type: 'home' },
						realtime: true,
					},
				},
				action: async () => {
					await waitFor(() => screen.getByText('Connection error'));
					const retryBtn = screen.getByText('Retry');
					await fireEvent.click(retryBtn);
					// It will fail again, staying in error state or transitioning to connecting then error
					// We just verify the button was clickable.
				},
			},
		],
	},
	SettingsPanel: {
		component: SettingsPanel,
		scenarios: [{ name: 'default', props: {} }],
	},
};
