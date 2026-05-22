import { describe, expect, it } from 'vitest';
import { isLegacyManagedSoulEmailAlias, recommendContactTarget } from '../src/utils.js';
import type { SoulChannels, SoulContactPreferences } from '../src/types.js';

describe('recommendContactTarget', () => {
	it('prefers preferred channel when available', () => {
		const channels: SoulChannels = {
			ens: {
				name: 'agent-alice.lessersoul.eth',
				chain: 'mainnet',
				resolverAddress: '0x0000000000000000000000000000000000000000',
			},
			email: {
				address: 'agent-alice.simulacrum@lessersoul.ai',
				capabilities: ['receive', 'send'],
				verified: true,
				verifiedAt: '2026-03-01T00:00:00Z',
				status: 'active',
				protocols: ['smtp'],
			},
			phone: null,
		};

		const preferences: SoulContactPreferences = {
			preferred: 'email',
			fallback: 'activitypub',
			availability: { schedule: 'always', timezone: 'UTC', windows: null },
			responseExpectation: { target: '1h', guarantee: 'best-effort' },
			languages: ['en'],
			contentTypes: ['text/plain'],
			firstContact: { requireSoul: false, requireReputation: null, introductionExpected: true },
		};

		const rec = recommendContactTarget(channels, preferences);
		expect(rec.recommended?.channel).toBe('email');
		expect(rec.recommended).toMatchObject({
			address: 'agent-alice.simulacrum@lessersoul.ai',
		});
	});

	it('falls back when preferred is unavailable', () => {
		const channels: SoulChannels = {
			ens: null,
			email: null,
			phone: {
				number: '+15550142',
				capabilities: ['sms-receive', 'sms-send'],
				verified: true,
				verifiedAt: '2026-03-01T00:00:00Z',
				status: 'active',
				provider: 'telnyx',
			},
		};

		const preferences: SoulContactPreferences = {
			preferred: 'email',
			fallback: 'sms',
			availability: { schedule: 'always', timezone: 'UTC', windows: null },
			responseExpectation: { target: '24h', guarantee: 'best-effort' },
			languages: ['en'],
			contentTypes: ['text/plain'],
			firstContact: { requireSoul: false, requireReputation: null, introductionExpected: true },
		};

		const rec = recommendContactTarget(channels, preferences);
		expect(rec.recommended?.channel).toBe('sms');
	});

	it('only marks explicitly bare managed lessersoul.ai addresses as legacy aliases', () => {
		expect(isLegacyManagedSoulEmailAlias('agent-alice@lessersoul.ai')).toBe(true);
		expect(isLegacyManagedSoulEmailAlias('agent-alice.simulacrum@lessersoul.ai')).toBe(false);
		expect(isLegacyManagedSoulEmailAlias('agent-alice.team.simulacrum@lessersoul.ai')).toBe(false);
		expect(isLegacyManagedSoulEmailAlias('agent-alice@example.com')).toBe(false);
	});
});
