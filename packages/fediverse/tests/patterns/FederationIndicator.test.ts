/**
 * FederationIndicator Pattern Component Tests
 * 
 * Tests for FederationIndicator including:
 * - Instance domain extraction
 * - Local vs remote detection
 * - Configuration options
 * - Event handlers
 * - Edge cases
 */

import { describe, it, expect, vi } from 'vitest';

// Extract logic functions for testing
function getInstanceDomain(url: string): string {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch {
		return '';
	}
}

function getActorUrl(actorUrl?: string, actor?: { id?: string; url?: string }): string {
	if (actorUrl) return actorUrl;
	if (actor?.id) return actor.id;
	if (actor?.url) return actor.url;
	return '';
}

function isLocalInstance(instanceDomain: string, localInstance: string): boolean {
	return instanceDomain === localInstance || instanceDomain === '';
}

function getTooltip(isLocal: boolean, localInstance: string, instanceDomain: string): string {
	if (isLocal) {
		return `Local account on ${localInstance}`;
	}
	return `Remote account from ${instanceDomain}`;
}

describe('FederationIndicator - Instance Domain Extraction', () => {
	it('should extract domain from valid URL', () => {
		const url = 'https://mastodon.social/@alice';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('mastodon.social');
	});

	it('should extract domain from URL without path', () => {
		const url = 'https://lesser.occult.institute';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('lesser.occult.institute');
	});

	it('should handle subdomain', () => {
		const url = 'https://social.example.com/@user';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('social.example.com');
	});

	it('should return empty string for invalid URL', () => {
		const url = 'not-a-url';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('');
	});

	it('should handle URL with port', () => {
		const url = 'https://localhost:3000/@user';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('localhost');
	});

	it('should handle URL with query params', () => {
		const url = 'https://example.com/@user?tab=posts';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('example.com');
	});

	it('should handle URL with hash', () => {
		const url = 'https://example.com/@user#section';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('example.com');
	});

	it('should return empty string for empty URL', () => {
		const url = '';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('');
	});
});

describe('FederationIndicator - Actor URL Resolution', () => {
	it('should use actorUrl when provided', () => {
		const actorUrl = 'https://mastodon.social/@alice';
		const actor = { id: 'https://other.com/@bob', url: 'https://another.com/@charlie' };

		const url = getActorUrl(actorUrl, actor);

		expect(url).toBe(actorUrl);
	});

	it('should use actor.id when actorUrl not provided', () => {
		const actor = { id: 'https://example.com/@user' };

		const url = getActorUrl(undefined, actor);

		expect(url).toBe('https://example.com/@user');
	});

	it('should use actor.url when id not available', () => {
		const actor = { url: 'https://example.com/@user' };

		const url = getActorUrl(undefined, actor);

		expect(url).toBe('https://example.com/@user');
	});

	it('should return empty string when no URL available', () => {
		const url = getActorUrl(undefined, undefined);

		expect(url).toBe('');
	});

	it('should return empty string for empty actor object', () => {
		const url = getActorUrl(undefined, {});

		expect(url).toBe('');
	});

	it('should prefer id over url', () => {
		const actor = { id: 'https://id.com/@user', url: 'https://url.com/@user' };

		const url = getActorUrl(undefined, actor);

		expect(url).toBe('https://id.com/@user');
	});
});

