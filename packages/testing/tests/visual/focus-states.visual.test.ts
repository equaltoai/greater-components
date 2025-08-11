/**
 * Focus States Visual Regression Tests
 * Ensures consistent focus indicators across all components and themes
 */

import { test, expect } from '@playwright/test';
import { 
  testFocusStateVisual,
  testAllInteractiveStatesVisual,
  testHighContrastVisual,
  testReducedMotionVisual
} from '../../src/playwright/visual-regression';
import { createStorybookTestSuite } from '../../src/playwright/storybook-helpers';

const storybook = createStorybookTestSuite();

const COMPONENTS_TO_TEST = [
  { id: 'primitives-button--default', name: 'Button' },
  { id: 'primitives-textfield--default', name: 'TextField' },
  { id: 'primitives-menu--default', name: 'Menu' },
  { id: 'primitives-tabs--default', name: 'Tabs' },
  { id: 'primitives-modal--default', name: 'Modal' },
];

test.describe('Focus State Visual Regression', () => {
  COMPONENTS_TO_TEST.forEach(({ id, name }) => {
    test(`${name} focus states`, async ({ page }) => {
      await storybook.gotoStory(page, id);
      
      // Wait for component to be ready
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      const selector = '[data-testid]:visible';
      const elements = await page.locator(selector).count();
      
      if (elements > 0) {
        await testFocusStateVisual(
          page,
          `${name.toLowerCase()}-focus`,
          {
            focusSelector: selector,
            interactionType: 'keyboard',
            threshold: 0.1,
            maxDiffPixels: 100,
            animations: 'disabled',
          }
        );
      }
    });

    test(`${name} all interactive states`, async ({ page }) => {
      await storybook.gotoStory(page, id);
      await page.waitForLoadState('networkidle');
      
      const selector = '[data-testid]:visible';
      const elements = await page.locator(selector).count();
      
      if (elements > 0) {
        await testAllInteractiveStatesVisual(
          page,
          `${name.toLowerCase()}-states`,
          selector,
          {
            threshold: 0.1,
            maxDiffPixels: 100,
            animations: 'disabled',
          }
        );
      }
    });

    test(`${name} high contrast mode`, async ({ page }) => {
      await storybook.gotoStory(page, id, { theme: 'highContrast' });
      await page.waitForLoadState('networkidle');
      
      await testHighContrastVisual(
        page,
        `${name.toLowerCase()}-high-contrast`,
        {
          threshold: 0.1,
          maxDiffPixels: 200, // Higher threshold for high contrast mode
        }
      );
    });

    test(`${name} reduced motion`, async ({ page }) => {
      await storybook.gotoStory(page, id, { reducedMotion: true });
      await page.waitForLoadState('networkidle');
      
      await testReducedMotionVisual(
        page,
        `${name.toLowerCase()}-reduced-motion`,
        {
          threshold: 0.1,
          animations: 'disabled',
        }
      );
    });
  });

  test('Focus ring consistency across themes', async ({ page }) => {
    const themes = ['light', 'dark', 'highContrast'];
    
    for (const theme of themes) {
      await storybook.gotoStory(page, 'primitives-button--default', { theme });
      
      const button = page.locator('[data-testid="button"]');
      await button.focus();
      
      // Take screenshot of focused button in each theme
      await expect(page).toHaveScreenshot(`focus-ring-${theme}.png`, {
        threshold: 0.1,
        clip: { x: 0, y: 0, width: 200, height: 100 },
      });
    }
  });

  test('Focus order visual validation', async ({ page }) => {
    // Test a complex component with multiple focusable elements
    await storybook.gotoStory(page, 'primitives-modal--with-form');
    await page.waitForLoadState('networkidle');
    
    // Open modal
    const trigger = page.locator('[data-testid="modal-trigger"]');
    if (await trigger.count() > 0) {
      await trigger.click();
      await page.waitForTimeout(500);
    }
    
    // Take screenshots as we tab through elements
    const focusableElements = await page.locator('[data-testid]:visible').count();
    
    for (let i = 0; i < Math.min(focusableElements, 5); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot(`focus-order-step-${i + 1}.png`, {
        threshold: 0.1,
        animations: 'disabled',
      });
    }
  });

  test('Keyboard navigation visual feedback', async ({ page }) => {
    await storybook.gotoStory(page, 'primitives-menu--default');
    await page.waitForLoadState('networkidle');
    
    // Open menu
    const menuButton = page.locator('[data-testid="menu-button"]');
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await page.waitForTimeout(300);
      
      // Navigate with arrow keys
      await page.keyboard.press('ArrowDown');
      await expect(page).toHaveScreenshot('menu-arrow-navigation-1.png', {
        threshold: 0.1,
      });
      
      await page.keyboard.press('ArrowDown');
      await expect(page).toHaveScreenshot('menu-arrow-navigation-2.png', {
        threshold: 0.1,
      });
    }
  });
});

