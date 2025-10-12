/**
 * Playwright Page Helpers
 * Utilities for common page operations in accessibility testing
 */

import { Page } from '@playwright/test';

export interface PageSetupOptions {
  theme?: 'light' | 'dark' | 'high-contrast';
  density?: 'compact' | 'comfortable' | 'spacious';
  reducedMotion?: boolean;
  highContrast?: boolean;
  fontSize?: number;
  viewport?: { width: number; height: number };
  disableAnimations?: boolean;
}

/**
 * Setup page for accessibility testing
 */
export async function setupPageForA11yTesting(
  page: Page,
  options: PageSetupOptions = {}
): Promise<void> {
  const {
    theme = 'light',
    density = 'comfortable',
    reducedMotion = false,
    highContrast = false,
    fontSize,
    viewport,
    disableAnimations = true,
  } = options;
  
  // Set viewport if specified
  if (viewport) {
    await page.setViewportSize(viewport);
  }
  
  // Apply theme
  await page.addInitScript((themeValue) => {
    document.documentElement.setAttribute('data-theme', themeValue);
  }, theme);
  
  // Apply density
  await page.addInitScript((densityValue) => {
    document.documentElement.setAttribute('data-density', densityValue);
  }, density);
  
  // Apply reduced motion preference
  if (reducedMotion) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  }
  
  // Apply high contrast preference
  if (highContrast) {
    await page.emulateMedia({ contrast: 'more' });
  }
  
  // Disable animations for consistent testing
  if (disableAnimations) {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `,
    });
  }
  
  // Set custom font size if specified
  if (fontSize) {
    await page.addStyleTag({
      content: `
        html {
          font-size: ${fontSize}px !important;
        }
      `,
    });
  }
  
  // Add accessibility helper functions to page
  await page.addInitScript(() => {
    // Helper to get accessibility tree
    (window as any).getAccessibilityTree = () => {
      const getNodeInfo = (node: Element) => {
        const info: any = {
          tag: node.tagName.toLowerCase(),
          role: node.getAttribute('role') || null,
          name: null,
          description: null,
        };
        
        // Get accessible name
        if (node.hasAttribute('aria-label')) {
          info.name = node.getAttribute('aria-label');
        } else if (node.hasAttribute('aria-labelledby')) {
          const ids = node.getAttribute('aria-labelledby')?.split(' ') || [];
          info.name = ids.map(id => document.getElementById(id)?.textContent).join(' ');
        } else if (node.id) {
          const label = document.querySelector(`label[for="${node.id}"]`);
          if (label) info.name = label.textContent;
        }
        
        // Get accessible description
        if (node.hasAttribute('aria-describedby')) {
          const ids = node.getAttribute('aria-describedby')?.split(' ') || [];
          info.description = ids.map(id => document.getElementById(id)?.textContent).join(' ');
        }
        
        return info;
      };
      
      const traverse = (node: Element): any => {
        const info = getNodeInfo(node);
        const children = Array.from(node.children).map(traverse);
        return children.length ? { ...info, children } : info;
      };
      
      return traverse(document.body);
    };
    
    // Helper to get all focusable elements
    (window as any).getFocusableElements = () => {
      return Array.from(document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => {
        const element = el as HTMLElement;
        const disabled = (element as any).disabled;
        return element.offsetParent !== null && !disabled;
      });
    };
    
    // Helper to simulate screen reader announcement
    (window as any).announceToScreenReader = (message: string, priority: string = 'polite') => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        announcement.textContent = message;
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }, 100);
    };
  });
}

/**
 * Wait for all animations to complete
 */
export async function waitForAnimations(page: Page, timeout: number = 5000): Promise<void> {
  await page.waitForFunction(
    () => {
      const animations = document.getAnimations();
      return animations.every(animation => 
        animation.playState === 'finished' || animation.playState === 'idle'
      );
    },
    { timeout }
  );
}

/**
 * Get all focusable elements on the page
 */
export async function getFocusableElements(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).map(el => {
      const element = el as HTMLElement;
      const disabled = (element as any).disabled;
      if (element.offsetParent === null || disabled) return null;
      
      let selector = element.tagName.toLowerCase();
      if (element.id) selector += `#${element.id}`;
      if (element.className) {
        const firstClass = element.className.split(' ')[0];
        if (firstClass) selector += `.${firstClass}`;
      }
      
      return selector;
    }).filter(Boolean) as string[];
  });
}

/**
 * Check if element is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).isVisible();
}

/**
 * Get element's computed accessibility information
 */
