import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	saveDraft,
	loadDraft,
	deleteDraft,
	listDrafts,
	cleanupOldDrafts,
	getDraftAge,
	formatDraftAge,
	type Draft,
} from '../src/DraftManager.js';

describe('DraftManager', () => {
	const mockStorage: Record<string, string> = {};

	beforeEach(() => {
		// Mock localStorage
		global.localStorage = {
			getItem: vi.fn((key: string) => mockStorage[key] || null),
			setItem: vi.fn((key: string, value: string) => {
				mockStorage[key] = value;
			}),
			removeItem: vi.fn((key: string) => {
				delete mockStorage[key];
			}),
			clear: vi.fn(() => {
				Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
			}),
			key: vi.fn(),
			length: 0,
		} as any;
	});

	afterEach(() => {
		Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
	});

	describe('saveDraft', () => {
		it('should save draft to localStorage', () => {
			const draft: Draft = {
				content: 'Test post',
				contentWarning: '',
				visibility: 'public',
				savedAt: Date.now(),
			};

			saveDraft(draft, 'test-draft');

			expect(localStorage.setItem).toHaveBeenCalledWith(
				'greater-compose-draft-test-draft',
				expect.stringContaining('Test post')
			);
		});

		it('should include timestamp in draft', () => {
			const draft: Draft = {
				content: 'Test post',
				savedAt: Date.now(),
			};

			saveDraft(draft, 'test-draft');

			const saved = JSON.parse(mockStorage['greater-compose-draft-test-draft']);
			expect(saved).toHaveProperty('savedAt');
			expect(typeof saved.savedAt).toBe('number');
		});

		it('should save multiple drafts with different keys', () => {
			saveDraft({ content: 'First draft', savedAt: Date.now() }, 'draft-1');
			saveDraft({ content: 'Second draft', savedAt: Date.now() }, 'draft-2');

			expect(mockStorage).toHaveProperty('greater-compose-draft-draft-1');
			expect(mockStorage).toHaveProperty('greater-compose-draft-draft-2');
		});

		it('should overwrite existing draft with same key', () => {
			saveDraft({ content: 'Original', savedAt: Date.now() }, 'test-draft');
			saveDraft({ content: 'Updated', savedAt: Date.now() }, 'test-draft');

			const saved = JSON.parse(mockStorage['greater-compose-draft-test-draft']);
			expect(saved.content).toBe('Updated');
		});

		it('should handle empty content', () => {
			saveDraft({ content: '', savedAt: Date.now() }, 'test-draft');

			const saved = JSON.parse(mockStorage['greater-compose-draft-test-draft']);
			expect(saved.content).toBe('');
		});

		it('should preserve all draft properties', () => {
			const draft: Draft = {
				content: 'Test',
				contentWarning: 'CW',
				visibility: 'private',
				savedAt: Date.now(),
				metadata: {
					sensitive: true,
					language: 'en',
				},
			};

			saveDraft(draft, 'test-draft');

			const saved = JSON.parse(mockStorage['greater-compose-draft-test-draft']);
			expect(saved.content).toBe('Test');
			expect(saved.contentWarning).toBe('CW');
			expect(saved.visibility).toBe('private');
			expect(saved.metadata?.sensitive).toBe(true);
			expect(saved.metadata?.language).toBe('en');
		});
	});

	describe('loadDraft', () => {
		it('should load existing draft', () => {
			const draft = {
				content: 'Test post',
				savedAt: Date.now(),
			};

			mockStorage['greater-compose-draft-test-draft'] = JSON.stringify(draft);

			const loaded = loadDraft('test-draft');

			expect(loaded).toEqual(draft);
		});

		it('should return null for non-existent draft', () => {
			const loaded = loadDraft('non-existent');

			expect(loaded).toBeNull();
		});

		it('should return null for invalid JSON', () => {
			mockStorage['greater-compose-draft-test-draft'] = 'invalid json';

			const loaded = loadDraft('test-draft');

			expect(loaded).toBeNull();
		});

		it('should load draft with all properties', () => {
			const draft = {
				content: 'Test',
				contentWarning: 'CW',
				visibility: 'private',
				savedAt: Date.now(),
			};

			mockStorage['greater-compose-draft-test-draft'] = JSON.stringify(draft);

			const loaded = loadDraft('test-draft');

			expect(loaded).toEqual(draft);
		});
	});

	describe('deleteDraft', () => {
		it('should delete existing draft', () => {
			mockStorage['greater-compose-draft-test-draft'] = JSON.stringify({ content: 'Test' });

			deleteDraft('test-draft');

			expect(localStorage.removeItem).toHaveBeenCalledWith('greater-compose-draft-test-draft');
			expect(mockStorage['greater-compose-draft-test-draft']).toBeUndefined();
		});

		it('should handle deleting non-existent draft', () => {
			deleteDraft('non-existent');

			expect(localStorage.removeItem).toHaveBeenCalledWith('greater-compose-draft-non-existent');
		});
	});

	describe('listDrafts', () => {
		it('should list all drafts', () => {
			mockStorage['greater-compose-draft-draft-1'] = JSON.stringify({
				content: 'First',
				savedAt: Date.now(),
			});
			mockStorage['greater-compose-draft-draft-2'] = JSON.stringify({
				content: 'Second',
				savedAt: Date.now(),
			});

			// Mock Object.keys to return our storage keys
			global.localStorage = {
				...global.localStorage,
				key: vi.fn((index: number) => Object.keys(mockStorage)[index]),
				length: Object.keys(mockStorage).length,
			} as any;

			const drafts = listDrafts();

			expect(drafts).toHaveLength(2);
			expect(drafts).toContain('draft-1');
			expect(drafts).toContain('draft-2');
		});

		it('should return empty array when no drafts', () => {
			const drafts = listDrafts();

			expect(drafts).toEqual([]);
		});

		it('should ignore non-draft keys', () => {
			mockStorage['other-key'] = 'value';
			mockStorage['greater-compose-draft-test'] = JSON.stringify({
				content: 'Test',
				savedAt: Date.now(),
			});

			global.localStorage = {
				...global.localStorage,
				key: vi.fn((index: number) => Object.keys(mockStorage)[index]),
				length: Object.keys(mockStorage).length,
			} as any;

			const drafts = listDrafts();

			expect(drafts).toHaveLength(1);
			expect(drafts[0]).toBe('test');
		});
	});

	describe('cleanupOldDrafts', () => {
		it('should remove drafts older than max age', () => {
			const now = Date.now();
			const oldDraft = { content: 'Old', savedAt: now - 8 * 24 * 60 * 60 * 1000 }; // 8 days old
			const newDraft = { content: 'New', savedAt: now };

			mockStorage['greater-compose-draft-old'] = JSON.stringify(oldDraft);
			mockStorage['greater-compose-draft-new'] = JSON.stringify(newDraft);

			global.localStorage = {
				...global.localStorage,
				key: vi.fn((index: number) => Object.keys(mockStorage)[index]),
				length: Object.keys(mockStorage).length,
			} as any;

			const cleaned = cleanupOldDrafts();

			expect(cleaned).toBe(1); // One old draft cleaned
			expect(mockStorage['greater-compose-draft-old']).toBeUndefined();
			expect(mockStorage['greater-compose-draft-new']).toBeDefined();
		});

		it('should not remove drafts within max age', () => {
			const now = Date.now();
			const recentDraft = { content: 'Recent', savedAt: now - 5 * 24 * 60 * 60 * 1000 }; // 5 days

			mockStorage['greater-compose-draft-recent'] = JSON.stringify(recentDraft);

			global.localStorage = {
				...global.localStorage,
				key: vi.fn((index: number) => Object.keys(mockStorage)[index]),
				length: Object.keys(mockStorage).length,
			} as any;

			const cleaned = cleanupOldDrafts();

			expect(cleaned).toBe(0);
			expect(mockStorage['greater-compose-draft-recent']).toBeDefined();
		});

		it('should handle invalid draft data gracefully', () => {
			mockStorage['greater-compose-draft-invalid'] = 'invalid json';

			global.localStorage = {
				...global.localStorage,
				key: vi.fn((index: number) => Object.keys(mockStorage)[index]),
				length: Object.keys(mockStorage).length,
			} as any;

			expect(() => cleanupOldDrafts()).not.toThrow();
		});
	});

	describe('getDraftAge', () => {
		it('should calculate draft age in milliseconds', () => {
			const savedAt = Date.now() - 5000; // 5 seconds ago
			mockStorage['greater-compose-draft-test'] = JSON.stringify({
				content: 'Test',
				savedAt,
			});

			const age = getDraftAge('test');

			expect(age).toBeGreaterThanOrEqual(5000);
			expect(age).toBeLessThan(6000);
		});

		it('should return null for non-existent draft', () => {
			const age = getDraftAge('non-existent');

			expect(age).toBeNull();
		});

		it('should handle future timestamps', () => {
			const futureTime = Date.now() + 5000;
			mockStorage['greater-compose-draft-test'] = JSON.stringify({
				content: 'Test',
				savedAt: futureTime,
			});

			const age = getDraftAge('test');

			expect(age).toBeLessThan(0);
		});
	});

	describe('formatDraftAge', () => {
		it('should format just now', () => {
			expect(formatDraftAge(30 * 1000)).toBe('just now');
		});

		it('should format minutes', () => {
			expect(formatDraftAge(60 * 1000)).toBe('1 minute ago');
			expect(formatDraftAge(2 * 60 * 1000)).toBe('2 minutes ago');
		});

		it('should format hours', () => {
			expect(formatDraftAge(60 * 60 * 1000)).toBe('1 hour ago');
			expect(formatDraftAge(2 * 60 * 60 * 1000)).toBe('2 hours ago');
		});

		it('should format days', () => {
			expect(formatDraftAge(24 * 60 * 60 * 1000)).toBe('1 day ago');
			expect(formatDraftAge(2 * 24 * 60 * 60 * 1000)).toBe('2 days ago');
		});
	});

	describe('Edge Cases', () => {
		it('should handle localStorage being unavailable', () => {
			global.localStorage = undefined as any;

			const result = saveDraft({ content: 'test', savedAt: Date.now() }, 'test');
			expect(result).toBe(false);
		});

		it('should handle quota exceeded errors', () => {
			const setItemMock = vi.fn(() => {
				throw new Error('QuotaExceededError');
			});

			global.localStorage = {
				...global.localStorage,
				setItem: setItemMock,
			} as any;

			const result = saveDraft({ content: 'test', savedAt: Date.now() }, 'test');
			expect(result).toBe(false);
		});

		it('should handle special characters in draft keys', () => {
			saveDraft({ content: 'Test', savedAt: Date.now() }, 'test/draft:123');

			expect(localStorage.setItem).toHaveBeenCalledWith(
				'greater-compose-draft-test/draft:123',
				expect.any(String)
			);
		});

		it('should handle very large draft content', () => {
			const largeContent = 'a'.repeat(100000);
			saveDraft({ content: largeContent, savedAt: Date.now() }, 'large-draft');

			const loaded = loadDraft('large-draft');
			expect(loaded?.content).toBe(largeContent);
		});

		it('should handle unicode content', () => {
			const unicodeContent = '👋 Hello 世界 🌍';
			saveDraft({ content: unicodeContent, savedAt: Date.now() }, 'unicode-draft');

			const loaded = loadDraft('unicode-draft');
			expect(loaded?.content).toBe(unicodeContent);
		});
	});
});
