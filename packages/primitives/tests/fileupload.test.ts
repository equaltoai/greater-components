import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import FileUpload from '../src/components/FileUpload.svelte';

const createFileList = (files: File[]): FileList => {
	const fileList: Record<number, File> & { length: number; item: (index: number) => File | null } =
		{
			length: files.length,
			item: (index: number) => files[index] ?? null,
		};

	files.forEach((file, index) => {
		fileList[index] = file;
	});

	return fileList as unknown as FileList;
};

describe('FileUpload.svelte', () => {
	it('surfaces selected file names and calls onchange', async () => {
		const handleChange = vi.fn();
		const { container, getByText } = render(FileUpload, {
			props: { multiple: true, onchange: handleChange },
		});

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const files = [
			new File(['alpha'], 'alpha.png', { type: 'image/png' }),
			new File(['beta'], 'beta.txt', { type: 'text/plain' }),
		];
		const fileList = createFileList(files);

		await fireEvent.change(input, { target: { files: fileList } });

		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange).toHaveBeenCalledWith(fileList);
		expect(getByText('alpha.png, beta.txt')).toBeTruthy();
	});

	it('clicks the hidden input when the button is pressed', async () => {
		const { container, getByText } = render(FileUpload);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const clickSpy = vi.spyOn(input, 'click');

		await fireEvent.click(getByText('Choose File'));

		expect(clickSpy).toHaveBeenCalled();
		clickSpy.mockRestore();
	});

	it('handles disabled state and empty change events', async () => {
		const handleChange = vi.fn();
		const { container, getByText } = render(FileUpload, {
			props: { disabled: true, onchange: handleChange },
		});

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		await fireEvent.change(input, { target: { files: null } });

		expect(handleChange).toHaveBeenCalledWith(null);
		expect((getByText('Choose File') as HTMLButtonElement).disabled).toBe(true);
	});

	it('rejects invalid file types and oversize files', async () => {
		const handleChange = vi.fn();
		const { container, queryByText } = render(FileUpload, {
			props: { accept: '.png', maxSize: 5, onchange: handleChange },
		});

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const invalidFiles = createFileList([
			new File(['bad'], 'resume.pdf', { type: 'application/pdf' }),
		]);

		await fireEvent.change(input, { target: { files: invalidFiles } });

		expect(handleChange).toHaveBeenCalledWith(null);
		expect(container.querySelector('.gr-file-upload__error')?.textContent).toContain('type');
		expect(queryByText('resume.pdf')).toBeNull();

		const oversizeFile = createFileList([
			new File(['1234567890'], 'large.png', { type: 'image/png' }),
		]);
		await fireEvent.change(input, { target: { files: oversizeFile } });

		expect(handleChange).toHaveBeenCalledWith(null);
		expect(container.querySelector('.gr-file-upload__error')?.textContent).toContain(
			'maximum size'
		);
	});

	it('shows single file selections distinctly from multiple uploads', async () => {
		const { container, getByText } = render(FileUpload);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const files = createFileList([new File(['hello'], 'single.pdf', { type: 'application/pdf' })]);

		await fireEvent.change(input, { target: { files } });

		expect(getByText('Choose File')).toBeTruthy();
		expect(container.querySelector('.gr-file-upload__files')?.textContent).toBe('single.pdf');
	});
});
