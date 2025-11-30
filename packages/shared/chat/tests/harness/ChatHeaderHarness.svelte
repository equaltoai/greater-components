<script lang="ts">
  import Header from '../../src/ChatHeader.svelte';
  import type { Snippet } from 'svelte';

  type HeaderConnectionStatus = 'connected' | 'connecting' | 'disconnected';

  interface Props {
    title?: string;
    subtitle?: string;
    connectionStatus?: HeaderConnectionStatus;
    showClearButton?: boolean;
    showSettingsButton?: boolean;
    onClear?: () => void;
    onSettings?: () => void;
    actions?: Snippet;
    class?: string;
  }

  let {
    title = 'Chat',
    subtitle,
    connectionStatus,
    showClearButton = true,
    showSettingsButton = false,
    onClear,
    onSettings,
    actions,
    class: className = '',
  }: Props = $props();
</script>

<Header
  {title}
  {subtitle}
  {connectionStatus}
  {showClearButton}
  {showSettingsButton}
  {onClear}
  {onSettings}
  {actions}
  class={className}
/>