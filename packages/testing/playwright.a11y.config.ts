import { createDemoPlaywrightConfig } from './playwright.demo.config';

process.env.PLAYWRIGHT_A11Y = 'true';

const runtime =
	process.env['PLAYGROUND_RUNTIME']?.toLowerCase() === 'csr' ||
	process.env['PLAYGROUND_CSR_ONLY'] === 'true'
		? 'csr'
		: 'ssr';

export default createDemoPlaywrightConfig(runtime);
