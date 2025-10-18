<script lang="ts">
  import type { Snippet } from 'svelte';

  /* svelte-ignore custom_element_props_identifier */
  const props = $props<{
    children?: Snippet;
    disabled?: boolean;
    loading?: boolean;
    onclick?: (event: MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    id?: string;
    ['aria-label']?: string;
  }>();

  let {
    children,
    disabled = false,
    loading = false,
    onclick,
    type = 'button',
    class: className = '',
    id,
    ['aria-label']: ariaLabel,
  } = props;

  function handleClick(event: MouseEvent) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onclick?.(event);
  }
</script>

<button
  class={`button-stub ${className}`}
  type={type}
  aria-label={ariaLabel}
  aria-disabled={disabled || loading}
  disabled={disabled || loading}
  onclick={handleClick}
  id={id}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .button-stub {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .button-stub[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
