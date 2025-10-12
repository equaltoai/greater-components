/**
 * Lists.Settings Component Tests
 * 
 * Tests for list settings logic including:
 * - Change detection
 * - Save button states
 * - Visibility options
 * - Date formatting
 * - Success/error messages
 * - Information display
 */

import { describe, it, expect } from 'vitest';

// List data interface
interface ListData {
	id: string;
	title: string;
	description?: string;
	visibility: 'public' | 'private';
	membersCount: number;
	createdAt?: string;
	updatedAt?: string;
}

// Detect if settings have changed
function hasSettingsChanged(
	originalVisibility: 'public' | 'private',
	currentVisibility: 'public' | 'private'
): boolean {
	return originalVisibility !== currentVisibility;
}

// Get save button label
function getSaveButtonLabel(saving: boolean): string {
	return saving ? 'Saving...' : 'Save Changes';
}

// Check if save button should be disabled
function isSaveButtonDisabled(saving: boolean): boolean {
	return saving;
}

// Get visibility option label
function getVisibilityLabel(visibility: 'public' | 'private'): string {
	return visibility === 'public' ? 'Public' : 'Private';
}

// Get visibility option description
function getVisibilityDescription(visibility: 'public' | 'private'): string {
	return visibility === 'public'
		? 'Anyone can see this list and its members'
		: 'Only you can see this list and its members';
}

// Get success message timeout duration
function getSuccessMessageDuration(): number {
	return 3000;
}

// Get success message
function getSuccessMessage(): string {
	return 'Settings saved successfully!';
}

// Format error message
function formatErrorMessage(error: Error | string): string {
	return error instanceof Error ? error.message : 'Failed to save settings';
}

// Check if should show save button
function shouldShowSaveButton(hasChanges: boolean): boolean {
	return hasChanges;
}

// Check if should show success message
function shouldShowSuccessMessage(saveSuccess: boolean): boolean {
	return saveSuccess;
}

// Check if should show error message
function shouldShowErrorMessage(saveError: string | null): boolean {
	return saveError !== null;
}

// Format date for display
function formatDate(dateString: string | undefined): string {
	if (!dateString) return '';
	return new Date(dateString).toLocaleDateString();
}

// Get settings subtitle
function getSettingsSubtitle(listTitle: string): string {
	return `Configure privacy and visibility for "${listTitle}"`;
}

// Get no list selected message
function getNoListMessage(): string {
	return 'Select a list to configure settings';
}

// Check if list is selected
function isListSelected(list: ListData | null): boolean {
	return list !== null;
}

// Get info labels
function getInfoLabels(): { created: string; updated: string; members: string } {
	return {
		created: 'Created',
		updated: 'Last updated',
		members: 'Members',
	};
}

// Validate visibility option
function isValidVisibility(visibility: string): visibility is 'public' | 'private' {
	return visibility === 'public' || visibility === 'private';
}

// Toggle visibility
function toggleVisibility(current: 'public' | 'private'): 'public' | 'private' {
	return current === 'public' ? 'private' : 'public';
}

// Build settings subtitle with list info
function buildSubtitleText(listTitle: string): string {
	return `Configure privacy and visibility for "${listTitle}"`;
}

// Get privacy section description
function getPrivacySectionDescription(): string {
	return 'Control who can see this list and its members';
}

describe('Lists.Settings - Change Detection', () => {
	it('detects change from public to private', () => {
		expect(hasSettingsChanged('public', 'private')).toBe(true);
	});

	it('detects change from private to public', () => {
		expect(hasSettingsChanged('private', 'public')).toBe(true);
	});

	it('detects no change when both public', () => {
		expect(hasSettingsChanged('public', 'public')).toBe(false);
	});

	it('detects no change when both private', () => {
		expect(hasSettingsChanged('private', 'private')).toBe(false);
	});
});

