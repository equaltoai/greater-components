<script lang="ts">
	import { createDiscoveryContext } from '../../../src/components/Discovery/context.js';
	import { DiscoveryEngine } from '../../../src/components/Discovery/index.js';
	import type { DiscoveryStore } from '../../../src/stores/types.js';
	import type { ArtworkData } from '../../../src/types/artwork.js';

	interface Props {
		store: DiscoveryStore;
		onResultClick?: (artwork: ArtworkData) => void;
	}

	let { store, onResultClick }: Props = $props();

	// Create context with reactive getters
	createDiscoveryContext(
		() => store,
		{},
		{
			onResultClick: (artwork) => onResultClick?.(artwork),
		}
	);
</script>

<DiscoveryEngine.SearchBar />
<DiscoveryEngine.Results />
