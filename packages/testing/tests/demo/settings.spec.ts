import { test, expect } from '@playwright/test';

test.describe('Settings demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/settings');
	});

	test('digest frequency select updates preview summary', async ({ page }) => {
		await page.getByLabel('Digest frequency').selectOption('weekly');
		await expect(page.getByText('Digest: weekly')).toBeVisible();
	});

	test('density select feeds the preview heading', async ({ page }) => {
		await page.getByLabel('Density').selectOption('compact');
		await expect(page.getByRole('heading', { name: /compact/i })).toBeVisible();
	});
});
