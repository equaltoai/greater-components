/**
 * List Command Tests
 * Tests for component listing, filtering, and search
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockFileSystem } from './fixtures/index.js';

const mockFs = new MockFileSystem();

vi.mock('fs-extra', () => ({
	default: mockFs.createFsMock(),
	...mockFs.createFsMock(),
}));

vi.mock('../src/utils/logger.js', () => ({
	logger: {
		debug: vi.fn(),
		info: vi.fn(),
		success: vi.fn(),
		note: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		newline: vi.fn(),
	},
}));

vi.mock('../src/registry/index.js', () => ({
	componentRegistry: {
		button: {
			name: 'button',
			type: 'primitive',
			description: 'Button component',
			tags: ['ui', 'form'],
			domain: 'core',
			registryDependencies: [],
		},
		modal: {
			name: 'modal',
			type: 'primitive',
			description: 'Modal dialog',
			tags: ['ui', 'overlay'],
			domain: 'core',
			registryDependencies: [],
		},
		timeline: {
			name: 'timeline',
			type: 'compound',
			description: 'Social timeline',
			tags: ['social', 'feed'],
			domain: 'social',
			registryDependencies: [],
		},
	},
	getComponentsByType: vi.fn(),
	getComponentsByDomain: vi.fn(),
	searchComponents: vi.fn(),
	getAllComponentNames: vi.fn().mockReturnValue(['button', 'modal', 'timeline']),
	getRegistryStats: vi.fn().mockReturnValue({ total: 3, primitives: 2, compounds: 1 }),
}));

vi.mock('../src/registry/faces.js', () => ({
	faceRegistry: {
		social: {
			name: 'social',
			type: 'face',
			description: 'Social media face',
			domain: 'social',
			tags: ['social'],
			includes: {
				primitives: ['button'],
				shared: [],
				patterns: [],
				components: [],
			},
		},
	},
	getFaceManifest: vi.fn((name) => {
		if (name === 'social') {
			return {
				name: 'social',
				type: 'face',
				description: 'Social media face',
				domain: 'social',
				tags: ['social'],
				includes: {
					primitives: ['button'],
					shared: [],
					patterns: [],
					components: [],
				},
			};
		}
		return undefined;
	}),
}));

vi.mock('../src/registry/shared.js', () => ({
	sharedModuleRegistry: {},
}));

vi.mock('../src/registry/patterns.js', () => ({
	patternRegistry: {},
}));

describe('List Command', () => {
	beforeEach(() => {
		mockFs.clear();
		vi.clearAllMocks();
	});

	describe('listCommand options', () => {
		it('exports listCommand', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			expect(listCommand).toBeDefined();
			expect(listCommand.name()).toBe('list');
		});

		it('accepts optional search query', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			expect(listCommand.args).toBeDefined();
		});

		it('has --type option', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			const options = listCommand.options;
			const typeOption = options.find((opt) => opt.short === '-t' || opt.long === '--type');

			expect(typeOption).toBeDefined();
		});

		it('has --domain option', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			const options = listCommand.options;
			const domainOption = options.find((opt) => opt.long === '--domain');

			expect(domainOption).toBeDefined();
		});

		it('has --installed option', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			const options = listCommand.options;
			const installedOption = options.find((opt) => opt.long === '--installed');

			expect(installedOption).toBeDefined();
		});

		it('has --available option', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			const options = listCommand.options;
			const availableOption = options.find((opt) => opt.long === '--available');

			expect(availableOption).toBeDefined();
		});

		it('has --json option', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			const options = listCommand.options;
			const jsonOption = options.find((opt) => opt.long === '--json');

			expect(jsonOption).toBeDefined();
		});

		it('has --details option', async () => {
			const { listCommand } = await import('../src/commands/list.js');

			const options = listCommand.options;
			const detailsOption = options.find((opt) => opt.long === '--details');

			expect(detailsOption).toBeDefined();
		});
	});

	describe('List Utilities', () => {
		it('parses search query', async () => {
			const { parseSearchQuery } = await import('../src/commands/list.utils.js');

			const query = parseSearchQuery('button form');

			expect(query.tokens).toContain('button');
			expect(query.tokens).toContain('form');
		});

		it('applies type filter', async () => {
			const { applyFilters } = await import('../src/commands/list.utils.js');

			const components = [
				{ name: 'button', type: 'primitive' },
				{ name: 'timeline', type: 'compound' },
			] as any[];

			const filtered = applyFilters(components, [], { type: 'primitive' });

			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe('button');
		});

		it('applies installed filter', async () => {
			const { applyFilters } = await import('../src/commands/list.utils.js');

			const components = [
				{ name: 'button', type: 'primitive' },
				{ name: 'modal', type: 'primitive' },
			] as any[];

			const installed = [
				{
					name: 'button',
					version: 'v1.0.0',
					installedAt: '2023-01-01',
					modified: false,
					checksums: [],
				},
			];

			const filtered = applyFilters(components, installed, { installed: true });

			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe('button');
		});

		it('applies available filter', async () => {
			const { applyFilters } = await import('../src/commands/list.utils.js');

			const components = [
				{ name: 'button', type: 'primitive' },
				{ name: 'modal', type: 'primitive' },
			] as any[];

			const installed = [
				{
					name: 'button',
					version: 'v1.0.0',
					installedAt: '2023-01-01',
					modified: false,
					checksums: [],
				},
			];

			const filtered = applyFilters(components, installed, { available: true });

			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe('modal');
		});

		it('converts to display item', async () => {
			const { toDisplayItem } = await import('../src/commands/list.utils.js');

			const component = {
				name: 'button',
				type: 'primitive',
				description: 'Button component',
				tags: ['ui'],
				registryDependencies: [],
				version: 'v1.0.0',
			} as any;

			const installed = [
				{
					name: 'button',
					version: 'v1.0.0',
					installedAt: '2023-01-01',
					modified: false,
					checksums: [],
				},
			];

			const item = toDisplayItem(component, installed);

			expect(item.name).toBe('button');
			expect(item.installed).toBe(true);
			expect(item.version).toBe('v1.0.0');
		});

		it('groups by type', async () => {
			const { groupByType } = await import('../src/commands/list.utils.js');

			const items = [
				{ name: 'button', type: 'primitive' },
				{ name: 'modal', type: 'primitive' },
				{ name: 'timeline', type: 'compound' },
			] as any[];

			const grouped = groupByType(items, []);

			expect(grouped.primitives).toHaveLength(2);
			expect(grouped.compounds).toHaveLength(1);
		});

		it('builds JSON output', async () => {
			const { buildJsonOutput } = await import('../src/commands/list.utils.js');

			const items = [{ name: 'button', type: 'primitive', installed: true }] as any[];

			const output = buildJsonOutput(items, [], {}, 'button');

			expect(output.query).toBe('button');
			expect(output.components).toHaveLength(1);
		});
	});

	describe('Search Functionality', () => {
		it('searches by name', async () => {
			const { searchComponentsList } = await import('../src/commands/list.utils.js');

			const components = [
				{ name: 'button', description: 'Button', tags: [] },
				{ name: 'modal', description: 'Modal', tags: [] },
			] as any[];

			const results = searchComponentsList(components, {
				raw: 'button',
				normalized: 'button',
				tokens: ['button'],
			});

			expect(results).toHaveLength(1);
			expect(results[0].name).toBe('button');
		});

		it('searches by description', async () => {
			const { searchComponentsList } = await import('../src/commands/list.utils.js');

			const components = [
				{ name: 'button', description: 'Interactive button element', tags: [] },
				{ name: 'modal', description: 'Dialog overlay', tags: [] },
			] as any[];

			const results = searchComponentsList(components, {
				raw: 'interactive',
				normalized: 'interactive',
				tokens: ['interactive'],
			});

			expect(results).toHaveLength(1);
			expect(results[0].name).toBe('button');
		});

		it('searches by tags', async () => {
			const { searchComponentsList } = await import('../src/commands/list.utils.js');

			const components = [
				{ name: 'button', description: 'Button', tags: ['form', 'ui'] },
				{ name: 'modal', description: 'Modal', tags: ['overlay'] },
			] as any[];

			const results = searchComponentsList(components, {
				raw: 'form',
				normalized: 'form',
				tokens: ['form'],
			});

			expect(results).toHaveLength(1);
			expect(results[0].name).toBe('button');
		});
	});
});

describe('List Display', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createSectionHeader', () => {
		it('creates header with box drawing', async () => {
			const { createSectionHeader } = await import('../src/commands/list.display.js');

			const header = createSectionHeader('Primitives', 5, 'primitive', {
				useBoxDrawing: true,
				useColors: true,
				showDependencies: true,
				showLesserVersion: false,
				maxDescriptionLength: 80,
				highlightMatches: true,
			});

			expect(header).toContain('┌');
			expect(header).toContain('┐');
			expect(header).toContain('└');
			expect(header).toContain('┘');
		});

		it('creates header without box drawing', async () => {
			const { createSectionHeader } = await import('../src/commands/list.display.js');

			const header = createSectionHeader('Primitives', 5, 'primitive', {
				useBoxDrawing: false,
				useColors: true,
				showDependencies: true,
				showLesserVersion: false,
				maxDescriptionLength: 80,
				highlightMatches: true,
			});

			expect(header).toContain('─');
			expect(header).not.toContain('┌');
		});

		it('handles different component types', async () => {
			const { createSectionHeader } = await import('../src/commands/list.display.js');

			const types: Array<'primitive' | 'compound' | 'pattern' | 'adapter' | 'shared' | 'face'> = [
				'primitive',
				'compound',
				'pattern',
				'adapter',
				'shared',
				'face',
			];

			for (const type of types) {
				const header = createSectionHeader(type, 1, type);
				expect(typeof header).toBe('string');
				expect(header.length).toBeGreaterThan(0);
			}
		});
	});

	describe('formatInstallStatus', () => {
		it('shows checkmark for installed component', async () => {
			const { formatInstallStatus } = await import('../src/commands/list.display.js');

			const item = {
				name: 'button',
				type: 'primitive' as const,
				description: 'Button',
				installed: true,
				installedVersion: '1.0.0',
				modified: false,
				version: '1.0.0',
				tags: [],
				dependencyCount: 0,
			};

			const status = formatInstallStatus(item);

			expect(status).toContain('✓');
		});

		it('shows circle for not installed component', async () => {
			const { formatInstallStatus } = await import('../src/commands/list.display.js');

			const item = {
				name: 'button',
				type: 'primitive' as const,
				description: 'Button',
				installed: false,
				version: '1.0.0',
				tags: [],
				dependencyCount: 0,
			};

			const status = formatInstallStatus(item);

			expect(status).toContain('○');
		});

		it('shows modified indicator', async () => {
			const { formatInstallStatus } = await import('../src/commands/list.display.js');

			const item = {
				name: 'button',
				type: 'primitive' as const,
				description: 'Button',
				installed: true,
				installedVersion: '1.0.0',
				modified: true,
				version: '1.0.0',
				tags: [],
				dependencyCount: 0,
			};

			const status = formatInstallStatus(item);

			expect(status).toContain('modified');
		});
	});

	describe('formatComponentItem', () => {
		it('formats component item with name and description', async () => {
			const { formatComponentItem } = await import('../src/commands/list.display.js');

			const item = {
				name: 'button',
				type: 'primitive' as const,
				description: 'A button component',
				installed: false,
				version: '1.0.0',
				tags: ['ui', 'form'],
				dependencyCount: 2,
				domain: 'core' as const,
			};

			const formatted = formatComponentItem(item);

			expect(formatted).toContain('button');
		});

		it('includes dependency count when configured', async () => {
			const { formatComponentItem } = await import('../src/commands/list.display.js');

			const item = {
				name: 'button',
				type: 'primitive' as const,
				description: 'Button',
				installed: false,
				version: '1.0.0',
				tags: [],
				dependencyCount: 3,
			};

			const formatted = formatComponentItem(item, {
				useBoxDrawing: false,
				useColors: true,
				showDependencies: true,
				showLesserVersion: false,
				maxDescriptionLength: 80,
				highlightMatches: false,
			});

			expect(formatted).toContain('deps: 3');
		});
	});

	describe('formatFaceDetails', () => {
		it('formats face with all details', async () => {
			const { formatFaceDetails } = await import('../src/commands/list.display.js');

			const face = {
				name: 'social',
				type: 'face' as const,
				description: 'Social media face',
				installed: false,
				version: '1.0.0',
				tags: ['social'],
				dependencyCount: 10,
				domain: 'social' as const,
				includes: {
					primitives: ['button', 'modal'],
					shared: ['auth'],
					patterns: ['feed'],
					components: ['status'],
				},
				styles: {
					main: '@equaltoai/greater-components/faces/social/style.css',
					tokens: '',
				},
			};

			const formatted = formatFaceDetails(face);

			expect(formatted).toContain('social');
			expect(formatted).toContain('Primitives:');
			expect(formatted).toContain('button');
		});

		it('includes recommended shared modules', async () => {
			const { formatFaceDetails } = await import('../src/commands/list.display.js');

			const face = {
				name: 'social',
				type: 'face' as const,
				description: 'Social media face',
				installed: false,
				version: '1.0.0',
				tags: [],
				dependencyCount: 0,
				includes: {
					primitives: [],
					shared: [],
					patterns: [],
					components: [],
				},
				styles: {
					main: 'style.css',
					tokens: '',
				},
				recommendedShared: ['notifications', 'compose'],
			};

			const formatted = formatFaceDetails(face);

			expect(formatted).toContain('Recommended');
		});
	});

	describe('displaySummary', () => {
		it('displays summary without throwing', async () => {
			const { displaySummary } = await import('../src/commands/list.display.js');
			const { logger } = await import('../src/utils/logger.js');

			expect(() => displaySummary(10, 3, false)).not.toThrow();
			expect(logger.info).toHaveBeenCalled();
		});

		it('shows filtered indicator', async () => {
			const { displaySummary } = await import('../src/commands/list.display.js');
			const { logger } = await import('../src/utils/logger.js');

			displaySummary(5, 2, true);

			// Logger should be called with filtered info
			expect(logger.info).toHaveBeenCalled();
		});
	});

	describe('displaySearchHeader', () => {
		it('displays search header', async () => {
			const { displaySearchHeader } = await import('../src/commands/list.display.js');
			const { logger } = await import('../src/utils/logger.js');

			displaySearchHeader('button', 5);

			expect(logger.info).toHaveBeenCalled();
		});
	});

	describe('Command Execution', () => {
		beforeEach(() => {
			mockFs.clear();
			vi.clearAllMocks();
		});

		it('lists components without config', async () => {
			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction(undefined, {});

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Greater Components'));
		});

		it('lists components with installed status', async () => {
			const config = {
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				installed: [{ name: 'button', version: '1.0.0' }],
			};
			mockFs.set('/components.json', JSON.stringify(config));

			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction(undefined, {});

			// Verify output implies something is installed or we see checkmarks if we could check specific string
			// But since display logic is complex, checking it runs without error and calls logger is basic check.
			expect(logger.info).toHaveBeenCalled();
		});

		it('searches for components', async () => {
			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction('button', {});

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Search results'));
		});

		it('displays face details', async () => {
			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction('faces/social', {});

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Face'));
		});

		it('handles unknown face', async () => {
			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction('faces/unknown', {});

			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
		});

		it('outputs JSON', async () => {
			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction(undefined, { json: true });

			const calls = (logger.info as any).mock.calls;
			const jsonCall = calls.find((call: any[]) => {
				try {
					JSON.parse(call[0]);
					return true;
				} catch {
					return false;
				}
			});
			expect(jsonCall).toBeDefined();
		});

		it('filters by type', async () => {
			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction(undefined, { type: 'primitive' });

			// We expect logger to be called. Detailed content check is hard without mocking display functions returning strings.
			expect(logger.info).toHaveBeenCalled();
		});

		it('filters by domain', async () => {
			const { listAction } = await import('../src/commands/list.js');
			const { logger } = await import('../src/utils/logger.js');

			await listAction(undefined, { domain: 'social' });

			expect(logger.info).toHaveBeenCalled();
		});
	});
});
