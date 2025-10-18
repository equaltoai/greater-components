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
    children
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
  const preventFlashScript = $derived(() => buildPreventFlashScript());
  $effect(() => {
    preventFlashScript();
  });

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
      "}",
      "if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {",
      "  motion = 'reduced';",
      "}"
    ];

    const lines: string[] = [
      '(function() {',
      `  ${usePersistence ? "const stored = localStorage.getItem('gr-preferences-v1');" : 'const stored = null;'}`
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
        "      const prefs = JSON.parse(stored);",
        "      if (prefs.highContrastMode || window.matchMedia('(prefers-contrast: high)').matches) {",
        "        theme = 'high-contrast';",
        "      } else if (prefs.colorScheme === 'auto') {",
        "        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';",
        "      } else if (prefs.colorScheme) {",
        "        theme = prefs.colorScheme;",
        "      }",
        "      density = prefs.density || 'comfortable';",
        "      fontSize = prefs.fontSize || 'medium';",
        "      motion = prefs.motion || 'normal';",
        "      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {",
        "        motion = 'reduced';",
        "      }",
        "      if (prefs.customColors) {",
        "        const root = document.documentElement;",
        "        if (prefs.customColors.primary) {",
        "          root.style.setProperty('--gr-custom-primary', prefs.customColors.primary);",
        "        }",
        "        if (prefs.customColors.secondary) {",
        "          root.style.setProperty('--gr-custom-secondary', prefs.customColors.secondary);",
        "        }",
        "        if (prefs.customColors.accent) {",
        "          root.style.setProperty('--gr-custom-accent', prefs.customColors.accent);",
        "        }",
        "      }",
        "      if (prefs.fontScale) {",
        "        document.documentElement.style.setProperty('--gr-font-scale', String(prefs.fontScale));",
        "      }",
        "    } catch (e) {",
        "      // Ignore errors and use defaults",
        "    }",
        "  }"
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

<svelte:head>
  {#if preventFlash && typeof window === 'undefined'}
    <script>{preventFlashScript()}</script>
  {/if}
</svelte:head>

<div class="gr-theme-provider" data-theme-provider>
  {@render children()}
</div>

<style>
  .gr-theme-provider {
    /* Ensure the provider doesn't affect layout */
    display: contents;
  }
  
  /* Global theme-aware styles */
  :global(:root) {
    /* Default light theme (fallback) */
    color-scheme: light;
  }
  
  :global([data-theme="dark"]) {
    color-scheme: dark;
  }
  
  :global([data-theme="high-contrast"]) {
    color-scheme: dark;
  }
  
  /* Density-based spacing adjustments */
  :global([data-density="compact"]) {
    --gr-density-scale: 0.85;
  }
  
  :global([data-density="comfortable"]) {
    --gr-density-scale: 1;
  }
  
  :global([data-density="spacious"]) {
    --gr-density-scale: 1.2;
  }
  
  /* Font size adjustments */
  :global([data-font-size="small"]) {
    --gr-font-scale: 0.875;
  }
  
  :global([data-font-size="medium"]) {
    --gr-font-scale: 1;
  }
  
  :global([data-font-size="large"]) {
    --gr-font-scale: 1.125;
  }
  
  /* Apply density scale to spacing tokens */
  :global([data-density]) {
    --gr-spacing-scale-1: calc(0.25rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-2: calc(0.5rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-3: calc(0.75rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-4: calc(1rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-5: calc(1.25rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-6: calc(1.5rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-8: calc(2rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-10: calc(2.5rem * var(--gr-density-scale, 1));
    --gr-spacing-scale-12: calc(3rem * var(--gr-density-scale, 1));
  }
  
  /* Motion preferences */
  :global([data-motion="reduced"] *) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* High contrast mode enhancements */
  :global([data-theme="high-contrast"]) {
    --gr-semantic-border-default: var(--gr-color-base-white);
    --gr-semantic-border-strong: var(--gr-color-base-white);
  }
  
  :global([data-theme="high-contrast"] *:focus-visible) {
    outline: 3px solid var(--gr-semantic-focus-ring);
    outline-offset: 2px;
  }
  
  /* Custom color overrides */
  :global(:root) {
    --gr-theme-primary: var(--gr-custom-primary, var(--gr-semantic-action-primary-default));
    --gr-theme-secondary: var(--gr-custom-secondary, var(--gr-semantic-action-primary-hover));
    --gr-theme-accent: var(--gr-custom-accent, var(--gr-semantic-action-primary-active));
  }
  
  /* Smooth theme transitions */
  :global(body) {
    transition: background-color var(--gr-motion-duration-base) var(--gr-motion-easing-out),
                color var(--gr-motion-duration-base) var(--gr-motion-easing-out);
  }
  
  :global([data-motion="reduced"] body) {
    transition: none;
  }
</style>
