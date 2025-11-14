import type { PageLoad } from './$types';
import type { DemoPageData } from '$lib/types/demo';

export const load: PageLoad = (() => ({
	metadata: {
		slug: 'forms-demo',
		title: 'Form Components Demo',
		description:
			'Text inputs, selects, switches, checkboxes, radios, and uploads pulled from the production primitives build.',
		sections: ['Text inputs', 'Selections', 'Toggles & switches', 'File uploads'],
	},
})) satisfies () => DemoPageData;
