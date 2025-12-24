/**
 * Artist Adapter Extensions
 *
 * Extends LesserGraphQLAdapter with artist-specific operations.
 * Follows the adapter extension pattern from Greater Components.
 *
 * @module @equaltoai/greater-components-artist/adapters/artistAdapter
 */

import { gql } from '@apollo/client';
import { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import type {
	Artwork,
	ArtworkConnection,
	ArtistProfile,
	Commission,
	CreateArtworkInput,
	UpdateArtworkInput,
	DiscoveryFilter,
	CommissionRequestInput,
	QuoteInput,
	ProgressInput,
	DeliveryInput,
	CommissionStatus,
	PortfolioSection,
	ColorSearchMode,
} from '../types';

/**
 * Color search options
 */
export interface ColorSearchOptions {
	tolerance?: number;
	mode?: ColorSearchMode;
	first?: number;
	after?: string;
}

/**
 * Artist profile input for updates
 */
export interface ArtistProfileInput {
	statement?: string;
	acceptingCommissions?: boolean;
	commissionInfo?: {
		priceRange?: string;
		turnaround?: string;
		description?: string;
	};
	featuredArtworkId?: string;
}

// ============================================================================
// GraphQL Response Types
// ============================================================================

/** Base mutation response with success/errors */
interface MutationResponse<T> {
	success: boolean;
	errors?: string[];
	[key: string]: T | boolean | string[] | undefined;
}

/** Create artwork mutation response */
interface CreateArtworkResponse {
	createArtwork: MutationResponse<Artwork> & { artwork: Artwork };
}

/** Update artwork mutation response */
interface UpdateArtworkResponse {
	updateArtwork: MutationResponse<Artwork> & { artwork: Artwork };
}

/** Delete artwork mutation response */
interface DeleteArtworkResponse {
	deleteArtwork: MutationResponse<string> & { deletedId: string };
}

/** Get artwork query response */
interface GetArtworkResponse {
	artwork: Artwork | null;
}

/** Get artworks query response */
interface GetArtworksResponse {
	artworks: ArtworkConnection;
}

/** Discover artworks query response */
interface DiscoverArtworksResponse {
	discoverArtworks: ArtworkConnection;
}

/** Search artworks query response */
interface SearchArtworksResponse {
	searchArtworks: ArtworkConnection;
}

/** Color search query response */
interface ColorSearchResponse {
	colorSearch: ArtworkConnection;
}

/** Similar artworks query response */
interface SimilarArtworksResponse {
	similarArtworks: Artwork[];
}

/** Create commission mutation response */
interface CreateCommissionResponse {
	createCommissionRequest: Commission;
}

/** Submit quote mutation response */
interface SubmitQuoteResponse {
	submitQuote: Commission;
}

/** Accept quote mutation response */
interface AcceptQuoteResponse {
	acceptQuote: Commission;
}

/** Update progress mutation response */
interface UpdateProgressResponse {
	updateProgress: Commission;
}

/** Deliver commission mutation response */
interface DeliverCommissionResponse {
	deliverCommission: Commission;
}

/** Get artist profile query response */
interface GetArtistProfileResponse {
	artistProfile: ArtistProfile | null;
}

/** Update artist profile mutation response */
interface UpdateArtistProfileResponse {
	updateArtistProfile: ArtistProfile;
}

/** Update portfolio sections mutation response */
interface UpdatePortfolioSectionsResponse {
	updatePortfolioSections: PortfolioSection[];
}

/** WebFinger lookup query response */
interface WebFingerLookupResponse {
	webFingerLookup: ArtistProfile | null;
}

/** Follow remote artist mutation response */
interface FollowRemoteArtistResponse {
	followRemoteArtist: { success: boolean };
}

/**
 * Create artist adapter by extending base LesserGraphQLAdapter
 *
 * @example
 * ```typescript
 * import { LesserGraphQLAdapter } from '@equaltoai/greater-components/adapters';
 * import { createArtistAdapter } from '@equaltoai/greater-components-artist/adapters';
 *
 * const baseAdapter = new LesserGraphQLAdapter({
 *   endpoint: import.meta.env.VITE_LESSER_ENDPOINT,
 *   token: import.meta.env.VITE_LESSER_TOKEN,
 *   enableSubscriptions: true
 * });
 *
 * const artistAdapter = createArtistAdapter(baseAdapter);
 * ```
 */
export function createArtistAdapter(baseAdapter: LesserGraphQLAdapter) {
	return {
		// Inherit all base adapter methods
		...baseAdapter,

		// ========================================================================
		// Artwork Operations
		// ========================================================================

		/**
		 * Create new artwork
		 */
		async createArtwork(input: CreateArtworkInput): Promise<Artwork> {
			const result = (await baseAdapter.mutate(CREATE_ARTWORK_MUTATION, {
				input,
			})) as unknown as CreateArtworkResponse;

			if (!result.createArtwork.success) {
				throw new Error(result.createArtwork.errors?.join(', ') || 'Failed to create artwork');
			}

			return result.createArtwork.artwork;
		},

		/**
		 * Update existing artwork
		 */
		async updateArtwork(id: string, input: UpdateArtworkInput): Promise<Artwork> {
			const result = (await baseAdapter.mutate(UPDATE_ARTWORK_MUTATION, {
				id,
				input,
			})) as unknown as UpdateArtworkResponse;

			if (!result.updateArtwork.success) {
				throw new Error(result.updateArtwork.errors?.join(', ') || 'Failed to update artwork');
			}

			return result.updateArtwork.artwork;
		},

		/**
		 * Delete artwork
		 */
		async deleteArtwork(id: string): Promise<boolean> {
			const result = (await baseAdapter.mutate(DELETE_ARTWORK_MUTATION, {
				id,
			})) as unknown as DeleteArtworkResponse;

			return result.deleteArtwork.success;
		},

		/**
		 * Get single artwork by ID
		 */
		async getArtwork(id: string): Promise<Artwork | null> {
			const result = (await baseAdapter.query(GET_ARTWORK_QUERY, {
				id,
			})) as unknown as GetArtworkResponse;

			return result.artwork;
		},

		/**
		 * Get paginated artworks
		 */
		async getArtworks(options?: {
			first?: number;
			after?: string;
			filter?: Record<string, unknown>;
		}): Promise<ArtworkConnection> {
			const result = (await baseAdapter.query(
				GET_ARTWORKS_QUERY,
				options
			)) as unknown as GetArtworksResponse;

			return result.artworks;
		},

		// ========================================================================
		// Discovery Operations
		// ========================================================================

		/**
		 * Discover artworks with AI-powered filtering
		 */
		async discoverArtworks(
			filter?: DiscoveryFilter,
			options?: { first?: number; after?: string }
		): Promise<ArtworkConnection> {
			const result = (await baseAdapter.query(DISCOVER_ARTWORKS_QUERY, {
				filter,
				...options,
			})) as unknown as DiscoverArtworksResponse;

			return result.discoverArtworks;
		},

		/**
		 * Search artworks by text query
		 */
		async searchArtworks(
			query: string,
			filter?: DiscoveryFilter,
			options?: { first?: number; after?: string }
		): Promise<ArtworkConnection> {
			const result = (await baseAdapter.query(SEARCH_ARTWORKS_QUERY, {
				query,
				filter,
				...options,
			})) as unknown as SearchArtworksResponse;

			return result.searchArtworks;
		},

		/**
		 * Search by color palette
		 */
		async colorSearch(colors: string[], options?: ColorSearchOptions): Promise<ArtworkConnection> {
			const result = (await baseAdapter.query(COLOR_SEARCH_QUERY, {
				colors,
				tolerance: options?.tolerance,
				mode: options?.mode,
				first: options?.first,
				after: options?.after,
			})) as unknown as ColorSearchResponse;

			return result.colorSearch;
		},

		/**
		 * Find similar artworks
		 */
		async getSimilarArtworks(artworkId: string, limit?: number): Promise<Artwork[]> {
			const result = (await baseAdapter.query(SIMILAR_ARTWORKS_QUERY, {
				artworkId,
				limit,
			})) as unknown as SimilarArtworksResponse;

			return result.similarArtworks;
		},

		// ========================================================================
		// Commission Operations (Local only per REQ-FED-005)
		// ========================================================================

		/**
		 * Create commission request
		 */
		async createCommission(input: CommissionRequestInput): Promise<Commission> {
			const result = (await baseAdapter.mutate(CREATE_COMMISSION_MUTATION, {
				input,
			})) as unknown as CreateCommissionResponse;

			return result.createCommissionRequest;
		},

		/**
		 * Update commission status
		 */
		async updateCommissionStatus(id: string, status: CommissionStatus): Promise<Commission> {
			// Status updates are handled through specific mutations
			// This is a convenience wrapper
			switch (status) {
				case 'ACCEPTED':
					return this.acceptQuote(id);
				case 'DELIVERED':
					throw new Error('Use deliverCommission() for delivery');
				default:
					throw new Error(`Direct status update to ${status} not supported`);
			}
		},

		/**
		 * Submit quote for commission
		 */
		async submitQuote(commissionId: string, input: QuoteInput): Promise<Commission> {
			const result = (await baseAdapter.mutate(SUBMIT_QUOTE_MUTATION, {
				commissionId,
				input,
			})) as unknown as SubmitQuoteResponse;

			return result.submitQuote;
		},

		/**
		 * Accept quote
		 */
		async acceptQuote(commissionId: string): Promise<Commission> {
			const result = (await baseAdapter.mutate(ACCEPT_QUOTE_MUTATION, {
				commissionId,
			})) as unknown as AcceptQuoteResponse;

			return result.acceptQuote;
		},

		/**
		 * Update commission progress
		 */
		async updateProgress(commissionId: string, input: ProgressInput): Promise<Commission> {
			const result = (await baseAdapter.mutate(UPDATE_PROGRESS_MUTATION, {
				commissionId,
				input,
			})) as unknown as UpdateProgressResponse;

			return result.updateProgress;
		},

		/**
		 * Deliver commission
		 */
		async deliverCommission(commissionId: string, input: DeliveryInput): Promise<Commission> {
			const result = (await baseAdapter.mutate(DELIVER_COMMISSION_MUTATION, {
				commissionId,
				input,
			})) as unknown as DeliverCommissionResponse;

			return result.deliverCommission;
		},

		// ========================================================================
		// Profile Operations
		// ========================================================================

		/**
		 * Get artist profile
		 */
		async getArtistProfile(id: string): Promise<ArtistProfile | null> {
			const result = (await baseAdapter.query(GET_ARTIST_PROFILE_QUERY, {
				id,
			})) as unknown as GetArtistProfileResponse;

			return result.artistProfile;
		},

		/**
		 * Update artist profile
		 */
		async updateArtistProfile(input: ArtistProfileInput): Promise<ArtistProfile> {
			const result = (await baseAdapter.mutate(UPDATE_ARTIST_PROFILE_MUTATION, {
				input,
			})) as unknown as UpdateArtistProfileResponse;

			return result.updateArtistProfile;
		},

		/**
		 * Update portfolio sections
		 */
		async updatePortfolioSections(sections: PortfolioSection[]): Promise<PortfolioSection[]> {
			const result = (await baseAdapter.mutate(UPDATE_PORTFOLIO_SECTIONS_MUTATION, {
				sections,
			})) as unknown as UpdatePortfolioSectionsResponse;

			return result.updatePortfolioSections;
		},

		/**
		 * WebFinger lookup for federated artist discovery (REQ-FED-006)
		 */
		async webFingerLookup(acct: string): Promise<ArtistProfile | null> {
			const result = (await baseAdapter.query(WEBFINGER_LOOKUP_QUERY, {
				acct,
			})) as unknown as WebFingerLookupResponse;

			return result.webFingerLookup;
		},

		/**
		 * Follow remote artist (REQ-FED-007)
		 */
		async followRemoteArtist(uri: string): Promise<boolean> {
			const result = (await baseAdapter.mutate(FOLLOW_REMOTE_ARTIST_MUTATION, {
				uri,
			})) as unknown as FollowRemoteArtistResponse;

			return result.followRemoteArtist.success;
		},
	};
}

// GraphQL document constants (would be imported from generated files in production)
const CREATE_ARTWORK_MUTATION = gql`
	mutation CreateArtwork($input: CreateArtworkInput!) {
		createArtwork(input: $input) {
			success
			artwork {
				id
				uri
				url
				title
			}
			errors
		}
	}
`;

const UPDATE_ARTWORK_MUTATION = gql`
	mutation UpdateArtwork($id: ID!, $input: UpdateArtworkInput!) {
		updateArtwork(id: $id, input: $input) {
			success
			artwork {
				id
				uri
				url
				title
			}
			errors
		}
	}
`;

const DELETE_ARTWORK_MUTATION = gql`
	mutation DeleteArtwork($id: ID!) {
		deleteArtwork(id: $id) {
			success
			deletedId
			errors
		}
	}
`;

const GET_ARTWORK_QUERY = gql`
	query GetArtwork($id: ID!) {
		artwork(id: $id) {
			id
			uri
			url
			title
			description
			content
			account {
				id
				username
				displayName
				avatar
			}
			mediaAttachments {
				id
				url
				previewUrl
				type
				description
			}
			metadata {
				medium
				dimensions
				year
				materials
				style
				colors
				license
				noAI
			}
			stats {
				viewCount
				likeCount
				collectCount
				commentCount
			}
			createdAt
			updatedAt
		}
	}
`;

const GET_ARTWORKS_QUERY = gql`
	query GetArtworks($first: Int, $after: String, $filter: ArtworkFilter) {
		artworks(first: $first, after: $after, filter: $filter) {
			edges {
				cursor
				node {
					id
					uri
					url
					title
					account {
						id
						username
						displayName
					}
					mediaAttachments {
						id
						previewUrl
					}
					stats {
						likeCount
						collectCount
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
			totalCount
		}
	}
`;

const DISCOVER_ARTWORKS_QUERY = gql`
	query DiscoverArtworks($filter: DiscoveryFilter, $first: Int, $after: String) {
		discoverArtworks(filter: $filter, first: $first, after: $after) {
			edges {
				cursor
				node {
					id
					uri
					url
					title
					account {
						id
						username
						displayName
					}
					mediaAttachments {
						id
						previewUrl
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`;

const SEARCH_ARTWORKS_QUERY = gql`
	query SearchArtworks($query: String!, $filter: DiscoveryFilter, $first: Int, $after: String) {
		searchArtworks(query: $query, filter: $filter, first: $first, after: $after) {
			edges {
				cursor
				node {
					id
					uri
					url
					title
					account {
						id
						username
					}
					mediaAttachments {
						id
						previewUrl
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`;

const COLOR_SEARCH_QUERY = gql`
	query ColorSearch(
		$colors: [String!]!
		$tolerance: Int
		$mode: ColorSearchMode
		$first: Int
		$after: String
	) {
		colorSearch(colors: $colors, tolerance: $tolerance, mode: $mode, first: $first, after: $after) {
			edges {
				cursor
				node {
					id
					uri
					url
					title
					mediaAttachments {
						id
						previewUrl
					}
					metadata {
						colors
					}
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
`;

const SIMILAR_ARTWORKS_QUERY = gql`
	query SimilarArtworks($artworkId: ID!, $limit: Int) {
		similarArtworks(artworkId: $artworkId, limit: $limit) {
			id
			uri
			url
			title
			mediaAttachments {
				id
				previewUrl
			}
		}
	}
`;

const CREATE_COMMISSION_MUTATION = gql`
	mutation CreateCommissionRequest($input: CommissionRequestInput!) {
		createCommissionRequest(input: $input) {
			id
			status
			client {
				id
				username
			}
			artist {
				id
				username
			}
			request {
				description
			}
		}
	}
`;

const SUBMIT_QUOTE_MUTATION = gql`
	mutation SubmitQuote($commissionId: ID!, $input: QuoteInput!) {
		submitQuote(commissionId: $commissionId, input: $input) {
			id
			status
			quote {
				price {
					amount
					currency
				}
				estimatedDays
			}
		}
	}
`;

const ACCEPT_QUOTE_MUTATION = gql`
	mutation AcceptQuote($commissionId: ID!) {
		acceptQuote(commissionId: $commissionId) {
			id
			status
		}
	}
`;

const UPDATE_PROGRESS_MUTATION = gql`
	mutation UpdateProgress($commissionId: ID!, $input: ProgressInput!) {
		updateProgress(commissionId: $commissionId, input: $input) {
			id
			status
			progress {
				id
				type
				message
				createdAt
			}
		}
	}
`;

const DELIVER_COMMISSION_MUTATION = gql`
	mutation DeliverCommission($commissionId: ID!, $input: DeliveryInput!) {
		deliverCommission(commissionId: $commissionId, input: $input) {
			id
			status
			delivery {
				id
				files {
					id
					url
				}
			}
		}
	}
`;

const GET_ARTIST_PROFILE_QUERY = gql`
	query GetArtistProfile($id: ID!) {
		artistProfile(id: $id) {
			id
			uri
			account {
				id
				username
				displayName
				avatar
			}
			statement
			badges {
				type
				label
			}
			sections {
				id
				title
				artworks {
					id
					title
					mediaAttachments {
						previewUrl
					}
				}
			}
			stats {
				artworkCount
				followerCount
				followingCount
			}
			acceptingCommissions
		}
	}
`;

const UPDATE_ARTIST_PROFILE_MUTATION = gql`
	mutation UpdateArtistProfile($input: ArtistProfileInput!) {
		updateArtistProfile(input: $input) {
			id
			statement
			acceptingCommissions
		}
	}
`;

const UPDATE_PORTFOLIO_SECTIONS_MUTATION = gql`
	mutation UpdatePortfolioSections($sections: [PortfolioSectionInput!]!) {
		updatePortfolioSections(sections: $sections) {
			id
			title
			order
		}
	}
`;

const WEBFINGER_LOOKUP_QUERY = gql`
	query WebFingerLookup($acct: String!) {
		webFingerLookup(acct: $acct) {
			id
			uri
			account {
				id
				username
				displayName
			}
		}
	}
`;

const FOLLOW_REMOTE_ARTIST_MUTATION = gql`
	mutation FollowRemoteArtist($uri: String!) {
		followRemoteArtist(uri: $uri) {
			success
			relationship {
				following
			}
		}
	}
`;

export type ArtistAdapter = ReturnType<typeof createArtistAdapter>;
