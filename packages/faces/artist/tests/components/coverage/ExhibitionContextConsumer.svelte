<script lang="ts">
  import {
    getExhibitionContext,
    navigateNext,
    navigatePrevious,
    navigateTo,
    formatExhibitionDates
  } from '../../../src/components/Exhibition/context';

  const ctx = getExhibitionContext();

  function handleNext() {
    navigateNext(ctx);
  }

  function handlePrev() {
    navigatePrevious(ctx);
  }

  function handleJump(index: number) {
    navigateTo(ctx, index);
  }

  const dateString = formatExhibitionDates(ctx.exhibition);
</script>

<div data-testid="exhibition-context-consumer">
  <div data-testid="current-index">{ctx.navigation.currentIndex}</div>
  <div data-testid="total-artworks">{ctx.navigation.totalArtworks}</div>
  <div data-testid="is-at-start">{ctx.navigation.isAtStart}</div>
  <div data-testid="is-at-end">{ctx.navigation.isAtEnd}</div>
  <div data-testid="date-string">{dateString}</div>

  <button onclick={handleNext}>Next</button>
  <button onclick={handlePrev}>Prev</button>
  <button onclick={() => handleJump(1)}>Jump 1</button>
</div>
