import type { Meta, StoryObj } from '@storybook/svelte';
import { TextField } from '@equaltoai/greater-components-primitives';
import TextFieldDemo from './TextFieldDemo.svelte';

const meta: Meta<TextField> = {
  title: 'Primitives/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component: `
A flexible text input component with built-in validation states and accessibility features.

## Features

- **Input Types**: text, email, password, url, tel, search
- **Validation**: Invalid state with error messages
- **Accessibility**: Proper labeling, ARIA attributes, help text association
- **Slots**: Prefix and suffix slots for icons or additional content
- **States**: normal, invalid, disabled, readonly

## Usage

\`\`\`svelte
<script>
  import { TextField } from '@equaltoai/greater-components-primitives';
  let value = '';
</script>

<TextField 
  label="Email Address"
  type="email"
  bind:value
  placeholder="Enter your email"
  helpText="We'll never share your email"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'url', 'tel', 'search']
    },
    invalid: {
      control: { type: 'boolean' }
    },
    disabled: {
      control: { type: 'boolean' }
    },
    readonly: {
      control: { type: 'boolean' }
    },
    required: {
      control: { type: 'boolean' }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<TextField>;

export const Basic: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name'
  }
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    helpText: "We'll never share your email with anyone else."
  }
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helpText: 'Must be at least 8 characters long'
  }
};

export const Invalid: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'invalid-email',
    invalid: true,
    errorMessage: 'Please enter a valid email address'
  }
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    required: true,
    placeholder: 'This field is required'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    value: 'Cannot edit this',
    disabled: true
  }
};

export const Readonly: Story = {
  args: {
    label: 'Readonly Field',
    value: 'This is readonly',
    readonly: true
  }
};

export const WithPrefixSuffix: Story = {
  render: () => ({
    Component: TextFieldDemo
  })
};

export const AllVariants: Story = {
  render: () => ({
    Component: TextFieldDemo
  }),
  args: {
    showAll: true
  }
};