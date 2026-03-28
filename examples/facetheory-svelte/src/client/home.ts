import { hydrate } from 'svelte';
import PostRoot from '../../../../packages/faces/community/src/components/Post/Root.svelte';
import type { FaceTheoryDemoProps } from '../demo-data.js';

function readHydrationData(): FaceTheoryDemoProps {
	const payload = document.getElementById('__FACETHEORY_DATA__');

	if (!payload?.textContent) {
		throw new Error('FaceTheory hydration payload is missing');
	}

	return JSON.parse(payload.textContent) as FaceTheoryDemoProps;
}

const hydrationData = readHydrationData();

hydrate(PostRoot, {
	target: document.body,
	props: {
		post: hydrationData.post,
	},
});
