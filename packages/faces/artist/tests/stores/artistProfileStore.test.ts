import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createArtistProfileStore } from '../../src/stores/artistProfileStore.js';
import { createMockAdapter } from '../mocks/mockAdapter.js';
import { createMockArtworkList } from '../mocks/mockArtwork.js';

describe('ArtistProfileStore', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('creates store with default state', () => {
			const store = createArtistProfileStore({ adapter: mockAdapter as any });
			const state = store.get();

			expect(state.artist).toBeNull();
			expect(state.isEditing).toBe(false);
		});

		it('loads profile on init if artistId provided', () => {
			const artistId = 'artist-1';
			createArtistProfileStore({
				adapter: mockAdapter as any,
				artistId,
			});

			expect(mockAdapter.query).toHaveBeenCalledWith(
				expect.objectContaining({
					query: 'GetArtistProfile',
					variables: { id: artistId },
				})
			);
		});
	});

	describe('Profile Loading', () => {
		it('loads profile and parses sections', async () => {
			const store = createArtistProfileStore({ adapter: mockAdapter as any });
			const artist = { id: '1', name: 'Artist' };
			const artworks = createMockArtworkList(5);

			mockAdapter.query.mockResolvedValue({
				data: {
					artist: {
						...artist,
						artworks: { edges: artworks.map((a: any) => ({ node: a })) },
					},
				},
			});

			await store.loadProfile('1');

			const state = store.get();
			expect(state.artist?.id).toBe('1');
			expect(state.artworks).toHaveLength(5);
			expect(state.sections.length).toBeGreaterThan(0);
		});

		it('handles load error', async () => {
			const store = createArtistProfileStore({ adapter: mockAdapter as any });
			mockAdapter.query.mockRejectedValue(new Error('Load failed'));

			await store.loadProfile('1');

			expect(store.get().error).toBeTruthy();
			expect(store.get().loading).toBe(false);
		});
	});

	describe('Editing', () => {
		it('starts editing only if own profile', () => {
			const store = createArtistProfileStore({
				adapter: mockAdapter as any,
				isOwnProfile: false,
			});
			store.startEditing();
			expect(store.get().isEditing).toBe(false);

			const ownStore = createArtistProfileStore({
				adapter: mockAdapter as any,
				isOwnProfile: true,
			});
			ownStore.startEditing();
			expect(ownStore.get().isEditing).toBe(true);
		});

		it('cancels editing and rolls back', async () => {
			const store = createArtistProfileStore({
				adapter: mockAdapter as any,
				isOwnProfile: true,
			});
			
            // Load initial
             mockAdapter.query.mockResolvedValue({ data: { artist: { id: '1', statement: 'Old' } } });
             await store.loadProfile('1');
             
            store.startEditing();
            store.updatePendingChanges({ statement: 'New' });
            expect(store.get().artist?.statement).toBe('New'); // Optimistic
            
            store.cancelEditing();
            expect(store.get().isEditing).toBe(false);
            expect(store.get().artist?.statement).toBe('Old'); // Rolled back
		});

		it('saves changes', async () => {
			const store = createArtistProfileStore({
				adapter: mockAdapter as any,
				isOwnProfile: true,
			});
            
             // Load initial
             mockAdapter.query.mockResolvedValue({ data: { artist: { id: '1', statement: 'Old' } } });
             await store.loadProfile('1');

			store.startEditing();
			store.updatePendingChanges({ statement: 'Updated' });

            mockAdapter.mutate.mockResolvedValue({ data: { success: true } });

			await store.saveChanges();

			expect(store.get().isEditing).toBe(false);
			expect(store.get().artist?.statement).toBe('Updated');
            expect(mockAdapter.mutate).toHaveBeenCalledWith(expect.objectContaining({
                mutation: 'UpdateArtistProfile',
                variables: {
                    id: '1',
                    input: { statement: 'Updated' }
                }
            }));
		});
        
        it('handles save error', async () => {
            const store = createArtistProfileStore({
				adapter: mockAdapter as any,
				isOwnProfile: true,
			});
            store.startEditing();
			store.updatePendingChanges({ statement: 'Updated' });
            
            mockAdapter.mutate.mockRejectedValue(new Error('Save failed'));
            
            await store.saveChanges();
            
            expect(store.get().error).toBeTruthy();
            expect(store.get().loading).toBe(false);
            // Should stay in edit mode
             expect(store.get().isEditing).toBe(true); // Wait, code sets isEditing: false in catch block?
             // Checking source: 
             /*
                catch (error) {
                        state.update((current) => ({
                                ...current,
                                loading: false,
                                error: error instanceof Error ? error : new Error('Failed to save changes'),
                        }));
                }
             */
             // It does NOT set isEditing: false in catch. Good.
             expect(store.get().isEditing).toBe(true);
        });
	});

	describe('Sections', () => {
		it('adds a section', () => {
			const store = createArtistProfileStore({ adapter: mockAdapter as any });
			store.addSection({ title: 'New Section', items: [], layout: 'grid' });
			expect(store.get().sections).toHaveLength(1);
			expect(store.get().sections[0].title).toBe('New Section');
		});

		it('removes a section', () => {
			const store = createArtistProfileStore({ adapter: mockAdapter as any });
			store.addSection({ title: 'S1', items: [], layout: 'grid' });
			const id = store.get().sections[0].id;

			store.removeSection(id);
			expect(store.get().sections).toHaveLength(0);
		});

		it('reorders sections', () => {
			const store = createArtistProfileStore({ adapter: mockAdapter as any });
			store.addSection({ title: 'S1', items: [], layout: 'grid' });
			store.addSection({ title: 'S2', items: [], layout: 'grid' });
            
            const [s1, s2] = store.get().sections;
            expect(s1.order).toBe(0);
            expect(s2.order).toBe(1);

            store.reorderSections([s2.id, s1.id]);
            
            const reordered = store.get().sections;
            expect(reordered[0].id).toBe(s2.id);
            expect(reordered[0].order).toBe(0);
            expect(reordered[1].id).toBe(s1.id);
            expect(reordered[1].order).toBe(1);
		});
	});
});
