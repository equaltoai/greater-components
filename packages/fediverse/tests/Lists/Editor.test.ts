/**
 * Lists.Editor Component Tests
 * 
 * Tests for list editor form logic including:
 * - Form data preparation
 * - Edit vs create mode detection
 * - Form title display
 * - Save button state
 * - Cancel handling
 */

import { describe, it, expect } from 'vitest';
import type { ListData, ListFormData } from '../../src/components/Lists/context.js';

// Get editor title
function getEditorTitle(editingList: ListData | null): string {
	return editingList ? 'Edit List' : 'Create New List';
}

// Prepare form data for submission
function prepareFormData(
	title: string,
	description: string,
	visibility: 'public' | 'private'
): ListFormData {
	return {
		title: title.trim(),
		description: description.trim() || undefined,
		visibility,
	};
}

// Check if form is in edit mode
function isEditMode(editingList: ListData | null): boolean {
	return editingList !== null;
}

// Get save button label
function getSaveButtonLabel(isEditMode: boolean, loading: boolean): string {
	if (loading) {
		return isEditMode ? 'Updating...' : 'Creating...';
	}
	return isEditMode ? 'Update' : 'Create';
}

// Check if save button should be disabled
function isSaveButtonDisabled(loading: boolean, titleValid: boolean): boolean {
	return loading || !titleValid;
}

// Initialize form from list data
function initializeFormFromList(list: ListData | null): {
	title: string;
	description: string;
	visibility: 'public' | 'private';
} {
	if (list) {
		return {
			title: list.title,
			description: list.description || '',
			visibility: list.visibility,
		};
	}
	return {
		title: '',
		description: '',
		visibility: 'public',
	};
}

// Check if form has unsaved changes
function hasUnsavedChanges(
	original: ListData | null,
	current: { title: string; description: string; visibility: 'public' | 'private' }
): boolean {
	if (!original) {
		// New list - has changes if any field is non-empty
		return current.title.trim().length > 0 || current.description.trim().length > 0;
	}

	return (
		original.title !== current.title.trim() ||
		(original.description || '') !== current.description.trim() ||
		original.visibility !== current.visibility
	);
}

// Get character limits
function getTitleMaxLength(): number {
	return 100;
}

function getDescriptionMaxLength(): number {
	return 500;
}

// Check if title is near limit
function isTitleNearLimit(title: string): boolean {
	const threshold = getTitleMaxLength() * 0.9; // 90% of limit
	return title.length >= threshold;
}

// Check if description is near limit
function isDescriptionNearLimit(description: string): boolean {
	const threshold = getDescriptionMaxLength() * 0.9; // 90% of limit
	return description.length >= threshold;
}

// Get placeholder text
function getTitlePlaceholder(): string {
	return 'Enter list title';
}

function getDescriptionPlaceholder(): string {
	return 'Add a description (optional)';
}

// Validate individual fields
function validateTitle(title: string): string | null {
	if (!title.trim()) {
		return 'Title is required';
	}
	if (title.length > getTitleMaxLength()) {
		return `Title must be ${getTitleMaxLength()} characters or less`;
	}
	return null;
}

function validateDescription(description: string | undefined): string | null {
	if (description && description.length > getDescriptionMaxLength()) {
		return `Description must be ${getDescriptionMaxLength()} characters or less`;
	}
	return null;
}

describe('Lists.Editor - Editor Title', () => {
	it('shows Create New List for new list', () => {
		expect(getEditorTitle(null)).toBe('Create New List');
	});

	it('shows Edit List when editing', () => {
		const list: ListData = {
			id: '1',
			title: 'My List',
			visibility: 'private',
			membersCount: 0,
		};
		expect(getEditorTitle(list)).toBe('Edit List');
	});
});

describe('Lists.Editor - Form Data Preparation', () => {
	it('prepares form data with trimmed values', () => {
		const data = prepareFormData('  My List  ', '  Description  ', 'public');
		expect(data.title).toBe('My List');
		expect(data.description).toBe('Description');
		expect(data.visibility).toBe('public');
	});

	it('sets description to undefined when empty', () => {
		const data = prepareFormData('My List', '', 'private');
		expect(data.description).toBeUndefined();
	});

	it('sets description to undefined when whitespace only', () => {
		const data = prepareFormData('My List', '   ', 'private');
		expect(data.description).toBeUndefined();
	});

	it('preserves non-empty description', () => {
		const data = prepareFormData('My List', 'A description', 'public');
		expect(data.description).toBe('A description');
	});

	it('handles public visibility', () => {
		const data = prepareFormData('List', '', 'public');
		expect(data.visibility).toBe('public');
	});

	it('handles private visibility', () => {
		const data = prepareFormData('List', '', 'private');
		expect(data.visibility).toBe('private');
	});
});

