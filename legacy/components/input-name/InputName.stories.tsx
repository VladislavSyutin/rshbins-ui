import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LegacyInputNameProps } from './index.js';
import InputName from './index.js';

const meta = {
  title: 'Legacy/Components/InputName',
  component: InputName,
  tags: ['autodocs'],
  args: {
    clearable: true,
    dataId: 'legacy-input-name',
    helperText: 'Обязательно для заполнения',
    invalid: false,
    label: 'Имя'
  }
} satisfies Meta<typeof InputName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: LegacyInputNameProps) => (
    <div style={surfaceStyle}>
      <InputName {...args} />
    </div>
  )
};

export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={surfaceStyle}>
      <div style={matrixStyle}>
        <InputName dataId="input-name-empty" />
        <InputName dataId="input-name-entered" value="Иван" />
        <InputName dataId="input-name-error" helperText="Обязательно для заполнения" invalid />
        <InputName dataId="input-name-disabled" disabled value="Иван" />
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
      <InputName dataId="input-name-controlled" onValueChange={setValue} value={value} />
    </div>
  );
}

const surfaceStyle = { background: 'var(--color-background-default-primary)', minHeight: 240, padding: 32 };
const matrixStyle = { display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 361px))' };
