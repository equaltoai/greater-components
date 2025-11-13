import { Index } from 'flexsearch';

export interface SearchDocument {
	id: string;
	title: string;
	content: string;
	href: string;
	category: string;
	section: string;
	type: 'component' | 'guide' | 'token' | 'api';
	status?: 'alpha' | 'beta' | 'stable' | 'deprecated';
}

class SearchIndex {
	private index: Index<false, false, true>;
	private documents: Map<string, SearchDocument>;
	
	constructor() {
		this.index = new Index({
			preset: 'match',
			tokenize: 'forward',
			cache: true
		});
		this.documents = new Map();
	}
	
	addDocument(doc: SearchDocument) {
		this.documents.set(doc.id, doc);
		this.index.add(doc.id, `${doc.title} ${doc.content}`);
	}
	
	search(query: string, limit = 10): SearchDocument[] {
		const results = this.index.search(query, { limit });
		return results
			.map((id) => this.documents.get(String(id)))
			.filter((doc: SearchDocument | undefined): doc is SearchDocument => Boolean(doc));
	}
	
	clear() {
		this.index.clear();
		this.documents.clear();
	}
}

// Create and populate the search index
export const searchIndex = new SearchIndex();

// Populate with initial data
const initialDocuments: SearchDocument[] = [
	// Components
	{
		id: 'button',
		title: 'Button',
		content: 'Button component with multiple variants and states',
		href: '/components/button',
		category: 'Components',
		section: 'Core',
		type: 'component',
		status: 'stable'
	},
	{
		id: 'textfield',
		title: 'TextField',
		content: 'Text input field with validation and error states',
		href: '/components/textfield',
		category: 'Components',
		section: 'Core',
		type: 'component',
		status: 'stable'
	},
	{
		id: 'modal',
		title: 'Modal',
		content: 'Modal dialog for overlays and popups',
		href: '/components/modal',
		category: 'Components',
		section: 'Core',
		type: 'component',
		status: 'stable'
	},
	{
		id: 'tooltip',
		title: 'Tooltip',
		content: 'Tooltip for displaying contextual information',
		href: '/components/tooltip',
		category: 'Components',
		section: 'Core',
		type: 'component',
		status: 'stable'
	},
	{
		id: 'menu',
		title: 'Menu',
		content: 'Dropdown menu with keyboard navigation',
		href: '/components/menu',
		category: 'Components',
		section: 'Core',
		type: 'component',
		status: 'beta'
	},
	{
		id: 'tabs',
		title: 'Tabs',
		content: 'Tab navigation with panels',
		href: '/components/tabs',
		category: 'Components',
		section: 'Core',
		type: 'component',
		status: 'beta'
	},
	{
		id: 'timeline',
		title: 'Timeline',
		content: 'Timeline component for social feeds',
		href: '/components/timeline',
		category: 'Components',
		section: 'Fediverse',
		type: 'component',
		status: 'beta'
	},
	{
		id: 'compose-box',
		title: 'ComposeBox',
		content: 'Rich text editor for composing posts',
		href: '/components/compose-box',
		category: 'Components',
		section: 'Fediverse',
		type: 'component',
		status: 'alpha'
	},
	
	// Guides
	{
		id: 'installation',
		title: 'Installation',
		content: 'How to install and set up Greater Components',
		href: '/installation',
		category: 'Getting Started',
		section: 'Setup',
		type: 'guide'
	},
	{
		id: 'theming',
		title: 'Theming',
		content: 'Customize colors, typography, and design tokens',
		href: '/guides/theming',
		category: 'Guides',
		section: 'Customization',
		type: 'guide'
	},
	{
		id: 'accessibility',
		title: 'Accessibility',
		content: 'WCAG compliance and keyboard navigation',
		href: '/guides/accessibility',
		category: 'Guides',
		section: 'Best Practices',
		type: 'guide'
	},
	{
		id: 'typescript',
		title: 'TypeScript',
		content: 'TypeScript support and type definitions',
		href: '/guides/typescript',
		category: 'Guides',
		section: 'Development',
		type: 'guide'
	},
	
	// Tokens
	{
		id: 'colors',
		title: 'Colors',
		content: 'Color palette and semantic color tokens',
		href: '/tokens/colors',
		category: 'Design Tokens',
		section: 'Visual',
		type: 'token'
	},
	{
		id: 'typography',
		title: 'Typography',
		content: 'Font families, sizes, and text styles',
		href: '/tokens/typography',
		category: 'Design Tokens',
		section: 'Visual',
		type: 'token'
	},
	{
		id: 'spacing',
		title: 'Spacing',
		content: 'Spacing scale and layout utilities',
		href: '/tokens/spacing',
		category: 'Design Tokens',
		section: 'Layout',
		type: 'token'
	},
	
	// API
	{
		id: 'stores',
		title: 'Stores',
		content: 'Svelte stores for state management',
		href: '/api/stores',
		category: 'API Reference',
		section: 'State',
		type: 'api'
	},
	{
		id: 'utilities',
		title: 'Utilities',
		content: 'Helper functions and utilities',
		href: '/api/utilities',
		category: 'API Reference',
		section: 'Helpers',
		type: 'api'
	},
	{
		id: 'adapters',
		title: 'Adapters',
		content: 'Platform adapters for Mastodon, Bluesky, etc',
		href: '/api/adapters',
		category: 'API Reference',
		section: 'Integration',
		type: 'api'
	}
];

// Populate the index
initialDocuments.forEach(doc => searchIndex.addDocument(doc));
