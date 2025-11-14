import { describe, expect, it } from 'vitest';
import { createTimelineSeeds, createStatusShowcase } from './fediverse';

describe('fediverse data helpers', () => {
  it('returns fresh clones for each timeline seed call', () => {
    const first = createTimelineSeeds();
    const second = createTimelineSeeds();

    expect(first.home).not.toBe(second.home);

    first.home[0]!.id = 'mutated-home';
    expect(second.home[0]!.id).not.toBe('mutated-home');
  });

  it('generates unique media attachment ids for showcase statuses', () => {
    const statuses = createStatusShowcase();
    const mediaIds = statuses
      .flatMap((status) => status.mediaAttachments ?? [])
      .map((media) => media.id);

    const uniqueIds = new Set(mediaIds);
    expect(uniqueIds.size).toBe(mediaIds.length);
  });
});
