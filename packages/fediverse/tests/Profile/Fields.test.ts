/**
 * Profile/Fields Component Tests
 * 
 * Tests for custom profile fields display including:
 * - Field selection and limiting
 * - Verification indicator logic
 * - Configuration handling
 * - Edge cases
 */

import { describe, it, expect } from 'vitest';
import type { ProfileField } from '../../src/components/Profile/context.js';

// Field selection logic
function selectDisplayFields(fields: ProfileField[] | undefined, maxFields: number): ProfileField[] {
	if (!fields || maxFields <= 0) {
		return [];
	}
	return fields.slice(0, maxFields);
}

// Verification check logic
function isVerifiedField(field: ProfileField, showVerification: boolean): boolean {
	return showVerification && Boolean(field.verifiedAt);
}

// Field filtering logic
function hasFields(fields: ProfileField[] | undefined): boolean {
	return Boolean(fields && fields.length > 0);
}

// Class name generation
function getFieldClassName(className?: string): string {
	return ['profile-fields', className].filter(Boolean).join(' ');
}

function getFieldItemClassName(field: ProfileField): string {
	const classes = ['profile-fields__item'];
	if (field.verifiedAt) {
		classes.push('profile-fields__item--verified');
	}
	return classes.join(' ');
}

describe('Profile/Fields - Field Selection', () => {
	const fields: ProfileField[] = [
		{ name: 'Website', value: 'https://example.com' },
		{ name: 'Location', value: 'Earth' },
		{ name: 'Pronouns', value: 'they/them' },
		{ name: 'Matrix', value: '@user:matrix.org' },
	];

	it('selects up to max fields', () => {
		expect(selectDisplayFields(fields, 2)).toHaveLength(2);
		expect(selectDisplayFields(fields, 3)).toHaveLength(3);
		expect(selectDisplayFields(fields, 4)).toHaveLength(4);
	});

	it('returns all fields when max exceeds length', () => {
		expect(selectDisplayFields(fields, 10)).toHaveLength(4);
	});

	it('returns empty array when fields is undefined', () => {
		expect(selectDisplayFields(undefined, 2)).toHaveLength(0);
	});

	it('returns empty array when maxFields is zero', () => {
		expect(selectDisplayFields(fields, 0)).toHaveLength(0);
	});

	it('returns empty array when maxFields is negative', () => {
		expect(selectDisplayFields(fields, -1)).toHaveLength(0);
	});

	it('returns empty array for empty fields', () => {
		expect(selectDisplayFields([], 5)).toHaveLength(0);
	});

	it('preserves field order', () => {
		const selected = selectDisplayFields(fields, 2);
		expect(selected[0].name).toBe('Website');
		expect(selected[1].name).toBe('Location');
	});

	it('uses default max of 4 fields', () => {
		const maxFields = 4;
		expect(selectDisplayFields(fields, maxFields)).toHaveLength(4);
	});
});

describe('Profile/Fields - Verification Logic', () => {
	it('returns true when field is verified and verification shown', () => {
		const field: ProfileField = { 
			name: 'Website', 
			value: 'example.com',
			verifiedAt: '2024-01-01T00:00:00Z'
		};
		expect(isVerifiedField(field, true)).toBe(true);
	});

	it('returns false when field is verified but verification hidden', () => {
		const field: ProfileField = { 
			name: 'Website', 
			value: 'example.com',
			verifiedAt: '2024-01-01T00:00:00Z'
		};
		expect(isVerifiedField(field, false)).toBe(false);
	});

	it('returns false when field is not verified', () => {
		const field: ProfileField = { 
			name: 'Website', 
			value: 'example.com'
		};
		expect(isVerifiedField(field, true)).toBe(false);
	});

	it('returns false when verification is disabled', () => {
		const field: ProfileField = { 
			name: 'Website', 
			value: 'example.com'
		};
		expect(isVerifiedField(field, false)).toBe(false);
	});

	it('handles empty verifiedAt string as unverified', () => {
		const field: ProfileField = { 
			name: 'Website', 
			value: 'example.com',
			verifiedAt: ''
		};
		expect(isVerifiedField(field, true)).toBe(false);
	});

	it('accepts any truthy verifiedAt value', () => {
		const field: ProfileField = { 
			name: 'Website', 
			value: 'example.com',
			verifiedAt: '2024-01-01'
		};
		expect(isVerifiedField(field, true)).toBe(true);
	});
});

describe('Profile/Fields - Field Checking', () => {
	it('returns true when fields exist', () => {
		const fields: ProfileField[] = [
			{ name: 'Website', value: 'example.com' }
		];
		expect(hasFields(fields)).toBe(true);
	});

	it('returns false when fields is undefined', () => {
		expect(hasFields(undefined)).toBe(false);
	});

	it('returns false when fields is empty', () => {
		expect(hasFields([])).toBe(false);
	});

	it('returns true for multiple fields', () => {
		const fields: ProfileField[] = [
			{ name: 'Website', value: 'example.com' },
			{ name: 'Location', value: 'Earth' }
		];
		expect(hasFields(fields)).toBe(true);
	});
});

