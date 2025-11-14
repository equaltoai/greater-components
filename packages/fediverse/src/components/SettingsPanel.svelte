<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ThemeSwitcher } from '@equaltoai/greater-components-primitives';
  import {
    SettingsIcon as Settings,
    DropletIcon as Palette,
    EyeIcon as Eye,
    ZapIcon as Zap,
    GlobeIcon as Globe,
    ShieldIcon as Shield,
    BellIcon as Bell,
    UserIcon as User,
    HelpCircleIcon as HelpCircle,
    ChevronRightIcon as ChevronRight
  } from '@equaltoai/greater-components-icons';
  
  interface Props {
    activeSection?: string;
    showHeader?: boolean;
    onSectionChange?: (section: string) => void;
    class?: string;
    children?: Snippet;
  }
  
  let {
    activeSection = 'appearance',
    showHeader = true,
    onSectionChange,
    class: className = '',
    children
  }: Props = $props();
  
  const hasWindow = typeof window !== 'undefined';

  // State
  let currentSection = $state(activeSection);
  let isMobile = $state(false);
  let showMobileMenu = $state(false);
  
  // Check if mobile
  $effect(() => {
    if (!hasWindow) {
      isMobile = false;
      showMobileMenu = false;
      return;
    }

    const checkMobile = () => {
      isMobile = window.innerWidth < 768;
      if (!isMobile) {
        showMobileMenu = false;
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });
  
  // Settings sections
  const sections = [
    { 
      id: 'appearance', 
      label: 'Appearance', 
      icon: Palette,
      description: 'Theme, colors, and display preferences'
    },
    { 
      id: 'accessibility', 
      label: 'Accessibility', 
      icon: Eye,
      description: 'Motion, contrast, and screen reader settings'
    },
    { 
      id: 'behavior', 
      label: 'Behavior', 
      icon: Zap,
      description: 'Interaction and workflow preferences'
    },
    { 
      id: 'language', 
      label: 'Language & Region', 
      icon: Globe,
      description: 'Language, timezone, and date format'
    },
    { 
      id: 'privacy', 
      label: 'Privacy & Security', 
      icon: Shield,
      description: 'Data, visibility, and security settings'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      description: 'Alert preferences and notification filters'
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: User,
      description: 'Profile, connections, and account management'
    },
    { 
      id: 'help', 
      label: 'Help & Support', 
      icon: HelpCircle,
      description: 'Documentation, tutorials, and support'
    }
  ];
  
  function handleSectionChange(sectionId: string) {
    currentSection = sectionId;
    showMobileMenu = false;
    onSectionChange?.(sectionId);
  }
  
  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
  
  // Accessibility settings
  let enableKeyboardNav = $state(true);
  let enableScreenReaderAnnouncements = $state(true);
  let enableFocusIndicators = $state(true);
  let enableAutoplay = $state(false);
  let enableAnimatedEmoji = $state(true);
  
  // Behavior settings
  let confirmBeforeDelete = $state(true);
  let confirmBeforeBoost = $state(false);
  let autoExpandMedia = $state(false);
  let autoExpandCW = $state(false);
  let defaultPostVisibility = $state('public');
  
  // Notification settings
  let notifyFollows = $state(true);
  let notifyFavorites = $state(true);
  let notifyBoosts = $state(true);
  let notifyMentions = $state(true);
  let notifyPolls = $state(true);
  let soundEnabled = $state(false);
</script>

<div class={`gr-settings-panel ${className}`} class:gr-settings-panel--mobile={isMobile}>
  {#if showHeader}
    <header class="gr-settings-panel__header">
      <h2 class="gr-settings-panel__title">
        <Settings size={24} />
        Settings
      </h2>
      {#if isMobile}
        <button
          onclick={toggleMobileMenu}
          class="gr-settings-panel__menu-toggle"
          aria-expanded={showMobileMenu}
          aria-label="Toggle settings menu"
        >
          <ChevronRight 
            size={20} 
            class={`gr-settings-panel__menu-toggle-icon ${showMobileMenu ? 'gr-settings-panel__menu-toggle-icon--open' : ''}`}
          />
        </button>
      {/if}
    </header>
  {/if}
  
  <div class="gr-settings-panel__container">
    <nav 
      class="gr-settings-panel__nav"
      class:gr-settings-panel__nav--open={showMobileMenu}
      aria-label="Settings navigation"
    >
      <ul class="gr-settings-panel__nav-list">
        {#each sections as section (section.id)}
          {@const Icon = section.icon}
          <li>
            <button
              type="button"
              onclick={() => handleSectionChange(section.id)}
              class="gr-settings-panel__nav-item"
              class:gr-settings-panel__nav-item--active={currentSection === section.id}
              aria-current={currentSection === section.id ? 'page' : undefined}
            >
              <span class="gr-settings-panel__nav-icon">
                <Icon size={20} />
              </span>
              <div class="gr-settings-panel__nav-content">
                <span class="gr-settings-panel__nav-label">{section.label}</span>
                <span class="gr-settings-panel__nav-description">{section.description}</span>
              </div>
              <span
                class="gr-settings-panel__nav-arrow"
                class:gr-settings-panel__nav-arrow--active={currentSection === section.id}
              >
                <ChevronRight size={16} />
              </span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>
    
    <main class="gr-settings-panel__content">
      {#if currentSection === 'appearance'}
        <section class="gr-settings-panel__section">
          <h3 class="gr-settings-panel__section-title">Appearance Settings</h3>
          <div class="gr-settings-panel__section-content">
            <ThemeSwitcher showAdvanced={true} />
          </div>
        </section>
      {:else if currentSection === 'accessibility'}
        <section class="gr-settings-panel__section">
          <h3 class="gr-settings-panel__section-title">Accessibility Settings</h3>
          <div class="gr-settings-panel__section-content">
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Navigation</h4>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={enableKeyboardNav}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Enable keyboard navigation</span>
                  <span class="gr-settings-panel__toggle-description">
                    Use Tab, Arrow keys, and shortcuts to navigate
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={enableFocusIndicators}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Enhanced focus indicators</span>
                  <span class="gr-settings-panel__toggle-description">
                    Show clear visual indicators for keyboard focus
                  </span>
                </div>
              </label>
            </div>
            
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Screen Readers</h4>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={enableScreenReaderAnnouncements}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Screen reader announcements</span>
                  <span class="gr-settings-panel__toggle-description">
                    Provide live updates for screen reader users
                  </span>
                </div>
              </label>
            </div>
            
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Media</h4>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={enableAutoplay}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Autoplay videos</span>
                  <span class="gr-settings-panel__toggle-description">
                    Automatically play videos when they appear
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={enableAnimatedEmoji}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Animated emoji</span>
                  <span class="gr-settings-panel__toggle-description">
                    Show animated custom emoji
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>
      {:else if currentSection === 'behavior'}
        <section class="gr-settings-panel__section">
          <h3 class="gr-settings-panel__section-title">Behavior Settings</h3>
          <div class="gr-settings-panel__section-content">
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Confirmations</h4>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={confirmBeforeDelete}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Confirm before deleting</span>
                  <span class="gr-settings-panel__toggle-description">
                    Ask for confirmation before deleting posts
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={confirmBeforeBoost}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Confirm before boosting</span>
                  <span class="gr-settings-panel__toggle-description">
                    Ask for confirmation before boosting posts
                  </span>
                </div>
              </label>
            </div>
            
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Timeline</h4>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={autoExpandMedia}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Auto-expand media</span>
                  <span class="gr-settings-panel__toggle-description">
                    Automatically show images and videos in timeline
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={autoExpandCW}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Auto-expand content warnings</span>
                  <span class="gr-settings-panel__toggle-description">
                    Automatically show posts with content warnings
                  </span>
                </div>
              </label>
            </div>
            
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Posting</h4>
              
              <label class="gr-settings-panel__select-label">
                <span>Default post visibility</span>
                <select
                  bind:value={defaultPostVisibility}
                  class="gr-settings-panel__select"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="followers">Followers only</option>
                  <option value="direct">Direct</option>
                </select>
              </label>
            </div>
          </div>
        </section>
      {:else if currentSection === 'notifications'}
        <section class="gr-settings-panel__section">
          <h3 class="gr-settings-panel__section-title">Notification Settings</h3>
          <div class="gr-settings-panel__section-content">
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Notification Types</h4>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={notifyFollows}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">New followers</span>
                  <span class="gr-settings-panel__toggle-description">
                    Notify when someone follows you
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={notifyFavorites}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Favorites</span>
                  <span class="gr-settings-panel__toggle-description">
                    Notify when someone favorites your post
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={notifyBoosts}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Boosts</span>
                  <span class="gr-settings-panel__toggle-description">
                    Notify when someone boosts your post
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={notifyMentions}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Mentions</span>
                  <span class="gr-settings-panel__toggle-description">
                    Notify when someone mentions you
                  </span>
                </div>
              </label>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={notifyPolls}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Poll results</span>
                  <span class="gr-settings-panel__toggle-description">
                    Notify when a poll you voted in ends
                  </span>
                </div>
              </label>
            </div>
            
            <div class="gr-settings-panel__group">
              <h4 class="gr-settings-panel__group-title">Sound</h4>
              
              <label class="gr-settings-panel__toggle">
                <input
                  type="checkbox"
                  bind:checked={soundEnabled}
                  class="gr-settings-panel__toggle-input"
                />
                <div class="gr-settings-panel__toggle-content">
                  <span class="gr-settings-panel__toggle-label">Enable sound</span>
                  <span class="gr-settings-panel__toggle-description">
                    Play sound for new notifications
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>
      {:else}
        <section class="gr-settings-panel__section">
          <h3 class="gr-settings-panel__section-title">
            {sections.find(s => s.id === currentSection)?.label}
          </h3>
          <div class="gr-settings-panel__section-content">
            <p class="gr-settings-panel__placeholder">
              Settings for this section are coming soon.
            </p>
          </div>
        </section>
      {/if}
      
      {#if children}
        <div class="gr-settings-panel__custom">
          {@render children()}
        </div>
      {/if}
    </main>
  </div>
</div>

<style>
  .gr-settings-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
    font-family: var(--gr-typography-fontFamily-sans);
  }
  
  .gr-settings-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gr-spacing-scale-4);
    border-bottom: 1px solid var(--gr-semantic-border-default);
  }
  
  .gr-settings-panel__title {
    display: flex;
    align-items: center;
    gap: var(--gr-spacing-scale-2);
    margin: 0;
    font-size: calc(var(--gr-typography-fontSize-xl) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-semibold);
  }
  
  .gr-settings-panel__menu-toggle {
    display: none;
    padding: var(--gr-spacing-scale-2);
    background: transparent;
    border: none;
    color: var(--gr-semantic-foreground-primary);
    cursor: pointer;
  }
  
  .gr-settings-panel--mobile .gr-settings-panel__menu-toggle {
    display: block;
  }
  
  .gr-settings-panel__menu-toggle-icon--open {
    transform: rotate(90deg);
    transition: transform var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }
  
  .gr-settings-panel__container {
    display: grid;
    grid-template-columns: 280px 1fr;
    flex: 1;
    overflow: hidden;
  }
  
  .gr-settings-panel__nav {
    border-right: 1px solid var(--gr-semantic-border-default);
    overflow-y: auto;
    background-color: var(--gr-semantic-background-secondary);
  }
  
  .gr-settings-panel__nav-list {
    list-style: none;
    margin: 0;
    padding: var(--gr-spacing-scale-2);
  }
  
  .gr-settings-panel__nav-item {
    display: flex;
    align-items: center;
    gap: var(--gr-spacing-scale-3);
    width: 100%;
    padding: var(--gr-spacing-scale-3);
    margin-bottom: var(--gr-spacing-scale-1);
    background: transparent;
    border: none;
    border-radius: var(--gr-radii-md);
    text-align: left;
    cursor: pointer;
    transition: all var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }
  
  .gr-settings-panel__nav-item:hover {
    background-color: var(--gr-semantic-background-tertiary);
  }
  
  .gr-settings-panel__nav-item--active {
    background-color: var(--gr-semantic-action-primary-default);
    color: var(--gr-color-base-white);
  }
  
  .gr-settings-panel__nav-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  .gr-settings-panel__nav-content {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-1);
    flex: 1;
  }
  
  .gr-settings-panel__nav-label {
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-medium);
  }
  
  .gr-settings-panel__nav-description {
    font-size: calc(var(--gr-typography-fontSize-xs) * var(--gr-font-scale, 1));
    opacity: 0.8;
  }
  
  .gr-settings-panel__nav-arrow {
    flex-shrink: 0;
    opacity: 0.5;
  }
  
  .gr-settings-panel__nav-arrow--active {
    opacity: 1;
  }
  
  .gr-settings-panel__content {
    overflow-y: auto;
    padding: var(--gr-spacing-scale-6);
  }
  
  .gr-settings-panel__section {
    max-width: 800px;
  }
  
  .gr-settings-panel__section-title {
    margin: 0 0 var(--gr-spacing-scale-4) 0;
    font-size: calc(var(--gr-typography-fontSize-2xl) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-semibold);
  }
  
  .gr-settings-panel__section-content {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-6);
  }
  
  .gr-settings-panel__group {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-3);
  }
  
  .gr-settings-panel__group-title {
    margin: 0 0 var(--gr-spacing-scale-2) 0;
    font-size: calc(var(--gr-typography-fontSize-lg) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-semibold);
    color: var(--gr-semantic-foreground-primary);
  }
  
  .gr-settings-panel__toggle {
    display: flex;
    align-items: flex-start;
    gap: var(--gr-spacing-scale-3);
    padding: var(--gr-spacing-scale-3);
    background-color: var(--gr-semantic-background-secondary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    cursor: pointer;
    transition: all var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }
  
  .gr-settings-panel__toggle:hover {
    background-color: var(--gr-semantic-background-tertiary);
    border-color: var(--gr-semantic-border-strong);
  }
  
  .gr-settings-panel__toggle-input {
    margin-top: 2px;
  }
  
  .gr-settings-panel__toggle-content {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-1);
    flex: 1;
  }
  
  .gr-settings-panel__toggle-label {
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-medium);
    color: var(--gr-semantic-foreground-primary);
  }
  
  .gr-settings-panel__toggle-description {
    font-size: calc(var(--gr-typography-fontSize-sm) * var(--gr-font-scale, 1));
    color: var(--gr-semantic-foreground-secondary);
  }
  
  .gr-settings-panel__select-label {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-2);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    font-weight: var(--gr-typography-fontWeight-medium);
    color: var(--gr-semantic-foreground-primary);
  }
  
  .gr-settings-panel__select {
    padding: var(--gr-spacing-scale-3);
    background-color: var(--gr-semantic-background-primary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
    color: var(--gr-semantic-foreground-primary);
  }
  
  .gr-settings-panel__placeholder {
    padding: var(--gr-spacing-scale-8);
    text-align: center;
    color: var(--gr-semantic-foreground-tertiary);
    font-size: calc(var(--gr-typography-fontSize-base) * var(--gr-font-scale, 1));
  }
  
  .gr-settings-panel__custom {
    margin-top: var(--gr-spacing-scale-6);
    padding-top: var(--gr-spacing-scale-6);
    border-top: 1px solid var(--gr-semantic-border-default);
  }
  
  /* Mobile styles */
  @media (max-width: 768px) {
    .gr-settings-panel__container {
      grid-template-columns: 1fr;
      position: relative;
    }
    
    .gr-settings-panel__nav {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transform: translateX(-100%);
      transition: transform var(--gr-motion-duration-base) var(--gr-motion-easing-out);
      z-index: 10;
    }
    
    .gr-settings-panel__nav--open {
      transform: translateX(0);
    }
    
    .gr-settings-panel__content {
      padding: var(--gr-spacing-scale-4);
    }
  }
  
  /* High contrast support */
  @media (prefers-contrast: high) {
    .gr-settings-panel__nav-item--active {
      outline: 2px solid var(--gr-color-base-white);
      outline-offset: -2px;
    }
    
    .gr-settings-panel__toggle {
      border-width: 2px;
    }
    
    .gr-settings-panel__toggle:has(.gr-settings-panel__toggle-input:checked) {
      outline: 2px solid var(--gr-semantic-action-primary-default);
      outline-offset: 2px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .gr-settings-panel__menu-toggle-icon--open,
    .gr-settings-panel__nav-item,
    .gr-settings-panel__toggle,
    .gr-settings-panel__nav {
      transition: none;
    }
  }
</style>
