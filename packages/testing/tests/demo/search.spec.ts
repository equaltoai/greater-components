import { test, expect } from '@playwright/test';

test.describe('Search demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/search');
		await page.waitForLoadState('networkidle');
	});

	test('running a search populates results and recents', async ({ page }) => {
		const input = page.getByPlaceholder('Search posts, people, tags…');
		await input.waitFor();
		await input.fill('timeline QA');
		await page.getByRole('button', { name: 'Run search' }).click();

		await expect(page.locator('.status-stack')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear recents' })).toBeEnabled();
		await expect(page.getByText('timeline QA')).toBeVisible();
	});

	test('error state surfaces an alert and clears after retrying with valid query', async ({
		page,
	}) => {
		const input = page.getByPlaceholder('Search posts, people, tags…');
		await input.waitFor();
		await input.fill('error case');
		await page.getByRole('button', { name: 'Run search' }).click();

		await expect(page.getByRole('alert')).toContainText('temporarily unavailable');

		await input.fill('compose dock');
		await page.getByRole('button', { name: 'Run search' }).click();

		await expect(page.locator('[role="alert"]')).toHaveCount(0);
	});
});
