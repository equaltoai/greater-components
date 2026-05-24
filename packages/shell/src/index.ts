/**
 * @fileoverview Greater Shell - App shell layout components.
 *
 * Strict-CSP safe, Svelte 5 runes, WCAG 2.1 AA. All styling consumes
 * stable `--gr-*` design tokens; consumers may bridge their own design
 * tokens (e.g. `--ds-*`) in consumer CSS without touching this package.
 *
 * Components:
 * - Shell        — root grid layout combining sidebar, topbar, and main
 * - Sidebar      — semantic <nav> sidebar with accessible label
 * - Topbar       — site/app <header> bar
 * - Panel        — content container with header / body / footer
 * - StatCard     — metric display card
 * - SummaryStrip — labeled region grouping summary items / StatCards
 * - PageFrame    — single-page wrapper with optional aside
 * - PageTitle    — semantic page heading with eyebrow / subtitle / actions
 * - Breadcrumb   — breadcrumb navigation with aria-current="page"
 * - Callout      — informational call-out (status="status" or "alert")
 *
 * @version 0.1.0
 * @author Greater Contributors
 * @license AGPL-3.0-only
 * @public
 */

export type { ComponentProps } from 'svelte';

// Components
export { default as Shell } from './components/Shell.svelte';
export { default as Sidebar } from './components/Sidebar.svelte';
export { default as Topbar } from './components/Topbar.svelte';
export { default as Panel } from './components/Panel.svelte';
export { default as StatCard } from './components/StatCard.svelte';
export { default as SummaryStrip } from './components/SummaryStrip.svelte';
export { default as PageFrame } from './components/PageFrame.svelte';
export { default as PageTitle } from './components/PageTitle.svelte';
export { default as Breadcrumb } from './components/Breadcrumb.svelte';
export { default as Callout } from './components/Callout.svelte';
export { default as CommandPalette } from './components/CommandPalette.svelte';

// Utilities (dependency-free, strict-CSP-safe).
export {
	scoreCommandPaletteItem,
	filterAndRankItems as filterAndRankCommandPaletteItems,
	tokenizeQuery as tokenizeCommandPaletteQuery,
} from './utils/fuzzy-filter.js';

// Shared types
export type {
	ShellSidebarPlacement,
	SidebarWidth,
	SidebarVariant,
	TopbarVariant,
	PanelVariant,
	PanelPadding,
	StatCardStatus,
	StatCardTrendDirection,
	StatCardTrend,
	SummaryStripColumns,
	SummaryStripGap,
	PageFrameWidth,
	PageFrameAsidePlacement,
	PageTitleLevel,
	BreadcrumbItem,
	CalloutTone,
	CalloutRole,
	CommandPaletteItem,
	CommandPaletteGroup,
	CommandPaletteFilter,
} from './types.js';
