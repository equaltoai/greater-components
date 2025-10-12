export interface TokenCategory {
	name: string;
	description: string;
	tokens: Token[];
}

export interface Token {
	name: string;
	value: string;
	cssVar: string;
	description?: string;
	preview?: 'color' | 'spacing' | 'typography' | 'shadow' | 'radius';
}

// Generate color swatches
export function generateColorSwatch(color: string): string {
	return `<div class="color-swatch" style="background: ${color}"></div>`;
}

// Generate spacing preview
export function generateSpacingPreview(value: string): string {
	return `<div class="spacing-preview" style="width: ${value}; height: 1rem"></div>`;
}

// Generate typography preview
export function generateTypographyPreview(value: string): string {
	return `<div class="typography-preview" style="font-size: ${value}">Aa</div>`;
}

// Parse tokens from JSON
export function parseTokensFromJSON(tokensJSON: any): TokenCategory[] {
	const categories: TokenCategory[] = [];
	
	// Colors
	if (tokensJSON.colors) {
		const colorTokens: Token[] = [];
		
		Object.entries(tokensJSON.colors).forEach(([key, values]: [string, any]) => {
			if (typeof values === 'object') {
				Object.entries(values).forEach(([shade, value]) => {
					colorTokens.push({
						name: `${key}-${shade}`,
						value: String(value),
						cssVar: `--color-${key}-${shade}`,
						preview: 'color'
					});
				});
			} else {
				colorTokens.push({
					name: key,
					value: values as string,
					cssVar: `--color-${key}`,
					preview: 'color'
				});
			}
		});
		
		categories.push({
			name: 'Colors',
			description: 'Color palette and semantic color tokens',
			tokens: colorTokens
		});
	}
	
	// Spacing
	if (tokensJSON.spacing) {
		const spacingTokens: Token[] = Object.entries(tokensJSON.spacing).map(([key, value]) => ({
			name: key,
			value: String(value),
			cssVar: `--spacing-${key}`,
			preview: 'spacing'
		}));
		
		categories.push({
			name: 'Spacing',
			description: 'Spacing scale for consistent layouts',
			tokens: spacingTokens
		});
	}
	
	// Typography
	if (tokensJSON.typography) {
		const typographyTokens: Token[] = [];
		
		if (tokensJSON.typography.fontSize) {
			Object.entries(tokensJSON.typography.fontSize).forEach(([key, value]) => {
				typographyTokens.push({
					name: `font-size-${key}`,
					value: String(value),
					cssVar: `--font-size-${key}`,
					preview: 'typography'
				});
			});
		}
		
		if (tokensJSON.typography.fontWeight) {
			Object.entries(tokensJSON.typography.fontWeight).forEach(([key, value]) => {
				typographyTokens.push({
					name: `font-weight-${key}`,
					value: String(value),
					cssVar: `--font-weight-${key}`
				});
			});
		}
		
		categories.push({
			name: 'Typography',
			description: 'Typography tokens for text styling',
			tokens: typographyTokens
		});
	}
	
	// Shadows
	if (tokensJSON.shadows) {
		const shadowTokens: Token[] = Object.entries(tokensJSON.shadows).map(([key, value]) => ({
			name: key,
			value: String(value),
			cssVar: `--shadow-${key}`,
			preview: 'shadow'
		}));
		
		categories.push({
			name: 'Shadows',
			description: 'Box shadow tokens for depth and elevation',
			tokens: shadowTokens
		});
	}
	
	// Border Radius
	if (tokensJSON.radius) {
		const radiusTokens: Token[] = Object.entries(tokensJSON.radius).map(([key, value]) => ({
			name: key,
			value: String(value),
			cssVar: `--radius-${key}`,
			preview: 'radius'
		}));
		
		categories.push({
			name: 'Border Radius',
			description: 'Border radius tokens for rounded corners',
			tokens: radiusTokens
		});
	}
	
	return categories;
}

// Generate CSS custom properties
export function generateCSSVariables(categories: TokenCategory[]): string {
	const lines: string[] = [':root {'];
	
	categories.forEach(category => {
		lines.push(`\t/* ${category.name} */`);
		category.tokens.forEach(token => {
			lines.push(`\t${token.cssVar}: ${token.value};`);
		});
		lines.push('');
	});
	
	lines.push('}');
	return lines.join('\n');
}

// Generate SCSS variables
export function generateSCSSVariables(categories: TokenCategory[]): string {
	const lines: string[] = [];
	
	categories.forEach(category => {
		lines.push(`// ${category.name}`);
		category.tokens.forEach(token => {
			const scssVar = `$${token.name}`;
			lines.push(`${scssVar}: ${token.value};`);
		});
		lines.push('');
	});
	
	return lines.join('\n');
}

// Sample token data (would be loaded from actual tokens.json)
export const sampleTokens = {
	colors: {
		primary: {
			'50': '#eff6ff',
			'100': '#dbeafe',
			'200': '#bfdbfe',
			'300': '#93c5fd',
			'400': '#60a5fa',
			'500': '#3b82f6',
			'600': '#2563eb',
			'700': '#1d4ed8',
			'800': '#1e40af',
			'900': '#1e3a8a'
		},
		gray: {
			'50': '#f9fafb',
			'100': '#f3f4f6',
			'200': '#e5e7eb',
			'300': '#d1d5db',
			'400': '#9ca3af',
			'500': '#6b7280',
			'600': '#4b5563',
			'700': '#374151',
			'800': '#1f2937',
			'900': '#111827'
		},
		success: '#10b981',
		warning: '#f59e0b',
		error: '#ef4444',
		info: '#3b82f6'
	},
	spacing: {
		'xs': '0.25rem',
		'sm': '0.5rem',
		'md': '1rem',
		'lg': '1.5rem',
		'xl': '2rem',
		'2xl': '3rem',
		'3xl': '4rem'
	},
	typography: {
		fontSize: {
			'xs': '0.75rem',
			'sm': '0.875rem',
			'base': '1rem',
			'lg': '1.125rem',
			'xl': '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem'
		},
		fontWeight: {
			'light': '300',
			'normal': '400',
			'medium': '500',
			'semibold': '600',
			'bold': '700'
		}
	},
	shadows: {
		'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
		'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
		'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
		'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
		'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
	},
	radius: {
		'none': '0',
		'sm': '0.125rem',
		'base': '0.25rem',
		'md': '0.375rem',
		'lg': '0.5rem',
		'xl': '0.75rem',
		'2xl': '1rem',
		'full': '9999px'
	}
};