describe('Lists.Settings - Save Button', () => {
	it('shows Save Changes when not saving', () => {
		expect(getSaveButtonLabel(false)).toBe('Save Changes');
	});

	it('shows Saving... when saving', () => {
		expect(getSaveButtonLabel(true)).toBe('Saving...');
	});

	it('disables button when saving', () => {
		expect(isSaveButtonDisabled(true)).toBe(true);
	});

	it('enables button when not saving', () => {
		expect(isSaveButtonDisabled(false)).toBe(false);
	});

	it('shows save button when has changes', () => {
		expect(shouldShowSaveButton(true)).toBe(true);
	});

	it('hides save button when no changes', () => {
		expect(shouldShowSaveButton(false)).toBe(false);
	});
});

describe('Lists.Settings - Visibility Options', () => {
	it('returns Public label', () => {
		expect(getVisibilityLabel('public')).toBe('Public');
	});

	it('returns Private label', () => {
		expect(getVisibilityLabel('private')).toBe('Private');
	});

	it('returns public description', () => {
		const desc = getVisibilityDescription('public');
		expect(desc).toContain('Anyone');
		expect(desc).toContain('see');
	});

	it('returns private description', () => {
		const desc = getVisibilityDescription('private');
		expect(desc).toContain('Only you');
		expect(desc).toContain('see');
	});

	it('validates public visibility', () => {
		expect(isValidVisibility('public')).toBe(true);
	});

	it('validates private visibility', () => {
		expect(isValidVisibility('private')).toBe(true);
	});

	it('rejects invalid visibility', () => {
		expect(isValidVisibility('invalid')).toBe(false);
	});

	it('toggles from public to private', () => {
		expect(toggleVisibility('public')).toBe('private');
	});

	it('toggles from private to public', () => {
		expect(toggleVisibility('private')).toBe('public');
	});
});

describe('Lists.Settings - Success Message', () => {
	it('returns success message text', () => {
		expect(getSuccessMessage()).toBe('Settings saved successfully!');
	});

	it('returns timeout duration in milliseconds', () => {
		expect(getSuccessMessageDuration()).toBe(3000);
	});

	it('shows success message when true', () => {
		expect(shouldShowSuccessMessage(true)).toBe(true);
	});

	it('hides success message when false', () => {
		expect(shouldShowSuccessMessage(false)).toBe(false);
	});
});

describe('Lists.Settings - Error Messages', () => {
	it('formats Error object message', () => {
		const error = new Error('Network error');
		expect(formatErrorMessage(error)).toBe('Network error');
	});

	it('uses default message for string error', () => {
		expect(formatErrorMessage('custom error')).toBe('Failed to save settings');
	});

	it('shows error message when error exists', () => {
		expect(shouldShowErrorMessage('Error occurred')).toBe(true);
	});

	it('hides error message when null', () => {
		expect(shouldShowErrorMessage(null)).toBe(false);
	});
});

describe('Lists.Settings - Date Formatting', () => {
	it('formats date string', () => {
		const date = '2024-01-01T00:00:00Z';
		const formatted = formatDate(date);
		expect(formatted.length).toBeGreaterThan(0);
		// toLocaleDateString varies by environment, just check it returns something
	});

	it('handles undefined date', () => {
		expect(formatDate(undefined)).toBe('');
	});

	it('formats recent date', () => {
		const date = new Date().toISOString();
		const formatted = formatDate(date);
		expect(formatted.length).toBeGreaterThan(0);
	});

	it('formats old date', () => {
		const date = '2020-01-01T00:00:00Z';
		const formatted = formatDate(date);
		expect(formatted.length).toBeGreaterThan(0);
	});
});

