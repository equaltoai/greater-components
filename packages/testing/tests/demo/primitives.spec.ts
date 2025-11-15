import { test, expect } from '@playwright/test';

test.describe('Primitives demo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/demos/primitives');
	});

	test('button interactions update click counter', async ({ page }) => {
		const primaryButton = page.getByTestId('primary-button');
		const counter = page.getByTestId('button-click-count');
		const disabledButton = page.getByTestId('disabled-button');

		await expect(disabledButton).toBeDisabled();
		await primaryButton.click();
		await primaryButton.click();
		await expect(counter).toHaveText(/2\s*times/);
	});

	test('modal opens and closes via controls', async ({ page }) => {
		await page.getByTestId('open-modal-button').click();
		const modal = page.getByRole('dialog', { name: 'Demo Modal' });
		await expect(modal).toBeVisible();

		await page.getByTestId('close-modal-button').click();
		await expect(modal).toBeHidden();
	});

	test('menu selection updates status text', async ({ page }) => {
		await page.getByTestId('menu-trigger').click();
		await page.getByRole('menuitem', { name: 'Profile Overview' }).click();
		await expect(page.getByTestId('menu-selection')).toHaveText(/Profile Overview/);
	});
});
