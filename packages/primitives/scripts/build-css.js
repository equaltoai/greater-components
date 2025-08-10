import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const srcDir = path.join(__dirname, '../src');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a basic CSS reset and utility styles file
const stylesCSS = `
/* Greater Components Primitives - Base Styles */
@import '@greater/tokens/theme.css';

/* CSS Reset for components */
.gr-button,
.gr-textfield,
.gr-modal {
  box-sizing: border-box;
}

.gr-button *,
.gr-textfield *,
.gr-modal * {
  box-sizing: border-box;
}

/* Utility classes */
.gr-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.gr-visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

/* Focus management utilities */
.gr-focus-trap {
  outline: none;
}

/* Animation utilities */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

// Write the CSS file
fs.writeFileSync(path.join(distDir, 'styles.css'), stylesCSS);

console.log('✅ CSS build complete!');
console.log('  - Generated styles.css with base styles and utilities');