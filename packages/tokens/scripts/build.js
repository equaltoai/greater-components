import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read token definitions
const tokensPath = path.join(__dirname, '../src/tokens.json');
const themesPath = path.join(__dirname, '../src/themes.json');
const distPath = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
const themes = JSON.parse(fs.readFileSync(themesPath, 'utf8'));

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

// Generate base tokens CSS
const flatTokens = flattenTokens(tokens);
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

for (const [themeName, themeTokens] of Object.entries(themes)) {
  const flatThemeTokens = flattenTokens(themeTokens);
  const resolvedThemeTokens = resolveReferences(flatThemeTokens, flatTokens);
  
  let themeCSS = `[data-theme="${themeName}"] {\n`;
  
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

// Write combined theme CSS
fs.writeFileSync(path.join(distPath, 'theme.css'), combinedThemeCSS);

// Copy high-contrast CSS if it exists
const highContrastPath = path.join(__dirname, '../src/high-contrast.css');
if (fs.existsSync(highContrastPath)) {
  const highContrastCSS = fs.readFileSync(highContrastPath, 'utf8');
  fs.writeFileSync(path.join(distPath, 'high-contrast.css'), highContrastCSS);
  console.log('  - High contrast CSS copied');
}

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
    persistent: true
  });
  
  watcher.on('change', () => {
    console.log('📝 Tokens changed, rebuilding...');
    process.argv = process.argv.filter(arg => arg !== '--watch');
    import(import.meta.url);
  });
}