# @equaltoai/greater-components-testing

Comprehensive accessibility testing utilities for the Greater Components library. This package provides tools for automated accessibility testing, keyboard navigation validation, visual regression testing, and WCAG compliance checking.

## Features

### 🔍 Automated Accessibility Testing

- **Axe-core integration** with custom WCAG 2.1 rule configurations
- **Theme-aware testing** (light, dark, high-contrast modes)
- **Density testing** (compact, comfortable, spacious layouts)
- **Cross-browser validation** with Playwright
- **Real-time violation reporting** with actionable recommendations

### ⌨️ Keyboard Navigation Testing

- **Tab order validation** ensuring logical navigation flow
- **Keyboard shortcut testing** for all interactive elements
- **Focus management verification** (traps, restoration, visibility)
- **Roving tabindex pattern testing** for complex components
- **Screen reader compatibility** validation

### 🎨 Visual Regression Testing

- **Focus state visualization** across themes and densities
- **Interactive state testing** (hover, active, disabled)
- **High contrast mode compliance** validation
- **Reduced motion preference** testing
- **Responsive design accessibility** verification

### 📊 Comprehensive Reporting

- **HTML reports** with detailed violation analysis
- **Component scorecards** with accessibility ratings
- **WCAG compliance tracking** (A, AA, AAA levels)
- **CI/CD integration** with failure thresholds
- **Historical trend analysis** and recommendations

## Installation

```bash
pnpm add -D @equaltoai/greater-components-testing
```

### Peer Dependencies

Install the following peer dependencies based on your testing needs:

```bash
# For Playwright testing
pnpm add -D @playwright/test playwright

# For Vitest/unit testing
pnpm add -D vitest @testing-library/svelte

# Additional tools
pnpm add -D axe-core @axe-core/playwright
```

## Quick Start

### Basic Accessibility Testing

```typescript
import { test, expect } from '@playwright/test';
import { checkAccessibility, setupAxe } from '@equaltoai/greater-components-testing/playwright';

test('component is accessible', async ({ page }) => {
	await page.goto('/your-component');
	await setupAxe(page);

	await checkAccessibility(page, {
		standard: 'AA',
		theme: 'light',
		density: 'comfortable',
	});
});
```

### Keyboard Navigation Testing

```typescript
import {
	testTabOrder,
	testKeyboardShortcuts,
} from '@equaltoai/greater-components-testing/playwright';

test('keyboard navigation works', async ({ page }) => {
	await page.goto('/your-component');

	// Test tab order
	const tabResult = await testTabOrder(page, ['button', 'input[type="text"]', 'select']);
	expect(tabResult.passed).toBe(true);

	// Test keyboard shortcuts
	const shortcuts = await testKeyboardShortcuts(page, {
		'Open Menu': {
			key: 'Enter',
			expectedAction: async () => {
				const menu = page.locator('[role="menu"]');
				return await menu.isVisible();
			},
		},
	});
});
```

### Visual Regression Testing

```typescript
import {
	testFocusStateVisual,
	testAllInteractiveStatesVisual,
} from '@equaltoai/greater-components-testing/playwright';

test('focus states are consistent', async ({ page }) => {
	await page.goto('/your-component');

	await testFocusStateVisual(page, 'button-focus', {
		focusSelector: 'button',
		threshold: 0.1,
	});

	await testAllInteractiveStatesVisual(page, 'button-states', 'button');
});
```

### Component Unit Testing with Accessibility

```typescript
import { render, screen } from '@testing-library/svelte';
import { runA11yTests, getByTestId } from '@equaltoai/greater-components-testing/vitest';
import YourComponent from './YourComponent.svelte';

test('component passes accessibility checks', async () => {
	const { container } = render(YourComponent, {
		props: { label: 'Test Button' },
	});

	const results = runA11yTests(container);
	expect(results.passed).toBe(true);

	// Test specific accessibility features
	const button = getByTestId(container, 'button');
	expect(button).toHaveAccessibleName('Test Button');
	expect(button).toBeFocusable();
	expect(button).toPassWCAGColorContrast('AA');
});
```

## Configuration

### Playwright Configuration

Create separate configs for different test types:

```typescript
// playwright.a11y.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/a11y',
	use: {
		baseURL: 'http://localhost:5173', // Component playground
	},
	projects: [
		{ name: 'chromium-a11y', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox-a11y', use: { ...devices['Desktop Firefox'] } },
	],
});
```

