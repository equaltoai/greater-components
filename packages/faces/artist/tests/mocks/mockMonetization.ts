import type { InstitutionalAccount } from '../../src/types/monetization.js';

/**
 * Creates a mock institutional account
 */
export function createMockInstitutionalAccount(
	id: string,
	overrides: Partial<InstitutionalAccount> = {}
): InstitutionalAccount {
	return {
		id,
		type: 'gallery',
		name: `Institution ${id}`,
		description: `A prestigious institution ${id}`,
		logo: `https://example.com/logos/${id}.jpg`,
		banner: `https://example.com/banners/${id}.jpg`,
		website: `https://institution${id}.example.com`,
		isVerified: true,
		createdAt: new Date().toISOString(),
		...overrides,
	};
}
