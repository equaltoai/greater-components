<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  
  interface MenuItemData {
    id: string;
    label: string;
    disabled?: boolean;
    submenu?: MenuItemData[];
    action?: () => void;
  }

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'role'> {
    items: MenuItemData[];
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    trigger?: Snippet<[{ open: boolean; toggle: () => void }]>;
    onItemSelect?: (item: MenuItemData) => void;
  }

  let {
    items,
    orientation = 'vertical',
    class: className = '',
    trigger,
    onItemSelect,
    ...restProps
  }: Props = $props();

  // State management
  let isOpen = $state(false);
  let activeIndex = $state(-1);
  let typeaheadString = $state('');
  let typeaheadTimeout: ReturnType<typeof setTimeout> | null = $state(null);
  let menuElement: HTMLUListElement | null = $state(null);
  let triggerElement: HTMLElement | null = $state(null);
  let expandedSubmenu = $state<string | null>(null);

  // Compute menu classes
  const menuClass = $derived(() => {
    const classes = [
      'gr-menu',
      `gr-menu--${orientation}`,
      className
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  // Get focusable items (non-disabled items)
  const focusableItems = $derived(() => {
    return items.filter(item => !item.disabled);
  });

  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      activeIndex = -1;
      // Focus first item when opened via keyboard
      requestAnimationFrame(() => {
        const firstItem = menuElement?.querySelector('[role="menuitem"]:not([aria-disabled="true"])') as HTMLElement;
        firstItem?.focus();
        activeIndex = 0;
      });
    }
  }

  function close() {
    isOpen = false;
    activeIndex = -1;
    expandedSubmenu = null;
    triggerElement?.focus();
  }

  function selectItem(item: MenuItemData) {
    if (item.disabled) return;
    
    if (item.submenu) {
      expandedSubmenu = expandedSubmenu === item.id ? null : item.id;
      return;
    }

    item.action?.();
    onItemSelect?.(item);
    close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        break;

      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault();
          moveToNext();
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault();
          moveToPrevious();
        }
        break;

      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault();
          moveToNext();
        } else {
          // Expand submenu in vertical orientation
          const currentItem = focusableItems[activeIndex];
          if (currentItem?.submenu) {
            event.preventDefault();
            expandedSubmenu = currentItem.id;
          }
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault();
          moveToPrevious();
        } else {
          // Collapse submenu in vertical orientation
          event.preventDefault();
          expandedSubmenu = null;
        }
        break;

      case 'Home':
        event.preventDefault();
        moveToFirst();
        break;

      case 'End':
        event.preventDefault();
        moveToLast();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        const currentItem = focusableItems[activeIndex];
        if (currentItem) {
          selectItem(currentItem);
        }
        break;

      default:
        // Typeahead functionality
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          handleTypeahead(event.key.toLowerCase());
        }
        break;
    }
  }

  function moveToNext() {
    const nextIndex = (activeIndex + 1) % focusableItems.length;
    setActiveIndex(nextIndex);
  }

  function moveToPrevious() {
    const prevIndex = activeIndex <= 0 ? focusableItems.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  }

  function moveToFirst() {
    setActiveIndex(0);
  }

  function moveToLast() {
    setActiveIndex(focusableItems.length - 1);
  }

  function setActiveIndex(index: number) {
    activeIndex = index;
    const menuItem = menuElement?.querySelector(`[data-menu-index="${index}"]`) as HTMLElement;
    menuItem?.focus();
  }

  function handleTypeahead(key: string) {
    // Clear previous timeout
    if (typeaheadTimeout) {
      clearTimeout(typeaheadTimeout);
    }

    typeaheadString += key;

    // Find matching item
    const matchingIndex = focusableItems.findIndex(item =>
      item.label.toLowerCase().startsWith(typeaheadString)
    );

    if (matchingIndex !== -1) {
      setActiveIndex(matchingIndex);
    }

    // Clear typeahead string after delay
    typeaheadTimeout = setTimeout(() => {
      typeaheadString = '';
      typeaheadTimeout = null;
    }, 1000);
  }

  function handleClickOutside(event: MouseEvent) {
    if (isOpen && menuElement && !menuElement.contains(event.target as Node) && 
        triggerElement && !triggerElement.contains(event.target as Node)) {
      close();
    }
  }

  // Click outside handler
  $effect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  });
</script>

