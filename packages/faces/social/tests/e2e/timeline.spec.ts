import { expect, test } from '@playwright/test';

test.describe('Timeline playground integration', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/timeline');
		await page.waitForSelector('body[data-playground-hydrated="true"]');
	});

	test('supports timeline filtering and loading more', async ({ page }) => {
		const filters = page.getByRole('navigation', { name: 'Timeline filters' });
		await filters.getByRole('button', { name: 'Local' }).click();
		await expect(page.getByRole('heading', { name: /current instance/i })).toBeVisible();

		const loadMore = page.getByRole('button', { name: 'Load more' });
		await loadMore.click();
		await expect(loadMore).toBeEnabled();
	});
});