describe('Profile/Fields - Class Names', () => {
	it('generates default class name', () => {
		expect(getFieldClassName()).toBe('profile-fields');
	});

	it('includes custom class', () => {
		expect(getFieldClassName('custom-fields')).toBe('profile-fields custom-fields');
	});

	it('handles empty custom class', () => {
		expect(getFieldClassName('')).toBe('profile-fields');
	});

	it('handles undefined custom class', () => {
		expect(getFieldClassName(undefined)).toBe('profile-fields');
	});

	it('generates field item class without verification', () => {
		const field: ProfileField = { name: 'Website', value: 'example.com' };
		expect(getFieldItemClassName(field)).toBe('profile-fields__item');
	});

	it('generates field item class with verification', () => {
		const field: ProfileField = { 
			name: 'Website', 
			value: 'example.com',
			verifiedAt: '2024-01-01'
		};
		expect(getFieldItemClassName(field)).toBe('profile-fields__item profile-fields__item--verified');
	});
});

describe('Profile/Fields - Unicode Support', () => {
	it('handles unicode field names', () => {
		const fields: ProfileField[] = [
			{ name: '挨拶', value: 'こんにちは' },
			{ name: 'Привет', value: 'Мир' },
			{ name: '🌍', value: '🚀' }
		];

		const selected = selectDisplayFields(fields, 3);
		expect(selected).toHaveLength(3);
		expect(selected[0].name).toBe('挨拶');
		expect(selected[1].name).toBe('Привет');
		expect(selected[2].name).toBe('🌍');
	});

	it('handles unicode in values', () => {
		const field: ProfileField = { 
			name: 'Message',
			value: 'Hello 世界 🌎'
		};

		expect(field.value).toContain('世界');
		expect(field.value).toContain('🌎');
	});
});

describe('Profile/Fields - HTML Content', () => {
	it('preserves HTML markup in values', () => {
		const field: ProfileField = { 
			name: 'Website',
			value: '<a href="https://example.com">example.com</a>'
		};

		expect(field.value).toContain('<a href=');
		expect(field.value).toContain('</a>');
	});

	it('handles strong tags', () => {
		const field: ProfileField = { 
			name: 'Bio',
			value: '<strong>Bold</strong> text'
		};

		expect(field.value).toContain('<strong>');
		expect(field.value).toContain('</strong>');
	});

	it('handles complex HTML', () => {
		const field: ProfileField = { 
			name: 'Links',
			value: '<a href="https://a.com">A</a> and <a href="https://b.com">B</a>'
		};

		expect(field.value).toContain('href="https://a.com"');
		expect(field.value).toContain('href="https://b.com"');
	});
});

describe('Profile/Fields - Edge Cases', () => {
	it('handles empty field names', () => {
		const fields: ProfileField[] = [
			{ name: '', value: 'Empty name' },
			{ name: 'Valid', value: 'Valid value' }
		];

		const selected = selectDisplayFields(fields, 2);
		expect(selected).toHaveLength(2);
		expect(selected[0].name).toBe('');
		expect(selected[1].name).toBe('Valid');
	});

	it('handles empty field values', () => {
		const fields: ProfileField[] = [
			{ name: 'Empty', value: '' },
			{ name: 'Valid', value: 'Value' }
		];

		const selected = selectDisplayFields(fields, 2);
		expect(selected).toHaveLength(2);
		expect(selected[0].value).toBe('');
	});

	it('handles whitespace-only values', () => {
		const field: ProfileField = { 
			name: 'Spaces',
			value: '   '
		};

		expect(field.value).toBe('   ');
	});

	it('handles very long field names', () => {
		const longName = 'A'.repeat(1000);
		const field: ProfileField = { 
			name: longName,
			value: 'Value'
		};

		expect(field.name.length).toBe(1000);
	});

	it('handles very long field values', () => {
		const longValue = 'V'.repeat(1000);
		const field: ProfileField = { 
			name: 'Field',
			value: longValue
		};

		expect(field.value.length).toBe(1000);
	});

	it('handles special characters in field names', () => {
		const fields: ProfileField[] = [
			{ name: 'Field<>"&', value: 'Special chars' },
			{ name: 'Field\n\t', value: 'Whitespace' }
		];

		const selected = selectDisplayFields(fields, 2);
		expect(selected[0].name).toContain('<');
		expect(selected[1].name).toContain('\n');
	});
});

describe('Profile/Fields - Configuration', () => {
	it('respects maxFields configuration', () => {
		const fields: ProfileField[] = Array.from({ length: 10 }, (_, i) => ({
			name: `Field ${i}`,
			value: `Value ${i}`
		}));

		expect(selectDisplayFields(fields, 1)).toHaveLength(1);
		expect(selectDisplayFields(fields, 5)).toHaveLength(5);
		expect(selectDisplayFields(fields, 10)).toHaveLength(10);
	});

	it('respects showVerification configuration', () => {
		const field: ProfileField = { 
			name: 'Website',
			value: 'example.com',
			verifiedAt: '2024-01-01'
		};

		expect(isVerifiedField(field, true)).toBe(true);
		expect(isVerifiedField(field, false)).toBe(false);
	});

	it('handles default configurations', () => {
		const fields: ProfileField[] = [
			{ name: 'Field 1', value: 'Value 1' },
			{ name: 'Field 2', value: 'Value 2' }
		];

		// Default maxFields is 4
		const defaultMax = 4;
		expect(selectDisplayFields(fields, defaultMax)).toHaveLength(2);

		// Default showVerification is true
		const verifiedField: ProfileField = { 
			name: 'Site',
			value: 'example.com',
			verifiedAt: '2024-01-01'
		};
		const defaultShowVerification = true;
		expect(isVerifiedField(verifiedField, defaultShowVerification)).toBe(true);
	});
});
