import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../packages');

const FORBIDDEN_PATTERNS = [
	{ regex: /Math\.random\(\)/, name: 'Math.random()' },
	{ regex: /crypto\.randomUUID\(\)/, name: 'crypto.randomUUID()' },
];

const EXCLUDED_DIRS = [
	'node_modules',
	'dist',
	'.svelte-kit',
	'coverage',
	'tests',
	'__tests__',
	'.tmp',
];

const EXCLUDED_FILES = [
	// Add specific file exclusions here if needed
];

let hasErrors = false;

function scanDirectory(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (!EXCLUDED_DIRS.includes(entry.name)) {
				scanDirectory(fullPath);
			}
		} else if (entry.isFile() && entry.name.endsWith('.svelte')) {
			if (EXCLUDED_FILES.includes(entry.name)) continue;
			checkFile(fullPath);
		}
	}
}

function checkFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8');
	const relativePath = path.relative(ROOT_DIR, filePath);

	// Skip if file has a specific ignore comment (optional feature)
	if (content.includes('// @validate-ids-ignore')) return;

	for (const pattern of FORBIDDEN_PATTERNS) {
		if (pattern.regex.test(content)) {
			console.error(
				`❌ Error: Found unstable ID generation using ${pattern.name} in ${relativePath}`
			);
			hasErrors = true;
		}
	}
}

console.log('🔍 Scanning packages for unstable ID generation...');
if (fs.existsSync(ROOT_DIR)) {
	scanDirectory(ROOT_DIR);
} else {
	console.error(`❌ Error: Packages directory not found at ${ROOT_DIR}`);
	process.exit(1);
}

if (hasErrors) {
	console.error(
		'\nFAILED: Unstable IDs detected. Please use `useStableId` or `IdProvider` instead.'
	);
	process.exit(1);
} else {
	console.log('✅ No unstable ID generation found.');
	process.exit(0);
}
