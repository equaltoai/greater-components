import type { Meta, StoryObj } from '@storybook/svelte';
import TokensShowcase from './TokensShowcase.svelte';

const meta: Meta<TokensShowcase> = {
  title: 'Foundation/Tokens',
  component: TokensShowcase,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The design tokens system provides a consistent foundation for all Greater Components. 
Tokens are organized by category (color, typography, spacing, etc.) and support multiple themes.

## Usage

\`\`\`css
/* Use CSS custom properties directly */
.my-component {
  color: var(--gr-semantic-foreground-primary);
  background: var(--gr-semantic-background-primary);
  padding: var(--gr-spacing-scale-4);
  border-radius: var(--gr-radii-md);
}
\`\`\`

\`\`\`typescript
// Import token helper functions
import { getColor, getSpacing } from '@greater/tokens';

const primaryColor = getColor('primary.500');
const mediumSpacing = getSpacing('4');
\`\`\`

## Themes

Switch between light, dark, and high-contrast themes using the theme selector above.
`
      }
    }
  }
};

export default meta;
type Story = StoryObj<TokensShowcase>;

export const Colors: Story = {
  args: {
    category: 'colors'
  }
};

export const Typography: Story = {
  args: {
    category: 'typography'
  }
};

export const Spacing: Story = {
  args: {
    category: 'spacing'
  }
};

export const AllTokens: Story = {
  args: {
    category: 'all'
  }
};