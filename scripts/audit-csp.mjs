#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { parse } from 'node-html-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef {Object} SourceScanResult
 * @property {string} file - File path relative to workspace root
 * @property {number} line - Line number (1-indexed)
 * @property {number} column - Column number (1-indexed)
 * @property {'style-attribute' | 'style-binding' | 'style-directive' | 'style-shorthand' | 'runtime-style-assign' | 'runtime-style-property' | 'runtime-style-cssText' | 'runtime-style-setProperty' | 'runtime-style-attr' | 'runtime-style-tag' | 'css-global-selector'} type - Type of violation
 * @property {string} snippet - Code snippet showing the violation
 * @property {'ship-blocking' | 'follow-up'} category - Categorization
 * @property {string} remediation - Suggested remediation approach
 */

/**
 * @typedef {Object} BuildScanResult
 * @property {string} file - File path relative to workspace root
 * @property {number} line - Line number (1-indexed)
 * @property {'inline-style' | 'inline-script'} type - Type of violation
 * @property {string} snippet - HTML snippet showing the violation
 * @property {'ship-blocking' | 'follow-up'} category - Categorization
 */

/**
 * @typedef {Object} ViolationReport
 * @property {string} timestamp - ISO timestamp of scan
 * @property {Object} summary - Summary statistics
 * @property {number} summary.totalViolations - Total violation count
 * @property {number} summary.shipBlocking - Ship-blocking violation count
 * @property {number} summary.followUp - Follow-up violation count
 * @property {SourceScanResult[]} sourceViolations - Source code violations
 * @property {BuildScanResult[]} buildViolations - Build output violations
 * @property {string[]} shipBlockingComponents - List of ship-blocking component files
 */

/**
 * Replace non-markup regions with whitespace so pattern scans don't false-positive
 * (keeps indices stable by preserving newlines and overall string length).
 * @param {string} content
 * @returns {string}
 */
function maskNonMarkup(content) {
	return content
		.replace(/<script[\s\S]*?<\/script\b[^>]*>/gi, (match) => match.replace(/[^\n]/g, ' '))
		.replace(/<style[\s\S]*?<\/style\b[^>]*>/gi, (match) => match.replace(/[^\n]/g, ' '))
		.replace(/<!--[\s\S]*?-->/g, (match) => match.replace(/[^\n]/g, ' '));
}

/**
 * Convert a string index into 1-indexed line and column numbers.
 * @param {string} content
 * @param {number} index
 * @returns {{ line: number, column: number }}
 */
function indexToLineColumn(content, index) {
	const linesBefore = content.slice(0, index).split('\n');
	const line = linesBefore.length;
	const column = linesBefore.at(-1)?.length + 1;
	return { line, column };
}

/**
 * Extract a single-line snippet for a match location.
 * @param {string} content
 * @param {number} lineNumber - 1-indexed
 * @returns {string}
 */
function lineSnippet(content, lineNumber) {
	const lines = content.split('\n');
	return (lines[lineNumber - 1] ?? '').trim();
}

/**
 * Recursively find all files matching a pattern
 * @param {string} dir - Directory to search
 * @param {string} pattern - File extension pattern (e.g., '.svelte')
 * @returns {string[]} Array of file paths
 */
function findFiles(dir, pattern) {
	const results = [];

	try {
		const entries = readdirSync(dir);

		for (const entry of entries) {
			const fullPath = join(dir, entry);
			const stat = statSync(fullPath);

			if (stat.isDirectory()) {
				// Skip generated or irrelevant directories
				if (
					![
						'node_modules',
						'dist',
						'build',
						'coverage',
						'reports',
						'fixtures',
						'.git',
						'.svelte-kit',
						'.tmp',
						'tmp',
						'test',
						'tests',
					].includes(entry)
				) {
					results.push(...findFiles(fullPath, pattern));
				}
			} else if (stat.isFile() && fullPath.endsWith(pattern)) {
				results.push(fullPath);
			}
		}
	} catch (err) {
		// Missing directories are common in CI when build output hasn't been produced yet.
		if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
			return results;
		}

		console.warn(`Warning: Could not read directory ${dir}: ${err.message}`);
	}

	return results;
}

