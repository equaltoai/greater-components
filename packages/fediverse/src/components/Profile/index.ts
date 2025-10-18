/**
 * Profile Components
 * 
 * Complete profile viewing and editing system for ActivityPub/Fediverse applications.
 * Supports viewing profiles, editing own profile, following, blocking, and custom fields.
 * 
 * @module components/Profile
 * 
 * @example
 * ```svelte
 * <script>
 *   import * as Profile from '@greater/fediverse/Profile';
 * 
 *   const profile = {
 *     id: '1',
 *     username: 'alice',
 *     displayName: 'Alice',
 *     bio: 'Developer & open source enthusiast',
 *     followersCount: 1234,
 *     followingCount: 567,
 *     statusesCount: 8910,
 *   };
 * 
 *   const handlers = {
 *     onFollow: async (userId) => {
 *       // Handle follow
 *     },
 *     onSave: async (data) => {
 *       // Handle profile save
 *     },
 *   };
 * </script>
 * 
 * <Profile.Root {profile} {handlers} isOwnProfile={true}>
 *   <Profile.Header />
 *   <Profile.Stats />
 *   <Profile.Tabs />
 *   {#if profile.fields}
 *     <Profile.Fields />
 *   {/if}
 * </Profile.Root>
 * ```
 */

export { default as Root } from './Root.svelte';
export { default as Header } from './Header.svelte';
export { default as Stats } from './Stats.svelte';
export { default as Tabs } from './Tabs.svelte';
export { default as Fields } from './Fields.svelte';
export { default as Edit } from './Edit.svelte';
export { default as VerifiedFields } from './VerifiedFields.svelte';
export { default as PrivacySettings } from './PrivacySettings.svelte';
export { default as FollowRequests } from './FollowRequests.svelte';
export { default as FollowersList } from './FollowersList.svelte';
export { default as FollowingList } from './FollowingList.svelte';
export { default as EndorsedAccounts } from './EndorsedAccounts.svelte';
export { default as FeaturedHashtags } from './FeaturedHashtags.svelte';
export { default as AccountMigration } from './AccountMigration.svelte';
export { default as TrustBadge } from './TrustBadge.svelte';

// Export types and context utilities
export type {
	ProfileData,
	ProfileField,
	ProfileRelationship,
	ProfileEditData,
	ProfileTab,
	ProfileHandlers,
	ProfileState,
	ProfileContext,
	PrivacySettings,
	FollowRequest,
	BlockedAccount,
	MutedAccount,
	FeaturedHashtag,
	AccountMigration,
} from './context.js';

export {
	createProfileContext,
	getProfileContext,
	formatCount,
	getRelationshipText,
	DEFAULT_TABS,
} from './context.js';

