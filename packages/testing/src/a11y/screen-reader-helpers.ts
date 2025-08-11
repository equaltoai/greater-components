/**
 * Screen Reader Testing Helpers
 * Utilities for testing screen reader compatibility and announcements
 */

export interface AnnouncementTest {
  element: HTMLElement;
  expectedAnnouncement: string;
  actualAnnouncement?: string;
  passed: boolean;
  warnings: string[];
}

export interface ScreenReaderTestResult {
  element: HTMLElement;
  accessibleName: string;
  role: string;
  states: string[];
  properties: string[];
  description?: string;
  issues: string[];
}

/**
 * Live region politeness levels
 */
export type PolitenessLevel = 'off' | 'polite' | 'assertive';

/**
 * Get accessible name computation for screen readers
 */
export function getAccessibleNameComputation(element: HTMLElement): {
  name: string;
  source: string;
  computation: string[];
} {
  const computation: string[] = [];
  let name = '';
  let source = '';

  // Step 1: Check aria-labelledby
  if (element.hasAttribute('aria-labelledby')) {
    const ids = element.getAttribute('aria-labelledby')?.split(/\s+/) || [];
    const texts = ids
      .map((id) => {
        const labelElement = document.getElementById(id);
        if (labelElement) {
          computation.push(`Referenced element #${id}: "${labelElement.textContent?.trim()}"`);
          return labelElement.textContent?.trim() || '';
        }
        computation.push(`Referenced element #${id}: NOT FOUND`);
        return '';
      })
      .filter(Boolean);
    
    if (texts.length > 0) {
      name = texts.join(' ');
      source = 'aria-labelledby';
      computation.push(`Final name from aria-labelledby: "${name}"`);
      return { name, source, computation };
    }
  }

  // Step 2: Check aria-label
  if (element.hasAttribute('aria-label')) {
    name = element.getAttribute('aria-label') || '';
    source = 'aria-label';
    computation.push(`Name from aria-label: "${name}"`);
    return { name, source, computation };
  }

  // Step 3: Check for native label association
  if (element instanceof HTMLInputElement || 
      element instanceof HTMLSelectElement || 
      element instanceof HTMLTextAreaElement) {
    
    // Check for explicit label
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) {
        name = label.textContent?.trim() || '';
        source = 'explicit label';
        computation.push(`Name from explicit label: "${name}"`);
        return { name, source, computation };
      }
    }

    // Check for implicit label (wrapped)
    const parentLabel = element.closest('label');
    if (parentLabel) {
      name = parentLabel.textContent?.trim() || '';
      source = 'implicit label';
      computation.push(`Name from implicit label (wrapped): "${name}"`);
      return { name, source, computation };
    }
  }

  // Step 4: Check for text content (buttons, links, etc.)
  if (['BUTTON', 'A', 'SUMMARY'].includes(element.tagName)) {
    name = element.textContent?.trim() || '';
    source = 'text content';
    computation.push(`Name from text content: "${name}"`);
    return { name, source, computation };
  }

  // Step 5: Check for alt text (images)
  if (element instanceof HTMLImageElement && element.hasAttribute('alt')) {
    name = element.getAttribute('alt') || '';
    source = 'alt attribute';
    computation.push(`Name from alt attribute: "${name}"`);
    return { name, source, computation };
  }

  // Step 6: Check for title attribute
  if (element.hasAttribute('title')) {
    name = element.getAttribute('title') || '';
    source = 'title attribute';
    computation.push(`Name from title attribute: "${name}"`);
    return { name, source, computation };
  }

  computation.push('No accessible name found');
  return { name: '', source: 'none', computation };
}

/**
 * Get ARIA role computation
 */
