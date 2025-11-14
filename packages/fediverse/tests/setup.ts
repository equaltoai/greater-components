// Minimal Svelte runes polyfills so Vitest can instantiate stores/components

declare global {
  // eslint-disable-next-line no-var
  var $state: <T>(value: T) => T;
  // eslint-disable-next-line no-var
  var $derived: <T>(fn: () => T) => () => T;
}

if (typeof globalThis.$state !== 'function') {
  globalThis.$state = <T>(value: T) => value;
}

if (typeof globalThis.$derived !== 'function') {
  globalThis.$derived = <T>(fn: () => T) => fn;
}

export {};
