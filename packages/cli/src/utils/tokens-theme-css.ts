import { fetchFromGitTag } from './git-fetch.js';

const TOKENS_BASE_PATH = 'packages/tokens/src/base.json';
const TOKENS_LEGACY_PATH = 'packages/tokens/src/tokens.json';
const TOKENS_THEMES_PATH = 'packages/tokens/src/themes.json';
const TOKENS_ANIMATIONS_PATH = 'packages/tokens/src/animations.css';

function isNotFoundError(error: unknown): boolean {
	if (!error || typeof error !== 'object') return false;
	// fetchFromGitTag throws NetworkError which includes statusCode.
	return (error as { statusCode?: unknown }).statusCode === 404;
}

async function fetchText(
	ref: string,
	filePath: string,
	options: { skipCache?: boolean } = {}
): Promise<string> {
	const content = await fetchFromGitTag(ref, filePath, options);
	return content.toString('utf-8');
}

async function fetchOptionalText(
	ref: string,
	filePath: string,
	options: { skipCache?: boolean } = {}
): Promise<string | null> {
	try {
		return await fetchText(ref, filePath, options);
	} catch (error) {
		if (isNotFoundError(error)) return null;
		throw error;
	}
}

function flattenTokens(obj: unknown, prefix = ''): Record<string, string> {
	if (!obj || typeof obj !== 'object') return {};

	const result: Record<string, string> = {};
	for (const [key, value] of Object.entries(obj)) {
		const newKey = prefix ? `${prefix}-${key}` : key;

		if (value && typeof value === 'object' && 'value' in value) {
			const tokenValue = (value as { value?: unknown }).value;
			if (tokenValue !== undefined) result[newKey] = String(tokenValue);
			continue;
		}

		if (value && typeof value === 'object') {
			Object.assign(result, flattenTokens(value, newKey));
		}
	}

	return result;
}

function getTokenReference(value: unknown): string | null {
	if (typeof value !== 'string') return null;

	const match = value.match(/^\{([^}]+)\}$/);
	if (!match) return null;

	return match[1] ?? null;
}

function getReferenceKey(referencePath: string): string {
	return referencePath.replace(/\./g, '-');
}

function resolveReferences(
	tokensToResolve: Record<string, string>,
	lookupTokens: Record<string, string>,
	{ mode }: { mode: 'css-var' | 'value' }
): Record<string, string> {
	const resolved: Record<string, string> = {};
	const resolvedLookup: Record<string, string> = {};
	const resolving = new Set<string>();

	function resolveKey(key: string): string {
		if (key in resolvedLookup) return resolvedLookup[key] ?? '';
		if (resolving.has(key)) throw new Error(`Cycle detected while resolving token: ${key}`);

		resolving.add(key);
		const value = lookupTokens[key];
		const referencePath = getTokenReference(value);

		if (!referencePath) {
			resolvedLookup[key] = value ?? '';
			resolving.delete(key);
			return value ?? '';
		}

		const refKey = getReferenceKey(referencePath);
		if (!(refKey in lookupTokens)) {
			throw new Error(`Unresolved token reference: ${key} = ${value} (missing ${refKey})`);
		}

		if (mode === 'css-var') {
			const rewritten = `var(--gr-${refKey})`;
			resolvedLookup[key] = rewritten;
			resolving.delete(key);
			return rewritten;
		}

		const resolvedValue = resolveKey(refKey);
		resolvedLookup[key] = resolvedValue;
		resolving.delete(key);
		return resolvedValue;
	}

	for (const [key, value] of Object.entries(tokensToResolve)) {
		const referencePath = getTokenReference(value);
		if (!referencePath) {
			resolved[key] = value;
			continue;
		}

		const refKey = getReferenceKey(referencePath);
		if (!(refKey in lookupTokens)) {
			throw new Error(`Unresolved token reference: ${key} = ${value} (missing ${refKey})`);
		}

		if (mode === 'css-var') {
			resolved[key] = `var(--gr-${refKey})`;
			continue;
		}

		resolved[key] = resolveKey(refKey);
	}

	return resolved;
}

function toKebabCase(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[_\s]+/g, '-')
		.toLowerCase();
}

function getThemeSelectors(themeName: string): string[] {
	const selectors = new Set([themeName]);
	const kebab = toKebabCase(themeName);

	if (kebab && kebab !== themeName) {
		selectors.add(kebab);
	}

	return Array.from(selectors);
}

