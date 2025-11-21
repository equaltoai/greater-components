import type { SVGAttributes } from 'svelte/elements';
interface Props extends SVGAttributes<SVGSVGElement> {
	size?: number | string;
	color?: string;
	strokeWidth?: number | string;
	class?: string;
}
declare const Figma: import('svelte').Component<Props, {}, ''>;
type Figma = ReturnType<typeof Figma>;
export default Figma;
//# sourceMappingURL=figma.svelte.d.ts.map
