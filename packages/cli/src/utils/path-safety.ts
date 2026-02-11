import path from 'node:path';

export class PathTraversalError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PathTraversalError';
	}
}

function isPathAbsoluteCrossPlatform(input: string): boolean {
	return path.posix.isAbsolute(input) || path.win32.isAbsolute(input) || /^[a-zA-Z]:/.test(input);
}

/**
 * Normalize and validate a user-controlled or externally sourced relative path.
 *
 * - Rejects absolute paths (POSIX + Windows + drive-relative)
 * - Rejects `..` segments (directory traversal)
 * - Normalizes to POSIX separators for consistent validation
 */
export function sanitizeRelativePath(input: string, label: string = 'path'): string {
	if (typeof input !== 'string') {
		throw new PathTraversalError(`Invalid ${label}: expected string`);
	}

	if (input.includes('\0')) {
		throw new PathTraversalError(`Invalid ${label}: contains null bytes`);
	}

	if (!input.trim()) {
		throw new PathTraversalError(`Invalid ${label}: empty`);
	}

	if (isPathAbsoluteCrossPlatform(input)) {
		throw new PathTraversalError(`Invalid ${label}: absolute paths are not allowed`);
	}

	const normalized = input.replace(/\\/g, '/').replace(/^\.\/+/, '');
	const segments = normalized.split('/').filter(Boolean);

	if (segments.length === 0) {
		throw new PathTraversalError(`Invalid ${label}: empty`);
	}

	if (segments.some((segment) => segment === '..')) {
		throw new PathTraversalError(`Invalid ${label}: path traversal detected`);
	}

	const posixNormalized = path.posix.normalize(segments.join('/'));
	if (posixNormalized === '.' || posixNormalized === '') {
		throw new PathTraversalError(`Invalid ${label}: empty`);
	}

	if (posixNormalized === '..' || posixNormalized.startsWith('../')) {
		throw new PathTraversalError(`Invalid ${label}: path traversal detected`);
	}

	return posixNormalized;
}

export function resolvePathWithinDir(
	baseDir: string,
	relativePath: string,
	label: string = 'path'
): string {
	const safeRelativePath = sanitizeRelativePath(relativePath, label);
	const resolvedBase = path.resolve(baseDir);
	const resolvedTarget = path.resolve(resolvedBase, safeRelativePath);
	const rel = path.relative(resolvedBase, resolvedTarget);

	if (rel === '' || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
		throw new PathTraversalError(`Invalid ${label}: resolved path escapes base directory`);
	}

	return resolvedTarget;
}
