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
