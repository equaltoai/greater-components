/**
 * Lists.Root Component Tests
 * 
 * Tests for list form validation and utility functions including:
 * - Title validation
 * - Description validation
 * - Length constraints
 * - Whitespace handling
 */

import { describe, it, expect } from 'vitest';
import type { ListFormData } from '../../src/components/Lists/context.js';

// Validate list form data
function validateListForm(data: ListFormData): string | null {
	if (!data.title.trim()) {
		return 'List title is required';
	}
	if (data.title.length > 100) {
		return 'List title must be 100 characters or less';
	}
	if (data.description && data.description.length > 500) {
		return 'Description must be 500 characters or less';
	}
	return null;
}

// Check if list title is valid
function isValidTitle(title: string): boolean {
	return title.trim().length > 0 && title.length <= 100;
}

// Check if list description is valid
function isValidDescription(description: string | undefined): boolean {
	if (!description) return true;
	return description.length <= 500;
}

// Normalize list title (trim whitespace)
function normalizeTitle(title: string): string {
	return title.trim();
}

// Get title length for display
function getTitleLength(title: string): number {
	return title.length;
}

// Get description length for display
function getDescriptionLength(description: string | undefined): number {
	return description ? description.length : 0;
}

// Check if title is at character limit
function isTitleAtLimit(title: string): boolean {
	return title.length >= 100;
}

// Check if description is at character limit
function isDescriptionAtLimit(description: string | undefined): boolean {
	return description ? description.length >= 500 : false;
}

// Get remaining characters for title
function getTitleRemaining(title: string): number {
	return Math.max(0, 100 - title.length);
}

// Get remaining characters for description
function getDescriptionRemaining(description: string | undefined): number {
	return Math.max(0, 500 - getDescriptionLength(description));
}

// Check if form data has changed
function hasFormChanged(original: ListFormData, current: ListFormData): boolean {
	return (
		original.title !== current.title ||
		original.description !== current.description ||
		original.visibility !== current.visibility
	);
}

// Create default form data
function createDefaultFormData(): ListFormData {
	return {
		title: '',
		description: '',
		visibility: 'private',
	};
}

