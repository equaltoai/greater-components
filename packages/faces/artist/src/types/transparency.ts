/**
 * Transparency Type Definitions
 *
 * Types for AI disclosure, process documentation, and ethical sourcing.
 *
 * @module @equaltoai/greater-components-artist/types/transparency
 */

// ============================================================================
// Process Documentation Types
// ============================================================================

/**
 * Process step media type
 */
export type ProcessMediaType = 'image' | 'video' | 'timelapse' | 'screenshot' | 'sketch';

/**
 * Process step in creative workflow
 */
export interface ProcessStep {
	/** Step identifier */
	id: string;
	/** Step number/order */
	order: number;
	/** Step title */
	title: string;
	/** Step description */
	description: string;
	/** Step type */
	type: 'human' | 'ai' | 'hybrid';
	/** Additional notes */
	notes?: string;
	/** Media attachments */
	media?: {
		type: ProcessMediaType;
		url: string;
		thumbnailUrl?: string;
		caption?: string;
	}[];
	/** Tools used in this step */
	tools?: string[];
	/** AI tools used in this step */
	aiTools?: AITool[];
	/** Duration of this step */
	duration?: string;
	/** Timestamp */
	timestamp?: Date | string;
}

/**
 * AI tool definition (re-exported for convenience)
 */
export interface AITool {
	/** Tool name */
	name: string;
	/** Tool version */
	version?: string;
	/** How the tool was used */
	usage: 'generation' | 'assistance' | 'enhancement' | 'reference';
	/** Description of usage */
	description?: string;
	/** Prompt used (if applicable) */
	prompt?: string;
	/** Settings/parameters used */
	settings?: Record<string, unknown>;
}

/**
 * Process documentation data
 */
export interface ProcessDocumentationData {
	/** Documentation identifier */
	id: string;
	/** Associated artwork ID */
	artworkId: string;
	/** Documentation title */
	title: string;
	/** Overview description */
	overview?: string;
	/** Process steps */
	steps: ProcessStep[];
	/** Total creation time */
	totalTime?: string;
	/** Tools used throughout */
	allTools?: string[];
	/** AI tools used throughout */
	allAITools?: AITool[];
	/** Created date */
	createdAt: Date | string;
	/** Last updated date */
	updatedAt?: Date | string;
}

// ============================================================================
// AI Opt-Out Types
// ============================================================================

/**
 * AI opt-out status
 */
export interface AIOptOutStatus {
	/** Whether opted out of AI training */
	optedOut: boolean;
	/** Date of opt-out decision */
	decisionDate: Date | string;
	/** Platforms opted out from */
	platforms?: string[];
	/** Opt-out method used */
	method?: 'metadata' | 'robots-txt' | 'platform-setting' | 'legal';
	/** Additional notes */
	notes?: string;
}

/**
 * AI opt-out configuration
 */
export interface AIOptOutConfig {
	/** Show opt-out badge on artworks */
	showBadge?: boolean;
	/** Badge position */
	badgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	/** Show detailed status */
	showDetails?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * AI opt-out handlers
 */
export interface AIOptOutHandlers {
	/** Called when opt-out status changes */
	onChange?: (status: AIOptOutStatus) => Promise<void> | void;
	/** Called when more info is requested */
	onLearnMore?: () => void;
}

// ============================================================================
// Ethical Sourcing Types
// ============================================================================

/**
 * Ethical verification level
 */
export type EthicalVerificationLevel = 'self-declared' | 'peer-verified' | 'third-party-verified';

/**
 * Ethical sourcing category
 */
export type EthicalSourcingCategory =
	| 'materials'
	| 'labor'
	| 'environmental'
	| 'cultural'
	| 'ai-ethics';

/**
 * Ethical verification data
 */
export interface EthicalVerification {
	/** Verification identifier */
	id: string;
	/** Verification category */
	category: EthicalSourcingCategory;
	/** Verification level */
	level: EthicalVerificationLevel;
	/** Verification title */
	title: string;
	/** Verification description */
	description: string;
	/** Verifier information */
	verifier?: {
		name: string;
		organization?: string;
		url?: string;
	};
	/** Verification date */
	verifiedAt: Date | string;
	/** Expiration date */
	expiresAt?: Date | string;
	/** Supporting documentation URLs */
	documentation?: string[];
	/** Certification badge URL */
	badgeUrl?: string;
}

/**
 * Ethical sourcing badge configuration
 */
export interface EthicalSourcingBadgeConfig {
	/** Badge size */
	size?: 'sm' | 'md' | 'lg';
	/** Show verification level */
	showLevel?: boolean;
	/** Show verifier */
	showVerifier?: boolean;
	/** Show expiration */
	showExpiration?: boolean;
	/** Enable click for details */
	clickable?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Ethical sourcing handlers
 */
export interface EthicalSourcingHandlers {
	/** Called when badge is clicked */
	onClick?: (verification: EthicalVerification) => void;
	/** Called when documentation is requested */
	onViewDocumentation?: (verification: EthicalVerification) => void;
	/** Called when verification is requested */
	onRequestVerification?: (category: EthicalSourcingCategory) => Promise<void> | void;
}

// ============================================================================
// Transparency Configuration
// ============================================================================

/**
 * Overall transparency configuration
 */
export interface TransparencyConfig {
	/** Show AI disclosure */
	showAIDisclosure?: boolean;
	/** Show process documentation */
	showProcessDocumentation?: boolean;
	/** Show AI opt-out status */
	showAIOptOut?: boolean;
	/** Show ethical sourcing badges */
	showEthicalSourcing?: boolean;
	/** Disclosure detail level */
	detailLevel?: 'minimal' | 'standard' | 'detailed';
	/** Custom CSS class */
	class?: string;
}
