import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import * as fc from 'fast-check';
import ThemeSwitcher from '../src/components/ThemeSwitcher.svelte';
import { preferencesStore } from '../src/stores/preferences';

// Type definitions matching ThemeSwitcher component props
type ColorScheme = 'light' | 'dark' | 'high-contrast' | 'auto';
type Variant = 'compact' | 'full';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	preferencesStore.reset();
	(preferencesStore as unknown as { _systemMotion: string })._systemMotion = 'normal';
});

describe('ThemeSwitcher.svelte', () => {
	it('opens the compact menu and emits theme changes', async () => {
		const onThemeChange = vi.fn();
		const { getByRole, queryByRole } = render(ThemeSwitcher, {
			props: { variant: 'compact', onThemeChange },
		});

		const toggle = getByRole('button', { name: /auto/i });
		await fireEvent.click(toggle);

		const darkOption = getByRole('menuitemradio', { name: 'Dark' });
		await fireEvent.click(darkOption);

		expect(onThemeChange).toHaveBeenCalledWith('dark');
		expect(queryByRole('menu')).toBeNull();
	});

	it('uses controlled value overrides without mutating the store', async () => {
		const onThemeChange = vi.fn();
		const { getByRole } = render(ThemeSwitcher, {
			props: { variant: 'compact', onThemeChange, value: 'dark' },
		});

		const toggle = getByRole('button', { name: /dark/i });
		await fireEvent.click(toggle);

		const lightOption = getByRole('menuitemradio', { name: 'Light' });
		await fireEvent.click(lightOption);

		expect(onThemeChange).toHaveBeenCalledWith('light');
		expect(preferencesStore.preferences.colorScheme).toBe('auto');
	});

	it('updates density through the preferences store in full variant', async () => {
		const densitySpy = vi.spyOn(preferencesStore, 'setDensity');
		const { getByLabelText } = render(ThemeSwitcher, {
			props: { variant: 'full', showPreview: false },
		});

		const compactOption = getByLabelText(/Compact/) as HTMLInputElement;
		await fireEvent.click(compactOption);

		expect(densitySpy).toHaveBeenCalledWith('compact');
	});

	it('toggles high contrast mode', async () => {
		const toggleSpy = vi.spyOn(preferencesStore, 'setHighContrastMode');
		const { getByLabelText } = render(ThemeSwitcher, {
			props: { variant: 'full', showPreview: false },
		});

		const checkbox = getByLabelText('Force high contrast mode') as HTMLInputElement;
		expect(checkbox.checked).toBe(false);

		await fireEvent.click(checkbox);

		expect(toggleSpy).toHaveBeenCalledWith(true);
		expect(preferencesStore.preferences.highContrastMode).toBe(true);
		expect(preferencesStore.state.resolvedColorScheme).toBe('high-contrast');
	});

	it('updates motion preference and reflects system reduced motion state', async () => {
		const motionSpy = vi.spyOn(preferencesStore, 'setMotion');
		const { container, unmount } = render(ThemeSwitcher, {
			props: { variant: 'full', showPreview: false },
		});

		const reducedRadio = container.querySelector(
			'input[name="motion"][value="reduced"]'
		) as HTMLInputElement | null;
		expect(reducedRadio).not.toBeNull();
		if (!reducedRadio) throw new Error('Reduced radio not found');
		await fireEvent.click(reducedRadio);
		expect(motionSpy).toHaveBeenCalledWith('reduced');
		unmount?.();

		(preferencesStore as unknown as { _systemMotion: string })._systemMotion = 'reduced';
		const { container: reducedContainer } = render(ThemeSwitcher, {
			props: { variant: 'full', showPreview: false },
		});

		const normalRadio = reducedContainer.querySelector(
			'input[name="motion"][value="normal"]'
		) as HTMLInputElement | null;
		const reducedRadioDisabled = reducedContainer.querySelector(
			'input[name="motion"][value="reduced"]'
		) as HTMLInputElement | null;

		expect(normalRadio?.disabled).toBe(true);
		expect(reducedRadioDisabled?.disabled).toBe(true);
		expect(reducedContainer.textContent).toContain('System prefers reduced motion');
	});

	it('renders preview with preset color classes (no inline styles)', () => {
		const { getByRole } = render(ThemeSwitcher, {
			props: { variant: 'full', showPreview: true },
		});

		const previewButton = getByRole('button', { name: 'Primary' });
		// CSP compliance: no inline style attribute
		expect(previewButton.hasAttribute('style')).toBe(false);
		// Should use preset class instead
		expect(previewButton.classList.contains('gr-theme-switcher__preview-button--primary')).toBe(
			true
		);
	});
});

describe('ThemeSwitcher CSP Compliance - Property Tests', () => {
	// Property 8: ThemeSwitcher universal CSP compliance
	// Feature: csp-theme-layout-primitives, Property 8
	// **Validates: Requirements 3.1, 3.2, 3.3, 6.3**
	it('Property 8: ThemeSwitcher universal CSP compliance - no style attribute for any prop combination', () => {
		fc.assert(
			fc.property(
				fc.record({
					variant: fc.option(fc.constantFrom('compact', 'full') as fc.Arbitrary<Variant>, {
						nil: undefined,
					}),
					showPreview: fc.option(fc.boolean(), { nil: undefined }),
					value: fc.option(
						fc.constantFrom('light', 'dark', 'high-contrast', 'auto') as fc.Arbitrary<ColorScheme>,
						{ nil: undefined }
					),
				}),
				(props) => {
					// Filter out undefined values
					const filteredProps = Object.fromEntries(
						Object.entries(props).filter(([, v]) => v !== undefined)
					);

					const { container } = render(ThemeSwitcher, filteredProps);

					// Check the main theme switcher element
					const element = container.querySelector('.gr-theme-switcher');
					expect(element).toBeTruthy();
					// CSP compliance: no style attribute should be present on main element
					expect(element?.hasAttribute('style')).toBe(false);

					// Check all child elements for style attributes
					const allElements = container.querySelectorAll('*');
					allElements.forEach((el) => {
						expect(el.hasAttribute('style')).toBe(false);
					});

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});

	// Property 9: ThemeSwitcher preview uses preset classes
	// Feature: csp-theme-layout-primitives, Property 9
	// **Validates: Requirements 3.4, 3.5**
	it('Property 9: ThemeSwitcher preview uses preset classes - preview buttons use CSS classes not inline styles', () => {
		fc.assert(
			fc.property(
				fc.constantFrom('light', 'dark', 'high-contrast', 'auto') as fc.Arbitrary<ColorScheme>,
				(value) => {
					const { container } = render(ThemeSwitcher, {
						variant: 'full',
						showPreview: true,
						value,
					});

					// Find preview buttons
					const primaryButton = container.querySelector(
						'.gr-theme-switcher__preview-button--primary'
					);
					const secondaryButton = container.querySelector(
						'.gr-theme-switcher__preview-button--secondary'
					);

					// Both buttons should exist
					expect(primaryButton).toBeTruthy();
					expect(secondaryButton).toBeTruthy();

					// Neither should have inline styles
					expect(primaryButton?.hasAttribute('style')).toBe(false);
					expect(secondaryButton?.hasAttribute('style')).toBe(false);

					// Both should have the base preview button class
					expect(primaryButton?.classList.contains('gr-theme-switcher__preview-button')).toBe(true);
					expect(secondaryButton?.classList.contains('gr-theme-switcher__preview-button')).toBe(
						true
					);

					return true;
				}
			),
			{ numRuns: 100 }
		);
	});
});
