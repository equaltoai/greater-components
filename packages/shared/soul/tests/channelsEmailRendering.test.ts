import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';

import BestWayToContact from '../src/BestWayToContact.svelte';
import ChannelsDisplay from '../src/ChannelsDisplay.svelte';
import type { SoulChannels, SoulContactPreferences } from '../src/types.js';

const compoundAddress = 'agent-bob.simulacrum@lessersoul.ai';
const legacyAddress = 'agent-bob@lessersoul.ai';

function channelsWithEmail(address: string): SoulChannels {
	return {
		ens: null,
		email: {
			address,
			capabilities: ['receive', 'send'],
			protocols: ['smtp'],
			verified: true,
			verifiedAt: '2026-05-22T00:00:00Z',
			status: 'active',
		},
		phone: null,
	};
}

const emailPreferences: SoulContactPreferences = {
	preferred: 'email',
	fallback: 'activitypub',
	availability: {
		schedule: 'always',
		timezone: 'UTC',
		windows: null,
	},
	responseExpectation: {
		target: '1h',
		guarantee: 'best-effort',
	},
	languages: ['en'],
	contentTypes: ['text/plain'],
	firstContact: {
		requireSoul: false,
		requireReputation: null,
		introductionExpected: true,
	},
};

describe('soul email rendering', () => {
	it('renders instance-scoped managed email addresses as opaque strings', () => {
		render(ChannelsDisplay, { props: { channels: channelsWithEmail(compoundAddress) } });

		const emailLink = screen.getByRole('link', { name: compoundAddress });
		expect(emailLink.getAttribute('href')).toBe(`mailto:${compoundAddress}`);
		expect(screen.queryByText('Legacy alias')).toBeNull();
		expect(screen.queryByText('agent-bob')).toBeNull();
		expect(screen.queryByText('simulacrum')).toBeNull();
	});

	it('keeps best-contact recommendations on the full compound email address', () => {
		render(BestWayToContact, {
			props: {
				channels: channelsWithEmail(compoundAddress),
				preferences: emailPreferences,
			},
		});

		const emailLink = screen.getByRole('link', { name: compoundAddress });
		expect(emailLink.getAttribute('href')).toBe(`mailto:${compoundAddress}`);
		expect(screen.queryByText('Legacy alias')).toBeNull();
	});

	it('labels explicitly provided bare managed email addresses as legacy aliases', () => {
		render(ChannelsDisplay, { props: { channels: channelsWithEmail(legacyAddress) } });

		expect(screen.getByRole('link', { name: legacyAddress })).toBeTruthy();
		expect(screen.getByText('Legacy alias')).toBeTruthy();
	});

	it('carries the legacy-alias label into best-contact rendering', () => {
		render(BestWayToContact, {
			props: {
				channels: channelsWithEmail(legacyAddress),
				preferences: emailPreferences,
			},
		});

		expect(screen.getByRole('link', { name: legacyAddress })).toBeTruthy();
		expect(screen.getByText('Legacy alias')).toBeTruthy();
	});
});
