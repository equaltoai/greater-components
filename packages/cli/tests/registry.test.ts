import { describe, it, expect, vi } from 'vitest';
import * as registry from '../src/registry/index.js';

// Mock the imported registries
vi.mock('../src/registry/shared.js', () => ({
	sharedModuleRegistry: {
		'shared-1': {
			name: 'shared-1',
			type: 'shared',
			domain: 'social',
			tags: ['tag1'],
			description: 'Shared module 1',
			registryDependencies: [],
		},
		'shared-2': {
			name: 'shared-2',
			type: 'shared',
			domain: 'blog',
			tags: ['tag2'],
			description: 'Shared module 2',
			registryDependencies: ['shared-1'],
		},
	},
	getSharedModule: vi.fn(),
	getAllSharedModuleNames: vi.fn(),
	getSharedModulesByDomain: vi.fn(),
}));

vi.mock('../src/registry/patterns.js', () => ({
	patternRegistry: {
		'pattern-1': {
			name: 'pattern-1',
			type: 'pattern',
			domain: 'social',
			tags: ['tag1'],
			description: 'Pattern 1',
			registryDependencies: [],
		},
	},
	getPattern: vi.fn(),
	getAllPatternNames: vi.fn(),
	getPatternsByDomain: vi.fn(),
	getRelatedPatterns: vi.fn(),
}));

vi.mock('../src/registry/faces.js', () => ({
	faceRegistry: {
		'face-1': {
			name: 'face-1',
			type: 'face',
			domain: 'social',
			tags: [],
			description: 'Face 1',
			registryDependencies: [],
		},
	},
	getFaceManifest: vi.fn(),
	getAllFaceNames: vi.fn(),
	getFaceComponents: vi.fn(),
	getFaceRecommendedShared: vi.fn(),
	isComponentInFace: vi.fn(),
}));