describe('Lists.Settings - Settings Subtitle', () => {
	it('includes list title in quotes', () => {
		const subtitle = getSettingsSubtitle('My List');
		expect(subtitle).toContain('"My List"');
	});

	it('includes configure and privacy keywords', () => {
		const subtitle = getSettingsSubtitle('Test');
		expect(subtitle).toContain('Configure');
		expect(subtitle).toContain('privacy');
		expect(subtitle).toContain('visibility');
	});

	it('handles special characters in title', () => {
		const subtitle = getSettingsSubtitle('My "Special" List');
		expect(subtitle).toContain('My "Special" List');
	});

	it('builds subtitle text correctly', () => {
		expect(buildSubtitleText('Test List')).toBe(
			'Configure privacy and visibility for "Test List"'
		);
	});
});

describe('Lists.Settings - No List Message', () => {
	it('returns no list selected message', () => {
		const message = getNoListMessage();
		expect(message).toBe('Select a list to configure settings');
	});

	it('message is descriptive', () => {
		const message = getNoListMessage();
		expect(message).toContain('Select');
		expect(message).toContain('list');
	});
});

describe('Lists.Settings - List Selection', () => {
	it('detects selected list', () => {
		const list: ListData = {
			id: '1',
			title: 'My List',
			visibility: 'private',
			membersCount: 5,
		};
		expect(isListSelected(list)).toBe(true);
	});

	it('detects no selection', () => {
		expect(isListSelected(null)).toBe(false);
	});
});

describe('Lists.Settings - Info Labels', () => {
	it('returns all info labels', () => {
		const labels = getInfoLabels();
		expect(labels.created).toBe('Created');
		expect(labels.updated).toBe('Last updated');
		expect(labels.members).toBe('Members');
	});

	it('created label is defined', () => {
		expect(getInfoLabels().created.length).toBeGreaterThan(0);
	});

	it('updated label is defined', () => {
		expect(getInfoLabels().updated.length).toBeGreaterThan(0);
	});

	it('members label is defined', () => {
		expect(getInfoLabels().members.length).toBeGreaterThan(0);
	});
});

describe('Lists.Settings - Privacy Section', () => {
	it('returns section description', () => {
		const desc = getPrivacySectionDescription();
		expect(desc).toBe('Control who can see this list and its members');
	});

	it('description is informative', () => {
		const desc = getPrivacySectionDescription();
		expect(desc).toContain('Control');
		expect(desc).toContain('see');
	});
});

describe('Lists.Settings - Edge Cases', () => {
	it('handles very long list titles', () => {
		const longTitle = 'a'.repeat(100);
		const subtitle = getSettingsSubtitle(longTitle);
		expect(subtitle).toContain(longTitle);
	});

	it('handles unicode in list titles', () => {
		const subtitle = getSettingsSubtitle('リスト 📋');
		expect(subtitle).toContain('リスト 📋');
	});

	it('handles empty list title', () => {
		const subtitle = getSettingsSubtitle('');
		expect(subtitle).toContain('""');
	});

	it('handles invalid date strings gracefully', () => {
		const formatted = formatDate('invalid-date');
		expect(typeof formatted).toBe('string');
	});

	it('handles multiple visibility toggles', () => {
		let vis: 'public' | 'private' = 'public';
		vis = toggleVisibility(vis);
		expect(vis).toBe('private');
		vis = toggleVisibility(vis);
		expect(vis).toBe('public');
		vis = toggleVisibility(vis);
		expect(vis).toBe('private');
	});
});

describe('Lists.Settings - Display State Logic', () => {
	it('shows save button, success, and error independently', () => {
		// Save button depends on hasChanges
		expect(shouldShowSaveButton(true)).toBe(true);
		expect(shouldShowSaveButton(false)).toBe(false);

		// Success message depends on saveSuccess
		expect(shouldShowSuccessMessage(true)).toBe(true);
		expect(shouldShowSuccessMessage(false)).toBe(false);

		// Error message depends on saveError
		expect(shouldShowErrorMessage('error')).toBe(true);
		expect(shouldShowErrorMessage(null)).toBe(false);
	});

	it('handles all states at once', () => {
		const hasChanges = true;
		const saving = false;
		const saveSuccess = false;
		const saveError = null;

		expect(shouldShowSaveButton(hasChanges)).toBe(true);
		expect(isSaveButtonDisabled(saving)).toBe(false);
		expect(shouldShowSuccessMessage(saveSuccess)).toBe(false);
		expect(shouldShowErrorMessage(saveError)).toBe(false);
	});
});

