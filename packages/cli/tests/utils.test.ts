import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';
import type { ComponentConfig } from '../src/utils/config.js';
import type { ComponentFile } from '../src/registry/index.js';

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
};

vi.mock('fs-extra', () => ({
	default: fsMock,
	...fsMock,
}));
vi.mock('execa', () => ({
	execa: vi.fn(async () => ({})),
}));
vi.mock('../src/utils/registry-index.js', () => ({
	fetchRegistryIndex: vi.fn(async () => ({
		schemaVersion: '1.0.0',
		version: '1.0.0',
		ref: 'v1.0.0',
		generatedAt: new Date().toISOString(),
		checksums: {},
		components: {},
		faces: {},
		shared: {},
	})),
	resolveRef: vi.fn().mockImplementation(async (explicitRef?: string) => ({
		ref: explicitRef || 'main',
		source: explicitRef ? 'explicit' : 'fallback',
	})),
}));

describe('config utilities', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('reads and writes config, resolving aliases to paths', async () => {
		const { getConfigPath, writeConfig, readConfig, resolveAlias, getComponentPath, configExists } =
			await import('../src/utils/config.js');

		const cwd = '/project';
		const config: ComponentConfig = {
			style: 'default',
			rsc: false,
			tsx: true,
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
				source: 'local',
				localDir: 'styles/greater',
			},
			installed: [],
			$schema: 'https://greater.components.dev/schema.json',
			ref: 'greater-v4.2.0',
			version: '1.0.0',
		};

		expect(await configExists(cwd)).toBe(false);

		await writeConfig(config, cwd);
		expect(fsMock.writeFile).toHaveBeenCalledWith(
			path.join(cwd, 'components.json'),
			JSON.stringify(config, null, 2)
		);

		expect(await configExists(cwd)).toBe(true);
		const parsed = await readConfig(cwd);
		expect(parsed).toEqual(config);

		const aliasPath = resolveAlias('$lib/utils', config as any, cwd);
		expect(aliasPath).toBe(path.join(cwd, 'src/lib/utils'));
		expect(getComponentPath('Button', config as any, cwd)).toContain('Button.svelte');
		expect(getConfigPath(cwd)).toBe(path.join(cwd, 'components.json'));
	});

	it('throws on invalid config JSON', async () => {
		const { readConfig } = await import('../src/utils/config.js');
		const cwd = '/bad';
		const configPath = path.join(cwd, 'components.json');
		fsStore.set(configPath, '{invalid}');
		await expect(readConfig(cwd)).rejects.toThrow(/Failed to read config/);
	});
});

describe('file utilities', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('writes component files and detects project type and svelte version', async () => {
		const { writeComponentFiles, fileExists, detectProjectType, getSvelteVersion, readFile } =
			await import('../src/utils/files.js');

		const pkgPath = '/proj/package.json';
		fsStore.set(
			pkgPath,
			JSON.stringify({
				dependencies: { svelte: '^5.0.1', '@sveltejs/kit': '^2.0.0' },
			})
		);
		fsStore.set('/proj/svelte.config.js', 'export default {}');

		const files: ComponentFile[] = [{ path: 'Foo.svelte', content: '<p/>', type: 'component' }];

		await writeComponentFiles(files, '/proj/src/lib');
		expect(fsMock.ensureDir).toHaveBeenCalled();
		expect(await fileExists(path.join('/proj/src/lib', 'Foo.svelte'))).toBe(true);
		expect(await readFile(path.join('/proj/src/lib', 'Foo.svelte'))).toBe('<p/>');
		expect(await detectProjectType('/proj')).toBe('sveltekit');
		expect(await getSvelteVersion('/proj')).toBe(5);
	});

	it('returns unknown for missing package.json', async () => {
		const { detectProjectType, getSvelteVersion } = await import('../src/utils/files.js');
		expect(await detectProjectType('/missing')).toBe('unknown');
		expect(await getSvelteVersion('/missing')).toBeNull();
	});
});

