import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(packageDir, 'dist', 'components', 'Article');
const runePattern = /\$(?:state|derived|effect|props|bindable|inspect)\b/;

const offenders = fs
	.readdirSync(articleDir)
	.filter(
		(name) => name.startsWith('context') && name.endsWith('.js') && !name.includes('.svelte.')
	)
	.filter((name) => runePattern.test(fs.readFileSync(path.join(articleDir, name), 'utf8')));

if (offenders.length > 0) {
	console.error(
		`Uncompiled Svelte rune found in Article build output without a .svelte. infix: ${offenders.join(', ')}`
	);
	process.exit(1);
}

console.log('Article build output has no uncompiled runes outside .svelte. modules.');
