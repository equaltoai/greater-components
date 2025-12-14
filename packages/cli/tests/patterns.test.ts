/**
 * Patterns Registry Tests
 * Tests for pattern metadata retrieval and lookup functions
 */

import { describe, expect, it } from 'vitest';
import {
	patternRegistry,
	getPattern,
	getAllPatternNames,
	getPatternsByDomain,
	getRelatedPatterns,
} from '../src/registry/patterns.js';

describe('patternRegistry', () => {
	it('contains thread-view pattern', () => {
		expect(patternRegistry['thread-view']).toBeDefined();
		expect(patternRegistry['thread-view'].name).toBe('thread-view');
		expect(patternRegistry['thread-view'].type).toBe('pattern');
	});

	it('contains moderation-tools pattern', () => {
		expect(patternRegistry['moderation-tools']).toBeDefined();
		expect(patternRegistry['moderation-tools'].name).toBe('moderation-tools');
	});

	it('contains visibility-selector pattern', () => {
		expect(patternRegistry['visibility-selector']).toBeDefined();
	});

	it('contains content-warning pattern', () => {
		expect(patternRegistry['content-warning']).toBeDefined();
	});

	it('contains custom-emoji-picker pattern', () => {
		expect(patternRegistry['custom-emoji-picker']).toBeDefined();
	});

	it('contains federation-indicator pattern', () => {
		expect(patternRegistry['federation-indicator']).toBeDefined();
	});

	it('contains instance-picker pattern', () => {
		expect(patternRegistry['instance-picker']).toBeDefined();
	});

	it('contains poll-composer pattern', () => {
		expect(patternRegistry['poll-composer']).toBeDefined();
	});

	it('contains media-composer pattern', () => {
		expect(patternRegistry['media-composer']).toBeDefined();
	});

	it('contains bookmark-manager pattern', () => {
		expect(patternRegistry['bookmark-manager']).toBeDefined();
	});

	it('all patterns have required fields', () => {
		for (const [name, pattern] of Object.entries(patternRegistry)) {
			expect(pattern.name).toBe(name);
			expect(pattern.type).toBe('pattern');
			expect(pattern.description).toBeDefined();
			expect(pattern.useCase).toBeDefined();
			expect(pattern.files).toBeInstanceOf(Array);
			expect(pattern.dependencies).toBeInstanceOf(Array);
			expect(pattern.registryDependencies).toBeInstanceOf(Array);
			expect(pattern.version).toBeDefined();
			expect(pattern.domain).toBeDefined();
		}
	});

	it('all patterns have valid domain', () => {
		for (const pattern of Object.values(patternRegistry)) {
			expect(['social', 'blog', 'community', 'core', 'artist']).toContain(pattern.domain);
		}
	});

	it('all patterns have tags', () => {
		for (const pattern of Object.values(patternRegistry)) {
			expect(pattern.tags).toBeInstanceOf(Array);
			expect(pattern.tags.length).toBeGreaterThan(0);
		}
	});
});

describe('getPattern', () => {
	it('returns thread-view pattern', () => {
		const pattern = getPattern('thread-view');

		expect(pattern).not.toBeNull();
		if (pattern) {
			expect(pattern.name).toBe('thread-view');
			expect(pattern.type).toBe('pattern');
		}
	});

	it('returns moderation-tools pattern', () => {
		const pattern = getPattern('moderation-tools');

		expect(pattern).not.toBeNull();
		if (pattern) {
			expect(pattern.name).toBe('moderation-tools');
		}
	});

	it('returns visibility-selector pattern', () => {
		const pattern = getPattern('visibility-selector');

		expect(pattern).not.toBeNull();
		if (pattern) {
			expect(pattern.name).toBe('visibility-selector');
		}
	});

	it('returns content-warning pattern', () => {
		const pattern = getPattern('content-warning');

		expect(pattern).not.toBeNull();
		if (pattern) {
			expect(pattern.name).toBe('content-warning');
		}
	});

	it('returns null for non-existent pattern', () => {
		const pattern = getPattern('nonexistent');

		expect(pattern).toBeNull();
	});

	it('returns null for empty string', () => {
		const pattern = getPattern('');

		expect(pattern).toBeNull();
	});

	it('is case-sensitive', () => {
		const pattern = getPattern('THREAD-VIEW');

		expect(pattern).toBeNull();
	});
});

describe('getAllPatternNames', () => {
	it('returns array of pattern names', () => {
		const names = getAllPatternNames();

		expect(names).toBeInstanceOf(Array);
		expect(names.length).toBeGreaterThan(0);
	});

	it('includes all known patterns', () => {
		const names = getAllPatternNames();

		expect(names).toContain('thread-view');
		expect(names).toContain('moderation-tools');
		expect(names).toContain('visibility-selector');
		expect(names).toContain('content-warning');
		expect(names).toContain('custom-emoji-picker');
		expect(names).toContain('federation-indicator');
		expect(names).toContain('instance-picker');
		expect(names).toContain('poll-composer');
		expect(names).toContain('media-composer');
		expect(names).toContain('bookmark-manager');
	});

	it('returns correct count of patterns', () => {
		const names = getAllPatternNames();

		expect(names.length).toBe(Object.keys(patternRegistry).length);
	});

	it('returns array of strings', () => {
		const names = getAllPatternNames();

		for (const name of names) {
			expect(typeof name).toBe('string');
		}
	});
});

