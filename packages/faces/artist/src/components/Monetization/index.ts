/**
 * Monetization Components
 *
 * Components for tips, premium features, institutional tools, and protection.
 * Implements REQ-ECON-001 through REQ-ECON-006 for artist-friendly economics.
 *
 * @module @equaltoai/greater-components-artist/components/Monetization
 */

// Export individual components
export { default as TipJar } from './TipJar.svelte';
export { default as DirectPurchase } from './DirectPurchase.svelte';
export { default as PremiumBadge } from './PremiumBadge.svelte';
export { default as ProtectionTools } from './ProtectionTools.svelte';
export { default as InstitutionalTools } from './InstitutionalTools.svelte';

// Import components for compound object
import TipJarComponent from './TipJar.svelte';
import DirectPurchaseComponent from './DirectPurchase.svelte';
import PremiumBadgeComponent from './PremiumBadge.svelte';
import ProtectionToolsComponent from './ProtectionTools.svelte';
import InstitutionalToolsComponent from './InstitutionalTools.svelte';

/**
 * Monetization compound component namespace
 *
 * @example
 * ```svelte
 * <script>
 *   import { Monetization } from '@equaltoai/greater-components/faces/artist';
 * </script>
 *
 * <Monetization.TipJar {artist} {config} onTip={handleTip} />
 * <Monetization.DirectPurchase {artwork} {pricing} onPurchase={handlePurchase} />
 * <Monetization.PremiumBadge tier="pro" features={features} />
 * <Monetization.ProtectionTools {artwork} onReport={handleReport} />
 * ```
 */
export const Monetization = {
	TipJar: TipJarComponent,
	DirectPurchase: DirectPurchaseComponent,
	PremiumBadge: PremiumBadgeComponent,
	ProtectionTools: ProtectionToolsComponent,
	InstitutionalTools: InstitutionalToolsComponent,
};
