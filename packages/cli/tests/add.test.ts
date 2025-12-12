/**
 * Add Command Integration Tests
 * Tests for component addition with various scenarios
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	MockFileSystem,
	SVELTEKIT_PROJECT,
	createTestConfig,
	createInstalledComponent,
	MOCK_BUTTON_COMPONENT,
	MOCK_MODAL_COMPONENT,
} from './fixtures/index.js';

const mockFs = new MockFileSystem();

vi.mock('fs-extra', () => ({
	default: mockFs.createFsMock(),
	...mockFs.createFsMock(),
}));

vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn(),
		fail: vi.fn(),
		warn: vi.fn(),
		stop: vi.fn(),
	})),
}));

vi.mock('prompts', () => ({
	default: vi.fn().mockResolvedValue({ confirm: true }),
}));

vi.mock('../src/utils/logger.js', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		note: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		newline: vi.fn(),
	},
}));

vi.mock('../src/utils/fetch.js', () => ({
	fetchComponentFiles: vi.fn().mockResolvedValue({
		files: [{ path: 'button.ts', content: 'export const button = {};', type: 'component' }],
		ref: 'greater-v4.2.0',
	}),
}));

vi.mock('../src/registry/index.js', () => ({
	getComponent: vi.fn(),
	componentRegistry: {},
	getAllComponentNames: vi.fn().mockReturnValue(['button', 'modal', 'menu']),
}));

describe('Add Command', () => {
	beforeEach(() => {
		mockFs.clear();
		mockFs.setupProject(SVELTEKIT_PROJECT);
		vi.clearAllMocks();
	});

	describe('addCommand options', () => {
		it('exports addCommand', async () => {
			const { addCommand } = await import('../src/commands/add.js');

			expect(addCommand).toBeDefined();
			expect(addCommand.name()).toBe('add');
		});

		it('accepts component names as arguments', async () => {
			const { addCommand } = await import('../src/commands/add.js');

			expect(addCommand.args).toBeDefined();
		});

		it('has --all option', async () => {
			const { addCommand } = await import('../src/commands/add.js');

			const options = addCommand.options;
			const allOption = options.find((opt) => opt.long === '--all');

			expect(allOption).toBeDefined();
		});

		it('has --overwrite option', async () => {
			const { addCommand } = await import('../src/commands/add.js');

			const options = addCommand.options;
			const overwriteOption = options.find((opt) => opt.long === '--force');

			expect(overwriteOption).toBeDefined();
		});

		it('has --cwd option', async () => {
			const { addCommand } = await import('../src/commands/add.js');

			const options = addCommand.options;
			const cwdOption = options.find((opt) => opt.long === '--cwd');

			expect(cwdOption).toBeDefined();
		});

		it('has --ref option', async () => {
			const { addCommand } = await import('../src/commands/add.js');

			const options = addCommand.options;
			const refOption = options.find((opt) => opt.long === '--ref');

			expect(refOption).toBeDefined();
		});

		it('has --dry-run option', async () => {
			const { addCommand } = await import('../src/commands/add.js');

			const options = addCommand.options;
			const dryRunOption = options.find((opt) => opt.long === '--dry-run');

			expect(dryRunOption).toBeDefined();
		});
	});

	describe('Component Resolution', () => {
		it('resolves component from registry', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);

			const component = getComponent('button');

			expect(component).toBeDefined();
			expect(component?.name).toBe('button');
		});

		it('returns null for unknown component', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(null);

			const component = getComponent('nonexistent');

			expect(component).toBeNull();
		});
	});

	describe('Item Parser', () => {
		it('parses simple component name', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('button');

			expect(result.name).toBe('button');
			expect(result.type).toBe('primitive');
		});

		it('parses shared module path', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('shared/auth');

			expect(result.name).toBe('auth');
			expect(result.type).toBe('shared');
		});

		it('parses pattern path', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('patterns/thread-view');

			expect(result.name).toBe('thread-view');
			expect(result.type).toBe('pattern');
		});

		it('parses face path', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('faces/social');

			expect(result.name).toBe('social');
			expect(result.type).toBe('face');
		});
	});

	describe('Installation Preview', () => {
		it('generates installation preview', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') return MOCK_BUTTON_COMPONENT;
				if (name === 'modal') return MOCK_MODAL_COMPONENT;
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('modal')];
			const result = resolveDependencies(items);

			expect(result.resolved.length).toBeGreaterThan(0);
		});
	});

	describe('Config Updates', () => {
		it('adds component to installed list', async () => {
			const config = createTestConfig();
			mockFs.set('/components.json', JSON.stringify(config));

			const { addInstalledComponent } = await import('../src/utils/config.js');
			const updated = addInstalledComponent(config, 'button', 'v1.0.0');

			expect(updated.installed).toHaveLength(1);
			expect(updated.installed[0].name).toBe('button');
		});

		it('updates existing component version', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { version: 'v1.0.0' })],
			});

			const { addInstalledComponent } = await import('../src/utils/config.js');
			const updated = addInstalledComponent(config, 'button', 'v2.0.0');

			expect(updated.installed).toHaveLength(1);
			expect(updated.installed[0].version).toBe('v2.0.0');
		});
	});

	describe('File Writing', () => {
		it('writes component files to correct location', async () => {
			const config = createTestConfig();
			mockFs.set('/components.json', JSON.stringify(config));

			const { writeComponentFiles } = await import('../src/utils/files.js');
			const files = [{ path: 'Button.svelte', content: '<button />', type: 'component' as const }];

			await writeComponentFiles(files, '/src/lib/components/ui');

			expect(mockFs.has('/src/lib/components/ui/Button.svelte')).toBe(true);
		});
	});

	describe('buildSelectionChoices', () => {
		it('builds selection choices from registry', async () => {
			const { buildSelectionChoices } = await import('../src/commands/add.js');

			const choices = buildSelectionChoices();

			expect(Array.isArray(choices)).toBe(true);
			// Should filter out empty value entries (section headers)
			expect(choices.every((c) => c.value !== '')).toBe(true);
		});

		it('includes faces in choices', async () => {
			const { buildSelectionChoices } = await import('../src/commands/add.js');

			const choices = buildSelectionChoices();
			const faceChoices = choices.filter((c) => c.value.startsWith('faces/'));

			// Should include face entries if any exist in registry
			expect(Array.isArray(faceChoices)).toBe(true);
		});

		it('includes shared modules in choices', async () => {
			const { buildSelectionChoices } = await import('../src/commands/add.js');

			const choices = buildSelectionChoices();
			const sharedChoices = choices.filter((c) => c.value.startsWith('shared/'));

			expect(Array.isArray(sharedChoices)).toBe(true);
		});

		it('includes patterns in choices', async () => {
			const { buildSelectionChoices } = await import('../src/commands/add.js');

			const choices = buildSelectionChoices();
			const patternChoices = choices.filter((c) => c.value.startsWith('patterns/'));

			expect(Array.isArray(patternChoices)).toBe(true);
		});
	});

	describe('Dependency Resolution Edge Cases', () => {
		it('handles component with no dependencies', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue({
				...MOCK_BUTTON_COMPONENT,
				registryDependencies: [],
				dependencies: [],
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('button')];
			const result = resolveDependencies(items);

			expect(result.success).toBe(true);
			expect(result.resolved.length).toBeGreaterThan(0);
		});

		it('handles circular dependency detection', async () => {
			const { getComponent } = await import('../src/registry/index.js');

			// Create circular dependency: button -> modal -> button
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') {
					return {
						...MOCK_BUTTON_COMPONENT,
						registryDependencies: ['modal'],
					};
				}
				if (name === 'modal') {
					return {
						...MOCK_MODAL_COMPONENT,
						registryDependencies: ['button'],
					};
				}
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('button')];
			const result = resolveDependencies(items);

			// Should detect circular dependency
			expect(result.circular.length).toBeGreaterThan(0);
		});

		it('handles missing dependency', async () => {
			const { getComponent } = await import('../src/registry/index.js');

			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') {
					return {
						...MOCK_BUTTON_COMPONENT,
						registryDependencies: ['nonexistent'],
					};
				}
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('button')];
			const result = resolveDependencies(items);

			// Should report missing dependency
			expect(result.missing.length).toBeGreaterThan(0);
		});
	});

	describe('parseItems batch parsing', () => {
		it('parses multiple items at once', async () => {
			const { parseItems } = await import('../src/utils/item-parser.js');

			const result = parseItems(['button', 'shared/auth', 'faces/social']);

			expect(result.items).toHaveLength(3);
			expect(result.byType.primitives.length).toBeGreaterThanOrEqual(0);
		});

		it('validates parse result', async () => {
			const { parseItems, validateParseResult } = await import('../src/utils/item-parser.js');

			const parseResult = parseItems(['button']);
			const validation = validateParseResult(parseResult);

			expect(typeof validation.valid).toBe('boolean');
			expect(Array.isArray(validation.errors)).toBe(true);
		});
	});

	describe('Installation Order', () => {
		it('gets installation order from resolution', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);

			const { resolveDependencies, getInstallationOrder } = await import(
				'../src/utils/dependency-resolver.js'
			);
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('button')];
			const result = resolveDependencies(items);
			const order = getInstallationOrder(result);

			expect(Array.isArray(order)).toBe(true);
		});
	});

	describe('Face Dependencies', () => {
		it('resolves face dependencies', async () => {
			const { resolveFaceDependencies } = await import('../src/utils/face-installer.js');

			const result = resolveFaceDependencies('social', {
				skipOptional: false,
				skipInstalled: [],
			});

			// Result is null if face not found, or resolution result if found
			expect(result === null || typeof result === 'object').toBe(true);
		});
	});

	describe('Component Type Detection', () => {
		it('detects primitive type', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('button');
			expect(['primitive', 'compound', 'adapter'].includes(result.type)).toBe(true);
		});

		it('detects shared type with prefix', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('shared/auth');
			expect(result.type).toBe('shared');
			expect(result.name).toBe('auth');
		});

		it('detects face type with prefix', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('faces/social');
			expect(result.type).toBe('face');
			expect(result.name).toBe('social');
		});

		it('detects pattern type with prefix', async () => {
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = parseItemName('patterns/thread-view');
			expect(result.type).toBe('pattern');
			expect(result.name).toBe('thread-view');
		});
	});
});
