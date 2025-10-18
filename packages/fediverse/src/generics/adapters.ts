/**
 * Platform-specific adapters for ActivityPub implementations
 * 
 * These adapters convert platform-specific types (Mastodon, Pleroma, Lesser)
 * to generic ActivityPub types for use in components.
 * 
 * @module @greater/fediverse/generics/adapters
 */

import type {
	ActivityPubActor,
	ActivityPubObject,
	GenericStatus,
	GenericAdapter,
	ActivityPubImage,
	ActivityPubTag,
} from './index.js';
import { parseTimestamp, getVisibility } from './index.js';

/**
 * Mastodon-specific extensions
 */
export interface MastodonExtensions extends Record<string, unknown> {
	/**
	 * Mastodon account fields (profile metadata)
	 */
	fields?: Array<{
		name: string;
		value: string;
		verified_at?: string;
	}>;

	/**
	 * Bot account indicator
	 */
	bot?: boolean;

	/**
	 * Locked account (requires approval to follow)
	 */
	locked?: boolean;

	/**
	 * Account statistics
	 */
	statuses_count?: number;
	followers_count?: number;
	following_count?: number;

	/**
	 * Custom emojis
	 */
	emojis?: Array<{
		shortcode: string;
		url: string;
		static_url: string;
		visible_in_picker: boolean;
	}>;
}

/**
 * Mastodon Status type
 */
export interface MastodonStatus {
	id: string;
	uri: string;
	created_at: string;
	account: {
		id: string;
		username: string;
		acct: string;
		display_name: string;
		avatar: string;
		avatar_static: string;
		header: string;
		header_static: string;
		note: string;
		url: string;
		followers_count: number;
		following_count: number;
		statuses_count: number;
		bot?: boolean;
		locked?: boolean;
		fields?: Array<{ name: string; value: string; verified_at?: string }>;
		emojis?: Array<{ shortcode: string; url: string; static_url: string }>;
	};
	content: string;
	visibility: 'public' | 'unlisted' | 'private' | 'direct';
	sensitive: boolean;
	spoiler_text: string;
	media_attachments: Array<{
		id: string;
		type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown';
		url: string;
		preview_url: string;
		description?: string;
		blurhash?: string;
		meta?: {
			width?: number;
			height?: number;
		};
	}>;
	mentions: Array<{
		id: string;
		username: string;
		acct: string;
		url: string;
	}>;
	tags: Array<{
		name: string;
		url: string;
	}>;
	emojis: Array<{
		shortcode: string;
		url: string;
		static_url: string;
		visible_in_picker: boolean;
	}>;
	reblogs_count: number;
	favourites_count: number;
	replies_count: number;
	url?: string;
	in_reply_to_id?: string;
	in_reply_to_account_id?: string;
	reblog?: MastodonStatus;
	poll?: unknown;
	card?: unknown;
	language?: string;
	text?: string;
	edited_at?: string;
	favourited?: boolean;
	reblogged?: boolean;
	muted?: boolean;
	bookmarked?: boolean;
	pinned?: boolean;
}

/**
 * Mastodon Status Adapter
 * Converts Mastodon API responses to generic ActivityPub types
 */
