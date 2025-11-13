/**
 * Tabs Primitive Tests
 *
 * Covers registration, keyboard navigation, and accessibility behavior.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTabs } from '../src/primitives/tabs';
import type { TabsConfig } from '../src/primitives/tabs';
import type { ActionReturn } from '../src/types/common';

function destroyAction(action: ActionReturn | void): void {
	if (
		action &&
		typeof action === 'object' &&
		'destroy' in action &&
		typeof action.destroy === 'function'
	) {
		action.destroy();
	}
}

function cleanup(actions: Array<ActionReturn | void>): void {
	actions.forEach(destroyAction);
}

function appendElement<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	parent: HTMLElement = document.body
): HTMLElementTagNameMap[K] {
	const element = document.createElement(tag);
	parent.appendChild(element);
	return element;
}

function createButton(label: string, parent?: HTMLElement): HTMLButtonElement {
	const button = appendElement('button', parent);
	button.type = 'button';
	button.textContent = label;
	return button;
}

function setupTabs(
	options: { count?: number; config?: TabsConfig; disabledIndices?: number[] } = {}
) {
	const { count = 3, config, disabledIndices = [] } = options;
	const instance = createTabs(config);
	const tabList = appendElement('div');
	const actions: Array<ActionReturn | void> = [];

	actions.push(instance.actions.tabList(tabList));

	const tabButtons: HTMLButtonElement[] = [];
	const panelElements: HTMLElement[] = [];

	for (let index = 0; index < count; index++) {
		const tab = createButton(`Tab ${index + 1}`, tabList);
		tabButtons.push(tab);
		const tabAction = instance.actions.tab(tab, {
			index,
			disabled: disabledIndices.includes(index),
		});
		actions.push(tabAction);

		const panel = appendElement('div');
		panel.textContent = `Panel ${index + 1}`;
		panelElements.push(panel);
		const panelAction = instance.actions.panel(panel, { index });
		actions.push(panelAction);
	}

	return {
		instance,
		tabList,
		tabButtons,
		panelElements,
		actions,
	};
}

function expectTab(tabButtons: HTMLButtonElement[], index: number): HTMLButtonElement {
	const tab = tabButtons[index];
	if (!tab) {
		throw new Error(`Expected tab at index ${index} to be registered`);
	}
	return tab;
}

function expectPanel(panels: HTMLElement[], index: number): HTMLElement {
	const panel = panels[index];
	if (!panel) {
		throw new Error(`Expected panel at index ${index} to be registered`);
	}
	return panel;
}

describe('Tabs Primitive', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe('Initialization', () => {
		it('should initialize with default state', () => {
			const tabs = createTabs();

			expect(tabs.state.activeTab).toBe(0);
			expect(tabs.state.orientation).toBe('horizontal');
			expect(tabs.state.activateOnFocus).toBe(false);
			expect(tabs.state.loop).toBe(true);
			expect(tabs.state.tabs.length).toBe(0);
			expect(tabs.state.panels.length).toBe(0);
		});
	});

	describe('Registration and ARIA attributes', () => {
		it('registers tab list, tabs, and panels with expected attributes', () => {
			const { tabList, tabButtons, panelElements, actions } = setupTabs();
			const firstTab = expectTab(tabButtons, 0);
			const secondTab = expectTab(tabButtons, 1);
			const firstPanel = expectPanel(panelElements, 0);
			const secondPanel = expectPanel(panelElements, 1);

			expect(tabList.getAttribute('role')).toBe('tablist');
			expect(tabList.getAttribute('aria-orientation')).toBe('horizontal');

			expect(firstTab.getAttribute('role')).toBe('tab');
			expect(firstTab.getAttribute('aria-selected')).toBe('true');
			expect(secondTab.getAttribute('aria-selected')).toBe('false');
			expect(firstTab.getAttribute('aria-controls')).toBe('panel-0');
			expect(firstPanel.getAttribute('aria-labelledby')).toBe('tab-0');
			expect(firstPanel.hidden).toBe(false);
			expect(secondPanel.hidden).toBe(true);

			cleanup(actions);
		});
	});

	describe('Activation and callbacks', () => {
		it('updates active tab via helper and fires onChange', () => {
			const onChange = vi.fn();
			const { instance, tabButtons, panelElements, actions } = setupTabs({ config: { onChange } });
			const firstTab = expectTab(tabButtons, 0);
			const thirdTab = expectTab(tabButtons, 2);
			const firstPanel = expectPanel(panelElements, 0);
			const thirdPanel = expectPanel(panelElements, 2);

			instance.helpers.setActiveTab(2);

			expect(instance.state.activeTab).toBe(2);
			expect(onChange).toHaveBeenCalledWith(2);
			expect(thirdTab.getAttribute('aria-selected')).toBe('true');
			expect(firstTab.getAttribute('aria-selected')).toBe('false');
			expect(thirdPanel.hidden).toBe(false);
			expect(firstPanel.hidden).toBe(true);

			cleanup(actions);
		});

		it('activates tab on click and respects activateOnFocus flag', () => {
			const { instance, tabButtons, actions } = setupTabs({ config: { activateOnFocus: false } });
			const secondTab = expectTab(tabButtons, 1);
			const thirdTab = expectTab(tabButtons, 2);

			secondTab.focus();
			secondTab.dispatchEvent(new FocusEvent('focus'));

			expect(instance.state.focusedIndex).toBe(1);
			expect(instance.state.activeTab).toBe(0);

			secondTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			expect(instance.state.activeTab).toBe(1);

			thirdTab.click();
			expect(instance.state.activeTab).toBe(2);

			cleanup(actions);
		});

		it('automatically activates when activateOnFocus is true', () => {
			const { instance, tabButtons, actions } = setupTabs({ config: { activateOnFocus: true } });
			const secondTab = expectTab(tabButtons, 1);

			secondTab.focus();
			secondTab.dispatchEvent(new FocusEvent('focus'));

			expect(instance.state.activeTab).toBe(1);

			cleanup(actions);
		});
	});

	describe('Keyboard navigation', () => {
		it('navigates with arrow keys horizontally and loops by default', () => {
			const { instance, tabList, tabButtons, actions } = setupTabs();
			const firstTab = expectTab(tabButtons, 0);
			const secondTab = expectTab(tabButtons, 1);
			const thirdTab = expectTab(tabButtons, 2);

			firstTab.focus();
			firstTab.dispatchEvent(new FocusEvent('focus'));

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(document.activeElement).toBe(secondTab);

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(document.activeElement).toBe(thirdTab);

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(document.activeElement).toBe(firstTab);

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
			expect(document.activeElement).toBe(thirdTab);

			expect(instance.state.focusedIndex).toBe(2);

			cleanup(actions);
		});

		it('respects loop=false by staying at ends', () => {
			const { tabList, tabButtons, actions } = setupTabs({ config: { loop: false } });
			const firstTab = expectTab(tabButtons, 0);
			const thirdTab = expectTab(tabButtons, 2);

			thirdTab.focus();
			thirdTab.dispatchEvent(new FocusEvent('focus'));

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(document.activeElement).toBe(thirdTab);

			firstTab.focus();
			firstTab.dispatchEvent(new FocusEvent('focus'));
			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
			expect(document.activeElement).toBe(firstTab);

			cleanup(actions);
		});

		it('uses vertical arrow keys when orientation is vertical', () => {
			const { instance, tabList, tabButtons, actions } = setupTabs({
				config: { orientation: 'vertical' },
			});
			const firstTab = expectTab(tabButtons, 0);
			const secondTab = expectTab(tabButtons, 1);

			firstTab.focus();
			firstTab.dispatchEvent(new FocusEvent('focus'));

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			expect(document.activeElement).toBe(secondTab);

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
			expect(document.activeElement).toBe(firstTab);

			expect(instance.state.focusedIndex).toBe(0);

			cleanup(actions);
		});

		it('supports Home and End keys to activate first/last tabs', () => {
			const { instance, tabList, tabButtons, actions } = setupTabs();
			const firstTab = expectTab(tabButtons, 0);
			const secondTab = expectTab(tabButtons, 1);
			const thirdTab = expectTab(tabButtons, 2);

			secondTab.focus();
			secondTab.dispatchEvent(new FocusEvent('focus'));

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
			expect(document.activeElement).toBe(thirdTab);
			expect(instance.state.activeTab).toBe(2);

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
			expect(document.activeElement).toBe(firstTab);
			expect(instance.state.activeTab).toBe(0);

			cleanup(actions);
		});
	});

	describe('Disabled tabs', () => {
		it('skips disabled tabs during navigation and marks attributes', () => {
			const { tabList, tabButtons, actions } = setupTabs({ disabledIndices: [1] });
			const firstTab = expectTab(tabButtons, 0);
			const secondTab = expectTab(tabButtons, 1);
			const thirdTab = expectTab(tabButtons, 2);

			expect(secondTab.getAttribute('aria-disabled')).toBe('true');
			expect(secondTab.tabIndex).toBe(-1);

			firstTab.focus();
			firstTab.dispatchEvent(new FocusEvent('focus'));

			tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(document.activeElement).toBe(thirdTab);

			cleanup(actions);
		});
	});
});
