import { expect, test } from '@playwright/test';
import { applyA11yReporter } from '../demo/a11yReporter';

applyA11yReporter(test);

test.describe('focus', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/tabs');
		await page.waitForSelector('body[data-playground-hydrated="true"]');
	});

	test('roving tabindex keeps one tabbable tab at a time', async ({ page }) => {
		const overviewTab = page.getByRole('tab', { name: 'Overview' });
		const featuresTab = page.getByRole('tab', { name: 'Features' });

		await overviewTab.focus();
		await expect(overviewTab).toHaveAttribute('tabindex', '0');

		await overviewTab.press('ArrowRight');
		await expect(featuresTab).toBeFocused();
		await expect(featuresTab).toHaveAttribute('tabindex', '0');
		await expect(overviewTab).toHaveAttribute('tabindex', '-1');

		await featuresTab.press('Home');
		await expect(overviewTab).toBeFocused();
		await expect(overviewTab).toHaveAttribute('tabindex', '0');
	});

	test('manual activation waits for enter/space confirmation', async ({ page }) => {
		const profileTab = page.getByRole('tab', { name: 'Profile' });
		const securityTab = page.getByRole('tab', { name: 'Security' });
		const securityPanel = page.getByRole('tabpanel', {
			name: 'Security',
			includeHidden: true,
		});

		await profileTab.focus();
		await profileTab.press('ArrowDown');

		await expect(securityTab).toBeFocused();
		await expect(securityTab).toHaveAttribute('aria-selected', 'false');
		await expect(securityPanel).toBeHidden();

		await securityTab.press('Enter');
		await expect(securityTab).toHaveAttribute('aria-selected', 'true');
		await expect(securityPanel).toBeVisible();
	});

	test('disabled tabs are skipped when moving focus vertically', async ({ page }) => {
		const securityTab = page.getByRole('tab', { name: 'Security' });
		const notificationsTab = page.getByRole('tab', { name: 'Notifications' });
		const billingTab = page.getByRole('tab', { name: 'Billing' });

		await expect(notificationsTab).toHaveAttribute('aria-disabled', 'true');

		await securityTab.focus();
		await securityTab.press('ArrowDown');

		await expect(billingTab).toBeFocused();
		await expect(billingTab).toHaveAttribute('aria-selected', 'false');
		await expect(notificationsTab).toHaveAttribute('tabindex', '-1');
	});
});
