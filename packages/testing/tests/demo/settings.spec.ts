import { test, expect } from '@playwright/test';
import { applyA11yReporter } from './a11yReporter';

applyA11yReporter(test);

test.describe('Settings demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/settings');
	});

	test('digest frequency select updates preview summary', async ({ page }) => {
		const digestSelect = page.getByLabel('Digest frequency');
		await expect(digestSelect).toBeEnabled();
		await digestSelect.selectOption('weekly');
		await expect.poll(async () => {
			const settings = await page.evaluate(() =>
				JSON.parse(window.localStorage.getItem('playground-settings-demo') || '{}')
			);
			return settings.notifications?.digest;
		}).toBe('weekly');
	});

	test('density select feeds the preview heading', async ({ page }) => {
		const densitySelect = page.getByLabel('Density');
		await expect(densitySelect).toBeEnabled();
		await densitySelect.selectOption('compact');
		await expect.poll(async () => {
			const settings = await page.evaluate(() =>
				JSON.parse(window.localStorage.getItem('playground-settings-demo') || '{}')
			);
			return settings.appearance?.density;
		}).toBe('compact');
	});
});
