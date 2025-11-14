import {
	readdirSync,
	readFileSync,
	writeFileSync,
	existsSync,
	symlinkSync,
	copyFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

if (!existsSync(distDir)) {
	throw new Error('Cannot bundle CSS before the package is built. Run "svelte-package" first.');
}

const usageDoc =
	`# Greater Components Primitives – CSS Distribution\n\n` +
	`Components embed their styles when compiled with Svelte 5 runes. ` +
	`For playgrounds, Storybook instances, or static HTML demos we also emit a ` +
	`style.css bundle derived from every compiled component stylesheet.\n\n` +
	`## Recommended\n\n` +
	`import { Button } from '@equaltoai/greater-components-primitives';\n` +
	`// No CSS import required when you compile the source\n\n` +
	`## External / Legacy\n\n` +
	`@import '@equaltoai/greater-components-primitives/style.css';\n` +
	`/* Ships with the npm package for quick demos */\n`;

writeFileSync(path.join(distDir, 'CSS_USAGE.md'), usageDoc, 'utf8');

function collectCssFiles(dir) {
	const entries = readdirSync(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...collectCssFiles(fullPath));
		} else if (
			entry.isFile() &&
			entry.name.endsWith('.css') &&
			entry.name !== 'style.css' &&
			entry.name !== 'styles.css'
		) {
			files.push(fullPath);
		}
	}
	return files;
}

const cssFiles = collectCssFiles(distDir);
const styleCssPath = path.join(distDir, 'style.css');
const stylesCssPath = path.join(distDir, 'styles.css');

let emittedCss = false;

if (cssFiles.length === 0) {
	const placeholder = `/*\n  Greater Components primitives inline their styles inside each compiled component module.\n  This placeholder ensures the style import remains available for demo apps and tooling.\n*/\n`;
	writeFileSync(styleCssPath, placeholder, 'utf8');
	emittedCss = true;
	console.log('ℹ️ No standalone component CSS detected; emitted placeholder style.css');
} else {
	const bundle = cssFiles
		.map((file) => {
			const relative = path.relative(distDir, file).replace(/\\/g, '/');
			return `/* ${relative} */\n${readFileSync(file, 'utf8')}`;
		})
		.join('\n\n');

	writeFileSync(styleCssPath, bundle, 'utf8');
	emittedCss = true;
	console.log(`✅ Bundled ${cssFiles.length} component styles into style.css`);
}

if (emittedCss && !existsSync(stylesCssPath)) {
	try {
		symlinkSync('style.css', stylesCssPath, 'file');
		console.log('✅ Created styles.css symlink for compatibility');
	} catch {
		copyFileSync(styleCssPath, stylesCssPath);
		console.log('✅ Created styles.css copy for compatibility');
	}
}
