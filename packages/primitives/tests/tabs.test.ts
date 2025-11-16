import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import TabsHarness from './harness/TabsHarness.svelte';

const renderTabs = (props?: Record<string, unknown>) =>
	render(TabsHarness, {
		props: { props },
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

	it('uses vertical arrow keys with manual activation and wraps focus', async () => {
		const onTabChange = vi.fn();
		const { getByRole } = renderTabs({
			orientation: 'vertical',
			activation: 'manual',
			onTabChange,
		});

		const overviewTab = getByRole('tab', { name: 'Overview' });
		overviewTab.focus();

		await fireEvent.keyDown(overviewTab, { key: 'ArrowDown' });
		const activityTab = getByRole('tab', { name: 'Activity' });
		expect(document.activeElement).toBe(activityTab);
		// Manual activation requires an explicit activation key
		await fireEvent.keyDown(activityTab, { key: ' ' });

		await waitFor(() => {
			expect(activityTab.getAttribute('aria-selected')).toBe('true');
		});
		expect(onTabChange).toHaveBeenCalledWith('activity');

		await fireEvent.keyDown(activityTab, { key: 'ArrowDown' });
		await waitFor(() => {
			expect(overviewTab).toBe(document.activeElement);
		});
	});

	it('respects Home/End navigation and ignores disabled tab selection', async () => {
		const onTabChange = vi.fn();
		const { getByRole } = renderTabs({ onTabChange });

		const overviewTab = getByRole('tab', { name: 'Overview' });
		const activityTab = getByRole('tab', { name: 'Activity' });
		const settingsTab = getByRole('tab', { name: 'Settings' });

		overviewTab.focus();
		await fireEvent.keyDown(overviewTab, { key: 'End' });
		await waitFor(() => {
			expect(activityTab.getAttribute('aria-selected')).toBe('true');
		});

		await fireEvent.click(settingsTab);
		expect(onTabChange).not.toHaveBeenCalledWith('settings');
		expect(settingsTab.getAttribute('aria-selected')).toBe('false');

		await fireEvent.keyDown(activityTab, { key: 'Home' });
		await waitFor(() => {
			expect(overviewTab.getAttribute('aria-selected')).toBe('true');
		});
	});

	it('treats keyboard focus separately from selection in manual mode', async () => {
		const onTabChange = vi.fn();
		const { getByRole } = renderTabs({ activation: 'manual', onTabChange });

		const overviewTab = getByRole('tab', { name: 'Overview' });
		const activityTab = getByRole('tab', { name: 'Activity' });
		const settingsTab = getByRole('tab', { name: 'Settings' });

		overviewTab.focus();
		await fireEvent.keyDown(overviewTab, { key: 'ArrowRight' });
		expect(document.activeElement).toBe(activityTab);
		expect(onTabChange).not.toHaveBeenCalled();

		await fireEvent.keyDown(activityTab, { key: 'Enter' });
		expect(onTabChange).toHaveBeenCalledWith('activity');

		await fireEvent.keyDown(activityTab, { key: 'ArrowRight' });
		await waitFor(() => expect(document.activeElement).toBe(overviewTab));
		expect(activityTab.getAttribute('aria-selected')).toBe('true');

		await fireEvent.click(settingsTab);
		expect(onTabChange).not.toHaveBeenCalledWith('settings');
		expect(settingsTab.getAttribute('aria-selected')).toBe('false');
	});
});
