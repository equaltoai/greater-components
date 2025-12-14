/**
 * Accessibility Utilities
 *
 * Focus management, keyboard navigation, and screen reader support utilities.
 * Implements REQ-A11Y-001 through REQ-A11Y-005 for WCAG 2.1 AA compliance.
 *
 * @module @equaltoai/greater-components-artist/utils/accessibility
 */

// ============================================================================
// Focus Management (REQ-A11Y-004)
// ============================================================================

/**
 * Focusable element selectors
 */
const FOCUSABLE_SELECTORS = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
	'[contenteditable="true"]',
	'audio[controls]',
	'video[controls]',
	'details > summary',
].join(', ');

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
	const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
	return Array.from(elements).filter((el) => {
		return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
	});
}

/**
 * Focus trap configuration
 */
export interface FocusTrapConfig {
	/** Container element to trap focus within */
	container: HTMLElement;
	/** Initial element to focus (defaults to first focusable) */
	initialFocus?: HTMLElement | null;
	/** Element to return focus to on deactivation */
	returnFocus?: HTMLElement | null;
	/** Allow escape key to deactivate trap */
	escapeDeactivates?: boolean;
	/** Callback when escape is pressed */
	onEscape?: () => void;
}

/**
 * Focus trap instance
 */
export interface FocusTrap {
	/** Activate the focus trap */
	activate: () => void;
	/** Deactivate the focus trap */
	deactivate: () => void;
	/** Check if trap is active */
	isActive: () => boolean;
}

/**
 * Create a focus trap within a container element
 * Traps focus within modals/dialogs per REQ-A11Y-004
 *
 * @example
 * ```typescript
 * const trap = createFocusTrap({
 *   container: modalElement,
 *   escapeDeactivates: true,
 *   onEscape: () => closeModal()
 * });
 * trap.activate();
 * // Later...
 * trap.deactivate();
 * ```
 */
export function createFocusTrap(config: FocusTrapConfig): FocusTrap {
	const { container, initialFocus, returnFocus, escapeDeactivates = true, onEscape } = config;

	let active = false;
	let previouslyFocused: HTMLElement | null = null;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!active) return;

		if (event.key === 'Escape' && escapeDeactivates) {
			event.preventDefault();
			onEscape?.();
			return;
		}

		if (event.key === 'Tab') {
			const focusable = getFocusableElements(container);
			if (focusable.length === 0) {
				event.preventDefault();
				return;
			}

			const firstFocusable = focusable[0];
			const lastFocusable = focusable[focusable.length - 1];

			if (firstFocusable && lastFocusable) {
				if (event.shiftKey) {
					if (document.activeElement === firstFocusable) {
						event.preventDefault();
						lastFocusable.focus();
					}
				} else {
					if (document.activeElement === lastFocusable) {
						event.preventDefault();
						firstFocusable.focus();
					}
				}
			}
		}
	};

	const handleFocusIn = (event: FocusEvent) => {
		if (!active) return;

		const target = event.target as HTMLElement;
		if (!container.contains(target)) {
			event.preventDefault();
			const focusable = getFocusableElements(container);
			if (focusable.length > 0) {
				const firstFocusable = focusable[0];
				if (firstFocusable) {
					firstFocusable.focus();
				}
			}
		}
	};

	return {
		activate() {
			if (active) return;
			active = true;

			previouslyFocused = document.activeElement as HTMLElement;

			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('focusin', handleFocusIn);

			// Focus initial element or first focusable
			requestAnimationFrame(() => {
				if (initialFocus) {
					initialFocus.focus();
				} else {
					const focusable = getFocusableElements(container);
					if (focusable.length > 0 && focusable[0]) {
						focusable[0].focus();
					} else {
						container.focus();
					}
				}
			});
		},

		deactivate() {
			if (!active) return;
			active = false;

			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('focusin', handleFocusIn);

			// Restore focus
			const elementToFocus = returnFocus || previouslyFocused;
			if (elementToFocus && typeof elementToFocus.focus === 'function') {
				elementToFocus.focus();
			}
		},

		isActive() {
			return active;
		},
	};
}

/**
 * Restore focus to a previously focused element
 * Used after modal close per REQ-A11Y-004
 */
export function restoreFocus(element: HTMLElement | null): void {
	if (element && typeof element.focus === 'function') {
		requestAnimationFrame(() => {
			element.focus();
		});
	}
}

