# Module: ChatHeader Component Types Update

## Type: update

## Files:
[packages/shared/chat/src/types.ts]

## File Changes:
- packages/shared/chat/src/types.ts: BEFORE: <<<
/**
 * Chat header component props
 */
export interface ChatHeaderProps {
  /** Title text */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Whether to show settings button */
  showSettings?: boolean;
  /** Called when settings button is clicked */
  onSettingsClick?: () => void;
  /** Whether to show close button */
  showClose?: boolean;
  /** Called when close button is clicked */
  onClose?: () => void;
  /** Custom actions slot */
  actions?: Snippet;
  /** Custom CSS class */
  class?: string;
}
>>> | AFTER: <<<
/**
 * Chat header component props
 */
export interface ChatHeaderProps {
  /** Title text */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Connection status indicator */
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
  /** Whether to show clear conversation button */
  showClearButton?: boolean;
  /** Whether to show settings button */
  showSettingsButton?: boolean;
  /** Called when clear button is clicked */
  onClear?: () => void;
  /** Called when settings button is clicked */
  onSettings?: () => void;
  /** Custom actions slot */
  actions?: Snippet;
  /** Custom CSS class */
  class?: string;
}
>>> | TYPE: content replacement | DESC: Update ChatHeaderProps interface to include connectionStatus, showClearButton, showSettingsButton, onClear, and onSettings props while removing deprecated showClose and onClose props
