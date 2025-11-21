import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');
const srcDir = path.join(__dirname, '../src');

// Ensure dist directory exists
if (!existsSync(distDir)) {
	mkdirSync(distDir, { recursive: true });
}

const themeCssSrc = path.join(srcDir, 'theme.css');
const themeCssDist = path.join(distDir, 'theme.css');
const styleCssDist = path.join(distDir, 'style.css');
const stylesCssDist = path.join(distDir, 'styles.css');

const usageDoc =
	`# Greater Components Primitives – CSS Distribution\n\n` +
	`## Modern Usage (Recommended)\n\n` +
	`import '@equaltoai/greater-components-primitives/theme.css';\n` +
	`// Import this once in your root layout.\n\n` +
	`## Legacy Usage\n\n` +
	`@import '@equaltoai/greater-components-primitives/style.css';\n` +
	`/* Alias for theme.css */\n`;

writeFileSync(path.join(distDir, 'CSS_USAGE.md'), usageDoc, 'utf8');

if (existsSync(themeCssSrc)) {
	// 1. Copy theme.css to dist
	copyFileSync(themeCssSrc, themeCssDist);
	console.log('✅ Copied theme.css to dist/');

	// 2. Create legacy aliases (copies)
	copyFileSync(themeCssSrc, styleCssDist);
	console.log('✅ Created style.css alias');
	
	copyFileSync(themeCssSrc, stylesCssDist);
	console.log('✅ Created styles.css alias');

} else {
	console.error('❌ src/theme.css not found!');
	process.exit(1);
}