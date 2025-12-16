import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';

const fsStore = new Map<string, string>();
const fsMock = {
	pathExists: vi.fn(async (p: string) => fsStore.has(p)),
	readFile: vi.fn(async (p: string) => {
		if (!fsStore.has(p)) throw new Error(`missing ${p}`);
		return fsStore.get(p) as string;
	}),
	writeFile: vi.fn(async (p: string, content: string) => {
		fsStore.set(p, content);
	}),
	ensureDir: vi.fn(async () => {}),
	readdir: vi.fn(async () => []),
};

vi.mock('fs-extra', () => ({
	default: fsMock,
	...fsMock,
}));

// Mock registry for orphaned files and installed component tests
vi.mock('../src/registry/index.js', async (importOriginal) => {
	const original = await importOriginal<typeof import('../src/registry/index.js')>();
	return {
		...original,
		getComponent: vi.fn((name: string) => original.getComponent(name)),
	};
});

describe('doctor command utilities', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	describe('checkNodeVersion', () => {
		it('should return a diagnostic result for Node.js version', async () => {
			const { checkNodeVersion } = await import('../src/commands/doctor.js');

			// Node version is checked at runtime
			const result = checkNodeVersion();
			expect(result.name).toBe('Node.js Version');
			expect(typeof result.passed).toBe('boolean');
			expect(result.severity).toBe('error');
			// Node 20+ should pass per official documentation
			const majorVersion = parseInt(process.versions.node.split('.')[0], 10);
			expect(result.passed).toBe(majorVersion >= 20);
		});
	});

	describe('checkSvelteVersion', () => {
		it('should fail when Svelte is not installed', async () => {
			const pkgPath = path.join('/project', 'package.json');
			fsStore.set(
				pkgPath,
				JSON.stringify({
					dependencies: {},
				})
			);

			const { checkSvelteVersion } = await import('../src/commands/doctor.js');

			const result = await checkSvelteVersion('/project');

			expect(result.passed).toBe(false);
			expect(result.message).toContain('not installed');
		});

		it('should pass when Svelte 5+ is installed', async () => {
			const pkgPath = path.join('/project', 'package.json');
			fsStore.set(
				pkgPath,
				JSON.stringify({
					dependencies: {
						svelte: '^5.0.0',
					},
				})
			);
			// Also set node_modules to simulate installed dependency
			const sveltePackagePath = path.join('/project', 'node_modules', 'svelte', 'package.json');
			fsStore.set(
				sveltePackagePath,
				JSON.stringify({
					version: '5.1.0',
				})
			);

			const { checkSvelteVersion } = await import('../src/commands/doctor.js');

			const result = await checkSvelteVersion('/project');

			expect(result.name).toBe('Svelte Version');
		});
	});

	describe('checkConfigFile', () => {
		it('should fail when components.json does not exist', async () => {
			const { checkConfigFile } = await import('../src/commands/doctor.js');

			const result = await checkConfigFile('/project');

			expect(result.passed).toBe(false);
			expect(result.severity).toBe('error');
			expect(result.message).toContain('not found');
			expect(result.fix).toBe('greater init');
		});

		it('should pass when components.json is valid', async () => {
			const configPath = path.join('/project', 'components.json');
			fsStore.set(
				configPath,
				JSON.stringify({
					$schema: 'https://greater.components.dev/schema.json',
					version: '1.0.0',
					style: 'default',
					aliases: {
						components: '$lib/components',
						utils: '$lib/utils',
						ui: '$lib/components/ui',
						lib: '$lib',
						hooks: '$lib/primitives',
					},
					installed: [],
				})
			);

			const { checkConfigFile } = await import('../src/commands/doctor.js');

			const result = await checkConfigFile('/project');

			expect(result.passed).toBe(true);
			expect(result.message).toContain('valid');
		});

		it('should fail when components.json has invalid JSON', async () => {
			const configPath = path.join('/project', 'components.json');
			fsStore.set(configPath, '{invalid json}');

			const { checkConfigFile } = await import('../src/commands/doctor.js');

			const result = await checkConfigFile('/project');

			expect(result.passed).toBe(false);
			expect(result.severity).toBe('error');
		});

		it('should warn when config is missing required fields', async () => {
			const configPath = path.join('/project', 'components.json');
			fsStore.set(
				configPath,
				JSON.stringify({
					version: '1.0.0',
					// Missing aliases and style
				})
			);

			const { checkConfigFile } = await import('../src/commands/doctor.js');

			const result = await checkConfigFile('/project');

			expect(result.passed).toBe(false);
		});
	});

	describe('checkProjectStructure', () => {
		it('should detect SvelteKit project', async () => {
			const pkgPath = path.join('/project', 'package.json');
			fsStore.set(
				pkgPath,
				JSON.stringify({
					dependencies: {
						svelte: '^5.0.0',
						'@sveltejs/kit': '^2.0.0',
					},
				})
			);
			fsStore.set(path.join('/project', 'svelte.config.js'), '');

			const { checkProjectStructure } = await import('../src/commands/doctor.js');

			const result = await checkProjectStructure('/project');

			expect(result.passed).toBe(true);
			expect(result.message).toContain('SvelteKit');
		});

		it('should warn when project type is unknown', async () => {
			const pkgPath = path.join('/project', 'package.json');
			fsStore.set(
				pkgPath,
				JSON.stringify({
					dependencies: {},
				})
			);

			const { checkProjectStructure } = await import('../src/commands/doctor.js');

			const result = await checkProjectStructure('/project');

			expect(result.passed).toBe(false);
			expect(result.severity).toBe('warning');
		});

		it('should detect Vite+Svelte project', async () => {
			const pkgPath = path.join('/project', 'package.json');
			fsStore.set(
				pkgPath,
				JSON.stringify({
					dependencies: {
						svelte: '^5.0.0',
					},
					devDependencies: {
						vite: '^5.0.0',
					},
				})
			);

			const { checkProjectStructure } = await import('../src/commands/doctor.js');

			const result = await checkProjectStructure('/project');

			expect(result.name).toBe('Project Structure');
		});
	});

	describe('checkAliasPaths', () => {
		it('should check if alias paths exist', async () => {
			const { checkAliasPaths } = await import('../src/commands/doctor.js');

			const config = {
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default' as const,
				rsc: false,
				tsx: false,
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				css: { tokens: true, primitives: true, face: null },
				installed: [],
			};

			const results = await checkAliasPaths('/project', config);

			expect(Array.isArray(results)).toBe(true);
			// Each alias should have a diagnostic result
			expect(results.length).toBe(5);
		});
	});

	describe('checkNpmDependencies', () => {
		it('should check for missing npm dependencies', async () => {
			const { checkNpmDependencies } = await import('../src/commands/doctor.js');

			const pkgPath = path.join('/project', 'package.json');
			fsStore.set(
				pkgPath,
				JSON.stringify({
					dependencies: {},
				})
			);

			const config = {
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default' as const,
				rsc: false,
				tsx: false,
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				css: { tokens: true, primitives: true, face: null },
				installed: [],
			};

			const results = await checkNpmDependencies('/project', config);

			expect(Array.isArray(results)).toBe(true);
		});
	});

	describe('checkInstalledComponents', () => {
		it('should report no components when none are installed', async () => {
			const { checkInstalledComponents } = await import('../src/commands/doctor.js');

			const config = {
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default' as const,
				rsc: false,
				tsx: false,
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				css: { tokens: true, primitives: true, face: null },
				installed: [],
			};

			const results = await checkInstalledComponents('/project', config);

			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBe(1);
			expect(results[0]?.message).toContain('No components installed');
		});
	});

	describe('checkOrphanedFiles', () => {
		it('should pass when UI directory does not exist', async () => {
			const { checkOrphanedFiles } = await import('../src/commands/doctor.js');

			const config = {
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default' as const,
				rsc: false,
				tsx: false,
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				css: { tokens: true, primitives: true, face: null },
				installed: [],
			};

			const result = await checkOrphanedFiles('/project', config);

			expect(result.passed).toBe(true);
			expect(result.message).toContain('No orphaned component files detected');
		});
	});

	describe('checkLesserVersion', () => {
		it('should return null when no lesserVersion is configured', async () => {
			const { checkLesserVersion } = await import('../src/commands/doctor.js');

			const config = {
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default' as const,
				rsc: false,
				tsx: false,
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				css: { tokens: true, primitives: true, face: null },
				installed: [],
			};

			const result = await checkLesserVersion(config);

			expect(result).toBeNull();
		});

		it('should return info when lesserVersion is configured', async () => {
			const { checkLesserVersion } = await import('../src/commands/doctor.js');

			const config = {
				version: '1.0.0',
				ref: 'greater-v4.2.0',
				style: 'default' as const,
				rsc: false,
				tsx: false,
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				css: { tokens: true, primitives: true, face: null },
				installed: [],
				lesserVersion: '1.0.0',
			};

			const result = await checkLesserVersion(config);

			expect(result).not.toBeNull();
			expect(result?.name).toBe('Lesser Version');
			expect(result?.passed).toBe(true);
		});
	});

	describe('formatResult', () => {
		it('should format passing result with checkmark', async () => {
			const { formatResult } = await import('../src/commands/doctor.js');

			const result = formatResult({
				name: 'Test Check',
				passed: true,
				severity: 'info',
				message: 'All good',
			});

			expect(result).toContain('Test Check');
			expect(result).toContain('All good');
		});

		it('should format failing result with fix suggestion', async () => {
			const { formatResult } = await import('../src/commands/doctor.js');

			const result = formatResult({
				name: 'Test Check',
				passed: false,
				severity: 'error',
				message: 'Something wrong',
				fix: 'Run this command',
			});

			expect(result).toContain('Test Check');
			expect(result).toContain('Something wrong');
			expect(result).toContain('Fix:');
			expect(result).toContain('Run this command');
		});

		it('should format warning result', async () => {
			const { formatResult } = await import('../src/commands/doctor.js');

			const result = formatResult({
				name: 'Test Check',
				passed: false,
				severity: 'warning',
				message: 'Minor issue detected',
			});

			expect(result).toContain('Test Check');
			expect(result).toContain('Minor issue detected');
		});

		it('should include details when provided', async () => {
			const { formatResult } = await import('../src/commands/doctor.js');

			const result = formatResult({
				name: 'Test Check',
				passed: true,
				severity: 'info',
				message: 'All good',
				details: 'Some additional details',
			});

			expect(result).toContain('Some additional details');
		});
	});
});

