<script lang="ts">
  import { Tabs } from '@greater/primitives';
  import { action } from '@storybook/addon-actions';

  interface Props {
    tabs?: Array<{
      id: string;
      label: string;
      disabled?: boolean;
      content?: boolean;
    }>;
    activeTab?: string;
    orientation?: 'horizontal' | 'vertical';
    activation?: 'automatic' | 'manual';
    variant?: 'default' | 'pills' | 'underline';
    showAllVariants?: boolean;
  }

  let {
    tabs = [],
    activeTab,
    orientation = 'horizontal',
    activation = 'automatic',
    variant = 'default',
    showAllVariants = false
  }: Props = $props();

  const tabChangeAction = action('tabs/change');

  function handleTabChange(tabId: string) {
    tabChangeAction(tabId);
  }

  // Default tab data with content snippets
  const defaultTabs = [
    { 
      id: 'overview', 
      label: 'Overview',
      content: {
        render: () => `
          <div class="tab-content">
            <h3>Overview</h3>
            <p>This is the overview section with general information about the product or service.</p>
            <ul>
              <li>Easy to use interface</li>
              <li>Comprehensive feature set</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        `
      }
    },
    { 
      id: 'features', 
      label: 'Features',
      content: {
        render: () => `
          <div class="tab-content">
            <h3>Features</h3>
            <p>Explore our comprehensive feature set designed to meet your needs.</p>
            <div class="feature-grid">
              <div class="feature-item">
                <strong>Feature 1</strong>
                <p>Description of the first major feature.</p>
              </div>
              <div class="feature-item">
                <strong>Feature 2</strong>
                <p>Description of the second major feature.</p>
              </div>
              <div class="feature-item">
                <strong>Feature 3</strong>
                <p>Description of the third major feature.</p>
              </div>
            </div>
          </div>
        `
      }
    },
    { 
      id: 'pricing', 
      label: 'Pricing',
      content: {
        render: () => `
          <div class="tab-content">
            <h3>Pricing Plans</h3>
            <p>Choose the plan that best fits your needs.</p>
            <div class="pricing-grid">
              <div class="pricing-card">
                <h4>Basic</h4>
                <div class="price">$9/month</div>
                <ul>
                  <li>Up to 5 users</li>
                  <li>Basic features</li>
                  <li>Email support</li>
                </ul>
              </div>
              <div class="pricing-card featured">
                <h4>Pro</h4>
                <div class="price">$29/month</div>
                <ul>
                  <li>Up to 25 users</li>
                  <li>All features</li>
                  <li>Priority support</li>
                </ul>
              </div>
            </div>
          </div>
        `
      }
    },
    { 
      id: 'support', 
      label: 'Support',
      content: {
        render: () => `
          <div class="tab-content">
            <h3>Support Options</h3>
            <p>We're here to help you succeed with multiple support channels.</p>
            <div class="support-options">
              <div class="support-option">
                <h4>📧 Email Support</h4>
                <p>Get help via email within 24 hours</p>
              </div>
              <div class="support-option">
                <h4>💬 Live Chat</h4>
                <p>Instant help during business hours</p>
              </div>
              <div class="support-option">
                <h4>📞 Phone Support</h4>
                <p>Direct phone support for urgent issues</p>
              </div>
            </div>
          </div>
        `
      }
    }
  ];

  const userTabs = [
    { 
      id: 'profile', 
      label: 'Profile',
      content: {
        render: () => `
          <div class="tab-content">
            <h3>User Profile</h3>
            <form class="profile-form">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" value="John Doe" class="demo-input" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" value="john@example.com" class="demo-input" />
              </div>
              <div class="form-group">
                <label>Bio</label>
                <textarea class="demo-input" rows="3">Software developer passionate about creating great user experiences.</textarea>
              </div>
            </form>
          </div>
        `
      }
    },
    { 
      id: 'settings', 
      label: 'Settings',
      content: {
        render: () => `
          <div class="tab-content">
            <h3>Settings</h3>
            <div class="settings-section">
              <h4>Notifications</h4>
              <div class="setting-item">
                <label>
                  <input type="checkbox" checked /> Email notifications
                </label>
              </div>
              <div class="setting-item">
                <label>
                  <input type="checkbox" /> Push notifications
                </label>
              </div>
            </div>
            <div class="settings-section">
              <h4>Privacy</h4>
              <div class="setting-item">
                <label>
                  <input type="checkbox" checked /> Make profile public
                </label>
              </div>
              <div class="setting-item">
                <label>
                  <input type="checkbox" /> Allow search engines to index
                </label>
              </div>
            </div>
          </div>
        `
      }
    },
    { 
      id: 'notifications', 
      label: 'Notifications',
      content: {
        render: () => `
          <div class="tab-content">
            <h3>Notifications</h3>
            <div class="notifications-list">
              <div class="notification-item">
                <div class="notification-content">
                  <strong>Welcome!</strong>
                  <p>Thanks for joining our platform.</p>
                </div>
                <div class="notification-time">2 hours ago</div>
              </div>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>Profile Updated</strong>
                  <p>Your profile has been successfully updated.</p>
                </div>
                <div class="notification-time">1 day ago</div>
              </div>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>New Feature Available</strong>
                  <p>Check out the new collaboration features!</p>
                </div>
                <div class="notification-time">3 days ago</div>
              </div>
            </div>
          </div>
        `
      }
    }
  ];

  const disabledTabs = [
    { id: 'enabled1', label: 'Available', content: { render: () => '<div class="tab-content"><p>This tab is available and accessible.</p></div>' }},
    { id: 'disabled1', label: 'Disabled', disabled: true, content: { render: () => '<div class="tab-content"><p>This content should not be accessible.</p></div>' }},
    { id: 'enabled2', label: 'Also Available', content: { render: () => '<div class="tab-content"><p>This tab is also available and accessible.</p></div>' }},
    { id: 'disabled2', label: 'Also Disabled', disabled: true, content: { render: () => '<div class="tab-content"><p>This content should also not be accessible.</p></div>' }}
  ];
