# Profile.PrivacySettings

**Component**: Profile Privacy Controls  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 32 passing tests

---

## 📋 Overview

`Profile.PrivacySettings` provides comprehensive privacy controls for user profiles in the Fediverse. It allows users to manage visibility settings, content preferences, and privacy-related configurations with a user-friendly interface.

### **Key Features**:
- ✅ Account privacy toggle (private/public)
- ✅ Follower list visibility control
- ✅ Search engine indexing preferences
- ✅ Media autoplay settings
- ✅ Sensitive content warnings
- ✅ Direct message preferences
- ✅ Mention filtering
- ✅ Real-time settings updates
- ✅ Change tracking and indicators
- ✅ Grouped settings by category

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';

  const settings = {
    isPrivate: false,
    hideFollowers: false,
    hideFollowing: false,
    noIndex: true,
    autoplayVideos: false,
    autoplayGifs: true,
    expandSpoilers: false,
    hideSensitiveMedia: true,
    requireFollowForDM: true,
    allowMentionsFromNonFollowers: true
  };

  const handlers = {
    onUpdatePrivacySettings: async (newSettings) => {
      console.log('Updating settings:', newSettings);
      // Handle update
    }
  };
</script>

<Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
  <Profile.PrivacySettings 
    {settings}
    showDescriptions={true}
    groupByCategory={true}
  />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `settings` | `PrivacySettings` | Required | Yes | Current privacy settings |
| `showDescriptions` | `boolean` | `true` | No | Show setting descriptions |
| `groupByCategory` | `boolean` | `true` | No | Group settings by category |
| `class` | `string` | `''` | No | Custom CSS class |

### **PrivacySettings Interface**

```typescript
interface PrivacySettings {
  // Account Privacy
  isPrivate: boolean;              // Require follow approval
  hideFollowers: boolean;          // Hide followers list
  hideFollowing: boolean;          // Hide following list
  noIndex: boolean;                // Exclude from search engines

  // Media & Content
  autoplayVideos: boolean;         // Autoplay videos
  autoplayGifs: boolean;           // Autoplay GIFs
  expandSpoilers: boolean;         // Auto-expand content warnings
  hideSensitiveMedia: boolean;     // Hide sensitive media by default

  // Communication
  requireFollowForDM: boolean;     // DMs from followers only
  allowMentionsFromNonFollowers: boolean; // Allow mentions from anyone
}
```

---

## 📤 Events

Handlers are accessed via `ProfileContext`:

