/**
 * Button Component Accessibility Tests
 * Comprehensive accessibility testing for Button component across all themes and densities
 */

import { test, expect } from '@playwright/test';
import { 
  setupAxe, 
  checkAccessibility, 
  testThemeAccessibility,
  testDensityAccessibility,
  testInteractiveStateAccessibility 
} from '../../src/playwright/axe-playwright';
import { 
  testTabOrder,
  testKeyboardShortcuts,
  testFocusVisible 
} from '../../src/playwright/keyboard-playwright';
import { 
  testAllInteractiveStatesVisual 
} from '../../src/playwright/visual-regression';
import { createStorybookTestSuite } from '../../src/playwright/storybook-helpers';

const storybook = createStorybookTestSuite();
const BUTTON_STORY_ID = 'primitives-button--default';

test.describe('Button Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await storybook.gotoStory(page, BUTTON_STORY_ID);
  });

  test('meets WCAG 2.1 AA standards', async ({ page }) => {
    await checkAccessibility(page, {
      standard: 'AA',
      failOnViolations: true,
      detailedReport: true,
    });
  });

  test('accessible across all themes', async ({ page }) => {
    const results = await testThemeAccessibility(page, ['light', 'dark', 'highContrast']);
    
    Object.entries(results).forEach(([theme, result]) => {
      expect(result.violations, `${theme} theme should have no violations`).toHaveLength(0);
    });
  });

  test('accessible across all densities', async ({ page }) => {
    const results = await testDensityAccessibility(page, ['compact', 'comfortable', 'spacious']);
    
    Object.entries(results).forEach(([density, result]) => {
      expect(result.violations, `${density} density should have no violations`).toHaveLength(0);
    });
  });

  test('keyboard navigation works correctly', async ({ page }) => {
    const button = page.locator('[data-testid="button"]').first();
    
    // Test tab navigation
    const tabResult = await testTabOrder(page, ['button']);
    expect(tabResult.passed, 'Tab navigation should work').toBe(true);
    
    // Test button activation
    await button.focus();
    
    // Test Space key activation
    let activated = false;
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="button"]');
      if (btn) {
        btn.addEventListener('click', () => { (window as any).buttonActivated = true; });
      }
    });
    
    await page.keyboard.press('Space');
    activated = await page.evaluate(() => (window as any).buttonActivated);
    expect(activated, 'Space key should activate button').toBe(true);
    
    // Reset and test Enter key
    await page.evaluate(() => { (window as any).buttonActivated = false; });
    await page.keyboard.press('Enter');
    activated = await page.evaluate(() => (window as any).buttonActivated);
    expect(activated, 'Enter key should activate button').toBe(true);
  });

  test('focus indicators are visible', async ({ page }) => {
    const results = await testFocusVisible(page, ['[data-testid="button"]']);
    
    Object.entries(results).forEach(([selector, result]) => {
      expect(result.passed, `Focus indicator should be visible for ${selector}`).toBe(true);
    });
  });

  test('interactive states are accessible', async ({ page }) => {
    const results = await testInteractiveStateAccessibility(
      page, 
      '[data-testid="button"]'
    );
    
    expect(results.default.violations, 'Default state should be accessible').toHaveLength(0);
    expect(results.hover.violations, 'Hover state should be accessible').toHaveLength(0);
    expect(results.focus.violations, 'Focus state should be accessible').toHaveLength(0);
    
    if (results.active) {
      expect(results.active.violations, 'Active state should be accessible').toHaveLength(0);
    }
  });

  test('disabled state is properly announced', async ({ page }) => {
    // Test with disabled button
    await storybook.gotoStory(page, BUTTON_STORY_ID, { 
      args: { disabled: true } 
    });
    
    await checkAccessibility(page, {
      disableRules: ['color-contrast'], // Disabled buttons may have reduced contrast
    });
    
    // Verify disabled button is not in tab order
    const disabledButton = page.locator('[data-testid="button"][disabled]');
    await expect(disabledButton).toHaveAttribute('disabled');
    await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    
    // Verify it's not focusable
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).not.toBe(disabledButton);
  });

  test('loading state is accessible', async ({ page }) => {
    await storybook.gotoStory(page, BUTTON_STORY_ID, { 
      args: { loading: true } 
    });
    
    await checkAccessibility(page);
    
    const button = page.locator('[data-testid="button"]');
    
    // Should have aria-disabled or disabled attribute
    const isDisabled = await button.evaluate(el => 
      el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
    );
    expect(isDisabled, 'Loading button should be disabled').toBe(true);
    
    // Should have appropriate aria-label or aria-describedby for loading state
    const hasLoadingLabel = await button.evaluate(el => {
      const label = el.getAttribute('aria-label') || '';
      const describedBy = el.getAttribute('aria-describedby');
      const description = describedBy ? 
        document.getElementById(describedBy)?.textContent || '' : '';
      
      return label.includes('loading') || 
             label.includes('Loading') || 
             description.includes('loading') || 
             description.includes('Loading');
    });
    
    expect(hasLoadingLabel, 'Loading state should be announced to screen readers').toBe(true);
  });

  test('icon-only button has accessible name', async ({ page }) => {
    await storybook.gotoStory(page, 'primitives-button--icon-only');
    
    await checkAccessibility(page);
    
    const button = page.locator('[data-testid="button"]');
    
    // Should have aria-label
    await expect(button).toHaveAttribute('aria-label');
    
    const ariaLabel = await button.getAttribute('aria-label');
    expect(ariaLabel, 'Icon button should have meaningful aria-label').toBeTruthy();
    expect(ariaLabel.length, 'Aria-label should be descriptive').toBeGreaterThan(3);
  });

  test('button in different sizes maintains accessibility', async ({ page }) => {
    const sizes = ['small', 'medium', 'large'];
    
    for (const size of sizes) {
      await storybook.gotoStory(page, BUTTON_STORY_ID, { 
        args: { size } 
      });
      
      await checkAccessibility(page, {
        disableRules: ['target-size'], // We'll check this manually
      });
      
      // Check minimum target size (44x44px for touch)
      const buttonSize = await page.locator('[data-testid="button"]').evaluate(el => {
        const rect = el.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
      
      // Small buttons might be below 44px but should still be reasonable
      if (size !== 'small') {
        expect(buttonSize.width, `${size} button width should meet minimum target size`).toBeGreaterThanOrEqual(44);
        expect(buttonSize.height, `${size} button height should meet minimum target size`).toBeGreaterThanOrEqual(44);
      } else {
        // Even small buttons should be at least 32x32
        expect(buttonSize.width, 'Small button width should be reasonable').toBeGreaterThanOrEqual(32);
        expect(buttonSize.height, 'Small button height should be reasonable').toBeGreaterThanOrEqual(32);
      }
    }
  });

  test('button variants maintain accessibility', async ({ page }) => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];
    
    for (const variant of variants) {
      await storybook.gotoStory(page, BUTTON_STORY_ID, { 
        args: { variant } 
      });
      
      // Each variant should pass accessibility tests
      await checkAccessibility(page, {
        standard: 'AA',
        theme: 'light',
      });
      
      // Test in dark theme for better contrast validation
      await storybook.gotoStory(page, BUTTON_STORY_ID, { 
        args: { variant },
        theme: 'dark'
      });
      
      await checkAccessibility(page, {
        standard: 'AA',
        theme: 'dark',
      });
      
      // Test focus visibility for each variant
      const focusResult = await testFocusVisible(page, ['[data-testid="button"]']);
      expect(focusResult['[data-testid="button"]'].passed, 
        `${variant} variant should have visible focus indicator`
      ).toBe(true);
    }
  });

  test('button with custom colors meets contrast requirements', async ({ page }) => {
    // Test button with custom styling that might affect contrast
    await page.addStyleTag({
      content: `
        [data-testid="button"] {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        [data-testid="button"]:hover {
          background-color: #0056b3;
          border-color: #004085;
        }
        [data-testid="button"]:focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          outline: none;
        }
      `
    });
    
    await storybook.gotoStory(page, BUTTON_STORY_ID);
    
    // Should still pass accessibility tests with custom colors
    await checkAccessibility(page, {
      standard: 'AA',
    });
  });
});

test.describe('Button Visual Regression (Accessibility Focus)', () => {
  test('focus states across themes', async ({ page }) => {
    await storybook.gotoStory(page, BUTTON_STORY_ID);
    
    await testAllInteractiveStatesVisual(
      page, 
      'button-states', 
      '[data-testid="button"]',
      { threshold: 0.1 }
    );
  });

  test('high contrast mode rendering', async ({ page }) => {
    // Test button in high contrast mode
    await page.emulateMedia({ 'prefers-contrast': 'high' });
    await storybook.gotoStory(page, BUTTON_STORY_ID, { theme: 'highContrast' });
    
    await expect(page).toHaveScreenshot('button-high-contrast.png', {
      threshold: 0.1,
      maxDiffPixels: 100,
    });
  });

  test('reduced motion compliance', async ({ page }) => {
    await page.emulateMedia({ 'prefers-reduced-motion': 'reduce' });
    await storybook.gotoStory(page, BUTTON_STORY_ID);
    
    // Focus the button to trigger any animations
    await page.locator('[data-testid="button"]').focus();
    
    await expect(page).toHaveScreenshot('button-reduced-motion.png', {
      threshold: 0.1,
      animations: 'disabled',
    });
  });
});