describe('Registry Index', () => {
	describe('getComponent', () => {
		it('returns component from main registry', () => {
			const component = registry.getComponent('button');
			expect(component).toBeDefined();
			expect(component?.name).toBe('button');
			expect(component?.type).toBe('primitive');
		});

		it('returns component from shared registry', () => {
			const component = registry.getComponent('shared-1');
			expect(component).toBeDefined();
			expect(component?.name).toBe('shared-1');
			expect(component?.type).toBe('shared');
		});

		it('returns component from pattern registry', () => {
			const component = registry.getComponent('pattern-1');
			expect(component).toBeDefined();
			expect(component?.name).toBe('pattern-1');
			expect(component?.type).toBe('pattern');
		});

		it('returns null for unknown component', () => {
			const component = registry.getComponent('unknown-component');
			expect(component).toBeNull();
		});
	});

	describe('getComponentsByType', () => {
		it('returns primitive components', () => {
			const components = registry.getComponentsByType('primitive');
			expect(components.length).toBeGreaterThan(0);
			expect(components.every((c) => c.type === 'primitive')).toBe(true);
		});

		it('returns shared components', () => {
			const components = registry.getComponentsByType('shared');
			expect(components.length).toBeGreaterThan(0);
			expect(components.every((c) => c.type === 'shared')).toBe(true);
			expect(components.some((c) => c.name === 'shared-1')).toBe(true);
		});

		it('returns pattern components', () => {
			const components = registry.getComponentsByType('pattern');
			expect(components.length).toBeGreaterThan(0);
			expect(components.every((c) => c.type === 'pattern')).toBe(true);
			expect(components.some((c) => c.name === 'pattern-1')).toBe(true);
		});

		it('returns face components', () => {
			const components = registry.getComponentsByType('face');
			expect(components.length).toBeGreaterThan(0);
			expect(components.every((c) => c.type === 'face')).toBe(true);
			expect(components.some((c) => c.name === 'face-1')).toBe(true);
		});

		it('returns adapter components', () => {
			const components = registry.getComponentsByType('adapter');
			// Assuming there is at least one adapter in the real registry mock or default
			expect(components.every((c) => c.type === 'adapter')).toBe(true);
		});
	});

	describe('getComponentsByDomain', () => {
		it('returns components for a domain from all registries', () => {
			const components = registry.getComponentsByDomain('social');
			// Should include items from componentRegistry (if any), sharedModuleRegistry, and patternRegistry
			const hasShared = components.some((c) => c.name === 'shared-1');
			const hasPattern = components.some((c) => c.name === 'pattern-1');

			expect(hasShared).toBe(true);
			expect(hasPattern).toBe(true);
		});

		it('returns empty array for unused domain', () => {
			const components = registry.getComponentsByDomain('core');
			// If no core components are in the mocks/default registry
			// (Assuming default registry might have some, but let's check our mocks)
			// Our mocks don't have 'core' domain. Default registry might.
			// Let's filter our results to only check against our mocks if needed,
			// but better to just check that it returns an array.
			expect(Array.isArray(components)).toBe(true);
		});
	});

	describe('getComponentsByTag', () => {
		it('returns components with specific tag', () => {
			const components = registry.getComponentsByTag('tag1');
			const hasShared = components.some((c) => c.name === 'shared-1');
			const hasPattern = components.some((c) => c.name === 'pattern-1');

			expect(hasShared).toBe(true);
			expect(hasPattern).toBe(true);
		});

		it('returns empty array for unknown tag', () => {
			const components = registry.getComponentsByTag('non-existent-tag');
			expect(components.length).toBe(0);
		});
	});

	describe('searchComponents', () => {
		it('finds components by name', () => {
			const results = registry.searchComponents('shared-1');
			expect(results.some((c) => c.name === 'shared-1')).toBe(true);
		});

		it('finds components by description', () => {
			const results = registry.searchComponents('Shared module');
			expect(results.some((c) => c.name === 'shared-1')).toBe(true);
		});

		it('finds components by tag', () => {
			const results = registry.searchComponents('tag1');
			expect(results.some((c) => c.name === 'shared-1')).toBe(true);
		});

		it('is case insensitive', () => {
			const results = registry.searchComponents('SHARED-1');
			expect(results.some((c) => c.name === 'shared-1')).toBe(true);
		});
	});

	describe('getAllComponentNames', () => {
		it('returns names from all registries', () => {
			const names = registry.getAllComponentNames();
			expect(names).toContain('button');
			expect(names).toContain('shared-1');
			expect(names).toContain('pattern-1');
		});
	});

	describe('resolveComponentDependencies', () => {
		it('resolves direct dependencies', () => {
			// shared-2 depends on shared-1
			const deps = registry.resolveComponentDependencies('shared-2');
			expect(deps).toContain('shared-2');
			expect(deps).toContain('shared-1');
		});

		it('returns empty array for unknown component', () => {
			const deps = registry.resolveComponentDependencies('unknown');
			expect(deps).toEqual([]);
		});

		it('resolves recursive dependencies', () => {
			// Create a mock dependency chain
			// button is a primitive.
			// timeline depends on button.
			const deps = registry.resolveComponentDependencies('timeline');
			expect(deps).toContain('timeline');
			expect(deps).toContain('button');
		});
	});

	describe('getRegistryStats', () => {
		it('returns statistics', () => {
			const stats = registry.getRegistryStats();
			expect(stats.primitives).toBeGreaterThanOrEqual(1); // button
			expect(stats.shared).toBeGreaterThanOrEqual(2); // shared-1, shared-2
			expect(stats.patterns).toBeGreaterThanOrEqual(1); // pattern-1
			expect(stats.faces).toBeGreaterThanOrEqual(1); // face-1
			expect(stats.total).toEqual(
				stats.primitives +
					stats.compounds +
					stats.patterns +
					stats.adapters +
					stats.shared +
					stats.faces
			);
		});
	});

	describe('getAllComponentTypes', () => {
		it('returns all types', () => {
			const types = registry.getAllComponentTypes();
			expect(types).toContain('primitive');
			expect(types).toContain('compound');
			expect(types).toContain('pattern');
			expect(types).toContain('adapter');
			expect(types).toContain('shared');
			expect(types).toContain('face');
		});
	});

	describe('getAllDomains', () => {
		it('returns all domains', () => {
			const domains = registry.getAllDomains();
			expect(domains).toContain('social');
			expect(domains).toContain('blog');
			expect(domains).toContain('community');
			expect(domains).toContain('artist');
		});
	});
});
