import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Switch from '../src/components/Switch.svelte';

describe('Switch.svelte', () => {
  it('toggles checked state and emits onchange callback', async () => {
    const handleChange = vi.fn();
    const { container } = render(Switch, { props: { onchange: handleChange } });
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    await fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(checkbox.checked).toBe(true);

    await fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(checkbox.checked).toBe(false);
  });

  it('respects disabled state', async () => {
    const handleChange = vi.fn();
    const { container } = render(Switch, { props: { disabled: true, onchange: handleChange } });
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const wrapper = container.querySelector('.gr-switch');

    expect(checkbox.disabled).toBe(true);
    expect(wrapper?.classList.contains('gr-switch--disabled')).toBe(true);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
