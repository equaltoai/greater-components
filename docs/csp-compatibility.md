# CSP Compatibility Guide

## Overview

Greater Components is designed to work in strict Content Security Policy (CSP) environments, including Lesser deployments that enforce CloudFront CSP headers without `'unsafe-inline'` or `'unsafe-hashes'` directives.

This guide documents the CSP policy constraints, the "no shipped inline styles/scripts" contract, and how to use Greater Components in CSP-restricted environments.

## CSP Policy Definition

### Lesser CloudFront CSP Header

Lesser deployments enforce the following strict CSP configuration:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'nonce-{random}';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.lesser.app;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### Key Constraints

**Requirement 1.2: script-src does not include 'unsafe-inline'**

The `script-src` directive uses nonce-based script loading and does NOT include `'unsafe-inline'`. This means:
- Inline `<script>` tags without a matching nonce are blocked
- Event handler attributes (`onclick`, `onload`, etc.) are blocked
- `javascript:` URLs are blocked

**Requirement 1.3: style-src does not include 'unsafe-inline' or 'unsafe-hashes'**

The `style-src` directive uses nonce-based stylesheet loading and does NOT include `'unsafe-inline'` or `'unsafe-hashes'`. This means:
- Inline `<style>` tags without a matching nonce are blocked
- **`style="..."` attributes on HTML elements are blocked**
- CSS loaded via `@import` without proper nonce is blocked

**Requirement 1.4: style attributes are blocked**

Under this policy, any HTML element with a `style="..."` attribute will have that style declaration ignored by the browser. This is the primary constraint that Greater Components must address.

## No Shipped Inline Styles/Scripts Policy

**Requirement 1.5: Enforceable contract**

Greater Components maintains a strict policy:

> **No shipped components shall emit inline `style` attributes or inline `<script>` tags in their rendered output.**

This policy is:
- **Enforceable**: Automated CSP scanners validate compliance in CI/CD pipelines
- **Comprehensive**: Applies to all components in `packages/primitives`, `packages/faces/*`, and `packages/shared/*`
- **Non-negotiable**: Components that violate this policy are considered ship-blocking bugs

### What This Means

- Components use CSS classes and external stylesheets exclusively
- Dynamic styling is achieved through class toggles, not inline styles
- CSS custom properties (CSS variables) are set via external stylesheets or consumer-provided classes
- Component props that previously accepted arbitrary style values now use preset-based APIs

## Style Prop Support

**Requirement 1.6: style prop is not supported**

Greater Components **do not support** a `style` prop for shipped components. This is an intentional design decision to maintain CSP compliance.

### Why No Style Prop?

```svelte
<!-- ❌ NOT SUPPORTED - Would emit style attribute -->
<Button style="background: red; padding: 20px;" />

<!-- ✅ SUPPORTED - Use class prop with external CSS -->
<Button class="custom-button" />
```

```css
/* Define custom styles in your stylesheet */
.custom-button {
  background: red;
  padding: 20px;
}
```

### Alternative Approaches

If you need custom styling:

1. **Use the `class` prop**: All components accept a `class` prop for custom CSS classes
2. **Use CSS custom properties**: Override design tokens via external CSS
3. **Use preset props**: Many components offer preset-based sizing, spacing, and color options

```svelte
<!-- Use preset props -->
<Skeleton width="1/2" height="lg" />

<!-- Use class prop for custom styling -->
<Avatar class="custom-avatar" />

<!-- Override CSS variables in your stylesheet -->
<Container class="custom-container" />
```

```css
.custom-avatar {
  --gr-avatar-size: 80px;
  border: 2px solid gold;
}

.custom-container {
  --gr-container-custom-gutter: 3rem;
}
```

## Component-Specific CSP Compliance

### Preset-Based APIs

To maintain CSP compliance while providing flexibility, Greater Components use preset-based APIs for common styling needs:

