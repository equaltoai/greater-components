/**
 * Dependency Resolution Tests
 * Comprehensive tests for dependency tree building and resolution
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	MOCK_BUTTON_COMPONENT,
	MOCK_MODAL_COMPONENT,
	MOCK_TIMELINE_COMPONENT,
	createTestComponentMetadata,
} from './fixtures/index.js';

// Mock the registry modules
vi.mock('../src/registry/index.js', () => ({
	getComponent: vi.fn(),
	componentRegistry: {},
}));

vi.mock('../src/registry/faces.js', () => ({
	getFaceManifest: vi.fn(),
	getFaceComponents: vi.fn(),
	faceRegistry: {},
}));

vi.mock('../src/registry/shared.js', () => ({
	getSharedModule: vi.fn(),
	sharedModuleRegistry: {},
}));

vi.mock('../src/registry/patterns.js', () => ({
	getPattern: vi.fn(),
	patternRegistry: {},
}));

describe('Dependency Resolution', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('resolveDependencies', () => {
		it('resolves single component without dependencies', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('button')];
			const result = resolveDependencies(items);

			expect(result.success).toBe(true);
			expect(result.resolved).toHaveLength(1);
			expect(result.resolved[0].name).toBe('button');
			expect(result.circular).toHaveLength(0);
			expect(result.missing).toHaveLength(0);
		});

		it('resolves component with dependencies in correct order', async () => {
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

			expect(result.success).toBe(true);
			expect(result.resolved.length).toBeGreaterThanOrEqual(2);

			// Dependencies should come before dependents (higher depth first)
			const buttonIndex = result.resolved.findIndex((r) => r.name === 'button');
			const modalIndex = result.resolved.findIndex((r) => r.name === 'modal');
			expect(buttonIndex).toBeLessThan(modalIndex);
		});

		it('resolves deep dependency chains', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') return MOCK_BUTTON_COMPONENT;
				if (name === 'modal') return MOCK_MODAL_COMPONENT;
				if (name === 'timeline') return MOCK_TIMELINE_COMPONENT;
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('timeline')];
			const result = resolveDependencies(items);

			expect(result.success).toBe(true);
			expect(result.resolved.length).toBeGreaterThanOrEqual(3);
		});

		it('detects circular dependencies', async () => {
			const circularA = createTestComponentMetadata('circular-a', {
				registryDependencies: ['circular-b'],
			});
			const circularB = createTestComponentMetadata('circular-b', {
				registryDependencies: ['circular-a'],
			});

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'circular-a') return circularA;
				if (name === 'circular-b') return circularB;
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('circular-a')];
			const result = resolveDependencies(items);

			expect(result.success).toBe(false);
			expect(result.circular.length).toBeGreaterThan(0);
			expect(result.circular[0].path).toContain('circular-a');
			expect(result.circular[0].path).toContain('circular-b');
		});

		it('reports missing dependencies', async () => {
			const componentWithMissing = createTestComponentMetadata('has-missing', {
				registryDependencies: ['nonexistent-component'],
			});

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'has-missing') return componentWithMissing;
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('has-missing')];
			const result = resolveDependencies(items);

			expect(result.success).toBe(false);
			expect(result.missing.length).toBeGreaterThan(0);
			expect(result.missing[0].name).toBe('nonexistent-component');
			expect(result.missing[0].requiredBy).toBe('has-missing');
		});

		it('deduplicates shared dependencies', async () => {
			const compA = createTestComponentMetadata('comp-a', {
				registryDependencies: ['button'],
			});
			const compB = createTestComponentMetadata('comp-b', {
				registryDependencies: ['button'],
			});

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') return MOCK_BUTTON_COMPONENT;
				if (name === 'comp-a') return compA;
				if (name === 'comp-b') return compB;
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('comp-a'), parseItemName('comp-b')];
			const result = resolveDependencies(items);

			expect(result.success).toBe(true);
			const buttonCount = result.resolved.filter((r) => r.name === 'button').length;
			expect(buttonCount).toBe(1);
		});

		it('skips already installed components', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') return MOCK_BUTTON_COMPONENT;
				if (name === 'modal') return MOCK_MODAL_COMPONENT;
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('modal')];
			const result = resolveDependencies(items, {
				skipInstalled: ['button'],
			});

			expect(result.success).toBe(true);
			const hasButton = result.resolved.some((r) => r.name === 'button');
			expect(hasButton).toBe(false);
		});

		it('respects maxDepth option', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') return MOCK_BUTTON_COMPONENT;
				if (name === 'modal') return MOCK_MODAL_COMPONENT;
				if (name === 'timeline')
					return { ...MOCK_TIMELINE_COMPONENT, registryDependencies: ['modal'] };
				return null;
			});

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('timeline')];
			const result = resolveDependencies(items, { maxDepth: 1 });

			// Should not resolve deep dependencies beyond maxDepth
			expect(result.resolved.length).toBeLessThan(3);
		});

		it('collects NPM dependencies', async () => {
			const componentWithNpm = createTestComponentMetadata('with-npm', {
				dependencies: [
					{ name: 'lodash', version: '^4.17.0' },
					{ name: 'date-fns', version: '^2.0.0' },
				],
			});

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(componentWithNpm);

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('with-npm')];
			const result = resolveDependencies(items);

			expect(result.npmDependencies).toHaveLength(2);
			expect(result.npmDependencies.some((d) => d.name === 'lodash')).toBe(true);
		});

		it('does not trust registry index peerDependencies for npm installation', async () => {
			const componentWithNpm = createTestComponentMetadata('with-static-npm', {
				dependencies: [{ name: 'svelte', version: '^5.0.0' }],
			});

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(componentWithNpm);

			const { resolveDependencies } = await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const result = resolveDependencies([parseItemName('with-static-npm')], {
				registryIndex: {
					schemaVersion: '1.0.0',
					version: '1.0.0',
					ref: 'greater-v1.0.0',
					generatedAt: new Date().toISOString(),
					checksums: {},
					components: {
						'with-static-npm': {
							name: 'with-static-npm',
							version: '1.0.0',
							files: [],
							dependencies: [],
							peerDependencies: [{ name: 'malicious-postinstall', version: '*' }],
						},
					},
					faces: {},
					shared: {},
				},
			});

			expect(result.npmDependencies.map((dependency) => dependency.name)).toEqual(['svelte']);
		});

		it('marks direct requests vs transitive dependencies', async () => {
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

			const modal = result.resolved.find((r) => r.name === 'modal');
			const button = result.resolved.find((r) => r.name === 'button');

			expect(modal?.isDirectRequest).toBe(true);
			expect(button?.isDirectRequest).toBe(false);
		});
	});

	describe('getInstallationOrder', () => {
		it('returns names in installation order', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') return MOCK_BUTTON_COMPONENT;
				if (name === 'modal') return MOCK_MODAL_COMPONENT;
				return null;
			});

			const { resolveDependencies, getInstallationOrder } =
				await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('modal')];
			const result = resolveDependencies(items);
			const order = getInstallationOrder(result);

			expect(order.indexOf('button')).toBeLessThan(order.indexOf('modal'));
		});
	});

	describe('mapRegistryFilePathToInstallPath (issue #674 regression)', () => {
		// Issue #674: host installing `shell` from greater-v0.9.1-rc.0 received
		// 404s because the CLI routed shell's registry-shared files into the
		// `packages/shared/shell/...` location, which does not exist. The fix
		// adds top-level packages (`shell`, `host-platform`) to
		// `CORE_PACKAGE_NAMES`, which makes this function emit
		// `greater/<name>/...` install paths instead of `shared/<name>/...`.
		//
		// These tests lock in the routing decision so a future top-level
		// package addition can't silently regress install routing.

		it('routes shell (type=shared) into greater/shell/, NOT shared/shell/', async () => {
			const { mapRegistryFilePathToInstallPath } =
				await import('../src/utils/dependency-resolver.js');

			expect(
				mapRegistryFilePathToInstallPath('shell', 'shared', 'src/components/Breadcrumb.css')
			).toBe('greater/shell/components/Breadcrumb.css');

			expect(
				mapRegistryFilePathToInstallPath('shell', 'shared', 'src/components/CommandPalette.svelte')
			).toBe('greater/shell/components/CommandPalette.svelte');

			expect(mapRegistryFilePathToInstallPath('shell', 'shared', 'src/types.ts')).toBe(
				'greater/shell/types.ts'
			);

			expect(mapRegistryFilePathToInstallPath('shell', 'shared', 'src/base.css')).toBe(
				'greater/shell/base.css'
			);
		});

		it('routes host-platform (type=shared) into greater/host-platform/, NOT shared/host-platform/', async () => {
			const { mapRegistryFilePathToInstallPath } =
				await import('../src/utils/dependency-resolver.js');

			expect(
				mapRegistryFilePathToInstallPath(
					'host-platform',
					'shared',
					'src/components/FleetCard.svelte'
				)
			).toBe('greater/host-platform/components/FleetCard.svelte');

			expect(
				mapRegistryFilePathToInstallPath('host-platform', 'shared', 'src/components/CostGauge.css')
			).toBe('greater/host-platform/components/CostGauge.css');

			expect(
				mapRegistryFilePathToInstallPath('host-platform', 'shared', 'src/utils/format.ts')
			).toBe('greater/host-platform/utils/format.ts');
		});

		it('keeps existing core packages routed under greater/<name>/', async () => {
			const { mapRegistryFilePathToInstallPath } =
				await import('../src/utils/dependency-resolver.js');

			// Sanity check the historical routing for the original CORE_PACKAGE_NAMES
			// members so adding new entries can't accidentally break the old ones.
			expect(mapRegistryFilePathToInstallPath('primitives', 'shared', 'src/Button.svelte')).toBe(
				'greater/primitives/Button.svelte'
			);
			expect(mapRegistryFilePathToInstallPath('icons', 'shared', 'src/Search.svelte')).toBe(
				'greater/icons/Search.svelte'
			);
			expect(mapRegistryFilePathToInstallPath('tokens', 'shared', 'src/tokens.css')).toBe(
				'greater/tokens/tokens.css'
			);
			expect(mapRegistryFilePathToInstallPath('headless', 'shared', 'src/focus-trap.ts')).toBe(
				'greater/headless/focus-trap.ts'
			);
		});

		it('keeps genuine shared modules (non-core) routed under shared/<name>/', async () => {
			const { mapRegistryFilePathToInstallPath } =
				await import('../src/utils/dependency-resolver.js');

			// Real shared modules — `composer`, `notifications`, etc. — are
			// intentionally NOT in CORE_PACKAGE_NAMES; they live at
			// `packages/shared/<name>/`, so the fetcher must continue to look
			// for them at `shared/<name>/...`.
			expect(mapRegistryFilePathToInstallPath('composer', 'shared', 'src/Composer.svelte')).toBe(
				'shared/composer/Composer.svelte'
			);
			expect(
				mapRegistryFilePathToInstallPath('notifications', 'shared', 'src/NotificationList.svelte')
			).toBe('shared/notifications/NotificationList.svelte');
		});

		it('routes faces independently of CORE_PACKAGE_NAMES', async () => {
			const { mapRegistryFilePathToInstallPath } =
				await import('../src/utils/dependency-resolver.js');

			expect(mapRegistryFilePathToInstallPath('social', 'face', 'src/Timeline.svelte')).toBe(
				'greater/faces/social/Timeline.svelte'
			);
			// Even if a face's name collides with a CORE_PACKAGE_NAMES entry, the
			// `face` type takes precedence (faces are emitted under
			// `greater/faces/<name>/`, never the bare `greater/<name>/`).
			expect(mapRegistryFilePathToInstallPath('shell', 'face', 'src/Surface.svelte')).toBe(
				'greater/faces/shell/Surface.svelte'
			);
		});

		it('handles paths that do not start with src/', async () => {
			const { mapRegistryFilePathToInstallPath } =
				await import('../src/utils/dependency-resolver.js');

			expect(mapRegistryFilePathToInstallPath('shell', 'shared', 'index.ts')).toBe(
				'greater/shell/index.ts'
			);
		});

		it('returns null for non-mappable types', async () => {
			const { mapRegistryFilePathToInstallPath } =
				await import('../src/utils/dependency-resolver.js');

			expect(mapRegistryFilePathToInstallPath('button', 'primitive', 'src/Button.svelte')).toBe(
				null
			);
			expect(mapRegistryFilePathToInstallPath('modal', 'compound', 'src/Modal.svelte')).toBe(null);
		});
	});

	describe('groupByType', () => {
		it('groups resolved dependencies by type', async () => {
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockImplementation((name: string) => {
				if (name === 'button') return MOCK_BUTTON_COMPONENT;
				if (name === 'timeline') return MOCK_TIMELINE_COMPONENT;
				return null;
			});

			const { resolveDependencies, groupByType } =
				await import('../src/utils/dependency-resolver.js');
			const { parseItemName } = await import('../src/utils/item-parser.js');

			const items = [parseItemName('button'), parseItemName('timeline')];
			const result = resolveDependencies(items);
			const groups = groupByType(result);

			expect(groups.primitives.length).toBeGreaterThan(0);
			expect(groups.compounds.length).toBeGreaterThan(0);
		});
	});
});
