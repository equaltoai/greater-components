/**
 * Monetization Type Definitions
 *
 * Types for tips, premium features, and institutional accounts.
 *
 * @module @equaltoai/greater-components-artist/types/monetization
 */

// ============================================================================
// Tip Types
// ============================================================================

/**
 * Tip preset amount
 */
export interface TipPreset {
	/** Preset identifier */
	id: string;
	/** Amount */
	amount: number;
	/** Currency */
	currency: string;
	/** Display label */
	label?: string;
	/** Emoji/icon */
	emoji?: string;
}

/**
 * Tip data
 */
export interface TipData {
	/** Tip identifier */
	id: string;
	/** Tipper ID (if not anonymous) */
	tipperId?: string;
	/** Tipper name */
	tipperName?: string;
	/** Recipient artist ID */
	recipientId: string;
	/** Tip amount */
	amount: number;
	/** Currency */
	currency: string;
	/** Optional message */
	message?: string;
	/** Whether tip is anonymous */
	isAnonymous: boolean;
	/** Associated artwork ID (if tipping for specific work) */
	artworkId?: string;
	/** Tip date */
	createdAt: Date | string;
	/** Payment status */
	status: 'pending' | 'completed' | 'failed' | 'refunded';
}

/**
 * Tip jar configuration
 */
export interface TipJarConfig {
	/** Preset amounts */
	presets?: TipPreset[];
	/** Allow custom amounts */
	allowCustomAmount?: boolean;
	/** Minimum amount */
	minAmount?: number;
	/** Maximum amount */
	maxAmount?: number;
	/** Default currency */
	currency?: string;
	/** Allow messages */
	allowMessages?: boolean;
	/** Allow anonymous tips */
	allowAnonymous?: boolean;
	/** Show recent tips */
	showRecentTips?: boolean;
	/** Number of recent tips to show */
	recentTipsCount?: number;
	/** Custom thank you message */
	thankYouMessage?: string;
	/** Custom CSS class */
	class?: string;
}

/**
 * Tip jar handlers
 */
export interface TipJarHandlers {
	/** Called when tip is submitted */
	onTip?: (
		amount: number,
		currency: string,
		message?: string,
		isAnonymous?: boolean
	) => Promise<void> | void;
	/** Called when payment is initiated */
	onPaymentInit?: (amount: number, currency: string) => Promise<{ clientSecret: string }> | void;
	/** Called when payment succeeds */
	onPaymentSuccess?: (tip: TipData) => void;
	/** Called when payment fails */
	onPaymentError?: (error: Error) => void;
}

// ============================================================================
// Premium Types
// ============================================================================

/**
 * Premium tier
 */
export type PremiumTier = 'free' | 'pro' | 'studio' | 'enterprise';

/**
 * Premium feature
 */
export interface PremiumFeature {
	/** Feature identifier */
	id: string;
	/** Feature name */
	name: string;
	/** Feature description */
	description: string;
	/** Icon */
	icon?: string;
	/** Tiers that include this feature */
	includedIn: PremiumTier[];
	/** Usage limit (if applicable) */
	limit?: {
		amount: number;
		period: 'day' | 'week' | 'month' | 'year';
	};
}

/**
 * Premium features configuration
 */
export interface PremiumFeatures {
	/** Current tier */
	currentTier: PremiumTier;
	/** Available features */
	features: PremiumFeature[];
	/** Usage statistics */
	usage?: {
		featureId: string;
		used: number;
		limit: number;
		resetAt?: Date | string;
	}[];
	/** Subscription status */
	subscription?: {
		status: 'active' | 'cancelled' | 'past_due' | 'trialing';
		currentPeriodEnd: Date | string;
		cancelAtPeriodEnd: boolean;
	};
}

/**
 * Premium badge configuration
 */
export interface PremiumBadgeConfig {
	/** Badge size */
	size?: 'sm' | 'md' | 'lg';
	/** Show tier name */
	showTierName?: boolean;
	/** Show features on hover */
	showFeaturesOnHover?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Premium handlers
 */
export interface PremiumHandlers {
	/** Called when upgrade is requested */
	onUpgrade?: (targetTier: PremiumTier) => Promise<void> | void;
	/** Called when downgrade is requested */
	onDowngrade?: (targetTier: PremiumTier) => Promise<void> | void;
	/** Called when subscription is cancelled */
	onCancel?: () => Promise<void> | void;
	/** Called when feature limit is reached */
	onLimitReached?: (featureId: string) => void;
}

// ============================================================================
// Institutional Types
// ============================================================================

/**
 * Institutional account type
 */
export type InstitutionalAccountType = 'gallery' | 'museum' | 'school' | 'collective' | 'agency';

/**
 * Institutional account data
 */
export interface InstitutionalAccount {
	/** Account identifier */
	id: string;
	/** Account type */
	type: InstitutionalAccountType;
	/** Institution name */
	name: string;
	/** Institution description */
	description?: string;
	/** Logo URL */
	logo?: string;
	/** Banner URL */
	banner?: string;
	/** Website */
	website?: string;
	/** Location */
	location?: {
		address?: string;
		city?: string;
		country?: string;
		coordinates?: { lat: number; lng: number };
	};
	/** Contact information */
	contact?: {
		email?: string;
		phone?: string;
		contactPerson?: string;
	};
	/** Associated artists */
	artists?: {
		artistId: string;
		role: 'represented' | 'exhibited' | 'member' | 'faculty';
		since?: Date | string;
	}[];
	/** Current exhibitions */
	exhibitions?: string[];
	/** Verification status */
	isVerified: boolean;
	/** Account creation date */
	createdAt: Date | string;
}

/**
 * Institutional tools configuration
 */
export interface InstitutionalToolsConfig {
	/** Enable artist management */
	enableArtistManagement?: boolean;
	/** Enable exhibition management */
	enableExhibitionManagement?: boolean;
	/** Enable analytics */
	enableAnalytics?: boolean;
	/** Enable bulk operations */
	enableBulkOperations?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Institutional tools handlers
 */
export interface InstitutionalToolsHandlers {
	/** Called when artist is added */
	onAddArtist?: (artistId: string, role: string) => Promise<void> | void;
	/** Called when artist is removed */
	onRemoveArtist?: (artistId: string) => Promise<void> | void;
	/** Called when exhibition is created */
	onCreateExhibition?: (exhibition: Partial<unknown>) => Promise<void> | void;
	/** Called when analytics are requested */
	onViewAnalytics?: () => void;
	/** Called when account is updated */
	onUpdateAccount?: (updates: Partial<InstitutionalAccount>) => Promise<void> | void;
}
