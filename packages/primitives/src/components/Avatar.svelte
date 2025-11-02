<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    shape?: 'circle' | 'square' | 'rounded';
    loading?: boolean;
    status?: 'online' | 'offline' | 'busy' | 'away';
    statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    class?: string;
    fallback?: Snippet;
  }

  let {
    src,
    alt,
    name = '',
    size = 'md',
    shape = 'circle',
    loading = false,
    status,
    statusPosition = 'bottom-right',
    class: className = '',
    fallback,
    id,
    style,
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

  // State management
  let imageLoaded = $state(false);
  let imageError = $state(false);
  let imageElement: HTMLImageElement | null = $state(null);

  // Compute avatar classes
  const avatarClass = $derived(() => {
    const classes = [
      'gr-avatar',
      `gr-avatar--${size}`,
      `gr-avatar--${shape}`,
      loading && 'gr-avatar--loading',
      status && 'gr-avatar--has-status',
      className
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  // Compute status classes
  const statusClass = $derived(() => {
    if (!status) return '';
    
    const classes = [
      'gr-avatar__status',
      `gr-avatar__status--${status}`,
      `gr-avatar__status--${statusPosition}`
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  // Generate initials from name
  const initials = $derived(() => {
    if (!name) return '';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      // Single word - take first two characters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words - take first character of first two words
      return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
    }
  });

  // Generate background color from name
  const initialsBackgroundColor = $derived(() => {
    if (!name) return 'var(--gr-semantic-background-secondary)';
    
    // Simple hash function to generate consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to HSL for better color distribution
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  });

  function handleImageLoad() {
    imageLoaded = true;
    imageError = false;
  }

  function handleImageError() {
    imageLoaded = false;
    imageError = true;
  }

  // Reset image state when src changes
  $effect(() => {
    if (src) {
      imageLoaded = false;
      imageError = false;
    }
  });

  // Compute accessible name
  const accessibleName = $derived(() => {
    if (alt) return alt;
    if (name) return name;
    return 'Avatar';
  });

  // Generate unique ID for status
  const statusId = `avatar-status-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div
  class={avatarClass()}
  role={role ?? "img"}
  aria-label={ariaLabel ?? accessibleName()}
  aria-labelledby={ariaLabelledby}
  aria-describedby={ariaDescribedby ?? (status ? statusId : undefined)}
  {id}
  {style}
  {onclick}
  {onmouseenter}
  {onmouseleave}
  {onfocus}
  {onblur}
  {onkeydown}
  {onkeyup}
  tabindex={tabindex !== undefined ? tabindex : null}
>
  {#if loading}
    <div class="gr-avatar__loading" aria-hidden="true">
      <svg
        class="gr-avatar__spinner"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
    </div>
  {:else if src && !imageError}
    <img
      bind:this={imageElement}
      class="gr-avatar__image"
      {src}
      alt={alt || name || 'Avatar'}
      onload={handleImageLoad}
      onerror={handleImageError}
      style="display: {imageLoaded ? 'block' : 'none'}"
    />
    
    {#if !imageLoaded}
      <div class="gr-avatar__placeholder" aria-hidden="true">
        {#if initials}
          <span 
            class="gr-avatar__initials"
            style="background-color: {initialsBackgroundColor()}"
          >
            {initials}
          </span>
        {:else if fallback}
          {@render fallback()}
        {:else}
          <svg
            class="gr-avatar__fallback-icon"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        {/if}
      </div>
    {/if}
  {:else}
    <!-- No image src or image failed to load -->
    <div class="gr-avatar__placeholder" aria-hidden="true">
      {#if initials}
        <span 
          class="gr-avatar__initials"
          style="background-color: {initialsBackgroundColor()}; color: white;"
        >
          {initials}
        </span>
      {:else if fallback}
        {@render fallback()}
      {:else}
        <svg
          class="gr-avatar__fallback-icon"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      {/if}
    </div>
  {/if}

  {#if status}
    <div
      class={statusClass()}
      id={statusId}
      role="status"
      aria-label={`Status: ${status}`}
    ></div>
  {/if}
</div>

<style>
  :global {
    .gr-avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--gr-semantic-background-secondary);
      color: var(--gr-semantic-foreground-secondary);
      font-family: var(--gr-typography-fontFamily-sans);
      font-weight: var(--gr-typography-fontWeight-medium);
      overflow: hidden;
      flex-shrink: 0;
      user-select: none;
    }

    /* Shapes */
    .gr-avatar--circle {
      border-radius: 50%;
    }

    .gr-avatar--square {
      border-radius: 0;
    }

    .gr-avatar--rounded {
      border-radius: var(--gr-radii-md);
    }

    /* Sizes */
    .gr-avatar--xs {
      width: 1.5rem;
      height: 1.5rem;
      font-size: var(--gr-typography-fontSize-xs);
    }

    .gr-avatar--sm {
      width: 2rem;
      height: 2rem;
      font-size: var(--gr-typography-fontSize-sm);
    }

    .gr-avatar--md {
      width: 2.5rem;
      height: 2.5rem;
      font-size: var(--gr-typography-fontSize-sm);
    }

    .gr-avatar--lg {
      width: 3rem;
      height: 3rem;
      font-size: var(--gr-typography-fontSize-base);
    }

    .gr-avatar--xl {
      width: 4rem;
      height: 4rem;
      font-size: var(--gr-typography-fontSize-lg);
    }

    .gr-avatar--2xl {
      width: 5rem;
      height: 5rem;
      font-size: var(--gr-typography-fontSize-xl);
    }

    .gr-avatar__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .gr-avatar__placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .gr-avatar__initials {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-weight: var(--gr-typography-fontWeight-semibold);
      line-height: 1;
    }

    .gr-avatar__fallback-icon {
      width: 70%;
      height: 70%;
      opacity: 0.6;
    }

    .gr-avatar__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: var(--gr-semantic-background-tertiary);
    }

    .gr-avatar__spinner {
      animation: spin 1s linear infinite;
      color: var(--gr-semantic-foreground-tertiary);
    }

    /* Status badge */
    .gr-avatar__status {
      position: absolute;
      width: 25%;
      height: 25%;
      min-width: 8px;
      min-height: 8px;
      border-radius: 50%;
      border: 2px solid var(--gr-semantic-background-primary);
    }

    /* Status positions */
    .gr-avatar__status--top-right {
      top: 0;
      right: 0;
      transform: translate(25%, -25%);
    }

    .gr-avatar__status--top-left {
      top: 0;
      left: 0;
      transform: translate(-25%, -25%);
    }

    .gr-avatar__status--bottom-right {
      bottom: 0;
      right: 0;
      transform: translate(25%, 25%);
    }

    .gr-avatar__status--bottom-left {
      bottom: 0;
      left: 0;
      transform: translate(-25%, 25%);
    }

    /* Status colors */
    .gr-avatar__status--online {
      background-color: #10b981; /* green-500 */
    }

    .gr-avatar__status--offline {
      background-color: #6b7280; /* gray-500 */
    }

    .gr-avatar__status--busy {
      background-color: #ef4444; /* red-500 */
    }

    .gr-avatar__status--away {
      background-color: #f59e0b; /* amber-500 */
    }

    /* Loading state */
    .gr-avatar--loading {
      pointer-events: none;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .gr-avatar__spinner {
        animation: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .gr-avatar {
        border: 1px solid currentColor;
      }

      .gr-avatar__status {
        border-width: 1px;
        border-color: currentColor;
      }
    }

    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .gr-avatar__status {
        border-color: var(--gr-semantic-background-primary);
      }
    }
  }
</style>
