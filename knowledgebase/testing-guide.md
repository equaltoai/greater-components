# Greater Components Testing Guide

Comprehensive testing strategies for unit, E2E, accessibility, and performance testing.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Unit Testing with Vitest](#unit-testing-with-vitest)
- [E2E Testing with Playwright](#e2e-testing-with-playwright)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Testing Best Practices](#testing-best-practices)

---

## Testing Philosophy

Greater Components follows a comprehensive testing approach:

1. **Unit Tests** - Test component logic and behavior
2. **E2E Tests** - Test user workflows and interactions
3. **Accessibility Tests** - Ensure WCAG compliance
4. **Performance Tests** - Verify performance budgets
5. **Visual Tests** - Catch visual regressions

### Coverage Targets

- **Overall:** 80%+ code coverage
- **Core Components:** 90%+ coverage
- **Accessibility:** 100% coverage
- **Critical Paths:** 100% coverage

---

## Unit Testing with Vitest

### Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
});
```

```typescript
// vitest-setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### Component Testing

```typescript
import { test, expect, vi } from 'vitest';
import { render, fireEvent } from '@equaltoai/greater-components-testing';
import { Button } from '@equaltoai/greater-components-primitives';

test('button renders correctly', () => {
  const { getByRole } = render(Button, {
    props: {
      children: 'Click Me',
      variant: 'solid',
    },
  });
  
  const button = getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent('Click Me');
  expect(button).toHaveClass('gr-button--solid');
});

test('button handles click events', () => {
  const handleClick = vi.fn();
  const { getByRole } = render(Button, {
    props: {
      onclick: handleClick,
      children: 'Click',
    },
  });
  
  fireEvent.click(getByRole('button'));
  
  expect(handleClick).toHaveBeenCalledOnce();
});

test('button shows loading state', () => {
  const { getByRole } = render(Button, {
    props: {
      loading: true,
      children: 'Loading',
    },
  });
  
  const button = getByRole('button');
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toHaveClass('gr-button--loading');
});

test('button is disabled when disabled prop is true', () => {
  const handleClick = vi.fn();
  const { getByRole } = render(Button, {
    props: {
      disabled: true,
      onclick: handleClick,
      children: 'Disabled',
    },
  });
  
  const button = getByRole('button');
  expect(button).toBeDisabled();
  
  fireEvent.click(button);
  expect(handleClick).not.toHaveBeenCalled();
});
```

### Testing State Changes

```typescript
import { test, expect } from 'vitest';
import { render, fireEvent } from '@equaltoai/greater-components-testing';
import { TextField } from '@equaltoai/greater-components-primitives';

test('textfield updates value on input', async () => {
  let value = $state('');
  const handleInput = (newValue: string) => {
    value = newValue;
  };
  
  const { getByRole } = render(TextField, {
    props: {
      value,
      oninput: handleInput,
      label: 'Name',
    },
  });
  
  const input = getByRole('textbox');
  await fireEvent.input(input, { target: { value: 'John' } });
  
  expect(value).toBe('John');
});

test('textfield shows error message', () => {
  const { getByText } = render(TextField, {
    props: {
      value: '',
      error: 'This field is required',
      label: 'Email',
    },
  });
  
  expect(getByText('This field is required')).toBeInTheDocument();
});
```

### Testing Async Operations

```typescript
import { test, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@equaltoai/greater-components-testing';
import { createTimelineStore } from '@equaltoai/greater-components-fediverse';

test('timeline loads and displays statuses', async () => {
  const mockAdapter = {
    getTimeline: vi.fn().mockResolvedValue([
      { id: '1', content: 'First post' },
      { id: '2', content: 'Second post' },
    ]),
  };
  
  const timeline = createTimelineStore({
    adapter: mockAdapter,
    type: 'HOME',
  });
  
  await waitFor(() => {
    expect(timeline.items).toHaveLength(2);
    expect(timeline.isLoading).toBe(false);
  });
  
  expect(timeline.items[0].content).toBe('First post');
});

test('timeline handles errors', async () => {
  const mockAdapter = {
    getTimeline: vi.fn().mockRejectedValue(new Error('Network error')),
  };
  
  let errorMessage = '';
  const timeline = createTimelineStore({
    adapter: mockAdapter,
    type: 'HOME',
    onError: (error) => {
      errorMessage = error.message;
    },
  });
  
  await waitFor(() => {
    expect(timeline.error).toBeTruthy();
    expect(errorMessage).toBe('Network error');
  });
});
```

### Testing Snippets

