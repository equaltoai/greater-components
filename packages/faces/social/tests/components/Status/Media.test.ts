import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Media from '../../../src/components/Status/Media.svelte';

// Mock context state
const mockStatus = {
	mediaAttachments: [] as any[],
};

vi.mock('../../../src/components/Status/context.js', () => ({
	getStatusContext: () => ({
		actualStatus: mockStatus,
	}),
}));

describe('Status.Media', () => {
	beforeEach(() => {
		mockStatus.mediaAttachments = [];
		vi.clearAllMocks();
	});

	it('does not render if no media', () => {
		const { container } = render(Media);
		expect(container.querySelector('.status-media')).toBeNull();
	});

	it('renders single image', () => {
		mockStatus.mediaAttachments = [
			{ id: '1', type: 'image', url: 'img.jpg', description: 'Alt text' },
		];

		render(Media);

		expect(screen.getByRole('img')).toHaveAttribute('src', 'img.jpg');
		expect(screen.getByRole('img')).toHaveAttribute('alt', 'Alt text');
		expect(screen.getByRole('img').closest('.status-media--single')).toBeTruthy();
	});

	it('renders multiple items', () => {
		mockStatus.mediaAttachments = [
			{ id: '1', type: 'image', url: 'img1.jpg', description: 'Image 1' },
			{ id: '2', type: 'image', url: 'img2.jpg', description: 'Image 2' },
		];

		render(Media);

		expect(screen.getAllByRole('img')).toHaveLength(2);
		expect(screen.getAllByRole('img')[0].closest('.status-media--multiple')).toBeTruthy();
	});

	it('renders video', () => {
		mockStatus.mediaAttachments = [
			{ id: '1', type: 'video', url: 'vid.mp4', description: 'Video desc' },
		];

		const { container } = render(Media);

		const video = container.querySelector('video');
		expect(video).toBeTruthy();
		expect(video?.getAttribute('src')).toBe('vid.mp4');
	});

	it('renders audio', () => {
		mockStatus.mediaAttachments = [{ id: '1', type: 'audio', url: 'sound.mp3' }];

		const { container } = render(Media);

		const audio = container.querySelector('audio');
		expect(audio).toBeTruthy();
		expect(audio?.getAttribute('src')).toBe('sound.mp3');
	});

	it('handles sensitive content', async () => {
		mockStatus.mediaAttachments = [
			{ id: '1', type: 'image', url: 'img.jpg', sensitive: true, spoilerText: 'Warning!' },
		];

		render(Media);

		expect(screen.getByText('Sensitive content')).toBeTruthy();
		expect(screen.getByText('Warning!')).toBeTruthy();

		const revealBtn = screen.getByText('Show media');
		await fireEvent.click(revealBtn);

		expect(screen.queryByText('Show media')).toBeNull();
		expect(screen.getByText('Sensitive')).toBeTruthy(); // Badge remains
	});
});