</script>

{#if showAllVariants}
  <div class="demo-container">
    <div class="demo-section">
      <h3>Default Style - Horizontal</h3>
      <Tabs 
        tabs={defaultTabs}
        activeTab="overview"
        orientation="horizontal"
        variant="default"
        onTabChange={handleTabChange}
      />
    </div>

    <div class="demo-section">
      <h3>Pills Style</h3>
      <Tabs 
        tabs={defaultTabs}
        activeTab="features"
        orientation="horizontal"
        variant="pills"
        onTabChange={handleTabChange}
      />
    </div>

    <div class="demo-section">
      <h3>Underline Style</h3>
      <Tabs 
        tabs={defaultTabs}
        activeTab="pricing"
        orientation="horizontal"
        variant="underline"
        onTabChange={handleTabChange}
      />
    </div>

    <div class="demo-section">
      <h3>Vertical Orientation</h3>
      <Tabs 
        tabs={userTabs}
        activeTab="profile"
        orientation="vertical"
        variant="default"
        onTabChange={handleTabChange}
      />
    </div>

    <div class="demo-section">
      <h3>With Disabled Tabs</h3>
      <Tabs 
        tabs={disabledTabs}
        activeTab="enabled1"
        orientation="horizontal"
        variant="default"
        onTabChange={handleTabChange}
      />
    </div>

    <div class="demo-section">
      <h3>Manual Activation Mode</h3>
      <p class="demo-note">Use arrow keys to focus, then Enter/Space to activate</p>
      <Tabs 
        tabs={userTabs}
        activeTab="profile"
        activation="manual"
        variant="pills"
        onTabChange={handleTabChange}
      />
    </div>
  </div>
{:else}
  <div class="demo-single">
    <Tabs 
      tabs={tabs.length > 0 ? tabs : defaultTabs}
      {activeTab}
      {orientation}
      {activation}
      {variant}
      onTabChange={handleTabChange}
    />
  </div>
{/if}

<style>
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    max-width: 1000px;
    padding: 1rem;
  }

  .demo-section {
    padding: 2rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
    background-color: var(--gr-semantic-background-primary);
  }

  .demo-section h3 {
    margin: 0 0 1.5rem 0;
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-xl);
    font-weight: var(--gr-typography-fontWeight-semibold);
  }

  .demo-single {
    padding: 2rem;
    max-width: 800px;
  }

  .demo-note {
    margin: 0 0 1rem 0;
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-sm);
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-secondary);
  }

  /* Tab content styles */
  :global(.tab-content) {
    padding: var(--gr-spacing-scale-4);
    color: var(--gr-semantic-foreground-primary);
    line-height: var(--gr-typography-lineHeight-relaxed);
  }

  :global(.tab-content h3) {
    margin: 0 0 1rem 0;
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
  }

  :global(.tab-content h4) {
    margin: 1.5rem 0 0.5rem 0;
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-md);
    font-weight: var(--gr-typography-fontWeight-medium);
  }

  :global(.tab-content p) {
    margin: 0 0 1rem 0;
    color: var(--gr-semantic-foreground-secondary);
  }

  :global(.tab-content ul) {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  :global(.tab-content li) {
    margin: 0.25rem 0;
    color: var(--gr-semantic-foreground-secondary);
  }

  /* Feature grid */
  :global(.feature-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  :global(.feature-item) {
    padding: 1rem;
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-md);
  }

  :global(.feature-item strong) {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--gr-semantic-foreground-primary);
  }

  /* Pricing grid */
  :global(.pricing-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  :global(.pricing-card) {
    padding: 1.5rem;
    background-color: var(--gr-semantic-background-secondary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
    text-align: center;
  }

  :global(.pricing-card.featured) {
    border-color: var(--gr-semantic-action-primary-default);
    background-color: var(--gr-semantic-background-primary);
  }

  :global(.pricing-card h4) {
    margin: 0 0 1rem 0;
    font-size: var(--gr-typography-fontSize-lg);
    color: var(--gr-semantic-foreground-primary);
  }

  :global(.price) {
    font-size: var(--gr-typography-fontSize-2xl);
    font-weight: var(--gr-typography-fontWeight-bold);
    color: var(--gr-semantic-action-primary-default);
    margin-bottom: 1rem;
  }

  :global(.pricing-card ul) {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  :global(.pricing-card li) {
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--gr-semantic-border-subtle);
  }

  :global(.pricing-card li:last-child) {
    border-bottom: none;
  }

  /* Support options */
  :global(.support-options) {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
  }

  :global(.support-option) {
    padding: 1rem;
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-md);
  }

  :global(.support-option h4) {
    margin: 0 0 0.5rem 0;
    color: var(--gr-semantic-foreground-primary);
  }

  /* Profile form */
  :global(.profile-form) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
  }

  :global(.form-group) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  :global(.form-group label) {
    font-weight: var(--gr-typography-fontWeight-medium);
    color: var(--gr-semantic-foreground-primary);
    font-size: var(--gr-typography-fontSize-sm);
  }

  :global(.demo-input) {
    padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
    font-family: var(--gr-typography-fontFamily-sans);
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-primary);
    background-color: var(--gr-semantic-background-primary);
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-md);
    resize: vertical;
  }

  :global(.demo-input:focus) {
    outline: none;
    border-color: var(--gr-semantic-action-primary-default);
    box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
  }

  /* Settings */
  :global(.settings-section) {
    margin-bottom: 2rem;
  }

  :global(.setting-item) {
    margin: 0.5rem 0;
  }

  :global(.setting-item label) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: var(--gr-typography-fontSize-sm);
  }

  /* Notifications */
  :global(.notifications-list) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.notification-item) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    background-color: var(--gr-semantic-background-secondary);
    border-radius: var(--gr-radii-md);
    gap: 1rem;
  }

  :global(.notification-content strong) {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--gr-semantic-foreground-primary);
  }

  :global(.notification-time) {
    font-size: var(--gr-typography-fontSize-xs);
    color: var(--gr-semantic-foreground-tertiary);
    white-space: nowrap;
  }
</style>
