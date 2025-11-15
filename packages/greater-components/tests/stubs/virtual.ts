export const createVirtualizer = () => ({
	getScrollElement: () => null,
	getTotalSize: () => 0,
	getVirtualItems: () => [],
	measureElement: () => undefined,
});
