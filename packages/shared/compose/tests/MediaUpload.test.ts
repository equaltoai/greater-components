import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MediaUpload from '../src/MediaUpload.svelte';
import * as MediaUploadHandler from '../src/MediaUploadHandler.js';

// Mock MediaUploadHandler
vi.mock('../src/MediaUploadHandler.js', async (importOriginal) => {
	const actual = await importOriginal<typeof MediaUploadHandler>();
	return {
		...actual,
		validateFiles: vi.fn(),
		processFiles: vi.fn(),
		formatFileSize: vi.fn((size) => `${size} B`),
		cleanupMediaFiles: vi.fn(),
	};
});

// Mock headless button
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: () => ({
		actions: {
			button: (node: HTMLElement) => ({
				destroy: () => {},
			}),
		},
	}),
}));

describe('MediaUpload', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.URL.createObjectURL = vi.fn(() => 'blob:test');
		global.URL.revokeObjectURL = vi.fn();
	});

	it('should render drop zone initially', () => {
		render(MediaUpload);
		expect(screen.getByText(/Click or drag files to upload/)).toBeTruthy();
	});

	it('should handle file selection', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				previewUrl: 'blob:test',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', {
			value: [file],
		});
		
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('test.jpg')).toBeTruthy();
		});
	});

	it('should show error on validation failure', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ 
			valid: false, 
			errors: ['File too large'] 
		});

		const { container } = render(MediaUpload);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', {
			value: [file],
		});
		
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('File too large')).toBeTruthy();
		});
	});

	it('should call onUpload for selected files', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const onUpload = vi.fn().mockResolvedValue({
			id: 'server-id-1',
			url: 'https://example.com/test.jpg',
		});
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				previewUrl: 'blob:test',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload, { onUpload });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', {
			value: [file],
		});
		
		await fireEvent.change(input);

		await waitFor(() => {
			expect(onUpload).toHaveBeenCalled();
		});
	});

	it('should allow removing files', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				previewUrl: 'blob:test',
				progress: 100,
				status: 'complete',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
				serverId: 'server-1',
			},
		]);

		const onRemove = vi.fn();
		const { container } = render(MediaUpload, { onRemove });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', {
			value: [file],
		});
		
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('test.jpg')).toBeTruthy();
		});

		const removeBtn = screen.getByLabelText('Remove file');
		await fireEvent.click(removeBtn);

		expect(screen.queryByText('test.jpg')).toBeFalsy();
		expect(onRemove).toHaveBeenCalledWith('server-1');
	});

	it('should update file metadata', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				previewUrl: 'blob:test',
				progress: 100,
				status: 'complete',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', {
			value: [file],
		});
		
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('Sensitive content')).toBeTruthy();
		});

		// Toggle sensitive
		const sensitiveCheckbox = screen.getByLabelText('Sensitive content');
		await fireEvent.click(sensitiveCheckbox);
		expect((sensitiveCheckbox as HTMLInputElement).checked).toBe(true);

		// Edit description
		const descriptionInput = screen.getByPlaceholderText('Describe the media for accessibility');
		await fireEvent.input(descriptionInput, { target: { value: 'New description' } });
		expect((descriptionInput as HTMLTextAreaElement).value).toBe('New description');
	});

	it('should update spoiler text', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				progress: 100,
				status: 'complete',
				sensitive: true, // Initially sensitive
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		Object.defineProperty(input, 'files', { value: [file] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByPlaceholderText('Optional warning shown before media')).toBeTruthy();
		});

		const spoilerInput = screen.getByPlaceholderText('Optional warning shown before media');
		await fireEvent.input(spoilerInput, { target: { value: 'Spoiler alert' } });
		expect((spoilerInput as HTMLInputElement).value).toBe('Spoiler alert');
	});

	it('should handle media category change', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				progress: 100,
				status: 'complete',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		Object.defineProperty(input, 'files', { value: [file] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByRole('combobox')).toBeTruthy();
		});

		const select = screen.getByRole('combobox');
		await fireEvent.change(select, { target: { value: 'VIDEO' } });
		expect((select as HTMLSelectElement).value).toBe('VIDEO');
	});

	it('should handle multiple files ordering/removal', async () => {
		const file1 = new File([''], '1.jpg', { type: 'image/jpeg' });
		const file2 = new File([''], '2.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{ id: '1', file: file1, type: 'image', status: 'pending', progress: 0, sensitive: false, spoilerText: '', mediaCategory: 'IMAGE', metadata: { size: 100 } },
			{ id: '2', file: file2, type: 'image', status: 'pending', progress: 0, sensitive: false, spoilerText: '', mediaCategory: 'IMAGE', metadata: { size: 100 } }
		]);

		const onRemove = vi.fn();
		const { container } = render(MediaUpload, { onRemove });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', { value: [file1, file2] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('1.jpg')).toBeTruthy();
			expect(screen.getByText('2.jpg')).toBeTruthy();
		});

		// Check order by querying filenames
		const filenames = screen.getAllByText(/\d\.jpg/).map(el => el.textContent);
		expect(filenames).toEqual(['1.jpg', '2.jpg']);

		// Remove first file
		const removeBtns = screen.getAllByLabelText('Remove file');
		await fireEvent.click(removeBtns[0]);

		expect(screen.queryByText('1.jpg')).toBeFalsy();
		expect(screen.getByText('2.jpg')).toBeTruthy();
	});

	it('should handle upload error (Error object)', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const onUpload = vi.fn().mockRejectedValue(new Error('Network error'));
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload, { onUpload });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		Object.defineProperty(input, 'files', { value: [file] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('Network error')).toBeTruthy();
		});
	});

	it('should handle upload error (string)', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const onUpload = vi.fn().mockRejectedValue('String error');
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload, { onUpload });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		Object.defineProperty(input, 'files', { value: [file] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('String error')).toBeTruthy();
		});
	});

	it('should handle upload error (unknown)', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const onUpload = vi.fn().mockRejectedValue({ some: 'object' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload, { onUpload });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		Object.defineProperty(input, 'files', { value: [file] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('Upload failed')).toBeTruthy();
		});
	});

	it('should handle drag and drop', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				previewUrl: 'blob:test',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		render(MediaUpload);
		
		const dropZone = screen.getByRole('button', { name: /Click or drag files/ });

		// Trigger drop event
		const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
		Object.defineProperty(dropEvent, 'dataTransfer', {
			value: {
				files: [file]
			}
		});

		fireEvent(dropZone, dropEvent);

		await waitFor(() => {
			expect(screen.getByText('test.jpg')).toBeTruthy();
		});
	});

	it('should hide Add More button when max files reached', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				previewUrl: 'blob:test',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload, { maxFiles: 1 });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', { value: [file] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('test.jpg')).toBeTruthy();
		});

		// Check "Add more" is not present
		expect(screen.queryByText('Add more')).toBeFalsy();
	});

	it('should show progress bar when uploading', async () => {
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		
		// Create a promise we can resolve later to control upload duration
		let resolveUpload: (val: any) => void;
		const uploadPromise = new Promise((resolve) => {
			resolveUpload = resolve;
		});

		const onUpload = vi.fn().mockImplementation((file, onProgress) => {
			onProgress(50); // Set progress to 50%
			return uploadPromise;
		});
		
		vi.mocked(MediaUploadHandler.validateFiles).mockReturnValue({ valid: true, errors: [] });
		vi.mocked(MediaUploadHandler.processFiles).mockResolvedValue([
			{
				id: '1',
				file,
				type: 'image',
				previewUrl: 'blob:test',
				progress: 0,
				status: 'pending',
				sensitive: false,
				spoilerText: '',
				mediaCategory: 'IMAGE',
				metadata: { size: 100 },
			},
		]);

		const { container } = render(MediaUpload, { onUpload });
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		
		Object.defineProperty(input, 'files', { value: [file] });
		await fireEvent.change(input);

		await waitFor(() => {
			expect(screen.getByText('50%')).toBeTruthy();
		});
		
		// Cleanup - resolve promise to prevent hanging
		resolveUpload!({ id: '1', url: '' });
	});
});