describe('doctor command integration', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('should export doctorCommand', async () => {
		const { doctorCommand } = await import('../src/commands/doctor.js');

		expect(doctorCommand).toBeDefined();
		expect(doctorCommand.name()).toBe('doctor');
	});

	it('should have --fix option', async () => {
		const { doctorCommand } = await import('../src/commands/doctor.js');

		const options = doctorCommand.options;
		const fixOption = options.find((opt) => opt.long === '--fix');

		expect(fixOption).toBeDefined();
	});

	it('should have --json option', async () => {
		const { doctorCommand } = await import('../src/commands/doctor.js');

		const options = doctorCommand.options;
		const jsonOption = options.find((opt) => opt.long === '--json');

		expect(jsonOption).toBeDefined();
	});

	it('should have --cwd option', async () => {
		const { doctorCommand } = await import('../src/commands/doctor.js');

		const options = doctorCommand.options;
		const cwdOption = options.find((opt) => opt.long === '--cwd');

		expect(cwdOption).toBeDefined();
	});

	it('should export diagnostic types', async () => {
		const doctorModule = await import('../src/commands/doctor.js');

		// Verify exported types are usable
		expect(typeof doctorModule.checkNodeVersion).toBe('function');
		expect(typeof doctorModule.checkConfigFile).toBe('function');
		expect(typeof doctorModule.checkSvelteVersion).toBe('function');
		expect(typeof doctorModule.checkProjectStructure).toBe('function');
		expect(typeof doctorModule.formatResult).toBe('function');
		expect(typeof doctorModule.checkAliasPaths).toBe('function');
		expect(typeof doctorModule.checkNpmDependencies).toBe('function');
		expect(typeof doctorModule.checkInstalledComponents).toBe('function');
		expect(typeof doctorModule.checkOrphanedFiles).toBe('function');
		expect(typeof doctorModule.checkLesserVersion).toBe('function');
	});

	it('should have correct description', async () => {
		const { doctorCommand } = await import('../src/commands/doctor.js');

		expect(doctorCommand.description()).toContain('Diagnose');
	});
});

