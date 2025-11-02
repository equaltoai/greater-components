<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
    class?: string;
    loading?: boolean;
    children?: Snippet;
  }

  let {
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    class: className = '',
    loading = true,
    children,
    id,
    style: styleProp,
    onclick,
    onmouseenter,
    onmouseleave,
    onfocus,
    onblur,
    onkeydown,
    onkeyup,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    tabindex
  }: Props = $props();

  // Compute skeleton classes
  const skeletonClass = $derived(() => {
    const classes = [
      'gr-skeleton',
      `gr-skeleton--${variant}`,
      animation !== 'none' && `gr-skeleton--${animation}`,
      className
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  // Compute skeleton styles
  const skeletonStyle = $derived(() => {
    const styles: Record<string, string> = {};
    
    if (width !== undefined) {
      styles.width = typeof width === 'number' ? `${width}px` : width;
    }
    
    if (height !== undefined) {
      styles.height = typeof height === 'number' ? `${height}px` : height;
    }

    // Default dimensions for different variants
    if (variant === 'text') {
      if (!height) styles.height = '1em';
      if (!width) styles.width = '100%';
    } else if (variant === 'circular') {
      const size = width || height || '40px';
      styles.width = typeof size === 'number' ? `${size}px` : size;
      styles.height = typeof size === 'number' ? `${size}px` : size;
    } else if (variant === 'rectangular' || variant === 'rounded') {
      if (!width) styles.width = '100%';
      if (!height) styles.height = '120px';
    }

    // Merge with provided style prop
    const baseStyle = Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    
    return styleProp ? `${baseStyle}; ${styleProp}` : baseStyle;
  });
</script>

{#if loading}
  <div
    class={skeletonClass()}
    style={skeletonStyle()}
    aria-hidden="true"
    role={role ?? "status"}
    aria-label={ariaLabel ?? "Loading"}
    aria-labelledby={ariaLabelledby}
    aria-describedby={ariaDescribedby}
    {id}
    {onclick}
    {onmouseenter}
    {onmouseleave}
    {onfocus}
    {onblur}
    {onkeydown}
    {onkeyup}
    tabindex={tabindex !== undefined ? tabindex : null}
  >
    {#if animation === 'wave'}
      <div class="gr-skeleton__wave"></div>
    {/if}
  </div>
{:else if children}
  {@render children()}
{/if}

<style>
  :global {
    .gr-skeleton {
      display: block;
      background-color: var(--gr-semantic-background-tertiary);
      position: relative;
      overflow: hidden;
    }

    /* Variant styles */
    .gr-skeleton--text {
      border-radius: var(--gr-radii-sm);
      transform: scale(1, 0.8);
      transform-origin: 0 50%;
    }

    .gr-skeleton--circular {
      border-radius: 50%;
    }

    .gr-skeleton--rectangular {
      border-radius: 0;
    }

    .gr-skeleton--rounded {
      border-radius: var(--gr-radii-md);
    }

    /* Animation styles */
    .gr-skeleton--pulse {
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    .gr-skeleton--wave {
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    .gr-skeleton--wave::before {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: skeleton-wave 1.5s ease-in-out infinite;
    }

    .gr-skeleton__wave {
      position: absolute;
      top: 0;
      left: -150%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      animation: skeleton-wave 1.5s ease-in-out infinite;
    }

    @keyframes skeleton-pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes skeleton-wave {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .gr-skeleton--pulse,
      .gr-skeleton--wave {
        animation: none;
      }

      .gr-skeleton--wave::before,
      .gr-skeleton__wave {
        animation: none;
        display: none;
      }

      /* Provide subtle visual indication without animation */
      .gr-skeleton {
        opacity: 0.7;
        background: linear-gradient(
          90deg,
          var(--gr-semantic-background-tertiary),
          var(--gr-semantic-background-secondary),
          var(--gr-semantic-background-tertiary)
        );
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .gr-skeleton {
        background-color: var(--gr-semantic-border-strong);
        border: 1px solid currentColor;
      }
    }

    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .gr-skeleton--wave::before,
      .gr-skeleton__wave {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
      }

      @media (prefers-reduced-motion: reduce) {
        .gr-skeleton {
          background: linear-gradient(
            90deg,
            var(--gr-semantic-background-tertiary),
            var(--gr-semantic-background-secondary),
            var(--gr-semantic-background-tertiary)
          );
        }
      }
    }

    /* Focus styles for accessibility */
    .gr-skeleton:focus-visible {
      outline: 2px solid var(--gr-semantic-focus-ring);
      outline-offset: 2px;
    }
  }
</style>
