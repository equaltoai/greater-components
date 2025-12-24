/**
 * ArtistProfile Compound Component
 *
 * A compound component for displaying artist portfolios as gallery spaces.
 * Implements REQ-FR-002: Artist Profiles as Gallery Spaces
 * Implements REQ-VIEW-002: Portfolio View layout
 *
 * @module @equaltoai/greater-components/faces/artist/ArtistProfile
 *
 * @example
 * ```svelte
 * <ArtistProfile.Root {artist} isOwnProfile={false} layout="gallery">
 *   <ArtistProfile.HeroBanner />
 *   <ArtistProfile.Avatar />
 *   <ArtistProfile.Name />
 *   <ArtistProfile.Badges />
 *   <ArtistProfile.Statement />
 *   <ArtistProfile.Stats />
 *   <ArtistProfile.Actions />
 *   <ArtistProfile.Sections />
 *   <ArtistProfile.Timeline items={timelineItems} />
 * </ArtistProfile.Root>
 * ```
 */

// Context exports
export {
	ARTIST_PROFILE_CONTEXT_KEY,
	createArtistProfileContext,
	getArtistProfileContext,
	hasArtistProfileContext,
	getInitials,
	formatStatNumber,
	DEFAULT_PROFILE_CONFIG,
} from './context.js';

// Type exports
export type {
	ArtistData,
	ArtistBadgeData,
	ArtistStats,
	ArtistStatus,
	BadgeType,
	ProfileLayout,
	SectionType,
	PortfolioSectionData,
	TimelineItem,
	ProfileHandlers,
	ProfileConfig,
	ArtistProfileContext,
} from './context.js';

// Component exports
export { default as Root } from './Root.svelte';
export { default as HeroBanner } from './HeroBanner.svelte';
export { default as Avatar } from './Avatar.svelte';
export { default as Name } from './Name.svelte';
export { default as Badges } from './Badges.svelte';
export { default as Statement } from './Statement.svelte';
export { default as Stats } from './Stats.svelte';
export { default as Sections } from './Sections.svelte';
export { default as Actions } from './Actions.svelte';
export { default as Edit } from './Edit.svelte';
export { default as Timeline } from './Timeline.svelte';

// Import components for namespace
import Root from './Root.svelte';
import HeroBanner from './HeroBanner.svelte';
import Avatar from './Avatar.svelte';
import Name from './Name.svelte';
import Badges from './Badges.svelte';
import Statement from './Statement.svelte';
import Stats from './Stats.svelte';
import Sections from './Sections.svelte';
import Actions from './Actions.svelte';
import Edit from './Edit.svelte';
import Timeline from './Timeline.svelte';

/**
 * ArtistProfile compound component namespace
 *
 * Provides convenient access to all ArtistProfile subcomponents.
 *
 * @example
 * ```svelte
 * <ArtistProfile.Root {artist}>
 *   <ArtistProfile.HeroBanner />
 *   <ArtistProfile.Avatar />
 *   <ArtistProfile.Name />
 * </ArtistProfile.Root>
 * ```
 */
export const ArtistProfile = {
	Root,
	HeroBanner,
	Avatar,
	Name,
	Badges,
	Statement,
	Stats,
	Sections,
	Actions,
	Edit,
	Timeline,
} as const;

export default ArtistProfile;
