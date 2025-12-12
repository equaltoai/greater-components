/**
 * E2E Workflow Tests
 * Complete workflow tests from init to update
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	MockFileSystem,
	SVELTEKIT_PROJECT,
	MOCK_BUTTON_COMPONENT,
	MOCK_MODAL_COMPONENT,
	MOCK_SOCIAL_FACE,
} from '../fixtures/index.js';

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
	default: vi.fn().mockResolvedValue({
		style: 'default',
		componentsPath: '$lib/components/ui',
		utilsPath: '$lib/utils',
		confirm: true,
	}),
}));

vi.mock('../../src/utils/logger.js', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		note: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		newline: vi.fn(),
	},
}));

vi.mock('../../src/utils/fetch.js', () => ({
	fetchComponentFiles: vi.fn().mockResolvedValue({
		files: [{ path: 'button.ts', content: 'export const button = {};', type: 'component' }],
		ref: 'greater-v4.2.0',
	}),
}));

vi.mock('../../src/registry/index.js', () => ({
	getComponent: vi.fn((name) => {
		if (name === 'button') return MOCK_BUTTON_COMPONENT;
		if (name === 'modal') return MOCK_MODAL_COMPONENT;
		return null;
	}),
	componentRegistry: {},
	getAllComponentNames: vi.fn().mockReturnValue(['button', 'modal']),
}));

vi.mock('../../src/registry/faces.js', () => ({
	getFaceManifest: vi.fn((name) => {
		if (name === 'social') return MOCK_SOCIAL_FACE;
		return null;
	}),
	faceRegistry: { social: MOCK_SOCIAL_FACE },
}));

describe('E2E Workflows', () => {
	beforeEach(() => {
		mockFs.clear();
		vi.clearAllMocks();
	});

	describe('Init → Add → Update Workflow', () => {
		it('completes full workflow successfully', async () => {
			// Step 1: Setup project
			mockFs.setupProject(SVELTEKIT_PROJECT);

			// Step 2: Verify project is valid
			const { isValidProject } = await import('../../src/utils/files.js');
			expect(await isValidProject('/')).toBe(true);

			// Step 3: Create config (simulating init)
			const { createDefaultConfig, writeConfig, readConfig, configExists } =
				await import('../../src/utils/config.js');
			const config = createDefaultConfig();
			await writeConfig(config, '/');

			expect(await configExists('/')).toBe(true);

			// Step 4: Add component (simulating add)
			const { addInstalledComponent } = await import('../../src/utils/config.js');
			const updatedConfig = addInstalledComponent(config, 'button', 'v1.0.0');
			await writeConfig(updatedConfig, '/');

			// Step 5: Verify component was added
			const savedConfig = await readConfig('/');
			expect(savedConfig).toBeDefined();
			expect(savedConfig?.installed).toHaveLength(1);
			expect(savedConfig?.installed?.[0].name).toBe('button');

			// Step 6: Update component (simulating update)
			if (!savedConfig) throw new Error('Config not found');
			const finalConfig = addInstalledComponent(savedConfig, 'button', 'greater-v4.3.0');
			await writeConfig(finalConfig, '/');

			// Step 7: Verify update
			const verifyConfig = await readConfig('/');
			expect(verifyConfig?.installed[0].version).toBe('greater-v4.3.0');
		});
	});

	describe('Face Installation Workflow', () => {
		it('resolves face dependencies', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { getFaceManifest } = await import('../../src/registry/faces.js');
			const face = getFaceManifest('social');

			expect(face).toBeDefined();
			expect(face?.includes.primitives).toContain('button');
		});

		it('updates config with face selection', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { createDefaultConfig, writeConfig, readConfig } =
				await import('../../src/utils/config.js');

			const config = createDefaultConfig({
				face: 'social',
			});
			await writeConfig(config, '/');

			const savedConfig = await readConfig('/');
			expect(savedConfig?.css.face).toBe('social');
		});
	});

	describe('Error Handling and Recovery', () => {
		it('handles missing config gracefully', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);
			// Don't create components.json

			const { configExists } = await import('../../src/utils/config.js');
			expect(await configExists('/')).toBe(false);
		});

		it('handles invalid config JSON', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);
			mockFs.set('/components.json', '{invalid json}');

			const { readConfig } = await import('../../src/utils/config.js');
			await expect(readConfig('/')).rejects.toThrow();
		});

		it('handles missing project package.json', async () => {
			mockFs.clear();

			const { isValidProject } = await import('../../src/utils/files.js');
			expect(await isValidProject('/')).toBe(false);
		});
	});

	describe('Offline Mode', () => {
		it('checks network availability', async () => {
			const { isNetworkAvailable } = await import('../../src/utils/offline.js');

			// This will make a real network request in tests
			// In CI, we might want to mock this
			const available = await isNetworkAvailable();
			expect(typeof available).toBe('boolean');
		});

		it('enables offline mode', async () => {
			const { enableOfflineMode, isOfflineMode, disableOfflineMode } =
				await import('../../src/utils/offline.js');

			enableOfflineMode();
			expect(isOfflineMode()).toBe(true);

			disableOfflineMode();
			expect(isOfflineMode()).toBe(false);
		});

		it('gets cache status', async () => {
			const { getCacheStatus } = await import('../../src/utils/offline.js');

			const status = await getCacheStatus('greater-v4.2.0');

			expect(status.ref).toBe('greater-v4.2.0');
			expect(typeof status.hasRegistryIndex).toBe('boolean');
			expect(Array.isArray(status.cachedFiles)).toBe(true);
		});
	});

	describe('Multiple Component Installation', () => {
		it('installs multiple components with dependencies', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { createDefaultConfig, writeConfig, addInstalledComponent } =
				await import('../../src/utils/config.js');

			let config = createDefaultConfig();

			// Add button first (dependency)
			config = addInstalledComponent(config, 'button', 'v1.0.0');

			// Add modal (depends on button)
			config = addInstalledComponent(config, 'modal', 'v1.0.0');

			await writeConfig(config, '/');

			expect(config.installed).toHaveLength(2);
			expect(config.installed.map((c) => c.name)).toContain('button');
			expect(config.installed.map((c) => c.name)).toContain('modal');
		});
	});
});
