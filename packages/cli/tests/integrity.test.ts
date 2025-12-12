/**
 * Integrity Verification Tests
 * Comprehensive tests for checksum computation and verification
 */

import { describe, expect, it } from 'vitest';
import {
	computeChecksum,
	parseChecksum,
	verifyChecksum,
	verifyChecksumOrThrow,
	verifyMultipleChecksums,
	generateChecksumMap,
	IntegrityError,
} from '../src/utils/integrity.js';

describe('computeChecksum', () => {
	it('computes SHA-256 checksum with correct prefix', () => {
		const content = Buffer.from('test content');
		const checksum = computeChecksum(content);

		expect(checksum).toMatch(/^sha256-[A-Za-z0-9+/]+=*$/);
	});

	it('produces consistent checksums for same content', () => {
		const content = Buffer.from('consistent content');
		const checksum1 = computeChecksum(content);
		const checksum2 = computeChecksum(content);

		expect(checksum1).toBe(checksum2);
	});

	it('produces different checksums for different content', () => {
		const content1 = Buffer.from('content one');
		const content2 = Buffer.from('content two');

		const checksum1 = computeChecksum(content1);
		const checksum2 = computeChecksum(content2);

		expect(checksum1).not.toBe(checksum2);
	});

	it('handles empty content', () => {
		const content = Buffer.from('');
		const checksum = computeChecksum(content);

		expect(checksum).toMatch(/^sha256-/);
		// SHA-256 of empty string is known
		expect(checksum).toBe('sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
	});

	it('handles unicode content', () => {
		const content = Buffer.from('日本語テスト 🎉');
		const checksum = computeChecksum(content);

		expect(checksum).toMatch(/^sha256-/);
	});

	it('handles binary content', () => {
		const content = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);
		const checksum = computeChecksum(content);

		expect(checksum).toMatch(/^sha256-/);
	});

	it('handles large content', () => {
		const content = Buffer.alloc(1024 * 1024, 'x'); // 1MB
		const checksum = computeChecksum(content);

		expect(checksum).toMatch(/^sha256-/);
	});
});

describe('parseChecksum', () => {
	it('parses valid SHA-256 checksum', () => {
		const checksum = 'sha256-abc123def456';
		const parsed = parseChecksum(checksum);

		expect(parsed).toEqual({
			algorithm: 'sha256',
			hash: 'abc123def456',
		});
	});

	it('parses checksum with base64 padding', () => {
		const checksum = 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=';
		const parsed = parseChecksum(checksum);

		expect(parsed).toEqual({
			algorithm: 'sha256',
			hash: '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
		});
	});

	it('returns null for invalid format', () => {
		expect(parseChecksum('invalid')).toBeNull();
		expect(parseChecksum('md5-abc123')).toBeNull();
		expect(parseChecksum('sha512-abc123')).toBeNull();
		expect(parseChecksum('')).toBeNull();
	});

	it('returns null for missing hash', () => {
		expect(parseChecksum('sha256-')).toBeNull();
	});
});

describe('verifyChecksum', () => {
	it('returns true for matching checksum', () => {
		const content = Buffer.from('test content');
		const checksum = computeChecksum(content);

		expect(verifyChecksum(content, checksum)).toBe(true);
	});

	it('returns false for non-matching checksum', () => {
		const content = Buffer.from('test content');
		const wrongChecksum = 'sha256-wronghashvalue';

		expect(verifyChecksum(content, wrongChecksum)).toBe(false);
	});

	it('returns false for modified content', () => {
		const original = Buffer.from('original content');
		const checksum = computeChecksum(original);
		const modified = Buffer.from('modified content');

		expect(verifyChecksum(modified, checksum)).toBe(false);
	});
});

describe('verifyChecksumOrThrow', () => {
	it('does not throw for matching checksum', () => {
		const content = Buffer.from('test content');
		const checksum = computeChecksum(content);

		expect(() => {
			verifyChecksumOrThrow(content, checksum, 'test.ts');
		}).not.toThrow();
	});

	it('throws IntegrityError for non-matching checksum', () => {
		const content = Buffer.from('test content');
		const wrongChecksum = 'sha256-wronghashvalue';

		expect(() => {
			verifyChecksumOrThrow(content, wrongChecksum, 'test.ts');
		}).toThrow(IntegrityError);
	});

	it('includes file path in error', () => {
		const content = Buffer.from('test content');
		const wrongChecksum = 'sha256-wronghashvalue';

		try {
			verifyChecksumOrThrow(content, wrongChecksum, 'path/to/file.ts');
			expect.fail('Should have thrown');
		} catch (error) {
			expect(error).toBeInstanceOf(IntegrityError);
			expect((error as IntegrityError).filePath).toBe('path/to/file.ts');
		}
	});

	it('includes expected and actual checksums in error', () => {
		const content = Buffer.from('test content');
		const wrongChecksum = 'sha256-wronghashvalue';

		try {
			verifyChecksumOrThrow(content, wrongChecksum, 'test.ts');
			expect.fail('Should have thrown');
		} catch (error) {
			expect(error).toBeInstanceOf(IntegrityError);
			expect((error as IntegrityError).expectedChecksum).toBe(wrongChecksum);
			expect((error as IntegrityError).actualChecksum).toMatch(/^sha256-/);
		}
	});
});

