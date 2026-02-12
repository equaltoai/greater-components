import { describe, expect, it } from 'vitest';
import { scanTextForCspFindings } from '../src/utils/csp-doctor.js';

describe('csp-doctor', () => {
	it('flags runtime style writes in JS/TS', () => {
		const findings = scanTextForCspFindings(
			[
				"el.style.top = '0px';",
				"el.style.setProperty('--x', '1');",
				"el.setAttribute('style', 'color:red');",
				"document.createElement('style');",
			].join('\n'),
			'component.ts'
		);

		expect(findings.map((f) => f.type)).toEqual(
			expect.arrayContaining([
				'runtime-style-property',
				'runtime-style-setProperty',
				'runtime-style-setAttribute',
				'runtime-style-tag',
			])
		);
	});

	it('flags Svelte inline style usage', () => {
		const findings = scanTextForCspFindings(
			['<div style="color:red" />', '<div style:height={h} />'].join('\n'),
			'Component.svelte'
		);

		expect(findings.map((f) => f.type)).toEqual(
			expect.arrayContaining(['svelte-style-attr', 'svelte-style-directive'])
		);
	});

	it('flags global element selectors in CSS', () => {
		const findings = scanTextForCspFindings(
			['body { margin: 0; }', 'h1 { color: red; }'].join('\n'),
			'theme.css'
		);

		expect(findings.map((f) => f.type)).toEqual(expect.arrayContaining(['css-global-selector']));
	});

	it('does not flag scoped element selectors in CSS', () => {
		const findings = scanTextForCspFindings(
			['.gr-high-contrast body { color: black; }'].join('\n'),
			'theme.css'
		);

		expect(findings.length).toBe(0);
	});
});
