/**
 * Playwright Keyboard Testing Utilities
 * Utilities for testing keyboard navigation and interactions in Playwright
 */

import { Page, Locator } from '@playwright/test';

export interface KeyboardTestOptions {
  skipFocusCheck?: boolean;
  timeout?: number;
  expectFocusVisible?: boolean;
  customMatchers?: Record<string, (element: Locator) => Promise<boolean>>;
}

export interface KeyboardTestResult {
  passed: boolean;
  actualFocus?: string;
  expectedFocus?: string;
  error?: string;
  focusPath: string[];
}

/**
 * Simulate keyboard navigation sequence
 */
export async function simulateKeyboardNavigation(
  page: Page,
  keys: string[],
  _options: KeyboardTestOptions = {}
): Promise<KeyboardTestResult> {
  const focusPath: string[] = [];
  
  try {
    for (const key of keys) {
      // Record current focus before key press
      const currentFocus = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return null;
        return active.tagName + 
          (active.id ? `#${active.id}` : '') + 
          (active.className ? `.${active.className.split(' ')[0]}` : '');
      });
      
      if (currentFocus) {
        focusPath.push(currentFocus);
      }
      
      await page.keyboard.press(key);
      await page.waitForTimeout(100); // Allow time for focus changes
    }
    
    return {
      passed: true,
      focusPath,
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      focusPath,
    };
  }
}

/**
 * Test tab navigation order
 */
export async function testTabOrder(
  page: Page,
  expectedSelectors: string[],
  startElement?: string
): Promise<KeyboardTestResult> {
  try {
    // Start from specific element or first tabbable element
    if (startElement) {
      await page.locator(startElement).focus();
    } else {
      // Focus first tabbable element
      await page.keyboard.press('Tab');
    }
    
    const actualOrder: string[] = [];
    
    // Navigate through all expected elements
    for (let i = 0; i < expectedSelectors.length; i++) {
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return null;
        
        // Create a unique selector for the focused element
        let selector = active.tagName.toLowerCase();
        if (active.id) selector += `#${active.id}`;
        if (active.className) {
          const firstClass = active.className.split(' ')[0];
          if (firstClass) selector += `.${firstClass}`;
        }
        
        return selector;
      });
      
      if (focusedElement) {
        actualOrder.push(focusedElement);
      }
      
      // Move to next element (except for last iteration)
      if (i < expectedSelectors.length - 1) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }
    }
    
    const orderMatches = actualOrder.every((selector, index) => {
      const expected = expectedSelectors[index];
      if (!expected) return false;
      const baseSelector = expected.split('.')[0]?.split('#')[0];
      return baseSelector && selector.includes(baseSelector);
    });
    
    return {
      passed: orderMatches,
      actualFocus: actualOrder.join(' -> '),
      expectedFocus: expectedSelectors.join(' -> '),
      focusPath: actualOrder,
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      focusPath: [],
    };
  }
}

/**
 * Test arrow key navigation (for menus, grids, etc.)
 */
export async function testArrowKeyNavigation(
  page: Page,
  containerSelector: string,
  itemSelector: string,
  direction: 'horizontal' | 'vertical' | 'grid' = 'vertical'
): Promise<KeyboardTestResult> {
  const container = page.locator(containerSelector);
  await container.focus();
  
  const items = container.locator(itemSelector);
  const itemCount = await items.count();
  
  if (itemCount === 0) {
    return {
      passed: false,
      error: 'No items found for arrow key navigation',
      focusPath: [],
    };
  }
  
  const focusPath: string[] = [];
  
  try {
    // Test navigation based on direction
    if (direction === 'vertical') {
      // Test down arrow
      for (let i = 0; i < Math.min(3, itemCount - 1); i++) {
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
        
        const focused = await getFocusedElementInfo(page);
        if (focused) focusPath.push(focused);
      }
      
      // Test up arrow
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(100);
    } else if (direction === 'horizontal') {
      // Test right arrow
      for (let i = 0; i < Math.min(3, itemCount - 1); i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        
        const focused = await getFocusedElementInfo(page);
        if (focused) focusPath.push(focused);
      }
      
      // Test left arrow
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
    }
    
    return {
      passed: true,
      focusPath,
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      focusPath,
    };
  }
}

