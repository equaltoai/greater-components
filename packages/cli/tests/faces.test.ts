/**
 * Faces Registry Tests
 * Tests for face manifest retrieval and component lookup functions
 */

import { describe, expect, it } from 'vitest';
import {
	faceRegistry,
	getFaceManifest,
	getAllFaceNames,
	getFaceComponents,
	getFaceRecommendedShared,
	isComponentInFace,
} from '../src/registry/faces.js';

describe('faceRegistry', () => {
	it('contains social face', () => {
		expect(faceRegistry.social).toBeDefined();
		expect(faceRegistry.social.name).toBe('social');
		expect(faceRegistry.social.type).toBe('face');
	});

	it('contains blog face', () => {
		expect(faceRegistry.blog).toBeDefined();
		expect(faceRegistry.blog.name).toBe('blog');
		expect(faceRegistry.blog.type).toBe('face');
	});

	it('contains community face', () => {
		expect(faceRegistry.community).toBeDefined();
		expect(faceRegistry.community.name).toBe('community');
		expect(faceRegistry.community.type).toBe('face');
	});

	it('all faces have required fields', () => {
		for (const [name, face] of Object.entries(faceRegistry)) {
			expect(face.name).toBe(name);
			expect(face.type).toBe('face');
			expect(face.description).toBeDefined();
			expect(face.includes).toBeDefined();
			expect(face.includes.primitives).toBeInstanceOf(Array);
			expect(face.includes.shared).toBeInstanceOf(Array);
			expect(face.includes.patterns).toBeInstanceOf(Array);
			expect(face.includes.components).toBeInstanceOf(Array);
		}
	});

	it('all faces have styles configured', () => {
		for (const face of Object.values(faceRegistry)) {
			expect(face.styles).toBeDefined();
			expect(face.styles.main).toBeDefined();
			expect(face.styles.tokens).toBeDefined();
		}
	});

	it('all faces have version and lesserVersion', () => {
		for (const face of Object.values(faceRegistry)) {
			expect(face.version).toBeDefined();
			expect(face.lesserVersion).toBeDefined();
		}
	});
});

describe('getFaceManifest', () => {
	it('returns social face manifest', () => {
		const face = getFaceManifest('social');

		expect(face).not.toBeNull();
		if (face) {
			expect(face.name).toBe('social');
			expect(face.description).toContain('social');
		}
	});

	it('returns blog face manifest', () => {
		const face = getFaceManifest('blog');

		expect(face).not.toBeNull();
		if (face) {
			expect(face.name).toBe('blog');
		}
	});

	it('returns community face manifest', () => {
		const face = getFaceManifest('community');

		expect(face).not.toBeNull();
		if (face) {
			expect(face.name).toBe('community');
		}
	});

	it('returns null for non-existent face', () => {
		const face = getFaceManifest('nonexistent');

		expect(face).toBeNull();
	});

	it('returns null for empty string', () => {
		const face = getFaceManifest('');

		expect(face).toBeNull();
	});
});

describe('getAllFaceNames', () => {
	it('returns array of face names', () => {
		const names = getAllFaceNames();

		expect(names).toBeInstanceOf(Array);
		expect(names.length).toBeGreaterThan(0);
	});

	it('includes social, blog, and community', () => {
		const names = getAllFaceNames();

		expect(names).toContain('social');
		expect(names).toContain('blog');
		expect(names).toContain('community');
	});

	it('returns correct count of faces', () => {
		const names = getAllFaceNames();

		expect(names.length).toBe(Object.keys(faceRegistry).length);
	});
});

describe('getFaceComponents', () => {
	it('returns all components for social face', () => {
		const components = getFaceComponents('social');

		expect(components).toBeInstanceOf(Array);
		expect(components.length).toBeGreaterThan(0);
	});

	it('includes primitives, shared, patterns, and components', () => {
		const components = getFaceComponents('social');
		const face = getFaceManifest('social');

		// Should contain items from all include categories
		if (face) {
			expect(components).toEqual(expect.arrayContaining(face.includes.primitives));
			expect(components).toEqual(expect.arrayContaining(face.includes.shared));
			expect(components).toEqual(expect.arrayContaining(face.includes.patterns));
			expect(components).toEqual(expect.arrayContaining(face.includes.components));
		}
	});

	it('returns empty array for non-existent face', () => {
		const components = getFaceComponents('nonexistent');

		expect(components).toEqual([]);
	});

	it('returns flattened list', () => {
		const components = getFaceComponents('social');

		// All items should be strings, not arrays
		for (const component of components) {
			expect(typeof component).toBe('string');
		}
	});

	it('works for blog face', () => {
		const components = getFaceComponents('blog');

		expect(components).toBeInstanceOf(Array);
		expect(components.length).toBeGreaterThan(0);
	});

	it('works for community face', () => {
		const components = getFaceComponents('community');

		expect(components).toBeInstanceOf(Array);
		expect(components.length).toBeGreaterThan(0);
	});
});

