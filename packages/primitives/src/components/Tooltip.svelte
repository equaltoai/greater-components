<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    trigger?: 'hover' | 'focus' | 'click' | 'manual';
    delay?: { show?: number; hide?: number } | number;
    disabled?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    content,
    placement = 'top',
    trigger = 'hover',
    delay = { show: 500, hide: 100 },
    disabled = false,
    class: className = '',
    children
  }: Props = $props();
  const restProps = $restProps();

  // Normalize delay prop
  const normalizedDelay = $derived(() => {
    if (typeof delay === 'number') {
      return { show: delay, hide: delay };
    }
    return { show: 500, hide: 100, ...delay };
  });

  // State management
  let isVisible = $state(false);
  let triggerElement: HTMLElement | null = $state(null);
  let tooltipElement: HTMLDivElement | null = $state(null);
  let showTimeout: ReturnType<typeof setTimeout> | null = $state(null);
  let hideTimeout: ReturnType<typeof setTimeout> | null = $state(null);
  let longPressTimeout: ReturnType<typeof setTimeout> | null = $state(null);
  let actualPlacement = $state(placement);

  // Computed tooltip position
  let tooltipPosition = $state({ top: 0, left: 0 });

  function clearTimeouts() {
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      longPressTimeout = null;
    }
  }

  function show() {
    if (disabled || isVisible) return;
    
    clearTimeouts();
    showTimeout = setTimeout(() => {
      isVisible = true;
      // Calculate position after tooltip is rendered
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, normalizedDelay().show);
  }

  function hide() {
    if (disabled || !isVisible) return;
    
    clearTimeouts();
    hideTimeout = setTimeout(() => {
      isVisible = false;
    }, normalizedDelay().hide);
  }

  function calculatePosition() {
    if (!triggerElement || !tooltipElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;
    let finalPlacement = placement;

    // Calculate preferred position
    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      case 'auto': {
        // Smart placement - find the best position
        const positions = [
          { 
            placement: 'top', 
            top: triggerRect.top - tooltipRect.height - 8,
            left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          },
          { 
            placement: 'bottom', 
            top: triggerRect.bottom + 8,
            left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
          },
          { 
            placement: 'left', 
            top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
            left: triggerRect.left - tooltipRect.width - 8
          },
          { 
            placement: 'right', 
            top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
            left: triggerRect.right + 8
          }
        ];

        // Find position that fits best in viewport
        const bestPosition = positions.find(pos => 
          pos.top >= 0 && 
          pos.top + tooltipRect.height <= viewportHeight &&
          pos.left >= 0 && 
          pos.left + tooltipRect.width <= viewportWidth
        ) || positions[0]; // Fallback to top

        top = bestPosition.top;
        left = bestPosition.left;
        finalPlacement = bestPosition.placement as typeof placement;
        break;
      }
    }

    // Clamp to viewport bounds
    left = Math.max(8, Math.min(left, viewportWidth - tooltipRect.width - 8));
    top = Math.max(8, Math.min(top, viewportHeight - tooltipRect.height - 8));

    // Add scroll offset
    top += scrollY;
    left += scrollX;

    tooltipPosition = { top, left };
    actualPlacement = finalPlacement;
  }

  function handleMouseEnter() {
    if (trigger === 'hover' || trigger === 'click') {
      show();
    }
  }

  function handleMouseLeave() {
    if (trigger === 'hover') {
      hide();
    }
  }

  function handleFocus() {
    if (trigger === 'focus') {
      show();
    }
  }

  function handleBlur() {
    if (trigger === 'focus') {
      hide();
    }
  }

  function handleClick() {
    if (trigger === 'click') {
      if (isVisible) {
        hide();
      } else {
        show();
      }
    }
  }

  function handleTouchStart() {
    // Long press for mobile
    longPressTimeout = setTimeout(() => {
      show();
    }, 500);
  }

  function handleTouchEnd() {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      longPressTimeout = null;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isVisible) {
      hide();
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (trigger === 'click' && isVisible && 
        tooltipElement && !tooltipElement.contains(event.target as Node) &&
        triggerElement && !triggerElement.contains(event.target as Node)) {
      hide();
    }
  }

  // Window resize handler
  function handleResize() {
    if (isVisible) {
      calculatePosition();
    }
  }

  // Effects
  $effect(() => {
    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', calculatePosition);
      
      return () => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', calculatePosition);
      };
    }
  });

  // Cleanup on unmount
  $effect(() => {
    return () => {
      clearTimeouts();
    };
  });

  // Compute tooltip classes
  const tooltipClass = $derived(() => {
    const classes = [
      'gr-tooltip',
      `gr-tooltip--${actualPlacement}`,
      isVisible && 'gr-tooltip--visible',
      className
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  // Generate unique ID for accessibility
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="gr-tooltip-container">
  <svelte:element
    this={trigger === 'click' ? 'button' : 'div'}
    type={trigger === 'click' ? 'button' : undefined}
    bind:this={triggerElement}
    class="gr-tooltip-trigger"
    aria-describedby={isVisible ? tooltipId : undefined}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onfocusin={handleFocus}
    onfocusout={handleBlur}
    onclick={handleClick}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
    onkeydown={handleKeydown}
    role={trigger === 'click' ? 'button' : 'presentation'}
  >
    {@render children()}
  </svelte:element>

  {#if isVisible}
    <div
      bind:this={tooltipElement}
      class={tooltipClass()}
      id={tooltipId}
      role="tooltip"
      style="position: absolute; top: {tooltipPosition.top}px; left: {tooltipPosition.left}px; z-index: 9999;"
      {...restProps}
    >
      <div class="gr-tooltip__content">
        {content}
      </div>
      <div class="gr-tooltip__arrow" aria-hidden="true"></div>
    </div>
  {/if}
</div>

<style>
  :global {
    .gr-tooltip-container {
      position: relative;
      display: inline-block;
    }

    .gr-tooltip-trigger {
      display: contents;
    }

    .gr-tooltip {
      position: absolute;
      padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
      background-color: var(--gr-color-gray-900);
      color: var(--gr-color-base-white);
      font-family: var(--gr-typography-fontFamily-sans);
      font-size: var(--gr-typography-fontSize-sm);
      line-height: var(--gr-typography-lineHeight-tight);
      border-radius: var(--gr-radii-md);
      box-shadow: var(--gr-shadow-lg);
      opacity: 0;
      transform: scale(0.95);
      transition-property: opacity, transform;
      transition-duration: var(--gr-motion-duration-fast);
      transition-timing-function: var(--gr-motion-easing-out);
      max-width: 20rem;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .gr-tooltip--visible {
      opacity: 1;
      transform: scale(1);
    }

    .gr-tooltip__content {
      position: relative;
    }

    .gr-tooltip__arrow {
      position: absolute;
      width: 0;
      height: 0;
      border: 4px solid transparent;
    }

    /* Arrow positioning for each placement */
    .gr-tooltip--top .gr-tooltip__arrow {
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: var(--gr-color-gray-900);
    }

    .gr-tooltip--bottom .gr-tooltip__arrow {
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: var(--gr-color-gray-900);
    }

    .gr-tooltip--left .gr-tooltip__arrow {
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: var(--gr-color-gray-900);
    }

    .gr-tooltip--right .gr-tooltip__arrow {
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: var(--gr-color-gray-900);
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .gr-tooltip {
        transition-duration: 0ms;
        transform: none;
      }

      .gr-tooltip--visible {
        transform: none;
      }
    }

    /* Dark mode - invert colors */
    @media (prefers-color-scheme: dark) {
      .gr-tooltip {
        background-color: var(--gr-color-base-white);
        color: var(--gr-color-gray-900);
      }

      .gr-tooltip--top .gr-tooltip__arrow {
        border-top-color: var(--gr-color-base-white);
      }

      .gr-tooltip--bottom .gr-tooltip__arrow {
        border-bottom-color: var(--gr-color-base-white);
      }

      .gr-tooltip--left .gr-tooltip__arrow {
        border-left-color: var(--gr-color-base-white);
      }

      .gr-tooltip--right .gr-tooltip__arrow {
        border-right-color: var(--gr-color-base-white);
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .gr-tooltip {
        border: 1px solid currentColor;
      }
    }
  }
</style>
