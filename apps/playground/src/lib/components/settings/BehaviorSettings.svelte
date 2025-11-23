<script>
  import { SettingsSection, SettingsToggle, SettingsSelect } from '@equaltoai/greater-components-primitives';
  
  let autoplay = $state(true);
  let infiniteScroll = $state(true);
  let openLinksInNewTab = $state(true);
  let imageQuality = $state('auto');
</script>

<SettingsSection title="Media & Behavior" description="Control how content behaves">
  <SettingsToggle
    label="Autoplay Videos"
    description="Automatically play videos when they appear in the timeline"
    bind:value={autoplay}
  />
  
  <SettingsToggle
    label="Infinite Scroll"
    description="Automatically load more posts when scrolling to the bottom"
    bind:value={infiniteScroll}
  />
  
  <SettingsToggle
    label="Open Links in New Tab"
    description="Open external links in a new browser tab"
    bind:value={openLinksInNewTab}
  />
  
  <SettingsSelect
    label="Image Quality"
    description="Select preferred image quality"
    bind:value={imageQuality}
    options={[
      { value: 'auto', label: 'Automatic' },
      { value: 'low', label: 'Low (Data Saver)' },
      { value: 'high', label: 'High Quality' },
    ]}
  />
</SettingsSection>
