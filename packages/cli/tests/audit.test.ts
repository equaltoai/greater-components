import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auditCommand } from '../src/commands/audit.js';
import { logger } from '../src/utils/logger.js';
import { readAuditLog, clearAuditLog, getAuditLogPath } from '../src/utils/security.js';
import fs from 'fs-extra';

// Mock dependencies
vi.mock('../src/utils/logger.js', () => ({
	logger: {
		debug: vi.fn(),
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		newline: vi.fn(),
	},
}));

vi.mock('../src/utils/security.js', () => ({
	readAuditLog: vi.fn(),
	clearAuditLog: vi.fn(),
	getAuditLogPath: vi.fn(),
}));

vi.mock('fs-extra', () => ({
	default: {
		pathExists: vi.fn(),
		stat: vi.fn(),
	},
}));

// Mock process.exit
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

describe('Audit Command', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(getAuditLogPath as any).mockReturnValue('/mock/path/audit.json');
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('path option', () => {
		it('shows audit log path', async () => {
			(fs.pathExists as any).mockResolvedValue(false);

			await auditCommand.parseAsync(['node', 'test', '--path']);

			expect(logger.info).toHaveBeenCalledWith('Audit log path: /mock/path/audit.json');
			expect(logger.info).toHaveBeenCalledWith('(Log file does not exist yet)');
		});

		it('shows audit log size if exists', async () => {
			(fs.pathExists as any).mockResolvedValue(true);
			(fs.stat as any).mockResolvedValue({ size: 1024 });

			await auditCommand.parseAsync(['node', 'test', '--path']);

			expect(logger.info).toHaveBeenCalledWith('Audit log path: /mock/path/audit.json');
			expect(logger.info).toHaveBeenCalledWith('Size: 1.00 KB');
		});
	});

	describe('clear option', () => {
		it('clears audit log', async () => {
			await auditCommand.parseAsync(['node', 'test', '--clear']);

			expect(clearAuditLog).toHaveBeenCalled();
			expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Audit log cleared'));
		});
	});

	describe('viewing entries', () => {
		const mockEntries = [
			{
				timestamp: '2023-01-01T00:00:00.000Z',
				action: 'install',
				component: 'button',
				ref: 'v1.0.0',
				verified: true,
				success: true,
			},
			{
				timestamp: '2023-01-02T00:00:00.000Z',
				action: 'security_warning',
				warnings: ['Some warning'],
				success: true,
			},
		];

		it('displays "No audit log entries found" when empty', async () => {
			(readAuditLog as any).mockResolvedValue([]);

			await auditCommand.parseAsync(['node', 'test']);

			expect(logger.info).toHaveBeenCalledWith(
				expect.stringContaining('No audit log entries found')
			);
		});

		it('displays entries', async () => {
			(readAuditLog as any).mockResolvedValue(mockEntries);

			await auditCommand.parseAsync(['node', 'test']);

			expect(readAuditLog).toHaveBeenCalledWith(expect.objectContaining({ limit: 20 }));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Audit Log (2 entries)'));
			// Check for content of first entry
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('INSTALL'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('button'));
			// Check for summary
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('1 installs'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('1 warnings'));
		});

		it('displays filtered entries by limit', async () => {
			(readAuditLog as any).mockResolvedValue([]);

			await auditCommand.parseAsync(['node', 'test', '--limit', '5']);

			expect(readAuditLog).toHaveBeenCalledWith(expect.objectContaining({ limit: 5 }));
		});

		it('displays filtered entries by component', async () => {
			(readAuditLog as any).mockResolvedValue([]);

			await auditCommand.parseAsync(['node', 'test', '--component', 'button']);

			expect(readAuditLog).toHaveBeenCalledWith(expect.objectContaining({ component: 'button' }));
		});

		it('displays filtered entries by action', async () => {
			(readAuditLog as any).mockResolvedValue([]);

			await auditCommand.parseAsync(['node', 'test', '--action', 'install']);

			expect(readAuditLog).toHaveBeenCalledWith(expect.objectContaining({ action: 'install' }));
		});

		it('outputs JSON when --json flag is used', async () => {
			(readAuditLog as any).mockResolvedValue(mockEntries);

			await auditCommand.parseAsync(['node', 'test', '--json']);

			expect(logger.info).toHaveBeenCalledWith(JSON.stringify(mockEntries, null, 2));
		});

		it('displays detailed info in verbose mode', async () => {
			const verboseEntry = [
				{
					timestamp: '2023-01-01T00:00:00.000Z',
					action: 'install',
					component: 'button',
					checksums: { 'file.ts': 'abc1234567890abc1234567890' },
					details: { some: 'detail' },
					errorMessage: 'Some error',
					success: false,
				},
			];
			(readAuditLog as any).mockResolvedValue(verboseEntry);

			await auditCommand.parseAsync(['node', 'test', '-v']);

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Checksums'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('file.ts'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Details'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Error'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Failed'));
		});
	});

	describe('since option', () => {
		it('parses relative date "1d"', async () => {
			(readAuditLog as any).mockResolvedValue([]);
			const now = Date.now();
			const oneDay = 24 * 60 * 60 * 1000;

			await auditCommand.parseAsync(['node', 'test', '--since', '1d']);

			const callArgs = (readAuditLog as any).mock.calls[0][0];
			expect(callArgs.since).toBeInstanceOf(Date);
			// Allow for some small execution time difference
			const timeDiff = Math.abs(now - oneDay - callArgs.since.getTime());
			expect(timeDiff).toBeLessThan(1000);
		});

		it('parses comparison with ISO date', async () => {
			(readAuditLog as any).mockResolvedValue([]);
			const isoDate = '2023-01-01T00:00:00.000Z';

			await auditCommand.parseAsync(['node', 'test', '--since', isoDate]);

			const callArgs = (readAuditLog as any).mock.calls[0][0];
			expect(callArgs.since).toEqual(new Date(isoDate));
		});

		it('exits with error for invalid date', async () => {
			await auditCommand.parseAsync(['node', 'test', '--since', 'invalid-date']);

			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid date format'));
			expect(mockExit).toHaveBeenCalledWith(1);
		});
	});
});
