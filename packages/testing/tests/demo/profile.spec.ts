import { test, expect } from '@playwright/test';

test.describe('Profile demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/profile');
		await page.waitForLoadState('networkidle');
	});

	test('tabs support keyboard navigation', async ({ page }) => {
		const postsTab = page.getByRole('tab', { name: 'Posts' });
		const repliesTab = page.getByRole('tab', { name: 'Replies' });

		await postsTab.waitFor();
		await postsTab.focus();
		await postsTab.press('ArrowRight');
		await expect(repliesTab).toHaveAttribute('aria-selected', 'true');
	});

	test('connection toggles update live region copy', async ({ page }) => {
		const toggle = page.getByRole('button', { name: /follow back/i }).first();
		await toggle.click();

		await expect(page.locator('.connections-note')).toContainText('Following');
	});
});
