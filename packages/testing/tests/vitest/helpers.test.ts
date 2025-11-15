import { afterEach, describe, expect, it, vi } from 'vitest';

const { renderSpy } = vi.hoisted(() => {
	return {
		renderSpy: vi.fn((_component?: unknown, _props?: unknown) => {
			const container = document.createElement('div');
			container.innerHTML = '<button data-testid="stub">stub</button>';
			return { container };
		}),
	};
});

vi.mock('@testing-library/svelte', () => ({
	render: renderSpy,
	cleanup: vi.fn(),
}));

import {
	createThemeContextWrapper,
	createMockThemeStore,
	createMockDensityStore,
	createMockA11yPreferencesStore,
	setupTestEnvironment,
	renderWithTheme,
	createCustomRender,
} from '../../src/vitest/render-helpers';
import {
	createComponentMocks,
	renderWithA11yContext,
	setupA11yTestEnvironment,
	waitForComponentReady,
} from '../../src/vitest/component-helpers';
import { createA11yTestHelpers, runA11yTests } from '../../src/vitest/a11y-matchers';

afterEach(() => {
	vi.clearAllMocks();
});

describe('vitest helpers', () => {
	it('applies theme context and stubs matchMedia', () => {
		const wrapper = createThemeContextWrapper({
			theme: 'dark',
			highContrast: true,
			reducedMotion: true,
			direction: 'rtl',
			lang: 'fr',
		});

		wrapper({ children: null });

		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
		expect(document.documentElement.getAttribute('dir')).toBe('rtl');
		expect(document.documentElement.getAttribute('lang')).toBe('fr');
		expect(window.matchMedia('(prefers-contrast: high)').matches).toBe(true);
	});

	it('provides mock stores and environment wiring', () => {
		const themeStore = createMockThemeStore('dark');
		const densityStore = createMockDensityStore('spacious');
		const a11yStore = createMockA11yPreferencesStore({ highContrast: true });

		let receivedTheme = '';
		themeStore.subscribe((theme) => (receivedTheme = theme));
		themeStore.update((theme) => `${theme}-next`);

		let receivedDensity = '';
		densityStore.subscribe((density) => (receivedDensity = density));
		densityStore.set('compact');

		let receivedPrefsFont = 0;
		a11yStore.subscribe((prefs) => (receivedPrefsFont = prefs.fontSize));
		a11yStore.updatePreference('fontSize', 18);

		expect(receivedTheme).toBe('dark-next');
		expect(receivedDensity).toBe('compact');
		expect(receivedPrefsFont).toBe(18);

		const env = setupTestEnvironment({ theme: 'light', density: 'comfortable' });
		env.themeStore.set('dark');
		expect(env.themeStore.current).toBe('dark');
		env.cleanup();
	});

	it('renders with a11y context and component mocks', async () => {
		setupA11yTestEnvironment();
		renderWithA11yContext({} as unknown as any, undefined, {
			theme: 'high-contrast',
			density: 'compact',
			highContrast: true,
			reducedMotion: true,
			direction: 'rtl',
			lang: 'es',
		});

		const mocks = await createComponentMocks();
		mocks.onClick();
		expect(mocks.onClick).toHaveBeenCalled();

		expect(document.documentElement.getAttribute('data-density')).toBe('compact');
		expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
	});

	it('waits for components to settle when animations are absent', async () => {
		const styleSpy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
			animationName: 'none',
			animationDuration: '0s',
		} as unknown as CSSStyleDeclaration);

		const container = document.createElement('div');
		await expect(waitForComponentReady(container, 5)).resolves.toBeUndefined();
		styleSpy.mockRestore();
	});

	it('creates custom renders and snapshots without real components', async () => {
		const customRender = createCustomRender({ theme: 'dark' });
		customRender({} as unknown as any);

		expect(renderSpy).toHaveBeenCalled();

		const themeRenderer = createCustomRender();
		const themeRenderResult = renderWithTheme({} as unknown as any, undefined, {
			theme: 'high-contrast',
		});
		expect(themeRenderResult.container.querySelector('[data-testid="stub"]')).toBeTruthy();

		// createCustomRender delegates to renderWithTheme internally
		themeRenderer({} as unknown as any, undefined, { theme: { density: 'spacious' } });
		expect(document.documentElement.getAttribute('data-density')).toBe('spacious');
	});

	it('finds accessibility issues via helpers', () => {
		const container = document.createElement('div');
		container.innerHTML = `
			<input type="text" data-testid="orphan-input" />
			<img src="/image.png">
			<button role="button" aria-label="Action">Do</button>
		`;

		const helpers = createA11yTestHelpers(container);
		expect(helpers.getByTestId('orphan-input')).toBeInstanceOf(HTMLElement);
		expect(helpers.getAllByRole('button')).toHaveLength(1);

		const report = runA11yTests(container, { skipContrastCheck: true, skipFocusCheck: true });
		expect(report.passed).toBe(false);
		expect(report.issues.some((issue) => issue.includes('images without alt'))).toBe(true);
	});
});
