/**
 * Federation Utilities
 *
 * ActivityPub helpers for artwork federation.
 * Implements REQ-FED-001 through REQ-FED-009.
 *
 * @module @equaltoai/greater-components-artist/utils/federation
 */

import type { Artwork, ArtworkMetadata, MediaAttachment, Account } from '../types';

// ============================================================================
// ActivityPub Types
// ============================================================================

/**
 * ActivityPub Note object for artwork federation
 * REQ-FED-001: Artwork as ActivityPub Note with Image attachments
 */
export interface ActivityPubNote {
	'@context': string | (string | Record<string, unknown>)[];
	id: string;
	type: 'Note';
	attributedTo: string;
	content: string;
	published: string;
	updated?: string;
	attachment: ActivityPubAttachment[];
	tag?: ActivityPubTag[];
	to: string[];
	cc?: string[];
	sensitive?: boolean;
	summary?: string;
	/**
	 * Artist Face extension for artwork metadata
	 * REQ-FED-003: Metadata federation with graceful degradation
	 */
	'artist:metadata'?: ArtworkMetadataExtension;
	/**
	 * License information
	 * REQ-FED-008: License propagation
	 */
	'artist:license'?: string;
	/**
	 * AI training opt-out flag
	 * REQ-FED-009: AI training opt-out flag federation
	 */
	'artist:noAI'?: boolean;
}

export interface ActivityPubAttachment {
	type: 'Document' | 'Image' | 'Video' | 'Audio';
	mediaType: string;
	url: string;
	name?: string;
	blurhash?: string;
	width?: number;
	height?: number;
}

export interface ActivityPubTag {
	type: 'Hashtag' | 'Mention';
	href: string;
	name: string;
}

/**
 * Extended metadata for artwork federation
 */
export interface ArtworkMetadataExtension {
	medium?: string;
	dimensions?: string;
	year?: number;
	materials?: string[];
	style?: string[];
	colors?: string[];
}

// ============================================================================
// ActivityPub Conversion (REQ-FED-001)
// ============================================================================

/**
 * Convert artwork to ActivityPub Note
 * REQ-FED-001: Artwork as ActivityPub Note with Image attachments
 * REQ-FED-002: Artist attribution preserved in federation
 *
 * @example
 * ```typescript
 * const note = toActivityPubNote(artwork, 'https://instance.social');
 * // Send note to federated instances
 * ```
 */
export function toActivityPubNote(artwork: Artwork, instanceUrl: string): ActivityPubNote {
	const actorUri = `${instanceUrl}/users/${artwork.account.username}`;

	// Build content with title and description
	const content = buildNoteContent(artwork);

	// Convert media attachments
	const attachments = artwork.mediaAttachments.map((media) => mediaToAttachment(media));

	// Extract hashtags from styles
	const tags: ActivityPubTag[] = (artwork.metadata.style || []).map((style) => ({
		type: 'Hashtag',
		href: `${instanceUrl}/tags/${encodeURIComponent(style.toLowerCase().replace(/\s+/g, ''))}`,
		name: `#${style.toLowerCase().replace(/\s+/g, '')}`,
	}));

	return {
		'@context': [
			'https://www.w3.org/ns/activitystreams',
			'https://w3id.org/security/v1',
			{
				artist: 'https://artist.social/ns#',
				'artist:metadata': { '@id': 'artist:metadata', '@type': '@json' },
				'artist:license': 'artist:license',
				'artist:noAI': 'artist:noAI',
			},
		],
		id: artwork.uri,
		type: 'Note',
		attributedTo: actorUri,
		content,
		published: artwork.createdAt,
		updated: artwork.updatedAt || undefined,
		attachment: attachments,
		tag: tags.length > 0 ? tags : undefined,
		to: ['https://www.w3.org/ns/activitystreams#Public'],
		cc: [`${actorUri}/followers`],
		sensitive: false,
		// REQ-FED-003: Metadata federation
		'artist:metadata': serializeMetadata(artwork.metadata),
		// REQ-FED-008: License propagation
		'artist:license': artwork.metadata.license || undefined,
		// REQ-FED-009: AI training opt-out flag
		'artist:noAI': artwork.metadata.noAI,
	};
}

/**
 * Parse ActivityPub Note to artwork
 * REQ-FED-003: Graceful degradation for missing metadata
 *
 * @example
 * ```typescript
 * const artwork = fromActivityPubNote(note);
 * if (artwork) {
 *   // Display federated artwork
 * }
 * ```
 */
