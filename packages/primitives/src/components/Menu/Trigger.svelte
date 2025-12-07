<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getMenuContext } from './context';

	interface Props {
		/** Custom CSS class */
		class?: string;
		/** Trigger content */
		children: Snippet;
		/** Whether trigger is disabled */
		disabled?: boolean;
	}

	let {
		class: className = '',
		children,
		disabled = false,
	}: Props = $props();

	const ctx = getMenuContext();

	let triggerRef: HTMLElement | null = $state(null);

	$effect(() => {
		ctx.setTriggerElement(triggerRef);
	});

	function handleClick(event: MouseEvent) {
		if (disabled) return;
		event.preventDefault();
		ctx.toggle();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (disabled) return;
		
		switch (event.key) {
			case 'ArrowDown':
			case 'Enter':
			case ' ':
				event.preventDefault();
				ctx.open();
				break;
			case 'ArrowUp':
				event.preventDefault();
				ctx.open();
				// Focus last item when opening with ArrowUp
				if (ctx.items.length > 0) {
					const lastEnabled = [...ctx.items].reverse().findIndex(item => !item.disabled);
					if (lastEnabled !== -1) {
						ctx.setActiveIndex(ctx.items.length - 1 - lastEnabled);
					}
				}
				break;
			case 'Escape':
				if (ctx.isOpen) {
					event.preventDefault();
					ctx.close();
				}
				break;
		}
	}
</script>

<div
	bind:this={triggerRef}
	class="gr-menu-trigger {className}"
	role="button"
	tabindex={disabled ? -1 : 0}
	id={ctx.triggerId}
	aria-haspopup="menu"
	aria-expanded={ctx.isOpen}
	aria-controls={ctx.menuId}
	aria-disabled={disabled || undefined}
	onclick={handleClick}
	onkeydown={handleKeyDown}
>
	{@render children()}
</div>

<style>
	.gr-menu-trigger {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}
	
	.gr-menu-trigger[aria-disabled="true"] {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>