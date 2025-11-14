/// <reference types="@sveltejs/kit" />

declare global {
	interface ImportMetaEnv {
		readonly PLAYGROUND_CSR_ONLY?: 'true' | 'false';
	}
}

export {};
