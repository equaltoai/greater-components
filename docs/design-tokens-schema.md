# Design Token Schema - Complete Reference

## Purpose

Exact schema for all design tokens to prevent common errors.

## Color Token Scale

### Scale Values (CRITICAL)

Color tokens use these EXACT values (NOT 10, 20, 30...):

- 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

✅ **CORRECT Examples:**

```css
--gr-color-primary-50: #eff6ff --gr-color-primary-100: #dbeafe --gr-color-primary-200: #bfdbfe
	--gr-color-primary-600: #2563eb --gr-color-primary-900: #1e3a8a --gr-color-primary-950: #172554;
```

❌ **INCORRECT Examples (Common Errors):**

```css
--gr-color-primary-10: ... /* WRONG: Should be 50 or 100 */ --gr-color-primary-20: ...
	/* WRONG: Should be 200 */ --gr-color-primary-60: ... /* WRONG: Should be 600 */;
```

### Available Color Families

From `packages/tokens/src/tokens.json`:

- **base**: white, black
- **gray**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **primary**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **success**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **warning**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **error**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **info**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

## Typography Tokens

### Font Weight Values (CRITICAL)

Font weights are standard CSS numeric values (400, 500, 600, 700):

✅ **CORRECT:**

```css
--gr-typography-fontWeight-normal: 400 --gr-typography-fontWeight-medium: 500
	--gr-typography-fontWeight-semibold: 600 --gr-typography-fontWeight-bold: 700;
```

❌ **INCORRECT (Common Error - Missing Zero):**

```css
--gr-typography-fontWeight-normal: 40 /* WRONG: Missing zero */
	--gr-typography-fontWeight-medium: 50 /* WRONG: Missing zero */
	--gr-typography-fontWeight-semibold: 60 /* WRONG: Missing zero */
	--gr-typography-fontWeight-bold: 70 /* WRONG: Missing zero */;
```

### Font Size Scale

Available sizes with exact rem values:

```css
--gr-typography-fontSize-xs: 0.75rem /* 12px */ --gr-typography-fontSize-sm: 0.875rem /* 14px */
	--gr-typography-fontSize-base: 1rem /* 16px */ --gr-typography-fontSize-lg: 1.125rem /* 18px */
	--gr-typography-fontSize-xl: 1.25rem /* 20px */ --gr-typography-fontSize-2xl: 1.5rem /* 24px */
	--gr-typography-fontSize-3xl: 1.875rem /* 30px */ --gr-typography-fontSize-4xl: 2.25rem /* 36px */
	--gr-typography-fontSize-5xl: 3rem /* 48px */;
```

### Line Height Scale

```css
--gr-typography-lineHeight-none: 1 --gr-typography-lineHeight-tight: 1.25
	--gr-typography-lineHeight-snug: 1.375 --gr-typography-lineHeight-normal: 1.5
	--gr-typography-lineHeight-relaxed: 1.625 --gr-typography-lineHeight-loose: 2;
```

### Font Family

```css
--gr-typography-fontFamily-sans:
	'Inter', system-ui, -apple-system, sans-serif --gr-typography-fontFamily-mono: 'Fira Code',
	monospace;
```

## Spacing Tokens

### Spacing Scale

Available spacing values:

```css
--gr-spacing-scale-0: 0 --gr-spacing-scale-0_5: 0.125rem /* 2px */ --gr-spacing-scale-1: 0.25rem
	/* 4px */ --gr-spacing-scale-1_5: 0.375rem /* 6px */ --gr-spacing-scale-2: 0.5rem /* 8px */
	--gr-spacing-scale-2_5: 0.625rem /* 10px */ --gr-spacing-scale-3: 0.75rem /* 12px */
	--gr-spacing-scale-3_5: 0.875rem /* 14px */ --gr-spacing-scale-4: 1rem /* 16px */
	--gr-spacing-scale-5: 1.25rem /* 20px */ --gr-spacing-scale-6: 1.5rem /* 24px */
	--gr-spacing-scale-7: 1.75rem /* 28px */ --gr-spacing-scale-8: 2rem /* 32px */
	--gr-spacing-scale-9: 2.25rem /* 36px */ --gr-spacing-scale-10: 2.5rem /* 40px */
	--gr-spacing-scale-11: 2.75rem /* 44px */ --gr-spacing-scale-12: 3rem /* 48px */
	--gr-spacing-scale-14: 3.5rem /* 56px */ --gr-spacing-scale-16: 4rem /* 64px */
	--gr-spacing-scale-20: 5rem /* 80px */ --gr-spacing-scale-24: 6rem /* 96px */
	--gr-spacing-scale-28: 7rem /* 112px */ --gr-spacing-scale-32: 8rem /* 128px */;
```

Note: Spacing uses `--gr-spacing-scale-{number}` NOT `--gr-spacing-{number}`

## Border Radius Tokens

### Critical: Double 'i' in 'radii'

✅ **CORRECT:**

```css
--gr-radii-none: 0 --gr-radii-sm: 0.125rem --gr-radii-base: 0.25rem --gr-radii-md: 0.375rem
	--gr-radii-lg: 0.5rem --gr-radii-xl: 0.75rem --gr-radii-2xl: 1rem --gr-radii-full: 9999px;
```

❌ **INCORRECT (Common Typo):**

```css
--gr-radi-sm: ... /* WRONG: Missing 'i' - should be 'radii' */ --gr-radi-md: ...
	/* WRONG: Missing 'i' - should be 'radii' */;
```

## Shadow Tokens

Available shadow values:

```css
--gr-shadows-sm
--gr-shadows-base
--gr-shadows-md
--gr-shadows-lg
--gr-shadows-xl
--gr-shadows-2xl
--gr-shadows-inner
--gr-shadows-none
```

## Common Errors & Fixes

### Error 1: Wrong Color Scale

- ❌ Using 10, 20, 30... instead of 50, 100, 200...
- ✅ Always use: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### Error 2: Missing Digit in Font Weights

- ❌ Using 40, 50, 60, 70 instead of 400, 500, 600, 700
- ✅ Font weights are always 3 digits

### Error 3: Typo in 'radii'

- ❌ Using `--gr-radi-*` (missing 'i')
- ✅ Always: `--gr-radii-*` (double 'i')

### Error 4: Wrong Spacing Format

- ❌ Using `--gr-spacing-4` (missing 'scale')
- ✅ Always: `--gr-spacing-scale-4`

### Error 5: Incomplete Hex Colors

- ❌ Truncated hex like `#47569` or `#3415`
- ✅ Always 6 digits: `#475569`, `#334155`
