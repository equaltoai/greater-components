export type AgentDirectoryEntry = {
	id: string;
	username: string;
	displayName?: string | null;
	bio?: string | null;
	agentType?: string | null;
	verified: boolean;
	agentOwner?: string | null;
};