### Axe Configuration

Customize axe-core rules for your needs:

```typescript
import { defaultAxeConfig, strictAxeConfig } from '@equaltoai/greater-components-testing/a11y';

const customConfig = {
	...defaultAxeConfig,
	rules: {
		...defaultAxeConfig.rules,
		'color-contrast': { enabled: true },
		'focus-order-semantics': { enabled: true },
		// Disable specific rules if needed
		'duplicate-id': { enabled: false },
	},
};
```

## Testing Patterns

### Theme Testing

```typescript
import { testThemeAccessibility } from '@equaltoai/greater-components-testing/playwright';

test('accessible across all themes', async ({ page }) => {
	const results = await testThemeAccessibility(page, ['light', 'dark', 'highContrast']);

	Object.entries(results).forEach(([theme, result]) => {
		expect(result.violations, `${theme} theme should have no violations`).toHaveLength(0);
	});
});
```

### Density Testing

```typescript
import { testDensityAccessibility } from '@equaltoai/greater-components-testing/playwright';

test('accessible across all densities', async ({ page }) => {
	const results = await testDensityAccessibility(page, ['compact', 'comfortable', 'spacious']);

	Object.entries(results).forEach(([density, result]) => {
		expect(result.violations, `${density} density should have no violations`).toHaveLength(0);
	});
});
```

### Component-Specific Testing

```typescript
// For complex components like modals
test('modal accessibility', async ({ page }) => {
	await page.goto('/modal-story');

	// Test focus trap
	const trapResult = await testKeyboardTrap(page, '[role="dialog"]');
	expect(trapResult.passed).toBe(true);

	// Test escape key
	await page.keyboard.press('Escape');
	const modalClosed = (await page.locator('[role="dialog"]').count()) === 0;
	expect(modalClosed).toBe(true);

	// Test focus restoration
	const focusRestored = await page.locator(':focus').textContent();
	expect(focusRestored).toContain('Open Modal'); // trigger button
});
```

## CI/CD Integration

### GitHub Actions

The package includes a comprehensive CI workflow (`.github/workflows/a11y.yml`) that:

- Runs accessibility tests across all theme/density combinations
- Generates detailed reports with component scores
- Fails builds on critical violations
- Comments on PRs with accessibility status
- Publishes reports to GitHub Pages

### Local Development

```bash
# Run all accessibility tests
pnpm test:a11y

# Run visual regression tests
pnpm test:visual

# Generate accessibility report
pnpm report:a11y --theme=light --density=comfortable

# Check WCAG compliance
node scripts/check-a11y-compliance.js --standard=AA --fail-on-violations=critical,serious
```

## Available Test Utilities

### Axe Helpers (`@equaltoai/greater-components-testing/a11y`)

- `setupAxe()` - Configure axe with custom rules
- `runAxeTest()` - Execute accessibility tests
- `checkAccessibility()` - Validate and report violations
- `formatAxeResults()` - Structure violation data
- `meetsWCAGLevel()` - Check compliance level

### Keyboard Helpers

- `testTabOrder()` - Validate tab navigation sequence
- `testArrowKeyNavigation()` - Test arrow key interactions
- `testKeyboardTrap()` - Verify focus trapping
- `testKeyboardShortcuts()` - Validate shortcut functionality
- `testFocusVisible()` - Check focus indicator visibility
- `simulateKeyboardNavigation()` - Programmatic key simulation

### Focus Management

- `testFocusRestoration()` - Verify focus returns correctly
- `testRovingTabindex()` - Validate roving tabindex pattern
- `createAndTestFocusTrap()` - Create and test focus traps
- `getFocusableElements()` - Get all focusable elements
- `isElementFocusable()` - Check element focusability

### Contrast Testing

- `testElementContrast()` - Calculate color contrast ratios
- `testContainerContrast()` - Batch contrast testing
- `getContrastRatio()` - Compute contrast between colors
- `suggestColorAdjustment()` - Recommend contrast improvements

### ARIA Validation

- `validateARIA()` - Comprehensive ARIA attribute validation
- `hasAccessibleName()` - Check for accessible names
- `getAccessibleName()` - Compute accessible name
- `checkSemanticHTML()` - Validate semantic markup

### Screen Reader Testing

- `testScreenReaderCompat()` - Full screen reader compatibility
- `getAccessibleNameComputation()` - Name computation algorithm
- `announceToScreenReader()` - Test live region announcements
- `createLiveRegion()` - Create announcement regions

