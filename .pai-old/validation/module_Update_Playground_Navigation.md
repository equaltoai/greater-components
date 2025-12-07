# Module: Update Playground Navigation

## Type: update

## Files:
[apps/playground/src/routes/+layout.svelte]

## File Changes:
- apps/playground/src/routes/+layout.svelte: BEFORE: <<<
```typescript
	import {
		HomeIcon,
		LayersIcon,
		GridIcon,
		PenToolIcon,
		LayoutIcon,
		CpuIcon,
		ImageIcon,
		ActivityIcon,
		MessageSquareIcon,
		Edit3Icon,
		BellIcon,
		UserIcon,
		SettingsIcon,
		SearchIcon,
		BookOpenIcon,
	} from '@equaltoai/greater-components-icons';
```
>>> | AFTER: <<<
```typescript
	import {
		HomeIcon,
		LayersIcon,
		GridIcon,
		PenToolIcon,
		LayoutIcon,
		CpuIcon,
		ImageIcon,
		ActivityIcon,
		MessageSquareIcon,
		MessageCircleIcon,
		Edit3Icon,
		BellIcon,
		UserIcon,
		SettingsIcon,
		SearchIcon,
		BookOpenIcon,
	} from '@equaltoai/greater-components-icons';
```
>>> | TYPE: line edit | DESC: Import MessageCircleIcon for the chat navigation link

- apps/playground/src/routes/+layout.svelte: BEFORE: <<<
```typescript
	const navLinks = [
		{ href: '/', label: 'Overview', icon: HomeIcon },
		{ href: '/docs', label: 'Documentation', icon: BookOpenIcon, external: true },
		{ href: '/status', label: 'Status Card Demo', icon: MessageSquareIcon },
		{ href: '/compose', label: 'Compose Demo', icon: Edit3Icon },
		{ href: '/timeline', label: 'Timeline Demo', icon: ActivityIcon },
		{ href: '/profile', label: 'Profile App', icon: UserIcon },
		{ href: '/settings', label: 'Settings App', icon: SettingsIcon },
		{ href: '/search', label: 'Search App', icon: SearchIcon },
		{ href: '/notifications', label: 'Notifications Demo', icon: BellIcon },
		{ href: '/demos/primitives', label: 'Primitive Suite', icon: LayersIcon },
		{ href: '/demos/button', label: 'Button Patterns', icon: GridIcon },
		{ href: '/demos/forms', label: 'Form Patterns', icon: PenToolIcon },
		{ href: '/demos/layout', label: 'Layout Surfaces', icon: LayoutIcon },
		{ href: '/demos/interactive', label: 'Interactive Suite', icon: CpuIcon },
		{ href: '/demos/icons', label: 'Icon Gallery', icon: ImageIcon },
	] as const satisfies ReadonlyArray<{
```
>>> | AFTER: <<<
```typescript
	const navLinks = [
		{ href: '/', label: 'Overview', icon: HomeIcon },
		{ href: '/docs', label: 'Documentation', icon: BookOpenIcon, external: true },
		{ href: '/chat', label: 'Chat Demo', icon: MessageCircleIcon },
		{ href: '/status', label: 'Status Card Demo', icon: MessageSquareIcon },
		{ href: '/compose', label: 'Compose Demo', icon: Edit3Icon },
		{ href: '/timeline', label: 'Timeline Demo', icon: ActivityIcon },
		{ href: '/profile', label: 'Profile App', icon: UserIcon },
		{ href: '/settings', label: 'Settings App', icon: SettingsIcon },
		{ href: '/search', label: 'Search App', icon: SearchIcon },
		{ href: '/notifications', label: 'Notifications Demo', icon: BellIcon },
		{ href: '/demos/primitives', label: 'Primitive Suite', icon: LayersIcon },
		{ href: '/demos/button', label: 'Button Patterns', icon: GridIcon },
		{ href: '/demos/forms', label: 'Form Patterns', icon: PenToolIcon },
		{ href: '/demos/layout', label: 'Layout Surfaces', icon: LayoutIcon },
		{ href: '/demos/interactive', label: 'Interactive Suite', icon: CpuIcon },
		{ href: '/demos/icons', label: 'Icon Gallery', icon: ImageIcon },
	] as const satisfies ReadonlyArray<{
```
>>> | TYPE: line edit | DESC: Add Chat Demo navigation link after Documentation in the sidebar
