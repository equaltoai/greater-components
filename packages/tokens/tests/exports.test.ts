import { describe, expect, it } from 'vitest';
import { tokens, themes } from '../src/index';

describe('token exports', () => {
	it('matches the expected token shape snapshot', () => {
		const structure = {
			tokens: {
				color: Object.fromEntries(
					Object.entries(tokens.color).map(([palette, values]) => [palette, Object.keys(values)])
				),
				typography: {
					fontFamily: Object.keys(tokens.typography.fontFamily),
					fontSize: Object.keys(tokens.typography.fontSize),
					fontWeight: Object.keys(tokens.typography.fontWeight),
					lineHeight: Object.keys(tokens.typography.lineHeight),
				},
				spacingScale: Object.keys(tokens.spacing.scale),
				radii: Object.keys(tokens.radii),
				shadows: Object.keys(tokens.shadows),
				motion: {
					duration: Object.keys(tokens.motion.duration),
					easing: Object.keys(tokens.motion.easing),
				},
			},
			themes: Object.keys(themes),
		};

		expect(structure).toMatchInlineSnapshot(`
			{
			  "themes": [
			    "light",
			    "dark",
			    "highContrast",
			  ],
			  "tokens": {
			    "color": {
			      "base": [
			        "white",
			        "black",
			      ],
			      "error": [
			        "50",
			        "100",
			        "200",
			        "300",
			        "400",
			        "500",
			        "600",
			        "700",
			        "800",
			        "900",
			      ],
			      "gray": [
			        "50",
			        "100",
			        "200",
			        "300",
			        "400",
			        "500",
			        "600",
			        "700",
			        "800",
			        "900",
			        "950",
			      ],
			      "primary": [
			        "50",
			        "100",
			        "200",
			        "300",
			        "400",
			        "500",
			        "600",
			        "700",
			        "800",
			        "900",
			        "950",
			      ],
			      "success": [
			        "50",
			        "100",
			        "200",
			        "300",
			        "400",
			        "500",
			        "600",
			        "700",
			        "800",
			        "900",
			      ],
			      "warning": [
			        "50",
			        "100",
			        "200",
			        "300",
			        "400",
			        "500",
			        "600",
			        "700",
			        "800",
			        "900",
			      ],
			    },
			    "motion": {
			      "duration": [
			        "fast",
			        "base",
			        "slow",
			        "slower",
			      ],
			      "easing": [
			        "linear",
			        "in",
			        "out",
			        "inOut",
			        "decelerate",
			        "accelerate",
			        "standard",
			      ],
			    },
			    "radii": [
			      "none",
			      "sm",
			      "base",
			      "md",
			      "lg",
			      "xl",
			      "2xl",
			      "full",
			    ],
			    "shadows": [
			      "sm",
			      "base",
			      "md",
			      "lg",
			      "xl",
			      "2xl",
			      "inner",
			      "none",
			      "glow-sm",
			      "glow-md",
			      "glow-lg",
			      "glow-primary",
			    ],
			    "spacingScale": [
			      "0",
			      "1",
			      "2",
			      "3",
			      "4",
			      "5",
			      "6",
			      "8",
			      "10",
			      "12",
			      "16",
			      "20",
			      "24",
			      "32",
			    ],
			    "typography": {
			      "fontFamily": [
			        "sans",
			        "heading",
			        "serif",
			        "mono",
			      ],
			      "fontSize": [
			        "xs",
			        "sm",
			        "base",
			        "lg",
			        "xl",
			        "2xl",
			        "3xl",
			        "4xl",
			        "5xl",
			      ],
			      "fontWeight": [
			        "normal",
			        "medium",
			        "semibold",
			        "bold",
			      ],
			      "lineHeight": [
			        "tight",
			        "normal",
			        "relaxed",
			        "loose",
			      ],
			    },
			  },
			}
		`);
	});

	it('retains expected palette and typography values', () => {
		expect(Object.keys(tokens.color.primary)).toEqual([
			'50',
			'100',
			'200',
			'300',
			'400',
			'500',
			'600',
			'700',
			'800',
			'900',
			'950',
		]);

		expect(tokens.color.primary['500'].value).toBe('#3b82f6');
		expect(tokens.typography.fontSize.xl.value).toBe('1.25rem');
		expect(tokens.typography.fontWeight.semibold.value).toBe('600');
		expect(tokens.spacing.scale['4'].value).toBe('1rem');
	});

	it('keeps semantic theme hooks pointing at base tokens', () => {
		expect(themes.light.semantic.background.primary.value).toBe('{color.base.white}');
		expect(themes.dark.semantic.border.default.value).toBe('{color.gray.700}');
		expect(themes.highContrast.semantic.action.primary.default.value).toBe('{color.primary.400}');
	});
});
