import { mockAccount, mockStatus } from '../../src/mockData';
import type { ComponentType } from 'svelte';

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

// Status
import StatusActions from '../../src/components/Status/Actions.svelte';
import StatusLesserMetadata from '../../src/components/Status/LesserMetadata.svelte';
import StatusCommunityNotes from '../../src/components/Status/CommunityNotes.svelte';
import StatusMedia from '../../src/components/Status/Media.svelte';
import StatusHeader from '../../src/components/Status/Header.svelte';
import StatusContent from '../../src/components/Status/Content.svelte';

// Lists
import ListsMemberPicker from '../../src/components/Lists/MemberPicker.svelte';
import ListsEditor from '../../src/components/Lists/Editor.svelte';
import ListsTimeline from '../../src/components/Lists/Timeline.svelte';
import ListsManager from '../../src/components/Lists/Manager.svelte';
import ListsSettings from '../../src/components/Lists/Settings.svelte';
import ListsRoot from '../../src/components/Lists/Root.svelte';

// Filters
import FiltersEditor from '../../src/components/Filters/Editor.svelte';
import FiltersFilteredContent from '../../src/components/Filters/FilteredContent.svelte';
import FiltersManager from '../../src/components/Filters/Manager.svelte';
import FiltersRoot from '../../src/components/Filters/Root.svelte';

// Hashtags
import HashtagsControls from '../../src/components/Hashtags/Controls.svelte';
import HashtagsMutedList from '../../src/components/Hashtags/MutedList.svelte';
import HashtagsFollowedList from '../../src/components/Hashtags/FollowedList.svelte';
import HashtagsRoot from '../../src/components/Hashtags/Root.svelte';

// Timeline states
import TimelineLoadMore from '../../src/components/Timeline/LoadMore.svelte';
import TimelineErrorState from '../../src/components/Timeline/ErrorState.svelte';
import TimelineEmptyState from '../../src/components/Timeline/EmptyState.svelte';

// Misc
import RealtimeWrapper from '../../src/components/RealtimeWrapper.svelte';
import SettingsPanel from '../../src/components/SettingsPanel.svelte';

interface Scenario {
    name: string;
    props: Record<string, any>;
    Wrapper?: ComponentType;
    wrapperProps?: Record<string, any>;
}

interface ComponentDefinition {
    component: ComponentType;
    scenarios: Scenario[];
}

const mockHashtagsAdapter = {
    getFollowedTags: async () => [],
    getFollowedHashtags: async () => [],
    followTag: async () => {},
    unfollowTag: async () => {},
    getMutedTags: async () => [],
    muteTag: async () => {},
    unmuteTag: async () => {}
};

const mockTimelineAdapter = {
    getTimeline: async () => ({ edges: [], pageInfo: {} }),
    subscribe: () => () => {},
    setOptions: () => {},
};

const mockAccounts = [
    { ...mockAccount, id: '1', username: 'user1', displayName: 'User One' },
    { ...mockAccount, id: '2', username: 'user2', displayName: 'User Two' }
];

const mockHashtags = [
    { name: 'test', usageCount: 10, lastUsed: new Date().toISOString() },
    { name: 'svelte', usageCount: 5, lastUsed: new Date().toISOString() }
];

const mockFollowRequests = mockAccounts.map(a => ({ id: `req-${a.id}`, account: a, createdAt: new Date().toISOString() }));

