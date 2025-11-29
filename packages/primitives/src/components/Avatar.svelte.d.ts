import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    shape?: 'circle' | 'square' | 'rounded';
    loading?: boolean;
    status?: 'online' | 'offline' | 'busy' | 'away';
    statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    class?: string;
    fallback?: Snippet;
}
declare const Avatar: import("svelte").Component<Props, {}, "">;
type Avatar = ReturnType<typeof Avatar>;
export default Avatar;
//# sourceMappingURL=Avatar.svelte.d.ts.map