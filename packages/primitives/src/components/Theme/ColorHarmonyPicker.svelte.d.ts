import { type ColorHarmony } from '@equaltoai/greater-components-utils';
interface Props {
    seedColor: string;
    harmonyType?: keyof Omit<ColorHarmony, 'base'>;
    onSelect?: (colors: string[]) => void;
}
declare const ColorHarmonyPicker: import("svelte").Component<Props, {}, "seedColor">;
type ColorHarmonyPicker = ReturnType<typeof ColorHarmonyPicker>;
export default ColorHarmonyPicker;
//# sourceMappingURL=ColorHarmonyPicker.svelte.d.ts.map