import type { PageServerLoad } from './$types';

// Disable SSR for this page as it uses browser-only APIs
export const ssr = false;

export const load: PageServerLoad = async () => {
	return {
		metadata: {
			slug: 'chat',
			title: 'Chat Components',
			description:
				'AI chat interface components for building conversational UIs with streaming responses, tool calls, and configurable settings.',
		},
	};
};
