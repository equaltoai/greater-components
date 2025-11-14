<script lang="ts">
  import Button from '../../src/components/Button.svelte';
  import type ButtonComponent from '../../src/components/Button.svelte';
  import type { ComponentProps } from 'svelte';

  const {
    props = {} as ComponentProps<typeof ButtonComponent>,
    label = 'Action'
  } = $props<{ props?: ComponentProps<typeof ButtonComponent>; label?: string }>();
</script>

<Button {...props}>
  {#snippet children()}
    {label}
  {/snippet}
</Button>
