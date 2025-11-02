<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  
  interface Props extends HTMLAttributes<SVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    class?: string;
  }
  
  let { 
    size = 24, 
    color = 'currentColor', 
    strokeWidth = 2,
    class: className = '',
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
    ...restProps
  }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="gr-icon gr-icon-pocket {className}"
  aria-hidden="true"
  {id}
  {style}
  {onclick}
  {onmouseenter}
  {onmouseleave}
  {onfocus}
  {onblur}
  {onkeydown}
  {onkeyup}
  {role}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  aria-describedby={ariaDescribedby}
  {...restProps}
>
  <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline>
</svg>