import type {
	AgentIdentityCardData,
	AgentLifecycleStep,
	AgentSurfaceArtifact,
	AgentSurfaceMetric,
	AgentSurfaceTone,
	ContinuityPanelData,
	DeclarationPreviewCardData,
	GraduationSummaryCardData,
	ReviewDecisionCardData,
	SignatureCheckpointCardData,
	SoulRequestCardData,
} from '@equaltoai/greater-components-agent';
import type {
	ChatMessageMoment,
	ChatMessageWorkflowMetadata,
	MessageRole,
} from '@equaltoai/greater-components-chat';
import type {
	DirectMessage,
	MessagingWorkflowConversationSummary,
} from '@equaltoai/greater-components-messaging';
import type { WorkflowEventNotification } from '@equaltoai/greater-components-notifications';
import type { SoulChannels, SoulContactPreferences } from '@equaltoai/greater-components-soul';

export interface AgentFaceBrand {
	name: string;
	editionLabel?: string;
	environmentLabel?: string;
	supportLabel?: string;
}

export interface AgentFaceNavItem {
	id: string;
	label: string;
	href?: string;
	active?: boolean;
	badge?: string;
}

export interface AgentFaceHero {
	eyebrow: string;
	title: string;
	summary: string;
}

export interface AgentFaceAction {
	label: string;
	href?: string;
	tone?: 'primary' | 'secondary' | 'ghost';
	detail?: string;
}

export interface AgentFaceStatusChip {
	label: string;
	detail?: string;
	tone?: AgentSurfaceTone;
}

export interface AgentFaceMetric extends AgentSurfaceMetric {
	id: string;
	tone?: AgentSurfaceTone;
}

export interface AgentFaceCallout {
	id: string;
	title: string;
	summary: string;
	meta?: string;
	tone?: AgentSurfaceTone;
}

export interface AgentFaceRequestFilter {
	id: string;
	label: string;
	count?: number;
	active?: boolean;
}

export interface AgentFaceConversationEntry {
	id: string;
	role: MessageRole;
	label: string;
	content: string;
	createdAt?: string | Date;
	workflowMoments?: readonly ChatMessageMoment[];
	workflowMetadata?: readonly ChatMessageWorkflowMetadata[];
}

export interface AgentFaceBaseData {
	brand?: AgentFaceBrand;
	navItems?: readonly AgentFaceNavItem[];
	hero: AgentFaceHero;
	actions?: readonly AgentFaceAction[];
	statusChips?: readonly AgentFaceStatusChip[];
	metrics?: readonly AgentFaceMetric[];
}

export interface AgentGenesisWorkspaceData extends AgentFaceBaseData {
	identity: AgentIdentityCardData;
	requestQueue: readonly SoulRequestCardData[];
	activeRequest?: SoulRequestCardData;
	reviewDecision?: ReviewDecisionCardData;
	declaration?: DeclarationPreviewCardData;
	checkpoint?: SignatureCheckpointCardData;
	lifecycle?: readonly AgentLifecycleStep[];
	conversation?: readonly AgentFaceConversationEntry[];
	focusNotes?: readonly AgentFaceCallout[];
}

export interface SoulRequestCenterData extends AgentFaceBaseData {
	filters?: readonly AgentFaceRequestFilter[];
	notifications: readonly WorkflowEventNotification[];
	requestQueue: readonly SoulRequestCardData[];
	focusRequest?: SoulRequestCardData;
	reviewDecision?: ReviewDecisionCardData;
	callouts?: readonly AgentFaceCallout[];
}

export interface GraduationApprovalThreadData extends AgentFaceBaseData {
	threadSummary: MessagingWorkflowConversationSummary;
	messages: readonly DirectMessage[];
	declaration: DeclarationPreviewCardData;
	checkpoint: SignatureCheckpointCardData;
	graduation: GraduationSummaryCardData;
	currentUserId?: string;
	callouts?: readonly AgentFaceCallout[];
}

export interface NexusDashboardData extends AgentFaceBaseData {
	identity: AgentIdentityCardData;
	graduation: GraduationSummaryCardData;
	continuity: ContinuityPanelData;
	lifecycle?: readonly AgentLifecycleStep[];
	workflowNotifications?: readonly WorkflowEventNotification[];
	callouts?: readonly AgentFaceCallout[];
}

export interface IdentityNexusData extends AgentFaceBaseData {
	identity: AgentIdentityCardData;
	declaration: DeclarationPreviewCardData;
	channels: SoulChannels;
	preferences: SoulContactPreferences | null;
	lifecycle?: readonly AgentLifecycleStep[];
	continuity?: ContinuityPanelData;
	evidence?: readonly AgentSurfaceArtifact[];
	callouts?: readonly AgentFaceCallout[];
}
