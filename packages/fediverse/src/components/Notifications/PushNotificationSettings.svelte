<!--
  Manage push notification subscription
-->
<script lang="ts">
  import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
  import { SettingsSection, Button } from '@equaltoai/greater-components-primitives';
  
  interface Props {
    adapter: LesserGraphQLAdapter;
  }
  
  let { adapter }: Props = $props();
  
  let subscription = $state<PushSubscription | null>(null);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  
  async function enablePush() {
      isLoading = true;
      error = null;
      try {
          // Logic to enable push would involve:
          // 1. Requesting permission: Notification.requestPermission()
          // 2. Getting subscription from ServiceWorker
          // 3. Sending subscription to adapter.registerPushSubscription(...)
          
          // Placeholder for now
          if (!('serviceWorker' in navigator)) {
              throw new Error('Service workers are not supported');
          }
          
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
              throw new Error('Permission denied');
          }
          
          // Mock success for UI demo
          // subscription = ...
      } catch (e) {
          error = e instanceof Error ? e.message : 'Failed to enable push';
      } finally {
          isLoading = false;
      }
  }
</script>

<SettingsSection title="Push Notifications" description="Receive notifications even when you are not using the app">
    {#if error}
        <div class="error">{error}</div>
    {/if}
    
    {#if subscription}
        <p>Push notifications are enabled.</p>
        <Button variant="secondary" onclick={() => { subscription = null; }}>Disable Push Notifications</Button>
    {:else}
        <Button 
            variant="primary" 
            disabled={isLoading}
            onclick={enablePush}
        >
            {isLoading ? 'Enabling...' : 'Enable Push Notifications'}
        </Button>
    {/if}
</SettingsSection>

<style>
    .error {
        color: var(--gr-color-error);
        margin-bottom: 1rem;
    }
</style>