describe('package utilities', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	it('detects package managers and installs dependencies', async () => {
		const { detectPackageManager, installDependencies } = await import('../src/utils/packages.js');
		const { execa } = await import('execa');

		fsStore.set('/repo/pnpm-lock.yaml', '');
		expect(await detectPackageManager('/repo')).toBe('pnpm');

		fsStore.delete('/repo/pnpm-lock.yaml');
		fsStore.set('/repo/yarn.lock', '');
		expect(await detectPackageManager('/repo')).toBe('yarn');

		fsStore.clear();
		await installDependencies([{ name: 'lodash', version: '1.0.0' }], '/repo', true);
		expect(execa).toHaveBeenCalledWith('npm', ['install', '--save-dev', 'lodash@1.0.0'], {
			cwd: '/repo',
			stdio: 'inherit',
		});

		fsStore.set('/repo/pnpm-lock.yaml', '');
		await installDependencies([{ name: 'chalk', version: '2.0.0' }], '/repo', false);
		expect(execa).toHaveBeenCalledWith('pnpm', ['add', 'chalk@2.0.0'], {
			cwd: '/repo',
			stdio: 'inherit',
		});
	});

	it('computes missing dependencies', async () => {
		const { getMissingDependencies } = await import('../src/utils/packages.js');
		fsStore.set(
			'/repo/package.json',
			JSON.stringify({
				dependencies: { existing: '1.0.0' },
			})
		);

		const missing = await getMissingDependencies(
			[
				{ name: 'existing', version: '1.0.0' },
				{ name: 'new', version: '2.0.0' },
			],
			'/repo'
		);
		expect(missing).toEqual([{ name: 'new', version: '2.0.0' }]);
	});
});

describe('logger utility', () => {
	it('writes to stdout and stderr with trailing newline', async () => {
		const { logger } = await import('../src/utils/logger.js');
		const stdoutSpy = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
		const stderrSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true);

		logger.info('info');
		logger.error('err');
		logger.newline();

		expect(stdoutSpy).toHaveBeenCalledWith('info\n');
		expect(stderrSpy).toHaveBeenCalledWith('err\n');

		stdoutSpy.mockRestore();
		stderrSpy.mockRestore();
	});
});

describe('fetch utilities', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('fetches component files and handles errors', async () => {
		const { fetchComponents } = await import('../src/utils/fetch.js');
		const fetchMock = vi.fn(async () => ({
			ok: true,
			text: async () => 'file content',
			arrayBuffer: async () => Buffer.from('file content'),
		}));
		// @ts-expect-error global override for tests
		global.fetch = fetchMock;

		const registry = {
			button: {
				name: 'button',
				type: 'primitive',
				description: '',
				files: [{ path: 'lib/primitives/button.ts', type: 'component', content: '' }],
				dependencies: [],
				devDependencies: [],
				registryDependencies: [],
				tags: [],
				version: '1.0.0',
			},
		};

		const result = await fetchComponents(['button'], registry as any);
		expect(result.get('button')?.[0]?.content).toBe('file content');
		expect(fetchMock).toHaveBeenCalled();

		await expect(fetchComponents(['missing'], registry as any)).rejects.toThrow(
			'Component "missing" not found in registry'
		);
	});
});

describe('registry utilities', () => {
	it('looks up components and resolves dependencies recursively', async () => {
		const {
			componentRegistry,
			getComponent,
			getComponentsByType,
			getComponentsByTag,
			searchComponents,
			resolveComponentDependencies,
		} = await import('../src/registry/index.js');

		componentRegistry['custom'] = {
			name: 'custom',
			type: 'pattern',
			description: 'Custom component',
			files: [],
			dependencies: [],
			devDependencies: [],
			registryDependencies: ['button'],
			tags: ['custom'],
			version: '1.0.0',
		};

		expect(getComponent('button')?.name).toBe('button');
		expect(getComponent('unknown')).toBeNull();
		expect(getComponentsByType('pattern').some((c) => c.name === 'custom')).toBe(true);
		expect(getComponentsByTag('custom')[0]?.name).toBe('custom');
		expect(searchComponents('button')[0]?.name).toBe('button');
		expect(resolveComponentDependencies('custom')).toEqual(
			expect.arrayContaining(['custom', 'button'])
		);
	});
});
