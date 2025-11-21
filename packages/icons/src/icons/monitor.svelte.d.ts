import type { SVGAttributes } from 'svelte/elements';
interface Props extends SVGAttributes<SVGSVGElement> {
	size?: number | string;
	color?: string;
	strokeWidth?: number | string;
	class?: string;
}
declare const Monitor: import('svelte').Component<Props, {}, ''>;
type Monitor = ReturnType<typeof Monitor>;
export default Monitor;
//# sourceMappingURL=monitor.svelte.d.ts.map
