/**
 * Reduced Motion Utilities
 *
 * Detection and handling of prefers-reduced-motion preference.
 * Implements REQ-A11Y-007 for motion accessibility.
 *
 * @module @equaltoai/greater-components-artist/utils/reducedMotion
 */

import { applyCspSafeStyles, clearCspSafeStyles } from './cspSafeStyles';

// ============================================================================
// Reduced Motion Detection
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function detectReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create observer for reduced motion preference changes
 */
export function createReducedMotionObserver(
	callback: (prefersReducedMotion: boolean) => void
): () => void {
	if (typeof window === 'undefined') return () => {};

	const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	const handleChange = (event: MediaQueryListEvent) => {
		callback(event.matches);
	};

	mediaQuery.addEventListener('change', handleChange);

	return () => {
		mediaQuery.removeEventListener('change', handleChange);
	};
}

// ============================================================================
// Motion-Safe Animations
// ============================================================================

/**
 * Animation configuration
 */
export interface AnimationConfig {
	/** Animation duration in ms */
	duration: number;
	/** Easing function */
	easing: string;
	/** CSS properties to animate */
	properties: Record<string, string>;
	/** Reduced motion alternative (instant or static) */
	reducedMotionBehavior?: 'instant' | 'static' | 'subtle';
}

/**
 * Create motion-safe animation that respects prefers-reduced-motion
 * Returns appropriate animation based on user preference
 *
 * @example
 * ```typescript
 * const animation = createMotionSafeAnimation({
 *   duration: 300,
 *   easing: 'ease-out',
 *   properties: { opacity: '1', transform: 'translateY(0)' },
 *   reducedMotionBehavior: 'instant'
 * });
 * // In strict CSP mode, avoid inline styles. Prefer WAAPI or external CSS.
 * ```
 */
export function createMotionSafeAnimation(config: AnimationConfig): {
	transition: string;
	duration: number;
	isReduced: boolean;
} {
	const prefersReducedMotion = detectReducedMotion();

	if (prefersReducedMotion) {
		switch (config.reducedMotionBehavior) {
			case 'instant':
				return {
					transition: 'none',
					duration: 0,
					isReduced: true,
				};
			case 'static':
				return {
					transition: 'none',
					duration: 0,
					isReduced: true,
				};
			case 'subtle':
				// Use very short duration for subtle feedback
				return {
					transition: Object.keys(config.properties)
						.map((prop) => `${prop} 50ms linear`)
						.join(', '),
					duration: 50,
					isReduced: true,
				};
			default:
				return {
					transition: 'none',
					duration: 0,
					isReduced: true,
				};
		}
	}

	return {
		transition: Object.keys(config.properties)
			.map((prop) => `${prop} ${config.duration}ms ${config.easing}`)
			.join(', '),
		duration: config.duration,
		isReduced: false,
	};
}

/**
 * Get static alternative for animated content
 * Returns static version when reduced motion is preferred
 */
export function staticAlternative<T>(animatedValue: T, staticValue: T): T {
	return detectReducedMotion() ? staticValue : animatedValue;
}

/**
 * Get instant transition duration
 * Returns 0 when reduced motion is preferred
 */
export function instantTransition(normalDuration: number): number {
	return detectReducedMotion() ? 0 : normalDuration;
}

// ============================================================================
// CSS Helpers
// ============================================================================

/**
 * Generate CSS transition string respecting reduced motion
 */
export function getTransitionCSS(property: string, duration: number, easing = 'ease-out'): string {
	if (detectReducedMotion()) {
		return 'none';
	}
	return `${property} ${duration}ms ${easing}`;
}

/**
 * Generate CSS animation string respecting reduced motion
 */
export function getAnimationCSS(
	name: string,
	duration: number,
	easing = 'ease-out',
	iterations: number | 'infinite' = 1
): string {
	if (detectReducedMotion()) {
		return 'none';
	}
	return `${name} ${duration}ms ${easing} ${iterations}`;
}

// ============================================================================
// Svelte Action for Reduced Motion
// ============================================================================

/**
 * Svelte action parameters for motion-safe animations
 */
export interface MotionSafeParams {
	/** Animation to apply */
	animation: AnimationConfig;
	/** Whether animation is active */
	active?: boolean;
}

/**
 * Svelte action for motion-safe animations
 * Automatically respects prefers-reduced-motion
 *
 * @example
 * ```svelte
 * <div use:motionSafe={{ animation: fadeIn, active: isVisible }}>
 *   Content
 * </div>
 * ```
 */
export function motionSafe(
	node: HTMLElement,
	params: MotionSafeParams
): { update: (params: MotionSafeParams) => void; destroy: () => void } {
	let cleanup: (() => void) | null = null;
	let currentAnimation: Animation | null = null;

	function stop(): void {
		currentAnimation?.cancel();
		currentAnimation = null;
		clearCspSafeStyles(node);
	}

	const applyAnimation = (params: MotionSafeParams) => {
		const { animation, active = true } = params;

		if (!active) {
			stop();
			return;
		}

		const result = createMotionSafeAnimation(animation);
		stop();

		if (result.duration === 0 || typeof node.animate !== 'function') {
			applyCspSafeStyles(node, animation.properties);
			return;
		}

		const easing =
			result.isReduced && animation.reducedMotionBehavior === 'subtle'
				? 'linear'
				: animation.easing;

		currentAnimation = node.animate([{}, animation.properties], {
			duration: result.duration,
			easing,
			fill: 'forwards',
		});

		currentAnimation.addEventListener('finish', () => {
			applyCspSafeStyles(node, animation.properties);
			currentAnimation?.cancel();
			currentAnimation = null;
		});
	};

	// Listen for preference changes
	cleanup = createReducedMotionObserver(() => {
		applyAnimation(params);
	});

	applyAnimation(params);

	return {
		update(newParams: MotionSafeParams) {
			params = newParams;
			applyAnimation(params);
		},
		destroy() {
			cleanup?.();
			stop();
		},
	};
}

// ============================================================================
// Prebuilt Animation Presets
// ============================================================================

/**
 * Fade in animation preset
 */
export const FADE_IN: AnimationConfig = {
	duration: 200,
	easing: 'ease-out',
	properties: { opacity: '1' },
	reducedMotionBehavior: 'instant',
};

/**
 * Fade out animation preset
 */
export const FADE_OUT: AnimationConfig = {
	duration: 200,
	easing: 'ease-in',
	properties: { opacity: '0' },
	reducedMotionBehavior: 'instant',
};

/**
 * Slide up animation preset
 */
export const SLIDE_UP: AnimationConfig = {
	duration: 300,
	easing: 'ease-out',
	properties: { opacity: '1', transform: 'translateY(0)' },
	reducedMotionBehavior: 'instant',
};

/**
 * Scale in animation preset
 */
export const SCALE_IN: AnimationConfig = {
	duration: 200,
	easing: 'ease-out',
	properties: { opacity: '1', transform: 'scale(1)' },
	reducedMotionBehavior: 'instant',
};

/**
 * Gallery reveal animation preset (subtle)
 */
export const GALLERY_REVEAL: AnimationConfig = {
	duration: 400,
	easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
	properties: { opacity: '1', transform: 'translateY(0)' },
	reducedMotionBehavior: 'subtle',
};
