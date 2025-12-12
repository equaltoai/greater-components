/**
 * Diff computation utilities
 * Provides unified diff generation for comparing local and remote file content
 */

/**
 * Diff line type
 */
export type DiffLineType = 'unchanged' | 'added' | 'removed' | 'context';

/**
 * Single line in a diff
 */
export interface DiffLine {
	type: DiffLineType;
	content: string;
	oldLineNumber: number | null;
	newLineNumber: number | null;
}

/**
 * Diff hunk (a contiguous block of changes)
 */
export interface DiffHunk {
	oldStart: number;
	oldCount: number;
	newStart: number;
	newCount: number;
	lines: DiffLine[];
}

/**
 * Statistics about the diff
 */
export interface DiffStats {
	additions: number;
	deletions: number;
	unchanged: number;
	totalLines: number;
}

/**
 * Result of computing a diff
 */
export interface DiffResult {
	/** Whether files are identical */
	identical: boolean;
	/** Whether the file appears to be binary */
	isBinary: boolean;
	/** Diff hunks (groups of changes) */
	hunks: DiffHunk[];
	/** Statistics about the diff */
	stats: DiffStats;
	/** Unified diff string output */
	unifiedDiff: string;
}

/**
 * Options for diff computation
 */
export interface DiffOptions {
	/** Number of context lines around changes (default: 3) */
	contextLines?: number;
	/** Ignore whitespace differences */
	ignoreWhitespace?: boolean;
	/** File path for header (optional) */
	filePath?: string;
}

/**
 * Check if content appears to be binary
 * Binary files contain null bytes or high proportion of non-printable characters
 */
export function isBinaryContent(content: string): boolean {
	// Check for null bytes (common in binary files)
	if (content.includes('\0')) {
		return true;
	}

	// Check first 8KB for high proportion of non-printable characters
	const sample = content.slice(0, 8192);
	let nonPrintable = 0;

	for (let i = 0; i < sample.length; i++) {
		const code = sample.charCodeAt(i);
		// Allow common whitespace and printable ASCII
		if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
			nonPrintable++;
		}
	}

	// If more than 10% non-printable, consider binary
	return sample.length > 0 && nonPrintable / sample.length > 0.1;
}

/**
 * Split content into lines, preserving line endings for accurate diff
 */
function splitLines(content: string): string[] {
	if (content === '') {
		return [];
	}
	// Split on newlines but keep empty trailing line if content ends with newline
	const lines = content.split('\n');
	// Remove last empty element if content ended with newline
	if (lines.length > 0 && lines[lines.length - 1] === '') {
		lines.pop();
	}
	return lines;
}

/**
 * Compute longest common subsequence (LCS) for diff algorithm
 * Returns indices of matching lines
 */
function computeLCS(oldLines: string[], newLines: string[]): Map<number, number> {
	const m = oldLines.length;
	const n = newLines.length;

	// Build LCS table
	const dp: number[][] = Array(m + 1)
		.fill(null)
		.map(() => Array(n + 1).fill(0));

	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			const currentRow = dp[i];
			const prevRow = dp[i - 1];
			// Ensure rows exist
			if (!currentRow || !prevRow) continue;

			if (oldLines[i - 1] === newLines[j - 1]) {
				currentRow[j] = (prevRow[j - 1] ?? 0) + 1;
			} else {
				currentRow[j] = Math.max(prevRow[j] ?? 0, currentRow[j - 1] ?? 0);
			}
		}
	}

	// Backtrack to find matching pairs
	const matches = new Map<number, number>();
	let i = m;
	let j = n;

	while (i > 0 && j > 0) {
		if (oldLines[i - 1] === newLines[j - 1]) {
			matches.set(i - 1, j - 1);
			i--;
			j--;
		} else if ((dp[i - 1]?.[j] ?? 0) > (dp[i]?.[j - 1] ?? 0)) {
			i--;
		} else {
			j--;
		}
	}

	return matches;
}