```typescript
interface ProfileHandlers {
  onUpdatePrivacySettings?: (settings: PrivacySettings) => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Complete Privacy Settings Panel**

Full-featured privacy settings with all options:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { PrivacySettings } from '@greater/fediverse/Profile';

  let settings = $state<PrivacySettings>({
    isPrivate: false,
    hideFollowers: false,
    hideFollowing: false,
    noIndex: true,
    autoplayVideos: false,
    autoplayGifs: true,
    expandSpoilers: false,
    hideSensitiveMedia: true,
    requireFollowForDM: true,
    allowMentionsFromNonFollowers: true
  });

  let saving = $state(false);
  let saveStatus = $state<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handlers = {
    onUpdatePrivacySettings: async (newSettings: PrivacySettings) => {
      saving = true;
      saveStatus = 'saving';

      try {
        const response = await fetch('/api/profile/privacy', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to update settings');
        }

        const result = await response.json();
        settings = result.settings;
        saveStatus = 'success';

        // Create audit log
        await fetch('/api/audit-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'privacy_settings_updated',
            details: { changes: getDifferences(settings, newSettings) }
          }),
          credentials: 'include'
        });

        setTimeout(() => {
          saveStatus = 'idle';
        }, 3000);
      } catch (error) {
        console.error('Failed to save settings:', error);
        saveStatus = 'error';
        setTimeout(() => {
          saveStatus = 'idle';
        }, 5000);
      } finally {
        saving = false;
      }
    }
  };

  function getDifferences(oldSettings: PrivacySettings, newSettings: PrivacySettings) {
    const changes: Record<string, { from: any; to: any }> = {};
    
    for (const key in newSettings) {
      if (oldSettings[key as keyof PrivacySettings] !== newSettings[key as keyof PrivacySettings]) {
        changes[key] = {
          from: oldSettings[key as keyof PrivacySettings],
          to: newSettings[key as keyof PrivacySettings]
        };
      }
    }
    
    return changes;
  }

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };
</script>

<div class="privacy-settings-page">
  <header class="page-header">
    <h1>Privacy Settings</h1>
    <p class="page-description">
      Control who can see your content and how you interact with others
    </p>
  </header>

  {#if saveStatus !== 'idle'}
    <div 
      class="save-status {saveStatus}"
      role="status"
      aria-live="polite"
    >
      {#if saveStatus === 'saving'}
        <span class="spinner"></span>
        Saving changes...
      {:else if saveStatus === 'success'}
        <span class="icon">✓</span>
        Settings saved successfully
      {:else if saveStatus === 'error'}
        <span class="icon">✗</span>
        Failed to save settings. Please try again.
      {/if}
    </div>
  {/if}

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.PrivacySettings 
      {settings}
      showDescriptions={true}
      groupByCategory={true}
    />
  </Profile.Root>
</div>

<style>
  .privacy-settings-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    font-weight: 700;
    color: #0f1419;
  }

  .page-description {
    margin: 0;
    color: #536471;
    font-size: 1rem;
  }

  .save-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    border-radius: 0.75rem;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-1rem);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .save-status.saving {
    background: #e8f5fe;
    border: 1px solid #1d9bf0;
    color: #0d8bd9;
  }

  .save-status.success {
    background: #e8f5e9;
    border: 1px solid #4caf50;
    color: #2e7d32;
  }

  .save-status.error {
    background: #fee;
    border: 1px solid #f44336;
    color: #c00;
  }

  .spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(29, 155, 240, 0.3);
    border-top-color: #1d9bf0;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .icon {
    font-size: 1.25rem;
    font-weight: 700;
  }
</style>
```

### **Example 2: Quick Privacy Toggles**

Simplified view with just key privacy options:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { PrivacySettings } from '@greater/fediverse/Profile';

  let settings = $state<PrivacySettings>({
    isPrivate: false,
    hideFollowers: false,
    hideFollowing: false,
    noIndex: true,
    autoplayVideos: false,
    autoplayGifs: true,
    expandSpoilers: false,
    hideSensitiveMedia: true,
    requireFollowForDM: true,
    allowMentionsFromNonFollowers: true
  });

  interface QuickToggle {
    key: keyof PrivacySettings;
    label: string;
    description: string;
    icon: string;
  }

  const quickToggles: QuickToggle[] = [
    {
      key: 'isPrivate',
      label: 'Private Account',
      description: 'Require approval for new followers',
      icon: '🔒'
    },
    {
      key: 'hideFollowers',
      label: 'Hide Followers',
      description: 'Don\'t show who follows you',
      icon: '👥'
    },
    {
      key: 'noIndex',
      label: 'Search Engine Privacy',
      description: 'Opt out of search engine indexing',
      icon: '🔍'
    },
    {
      key: 'requireFollowForDM',
      label: 'DM Restrictions',
      description: 'Only accept DMs from followers',
      icon: '✉️'
    }
  ];

  async function toggleSetting(key: keyof PrivacySettings) {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };

    try {
      const response = await fetch('/api/profile/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      settings = newSettings;
    } catch (error) {
      console.error('Toggle failed:', error);
      alert('Failed to update setting');
    }
  }
</script>

