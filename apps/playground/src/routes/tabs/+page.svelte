<script lang="ts">
  import { Tabs } from '@equaltoai/greater-components-primitives';
  import type { Snippet } from 'svelte';

  interface TabData {
    id: string;
    label: string;
    disabled?: boolean;
    content?: Snippet;
  }

  const productTabs: TabData[] = [
    { id: 'overview', label: 'Overview', content: OverviewContent },
    { id: 'features', label: 'Features', content: FeaturesContent },
    { id: 'activity', label: 'Recent Activity', content: ActivityContent },
    { id: 'settings', label: 'Settings', content: SettingsContent }
  ];

  const accountTabs: TabData[] = [
    { id: 'profile', label: 'Profile', content: ProfileContent },
    { id: 'security', label: 'Security', content: SecurityContent },
    { id: 'notifications', label: 'Notifications', content: NotificationContent, disabled: true },
    { id: 'billing', label: 'Billing', content: BillingContent }
  ];

  let productActive = $state(productTabs[0].id);
  let accountActive = $state(accountTabs[0].id);

  function handleProductChange(tabId: string) {
    productActive = tabId;
  }

  function handleAccountChange(tabId: string) {
    accountActive = tabId;
  }
</script>

<div class="tabs-page">
  <header>
    <h1>Tabs Component Demo</h1>
    <p>This page runs entirely inside SvelteKit/SSR and exercises the Tabs component twice.</p>
  </header>

  <section>
    <h2>Default (horizontal)</h2>
    <Tabs
      tabs={productTabs}
      activeTab={productActive}
      onTabChange={handleProductChange}
      variant="underline"
    />
  </section>

  <section>
    <h2>Manual activation + vertical orientation</h2>
    <p class="note">Use the arrow keys to move focus, then press Enter/Space to activate the tab.</p>
    <Tabs
      tabs={accountTabs}
      activeTab={accountActive}
      orientation="vertical"
      activation="manual"
      variant="pills"
      onTabChange={handleAccountChange}
    />
  </section>
</div>

{#snippet OverviewContent()}
  <div class="tab-panel">
    <h3>Overview</h3>
    <p>The Tabs component supports keyboard navigation, roving tabindex, and aria relationships out of the box.</p>
    <ul>
      <li>Arrow keys move focus based on orientation</li>
      <li>Home/End jump to the first or last enabled tab</li>
      <li>Content updates when <code>onTabChange</code> fires</li>
    </ul>
  </div>
{/snippet}

{#snippet FeaturesContent()}
  <div class="tab-panel">
    <h3>Features</h3>
    <p>Each tab accepts an arbitrary snippet so you can render any Svelte markup (forms, cards, etc.).</p>
    <div class="pill-row">
      <span>Pills</span>
      <span>Underline</span>
      <span>Manual activation</span>
    </div>
  </div>
{/snippet}

{#snippet ActivityContent()}
  <div class="tab-panel">
    <h3>Recent Activity</h3>
    <ul>
      <li>Today · Component documentation updated</li>
      <li>Yesterday · CI published @equaltoai/greater-components</li>
      <li>Monday · Tabs regression test added</li>
    </ul>
  </div>
{/snippet}

{#snippet SettingsContent()}
  <div class="tab-panel">
    <h3>Settings</h3>
    <label>
      <input type="checkbox" checked />
      Keep tab state in sync with outer stores
    </label>
  </div>
{/snippet}

{#snippet ProfileContent()}
  <div class="tab-panel">
    <h3>Profile</h3>
    <p>Focus moves vertically because this example passes <code>orientation="vertical"</code>.</p>
    <p>Activation mode is set to manual, so the tab changes only after pressing Enter/Space.</p>
  </div>
{/snippet}

{#snippet SecurityContent()}
  <div class="tab-panel">
    <h3>Security</h3>
    <p>Use this tab to demonstrate keyboard interactions with manual activation.</p>
    <ol>
      <li>Arrow keys focus items without triggering content changes.</li>
      <li>Press Enter to run <code>onTabChange</code>.</li>
    </ol>
  </div>
{/snippet}

{#snippet NotificationContent()}
  <div class="tab-panel">
    <h3>Notifications</h3>
    <p>This tab is disabled to prove disabled states integrate with the component.</p>
  </div>
{/snippet}

{#snippet BillingContent()}
  <div class="tab-panel">
    <h3>Billing</h3>
    <p>Even though another tab is disabled, roving focus skips over it correctly.</p>
  </div>
{/snippet}

<style>
  .tabs-page {
    max-width: 960px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  header {
    text-align: center;
  }

  header p {
    color: var(--gr-semantic-foreground-secondary);
  }

  section {
    padding: 2rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
    background: var(--gr-semantic-background-primary);
    box-shadow: 0 8px 24px rgb(15 23 42 / 0.07);
  }

  section + section {
    margin-top: 1rem;
  }

  .note {
    margin: 0 0 1rem;
    color: var(--gr-semantic-foreground-secondary);
  }

  .tab-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .pill-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .pill-row span {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: var(--gr-semantic-background-secondary);
    font-size: var(--gr-typography-fontSize-sm);
  }
</style>
