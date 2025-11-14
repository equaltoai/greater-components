<script lang="ts">
  import Skeleton from '../../src/components/Skeleton.svelte';
  import type SkeletonComponent from '../../src/components/Skeleton.svelte';
  import type { ComponentProps } from 'svelte';

  const {
    props = {} as ComponentProps<typeof SkeletonComponent>
  } = $props<{ props?: ComponentProps<typeof SkeletonComponent> }>();
</script>

<Skeleton {...props}>
  {#snippet children()}
    <p data-testid="skeleton-children">Loaded content</p>
  {/snippet}
</Skeleton>
