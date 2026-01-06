#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
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
 * @property {'style-attribute' | 'style-binding' | 'style-directive' | 'style-shorthand'} type - Type of violation
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
		.replace(/<script[\s\S]*?<\/script>/gi, match => match.replace(/[^\n]/g, ' '))
		.replace(/<style[\s\S]*?<\/style>/gi, match => match.replace(/[^\n]/g, ' '))
		.replace(/<!--[\s\S]*?-->/g, match => match.replace(/[^\n]/g, ' '));
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
						'.git',
						'.svelte-kit',
						'.tmp',
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
 * Scan Svelte source files for inline style violations
 * @param {string} pattern - Glob pattern for files to scan (relative to workspace root or absolute path)
 * @returns {SourceScanResult[]}
 */
export function scanSvelteSource(pattern) {
	const workspaceRoot = join(__dirname, '..');
	const results = [];
	
	// Determine if pattern is absolute or relative
	const searchPath = pattern.startsWith('/') || pattern.startsWith('C:') 
		? pattern 
		: join(workspaceRoot, pattern);
	
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
	const styleDirectiveRegex =
		/\bstyle:[a-zA-Z-]+\s*=\s*(\{[^}]*\}|"[^"]*"|'[^']*')/g;
			for (const match of masked.matchAll(styleDirectiveRegex)) {
				addViolation(
					match.index,
					'style-directive',
					'Replace style directive with a CSS class (or class-based CSS variable)'
				);
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
	const buildDir = directory.startsWith('/') || directory.startsWith('C:')
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
	}
	
	// Scan build output
	for (const path of buildPaths) {
		buildViolations.push(...scanBuildOutput(path));
	}
	
	// Calculate summary
	const totalViolations = sourceViolations.length + buildViolations.length;
	const allViolations = [...sourceViolations, ...buildViolations];
	const shipBlocking = allViolations.filter(v => v.category === 'ship-blocking').length;
	const followUp = totalViolations - shipBlocking;
	
	// Identify ship-blocking components
	const shipBlockingComponents = [...new Set(
		sourceViolations
			.filter(v => v.category === 'ship-blocking')
			.map(v => v.file)
	)].sort();
	
	return {
		timestamp: new Date().toISOString(),
		summary: {
			totalViolations,
			shipBlocking,
			followUp
		},
		sourceViolations,
		buildViolations,
		shipBlockingComponents
	};
}

/**
 * Format report as markdown
 * @param {ViolationReport} report
 * @returns {string}
 */
function formatReportMarkdown(report) {
	let md = `# CSP Violation Report\n\n`;
	md += `Generated: ${report.timestamp}\n\n`;
	md += `## Summary\n\n`;
	md += `- Total Violations: ${report.summary.totalViolations}\n`;
	md += `- Ship-Blocking: ${report.summary.shipBlocking}\n`;
	md += `- Follow-Up: ${report.summary.followUp}\n`;
	md += `\n`;
	
	if (report.shipBlockingComponents.length > 0) {
		md += `## Ship-Blocking Components\n\n`;
		for (const component of report.shipBlockingComponents) {
			md += `- ${component}\n`;
		}
		md += `\n`;
	}
	
	// Group violations by category for clearer reporting
	const shipBlockingViolations = report.sourceViolations.filter(v => v.category === 'ship-blocking');
	const followUpViolations = report.sourceViolations.filter(v => v.category === 'follow-up');
	
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
	
	if (report.buildViolations.length > 0) {
		md += `## Build Violations\n\n`;
		for (const violation of report.buildViolations) {
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
	
	console.log('Scanning for CSP violations...\n');
	
	const report = generateReport(sourcePaths, buildPaths);
	
	console.log(formatReportMarkdown(report));
	
	// Exit with error code if any violations found
	if (report.summary.totalViolations > 0) {
		process.exit(1);
	}
}
