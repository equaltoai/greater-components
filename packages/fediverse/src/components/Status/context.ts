/**
 * Status Component Context
 * 
 * Provides shared state and configuration for compound Status components.
 * Uses Svelte 5's context API for passing data between Status.* components.
 * 
 * @module @greater/fediverse/Status/context
 */

import { getContext, setContext } from 'svelte';
import type { GenericStatus } from '../../generics/index.js';

/**
 * Status context key
 */
const STATUS_CONTEXT_KEY = Symbol('status-context');

/**
 * Configuration options for Status component
 */
export interface StatusConfig {
  /**
   * Display density variant
   */
  density?: 'compact' | 'comfortable';

  /**
   * Whether to show the action bar
   */
  showActions?: boolean;

  /**
   * Whether the status card is clickable
   */
  clickable?: boolean;

  /**
   * Whether to show thread indicators
   */
  showThread?: boolean;

  /**
   * Custom CSS class
   */
  class?: string;
}

/**
 * Action handlers for status interactions
 */
export interface StatusActionHandlers {
  /**
   * Called when status is clicked (if clickable)
   */
  onClick?: (status: GenericStatus) => void;

  /**
   * Reply action handler
   */
  onReply?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Boost/reblog action handler
   */
  onBoost?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Favorite/like action handler
   */
  onFavorite?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Share action handler
   */
  onShare?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Quote action handler
   */
  onQuote?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Bookmark action handler
   */
  onBookmark?: (status: GenericStatus) => Promise<void> | void;
}

/**
 * Status context value
 */
export interface StatusContext {
  /**
   * The status data being displayed
   */
  status: GenericStatus;

  /**
   * The actual status to display (handles reblogs)
   */
  actualStatus: GenericStatus;

  /**
   * The account to display (handles reblog account)
   */
  account: GenericStatus['account'];

  /**
   * Configuration options
   */
  config: Required<StatusConfig>;

  /**
   * Action handlers
   */
  handlers: StatusActionHandlers;

  /**
   * Whether this is a reblog
   */
  isReblog: boolean;
}

/**
 * Create and set the status context
 * 
 * @param status - The status data
 * @param config - Configuration options
 * @param handlers - Action handlers
 */
export function createStatusContext(
  status: GenericStatus,
  config: StatusConfig = {},
  handlers: StatusActionHandlers = {}
): StatusContext {
  // Handle reblogs - display the reblogged status
  const actualStatus = status.reblog || status;
  const account = (status.reblog?.account || status.account) as GenericStatus['account'];
  const isReblog = !!status.reblog;

  const context: StatusContext = {
    status,
    actualStatus,
    account,
    isReblog,
    config: {
      density: config.density || 'comfortable',
      showActions: config.showActions ?? true,
      clickable: config.clickable ?? false,
      showThread: config.showThread ?? true,
      class: config.class || ''
    },
    handlers
  };

  setContext(STATUS_CONTEXT_KEY, context);
  return context;
}

/**
 * Get the status context
 * 
 * @throws Error if called outside of Status.Root
 */
export function getStatusContext(): StatusContext {
  const context = getContext<StatusContext>(STATUS_CONTEXT_KEY);
  
  if (!context) {
    throw new Error(
      'Status context not found. Make sure you are using Status components inside <Status.Root>.'
    );
  }
  
  return context;
}

/**
 * Check if status context exists
 */
export function hasStatusContext(): boolean {
  try {
    const context = getContext<StatusContext>(STATUS_CONTEXT_KEY);
    return context !== undefined && context !== null;
  } catch {
    return false;
  }
}
