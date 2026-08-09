import {
	formatDateTime,
	type FormatDateTimeOptions,
} from '@equaltoai/greater-components-utils/relativeTime';

export interface ArticleFormattedDateTime {
	label: string;
	iso?: string;
}

/**
 * Formats an article timestamp for display while preserving a machine-readable
 * datetime value for `<time>` elements.
 */
export function formatArticleDateTime(
	value: Date | string | number | null | undefined,
	options: FormatDateTimeOptions = {}
): ArticleFormattedDateTime {
	if (value === null || value === undefined || value === '') {
		return { label: '' };
	}

	const formatted = formatDateTime(value, options);
	return {
		label: formatted.absolute,
		iso: formatted.iso || undefined,
	};
}
