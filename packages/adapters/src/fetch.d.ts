export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export declare function resolveFetchLike<T extends FetchLike>(customFetch?: T): T;
//# sourceMappingURL=fetch.d.ts.map
