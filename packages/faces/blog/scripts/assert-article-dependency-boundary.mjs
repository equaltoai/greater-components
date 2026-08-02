import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(packageDir, '../../..');
const umbrellaDir = path.join(repoRoot, 'packages', 'greater-components');
if (!process.argv.includes('--umbrella')) {
	const articleDir = path.join(packageDir, 'dist', 'components', 'Article');
	const editorRoot = path.join(packageDir, 'dist', 'components', 'Editor', 'Root.js');
	const articleModules = fs
		.readdirSync(articleDir)
		.filter((name) => name.endsWith('.js'))
		.map((name) => ({ name, content: fs.readFileSync(path.join(articleDir, name), 'utf8') }));
	const articleGraph = articleModules.map(({ content }) => content).join('\n');
	const forbiddenReadingDependencies = [
		'remark',
		'remark-parse',
		'shiki',
		'mdast',
		'html-to-markdown',
	];

	if (!articleGraph.includes('"@equaltoai/greater-components-utils/sanitizeHtml"')) {
		console.error('Article reading output does not import the sanctioned sanitizeHtml subpath.');
		process.exit(1);
	}

	if (!articleGraph.includes('"@equaltoai/greater-components-utils/relativeTime"')) {
		console.error('Article reading output does not import the sanctioned relativeTime subpath.');
		process.exit(1);
	}

	if (/from "@equaltoai\/greater-components-utils"/.test(articleGraph)) {
		console.error('Article reading output still resolves the utils barrel.');
		process.exit(1);
	}

	const leaked = forbiddenReadingDependencies.filter((dependency) =>
		articleGraph.includes(dependency)
	);
	if (leaked.length > 0) {
		console.error(`Article reading output resolves editor-only dependencies: ${leaked.join(', ')}`);
		process.exit(1);
	}

	const editorGraph = fs.readFileSync(editorRoot, 'utf8');
	if (!editorGraph.includes('"@equaltoai/greater-components-content"')) {
		console.error('Editor output no longer retains its content dependency.');
		process.exit(1);
	}

	console.log(
		`Article dependency boundary holds across ${articleModules.length} reading modules: no remark/shiki/mdast graph; editor content dependency retained.`
	);
}

if (process.argv.includes('--umbrella')) {
	const cliTransformPath = path.join(repoRoot, 'packages', 'cli', 'dist', 'utils', 'transform.js');
	const { transformImports } = await import(pathToFileURL(cliTransformPath).href);
	const transformed = transformImports(
		[
			'<script>',
			"import { sanitizeHtml } from '@equaltoai/greater-components-utils/sanitizeHtml';",
			"import { formatDateTime } from '@equaltoai/greater-components-utils/relativeTime';",
			'</script>',
		].join('\n'),
		{
			installMode: 'hybrid',
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				hooks: '$lib/primitives',
				lib: '$lib',
				greater: '$lib/greater',
			},
		},
		'lib/components/Article/Content.svelte'
	);
	const postTransformSpecifiers = Array.from(
		transformed.content.matchAll(/from ['"]([^'"]+)['"]/g),
		(match) => match[1]
	);
	const expectedSpecifiers = [
		'@equaltoai/greater-components/utils/sanitizeHtml',
		'@equaltoai/greater-components/utils/relativeTime',
	];
	if (JSON.stringify(postTransformSpecifiers) !== JSON.stringify(expectedSpecifiers)) {
		console.error(
			`Unexpected post-transform utility specifiers: ${postTransformSpecifiers.join(', ')}`
		);
		process.exit(1);
	}

	const resolutionProbe = String.raw`
		const expected = [
			['@equaltoai/greater-components/utils/sanitizeHtml', ['sanitizeHtml', 'sanitizeForPreview']],
			['@equaltoai/greater-components/utils/relativeTime', ['relativeTime', 'formatDateTime']],
		];

		for (const [specifier, names] of expected) {
			const resolved = import.meta.resolve(specifier);
			const module = await import(specifier);
			const missing = names.filter((name) => typeof module[name] !== 'function');
			if (missing.length > 0) {
				throw new Error(specifier + ' is missing function export(s): ' + missing.join(', '));
			}
			console.log('Resolved ' + specifier + ' -> ' + resolved + '; functions=' + names.join(','));
		}
	`;
	const result = spawnSync(process.execPath, ['--input-type=module', '--eval', resolutionProbe], {
		cwd: umbrellaDir,
		encoding: 'utf8',
	});

	if (result.stdout) process.stdout.write(result.stdout);
	if (result.stderr) process.stderr.write(result.stderr);
	if (result.status !== 0) {
		console.error('Post-transform utility specifiers do not resolve through the umbrella exports.');
		process.exit(result.status ?? 1);
	}
}
