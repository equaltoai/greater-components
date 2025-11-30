<!--
  ChatSettings - Chat Configuration Modal Component
  
  Provides a settings panel for configuring chat behavior including
  model selection, temperature, max tokens, and knowledge base toggles.
  
  @component
  @example
  ```svelte
  <Chat.Container {handlers}>
    <Chat.Header 
      showSettingsButton={true}
      onSettings={() => settingsOpen = true}
    />
    <Chat.Messages />
    <Chat.Input />
  </Chat.Container>
  
  <Chat.Settings
    bind:open={settingsOpen}
    settings={chatSettings}
    onSettingsChange={(s) => chatSettings = s}
    availableModels={[
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ]}
  />
  ```
-->
<script lang="ts">
  import { Modal, Select, TextField, Switch, Button, Text } from '@equaltoai/greater-components-primitives';
  import type { ChatSettingsState, KnowledgeBaseConfig } from './types.js';

  /**
   * Default model options if none provided
   */
  const DEFAULT_MODELS = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'claude-3', name: 'Claude 3' },
  ];

  /**
   * ChatSettings component props
   */
  interface Props {
    /**
     * Whether the settings modal is open (bindable)
     * @default false
     */
    open?: boolean;

    /**
     * Current settings state
     */
    settings: ChatSettingsState;

    /**
     * Available models for selection
     */
    availableModels?: Array<{ id: string; name: string }>;

    /**
     * Available knowledge bases for selection
     */
    availableKnowledgeBases?: KnowledgeBaseConfig[];

    /**
     * Called when settings change (immediate updates)
     */
    onSettingsChange?: (settings: ChatSettingsState) => void;

    /**
     * Called when settings change (legacy alias)
     */
    onChange?: (settings: ChatSettingsState) => void;

    /**
     * Called when settings are saved
     */
    onSave?: (settings: ChatSettingsState) => void;

    /**
     * Called when settings panel is closed
     */
    onClose?: () => void;

    /**
     * Custom CSS class
     */
    class?: string;
  }

  let {
    open = $bindable(false),
    settings,
    availableModels = DEFAULT_MODELS,
    availableKnowledgeBases = [],
    onSettingsChange,
    onChange,
    onSave,
    onClose,
    class: className = '',
  }: Props = $props();

  // Local state for form values (allows cancel to revert)
  let localSettings = $state<ChatSettingsState>({ ...settings });

  // Sync local settings when external settings change
  $effect(() => {
    localSettings = { ...settings };
  });

  // Convert models to Select options format (label/value per documentation)
  const modelOptions = $derived(
    availableModels.map((m) => ({
      label: m.name,
      value: m.id,
    }))
  );

  // Current temperature display value
  const temperatureDisplay = $derived(
    localSettings.temperature?.toFixed(1) ?? '0.7'
  );

  // Check if a knowledge base is enabled
  function isKnowledgeBaseEnabled(kbId: string): boolean {
    return localSettings.knowledgeBases?.includes(kbId) ?? false;
  }

  /**
   * Handle model selection change
   */
  function handleModelChange(value: string) {
    localSettings = { ...localSettings, model: value };
    notifyChange();
  }

  /**
   * Handle temperature slider change
   */
  function handleTemperatureChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    localSettings = { ...localSettings, temperature: value };
    notifyChange();
  }

  /**
   * Handle max tokens input change
   */
  function handleMaxTokensChange(value: string) {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      localSettings = { ...localSettings, maxTokens: numValue };
      notifyChange();
    }
  }

  /**
   * Handle knowledge base toggle
   */
  function handleKnowledgeBaseToggle(kbId: string, enabled: boolean) {
    const currentKbs = localSettings.knowledgeBases ?? [];
    let newKbs: string[];
    
    if (enabled) {
      newKbs = [...currentKbs, kbId];
    } else {
      newKbs = currentKbs.filter((id) => id !== kbId);
    }
    
    localSettings = { ...localSettings, knowledgeBases: newKbs };
    notifyChange();
  }

  /**
   * Notify parent of settings change
   */
  function notifyChange() {
    onSettingsChange?.(localSettings);
    onChange?.(localSettings);
  }

  /**
   * Handle save button click
   */
  function handleSave() {
    onSave?.(localSettings);
    handleClose();
  }

  /**
   * Handle cancel/close
   */
  function handleClose() {
    // Reset local settings to original
    localSettings = { ...settings };
    open = false;
    onClose?.();
  }
</script>

<Modal
  bind:open
  title="Chat Settings"
  size="md"
  closable={true}
  class={`chat-settings ${className}`.trim()}
