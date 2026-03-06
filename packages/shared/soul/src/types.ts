import type { SoulAgentChannelsResponse } from '@equaltoai/greater-components-adapters';

export type SoulAgentId = string;

export type SoulChannels = SoulAgentChannelsResponse['channels'];
export type SoulContactPreferences = NonNullable<SoulAgentChannelsResponse['contactPreferences']>;

export type SoulContactChannel = SoulContactPreferences['preferred'];

export type SoulAvailabilitySchedule = SoulContactPreferences['availability']['schedule'];
export type SoulAvailabilityWindow = NonNullable<
	NonNullable<SoulContactPreferences['availability']['windows']>[number]
>;

export type ContactTarget =
	| {
			channel: 'email';
			label: string;
			address: string;
			verified: boolean;
			status?: string;
	  }
	| {
			channel: 'sms';
			label: string;
			number: string;
			verified: boolean;
			status?: string;
	  }
	| {
			channel: 'voice';
			label: string;
			number: string;
			verified: boolean;
			status?: string;
	  }
	| {
			channel: 'activitypub' | 'mcp';
			label: string;
	  };

export interface AvailabilityStatus {
	schedule: SoulAvailabilitySchedule;
	timezone?: string;
	windows?: SoulAvailabilityWindow[] | null;
}

export interface ContactRecommendation {
	recommended: ContactTarget | null;
	preferred: ContactTarget | null;
	fallback: ContactTarget | null;
	alternatives: ContactTarget[];
	availability?: AvailabilityStatus;
}
