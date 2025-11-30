<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import '@equaltoai/greater-components-tokens/theme.css';
	import '@equaltoai/greater-components-primitives/theme.css';
	import '../app.css';
	import {
		ThemeProvider,
		ThemeSwitcher,
		preferencesStore,
	} from '@equaltoai/greater-components-primitives';
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
		MessageCircleIcon,
		Edit3Icon,
		BellIcon,
		UserIcon,
		SettingsIcon,
		SearchIcon,
		BookOpenIcon,
	} from '@equaltoai/greater-components-icons';
	import type { IconComponent } from '@equaltoai/greater-components-icons';

	let { children, data }: { children?: Snippet; data?: LayoutData } = $props();

	const testTheme = $derived(() => data?.testTheme ?? null);
	const testDensity = $derived(() => data?.testDensity ?? null);

	const shouldPreseedPreferences = $derived(() => Boolean(testTheme || testDensity));

	const navLinks = [
		{ href: '/', label: 'Overview', icon: HomeIcon },
		{ href: '/docs', label: 'Documentation', icon: BookOpenIcon, external: true },
		{ href: '/chat', label: 'Chat Demo', icon: MessageCircleIcon },
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
	] as const satisfies ReadonlyArray<{
		href: string;
		label: string;
		icon: IconComponent;
		external?: boolean;
	}>;

	const resolveHref = (href: string) => {
		if (href === '/') {
			return base || '/';
		}

		return `${base}${href}`;
	};

	onMount(() => {
		document.body.dataset.playgroundHydrated = 'true';

		return () => {
			delete document.body.dataset.playgroundHydrated;
		};
	});

	onMount(() => {
		if (!testTheme && !testDensity) {
			return;
		}

		if (testTheme) {
			preferencesStore.setHighContrastMode(testTheme === 'high-contrast');
			preferencesStore.setColorScheme(testTheme);
		}

		if (testDensity) {
			preferencesStore.setDensity(testDensity);
		}
	});
</script>

<svelte:head>
	{#if shouldPreseedPreferences && typeof window === 'undefined'}
		<script>
			(function () {
				const themeValue = {JSON.stringify(testTheme ?? null)};
				const densityValue = {JSON.stringify(testDensity ?? null)};

				try {
					const raw = localStorage.getItem('gr-preferences-v1');
					const prefs = raw ? JSON.parse(raw) : {};

					if (themeValue) {
						prefs.colorScheme = themeValue;
						prefs.highContrastMode = themeValue === 'high-contrast';
					}

					if (densityValue) {
						prefs.density = densityValue;
					}

					localStorage.setItem('gr-preferences-v1', JSON.stringify(prefs));
				} catch (error) {
					console.warn('Failed to sync test preferences', error);
				}

				if (themeValue) {
					document.documentElement.setAttribute('data-theme', themeValue);
				}

				if (densityValue) {
					document.documentElement.setAttribute('data-density', densityValue);
				}
			})();
		</script>
	{/if}
</svelte:head>

<ThemeProvider>
	<div class="app-shell">
		<aside class="app-shell__sidebar" aria-label="Demo navigation">
			<header class="sidebar-header">
				<p class="eyebrow">Greater Components</p>
				<h1>Demo Suite</h1>
				<p>Explore tokens, primitives, and ActivityPub-ready surfaces with production builds.</p>
			</header>
			<nav class="sidebar-nav">
				{#each navLinks as { href, label, icon: Icon, external } (href)}
					{@const resolved = resolveHref(href)}
					<a
						class:active={$page.url.pathname === href}
						href={resolved}
						rel={external ? 'external' : undefined}
						data-sveltekit-reload={external || undefined}
					>
						<Icon size={18} aria-hidden="true" />
						<span>{label}</span>
					</a>
				{/each}
			</nav>
			<section class="sidebar-footer" aria-labelledby="theme-controls-heading">
				<h2 id="theme-controls-heading" class="sidebar-footer__heading">Adaptive themes</h2>
				<ThemeSwitcher size="sm" variant="outline" />
			</section>
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
		color: var(--gr-semantic-foreground-primary);
		--gr-semantic-foreground-secondary: var(--gr-semantic-foreground-primary);
		--gr-semantic-foreground-tertiary: var(--gr-semantic-foreground-primary);
		--sidebar-foreground: var(--gr-semantic-foreground-primary);
	}

	.sidebar-header h1 {
		font-size: var(--gr-typography-fontSize-2xl);
		margin: 0.25rem 0;
	}

	.eyebrow {
		letter-spacing: 0.2em;
		text-transform: uppercase;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--sidebar-foreground);
		margin: 0;
	}

	.sidebar-header p {
		color: var(--sidebar-foreground);
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
		color: var(--sidebar-foreground);
		font-weight: var(--gr-typography-fontWeight-medium);
		transition: background 120ms ease;
	}

	.sidebar-nav a span {
		color: inherit;
	}

	.sidebar-nav a:hover {
		background: var(--gr-semantic-background-tertiary);
	}

	.sidebar-nav a.active {
		background: var(--gr-semantic-action-primary-default, #2563eb);
		color: var(--gr-color-base-white, #ffffff);
	}

	.sidebar-footer {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.sidebar-footer__heading {
		margin: 0;
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--sidebar-foreground);
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
