# Module: Build Script Package Array Update

## Type: update

## Files:
[packages/greater-components/scripts/build.js]

## File Changes:
- packages/greater-components/scripts/build.js: BEFORE: <<<
	// Shared
	{ key: 'shared/auth', dir: 'shared/auth' },
	{ key: 'shared/admin', dir: 'shared/admin' },
	{ key: 'shared/compose', dir: 'shared/compose' },
	{ key: 'shared/messaging', dir: 'shared/messaging' },
	{ key: 'shared/search', dir: 'shared/search' },
	{ key: 'shared/notifications', dir: 'shared/notifications' },
	// Faces
>>> | AFTER: <<<
	// Shared
	{ key: 'shared/auth', dir: 'shared/auth' },
	{ key: 'shared/admin', dir: 'shared/admin' },
	{ key: 'shared/compose', dir: 'shared/compose' },
	{ key: 'shared/messaging', dir: 'shared/messaging' },
	{ key: 'shared/search', dir: 'shared/search' },
	{ key: 'shared/notifications', dir: 'shared/notifications' },
	{ key: 'shared/chat', dir: 'shared/chat' },
	// Faces
>>> | TYPE: content replacement | DESC: Add chat package to build script packages array