describe('getPatternsByDomain', () => {
	it('returns patterns for social domain', () => {
		const patterns = getPatternsByDomain('social');

		expect(patterns).toBeInstanceOf(Array);
		expect(patterns.length).toBeGreaterThan(0);

		for (const pattern of patterns) {
			expect(pattern.domain).toBe('social');
		}
	});

	it('returns empty array for non-existent domain', () => {
		const patterns = getPatternsByDomain('nonexistent' as 'social');

		expect(patterns).toEqual([]);
	});

	it('all returned patterns have correct domain', () => {
		const domains = ['social', 'blog', 'community', 'core'] as const;

		for (const domain of domains) {
			const patterns = getPatternsByDomain(domain);

			for (const pattern of patterns) {
				expect(pattern.domain).toBe(domain);
			}
		}
	});

	it('returns PatternMetadata objects', () => {
		const patterns = getPatternsByDomain('social');

		for (const pattern of patterns) {
			expect(pattern.name).toBeDefined();
			expect(pattern.type).toBe('pattern');
			expect(pattern.useCase).toBeDefined();
		}
	});
});

describe('getRelatedPatterns', () => {
	it('returns related patterns for thread-view', () => {
		const pattern = getPattern('thread-view');

		if (pattern?.relatedPatterns && pattern.relatedPatterns.length > 0) {
			const related = getRelatedPatterns('thread-view');

			expect(related).toBeInstanceOf(Array);
			expect(related.length).toBeGreaterThan(0);
		}
	});

	it('returns related patterns for visibility-selector', () => {
		const pattern = getPattern('visibility-selector');

		if (pattern?.relatedPatterns && pattern.relatedPatterns.length > 0) {
			const related = getRelatedPatterns('visibility-selector');

			expect(related).toBeInstanceOf(Array);
			expect(related.length).toBeGreaterThan(0);
		}
	});

	it('returns related patterns for content-warning', () => {
		const pattern = getPattern('content-warning');

		if (pattern?.relatedPatterns && pattern.relatedPatterns.length > 0) {
			const related = getRelatedPatterns('content-warning');

			expect(related).toBeInstanceOf(Array);
			expect(related.length).toBeGreaterThan(0);
		}
	});

	it('returns empty array for non-existent pattern', () => {
		const related = getRelatedPatterns('nonexistent');

		expect(related).toEqual([]);
	});

	it('returns empty array for pattern without related patterns', () => {
		// Find a pattern without related patterns
		const patternWithoutRelated = Object.values(patternRegistry).find(
			(p) => !p.relatedPatterns || p.relatedPatterns.length === 0
		);

		if (patternWithoutRelated) {
			const related = getRelatedPatterns(patternWithoutRelated.name);
			expect(related).toEqual([]);
		}
	});

	it('returns PatternMetadata objects', () => {
		const pattern = getPattern('thread-view');

		if (pattern?.relatedPatterns && pattern.relatedPatterns.length > 0) {
			const related = getRelatedPatterns('thread-view');

			for (const relatedPattern of related) {
				expect(relatedPattern.name).toBeDefined();
				expect(relatedPattern.type).toBe('pattern');
				expect(relatedPattern.useCase).toBeDefined();
			}
		}
	});

	it('filters out non-existent related patterns', () => {
		// This tests the filter that removes null values
		const related = getRelatedPatterns('thread-view');

		for (const pattern of related) {
			expect(pattern).not.toBeNull();
			expect(pattern.name).toBeDefined();
		}
	});
});

describe('pattern content validation', () => {
	it('thread-view has correct structure', () => {
		const pattern = getPattern('thread-view');

		if (pattern) {
			expect(pattern.description).toContain('thread');
			expect(pattern.useCase).toBeDefined();
			expect(pattern.files.length).toBeGreaterThan(0);
		}
	});

	it('moderation-tools has correct structure', () => {
		const pattern = getPattern('moderation-tools');

		if (pattern) {
			expect(pattern.description).toContain('Block');
			expect(pattern.description).toContain('mute');
			expect(pattern.registryDependencies.length).toBeGreaterThan(0);
		}
	});

	it('visibility-selector has correct structure', () => {
		const pattern = getPattern('visibility-selector');

		if (pattern) {
			expect(pattern.description).toContain('visibility');
			expect(pattern.useCase).toContain('visibility');
		}
	});

	it('content-warning has related patterns', () => {
		const pattern = getPattern('content-warning');

		if (pattern) {
			expect(pattern.relatedPatterns).toBeDefined();
			if (pattern.relatedPatterns) {
				expect(pattern.relatedPatterns.length).toBeGreaterThan(0);
			}
		}
	});

	it('patterns have svelte dependency', () => {
		for (const pattern of Object.values(patternRegistry)) {
			const hasSvelteDep = pattern.dependencies.some((dep) => dep.name === 'svelte');
			expect(hasSvelteDep).toBe(true);
		}
	});

	it('pattern files have correct types', () => {
		for (const pattern of Object.values(patternRegistry)) {
			for (const file of pattern.files) {
				expect(['component', 'types', 'style', 'utils']).toContain(file.type);
			}
		}
	});
});

describe('pattern integration', () => {
	it('can iterate all patterns and get details', () => {
		const names = getAllPatternNames();

		for (const name of names) {
			const pattern = getPattern(name);
			expect(pattern).not.toBeNull();
			if (pattern) {
				expect(pattern.name).toBe(name);
			}
		}
	});

	it('can find patterns with specific dependencies', () => {
		const patternsWithModal = Object.values(patternRegistry).filter((pattern) =>
			pattern.registryDependencies.includes('modal')
		);

		expect(patternsWithModal.length).toBeGreaterThan(0);
	});

	it('can find patterns with specific tags', () => {
		const patternsWithActivityPub = Object.values(patternRegistry).filter((pattern) =>
			pattern.tags.includes('activitypub')
		);

		expect(patternsWithActivityPub.length).toBeGreaterThan(0);
	});
});
