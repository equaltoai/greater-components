export type AgentPackageKey =
	| 'shared/soul'
	| 'shared/agent'
	| 'shared/chat'
	| 'shared/notifications'
	| 'shared/messaging'
	| 'faces/agent';

export type AgentPackageRole = 'shared-domain' | 'shared-channel' | 'face-composition';

export interface AgentPackageBoundary {
	key: AgentPackageKey;
	role: AgentPackageRole;
	directPackageName: string;
	aggregateExport: `@equaltoai/greater-components/${AgentPackageKey}`;
	remit: string;
	owns: readonly string[];
	composesWith: readonly AgentPackageKey[];
	avoids: readonly string[];
}

export interface AgentWorkflowMilestoneShape {
	milestone: 'M2' | 'M3';
	focus: string;
	packages: readonly AgentPackageKey[];
	outcomes: readonly string[];
}

export const AGENT_DIRECT_PACKAGE_NAMES = {
	'shared/soul': '@equaltoai/greater-components-soul',
	'shared/agent': '@equaltoai/greater-components-agent',
	'shared/chat': '@equaltoai/greater-components-chat',
	'shared/notifications': '@equaltoai/greater-components-notifications',
	'shared/messaging': '@equaltoai/greater-components-messaging',
	'faces/agent': '@equaltoai/greater-components-agent-face',
} as const satisfies Record<AgentPackageKey, string>;

export const AGENT_PACKAGE_BOUNDARIES = [
	{
		key: 'shared/soul',
		role: 'shared-domain',
		directPackageName: AGENT_DIRECT_PACKAGE_NAMES['shared/soul'],
		aggregateExport: '@equaltoai/greater-components/shared/soul',
		remit:
			'Identity-adjacent reachability surfaces: channels, contact preferences, and best-contact guidance.',
		owns: [
			'verified channel display',
			'contact preference viewing and editing',
			'best contact recommendation helpers',
		],
		composesWith: ['shared/agent', 'shared/notifications', 'faces/agent'],
		avoids: [
			'full workflow intake and progression',
			'review and approval checkpoints',
			'page-level agent workspaces',
		],
	},
	{
		key: 'shared/agent',
		role: 'shared-domain',
		directPackageName: AGENT_DIRECT_PACKAGE_NAMES['shared/agent'],
		aggregateExport: '@equaltoai/greater-components/shared/agent',
		remit:
			'Neutral workflow contracts, lifecycle naming, and reusable metadata for agent-first work.',
		owns: [
			'workflow contracts and slot naming',
			'state labels and milestone sequencing',
			'Stitch anchor translations into reusable families',
		],
		composesWith: [
			'shared/soul',
			'shared/chat',
			'shared/notifications',
			'shared/messaging',
			'faces/agent',
		],
		avoids: [
			'conversation transport ownership',
			'inbox and delivery UX',
			'route-level orchestration and page shells',
		],
	},
	{
		key: 'shared/chat',
		role: 'shared-channel',
		directPackageName: AGENT_DIRECT_PACKAGE_NAMES['shared/chat'],
		aggregateExport: '@equaltoai/greater-components/shared/chat',
		remit: 'Assistant-style conversational panels, transcripts, and tool-call views.',
		owns: [
			'multi-turn assistant conversations',
			'tool-call transcript rendering',
			'assistant settings',
		],
		composesWith: ['shared/agent', 'shared/messaging', 'faces/agent'],
		avoids: ['request queue ownership', 'workflow schema naming', 'notification feeds'],
	},
	{
		key: 'shared/notifications',
		role: 'shared-channel',
		directPackageName: AGENT_DIRECT_PACKAGE_NAMES['shared/notifications'],
		aggregateExport: '@equaltoai/greater-components/shared/notifications',
		remit: 'Ambient async alerts, urgency grouping, and preference controls.',
		owns: ['notification inbox surfaces', 'urgency grouping', 'delivery preferences'],
		composesWith: ['shared/agent', 'shared/soul', 'faces/agent'],
		avoids: ['primary workflow editors', 'full conversation context', 'page-level orchestration'],
	},
	{
		key: 'shared/messaging',
		role: 'shared-channel',
		directPackageName: AGENT_DIRECT_PACKAGE_NAMES['shared/messaging'],
		aggregateExport: '@equaltoai/greater-components/shared/messaging',
		remit: 'Directed conversations, handoff threads, and request inbox messaging.',
		owns: ['request inbox threads', 'handoff conversations', 'message acceptance states'],
		composesWith: ['shared/agent', 'shared/chat', 'faces/agent'],
		avoids: ['workflow schema ownership', 'global notification feeds', 'full-screen dashboards'],
	},
	{
		key: 'faces/agent',
		role: 'face-composition',
		directPackageName: AGENT_DIRECT_PACKAGE_NAMES['faces/agent'],
		aggregateExport: '@equaltoai/greater-components/faces/agent',
		remit:
			'Compose shared workflow, messaging, chat, notifications, and reachability surfaces into agent-first screens.',
		owns: [
			'page-level layouts and shell boundaries',
			'screen composition presets',
			'routing-level loading and progressive disclosure boundaries',
		],
		composesWith: [
			'shared/soul',
			'shared/agent',
			'shared/chat',
			'shared/notifications',
			'shared/messaging',
		],
		avoids: [
			'authoritative workflow slot naming',
			'transport implementation details',
			'identity-specific reachability primitives',
		],
	},
] as const satisfies readonly AgentPackageBoundary[];

export const AGENT_WORKFLOW_IMPLEMENTATION_SHAPE = [
	{
		milestone: 'M2',
		focus:
			'Implement reusable shared workflow families without binding them to a single app shell.',
		packages: [
			'shared/agent',
			'shared/soul',
			'shared/chat',
			'shared/notifications',
			'shared/messaging',
		],
		outcomes: [
			'typed workflow surfaces and cards',
			'neutral request and review building blocks',
			'channel-specific adapters for messaging and notifications',
		],
	},
	{
		milestone: 'M3',
		focus:
			'Compose the reusable families into route-level workspaces and checkpoints inside faces/agent.',
		packages: [
			'faces/agent',
			'shared/agent',
			'shared/messaging',
			'shared/chat',
			'shared/notifications',
		],
		outcomes: [
			'request workspace and review cockpit shells',
			'graduation and continuity page compositions',
			'route-level orchestration without app-specific leakage into shared packages',
		],
	},
] as const satisfies readonly AgentWorkflowMilestoneShape[];

export function getAgentPackageBoundary(key: AgentPackageKey): AgentPackageBoundary {
	const boundary = AGENT_PACKAGE_BOUNDARIES.find((candidate) => candidate.key === key);

	if (!boundary) {
		throw new Error(`Unknown agent package boundary: ${key}`);
	}

	return boundary;
}
