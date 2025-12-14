import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/svelte';
import DiscoveryJourneyApp from './DiscoveryJourneyApp.svelte';
import { MediaViewer } from '../../../src/components/MediaViewer/index.ts';
import { createMockDiscoveryStore } from '../../utils/index.ts';
import { createMockArtworkList } from '../../mocks/mockArtwork.ts';

describe('Discovery to Viewer Journey', () => {
  let mockStore: ReturnType<typeof createMockDiscoveryStore>;
  const mockArtworks = createMockArtworkList(3);

  beforeEach(() => {
    mockStore = createMockDiscoveryStore();
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    cleanup();
  });

  it('searches for artwork and opens it in viewer', async () => {
    const onResultClick = vi.fn();
    
    // 1. Render Discovery
    render(DiscoveryJourneyApp, {
      props: {
        store: mockStore as any,
        onResultClick,
      }
    });

    // 2. Search
    const input = screen.getByPlaceholderText(/Search/i);
    await fireEvent.input(input, { target: { value: 'test' } });
    await fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockStore.search).toHaveBeenCalledWith('test');

    // 3. Mock Results
    await act(() => {
        mockStore.update(s => ({
            ...s,
            results: mockArtworks as any,
            loading: false
        }));
    });

    // 4. Click Result
    const resultItem = screen.getByText(mockArtworks[0].title);
    await fireEvent.click(resultItem);

    expect(onResultClick).toHaveBeenCalledWith(mockArtworks[0]);

    // 5. Open MediaViewer (simulating app router/state)
    const onClose = vi.fn();
    render(MediaViewer.Root, {
      props: {
        artworks: mockArtworks as any,
        currentIndex: 0,
        handlers: { onClose }
      }
    });

    // 6. Verify Viewer
    expect(screen.getByRole('dialog', { name: /Image viewer/i })).toBeInTheDocument();
    
    // 7. Close
    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});