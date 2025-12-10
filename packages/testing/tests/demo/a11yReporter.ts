import { test } from '@playwright/test';
import { runAxeTest } from '@equaltoai/greater-components-testing/playwright';
import { writeFile } from 'node:fs/promises';

const isA11yRun = process.env['PLAYWRIGHT_A11Y'] === 'true';

const normalizeTheme = (value?: string | null): 'light' | 'dark' | 'high-contrast' => {
	if (!value) return 'light';

	const normalized = value.toLowerCase();
	if (normalized === 'dark') return 'dark';
	if (normalized === 'high-contrast') return 'high-contrast';
	return 'light';
};

const normalizeDensity = (value?: string | null): 'compact' | 'comfortable' | 'spacious' => {
	if (!value) return 'comfortable';

	const normalized = value.toLowerCase();
	if (normalized === 'compact' || normalized === 'spacious') {
		return normalized;
	}

	return 'comfortable';
};

export function applyA11yReporter(currentTest: typeof test = test) {
	if (!isA11yRun) {
		return;
	}

	currentTest.afterEach(async ({ page }, testInfo) => {
		const theme = normalizeTheme(process.env['TEST_THEME']);
		const density = normalizeDensity(process.env['TEST_DENSITY']);

		// Blur any focused element to clear focus rings before running axe
		// Focus rings are transient visual states and can cause axe to detect
		// incorrect background colors due to visual overlap with adjacent elements
		await page.evaluate(() => {
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
		});
		// Small delay to ensure focus ring CSS transitions have completed
		await page.waitForTimeout(100);

		const results = await runAxeTest(page);

		const payload = {
			...results,
			testName: testInfo.title,
			testFile: testInfo.file,
			theme,
			density,
			project: testInfo.project.name,
			timestamp: new Date().toISOString(),
		};

		await writeFile(
			testInfo.outputPath('axe-results.json'),
			JSON.stringify(payload, null, 2),
			'utf8'
		);
	});
}
