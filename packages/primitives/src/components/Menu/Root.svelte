<script lang="ts">
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import {
		createMenuContext,
		generateMenuId,
		type MenuPlacement,
		type MenuItemConfig,
		type MenuPosition,
	} from './context';
	import { calculatePosition, createPositionObserver } from './positioning';

	interface Props {
		/** Whether the menu is open (bindable) */
		open?: boolean;
		/** Preferred placement of the menu content */
		placement?: MenuPlacement;
		/** Offset from trigger in pixels */
		offset?: number;
		/** Close menu when item is selected */
		closeOnSelect?: boolean;
		/** Enable keyboard navigation loop */
		loop?: boolean;
		/** Custom CSS class */
		class?: string;
		/** Child content (compound components) */
		children: Snippet;
		/** Called when open state changes */
		onOpenChange?: (open: boolean) => void;
	}

	let {
		open = $bindable(false),
		placement = 'bottom-start',
		offset = 4,
		closeOnSelect = true,
		loop = true,
		class: className = '',
		children,
		onOpenChange,
	}: Props = $props();

	// Generate unique IDs
	const menuId = generateMenuId();
	const triggerId = `${menuId}-trigger`;

	// State
	let isOpen = $state(open);
	let activeIndex = $state(-1);
	let items = $state<MenuItemConfig[]>([]);
	let position = $state<MenuPosition>({ x: 0, y: 0, placement });
	let triggerElement = $state<HTMLElement | null>(null);
	let contentElement = $state<HTMLElement | null>(null);
	let positionCleanup: (() => void) | null = null;

	// Sync external open prop
	$effect(() => {
		if (open !== isOpen) {
			isOpen = open;
		}
	});

	// Notify on open change
	$effect(() => {
		onOpenChange?.(isOpen);
		open = isOpen;
	});

	// Position observer
	$effect(() => {
		if (isOpen && triggerElement) {
			positionCleanup = createPositionObserver(triggerElement, updatePosition);
			updatePosition();
		}

		return () => {
			positionCleanup?.();
			positionCleanup = null;
		};
	});

	function updatePosition() {
		if (!triggerElement || !contentElement) return;

		const triggerRect = triggerElement.getBoundingClientRect();
		const contentRect = contentElement.getBoundingClientRect();

		position = calculatePosition({
			triggerRect,
			contentRect,
			placement,
			offset,
		});
	}

	function openMenu() {
		if (isOpen) return;
		isOpen = true;
		activeIndex = -1;
		tick().then(() => {
			updatePosition();
			// Focus first item
			if (items.length > 0) {
				const firstEnabled = items.findIndex((item) => !item.disabled);
				if (firstEnabled !== -1) {
					activeIndex = firstEnabled;
				}
			}
		});
	}

	function closeMenu() {
		if (!isOpen) return;
		isOpen = false;
		activeIndex = -1;
		tick().then(() => {
			// Focus the first focusable element within the trigger, or the trigger itself
			const focusableSelector =
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
			const focusable = triggerElement?.querySelector(focusableSelector) as HTMLElement | null;
			(focusable ?? triggerElement)?.focus();
		});
	}

	function toggleMenu() {
		if (isOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	}

	function setActiveIndex(index: number) {
		if (index >= 0 && index < items.length) {
			activeIndex = index;
		}
	}

	function registerItem(item: MenuItemConfig) {
		items = [...items, item];
	}

	function unregisterItem(id: string) {
		items = items.filter((item) => item.id !== id);
	}

	function selectItem(id: string) {
		const item = items.find((i) => i.id === id);
		if (item && !item.disabled) {
			item.onClick?.();
			if (closeOnSelect) {
				closeMenu();
			}
		}
	}

	function setTriggerElement(el: HTMLElement | null) {
		triggerElement = el;
	}

	function setContentElement(el: HTMLElement | null) {
		contentElement = el;
		if (el && isOpen) {
			tick().then(updatePosition);
		}
	}

	// Create and provide context
	createMenuContext({
		get isOpen() {
			return isOpen;
		},
		get activeIndex() {
			return activeIndex;
		},
		menuId,
		triggerId,
		get placement() {
			return placement;
		},
		offset,
		loop,
		get position() {
			return position;
		},
		get items() {
			return items;
		},
		open: openMenu,
		close: closeMenu,
		toggle: toggleMenu,
		setActiveIndex,
		registerItem,
		unregisterItem,
		selectItem,
		get triggerElement() {
			return triggerElement;
		},
		get contentElement() {
			return contentElement;
		},
		setTriggerElement,
		setContentElement,
		updatePosition,
	});
</script>

<div class="gr-menu-root {className}">
	{@render children()}
</div>

<style>
	.gr-menu-root {
		position: relative;
		display: inline-block;
	}
</style>
