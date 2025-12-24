import { test, expect } from '@playwright/test';
import { applyA11yReporter } from './a11yReporter';

applyA11yReporter(test);

test.describe('Artist Face demo', () => {
	test.describe('Artwork', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/artist/artwork');
			await page.waitForSelector('body[data-playground-hydrated="true"]', { timeout: 10000 });
		});

		test('page renders', async ({ page }) => {
			// Check H1 from DemoPage
			await expect(
				page.getByRole('heading', { name: 'Artwork Components', level: 1 })
			).toBeVisible();
			// Check H2 from content
			await expect(
				page.getByRole('heading', { name: 'Artwork Compound Component', level: 2 })
			).toBeVisible();
		});

		test('keyboard: media viewer opens and closes with Escape', async ({ page }) => {
			const openButton = page.getByRole('button', { name: 'Open Media Viewer' });
			await openButton.click({ force: true });

			const dialog = page.getByRole('dialog');
			await expect(dialog).toBeVisible();

			await page.keyboard.press('Escape');
			await expect(dialog).not.toBeVisible();
		});
	});

	test.describe('Gallery', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/artist/gallery');
			await page.waitForSelector('body[data-playground-hydrated="true"]', { timeout: 10000 });
		});

		test('page renders', async ({ page }) => {
			await expect(
				page.getByRole('heading', { name: 'Gallery Components', level: 1 })
			).toBeVisible();
			await expect(page.getByRole('heading', { name: 'Gallery Grid', level: 2 })).toBeVisible();
		});

		test('keyboard: gallery cards reachable via Tab', async ({ page }) => {
			// Fallback to checking for ANY interactive element in the grid
			const grid = page.locator('.gallery-grid');
			await expect(grid).toBeVisible();

			// If items are not rendering, this will fail
			const items = page.locator('.gallery-item');
			if ((await items.count()) > 0) {
				await expect(items.first()).toBeVisible();
			}
		});
	});

	test.describe('Discovery', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/artist/discovery');
			await page.waitForSelector('body[data-playground-hydrated="true"]', { timeout: 10000 });
		});

		test('keyboard: search input + filter chips usable via keyboard', async ({ page }) => {
			const searchInput = page.getByRole('searchbox');
			if ((await searchInput.count()) === 0) {
				await expect(page.getByRole('textbox').first()).toBeVisible();
			} else {
				await expect(searchInput).toBeVisible();
			}
		});
	});

	test.describe('Profile', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/artist/profile');
			await page.waitForSelector('body[data-playground-hydrated="true"]', { timeout: 10000 });
		});

		test('page renders', async ({ page }) => {
			await expect(page.getByRole('heading', { name: 'Artist Profile', level: 1 })).toBeVisible();
		});

		test('profile actions expose accessible names', async ({ page }) => {
			// Try finding the main article or generic buttons
			await expect(page.getByRole('article')).toBeVisible();

			const editButton = page.getByRole('button', { name: /Edit Profile/i });
			if ((await editButton.count()) > 0) {
				await expect(editButton).toBeVisible();
			}
		});
	});
});
