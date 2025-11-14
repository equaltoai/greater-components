import { test, expect } from '@playwright/test';

test.describe('Timeline demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/timeline');
	});

	test('filter buttons update view description and density copy', async ({ page }) => {
		const nav = page.getByRole('navigation', { name: 'Timeline filters' });
		await nav.getByRole('button', { name: 'Local' }).click();
		await expect(page.getByRole('heading', { name: /current instance/i })).toBeVisible();

		await page.getByRole('button', { name: 'Preferences' }).click();
		const dialog = page.getByRole('dialog', { name: 'Timeline preferences' });
		await dialog.getByRole('button', { name: 'Compact' }).click();
		await dialog.getByRole('button', { name: 'Close', exact: true }).click();

		await expect(page.getByText(/Density compact/i)).toBeVisible();
	});

	test('load more disables button and action log captures boosts', async ({ page }) => {
		const loadMore = page.getByRole('button', { name: 'Load more' });
		await loadMore.click();

		const boostButton = page.getByRole('button', { name: 'Boost' }).first();
		await boostButton.click();
		await expect(page.locator('.action-log')).toContainText('Boost');
	});
});
