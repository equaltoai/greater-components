<script lang="ts">
  import type { Snippet } from 'svelte';
  import { tick } from 'svelte';
  
  interface Props {
    open?: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
    preventScroll?: boolean;
    class?: string;
    children?: Snippet;
    header?: Snippet;
    footer?: Snippet;
    onClose?: () => void;
    onOpen?: () => void;
  }
  
  let {
    open = $bindable(false),
    title,
    size = 'md',
    closeOnEscape = true,
    closeOnBackdrop = true,
    preventScroll = true,
    class: className = '',
    children,
    header,
    footer,
    onClose,
    onOpen
  }: Props = $props();

  let dialog: HTMLDialogElement | undefined = $state();
  let firstFocusable: HTMLElement | undefined = $state();
  let lastFocusable: HTMLElement | undefined = $state();
  let previousActiveElement: Element | null = null;
  let mounted = $state(false);

  // Generate unique ID for ARIA labelling
  const modalId = $derived(`gr-modal-${Math.random().toString(36).substr(2, 9)}`);
  const titleId = $derived(`${modalId}-title`);

  // Compute modal classes
  const modalClass = $derived(() => {
    const classes = [
      'gr-modal',
      `gr-modal--${size}`,
      className
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  // Watch for open state changes
  $effect(() => {
    if (open && dialog && !dialog.open) {
      openModal();
    } else if (!open && dialog?.open) {
      closeModal();
    }
  });

  // Handle body scroll lock
  $effect(() => {
    if (preventScroll && open && mounted) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  });

  // Mount effect
  $effect(() => {
    mounted = true;
  });

  function openModal() {
    if (!dialog) return;

    previousActiveElement = document.activeElement;
    dialog.showModal();
    
    // Set up focus trap
    setupFocusTrap();
    
    // Focus first focusable element or the dialog itself
    tick().then(() => {
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        dialog?.focus();
      }
    });

    onOpen?.();
  }

  function closeModal() {
    if (!dialog) return;

    dialog.close();
    
    // Restore focus to previously active element
    if (previousActiveElement && 'focus' in previousActiveElement) {
      (previousActiveElement as HTMLElement).focus();
    }

    onClose?.();
  }

  function setupFocusTrap() {
    if (!dialog) return;

    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const focusableArray = Array.from(focusableElements).filter(
      el => !(el as HTMLElement).disabled && (el as HTMLElement).tabIndex >= 0
    ) as HTMLElement[];

    firstFocusable = focusableArray[0];
    lastFocusable = focusableArray[focusableArray.length - 1];
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && closeOnEscape) {
      event.preventDefault();
      open = false;
    }

    if (event.key === 'Tab') {
      // Trap focus within modal
      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (closeOnBackdrop && event.target === dialog) {
      open = false;
    }
  }

  function handleClose() {
    open = false;
  }
</script>

{#if mounted}
  <dialog
    bind:this={dialog}
    class={modalClass()}
    aria-modal="true"
    aria-labelledby={title ? titleId : undefined}
    onkeydown={handleKeydown}
    onclick={handleBackdropClick}
    onclose={handleClose}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="gr-modal__content" onclick={(e) => e.stopPropagation()}>
      {#if header || title}
        <header class="gr-modal__header">
          {#if header}
            {@render header()}
          {:else if title}
            <h2 id={titleId} class="gr-modal__title">{title}</h2>
          {/if}
          
          <button
            type="button"
            class="gr-modal__close"
            aria-label="Close modal"
            onclick={() => open = false}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
      {/if}

      <main class="gr-modal__body">
        {#if children}
          {@render children()}
        {/if}
      </main>

      {#if footer}
        <footer class="gr-modal__footer">
          {@render footer()}
        </footer>
      {/if}
    </div>
  </dialog>
{/if}

<style>
  .gr-modal {
    padding: 0;
    border: none;
    border-radius: var(--gr-radii-lg);
    box-shadow: var(--gr-shadows-2xl);
    background: transparent;
    max-height: calc(100vh - 2rem);
    max-width: calc(100vw - 2rem);
    margin: auto;
    font-family: var(--gr-typography-fontFamily-sans);
  }

  .gr-modal::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  .gr-modal__content {
    background-color: var(--gr-semantic-background-primary);
    border-radius: var(--gr-radii-lg);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* Size variants */
  .gr-modal--sm {
    width: 20rem;
  }

  .gr-modal--md {
    width: 28rem;
  }

  .gr-modal--lg {
    width: 40rem;
  }

  .gr-modal--xl {
    width: 56rem;
  }

  .gr-modal--full {
    width: calc(100vw - 2rem);
    height: calc(100vh - 2rem);
  }

  .gr-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gr-spacing-scale-6) var(--gr-spacing-scale-6) var(--gr-spacing-scale-4);
    border-bottom: 1px solid var(--gr-semantic-border-default);
    flex-shrink: 0;
  }

  .gr-modal__title {
    margin: 0;
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
    color: var(--gr-semantic-foreground-primary);
    line-height: var(--gr-typography-lineHeight-tight);
  }

  .gr-modal__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: var(--gr-radii-base);
    background-color: transparent;
    color: var(--gr-semantic-foreground-secondary);
    cursor: pointer;
    transition: background-color var(--gr-motion-duration-fast) var(--gr-motion-easing-out),
                color var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }

  .gr-modal__close:hover {
    background-color: var(--gr-semantic-background-secondary);
    color: var(--gr-semantic-foreground-primary);
  }

  .gr-modal__close:focus {
    outline: none;
  }

  .gr-modal__close:focus-visible {
    box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
  }

  .gr-modal__body {
    flex: 1;
    padding: var(--gr-spacing-scale-6);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .gr-modal__footer {
    padding: var(--gr-spacing-scale-4) var(--gr-spacing-scale-6) var(--gr-spacing-scale-6);
    border-top: 1px solid var(--gr-semantic-border-default);
    flex-shrink: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .gr-modal--sm,
    .gr-modal--md,
    .gr-modal--lg,
    .gr-modal--xl {
      width: calc(100vw - 2rem);
      max-height: calc(100vh - 2rem);
    }

    .gr-modal__header {
      padding: var(--gr-spacing-scale-4);
    }

    .gr-modal__body {
      padding: var(--gr-spacing-scale-4);
    }

    .gr-modal__footer {
      padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4) var(--gr-spacing-scale-4);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .gr-modal__close {
      transition: none;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .gr-modal::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
</style>