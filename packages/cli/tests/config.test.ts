/**
 * Config Schema Validation Tests
 * Comprehensive tests for configuration parsing, validation, and migration
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';
import { createTestConfig, createInstalledComponent, MockFileSystem } from './fixtures/index.js';

const mockFs = new MockFileSystem();

vi.mock('fs-extra', () => ({
	default: mockFs.createFsMock(),
	...mockFs.createFsMock(),
}));

describe('Config Schema Validation', () => {
	beforeEach(() => {
		mockFs.clear();
		vi.clearAllMocks();
	});

	describe('componentConfigSchema', () => {
		it('validates a complete valid config', async () => {
			const { componentConfigSchema } = await import('../src/utils/config.js');

			const config = createTestConfig();
			const result = componentConfigSchema.safeParse(config);

			expect(result.success).toBe(true);
		});

		it('applies default values for missing optional fields', async () => {
			const { componentConfigSchema } = await import('../src/utils/config.js');

			const minimalConfig = {
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};

			const result = componentConfigSchema.parse(minimalConfig);

			expect(result.style).toBe('default');
			expect(result.rsc).toBe(false);
			expect(result.tsx).toBe(true);
			expect(result.css.tokens).toBe(true);
			expect(result.css.primitives).toBe(true);
			expect(result.installed).toEqual([]);
		});

		it('rejects invalid style values', async () => {
			const { componentConfigSchema } = await import('../src/utils/config.js');

			const invalidConfig = createTestConfig({ style: 'invalid-style' as any });
			const result = componentConfigSchema.safeParse(invalidConfig);

			expect(result.success).toBe(false);
		});

		it('validates installed component schema', async () => {
			const { componentConfigSchema } = await import('../src/utils/config.js');

			const config = createTestConfig({
				installed: [
					createInstalledComponent('button'),
					createInstalledComponent('modal', { modified: true }),
				],
			});

			const result = componentConfigSchema.safeParse(config);

			expect(result.success).toBe(true);
			expect(result.data?.installed).toHaveLength(2);
			expect(result.data?.installed[1].modified).toBe(true);
		});

		it('validates checksum entries in installed components', async () => {
			const { componentConfigSchema } = await import('../src/utils/config.js');

			const config = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						checksums: [
							{ path: 'button.ts', checksum: 'sha256-abc123' },
							{ path: 'button.css', checksum: 'sha256-def456' },
						],
					}),
				],
			});

			const result = componentConfigSchema.safeParse(config);

			expect(result.success).toBe(true);
			expect(result.data?.installed[0].checksums).toHaveLength(2);
		});

		it('validates CSS config with face', async () => {
			const { componentConfigSchema } = await import('../src/utils/config.js');

			const config = createTestConfig({
				css: {
					tokens: true,
					primitives: true,
					face: 'social',
				},
			});

			const result = componentConfigSchema.safeParse(config);

			expect(result.success).toBe(true);
			expect(result.data?.css.face).toBe('social');
		});

		it('allows null face in CSS config', async () => {
			const { componentConfigSchema } = await import('../src/utils/config.js');

			const config = createTestConfig({
				css: {
					tokens: false,
					primitives: true,
					face: null,
				},
			});

			const result = componentConfigSchema.safeParse(config);

			expect(result.success).toBe(true);
			expect(result.data?.css.face).toBeNull();
		});
	});

	describe('configExists', () => {
		it('returns true when components.json exists', async () => {
			const { configExists } = await import('../src/utils/config.js');

			mockFs.set('/project/components.json', JSON.stringify(createTestConfig()));

			const exists = await configExists('/project');

			expect(exists).toBe(true);
		});

		it('returns false when components.json does not exist', async () => {
			const { configExists } = await import('../src/utils/config.js');

			const exists = await configExists('/project');

			expect(exists).toBe(false);
		});
	});

	describe('fileMatchesInstalledChecksum', () => {
		it('returns true if a file matches an installed checksum', async () => {
			const { fileMatchesInstalledChecksum } = await import('../src/utils/config.js');

			const configWithChecksum = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						checksums: [
							{ path: 'lib/primitives/button.ts', checksum: 'sha256-abc123' },
							{ path: 'lib/primitives/button.css', checksum: 'sha256-def456' },
						],
					}),
				],
			});

			const match = fileMatchesInstalledChecksum(
				configWithChecksum,
				'button',
				'lib/primitives/button.ts',
				'sha256-abc123'
			);
			expect(match).toBe(true);
		});

		it('returns false if a file does not match an installed checksum', async () => {
			const { fileMatchesInstalledChecksum } = await import('../src/utils/config.js');

			const configWithChecksum = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						checksums: [
							{ path: 'lib/primitives/button.ts', checksum: 'sha256-abc123' },
							{ path: 'lib/primitives/button.css', checksum: 'sha256-def456' },
						],
					}),
				],
			});

			const match = fileMatchesInstalledChecksum(
				configWithChecksum,
				'button',
				'lib/primitives/button.ts',
				'sha256-new'
			);
			expect(match).toBe(false);
		});

		it('returns false if the component is not found', async () => {
			const { fileMatchesInstalledChecksum } = await import('../src/utils/config.js');

			const configWithChecksum = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						checksums: [{ path: 'lib/primitives/button.ts', checksum: 'sha256-abc123' }],
					}),
				],
			});

			const match = fileMatchesInstalledChecksum(
				configWithChecksum,
				'non-existent',
				'lib/primitives/button.ts',
				'sha256-abc123'
			);
			expect(match).toBe(false);
		});

		it('returns false if the file path is not found for the component', async () => {
			const { fileMatchesInstalledChecksum } = await import('../src/utils/config.js');

			const configWithChecksum = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						checksums: [{ path: 'lib/primitives/button.ts', checksum: 'sha256-abc123' }],
					}),
				],
			});

			const match = fileMatchesInstalledChecksum(
				configWithChecksum,
				'button',
				'lib/primitives/other.ts',
				'sha256-abc123'
			);
			expect(match).toBe(false);
		});

		it('returns false if checksums array is empty', async () => {
			const { fileMatchesInstalledChecksum } = await import('../src/utils/config.js');

			const configWithChecksum = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						checksums: [],
					}),
				],
			});

			const match = fileMatchesInstalledChecksum(
				configWithChecksum,
				'button',
				'lib/primitives/button.ts',
				'sha256-abc123'
			);
			expect(match).toBe(false);
		});
	});

	describe('readConfig', () => {
		it('reads and parses valid config', async () => {
			const { readConfig } = await import('../src/utils/config.js');

			const config = createTestConfig();
			mockFs.set('/project/components.json', JSON.stringify(config));

			const result = await readConfig('/project');

			expect(result).toBeDefined();
			expect(result?.style).toBe('default');
			expect(result?.aliases.ui).toBe('$lib/components/ui');
		});

		it('throws on invalid JSON', async () => {
			const { readConfig } = await import('../src/utils/config.js');

			mockFs.set('/project/components.json', '{invalid json}');

			await expect(readConfig('/project')).rejects.toThrow(/Failed to read config/);
		});

		it('throws on missing config file', async () => {
			const { readConfig } = await import('../src/utils/config.js');

			await expect(readConfig('/project')).resolves.toBeNull();
		});
	});

	describe('writeConfig', () => {
		it('writes config as formatted JSON', async () => {
			const { writeConfig } = await import('../src/utils/config.js');

			const config = createTestConfig();
			await writeConfig(config, '/project');

			const written = mockFs.get('/project/components.json');
			expect(written).toBeDefined();
			expect(JSON.parse(written ?? '{}')).toEqual(config);
		});
	});

	describe('needsMigration', () => {
		it('returns true for config without version', async () => {
			const { needsMigration } = await import('../src/utils/config.js');

			const oldConfig = {
				style: 'default',
				aliases: { components: '$lib/components' },
			};

			expect(needsMigration(oldConfig)).toBe(true);
		});

		it('returns true for config without ref', async () => {
			const { needsMigration } = await import('../src/utils/config.js');

			const oldConfig = {
				version: '1.0.0',
				style: 'default',
				aliases: { components: '$lib/components' },
			};

			expect(needsMigration(oldConfig)).toBe(true);
		});

		it('returns true for config without css', async () => {
			const { needsMigration } = await import('../src/utils/config.js');

			const oldConfig = {
				version: '1.0.0',
				ref: 'v1.0.0',
				style: 'default',
				aliases: { components: '$lib/components' },
			};

			expect(needsMigration(oldConfig)).toBe(true);
		});

		it('returns false for complete config', async () => {
			const { needsMigration } = await import('../src/utils/config.js');

			const completeConfig = {
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				css: { tokens: true, primitives: true, face: null },
				installed: [],
				aliases: { components: '$lib/components' },
			};

			expect(needsMigration(completeConfig)).toBe(false);
		});
	});

	describe('migrateConfig', () => {
		it('adds missing $schema', async () => {
			const { migrateConfig, SCHEMA_URL } = await import('../src/utils/config.js');

			const oldConfig = {
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};

			const result = migrateConfig(oldConfig);

			expect(result.migrated).toBe(true);
			expect(result.config.$schema).toBe(SCHEMA_URL);
			expect(result.changes).toContain('Added $schema URL');
		});

		it('adds missing version', async () => {
			const { migrateConfig, CONFIG_SCHEMA_VERSION } = await import('../src/utils/config.js');

			const oldConfig = {
				$schema: 'https://greater.components.dev/schema.json',
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};

			const result = migrateConfig(oldConfig);

			expect(result.config.version).toBe(CONFIG_SCHEMA_VERSION);
		});

		it('adds missing ref with default value', async () => {
			const { migrateConfig, DEFAULT_REF } = await import('../src/utils/config.js');

			const oldConfig = {
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};

			const result = migrateConfig(oldConfig);

			expect(result.config.ref).toBe(DEFAULT_REF);
		});

		it('adds missing css config', async () => {
			const { migrateConfig } = await import('../src/utils/config.js');

			const oldConfig = {
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				ref: 'v1.0.0',
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};

			const result = migrateConfig(oldConfig);

			expect(result.config.css).toEqual({
				tokens: true,
				primitives: true,
				face: null,
			});
		});

		it('adds missing installed array', async () => {
			const { migrateConfig } = await import('../src/utils/config.js');

			const oldConfig = {
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				ref: 'v1.0.0',
				css: { tokens: true, primitives: true, face: null },
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};

			const result = migrateConfig(oldConfig);

			expect(result.config.installed).toEqual([]);
		});

		it('preserves existing aliases during migration', async () => {
			const { migrateConfig } = await import('../src/utils/config.js');

			const oldConfig = {
				style: 'default',
				aliases: {
					components: '@/components',
					utils: '@/utils',
					ui: '@/ui',
					lib: '@/lib',
					hooks: '@/hooks',
				},
			};

			const result = migrateConfig(oldConfig);

			expect(result.config.aliases.components).toBe('@/components');
			expect(result.config.aliases.ui).toBe('@/ui');
		});

		it('returns migrated=false when no changes needed', async () => {
			const { migrateConfig } = await import('../src/utils/config.js');

			const completeConfig = {
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default',
				rsc: false,
				tsx: true,
				css: { tokens: true, primitives: true, face: null },
				installed: [],
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/hooks',
				},
			};

			const result = migrateConfig(completeConfig);

			expect(result.migrated).toBe(false);
			expect(result.changes).toHaveLength(0);
		});
	});

	describe('resolveAlias', () => {
		it('resolves $lib alias to src/lib', async () => {
			const { resolveAlias } = await import('../src/utils/config.js');

			const config = createTestConfig();
			const resolved = resolveAlias('$lib/utils', config, '/project');

			expect(resolved).toBe(path.join('/project', 'src/lib/utils'));
		});

		it('resolves custom alias paths', async () => {
			const { resolveAlias } = await import('../src/utils/config.js');

			const config = createTestConfig({
				aliases: {
					components: '@/components',
					utils: '@/utils',
					ui: '@/ui',
					lib: '@',
					hooks: '@/hooks',
				},
			});

			const resolved = resolveAlias('@/utils', config, '/project');

			expect(resolved).toContain('utils');
		});
	});

	describe('getComponentPath', () => {
		it('returns correct path for component', async () => {
			const { getComponentPath } = await import('../src/utils/config.js');

			const config = createTestConfig();
			const componentPath = getComponentPath('Button', config, '/project');

			expect(componentPath).toContain('Button.svelte');
			expect(componentPath).toContain('ui');
		});
	});

	describe('installed component helpers', () => {
		it('addInstalledComponent adds new component', async () => {
			const { addInstalledComponent } = await import('../src/utils/config.js');

			const config = createTestConfig();

			const updated = addInstalledComponent(config, 'button', 'v1.0.0');

			expect(updated.installed).toBeDefined();
			expect(updated.installed).toHaveLength(1);
			expect(updated.installed?.[0].name).toBe('button');
		});

		it('addInstalledComponent updates existing component', async () => {
			const { addInstalledComponent } = await import('../src/utils/config.js');

			const config = createTestConfig({
				installed: [createInstalledComponent('button', { version: 'v1.0.0' })],
			});

			const updated = addInstalledComponent(config, 'button', 'v2.0.0');

			expect(updated.installed).toBeDefined();
			expect(updated.installed).toHaveLength(1);
			expect(updated.installed?.[0].version).toBe('v2.0.0');
		});

		it('isComponentInstalled returns true for installed component', async () => {
			const { isComponentInstalled } = await import('../src/utils/config.js');

			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});

			expect(isComponentInstalled('button', config)).toBe(true);
			expect(isComponentInstalled('modal', config)).toBe(false);
		});

		it('getInstalledComponent returns component or undefined', async () => {
			const { getInstalledComponent } = await import('../src/utils/config.js');

			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});

			expect(getInstalledComponent('button', config)).toBeDefined();
			expect(getInstalledComponent('modal', config)).toBeUndefined();
		});

		it('getInstalledComponentNames returns all names', async () => {
			const { getInstalledComponentNames } = await import('../src/utils/config.js');

			const config = createTestConfig({
				installed: [createInstalledComponent('button'), createInstalledComponent('modal')],
			});

			const names = getInstalledComponentNames(config);

			expect(names).toEqual(['button', 'modal']);
		});

		it('markComponentModified updates modified flag', async () => {
			const { markComponentModified } = await import('../src/utils/config.js');

			const config = createTestConfig({
				installed: [createInstalledComponent('button', { modified: false })],
			});

			const updated = markComponentModified(config, 'button');

			expect(updated.installed).toBeDefined();
			expect(updated.installed?.[0].modified).toBe(true);
		});
	});
});