test.describe('Density Visual Regression', () => {
  const densities = ['compact', 'comfortable', 'spacious'];
  
  COMPONENTS_TO_TEST.forEach(({ id, name }) => {
    densities.forEach(density => {
      test(`${name} ${density} density focus`, async ({ page }) => {
        await storybook.gotoStory(page, id, { density });
        await page.waitForLoadState('networkidle');
        
        const selector = '[data-testid]:visible';
        const element = page.locator(selector).first();
        
        if (await element.count() > 0) {
          await element.focus();
          
          await expect(page).toHaveScreenshot(`${name.toLowerCase()}-${density}-focus.png`, {
            threshold: 0.1,
            animations: 'disabled',
          });
        }
      });
    });
  });

  test('Density comparison grid', async ({ page }) => {
    // Create a comparison view of all densities
    await page.setContent(`
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; padding: 2rem;">
        <div id="compact-container">
          <h3>Compact</h3>
          <div id="compact-story"></div>
        </div>
        <div id="comfortable-container">
          <h3>Comfortable</h3>
          <div id="comfortable-story"></div>
        </div>
        <div id="spacious-container">
          <h3>Spacious</h3>
          <div id="spacious-story"></div>
        </div>
      </div>
    `);
    
    // This would need custom implementation to load multiple stories
    // For now, take a screenshot of the grid layout
    await expect(page).toHaveScreenshot('density-comparison-grid.png', {
      threshold: 0.1,
      fullPage: true,
    });
  });
});

test.describe('Responsive Focus States', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];
  
  viewports.forEach(viewport => {
    test(`Button focus at ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await storybook.gotoStory(page, 'primitives-button--default');
      
      const button = page.locator('[data-testid="button"]');
      await button.focus();
      
      await expect(page).toHaveScreenshot(`button-focus-${viewport.name}.png`, {
        threshold: 0.1,
        animations: 'disabled',
      });
    });
  });

  test('Touch target size visualization', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Add overlay to visualize 44x44px touch targets
    await page.addStyleTag({
      content: `
        [data-testid]:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 44px;
          height: 44px;
          border: 2px dashed rgba(255, 0, 0, 0.5);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
      `
    });
    
    await storybook.gotoStory(page, 'primitives-button--small');
    
    await expect(page).toHaveScreenshot('touch-target-visualization.png', {
      threshold: 0.1,
    });
  });
});

test.describe('Animation and Motion Accessibility', () => {
  test('Reduced motion preference honored', async ({ page }) => {
    await page.emulateMedia({ 'prefers-reduced-motion': 'reduce' });
    
    // Test component with animations
    await storybook.gotoStory(page, 'primitives-modal--animated');
    await page.waitForLoadState('networkidle');
    
    const trigger = page.locator('[data-testid="modal-trigger"]');
    if (await trigger.count() > 0) {
      // Capture before opening
      await expect(page).toHaveScreenshot('modal-before-reduced-motion.png');
      
      await trigger.click();
      
      // Animation should be instant or very fast
      await page.waitForTimeout(50);
      await expect(page).toHaveScreenshot('modal-after-reduced-motion.png');
    }
  });

  test('Focus animations respect motion preferences', async ({ page }) => {
    await page.emulateMedia({ 'prefers-reduced-motion': 'reduce' });
    
    await storybook.gotoStory(page, 'primitives-button--default');
    
    const button = page.locator('[data-testid="button"]');
    
    // Focus should still be visible even with reduced motion
    await button.focus();
    
    await expect(page).toHaveScreenshot('focus-reduced-motion.png', {
      threshold: 0.1,
      animations: 'disabled',
    });
  });
});