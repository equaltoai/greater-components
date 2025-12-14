import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/svelte';
import TestDiscoveryWrapper from './TestDiscoveryWrapper.svelte';
import { DiscoveryEngine } from '../../../src/components/Discovery/index.ts';
import { createMockDiscoveryStore } from '../../utils/index.ts';

describe('Discovery Behavior', () => {
  let mockStore: ReturnType<typeof createMockDiscoveryStore>;

  beforeEach(() => {
    mockStore = createMockDiscoveryStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const renderComponent = (Component: any, props = {}) => {
    return render(TestDiscoveryWrapper, {
      props: {
        store: mockStore as any,
        Component,
        props,
      }
    });
  };

  describe('Search & Filters', () => {
    it('triggers search on enter', async () => {
      renderComponent(DiscoveryEngine.SearchBar);
      const input = screen.getByPlaceholderText(/Search/i);

      await fireEvent.input(input, { target: { value: 'artist' } });
      await fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockStore.search).toHaveBeenCalledWith('artist');
    });

    it('StyleFilter triggers onChange', async () => {
        const onChange = vi.fn();
        renderComponent(DiscoveryEngine.StyleFilter, { 
            styles: [{ id: 's1', name: 'Modern', category: 'traditional' }],
            onChange
        });
        
        const checkbox = screen.getByText('Modern').closest('button');
        await fireEvent.click(checkbox!);

        expect(onChange).toHaveBeenCalledWith(['s1']);
    });

    it('Filters component updates store', async () => {
        renderComponent(DiscoveryEngine.Filters, { collapsible: false });
        
        const checkbox = screen.getByLabelText('For sale only');
        await fireEvent.click(checkbox);

        // Component calls updateFilters (not setFilters) when checkboxes are toggled
        expect(mockStore.updateFilters).toHaveBeenCalled();
    });
  });

  describe('Results & States', () => {
      it('shows loading state', async () => {
          mockStore.update(s => ({ ...s, loading: true }));
          renderComponent(DiscoveryEngine.Results);
          
          // It uses aria-label="Loading results"
          expect(screen.getByLabelText('Loading results')).toBeInTheDocument();
      });

      it('shows error state', async () => {
          mockStore.update(s => ({ ...s, error: new Error('Failed') }));
          renderComponent(DiscoveryEngine.Results);
          
          expect(screen.getByText(/Failed/i)).toBeInTheDocument();
          expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      it('shows empty state', async () => {
          mockStore.update(s => ({ ...s, results: [], loading: false }));
          renderComponent(DiscoveryEngine.Results);
          
          expect(screen.getAllByText(/No results/i)[0]).toBeInTheDocument();
      });

      it('renders results', async () => {
          const results = [
              { id: '1', title: 'Artwork 1', artist: { name: 'A1' }, images: { preview: '' } }
          ];
          mockStore.update(s => ({ ...s, results: results as any }));
          renderComponent(DiscoveryEngine.Results);
          
          expect(screen.getByText('Artwork 1')).toBeInTheDocument();
      });
  });
});