### Visual Regression

- `testFocusStateVisual()` - Focus indicator consistency
- `testAllInteractiveStatesVisual()` - All state variations
- `testHighContrastVisual()` - High contrast compliance
- `testReducedMotionVisual()` - Motion preference compliance

### Vitest Matchers

- `.toHaveAccessibleName()` - Assert accessible name
- `.toHaveRole()` - Assert ARIA role
- `.toBeAccessible()` - Overall accessibility check
- `.toPassWCAGColorContrast()` - Color contrast validation
- `.toBeFocusable()` - Focusability check
- `.toHaveValidAria()` - ARIA validation

## Report Generation

### Generate HTML Report

```bash
node scripts/generate-a11y-report.js \
  --input=test-results \
  --output=reports/accessibility-report.html \
  --format=html \
  --theme=light \
  --include-recommendations
```

### Generate JSON Report

```bash
node scripts/generate-a11y-report.js \
  --format=json \
  --output=accessibility-data.json
```

### Comprehensive Multi-Configuration Report

```bash
node scripts/generate-comprehensive-report.js \
  --input=test-artifacts \
  --output=comprehensive-report.html \
  --format=html \
  --include-recommendations
```

## Manual Testing Checklist

The package includes a comprehensive [keyboard testing checklist](./KEYBOARD_TESTING_CHECKLIST.md) for manual validation covering:

- Basic tab navigation principles
- Component-specific keyboard interactions
- Expected keyboard shortcuts for each component type
- Testing procedures and tools
- Acceptance criteria and performance standards

## Best Practices

### 1. Test Early and Often

```typescript
// Include accessibility tests in your component tests
describe('MyComponent', () => {
	test('renders correctly', () => {
		/* visual test */
	});
	test('behaves correctly', () => {
		/* interaction test */
	});
	test('is accessible', () => {
		/* accessibility test */
	});
});
```

### 2. Use Semantic HTML First

```typescript
// Good: Semantic button
<button onclick={handleClick}>Submit</button>

// Avoid: div with button role
<div role="button" tabindex="0" onclick={handleClick}>Submit</div>
```

### 3. Test Real User Scenarios

```typescript
test('user can complete form with keyboard only', async ({ page }) => {
	await page.keyboard.press('Tab'); // Focus first field
	await page.keyboard.type('John Doe');
	await page.keyboard.press('Tab'); // Move to next field
	await page.keyboard.type('john@example.com');
	await page.keyboard.press('Enter'); // Submit form

	await expect(page.locator('[role="alert"]')).toContainText('Success');
});
```

### 4. Include Multiple Themes/Densities

```typescript
const testConfigurations = [
	{ theme: 'light', density: 'comfortable' },
	{ theme: 'dark', density: 'compact' },
	{ theme: 'highContrast', density: 'spacious' },
];

testConfigurations.forEach(({ theme, density }) => {
	test(`accessible in ${theme} theme with ${density} density`, async ({ page }) => {
		await checkAccessibility(page, { theme, density });
	});
});
```

### 5. Validate Error States

```typescript
test('error states are accessible', async ({ page }) => {
	// Trigger validation error
	await page.locator('input[required]').blur();

	// Check error is announced
	const errorMessage = page.locator('[role="alert"]');
	await expect(errorMessage).toBeVisible();

	// Verify aria-invalid is set
	const input = page.locator('input[required]');
	await expect(input).toHaveAttribute('aria-invalid', 'true');
});
```

## Troubleshooting

### Common Issues

**Axe violations not being caught**

- Ensure axe-core is properly loaded with `setupAxe()`
- Check that rules are enabled in your configuration
- Verify the component is fully rendered before testing

**Keyboard tests failing**

- Wait for component to be interactive before testing
- Check that focus management is properly implemented
- Ensure event handlers are attached

**Visual regression differences**

- Use `animations: 'disabled'` for consistent screenshots
- Set appropriate threshold values (0.1% for accessibility tests)
- Ensure consistent viewport sizes and font rendering

**False positives in CI**

- Use `waitForLoadState('networkidle')` before testing
- Add appropriate timeouts for dynamic content
- Configure browser launch options for consistency

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
DEBUG=greater:testing pnpm test:a11y
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

AGPL-3.0-only - See [LICENSE](../../LICENSE) for details.
