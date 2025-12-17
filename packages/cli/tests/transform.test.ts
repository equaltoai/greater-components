import { describe, expect, it } from 'vitest';
import {
	buildPathMappings,
	getTransformSummary,
	hasGreaterImports,
	transformCssFileImports,
	transformImports,
	transformPath,
	transformSvelteImports,
	transformTypeScriptImports,
	type TransformResult,
} from '../src/utils/transform.js';

import { createTestConfig } from './fixtures/index.js';

describe('buildPathMappings', () => {
	it('includes shared module mappings', () => {
		const config = createTestConfig();
		const mappings = buildPathMappings(config);

		const sharedMapping = mappings.find(
			(m) => m.from === '@equaltoai/greater-components/shared/auth'
		);
		expect(sharedMapping?.to).toBe('$lib/components/auth');

		const legacyMapping = mappings.find((m) => m.from === '@equaltoai/greater-components-auth');
		expect(legacyMapping?.to).toBe('$lib/components/auth');
	});

	it('includes headless primitive subpath mappings', () => {
		const config = createTestConfig();
		const mappings = buildPathMappings(config);

		const buttonMapping = mappings.find(
			(m) => m.from === '@equaltoai/greater-components-headless/button'
		);
		expect(buttonMapping?.to).toBe('$lib/primitives/button');
	});

	it('uses custom aliases for local rewrites', () => {
		const baseConfig = createTestConfig();
		const config = createTestConfig({
			aliases: {
				...baseConfig.aliases,
				components: '@/components',
				lib: '@/lib',
			},
		});
		const mappings = buildPathMappings(config);

		const authMapping = mappings.find(
			(m) => m.from === '@equaltoai/greater-components/shared/auth'
		);
		expect(authMapping?.to).toBe('@/components/auth');

		const buttonMapping = mappings.find(
			(m) => m.from === '@equaltoai/greater-components-headless/button'
		);
		expect(buttonMapping?.to).toBe('@/lib/primitives/button');
	});
});

describe('transformPath', () => {
	const config = createTestConfig();
	const mappings = buildPathMappings(config);

	it('rewrites headless primitives to local paths', () => {
		expect(transformPath('@equaltoai/greater-components-headless/button', mappings)).toBe(
			'$lib/primitives/button'
		);
	});

	it('rewrites shared module imports to local paths', () => {
		expect(transformPath('@equaltoai/greater-components/shared/auth', mappings)).toBe(
			'$lib/components/auth'
		);
		expect(transformPath('@equaltoai/greater-components-auth', mappings)).toBe(
			'$lib/components/auth'
		);
	});

	it('canonicalizes legacy hyphenated packages', () => {
		expect(transformPath('@equaltoai/greater-components-utils', mappings)).toBe(
			'@equaltoai/greater-components/utils'
		);
		expect(transformPath('@equaltoai/greater-components-primitives/Button', mappings)).toBe(
			'@equaltoai/greater-components/primitives/Button'
		);
		expect(
			transformPath('@equaltoai/greater-components-primitives/button/variants', mappings)
		).toBe('@equaltoai/greater-components/primitives/button/variants');
	});

	it('canonicalizes the legacy social face package', () => {
		expect(transformPath('@equaltoai/greater-components-fediverse', mappings)).toBe(
			'@equaltoai/greater-components/faces/social'
		);
		expect(transformPath('@equaltoai/greater-components-fediverse/patterns', mappings)).toBe(
			'@equaltoai/greater-components/faces/social/patterns'
		);
	});

	it('returns null for canonical umbrella imports', () => {
		expect(transformPath('@equaltoai/greater-components/primitives', mappings)).toBeNull();
		expect(transformPath('@equaltoai/greater-components/utils', mappings)).toBeNull();
		expect(transformPath('@equaltoai/greater-components/tokens/theme.css', mappings)).toBeNull();
	});

	it('returns null for non-Greater imports', () => {
		expect(transformPath('svelte', mappings)).toBeNull();
		expect(transformPath('svelte/store', mappings)).toBeNull();
		expect(transformPath('lodash', mappings)).toBeNull();
		expect(transformPath('@types/node', mappings)).toBeNull();
	});

	it('returns null for relative imports', () => {
		expect(transformPath('./context.js', mappings)).toBeNull();
		expect(transformPath('../types.js', mappings)).toBeNull();
	});

	it('returns null for node built-in modules', () => {
		expect(transformPath('node:path', mappings)).toBeNull();
		expect(transformPath('node:fs', mappings)).toBeNull();
	});
});

