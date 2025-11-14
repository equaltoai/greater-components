<script lang="ts">
  import DemoPage from '$lib/components/DemoPage.svelte';
  import {
    ThemeProvider,
    ThemeSwitcher,
    Switch,
    Select,
    TextField,
    TextArea,
    Button,
    preferencesStore,
    type PreferencesState
  } from '@equaltoai/greater-components-primitives';
  import type { DemoPageData } from '$lib/types/demo';
  import { loadPersistedState, persistState } from '$lib/stores/storage';

  type DigestFrequency = 'daily' | 'weekly' | 'off';
  type ThemeOption = 'light' | 'dark' | 'high-contrast' | 'auto';
  type DensityOption = 'comfortable' | 'compact' | 'spacious';

  type SettingsState = {
    appearance: {
      theme: ThemeOption;
      density: DensityOption;
    };
    privacy: {
      discoverable: boolean;
      showStatus: boolean;
      messageRequests: boolean;
    };
    notifications: {
      email: boolean;
      push: boolean;
      digest: DigestFrequency;
    };
    account: {
      displayName: string;
      location: string;
      bio: string;
    };
  };

  const defaultSettings: SettingsState = {
    appearance: {
      theme: 'auto',
      density: 'comfortable'
    },
    privacy: {
      discoverable: true,
      showStatus: true,
      messageRequests: false
    },
    notifications: {
      email: true,
      push: true,
      digest: 'daily'
    },
    account: {
      displayName: 'Greater Components',
      location: 'Portland, OR',
      bio: 'Equal To AI design system for Fediverse surfaces.'
    }
  };

  const settingsStorageKey = 'playground-settings-demo';

  let { data }: { data: DemoPageData } = $props();

  const toastDurationMs = 4000;

  let settings = $state<SettingsState>(defaultSettings);
  let settingsHydrated = false;
  let savedToast = $state('');
  let previewState = $state<PreferencesState>(preferencesStore.state);

  const densityOptions = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
    { value: 'spacious', label: 'Spacious' }
  ];

  const digestOptions = [
    { value: 'daily', label: 'Daily digests' },
    { value: 'weekly', label: 'Weekly summary' },
    { value: 'off', label: 'Disabled' }
  ];

  const privacyToggles = [
    {
      id: 'discoverable',
      label: 'Discoverable profile',
      description: 'Allow search engines and directory listings to index this account.'
    },
    {
      id: 'showStatus',
      label: 'Show online status',
      description: 'Display presence badges next to the avatar in status cards.'
    },
    {
      id: 'messageRequests',
      label: 'Allow message requests',
      description: 'Let unknown accounts request direct messages.'
    }
  ] as const;

  const notificationToggles = [
    {
      id: 'email',
      label: 'Email alerts',
      description: 'Mentions, follows, and reports trigger email notifications.'
    },
    {
      id: 'push',
      label: 'Push notifications',
      description: 'Send mobile push alerts when priority events occur.'
    }
  ] as const;

  function updateSettings<K extends keyof SettingsState>(section: K, partial: Partial<SettingsState[K]>) {
    settings = {
      ...settings,
      [section]: {
        ...settings[section],
        ...partial
      }
    };
  }

  function handleThemeChange(theme: ThemeOption) {
    updateSettings('appearance', { theme });
    preferencesStore.setColorScheme(theme);
    syncPreview();
  }

  function handleDensityChange(density: DensityOption) {
    updateSettings('appearance', { density });
    preferencesStore.setDensity(density);
    syncPreview();
  }

  function togglePrivacy(field: keyof SettingsState['privacy']) {
    updateSettings('privacy', { [field]: !settings.privacy[field] } as Partial<SettingsState['privacy']>);
  }

  function toggleNotification(field: keyof SettingsState['notifications']) {
    updateSettings('notifications', { [field]: !settings.notifications[field] } as Partial<SettingsState['notifications']>);
  }

  function syncPreview() {
    previewState = preferencesStore.state;
  }

  function resetAppearance() {
    preferencesStore.reset();
    syncPreview();
    settings = {
      ...settings,
      appearance: { ...defaultSettings.appearance }
    };
  }

  function handleDigestChange(value: string) {
    updateSettings('notifications', { digest: value as DigestFrequency });
  }

  function handleAccountChange(field: keyof SettingsState['account'], value: string) {
    updateSettings('account', { [field]: value } as Partial<SettingsState['account']>);
  }

  $effect(() => {
    if (!settingsHydrated) {
      settings = loadPersistedState(settingsStorageKey, defaultSettings);
      settingsHydrated = true;
      return;
    }

    persistState(settingsStorageKey, settings);
    savedToast = 'Preferences saved';
    const handle = setTimeout(() => (savedToast = ''), toastDurationMs);
    return () => clearTimeout(handle);
  });

  $effect(() => {
    syncPreview();
    const interval = setInterval(syncPreview, 800);
    return () => clearInterval(interval);
  });
</script>

