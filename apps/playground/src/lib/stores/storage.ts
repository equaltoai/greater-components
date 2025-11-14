const isBrowser = typeof window !== 'undefined';

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
		if (typeof fallback === 'object' && fallback !== null && typeof parsed === 'object') {
			return { ...fallback, ...parsed };
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
