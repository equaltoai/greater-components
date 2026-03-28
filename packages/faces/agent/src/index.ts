export const AGENT_FACE_PACKAGE_ROLE = {
	key: 'faces/agent',
	role: 'face-composition',
	directPackageName: '@equaltoai/greater-components-agent-face',
	aggregateExport: '@equaltoai/greater-components/faces/agent',
	remit:
		'Compose shared workflow, messaging, chat, notifications, and reachability surfaces into agent-first screens.',
	owns: [
		'page-level layouts and shell boundaries',
		'screen composition presets',
		'routing-level loading and progressive disclosure boundaries',
	] as const,
	composesWith: [
		'shared/soul',
		'shared/agent',
		'shared/chat',
		'shared/notifications',
		'shared/messaging',
	] as const,
	avoids: [
		'authoritative workflow slot naming',
		'transport implementation details',
		'identity-specific reachability primitives',
	] as const,
	primarySharedModules: [
		'shared/agent',
		'shared/messaging',
		'shared/notifications',
		'shared/chat',
		'shared/soul',
	] as const,
	stitchAnchors: [
		'Agent Genesis',
		'Nexus Dashboard',
		'Identity Nexus',
		'Notification Center: Soul Requests',
		'Direct Message: Graduation Approval',
	] as const,
	surfaceKinds: ['workspace', 'dashboard', 'identity-shell', 'inbox', 'checkpoint'] as const,
} as const;

export type AgentFacePackageRole = typeof AGENT_FACE_PACKAGE_ROLE;

export { AGENT_FACE_COMPOSITIONS, getAgentFaceComposition } from './compositions.js';

export type { AgentFaceComposition } from './compositions.js';

export { default as AgentGenesisWorkspace } from './AgentGenesisWorkspace.svelte';
export { default as SoulRequestCenter } from './SoulRequestCenter.svelte';
export { default as GraduationApprovalThread } from './GraduationApprovalThread.svelte';
export { default as NexusDashboard } from './NexusDashboard.svelte';
export { default as IdentityNexus } from './IdentityNexus.svelte';

export type {
	AgentFaceAction,
	AgentFaceAttributionRecord,
	AgentFaceBaseData,
	AgentFaceBrand,
	AgentFaceCallout,
	AgentFaceConversationEntry,
	AgentFaceHero,
	AgentFaceMetric,
	AgentFaceNavItem,
	AgentFaceRequestFilter,
	AgentFaceStatusChip,
	AgentFaceTimelineMoment,
	AgentGenesisWorkspaceData,
	GraduationApprovalThreadData,
	IdentityNexusData,
	NexusDashboardData,
	SoulRequestCenterData,
} from './types.js';
