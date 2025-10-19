import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import SeveredRelationshipsListHarness from './SeveredRelationshipsListHarness.svelte';
import SeveredRelationshipsRecoveryHarness from './SeveredRelationshipsRecoveryHarness.svelte';

describe('Admin.SeveredRelationships components', () => {
  it('loads severed relationship list from adapter', async () => {
    const adapter = {
      getSeveredRelationships: vi.fn().mockResolvedValue({
        edges: [
          {
            node: {
              id: 'sev-1',
              remoteInstance: 'remote.instance',
              reason: 'Moderation policy conflict',
              affectedFollowers: 12,
              affectedFollowing: 4,
            },
          },
        ],
      }),
    } as unknown as LesserGraphQLAdapter;

    render(SeveredRelationshipsListHarness, {
      props: {
        adapter,
      },
    });

    expect(adapter.getSeveredRelationships).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/remote.instance/)).toBeTruthy();
    expect(screen.getByText(/Moderation policy conflict/)).toBeTruthy();
    expect(screen.getByText(/16 affected/)).toBeTruthy();
  });

  it('invokes recovery actions on button clicks', async () => {
    const adapter = {
      acknowledgeSeverance: vi.fn().mockResolvedValue(undefined),
      attemptReconnection: vi.fn().mockResolvedValue(undefined),
    } as unknown as LesserGraphQLAdapter;

    render(SeveredRelationshipsRecoveryHarness, {
      props: {
        adapter,
        severanceId: 'sev-2',
      },
    });

    const acknowledgeButton = await screen.findByRole('button', { name: /acknowledge/i });
    await fireEvent.click(acknowledgeButton);
    expect(adapter.acknowledgeSeverance).toHaveBeenCalledWith('sev-2');

    const reconnectButton = screen.getByRole('button', { name: /attempt reconnection/i });
    await fireEvent.click(reconnectButton);
    expect(adapter.attemptReconnection).toHaveBeenCalledWith('sev-2');
  });
});