<div class="gr-menu-container">
  {#if trigger}
    <div bind:this={triggerElement}>
      {@render trigger({ open: isOpen, toggle })}
    </div>
  {/if}

  {#if isOpen}
    <ul
      bind:this={menuElement}
      class={menuClass()}
      role={orientation === 'horizontal' ? 'menubar' : 'menu'}
      aria-orientation={orientation}
      onkeydown={handleKeydown}
      tabindex="-1"
      {...restProps}
    >
      {#each items as item, index}
        {@const focusableIndex = focusableItems.findIndex(fi => fi.id === item.id)}
        <li
          role="none"
          class="gr-menu__item-wrapper"
        >
          <div
            role="menuitem"
            class="gr-menu__item"
            class:gr-menu__item--active={focusableIndex === activeIndex}
            class:gr-menu__item--disabled={item.disabled}
            class:gr-menu__item--has-submenu={!!item.submenu}
            data-menu-index={focusableIndex}
            tabindex={item.disabled ? -1 : (focusableIndex === activeIndex ? 0 : -1)}
            aria-disabled={item.disabled}
            aria-expanded={item.submenu ? (expandedSubmenu === item.id) : undefined}
            aria-haspopup={item.submenu ? 'menu' : undefined}
            onclick={() => selectItem(item)}
            onfocus={() => {
              if (!item.disabled) {
                activeIndex = focusableIndex;
              }
            }}
          >
            <span class="gr-menu__item-label">{item.label}</span>
            {#if item.submenu}
              <span class="gr-menu__item-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            {/if}
          </div>

          {#if item.submenu && expandedSubmenu === item.id}
            <ul
              class="gr-menu gr-menu--submenu"
              role="menu"
              aria-orientation="vertical"
            >
              {#each item.submenu as subItem}
                <li role="none" class="gr-menu__item-wrapper">
                  <div
                    role="menuitem"
                    class="gr-menu__item"
                    class:gr-menu__item--disabled={subItem.disabled}
                    tabindex={subItem.disabled ? -1 : 0}
                    aria-disabled={subItem.disabled}
                    onclick={() => selectItem(subItem)}
                  >
                    <span class="gr-menu__item-label">{subItem.label}</span>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .gr-menu-container {
    position: relative;
    display: inline-block;
  }

  .gr-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: var(--gr-spacing-scale-2);
    background-color: var(--gr-color-base-white);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    box-shadow: var(--gr-shadow-lg);
    z-index: 1000;
    min-width: 12rem;
  }

  .gr-menu--vertical {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
  }

  .gr-menu--horizontal {
    flex-direction: row;
    gap: var(--gr-spacing-scale-1);
  }

  .gr-menu--submenu {
    position: absolute;
    top: 0;
    left: 100%;
    margin-left: var(--gr-spacing-scale-1);
  }

  .gr-menu__item-wrapper {
    position: relative;
  }

  .gr-menu__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
    font-family: var(--gr-typography-fontFamily-sans);
    font-size: var(--gr-typography-fontSize-sm);
    line-height: var(--gr-typography-lineHeight-normal);
    color: var(--gr-semantic-foreground-primary);
    background-color: transparent;
    border: none;
    border-radius: var(--gr-radii-sm);
    cursor: pointer;
    transition-property: background-color, color;
    transition-duration: var(--gr-motion-duration-fast);
    transition-timing-function: var(--gr-motion-easing-out);
    text-align: left;
    white-space: nowrap;
  }

  .gr-menu__item:focus {
    outline: none;
  }

  .gr-menu__item:focus-visible {
    box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
  }

  .gr-menu__item:hover:not(.gr-menu__item--disabled),
  .gr-menu__item--active:not(.gr-menu__item--disabled) {
    background-color: var(--gr-semantic-background-secondary);
    color: var(--gr-semantic-foreground-primary);
  }

  .gr-menu__item--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  .gr-menu__item-label {
    flex: 1;
  }

  .gr-menu__item-arrow {
    display: flex;
    align-items: center;
    margin-left: var(--gr-spacing-scale-2);
    opacity: 0.7;
  }

  .gr-menu--horizontal .gr-menu__item {
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .gr-menu__item {
      transition-duration: 0ms;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .gr-menu {
      background-color: var(--gr-semantic-background-primary);
      border-color: var(--gr-semantic-border-subtle);
    }
  }
</style>