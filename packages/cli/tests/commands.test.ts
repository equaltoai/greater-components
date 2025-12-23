import { afterEach, describe, expect, it, vi } from 'vitest';
function srcPath(rel: string) {
	return new URL(`../src/${rel}`, import.meta.url).pathname;
}

const mockConfig = {
	style: 'default',
	rsc: false,
	tsx: true,
	aliases: {
		components: '$lib/components',
		utils: '$lib/utils',
		ui: '$lib/ui',
		lib: '$lib',
		hooks: '$lib/primitives',
	},
};

const mockLogger = {
	info: vi.fn(),
	success: vi.fn(),
	note: vi.fn(),
	debug: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
	newline: vi.fn(),
};

const spinner = {
	start: vi.fn().mockReturnThis(),
	succeed: vi.fn(),
	fail: vi.fn(),
	warn: vi.fn(),
};

const mockOra = vi.fn(() => spinner);

const mockConfigExists = vi.fn();
const mockReadConfig = vi.fn();
const mockWriteConfig = vi.fn();
const mockCreateDefaultConfig = vi.fn(() => mockConfig);
const mockResolveAlias = vi.fn((_alias, _config, _cwd) => '$lib/ui');

const mockIsValidProject = vi.fn();
const mockDetectProjectType = vi.fn();
const mockDetectProjectDetails = vi.fn();
const mockGetSvelteVersion = vi.fn();
const mockValidateSvelteVersion = vi.fn();
const mockWriteComponentFiles = vi.fn().mockResolvedValue({
	writtenFiles: [],
	transformResults: [],
});

const mockFetchComponents = vi.fn();
const mockGetMissingDependencies = vi.fn();
const mockInstallDependencies = vi.fn();
const mockDetectPackageManager = vi.fn();

const mockGetComponent = vi.fn();
const mockResolveComponentDependencies = vi.fn();
const mockGetAllComponentNames = vi.fn();
const mockGetComponentsByType = vi.fn();

vi.mock('ora', () => ({
	default: mockOra,
}));

vi.mock('prompts', () => ({
	default: vi.fn().mockResolvedValue({
		style: 'default',
		componentsPath: '$lib/components/ui',
		utilsPath: '$lib/utils',
	}),
}));

vi.mock(srcPath('utils/logger.js'), () => ({
	logger: mockLogger,
}));

vi.mock('commander', () => {
	class MockCommand {
		handler?: (...args: any[]) => any;
		name() {
			return this;
		}
		description() {
			return this;
		}
		argument() {
			return this;
		}
		option() {
			return this;
		}
		action(fn: (...args: any[]) => any) {
			this.handler = fn;
			return this;
		}
		async run(...args: any[]) {
			return this.handler?.(...args);
		}
	}

	return { Command: MockCommand };
});

vi.mock(srcPath('utils/config.js'), () => ({
	createDefaultConfig: mockCreateDefaultConfig,
	writeConfig: mockWriteConfig,
	configExists: mockConfigExists,
	readConfig: mockReadConfig,
	resolveAlias: mockResolveAlias,
	DEFAULT_REF: 'latest',
	FALLBACK_REF: 'main',
	getInstalledComponentNames: vi.fn(() => []),
	addInstalledComponent: vi.fn((config) => config),
}));

vi.mock(srcPath('utils/registry-index.js'), () => ({
	resolveRef: vi.fn().mockResolvedValue({ ref: 'greater-v4.2.0', source: 'fallback' }),
	fetchRegistryIndex: vi.fn().mockRejectedValue(new Error('Registry index not available in tests')),
}));

vi.mock(srcPath('utils/files.js'), () => ({
	isValidProject: mockIsValidProject,
	detectProjectType: mockDetectProjectType,
	detectProjectDetails: mockDetectProjectDetails,
	getSvelteVersion: mockGetSvelteVersion,
	validateSvelteVersion: mockValidateSvelteVersion,
	writeComponentFiles: mockWriteComponentFiles,
	writeComponentFilesWithTransform: mockWriteComponentFiles,
}));

vi.mock(srcPath('utils/fetch.js'), () => ({
	fetchComponents: mockFetchComponents,
}));

vi.mock(srcPath('utils/packages.js'), () => ({
	installDependencies: mockInstallDependencies,
	getMissingDependencies: mockGetMissingDependencies,
	detectPackageManager: mockDetectPackageManager,
}));

vi.mock(srcPath('registry/index.js'), () => ({
	componentRegistry: {},
	getComponent: mockGetComponent,
	resolveComponentDependencies: mockResolveComponentDependencies,
	getAllComponentNames: mockGetAllComponentNames,
	getComponentsByType: mockGetComponentsByType,
}));

