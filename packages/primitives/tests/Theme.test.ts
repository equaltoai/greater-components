import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ContrastChecker from '../src/components/Theme/ContrastChecker.svelte';
import ColorHarmonyPicker from '../src/components/Theme/ColorHarmonyPicker.svelte';
import ThemeWorkbench from '../src/components/Theme/ThemeWorkbench.svelte';

describe('Theme Components', () => {
    describe('ContrastChecker', () => {
        it('renders contrast metrics', () => {
            render(ContrastChecker, {
                foreground: '#000000',
                background: '#ffffff'
            });
            
            expect(screen.getByText('21.00:1')).toBeTruthy();
            expect(screen.getAllByText('Pass').length).toBeGreaterThan(0);
        });
    });
    
    describe('ColorHarmonyPicker', () => {
        it('renders base color swatch', () => {
             render(ColorHarmonyPicker, {
                 seedColor: '#ff0000',
                 harmonyType: 'complementary'
             });
             
             // Base color
             expect(screen.getByTitle('Base Color: #ff0000')).toBeTruthy();
             // Harmony color (cyan for red)
             expect(screen.getByTitle('complementary: #00ffff')).toBeTruthy();
        });
    });

    describe('ThemeWorkbench', () => {
        it('renders workbench interface', () => {
            render(ThemeWorkbench, {
                initialColor: '#3b82f6'
            });
            
            expect(screen.getByText('Theme Controls')).toBeTruthy();
            expect(screen.getByText('Contrast Check')).toBeTruthy();
            expect(screen.getByText('Component Preview')).toBeTruthy();
        });
    });
});
