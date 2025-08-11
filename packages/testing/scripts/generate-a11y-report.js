#!/usr/bin/env node

/**
 * Generate Accessibility Report
 * Creates comprehensive accessibility reports from test results
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('--theme <theme>', 'Theme to generate report for', 'light')
  .option('--density <density>', 'Density to generate report for', 'comfortable')
  .option('--input <path>', 'Input directory with test results', 'test-results')
  .option('--output <path>', 'Output path for the report', 'reports/a11y-report.html')
  .option('--format <format>', 'Output format (html, json, markdown)', 'html')
  .option('--include-details', 'Include detailed test results', false)
  .option('--include-recommendations', 'Include recommendations', true);

program.parse();

const options = program.opts();

class A11yReportGenerator {
  constructor(options) {
    this.options = options;
    this.results = {
      axe: [],
      contrast: [],
      keyboard: [],
      focus: [],
      visual: [],
    };
  }

  async generateReport() {
    console.log('🔍 Collecting test results...');
    await this.collectResults();
    
    console.log('📊 Analyzing results...');
    const analysis = this.analyzeResults();
    
    console.log('📋 Generating report...');
    const report = this.createReport(analysis);
    
    console.log('💾 Saving report...');
    await this.saveReport(report);
    
    console.log(`✅ Report generated: ${this.options.output}`);
  }

  async collectResults() {
    const inputDir = this.options.input;
    
    if (!fs.existsSync(inputDir)) {
      console.warn(`⚠️  Input directory not found: ${inputDir}`);
      return;
    }

    const files = fs.readdirSync(inputDir, { recursive: true });
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(inputDir, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.categorizeResults(data, file);
      } catch (error) {
        console.warn(`⚠️  Failed to parse ${file}:`, error.message);
      }
    }
  }

  categorizeResults(data, filename) {
    const basename = path.basename(filename, '.json');
    
    if (basename.includes('a11y') || basename.includes('axe')) {
      this.results.axe.push(...(Array.isArray(data) ? data : [data]));
    } else if (basename.includes('contrast')) {
      this.results.contrast.push(...(Array.isArray(data) ? data : [data]));
    } else if (basename.includes('keyboard')) {
      this.results.keyboard.push(...(Array.isArray(data) ? data : [data]));
    } else if (basename.includes('focus')) {
      this.results.focus.push(...(Array.isArray(data) ? data : [data]));
    } else if (basename.includes('visual')) {
      this.results.visual.push(...(Array.isArray(data) ? data : [data]));
    }
  }

  analyzeResults() {
    const analysis = {
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        totalViolations: 0,
        criticalViolations: 0,
        seriousViolations: 0,
        moderateViolations: 0,
        minorViolations: 0,
      },
      components: new Map(),
      violations: [],
      recommendations: [],
      wcagCompliance: {
        A: { passed: 0, total: 0 },
        AA: { passed: 0, total: 0 },
        AAA: { passed: 0, total: 0 },
      },
    };

    // Analyze Axe results
    this.analyzeAxeResults(analysis);
    
    // Analyze contrast results
    this.analyzeContrastResults(analysis);
    
    // Analyze keyboard results
    this.analyzeKeyboardResults(analysis);
    
    // Analyze focus results
    this.analyzeFocusResults(analysis);
    
    // Generate recommendations
    this.generateRecommendations(analysis);
    
    return analysis;
  }

  analyzeAxeResults(analysis) {
    for (const result of this.results.axe) {
      if (!result.violations) continue;
      
      analysis.summary.totalTests++;
      
      const hasViolations = result.violations.length > 0;
      if (hasViolations) {
        analysis.summary.failedTests++;
      } else {
        analysis.summary.passedTests++;
      }
      
      for (const violation of result.violations) {
        analysis.summary.totalViolations++;
        
        switch (violation.impact) {
          case 'critical':
            analysis.summary.criticalViolations++;
            break;
          case 'serious':
            analysis.summary.seriousViolations++;
            break;
          case 'moderate':
            analysis.summary.moderateViolations++;
            break;
          case 'minor':
            analysis.summary.minorViolations++;
            break;
        }
        
        analysis.violations.push({
          type: 'axe',
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.length,
          component: this.extractComponentName(violation),
        });
        
        // Update WCAG compliance tracking
        this.updateWCAGCompliance(analysis.wcagCompliance, violation);
      }
    }
  }

  analyzeContrastResults(analysis) {
    for (const result of this.results.contrast) {
      if (!result.ratio) continue;
      
      analysis.summary.totalTests++;
      
      const passesAA = result.passesAA || result.ratio >= 4.5;
      if (passesAA) {
        analysis.summary.passedTests++;
      } else {
        analysis.summary.failedTests++;
        analysis.summary.moderateViolations++;
        
        analysis.violations.push({
          type: 'contrast',
          impact: 'moderate',
          description: `Color contrast ratio ${result.ratio.toFixed(2)} is below WCAG AA requirement`,
          component: result.element?.tagName || 'unknown',
          recommendation: `Increase contrast ratio to at least 4.5:1`,
        });
      }
    }
  }

  analyzeKeyboardResults(analysis) {
    for (const result of this.results.keyboard) {
      analysis.summary.totalTests++;
      
      const passed = result.passed !== false;
      if (passed) {
        analysis.summary.passedTests++;
      } else {
        analysis.summary.failedTests++;
        analysis.summary.seriousViolations++;
        
        analysis.violations.push({
          type: 'keyboard',
          impact: 'serious',
          description: result.error || 'Keyboard navigation failure',
          component: this.extractComponentName(result),
          recommendation: 'Ensure all interactive elements are keyboard accessible',
        });
      }
    }
  }

  analyzeFocusResults(analysis) {
    for (const result of this.results.focus) {
      analysis.summary.totalTests++;
      
      const passed = result.passed !== false;
      if (passed) {
        analysis.summary.passedTests++;
      } else {
        analysis.summary.failedTests++;
        analysis.summary.moderateViolations++;
        
        analysis.violations.push({
          type: 'focus',
          impact: 'moderate',
          description: result.error || 'Focus management issue',
          component: this.extractComponentName(result),
          recommendation: 'Implement proper focus management and visible indicators',
        });
      }
    }
  }

  extractComponentName(result) {
    // Try to extract component name from test data
    if (result.testName) return result.testName.split('-')[0];
    if (result.component) return result.component;
    if (result.nodes?.[0]?.target?.[0]) {
      const target = result.nodes[0].target[0];
      const match = target.match(/\[data-component="([^"]+)"\]/);
      if (match) return match[1];
    }
    return 'unknown';
  }

  updateWCAGCompliance(wcagCompliance, violation) {
    const tags = violation.tags || [];
    
    if (tags.includes('wcag2a')) {
      wcagCompliance.A.total++;
      if (!violation.nodes?.length) wcagCompliance.A.passed++;
    }
    
    if (tags.includes('wcag2aa')) {
      wcagCompliance.AA.total++;
      if (!violation.nodes?.length) wcagCompliance.AA.passed++;
    }
    
    if (tags.includes('wcag2aaa')) {
      wcagCompliance.AAA.total++;
      if (!violation.nodes?.length) wcagCompliance.AAA.passed++;
    }
  }

  generateRecommendations(analysis) {
    const { violations, summary } = analysis;
    
    // Priority recommendations based on violation counts
    if (summary.criticalViolations > 0) {
      analysis.recommendations.push(
        `🚨 Fix ${summary.criticalViolations} critical accessibility violations immediately`
      );
    }
    
    if (summary.seriousViolations > 0) {
      analysis.recommendations.push(
        `⚠️  Address ${summary.seriousViolations} serious accessibility issues`
      );
    }
    
    // Component-specific recommendations
    const componentIssues = new Map();
    violations.forEach(v => {
      if (!componentIssues.has(v.component)) {
        componentIssues.set(v.component, []);
      }
      componentIssues.get(v.component).push(v);
    });
    
    // Top problematic components
    const sortedComponents = Array.from(componentIssues.entries())
      .sort(([,a], [,b]) => b.length - a.length)
      .slice(0, 5);
    
    for (const [component, issues] of sortedComponents) {
      if (issues.length > 1) {
        analysis.recommendations.push(
          `🔧 Focus on ${component} component: ${issues.length} issues found`
        );
      }
    }
    
    // Generic recommendations
    if (summary.totalViolations > 0) {
      analysis.recommendations.push(
        '📚 Review WCAG 2.1 guidelines for comprehensive accessibility compliance'
      );
      analysis.recommendations.push(
        '🧪 Use automated accessibility testing in your development workflow'
      );
      analysis.recommendations.push(
        '👥 Conduct user testing with assistive technology users'
      );
    }
  }

  createReport(analysis) {
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
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      theme: this.options.theme,
      density: this.options.density,
      summary: analysis.summary,
      wcagCompliance: analysis.wcagCompliance,
      violations: analysis.violations,
      recommendations: analysis.recommendations,
      details: this.options.includeDetails ? this.results : undefined,
    }, null, 2);
  }

  createMarkdownReport(analysis) {
    const { summary, wcagCompliance, violations, recommendations } = analysis;
    
    let md = `# Accessibility Report\n\n`;
    md += `**Generated:** ${new Date().toISOString()}\n`;
    md += `**Theme:** ${this.options.theme}\n`;
    md += `**Density:** ${this.options.density}\n\n`;
    
    md += `## Summary\n\n`;
    md += `- **Total Tests:** ${summary.totalTests}\n`;
    md += `- **Passed:** ${summary.passedTests} ✅\n`;
    md += `- **Failed:** ${summary.failedTests} ❌\n`;
    md += `- **Total Violations:** ${summary.totalViolations}\n`;
    md += `  - Critical: ${summary.criticalViolations} 🚨\n`;
    md += `  - Serious: ${summary.seriousViolations} ⚠️\n`;
    md += `  - Moderate: ${summary.moderateViolations} ℹ️\n`;
    md += `  - Minor: ${summary.minorViolations} 💡\n\n`;
    
    md += `## WCAG 2.1 Compliance\n\n`;
    md += `- **Level A:** ${wcagCompliance.A.passed}/${wcagCompliance.A.total} (${((wcagCompliance.A.passed / Math.max(wcagCompliance.A.total, 1)) * 100).toFixed(1)}%)\n`;
    md += `- **Level AA:** ${wcagCompliance.AA.passed}/${wcagCompliance.AA.total} (${((wcagCompliance.AA.passed / Math.max(wcagCompliance.AA.total, 1)) * 100).toFixed(1)}%)\n`;
    md += `- **Level AAA:** ${wcagCompliance.AAA.passed}/${wcagCompliance.AAA.total} (${((wcagCompliance.AAA.passed / Math.max(wcagCompliance.AAA.total, 1)) * 100).toFixed(1)}%)\n\n`;
    
    if (recommendations.length > 0) {
      md += `## Recommendations\n\n`;
      recommendations.forEach(rec => md += `- ${rec}\n`);
      md += `\n`;
    }
    
    if (violations.length > 0) {
      md += `## Violations\n\n`;
      violations.slice(0, 20).forEach(v => {
        md += `### ${v.impact.toUpperCase()}: ${v.description}\n`;
        if (v.component !== 'unknown') md += `**Component:** ${v.component}\n`;
        if (v.help) md += `**Help:** ${v.help}\n`;
        if (v.helpUrl) md += `**Reference:** [${v.helpUrl}](${v.helpUrl})\n`;
        md += `\n`;
      });
    }
    
    return md;
  }

  createHTMLReport(analysis) {
    const { summary, wcagCompliance, violations, recommendations } = analysis;
    
    const passRate = ((summary.passedTests / Math.max(summary.totalTests, 1)) * 100).toFixed(1);
    const overallStatus = summary.criticalViolations === 0 && summary.seriousViolations === 0 ? 'PASS' : 'FAIL';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report - ${this.options.theme}/${this.options.density}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background: #f5f5f5;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { 
            background: white; 
            padding: 2rem; 
            border-radius: 8px; 
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .status-pass { color: #059669; }
        .status-fail { color: #dc2626; }
        .summary-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 1rem; 
            margin: 2rem 0;
        }
        .summary-card { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .summary-number { font-size: 2rem; font-weight: bold; }
        .summary-label { color: #666; margin-top: 0.5rem; }
        .section { 
            background: white; 
            padding: 2rem; 
            border-radius: 8px; 
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .violation { 
            border-left: 4px solid #ccc; 
            padding: 1rem; 
            margin: 1rem 0; 
            background: #f9f9f9;
        }
        .violation.critical { border-color: #dc2626; }
        .violation.serious { border-color: #f59e0b; }
        .violation.moderate { border-color: #3b82f6; }
        .violation.minor { border-color: #10b981; }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            transition: width 0.3s ease;
        }
        .recommendations ul { margin-left: 1.5rem; }
        .recommendations li { margin: 0.5rem 0; }
        h1, h2, h3 { margin-bottom: 1rem; }
        h1 { color: #1f2937; }
        h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
        .timestamp { color: #666; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Accessibility Report</h1>
            <p class="timestamp">Generated: ${new Date().toISOString()}</p>
            <p><strong>Theme:</strong> ${this.options.theme} | <strong>Density:</strong> ${this.options.density}</p>
            <p><strong>Overall Status:</strong> <span class="status-${overallStatus.toLowerCase()}">${overallStatus}</span> (${passRate}% pass rate)</p>
        </div>

        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-number">${summary.totalTests}</div>
                <div class="summary-label">Total Tests</div>
            </div>
            <div class="summary-card">
                <div class="summary-number" style="color: #059669;">${summary.passedTests}</div>
                <div class="summary-label">Passed</div>
            </div>
            <div class="summary-card">
                <div class="summary-number" style="color: #dc2626;">${summary.failedTests}</div>
                <div class="summary-label">Failed</div>
            </div>
            <div class="summary-card">
                <div class="summary-number" style="color: #f59e0b;">${summary.totalViolations}</div>
                <div class="summary-label">Total Violations</div>
            </div>
        </div>

        <div class="section">
            <h2>WCAG 2.1 Compliance</h2>
            <div>
                <h3>Level A</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(wcagCompliance.A.passed / Math.max(wcagCompliance.A.total, 1)) * 100}%"></div>
                </div>
                <p>${wcagCompliance.A.passed}/${wcagCompliance.A.total} criteria passed</p>
            </div>
            <div>
                <h3>Level AA</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(wcagCompliance.AA.passed / Math.max(wcagCompliance.AA.total, 1)) * 100}%"></div>
                </div>
                <p>${wcagCompliance.AA.passed}/${wcagCompliance.AA.total} criteria passed</p>
            </div>
            <div>
                <h3>Level AAA</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(wcagCompliance.AAA.passed / Math.max(wcagCompliance.AAA.total, 1)) * 100}%"></div>
                </div>
                <p>${wcagCompliance.AAA.passed}/${wcagCompliance.AAA.total} criteria passed</p>
            </div>
        </div>

        ${recommendations.length > 0 ? `
        <div class="section recommendations">
            <h2>Recommendations</h2>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        ${violations.length > 0 ? `
        <div class="section">
            <h2>Violations (Top 20)</h2>
            ${violations.slice(0, 20).map(v => `
                <div class="violation ${v.impact}">
                    <h3>${v.impact.toUpperCase()}: ${v.description}</h3>
                    ${v.component !== 'unknown' ? `<p><strong>Component:</strong> ${v.component}</p>` : ''}
                    ${v.help ? `<p><strong>Help:</strong> ${v.help}</p>` : ''}
                    ${v.helpUrl ? `<p><strong>Reference:</strong> <a href="${v.helpUrl}" target="_blank">${v.helpUrl}</a></p>` : ''}
                    ${v.recommendation ? `<p><strong>Recommendation:</strong> ${v.recommendation}</p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="section">
            <h2>Violation Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="summary-number" style="color: #dc2626;">${summary.criticalViolations}</div>
                    <div class="summary-label">Critical</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number" style="color: #f59e0b;">${summary.seriousViolations}</div>
                    <div class="summary-label">Serious</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number" style="color: #3b82f6;">${summary.moderateViolations}</div>
                    <div class="summary-label">Moderate</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number" style="color: #10b981;">${summary.minorViolations}</div>
                    <div class="summary-label">Minor</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  async saveReport(report) {
    const outputPath = this.options.output;
    const outputDir = path.dirname(outputPath);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, report, 'utf8');
  }
}

// Main execution
async function main() {
  try {
    const generator = new A11yReportGenerator(options);
    await generator.generateReport();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to generate report:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { A11yReportGenerator };