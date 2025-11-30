<script lang="ts">
  import Suggestions from '../../src/ChatSuggestions.svelte';

  interface SuggestionItem {
    text: string;
    description?: string;
  }

  interface Props {
    suggestions: (string | SuggestionItem)[];
    onSelect: (suggestion: string) => void;
    variant?: 'pills' | 'cards';
    class?: string;
  }

  let {
    suggestions,
    onSelect,
    variant = 'pills',
    class: className = '',
  }: Props = $props();
</script>

<Suggestions
  {suggestions}
  {onSelect}
  {variant}
  class={className}
/>