// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { app } from '../../../examples/facetheory-svelte/src/app.ts';

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

describe('FaceTheory Svelte adapter smoke coverage', () => {
	it('renders the official Greater FaceTheory example through createFaceApp', async () => {
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
		expect(html).toContain(
			'<title>Shipping Greater Components through FaceTheory | Greater Components</title>'
		);
		expect(html).toContain('Shipping Greater Components through FaceTheory');
		expect(html).toContain('Hosted Components');
		expect(html).toContain('Serving host: greater.test');
		expect(html).toContain('Primary 600: #2563eb');
		expect(html).toContain('Spacing 6: 1.5rem');
		expect(html).toContain('Theme: light');
		expect(html).toContain('createSvelteFace()');
		expect(html).toContain('/assets/facetheory/home.js');
		expect(html).toContain('/assets/facetheory/chunks/vendor.js');
		expect(html).toContain('/assets/facetheory/home.css');
		expect(html).toContain('/assets/facetheory/vendor.css');
		expect(html).toContain('/assets/facetheory/greater-mark.svg');
		expect(html).toContain('__FACETHEORY_DATA__');
	});
});
