import { test, expect } from '@playwright/test';
import { applyA11yReporter } from './a11yReporter';

applyA11yReporter(test);

test.describe('Tabs demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/tabs');
		await page.waitForSelector('body[data-playground-hydrated="true"]');
	});

	test('horizontal tabs respond to arrow keys', async ({ page }) => {
		const overviewTab = page.getByRole('tab', { name: 'Overview' });
		const featuresTab = page.getByRole('tab', { name: 'Features' });

		await overviewTab.focus();
		await overviewTab.press('ArrowRight');

		await expect(featuresTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('tabpanel').filter({ hasText: 'Features' })).toBeVisible();
	});

	test('manual activation requires confirmation', async ({ page }) => {
		const profileTab = page.getByRole('tab', { name: 'Profile' });
		const securityTab = page.getByRole('tab', { name: 'Security' });

		await profileTab.focus();
		await profileTab.press('ArrowDown');

		await expect(securityTab).toHaveAttribute('aria-selected', 'false');

		await securityTab.press('Enter');
		await expect(securityTab).toHaveAttribute('aria-selected', 'true');
		await expect(
			page.getByRole('tabpanel').filter({
				hasText: 'Use this tab to demonstrate keyboard interactions with manual activation.',
			})
		).toBeVisible();
	});

	test('disabled tabs remain inert', async ({ page }) => {
		const disabledTab = page.getByRole('tab', { name: 'Notifications' });
		await expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
		await disabledTab.focus();
		await disabledTab.press('Enter');
		await expect(disabledTab).toHaveAttribute('aria-selected', 'false');
	});
});
