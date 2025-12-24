/**
 * Artist Profile Store
 *
 * Reactive state management for artist profiles and portfolios.
 * Handles profile editing, section management, and optimistic updates.
 *
 * @module @equaltoai/greater-components-artist/stores/artistProfileStore
 */

import type { ArtistData } from '../types/artist.js';
import type { ArtworkData } from '../types/artwork.js';
import type {
	ArtistProfileStore,
	ArtistProfileStoreState,
	ArtistProfileStoreConfig,
	PortfolioSection,
} from './types.js';
import { ReactiveState } from './utils.js';

interface GraphQLExecutor {
	query<T = unknown>(options: {
		query: string;
		variables?: Record<string, unknown>;
	}): Promise<{ data: T }>;
	mutate<T = unknown>(options: {
		mutation: string;
		variables?: Record<string, unknown>;
	}): Promise<{ data: T }>;
}

/**
 * Creates an artist profile store instance
 */
export function createArtistProfileStore(
	config: ArtistProfileStoreConfig = {}
): ArtistProfileStore {
	const { adapter, artistId, isOwnProfile = false } = config;

	// Initialize state
	const state = new ReactiveState<ArtistProfileStoreState>({
		artist: null,
		artworks: [],
		sections: [],
		isEditing: false,
		pendingChanges: {},
		loading: false,
		error: null,
	});

	// Backup for rollback
	let originalArtist: ArtistData | null = null;
	let originalSections: PortfolioSection[] = [];

	/**
	 * Loads artist profile
	 */
	async function loadProfile(id: string): Promise<void> {
		state.update((current) => ({ ...current, loading: true, error: null }));

		try {
			if (!adapter) {
				state.update((current) => ({ ...current, loading: false }));
				return;
			}

			const executor = adapter as unknown as GraphQLExecutor;

			// Define partial types for response matching usage
			type ArtistResponse = {
				artist: ArtistData & {
					artworks?: {
						edges: Array<{ node: ArtworkData }>;
					};
				};
			};

			const response = await executor.query<ArtistResponse>({
				query: 'GetArtistProfile',
				variables: { id },
			});

			const artist = response.data?.artist;
			const artworks = response.data?.artist?.artworks?.edges?.map((edge) => edge.node) ?? [];

			// Parse sections from artist data or create defaults
			const sections = parsePortfolioSections(artist, artworks);

			state.update((current) => ({
				...current,
				artist,
				artworks,
				sections,
				loading: false,
			}));

			// Store originals for rollback
			originalArtist = artist;
			originalSections = [...sections];
		} catch (error) {
			state.update((current) => ({
				...current,
				loading: false,
				error: error instanceof Error ? error : new Error('Failed to load profile'),
			}));
		}
	}

	/**
	 * Parses portfolio sections from artist data
	 */
	function parsePortfolioSections(
		artist: ArtistData | null,
		artworks: ArtworkData[]
	): PortfolioSection[] {
		if (!artist) return [];

		// Default sections if none defined
		const defaultSections: PortfolioSection[] = [
			{
				id: 'featured',
				title: 'Featured',
				layout: 'featured',
				items: artworks.filter((a) => a.isFeatured).slice(0, 6),
				order: 0,
			},
			{
				id: 'recent',
				title: 'Recent Work',
				layout: 'grid',
				items: artworks.slice(0, 12),
				order: 1,
			},
		];

		return defaultSections;
	}

	/**
	 * Enters edit mode
	 */
	function startEditing(): void {
		if (!isOwnProfile) return;

		// Store current state for rollback
		originalArtist = state.value.artist;
		originalSections = [...state.value.sections];

		state.update((current) => ({
			...current,
			isEditing: true,
			pendingChanges: {},
		}));
	}

	/**
	 * Exits edit mode without saving
	 */
	function cancelEditing(): void {
		state.update((current) => ({
			...current,
			isEditing: false,
			pendingChanges: {},
			artist: originalArtist,
			sections: originalSections,
		}));
	}

	/**
	 * Saves pending changes
	 */
	async function saveChanges(): Promise<void> {
		if (!state.value.isEditing || Object.keys(state.value.pendingChanges).length === 0) {
			state.update((current) => ({ ...current, isEditing: false }));
			return;
		}

		state.update((current) => ({ ...current, loading: true, error: null }));

		try {
			if (!adapter) {
				state.update((current) => ({
					...current,
					loading: false,
					isEditing: false,
				}));
				return;
			}

			const executor = adapter as unknown as GraphQLExecutor;
			await executor.mutate({
				mutation: 'UpdateArtistProfile',
				variables: {
					id: state.value.artist?.id,
					input: state.value.pendingChanges,
				},
			});

			// Apply changes to artist
			state.update((current) => ({
				...current,
				artist: current.artist ? { ...current.artist, ...current.pendingChanges } : null,
				isEditing: false,
				pendingChanges: {},
				loading: false,
			}));

			// Update originals
			originalArtist = state.value.artist;
			originalSections = [...state.value.sections];
		} catch (error) {
			state.update((current) => ({
				...current,
				loading: false,
				error: error instanceof Error ? error : new Error('Failed to save changes'),
			}));
		}
	}

	/**
	 * Updates pending changes
	 */
	function updatePendingChanges(changes: Partial<ArtistData>): void {
		state.update((current) => ({
			...current,
			pendingChanges: { ...current.pendingChanges, ...changes },
			// Apply optimistically to preview
			artist: current.artist ? { ...current.artist, ...changes } : null,
		}));
	}

	/**
	 * Reorders sections
	 */
	function reorderSections(sectionIds: string[]): void {
		state.update((current) => {
			const reordered = sectionIds
				.map((id, index) => {
					const section = current.sections.find((s) => s.id === id);
					return section ? { ...section, order: index } : null;
				})
				.filter((s): s is PortfolioSection => s !== null);

			return { ...current, sections: reordered };
		});
	}

	/**
	 * Adds a new section
	 */
	function addSection(section: Omit<PortfolioSection, 'id' | 'order'>): void {
		const newSection: PortfolioSection = {
			...section,
			id: `section-${Date.now()}`,
			order: state.value.sections.length,
		};

		state.update((current) => ({
			...current,
			sections: [...current.sections, newSection],
		}));
	}

	/**
	 * Removes a section
	 */
	function removeSection(id: string): void {
		state.update((current) => ({
			...current,
			sections: current.sections
				.filter((s) => s.id !== id)
				.map((s, index) => ({ ...s, order: index })),
		}));
	}

	/**
	 * Subscribes to state changes
	 */
	function subscribe(callback: (value: ArtistProfileStoreState) => void): () => void {
		return state.subscribe(callback);
	}

	/**
	 * Gets current state
	 */
	function get(): ArtistProfileStoreState {
		return state.value;
	}

	/**
	 * Cleans up store resources
	 */
	function destroy(): void {
		// Cleanup
	}

	// Auto-load if artistId provided
	if (artistId) {
		loadProfile(artistId);
	}

	return {
		subscribe,
		get,
		destroy,
		loadProfile,
		startEditing,
		cancelEditing,
		saveChanges,
		updatePendingChanges,
		reorderSections,
		addSection,
		removeSection,
	};
}
