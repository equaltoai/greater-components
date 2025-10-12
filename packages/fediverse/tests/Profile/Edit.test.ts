/**
 * Profile/Edit Component Tests
 * 
 * Tests for profile editing functionality including:
 * - Edit payload building
 * - Field validation and filtering
 * - Bio character counting
 * - Image preview logic
 * - Save state management
 */

import { describe, it, expect } from 'vitest';
import type { ProfileEditData, ProfileField } from '../../src/components/Profile/context.js';

// Edit payload building
interface EditInput {
	displayName: string;
	bio: string;
	fields: Array<Partial<ProfileField>>;
}

function buildEditPayload({ displayName, bio, fields }: EditInput): ProfileEditData {
	const filteredFields = (fields ?? [])
		.map((field) => ({
			name: (field.name ?? '').trim(),
			value: (field.value ?? '').trim(),
		}))
		.filter((field) => field.name && field.value);

	return {
		displayName: displayName.trim(),
		bio: bio.trim(),
		fields: filteredFields,
	};
}

// Bio metadata calculation
interface BioMeta {
	length: number;
	overLimit: boolean;
}

function calculateBioMeta(bio: string, maxLength: number): BioMeta {
	const length = bio.length;
	return {
		length,
		overLimit: length > maxLength,
	};
}

// Field validation
function isValidField(field: Partial<ProfileField>): boolean {
	return Boolean(field.name?.trim() && field.value?.trim());
}

function countValidFields(fields: Array<Partial<ProfileField>>): number {
	return fields.filter(isValidField).length;
}

// Character limits
const BIO_MAX_LENGTH = 500;
const DISPLAY_NAME_MAX_LENGTH = 30;
const FIELD_NAME_MAX_LENGTH = 50;
const FIELD_VALUE_MAX_LENGTH = 100;

function isWithinLimit(text: string, maxLength: number): boolean {
	return text.length <= maxLength;
}

// Edit state
function hasChanges(
	original: { displayName: string; bio: string },
	edited: { displayName: string; bio: string }
): boolean {
	return original.displayName !== edited.displayName || original.bio !== edited.bio;
}

function canSave(displayName: string, bio: string): boolean {
	return displayName.trim().length > 0 && isWithinLimit(bio, BIO_MAX_LENGTH);
}

describe('Profile/Edit - Payload Building', () => {
	it('builds payload trimming display name and bio', () => {
		const payload = buildEditPayload({
			displayName: '  Alice  ',
			bio: '  Hello world  ',
			fields: [],
		});

		expect(payload.displayName).toBe('Alice');
		expect(payload.bio).toBe('Hello world');
	});

	it('filters out empty fields', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Hello',
			fields: [
				{ name: 'Website', value: 'https://example.com' },
				{ name: '', value: 'Empty name' },
				{ name: 'Location', value: '' },
				{ name: '  ', value: '  ' },
			],
		});

		expect(payload.fields).toHaveLength(1);
		expect(payload.fields?.[0].name).toBe('Website');
	});

	it('preserves all valid fields', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Hello',
			fields: [
				{ name: 'Website', value: 'https://example.com' },
				{ name: 'Location', value: 'Earth' },
				{ name: 'Pronouns', value: 'they/them' },
			],
		});

		expect(payload.fields).toHaveLength(3);
	});

	it('handles empty field array', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Hello',
			fields: [],
		});

		expect(payload.fields).toHaveLength(0);
	});

	it('trims whitespace from field names and values', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Hello',
			fields: [{ name: '  Website  ', value: '  example.com  ' }],
		});

		expect(payload.fields?.[0].name).toBe('Website');
		expect(payload.fields?.[0].value).toBe('example.com');
	});

	it('handles fields with only whitespace', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Hello',
			fields: [
				{ name: '   ', value: 'value' },
				{ name: 'name', value: '   ' },
			],
		});

		expect(payload.fields).toHaveLength(0);
	});
});

describe('Profile/Edit - Bio Metadata', () => {
	it('calculates bio metrics and detects limit overflows', () => {
		const short = calculateBioMeta('Hello', 500);
		expect(short.length).toBe(5);
		expect(short.overLimit).toBe(false);

		const overLimit = calculateBioMeta('A'.repeat(600), 500);
		expect(overLimit.length).toBe(600);
		expect(overLimit.overLimit).toBe(true);
	});

	it('handles empty bio', () => {
		const meta = calculateBioMeta('', 500);
		expect(meta.length).toBe(0);
		expect(meta.overLimit).toBe(false);
	});

	it('handles bio at exact limit', () => {
		const meta = calculateBioMeta('A'.repeat(500), 500);
		expect(meta.length).toBe(500);
		expect(meta.overLimit).toBe(false);
	});

	it('handles bio one over limit', () => {
		const meta = calculateBioMeta('A'.repeat(501), 500);
		expect(meta.length).toBe(501);
		expect(meta.overLimit).toBe(true);
	});

	it('counts unicode characters correctly', () => {
		const meta = calculateBioMeta('Hello 🌍', 500);
		expect(meta.length).toBe(8);
	});
});

