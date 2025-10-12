/**
 * Admin.Settings Component Tests
 * 
 * Tests for instance settings management including:
 * - Change detection
 * - Validation
 * - Save/reset functionality
 * - Field dependencies
 * - Limits validation
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface InstanceSettings {
	name: string;
	description: string;
	registrationOpen: boolean;
	approvalRequired: boolean;
	inviteOnly: boolean;
	maxPostLength: number;
	maxMediaAttachments: number;
}

// Detect if settings have changed
function hasSettingsChanged(
	original: InstanceSettings,
	edited: InstanceSettings
): boolean {
	return JSON.stringify(original) !== JSON.stringify(edited);
}

// Check if can save
function canSave(hasChanges: boolean, saving: boolean): boolean {
	return hasChanges && !saving;
}

// Validate name
function isValidInstanceName(name: string): boolean {
	return name.trim().length > 0 && name.length <= 100;
}

// Validate description
function isValidDescription(description: string): boolean {
	return description.length <= 500;
}

// Validate post length
function isValidPostLength(length: number): boolean {
	return length >= 280 && length <= 50000;
}

// Validate media attachments
function isValidMediaAttachments(count: number): boolean {
	return count >= 1 && count <= 10;
}

// Check if approval can be enabled
function canEnableApproval(registrationOpen: boolean): boolean {
	return registrationOpen;
}

// Check if invite only disables registration
function shouldDisableRegistration(inviteOnly: boolean): boolean {
	return inviteOnly;
}

// Get save button text
function getSaveButtonText(saving: boolean): string {
	return saving ? 'Saving...' : 'Save Changes';
}

// Check if should show save bar
function shouldShowSaveBar(hasChanges: boolean): boolean {
	return hasChanges;
}

// Check if should disable reset
function shouldDisableReset(saving: boolean): boolean {
	return saving;
}

// Validate all settings
function validateSettings(settings: InstanceSettings): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!isValidInstanceName(settings.name)) {
		errors.push('Instance name must be 1-100 characters');
	}

	if (!isValidDescription(settings.description)) {
		errors.push('Description must be 500 characters or less');
	}

	if (!isValidPostLength(settings.maxPostLength)) {
		errors.push('Post length must be between 280 and 50,000');
	}

	if (!isValidMediaAttachments(settings.maxMediaAttachments)) {
		errors.push('Media attachments must be between 1 and 10');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

// Get recommended post length
function getRecommendedPostLength(type: 'short' | 'medium' | 'long'): number {
	const recommendations = {
		short: 280,
		medium: 500,
		long: 5000,
	};
	return recommendations[type];
}

// Check if settings are dangerous
function hasDangerousSettings(settings: InstanceSettings): boolean {
	return (
		settings.registrationOpen &&
		!settings.approvalRequired &&
		!settings.inviteOnly
	);
}

// Get registration mode
function getRegistrationMode(
	settings: InstanceSettings
): 'open' | 'approval' | 'invite' | 'closed' {
	if (settings.inviteOnly) return 'invite';
	if (!settings.registrationOpen) return 'closed';
	if (settings.approvalRequired) return 'approval';
	return 'open';
}

// Calculate character limit percentage
function getPostLengthPercentage(current: number, max: number = 50000): number {
	return Math.round((current / max) * 100);
}

// Check if post length is generous
function isGenerousPostLength(length: number): boolean {
	return length >= 5000;
}

// Check if media limit is generous
function isGenerousMediaLimit(count: number): boolean {
	return count >= 4;
}

// Clone settings
function cloneSettings(settings: InstanceSettings): InstanceSettings {
	return { ...settings };
}

// Apply defaults
function applyDefaultSettings(): InstanceSettings {
	return {
		name: '',
		description: '',
		registrationOpen: false,
		approvalRequired: true,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};
}

// Check if field is disabled
function isFieldDisabled(
	field: 'approvalRequired',
	settings: InstanceSettings
): boolean {
	if (field === 'approvalRequired') {
		return !settings.registrationOpen;
	}
	return false;
}

describe('Admin.Settings - Change Detection', () => {
	const originalSettings: InstanceSettings = {
		name: 'My Instance',
		description: 'A great instance',
		registrationOpen: true,
		approvalRequired: false,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};

	it('detects no changes when identical', () => {
		const edited = { ...originalSettings };
		expect(hasSettingsChanged(originalSettings, edited)).toBe(false);
	});

	it('detects name change', () => {
		const edited = { ...originalSettings, name: 'New Name' };
		expect(hasSettingsChanged(originalSettings, edited)).toBe(true);
	});

	it('detects description change', () => {
		const edited = { ...originalSettings, description: 'New description' };
		expect(hasSettingsChanged(originalSettings, edited)).toBe(true);
	});

	it('detects boolean changes', () => {
		const edited = { ...originalSettings, registrationOpen: false };
		expect(hasSettingsChanged(originalSettings, edited)).toBe(true);
	});

	it('detects number changes', () => {
		const edited = { ...originalSettings, maxPostLength: 1000 };
		expect(hasSettingsChanged(originalSettings, edited)).toBe(true);
	});
});

describe('Admin.Settings - Save Logic', () => {
	it('can save with changes and not saving', () => {
		expect(canSave(true, false)).toBe(true);
	});

	it('cannot save without changes', () => {
		expect(canSave(false, false)).toBe(false);
	});

	it('cannot save while saving', () => {
		expect(canSave(true, true)).toBe(false);
	});

	it('gets save button text', () => {
		expect(getSaveButtonText(false)).toBe('Save Changes');
		expect(getSaveButtonText(true)).toBe('Saving...');
	});
});

describe('Admin.Settings - Name Validation', () => {
	it('validates valid names', () => {
		expect(isValidInstanceName('My Instance')).toBe(true);
		expect(isValidInstanceName('A')).toBe(true);
	});

	it('invalidates empty name', () => {
		expect(isValidInstanceName('')).toBe(false);
		expect(isValidInstanceName('   ')).toBe(false);
	});

	it('invalidates too long names', () => {
		const longName = 'A'.repeat(101);
		expect(isValidInstanceName(longName)).toBe(false);
	});

	it('validates name at max length', () => {
		const maxName = 'A'.repeat(100);
		expect(isValidInstanceName(maxName)).toBe(true);
	});
});

describe('Admin.Settings - Description Validation', () => {
	it('validates valid descriptions', () => {
		expect(isValidDescription('A great instance')).toBe(true);
		expect(isValidDescription('')).toBe(true); // Empty is ok
	});

	it('validates description at max length', () => {
		const maxDesc = 'A'.repeat(500);
		expect(isValidDescription(maxDesc)).toBe(true);
	});

	it('invalidates too long description', () => {
		const longDesc = 'A'.repeat(501);
		expect(isValidDescription(longDesc)).toBe(false);
	});
});

describe('Admin.Settings - Post Length Validation', () => {
	it('validates valid lengths', () => {
		expect(isValidPostLength(280)).toBe(true);
		expect(isValidPostLength(500)).toBe(true);
		expect(isValidPostLength(5000)).toBe(true);
		expect(isValidPostLength(50000)).toBe(true);
	});

	it('invalidates too short', () => {
		expect(isValidPostLength(279)).toBe(false);
		expect(isValidPostLength(100)).toBe(false);
	});

	it('invalidates too long', () => {
		expect(isValidPostLength(50001)).toBe(false);
		expect(isValidPostLength(100000)).toBe(false);
	});
});

describe('Admin.Settings - Media Attachments Validation', () => {
	it('validates valid counts', () => {
		expect(isValidMediaAttachments(1)).toBe(true);
		expect(isValidMediaAttachments(4)).toBe(true);
		expect(isValidMediaAttachments(10)).toBe(true);
	});

	it('invalidates too few', () => {
		expect(isValidMediaAttachments(0)).toBe(false);
		expect(isValidMediaAttachments(-1)).toBe(false);
	});

	it('invalidates too many', () => {
		expect(isValidMediaAttachments(11)).toBe(false);
		expect(isValidMediaAttachments(100)).toBe(false);
	});
});

describe('Admin.Settings - Field Dependencies', () => {
	it('allows approval when registration open', () => {
		expect(canEnableApproval(true)).toBe(true);
	});

	it('disallows approval when registration closed', () => {
		expect(canEnableApproval(false)).toBe(false);
	});

	it('disables registration field when invite only', () => {
		expect(shouldDisableRegistration(true)).toBe(true);
		expect(shouldDisableRegistration(false)).toBe(false);
	});
});

describe('Admin.Settings - Complete Validation', () => {
	const validSettings: InstanceSettings = {
		name: 'My Instance',
		description: 'A great instance',
		registrationOpen: true,
		approvalRequired: false,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};

	it('validates correct settings', () => {
		const result = validateSettings(validSettings);
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('detects invalid name', () => {
		const invalid = { ...validSettings, name: '' };
		const result = validateSettings(invalid);
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.includes('name'))).toBe(true);
	});

	it('detects invalid description', () => {
		const invalid = { ...validSettings, description: 'A'.repeat(501) };
		const result = validateSettings(invalid);
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.includes('Description'))).toBe(true);
	});

	it('detects invalid post length', () => {
		const invalid = { ...validSettings, maxPostLength: 100 };
		const result = validateSettings(invalid);
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.includes('Post length'))).toBe(true);
	});

	it('detects multiple errors', () => {
		const invalid: InstanceSettings = {
			name: '',
			description: 'A'.repeat(501),
			registrationOpen: true,
			approvalRequired: false,
			inviteOnly: false,
			maxPostLength: 100,
			maxMediaAttachments: 0,
		};
		const result = validateSettings(invalid);
		expect(result.valid).toBe(false);
		expect(result.errors.length).toBeGreaterThan(1);
	});
});

describe('Admin.Settings - Recommended Values', () => {
	it('gets recommended post lengths', () => {
		expect(getRecommendedPostLength('short')).toBe(280);
		expect(getRecommendedPostLength('medium')).toBe(500);
		expect(getRecommendedPostLength('long')).toBe(5000);
	});
});

describe('Admin.Settings - Safety Checks', () => {
	it('detects dangerous open registration', () => {
		const dangerous: InstanceSettings = {
			name: 'Test',
			description: 'Test',
			registrationOpen: true,
			approvalRequired: false,
			inviteOnly: false,
			maxPostLength: 500,
			maxMediaAttachments: 4,
		};
		expect(hasDangerousSettings(dangerous)).toBe(true);
	});

	it('detects safe settings with approval', () => {
		const safe: InstanceSettings = {
			name: 'Test',
			description: 'Test',
			registrationOpen: true,
			approvalRequired: true,
			inviteOnly: false,
			maxPostLength: 500,
			maxMediaAttachments: 4,
		};
		expect(hasDangerousSettings(safe)).toBe(false);
	});

	it('detects safe closed registration', () => {
		const safe: InstanceSettings = {
			name: 'Test',
			description: 'Test',
			registrationOpen: false,
			approvalRequired: false,
			inviteOnly: false,
			maxPostLength: 500,
			maxMediaAttachments: 4,
		};
		expect(hasDangerousSettings(safe)).toBe(false);
	});
});

describe('Admin.Settings - Registration Mode', () => {
	const baseSettings: InstanceSettings = {
		name: 'Test',
		description: 'Test',
		registrationOpen: false,
		approvalRequired: false,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};

	it('detects open registration', () => {
		const settings = { ...baseSettings, registrationOpen: true };
		expect(getRegistrationMode(settings)).toBe('open');
	});

	it('detects approval mode', () => {
		const settings = {
			...baseSettings,
			registrationOpen: true,
			approvalRequired: true,
		};
		expect(getRegistrationMode(settings)).toBe('approval');
	});

	it('detects invite only', () => {
		const settings = { ...baseSettings, inviteOnly: true };
		expect(getRegistrationMode(settings)).toBe('invite');
	});

	it('detects closed registration', () => {
		const settings = { ...baseSettings, registrationOpen: false };
		expect(getRegistrationMode(settings)).toBe('closed');
	});

	it('prioritizes invite only', () => {
		const settings = {
			...baseSettings,
			registrationOpen: true,
			approvalRequired: true,
			inviteOnly: true,
		};
		expect(getRegistrationMode(settings)).toBe('invite');
	});
});

describe('Admin.Settings - Post Length Analysis', () => {
	it('calculates percentage of max', () => {
		expect(getPostLengthPercentage(500, 50000)).toBe(1);
		expect(getPostLengthPercentage(5000, 50000)).toBe(10);
		expect(getPostLengthPercentage(25000, 50000)).toBe(50);
	});

	it('detects generous lengths', () => {
		expect(isGenerousPostLength(5000)).toBe(true);
		expect(isGenerousPostLength(10000)).toBe(true);
		expect(isGenerousPostLength(500)).toBe(false);
	});
});

describe('Admin.Settings - Media Limit Analysis', () => {
	it('detects generous media limits', () => {
		expect(isGenerousMediaLimit(4)).toBe(true);
		expect(isGenerousMediaLimit(10)).toBe(true);
		expect(isGenerousMediaLimit(1)).toBe(false);
		expect(isGenerousMediaLimit(2)).toBe(false);
	});
});

describe('Admin.Settings - UI State', () => {
	it('shows save bar when has changes', () => {
		expect(shouldShowSaveBar(true)).toBe(true);
		expect(shouldShowSaveBar(false)).toBe(false);
	});

	it('disables reset while saving', () => {
		expect(shouldDisableReset(true)).toBe(true);
		expect(shouldDisableReset(false)).toBe(false);
	});
});

describe('Admin.Settings - Settings Cloning', () => {
	const original: InstanceSettings = {
		name: 'Original',
		description: 'Test',
		registrationOpen: true,
		approvalRequired: false,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};

	it('creates independent copy', () => {
		const cloned = cloneSettings(original);
		expect(cloned).toEqual(original);
		expect(cloned).not.toBe(original);
	});

	it('does not affect original when modified', () => {
		const cloned = cloneSettings(original);
		cloned.name = 'Modified';
		expect(original.name).toBe('Original');
	});
});

describe('Admin.Settings - Default Settings', () => {
	it('applies safe defaults', () => {
		const defaults = applyDefaultSettings();
		expect(defaults.registrationOpen).toBe(false);
		expect(defaults.approvalRequired).toBe(true);
		expect(defaults.maxPostLength).toBeGreaterThanOrEqual(280);
		expect(defaults.maxMediaAttachments).toBeGreaterThanOrEqual(1);
	});

	it('has valid default values', () => {
		const defaults = applyDefaultSettings();
		const validation = validateSettings(defaults);
		// Name and description can be empty in defaults
		const relevantErrors = validation.errors.filter(
			(e) => !e.includes('name') && !e.includes('Description')
		);
		expect(relevantErrors).toHaveLength(0);
	});
});

describe('Admin.Settings - Field Disabled State', () => {
	const openReg: InstanceSettings = {
		name: 'Test',
		description: 'Test',
		registrationOpen: true,
		approvalRequired: false,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};

	const closedReg: InstanceSettings = {
		...openReg,
		registrationOpen: false,
	};

	it('enables approval field when registration open', () => {
		expect(isFieldDisabled('approvalRequired', openReg)).toBe(false);
	});

	it('disables approval field when registration closed', () => {
		expect(isFieldDisabled('approvalRequired', closedReg)).toBe(true);
	});
});

describe('Admin.Settings - Edge Cases', () => {
	it('handles very long but valid description', () => {
		const longDesc = 'A'.repeat(500);
		expect(isValidDescription(longDesc)).toBe(true);
	});

	it('handles special characters in name', () => {
		expect(isValidInstanceName('My Instance! 🎉')).toBe(true);
	});

	it('handles edge post lengths', () => {
		expect(isValidPostLength(280)).toBe(true);
		expect(isValidPostLength(50000)).toBe(true);
	});

	it('handles edge media counts', () => {
		expect(isValidMediaAttachments(1)).toBe(true);
		expect(isValidMediaAttachments(10)).toBe(true);
	});
});

describe('Admin.Settings - Integration', () => {
	const originalSettings: InstanceSettings = {
		name: 'My Instance',
		description: 'A great instance',
		registrationOpen: false,
		approvalRequired: true,
		inviteOnly: false,
		maxPostLength: 500,
		maxMediaAttachments: 4,
	};

	it('handles complete edit flow', () => {
		// Clone for editing
		const edited = cloneSettings(originalSettings);

		// No changes yet
		expect(hasSettingsChanged(originalSettings, edited)).toBe(false);
		expect(canSave(false, false)).toBe(false);

		// Make changes
		edited.name = 'New Name';
		edited.registrationOpen = true;

		// Detect changes
		expect(hasSettingsChanged(originalSettings, edited)).toBe(true);
		expect(canSave(true, false)).toBe(true);

		// Validate
		const validation = validateSettings(edited);
		expect(validation.valid).toBe(true);

		// Check registration mode
		expect(getRegistrationMode(edited)).toBe('approval');
	});

	it('handles dangerous settings detection and correction', () => {
		const settings = cloneSettings(originalSettings);
		settings.registrationOpen = true;
		settings.approvalRequired = false;

		// Detect dangerous
		expect(hasDangerousSettings(settings)).toBe(true);
		expect(getRegistrationMode(settings)).toBe('open');

		// Correct by enabling approval
		settings.approvalRequired = true;
		expect(hasDangerousSettings(settings)).toBe(false);
		expect(getRegistrationMode(settings)).toBe('approval');
	});

	it('handles validation and save flow', () => {
		const settings = cloneSettings(originalSettings);

		// Make changes
		settings.maxPostLength = 1000;
		settings.maxMediaAttachments = 8;

		// Validate
		const validation = validateSettings(settings);
		expect(validation.valid).toBe(true);

		// Check if changes and can save
		expect(hasSettingsChanged(originalSettings, settings)).toBe(true);
		expect(canSave(true, false)).toBe(true);

		// Simulate saving
		const saving = true;
		expect(canSave(true, saving)).toBe(false);
		expect(shouldDisableReset(saving)).toBe(true);
		expect(getSaveButtonText(saving)).toBe('Saving...');
	});
});

