import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getCliVersion(fallback = '0.0.0'): string {
	try {
		const filename = fileURLToPath(import.meta.url);
		const dirname = path.dirname(filename);
		const packageJsonPath = path.resolve(dirname, '../../package.json');

		const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		if (typeof pkg?.version === 'string' && pkg.version.trim()) {
			return pkg.version.trim();
		}
	} catch {
		// Ignore and fall back
	}

	return fallback;
}
