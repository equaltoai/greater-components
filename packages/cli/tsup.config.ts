import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	minify: false,
	target: 'node18',
	platform: 'node',
	shims: true,
	banner: {
		js: '#!/usr/bin/env node',
	},
});

