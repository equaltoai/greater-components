import { expect, test } from '@playwright/test';
import { applyA11yReporter } from './a11yReporter';

applyA11yReporter(test);

test.describe('Focus management demos', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/demos/primitives');
		await page.waitForSelector('body[data-playground-hydrated="true"]');
	});

	test('@focus menu trap returns focus to trigger after closing', async ({ page }) => {
		const trigger = page.getByTestId('menu-trigger');
		await trigger.focus();
		await trigger.press('Enter');

		const firstItem = page.getByRole('menuitem', { name: 'Profile Overview' });
		const secondItem = page.getByRole('menuitem', { name: 'Security Logins' });

		await expect(firstItem).toBeFocused();

		await firstItem.press('ArrowDown');
		await expect(secondItem).toBeFocused();

		await secondItem.press('Escape');
		await expect(firstItem).not.toBeVisible();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toBeFocused();
	});

	test('@focus modal traps focus within the dialog', async ({ page }) => {
		const openModal = page.getByTestId('open-modal-button');
		await openModal.click();

		const headerClose = page.getByRole('button', { name: 'Close modal' });
		const footerClose = page.getByTestId('close-modal-button');

		await expect(headerClose).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(footerClose).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(headerClose).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(openModal).toBeFocused();
	});
});
