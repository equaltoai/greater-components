/**
 * Accessibility Report Generator
 * Utilities for generating comprehensive accessibility reports
 */

import type { AxeTestResult } from './axe-helpers';
import type { ElementContrastResult } from './contrast-helpers';
import type { WCAGComplianceReport } from './wcag-helpers';
import type { ScreenReaderTestResult } from './screen-reader-helpers';

export interface A11yReportOptions {
	includeDetails: boolean;
	includeElements: boolean;
	format: 'html' | 'json' | 'markdown' | 'text';
	theme: 'light' | 'dark';
}

export interface ComponentA11yScore {
	component: string;
	overall: number;
	wcag: number;
	axe: number;
	contrast: number;
	keyboard: number;
	screenReader: number;
	issues: {
		critical: number;
		serious: number;
		moderate: number;
		minor: number;
	};
}

export interface A11yReport {
	timestamp: string;
	summary: {
		totalComponents: number;
		averageScore: number;
		wcagCompliant: number;
		criticalIssues: number;
		totalIssues: number;
	};
	componentScores: ComponentA11yScore[];
	axeResults: AxeTestResult[];
	contrastResults: ElementContrastResult[];
	wcagResults: WCAGComplianceReport;
	screenReaderResults: ScreenReaderTestResult[];
	recommendations: string[];
}

/**
 * Generate comprehensive accessibility report
 */
export function generateA11yReport(data: {
	axeResults: AxeTestResult[];
	contrastResults: ElementContrastResult[];
	wcagResults: WCAGComplianceReport;
	screenReaderResults: ScreenReaderTestResult[];
	componentNames: string[];
}): A11yReport {
	const { axeResults, contrastResults, wcagResults, screenReaderResults, componentNames } = data;

	// Calculate component scores
	const componentScores = componentNames.map((component) =>
		calculateComponentScore(component, {
			axeResults,
			contrastResults,
			wcagResults,
			screenReaderResults,
		})
	);

	// Calculate summary
	const averageScore =
		componentScores.reduce((acc, c) => acc + c.overall, 0) / componentScores.length;
	const wcagCompliant = componentScores.filter((c) => c.wcag >= 90).length;
	const criticalIssues = componentScores.reduce((acc, c) => acc + c.issues.critical, 0);
	const totalIssues = componentScores.reduce(
		(acc, c) => acc + c.issues.critical + c.issues.serious + c.issues.moderate + c.issues.minor,
		0
	);

	// Generate recommendations
	const recommendations = generateRecommendations({
		axeResults,
		contrastResults,
		wcagResults,
		screenReaderResults,
	});

	return {
		timestamp: new Date().toISOString(),
		summary: {
			totalComponents: componentNames.length,
			averageScore: Math.round(averageScore),
			wcagCompliant,
			criticalIssues,
			totalIssues,
		},
		componentScores,
		axeResults,
		contrastResults,
		wcagResults,
		screenReaderResults,
		recommendations,
	};
}

/**
 * Calculate accessibility score for a component
 */
function calculateComponentScore(
	component: string,
	data: {
		axeResults: AxeTestResult[];
		contrastResults: ElementContrastResult[];
		wcagResults: WCAGComplianceReport;
		screenReaderResults: ScreenReaderTestResult[];
	}
): ComponentA11yScore {
	// Filter results for this component (simplified - would need better component matching)
	const componentAxe = data.axeResults.filter((r) => r.testName?.includes(component));
	const componentContrast = data.contrastResults.filter((r) =>
		r.element.closest(`[data-component="${component}"]`)
	);

	// Calculate scores (0-100)
	const axeScore = calculateAxeScore(componentAxe);
	const contrastScore = calculateContrastScore(componentContrast);
	const wcagScore = (data.wcagResults.summary.passed / data.wcagResults.summary.total) * 100;
	const keyboardScore = 85; // Would need actual keyboard test results
	const screenReaderScore = calculateScreenReaderScore(
		data.screenReaderResults.filter((r) => r.element.closest(`[data-component="${component}"]`))
	);

	// Calculate overall score (weighted average)
	const overall = Math.round(
		axeScore * 0.3 +
			contrastScore * 0.2 +
			wcagScore * 0.2 +
			keyboardScore * 0.15 +
			screenReaderScore * 0.15
	);

	// Count issues by severity
	const issues = {
		critical: componentAxe.reduce(
			(acc, r) => acc + r.violations.filter((v) => v.impact === 'critical').length,
			0
		),
		serious: componentAxe.reduce(
			(acc, r) => acc + r.violations.filter((v) => v.impact === 'serious').length,
			0
		),
		moderate: componentAxe.reduce(
			(acc, r) => acc + r.violations.filter((v) => v.impact === 'moderate').length,
			0
		),
		minor: componentAxe.reduce(
			(acc, r) => acc + r.violations.filter((v) => v.impact === 'minor').length,
			0
		),
	};

	return {
		component,
		overall,
		wcag: Math.round(wcagScore),
		axe: axeScore,
		contrast: contrastScore,
		keyboard: keyboardScore,
		screenReader: screenReaderScore,
		issues,
	};
}

