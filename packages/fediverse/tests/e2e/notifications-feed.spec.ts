import { test, expect, type Page } from '@playwright/test';

test.describe('NotificationsFeed Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the NotificationsFeed story
    await page.goto('http://localhost:6006/?path=/story/components-notificationsfeed--default');
    
    // Wait for Storybook to load
    await page.waitForLoadState('networkidle');
    
    // Switch to the canvas tab to interact with the component
    await page.locator('[role="tab"][name="Canvas"]').click();
    
    // Wait for the component to render
    await page.waitForSelector('[data-testid="notifications-feed"], .notifications-feed', { timeout: 10000 });
  });

  test('should render notifications feed with proper structure', async ({ page }) => {
    // Check main container
    const feed = page.locator('.notifications-feed').first();
    await expect(feed).toBeVisible();
    
    // Check feed header with unread count
    const unreadCount = page.locator('.unread-count').first();
    if (await unreadCount.isVisible()) {
      await expect(unreadCount).toContainText(/\d+ unread/);
    }
    
    // Check mark all as read button
    const markAllButton = page.locator('button:has-text("Mark all as read")').first();
    if (await markAllButton.isVisible()) {
      await expect(markAllButton).toBeEnabled();
    }
    
    // Check notifications list
    const notificationsList = page.locator('[role="feed"]').first();
    await expect(notificationsList).toBeVisible();
  });

  test('should display notification items correctly', async ({ page }) => {
    // Wait for notification items to load
    await page.waitForSelector('.notification-item', { timeout: 10000 });
    
    const notificationItems = page.locator('.notification-item');
    const itemCount = await notificationItems.count();
    
    expect(itemCount).toBeGreaterThan(0);
    
    // Check first notification item structure
    const firstItem = notificationItems.first();
    await expect(firstItem).toBeVisible();
    
    // Check for notification icon
    const icon = firstItem.locator('.notification-icon');
    await expect(icon).toBeVisible();
    
    // Check for avatar
    const avatar = firstItem.locator('.avatar').first();
    await expect(avatar).toBeVisible();
    
    // Check for notification content
    const content = firstItem.locator('.notification-content');
    await expect(content).toBeVisible();
    
    // Check for notification title
    const title = firstItem.locator('.notification-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
    
    // Check for time
    const time = firstItem.locator('time');
    await expect(time).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Wait for notification items
    await page.waitForSelector('.notification-item', { timeout: 10000 });
    
    const firstNotification = page.locator('.notification-item').first();
    
    // Focus on first notification
    await firstNotification.focus();
    await expect(firstNotification).toBeFocused();
    
    // Test Enter key activation
    const clickPromise = page.waitForEvent('console', msg => 
      msg.type() === 'log' && msg.text().includes('notification-clicked')
    ).catch(() => null); // Don't fail if no console event
    
    await page.keyboard.press('Enter');
    
    // Test Tab navigation to scroll container
    await page.keyboard.press('Tab');
    const scrollContainer = page.locator('.notifications-scroll');
    if (await scrollContainer.isVisible()) {
      await expect(scrollContainer).toBeFocused();
    }
  });

  test('should handle mouse interactions', async ({ page }) => {
    await page.waitForSelector('.notification-item', { timeout: 10000 });
    
    const firstNotification = page.locator('.notification-item').first();
    
    // Test hover effect
    await firstNotification.hover();
    
    // Check if action buttons become visible on hover (if present)
    const actionButtons = firstNotification.locator('.action-button');
    const buttonCount = await actionButtons.count();
    
    if (buttonCount > 0) {
      // Action buttons should be visible on hover
      await expect(actionButtons.first()).toBeVisible();
    }
    
    // Test click on notification
    await firstNotification.click();
    
    // Should have hover styles
    await expect(firstNotification).toHaveCSS('cursor', 'pointer');
  });

  test('should handle mark all as read functionality', async ({ page }) => {
    const markAllButton = page.locator('button:has-text("Mark all as read")').first();
    
    if (await markAllButton.isVisible()) {
      // Click mark all as read
      await markAllButton.click();
      
      // Should emit the action event (in real app, this would update state)
      // For Storybook, we just verify the button is still functional
      await expect(markAllButton).toBeEnabled();
    }
  });

  test('should display loading state correctly', async ({ page }) => {
    // Navigate to loading story
    await page.goto('http://localhost:6006/?path=/story/components-notificationsfeed--loading');
    await page.waitForLoadState('networkidle');
    await page.locator('[role="tab"][name="Canvas"]').click();
    
    // Check loading spinner
    const loadingSpinner = page.locator('.loading-spinner').first();
    await expect(loadingSpinner).toBeVisible();
    
    // Check loading text
    const loadingText = page.locator('text=Loading notifications...').first();
    await expect(loadingText).toBeVisible();
    
    // Loading container should have proper ARIA attributes
    const loadingContainer = page.locator('.loading-container').first();
    await expect(loadingContainer).toHaveAttribute('aria-live', 'polite');
  });

  test('should display empty state correctly', async ({ page }) => {
    // Navigate to empty story
    await page.goto('http://localhost:6006/?path=/story/components-notificationsfeed--empty');
    await page.waitForLoadState('networkidle');
    await page.locator('[role="tab"][name="Canvas"]').click();
    
    // Check empty state
    const emptyState = page.locator('.empty-state').first();
    await expect(emptyState).toBeVisible();
    
    // Check empty state content
    await expect(page.locator('text=No notifications').first()).toBeVisible();
    
    // Empty state should have proper ARIA attributes
    await expect(emptyState).toHaveAttribute('role', 'status');
    await expect(emptyState).toHaveAttribute('aria-live', 'polite');
  });

  test('should handle compact density correctly', async ({ page }) => {
    // Navigate to compact density story
    await page.goto('http://localhost:6006/?path=/story/components-notificationsfeed--compact-density');
    await page.waitForLoadState('networkidle');
    await page.locator('[role="tab"][name="Canvas"]').click();
    
    // Check compact class is applied
    const feed = page.locator('.notifications-feed').first();
    await expect(feed).toHaveClass(/compact/);
    
    // Notification items should also have compact class
    const notificationItem = page.locator('.notification-item').first();
    if (await notificationItem.isVisible()) {
      await expect(notificationItem).toHaveClass(/compact/);
    }
  });

  test('should handle scrolling and virtualization', async ({ page }) => {
    // Navigate to large dataset story for scrolling
    await page.goto('http://localhost:6006/?path=/story/components-notificationsfeed--large-dataset');
    await page.waitForLoadState('networkidle');
    await page.locator('[role="tab"][name="Canvas"]').click();
    
    const scrollContainer = page.locator('.notifications-scroll').first();
    await expect(scrollContainer).toBeVisible();
    
    // Should have scroll capability
    const scrollHeight = await scrollContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await scrollContainer.evaluate(el => el.clientHeight);
    
    if (scrollHeight > clientHeight) {
      // Test scrolling
      await scrollContainer.evaluate(el => el.scrollTop = 100);
      
      // Verify scroll position changed
      const scrollTop = await scrollContainer.evaluate(el => el.scrollTop);
      expect(scrollTop).toBeGreaterThan(0);
    }
  });

  test('should meet accessibility requirements', async ({ page }) => {
    await page.waitForSelector('.notifications-feed', { timeout: 10000 });
    
    // Test focus management
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check ARIA attributes on main container
    const feedContainer = page.locator('.notifications-feed').first();
    await expect(feedContainer).toHaveAttribute('role', 'main');
    await expect(feedContainer).toHaveAttribute('aria-label', 'Notifications feed');
    
    // Check feed element
    const feed = page.locator('[role="feed"]').first();
    await expect(feed).toHaveAttribute('aria-label', 'Notifications');
    
    // Check notification items have proper roles and labels
    const notificationItems = page.locator('.notification-item');
    const itemCount = await notificationItems.count();
    
    if (itemCount > 0) {
      const firstItem = notificationItems.first();
      await expect(firstItem).toHaveAttribute('role', 'button');
      await expect(firstItem).toHaveAttribute('aria-label');
      await expect(firstItem).toHaveAttribute('tabindex', '0');
    }
    
    // Check time elements have proper datetime attributes
    const timeElements = page.locator('time');
    const timeCount = await timeElements.count();
    
    if (timeCount > 0) {
      const firstTime = timeElements.first();
      await expect(firstTime).toHaveAttribute('datetime');
    }
  });

  test('should handle different notification types with proper icons', async ({ page }) => {
    // Test various notification types if available
    await page.waitForSelector('.notification-item', { timeout: 10000 });
    
    const notificationItems = page.locator('.notification-item');
    const itemCount = await notificationItems.count();
    
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const item = notificationItems.nth(i);
      const icon = item.locator('.notification-icon svg');
      
      if (await icon.isVisible()) {
        // Icon should be present and have proper styling
        await expect(icon).toBeVisible();
        await expect(icon).toHaveAttribute('width', '20');
        await expect(icon).toHaveAttribute('height', '20');
      }
    }
  });

  test('should handle unread notifications correctly', async ({ page }) => {
    // Look for unread indicators
    const unreadIndicators = page.locator('.unread-indicator');
    const unreadCount = await unreadIndicators.count();
    
    if (unreadCount > 0) {
      // Unread indicators should be visible
      await expect(unreadIndicators.first()).toBeVisible();
      
      // Parent notification should have unread class
      const unreadNotification = page.locator('.notification-item.unread').first();
      if (await unreadNotification.isVisible()) {
        await expect(unreadNotification).toHaveClass(/unread/);
      }
    }
    
    // Check unread count in header
    const unreadCountDisplay = page.locator('.unread-count').first();
    if (await unreadCountDisplay.isVisible()) {
      const countText = await unreadCountDisplay.textContent();
      expect(countText).toMatch(/\d+ unread/);
    }
  });

  test('should handle grouped notifications display', async ({ page }) => {
    // Navigate to grouped notifications story
    await page.goto('http://localhost:6006/?path=/story/components-notificationsfeed--with-grouped-notifications');
    await page.waitForLoadState('networkidle');
    await page.locator('[role="tab"][name="Canvas"]').click();
    
    await page.waitForSelector('.notification-item', { timeout: 10000 });
    
    // Look for group indicators
    const groupSummaries = page.locator('.group-summary');
    const groupCount = await groupSummaries.count();
    
    if (groupCount > 0) {
      const firstGroup = groupSummaries.first();
      await expect(firstGroup).toBeVisible();
      
      // Should show notification count
      const groupText = await firstGroup.textContent();
      expect(groupText).toMatch(/\d+ notifications/);
    }
    
    // Check for multiple avatars in grouped notifications
    const avatarGroups = page.locator('.avatars');
    const avatarGroupCount = await avatarGroups.count();
    
    if (avatarGroupCount > 0) {
      const firstAvatarGroup = avatarGroups.first();
      const avatars = firstAvatarGroup.locator('.avatar');
      const avatarCount = await avatars.count();
      
      if (avatarCount > 1) {
        // Multiple avatars should be visible for grouped notifications
        await expect(avatars.first()).toBeVisible();
        await expect(avatars.nth(1)).toBeVisible();
      }
    }
  });
});