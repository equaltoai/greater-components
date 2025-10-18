/**
 * Visual Regression Testing Utilities
 * Utilities for accessibility-focused visual regression testing
 */

import { Page, expect, Locator } from '@playwright/test';

export interface VisualTestOptions {
  threshold?: number;
  maxDiffPixels?: number;
  animations?: 'disabled' | 'allow';
  clip?: { x: number; y: number; width: number; height: number };
  fullPage?: boolean;
  mask?: Locator[];
  mode?: 'light' | 'dark' | 'high-contrast';
  density?: 'compact' | 'comfortable' | 'spacious';
}

export interface FocusVisualTestOptions extends VisualTestOptions {
  focusSelector: string;
  interactionType?: 'keyboard' | 'programmatic';
}

type DisableableElement = HTMLElement & { disabled?: boolean };

/**
 * Test focus state visual appearance
 */
export async function testFocusStateVisual(
  page: Page,
  testName: string,
  options: FocusVisualTestOptions
): Promise<void> {
  const {
    focusSelector,
    interactionType = 'keyboard',
    threshold = 0.1,
    ...visualOptions
  } = options;
  
  // Disable animations for consistent screenshots
  if (visualOptions.animations === 'disabled') {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });
  }
  
  const element = page.locator(focusSelector);
  
  // Take screenshot in default state
  await expect(page).toHaveScreenshot(`${testName}-default.png`, {
    threshold,
    ...visualOptions,
  });
  
  // Focus element and take screenshot
  if (interactionType === 'keyboard') {
    await page.keyboard.press('Tab');
    // Navigate to the specific element (simplified - would need better logic)
    await element.focus();
  } else {
    await element.focus();
  }
  
  await page.waitForTimeout(100); // Allow focus styles to apply
  
  await expect(page).toHaveScreenshot(`${testName}-focused.png`, {
    threshold,
    ...visualOptions,
  });
}

/**
 * Test hover state visual appearance
 */
export async function testHoverStateVisual(
  page: Page,
  testName: string,
  selector: string,
  options: VisualTestOptions = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  const element = page.locator(selector);
  
  // Default state
  await expect(page).toHaveScreenshot(`${testName}-default.png`, {
    threshold,
    ...options,
  });
  
  // Hover state
  await element.hover();
  await page.waitForTimeout(100);
  
  await expect(page).toHaveScreenshot(`${testName}-hover.png`, {
    threshold,
    ...options,
  });
}

/**
 * Test active/pressed state visual appearance
 */
export async function testActiveStateVisual(
  page: Page,
  testName: string,
  selector: string,
  options: VisualTestOptions = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  const element = page.locator(selector);
  
  // Focus element first
  await element.focus();
  await page.waitForTimeout(100);
  
  // Mouse down to activate
  await element.hover();
  await page.mouse.down();
  await page.waitForTimeout(100);
  
  await expect(page).toHaveScreenshot(`${testName}-active.png`, {
    threshold,
    ...options,
  });
  
  await page.mouse.up();
}

/**
 * Test disabled state visual appearance
 */
export async function testDisabledStateVisual(
  page: Page,
  testName: string,
  selector: string,
  options: VisualTestOptions = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  const element = page.locator(selector);
  
  // Enable state (if applicable)
  await element.evaluate((el) => {
    if ('disabled' in el) {
      const disableable = el as DisableableElement;
      if (typeof disableable.disabled === 'boolean') {
        disableable.disabled = false;
      }
    }
    el.removeAttribute('disabled');
    el.removeAttribute('aria-disabled');
  });
  
  await expect(page).toHaveScreenshot(`${testName}-enabled.png`, {
    threshold,
    ...options,
  });
  
  // Disabled state
  await element.evaluate((el) => {
    if ('disabled' in el) {
      const disableable = el as DisableableElement;
      if (typeof disableable.disabled === 'boolean') {
        disableable.disabled = true;
      }
    } else {
      el.setAttribute('aria-disabled', 'true');
    }
  });
  
  await expect(page).toHaveScreenshot(`${testName}-disabled.png`, {
    threshold,
    ...options,
  });
}

/**
 * Test high contrast mode visual appearance
 */
export async function testHighContrastVisual(
  page: Page,
  testName: string,
  options: Omit<VisualTestOptions, 'mode'> = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  // Normal mode
  await expect(page).toHaveScreenshot(`${testName}-normal.png`, {
    threshold,
    ...options,
  });
  
  // High contrast mode
  await page.addStyleTag({
    content: `
      @media (prefers-contrast: high) {
        :root {
          --high-contrast: true;
        }
      }
    `,
  });
  
  await page.emulateMedia({ contrast: 'more' });
  await page.waitForTimeout(200);
  
  await expect(page).toHaveScreenshot(`${testName}-high-contrast.png`, {
    threshold,
    ...options,
  });
}