describe('transformTypeScriptImports', () => {
	const config = createTestConfig();

	it('transforms ES module imports', () => {
		const content = `import { createButton } from '@equaltoai/greater-components-headless/button';
import { cn } from '@equaltoai/greater-components-utils';
import { AuthGate } from '@equaltoai/greater-components-auth';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(3);
		expect(result.content).toContain("from '$lib/primitives/button'");
		expect(result.content).toContain("from '@equaltoai/greater-components/utils'");
		expect(result.content).toContain("from '$lib/components/auth'");
	});

	it('transforms type-only imports', () => {
		const content = `import type { ButtonProps } from '@equaltoai/greater-components-primitives';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("from '@equaltoai/greater-components/primitives'");
	});

	it('transforms dynamic imports', () => {
		const content = `const Button = await import('@equaltoai/greater-components-primitives/Button');`;

		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("import('@equaltoai/greater-components/primitives/Button')");
	});

	it('transforms re-exports', () => {
		const content = `export { createModal } from '@equaltoai/greater-components-headless/modal';
export * from '@equaltoai/greater-components-utils';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(2);
		expect(result.content).toContain("from '$lib/primitives/modal'");
		expect(result.content).toContain("from '@equaltoai/greater-components/utils'");
	});

	it('canonicalizes the headless root package', () => {
		const content = `import { createButton, createModal } from '@equaltoai/greater-components-headless';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("from '@equaltoai/greater-components/headless'");
	});

	it('leaves canonical umbrella imports unchanged', () => {
		const content = `import { cn } from '@equaltoai/greater-components/utils';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(0);
		expect(result.content).toBe(content);
	});
});

describe('transformCssFileImports', () => {
	const config = createTestConfig();

	it('canonicalizes legacy hyphenated CSS imports', () => {
		const content = `@import '@equaltoai/greater-components-tokens/theme.css';
@import '@equaltoai/greater-components-primitives/style.css';`;

		const result = transformCssFileImports(content, config);

		expect(result.transformedCount).toBe(2);
		expect(result.content).toContain("@import '@equaltoai/greater-components/tokens/theme.css'");
		expect(result.content).toContain(
			"@import '@equaltoai/greater-components/primitives/style.css'"
		);
	});

	it('preserves non-Greater CSS imports', () => {
		const content = `@import 'normalize.css';
@import '@equaltoai/greater-components-tokens/theme.css';`;

		const result = transformCssFileImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("@import 'normalize.css'");
	});
});

describe('transformSvelteImports', () => {
	const config = createTestConfig();

	it('transforms imports in <script> blocks', () => {
		const content = `<script lang="ts">
\timport { createButton } from '@equaltoai/greater-components-headless/button';
\timport { cn } from '@equaltoai/greater-components-utils';
</script>`;

		const result = transformSvelteImports(content, config);

		expect(result.transformedCount).toBe(2);
		expect(result.content).toContain("from '$lib/primitives/button'");
		expect(result.content).toContain("from '@equaltoai/greater-components/utils'");
	});

	it('transforms @import statements in <style> blocks', () => {
		const content = `<style>
\t@import '@equaltoai/greater-components-tokens/theme.css';
\t.button { color: red; }
</style>`;

		const result = transformSvelteImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("@import '@equaltoai/greater-components/tokens/theme.css'");
		expect(result.content).toContain('.button { color: red; }');
	});

	it('handles module scripts and instance scripts', () => {
		const content = `
<script context="module" lang="ts">
\timport { AuthGate } from '@equaltoai/greater-components/shared/auth';
</script>

<script lang="ts">
\timport { createModal } from '@equaltoai/greater-components-headless/modal';
</script>
`;

		const result = transformSvelteImports(content, config);

		expect(result.transformedCount).toBe(2);
		expect(result.content).toContain("from '$lib/components/auth'");
		expect(result.content).toContain("from '$lib/primitives/modal'");
	});

	it('returns unchanged content when there are no Greater imports', () => {
		const content = `<script>
\timport { onMount } from 'svelte';
</script>`;

		const result = transformSvelteImports(content, config);

		expect(result.content).toBe(content);
		expect(result.transformedCount).toBe(0);
	});
});

describe('transformImports (auto-detection)', () => {
	const config = createTestConfig();

	it('detects Svelte files by extension', () => {
		const content = `<script>import { createButton } from '@equaltoai/greater-components-headless/button';</script>`;
		const result = transformImports(content, config, 'Component.svelte');

		expect(result.hasChanges).toBe(true);
	});

	it('detects TypeScript files by extension', () => {
		const content = `import { createButton } from '@equaltoai/greater-components-headless/button';`;
		const result = transformImports(content, config, 'utils.ts');

		expect(result.hasChanges).toBe(true);
	});

	it('detects CSS files by extension', () => {
		const content = `@import '@equaltoai/greater-components-tokens/theme.css';`;
		const result = transformImports(content, config, 'styles.css');

		expect(result.hasChanges).toBe(true);
	});

	it('detects Svelte by content when no extension', () => {
		const content = `<script>import { createButton } from '@equaltoai/greater-components-headless/button';</script>`;
		const result = transformImports(content, config);

		expect(result.hasChanges).toBe(true);
	});
});

describe('hasGreaterImports', () => {
	it('returns true for content with Greater imports', () => {
		expect(hasGreaterImports(`import { cn } from '@equaltoai/greater-components/utils';`)).toBe(
			true
		);
		expect(hasGreaterImports(`import { cn } from '@equaltoai/greater-components-utils';`)).toBe(
			true
		);
	});

	it('returns false for content without Greater imports', () => {
		expect(hasGreaterImports(`import { onMount } from 'svelte';`)).toBe(false);
		expect(hasGreaterImports('')).toBe(false);
	});
});

describe('getTransformSummary', () => {
	it('returns appropriate message for no changes', () => {
		const results: TransformResult[] = [
			{ content: '', transformedCount: 0, transformedPaths: [], hasChanges: false },
		];

		expect(getTransformSummary(results)).toBe('No import transformations needed');
	});

	it('summarizes transformations across files', () => {
		const results: TransformResult[] = [
			{
				content: 'content1',
				transformedCount: 2,
				transformedPaths: [
					{ from: 'a', to: 'a1' },
					{ from: 'b', to: 'b1' },
				],
				hasChanges: true,
			},
			{
				content: 'content2',
				transformedCount: 1,
				transformedPaths: [{ from: 'c', to: 'c1' }],
				hasChanges: true,
			},
		];

		const summary = getTransformSummary(results);

		expect(summary).toContain('Transformed 3 import(s)');
		expect(summary).toContain('2 file(s)');
	});
});

describe('edge cases', () => {
	const config = createTestConfig();

	it('handles malformed import statements without throwing', () => {
		const content = `import { from '@equaltoai/greater-components-primitives';`;
		expect(() => transformTypeScriptImports(content, config)).not.toThrow();
	});

	it('handles string literals that look like imports', () => {
		const content = `const example = "import { x } from '@equaltoai/greater-components-utils'";`;

		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain('@equaltoai/greater-components/utils');
	});

	it('does not transform template literal dynamic imports', () => {
		const content = `const mod = await import(\`@equaltoai/greater-components-utils\`);`;
		const result = transformTypeScriptImports(content, config);
		expect(result.hasChanges).toBe(false);
	});
});
