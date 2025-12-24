<script lang="ts">
	import { Editor } from '../../src/components/Editor/index.js';
	import type { DraftData, EditorConfig } from '../../src/types.js';

	interface Props {
		draft: DraftData;
		config?: Partial<EditorConfig>;
		onChange?: (draft: DraftData) => void;
		onSave?: (draft: DraftData) => Promise<void> | void;
	}

	let { draft, config = {}, onChange, onSave }: Props = $props();
</script>

<Editor.Root {draft} {config} {onChange} {onSave} />