<div class="quick-privacy">
  <h2>Quick Privacy Controls</h2>

  <div class="toggles-grid">
    {#each quickToggles as toggle}
      <button
        class="toggle-card"
        class:active={settings[toggle.key]}
        onclick={() => toggleSetting(toggle.key)}
        type="button"
      >
        <div class="toggle-icon">{toggle.icon}</div>
        <div class="toggle-content">
          <div class="toggle-header">
            <strong>{toggle.label}</strong>
            <div class="toggle-switch" class:on={settings[toggle.key]}>
              <div class="toggle-knob"></div>
            </div>
          </div>
          <p class="toggle-description">{toggle.description}</p>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .quick-privacy {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .quick-privacy h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .toggles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .toggle-card {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    background: white;
    border: 2px solid #eff3f4;
    border-radius: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-card:hover {
    border-color: #1d9bf0;
    box-shadow: 0 2px 8px rgba(29, 155, 240, 0.1);
  }

  .toggle-card.active {
    background: rgba(29, 155, 240, 0.05);
    border-color: #1d9bf0;
  }

  .toggle-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .toggle-content {
    flex: 1;
    min-width: 0;
  }

  .toggle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .toggle-header strong {
    font-size: 1rem;
    color: #0f1419;
  }

  .toggle-switch {
    width: 44px;
    height: 24px;
    background: #cfd9de;
    border-radius: 12px;
    position: relative;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .toggle-switch.on {
    background: #1d9bf0;
  }

  .toggle-knob {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .toggle-switch.on .toggle-knob {
    transform: translateX(20px);
  }

  .toggle-description {
    margin: 0;
    font-size: 0.875rem;
    color: #536471;
    line-height: 1.4;
  }

  @media (max-width: 640px) {
    .toggles-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### **Example 3: Privacy Impact Preview**

Show impact of privacy changes:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { PrivacySettings } from '@greater/fediverse/Profile';

  let settings = $state<PrivacySettings>({
    isPrivate: false,
    hideFollowers: false,
    hideFollowing: false,
    noIndex: true,
    autoplayVideos: false,
    autoplayGifs: true,
    expandSpoilers: false,
    hideSensitiveMedia: true,
    requireFollowForDM: true,
    allowMentionsFromNonFollowers: true
  });

  interface PrivacyImpact {
    title: string;
    impacts: string[];
  }

  const impacts = $derived<PrivacyImpact[]>(() => {
    const result: PrivacyImpact[] = [];

    if (settings.isPrivate) {
      result.push({
        title: 'Private Account',
        impacts: [
          'New followers must be approved',
          'Posts won\'t appear in public timelines',
          'Only followers can see your posts',
          'Profile visible to everyone, but content is restricted'
        ]
      });
    }

    if (settings.hideFollowers || settings.hideFollowing) {
      result.push({
        title: 'Hidden Connections',
        impacts: [
          settings.hideFollowers ? 'Followers list is hidden from others' : '',
          settings.hideFollowing ? 'Following list is hidden from others' : '',
          'You can still see your own lists',
          'Mutual connections remain private'
        ].filter(Boolean)
      });
    }

    if (settings.noIndex) {
      result.push({
        title: 'Search Engine Privacy',
        impacts: [
          'Profile excluded from search engines',
          'Posts won\'t appear in Google results',
          'Fediverse search still works',
          'Improves privacy but reduces discoverability'
        ]
      });
    }

    if (settings.requireFollowForDM) {
      result.push({
        title: 'DM Restrictions',
        impacts: [
          'Only followers can send you direct messages',
          'Non-followers must follow first',
          'Reduces unwanted messages',
          'May limit legitimate contact'
        ]
      });
    }

    return result;
  });

  function getPrivacyScore(settings: PrivacySettings): number {
    let score = 0;
    if (settings.isPrivate) score += 30;
    if (settings.hideFollowers) score += 15;
    if (settings.hideFollowing) score += 15;
    if (settings.noIndex) score += 20;
    if (settings.requireFollowForDM) score += 10;
    if (settings.hideSensitiveMedia) score += 5;
    if (!settings.autoplayVideos) score += 5;
    return score;
  }

  const privacyScore = $derived(getPrivacyScore(settings));
</script>

<div class="privacy-with-impact">
  <div class="settings-panel">
    <h2>Privacy Settings</h2>
    <Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
      <Profile.PrivacySettings 
        {settings}
        showDescriptions={true}
        groupByCategory={true}
      />
    </Profile.Root>
  </div>

  <div class="impact-panel">
    <div class="privacy-score">
      <div class="score-label">Privacy Level</div>
      <div class="score-value">{privacyScore}/100</div>
      <div class="score-bar">
        <div 
          class="score-fill" 
          style="width: {privacyScore}%"
        ></div>
      </div>
      <div class="score-description">
        {#if privacyScore >= 70}
          High privacy - Your account is well protected
        {:else if privacyScore >= 40}
          Moderate privacy - Some information is public
        {:else}
          Low privacy - Most content is publicly visible
        {/if}
      </div>
    </div>

    {#if impacts.length > 0}
      <div class="impacts-list">
        <h3>What these settings mean:</h3>
        {#each impacts as impact}
          <div class="impact-section">
            <h4>{impact.title}</h4>
            <ul>
              {#each impact.impacts as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-impacts">
        <p>Your account is using default privacy settings.</p>
        <p>Enable privacy features to see their impact here.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .privacy-with-impact {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .settings-panel h2,
  .impact-panel h3 {
    margin: 0 0 1.5rem;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .impact-panel {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }

  .privacy-score {
    padding: 1.5rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .score-label {
    font-size: 0.875rem;
    color: #536471;
    margin-bottom: 0.5rem;
  }

  .score-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1d9bf0;
    margin-bottom: 1rem;
  }

  .score-bar {
    height: 8px;
    background: #eff3f4;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .score-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #1d9bf0);
    transition: width 0.3s ease;
  }

  .score-description {
    font-size: 0.875rem;
    color: #536471;
  }

  .impacts-list {
    padding: 1.5rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
  }

  .impact-section {
    margin-bottom: 1.5rem;
  }

  .impact-section:last-child {
    margin-bottom: 0;
  }

  .impact-section h4 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: #0f1419;
  }

  .impact-section ul {
    margin: 0;
    padding-left: 1.25rem;
    list-style: disc;
  }

  .impact-section li {
    margin: 0.5rem 0;
    color: #536471;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .no-impacts {
    padding: 2rem;
    text-align: center;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
  }

  .no-impacts p {
    margin: 0.5rem 0;
    color: #536471;
  }

  @media (max-width: 1024px) {
    .privacy-with-impact {
      grid-template-columns: 1fr;
    }

    .impact-panel {
      position: static;
    }
  }
</style>
```

### **Example 4: Server-Side Privacy Settings Handler**

Complete server implementation:

```typescript
// server/api/profile/privacy.ts
import { db } from '@/lib/database';
import { z } from 'zod';

const PrivacySettingsSchema = z.object({
  isPrivate: z.boolean(),
  hideFollowers: z.boolean(),
  hideFollowing: z.boolean(),
  noIndex: z.boolean(),
  autoplayVideos: z.boolean(),
  autoplayGifs: z.boolean(),
  expandSpoilers: z.boolean(),
  hideSensitiveMedia: z.boolean(),
  requireFollowForDM: z.boolean(),
  allowMentionsFromNonFollowers: z.boolean()
});

export async function GET(request: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const settings = await db.privacySettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      // Return defaults
      return new Response(
        JSON.stringify({
          settings: {
            isPrivate: false,
            hideFollowers: false,
            hideFollowing: false,
            noIndex: false,
            autoplayVideos: true,
            autoplayGifs: true,
            expandSpoilers: false,
            hideSensitiveMedia: true,
            requireFollowForDM: false,
            allowMentionsFromNonFollowers: true
          }
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ settings }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch privacy settings:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function PUT(request: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = PrivacySettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          message: 'Invalid settings',
          errors: validationResult.error.errors 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newSettings = validationResult.data;

    // Get existing settings for comparison
    const existingSettings = await db.privacySettings.findUnique({
      where: { userId }
    });

    // Update settings
    const updatedSettings = await db.privacySettings.upsert({
      where: { userId },
      update: newSettings,
      create: {
        userId,
        ...newSettings
      }
    });

    // If account privacy changed, update user record
    if (existingSettings?.isPrivate !== newSettings.isPrivate) {
      await db.users.update({
        where: { id: userId },
        data: { 
          locked: newSettings.isPrivate,
          updatedAt: new Date()
        }
      });

      // Send ActivityPub Update activity if account became private/public
      if (newSettings.isPrivate) {
        await sendAccountPrivacyUpdate(userId, true);
      } else {
        await sendAccountPrivacyUpdate(userId, false);
      }
    }

    // Track changes in audit log
    if (existingSettings) {
      const changes: Record<string, { from: any; to: any }> = {};
      
      for (const key in newSettings) {
        const k = key as keyof typeof newSettings;
        if (existingSettings[k] !== newSettings[k]) {
          changes[key] = {
            from: existingSettings[k],
            to: newSettings[k]
          };
        }
      }

      if (Object.keys(changes).length > 0) {
        await db.auditLogs.create({
          data: {
            userId,
            action: 'privacy_settings.updated',
            details: JSON.stringify({ changes }),
            timestamp: new Date(),
            ipAddress: request.headers.get('x-forwarded-for') || ''
          }
        });
      }
    }

    return new Response(
      JSON.stringify({ settings: updatedSettings }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to update privacy settings:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

async function sendAccountPrivacyUpdate(userId: string, isPrivate: boolean) {
  const user = await db.users.findUnique({
    where: { id: userId },
    include: { followers: true }
  });

  if (!user) return;

  const activity = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Update',
    actor: `https://example.com/users/${user.username}`,
    object: {
      id: `https://example.com/users/${user.username}`,
      type: 'Person',
      manuallyApprovesFollowers: isPrivate
    }
  };

  // Send to followers
  for (const follower of user.followers) {
    await sendActivityPubActivity(follower.inbox, activity, user);
  }
}
```

### **Example 5: Privacy Settings Export/Import**

Allow users to backup and restore settings:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { PrivacySettings } from '@greater/fediverse/Profile';

  let settings = $state<PrivacySettings>({
    isPrivate: false,
    hideFollowers: false,
    hideFollowing: false,
    noIndex: true,
    autoplayVideos: false,
    autoplayGifs: true,
    expandSpoilers: false,
    hideSensitiveMedia: true,
    requireFollowForDM: true,
    allowMentionsFromNonFollowers: true
  });

  function exportSettings() {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  async function importSettings(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);

      // Validate structure
      const requiredKeys: (keyof PrivacySettings)[] = [
        'isPrivate',
        'hideFollowers',
        'hideFollowing',
        'noIndex',
        'autoplayVideos',
        'autoplayGifs',
        'expandSpoilers',
        'hideSensitiveMedia',
        'requireFollowForDM',
        'allowMentionsFromNonFollowers'
      ];

      const isValid = requiredKeys.every(key => key in importedSettings);

      if (!isValid) {
        alert('Invalid settings file');
        return;
      }

      // Apply settings
      const response = await fetch('/api/profile/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importedSettings),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to import settings');
      }

      settings = importedSettings;
      alert('Settings imported successfully');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import settings');
    }
  }

  let fileInput: HTMLInputElement;
</script>

<div class="privacy-import-export">
  <h2>Privacy Settings Management</h2>

  <Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
    <Profile.PrivacySettings 
      {settings}
      showDescriptions={true}
      groupByCategory={true}
    />
  </Profile.Root>

  <div class="management-actions">
    <h3>Backup & Restore</h3>
    <p>Export your privacy settings to back them up, or import a previous backup.</p>

    <div class="actions-grid">
      <button
        class="action-button export"
        onclick={exportSettings}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
        </svg>
        Export Settings
      </button>

      <input
        type="file"
        accept="application/json"
        bind:this={fileInput}
        onchange={importSettings}
        style="display: none"
      />

      <button
        class="action-button import"
        onclick={() => fileInput.click()}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6-.67l-2.59 2.58L9 12.5l5-5 5 5-1.41 1.41L15 11.33V21h-2z"/>
        </svg>
        Import Settings
      </button>
    </div>
  </div>
</div>

<style>
  .privacy-import-export {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .privacy-import-export h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .management-actions {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
  }

  .management-actions h3 {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .management-actions > p {
    margin: 0 0 1.5rem;
    color: #536471;
    font-size: 0.875rem;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem;
    background: white;
    border: 2px solid #1d9bf0;
    border-radius: 0.5rem;
    color: #1d9bf0;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-button:hover {
    background: #1d9bf0;
    color: white;
  }

  .action-button svg {
    width: 20px;
    height: 20px;
  }
</style>
```

---

## 🔒 Security Considerations

### **Validate All Settings**

Always validate privacy settings on the server:

```typescript
const PrivacySettingsSchema = z.object({
  isPrivate: z.boolean(),
  hideFollowers: z.boolean(),
  hideFollowing: z.boolean(),
  noIndex: z.boolean(),
  autoplayVideos: z.boolean(),
  autoplayGifs: z.boolean(),
  expandSpoilers: z.boolean(),
  hideSensitiveMedia: z.boolean(),
  requireFollowForDM: z.boolean(),
  allowMentionsFromNonFollowers: z.boolean()
});
```

### **Audit Logging**

Track all privacy setting changes:

```typescript
await db.auditLogs.create({
  data: {
    userId,
    action: 'privacy_settings.updated',
    details: JSON.stringify({ changes }),
    timestamp: new Date(),
    ipAddress: request.headers.get('x-forwarded-for')
  }
});
```

### **Rate Limiting**

Prevent abuse of settings updates:

```typescript
const settingsLimit = new RateLimiter({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true
});
```

---

## 🎨 Styling

```css
.privacy-settings {
  --setting-bg: #f7f9fa;
  --setting-border: #eff3f4;
  --setting-hover: #e8f5fe;
  --toggle-off: #cfd9de;
  --toggle-on: #1d9bf0;
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Proper form structure
- ✅ **ARIA Labels**: Clear labels for toggles
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Readers**: Descriptive settings

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { PrivacySettings } from '@greater/fediverse/Profile';

describe('PrivacySettings', () => {
  it('displays all privacy settings', () => {
    const settings = {
      isPrivate: false,
      hideFollowers: false,
      hideFollowing: false,
      noIndex: true,
      autoplayVideos: false,
      autoplayGifs: true,
      expandSpoilers: false,
      hideSensitiveMedia: true,
      requireFollowForDM: true,
      allowMentionsFromNonFollowers: true
    };

    render(PrivacySettings, { props: { settings } });

    expect(screen.getByLabelText(/private account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hide followers/i)).toBeInTheDocument();
  });

  it('tracks changes correctly', async () => {
    const settings = {
      isPrivate: false,
      // ... other settings
    };

    render(PrivacySettings, { props: { settings } });

    const privateToggle = screen.getByLabelText(/private account/i);
    await fireEvent.click(privateToggle);

    // Verify change is tracked
    expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.Header](./Header.md)
- [Profile.AccountMigration](./AccountMigration.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Privacy Best Practices](../../guides/PRIVACY_BEST_PRACTICES.md)
- [GDPR Compliance Guide](../../compliance/GDPR.md)

