import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import MediaComposer from '../../src/patterns/MediaComposer.svelte';

/**
 * Build a File whose reported size is decoupled from its contents, so an
 * "oversized" fixture does not have to allocate 10 MiB.
 */
function makeFile(name: string, type: string, size = 1024): File {
	const file = new File(['fixture'], name, { type });
	Object.defineProperty(file, 'size', { value: size, configurable: true });
	return file;
}

function fileInput(): HTMLInputElement {
	return screen.getByLabelText('Select media files') as HTMLInputElement;
}

async function selectFiles(input: HTMLInputElement, files: File[]) {
	Object.defineProperty(input, 'files', { value: files, configurable: true });
	await fireEvent.change(input);
}

const OVER_LIMIT = 10 * 1024 * 1024 + 1;

afterEach(() => {
	vi.restoreAllMocks();
});

describe('MediaComposer rejection surfacing', () => {
	it('reports type rejections through onReject instead of dropping them', async () => {
		const onReject = vi.fn();
		const onUpload = vi.fn();

		render(MediaComposer, { props: { attachments: [], handlers: { onUpload, onReject } } });

		const rejected = makeFile('notes.pdf', 'application/pdf');
		await selectFiles(fileInput(), [rejected]);

		expect(onReject).toHaveBeenCalledTimes(1);
		expect(onReject).toHaveBeenCalledWith([rejected], {
			kind: 'unsupported-type',
			allowedTypes: expect.arrayContaining(['image/jpeg', 'video/mp4']),
		});
		expect(onUpload).not.toHaveBeenCalled();
	});

	it('reports size rejections with the limit that was exceeded', async () => {
		const onReject = vi.fn();
		const onUpload = vi.fn();

		render(MediaComposer, { props: { attachments: [], handlers: { onUpload, onReject } } });

		const tooBig = makeFile('huge.png', 'image/png', OVER_LIMIT);
		await selectFiles(fileInput(), [tooBig]);

		expect(onReject).toHaveBeenCalledTimes(1);
		expect(onReject).toHaveBeenCalledWith([tooBig], {
			kind: 'file-too-large',
			maxFileSize: 10 * 1024 * 1024,
		});
		expect(onUpload).not.toHaveBeenCalled();
	});

	it('hands out a copy of allowedTypes so a consumer cannot mutate the gate', async () => {
		const onReject = vi.fn();
		const onUpload = vi.fn();

		render(MediaComposer, { props: { attachments: [], handlers: { onUpload, onReject } } });

		await selectFiles(fileInput(), [makeFile('first.pdf', 'application/pdf')]);
		onReject.mock.calls[0][1].allowedTypes.push('application/pdf');

		// The same type must still be rejected on the next attempt.
		await selectFiles(fileInput(), [makeFile('second.pdf', 'application/pdf')]);

		expect(onReject).toHaveBeenCalledTimes(2);
		expect(onUpload).not.toHaveBeenCalled();
	});

	it('honors a consumer-widened config rather than the built-in defaults', async () => {
		const onReject = vi.fn();
		const onUpload = vi.fn().mockResolvedValue([]);

		render(MediaComposer, {
			props: {
				attachments: [],
				config: { allowedTypes: ['application/pdf'], maxFileSize: OVER_LIMIT },
				handlers: { onUpload, onReject },
			},
		});

		const pdf = makeFile('notes.pdf', 'application/pdf', OVER_LIMIT);
		await selectFiles(fileInput(), [pdf]);

		expect(onReject).not.toHaveBeenCalled();
		expect(onUpload).toHaveBeenCalledWith([pdf]);
	});

	it('groups a mixed batch into one call per reason, each file reported once', async () => {
		const onReject = vi.fn();

		render(MediaComposer, { props: { attachments: [], handlers: { onReject } } });

		const badTypeA = makeFile('a.pdf', 'application/pdf');
		const tooBig = makeFile('b.png', 'image/png', OVER_LIMIT);
		const badTypeB = makeFile('c.txt', 'text/plain');
		await selectFiles(fileInput(), [badTypeA, tooBig, badTypeB]);

		expect(onReject).toHaveBeenCalledTimes(2);
		// First-seen reason order: unsupported-type was hit before file-too-large.
		expect(onReject.mock.calls[0][0]).toEqual([badTypeA, badTypeB]);
		expect(onReject.mock.calls[0][1].kind).toBe('unsupported-type');
		expect(onReject.mock.calls[1][0]).toEqual([tooBig]);
		expect(onReject.mock.calls[1][1].kind).toBe('file-too-large');
	});

	it('reports the attachment ceiling when the composer is already full', async () => {
		const onReject = vi.fn();

		render(MediaComposer, {
			props: {
				attachments: [{ id: '1', type: 'image', url: 'https://example.test/a.png' }],
				config: { maxAttachments: 1 },
				handlers: { onReject },
			},
		});

		// The picker is hidden once full, so the drop target is the only way in.
		const extra = makeFile('extra.png', 'image/png');
		await fireEvent.drop(screen.getByRole('group', { name: 'Attachment 1' }), {
			dataTransfer: { files: [extra] },
		});

		expect(onReject).toHaveBeenCalledTimes(1);
		expect(onReject).toHaveBeenCalledWith([extra], {
			kind: 'max-attachments-reached',
			maxAttachments: 1,
		});
	});
});

