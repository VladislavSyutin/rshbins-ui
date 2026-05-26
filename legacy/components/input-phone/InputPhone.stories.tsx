import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputPhoneProps } from './index.js';
import InputPhone from './index.js';

const meta = {
  title: 'Legacy/Components/InputPhone',
  component: InputPhone,
  tags: ['autodocs'],
  args: {
    clearable: true,
    dataId: 'legacy-input-phone',
    helperText: 'Номер телефона должен содержать 11 цифр',
    invalid: false,
    label: 'Номер телефона'
  }
} satisfies Meta<typeof InputPhone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputPhoneProps) => (
    <div style={surfaceStyle}>
      <InputPhone {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={matrixStyle}>
        <InputPhone dataId="input-phone-empty" />
        <InputPhone dataId="input-phone-entered" value="(912) 345-67-89" />
        <InputPhone dataId="input-phone-error" helperText="Номер телефона должен содержать 11 цифр" invalid />
        <InputPhone dataId="input-phone-disabled" disabled value="(912) 345-67-89" />
      </div>
    </div>
  )
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ControlledExample />
};

function ControlledExample() {
  const [value, setValue] = useState('');

  return (
    <div style={surfaceStyle}>
      <InputPhone dataId="input-phone-controlled" onValueChange={setValue} value={value} />
    </div>
  );
}

const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
