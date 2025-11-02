import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

// Note: CSS is NOT used when consuming from source (Lesser/Greater compile from src/)
// This file only exists for documentation/legacy purposes

const readme = `# Greater Components Primitives - CSS Usage

## For Lesser/Greater (Recommended)

Import components from source - CSS is compiled with your app:

\`\`\`javascript
import { Button } from '@equaltoai/greater-components/primitives';
// CSS automatically included, properly scoped
\`\`\`

## For Other Consumers

Not officially supported. Greater Components are designed for Lesser/Greater ecosystem.
If you must use them elsewhere, import from source and compile with Svelte 5+.

Your bundler must:
- Support Svelte 5 
- Have runes enabled
- Compile .svelte files

No separate CSS import needed - styles are in components.
`;

fs.writeFileSync(path.join(distDir, 'CSS_USAGE.md'), readme);

// Ensure backward compatibility: create styles.css symlink/copy if style.css exists
const styleCssPath = path.join(distDir, 'style.css');
const stylesCssPath = path.join(distDir, 'styles.css');

if (fs.existsSync(styleCssPath) && !fs.existsSync(stylesCssPath)) {
  try {
    // Try symlink first (more efficient)
    fs.symlinkSync('style.css', stylesCssPath, 'file');
    console.log('✅ Created styles.css symlink for backward compatibility');
  } catch {
    // Fallback to copy if symlink fails (e.g., Windows)
    fs.copyFileSync(styleCssPath, stylesCssPath);
    console.log('✅ Created styles.css copy for backward compatibility');
  }
}

console.log('✅ CSS build complete!');
console.log('  - Components export source files with embedded styles');
console.log('  - Consuming apps compile from source');