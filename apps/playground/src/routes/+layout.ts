const csrOnly = import.meta.env.PLAYGROUND_CSR_ONLY === 'true';

export const ssr = !csrOnly;
export const prerender = true;
