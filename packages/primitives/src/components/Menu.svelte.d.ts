import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
declare const Menu: import("svelte").Component<Omit<HTMLAttributes<HTMLUListElement>, "role"> & {
    items: MenuItemData[];
    orientation?: "horizontal" | "vertical";
    class?: string;
    trigger?: Snippet<[{
        open: boolean;
        toggle: () => void;
    }]>;
    onItemSelect?: (item: MenuItemData) => void;
}, {}, "">;
type Menu = ReturnType<typeof Menu>;
export default Menu;
//# sourceMappingURL=Menu.svelte.d.ts.map