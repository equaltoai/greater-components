import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ThemeSwitcher from '../src/components/ThemeSwitcher.svelte';
import { preferencesStore } from '../src/stores/preferences';

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

	it('surfaces an error when importing an invalid preferences file', async () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
		const importSpy = vi.spyOn(preferencesStore, 'import').mockReturnValue(false);

		class MockFileReader {
			onload: ((event: { target: { result: string } }) => void) | null = null;
			readAsText(_file: File) {
				this.onload?.({ target: { result: '{bad json' } });
			}
		}

		vi.stubGlobal('FileReader', MockFileReader);

		const { getByLabelText } = render(ThemeSwitcher, {
			props: { variant: 'full', showPreview: false, showAdvanced: true },
		});

		const input = getByLabelText('Import Settings') as HTMLInputElement;
		const file = new File(['{}'], 'prefs.json', { type: 'application/json' });
		await fireEvent.change(input, { target: { files: [file] } });

		expect(importSpy).toHaveBeenCalled();
		expect(alertSpy).toHaveBeenCalledWith('Invalid preferences file');
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

	it('applies custom colors and updates the preview styling', async () => {
		const colorSpy = vi.spyOn(preferencesStore, 'setCustomColors');
		const { getByLabelText, getByRole } = render(ThemeSwitcher, {
			props: { variant: 'full', showPreview: true, showAdvanced: true },
		});

		const primaryHexInput = getByLabelText('Primary color hex value') as HTMLInputElement;
		const secondaryHexInput = getByLabelText('Secondary color hex value') as HTMLInputElement;

		await fireEvent.input(primaryHexInput, { target: { value: '#123456' } });
		await fireEvent.input(secondaryHexInput, { target: { value: '#abcdef' } });

		expect(colorSpy).toHaveBeenCalledWith(
			expect.objectContaining({ primary: '#123456', secondary: '#abcdef' })
		);
		expect(preferencesStore.preferences.customColors.primary).toBe('#123456');
		expect(preferencesStore.preferences.customColors.secondary).toBe('#abcdef');

		const previewButton = getByRole('button', { name: 'Primary' });
		expect(previewButton.getAttribute('style')).toContain('rgb(18, 52, 86)');
	});
});
