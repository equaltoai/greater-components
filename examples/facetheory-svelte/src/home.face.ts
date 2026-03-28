import type { ViteManifest } from '@theory-cloud/facetheory';
import { viteAssetsForEntry, viteHydrationForEntry } from '@theory-cloud/facetheory';
import { createSvelteFace } from '@theory-cloud/facetheory/svelte';
import { CommunityPostSSR } from './community-post-ssr.js';
import { createFaceTheoryDemoProps, type FaceTheoryDemoProps } from './demo-data.js';

export const FACETHEORY_EXAMPLE_ENTRY = 'src/client/home.ts';

export const facetheoryExampleManifest = {
	[FACETHEORY_EXAMPLE_ENTRY]: {
		file: 'facetheory/home.js',
		src: FACETHEORY_EXAMPLE_ENTRY,
		isEntry: true,
		css: ['facetheory/home.css'],
		imports: ['src/client/vendor.ts'],
		assets: ['facetheory/greater-mark.svg'],
	},
	'src/client/vendor.ts': {
		file: 'facetheory/chunks/vendor.js',
		css: ['facetheory/vendor.css'],
	},
} satisfies ViteManifest;

const assetOptions = {
	base: '/assets/',
	includeAssets: true,
} as const;

export const homeFace = createSvelteFace<FaceTheoryDemoProps>({
	route: '/',
	mode: 'ssr',
	load: async (ctx) => createFaceTheoryDemoProps(ctx),
	render: async (_ctx, data) => ({
		component: CommunityPostSSR,
		props: {
			post: data.post,
		},
	}),
	renderOptions: async (_ctx, data) => {
		const { headTags } = viteAssetsForEntry(
			facetheoryExampleManifest,
			FACETHEORY_EXAMPLE_ENTRY,
			assetOptions
		);

		return {
			head: {
				title: `${data.post.title} | Greater Components`,
			},
			headTags,
			hydration: viteHydrationForEntry(
				facetheoryExampleManifest,
				FACETHEORY_EXAMPLE_ENTRY,
				data,
				assetOptions
			),
		};
	},
});