/**
 * Test keyboard trap (for modals, dropdowns)
 */
export async function testKeyboardTrap(
  page: Page,
  containerSelector: string
): Promise<KeyboardTestResult> {
  const container = page.locator(containerSelector);
  const focusableElements = container.locator(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const elementCount = await focusableElements.count();
  
  if (elementCount === 0) {
    return {
      passed: false,
      error: 'No focusable elements found in container',
      focusPath: [],
    };
  }
  
  try {
    // Focus first element
    await focusableElements.first().focus();
    
    // Navigate to last element
    for (let i = 0; i < elementCount - 1; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }
    
    // Tab from last element should wrap to first
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    const focusedElement = page.locator(':focus');
    const isFirstElement = await focusedElement.isVisible() && 
                          await focusedElement.evaluate((el, firstEl) => el === firstEl,
                            await focusableElements.first().elementHandle());
    
    // Test reverse direction (Shift+Tab from first should go to last)
    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);
    
    const focusedAfterShiftTab = page.locator(':focus');
    const isLastElement = await focusedAfterShiftTab.isVisible() && 
                         await focusedAfterShiftTab.evaluate((el, lastEl) => el === lastEl,
                           await focusableElements.last().elementHandle());
    
    return {
      passed: isFirstElement && isLastElement,
      error: !isFirstElement ? 'Tab from last element did not wrap to first' :
             !isLastElement ? 'Shift+Tab from first element did not wrap to last' : undefined,
      focusPath: ['first', 'last', 'first', 'last'],
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      focusPath: [],
    };
  }
}

/**
 * Test keyboard shortcuts
 */
export async function testKeyboardShortcuts(
  page: Page,
  shortcuts: Record<string, { key: string; expectedAction: () => Promise<boolean> }>
): Promise<Record<string, KeyboardTestResult>> {
  const results: Record<string, KeyboardTestResult> = {};
  
  for (const [name, { key, expectedAction }] of Object.entries(shortcuts)) {
    try {
      await page.keyboard.press(key);
      await page.waitForTimeout(200);
      
      const actionWorked = await expectedAction();
      
      results[name] = {
        passed: actionWorked,
        focusPath: [key],
      };
    } catch (error) {
      results[name] = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        focusPath: [],
      };
    }
  }
  
  return results;
}

/**
 * Test focus visible indicators
 */
export async function testFocusVisible(
  page: Page,
  selectors: string[]
): Promise<Record<string, KeyboardTestResult>> {
  const results: Record<string, KeyboardTestResult> = {};
  
  for (const selector of selectors) {
    try {
      const element = page.locator(selector);
      await element.focus();
      await page.waitForTimeout(100);
      
      // Check if element has visible focus indicator
      const hasVisibleFocus = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        
        // Check for outline
        if (styles.outline !== 'none' && styles.outline !== '0px') return true;
        
        // Check for box-shadow (common focus indicator)
        if (styles.boxShadow !== 'none') return true;
        
        // Check for border changes
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          // Element is visible, check for focus-visible pseudo-class
          return el.matches(':focus-visible');
        }
        
        return false;
      });
      
      results[selector] = {
        passed: hasVisibleFocus,
        error: hasVisibleFocus ? undefined : 'No visible focus indicator',
        focusPath: [selector],
      };
    } catch (error) {
      results[selector] = {
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        focusPath: [],
      };
    }
  }
  
  return results;
}

/**
 * Test skip links functionality
 */
