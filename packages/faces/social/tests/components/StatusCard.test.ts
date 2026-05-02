import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import StatusCard from '../../src/components/StatusCard.svelte';
import type { Status } from '../../src/types';

describe('StatusCard', () => {
	const mockAccount = {
		id: 'acc1',
		username: 'testuser',
		acct: 'testuser',
		displayName: 'Test User',
		url: 'https://example.com/@testuser',
		avatar: 'avatar.jpg',
		header: 'header.jpg',
		followersCount: 100,
		followingCount: 50,
		statusesCount: 10,
		note: 'Bio',
		createdAt: new Date().toISOString(),
		bot: false,
	};

	const mockStatus: Status = {
		id: 'status1',
		uri: 'https://example.com/status/1',
		url: 'https://example.com/@testuser/1',
		account: mockAccount,
		content: '<p>Hello world</p>',
		createdAt: new Date().toISOString(),

		repliesCount: 5,
		reblogsCount: 10,
		favouritesCount: 15,
		reblogged: false,
		favourited: false,
		bookmarked: false,
		mediaAttachments: [],
		mentions: [],
		tags: [],
		visibility: 'public',
		spoilerText: '',
		sensitive: false,
	};

	it('renders status content', () => {
		render(StatusCard, { props: { status: mockStatus } });
		expect(screen.getByText('Test User')).toBeTruthy();
		expect(screen.getByText('@testuser')).toBeTruthy();
		expect(screen.getByText(/Hello world/)).toBeTruthy();
	});

	it('renders optional browser validation hooks', () => {
		const { container } = render(StatusCard, {
			props: { status: mockStatus, testId: 'public-status-card', dataStatusId: mockStatus.id },
		});

		const article = container.querySelector('[data-testid="public-status-card"]');
		expect(article).toBeTruthy();
		expect(article?.getAttribute('data-status-id')).toBe(mockStatus.id);
	});

	it('renders bot badge', () => {
		const botAccount = { ...mockAccount, bot: true };
		const botStatus = { ...mockStatus, account: botAccount };
		render(StatusCard, { props: { status: botStatus } });
		expect(screen.getByText('BOT')).toBeTruthy();
	});

	it('renders reply indicator', () => {
		const replyStatus: Status = {
			...mockStatus,
			inReplyToId: '123',
			inReplyToAccount: {
				...mockAccount,
				id: 'acc2',
				username: 'otheruser',
				displayName: 'Other User',
			},
		};

		render(StatusCard, { props: { status: replyStatus } });
		expect(screen.getByText('Replying to')).toBeTruthy();
		expect(screen.getByText(/Other User/)).toBeTruthy();
	});

	it('renders reblog header', () => {
		const reblogStatus: Status = {
			...mockStatus,
			reblog: {
				...mockStatus,
				id: 'status2',
				content: '<p>Boosted content</p>',
			},
		};

		render(StatusCard, { props: { status: reblogStatus } });
		expect(screen.getByText('Test User boosted')).toBeTruthy();
		expect(screen.getByText(/Boosted content/)).toBeTruthy();
	});

	it('handles different media types', () => {
		const mediaStatus: Status = {
			...mockStatus,
			mediaAttachments: [
				{
					id: 'm1',
					type: 'image',
					url: 'img.jpg',
					previewUrl: 'prev.jpg',
				},
				{
					id: 'm2',
					type: 'video',
					url: 'vid.mp4',
					previewUrl: 'poster.jpg',
				},
				{
					id: 'm3',
					type: 'audio',
					url: 'audio.mp3',
				},
				{
					id: 'm4',
					type: 'unknown', // Fallback to file
					url: 'file.pdf',
				},
			],
		};

		const { container } = render(StatusCard, { props: { status: mediaStatus } });

		// Image - use class selector for specificity or check existence
		const mediaImage = container.querySelector('.media-image');
		expect(mediaImage).toBeTruthy();

		// Video
		const video = container.querySelector('video');
		expect(video).toBeTruthy();

		// Audio
		const audio = container.querySelector('audio');
		expect(audio).toBeTruthy();

		// File (SVG icon or text)
		expect(screen.getByText('Attachment')).toBeTruthy();
	});

	it('handles media categories', () => {
		const mediaStatus: Status = {
			...mockStatus,
			mediaAttachments: [
				{ id: 'c1', type: 'unknown', url: 'img.jpg', mediaCategory: 'IMAGE' },
				{ id: 'c2', type: 'unknown', url: 'vid.mp4', mediaCategory: 'VIDEO' },
				{ id: 'c3', type: 'unknown', url: 'vid.mp4', mediaCategory: 'GIFV' },
				{ id: 'c4', type: 'unknown', url: 'audio.mp3', mediaCategory: 'AUDIO' },
				{ id: 'c5', type: 'unknown', url: 'file.pdf', mediaCategory: 'unknown' },
			],
		};

		render(StatusCard, { props: { status: mediaStatus } });
		// Just verify it doesn't crash and renders *something* for each
		const items = document.querySelectorAll('.media-item');
		expect(items.length).toBe(5);
	});

	it('shows sensitive content overlay', async () => {
		const sensitiveStatus: Status = {
			...mockStatus,
			mediaAttachments: [
				{
					id: 'm1',
					type: 'image',
					url: 'image.jpg',
					previewUrl: 'preview.jpg',
					sensitive: true,
					spoilerText: 'Warning',
				},
			],
		};

		render(StatusCard, { props: { status: sensitiveStatus } });

		expect(screen.getByText('Sensitive content')).toBeTruthy();
		expect(screen.getByText('Warning')).toBeTruthy();

		const revealButton = screen.getByText('Show media');
		await fireEvent.click(revealButton);

		expect(screen.queryByText('Show media')).toBeNull();
		expect(screen.getByText('Sensitive')).toBeTruthy();
	});

	it('handles card click navigation', async () => {
		const onclick = vi.fn();
		render(StatusCard, { props: { status: mockStatus, onclick } });

		const article = screen.getByRole('button', { name: /Status by/ });
		await fireEvent.click(article);

		expect(onclick).toHaveBeenCalledWith(mockStatus);
	});

	it('does not trigger onclick when clicking links or buttons', async () => {
		const onclick = vi.fn();
		render(StatusCard, { props: { status: mockStatus, onclick } });

		// Simulate clicking the avatar link
		const avatarLink = screen.getByRole('link', { name: /View .* profile/ });
		await fireEvent.click(avatarLink);

		expect(onclick).not.toHaveBeenCalled();
	});

	it('drops unsafe account and reply href schemes', () => {
		const unsafeStatus: Status = {
			...mockStatus,
			account: {
				...mockAccount,
				url: 'javascript:alert(1)',
			},
			inReplyToStatus: {
				...mockStatus,
				id: 'reply-1',
				url: 'data:text/html,<script>alert(1)</script>',
			},
		};

		const { container } = render(StatusCard, { props: { status: unsafeStatus } });

		expect(container.querySelector('.avatar-link[href]')).toBeNull();
		expect(container.querySelector('.display-name[href]')).toBeNull();
		expect(container.querySelector('.reply-indicator__link[href]')).toBeNull();
		expect(container.innerHTML).not.toContain('javascript:');
		expect(container.innerHTML).not.toContain('data:text/html');
	});

	it('triggers onclick on Enter keypress', async () => {
		const onclick = vi.fn();
		render(StatusCard, { props: { status: mockStatus, onclick } });

		const article = screen.getByRole('button', { name: /Status by/ });
		await fireEvent.keyPress(article, { key: 'Enter', code: 'Enter', charCode: 13 });

		expect(onclick).toHaveBeenCalledWith(mockStatus);
	});
});