export class MastodonAdapter implements GenericAdapter<MastodonStatus, GenericStatus> {
	/**
	 * Convert Mastodon status to generic status
	 */
	toGeneric(mastodon: MastodonStatus): GenericStatus {
		// Convert account to ActivityPub actor
		const actor: ActivityPubActor<MastodonExtensions> = {
			id: mastodon.account.url,
			type: 'Person',
			name: mastodon.account.display_name,
			preferredUsername: mastodon.account.username,
			summary: mastodon.account.note,
			icon: {
				type: 'Image',
				url: mastodon.account.avatar,
				mediaType: 'image/jpeg',
			},
			image: {
				type: 'Image',
				url: mastodon.account.header,
				mediaType: 'image/jpeg',
			},
			url: mastodon.account.url,
			extensions: {
				fields: mastodon.account.fields,
				bot: mastodon.account.bot,
				locked: mastodon.account.locked,
				statuses_count: mastodon.account.statuses_count,
				followers_count: mastodon.account.followers_count,
				following_count: mastodon.account.following_count,
				emojis: mastodon.account.emojis?.map(e => ({
					...e,
					visible_in_picker: true
				})),
			},
		};

		// Convert media attachments
		const mediaAttachments: ActivityPubImage[] = mastodon.media_attachments.map((media) => ({
			type: media.type === 'image' ? 'Image' : 'Document',
			url: media.url,
			mediaType: this.getMediaType(media.type),
			name: media.description,
			width: media.meta?.width,
			height: media.meta?.height,
			blurhash: media.blurhash,
		}));

		// Convert mentions
		const mentions: ActivityPubTag[] = mastodon.mentions.map((mention) => ({
			type: 'Mention',
			name: `@${mention.acct}`,
			href: mention.url,
		}));

		// Convert hashtags
		const hashtags: ActivityPubTag[] = mastodon.tags.map((tag) => ({
			type: 'Hashtag',
			name: `#${tag.name}`,
			href: tag.url,
		}));

		// Convert emojis
		const emojis: ActivityPubTag[] = mastodon.emojis.map((emoji) => ({
			type: 'Emoji',
			name: `:${emoji.shortcode}:`,
			icon: {
				type: 'Image',
				url: emoji.url,
				mediaType: 'image/png',
			},
		}));

		// Create ActivityPub object
		const activityPubObject: ActivityPubObject = {
			id: mastodon.uri,
			type: 'Note',
			attributedTo: actor.id,
			content: mastodon.content,
			summary: mastodon.spoiler_text || undefined,
			sensitive: mastodon.sensitive,
			published: mastodon.created_at,
			updated: mastodon.edited_at,
			attachment: mediaAttachments,
			tag: [...mentions, ...hashtags, ...emojis],
			inReplyTo: mastodon.in_reply_to_id,
			url: mastodon.url,
			replies: {
				type: 'Collection',
				totalItems: mastodon.replies_count,
			},
		};

		// Create generic status
		const genericStatus: GenericStatus = {
			id: mastodon.id,
			activityPubObject,
			account: actor,
			content: mastodon.content,
			contentWarning: mastodon.spoiler_text || undefined,
			sensitive: mastodon.sensitive,
			mediaAttachments,
			mentions,
			hashtags,
			emojis,
			createdAt: parseTimestamp(mastodon.created_at),
			updatedAt: mastodon.edited_at ? parseTimestamp(mastodon.edited_at) : undefined,
			repliesCount: mastodon.replies_count,
			reblogsCount: mastodon.reblogs_count,
			favouritesCount: mastodon.favourites_count,
			reblogged: mastodon.reblogged,
			favourited: mastodon.favourited,
			bookmarked: mastodon.bookmarked,
			inReplyToId: mastodon.in_reply_to_id,
			inReplyToAccountId: mastodon.in_reply_to_account_id,
			reblog: mastodon.reblog ? this.toGeneric(mastodon.reblog) : undefined,
			visibility: mastodon.visibility,
			url: mastodon.url,
		};

		return genericStatus;
	}

	/**
	 * Convert generic status back to Mastodon format
	 * Note: This is a simplified conversion and may not include all fields
	 */
	fromGeneric(_generic: GenericStatus): MastodonStatus {
		// This is a placeholder - full implementation would depend on use case
		throw new Error('fromGeneric not fully implemented for MastodonAdapter');
	}

	/**
	 * Validate if object is a Mastodon status
	 */
	validate(raw: unknown): raw is MastodonStatus {
		if (typeof raw !== 'object' || raw === null) return false;
		const obj = raw as Record<string, unknown>;
		return (
			typeof obj['id'] === 'string' &&
			typeof obj['uri'] === 'string' &&
			typeof obj['content'] === 'string' &&
			typeof obj['account'] === 'object'
		);
	}

	/**
	 * Helper: Get media type from Mastodon type
	 */
	private getMediaType(type: string): string {
		switch (type) {
			case 'image':
				return 'image/jpeg';
			case 'video':
				return 'video/mp4';
			case 'gifv':
				return 'video/mp4';
			case 'audio':
				return 'audio/mpeg';
			default:
				return 'application/octet-stream';
		}
	}
}

/**
 * Pleroma Status type (similar to Mastodon with some differences)
 */
export interface PleromaStatus extends MastodonStatus {
	pleroma?: {
		conversation_id?: number;
		direct_conversation_id?: number;
		emoji_reactions?: Array<{
			name: string;
			count: number;
			me: boolean;
			url?: string;
		}>;
		expires_at?: string;
		in_reply_to_account_acct?: string;
		local?: boolean;
		parent_visible?: boolean;
		pinned_at?: string;
		spoiler_text?: {
			'text/plain': string;
		};
		thread_muted?: boolean;
	};
}

/**
 * Pleroma Adapter
 * Extends Mastodon adapter with Pleroma-specific features
 */
export class PleromaAdapter extends MastodonAdapter {
	/**
	 * Convert Pleroma status to generic status
	 * Handles Pleroma-specific extensions like emoji reactions
	 */
	toGeneric(pleroma: PleromaStatus): GenericStatus {
		const generic = super.toGeneric(pleroma);

		// Add Pleroma-specific extensions if present
		if (pleroma.pleroma) {
			generic.activityPubObject.extensions = {
				...generic.activityPubObject.extensions,
				pleroma: pleroma.pleroma,
			};
		}

		return generic;
	}

	/**
	 * Validate if object is a Pleroma status
	 */
	validate(raw: unknown): raw is PleromaStatus {
		// Pleroma statuses are compatible with Mastodon
		return super.validate(raw);
	}
}

/**
 * Lesser (native) status type
 * Uses full ActivityPub objects
 */
export interface LesserStatus {
	/**
	 * The raw ActivityPub object
	 */
	object: ActivityPubObject;

