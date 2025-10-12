/**
 * ARIA Testing Helpers
 * Utilities for testing ARIA attributes and semantic HTML
 */

export interface ARIAValidationResult {
  element: HTMLElement;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * ARIA role requirements
 */
export const ARIARoleRequirements: Record<string, string[]> = {
  button: [],
  checkbox: ['aria-checked'],
  dialog: ['aria-label', 'aria-labelledby'],
  grid: [],
  gridcell: [],
  heading: ['aria-level'],
  link: [],
  list: [],
  listbox: [],
  listitem: [],
  menu: [],
  menubar: [],
  menuitem: [],
  navigation: [],
  option: [],
  progressbar: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  radio: ['aria-checked'],
  radiogroup: [],
  region: ['aria-label', 'aria-labelledby'],
  row: [],
  scrollbar: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-orientation'],
  search: [],
  separator: [],
  slider: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  spinbutton: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  status: [],
  switch: ['aria-checked'],
  tab: [],
  tablist: [],
  tabpanel: [],
  textbox: [],
  toolbar: [],
  tooltip: [],
  tree: [],
  treegrid: [],
  treeitem: [],
};

/**
 * Validate ARIA attributes on an element
 */
export function validateARIA(element: HTMLElement): ARIAValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check role validity
  const role = element.getAttribute('role');
  if (role && !ARIARoleRequirements.hasOwnProperty(role)) {
    errors.push(`Invalid ARIA role: ${role}`);
  }

  // Check required attributes for role
  if (role && ARIARoleRequirements[role]) {
    ARIARoleRequirements[role].forEach((attr) => {
      if (!element.hasAttribute(attr)) {
        const orAttributes = attr.split(',');
        const hasAny = orAttributes.some((a) => element.hasAttribute(a.trim()));
        if (!hasAny) {
          errors.push(`Missing required ARIA attribute for role="${role}": ${attr}`);
        }
      }
    });
  }

  // Check aria-label and aria-labelledby
  if (element.hasAttribute('aria-label') && element.hasAttribute('aria-labelledby')) {
    warnings.push('Element has both aria-label and aria-labelledby');
  }

  // Check aria-labelledby references
  if (element.hasAttribute('aria-labelledby')) {
    const ids = element.getAttribute('aria-labelledby')?.split(' ') || [];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        errors.push(`aria-labelledby references non-existent element: ${id}`);
      }
    });
  }

  // Check aria-describedby references
  if (element.hasAttribute('aria-describedby')) {
    const ids = element.getAttribute('aria-describedby')?.split(' ') || [];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        errors.push(`aria-describedby references non-existent element: ${id}`);
      }
    });
  }

  // Check aria-controls references
  if (element.hasAttribute('aria-controls')) {
    const ids = element.getAttribute('aria-controls')?.split(' ') || [];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        errors.push(`aria-controls references non-existent element: ${id}`);
      }
    });
  }

  // Check aria-owns references
  if (element.hasAttribute('aria-owns')) {
    const ids = element.getAttribute('aria-owns')?.split(' ') || [];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        errors.push(`aria-owns references non-existent element: ${id}`);
      }
    });
  }

  // Check boolean aria attributes
  const booleanAttrs = ['aria-checked', 'aria-disabled', 'aria-expanded', 'aria-hidden',
    'aria-pressed', 'aria-selected', 'aria-readonly', 'aria-required'];
  
  booleanAttrs.forEach((attr) => {
    if (element.hasAttribute(attr)) {
      const value = element.getAttribute(attr);
      if (value && !['true', 'false', 'mixed'].includes(value)) {
        errors.push(`Invalid value for ${attr}: ${value}`);
      }
    }
  });

  // Check numeric aria attributes
  const numericAttrs = ['aria-level', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow'];
  
  numericAttrs.forEach((attr) => {
    if (element.hasAttribute(attr)) {
      const value = element.getAttribute(attr);
      if (value && isNaN(Number(value))) {
        errors.push(`Invalid numeric value for ${attr}: ${value}`);
      }
    }
  });

  return {
    element,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if element has accessible name
 */
export function hasAccessibleName(element: HTMLElement): boolean {
  // Check aria-label
  if (element.hasAttribute('aria-label')) {
    return true;
  }

  // Check aria-labelledby
  if (element.hasAttribute('aria-labelledby')) {
    const ids = element.getAttribute('aria-labelledby')?.split(' ') || [];
    return ids.some((id) => {
      const labelElement = document.getElementById(id);
      return labelElement && labelElement.textContent?.trim();
    });
  }

  // Check for associated label (for form elements)
  if (element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement) {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label && label.textContent?.trim()) {
        return true;
      }
    }

    // Check if element is wrapped in label
    const parentLabel = element.closest('label');
    if (parentLabel && parentLabel.textContent?.trim()) {
      return true;
    }
  }

  // Check for title attribute
  if (element.hasAttribute('title')) {
    return true;
  }

  // Check for text content (for buttons, links, etc.)
  if (element.textContent?.trim()) {
    return true;
  }

  return false;
}

/**
 * Get accessible name of an element
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  if (element.hasAttribute('aria-label')) {
    return element.getAttribute('aria-label') || '';
  }

  // Check aria-labelledby
  if (element.hasAttribute('aria-labelledby')) {
    const ids = element.getAttribute('aria-labelledby')?.split(' ') || [];
    const labels = ids
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (labels.length > 0) {
      return labels.join(' ');
    }
  }

  // Check for associated label
  if (element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement) {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        return label.textContent?.trim() || '';
      }
    }

    // Check if element is wrapped in label
    const parentLabel = element.closest('label');
    if (parentLabel) {
      return parentLabel.textContent?.trim() || '';
    }
  }

  // Check for title attribute
  if (element.hasAttribute('title')) {
    return element.getAttribute('title') || '';
  }

  // Return text content
  return element.textContent?.trim() || '';
}

/**
 * Check if element has accessible description
 */
export function hasAccessibleDescription(element: HTMLElement): boolean {
  return element.hasAttribute('aria-describedby') || element.hasAttribute('title');
}

/**
 * Get accessible description of an element
 */
export function getAccessibleDescription(element: HTMLElement): string {
  // Check aria-describedby
  if (element.hasAttribute('aria-describedby')) {
    const ids = element.getAttribute('aria-describedby')?.split(' ') || [];
    const descriptions = ids
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (descriptions.length > 0) {
      return descriptions.join(' ');
    }
  }

  // Check title attribute
  if (element.hasAttribute('title')) {
    return element.getAttribute('title') || '';
  }

  return '';
}

/**
 * Check semantic HTML usage
 */
export function checkSemanticHTML(container: HTMLElement): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for div/span with button role instead of button element
  container.querySelectorAll('[role="button"]').forEach((element) => {
    if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
      issues.push(`Use <button> instead of <${element.tagName.toLowerCase()}> with role="button"`);
    }
  });

  // Check for missing heading hierarchy
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  headings.forEach((heading) => {
    const levelStr = heading.tagName[1];
    if (!levelStr) return;
    const level = parseInt(levelStr, 10);
    if (level - lastLevel > 1) {
      issues.push(`Heading hierarchy skipped from h${lastLevel} to h${level}`);
    }
    lastLevel = level;
  });

  // Check for missing alt text on images
  container.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push('Image missing alt attribute');
    }
  });

  // Check for form elements without labels
  container.querySelectorAll('input, select, textarea').forEach((element) => {
    if (!hasAccessibleName(element as HTMLElement)) {
      issues.push(`Form element missing label: ${element.tagName}`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}