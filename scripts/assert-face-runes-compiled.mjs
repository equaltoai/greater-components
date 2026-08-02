import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const facesRoot = path.join(repoRoot, 'packages', 'faces');
const requestedFaces = process.argv.slice(2);
const faceNames =
	requestedFaces.length > 0
		? requestedFaces
		: fs
				.readdirSync(facesRoot, { withFileTypes: true })
				.filter((entry) => entry.isDirectory())
				.map((entry) => entry.name);
const runePattern = /(?<![$\w])\$(?:state|derived|effect|props|bindable|inspect)\b/;
const offenders = [];
let scanned = 0;

function javascriptFiles(directory) {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) return javascriptFiles(absolute);
		return entry.isFile() && entry.name.endsWith('.js') ? [absolute] : [];
	});
}

for (const faceName of faceNames) {
	const distDir = path.join(facesRoot, faceName, 'dist');
	if (!fs.existsSync(distDir)) {
		console.error(`Missing built face output: ${path.relative(repoRoot, distDir)}`);
		process.exit(1);
	}

	for (const file of javascriptFiles(distDir)) {
		scanned++;
		const relative = path.relative(distDir, file).replaceAll(path.sep, '/');
		if (relative.includes('.svelte.')) continue;
		if (runePattern.test(fs.readFileSync(file, 'utf8'))) {
			offenders.push(`${faceName}/${relative}`);
		}
	}
}

if (offenders.length > 0) {
	console.error(
		`Uncompiled Svelte rune found in shipped face module without a .svelte. infix: ${offenders.join(', ')}`
	);
	process.exit(1);
}

console.log(
	`Scanned ${scanned} shipped JavaScript modules across ${faceNames.length} face(s); no uncompiled runes found outside .svelte. modules.`
);
