import { render } from 'svelte/server';
import PostRoot from '../../../packages/faces/community/src/components/Post/Root.svelte';
import type { FaceTheoryDemoProps } from './demo-data.js';

type CommunityPostProps = Pick<FaceTheoryDemoProps, 'post'>;

export const CommunityPostSSR = {
	render(props?: CommunityPostProps) {
		return render(PostRoot, {
			props: {
				post: props?.post,
			},
		});
	},
};
