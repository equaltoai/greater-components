import { hydrate } from 'svelte';
import { Post } from '@equaltoai/greater-components-community';
import { preferencesStore } from '@equaltoai/greater-components-primitives';
import type { FaceTheoryDemoProps } from '../demo-data.js';
import './home.css';

const CommunityPostRoot = Post.Root;

function readHydrationData(): FaceTheoryDemoProps {
	const payload = document.getElementById('__FACETHEORY_DATA__');

	if (!payload?.textContent) {
		throw new Error('FaceTheory hydration payload is missing');
	}

	return JSON.parse(payload.textContent) as FaceTheoryDemoProps;
}

const hydrationData = readHydrationData();
const target = document.getElementById('facetheory-post-root');

if (!target) {
	throw new Error('FaceTheory post hydration root is missing');
}

preferencesStore.hydrate(hydrationData.themeSnapshot);

hydrate(CommunityPostRoot, {
	target,
	props: {
		post: hydrationData.post,
	},
});
