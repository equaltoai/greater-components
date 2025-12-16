/**
 * Test Fixtures and Mock Factories
 * Provides consistent test data and mock utilities for CLI testing
 */

import type { ComponentConfig, InstalledComponent } from '../../src/utils/config.js';
import type { ComponentMetadata, ComponentFile } from '../../src/registry/index.js';
import type { FaceManifest } from '../../src/registry/index.js';

// ============================================================================
// CONFIG FIXTURES
// ============================================================================

export const DEFAULT_TEST_CONFIG: ComponentConfig = {
	$schema: 'https://greater.components.dev/schema.json',
	version: '1.0.0',
	ref: 'greater-v4.2.0',
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
};

export function createTestConfig(overrides?: Partial<ComponentConfig>): ComponentConfig {
	return {
		...DEFAULT_TEST_CONFIG,
		...overrides,
		aliases: {
			...DEFAULT_TEST_CONFIG.aliases,
			...(overrides?.aliases || {}),
		},
		css: {
			...DEFAULT_TEST_CONFIG.css,
			...(overrides?.css || {}),
		},
	};
}

export function createInstalledComponent(
	name: string,
	overrides?: Partial<InstalledComponent>
): InstalledComponent {
	return {
		name,
		version: 'greater-v4.2.0',
		installedAt: new Date().toISOString(),
		modified: false,
		checksums: [],
		...overrides,
	};
}

// ============================================================================
// COMPONENT FIXTURES
// ============================================================================

export function createTestComponentMetadata(
	name: string,
	overrides?: Partial<ComponentMetadata>
): ComponentMetadata {
	return {
		name,
		type: 'primitive',
		description: `Test ${name} component`,
		files: [
			{
				path: `lib/primitives/${name}.ts`,
				content: `// ${name} component`,
				type: 'component',
			},
		],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['test', name],
		version: '1.0.0',
		...overrides,
	};
}

export function createTestComponentFile(
	path: string,
	content: string,
	type: ComponentFile['type'] = 'component'
): ComponentFile {
	return { path, content, type };
}

export const MOCK_BUTTON_COMPONENT: ComponentMetadata = createTestComponentMetadata('button', {
	description: 'Headless button primitive with keyboard navigation and ARIA support',
	files: [
		{
			path: 'lib/primitives/button.ts',
			content: `export function createButton() { return { pressed: false }; }`,
			type: 'component',
		},
	],
	tags: ['headless', 'primitive', 'button', 'accessibility'],
});

export const MOCK_MODAL_COMPONENT: ComponentMetadata = createTestComponentMetadata('modal', {
	description: 'Headless modal primitive with focus trap',
	registryDependencies: ['button'],
	files: [
		{
			path: 'lib/primitives/modal.ts',
			content: `export function createModal() { return { open: false }; }`,
			type: 'component',
		},
	],
});

export const MOCK_TIMELINE_COMPONENT: ComponentMetadata = createTestComponentMetadata('timeline', {
	type: 'compound',
	description: 'ActivityPub timeline with virtual scrolling',
	registryDependencies: ['button', 'modal'],
	files: [
		{
			path: 'lib/components/Timeline/Root.svelte',
			content: `<script>export let items = [];</script>`,
			type: 'component',
		},
		{
			path: 'lib/components/Timeline/Item.svelte',
			content: `<script>export let item;</script>`,
			type: 'component',
		},
	],
});

// ============================================================================
// FACE FIXTURES
// ============================================================================

export const MOCK_SOCIAL_FACE: FaceManifest = {
	name: 'social',
	type: 'face',
	description: 'Twitter/Mastodon-style social media UI',
	files: [],
	dependencies: [],
	devDependencies: [],
	registryDependencies: [],
	tags: ['face', 'social', 'activitypub'],
	version: '1.0.0',
	domain: 'social',
	includes: {
		primitives: ['button', 'modal', 'menu'],
		shared: ['auth', 'compose'],
		patterns: ['thread-view'],
		components: ['timeline', 'post-card'],
	},
	styles: {
		main: 'faces/social/style.css',
		tokens: 'tokens/theme.css',
	},
	recommendedShared: ['notifications'],
};

// ============================================================================
// PROJECT STRUCTURE FIXTURES
// ============================================================================

export interface MockProjectStructure {
	type: 'sveltekit' | 'vite-svelte' | 'svelte' | 'bare';
	files: Record<string, string>;
}

