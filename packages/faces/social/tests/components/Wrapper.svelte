<script>
  let { Component, props, Wrapper, wrapperProps } = $props();
</script>

{#if Wrapper}
  <Wrapper {...wrapperProps}>
    <Component {...props} />
  </Wrapper>
{:else}
  <Component {...props} />
{/if}
