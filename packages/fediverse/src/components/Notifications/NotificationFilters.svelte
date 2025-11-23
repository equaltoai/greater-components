<!--
  Configure which notification types to receive
-->
<script lang="ts">
  import { SettingsSection, SettingsToggle } from '@equaltoai/greater-components-primitives';
  
  interface NotificationFilters {
      mentions: boolean;
      favorites: boolean;
      reblogs: boolean;
      follows: boolean;
      polls: boolean;
  }
  
  interface Props {
    filters: NotificationFilters;
    onChange?: (filters: NotificationFilters) => void;
  }

  let { filters = $bindable(), onChange }: Props = $props();
  
  $effect(() => {
      if (onChange) onChange(filters);
  });
</script>

<SettingsSection title="Notification Types">
  <SettingsToggle
    label="Mentions"
    bind:value={filters.mentions}
  />
  <SettingsToggle
    label="Favorites"
    bind:value={filters.favorites}
  />
  <SettingsToggle
    label="Boosts"
    bind:value={filters.reblogs}
  />
  <SettingsToggle
    label="Follows"
    bind:value={filters.follows}
  />
  <SettingsToggle
    label="Polls"
    bind:value={filters.polls}
  />
</SettingsSection>