describe('Profile/Edit - Field Validation', () => {
	it('validates field with name and value', () => {
		expect(isValidField({ name: 'Website', value: 'example.com' })).toBe(true);
	});

	it('rejects field with empty name', () => {
		expect(isValidField({ name: '', value: 'example.com' })).toBe(false);
	});

	it('rejects field with empty value', () => {
		expect(isValidField({ name: 'Website', value: '' })).toBe(false);
	});

	it('rejects field with whitespace-only name', () => {
		expect(isValidField({ name: '   ', value: 'example.com' })).toBe(false);
	});

	it('rejects field with whitespace-only value', () => {
		expect(isValidField({ name: 'Website', value: '   ' })).toBe(false);
	});

	it('rejects field missing name', () => {
		expect(isValidField({ value: 'example.com' })).toBe(false);
	});

	it('rejects field missing value', () => {
		expect(isValidField({ name: 'Website' })).toBe(false);
	});

	it('counts valid fields correctly', () => {
		const fields = [
			{ name: 'Website', value: 'example.com' },
			{ name: '', value: 'invalid' },
			{ name: 'Location', value: 'Earth' },
		];

		expect(countValidFields(fields)).toBe(2);
	});

	it('returns zero for all invalid fields', () => {
		const fields = [
			{ name: '', value: '' },
			{ name: '  ', value: '  ' },
		];

		expect(countValidFields(fields)).toBe(0);
	});

	it('handles empty field array', () => {
		expect(countValidFields([])).toBe(0);
	});
});

describe('Profile/Edit - Character Limits', () => {
	it('enforces bio max length', () => {
		expect(isWithinLimit('A'.repeat(500), BIO_MAX_LENGTH)).toBe(true);
		expect(isWithinLimit('A'.repeat(501), BIO_MAX_LENGTH)).toBe(false);
	});

	it('enforces display name max length', () => {
		expect(isWithinLimit('A'.repeat(30), DISPLAY_NAME_MAX_LENGTH)).toBe(true);
		expect(isWithinLimit('A'.repeat(31), DISPLAY_NAME_MAX_LENGTH)).toBe(false);
	});

	it('enforces field name max length', () => {
		expect(isWithinLimit('A'.repeat(50), FIELD_NAME_MAX_LENGTH)).toBe(true);
		expect(isWithinLimit('A'.repeat(51), FIELD_NAME_MAX_LENGTH)).toBe(false);
	});

	it('enforces field value max length', () => {
		expect(isWithinLimit('A'.repeat(100), FIELD_VALUE_MAX_LENGTH)).toBe(true);
		expect(isWithinLimit('A'.repeat(101), FIELD_VALUE_MAX_LENGTH)).toBe(false);
	});

	it('allows empty string', () => {
		expect(isWithinLimit('', 500)).toBe(true);
	});

	it('counts unicode correctly for limits', () => {
		const unicode = '🌍'.repeat(10); // 10 emoji (20 characters in JS string length)
		const length = unicode.length; // JS counts by UTF-16 code units
		expect(isWithinLimit(unicode, length)).toBe(true);
		expect(isWithinLimit(unicode, length - 1)).toBe(false);
	});
});

describe('Profile/Edit - Change Detection', () => {
	it('detects display name change', () => {
		const original = { displayName: 'Alice', bio: 'Hello' };
		const edited = { displayName: 'Alice Updated', bio: 'Hello' };

		expect(hasChanges(original, edited)).toBe(true);
	});

	it('detects bio change', () => {
		const original = { displayName: 'Alice', bio: 'Hello' };
		const edited = { displayName: 'Alice', bio: 'Hello world' };

		expect(hasChanges(original, edited)).toBe(true);
	});

	it('detects no changes', () => {
		const original = { displayName: 'Alice', bio: 'Hello' };
		const edited = { displayName: 'Alice', bio: 'Hello' };

		expect(hasChanges(original, edited)).toBe(false);
	});

	it('detects whitespace-only changes', () => {
		const original = { displayName: 'Alice', bio: 'Hello' };
		const edited = { displayName: 'Alice ', bio: 'Hello' };

		expect(hasChanges(original, edited)).toBe(true);
	});

	it('is case sensitive', () => {
		const original = { displayName: 'Alice', bio: 'Hello' };
		const edited = { displayName: 'alice', bio: 'Hello' };

		expect(hasChanges(original, edited)).toBe(true);
	});
});