/**
 * Skip link configuration
 */
export interface SkipLinkConfig {
	/** Target element ID to skip to */
	targetId: string;
	/** Link text */
	text?: string;
	/** Custom class name */
	className?: string;
}

/**
 * Create skip link element for keyboard navigation
 * Implements skip links per REQ-A11Y-004
 *
 * @example
 * ```typescript
 * const skipLink = createSkipLink({
 *   targetId: 'main-gallery',
 *   text: 'Skip to gallery'
 * });
 * document.body.prepend(skipLink);
 * ```
 */
export function createSkipLink(config: SkipLinkConfig): HTMLAnchorElement {
	const { targetId, text = 'Skip to main content', className = 'gr-skip-link' } = config;

	const link = document.createElement('a');
	link.href = `#${targetId}`;
	link.className = className;
	link.textContent = text;

	link.addEventListener('click', (event) => {
		event.preventDefault();
		const target = document.getElementById(targetId);
		if (target) {
			target.setAttribute('tabindex', '-1');
			target.focus();
			target.scrollIntoView({ behavior: 'smooth' });
		}
	});

	return link;
}

/**
 * Focus the first interactive element within a container
 */
export function focusFirstInteractive(container: HTMLElement): boolean {
	const focusable = getFocusableElements(container);
	if (focusable.length > 0 && focusable[0]) {
		focusable[0].focus();
		return true;
	}
	return false;
}

// ============================================================================
// Keyboard Navigation (REQ-A11Y-004)
// ============================================================================

/**
 * Grid navigation configuration
 */
export interface GridNavigationConfig {
	/** Container element */
	container: HTMLElement;
	/** Number of columns */
	columns: number;
	/** Selector for grid items */
	itemSelector: string;
	/** Wrap navigation at edges */
	wrap?: boolean;
	/** Callback when item is selected */
	onSelect?: (element: HTMLElement, index: number) => void;
}

/**
 * Create arrow key navigation for gallery grids
 * Implements gallery keyboard navigation per REQ-A11Y-004
 *
 * @example
 * ```typescript
 * const cleanup = createGridNavigation({
 *   container: galleryElement,
 *   columns: 4,
 *   itemSelector: '[data-artwork]',
 *   onSelect: (el, idx) => openViewer(idx)
 * });
 * ```
 */
export function createGridNavigation(config: GridNavigationConfig): () => void {
	const { container, columns, itemSelector, wrap = true, onSelect } = config;

	const getItems = () => Array.from(container.querySelectorAll<HTMLElement>(itemSelector));

	const handleKeyDown = (event: KeyboardEvent) => {
		const items = getItems();
		const currentIndex = items.findIndex((item) => item === document.activeElement);
		if (currentIndex === -1) return;

		let nextIndex = currentIndex;

		switch (event.key) {
			case 'ArrowRight':
				nextIndex = currentIndex + 1;
				if (nextIndex >= items.length) {
					nextIndex = wrap ? 0 : items.length - 1;
				}
				break;
			case 'ArrowLeft':
				nextIndex = currentIndex - 1;
				if (nextIndex < 0) {
					nextIndex = wrap ? items.length - 1 : 0;
				}
				break;
			case 'ArrowDown':
				nextIndex = currentIndex + columns;
				if (nextIndex >= items.length) {
					nextIndex = wrap ? nextIndex % items.length : items.length - 1;
				}
				break;
			case 'ArrowUp':
				nextIndex = currentIndex - columns;
				if (nextIndex < 0) {
					nextIndex = wrap ? items.length + nextIndex : 0;
				}
				break;
			case 'Home':
				nextIndex = 0;
				break;
			case 'End':
				nextIndex = items.length - 1;
				break;
			case 'Enter':
			case ' ': {
				event.preventDefault();
				const selectedItem = items[currentIndex];
				if (selectedItem) {
					onSelect?.(selectedItem, currentIndex);
				}
				return;
			}
			default:
				return;
		}

		event.preventDefault();
		items[nextIndex]?.focus();
	};

	container.addEventListener('keydown', handleKeyDown);

	return () => {
		container.removeEventListener('keydown', handleKeyDown);
	};
}

/**
 * Roving tabindex configuration
 */
export interface RovingTabIndexConfig {
	/** Container element */
	container: HTMLElement;
	/** Selector for items */
	itemSelector: string;
	/** Orientation for arrow key navigation */
	orientation?: 'horizontal' | 'vertical' | 'both';
	/** Initial focused index */
	initialIndex?: number;
}

