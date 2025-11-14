<script lang="ts">
  import DemoPage from '$lib/components/DemoPage.svelte';
  import CodeExample from '$lib/components/CodeExample.svelte';
  import { Avatar, Skeleton, Button, Modal, Tabs, Tooltip } from '@equaltoai/greater-components-primitives';
  import type { DemoPageData } from '$lib/types/demo';
  import type { Snippet } from 'svelte';

  let { data }: { data: DemoPageData } = $props();

  type TabConfig = { id: string; label: string; disabled?: boolean; content: Snippet };

  const horizontalTabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', content: OverviewPanel },
    { id: 'activity', label: 'Activity', content: ActivityPanel },
    { id: 'billing', label: 'Billing', content: BillingPanel }
  ];

  const verticalTabs: TabConfig[] = [
    { id: 'preferences', label: 'Preferences', content: PreferencesPanel },
    { id: 'keys', label: 'API Keys', content: KeysPanel },
    { id: 'logs', label: 'Audit Logs', disabled: true, content: LogsPanel },
    { id: 'access', label: 'Access', content: AccessPanel }
  ];

  let horizontalActive = $state(horizontalTabs[0].id);
  let verticalActive = $state(verticalTabs[0].id);

  function handleHorizontalChange(id: string) {
    horizontalActive = id;
  }

  function handleVerticalChange(id: string) {
    verticalActive = id;
  }

const statusCycle = ['online', 'away', 'busy', 'offline'] as const;
type Presence = (typeof statusCycle)[number];
let presence = $state<Presence>('online');
const skeletonPlaceholders = Array.from({ length: 3 }, (_, index) => index);

  function cyclePresence() {
    const nextIndex = (statusCycle.indexOf(presence) + 1) % statusCycle.length;
    presence = statusCycle[nextIndex];
  }

  const avatarSnippet = `
<div class="avatar-grid">
  <Avatar src="https://i.pravatar.cc/120?img=11" alt="Nina Briggs" size="lg" status="online" />
  <Avatar name="Miles Abbott" status={presence} />
  <Avatar name="Fallback" shape="square" status="offline" />
</div>
<Button size="sm" variant="outline" onclick={cyclePresence}>
  Rotate status (current: {presence})
</Button>`;

  const skeletonSnippet = `
<div class="skeleton-card">
  <Skeleton variant="circular" width="48px" height="48px" />
  <div class="skeleton-lines">
    <Skeleton width="60%" />
    <Skeleton width="80%" />
    <Skeleton width="40%" />
  </div>
</div>`;

  let modalOpen = $state(false);
  let modalNote = $state('Awaiting confirmation');

  function recordModalAction(action: string) {
    modalNote = action;
    modalOpen = false;
  }

  const modalSnippet = `
<Button onclick={() => (modalOpen = true)}>Open review modal</Button>
<Modal bind:open={modalOpen} title="Review publication">
  <p>Dialog focus is trapped until Cancel or Publish closes it.</p>
  {#snippet footer()}
    <div class="modal-footer">
      <Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
      <Button onclick={() => recordModalAction('Published from modal')}>Publish</Button>
    </div>
  {/snippet}
</Modal>`;

  const tabsSnippet = `
const contentTabs = [
  { id: 'overview', label: 'Overview', content: OverviewPanel },
  { id: 'activity', label: 'Activity', content: ActivityPanel },
  { id: 'billing', label: 'Billing', content: BillingPanel }
];

<Tabs tabs={contentTabs} variant="underline" />
<Tabs tabs={contentTabs} orientation="vertical" activation="manual" />`;

  const tooltipSnippet = `
<Tooltip content="Hover to hear keyboard help">
  <Button variant="outline">Hover target</Button>
</Tooltip>
<Tooltip content="Click to pin instructions" trigger="click" placement="right">
  <Button>Click trigger</Button>
</Tooltip>`;
</script>

<DemoPage
  eyebrow="Component Demos"
  title={data.metadata.title}
  description={data.metadata.description}
