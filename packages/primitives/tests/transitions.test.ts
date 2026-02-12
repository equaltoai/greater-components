// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { fadeDown } from '../src/transitions/fadeDown';
import { fadeUp } from '../src/transitions/fadeUp';
import { slideIn } from '../src/transitions/slideIn';
import { scaleIn } from '../src/transitions/scaleIn';

describe('Transitions', () => {
	// Mock element and getComputedStyle
	const mockElement = document.createElement('div');
	mockElement.style.opacity = '1';
	mockElement.style.transform = 'none';

	// We rely on jsdom's getComputedStyle, but we might need to mock it if it doesn't return what we expect.
	// jsdom returns defaults.

	describe('fadeDown', () => {
		it('returns default config', () => {
			const config = fadeDown(mockElement);
			expect(config).toHaveProperty('duration', 250);
			expect(config).toHaveProperty('delay', 0);
			expect(config.tick).toBeInstanceOf(Function);
			expect(config.css).toBeUndefined();

			const animate = Element.prototype.animate as unknown as { mock: { calls: unknown[][] } };
			const keyframes = animate.mock.calls[0]?.[0] as Keyframe[] | undefined;
			expect(keyframes?.[0]).toMatchObject({ opacity: 0, transform: 'translateY(-16px)' });
			expect(keyframes?.[1]).toMatchObject({ opacity: 1, transform: 'translateY(0)' });

			config.tick?.(0.5, 0.5);
			const animation = (animate as unknown as { mock: { results: Array<{ value: unknown }> } }).mock
				.results[0]?.value as { currentTime?: number } | undefined;
			expect(animation?.currentTime).toBe(125);
		});

		it('returns custom config', () => {
			const config = fadeDown(mockElement, { duration: 500, delay: 100, y: 50 });
			expect(config).toHaveProperty('duration', 500);
			expect(config).toHaveProperty('delay', 100);

			const animate = Element.prototype.animate as unknown as { mock: { calls: unknown[][] } };
			const keyframes = animate.mock.calls[0]?.[0] as Keyframe[] | undefined;
			expect(keyframes?.[0]).toMatchObject({ transform: 'translateY(-50px)' });
		});

		it('applies progress via tick', () => {
			const config = fadeDown(mockElement, { y: 20 });
			config.tick?.(0.25, 0.75);

			const animate = Element.prototype.animate as unknown as { mock: { results: Array<{ value: unknown }> } };
			const animation = animate.mock.results[0]?.value as { currentTime?: number } | undefined;
			expect(animation?.currentTime).toBe(62.5);
		});
	});

	describe('fadeUp', () => {
		it('returns default config', () => {
			const config = fadeUp(mockElement);
			expect(config).toHaveProperty('duration', 250);
			expect(config).toHaveProperty('delay', 0);
			expect(config.tick).toBeInstanceOf(Function);
		});

		it('generates correct keyframes', () => {
			const config = fadeUp(mockElement, { y: 20 });
			expect(config.tick).toBeInstanceOf(Function);

			const animate = Element.prototype.animate as unknown as { mock: { calls: unknown[][] } };
			const keyframes = animate.mock.calls[0]?.[0] as Keyframe[] | undefined;
			expect(keyframes?.[0]).toMatchObject({ opacity: 0, transform: 'translateY(20px)' });
			expect(keyframes?.[1]).toMatchObject({ opacity: 1, transform: 'translateY(0)' });
		});
	});

	describe('slideIn', () => {
		it('returns default config', () => {
			const config = slideIn(mockElement);
			expect(config).toHaveProperty('duration', 250);
			expect(config.tick).toBeInstanceOf(Function);
		});

		it('handles x parameter (positive)', () => {
			const config = slideIn(mockElement, { x: 100 });
			const animate = Element.prototype.animate as unknown as { mock: { calls: unknown[][] } };
			const keyframes = animate.mock.calls[0]?.[0] as Keyframe[] | undefined;
			expect(keyframes?.[0]).toMatchObject({ transform: 'translateX(100px)' });
			expect(keyframes?.[1]).toMatchObject({ transform: 'translateX(0)' });
		});

		it('handles opacity parameter', () => {
			const config = slideIn(mockElement, { opacity: false });
			const animate = Element.prototype.animate as unknown as { mock: { calls: unknown[][] } };
			const keyframes = animate.mock.calls[0]?.[0] as Keyframe[] | undefined;
			expect(keyframes?.[0]).toMatchObject({ opacity: 1 });
			expect(keyframes?.[1]).toMatchObject({ opacity: 1 });
		});
	});

	describe('scaleIn', () => {
		it('returns default config', () => {
			const config = scaleIn(mockElement);
			expect(config).toHaveProperty('duration', 250);
			expect(config.tick).toBeInstanceOf(Function);
		});

		it('generates correct keyframes for scale', () => {
			const config = scaleIn(mockElement, { start: 0.5 });
			const animate = Element.prototype.animate as unknown as { mock: { calls: unknown[][] } };
			const keyframes = animate.mock.calls[0]?.[0] as Keyframe[] | undefined;
			expect(keyframes?.[0]).toMatchObject({ transform: 'scale(0.5)' });
			expect(keyframes?.[1]).toMatchObject({ transform: 'scale(1)' });
		});
	});
});
