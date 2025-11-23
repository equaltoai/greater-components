<script>
  import { SettingsSection, SettingsToggle, SettingsSelect, ThemeSwitcher } from '@equaltoai/greater-components-primitives';
  
  let theme = $state('auto');
  let density = $state('comfortable');
  let reducedMotion = $state(false);
</script>

<SettingsSection title="Appearance" description="Customize how the app looks">
  <div class="theme-control">
      <h4>Theme</h4>
      <ThemeSwitcher />
  </div>
  
  <SettingsSelect
    label="Density"
    description="Adjust the spacing of interface elements"
    bind:value={density}
    options={[
      { value: 'compact', label: 'Compact' },
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'spacious', label: 'Spacious' },
    ]}
  />
  
  <SettingsToggle
    label="Reduced Motion"
    description="Minimize animations"
    bind:value={reducedMotion}
  />
</SettingsSection>

<style>
    .theme-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    .theme-control h4 {
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 500;
    }
</style>
