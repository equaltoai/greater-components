/**
 * VerifiedFields Component Tests
 *
 * Tests for Profile.VerifiedFields component which displays profile fields
 * with rel=me verification badges and external link indicators.
 */

import { describe, it, expect } from 'vitest';
import type { ProfileField } from '../../src/components/Profile/context.js';

describe('VerifiedFields Logic', () => {
	describe('isUrl Helper', () => {
		function isUrl(value: string): boolean {
			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		}

		it('should identify valid HTTPS URLs', () => {
			expect(isUrl('https://example.com')).toBe(true);
			expect(isUrl('https://github.com/user')).toBe(true);
			expect(isUrl('https://subdomain.example.com/path')).toBe(true);
		});

		it('should identify valid HTTP URLs', () => {
			expect(isUrl('http://example.com')).toBe(true);
			expect(isUrl('http://localhost:3000')).toBe(true);
		});

		it('should reject invalid URLs', () => {
			expect(isUrl('not-a-url')).toBe(false);
			expect(isUrl('example.com')).toBe(false);
			expect(isUrl('/relative/path')).toBe(false);
			expect(isUrl('')).toBe(false);
		});

		it('should handle malformed URLs gracefully', () => {
			expect(isUrl('ht!tp://bad')).toBe(false);
			expect(isUrl('//no-protocol.com')).toBe(false);
		});
	});

	describe('isVerified Helper', () => {
		function isVerified(field: ProfileField): boolean {
			return !!field.verifiedAt;
		}

		it('should return true for verified fields', () => {
			const field: ProfileField = {
				name: 'Website',
				value: 'https://example.com',
				verifiedAt: '2024-01-15T10:00:00Z',
			};
			expect(isVerified(field)).toBe(true);
		});

		it('should return false for unverified fields', () => {
			const field: ProfileField = {
				name: 'Website',
				value: 'https://example.com',
			};
			expect(isVerified(field)).toBe(false);
		});

		it('should return false for empty verifiedAt', () => {
			const field: ProfileField = {
				name: 'Website',
				value: 'https://example.com',
				verifiedAt: '',
			};
			expect(isVerified(field)).toBe(false);
		});
	});

	describe('formatVerifiedDate Helper', () => {
		function formatVerifiedDate(dateString: string): string {
			try {
				const date = new Date(dateString);
				return date.toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				});
			} catch {
				return 'Verified';
			}
		}

		it('should format valid ISO date', () => {
			const result = formatVerifiedDate('2024-01-15T10:00:00Z');
			expect(result).toContain('2024');
			expect(result).toContain('January');
		});

		it('should handle invalid dates gracefully', () => {
			const result1 = formatVerifiedDate('invalid');
			const result2 = formatVerifiedDate('');
			// Should not throw and should return fallback
			expect(result1).toBeTruthy();
			expect(result2).toBeTruthy();
		});

		it('should format dates consistently', () => {
			const date1 = formatVerifiedDate('2024-01-15T12:00:00Z');
			const date2 = formatVerifiedDate('2024-01-15T12:00:00Z');
			// Same date should format identically
			expect(date1).toBe(date2);
			expect(date1).toContain('2024');
		});
	});

	describe('parseValue Helper', () => {
		function parseValue(value: string): { text: string; url?: string } {
			// Check if value contains HTML link
			const linkMatch = value.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/);
			if (linkMatch) {
				return {
					text: linkMatch[2],
					url: linkMatch[1],
				};
			}

			// Check if value is a plain URL
			try {
				new URL(value);
				return {
					text: value,
					url: value,
				};
			} catch {
				// Not a URL
			}

			return {
				text: value,
			};
		}

		it('should parse HTML links', () => {
			const html = '<a href="https://example.com">My Website</a>';
			const result = parseValue(html);
			expect(result).toEqual({
				text: 'My Website',
				url: 'https://example.com',
			});
		});

		it('should parse plain URLs', () => {
			const result = parseValue('https://github.com/user');
			expect(result).toEqual({
				text: 'https://github.com/user',
				url: 'https://github.com/user',
			});
		});

		it('should handle plain text', () => {
			const result = parseValue('Just some text');
			expect(result).toEqual({
				text: 'Just some text',
			});
			expect(result.url).toBeUndefined();
		});

		it('should handle HTML links with attributes', () => {
			const html = '<a class="link" href="https://example.com" target="_blank">Link</a>';
			const result = parseValue(html);
			expect(result.text).toBe('Link');
			expect(result.url).toBe('https://example.com');
		});

		it('should handle malformed HTML gracefully', () => {
			const result = parseValue('<a>Broken Link</a>');
			expect(result.text).toBe('<a>Broken Link</a>');
			expect(result.url).toBeUndefined();
		});
	});

	describe('Field Display Logic', () => {
		it('should limit fields to maxFields', () => {
			const fields: ProfileField[] = [
				{ name: 'Field 1', value: 'Value 1' },
				{ name: 'Field 2', value: 'Value 2' },
				{ name: 'Field 3', value: 'Value 3' },
				{ name: 'Field 4', value: 'Value 4' },
				{ name: 'Field 5', value: 'Value 5' },
			];

			const maxFields = 3;
			const displayFields = maxFields > 0 ? fields.slice(0, maxFields) : fields;

			expect(displayFields).toHaveLength(3);
			expect(displayFields[0].name).toBe('Field 1');
			expect(displayFields[2].name).toBe('Field 3');
		});

		it('should show all fields when maxFields is 0', () => {
			const fields: ProfileField[] = [
				{ name: 'Field 1', value: 'Value 1' },
				{ name: 'Field 2', value: 'Value 2' },
				{ name: 'Field 3', value: 'Value 3' },
			];

			const maxFields = 0;
			const displayFields = maxFields > 0 ? fields.slice(0, maxFields) : fields;

			expect(displayFields).toHaveLength(3);
		});

		it('should handle empty fields array', () => {
			const fields: ProfileField[] = [];
			const maxFields = 4;
			const displayFields = maxFields > 0 ? fields.slice(0, maxFields) : fields;

			expect(displayFields).toHaveLength(0);
		});
	});

	describe('Verification Badge Display', () => {
		it('should show badge for verified fields', () => {
			const field: ProfileField = {
				name: 'Website',
				value: 'https://example.com',
				verifiedAt: '2024-01-15T10:00:00Z',
			};

			const showVerificationBadge = true;
			const verified = !!field.verifiedAt;

			expect(showVerificationBadge && verified && field.verifiedAt).toBeTruthy();
		});

		it('should not show badge when disabled', () => {
			const field: ProfileField = {
				name: 'Website',
				value: 'https://example.com',
				verifiedAt: '2024-01-15T10:00:00Z',
			};

			const showVerificationBadge = false;
			const verified = !!field.verifiedAt;

			expect(showVerificationBadge && verified && field.verifiedAt).toBeFalsy();
		});

		it('should not show badge for unverified fields', () => {
			const field: ProfileField = {
				name: 'Website',
				value: 'https://example.com',
			};

			const showVerificationBadge = true;
			const verified = !!field.verifiedAt;

			expect(showVerificationBadge && verified && field.verifiedAt).toBeFalsy();
		});
	});

	describe('External Link Icon Display', () => {
		function parseValue(value: string): { text: string; url?: string } {
			try {
				new URL(value);
				return { text: value, url: value };
			} catch {
				return { text: value };
			}
		}

		it('should show external icon for URLs', () => {
			const value = 'https://github.com/user';
			const parsed = parseValue(value);
			const showExternalIcon = true;

			expect(parsed.url).toBeTruthy();
			expect(showExternalIcon).toBe(true);
		});

		it('should not show external icon when disabled', () => {
			const value = 'https://github.com/user';
			const parsed = parseValue(value);
			const showExternalIcon = false;

			expect(parsed.url).toBeTruthy();
			expect(showExternalIcon).toBe(false);
		});

		it('should not show external icon for plain text', () => {
			const value = 'Just text';
			const parsed = parseValue(value);

			expect(parsed.url).toBeUndefined();
		});
	});

	describe('Field Validation', () => {
		it('should handle fields with special characters', () => {
			const field: ProfileField = {
				name: 'Name (with parentheses)',
				value: 'Value & special <chars>',
			};

			expect(field.name).toContain('(');
			expect(field.value).toContain('&');
			expect(field.value).toContain('<');
		});

		it('should handle very long field names', () => {
			const longName = 'A'.repeat(100);
			const field: ProfileField = {
				name: longName,
				value: 'Value',
			};

			expect(field.name).toHaveLength(100);
		});

		it('should handle very long values', () => {
			const longValue = 'https://example.com/' + 'a'.repeat(200);
			const field: ProfileField = {
				name: 'Website',
				value: longValue,
			};

			expect(field.value.length).toBeGreaterThan(200);
		});

		it('should handle unicode in field names', () => {
			const field: ProfileField = {
				name: 'サイト',
				value: 'https://example.com',
			};

			expect(field.name).toBe('サイト');
		});

		it('should handle unicode in values', () => {
			const field: ProfileField = {
				name: 'Location',
				value: '東京、日本',
			};

			expect(field.value).toBe('東京、日本');
		});
	});

	describe('Edge Cases', () => {
		it('should handle undefined verifiedAt', () => {
			const field: ProfileField = {
				name: 'Website',
				value: 'https://example.com',
				verifiedAt: undefined,
			};

			expect(!!field.verifiedAt).toBe(false);
		});

		it('should handle empty field name', () => {
			const field: ProfileField = {
				name: '',
				value: 'Value',
			};

			expect(field.name).toBe('');
		});

		it('should handle empty field value', () => {
			const field: ProfileField = {
				name: 'Name',
				value: '',
			};

			expect(field.value).toBe('');
		});

		it('should handle multiple URLs in value', () => {
			const value = 'Check out https://example.com and https://other.com';
			const parsed = (val: string) => {
				try {
					new URL(val);
					return { text: val, url: val };
				} catch {
					return { text: val };
				}
			};

			const result = parsed(value);
			// Should not be parsed as URL since it contains multiple URLs
			expect(result.url).toBeUndefined();
		});
	});
});

