import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ThemeSwitcher from '../src/components/ThemeSwitcher.svelte';
import { preferencesStore } from '../src/stores/preferences';

afterEach(() => {
  vi.restoreAllMocks();
  preferencesStore.reset();
});

describe('ThemeSwitcher.svelte', () => {
  it('opens the compact menu and emits theme changes', async () => {
    const onThemeChange = vi.fn();
    const { getByRole, queryByRole } = render(ThemeSwitcher, {
      props: { variant: 'compact', onThemeChange }
    });

    const toggle = getByRole('button', { name: /auto/i });
    await fireEvent.click(toggle);

    const darkOption = getByRole('menuitemradio', { name: 'Dark' });
    await fireEvent.click(darkOption);

    expect(onThemeChange).toHaveBeenCalledWith('dark');
    expect(queryByRole('menu')).toBeNull();
  });

  it('updates density through the preferences store in full variant', async () => {
    const densitySpy = vi.spyOn(preferencesStore, 'setDensity');
    const { getByLabelText } = render(ThemeSwitcher, {
      props: { variant: 'full', showPreview: false }
    });

    const compactOption = getByLabelText(/Compact/) as HTMLInputElement;
    await fireEvent.click(compactOption);

    expect(densitySpy).toHaveBeenCalledWith('compact');
  });
});
