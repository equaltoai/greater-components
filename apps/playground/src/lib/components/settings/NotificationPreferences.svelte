<script>
  import { SettingsSection, SettingsToggle } from '@equaltoai/greater-components-primitives';
  import { NotificationFilters } from '@equaltoai/greater-components-fediverse';
  
  let pushEnabled = $state(false);
  let emailNotifications = $state(true);
  
  let filters = $state({
      mentions: true,
      favorites: true,
      reblogs: true,
      follows: true,
      polls: true
  });
</script>

<SettingsSection title="Email Notifications">
    <SettingsToggle
        label="Email Digest"
        description="Receive a weekly summary of activity"
        bind:value={emailNotifications}
    />
</SettingsSection>

<!-- Using the pre-built NotificationFilters component -->
<NotificationFilters bind:filters />

<!-- Using the pre-built PushNotificationSettings component (mock adapter needed) -->
<!-- <PushNotificationSettings {adapter} /> -->
<SettingsSection title="Push Notifications" description="Browser notifications">
    <SettingsToggle
        label="Enable Push Notifications"
        bind:value={pushEnabled}
    />
</SettingsSection>
