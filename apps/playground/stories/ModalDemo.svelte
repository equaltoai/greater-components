<script lang="ts">
  import { Modal, Button, TextField } from '@greater/primitives';
  
  interface Props {
    variant?: 'basic' | 'form' | 'confirmation' | 'long' | 'sizes' | 'custom';
  }
  
  let { variant = 'basic' }: Props = $props();
  
  let basicOpen = $state(false);
  let formOpen = $state(false);
  let confirmOpen = $state(false);
  let longOpen = $state(false);
  let customOpen = $state(false);
  
  // Size modals
  let smOpen = $state(false);
  let mdOpen = $state(false);
  let lgOpen = $state(false);
  let xlOpen = $state(false);
  let fullOpen = $state(false);
  
  // Form data
  let name = $state('');
  let email = $state('');
  let message = $state('');
  
  function handleFormSubmit() {
    alert(`Form submitted!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    formOpen = false;
    // Reset form
    name = '';
    email = '';
    message = '';
  }
  
  function handleConfirmation() {
    alert('Action confirmed!');
    confirmOpen = false;
  }
</script>

<div class="modal-demo">
  {#if variant === 'basic'}
    <div class="demo-section">
      <h3>Basic Modal</h3>
      <Button onclick={() => basicOpen = true}>Open Basic Modal</Button>
      
      <Modal bind:open={basicOpen} title="Welcome">
        <p>This is a basic modal with a title and some content. You can close it by clicking the X button, pressing Escape, or clicking outside the modal.</p>
        <p>The modal automatically manages focus and prevents scrolling of the background content.</p>
      </Modal>
    </div>
  {/if}

  {#if variant === 'form'}
    <div class="demo-section">
      <h3>Modal with Form</h3>
      <Button onclick={() => formOpen = true}>Open Contact Form</Button>
      
      <Modal bind:open={formOpen} title="Contact Us" size="md">
        <form class="modal-form" onsubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
          <TextField 
            label="Full Name"
            bind:value={name}
            placeholder="Enter your name"
            required
          />
          
          <TextField 
            label="Email Address"
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            required
          />
          
          <TextField 
            label="Message"
            bind:value={message}
            placeholder="What would you like to tell us?"
            required
          />
        </form>
        
        {#snippet footer()}
          <div class="modal-actions">
            <Button variant="ghost" onclick={() => formOpen = false}>
              Cancel
            </Button>
            <Button onclick={handleFormSubmit} disabled={!name || !email || !message}>
              Send Message
            </Button>
          </div>
        {/snippet}
      </Modal>
    </div>
  {/if}

  {#if variant === 'confirmation'}
    <div class="demo-section">
      <h3>Confirmation Modal</h3>
      <Button variant="outline" onclick={() => confirmOpen = true}>
        Delete Account
      </Button>
      
      <Modal bind:open={confirmOpen} title="Confirm Account Deletion" size="sm">
        <div class="confirmation-content">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p><strong>All your data will be permanently lost.</strong></p>
        </div>
        
        {#snippet footer()}
          <div class="modal-actions">
            <Button variant="ghost" onclick={() => confirmOpen = false}>
              Cancel
            </Button>
            <Button variant="solid" onclick={handleConfirmation} 
              style="background: var(--gr-semantic-action-error-default);">
              Delete Account
            </Button>
          </div>
        {/snippet}
      </Modal>
    </div>
  {/if}

  {#if variant === 'long'}
    <div class="demo-section">
      <h3>Long Content Modal</h3>
      <Button onclick={() => longOpen = true}>Open Long Content</Button>
      
      <Modal bind:open={longOpen} title="Terms of Service" size="lg">
        <div class="long-content">
          <h4>1. Acceptance of Terms</h4>
          <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h4>2. Use License</h4>
          <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on our website;</li>
            <li>remove any copyright or other proprietary notations from the materials.</li>
          </ul>
          
          <h4>3. Disclaimer</h4>
          <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h4>4. Limitations</h4>
          <p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
          
          <h4>5. Accuracy of Materials</h4>
          <p>The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice. However, we do not make any commitment to update the materials.</p>
        </div>
        
        {#snippet footer()}
          <div class="modal-actions">
            <Button variant="outline" onclick={() => longOpen = false}>
              Decline
            </Button>
            <Button onclick={() => longOpen = false}>
              Accept Terms
            </Button>
          </div>
        {/snippet}
      </Modal>
    </div>
  {/if}

  {#if variant === 'sizes'}
    <div class="demo-section">
      <h3>Different Sizes</h3>
      <div class="size-buttons">
        <Button size="sm" onclick={() => smOpen = true}>Small</Button>
        <Button size="sm" onclick={() => mdOpen = true}>Medium</Button>
        <Button size="sm" onclick={() => lgOpen = true}>Large</Button>
        <Button size="sm" onclick={() => xlOpen = true}>Extra Large</Button>
        <Button size="sm" onclick={() => fullOpen = true}>Full Screen</Button>
      </div>
      
      <!-- Size modals -->
      <Modal bind:open={smOpen} title="Small Modal" size="sm">
        <p>This is a small modal. Perfect for simple confirmations or brief messages.</p>
      </Modal>
      
      <Modal bind:open={mdOpen} title="Medium Modal" size="md">
        <p>This is a medium modal. Good for forms and moderate amounts of content.</p>
      </Modal>
      
      <Modal bind:open={lgOpen} title="Large Modal" size="lg">
        <p>This is a large modal. Suitable for detailed content, complex forms, or data tables.</p>
      </Modal>
      
      <Modal bind:open={xlOpen} title="Extra Large Modal" size="xl">
        <p>This is an extra large modal. Use for rich content experiences, media galleries, or complex interfaces.</p>
      </Modal>
      
      <Modal bind:open={fullOpen} title="Full Screen Modal" size="full">
        <p>This is a full screen modal. Takes up the entire viewport with small margins. Perfect for immersive experiences or detailed workflows.</p>
      </Modal>
    </div>
  {/if}

  {#if variant === 'custom'}
    <div class="demo-section">
      <h3>Custom Header</h3>
      <Button onclick={() => customOpen = true}>Open Custom Modal</Button>
      
      <Modal bind:open={customOpen} size="md">
        {#snippet header()}
          <div class="custom-header">
            <div class="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="header-text">
              <h2>Featured Content</h2>
              <p>This modal has a custom header with an icon</p>
            </div>
          </div>
        {/snippet}
        
        <div class="custom-content">
          <p>This modal demonstrates how you can customize the header using the header snippet. You can include icons, subtitles, or any other content you need.</p>
          <p>The close button is automatically added to custom headers as well.</p>
        </div>
        
        {#snippet footer()}
          <div class="modal-actions">
            <Button onclick={() => customOpen = false}>
              Got it!
            </Button>
          </div>
        {/snippet}
      </Modal>
    </div>
  {/if}
</div>

<style>
  .modal-demo {
    padding: 2rem;
    font-family: var(--gr-typography-fontFamily-sans);
  }

  .demo-section {
    margin-bottom: 2rem;
  }

  .demo-section h3 {
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
    margin-bottom: 1rem;
    color: var(--gr-semantic-foreground-primary);
  }

  .size-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .confirmation-content {
    text-align: center;
  }

  .confirmation-content strong {
    color: var(--gr-semantic-action-error-default);
  }

  .long-content h4 {
    font-size: var(--gr-typography-fontSize-base);
    font-weight: var(--gr-typography-fontWeight-semibold);
    margin: 1.5rem 0 0.5rem 0;
    color: var(--gr-semantic-foreground-primary);
  }

  .long-content h4:first-child {
    margin-top: 0;
  }

  .long-content p {
    margin-bottom: 1rem;
    line-height: var(--gr-typography-lineHeight-relaxed);
  }

  .long-content ul {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  .long-content li {
    margin-bottom: 0.5rem;
    line-height: var(--gr-typography-lineHeight-normal);
  }

  .custom-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-icon {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gr-semantic-action-primary-default);
    color: white;
    border-radius: var(--gr-radii-full);
    flex-shrink: 0;
  }

  .header-text h2 {
    margin: 0;
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
  }

  .header-text p {
    margin: 0.25rem 0 0 0;
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-secondary);
  }

  .custom-content {
    padding: 1rem 0;
  }
</style>