export function fromActivityPubNote(
	note: ActivityPubNote,
	_remoteAccount?: Account
): Partial<Artwork> | null {
	try {
		// Extract title from content (first line or summary)
		const { title, description } = parseNoteContent(note.content);

		// Convert attachments to media
		const mediaAttachments = (note.attachment || [])
			.filter((att) => att.type === 'Image' || att.type === 'Document')
			.map((att) => attachmentToMedia(att));

		// Parse metadata with graceful degradation
		const metadata = parseMetadata(note['artist:metadata']);

		// Apply license and noAI from note
		if (note['artist:license']) {
			metadata.license = note['artist:license'];
		}
		if (note['artist:noAI'] !== undefined) {
			metadata.noAI = note['artist:noAI'];
		}

		return {
			uri: note.id,
			url: note.id, // May be overridden by link
			title: title || 'Untitled',
			description,
			content: note.content,
			mediaAttachments,
			metadata,
			createdAt: note.published,
			updatedAt: note.updated,
		};
	} catch (error) {
		console.error('Failed to parse ActivityPub Note:', error);
		return null;
	}
}

// ============================================================================
// URI Generation
// ============================================================================

/**
 * Generate ActivityPub URI for artwork
 *
 * @example
 * ```typescript
 * const uri = generateArtworkUri('https://instance.social', 'alice', '12345');
 * // Returns: https://instance.social/users/alice/artworks/12345
 * ```
 */
export function generateArtworkUri(
	instanceUrl: string,
	username: string,
	artworkId: string
): string {
	return `${instanceUrl}/users/${username}/artworks/${artworkId}`;
}

/**
 * Parse artwork URI to extract components
 */
export function parseArtworkUri(uri: string): {
	instanceUrl: string;
	username: string;
	artworkId: string;
} | null {
	try {
		const url = new URL(uri);
		const pathParts = url.pathname.split('/').filter(Boolean);

		// Expected format: /users/{username}/artworks/{id}
		if (pathParts.length >= 4 && pathParts[0] === 'users' && pathParts[2] === 'artworks') {
			const username = pathParts[1];
			const artworkId = pathParts[3];

			if (username && artworkId) {
				return {
					instanceUrl: `${url.protocol}//${url.host}`,
					username,
					artworkId,
				};
			}
		}

		return null;
	} catch {
		return null;
	}
}

// ============================================================================
// Metadata Serialization (REQ-FED-003)
// ============================================================================

/**
 * Serialize artwork metadata for federation
 * REQ-FED-003: Metadata federation with graceful degradation
 */
export function serializeMetadata(metadata: ArtworkMetadata): ArtworkMetadataExtension {
	return {
		medium: metadata.medium || undefined,
		dimensions: metadata.dimensions || undefined,
		year: metadata.year || undefined,
		materials: metadata.materials?.length ? metadata.materials : undefined,
		style: metadata.style?.length ? metadata.style : undefined,
		colors: metadata.colors?.length ? metadata.colors : undefined,
	};
}

/**
 * Parse federated metadata with graceful degradation
 * REQ-FED-003: Handle missing or malformed metadata gracefully
 */
export function parseMetadata(extension?: ArtworkMetadataExtension): ArtworkMetadata {
	// Default metadata for graceful degradation
	const defaults: ArtworkMetadata = {
		medium: null,
		dimensions: null,
		year: null,
		materials: [],
		style: [],
		colors: [],
		mood: null,
		license: null,
		noAI: false,
	};

	if (!extension) {
		return defaults;
	}

	return {
		...defaults,
		medium: extension.medium || null,
		dimensions: extension.dimensions || null,
		year: extension.year || null,
		materials: extension.materials || [],
		style: extension.style || [],
		colors: extension.colors || [],
	};
}

/**
 * Handle missing metadata gracefully
 * Returns user-friendly placeholder values
 */
export function handleMissingMetadata(metadata: Partial<ArtworkMetadata>): ArtworkMetadata {
	return {
		medium: metadata.medium || null,
		dimensions: metadata.dimensions || null,
		year: metadata.year || null,
		materials: metadata.materials || [],
		style: metadata.style || [],
		colors: metadata.colors || [],
		mood: metadata.mood || null,
		license: metadata.license || null,
		noAI: metadata.noAI ?? false,
	};
}

// ============================================================================
// Rights Federation (REQ-FED-008, REQ-FED-009)
// ============================================================================

/**
 * Serialize license for federation
 * REQ-FED-008: License propagation
 */
export function serializeLicense(license: string | null): string | undefined {
	if (!license) return undefined;

	// Normalize common license identifiers
	const normalized = license.toUpperCase().replace(/\s+/g, '-');

	// Map to SPDX identifiers where possible
	const spdxMap: Record<string, string> = {
		'CC-BY': 'CC-BY-4.0',
		'CC-BY-SA': 'CC-BY-SA-4.0',
		'CC-BY-NC': 'CC-BY-NC-4.0',
		'CC-BY-NC-SA': 'CC-BY-NC-SA-4.0',
		'CC-BY-ND': 'CC-BY-ND-4.0',
		'CC-BY-NC-ND': 'CC-BY-NC-ND-4.0',
		CC0: 'CC0-1.0',
		'ALL-RIGHTS-RESERVED': 'All Rights Reserved',
	};

	return spdxMap[normalized] || license;
}

