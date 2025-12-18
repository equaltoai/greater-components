import { describe, it, expect, vi, beforeEach } from 'vitest';
import { injectIdProvider } from '../src/utils/id-provider-inject.js';
import * as files from '../src/utils/files.js';
import type { ComponentConfig } from '../src/utils/config.js';

// Mock files utility
vi.mock('../src/utils/files.js', () => ({
	readFile: vi.fn(),
	writeFile: vi.fn(),
}));

describe('injectIdProvider', () => {
	const mockConfig: ComponentConfig = {
		$schema: 'schema',
		version: '1.0.0',
		ref: 'latest',
		installMode: 'vendored',
		style: 'default',
		rsc: false,
		tsx: true,
		aliases: {
			components: '$lib/components',
			utils: '$lib/utils',
			ui: '$lib/components/ui',
			lib: '$lib',
			hooks: '$lib/primitives',
			greater: '$lib/greater',
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

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should inject IdProvider into a SvelteKit layout with existing script', async () => {
		const content = `<script>
	import { page } from '$app/stores';
</script>

<slot />`;

		vi.mocked(files.readFile).mockResolvedValue(content);

		const result = await injectIdProvider('src/routes/+layout.svelte', mockConfig);

		expect(result.success).toBe(true);
		expect(result.skipped).toBe(false);

		const writeCall = vi.mocked(files.writeFile).mock.calls[0];
		const writtenContent = writeCall[1] as string;

		expect(writtenContent).toContain("import { IdProvider } from '$lib/greater/utils';");
		expect(writtenContent).toContain('<IdProvider>');
		expect(writtenContent).toContain('<slot />');
		expect(writtenContent).toContain('</IdProvider>');
	});

	it('should inject IdProvider into a file without script', async () => {
		const content = `<h1>Hello</h1><slot />`;

		vi.mocked(files.readFile).mockResolvedValue(content);

		const result = await injectIdProvider('src/routes/+layout.svelte', mockConfig);

		expect(result.success).toBe(true);
		expect(writtenContentContains(files.writeFile, '<script>')).toBe(true);
		expect(
			writtenContentContains(files.writeFile, "import { IdProvider } from '$lib/greater/utils';")
		).toBe(true);
		expect(writtenContentContains(files.writeFile, '<IdProvider>')).toBe(true);
	});

	it('should use package import when not in vendored mode', async () => {
		const content = `<slot />`;
		vi.mocked(files.readFile).mockResolvedValue(content);

		const packageConfig = { ...mockConfig, installMode: 'hybrid' as const };
		await injectIdProvider('src/routes/+layout.svelte', packageConfig);

		expect(
			writtenContentContains(
				files.writeFile,
				"import { IdProvider } from '@equaltoai/greater-components/utils';"
			)
		).toBe(true);
	});

	it('should skip if IdProvider is already used', async () => {
		const content = `<script>
	import { IdProvider } from '$lib/greater/utils';
</script>
<IdProvider>
	<slot />
</IdProvider>`;

		vi.mocked(files.readFile).mockResolvedValue(content);

		const result = await injectIdProvider('src/routes/+layout.svelte', mockConfig);

		expect(result.success).toBe(true);
		expect(result.skipped).toBe(true);
		expect(files.writeFile).not.toHaveBeenCalled();
	});

	it('should handle context="module" scripts', async () => {
		const content = `<script context="module">
	export const load = () => {};
</script>

<slot />`;

		vi.mocked(files.readFile).mockResolvedValue(content);

		await injectIdProvider('src/routes/+layout.svelte', mockConfig);

		const writtenContent = vi.mocked(files.writeFile).mock.calls[0][1] as string;

		// Should preserve module script and add instance script
		expect(writtenContent).toContain('<script context="module">');
		expect(writtenContent).toContain('<script>');
		expect(writtenContent).toContain("import { IdProvider } from '$lib/greater/utils';");
	});
});

function writtenContentContains(mock: any, str: string): boolean {
	const call = mock.mock.calls[0];
	return call && (call[1] as string).includes(str);
}
