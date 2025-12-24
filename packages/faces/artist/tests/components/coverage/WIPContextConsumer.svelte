<script lang="ts">
  import {
    getWIPContext,
    navigateToNextVersion,
    navigateToPreviousVersion,
    navigateToVersion,
    toggleComparison,
    setComparisonMode,
    formatTimeBetweenVersions,
    type ComparisonMode
  } from '../../../src/components/CreativeTools/WorkInProgress/context';

  const ctx = getWIPContext();

  function handleNext() {
    navigateToNextVersion(ctx);
  }

  function handlePrev() {
    navigateToPreviousVersion(ctx);
  }

  function handleJump(index: number) {
    navigateToVersion(ctx, index);
  }

  function handleToggleCompare() {
    toggleComparison(ctx);
  }

  function handleSetMode(mode: ComparisonMode) {
    setComparisonMode(ctx, mode);
  }
  
  // Test formatTimeBetweenVersions if updates exist
  let timeString = '';
  if (ctx.thread.updates.length >= 2) {
      timeString = formatTimeBetweenVersions(ctx.thread.updates[0]!, ctx.thread.updates[1]!);
  }
</script>

<div data-testid="wip-context-consumer">
  <div data-testid="current-index">{ctx.currentVersionIndex}</div>
  <div data-testid="is-following">{ctx.isFollowing}</div>
  <div data-testid="is-owner">{ctx.isOwner}</div>
  <div data-testid="comparison-active">{ctx.comparison.isActive}</div>
  <div data-testid="comparison-mode">{ctx.comparison.mode}</div>
  <div data-testid="time-string">{timeString}</div>

  <button onclick={handleNext}>Next</button>
  <button onclick={handlePrev}>Prev</button>
  <button onclick={() => handleJump(0)}>Jump 0</button>
  <button onclick={handleToggleCompare}>Toggle Compare</button>
  <button onclick={() => handleSetMode('slider')}>Set Slider</button>
  <button onclick={() => handleSetMode('overlay')}>Set Overlay</button>
</div>