/**
 * Serialize noAI flag for federation
 * REQ-FED-009: AI training opt-out flag federation
 */
export function serializeNoAI(noAI: boolean): boolean {
	return noAI;
}

/**
 * Parse federated rights information
 */
export function parseRights(note: ActivityPubNote): {
	license: string | null;
	noAI: boolean;
} {
	return {
		license: note['artist:license'] || null,
		noAI: note['artist:noAI'] ?? false,
	};
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build Note content from artwork
 */
function buildNoteContent(artwork: Artwork): string {
	const parts: string[] = [];

	// Title as heading
	if (artwork.title) {
		parts.push(`<p><strong>${escapeHtml(artwork.title)}</strong></p>`);
	}

	// Description
	if (artwork.description) {
		parts.push(`<p>${escapeHtml(artwork.description)}</p>`);
	}

	// Metadata summary
	const metaParts: string[] = [];
	if (artwork.metadata.medium) {
		metaParts.push(artwork.metadata.medium);
	}
	if (artwork.metadata.year) {
		metaParts.push(String(artwork.metadata.year));
	}
	if (artwork.metadata.dimensions) {
		metaParts.push(artwork.metadata.dimensions);
	}

	if (metaParts.length > 0) {
		parts.push(`<p><em>${escapeHtml(metaParts.join(' • '))}</em></p>`);
	}

	// Style hashtags
	if (artwork.metadata.style?.length) {
		const tags = artwork.metadata.style
			.map((s) => `#${s.toLowerCase().replace(/\s+/g, '')}`)
			.join(' ');
		parts.push(`<p>${escapeHtml(tags)}</p>`);
	}

	return parts.join('\n');
}

/**
 * Parse Note content to extract title and description
 */
function parseNoteContent(content: string): {
	title: string | null;
	description: string | null;
} {
	// Simple extraction - first strong/bold text as title
	const titleMatch = content.match(/<strong>([^<]+)<\/strong>/);
	const title = titleMatch ? titleMatch[1] : null;

	// Rest as description - strip HTML tags safely (avoiding ReDoS)
	const stripped = stripHtmlTags(content);
	const description = stripped.replace(/\s+/g, ' ').trim() || null;

	return { title: title ?? null, description: description ?? null };
}

/**
 * Strip HTML tags safely (ReDoS-safe implementation)
 */
function stripHtmlTags(html: string): string {
	// Use a limit on tag length to prevent ReDoS
	let result = '';
	let inTag = false;
	let tagLength = 0;
	const maxTagLength = 1000; // Safety limit

	for (let i = 0; i < html.length; i++) {
		const char = html[i];
		if (char === '<') {
			inTag = true;
			tagLength = 0;
		} else if (char === '>' && inTag) {
			inTag = false;
			result += ' ';
		} else if (!inTag) {
			result += char;
		} else {
			tagLength++;
			// Safety: if tag is too long, it's probably not a real tag
			if (tagLength > maxTagLength) {
				inTag = false;
				result += '<' + html.substring(i - tagLength, i + 1);
			}
		}
	}
	return result;
}

/**
 * Convert media attachment to ActivityPub attachment
 */
function mediaToAttachment(media: MediaAttachment): ActivityPubAttachment {
	return {
		type: media.type === 'video' ? 'Video' : 'Image',
		mediaType: media.type === 'video' ? 'video/mp4' : 'image/jpeg',
		url: media.url,
		name: media.description || undefined,
		blurhash: media.blurhash || undefined,
		width: media.meta?.original?.width,
		height: media.meta?.original?.height,
	};
}

/**
 * Convert ActivityPub attachment to media
 */
function attachmentToMedia(att: ActivityPubAttachment): MediaAttachment {
	return {
		id: att.url, // Use URL as ID for remote media
		type: att.type === 'Video' ? 'video' : 'image',
		url: att.url,
		previewUrl: att.url,
		description: att.name || null,
		blurhash: att.blurhash || null,
		meta:
			att.width && att.height
				? {
						original: { width: att.width, height: att.height },
					}
				: null,
	};
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

// ============================================================================
// Collection Federation (REQ-FED-004)
// ============================================================================

/**
 * ActivityPub Collection for artwork collections
 * REQ-FED-004: Collections as ActivityPub Collection objects
 */
export interface ActivityPubCollection {
	'@context': string;
	id: string;
	type: 'Collection' | 'OrderedCollection';
	totalItems: number;
	first?: string;
	last?: string;
	items?: string[];
}

/**
 * Convert collection to ActivityPub Collection
 * REQ-FED-004: Collections as ActivityPub Collection objects
 */
export function toActivityPubCollection(
	collectionId: string,
	artworkUris: string[],
	totalItems: number
): ActivityPubCollection {
	return {
		'@context': 'https://www.w3.org/ns/activitystreams',
		id: collectionId,
		type: 'OrderedCollection',
		totalItems,
		items: artworkUris,
	};
}
