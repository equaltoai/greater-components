import { formatDateTime } from '@equaltoai/greater-components-utils';

export interface ArticleFormattedDateTime {
	label: string;
	iso?: string;
}

/**
 * Formats an article timestamp for display while preserving a machine-readable
 * datetime value for `<time>` elements.
 */
export function formatArticleDateTime(
	value: Date | string | number | null | undefined
): ArticleFormattedDateTime {
	if (value === null || value === undefined || value === '') {
		return { label: '' };
	}

	const formatted = formatDateTime(value);
	return {
		label: formatted.absolute,
		iso: formatted.iso || undefined,
	};
}
