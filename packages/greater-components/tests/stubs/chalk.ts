export default new Proxy(
	{},
	{
		get: () => (value: string) => value,
		apply: (_target, _thisArg, args: string[]) => args.join(''),
	}
);
