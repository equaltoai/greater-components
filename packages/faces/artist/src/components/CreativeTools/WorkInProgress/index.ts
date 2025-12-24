/**
 * WorkInProgress Compound Component
 *
 * Components for work-in-progress documentation and version tracking.
 * Implements REQ-FR-006: Creative Tools for Artistic Process
 *
 * @module @equaltoai/greater-components-artist/components/CreativeTools/WorkInProgress
 */

import Root from './Root.svelte';
import Header from './Header.svelte';
import VersionList from './VersionList.svelte';
import VersionCard from './VersionCard.svelte';
import Compare from './Compare.svelte';
import Timeline from './Timeline.svelte';
import Comments from './Comments.svelte';

// Export context utilities
export {
	WIP_CONTEXT_KEY,
	createWIPContext,
	getWIPContext,
	hasWIPContext,
	navigateToNextVersion,
	navigateToPreviousVersion,
	navigateToVersion,
	toggleComparison,
	setComparisonMode,
	formatTimeBetweenVersions,
	type WIPContext,
	type WIPConfig,
	type WIPStatus,
	type ComparisonMode,
	type ComparisonState,
} from './context.js';

// Create compound component
export const WorkInProgress = Object.assign(Root, {
	Root,
	Header,
	VersionList,
	VersionCard,
	Compare,
	Timeline,
	Comments,
});

// Default export
export default WorkInProgress;
