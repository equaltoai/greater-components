/**
 * Install Preview Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	generatePreview,
	displayPreview,
	displayDryRunPreview,
	displayResolutionErrors,
	type InstallationPreview,
} from '../src/utils/install-preview.js';
import type { DependencyResolutionResult } from '../src/utils/dependency-resolver.js';
import type { ComponentConfig } from '../src/utils/config.js';

// Mock the logger
vi.mock('../src/utils/logger.js', () => ({
	logger: {
		debug: vi.fn(),
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		note: vi.fn(),
		newline: vi.fn(),
	},
}));

// Helper to create mock config
function createMockConfig(): ComponentConfig {
	return {
		version: '1.0.0',
		ref: 'greater-v0.1.1',
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
		css: {
			tokens: true,
			primitives: true,
			face: null,
		},
		installed: [],
	};
}

// Helper to create mock resolution result
function createMockResolutionResult(
	overrides: Partial<DependencyResolutionResult> = {}
): DependencyResolutionResult {
	return {
		resolved: [
			{
				name: 'button',
				type: 'primitive',
				isDirectRequest: true,
				isOptional: false,
				depth: 0,
				dependencies: [],
				metadata: {
					name: 'button',
					type: 'primitive',
					description: 'Button component',
					files: [{ path: 'button/Button.svelte', content: '', type: 'component' }],
					dependencies: [],
					devDependencies: [],
					registryDependencies: [],
					tags: [],
					version: '1.0.0',
					domain: 'core',
				},
			},
		],
		circular: [],
		missing: [],
		npmDependencies: [],
		npmDevDependencies: [],
		success: true,
		...overrides,
	};
}

describe('install-preview', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('generatePreview', () => {
		it('generates preview from resolution result', () => {
			const config = createMockConfig();
			const result = createMockResolutionResult();

			const preview = generatePreview(result, config, '/project');

			expect(preview.totalComponents).toBe(1);
			expect(preview.directRequests).toBe(1);
			expect(preview.transitiveDeps).toBe(0);
			expect(preview.targetPaths.length).toBe(1);
		});

		it('calculates transitive dependencies correctly', () => {
			const config = createMockConfig();
			const result = createMockResolutionResult({
				resolved: [
					{
						name: 'button',
						type: 'primitive',
						isDirectRequest: true,
						isOptional: false,
						depth: 0,
						dependencies: [],
						metadata: {
							name: 'button',
							type: 'primitive',
							description: 'Button',
							files: [],
							dependencies: [],
							devDependencies: [],
							registryDependencies: [],
							tags: [],
							version: '1.0.0',
							domain: 'core',
						},
					},
					{
						name: 'spinner',
						type: 'primitive',
						isDirectRequest: false, // transitive dependency
						isOptional: false,
						depth: 1,
						dependencies: [],
						metadata: {
							name: 'spinner',
							type: 'primitive',
							description: 'Spinner',
							files: [],
							dependencies: [],
							devDependencies: [],
							registryDependencies: [],
							tags: [],
							version: '1.0.0',
							domain: 'core',
						},
					},
				],
			});

			const preview = generatePreview(result, config, '/project');

			expect(preview.totalComponents).toBe(2);
			expect(preview.directRequests).toBe(1);
			expect(preview.transitiveDeps).toBe(1);
		});

		it('uses custom path when provided', () => {
			const config = createMockConfig();
			const result = createMockResolutionResult();

			const preview = generatePreview(result, config, '/project', '/custom/path');

			expect(preview.targetPaths[0]?.targetDir).toBe('/custom/path');
		});

		it('handles different component types', () => {
			const config = createMockConfig();
			const result = createMockResolutionResult({
				resolved: [
					{
						name: 'button',
						type: 'primitive',
						isDirectRequest: true,
						isOptional: false,
						depth: 0,
						dependencies: [],
						metadata: {
							name: 'button',
							type: 'primitive',
							description: 'Button',
							files: [],
							dependencies: [],
							devDependencies: [],
							registryDependencies: [],
							tags: [],
							version: '1.0.0',
							domain: 'core',
						},
					},
					{
						name: 'auth',
						type: 'shared',
						isDirectRequest: true,
						isOptional: false,
						depth: 0,
						dependencies: [],
						metadata: {
							name: 'auth',
							type: 'shared',
							description: 'Auth',
							files: [],
							dependencies: [],
							devDependencies: [],
							registryDependencies: [],
							tags: [],
							version: '1.0.0',
							domain: 'auth',
						},
					},
					{
						name: 'feed',
						type: 'pattern',
						isDirectRequest: true,
						isOptional: false,
						depth: 0,
						dependencies: [],
						metadata: {
							name: 'feed',
							type: 'pattern',
							useCase: 'social',
							description: 'Feed',
							files: [],
							dependencies: [],
							devDependencies: [],
							registryDependencies: [],
							tags: [],
							version: '1.0.0',
							domain: 'social',
						},
					},
				],
			});

			const preview = generatePreview(result, config, '/project');

			expect(preview.totalComponents).toBe(3);
			expect(preview.targetPaths).toHaveLength(3);
		});

		it('includes npm dependencies in preview', () => {
			const config = createMockConfig();
			const result = createMockResolutionResult({
				npmDependencies: [{ name: 'some-lib', version: '^1.0.0' }],
				npmDevDependencies: [{ name: 'some-dev-lib', version: '^2.0.0' }],
			});

			const preview = generatePreview(result, config, '/project');

			expect(preview.npmDependencies).toHaveLength(1);
			expect(preview.npmDependencies[0]?.name).toBe('some-lib');
			expect(preview.npmDevDependencies).toHaveLength(1);
			expect(preview.npmDevDependencies[0]?.name).toBe('some-dev-lib');
		});
	});

	describe('displayPreview', () => {
		it('displays preview without throwing', async () => {
			const { logger } = await import('../src/utils/logger.js');

			const preview: InstallationPreview = {
				byType: {
					primitives: [
						{
							name: 'button',
							type: 'primitive',
							isDirectRequest: true,
							isOptional: false,
							depth: 0,
							dependencies: [],
							metadata: {
								name: 'button',
								type: 'primitive',
								description: 'Button',
								files: [],
								dependencies: [],
								devDependencies: [],
								registryDependencies: [],
								tags: [],
								version: '1.0.0',
								domain: 'core',
							},
						},
					],
				},
				targetPaths: [
					{
						name: 'button',
						type: 'primitive',
						targetDir: '/project/src/lib/components/ui',
						files: ['Button.svelte'],
					},
				],
				npmDependencies: [],
				npmDevDependencies: [],
				diskSpace: { files: 1, estimatedKB: '~5 KB' },
				totalComponents: 1,
				directRequests: 1,
				transitiveDeps: 0,
			};

			expect(() => displayPreview(preview)).not.toThrow();
			expect(logger.info).toHaveBeenCalled();
		});

		it('displays npm dependencies when present', async () => {
			const { logger } = await import('../src/utils/logger.js');

			const preview: InstallationPreview = {
				byType: {},
				targetPaths: [],
				npmDependencies: [{ name: 'some-lib', version: '^1.0.0' }],
				npmDevDependencies: [{ name: 'dev-lib', version: '^2.0.0' }],
				diskSpace: { files: 0, estimatedKB: '0 KB' },
				totalComponents: 0,
				directRequests: 0,
				transitiveDeps: 0,
			};

			displayPreview(preview);

			// Should display npm dependencies section
			expect(logger.info).toHaveBeenCalled();
		});
	});

	describe('displayDryRunPreview', () => {
		it('displays dry run warning', async () => {
			const { logger } = await import('../src/utils/logger.js');

			const preview: InstallationPreview = {
				byType: {},
				targetPaths: [],
				npmDependencies: [],
				npmDevDependencies: [],
				diskSpace: { files: 0, estimatedKB: '0 KB' },
				totalComponents: 0,
				directRequests: 0,
				transitiveDeps: 0,
			};

			displayDryRunPreview(preview);

			// Should display dry run messages
			expect(logger.info).toHaveBeenCalled();
		});
	});

	describe('displayResolutionErrors', () => {
		it('displays circular dependency errors', async () => {
			const { logger } = await import('../src/utils/logger.js');

			const result: DependencyResolutionResult = {
				resolved: [],
				circular: [{ path: ['a', 'b', 'a'], message: 'a → b → a' }],
				missing: [],
				npmDependencies: [],
				npmDevDependencies: [],
				success: false,
			};

			displayResolutionErrors(result);

			expect(logger.error).toHaveBeenCalled();
		});

		it('displays missing dependency errors', async () => {
			const { logger } = await import('../src/utils/logger.js');

			const result: DependencyResolutionResult = {
				resolved: [],
				circular: [],
				missing: [{ name: 'unknown-component', requiredBy: 'button' }],
				npmDependencies: [],
				npmDevDependencies: [],
				success: false,
			};

			displayResolutionErrors(result);

			expect(logger.error).toHaveBeenCalled();
		});

		it('handles result with no errors', async () => {
			const { logger } = await import('../src/utils/logger.js');

			const result: DependencyResolutionResult = {
				resolved: [],
				circular: [],
				missing: [],
				npmDependencies: [],
				npmDevDependencies: [],
				success: true,
			};

			displayResolutionErrors(result);

			// Should not call error for successful result
			expect(logger.error).not.toHaveBeenCalled();
		});
	});
});