export function getARIARoleComputation(element: HTMLElement): {
  role: string;
  source: string;
  implicit: boolean;
} {
  // Check explicit role
  if (element.hasAttribute('role')) {
    const role = element.getAttribute('role') || '';
    return { role, source: 'explicit', implicit: false };
  }

  // Get implicit role based on element
  const implicitRoles: Record<string, string> = {
    BUTTON: 'button',
    A: element.hasAttribute('href') ? 'link' : 'generic',
    INPUT: getInputRole(element as HTMLInputElement),
    SELECT: 'combobox',
    TEXTAREA: 'textbox',
    H1: 'heading',
    H2: 'heading',
    H3: 'heading',
    H4: 'heading',
    H5: 'heading',
    H6: 'heading',
    NAV: 'navigation',
    MAIN: 'main',
    SECTION: 'region',
    ARTICLE: 'article',
    ASIDE: 'complementary',
    HEADER: 'banner',
    FOOTER: 'contentinfo',
    UL: 'list',
    OL: 'list',
    LI: 'listitem',
    DL: 'list',
    DT: 'term',
    DD: 'definition',
    TABLE: 'table',
    THEAD: 'rowgroup',
    TBODY: 'rowgroup',
    TFOOT: 'rowgroup',
    TR: 'row',
    TH: 'columnheader',
    TD: 'cell',
    IMG: 'img',
    FIGURE: 'figure',
  };

  const role = implicitRoles[element.tagName] || 'generic';
  return { role, source: 'implicit', implicit: true };
}

/**
 * Get role for input elements
 */
function getInputRole(input: HTMLInputElement): string {
  const type = input.type.toLowerCase();
  const roleMap: Record<string, string> = {
    button: 'button',
    submit: 'button',
    reset: 'button',
    checkbox: 'checkbox',
    radio: 'radio',
    range: 'slider',
    text: 'textbox',
    password: 'textbox',
    email: 'textbox',
    tel: 'textbox',
    url: 'textbox',
    search: 'searchbox',
  };
  return roleMap[type] || 'textbox';
}

/**
 * Get ARIA states and properties
 */
export function getARIAStatesAndProperties(element: HTMLElement): {
  states: string[];
  properties: string[];
} {
  const states: string[] = [];
  const properties: string[] = [];

  // Check all attributes
  Array.from(element.attributes).forEach((attr) => {
    if (attr.name.startsWith('aria-')) {
      const value = attr.value;
      
      // Categorize as state or property
      if (isARIAState(attr.name)) {
        states.push(`${attr.name}="${value}"`);
      } else {
        properties.push(`${attr.name}="${value}"`);
      }
    }
  });

  // Add implicit states for form elements
  if (element instanceof HTMLInputElement) {
    if (element.checked) {
      states.push('aria-checked="true"');
    }
    if (element.disabled) {
      states.push('aria-disabled="true"');
    }
    if (element.required) {
      properties.push('aria-required="true"');
    }
  }

  return { states, properties };
}

/**
 * Check if ARIA attribute is a state
 */
function isARIAState(attribute: string): boolean {
  const states = [
    'aria-checked',
    'aria-disabled',
    'aria-expanded',
    'aria-hidden',
    'aria-invalid',
    'aria-pressed',
    'aria-selected',
  ];
  return states.includes(attribute);
}

/**
 * Test screen reader announcement
 */
export function testScreenReaderAnnouncement(
  element: HTMLElement,
  expectedAnnouncement: string
): AnnouncementTest {
  const warnings: string[] = [];
  
  // Get accessible name computation
  const nameComputation = getAccessibleNameComputation(element);
  const roleComputation = getARIARoleComputation(element);
  const { states, properties } = getARIAStatesAndProperties(element);
  
  // Build expected announcement
  let actualAnnouncement = '';
  
  if (nameComputation.name) {
    actualAnnouncement += nameComputation.name;
  }
  
  if (roleComputation.role !== 'generic') {
    actualAnnouncement += ` ${roleComputation.role}`;
  }
  
  // Add relevant states
  states.forEach((state) => {
    if (state.includes('expanded')) {
      actualAnnouncement += state.includes('true') ? ' expanded' : ' collapsed';
    } else if (state.includes('checked')) {
      actualAnnouncement += state.includes('true') ? ' checked' : ' unchecked';
    } else if (state.includes('selected')) {
      actualAnnouncement += state.includes('true') ? ' selected' : '';
    }
  });
  
  // Check for missing accessible name
  if (!nameComputation.name) {
    warnings.push('Element has no accessible name');
  }
  
  // Check for redundant role
  if (!roleComputation.implicit && element.tagName.toLowerCase() === roleComputation.role) {
    warnings.push('Redundant ARIA role matches implicit semantic');
  }
  
  const passed = actualAnnouncement.toLowerCase().includes(
    expectedAnnouncement.toLowerCase()
  );
  
  return {
    element,
    expectedAnnouncement,
    actualAnnouncement: actualAnnouncement.trim(),
    passed,
    warnings,
  };
}