```typescript
import { test, expect } from 'vitest';
import { render } from '@equaltoai/greater-components-testing';
import { Modal } from '@equaltoai/greater-components-primitives';

test('modal renders footer snippet', () => {
  const { getByText } = render(Modal, {
    props: {
      open: true,
      title: 'Test Modal',
    },
    slots: {
      default: 'Modal content',
      footer: '<button>Custom Footer</button>',
    },
  });
  
  expect(getByText('Modal content')).toBeInTheDocument();
  expect(getByText('Custom Footer')).toBeInTheDocument();
});
```

---

## E2E Testing with Playwright

### Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
import { test, expect } from '@playwright/test';

test('user can create a post', async ({ page }) => {
  await page.goto('/');
  
  // Click compose button
  await page.click('[aria-label="Compose new post"]');
  
  // Wait for modal
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  
  // Fill in post content
  await page.fill('[aria-label="Post content"]', 'Hello Fediverse!');
  
  // Click post button
  await page.click('button:has-text("Post")');
  
  // Verify post appears in timeline
  await expect(page.locator('text=Hello Fediverse!')).toBeVisible();
});

test('timeline loads and displays posts', async ({ page }) => {
  await page.goto('/timeline');
  
  // Wait for timeline to load
  await expect(page.locator('[data-testid="timeline"]')).toBeVisible();
  
  // Verify posts are displayed
  const posts = await page.locator('[data-testid="status"]').count();
  expect(posts).toBeGreaterThan(0);
});

test('user can interact with posts', async ({ page }) => {
  await page.goto('/timeline');
  
  // Find first post
  const firstPost = page.locator('[data-testid="status"]').first();
  
  // Click favorite button
  await firstPost.locator('[aria-label="Favorite"]').click();
  
  // Verify favorite count increased
  await expect(firstPost.locator('[aria-label*="favorited"]')).toBeVisible();
  
  // Click boost button
  await firstPost.locator('[aria-label="Boost"]').click();
  
  // Verify boost indicator
  await expect(firstPost.locator('[aria-label*="boosted"]')).toBeVisible();
});

test('keyboard navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Tab to compose button
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  
  // Press Enter to open modal
  await page.keyboard.press('Enter');
  
  // Verify modal opened
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  
  // Press Escape to close
  await page.keyboard.press('Escape');
  
  // Verify modal closed
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});

test('theme switching works', async ({ page }) => {
  await page.goto('/');
  
  // Click theme switcher
  await page.click('[aria-label="Switch theme"]');
  
  // Select dark theme
  await page.click('text=Dark');
  
  // Verify dark theme applied
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
});
```

### Testing Mobile Interactions

```typescript
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test('mobile navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Open mobile menu
  await page.click('[aria-label="Open menu"]');
  
  // Verify menu visible
  await expect(page.locator('[role="navigation"]')).toBeVisible();
  
  // Click timeline link
  await page.click('a:has-text("Timeline")');
  
  // Verify navigation
  await expect(page).toHaveURL('/timeline');
});

test('mobile modal takes full screen', async ({ page }) => {
  await page.goto('/');
  
  await page.click('[aria-label="Compose"]');
  
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();
  
  // Verify modal is full screen on mobile
  const box = await modal.boundingBox();
  expect(box?.width).toBeGreaterThan(350); // Close to viewport width
});
```

---

## Accessibility Testing

### Automated Testing with axe-core

```typescript
import { test, expect } from 'vitest';
import { render } from '@equaltoai/greater-components-testing';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@equaltoai/greater-components-primitives';

expect.extend(toHaveNoViolations);

