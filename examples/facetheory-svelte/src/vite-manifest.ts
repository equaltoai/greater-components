import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ViteManifest } from '@theory-cloud/facetheory';

export const FACETHEORY_EXAMPLE_ENTRY = 'src/client/home.ts';

const srcDir = dirname(fileURLToPath(import.meta.url));
const exampleRootDir = resolve(srcDir, '..');

export const facetheoryExampleAssetOptions = {
	base: '/assets/',
	includeAssets: true,
} as const;

export const FACETHEORY_EXAMPLE_DIST_DIR = resolve(exampleRootDir, 'dist/client');
export const FACETHEORY_EXAMPLE_MANIFEST_PATH = resolve(
	FACETHEORY_EXAMPLE_DIST_DIR,
	'.vite/manifest.json'
);

let manifestCache: ViteManifest | null = null;

export function loadFacetheoryExampleManifest(): ViteManifest {
	if (manifestCache) {
		return manifestCache;
	}

	if (!existsSync(FACETHEORY_EXAMPLE_MANIFEST_PATH)) {
		throw new Error(
			`FaceTheory example manifest not found at ${FACETHEORY_EXAMPLE_MANIFEST_PATH}. Run \`pnpm build:facetheory-example\` or \`pnpm test:facetheory\` first.`
		);
	}

	manifestCache = JSON.parse(
		readFileSync(FACETHEORY_EXAMPLE_MANIFEST_PATH, 'utf8')
	) as ViteManifest;
	return manifestCache;
}

export function resolveFacetheoryExampleBuildArtifact(file: string): string {
	return resolve(FACETHEORY_EXAMPLE_DIST_DIR, file);
}