	/**
	 * Metadata added by Lesser
	 */
	metadata?: {
		localId?: string;
		cached?: boolean;
		fetchedAt?: string;
	};
}

/**
 * Lesser Adapter
 * Works with native ActivityPub objects
 */
export class LesserAdapter implements GenericAdapter<LesserStatus, GenericStatus> {
	/**
	 * Convert Lesser status to generic status
	 */
	toGeneric(lesser: LesserStatus): GenericStatus {
		const obj = lesser.object;

		// Extract actor
		const actor: ActivityPubActor = typeof obj.attributedTo === 'string'
			? { id: obj.attributedTo, type: 'Person' }
			: obj.attributedTo;

		// Extract Lesser extensions for direct field population
		const lesserExt = obj.extensions as any;
		const actorExt = actor.extensions as any;

		// Create generic status
		const generic: GenericStatus = {
			id: lesser.metadata?.localId || obj.id,
			activityPubObject: {
				...obj,
				// Only add extensions if there are Lesser fields
				extensions: (lesserExt?.estimatedCost !== undefined || lesserExt?.moderationScore !== undefined || lesserExt?.communityNotes !== undefined || lesserExt?.quoteUrl !== undefined || lesserExt?.quoteable !== undefined || lesserExt?.quotePermissions !== undefined || lesserExt?.quoteContext !== undefined || lesserExt?.quoteCount !== undefined || lesserExt?.aiAnalysis !== undefined)
					? {
						...obj.extensions,
						estimatedCost: lesserExt?.estimatedCost,
						moderationScore: lesserExt?.moderationScore,
						communityNotes: lesserExt?.communityNotes,
						quoteUrl: lesserExt?.quoteUrl,
						quoteable: lesserExt?.quoteable,
						quotePermissions: lesserExt?.quotePermissions,
						quoteContext: lesserExt?.quoteContext,
						quoteCount: lesserExt?.quoteCount,
						aiAnalysis: lesserExt?.aiAnalysis,
					}
					: obj.extensions,
			},
			account: {
				...actor,
				// Only add extensions if there are Lesser fields
				extensions: (actorExt?.trustScore !== undefined || actorExt?.reputation !== undefined || actorExt?.vouches !== undefined)
					? {
						...actor.extensions,
						trustScore: actorExt?.trustScore,
						reputation: actorExt?.reputation,
						vouches: actorExt?.vouches,
					}
					: actor.extensions,
			},
			content: obj.content || '',
			contentWarning: obj.summary,
			sensitive: obj.sensitive || false,
			mediaAttachments: obj.attachment || [],
			mentions: obj.tag?.filter((t) => t.type === 'Mention') || [],
			hashtags: obj.tag?.filter((t) => t.type === 'Hashtag') || [],
			emojis: obj.tag?.filter((t) => t.type === 'Emoji') || [],
			createdAt: parseTimestamp(obj.published),
			updatedAt: obj.updated ? parseTimestamp(obj.updated) : undefined,
			repliesCount: obj.replies?.totalItems || 0,
			reblogsCount: 0, // Would need to fetch from activities
			favouritesCount: 0, // Would need to fetch from activities
			inReplyToId: obj.inReplyTo,
			visibility: getVisibility(obj),
			url: obj.url,
		};

		return generic;
	}

	/**
	 * Convert generic status to Lesser format
	 */
	fromGeneric(generic: GenericStatus): LesserStatus {
		return {
			object: generic.activityPubObject,
			metadata: {
				localId: generic.id,
				fetchedAt: new Date().toISOString(),
			},
		};
	}

	/**
	 * Validate if object is a Lesser status
	 */
	validate(raw: unknown): raw is LesserStatus {
		if (typeof raw !== 'object' || raw === null) return false;
		const obj = raw as Record<string, unknown>;
		return (
			typeof obj['object'] === 'object' &&
			obj['object'] !== null &&
			'id' in (obj['object'] as object) &&
			'type' in (obj['object'] as object)
		);
	}
}

/**
 * Create adapter for a specific platform
 */
export function createAdapter(platform: 'mastodon' | 'pleroma' | 'lesser'): GenericAdapter {
	switch (platform) {
		case 'mastodon':
			return new MastodonAdapter();
		case 'pleroma':
			return new PleromaAdapter();
		case 'lesser':
			return new LesserAdapter();
		default:
			throw new Error(`Unknown platform: ${platform}`);
	}
}

/**
 * Auto-detect platform and create appropriate adapter
 */
export function autoDetectAdapter(raw: unknown): GenericAdapter | null {
	const mastodon = new MastodonAdapter();
	const pleroma = new PleromaAdapter();
	const lesser = new LesserAdapter();

	if (lesser.validate && lesser.validate(raw)) return lesser;
	if (pleroma.validate && pleroma.validate(raw)) return pleroma;
	if (mastodon.validate && mastodon.validate(raw)) return mastodon;

	return null;
}

