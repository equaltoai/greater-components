export interface RelativeTimeOptions {
	/**
	 * Locale for formatting (e.g., 'en-US', 'fr-FR')
	 */
	locale?: string;
	/**
	 * Whether to use numeric format (e.g., "1 day ago" vs "yesterday")
	 */
	numeric?: 'always' | 'auto';
	/**
	 * Custom now time for testing
	 */
	now?: Date | number;
	/**
	 * Maximum unit to display
	 */
	maxUnit?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';
}
export interface FormatDateTimeOptions extends RelativeTimeOptions {
	/** Absolute-date presentation style. */
	dateStyle?: 'full' | 'long' | 'medium' | 'short';
	/** Absolute-time presentation style. */
	timeStyle?: 'full' | 'long' | 'medium' | 'short';
	/**
	 * IANA time-zone name used for the absolute label (for example, `UTC` or
	 * `America/New_York`). Pin this for SSR so the server and hydrated client
	 * render the same visible timestamp.
	 */
	timeZone?: string;
}
/**
 * Format a date as relative time (e.g., "2 hours ago", "just now")
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted relative time string
 */
export declare function relativeTime(
	date: Date | string | number,
	options?: RelativeTimeOptions
): string;
/**
 * Format a date with both absolute and relative time
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Object with absolute and relative time strings
 */
export declare function formatDateTime(
	date: Date | string | number,
	options?: FormatDateTimeOptions
): {
	absolute: string;
	relative: string;
	iso: string;
};
/**
 * Get a human-readable duration between two dates
 * @param start - Start date
 * @param end - End date
 * @param options - Formatting options
 * @returns Duration string
 */
export declare function getDuration(
	start: Date | string | number,
	end: Date | string | number,
	options?: {
		locale?: string;
		units?: number;
	}
): string;
//# sourceMappingURL=relativeTime.d.ts.map
