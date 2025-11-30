/**
 * Messages.UnreadIndicator Component Tests
 *
 * Tests for unread message indicator logic including:
 * - Unread count calculation
 * - Display formatting
 * - Visibility logic
 * - Aria label generation
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface Conversation {
	id: string;
	participants: any[];
	unreadCount: number;
	updatedAt: string;
}

// Calculate total unread count
function calculateUnreadCount(conversations: Conversation[]): number {
	return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
}

// Format display count
function formatDisplayCount(count: number): string {
	return count > 99 ? '99+' : String(count);
}

// Check if should show indicator
function shouldShowIndicator(unreadCount: number, showZero: boolean): boolean {
	return unreadCount > 0 || showZero;
}

// Get aria label
function getAriaLabel(unreadCount: number): string {
	return `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`;
}

// Get variant class
function getVariantClass(variant: 'badge' | 'dot' | 'number'): string {
	return `unread-indicator--${variant}`;
}

// Get size class
function getSizeClass(size: 'small' | 'medium' | 'large'): string {
	return `unread-indicator--${size}`;
}

// Check if has unread
function hasUnreadMessages(conversations: Conversation[]): boolean {
	return calculateUnreadCount(conversations) > 0;
}

// Count conversations with unread
function countUnreadConversations(conversations: Conversation[]): number {
	return conversations.filter((c) => c.unreadCount > 0).length;
}

// Get max unread count from single conversation
function getMaxUnreadInConversation(conversations: Conversation[]): number {
	if (conversations.length === 0) return 0;
	return Math.max(...conversations.map((c) => c.unreadCount));
}

// Check if count exceeds threshold
function exceedsThreshold(count: number, threshold: number): boolean {
	return count > threshold;
}

// Format count with custom limit
function formatCountWithLimit(count: number, limit: number): string {
	return count > limit ? `${limit}+` : String(count);
}

// Check if should show as dot
function shouldShowAsDot(variant: 'badge' | 'dot' | 'number'): boolean {
	return variant === 'dot';
}

// Check if should show count text
function shouldShowCountText(variant: 'badge' | 'dot' | 'number'): boolean {
	return variant === 'badge' || variant === 'number';
}

// Get conversations with unread
function getUnreadConversations(conversations: Conversation[]): Conversation[] {
	return conversations.filter((c) => c.unreadCount > 0);
}

// Sort conversations by unread count descending
function sortByUnreadCount(conversations: Conversation[]): Conversation[] {
	return [...conversations].sort((a, b) => b.unreadCount - a.unreadCount);
}

// Check if all conversations are read
function allConversationsRead(conversations: Conversation[]): boolean {
	return conversations.every((c) => c.unreadCount === 0);
}

// Get unread percentage
function getUnreadPercentage(conversations: Conversation[]): number {
	if (conversations.length === 0) return 0;
	const unreadConversations = countUnreadConversations(conversations);
	return Math.round((unreadConversations / conversations.length) * 100);
}

describe('Messages.UnreadIndicator - Count Calculation', () => {
	it('calculates total unread count', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 5, updatedAt: '2024-01-01' },
			{ id: '2', participants: [], unreadCount: 3, updatedAt: '2024-01-01' },
			{ id: '3', participants: [], unreadCount: 2, updatedAt: '2024-01-01' },
		];
		expect(calculateUnreadCount(conversations)).toBe(10);
	});

	it('returns 0 for empty conversations', () => {
		expect(calculateUnreadCount([])).toBe(0);
	});

	it('returns 0 when all read', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
			{ id: '2', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		];
		expect(calculateUnreadCount(conversations)).toBe(0);
	});

	it('handles single conversation', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 7, updatedAt: '2024-01-01' },
		];
		expect(calculateUnreadCount(conversations)).toBe(7);
	});
});

describe('Messages.UnreadIndicator - Display Formatting', () => {
	it('formats count under 100', () => {
		expect(formatDisplayCount(0)).toBe('0');
		expect(formatDisplayCount(1)).toBe('1');
		expect(formatDisplayCount(50)).toBe('50');
		expect(formatDisplayCount(99)).toBe('99');
	});

	it('formats count at 100 as 99+', () => {
		expect(formatDisplayCount(100)).toBe('99+');
	});

	it('formats count over 100 as 99+', () => {
		expect(formatDisplayCount(150)).toBe('99+');
		expect(formatDisplayCount(999)).toBe('99+');
		expect(formatDisplayCount(9999)).toBe('99+');
	});
});

describe('Messages.UnreadIndicator - Visibility', () => {
	it('shows when has unread messages', () => {
		expect(shouldShowIndicator(5, false)).toBe(true);
	});

	it('hides when no unread and showZero false', () => {
		expect(shouldShowIndicator(0, false)).toBe(false);
	});

	it('shows when no unread but showZero true', () => {
		expect(shouldShowIndicator(0, true)).toBe(true);
	});

	it('shows when has unread regardless of showZero', () => {
		expect(shouldShowIndicator(5, false)).toBe(true);
		expect(shouldShowIndicator(5, true)).toBe(true);
	});
});

describe('Messages.UnreadIndicator - Aria Label', () => {
	it('generates label for single message', () => {
		expect(getAriaLabel(1)).toBe('1 unread message');
	});

	it('generates label for multiple messages', () => {
		expect(getAriaLabel(5)).toBe('5 unread messages');
		expect(getAriaLabel(100)).toBe('100 unread messages');
	});

	it('generates label for zero messages', () => {
		expect(getAriaLabel(0)).toBe('0 unread messages');
	});

	it('uses plural for 2', () => {
		expect(getAriaLabel(2)).toBe('2 unread messages');
	});
});

describe('Messages.UnreadIndicator - Variant Classes', () => {
	it('generates badge variant class', () => {
		expect(getVariantClass('badge')).toBe('unread-indicator--badge');
	});

	it('generates dot variant class', () => {
		expect(getVariantClass('dot')).toBe('unread-indicator--dot');
	});

	it('generates number variant class', () => {
		expect(getVariantClass('number')).toBe('unread-indicator--number');
	});
});

describe('Messages.UnreadIndicator - Size Classes', () => {
	it('generates small size class', () => {
		expect(getSizeClass('small')).toBe('unread-indicator--small');
	});

	it('generates medium size class', () => {
		expect(getSizeClass('medium')).toBe('unread-indicator--medium');
	});

	it('generates large size class', () => {
		expect(getSizeClass('large')).toBe('unread-indicator--large');
	});
});

describe('Messages.UnreadIndicator - Unread Detection', () => {
	it('detects has unread messages', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 5, updatedAt: '2024-01-01' },
		];
		expect(hasUnreadMessages(conversations)).toBe(true);
	});

	it('detects no unread messages', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		];
		expect(hasUnreadMessages(conversations)).toBe(false);
	});

	it('handles empty conversations', () => {
		expect(hasUnreadMessages([])).toBe(false);
	});
});

describe('Messages.UnreadIndicator - Conversation Counting', () => {
	const conversations: Conversation[] = [
		{ id: '1', participants: [], unreadCount: 5, updatedAt: '2024-01-01' },
		{ id: '2', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		{ id: '3', participants: [], unreadCount: 3, updatedAt: '2024-01-01' },
		{ id: '4', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
	];

	it('counts conversations with unread', () => {
		expect(countUnreadConversations(conversations)).toBe(2);
	});

	it('returns 0 when all read', () => {
		const allRead = conversations.map((c) => ({ ...c, unreadCount: 0 }));
		expect(countUnreadConversations(allRead)).toBe(0);
	});

	it('gets max unread count', () => {
		expect(getMaxUnreadInConversation(conversations)).toBe(5);
	});

	it('returns 0 for empty conversations', () => {
		expect(getMaxUnreadInConversation([])).toBe(0);
	});
});

describe('Messages.UnreadIndicator - Threshold', () => {
	it('detects exceeds threshold', () => {
		expect(exceedsThreshold(100, 99)).toBe(true);
		expect(exceedsThreshold(150, 99)).toBe(true);
	});

	it('detects does not exceed threshold', () => {
		expect(exceedsThreshold(99, 99)).toBe(false);
		expect(exceedsThreshold(50, 99)).toBe(false);
	});

	it('formats with custom limit', () => {
		expect(formatCountWithLimit(50, 100)).toBe('50');
		expect(formatCountWithLimit(101, 100)).toBe('100+');
		expect(formatCountWithLimit(9, 9)).toBe('9');
		expect(formatCountWithLimit(10, 9)).toBe('9+');
	});
});

describe('Messages.UnreadIndicator - Variant Display', () => {
	it('detects should show as dot', () => {
		expect(shouldShowAsDot('dot')).toBe(true);
		expect(shouldShowAsDot('badge')).toBe(false);
		expect(shouldShowAsDot('number')).toBe(false);
	});

	it('detects should show count text', () => {
		expect(shouldShowCountText('badge')).toBe(true);
		expect(shouldShowCountText('number')).toBe(true);
		expect(shouldShowCountText('dot')).toBe(false);
	});
});

describe('Messages.UnreadIndicator - Filtering', () => {
	const conversations: Conversation[] = [
		{ id: '1', participants: [], unreadCount: 5, updatedAt: '2024-01-01' },
		{ id: '2', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		{ id: '3', participants: [], unreadCount: 3, updatedAt: '2024-01-01' },
	];

	it('gets unread conversations', () => {
		const unread = getUnreadConversations(conversations);
		expect(unread).toHaveLength(2);
		expect(unread.map((c) => c.id)).toEqual(['1', '3']);
	});

	it('returns empty for all read', () => {
		const allRead = conversations.map((c) => ({ ...c, unreadCount: 0 }));
		expect(getUnreadConversations(allRead)).toHaveLength(0);
	});
});

describe('Messages.UnreadIndicator - Sorting', () => {
	const conversations: Conversation[] = [
		{ id: '1', participants: [], unreadCount: 3, updatedAt: '2024-01-01' },
		{ id: '2', participants: [], unreadCount: 10, updatedAt: '2024-01-01' },
		{ id: '3', participants: [], unreadCount: 1, updatedAt: '2024-01-01' },
	];

	it('sorts by unread count descending', () => {
		const sorted = sortByUnreadCount(conversations);
		expect(sorted.map((c) => c.id)).toEqual(['2', '1', '3']);
		expect(sorted.map((c) => c.unreadCount)).toEqual([10, 3, 1]);
	});

	it('does not mutate original', () => {
		const original = [...conversations];
		sortByUnreadCount(conversations);
		expect(conversations).toEqual(original);
	});
});

describe('Messages.UnreadIndicator - Read Status', () => {
	it('detects all conversations read', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
			{ id: '2', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		];
		expect(allConversationsRead(conversations)).toBe(true);
	});

	it('detects some conversations unread', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 5, updatedAt: '2024-01-01' },
			{ id: '2', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		];
		expect(allConversationsRead(conversations)).toBe(false);
	});

	it('handles empty conversations', () => {
		expect(allConversationsRead([])).toBe(true);
	});
});

describe('Messages.UnreadIndicator - Percentage', () => {
	const conversations: Conversation[] = [
		{ id: '1', participants: [], unreadCount: 5, updatedAt: '2024-01-01' },
		{ id: '2', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		{ id: '3', participants: [], unreadCount: 3, updatedAt: '2024-01-01' },
		{ id: '4', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
	];

	it('calculates unread percentage', () => {
		expect(getUnreadPercentage(conversations)).toBe(50);
	});

	it('returns 0 for empty', () => {
		expect(getUnreadPercentage([])).toBe(0);
	});

	it('returns 100 when all unread', () => {
		const allUnread = conversations.map((c) => ({ ...c, unreadCount: 1 }));
		expect(getUnreadPercentage(allUnread)).toBe(100);
	});

	it('returns 0 when all read', () => {
		const allRead = conversations.map((c) => ({ ...c, unreadCount: 0 }));
		expect(getUnreadPercentage(allRead)).toBe(0);
	});

	it('rounds to nearest integer', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 1, updatedAt: '2024-01-01' },
			{ id: '2', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
			{ id: '3', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		];
		// 1/3 = 33.333... should round to 33
		expect(getUnreadPercentage(conversations)).toBe(33);
	});
});

describe('Messages.UnreadIndicator - Edge Cases', () => {
	it('handles very large unread count', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 999999, updatedAt: '2024-01-01' },
		];
		expect(calculateUnreadCount(conversations)).toBe(999999);
		expect(formatDisplayCount(999999)).toBe('99+');
	});

	it('handles negative unread count', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: -5, updatedAt: '2024-01-01' },
		];
		// Negative counts should be handled gracefully
		expect(calculateUnreadCount(conversations)).toBe(-5);
	});

	it('formats zero with showZero', () => {
		expect(shouldShowIndicator(0, true)).toBe(true);
		expect(formatDisplayCount(0)).toBe('0');
		expect(getAriaLabel(0)).toBe('0 unread messages');
	});
});

describe('Messages.UnreadIndicator - Integration', () => {
	it('handles complete indicator display', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 45, updatedAt: '2024-01-01' },
			{ id: '2', participants: [], unreadCount: 30, updatedAt: '2024-01-01' },
			{ id: '3', participants: [], unreadCount: 25, updatedAt: '2024-01-01' },
		];

		const unreadCount = calculateUnreadCount(conversations);
		expect(unreadCount).toBe(100);

		const displayCount = formatDisplayCount(unreadCount);
		expect(displayCount).toBe('99+');

		const ariaLabel = getAriaLabel(unreadCount);
		expect(ariaLabel).toBe('100 unread messages');

		expect(shouldShowIndicator(unreadCount, false)).toBe(true);
		expect(hasUnreadMessages(conversations)).toBe(true);
		expect(countUnreadConversations(conversations)).toBe(3);
	});

	it('handles all variants', () => {
		const variants: Array<'badge' | 'dot' | 'number'> = ['badge', 'dot', 'number'];

		for (const variant of variants) {
			expect(getVariantClass(variant)).toContain(variant);
			if (variant === 'dot') {
				expect(shouldShowAsDot(variant)).toBe(true);
				expect(shouldShowCountText(variant)).toBe(false);
			} else {
				expect(shouldShowAsDot(variant)).toBe(false);
				expect(shouldShowCountText(variant)).toBe(true);
			}
		}
	});

	it('handles all sizes', () => {
		const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

		for (const size of sizes) {
			expect(getSizeClass(size)).toContain(size);
		}
	});

	it('processes conversations with mixed states', () => {
		const conversations: Conversation[] = [
			{ id: '1', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
			{ id: '2', participants: [], unreadCount: 50, updatedAt: '2024-01-01' },
			{ id: '3', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
			{ id: '4', participants: [], unreadCount: 25, updatedAt: '2024-01-01' },
			{ id: '5', participants: [], unreadCount: 0, updatedAt: '2024-01-01' },
		];

		expect(calculateUnreadCount(conversations)).toBe(75);
		expect(countUnreadConversations(conversations)).toBe(2);
		expect(getUnreadPercentage(conversations)).toBe(40);
		expect(allConversationsRead(conversations)).toBe(false);

		const unread = getUnreadConversations(conversations);
		expect(unread).toHaveLength(2);

		const sorted = sortByUnreadCount(unread);
		expect(sorted[0].unreadCount).toBe(50);
	});
});
