<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { preferencesStore, type ColorScheme } from '../stores/preferences';

	interface Props {
		theme?: ColorScheme;
		enableSystemDetection?: boolean;
		enablePersistence?: boolean;
		preventFlash?: boolean;
		children: Snippet;
	}

	let {
		theme,
		enableSystemDetection = true,
		enablePersistence = true,
		preventFlash = true,
		children,
	}: Props = $props();

	// Apply theme override if provided
	$effect(() => {
		if (theme && theme !== preferencesStore.preferences.colorScheme) {
			preferencesStore.setColorScheme(theme);
		}
	});

	// Initialize theme on mount
	onMount(() => {
		// The preferences store automatically initializes and applies theme
		// This is just to ensure it's initialized in case of SSR
		// If we have a theme prop, apply it
		if (theme) {
			preferencesStore.setColorScheme(theme);
		}

		// Return cleanup function
		return () => {
			// Cleanup is handled by the store
		};
	});

	// Generate inline script for preventing flash of unstyled content
	function buildPreventFlashScript(): string {
		if (!preventFlash) {
			return '';
		}

		const usePersistence = enablePersistence !== false;
		const useSystemDetection = enableSystemDetection !== false;

		const detectionLines = [
			"if (window.matchMedia('(prefers-contrast: high)').matches) {",
			"  theme = 'high-contrast';",
			"} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {",
			"  theme = 'dark';",
			'}',
			"if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {",
			"  motion = 'reduced';",
			'}',
		];

		const lines: string[] = [
			'(function() {',
			`  ${usePersistence ? "const stored = localStorage.getItem('gr-preferences-v1');" : 'const stored = null;'}`,
		];

		lines.push(
			"  let theme = 'light';",
			"  let density = 'comfortable';",
			"  let fontSize = 'medium';",
			"  let motion = 'normal';"
		);

		if (usePersistence) {
			lines.push(
				'  if (stored) {',
				'    try {',
				'      const prefs = JSON.parse(stored);',
				"      if (prefs.highContrastMode || window.matchMedia('(prefers-contrast: high)').matches) {",
				"        theme = 'high-contrast';",
				"      } else if (prefs.colorScheme === 'auto') {",
				"        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';",
				'      } else if (prefs.colorScheme) {',
				'        theme = prefs.colorScheme;',
				'      }',
				"      density = prefs.density || 'comfortable';",
				"      fontSize = prefs.fontSize || 'medium';",
				"      motion = prefs.motion || 'normal';",
				"      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {",
				"        motion = 'reduced';",
				'      }',
				'      if (prefs.customColors) {',
				'        const root = document.documentElement;',
				'        if (prefs.customColors.primary) {',
				"          root.style.setProperty('--gr-custom-primary', prefs.customColors.primary);",
				'        }',
				'        if (prefs.customColors.secondary) {',
				"          root.style.setProperty('--gr-custom-secondary', prefs.customColors.secondary);",
				'        }',
				'        if (prefs.customColors.accent) {',
				"          root.style.setProperty('--gr-custom-accent', prefs.customColors.accent);",
				'        }',
				'      }',
				'      if (prefs.fontScale) {',
				"        document.documentElement.style.setProperty('--gr-font-scale', String(prefs.fontScale));",
				'      }',
				'    } catch (e) {',
				'      // Ignore errors and use defaults',
				'    }',
				'  }'
			);
		}

		if (useSystemDetection) {
			lines.push('  if (!stored) {');
			detectionLines.forEach((line) => {
				lines.push(`    ${line}`);
			});
			lines.push('  }');
		}

		lines.push(
			"  document.documentElement.setAttribute('data-theme', theme);",
			"  document.documentElement.setAttribute('data-density', density);",
			"  document.documentElement.setAttribute('data-font-size', fontSize);",
			"  document.documentElement.setAttribute('data-motion', motion);",
			'})();'
		);

		return lines.join('\n');
	}
</script>

<!-- 
	Theme flash prevention should be handled in app.html for SvelteKit projects.
	The preventFlash prop is kept for API compatibility but the script injection
	via svelte:head doesn't work reliably. See Greater Components docs for 
	the recommended app.html approach.
-->

<div class="gr-theme-provider" data-theme-provider>
	{@render children()}
</div>
