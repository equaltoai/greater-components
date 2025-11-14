/**
 * Avatar Primitive Tests
 *
 * Comprehensive test suite for the Avatar headless primitive.
 * Tests image loading, fallbacks, status indicators, and accessibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAvatar } from '../src/primitives/avatar';

describe('Avatar Primitive', () => {
	describe('Initialization', () => {
		it('should create with default config', () => {
			const avatar = createAvatar();

			expect(avatar.state.currentSrc).toBe(null);
			expect(avatar.state.loading).toBe(false);
			expect(avatar.state.error).toBe(false);
			expect(avatar.state.showFallback).toBe(true);
			expect(avatar.state.status).toBe(null);
			expect(avatar.state.showStatus).toBe(false);
			expect(avatar.state.size).toBe('md');
			expect(avatar.state.shape).toBe('circle');
			expect(avatar.state.alt).toBe('');
			expect(avatar.state.initials).toBe('');
		});

		it('should initialize with image source', () => {
			const avatar = createAvatar({ src: '/avatar.jpg' });

			expect(avatar.state.currentSrc).toBe('/avatar.jpg');
			expect(avatar.state.loading).toBe(true);
			expect(avatar.state.showFallback).toBe(false);
		});

		it('should initialize with config options', () => {
			const avatar = createAvatar({
				src: '/avatar.jpg',
				alt: 'User avatar',
				initials: 'JD',
				status: 'online',
				showStatus: true,
				size: 'lg',
				shape: 'square',
			});

			expect(avatar.state.alt).toBe('User avatar');
			expect(avatar.state.initials).toBe('JD');
			expect(avatar.state.status).toBe('online');
			expect(avatar.state.showStatus).toBe(true);
			expect(avatar.state.size).toBe('lg');
			expect(avatar.state.shape).toBe('square');
		});
	});

	describe('Image Loading', () => {
		let img: HTMLImageElement;

		beforeEach(() => {
			img = document.createElement('img');
			document.body.appendChild(img);
		});

		afterEach(() => {
			document.body.removeChild(img);
		});

		it('should handle successful image load', () => {
			const onLoad = vi.fn();
			const avatar = createAvatar({ src: '/avatar.jpg', onLoad });
			const action = avatar.actions.image(img);

			expect(avatar.state.loading).toBe(true);
			expect(avatar.state.error).toBe(false);

			img.dispatchEvent(new Event('load'));

			expect(avatar.state.loading).toBe(false);
			expect(avatar.state.error).toBe(false);
			expect(avatar.state.showFallback).toBe(false);
			expect(onLoad).toHaveBeenCalled();

			action.destroy();
		});

		it('should handle image load error', () => {
			const onError = vi.fn();
			const avatar = createAvatar({ src: '/avatar.jpg', onError });
			const action = avatar.actions.image(img);

			img.dispatchEvent(new Event('error'));

			expect(avatar.state.loading).toBe(false);
			expect(avatar.state.error).toBe(true);
			expect(avatar.state.showFallback).toBe(true);
			expect(onError).toHaveBeenCalled();

			action.destroy();
		});

		it('should try fallback image on error', () => {
			const avatar = createAvatar({
				src: '/avatar.jpg',
				fallbackSrc: '/default.jpg',
			});
			const action = avatar.actions.image(img);

			// First image fails
			img.dispatchEvent(new Event('error'));

			expect(avatar.state.currentSrc).toBe('/default.jpg');
			expect(img.src).toContain('/default.jpg');
			expect(avatar.state.showFallback).toBe(false);

			action.destroy();
		});

		it('should show fallback after both images fail', () => {
			const avatar = createAvatar({
				src: '/avatar.jpg',
				fallbackSrc: '/default.jpg',
			});
			const action = avatar.actions.image(img);

			// First image fails, tries fallback
			img.dispatchEvent(new Event('error'));
			expect(avatar.state.currentSrc).toBe('/default.jpg');

			// Fallback also fails
			img.dispatchEvent(new Event('error'));

			expect(avatar.state.showFallback).toBe(true);
			expect(avatar.state.error).toBe(true);

			action.destroy();
		});

		it('should set image attributes', () => {
			const avatar = createAvatar({
				src: '/avatar.jpg',
				alt: 'John Doe',
			});
			const action = avatar.actions.image(img);

			expect(img.src).toContain('/avatar.jpg');
			expect(img.alt).toBe('John Doe');

			action.destroy();
		});
	});

	describe('Status Indicators', () => {
		let container: HTMLDivElement;

		beforeEach(() => {
			container = document.createElement('div');
			document.body.appendChild(container);
		});

		afterEach(() => {
			document.body.removeChild(container);
		});

		it('should set status data attribute', () => {
			const avatar = createAvatar({ status: 'online' });
			const action = avatar.actions.container(container);

			expect(container.getAttribute('data-status')).toBe('online');

			action.destroy();
		});

		it('should update status dynamically', () => {
			const avatar = createAvatar({ status: 'online' });
			const action = avatar.actions.container(container);

			expect(container.getAttribute('data-status')).toBe('online');

			avatar.helpers.setStatus('away');

			expect(avatar.state.status).toBe('away');
			expect(container.getAttribute('data-status')).toBe('away');

			action.destroy();
		});

		it('should remove status attribute when null', () => {
			const avatar = createAvatar({ status: 'online' });
			const action = avatar.actions.container(container);

			avatar.helpers.setStatus(null);

			expect(avatar.state.status).toBe(null);
			expect(container.hasAttribute('data-status')).toBe(false);

			action.destroy();
		});

		it('should support all status values', () => {
			const statuses: Array<'online' | 'offline' | 'away' | 'busy'> = [
				'online',
				'offline',
				'away',
				'busy',
			];
			const avatar = createAvatar();
			const action = avatar.actions.container(container);

			statuses.forEach((status) => {
				avatar.helpers.setStatus(status);
				expect(avatar.state.status).toBe(status);
				expect(container.getAttribute('data-status')).toBe(status);
			});

			action.destroy();
		});
	});

	describe('Size and Shape Variants', () => {
		let container: HTMLDivElement;

		beforeEach(() => {
			container = document.createElement('div');
			document.body.appendChild(container);
		});

		afterEach(() => {
			document.body.removeChild(container);
		});

		it('should set size data attribute', () => {
			const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];

			sizes.forEach((size) => {
				const avatar = createAvatar({ size });
				const action = avatar.actions.container(container);

				expect(container.getAttribute('data-size')).toBe(size);

				action.destroy();
			});
		});

		it('should set shape data attribute', () => {
			const shapes: Array<'circle' | 'square' | 'rounded'> = ['circle', 'square', 'rounded'];

			shapes.forEach((shape) => {
				const avatar = createAvatar({ shape });
				const action = avatar.actions.container(container);

				expect(container.getAttribute('data-shape')).toBe(shape);

				action.destroy();
			});
		});
	});

	describe('Click Handling', () => {
		let container: HTMLDivElement;

		beforeEach(() => {
			container = document.createElement('div');
			document.body.appendChild(container);
		});

		afterEach(() => {
			document.body.removeChild(container);
		});

		it('should handle click events when onClick provided', () => {
			const onClick = vi.fn();
			const avatar = createAvatar({ onClick });
			const action = avatar.actions.container(container);

			expect(container.getAttribute('role')).toBe('button');
			expect(container.getAttribute('tabindex')).toBe('0');

			container.click();

			expect(onClick).toHaveBeenCalled();

			action.destroy();
		});

		it('should handle Enter key', () => {
			const onClick = vi.fn();
			const avatar = createAvatar({ onClick });
			const action = avatar.actions.container(container);

			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
			container.dispatchEvent(event);

			expect(onClick).toHaveBeenCalled();

			action.destroy();
		});

		it('should handle Space key', () => {
			const onClick = vi.fn();
			const avatar = createAvatar({ onClick });
			const action = avatar.actions.container(container);

			const event = new KeyboardEvent('keydown', { key: ' ' });
			Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
			container.dispatchEvent(event);

			expect(onClick).toHaveBeenCalled();

			action.destroy();
		});

		it('should not set button role when onClick not provided', () => {
			const avatar = createAvatar();
			const action = avatar.actions.container(container);

			expect(container.getAttribute('role')).toBe(null);
			expect(container.getAttribute('tabindex')).toBe(null);

			action.destroy();
		});
	});

	describe('Helpers', () => {
		it('should update image source', () => {
			const avatar = createAvatar({ src: '/old.jpg' });

			avatar.helpers.setSrc('/new.jpg');

			expect(avatar.state.currentSrc).toBe('/new.jpg');
			expect(avatar.state.loading).toBe(true);
			expect(avatar.state.error).toBe(false);
			expect(avatar.state.showFallback).toBe(false);
		});

		it('should update DOM when setSrc is called', () => {
			const avatar = createAvatar({ src: '/old.jpg' });
			const img = document.createElement('img');
			const action = avatar.actions.image(img);

			avatar.helpers.setSrc('/new.jpg');

			expect(img.src).toContain('/new.jpg');

			action.destroy();
		});

		it('should reload image with cache busting', () => {
			const avatar = createAvatar({ src: 'https://example.com/avatar.jpg' });
			const img = document.createElement('img');
			const action = avatar.actions.image(img);

			const originalSrc = avatar.state.currentSrc;

			avatar.helpers.reload();

			const newSrc = avatar.state.currentSrc;
			expect(newSrc).not.toBe(originalSrc);
			expect(newSrc).toContain('_reload=');

			action.destroy();
		});

		it('should not reload when no source', () => {
			const avatar = createAvatar();

			avatar.helpers.reload();

			expect(avatar.state.currentSrc).toBe(null);
		});
	});

	describe('Lifecycle', () => {
		it('should call onDestroy when action is destroyed', () => {
			const onDestroy = vi.fn();
			const avatar = createAvatar({ onDestroy });
			const container = document.createElement('div');

			const action = avatar.actions.container(container);
			action.destroy();

			expect(onDestroy).toHaveBeenCalled();
		});

		it('should clean up image event listeners', () => {
			const avatar = createAvatar({ src: '/avatar.jpg' });
			const img = document.createElement('img');
			document.body.appendChild(img);

			const action = avatar.actions.image(img);
			action.destroy();

			// After destroy, events should not affect state
			const stateBefore = { ...avatar.state };
			img.dispatchEvent(new Event('load'));
			img.dispatchEvent(new Event('error'));

			// State should remain unchanged
			expect(avatar.state.loading).toBe(stateBefore.loading);
			expect(avatar.state.error).toBe(stateBefore.error);

			document.body.removeChild(img);
		});
	});

	describe('Accessibility', () => {
		it('should provide alt text for screen readers', () => {
			const avatar = createAvatar({ alt: 'John Doe profile picture' });
			const img = document.createElement('img');
			const action = avatar.actions.image(img);

			expect(img.alt).toBe('John Doe profile picture');

			action.destroy();
		});

		it('should be keyboard accessible when clickable', () => {
			const onClick = vi.fn();
			const avatar = createAvatar({ onClick });
			const container = document.createElement('div');
			const action = avatar.actions.container(container);

			expect(container.getAttribute('role')).toBe('button');
			expect(container.tabIndex).toBe(0);

			action.destroy();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty initials', () => {
			const avatar = createAvatar({ initials: '' });

			expect(avatar.state.initials).toBe('');
		});

		it('should handle missing alt text', () => {
			const avatar = createAvatar();
			const img = document.createElement('img');
			const action = avatar.actions.image(img);

			expect(img.alt).toBe('');

			action.destroy();
		});

		it('should handle rapid source changes', () => {
			const avatar = createAvatar({ src: '/avatar1.jpg' });

			avatar.helpers.setSrc('/avatar2.jpg');
			avatar.helpers.setSrc('/avatar3.jpg');
			avatar.helpers.setSrc('/avatar4.jpg');

			expect(avatar.state.currentSrc).toBe('/avatar4.jpg');
			expect(avatar.state.loading).toBe(true);
		});

		it('should handle status change without container', () => {
			const avatar = createAvatar({ status: 'online' });

			avatar.helpers.setStatus('away');

			expect(avatar.state.status).toBe('away');
		});
	});
});
