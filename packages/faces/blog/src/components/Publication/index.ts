/**
 * Publication Compound Component
 *
 * Components for publication branding and newsletter workflows.
 *
 * @module @equaltoai/greater-components/faces/blog/Publication
 */

export { default as Root } from './Root.svelte';
export { default as Banner } from './Banner.svelte';
export { default as NewsletterSignup } from './NewsletterSignup.svelte';

export {
	PUBLICATION_CONTEXT_KEY,
	DEFAULT_PUBLICATION_CONFIG,
	createPublicationContext,
	getPublicationContext,
	hasPublicationContext,
} from './context.js';

export type { PublicationContext, PublicationConfig } from './context.js';

export const Publication = {
	Root: {} as typeof import('./Root.svelte').default,
	Banner: {} as typeof import('./Banner.svelte').default,
	NewsletterSignup: {} as typeof import('./NewsletterSignup.svelte').default,
};

// Dynamic imports for tree-shaking
import Root from './Root.svelte';
import Banner from './Banner.svelte';
import NewsletterSignup from './NewsletterSignup.svelte';

Publication.Root = Root;
Publication.Banner = Banner;
Publication.NewsletterSignup = NewsletterSignup;

