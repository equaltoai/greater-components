import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import NoteResult from '../src/NoteResult.svelte';

// Mock utils
vi.mock('@equaltoai/greater-components-utils', () => ({
	sanitizeHtml: (html: string) => html,
}));

const { mockContext, mockHandlers, mockState } = vi.hoisted(() => {
	const handlers = {
		onNoteClick: vi.fn(),
	};
	const state = {
		query: 'test',
	};
	const context = {
		state,
		handlers,
		formatCount: (n: number) => n.toString(),
		highlightQuery: (text: string, query: string) => {
			if (query && text.includes(query)) {
				return text.replace(query, `<mark>${query}</mark>`);
			}
			return text;
		},
	};
	return { mockContext: context, mockHandlers: handlers, mockState: state };
});

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getSearchContext: () => mockContext,
		formatCount: (n: number) => n.toString(),
		highlightQuery: mockContext.highlightQuery,
	};
});

describe('NoteResult Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.query = 'world';
	});

	const mockNote = {
		id: '1',
		content: 'Hello world of search',
		createdAt: new Date().toISOString(),
		author: {
			id: 'u1',
			username: 'user',
			displayName: 'User Name',
			avatar: 'avatar.png',
		},
		repliesCount: 5,
		reblogsCount: 2,
		likesCount: 10,
	};

	it('renders note details with highlighted content', async () => {
		const target = document.createElement('div');
		const instance = mount(NoteResult, {
			target,
			props: { note: mockNote },
		});
		await flushSync();

		expect(target.textContent).toContain('User Name');
		expect(target.textContent).toContain('@user');
		expect(target.innerHTML).toContain('<mark>world</mark>'); // Highlights 'world'
		expect(target.querySelector('img')?.getAttribute('src')).toBe('avatar.png');

		// Stats
		expect(target.textContent).toContain('💬 5');
		expect(target.textContent).toContain('🔁 2');
		expect(target.textContent).toContain('❤️ 10');

		unmount(instance);
	});

	it('handles card click', async () => {
		const target = document.createElement('div');
		const instance = mount(NoteResult, {
			target,
			props: { note: mockNote },
		});
		await flushSync();

		const card = target.querySelector('.note-result__interactive') as HTMLElement;
		card.click();
		await flushSync();

		expect(mockHandlers.onNoteClick).toHaveBeenCalledWith(mockNote);

		unmount(instance);
	});

	it('renders avatar placeholder if no avatar', async () => {
		const target = document.createElement('div');
		const instance = mount(NoteResult, {
			target,
			props: { note: { ...mockNote, author: { ...mockNote.author, avatar: undefined } } },
		});
		await flushSync();

		expect(target.querySelector('img')).toBeFalsy();
		expect(target.querySelector('.note-result__avatar-placeholder')).toBeTruthy();

		unmount(instance);
	});

	it('formats date correctly', async () => {
		const target = document.createElement('div');
		// 1 hour ago
		const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
		const instance = mount(NoteResult, {
			target,
			props: { note: { ...mockNote, createdAt: oneHourAgo } },
		});
		await flushSync();

		expect(target.textContent).toContain('1h');

		unmount(instance);
	});
});
