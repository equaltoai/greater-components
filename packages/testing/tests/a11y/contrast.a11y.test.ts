import { expect, test } from '@playwright/test';
import { applyA11yReporter } from '../demo/a11yReporter';

applyA11yReporter(test);

test.describe('contrast', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/settings');
		await page.waitForSelector('body[data-playground-hydrated="true"]');
	});

	test('heading levels stay sequential across ThemeSwitcher and preview', async ({ page }) => {
		await expect(page.getByRole('heading', { level: 2, name: 'Theme & density' })).toBeVisible();

		const switcherHeadings = await page
			.locator('.gr-theme-switcher__section')
			.getByRole('heading', { level: 3 })
			.allTextContents();

		expect(switcherHeadings).toEqual(
			expect.arrayContaining(['Color Scheme', 'Density', 'Font Size', 'Motion'])
		);

		const previewHeading = page.locator('.preview-card').getByRole('heading', { level: 2 });
		await expect(previewHeading).toContainText('·');

		const previewSamples = await page
			.locator('.preview-card')
			.getByRole('heading', { level: 3 })
			.allTextContents();

		expect(previewSamples).toEqual(
			expect.arrayContaining(['Timeline sample', 'Notification sample'])
		);
	});

	test('color scheme radios and density select update the preview state', async ({ page }) => {
		const appearanceCard = page.locator('section.settings-card').filter({
			has: page.getByRole('heading', { level: 2, name: 'Theme & density' }),
		});
		const previewStatus = page.locator('.preview-card h2');
		const highContrastRadio = appearanceCard.getByRole('radio', { name: /^High Contrast/ });
		const densitySelect = page.locator('#density-select');
		const previewGrid = page.locator('.preview-card .preview-grid');

		await expect(previewStatus).toBeVisible();
		await highContrastRadio.check();
		await expect(previewStatus).toContainText('high-contrast');

		await densitySelect.selectOption('compact');
		await expect(previewStatus).toContainText('compact');
		await expect(previewGrid).toHaveAttribute('data-density', 'compact');
	});

	test('force high contrast toggle overrides the current theme', async ({ page }) => {
		const appearanceCard = page.locator('section.settings-card').filter({
			has: page.getByRole('heading', { level: 2, name: 'Theme & density' }),
		});
		const previewStatus = page.locator('.preview-card h2');
		const lightRadio = appearanceCard.getByRole('radio', { name: /^Light/ });
		const forceHighContrast = appearanceCard.getByRole('checkbox', {
			name: 'Force high contrast mode',
		});

		await forceHighContrast.uncheck();

		await lightRadio.check();
		await expect(previewStatus).toContainText('light');

		await forceHighContrast.check();
		await expect(previewStatus).toContainText('high-contrast');

		await forceHighContrast.uncheck();
		await expect(previewStatus).toContainText('light');
	});
});
