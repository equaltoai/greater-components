import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { scanSvelteSource, scanBuildOutput, generateReport } from './audit-csp.mjs';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('CSP Scanner Property Tests', () => {
	describe('Source Scanner', () => {
		/**
		 * Property 1: Source scanner detects style attributes
		 * Feature: csp-baseline-and-primitives, Property 1
		 * Validates: Requirements 2.1
		 */
		it('should detect all style="..." attributes in Svelte files', () => {
			fc.assert(
				fc.property(
					fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
					fc.nat({ max: 5 }),
					(lines, styleCount) => {
						// Create a temporary test directory
						const testDir = join(tmpdir(), `csp-test-${Date.now()}-${Math.random()}`);
						mkdirSync(testDir, { recursive: true });
						
						try {
							// Generate content with known number of style attributes
							const contentLines = [...lines];
							for (let i = 0; i < styleCount; i++) {
								contentLines.push(`<div style="color: red;">Test</div>`);
							}
							const content = contentLines.join('\n');
							
							// Write test file
							const testFile = join(testDir, 'test.svelte');
							writeFileSync(testFile, content);
							
							// Scan the file
							const violations = scanSvelteSource(testDir);
							
							// Count style-attribute violations
							const styleAttrCount = violations.filter(
								v => v.type === 'style-attribute'
							).length;
							
							// Should detect exactly the number of style attributes we added
							return styleAttrCount === styleCount;
						} finally {
							// Cleanup
							rmSync(testDir, { recursive: true, force: true });
						}
					}
				),
				{ numRuns: 100 }
			);
		});

		/**
		 * Property 2: Source scanner detects style bindings
		 * Feature: csp-baseline-and-primitives, Property 2
		 * Validates: Requirements 2.2
		 */
		it('should detect all style={...} bindings in Svelte files', () => {
			fc.assert(
				fc.property(
					fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
					fc.nat({ max: 5 }),
					(lines, bindingCount) => {
						// Create a temporary test directory
						const testDir = join(tmpdir(), `csp-test-${Date.now()}-${Math.random()}`);
						mkdirSync(testDir, { recursive: true });
						
						try {
							// Generate content with known number of style bindings
							const contentLines = [...lines];
							for (let i = 0; i < bindingCount; i++) {
								contentLines.push(`<div style={dynamicStyle}>Test</div>`);
							}
							const content = contentLines.join('\n');
							
							// Write test file
							const testFile = join(testDir, 'test.svelte');
							writeFileSync(testFile, content);
							
							// Scan the file
							const violations = scanSvelteSource(testDir);
							
							// Count style-binding violations
							const styleBindingCount = violations.filter(
								v => v.type === 'style-binding'
							).length;
							
							// Should detect exactly the number of style bindings we added
							return styleBindingCount === bindingCount;
						} finally {
							// Cleanup
							rmSync(testDir, { recursive: true, force: true });
						}
					}
				),
				{ numRuns: 100 }
			);
		});
	});

	describe('Build Scanner', () => {
		/**
		 * Property 3: Build scanner detects inline styles
		 * Feature: csp-baseline-and-primitives, Property 3
		 * Validates: Requirements 2.3
		 */
		it('should detect all style="..." attributes in HTML files', () => {
			fc.assert(
				fc.property(
					fc.nat({ max: 5 }),
					(styleCount) => {
						// Create a temporary test directory
						const testDir = join(tmpdir(), `csp-test-${Date.now()}-${Math.random()}`);
						mkdirSync(testDir, { recursive: true });
						
						try {
							// Generate HTML with known number of inline styles
							let html = '<!DOCTYPE html><html><body>';
							for (let i = 0; i < styleCount; i++) {
								html += `<div style="color: red;">Test ${i}</div>`;
							}
							html += '</body></html>';
							
							// Write test file
							const testFile = join(testDir, 'test.html');
							writeFileSync(testFile, html);
							
							// Scan the file
							const violations = scanBuildOutput(testDir);
							
							// Count inline-style violations
							const inlineStyleCount = violations.filter(
								v => v.type === 'inline-style'
							).length;
							
							// Should detect exactly the number of inline styles we added
							return inlineStyleCount === styleCount;
						} finally {
							// Cleanup
							rmSync(testDir, { recursive: true, force: true });
						}
					}
				),
				{ numRuns: 100 }
			);
		});

		/**
		 * Property 4: Build scanner detects inline scripts
		 * Feature: csp-baseline-and-primitives, Property 4
		 * Validates: Requirements 2.4
		 */
		it('should detect all inline <script> tags in HTML files', () => {
			fc.assert(
				fc.property(
					fc.nat({ max: 5 }),
					(scriptCount) => {
						// Create a temporary test directory
						const testDir = join(tmpdir(), `csp-test-${Date.now()}-${Math.random()}`);
						mkdirSync(testDir, { recursive: true });
						
						try {
							// Generate HTML with known number of inline scripts
							let html = '<!DOCTYPE html><html><body>';
							for (let i = 0; i < scriptCount; i++) {
								html += `<script>console.log('test ${i}');</script>`;
							}
							// Add external script (should not be detected)
							html += '<script src="external.js"></script>';
							html += '</body></html>';
							
							// Write test file
							const testFile = join(testDir, 'test.html');
							writeFileSync(testFile, html);
							
							// Scan the file
							const violations = scanBuildOutput(testDir);
							
							// Count inline-script violations
							const inlineScriptCount = violations.filter(
								v => v.type === 'inline-script'
							).length;
							
							// Should detect exactly the number of inline scripts we added
							// (not the external script)
							return inlineScriptCount === scriptCount;
						} finally {
							// Cleanup
							rmSync(testDir, { recursive: true, force: true });
						}
					}
				),
				{ numRuns: 100 }
			);
		});
	});

	describe('Scanner Categorization', () => {
		/**
		 * Property 5: Scanner categorizes findings correctly
		 * Feature: csp-baseline-and-primitives, Property 5
		 * Validates: Requirements 2.5
		 */
		it('should categorize primitives violations as ship-blocking', () => {
			fc.assert(
				fc.property(
					fc.constantFrom('Skeleton', 'Avatar', 'Text', 'Container', 'Button'),
					(componentName) => {
						// Create a temporary test directory structure
						const testDir = join(tmpdir(), `csp-test-${Date.now()}-${Math.random()}`);
						const primitivesDir = join(testDir, 'packages', 'primitives', 'src', 'components');
						mkdirSync(primitivesDir, { recursive: true });
						
						try {
							// Create a component file with a style violation
							const content = `<div style="color: red;">${componentName}</div>`;
							const testFile = join(primitivesDir, `${componentName}.svelte`);
							writeFileSync(testFile, content);
							
							// Scan the file
							const violations = scanSvelteSource(testDir);
							
							// All violations should be categorized as ship-blocking
							return violations.every(v => v.category === 'ship-blocking');
						} finally {
							// Cleanup
							rmSync(testDir, { recursive: true, force: true });
						}
					}
				),
				{ numRuns: 100 }
			);
		});

		/**
		 * Property 6: Scanner produces complete reports
		 * Feature: csp-baseline-and-primitives, Property 6
		 * Validates: Requirements 2.6
		 */
		it('should include file path, line number, type, and snippet for each violation', () => {
			fc.assert(
				fc.property(
					fc.nat({ min: 1, max: 5 }),
					(violationCount) => {
						// Create a temporary test directory
						const testDir = join(tmpdir(), `csp-test-${Date.now()}-${Math.random()}`);
						mkdirSync(testDir, { recursive: true });
						
						try {
							// Generate content with violations
							let content = '';
							for (let i = 0; i < violationCount; i++) {
								content += `<div style="color: red;">Test ${i}</div>\n`;
							}
							
							// Write test file
							const testFile = join(testDir, 'test.svelte');
							writeFileSync(testFile, content);
							
							// Scan the file
							const violations = scanSvelteSource(testDir);
							
							// Every violation should have required fields
							return violations.every(v => 
								v.file && 
								typeof v.file === 'string' &&
								typeof v.line === 'number' && 
								v.line > 0 &&
								typeof v.column === 'number' &&
								v.column > 0 &&
								v.type && 
								(v.type === 'style-attribute' || v.type === 'style-binding') &&
								v.snippet && 
								typeof v.snippet === 'string' &&
								v.snippet.length > 0
							);
						} finally {
							// Cleanup
							rmSync(testDir, { recursive: true, force: true });
						}
					}
				),
				{ numRuns: 100 }
			);
		});
	});
});