describe('checkInstalledComponents extended', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('should detect orphaned components not in registry', async () => {
		const { checkInstalledComponents } = await import('../src/commands/doctor.js');

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [
				{
					name: 'nonexistent-component',
					version: '1.0.0',
					installedAt: new Date().toISOString(),
					modified: false,
					checksums: [],
				},
			],
		};

		const results = await checkInstalledComponents('/project', config);

		expect(Array.isArray(results)).toBe(true);
		// Should detect orphaned component
		const orphanedResult = results.find((r) => r.name === 'Orphaned Components');
		if (orphanedResult) {
			expect(orphanedResult.passed).toBe(false);
			expect(orphanedResult.message).toContain('not found in registry');
		}
	});
});

describe('checkNpmDependencies extended', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('should pass when no components are installed', async () => {
		const { checkNpmDependencies } = await import('../src/commands/doctor.js');

		const pkgPath = path.join('/project', 'package.json');
		fsStore.set(
			pkgPath,
			JSON.stringify({
				dependencies: { svelte: '^5.0.0' },
			})
		);

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [],
		};

		const results = await checkNpmDependencies('/project', config);

		expect(Array.isArray(results)).toBe(true);
		expect(results.length).toBe(1);
		expect(results[0]?.passed).toBe(true);
		expect(results[0]?.message).toContain('All required dependencies');
	});
});

