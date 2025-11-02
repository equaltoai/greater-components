<!--
  Test Component: Greater Components Primitives with client:only
  
  This demonstrates that Greater Components work perfectly with
  client-side only rendering (no SSR required).
-->
<script lang="ts">
  import { Button, TextField, Checkbox, Switch } from '@equaltoai/greater-components-primitives';
  
  // Svelte 5 runes - client-side reactive state
  let username = $state('');
  let email = $state('');
  let agreeToTerms = $state(false);
  let enableNotifications = $state(true);
  let submitting = $state(false);
  let submitCount = $state(0);
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    submitCount++;
    submitting = false;
    
    console.log('Form submitted!', { 
      username, 
      email, 
      agreeToTerms, 
      enableNotifications 
    });
  }
</script>

<div class="test-container">
  <h1>Greater Components - Client-Only Test</h1>
  
  <div class="status-badge">
    <span class="badge success">✅ CLIENT-SIDE RENDERING</span>
    <span class="badge info">🚀 NO SSR REQUIRED</span>
  </div>
  
  <div class="info-box">
    <h3>🎯 What This Proves:</h3>
    <ul>
      <li>✅ Greater Components work with <code>client:only</code></li>
      <li>✅ Svelte 5 runes work in browser-only mode</li>
      <li>✅ Form inputs are fully reactive</li>
      <li>✅ Components hydrate and function correctly</li>
      <li>✅ Perfect for static deployments (S3/CloudFront)</li>
    </ul>
  </div>

  <form onsubmit={handleSubmit} class="demo-form">
    <h2>Interactive Form Demo</h2>
    
    <div class="form-group">
      <TextField
        id="username"
        type="text"
        label="Username"
        bind:value={username}
        placeholder="Enter your username"
        disabled={submitting}
        required
      />
      <small>Current value: <code>{username || '(empty)'}</code></small>
    </div>
    
    <div class="form-group">
      <TextField
        id="email"
        type="email"
        label="Email Address"
        bind:value={email}
        placeholder="you@example.com"
        disabled={submitting}
        required
      />
      <small>Current value: <code>{email || '(empty)'}</code></small>
    </div>
    
    <div class="form-group">
      <Checkbox
        id="terms"
        bind:checked={agreeToTerms}
        disabled={submitting}
      >
        I agree to the terms and conditions
      </Checkbox>
    </div>
    
    <div class="form-group">
      <Switch
        id="notifications"
        bind:checked={enableNotifications}
        disabled={submitting}
      >
        Enable email notifications
      </Switch>
    </div>
    
    <div class="button-group">
      <Button
        type="submit"
        variant="solid"
        disabled={!username || !email || !agreeToTerms || submitting}
      >
        {#if submitting}
          Submitting...
        {:else}
          Submit Form
        {/if}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        onclick={() => {
          username = '';
          email = '';
          agreeToTerms = false;
          enableNotifications = true;
        }}
        disabled={submitting}
      >
        Reset
      </Button>
    </div>
    
    {#if submitCount > 0}
      <div class="success-message">
        ✅ Form submitted successfully {submitCount} time{submitCount > 1 ? 's' : ''}!
      </div>
    {/if}
  </form>
  
  <div class="state-display">
    <h3>📊 Live State (Reactive)</h3>
    <pre><code>{JSON.stringify({
      username,
      email,
      agreeToTerms,
      enableNotifications,
      submitCount
    }, null, 2)}</code></pre>
  </div>
  
  <div class="tech-info">
    <h3>🔧 Technical Details</h3>
    <ul>
      <li><strong>Rendering:</strong> Client-side only (no SSR)</li>
      <li><strong>Hydration:</strong> Astro island with <code>client:only="svelte"</code></li>
      <li><strong>Reactivity:</strong> Svelte 5 runes (<code>$state</code>)</li>
      <li><strong>Components:</strong> @equaltoai/greater-components-primitives</li>
      <li><strong>Deployment:</strong> Static files (perfect for S3/CloudFront)</li>
    </ul>
  </div>
</div>

<style>
  .test-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  h1 {
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: #374151;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: #4b5563;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .status-badge {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .badge {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .badge.success {
    background: #dcfce7;
    color: #166534;
  }
  
  .badge.info {
    background: #dbeafe;
    color: #1e40af;
  }
  
  .info-box {
    background: #f0f9ff;
    border: 2px solid #3b82f6;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .info-box h3 {
    margin-top: 0;
    color: #1e40af;
  }
  
  .info-box ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  .info-box li {
    margin: 0.5rem 0;
    color: #1e3a8a;
  }
  
  .demo-form {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group small {
    display: block;
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .form-group small code {
    background: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: monospace;
    color: #1f2937;
  }
  
  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .success-message {
    margin-top: 1rem;
    padding: 1rem;
    background: #dcfce7;
    color: #166534;
    border-radius: 0.375rem;
    font-weight: 600;
  }
  
  .state-display {
    background: #1f2937;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .state-display h3 {
    color: white;
    margin-top: 0;
  }
  
  .state-display pre {
    margin: 0;
    overflow-x: auto;
  }
  
  .state-display code {
    color: #34d399;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 0.875rem;
  }
  
  .tech-info {
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }
  
  .tech-info h3 {
    margin-top: 0;
    color: #92400e;
  }
  
  .tech-info ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  .tech-info li {
    margin: 0.5rem 0;
    color: #78350f;
  }
  
  .tech-info code {
    background: #fef3c7;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: monospace;
    color: #92400e;
    font-weight: 600;
  }
</style>

