# API Stability Guarantee

**Version:** 1.0.0  
**Effective:** Release Date  
**Status:** Active  

## Overview

Greater Components follows strict semantic versioning (SemVer) principles and provides comprehensive API stability guarantees for all public interfaces. This document outlines our commitment to backwards compatibility and change management.

## Stability Levels

### Public APIs (Stable)

All APIs marked with `@public` JSDoc tags are considered stable and follow these guarantees:

- **Component Props**: All public component properties maintain backwards compatibility
- **Export Names**: All named exports remain stable
- **TypeScript Types**: Public type definitions maintain structural compatibility
- **CSS Classes**: All component CSS class names prefixed with `gr-` remain stable
- **CSS Custom Properties**: All design tokens prefixed with `--gr-` remain stable

### Internal APIs (Unstable)

- APIs not marked with `@public` are internal and may change without notice
- Implementation details are not covered by stability guarantees
- Private utility functions may be modified or removed

## Breaking Change Policy

### Major Version Changes (x.0.0)

Breaking changes are only allowed in major version releases and will include:

- **Migration Guide**: Comprehensive upgrade instructions
- **Deprecation Period**: Minimum 6 months notice for API removal
- **Automated Tools**: Where possible, codemods for automatic migration
- **Clear Communication**: Detailed changelog and blog post

### Minor Version Changes (1.x.0)

Minor versions are strictly additive:

- New features and components
- New optional properties with sensible defaults
- New TypeScript types and interfaces
- Performance improvements without API changes
- Bug fixes that don't alter public behavior

### Patch Version Changes (1.0.x)

Patch versions contain only:

- Bug fixes maintaining existing behavior
- Security updates
- Documentation improvements
- Internal refactoring without API changes

## Component API Guarantees

### Props Interface Stability

1. **Required Props**: Once established, props cannot become required in minor/patch releases
2. **Optional Props**: New optional props may be added with backwards-compatible defaults
3. **Prop Types**: Type definitions cannot narrow in minor/patch releases
4. **Default Values**: Default values remain consistent unless documented as a bug fix

### Event Interface Stability

1. **Event Names**: All `on*` event handler props maintain consistent naming
2. **Event Payloads**: Event object structures maintain backwards compatibility
3. **Event Timing**: Sequence and timing of events remain consistent

### Slot/Snippet Interface Stability

1. **Slot Names**: All named slots maintain consistent naming
2. **Slot Props**: Data passed to slots maintains structural compatibility
3. **Default Slots**: Default slot behavior remains consistent

## CSS API Guarantees

### Class Name Stability

All CSS classes follow the pattern `gr-{component}[__{element}][--{modifier}]`:

- **Component Classes**: `gr-button`, `gr-modal`, etc. - Always stable
- **Element Classes**: `gr-button__content`, `gr-modal__header`, etc. - Stable for external styling
- **Modifier Classes**: `gr-button--primary`, `gr-modal--lg`, etc. - Stable for external styling

### CSS Custom Properties

Design tokens are guaranteed stable:

- **Token Names**: All `--gr-*` variables maintain consistent naming
- **Token Structure**: Hierarchical token organization remains consistent
- **Token Values**: May change for design improvements, but structure remains

## TypeScript API Guarantees

### Type Definition Stability

1. **Public Types**: All exported types maintain structural compatibility
2. **Generic Constraints**: Type constraints cannot become more restrictive
3. **Interface Extensions**: Interfaces may gain new optional properties
4. **Union Types**: Union types may gain new valid values

### Utility Function Stability

1. **Function Signatures**: All exported functions maintain compatible signatures
2. **Return Types**: Return type structures remain backwards compatible
3. **Error Behavior**: Error conditions and types remain consistent

## Package Structure Guarantees

### Module Exports

1. **Named Exports**: All component and utility exports maintain consistent names
2. **Default Exports**: Where provided, default exports remain stable
3. **Barrel Exports**: Index file exports remain comprehensive and stable
4. **Package Entry Points**: Main package.json entry points remain stable

### Dependency Requirements

1. **Peer Dependencies**: Version ranges may widen but not narrow unexpectedly
2. **Required Dependencies**: New dependencies announced in release notes
3. **Node.js Compatibility**: Supported Node.js versions documented and maintained

## Browser Support Guarantees

### Target Browsers

- **Evergreen Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Accessibility**: WCAG 2.1 AA compliance maintained
- **Progressive Enhancement**: Graceful degradation for older browsers

## Migration Support

### Deprecation Process

1. **Warning Period**: 6 months minimum before removal
2. **Runtime Warnings**: Development-time deprecation warnings
3. **Documentation**: Clear migration paths in documentation
4. **Community Support**: Active support during migration periods

### Migration Tools

- **Codemods**: Automated migration scripts where feasible
- **TypeScript**: Compile-time errors for removed APIs
- **Linting Rules**: ESLint rules for detecting deprecated usage

## Version Support Policy

### Long-term Support (LTS)

- **Current Major**: Full support with regular updates
- **Previous Major**: Security and critical bug fixes for 12 months
- **Older Majors**: Community support only

### End-of-Life Process

1. **6 Month Notice**: Announcement of end-of-life timeline
2. **Security Only**: Final 6 months receive security updates only
3. **Clear Migration Path**: Documentation for upgrading to supported versions

## Exceptions and Limitations

### Security Issues

Security vulnerabilities may require breaking changes in patch releases:

- Changes will be clearly documented
- Migration guidance provided
- Alternative approaches suggested

### Critical Bugs

Severe bugs affecting functionality may require minor breaking changes:

- Impact assessment provided
- Workarounds documented
- Opt-in flags where possible

### Browser Compatibility

Changes in browser implementations may require API adjustments:

- Polyfills provided where possible
- Progressive enhancement maintained
- Clear documentation of changes

## Reporting Issues

### Stability Violations

If you believe an API stability guarantee has been violated:

1. **GitHub Issues**: File an issue with "stability-violation" label
2. **Detailed Report**: Include version numbers, code examples, expected behavior
3. **Priority Response**: Stability issues receive highest priority

### Feedback and Suggestions

- **Discussions**: GitHub Discussions for API feedback
- **RFC Process**: Major changes go through RFC review
- **Community Input**: Public input on proposed breaking changes

---

This stability guarantee is a living document and may be updated to clarify policies or add new guarantees. All updates maintain the spirit of backwards compatibility and clear communication with the community.