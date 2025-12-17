/**
 * Navigation Component Context
 *
 * Provides shared state for blog navigation components like archives and tag clouds.
 *
 * @module @equaltoai/greater-components/faces/blog/Navigation/context
 */

import { getContext, setContext } from 'svelte';
import type { ArchiveEntry, CategoryData, NavigationContext, TagData } from '../../types.js';

export const NAVIGATION_CONTEXT_KEY = Symbol('navigation-context');

export function createNavigationContext(
	archives: ArchiveEntry[] = [],
	tags: TagData[] = [],
	categories: CategoryData[] = [],
	currentPath: string = ''
): NavigationContext {
	const context: NavigationContext = {
		archives,
		tags,
		categories,
		currentPath,
	};

	setContext(NAVIGATION_CONTEXT_KEY, context);
	return context;
}

export function getNavigationContext(): NavigationContext {
	const context = getContext<NavigationContext>(NAVIGATION_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Navigation context not found. Make sure this component is used within a Navigation.Root component.'
		);
	}
	return context;
}

export function hasNavigationContext(): boolean {
	try {
		return !!getContext<NavigationContext>(NAVIGATION_CONTEXT_KEY);
	} catch {
		return false;
	}
}

export type { NavigationContext };
