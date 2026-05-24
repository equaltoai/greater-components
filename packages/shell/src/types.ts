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
