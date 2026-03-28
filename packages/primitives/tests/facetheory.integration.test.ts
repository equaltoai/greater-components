// @vitest-environment node

import { existsSync } from 'node:fs';
import { viteAssetsForEntry } from '@theory-cloud/facetheory';
import { describe, expect, it } from 'vitest';
import { app } from '../../../examples/facetheory-svelte/src/app.ts';
import { homeFace } from '../../../examples/facetheory-svelte/src/home.face.ts';
import {
	FACETHEORY_EXAMPLE_ENTRY,
	facetheoryExampleAssetOptions,
	loadFacetheoryExampleManifest,
	resolveFacetheoryExampleBuildArtifact,
} from '../../../examples/facetheory-svelte/src/vite-manifest.ts';

async function decodeFaceBody(body: Uint8Array | AsyncIterable<Uint8Array>): Promise<string> {
	const decoder = new TextDecoder();

	if (body instanceof Uint8Array) {
		return decoder.decode(body);
	}

	const chunks: Uint8Array[] = [];

	for await (const chunk of body) {
		chunks.push(chunk);
	}

	const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
	const merged = new Uint8Array(totalLength);
	let offset = 0;

	for (const chunk of chunks) {
		merged.set(chunk, offset);
		offset += chunk.byteLength;
	}

	return decoder.decode(merged);
}

function collectManifestArtifacts(
	manifest: ReturnType<typeof loadFacetheoryExampleManifest>,
	entry: string
): string[] {
	const visited = new Set<string>();
	const files = new Set<string>();

	function visit(chunkKey: string) {
		if (visited.has(chunkKey)) {
			return;
		}

		visited.add(chunkKey);
		const chunk = manifest[chunkKey];

		if (!chunk) {
			return;
		}

		files.add(chunk.file);
		chunk.css?.forEach((file) => files.add(file));
		chunk.assets?.forEach((file) => files.add(file));
		chunk.imports?.forEach((importKey) => visit(importKey));
	}

	visit(entry);
	return [...files];
}

describe('FaceTheory Svelte adapter smoke coverage', () => {
	it('renders the route module directly with the built manifest', async () => {
		const ctx = {
			request: {
				method: 'GET',
				path: '/',
				query: {},
				headers: {
					host: ['greater.test'],
				},
				cookies: {},
				body: new Uint8Array(),
				isBase64: false,
				cspNonce: null,
			},
			params: {},
			proxy: null,
		} as const;
		const data = await homeFace.load?.(ctx);
		const rendered = await homeFace.render(ctx, data);

		expect(rendered.html).toBeTruthy();
		expect(rendered.htmlAttrs).toMatchObject({
			'data-theme': 'light',
		});
	});

	it('renders the official Greater FaceTheory example through createFaceApp', async () => {
		const manifest = loadFacetheoryExampleManifest();
		const { headTags, bootstrapModule } = viteAssetsForEntry(
			manifest,
			FACETHEORY_EXAMPLE_ENTRY,
			facetheoryExampleAssetOptions
		);
		const emittedUrls = new Set<string>([bootstrapModule]);

		headTags.forEach((tag) => {
			if (tag.type === 'link' && typeof tag.attrs.href === 'string') {
				emittedUrls.add(tag.attrs.href);
			}
		});

		const response = await app.handle({
			method: 'GET',
			path: '/',
			headers: {
				host: ['greater.test'],
			},
		});
		const html = await decodeFaceBody(response.body);

		expect(response.status).toBe(200);
		expect(response.headers['content-type']).toEqual(['text/html; charset=utf-8']);
		expect(response.headers['x-request-id']?.[0]).toBeTruthy();
		expect(html).toContain('<!doctype html>');
		expect(html).toContain('lang="en"');
		expect(html).toContain('data-theme="light"');
		expect(html).toContain('data-density="comfortable"');
		expect(html).toContain(
			'<title>Shipping Greater Components through FaceTheory | Greater Components</title>'
		);
		expect(html).toContain('Greater Components through public package surfaces');
		expect(html).toContain('Shipping Greater Components through FaceTheory');
		expect(html).toContain('Hosted Components');
		expect(html).toContain('Serving host: greater.test');
		expect(html).toContain('Primary 600: #2563eb');
		expect(html).toContain('Spacing 6: 1.5rem');
		expect(html).toContain('Theme: light');
		expect(html).toContain('createSvelteFace()');
		expect(html).toContain('"themeSnapshot"');
		expect(html).toContain('__FACETHEORY_DATA__');

		emittedUrls.forEach((url) => {
			expect(html).toContain(url);
		});

		collectManifestArtifacts(manifest, FACETHEORY_EXAMPLE_ENTRY).forEach((file) => {
			expect(existsSync(resolveFacetheoryExampleBuildArtifact(file))).toBe(true);
		});
	});
});
