import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	PathTraversalError,
	resolvePathWithinDir,
	sanitizeRelativePath,
} from '../src/utils/path-safety.js';

describe('path-safety', () => {
	it('sanitizes safe relative paths', () => {
		expect(sanitizeRelativePath('a/b')).toBe('a/b');
		expect(sanitizeRelativePath('a\\\\b')).toBe('a/b');
	});

	it('rejects traversal and absolute paths', () => {
		expect(() => sanitizeRelativePath('../evil')).toThrow(PathTraversalError);
		expect(() => sanitizeRelativePath('..')).toThrow(PathTraversalError);
		expect(() => sanitizeRelativePath('/etc/passwd')).toThrow(PathTraversalError);
		expect(() => sanitizeRelativePath('C:\\\\Windows\\\\system32')).toThrow(PathTraversalError);
	});

	it('resolves safe paths within a base directory', () => {
		const baseDir = path.join(process.cwd(), 'packages', 'cli', 'tests', '.tmp', 'base');
		expect(resolvePathWithinDir(baseDir, 'a/b')).toBe(path.resolve(baseDir, 'a/b'));
	});

	it('rejects paths that would escape the base directory', () => {
		const baseDir = path.join(process.cwd(), 'packages', 'cli', 'tests', '.tmp', 'base');
		expect(() => resolvePathWithinDir(baseDir, '../evil')).toThrow(PathTraversalError);
	});

	it('writeComponentFilesWithTransform rejects traversal file paths', async () => {
		const baseDir = path.join(process.cwd(), 'packages', 'cli', 'tests', '.tmp', 'base');
		const { writeComponentFilesWithTransform } = await import('../src/utils/files.js');

		await expect(
			writeComponentFilesWithTransform(
				[
					{
						path: '../evil.ts',
						content: 'export {};',
						type: 'component',
					},
				] as any,
				baseDir,
				{} as any
			)
		).rejects.toThrow(PathTraversalError);
	});
});