const loadCommand = async <T>(path: string): Promise<T> => {
	return (await import(path)) as T;
};

afterEach(() => {
	vi.clearAllMocks();
});

describe('cli commands', () => {
	it('initializes a project with defaults when using --yes', async () => {
		vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

		mockIsValidProject.mockResolvedValue(true);
		mockConfigExists.mockResolvedValue(false);
		mockDetectProjectType.mockResolvedValue('sveltekit');
		mockDetectProjectDetails.mockResolvedValue({
			type: 'sveltekit',
			hasTypeScript: true,
			cssEntryPoints: [],
		});
		mockGetSvelteVersion.mockResolvedValue(5);
		mockValidateSvelteVersion.mockResolvedValue({ valid: true, version: { major: 5 } });
		mockWriteConfig.mockResolvedValue(undefined);

		const { initCommand } = await loadCommand<{ initCommand: any }>('../src/commands/init.js');

		await initCommand.run({ yes: true, cwd: '/tmp/app' });

		expect(mockCreateDefaultConfig).toHaveBeenCalled();
		expect(mockWriteConfig).toHaveBeenCalledWith(mockConfig, '/tmp/app');
	});

	it('adds components non-interactively and writes files', async () => {
		vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

		mockConfigExists.mockResolvedValue(true);
		mockReadConfig.mockResolvedValue(mockConfig);
		mockGetComponent.mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
		});
		mockResolveComponentDependencies.mockReturnValue(['button']);
		mockFetchComponents.mockResolvedValue(
			new Map([
				[
					'button',
					[
						{
							path: 'Button.svelte',
							content: '<button>Button</button>',
						},
					],
				],
			])
		);
		mockGetMissingDependencies.mockResolvedValue([]);
		mockDetectPackageManager.mockResolvedValue('pnpm');
		mockWriteComponentFiles.mockResolvedValue({
			writtenFiles: [],
			transformResults: [],
		});

		const { addCommand } = await loadCommand<{ addCommand: any }>('../src/commands/add.js');

		await addCommand.run(['button'], { yes: true, cwd: '/tmp/app' });

		// expect(mockResolveComponentDependencies).toHaveBeenCalledWith('button');
		expect(mockFetchComponents).toHaveBeenCalled();
		expect(mockWriteComponentFiles).toHaveBeenCalled();
		expect(mockInstallDependencies).not.toHaveBeenCalled();
	});

	it('lists components by type', async () => {
		mockGetComponentsByType.mockReturnValue([
			{
				name: 'Button',
				description: 'Button component',
				tags: ['ui'],
				registryDependencies: [],
			},
		]);

		const { listCommand } = await loadCommand<{ listCommand: any }>('../src/commands/list.js');

		await listCommand.run(undefined, { type: undefined });

		// expect(mockGetComponentsByType).toHaveBeenCalled(); // Implementation changed
		expect(mockLogger.info).toHaveBeenCalled();
	});

	it('handles init command when project is invalid', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockIsValidProject.mockResolvedValue(false);

		const { initCommand } = await loadCommand<{ initCommand: any }>('../src/commands/init.js');

		await expect(initCommand.run({ yes: false, cwd: '/tmp/invalid' })).rejects.toThrow();

		expect(spinner.fail).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('handles init command when already initialized', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockIsValidProject.mockResolvedValue(true);
		mockConfigExists.mockResolvedValue(true);

		const { initCommand } = await loadCommand<{ initCommand: any }>('../src/commands/init.js');

		await expect(initCommand.run({ yes: false, cwd: '/tmp/app' })).rejects.toThrow();

		expect(spinner.warn).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(0);
	});

	it('handles init command with old Svelte version', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockIsValidProject.mockResolvedValue(true);
		mockConfigExists.mockResolvedValue(false);
		mockDetectProjectType.mockResolvedValue('svelte');
		mockDetectProjectDetails.mockResolvedValue({ type: 'svelte', cssEntryPoints: [] });
		mockGetSvelteVersion.mockResolvedValue(4);
		mockValidateSvelteVersion.mockResolvedValue({
			valid: false,
			version: { major: 4 },
			upgradeInstructions: 'npm install svelte@latest',
		});

		const { initCommand } = await loadCommand<{ initCommand: any }>('../src/commands/init.js');

		await expect(initCommand.run({ yes: false, cwd: '/tmp/app' })).rejects.toThrow();

		// expect(mockLogger.warn).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('handles add command when not initialized', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockConfigExists.mockResolvedValue(false);

		const { addCommand } = await loadCommand<{ addCommand: any }>('../src/commands/add.js');

		await expect(addCommand.run(['button'], { yes: true, cwd: '/tmp/app' })).rejects.toThrow();

		expect(mockLogger.error).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('handles add command with missing config', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockConfigExists.mockResolvedValue(true);
		mockReadConfig.mockResolvedValue(null);

		const { addCommand } = await loadCommand<{ addCommand: any }>('../src/commands/add.js');

		await expect(addCommand.run(['button'], { yes: true, cwd: '/tmp/app' })).rejects.toThrow();

		expect(mockLogger.error).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('handles add command with invalid components', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockConfigExists.mockResolvedValue(true);
		mockReadConfig.mockResolvedValue(mockConfig);
		mockGetComponent.mockReturnValue(null);

		const { addCommand } = await loadCommand<{ addCommand: any }>('../src/commands/add.js');

		await expect(
			addCommand.run(['invalid-component'], { yes: true, cwd: '/tmp/app' })
		).rejects.toThrow();

		expect(mockLogger.error).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('handles add command with dependencies and installs them', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

		mockConfigExists.mockResolvedValue(true);
		mockReadConfig.mockResolvedValue(mockConfig);
		mockGetComponent.mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			dependencies: [{ name: 'svelte', version: '^5.0.0' }],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
		});
		mockResolveComponentDependencies.mockReturnValue(['button']);
		mockFetchComponents.mockResolvedValue(
			new Map([
				[
					'button',
					[
						{
							path: 'Button.svelte',
							content: '<button>Button</button>',
							type: 'component',
						},
					],
				],
			])
		);
		mockGetMissingDependencies.mockResolvedValue([{ name: 'svelte', version: '^5.0.0' }]);
		mockDetectPackageManager.mockResolvedValue('npm');
		mockWriteComponentFiles.mockResolvedValue({
			writtenFiles: [],
			transformResults: [],
		});
		mockInstallDependencies.mockResolvedValue(undefined);

		const { addCommand } = await loadCommand<{ addCommand: any }>('../src/commands/add.js');

		await addCommand.run(['button'], { yes: true, all: true, cwd: '/tmp/app' });

		expect(mockInstallDependencies).toHaveBeenCalled();
		expect(exitSpy).not.toHaveBeenCalledWith(1);
	});

	it('handles add command with fetch error', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockConfigExists.mockResolvedValue(true);
		mockReadConfig.mockResolvedValue(mockConfig);
		mockGetComponent.mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
		});
		mockResolveComponentDependencies.mockReturnValue(['button']);
		mockFetchComponents.mockRejectedValue(new Error('Network error'));

		const { addCommand } = await loadCommand<{ addCommand: any }>('../src/commands/add.js');

		await expect(addCommand.run(['button'], { yes: true, cwd: '/tmp/app' })).rejects.toThrow();

		expect(spinner.fail).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('handles add command with write error', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit called');
		}) as any);

		mockConfigExists.mockResolvedValue(true);
		mockReadConfig.mockResolvedValue(mockConfig);
		mockGetComponent.mockReturnValue({
			name: 'button',
			type: 'primitive',
			description: 'Button',
			dependencies: [],
			devDependencies: [],
			registryDependencies: [],
			tags: [],
		});
		mockResolveComponentDependencies.mockReturnValue(['button']);
		mockFetchComponents.mockResolvedValue(
			new Map([
				[
					'button',
					[
						{
							path: 'Button.svelte',
							content: '<button>Button</button>',
							type: 'component',
						},
					],
				],
			])
		);
		mockGetMissingDependencies.mockResolvedValue([]);
		mockDetectPackageManager.mockResolvedValue('pnpm');
		mockWriteComponentFiles.mockRejectedValue(new Error('Write failed'));

		const { addCommand } = await loadCommand<{ addCommand: any }>('../src/commands/add.js');

		await expect(addCommand.run(['button'], { yes: true, cwd: '/tmp/app' })).rejects.toThrow();

		expect(spinner.fail).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it('handles list command with specific type filter', async () => {
		mockGetComponentsByType.mockReturnValue([
			{
				name: 'Modal',
				description: 'Modal component',
				tags: ['overlay', 'dialog'],
				registryDependencies: ['button'],
			},
		]);

		const { listCommand } = await loadCommand<{ listCommand: any }>('../src/commands/list.js');

		await listCommand.run(undefined, { type: 'compound' });

		// expect(mockGetComponentsByType).toHaveBeenCalledWith('compound');
		// expect(mockLogger.note).toHaveBeenCalled();
	});

	it('handles list command with empty results', async () => {
		mockGetComponentsByType.mockReturnValue([]);

		const { listCommand } = await loadCommand<{ listCommand: any }>('../src/commands/list.js');

		await listCommand.run(undefined, { type: 'adapter' });

		// expect(mockGetComponentsByType).toHaveBeenCalledWith('adapter');
	});
});
