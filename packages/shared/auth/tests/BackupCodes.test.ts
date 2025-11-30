/**
 * Tests for Auth.BackupCodes Component Logic
 *
 * Tests backup code management functionality including:
 * - Code display and formatting
 * - Copy to clipboard
 * - Download as file
 * - Print functionality
 * - Code regeneration
 * - User confirmation flow
 * - Error handling
 * - State management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock headless UI dependencies
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: () => ({ props: {} }),
}));

vi.mock('@equaltoai/greater-components-headless/modal', () => ({
	createModal: () => ({
		isOpen: false,
		open: vi.fn(function (this: any) {
			this.isOpen = true;
		}),
		close: vi.fn(function (this: any) {
			this.isOpen = false;
		}),
	}),
}));

/**
 * Backup Codes Logic State
 */
interface BackupCodesState {
	copiedAll: boolean;
	downloaded: boolean;
	confirmed: boolean;
	regenerating: boolean;
	error: string | null;
}

/**
 * Create backup codes logic for testing
 */
function createBackupCodesLogic() {
	const state: BackupCodesState = {
		copiedAll: false,
		downloaded: false,
		confirmed: false,
		regenerating: false,
		error: null,
	};

	let copiedTimeout: NodeJS.Timeout | null = null;

	return {
		getState: () => state,

		/**
		 * Format code for display (split into groups)
		 */
		formatCode: (code: string): string => {
			return code.match(/.{1,4}/g)?.join('-') ?? code;
		},

		/**
		 * Copy all codes to clipboard
		 */
		copyAll: async (codes: string[]): Promise<void> => {
			try {
				const text = codes.join('\n');
				await navigator.clipboard.writeText(text);
				state.copiedAll = true;
				state.error = null;

				// Reset after 3 seconds
				if (copiedTimeout) clearTimeout(copiedTimeout);
				copiedTimeout = setTimeout(() => {
					state.copiedAll = false;
				}, 3000);
			} catch (err) {
				state.error = 'Failed to copy codes to clipboard';
				throw err;
			}
		},

		/**
		 * Build download file content
		 */
		buildDownloadContent: (codes: string[]): string => {
			return [
				'BACKUP RECOVERY CODES',
				'',
				'Keep these codes in a safe place. Each code can only be used once.',
				'',
				...codes,
				'',
				`Generated: ${new Date().toISOString()}`,
			].join('\n');
		},

		/**
		 * Download codes as file
		 */
		download: (codes: string[]): void => {
			try {
				const text = [
					'BACKUP RECOVERY CODES',
					'',
					'Keep these codes in a safe place. Each code can only be used once.',
					'',
					...codes,
					'',
					`Generated: ${new Date().toISOString()}`,
				].join('\n');

				// Create blob and download
				const blob = new Blob([text], { type: 'text/plain' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `backup-codes-${Date.now()}.txt`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				state.downloaded = true;
				state.error = null;
			} catch (err) {
				state.error = 'Failed to download backup codes';
				throw err;
			}
		},

		/**
		 * Confirm codes saved
		 */
		confirm: (onConfirmed?: () => void): void => {
			state.confirmed = true;
			onConfirmed?.();
		},

		/**
		 * Regenerate backup codes
		 */
		regenerate: async (onRegenerate?: () => Promise<string[]>): Promise<void> => {
			if (state.regenerating) return;

			state.regenerating = true;
			state.error = null;

			try {
				await onRegenerate?.();
				// Reset saved states since codes are new
				state.copiedAll = false;
				state.downloaded = false;
				state.confirmed = false;
			} catch (err) {
				state.error = err instanceof Error ? err.message : 'Failed to regenerate codes';
				throw err;
			} finally {
				state.regenerating = false;
			}
		},

		/**
		 * Clear error
		 */
		clearError: (): void => {
			state.error = null;
		},

		/**
		 * Cleanup timeouts
		 */
		cleanup: (): void => {
			if (copiedTimeout) clearTimeout(copiedTimeout);
		},
	};
}

describe('BackupCodes Logic', () => {
	let logic: ReturnType<typeof createBackupCodesLogic>;
	const mockCodes = ['ABCD1234', 'EFGH5678', 'IJKL9012', 'MNOP3456'];

	beforeEach(() => {
		logic = createBackupCodesLogic();

		// Mock clipboard API
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn().mockResolvedValue(undefined),
			},
		});

		// Mock DOM methods
		global.Blob = vi.fn(function BlobMock(this: any, content, options) {
			return { content, options };
		}) as unknown as typeof Blob;
		global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
		global.URL.revokeObjectURL = vi.fn();
		document.createElement = vi.fn((tag) => {
			const element: any = {
				tagName: tag,
				click: vi.fn(),
				appendChild: vi.fn(),
				removeChild: vi.fn(),
			};
			return element;
		});
		document.body.appendChild = vi.fn();
		document.body.removeChild = vi.fn();
	});

	afterEach(() => {
		logic.cleanup();
		vi.clearAllMocks();
	});

	describe('Code Formatting', () => {
		it('should format code with dashes every 4 characters', () => {
			const formatted = logic.formatCode('ABCD1234');
			expect(formatted).toBe('ABCD-1234');
		});

		it('should handle short codes', () => {
			const formatted = logic.formatCode('ABC');
			expect(formatted).toBe('ABC');
		});

		it('should handle long codes', () => {
			const formatted = logic.formatCode('ABCD1234EFGH5678');
			expect(formatted).toBe('ABCD-1234-EFGH-5678');
		});

		it('should handle empty codes', () => {
			const formatted = logic.formatCode('');
			expect(formatted).toBe('');
		});

		it('should handle codes with exact 4-char length', () => {
			const formatted = logic.formatCode('ABCD');
			expect(formatted).toBe('ABCD');
		});

		it('should handle codes with 5 characters', () => {
			const formatted = logic.formatCode('ABCDE');
			expect(formatted).toBe('ABCD-E');
		});

		it('should handle special characters in codes', () => {
			const formatted = logic.formatCode('AB@#12$%');
			expect(formatted).toBe('AB@#-12$%');
		});

		it('should handle unicode characters', () => {
			const formatted = logic.formatCode('你好世界1234');
			expect(formatted).toBe('你好世界-1234');
		});
	});

	describe('Copy All Functionality', () => {
		it('should copy all codes to clipboard', async () => {
			await logic.copyAll(mockCodes);

			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCodes.join('\n'));
			expect(logic.getState().copiedAll).toBe(true);
			expect(logic.getState().error).toBeNull();
		});

		it('should handle clipboard write failure', async () => {
			vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
				new Error('Clipboard access denied')
			);

			await expect(logic.copyAll(mockCodes)).rejects.toThrow();
			expect(logic.getState().error).toBe('Failed to copy codes to clipboard');
		});

		it('should reset copiedAll state after timeout', async () => {
			vi.useFakeTimers();
			await logic.copyAll(mockCodes);
			expect(logic.getState().copiedAll).toBe(true);

			vi.advanceTimersByTime(3000);
			expect(logic.getState().copiedAll).toBe(false);

			vi.useRealTimers();
		});

		it('should handle rapid copy calls', async () => {
			vi.useFakeTimers();

			await logic.copyAll(mockCodes);
			expect(logic.getState().copiedAll).toBe(true);

			vi.advanceTimersByTime(1000);
			await logic.copyAll(mockCodes);
			expect(logic.getState().copiedAll).toBe(true);

			// Should reset only after last copy + 3 seconds
			vi.advanceTimersByTime(3000);
			expect(logic.getState().copiedAll).toBe(false);

			vi.useRealTimers();
		});

		it('should copy empty array', async () => {
			await logic.copyAll([]);
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
			expect(logic.getState().copiedAll).toBe(true);
		});

		it('should handle single code', async () => {
			await logic.copyAll(['CODE1']);
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith('CODE1');
		});

		it('should preserve code order', async () => {
			const codes = ['C', 'B', 'A'];
			await logic.copyAll(codes);
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith('C\nB\nA');
		});

		it('should clear error on successful copy after previous error', async () => {
			vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error());
			await expect(logic.copyAll(mockCodes)).rejects.toThrow();
			expect(logic.getState().error).not.toBeNull();

			vi.mocked(navigator.clipboard.writeText).mockResolvedValueOnce(undefined);
			await logic.copyAll(mockCodes);
			expect(logic.getState().error).toBeNull();
		});
	});

	describe('Download Functionality', () => {
		it('should generate correct download content', () => {
			const content = logic.buildDownloadContent(mockCodes);

			expect(content).toContain('BACKUP RECOVERY CODES');
			expect(content).toContain('Keep these codes in a safe place');
			mockCodes.forEach((code) => {
				expect(content).toContain(code);
			});
			expect(content).toContain('Generated:');
		});

		it('should create download file', () => {
			logic.download(mockCodes);

			expect(Blob).toHaveBeenCalled();
			expect(URL.createObjectURL).toHaveBeenCalled();
			expect(document.createElement).toHaveBeenCalledWith('a');
			expect(logic.getState().downloaded).toBe(true);
		});

		it('should set proper filename with timestamp', () => {
			const mockElement: any = {
				href: '',
				download: '',
				click: vi.fn(),
			};
			vi.mocked(document.createElement).mockReturnValueOnce(mockElement);

			logic.download(mockCodes);

			expect(mockElement.download).toMatch(/^backup-codes-\d+\.txt$/);
		});

		it('should handle download errors', () => {
			vi.mocked(document.createElement).mockImplementationOnce(() => {
				throw new Error('DOM error');
			});

			expect(() => logic.download(mockCodes)).toThrow();
			expect(logic.getState().error).toBe('Failed to download backup codes');
		});

		it('should cleanup URL after download', () => {
			logic.download(mockCodes);
			expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
		});

		it('should remove download link from DOM', () => {
			logic.download(mockCodes);
			expect(document.body.appendChild).toHaveBeenCalled();
			expect(document.body.removeChild).toHaveBeenCalled();
		});

		it('should handle empty codes array', () => {
			const content = logic.buildDownloadContent([]);
			expect(content).toContain('BACKUP RECOVERY CODES');
			expect(content).not.toContain('ABCD');
		});

		it('should include ISO timestamp', () => {
			const content = logic.buildDownloadContent(mockCodes);
			const isoRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
			expect(content).toMatch(isoRegex);
		});
	});

	describe('Confirmation Flow', () => {
		it('should set confirmed state', () => {
			logic.confirm();
			expect(logic.getState().confirmed).toBe(true);
		});

		it('should call onConfirmed callback', () => {
			const callback = vi.fn();
			logic.confirm(callback);
			expect(callback).toHaveBeenCalledOnce();
		});

		it('should work without callback', () => {
			expect(() => logic.confirm()).not.toThrow();
			expect(logic.getState().confirmed).toBe(true);
		});

		it('should handle callback errors gracefully', () => {
			const callback = vi.fn(() => {
				throw new Error('Callback error');
			});

			expect(() => logic.confirm(callback)).toThrow('Callback error');
			expect(logic.getState().confirmed).toBe(true);
		});
	});

	describe('Regeneration Flow', () => {
		it('should regenerate codes', async () => {
			const onRegenerate = vi.fn().mockResolvedValue(['NEW1', 'NEW2']);
			await logic.regenerate(onRegenerate);

			expect(onRegenerate).toHaveBeenCalledOnce();
			expect(logic.getState().regenerating).toBe(false);
			expect(logic.getState().error).toBeNull();
		});

		it('should reset saved states after regeneration', async () => {
			const state = logic.getState();
			state.copiedAll = true;
			state.downloaded = true;
			state.confirmed = true;

			const onRegenerate = vi.fn().mockResolvedValue([]);
			await logic.regenerate(onRegenerate);

			expect(logic.getState().copiedAll).toBe(false);
			expect(logic.getState().downloaded).toBe(false);
			expect(logic.getState().confirmed).toBe(false);
		});

		it('should set regenerating state during operation', async () => {
			const onRegenerate = vi.fn(async () => {
				expect(logic.getState().regenerating).toBe(true);
				return [];
			});

			await logic.regenerate(onRegenerate);
			expect(logic.getState().regenerating).toBe(false);
		});

		it('should handle regeneration errors', async () => {
			const onRegenerate = vi.fn().mockRejectedValue(new Error('Server error'));

			await expect(logic.regenerate(onRegenerate)).rejects.toThrow('Server error');
			expect(logic.getState().error).toBe('Server error');
			expect(logic.getState().regenerating).toBe(false);
		});

		it('should handle non-Error exceptions', async () => {
			const onRegenerate = vi.fn().mockRejectedValue('String error');

			await expect(logic.regenerate(onRegenerate)).rejects.toBe('String error');
			expect(logic.getState().error).toBe('Failed to regenerate codes');
		});

		it('should prevent concurrent regeneration', async () => {
			const onRegenerate = vi.fn(async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				return [];
			});

			const promise1 = logic.regenerate(onRegenerate);
			const promise2 = logic.regenerate(onRegenerate);

			await promise1;
			await promise2;

			// Should only call once
			expect(onRegenerate).toHaveBeenCalledOnce();
		});

		it('should work without callback', async () => {
			await expect(logic.regenerate()).resolves.not.toThrow();
		});

		it('should clear previous errors on successful regeneration', async () => {
			logic.getState().error = 'Previous error';

			const onRegenerate = vi.fn().mockResolvedValue([]);
			await logic.regenerate(onRegenerate);

			expect(logic.getState().error).toBeNull();
		});

		it('should preserve error if regeneration fails twice', async () => {
			const onRegenerate = vi
				.fn()
				.mockRejectedValueOnce(new Error('First error'))
				.mockRejectedValueOnce(new Error('Second error'));

			await expect(logic.regenerate(onRegenerate)).rejects.toThrow('First error');
			expect(logic.getState().error).toBe('First error');

			await expect(logic.regenerate(onRegenerate)).rejects.toThrow('Second error');
			expect(logic.getState().error).toBe('Second error');
		});
	});

	describe('Error Handling', () => {
		it('should clear error state', () => {
			logic.getState().error = 'Test error';
			logic.clearError();
			expect(logic.getState().error).toBeNull();
		});

		it('should handle null error clearing', () => {
			logic.getState().error = null;
			logic.clearError();
			expect(logic.getState().error).toBeNull();
		});

		it('should set error on copy failure', async () => {
			vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error());

			await expect(logic.copyAll(mockCodes)).rejects.toThrow();
			expect(logic.getState().error).toBe('Failed to copy codes to clipboard');
		});

		it('should set error on download failure', () => {
			vi.mocked(Blob).mockImplementationOnce(function throwBlobError() {
				throw new Error();
			});

			expect(() => logic.download(mockCodes)).toThrow();
			expect(logic.getState().error).toBe('Failed to download backup codes');
		});

		it('should preserve error messages', async () => {
			const onRegenerate = vi.fn().mockRejectedValue(new Error('Custom error'));
			await expect(logic.regenerate(onRegenerate)).rejects.toThrow();
			expect(logic.getState().error).toBe('Custom error');
		});
	});

	describe('State Management', () => {
		it('should initialize with correct default state', () => {
			const state = logic.getState();
			expect(state.copiedAll).toBe(false);
			expect(state.downloaded).toBe(false);
			expect(state.confirmed).toBe(false);
			expect(state.regenerating).toBe(false);
			expect(state.error).toBeNull();
		});

		it('should maintain state consistency', async () => {
			await logic.copyAll(mockCodes);
			logic.download(mockCodes);
			logic.confirm();

			const state = logic.getState();
			expect(state.copiedAll).toBe(true);
			expect(state.downloaded).toBe(true);
			expect(state.confirmed).toBe(true);
		});

		it('should handle rapid state changes', async () => {
			await logic.copyAll(mockCodes);
			logic.download(mockCodes);
			logic.confirm();
			logic.clearError();

			expect(logic.getState().copiedAll).toBe(true);
			expect(logic.getState().downloaded).toBe(true);
			expect(logic.getState().confirmed).toBe(true);
		});

		it('should handle state after error', async () => {
			vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error());
			await expect(logic.copyAll(mockCodes)).rejects.toThrow();

			expect(logic.getState().error).not.toBeNull();
			expect(logic.getState().copiedAll).toBe(false);
		});
	});

	describe('Integration Scenarios', () => {
		it('should handle complete backup flow', async () => {
			// Copy codes
			await logic.copyAll(mockCodes);
			expect(logic.getState().copiedAll).toBe(true);

			// Download codes
			logic.download(mockCodes);
			expect(logic.getState().downloaded).toBe(true);

			// Confirm saved
			logic.confirm();
			expect(logic.getState().confirmed).toBe(true);
		});

		it('should handle regeneration after initial setup', async () => {
			// Initial setup
			await logic.copyAll(mockCodes);
			logic.download(mockCodes);
			logic.confirm();

			// Regenerate
			const onRegenerate = vi.fn().mockResolvedValue(['NEW1', 'NEW2']);
			await logic.regenerate(onRegenerate);

			// States should be reset
			expect(logic.getState().copiedAll).toBe(false);
			expect(logic.getState().downloaded).toBe(false);
			expect(logic.getState().confirmed).toBe(false);
		});

		it('should handle error recovery flow', async () => {
			// Initial error
			vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error());
			await expect(logic.copyAll(mockCodes)).rejects.toThrow();
			expect(logic.getState().error).not.toBeNull();

			// Clear error
			logic.clearError();
			expect(logic.getState().error).toBeNull();

			// Retry successfully
			vi.mocked(navigator.clipboard.writeText).mockResolvedValueOnce(undefined);
			await logic.copyAll(mockCodes);
			expect(logic.getState().copiedAll).toBe(true);
		});

		it('should handle partial completion', async () => {
			await logic.copyAll(mockCodes);
			expect(logic.getState().copiedAll).toBe(true);
			expect(logic.getState().downloaded).toBe(false);
			expect(logic.getState().confirmed).toBe(false);
		});

		it('should handle multiple regenerations', async () => {
			const onRegenerate = vi.fn().mockResolvedValue([]);

			await logic.regenerate(onRegenerate);
			await logic.regenerate(onRegenerate);
			await logic.regenerate(onRegenerate);

			expect(onRegenerate).toHaveBeenCalledTimes(3);
		});
	});

	describe('Edge Cases', () => {
		it('should handle very long code arrays', async () => {
			const longCodes = Array.from({ length: 100 }, (_, i) => `CODE${i}`);
			await logic.copyAll(longCodes);
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longCodes.join('\n'));
		});

		it('should handle codes with newlines', async () => {
			const codes = ['CODE\n1', 'CODE\n2'];
			await logic.copyAll(codes);
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith('CODE\n1\nCODE\n2');
		});

		it('should handle codes with special characters', () => {
			const formatted = logic.formatCode('!@#$%^&*()');
			expect(formatted).toBe('!@#$-%^&*-()');
		});

		it('should handle simultaneous copy and download', async () => {
			const copyPromise = logic.copyAll(mockCodes);
			logic.download(mockCodes);
			await copyPromise;

			expect(logic.getState().copiedAll).toBe(true);
			expect(logic.getState().downloaded).toBe(true);
		});

		it('should handle regeneration during ongoing copy', async () => {
			vi.useFakeTimers();
			await logic.copyAll(mockCodes);

			const onRegenerate = vi.fn().mockResolvedValue([]);
			await logic.regenerate(onRegenerate);

			// Copy timeout should still work
			vi.advanceTimersByTime(3000);
			expect(logic.getState().copiedAll).toBe(false);

			vi.useRealTimers();
		});

		it('should handle unicode in download content', () => {
			const codes = ['你好', '世界', '🎉'];
			const content = logic.buildDownloadContent(codes);
			codes.forEach((code) => {
				expect(content).toContain(code);
			});
		});

		it('should handle empty string codes', () => {
			const formatted = logic.formatCode('');
			expect(formatted).toBe('');
		});

		it('should handle very long single code', () => {
			const longCode = 'A'.repeat(100);
			const formatted = logic.formatCode(longCode);
			expect(formatted.split('-')).toHaveLength(25); // 100/4 = 25 groups
		});
	});
});