test('button has no accessibility violations', async () => {
  const { container } = render(Button, {
    props: { children: 'Click Me' },
  });
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('modal has no accessibility violations', async () => {
  const { container } = render(Modal, {
    props: {
      open: true,
      title: 'Test Modal',
    },
  });
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Keyboard Testing Checklist

- [ ] All interactive elements reachable via Tab
- [ ] Tab order logical and follows visual flow
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/menus
- [ ] Arrow keys navigate lists/menus
- [ ] Focus indicators clearly visible
- [ ] No keyboard traps
- [ ] Skip links work

### Screen Reader Testing

**Test with:**
- **Windows:** NVDA or JAWS
- **macOS:** VoiceOver
- **Linux:** Orca
- **iOS:** VoiceOver
- **Android:** TalkBack

**Verify:**
- [ ] All content announced correctly
- [ ] Interactive elements identified
- [ ] State changes announced
- [ ] Error messages read
- [ ] Loading states announced
- [ ] Form labels associated

### Color Contrast Testing

```typescript
import { test, expect } from '@playwright/test';

test('text has sufficient contrast', async ({ page }) => {
  await page.goto('/');
  
  // Check contrast with Playwright axe integration
  const accessibilityScanResults = await page.accessibility.snapshot();
  
  // Check specific elements
  const button = page.locator('button').first();
  const backgroundColor = await button.evaluate(
    (el) => window.getComputedStyle(el).backgroundColor
  );
  const color = await button.evaluate(
    (el) => window.getComputedStyle(el).color
  );
  
  // Verify contrast ratio (minimum 4.5:1 for normal text)
  // Use contrast checking library
});
```

---

## Performance Testing

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:5173
            http://localhost:5173/timeline
          configPath: './lighthouserc.json'
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "pnpm preview",
      "url": ["http://localhost:4173"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Bundle Size Testing

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ... other config
    reporters: ['default', 'bundle-size'],
  },
});
```

```typescript
// tests/bundle-size.test.ts
import { test, expect } from 'vitest';
import { stat } from 'fs/promises';

test('button bundle size is under limit', async () => {
  const stats = await stat('./dist/Button.js');
  const sizeInKB = stats.size / 1024;
  
  expect(sizeInKB).toBeLessThan(3); // 3KB limit
});

test('total primitives bundle is under limit', async () => {
  const stats = await stat('./packages/primitives/dist/index.js');
  const sizeInKB = stats.size / 1024;
  
  expect(sizeInKB).toBeLessThan(30); // 30KB limit
});
```

---

## Visual Regression Testing

### Playwright Visual Comparisons

```typescript
import { test, expect } from '@playwright/test';

test('button visual regression', async ({ page }) => {
  await page.goto('/components/button');
  
  const button = page.locator('[data-testid="button-solid"]');
  
  // Take screenshot
  await expect(button).toHaveScreenshot('button-solid.png');
  
  // Hover state
  await button.hover();
  await expect(button).toHaveScreenshot('button-solid-hover.png');
  
  // Focus state
  await button.focus();
  await expect(button).toHaveScreenshot('button-solid-focus.png');
});

test('modal visual regression', async ({ page }) => {
  await page.goto('/components/modal');
  
  await page.click('button:has-text("Open Modal")');
  
  // Wait for animation
  await page.waitForTimeout(300);
  
  // Capture modal
  await expect(page).toHaveScreenshot('modal-open.png', {
    fullPage: true,
  });
});
```

---

## Testing Best Practices

### Test Organization

```
tests/
├── unit/
│   ├── components/
│   │   ├── Button.test.ts
│   │   ├── Modal.test.ts
│   │   └── TextField.test.ts
│   └── stores/
│       └── timeline.test.ts
├── e2e/
│   ├── timeline.spec.ts
│   ├── compose.spec.ts
│   └── profile.spec.ts
├── a11y/
│   ├── keyboard.spec.ts
│   └── screen-reader.spec.ts
└── visual/
    └── components.spec.ts
```

### Test Naming

```typescript
// GOOD: Descriptive test names
test('button calls onclick when clicked', () => {});
test('modal closes when escape key is pressed', () => {});
test('textfield shows error when validation fails', () => {});

// AVOID: Vague test names
test('button works', () => {});
test('test modal', () => {});
```

### Test Independence

```typescript
// GOOD: Each test is independent
test('button renders', () => {
  const { getByRole } = render(Button);
  expect(getByRole('button')).toBeInTheDocument();
});

test('button handles clicks', () => {
  const onclick = vi.fn();
  const { getByRole } = render(Button, { props: { onclick } });
  fireEvent.click(getByRole('button'));
  expect(onclick).toHaveBeenCalled();
});

// AVOID: Tests depending on each other
let button;
test('setup button', () => {
  button = render(Button);
});
test('button works', () => {
  fireEvent.click(button.getByRole('button')); // ❌ Depends on previous test
});
```

### Mocking

```typescript
// Mock adapters for isolation
const mockAdapter = {
  getTimeline: vi.fn().mockResolvedValue([]),
  getStatus: vi.fn().mockResolvedValue({}),
  createStatus: vi.fn().mockResolvedValue({}),
};

// Mock timers
vi.useFakeTimers();
// ... test code
vi.runAllTimers();
vi.useRealTimers();

// Mock fetch
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ data: [] }),
});
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:unit
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Check accessibility
        run: pnpm test:a11y
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Related Documentation

- [Development Guidelines](./development-guidelines.md) - Coding standards
- [Core Patterns](./core-patterns.md) - Usage patterns
- [API Reference](./api-reference.md) - Complete API documentation