describe('getFaceRecommendedShared', () => {
	it('returns recommended shared modules for social face', () => {
		const shared = getFaceRecommendedShared('social');

		expect(shared).toBeInstanceOf(Array);
		expect(shared.length).toBeGreaterThan(0);
	});

	it('returns recommended shared modules for blog face', () => {
		const shared = getFaceRecommendedShared('blog');

		expect(shared).toBeInstanceOf(Array);
	});

	it('returns recommended shared modules for community face', () => {
		const shared = getFaceRecommendedShared('community');

		expect(shared).toBeInstanceOf(Array);
	});

	it('returns empty array for non-existent face', () => {
		const shared = getFaceRecommendedShared('nonexistent');

		expect(shared).toEqual([]);
	});

	it('returns array of strings', () => {
		const shared = getFaceRecommendedShared('social');

		for (const item of shared) {
			expect(typeof item).toBe('string');
		}
	});
});

describe('isComponentInFace', () => {
	it('returns true for component in social face', () => {
		const face = getFaceManifest('social');
		if (face) {
			// Get a known component from the face
			const primitives = face.includes.primitives;
			if (primitives.length > 0) {
				expect(isComponentInFace(primitives[0], 'social')).toBe(true);
			}
		}
	});

	it('returns true for pattern in social face', () => {
		const face = getFaceManifest('social');
		if (face) {
			const patterns = face.includes.patterns;
			if (patterns.length > 0) {
				expect(isComponentInFace(patterns[0], 'social')).toBe(true);
			}
		}
	});

	it('returns true for shared module in face', () => {
		const face = getFaceManifest('social');
		if (face) {
			const shared = face.includes.shared;
			if (shared.length > 0) {
				expect(isComponentInFace(shared[0], 'social')).toBe(true);
			}
		}
	});

	it('returns false for component not in face', () => {
		expect(isComponentInFace('nonexistent-component', 'social')).toBe(false);
	});

	it('returns false for non-existent face', () => {
		expect(isComponentInFace('button', 'nonexistent')).toBe(false);
	});

	it('returns false for empty component name', () => {
		expect(isComponentInFace('', 'social')).toBe(false);
	});

	it('returns false for empty face name', () => {
		expect(isComponentInFace('button', '')).toBe(false);
	});

	it('is case-sensitive', () => {
		const face = getFaceManifest('social');
		if (face) {
			const primitives = face.includes.primitives;
			if (primitives.length > 0) {
				const component = primitives[0];
				// Test with uppercase should return false if original is lowercase
				expect(isComponentInFace(component.toUpperCase(), 'social')).toBe(
					component.toUpperCase() === component
				);
			}
		}
	});
});

describe('face content validation', () => {
	it('social face includes button primitive', () => {
		const components = getFaceComponents('social');
		expect(components).toContain('button');
	});

	it('social face includes modal primitive', () => {
		const components = getFaceComponents('social');
		expect(components).toContain('modal');
	});

	it('social face includes auth shared module', () => {
		const components = getFaceComponents('social');
		expect(components).toContain('auth');
	});

	it('social face includes timeline component', () => {
		const components = getFaceComponents('social');
		expect(components).toContain('timeline');
	});

	it('social face has correct domain', () => {
		const face = getFaceManifest('social');
		if (face) {
			expect(face.domain).toBe('social');
		}
	});

	it('blog face has correct domain', () => {
		const face = getFaceManifest('blog');
		if (face) {
			expect(face.domain).toBe('blog');
		}
	});

	it('community face has correct domain', () => {
		const face = getFaceManifest('community');
		if (face) {
			expect(face.domain).toBe('community');
		}
	});
});
