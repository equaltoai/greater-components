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
  class="gr-icon gr-icon-unfollow {className}"
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
  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/>
</svg>