/**
 * Generate diff hunks from old and new lines
 */
function generateHunks(
	oldLines: string[],
	newLines: string[],
	matches: Map<number, number>,
	contextLines: number
): DiffHunk[] {
	const hunks: DiffHunk[] = [];
	const diffLines: Array<{
		type: DiffLineType;
		oldIdx: number | null;
		newIdx: number | null;
		content: string;
	}> = [];

	let oldIdx = 0;
	let newIdx = 0;

	// Build list of all diff lines
	while (oldIdx < oldLines.length || newIdx < newLines.length) {
		if (matches.has(oldIdx) && matches.get(oldIdx) === newIdx) {
			// Matching line
			diffLines.push({
				type: 'unchanged',
				oldIdx,
				newIdx,
				content: oldLines[oldIdx] ?? '',
			});
			oldIdx++;
			newIdx++;
		} else if (!matches.has(oldIdx) && oldIdx < oldLines.length) {
			// Removed line
			diffLines.push({
				type: 'removed',
				oldIdx,
				newIdx: null,
				content: oldLines[oldIdx] ?? '',
			});
			oldIdx++;
		} else if (newIdx < newLines.length) {
			// Added line
			diffLines.push({
				type: 'added',
				oldIdx: null,
				newIdx,
				content: newLines[newIdx] ?? '',
			});
			newIdx++;
		} else {
			oldIdx++;
		}
	}

	// Group into hunks with context
	let hunkStart = -1;
	let lastChangeIdx = -1;

	for (let i = 0; i < diffLines.length; i++) {
		const line = diffLines[i];
		if (!line) continue;

		if (line.type !== 'unchanged') {
			if (hunkStart === -1) {
				// Start new hunk with context
				hunkStart = Math.max(0, i - contextLines);
			}
			lastChangeIdx = i;
		}

		// Check if we should close current hunk
		if (hunkStart !== -1 && line.type === 'unchanged') {
			const distanceFromLastChange = i - lastChangeIdx;
			if (distanceFromLastChange > contextLines * 2) {
				// Close hunk
				const hunkEnd = lastChangeIdx + contextLines + 1;
				hunks.push(createHunk(diffLines, hunkStart, hunkEnd));
				hunkStart = -1;
				lastChangeIdx = -1;
			}
		}
	}

	// Close final hunk if open
	if (hunkStart !== -1) {
		const hunkEnd = Math.min(diffLines.length, lastChangeIdx + contextLines + 1);
		hunks.push(createHunk(diffLines, hunkStart, hunkEnd));
	}

	return hunks;
}

/**
 * Create a hunk from diff lines
 */
function createHunk(
	diffLines: Array<{
		type: DiffLineType;
		oldIdx: number | null;
		newIdx: number | null;
		content: string;
	}>,
	start: number,
	end: number
): DiffHunk {
	const lines: DiffLine[] = [];
	let oldStart = 0;
	let oldCount = 0;
	let newStart = 0;
	let newCount = 0;
	let foundFirst = false;

	for (let i = start; i < end && i < diffLines.length; i++) {
		const dl = diffLines[i];
		if (!dl) continue;

		if (!foundFirst) {
			if (dl.oldIdx !== null) oldStart = dl.oldIdx + 1;
			if (dl.newIdx !== null) newStart = dl.newIdx + 1;
			foundFirst = true;
		}

		lines.push({
			type: dl.type,
			content: dl.content,
			oldLineNumber: dl.oldIdx !== null ? dl.oldIdx + 1 : null,
			newLineNumber: dl.newIdx !== null ? dl.newIdx + 1 : null,
		});

		if (dl.type === 'unchanged' || dl.type === 'removed') {
			oldCount++;
		}
		if (dl.type === 'unchanged' || dl.type === 'added') {
			newCount++;
		}
	}

	return {
		oldStart: oldStart || 1,
		oldCount,
		newStart: newStart || 1,
		newCount,
		lines,
	};
}

/**
 * Generate unified diff string from hunks
 */
