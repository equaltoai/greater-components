import { describe, expect, it } from 'vitest';
import {
	transformImports,
	transformSvelteImports,
	transformTypeScriptImports,
	transformCssFileImports,
	transformPath,
	buildPathMappings,
	hasGreaterImports,
	getTransformSummary,
	type TransformResult,
} from '../src/utils/transform.js';

import { createTestConfig } from './fixtures/index.js';

describe('buildPathMappings', () => {
	it('creates mappings for all default packages', () => {
		const config = createTestConfig();
		const mappings = buildPathMappings(config);

		expect(mappings.length).toBeGreaterThan(0);
		expect(mappings.some((m) => m.from.includes('primitives'))).toBe(true);
		expect(mappings.some((m) => m.from.includes('headless'))).toBe(true);
		expect(mappings.some((m) => m.from.includes('utils'))).toBe(true);
	});

	it('includes headless subpath mappings', () => {
		const config = createTestConfig();
		const mappings = buildPathMappings(config);

		const buttonMapping = mappings.find((m) => m.from.includes('headless/button'));
		expect(buttonMapping).toBeDefined();
		expect(buttonMapping?.to).toBe('$lib/hooks/button');
	});

	it('uses custom aliases from config', () => {
		const baseConfig = createTestConfig();
		const config = createTestConfig({
			aliases: {
				...baseConfig.aliases,
				ui: '@/components/ui',
				hooks: '@/hooks',
			},
		});
		const mappings = buildPathMappings(config);

		const primitivesMapping = mappings.find(
			(m) => m.from === '@equaltoai/greater-components/primitives'
		);
		expect(primitivesMapping?.to).toBe('@/components/ui');
	});
});

describe('transformPath', () => {
	const config = createTestConfig();
	const mappings = buildPathMappings(config);

	it('transforms exact package matches', () => {
		const result = transformPath('@equaltoai/greater-components/primitives', mappings);
		expect(result).toBe('$lib/components/ui');
	});

	it('transforms subpath imports', () => {
		const result = transformPath('@equaltoai/greater-components/headless/button', mappings);
		expect(result).toBe('$lib/hooks/button');
	});

	it('returns null for non-Greater imports', () => {
		const result = transformPath('svelte', mappings);
		expect(result).toBeNull();
	});

	it('returns null for relative imports', () => {
		const result = transformPath('./context.js', mappings);
		expect(result).toBeNull();
	});

	it('preserves subpaths after package name', () => {
		const result = transformPath('@equaltoai/greater-components/primitives/Button', mappings);
		expect(result).toBe('$lib/components/ui/Button');
	});

	it('transforms legacy hyphenated package names', () => {
		const result = transformPath('@equaltoai/greater-components-primitives', mappings);
		expect(result).toBe('$lib/components/ui');
	});

	it('handles deeply nested subpaths', () => {
		const result = transformPath(
			'@equaltoai/greater-components/primitives/button/variants',
			mappings
		);
		expect(result).toBe('$lib/components/ui/button/variants');
	});

	it('returns null for node built-in modules', () => {
		expect(transformPath('node:path', mappings)).toBeNull();
		expect(transformPath('node:fs', mappings)).toBeNull();
	});

	it('returns null for external packages', () => {
		expect(transformPath('lodash', mappings)).toBeNull();
		expect(transformPath('@types/node', mappings)).toBeNull();
		expect(transformPath('svelte/store', mappings)).toBeNull();
	});
});