/**
 * Create roving tabindex for list navigation
 * Only one item in the list is tabbable at a time
 */
export function createRovingTabIndex(config: RovingTabIndexConfig): () => void {
	const { container, itemSelector, orientation = 'vertical', initialIndex = 0 } = config;

	const getItems = () => Array.from(container.querySelectorAll<HTMLElement>(itemSelector));

	const setTabIndex = (items: HTMLElement[], activeIndex: number) => {
		items.forEach((item, index) => {
			item.setAttribute('tabindex', index === activeIndex ? '0' : '-1');
		});
	};

	// Initialize
	const items = getItems();
	setTabIndex(items, initialIndex);

	const handleKeyDown = (event: KeyboardEvent) => {
		const items = getItems();
		const currentIndex = items.findIndex((item) => item === document.activeElement);
		if (currentIndex === -1) return;

		let nextIndex = currentIndex;
		const isHorizontal = orientation === 'horizontal' || orientation === 'both';
		const isVertical = orientation === 'vertical' || orientation === 'both';

		switch (event.key) {
			case 'ArrowRight':
				if (isHorizontal) nextIndex = (currentIndex + 1) % items.length;
				break;
			case 'ArrowLeft':
				if (isHorizontal) nextIndex = (currentIndex - 1 + items.length) % items.length;
				break;
			case 'ArrowDown':
				if (isVertical) nextIndex = (currentIndex + 1) % items.length;
				break;
			case 'ArrowUp':
				if (isVertical) nextIndex = (currentIndex - 1 + items.length) % items.length;
				break;
			case 'Home':
				nextIndex = 0;
				break;
			case 'End':
				nextIndex = items.length - 1;
				break;
			default:
				return;
		}

		if (nextIndex !== currentIndex) {
			event.preventDefault();
			setTabIndex(items, nextIndex);
			items[nextIndex]?.focus();
		}
	};

	container.addEventListener('keydown', handleKeyDown);

	return () => {
		container.removeEventListener('keydown', handleKeyDown);
	};
}

/**
 * Handle escape key press
 */
export function handleEscapeKey(callback: () => void): () => void {
	const handler = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			callback();
		}
	};

	document.addEventListener('keydown', handler);
	return () => document.removeEventListener('keydown', handler);
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
	/** Key to press */
	key: string;
	/** Require Ctrl/Cmd key */
	ctrl?: boolean;
	/** Require Shift key */
	shift?: boolean;
	/** Require Alt key */
	alt?: boolean;
	/** Callback when shortcut is triggered */
	callback: () => void;
	/** Description for help text */
	description?: string;
}

/**
 * Create global keyboard shortcuts
 */
export function createKeyboardShortcuts(shortcuts: KeyboardShortcut[]): () => void {
	const handler = (event: KeyboardEvent) => {
		for (const shortcut of shortcuts) {
			const ctrlMatch = shortcut.ctrl
				? event.ctrlKey || event.metaKey
				: !event.ctrlKey && !event.metaKey;
			const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
			const altMatch = shortcut.alt ? event.altKey : !event.altKey;
			const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

			if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
				event.preventDefault();
				shortcut.callback();
				return;
			}
		}
	};

	document.addEventListener('keydown', handler);
	return () => document.removeEventListener('keydown', handler);
}

// ============================================================================
// Screen Reader Support (REQ-A11Y-005)
// ============================================================================

/**
 * Live region politeness level
 */
export type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

/**
 * Announce message to screen readers via live region
 * Implements screen reader announcements per REQ-A11Y-005
 *
 * @example
 * ```typescript
 * announceToScreenReader('Image loaded successfully');
 * announceToScreenReader('Error: Upload failed', 'assertive');
 * ```
 */
export function announceToScreenReader(
	message: string,
	politeness: LiveRegionPoliteness = 'polite'
): void {
	// Find or create live region
	let liveRegion = document.getElementById('gr-live-region');

	if (!liveRegion) {
		liveRegion = document.createElement('div');
		liveRegion.id = 'gr-live-region';
		liveRegion.setAttribute('aria-live', politeness);
		liveRegion.setAttribute('aria-atomic', 'true');
		liveRegion.className = 'gr-sr-only';
		document.body.appendChild(liveRegion);
	} else {
		liveRegion.setAttribute('aria-live', politeness);
	}

	// Clear and set message (triggers announcement)
	// Clear and set message (triggers announcement)
	if (liveRegion) {
		const region = liveRegion;
		region.textContent = '';
		requestAnimationFrame(() => {
			region.textContent = message;
		});
	}
}

