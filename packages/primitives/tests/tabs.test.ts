import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import TabsHarness from './harness/TabsHarness.svelte';

const renderTabs = (props?: Record<string, unknown>) =>
  render(TabsHarness, {
    props: { props }
  });

describe('Tabs.svelte', () => {
  it('changes active tab via click and emits onTabChange', async () => {
    const onTabChange = vi.fn();
    const { getByRole, getByTestId } = renderTabs({ onTabChange });

    const activityTab = getByRole('tab', { name: 'Activity' });
    await fireEvent.click(activityTab);

    expect(onTabChange).toHaveBeenCalledWith('activity');
    await waitFor(() => {
      expect(activityTab.getAttribute('aria-selected')).toBe('true');
    });

    const activityPanel = getByTestId('tab-panel-activity').closest('.gr-tabs__panel');
    expect(activityPanel).not.toBeNull();
    expect(activityPanel?.hasAttribute('hidden')).toBe(false);
  });

  it('supports keyboard navigation and skips disabled tabs', async () => {
    const { getByRole } = renderTabs();

    const overviewTab = getByRole('tab', { name: 'Overview' });
    overviewTab.focus();

    await fireEvent.keyDown(overviewTab, { key: 'ArrowRight' });
    const activityTab = getByRole('tab', { name: 'Activity' });
    await waitFor(() => {
      expect(activityTab.getAttribute('aria-selected')).toBe('true');
    });

    await fireEvent.keyDown(activityTab, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(overviewTab.getAttribute('aria-selected')).toBe('true');
    });

    const settingsTab = getByRole('tab', { name: 'Settings' });
    expect(settingsTab.getAttribute('aria-disabled')).toBe('true');
  });
});