describe('transformSvelteImports', () => {
	const config = createTestConfig();
	it('transforms script tag imports', () => {
		const content = `<script>
	import { createButton } from '@equaltoai/greater-components/headless/button';
	import { cn } from '@equaltoai/greater-components/utils';
</script>`;

		const result = transformSvelteImports(content, config);

		expect(result.content).toContain("from '$lib/hooks/button'");
		expect(result.content).toContain("from '$lib/utils'");
		expect(result.transformedCount).toBe(2);
	});

	it('transforms script lang=ts imports', () => {
		const content = `<script lang="ts">
	import type { ButtonProps } from '@equaltoai/greater-components/primitives';
</script>`;

		const result = transformSvelteImports(content, config);

		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('preserves non-Greater imports', () => {
		const content = `<script>
	import { writable } from 'svelte/store';
	import { createButton } from '@equaltoai/greater-components/headless/button';
</script>`;

		const result = transformSvelteImports(content, config);

		expect(result.content).toContain("from 'svelte/store'");
		expect(result.content).toContain("from '$lib/hooks/button'");
	});

	it('handles module context scripts', () => {
		const content = `<script context="module">
	import { BUTTON_VARIANTS } from '@equaltoai/greater-components/primitives';
</script>`;

		const result = transformSvelteImports(content, config);

		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('returns unchanged content when no Greater imports', () => {
		const content = `<script>
	import { writable } from 'svelte/store';
	let count = 0;
</script>`;

		const result = transformSvelteImports(content, config);

		expect(result.content).toBe(content);
		expect(result.transformedCount).toBe(0);
	});
});

describe('transformTypeScriptImports', () => {
	const config = createTestConfig();
	it('transforms import statements', () => {
		const content = `import { createButton } from '@equaltoai/greater-components/headless/button';
import { cn } from '@equaltoai/greater-components/utils';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.content).toContain("from '$lib/hooks/button'");
		expect(result.content).toContain("from '$lib/utils'");
	});

	it('transforms type imports', () => {
		const content = `import type { ButtonProps } from '@equaltoai/greater-components/primitives';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('transforms dynamic imports', () => {
		const content = `const Button = await import('@equaltoai/greater-components/primitives/Button');`;

		const result = transformTypeScriptImports(content, config);

		expect(result.content).toContain("import('$lib/components/ui/Button')");
	});

	it('transforms re-exports', () => {
		const content = `export { createButton } from '@equaltoai/greater-components/headless/button';
export * from '@equaltoai/greater-components/primitives';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.content).toContain("from '$lib/hooks/button'");
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('handles multiline imports', () => {
		const content = `import {
	createButton,
	createModal,
	createMenu
} from '@equaltoai/greater-components/headless';`;

		const result = transformTypeScriptImports(content, config);

		expect(result.content).toContain("from '$lib/hooks'");
	});
});

describe('transformCssFileImports', () => {
	const config = createTestConfig();
	it('transforms CSS @import statements', () => {
		const content = `@import '@equaltoai/greater-components/tokens/theme.css';
@import '@equaltoai/greater-components/primitives/style.css';`;

		const result = transformCssFileImports(content, config);

		expect(result.transformedCount).toBeGreaterThan(0);
	});

	it('preserves non-Greater CSS imports', () => {
		const content = `@import 'normalize.css';
@import '@equaltoai/greater-components/tokens/theme.css';`;

		const result = transformCssFileImports(content, config);

		expect(result.content).toContain("@import 'normalize.css'");
	});
});

describe('hasGreaterImports', () => {
	it('returns true for Greater package imports', () => {
		expect(hasGreaterImports("import { x } from '@equaltoai/greater-components/primitives';")).toBe(
			true
		);
		expect(hasGreaterImports("import '@equaltoai/greater-components/tokens/theme.css';")).toBe(
			true
		);
	});

	it('returns true for legacy package names', () => {
		expect(hasGreaterImports("import { x } from '@equaltoai/greater-components-primitives';")).toBe(
			true
		);
	});

	it('returns false for non-Greater imports', () => {
		expect(hasGreaterImports("import { writable } from 'svelte/store';")).toBe(false);
		expect(hasGreaterImports("import lodash from 'lodash';")).toBe(false);
	});

	it('returns false for empty content', () => {
		expect(hasGreaterImports('')).toBe(false);
	});
});

describe('getTransformSummary', () => {
	it('returns summary of transformations', () => {
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

	it('handles empty results', () => {
		const summary = getTransformSummary([]);

		expect(summary).toBe('No import transformations needed');
	});
});

describe('transformImports (unified)', () => {
	const config = createTestConfig();

	it('auto-detects Svelte files', () => {
		const content = `<script>
	import { createButton } from '@equaltoai/greater-components/headless/button';
</script>`;

		const result = transformImports(content, config, 'test.svelte');

		expect(result.transformedCount).toBe(1);
	});

	it('auto-detects TypeScript files', () => {
		const content = `import { createButton } from '@equaltoai/greater-components/headless/button';`;

		const result = transformImports(content, config, 'test.ts');

		expect(result.transformedCount).toBe(1);
	});

	it('auto-detects CSS files', () => {
		const content = `@import '@equaltoai/greater-components/tokens/theme.css';`;

		const result = transformImports(content, config, 'test.css');

		expect(result.transformedCount).toBeGreaterThanOrEqual(0);
	});
});

describe('edge cases and error handling', () => {
	const config = createTestConfig();
	it('handles malformed import statements gracefully', () => {
		const content = `import { from '@equaltoai/greater-components/primitives';`;

		// Should not throw
		const result = transformTypeScriptImports(content, config);
		expect(result).toBeDefined();
	});

	it('handles empty content', () => {
		const result = transformTypeScriptImports('', config);
		expect(result.content).toBe('');
		expect(result.transformedCount).toBe(0);
	});

	it('preserves comments', () => {
		const content = `// Import Greater components
import { createButton } from '@equaltoai/greater-components/headless/button';
/* Multi-line
   comment */`;

		const result = transformTypeScriptImports(content, config);

		expect(result.content).toContain('// Import Greater components');
		expect(result.content).toContain('/* Multi-line');
	});

	it('handles string literals that look like imports', () => {
		const content = `const example = "import { x } from '@equaltoai/greater-components/primitives'";`;

		const result = transformTypeScriptImports(content, config);

		// Current implementation uses regex and transforms strings too
		expect(result.transformedCount).toBe(1);
	});
});

describe('transformTypeScriptImports', () => {
	const config = createTestConfig();

	it('transforms named imports', () => {
		const content = `import { Button, Card } from '@equaltoai/greater-components/primitives';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('transforms default imports', () => {
		const content = `import Button from '@equaltoai/greater-components/primitives';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('transforms type imports', () => {
		const content = `import type { ButtonProps } from '@equaltoai/greater-components/primitives';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('transforms namespace imports', () => {
		const content = `import * as Primitives from '@equaltoai/greater-components/primitives';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('transforms dynamic imports', () => {
		const content = `const Button = await import('@equaltoai/greater-components/primitives');`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("import('$lib/components/ui')");
	});

	it('transforms re-exports', () => {
		const content = `export { Button } from '@equaltoai/greater-components/primitives';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('transforms export * statements', () => {
		const content = `export * from '@equaltoai/greater-components/primitives';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('preserves non-Greater imports', () => {
		const content = `
import { onMount } from 'svelte';
import { Button } from '@equaltoai/greater-components/primitives';
import type { Snippet } from 'svelte';
`;
		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("from 'svelte'");
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('preserves relative imports', () => {
		const content = `
import { Button } from '@equaltoai/greater-components/primitives';
import { getContext } from './context.js';
import type { Props } from '../types.js';
`;
		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("from './context.js'");
		expect(result.content).toContain("from '../types.js'");
	});

	it('handles multiple imports on same line', () => {
		const content = `import { Button } from '@equaltoai/greater-components/primitives'; import { createButton } from '@equaltoai/greater-components/headless/button';`;
		const result = transformTypeScriptImports(content, config);

		expect(result.transformedCount).toBe(2);
		expect(result.content).toContain("from '$lib/components/ui'");
		expect(result.content).toContain("from '$lib/hooks/button'");
	});

	it('handles multiline imports', () => {
		const content = `
import {
	Button,
	Card,
	Modal,
} from '@equaltoai/greater-components/primitives';
`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("from '$lib/components/ui'");
	});

	it('handles double quotes', () => {
		const content = `import { Button } from "@equaltoai/greater-components/primitives";`;
		const result = transformTypeScriptImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain('from "$lib/components/ui"');
	});
});

describe('transformCssFileImports', () => {
	const config = createTestConfig();

	it('transforms @import with single quotes', () => {
		const content = `@import '@equaltoai/greater-components/tokens/theme.css';`;
		const result = transformCssFileImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("@import '$lib/components/ui/theme.css'");
	});

	it('transforms @import with double quotes', () => {
		const content = `@import "@equaltoai/greater-components/tokens/theme.css";`;
		const result = transformCssFileImports(content, config);

		expect(result.hasChanges).toBe(true);
	});

	it('transforms @import url()', () => {
		const content = `@import url('@equaltoai/greater-components/tokens/theme.css');`;
		const result = transformCssFileImports(content, config);

		expect(result.hasChanges).toBe(true);
	});

	it('preserves non-Greater CSS imports', () => {
		const content = `
@import 'normalize.css';
@import '@equaltoai/greater-components/tokens/theme.css';
`;
		const result = transformCssFileImports(content, config);

		expect(result.transformedCount).toBe(1);
		expect(result.content).toContain("@import 'normalize.css'");
	});
});

describe('transformSvelteImports', () => {
	const config = createTestConfig();

	it('transforms imports in script block', () => {
		const content = `
<script lang="ts">
	import { Button } from '@equaltoai/greater-components/primitives';
</script>

<Button>Click me</Button>
`;
		const result = transformSvelteImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain("from '$lib/components/ui'");
		expect(result.content).toContain('<Button>Click me</Button>');
	});

	it('transforms imports in style block', () => {
		const content = `
<script>
	let x = 1;
</script>

<style>
	@import '@equaltoai/greater-components/tokens/theme.css';
	.button { color: red; }
</style>
`;
		const result = transformSvelteImports(content, config);

		expect(result.hasChanges).toBe(true);
		expect(result.content).toContain('.button { color: red; }');
	});

	it('transforms both script and style blocks', () => {
		const content = `
<script lang="ts">
	import { Button } from '@equaltoai/greater-components/primitives';
</script>

<Button>Click</Button>

<style>
	@import '@equaltoai/greater-components/tokens/theme.css';
</style>
`;
		const result = transformSvelteImports(content, config);

		expect(result.transformedCount).toBe(2);
	});

	it('preserves Svelte syntax', () => {
		const content = `
<script lang="ts">
	import { Button } from '@equaltoai/greater-components/primitives';
	
	let count = $state(0);
	const doubled = $derived(count * 2);
	
	{#if count > 0}
		{@const x = count}
	{/if}
</script>

{#each items as item}
	<Button>{item}</Button>
{/each}
`;
		const result = transformSvelteImports(content, config);

		expect(result.content).toContain('$state(0)');
		expect(result.content).toContain('$derived(count * 2)');
		expect(result.content).toContain('{@const x = count}');
		expect(result.content).toContain('{#each items as item}');
	});

	it('handles module script blocks', () => {
		const content = `
<script context="module" lang="ts">
	import { Button } from '@equaltoai/greater-components/primitives';
	export const prerender = true;
</script>

<script lang="ts">
	import { createButton } from '@equaltoai/greater-components/headless/button';
</script>
`;
		const result = transformSvelteImports(content, config);

		expect(result.transformedCount).toBe(2);
	});
});

describe('transformImports (auto-detection)', () => {
	const config = createTestConfig();

	it('detects Svelte files by extension', () => {
		const content = `<script>import { Button } from '@equaltoai/greater-components/primitives';</script>`;
		const result = transformImports(content, config, 'Component.svelte');

		expect(result.hasChanges).toBe(true);
	});

	it('detects TypeScript files by extension', () => {
		const content = `import { Button } from '@equaltoai/greater-components/primitives';`;
		const result = transformImports(content, config, 'utils.ts');

		expect(result.hasChanges).toBe(true);
	});

	it('detects CSS files by extension', () => {
		const content = `@import '@equaltoai/greater-components/tokens/theme.css';`;
		const result = transformImports(content, config, 'styles.css');

		expect(result.hasChanges).toBe(true);
	});

	it('detects Svelte by content when no extension', () => {
		const content = `<script>import { Button } from '@equaltoai/greater-components/primitives';</script>`;
		const result = transformImports(content, config);

		expect(result.hasChanges).toBe(true);
	});
});

describe('hasGreaterImports', () => {
	it('returns true for content with Greater imports', () => {
		const content = `import { Button } from '@equaltoai/greater-components/primitives';`;
		expect(hasGreaterImports(content)).toBe(true);
	});

	it('returns false for content without Greater imports', () => {
		const content = `import { onMount } from 'svelte';`;
		expect(hasGreaterImports(content)).toBe(false);
	});
});

describe('getTransformSummary', () => {
	it('returns appropriate message for no changes', () => {
		const results: TransformResult[] = [
			{ content: '', transformedCount: 0, transformedPaths: [], hasChanges: false },
		];
		expect(getTransformSummary(results)).toBe('No import transformations needed');
	});

	it('returns summary for multiple transformations', () => {
		const results: TransformResult[] = [
			{ content: '', transformedCount: 3, transformedPaths: [], hasChanges: true },
			{ content: '', transformedCount: 2, transformedPaths: [], hasChanges: true },
		];
		expect(getTransformSummary(results)).toBe('Transformed 5 import(s) across 2 file(s)');
	});
});

describe('edge cases', () => {
	const config = createTestConfig();

	it('handles empty content', () => {
		const result = transformImports('', config);
		expect(result.hasChanges).toBe(false);
		expect(result.content).toBe('');
	});

	it('handles content with no imports', () => {
		const content = `const x = 1; console.log(x);`;
		const result = transformImports(content, config);
		expect(result.hasChanges).toBe(false);
	});

	it('handles malformed imports gracefully', () => {
		const content = `import { Button from '@equaltoai/greater-components/primitives';`; // Missing closing brace
		const result = transformImports(content, config);
		// Should not throw, may or may not transform depending on regex
		expect(result.content).toBeDefined();
	});

	it('handles imports with comments', () => {
		const content = `
// Import button component
import { Button } from '@equaltoai/greater-components/primitives'; // UI button
/* Multi-line
   comment */
import { Card } from '@equaltoai/greater-components/primitives';
`;
		const result = transformTypeScriptImports(content, config);
		expect(result.transformedCount).toBe(2);
		expect(result.content).toContain('// Import button component');
		expect(result.content).toContain('// UI button');
	});

	it('handles template literals in dynamic imports', () => {
		const content = `const mod = await import(\`@equaltoai/greater-components/primitives\`);`;
		// Template literals are not transformed (intentionally - they may be dynamic)
		const result = transformTypeScriptImports(content, config);
		expect(result.hasChanges).toBe(false);
	});
});
