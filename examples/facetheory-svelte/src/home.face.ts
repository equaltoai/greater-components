import { viteAssetsForEntry, viteHydrationForEntry } from '@theory-cloud/facetheory';
import { createSvelteFace, type SvelteUIIntegration } from '@theory-cloud/facetheory/svelte';
import type { ThemeDocumentAttributes } from '@equaltoai/greater-components-primitives';
import { FaceTheoryExampleSSR } from './community-post-ssr.js';
import { createFaceTheoryDemoProps, type FaceTheoryDemoProps } from './demo-data.js';
import {
	FACETHEORY_EXAMPLE_ENTRY,
	facetheoryExampleAssetOptions,
	loadFacetheoryExampleManifest,
} from './vite-manifest.js';

function createThemeDocumentIntegration(
	themeAttributes: ThemeDocumentAttributes
): SvelteUIIntegration {
	return {
		name: 'greater-theme-bootstrap',
		finalize(out) {
			return {
				...out,
				htmlAttrs: {
					...(out.htmlAttrs ?? {}),
					...themeAttributes,
				},
			};
		},
	};
}

export const homeFace = createSvelteFace<FaceTheoryDemoProps>({
	route: '/',
	mode: 'ssr',
	load: async (ctx) => createFaceTheoryDemoProps(ctx),
	render: async (_ctx, data) => ({
		component: FaceTheoryExampleSSR,
		props: data,
	}),
	renderOptions: async (_ctx, data) => {
		const manifest = loadFacetheoryExampleManifest();
		const { headTags } = viteAssetsForEntry(
			manifest,
			FACETHEORY_EXAMPLE_ENTRY,
			facetheoryExampleAssetOptions
		);

		return {
			head: {
				title: `${data.post.title} | Greater Components`,
			},
			headTags,
			integrations: [createThemeDocumentIntegration(data.themeAttributes)],
			hydration: viteHydrationForEntry(
				manifest,
				FACETHEORY_EXAMPLE_ENTRY,
				data,
				facetheoryExampleAssetOptions
			),
		};
	},
});