function generateUnifiedDiff(hunks: DiffHunk[], filePath?: string): string {
	if (hunks.length === 0) {
		return '';
	}

	const lines: string[] = [];

	// Add file headers if path provided
	if (filePath) {
		lines.push(`--- a/${filePath}`);
		lines.push(`+++ b/${filePath}`);
	}

	for (const hunk of hunks) {
		// Hunk header
		lines.push(`@@ -${hunk.oldStart},${hunk.oldCount} +${hunk.newStart},${hunk.newCount} @@`);

		for (const line of hunk.lines) {
			switch (line.type) {
				case 'unchanged':
					lines.push(` ${line.content}`);
					break;
				case 'added':
					lines.push(`+${line.content}`);
					break;
				case 'removed':
					lines.push(`-${line.content}`);
					break;
			}
		}
	}

	return lines.join('\n');
}

/**
 * Compute diff between local and remote content
 *
 * @param local Local file content
 * @param remote Remote file content
 * @param options Diff options
 * @returns Diff result with hunks, stats, and unified diff string
 */
export function computeDiff(local: string, remote: string, options: DiffOptions = {}): DiffResult {
	const { contextLines = 3, ignoreWhitespace = false, filePath } = options;

	// Check for binary content
	if (isBinaryContent(local) || isBinaryContent(remote)) {
		return {
			identical: local === remote,
			isBinary: true,
			hunks: [],
			stats: { additions: 0, deletions: 0, unchanged: 0, totalLines: 0 },
			unifiedDiff: filePath
				? `Binary files a/${filePath} and b/${filePath} differ`
				: 'Binary files differ',
		};
	}

	// Normalize content if ignoring whitespace
	let processedLocal = local;
	let processedRemote = remote;

	if (ignoreWhitespace) {
		processedLocal = local.replace(/[ \t]+/g, ' ').replace(/[ \t]+$/gm, '');
		processedRemote = remote.replace(/[ \t]+/g, ' ').replace(/[ \t]+$/gm, '');
	}

	// Check if identical
	if (processedLocal === processedRemote) {
		return {
			identical: true,
			isBinary: false,
			hunks: [],
			stats: {
				additions: 0,
				deletions: 0,
				unchanged: splitLines(local).length,
				totalLines: splitLines(local).length,
			},
			unifiedDiff: '',
		};
	}

	// Split into lines
	const oldLines = splitLines(processedLocal);
	const newLines = splitLines(processedRemote);

	// Compute LCS and generate hunks
	const matches = computeLCS(oldLines, newLines);
	const hunks = generateHunks(oldLines, newLines, matches, contextLines);

	// Calculate stats
	let additions = 0;
	let deletions = 0;

	for (const hunk of hunks) {
		for (const line of hunk.lines) {
			switch (line.type) {
				case 'added':
					additions++;
					break;
				case 'removed':
					deletions++;
					break;
				case 'unchanged':
					// Just tracking for hunks, strict count comes from matches
					break;
			}
		}
	}

	// Count unchanged lines not in hunks
	const totalUnchanged = matches.size;

	return {
		identical: false,
		isBinary: false,
		hunks,
		stats: {
			additions,
			deletions,
			unchanged: totalUnchanged,
			totalLines: oldLines.length + additions,
		},
		unifiedDiff: generateUnifiedDiff(hunks, filePath),
	};
}

/**
 * Format diff stats for display
 */
export function formatDiffStats(stats: DiffStats): string {
	const parts: string[] = [];

	if (stats.additions > 0) {
		parts.push(`+${stats.additions}`);
	}
	if (stats.deletions > 0) {
		parts.push(`-${stats.deletions}`);
	}

	if (parts.length === 0) {
		return 'no changes';
	}

	return parts.join(', ');
}

/**
 * Check if a file has been locally modified by comparing checksums
 */
export function hasLocalModifications(currentChecksum: string, installedChecksum: string): boolean {
	return currentChecksum !== installedChecksum;
}
