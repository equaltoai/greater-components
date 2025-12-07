# Module: Update Chat Types for Enhanced ChatInputProps

## Type: update

## Files:
[packages/shared/chat/src/types.ts]

## File Changes:
- packages/shared/chat/src/types.ts: BEFORE: <<<
/**
 * Chat input component props
 */
export interface ChatInputProps {
  /** Current input value (bindable) */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to auto-focus the input */
  autofocus?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Whether to allow multiline input */
  multiline?: boolean;
  /** Number of rows for multiline input */
  rows?: number;
  /** Called when message is submitted */
  onSubmit?: (content: string) => void | Promise<void>;
  /** Called when input value changes */
  onChange?: (value: string) => void;
  /** Custom CSS class */
  class?: string;
}
>>> | AFTER: <<<
/**
 * Chat input component props
 */
export interface ChatInputProps {
  /** Current input value (bindable) */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to auto-focus the input */
  autofocus?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Whether to allow multiline input */
  multiline?: boolean;
  /** Number of rows for multiline input */
  rows?: number;
  /** Whether to show file upload button */
  showFileUpload?: boolean;
  /** Accepted file types for upload */
  acceptedFileTypes?: string;
  /** Maximum number of files that can be attached */
  maxFiles?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Called when message is submitted (legacy, use onSend) */
  onSubmit?: (content: string) => void | Promise<void>;
  /** Called when message is submitted with optional files */
  onSend?: (content: string, files?: File[]) => void | Promise<void>;
  /** Called when input value changes */
  onChange?: (value: string) => void;
  /** Custom CSS class */
  class?: string;
}
>>> | TYPE: content replacement | DESC: Enhance ChatInputProps interface with file upload properties and add onSend callback signature while keeping onSubmit for backward compatibility
