import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import DropZone from '../src/components/DropZone.svelte';

// Mock FileReader
class MockFileReader {
	onload: any;
	onerror: any;
	result: any;
	readAsText(blob: Blob) {
		if (blob.size === -1) {
			// Simulate error
			if (this.onerror) {
				this.error = new DOMException('Simulated read error');
				this.onerror();
			}
		} else {
			this.result = 'file content';
			if (this.onload) this.onload();
		}
	}
	readAsDataURL(blob: Blob) {
		if (blob.size === -1) {
			// Simulate error
			if (this.onerror) {
				this.error = new DOMException('Simulated read error');
				this.onerror();
			}
		} else {
			this.result = 'data:image/png;base64,test';
			if (this.onload) this.onload();
		}
	}
	error: any;
}
global.FileReader = MockFileReader as any;

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
	value: {
		randomUUID: () => 'test-uuid',
	},
});

describe('DropZone.svelte', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders correctly', () => {
		const { container } = render(DropZone);
		const dropzone = container.querySelector('.gr-drop-zone');
		expect(dropzone).toBeTruthy();
	});

	it('applies active class on drag enter', async () => {
		const onDragEnter = vi.fn();
		const { getByRole } = render(DropZone, { props: { onDragEnter } });
		const dropzone = getByRole('button');

		await fireEvent.dragEnter(dropzone);
		expect(dropzone.classList.contains('gr-drop-zone--active')).toBe(true);
		expect(onDragEnter).toHaveBeenCalled();
	});

	it('removes active class on drag leave', async () => {
		const onDragLeave = vi.fn();
		const { getByRole } = render(DropZone, { props: { onDragLeave } });
		const dropzone = getByRole('button');

		await fireEvent.dragEnter(dropzone);
		await fireEvent.dragLeave(dropzone);
		expect(dropzone.classList.contains('gr-drop-zone--active')).toBe(false);
		expect(onDragLeave).toHaveBeenCalled();
	});

	it('handles file drop (text file)', async () => {
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { onDrop, accept: { files: ['.txt'] } } });
		const dropzone = getByRole('button');

		const file = new File(['content'], 'test.txt', { type: 'text/plain' });

		const dataTransfer = {
			files: [file],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		await waitFor(() => expect(onDrop).toHaveBeenCalled());

		const droppedItems = onDrop.mock.calls[0][0];
		expect(droppedItems).toHaveLength(1);
		expect(droppedItems[0].file).toBe(file);
		expect(droppedItems[0].content).toBe('file content'); // From MockFileReader
		expect(droppedItems[0].type).toBe('file');
	});

	it('handles file drop (image file as dataURL)', async () => {
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { onDrop, accept: { files: ['.png'] } } });
		const dropzone = getByRole('button');

		const file = new File(['image'], 'test.png', { type: 'image/png' });

		const dataTransfer = {
			files: [file],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		await waitFor(() => expect(onDrop).toHaveBeenCalled());

		const droppedItems = onDrop.mock.calls[0][0];
		expect(droppedItems[0].content).toBe('data:image/png;base64,test'); // From MockFileReader
	});

	it('handles multiple files drop', async () => {
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { onDrop, multiple: true } });
		const dropzone = getByRole('button');

		const file1 = new File(['c1'], 'test1.txt', { type: 'text/plain' });
		const file2 = new File(['c2'], 'test2.txt', { type: 'text/plain' });

		const dataTransfer = {
			files: [file1, file2],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		await waitFor(() => expect(onDrop).toHaveBeenCalled());
		expect(onDrop.mock.calls[0][0]).toHaveLength(2);
	});

	it('rejects multiple files if multiple=false', async () => {
		const onError = vi.fn();
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { onError, onDrop, multiple: false } });
		const dropzone = getByRole('button');

		const file1 = new File(['c1'], 'test1.txt', { type: 'text/plain' });
		const file2 = new File(['c2'], 'test2.txt', { type: 'text/plain' });

		const dataTransfer = {
			files: [file1, file2],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'TOO_MANY_FILES' }));
		expect(onDrop).not.toHaveBeenCalled();
	});

	it('enforces maxFiles limit', async () => {
		const onError = vi.fn();
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { onError, onDrop, maxFiles: 1 } });
		const dropzone = getByRole('button');

		const file1 = new File(['c1'], 'test1.txt', { type: 'text/plain' });
		const file2 = new File(['c2'], 'test2.txt', { type: 'text/plain' });

		const dataTransfer = {
			files: [file1, file2],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'TOO_MANY_FILES' }));
		expect(onDrop).not.toHaveBeenCalled();
	});

	it('handles text drop', async () => {
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { onDrop, accept: { text: true } } });
		const dropzone = getByRole('button');

		const dataTransfer = {
			files: [],
			types: ['text/plain'],
			getData: vi.fn((type) => (type === 'text/plain' ? 'dropped text' : '')),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		expect(onDrop).toHaveBeenCalled();
		const droppedItems = onDrop.mock.calls[0][0];
		expect(droppedItems).toHaveLength(1);
		expect(droppedItems[0].type).toBe('text');
		expect(droppedItems[0].content).toBe('dropped text');
	});

	it('handles URL drop', async () => {
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { onDrop, accept: { urls: true } } });
		const dropzone = getByRole('button');

		const dataTransfer = {
			files: [],
			types: ['text/plain'], // URLs often come as text
			getData: vi.fn((type) => (type === 'text/plain' ? 'https://example.com' : '')),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		expect(onDrop).toHaveBeenCalled();
		const droppedItems = onDrop.mock.calls[0][0];
		expect(droppedItems[0].type).toBe('url');
		expect(droppedItems[0].content).toBe('https://example.com');
	});

	it('validates file type', async () => {
		const onError = vi.fn();
		const { getByRole } = render(DropZone, { props: { onError, accept: { files: ['.png'] } } });
		const dropzone = getByRole('button');

		const file = new File(['content'], 'test.txt', { type: 'text/plain' });

		const dataTransfer = {
			files: [file],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'INVALID_TYPE' }));
	});

	it('validates file size', async () => {
		const onError = vi.fn();
		const { getByRole } = render(DropZone, { props: { onError, maxSize: 10 } }); // 10 bytes
		const dropzone = getByRole('button');

		// Create a file larger than 10 bytes
		const file = new File(['a'.repeat(20)], 'large.txt', { type: 'text/plain' });
		Object.defineProperty(file, 'size', { value: 20 }); // Ensure size is set

		const dataTransfer = {
			files: [file],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'FILE_TOO_LARGE' }));
	});

	it('handles read errors', async () => {
		const onError = vi.fn();
		const { getByRole } = render(DropZone, { props: { onError } });
		const dropzone = getByRole('button');

		// Mock file that causes read error (using size -1 as trigger in MockFileReader)
		const file = new File(['error'], 'error.txt', { type: 'text/plain' });
		Object.defineProperty(file, 'size', { value: -1 });

		const dataTransfer = {
			files: [file],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};

		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);

		await waitFor(() =>
			expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'READ_ERROR' }))
		);
	});

	it('does not handle drag/drop when disabled', async () => {
		const onDragEnter = vi.fn();
		const onDrop = vi.fn();
		const { getByRole } = render(DropZone, { props: { disabled: true, onDragEnter, onDrop } });
		const dropzone = getByRole('button');

		await fireEvent.dragEnter(dropzone);
		expect(onDragEnter).not.toHaveBeenCalled();

		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		const dataTransfer = {
			files: [file],
			types: ['Files'],
			getData: vi.fn().mockReturnValue(''),
		};
		const dropEvent = new Event('drop', { bubbles: true });
		Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

		await fireEvent(dropzone, dropEvent);
		expect(onDrop).not.toHaveBeenCalled();
	});

	it('triggers file input on click', async () => {
		const { getByRole, container } = render(DropZone);
		const dropzone = getByRole('button');
		const input = container.querySelector('input') as HTMLInputElement;

		const clickSpy = vi.spyOn(input, 'click');

		await fireEvent.click(dropzone);
		expect(clickSpy).toHaveBeenCalled();
	});

	it('handles file input change', async () => {
		const onDrop = vi.fn();
		const { container } = render(DropZone, { props: { onDrop } });
		const input = container.querySelector('input') as HTMLInputElement;

		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		Object.defineProperty(input, 'files', { value: [file] });

		await fireEvent.change(input);

		await waitFor(() => expect(onDrop).toHaveBeenCalled());
		expect(onDrop.mock.calls[0][0]).toHaveLength(1);
	});
});