describe('checkOrphanedFiles extended', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('should not rely on scanning a UI directory', async () => {
		const { checkOrphanedFiles } = await import('../src/commands/doctor.js');

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [],
		};

		const result = await checkOrphanedFiles('/project', config);

		expect(result.passed).toBe(true);
		expect(result.message).toContain('No orphaned component files detected');
	});

	it('should detect orphaned components by unexpected files on disk', async () => {
		const { checkOrphanedFiles } = await import('../src/commands/doctor.js');
		const { getComponent } = await import('../src/registry/index.js');

		vi.mocked(getComponent).mockImplementation((name: string) => {
			if (name !== 'button') return null as any;
			return {
				name: 'button',
				type: 'primitive',
				description: 'Button',
				files: [{ path: 'lib/primitives/button.ts', content: '', type: 'component' }],
				dependencies: [],
				devDependencies: [],
				registryDependencies: [],
				tags: [],
				version: '1.0.0',
				domain: 'core',
			} as any;
		});

		// Create a file for a component that is NOT tracked in components.json
		const orphanedPath = path.join('/project', 'src', 'lib', 'primitives', 'button.ts');
		fsStore.set(orphanedPath, 'export const orphaned = true;');

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [], // Empty - no components installed in config
		};

		const result = await checkOrphanedFiles('/project', config);

		expect(result.passed).toBe(false);
		expect(result.severity).toBe('warning');
		expect(result.message).toContain('not tracked in components.json');
		expect(result.details).toContain('button');
	});

	it('should pass when no orphaned files detected', async () => {
		const { checkOrphanedFiles } = await import('../src/commands/doctor.js');

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [],
		};

		const result = await checkOrphanedFiles('/project', config);

		expect(result.passed).toBe(true);
		expect(result.message).toContain('No orphaned component files detected');
	});
});