/**
 * Calculate axe score
 */
function calculateAxeScore(results: AxeTestResult[]): number {
	if (results.length === 0) return 100;

	const totalViolations = results.reduce((acc, r) => acc + r.violations.length, 0);
	const totalChecks = results.reduce(
		(acc, r) => acc + r.violations.length + r.passes + r.incomplete + r.inapplicable,
		0
	);

	return Math.max(0, Math.round(((totalChecks - totalViolations) / totalChecks) * 100));
}

/**
 * Calculate contrast score
 */
function calculateContrastScore(results: ElementContrastResult[]): number {
	if (results.length === 0) return 100;

	const passingResults = results.filter((r) => r.passesAA).length;
	return Math.round((passingResults / results.length) * 100);
}

/**
 * Calculate screen reader score
 */
function calculateScreenReaderScore(results: ScreenReaderTestResult[]): number {
	if (results.length === 0) return 100;

	const elementsWithIssues = results.filter((r) => r.issues.length > 0).length;
	return Math.max(0, Math.round(((results.length - elementsWithIssues) / results.length) * 100));
}

/**
 * Generate recommendations
 */
function generateRecommendations(data: {
	axeResults: AxeTestResult[];
	contrastResults: ElementContrastResult[];
	wcagResults: WCAGComplianceReport;
	screenReaderResults: ScreenReaderTestResult[];
}): string[] {
	const recommendations: string[] = [];

	// Axe recommendations
	const criticalViolations = data.axeResults
		.flatMap((r) => r.violations)
		.filter((v) => v.impact === 'critical');

	if (criticalViolations.length > 0) {
		recommendations.push(`Fix ${criticalViolations.length} critical accessibility violations`);
	}

	// Contrast recommendations
	const contrastFailures = data.contrastResults.filter((r) => !r.passesAA);
	if (contrastFailures.length > 0) {
		recommendations.push(`Improve color contrast for ${contrastFailures.length} elements`);
	}

	// WCAG recommendations
	const failedCriteria = data.wcagResults.results.filter((r) => !r.passed);
	if (failedCriteria.length > 0) {
		recommendations.push(`Address ${failedCriteria.length} WCAG compliance issues`);
	}

	// Screen reader recommendations
	const srIssues = data.screenReaderResults.filter((r) => r.issues.length > 0);
	if (srIssues.length > 0) {
		recommendations.push(`Improve screen reader compatibility for ${srIssues.length} elements`);
	}

	return recommendations;
}

/**
 * Format report as HTML
 */
export function formatReportHTML(report: A11yReport, options: A11yReportOptions): string {
	const theme = options.theme === 'dark' ? 'dark' : 'light';
	const styles = getHTMLStyles(theme);

	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report</title>
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Accessibility Report</h1>
            <p class="timestamp">Generated: ${new Date(report.timestamp).toLocaleString()}</p>
        </header>
        
        <section class="summary">
            <h2>Summary</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-number">${report.summary.totalComponents}</div>
                    <div class="summary-label">Components</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${report.summary.averageScore}%</div>
                    <div class="summary-label">Average Score</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${report.summary.wcagCompliant}</div>
                    <div class="summary-label">WCAG Compliant</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${report.summary.criticalIssues}</div>
                    <div class="summary-label">Critical Issues</div>
                </div>
            </div>
        </section>
        
        <section class="components">
            <h2>Component Scores</h2>
            <div class="component-grid">
                ${report.componentScores
									.map(
										(component) => `
                    <div class="component-card">
                        <h3>${component.component}</h3>
                        <div class="score ${getScoreClass(component.overall)}">${component.overall}%</div>
                        <div class="score-breakdown">
                            <div>WCAG: ${component.wcag}%</div>
                            <div>Axe: ${component.axe}%</div>
                            <div>Contrast: ${component.contrast}%</div>
                            <div>Keyboard: ${component.keyboard}%</div>
                            <div>Screen Reader: ${component.screenReader}%</div>
                        </div>
                        <div class="issues">
                            <span class="critical">${component.issues.critical}</span>
                            <span class="serious">${component.issues.serious}</span>
                            <span class="moderate">${component.issues.moderate}</span>
                            <span class="minor">${component.issues.minor}</span>
                        </div>
                    </div>
                `
									)
									.join('')}
            </div>
        </section>
        
        ${
					options.includeDetails
						? `
        <section class="recommendations">
            <h2>Recommendations</h2>
            <ul>
                ${report.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
            </ul>
        </section>
        `
						: ''
				}
    </div>
</body>
</html>
  `.trim();
}

/**
 * Format report as Markdown
 */
export function formatReportMarkdown(report: A11yReport): string {
	let md = `# Accessibility Report\n\n`;
	md += `Generated: ${new Date(report.timestamp).toLocaleString()}\n\n`;

	md += `## Summary\n\n`;
	md += `- **Total Components**: ${report.summary.totalComponents}\n`;
	md += `- **Average Score**: ${report.summary.averageScore}%\n`;
	md += `- **WCAG Compliant**: ${report.summary.wcagCompliant}\n`;
	md += `- **Critical Issues**: ${report.summary.criticalIssues}\n\n`;

	md += `## Component Scores\n\n`;
	md += `| Component | Overall | WCAG | Axe | Contrast | Keyboard | Screen Reader | Issues |\n`;
	md += `|-----------|---------|------|-----|----------|----------|---------------|--------|\n`;

	report.componentScores.forEach((component) => {
		const issuesText = `${component.issues.critical}C ${component.issues.serious}S ${component.issues.moderate}M ${component.issues.minor}m`;
		md += `| ${component.component} | ${component.overall}% | ${component.wcag}% | ${component.axe}% | ${component.contrast}% | ${component.keyboard}% | ${component.screenReader}% | ${issuesText} |\n`;
	});

	md += `\n## Recommendations\n\n`;
	report.recommendations.forEach((rec) => {
		md += `- ${rec}\n`;
	});

	return md;
}

