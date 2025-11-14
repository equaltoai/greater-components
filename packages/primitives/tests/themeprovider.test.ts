import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import ThemeProviderHarness from './harness/ThemeProviderHarness.svelte';
import { preferencesStore } from '../src/stores/preferences';

afterEach(() => {
  vi.restoreAllMocks();
  preferencesStore.reset();
});

describe('ThemeProvider.svelte', () => {
  it('applies provided theme via preferences store and renders children', () => {
    const spy = vi.spyOn(preferencesStore, 'setColorScheme');
    const { getByTestId } = render(ThemeProviderHarness, {
      props: { props: { theme: 'dark' } }
    });

    expect(getByTestId('theme-provider-child')).toBeTruthy();
    expect(spy).toHaveBeenCalledWith('dark');
  });

  it('still mounts when preventFlash is disabled', () => {
    const spy = vi.spyOn(preferencesStore, 'setColorScheme');
    const { getByTestId } = render(ThemeProviderHarness, {
      props: { props: { preventFlash: false, theme: 'light' } }
    });

    expect(getByTestId('theme-provider-child')).toBeTruthy();
    expect(spy).toHaveBeenCalledWith('light');
  });
});
