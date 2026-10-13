import type { Meta, StoryObj } from '@storybook/react-vite';
import PolicyIssuancePrototype from './index.js';

const meta = {
  title: 'Legacy/Prototypes/Policy Issuance/Selection',
  component: PolicyIssuancePrototype,
  parameters: {
    fullscreenPrototype: true,
    layout: 'fullscreen'
  }
} satisfies Meta<typeof PolicyIssuancePrototype>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SelectionPropertyAndFinance: Story = {
  args: {
    defaultCategory: 'property'
  }
};

export const SelectionHealth: Story = {
  args: {
    defaultCategory: 'health'
  }
};

export const SelectionWork: Story = {
  args: {
    defaultCategory: 'work'
  }
};

export const SelectionTravel: Story = {
  args: {
    defaultCategory: 'travel'
  }
};

export const SelectionAnimals: Story = {
  args: {
    defaultCategory: 'animals'
  }
};

export const SelectionKids: Story = {
  args: {
    defaultCategory: 'kids'
  }
};