export const componentsToCover: Record<string, ComponentDefinition> = {
    // Profile Components
    'Profile/FeaturedHashtags': {
        component: ProfileFeaturedHashtags,
        scenarios: [
            { name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
            { name: 'populated', props: { hashtags: mockHashtags }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
            { name: 'ownProfile', props: { hashtags: mockHashtags, isOwnProfile: true }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/FollowersList': {
        component: ProfileFollowersList,
        scenarios: [
             { name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
             { name: 'populated', props: { followers: mockAccounts }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/EndorsedAccounts': {
        component: ProfileEndorsedAccounts,
        scenarios: [
             { name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
             { name: 'populated', props: { accounts: mockAccounts }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/FollowRequests': {
        component: ProfileFollowRequests,
        scenarios: [
             { name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount, isOwnProfile: true } },
             { name: 'populated', props: { requests: mockFollowRequests }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount, isOwnProfile: true } }
        ]
    },
    'Profile/FollowingList': {
        component: ProfileFollowingList,
        scenarios: [
             { name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
             { name: 'populated', props: { following: mockAccounts }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/AccountMigration': {
        component: ProfileAccountMigration,
        scenarios: [
             { name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/TrustBadge': {
        component: ProfileTrustBadge,
        scenarios: [
             { name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/VerifiedFields': {
        component: ProfileVerifiedFields,
        scenarios: [
             { name: 'default', props: { fields: mockAccount.fields }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/Timeline': {
        component: ProfileTimeline,
        scenarios: [
             { name: 'default', props: { adapter: mockTimelineAdapter }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/Tabs': {
        component: ProfileTabs,
        scenarios: [
             { name: 'default', props: { activeTab: 'posts' }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },
    'Profile/Fields': {
        component: ProfileFields,
        scenarios: [
             { name: 'default', props: { fields: mockAccount.fields }, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } }
        ]
    },

    // Status Components
    'Status/Actions': {
        component: StatusActions,
        scenarios: [
            { name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
            { name: 'interacted', props: {}, Wrapper: StatusRoot, wrapperProps: { status: { ...mockStatus, favourited: true, reblogged: true, bookmarked: true } } }
        ]
    },
    'Status/LesserMetadata': {
        component: StatusLesserMetadata,
        scenarios: [
            { name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } }
        ]
    },
    'Status/CommunityNotes': {
        component: StatusCommunityNotes,
        scenarios: [
            { name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } }
        ]
    },
    'Status/Media': {
        component: StatusMedia,
        scenarios: [
            { name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } },
            { name: 'with-media', props: {}, Wrapper: StatusRoot, wrapperProps: { status: { ...mockStatus, mediaAttachments: [{ type: 'image', url: 'test.jpg' }] } } }
        ]
    },
    'Status/Header': {
        component: StatusHeader,
        scenarios: [
            { name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } }
        ]
    },
    'Status/Content': {
        component: StatusContent,
        scenarios: [
            { name: 'default', props: {}, Wrapper: StatusRoot, wrapperProps: { status: mockStatus } }
        ]
    },

    // Lists Components
    'Lists/MemberPicker': {
        component: ListsMemberPicker,
        scenarios: [
            { name: 'default', props: {}, Wrapper: ListsRoot, wrapperProps: {} }
        ]
    },
    'Lists/Editor': {
        component: ListsEditor,
        scenarios: [
            { name: 'default', props: {}, Wrapper: ListsRoot, wrapperProps: {} }
        ]
    },
    'Lists/Timeline': {
        component: ListsTimeline,
        scenarios: [
            { name: 'default', props: { listId: '1' }, Wrapper: ListsRoot, wrapperProps: {} }
        ]
    },
    'Lists/Manager': {
        component: ListsManager,
        scenarios: [
            { name: 'default', props: {}, Wrapper: ListsRoot, wrapperProps: {} }
        ]
    },
    'Lists/Settings': {
        component: ListsSettings,
        scenarios: [
            { name: 'default', props: { listId: '1' }, Wrapper: ListsRoot, wrapperProps: {} }
        ]
    },
    'Lists/Root': {
        component: ListsRoot,
        scenarios: [
             { name: 'default', props: {} }
        ]
    },

    // Filters Components
    'Filters/Editor': {
        component: FiltersEditor,
        scenarios: [
            { name: 'default', props: {}, Wrapper: FiltersRoot, wrapperProps: {} }
        ]
    },
    'Filters/FilteredContent': {
        component: FiltersFilteredContent,
        scenarios: [
            { name: 'default', props: { content: 'test content' }, Wrapper: FiltersRoot, wrapperProps: {} }
        ]
    },
    'Filters/Manager': {
        component: FiltersManager,
        scenarios: [
            { name: 'default', props: {}, Wrapper: FiltersRoot, wrapperProps: {} },
            { name: 'populated', props: { filters: [{ id: '1', title: 'Test Filter', filterAction: 'warn', context: ['home'] }] }, Wrapper: FiltersRoot, wrapperProps: {} }
        ]
    },
    'Filters/Root': {
        component: FiltersRoot,
        scenarios: [
             { name: 'default', props: {} }
        ]
    },

    // Hashtags Components
    'Hashtags/Controls': {
        component: HashtagsControls,
        scenarios: [
            { name: 'default', props: {}, Wrapper: HashtagsRoot, wrapperProps: { adapter: mockHashtagsAdapter } }
        ]
    },
    'Hashtags/MutedList': {
        component: HashtagsMutedList,
        scenarios: [
            { name: 'default', props: {}, Wrapper: HashtagsRoot, wrapperProps: { adapter: mockHashtagsAdapter } }
        ]
    },
    'Hashtags/FollowedList': {
        component: HashtagsFollowedList,
        scenarios: [
            { name: 'default', props: {}, Wrapper: HashtagsRoot, wrapperProps: { adapter: mockHashtagsAdapter } },
            { name: 'populated', props: {}, Wrapper: HashtagsRoot, wrapperProps: { adapter: { ...mockHashtagsAdapter, getFollowedHashtags: async () => ({ edges: [{ node: { name: 'test' } }] }) } } }
        ]
    },
    'Hashtags/Root': {
        component: HashtagsRoot,
        scenarios: [
             { name: 'default', props: { adapter: mockHashtagsAdapter } }
        ]
    },

    // Timeline States
    'Timeline/LoadMore': {
        component: TimelineLoadMore,
        scenarios: [
            { name: 'default', props: { onLoadMore: () => {} }, Wrapper: TimelineRoot, wrapperProps: { items: [] } }
        ]
    },
    'Timeline/ErrorState': {
        component: TimelineErrorState,
        scenarios: [
            { name: 'default', props: { error: new Error('Test error') } }
        ]
    },
    'Timeline/EmptyState': {
        component: TimelineEmptyState,
        scenarios: [
            { name: 'default', props: { message: 'No items' } }
        ]
    },

    // Misc
    'RealtimeWrapper': {
        component: RealtimeWrapper,
        scenarios: [
            { name: 'default', props: { stream: 'test' } }
        ]
    },
    'SettingsPanel': {
        component: SettingsPanel,
        scenarios: [
            { name: 'default', props: {} }
        ]
    }
};