export async function generateTokensThemeCssFromRepo(
	ref: string,
	options: { skipCache?: boolean } = {}
): Promise<Buffer> {
	const baseText = await fetchOptionalText(ref, TOKENS_BASE_PATH, options);
	const baseTokens = baseText
		? (JSON.parse(baseText) as unknown)
		: JSON.parse(await fetchText(ref, TOKENS_LEGACY_PATH, options));

	const themesText = await fetchText(ref, TOKENS_THEMES_PATH, options);
	const themes = JSON.parse(themesText) as Record<string, unknown>;

	const flatBaseTokens = flattenTokens(baseTokens);
	const lightTheme = themes['light'];
	const darkTheme = themes['dark'];
	const highContrastTheme = themes['highContrast'];

	if (!lightTheme || !darkTheme || !highContrastTheme) {
		throw new Error(
			`Invalid tokens themes.json at ref "${ref}": expected keys "light", "dark", and "highContrast".`
		);
	}

	const lightThemeDefaults = resolveReferences(flattenTokens(lightTheme), flatBaseTokens, {
		mode: 'css-var',
	});

	let baseCSS = ':root {\n';
	for (const [key, value] of Object.entries(flatBaseTokens)) {
		baseCSS += `  --gr-${key}: ${value};\n`;
	}
	baseCSS += '}\n';

	let combinedThemeCSS = baseCSS + '\n';

	combinedThemeCSS += `:root:not([data-theme]) {\n${Object.entries(lightThemeDefaults)
		.map(([key, value]) => `  --gr-${key}: ${value};`)
		.join('\n')}\n}\n\n`;

	for (const [themeName, themeTokens] of Object.entries(themes)) {
		const flatThemeTokens = flattenTokens(themeTokens);
		const themeLookupTokens = { ...flatBaseTokens, ...flatThemeTokens };
		const resolvedThemeTokens = resolveReferences(flatThemeTokens, themeLookupTokens, {
			mode: 'css-var',
		});

		const selectorList = getThemeSelectors(themeName)
			.map((selector) => `[data-theme="${selector}"]`)
			.join(',\n');

		let themeCSS = `${selectorList} {\n`;

		for (const [key, value] of Object.entries(resolvedThemeTokens)) {
			themeCSS += `  --gr-${key}: ${value};\n`;
		}

		themeCSS += '}\n';
		combinedThemeCSS += themeCSS + '\n';
	}

	combinedThemeCSS += `
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    ${Object.entries(
			resolveReferences(flattenTokens(darkTheme), flatBaseTokens, { mode: 'css-var' })
		)
			.map(([key, value]) => `    --gr-${key}: ${value};`)
			.join('\n')}
  }
}

@media (prefers-contrast: high) {
  :root:not([data-theme]) {
    ${Object.entries(
			resolveReferences(flattenTokens(highContrastTheme), flatBaseTokens, { mode: 'css-var' })
		)
			.map(([key, value]) => `    --gr-${key}: ${value};`)
			.join('\n')}
  }
}
`;

	combinedThemeCSS += `
/* Theme-aware elevation shadows */
:root, [data-theme="light"] {
  --gr-shadows-elevation-sm: var(--gr-shadows-sm);
  --gr-shadows-elevation-md: var(--gr-shadows-md);
  --gr-shadows-elevation-lg: var(--gr-shadows-lg);
  --gr-shadows-elevation-hover: var(--gr-shadows-lg);
}

[data-theme="dark"] {
  --gr-shadows-elevation-sm: var(--gr-shadows-glow-sm);
  --gr-shadows-elevation-md: var(--gr-shadows-glow-md);
  --gr-shadows-elevation-lg: var(--gr-shadows-glow-lg);
  --gr-shadows-elevation-hover: 0 0 0 1px var(--gr-semantic-border-strong);
}

[data-theme="highContrast"],
[data-theme="high-contrast"] {
  --gr-shadows-elevation-sm: none;
  --gr-shadows-elevation-md: 0 0 0 1px var(--gr-semantic-border-default);
  --gr-shadows-elevation-lg: 0 0 0 2px var(--gr-semantic-border-strong);
  --gr-shadows-elevation-hover: 0 0 0 2px var(--gr-semantic-border-strong);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --gr-shadows-elevation-sm: var(--gr-shadows-glow-sm);
    --gr-shadows-elevation-md: var(--gr-shadows-glow-md);
    --gr-shadows-elevation-lg: var(--gr-shadows-glow-lg);
    --gr-shadows-elevation-hover: 0 0 0 1px var(--gr-semantic-border-strong);
  }
}

/* Theme transition utility class */
.gr-theme-transition {
  transition: var(--gr-semantic-transition-theme, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease);
}

.gr-theme-transition * {
  transition: inherit;
}
`;

	const animationsCSS = await fetchOptionalText(ref, TOKENS_ANIMATIONS_PATH, options);
	if (animationsCSS) combinedThemeCSS += '\n' + animationsCSS;

	return Buffer.from(combinedThemeCSS, 'utf-8');
}
