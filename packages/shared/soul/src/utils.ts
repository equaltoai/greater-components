import type {
	AvailabilityStatus,
	ContactRecommendation,
	ContactTarget,
	SoulChannels,
	SoulContactChannel,
	SoulContactPreferences,
} from './types.js';

const CONTACT_CHANNEL_LABELS: Record<SoulContactChannel, string> = {
	email: 'Email',
	sms: 'SMS',
	voice: 'Voice',
	activitypub: 'ActivityPub',
	mcp: 'MCP',
};

function unique<T>(items: T[]): T[] {
	return Array.from(new Set(items));
}

function isActiveStatus(status?: string): boolean {
	if (!status) return true;
	return status === 'active';
}

function resolveTargetForChannel(
	channels: SoulChannels,
	channel: SoulContactChannel
): ContactTarget | null {
	switch (channel) {
		case 'email': {
			if (!channels.email) return null;
			if (!channels.email.capabilities?.includes('receive')) return null;
			if (!isActiveStatus(channels.email.status)) return null;
			return {
				channel,
				label: CONTACT_CHANNEL_LABELS[channel],
				address: channels.email.address,
				verified: Boolean(channels.email.verified),
				status: channels.email.status,
			};
		}
		case 'sms': {
			if (!channels.phone) return null;
			if (!channels.phone.capabilities?.includes('sms-receive')) return null;
			if (!isActiveStatus(channels.phone.status)) return null;
			return {
				channel,
				label: CONTACT_CHANNEL_LABELS[channel],
				number: channels.phone.number,
				verified: Boolean(channels.phone.verified),
				status: channels.phone.status,
			};
		}
		case 'voice': {
			if (!channels.phone) return null;
			if (!channels.phone.capabilities?.includes('voice-receive')) return null;
			if (!isActiveStatus(channels.phone.status)) return null;
			return {
				channel,
				label: CONTACT_CHANNEL_LABELS[channel],
				number: channels.phone.number,
				verified: Boolean(channels.phone.verified),
				status: channels.phone.status,
			};
		}
		case 'activitypub':
		case 'mcp':
			return { channel, label: CONTACT_CHANNEL_LABELS[channel] };
		default:
			return null;
	}
}

export function getAvailabilityStatus(
	preferences: SoulContactPreferences | null
): AvailabilityStatus | undefined {
	if (!preferences) return undefined;
	return {
		schedule: preferences.availability.schedule,
		timezone: preferences.availability.timezone,
		windows: preferences.availability.windows ?? null,
	};
}

export function formatAvailabilitySummary(availability: AvailabilityStatus | undefined): string {
	if (!availability) return 'No stated availability';

	switch (availability.schedule) {
		case 'always':
			return 'Always available';
		case 'business-hours':
			return `Business hours${availability.timezone ? ` (${availability.timezone})` : ''}`;
		case 'custom':
			return `Custom schedule${availability.timezone ? ` (${availability.timezone})` : ''}`;
		default:
			return 'Availability';
	}
}

export function recommendContactTarget(
	channels: SoulChannels,
	preferences: SoulContactPreferences | null
): ContactRecommendation {
	const preferredChannel = preferences?.preferred;
	const fallbackChannel = preferences?.fallback;

	const preferred = preferredChannel ? resolveTargetForChannel(channels, preferredChannel) : null;
	const fallback =
		fallbackChannel && fallbackChannel !== preferredChannel
			? resolveTargetForChannel(channels, fallbackChannel)
			: null;

	const orderedCandidateChannels: SoulContactChannel[] = unique(
		[preferredChannel, fallbackChannel, 'email', 'sms', 'voice', 'activitypub', 'mcp'].filter(
			Boolean
		) as SoulContactChannel[]
	);

	const candidates = orderedCandidateChannels
		.map((channel) => resolveTargetForChannel(channels, channel))
		.filter(Boolean) as ContactTarget[];

	const recommended = preferred ?? fallback ?? candidates[0] ?? null;

	const alternatives = candidates.filter((t) => recommended && t.channel !== recommended.channel);

	const availability = getAvailabilityStatus(preferences);

	return { recommended, preferred, fallback, alternatives, availability };
}
