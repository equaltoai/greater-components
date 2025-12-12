<script>
  import Root from '../../../src/components/Timeline/Root.svelte';
  import Item from '../../../src/components/Timeline/Item.svelte';
  let { items, handlers, config } = $props();
</script>

<Root {items} {handlers} {config}>
  {#each items as item, index}
    <Item {item} {index}>
       <p>{item.id}</p>
    </Item>
  {/each}
</Root>
