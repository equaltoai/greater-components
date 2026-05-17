/**
 * Soul (lesser-soul v3) UI components.
 */

export { default as ChannelsDisplay } from './ChannelsDisplay.svelte';
export { default as ContactPreferencesViewer } from './ContactPreferencesViewer.svelte';
export { default as ContactPreferencesEditor } from './ContactPreferencesEditor.svelte';
export { default as BestWayToContact } from './BestWayToContact.svelte';
export { default as AnchorAssuranceBadge } from './AnchorAssuranceBadge.svelte';

export type {
	SoulAgentId,
	SoulChannels,
	SoulContactPreferences,
	SoulContactChannel,
	SoulAvailabilitySchedule,
	SoulAvailabilityWindow,
	ContactTarget,
	AvailabilityStatus,
	ContactRecommendation,
	SoulAnchorAssurance,
	SoulAnchorEvidence,
	AdapterSoulAnchorAssuranceContract,
	AdapterSoulAnchorEvidenceContract,
} from './types.js';

export {
	getAvailabilityStatus,
	recommendContactTarget,
	formatAvailabilitySummary,
	getAnchorAssuranceStateLabel,
	getAnchorAssuranceSourceLabel,
	getAnchorEvidenceKindLabel,
	getAnchorAssuranceBadgeColor,
	formatAnchorAssuranceSummary,
	formatAnchorAssuranceTrustNotice,
	anchorAssuranceAllowsCapability,
} from './utils.js';
