# Module: ChatSuggestions Component Implementation

## Type: creation

## Files:
[packages/shared/chat/src/ChatSuggestions.svelte]

## File Changes:
- packages/shared/chat/src/ChatSuggestions.svelte: BEFORE: DOES NOT EXIST | AFTER: <<<
<!--
  ChatSuggestions - Quick Prompt Suggestions Component
  
  Displays clickable prompt suggestions in empty state or after responses.
  Supports pills (default) and cards variants with full keyboard navigation.
  
  @component
  @example
  ```svelte
  <Chat.Container {handlers}>
    <Chat.Messages />
    <Chat.Suggestions
      suggestions={["What is PAI?", "How do I create a scope?"]}
      onSelect={(suggestion) => handleSelect(suggestion)}
    />
    <Chat.Input />
  </Chat.Container>
  ```
-->
<script lang="ts">
  /**
   * Suggestion item with optional description for cards variant
   */
  interface SuggestionItem {
    /** Display text */
    text: string;
    /** Optional description (only shown in cards variant) */
    description?: string;
  }

  /**
   * ChatSuggestions component props
   */
  interface Props {
    /**
     * Array of suggestion texts or objects with text and description
     */
    suggestions: (string | SuggestionItem)[];

    /**
     * Callback when a suggestion is clicked
     */
    onSelect: (suggestion: string) => void;

    /**
     * Visual variant
     * - `pills`: Horizontal row of pill-shaped buttons (default)
     * - `cards`: Larger cards in grid layout
     * @default 'pills'
     */
    variant?: 'pills' | 'cards';

    /**
     * Custom CSS class
     */
    class?: string;
  }

  let {
    suggestions,
    onSelect,
    variant = 'pills',
    class: className = '',
  }: Props = $props();

  /**
   * Normalize suggestion to object format
   */
  function normalizeSuggestion(suggestion: string | SuggestionItem): SuggestionItem {
    if (typeof suggestion === 'string') {
      return { text: suggestion };
    }
    return suggestion;
  }

  /**
   * Handle suggestion click
   */
  function handleClick(suggestion: SuggestionItem) {
    onSelect(suggestion.text);
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(event: KeyboardEvent, suggestion: SuggestionItem) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(suggestion.text);
    }
  }

  // Compute container classes
  const containerClass = $derived.by(() => {
    const classes = [
      'chat-suggestions',
      `chat-suggestions--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return classes;
  });
</script>

<div
  class={containerClass}
  role="group"
  aria-label="Suggested prompts"
>
  {#each suggestions as suggestion, index}
    {@const item = normalizeSuggestion(suggestion)}
    <button
      type="button"
      class="chat-suggestions__item"
      onclick={() => handleClick(item)}
      onkeydown={(e) => handleKeyDown(e, item)}
      tabindex={0}
      aria-label={`Suggestion: ${item.text}`}
    >
      <span class="chat-suggestions__text">{item.text}</span>
      {#if variant === 'cards' && item.description}
        <span class="chat-suggestions__description">{item.description}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  /* Base container styles */
  .chat-suggestions {
    display: flex;
    gap: var(--gr-spacing-scale-2, 0.5rem);
    padding: var(--gr-spacing-scale-3, 0.75rem) var(--gr-spacing-scale-4, 1rem);
  }

  /* Pills variant - horizontal row with wrapping */
  .chat-suggestions--pills {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  /* Pills variant mobile - horizontal scroll */
  @media (max-width: 640px) {
    .chat-suggestions--pills {
      flex-wrap: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE/Edge */
      padding-bottom: var(--gr-spacing-scale-2, 0.5rem);
    }

    .chat-suggestions--pills::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
  }

  /* Cards variant - grid layout */
  .chat-suggestions--cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gr-spacing-scale-3, 0.75rem);
  }

  @media (max-width: 640px) {
    .chat-suggestions--cards {
      grid-template-columns: 1fr;
    }
  }

  /* Base item styles */
  .chat-suggestions__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: none;
    cursor: pointer;
    font-family: var(--gr-typography-fontFamily-sans, system-ui, sans-serif);
    font-size: var(--gr-typography-fontSize-sm, 0.875rem);
    line-height: 1.5;
    text-align: left;
    transition: all 0.15s ease-in-out;
    background-color: var(--gr-semantic-background-secondary, #f3f4f6);
    color: var(--gr-semantic-foreground-primary, #111827);
  }

  .chat-suggestions__item:focus {
    outline: 2px solid var(--gr-color-primary-500, #3b82f6);
    outline-offset: 2px;
  }

  .chat-suggestions__item:focus-visible {
    outline: 2px solid var(--gr-color-primary-500, #3b82f6);
    outline-offset: 2px;
  }

  /* Pills variant item styles */
  .chat-suggestions--pills .chat-suggestions__item {
    flex-direction: row;
    padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-3, 0.75rem);
    border-radius: var(--gr-radii-full, 9999px);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .chat-suggestions--pills .chat-suggestions__item:hover {
    background-color: var(--gr-color-primary-50, #eff6ff);
    color: var(--gr-color-primary-700, #1d4ed8);
  }

  .chat-suggestions--pills .chat-suggestions__item:active {
    background-color: var(--gr-color-primary-100, #dbeafe);
    transform: scale(0.98);
  }

  /* Cards variant item styles */
  .chat-suggestions--cards .chat-suggestions__item {
    padding: var(--gr-spacing-scale-4, 1rem);
    border-radius: var(--gr-radii-lg, 0.5rem);
    border: 1px solid var(--gr-color-gray-200, #e5e7eb);
    gap: var(--gr-spacing-scale-1, 0.25rem);
  }

  .chat-suggestions--cards .chat-suggestions__item:hover {
    background-color: var(--gr-color-primary-50, #eff6ff);
    border-color: var(--gr-color-primary-300, #93c5fd);
    box-shadow: var(--gr-shadows-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
    transform: translateY(-1px);
  }

  .chat-suggestions--cards .chat-suggestions__item:active {
    background-color: var(--gr-color-primary-100, #dbeafe);
    transform: translateY(0);
  }

  /* Text styles */
  .chat-suggestions__text {
    font-weight: 500;
  }

  .chat-suggestions__description {
    font-size: var(--gr-typography-fontSize-xs, 0.75rem);
    color: var(--gr-color-gray-500, #6b7280);
    font-weight: 400;
  }

  /* Dark mode support */
  :global([data-theme='dark']) .chat-suggestions__item {
    background-color: var(--gr-color-gray-800, #1f2937);
    color: var(--gr-color-gray-100, #f3f4f6);
  }

  :global([data-theme='dark']) .chat-suggestions--pills .chat-suggestions__item:hover {
    background-color: var(--gr-color-primary-900, #1e3a8a);
    color: var(--gr-color-primary-100, #dbeafe);
  }

  :global([data-theme='dark']) .chat-suggestions--cards .chat-suggestions__item {
    border-color: var(--gr-color-gray-700, #374151);
  }

  :global([data-theme='dark']) .chat-suggestions--cards .chat-suggestions__item:hover {
    background-color: var(--gr-color-primary-900, #1e3a8a);
    border-color: var(--gr-color-primary-700, #1d4ed8);
    color: var(--gr-color-primary-100, #dbeafe);
  }

  :global([data-theme='dark']) .chat-suggestions__description {
    color: var(--gr-color-gray-400, #9ca3af);
  }
</style>
>>> | TYPE: content creation | DESC: Create the ChatSuggestions Svelte component with pills and cards variants, keyboard navigation, accessibility support, and dark mode styling