>
  <div class="chat-settings__content">
    <!-- Model Selection -->
    <div class="chat-settings__group">
      <Select
        value={localSettings.model ?? ''}
        options={modelOptions}
        label="Model"
        placeholder="Select a model"
        onchange={(e) => handleModelChange(e.target.value)}
      />
      <Text size="sm" color="secondary" class="chat-settings__helper">
        Choose the AI model for generating responses.
      </Text>
    </div>

    <!-- Temperature Slider -->
    <div class="chat-settings__group">
      <label class="chat-settings__label" for="chat-settings-temperature">
        Temperature: {temperatureDisplay}
      </label>
      <input
        id="chat-settings-temperature"
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={localSettings.temperature ?? 0.7}
        oninput={handleTemperatureChange}
        class="chat-settings__slider"
        aria-describedby="chat-settings-temperature-help"
      />
      <div class="chat-settings__slider-labels">
        <span>Precise (0)</span>
        <span>Creative (2)</span>
      </div>
      <Text size="sm" color="secondary" id="chat-settings-temperature-help" class="chat-settings__helper">
        Lower values produce more focused and deterministic responses. Higher values increase creativity and randomness.
      </Text>
    </div>

    <!-- Max Tokens Input -->
    <div class="chat-settings__group">
      <TextField
        label="Max Tokens"
        value={String(localSettings.maxTokens ?? 4096)}
        type="text"
        placeholder="4096"
        oninput={(e) => handleMaxTokensChange(e.target.value)}
      />
      <Text size="sm" color="secondary" class="chat-settings__helper">
        Maximum number of tokens in the response. Higher values allow longer responses.
      </Text>
    </div>

    <!-- Knowledge Bases -->
    {#if availableKnowledgeBases.length > 0}
      <div class="chat-settings__group">
        <span class="chat-settings__label">Knowledge Bases</span>
        <Text size="sm" color="secondary" class="chat-settings__helper">
          Enable knowledge bases to provide context for responses.
        </Text>
        <div class="chat-settings__kb-list">
          {#each availableKnowledgeBases as kb (kb.id)}
            <div class="chat-settings__kb-item">
              <Switch
                checked={isKnowledgeBaseEnabled(kb.id)}
                onchange={() => handleKnowledgeBaseToggle(kb.id, !isKnowledgeBaseEnabled(kb.id))}
                label={kb.name}
              />
              {#if kb.description}
                <Text size="xs" color="secondary" class="chat-settings__kb-description">
                  {kb.description}
                </Text>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  {#snippet footer()}
    <div class="chat-settings__footer">
      <Button variant="ghost" onclick={handleClose}>
        Cancel
      </Button>
      <Button variant="solid" onclick={handleSave}>
        Save Settings
      </Button>
    </div>
  {/snippet}
</Modal>

<style>
  /* Settings content container */
  .chat-settings__content {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-5, 1.25rem);
  }

  /* Form group */
  .chat-settings__group {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-2, 0.5rem);
  }

  /* Label styling */
  .chat-settings__label {
    font-family: var(--gr-typography-fontFamily-sans, system-ui, sans-serif);
    font-size: var(--gr-typography-fontSize-sm, 0.875rem);
    font-weight: var(--gr-typography-fontWeight-medium, 500);
    color: var(--gr-semantic-foreground-primary, #111827);
  }

  :global([data-theme='dark']) .chat-settings__label {
    color: var(--gr-semantic-foreground-primary, #f9fafb);
  }

  /* Helper text */
  :global(.chat-settings__helper) {
    margin-top: var(--gr-spacing-scale-1, 0.25rem);
  }

  /* Temperature slider */
  .chat-settings__slider {
    width: 100%;
    height: 6px;
    border-radius: var(--gr-radii-full, 9999px);
    background: var(--gr-color-gray-200, #e5e7eb);
    appearance: none;
    cursor: pointer;
  }

  .chat-settings__slider::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: var(--gr-radii-full, 9999px);
    background: var(--gr-color-primary-500, #3b82f6);
    cursor: pointer;
    border: 2px solid var(--gr-color-white, #ffffff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease;
  }

  .chat-settings__slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  .chat-settings__slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: var(--gr-radii-full, 9999px);
    background: var(--gr-color-primary-500, #3b82f6);
    cursor: pointer;
    border: 2px solid var(--gr-color-white, #ffffff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  :global([data-theme='dark']) .chat-settings__slider {
    background: var(--gr-color-gray-700, #374151);
  }

  /* Slider labels */
  .chat-settings__slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: var(--gr-typography-fontSize-xs, 0.75rem);
    color: var(--gr-semantic-foreground-secondary, #6b7280);
  }

  :global([data-theme='dark']) .chat-settings__slider-labels {
    color: var(--gr-semantic-foreground-secondary, #9ca3af);
  }

  /* Knowledge bases list */
  .chat-settings__kb-list {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-3, 0.75rem);
    margin-top: var(--gr-spacing-scale-2, 0.5rem);
    padding: var(--gr-spacing-scale-3, 0.75rem);
    background: var(--gr-semantic-background-secondary, #f9fafb);
    border-radius: var(--gr-radii-md, 0.375rem);
    border: 1px solid var(--gr-semantic-border-primary, #e5e7eb);
  }

  :global([data-theme='dark']) .chat-settings__kb-list {
    background: var(--gr-semantic-background-secondary, #1f2937);
    border-color: var(--gr-semantic-border-primary, #374151);
  }

  /* Knowledge base item */
  .chat-settings__kb-item {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-1, 0.25rem);
  }

  :global(.chat-settings__kb-description) {
    padding-left: calc(var(--gr-spacing-scale-8, 2rem) + var(--gr-spacing-scale-2, 0.5rem));
  }

  /* Footer */
  .chat-settings__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--gr-spacing-scale-3, 0.75rem);
  }

  /* Mobile responsive */
  @media (max-width: 640px) {
    .chat-settings__content {
      gap: var(--gr-spacing-scale-4, 1rem);
    }

    .chat-settings__footer {
      flex-direction: column-reverse;
    }

    .chat-settings__footer :global(button) {
      width: 100%;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .chat-settings__slider::-webkit-slider-thumb {
      transition: none;
    }
  }
</style>