<script lang="ts">
	import { page } from '$app/stores';
	import ChevronRightIcon from '@equaltoai/greater-components-icons/icons/chevron-right.svelte';

	export let isMobileMenuOpen = false;

	interface NavSection {
		title: string;
		items: NavItem[];
	}

	interface NavItem {
		title: string;
		href: string;
		status?: 'alpha' | 'beta' | 'stable' | 'deprecated';
		children?: NavItem[];
	}

	const navigation: NavSection[] = [
		{
			title: 'Getting Started',
			items: [
				{ title: 'Introduction', href: '/' },
				{ title: 'Installation', href: '/installation' },
			],
		},
		{
			title: 'Guides',
			items: [
				{ title: 'Theming', href: '/guides/theming' },
				{ title: 'Dark Mode', href: '/guides/dark-mode' },
				{ title: 'Animations', href: '/guides/animations' },
				{ title: 'Accessibility', href: '/guides/accessibility' },
				{ title: 'TypeScript', href: '/guides/typescript' },
			],
		},
		{
			title: 'Components',
			items: [
				{ title: 'Catalog', href: '/components' },
				{ title: 'Button', href: '/components/button', status: 'stable' },
				{ title: 'Tabs', href: '/components/tabs', status: 'stable' },
				{ title: 'Switch', href: '/components/switch', status: 'stable' },
				{ title: 'Modal', href: '/components/modal', status: 'stable' },
				{ title: 'Menu', href: '/components/menu', status: 'stable' },
				{ title: 'Alert', href: '/components/alert', status: 'stable' },
				{ title: 'Spinner', href: '/components/spinner', status: 'stable' },
				{ title: 'LoadingState', href: '/components/loading-state', status: 'stable' },
				{ title: 'Timeline', href: '/components/timeline', status: 'beta' },
				{ title: 'GraphQL Adapter', href: '/components/graphql-adapter', status: 'beta' },
			],
		},
		{
			title: 'Demo Suite',
			items: [
				{ title: 'Overview', href: '/demo-suite' },
				{ title: 'Timeline App', href: '/demo-suite/timeline' },
				{ title: 'Profile App', href: '/demo-suite/profile' },
				{ title: 'Settings App', href: '/demo-suite/settings' },
				{ title: 'Search App', href: '/demo-suite/search' },
			],
		},
		{
			title: 'Design Tokens',
			items: [
				{ title: 'Colors', href: '/tokens/colors' },
				{ title: 'Typography', href: '/tokens/typography' },
				{ title: 'Spacing', href: '/tokens/spacing' },
				{ title: 'Animations', href: '/tokens/animations' },
			],
		},
		{
			title: 'API Reference',
			items: [
				{ title: 'Stores', href: '/api/stores' },
				{ title: 'Utilities', href: '/api/utilities' },
				{ title: 'Adapters', href: '/api/adapters' },
			],
		},
	];

	let expandedSections = new Set(['Getting Started', 'Core Components']);

	function toggleSection(title: string) {
		if (expandedSections.has(title)) {
			expandedSections.delete(title);
		} else {
			expandedSections.add(title);
		}
		expandedSections = expandedSections;
	}

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<aside class="docs-sidebar" class:open={isMobileMenuOpen}>
	<nav class="sidebar-nav">
		{#each navigation as section (section.title)}
			<div class="nav-section">
				<button
					class="section-header"
					on:click={() => toggleSection(section.title)}
					aria-expanded={expandedSections.has(section.title)}
				>
					<ChevronRightIcon
						size={16}
						class="chevron {expandedSections.has(section.title) ? 'expanded' : ''}"
					/>
					<span>{section.title}</span>
				</button>

				{#if expandedSections.has(section.title)}
					<ul class="section-items">
						{#each section.items as item (item.href)}
							<li>
								<a href={item.href} class="nav-link" class:active={isActive(item.href)}>
									<span>{item.title}</span>
									{#if item.status}
										<span class="status-badge {item.status}">{item.status}</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</nav>
</aside>

<style>
	.docs-sidebar {
		position: fixed;
		top: var(--doc-header-height);
		left: 0;
		bottom: 0;
		width: var(--doc-sidebar-width);
		background: var(--doc-bg);
		border-right: 1px solid var(--doc-border);
		overflow-y: auto;
		transition: transform 0.3s ease;
	}

	.sidebar-nav {
		padding: 1rem;
	}

	.nav-section {
		margin-bottom: 1rem;
	}

	.section-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: transparent;
		border: none;
		color: var(--doc-text);
		font-weight: 600;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		cursor: pointer;
		transition: color 0.2s;
	}

	.section-header:hover {
		color: var(--doc-link);
	}

	.section-header :global(.chevron) {
		transition: transform 0.2s;
	}

	.section-header :global(.chevron.expanded) {
		transform: rotate(90deg);
	}

	.section-items {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 0 1.5rem;
	}

	.nav-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.375rem 0.75rem;
		color: var(--doc-text);
		text-decoration: none;
		border-radius: 0.25rem;
		opacity: 0.8;
		transition: all 0.2s;
	}

	.nav-link:hover {
		opacity: 1;
		background: var(--doc-surface-secondary);
	}

	.nav-link.active {
		opacity: 1;
		background: var(--doc-surface-secondary);
		color: var(--doc-link);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.docs-sidebar {
			transform: translateX(-100%);
			z-index: 99;
			box-shadow: var(--doc-shadow-lg);
		}

		.docs-sidebar.open {
			transform: translateX(0);
		}
	}
</style>
