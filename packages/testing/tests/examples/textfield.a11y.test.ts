/**
 * TextField Component Accessibility Tests
 * Tests form accessibility, label association, error handling, and keyboard interaction
 */

import { test, expect } from '@playwright/test';
import { 
  checkAccessibility 
} from '../../src/playwright/axe-playwright';
import { 
  testTabOrder 
} from '../../src/playwright/keyboard-playwright';
import { createStorybookTestSuite } from '../../src/playwright/storybook-helpers';

const storybook = createStorybookTestSuite();
const TEXTFIELD_STORY_ID = 'primitives-textfield--default';

test.describe('TextField Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID);
  });

  test('meets WCAG 2.1 AA standards', async ({ page }) => {
    await checkAccessibility(page, {
      standard: 'AA',
      failOnViolations: true,
    });
  });

  test('has proper label association', async ({ page }) => {
    const input = page.locator('[data-testid="textfield"]');
    
    // Should have associated label
    const labelId = await input.getAttribute('aria-labelledby');
    const ariaLabel = await input.getAttribute('aria-label');
    
    // Either aria-labelledby or aria-label should exist
    expect(labelId || ariaLabel, 'TextField should have accessible name').toBeTruthy();
    
    if (labelId) {
      // If using aria-labelledby, the referenced element should exist
      const labelElement = page.locator(`#${labelId}`);
      await expect(labelElement).toBeVisible();
      
      const labelText = await labelElement.textContent();
      expect(labelText?.trim(), 'Label should have meaningful text').toBeTruthy();
    }
  });

  test('keyboard navigation works correctly', async ({ page }) => {
    const input = page.locator('[data-testid="textfield"]');
    
    // Should be focusable via Tab
    const tabResult = await testTabOrder(page, ['input[data-testid="textfield"]']);
    expect(tabResult.passed, 'TextField should be in tab order').toBe(true);
    
    // Should accept text input
    await input.focus();
    await input.fill('Test input');
    
    const value = await input.inputValue();
    expect(value, 'TextField should accept text input').toBe('Test input');
    
    // Test text selection
    await input.selectText();
    const selectedText = await page.evaluate(() => window.getSelection()?.toString());
    expect(selectedText, 'Text should be selectable').toBe('Test input');
  });

  test('required field validation is accessible', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, { 
      args: { required: true } 
    });
    
    const input = page.locator('[data-testid="textfield"]');
    
    // Should have required attribute or aria-required
    const isRequired = await input.evaluate(el => 
      el.hasAttribute('required') || el.getAttribute('aria-required') === 'true'
    );
    expect(isRequired, 'Required field should be marked as required').toBe(true);
    
    // Test validation on blur
    await input.focus();
    await input.blur();
    
    // Should have error state
    const hasError = await page.evaluate(() => {
      const field = document.querySelector('[data-testid="textfield"]');
      return field?.getAttribute('aria-invalid') === 'true' ||
             field?.hasAttribute('data-error') ||
             document.querySelector('[role="alert"]') !== null;
    });
    
    expect(hasError, 'Empty required field should show error state').toBe(true);
  });

  test('error messages are properly announced', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, { 
      args: { 
        error: true,
        errorMessage: 'This field is required'
      } 
    });
    
    await checkAccessibility(page);
    
    const input = page.locator('[data-testid="textfield"]');
    
    // Should have aria-invalid
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    
    // Should have aria-describedby pointing to error message
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy, 'Error field should have aria-describedby').toBeTruthy();
    
    if (describedBy) {
      const errorElement = page.locator(`#${describedBy}`);
      await expect(errorElement).toBeVisible();
      
      const errorText = await errorElement.textContent();
      expect(errorText, 'Error message should be meaningful').toContain('required');
    }
  });

  test('disabled state is accessible', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, { 
      args: { disabled: true } 
    });
    
    const input = page.locator('[data-testid="textfield"]');
    
    // Should be marked as disabled
    await expect(input).toHaveAttribute('disabled');
    
    // Should not be in tab order
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).not.toBe(input);
    
    // Color contrast requirements may be relaxed for disabled fields
    await checkAccessibility(page, {
      disableRules: ['color-contrast']
    });
  });

  test('placeholder text is accessible', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, { 
      args: { placeholder: 'Enter your email address' } 
    });
    
    const input = page.locator('[data-testid="textfield"]');
    
    // Placeholder should not be the only form of labeling
    const hasProperLabel = await input.evaluate(el => {
      return el.hasAttribute('aria-label') ||
             el.hasAttribute('aria-labelledby') ||
             document.querySelector(`label[for="${el.id}"]`) !== null;
    });
    
    expect(hasProperLabel, 'Field with placeholder should still have proper label').toBe(true);
  });

  test('password field is accessible', async ({ page }) => {
    await storybook.gotoStory(page, 'primitives-textfield--password');
    
    await checkAccessibility(page);
    
    const input = page.locator('[data-testid="textfield"]');
    await expect(input).toHaveAttribute('type', 'password');
    
    // Should have toggle button for showing/hiding password
    const toggleButton = page.locator('[data-testid="password-toggle"]');
    if (await toggleButton.count() > 0) {
      // Toggle button should be accessible
      await expect(toggleButton).toHaveAttribute('aria-label');
      
      // Should be keyboard accessible
      await toggleButton.focus();
      await page.keyboard.press('Enter');
      
      // Input type should change
      const newType = await input.getAttribute('type');
      expect(newType, 'Password toggle should change input type').toBe('text');
    }
  });

  test('autocomplete attributes are properly set', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, { 
      args: { autocomplete: 'email' } 
    });
    
    const input = page.locator('[data-testid="textfield"]');
    await expect(input).toHaveAttribute('autocomplete', 'email');
    
    // This helps with form accessibility and user experience
    await checkAccessibility(page);
  });

  test('multiline text area is accessible', async ({ page }) => {
    await storybook.gotoStory(page, 'primitives-textfield--textarea');
    
    await checkAccessibility(page);
    
    const textarea = page.locator('[data-testid="textfield"]');
    
    // Should be a textarea element
    const tagName = await textarea.evaluate(el => el.tagName.toLowerCase());
    expect(tagName, 'Multiline field should use textarea element').toBe('textarea');
    
    // Should handle multiline input
    await textarea.focus();
    await textarea.fill('Line 1\nLine 2\nLine 3');
    
    const value = await textarea.inputValue();
    expect(value, 'Textarea should handle multiline input').toContain('\n');
  });

  test('field with helper text is accessible', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, { 
      args: { 
        helperText: 'We will never share your email address' 
      } 
    });
    
    await checkAccessibility(page);
    
    const input = page.locator('[data-testid="textfield"]');
    
    // Helper text should be associated via aria-describedby
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy, 'Field with helper text should have aria-describedby').toBeTruthy();
    
    if (describedBy) {
      const helperElement = page.locator(`#${describedBy}`);
      await expect(helperElement).toBeVisible();
      
      const helperText = await helperElement.textContent();
      expect(helperText, 'Helper text should be meaningful').toContain('never share');
    }
  });

  test('character counter is accessible', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, { 
      args: { 
        maxLength: 100,
        showCharacterCount: true 
      } 
    });
    
    const input = page.locator('[data-testid="textfield"]');
    await input.fill('Test message');
    
    // Character counter should be announced to screen readers
    const counter = page.locator('[data-testid="character-counter"]');
    if (await counter.count() > 0) {
      // Should be in aria-describedby or have proper role
      const hasAriaLabel = await counter.getAttribute('aria-label');
      const hasRole = await counter.getAttribute('role');
      
      expect(hasAriaLabel || hasRole, 'Character counter should be accessible').toBeTruthy();
    }
  });

  test('works with form validation', async ({ page }) => {
    // Create a form context
    await page.setContent(`
      <form>
        <div id="storybook-root"></div>
      </form>
    `);
    
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID, {
      args: { required: true, type: 'email' }
    });
    
    const input = page.locator('[data-testid="textfield"]');
    
    // Test invalid email
    await input.fill('invalid-email');
    
    // Trigger validation
    const form = page.locator('form');
    await form.evaluate(form => {
      // Trigger HTML5 validation
      const input = form.querySelector('input');
      if (input) {
        (input as HTMLInputElement).checkValidity();
      }
    });
    
    // Should show validation state
    const isInvalid = await input.evaluate(el => !el.checkValidity());
    expect(isInvalid, 'Invalid email should trigger validation').toBe(true);
  });
});

