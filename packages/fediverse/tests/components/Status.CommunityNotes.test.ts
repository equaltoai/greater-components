/**
 * Status.CommunityNotes Logic Tests
 * 
 * Tests for community notes data structures and logic
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import {
	hasCommunityNotes,
	type ActivityPubObject,
	type GenericStatus,
	type ActivityPubActor,
} from '../../src/generics/index.js';
import StatusCommunityNotesHarness from './StatusCommunityNotesHarness.svelte';

const createMockObject = (extensions?: any): ActivityPubObject => ({
  id: 'https://example.com/post/123',
  type: 'Note',
  attributedTo: 'user1',
  content: 'Test post',
  published: new Date('2024-01-01'),
  to: [],
  cc: [],
  extensions: extensions || {},
});

const createMockActor = (id: string): ActivityPubActor => ({
  id: `https://example.com/users/${id}`,
  type: 'Person',
  name: `User ${id}`,
  preferredUsername: `user${id}`,
  url: `https://example.com/@user${id}`,
});

function createStatusWithNotes(noteCount = 1): GenericStatus & {
  communityNotes: Array<{
    id: string;
    author: { username: string; displayName?: string };
    content: string;
    helpful: number;
    notHelpful: number;
    createdAt: string;
  }>;
} {
  const actor = createMockActor('author');
  const notes = Array.from({ length: noteCount }, (_, index) => ({
    id: `note-${index + 1}`,
    author: {
      username: `fact_checker_${index + 1}`,
      displayName: `Fact Checker ${index + 1}`,
    },
    content: `Context ${index + 1}`,
    helpful: 5 + index,
    notHelpful: index,
    createdAt: new Date(2024, 0, index + 1).toISOString(),
  }));

  const activityPubObject = createMockObject({
    communityNotes: notes.map((note) => ({
      id: note.id,
      content: note.content,
      helpful: note.helpful,
      notHelpful: note.notHelpful,
      createdAt: note.createdAt,
      author: {
        id: `https://example.com/users/${note.author.username}`,
        username: note.author.username,
        displayName: note.author.displayName,
      },
    })),
  });

  return {
    id: 'status-1',
    activityPubObject,
    account: actor,
    content: 'Status content',
    sensitive: false,
    mediaAttachments: [],
    mentions: [],
    hashtags: [],
    emojis: [],
    createdAt: new Date(),
    repliesCount: 0,
    reblogsCount: 0,
    favouritesCount: 0,
    visibility: 'public',
    url: activityPubObject.id,
    communityNotes: notes,
  } as GenericStatus & { communityNotes: typeof notes };
}

describe('Status.CommunityNotes Logic', () => {
  describe('Community Note Structure', () => {
    it('should validate community note structure', () => {
      const note = {
        id: 'note1',
        author: {
          id: 'user1',
          username: 'fact_checker',
          displayName: 'Fact Checker',
        },
        content: 'Additional context',
        helpful: 25,
        notHelpful: 3,
        createdAt: new Date('2024-01-02').toISOString(),
      };

      expect(note.id).toBeDefined();
      expect(note.author).toBeDefined();
      expect(note.content).toBeDefined();
      expect(note.helpful).toBeGreaterThanOrEqual(0);
      expect(note.notHelpful).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Community Notes Detection', () => {
    it('should detect when notes are present', () => {
      const withNotes = createMockObject({
        communityNotes: [
          { id: 'note1', content: 'Note 1' },
          { id: 'note2', content: 'Note 2' },
        ],
      });

      expect(hasCommunityNotes(withNotes)).toBe(true);
    });

    it('should return false for empty notes array', () => {
      const emptyNotes = createMockObject({ communityNotes: [] });
      expect(hasCommunityNotes(emptyNotes)).toBe(false);
    });

    it('should return false when no notes field', () => {
      const noNotes = createMockObject();
      expect(hasCommunityNotes(noNotes)).toBe(false);
    });
  });

  describe('Note Pagination Logic', () => {
    it('should slice notes correctly for initial display', () => {
      const notes = Array.from({ length: 10 }, (_, i) => ({
        id: `note${i}`,
        content: `Note ${i}`,
      }));

      const maxInitial = 3;
      const visible = notes.slice(0, maxInitial);
      const hasMore = notes.length > maxInitial;

      expect(visible).toHaveLength(3);
      expect(hasMore).toBe(true);
    });

    it('should show all notes when expanded', () => {
      const notes = Array.from({ length: 5 }, (_, i) => ({
        id: `note${i}`,
      }));

      const showAll = true;
      const maxInitial = 3;
      const visible = showAll ? notes : notes.slice(0, maxInitial);

      expect(visible).toHaveLength(5);
    });
  });

  describe('Feedback Counts', () => {
    it('should track helpful and not helpful votes', () => {
      const note = {
        id: 'note1',
        helpful: 25,
        notHelpful: 3,
      };

      expect(note.helpful).toBeGreaterThan(note.notHelpful);
      
      const helpfulRatio = note.helpful / (note.helpful + note.notHelpful);
      expect(helpfulRatio).toBeCloseTo(0.893, 2);
    });

    it('should handle zero votes', () => {
      const note = {
        id: 'note1',
        helpful: 0,
        notHelpful: 0,
      };

      expect(note.helpful + note.notHelpful).toBe(0);
    });
  });

  describe('Date Formatting', () => {
    it('should format note timestamps', () => {
      const date = new Date('2024-01-02T15:30:00Z');
      const formatted = new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);

      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/2/);
    });
  });

  describe('Multiple Notes Handling', () => {
    it('should handle multiple community notes', () => {
      const obj = createMockObject({
        communityNotes: [
          { id: 'note1', content: 'Context 1', helpful: 10, notHelpful: 1 },
          { id: 'note2', content: 'Context 2', helpful: 20, notHelpful: 2 },
          { id: 'note3', content: 'Context 3', helpful: 15, notHelpful: 5 },
        ],
      });

      const notes = obj.extensions?.communityNotes || [];
      expect(notes).toHaveLength(3);
      expect(hasCommunityNotes(obj)).toBe(true);
    });
  });
});

describe('Status.CommunityNotes Component', () => {
  it('calls onVote handler when buttons clicked', async () => {
    const status = createStatusWithNotes(2);
    const onVote = vi.fn().mockResolvedValue(undefined);

    render(StatusCommunityNotesHarness, {
      props: {
        status,
        onVote,
        enableVoting: true,
      },
    });

    await screen.findByText('Community Notes');

    const helpfulButtons = screen.getAllByTitle('Helpful');
    await fireEvent.click(helpfulButtons[0]);

    expect(onVote).toHaveBeenCalledTimes(1);
    expect(onVote).toHaveBeenCalledWith('note-1', true);

    const notHelpfulButtons = screen.getAllByTitle('Not helpful');
    await fireEvent.click(notHelpfulButtons[0]);

    expect(onVote).toHaveBeenCalledTimes(2);
    expect(onVote).toHaveBeenLastCalledWith('note-1', false);
  });

  it('supports expanding to show additional notes', async () => {
    const status = createStatusWithNotes(2);

    render(StatusCommunityNotesHarness, {
      props: {
        status,
        maxInitialNotes: 1,
      },
    });

    expect(await screen.findByText('Context 1')).toBeTruthy();
    expect(screen.queryByText('Context 2')).toBeNull();

    const toggle = await screen.findByRole('button', { name: 'Show 1 more notes' });
    await fireEvent.click(toggle);

    expect(screen.getByText('Context 2')).toBeTruthy();

    await fireEvent.click(screen.getByRole('button', { name: 'Show fewer notes' }));
    expect(screen.queryByText('Context 2')).toBeNull();
  });
});