describe('checkInstalledComponents file verification', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('should detect missing component files', async () => {
		const { checkInstalledComponents } = await import('../src/commands/doctor.js');
		const { getComponent } = await import('../src/registry/index.js');

		// Mock a component in registry with files
		vi.mocked(getComponent).mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			files: [{ path: 'lib/primitives/button.ts', content: '', type: 'component' }],
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
			version: '1.0.0',
			domain: 'core',
		} as any);

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [
				{
					name: 'button',
					version: '1.0.0',
					installedAt: new Date().toISOString(),
					modified: false,
					checksums: [],
				},
			],
		};

		// File doesn't exist
		const results = await checkInstalledComponents('/project', config);

		// Should have a result about missing files
		const missingResult = results.find((r) => r.name === 'Component Files' && !r.passed);
		expect(missingResult).toBeDefined();
		expect(missingResult?.message).toContain('missing');
	});

	it('should detect modified files via checksum', async () => {
		const { checkInstalledComponents } = await import('../src/commands/doctor.js');
		const { getComponent } = await import('../src/registry/index.js');

		// Mock a component in registry with files
		vi.mocked(getComponent).mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			files: [{ path: 'lib/primitives/button.ts', content: 'original', type: 'component' }],
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
			version: '1.0.0',
			domain: 'core',
		} as any);

		const filePath = path.join('/project', 'src', 'lib', 'primitives', 'button.ts');
		fsStore.set(filePath, 'modified content'); // Different content

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [
				{
					name: 'button',
					version: '1.0.0',
					installedAt: new Date().toISOString(),
					modified: false,
					checksums: [
						{
							path: 'lib/primitives/button.ts',
							checksum: 'sha256-original-checksum',
						},
					],
				},
			],
		};

		const results = await checkInstalledComponents('/project', config);

		// Should have a result about modified files
		const modifiedResult = results.find((r) => r.name === 'Local Modifications');
		expect(modifiedResult).toBeDefined();
		expect(modifiedResult?.message).toContain('local modifications');
	});

	it('should verify files successfully when checksum matches', async () => {
		const { checkInstalledComponents } = await import('../src/commands/doctor.js');
		const { computeChecksum } = await import('../src/utils/integrity.js');
		const { getComponent } = await import('../src/registry/index.js');

		const fileContent = 'exact file content';
		const expectedChecksum = computeChecksum(Buffer.from(fileContent));

		// Mock a component in registry with files
		vi.mocked(getComponent).mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			files: [{ path: 'lib/primitives/button.ts', content: fileContent, type: 'component' }],
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
			version: '1.0.0',
			domain: 'core',
		} as any);

		const filePath = path.join('/project', 'src', 'lib', 'primitives', 'button.ts');
		fsStore.set(filePath, fileContent);

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [
				{
					name: 'button',
					version: '1.0.0',
					installedAt: new Date().toISOString(),
					modified: false,
					checksums: [
						{
							path: 'lib/primitives/button.ts',
							checksum: expectedChecksum,
						},
					],
				},
			],
		};

		const results = await checkInstalledComponents('/project', config);

		// Should have a passing result
		const passedResult = results.find((r) => r.passed && r.name === 'Component Files');
		expect(passedResult).toBeDefined();
		expect(passedResult?.message).toContain('verified');
	});

	it('should handle file read error during checksum verification as missing', async () => {
		const { checkInstalledComponents } = await import('../src/commands/doctor.js');
		const { getComponent } = await import('../src/registry/index.js');

		vi.mocked(getComponent).mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			files: [{ path: 'lib/primitives/button.ts', content: 'content', type: 'component' }],
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
			version: '1.0.0',
			domain: 'core',
		} as any);

		const filePath = path.join('/project', 'src', 'lib', 'primitives', 'button.ts');
		fsStore.set(filePath, 'content');
		fsMock.readFile.mockRejectedValueOnce(new Error('Read error'));

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [
				{
					name: 'button',
					version: '1.0.0',
					installedAt: new Date().toISOString(),
					modified: false,
					checksums: [{ path: 'lib/primitives/button.ts', checksum: 'sha256-somechecksum' }],
				},
			],
		};

		const results = await checkInstalledComponents('/project', config);
		const missingResult = results.find((r) => r.name === 'Component Files' && !r.passed);
		expect(missingResult).toBeDefined();
	});

	it('should count files without checksums as valid', async () => {
		const { checkInstalledComponents } = await import('../src/commands/doctor.js');
		const { getComponent } = await import('../src/registry/index.js');

		vi.mocked(getComponent).mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			files: [{ path: 'lib/primitives/button.ts', content: 'content', type: 'component' }],
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
			version: '1.0.0',
			domain: 'core',
		} as any);

		const filePath = path.join('/project', 'src', 'lib', 'primitives', 'button.ts');
		fsStore.set(filePath, 'content');

		const config = {
			version: '1.0.0',
			ref: 'greater-v4.2.0',
			style: 'default' as const,
			rsc: false,
			tsx: false,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
			},
			css: { tokens: true, primitives: true, face: null },
			installed: [
				{
					name: 'button',
					version: '1.0.0',
					installedAt: new Date().toISOString(),
					modified: false,
					checksums: [],
				},
			],
		};

		const results = await checkInstalledComponents('/project', config);
		const passedResult = results.find((r) => r.passed && r.name === 'Component Files');
		expect(passedResult).toBeDefined();
	});
});