**Skeleton Component**:
```svelte
<!-- Width presets -->
<Skeleton width="full" />
<Skeleton width="1/2" />
<Skeleton width="1/3" />

<!-- Height presets -->
<Skeleton height="xs" />
<Skeleton height="sm" />
<Skeleton height="md" />
```

**Avatar Component**:
```svelte
<!-- Deterministic color classes based on name -->
<Avatar name="John Doe" />
<!-- Renders with consistent color class: gr-avatar--color-N -->
```

**Text Component**:
```svelte
<!-- Bounded line clamping (2-6 lines) -->
<Text truncate lines={3} />
<!-- Emits class: gr-text--clamp-3 -->
```

**Container Component**:
```svelte
<!-- Preset gutters -->
<Container gutter="md" />
<Container gutter="lg" />
```

### Custom Values via External CSS

For values outside preset ranges, use the `class` prop with external CSS:

```svelte
<!-- Component usage -->
<Skeleton class="custom-skeleton" />
<Text class="custom-text" truncate />
<Container class="custom-container" />
```

```css
/* External stylesheet */
.custom-skeleton {
  width: 37.5%;
  height: 2.75rem;
}

.custom-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 10;
  overflow: hidden;
}

.custom-container {
  --gr-container-custom-gutter: 2.5rem;
}
```

## Validation and Enforcement

### Automated CSP Scanner

Greater Components includes an automated CSP scanner (`scripts/audit-csp.mjs`) that validates compliance by scanning both source code and built output for CSP violations.

#### Running the Scanner

```bash
# Run full CSP validation (source + build)
pnpm validate:csp

# Run as part of package validation suite
pnpm validate:package
```

The scanner performs two types of scans:

1. **Source Scan**: Analyzes `.svelte` files in `packages/` for:
   - `style="..."` attributes
   - `style={...}` bindings

2. **Build Scan**: Analyzes built HTML in `apps/docs/build` and `apps/playground/build` for:
   - Inline `style` attributes
   - Inline `<script>` tags (without `src` attribute)

#### Scanner Output

The scanner generates a detailed report including:

- **Summary Statistics**: Total violations, ship-blocking count, follow-up count
- **Ship-Blocking Components**: List of primitive components with violations
- **Source Violations**: File path, line number, column, violation type, code snippet, remediation advice
- **Build Violations**: File path, line number, violation type, HTML snippet

Example output:

```
# CSP Violation Report

Generated: 2025-01-05T12:00:00.000Z

## Summary

- Total Violations: 0
- Ship-Blocking: 0
- Follow-Up: 0

✅ No CSP violations found
```

#### Exit Codes

The scanner uses exit codes for CI/CD integration:

- **Exit 0**: No ship-blocking violations found (build passes)
- **Exit 1**: Ship-blocking violations found (build fails)

Follow-up violations (outside `packages/primitives/src/components/`) do not fail the build but are reported for tracking.

### CI/CD Integration

CSP validation is integrated into the CI/CD pipeline through the `validate:package` script:

```json
{
  "scripts": {
    "validate:csp": "node scripts/audit-csp.mjs",
    "validate:package": "pnpm validate:exports && pnpm validate:dist && pnpm validate:deps && pnpm validate:cli && pnpm validate:tokens && pnpm validate:ids && pnpm validate:csp"
  }
}
```

#### CI Workflow

The validation runs automatically on:

1. **Pull Requests**: Validates that no new CSP violations are introduced
2. **Pre-merge Checks**: Blocks merging if ship-blocking violations exist
3. **Release Builds**: Ensures production artifacts are CSP-compliant

#### Local Development

Run validation before committing:

```bash
# Full validation suite (includes CSP check)
pnpm validate:package

# Quick CSP-only check
pnpm validate:csp

# Run with other quality checks
pnpm lint && pnpm typecheck && pnpm validate:csp
```

### Categorization Rules

The scanner categorizes violations based on file location:

**Ship-Blocking** (fails CI):
- Files in `packages/primitives/src/components/`
- Core components that ship to all consumers

