<script lang="ts">
  import { createDiscoveryContext } from '../../../src/components/Discovery/context.ts';
  import { DiscoveryEngine } from '../../../src/components/Discovery/index.ts';
  import type { DiscoveryStore } from '../../../src/stores/types.js';
  import type { ArtworkData } from '../../../src/types/artwork.js';

  interface Props {
    store: DiscoveryStore;
    onResultClick?: (artwork: ArtworkData) => void;
  }

  let { store, onResultClick }: Props = $props();

  createDiscoveryContext(store, {}, {
      onResultClick: onResultClick
  });
</script>

<DiscoveryEngine.SearchBar />
<DiscoveryEngine.Results />
