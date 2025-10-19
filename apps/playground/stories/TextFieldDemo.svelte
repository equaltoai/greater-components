<script lang="ts">
  import { TextField } from '@equaltoai/greater-components-primitives';
  
  interface Props {
    showAll?: boolean;
  }
  
  let { showAll = false }: Props = $props();
  
  let basicValue = $state('');
  let emailValue = $state('user@example.com');
  let passwordValue = $state('');
  let searchValue = $state('');
  let urlValue = $state('');
  let phoneValue = $state('');
  let invalidEmail = $state('invalid-email');
  let readonlyValue = $state('This is readonly');
  
  // Validation logic
  let emailError = $state('');
  
  function validateEmail() {
    if (invalidEmail && !invalidEmail.includes('@')) {
      emailError = 'Please enter a valid email address';
      return false;
    }
    emailError = '';
    return true;
  }
  
  $effect(() => {
    validateEmail();
  });
</script>

<div class="textfield-demo">
  <section class="demo-section">
    <h3>Basic TextField</h3>
    <TextField 
      label="Full Name"
      placeholder="Enter your full name"
      bind:value={basicValue}
    />
  </section>

  <section class="demo-section">
    <h3>Input Types</h3>
    <div class="field-grid">
      <TextField 
        label="Email"
        type="email"
        placeholder="user@example.com"
        bind:value={emailValue}
        helpText="We'll never share your email"
      />
      
      <TextField 
        label="Password"
        type="password"
        placeholder="Enter password"
        bind:value={passwordValue}
        helpText="Must be at least 8 characters"
      />
      
      <TextField 
        label="Search"
        type="search"
        placeholder="Search..."
        bind:value={searchValue}
      />
      
      <TextField 
        label="Website URL"
        type="url"
        placeholder="https://example.com"
        bind:value={urlValue}
      />
      
      <TextField 
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        bind:value={phoneValue}
      />
    </div>
  </section>

  <section class="demo-section">
    <h3>With Prefix & Suffix</h3>
    <div class="field-grid">
      <TextField 
        label="Username"
        placeholder="johndoe"
      >
        {#snippet prefix()}
          <span class="prefix-text">@</span>
        {/snippet}
      </TextField>
      
      <TextField 
        label="Website"
        placeholder="mywebsite"
      >
        {#snippet suffix()}
          <span class="suffix-text">.com</span>
        {/snippet}
      </TextField>
      
      <TextField 
        label="Price"
        placeholder="0.00"
        type="number"
      >
        {#snippet prefix()}
          <span class="prefix-text">$</span>
        {/snippet}
      </TextField>
      
      <TextField 
        label="Search with Icon"
        placeholder="Type to search..."
      >
        {#snippet prefix()}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        {/snippet}
      </TextField>
    </div>
  </section>

  <section class="demo-section">
    <h3>States</h3>
    <div class="field-grid">
      <TextField 
        label="Required Field"
        placeholder="This field is required"
        required
      />
      
      <TextField 
        label="Invalid Email"
        type="email"
        bind:value={invalidEmail}
        invalid={!!emailError}
        errorMessage={emailError}
        onblur={validateEmail}
      />
      
      <TextField 
        label="Disabled Field"
        value="Cannot edit this"
        disabled
      />
      
      <TextField 
        label="Readonly Field"
        bind:value={readonlyValue}
        readonly
      />
    </div>
  </section>

  {#if showAll}
    <section class="demo-section">
      <h3>Form Example</h3>
      <form class="demo-form" onsubmit={(e) => e.preventDefault()}>
        <div class="form-row">
          <TextField 
            label="First Name"
            placeholder="John"
            required
          />
          <TextField 
            label="Last Name"
            placeholder="Doe"
            required
          />
        </div>
        
        <TextField 
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          helpText="We'll use this for important updates"
          required
        />
        
        <TextField 
          label="Company"
          placeholder="Acme Corp"
        />
        
        <TextField 
          label="Job Title"
          placeholder="Software Engineer"
        />
        
        <div class="form-actions">
          <button type="submit" class="submit-btn">
            Submit Form
          </button>
        </div>
      </form>
    </section>
  {/if}
</div>

<style>
  .textfield-demo {
    padding: 2rem;
    font-family: var(--gr-typography-fontFamily-sans);
    background: var(--gr-semantic-background-primary);
    color: var(--gr-semantic-foreground-primary);
  }

  .demo-section {
    margin-bottom: 3rem;
  }

  .demo-section h3 {
    font-size: var(--gr-typography-fontSize-lg);
    font-weight: var(--gr-typography-fontWeight-semibold);
    margin-bottom: 1rem;
    color: var(--gr-semantic-foreground-primary);
  }

  .field-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .prefix-text,
  .suffix-text {
    font-size: var(--gr-typography-fontSize-sm);
    color: var(--gr-semantic-foreground-secondary);
    font-weight: var(--gr-typography-fontWeight-medium);
  }

  .demo-form {
    padding: 2rem;
    border: 1px solid var(--gr-semantic-border-default);
    border-radius: var(--gr-radii-lg);
    background: var(--gr-semantic-background-secondary);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .demo-form > :global(.gr-textfield) {
    margin-bottom: 1.5rem;
  }

  .form-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }

  .submit-btn {
    padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-6);
    font-size: var(--gr-typography-fontSize-base);
    font-weight: var(--gr-typography-fontWeight-medium);
    background: var(--gr-semantic-action-primary-default);
    color: var(--gr-color-base-white);
    border: none;
    border-radius: var(--gr-radii-md);
    cursor: pointer;
    transition: background-color var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
  }

  .submit-btn:hover {
    background: var(--gr-semantic-action-primary-hover);
  }

  .submit-btn:focus-visible {
    outline: 2px solid var(--gr-semantic-focus-ring);
    outline-offset: 2px;
  }

  /* Mobile responsive */
  @media (max-width: 640px) {
    .field-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>