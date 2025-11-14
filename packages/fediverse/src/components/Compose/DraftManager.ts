/**
 * Draft Manager
 *
 * Handles saving and loading draft posts from localStorage.
 * Supports multiple drafts with keys and automatic cleanup.
 */

export interface Draft {
	/**
	 * Draft content
	 */
	content: string;

	/**
	 * Content warning text
	 */
	contentWarning?: string;

	/**
	 * Post visibility
	 */
	visibility?: string;

	/**
	 * Timestamp when draft was saved
	 */
	savedAt: number;

	/**
	 * ID of status being replied to
	 */
	inReplyTo?: string;

	/**
	 * Media attachments (stored as references)
	 */
	mediaIds?: string[];

	/**
	 * Metadata
	 */
	metadata?: {
		language?: string;
		sensitive?: boolean;
	};
}

/**
 * Storage key prefix for drafts
 */
const DRAFT_PREFIX = 'greater-compose-draft';

/**
 * Default key for compose drafts
 */
const DEFAULT_KEY = 'default';

/**
 * Maximum age for drafts in milliseconds (7 days)
 */
const MAX_DRAFT_AGE = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
	try {
		const test = '__localStorage_test__';
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch {
		return false;
	}
}

/**
 * Get storage key for a draft
 */
function getStorageKey(key: string = DEFAULT_KEY): string {
	return `${DRAFT_PREFIX}-${key}`;
}

/**
 * Save a draft to localStorage
 */
export function saveDraft(draft: Draft, key: string = DEFAULT_KEY): boolean {
	if (!isLocalStorageAvailable()) {
		console.warn('localStorage not available, cannot save draft');
		return false;
	}

	try {
		const storageKey = getStorageKey(key);
		const draftWithTimestamp: Draft = {
			...draft,
			savedAt: Date.now(),
		};
		localStorage.setItem(storageKey, JSON.stringify(draftWithTimestamp));
		return true;
	} catch (error) {
		console.error('Failed to save draft:', error);
		return false;
	}
}

/**
 * Load a draft from localStorage
 */
export function loadDraft(key: string = DEFAULT_KEY): Draft | null {
	if (!isLocalStorageAvailable()) {
		return null;
	}

	try {
		const storageKey = getStorageKey(key);
		const stored = localStorage.getItem(storageKey);

		if (!stored) {
			return null;
		}

		const draft: Draft = JSON.parse(stored);

		// Check if draft is too old
		const age = Date.now() - draft.savedAt;
		if (age > MAX_DRAFT_AGE) {
			deleteDraft(key);
			return null;
		}

		return draft;
	} catch (error) {
		console.error('Failed to load draft:', error);
		return null;
	}
}

/**
 * Delete a draft from localStorage
 */
export function deleteDraft(key: string = DEFAULT_KEY): boolean {
	if (!isLocalStorageAvailable()) {
		return false;
	}

	try {
		const storageKey = getStorageKey(key);
		localStorage.removeItem(storageKey);
		return true;
	} catch (error) {
		console.error('Failed to delete draft:', error);
		return false;
	}
}

/**
 * List all draft keys
 */
export function listDrafts(): string[] {
	if (!isLocalStorageAvailable()) {
		return [];
	}

	try {
		const keys: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(DRAFT_PREFIX)) {
				const draftKey = key.replace(`${DRAFT_PREFIX}-`, '');
				keys.push(draftKey);
			}
		}
		return keys;
	} catch (error) {
		console.error('Failed to list drafts:', error);
		return [];
	}
}

/**
 * Clean up old drafts
 */
export function cleanupOldDrafts(): number {
	const keys = listDrafts();
	let cleaned = 0;

	for (const key of keys) {
		const draft = loadDraft(key);
		if (!draft) {
			// Draft was cleaned up by loadDraft
			cleaned++;
		}
	}

	return cleaned;
}

/**
 * Check if a draft exists
 */
export function hasDraft(key: string = DEFAULT_KEY): boolean {
	return loadDraft(key) !== null;
}

/**
 * Get the age of a draft in milliseconds
 */
export function getDraftAge(key: string = DEFAULT_KEY): number | null {
	const draft = loadDraft(key);
	if (!draft) {
		return null;
	}
	return Date.now() - draft.savedAt;
}

/**
 * Format draft age for display
 */
export function formatDraftAge(age: number): string {
	const minutes = Math.floor(age / (60 * 1000));
	const hours = Math.floor(age / (60 * 60 * 1000));
	const days = Math.floor(age / (24 * 60 * 60 * 1000));

	if (days > 0) {
		return `${days} day${days !== 1 ? 's' : ''} ago`;
	}
	if (hours > 0) {
		return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
	}
	if (minutes > 0) {
		return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
	}
	return 'just now';
}
