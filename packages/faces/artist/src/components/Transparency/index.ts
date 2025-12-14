/**
 * Transparency Components
 *
 * Components for AI disclosure, process documentation, and ethical sourcing.
 * Implements REQ-AI-008 through REQ-AI-011 for ethical AI usage transparency.
 *
 * @module @equaltoai/greater-components-artist/components/Transparency
 */

// Export individual components
export { default as AIDisclosure } from './AIDisclosure.svelte';
export { default as ProcessDocumentation } from './ProcessDocumentation.svelte';
export { default as AIOptOutControls } from './AIOptOutControls.svelte';
export { default as EthicalSourcingBadge } from './EthicalSourcingBadge.svelte';

// Import components for compound object
import AIDisclosureComponent from './AIDisclosure.svelte';
import ProcessDocumentationComponent from './ProcessDocumentation.svelte';
import AIOptOutControlsComponent from './AIOptOutControls.svelte';
import EthicalSourcingBadgeComponent from './EthicalSourcingBadge.svelte';

/**
 * Transparency compound component namespace
 *
 * @example
 * ```svelte
 * <script>
 *   import { Transparency } from '@equaltoai/greater-components/faces/artist';
 * </script>
 *
 * <Transparency.AIDisclosure usage={aiUsageData} variant="badge" />
 * <Transparency.ProcessDocumentation steps={processSteps} />
 * <Transparency.AIOptOutControls currentStatus={optOutStatus} onUpdate={handleUpdate} />
 * <Transparency.EthicalSourcingBadge verification={verificationData} />
 * ```
 */
export const Transparency = {
	AIDisclosure: AIDisclosureComponent,
	ProcessDocumentation: ProcessDocumentationComponent,
	AIOptOutControls: AIOptOutControlsComponent,
	EthicalSourcingBadge: EthicalSourcingBadgeComponent,
};
