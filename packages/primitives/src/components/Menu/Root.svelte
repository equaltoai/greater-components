<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		createMenuContext,
		generateMenuId,
		MenuState,
		type MenuPlacement,
	} from './context.svelte';
	import { createPositionObserver } from './positioning';

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

	// Initialize state
	const menuState = new MenuState({
		menuId,
		triggerId,
		placement,
		offset,
		loop,
		closeOnSelect,
		onOpenChange: (isOpen) => {
			open = isOpen;
			onOpenChange?.(isOpen);
		},
		initialOpen: open,
	});

	createMenuContext(menuState);

	// Sync external open prop
	$effect(() => {
		if (open !== menuState.isOpen) {
			if (open) menuState.open();
			else menuState.close();
		}
	});

	// Position observer
	let positionCleanup: (() => void) | null = null;
	$effect(() => {
		if (menuState.isOpen && menuState.triggerElement) {
			positionCleanup = createPositionObserver(menuState.triggerElement, menuState.updatePosition);
			menuState.updatePosition();
		}

		return () => {
			positionCleanup?.();
			positionCleanup = null;
		};
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