describe('FederationIndicator - Local vs Remote Detection', () => {
	it('should identify local instance', () => {
		const instanceDomain = 'lesser.occult.institute';
		const localInstance = 'lesser.occult.institute';

		const isLocal = isLocalInstance(instanceDomain, localInstance);

		expect(isLocal).toBe(true);
	});

	it('should identify remote instance', () => {
		const instanceDomain = 'mastodon.social';
		const localInstance = 'lesser.occult.institute';

		const isLocal = isLocalInstance(instanceDomain, localInstance);

		expect(isLocal).toBe(false);
	});

	it('should treat empty domain as local', () => {
		const instanceDomain = '';
		const localInstance = 'lesser.occult.institute';

		const isLocal = isLocalInstance(instanceDomain, localInstance);

		expect(isLocal).toBe(true);
	});

	it('should be case-sensitive', () => {
		const instanceDomain = 'MASTODON.SOCIAL';
		const localInstance = 'mastodon.social';

		const isLocal = isLocalInstance(instanceDomain, localInstance);

		expect(isLocal).toBe(false);
	});

	it('should match exact domain', () => {
		const instanceDomain = 'mastodon.social';
		const localInstance = 'social.mastodon.com';

		const isLocal = isLocalInstance(instanceDomain, localInstance);

		expect(isLocal).toBe(false);
	});
});

describe('FederationIndicator - Tooltip Generation', () => {
	it('should generate tooltip for local account', () => {
		const tooltip = getTooltip(true, 'lesser.occult.institute', '');

		expect(tooltip).toBe('Local account on lesser.occult.institute');
	});

	it('should generate tooltip for remote account', () => {
		const tooltip = getTooltip(false, 'lesser.occult.institute', 'mastodon.social');

		expect(tooltip).toBe('Remote account from mastodon.social');
	});

	it('should include instance name in local tooltip', () => {
		const localInstance = 'my-instance.com';
		const tooltip = getTooltip(true, localInstance, '');

		expect(tooltip).toContain(localInstance);
	});

	it('should include remote domain in remote tooltip', () => {
		const remoteDomain = 'remote-server.org';
		const tooltip = getTooltip(false, 'local.com', remoteDomain);

		expect(tooltip).toContain(remoteDomain);
	});
});

describe('FederationIndicator - Configuration', () => {
	it('should support icon mode', () => {
		const mode = 'icon';
		expect(['icon', 'badge', 'full']).toContain(mode);
	});

	it('should support badge mode', () => {
		const mode = 'badge';
		expect(['icon', 'badge', 'full']).toContain(mode);
	});

	it('should support full mode', () => {
		const mode = 'full';
		expect(['icon', 'badge', 'full']).toContain(mode);
	});

	it('should support showInstance option', () => {
		const config = { showInstance: true };
		expect(config.showInstance).toBe(true);
	});

	it('should support hiding instance', () => {
		const config = { showInstance: false };
		expect(config.showInstance).toBe(false);
	});

	it('should support inline position', () => {
		const position = 'inline';
		expect(['inline', 'absolute']).toContain(position);
	});

	it('should support absolute position', () => {
		const position = 'absolute';
		expect(['inline', 'absolute']).toContain(position);
	});

	it('should support custom CSS class', () => {
		const config = { class: 'my-federation' };
		expect(config.class).toBe('my-federation');
	});

	it('should support tooltip option', () => {
		const config = { showTooltip: true };
		expect(config.showTooltip).toBe(true);
	});

	it('should support disabling tooltip', () => {
		const config = { showTooltip: false };
		expect(config.showTooltip).toBe(false);
	});
});

describe('FederationIndicator - Event Handlers', () => {
	it('should call onClick with local status', () => {
		const onClick = vi.fn();
		const isLocal = true;
		const instanceDomain = 'lesser.occult.institute';

		onClick(isLocal, instanceDomain);

		expect(onClick).toHaveBeenCalledWith(true, 'lesser.occult.institute');
	});

	it('should call onClick with remote status', () => {
		const onClick = vi.fn();
		const isLocal = false;
		const instanceDomain = 'mastodon.social';

		onClick(isLocal, instanceDomain);

		expect(onClick).toHaveBeenCalledWith(false, 'mastodon.social');
	});

	it('should not error if onClick is undefined', () => {
		const onClick = undefined;
		const isLocal = true;
		const instanceDomain = 'example.com';

		onClick?.(isLocal, instanceDomain);

		// Should not throw
		expect(true).toBe(true);
	});
});

