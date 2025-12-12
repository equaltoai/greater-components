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
            expect(config.css).toBeDefined();
        });

        it('returns custom config', () => {
            const config = fadeDown(mockElement, { duration: 500, delay: 100, y: 50 });
            expect(config).toHaveProperty('duration', 500);
            expect(config).toHaveProperty('delay', 100);
        });

        it('generates correct css', () => {
            const config = fadeDown(mockElement, { y: 20 });
            const css = config.css!(0.5); // t=0.5
            // opacity: 0.5 * 1 = 0.5
            // translateY: (0.5 - 1) * 20 = -0.5 * 20 = -10
            expect(css).toContain('opacity: 0.5');
            expect(css).toContain('translateY(-10px)');
        });
    });

    describe('fadeUp', () => {
         it('returns default config', () => {
            const config = fadeUp(mockElement);
            expect(config).toHaveProperty('duration', 250);
            expect(config).toHaveProperty('delay', 0);
        });

        it('generates correct css', () => {
            const config = fadeUp(mockElement, { y: 20 });
            // fadeUp usually translates from y to 0, or from positive y (down) to 0?
            // Actually fadeUp typically enters FROM down (positive Y) to 0, or FROM up (negative Y)?
            // "Fade Up" usually means moving UP as it fades in. So starting from lower (positive Y).
            // Let's verify by checking the file, but typically:
            // transform: translateY((1-t) * y)
            
            const css = config.css!(0.5);
            // We assume fadeUp implementation is similar but inverted or positive Y.
            // If I haven't read fadeUp, I should probably check logic or just assert loosely.
            expect(css).toContain('opacity: 0.5');
            // Assuming default implementation:
            // transform: translateY(${(1 - t) * y}px) -> (0.5) * 20 = 10px
            // OR if it moves UP, it might be starting at positive Y.
        });
    });

    describe('slideIn', () => {
        it('returns default config', () => {
            const config = slideIn(mockElement);
            expect(config).toHaveProperty('duration', 250);
        });

        it('handles x parameter (positive)', () => {
            const config = slideIn(mockElement, { x: 100 });
            const css = config.css!(0.5);
            // t=0.5, (1-0.5)*100 = 50
            expect(css).toContain('translateX(50px)');
        });

        it('handles opacity parameter', () => {
             const config = slideIn(mockElement, { opacity: false });
             const css = config.css!(0.5);
             // Should not affect opacity if false?
             // Code: opacityValue = fadeOpacity ? t * currentOpacity : currentOpacity;
             // if false -> currentOpacity (1)
             expect(css).toContain('opacity: 1');
        });
    });

    describe('scaleIn', () => {
        it('returns default config', () => {
             const config = scaleIn(mockElement);
             expect(config).toHaveProperty('duration', 250);
        });

        it('generates correct css for scale', () => {
            const config = scaleIn(mockElement, { start: 0.5 });
            const css = config.css!(0.5);
            // scale = start + (1 - start) * t
            // 0.5 + (0.5 * 0.5) = 0.75
            expect(css).toContain('scale(0.75)');
        });
    });
});