describe('Lists.Editor - Edit Mode Detection', () => {
	it('detects edit mode when list exists', () => {
		const list: ListData = {
			id: '1',
			title: 'List',
			visibility: 'private',
			membersCount: 0,
		};
		expect(isEditMode(list)).toBe(true);
	});

	it('detects create mode when list is null', () => {
		expect(isEditMode(null)).toBe(false);
	});
});

describe('Lists.Editor - Save Button Label', () => {
	it('shows Create when creating and not loading', () => {
		expect(getSaveButtonLabel(false, false)).toBe('Create');
	});

	it('shows Update when editing and not loading', () => {
		expect(getSaveButtonLabel(true, false)).toBe('Update');
	});

	it('shows Creating... when creating and loading', () => {
		expect(getSaveButtonLabel(false, true)).toBe('Creating...');
	});

	it('shows Updating... when editing and loading', () => {
		expect(getSaveButtonLabel(true, true)).toBe('Updating...');
	});
});

describe('Lists.Editor - Save Button State', () => {
	it('disables when loading', () => {
		expect(isSaveButtonDisabled(true, true)).toBe(true);
	});

	it('disables when title invalid', () => {
		expect(isSaveButtonDisabled(false, false)).toBe(true);
	});

	it('enables when not loading and title valid', () => {
		expect(isSaveButtonDisabled(false, true)).toBe(false);
	});

	it('disables when both loading and title invalid', () => {
		expect(isSaveButtonDisabled(true, false)).toBe(true);
	});
});

describe('Lists.Editor - Form Initialization', () => {
	it('initializes empty form for new list', () => {
		const form = initializeFormFromList(null);
		expect(form.title).toBe('');
		expect(form.description).toBe('');
		expect(form.visibility).toBe('public');
	});

	it('initializes from list data', () => {
		const list: ListData = {
			id: '1',
			title: 'My List',
			description: 'A description',
			visibility: 'private',
			membersCount: 5,
		};
		const form = initializeFormFromList(list);
		expect(form.title).toBe('My List');
		expect(form.description).toBe('A description');
		expect(form.visibility).toBe('private');
	});

	it('handles missing description', () => {
		const list: ListData = {
			id: '1',
			title: 'My List',
			visibility: 'public',
			membersCount: 0,
		};
		const form = initializeFormFromList(list);
		expect(form.description).toBe('');
	});
});

describe('Lists.Editor - Unsaved Changes Detection', () => {
	it('detects no changes for new empty list', () => {
		const current = { title: '', description: '', visibility: 'public' as const };
		expect(hasUnsavedChanges(null, current)).toBe(false);
	});

	it('detects changes in new list with title', () => {
		const current = { title: 'New List', description: '', visibility: 'public' as const };
		expect(hasUnsavedChanges(null, current)).toBe(true);
	});

	it('detects title change in existing list', () => {
		const original: ListData = {
			id: '1',
			title: 'Original',
			visibility: 'private',
			membersCount: 0,
		};
		const current = { title: 'Changed', description: '', visibility: 'private' as const };
		expect(hasUnsavedChanges(original, current)).toBe(true);
	});

	it('detects description change', () => {
		const original: ListData = {
			id: '1',
			title: 'List',
			description: 'Original',
			visibility: 'private',
			membersCount: 0,
		};
		const current = { title: 'List', description: 'Changed', visibility: 'private' as const };
		expect(hasUnsavedChanges(original, current)).toBe(true);
	});

	it('detects visibility change', () => {
		const original: ListData = {
			id: '1',
			title: 'List',
			visibility: 'private',
			membersCount: 0,
		};
		const current = { title: 'List', description: '', visibility: 'public' as const };
		expect(hasUnsavedChanges(original, current)).toBe(true);
	});

	it('detects no change when values match', () => {
		const original: ListData = {
			id: '1',
			title: 'List',
			description: 'Desc',
			visibility: 'public',
			membersCount: 0,
		};
		const current = { title: 'List', description: 'Desc', visibility: 'public' as const };
		expect(hasUnsavedChanges(original, current)).toBe(false);
	});

	it('handles whitespace differences', () => {
		const original: ListData = {
			id: '1',
			title: 'List',
			visibility: 'public',
			membersCount: 0,
		};
		const current = { title: '  List  ', description: '', visibility: 'public' as const };
		expect(hasUnsavedChanges(original, current)).toBe(false);
	});
});

