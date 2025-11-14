import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TextField from '../src/components/TextField.svelte';

describe('TextField.svelte', () => {
  it('updates bound value on input', async () => {
    const { getByLabelText } = render(TextField, {
      props: { label: 'Email', placeholder: 'name@example.com' }
    });

    const input = getByLabelText('Email') as HTMLInputElement;
    expect(input.value).toBe('');

    await fireEvent.input(input, { target: { value: 'dev@example.com' } });
    expect(input.value).toBe('dev@example.com');
  });

  it('applies error messaging when invalid', () => {
    const { getByRole } = render(TextField, {
      props: {
        label: 'Username',
        invalid: true,
        errorMessage: 'Required field'
      }
    });

    const alert = getByRole('alert');
    expect(alert.textContent).toContain('Required field');
  });
});