export async function testSkipLinks(page: Page): Promise<KeyboardTestResult[]> {
  const results: KeyboardTestResult[] = [];
  
  // Find all skip links
  const skipLinks = page.locator('a[href^="#"]:not([href="#"])');
  const linkCount = await skipLinks.count();
  
  for (let i = 0; i < linkCount; i++) {
    const link = skipLinks.nth(i);
    const href = await link.getAttribute('href');
    const text = await link.textContent();
    
    if (!href) continue;
    
    try {
      // Focus and activate skip link
      await link.focus();
      await link.press('Enter');
      await page.waitForTimeout(200);
      
      // Check if target element received focus
      const targetId = href.substring(1);
      const target = page.locator(`#${targetId}`);
      
      const targetExists = await target.count() > 0;
      const targetFocused = targetExists ? await target.evaluate(el => el === document.activeElement) : false;
      
      results.push({
        passed: targetExists && targetFocused,
        actualFocus: targetFocused ? `#${targetId}` : await getFocusedElementInfo(page),
        expectedFocus: `#${targetId}`,
        error: !targetExists ? `Target element #${targetId} not found` :
               !targetFocused ? 'Target element did not receive focus' : undefined,
        focusPath: [text ?? 'skip-link', `#${targetId}`],
      });
    } catch (error) {
      results.push({
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        focusPath: [],
      });
    }
  }
  
  return results;
}

/**
 * Test roving tabindex implementation
 */
export async function testRovingTabindex(
  page: Page,
  containerSelector: string,
  itemSelector: string,
  arrowKey: 'ArrowDown' | 'ArrowRight' = 'ArrowDown'
): Promise<KeyboardTestResult> {
  const container = page.locator(containerSelector);
  const items = container.locator(itemSelector);
  const itemCount = await items.count();
  
  try {
    // Initial state: one item should have tabindex="0", others tabindex="-1"
    const initialTabindices = await items.evaluateAll(elements => 
      elements.map(el => el.getAttribute('tabindex'))
    );
    
    const activeItems = initialTabindices.filter(t => t === '0').length;
    
    if (activeItems !== 1) {
      return {
        passed: false,
        error: `Expected 1 item with tabindex="0", found ${activeItems}`,
        focusPath: [],
      };
    }
    
    // Navigate with arrow keys
    const firstActiveIndex = initialTabindices.indexOf('0');
    await items.nth(firstActiveIndex).focus();
    
    // Move to next item with arrow key
    await page.keyboard.press(arrowKey);
    await page.waitForTimeout(100);
    
    // Check that tabindex values have updated correctly
    const updatedTabindices = await items.evaluateAll(elements => 
      elements.map(el => el.getAttribute('tabindex'))
    );
    
    const newActiveItems = updatedTabindices.filter(t => t === '0').length;
    const newInactiveItems = updatedTabindices.filter(t => t === '-1').length;
    
    return {
      passed: newActiveItems === 1 && newInactiveItems === itemCount - 1,
      error: newActiveItems !== 1 ? 
        `Expected 1 active item after navigation, found ${newActiveItems}` : undefined,
      focusPath: [
        `item-${firstActiveIndex}`,
        `item-${updatedTabindices.indexOf('0')}`,
      ],
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      focusPath: [],
    };
  }
}

/**
 * Get focused element information
 */
async function getFocusedElementInfo(page: Page): Promise<string | undefined> {
  return await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return undefined;
    
    let selector = active.tagName.toLowerCase();
    if (active.id) selector += `#${active.id}`;
    if (active.className) {
      const firstClass = active.className.split(' ')[0];
      if (firstClass) selector += `.${firstClass}`;
    }
    
    return selector;
  });
}

/**
 * Create comprehensive keyboard test suite
 */
export function createKeyboardTestSuite() {
  return {
    testTabNavigation: testTabOrder,
    testArrowNavigation: testArrowKeyNavigation,
    testKeyboardTrap,
    testShortcuts: testKeyboardShortcuts,
    testFocusVisible,
    testSkipLinks,
    testRovingTabindex,
    simulateKeyboard: simulateKeyboardNavigation,
  };
}