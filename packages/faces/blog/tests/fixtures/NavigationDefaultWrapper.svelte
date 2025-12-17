<script lang="ts">
	import { Navigation } from '../../src/components/Navigation/index.js';
	import type { ArchiveEntry, TagData, CategoryData } from '../../src/types.js';

	interface Props {
		archives?: ArchiveEntry[];
		tags?: TagData[];
		categories?: CategoryData[];
		currentPath?: string;
	}

	let { archives = [], tags = [], categories = [], currentPath = '/' }: Props = $props();
</script>

<Navigation.Root {archives} {tags} {categories} {currentPath} />
