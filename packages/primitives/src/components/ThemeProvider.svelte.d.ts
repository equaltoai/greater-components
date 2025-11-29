import type { Snippet } from 'svelte';
import { type ColorScheme } from '../stores/preferences';
interface Props {
    theme?: ColorScheme;
    enableSystemDetection?: boolean;
    enablePersistence?: boolean;
    preventFlash?: boolean;
    children: Snippet;
}
declare const ThemeProvider: import("svelte").Component<Props, {}, "">;
type ThemeProvider = ReturnType<typeof ThemeProvider>;
export default ThemeProvider;
//# sourceMappingURL=ThemeProvider.svelte.d.ts.map