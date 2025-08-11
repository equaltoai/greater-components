#!/usr/bin/env node

/**
 * Aggregate coverage reports from all packages
 * Generates a combined coverage report and verifies thresholds
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PACKAGES_DIR = path.join(process.cwd(), 'packages');
const OUTPUT_DIR = path.join(process.cwd(), 'coverage');
const COVERAGE_THRESHOLD = 90;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function getPackages() {
  if (!fs.existsSync(PACKAGES_DIR)) {
    log('❌ Packages directory not found!', colors.red);
    process.exit(1);
  }

  return fs.readdirSync(PACKAGES_DIR)
    .filter(name => fs.statSync(path.join(PACKAGES_DIR, name)).isDirectory())
    .filter(name => {
      const packageJsonPath = path.join(PACKAGES_DIR, name, 'package.json');
      return fs.existsSync(packageJsonPath);
    });
}

function getCoverageForPackage(packageName) {
  // Try multiple possible coverage file locations
  const possibleFiles = [
    path.join(PACKAGES_DIR, packageName, 'coverage', 'coverage-summary.json'),
    path.join(PACKAGES_DIR, packageName, 'coverage', 'coverage-final.json')
  ];
  
  let coverageFile = null;
  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      coverageFile = file;
      break;
    }
  }
  
  if (!coverageFile) {
    log(`⚠️  No coverage report found for ${packageName}`, colors.yellow);
    return null;
  }

  try {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    
    // Handle different coverage file formats
    let totalCoverage;
    if (coverage.total) {
      // coverage-summary.json format
      totalCoverage = coverage.total;
    } else {
      // coverage-final.json format - aggregate all files
      const totals = {
        lines: { total: 0, covered: 0 },
        functions: { total: 0, covered: 0 },
        statements: { total: 0, covered: 0 },
        branches: { total: 0, covered: 0 }
      };

      Object.values(coverage).forEach(fileCoverage => {
        if (fileCoverage.s && fileCoverage.f && fileCoverage.b) {
          // Aggregate statements
          Object.values(fileCoverage.s).forEach(count => {
            totals.statements.total++;
            if (count > 0) totals.statements.covered++;
          });
          
          // Aggregate functions
          Object.values(fileCoverage.f).forEach(count => {
            totals.functions.total++;
            if (count > 0) totals.functions.covered++;
          });
          
          // Aggregate branches
          Object.values(fileCoverage.b).forEach(branchData => {
            if (Array.isArray(branchData)) {
              branchData.forEach(count => {
                totals.branches.total++;
                if (count > 0) totals.branches.covered++;
              });
            }
          });
          
          // Lines are similar to statements for simplicity
          totals.lines = { ...totals.statements };
        }
      });

      // Convert to percentages
      totalCoverage = {};
      Object.keys(totals).forEach(type => {
        const pct = totals[type].total > 0 ? (totals[type].covered / totals[type].total) * 100 : 0;
        totalCoverage[type] = {
          total: totals[type].total,
          covered: totals[type].covered,
          pct: Math.round(pct * 100) / 100
        };
      });
    }
    
    return {
      package: packageName,
      ...totalCoverage
    };
  } catch (error) {
    log(`❌ Error reading coverage for ${packageName}: ${error.message}`, colors.red);
    return null;
  }
}

function calculateOverallCoverage(packageCoverages) {
  const totals = {
    lines: { total: 0, covered: 0 },
    functions: { total: 0, covered: 0 },
    statements: { total: 0, covered: 0 },
    branches: { total: 0, covered: 0 }
  };

  packageCoverages.forEach(pkg => {
    if (pkg) {
      Object.keys(totals).forEach(type => {
        totals[type].total += pkg[type].total;
        totals[type].covered += pkg[type].covered;
      });
    }
  });

  const overall = {};
  Object.keys(totals).forEach(type => {
    const pct = totals[type].total > 0 ? (totals[type].covered / totals[type].total) * 100 : 0;
    overall[type] = {
      total: totals[type].total,
      covered: totals[type].covered,
      pct: Math.round(pct * 100) / 100
    };
  });

  return overall;
}

function formatCoverage(coverage, type) {
  const pct = coverage[type].pct;
  const color = pct >= COVERAGE_THRESHOLD ? colors.green : 
                pct >= COVERAGE_THRESHOLD - 10 ? colors.yellow : colors.red;
  
  return `${color}${pct.toFixed(1)}%${colors.reset} (${coverage[type].covered}/${coverage[type].total})`;
}

function generateReport() {
  log(`${colors.bold}📊 Coverage Report Aggregation${colors.reset}\n`);
  
  const packages = getPackages();
  log(`Found ${packages.length} packages: ${packages.join(', ')}\n`);

  const packageCoverages = packages.map(getCoverageForPackage).filter(Boolean);
  
  if (packageCoverages.length === 0) {
    log('❌ No coverage reports found! Run "pnpm test:coverage" first.', colors.red);
    process.exit(1);
  }

  log(`${colors.bold}📋 Individual Package Coverage:${colors.reset}`);
  packageCoverages.forEach(pkg => {
    log(`\n${colors.blue}${pkg.package}:${colors.reset}`);
    log(`  Lines:      ${formatCoverage(pkg, 'lines')}`);
    log(`  Functions:  ${formatCoverage(pkg, 'functions')}`);
    log(`  Statements: ${formatCoverage(pkg, 'statements')}`);
    log(`  Branches:   ${formatCoverage(pkg, 'branches')}`);
  });

  const overall = calculateOverallCoverage(packageCoverages);
  
  log(`\n${colors.bold}🎯 Overall Project Coverage:${colors.reset}`);
  log(`  Lines:      ${formatCoverage(overall, 'lines')}`);
  log(`  Functions:  ${formatCoverage(overall, 'functions')}`);
  log(`  Statements: ${formatCoverage(overall, 'statements')}`);
  log(`  Branches:   ${formatCoverage(overall, 'branches')}`);

  // Write combined report
  const combinedReport = {
    packages: packageCoverages,
    overall,
    timestamp: new Date().toISOString(),
    threshold: COVERAGE_THRESHOLD
  };

  const reportPath = path.join(OUTPUT_DIR, 'combined-coverage.json');
  fs.writeFileSync(reportPath, JSON.stringify(combinedReport, null, 2));
  log(`\n📝 Combined report written to: ${reportPath}`);

  // Check thresholds
  let failed = false;
  const types = ['lines', 'functions', 'statements', 'branches'];
  
  log(`\n${colors.bold}🎯 Threshold Verification (${COVERAGE_THRESHOLD}%):${colors.reset}`);
  types.forEach(type => {
    const pct = overall[type].pct;
    const passed = pct >= COVERAGE_THRESHOLD;
    const status = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    
    log(`  ${status} ${type}: ${color}${pct.toFixed(1)}%${colors.reset}`);
    if (!passed) failed = true;
  });

  // Generate HTML report index
  generateHtmlIndex(packageCoverages, overall);

  if (failed) {
    log(`\n❌ Coverage thresholds not met!`, colors.red);
    process.exit(1);
  } else {
    log(`\n✅ All coverage thresholds met!`, colors.green);
  }
}

function generateHtmlIndex(packageCoverages, overall) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Greater Components - Coverage Report</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 40px; background: #f8fafc; }
    .header { background: #1e293b; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .header h1 { margin: 0; }
    .header .timestamp { opacity: 0.8; margin-top: 8px; }
    .overview { background: white; padding: 24px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .packages { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .package { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .package h3 { margin: 0 0 16px 0; color: #1e293b; }
    .metric { display: flex; justify-content: space-between; margin: 8px 0; }
    .metric .value { font-weight: 600; }
    .high { color: #059669; }
    .medium { color: #d97706; }
    .low { color: #dc2626; }
    .bar { height: 6px; background: #e5e7eb; border-radius: 3px; margin-top: 4px; }
    .bar .fill { height: 100%; border-radius: 3px; }
    .fill.high { background: #10b981; }
    .fill.medium { background: #f59e0b; }
    .fill.low { background: #ef4444; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Greater Components - Coverage Report</h1>
    <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
  </div>
  
  <div class="overview">
    <h2>Overall Project Coverage</h2>
    ${generateMetricsHtml(overall)}
  </div>

  <h2>Package Coverage</h2>
  <div class="packages">
    ${packageCoverages.map(pkg => `
      <div class="package">
        <h3>${pkg.package}</h3>
        ${generateMetricsHtml(pkg)}
        <p><a href="./${pkg.package}/index.html" target="_blank">View detailed report →</a></p>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  log(`📊 HTML index written to: ${path.join(OUTPUT_DIR, 'index.html')}`);
}

function generateMetricsHtml(coverage) {
  const types = ['lines', 'functions', 'statements', 'branches'];
  return types.map(type => {
    const pct = coverage[type].pct;
    const level = pct >= 90 ? 'high' : pct >= 80 ? 'medium' : 'low';
    
    return `
      <div class="metric">
        <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span class="value ${level}">${pct.toFixed(1)}%</span>
      </div>
      <div class="bar">
        <div class="fill ${level}" style="width: ${pct}%"></div>
      </div>
    `;
  }).join('');
}

// Run the report
generateReport();