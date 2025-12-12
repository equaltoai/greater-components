import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read token definitions
const tokensPath = path.join(__dirname, '../src/tokens.json');
const basePath = path.join(__dirname, '../src/base.json');
const semanticPath = path.join(__dirname, '../src/semantic.json');
const themesPath = path.join(__dirname, '../src/themes.json');
const palettesPath = path.join(__dirname, '../src/palettes.json');
const animationsPath = path.join(__dirname, '../src/animations.css');
const distPath = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
	fs.mkdirSync(distPath, { recursive: true });
}

// Load tokens from new structure if available, fallback to legacy tokens.json
let tokens;
if (fs.existsSync(basePath)) {
	tokens = JSON.parse(fs.readFileSync(basePath, 'utf8'));
	console.log('  - Using base.json for foundational tokens');

	// Merge semantic tokens if available
	if (fs.existsSync(semanticPath)) {
		const semanticTokens = JSON.parse(fs.readFileSync(semanticPath, 'utf8'));
		tokens = { ...tokens, ...semanticTokens };
		console.log('  - Merged semantic.json tokens');
	}
} else {
	// Fallback to legacy tokens.json
	tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
	console.log('  - Using legacy tokens.json');
}
const themes = JSON.parse(fs.readFileSync(themesPath, 'utf8'));
const palettes = fs.existsSync(palettesPath)
	? JSON.parse(fs.readFileSync(palettesPath, 'utf8'))
	: {};

// Helper to convert nested object to flat CSS variable format
function flattenTokens(obj, prefix = '') {
	let result = {};

	for (const [key, value] of Object.entries(obj)) {
		const newKey = prefix ? `${prefix}-${key}` : key;

		if (value && typeof value === 'object' && 'value' in value) {
			// This is a token with a value
			result[newKey] = value.value;
		} else if (value && typeof value === 'object') {
			// This is a nested object, recurse
			Object.assign(result, flattenTokens(value, newKey));
		}
	}

	return result;
}

// Helper to resolve token references
function resolveReferences(tokens, flatTokens) {
	const resolved = {};

	for (const [key, value] of Object.entries(tokens)) {
		if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
			// This is a reference
			const refKey = value.slice(1, -1).replace(/\./g, '-');
			resolved[key] = flatTokens[refKey] || value;
		} else {
			resolved[key] = value;
		}
	}

	return resolved;
}

function toKebabCase(value) {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[_\s]+/g, '-')
		.toLowerCase();
}

function getThemeSelectors(themeName) {
	const selectors = new Set([themeName]);
	const kebab = toKebabCase(themeName);

	if (kebab && kebab !== themeName) {
		selectors.add(kebab);
	}

	return Array.from(selectors);
}

// Generate base tokens CSS
const flatTokens = flattenTokens(tokens);
const lightThemeDefaults = resolveReferences(flattenTokens(themes.light), flatTokens);

let baseCSS = ':root {\n';

for (const [key, value] of Object.entries(flatTokens)) {
	baseCSS += `  --gr-${key}: ${value};\n`;
}

baseCSS += '}\n';

// Generate theme CSS files
const themesDir = path.join(distPath, 'themes');
if (!fs.existsSync(themesDir)) {
	fs.mkdirSync(themesDir, { recursive: true });
}

let combinedThemeCSS = baseCSS + '\n';

combinedThemeCSS += `:root:not([data-theme]) {
${Object.entries(lightThemeDefaults)
	.map(([key, value]) => `  --gr-${key}: ${value};`)
	.join('\n')}
}\n\n`;

for (const [themeName, themeTokens] of Object.entries(themes)) {
	const flatThemeTokens = flattenTokens(themeTokens);
	const resolvedThemeTokens = resolveReferences(flatThemeTokens, flatTokens);

	const selectorList = getThemeSelectors(themeName)
		.map((selector) => `[data-theme="${selector}"]`)
		.join(',\n');

	let themeCSS = `${selectorList} {\n`;

	for (const [key, value] of Object.entries(resolvedThemeTokens)) {
		themeCSS += `  --gr-${key}: ${value};\n`;
	}

	themeCSS += '}\n';

	// Write individual theme file
	fs.writeFileSync(path.join(themesDir, `${themeName}.css`), baseCSS + '\n' + themeCSS);

	// Add to combined CSS
	combinedThemeCSS += themeCSS + '\n';
}