>
  <section class="demo-section">
    <header>
      <h2>Avatar Presence</h2>
      <p>Mix photos, initials fallback, and live status indicators. The status pill reuses the same tokenized colors across variants.</p>
    </header>

    <div class="avatar-grid">
      <Avatar src="https://i.pravatar.cc/120?img=11" alt="Nina Briggs" size="lg" status="online" />
      <Avatar name="Miles Abbott" status={presence} size="md" />
      <Avatar name="Fallback" shape="square" status="offline" size="md" />
      <Avatar name="Signal" size="sm" status="busy" statusPosition="top-left" />
    </div>

    <div class="avatar-controls">
      <Button size="sm" variant="outline" onclick={cyclePresence}>
        Rotate status (current: {presence})
      </Button>
      <p class="status-callout">
        Status indicator remains visible to assistive tech via sr-only text baked into the component.
      </p>
    </div>

    <p class="a11y-tip">Tip: Tab to each avatar to confirm focus rings appear even when the component renders an image.</p>

    <CodeExample
      title="Avatar usage"
      description="Same grid powers the live example, including the status rotation button."
      code={avatarSnippet}
    />
  </section>

  <section class="demo-section">
    <header>
      <h2>Skeleton States</h2>
      <p>Rectangular, text, and circular placeholders keep layout shifts minimal while content loads.</p>
    </header>

    <div class="skeleton-list">
      {#each skeletonPlaceholders as placeholder (placeholder)}
        <div class="skeleton-card" aria-label={`Loading card ${placeholder + 1}`}>
          <Skeleton variant="circular" width="48px" height="48px" />
          <div class="skeleton-lines">
            <Skeleton width="70%" />
            <Skeleton width="55%" />
            <Skeleton width="40%" />
          </div>
        </div>
      {/each}
    </div>

    <p class="a11y-tip">Skeletons default to <code>role="status"</code>, so screen readers hear a loading announcement once.</p>

    <CodeExample
      title="Skeleton card"
      description="Use flex wrappers so inline skeletons match the eventual card layout."
      code={skeletonSnippet}
    />
  </section>

  <section class="demo-section">
    <header>
      <h2>Modal Flow</h2>
      <p>Focus trapping, ESC close, and footer actions ship out of the box. Use aria-live text nearby to report the last choice.</p>
    </header>

    <div class="modal-demo">
      <Button onclick={() => (modalOpen = true)}>Open review modal</Button>
      <p aria-live="polite" class="status-callout">{modalNote}</p>
    </div>

    <Modal bind:open={modalOpen} title="Review publication" closeOnBackdrop preventScroll>
      <p>
        This dialog demonstrates nested footer actions, ESC dismissal, and automatic focus sent back to the trigger button.
      </p>

      {#snippet footer()}
        <div class="modal-footer">
          <Button variant="ghost" onclick={() => recordModalAction('Canceled from footer')}>
            Cancel
          </Button>
          <Button onclick={() => recordModalAction('Published from modal')}>
            Publish update
          </Button>
        </div>
      {/snippet}
    </Modal>

    <p class="a11y-tip">Keyboard: focus starts on the dialog. Press Shift+Tab to verify focus loop, or ESC to close.</p>

    <CodeExample
      title="Modal pattern"
      description="Matches the live dialog including footer snippets."
      code={modalSnippet}
    />
  </section>

  <section class="demo-section">
    <header>
      <h2>Tabs Orientation</h2>
      <p>Underline tabs for horizontal navigation and manual-activation vertical tabs for settings panes.</p>
    </header>

    <Tabs
      tabs={horizontalTabs}
      activeTab={horizontalActive}
      onTabChange={handleHorizontalChange}
      variant="underline"
    />

    <Tabs
      tabs={verticalTabs}
      activeTab={verticalActive}
      orientation="vertical"
      activation="manual"
      variant="pills"
      onTabChange={handleVerticalChange}
    />

    <p class="a11y-tip">Arrow keys follow the orientation automatically. Manual activation waits for Enter/Space before switching content.</p>

    <CodeExample
      title="Tabs data"
      description="Use the same data set for horizontal and vertical layouts."
      code={tabsSnippet}
    />
  </section>

  <section class="demo-section">
    <header>
      <h2>Tooltip Triggers</h2>
      <p>Hover vs click interactions show how helpers expose placement props and custom triggers.</p>
    </header>

    <div class="tooltip-row">
      <Tooltip content="Hover to hear keyboard help">
        <Button variant="outline">Hover target</Button>
      </Tooltip>
      <Tooltip content="Click to pin instructions" trigger="click" placement="right">
        <Button>Click trigger</Button>
      </Tooltip>
    </div>

    <p class="a11y-tip">Click-triggered tooltips stay open until focus or ESC closes them—remind users with inline copy.</p>

    <CodeExample
      title="Tooltip variants"
      description="Triggers map 1:1 with Greater Tooltip props."
      code={tooltipSnippet}
    />
  </section>
</DemoPage>

{#snippet OverviewPanel()}
  <div class="tab-panel">
    <strong>Overview</strong>
    <p>Use this area for quick summaries or KPIs.</p>
  </div>
{/snippet}

{#snippet ActivityPanel()}
  <div class="tab-panel">
    <strong>Activity</strong>
    <ul>
      <li>10:12 · Exported CSV report</li>
      <li>09:48 · Updated billing address</li>
      <li>Yesterday · Invited @bay.oates</li>
    </ul>
  </div>
{/snippet}

{#snippet BillingPanel()}
  <div class="tab-panel">
    <strong>Billing</strong>
    <p>All invoices are routed through Lesser; download history from this tab.</p>
  </div>
{/snippet}

{#snippet PreferencesPanel()}
  <div class="tab-panel">
    <strong>Preferences</strong>
    <p>Great for account-level toggles such as theme or locale.</p>
  </div>
{/snippet}

{#snippet KeysPanel()}
  <div class="tab-panel">
    <strong>API Keys</strong>
    <p>Manual activation lets admins read instructions before switching tabs.</p>
  </div>
{/snippet}

{#snippet LogsPanel()}
  <div class="tab-panel">
    <strong>Audit Logs</strong>
    <p>This tab is disabled to confirm roving tabindex skips it.</p>
  </div>
{/snippet}

{#snippet AccessPanel()}
  <div class="tab-panel">
    <strong>Access</strong>
    <p>Keep access policies grouped under vertical tabs.</p>
  </div>
{/snippet}

<style>
  .demo-section {
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-xl);
    padding: 2rem;
    background: var(--gr-semantic-background-primary);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  header p {
    margin: 0.25rem 0 0;
    color: var(--gr-semantic-foreground-secondary);
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    align-items: center;
    justify-items: center;
  }

  .avatar-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .status-callout {
    margin: 0;
    color: var(--gr-semantic-foreground-secondary);
    font-size: var(--gr-typography-fontSize-sm);
  }

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .skeleton-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--gr-semantic-border-subtle);
    border-radius: var(--gr-radii-lg);
    align-items: center;
  }

  .skeleton-lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-demo {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .tooltip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .tab-panel {
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: var(--gr-semantic-foreground-secondary);
  }

  .a11y-tip {
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-secondary);
    margin: 0;
  }

  @media (max-width: 640px) {
    .demo-section {
      padding: 1.5rem;
    }
  }
</style>
