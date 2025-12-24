import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Root from '../../../src/components/Status/Root.svelte';
import type { GenericStatus } from '../../../src/generics/index';

describe('Status.Root', () => {
	const mockAccount = {
		type: 'Person',
		id: '1',
		username: 'alice',
		displayName: 'Alice',
		avatar: 'url',
		url: 'url',
	};

	const mockStatus: GenericStatus = {
		id: '1',
		account: mockAccount as any,
		content: 'Hello',
		createdAt: '2023-01-01T00:00:00Z',
		visibility: 'public',
		uri: 'uri',
		url: 'url',
		mentions: [],
		tags: [],
		emojis: [],
		mediaAttachments: [],
		repliesCount: 0,
		reblogsCount: 0,
		favouritesCount: 0,
		favourited: false,
		reblogged: false,
		sensitive: false,
		spoilerText: '',
	};

	it('renders children when status is valid', () => {
		render(Root, { status: mockStatus });
		const article = screen.getByRole('article');
		expect(article).toBeTruthy();
		expect(article.classList.contains('status-root')).toBe(true);
	});

	it('renders tombstone when status is deleted', () => {
		const deletedStatus = {
			...mockStatus,
			metadata: { lesser: { isDeleted: true, deletedAt: '2023-01-02T00:00:00Z' } },
		};

		render(Root, { status: deletedStatus as any });

		expect(screen.getByText('This post has been deleted.')).toBeTruthy();
		expect(screen.getByText(/Deleted/)).toBeTruthy();
		expect(screen.queryByRole('article')).not.toHaveClass('status-root--clickable');
		// Note: The root element IS the article, so queryByRole('article') finds it.
		// But we check content.
	});

	it('handles clickable configuration', async () => {
		const onClick = vi.fn();
		render(Root, {
			status: mockStatus,
			config: { clickable: true },
			handlers: { onClick },
		});

		const article = screen.getByRole('button'); // role becomes button when clickable
		expect(article).toBeTruthy();

		await fireEvent.click(article);
		expect(onClick).toHaveBeenCalledWith(mockStatus);
	});

	it('ignores clicks on interactive elements', async () => {
		const onClick = vi.fn();
		// Since we can't easily inject children with event listeners in this setup without a wrapper,
		// we can simulate the event target being a button.

		const { container } = render(Root, {
			status: mockStatus,
			config: { clickable: true },
			handlers: { onClick },
		});

		const article = container.querySelector('.status-root');

		// Mock event
		const button = document.createElement('button');
		article?.appendChild(button);

		await fireEvent.click(button);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('handles keyboard activation', async () => {
		const onClick = vi.fn();
		render(Root, {
			status: mockStatus,
			config: { clickable: true },
			handlers: { onClick },
		});

		const article = screen.getByRole('button');

		await fireEvent.keyPress(article, { key: 'Enter' });
		expect(onClick).toHaveBeenCalled();

		onClick.mockClear();
		await fireEvent.keyPress(article, { key: ' ' });
		expect(onClick).toHaveBeenCalled();
	});

	it('handles reblogs', () => {
		const reblog = { ...mockStatus, id: '2', content: 'Original' };
		const status = { ...mockStatus, id: '3', reblog };

		// Root doesn't render content itself, but it sets up context.
		// We can verify reblog logic via props passed to context if we could inspect it,
		// but here we just ensure it renders without error.
		render(Root, { status: status as any });
		expect(screen.getByRole('article')).toBeTruthy();
	});
});
