import { createDemoPlaywrightConfig } from './playwright.demo.config';

const runtime =
	process.env['PLAYGROUND_RUNTIME']?.toLowerCase() === 'csr' ||
	process.env['PLAYGROUND_CSR_ONLY'] === 'true'
		? 'csr'
		: 'ssr';

export default createDemoPlaywrightConfig(runtime);
