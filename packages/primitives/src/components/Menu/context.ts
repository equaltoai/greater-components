/**
 * Menu Context - Shared state and utilities for compound Menu components
 * @module @equaltoai/greater-components/primitives/Menu/context
 */

import { getContext, setContext } from 'svelte';

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface MenuItemConfig {
	id: string;
	label?: string;
	disabled?: boolean;
	destructive?: boolean;
	icon?: unknown;
	shortcut?: string;
	onClick?: () => void;
}

export interface MenuPosition {
	x: number;
	y: number;
	placement: MenuPlacement;
}

export interface MenuContextValue {
	// State
	isOpen: boolean;
	activeIndex: number;
	menuId: string;
	triggerId: string;
	placement: MenuPlacement;
	offset: number;
	loop: boolean;
	position: MenuPosition;

	// Registered items
	items: MenuItemConfig[];

	// Actions
	open: () => void;
	close: () => void;
	toggle: () => void;
	setActiveIndex: (index: number) => void;
	registerItem: (item: MenuItemConfig) => void;
	unregisterItem: (id: string) => void;
	selectItem: (id: string) => void;

	// Refs
	triggerElement: HTMLElement | null;
	contentElement: HTMLElement | null;
	setTriggerElement: (el: HTMLElement | null) => void;
	setContentElement: (el: HTMLElement | null) => void;

	// Positioning
	updatePosition: () => void;
}

const MENU_CONTEXT_KEY = Symbol('menu-context');

/**
 * Create and set menu context in parent component
 */
export function createMenuContext(value: MenuContextValue): void {
	setContext(MENU_CONTEXT_KEY, value);
}

/**
 * Get menu context in child components
 */
export function getMenuContext(): MenuContextValue {
	const context = getContext<MenuContextValue>(MENU_CONTEXT_KEY);
	if (!context) {
		throw new Error('Menu compound components must be used within a Menu.Root component');
	}
	return context;
}

/**
 * Check if menu context exists
 */
export function hasMenuContext(): boolean {
	try {
		getContext<MenuContextValue>(MENU_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

/**
 * Generate unique menu ID
 */
let menuIdCounter = 0;
export function generateMenuId(): string {
	return `gr-menu-${++menuIdCounter}`;
}
