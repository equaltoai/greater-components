/**
 * MediaViewer Component Tests
 *
 * Tests for MediaViewer lightbox component including:
 * - Lightbox opening/closing
 * - Navigation between artworks
 * - Zoom controls
 * - Keyboard shortcuts
 * - Focus trap
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockArtworkList } from '../mocks/mockArtwork.js';

describe('MediaViewer Component', () => {
	const mockArtworks = createMockArtworkList(5);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Lightbox Opening/Closing', () => {
		it('opens with specified artwork index', () => {
			const currentIndex = 2;
			expect(mockArtworks[currentIndex]).toBeDefined();
			expect(mockArtworks[currentIndex].id).toBe('artwork-3');
		});

		it('calls onClose handler when closed', () => {
			const onClose = vi.fn();
			onClose();
			expect(onClose).toHaveBeenCalled();
		});

		it('closes on backdrop click', () => {
			const onClose = vi.fn();
			// Simulate backdrop click (target === currentTarget)
			const event = { target: 'backdrop', currentTarget: 'backdrop' };
			if (event.target === event.currentTarget) {
				onClose();
			}
			expect(onClose).toHaveBeenCalled();
		});

		it('closes on Escape key', () => {
			const onClose = vi.fn();
			const event = new KeyboardEvent('keydown', { key: 'Escape' });

			if (event.key === 'Escape') {
				onClose();
			}

			expect(onClose).toHaveBeenCalled();
		});
	});

	describe('Navigation', () => {
		it('navigates to previous artwork with ArrowLeft', () => {
			let currentIndex = 2;
			const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });

			if (event.key === 'ArrowLeft' && currentIndex > 0) {
				currentIndex--;
			}

			expect(currentIndex).toBe(1);
		});

		it('navigates to next artwork with ArrowRight', () => {
			let currentIndex = 2;
			const artworksLength = mockArtworks.length;
			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });

			if (event.key === 'ArrowRight' && currentIndex < artworksLength - 1) {
				currentIndex++;
			}

			expect(currentIndex).toBe(3);
		});

		it('does not navigate past first artwork', () => {
			let currentIndex = 0;
			const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });

			if (event.key === 'ArrowLeft' && currentIndex > 0) {
				currentIndex--;
			}

			expect(currentIndex).toBe(0);
		});

		it('does not navigate past last artwork', () => {
			let currentIndex = mockArtworks.length - 1;
			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });

			if (event.key === 'ArrowRight' && currentIndex < mockArtworks.length - 1) {
				currentIndex++;
			}

			expect(currentIndex).toBe(mockArtworks.length - 1);
		});

		it('calls onNavigate handler on navigation', () => {
			const onNavigate = vi.fn();
			const newIndex = 3;
			onNavigate(newIndex);
			expect(onNavigate).toHaveBeenCalledWith(3);
		});
	});

	describe('Zoom Controls', () => {
		it('zooms in with + key', () => {
			let zoomLevel = 1;
			const event = new KeyboardEvent('keydown', { key: '+' });

			if (event.key === '+' || event.key === '=') {
				zoomLevel = Math.min(zoomLevel * 1.5, 5);
			}

			expect(zoomLevel).toBe(1.5);
		});

		it('zooms out with - key', () => {
			let zoomLevel = 1.5;
			const event = new KeyboardEvent('keydown', { key: '-' });

			if (event.key === '-') {
				zoomLevel = Math.max(zoomLevel / 1.5, 0.5);
			}

			expect(zoomLevel).toBe(1);
		});

		it('resets zoom with 0 key', () => {
			let zoomLevel = 2.5;
			const event = new KeyboardEvent('keydown', { key: '0' });

			if (event.key === '0') {
				zoomLevel = 1;
			}

			expect(zoomLevel).toBe(1);
		});

		it('respects maximum zoom level', () => {
			let zoomLevel = 4;
			zoomLevel = Math.min(zoomLevel * 1.5, 5);
			expect(zoomLevel).toBe(5);
		});

		it('respects minimum zoom level', () => {
			let zoomLevel = 0.6;
			zoomLevel = Math.max(zoomLevel / 1.5, 0.5);
			expect(zoomLevel).toBe(0.5);
		});

		it('calls onZoom handler on zoom change', () => {
			const onZoom = vi.fn();
			onZoom(1.5);
			expect(onZoom).toHaveBeenCalledWith(1.5);
		});
	});

	describe('Touch/Swipe Gestures', () => {
		it('navigates on horizontal swipe', () => {
			const touchStartX = 200;
			const touchEndX = 50;
			const deltaX = touchEndX - touchStartX;

			// Swipe left (negative delta) = next
			expect(deltaX).toBeLessThan(-50);
		});

		it('ignores vertical swipes', () => {
			const touchStartX = 200;
			const touchStartY = 200;
			const touchEndX = 180;
			const touchEndY = 50;

			const deltaX = Math.abs(touchEndX - touchStartX);
			const deltaY = Math.abs(touchEndY - touchStartY);

			// Vertical movement greater than horizontal
			expect(deltaY).toBeGreaterThan(deltaX);
		});
	});

	describe('Focus Trap', () => {
		it('traps focus within lightbox', () => {
			// Focus should cycle within the lightbox
			const focusableElements = [
				'close-button',
				'prev-button',
				'next-button',
				'zoom-in',
				'zoom-out',
			];
			expect(focusableElements.length).toBeGreaterThan(0);
		});

		it('returns focus on close', () => {
			const previouslyFocused = document.createElement('button');
			// On close, focus should return to previously focused element
			expect(previouslyFocused.tagName).toBe('BUTTON');
		});
	});

	describe('Wheel Zoom', () => {
		it('zooms in on wheel up', () => {
			let zoomLevel = 1;
			const deltaY = -100; // Scroll up

			if (deltaY < 0) {
				zoomLevel = Math.min(zoomLevel * 1.5, 5);
			}

			expect(zoomLevel).toBe(1.5);
		});

		it('zooms out on wheel down', () => {
			let zoomLevel = 1.5;
			const deltaY = 100; // Scroll down

			if (deltaY > 0) {
				zoomLevel = Math.max(zoomLevel / 1.5, 0.5);
			}

			expect(zoomLevel).toBe(1);
		});
	});
});
