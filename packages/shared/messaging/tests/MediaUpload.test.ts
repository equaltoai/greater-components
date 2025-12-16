import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import MediaUpload from '../src/MediaUpload.svelte';

// Mock context
const { mockHandlers } = vi.hoisted(() => ({
	mockHandlers: {
		onUploadMedia: vi.fn(),
	},
}));

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getMessagesContext: () => ({
			handlers: mockHandlers,
		}),
	};
});

// Mock external helper
vi.mock('@equaltoai/greater-components-compose', () => ({
	MediaUploadHandler: {
		mapMimeTypeToMediaCategory: (type: string) => {
			if (type.startsWith('image/')) return 'IMAGE';
			if (type.startsWith('video/')) return 'VIDEO';
			if (type.startsWith('audio/')) return 'AUDIO';
			return 'DOCUMENT';
		},
	},
}));

// Mock headless button
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: (config: any) => ({
		actions: {
			button: (node: HTMLElement) => {
				const handler = (e: Event) => {
					if (!(node as HTMLButtonElement).disabled) {
						config.onClick?.(e);
					}
				};
				node.addEventListener('click', handler);
				return {
					destroy: () => node.removeEventListener('click', handler),
				};
			},
		},
	}),
}));

// Mock URL
window.URL.createObjectURL = vi.fn(() => 'blob:mock');
window.URL.revokeObjectURL = vi.fn();

