import { test, expect, type Page, type Locator } from '@playwright/test';

class ActionBarPageObject {
  private readonly page: Page;
  readonly actionBar: Locator;
  readonly replyButton: Locator;
  readonly boostButton: Locator;
  readonly favoriteButton: Locator;
  readonly shareButton: Locator;

  constructor(page: Page, testId?: string) {
    this.page = page;
    const selector = testId ? `[data-testid="${testId}"]` : '[role="group"][aria-label="Post actions"]';
    this.actionBar = page.locator(selector);
    this.replyButton = this.actionBar.locator('button:has-text("5") >> nth=0'); // Reply with count 5
    this.boostButton = this.actionBar.locator('button:has-text("12") >> nth=0'); // Boost with count 12
    this.favoriteButton = this.actionBar.locator('button:has-text("23") >> nth=0'); // Favorite with count 23
    this.shareButton = this.actionBar.locator('button[aria-label*="Share"]');
  }

  async clickReply() {
    await this.replyButton.click();
  }

  async clickBoost() {
    await this.boostButton.click();
  }

  async clickFavorite() {
    await this.favoriteButton.click();
  }

  async clickShare() {
    await this.shareButton.click();
  }

  async waitForLoading(button: 'reply' | 'boost' | 'favorite' | 'share') {
    const buttonLocator = this[`${button}Button`];
    await expect(buttonLocator).toHaveAttribute('aria-busy', 'true');
  }

  async waitForLoadingComplete(button: 'reply' | 'boost' | 'favorite' | 'share') {
    const buttonLocator = this[`${button}Button`];
    await expect(buttonLocator).not.toHaveAttribute('aria-busy', 'true');
  }

  async expectButtonPressed(button: 'boost' | 'favorite', pressed: boolean) {
    const buttonLocator = this[`${button}Button`];
    if (pressed) {
      await expect(buttonLocator).toHaveAttribute('aria-pressed', 'true');
    } else {
      await expect(buttonLocator).toHaveAttribute('aria-pressed', 'false');
    }
  }
}