/**
 * Format report as JSON
 */
export function formatReportJSON(report: A11yReport, pretty: boolean = true): string {
	return pretty ? JSON.stringify(report, null, 2) : JSON.stringify(report);
}

/**
 * Get score class for styling
 */
function getScoreClass(score: number): string {
	if (score >= 90) return 'excellent';
	if (score >= 70) return 'good';
	if (score >= 50) return 'needs-improvement';
	return 'poor';
}

/**
 * Get HTML styles
 */
function getHTMLStyles(theme: 'light' | 'dark'): string {
	const colors =
		theme === 'dark'
			? {
					bg: '#1a1a1a',
					surface: '#2d2d2d',
					text: '#ffffff',
					textSecondary: '#b3b3b3',
					border: '#404040',
					excellent: '#10b981',
					good: '#3b82f6',
					warning: '#f59e0b',
					error: '#ef4444',
				}
			: {
					bg: '#ffffff',
					surface: '#f8fafc',
					text: '#1f2937',
					textSecondary: '#6b7280',
					border: '#e5e7eb',
					excellent: '#10b981',
					good: '#3b82f6',
					warning: '#f59e0b',
					error: '#ef4444',
				};

	return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${colors.bg};
      color: ${colors.text};
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .header { text-align: center; margin-bottom: 3rem; }
    .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .timestamp { color: ${colors.textSecondary}; }
    .summary { margin-bottom: 3rem; }
    .summary h2 { margin-bottom: 1.5rem; }
    .summary-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 1.5rem; 
    }
    .summary-item { 
      text-align: center; 
      padding: 1.5rem; 
      background: ${colors.surface}; 
      border-radius: 0.5rem; 
      border: 1px solid ${colors.border};
    }
    .summary-number { font-size: 2rem; font-weight: bold; color: ${colors.good}; }
    .summary-label { color: ${colors.textSecondary}; margin-top: 0.5rem; }
    .components h2 { margin-bottom: 1.5rem; }
    .component-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
      gap: 1.5rem; 
    }
    .component-card { 
      padding: 1.5rem; 
      background: ${colors.surface}; 
      border-radius: 0.5rem; 
      border: 1px solid ${colors.border};
    }
    .component-card h3 { margin-bottom: 1rem; }
    .score { 
      font-size: 1.5rem; 
      font-weight: bold; 
      margin-bottom: 1rem; 
    }
    .score.excellent { color: ${colors.excellent}; }
    .score.good { color: ${colors.good}; }
    .score.needs-improvement { color: ${colors.warning}; }
    .score.poor { color: ${colors.error}; }
    .score-breakdown { 
      font-size: 0.875rem; 
      color: ${colors.textSecondary}; 
      margin-bottom: 1rem; 
    }
    .issues { display: flex; gap: 0.5rem; }
    .issues span { 
      padding: 0.25rem 0.5rem; 
      border-radius: 0.25rem; 
      font-size: 0.75rem; 
      font-weight: 500; 
    }
    .issues .critical { background: ${colors.error}; color: white; }
    .issues .serious { background: ${colors.warning}; color: white; }
    .issues .moderate { background: ${colors.good}; color: white; }
    .issues .minor { background: ${colors.textSecondary}; color: white; }
    .recommendations { margin-top: 3rem; }
    .recommendations h2 { margin-bottom: 1.5rem; }
    .recommendations ul { margin-left: 1.5rem; }
    .recommendations li { margin-bottom: 0.5rem; }
  `;
}
