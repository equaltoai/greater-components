// @ts-nocheck
// Minimal Svelte runes polyfills so Vitest can instantiate stores/components

const runtime = globalThis as typeof globalThis & {
	$state?: <T>(value: T) => T;
	$derived?: <T>(fn: () => T) => () => T;
};

if (typeof runtime.$state !== 'function') {
	runtime.$state = <T>(value: T) => value;
}

if (typeof runtime.$derived !== 'function') {
	runtime.$derived = <T>(fn: () => T) => fn;
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {}, // deprecated
			removeListener: () => {}, // deprecated
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}),
	});
}