describe('verifyMultipleChecksums', () => {
	it('verifies all files successfully', () => {
		const files = new Map<string, Buffer>([
			['file1.ts', Buffer.from('content 1')],
			['file2.ts', Buffer.from('content 2')],
		]);

		const checksums = {
			'file1.ts': computeChecksum(Buffer.from('content 1')),
			'file2.ts': computeChecksum(Buffer.from('content 2')),
		};

		const results = verifyMultipleChecksums(files, checksums);

		expect(results).toHaveLength(2);
		expect(results.every((r) => r.valid)).toBe(true);
	});

	it('reports failed verifications', () => {
		const files = new Map<string, Buffer>([
			['file1.ts', Buffer.from('content 1')],
			['file2.ts', Buffer.from('modified content')],
		]);

		const checksums = {
			'file1.ts': computeChecksum(Buffer.from('content 1')),
			'file2.ts': computeChecksum(Buffer.from('original content')),
		};

		const results = verifyMultipleChecksums(files, checksums);

		expect(results[0].valid).toBe(true);
		expect(results[1].valid).toBe(false);
	});

	it('throws on first failure with throwOnFailure option', () => {
		const files = new Map<string, Buffer>([
			['file1.ts', Buffer.from('wrong content')],
			['file2.ts', Buffer.from('content 2')],
		]);

		const checksums = {
			'file1.ts': computeChecksum(Buffer.from('correct content')),
			'file2.ts': computeChecksum(Buffer.from('content 2')),
		};

		expect(() => {
			verifyMultipleChecksums(files, checksums, { throwOnFailure: true });
		}).toThrow(IntegrityError);
	});

	it('skips files not in checksum map with skipMissing option', () => {
		const files = new Map<string, Buffer>([
			['file1.ts', Buffer.from('content 1')],
			['file2.ts', Buffer.from('content 2')],
		]);

		const checksums = {
			'file1.ts': computeChecksum(Buffer.from('content 1')),
			// file2.ts not in checksums
		};

		const results = verifyMultipleChecksums(files, checksums, { skipMissing: true });

		expect(results).toHaveLength(1);
		expect(results[0].filePath).toBe('file1.ts');
	});

	it('reports missing checksums without skipMissing', () => {
		const files = new Map<string, Buffer>([
			['file1.ts', Buffer.from('content 1')],
			['file2.ts', Buffer.from('content 2')],
		]);

		const checksums = {
			'file1.ts': computeChecksum(Buffer.from('content 1')),
		};

		const results = verifyMultipleChecksums(files, checksums);

		expect(results).toHaveLength(2);
		expect(results[1].valid).toBe(false);
		expect(results[1].expectedChecksum).toBe('');
	});
});

describe('generateChecksumMap', () => {
	it('generates checksums for all files', () => {
		const files = new Map<string, Buffer>([
			['file1.ts', Buffer.from('content 1')],
			['file2.ts', Buffer.from('content 2')],
			['file3.ts', Buffer.from('content 3')],
		]);

		const checksumMap = generateChecksumMap(files);

		expect(Object.keys(checksumMap)).toHaveLength(3);
		expect(checksumMap['file1.ts']).toMatch(/^sha256-/);
		expect(checksumMap['file2.ts']).toMatch(/^sha256-/);
		expect(checksumMap['file3.ts']).toMatch(/^sha256-/);
	});

	it('generates verifiable checksums', () => {
		const files = new Map<string, Buffer>([['test.ts', Buffer.from('test content')]]);

		const checksumMap = generateChecksumMap(files);
		const results = verifyMultipleChecksums(files, checksumMap);

		expect(results[0].valid).toBe(true);
	});

	it('handles empty file map', () => {
		const files = new Map<string, Buffer>();
		const checksumMap = generateChecksumMap(files);

		expect(Object.keys(checksumMap)).toHaveLength(0);
	});
});

describe('IntegrityError', () => {
	it('has correct name property', () => {
		const error = new IntegrityError('test', 'file.ts', 'expected', 'actual');
		expect(error.name).toBe('IntegrityError');
	});

	it('extends Error', () => {
		const error = new IntegrityError('test', 'file.ts', 'expected', 'actual');
		expect(error).toBeInstanceOf(Error);
	});

	it('includes all properties', () => {
		const error = new IntegrityError(
			'Integrity check failed',
			'path/to/file.ts',
			'sha256-expected',
			'sha256-actual'
		);

		expect(error.message).toBe('Integrity check failed');
		expect(error.filePath).toBe('path/to/file.ts');
		expect(error.expectedChecksum).toBe('sha256-expected');
		expect(error.actualChecksum).toBe('sha256-actual');
	});
});