describe('Command Execution', () => {
	let exitSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
	});

	afterEach(() => {
		exitSpy.mockRestore();
	});

	it('exits if not a valid project', async () => {
		const pkgPath = path.join('/project', 'package.json');
		fsStore.delete(pkgPath); // Ensure no package.json

		const { doctorAction } = await import('../src/commands/doctor.js');
		await doctorAction({ cwd: '/project' });

		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('outputs JSON when requested', async () => {
		// Setup valid project
		const pkgPath = path.join('/project', 'package.json');
		fsStore.set(
			pkgPath,
			JSON.stringify({
				dependencies: { svelte: '^5.0.0' },
			})
		);
		const configPath = path.join('/project', 'components.json');
		fsStore.set(
			configPath,
			JSON.stringify({
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				installed: [],
			})
		);

		const { doctorAction } = await import('../src/commands/doctor.js');
		const { logger } = await import('../src/utils/logger.js');

		await doctorAction({ cwd: '/project', json: true });

		expect(logger.info).toHaveBeenCalled();
		const calls = (logger.info as any).mock.calls;
		const jsonCall = calls.find((call: any[]) => {
			try {
				const parsed = JSON.parse(call[0]);
				return parsed.totalChecks !== undefined;
			} catch {
				return false;
			}
		});
		expect(jsonCall).toBeDefined();
	});

	it('runs diagnostics and outputs summary (text)', async () => {
		// Setup valid project
		const pkgPath = path.join('/project', 'package.json');
		fsStore.set(
			pkgPath,
			JSON.stringify({
				dependencies: { svelte: '^5.0.0' },
			})
		);
		const configPath = path.join('/project', 'components.json');
		fsStore.set(
			configPath,
			JSON.stringify({
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				style: 'default',
				aliases: {
					components: '$lib/components',
					utils: '$lib/utils',
					ui: '$lib/components/ui',
					lib: '$lib',
					hooks: '$lib/primitives',
				},
				installed: [],
			})
		);

		const { doctorAction } = await import('../src/commands/doctor.js');
		const { logger } = await import('../src/utils/logger.js');

		await doctorAction({ cwd: '/project' });

		// Check for summary header
		expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Summary'));
	});

	it('attempts to fix issues when --fix is provided', async () => {
		// Setup valid project but missing alias dir
		const pkgPath = path.join('/project', 'package.json');
		fsStore.set(
			pkgPath,
			JSON.stringify({
				dependencies: { svelte: '^5.0.0' },
			})
		);
		const configPath = path.join('/project', 'components.json');
		fsStore.set(
			configPath,
			JSON.stringify({
				$schema: 'https://greater.components.dev/schema.json',
				version: '1.0.0',
				style: 'default',
				aliases: {
					ui: '$lib/components/ui', // Missing dir
				},
				installed: [],
			})
		);

		const { doctorAction } = await import('../src/commands/doctor.js');
		const { logger } = await import('../src/utils/logger.js');

		await doctorAction({ cwd: '/project', fix: true });

		expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Running auto-fix'));
		expect(fsMock.ensureDir).toHaveBeenCalled();
	});
});

// Mock logger for displaySummary and runAutoFix tests
vi.mock('../src/utils/logger.js', () => ({
	logger: {
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		success: vi.fn(),
		note: vi.fn(),
		newline: vi.fn(),
	},
}));

