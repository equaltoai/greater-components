// Type imports and exports
import type { ComponentProps } from 'svelte';
export type { ComponentProps } from 'svelte';

// Component exports
export { default as Button } from './components/Button.svelte';
export { default as TextField } from './components/TextField.svelte';
export { default as Modal } from './components/Modal.svelte';
export { default as Menu } from './components/Menu.svelte';
export { default as Tooltip } from './components/Tooltip.svelte';
export { default as Tabs } from './components/Tabs.svelte';
export { default as Avatar } from './components/Avatar.svelte';
export { default as Skeleton } from './components/Skeleton.svelte';

// Import component types for prop inference
import type ButtonComponent from './components/Button.svelte';
import type TextFieldComponent from './components/TextField.svelte';
import type ModalComponent from './components/Modal.svelte';
import type MenuComponent from './components/Menu.svelte';
import type TooltipComponent from './components/Tooltip.svelte';
import type TabsComponent from './components/Tabs.svelte';
import type AvatarComponent from './components/Avatar.svelte';
import type SkeletonComponent from './components/Skeleton.svelte';

// Component prop types
export type ButtonProps = ComponentProps<ButtonComponent>;
export type TextFieldProps = ComponentProps<TextFieldComponent>;
export type ModalProps = ComponentProps<ModalComponent>;
export type MenuProps = ComponentProps<MenuComponent>;
export type TooltipProps = ComponentProps<TooltipComponent>;
export type TabsProps = ComponentProps<TabsComponent>;
export type AvatarProps = ComponentProps<AvatarComponent>;
export type SkeletonProps = ComponentProps<SkeletonComponent>;