export async function getElementA11yInfo(
  page: Page,
  selector: string
): Promise<{
  name: string;
  role: string;
  description: string;
  states: string[];
  properties: string[];
  focusable: boolean;
  visible: boolean;
}> {
  return await page.locator(selector).evaluate((element) => {
    const el = element as HTMLElement;
    
    // Get accessible name
    let name = '';
    if (el.hasAttribute('aria-label')) {
      name = el.getAttribute('aria-label') || '';
    } else if (el.hasAttribute('aria-labelledby')) {
      const ids = el.getAttribute('aria-labelledby')?.split(' ') || [];
      name = ids.map(id => document.getElementById(id)?.textContent?.trim()).join(' ');
    } else if (el.id) {
      const label = document.querySelector(`label[for="${el.id}"]`);
      if (label) name = label.textContent?.trim() || '';
    } else {
      name = el.textContent?.trim() || '';
    }
    
    // Get role
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    
    // Get description
    let description = '';
    if (el.hasAttribute('aria-describedby')) {
      const ids = el.getAttribute('aria-describedby')?.split(' ') || [];
      description = ids.map(id => document.getElementById(id)?.textContent?.trim()).join(' ');
    } else if (el.hasAttribute('title')) {
      description = el.getAttribute('title') || '';
    }
    
    // Get states and properties
    const states: string[] = [];
    const properties: string[] = [];
    
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('aria-')) {
        const value = attr.value;
        if (['aria-checked', 'aria-expanded', 'aria-hidden', 'aria-pressed', 'aria-selected'].includes(attr.name)) {
          states.push(`${attr.name}="${value}"`);
        } else {
          properties.push(`${attr.name}="${value}"`);
        }
      }
    });
    
    // Check focusability
    const focusable = el.matches('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])') &&
                     el.offsetParent !== null &&
                     !el.hasAttribute('disabled');
    
    // Check visibility
    const visible = el.offsetParent !== null;
    
    return {
      name,
      role,
      description,
      states,
      properties,
      focusable,
      visible,
    };
  });
}

/**
 * Simulate user typing with realistic delays
 */
export async function typeWithRealisticDelay(
  page: Page,
  selector: string,
  text: string,
  options: { delay?: number } = {}
): Promise<void> {
  const { delay = 100 } = options;
  
  const element = page.locator(selector);
  await element.focus();
  
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(delay + Math.random() * 50); // Add some randomness
  }
}

/**
 * Get page's accessibility tree
 */
export async function getAccessibilityTree(page: Page): Promise<any> {
  return await page.evaluate(() => {
    return (window as any).getAccessibilityTree();
  });
}

/**
 * Check for common accessibility issues
 */
export async function getCommonA11yIssues(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const issues: string[] = [];
    
    // Check for images without alt text
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images without alt text`);
    }
    
    // Check for form inputs without labels
    const inputsWithoutLabels = Array.from(document.querySelectorAll('input, select, textarea'))
      .filter(input => {
        const el = input as HTMLElement;
        return !el.hasAttribute('aria-label') && 
               !el.hasAttribute('aria-labelledby') && 
               !el.id &&
               !el.closest('label');
      });
    
    if (inputsWithoutLabels.length > 0) {
      issues.push(`${inputsWithoutLabels.length} form inputs without labels`);
    }
    
    // Check for missing heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let lastLevel = 0;
    let skippedLevels = false;
    
    headings.forEach(heading => {
      const levelStr = heading.tagName[1];
      if (!levelStr) return;
      const level = parseInt(levelStr, 10);
      if (lastLevel > 0 && level - lastLevel > 1) {
        skippedLevels = true;
      }
      lastLevel = level;
    });
    
    if (skippedLevels) {
      issues.push('Heading hierarchy has gaps');
    }
    
    // Check for clickable elements without keyboard access
    const clickableElements = document.querySelectorAll('[onclick]');
    const nonKeyboardAccessible = Array.from(clickableElements).filter(el => {
      const element = el as HTMLElement;
      return !element.hasAttribute('tabindex') && 
             !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
    });
    
    if (nonKeyboardAccessible.length > 0) {
      issues.push(`${nonKeyboardAccessible.length} clickable elements not keyboard accessible`);
    }
    
    return issues;
  });
}

/**
 * Emulate different user preferences
 */
export async function emulateUserPreferences(
  page: Page,
  preferences: {
    colorScheme?: 'light' | 'dark';
    reducedMotion?: boolean;
    highContrast?: boolean;
    forcedColors?: 'active' | 'none';
  }
): Promise<void> {
  if (preferences.colorScheme) {
    await page.emulateMedia({ colorScheme: preferences.colorScheme });
  }
  
  if (preferences.reducedMotion) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  }
  
  if (preferences.highContrast) {
    await page.emulateMedia({ contrast: 'more' });
  }
  
  if (preferences.forcedColors) {
    await page.emulateMedia({ forcedColors: preferences.forcedColors });
  }
}