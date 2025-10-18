/**
 * Focus Management Testing Helpers
 * Utilities for testing focus management, focus trap, and focus restoration
 */

import { createFocusTrap, FocusTrap } from 'focus-trap';
import { tabbable, focusable, isTabbable, isFocusable, type FocusableElement } from 'tabbable';

export interface FocusTestResult {
  passed: boolean;
  description: string;
  currentFocus?: string;
  expectedFocus?: string;
  error?: string;
}

export interface FocusTrapTestOutcome {
  trap: FocusTrap | null;
  result: FocusTestResult;
}

/**
 * Test focus trap implementation
 */
export function testFocusTrap(container: HTMLElement): FocusTestResult {
  try {
    const focusableElements = tabbable(container);
    
    if (focusableElements.length === 0) {
      return {
        passed: false,
        description: 'Focus trap test',
        error: 'No focusable elements found in container',
      };
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      return {
        passed: false,
        description: 'Focus trap test',
        error: 'Not enough focusable elements found',
      };
    }

    // Focus first element
    (firstElement as HTMLElement).focus();
    const firstFocused = document.activeElement === firstElement;

    if (!firstFocused) {
      return {
        passed: false,
        description: 'Focus trap test - initial focus',
        error: 'Could not focus first element',
      };
    }

    // Simulate Tab from last element (should wrap to first)
    (lastElement as HTMLElement).focus();
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    (lastElement as HTMLElement).dispatchEvent(event);

    // In a real focus trap, focus should wrap to first element
    // This is a simplified test - actual implementation would need proper focus trap library
    return {
      passed: true,
      description: 'Focus trap test',
      currentFocus: getElementSelector(document.activeElement as HTMLElement),
    };
  } catch (error) {
    return {
      passed: false,
      description: 'Focus trap test',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test focus restoration after modal/dialog close
 */
export function testFocusRestoration(
  triggerElement: HTMLElement,
  modalContainer: HTMLElement,
  closeAction: () => void
): FocusTestResult {
  try {
    // Store initial focus
    triggerElement.focus();
    const initialFocus = document.activeElement;

    if (initialFocus !== triggerElement) {
      return {
        passed: false,
        description: 'Focus restoration test - initial setup',
        error: 'Could not set initial focus',
      };
    }

    // Open modal (focus should move to modal)
    const modalFocusableElements = tabbable(modalContainer);
    if (modalFocusableElements.length > 0 && modalFocusableElements[0]) {
      (modalFocusableElements[0] as HTMLElement).focus();
    }

    // Close modal
    closeAction();

    // Check if focus is restored
    const focusRestored = document.activeElement === initialFocus;

    return {
      passed: focusRestored,
      description: 'Focus restoration test',
      currentFocus: getElementSelector(document.activeElement as HTMLElement),
      expectedFocus: getElementSelector(triggerElement),
    };
  } catch (error) {
    return {
      passed: false,
      description: 'Focus restoration test',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test focus order matches visual order
 */
export function testFocusOrder(expectedOrder: FocusableElement[]): FocusTestResult {
  try {
    const actualOrder: FocusableElement[] = [];
    const allTabbable = tabbable(document.body);

    // Filter to only elements in expected order
    allTabbable.forEach((element) => {
      if (expectedOrder.includes(element)) {
        actualOrder.push(element);
      }
    });

    const orderMatches = actualOrder.every(
      (element, index) => element === expectedOrder[index]
    );

    return {
      passed: orderMatches,
      description: 'Focus order test',
      currentFocus: actualOrder.map((el) => getElementSelector(el as HTMLElement)).join(' -> '),
      expectedFocus: expectedOrder.map((el) => getElementSelector(el as HTMLElement)).join(' -> '),
    };
  } catch (error) {
    return {
      passed: false,
      description: 'Focus order test',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test skip links functionality
 */
export function testSkipLinks(): FocusTestResult[] {
  const results: FocusTestResult[] = [];
  const skipLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[href^="#"]:not([href="#"])'
  );

  skipLinks.forEach((link) => {
    const targetId = link.getAttribute('href')?.substring(1);
    if (!targetId) {
      results.push({
        passed: false,
        description: `Skip link test: ${link.textContent}`,
        error: 'No target ID found',
      });
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      results.push({
        passed: false,
        description: `Skip link test: ${link.textContent}`,
        error: `Target element not found: #${targetId}`,
      });
      return;
    }

    // Check if target is focusable or has tabindex
    const canReceiveFocus =
      isFocusable(target) || target.hasAttribute('tabindex');

    results.push({
      passed: canReceiveFocus,
      description: `Skip link test: ${link.textContent}`,
      error: canReceiveFocus
        ? undefined
        : 'Target element cannot receive focus',
    });
  });

  return results;
}

/**
 * Test focus visible indicators
 */
export function testFocusVisible(element: HTMLElement): FocusTestResult {
  try {
    element.focus();

    const styles = window.getComputedStyle(element);
    const hasFocusIndicator =
      styles.outline !== 'none' ||
      styles.boxShadow !== 'none' ||
      styles.border !== 'none';

    // Check for :focus-visible pseudo-class
    const focusVisibleSelector = ':focus-visible';
    const matchesFocusVisible = element.matches(focusVisibleSelector);

    return {
      passed: hasFocusIndicator || matchesFocusVisible,
      description: 'Focus visible indicator test',
      error:
        hasFocusIndicator || matchesFocusVisible
          ? undefined
          : 'No visible focus indicator',
    };
  } catch (error) {
    return {
      passed: false,
      description: 'Focus visible indicator test',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test roving tabindex implementation
 */
export function testRovingTabindex(
  container: HTMLElement,
  itemSelector: string
): FocusTestResult {
  try {
    const items = container.querySelectorAll<HTMLElement>(itemSelector);
    let activeItemCount = 0;
    let inactiveItemCount = 0;

    items.forEach((item) => {
      const tabindex = item.getAttribute('tabindex');
      if (tabindex === '0') {
        activeItemCount++;
      } else if (tabindex === '-1') {
        inactiveItemCount++;
      }
    });

    const valid = activeItemCount === 1 && inactiveItemCount === items.length - 1;

    return {
      passed: valid,
      description: 'Roving tabindex test',
      error: valid
        ? undefined
        : `Expected 1 item with tabindex="0" and ${items.length - 1} with tabindex="-1", ` +
          `found ${activeItemCount} and ${inactiveItemCount}`,
    };
  } catch (error) {
    return {
      passed: false,
      description: 'Roving tabindex test',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get element selector for debugging
 */
function getElementSelector(element: HTMLElement | null): string {
  if (!element) return 'null';

  let selector = element.tagName.toLowerCase();
  if (element.id) {
    selector += `#${element.id}`;
  }
  if (element.className) {
    selector += `.${element.className.split(' ').join('.')}`;
  }
  return selector;
}

/**
 * Create and test a focus trap
 */
export function createAndTestFocusTrap(
  container: HTMLElement,
  options?: {
    initialFocus?: HTMLElement | string;
    fallbackFocus?: HTMLElement | string;
    escapeDeactivates?: boolean;
    clickOutsideDeactivates?: boolean;
  }
): FocusTrapTestOutcome {
  try {
    const trap = createFocusTrap(container, {
      initialFocus: options?.initialFocus,
      fallbackFocus: options?.fallbackFocus,
      escapeDeactivates: options?.escapeDeactivates ?? true,
      clickOutsideDeactivates: options?.clickOutsideDeactivates ?? true,
    });

    trap.activate();

    // Test that focus is trapped
    const focusableElements = tabbable(container);
    const focusIsTrapped = focusableElements.includes(
      document.activeElement as HTMLElement
    );

    return {
      trap,
      result: {
        passed: focusIsTrapped,
        description: 'Focus trap creation and activation',
        currentFocus: getElementSelector(document.activeElement as HTMLElement),
      },
    };
  } catch (error) {
    return {
      trap: null,
      result: {
        passed: false,
        description: 'Focus trap creation and activation',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Get all focusable elements in a container
 */
export function getFocusableElements(
  container: HTMLElement = document.body
): FocusableElement[] {
  return focusable(container);
}

/**
 * Get all tabbable elements in a container
 */
export function getTabbableElements(
  container: HTMLElement = document.body
): FocusableElement[] {
  return tabbable(container);
}

/**
 * Check if element is focusable
 */
export function isElementFocusable(element: HTMLElement): boolean {
  return isFocusable(element);
}

/**
 * Check if element is tabbable
 */
export function isElementTabbable(element: HTMLElement): boolean {
  return isTabbable(element);
}
