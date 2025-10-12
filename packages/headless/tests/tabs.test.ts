/**
 * Tabs Primitive Tests
 * 
 * Comprehensive test suite for the Tabs headless primitive.
 * Tests tab selection, keyboard navigation, focus management, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTabs } from '../src/primitives/tabs';

describe('Tabs Primitive', () => {
	describe('Initialization', () => {
		it('should create with default config', () => {
			const tabs = createTabs();

			expect(tabs.state.activeTab).toBe(0);
			expect(tabs.state.tabs).toEqual([]);
			expect(tabs.state.panels).toEqual([]);
			expect(tabs.state.orientation).toBe('horizontal');
			expect(tabs.state.activateOnFocus).toBe(false);
		});

		it('should initialize with custom active tab', () => {
			const tabs = createTabs({ defaultTab: 2 });

			expect(tabs.state.activeTab).toBe(2);
		});

		it('should initialize with vertical orientation', () => {
			const tabs = createTabs({ orientation: 'vertical' });

			expect(tabs.state.orientation).toBe('vertical');
		});

		it('should initialize with activateOnFocus', () => {
			const tabs = createTabs({ activateOnFocus: true });

			expect(tabs.state.activateOnFocus).toBe(true);
		});
	});

	describe('Tab Selection', () => {
		it('should change active tab', () => {
			const tabs = createTabs({ defaultTab: 0 });

			tabs.helpers.setActiveTab(2);

			expect(tabs.state.activeTab).toBe(2);
		});

		it('should call onChange when tab changes', () => {
			const onChange = vi.fn();
			const tabs = createTabs({ onChange });

			tabs.helpers.setActiveTab(1);

			expect(onChange).toHaveBeenCalledWith(1);
		});

		it('should not call onChange if tab is the same', () => {
			const onChange = vi.fn();
			const tabs = createTabs({ defaultTab: 1, onChange });

			tabs.helpers.setActiveTab(1);

			expect(onChange).not.toHaveBeenCalled();
		});

		it('should not select disabled tab', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const tab1 = document.createElement('button');
			const tab2 = document.createElement('button');

			tabs.actions.tab(tab1, { index: 0 });
			tabs.actions.tab(tab2, { index: 1, disabled: true });

			tabs.helpers.setActiveTab(1);

			expect(tabs.state.activeTab).toBe(0);
		});
	});

	describe('Tab List Action', () => {
		let tabListEl: HTMLDivElement;

		beforeEach(() => {
			tabListEl = document.createElement('div');
			document.body.appendChild(tabListEl);
		});

		afterEach(() => {
			document.body.removeChild(tabListEl);
		});

		it('should set role=tablist', () => {
			const tabs = createTabs();
			const action = tabs.actions.tabList(tabListEl);

			expect(tabListEl.getAttribute('role')).toBe('tablist');

			action.destroy();
		});

		it('should set aria-orientation', () => {
			const tabs = createTabs({ orientation: 'vertical' });
			const action = tabs.actions.tabList(tabListEl);

			expect(tabListEl.getAttribute('aria-orientation')).toBe('vertical');

			action.destroy();
		});

		it('should update orientation dynamically', () => {
			const tabs = createTabs({ orientation: 'horizontal' });
			const action = tabs.actions.tabList(tabListEl);

			expect(tabListEl.getAttribute('aria-orientation')).toBe('horizontal');

			tabs.helpers.setOrientation('vertical');

			expect(tabs.state.orientation).toBe('vertical');
			expect(tabListEl.getAttribute('aria-orientation')).toBe('vertical');

			action.destroy();
		});
	});

	describe('Tab Action', () => {
		let tabEl: HTMLButtonElement;

		beforeEach(() => {
			tabEl = document.createElement('button');
			document.body.appendChild(tabEl);
		});

		afterEach(() => {
			document.body.removeChild(tabEl);
		});

		it('should register tab', () => {
			const tabs = createTabs();
			const action = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabs.state.tabs).toContain(tabEl);

			action.destroy();
		});

		it('should unregister tab on destroy', () => {
			const tabs = createTabs();
			const action = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabs.state.tabs).toContain(tabEl);

			action.destroy();

			expect(tabs.state.tabs).not.toContain(tabEl);
		});

		it('should set role=tab', () => {
			const tabs = createTabs();
			const action = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabEl.getAttribute('role')).toBe('tab');

			action.destroy();
		});

		it('should set aria-selected for active tab', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const action = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabEl.getAttribute('aria-selected')).toBe('true');

			action.destroy();
		});

		it('should not set aria-selected for inactive tab', () => {
			const tabs = createTabs({ defaultTab: 1 });
			const action = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabEl.getAttribute('aria-selected')).toBe('false');

			action.destroy();
		});

		it('should set tabindex=0 for active tab', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const action = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabEl.tabIndex).toBe(0);

			action.destroy();
		});

		it('should set tabindex=-1 for inactive tab', () => {
			const tabs = createTabs({ defaultTab: 1 });
			const action = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabEl.tabIndex).toBe(-1);

			action.destroy();
		});

		it('should change tab on click', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const action = tabs.actions.tab(tabEl, { index: 2 });

			tabEl.click();

			expect(tabs.state.activeTab).toBe(2);

			action.destroy();
		});

		it('should not change tab when disabled', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const action = tabs.actions.tab(tabEl, { index: 2, disabled: true });

			tabEl.click();

			expect(tabs.state.activeTab).toBe(0);

			action.destroy();
		});

		it('should set aria-disabled when disabled', () => {
			const tabs = createTabs();
			const action = tabs.actions.tab(tabEl, { index: 0, disabled: true });

			expect(tabEl.getAttribute('aria-disabled')).toBe('true');

			action.destroy();
		});

		it('should set aria-controls to panel ID', () => {
			const tabs = createTabs();
			const panelEl = document.createElement('div');
			panelEl.id = 'panel-0';

			const panelAction = tabs.actions.panel(panelEl, { index: 0 });
			const tabAction = tabs.actions.tab(tabEl, { index: 0 });

			expect(tabEl.getAttribute('aria-controls')).toBe('panel-0');

			tabAction.destroy();
			panelAction.destroy();
		});
	});

	describe('Panel Action', () => {
		let panelEl: HTMLDivElement;

		beforeEach(() => {
			panelEl = document.createElement('div');
			document.body.appendChild(panelEl);
		});

		afterEach(() => {
			document.body.removeChild(panelEl);
		});

		it('should register panel', () => {
			const tabs = createTabs();
			const action = tabs.actions.panel(panelEl, { index: 0 });

			expect(tabs.state.panels).toContain(panelEl);

			action.destroy();
		});

		it('should unregister panel on destroy', () => {
			const tabs = createTabs();
			const action = tabs.actions.panel(panelEl, { index: 0 });

			expect(tabs.state.panels).toContain(panelEl);

			action.destroy();

			expect(tabs.state.panels).not.toContain(panelEl);
		});

		it('should set role=tabpanel', () => {
			const tabs = createTabs();
			const action = tabs.actions.panel(panelEl, { index: 0 });

			expect(panelEl.getAttribute('role')).toBe('tabpanel');

			action.destroy();
		});

		it('should set aria-labelledby to tab ID', () => {
			const tabs = createTabs();
			const tabEl = document.createElement('button');
			tabEl.id = 'tab-0';

			const tabAction = tabs.actions.tab(tabEl, { index: 0 });
			const panelAction = tabs.actions.panel(panelEl, { index: 0 });

			expect(panelEl.getAttribute('aria-labelledby')).toBe('tab-0');

			tabAction.destroy();
			panelAction.destroy();
		});

		it('should show active panel', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const action = tabs.actions.panel(panelEl, { index: 0 });

			expect(panelEl.hidden).toBe(false);

			action.destroy();
		});

		it('should hide inactive panel', () => {
			const tabs = createTabs({ defaultTab: 1 });
			const action = tabs.actions.panel(panelEl, { index: 0 });

			expect(panelEl.hidden).toBe(true);

			action.destroy();
		});

		it('should be keyboard accessible', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const action = tabs.actions.panel(panelEl, { index: 0 });

			expect(panelEl.tabIndex).toBe(0);

			action.destroy();
		});
	});

	describe('Keyboard Navigation - Horizontal', () => {
		let tabs: ReturnType<typeof createTabs>;
		let tab0: HTMLButtonElement;
		let tab1: HTMLButtonElement;
		let tab2: HTMLButtonElement;

		beforeEach(() => {
			tabs = createTabs({ orientation: 'horizontal', defaultTab: 0 });
			tab0 = document.createElement('button');
			tab1 = document.createElement('button');
			tab2 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0 });
			tabs.actions.tab(tab1, { index: 1 });
			tabs.actions.tab(tab2, { index: 2 });

			document.body.appendChild(tab0);
			document.body.appendChild(tab1);
			document.body.appendChild(tab2);
		});

		afterEach(() => {
			document.body.removeChild(tab0);
			document.body.removeChild(tab1);
			document.body.removeChild(tab2);
		});

		it('should navigate to next tab with ArrowRight', () => {
			tab0.focus();

			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			tab0.dispatchEvent(event);

			expect(document.activeElement).toBe(tab1);
		});

		it('should navigate to previous tab with ArrowLeft', () => {
			tabs.helpers.setActiveTab(1);
			tab1.focus();

			const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
			tab1.dispatchEvent(event);

			expect(document.activeElement).toBe(tab0);
		});

		it('should wrap to first tab from last with ArrowRight', () => {
			tabs.helpers.setActiveTab(2);
			tab2.focus();

			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			tab2.dispatchEvent(event);

			expect(document.activeElement).toBe(tab0);
		});

		it('should wrap to last tab from first with ArrowLeft', () => {
			tab0.focus();

			const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
			tab0.dispatchEvent(event);

			expect(document.activeElement).toBe(tab2);
		});

		it('should navigate to first tab with Home', () => {
			tabs.helpers.setActiveTab(2);
			tab2.focus();

			const event = new KeyboardEvent('keydown', { key: 'Home' });
			tab2.dispatchEvent(event);

			expect(tabs.state.activeTab).toBe(0);
			expect(document.activeElement).toBe(tab0);
		});

		it('should navigate to last tab with End', () => {
			tab0.focus();

			const event = new KeyboardEvent('keydown', { key: 'End' });
			tab0.dispatchEvent(event);

			expect(tabs.state.activeTab).toBe(2);
			expect(document.activeElement).toBe(tab2);
		});
	});

	describe('Keyboard Navigation - Vertical', () => {
		let tabs: ReturnType<typeof createTabs>;
		let tab0: HTMLButtonElement;
		let tab1: HTMLButtonElement;

		beforeEach(() => {
			tabs = createTabs({ orientation: 'vertical', defaultTab: 0 });
			tab0 = document.createElement('button');
			tab1 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0 });
			tabs.actions.tab(tab1, { index: 1 });

			document.body.appendChild(tab0);
			document.body.appendChild(tab1);
		});

		afterEach(() => {
			document.body.removeChild(tab0);
			document.body.removeChild(tab1);
		});

		it('should navigate to next tab with ArrowDown', () => {
			tab0.focus();

			const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
			tab0.dispatchEvent(event);

			expect(document.activeElement).toBe(tab1);
		});

		it('should navigate to previous tab with ArrowUp', () => {
			tabs.helpers.setActiveTab(1);
			tab1.focus();

			const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
			tab1.dispatchEvent(event);

			expect(document.activeElement).toBe(tab0);
		});

		it('should ignore ArrowLeft and ArrowRight in vertical mode', () => {
			tab0.focus();

			const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			tab0.dispatchEvent(rightEvent);

			expect(document.activeElement).toBe(tab0);

			const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
			tab0.dispatchEvent(leftEvent);

			expect(document.activeElement).toBe(tab0);
		});
	});

	describe('Activate on Focus', () => {
		let tabs: ReturnType<typeof createTabs>;
		let tab0: HTMLButtonElement;
		let tab1: HTMLButtonElement;

		beforeEach(() => {
			tabs = createTabs({ activateOnFocus: true, defaultTab: 0 });
			tab0 = document.createElement('button');
			tab1 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0 });
			tabs.actions.tab(tab1, { index: 1 });

			document.body.appendChild(tab0);
			document.body.appendChild(tab1);
		});

		afterEach(() => {
			document.body.removeChild(tab0);
			document.body.removeChild(tab1);
		});

		it('should activate tab on focus when enabled', () => {
			tab1.focus();

			expect(tabs.state.activeTab).toBe(1);
		});

		it('should not activate tab on focus when disabled', () => {
			const manualTabs = createTabs({ activateOnFocus: false, defaultTab: 0 });
			const manualTab0 = document.createElement('button');
			const manualTab1 = document.createElement('button');

			manualTabs.actions.tab(manualTab0, { index: 0 });
			manualTabs.actions.tab(manualTab1, { index: 1 });

			document.body.appendChild(manualTab0);
			document.body.appendChild(manualTab1);

			manualTab1.focus();

			expect(manualTabs.state.activeTab).toBe(0);

			document.body.removeChild(manualTab0);
			document.body.removeChild(manualTab1);
		});
	});

	describe('Disabled Tabs', () => {
		let tabs: ReturnType<typeof createTabs>;
		let tab0: HTMLButtonElement;
		let tab1: HTMLButtonElement;
		let tab2: HTMLButtonElement;

		beforeEach(() => {
			tabs = createTabs({ defaultTab: 0 });
			tab0 = document.createElement('button');
			tab1 = document.createElement('button');
			tab2 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0 });
			tabs.actions.tab(tab1, { index: 1, disabled: true });
			tabs.actions.tab(tab2, { index: 2 });

			document.body.appendChild(tab0);
			document.body.appendChild(tab1);
			document.body.appendChild(tab2);
		});

		afterEach(() => {
			document.body.removeChild(tab0);
			document.body.removeChild(tab1);
			document.body.removeChild(tab2);
		});

		it('should skip disabled tabs when navigating', () => {
			tab0.focus();

			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			tab0.dispatchEvent(event);

			expect(document.activeElement).toBe(tab2); // Skip tab1
		});

		it('should not activate disabled tab on click', () => {
			tab1.click();

			expect(tabs.state.activeTab).toBe(0);
		});

		it('should set aria-disabled on disabled tab', () => {
			expect(tab1.getAttribute('aria-disabled')).toBe('true');
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const tabs = createTabs({ onDestroy });
			const tabEl = document.createElement('button');

			const action = tabs.actions.tab(tabEl, { index: 0 });
			action.destroy();

			expect(onDestroy).toHaveBeenCalled();
		});

		it('should clean up all tabs on destroy', () => {
			const tabs = createTabs();
			const tab1 = document.createElement('button');
			const tab2 = document.createElement('button');

			const action1 = tabs.actions.tab(tab1, { index: 0 });
			const action2 = tabs.actions.tab(tab2, { index: 1 });

			expect(tabs.state.tabs.length).toBe(2);

			action1.destroy();
			action2.destroy();

			expect(tabs.state.tabs.length).toBe(0);
		});

		it('should clean up all panels on destroy', () => {
			const tabs = createTabs();
			const panel1 = document.createElement('div');
			const panel2 = document.createElement('div');

			const action1 = tabs.actions.panel(panel1, { index: 0 });
			const action2 = tabs.actions.panel(panel2, { index: 1 });

			expect(tabs.state.panels.length).toBe(2);

			action1.destroy();
			action2.destroy();

			expect(tabs.state.panels.length).toBe(0);
		});
	});

	describe('Edge Cases', () => {
		it('should handle no tabs', () => {
			const tabs = createTabs();

			expect(() => tabs.helpers.setActiveTab(0)).not.toThrow();
		});

		it('should handle setting active tab beyond range', () => {
			const tabs = createTabs();
			const tab0 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0 });

			tabs.helpers.setActiveTab(10);

			expect(tabs.state.activeTab).toBe(0);
		});

		it('should handle negative tab index', () => {
			const tabs = createTabs();
			const tab0 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0 });

			tabs.helpers.setActiveTab(-1);

			expect(tabs.state.activeTab).toBe(0);
		});

		it('should handle all tabs disabled', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const tab0 = document.createElement('button');
			const tab1 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0, disabled: true });
			tabs.actions.tab(tab1, { index: 1, disabled: true });

			tabs.helpers.setActiveTab(1);

			expect(tabs.state.activeTab).toBe(0); // Should stay on current tab
		});

		it('should handle rapid tab changes', () => {
			const tabs = createTabs();
			const tab0 = document.createElement('button');
			const tab1 = document.createElement('button');
			const tab2 = document.createElement('button');

			tabs.actions.tab(tab0, { index: 0 });
			tabs.actions.tab(tab1, { index: 1 });
			tabs.actions.tab(tab2, { index: 2 });

			tabs.helpers.setActiveTab(1);
			tabs.helpers.setActiveTab(2);
			tabs.helpers.setActiveTab(0);

			expect(tabs.state.activeTab).toBe(0);
		});
	});

	describe('Accessibility', () => {
		it('should have correct ARIA roles', () => {
			const tabs = createTabs();
			const tabListEl = document.createElement('div');
			const tabEl = document.createElement('button');
			const panelEl = document.createElement('div');

			const listAction = tabs.actions.tabList(tabListEl);
			const tabAction = tabs.actions.tab(tabEl, { index: 0 });
			const panelAction = tabs.actions.panel(panelEl, { index: 0 });

			expect(tabListEl.getAttribute('role')).toBe('tablist');
			expect(tabEl.getAttribute('role')).toBe('tab');
			expect(panelEl.getAttribute('role')).toBe('tabpanel');

			listAction.destroy();
			tabAction.destroy();
			panelAction.destroy();
		});

		it('should link tabs and panels with ARIA attributes', () => {
			const tabs = createTabs();
			const tabEl = document.createElement('button');
			const panelEl = document.createElement('div');

			tabEl.id = 'tab-0';
			panelEl.id = 'panel-0';

			const tabAction = tabs.actions.tab(tabEl, { index: 0 });
			const panelAction = tabs.actions.panel(panelEl, { index: 0 });

			expect(tabEl.getAttribute('aria-controls')).toBe('panel-0');
			expect(panelEl.getAttribute('aria-labelledby')).toBe('tab-0');

			tabAction.destroy();
			panelAction.destroy();
		});

		it('should indicate selected state', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const tab0 = document.createElement('button');
			const tab1 = document.createElement('button');

			const action0 = tabs.actions.tab(tab0, { index: 0 });
			const action1 = tabs.actions.tab(tab1, { index: 1 });

			expect(tab0.getAttribute('aria-selected')).toBe('true');
			expect(tab1.getAttribute('aria-selected')).toBe('false');

			tabs.helpers.setActiveTab(1);

			expect(tab0.getAttribute('aria-selected')).toBe('false');
			expect(tab1.getAttribute('aria-selected')).toBe('true');

			action0.destroy();
			action1.destroy();
		});

		it('should manage focus properly', () => {
			const tabs = createTabs({ defaultTab: 0 });
			const tab0 = document.createElement('button');
			const tab1 = document.createElement('button');

			document.body.appendChild(tab0);
			document.body.appendChild(tab1);

			tabs.actions.tab(tab0, { index: 0 });
			tabs.actions.tab(tab1, { index: 1 });

			expect(tab0.tabIndex).toBe(0);
			expect(tab1.tabIndex).toBe(-1);

			tabs.helpers.setActiveTab(1);

			expect(tab0.tabIndex).toBe(-1);
			expect(tab1.tabIndex).toBe(0);

			document.body.removeChild(tab0);
			document.body.removeChild(tab1);
		});
	});
});

