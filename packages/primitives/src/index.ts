/**
 * @fileoverview Greater Primitives - Core UI components for modern web applications
 *
 * This package provides a comprehensive set of primitive UI components built with
 * Svelte 5, following accessibility best practices and design system principles.
 * All components feature full TypeScript support, keyboard navigation, and
 * WCAG 2.1 AA compliance.
 *
 * @version 1.0.0
 * @author Greater Contributors
 * @license AGPL-3.0-only
 * @public
 */

// Type imports and exports
import type { ComponentProps } from 'svelte';
export type { ComponentProps } from 'svelte';

/**
 * Core interactive components
 * @public
 */

/**
 * Accessible button component with loading states and multiple variants.
 * @public
 */
export { default as Button } from './components/Button.svelte';

/**
 * Text input field with validation and accessibility features.
 * @public
 */
export { default as TextField } from './components/TextField.svelte';

/**
 * Multi-line text area with auto-resize.
 * @public
 */
export { default as TextArea } from './components/TextArea.svelte';

/**
 * Dropdown select component with keyboard navigation.
 * @public
 */
export { default as Select } from './components/Select.svelte';

/**
 * Checkbox input with indeterminate state support.
 * @public
 */
export { default as Checkbox } from './components/Checkbox.svelte';

/**
 * Toggle switch component for boolean options.
 * @public
 */
export { default as Switch } from './components/Switch.svelte';

/**
 * File upload component with drag-and-drop support.
 * @public
 */
export { default as FileUpload } from './components/FileUpload.svelte';

/**
 * Modal dialog with focus management and backdrop handling.
 * @public
 */
export { default as Modal } from './components/Modal.svelte';

/**
 * Dropdown menu with keyboard navigation and accessibility.
 * @public
 */
export { default as Menu } from './components/Menu.svelte';

/**
 * Tooltip with smart positioning and accessibility.
 * @public
 */
export { default as Tooltip } from './components/Tooltip.svelte';

/**
 * Tab navigation with keyboard support and ARIA semantics.
 * @public
 */
export { default as Tabs } from './components/Tabs.svelte';

/**
 * Avatar component with fallback initials and status indicators.
 * @public
 */
export { default as Avatar } from './components/Avatar.svelte';

/**
 * Loading skeleton with animation and shape variants.
 * @public
 */
export { default as Skeleton } from './components/Skeleton.svelte';

/**
 * Theme switcher for toggling between color schemes.
 * @public
 */
export { default as ThemeSwitcher } from './components/ThemeSwitcher.svelte';

/**
 * Theme provider for managing application-wide theme state.
 * @public
 */
export { default as ThemeProvider } from './components/ThemeProvider.svelte';

// Import component types for prop inference
import type ButtonComponent from './components/Button.svelte';
import type TextFieldComponent from './components/TextField.svelte';
import type TextAreaComponent from './components/TextArea.svelte';
import type SelectComponent from './components/Select.svelte';
import type CheckboxComponent from './components/Checkbox.svelte';
import type SwitchComponent from './components/Switch.svelte';
import type FileUploadComponent from './components/FileUpload.svelte';
import type ModalComponent from './components/Modal.svelte';
import type MenuComponent from './components/Menu.svelte';
import type TooltipComponent from './components/Tooltip.svelte';
import type TabsComponent from './components/Tabs.svelte';
import type AvatarComponent from './components/Avatar.svelte';
import type SkeletonComponent from './components/Skeleton.svelte';
import type ThemeSwitcherComponent from './components/ThemeSwitcher.svelte';
import type ThemeProviderComponent from './components/ThemeProvider.svelte';

// Component prop types
export type ButtonProps = ComponentProps<ButtonComponent>;
export type TextFieldProps = ComponentProps<TextFieldComponent>;
export type TextAreaProps = ComponentProps<TextAreaComponent>;
export type SelectProps = ComponentProps<SelectComponent>;
export type CheckboxProps = ComponentProps<CheckboxComponent>;
export type SwitchProps = ComponentProps<SwitchComponent>;
export type FileUploadProps = ComponentProps<FileUploadComponent>;
export type ModalProps = ComponentProps<ModalComponent>;
export type MenuProps = ComponentProps<MenuComponent>;
export type TooltipProps = ComponentProps<TooltipComponent>;
export type TabsProps = ComponentProps<TabsComponent>;
export type AvatarProps = ComponentProps<AvatarComponent>;
export type SkeletonProps = ComponentProps<SkeletonComponent>;
export type ThemeSwitcherProps = ComponentProps<ThemeSwitcherComponent>;
export type ThemeProviderProps = ComponentProps<ThemeProviderComponent>;

// Select option type
export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

// Store exports
export { preferencesStore, getPreferences, getPreferenceState } from './stores/preferences';
export type {
	ColorScheme,
	Density,
	FontSize,
	MotionPreference,
	ThemeColors,
	UserPreferences,
	PreferencesState,
} from './stores/preferences';