/**
 * Test reduced motion visual appearance
 */
export async function testReducedMotionVisual(
  page: Page,
  testName: string,
  options: VisualTestOptions = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  // Normal motion
  await expect(page).toHaveScreenshot(`${testName}-normal-motion.png`, {
    threshold,
    ...options,
  });
  
  // Reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(200);
  
  await expect(page).toHaveScreenshot(`${testName}-reduced-motion.png`, {
    threshold,
    ...options,
  });
}

/**
 * Test different density modes
 */
export async function testDensityVisual(
  page: Page,
  testName: string,
  densities: ('compact' | 'comfortable' | 'spacious')[] = [
    'compact',
    'comfortable',
    'spacious',
  ],
  options: Omit<VisualTestOptions, 'density'> = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  for (const density of densities) {
    // Apply density
    await page.evaluate((densityName) => {
      document.documentElement.setAttribute('data-density', densityName);
    }, density);
    
    await page.waitForTimeout(200);
    
    await expect(page).toHaveScreenshot(`${testName}-${density}.png`, {
      threshold,
      ...options,
    });
  }
}

/**
 * Test color scheme variations
 */
export async function testColorSchemeVisual(
  page: Page,
  testName: string,
  schemes: ('light' | 'dark')[] = ['light', 'dark'],
  options: Omit<VisualTestOptions, 'mode'> = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  for (const scheme of schemes) {
    // Apply color scheme
    await page.emulateMedia({ colorScheme: scheme });
    await page.evaluate((schemeName) => {
      document.documentElement.setAttribute('data-theme', schemeName);
    }, scheme);
    
    await page.waitForTimeout(200);
    
    await expect(page).toHaveScreenshot(`${testName}-${scheme}.png`, {
      threshold,
      ...options,
    });
  }
}

/**
 * Test responsive breakpoints
 */
export async function testResponsiveVisual(
  page: Page,
  testName: string,
  breakpoints: { name: string; width: number; height: number }[] = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'wide', width: 1920, height: 1080 },
  ],
  options: VisualTestOptions = {}
): Promise<void> {
  const { threshold = 0.1 } = options;
  
  for (const breakpoint of breakpoints) {
    await page.setViewportSize({
      width: breakpoint.width,
      height: breakpoint.height,
    });
    
    await page.waitForTimeout(200);
    
    await expect(page).toHaveScreenshot(`${testName}-${breakpoint.name}.png`, {
      threshold,
      ...options,
    });
  }
}

/**
 * Comprehensive interactive state testing
 */
export async function testAllInteractiveStatesVisual(
  page: Page,
  testName: string,
  selector: string,
  options: VisualTestOptions = {}
): Promise<void> {
  const element = page.locator(selector);
  const { threshold = 0.1 } = options;
  
  // Default state
  await expect(page).toHaveScreenshot(`${testName}-default.png`, {
    threshold,
    ...options,
  });
  
  // Focus state
  await element.focus();
  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot(`${testName}-focus.png`, {
    threshold,
    ...options,
  });
  
  // Hover state
  await element.hover();
  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot(`${testName}-hover.png`, {
    threshold,
    ...options,
  });
  
  // Active state (if clickable)
  const isClickable = await element.evaluate((el) => {
    return (
      el.tagName === 'BUTTON' ||
      el.tagName === 'A' ||
      el.onclick !== null ||
      el.getAttribute('role') === 'button'
    );
  });
  
  if (isClickable) {
    await page.mouse.down();
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot(`${testName}-active.png`, {
      threshold,
      ...options,
    });
    await page.mouse.up();
  }
  
  // Disabled state (if applicable)
  const canBeDisabled = await element.evaluate((el) => {
    return 'disabled' in el || el.hasAttribute('aria-disabled');
  });
  
  if (canBeDisabled) {
    await element.evaluate((el) => {
      if ('disabled' in el) {
        const disableable = el as DisableableElement;
        if (typeof disableable.disabled === 'boolean') {
          disableable.disabled = true;
        }
      } else {
        el.setAttribute('aria-disabled', 'true');
      }
    });
    
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot(`${testName}-disabled.png`, {
      threshold,
      ...options,
    });
  }
}

/**
 * Create comprehensive visual regression test suite
 */
export function createVisualTestSuite() {
  return {
    testFocusState: testFocusStateVisual,
    testHoverState: testHoverStateVisual,
    testActiveState: testActiveStateVisual,
    testDisabledState: testDisabledStateVisual,
    testHighContrast: testHighContrastVisual,
    testReducedMotion: testReducedMotionVisual,
    testDensityModes: testDensityVisual,
    testColorSchemes: testColorSchemeVisual,
    testResponsive: testResponsiveVisual,
    testAllStates: testAllInteractiveStatesVisual,
  };
}
