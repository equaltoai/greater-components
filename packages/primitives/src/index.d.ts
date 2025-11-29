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
 * Button for copying text to clipboard with visual feedback.
 * @public
 */
export { default as CopyButton } from './components/CopyButton.svelte';
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
 * Content container with elevation, borders, and semantic sections.
 * @public
 */
export { default as Card } from './components/Card.svelte';
/**
 * Max-width wrapper for content centering.
 * @public
 */
export { default as Container } from './components/Container.svelte';
/**
 * Semantic heading with consistent typography.
 * @public
 */
export { default as Heading } from './components/Heading.svelte';
/**
 * Paragraph and inline text component with size, weight, and color variants.
 * @public
 */
export { default as Text } from './components/Text.svelte';
/**
 * Semantic section wrapper with consistent vertical spacing.
 * @public
 */
export { default as Section } from './components/Section.svelte';
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
/**
 * Badge component for status indicators and labels.
 * @public
 */
export { default as Badge } from './components/Badge.svelte';
/**
 * List component for styled lists with optional icons.
 * @public
 */
export { default as List } from './components/List.svelte';
/**
 * ListItem component for items within a List.
 * @public
 */
export { default as ListItem } from './components/ListItem.svelte';
/**
 * GradientText component for eye-catching text effects.
 * @public
 */
export { default as GradientText } from './components/GradientText.svelte';
/**
 * StepIndicator component for multi-step workflows.
 * @public
 */
export { default as StepIndicator } from './components/StepIndicator.svelte';
/**
 * IconBadge component for icons in shaped containers.
 * @public
 */
export { default as IconBadge } from './components/IconBadge.svelte';
/**
 * DropZone component for drag and drop file uploads.
 * @public
 */
export { default as DropZone } from './components/DropZone.svelte';
/**
 * StreamingText component for text animation.
 * @public
 */
export { default as StreamingText } from './components/StreamingText.svelte';
/**
 * Settings components for building configuration panels.
 * @public
 */
export { default as SettingsSection } from './components/Settings/SettingsSection.svelte';
export { default as SettingsGroup } from './components/Settings/SettingsGroup.svelte';
export { default as SettingsField } from './components/Settings/SettingsField.svelte';
export { default as SettingsToggle } from './components/Settings/SettingsToggle.svelte';
export { default as SettingsSelect } from './components/Settings/SettingsSelect.svelte';
/**
 * Advanced theme components.
 * @public
 */
export { default as ColorHarmonyPicker } from './components/Theme/ColorHarmonyPicker.svelte';
export { default as ContrastChecker } from './components/Theme/ContrastChecker.svelte';
export { default as ThemeWorkbench } from './components/Theme/ThemeWorkbench.svelte';
import type ButtonComponent from './components/Button.svelte';
import type CopyButtonComponent from './components/CopyButton.svelte';
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
import type CardComponent from './components/Card.svelte';
import type ContainerComponent from './components/Container.svelte';
import type SectionComponent from './components/Section.svelte';
import type HeadingComponent from './components/Heading.svelte';
import type TextComponent from './components/Text.svelte';
import type ThemeSwitcherComponent from './components/ThemeSwitcher.svelte';
import type ThemeProviderComponent from './components/ThemeProvider.svelte';
import type BadgeComponent from './components/Badge.svelte';
import type ListComponent from './components/List.svelte';
import type ListItemComponent from './components/ListItem.svelte';
import type GradientTextComponent from './components/GradientText.svelte';
import type StepIndicatorComponent from './components/StepIndicator.svelte';
import type IconBadgeComponent from './components/IconBadge.svelte';
import type DropZoneComponent from './components/DropZone.svelte';
import type StreamingTextComponent from './components/StreamingText.svelte';
export type ButtonProps = ComponentProps<ButtonComponent>;
export type CopyButtonProps = ComponentProps<CopyButtonComponent>;
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
export type CardProps = ComponentProps<CardComponent>;
export type ContainerProps = ComponentProps<ContainerComponent>;
export type SectionProps = ComponentProps<SectionComponent>;
export type HeadingProps = ComponentProps<HeadingComponent>;
export type TextProps = ComponentProps<TextComponent>;
export type ThemeSwitcherProps = ComponentProps<ThemeSwitcherComponent>;
export type ThemeProviderProps = ComponentProps<ThemeProviderComponent>;
export type BadgeProps = ComponentProps<BadgeComponent>;
export type ListProps = ComponentProps<ListComponent>;
export type ListItemProps = ComponentProps<ListItemComponent>;
export type GradientTextProps = ComponentProps<GradientTextComponent>;
export type StepIndicatorProps = ComponentProps<StepIndicatorComponent>;
export type IconBadgeProps = ComponentProps<IconBadgeComponent>;
export type DropZoneProps = ComponentProps<DropZoneComponent>;
export type StreamingTextProps = ComponentProps<StreamingTextComponent>;
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export { preferencesStore, getPreferences, getPreferenceState } from './stores/preferences';
export type { ColorScheme, Density, FontSize, MotionPreference, ThemeColors, UserPreferences, PreferencesState, } from './stores/preferences';
//# sourceMappingURL=index.d.ts.map