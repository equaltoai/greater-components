/**
 * Publication Component Context
 *
 * Provides shared state and configuration for compound Publication components.
 *
 * @module @equaltoai/greater-components/faces/blog/Publication/context
 */

import { getContext, setContext } from 'svelte';
import type { PublicationConfig, PublicationContext, PublicationData } from '../../types.js';

export const PUBLICATION_CONTEXT_KEY = Symbol('publication-context');

export const DEFAULT_PUBLICATION_CONFIG: Required<PublicationConfig> = {
	showBanner: true,
	showNewsletter: true,
	showSubscriberCount: false,
	class: '',
};

export function createPublicationContext(
	publication: PublicationData,
	config: PublicationConfig = {}
): PublicationContext {
	const context: PublicationContext = {
		get publication() {
			return publication;
		},
		get config() {
			return {
				...DEFAULT_PUBLICATION_CONFIG,
				...config,
			};
		},
	};

	setContext(PUBLICATION_CONTEXT_KEY, context);
	return context;
}

export function getPublicationContext(): PublicationContext {
	const context = getContext<PublicationContext>(PUBLICATION_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Publication context not found. Make sure this component is used within a Publication.Root component.'
		);
	}
	return context;
}

export function hasPublicationContext(): boolean {
	try {
		return !!getContext<PublicationContext>(PUBLICATION_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { PublicationContext, PublicationConfig };
