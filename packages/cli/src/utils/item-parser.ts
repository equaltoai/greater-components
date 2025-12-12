/**
 * Item Name Parser
 * Parses and categorizes CLI item arguments into their respective types
 */

import { getComponent, type ComponentMetadata, type FaceManifest } from '../registry/index.js';
import { getFaceManifest } from '../registry/faces.js';
import { getSharedModule, type SharedModuleMetadata } from '../registry/shared.js';
import { getPattern, type PatternMetadata } from '../registry/patterns.js';

/**
 * Parsed item result
 */
export interface ParsedItem {
	/** Original input string */
	input: string;
	/** Resolved name (without prefix) */
	name: string;
	/** Item type category */
	type: 'primitive' | 'compound' | 'pattern' | 'shared' | 'face' | 'adapter';
	/** Whether the item was found in registry */
	found: boolean;
	/** Component metadata if found */
	metadata: ComponentMetadata | FaceManifest | SharedModuleMetadata | PatternMetadata | null;
	/** Error message if not found */
	error?: string;
}

/**
 * Parse result containing categorized items
 */
export interface ParseResult {
	/** Successfully parsed items */
	items: ParsedItem[];
	/** Items that could not be found */
	notFound: ParsedItem[];
	/** Categorized items by type */
	byType: {
		primitives: ParsedItem[];
		compounds: ParsedItem[];
		patterns: ParsedItem[];
		shared: ParsedItem[];
		faces: ParsedItem[];
		adapters: ParsedItem[];
	};
}

/**
 * Prefix patterns for item types
 */
const PREFIXES = {
	face: /^faces?\//i,
	shared: /^shared\//i,
	pattern: /^patterns?\//i,
} as const;

/**
 * Parse a single item name and resolve its type
 */
export function parseItemName(input: string): ParsedItem {
	const trimmed = input.trim().toLowerCase();

	// Check for face prefix (faces/social, face/social)
	if (PREFIXES.face.test(trimmed)) {
		const name = trimmed.replace(PREFIXES.face, '');
		const manifest = getFaceManifest(name);
		return {
			input,
			name,
			type: 'face',
			found: !!manifest,
			metadata: manifest,
			error: manifest ? undefined : `Face "${name}" not found in registry`,
		};
	}

	// Check for shared prefix (shared/auth)
	if (PREFIXES.shared.test(trimmed)) {
		const name = trimmed.replace(PREFIXES.shared, '');
		const module = getSharedModule(name);
		return {
			input,
			name,
			type: 'shared',
			found: !!module,
			metadata: module,
			error: module ? undefined : `Shared module "${name}" not found in registry`,
		};
	}

	// Check for pattern prefix (patterns/thread-view, pattern/thread-view)
	if (PREFIXES.pattern.test(trimmed)) {
		const name = trimmed.replace(PREFIXES.pattern, '');
		const pattern = getPattern(name);
		return {
			input,
			name,
			type: 'pattern',
			found: !!pattern,
			metadata: pattern,
			error: pattern ? undefined : `Pattern "${name}" not found in registry`,
		};
	}

	// No prefix - try to resolve from unified registry
	const component = getComponent(trimmed);

	if (component) {
		return {
			input,
			name: trimmed,
			type: component.type as ParsedItem['type'],
			found: true,
			metadata: component,
		};
	}

	// Check if it's a face without prefix
	const faceManifest = getFaceManifest(trimmed);
	if (faceManifest) {
		return {
			input,
			name: trimmed,
			type: 'face',
			found: true,
			metadata: faceManifest,
		};
	}

	// Not found anywhere
	return {
		input,
		name: trimmed,
		type: 'primitive', // Default assumption
		found: false,
		metadata: null,
		error: `Item "${trimmed}" not found in any registry`,
	};
}

/**
 * Parse multiple item names and categorize them
 */
export function parseItems(inputs: string[]): ParseResult {
	const result: ParseResult = {
		items: [],
		notFound: [],
		byType: {
			primitives: [],
			compounds: [],
			patterns: [],
			shared: [],
			faces: [],
			adapters: [],
		},
	};

	for (const input of inputs) {
		const parsed = parseItemName(input);
		result.items.push(parsed);

		if (!parsed.found) {
			result.notFound.push(parsed);
			continue;
		}

		// Categorize by type
		switch (parsed.type) {
			case 'primitive':
				result.byType.primitives.push(parsed);
				break;
			case 'compound':
				result.byType.compounds.push(parsed);
				break;
			case 'pattern':
				result.byType.patterns.push(parsed);
				break;
			case 'shared':
				result.byType.shared.push(parsed);
				break;
			case 'face':
				result.byType.faces.push(parsed);
				break;
			case 'adapter':
				result.byType.adapters.push(parsed);
				break;
		}
	}

	return result;
}

/**
 * Validate that all items were found
 */
export function validateParseResult(result: ParseResult): { valid: boolean; errors: string[] } {
	if (result.notFound.length === 0) {
		return { valid: true, errors: [] };
	}

	return {
		valid: false,
		errors: result.notFound.map((item) => item.error || `Unknown item: ${item.input}`),
	};
}
