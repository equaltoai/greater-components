import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TextArea from '../src/components/TextArea.svelte';

describe('TextArea.svelte', () => {
  it('updates value via input and change handlers', async () => {
    const handleInput = vi.fn();
    const handleChange = vi.fn();
    const { getByRole } = render(TextArea, {
      props: { oninput: handleInput, onchange: handleChange, placeholder: 'Message' }
    });

    const textarea = getByRole('textbox') as HTMLTextAreaElement;

    await fireEvent.input(textarea, { target: { value: 'Hello' } });
    expect(handleInput).toHaveBeenCalledWith('Hello');
    expect(textarea.value).toBe('Hello');

    await fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(handleChange).toHaveBeenCalledWith('Hello');
  });
});
