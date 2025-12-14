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

		Object.defineProperty(input, 'files', { value: [file] });
		input.dispatchEvent(new Event('change', { bubbles: true }));

		await new Promise((resolve) => setTimeout(resolve, 10)); // Allow async
		await flushSync();

		expect(mockHandlers.onUploadMedia).toHaveBeenCalled();
		expect(onAttachmentsChange).toHaveBeenCalledWith(['m1']);
		expect(target.querySelector('.media-upload__preview-image')).toBeTruthy();

		unmount(instance);
	});

	it('shows error on large file', async () => {
		const target = document.createElement('div');
		const instance = mount(MediaUpload, { target, props: { maxFileSize: 10 } }); // 10 bytes max
		await flushSync();

		const file = new File(['content is longer than 10 bytes'], 'test.png', { type: 'image/png' });
		const input = target.querySelector('input[type="file"]') as HTMLInputElement;

		Object.defineProperty(input, 'files', { value: [file] });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();

		expect(target.querySelector('.media-upload__error')).toBeTruthy();
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
			mediaCategory: 'IMAGE',
		});

		Object.defineProperty(input, 'files', { value: [file] });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		expect(target.querySelectorAll('.media-upload__preview').length).toBe(1);

		const removeBtn = target.querySelector('.media-upload__remove') as HTMLButtonElement;
		removeBtn.click();
		await flushSync();

		expect(target.querySelectorAll('.media-upload__preview').length).toBe(0);

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
		});

		Object.defineProperty(input, 'files', { value: [file] });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await flushSync();

		// Check toggle
		const toggle = target.querySelector('.media-upload__field--toggle input') as HTMLInputElement;
		toggle.checked = true;
		toggle.dispatchEvent(new Event('change', { bubbles: true }));
		await flushSync();

		expect(target.querySelector('.media-upload__overlay--sensitive')).toBeTruthy();

		unmount(instance);
	});
});
