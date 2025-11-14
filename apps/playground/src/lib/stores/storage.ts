const isBrowser = typeof window !== 'undefined';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const mergeObjects = <T extends Record<string, unknown>>(
	fallback: T,
	parsed: Record<string, unknown>
): T => {
	const result: Record<string, unknown> = { ...fallback };

	for (const [key, value] of Object.entries(parsed)) {
		const fallbackValue = result[key];

		if (isPlainObject(fallbackValue) && isPlainObject(value)) {
			result[key] = mergeObjects(fallbackValue, value);
			continue;
		}

		result[key] = value;
	}

	return result as T;
};

export function loadPersistedState<T>(key: string, fallback: T): T {
	if (!isBrowser) {
		return fallback;
	}

	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) {
			return fallback;
		}

		const parsed = JSON.parse(raw);
		if (isPlainObject(fallback) && isPlainObject(parsed)) {
			return mergeObjects(fallback, parsed);
		}

		return parsed as T;
	} catch {
		return fallback;
	}
}

export function persistState<T>(key: string, value: T): void {
	if (!isBrowser) {
		return;
	}

	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Swallow quota errors in the playground.
	}
}
