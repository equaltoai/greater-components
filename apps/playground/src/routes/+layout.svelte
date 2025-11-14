<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import '@equaltoai/greater-components-tokens/theme.css';
	import '@equaltoai/greater-components-primitives/style.css';
	import '../app.css';
	import { ThemeProvider, ThemeSwitcher } from '@equaltoai/greater-components-primitives';
import {
	HomeIcon,
	LayersIcon,
	GridIcon,
	PenToolIcon,
	LayoutIcon,
	CpuIcon,
	ImageIcon,
	ActivityIcon,
	MessageSquareIcon,
	Edit3Icon,
	BellIcon,
	UserIcon,
	SettingsIcon,
	SearchIcon,
} from '@equaltoai/greater-components-icons';

	let { children }: { children?: Snippet } = $props();

	const navLinks = [
		{ href: '/', label: 'Overview', icon: HomeIcon },
		{ href: '/status', label: 'Status Card Demo', icon: MessageSquareIcon },
		{ href: '/compose', label: 'Compose Demo', icon: Edit3Icon },
	{ href: '/timeline', label: 'Timeline Demo', icon: ActivityIcon },
	{ href: '/profile', label: 'Profile App', icon: UserIcon },
	{ href: '/settings', label: 'Settings App', icon: SettingsIcon },
	{ href: '/search', label: 'Search App', icon: SearchIcon },
		{ href: '/notifications', label: 'Notifications Demo', icon: BellIcon },
		{ href: '/demos/primitives', label: 'Primitive Suite', icon: LayersIcon },
		{ href: '/demos/button', label: 'Button Patterns', icon: GridIcon },
		{ href: '/demos/forms', label: 'Form Patterns', icon: PenToolIcon },
		{ href: '/demos/layout', label: 'Layout Surfaces', icon: LayoutIcon },
		{ href: '/demos/interactive', label: 'Interactive Suite', icon: CpuIcon },
		{ href: '/demos/icons', label: 'Icon Gallery', icon: ImageIcon },
	] as const;
</script>

<ThemeProvider>
	<div class="app-shell">
		<aside class="app-shell__sidebar" aria-label="Demo navigation">
			<header class="sidebar-header">
				<p class="eyebrow">Greater Components</p>
				<h1>Demo Suite</h1>
				<p>Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p>
			</header>
			<nav class="sidebar-nav">
		{#each navLinks as { href, label, icon: Icon } (href)}
			<a class:active={$page.url.pathname === href} {href}>
				<Icon size={18} aria-hidden="true" />
				<span>{label}</span>
			</a>
		{/each}
			</nav>
			<div class="sidebar-footer">
				<p>Adaptive themes</p>
				<ThemeSwitcher size="sm" variant="outline" />
			</div>
		</aside>
		<main class="app-shell__content">
			{#if children}
				{@render children()}
			{/if}
		</main>
	</div>
</ThemeProvider>

<style>
	:global(body) {
		background: var(--gr-semantic-background-primary);
		color: var(--gr-semantic-foreground-primary);
	}

	.app-shell {
		min-height: 100vh;
		display: grid;
		grid-template-columns: minmax(240px, 320px) 1fr;
	}

	.app-shell__sidebar {
		background: var(--gr-semantic-background-secondary);
		border-right: 1px solid var(--gr-semantic-border-subtle);
		padding: 2rem 1.5rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.sidebar-header h1 {
		font-size: var(--gr-typography-fontSize-2xl);
		margin: 0.25rem 0;
	}

	.eyebrow {
		letter-spacing: 0.2em;
		text-transform: uppercase;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin: 0;
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.sidebar-nav a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: var(--gr-radii-lg);
		text-decoration: none;
		color: inherit;
		font-weight: var(--gr-typography-fontWeight-medium);
		transition: background 120ms ease;
	}

	.sidebar-nav a:hover {
		background: var(--gr-semantic-background-tertiary);
	}

	.sidebar-nav a.active {
		background: var(--gr-semantic-action-primary-default);
		color: var(--gr-color-base-white);
	}

	.sidebar-footer {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.sidebar-footer p {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
	}

	.app-shell__content {
		padding: 3rem 4rem;
		background: var(--gr-semantic-background-primary);
	}

	@media (max-width: 960px) {
		.app-shell {
			grid-template-columns: 1fr;
		}

		.app-shell__sidebar {
			border-right: none;
			border-bottom: 1px solid var(--gr-semantic-border-subtle);
		}

		.app-shell__content {
			padding: 2rem 1.5rem;
		}
	}
</style>