**Follow-Up** (reported but doesn't fail CI):
- Files in `packages/faces/*/src/`
- Files in `packages/shared/*/src/`
- Application code in `apps/`
- Documentation and examples

This allows incremental remediation while preventing new violations in core primitives.

### Fixing Violations

When the scanner reports violations:

1. **Review the Report**: Check file path, line number, and snippet
2. **Apply Remediation**: Follow the suggested remediation approach
3. **Use Presets**: Replace inline styles with preset-based props
4. **Add CSS Classes**: Define styles in component CSS files
5. **Test Compliance**: Re-run scanner to verify fix
6. **Run Property Tests**: Ensure component behavior is preserved

Example remediation:

```svelte
<!-- ❌ Before: CSP violation -->
<div style="width: {width}px; height: {height}px;">
  Content
</div>

<!-- ✅ After: CSP compliant -->
<div class="gr-component {widthClass} {heightClass}">
  Content
</div>
```

```css
/* Add preset classes in component CSS */
.gr-component--width-sm { width: 200px; }
.gr-component--width-md { width: 400px; }
.gr-component--height-sm { height: 100px; }
.gr-component--height-md { height: 200px; }
```

## Migration Guide

For detailed migration instructions from pre-CSP versions, see the [CSP Migration Guide](./csp-migration-guide.md).

### For Component Authors

If you're developing new components or refactoring existing ones:

1. **Never use inline styles**: Use CSS classes exclusively
2. **Use preset-based props**: Define bounded sets of valid values
3. **Document external CSS patterns**: Show users how to customize beyond presets
4. **Test CSP compliance**: Run the scanner and property-based tests

### For Component Users

If you're using Greater Components in a CSP-restricted environment:

1. **Use preset props**: Leverage built-in size, color, and spacing presets
2. **Use class prop for customization**: Apply custom CSS classes for unique styling
3. **Set CSS variables externally**: Override design tokens in your stylesheets
4. **Avoid style prop**: It's not supported and won't work

### Breaking Changes

Components refactored for CSP compliance may have breaking API changes:

- **Skeleton**: `width` and `height` now accept preset strings, not arbitrary numbers
- **Avatar**: Background colors are deterministic based on name hash, not customizable
- **Text**: `lines` prop supports 2-6 only; other values require external CSS
- **Container**: `gutter` accepts preset strings only; custom values require external CSS

See component-specific migration guides for detailed upgrade paths.

## Testing CSP Compliance

### Property-Based Tests

Greater Components uses property-based testing to verify CSP compliance:

```typescript
// Example: Verify no style attributes across all prop combinations
fc.assert(
  fc.property(
    fc.record({
      variant: fc.constantFrom('text', 'circular', 'rectangular'),
      width: fc.option(fc.constantFrom('full', '1/2', '1/3')),
      height: fc.option(fc.constantFrom('xs', 'sm', 'md', 'lg'))
    }),
    (props) => {
      const { container } = render(Skeleton, { props });
      const element = container.querySelector('.gr-skeleton');
      return element && !element.hasAttribute('style');
    }
  ),
  { numRuns: 100 }
);
```

### Manual Testing

To verify CSP compliance in your application:

1. **Enable strict CSP in development**:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self'; script-src 'self';">
```

2. **Check browser console**: Look for CSP violation warnings
3. **Verify visual rendering**: Ensure components render correctly without inline styles
4. **Test dynamic behavior**: Verify interactive components work as expected

## Resources

- [CSP Specification (W3C)](https://www.w3.org/TR/CSP3/)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator (Google)](https://csp-evaluator.withgoogle.com/)
- [Greater Components Testing Guide](./testing-guide.md)

## Support

If you encounter CSP-related issues:

1. Run the CSP scanner to identify violations
2. Check component documentation for preset-based alternatives
3. Review this guide for external CSS patterns
4. Open an issue with CSP violation details and browser console output

Greater Components is committed to maintaining strict CSP compliance for secure, production-ready deployments.