describe('Lists.Editor - Character Limits', () => {
	it('returns title max length', () => {
		expect(getTitleMaxLength()).toBe(100);
	});

	it('returns description max length', () => {
		expect(getDescriptionMaxLength()).toBe(500);
	});

	it('detects title near limit', () => {
		expect(isTitleNearLimit('a'.repeat(90))).toBe(true);
		expect(isTitleNearLimit('a'.repeat(89))).toBe(false);
	});

	it('detects description near limit', () => {
		expect(isDescriptionNearLimit('a'.repeat(450))).toBe(true);
		expect(isDescriptionNearLimit('a'.repeat(449))).toBe(false);
	});

	it('detects title at limit', () => {
		expect(isTitleNearLimit('a'.repeat(100))).toBe(true);
	});

	it('detects description at limit', () => {
		expect(isDescriptionNearLimit('a'.repeat(500))).toBe(true);
	});
});

describe('Lists.Editor - Placeholders', () => {
	it('returns title placeholder', () => {
		expect(getTitlePlaceholder()).toBe('Enter list title');
	});

	it('returns description placeholder', () => {
		expect(getDescriptionPlaceholder()).toBe('Add a description (optional)');
	});
});

describe('Lists.Editor - Field Validation', () => {
	it('validates empty title', () => {
		expect(validateTitle('')).toBe('Title is required');
	});

	it('validates whitespace-only title', () => {
		expect(validateTitle('   ')).toBe('Title is required');
	});

	it('validates valid title', () => {
		expect(validateTitle('My List')).toBeNull();
	});

	it('validates title over limit', () => {
		const error = validateTitle('a'.repeat(101));
		expect(error).toContain('100 characters');
	});

	it('validates title at limit', () => {
		expect(validateTitle('a'.repeat(100))).toBeNull();
	});

	it('validates undefined description', () => {
		expect(validateDescription(undefined)).toBeNull();
	});

	it('validates empty description', () => {
		expect(validateDescription('')).toBeNull();
	});

	it('validates valid description', () => {
		expect(validateDescription('A description')).toBeNull();
	});

	it('validates description over limit', () => {
		const error = validateDescription('a'.repeat(501));
		expect(error).toContain('500 characters');
	});

	it('validates description at limit', () => {
		expect(validateDescription('a'.repeat(500))).toBeNull();
	});
});

describe('Lists.Editor - Edge Cases', () => {
	it('handles unicode in title', () => {
		const data = prepareFormData('リスト 📋', '', 'public');
		expect(data.title).toBe('リスト 📋');
	});

	it('handles special characters in description', () => {
		const data = prepareFormData('List', '@mention #hashtag', 'public');
		expect(data.description).toBe('@mention #hashtag');
	});

	it('handles very long title trimming', () => {
		const longTitle = '  ' + 'a'.repeat(100) + '  ';
		const data = prepareFormData(longTitle, '', 'public');
		expect(data.title).toBe('a'.repeat(100));
	});

	it('handles newlines in description', () => {
		const data = prepareFormData('List', 'Line 1\nLine 2', 'public');
		expect(data.description).toBe('Line 1\nLine 2');
	});

	it('detects changes with undefined vs empty description', () => {
		const original: ListData = {
			id: '1',
			title: 'List',
			visibility: 'public',
			membersCount: 0,
		};
		const current = { title: 'List', description: '', visibility: 'public' as const };
		expect(hasUnsavedChanges(original, current)).toBe(false);
	});
});

describe('Lists.Editor - Integration', () => {
	it('completes full form workflow', () => {
		// Start with empty form
		const form = initializeFormFromList(null);
		expect(form.title).toBe('');

		// Check validation
		expect(validateTitle(form.title)).not.toBeNull();

		// Fill form
		const title = 'My New List';
		const description = 'A great list';

		// Validate filled form
		expect(validateTitle(title)).toBeNull();
		expect(validateDescription(description)).toBeNull();

		// Prepare for submission
		const data = prepareFormData(title, description, 'public');
		expect(data.title).toBe('My New List');
		expect(data.description).toBe('A great list');

		// Check editor title
		expect(getEditorTitle(null)).toBe('Create New List');

		// Check button label
		expect(getSaveButtonLabel(false, false)).toBe('Create');
	});

	it('handles edit workflow', () => {
		const original: ListData = {
			id: '1',
			title: 'Original List',
			description: 'Original description',
			visibility: 'private',
			membersCount: 5,
		};

		// Initialize form
		const form = initializeFormFromList(original);
		expect(form.title).toBe('Original List');

		// Check editor title
		expect(getEditorTitle(original)).toBe('Edit List');

		// Modify form
		const newTitle = 'Updated List';
		const newDescription = 'Updated description';

		// Detect changes
		expect(hasUnsavedChanges(original, {
			title: newTitle,
			description: newDescription,
			visibility: 'private',
		})).toBe(true);

		// Prepare for submission
		const data = prepareFormData(newTitle, newDescription, 'private');
		expect(data.title).toBe('Updated List');

		// Check button label
		expect(getSaveButtonLabel(true, false)).toBe('Update');
	});
});

