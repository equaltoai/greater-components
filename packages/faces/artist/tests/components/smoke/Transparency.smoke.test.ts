
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { Transparency } from '../../../src/components/Transparency/index.ts';

describe('Transparency Smoke Tests', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders AIDisclosure', () => {
    render(Transparency.AIDisclosure, {
      props: {
        usage: { hasAI: true, tools: ['Tool'], percentage: 50 },
        variant: 'badge'
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders ProcessDocumentation', () => {
    render(Transparency.ProcessDocumentation, {
      props: {
        steps: [{ title: 'Sketch', description: 'Initial idea' }]
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders AIOptOutControls', () => {
    render(Transparency.AIOptOutControls, {
      props: {
        currentStatus: true,
        onUpdate: vi.fn()
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders EthicalSourcingBadge', () => {
    render(Transparency.EthicalSourcingBadge, {
      props: {
        verification: { verified: true, date: new Date().toISOString() }
      }
    });
    expect(console.error).not.toHaveBeenCalled();
  });
});
