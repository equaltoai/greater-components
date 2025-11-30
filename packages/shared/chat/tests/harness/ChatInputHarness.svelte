<script lang="ts">
  import Input from '../../src/ChatInput.svelte';

  interface Props {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    showFileUpload?: boolean;
    acceptedFileTypes?: string;
    maxFiles?: number;
    maxFileSize?: number;
    onSend: (content: string, files?: File[]) => void | Promise<void>;
    class?: string;
  }

  let {
    value = $bindable(''),
    placeholder = 'Type a message...',
    disabled = false,
    maxLength,
    showFileUpload = false,
    acceptedFileTypes = 'image/*,.pdf,.txt,.md',
    maxFiles = 4,
    maxFileSize = 10 * 1024 * 1024,
    onSend,
    class: className = '',
  }: Props = $props();
</script>

<Input
  bind:value
  {placeholder}
  {disabled}
  {maxLength}
  {showFileUpload}
  {acceptedFileTypes}
  {maxFiles}
  {maxFileSize}
  {onSend}
  class={className}
/>