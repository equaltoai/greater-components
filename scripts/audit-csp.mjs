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
 * @property {'style-attribute' | 'style-binding' | 'style-directive'} type - Type of violation
 * @property {string} snippet - Code snippet showing the violation
 * @property {'ship-blocking' | 'follow-up' | 'allowlisted'} category - Categorization
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
 * @property {number} summary.allowlisted - Allowlisted violation count
 * @property {SourceScanResult[]} sourceViolations - Source code violations
 * @property {BuildScanResult[]} buildViolations - Build output violations
 * @property {string[]} shipBlockingComponents - List of ship-blocking component files
 */

/**
 * Allowlist for components that are exempt from CSP violations.
 * These are typically dev-only components or components with documented exceptions.
 * Format: Array of file path patterns (relative to workspace root)
 * 
 * Categories:
 * 1. Dev-only theme tooling components - use CSS custom properties via style: directives
 * 2. Components pending CSP refactor in future milestones
 * 3. Components that use style: directives for CSS custom properties (acceptable)
 */
const CSP_ALLOWLIST = [
	// Dev-only theme tooling components - use CSS custom properties via style: directives
	// These are acceptable because they set CSS custom properties, not arbitrary styles
	'packages/primitives/src/components/Theme/ColorHarmonyPicker.svelte',
	
	// Components pending CSP refactor in future milestones
	// These use style: directives for dynamic sizing/positioning
	// TODO: Refactor in Milestone 3 (dynamic components)
	'packages/primitives/src/components/GradientText.svelte',
	'packages/primitives/src/components/IconBadge.svelte',
	'packages/primitives/src/components/Menu/Content.svelte',
	'packages/primitives/src/components/StreamingText.svelte',
];

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
				// Skip node_modules, dist, build, coverage, .git
				if (!['node_modules', 'dist', 'build', 'coverage', '.git', '.svelte-kit'].includes(entry)) {
					results.push(...findFiles(fullPath, pattern));
				}
			} else if (stat.isFile() && fullPath.endsWith(pattern)) {
				results.push(fullPath);
			}
		}
	} catch (err) {
		console.warn(`Warning: Could not read directory ${dir}: ${err.message}`);
	}
	
	return results;
}

/**
 * Check if a file path is in the allowlist
 * @param {string} filePath - File path to check
 * @returns {boolean}
 */
function isAllowlisted(filePath) {
	return CSP_ALLOWLIST.some(pattern => filePath.includes(pattern) || filePath.endsWith(pattern));
}

/**
 * Categorize a violation based on file path
 * @param {string} filePath - File path to categorize
 * @returns {'ship-blocking' | 'follow-up' | 'allowlisted'}
 */
function categorizeViolation(filePath) {
	// Check allowlist first
	if (isAllowlisted(filePath)) {
		return 'allowlisted';
	}
	// Ship-blocking: primitives package components
	if (filePath.includes('packages/primitives/src/components/')) {
		return 'ship-blocking';
	}
	return 'follow-up';
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
			const lines = content.split('\n');
			const relPath = relative(workspaceRoot, filePath);
			
			// Scan for style="..." attributes
			const styleAttrRegex = /style\s*=\s*"[^"]*"/g;
			lines.forEach((line, idx) => {
				let match;
				while ((match = styleAttrRegex.exec(line)) !== null) {
					results.push({
						file: relPath,
						line: idx + 1,
						column: match.index + 1,
						type: 'style-attribute',
						snippet: line.trim(),
						category: categorizeViolation(relPath),
						remediation: 'Replace inline style with CSS class'
					});
				}
			});
			
			// Scan for style={...} bindings
			const styleBindingRegex = /style\s*=\s*\{[^}]*\}/g;
			lines.forEach((line, idx) => {
				let match;
				while ((match = styleBindingRegex.exec(line)) !== null) {
					results.push({
						file: relPath,
						line: idx + 1,
						column: match.index + 1,
						type: 'style-binding',
						snippet: line.trim(),
						category: categorizeViolation(relPath),
						remediation: 'Replace inline style binding with CSS class'
					});
				}
			});
			
			// Scan for style: directives (Svelte style directives)
			// These compile to inline styles in the rendered HTML
			const styleDirectiveRegex = /style:[a-zA-Z-]+\s*=\s*[{"][^}"]*[}"]/g;
			lines.forEach((line, idx) => {
				let match;
				while ((match = styleDirectiveRegex.exec(line)) !== null) {
					results.push({
						file: relPath,
						line: idx + 1,
						column: match.index + 1,
						type: 'style-directive',
						snippet: line.trim(),
						category: categorizeViolation(relPath),
						remediation: 'Replace style directive with CSS class or CSS custom property set via class'
					});
				}
			});
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
				if (styleAttr) {
					// Find line number by counting newlines before this element
					const elementHtml = element.toString();
					const position = content.indexOf(elementHtml);
					const lineNumber = content.substring(0, position).split('\n').length;
					
					results.push({
						file: relPath,
						line: lineNumber,
						type: 'inline-style',
						snippet: elementHtml.substring(0, 100) + (elementHtml.length > 100 ? '...' : ''),
						category: categorizeViolation(relPath)
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
						category: categorizeViolation(relPath)
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
	const allowlisted = allViolations.filter(v => v.category === 'allowlisted').length;
	const followUp = totalViolations - shipBlocking - allowlisted;
	
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
			followUp,
			allowlisted
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
	md += `- Allowlisted: ${report.summary.allowlisted}\n\n`;
	
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
	const allowlistedViolations = report.sourceViolations.filter(v => v.category === 'allowlisted');
	
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
	
	if (allowlistedViolations.length > 0) {
		md += `## Allowlisted Source Violations\n\n`;
		md += `*These violations are in the allowlist and do not block shipping.*\n\n`;
		for (const violation of allowlistedViolations) {
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
	
	// Exit with error code if ship-blocking violations found
	if (report.summary.shipBlocking > 0) {
		process.exit(1);
	}
}