// Add media query support for system preference
combinedThemeCSS += `
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    ${Object.entries(resolveReferences(flattenTokens(themes.dark), flatTokens))
			.map(([key, value]) => `    --gr-${key}: ${value};`)
			.join('\n')}
  }
}

@media (prefers-contrast: high) {
  :root:not([data-theme]) {
    ${Object.entries(resolveReferences(flattenTokens(themes.highContrast), flatTokens))
			.map(([key, value]) => `    --gr-${key}: ${value};`)
			.join('\n')}
  }
}
`;

// Add theme-aware elevation shadows
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

// Append animations CSS if it exists
if (fs.existsSync(animationsPath)) {
	const animationsCSS = fs.readFileSync(animationsPath, 'utf8');
	combinedThemeCSS += '\n' + animationsCSS;
	console.log('  - Animations CSS included');
}

// Write combined theme CSS
fs.writeFileSync(path.join(distPath, 'theme.css'), combinedThemeCSS);

// Create CSS distribution directory structure
const cssDir = path.join(distPath, 'css');
if (!fs.existsSync(cssDir)) {
	fs.mkdirSync(cssDir, { recursive: true });
}

// Write base tokens CSS (without themes)
fs.writeFileSync(path.join(cssDir, 'tokens.css'), baseCSS);

// Write combined theme CSS to css directory as well
fs.writeFileSync(path.join(cssDir, 'theme.css'), combinedThemeCSS);

// Copy individual theme files to css/themes
const cssThemesDir = path.join(cssDir, 'themes');
if (!fs.existsSync(cssThemesDir)) {
	fs.mkdirSync(cssThemesDir, { recursive: true });
}

for (const themeName of Object.keys(themes)) {
	const themeFile = path.join(themesDir, `${themeName}.css`);
	if (fs.existsSync(themeFile)) {
		fs.copyFileSync(themeFile, path.join(cssThemesDir, `${themeName}.css`));
	}
}

console.log('  - CSS distribution directory created');

// Also write standalone animations CSS to dist
if (fs.existsSync(animationsPath)) {
	fs.copyFileSync(animationsPath, path.join(distPath, 'animations.css'));
}

// Generate palette CSS files
const palettesDir = path.join(distPath, 'palettes');
if (!fs.existsSync(palettesDir)) {
	fs.mkdirSync(palettesDir, { recursive: true });
}

for (const [paletteName, paletteData] of Object.entries(palettes)) {
	let paletteCSS = `/* ${paletteData.description || paletteName + ' palette'} */\n`;
	paletteCSS += ':root {\n';

	// Generate gray scale variables
	if (paletteData.gray) {
		for (const [shade, colorData] of Object.entries(paletteData.gray)) {
			paletteCSS += `  --gr-color-gray-${shade}: ${colorData.value};\n`;
		}
	}

	// Generate primary scale variables if defined
	if (paletteData.primary) {
		for (const [shade, colorData] of Object.entries(paletteData.primary)) {
			paletteCSS += `  --gr-color-primary-${shade}: ${colorData.value};\n`;
		}
	}

	paletteCSS += '}\n';

	fs.writeFileSync(path.join(palettesDir, `${paletteName}.css`), paletteCSS);
}

console.log(`  - Palettes: ${Object.keys(palettes).length}`);

// Copy high-contrast CSS if it exists
const highContrastPath = path.join(__dirname, '../src/high-contrast.css');
if (fs.existsSync(highContrastPath)) {
	const highContrastCSS = fs.readFileSync(highContrastPath, 'utf8');
	fs.writeFileSync(path.join(distPath, 'high-contrast.css'), highContrastCSS);
	console.log('  - High contrast CSS copied');
}

// Copy source JSON files to dist for runtime usage
if (fs.existsSync(palettesPath)) {
	fs.copyFileSync(palettesPath, path.join(distPath, 'palettes.json'));
}

