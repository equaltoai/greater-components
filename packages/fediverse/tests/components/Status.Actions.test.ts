import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';

vi.mock('@equaltoai/greater-components-primitives', async () => ({
  Button: (await import('./ButtonStub.svelte')).default,
}));

beforeAll(() => {
  if (!window.matchMedia) {
    // jsdom stub for matchMedia used by preference stores in primitive components
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }
});
import StatusActionsHarness from './StatusActionsHarness.svelte';
import type { GenericStatus, GenericActor } from '../../src/generics/index';
import type { StatusActionHandlers } from '../../src/components/Status/context';

function createMockActor(id: string): GenericActor {
  return {
    id: `actor-${id}`,
    username: `user${id}`,
    displayName: `User ${id}`,
    avatar: `https://example.com/avatar${id}.png`,
    url: `https://example.com/@user${id}`,
    followers: 0,
    following: 0,
    posts: 0,
    createdAt: new Date().toISOString(),
  };
}

function createMockStatus(id: string): GenericStatus {
  const account = createMockActor(id);
  const now = new Date();

  return {
    id,
    uri: `https://example.com/status/${id}`,
    content: `Test status ${id}`,
    account,
    createdAt: now,
    updatedAt: undefined,
    visibility: 'public',
    sensitive: false,
    spoilerText: '',
    repliesCount: 0,
    reblogsCount: 0,
    favouritesCount: 0,
    url: `https://example.com/status/${id}`,
    inReplyToId: null,
    inReplyToAccountId: null,
    reblog: null,
    mentions: [],
    hashtags: [],
    tags: [],
    emojis: [],
    mediaAttachments: [],
    language: 'en',
    pinned: false,
    bookmarked: false,
    favourited: false,
    reblogged: false,
    muted: false,
    poll: null,
    card: null,
    application: null,
    activityPubObject: {} as any,
  } as GenericStatus;
}

describe('Status.Actions', () => {
 it('renders quote action when handler provided', async () => {
    const status = createMockStatus('quote-1');
    Object.assign(status, { quoteCount: 0 });

    const handlers: StatusActionHandlers = {
      onQuote: vi.fn(),
    };

    render(StatusActionsHarness, {
      props: {
        status,
        handlers,
      },
    });

    const quoteButton = await screen.findByRole('button', { name: /quote this post/i });
    await fireEvent.click(quoteButton);

    expect(handlers.onQuote).toHaveBeenCalledTimes(1);
    expect(handlers.onQuote).toHaveBeenCalledWith(status);
  });

  it('renders quote action when handler provided and quote count missing', async () => {
    const status = createMockStatus('quote-2');
    // Deliberately omit quoteCount to ensure guard relies on handler

    const handlers: StatusActionHandlers = {
      onQuote: vi.fn(),
    };

    render(StatusActionsHarness, {
      props: {
        status,
        handlers,
      },
    });

    const quoteButton = await screen.findByRole('button', { name: /quote this post/i });
    await fireEvent.click(quoteButton);

    expect(handlers.onQuote).toHaveBeenCalledTimes(1);
    expect(handlers.onQuote).toHaveBeenCalledWith(status);
  });

  it('omits quote action when handler not provided', async () => {
    const status = createMockStatus('no-quote');
    Object.assign(status, { quoteCount: 2 });

    render(StatusActionsHarness, {
      props: {
        status,
        handlers: {},
      },
    });

    expect(screen.queryByRole('button', { name: /quote this post/i })).toBeNull();
  });
});
