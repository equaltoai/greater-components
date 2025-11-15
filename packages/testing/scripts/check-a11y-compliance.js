#!/usr/bin/env node

/**
 * Check Accessibility Compliance
 * Validates test results against WCAG standards and fails CI if violations found
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { program } from 'commander';

program
	.option('--results <path>', 'Path to test results directory', 'test-results')
	.option('--standard <level>', 'WCAG standard to check against (A, AA, AAA)', 'AA')
	.option(
		'--fail-on-violations <types>',
		'Comma-separated violation types to fail on',
		'critical,serious'
	)
	.option('--max-violations <number>', 'Maximum number of violations allowed', '0')
	.option('--output-format <format>', 'Output format (text, json)', 'text')
	.option('--verbose', 'Verbose output', false);

program.parse();

const options = program.opts();

class ComplianceChecker {
	constructor(options) {
		this.options = options;
		this.results = {
			totalTests: 0,
			totalViolations: 0,
			violationsByType: {
				critical: 0,
				serious: 0,
				moderate: 0,
				minor: 0,
			},
			componentScores: new Map(),
			wcagCompliance: {
				A: { passed: 0, total: 0 },
				AA: { passed: 0, total: 0 },
				AAA: { passed: 0, total: 0 },
			},
			violations: [],
		};

		this.failOnTypes = options.failOnViolations.split(',').map((t) => t.trim());
		this.maxViolations = parseInt(options.maxViolations);
	}

	async checkCompliance() {
		console.log(`🔍 Checking accessibility compliance (WCAG 2.1 Level ${this.options.standard})`);

		await this.collectResults();
		const analysis = this.analyzeCompliance();
		const isCompliant = this.determineCompliance(analysis);

		if (this.options.outputFormat === 'json') {
			this.outputJSON(analysis, isCompliant);
		} else {
			this.outputText(analysis, isCompliant);
		}

		if (!isCompliant) {
			console.error('❌ Accessibility compliance check failed');
			process.exit(1);
		} else {
			console.log('✅ Accessibility compliance check passed');
			process.exit(0);
		}
	}

	async collectResults() {
		const resultsDir = this.options.results;

		if (!fs.existsSync(resultsDir)) {
			throw new Error(`Results directory not found: ${resultsDir}`);
		}

		const files = this.getJSONFiles(resultsDir);

		for (const file of files) {
			try {
				const data = JSON.parse(fs.readFileSync(file, 'utf8'));
				this.processResultFile(data, path.basename(file));
			} catch (error) {
				if (this.options.verbose) {
					console.warn(`⚠️  Failed to process ${file}: ${error.message}`);
				}
			}
		}
	}

	getJSONFiles(dir) {
		const files = [];

		const scan = (directory) => {
			const entries = fs.readdirSync(directory, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(directory, entry.name);

				if (entry.isDirectory()) {
					scan(fullPath);
				} else if (entry.isFile() && entry.name.endsWith('.json')) {
					files.push(fullPath);
				}
			}
		};

		scan(dir);
		return files;
	}

	processResultFile(data, filename) {
		// Handle Playwright test results
		if (data.tests && Array.isArray(data.tests)) {
			this.processPlaywrightResults(data);
		}
		// Handle direct axe results
		else if (data.violations && Array.isArray(data.violations)) {
			this.processAxeResults(data);
		}
		// Handle custom test results
		else if (Array.isArray(data)) {
			data.forEach((result) => this.processGenericResult(result));
		}
		// Handle single test result
		else if (data.passed !== undefined || data.violations !== undefined) {
			this.processGenericResult(data);
		}
	}

	processPlaywrightResults(data) {
		for (const suite of data.suites || []) {
			this.processPlaywrightSuite(suite);
		}
	}

	processPlaywrightSuite(suite) {
		for (const spec of suite.specs || []) {
			this.results.totalTests++;

			// Check if test passed
			const passed = spec.tests?.[0]?.results?.[0]?.status === 'passed';

			if (!passed) {
				// Extract violation information from test failure
				const error = spec.tests?.[0]?.results?.[0]?.error?.message || '';
				const violation = this.parseViolationFromError(error, spec.title);

				if (violation) {
					this.addViolation(violation);
				}
			}
		}
	}

	processAxeResults(data) {
		this.results.totalTests++;

		if (data.violations && data.violations.length > 0) {
			for (const violation of data.violations) {
				this.addViolation({
					type: 'axe',
					id: violation.id,
					impact: violation.impact || 'moderate',
					description: violation.description,
					help: violation.help,
					helpUrl: violation.helpUrl,
					nodes: violation.nodes?.length || 0,
					tags: violation.tags || [],
					component: this.extractComponentName(violation),
				});
			}
		}

		// Update WCAG compliance
		this.updateWCAGCompliance(data);
	}

	processGenericResult(result) {
		this.results.totalTests++;

		if (result.violations && result.violations.length > 0) {
			for (const violation of result.violations) {
				this.addViolation(violation);
			}
		} else if (result.passed === false && result.error) {
			// Handle keyboard/focus test failures
			this.addViolation({
				type: 'keyboard',
				impact: 'serious',
				description: result.error,
				component: result.component || 'unknown',
			});
		}
	}

	addViolation(violation) {
		this.results.totalViolations++;
		this.results.violationsByType[violation.impact] =
			(this.results.violationsByType[violation.impact] || 0) + 1;

		this.results.violations.push(violation);

		// Update component scores
		const component = violation.component || 'unknown';
		if (!this.results.componentScores.has(component)) {
			this.results.componentScores.set(component, {
				name: component,
				violations: 0,
				critical: 0,
				serious: 0,
				moderate: 0,
				minor: 0,
			});
		}

		const componentScore = this.results.componentScores.get(component);
		componentScore.violations++;
		componentScore[violation.impact] = (componentScore[violation.impact] || 0) + 1;
	}

	parseViolationFromError(error, testTitle) {
		// Try to extract violation information from test error messages
		const axeViolationMatch = error.match(/Found (\d+) accessibility violations?.*?(\w+) impact/);
		if (axeViolationMatch) {
			return {
				type: 'axe',
				impact: axeViolationMatch[2]?.toLowerCase() || 'moderate',
				description: `Test failure: ${testTitle}`,
				component: this.extractComponentFromTitle(testTitle),
			};
		}

		// Keyboard test failures
		if (error.includes('keyboard') || error.includes('focus')) {
			return {
				type: 'keyboard',
				impact: 'serious',
				description: error,
				component: this.extractComponentFromTitle(testTitle),
			};
		}

		// Contrast failures
		if (error.includes('contrast')) {
			return {
				type: 'contrast',
				impact: 'moderate',
				description: error,
				component: this.extractComponentFromTitle(testTitle),
			};
		}

		return null;
	}

	extractComponentName(violation) {
		if (violation.component) return violation.component;

		// Try to extract from nodes
		if (violation.nodes?.[0]?.target?.[0]) {
			const target = violation.nodes[0].target[0];
			const match = target.match(/\[data-component="([^"]+)"\]/);
			if (match) return match[1];
		}

		return 'unknown';
	}

	extractComponentFromTitle(title) {
		// Extract component name from test title
		const match = title.match(/^(\w+)/);
		return match ? match[1].toLowerCase() : 'unknown';
	}

	updateWCAGCompliance(data) {
		// This would need actual WCAG rule mapping
		// For now, we'll use a simplified approach
		const { violations = [] } = data;

		for (const violation of violations) {
			const tags = violation.tags || [];

			if (tags.includes('wcag2a')) {
				this.results.wcagCompliance.A.total++;
				if (!violation.nodes?.length) {
					this.results.wcagCompliance.A.passed++;
				}
			}

			if (tags.includes('wcag2aa')) {
				this.results.wcagCompliance.AA.total++;
				if (!violation.nodes?.length) {
					this.results.wcagCompliance.AA.passed++;
				}
			}

			if (tags.includes('wcag2aaa')) {
				this.results.wcagCompliance.AAA.total++;
				if (!violation.nodes?.length) {
					this.results.wcagCompliance.AAA.passed++;
				}
			}
		}
	}

	analyzeCompliance() {
		const { standard } = this.options;
		const { wcagCompliance, violationsByType } = this.results;

		const targetLevel = wcagCompliance[standard];
		const complianceRate =
			targetLevel.total > 0 ? (targetLevel.passed / targetLevel.total) * 100 : 100;

		const criticalIssues = this.failOnTypes.reduce((sum, type) => {
			return sum + (violationsByType[type] || 0);
		}, 0);

		return {
			complianceRate,
			targetLevel,
			criticalIssues,
			worstComponents: Array.from(this.results.componentScores.values())
				.sort((a, b) => b.violations - a.violations)
				.slice(0, 5),
		};
	}

	determineCompliance(analysis) {
		const { criticalIssues } = analysis;

		// Fail if critical violations exceed threshold
		if (criticalIssues > this.maxViolations) {
			return false;
		}

		// Fail if WCAG compliance is too low
		const minComplianceRate =
			this.options.standard === 'AAA' ? 95 : this.options.standard === 'AA' ? 85 : 75;

		if (analysis.complianceRate < minComplianceRate) {
			return false;
		}

		return true;
	}

	outputText(analysis, isCompliant) {
		const { results } = this;
		const status = isCompliant ? '✅ PASS' : '❌ FAIL';
		const statusColor = isCompliant ? '\x1b[32m' : '\x1b[31m';
		const resetColor = '\x1b[0m';

		console.log(`\n${statusColor}${status}${resetColor}`);
		console.log(`\nAccessibility Compliance Report`);
		console.log(`==============================`);
		console.log(`Standard: WCAG 2.1 Level ${this.options.standard}`);
		console.log(`Total Tests: ${results.totalTests}`);
		console.log(`Total Violations: ${results.totalViolations}`);
		console.log(`Compliance Rate: ${analysis.complianceRate.toFixed(1)}%`);

		console.log(`\nViolations by Severity:`);
		console.log(`  Critical: ${results.violationsByType.critical} 🚨`);
		console.log(`  Serious:  ${results.violationsByType.serious} ⚠️`);
		console.log(`  Moderate: ${results.violationsByType.moderate} ℹ️`);
		console.log(`  Minor:    ${results.violationsByType.minor} 💡`);

		if (analysis.worstComponents.length > 0) {
			console.log(`\nComponents with Most Issues:`);
			analysis.worstComponents.forEach((comp, i) => {
				console.log(`  ${i + 1}. ${comp.name}: ${comp.violations} violations`);
			});
		}

		if (!isCompliant) {
			console.log(`\n❌ Compliance check failed:`);
			if (analysis.criticalIssues > this.maxViolations) {
				console.log(
					`  - ${analysis.criticalIssues} critical violations found (max allowed: ${this.maxViolations})`
				);
			}
			if (analysis.complianceRate < 85) {
				console.log(
					`  - WCAG compliance rate ${analysis.complianceRate.toFixed(1)}% below minimum`
				);
			}
		}

		if (this.options.verbose && results.violations.length > 0) {
			console.log(`\nTop 10 Violations:`);
			results.violations.slice(0, 10).forEach((v, i) => {
				console.log(`  ${i + 1}. [${v.impact.toUpperCase()}] ${v.description}`);
				if (v.component !== 'unknown') {
					console.log(`     Component: ${v.component}`);
				}
			});
		}
	}

	outputJSON(analysis, isCompliant) {
		const report = {
			status: isCompliant ? 'pass' : 'fail',
			timestamp: new Date().toISOString(),
			standard: this.options.standard,
			summary: {
				totalTests: this.results.totalTests,
				totalViolations: this.results.totalViolations,
				complianceRate: analysis.complianceRate,
				criticalIssues: analysis.criticalIssues,
			},
			violations: this.results.violationsByType,
			wcagCompliance: this.results.wcagCompliance,
			components: Array.from(this.results.componentScores.values()),
			details: this.options.verbose ? this.results.violations : undefined,
		};

		console.log(JSON.stringify(report, null, 2));
	}
}

// Main execution
async function main() {
	try {
		const checker = new ComplianceChecker(options);
		await checker.checkCompliance();
	} catch (error) {
		console.error('❌ Compliance check failed:', error.message);
		if (options.verbose) {
			console.error(error.stack);
		}
		process.exit(1);
	}
}

const isMainModule =
	process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
	main();
}

export { ComplianceChecker };