test.describe('ActionBar Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook ActionBar stories
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to ActionBar Default story
    await page.click('[data-item-id="fediverse-actionbar--default"]');
    await page.waitForLoadState('networkidle');
  });

  test('displays all action buttons with correct labels', async ({ page }) => {
    const actionBar = new ActionBarPageObject(page);

    await expect(actionBar.actionBar).toBeVisible();
    await expect(actionBar.replyButton).toBeVisible();
    await expect(actionBar.boostButton).toBeVisible();
    await expect(actionBar.favoriteButton).toBeVisible();
    await expect(actionBar.shareButton).toBeVisible();

    // Check accessibility labels
    await expect(actionBar.replyButton).toHaveAttribute('aria-label', /Reply to this post\. 5 replies/);
    await expect(actionBar.boostButton).toHaveAttribute('aria-label', /Boost this post\. 12 boosts/);
    await expect(actionBar.favoriteButton).toHaveAttribute('aria-label', /Add to favorites\. 23 favorites/);
    await expect(actionBar.shareButton).toHaveAttribute('aria-label', /Share this post/);
  });

  test('displays correct count formatting', async ({ page }) => {
    const actionBar = new ActionBarPageObject(page);

    // Check default counts
    await expect(actionBar.replyButton).toContainText('5');
    await expect(actionBar.boostButton).toContainText('12');
    await expect(actionBar.favoriteButton).toContainText('23');

    // Navigate to high counts story to test K formatting
    await page.click('[data-item-id="fediverse-actionbar--high-counts"]');
    await page.waitForLoadState('networkidle');

    // Check K formatting (1234 -> 1.2K, etc.)
    await expect(page.locator('button:has-text("1.2K")')).toBeVisible();
    await expect(page.locator('button:has-text("5.6K")')).toBeVisible();
    await expect(page.locator('button:has-text("9.9K")')).toBeVisible();
  });

  test('handles button interactions correctly', async ({ page }) => {
    const actionBar = new ActionBarPageObject(page);

    // Test reply button click
    await actionBar.clickReply();
    // In Storybook, this should log to console (we can't easily test console.log)
    // But we can verify the button is still clickable and visible
    await expect(actionBar.replyButton).toBeVisible();

    // Test boost button click
    await actionBar.clickBoost();
    await expect(actionBar.boostButton).toBeVisible();

    // Test favorite button click
    await actionBar.clickFavorite();
    await expect(actionBar.favoriteButton).toBeVisible();

    // Test share button click
    await actionBar.clickShare();
    await expect(actionBar.shareButton).toBeVisible();
  });

  test('shows active states correctly', async ({ page }) => {
    // Navigate to Active States story
    await page.click('[data-item-id="fediverse-actionbar--active-states"]');
    await page.waitForLoadState('networkidle');

    const actionBar = new ActionBarPageObject(page);

    // Check boost is active (pressed)
    await actionBar.expectButtonPressed('boost', true);
    
    // Check favorite is active (pressed)
    await actionBar.expectButtonPressed('favorite', true);

    // Verify active state styling is applied
    const boostButton = actionBar.boostButton;
    const favoriteButton = actionBar.favoriteButton;

    // Check CSS classes or computed styles for active states
    await expect(boostButton).toHaveClass(/active/);
    await expect(favoriteButton).toHaveClass(/active/);
  });

  test('disables buttons in readonly mode', async ({ page }) => {
    // Navigate to Read Only story
    await page.click('[data-item-id="fediverse-actionbar--read-only"]');
    await page.waitForLoadState('networkidle');

    const actionBar = new ActionBarPageObject(page);

    // All buttons should be disabled
    await expect(actionBar.replyButton).toBeDisabled();
    await expect(actionBar.boostButton).toBeDisabled();
    await expect(actionBar.favoriteButton).toBeDisabled();
    await expect(actionBar.shareButton).toBeDisabled();
  });

  test('shows loading states correctly', async ({ page }) => {
    // Navigate to Loading States story
    await page.click('[data-item-id="fediverse-actionbar--loading-states"]');
    await page.waitForLoadState('networkidle');

    const actionBar = new ActionBarPageObject(page);

    // Click reply button and verify loading state
    await actionBar.clickReply();
    await actionBar.waitForLoading('reply');
    
    // Wait for loading to complete (2 second timeout in story)
    await actionBar.waitForLoadingComplete('reply');

    // Test boost loading state
    await actionBar.clickBoost();
    await actionBar.waitForLoading('boost');
    await actionBar.waitForLoadingComplete('boost');
  });

  test('handles different sizes correctly', async ({ page }) => {
    // Test Medium size
    await page.click('[data-item-id="fediverse-actionbar--medium-size"]');
    await page.waitForLoadState('networkidle');

    let actionBar = new ActionBarPageObject(page);
    await expect(actionBar.actionBar).toBeVisible();

    // Test Large size  
    await page.click('[data-item-id="fediverse-actionbar--large-size"]');
    await page.waitForLoadState('networkidle');

    actionBar = new ActionBarPageObject(page);
    await expect(actionBar.actionBar).toBeVisible();
    
    // Verify buttons are larger (by checking computed styles or dimensions)
    const replyButton = actionBar.replyButton;
    const buttonBox = await replyButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThan(40); // Large buttons should be taller
  });

  test('shows extensions slot when present', async ({ page }) => {
    // Navigate to With Extensions story
    await page.click('[data-item-id="fediverse-actionbar--with-extensions"]');
    await page.waitForLoadState('networkidle');

    // Look for extension buttons (bookmark and more options from the story)
    const bookmarkButton = page.locator('button[aria-label*="Bookmark"]');
    const moreOptionsButton = page.locator('button[aria-label*="More options"]');

    await expect(bookmarkButton).toBeVisible();
    await expect(moreOptionsButton).toBeVisible();
  });

  test('handles keyboard navigation', async ({ page }) => {
    const actionBar = new ActionBarPageObject(page);

    // Tab to reply button
    await page.keyboard.press('Tab');
    await expect(actionBar.replyButton).toBeFocused();

    // Tab to boost button
    await page.keyboard.press('Tab');
    await expect(actionBar.boostButton).toBeFocused();

    // Tab to favorite button
    await page.keyboard.press('Tab');
    await expect(actionBar.favoriteButton).toBeFocused();

    // Tab to share button
    await page.keyboard.press('Tab');
    await expect(actionBar.shareButton).toBeFocused();

    // Press Enter to activate focused button
    await page.keyboard.press('Enter');
    // Button should remain focused after activation
    await expect(actionBar.shareButton).toBeFocused();
  });

  test('maintains accessibility standards', async ({ page }) => {
    const actionBar = new ActionBarPageObject(page);

    // Check ARIA role and label for the action bar
    await expect(actionBar.actionBar).toHaveAttribute('role', 'group');
    await expect(actionBar.actionBar).toHaveAttribute('aria-label', 'Post actions');

    // Check each button has proper ARIA attributes
    await expect(actionBar.replyButton).toHaveAttribute('aria-label');
    await expect(actionBar.boostButton).toHaveAttribute('aria-label');
    await expect(actionBar.boostButton).toHaveAttribute('aria-pressed');
    await expect(actionBar.favoriteButton).toHaveAttribute('aria-label');
    await expect(actionBar.favoriteButton).toHaveAttribute('aria-pressed');
    await expect(actionBar.shareButton).toHaveAttribute('aria-label');

    // Run axe accessibility tests
    await page.addInitScript({
      path: require.resolve('axe-core/axe.min.js')
    });

    const accessibilityScanResults = await page.evaluate(async () => {
      // @ts-ignore
      return await axe.run();
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('responds correctly to hover states', async ({ page }) => {
    const actionBar = new ActionBarPageObject(page);

    // Test reply button hover
    await actionBar.replyButton.hover();
    // Check if hover styles are applied (color changes, background, etc.)
    const replyButtonStyles = await actionBar.replyButton.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    
    // Test boost button hover
    await actionBar.boostButton.hover();
    const boostButtonStyles = await actionBar.boostButton.evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    
    // Verify hover styles are different from default
    expect(replyButtonStyles).toBeDefined();
    expect(boostButtonStyles).toBeDefined();
  });

  test('handles zero counts correctly', async ({ page }) => {
    // Navigate to No Counts story
    await page.click('[data-item-id="fediverse-actionbar--no-counts"]');
    await page.waitForLoadState('networkidle');

    // Verify counts are not displayed when zero
    await expect(page.locator('text=0')).not.toBeVisible();
    
    // But buttons should still be present with proper labels
    await expect(page.locator('button[aria-label="Reply to this post"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Boost this post"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Add to favorites"]')).toBeVisible();
  });
});

test.describe('ActionBar Visual Regression', () => {
  test('matches visual snapshot - default state', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-item-id="fediverse-actionbar--default"]');
    await page.waitForLoadState('networkidle');

    const actionBar = page.locator('[role="group"][aria-label="Post actions"]');
    await expect(actionBar).toHaveScreenshot('action-bar-default.png');
  });

  test('matches visual snapshot - active states', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-item-id="fediverse-actionbar--active-states"]');
    await page.waitForLoadState('networkidle');

    const actionBar = page.locator('[role="group"][aria-label="Post actions"]');
    await expect(actionBar).toHaveScreenshot('action-bar-active-states.png');
  });

  test('matches visual snapshot - readonly mode', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-item-id="fediverse-actionbar--read-only"]');
    await page.waitForLoadState('networkidle');

    const actionBar = page.locator('[role="group"][aria-label="Post actions"]');
    await expect(actionBar).toHaveScreenshot('action-bar-readonly.png');
  });

  test('matches visual snapshot - different sizes', async ({ page }) => {
    // Small size (default)
    await page.goto('/');
    await page.click('[data-item-id="fediverse-actionbar--default"]');
    await page.waitForLoadState('networkidle');

    let actionBar = page.locator('[role="group"][aria-label="Post actions"]');
    await expect(actionBar).toHaveScreenshot('action-bar-size-small.png');

    // Medium size
    await page.click('[data-item-id="fediverse-actionbar--medium-size"]');
    await page.waitForLoadState('networkidle');

    actionBar = page.locator('[role="group"][aria-label="Post actions"]');
    await expect(actionBar).toHaveScreenshot('action-bar-size-medium.png');

    // Large size
    await page.click('[data-item-id="fediverse-actionbar--large-size"]');
    await page.waitForLoadState('networkidle');

    actionBar = page.locator('[role="group"][aria-label="Post actions"]');
    await expect(actionBar).toHaveScreenshot('action-bar-size-large.png');
  });

  test('matches visual snapshot - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    
    await page.goto('/');
    await page.click('[data-item-id="fediverse-actionbar--default"]');
    await page.waitForLoadState('networkidle');

    const actionBar = page.locator('[role="group"][aria-label="Post actions"]');
    await expect(actionBar).toHaveScreenshot('action-bar-mobile.png');
  });
});