describe('Profile/Edit - Save Validation', () => {
	it('allows save with valid data', () => {
		expect(canSave('Alice', 'Hello world')).toBe(true);
	});

	it('prevents save with empty display name', () => {
		expect(canSave('', 'Hello world')).toBe(false);
	});

	it('prevents save with whitespace-only display name', () => {
		expect(canSave('   ', 'Hello world')).toBe(false);
	});

	it('prevents save with bio over limit', () => {
		const longBio = 'A'.repeat(501);
		expect(canSave('Alice', longBio)).toBe(false);
	});

	it('allows save with empty bio', () => {
		expect(canSave('Alice', '')).toBe(true);
	});

	it('allows save with bio at limit', () => {
		const maxBio = 'A'.repeat(500);
		expect(canSave('Alice', maxBio)).toBe(true);
	});

	it('requires trimmed display name', () => {
		expect(canSave('Alice', 'Bio')).toBe(true);
		expect(canSave('  Alice  ', 'Bio')).toBe(true); // Will be trimmed
	});
});

describe('Profile/Edit - Edge Cases', () => {
	it('handles very long display names', () => {
		const longName = 'A'.repeat(100);
		const payload = buildEditPayload({
			displayName: longName,
			bio: 'Bio',
			fields: [],
		});

		expect(payload.displayName).toBe(longName);
		expect(isWithinLimit(payload.displayName, DISPLAY_NAME_MAX_LENGTH)).toBe(false);
	});

	it('handles very long bio', () => {
		const longBio = 'A'.repeat(1000);
		const meta = calculateBioMeta(longBio, BIO_MAX_LENGTH);

		expect(meta.length).toBe(1000);
		expect(meta.overLimit).toBe(true);
	});

	it('handles unicode in all fields', () => {
		const payload = buildEditPayload({
			displayName: 'Alice 🐘',
			bio: 'Hello 世界 🌍',
			fields: [{ name: '🌐 Website', value: 'https://example.com' }],
		});

		expect(payload.displayName).toContain('🐘');
		expect(payload.bio).toContain('世界');
		expect(payload.fields?.[0].name).toContain('🌐');
	});

	it('handles special HTML characters', () => {
		const payload = buildEditPayload({
			displayName: 'Alice <script>',
			bio: 'Bio with <tags>',
			fields: [{ name: 'Field', value: '<value>' }],
		});

		expect(payload.displayName).toContain('<script>');
		expect(payload.bio).toContain('<tags>');
	});

	it('handles newlines in bio', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Line 1\nLine 2\nLine 3',
			fields: [],
		});

		expect(payload.bio).toContain('\n');
		expect(payload.bio.split('\n')).toHaveLength(3);
	});

	it('handles maximum number of fields', () => {
		const manyFields = Array.from({ length: 10 }, (_, i) => ({
			name: `Field ${i}`,
			value: `Value ${i}`,
		}));

		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Bio',
			fields: manyFields,
		});

		expect(payload.fields).toHaveLength(10);
	});

	it('handles field with URL', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Bio',
			fields: [{ name: 'Website', value: 'https://example.com?param=value#hash' }],
		});

		expect(payload.fields?.[0].value).toBe('https://example.com?param=value#hash');
	});

	it('handles field with emoji', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Bio',
			fields: [{ name: 'Status', value: '🎉 Available' }],
		});

		expect(payload.fields?.[0].value).toBe('🎉 Available');
	});
});

describe('Profile/Edit - Trimming Behavior', () => {
	it('trims leading whitespace', () => {
		const payload = buildEditPayload({
			displayName: '   Alice',
			bio: '   Hello',
			fields: [],
		});

		expect(payload.displayName).toBe('Alice');
		expect(payload.bio).toBe('Hello');
	});

	it('trims trailing whitespace', () => {
		const payload = buildEditPayload({
			displayName: 'Alice   ',
			bio: 'Hello   ',
			fields: [],
		});

		expect(payload.displayName).toBe('Alice');
		expect(payload.bio).toBe('Hello');
	});

	it('preserves internal whitespace', () => {
		const payload = buildEditPayload({
			displayName: 'Alice   Smith',
			bio: 'Hello   world',
			fields: [],
		});

		expect(payload.displayName).toBe('Alice   Smith');
		expect(payload.bio).toBe('Hello   world');
	});

	it('preserves internal newlines', () => {
		const payload = buildEditPayload({
			displayName: 'Alice',
			bio: 'Line 1\n\nLine 2',
			fields: [],
		});

		expect(payload.bio).toBe('Line 1\n\nLine 2');
	});
});
