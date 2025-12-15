/**
 * Pattern Utilities
 *
 * Shared utilities for pattern implementations.
 *
 * @module @equaltoai/greater-components-artist/patterns/utils
 */

// ============================================================================
// Responsive Breakpoint Utilities
// ============================================================================

/**
 * Breakpoint definitions
 */
export const BREAKPOINTS = {
	xs: 0,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(): Breakpoint {
	if (typeof window === 'undefined') return 'md';

	const width = window.innerWidth;

	if (width >= BREAKPOINTS['2xl']) return '2xl';
	if (width >= BREAKPOINTS.xl) return 'xl';
	if (width >= BREAKPOINTS.lg) return 'lg';
	if (width >= BREAKPOINTS.md) return 'md';
	if (width >= BREAKPOINTS.sm) return 'sm';
	return 'xs';
}

/**
 * Check if current viewport matches breakpoint
 */
export function matchesBreakpoint(breakpoint: Breakpoint, mode: 'min' | 'max' = 'min'): boolean {
	if (typeof window === 'undefined') return false;

	const width = window.innerWidth;
	const breakpointValue = BREAKPOINTS[breakpoint];

	return mode === 'min' ? width >= breakpointValue : width < breakpointValue;
}

/**
 * Create responsive value based on breakpoint
 */
export function responsive<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
	const current = getCurrentBreakpoint();
	const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
	const currentIndex = breakpointOrder.indexOf(current);

	for (let i = currentIndex; i < breakpointOrder.length; i++) {
		const bp = breakpointOrder[i];
		if (bp && values[bp] !== undefined) {
			return values[bp] as T;
		}
	}

	return defaultValue;
}

/**
 * Create breakpoint observer
 */
export function createBreakpointObserver(callback: (breakpoint: Breakpoint) => void): () => void {
	if (typeof window === 'undefined') return () => {};

	let currentBreakpoint = getCurrentBreakpoint();

	const handleResize = () => {
		const newBreakpoint = getCurrentBreakpoint();
		if (newBreakpoint !== currentBreakpoint) {
			currentBreakpoint = newBreakpoint;
			callback(newBreakpoint);
		}
	};

	window.addEventListener('resize', handleResize);

	return () => {
		window.removeEventListener('resize', handleResize);
	};
}

// ============================================================================
// Animation Presets
// ============================================================================

/**
 * Animation preset definitions
 */
export const ANIMATION_PRESETS = {
	fadeIn: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		duration: 200,
		easing: 'ease-out',
	},
	fadeOut: {
		initial: { opacity: 1 },
		animate: { opacity: 0 },
		duration: 200,
		easing: 'ease-in',
	},
	slideUp: {
		initial: { opacity: 0, transform: 'translateY(10px)' },
		animate: { opacity: 1, transform: 'translateY(0)' },
		duration: 300,
		easing: 'ease-out',
	},
	slideDown: {
		initial: { opacity: 0, transform: 'translateY(-10px)' },
		animate: { opacity: 1, transform: 'translateY(0)' },
		duration: 300,
		easing: 'ease-out',
	},
	slideLeft: {
		initial: { opacity: 0, transform: 'translateX(10px)' },
		animate: { opacity: 1, transform: 'translateX(0)' },
		duration: 300,
		easing: 'ease-out',
	},
	slideRight: {
		initial: { opacity: 0, transform: 'translateX(-10px)' },
		animate: { opacity: 1, transform: 'translateX(0)' },
		duration: 300,
		easing: 'ease-out',
	},
	scaleIn: {
		initial: { opacity: 0, transform: 'scale(0.95)' },
		animate: { opacity: 1, transform: 'scale(1)' },
		duration: 200,
		easing: 'ease-out',
	},
	scaleOut: {
		initial: { opacity: 1, transform: 'scale(1)' },
		animate: { opacity: 0, transform: 'scale(0.95)' },
		duration: 200,
		easing: 'ease-in',
	},
} as const;

export type AnimationPreset = keyof typeof ANIMATION_PRESETS;

/**
 * Get animation CSS properties
 */
export function getAnimationStyles(
	preset: AnimationPreset,
	state: 'initial' | 'animate'
): Record<string, string | number> {
	return ANIMATION_PRESETS[preset][state];
}

/**
 * Create staggered animation delays
 */
export function staggerDelay(index: number, baseDelay = 50, maxDelay = 500): number {
	return Math.min(index * baseDelay, maxDelay);
}

// ============================================================================
// Loading State Utilities
// ============================================================================

/**
 * Loading state types
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Loading state with data
 */
export interface LoadingStateData<T> {
	state: LoadingState;
	data: T | null;
	error: Error | null;
	timestamp: number;
}

/**
 * Create initial loading state
 */
export function createLoadingState<T>(initialData: T | null = null): LoadingStateData<T> {
	return {
		state: 'idle',
		data: initialData,
		error: null,
		timestamp: Date.now(),
	};
}

/**
 * Update loading state to loading
 */
export function setLoading<T>(state: LoadingStateData<T>): LoadingStateData<T> {
	return {
		...state,
		state: 'loading',
		error: null,
		timestamp: Date.now(),
	};
}

/**
 * Update loading state to success
 */
export function setSuccess<T>(state: LoadingStateData<T>, data: T): LoadingStateData<T> {
	return {
		...state,
		state: 'success',
		data,
		error: null,
		timestamp: Date.now(),
	};
}

/**
 * Update loading state to error
 */
export function setError<T>(state: LoadingStateData<T>, error: Error): LoadingStateData<T> {
	return {
		...state,
		state: 'error',
		error,
		timestamp: Date.now(),
	};
}

/**
 * Check if state is stale
 */
export function isStale<T>(state: LoadingStateData<T>, maxAge: number): boolean {
	return Date.now() - state.timestamp > maxAge;
}

// ============================================================================
// Error Boundary Utilities
// ============================================================================

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: string | null;
}

/**
 * Create error boundary state
 */
export function createErrorBoundaryState(): ErrorBoundaryState {
	return {
		hasError: false,
		error: null,
		errorInfo: null,
	};
}

/**
 * Handle error in boundary
 */
export function handleBoundaryError(
	_state: ErrorBoundaryState,
	error: Error,
	errorInfo?: string
): ErrorBoundaryState {
	return {
		hasError: true,
		error,
		errorInfo: errorInfo || error.message,
	};
}

/**
 * Reset error boundary
 */
export function resetErrorBoundary(): ErrorBoundaryState {
	return createErrorBoundaryState();
}

/**
 * Create error message for display
 */
export function formatErrorMessage(
	error: unknown,
	fallback = 'An unexpected error occurred'
): string {
	if (!error) return fallback;

	// Don't expose internal error details in production
	if (typeof process !== 'undefined' && process.env['NODE_ENV'] === 'production') {
		return fallback;
	}

	if (typeof error === 'string') {
		return error;
	}

	if (error instanceof Error) {
		return error.message || fallback;
	}

	if (typeof error === 'object' && 'message' in error) {
		return (error as { message: string }).message || fallback;
	}

	return fallback;
}

// ============================================================================
// Composition Utilities
// ============================================================================

/**
 * Compose multiple class names
 */
export function composeClasses(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ');
}

/**
 * Create unique ID for pattern instances
 */
export function createPatternId(prefix: string): string {
	return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle = false;

	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			fn(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}