/**
 * Create live region for testing announcements
 */
export function createLiveRegion(
  politeness: PolitenessLevel = 'polite',
  atomic: boolean = false
): HTMLElement {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.setAttribute('aria-atomic', atomic.toString());
  liveRegion.setAttribute('class', 'sr-only');
  liveRegion.style.cssText = `
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
  
  document.body.appendChild(liveRegion);
  return liveRegion;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  politeness: PolitenessLevel = 'polite',
  cleanup: boolean = true
): Promise<void> {
  return new Promise((resolve) => {
    const liveRegion = createLiveRegion(politeness);
    
    // Delay to ensure screen reader picks up the change
    setTimeout(() => {
      liveRegion.textContent = message;
      
      if (cleanup) {
        setTimeout(() => {
          document.body.removeChild(liveRegion);
          resolve();
        }, 1000);
      } else {
        resolve();
      }
    }, 100);
  });
}

/**
 * Test comprehensive screen reader information
 */
export function testScreenReaderCompat(element: HTMLElement): ScreenReaderTestResult {
  const issues: string[] = [];
  
  // Get accessible name
  const nameComputation = getAccessibleNameComputation(element);
  if (!nameComputation.name) {
    issues.push('No accessible name found');
  }
  
  // Get role
  const roleComputation = getARIARoleComputation(element);
  
  // Get states and properties
  const { states, properties } = getARIAStatesAndProperties(element);
  
  // Get description
  let description = '';
  if (element.hasAttribute('aria-describedby')) {
    const ids = element.getAttribute('aria-describedby')?.split(/\s+/) || [];
    const descriptions = ids
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    description = descriptions.join(' ');
  } else if (element.hasAttribute('title')) {
    description = element.getAttribute('title') || '';
  }
  
  // Check for common issues
  if (roleComputation.role === 'generic' && element.onclick) {
    issues.push('Interactive element has generic role');
  }
  
  if (element.hasAttribute('aria-labelledby')) {
    const ids = element.getAttribute('aria-labelledby')?.split(/\s+/) || [];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        issues.push(`aria-labelledby references missing element: #${id}`);
      }
    });
  }
  
  if (element.hasAttribute('aria-describedby')) {
    const ids = element.getAttribute('aria-describedby')?.split(/\s+/) || [];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        issues.push(`aria-describedby references missing element: #${id}`);
      }
    });
  }
  
  return {
    element,
    accessibleName: nameComputation.name,
    role: roleComputation.role,
    states,
    properties,
    description,
    issues,
  };
}

/**
 * Generate screen reader compatibility report
 */
export function generateScreenReaderReport(
  results: ScreenReaderTestResult[]
): string {
  const totalElements = results.length;
  const elementsWithIssues = results.filter((r) => r.issues.length > 0).length;
  const elementsWithoutName = results.filter((r) => !r.accessibleName).length;
  
  let report = 'Screen Reader Compatibility Report\n';
  report += '='.repeat(40) + '\n\n';
  report += `Total Elements Tested: ${totalElements}\n`;
  report += `Elements with Issues: ${elementsWithIssues}\n`;
  report += `Elements without Accessible Name: ${elementsWithoutName}\n\n`;
  
  if (elementsWithIssues > 0) {
    report += 'Issues Found:\n';
    report += '-'.repeat(20) + '\n';
    
    results
      .filter((r) => r.issues.length > 0)
      .forEach((result, index) => {
        report += `\n${index + 1}. Element: ${result.element.tagName}`;
        if (result.element.id) report += `#${result.element.id}`;
        if (result.element.className) report += `.${result.element.className}`;
        report += '\n';
        
        report += `   Role: ${result.role}\n`;
        report += `   Name: "${result.accessibleName}"\n`;
        
        result.issues.forEach((issue) => {
          report += `   ✗ ${issue}\n`;
        });
      });
  }
  
  return report;
}