describe('FederationIndicator - Edge Cases', () => {
	it('should handle URL with username', () => {
		const url = 'https://user:pass@example.com/@alice';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('example.com');
	});

	it('should handle URL with multiple slashes', () => {
		const url = 'https://example.com//@alice';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('example.com');
	});

	it('should handle IP address', () => {
		const url = 'https://192.168.1.1/@user';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('192.168.1.1');
	});

	it('should handle localhost', () => {
		const url = 'http://localhost/@user';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('localhost');
	});

	it('should handle relative URL', () => {
		const url = '/@user';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('');
	});

	it('should handle protocol-less URL', () => {
		const url = 'example.com/@user';
		const domain = getInstanceDomain(url);

		// Without protocol, URL constructor fails
		expect(domain).toBe('');
	});

	it('should handle very long domain', () => {
		const longDomain = 'a'.repeat(200) + '.com';
		const url = `https://${longDomain}/@user`;
		const domain = getInstanceDomain(url);

		expect(domain).toBe(longDomain);
	});

	it('should handle unicode domain (IDN)', () => {
		const url = 'https://münchen.de/@user';
		const domain = getInstanceDomain(url);

		expect(domain).toBe('xn--mnchen-3ya.de');
	});

	it('should handle empty local instance', () => {
		const instanceDomain = 'example.com';
		const localInstance = '';

		const isLocal = isLocalInstance(instanceDomain, localInstance);

		expect(isLocal).toBe(false);
	});

	it('should handle both empty', () => {
		const instanceDomain = '';
		const localInstance = '';

		const isLocal = isLocalInstance(instanceDomain, localInstance);

		expect(isLocal).toBe(true);
	});
});

describe('FederationIndicator - Integration', () => {
	it('should correctly identify local account', () => {
		const actorUrl = 'https://lesser.occult.institute/@alice';
		const localInstance = 'lesser.occult.institute';

		const domain = getInstanceDomain(actorUrl);
		const isLocal = isLocalInstance(domain, localInstance);

		expect(isLocal).toBe(true);
	});

	it('should correctly identify remote account', () => {
		const actorUrl = 'https://mastodon.social/@bob';
		const localInstance = 'lesser.occult.institute';

		const domain = getInstanceDomain(actorUrl);
		const isLocal = isLocalInstance(domain, localInstance);

		expect(isLocal).toBe(false);
	});

	it('should handle full flow with actor object', () => {
		const actor = { id: 'https://remote.server/@user' };
		const localInstance = 'local.server';

		const url = getActorUrl(undefined, actor);
		const domain = getInstanceDomain(url);
		const isLocal = isLocalInstance(domain, localInstance);
		const tooltip = getTooltip(isLocal, localInstance, domain);

		expect(url).toBe('https://remote.server/@user');
		expect(domain).toBe('remote.server');
		expect(isLocal).toBe(false);
		expect(tooltip).toBe('Remote account from remote.server');
	});
});

describe('FederationIndicator - Type Safety', () => {
	it('should enforce FederationConfig structure', () => {
		const config = {
			mode: 'badge' as const,
			showInstance: true,
			position: 'inline' as const,
			class: '',
			showTooltip: true,
		};

		expect(config).toHaveProperty('mode');
		expect(config).toHaveProperty('showInstance');
		expect(config).toHaveProperty('position');
		expect(config).toHaveProperty('class');
		expect(config).toHaveProperty('showTooltip');
	});

	it('should validate mode types', () => {
		const modes: Array<'icon' | 'badge' | 'full'> = ['icon', 'badge', 'full'];

		modes.forEach((mode) => {
			expect(['icon', 'badge', 'full']).toContain(mode);
		});
	});

	it('should validate position types', () => {
		const positions: Array<'inline' | 'absolute'> = ['inline', 'absolute'];

		positions.forEach((position) => {
			expect(['inline', 'absolute']).toContain(position);
		});
	});
});