describe('MediaUpload', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders upload button', () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });

		expect(target.querySelector('.media-upload__button')).toBeTruthy();
		expect(target.querySelector('input[type="file"]')).toBeTruthy();

		unmount(instance);
	});

	it('handles file selection and upload', async () => {
		const target = document.createElement('div');
		const onAttachmentsChange = vi.fn();
		const instance = mount(MediaUpload, { target, props: { onAttachmentsChange } });
		await flushSync();

		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		mockHandlers.onUploadMedia.mockResolvedValue({
			id: 'm1',
			url: 'https://example.com/test.png',
			previewUrl: 'blob:preview',
			mediaCategory: 'IMAGE',
		});

		Object.defineProperty(input, 'files', { value: [file], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));

		await new Promise((resolve) => setTimeout(resolve, 10)); // Allow async
		await flushSync();

		expect(mockHandlers.onUploadMedia).toHaveBeenCalled();
		expect(onAttachmentsChange).toHaveBeenCalledWith(['m1']);
		expect(target.querySelector('.media-upload__preview-image')).toBeTruthy();

		unmount(instance);
	});

	it('handles empty file selection', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });
		await flushSync();

		const input = target.querySelector('input[type="file"]') as HTMLInputElement;
		Object.defineProperty(input, 'files', { value: [], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();

		expect(mockHandlers.onUploadMedia).not.toHaveBeenCalled();
		unmount(instance);
	});

	it('shows error on large file', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target, props: { maxFileSize: 10 } }); // 10 bytes max
		await flushSync();

		const file = new File(['content is longer than 10 bytes'], 'test.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		Object.defineProperty(input, 'files', { value: [file], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();

		expect(target.querySelector('.media-upload__error')).toBeTruthy();
		expect(mockHandlers.onUploadMedia).not.toHaveBeenCalled();

		unmount(instance);
	});

	it('shows error when exceeding max attachments', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target, props: { maxAttachments: 1 } });
		await flushSync();

		const file1 = new File(['1'], '1.png', { type: 'image/png' });
		const file2 = new File(['2'], '2.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		// Mock first upload success to fill the slot (if we did sequential, but here we try to add 2 at once)
		// Or try to add 2 files when max is 1
		Object.defineProperty(input, 'files', { value: [file1, file2], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();

		expect(target.querySelector('.media-upload__error')).toBeTruthy();
		expect(target.querySelector('.media-upload__error')?.textContent).toContain('Maximum 1 attachment allowed');
		expect(mockHandlers.onUploadMedia).not.toHaveBeenCalled();

		unmount(instance);
	});

	it('removes attachment', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });
		await flushSync();

		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		mockHandlers.onUploadMedia.mockResolvedValue({
			id: 'm1',
			url: 'https://example.com/test.png',
			previewUrl: 'blob:preview',
			mediaCategory: 'IMAGE',
		});

		Object.defineProperty(input, 'files', { value: [file], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		expect(target.querySelectorAll('.media-upload__preview').length).toBe(1);

		const removeBtn = target.querySelector('.media-upload__remove') as HTMLButtonElement;
		removeBtn.click();
		await flushSync();

		expect(target.querySelectorAll('.media-upload__preview').length).toBe(0);
		expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview');

		unmount(instance);
	});

	it('toggles sensitive content', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });
		await flushSync();

		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		mockHandlers.onUploadMedia.mockResolvedValue({
			id: 'm1',
			url: 'url',
			sensitive: false,
			mediaCategory: 'IMAGE',
		});

		Object.defineProperty(input, 'files', { value: [file], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		// Check toggle
		const toggle = target.querySelector('.media-upload__field--toggle input') as HTMLInputElement;
		toggle.checked = true;
		toggle.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();

		expect(target.querySelector('.media-upload__overlay--sensitive')).toBeTruthy();
		expect(target.querySelector('.media-upload__preview--blurred')).toBeTruthy();

		// Reveal
		const revealBtn = target.querySelector('.media-upload__reveal') as HTMLButtonElement;
		revealBtn.click();
		await flushSync();

		expect(target.querySelector('.media-upload__overlay--sensitive')).toBeFalsy();
		expect(target.querySelector('.media-upload__badge')).toBeTruthy();

		unmount(instance);
	});

	it('handles metadata updates', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });
		await flushSync();

		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		mockHandlers.onUploadMedia.mockResolvedValue({
			id: 'm1',
			url: 'url',
			mediaCategory: 'IMAGE',
			spoilerText: '',
			description: '',
		});

		Object.defineProperty(input, 'files', { value: [file], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		// Spoiler
		const spoilerInput = target.querySelector('input[placeholder="Optional warning before media"]') as HTMLInputElement;
		spoilerInput.value = 'Spoiler Alert';
		spoilerInput.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();
		expect(spoilerInput.value).toBe('Spoiler Alert');

		// Description
		const descInput = target.querySelector('textarea') as HTMLTextAreaElement;
		descInput.value = 'A description';
		descInput.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();
		expect(descInput.value).toBe('A description');

		// Category
		const categorySelect = target.querySelector('select') as HTMLSelectElement;
		categorySelect.value = 'VIDEO';
		categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();
		expect(categorySelect.value).toBe('VIDEO');

		unmount(instance);
	});

	it('renders different media types', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });
		await flushSync();

		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		// Video
		const videoFile = new File(['v'], 'v.mp4', { type: 'video/mp4' });
		mockHandlers.onUploadMedia.mockResolvedValueOnce({
			id: 'v1',
			url: 'v.mp4',
			mediaCategory: 'VIDEO',
		});

		Object.defineProperty(input, 'files', { value: [videoFile], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		expect(target.querySelector('.media-upload__preview-video')).toBeTruthy();

		// Audio
		const audioFile = new File(['a'], 'a.mp3', { type: 'audio/mpeg' });
		mockHandlers.onUploadMedia.mockResolvedValueOnce({
			id: 'a1',
			url: 'a.mp3',
			mediaCategory: 'AUDIO',
		});
		
		Object.defineProperty(input, 'files', { value: [audioFile], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		expect(target.querySelector('.media-upload__preview-audio')).toBeTruthy();

		// Document
		const docFile = new File(['d'], 'd.pdf', { type: 'application/pdf' });
		mockHandlers.onUploadMedia.mockResolvedValueOnce({
			id: 'd1',
			url: 'd.pdf',
			mediaCategory: 'DOCUMENT',
		});

		Object.defineProperty(input, 'files', { value: [docFile], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		expect(target.querySelector('.media-upload__preview-file')).toBeTruthy();

		unmount(instance);
	});

	it('handles upload failure gracefully', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });
		await flushSync();

		const file = new File(['content'], 'fail.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		mockHandlers.onUploadMedia.mockRejectedValue(new Error('Upload failed'));

		Object.defineProperty(input, 'files', { value: [file], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		expect(target.querySelector('.media-upload__error')).toBeTruthy();
		expect(target.querySelector('.media-upload__error')?.textContent).toContain('Upload failed');
		
		// Spinner should be gone
		expect(target.querySelector('.media-upload__spinner')).toBeFalsy();

		unmount(instance);
	});

	it('handles upload returning null (cancelled/failed silently)', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target });
		await flushSync();

		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		mockHandlers.onUploadMedia.mockResolvedValue(null);

		Object.defineProperty(input, 'files', { value: [file], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		expect(mockHandlers.onUploadMedia).toHaveBeenCalled();
		expect(target.querySelectorAll('.media-upload__preview').length).toBe(0);

		unmount(instance);
	});
});