export const SVELTEKIT_PROJECT: MockProjectStructure = {
	type: 'sveltekit',
	files: {
		'package.json': JSON.stringify({
			name: 'test-sveltekit-project',
			dependencies: {
				svelte: '^5.0.0',
				'@sveltejs/kit': '^2.0.0',
			},
		}),
		'svelte.config.js': `export default { kit: { alias: { '$lib': 'src/lib' } } };`,
		'vite.config.ts': `import { sveltekit } from '@sveltejs/kit/vite'; export default { plugins: [sveltekit()] };`,
		'src/app.css': `/* App styles */`,
		'src/routes/+layout.svelte': `<script>import '../app.css';</script><slot />`,
	},
};

export const VITE_SVELTE_PROJECT: MockProjectStructure = {
	type: 'vite-svelte',
	files: {
		'package.json': JSON.stringify({
			name: 'test-vite-project',
			dependencies: {
				svelte: '^5.0.0',
			},
			devDependencies: {
				vite: '^5.0.0',
				'@sveltejs/vite-plugin-svelte': '^3.0.0',
			},
		}),
		'vite.config.ts': `import { svelte } from '@sveltejs/vite-plugin-svelte'; export default { plugins: [svelte()] };`,
		'src/main.ts': `import App from './App.svelte';`,
		'src/app.css': `/* App styles */`,
	},
};

export const BARE_PROJECT: MockProjectStructure = {
	type: 'bare',
	files: {
		'package.json': JSON.stringify({
			name: 'test-bare-project',
			dependencies: {},
		}),
	},
};

// ============================================================================
// REGISTRY INDEX FIXTURES
// ============================================================================

export const MOCK_REGISTRY_INDEX = {
	version: '1.0.0',
	ref: 'greater-v4.2.0',
	components: {
		button: {
			name: 'button',
			type: 'primitive',
			checksum: 'sha256-abc123',
		},
		modal: {
			name: 'modal',
			type: 'primitive',
			checksum: 'sha256-def456',
		},
		timeline: {
			name: 'timeline',
			type: 'compound',
			checksum: 'sha256-ghi789',
		},
	},
	faces: {
		social: {
			name: 'social',
			checksum: 'sha256-jkl012',
		},
	},
};

// ============================================================================
// DIFF FIXTURES
// ============================================================================

export const DIFF_TEST_CASES = {
	identical: {
		local: 'line1\nline2\nline3',
		remote: 'line1\nline2\nline3',
	},
	additions: {
		local: 'line1\nline2',
		remote: 'line1\nline2\nline3\nline4',
	},
	deletions: {
		local: 'line1\nline2\nline3\nline4',
		remote: 'line1\nline2',
	},
	modifications: {
		local: 'line1\noriginal\nline3',
		remote: 'line1\nmodified\nline3',
	},
	complex: {
		local: 'header\nold1\nold2\nmiddle\nold3\nfooter',
		remote: 'header\nnew1\nmiddle\nnew2\nnew3\nfooter',
	},
};

// ============================================================================
// CHECKSUM FIXTURES
// ============================================================================

export const CHECKSUM_TEST_CASES = {
	simple: {
		content: 'test content',
		expectedPrefix: 'sha256-',
	},
	empty: {
		content: '',
		expectedPrefix: 'sha256-',
	},
	unicode: {
		content: '日本語テスト 🎉',
		expectedPrefix: 'sha256-',
	},
	binary: {
		content: Buffer.from([0x00, 0x01, 0x02, 0xff]),
		expectedPrefix: 'sha256-',
	},
};

// ============================================================================
// MOCK FS HELPER
// ============================================================================

export class MockFileSystem {
	private store = new Map<string, string>();

	set(path: string, content: string): void {
		this.store.set(path, content);
	}

	get(path: string): string | undefined {
		return this.store.get(path);
	}

	has(path: string): boolean {
		return this.store.has(path);
	}

	delete(path: string): boolean {
		return this.store.delete(path);
	}

	clear(): void {
		this.store.clear();
	}

	setupProject(project: MockProjectStructure): void {
		this.clear();
		for (const [filePath, content] of Object.entries(project.files)) {
			this.set('/' + filePath, content);
		}
	}

	createFsMock() {
		return {
			pathExists: async (p: string) => this.has(p),
			readFile: async (p: string) => {
				const content = this.get(p);
				if (content === undefined) throw new Error(`ENOENT: ${p}`);
				return content;
			},
			writeFile: async (p: string, content: string) => {
				this.set(p, content);
			},
			ensureDir: async () => {},
			remove: async (p: string) => {
				this.delete(p);
			},
			readdir: async (dir: string) => {
				const entries: string[] = [];
				for (const path of this.store.keys()) {
					if (path.startsWith(dir + '/')) {
						const relative = path.slice(dir.length + 1);
						const parts = relative.split('/');
						const firstPart = parts[0];
						if (firstPart && !entries.includes(firstPart)) {
							entries.push(firstPart);
						}
					}
				}
				return entries;
			},
		};
	}
}

export const mockFs = new MockFileSystem();