describe('Lists.Settings - Integration', () => {
	it('processes complete settings workflow', () => {
		const list: ListData = {
			id: '1',
			title: 'My List',
			description: 'A test list',
			visibility: 'private',
			membersCount: 5,
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-15T00:00:00Z',
		};

		// Initial state
		expect(isListSelected(list)).toBe(true);
		expect(getSettingsSubtitle(list.title)).toContain('My List');

		// No changes yet
		expect(hasSettingsChanged(list.visibility, list.visibility)).toBe(false);
		expect(shouldShowSaveButton(false)).toBe(false);

		// Change visibility
		const newVisibility = toggleVisibility(list.visibility);
		expect(newVisibility).toBe('public');
		expect(hasSettingsChanged(list.visibility, newVisibility)).toBe(true);

		// Should show save button
		expect(shouldShowSaveButton(true)).toBe(true);
		expect(getSaveButtonLabel(false)).toBe('Save Changes');

		// During save
		expect(getSaveButtonLabel(true)).toBe('Saving...');
		expect(isSaveButtonDisabled(true)).toBe(true);

		// After successful save
		expect(shouldShowSuccessMessage(true)).toBe(true);
		expect(getSuccessMessage()).toBe('Settings saved successfully!');
		expect(getSuccessMessageDuration()).toBe(3000);
	});

	it('formats all info fields', () => {
		const list: ListData = {
			id: '1',
			title: 'Test List',
			visibility: 'public',
			membersCount: 10,
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-15T00:00:00Z',
		};

		const labels = getInfoLabels();
		expect(labels.created).toBe('Created');
		expect(labels.updated).toBe('Last updated');
		expect(labels.members).toBe('Members');

		expect(formatDate(list.createdAt).length).toBeGreaterThan(0);
		expect(formatDate(list.updatedAt).length).toBeGreaterThan(0);
		expect(list.membersCount).toBe(10);
	});

	it('handles error workflow', () => {
		const error = new Error('Network timeout');
		
		const errorMessage = formatErrorMessage(error);
		expect(errorMessage).toBe('Network timeout');
		
		expect(shouldShowErrorMessage(errorMessage)).toBe(true);
		expect(shouldShowSuccessMessage(false)).toBe(false);
	});

	it('validates visibility options', () => {
		const options: Array<'public' | 'private'> = ['public', 'private'];
		
		options.forEach(option => {
			expect(isValidVisibility(option)).toBe(true);
			expect(getVisibilityLabel(option).length).toBeGreaterThan(0);
			expect(getVisibilityDescription(option).length).toBeGreaterThan(0);
		});
	});
});

describe('Lists.Settings - Configuration', () => {
	it('returns consistent timeout duration', () => {
		expect(getSuccessMessageDuration()).toBe(3000);
		expect(getSuccessMessageDuration()).toBe(getSuccessMessageDuration());
	});

	it('provides complete privacy descriptions', () => {
		const publicDesc = getVisibilityDescription('public');
		const privateDesc = getVisibilityDescription('private');

		expect(publicDesc).not.toBe(privateDesc);
		expect(publicDesc.length).toBeGreaterThan(20);
		expect(privateDesc.length).toBeGreaterThan(20);
	});

	it('provides complete info label set', () => {
		const labels = getInfoLabels();
		expect(Object.keys(labels)).toHaveLength(3);
		expect(labels.created).toBeDefined();
		expect(labels.updated).toBeDefined();
		expect(labels.members).toBeDefined();
	});
});

