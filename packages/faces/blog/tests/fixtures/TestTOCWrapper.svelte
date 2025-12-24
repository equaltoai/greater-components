<script lang="ts">
	import TableOfContents from '../../src/components/Article/TableOfContents.svelte';
	import { setContext } from 'svelte';
	import { ARTICLE_CONTEXT_KEY } from '../../src/components/Article/context.js';
	import type {
		ArticleContext,
		ArticleData,
		HeadingData,
		ArticleHandlers,
	} from '../../src/types.js';

	interface Props {
		headings?: HeadingData[];
		activeHeadingId?: string | null;
		handlers?: ArticleHandlers;
		position?: 'left' | 'right';
	}

	let {
		headings = [],
		activeHeadingId = null,
		handlers = {},
		position = undefined,
	}: Props = $props();

	const mockArticle: ArticleData = {
		id: '1',
		slug: 'mock',
		metadata: { title: 'Mock', description: 'Mock', publishedAt: new Date() },
		content: '',
		contentFormat: 'html',
		author: { id: '1', name: 'Mock' },
		isPublished: true,
	};

	// svelte-ignore state_referenced_locally
	const context: ArticleContext = {
		article: mockArticle,
		config: {
			density: 'comfortable',
			showTableOfContents: true,
			showReadingProgress: true,
			showShareBar: true,
			showRelatedPosts: true,
			showAuthor: true,
			showComments: false,
			class: '',
		},
		handlers,
		headings,
		activeHeadingId,
		scrollProgress: 0,
	};

	setContext(ARTICLE_CONTEXT_KEY, context);
</script>

<TableOfContents {position} />