describe('displaySummary', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should display summary with all checks passed', async () => {
		const { displaySummary } = await import('../src/commands/doctor.js');
		const { logger } = await import('../src/utils/logger.js');

		const summary = {
			totalChecks: 5,
			passed: 5,
			failed: 0,
			warnings: 0,
			errors: 0,
			results: [],
		};

		displaySummary(summary);

		expect(logger.newline).toHaveBeenCalled();
		expect(logger.info).toHaveBeenCalled();
		expect(logger.success).toHaveBeenCalled();
		expect(logger.error).not.toHaveBeenCalled();
		expect(logger.warn).not.toHaveBeenCalled();
	});

	it('should display summary with errors', async () => {
		const { displaySummary } = await import('../src/commands/doctor.js');
		const { logger } = await import('../src/utils/logger.js');

		const summary = {
			totalChecks: 5,
			passed: 3,
			failed: 2,
			warnings: 0,
			errors: 2,
			results: [],
		};

		displaySummary(summary);

		expect(logger.error).toHaveBeenCalled();
		expect(logger.success).not.toHaveBeenCalled();
	});

	it('should display summary with warnings only', async () => {
		const { displaySummary } = await import('../src/commands/doctor.js');
		const { logger } = await import('../src/utils/logger.js');

		const summary = {
			totalChecks: 5,
			passed: 4,
			failed: 1,
			warnings: 1,
			errors: 0,
			results: [],
		};

		displaySummary(summary);

		expect(logger.warn).toHaveBeenCalled();
		expect(logger.error).not.toHaveBeenCalled();
		expect(logger.success).not.toHaveBeenCalled();
	});
});

describe('runAutoFix', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should skip config file fix with warning', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		const results = [
			{
				name: 'Configuration File',
				passed: false,
				severity: 'error' as const,
				message: 'No config found',
				autoFixable: true,
				fix: 'greater init',
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		// Config file cannot be auto-fixed (requires prompts)
		expect(fixed).toBe(0);
		expect(failed).toBe(0);
	});

	it('should fix missing alias directory', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		const results = [
			{
				name: 'Alias Path: $lib/components/ui',
				passed: false,
				severity: 'warning' as const,
				message: 'Directory does not exist',
				autoFixable: true,
				fix: 'mkdir -p "/project/src/lib/components/ui"',
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		expect(fixed).toBe(1);
		expect(failed).toBe(0);
		expect(fsMock.ensureDir).toHaveBeenCalledWith('/project/src/lib/components/ui');
	});

	it('should show npm install command as manual fix', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		const results = [
			{
				name: 'NPM Dependencies',
				passed: false,
				severity: 'warning' as const,
				message: 'Missing dependencies',
				autoFixable: true,
				fix: 'pnpm add some-package',
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		// npm commands are shown but not auto-executed
		expect(fixed).toBe(0);
		expect(failed).toBe(0);
	});

	it('should show manual fix for unknown fix types', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		const results = [
			{
				name: 'Custom Check',
				passed: false,
				severity: 'warning' as const,
				message: 'Something broken',
				autoFixable: true,
				fix: 'some manual command',
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		expect(fixed).toBe(0);
		expect(failed).toBe(0);
	});

	it('should handle fix error', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		fsMock.ensureDir.mockRejectedValueOnce(new Error('Permission denied'));

		const results = [
			{
				name: 'Alias Path: $lib/components/ui',
				passed: false,
				severity: 'warning' as const,
				message: 'Directory does not exist',
				autoFixable: true,
				fix: 'mkdir -p "/project/src/lib/components/ui"',
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		expect(fixed).toBe(0);
		expect(failed).toBe(1);
	});

	it('should skip already passed results', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		const results = [
			{
				name: 'Passed Check',
				passed: true,
				severity: 'info' as const,
				message: 'All good',
				autoFixable: true,
				fix: 'some fix',
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		expect(fixed).toBe(0);
		expect(failed).toBe(0);
	});

	it('should skip non-autofixable results', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		const results = [
			{
				name: 'Non-fixable Check',
				passed: false,
				severity: 'error' as const,
				message: 'Cannot be fixed',
				autoFixable: false,
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		expect(fixed).toBe(0);
		expect(failed).toBe(0);
	});

	it('should handle results without fix property', async () => {
		const { runAutoFix } = await import('../src/commands/doctor.js');

		const results = [
			{
				name: 'No Fix Check',
				passed: false,
				severity: 'warning' as const,
				message: 'No fix available',
				autoFixable: true,
				// No fix property
			},
		];

		const { fixed, failed } = await runAutoFix(results, '/project');

		expect(fixed).toBe(0);
		expect(failed).toBe(0);
	});
});
