#!/usr/bin/env node

/**
 * Generate Comprehensive Accessibility Report
 * Combines all test results into a single comprehensive report
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
	.option('--input <path>', 'Input directory with test artifacts', 'test-artifacts')
	.option('--output <path>', 'Output path for the report', 'comprehensive-report.html')
	.option('--format <format>', 'Output format (html, json, markdown)', 'html')
	.option('--include-recommendations', 'Include actionable recommendations', true)
	.option('--include-details', 'Include detailed test results', false);

program.parse();

const options = program.opts();

class ComprehensiveReportGenerator {
	constructor(options) {
		this.options = options;
		this.aggregatedResults = {
			axe: [],
			contrast: [],
			keyboard: [],
			focus: [],
			visual: [],
			components: new Set(),
			themes: new Set(),
			densities: new Set(),
		};
	}

	async generateReport() {
		console.log('🔄 Aggregating test results from all configurations...');
		await this.aggregateResults();

		console.log('📊 Analyzing comprehensive data...');
		const analysis = this.performComprehensiveAnalysis();

		console.log('📝 Generating comprehensive report...');
		const report = this.createComprehensiveReport(analysis);

		console.log('💾 Saving comprehensive report...');
		await this.saveReport(report);

		console.log(`✅ Comprehensive report generated: ${this.options.output}`);
	}

	async aggregateResults() {
		const inputDir = this.options.input;

		if (!fs.existsSync(inputDir)) {
			console.warn(`⚠️  Input directory not found: ${inputDir}`);
			return;
		}

		// Process all artifact directories
		const artifacts = fs
			.readdirSync(inputDir, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);

		for (const artifact of artifacts) {
			const artifactPath = path.join(inputDir, artifact);
			await this.processArtifactDirectory(artifactPath, artifact);
		}
	}

	async processArtifactDirectory(artifactPath, artifactName) {
		// Extract theme and density from artifact name
		const match = artifactName.match(/(\w+)-(\w+)$/);
		if (match) {
			this.aggregatedResults.themes.add(match[1]);
			this.aggregatedResults.densities.add(match[2]);
		}

		// Process all JSON files in the artifact directory
		const files = this.getJSONFiles(artifactPath);

		for (const file of files) {
			try {
				const data = JSON.parse(fs.readFileSync(file, 'utf8'));
				this.categorizeAndAggregateResults(data, path.basename(file), artifactName);
			} catch (error) {
				console.warn(`⚠️  Failed to parse ${file}:`, error.message);
			}
		}
	}

	getJSONFiles(dir) {
		const files = [];

		if (!fs.existsSync(dir)) return files;

		const scan = (directory) => {
			try {
				const entries = fs.readdirSync(directory, { withFileTypes: true });

				for (const entry of entries) {
					const fullPath = path.join(directory, entry.name);

					if (entry.isDirectory()) {
						scan(fullPath);
					} else if (entry.isFile() && entry.name.endsWith('.json')) {
						files.push(fullPath);
					}
				}
			} catch (error) {
				// Skip directories we can't read
			}
		};

		scan(dir);
		return files;
	}

	categorizeAndAggregateResults(data, filename, artifactName) {
		// Handle different result formats
		if (data.tests && Array.isArray(data.tests)) {
			// Playwright test results
			this.processPlaywrightResults(data, artifactName);
		} else if (data.violations && Array.isArray(data.violations)) {
			// Axe results
			this.aggregatedResults.axe.push({
				...data,
				source: artifactName,
				filename,
			});
		} else if (Array.isArray(data)) {
			// Array of results
			data.forEach((result) => {
				this.categorizeResult(result, artifactName, filename);
			});
		} else {
			// Single result
			this.categorizeResult(data, artifactName, filename);
		}
	}

	processPlaywrightResults(data, artifactName) {
		for (const suite of data.suites || []) {
			this.processPlaywrightSuite(suite, artifactName);
		}
	}

	processPlaywrightSuite(suite, artifactName) {
		for (const spec of suite.specs || []) {
			const component = this.extractComponentFromSpec(spec);
			if (component) {
				this.aggregatedResults.components.add(component);
			}

			// Process test results
			for (const test of spec.tests || []) {
				for (const result of test.results || []) {
					if (result.status === 'failed') {
						this.processTestFailure(result, spec.title, artifactName);
					}
				}
			}
		}
	}

	categorizeResult(result, artifactName, filename) {
		const basename = path.basename(filename, '.json');

		if (basename.includes('axe') || basename.includes('a11y')) {
			this.aggregatedResults.axe.push({ ...result, source: artifactName });
		} else if (basename.includes('contrast')) {
			this.aggregatedResults.contrast.push({ ...result, source: artifactName });
		} else if (basename.includes('keyboard')) {
			this.aggregatedResults.keyboard.push({ ...result, source: artifactName });
		} else if (basename.includes('focus')) {
			this.aggregatedResults.focus.push({ ...result, source: artifactName });
		} else if (basename.includes('visual')) {
			this.aggregatedResults.visual.push({ ...result, source: artifactName });
		}
	}

	processTestFailure(result, testTitle, artifactName) {
		const component = this.extractComponentFromTitle(testTitle);
		if (component) {
			this.aggregatedResults.components.add(component);
		}

		// Categorize based on test type
		if (testTitle.includes('axe') || testTitle.includes('accessibility')) {
			this.aggregatedResults.axe.push({
				testTitle,
				error: result.error?.message,
				source: artifactName,
				status: 'failed',
			});
		} else if (testTitle.includes('keyboard')) {
			this.aggregatedResults.keyboard.push({
				testTitle,
				error: result.error?.message,
				source: artifactName,
				passed: false,
			});
		} else if (testTitle.includes('focus')) {
			this.aggregatedResults.focus.push({
				testTitle,
				error: result.error?.message,
				source: artifactName,
				passed: false,
			});
		}
	}

	extractComponentFromSpec(spec) {
		const match = spec.title?.match(/^(\w+)/);
		return match ? match[1].toLowerCase() : null;
	}

	extractComponentFromTitle(title) {
		const match = title.match(/^(\w+)/);
		return match ? match[1].toLowerCase() : 'unknown';
	}

	performComprehensiveAnalysis() {
		const analysis = {
			overview: {
				totalComponents: this.aggregatedResults.components.size,
				totalThemes: this.aggregatedResults.themes.size,
				totalDensities: this.aggregatedResults.densities.size,
				totalTests: 0,
				totalViolations: 0,
				overallScore: 0,
			},
			componentAnalysis: this.analyzeByComponent(),
			themeAnalysis: this.analyzeByTheme(),
			densityAnalysis: this.analyzeByDensity(),
			violationAnalysis: this.analyzeViolations(),
			trends: this.analyzeTrends(),
			recommendations: [],
			priorityActions: [],
		};

		// Calculate overall metrics
		analysis.overview.totalTests =
			this.aggregatedResults.axe.length +
			this.aggregatedResults.contrast.length +
			this.aggregatedResults.keyboard.length +
			this.aggregatedResults.focus.length +
			this.aggregatedResults.visual.length;

		// Generate comprehensive recommendations
		analysis.recommendations = this.generateComprehensiveRecommendations(analysis);
		analysis.priorityActions = this.generatePriorityActions(analysis);

		// Calculate overall score
		analysis.overview.overallScore = this.calculateOverallScore(analysis);

		return analysis;
	}

	analyzeByComponent() {
		const componentAnalysis = new Map();

		Array.from(this.aggregatedResults.components).forEach((component) => {
			componentAnalysis.set(component, {
				name: component,
				tests: 0,
				violations: 0,
				scores: {
					axe: 100,
					contrast: 100,
					keyboard: 100,
					focus: 100,
					visual: 100,
				},
				issues: [],
				recommendations: [],
			});
		});

		// Analyze axe results by component
		this.aggregatedResults.axe.forEach((result) => {
			if (result.violations) {
				result.violations.forEach((violation) => {
					const component = this.extractComponentFromViolation(violation);
					if (componentAnalysis.has(component)) {
						const analysis = componentAnalysis.get(component);
						analysis.violations++;
						analysis.tests++;
						analysis.issues.push({
							type: 'axe',
							severity: violation.impact,
							description: violation.description,
						});
					}
				});
			}
		});

		// Analyze other test types
		['contrast', 'keyboard', 'focus'].forEach((testType) => {
			this.aggregatedResults[testType].forEach((result) => {
				const component = result.component || this.extractComponentFromTitle(result.testTitle);
				if (componentAnalysis.has(component)) {
					const analysis = componentAnalysis.get(component);
					analysis.tests++;

					if (result.passed === false || result.error) {
						analysis.violations++;
						analysis.issues.push({
							type: testType,
							severity: testType === 'keyboard' ? 'serious' : 'moderate',
							description: result.error || `${testType} test failed`,
						});
					}
				}
			});
		});

		// Calculate component scores
		componentAnalysis.forEach((analysis) => {
			const passRate =
				analysis.tests > 0 ? ((analysis.tests - analysis.violations) / analysis.tests) * 100 : 100;

			// Adjust score based on violation severity
			analysis.scores.overall = Math.max(0, passRate - analysis.violations * 5);

			// Generate component-specific recommendations
			analysis.recommendations = this.generateComponentRecommendations(analysis);
		});

		return Array.from(componentAnalysis.values());
	}

	analyzeByTheme() {
		const themeAnalysis = new Map();

		Array.from(this.aggregatedResults.themes).forEach((theme) => {
			themeAnalysis.set(theme, {
				name: theme,
				tests: 0,
				violations: 0,
				contrastIssues: 0,
				components: new Set(),
			});
		});

		// Count violations by theme based on source
		['axe', 'contrast', 'keyboard', 'focus'].forEach((testType) => {
			this.aggregatedResults[testType].forEach((result) => {
				const theme = this.extractThemeFromSource(result.source);
				if (theme && themeAnalysis.has(theme)) {
					const analysis = themeAnalysis.get(theme);
					analysis.tests++;

					if (result.violations?.length > 0 || result.passed === false) {
						analysis.violations++;
					}

					if (testType === 'contrast' && !result.passesAA) {
						analysis.contrastIssues++;
					}
				}
			});
		});

		return Array.from(themeAnalysis.values());
	}

	analyzeByDensity() {
		const densityAnalysis = new Map();

		Array.from(this.aggregatedResults.densities).forEach((density) => {
			densityAnalysis.set(density, {
				name: density,
				tests: 0,
				violations: 0,
				keyboardIssues: 0,
				focusIssues: 0,
			});
		});

		// Count violations by density
		['axe', 'keyboard', 'focus'].forEach((testType) => {
			this.aggregatedResults[testType].forEach((result) => {
				const density = this.extractDensityFromSource(result.source);
				if (density && densityAnalysis.has(density)) {
					const analysis = densityAnalysis.get(density);
					analysis.tests++;

					if (result.violations?.length > 0 || result.passed === false) {
						analysis.violations++;

						if (testType === 'keyboard') {
							analysis.keyboardIssues++;
						} else if (testType === 'focus') {
							analysis.focusIssues++;
						}
					}
				}
			});
		});

		return Array.from(densityAnalysis.values());
	}

	analyzeViolations() {
		const violationAnalysis = {
			bySeverity: {
				critical: 0,
				serious: 0,
				moderate: 0,
				minor: 0,
			},
			byType: new Map(),
			topViolations: [],
			trends: [],
		};

		// Analyze axe violations
		this.aggregatedResults.axe.forEach((result) => {
			if (result.violations) {
				result.violations.forEach((violation) => {
					const severity = violation.impact || 'moderate';
					violationAnalysis.bySeverity[severity]++;

					const type = violation.id || 'unknown';
					if (!violationAnalysis.byType.has(type)) {
						violationAnalysis.byType.set(type, {
							id: type,
							count: 0,
							description: violation.description,
							help: violation.help,
						});
					}
					violationAnalysis.byType.get(type).count++;
				});
			}
		});

		// Get top violations
		violationAnalysis.topViolations = Array.from(violationAnalysis.byType.values())
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		return violationAnalysis;
	}

	analyzeTrends() {
		// This would analyze trends over time if we had historical data
		// For now, return current state analysis
		return {
			improving: [],
			worsening: [],
			stable: Array.from(this.aggregatedResults.components),
		};
	}

	extractComponentFromViolation(violation) {
		if (violation.component) return violation.component;

		if (violation.nodes?.[0]?.target?.[0]) {
			const target = violation.nodes[0].target[0];
			const match = target.match(/\[data-component="([^"]+)"\]/);
			if (match) return match[1];
		}

		return 'unknown';
	}

	extractThemeFromSource(source) {
		const match = source?.match(/(\w+)-\w+$/);
		return match ? match[1] : null;
	}

	extractDensityFromSource(source) {
		const match = source?.match(/\w+-(\w+)$/);
		return match ? match[1] : null;
	}

	generateComprehensiveRecommendations(analysis) {
		const recommendations = [];

		// High-level recommendations
		const totalViolations =
			analysis.violationAnalysis.bySeverity.critical +
			analysis.violationAnalysis.bySeverity.serious;

		if (totalViolations > 0) {
			recommendations.push({
				priority: 'high',
				category: 'critical',
				title: 'Address Critical Accessibility Issues',
				description: `${totalViolations} critical/serious violations require immediate attention`,
				action: 'Review and fix all critical and serious accessibility violations',
				impact: 'Ensures basic accessibility compliance for all users',
			});
		}

		// Component-specific recommendations
		const worstComponents = analysis.componentAnalysis
			.sort((a, b) => b.violations - a.violations)
			.slice(0, 3);

		worstComponents.forEach((component) => {
			if (component.violations > 0) {
				recommendations.push({
					priority: 'medium',
					category: 'component',
					title: `Improve ${component.name} Component Accessibility`,
					description: `${component.violations} violations found in ${component.name}`,
					action: `Focus accessibility testing and fixes on ${component.name} component`,
					impact: 'Improves accessibility for commonly used component',
				});
			}
		});

		// Theme-specific recommendations
		const themeIssues = analysis.themeAnalysis.filter((theme) => theme.contrastIssues > 0);
		if (themeIssues.length > 0) {
			recommendations.push({
				priority: 'medium',
				category: 'design',
				title: 'Improve Color Contrast Across Themes',
				description: `Color contrast issues found in ${themeIssues.map((t) => t.name).join(', ')} themes`,
				action: 'Review and adjust color contrast ratios to meet WCAG AA standards',
				impact: 'Ensures content is readable for users with visual impairments',
			});
		}

		return recommendations;
	}

	generatePriorityActions(analysis) {
		const actions = [];

		// Critical violations
		const criticalViolations = analysis.violationAnalysis.bySeverity.critical;
		if (criticalViolations > 0) {
			actions.push({
				priority: 1,
				action: 'Fix all critical accessibility violations',
				timeframe: 'immediate',
				effort: 'high',
				impact: 'high',
			});
		}

		// Top violation types
		const topViolation = analysis.violationAnalysis.topViolations[0];
		if (topViolation) {
			actions.push({
				priority: 2,
				action: `Address ${topViolation.id} violations (${topViolation.count} instances)`,
				timeframe: 'this sprint',
				effort: 'medium',
				impact: 'high',
			});
		}

		// Component focus
		const worstComponent = analysis.componentAnalysis.sort(
			(a, b) => b.violations - a.violations
		)[0];

		if (worstComponent && worstComponent.violations > 0) {
			actions.push({
				priority: 3,
				action: `Comprehensive accessibility review of ${worstComponent.name} component`,
				timeframe: 'next sprint',
				effort: 'medium',
				impact: 'medium',
			});
		}

		return actions;
	}

	generateComponentRecommendations(analysis) {
		const recommendations = [];

		if (analysis.issues.length === 0) {
			return ['✅ No accessibility issues found'];
		}

		// Group issues by type
		const issuesByType = analysis.issues.reduce((acc, issue) => {
			if (!acc[issue.type]) acc[issue.type] = [];
			acc[issue.type].push(issue);
			return acc;
		}, {});

		Object.entries(issuesByType).forEach(([type, issues]) => {
			switch (type) {
				case 'axe':
					recommendations.push(`🔧 Fix ${issues.length} axe violations`);
					break;
				case 'keyboard':
					recommendations.push(`⌨️  Improve keyboard navigation (${issues.length} issues)`);
					break;
				case 'focus':
					recommendations.push(`🎯 Fix focus management (${issues.length} issues)`);
					break;
				case 'contrast':
					recommendations.push(`🎨 Improve color contrast (${issues.length} issues)`);
					break;
			}
		});

		return recommendations;
	}

	calculateOverallScore(analysis) {
		const componentScores = analysis.componentAnalysis.map((c) => c.scores?.overall || 0);
		if (componentScores.length === 0) return 100;

		const average = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;

		// Penalize for critical violations
		const criticalPenalty = analysis.violationAnalysis.bySeverity.critical * 5;
		const seriousPenalty = analysis.violationAnalysis.bySeverity.serious * 3;

		return Math.max(0, Math.round(average - criticalPenalty - seriousPenalty));
	}

	createComprehensiveReport(analysis) {
		const { format } = this.options;

		switch (format) {
			case 'json':
				return this.createJSONReport(analysis);
			case 'markdown':
				return this.createMarkdownReport(analysis);
			case 'html':
			default:
				return this.createHTMLReport(analysis);
		}
	}

	createJSONReport(analysis) {
		return JSON.stringify(
			{
				timestamp: new Date().toISOString(),
				summary: analysis.overview,
				componentScores: analysis.componentAnalysis,
				axeResults: this.aggregatedResults.axe.slice(0, 100), // Limit size
				contrastResults: this.aggregatedResults.contrast.slice(0, 100),
				wcagResults: { summary: { passed: 0, total: 0 } }, // Placeholder
				screenReaderResults: [], // Placeholder
				recommendations: analysis.recommendations.map((r) => r.title),
			},
			null,
			2
		);
	}

	createMarkdownReport(analysis) {
		let md = `# Comprehensive Accessibility Report\n\n`;
		md += `**Generated:** ${new Date().toISOString()}\n`;
		md += `**Overall Score:** ${analysis.overview.overallScore}%\n\n`;

		md += `## Executive Summary\n\n`;
		md += `- **Components Tested:** ${analysis.overview.totalComponents}\n`;
		md += `- **Theme Variations:** ${analysis.overview.totalThemes}\n`;
		md += `- **Density Variations:** ${analysis.overview.totalDensities}\n`;
		md += `- **Total Tests:** ${analysis.overview.totalTests}\n`;
		md += `- **Critical Violations:** ${analysis.violationAnalysis.bySeverity.critical}\n`;
		md += `- **Serious Violations:** ${analysis.violationAnalysis.bySeverity.serious}\n\n`;

		if (analysis.priorityActions.length > 0) {
			md += `## Priority Actions\n\n`;
			analysis.priorityActions.forEach((action, i) => {
				md += `${i + 1}. **${action.action}** (${action.timeframe})\n`;
			});
			md += `\n`;
		}

		md += `## Component Analysis\n\n`;
		md += `| Component | Score | Tests | Violations | Status |\n`;
		md += `|-----------|-------|-------|------------|--------|\n`;

		analysis.componentAnalysis
			.sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0))
			.forEach((component) => {
				const score = component.scores?.overall || 0;
				const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
				md += `| ${component.name} | ${score}% | ${component.tests} | ${component.violations} | ${status} |\n`;
			});

		return md;
	}

	createHTMLReport(analysis) {
		const overallStatus = analysis.overview.overallScore >= 85 ? 'PASS' : 'NEEDS IMPROVEMENT';
		const statusClass = overallStatus === 'PASS' ? 'status-pass' : 'status-fail';

		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Accessibility Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; color: #333; background: #f5f5f5;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        .header { 
            background: white; padding: 3rem; border-radius: 12px; 
            margin-bottom: 2rem; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .status-pass { color: #059669; }
        .status-fail { color: #dc2626; }
        .score-circle {
            width: 120px; height: 120px; border-radius: 50%;
            display: inline-flex; align-items: center; justify-content: center;
            font-size: 2rem; font-weight: bold; color: white;
            background: conic-gradient(#059669 0% ${analysis.overview.overallScore}%, #e5e7eb ${analysis.overview.overallScore}% 100%);
            margin-bottom: 1rem;
        }
        .summary-grid { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 1.5rem; margin: 2rem 0;
        }
        .summary-card { 
            background: white; padding: 2rem; border-radius: 12px; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;
        }
        .summary-number { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
        .section { 
            background: white; padding: 2rem; border-radius: 12px; 
            margin-bottom: 2rem; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .component-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 1.5rem; margin-top: 1.5rem;
        }
        .component-card {
            background: #f9fafb; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #e5e7eb;
        }
        .component-card.excellent { border-color: #059669; }
        .component-card.good { border-color: #3b82f6; }
        .component-card.needs-work { border-color: #f59e0b; }
        .component-card.poor { border-color: #dc2626; }
        .priority-actions { margin: 2rem 0; }
        .priority-action {
            background: #fef3c7; padding: 1rem; margin: 0.5rem 0; 
            border-radius: 6px; border-left: 4px solid #f59e0b;
        }
        .recommendations ul { margin-left: 1.5rem; }
        .recommendations li { margin: 0.5rem 0; }
        h1, h2, h3 { margin-bottom: 1rem; }
        h1 { color: #1f2937; font-size: 2.5rem; }
        h2 { color: #374151; border-bottom: 3px solid #e5e7eb; padding-bottom: 0.5rem; }
        .timestamp { color: #666; font-style: italic; }
        .chart { height: 300px; margin: 1rem 0; background: #f9fafb; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="score-circle">${analysis.overview.overallScore}%</div>
            <h1>Comprehensive Accessibility Report</h1>
            <p class="timestamp">Generated: ${new Date().toISOString()}</p>
            <p><strong>Overall Status:</strong> <span class="${statusClass}">${overallStatus}</span></p>
        </div>

        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-number">${analysis.overview.totalComponents}</div>
                <div>Components Tested</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${analysis.overview.totalThemes}</div>
                <div>Theme Variations</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${analysis.overview.totalDensities}</div>
                <div>Density Variations</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${analysis.overview.totalTests}</div>
                <div>Total Tests</div>
            </div>
        </div>

        ${
					analysis.priorityActions.length > 0
						? `
        <div class="section">
            <h2>Priority Actions</h2>
            <div class="priority-actions">
                ${analysis.priorityActions
									.map(
										(action) => `
                    <div class="priority-action">
                        <strong>Priority ${action.priority}:</strong> ${action.action}
                        <div style="font-size: 0.9em; color: #666; margin-top: 0.5rem;">
                            Timeframe: ${action.timeframe} | Effort: ${action.effort} | Impact: ${action.impact}
                        </div>
                    </div>
                `
									)
									.join('')}
            </div>
        </div>
        `
						: ''
				}

        <div class="section">
            <h2>Component Analysis</h2>
            <div class="component-grid">
                ${analysis.componentAnalysis
									.sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0))
									.map((component) => {
										const score = component.scores?.overall || 0;
										const scoreClass =
											score >= 90
												? 'excellent'
												: score >= 70
													? 'good'
													: score >= 50
														? 'needs-work'
														: 'poor';

										return `
                        <div class="component-card ${scoreClass}">
                            <h3>${component.name}</h3>
                            <div style="font-size: 1.5rem; font-weight: bold; color: ${
															score >= 90
																? '#059669'
																: score >= 70
																	? '#3b82f6'
																	: score >= 50
																		? '#f59e0b'
																		: '#dc2626'
														};">${score}%</div>
                            <div>Tests: ${component.tests} | Violations: ${component.violations}</div>
                            ${
															component.recommendations.length > 0
																? `
                                <div style="margin-top: 1rem;">
                                    <strong>Recommendations:</strong>
                                    <ul style="margin: 0.5rem 0; padding-left: 1rem;">
                                        ${component.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
                                    </ul>
                                </div>
                            `
																: ''
														}
                        </div>
                    `;
									})
									.join('')}
            </div>
        </div>

        <div class="section">
            <h2>Violations by Severity</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="summary-number" style="color: #dc2626;">${analysis.violationAnalysis.bySeverity.critical}</div>
                    <div>Critical</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number" style="color: #f59e0b;">${analysis.violationAnalysis.bySeverity.serious}</div>
                    <div>Serious</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number" style="color: #3b82f6;">${analysis.violationAnalysis.bySeverity.moderate}</div>
                    <div>Moderate</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number" style="color: #10b981;">${analysis.violationAnalysis.bySeverity.minor}</div>
                    <div>Minor</div>
                </div>
            </div>
        </div>

        ${
					analysis.recommendations.length > 0
						? `
        <div class="section recommendations">
            <h2>Comprehensive Recommendations</h2>
            ${analysis.recommendations
							.map(
								(rec) => `
                <div style="background: #f0f9ff; padding: 1.5rem; margin: 1rem 0; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <h3>${rec.title}</h3>
                    <p><strong>Priority:</strong> ${rec.priority} | <strong>Category:</strong> ${rec.category}</p>
                    <p>${rec.description}</p>
                    <p><strong>Action:</strong> ${rec.action}</p>
                    <p><strong>Impact:</strong> ${rec.impact}</p>
                </div>
            `
							)
							.join('')}
        </div>
        `
						: ''
				}

        <div class="section">
            <h2>Testing Coverage</h2>
            <p>This comprehensive report analyzed:</p>
            <ul style="margin: 1rem 0; padding-left: 2rem;">
                <li><strong>Themes:</strong> ${Array.from(this.aggregatedResults.themes).join(', ')}</li>
                <li><strong>Densities:</strong> ${Array.from(this.aggregatedResults.densities).join(', ')}</li>
                <li><strong>Components:</strong> ${Array.from(this.aggregatedResults.components).join(', ')}</li>
                <li><strong>Test Types:</strong> Axe violations, Color contrast, Keyboard navigation, Focus management, Visual regression</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `.trim();
	}

	async saveReport(report) {
		const outputPath = this.options.output;
		const outputDir = path.dirname(outputPath);

		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		fs.writeFileSync(outputPath, report, 'utf8');
	}
}

// Main execution
async function main() {
	try {
		const generator = new ComprehensiveReportGenerator(options);
		await generator.generateReport();
		process.exit(0);
	} catch (error) {
		console.error('❌ Failed to generate comprehensive report:', error);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}

module.exports = { ComprehensiveReportGenerator };
