import path from 'node:path';

export type CspFindingType =
	| 'runtime-style-property'
	| 'runtime-style-cssText'
	| 'runtime-style-setProperty'
	| 'runtime-style-setAttribute'
	| 'runtime-style-tag'
	| 'svelte-style-attr'
	| 'svelte-style-directive'
	| 'css-global-selector';

export interface CspFinding {
	type: CspFindingType;
	file: string;
	line: number;
	column: number;
	snippet: string;
}

interface Pattern {
	type: CspFindingType;
	regex: RegExp;
}

const JS_PATTERNS: Pattern[] = [
	{ type: 'runtime-style-property', regex: /\.style\.[a-zA-Z_$][\w$]*\s*=/ },
	{ type: 'runtime-style-cssText', regex: /\.style\.cssText\s*=/ },
	{ type: 'runtime-style-setProperty', regex: /\.style\.setProperty\s*\(/ },
	{ type: 'runtime-style-setAttribute', regex: /setAttribute\s*\(\s*['"]style['"]\s*,/ },
	{ type: 'runtime-style-tag', regex: /document\.createElement\s*\(\s*['"]style['"]\s*\)/ },
];

const SVELTE_PATTERNS: Pattern[] = [
	{ type: 'svelte-style-attr', regex: /\bstyle\s*=\s*['"]/ },
	{ type: 'svelte-style-directive', regex: /\bstyle:[a-zA-Z-]+\s*=/ },
];

const CSS_PATTERNS: Pattern[] = [
	{ type: 'css-global-selector', regex: /^\s*(body|html|h1|h2|h3|h4|h5|h6)\s*(\{|,)/ },
];

export function scanTextForCspFindings(text: string, filePath: string): CspFinding[] {
	const ext = path.extname(filePath).toLowerCase();
	const lines = text.split(/\r?\n/);

	const patterns =
		ext === '.css' ? CSS_PATTERNS : ext === '.svelte' ? [...JS_PATTERNS, ...SVELTE_PATTERNS] : JS_PATTERNS;

	const findings: CspFinding[] = [];

	for (let i = 0; i < lines.length; i++) {
		const lineText = lines[i] ?? '';

		for (const pattern of patterns) {
			const match = lineText.match(pattern.regex);
			if (!match || match.index === undefined) continue;

			findings.push({
				type: pattern.type,
				file: filePath,
				line: i + 1,
				column: match.index + 1,
				snippet: lineText.trim().slice(0, 160),
			});
		}
	}

	return findings;
}

