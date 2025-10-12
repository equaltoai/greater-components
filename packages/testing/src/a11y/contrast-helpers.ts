/**
 * Color Contrast Testing Helpers
 * Utilities for testing WCAG color contrast requirements
 */

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  fontSize?: number;
  fontWeight?: string;
  isLargeText: boolean;
}

export interface ElementContrastResult extends ContrastResult {
  element: HTMLElement;
  foreground: string;
  background: string;
  recommendation?: string;
}

/**
 * WCAG contrast ratio requirements
 */
export const WCAG_CONTRAST = {
  AA: {
    normal: 4.5,
    large: 3,
  },
  AAA: {
    normal: 7,
    large: 4.5,
  },
} as const;

/**
 * Calculate relative luminance of a color
 */
export function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse color string to RGB
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3 && hex[0] && hex[1] && hex[2]) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    } else if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
  }

  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // Handle named colors (simplified - would need full color map in production)
  const namedColors: Record<string, { r: number; g: number; b: number }> = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  };

  return namedColors[color.toLowerCase()] || null;
}

/**
 * Check if text is considered "large" by WCAG standards
 */
export function isLargeText(fontSize: number, fontWeight: string): boolean {
  // Large text is 18pt (24px) or 14pt (18.66px) bold
  return fontSize >= 24 || (fontSize >= 18.66 && fontWeight === 'bold');
}

/**
 * Test contrast ratio for an element
 */
export function testElementContrast(element: HTMLElement): ElementContrastResult {
  const styles = window.getComputedStyle(element);
  
  // Get colors
  const foreground = styles.color;
  const background = getEffectiveBackgroundColor(element);
  
  // Parse colors
  const fgColor = parseColor(foreground);
  const bgColor = parseColor(background);
  
  if (!fgColor || !bgColor) {
    return {
      element,
      foreground,
      background,
      ratio: 0,
      passesAA: false,
      passesAAA: false,
      isLargeText: false,
      recommendation: 'Could not parse colors',
    };
  }

  // Calculate contrast ratio
  const ratio = getContrastRatio(fgColor, bgColor);
  
  // Get font size and weight
  const fontSize = parseFloat(styles.fontSize);
  const fontWeight = styles.fontWeight;
  const largeText = isLargeText(fontSize, fontWeight);
  
  // Check WCAG compliance
  const aaThreshold = largeText ? WCAG_CONTRAST.AA.large : WCAG_CONTRAST.AA.normal;
  const aaaThreshold = largeText ? WCAG_CONTRAST.AAA.large : WCAG_CONTRAST.AAA.normal;
  
  const passesAA = ratio >= aaThreshold;
  const passesAAA = ratio >= aaaThreshold;
  
  // Generate recommendation if fails
  let recommendation: string | undefined;
  if (!passesAA) {
    const requiredRatio = aaThreshold;
    recommendation = `Contrast ratio ${ratio.toFixed(2)} is below WCAG AA requirement of ${requiredRatio}`;
  }
  
  return {
    element,
    foreground,
    background,
    ratio,
    passesAA,
    passesAAA,
    fontSize,
    fontWeight,
    isLargeText: largeText,
    recommendation,
  };
}

/**
 * Get effective background color of an element (traversing up the DOM if needed)
 */
export function getEffectiveBackgroundColor(element: HTMLElement): string {
  let currentElement: HTMLElement | null = element;
  
  while (currentElement) {
    const styles = window.getComputedStyle(currentElement);
    const bgColor = styles.backgroundColor;
    
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      return bgColor;
    }
    
    currentElement = currentElement.parentElement;
  }
  
  // Default to white if no background color found
  return 'white';
}

/**
 * Test all text elements in a container for contrast
 */
export function testContainerContrast(
  container: HTMLElement = document.body
): ElementContrastResult[] {
  const results: ElementContrastResult[] = [];
  const textElements = container.querySelectorAll<HTMLElement>(
    'p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, li, td, th'
  );
  
  textElements.forEach((element) => {
    // Skip if element has no text content
    if (!element.textContent?.trim()) return;
    
    // Skip if element is hidden
    if (element.offsetParent === null) return;
    
    const result = testElementContrast(element);
    results.push(result);
  });
  
  return results;
}

/**
 * Generate contrast report
 */
export function generateContrastReport(results: ElementContrastResult[]): {
  summary: {
    total: number;
    passesAA: number;
    passesAAA: number;
    failures: number;
  };
  failures: ElementContrastResult[];
  warnings: ElementContrastResult[];
} {
  const failures = results.filter((r) => !r.passesAA);
  const warnings = results.filter((r) => r.passesAA && !r.passesAAA);
  
  return {
    summary: {
      total: results.length,
      passesAA: results.filter((r) => r.passesAA).length,
      passesAAA: results.filter((r) => r.passesAAA).length,
      failures: failures.length,
    },
    failures,
    warnings,
  };
}

/**
 * Suggest color adjustments to meet contrast requirements
 */
export function suggestColorAdjustment(
  foreground: string,
  background: string,
  targetRatio: number = WCAG_CONTRAST.AA.normal
): {
  original: { foreground: string; background: string; ratio: number };
  suggestion: { foreground?: string; background?: string; ratio: number };
} {
  const fgColor = parseColor(foreground);
  const bgColor = parseColor(background);
  
  if (!fgColor || !bgColor) {
    return {
      original: { foreground, background, ratio: 0 },
      suggestion: { ratio: 0 },
    };
  }
  
  const originalRatio = getContrastRatio(fgColor, bgColor);
  
  if (originalRatio >= targetRatio) {
    return {
      original: { foreground, background, ratio: originalRatio },
      suggestion: { ratio: originalRatio },
    };
  }
  
  // Try darkening the foreground
  const darkerFg = {
    r: Math.max(0, fgColor.r - 50),
    g: Math.max(0, fgColor.g - 50),
    b: Math.max(0, fgColor.b - 50),
  };
  
  const darkerRatio = getContrastRatio(darkerFg, bgColor);
  
  if (darkerRatio >= targetRatio) {
    return {
      original: { foreground, background, ratio: originalRatio },
      suggestion: {
        foreground: `rgb(${darkerFg.r}, ${darkerFg.g}, ${darkerFg.b})`,
        ratio: darkerRatio,
      },
    };
  }
  
  // Try lightening the background
  const lighterBg = {
    r: Math.min(255, bgColor.r + 50),
    g: Math.min(255, bgColor.g + 50),
    b: Math.min(255, bgColor.b + 50),
  };
  
  const lighterRatio = getContrastRatio(fgColor, lighterBg);
  
  return {
    original: { foreground, background, ratio: originalRatio },
    suggestion: {
      background: `rgb(${lighterBg.r}, ${lighterBg.g}, ${lighterBg.b})`,
      ratio: lighterRatio,
    },
  };
}