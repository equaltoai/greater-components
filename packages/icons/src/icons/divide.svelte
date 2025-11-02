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
  class="gr-icon gr-icon-divide {className}"
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
  <circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle>
</svg>