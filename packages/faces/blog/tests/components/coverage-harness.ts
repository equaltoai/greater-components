// @ts-nocheck
import type { Component } from 'svelte';

// Wrappers
import ArticleTestWrapper from '../fixtures/ArticleTestWrapper.svelte';
import EditorTestWrapper from '../fixtures/EditorTestWrapper.svelte';
import PublicationTestWrapper from '../fixtures/PublicationTestWrapper.svelte';
import AuthorTestWrapper from '../fixtures/AuthorTestWrapper.svelte';
import NavigationTestWrapper from '../fixtures/NavigationTestWrapper.svelte';

// Components to cover
import { Article } from '../../src/components/Article/index.js';
import { Editor } from '../../src/components/Editor/index.js';
import { Publication } from '../../src/components/Publication/index.js';
import { Author } from '../../src/components/Author/index.js';
import { Navigation } from '../../src/components/Navigation/index.js';

// Mocks
import { createMockArticle } from '../mocks/mockArticle.js';
import { createMockAuthor } from '../mocks/mockAuthor.js';
import { createMockPublication } from '../mocks/mockPublication.js';

interface Scenario {
	name: string;
	props: Record<string, unknown>;
	Wrapper?: Component<Record<string, unknown>>;
	wrapperProps?: Record<string, unknown>;
	action?: () => Promise<void>;
}

interface ComponentDefinition {
	component: Component<Record<string, unknown>>;
	scenarios: Scenario[];
}

const mockArticle = createMockArticle('1');
const mockAuthor = createMockAuthor('1');
const mockPublication = createMockPublication('1');

export const componentsToCover: Record<string, ComponentDefinition> = {
	// Article Components
	'Article/Header': {
		component: Article.Header,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
			{
				name: 'no-image',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: {
					article: {
						...mockArticle,
						metadata: { ...mockArticle.metadata, featuredImage: undefined },
					},
				},
			},
		],
	},
	'Article/Content': {
		component: Article.Content,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
			{
				name: 'html-content',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: {
					article: { ...mockArticle, contentFormat: 'html', content: '<h1>Hi</h1><p>Test</p>' },
				},
			},
		],
	},
	'Article/Footer': {
		component: Article.Footer,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
		],
	},
	'Article/ShareBar': {
		component: Article.ShareBar,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
		],
	},
	'Article/ReadingProgress': {
		component: Article.ReadingProgress,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
		],
	},
	'Article/RelatedPosts': {
		component: Article.RelatedPosts,
		scenarios: [
			{
				name: 'default',
				props: { posts: [createMockArticle('2'), createMockArticle('3')] },
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
			{
				name: 'empty',
				props: { posts: [] },
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
		],
	},
	'Article/TableOfContents': {
		component: Article.TableOfContents,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArticleTestWrapper,
				wrapperProps: { article: mockArticle },
			},
		],
	},

	// Author Components
	'Author/Card': {
		component: Author.Card,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: AuthorTestWrapper,
				wrapperProps: { author: mockAuthor },
			},
			{
				name: 'no-avatar',
				props: {},
				Wrapper: AuthorTestWrapper,
				wrapperProps: { author: { ...mockAuthor, avatar: undefined } },
			},
		],
	},

	// Publication Components
	'Publication/Banner': {
		component: Publication.Banner,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: PublicationTestWrapper,
				wrapperProps: { publication: mockPublication },
			},
			{
				name: 'no-logo',
				props: {},
				Wrapper: PublicationTestWrapper,
				wrapperProps: { publication: { ...mockPublication, logo: undefined } },
			},
		],
	},
	'Publication/NewsletterSignup': {
		component: Publication.NewsletterSignup,
		scenarios: [
			{
				name: 'default',
				props: { onSubscribe: async () => {} },
				Wrapper: PublicationTestWrapper,
				wrapperProps: { publication: mockPublication },
			},
		],
	},

	// Navigation Components
	'Navigation/TagCloud': {
		component: Navigation.TagCloud,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: NavigationTestWrapper,
				wrapperProps: {
					tags: [
						{ id: '1', name: 'Tag1', slug: 'tag1', count: 5 },
						{ id: '2', name: 'Tag2', slug: 'tag2', count: 10 },
					],
				},
			},
		],
	},
	'Navigation/ArchiveView': {
		component: Navigation.ArchiveView,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: NavigationTestWrapper,
				wrapperProps: { archives: [{ year: 2024, count: 10, url: '/2024' }] },
			},
		],
	},

	// Editor Components
	'Editor/Toolbar': {
		component: Editor.Toolbar,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: EditorTestWrapper, wrapperProps: {} },
			{ name: 'disabled', props: { disabled: true }, Wrapper: EditorTestWrapper, wrapperProps: {} },
		],
	},
};
