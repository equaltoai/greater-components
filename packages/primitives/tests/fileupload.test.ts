import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import FileUpload from '../src/components/FileUpload.svelte';

const createFileList = (files: File[]): FileList => {
  const fileList: Record<number, File> & { length: number; item: (index: number) => File | null } = {
    length: files.length,
    item: (index: number) => files[index] ?? null
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
      props: { multiple: true, onchange: handleChange }
    });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [
      new File(['alpha'], 'alpha.png', { type: 'image/png' }),
      new File(['beta'], 'beta.txt', { type: 'text/plain' })
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
});
