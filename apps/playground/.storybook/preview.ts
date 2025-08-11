import type { Preview } from '@storybook/svelte';
import '@greater/tokens/theme.css';
import '@greater/primitives/styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      source: {
        state: 'open'
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'var(--gr-semantic-background-primary)'
        },
        {
          name: 'dark',
          value: '#111827'
        }
      ]
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px'
          }
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px'
          }
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px'
          }
        }
      }
    },
    a11y: {
      // Comprehensive axe-core configuration for WCAG 2.1 AA compliance
      config: {
        rules: [
          // Color and contrast
          { id: 'color-contrast', enabled: true },
          { id: 'color-contrast-enhanced', enabled: true },
          
          // Keyboard navigation
          { id: 'focus-order-semantics', enabled: true },
          { id: 'tabindex', enabled: true },
          
          // Form accessibility
          { id: 'label', enabled: true },
          { id: 'label-title-only', enabled: true },
          { id: 'form-field-multiple-labels', enabled: true },
          
          // ARIA usage
          { id: 'aria-allowed-attr', enabled: true },
          { id: 'aria-allowed-role', enabled: true },
          { id: 'aria-hidden-focus', enabled: true },
          { id: 'aria-input-field-name', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-required-children', enabled: true },
          { id: 'aria-required-parent', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'aria-valid-attr', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
          
          // Semantic HTML
          { id: 'button-name', enabled: true },
          { id: 'duplicate-id', enabled: true },
          { id: 'heading-order', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'link-name', enabled: true },
          
          // Page structure
          { id: 'landmark-one-main', enabled: true },
          { id: 'page-has-heading-one', enabled: true },
          { id: 'region', enabled: true },
          { id: 'skip-link', enabled: true },
        ],
        tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      },
      options: {
        checks: { 
          'color-contrast': { options: { noScroll: true } },
          'focus-order-semantics': { options: { noScroll: true } },
        },
        restoreScroll: true,
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
      manual: true,
      disable: false,
    }
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light theme' },
          { value: 'dark', title: 'Dark theme' },
          { value: 'highContrast', title: 'High contrast theme' }
        ],
        showName: true,
        dynamicTitle: true
      }
    },
    density: {
      name: 'Density',
      description: 'Global density setting for components',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'component',
        items: [
          { value: 'compact', title: 'Compact density' },
          { value: 'comfortable', title: 'Comfortable density' },
          { value: 'spacious', title: 'Spacious density' }
        ],
        showName: true,
        dynamicTitle: true
      }
    },
    reducedMotion: {
      name: 'Motion',
      description: 'Reduced motion preference simulation',
      defaultValue: false,
      toolbar: {
        icon: 'time',
        items: [
          { value: false, title: 'Normal motion' },
          { value: true, title: 'Reduced motion' }
        ],
        showName: true,
        dynamicTitle: true
      }
    },
    focusVisible: {
      name: 'Focus',
      description: 'Enhanced focus indicators for accessibility testing',
      defaultValue: false,
      toolbar: {
        icon: 'eye',
        items: [
          { value: false, title: 'Normal focus' },
          { value: true, title: 'Enhanced focus' }
        ],
        showName: true,
        dynamicTitle: true
      }
    },
    highContrast: {
      name: 'Contrast',
      description: 'High contrast mode simulation',
      defaultValue: false,
      toolbar: {
        icon: 'contrast',
        items: [
          { value: false, title: 'Normal contrast' },
          { value: true, title: 'High contrast' }
        ],
        showName: true,
        dynamicTitle: true
      }
    }
  },
  decorators: [
    (Story, context) => {
      const { 
        theme = 'light', 
        density = 'comfortable', 
        reducedMotion = false,
        focusVisible = false,
        highContrast = false 
      } = context.globals;
      
      // Apply theme and accessibility settings to document
      if (typeof window !== 'undefined') {
        const docEl = document.documentElement;
        
        // Theme settings
        docEl.setAttribute('data-theme', theme);
        docEl.setAttribute('data-density', density);
        
        // Accessibility preferences
        if (reducedMotion) {
          docEl.style.setProperty('--animation-duration', '0.01ms');
          docEl.style.setProperty('--transition-duration', '0.01ms');
        } else {
          docEl.style.removeProperty('--animation-duration');
          docEl.style.removeProperty('--transition-duration');
        }
        
        // Enhanced focus indicators
        if (focusVisible) {
          docEl.classList.add('enhanced-focus');
        } else {
          docEl.classList.remove('enhanced-focus');
        }
        
        // High contrast mode
        if (highContrast) {
          docEl.setAttribute('data-high-contrast', 'true');
        } else {
          docEl.removeAttribute('data-high-contrast');
        }
        
        // Add story-specific test attributes
        const storyId = context.id?.replace(/--/g, '-') || 'unknown';
        docEl.setAttribute('data-story-id', storyId);
      }
      
      return Story();
    },
    
    // Accessibility testing decorator
    (Story, context) => {
      // Add wrapper with accessibility testing attributes
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-testid', `story-${context.id}`);
      wrapper.setAttribute('data-component', context.component?.name || 'unknown');
      wrapper.setAttribute('role', 'main');
      wrapper.setAttribute('aria-label', `${context.title} - ${context.name}`);
      
      const story = Story();
      
      // For Svelte components, we need to mount them properly
      if (story && typeof story.mount === 'function') {
        story.mount(wrapper);
        return { 
          Component: 'div',
          props: { 
            innerHTML: wrapper.outerHTML 
          }
        };
      }
      
      return story;
    }
  ]
};

export default preview;