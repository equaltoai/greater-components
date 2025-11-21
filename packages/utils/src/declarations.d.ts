declare module 'turndown-plugin-gfm' {
	import TurndownService from 'turndown';
	export function gfm(turndownService: TurndownService): void;
	export var tables: any;
	export var strikethrough: any;
	export var taskListItems: any;
}
