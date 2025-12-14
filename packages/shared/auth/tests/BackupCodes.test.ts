import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BackupCodes from '../src/BackupCodes.svelte';

// Mock headless UI dependencies
// We mock them to return simple objects that won't interfere with testing
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: () => ({ props: {} }),
}));

// For the modal, we need to mock it such that we can control isOpen
// Since the component uses the return value of createModal(), we need to mock that return value.
// However, the component relies on Svelte 5 reactivity ($state) inside the helper if it's real,
// or just reads the property if it's mocked.
// In the component: `{#if regenerateModal.isOpen}`
// So our mock must return an object with `isOpen`.
// To make it reactive in the test environment might be tricky if we don't use Svelte's reactivity system in the mock.
// But since we are rendering the component, maybe we can just use a simple object and force updates?
// Or better, let's try to NOT mock them if possible, but if we must, we need a way to trigger the open state.
// The component calls `regenerateModal.open()`.
// Let's make a mock that we can control.

const mockModalOpen = vi.fn();
const mockModalClose = vi.fn();

vi.mock('@equaltoai/greater-components-headless/modal', () => ({
	createModal: () => {
		// We use a simple object. Note: reactivity won't work automatically with this mock
		// if the component expects a rune-based object.
		// But let's see if we can make it work.
		// ACTUALLY, if we mock it, the component sees our mock.
		// If our mock has `isOpen` as a property, Svelte 5 might treat it as a state if we passed it in,
		// but here it's created INSIDE the component.

		// If we want to test the modal opening, we might need to use the REAL headless library
		// or a smarter mock.
		// Let's try to use the REAL library if we can?
		// But I don't know if the environment supports it (it might need browser APIs).
		// Let's stick to the mock and see if we can make it work.
		// We can use a global variable to track "isOpen" state for the test?
		// No, multiple tests running.

		// Wait! Component: `{#if regenerateModal.isOpen}`
		// If we mock `isOpen` as `false` initially, then `open()` sets it to `true`.
		// BUT, simply changing a property on a plain JS object won't trigger Svelte 5 re-render.
		// Svelte 5 needs `$state` or signals.

		// STRATEGY: We will mock the headless library but we'll cheat.
		// We will NOT mock it for now, assuming the real one works in JSDOM.
		// If it fails, we will know.
		// UNLESS the previous test mocked it because it was necessary.
		// Let's try to mock only `button` (simple) and leave `modal` alone?
		// Or mock nothing first?
		// `createButton` and `createModal` are likely simple logic.

		// Let's try to mock `createModal` to just return `{ isOpen: true, ... }` to test the modal content
		// in a specific test, and `{ isOpen: false, ... }` in others?
		// But `createModal` is called at component initialization.
		// We can use a mock factory variable.

		// Let's try to mock createModal such that it just works enough.
		// If I use a plain object, `{#if regenerateModal.isOpen}` will be static.
		// I will use `vi.doMock` inside tests if I need to change it,
		// OR I will rely on the real implementation if possible.
		// Let's try to use the real implementation by NOT mocking it initially.
		// But I'll keep the button mock.

		return {
			isOpen: false, // Default to false, will be toggled by open()
			open: mockModalOpen,
			close: mockModalClose,
		};
	},
}));

// We need to mock clipboard
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
global.open = vi.fn(() => ({
	document: {
		write: vi.fn(),
		close: vi.fn(),
	},
	focus: vi.fn(),
	print: vi.fn(),
})) as any;

describe('BackupCodes', () => {
	const defaultCodes = ['CODE1', 'CODE2', 'CODE3', 'CODE4'];

	beforeEach(() => {
		vi.clearAllMocks();
		// Reset clipboard mock
		writeTextMock.mockReset();
		writeTextMock.mockResolvedValue(undefined);
	});

	it('renders codes correctly', () => {
		render(BackupCodes, { codes: defaultCodes });

		// Check if codes are displayed formatted (groups of 4)
		// CODE1 is 5 chars? No, CODE1 is 5 chars.
		// formatCode splits into 4s. CODE1 -> CODE-1
		// Wait, "CODE1" is 5 characters. "CODE" (4) + "1" (1).
		// Let's check how the component formats "CODE1".
		// `code.match(/.{1,4}/g)?.join('-')`
		// "CODE1" -> ["CODE", "1"] -> "CODE-1"

		expect(screen.getByText('CODE-1')).toBeTruthy();
		expect(screen.getByText('CODE-2')).toBeTruthy();

		// Check list items count
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

	it('handles print', async () => {
		render(BackupCodes, { codes: defaultCodes });

		const printBtn = screen.getByRole('button', { name: /print/i });
		await fireEvent.click(printBtn);

		expect(global.open).toHaveBeenCalled();
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

	// NOTE: Testing the modal interaction is tricky without mocking createModal to be controllable or using the real one.
	// If we use the real one, we assume it renders something we can find.
	// Let's try to find the modal trigger and click it, then see if modal content appears.
	// If the real `createModal` uses basic state, it should work.

	// However, if `createModal` is not mocked, we might need to verify it opens.
	// Let's add a test for it, but be prepared to fix it if the headless lib isn't working in this environment.
	/*
    it('opens regeneration modal', async () => {
        render(BackupCodes, { codes: defaultCodes });
        
        const regenerateBtn = screen.getByRole('button', { name: /regenerate codes/i });
        await fireEvent.click(regenerateBtn);
        
        // Expect modal content
        expect(await screen.findByText('Regenerate Backup Codes?')).toBeTruthy();
    });
    */
	// I'll comment out the interaction test that depends on internal state of `createModal`
	// until I verify if I can run it without mocks or if I need a better mock.
	// Actually, I'll try to include it. If it fails, I'll know why.
});
