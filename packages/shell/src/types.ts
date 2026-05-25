/**
 * @fileoverview Shared types for Greater Shell components.
 *
 * @public
 */

/** Sidebar placement within Shell. */
export type ShellSidebarPlacement = 'left' | 'right';

/** Sidebar preset widths. */
export type SidebarWidth = 'sm' | 'md' | 'lg';

/** Sidebar visual variant. */
export type SidebarVariant = 'compact' | 'full';

/** Topbar visual variant. */
export type TopbarVariant = 'default' | 'flat' | 'elevated';

/** Panel visual variant. */
export type PanelVariant = 'default' | 'flat' | 'elevated';

/** Panel padding preset. */
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg';

/** StatCard status / tone. */
export type StatCardStatus = 'default' | 'success' | 'warning' | 'danger' | 'info';

/** StatCard trend direction. */
export type StatCardTrendDirection = 'up' | 'down' | 'flat';

/** StatCard trend descriptor. */
export interface StatCardTrend {
	/** Visual direction of the trend. */
	direction: StatCardTrendDirection;
	/** Accessible / visible label for the trend. */
	label: string;
}

/** SummaryStrip column preset. */
export type SummaryStripColumns = 'auto' | 1 | 2 | 3 | 4 | 5 | 6;

/** SummaryStrip gap preset. */
export type SummaryStripGap = 'sm' | 'md' | 'lg';

/** PageFrame width preset. */
export type PageFrameWidth = 'narrow' | 'default' | 'wide' | 'full';

/** PageFrame aside placement. */
export type PageFrameAsidePlacement = 'left' | 'right';

/** PageTitle heading level. */
export type PageTitleLevel = 1 | 2;

/** A single breadcrumb item. */
export interface BreadcrumbItem {
	/** Visible breadcrumb label. */
	label: string;
	/** Optional href; when omitted the item renders as static text. */
	href?: string;
	/** When true, the item is marked as the current page via aria-current="page". */
	current?: boolean;
}

/** Callout tone. */
export type CalloutTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

/** Callout ARIA role for live-region semantics. */
export type CalloutRole = 'status' | 'alert' | 'note';

/**
 * A single command palette item (e.g. a route, an action, a setting).
 *
 * Consumers supply opaque ids; the CommandPalette never interprets `id`
 * beyond using it for `aria-activedescendant` and as the argument to
 * `onselect`. Use `keywords` to expose synonyms / aliases for filtering
 * that should not be displayed as part of the label.
 */
export interface CommandPaletteItem {
	/** Stable id; used for DOM identification and as the `onselect` argument. */
	id: string;
	/** Visible primary label. */
	label: string;
	/** Optional secondary description rendered below the label. */
	description?: string;
	/** Additional terms that should match against the query (synonyms, aliases). */
	keywords?: string[];
	/** Optional keyboard shortcut hint (rendered with `aria-hidden`; for visual cue only). */
	shortcut?: string;
	/** When true, the item is rendered but cannot be activated. */
	disabled?: boolean;
}

/**
 * A group of command palette items rendered together with a shared label.
 *
 * Groups are exposed via `role="group"` with `aria-labelledby` referencing
 * the group label, so screen readers announce the section name.
 */
export interface CommandPaletteGroup {
	/** Stable id used for the group label element. */
	id: string;
	/** Visible label for the group (e.g. "Pages", "Actions"). */
	label: string;
	/** Items in this group; rendered in array order after filtering. */
	items: CommandPaletteItem[];
}

/**
 * Signature for a custom item-vs-query matcher.
 *
 * Return `null` (or `undefined`) to exclude the item from results; return a
 * numeric score (higher = better) to include and rank it. When omitted, the
 * built-in scorer matches all whitespace-separated query tokens
 * case-insensitively against `label`, `description`, and `keywords`, with
 * higher scores for prefix / word-boundary matches over substring matches.
 */
export type CommandPaletteFilter = (
	item: CommandPaletteItem,
	query: string
) => number | null | undefined;