<ThemeProvider>
  <DemoPage eyebrow="Playground" title={data.metadata.title} description={data.metadata.description}>
    <div class="settings-grid">
      <section class="settings-card">
        <header>
          <p class="section-eyebrow">Appearance</p>
          <h2>Theme & density</h2>
          <p class="muted">ThemeSwitcher hooks into the shared preferences store so previews stay on-brand.</p>
        </header>
        <ThemeSwitcher variant="full" showAdvanced value={settings.appearance.theme} onThemeChange={handleThemeChange} />
        <label for="density-select" class="field-label">Density</label>
        <Select
          id="density-select"
          options={densityOptions}
          value={settings.appearance.density}
          onchange={(value) => handleDensityChange(value as DensityOption)}
        />
        <div class="appearance-actions">
          <Button variant="ghost" size="sm" onclick={resetAppearance}>
            Reset appearance
          </Button>
        </div>
      </section>

      <section class="settings-card">
        <header>
          <p class="section-eyebrow">Privacy</p>
          <h2>Control discovery</h2>
          <p class="muted">Switches update instantly; we store the state locally so QA can refresh.</p>
        </header>
        <div class="toggle-stack">
          {#each privacyToggles as toggle (toggle.id)}
            <div class="toggle-row">
              <div>
                <strong>{toggle.label}</strong>
                <p class="muted">{toggle.description}</p>
              </div>
              <Switch checked={settings.privacy[toggle.id]} onclick={() => togglePrivacy(toggle.id)} />
            </div>
          {/each}
        </div>
      </section>

      <section class="settings-card">
        <header>
          <p class="section-eyebrow">Notifications</p>
          <h2>Delivery channels</h2>
          <p class="muted">Digest cadence and channel toggles simulate optimistic preference updates.</p>
        </header>
        <div class="toggle-stack">
          {#each notificationToggles as toggle (toggle.id)}
            <div class="toggle-row">
              <div>
                <strong>{toggle.label}</strong>
                <p class="muted">{toggle.description}</p>
              </div>
              <Switch checked={settings.notifications[toggle.id]} onclick={() => toggleNotification(toggle.id)} />
            </div>
          {/each}
        </div>
        <label for="digest-select" class="field-label">Digest frequency</label>
        <Select id="digest-select" options={digestOptions} value={settings.notifications.digest} onchange={handleDigestChange} />
      </section>

      <section class="settings-card">
        <header>
          <p class="section-eyebrow">Account</p>
          <h2>Profile details</h2>
          <p class="muted">Fields persist via localStorage so QA can refresh between edits.</p>
        </header>
        <TextField
          label="Display name"
          value={settings.account.displayName}
          oninput={(event) => handleAccountChange('displayName', (event.currentTarget as HTMLInputElement).value)}
          required
        />
        <TextField
          label="Location"
          value={settings.account.location}
          oninput={(event) => handleAccountChange('location', (event.currentTarget as HTMLInputElement).value)}
        />
        <TextArea
          label="Bio"
          rows={4}
          value={settings.account.bio}
          oninput={(event) => handleAccountChange('bio', (event.currentTarget as HTMLTextAreaElement).value)}
        />
      </section>

      <section class="settings-card preview-card" aria-live="polite">
        <header>
          <p class="section-eyebrow">Preview</p>
          <h2>{previewState.resolvedColorScheme} · {previewState.density}</h2>
          <p class="muted">Snapshots update as soon as ThemeSwitcher or density controls change.</p>
        </header>
        <div class="preview-grid" data-density={previewState.density}>
          <article>
            <h3>Timeline sample</h3>
            <p>Resolved theme: <strong>{previewState.resolvedColorScheme}</strong></p>
            <p>Motion: <strong>{previewState.motion}</strong></p>
            <p>Font size: <strong>{previewState.fontSize}</strong></p>
          </article>
          <article>
            <h3>Notification sample</h3>
            <p>Email alerts: {settings.notifications.email ? 'Enabled' : 'Muted'}</p>
            <p>Push alerts: {settings.notifications.push ? 'Enabled' : 'Muted'}</p>
            <p>Digest: {settings.notifications.digest}</p>
          </article>
        </div>
      </section>
    </div>
    <p class="muted" aria-live="polite">{savedToast || 'Settings auto-save locally.'}</p>
  </DemoPage>
</ThemeProvider>

<style>
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .settings-card {
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-2xl);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--gr-semantic-background-primary);
  }

  .appearance-actions {
    display: flex;
    justify-content: flex-end;
  }

  .toggle-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .toggle-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
  }

  .field-label {
    font-weight: var(--gr-typography-fontWeight-medium);
  }

  .preview-card article {
    border: 1px solid var(--gr-semantic-border-subtle);
    border-radius: var(--gr-radii-xl);
    padding: 1rem;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .preview-grid[data-density='compact'] article {
    padding: 0.75rem;
  }

  .preview-grid[data-density='spacious'] article {
    padding: 1.25rem;
  }

  .muted {
    color: var(--gr-semantic-foreground-tertiary);
    font-size: var(--gr-typography-fontSize-sm);
    margin: 0;
  }

  .section-eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: var(--gr-typography-fontSize-xs);
    color: var(--gr-semantic-foreground-tertiary);
    margin: 0;
  }

  @media (max-width: 720px) {
    .settings-card {
      padding: 1.25rem;
    }
  }
</style>
