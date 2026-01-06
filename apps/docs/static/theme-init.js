// Theme detection for docs site (externalized for strict CSP compatibility).
(function () {
	try {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	} catch {
		// Ignore theme detection failures (e.g., blocked storage).
	}
})();

