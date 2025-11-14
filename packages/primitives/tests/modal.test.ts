import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import ModalHarness from './harness/ModalHarness.svelte';

const renderModal = (props?: Record<string, unknown>) =>
  render(ModalHarness, {
    props: { props }
  });

describe('Modal.svelte', () => {
  it('fires onOpen when rendered open', async () => {
    const onOpen = vi.fn();
    renderModal({ open: true, title: 'Demo Modal', onOpen });

    await waitFor(() => {
      expect(onOpen).toHaveBeenCalled();
    });
  });

  it('closes via footer button and triggers onClose', async () => {
    const onClose = vi.fn();
    const { getByTestId, getByRole } = renderModal({ open: true, title: 'Demo Modal', onClose });

    const dialog = getByRole('dialog');
    expect(dialog).toBeTruthy();

    await fireEvent.click(getByTestId('modal-close'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(dialog.hasAttribute('open')).toBe(false);
    });
  });
});
