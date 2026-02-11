import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import ActorResult from '../src/ActorResult.svelte';

// Mock createButton
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: (config: any) => ({
		actions: {
			button: (node: HTMLElement) => {
				const handler = (e: Event) => {
					config.onClick?.(e);
				};
				node.addEventListener('click', handler);
				return {
					destroy: () => node.removeEventListener('click', handler),
				};
			},
		},
	}),
}));

const mockHandlers = {
	onSearch: vi.fn(),
	onFollow: vi.fn(),
	onActorClick: vi.fn(),
};

const mockContext = {
	handlers: mockHandlers,
	formatCount: (n: number) => n.toString(),
};

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getSearchContext: () => mockContext,
		formatCount: (n: number) => n.toString(),
	};
});

describe('ActorResult Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockActor = {
		id: '1',
		username: 'alice',
		displayName: 'Alice',
		avatar: 'avatar.png',
		bio: '<p>Bio</p>',
		followersCount: 100,
		isFollowing: false,
	};

	it('renders actor details', async () => {
		const target = document.createElement('div');
		const instance = mount(ActorResult, {
			target,
			props: { actor: mockActor },
		});
		await flushSync();

		expect(target.textContent).toContain('Alice');
		expect(target.textContent).toContain('@alice');
		expect(target.textContent).toContain('Bio');
		expect(target.textContent).toContain('100 followers');
		expect(target.querySelector('img')?.getAttribute('src')).toBe('avatar.png');

		unmount(instance);
	});

	it('renders placeholder avatar if no avatar url', () => {
		const target = document.createElement('div');
		const instance = mount(ActorResult, {
			target,
			props: { actor: { ...mockActor, avatar: undefined } },
		});

		expect(target.querySelector('img')).toBeFalsy();
		expect(target.querySelector('.actor-result__avatar-placeholder')).toBeTruthy();
		expect(target.textContent).toContain('A'); // Initial

		unmount(instance);
	});

	it('handles follow button click', async () => {
		const target = document.createElement('div');
		const instance = mount(ActorResult, {
			target,
			props: { actor: mockActor },
		});
		await flushSync();

		const btn = target.querySelector('.actor-result__follow') as HTMLButtonElement;
		btn.dispatchEvent(new Event('click', { bubbles: true }));
		await flushSync();

		expect(mockHandlers.onFollow).toHaveBeenCalledWith('1');

		unmount(instance);
	});

	it('handles card click', async () => {
		const target = document.createElement('div');
		const instance = mount(ActorResult, {
			target,
			props: { actor: mockActor },
		});
		await flushSync();

		const card = target.querySelector('.actor-result__interactive') as HTMLElement;
		card.click(); // Standard click should work for onclick binding
		await flushSync();

		expect(mockHandlers.onActorClick).toHaveBeenCalledWith(mockActor);

		unmount(instance);
	});

	it('handles keydown on card', async () => {
		const target = document.createElement('div');
		const instance = mount(ActorResult, {
			target,
			props: { actor: mockActor },
		});
		await flushSync();

		const card = target.querySelector('.actor-result__interactive') as HTMLElement;
		card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await flushSync();

		expect(mockHandlers.onActorClick).toHaveBeenCalledWith(mockActor);

		unmount(instance);
	});

	it('sanitizes bio HTML before rendering', async () => {
		const target = document.createElement('div');
		const instance = mount(ActorResult, {
			target,
			props: {
				actor: {
					...mockActor,
					bio: '<p>Bio</p><img src=x onerror="alert(1)" /><a href="javascript:alert(1)">bad</a>',
				},
			},
		});
		await flushSync();

		const bio = target.querySelector('.actor-result__bio-content') as HTMLElement | null;
		expect(bio).toBeTruthy();
		expect(bio?.innerHTML).toContain('<p>Bio</p>');
		expect(bio?.innerHTML).not.toContain('<img');
		expect(bio?.innerHTML).not.toContain('onerror');
		expect(bio?.innerHTML).not.toContain('javascript:');

		unmount(instance);
	});
});
