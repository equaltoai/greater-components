/**
 * Menu Context - Shared state and utilities for compound Menu components
 * @module @equaltoai/greater-components/primitives/Menu/context
 */
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export interface MenuItemConfig {
    id: string;
    label?: string;
    disabled?: boolean;
    destructive?: boolean;
    icon?: unknown;
    shortcut?: string;
    onClick?: () => void;
}
export interface MenuPosition {
    x: number;
    y: number;
    placement: MenuPlacement;
}
export interface MenuContextValue {
    isOpen: boolean;
    activeIndex: number;
    menuId: string;
    triggerId: string;
    placement: MenuPlacement;
    offset: number;
    loop: boolean;
    position: MenuPosition;
    items: MenuItemConfig[];
    open: () => void;
    close: () => void;
    toggle: () => void;
    setActiveIndex: (index: number) => void;
    registerItem: (item: MenuItemConfig) => void;
    unregisterItem: (id: string) => void;
    selectItem: (id: string) => void;
    triggerElement: HTMLElement | null;
    contentElement: HTMLElement | null;
    setTriggerElement: (el: HTMLElement | null) => void;
    setContentElement: (el: HTMLElement | null) => void;
    updatePosition: () => void;
}
/**
 * Create and set menu context in parent component
 */
export declare function createMenuContext(value: MenuContextValue): void;
/**
 * Get menu context in child components
 */
export declare function getMenuContext(): MenuContextValue;
/**
 * Check if menu context exists
 */
export declare function hasMenuContext(): boolean;
export declare function generateMenuId(): string;
//# sourceMappingURL=context.d.ts.map