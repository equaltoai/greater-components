/**
 * Update Command Integration Tests
 * Tests the full execution of the update command
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	MockFileSystem,
	SVELTEKIT_PROJECT,
	createTestConfig,
	createInstalledComponent,
	createTestComponentMetadata,
} from './fixtures/index.js';

// Custom error to simulate process.exit
class ProcessExitError extends Error {
	code: number;
	constructor(code: number) {
		super(`Process exit: ${code}`);
		this.code = code;
	}
}

// Setup Mock FS
const mockFs = new MockFileSystem();

vi.mock('fs-extra', () => ({
	default: mockFs.createFsMock(),
	...mockFs.createFsMock(),
}));

// Mock Ora
vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn(),
		fail: vi.fn(),
		warn: vi.fn(),
		stop: vi.fn(),
		text: '',
	})),
}));

// Mock Prompts
const mockPrompts = vi.fn();
vi.mock('prompts', () => ({
	default: mockPrompts,
}));

// Mock Logger
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

// Mock Fetch
vi.mock('../src/utils/fetch.js', () => ({
	fetchComponentFiles: vi.fn().mockResolvedValue({
		files: [
			{
				path: 'lib/components/ui/button/button.svelte',
				content: '<script>export let variant = "primary";</script><button>New Button</button>',
				type: 'component',
			},
		],
		ref: 'greater-v5.0.0',
	}),
}));

// Mock Registry
const mockGetComponent = vi.fn();
vi.mock('../src/registry/index.js', () => ({
	getComponent: mockGetComponent,
	componentRegistry: {},
}));

// Mock Process Exit
const _mockExit = vi.spyOn(process, 'exit').mockImplementation(((code: number) => {
	throw new ProcessExitError(code);
}) as any);

describe('Update Command Execution', () => {
	let updateCommand: any;

	beforeEach(async () => {
		mockFs.clear();
		mockFs.setupProject(SVELTEKIT_PROJECT);
		vi.clearAllMocks();

		// Reset prompts default behavior
		mockPrompts.mockResolvedValue({ confirm: true, resolution: 'overwrite' });

		// Import the command freshly for each test
		const module = await import('../src/commands/update.js');
		updateCommand = module.updateCommand;

		// Setup default mocks
		mockGetComponent.mockReturnValue(
			createTestComponentMetadata('button', {
				files: [{ path: 'lib/components/ui/button/button.svelte', content: '', type: 'component' }],
			})
		);
	});

	afterEach(() => {
		vi.resetModules();
	});

	it('should exit if config is missing', async () => {
		// No config created in FS
		await expect(updateCommand.parseAsync(['node', 'test', '--all', '--cwd', '/'])).rejects.toThrow(
			'Process exit: 1'
		);
	});

	it('should update all components when --all is passed', async () => {
		// Setup config with installed button
		const config = createTestConfig({
			installed: [createInstalledComponent('button', { version: '1.0.0' })],
		});
		mockFs.set('/components.json', JSON.stringify(config));

		// Setup local file
		mockFs.set('/src/lib/components/ui/button/button.svelte', '<button>Old Button</button>');

		await updateCommand.parseAsync(['node', 'test', '--all', '--cwd', '/']);

		// Check if file was updated
		expect(mockFs.get('/src/lib/components/ui/button/button.svelte')).toContain('New Button');

		// Check if config was updated
		const configContent = mockFs.get('/components.json');
		const updatedConfig = JSON.parse(configContent || '{}');
		expect(updatedConfig.installed.find((c: any) => c.name === 'button').version).toBe(
			'greater-v4.2.0'
		);
	});

	it('should update specific component', async () => {
		const config = createTestConfig({
			installed: [createInstalledComponent('button', { version: '1.0.0' })],
		});
		mockFs.set('/components.json', JSON.stringify(config));
		mockFs.set('/src/lib/components/ui/button/button.svelte', '<button>Old Button</button>');

		await updateCommand.parseAsync(['node', 'test', 'button', '--cwd', '/']);

		expect(mockFs.get('/src/lib/components/ui/button/button.svelte')).toContain('New Button');
	});

	it('should warn if component not installed', async () => {
		const config = createTestConfig({
			installed: [],
		});
		mockFs.set('/components.json', JSON.stringify(config));

		// Expect strict exit 1 because "No components specified" or "No components to update" logic
		// "button" is filtered out because not installed. items=[] then.
		// Code: if (componentNames.length === 0) { ... process.exit(0); } -- wait, if items passed but filtered out?
		// Code:
		// if (items.length > 0) {
		//    const installed = ...
		//    const notInstalled = items.filter(...)
		//    ... warn about notInstalled ...
		//    componentNames = items.filter(name => installed.includes(name))
		// }
		// if (componentNames.length === 0) { process.exit(0); }

		// So it should exit 0.
		await expect(
			updateCommand.parseAsync(['node', 'test', 'button', '--cwd', '/'])
		).rejects.toThrow('Process exit: 0');
	});

	it('should handle conflict with "overwrite"', async () => {
		const config = createTestConfig({
			installed: [createInstalledComponent('button', { version: '1.0.0', modified: true })],
		});
		mockFs.set('/components.json', JSON.stringify(config));

		// "Modified" local content different from remote
		mockFs.set('/src/lib/components/ui/button/button.svelte', '<button>Locally Modified</button>');

		// First prompt: Confirm update start
		// Second prompt: Conflict resolution
		mockPrompts.mockResolvedValueOnce({ confirm: true });
		mockPrompts.mockResolvedValueOnce({ resolution: 'overwrite' });

		await updateCommand.parseAsync(['node', 'test', 'button', '--cwd', '/']);

		expect(mockFs.get('/src/lib/components/ui/button/button.svelte')).toContain('New Button');
	});

	it('should handle conflict with "keep"', async () => {
		const config = createTestConfig({
			installed: [createInstalledComponent('button', { version: '1.0.0', modified: true })],
		});
		mockFs.set('/components.json', JSON.stringify(config));
		mockFs.set('/src/lib/components/ui/button/button.svelte', '<button>Locally Modified</button>');

		// First prompt: Confirm
		// Second prompt: Resolution
		mockPrompts.mockResolvedValueOnce({ confirm: true });
		mockPrompts.mockResolvedValueOnce({ resolution: 'keep' });

		await updateCommand.parseAsync(['node', 'test', 'button', '--cwd', '/']);

		expect(mockFs.get('/src/lib/components/ui/button/button.svelte')).toContain('Locally Modified');
	});

	it('should skip update if user declines confirmation', async () => {
		const config = createTestConfig({
			installed: [createInstalledComponent('button')],
		});
		mockFs.set('/components.json', JSON.stringify(config));

		mockPrompts.mockResolvedValueOnce({ confirm: false });

		await expect(
			updateCommand.parseAsync(['node', 'test', 'button', '--cwd', '/'])
		).rejects.toThrow('Process exit: 0');
	});
});