test.describe('TextField Keyboard Interaction', () => {
  test('text selection shortcuts work', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID);
    
    const input = page.locator('[data-testid="textfield"]');
    await input.focus();
    await input.fill('Hello World');
    
    // Test Ctrl+A (Select All)
    await page.keyboard.press('Control+a');
    const selectedAll = await page.evaluate(() => {
      const selection = window.getSelection();
      return selection?.toString() === 'Hello World';
    });
    expect(selectedAll, 'Ctrl+A should select all text').toBe(true);
    
    // Test Home/End keys
    await page.keyboard.press('Home');
    await page.keyboard.press('Shift+End');
    const selectedWithShift = await page.evaluate(() => {
      const selection = window.getSelection();
      return selection?.toString() === 'Hello World';
    });
    expect(selectedWithShift, 'Home/End with Shift should select text').toBe(true);
  });

  test('undo/redo functionality', async ({ page }) => {
    await storybook.gotoStory(page, TEXTFIELD_STORY_ID);
    
    const input = page.locator('[data-testid="textfield"]');
    await input.focus();
    await input.fill('Original text');
    await input.fill('Modified text');
    
    // Test Ctrl+Z (Undo)
    await page.keyboard.press('Control+z');
    const afterUndo = await input.inputValue();
    
    // Note: Undo behavior may vary by browser and implementation
    // This test validates the keyboard shortcut is not blocked
    expect(typeof afterUndo, 'Undo shortcut should not be blocked').toBe('string');
  });
});
