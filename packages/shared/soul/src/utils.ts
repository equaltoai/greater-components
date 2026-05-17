import type {
	AvailabilityStatus,
	ContactRecommendation,
	ContactTarget,
	SoulAnchorAssurance,
	SoulAnchorEvidence,
	SoulChannels,
	SoulContactChannel,
	SoulContactPreferences,
} from './types.js';

const ANCHOR_STATE_LABELS: Record<SoulAnchorAssurance['state'], string> = {
	hosted_offchain: 'Hosted offchain',
	immutable_onchain: 'Immutable onchain',
};

const ANCHOR_SOURCE_LABELS: Record<SoulAnchorAssurance['source'], string> = {
	host_record: 'Host record',
	onchain_receipt: 'Onchain receipt',
};

const ANCHOR_EVIDENCE_LABELS: Record<SoulAnchorEvidence['kind'], string> = {
	host_registry_record: 'Host registry record',
	mint_transaction: 'Mint transaction',
};

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

export function getAnchorAssuranceStateLabel(state: SoulAnchorAssurance['state']): string {
	return ANCHOR_STATE_LABELS[state] ?? state;
}

export function getAnchorAssuranceSourceLabel(source: SoulAnchorAssurance['source']): string {
	return ANCHOR_SOURCE_LABELS[source] ?? source;
}

export function getAnchorEvidenceKindLabel(kind: SoulAnchorEvidence['kind']): string {
	return ANCHOR_EVIDENCE_LABELS[kind] ?? kind;
}

export function getAnchorAssuranceBadgeColor(
	assurance: SoulAnchorAssurance | null | undefined
): 'success' | 'warning' | 'gray' {
	if (!assurance) return 'gray';
	return assurance.state === 'immutable_onchain' ? 'success' : 'warning';
}

export function formatAnchorAssuranceSummary(
	assurance: SoulAnchorAssurance | null | undefined
): string {
	if (!assurance) return 'No anchor assurance published';
	return `${getAnchorAssuranceStateLabel(assurance.state)} · ${getAnchorAssuranceSourceLabel(
		assurance.source
	)}`;
}

export function formatAnchorAssuranceTrustNotice(
	assurance: SoulAnchorAssurance | null | undefined
): string {
	if (!assurance) return 'No trust display metadata is available.';
	const lifecycle = [
		assurance.mutable ? 'mutable' : 'not mutable',
		assurance.revocable ? 'revocable' : 'not revocable',
	].join(', ');
	return `Display metadata only; not a capability gate. ${lifecycle}.`;
}

export function anchorAssuranceAllowsCapability(
	_assurance: SoulAnchorAssurance | null | undefined
): false {
	// Host #320 defines anchor_assurance as display/trust metadata. Greater must not treat
	// hosted/offchain or immutable/onchain status as permission authority.
	return false;
}
