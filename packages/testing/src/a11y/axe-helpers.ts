/**
 * Axe Testing Helpers
 * Utilities for running axe-core accessibility tests with custom configurations
 */

import type { AxeResults, RunOptions } from 'axe-core';

export type AxeTestOptions = RunOptions;

export interface AxeViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary?: string;
  }>;
}

export interface AxeTestResult {
  violations: AxeViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  timestamp: string;
  url?: string;
  testName?: string;
}

/**
 * Default axe configuration for WCAG 2.1 AA compliance
 */
export const defaultAxeConfig: AxeTestOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
  },
  rules: {
    'color-contrast': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-one-main': { enabled: true },
    'region': { enabled: true },
    'skip-link': { enabled: true },
  },
  reporter: 'v2',
  resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
};

/**
 * Strict axe configuration for WCAG 2.1 AAA compliance
 */
export const strictAxeConfig: AxeTestOptions = {
  ...defaultAxeConfig,
  runOnly: {
    type: 'tag',
    values: [
      'wcag2a',
      'wcag2aa',
      'wcag2aaa',
      'wcag21a',
      'wcag21aa',
      'wcag21aaa',
      'best-practice',
      'experimental',
    ],
  },
  rules: {
    ...defaultAxeConfig.rules,
    'color-contrast-enhanced': { enabled: true },
    'focus-visible': { enabled: true },
    'no-autoplay-audio': { enabled: true },
  },
};

/**
 * Theme-specific axe configurations
 */
export const themeConfigs = {
  light: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      'color-contrast': { enabled: true },
    },
  },
  dark: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      'color-contrast': { enabled: true },
    },
  },
  highContrast: {
    ...strictAxeConfig,
    rules: {
      ...strictAxeConfig.rules,
      'color-contrast-enhanced': { enabled: true },
    },
  },
};

/**
 * Density-specific axe configurations
 */
export const densityConfigs = {
  compact: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      'target-size': { enabled: true }, // Ensure touch targets are still accessible
    },
  },
  comfortable: defaultAxeConfig,
  spacious: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      'target-size': { enabled: true },
    },
  },
};

/**
 * Format axe results into a structured report
 */
export function formatAxeResults(results: AxeResults, testName?: string): AxeTestResult {
  return {
    violations: results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact as AxeViolation['impact'],
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => ({
        html: node.html,
        target: node.target as string[],
        failureSummary: node.failureSummary,
      })),
    })),
    passes: results.passes?.length || 0,
    incomplete: results.incomplete?.length || 0,
    inapplicable: results.inapplicable?.length || 0,
    timestamp: new Date().toISOString(),
    url: results.url,
    testName,
  };
}

/**
 * Check if results meet WCAG compliance level
 */
export function meetsWCAGLevel(
  results: AxeTestResult,
  level: 'A' | 'AA' | 'AAA' = 'AA'
): boolean {
  const criticalViolations = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );

  switch (level) {
    case 'A':
      return criticalViolations.length === 0;
    case 'AA':
      return (
        criticalViolations.length === 0 &&
        results.violations.filter((v) => v.impact === 'moderate').length === 0
      );
    case 'AAA':
      return results.violations.length === 0;
    default:
      return false;
  }
}

/**
 * Generate a summary of axe test results
 */
export function generateAxeSummary(results: AxeTestResult[]): string {
  const totalViolations = results.reduce((acc, r) => acc + r.violations.length, 0);
  const criticalCount = results.reduce(
    (acc, r) =>
      acc + r.violations.filter((v) => v.impact === 'critical').length,
    0
  );
  const seriousCount = results.reduce(
    (acc, r) =>
      acc + r.violations.filter((v) => v.impact === 'serious').length,
    0
  );

  return `
Accessibility Test Summary
==========================
Total Tests: ${results.length}
Total Violations: ${totalViolations}
Critical: ${criticalCount}
Serious: ${seriousCount}
WCAG AA Compliance: ${results.every((r) => meetsWCAGLevel(r, 'AA')) ? 'PASS' : 'FAIL'}
  `.trim();
}
