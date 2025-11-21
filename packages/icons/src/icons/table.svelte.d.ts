import type { SVGAttributes } from 'svelte/elements';
interface Props extends SVGAttributes<SVGSVGElement> {
	size?: number | string;
	color?: string;
	strokeWidth?: number | string;
	class?: string;
}
declare const Table: import('svelte').Component<Props, {}, ''>;
type Table = ReturnType<typeof Table>;
export default Table;
//# sourceMappingURL=table.svelte.d.ts.map
