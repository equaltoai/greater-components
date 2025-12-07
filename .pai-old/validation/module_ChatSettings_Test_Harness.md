# Module: ChatSettings Test Harness

## Type: creation

## Files:
[packages/shared/chat/tests/harness/ChatSettingsHarness.svelte]

## File Changes:
- packages/shared/chat/tests/harness/ChatSettingsHarness.svelte: BEFORE: DOES NOT EXIST | AFTER: <<<
<script lang="ts">
  import Settings from '../../src/ChatSettings.svelte';
  import type { ChatSettingsState, KnowledgeBaseConfig } from '../../src/types.js';

  interface Props {
    open?: boolean;
    settings: ChatSettingsState;
    availableModels?: Array<{ id: string; name: string }>;
    availableKnowledgeBases?: KnowledgeBaseConfig[];
    onSettingsChange?: (settings: ChatSettingsState) => void;
    onChange?: (settings: ChatSettingsState) => void;
    onSave?: (settings: ChatSettingsState) => void;
    onClose?: () => void;
    class?: string;
  }

  let {
    open = $bindable(false),
    settings,
    availableModels,
    availableKnowledgeBases = [],
    onSettingsChange,
    onChange,
    onSave,
    onClose,
    class: className = '',
  }: Props = $props();
</script>

<Settings
  bind:open
  {settings}
  {availableModels}
  {availableKnowledgeBases}
  {onSettingsChange}
  {onChange}
  {onSave}
  {onClose}
  class={className}
/>
>>> | TYPE: content creation | DESC: Creates test harness for ChatSettings component