/**
 * Create ARIA description for an element
 */
export function createAriaDescription(element: HTMLElement, description: string): () => void {
	const descId = `desc-${Math.random().toString(36).substring(2, 9)}`;

	const descElement = document.createElement('span');
	descElement.id = descId;
	descElement.className = 'gr-sr-only';
	descElement.textContent = description;

	element.setAttribute('aria-describedby', descId);
	element.parentNode?.insertBefore(descElement, element.nextSibling);

	return () => {
		element.removeAttribute('aria-describedby');
		descElement.remove();
	};
}

/**
 * Generate gallery announcement for screen readers
 * "Gallery, X artworks, row Y of Z"
 */
export function galleryAnnouncement(
	totalArtworks: number,
	currentRow: number,
	totalRows: number,
	galleryName?: string
): string {
	const name = galleryName ? `${galleryName} gallery` : 'Gallery';
	return `${name}, ${totalArtworks} artworks, row ${currentRow} of ${totalRows}`;
}

/**
 * Announce state change to screen readers
 */
export function stateChangeAnnouncement(action: string, item: string, newState: string): string {
	return `${item} ${action}: ${newState}`;
}

// ============================================================================
// Alt Text Utilities (REQ-A11Y-002)
// ============================================================================

/**
 * Alt text validation result
 */
export interface AltTextValidation {
	/** Whether alt text is valid */
	valid: boolean;
	/** Validation errors */
	errors: string[];
	/** Validation warnings */
	warnings: string[];
	/** Suggested improvements */
	suggestions: string[];
}

/**
 * Validate alt text quality
 * Ensures alt text meets accessibility standards per REQ-A11Y-002
 */
export function validateAltText(
	altText: string,
	imageContext?: {
		isDecorative?: boolean;
		isComplex?: boolean;
		hasLongDescription?: boolean;
	}
): AltTextValidation {
	const errors: string[] = [];
	const warnings: string[] = [];
	const suggestions: string[] = [];

	// Check for empty alt text
	if (!altText || altText.trim().length === 0) {
		if (!imageContext?.isDecorative) {
			errors.push('Alt text is required for non-decorative images');
		}
		return { valid: imageContext?.isDecorative ?? false, errors, warnings, suggestions };
	}

	const trimmed = altText.trim();

	// Check for redundant phrases
	const redundantPhrases = ['image of', 'picture of', 'photo of', 'graphic of'];
	for (const phrase of redundantPhrases) {
		if (trimmed.toLowerCase().startsWith(phrase)) {
			warnings.push(
				`Avoid starting with "${phrase}" - screen readers already announce it as an image`
			);
		}
	}

	// Check length
	if (trimmed.length < 10 && !imageContext?.isDecorative) {
		warnings.push('Alt text may be too brief to be descriptive');
	}
	if (trimmed.length > 125) {
		warnings.push('Alt text is long - consider using aria-describedby for detailed descriptions');
	}

	// Check for file names
	if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
		errors.push('Alt text appears to be a file name');
	}

	// Check for placeholder text
	const placeholders = ['placeholder', 'image', 'photo', 'picture', 'untitled'];
	if (placeholders.includes(trimmed.toLowerCase())) {
		errors.push('Alt text appears to be placeholder text');
	}

	// Suggestions for complex images
	if (imageContext?.isComplex && !imageContext?.hasLongDescription) {
		suggestions.push('Consider adding a long description for this complex image');
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		suggestions,
	};
}

/**
 * Generate alt text template for artwork
 * Provides structure for AI-assisted alt text generation per REQ-A11Y-002
 */
export function generateAltTextTemplate(artwork: {
	title?: string;
	artist?: string;
	medium?: string;
	year?: number | string;
	dimensions?: string;
}): string {
	const parts: string[] = [];

	if (artwork.title) {
		parts.push(`"${artwork.title}"`);
	}

	if (artwork.artist) {
		parts.push(`by ${artwork.artist}`);
	}

	if (artwork.medium) {
		parts.push(artwork.medium);
	}

	if (artwork.year) {
		parts.push(`(${artwork.year})`);
	}

	return parts.join(', ') || 'Artwork';
}
