<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  
  interface Props extends Omit<HTMLInputAttributes, 'type' | 'value'> {
    label?: string;
    value?: string;
    type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
    placeholder?: string;
    invalid?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    helpText?: string;
    errorMessage?: string;
    class?: string;
    inputClass?: string;
    prefix?: Snippet;
    suffix?: Snippet;
  }
  
  let {
    label,
    value = $bindable(''),
    type = 'text',
    placeholder,
    invalid = false,
    disabled = false,
    readonly = false,
    required = false,
    helpText,
    errorMessage,
    class: className = '',
    inputClass = '',
    prefix,
    suffix,
    id,
    onblur,
    onfocus,
    oninput,
    onkeydown,
    ...restProps
  }: Props = $props();

  // Generate unique ID for accessibility
  const fieldId = $derived(id || `gr-textfield-${Math.random().toString(36).substr(2, 9)}`);
  const helpTextId = $derived(`${fieldId}-help`);
  const errorId = $derived(`${fieldId}-error`);

  let focused = $state(false);
  let hasValue = $derived(Boolean(value));

  // Compute field classes
  const fieldClass = $derived(() => {
    const classes = [
      'gr-textfield',
      focused && 'gr-textfield--focused',
      invalid && 'gr-textfield--invalid',
      disabled && 'gr-textfield--disabled',
      readonly && 'gr-textfield--readonly',
      hasValue && 'gr-textfield--has-value',
      className
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  const inputClasses = $derived(() => {
    const classes = [
      'gr-textfield__input',
      inputClass
    ].filter(Boolean).join(' ');
    
    return classes;
  });

  function handleFocus(event: FocusEvent) {
    focused = true;
    onfocus?.(event);
  }

  function handleBlur(event: FocusEvent) {
    focused = false;
    onblur?.(event);
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    oninput?.(event);
  }

  function handleKeydown(event: KeyboardEvent) {
    onkeydown?.(event);
  }
</script>

<div class={fieldClass()}>
  {#if label}
    <label
      for={fieldId}
      class="gr-textfield__label"
      class:gr-textfield__label--required={required}
    >
      {label}
      {#if required}
        <span class="gr-textfield__required" aria-hidden="true">*</span>
      {/if}
    </label>
  {/if}

  <div class="gr-textfield__container">
    {#if prefix}
      <div class="gr-textfield__prefix" aria-hidden="true">
        {@render prefix()}
      </div>
    {/if}

    <input
      {type}
      id={fieldId}
      class={inputClasses()}
      {placeholder}
      bind:value
      {disabled}
      {readonly}
      {required}
      aria-invalid={invalid}
      aria-describedby={[
        helpText ? helpTextId : null,
        errorMessage && invalid ? errorId : null
      ].filter(Boolean).join(' ') || undefined}
      onfocus={handleFocus}
      onblur={handleBlur}
      oninput={handleInput}
      onkeydown={handleKeydown}
      {...restProps}
    />

    {#if suffix}
      <div class="gr-textfield__suffix" aria-hidden="true">
        {@render suffix()}
      </div>
    {/if}
  </div>

  {#if helpText && !invalid}
    <div id={helpTextId} class="gr-textfield__help">
      {helpText}
    </div>
  {/if}

  {#if errorMessage && invalid}
    <div
      id={errorId}
      class="gr-textfield__error"
      role="alert"
      aria-live="polite"
    >
      {errorMessage}
    </div>
  {/if}
</div>

<style>
  :global {
    .gr-textfield {
      display: flex;
      flex-direction: column;
      gap: var(--gr-spacing-scale-1);
      font-family: var(--gr-typography-fontFamily-sans);
    }

    .gr-textfield__label {
      font-size: var(--gr-typography-fontSize-sm);
      font-weight: var(--gr-typography-fontWeight-medium);
      color: var(--gr-semantic-foreground-primary);
      line-height: var(--gr-typography-lineHeight-tight);
    }

    .gr-textfield__label--required {
      display: flex;
      align-items: center;
      gap: var(--gr-spacing-scale-1);
    }

    .gr-textfield__required {
      color: var(--gr-semantic-action-error-default);
    }

    .gr-textfield__container {
      position: relative;
      display: flex;
      align-items: center;
      background-color: var(--gr-semantic-background-primary);
      border: 1px solid var(--gr-semantic-border-default);
      border-radius: var(--gr-radii-md);
      transition: border-color var(--gr-motion-duration-fast) var(--gr-motion-easing-out),
                  box-shadow var(--gr-motion-duration-fast) var(--gr-motion-easing-out);
    }

    .gr-textfield__container:hover:not(.gr-textfield--disabled .gr-textfield__container) {
      border-color: var(--gr-semantic-border-strong);
    }

    .gr-textfield--focused .gr-textfield__container {
      border-color: var(--gr-semantic-action-primary-default);
      box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
    }

    .gr-textfield--invalid .gr-textfield__container {
      border-color: var(--gr-semantic-action-error-default);
    }

    .gr-textfield--invalid.gr-textfield--focused .gr-textfield__container {
      box-shadow: 0 0 0 2px var(--gr-semantic-action-error-default);
    }

    .gr-textfield--disabled .gr-textfield__container {
      background-color: var(--gr-semantic-background-secondary);
      border-color: var(--gr-semantic-border-subtle);
      opacity: 0.6;
    }

    .gr-textfield--readonly .gr-textfield__container {
      background-color: var(--gr-semantic-background-secondary);
    }

    .gr-textfield__input {
      flex: 1;
      padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
      font-size: var(--gr-typography-fontSize-base);
      line-height: var(--gr-typography-lineHeight-normal);
      color: var(--gr-semantic-foreground-primary);
      background: transparent;
      border: none;
      outline: none;
      min-height: 2.5rem;
    }

    .gr-textfield__input::placeholder {
      color: var(--gr-semantic-foreground-tertiary);
    }

    .gr-textfield__input:disabled {
      cursor: not-allowed;
      color: var(--gr-semantic-foreground-disabled);
    }

    .gr-textfield__input:readonly {
      cursor: default;
    }

    .gr-textfield__prefix,
    .gr-textfield__suffix {
      display: flex;
      align-items: center;
      color: var(--gr-semantic-foreground-secondary);
      flex-shrink: 0;
    }

    .gr-textfield__prefix {
      padding-left: var(--gr-spacing-scale-4);
      padding-right: var(--gr-spacing-scale-2);
    }

    .gr-textfield__suffix {
      padding-left: var(--gr-spacing-scale-2);
      padding-right: var(--gr-spacing-scale-4);
    }

    .gr-textfield__help {
      font-size: var(--gr-typography-fontSize-sm);
      color: var(--gr-semantic-foreground-secondary);
      line-height: var(--gr-typography-lineHeight-normal);
    }

    .gr-textfield__error {
      font-size: var(--gr-typography-fontSize-sm);
      color: var(--gr-semantic-action-error-default);
      line-height: var(--gr-typography-lineHeight-normal);
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .gr-textfield__container {
        transition: none;
      }
    }
  }
</style>