describe('MediaComposer accepted-file flow', () => {
	it('uploads accepted files and leaves onReject untouched', async () => {
		const onReject = vi.fn();
		const onUpload = vi.fn().mockResolvedValue([
			{
				id: 'uploaded-1',
				type: 'image' as const,
				url: 'https://example.test/uploaded.png',
				description: 'An uploaded image',
				uploaded: true,
			},
		]);

		render(MediaComposer, { props: { attachments: [], handlers: { onUpload, onReject } } });

		const accepted = makeFile('photo.png', 'image/png');
		await selectFiles(fileInput(), [accepted]);

		expect(onUpload).toHaveBeenCalledWith([accepted]);
		expect(onReject).not.toHaveBeenCalled();
		await waitFor(() => {
			expect(screen.getByRole('group', { name: 'Attachment 1' })).toBeInTheDocument();
		});
	});

	it('uploads the accepted files from a partially rejected batch', async () => {
		const onReject = vi.fn();
		const onUpload = vi.fn().mockResolvedValue([]);

		render(MediaComposer, { props: { attachments: [], handlers: { onUpload, onReject } } });

		const accepted = makeFile('photo.png', 'image/png');
		const rejected = makeFile('notes.pdf', 'application/pdf');
		await selectFiles(fileInput(), [accepted, rejected]);

		expect(onUpload).toHaveBeenCalledWith([accepted]);
		expect(onReject).toHaveBeenCalledWith(
			[rejected],
			expect.objectContaining({
				kind: 'unsupported-type',
			})
		);
	});
});

describe('MediaComposer without an onReject handler', () => {
	it('falls back to the previous console.warn behavior without throwing', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onUpload = vi.fn();

		render(MediaComposer, { props: { attachments: [], handlers: { onUpload } } });

		await selectFiles(fileInput(), [
			makeFile('notes.pdf', 'application/pdf'),
			makeFile('huge.png', 'image/png', OVER_LIMIT),
		]);

		expect(warn).toHaveBeenCalledWith('File type application/pdf not allowed');
		expect(warn).toHaveBeenCalledWith('File huge.png exceeds max size');
		expect(onUpload).not.toHaveBeenCalled();
	});

	it('stays functional when no handlers are supplied at all', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(MediaComposer, { props: { attachments: [] } });

		await selectFiles(fileInput(), [makeFile('notes.pdf', 'application/pdf')]);

		expect(warn).toHaveBeenCalledWith('File type application/pdf not allowed');
		expect(screen.getByLabelText('Select media files')).toBeInTheDocument();
	});
});

describe('MediaComposer onReject fault isolation', () => {
	it('still uploads accepted files when the consumer handler throws', async () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const onUpload = vi.fn().mockResolvedValue([]);
		const onReject = vi.fn(() => {
			throw new Error('consumer bug');
		});

		render(MediaComposer, { props: { attachments: [], handlers: { onUpload, onReject } } });

		const accepted = makeFile('photo.png', 'image/png');
		const rejected = makeFile('notes.pdf', 'application/pdf');
		await selectFiles(fileInput(), [accepted, rejected]);

		expect(onReject).toHaveBeenCalledTimes(1);
		expect(onUpload).toHaveBeenCalledWith([accepted]);
		expect(error).toHaveBeenCalledWith('MediaComposer onReject handler threw', expect.any(Error));
	});
});