/**
 * Categorize a violation based on file path.
 * Strict CSP policy treats all violations as ship-blocking.
 * @returns {'ship-blocking' | 'follow-up'}
 */
function categorizeViolation() {
	return 'ship-blocking';
}

/**
 * Extract <script> block contents from a Svelte file along with their starting index in the original string.
 * @param {string} content
 * @returns {{ content: string, startIndex: number }[]}
 */
function extractSvelteScripts(content) {
	const scripts = [];
	const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script\b[^>]*>/gi;

	for (const match of content.matchAll(scriptRegex)) {
		const fullMatch = match[0] ?? '';
		const inner = match[1] ?? '';

		// Calculate start index of inner content within the full file
		const matchStart = match.index ?? 0;
		const innerStart = matchStart + fullMatch.indexOf(inner);

		scripts.push({ content: inner, startIndex: innerStart });
	}

	return scripts;
}

/**
 * Scan a code string for runtime strict-CSP violations.
 * @param {string} code
 * @param {number} codeStartIndex
 * @param {(matchIndex: number, type: SourceScanResult['type'], remediation: string) => void} addViolation
 */
function scanRuntimeStrictCspPatterns(code, codeStartIndex, addViolation) {
	/** @type {{ type: SourceScanResult['type'], regex: RegExp, remediation: string, skip?: (index: number) => boolean }[]} */
	const patterns = [
		{
			type: 'runtime-style-tag',
			regex: /\bdocument\.createElement\(\s*['"]style['"]\s*\)/g,
			remediation: 'Avoid runtime <style> injection; ship external CSS and toggle classes instead',
		},
		{
			type: 'runtime-style-attr',
			regex: /\bsetAttribute\(\s*['"]style['"]\s*,/g,
			remediation:
				"Avoid setting the 'style' attribute; use classes/external CSS or CSP-safe alternatives",
		},
		{
			type: 'runtime-style-cssText',
			regex: /\.style\.cssText\s*([+*/-]?=|\+\+|--)/g,
			remediation: 'Avoid style.cssText; use classes/external CSS or CSP-safe alternatives',
		},
		{
			type: 'runtime-style-setProperty',
			regex: /\.style\.setProperty\b/g,
			remediation:
				'Avoid style.setProperty; prefer classes/external CSS (or a CSP-safe dynamic styling helper)',
		},
		{
			type: 'runtime-style-assign',
			regex: /\.style\s*([+*/-]?=|\+\+|--)/g,
			remediation:
				'Avoid assigning element.style; use classes/external CSS or CSP-safe alternatives',
		},
		{
			type: 'runtime-style-property',
			regex: /\.style\.(?!cssText\b)[a-zA-Z_$][a-zA-Z0-9_$-]*\s*([+*/-]?=|\+\+|--)/g,
			remediation:
				'Avoid element.style.* writes; use classes/external CSS or CSP-safe alternatives',
		},
	];

	for (const { type, regex, remediation } of patterns) {
		for (const match of code.matchAll(regex)) {
			const matchIndex = match.index ?? -1;
			if (matchIndex < 0) continue;

			addViolation(codeStartIndex + matchIndex, type, remediation);
		}
	}
}

/**
 * Scan Svelte source files for inline style violations
 * @param {string} pattern - Glob pattern for files to scan (relative to workspace root or absolute path)
 * @returns {SourceScanResult[]}
 */
export function scanSvelteSource(pattern) {
	const workspaceRoot = join(__dirname, '..');
	const results = [];

	// Determine if pattern is absolute or relative
	const searchPath =
		pattern.startsWith('/') || pattern.startsWith('C:') ? pattern : join(workspaceRoot, pattern);

	// Find all .svelte files matching the pattern
	const files = findFiles(searchPath, '.svelte');

	for (const filePath of files) {
		try {
			const content = readFileSync(filePath, 'utf-8');
			const masked = maskNonMarkup(content);
			const relPath = relative(workspaceRoot, filePath);

			const addViolation = (matchIndex, type, remediation) => {
				const { line, column } = indexToLineColumn(content, matchIndex);

				results.push({
					file: relPath,
					line,
					column,
					type,
					snippet: lineSnippet(content, line),
					category: categorizeViolation(relPath),
					remediation,
				});
			};

			// Scan for style="..." or style='...' attributes
			const styleAttrRegex = /\bstyle\s*=\s*("([^"]*)"|'([^']*)')/g;
			for (const match of masked.matchAll(styleAttrRegex)) {
				addViolation(match.index, 'style-attribute', 'Replace inline style with a CSS class');
			}

			// Scan for style={...} bindings
			const styleBindingRegex = /\bstyle\s*=\s*\{[^}]*\}/g;
			for (const match of masked.matchAll(styleBindingRegex)) {
				addViolation(match.index, 'style-binding', 'Replace style binding with a CSS class');
			}

			// Scan for {style} shorthand attributes
			// Svelte compiles this to a style=... attribute in the rendered HTML.
			const styleShorthandRegex = /\{style\}/g;
			for (const match of masked.matchAll(styleShorthandRegex)) {
				addViolation(match.index, 'style-shorthand', 'Remove style shorthand and use CSS classes');
			}

			// Scan for style: directives (Svelte style directives)
			// These compile to inline styles in the rendered HTML
			const styleDirectiveRegex = /\bstyle:[a-zA-Z-]+\s*=\s*(\{[^}]*\}|"[^"]*"|'[^']*')/g;
			for (const match of masked.matchAll(styleDirectiveRegex)) {
				addViolation(
					match.index,
					'style-directive',
					'Replace style directive with a CSS class (or class-based CSS variable)'
				);
			}

			// Scan for runtime style writes inside <script> blocks (strict CSP)
			for (const script of extractSvelteScripts(content)) {
				scanRuntimeStrictCspPatterns(script.content, script.startIndex, addViolation);
			}
		} catch (err) {
			console.warn(`Warning: Could not read file ${filePath}: ${err.message}`);
		}
	}

	return results;
}

/**
 * Scan JS/TS source files for runtime strict-CSP violations (element.style.*, <style> injection, etc).
 * Only scans package source, excluding tests/reports/fixtures via findFiles().
 *
 * @param {string} pattern - Directory to scan (relative to workspace root or absolute path)
 * @returns {SourceScanResult[]}
 */
export function scanRuntimeSource(pattern) {
	const workspaceRoot = join(__dirname, '..');
	const results = [];

	const searchPath =
		pattern.startsWith('/') || pattern.startsWith('C:') ? pattern : join(workspaceRoot, pattern);

	/** @type {string[]} */
	const extensions = ['.ts', '.js'];

	/** @type {string[]} */
	const files = [];
	for (const ext of extensions) {
		files.push(...findFiles(searchPath, ext));
	}

	for (const filePath of files) {
		// Only enforce against package source code (avoid scanning build tooling and misc).
		if (!filePath.includes(`${join('packages', '')}`) || !filePath.includes(`${join('src', '')}`)) {
			continue;
		}

		// Ignore the testing package for runtime strict-CSP enforcement (dev-only artifacts and report tooling).
		if (filePath.includes(`${join('packages', 'testing')}`)) {
			continue;
		}

		try {
			const content = readFileSync(filePath, 'utf-8');
			const relPath = relative(workspaceRoot, filePath);

			const addViolation = (matchIndex, type, remediation) => {
				const { line, column } = indexToLineColumn(content, matchIndex);

				results.push({
					file: relPath,
					line,
					column,
					type,
					snippet: lineSnippet(content, line),
					category: categorizeViolation(relPath),
					remediation,
				});
			};

			scanRuntimeStrictCspPatterns(content, 0, addViolation);
		} catch (err) {
			console.warn(`Warning: Could not read file ${filePath}: ${err.message}`);
		}
	}

	return results;
}

/**
 * Scan face theme CSS for unscoped global element selectors that can mutate host apps.
 * @param {string} pattern - Directory to scan (relative to workspace root or absolute path)
 * @returns {SourceScanResult[]}
 */
export function scanFaceThemeCss(pattern) {
	const workspaceRoot = join(__dirname, '..');
	const results = [];

	const searchPath =
		pattern.startsWith('/') || pattern.startsWith('C:') ? pattern : join(workspaceRoot, pattern);

	const cssFiles = findFiles(searchPath, '.css').filter((p) =>
		p.endsWith(`${join('src', 'theme.css')}`)
	);

	for (const filePath of cssFiles) {
		try {
			const content = readFileSync(filePath, 'utf-8');
			const relPath = relative(workspaceRoot, filePath);
			const withoutComments = content.replace(/\/\*[\s\S]*?\*\//g, (match) =>
				match.replace(/[^\n]/g, ' ')
			);

			const lines = withoutComments.split('\n');
			for (let i = 0; i < lines.length; i += 1) {
				const line = lines[i] ?? '';
				const match = /^\s*(body|html|h1)\b[^{]*\{/.exec(line);
				if (!match) continue;

				const column = line.indexOf(match[1] ?? '') + 1;
				results.push({
					file: relPath,
					line: i + 1,
					column: column > 0 ? column : 1,
					type: 'css-global-selector',
					snippet: line.trim(),
					category: categorizeViolation(relPath),
					remediation:
						'Scope selectors to a component root class; avoid global body/html/h1 rules in face themes',
				});
			}
		} catch (err) {
			console.warn(`Warning: Could not read file ${filePath}: ${err.message}`);
		}
	}

	return results;
}

/**
 * Scan built HTML output for inline styles and scripts
 * @param {string} directory - Directory containing built HTML files (relative to workspace root or absolute path)
 * @returns {BuildScanResult[]}
 */
export function scanBuildOutput(directory) {
	const workspaceRoot = join(__dirname, '..');
	const results = [];

	// Determine if directory is absolute or relative
	const buildDir =
		directory.startsWith('/') || directory.startsWith('C:')
			? directory
			: join(workspaceRoot, directory);

	// Find all HTML files
	const files = findFiles(buildDir, '.html');

	for (const filePath of files) {
		try {
			const content = readFileSync(filePath, 'utf-8');
			const relPath = relative(workspaceRoot, filePath);
			const root = parse(content);

			// Find all elements with style attributes
			const elementsWithStyle = root.querySelectorAll('[style]');
			for (const element of elementsWithStyle) {
				const styleAttr = element.getAttribute('style');
				if (styleAttr !== null) {
					// Find line number by counting newlines before this element
					const elementHtml = element.toString();
					const position = content.indexOf(elementHtml);
					const lineNumber = content.substring(0, position).split('\n').length;

					results.push({
						file: relPath,
						line: lineNumber,
						type: 'inline-style',
						snippet: elementHtml.substring(0, 100) + (elementHtml.length > 100 ? '...' : ''),
						category: categorizeViolation(relPath),
					});
				}
			}

			// Find all inline script tags (without src attribute)
			const scripts = root.querySelectorAll('script');
			for (const script of scripts) {
				if (!script.getAttribute('src') && script.textContent.trim()) {
					const scriptHtml = script.toString();
					const position = content.indexOf(scriptHtml);
					const lineNumber = content.substring(0, position).split('\n').length;

					results.push({
						file: relPath,
						line: lineNumber,
						type: 'inline-script',
						snippet: scriptHtml.substring(0, 100) + (scriptHtml.length > 100 ? '...' : ''),
						category: categorizeViolation(relPath),
					});
				}
			}
		} catch (err) {
			console.warn(`Warning: Could not parse file ${filePath}: ${err.message}`);
		}
	}

	return results;
}

/**
 * Generate a complete violation report
 * @param {string[]} sourcePaths - Paths to scan for source violations
 * @param {string[]} buildPaths - Paths to scan for build violations
 * @returns {ViolationReport}
 */
export function generateReport(sourcePaths, buildPaths) {
	const sourceViolations = [];
	const buildViolations = [];

	// Scan source files
	for (const path of sourcePaths) {
		sourceViolations.push(...scanSvelteSource(path));
		sourceViolations.push(...scanRuntimeSource(path));
	}

	// Scan face theme CSS for global selectors
	sourceViolations.push(...scanFaceThemeCss('packages/faces'));

	// Scan build output
	for (const path of buildPaths) {
		buildViolations.push(...scanBuildOutput(path));
	}

	// Calculate summary
	const totalViolations = sourceViolations.length + buildViolations.length;
	const allViolations = [...sourceViolations, ...buildViolations];
	const shipBlocking = allViolations.filter((v) => v.category === 'ship-blocking').length;
	const followUp = totalViolations - shipBlocking;

	// Identify ship-blocking components
	const shipBlockingComponents = [
		...new Set(sourceViolations.filter((v) => v.category === 'ship-blocking').map((v) => v.file)),
	].sort();

	return {
		timestamp: new Date().toISOString(),
		summary: {
			totalViolations,
			shipBlocking,
			followUp,
		},
		sourceViolations,
		buildViolations,
		shipBlockingComponents,
	};
}

/**
 * @typedef {Object} BaselineReport
 * @property {Set<string>} baselineKeys
 * @property {Set<string>} matchedKeys
 * @property {SourceScanResult[]} newSourceViolations
 * @property {BuildScanResult[]} newBuildViolations
 */

/**
 * @param {SourceScanResult | BuildScanResult} violation
 * @returns {string}
 */
function violationKey(violation) {
	// @ts-expect-error - runtime shape check
	const column = typeof violation.column === 'number' ? violation.column : 0;
	return `${violation.file}:${violation.line}:${column}:${violation.type}`;
}

/**
 * Load baseline keys from scripts/audit-csp.baseline.json.
 * @param {string} workspaceRoot
 * @returns {Set<string> | null}
 */
function loadBaselineKeys(workspaceRoot) {
	const baselinePath = join(workspaceRoot, 'scripts', 'audit-csp.baseline.json');

	try {
		const parsed = JSON.parse(readFileSync(baselinePath, 'utf-8'));
		if (!Array.isArray(parsed)) return null;
		return new Set(parsed.filter((v) => typeof v === 'string'));
	} catch {
		return null;
	}
}

/**
 * Persist baseline keys to scripts/audit-csp.baseline.json.
 * @param {string} workspaceRoot
 * @param {string[]} keys
 */
function writeBaselineKeys(workspaceRoot, keys) {
	const baselinePath = join(workspaceRoot, 'scripts', 'audit-csp.baseline.json');
	writeFileSync(baselinePath, JSON.stringify(keys.sort(), null, 2) + '\n', 'utf-8');
}

/**
 * Apply a baseline to a report, returning only *new* violations.
 * @param {ViolationReport} report
 * @param {Set<string>} baselineKeys
 * @returns {BaselineReport}
 */
function applyBaseline(report, baselineKeys) {
	const matchedKeys = new Set();

	const newSourceViolations = [];
	for (const violation of report.sourceViolations) {
		const key = violationKey(violation);
		if (baselineKeys.has(key)) {
			matchedKeys.add(key);
			continue;
		}
		newSourceViolations.push(violation);
	}

	const newBuildViolations = [];
	for (const violation of report.buildViolations) {
		const key = violationKey(violation);
		if (baselineKeys.has(key)) {
			matchedKeys.add(key);
			continue;
		}
		newBuildViolations.push(violation);
	}

	return {
		baselineKeys,
		matchedKeys,
		newSourceViolations,
		newBuildViolations,
	};
}

/**
 * Format report as markdown
 * @param {ViolationReport} report
 * @param {BaselineReport | null} baselineReport
 * @returns {string}
 */
function formatReportMarkdown(report, baselineReport) {
	let md = `# CSP Violation Report\n\n`;
	md += `Generated: ${report.timestamp}\n\n`;
	md += `## Summary\n\n`;

	if (baselineReport) {
		const newTotal =
			baselineReport.newSourceViolations.length + baselineReport.newBuildViolations.length;
		const baselineTotal = baselineReport.matchedKeys.size;
		const resolvedBaseline = baselineReport.baselineKeys.size - baselineReport.matchedKeys.size;

		md += `- New Violations: ${newTotal}\n`;
		md += `- Baseline Violations (ignored): ${baselineTotal}\n`;
		md += `- Resolved Baseline Entries (remove from baseline): ${resolvedBaseline}\n`;
	} else {
		md += `- Total Violations: ${report.summary.totalViolations}\n`;
		md += `- Ship-Blocking: ${report.summary.shipBlocking}\n`;
		md += `- Follow-Up: ${report.summary.followUp}\n`;
	}

	md += `\n`;

	const sourceViolations = baselineReport
		? baselineReport.newSourceViolations
		: report.sourceViolations;
	const buildViolations = baselineReport
		? baselineReport.newBuildViolations
		: report.buildViolations;

	if (report.shipBlockingComponents.length > 0 && !baselineReport) {
		md += `## Ship-Blocking Components\n\n`;
		for (const component of report.shipBlockingComponents) {
			md += `- ${component}\n`;
		}
		md += `\n`;
	}

	// Group violations by category for clearer reporting
	const shipBlockingViolations = sourceViolations.filter((v) => v.category === 'ship-blocking');
	const followUpViolations = sourceViolations.filter((v) => v.category === 'follow-up');

	if (shipBlockingViolations.length > 0) {
		md += `## Ship-Blocking Source Violations\n\n`;
		for (const violation of shipBlockingViolations) {
			md += `### ${violation.file}:${violation.line}:${violation.column}\n\n`;
			md += `- Type: ${violation.type}\n`;
			md += `- Category: ${violation.category}\n`;
			md += `- Remediation: ${violation.remediation}\n`;
			md += `- Snippet: \`${violation.snippet}\`\n\n`;
		}
	}

	if (followUpViolations.length > 0) {
		md += `## Follow-Up Source Violations\n\n`;
		for (const violation of followUpViolations) {
			md += `### ${violation.file}:${violation.line}:${violation.column}\n\n`;
			md += `- Type: ${violation.type}\n`;
			md += `- Category: ${violation.category}\n`;
			md += `- Remediation: ${violation.remediation}\n`;
			md += `- Snippet: \`${violation.snippet}\`\n\n`;
		}
	}

	if (buildViolations.length > 0) {
		md += `## Build Violations\n\n`;
		for (const violation of buildViolations) {
			md += `### ${violation.file}:${violation.line}\n\n`;
			md += `- Type: ${violation.type}\n`;
			md += `- Category: ${violation.category}\n`;
			md += `- Remediation: ${
				violation.type === 'inline-style'
					? 'Remove inline style attributes from built HTML output'
					: 'Replace inline scripts with external scripts (src=)'
			}\n`;
			md += `- Snippet: \`${violation.snippet}\`\n\n`;
		}
	}

	return md;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
	const sourcePaths = ['packages'];
	const buildPaths = ['apps/docs/build', 'apps/playground/build'];
	const workspaceRoot = join(__dirname, '..');
	const updateBaseline = process.argv.includes('--update-baseline');

	console.log('Scanning for CSP violations...\n');

	const report = generateReport(sourcePaths, buildPaths);
	const baselineKeys = loadBaselineKeys(workspaceRoot);

	if (updateBaseline) {
		const keys = [
			...report.sourceViolations.map(violationKey),
			...report.buildViolations.map(violationKey),
		];
		writeBaselineKeys(workspaceRoot, keys);
		console.log('Updated CSP baseline: scripts/audit-csp.baseline.json\n');
		console.log(formatReportMarkdown(report, null));
		process.exit(0);
	}

	const baselineReport = baselineKeys ? applyBaseline(report, baselineKeys) : null;
	console.log(formatReportMarkdown(report, baselineReport));

	// Exit with error code if any violations found
	if (baselineReport) {
		const newTotal =
			baselineReport.newSourceViolations.length + baselineReport.newBuildViolations.length;
		if (newTotal > 0) {
			process.exit(1);
		}
	} else if (report.summary.totalViolations > 0) {
		process.exit(1);
	}
}
