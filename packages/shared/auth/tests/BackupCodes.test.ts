import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BackupCodes from '../src/BackupCodes.svelte';

// Mock headless UI dependencies
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: () => ({
		actions: {
			button: () => ({ destroy: () => {} }),
		},
	}),
}));

// Mock modal - default to closed
vi.mock('@equaltoai/greater-components-headless/modal', () => ({
	createModal: () => ({
		state: { open: false },
		actions: {
			backdrop: () => ({ destroy: () => {} }),
			content: () => ({ destroy: () => {} }),
		},
		helpers: {
			open: vi.fn(),
			close: vi.fn(),
			toggle: vi.fn(),
		},
	}),
}));

// Mock clipboard
const writeTextMock = vi.fn();
Object.assign(navigator, {
	clipboard: {
		writeText: writeTextMock,
	},
});

// Mock URL
global.URL.createObjectURL = vi.fn(() => 'blob:url');
global.URL.revokeObjectURL = vi.fn();

// Mock window.print and open
const mockPrintWindow = {
	document: {
		write: vi.fn(),
		close: vi.fn(),
	},
	focus: vi.fn(),
	print: vi.fn(),
};

global.open = vi.fn(() => mockPrintWindow) as any;

describe('BackupCodes', () => {
	const defaultCodes = ['CODE1', 'CODE2', 'CODE3', 'CODE4'];

	beforeEach(() => {
		vi.clearAllMocks();
		writeTextMock.mockReset();
		writeTextMock.mockResolvedValue(undefined);
	});

	it('renders codes correctly', () => {
		render(BackupCodes, { codes: defaultCodes });

		expect(screen.getByText('CODE-1')).toBeTruthy();
		expect(screen.getByText('CODE-2')).toBeTruthy();

		const items = screen.getAllByRole('listitem');
		expect(items).toHaveLength(4);
	});

	it('renders empty state correctly', () => {
		render(BackupCodes, { codes: [] });
		const items = screen.queryAllByRole('listitem');
		expect(items).toHaveLength(0);
	});

	it('handles copy all', async () => {
		render(BackupCodes, { codes: defaultCodes });

		const copyBtn = screen.getByRole('button', { name: /copy all/i });
		await fireEvent.click(copyBtn);

		expect(writeTextMock).toHaveBeenCalledWith(defaultCodes.join('\n'));
		expect(await screen.findByText('Copied!')).toBeTruthy();
	});

	it('handles copy error', async () => {
		writeTextMock.mockRejectedValue(new Error('Failed'));
		render(BackupCodes, { codes: defaultCodes });

		const copyBtn = screen.getByRole('button', { name: /copy all/i });
		await fireEvent.click(copyBtn);

		expect(await screen.findByText('Failed to copy codes to clipboard')).toBeTruthy();
	});

	it('handles download', async () => {
		render(BackupCodes, { codes: defaultCodes });

		const downloadBtn = screen.getByRole('button', { name: /download/i });
		await fireEvent.click(downloadBtn);

		expect(global.URL.createObjectURL).toHaveBeenCalled();
		expect(await screen.findByText('Downloaded')).toBeTruthy();
	});

	it('handles download error', async () => {
		(global.URL.createObjectURL as any).mockImplementationOnce(() => {
			throw new Error('Blob failed');
		});

		render(BackupCodes, { codes: defaultCodes });

		const downloadBtn = screen.getByRole('button', { name: /download/i });
		await fireEvent.click(downloadBtn);

		expect(await screen.findByText('Failed to download backup codes')).toBeTruthy();
	});

	it('handles print', async () => {
		render(BackupCodes, { codes: defaultCodes });

		const printBtn = screen.getByRole('button', { name: /print/i });
		await fireEvent.click(printBtn);

		expect(global.open).toHaveBeenCalled();
		expect(mockPrintWindow.document.write).toHaveBeenCalled();
		expect(mockPrintWindow.print).toHaveBeenCalled();
	});

	it('handles print error (window open fails)', async () => {
		(global.open as any).mockReturnValueOnce(null);

		render(BackupCodes, { codes: defaultCodes });

		const printBtn = screen.getByRole('button', { name: /print/i });
		await fireEvent.click(printBtn);

		expect(await screen.findByText('Please allow popups to print backup codes')).toBeTruthy();
	});

	it('handles print error (exception)', async () => {
		(global.open as any).mockImplementationOnce(() => {
			throw new Error('Print failed');
		});

		render(BackupCodes, { codes: defaultCodes });

		const printBtn = screen.getByRole('button', { name: /print/i });
		await fireEvent.click(printBtn);

		expect(await screen.findByText('Failed to print backup codes')).toBeTruthy();
	});

	it('shows confirmation checkbox in setup mode', async () => {
		const onConfirmed = vi.fn();
		render(BackupCodes, { codes: defaultCodes, isSetup: true, onConfirmed });

		const checkbox = screen.getByLabelText(/i have saved these codes/i);
		expect(checkbox).toBeTruthy();

		await fireEvent.click(checkbox);
		expect(onConfirmed).toHaveBeenCalled();
	});

	it('does not show regenerate button in setup mode', () => {
		render(BackupCodes, { codes: defaultCodes, isSetup: true });

		expect(screen.queryByRole('button', { name: /regenerate codes/i })).toBeNull();
	});

	it('shows regenerate button in normal mode', () => {
		render(BackupCodes, { codes: defaultCodes, isSetup: false });

		expect(screen.getByRole('button', { name: 'Regenerate backup codes' })).toBeTruthy();
	});
});
