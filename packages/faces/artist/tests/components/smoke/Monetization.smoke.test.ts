import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { Monetization } from '../../../src/components/Monetization/index.ts';
import { createMockArtist } from '../../mocks/mockArtist.ts';
import { createMockArtwork } from '../../mocks/mockArtwork.ts';

describe('Monetization Smoke Tests', () => {
	const mockArtist = createMockArtist('m1');
	const mockArtwork = createMockArtwork('mw1');

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders TipJar', () => {
		render(Monetization.TipJar, {
			props: {
				artist: mockArtist as any,
				config: {},
			},
		});
		expect(console.error).not.toHaveBeenCalled();
	});

	it('renders DirectPurchase', () => {
		render(Monetization.DirectPurchase, {
			props: {
				artwork: mockArtwork,
				pricing: { price: 100, currency: 'USD' },
			},
		});
		expect(console.error).not.toHaveBeenCalled();
	});

	it('renders PremiumBadge', () => {
		render(Monetization.PremiumBadge, {
			props: {
				tier: 'pro',
			},
		});
		expect(console.error).not.toHaveBeenCalled();
	});

	it('renders ProtectionTools', () => {
		render(Monetization.ProtectionTools, {
			props: {
				artwork: mockArtwork,
			},
		});
		expect(console.error).not.toHaveBeenCalled();
	});
});
