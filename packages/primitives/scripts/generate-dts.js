/**
 * Generate TypeScript declaration files for Svelte components
 * This creates basic .d.ts files that work with SvelteKit and TypeScript consumers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distComponentsDir = path.join(__dirname, '../dist/components');
const components = [
	'Button',
	'TextField',
	'TextArea',
	'Select',
	'Checkbox',
	'Switch',
	'FileUpload',
	'Modal',
	'Menu',
	'Tooltip',
	'Tabs',
	'Avatar',
	'Skeleton',
	'ThemeSwitcher',
	'ThemeProvider'
];

for (const component of components) {
	const dtsContent = `import { SvelteComponent } from 'svelte';

export default class ${component} extends SvelteComponent<Record<string, any>> {}
`;
	
	const dtsPath = path.join(distComponentsDir, `${component}.d.ts`);
	fs.writeFileSync(dtsPath, dtsContent, 'utf-8');
	console.log(`✓ Generated ${component}.d.ts`);
}

console.log(`\n✅ Generated ${components.length} TypeScript declarations`);

