import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AnchorAssuranceBadge from '../src/AnchorAssuranceBadge.svelte';
import ChannelsDisplay from '../src/ChannelsDisplay.svelte';
import {
	anchorAssuranceAllowsCapability,
	formatAnchorAssuranceSummary,
	formatAnchorAssuranceTrustNotice,
	getAnchorAssuranceBadgeColor,
} from '../src/utils.js';
import type { SoulAnchorAssurance, SoulChannels } from '../src/types.js';

const hosted: SoulAnchorAssurance = {
	state: 'hosted_offchain',
	source: 'host_record',
	capability_gate: false,
	mutable: true,
	revocable: true,
	evidence: [{ kind: 'host_registry_record', recorded_at: '2026-05-17T00:00:00Z' }],
};

const immutable: SoulAnchorAssurance = {
	state: 'immutable_onchain',
	source: 'onchain_receipt',
	capability_gate: false,
	mutable: false,
	revocable: false,
	evidence: [
		{
			kind: 'mint_transaction',
			tx_hash: '0xabc123',
			operation_id: 'mint-op-1',
			token_id: '42',
			chain_id: 8453,
		},
	],
};

const channels: SoulChannels = {
	ens: null,
	email: null,
	phone: null,
};

describe('anchor assurance helpers', () => {
	it('formats hosted and immutable assurance distinctly', () => {
		expect(formatAnchorAssuranceSummary(hosted)).toBe('Hosted offchain · Host record');
		expect(formatAnchorAssuranceSummary(immutable)).toBe('Immutable onchain · Onchain receipt');
		expect(getAnchorAssuranceBadgeColor(hosted)).toBe('warning');
		expect(getAnchorAssuranceBadgeColor(immutable)).toBe('success');
	});

	it('never treats assurance as capability authority', () => {
		expect(anchorAssuranceAllowsCapability(hosted)).toBe(false);
		expect(anchorAssuranceAllowsCapability(immutable)).toBe(false);
		expect(formatAnchorAssuranceTrustNotice(immutable)).toContain('not a capability gate');
	});
});

describe('AnchorAssuranceBadge', () => {
	it('renders hosted/offchain assurance as display metadata', () => {
		render(AnchorAssuranceBadge, { props: { assurance: hosted, showDetails: true } });
		expect(screen.getByText('Hosted offchain')).toBeTruthy();
		expect(screen.getByText('Host record')).toBeTruthy();
		expect(screen.getByText(/not a capability gate/i)).toBeTruthy();
		expect(screen.getByText(/Capability gate: no/i)).toBeTruthy();
	});

	it('renders immutable/onchain assurance distinctly', () => {
		render(AnchorAssuranceBadge, { props: { assurance: immutable, showDetails: true } });
		expect(screen.getByText('Immutable onchain')).toBeTruthy();
		expect(screen.getByText('Onchain receipt')).toBeTruthy();
		expect(screen.getByText(/Mint transaction/i)).toBeTruthy();
	});
});

describe('ChannelsDisplay anchor assurance', () => {
	it('can include anchor assurance without hiding hosted/offchain state', () => {
		render(ChannelsDisplay, { props: { channels, anchorAssurance: hosted } });
		expect(screen.getByText('Anchor assurance')).toBeTruthy();
		expect(screen.getByText('Hosted offchain')).toBeTruthy();
	});
});