// Generate SCSS variables
const scssDir = path.join(distPath, 'scss');
if (!fs.existsSync(scssDir)) {
	fs.mkdirSync(scssDir, { recursive: true });
}

// Generate base tokens SCSS
let scssTokens = `// Auto-generated SCSS variables from design tokens
// Do not edit manually - regenerate with: pnpm build

`;

for (const [key, value] of Object.entries(flatTokens)) {
	const scssVarName = `$gr-${key}`;
	scssTokens += `${scssVarName}: ${value};\n`;
}

fs.writeFileSync(path.join(scssDir, '_tokens.scss'), scssTokens);

// Generate semantic tokens SCSS for each theme
for (const [themeName, themeTokens] of Object.entries(themes)) {
	const flatThemeTokens = flattenTokens(themeTokens);
	const resolvedThemeTokens = resolveReferences(flatThemeTokens, flatTokens);

	let scssTheme = `// Auto-generated SCSS variables for ${themeName} theme
// Do not edit manually

`;

	for (const [key, value] of Object.entries(resolvedThemeTokens)) {
		const scssVarName = `$gr-${key}`;
		scssTheme += `${scssVarName}: ${value};\n`;
	}

	fs.writeFileSync(path.join(scssDir, `_${themeName}.scss`), scssTheme);
}

// Generate SCSS index file
let scssIndex = `// Greater Components Design Tokens - SCSS Entry Point
// Import this file to get all token variables

@forward 'tokens';
@forward 'light';

// Theme-specific imports (use one):
// @use 'dark' as dark;
// @use 'highContrast' as hc;
`;

fs.writeFileSync(path.join(scssDir, '_index.scss'), scssIndex);

console.log('  - SCSS variables generated');

// Generate TypeScript definitions
let tsContent = `// Auto-generated token definitions
// Do not edit manually

export const tokens = ${JSON.stringify(tokens, null, 2)} as const;

export const themes = ${JSON.stringify(themes, null, 2)} as const;

export type TokenCategory = keyof typeof tokens;
export type ColorToken = keyof typeof tokens.color;
export type TypographyToken = keyof typeof tokens.typography;
export type SpacingToken = keyof typeof tokens.spacing.scale;
export type RadiiToken = keyof typeof tokens.radii;
export type ShadowToken = keyof typeof tokens.shadows;
export type MotionToken = keyof typeof tokens.motion;

export type ThemeName = keyof typeof themes;

// Helper function to get CSS variable name
export function getCSSVar(path: string): string {
  return \`var(--gr-\${path.replace(/\./g, '-')})\`;
}

// Token getter functions
export const getColor = (path: string) => getCSSVar(\`color-\${path}\`);
export const getTypography = (path: string) => getCSSVar(\`typography-\${path}\`);
export const getSpacing = (scale: string | number) => getCSSVar(\`spacing-scale-\${scale}\`);
export const getRadius = (size: string) => getCSSVar(\`radii-\${size}\`);
export const getShadow = (size: string) => getCSSVar(\`shadows-\${size}\`);
export const getMotion = (path: string) => getCSSVar(\`motion-\${path}\`);

// Semantic token getters
export const getSemanticColor = (path: string) => getCSSVar(\`semantic-\${path}\`);

// Export palette utilities
export * from './palette-utils';
`;

// Write TypeScript source file (will be compiled to dist)
fs.writeFileSync(path.join(__dirname, '../src/index.ts'), tsContent);

// Also write a copy to dist for immediate use
fs.writeFileSync(path.join(distPath, 'tokens.d.ts'), tsContent);

console.log('✅ Tokens built successfully!');
console.log(`  - Base tokens: ${Object.keys(flatTokens).length}`);
console.log(`  - Themes: ${Object.keys(themes).length}`);
console.log(`  - Output: ${distPath}`);

// Watch mode
if (process.argv.includes('--watch')) {
	console.log('👀 Watching for changes...');

	const chokidar = await import('chokidar');
	const watcher = chokidar.watch([tokensPath, themesPath], {
		persistent: true,
	});

	watcher.on('change', () => {
		console.log('📝 Tokens changed, rebuilding...');
		process.argv = process.argv.filter((arg) => arg !== '--watch');
		import(import.meta.url);
	});
}