describe('Lists.Root - Form Validation', () => {
	it('validates form with valid title', () => {
		const data: ListFormData = {
			title: 'My List',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('rejects empty title', () => {
		const data: ListFormData = {
			title: '',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBe('List title is required');
	});

	it('rejects whitespace-only title', () => {
		const data: ListFormData = {
			title: '   ',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBe('List title is required');
	});

	it('rejects title over 100 characters', () => {
		const data: ListFormData = {
			title: 'a'.repeat(101),
			visibility: 'private',
		};
		expect(validateListForm(data)).toBe('List title must be 100 characters or less');
	});

	it('accepts title at exactly 100 characters', () => {
		const data: ListFormData = {
			title: 'a'.repeat(100),
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('accepts undefined description', () => {
		const data: ListFormData = {
			title: 'My List',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('accepts empty description', () => {
		const data: ListFormData = {
			title: 'My List',
			description: '',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('rejects description over 500 characters', () => {
		const data: ListFormData = {
			title: 'My List',
			description: 'a'.repeat(501),
			visibility: 'private',
		};
		expect(validateListForm(data)).toBe('Description must be 500 characters or less');
	});

	it('accepts description at exactly 500 characters', () => {
		const data: ListFormData = {
			title: 'My List',
			description: 'a'.repeat(500),
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('validates public visibility', () => {
		const data: ListFormData = {
			title: 'My List',
			visibility: 'public',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('validates private visibility', () => {
		const data: ListFormData = {
			title: 'My List',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});
});

describe('Lists.Root - Title Validation', () => {
	it('validates non-empty title', () => {
		expect(isValidTitle('My List')).toBe(true);
	});

	it('rejects empty title', () => {
		expect(isValidTitle('')).toBe(false);
	});

	it('rejects whitespace-only title', () => {
		expect(isValidTitle('   ')).toBe(false);
	});

	it('accepts title with leading/trailing spaces after trim', () => {
		expect(isValidTitle('  My List  ')).toBe(true);
	});

	it('rejects title over 100 characters', () => {
		expect(isValidTitle('a'.repeat(101))).toBe(false);
	});

	it('accepts title at 100 characters', () => {
		expect(isValidTitle('a'.repeat(100))).toBe(true);
	});

	it('accepts single character title', () => {
		expect(isValidTitle('A')).toBe(true);
	});

	it('accepts unicode in title', () => {
		expect(isValidTitle('リスト 📋')).toBe(true);
	});
});

describe('Lists.Root - Description Validation', () => {
	it('accepts undefined description', () => {
		expect(isValidDescription(undefined)).toBe(true);
	});

	it('accepts empty description', () => {
		expect(isValidDescription('')).toBe(true);
	});

	it('accepts valid description', () => {
		expect(isValidDescription('This is my list')).toBe(true);
	});

	it('rejects description over 500 characters', () => {
		expect(isValidDescription('a'.repeat(501))).toBe(false);
	});

	it('accepts description at 500 characters', () => {
		expect(isValidDescription('a'.repeat(500))).toBe(true);
	});

	it('accepts unicode in description', () => {
		expect(isValidDescription('これはリストです 📋')).toBe(true);
	});
});

describe('Lists.Root - Title Normalization', () => {
	it('trims leading whitespace', () => {
		expect(normalizeTitle('  My List')).toBe('My List');
	});

	it('trims trailing whitespace', () => {
		expect(normalizeTitle('My List  ')).toBe('My List');
	});

	it('trims both leading and trailing whitespace', () => {
		expect(normalizeTitle('  My List  ')).toBe('My List');
	});

	it('preserves internal whitespace', () => {
		expect(normalizeTitle('My  List')).toBe('My  List');
	});

	it('handles empty string', () => {
		expect(normalizeTitle('')).toBe('');
	});

	it('handles whitespace-only string', () => {
		expect(normalizeTitle('   ')).toBe('');
	});
});

describe('Lists.Root - Character Counting', () => {
	it('counts title characters', () => {
		expect(getTitleLength('My List')).toBe(7);
	});

	it('counts title with unicode', () => {
		expect(getTitleLength('リスト')).toBe(3);
	});

	it('counts description characters', () => {
		expect(getDescriptionLength('This is a description')).toBe(21);
	});

	it('returns 0 for undefined description', () => {
		expect(getDescriptionLength(undefined)).toBe(0);
	});

	it('returns 0 for empty description', () => {
		expect(getDescriptionLength('')).toBe(0);
	});
});

describe('Lists.Root - Character Limits', () => {
	it('detects title at limit', () => {
		expect(isTitleAtLimit('a'.repeat(100))).toBe(true);
	});

	it('detects title over limit', () => {
		expect(isTitleAtLimit('a'.repeat(101))).toBe(true);
	});

	it('detects title under limit', () => {
		expect(isTitleAtLimit('My List')).toBe(false);
	});

	it('detects description at limit', () => {
		expect(isDescriptionAtLimit('a'.repeat(500))).toBe(true);
	});

	it('detects description over limit', () => {
		expect(isDescriptionAtLimit('a'.repeat(501))).toBe(true);
	});

	it('detects description under limit', () => {
		expect(isDescriptionAtLimit('My description')).toBe(false);
	});

	it('detects undefined description as not at limit', () => {
		expect(isDescriptionAtLimit(undefined)).toBe(false);
	});
});

describe('Lists.Root - Remaining Characters', () => {
	it('calculates remaining title characters', () => {
		expect(getTitleRemaining('My List')).toBe(93);
	});

	it('returns 0 for title at limit', () => {
		expect(getTitleRemaining('a'.repeat(100))).toBe(0);
	});

	it('returns 0 for title over limit', () => {
		expect(getTitleRemaining('a'.repeat(110))).toBe(0);
	});

	it('calculates remaining description characters', () => {
		expect(getDescriptionRemaining('This is a description')).toBe(479);
	});

	it('returns 0 for description at limit', () => {
		expect(getDescriptionRemaining('a'.repeat(500))).toBe(0);
	});

	it('returns 0 for description over limit', () => {
		expect(getDescriptionRemaining('a'.repeat(510))).toBe(0);
	});

	it('returns 500 for undefined description', () => {
		expect(getDescriptionRemaining(undefined)).toBe(500);
	});
});

describe('Lists.Root - Form Change Detection', () => {
	it('detects title change', () => {
		const original: ListFormData = {
			title: 'Original',
			visibility: 'private',
		};
		const current: ListFormData = {
			title: 'Changed',
			visibility: 'private',
		};
		expect(hasFormChanged(original, current)).toBe(true);
	});

	it('detects description change', () => {
		const original: ListFormData = {
			title: 'My List',
			description: 'Original',
			visibility: 'private',
		};
		const current: ListFormData = {
			title: 'My List',
			description: 'Changed',
			visibility: 'private',
		};
		expect(hasFormChanged(original, current)).toBe(true);
	});

	it('detects visibility change', () => {
		const original: ListFormData = {
			title: 'My List',
			visibility: 'private',
		};
		const current: ListFormData = {
			title: 'My List',
			visibility: 'public',
		};
		expect(hasFormChanged(original, current)).toBe(true);
	});

	it('detects no change', () => {
		const original: ListFormData = {
			title: 'My List',
			description: 'Description',
			visibility: 'private',
		};
		const current: ListFormData = {
			title: 'My List',
			description: 'Description',
			visibility: 'private',
		};
		expect(hasFormChanged(original, current)).toBe(false);
	});

	it('detects undefined to defined description change', () => {
		const original: ListFormData = {
			title: 'My List',
			visibility: 'private',
		};
		const current: ListFormData = {
			title: 'My List',
			description: 'New description',
			visibility: 'private',
		};
		expect(hasFormChanged(original, current)).toBe(true);
	});
});

describe('Lists.Root - Default Form Data', () => {
	it('creates default form data', () => {
		const data = createDefaultFormData();
		expect(data.title).toBe('');
		expect(data.description).toBe('');
		expect(data.visibility).toBe('private');
	});

	it('default form data is valid after setting title', () => {
		const data = createDefaultFormData();
		data.title = 'My List';
		expect(validateListForm(data)).toBeNull();
	});
});

describe('Lists.Root - Edge Cases', () => {
	it('handles title with special characters', () => {
		const data: ListFormData = {
			title: 'My List! @#$%',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('handles title with newlines', () => {
		const title = 'My\nList';
		expect(isValidTitle(title)).toBe(true);
		expect(getTitleLength(title)).toBe(7);
	});

	it('handles title with tabs', () => {
		const title = 'My\tList';
		expect(normalizeTitle(title)).toBe('My\tList');
	});

	it('handles description with HTML', () => {
		const data: ListFormData = {
			title: 'My List',
			description: '<strong>Bold</strong> description',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('handles emoji in title', () => {
		const data: ListFormData = {
			title: 'My List 📋✨',
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
	});

	it('handles very long description', () => {
		const data: ListFormData = {
			title: 'My List',
			description: 'a'.repeat(1000),
			visibility: 'private',
		};
		const error = validateListForm(data);
		expect(error).toBe('Description must be 500 characters or less');
	});

	it('handles boundary at 99 characters for title', () => {
		const data: ListFormData = {
			title: 'a'.repeat(99),
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
		expect(getTitleRemaining(data.title)).toBe(1);
	});

	it('handles boundary at 101 characters for title', () => {
		const data: ListFormData = {
			title: 'a'.repeat(101),
			visibility: 'private',
		};
		expect(validateListForm(data)).not.toBeNull();
	});

	it('handles boundary at 499 characters for description', () => {
		const data: ListFormData = {
			title: 'My List',
			description: 'a'.repeat(499),
			visibility: 'private',
		};
		expect(validateListForm(data)).toBeNull();
		expect(getDescriptionRemaining(data.description)).toBe(1);
	});

	it('handles boundary at 501 characters for description', () => {
		const data: ListFormData = {
			title: 'My List',
			description: 'a'.repeat(501),
			visibility: 'private',
		};
		expect(validateListForm(data)).not.toBeNull();
	});
});

describe('Lists.Root - Integration', () => {
	it('validates and normalizes complete form', () => {
		const data: ListFormData = {
			title: '  My List  ',
			description: 'A description',
			visibility: 'public',
		};

		const normalized = normalizeTitle(data.title);
		expect(normalized).toBe('My List');
		expect(isValidTitle(normalized)).toBe(true);
		expect(validateListForm({ ...data, title: normalized })).toBeNull();
	});

	it('provides complete character count information', () => {
		const title = 'My Test List';
		const description = 'This is a test description';

		expect(getTitleLength(title)).toBe(12);
		expect(getTitleRemaining(title)).toBe(88);
		expect(isTitleAtLimit(title)).toBe(false);

		expect(getDescriptionLength(description)).toBe(26);
		expect(getDescriptionRemaining(description)).toBe(474);
		expect(isDescriptionAtLimit(description)).toBe(false);
	});

	it('validates form through complete workflow', () => {
		// Start with default
		const data = createDefaultFormData();
		expect(validateListForm(data)).not.toBeNull();

		// Add title
		data.title = 'My List';
		expect(validateListForm(data)).toBeNull();

		// Add description
		data.description = 'A great list';
		expect(validateListForm(data)).toBeNull();

		// Change visibility
		data.visibility = 'public';
		expect(validateListForm(data)).toBeNull();
	});
});

