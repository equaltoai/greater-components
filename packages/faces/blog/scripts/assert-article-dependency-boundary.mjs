import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
