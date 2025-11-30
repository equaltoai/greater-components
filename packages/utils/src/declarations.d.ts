declare module 'turndown-plugin-gfm' {
	import TurndownService from 'turndown';
	export function gfm(turndownService: TurndownService): void;
	export const tables: unknown;
	export const strikethrough: unknown;
	export const taskListItems: unknown;
}
