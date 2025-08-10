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
    tabindex,
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
  class="gr-icon gr-icon-map-pin {className}"
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
  tabindex={tabindex !== undefined ? tabindex : null}
  {...restProps}
>
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
</svg>